import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { FormField, formInputCls, formRow2Cls } from '@/components/feature/FormLayout';
import ConditionRuleBuilder from './components/ConditionRuleBuilder';
import {
  bindNodeMountPoint,
  createEmptyRuleExpression,
  docTypeOptions,
  fileFormatOptions,
  formatRuleExpression,
  getAttachmentConfigs,
  getAvailableMountPoints,
  getChildNodes,
  getConditionConfigs,
  getConditionFieldsForBizCode,
  getMountPoint,
  getNodeById,
  getNodePath,
  loadArchiveConfigStore,
  removeNode,
  resolveAttachmentSchema,
  saveAttachmentConfigsForNode,
  saveConditionConfigsForNode,
  setNodeEnabled,
  upsertNode,
  type AttachmentConfig,
  type ConditionConfig,
  type FunctionNode,
  type MountPoint,
  type RuleExpression,
} from '@/mocks/archiveConfigMocks';

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function ArchiveConfigPage() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const store = useMemo(() => loadArchiveConfigStore(), [tick]);
  const allNodes = store.nodes;

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('n-1-5-1-2-1');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    new Set(['n-1', 'n-1-5', 'n-1-5-1', 'n-1-5-1-2', 'n-1-4', 'n-1-4-1', 'n-1-5-4', 'n-1-5-4-1', 'n-plan', 'n-init', 'n-sporadic']),
  );
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'condition'>('general');
  const [toast, setToast] = useState('');

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState('');
  const [deleteKind, setDeleteKind] = useState<'attachment' | 'condition' | 'node'>('attachment');
  const [editConfigId, setEditConfigId] = useState<string | null>(null);
  const [editConditionId, setEditConditionId] = useState<string | null>(null);

  const [showNodeModal, setShowNodeModal] = useState(false);
  const [editNodeId, setEditNodeId] = useState<string | null>(null);
  const [nodeForm, setNodeForm] = useState({
    name: '',
    parentId: '' as string | null,
    nodeKind: 'mount' as 'folder' | 'mount',
    bizCode: '' as string,
  });

  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialContext, setTrialContext] = useState<Record<string, unknown>>({});

  const [configForm, setConfigForm] = useState<Partial<AttachmentConfig>>({
    docName: '', type: '多选', versionManaged: false, required: false,
    fileFormats: fileFormatOptions, fileSize: 50, fileSizeUnit: 'MB',
    fileCount: 10, archived: false, remark: '', templateFile: '', enabled: true,
  });

  const [conditionForm, setConditionForm] = useState<{
    conditionName: string;
    priority: number;
    expression: RuleExpression;
    attachments: AttachmentConfig[];
    status: 'enabled' | 'disabled';
  }>({
    conditionName: '',
    priority: 10,
    expression: createEmptyRuleExpression(),
    attachments: [],
    status: 'enabled',
  });

  const [copyTargetIds, setCopyTargetIds] = useState<Set<string>>(new Set());
  const [copyMode, setCopyMode] = useState<'merge' | 'overwrite'>('merge');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : null;
  const attachmentConfigs = selectedNodeId ? getAttachmentConfigs(selectedNodeId) : [];
  const conditionConfigs = selectedNodeId ? getConditionConfigs(selectedNodeId) : [];
  const canEditAttachments =
    !!selectedNode && selectedNode.nodeKind === 'mount' && !!selectedNode.bizCode && selectedNode.enabled;
  const mountPoint = selectedNode?.bizCode ? getMountPoint(selectedNode.bizCode) : undefined;
  const conditionFields = getConditionFieldsForBizCode(selectedNode?.bizCode);
  const availableMounts = getAvailableMountPoints(selectedNode?.bizCode);

  useEffect(() => {
    if (!selectedNode?.bizCode || !mountPoint) return;
    const ctx: Record<string, unknown> = {};
    mountPoint.fieldCodes.forEach((code) => {
      const def = conditionFields.find((f) => f.code === code);
      if (!def) return;
      if (def.valueType === 'boolean') ctx[code] = true;
      else if (def.valueType === 'number') ctx[code] = 0;
      else if (def.valueType === 'enum') ctx[code] = def.options?.[0] || '';
      else ctx[code] = '';
    });
    setTrialContext(ctx);
  }, [selectedNode?.bizCode, selectedNodeId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured': return 'bg-emerald-500';
      case 'partial': return 'bg-amber-400';
      default: return 'bg-slate-300';
    }
  };

  const rootNodes = useMemo(() => {
    const roots = getChildNodes(null);
    if (!searchText.trim()) return roots;
    const lower = searchText.toLowerCase();
    const matched = new Set(
      allNodes.filter((n) => n.name.toLowerCase().includes(lower)).map((n) => n.id),
    );
    // 展开匹配路径
    allNodes.forEach((n) => {
      if (!matched.has(n.id)) return;
      let pid = n.parentId;
      while (pid) {
        matched.add(pid);
        pid = allNodes.find((x) => x.id === pid)?.parentId || null;
      }
    });
    return roots.filter((n) => matched.has(n.id));
  }, [searchText, allNodes, tick]);

  const renderTreeNode = (node: FunctionNode, matchSet?: Set<string>) => {
    const children = getChildNodes(node.id).filter((c) => !matchSet || matchSet.has(c.id));
    const isExpanded = expandedKeys.has(node.id);
    const hasChildren = getChildNodes(node.id).length > 0;
    const isSelected = selectedNodeId === node.id;
    const indent = (node.level - 1) * 16;

    return (
      <div key={node.id}>
        <div
          className={`w-full flex items-center py-1.5 text-xs transition-colors group ${
            isSelected ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
          }`}
          style={{ paddingLeft: `${indent + 8}px`, paddingRight: '4px' }}
        >
          <button
            type="button"
            className="flex items-center flex-1 min-w-0 cursor-pointer"
            onClick={() => { setSelectedNodeId(node.id); setActiveTab('general'); }}
          >
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
              {hasChildren ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedKeys((prev) => {
                      const next = new Set(prev);
                      if (next.has(node.id)) next.delete(node.id);
                      else next.add(node.id);
                      return next;
                    });
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}
                  className="w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  <i className={`ri-arrow-right-s-line text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </span>
              ) : (
                <span className="w-4" />
              )}
            </div>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-0.5 ${getStatusColor(node.configStatus)}`} />
            <span className="ml-2 truncate">{node.name}</span>
            {node.bizCode && (
              <span className="ml-1.5 px-1 py-0.5 text-[10px] rounded bg-sky-50 text-sky-600 flex-shrink-0 max-w-[72px] truncate" title={node.bizCode}>
                {node.bizCode.replace(/_/g, '·').slice(0, 12)}
              </span>
            )}
          </button>
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0 pr-1">
            <button
              type="button"
              title="编辑节点"
              onClick={(e) => { e.stopPropagation(); openEditNode(node); }}
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-sky-600 cursor-pointer"
            >
              <i className="ri-edit-line text-xs" />
            </button>
            <button
              type="button"
              title="删除节点"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteKind('node');
                setShowDeleteConfirm(node.id);
              }}
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 cursor-pointer"
            >
              <i className="ri-delete-bin-line text-xs" />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>{children.map((c) => renderTreeNode(c, matchSet))}</div>
        )}
      </div>
    );
  };

  const matchSetForSearch = useMemo(() => {
    if (!searchText.trim()) return undefined;
    const lower = searchText.toLowerCase();
    const matched = new Set(
      allNodes.filter((n) => n.name.toLowerCase().includes(lower)).map((n) => n.id),
    );
    allNodes.forEach((n) => {
      if (!matched.has(n.id)) return;
      let pid = n.parentId;
      while (pid) {
        matched.add(pid);
        pid = allNodes.find((x) => x.id === pid)?.parentId || null;
      }
    });
    return matched;
  }, [searchText, allNodes, tick]);

  const expandAll = () => {
    setExpandedKeys(new Set(allNodes.filter((n) => getChildNodes(n.id).length > 0).map((n) => n.id)));
  };

  const openAddNode = () => {
    setEditNodeId(null);
    setNodeForm({
      name: '',
      parentId: selectedNodeId,
      nodeKind: 'mount',
      bizCode: '',
    });
    setShowNodeModal(true);
  };

  const openEditNode = (node: FunctionNode) => {
    setEditNodeId(node.id);
    setNodeForm({
      name: node.name,
      parentId: node.parentId,
      nodeKind: node.nodeKind,
      bizCode: node.bizCode || '',
    });
    setShowNodeModal(true);
  };

  const saveNode = () => {
    if (!nodeForm.name.trim()) {
      showToast('请输入节点名称');
      return;
    }
    if (nodeForm.nodeKind === 'mount' && !nodeForm.bizCode && !editNodeId) {
      // 允许先建后绑
    }
    const result = upsertNode({
      id: editNodeId || undefined,
      name: nodeForm.name.trim(),
      parentId: nodeForm.parentId || null,
      nodeKind: nodeForm.nodeKind,
      bizCode: nodeForm.nodeKind === 'mount' ? (nodeForm.bizCode || null) : null,
    });
    if (!result.ok) {
      showToast(result.message);
      return;
    }
    showToast(editNodeId ? '节点已更新' : '节点已新增');
    setShowNodeModal(false);
    setSelectedNodeId(result.node.id);
    if (result.node.parentId) {
      setExpandedKeys((prev) => new Set([...prev, result.node.parentId!]));
    }
    refresh();
  };

  const handleBindMount = (bizCode: string) => {
    if (!selectedNodeId) return;
    const result = bindNodeMountPoint(selectedNodeId, bizCode || null);
    if (!result.ok) {
      showToast(result.message);
      return;
    }
    showToast(bizCode ? `已绑定挂载点 ${bizCode}` : '已解除挂载点绑定');
    refresh();
  };

  const handleToggleEnabled = () => {
    if (!selectedNode) return;
    setNodeEnabled(selectedNode.id, !selectedNode.enabled);
    showToast(selectedNode.enabled ? '节点已停用' : '节点已启用');
    refresh();
  };

  const openAddConfig = () => {
    if (!canEditAttachments) {
      showToast('请先将节点设为挂载点并绑定 bizCode');
      return;
    }
    setEditConfigId(null);
    setConfigForm({
      docName: '', type: '多选', versionManaged: false, required: false,
      fileFormats: fileFormatOptions, fileSize: 50, fileSizeUnit: 'MB',
      fileCount: 10, archived: false, remark: '', templateFile: '', enabled: true,
    });
    setShowConfigModal(true);
  };

  const openEditConfig = (config: AttachmentConfig) => {
    setEditConfigId(config.id);
    setConfigForm({ ...config });
    setShowConfigModal(true);
  };

  const saveConfig = () => {
    if (!selectedNodeId) return;
    if (!configForm.docName?.trim()) {
      showToast('请输入文档名称');
      return;
    }
    const list = [...getAttachmentConfigs(selectedNodeId)];
    if (editConfigId) {
      const idx = list.findIndex((a) => a.id === editConfigId);
      if (idx >= 0) list[idx] = { ...list[idx], ...configForm, id: editConfigId, nodeId: selectedNodeId } as AttachmentConfig;
    } else {
      list.push({
        id: newId('ac'),
        nodeId: selectedNodeId,
        docName: configForm.docName!,
        type: configForm.type || '多选',
        versionManaged: !!configForm.versionManaged,
        required: !!configForm.required,
        fileFormats: configForm.fileFormats || fileFormatOptions,
        fileSize: configForm.fileSize || 50,
        fileSizeUnit: configForm.fileSizeUnit || 'MB',
        fileCount: configForm.fileCount || 10,
        archived: !!configForm.archived,
        remark: configForm.remark || '',
        templateFile: configForm.templateFile || '',
        enabled: configForm.enabled !== false,
      });
    }
    saveAttachmentConfigsForNode(selectedNodeId, list);
    showToast(editConfigId ? '附件配置项已更新' : '附件配置项已添加');
    setShowConfigModal(false);
    refresh();
  };

  const toggleConfigEnabled = (id: string) => {
    if (!selectedNodeId) return;
    const list = getAttachmentConfigs(selectedNodeId).map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a,
    );
    saveAttachmentConfigsForNode(selectedNodeId, list);
    showToast('配置状态已切换');
    refresh();
  };

  const confirmDelete = () => {
    const id = showDeleteConfirm;
    if (!id) return;
    if (deleteKind === 'node') {
      const wasSelected = selectedNodeId === id
        || (selectedNodeId ? (getNodePath(selectedNodeId).startsWith(getNodePath(id) + ' >') || selectedNodeId === id) : false);
      const result = removeNode(id);
      if (!result.ok) {
        if (result.hasChildren && window.confirm(`${result.message}。是否级联删除全部子节点？`)) {
          removeNode(id, { cascade: true });
          showToast('节点及子节点已删除');
          if (wasSelected) setSelectedNodeId(null);
          setShowDeleteConfirm('');
          refresh();
          return;
        }
        showToast(result.message);
        setShowDeleteConfirm('');
        return;
      }
      showToast('节点已删除');
      if (wasSelected) setSelectedNodeId(null);
      setShowDeleteConfirm('');
      refresh();
      return;
    }
    if (!selectedNodeId) return;
    if (deleteKind === 'attachment') {
      saveAttachmentConfigsForNode(
        selectedNodeId,
        getAttachmentConfigs(selectedNodeId).filter((a) => a.id !== id),
      );
      showToast('附件配置项已删除');
    } else {
      saveConditionConfigsForNode(
        selectedNodeId,
        getConditionConfigs(selectedNodeId).filter((c) => c.id !== id),
      );
      showToast('条件配置已删除');
    }
    setShowDeleteConfirm('');
    refresh();
  };

  const openAddCondition = () => {
    if (!canEditAttachments) {
      showToast('请先将节点设为挂载点并绑定 bizCode');
      return;
    }
    setEditConditionId(null);
    setConditionForm({
      conditionName: '',
      priority: 10,
      expression: createEmptyRuleExpression(),
      attachments: [],
      status: 'enabled',
    });
    setShowConditionModal(true);
  };

  const openEditCondition = (cc: ConditionConfig) => {
    setEditConditionId(cc.id);
    setConditionForm({
      conditionName: cc.conditionName,
      priority: cc.priority ?? 10,
      expression: cc.expression || createEmptyRuleExpression(),
      attachments: cc.attachments.map((a) => ({ ...a })),
      status: cc.status,
    });
    setShowConditionModal(true);
  };

  const saveCondition = () => {
    if (!selectedNodeId) return;
    if (!conditionForm.conditionName.trim()) {
      showToast('请输入条件名称');
      return;
    }
    const hasCond = conditionForm.expression.groups.some((g) => g.conditions.length > 0);
    if (!hasCond) {
      showToast('请至少配置一条规则条件');
      return;
    }
    const list = [...getConditionConfigs(selectedNodeId)];
    const payload: ConditionConfig = {
      id: editConditionId || newId('cc'),
      nodeId: selectedNodeId,
      conditionName: conditionForm.conditionName.trim(),
      priority: Number(conditionForm.priority) || 10,
      expression: conditionForm.expression,
      status: conditionForm.status,
      attachments: conditionForm.attachments,
    };
    if (editConditionId) {
      const idx = list.findIndex((c) => c.id === editConditionId);
      if (idx >= 0) list[idx] = payload;
      else list.push(payload);
    } else {
      list.push(payload);
    }
    saveConditionConfigsForNode(selectedNodeId, list);
    showToast(editConditionId ? '条件配置已更新' : '条件配置已添加');
    setShowConditionModal(false);
    refresh();
  };

  const toggleConditionStatus = (cc: ConditionConfig) => {
    if (!selectedNodeId) return;
    const list = getConditionConfigs(selectedNodeId).map((c) =>
      c.id === cc.id ? { ...c, status: (c.status === 'enabled' ? 'disabled' : 'enabled') as 'enabled' | 'disabled' } : c,
    );
    saveConditionConfigsForNode(selectedNodeId, list);
    showToast('条件状态已切换');
    refresh();
  };

  const addConditionAttachment = () => {
    if (!selectedNodeId) return;
    setConditionForm((prev) => ({
      ...prev,
      attachments: [
        ...prev.attachments,
        {
          id: newId('cca'),
          nodeId: selectedNodeId,
          docName: '新建附件',
          type: '多选',
          versionManaged: false,
          required: true,
          fileFormats: ['PDF'],
          fileSize: 20,
          fileSizeUnit: 'MB',
          fileCount: 3,
          archived: true,
          remark: '',
          templateFile: '',
          enabled: true,
        },
      ],
    }));
  };

  const executeCopy = () => {
    if (!selectedNodeId) return;
    if (copyTargetIds.size === 0) {
      showToast('请选择目标节点');
      return;
    }
    if (copyMode === 'overwrite' && !window.confirm('覆盖模式将清除目标节点的原有配置，是否继续？')) return;
    const srcAtt = getAttachmentConfigs(selectedNodeId);
    const srcCond = getConditionConfigs(selectedNodeId);
    copyTargetIds.forEach((tid) => {
      if (copyMode === 'overwrite') {
        saveAttachmentConfigsForNode(tid, srcAtt.map((a) => ({ ...a, id: newId('ac'), nodeId: tid })));
        saveConditionConfigsForNode(
          tid,
          srcCond.map((c) => ({
            ...c,
            id: newId('cc'),
            nodeId: tid,
            attachments: c.attachments.map((a) => ({ ...a, id: newId('cca'), nodeId: tid })),
          })),
        );
      } else {
        const existNames = new Set(getAttachmentConfigs(tid).map((a) => a.docName));
        const merged = [
          ...getAttachmentConfigs(tid),
          ...srcAtt.filter((a) => !existNames.has(a.docName)).map((a) => ({ ...a, id: newId('ac'), nodeId: tid })),
        ];
        saveAttachmentConfigsForNode(tid, merged);
        const existCond = getConditionConfigs(tid);
        saveConditionConfigsForNode(tid, [
          ...existCond,
          ...srcCond.map((c) => ({
            ...c,
            id: newId('cc'),
            nodeId: tid,
            attachments: c.attachments.map((a) => ({ ...a, id: newId('cca'), nodeId: tid })),
          })),
        ]);
      }
    });
    showToast(`配置已成功复制到 ${copyTargetIds.size} 个节点`);
    setShowCopyModal(false);
    refresh();
  };

  const trialResult = useMemo(() => {
    if (!selectedNode?.bizCode) return null;
    return resolveAttachmentSchema(selectedNode.bizCode, trialContext);
  }, [selectedNode?.bizCode, trialContext, tick, showTrialModal]);

  const renderFormatTags = (formats: string[]) => {
    if (formats.length >= fileFormatOptions.length) return <span className="text-xs text-slate-500">默认全选</span>;
    return <span className="text-xs text-slate-500">{formats.length}种格式</span>;
  };

  const parentOptions = allNodes.filter((n) => n.nodeKind === 'folder' || !n.bizCode);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-110px)] bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* 左侧节点树 */}
        <div className="w-72 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="px-3 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700">档案配置节点</h2>
              <button
                type="button"
                onClick={openAddNode}
                className="px-2 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                新增节点
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索节点名称..."
                className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-search-line text-slate-400 text-xs" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <button type="button" onClick={expandAll} className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer px-1 py-0.5">展开全部</button>
              <span className="text-slate-300">|</span>
              <button type="button" onClick={() => setExpandedKeys(new Set(['n-1', 'n-2', 'n-3']))} className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer px-1 py-0.5">折叠全部</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            <div className="flex items-center gap-3 px-3 py-1.5 text-xs text-slate-400 border-b border-slate-100">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />已配置</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />部分配置</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" />未配置</span>
            </div>
            {rootNodes.map((n) => renderTreeNode(n, matchSetForSearch))}
          </div>
        </div>

        {/* 右侧 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedNode ? (
            <>
              <div className="px-5 py-3 border-b border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <span className="text-slate-400 truncate">
                      {getNodePath(selectedNode.id).split(' > ').map((part, i, arr) => (
                        <span key={i}>
                          {i > 0 && <span className="mx-1 text-slate-300">&gt;</span>}
                          <span className={i === arr.length - 1 ? 'text-slate-700 font-medium' : 'text-slate-400'}>{part}</span>
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate('/project-archive/config/preview')}
                      className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
                    >
                      <i className="ri-eye-line" /> 预览
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCopyTargetIds(new Set()); setCopyMode('merge'); setShowCopyModal(true); }}
                      className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
                    >
                      <i className="ri-file-copy-line" /> 复制到
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-slate-500">节点类型</span>
                  <span className={`px-1.5 py-0.5 rounded ${selectedNode.nodeKind === 'mount' ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-500'}`}>
                    {selectedNode.nodeKind === 'mount' ? '挂载点' : '目录'}
                  </span>
                  {selectedNode.nodeKind === 'mount' && (
                    <>
                      <span className="text-slate-500 ml-2">绑定挂载点</span>
                      <select
                        value={selectedNode.bizCode || ''}
                        onChange={(e) => handleBindMount(e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white max-w-[220px]"
                      >
                        <option value="">未绑定</option>
                        {availableMounts.map((m: MountPoint) => (
                          <option key={m.bizCode} value={m.bizCode}>{m.name}（{m.bizCode}）</option>
                        ))}
                      </select>
                    </>
                  )}
                  <span className="text-slate-500 ml-2">启用</span>
                  <button
                    type="button"
                    onClick={handleToggleEnabled}
                    className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${selectedNode.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${selectedNode.enabled ? 'left-4' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {!canEditAttachments ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-50 flex items-center justify-center">
                      <i className="ri-link-unlink text-2xl text-amber-400" />
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      {selectedNode.nodeKind === 'folder'
                        ? '当前为目录节点，仅用于组织树结构'
                        : !selectedNode.bizCode
                          ? '请先绑定挂载点（bizCode）后再配置附件'
                          : '节点已停用，启用后方可编辑配置'}
                    </p>
                    <p className="text-xs text-slate-400">可在上方切换节点类型/挂载点，或点击「新增节点」创建挂载点节点</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-5 pt-3 bg-white border-b border-slate-200">
                    <div className="flex items-center gap-0">
                      <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`px-4 py-2 text-sm cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
                          activeTab === 'general' ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        通用配置
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('condition')}
                        className={`px-4 py-2 text-sm cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
                          activeTab === 'condition' ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        条件配置
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-5">
                    {activeTab === 'general' ? (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-slate-500">共 {attachmentConfigs.length} 项配置 · 挂载点 {selectedNode.bizCode}</span>
                          <button
                            type="button"
                            onClick={openAddConfig}
                            className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                          >
                            <i className="ri-add-line" /> 新增
                          </button>
                        </div>
                        {attachmentConfigs.length === 0 ? (
                          <div className="text-center py-16 text-slate-400">
                            <p className="text-sm">暂无配置，请点击新增按钮添加附件配置</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead className="bg-slate-50">
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap">文档名称</th>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap">类型</th>
                                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap">版本管理</th>
                                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap">必须上传</th>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap">文件格式</th>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap">文件大小</th>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap">数量</th>
                                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap">存档</th>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap">补充说明</th>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap">操作</th>
                                </tr>
                              </thead>
                              <tbody>
                                {attachmentConfigs.map((ac) => (
                                  <tr key={ac.id} className="hover:bg-slate-50" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">{ac.docName}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      <span className="px-1.5 py-0.5 rounded text-xs bg-violet-50 text-violet-600">{ac.type}</span>
                                    </td>
                                    <td className="px-3 py-2 text-center whitespace-nowrap">
                                      <span className={`px-1.5 py-0.5 rounded text-xs ${ac.versionManaged ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {ac.versionManaged ? '开启' : '关闭'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-center whitespace-nowrap">
                                      <span className={`px-1.5 py-0.5 rounded text-xs ${ac.required ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {ac.required ? '开启' : '关闭'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">{renderFormatTags(ac.fileFormats)}</td>
                                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{ac.fileSize} {ac.fileSizeUnit}</td>
                                    <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap">{ac.fileCount}</td>
                                    <td className="px-3 py-2 text-center whitespace-nowrap">
                                      <span className={`px-1.5 py-0.5 rounded text-xs ${ac.archived ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {ac.archived ? '开启' : '关闭'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-slate-500 max-w-[120px] truncate whitespace-nowrap">{ac.remark || '—'}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      <div className="flex items-center gap-1">
                                        <button type="button" onClick={() => openEditConfig(ac)} className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer">编辑</button>
                                        <button type="button" onClick={() => { setDeleteKind('attachment'); setShowDeleteConfirm(ac.id); }} className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer">删除</button>
                                        <button type="button" onClick={() => toggleConfigEnabled(ac.id)} className={`px-2 py-1 text-xs border rounded cursor-pointer ${ac.enabled ? 'text-amber-600 border-amber-200' : 'text-emerald-600 border-emerald-200'}`}>
                                          {ac.enabled ? '停用' : '启用'}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-slate-500">共 {conditionConfigs.length} 项条件配置（按优先级升序匹配）</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowTrialModal(true)}
                              className="px-3 py-1.5 text-sm text-amber-700 border border-amber-300 rounded-md hover:bg-amber-50 cursor-pointer whitespace-nowrap"
                            >
                              规则试算
                            </button>
                            <button
                              type="button"
                              onClick={openAddCondition}
                              className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
                              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                            >
                              <i className="ri-add-line" /> 新增条件配置
                            </button>
                          </div>
                        </div>
                        {conditionConfigs.length === 0 ? (
                          <div className="text-center py-16 text-slate-400">
                            <p className="text-sm">暂无条件配置</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead className="bg-slate-50">
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap">条件名称</th>
                                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap">优先级</th>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 min-w-[240px]">规则摘要</th>
                                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap">附件数</th>
                                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap">状态</th>
                                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap">操作</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[...conditionConfigs].sort((a, b) => a.priority - b.priority).map((cc) => (
                                  <tr key={cc.id} className="hover:bg-slate-50" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">{cc.conditionName}</td>
                                    <td className="px-3 py-2 text-center text-slate-600 whitespace-nowrap">{cc.priority}</td>
                                    <td className="px-3 py-2 text-slate-600 max-w-[360px]">
                                      <span className="line-clamp-2" title={formatRuleExpression(cc.expression)}>
                                        {formatRuleExpression(cc.expression)}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-center text-slate-600 whitespace-nowrap">{cc.attachments.length}</td>
                                    <td className="px-3 py-2 text-center whitespace-nowrap">
                                      <span className={`px-1.5 py-0.5 rounded text-xs ${cc.status === 'enabled' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {cc.status === 'enabled' ? '启用' : '停用'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      <div className="flex items-center gap-1">
                                        <button type="button" onClick={() => openEditCondition(cc)} className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer">编辑</button>
                                        <button type="button" onClick={() => { setDeleteKind('condition'); setShowDeleteConfirm(cc.id); }} className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer">删除</button>
                                        <button type="button" onClick={() => toggleConditionStatus(cc)} className={`px-2 py-1 text-xs border rounded cursor-pointer ${cc.status === 'enabled' ? 'text-amber-600 border-amber-200' : 'text-emerald-600 border-emerald-200'}`}>
                                          {cc.status === 'enabled' ? '停用' : '启用'}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400 text-sm">请在左侧选择档案配置节点</p>
            </div>
          )}
        </div>
      </div>

      {/* 节点编辑弹窗 */}
      {showNodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNodeModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[560px] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">{editNodeId ? '编辑节点' : '新增节点'}</h3>
              <button type="button" onClick={() => setShowNodeModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className={`p-6 ${formRow2Cls}`}>
              <FormField label="节点名称" required fullWidth>
                <input
                  className={formInputCls()}
                  value={nodeForm.name}
                  onChange={(e) => setNodeForm({ ...nodeForm, name: e.target.value })}
                  placeholder="请输入节点名称"
                  maxLength={40}
                />
              </FormField>
              <FormField label="父节点" fullWidth>
                <select
                  className={formInputCls()}
                  value={nodeForm.parentId || ''}
                  onChange={(e) => setNodeForm({ ...nodeForm, parentId: e.target.value || null })}
                >
                  <option value="">（根节点）</option>
                  {parentOptions.filter((n) => n.id !== editNodeId).map((n) => (
                    <option key={n.id} value={n.id}>{n.path}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="节点类型">
                <select
                  className={formInputCls()}
                  value={nodeForm.nodeKind}
                  onChange={(e) => setNodeForm({
                    ...nodeForm,
                    nodeKind: e.target.value as 'folder' | 'mount',
                    bizCode: e.target.value === 'folder' ? '' : nodeForm.bizCode,
                  })}
                >
                  <option value="folder">目录</option>
                  <option value="mount">挂载点</option>
                </select>
              </FormField>
              {nodeForm.nodeKind === 'mount' && (
                <FormField label="绑定挂载点">
                  <select
                    className={formInputCls()}
                    value={nodeForm.bizCode}
                    onChange={(e) => setNodeForm({ ...nodeForm, bizCode: e.target.value })}
                  >
                    <option value="">稍后绑定</option>
                    {getAvailableMountPoints(editNodeId ? getNodeById(editNodeId)?.bizCode : null).map((m) => (
                      <option key={m.bizCode} value={m.bizCode}>{m.name}（{m.bizCode}）</option>
                    ))}
                  </select>
                </FormField>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setShowNodeModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer">取消</button>
              <button type="button" onClick={saveNode} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 附件配置弹窗 */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConfigModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[640px] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">{editConfigId ? '编辑附件配置项' : '新增附件配置项'}</h3>
              <button type="button" onClick={() => setShowConfigModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className={`p-6 ${formRow2Cls}`}>
              <FormField label="文档名称" required fullWidth>
                <input className={formInputCls()} value={configForm.docName || ''} onChange={(e) => setConfigForm({ ...configForm, docName: e.target.value })} maxLength={50} placeholder="请输入文档名称" />
              </FormField>
              <FormField label="类型">
                <select className={formInputCls()} value={configForm.type} onChange={(e) => setConfigForm({ ...configForm, type: e.target.value })}>
                  {docTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>
              <FormField label="文件大小">
                <div className="flex items-center gap-2">
                  <input type="number" className={formInputCls()} value={configForm.fileSize || ''} onChange={(e) => setConfigForm({ ...configForm, fileSize: Number(e.target.value) })} min={1} />
                  <select className={formInputCls()} value={configForm.fileSizeUnit} onChange={(e) => setConfigForm({ ...configForm, fileSizeUnit: e.target.value as 'MB' | 'GB' })}>
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                  </select>
                </div>
              </FormField>
              <FormField label="文件数量">
                <input type="number" className={formInputCls()} value={configForm.fileCount || ''} onChange={(e) => setConfigForm({ ...configForm, fileCount: Number(e.target.value) })} min={1} max={100} />
              </FormField>
              <FormField label="是否版本管理">
                <button type="button" onClick={() => setConfigForm({ ...configForm, versionManaged: !configForm.versionManaged })}
                  className={`relative w-10 h-5 rounded-full cursor-pointer ${configForm.versionManaged ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${configForm.versionManaged ? 'left-5' : 'left-0.5'}`} />
                </button>
              </FormField>
              <FormField label="是否必须上传">
                <button type="button" onClick={() => setConfigForm({ ...configForm, required: !configForm.required })}
                  className={`relative w-10 h-5 rounded-full cursor-pointer ${configForm.required ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${configForm.required ? 'left-5' : 'left-0.5'}`} />
                </button>
              </FormField>
              <FormField label="是否存档">
                <button type="button" onClick={() => setConfigForm({ ...configForm, archived: !configForm.archived })}
                  className={`relative w-10 h-5 rounded-full cursor-pointer ${configForm.archived ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${configForm.archived ? 'left-5' : 'left-0.5'}`} />
                </button>
              </FormField>
              <FormField label="文件格式" fullWidth topAlign>
                <div className="flex flex-wrap gap-2">
                  {fileFormatOptions.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        const current = configForm.fileFormats || [];
                        const next = current.includes(f) ? current.filter((x) => x !== f) : [...current, f];
                        setConfigForm({ ...configForm, fileFormats: next.length ? next : fileFormatOptions });
                      }}
                      className={`px-2 py-1 text-xs rounded border cursor-pointer ${
                        (configForm.fileFormats || []).includes(f) ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500'
                      }`}
                    >{f}</button>
                  ))}
                </div>
              </FormField>
              <FormField label="补充说明" fullWidth topAlign>
                <textarea className={formInputCls()} value={configForm.remark || ''} onChange={(e) => setConfigForm({ ...configForm, remark: e.target.value })} maxLength={100} rows={3} placeholder="请输入，100字以内" />
              </FormField>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setShowConfigModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer">取消</button>
              <button type="button" onClick={saveConfig} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 条件配置弹窗 */}
      {showConditionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConditionModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[860px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">{editConditionId ? '编辑条件配置' : '新增条件配置'}</h3>
              <button type="button" onClick={() => setShowConditionModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className={formRow2Cls}>
                <FormField label="条件名称" required fullWidth>
                  <input
                    className={formInputCls()}
                    value={conditionForm.conditionName}
                    onChange={(e) => setConditionForm({ ...conditionForm, conditionName: e.target.value })}
                    maxLength={40}
                    placeholder="如：总承包合同-技改项目附件要求"
                  />
                </FormField>
                <FormField label="优先级">
                  <input
                    type="number"
                    className={formInputCls()}
                    value={conditionForm.priority}
                    onChange={(e) => setConditionForm({ ...conditionForm, priority: Number(e.target.value) })}
                    min={1}
                    max={999}
                  />
                  <p className="mt-1 text-xs text-slate-400">数值越小越优先匹配</p>
                </FormField>
                <FormField label="状态">
                  <select
                    className={formInputCls()}
                    value={conditionForm.status}
                    onChange={(e) => setConditionForm({ ...conditionForm, status: e.target.value as 'enabled' | 'disabled' })}
                  >
                    <option value="enabled">启用</option>
                    <option value="disabled">停用</option>
                  </select>
                </FormField>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">条件规则</h4>
                <ConditionRuleBuilder
                  value={conditionForm.expression}
                  onChange={(expression) => setConditionForm({ ...conditionForm, expression })}
                  fields={conditionFields}
                />
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">附件配置</h4>
                  <button
                    type="button"
                    onClick={addConditionAttachment}
                    className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    新增附件
                  </button>
                </div>
                {conditionForm.attachments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">暂未配置附件</p>
                ) : (
                  <div className="space-y-2">
                    {conditionForm.attachments.map((a, i) => (
                      <div key={a.id} className="flex items-center gap-2 border border-slate-200 rounded-md p-2">
                        <input
                          className="flex-1 px-2 py-1.5 text-xs border border-slate-300 rounded"
                          value={a.docName}
                          onChange={(e) => {
                            const next = [...conditionForm.attachments];
                            next[i] = { ...a, docName: e.target.value };
                            setConditionForm({ ...conditionForm, attachments: next });
                          }}
                        />
                        <label className="flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={a.required}
                            onChange={(e) => {
                              const next = [...conditionForm.attachments];
                              next[i] = { ...a, required: e.target.checked };
                              setConditionForm({ ...conditionForm, attachments: next });
                            }}
                          />
                          必填
                        </label>
                        <button
                          type="button"
                          onClick={() => setConditionForm({
                            ...conditionForm,
                            attachments: conditionForm.attachments.filter((_, idx) => idx !== i),
                          })}
                          className="px-2 py-1 text-xs text-red-500 border border-red-200 rounded cursor-pointer"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setShowConditionModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer">取消</button>
              <button type="button" onClick={saveCondition} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 规则试算 */}
      {showTrialModal && selectedNode?.bizCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTrialModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[720px] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">规则试算 · {selectedNode.bizCode}</h3>
              <button type="button" onClick={() => setShowTrialModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className={formRow2Cls}>
                {conditionFields.map((f) => (
                  <FormField key={f.code} label={f.name}>
                    {f.valueType === 'boolean' ? (
                      <select
                        className={formInputCls()}
                        value={trialContext[f.code] === false ? 'false' : 'true'}
                        onChange={(e) => setTrialContext({ ...trialContext, [f.code]: e.target.value === 'true' })}
                      >
                        <option value="true">是</option>
                        <option value="false">否</option>
                      </select>
                    ) : f.valueType === 'number' ? (
                      <input
                        type="number"
                        className={formInputCls()}
                        value={Number(trialContext[f.code] ?? 0)}
                        onChange={(e) => setTrialContext({ ...trialContext, [f.code]: Number(e.target.value) })}
                      />
                    ) : f.valueType === 'enum' ? (
                      <select
                        className={formInputCls()}
                        value={String(trialContext[f.code] ?? '')}
                        onChange={(e) => setTrialContext({ ...trialContext, [f.code]: e.target.value })}
                      >
                        {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        className={formInputCls()}
                        value={String(trialContext[f.code] ?? '')}
                        onChange={(e) => setTrialContext({ ...trialContext, [f.code]: e.target.value })}
                      />
                    )}
                  </FormField>
                ))}
              </div>
              {trialResult && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <p className="text-sm text-slate-700">
                    解析来源：
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${trialResult.source === 'condition' ? 'bg-violet-50 text-violet-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {trialResult.source === 'condition' ? '条件规则' : '通用配置'}
                    </span>
                  </p>
                  {trialResult.matchedRule && (
                    <p className="text-sm text-slate-600">
                      命中规则：<span className="font-medium">{trialResult.matchedRule.conditionName}</span>
                      <span className="text-xs text-slate-400 ml-2">优先级 {trialResult.matchedRule.priority}</span>
                    </p>
                  )}
                  <p className="text-xs text-slate-500">将返回附件 {trialResult.attachments.length} 项：</p>
                  <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                    {trialResult.attachments.map((a) => (
                      <li key={a.id}>{a.docName}{a.required ? '（必填）' : ''}</li>
                    ))}
                  </ul>
                  {trialResult.attachments.length === 0 && (
                    <p className="text-xs text-amber-600">无启用附件配置</p>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button type="button" onClick={() => setShowTrialModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* 复制弹窗 */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCopyModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">复制配置到其他节点</h3>
              <button type="button" onClick={() => setShowCopyModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-auto space-y-4">
              <div className="bg-slate-50 rounded-lg p-3 text-sm">
                <span className="text-slate-500">当前节点：</span>
                <span className="text-slate-700 font-medium ml-2">{selectedNode ? getNodePath(selectedNode.id) : ''}</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 max-h-[280px] overflow-y-auto">
                {allNodes.filter((n) => n.nodeKind === 'mount' && n.id !== selectedNodeId).map((n) => (
                  <label key={n.id} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copyTargetIds.has(n.id)}
                      onChange={() => {
                        const next = new Set(copyTargetIds);
                        if (next.has(n.id)) next.delete(n.id);
                        else next.add(n.id);
                        setCopyTargetIds(next);
                      }}
                      className="accent-emerald-500"
                    />
                    <span className="text-xs text-slate-600">{getNodePath(n.id)}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={copyMode === 'merge'} onChange={() => setCopyMode('merge')} className="accent-emerald-500" />
                  合并
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={copyMode === 'overwrite'} onChange={() => setCopyMode('overwrite')} className="accent-emerald-500" />
                  覆盖
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setShowCopyModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md cursor-pointer">取消</button>
              <button type="button" onClick={executeCopy} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确定复制</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm('')}>
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-slate-800 mb-2">确认删除</h3>
            <p className="text-sm text-slate-500 mb-4">
              {deleteKind === 'node' ? '确定删除该节点？若存在子节点将提示级联删除。' : '确定删除该配置项？已上传的历史附件不受影响。'}
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowDeleteConfirm('')} className="px-4 py-2 text-sm border border-slate-300 rounded-md cursor-pointer">取消</button>
              <button type="button" onClick={confirmDelete} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>
      )}
    </Layout>
  );
}
