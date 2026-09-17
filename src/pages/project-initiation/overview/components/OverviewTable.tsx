import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { InitiationOverviewRecord } from '@/mocks/initiationOverviewMocks';

interface Props {
  records: InitiationOverviewRecord[];
  selectedRows: string[];
  pageOffset: number;
  totalCount: number;
  totalBudget: number;
  totalActual: number;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onView: (record: InitiationOverviewRecord) => void;
  onViewLog: (record: InitiationOverviewRecord) => void;
}

const CHECK_W = 44;
const SEQ_W = 52;
const NAME_W = 240;
const ACTION_W = 140;

function HoverTip({ text, children }: { text: string; children: ReactNode }) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<{ top: number; left: number; transform: string }>({
    top: 0,
    left: 0,
    transform: 'none',
  });

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    const showBelow = rect.bottom + 64 < window.innerHeight;
    setStyle({
      top: showBelow ? rect.bottom + gap : rect.top - gap,
      left: Math.min(Math.max(12, rect.left + rect.width / 2), window.innerWidth - 12),
      transform: showBelow ? 'translateX(-50%)' : 'translate(-50%, -100%)',
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const hide = () => setOpen(false);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [open]);

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex items-center flex-shrink-0"
        onMouseEnter={place}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </span>
      {open && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none px-2.5 py-1.5 text-[12px] leading-snug text-white bg-steel-800 rounded-md shadow-lg max-w-[240px] whitespace-normal"
          style={{ top: style.top, left: style.left, transform: style.transform }}
        >
          {text}
        </div>,
        document.body
      )}
    </>
  );
}

function StatusIcon({ status }: { status: InitiationOverviewRecord['status'] }) {
  if (status === 'normal') return null;
  const paused = status === 'paused';
  return (
    <HoverTip text={paused ? '当前项目已暂停' : '当前项目已终止'}>
      <span
        className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-sm cursor-help ${
          paused ? 'bg-amber-400' : 'bg-red-500'
        }`}
      >
        <i className={`text-[9px] leading-none text-white ${paused ? 'ri-pause-mini-fill' : 'ri-stop-mini-fill'}`} />
      </span>
    </HoverTip>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <HoverTip text={text}>
      <i className="ri-information-line text-sky-500 text-xs cursor-help ml-0.5" />
    </HoverTip>
  );
}

const thCls = 'border-b border-steel-200 px-3 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap';
const tdCls = 'px-3 py-2.5 text-sm border-b border-steel-100 whitespace-nowrap';

export default function OverviewTable({
  records, selectedRows, pageOffset,
  totalCount, totalBudget, totalActual,
  onToggleSelectAll, onToggleSelectRow, onView, onViewLog,
}: Props) {
  const hBg = '#f5f7fa';
  const footBg = '#eef6ff';
  const isAllSelected = records.length > 0 && records.every((r) => selectedRows.includes(r.id));
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected;
  const nameLeft = CHECK_W + SEQ_W;
  const totalW = CHECK_W + SEQ_W + NAME_W + 110 + 110 + 110 + 140 + 110 + 150 + 150 + 160 + 200 + ACTION_W;

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table style={{ width: `${totalW}px`, minWidth: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
          <colgroup>
            <col style={{ width: CHECK_W }} />
            <col style={{ width: SEQ_W }} />
            <col style={{ width: NAME_W }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 200 }} />
            <col style={{ width: ACTION_W }} />
          </colgroup>
          <thead>
            <tr>
              <th className={`${thCls} text-center px-2`}
                style={{ position: 'sticky', left: 0, zIndex: 21, backgroundColor: hBg }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-steel-300 cursor-pointer"
                />
              </th>
              <th className={`${thCls} text-center px-2`}
                style={{ position: 'sticky', left: CHECK_W, zIndex: 21, backgroundColor: hBg }}>
                序号
              </th>
              <th className={`${thCls} text-left border-r`}
                style={{ position: 'sticky', left: nameLeft, zIndex: 21, backgroundColor: hBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' }}>
                项目名称
              </th>
              <th className={`${thCls} text-left`} style={{ backgroundColor: hBg }}>立项号</th>
              <th className={`${thCls} text-left`} style={{ backgroundColor: hBg }}>年度计划号</th>
              <th className={`${thCls} text-left`} style={{ backgroundColor: hBg }}>项目提报单位</th>
              <th className={`${thCls} text-left`} style={{ backgroundColor: hBg }}>项目类型</th>
              <th className={`${thCls} text-left`} style={{ backgroundColor: hBg }}>立项日期</th>
              <th className={`${thCls} text-right`} style={{ backgroundColor: hBg }}>
                立项总概算（万元）
                <InfoTip text="增补后的项目金额" />
              </th>
              <th className={`${thCls} text-right`} style={{ backgroundColor: hBg }}>
                项目实际金额（万元）
                <InfoTip text="已签订合同总额" />
              </th>
              <th className={`${thCls} text-left`} style={{ backgroundColor: hBg }}>项目负责人</th>
              <th className={`${thCls} text-left`} style={{ backgroundColor: hBg }}>
                计划开/完工时间
                <InfoTip text="项目计划开工日期至计划完工日期" />
              </th>
              <th className={`${thCls} text-center px-2 border-l`}
                style={{ position: 'sticky', right: 0, zIndex: 21, backgroundColor: hBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.1)' }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-3 py-16 text-center text-sm text-steel-400">
                  暂无符合条件的项目
                </td>
              </tr>
            ) : (
              records.map((r, idx) => {
                const isSel = selectedRows.includes(r.id);
                const rowBg = isSel ? '#eff6ff' : idx % 2 === 0 ? '#ffffff' : '#fafbfd';
                return (
                  <tr key={r.id} style={{ backgroundColor: rowBg }}>
                    <td className={`${tdCls} text-center px-2`}
                      style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: rowBg }}>
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => onToggleSelectRow(r.id)}
                        className="w-4 h-4 rounded border-steel-300 cursor-pointer"
                      />
                    </td>
                    <td className={`${tdCls} text-center text-steel-500 px-2`}
                      style={{ position: 'sticky', left: CHECK_W, zIndex: 10, backgroundColor: rowBg }}>
                      {pageOffset + idx + 1}
                    </td>
                    <td className={`${tdCls} border-r`}
                      style={{ position: 'sticky', left: nameLeft, zIndex: 10, backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                      <div className="flex items-center gap-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => onView(r)}
                          className="text-left truncate leading-5 hover:underline cursor-pointer text-sky-600 min-w-0"
                          title={r.projectName}
                        >
                          {r.projectName}
                        </button>
                        <StatusIcon status={r.status} />
                      </div>
                    </td>
                    <td className={`${tdCls} font-mono text-xs text-steel-700`}>
                      {r.approvalNo}
                    </td>
                    <td className={`${tdCls} font-mono text-xs text-steel-700`}>
                      {r.annualPlanNo || '—'}
                    </td>
                    <td className={`${tdCls} text-steel-600`}>{r.businessUnit}</td>
                    <td className={`${tdCls} text-steel-600`}>{r.projectType}</td>
                    <td className={`${tdCls} text-steel-500`}>{r.approvalDate}</td>
                    <td className={`${tdCls} text-steel-800 font-medium text-right`}>
                      {r.budgetAmount.toFixed(2)}
                    </td>
                    <td className={`${tdCls} text-steel-800 font-medium text-right`}>
                      {r.actualAmount.toFixed(2)}
                    </td>
                    <td className={`${tdCls} text-steel-600`}>
                      {r.projectManager}
                      {r.projectManagerPhone ? ` (${r.projectManagerPhone})` : ''}
                    </td>
                    <td className={`${tdCls} text-steel-500`}>
                      {r.startDate} 至 {r.endDate}
                    </td>
                    <td className={`${tdCls} text-center px-2 border-l`}
                      style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: rowBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                      <div className="inline-flex items-center justify-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => onView(r)}
                          className="px-1.5 py-1 text-xs rounded cursor-pointer whitespace-nowrap text-sky-600 hover:bg-sky-50"
                        >
                          详情
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewLog(r)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-steel-400 hover:text-steel-700 cursor-pointer"
                          title="操作记录"
                        >
                          <i className="ri-history-line text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {records.length > 0 && (
            <tfoot>
              <tr>
                <td className="px-2 py-2.5 text-sm font-semibold text-steel-700 border-t border-sky-100 text-center whitespace-nowrap"
                  style={{ position: 'sticky', left: 0, zIndex: 11, backgroundColor: footBg }}
                  colSpan={2}>
                  总合计
                </td>
                <td className="px-3 py-2.5 text-sm font-semibold text-steel-800 border-t border-r border-sky-100 whitespace-nowrap"
                  style={{ position: 'sticky', left: nameLeft, zIndex: 11, backgroundColor: footBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                  {totalCount}
                </td>
                <td colSpan={5} className="border-t border-sky-100" style={{ backgroundColor: footBg }} />
                <td className="px-3 py-2.5 text-sm font-semibold text-steel-800 border-t border-sky-100 text-right whitespace-nowrap"
                  style={{ backgroundColor: footBg }}>
                  {totalBudget.toFixed(2)}
                </td>
                <td className="px-3 py-2.5 text-sm font-semibold text-steel-800 border-t border-sky-100 text-right whitespace-nowrap"
                  style={{ backgroundColor: footBg }}>
                  {totalActual.toFixed(2)}
                </td>
                <td colSpan={2} className="border-t border-sky-100" style={{ backgroundColor: footBg }} />
                <td className="border-t border-l border-sky-100"
                  style={{ position: 'sticky', right: 0, zIndex: 11, backgroundColor: footBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.06)' }} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
