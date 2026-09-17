import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { SporadicAgreementRecord } from '@/mocks/sporadicProjectMocks';
import {
  sporadicAgreementStatusMap,
  sporadicUploadApproveStatusMap,
} from '@/mocks/sporadicProjectMocks';

export type AgreementTableMode = 'declare' | 'plan' | 'budget' | 'issue-pending' | 'issue-issued';

interface Props {
  rows: SporadicAgreementRecord[];
  selectedIds: string[];
  pageOffset: number;
  onToggleAll: (checked: boolean) => void;
  onToggleRow: (id: string) => void;
  /** 审查页不展示「是否紧急抢修」列 */
  hideUrgentColumn?: boolean;
  mode?: AgreementTableMode;
  onDelete?: (row: SporadicAgreementRecord) => void;
  onEdit?: (row: SporadicAgreementRecord) => void;
  onWithdraw?: (row: SporadicAgreementRecord) => void;
  onDetail?: (row: SporadicAgreementRecord) => void;
  onLog?: (row: SporadicAgreementRecord) => void;
  onUpload?: (row: SporadicAgreementRecord) => void;
  onIssue?: (row: SporadicAgreementRecord) => void;
  canDelete?: (row: SporadicAgreementRecord) => boolean;
  canEdit?: (row: SporadicAgreementRecord) => boolean;
  canWithdraw?: (row: SporadicAgreementRecord) => boolean;
  canUpload?: (row: SporadicAgreementRecord) => boolean;
}

function HoverTip({ text, children }: { text: string; children: ReactNode }) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<{ top: number; left: number; transform: string }>({
    top: 0, left: 0, transform: 'none',
  });

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const showBelow = rect.bottom + 56 < window.innerHeight;
    setStyle({
      top: showBelow ? rect.bottom + 8 : rect.top - 8,
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
          className="fixed z-[9999] pointer-events-none px-2.5 py-1.5 text-[12px] leading-snug text-white bg-steel-800 rounded-md shadow-lg max-w-[220px]"
          style={{ top: style.top, left: style.left, transform: style.transform }}
        >
          {text}
        </div>,
        document.body,
      )}
    </>
  );
}

/** 紧急抢修唯一视觉标识：申报名称旁红色警示角标 */
function UrgentMark() {
  return (
    <HoverTip text="紧急抢修 · 需优先处理">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-red-500 text-white shadow-sm shadow-red-200 cursor-help">
        <i className="ri-alarm-warning-fill text-[11px] leading-none" />
      </span>
    </HoverTip>
  );
}

export default function AgreementTable({
  rows,
  selectedIds,
  pageOffset,
  onToggleAll,
  onToggleRow,
  hideUrgentColumn = false,
  mode = 'declare',
  onDelete,
  onEdit,
  onWithdraw,
  onDetail,
  onLog,
  onUpload,
  onIssue,
  canDelete,
  canEdit,
  canWithdraw,
  canUpload,
}: Props) {
  const allChecked = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id));
  const thCls = 'px-3 py-2.5 text-xs font-semibold text-steel-500 text-left whitespace-nowrap';
  const tdCls = 'px-3 py-2.5 text-sm text-steel-700';
  const hBg = '#f8fafc';
  const isReview = mode === 'plan' || mode === 'budget';
  const isIssue = mode === 'issue-pending' || mode === 'issue-issued';
  const showActions = mode === 'declare' || isReview || isIssue;

  const colSpan = (() => {
    let n = 10; // checkbox + 序号 + 基础字段到申报状态
    if (!hideUrgentColumn) n += 1;
    if (mode === 'plan' || mode === 'budget') n += 3;
    if (mode === 'issue-issued') n += 2;
    if (showActions) n += 1;
    return n;
  })();

  const uploadLabel = mode === 'plan' ? '方案上传' : '预算上传';

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1280px]">
        <thead>
          <tr className="border-b border-steel-200" style={{ backgroundColor: hBg }}>
            <th className={`${thCls} w-10`}>
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => onToggleAll(e.target.checked)}
                className="cursor-pointer accent-sky-600"
              />
            </th>
            <th className={`${thCls} w-12 text-center`}>序号</th>
            <th className={thCls}>申报名称</th>
            {!hideUrgentColumn && <th className={`${thCls} text-center`}>是否紧急抢修</th>}
            <th className={thCls}>项目类型</th>
            <th className={thCls}>项目负责人</th>
            <th className={thCls}>计划开-完工时间</th>
            <th className={thCls}>申报时间</th>
            <th className={thCls}>供应商</th>
            <th className={thCls}>供应商负责人</th>
            <th className={`${thCls} text-center`}>申报状态</th>
            {mode === 'plan' && (
              <>
                <th className={thCls}>方案上传人</th>
                <th className={thCls}>方案上传时间</th>
                <th className={`${thCls} text-center`}>方案审批状态</th>
              </>
            )}
            {mode === 'budget' && (
              <>
                <th className={thCls}>预算上传人</th>
                <th className={thCls}>预算上传时间</th>
                <th className={`${thCls} text-center`}>预算审批状态</th>
              </>
            )}
            {mode === 'issue-issued' && (
              <>
                <th className={thCls}>签发人</th>
                <th className={thCls}>签发时间</th>
              </>
            )}
            {showActions && (
              <th
                className={`${thCls} text-center border-l`}
                style={{ position: 'sticky', right: 0, zIndex: 21, backgroundColor: hBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.1)' }}
              >
                操作
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="px-3 py-16 text-center text-sm text-steel-400">
                暂无数据
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => {
              const st = sporadicAgreementStatusMap[r.status];
              const planSt = sporadicUploadApproveStatusMap[r.planStatus || 'none'];
              const budgetSt = sporadicUploadApproveStatusMap[r.budgetStatus || 'none'];
              return (
                <tr key={r.id} className="border-b border-steel-100 hover:bg-slate-50/80 transition-colors">
                  <td className={tdCls}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={() => onToggleRow(r.id)}
                      className="cursor-pointer accent-sky-600"
                    />
                  </td>
                  <td className={`${tdCls} text-center text-steel-400 text-xs`}>{pageOffset + idx + 1}</td>
                  <td className={`${tdCls} font-medium max-w-[260px]`}>
                    <div className="flex items-center gap-2 min-w-0">
                      {!hideUrgentColumn && r.isUrgent && <UrgentMark />}
                      <span className="truncate text-steel-800" title={r.declareName}>{r.declareName}</span>
                    </div>
                  </td>
                  {!hideUrgentColumn && (
                    <td className={`${tdCls} text-center whitespace-nowrap`}>
                      {r.isUrgent ? (
                        <span className="text-red-600 font-medium">是</span>
                      ) : (
                        <span className="text-steel-400">否</span>
                      )}
                    </td>
                  )}
                  <td className={`${tdCls} whitespace-nowrap`}>
                    <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-slate-100 text-steel-600">
                      {r.projectType}
                    </span>
                  </td>
                  <td className={`${tdCls} whitespace-nowrap`}>
                    <div className="text-steel-700">{r.projectManager}</div>
                    <div className="text-xs text-steel-400 mt-0.5">{r.projectManagerPhone}</div>
                  </td>
                  <td className={`${tdCls} whitespace-nowrap text-xs text-steel-600`}>
                    {r.startDate}<span className="text-steel-300 mx-1">至</span>{r.endDate}
                  </td>
                  <td className={`${tdCls} whitespace-nowrap text-xs text-steel-500`}>{r.declareTime}</td>
                  <td className={`${tdCls} max-w-[160px]`}>
                    <div className="truncate" title={r.supplierName}>{r.supplierName}</div>
                    <div className="text-xs text-steel-400 mt-0.5 font-mono">{r.supplierNo}</div>
                  </td>
                  <td className={`${tdCls} whitespace-nowrap`}>
                    <div>{r.supplierContact}</div>
                    <div className="text-xs text-steel-400 mt-0.5">{r.supplierPhone}</div>
                  </td>
                  <td className={`${tdCls} text-center whitespace-nowrap`}>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${st.cls}`}>{st.label}</span>
                  </td>
                  {mode === 'plan' && (
                    <>
                      <td className={`${tdCls} whitespace-nowrap`}>{r.planUploader || '—'}</td>
                      <td className={`${tdCls} whitespace-nowrap text-xs text-steel-500`}>{r.planUploadTime || '—'}</td>
                      <td className={`${tdCls} text-center whitespace-nowrap`}>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${planSt.cls}`}>{planSt.label}</span>
                      </td>
                    </>
                  )}
                  {mode === 'budget' && (
                    <>
                      <td className={`${tdCls} whitespace-nowrap`}>{r.budgetUploader || '—'}</td>
                      <td className={`${tdCls} whitespace-nowrap text-xs text-steel-500`}>{r.budgetUploadTime || '—'}</td>
                      <td className={`${tdCls} text-center whitespace-nowrap`}>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${budgetSt.cls}`}>{budgetSt.label}</span>
                      </td>
                    </>
                  )}
                  {mode === 'issue-issued' && (
                    <>
                      <td className={`${tdCls} whitespace-nowrap`}>{r.issuer || '—'}</td>
                      <td className={`${tdCls} whitespace-nowrap text-xs text-steel-500`}>{r.issueTime || '—'}</td>
                    </>
                  )}
                  {mode === 'declare' && (
                    <td
                      className="px-2 py-2 text-center border-l bg-white whitespace-nowrap"
                      style={{ position: 'sticky', right: 0, zIndex: 10, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.08)' }}
                    >
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          disabled={!canEdit?.(r)}
                          onClick={() => onEdit?.(r)}
                          className="px-1.5 py-1 text-xs text-sky-600 hover:bg-sky-50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          修改
                        </button>
                        <button
                          type="button"
                          onClick={() => onDetail?.(r)}
                          className="px-1.5 py-1 text-xs text-steel-600 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          详情
                        </button>
                        <button
                          type="button"
                          disabled={!canWithdraw?.(r)}
                          onClick={() => onWithdraw?.(r)}
                          className="px-1.5 py-1 text-xs text-amber-600 hover:bg-amber-50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          撤回
                        </button>
                        <button
                          type="button"
                          disabled={!canDelete?.(r)}
                          onClick={() => onDelete?.(r)}
                          className="px-1.5 py-1 text-xs text-red-500 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          删除
                        </button>
                        <button
                          type="button"
                          onClick={() => onLog?.(r)}
                          className="px-1.5 py-1 text-xs text-steel-500 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          操作记录
                        </button>
                      </div>
                    </td>
                  )}
                  {isReview && (
                    <td
                      className="px-2 py-2 text-center border-l bg-white whitespace-nowrap"
                      style={{ position: 'sticky', right: 0, zIndex: 10, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.08)' }}
                    >
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          disabled={!canUpload?.(r)}
                          onClick={() => onUpload?.(r)}
                          className="px-1.5 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {uploadLabel}
                        </button>
                        <button
                          type="button"
                          disabled={!canEdit?.(r)}
                          onClick={() => onEdit?.(r)}
                          className="px-1.5 py-1 text-xs text-sky-600 hover:bg-sky-50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          修改
                        </button>
                        <button
                          type="button"
                          disabled={!canWithdraw?.(r)}
                          onClick={() => onWithdraw?.(r)}
                          className="px-1.5 py-1 text-xs text-amber-600 hover:bg-amber-50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          撤回
                        </button>
                      </div>
                    </td>
                  )}
                  {isIssue && (
                    <td
                      className="px-2 py-2 text-center border-l bg-white whitespace-nowrap"
                      style={{ position: 'sticky', right: 0, zIndex: 10, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.08)' }}
                    >
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => onDetail?.(r)}
                          className="px-1.5 py-1 text-xs text-steel-600 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          详情
                        </button>
                        {mode === 'issue-pending' && (
                          <button
                            type="button"
                            onClick={() => onIssue?.(r)}
                            className="px-1.5 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                          >
                            签发
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
