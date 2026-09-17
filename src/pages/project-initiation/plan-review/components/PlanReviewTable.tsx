import { useState } from 'react';
import type { PlanReviewRecord } from '@/mocks/planReviewMocks';
import { getOpinionSignSummary, planReviewStatusMap } from '@/mocks/planReviewMocks';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import ColumnSettingsPanel from '@/pages/project-plan/declaration/components/ColumnSettingsPanel';
import JointReviewPassModal, { type JointReviewPassPayload } from './JointReviewPassModal';
import OpinionSignRecordsModal from './OpinionSignRecordsModal';
import JointReviewSmsModal from './JointReviewSmsModal';

type ReviewDept = 'business-unit' | 'professional-dept' | 'chief-engineer' | 'operations-dept' | 'budget-committee' | 'zhongte-stage';
type ActionMode = 'pending_joint' | 'reviewing';

interface Props {
  records: PlanReviewRecord[];
  selectedRows: string[];
  columns: ColumnDef[];
  reviewDept: ReviewDept;
  actionMode: ActionMode;
  pageOffset: number;
  sortField: 'budget' | 'benefit' | null;
  sortDir: 'none' | 'desc' | 'asc';
  onHeaderSort: (field: 'budget' | 'benefit') => void;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onPass: (record: PlanReviewRecord, payload: JointReviewPassPayload) => void;
  onView: (record: PlanReviewRecord) => void;
  onModify: (record: PlanReviewRecord) => void;
  onJointDetail?: (record: PlanReviewRecord) => void;
  onSmsToast?: (msg: string) => void;
  onToggleVisible: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onResetColumns: () => void;
}

const CHECK_W = 44;
const SEQ_W = 60;
const ACTION_W = 220;
/** 会审列表左侧固定列（紧随勾选框、序号之后） */
const LEFT_PIN_IDS = ['planName'] as const;
/** 仅会审中 TAB 展示 */
const REVIEWING_ONLY_COL_IDS = new Set(['jointDetail', 'opinionDeadline', 'opinionSign']);

function formatDateTime(value?: string) {
  if (!value) return '—';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value.replace('T', ' ');
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${mo}-${day} ${h}:${mi}`;
}

export default function PlanReviewTable({
  records, selectedRows, columns,
  actionMode,
  pageOffset,
  sortField, sortDir, onHeaderSort,
  onToggleSelectAll, onToggleSelectRow,
  onPass, onView, onModify, onJointDetail, onSmsToast,
  onToggleVisible, onReorder, onResetColumns,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [passTarget, setPassTarget] = useState<PlanReviewRecord | null>(null);
  const [signTarget, setSignTarget] = useState<PlanReviewRecord | null>(null);
  const [smsTarget, setSmsTarget] = useState<PlanReviewRecord | null>(null);

  const listColumns =
    actionMode === 'pending_joint'
      ? columns.filter((c) => !REVIEWING_ONLY_COL_IDS.has(c.id))
      : columns;

  const pinLeft = listColumns.some((c) => c.id === 'planName');
  const leftPinCols = pinLeft
    ? LEFT_PIN_IDS.map((id) => listColumns.find((c) => c.id === id && c.visible)).filter((c): c is ColumnDef => !!c)
    : [];
  const scrollCols = pinLeft
    ? listColumns.filter((c) => c.visible && !(LEFT_PIN_IDS as readonly string[]).includes(c.id))
    : listColumns.filter((c) => c.visible);
  const visibleCols = [...leftPinCols, ...scrollCols];

  const midWidth = visibleCols.reduce((sum, c) => sum + c.width, 0);
  const leftFixedW = CHECK_W + SEQ_W;
  const totalWidth = leftFixedW + midWidth + ACTION_W;

  const isAllSelected = records.length > 0 && selectedRows.length === records.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < records.length;

  const hBg = '#f5f7fa';
  const pinCount = pinLeft ? leftPinCols.length : Math.min(2, visibleCols.length);
  const lastPinIdx = pinCount - 1;

  const stickyLeftOf = (i: number) => {
    let left = leftFixedW;
    for (let j = 0; j < i; j++) left += visibleCols[j]?.width ?? 0;
    return left;
  };

  const thStyle = (i: number) => {
    if (i >= pinCount) return { backgroundColor: hBg };
    return {
      position: 'sticky' as const,
      left: `${stickyLeftOf(i)}px`,
      zIndex: 20,
      backgroundColor: hBg,
      ...(i === lastPinIdx ? { boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' } : {}),
    };
  };

  const tdStyle = (i: number, bg: string) => {
    if (i >= pinCount) return undefined;
    return {
      position: 'sticky' as const,
      left: `${stickyLeftOf(i)}px`,
      zIndex: 10,
      backgroundColor: bg,
      ...(i === lastPinIdx ? { boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' } : {}),
    };
  };

  const renderCell = (col: ColumnDef, r: PlanReviewRecord): React.ReactNode => {
    switch (col.id) {
      case 'applyYear':
        return <span className="font-medium text-steel-700 whitespace-nowrap">{r.applyYear}</span>;
      case 'projectMajorCategory':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap bg-emerald-50 text-emerald-700">
            {r.projectMajorCategory}
          </span>
        );
      case 'businessUnit':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-100 text-steel-600 whitespace-nowrap">
            {r.businessUnit}
          </span>
        );
      case 'projectCategory':
        return <span className="text-steel-600 whitespace-nowrap">{r.projectCategory}</span>;
      case 'planName':
        return (
          <button type="button" onClick={() => onView(r)}
            className="text-left text-sm line-clamp-1 hover:underline cursor-pointer"
            style={{ color: '#2563eb' }} title={r.planName}>
            {r.planName}
          </button>
        );
      case 'jointDetail':
        if (actionMode !== 'reviewing') {
          return <span className="text-steel-300 text-xs">—</span>;
        }
        {
          const names = (r.jointMeeting?.participants || [])
            .map((p) => p.personName)
            .filter(Boolean);
          const full = names.length > 0 ? names.join('、') : '会审人员';
          const display = full.length > 5 ? `${full.slice(0, 5)}…` : full;
          return (
            <button
              type="button"
              onClick={() => onJointDetail?.(r)}
              className="text-xs font-medium hover:underline cursor-pointer whitespace-nowrap"
              style={{ color: '#2563eb' }}
              title={full}
            >
              {display}
            </button>
          );
        }
      case 'opinionDeadline':
        if (actionMode !== 'reviewing') {
          return <span className="text-steel-300 text-xs">—</span>;
        }
        return (
          <span className="text-xs text-steel-600 whitespace-nowrap">
            {formatDateTime(r.jointMeeting?.opinionDeadline)}
          </span>
        );
      case 'opinionSign':
        if (actionMode !== 'reviewing') {
          return <span className="text-steel-300 text-xs">—</span>;
        }
        {
          const s = getOpinionSignSummary(r.jointMeeting);
          return (
            <button
              type="button"
              onClick={() => setSignTarget(r)}
              className="text-xs whitespace-nowrap cursor-pointer hover:opacity-80 text-left"
              title="查看签署记录"
            >
              <span className="text-sky-500 font-medium">{s.signed}/{s.total}</span>
              <span className="text-emerald-600 ml-1.5">通过:{s.passCount}人</span>
              <span className="text-red-600 ml-1.5">不通过:{s.failCount}人</span>
            </button>
          );
        }
      case 'budget':
        return <span className="text-right block font-medium text-steel-700 whitespace-nowrap">{r.budget.toFixed(2)}</span>;
      case 'benefit':
        return <span className="text-right block text-steel-600 whitespace-nowrap">{r.benefit > 0 ? r.benefit.toFixed(2) : '-'}</span>;
      case 'payment2':
        return <span className="text-right block text-steel-600 whitespace-nowrap">{r.payment2.toFixed(2)}</span>;
      case 'payment3':
        return <span className="text-right block text-steel-600 whitespace-nowrap">{r.payment3.toFixed(2)}</span>;
      case 'projectManager':
        return <span className="text-sm text-steel-700 whitespace-nowrap">{r.projectManager}</span>;
      case 'projectStatus':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${planReviewStatusMap[r.projectStatus]?.color ?? ''}`}>
            {planReviewStatusMap[r.projectStatus]?.label ?? r.projectStatus}
          </span>
        );
      case 'startTime':
        return <span className="text-xs text-steel-600 whitespace-nowrap">{r.startTime}</span>;
      case 'endTime':
        return <span className="text-xs text-steel-600 whitespace-nowrap">{r.endTime}</span>;
      case 'applicant':
        return <span className="text-sm text-steel-600 whitespace-nowrap">{r.applicant}</span>;
      case 'applyDate':
        return <span className="text-xs text-steel-500 whitespace-nowrap">{r.applyDate}</span>;
      case 'cancelReason':
        return r.cancelReason ? (
          <span className="text-xs text-red-500 line-clamp-1" title={r.cancelReason}>{r.cancelReason}</span>
        ) : <span className="text-steel-300 text-xs">-</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="flex items-center justify-end px-4 py-2 border-b border-steel-100 bg-slate-50/60">
        <button type="button" onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-white cursor-pointer whitespace-nowrap">
          <i className="ri-settings-3-line" />表头设置
        </button>
      </div>

      <div className="overflow-x-auto">
        <table style={{ width: `${totalWidth}px`, minWidth: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
          <colgroup>
            <col style={{ width: `${CHECK_W}px` }} />
            <col style={{ width: `${SEQ_W}px` }} />
            {visibleCols.map((c) => <col key={c.id} style={{ width: `${c.width}px` }} />)}
            <col style={{ width: `${ACTION_W}px` }} />
          </colgroup>
          <thead>
            <tr>
              <th className="border-b border-steel-200 px-3 py-3 text-center align-middle"
                style={{ position: 'sticky', left: 0, zIndex: 21, backgroundColor: hBg }}>
                <input type="checkbox" checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-steel-300 cursor-pointer" />
              </th>
              <th className="border-b border-r border-steel-200 px-2 py-3 text-xs font-semibold text-steel-600 text-center"
                style={{ position: 'sticky', left: `${CHECK_W}px`, zIndex: 21, backgroundColor: hBg }}>
                序号
              </th>
              {visibleCols.map((col, i) => {
                const isSortable = col.id === 'budget' || col.id === 'benefit';
                const isActiveDesc = sortField === col.id && sortDir === 'desc';
                const isActiveAsc = sortField === col.id && sortDir === 'asc';
                return (
                  <th key={col.id}
                    className={`border-b border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600 whitespace-nowrap ${i === lastPinIdx ? 'border-r' : ''} ${isSortable ? 'cursor-pointer select-none' : ''}`}
                    style={thStyle(i)}
                    onClick={isSortable ? () => onHeaderSort(col.id as 'budget' | 'benefit') : undefined}>
                    <span className="flex items-center gap-1">
                      {col.label}
                      {isSortable && (
                        <span className="flex flex-col leading-none -space-y-0.5">
                          <i className={`ri-arrow-up-s-line text-[9px] ${isActiveAsc ? 'text-primary-600' : 'text-steel-300'}`} />
                          <i className={`ri-arrow-down-s-line text-[9px] ${isActiveDesc ? 'text-primary-600' : 'text-steel-300'}`} />
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
              <th className="border-b border-l border-steel-200 px-3 py-3 text-center text-xs font-semibold text-steel-600"
                style={{ position: 'sticky', right: 0, zIndex: 21, backgroundColor: hBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.1)' }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + 3} className="px-3 py-16 text-center">
                  <p className="text-sm text-steel-400">
                    {actionMode === 'pending_joint' ? '暂无待会审项目' : '暂无会审中项目'}
                  </p>
                </td>
              </tr>
            ) : (
              records.map((r, idx) => {
                const isSel = selectedRows.includes(r.id);
                const rowBg = isSel ? '#eff6ff' : idx % 2 === 0 ? '#ffffff' : '#fafbfd';
                return (
                  <tr key={r.id} style={{ backgroundColor: rowBg }}>
                    <td className="px-3 py-2.5 align-middle text-center border-b border-steel-100"
                      style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: rowBg }}>
                      <input type="checkbox" checked={isSel} onChange={() => onToggleSelectRow(r.id)}
                        className="w-4 h-4 rounded border-steel-300 cursor-pointer" />
                    </td>
                    <td className="px-2 py-2.5 align-middle text-center text-sm text-steel-500 border-b border-r border-steel-100"
                      style={{ position: 'sticky', left: `${CHECK_W}px`, zIndex: 10, backgroundColor: rowBg }}>
                      {pageOffset + idx + 1}
                    </td>
                    {visibleCols.map((col, i) => (
                      <td key={col.id}
                        className={`px-3 py-2.5 text-sm align-middle border-b border-steel-100 ${i === lastPinIdx ? 'border-r' : ''}`}
                        style={tdStyle(i, rowBg)}>
                        {renderCell(col, r)}
                      </td>
                    ))}
                    <td className="px-2 py-2.5 align-middle border-b border-l border-steel-100"
                      style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: rowBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                      <div className="flex items-center justify-center gap-0.5 flex-wrap">
                        <button type="button" title="详情" onClick={() => onView(r)}
                          className="px-2 py-1 text-xs rounded font-medium bg-slate-50 text-steel-600 hover:bg-slate-100 cursor-pointer whitespace-nowrap">
                          详情
                        </button>
                        <button type="button" title="修改" onClick={() => onModify(r)}
                          className="px-2 py-1 text-xs rounded font-medium bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer whitespace-nowrap">
                          修改
                        </button>
                        {actionMode === 'reviewing' && (
                          <>
                            <button type="button" title="短信通知" onClick={() => setSmsTarget(r)}
                              className="px-2 py-1 text-xs rounded font-medium bg-violet-50 text-violet-600 hover:bg-violet-100 cursor-pointer whitespace-nowrap">
                              短信通知
                            </button>
                            <button type="button" title="会审通过" onClick={() => setPassTarget(r)}
                              className="px-2 py-1 text-xs rounded font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer whitespace-nowrap">
                              通过
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ColumnSettingsPanel
        open={settingsOpen} columns={columns}
        onClose={() => setSettingsOpen(false)}
        onToggleVisible={onToggleVisible} onReorder={onReorder}
        onReset={onResetColumns}
      />

      <JointReviewPassModal
        open={!!passTarget}
        record={passTarget}
        onClose={() => setPassTarget(null)}
        onConfirm={(payload) => {
          if (!passTarget) return;
          onPass(passTarget, payload);
          setPassTarget(null);
        }}
      />

      <OpinionSignRecordsModal
        open={!!signTarget}
        record={signTarget}
        onClose={() => setSignTarget(null)}
      />

      <JointReviewSmsModal
        open={!!smsTarget}
        record={smsTarget}
        onClose={() => setSmsTarget(null)}
        onSend={({ type, personIds }) => {
          const label = type === 'opinion' ? '会审意见填写通知' : '会审通知';
          onSmsToast?.(`已向 ${personIds.length} 人发送${label}`);
          setSmsTarget(null);
        }}
      />
    </div>
  );
}
