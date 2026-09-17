import { useState } from 'react';

interface ApprovalNode {
  id: string;
  name: string;
  type: 'approval' | 'countersign' | 'condition' | 'notify';
  approverType: string;
  approver: string;
  approverRole: string;
  approvalMode: string;
  countersignRule: string;
  passRatio: number;
  timeout: number;
  timeoutUnit: string;
  timeoutAction: string;
  timeoutRemindFreq: number;
  timeoutDelegate: string;
  conditions: ConditionGroup[];
  defaultTarget: string;
  notifyType: string;
  notifyTarget: string;
  notifyMethods: string[];
  notifyTemplate: string;
  expanded: boolean;
}

interface ConditionGroup {
  id: string;
  name: string;
  relation: string;
  conditions: Condition[];
  targetNode: string;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ApprovalFlowConfigModalProps {
  onClose: () => void;
  onConfirm: (flowName: string) => void;
  defaultTitle?: string;
}

let nodeCounter = 0;

const nodeTypes = [
  { value: 'approval', label: '审批节点' },
  { value: 'countersign', label: '会签节点' },
  { value: 'condition', label: '条件分支节点' },
  { value: 'notify', label: '通知节点' },
];

const fieldOptions = ['异动金额', '异动类型', '合同类型', '采购方式', '合同金额', '紧急程度'];
const operatorOptions = ['等于', '不等于', '大于', '小于', '大于等于', '小于等于', '包含', '不包含', '为空', '不为空'];

function createNode(type: ApprovalNode['type'] = 'approval'): ApprovalNode {
  nodeCounter += 1;
  return {
    id: `node-${nodeCounter}`,
    name: type === 'condition' ? '条件分支' : type === 'countersign' ? '会签节点' : type === 'notify' ? '通知节点' : '审批节点',
    type,
    approverType: '指定人员',
    approver: '',
    approverRole: '',
    approvalMode: 'single',
    countersignRule: 'all',
    passRatio: 50,
    timeout: 3,
    timeoutUnit: '工作日',
    timeoutAction: 'auto_remind',
    timeoutRemindFreq: 4,
    timeoutDelegate: '',
    conditions: [],
    defaultTarget: '',
    notifyType: '指定人员',
    notifyTarget: '',
    notifyMethods: ['系统消息'],
    notifyTemplate: '',
    expanded: true,
  };
}

export default function ApprovalFlowConfigModal({ onClose, onConfirm, defaultTitle }: ApprovalFlowConfigModalProps) {
  nodeCounter = 0;
  const [flowName, setFlowName] = useState(defaultTitle || '自定义审批流');
  const [flowType, setFlowType] = useState('serial');
  const [urgency, setUrgency] = useState('普通');
  const [nodes, setNodes] = useState<ApprovalNode[]>([createNode('approval'), createNode('approval')]);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const updateNode = (id: string, patch: Partial<ApprovalNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  const addNode = (type: ApprovalNode['type'] = 'approval') => {
    setNodes((prev) => [...prev, createNode(type)]);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const moveNode = (id: string, dir: number) => {
    setNodes((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  const toggleExpand = (id: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, expanded: !n.expanded } : n)));
  };

  const addCondition = (nodeId: string) => {
    setNodes((prev) => prev.map((n) => {
      if (n.id !== nodeId) return n;
      const groupId = `cg-${Date.now()}`;
      return {
        ...n,
        conditions: [...n.conditions, {
          id: groupId,
          name: `条件组${n.conditions.length + 1}`,
          relation: 'AND',
          conditions: [{ id: `c-${Date.now()}`, field: '异动金额', operator: '大于', value: '' }],
          targetNode: '',
        }],
      };
    }));
  };

  const removeCondition = (nodeId: string, groupId: string) => {
    setNodes((prev) => prev.map((n) => {
      if (n.id !== nodeId) return n;
      return { ...n, conditions: n.conditions.filter((g) => g.id !== groupId) };
    }));
  };

  const handleSubmit = () => {
    if (!flowName.trim()) { showToast('请输入审批流程名称'); return; }
    const hasEmpty = nodes.some((n) => (n.type === 'approval' || n.type === 'countersign') && !n.name.trim());
    if (hasEmpty) { showToast('请完善所有审批节点名称'); return; }
    onConfirm(flowName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-shrink-0">
          <h3 className="text-base font-semibold text-slate-800">自定义审批流配置</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {/* Basic Config */}
          <div className="grid grid-cols-3 gap-4 mb-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">流程名称</span>
              <input type="text" value={flowName} onChange={(e) => setFlowName(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">流程类型</span>
              <select value={flowType} onChange={(e) => setFlowType(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="serial">串行审批</option>
                <option value="parallel">并行审批</option>
                <option value="condition">条件审批</option>
                <option value="countersign">会签审批</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">紧急程度</span>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="普通">普通</option>
                <option value="加急">加急</option>
                <option value="特急">特急</option>
              </select>
            </div>
          </div>

          {/* Node List */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-800">审批节点配置</span>
              <div className="flex items-center gap-2">
                <button onClick={() => addNode('approval')} className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">+ 审批节点</button>
                <button onClick={() => addNode('condition')} className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">+ 条件分支</button>
                <button onClick={() => addNode('notify')} className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">+ 通知节点</button>
              </div>
            </div>

            <div className="space-y-3">
              {nodes.map((node, idx) => (
                <div key={node.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Node Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 cursor-pointer" onClick={() => toggleExpand(node.id)}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">#{idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        node.type === 'condition' ? 'bg-amber-100 text-amber-700' :
                        node.type === 'countersign' ? 'bg-violet-100 text-violet-700' :
                        node.type === 'notify' ? 'bg-sky-100 text-sky-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>{nodeTypes.find((t) => t.value === node.type)?.label}</span>
                      <span className="text-sm text-slate-700 font-medium">{node.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); moveNode(node.id, -1); }} disabled={idx === 0} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-up-s-line" /></button>
                      <button onClick={(e) => { e.stopPropagation(); moveNode(node.id, 1); }} disabled={idx === nodes.length - 1} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-down-s-line" /></button>
                      <button onClick={(e) => { e.stopPropagation(); removeNode(node.id); }} className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer"><i className="ri-delete-bin-line" /></button>
                      <div className="w-4 h-4 flex items-center justify-center text-slate-400 ml-1"><i className={`${node.expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} /></div>
                    </div>
                  </div>

                  {/* Node Content */}
                  {node.expanded && (
                    <div className="p-4 border-t border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-slate-600 whitespace-nowrap w-20">节点名称</span>
                        <input type="text" value={node.name} onChange={(e) => updateNode(node.id, { name: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                        <span className="text-sm text-slate-600 whitespace-nowrap">节点类型</span>
                        <select value={node.type} onChange={(e) => updateNode(node.id, { type: e.target.value as ApprovalNode['type'] })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-36 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                          {nodeTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                        </select>
                      </div>

                      {/* Approver Config */}
                      {(node.type === 'approval' || node.type === 'countersign') && (
                        <div className="space-y-3 pl-6 border-l-2 border-emerald-200 ml-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600 whitespace-nowrap w-20">审批人类型</span>
                            <select value={node.approverType} onChange={(e) => updateNode(node.id, { approverType: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-44 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                              <option value="指定人员">指定人员</option>
                              <option value="指定角色">指定角色</option>
                              <option value="部门负责人">部门负责人</option>
                              <option value="部门领导">部门领导</option>
                              <option value="发起人上级">发起人上级</option>
                              <option value="发起人部门领导">发起人部门领导</option>
                              <option value="表单字段关联人员">表单字段关联人员</option>
                            </select>
                            {node.approverType === '指定人员' && (
                              <input type="text" value={node.approver} onChange={(e) => updateNode(node.id, { approver: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="输入审批人，多人用逗号分隔" />
                            )}
                            {node.approverType === '指定角色' && (
                              <input type="text" value={node.approverRole} onChange={(e) => updateNode(node.id, { approverRole: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="输入角色名称" />
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600 whitespace-nowrap w-20">审批方式</span>
                            <select value={node.approvalMode} onChange={(e) => updateNode(node.id, { approvalMode: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-52 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                              <option value="single">单人审批（任一人通过即可）</option>
                              <option value="countersign">会签审批（需全部通过）</option>
                              <option value="ratio">比例通过</option>
                            </select>
                            {node.approvalMode === 'ratio' && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">通过比例</span>
                                <input type="number" value={node.passRatio} onChange={(e) => updateNode(node.id, { passRatio: Number(e.target.value) })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-20 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" min={1} max={100} />
                                <span className="text-sm text-slate-400">%</span>
                              </div>
                            )}
                          </div>

                          {/* Timeout Settings */}
                          <div className="bg-slate-50 rounded p-3 space-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase">审批超时设置</span>
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">超时时间</span>
                                <input type="number" value={node.timeout} onChange={(e) => updateNode(node.id, { timeout: Number(e.target.value) })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-16 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                                <select value={node.timeoutUnit} onChange={(e) => updateNode(node.id, { timeoutUnit: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                                  <option value="小时">小时</option>
                                  <option value="工作日">工作日</option>
                                </select>
                              </div>
                              <select value={node.timeoutAction} onChange={(e) => updateNode(node.id, { timeoutAction: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                                <option value="auto_remind">自动提醒</option>
                                <option value="auto_delegate">自动转办上级</option>
                                <option value="auto_pass">自动通过</option>
                              </select>
                              {node.timeoutAction === 'auto_remind' && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-slate-600">提醒频率</span>
                                  <input type="number" value={node.timeoutRemindFreq} onChange={(e) => updateNode(node.id, { timeoutRemindFreq: Number(e.target.value) })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-16 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                                  <span className="text-sm text-slate-400">小时/次</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Condition Config */}
                      {node.type === 'condition' && (
                        <div className="space-y-3 pl-6 border-l-2 border-amber-200 ml-2">
                          {node.conditions.map((group) => (
                            <div key={group.id} className="bg-amber-50 rounded p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <input type="text" value={group.name} readOnly className="px-3 py-1.5 text-sm border border-amber-300 rounded-md bg-white text-slate-800 w-40" />
                                  <select value={group.relation} readOnly className="px-3 py-1.5 text-sm border border-amber-300 rounded-md bg-white text-slate-800">
                                    <option value="AND">且(AND)</option>
                                    <option value="OR">或(OR)</option>
                                  </select>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-slate-600">目标节点</span>
                                  <select value={group.targetNode} className="px-3 py-1.5 text-sm border border-amber-300 rounded-md bg-white text-slate-800">
                                    <option value="">请选择</option>
                                    {nodes.filter((n) => n.id !== node.id).map((n) => (<option key={n.id} value={n.id}>{n.name}</option>))}
                                  </select>
                                  <button onClick={() => removeCondition(node.id, group.id)} className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer"><i className="ri-close-circle-line" /></button>
                                </div>
                              </div>
                              {group.conditions.map((cond) => (
                                <div key={cond.id} className="flex items-center gap-2 pl-2">
                                  <select value={cond.field} className="px-3 py-1.5 text-sm border border-amber-300 rounded-md bg-white text-slate-800 w-32">
                                    {fieldOptions.map((f) => (<option key={f} value={f}>{f}</option>))}
                                  </select>
                                  <select value={cond.operator} className="px-3 py-1.5 text-sm border border-amber-300 rounded-md bg-white text-slate-800 w-28">
                                    {operatorOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                                  </select>
                                  {!['为空', '不为空'].includes(cond.operator) && (
                                    <input type="text" value={cond.value} className="flex-1 px-3 py-1.5 text-sm border border-amber-300 rounded-md bg-white text-slate-800" placeholder="条件值" />
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                          <div className="flex items-center gap-3">
                            <button onClick={() => addCondition(node.id)} className="px-3 py-1.5 text-xs text-amber-700 border border-amber-300 rounded-md hover:bg-amber-50 cursor-pointer">+ 新增条件组</button>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">默认路径</span>
                              <select value={node.defaultTarget} onChange={(e) => updateNode(node.id, { defaultTarget: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800">
                                <option value="">请选择</option>
                                {nodes.filter((n) => n.id !== node.id).map((n) => (<option key={n.id} value={n.id}>{n.name}</option>))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notify Config */}
                      {node.type === 'notify' && (
                        <div className="space-y-3 pl-6 border-l-2 border-sky-200 ml-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600 whitespace-nowrap w-20">通知对象类型</span>
                            <select value={node.notifyType} onChange={(e) => updateNode(node.id, { notifyType: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800">
                              <option value="指定人员">指定人员</option>
                              <option value="指定角色">指定角色</option>
                              <option value="部门负责人">部门负责人</option>
                              <option value="发起人">发起人</option>
                            </select>
                            <input type="text" value={node.notifyTarget} onChange={(e) => updateNode(node.id, { notifyTarget: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800" placeholder="输入通知对象" />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600 whitespace-nowrap w-20">通知方式</span>
                            <label className="flex items-center gap-1 text-sm text-slate-700 cursor-pointer"><input type="checkbox" checked readOnly className="mr-1" />系统消息</label>
                            <label className="flex items-center gap-1 text-sm text-slate-700 cursor-pointer"><input type="checkbox" readOnly className="mr-1" />邮件</label>
                            <label className="flex items-center gap-1 text-sm text-slate-700 cursor-pointer"><input type="checkbox" readOnly className="mr-1" />短信</label>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-sm text-slate-600 whitespace-nowrap w-20 mt-1">通知模板</span>
                            <textarea value={node.notifyTemplate} onChange={(e) => updateNode(node.id, { notifyTemplate: e.target.value })} rows={2} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="支持变量占位符：{{合同编号}}、{{异动金额}}等" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Flow Preview */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase mb-2 block">审批流程预览</span>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-full text-xs font-medium text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' }}>发起人</div>
              {nodes.map((node, idx) => (
                <div key={node.id} className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center text-slate-300"><i className="ri-arrow-right-line" /></div>
                  {node.type === 'condition' ? (
                    <div className="px-3 py-1.5 rounded text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 rotate-[-2deg]">◇ {node.name}</div>
                  ) : node.type === 'countersign' ? (
                    <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">◎ {node.name}</div>
                  ) : node.type === 'notify' ? (
                    <div className="px-3 py-1.5 rounded text-xs font-medium bg-sky-100 text-sky-700 border border-sky-200">✉ {node.name}</div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-300">○ {node.name}</div>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-slate-300"><i className="ri-arrow-right-line" /></div>
                <div className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-500">结束</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">保存为模板</button>
          <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-check-line" /></div>
            提交
          </button>
        </div>
      </div>
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </div>
  );
}