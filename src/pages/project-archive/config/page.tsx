import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  functionNodeTree,
  getChildNodes,
  getNodeById,
  getNodePath,
  getAttachmentConfigs,
  getConditionConfigs,
  docTypeOptions,
  fileFormatOptions,
  contractTypeOptions,
  projectTypeOptions,
  approvalTemplates,
  type AttachmentConfig,
  type ConditionConfig,
  type FunctionNode,
} from '@/mocks/archiveConfigMocks';

export default function ArchiveConfigPage() {
  const navigate = useNavigate();

  // 状态
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['n-1', 'n-2', 'n-3']));
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'condition'>('general');
  const [toast, setToast] = useState('');

  // 弹窗状态
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState('');
  const [editConfigId, setEditConfigId] = useState<string | null>(null);
  const [editConditionId, setEditConditionId] = useState<string | null>(null);

  // 表单状态
  const [configForm, setConfigForm] = useState<Partial<AttachmentConfig>>({
    docName: '', type: '多选', versionManaged: false, required: false,
    fileFormats: fileFormatOptions, fileSize: 50, fileSizeUnit: 'MB',
    fileCount: 10, archived: false, remark: '', templateFile: '', enabled: true,
  });

  const [conditionForm, setConditionForm] = useState({
    conditionName: '', contractTypes: [] as string[], projectTypes: [] as string[],
    attachments: [] as AttachmentConfig[],
  });

  // 配置复制
  const [copyTargetIds, setCopyTargetIds] = useState<Set<string>>(new Set());
  const [copyMode, setCopyMode] = useState<'merge' | 'overwrite'>('merge');

  // 呈核审批
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showApprovalDetailModal, setShowApprovalDetailModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  // 选中节点
  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : null;
  const attachmentConfigs = selectedNodeId ? getAttachmentConfigs(selectedNodeId) : [];
  const conditionConfigs = selectedNodeId ? getConditionConfigs(selectedNodeId) : [];

  // 获取节点颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured': return 'bg-emerald-500';
      case 'partial': return 'bg-amber-400';
      case 'unconfigured': return 'bg-slate-300';
      default: return 'bg-slate-300';
    }
  };

  // 过滤并构建树
  const filteredTree = useMemo(() => {
    if (!searchText.trim()) return functionNodeTree;
    const lower = searchText.toLowerCase();
    return functionNodeTree.filter((n) => n.name.toLowerCase().includes(lower));
  }, [searchText]);

  // 递归渲染树节点
  const renderTreeNode = (node: FunctionNode) => {
    const children = getChildNodes(node.id);
    const isExpanded = expandedKeys.has(node.id);
    const hasChildren = children.length > 0;
    const isSelected = selectedNodeId === node.id;
    const indent = (node.level - 1) * 20;

    return (
      <div key={node.id}>
        <button
          onClick={() => handleNodeClick(node)}
          className={`w-full flex items-center py-1.5 text-xs transition-colors cursor-pointer group ${
            isSelected ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
          }`}
          style={{ paddingLeft: `${indent + 8}px`, paddingRight: '8px' }}
        >
          {/* 展开/折叠图标 */}
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            {hasChildren ? (
              <button
                onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }}
                className="w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                <i className={`ri-arrow-right-s-line text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            ) : (
              <span className="w-4" />
            )}
          </div>
          {/* 状态圆点 */}
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-0.5 ${getStatusColor(node.configStatus)}`} title={node.configStatus === 'configured' ? '已配置' : node.configStatus === 'partial' ? '部分配置' : '未配置'} />
          {/* 节点名称 */}
          <span className="ml-2 truncate">{node.name}</span>
        </button>
        {hasChildren && isExpanded && (
          <div>{children.map(renderTreeNode)}</div>
        )}
      </div>
    );
  };

  const handleNodeClick = (node: FunctionNode) => {
    setSelectedNodeId(node.id);
    setActiveTab('general');
  };

  const toggleNode = (nodeId: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const expandAll = () => {
    const allParentIds = new Set(functionNodeTree.filter((n) => getChildNodes(n.id).length > 0).map((n) => n.id));
    setExpandedKeys(allParentIds);
  };

  const collapseAll = () => {
    setExpandedKeys(new Set(['n-1', 'n-2', 'n-3']));
  };

  // 新增/编辑附件配置
  const openAddConfig = () => {
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
    if (!configForm.docName?.trim()) {
      showToast('请输入文档名称');
      return;
    }
    showToast(editConfigId ? '附件配置项已更新' : '附件配置项已添加');
    setShowConfigModal(false);
  };

  const toggleConfigEnabled = (id: string) => {
    showToast('配置状态已切换');
  };

  const confirmDelete = (id: string) => {
    showToast('附件配置项已删除');
    setShowDeleteConfirm('');
  };

  // 条件配置
  const openAddCondition = () => {
    setEditConditionId(null);
    setConditionForm({ conditionName: '', contractTypes: [], projectTypes: [], attachments: [] });
    setShowConditionModal(true);
  };

  const openEditCondition = (cc: ConditionConfig) => {
    setEditConditionId(cc.id);
    setConditionForm({
      conditionName: cc.conditionName,
      contractTypes: [...cc.contractTypes],
      projectTypes: [...cc.projectTypes],
      attachments: cc.attachments.map((a) => ({ ...a })),
    });
    setShowConditionModal(true);
  };

  const saveCondition = () => {
    if (!conditionForm.conditionName.trim()) {
      showToast('请输入条件名称');
      return;
    }
    if (conditionForm.contractTypes.length === 0) {
      showToast('请选择适用合同类型');
      return;
    }
    if (conditionForm.projectTypes.length === 0) {
      showToast('请选择适用项目类型');
      return;
    }
    showToast(editConditionId ? '条件配置已更新' : '条件配置已添加');
    setShowConditionModal(false);
  };

  // 配置复制
  const openCopyModal = () => {
    setCopyTargetIds(new Set());
    setCopyMode('merge');
    setShowCopyModal(true);
  };

  const executeCopy = () => {
    if (copyTargetIds.size === 0) {
      showToast('请选择目标节点');
      return;
    }
    if (copyMode === 'overwrite') {
      if (!window.confirm('覆盖模式将清除目标节点的原有配置，是否继续？')) return;
    }
    showToast(`配置已成功复制到${copyTargetIds.size}个节点`);
    setShowCopyModal(false);
  };

  // 渲染文件格式标签
  const renderFormatTags = (formats: string[]) => {
    if (formats.length >= fileFormatOptions.length) return <span className="text-xs text-slate-500">默认全选</span>;
    return <span className="text-xs text-slate-500">{formats.length}种格式</span>;
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-110px)] bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* 左侧功能节点树 */}
        <div className="w-64 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="px-3 py-3 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700 mb-2">系统功能节点</h2>
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
              <button onClick={expandAll} className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer px-1 py-0.5">展开全部</button>
              <span className="text-slate-300">|</span>
              <button onClick={collapseAll} className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer px-1 py-0.5">折叠全部</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {/* 图例 */}
            <div className="flex items-center gap-3 px-3 py-1.5 text-xs text-slate-400 border-b border-slate-100">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />已配置</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />部分配置</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" />未配置</span>
            </div>
            {getChildNodes(null).map(renderTreeNode)}
          </div>
        </div>

        {/* 右侧配置区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedNode ? (
            <>
              {/* 面包屑 */}
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">
                    {getNodePath(selectedNode.id).split(' > ').map((part, i, arr) => (
                      <span key={i}>
                        {i > 0 && <span className="mx-1 text-slate-300">&gt;</span>}
                        <span className={i === arr.length - 1 ? 'text-slate-700 font-medium' : 'text-slate-400'}>{part}</span>
                      </span>
                    ))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/project-archive/config/preview')}
                    className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
                  >
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                      <i className="ri-eye-line" />
                    </div>
                    预览
                  </button>
                  <button
                    onClick={openCopyModal}
                    className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
                  >
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                      <i className="ri-file-copy-line" />
                    </div>
                    复制到
                  </button>
                </div>
              </div>

              {/* TAB页签 */}
              <div className="px-5 pt-3 bg-white border-b border-slate-200">
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`px-4 py-2 text-sm cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'general' ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    通用配置
                  </button>
                  <button
                    onClick={() => setActiveTab('condition')}
                    className={`px-4 py-2 text-sm cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'condition' ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    条件配置
                  </button>
                </div>
              </div>

              {/* TAB内容 */}
              <div className="flex-1 overflow-auto p-5">
                {activeTab === 'general' ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-500">共 {attachmentConfigs.length} 项配置</span>
                      <button
                        onClick={openAddConfig}
                        className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-add-line" />
                        </div>
                        新增
                      </button>
                    </div>

                    {attachmentConfigs.length === 0 ? (
                      <div className="text-center py-16 text-slate-400">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                          <i className="ri-folder-open-line text-2xl text-slate-300" />
                        </div>
                        <p className="text-sm">暂无配置，请点击新增按钮添加附件配置</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-50">
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[160px]">文档名称</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[70px]">类型</th>
                              <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap min-w-[90px]">版本管理</th>
                              <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap min-w-[90px]">必须上传</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">文件格式</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[80px]">文件大小</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[70px]">文件数量</th>
                              <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap min-w-[200px]">是否存档</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">补充说明</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[100px]">附件模板</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[160px]">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attachmentConfigs.map((ac) => (
                              <tr key={ac.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td className="px-3 py-2 text-slate-700 whitespace-nowrap font-medium">{ac.docName}</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                                    ac.type === '多选' ? 'bg-violet-50 text-violet-600' :
                                    ac.type === '技改' ? 'bg-sky-50 text-sky-600' :
                                    ac.type === '维修' ? 'bg-amber-50 text-amber-600' :
                                    'bg-teal-50 text-teal-600'
                                  }`}>{ac.type}</span>
                                </td>
                                <td className="px-3 py-2 text-center whitespace-nowrap">
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${ac.versionManaged ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {ac.versionManaged ? '开启' : '关闭'}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-center whitespace-nowrap">
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${ac.required ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {ac.required ? '开启' : '关闭'}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">{renderFormatTags(ac.fileFormats)}</td>
                                <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{ac.fileSize} {ac.fileSizeUnit}</td>
                                <td className="px-3 py-2 text-slate-600 whitespace-nowrap text-center">{ac.fileCount}</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="flex items-center gap-1">
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${ac.archived ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                      {ac.archived ? '开启' : '关闭'}
                                    </span>
                                    {ac.archived && <span className="text-xs text-emerald-500">（开启后该节点上的修改都会存储至档案管理系统）</span>}
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-slate-500 whitespace-nowrap max-w-[120px] truncate">{ac.remark || '-'}</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {ac.templateFile ? (
                                    <span className="text-xs text-sky-600 cursor-pointer hover:underline">{ac.templateFile}</span>
                                  ) : (
                                    <span className="text-xs text-slate-400">请上传</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => openEditConfig(ac)} className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">编辑</button>
                                    <button onClick={() => setShowDeleteConfirm(ac.id)} className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                                    <button onClick={() => toggleConfigEnabled(ac.id)} className={`px-2 py-1 text-xs border rounded cursor-pointer whitespace-nowrap ${ac.enabled ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}>
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
                      <span className="text-sm text-slate-500">共 {conditionConfigs.length} 项条件配置</span>
                      <button
                        onClick={openAddCondition}
                        className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-add-line" />
                        </div>
                        新增条件配置
                      </button>
                    </div>

                    {conditionConfigs.length === 0 ? (
                      <div className="text-center py-16 text-slate-400">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                          <i className="ri-file-settings-line text-2xl text-slate-300" />
                        </div>
                        <p className="text-sm">暂无条件配置</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-50">
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[200px]">条件名称</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[180px]">适用合同类型</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[180px]">适用项目类型</th>
                              <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap min-w-[100px]">附件配置数量</th>
                              <th className="px-3 py-2.5 text-center font-semibold text-slate-600 whitespace-nowrap min-w-[80px]">状态</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {conditionConfigs.map((cc) => (
                              <tr key={cc.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td className="px-3 py-2 text-slate-700 whitespace-nowrap font-medium">{cc.conditionName}</td>
                                <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{cc.contractTypes.join('、')}</td>
                                <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{cc.projectTypes.join('、')}</td>
                                <td className="px-3 py-2 text-slate-600 whitespace-nowrap text-center">{cc.attachments.length} 项</td>
                                <td className="px-3 py-2 text-center whitespace-nowrap">
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${cc.status === 'enabled' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {cc.status === 'enabled' ? '启用' : '停用'}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => openEditCondition(cc)} className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">编辑</button>
                                    <button onClick={() => setShowDeleteConfirm(cc.id)} className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                                    <button className={`px-2 py-1 text-xs border rounded cursor-pointer whitespace-nowrap ${cc.status === 'enabled' ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}>
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
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <i className="ri-mouse-line text-3xl text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm">请在左侧选择功能节点进行配置</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 新增/编辑附件配置弹窗 */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConfigModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[640px] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">{editConfigId ? '编辑附件配置项' : '新增附件配置项'}</h3>
              <button onClick={() => setShowConfigModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* 文档名称 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">文档名称 <span className="text-red-500">*</span></label>
                <input type="text" value={configForm.docName || ''} onChange={(e) => setConfigForm({ ...configForm, docName: e.target.value })}
                  maxLength={50} placeholder="请输入文档名称" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              {/* 类型 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">类型</label>
                <select value={configForm.type} onChange={(e) => setConfigForm({ ...configForm, type: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  {docTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {/* 版本管理 + 必须上传 */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 flex-1">
                  <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">是否版本管理</label>
                  <button onClick={() => setConfigForm({ ...configForm, versionManaged: !configForm.versionManaged })}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${configForm.versionManaged ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${configForm.versionManaged ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">是否必须上传</label>
                  <button onClick={() => setConfigForm({ ...configForm, required: !configForm.required })}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${configForm.required ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${configForm.required ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
              {/* 文件格式（多选） */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap pt-2">文件格式</label>
                <div className="flex-1 flex flex-wrap gap-2">
                  {fileFormatOptions.map((f) => (
                    <button key={f} onClick={() => {
                      const current = configForm.fileFormats || [];
                      const next = current.includes(f) ? current.filter((x) => x !== f) : [...current, f];
                      setConfigForm({ ...configForm, fileFormats: next.length ? next : fileFormatOptions });
                    }}
                    className={`px-2 py-1 text-xs rounded border cursor-pointer whitespace-nowrap ${
                      (configForm.fileFormats || []).includes(f) ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}>{f}</button>
                  ))}
                </div>
              </div>
              {/* 文件大小 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">文件大小</label>
                <input type="number" value={configForm.fileSize || ''} onChange={(e) => setConfigForm({ ...configForm, fileSize: Number(e.target.value) })}
                  min={1} max={9999} className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                <select value={configForm.fileSizeUnit} onChange={(e) => setConfigForm({ ...configForm, fileSizeUnit: e.target.value as 'MB' | 'GB' })}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                </select>
              </div>
              {/* 文件数量 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">文件数量</label>
                <input type="number" value={configForm.fileCount || ''} onChange={(e) => setConfigForm({ ...configForm, fileCount: Number(e.target.value) })}
                  min={1} max={100} className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              {/* 是否存档 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">是否存档</label>
                <button onClick={() => setConfigForm({ ...configForm, archived: !configForm.archived })}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${configForm.archived ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${configForm.archived ? 'left-5' : 'left-0.5'}`} />
                </button>
                <span className="text-xs text-slate-400">（开启后该节点上的修改都会存储至档案管理系统）</span>
              </div>
              {/* 补充说明 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap pt-2">补充说明</label>
                <textarea value={configForm.remark || ''} onChange={(e) => setConfigForm({ ...configForm, remark: e.target.value })}
                  maxLength={100} rows={3} placeholder="请输入，100字以内" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
              </div>
              {/* 附件模板 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">附件模板</label>
                <button className="px-4 py-2 text-sm text-sky-600 border border-sky-300 rounded-md hover:bg-sky-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-upload-line" />
                  </div>
                  {configForm.templateFile || '请上传'}
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button onClick={() => setShowConfigModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={saveConfig} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 条件配置编辑弹窗 */}
      {showConditionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConditionModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">{editConditionId ? '编辑条件配置' : '新增条件配置'}</h3>
              <button onClick={() => setShowConditionModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* 条件名称 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">条件名称 <span className="text-red-500">*</span></label>
                <input type="text" value={conditionForm.conditionName} onChange={(e) => setConditionForm({ ...conditionForm, conditionName: e.target.value })}
                  maxLength={30} placeholder="如：总承包合同-技改项目附件要求" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              {/* 适用合同类型 */}
              <div className="flex items-start gap-3">
                <label className="w-28 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap pt-2">适用合同类型 <span className="text-red-500">*</span></label>
                <div className="flex-1 flex flex-wrap gap-2">
                  {contractTypeOptions.map((ct) => (
                    <button key={ct} onClick={() => {
                      const next = conditionForm.contractTypes.includes(ct)
                        ? conditionForm.contractTypes.filter((x) => x !== ct)
                        : [...conditionForm.contractTypes, ct];
                      setConditionForm({ ...conditionForm, contractTypes: next });
                    }}
                    className={`px-2 py-1 text-xs rounded border cursor-pointer whitespace-nowrap ${
                      conditionForm.contractTypes.includes(ct) ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}>{ct}</button>
                  ))}
                </div>
              </div>
              {/* 适用项目类型 */}
              <div className="flex items-start gap-3">
                <label className="w-28 text-sm text-slate-600 flex-shrink-0 whitespace-nowrap pt-2">适用项目类型 <span className="text-red-500">*</span></label>
                <div className="flex-1 flex flex-wrap gap-2">
                  {projectTypeOptions.map((pt) => (
                    <button key={pt} onClick={() => {
                      const next = conditionForm.projectTypes.includes(pt)
                        ? conditionForm.projectTypes.filter((x) => x !== pt)
                        : [...conditionForm.projectTypes, pt];
                      setConditionForm({ ...conditionForm, projectTypes: next });
                    }}
                    className={`px-2 py-1 text-xs rounded border cursor-pointer whitespace-nowrap ${
                      conditionForm.projectTypes.includes(pt) ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}>{pt}</button>
                  ))}
                </div>
              </div>

              {/* 附件配置区 */}
              <div className="border-t border-slate-200 pt-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">附件配置</h4>
                  <button className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-add-line" /></div>
                    新增
                  </button>
                </div>
                {conditionForm.attachments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">暂未配置附件，请点击新增按钮添加</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">文档名称</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">类型</th>
                          <th className="px-3 py-2 text-center font-semibold text-slate-600 whitespace-nowrap">版本管理</th>
                          <th className="px-3 py-2 text-center font-semibold text-slate-600 whitespace-nowrap">必须上传</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conditionForm.attachments.map((a, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{a.docName}</td>
                            <td className="px-3 py-2 whitespace-nowrap"><span className="px-1.5 py-0.5 rounded text-xs bg-violet-50 text-violet-600">{a.type}</span></td>
                            <td className="px-3 py-2 text-center whitespace-nowrap"><span className={`px-1.5 py-0.5 rounded text-xs ${a.versionManaged ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{a.versionManaged ? '开启' : '关闭'}</span></td>
                            <td className="px-3 py-2 text-center whitespace-nowrap"><span className={`px-1.5 py-0.5 rounded text-xs ${a.required ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{a.required ? '开启' : '关闭'}</span></td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <button className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">编辑</button>
                                <button className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button onClick={() => setShowConditionModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={saveCondition} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 配置复制弹窗 */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCopyModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">复制配置到其他功能节点</h3>
              <button onClick={() => setShowCopyModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-auto space-y-4">
              {/* 源节点 */}
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500">当前节点：</span>
                <span className="text-sm text-slate-700 font-medium ml-2">{selectedNode ? getNodePath(selectedNode.id) : ''}</span>
              </div>

              {/* 目标节点选择 */}
              <div className="flex gap-4">
                <div className="flex-1 border border-slate-200 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                  <p className="text-xs text-slate-500 mb-2">勾选目标功能节点</p>
                  {functionNodeTree.filter((n) => n.level >= 4 && n.id !== selectedNodeId).map((n) => (
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
                        className="w-3.5 h-3.5 accent-emerald-500"
                      />
                      <span className="text-xs text-slate-600">{getNodePath(n.id)}</span>
                    </label>
                  ))}
                </div>
                {/* 已选节点 */}
                <div className="w-56 border border-slate-200 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                  <p className="text-xs text-slate-500 mb-2">已选 {copyTargetIds.size} 个节点</p>
                  {Array.from(copyTargetIds).map((id) => {
                    const node = getNodeById(id);
                    return node ? (
                      <div key={id} className="flex items-center justify-between py-1">
                        <span className="text-xs text-slate-600 truncate flex-1">{node.name}</span>
                        <button onClick={() => { const next = new Set(copyTargetIds); next.delete(id); setCopyTargetIds(next); }}
                          className="w-4 h-4 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer">
                          <i className="ri-close-line text-xs" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* 复制方式 */}
              <div>
                <p className="text-sm text-slate-600 mb-2 font-medium">复制方式</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="copyMode" checked={copyMode === 'merge'} onChange={() => setCopyMode('merge')} className="accent-emerald-500" />
                    <span className="text-sm text-slate-700">合并</span>
                    <span className="text-xs text-slate-400">（追加到已有配置，同名跳过）</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="copyMode" checked={copyMode === 'overwrite'} onChange={() => setCopyMode('overwrite')} className="accent-emerald-500" />
                    <span className="text-sm text-slate-700">覆盖</span>
                    <span className="text-xs text-slate-400">（清除目标原配置，替换为源配置）</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button onClick={() => setShowCopyModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={executeCopy} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确定复制</button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm('')}>
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <i className="ri-question-line text-red-500 text-lg" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">确认删除</h3>
                <p className="text-sm text-slate-500">确定删除该配置项？删除后该配置立即生效，已上传的历史附件不受影响。</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setShowDeleteConfirm('')} className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={() => confirmDelete(showDeleteConfirm)} className="px-4 py-2 text-sm rounded-md text-white cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>
      )}
    </Layout>
  );
}