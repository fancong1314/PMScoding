import { useState, useRef, useCallback, useEffect } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import {
  approvalTemplates,
  availableApprovers,
  saveApprovalTemplates,
} from '@/mocks/approvalMocks';
import type {
  ApprovalTemplate,
  DisplayFieldGroup,
  ApprovalNodeConfig,
} from '@/mocks/approvalMocks';
import TemplateEditModal from './TemplateEditModal';

interface ApprovalInitModalProps {
  open: boolean;
  plan: ProjectPlan | null;
  onClose: () => void;
  onConfirm: (templateId: string | null, customNodes: NodeConfigType[]) => void;
}

export type NodeConfigType = ApprovalNodeConfig;

const NODE_TYPE_CONFIG = {
  approval: { icon: 'ri-user-line', label: '审批', color: '#3b82f6', bg: '#eff6ff' },
  countersign: { icon: 'ri-group-line', label: '会签', color: '#8b5cf6', bg: '#f5f3ff' },
  or_sign: { icon: 'ri-git-branch-line', label: '或签', color: '#f59e0b', bg: '#fffbeb' },
  cc: { icon: 'ri-mail-line', label: '抄送', color: '#6b7280', bg: '#f3f4f6' },
  ratio_pass: { icon: 'ri-percent-line', label: '比例通过', color: '#ec4899', bg: '#fdf2f8' },
};

let nodeCounter = 1;

export default function ApprovalInitModal({ open, plan, onClose, onConfirm }: ApprovalInitModalProps) {
  const [activeTab, setActiveTab] = useState<'template' | 'custom'>('template');

  // Template tab state
  const [templates, setTemplates] = useState<ApprovalTemplate[]>(approvalTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates.find((t) => t.isDefault)?.id ?? ''
  );
  const [editTemplate, setEditTemplate] = useState<ApprovalTemplate | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIsGeneral, setEditIsGeneral] = useState(false);

  // Custom tab state
  const [flowName, setFlowName] = useState('');
  const [flowDesc, setFlowDesc] = useState('');
  const [customNodes, setCustomNodes] = useState<NodeConfigType[]>([
    { nodeId: 'n1', nodeName: '部门领导审批', nodeType: 'approval', approvers: [], isParallel: false, parallelGroup: '' },
  ]);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>('n1');
  const [selectedParallelNodes, setSelectedParallelNodes] = useState<string[]>([]);
  const [approverSearch, setApproverSearch] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [saveTemplateName, setSaveTemplateName] = useState('');
  const [saveTemplateDesc, setSaveTemplateDesc] = useState('');
  const approverDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTemplates(approvalTemplates);
      const def = approvalTemplates.find((t) => t.isDefault);
      if (def) setSelectedTemplateId(def.id);
    }
  }, [open]);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const currentParallelGroup = customNodes
    .filter((n) => n.isParallel && n.parallelGroup)
    .reduce((acc, n) => {
      if (n.parallelGroup && !acc.includes(n.parallelGroup)) acc.push(n.parallelGroup);
      return acc;
    }, [] as string[]);

  const generalTemplates = templates.filter((t) => t.isGeneral);
  const otherTemplates = templates.filter((t) => !t.isGeneral);

  const toggleNodeExpand = (nodeId: string) => {
    setExpandedNodeId(expandedNodeId === nodeId ? null : nodeId);
  };

  const updateNode = (nodeId: string, updates: Partial<NodeConfigType>) => {
    setCustomNodes((prev) => prev.map((n) => (n.nodeId === nodeId ? { ...n, ...updates } : n)));
  };

  const addNode = () => {
    nodeCounter += 1;
    const newId = `n${nodeCounter}`;
    setCustomNodes((prev) => [
      ...prev,
      { nodeId: newId, nodeName: '', nodeType: 'approval', approvers: [], isParallel: false, parallelGroup: '' },
    ]);
    setExpandedNodeId(newId);
  };

  const removeNode = (nodeId: string) => {
    setCustomNodes((prev) => {
      const node = prev.find((n) => n.nodeId === nodeId);
      const remaining = prev.filter((n) => n.nodeId !== nodeId);
      if (node?.parallelGroup) {
        const groupNodes = remaining.filter((n) => n.parallelGroup === node.parallelGroup);
        if (groupNodes.length <= 1 && groupNodes.length > 0) {
          return remaining.map((n) =>
            n.parallelGroup === node.parallelGroup ? { ...n, isParallel: false, parallelGroup: '' } : n
          );
        }
      }
      return remaining;
    });
  };

  const handleSetParallel = () => {
    if (selectedParallelNodes.length < 2) return;
    const groupName = `pg_${Date.now()}`;
    setCustomNodes((prev) =>
      prev.map((n) =>
        selectedParallelNodes.includes(n.nodeId) ? { ...n, isParallel: true, parallelGroup: groupName } : n
      )
    );
    setSelectedParallelNodes([]);
  };

  const handleCancelParallel = (groupName: string) => {
    setCustomNodes((prev) =>
      prev.map((n) => (n.parallelGroup === groupName ? { ...n, isParallel: false, parallelGroup: '' } : n))
    );
  };

  const toggleParallelSelect = (nodeId: string) => {
    setSelectedParallelNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const handleEditTemplate = (tpl: ApprovalTemplate) => {
    setEditTemplate(tpl);
    setEditIsGeneral(tpl.isGeneral);
    setShowEditModal(true);
  };

  const handleAddGeneralTemplate = () => {
    setEditTemplate(null);
    setEditIsGeneral(true);
    setShowEditModal(true);
  };

  const handleSaveTemplate = () => {
    if (!saveTemplateName.trim()) {
      setValidationErrors(['模板名称不能为空']);
      return;
    }
    const nonCc = customNodes.filter((n) => n.nodeType !== 'cc');
    if (nonCc.length === 0) {
      setValidationErrors(['至少需要配置1个非抄送节点才能保存模板']);
      return;
    }
    const newTemplate: ApprovalTemplate = {
      id: `tpl_${Date.now()}`,
      name: saveTemplateName.trim(),
      businessType: '计划申报',
      isDefault: false,
      isGeneral: false,
      nodeCount: customNodes.length,
      description: saveTemplateDesc.trim(),
      creator: '当前用户',
      nodes: customNodes.map((n) => ({ ...n })),
      displayFields: [],
    };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    saveApprovalTemplates(updated);
    setShowSaveTemplateModal(false);
    setSaveTemplateName('');
    setSaveTemplateDesc('');
    setValidationErrors([]);
  };

  const validate = (): boolean => {
    const errors: string[] = [];
    if (!flowName.trim()) errors.push('流程名称不能为空');
    if (!flowDesc.trim()) errors.push('流程说明不能为空');
    const nonCcNodes = customNodes.filter((n) => n.nodeType !== 'cc');
    if (nonCcNodes.length === 0) errors.push('至少需要配置1个非抄送节点');
    nonCcNodes.forEach((n) => {
      if (!n.nodeName.trim()) errors.push(`节点名称不能为空`);
      if (n.approvers.length === 0) errors.push(`节点「${n.nodeName || '未命名'}」至少需要选择1个审批人`);
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = () => {
    if (activeTab === 'template') {
      if (!selectedTemplate) return;
      onConfirm(selectedTemplateId, []);
    } else {
      if (!validate()) return;
      onConfirm(null, customNodes);
    }
  };

  const getNodeTypeInfo = (type: string) => NODE_TYPE_CONFIG[type as keyof typeof NODE_TYPE_CONFIG] ?? NODE_TYPE_CONFIG.approval;

  const renderNodeCard = (node: NodeConfigType, idx: number) => {
    const typeInfo = getNodeTypeInfo(node.nodeType);
    const isExpanded = expandedNodeId === node.nodeId;
    return (
      <div className={`rounded-lg border transition-all ${isExpanded ? 'border-primary-300 bg-white shadow-sm' : 'border-slate-200 bg-slate-50/50'} mb-1`}>
        <div className="flex items-center justify-between px-3 py-2 cursor-pointer" onClick={() => toggleNodeExpand(node.nodeId)}>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedParallelNodes.includes(node.nodeId)}
              onChange={(e) => { e.stopPropagation(); toggleParallelSelect(node.nodeId); }}
              className="w-3.5 h-3.5 rounded border-slate-300 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-xs font-semibold text-slate-500 w-5">#{idx + 1}</span>
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={typeInfo.icon} style={{ color: typeInfo.color, fontSize: '14px' }} />
            </div>
            <span className="text-sm font-medium text-slate-700">{node.nodeName || '未命名节点'}</span>
            <span className="px-1.5 py-0.5 text-xs rounded" style={{ backgroundColor: typeInfo.bg, color: typeInfo.color }}>{typeInfo.label}</span>
            <span className="text-xs text-slate-400">{node.approvers.length > 0 ? node.approvers.join('、') : '待配置审批人'}</span>
          </div>
          <div className="flex items-center gap-1">
            {node.nodeType !== 'cc' && (
              <button
                onClick={(e) => { e.stopPropagation(); removeNode(node.nodeId); }}
                title="删除节点"
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-slate-300 hover:text-red-500 cursor-pointer transition-colors"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            )}
            <div className="w-5 h-5 flex items-center justify-center">
              {isExpanded ? <i className="ri-arrow-up-s-line text-slate-400" /> : <i className="ri-arrow-down-s-line text-slate-400" />}
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">节点类型</label>
                <select
                  value={node.nodeType}
                  onChange={(e) => updateNode(node.nodeId, { nodeType: e.target.value as NodeConfigType['nodeType'] })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="approval">审批 - 单人审批</option>
                  <option value="countersign">会签 - 多人会签（全部通过）</option>
                  <option value="or_sign">或签 - 多人或签（任一通过）</option>
                  <option value="ratio_pass">比例通过 - 按百分比通过</option>
                  <option value="cc">抄送 - 仅通知</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">节点名称</label>
                <input
                  type="text"
                  value={node.nodeName}
                  onChange={(e) => updateNode(node.nodeId, { nodeName: e.target.value })}
                  placeholder="如：部门领导审批"
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* Ratio pass config */}
            {node.nodeType === 'ratio_pass' && (
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">通过比例</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={node.passRatio ?? 50}
                      onChange={(e) => updateNode(node.nodeId, { passRatio: Math.min(100, Math.max(1, parseInt(e.target.value) || 0)) })}
                      className="w-20 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                    <span className="text-sm text-slate-500">%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">选择多个人员，达到设置比例后即通过该节点</p>
                </div>
              </div>
            )}

            {/* Approvers */}
            {node.nodeType !== 'cc' && (
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  {node.nodeType === 'approval'
                    ? '审批人（选1人）'
                    : node.nodeType === 'countersign'
                      ? '会签人（多人）'
                      : node.nodeType === 'or_sign'
                        ? '或签人（多人）'
                        : '比例通过人（多人）'}
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {node.approvers.map((name) => (
                    <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                      {name}
                      <button onClick={() => updateNode(node.nodeId, { approvers: node.approvers.filter((a) => a !== name) })} className="hover:text-red-500 cursor-pointer">
                        <i className="ri-close-line" style={{ fontSize: '10px' }} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative" ref={approverDropdownRef}>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                      <i className="ri-search-line text-slate-300 text-sm" />
                    </div>
                    <input
                      type="text"
                      value={approverSearch}
                      onChange={(e) => setApproverSearch(e.target.value)}
                      placeholder="搜索人员姓名或部门..."
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  {approverSearch && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-20">
                      {availableApprovers
                        .filter((a) => a.name.includes(approverSearch) || a.department.includes(approverSearch))
                        .map((a) => (
                          <button
                            key={a.name}
                            onClick={() => {
                              if (node.nodeType === 'approval') {
                                updateNode(node.nodeId, { approvers: [a.name] });
                              } else if (!node.approvers.includes(a.name)) {
                                updateNode(node.nodeId, { approvers: [...node.approvers, a.name] });
                              }
                              setApproverSearch('');
                            }}
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-primary-50 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                          >
                            <span className="font-medium text-slate-700">{a.name}</span>
                            <span className="text-xs text-slate-400">{a.department}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  {node.nodeType === 'approval' && '单人审批节点，选择1个审批人或按角色自动匹配'}
                  {node.nodeType === 'countersign' && '所有会签人均需审批通过方可流转'}
                  {node.nodeType === 'or_sign' && '任一或签人审批通过即可流转'}
                  {node.nodeType === 'ratio_pass' && '达到设定比例的人员审批通过后该节点通过'}
                </p>
              </div>
            )}

            {node.nodeType === 'cc' && (
              <div>
                <label className="text-xs text-slate-500 mb-1 block">抄送人（多人）</label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {node.approvers.map((name) => (
                    <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {name}
                      <button onClick={() => updateNode(node.nodeId, { approvers: node.approvers.filter((a) => a !== name) })} className="hover:text-red-500 cursor-pointer">
                        <i className="ri-close-line" style={{ fontSize: '10px' }} />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400">仅通知，无需审批操作</p>
              </div>
            )}


          </div>
        )}
      </div>
    );
  };

  const renderFlowPreview = (nodes: NodeConfigType[], showParallel: boolean) => (
    <div className="flex items-center gap-1 overflow-x-auto py-2 px-1" style={{ minHeight: '80px' }}>
      {/* Start node */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg border border-green-300 bg-green-50/80" style={{ minWidth: '60px' }}>
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <i className="ri-user-line text-white" style={{ fontSize: '10px' }} />
        </div>
        <span className="text-xs text-green-700 font-medium whitespace-nowrap">发起人</span>
        <span className="text-xs text-green-600 whitespace-nowrap">{plan?.applicant ?? '当前用户'}</span>
      </div>
      <div className="flex-shrink-0 flex items-center">
        <div className="w-5 h-0.5 bg-green-300" />
        <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent" style={{ borderLeftColor: '#86efac' }} />
      </div>
      {showParallel ? renderNodesWithParallel(nodes) : renderSimpleNodes(nodes)}
      <div className="flex-shrink-0 flex items-center">
        <div className="w-5 h-0.5 bg-green-300" />
        <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent" style={{ borderLeftColor: '#86efac' }} />
      </div>
      <div className="flex-shrink-0 flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-300 bg-slate-50/80" style={{ minWidth: '60px' }}>
        <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center">
          <i className="ri-check-line text-white" style={{ fontSize: '10px' }} />
        </div>
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">结束</span>
      </div>
    </div>
  );

  const renderSimpleNodes = (nodes: NodeConfigType[]) =>
    nodes.map((node, idx) => {
      const typeInfo = getNodeTypeInfo(node.nodeType);
      return (
        <div key={node.nodeId} className="flex-shrink-0 flex items-center">
          <div className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border text-xs" style={{ borderColor: typeInfo.color, backgroundColor: typeInfo.bg, minWidth: '70px' }}>
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={typeInfo.icon} style={{ color: typeInfo.color, fontSize: '10px' }} />
            </div>
            <span className="font-medium whitespace-nowrap" style={{ color: typeInfo.color }}>{node.nodeName || '未命名'}</span>
            <span className="text-slate-400 whitespace-nowrap" style={{ fontSize: '9px' }}>
              {node.approvers.length > 0 ? node.approvers.join('、') : '待配置'}
            </span>
          </div>
          {idx < nodes.length - 1 && !node.isParallel && (
            <>
              <div className="w-4 h-0.5 bg-slate-300" />
              <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent" style={{ borderLeftColor: '#94a3b8' }} />
            </>
          )}
        </div>
      );
    });

  const renderNodesWithParallel = (nodes: NodeConfigType[]) => {
    const processedGroups = new Set<string>();
    const result: React.ReactNode[] = [];
    let i = 0;
    while (i < nodes.length) {
      const node = nodes[i];
      if (node.isParallel && node.parallelGroup && !processedGroups.has(node.parallelGroup)) {
        const groupNodes = nodes.filter((n) => n.parallelGroup === node.parallelGroup);
        processedGroups.add(node.parallelGroup!);
        result.push(
          <div key={`pg-${node.parallelGroup}`} className="flex-shrink-0 flex items-center gap-1">
            <div className="flex flex-col items-center gap-1 p-1.5 border border-dashed border-slate-300 rounded-lg bg-slate-50/50">
              <span className="text-xs text-slate-400 whitespace-nowrap" style={{ fontSize: '9px' }}>并行审批</span>
              <div className="flex flex-col gap-0.5">
                {groupNodes.map((gn) => {
                  const typeInfo = getNodeTypeInfo(gn.nodeType);
                  return (
                    <div key={gn.nodeId} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded border text-xs" style={{ borderColor: typeInfo.color, backgroundColor: typeInfo.bg, minWidth: '60px' }}>
                      <div className="w-3 h-3 flex items-center justify-center">
                        <i className={typeInfo.icon} style={{ color: typeInfo.color, fontSize: '8px' }} />
                      </div>
                      <span className="font-medium whitespace-nowrap" style={{ color: typeInfo.color }}>{gn.nodeName || '未命名'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {i + groupNodes.length < nodes.length && (
              <>
                <div className="w-4 h-0.5 bg-slate-300" />
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent" style={{ borderLeftColor: '#94a3b8' }} />
              </>
            )}
          </div>
        );
        i += groupNodes.length;
      } else if (!node.isParallel) {
        const typeInfo = getNodeTypeInfo(node.nodeType);
        result.push(
          <div key={node.nodeId} className="flex-shrink-0 flex items-center">
            <div className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border text-xs" style={{ borderColor: typeInfo.color, backgroundColor: typeInfo.bg, minWidth: '70px' }}>
              <div className="w-4 h-4 flex items-center justify-center">
                <i className={typeInfo.icon} style={{ color: typeInfo.color, fontSize: '10px' }} />
              </div>
              <span className="font-medium whitespace-nowrap" style={{ color: typeInfo.color }}>{node.nodeName || '未命名'}</span>
              <span className="text-slate-400 whitespace-nowrap" style={{ fontSize: '9px' }}>{node.approvers.length > 0 ? node.approvers.join('、') : '待配置'}</span>
            </div>
            {i < nodes.length - 1 && nodes[i + 1] && !nodes[i + 1].isParallel && (
              <>
                <div className="w-4 h-0.5 bg-slate-300" />
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent" style={{ borderLeftColor: '#94a3b8' }} />
              </>
            )}
          </div>
        );
        i++;
      } else {
        i++;
      }
    }
    return result;
  };

  if (!open || !plan) return null;

  const cardBase = 'rounded-lg border p-3 cursor-pointer transition-all duration-200 hover:border-primary-400 hover:shadow-sm';
  const cardSelected = 'rounded-lg border-2 border-primary-400 p-3 cursor-pointer bg-primary-50/50';

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[5vh]">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[960px] max-h-[88vh] flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <i className="ri-send-plane-line text-white text-sm" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">发起审批</h2>
              <p className="text-xs text-slate-400">{plan.planName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs rounded-full bg-primary-50 text-primary-600 font-medium">计划申报</span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 flex-shrink-0 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('template')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'template' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <i className="ri-file-copy-line mr-1.5" />
            使用模板
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'custom' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <i className="ri-settings-3-line mr-1.5" />
            自定义审批流
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Template Tab */}
          {activeTab === 'template' && (
            <>
              {/* General Templates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">通用模板</h4>
                  <div className="flex items-center gap-2">
                    {generalTemplates.length >= 5 && (
                      <span className="text-xs text-amber-600">已达上限（最多5个）</span>
                    )}
                    <button
                      onClick={handleAddGeneralTemplate}
                      disabled={generalTemplates.length >= 5}
                      title="只有管理员可对通用模板执行编辑和新增，最多新增5个通用模板"
                      className="flex items-center gap-1 px-3 py-1 text-xs rounded-md border border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-add-line" />
                      新增
                    </button>
                  </div>
                </div>
                {generalTemplates.map((tpl) => (
                  <div key={tpl.id} className={selectedTemplateId === tpl.id ? cardSelected : cardBase}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => setSelectedTemplateId(tpl.id)}>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 text-xs rounded bg-primary-100 text-primary-700 font-medium">通用模板</span>
                          <span className="font-semibold text-slate-800">{tpl.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{tpl.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-slate-400">{tpl.nodeCount}个节点</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditTemplate(tpl); }}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-primary-500 cursor-pointer transition-colors"
                          title="编辑模板"
                        >
                          <i className="ri-edit-line text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Other Templates */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">其他模板</h4>
                {otherTemplates.map((tpl) => (
                  <div key={tpl.id} className={selectedTemplateId === tpl.id ? cardSelected : cardBase}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => setSelectedTemplateId(tpl.id)}>
                        <span className="font-semibold text-slate-800 text-sm">{tpl.name}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{tpl.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 flex-shrink-0">
                        <span>{tpl.nodeCount}个节点</span>
                        <span>创建人：{tpl.creator}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditTemplate(tpl); }}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-primary-500 cursor-pointer transition-colors"
                          title="编辑模板"
                        >
                          <i className="ri-edit-line text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Flow Preview */}
              {selectedTemplate && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">流程预览</h4>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 overflow-x-auto">
                    {renderFlowPreview(selectedTemplate.nodes, true)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Custom Tab */}
          {activeTab === 'custom' && (
            <>
              {/* Flow Basic Info */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/30 p-3 space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">流程基本信息</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">流程名称 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      placeholder="请输入流程名称"
                      className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-500 mb-1 block">流程说明 <span className="text-red-400">*</span> <span className="text-slate-400 font-normal">（{flowDesc.length}/50字）</span></label>
                    <input
                      type="text"
                      value={flowDesc}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v.length <= 50) setFlowDesc(v);
                      }}
                      placeholder="请输入流程说明，限制50字"
                      className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>

              </div>

              {/* Parallel Actions */}
              {selectedParallelNodes.length >= 2 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 border border-primary-200">
                  <span className="text-xs text-primary-600">已选 {selectedParallelNodes.length} 个节点</span>
                  <button onClick={handleSetParallel} className="px-3 py-1 text-xs text-white bg-primary-500 rounded-md hover:bg-primary-600 cursor-pointer whitespace-nowrap">
                    设为并行
                  </button>
                  <button onClick={() => setSelectedParallelNodes([])} className="px-3 py-1 text-xs text-primary-500 border border-primary-300 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap">
                    取消
                  </button>
                </div>
              )}
              {currentParallelGroup.map((groupName) => (
                <div key={groupName} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-xs text-amber-600">并行组</span>
                  <button onClick={() => handleCancelParallel(groupName)} className="px-3 py-1 text-xs text-amber-700 border border-amber-300 rounded-md hover:bg-amber-100 cursor-pointer whitespace-nowrap">
                    取消并行
                  </button>
                </div>
              ))}

              {/* Node List */}
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">节点配置</h4>
                {(() => {
                  const rows: React.ReactNode[] = [];
                  let i = 0;
                  while (i < customNodes.length) {
                    const node = customNodes[i];
                    const prevNode = i > 0 ? customNodes[i - 1] : null;
                    if (node.isParallel && node.parallelGroup) {
                      const groupNodes = customNodes.filter((n) => n.parallelGroup === node.parallelGroup);
                      if (i === 0 || prevNode?.parallelGroup !== node.parallelGroup) {
                        rows.push(
                          <div key={`pg-wrap-${node.parallelGroup}`} className="border border-dashed border-slate-300 rounded-lg p-2">
                            <span className="text-xs text-slate-400 block mb-1">并行（所有节点通过后流转）</span>
                            {groupNodes.map((gn) => (
                              <div key={gn.nodeId}>{renderNodeCard(gn, customNodes.indexOf(gn))}</div>
                            ))}
                          </div>
                        );
                        i += groupNodes.length;
                      } else {
                        i++;
                      }
                    } else {
                      rows.push(renderNodeCard(node, i));
                      i++;
                    }
                  }
                  return rows;
                })()}
              </div>

              {/* Add Node */}
              <button onClick={addNode} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-400 hover:border-primary-400 hover:text-primary-500 cursor-pointer transition-colors whitespace-nowrap">
                <i className="ri-add-line mr-1" />
                添加节点
              </button>

              {/* Flow Preview */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">流程预览</h4>
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 overflow-x-auto">
                  {renderFlowPreview(customNodes, true)}
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-1">
                  {validationErrors.map((err, i) => (
                    <p key={i} className="text-xs text-red-600 flex items-center gap-1">
                      <i className="ri-error-warning-line" />{err}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 flex-shrink-0 bg-slate-50">
          {activeTab === 'custom' && (
            <button
              onClick={() => { setShowSaveTemplateModal(true); setSaveTemplateName(flowName); setSaveTemplateDesc(flowDesc); setValidationErrors([]); }}
              className="px-4 py-2 text-sm text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 cursor-pointer whitespace-nowrap mr-auto"
            >
              <i className="ri-save-line mr-1.5" />
              保存为模板
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap">
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            <i className="ri-send-plane-line mr-1.5" />
            发起审批
          </button>
        </div>
      </div>

      {/* Template Edit Modal */}
      <TemplateEditModal
        open={showEditModal}
        template={editTemplate}
        isGeneral={editIsGeneral}
        onSave={() => {
          setShowEditModal(false);
          setEditTemplate(null);
          setTemplates([...approvalTemplates]);
        }}
        onClose={() => {
          setShowEditModal(false);
          setEditTemplate(null);
        }}
      />

      {/* Save as Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowSaveTemplateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[480px] p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">保存为模板</h3>
              <button onClick={() => setShowSaveTemplateModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">模板名称 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={saveTemplateName}
                  onChange={(e) => setSaveTemplateName(e.target.value)}
                  placeholder="请输入模板名称"
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">模板说明</label>
                <input
                  type="text"
                  value={saveTemplateDesc}
                  onChange={(e) => setSaveTemplateDesc(e.target.value)}
                  placeholder="请输入模板说明（选填）"
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button onClick={() => setShowSaveTemplateModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap">
                取消
              </button>
              <button onClick={handleSaveTemplate} className="px-6 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <i className="ri-save-line mr-1.5" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}