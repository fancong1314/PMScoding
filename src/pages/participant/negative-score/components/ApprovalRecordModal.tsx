import { type DeductionRecord } from '@/mocks/participantManagementMocks';

interface ApprovalRecordModalProps {
  open: boolean;
  record: DeductionRecord | null;
  onClose: () => void;
}

export default function ApprovalRecordModal({ open, record, onClose }: ApprovalRecordModalProps) {
  if (!open || !record) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[640px] max-h-[80vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">审批记录</h3>
            <p className="text-xs text-steel-400 mt-0.5">扣分记录编号：{record.id}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-3 border border-steel-100">
            <div>
              <label className="text-xs text-steel-400 block mb-1">单位名称</label>
              <span className="text-sm text-steel-700">{record.participantName}</span>
            </div>
            <div>
              <label className="text-xs text-steel-400 block mb-1">扣分类别</label>
              <span className="text-sm text-steel-700">{record.deductionCategory}</span>
            </div>
            <div>
              <label className="text-xs text-steel-400 block mb-1">负面积分</label>
              <span className="text-sm text-steel-700 font-medium">{record.score} 分</span>
            </div>
            <div>
              <label className="text-xs text-steel-400 block mb-1">当前状态</label>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                record.status === '待审批' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                record.status === '已通过' ? 'bg-green-50 text-green-700 border border-green-200' :
                record.status === '已驳回' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-slate-100 text-slate-500'
              }`}>
                {record.status}
              </span>
            </div>
          </div>

          {/* 审批历史 */}
          <div>
            <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)' }} />
              审批历史
            </h4>
            {record.approvalHistory.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-lg border border-steel-100">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                  <i className="ri-time-line text-xl text-steel-300" />
                </div>
                <p className="text-sm text-steel-400">暂无审批记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {record.approvalHistory.map((item, idx) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        item.color === 'green' ? 'bg-green-500' :
                        item.color === 'red' ? 'bg-red-500' : 'bg-steel-400'
                      }`} />
                      {idx < record.approvalHistory.length - 1 && <div className="w-px flex-1 bg-steel-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-steel-700">{item.node}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.status === '已通过' ? 'bg-green-50 text-green-700 border border-green-200' :
                              item.status === '已驳回' ? 'bg-red-50 text-red-700 border border-red-200' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <span className="text-xs text-steel-400">{item.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-steel-600">
                          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-user-line" /></div>
                          审批人：{item.approver}
                        </div>
                        <p className="text-sm text-steel-700 mt-1.5">{item.opinion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}