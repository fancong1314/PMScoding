import { planApprovalFlows } from '@/mocks/planDeferralMocks';

interface Props {
  open: boolean;
  flowId: string;
  onClose: () => void;
}

type NodeStatus = 'passed' | 'current' | 'pending' | 'rejected';

const nodeStatusStyle: Record<NodeStatus, { bg: string; border: string; icon: string; text: string }> = {
  passed:   { bg: 'bg-emerald-50', border: 'border-emerald-400', icon: 'ri-checkbox-circle-line text-emerald-500', text: 'text-emerald-700' },
  current:  { bg: 'bg-amber-50',   border: 'border-amber-400',   icon: 'ri-loader-4-line text-amber-500',           text: 'text-amber-700' },
  pending:  { bg: 'bg-slate-100',  border: 'border-slate-300',   icon: 'ri-time-line text-slate-400',               text: 'text-slate-500' },
  rejected: { bg: 'bg-red-50',     border: 'border-red-400',     icon: 'ri-close-circle-line text-red-500',         text: 'text-red-700' },
};

const nodeStatusLabel: Record<NodeStatus, string> = {
  passed:   '已通过',
  current:  '审批中',
  pending:  '待审批',
  rejected: '已驳回',
};

export default function PlanApprovalFlowModal({ open, flowId, onClose }: Props) {
  if (!open) return null;

  const flowData = planApprovalFlows[flowId as keyof typeof planApprovalFlows];
  const nodes = flowData?.nodes ?? [];

  const totalNodes = nodes.length;
  const approvedCount = nodes.filter((n) => n.status === 'passed').length;
  const progress = totalNodes > 0 ? Math.round((approvedCount / totalNodes) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-[540px] max-h-[85vh] bg-white rounded-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-steel-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-steel-900">审批记录</h2>
            <p className="text-xs text-steel-400 mt-0.5">完整的审批流程可视化展示</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-steel-400 hover:text-steel-600">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-steel-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-steel-500">审批进度</span>
            <span className="text-xs font-semibold text-steel-700">{approvedCount} / {totalNodes} 节点已完成</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }}
            />
          </div>
        </div>

        {/* Flow Nodes */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {nodes.length === 0 ? (
            <div className="text-center py-12 text-steel-400 text-sm">暂无审批记录</div>
          ) : (
            <div className="space-y-0">
              {nodes.map((node, idx) => {
                const style = nodeStatusStyle[node.status as NodeStatus] ?? nodeStatusStyle.pending;
                const isCurrent = node.status === 'current';
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    {idx > 0 && (
                      <div className={`w-0.5 h-6 ${node.status === 'pending' ? 'bg-slate-200' : 'bg-emerald-300'}`} />
                    )}
                    <div className={`w-full border-2 rounded-xl p-4 transition-all ${style.bg} ${style.border} ${isCurrent ? 'ring-2 ring-offset-2 ring-amber-400' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className={`${style.icon} text-base`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-steel-800">{node.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text} border ${style.border}`}>
                              {nodeStatusLabel[node.status as NodeStatus] ?? node.status}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-steel-500">
                            <span className="mr-3"><i className="ri-user-line mr-1" />{node.person}</span>
                            <span className="text-steel-400">{node.role}</span>
                          </div>
                          {node.time && (
                            <div className="mt-1 text-xs text-steel-400">
                              <i className="ri-time-line mr-1" />{node.time}
                            </div>
                          )}
                          {node.opinion && (
                            <div className="mt-2 text-xs text-steel-600 bg-white/60 rounded-lg px-3 py-2 border border-current/10">
                              <i className="ri-chat-1-line mr-1.5" />{node.opinion}
                            </div>
                          )}
                          {isCurrent && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              当前审批节点
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-steel-100 flex-shrink-0 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
