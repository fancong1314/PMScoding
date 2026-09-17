import { useState } from 'react';
import type { ApprovalTemplate, ApprovalNodeConfig } from '@/mocks/approvalMocks';
import { availableApprovers, saveApprovalTemplates, approvalTemplates } from '@/mocks/approvalMocks';

const NODE_TYPE_CONFIG = {
  approval: { icon: 'ri-user-line', label: '审批', color: '#3b82f6', bg: '#eff6ff' },
  countersign: { icon: 'ri-group-line', label: '会签', color: '#8b5cf6', bg: '#f5f3ff' },
  or_sign: { icon: 'ri-git-branch-line', label: '或签', color: '#f59e0b', bg: '#fffbeb' },
  cc: { icon: 'ri-mail-line', label: '抄送', color: '#6b7280', bg: '#f3f4f6' },
  ratio_pass: { icon: 'ri-percent-line', label: '比例通过', color: '#ec4899', bg: '#fdf2f8' },
};

interface TemplateEditModalProps {
  open: boolean;
  template: ApprovalTemplate | null;
  isGeneral: boolean;
  onSave: () => void;
  onClose: () => void;
}

let editNodeCounter = 100;

export default function TemplateEditModal({ open, template, isGeneral, onSave, onClose }: TemplateEditModalProps) {
  const isNew = !template;
  const [name, setName] = useState(template?.name ?? '');
  const [description, setDescription] = useState(template?.description ?? '');
  const [nodes, setNodes] = useState<ApprovalNodeConfig[]>(
    template?.nodes ?? [
      { nodeId: 'n1', nodeName: '部门领导审批', nodeType: 'approval', approvers: [], isParallel: false, parallelGroup: '', passRatio: 50 },
    ]
  );
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(nodes[0]?.nodeId ?? null);
  const [approverSearch, setApproverSearch] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodeId(expandedNodeId === nodeId ? null : nodeId);
  };

  const updateNode = (nodeId: string, updates: Partial<ApprovalNodeConfig>) => {
    setNodes((prev) => prev.map((n) => (n.nodeId === nodeId ? { ...n, ...updates } : n)));
  };

  const addNode = () => {
    editNodeCounter += 1;
    const newId = `ne${editNodeCounter}`;
    setNodes((prev) => [
      ...prev,
      { nodeId: newId, nodeName: '', nodeType: 'approval', approvers: [], isParallel: false, parallelGroup: '', passRatio: 50 },
    ]);
    setExpandedNodeId(newId);
  };

  const removeNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.nodeId !== nodeId));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('模板名称不能为空');
    const nonCc = nodes.filter((n) => n.nodeType !== 'cc');
    if (nonCc.length === 0) errs.push('至少需要配置1个非抄送节点');
    nonCc.forEach((n) => {
      if (!n.nodeName.trim()) errs.push('节点名称不能为空');
      if (n.approvers.length === 0) errs.push(`节点「${n.nodeName || '未命名'}」至少需要选择1个审批人`);
    });
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const allTemplates = [...approvalTemplates];
    const newTemplate: ApprovalTemplate = {
      id: template?.id ?? `tpl_${Date.now()}`,
      name: name.trim(),
      businessType: '计划申报',
      isDefault: false,
      isGeneral,
      nodeCount: nodes.length,
      description: description.trim(),
      creator: template?.creator ?? '当前用户',
      nodes,
      displayFields: template?.displayFields ?? [],
    };
    if (isNew) {
      allTemplates.push(newTemplate);
    } else {
      const idx = allTemplates.findIndex((t) => t.id === template!.id);
      if (idx >= 0) allTemplates[idx] = newTemplate;
    }
    saveApprovalTemplates(allTemplates);
    onSave();
  };

  const getNodeTypeInfo = (type: string) => NODE_TYPE_CONFIG[type as keyof typeof NODE_TYPE_CONFIG] ?? NODE_TYPE_CONFIG.approval;

  const filteredApprovers = availableApprovers.filter(
    (a) => approverSearch === '' || a.name.includes(approverSearch) || a.department.includes(approverSearch)
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[8vh]">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[720px] max-h-[80vh] flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <i className="ri-file-edit-line text-white text-sm" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                {isNew ? (isGeneral ? '新增通用模板' : '新增模板') : '编辑模板'}
              </h2>
              <p className="text-xs text-slate-400">{isGeneral ? '通用模板可被所有用户使用' : '自定义业务模板'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">模板名称 <span className="text-red-400">*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入模板名称" className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">模板说明</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="请输入模板说明（选填）" className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
          </div>

          {/* Node List */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">节点配置</h4>
            {nodes.map((node, idx) => {
              const typeInfo = getNodeTypeInfo(node.nodeType);
              const isExpanded = expandedNodeId === node.nodeId;
              return (
                <div key={node.nodeId} className={`rounded-lg border transition-all ${isExpanded ? 'border-primary-300 bg-white shadow-sm' : 'border-slate-200 bg-slate-50/50'} mb-1`}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-2 cursor-pointer" onClick={() => toggleExpand(node.nodeId)}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 w-5">#{idx + 1}</span>
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className={typeInfo.icon} style={{ color: typeInfo.color, fontSize: '14px' }} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{node.nodeName || '未命名节点'}</span>
                      <span className="px-1.5 py-0.5 text-xs rounded" style={{ backgroundColor: typeInfo.bg, color: typeInfo.color }}>{typeInfo.label}</span>
                      <span className="text-xs text-slate-400">{node.approvers.length > 0 ? node.approvers.join('、') : '待配置审批人'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); removeNode(node.nodeId); }} title="删除节点" className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-slate-300 hover:text-red-500 cursor-pointer transition-colors">
                        <i className="ri-delete-bin-line text-sm" />
                      </button>
                      <div className="w-5 h-5 flex items-center justify-center">
                        {isExpanded ? <i className="ri-arrow-up-s-line text-slate-400" /> : <i className="ri-arrow-down-s-line text-slate-400" />}
                      </div>
                    </div>
                  </div>
                  {/* Expanded */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-3">
                      {/* Node type + name */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-xs text-slate-500 mb-1 block">节点类型</label>
                          <select value={node.nodeType} onChange={(e) => updateNode(node.nodeId, { nodeType: e.target.value as ApprovalNodeConfig['nodeType'] })} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                            <option value="approval">审批 - 单人审批</option>
                            <option value="countersign">会签 - 多人会签（全部通过）</option>
                            <option value="or_sign">或签 - 多人或签（任一通过）</option>
                            <option value="ratio_pass">比例通过 - 按百分比通过</option>
                            <option value="cc">抄送 - 仅通知</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-slate-500 mb-1 block">节点名称</label>
                          <input type="text" value={node.nodeName} onChange={(e) => updateNode(node.nodeId, { nodeName: e.target.value })} placeholder="如：部门领导审批" className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                        </div>
                      </div>
                      {/* Ratio pass */}
                      {node.nodeType === 'ratio_pass' && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="text-xs text-slate-500 mb-1 block">通过比例</label>
                            <div className="flex items-center gap-2">
                              <input type="number" min={1} max={100} value={node.passRatio ?? 50} onChange={(e) => updateNode(node.nodeId, { passRatio: Math.min(100, Math.max(1, parseInt(e.target.value) || 0)) })} className="w-20 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                              <span className="text-sm text-slate-500">%</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Approvers */}
                      {node.nodeType !== 'cc' && (
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">
                            {node.nodeType === 'approval' ? '审批人（选1人）' : node.nodeType === 'countersign' ? '会签人（多人）' : node.nodeType === 'or_sign' ? '或签人（多人）' : '比例通过人（多人）'}
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
                              <input type="text" value={approverSearch} onChange={(e) => setApproverSearch(e.target.value)} placeholder="搜索人员姓名或部门..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                            </div>
                            {approverSearch && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-20">
                                {filteredApprovers.map((a) => (
                                  <button key={a.name} onClick={() => { if (node.nodeType === 'approval') { updateNode(node.nodeId, { approvers: [a.name] }); } else if (!node.approvers.includes(a.name)) { updateNode(node.nodeId, { approvers: [...node.approvers, a.name] }); } setApproverSearch(''); }} className="w-full px-3 py-1.5 text-left text-sm hover:bg-primary-50 cursor-pointer flex items-center gap-2 whitespace-nowrap">
                                    <span className="font-medium text-slate-700">{a.name}</span>
                                    <span className="text-xs text-slate-400">{a.department}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
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
            })}
          </div>

          <button onClick={addNode} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-400 hover:border-primary-400 hover:text-primary-500 cursor-pointer transition-colors whitespace-nowrap">
            <i className="ri-add-line mr-1" />
            添加节点
          </button>

          {errors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-1">
              {errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600 flex items-center gap-1">
                  <i className="ri-error-warning-line" />{err}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 flex-shrink-0 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap">
            取消
          </button>
          <button onClick={handleSave} className="px-6 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <i className="ri-save-line mr-1.5" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}