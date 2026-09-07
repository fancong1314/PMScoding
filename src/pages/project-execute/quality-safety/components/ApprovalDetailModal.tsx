import { type Issue } from '@/mocks/qualitySafetyMocks';

interface ApprovalDetailModalProps {
  open: boolean;
  issue: Issue | null;
  onClose: () => void;
}

export default function ApprovalDetailModal({ open, issue, onClose }: ApprovalDetailModalProps) {
  if (!open || !issue) return null;

  const getStatusIcon = (status: string) => {
    if (status === '已通过') return <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100"><i className="ri-check-line text-xs text-green-600" /></div>;
    if (status === '已驳回') return <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100"><i className="ri-close-line text-xs text-red-600" /></div>;
    return <div className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-time-line text-xs text-slate-500" /></div>;
  };

  const getStatusLine = (status: string, index: number, total: number) => {
    const isLast = index === total - 1;
    return (
      <div className="flex flex-col items-center">
        {getStatusIcon(status)}
        {!isLast && <div className="w-0.5 h-8 bg-steel-200 my-1" />}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">审批详情 - {issue.issueNo}</h3>
            <p className="text-xs text-steel-400 mt-0.5">可视化审批流程及节点状态</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-3 border border-steel-100">
            <div>
              <label className="text-xs text-steel-400 block mb-1">问题编号</label>
              <span className="text-sm text-steel-700 font-mono">{issue.issueNo}</span>
            </div>
            <div>
              <label className="text-xs text-steel-400 block mb-1">问题类型</label>
              <span className="text-sm text-steel-700">{issue.issueType}</span>
            </div>
          </div>

          {/* 可视化流程 */}
          <div>
            <h4 className="text-sm font-medium text-steel-700 mb-3">审批流程</h4>
            <div className="bg-slate-50 rounded-lg p-4 border border-steel-100">
              <div className="flex items-center justify-center gap-4 mb-4">
                {issue.approvalHistory.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === '已通过' ? 'bg-green-100' : item.status === '已驳回' ? 'bg-red-100' : 'bg-slate-100'}`}>
                        <i className={`${idx === 0 ? 'ri-user-settings-line' : 'ri-building-2-line'} ${item.status === '已通过' ? 'text-green-600' : item.status === '已驳回' ? 'text-red-600' : 'text-slate-500'}`} />
                      </div>
                      <span className="text-xs text-steel-600 mt-1 whitespace-nowrap">{item.node}</span>
                    </div>
                    {idx < issue.approvalHistory.length - 1 && (
                      <div className="flex items-center gap-1 mb-5">
                        <div className="w-8 h-0.5 bg-green-400" />
                        <i className="ri-arrow-right-line text-xs text-green-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 审批记录 */}
          <div>
            <h4 className="text-sm font-medium text-steel-700 mb-3">审批记录</h4>
            <div className="space-y-3">
              {issue.approvalHistory.map((item, idx) => (
                <div key={item.id} className="flex gap-3">
                  {getStatusLine(item.status, idx, issue.approvalHistory.length)}
                  <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-steel-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-steel-700">{item.node}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === '已通过' ? 'bg-green-50 text-green-700 border border-green-200' : item.status === '已驳回' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'}`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="text-xs text-steel-400">{item.time}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-steel-400">审批人：</span>
                        <span className="text-sm text-steel-700">{item.approver}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-steel-400">审批意见：</span>
                      <p className="text-sm text-steel-700 mt-0.5">{item.opinion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}