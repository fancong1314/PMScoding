import { getScheduleRecords } from '@/mocks/signboardMocks';

interface Props {
  contractId: string;
  contractName: string;
  type: 'schedule' | 'item';
  processItemName?: string;
  onClose: () => void;
}

export default function ApprovalRecordModal({ contractId, contractName, type, processItemName, onClose }: Props) {
  const records = getScheduleRecords(contractId);

  const roleBadge: Record<string, string> = {
    '施工方': 'bg-blue-50 text-blue-700 border-blue-200',
    '监理': 'bg-amber-50 text-amber-700 border-amber-200',
    '项目组': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl w-[720px] max-h-[85vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              {type === 'schedule' ? '工序预排审批记录' : '工序验收审批记录'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{contractName}{processItemName ? ` — ${processItemName}` : ''}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer text-slate-400">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="p-5">
          <div className="relative pl-8">
            {records.map((rec, idx) => (
              <div key={rec.id} className="relative pb-6 last:pb-0">
                {/* Timeline dot & line */}
                <div className="absolute left-[-28px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                {idx < records.length - 1 && <div className="absolute left-[-27px] top-3 w-px h-full bg-slate-200" />}

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700">{rec.operationType}</span>
                      <span className={`px-1.5 py-0.5 text-xs rounded border ${roleBadge[rec.operatorRole] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>{rec.operatorRole}</span>
                    </div>
                    <span className="text-xs text-slate-400">{rec.operationTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500">操作人：</span>
                    <span className="text-slate-800 font-medium">{rec.operator}</span>
                  </div>
                  <div className="mt-1.5 text-sm text-slate-600">
                    <span className="text-slate-500">操作说明：</span>
                    {rec.operationDesc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {records.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2 text-sm text-amber-700">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-information-line" /></div>
              当前节点：<span className="font-medium">项目组审批中</span>，待项目组最终审批
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-5 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}