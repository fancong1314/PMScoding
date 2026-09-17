import { useState, useRef, useCallback } from 'react';
import { availableApprovers, type ApprovalNodeConfig } from '@/mocks/approvalMocks';

interface BatchPresentModalProps {
  open: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (nodes: NodeConfigType[], attachments: File[]) => void;
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

export default function BatchPresentModal({ open, selectedCount, onClose, onConfirm }: BatchPresentModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Attachment
  const [attachments, setAttachments] = useState<{ name: string; file: File }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Custom flow
  const [flowName, setFlowName] = useState('');
  const [flowDesc, setFlowDesc] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'critical'>('normal');
  const [customNodes, setCustomNodes] = useState<NodeConfigType[]>([
    { nodeId: 'n1', nodeName: '部门领导审批', nodeType: 'approval', approvers: [], isParallel: false, parallelGroup: '' },
  ]);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>('n1');
  const [selectedParallelNodes, setSelectedParallelNodes] = useState<string[]>([]);
  const [approverSearch, setApproverSearch] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((f) => ({ name: f.name, file: f }));
      setAttachments((prev) => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetAll = () => {
    setStep(1);
    setAttachments([]);
    setFlowName('');
    setFlowDesc('');
    setUrgency('normal');
    nodeCounter = 1;
    setCustomNodes([{ nodeId: 'n1', nodeName: '部门领导审批', nodeType: 'approval', approvers: [], isParallel: false, parallelGroup: '' }]);
    setExpandedNodeId('n1');
    setSelectedParallelNodes([]);
    setApproverSearch('');
    setValidationErrors([]);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

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
    if (!validate()) return;
    onConfirm(customNodes, attachments.map((a) => a.file));
    resetAll();
  };

  const getNodeTypeInfo = (type: string) => NODE_TYPE_CONFIG[type as keyof typeof NODE_TYPE_CONFIG] ?? NODE_TYPE_CONFIG.approval;

  const currentParallelGroup = customNodes
    .filter((n) => n.isParallel && n.parallelGroup)
    .reduce((acc, n) => {
      if (n.parallelGroup && !acc.includes(n.parallelGroup)) acc.push(n.parallelGroup);
      return acc;
    }, [] as string[]);

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
                <div className="relative">
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

  const renderFlowPreview = (nodes: NodeConfigType[]) => {
    const renderNodesWithParallel = () => {
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

    return (
      <div className="flex items-center gap-1 overflow-x-auto py-2 px-1" style={{ minHeight: '80px' }}>
        <div className="flex-shrink-0 flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg border border-green-300 bg-green-50/80" style={{ minWidth: '60px' }}>
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <i className="ri-user-line text-white" style={{ fontSize: '10px' }} />
          </div>
          <span className="text-xs text-green-700 font-medium whitespace-nowrap">发起人</span>
          <span className="text-xs text-green-600 whitespace-nowrap">当前用户</span>
        </div>
        <div className="flex-shrink-0 flex items-center">
          <div className="w-5 h-0.5 bg-green-300" />
          <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent" style={{ borderLeftColor: '#86efac' }} />
        </div>
        {renderNodesWithParallel()}
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
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[5vh]">
      <div className="absolute inset-0 bg-black/45" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[960px] max-h-[88vh] flex flex-col overflow-hidden z-10">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
              <i className="ri-send-plane-line text-white text-sm" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">批量呈核</h2>
              <p className="text-xs text-slate-400">已选择 {selectedCount} 个项目</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs rounded-full bg-sky-50 text-sky-600 font-medium">计划审查</span>
            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 py-3 flex-shrink-0 bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button onClick={() => setStep(1)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              step === 1 ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={step === 1 ? { backgroundColor: 'rgba(255,255,255,0.25)' } : { backgroundColor: '#f1f5f9' }}>1</span>
              上传附件
            </button>
            <div className="w-8 h-0.5 bg-slate-200" />
            <button onClick={() => setStep(2)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              step === 2 ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={step === 2 ? { backgroundColor: 'rgba(255,255,255,0.25)' } : { backgroundColor: '#f1f5f9' }}>2</span>
              自定义审批流
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {step === 1 && (
            <div>
              <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center hover:border-sky-400 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sky-50 mx-auto mb-3">
                  <i className="ri-upload-cloud-2-line text-sky-500 text-2xl" />
                </div>
                <p className="text-sm font-medium text-slate-600">点击上传附件</p>
                <p className="text-xs text-slate-400 mt-1">支持 PDF、Word、Excel、图片等格式，单个文件不超过 50MB</p>
                <p className="text-xs text-slate-300 mt-2">（非必填，可跳过直接进入下一步）</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.zip,.rar"
                />
              </div>

              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">已上传附件 ({attachments.length})</h4>
                  <div className="space-y-1.5">
                    {attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <i className="ri-file-line text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-700 font-medium">{att.name}</p>
                            <p className="text-xs text-slate-400">{(att.file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAttachment(idx)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
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
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">紧急程度 <span className="text-red-400">*</span></label>
                  <div className="flex items-center gap-2">
                    {[
                      { value: 'normal', label: '普通', color: '#3b82f6' },
                      { value: 'urgent', label: '紧急', color: '#f59e0b' },
                      { value: 'critical', label: '特急', color: '#ef4444' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setUrgency(opt.value as typeof urgency)}
                        className={`px-3 py-1.5 text-sm rounded-md border cursor-pointer whitespace-nowrap transition-all ${
                          urgency === opt.value
                            ? 'border-transparent text-white'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                        }`}
                        style={urgency === opt.value ? { backgroundColor: opt.color } : undefined}
                      >
                        {opt.label}
                      </button>
                    ))}
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
                  {renderFlowPreview(customNodes)}
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
          {step === 1 && (
            <>
              <button onClick={handleClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap">
                取消
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                {attachments.length > 0 ? `已上传 ${attachments.length} 个附件，下一步` : '跳过，下一步'}
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap">
                上一步
              </button>
              <button onClick={handleClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}