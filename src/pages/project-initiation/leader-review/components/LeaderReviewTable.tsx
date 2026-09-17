import type { LeaderReviewRecord, LeaderReviewStatus } from '@/mocks/planLeaderReviewMocks';

export type RowAction = 'present' | 'return' | 'pass' | 'reject' | 'restore' | 'edit' | 'view';
export type LeaderSortField = 'budget' | 'benefit';

interface Props {
  records: LeaderReviewRecord[];
  selectedRows: string[];
  pageOffset: number;
  activeTab: LeaderReviewStatus;
  sortField: LeaderSortField | null;
  sortDir: 'none' | 'desc' | 'asc';
  onHeaderSort: (field: LeaderSortField) => void;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onRowAction: (action: RowAction, record: LeaderReviewRecord) => void;
}

const CHECK_W = 44;
const SEQ_W = 56;
const NAME_W = 220;

const COLS: { id: string; label: string; width: number; sortable?: boolean }[] = [
  { id: 'planYear', label: '计划年度', width: 90 },
  { id: 'projectMajorCategory', label: '项目大类', width: 90 },
  { id: 'projectCategory', label: '项目类型', width: 120 },
  { id: 'applicant', label: '申报人', width: 90 },
  { id: 'businessUnit', label: '项目提报单位', width: 120 },
  { id: 'budget', label: '立项总概算（万元）', width: 140, sortable: true },
  { id: 'benefit', label: '效益（万元）', width: 110, sortable: true },
  { id: 'startDate', label: '计划开工时间', width: 120 },
  { id: 'endDate', label: '计划完工时间', width: 120 },
];

function actionWidth(tab: LeaderReviewStatus) {
  switch (tab) {
    case 'pending_present':
    case 'leader_passed':
      return 120;
    default:
      return 88;
  }
}

function rowActions(tab: LeaderReviewStatus): RowAction[] {
  switch (tab) {
    case 'pending_present':
    case 'leader_passed':
      return ['edit', 'view'];
    default:
      return ['view'];
  }
}

const ACTION_LABEL: Record<RowAction, string> = {
  present: '呈核',
  return: '退回',
  pass: '立项下达',
  reject: '驳回',
  restore: '恢复',
  edit: '修改',
  view: '详情',
};

const ACTION_CLS: Record<RowAction, string> = {
  present: 'text-cyan-600 hover:bg-cyan-50',
  return: 'text-orange-600 hover:bg-orange-50',
  pass: 'text-emerald-600 hover:bg-emerald-50',
  reject: 'text-red-600 hover:bg-red-50',
  restore: 'text-violet-600 hover:bg-violet-50',
  edit: 'text-indigo-600 hover:bg-indigo-50',
  view: 'text-sky-600 hover:bg-sky-50',
};

export default function LeaderReviewTable({
  records, selectedRows, pageOffset, activeTab,
  sortField, sortDir, onHeaderSort,
  onToggleSelectAll, onToggleSelectRow, onRowAction,
}: Props) {
  const ACTION_W = actionWidth(activeTab);
  const midW = COLS.reduce((s, c) => s + c.width, 0);
  const totalW = CHECK_W + SEQ_W + NAME_W + midW + ACTION_W;
  const leftName = CHECK_W + SEQ_W;
  const hBg = '#f5f7fa';
  const actions = rowActions(activeTab);

  const isAllSelected = records.length > 0 && records.every((r) => selectedRows.includes(r.id));
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected;

  const renderSort = (field: LeaderSortField) => {
    const activeDesc = sortField === field && sortDir === 'desc';
    const activeAsc = sortField === field && sortDir === 'asc';
    return (
      <span className="flex flex-col leading-none -space-y-0.5 ml-0.5">
        <i className={`ri-arrow-up-s-line text-[9px] ${activeAsc ? 'text-primary-600' : 'text-steel-300'}`} />
        <i className={`ri-arrow-down-s-line text-[9px] ${activeDesc ? 'text-primary-600' : 'text-steel-300'}`} />
      </span>
    );
  };

  const renderCell = (colId: string, r: LeaderReviewRecord) => {
    switch (colId) {
      case 'planYear':
        return <span className="font-medium text-steel-700 whitespace-nowrap">{r.planYear}年</span>;
      case 'projectMajorCategory':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap bg-emerald-50 text-emerald-700">
            {r.projectMajorCategory}
          </span>
        );
      case 'projectCategory':
        return <span className="text-steel-600 whitespace-nowrap">{r.projectCategory || '—'}</span>;
      case 'applicant':
        return <span className="text-steel-700 whitespace-nowrap">{r.applicant}</span>;
      case 'businessUnit':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-100 text-steel-600 whitespace-nowrap">
            {r.businessUnit}
          </span>
        );
      case 'budget':
        return <span className="text-right block font-medium text-steel-700 whitespace-nowrap">{r.budget.toFixed(2)}</span>;
      case 'benefit':
        return <span className="text-right block text-steel-600 whitespace-nowrap">{r.benefit > 0 ? r.benefit.toFixed(2) : '—'}</span>;
      case 'startDate':
        return <span className="text-xs text-steel-600 whitespace-nowrap">{r.startDate}</span>;
      case 'endDate':
        return <span className="text-xs text-steel-600 whitespace-nowrap">{r.endDate}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table style={{ width: `${totalW}px`, minWidth: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
          <colgroup>
            <col style={{ width: CHECK_W }} />
            <col style={{ width: SEQ_W }} />
            <col style={{ width: NAME_W }} />
            {COLS.map((c) => <col key={c.id} style={{ width: c.width }} />)}
            <col style={{ width: ACTION_W }} />
          </colgroup>
          <thead>
            <tr>
              <th className="border-b border-steel-200 px-3 py-3 text-center"
                style={{ position: 'sticky', left: 0, zIndex: 21, backgroundColor: hBg }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-steel-300 cursor-pointer"
                />
              </th>
              <th className="border-b border-steel-200 px-2 py-3 text-xs font-semibold text-steel-600 text-center"
                style={{ position: 'sticky', left: CHECK_W, zIndex: 21, backgroundColor: hBg }}>
                序号
              </th>
              <th className="border-b border-r border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600"
                style={{ position: 'sticky', left: leftName, zIndex: 21, backgroundColor: hBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' }}>
                项目名称
              </th>
              {COLS.map((col) => (
                <th
                  key={col.id}
                  className={`border-b border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600 whitespace-nowrap ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                  style={{ backgroundColor: hBg }}
                  onClick={col.sortable ? () => onHeaderSort(col.id as LeaderSortField) : undefined}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sortable && renderSort(col.id as LeaderSortField)}
                  </span>
                </th>
              ))}
              <th className="border-b border-l border-steel-200 px-3 py-3 text-center text-xs font-semibold text-steel-600"
                style={{ position: 'sticky', right: 0, zIndex: 21, backgroundColor: hBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.1)' }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={COLS.length + 4} className="px-3 py-16 text-center text-sm text-steel-400">
                  暂无符合条件的项目
                </td>
              </tr>
            ) : (
              records.map((r, idx) => {
                const isSel = selectedRows.includes(r.id);
                const rowBg = isSel ? '#eff6ff' : idx % 2 === 0 ? '#ffffff' : '#fafbfd';
                return (
                  <tr key={r.id} style={{ backgroundColor: rowBg }}>
                    <td className="px-3 py-2.5 text-center border-b border-steel-100"
                      style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: rowBg }}>
                      <input type="checkbox" checked={isSel} onChange={() => onToggleSelectRow(r.id)}
                        className="w-4 h-4 rounded border-steel-300 cursor-pointer" />
                    </td>
                    <td className="px-2 py-2.5 text-center text-sm text-steel-500 border-b border-steel-100"
                      style={{ position: 'sticky', left: CHECK_W, zIndex: 10, backgroundColor: rowBg }}>
                      {pageOffset + idx + 1}
                    </td>
                    <td className="px-3 py-2.5 text-sm border-b border-r border-steel-100"
                      style={{ position: 'sticky', left: leftName, zIndex: 10, backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                      <button type="button" onClick={() => onRowAction('view', r)}
                        className="text-left line-clamp-1 hover:underline cursor-pointer" style={{ color: '#2563eb' }}
                        title={r.planName}>
                        {r.planName}
                      </button>
                    </td>
                    {COLS.map((col) => (
                      <td key={col.id} className="px-3 py-2.5 text-sm border-b border-steel-100 align-middle">
                        {renderCell(col.id, r)}
                      </td>
                    ))}
                    <td className="px-2 py-2.5 text-center border-b border-l border-steel-100"
                      style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: rowBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                      <div className="inline-flex items-center justify-center gap-0.5 flex-wrap">
                        {actions.map((act) => (
                          <button
                            key={act}
                            type="button"
                            onClick={() => onRowAction(act, r)}
                            className={`px-1.5 py-1 text-xs rounded cursor-pointer whitespace-nowrap ${ACTION_CLS[act]}`}
                          >
                            {ACTION_LABEL[act]}
                          </button>
                        ))}
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
