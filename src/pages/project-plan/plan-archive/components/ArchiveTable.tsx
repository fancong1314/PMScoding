import type { PlanArchiveRecord, PlanPriorityLevel } from '@/mocks/planArchiveMocks';

interface Props {
  records: PlanArchiveRecord[];
  pageOffset: number;
  sortDir: 'none' | 'asc' | 'desc';
  onPrioritySort: () => void;
  onView: (record: PlanArchiveRecord) => void;
  onViewLog: (record: PlanArchiveRecord) => void;
}

const SEQ_W = 56;
const PRIORITY_W = 96;

function PriorityBadge({ level }: { level: PlanPriorityLevel }) {
  const lv = level || 'C';
  const style =
    lv === 'A' ? 'bg-rose-50 text-rose-700 border-rose-200' :
    lv === 'B' ? 'bg-amber-50 text-amber-700 border-amber-200' :
    lv === 'C' ? 'bg-sky-50 text-sky-700 border-sky-200' :
    'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 text-xs font-semibold rounded-full border ${style}`}>
      {lv}类
    </span>
  );
}

export default function ArchiveTable({ records, pageOffset, sortDir, onPrioritySort, onView, onViewLog }: Props) {
  const hBg = '#f5f7fa';
  const leftName = SEQ_W + PRIORITY_W;
  const activeAsc = sortDir === 'asc';
  const activeDesc = sortDir === 'desc';

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left" style={{ minWidth: 1280 }}>
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-10 px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 w-14"
                style={{ backgroundColor: hBg }}>
                序号
              </th>
              <th
                className="sticky z-10 px-2 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap cursor-pointer select-none"
                style={{ left: SEQ_W, backgroundColor: hBg, width: PRIORITY_W }}
                onClick={onPrioritySort}
                title="按 A/B/C/D 正序或倒序排序"
              >
                <span className="inline-flex items-center justify-center">
                  优先级排序
                  <span className="flex flex-col leading-none -space-y-0.5 ml-0.5">
                    <i className={`ri-arrow-up-s-line text-[9px] ${activeAsc ? 'text-primary-600' : 'text-steel-300'}`} />
                    <i className={`ri-arrow-down-s-line text-[9px] ${activeDesc ? 'text-primary-600' : 'text-steel-300'}`} />
                  </span>
                </span>
              </th>
              <th className="sticky z-10 px-3 py-2 text-left text-xs font-medium text-steel-500 border-b border-r border-steel-200 min-w-[220px]"
                style={{ left: leftName, backgroundColor: hBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' }}>
                年度计划名称
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">年度计划号</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">计划年度</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">项目大类</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">项目类型</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">项目单位</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">投资总估算（万元）</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">效益（万元）</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">通过日期</th>
              <th className="sticky right-0 z-10 px-3 py-2 text-center text-xs font-medium text-steel-500 border-b border-l border-steel-200 whitespace-nowrap w-36"
                style={{ backgroundColor: hBg }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-14 text-center text-sm text-steel-400">暂无已通过的年度计划</td>
              </tr>
            ) : (
              records.map((r, idx) => {
                const rowBg = idx % 2 === 0 ? '#ffffff' : '#fafbfd';
                return (
                  <tr key={r.id} style={{ backgroundColor: rowBg }}>
                    <td className="sticky left-0 z-10 px-3 py-2 text-center text-sm text-steel-500 border-b border-steel-100" style={{ backgroundColor: rowBg }}>
                      {pageOffset + idx + 1}
                    </td>
                    <td className="sticky z-10 px-2 py-2 text-center border-b border-steel-100" style={{ left: SEQ_W, backgroundColor: rowBg }}>
                      <PriorityBadge level={r.priorityLevel} />
                    </td>
                    <td className="sticky z-10 px-3 py-2 text-sm border-b border-r border-steel-100" style={{ left: leftName, backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                      <button type="button" onClick={() => onView(r)}
                        className="text-left line-clamp-1 hover:underline cursor-pointer" style={{ color: '#2563eb' }} title={r.planName}>
                        {r.planName}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center text-xs font-mono text-steel-600 border-b border-steel-100 whitespace-nowrap">{r.planNo}</td>
                    <td className="px-3 py-2 text-center text-sm text-steel-700 border-b border-steel-100 whitespace-nowrap">{r.planYear}年</td>
                    <td className="px-3 py-2 text-center border-b border-steel-100">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">{r.projectMajorCategory}</span>
                    </td>
                    <td className="px-3 py-2 text-center text-sm text-steel-600 border-b border-steel-100 whitespace-nowrap">{r.projectType}</td>
                    <td className="px-3 py-2 text-center border-b border-steel-100">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-xs bg-slate-100 text-steel-600 whitespace-nowrap">{r.businessUnit}</span>
                    </td>
                    <td className="px-3 py-2 text-center text-sm font-medium text-steel-800 border-b border-steel-100 tabular-nums">{r.budget.toFixed(2)}</td>
                    <td className="px-3 py-2 text-center text-sm text-steel-600 border-b border-steel-100 tabular-nums">{r.benefit.toFixed(2)}</td>
                    <td className="px-3 py-2 text-center text-xs text-steel-500 border-b border-steel-100 whitespace-nowrap">{r.approveDate}</td>
                    <td className="sticky right-0 z-10 px-2 py-2 text-center border-b border-l border-steel-100" style={{ backgroundColor: rowBg }}>
                      <div className="inline-flex items-center justify-center gap-0.5">
                        <button type="button" onClick={() => onView(r)}
                          className="px-2 py-1 text-xs text-sky-600 hover:bg-sky-50 rounded cursor-pointer whitespace-nowrap">
                          详情
                        </button>
                        <button type="button" onClick={() => onViewLog(r)}
                          className="px-2 py-1 text-xs text-steel-600 hover:bg-slate-100 rounded cursor-pointer whitespace-nowrap"
                          title="操作日志">
                          操作日志
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
