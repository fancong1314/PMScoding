import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type EstimateChangeLog } from '@/mocks/designReviewMocks';

interface ChangeLogModalProps {
  logs: EstimateChangeLog[];
  onClose: () => void;
  formatMoney: (n: number) => string;
}

function ApprovalFlowPopup({ log, onClose }: { log: EstimateChangeLog; onClose: () => void }) {
  const getNodeColor = (status: string) => {
    if (status === '已通过') return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', line: 'bg-emerald-200' };
    if (status === '已驳回') return { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200', line: 'bg-red-200' };
    return { dot: 'bg-slate-300', badge: 'bg-slate-100 text-slate-600 border-slate-200', line: 'bg-slate-200' };
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-steel-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-semibold text-steel-800">审批流程详情</h3>
            <p className="text-xs text-steel-400 mt-0.5">
              修改人：{log.changedBy} · {log.changedAt}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
            <i className="ri-close-line text-steel-500" />
          </button>
        </div>
        <div className="p-5">
          <div className="space-y-0">
            {log.approvalFlow.map((node, idx) => {
              const color = getNodeColor(node.status);
              const isLast = idx === log.approvalFlow.length - 1;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${color.dot}`}>
                      {node.status === '已通过' ? <i className="ri-check-line" /> : node.status === '已驳回' ? <i className="ri-close-line" /> : idx + 1}
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 my-1 min-h-[24px] ${color.line}`} />}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-steel-800">{node.node}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${color.badge}`}>{node.status}</span>
                    </div>
                    <p className="text-xs text-steel-500">审批人：{node.approver}</p>
                    {node.time && <p className="text-xs text-steel-400 mt-0.5">{node.time}</p>}
                    {node.comment && (
                      <div className="mt-1.5 px-3 py-2 bg-slate-50 rounded-md border border-steel-100">
                        <p className="text-xs text-steel-600">{node.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-steel-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">关闭</button>
        </div>
      </div>
    </div>
  );
}

export default function ChangeLogModal({ logs, onClose, formatMoney }: ChangeLogModalProps) {
  const navigate = useNavigate();
  const [approvalLog, setApprovalLog] = useState<EstimateChangeLog | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '已通过': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '审批中': return 'bg-amber-50 text-amber-700 border-amber-200';
      case '已驳回': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const handleViewDetail = (log: EstimateChangeLog) => {
    onClose();
    navigate(`/project-prepare/preliminary-design/estimate-review/change-detail?id=${encodeURIComponent(log.id)}`);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-xl border border-steel-200 w-full max-w-4xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-steel-100 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-base font-semibold text-steel-900">概算修改日志</h3>
              <p className="text-xs text-steel-400 mt-0.5">共 {logs.length} 条修改记录，点击操作查看详情</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
              <i className="ri-close-line text-steel-500" />
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100">
                  <i className="ri-history-line text-3xl text-steel-300" />
                </div>
                <p className="text-sm text-steel-400">暂无修改记录</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10">
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">序号</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">修改人</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">修改时间</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">审批结果</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">金额变化</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => {
                    const beforeTotal = log.beforeItems.reduce((s, i) => i.parentId === null ? s + i.revisedAmount : s, 0);
                    const afterTotal = log.afterItems.reduce((s, i) => i.parentId === null ? s + i.revisedAmount : s, 0);
                    const diff = afterTotal - beforeTotal;
                    const changedCount = log.afterItems.filter((a) => {
                      const b = log.beforeItems.find((bi) => bi.id === a.id);
                      return !b || b.revisedAmount !== a.revisedAmount;
                    }).length;

                    return (
                      <tr key={log.id} className="border-b border-steel-100 hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 text-sm text-steel-500 whitespace-nowrap">{idx + 1}</td>
                        <td className="px-4 py-3.5 text-sm text-steel-800 font-medium whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                              {log.changedBy.charAt(0)}
                            </div>
                            {log.changedBy}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-steel-600 whitespace-nowrap">{log.changedAt}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(log.approvalResult)}`}>
                            {log.approvalResult}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <span className={`font-mono text-sm font-semibold ${diff > 0 ? 'text-amber-600' : diff < 0 ? 'text-emerald-600' : 'text-steel-400'}`}>
                              {diff > 0 ? '+' : ''}{formatMoney(diff)}
                            </span>
                            <span className="text-xs text-steel-400">{changedCount}项变更</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setApprovalLog(log)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                            >
                              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-flow-chart text-xs" /></div>
                              审批结果
                            </button>
                            <button
                              onClick={() => handleViewDetail(log)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap"
                              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                            >
                              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-list-check text-xs" /></div>
                              修改详情
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-steel-100 flex items-center justify-between flex-shrink-0">
            <span className="text-xs text-steel-400">
              点击「修改详情」可查看修改前后概算明细对比
            </span>
            <button onClick={onClose} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
              关闭
            </button>
          </div>
        </div>
      </div>

      {/* Approval Flow Popup */}
      {approvalLog && (
        <ApprovalFlowPopup log={approvalLog} onClose={() => setApprovalLog(null)} />
      )}
    </>
  );
}