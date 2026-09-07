import { useState } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { reviewStatusMap } from '@/mocks/projectPlans';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import ColumnSettingsPanel from './ColumnSettingsPanel';
import type { ApprovalRecord } from '@/mocks/approvalMocks';

interface Props {
  plans: ProjectPlan[];
  columns: ColumnDef[];
  onToggleVisible: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onResetColumns: () => void;
  onEdit: (plan: ProjectPlan) => void;
  onDelete: (plan: ProjectPlan) => void;
  onViewLog: (plan: ProjectPlan) => void;
  onViewApproval: (plan: ProjectPlan) => void;
  onProcessApproval: (plan: ProjectPlan) => void;
  getApprovalRecord: (planId: string) => ApprovalRecord | undefined;
  pageOffset: number;
  budgetSort: 'desc' | 'asc' | null;
  benefitSort: 'desc' | 'asc' | null;
  onSortBudget: () => void;
  onSortBenefit: () => void;
}

function renderCell(col: ColumnDef, plan: ProjectPlan): React.ReactNode {
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
    case 'planName':
      return (
        <span className="text-steel-800 line-clamp-2 leading-5" title={plan.planName}>
          {plan.planName}
        </span>
      );
    case 'budgetAmount':
      return <span className="whitespace-nowrap font-medium text-steel-800">{plan.budgetAmount.toFixed(2)}</span>;
    case 'benefit':
      return <span className="whitespace-nowrap text-steel-600">{plan.benefit.toFixed(2)}</span>;
    case 'year1Payment':
      return <span className="whitespace-nowrap text-steel-600">{plan.year1Payment.toFixed(2)}</span>;
    case 'year2Payment':
      return <span className="whitespace-nowrap text-steel-600">{plan.year2Payment.toFixed(2)}</span>;
    case 'year3Payment':
      return <span className="whitespace-nowrap text-steel-600">{plan.year3Payment.toFixed(2)}</span>;
    case 'projectManager':
      return <span className="whitespace-nowrap text-steel-600">{plan.projectManager}</span>;
    case 'projectManagerPhone':
      return <span className="whitespace-nowrap text-steel-600">{plan.projectManagerPhone || '—'}</span>;
    case 'currentReviewer':
      return (
        <span className="whitespace-nowrap text-steel-500">
          {plan.currentReviewer || <span className="text-steel-300">—</span>}
        </span>
      );
    case 'latestStage':
      return (
        <span className="whitespace-nowrap px-2 py-0.5 text-xs rounded bg-slate-50 text-steel-500 border border-steel-200">
          {plan.latestStage}
        </span>
      );
    case 'reviewStatus': {
      const s = reviewStatusMap[plan.reviewStatus] || reviewStatusMap.draft;
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full whitespace-nowrap"
          style={{ backgroundColor: s.bgColor, color: s.textColor }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: s.dotColor }}
          />
          {s.label}
        </span>
      );
    }
    case 'applicant':
      return <span className="whitespace-nowrap text-steel-600">{plan.applicant}</span>;
    case 'startDate':
      return <span className="whitespace-nowrap text-steel-500">{plan.startDate}</span>;
    case 'endDate':
      return <span className="whitespace-nowrap text-steel-500">{plan.endDate}</span>;
    case 'supplementNote':
      return plan.supplementNote ? (
        <span className="text-steel-500 text-xs line-clamp-1" title={plan.supplementNote}>
          {plan.supplementNote}
        </span>
      ) : (
        <span className="text-steel-300">—</span>
      );
    default:
      return null;
  }
}

const SEQ_COL_WIDTH = 56;
const NAME_COL_WIDTH = 220;
const ACTION_COL_WIDTH = 200;
const LEFT_FIXED = SEQ_COL_WIDTH + NAME_COL_WIDTH;

export default function DeclarationTable({
  plans,
  columns,
  onToggleVisible,
  onReorder,
  onResetColumns,
  onEdit,
  onDelete,
  onViewLog,
  onViewApproval,
  onProcessApproval,
  getApprovalRecord,
  pageOffset,
  budgetSort,
  benefitSort,
  onSortBudget,
  onSortBenefit,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const visibleCols = columns.filter((c) => c.visible);
  const middleWidth = visibleCols.reduce((sum, c) => sum + c.width, 0);
  const totalWidth = LEFT_FIXED + middleWidth + ACTION_COL_WIDTH;

  const headerBg = '#f5f7fa';

  const renderSortIcon = (sortVal: 'desc' | 'asc' | null, onClick: () => void) => {
    let iconClass = 'ri-arrow-up-down-line text-steel-400';
    if (sortVal === 'desc') iconClass = 'ri-sort-desc text-primary-500';
    else if (sortVal === 'asc') iconClass = 'ri-sort-asc text-primary-500';
    return (
      <button onClick={onClick} className="w-4 h-4 flex items-center justify-center hover:text-primary-500 transition-colors cursor-pointer" title="点击排序">
        <i className={`text-xs ${iconClass}`} />
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-end px-4 py-2 border-b border-steel-100" style={{ backgroundColor: '#fafbfd' }}>
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-white hover:text-primary-600 hover:border-primary-300 transition-colors cursor-pointer whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-settings-3-line" />
          </div>
          表头设置
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          style={{
            width: `${totalWidth}px`,
            minWidth: '100%',
            tableLayout: 'fixed',
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}
        >
          <colgroup>
            <col style={{ width: `${SEQ_COL_WIDTH}px` }} />
            <col style={{ width: `${NAME_COL_WIDTH}px` }} />
            {visibleCols.map((c) => <col key={c.id} style={{ width: `${c.width}px` }} />)}
            <col style={{ width: `${ACTION_COL_WIDTH}px` }} />
          </colgroup>
          <thead>
            <tr>
              {/* 序号 - fixed left */}
              <th
                className="border-b border-steel-200 px-3 py-3 text-center text-xs font-semibold text-steel-600 whitespace-nowrap"
                style={{ position: 'sticky', left: 0, zIndex: 20, backgroundColor: headerBg }}
              >
                序号
              </th>
              {/* 项目名称 - fixed left */}
              <th
                className="border-b border-r border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600 whitespace-nowrap"
                style={{
                  position: 'sticky',
                  left: `${SEQ_COL_WIDTH}px`,
                  zIndex: 20,
                  backgroundColor: headerBg,
                  boxShadow: '2px 0 6px -2px rgba(0,0,0,0.10)',
                }}
              >
                项目名称
              </th>
              {/* Dynamic columns */}
              {visibleCols.map((col) => (
                <th
                  key={col.id}
                  className="border-b border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600 whitespace-nowrap"
                  style={{ backgroundColor: headerBg }}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.id === 'budgetAmount' && renderSortIcon(budgetSort, onSortBudget)}
                    {col.id === 'benefit' && renderSortIcon(benefitSort, onSortBenefit)}
                  </span>
                </th>
              ))}
              {/* 操作 - fixed right */}
              <th
                className="border-b border-l border-steel-200 px-3 py-3 text-center text-xs font-semibold text-steel-600 whitespace-nowrap"
                style={{
                  position: 'sticky',
                  right: 0,
                  zIndex: 20,
                  backgroundColor: headerBg,
                  boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.10)',
                }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, idx) => {
              const rowBg = idx % 2 === 0 ? '#ffffff' : '#fafbfd';
              return (
                <tr
                  key={plan.id}
                  className="group"
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelectorAll<HTMLElement>('[data-sc]').forEach((el) => {
                      el.style.backgroundColor = '#eff6ff';
                    });
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelectorAll<HTMLElement>('[data-sc]').forEach((el) => {
                      el.style.backgroundColor = rowBg;
                    });
                    e.currentTarget.style.backgroundColor = rowBg;
                  }}
                  style={{ backgroundColor: rowBg }}
                >
                  {/* 序号 */}
                  <td
                    data-sc="1"
                    className="px-3 py-2.5 align-middle text-center text-sm text-steel-500 border-b border-steel-100"
                    style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: rowBg }}
                  >
                    {pageOffset + idx + 1}
                  </td>
                  {/* 项目名称 */}
                  <td
                    data-sc="1"
                    className="px-3 py-2.5 align-middle text-sm border-b border-r border-steel-100"
                    style={{
                      position: 'sticky',
                      left: `${SEQ_COL_WIDTH}px`,
                      zIndex: 10,
                      backgroundColor: rowBg,
                      boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)',
                    }}
                  >
                    <span className="text-steel-800 line-clamp-2 leading-5" title={plan.planName}>
                      {plan.planName}
                    </span>
                  </td>
                  {/* Dynamic cols */}
                  {visibleCols.map((col) => (
                    <td
                      key={col.id}
                      className="px-3 py-2.5 text-sm align-middle border-b border-steel-100"
                    >
                      {renderCell(col, plan)}
                    </td>
                  ))}
                  {/* 操作 */}
                  <td
                    data-sc="1"
                    className="px-2 py-2.5 align-middle border-b border-l border-steel-100"
                    style={{
                      position: 'sticky',
                      right: 0,
                      zIndex: 10,
                      backgroundColor: rowBg,
                      boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => onEdit(plan)}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-primary-50 text-steel-400 hover:text-primary-500 transition-colors cursor-pointer"
                        title="编辑"
                      >
                        <i className="ri-edit-line text-sm" />
                      </button>
                      <button
                        onClick={() => onViewLog(plan)}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-steel-400 hover:text-steel-700 transition-colors cursor-pointer"
                        title="操作日志"
                      >
                        <i className="ri-history-line text-sm" />
                      </button>
                      {(plan.reviewStatus === 'draft' || plan.reviewStatus === 'rejected' || plan.reviewStatus === 'returned') && (
                        <button
                          onClick={() => onDelete(plan)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-steel-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="删除"
                        >
                          <i className="ri-delete-bin-line text-sm" />
                        </button>
                      )}
                      {getApprovalRecord(plan.id) && (
                        <button
                          onClick={() => onViewApproval(plan)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-blue-50 text-steel-400 hover:text-blue-500 transition-colors cursor-pointer"
                          title="查看审批结果"
                        >
                          <i className="ri-file-search-line text-sm" />
                        </button>
                      )}
                      {getApprovalRecord(plan.id) && getApprovalRecord(plan.id)!.status === 'approving' && (
                        <button
                          onClick={() => onProcessApproval(plan)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-amber-50 text-steel-400 hover:text-amber-500 transition-colors cursor-pointer"
                          title="审批处理"
                        >
                          <i className="ri-edit-box-line text-sm" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {plans.length === 0 && (
              <tr>
                <td colSpan={visibleCols.length + 3} className="px-3 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100">
                      <i className="ri-inbox-2-line text-2xl text-steel-300" />
                    </div>
                    <p className="text-sm text-steel-400">暂无数据</p>
                  </div>
                </td>
              </tr>
            )}
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