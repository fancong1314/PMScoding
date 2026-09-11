import type { PlanArchiveRecord, PlanOccupyDetailItem } from '@/mocks/planArchiveMocks';
import { getPlanOccupyDetails } from '@/mocks/planArchiveMocks';

interface Props {
  open: boolean;
  record: PlanArchiveRecord | null;
  onClose: () => void;
}

export default function OccupyDetailModal({ open, record, onClose }: Props) {
  if (!open || !record) return null;

  const rows: PlanOccupyDetailItem[] = getPlanOccupyDetails(record.id, record.occupiedAmount);
  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg border border-steel-200 w-[720px] max-w-[92vw] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-steel-100">
          <div>
            <h3 className="text-base font-semibold text-steel-900">计划占用金额明细</h3>
            <p className="text-xs text-steel-400 mt-0.5 line-clamp-1">{record.planName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-steel-400 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="overflow-hidden rounded-md border border-steel-200">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr style={{ backgroundColor: '#e8f0fe' }}>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-700 border-b border-steel-200">项目名称</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-700 border-b border-steel-200 whitespace-nowrap w-36">立项号</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-700 border-b border-steel-200 whitespace-nowrap w-32 text-right">项目金额(万元)</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-700 border-b border-steel-200 whitespace-nowrap w-24 text-center">是否立项</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-10 text-center text-sm text-steel-400">
                      暂无费用占用明细
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-2.5 text-sm text-steel-800 border-b border-steel-100">{row.projectName}</td>
                      <td className="px-3 py-2.5 text-xs font-mono text-steel-600 border-b border-steel-100 whitespace-nowrap">
                        {row.projectNo || '—'}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-steel-800 border-b border-steel-100 text-right tabular-nums">
                        {row.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-center border-b border-steel-100">
                        {row.initiated ? (
                          <span className="text-emerald-600">是</span>
                        ) : (
                          <span className="text-steel-500">否</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {rows.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-50">
                    <td className="px-3 py-2.5 text-xs font-medium text-steel-600" colSpan={2}>
                      合计占用
                    </td>
                    <td className="px-3 py-2.5 text-sm font-semibold text-steel-800 text-right tabular-nums">
                      {total.toFixed(2)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-300 rounded-md hover:bg-slate-50 cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
