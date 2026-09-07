import type { WBSApprovalRecord } from '@/mocks/contractProgressMocks';

interface ApprovalRecordModalProps {
  records: WBSApprovalRecord[];
  onClose: () => void;
}

export default function ApprovalRecordModal({ records, onClose }: ApprovalRecordModalProps) {
  // 过滤掉草稿记录，只保留提交/审批/修改等过程
  const filteredRecords = records.filter((r) => !r.operationType.includes('草稿'));

  const typeStyle = (type: string, result?: string) => {
    if (result === '通过') return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (result === '驳回') return { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200' };
    if (type.includes('提交')) return { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (type.includes('重新')) return { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (type.includes('变更')) return { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-200' };
    return { dot: 'bg-steel-400', badge: 'bg-slate-50 text-slate-600 border-slate-200' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[720px] max-w-[90vw] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #e8edf3' }}>
          <h3 className="text-sm font-semibold text-steel-800">审批记录</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-0">
            {filteredRecords.map((rec, idx) => {
              const isLast = idx === filteredRecords.length - 1;
              const style = typeStyle(rec.operationType, rec.result);
              return (
                <div key={rec.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                    {!isLast && <div className="w-px flex-1 bg-steel-200 mt-1" />}
                  </div>
                  <div className="pb-5 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-steel-800">{rec.operationType}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${style.badge}`}>
                        {rec.operationSide}
                      </span>
                      {rec.result && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${rec.result === '通过' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {rec.result}
                        </span>
                      )}
                      <span className="text-xs text-steel-400">{rec.operationTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-steel-500 mb-1">
                      <span>操作人: {rec.operator}</span>
                      <span>|</span>
                      <span>版本: {rec.versionNo}</span>
                    </div>
                    <p className="text-sm text-steel-600 mb-2">{rec.operationDesc}</p>
                    {rec.result === '通过' && rec.passNote && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 mt-1">
                        <p className="text-xs text-emerald-600 font-medium mb-1">通过说明</p>
                        <p className="text-sm text-emerald-700">{rec.passNote}</p>
                      </div>
                    )}
                    {rec.result === '驳回' && rec.rejectReason && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-1">
                        <p className="text-xs text-red-600 font-medium mb-1">驳回原因</p>
                        <p className="text-sm text-red-700 leading-relaxed">{rec.rejectReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-3 flex justify-end" style={{ borderTop: '1px solid #e8edf3' }}>
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}