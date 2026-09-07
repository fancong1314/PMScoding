import { useState } from 'react';
import { employees } from '@/mocks/designReviewMocks';

interface ApprovalFlowModalProps {
  onClose: () => void;
  onSubmit: (config: { nodes: { node: string; approver: string }[]; remark: string }) => void;
}

const presetFlows = [
  { name: '标准审批流', nodes: ['项目经理审核', '工程管理部审核'] },
  { name: '简化审批流', nodes: ['项目经理审核'] },
  { name: '严格审批流', nodes: ['项目经理审核', '工程管理部审核', '财务部审核', '分管领导审批'] },
];

const nodeOptions = ['项目经理审核', '工程管理部审核', '财务部审核', '分管领导审批', '审计部审核', '安全能环部审核'];

export default function ApprovalFlowModal({ onClose, onSubmit }: ApprovalFlowModalProps) {
  const [nodes, setNodes] = useState<{ node: string; approver: string }[]>([
    { node: '项目经理审核', approver: '' },
    { node: '工程管理部审核', approver: '' },
  ]);
  const [remark, setRemark] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [error, setError] = useState('');

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  const handlePresetSelect = (idx: number) => {
    setSelectedPreset(idx);
    const preset = presetFlows[idx];
    setNodes(preset.nodes.map((n) => ({ node: n, approver: '' })));
    setError('');
  };

  const handleAddNode = () => {
    setNodes([...nodes, { node: '', approver: '' }]);
    setSelectedPreset(null);
  };

  const handleRemoveNode = (idx: number) => {
    setNodes(nodes.filter((_, i) => i !== idx));
  };

  const handleUpdateNode = (idx: number, field: 'node' | 'approver', value: string) => {
    const next = [...nodes];
    next[idx] = { ...next[idx], [field]: value };
    setNodes(next);
    setSelectedPreset(null);
    if (error) setError('');
  };

  const handleSubmit = () => {
    setError('');
    for (let i = 0; i < nodes.length; i++) {
      if (!nodes[i].node.trim()) {
        setError(`第 ${i + 1} 个审批节点未选择审批类型`);
        return;
      }
      if (!nodes[i].approver.trim()) {
        setError(`第 ${i + 1} 个审批节点未选择审批人`);
        return;
      }
    }
    if (nodes.length === 0) {
      setError('至少配置一个审批节点');
      return;
    }
    onSubmit({ nodes, remark });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl border border-steel-200 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 标题 */}
        <div className="px-5 py-4 border-b border-steel-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-steel-900">呈核审批配置</h3>
            <p className="text-xs text-steel-400 mt-0.5">配置概算修改的审批流程节点和审批人</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
            <i className="ri-close-line text-steel-500" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-5">
          {/* 预设审批流 */}
          <div>
            <label className="text-xs font-medium text-steel-600 mb-2 block">预设审批流程</label>
            <div className="flex flex-wrap gap-2">
              {presetFlows.map((preset, idx) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(idx)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                    selectedPreset === idx
                      ? 'border-primary-300 bg-primary-50 text-primary-700'
                      : 'border-steel-200 text-steel-600 hover:bg-slate-50'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* 审批节点 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-steel-600">审批节点配置</label>
              <button
                onClick={handleAddNode}
                className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-md transition-colors cursor-pointer"
              >
                <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-add-line" /></div>
                新增节点
              </button>
            </div>

            <div className="space-y-3">
              {nodes.map((node, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-steel-100 bg-slate-50">
                  <div className="flex flex-col items-center gap-1 pt-2">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                      {idx + 1}
                    </div>
                    {idx < nodes.length - 1 && (
                      <div className="w-px h-4 bg-steel-200" />
                    )}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-steel-500 mb-1 block">审批节点</label>
                      <select
                        value={node.node}
                        onChange={(e) => handleUpdateNode(idx, 'node', e.target.value)}
                        className={inputCls}
                      >
                        <option value="">请选择</option>
                        {nodeOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-steel-500 mb-1 block">审批人</label>
                      <select
                        value={node.approver}
                        onChange={(e) => handleUpdateNode(idx, 'approver', e.target.value)}
                        className={inputCls}
                      >
                        <option value="">请选择</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {nodes.length > 1 && (
                    <button
                      onClick={() => handleRemoveNode(idx)}
                      className="mt-6 w-6 h-6 flex items-center justify-center rounded-md hover:bg-danger-50 transition-colors cursor-pointer flex-shrink-0"
                      title="删除节点"
                    >
                      <i className="ri-delete-bin-line text-danger-500 text-xs" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 提交备注 */}
          <div>
            <label className="text-xs font-medium text-steel-600 mb-1 block">提交备注</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="输入呈核备注说明（选填）"
            />
          </div>
        </div>

        {error && (
          <div className="px-5 py-2.5 border-t border-steel-100 bg-danger-50 flex items-center gap-2 flex-shrink-0">
            <div className="w-4 h-4 flex items-center justify-center text-danger-600"><i className="ri-error-warning-line" /></div>
            <span className="text-sm text-danger-700">{error}</span>
          </div>
        )}

        {/* 底部按钮 */}
        <div className="px-5 py-3 border-t border-steel-100 flex items-center justify-end gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            确认呈核
          </button>
        </div>
      </div>
    </div>
  );
}