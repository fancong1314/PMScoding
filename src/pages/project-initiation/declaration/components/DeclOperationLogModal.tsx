import { useState, useEffect } from 'react';
import { getDeclOperationLogs, declApprovalFlows, type DeclApprovalFlowNode } from '@/mocks/declarationOperationLogs';

interface Props {
  open: boolean;
  planId: string;
  planName: string;
  onClose: () => void;
}

type NodeStatus = DeclApprovalFlowNode['status'];

const nodeStatusStyle: Record<NodeStatus, { bg: string; border: string; icon: string; text: string; badge: string }> = {
  passed:   { bg: 'bg-emerald-50', border: 'border-emerald-400', icon: 'ri-checkbox-circle-line text-emerald-500', text: 'text-emerald-700', badge: '已通过' },
  current:  { bg: 'bg-amber-50',   border: 'border-amber-400',   icon: 'ri-loader-4-line text-amber-500',           text: 'text-amber-700',   badge: '审批中' },
  pending:  { bg: 'bg-slate-100',  border: 'border-slate-300',   icon: 'ri-time-line text-slate-400',               text: 'text-slate-500',   badge: '待审批' },
  rejected: { bg: 'bg-red-50',     border: 'border-red-400',     icon: 'ri-close-circle-line text-red-500',         text: 'text-red-700',     badge: '已驳回' },
  returned: { bg: 'bg-orange-50',  border: 'border-orange-400',  icon: 'ri-arrow-go-back-line text-orange-500',     text: 'text-orange-700',  badge: '已退回' },
};

export default function DeclOperationLogModal({ open, planId, planName, onClose }: Props) {
  const [flowNo, setFlowNo] = useState<string | null>(null);

  useEffect(() => {
    if (!open) setFlowNo(null);
  }, [open, planId]);

  if (!open) return null;

  const logs = getDeclOperationLogs(planId);
  const flow = flowNo ? declApprovalFlows[flowNo] : null;
  const nodes = flow?.nodes || [];
  const doneCount = nodes.filter((n) => n.status === 'passed').length;
  const progress = nodes.length > 0 ? Math.round((doneCount / nodes.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[900px] max-h-[85vh] flex flex-col overflow-hidden" style={{ maxWidth: '95vw' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h3 className="text-base font-semibold text-steel-800">操作记录</h3>
            <p className="text-xs text-steel-400 mt-0.5 truncate max-w-xl">{planName}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <table className="w-full border border-steel-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-50 border-b border-steel-200">
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">操作时间</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">操作人</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">操作</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">备注</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">审批记录</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-12 text-center text-sm text-steel-400">暂无数据</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-steel-100 hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{log.operateTime}</td>
                    <td className="px-3 py-2.5 text-sm text-steel-700">{log.operator}</td>
                    <td className="px-3 py-2.5 text-sm text-steel-700">{log.operation}</td>
                    <td className="px-3 py-2.5 text-sm text-steel-500">{log.remark || '—'}</td>
                    <td className="px-3 py-2.5 text-sm">
                      {log.approvalNo ? (
                        <button
                          type="button"
                          onClick={() => setFlowNo(log.approvalNo!)}
                          className="text-primary-600 hover:underline cursor-pointer font-mono text-xs inline-flex items-center gap-1"
                          title="查看可视化审批流程"
                        >
                          <i className="ri-flow-chart" />
                          {log.approvalNo}
                        </button>
                      ) : (
                        <span className="text-steel-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end px-5 py-3 border-t border-steel-100">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-slate-50 cursor-pointer">关闭</button>
        </div>
      </div>

      {flowNo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFlowNo(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-[540px] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-steel-100">
              <div>
                <h3 className="text-base font-semibold text-steel-800">审批记录</h3>
                <p className="text-xs text-steel-400 mt-0.5 font-mono">{flowNo}</p>
                <p className="text-xs text-steel-500 mt-0.5">{flow?.title || '审批流程可视化'}</p>
              </div>
              <button type="button" onClick={() => setFlowNo(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-b border-steel-100 flex-shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-steel-500">审批进度</span>
                <span className="text-xs font-semibold text-steel-700">{doneCount} / {nodes.length} 节点已完成</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {nodes.length === 0 ? (
                <p className="text-sm text-steel-400 text-center py-12">未找到对应审批流程数据</p>
              ) : (
                <div className="space-y-0">
                  {nodes.map((node, idx) => {
                    const style = nodeStatusStyle[node.status] || nodeStatusStyle.pending;
                    const isCurrent = node.status === 'current';
                    return (
                      <div key={`${node.name}-${idx}`} className="flex flex-col items-center">
                        {idx > 0 && (
                          <div className={`w-0.5 h-5 ${node.status === 'pending' ? 'bg-slate-200' : node.status === 'rejected' || node.status === 'returned' ? 'bg-red-200' : 'bg-emerald-300'}`} />
                        )}
                        <div className={`w-full border-2 rounded-xl p-4 transition-all ${style.bg} ${style.border} ${isCurrent ? 'ring-2 ring-offset-2 ring-amber-400' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
                              <i className={`${style.icon} text-base`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-steel-800">{node.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${style.bg} ${style.text} ${style.border}`}>
                                  {style.badge}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-steel-500">{node.role}</p>
                              {node.time && (
                                <p className="mt-1 text-xs text-steel-400"><i className="ri-time-line mr-1" />{node.time}</p>
                              )}
                              {node.opinion && (
                                <div className="mt-2 text-xs text-steel-600 bg-white/70 rounded-lg px-3 py-2 border border-steel-100">
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
          </div>
        </div>
      )}
    </div>
  );
}
