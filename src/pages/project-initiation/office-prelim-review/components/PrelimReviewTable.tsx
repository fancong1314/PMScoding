import { useState } from 'react';
import type { InitPrelimRecord, PrelimStatus } from '@/mocks/initOfficePrelimReviewMocks';
import { reviewStatusMap } from '@/mocks/projectPlans';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import ColumnSettingsPanel from '@/pages/project-initiation/declaration/components/ColumnSettingsPanel';

export type PrelimRowAction = 'view' | 'restore';

interface Props {
  records: InitPrelimRecord[];
  selectedRows: string[];
  columns: ColumnDef[];
  pageOffset: number;
  activeTab: PrelimStatus;
  budgetSort: 'desc' | 'asc' | null;
  benefitSort: 'desc' | 'asc' | null;
  onSortBudget: () => void;
  onSortBenefit: () => void;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onResetColumns: () => void;
  onRowAction: (action: PrelimRowAction, record: InitPrelimRecord) => void;
}

const SEQ_W = 56;
const CHECK_W = 44;
const NAME_W = 220;
const ACTION_W = 100;

function renderCell(col: ColumnDef, plan: InitPrelimRecord): React.ReactNode {
  switch (col.id) {
    case 'planYear':
      return <span className="whitespace-nowrap font-medium text-steel-700">{plan.planYear}年</span>;
    case 'businessDivision':
      return <span className="whitespace-nowrap text-steel-600">{plan.businessDivision}</span>;
    case 'projectMajorType':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 whitespace-nowrap">
          {plan.projectMajorType}
        </span>
      );
    case 'projectCategory':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-slate-100 text-steel-600 whitespace-nowrap">
          {plan.projectCategory}
        </span>
      );
    case 'isInPlanProject':
      return <span className="whitespace-nowrap text-steel-600">{plan.isInPlanProject || (plan.annualPlanNo ? '是' : '否')}</span>;
    case 'annualPlanNo':
      return plan.annualPlanNo ? (
        <span className="font-mono text-xs text-primary-700 whitespace-nowrap">{plan.annualPlanNo}</span>
      ) : <span className="text-steel-300">—</span>;
    case 'budgetAmount':
      return <span className="whitespace-nowrap font-medium text-steel-800">{plan.budgetAmount.toFixed(2)}</span>;
    case 'benefit':
      return <span className="whitespace-nowrap text-steel-600">{plan.benefit.toFixed(2)}</span>;
    case 'projectManager':
      return <span className="whitespace-nowrap text-steel-600">{plan.projectManager}</span>;
    case 'projectManagerPhone':
      return <span className="whitespace-nowrap text-steel-600">{plan.projectManagerPhone || '—'}</span>;
    case 'currentReviewer':
      return <span className="whitespace-nowrap text-steel-500">{plan.currentReviewer || '—'}</span>;
    case 'reviewStatus': {
      const s = reviewStatusMap[plan.reviewStatus] || reviewStatusMap.draft;
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full whitespace-nowrap"
          style={{ backgroundColor: s.bgColor, color: s.textColor }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.dotColor }} />
          {s.label}
        </span>
      );
    }
    case 'applicant':
      return <span className="whitespace-nowrap text-steel-600">{plan.applicant}</span>;
    case 'startDate':
      return <span className="whitespace-nowrap text-steel-500">{plan.startDate || '—'}</span>;
    case 'endDate':
      return <span className="whitespace-nowrap text-steel-500">{plan.endDate || '—'}</span>;
    case 'projectDuration':
      return <span className="whitespace-nowrap text-steel-600">{plan.projectDuration ? `${plan.projectDuration} 月` : '—'}</span>;
    case 'implementUnit':
      return <span className="whitespace-nowrap text-steel-600">{plan.implementUnit || '—'}</span>;
    case 'implementDept':
      return <span className="whitespace-nowrap text-steel-600">{plan.implementDept || '—'}</span>;
    case 'submitDept':
      return <span className="whitespace-nowrap text-steel-600">{plan.submitDept || '—'}</span>;
    case 'professionalUnit':
      return <span className="whitespace-nowrap text-steel-600">{plan.professionalUnit || '—'}</span>;
    case 'ownerUnit':
      return <span className="whitespace-nowrap text-steel-600">{plan.ownerUnit || '—'}</span>;
    case 'hasJobChange': {
      const v = plan.hasJobChange || '否';
      const text = v === '是' || v === '增加' || v === '减少'
        ? `${v === '是' ? '是' : v}${plan.jobChangeCount ? ` ${plan.jobChangeCount}人` : ''}`
        : v === '无' ? '否' : v;
      return <span className="whitespace-nowrap text-steel-600">{text}</span>;
    }
    case 'declareFee':
      return <span className="whitespace-nowrap text-steel-600">{plan.declareFee != null ? Number(plan.declareFee).toFixed(2) : '—'}</span>;
    case 'isCapitalOverhaul':
      return <span className="whitespace-nowrap text-steel-600">{plan.isCapitalOverhaul || '—'}</span>;
    case 'argumentApplyNo':
      return plan.argumentApplyNo
        ? <span className="font-mono text-xs text-steel-700 whitespace-nowrap">{plan.argumentApplyNo}</span>
        : <span className="text-steel-300">—</span>;
    case 'isScrapRenew':
      return <span className="whitespace-nowrap text-steel-600">{plan.isScrapRenew || '—'}</span>;
    default:
      return <span className="text-steel-300">—</span>;
  }
}

export default function PrelimReviewTable({
  records, selectedRows, columns, pageOffset, activeTab,
  budgetSort, benefitSort, onSortBudget, onSortBenefit,
  onToggleSelectAll, onToggleSelectRow,
  onToggleVisible, onReorder, onResetColumns, onRowAction,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const showCheck = activeTab === 'pending';
  const showRestore = activeTab === 'rejected';
  const showView = activeTab !== 'rejected';
  const visibleCols = columns.filter((c) => c.visible);
  const leftFixed = (showCheck ? CHECK_W : 0) + SEQ_W + NAME_W;
  const totalW = leftFixed + visibleCols.reduce((s, c) => s + c.width, 0) + ACTION_W;
  const hBg = '#f5f7fa';

  const isAllSelected = records.length > 0 && records.every((r) => selectedRows.includes(r.id));
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected;

  const renderSort = (sortVal: 'desc' | 'asc' | null, onClick: () => void) => {
    let iconClass = 'ri-arrow-up-down-line text-steel-400';
    if (sortVal === 'desc') iconClass = 'ri-sort-desc text-primary-500';
    else if (sortVal === 'asc') iconClass = 'ri-sort-asc text-primary-500';
    return (
      <button type="button" onClick={onClick} className="w-4 h-4 flex items-center justify-center cursor-pointer" title="点击排序">
        <i className={`text-xs ${iconClass}`} />
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="flex items-center justify-end px-4 py-2 border-b border-steel-100" style={{ backgroundColor: '#fafbfd' }}>
        <button type="button" onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-white cursor-pointer whitespace-nowrap">
          <i className="ri-settings-3-line" />表头设置
        </button>
      </div>
      <div className="overflow-x-auto">
        <table style={{ width: `${totalW}px`, minWidth: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
          <colgroup>
            {showCheck && <col style={{ width: CHECK_W }} />}
            <col style={{ width: SEQ_W }} />
            <col style={{ width: NAME_W }} />
            {visibleCols.map((c) => <col key={c.id} style={{ width: c.width }} />)}
            <col style={{ width: ACTION_W }} />
          </colgroup>
          <thead>
            <tr>
              {showCheck && (
                <th className="border-b border-steel-200 px-3 py-3 text-center"
                  style={{ position: 'sticky', left: 0, zIndex: 21, backgroundColor: hBg }}>
                  <input type="checkbox" checked={isAllSelected}
                    ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                    onChange={onToggleSelectAll} className="w-4 h-4 rounded border-steel-300 cursor-pointer" />
                </th>
              )}
              <th className="border-b border-steel-200 px-2 py-3 text-xs font-semibold text-steel-600 text-center"
                style={{ position: 'sticky', left: showCheck ? CHECK_W : 0, zIndex: 21, backgroundColor: hBg }}>
                序号
              </th>
              <th className="border-b border-r border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600"
                style={{ position: 'sticky', left: (showCheck ? CHECK_W : 0) + SEQ_W, zIndex: 21, backgroundColor: hBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' }}>
                项目名称
              </th>
              {visibleCols.map((col) => (
                <th key={col.id} className="border-b border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600 whitespace-nowrap" style={{ backgroundColor: hBg }}>
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.id === 'budgetAmount' && renderSort(budgetSort, onSortBudget)}
                    {col.id === 'benefit' && renderSort(benefitSort, onSortBenefit)}
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
                <td colSpan={visibleCols.length + (showCheck ? 4 : 3)} className="px-3 py-16 text-center text-sm text-steel-400">
                  暂无符合条件的项目
                </td>
              </tr>
            ) : records.map((r, idx) => {
              const isSel = selectedRows.includes(r.id);
              const rowBg = isSel ? '#eff6ff' : idx % 2 === 0 ? '#ffffff' : '#fafbfd';
              return (
                <tr key={r.id} style={{ backgroundColor: rowBg }}>
                  {showCheck && (
                    <td className="px-3 py-2.5 text-center border-b border-steel-100"
                      style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: rowBg }}>
                      <input type="checkbox" checked={isSel} onChange={() => onToggleSelectRow(r.id)}
                        className="w-4 h-4 rounded border-steel-300 cursor-pointer" />
                    </td>
                  )}
                  <td className="px-2 py-2.5 text-center text-sm text-steel-500 border-b border-steel-100"
                    style={{ position: 'sticky', left: showCheck ? CHECK_W : 0, zIndex: 10, backgroundColor: rowBg }}>
                    {pageOffset + idx + 1}
                  </td>
                  <td className="px-3 py-2.5 text-sm border-b border-r border-steel-100"
                    style={{ position: 'sticky', left: (showCheck ? CHECK_W : 0) + SEQ_W, zIndex: 10, backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                    <button type="button" onClick={showView ? () => onRowAction('view', r) : undefined}
                      className={`text-left line-clamp-2 leading-5 ${showView ? 'hover:underline cursor-pointer' : 'cursor-default'}`}
                      style={{ color: showView ? '#2563eb' : undefined }}
                      title={r.planName}>
                      {r.planName}
                    </button>
                  </td>
                  {visibleCols.map((col) => (
                    <td key={col.id} className="px-3 py-2.5 text-sm border-b border-steel-100 align-middle">
                      {renderCell(col, r)}
                    </td>
                  ))}
                  <td className="px-2 py-2.5 text-center border-b border-l border-steel-100"
                    style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: rowBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                    <div className="inline-flex items-center justify-center gap-0.5">
                      {showRestore && (
                        <button type="button" onClick={() => onRowAction('restore', r)}
                          className="px-1.5 py-1 text-xs rounded cursor-pointer whitespace-nowrap text-violet-600 hover:bg-violet-50">
                          恢复
                        </button>
                      )}
                      {showView && (
                        <button type="button" onClick={() => onRowAction('view', r)}
                          className="px-1.5 py-1 text-xs rounded cursor-pointer whitespace-nowrap text-sky-600 hover:bg-sky-50">
                          详情
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ColumnSettingsPanel
        open={settingsOpen}
        columns={columns}
        onClose={() => setSettingsOpen(false)}
        onToggleVisible={onToggleVisible}
        onReorder={onReorder}
        onReset={onResetColumns}
      />
    </div>
  );
}
