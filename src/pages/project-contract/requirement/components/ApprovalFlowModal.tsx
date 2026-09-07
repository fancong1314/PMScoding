import { useState } from 'react';
import { EngineeringDemand, ApprovalFlowNode } from '@/mocks/engineeringRequirementMocks';

interface ApprovalFlowModalProps {
  demand: EngineeringDemand;
  onClose: () => void;
  onSubmit: () => void;
}

const approverTypes = ['指定人员', '指定角色', '部门负责人', '部门领导'];
const approvalMethods = ['单人审批', '会签审批'];
const countersignRules = ['全部通过', '一人通过即可'];
const conditionFields = ['需求金额', '采购方式', '需求类型', '计划金额'];
const conditionOperators = ['等于', '不等于', '大于', '小于', '大于等于', '小于等于', '包含'];

export default function ApprovalFlowModal({ demand, onClose, onSubmit }: ApprovalFlowModalProps) {
  const [flowName, setFlowName] = useState(
    `工程需求审批-${demand.demandNo}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
  );
  const [nodes, setNodes] = useState<ApprovalFlowNode[]>([
    {
      id: 'node-1',
      nodeNo: 1,
      nodeName: '部门负责人审批',
      approverType: '指定人员',
      approver: '李建国',
      approvalMethod: '单人审批',
      hasCondition: false,
    },
    {
      id: 'node-2',
      nodeNo: 2,
      nodeName: '分管领导审批',
      approverType: '指定人员',
      approver: '王志强',
      approvalMethod: '单人审批',
      hasCondition: false,
    },
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const addNode = () => {
    const newNode: ApprovalFlowNode = {
      id: `node-${nodes.length + 1}`,
      nodeNo: nodes.length + 1,
      nodeName: '',
      approverType: '指定人员',
      approver: '',
      approvalMethod: '单人审批',
      hasCondition: false,
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    const filtered = nodes.filter((n) => n.id !== id);
    const reordered = filtered.map((n, i) => ({ ...n, nodeNo: i + 1, id: `node-${i + 1}` }));
    setNodes(reordered);
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newNodes = [...nodes];
    [newNodes[index], newNodes[index - 1]] = [newNodes[index - 1], newNodes[index]];
    newNodes.forEach((n, i) => {
      n.nodeNo = i + 1;
      n.id = `node-${i + 1}`;
    });
    setNodes(newNodes);
  };

  const moveDown = (index: number) => {
    if (index === nodes.length - 1) return;
    const newNodes = [...nodes];
    [newNodes[index], newNodes[index + 1]] = [newNodes[index + 1], newNodes[index]];
    newNodes.forEach((n, i) => {
      n.nodeNo = i + 1;
      n.id = `node-${i + 1}`;
    });
    setNodes(newNodes);
  };

  const updateNode = (id: string, field: keyof ApprovalFlowNode, value: unknown) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const updated = { ...n, [field]: value };
        if (field === 'approvalMethod' && value === '单人审批') {
          updated.countersignRule = undefined;
        }
        if (field === 'approverType' && value !== '指定人员') {
          updated.approver = undefined;
        }
        if (field === 'approverType' && value !== '指定角色') {
          updated.approverRole = undefined;
        }
        return updated;
      })
    );
  };

  const [error, setError] = useState('');

  const handleSubmit = () => {
    const emptyName = nodes.find((n) => !n.nodeName.trim());
    if (emptyName) {
      setError(`节点 ${emptyName.nodeNo} 名称不能为空`);
      return;
    }
    const emptyApprover = nodes.find(
      (n) => n.approverType === '指定人员' && !n.approver?.trim()
    );
    if (emptyApprover) {
      setError(`节点 ${emptyApprover.nodeNo} 审批人不能为空`);
      return;
    }
    const emptyRole = nodes.find(
      (n) => n.approverType === '指定角色' && !n.approverRole?.trim()
    );
    if (emptyRole) {
      setError(`节点 ${emptyRole.nodeNo} 审批角色不能为空`);
      return;
    }
    setError('');
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">自定义审批流配置</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Flow Name */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm text-slate-600 whitespace-nowrap">审批流程名称</span>
            <input
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-error-warning-line" />
              </div>
              {error}
            </div>
          )}

          {/* Node List */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-slate-700">审批节点配置</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-3">
              {nodes.map((node, index) => (
                <div
                  key={node.id}
                  className={`border rounded-lg p-3 transition-colors ${selectedNodeId === node.id ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200'}`}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {node.nodeNo}
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={node.nodeName}
                        onChange={(e) => updateNode(node.id, 'nodeName', e.target.value)}
                        placeholder="节点名称"
                        className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <select
                        value={node.approverType}
                        onChange={(e) => updateNode(node.id, 'approverType', e.target.value)}
                        className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        {approverTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {node.approverType === '指定人员' && (
                        <input
                          type="text"
                          value={node.approver || ''}
                          onChange={(e) => updateNode(node.id, 'approver', e.target.value)}
                          placeholder="审批人"
                          className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      )}
                      {node.approverType === '指定角色' && (
                        <input
                          type="text"
                          value={node.approverRole || ''}
                          onChange={(e) => updateNode(node.id, 'approverRole', e.target.value)}
                          placeholder="审批角色"
                          className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      )}
                      {(node.approverType === '部门负责人' || node.approverType === '部门领导') && (
                        <div className="px-2 py-1 text-sm text-slate-400 border border-slate-200 rounded-md bg-slate-50">
                          自动获取
                        </div>
                      )}
                      <select
                        value={node.approvalMethod}
                        onChange={(e) => updateNode(node.id, 'approvalMethod', e.target.value)}
                        className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        {approvalMethods.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveUp(index); }}
                        disabled={index === 0}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="ri-arrow-up-line" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveDown(index); }}
                        disabled={index === nodes.length - 1}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="ri-arrow-down-line" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                        className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer"
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </div>
                  </div>

                  {/* Condition Branch */}
                  <div className="flex items-center gap-3 pl-9">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={node.hasCondition}
                        onChange={(e) => updateNode(node.id, 'hasCondition', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-600">条件分支</span>
                    </label>
                    {node.hasCondition && (
                      <div className="flex items-center gap-2">
                        <select
                          value={node.conditionField || ''}
                          onChange={(e) => updateNode(node.id, 'conditionField', e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="">选择字段</option>
                          {conditionFields.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                        <select
                          value={node.conditionOperator || ''}
                          onChange={(e) => updateNode(node.id, 'conditionOperator', e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="">运算符</option>
                          {conditionOperators.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={node.conditionValue || ''}
                          onChange={(e) => updateNode(node.id, 'conditionValue', e.target.value)}
                          placeholder="条件值"
                          className="px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-24"
                        />
                      </div>
                    )}
                  </div>

                  {/* Countersign Rule */}
                  {node.approvalMethod === '会签审批' && (
                    <div className="flex items-center gap-2 pl-9 mt-2">
                      <span className="text-xs text-slate-500">会签通过规则</span>
                      <select
                        value={node.countersignRule || '全部通过'}
                        onChange={(e) => updateNode(node.id, 'countersignRule', e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                          {countersignRules.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addNode}
              className="mt-3 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 cursor-pointer flex items-center gap-1"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-add-line" />
              </div>
              新增审批节点
            </button>
          </div>

          {/* Flow Preview */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-slate-700">审批流程预览</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="flex items-center gap-2 flex-wrap p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">发起人</div>
              {nodes.map((node, i) => (
                <div key={node.id} className="flex items-center gap-2">
                  <div className="w-6 h-px bg-slate-300" />
                  <div className="px-3 py-1.5 rounded-full bg-white border border-slate-300 text-slate-700 text-xs font-medium">
                    {node.nodeName}
                    {node.hasCondition && <span className="ml-1 text-blue-500">(条件)</span>}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-6 h-px bg-slate-300" />
                <div className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">结束</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            提交
          </button>
        </div>
      </div>
    </div>
  );
}