import { useState } from 'react';
import type { IssuanceRecord } from '@/mocks/issuanceMocks';
import { issuanceStatusMap } from '@/mocks/issuanceMocks';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import ColumnSettingsPanel from '@/pages/project-plan/declaration/components/ColumnSettingsPanel';
import ReduceAmountModal from './ReduceAmountModal';

interface Props {
  records: IssuanceRecord[];
  selectedRows: string[];
  columns: ColumnDef[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onModify: (record: IssuanceRecord) => void;
  onPropose: (record: IssuanceRecord) => void;
  onIssue: (record: IssuanceRecord) => void;
  onReduce: (id: string, amount: number, reason: string) => void;
  onToggleVisible: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onUpdateWidth: (id: string, width: number) => void;
  onResetColumns: () => void;
  pageOffset: number;
}

const SEQ_COL_WIDTH = 60;
const CHECK_COL_WIDTH = 44;
const ACTION_COL_WIDTH = 160;
const LEFT_FIXED_WIDTH = CHECK_COL_WIDTH + SEQ_COL_WIDTH;

export default function IssuanceTable({
  records, selectedRows, columns,
  onToggleSelectAll, onToggleSelectRow,
  onModify, onPropose, onIssue, onReduce,
  onToggleVisible, onReorder, onUpdateWidth, onResetColumns,
  pageOffset,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reduceTarget, setReduceTarget] = useState<IssuanceRecord | null>(null);

  const visibleCols = columns.filter((c) => c.visible);
  const middleWidth = visibleCols.reduce((sum, c) => sum + c.width, 0);
  const totalWidth = LEFT_FIXED_WIDTH + middleWidth + ACTION_COL_WIDTH;
  const isAllSelected = records.length > 0 && selectedRows.length === records.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < records.length;
  const headerBg = '#f5f7fa';

  const col0Left = LEFT_FIXED_WIDTH;
  const col1Left = LEFT_FIXED_WIDTH + (visibleCols[0]?.width ?? 0);

  const getStickyThStyle = (colIdx: number) => {
    if (colIdx === 0) return { position: 'sticky' as const, left: `${col0Left}px`, zIndex: 20, backgroundColor: headerBg };
    if (colIdx === 1) return { position: 'sticky' as const, left: `${col1Left}px`, zIndex: 20, backgroundColor: headerBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' };
    return { backgroundColor: headerBg };
  };

  const getStickyTdStyle = (colIdx: number, rowBg: string) => {
    if (colIdx === 0) return { position: 'sticky' as const, left: `${col0Left}px`, zIndex: 10, backgroundColor: rowBg };
    if (colIdx === 1) return { position: 'sticky' as const, left: `${col1Left}px`, zIndex: 10, backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' };
    return undefined;
  };

  const renderCell = (col: ColumnDef, record: IssuanceRecord): React.ReactNode => {
    switch (col.id) {
      case 'applyName':
        return (
          <span className="line-clamp-1 cursor-pointer hover:underline" style={{ color: '#2563eb' }}
            onClick={() => onModify(record)} title={record.applyName}>
            {record.applyName}
          </span>
        );
      case 'applyNo':
        return <span className="font-medium text-steel-600 whitespace-nowrap">{record.applyNo}</span>;
      case 'planNo':
        return <span className="text-steel-600 whitespace-nowrap">{record.planNo}</span>;
      case 'projectType':
        return <span className="text-steel-600 whitespace-nowrap">{record.projectType}</span>;
      case 'handler':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
              {record.handler[0]}
            </div>
            <span className="text-sm text-steel-600 whitespace-nowrap">{record.handler}</span>
          </div>
        );
      case 'investAmount':
        return (
          <div className="text-right">
            <span className="text-sm font-medium text-steel-800">{record.investAmount.toFixed(2)}</span>
            <span className="text-xs text-steel-400 ml-1">万元</span>
            {record.reducedAmount > 0 && (
              <div className="text-xs text-orange-500 mt-0.5">核减 -{record.reducedAmount.toFixed(2)}</div>
            )}
          </div>
        );
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${issuanceStatusMap[record.status]?.color ?? ''}`}>
            {issuanceStatusMap[record.status]?.label ?? record.status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-end px-4 py-2 border-b border-steel-100 bg-slate-50/60">
        <button onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-white hover:text-primary-600 hover:border-primary-300 transition-colors cursor-pointer whitespace-nowrap">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-settings-3-line" /></div>
          表头设置
        </button>
      </div>

      <div className="overflow-x-auto">
        <table style={{ width: `${totalWidth}px`, minWidth: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
          <colgroup>
            <col style={{ width: `${CHECK_COL_WIDTH}px` }} />
            <col style={{ width: `${SEQ_COL_WIDTH}px` }} />
            {visibleCols.map((c) => <col key={c.id} style={{ width: `${c.width}px` }} />)}
            <col style={{ width: `${ACTION_COL_WIDTH}px` }} />
          </colgroup>
          <thead>
            <tr>
              <th className="border-b border-steel-200 px-3 py-3 text-center align-middle"
                style={{ position: 'sticky', left: 0, zIndex: 20, backgroundColor: headerBg }}>
                <input type="checkbox" checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-steel-300 text-primary-500 cursor-pointer" />
              </th>
              <th className="border-b border-r border-steel-200 px-2 py-3 text-xs font-semibold text-steel-600 text-center align-middle whitespace-nowrap"
                style={{ position: 'sticky', left: `${CHECK_COL_WIDTH}px`, zIndex: 20, backgroundColor: headerBg }}>
                序号
              </th>
              {visibleCols.map((col, colIdx) => (
                <th key={col.id}
                  className={`border-b border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600 whitespace-nowrap align-middle ${colIdx === 1 ? 'border-r' : ''}`}
                  style={getStickyThStyle(colIdx)}>
                  {col.label}
                </th>
              ))}
              <th className="border-b border-l border-steel-200 px-3 py-3 text-center text-xs font-semibold text-steel-600 whitespace-nowrap align-middle"
                style={{ position: 'sticky', right: 0, zIndex: 20, backgroundColor: headerBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.1)' }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, idx) => {
              const isSelected = selectedRows.includes(record.id);
              const rowBg = isSelected ? '#eff6ff' : (idx % 2 === 0 ? '#ffffff' : '#fafbfd');
              return (
                <tr key={record.id}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelectorAll<HTMLElement>('[data-sticky]').forEach((el) => { el.style.backgroundColor = '#eff6ff'; });
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelectorAll<HTMLElement>('[data-sticky]').forEach((el) => { el.style.backgroundColor = rowBg; });
                    e.currentTarget.style.backgroundColor = rowBg;
                  }}
                  style={{ backgroundColor: rowBg }}>
                  <td data-sticky className="px-3 py-3 align-middle text-center border-b border-steel-100"
                    style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: rowBg }}>
                    <input type="checkbox" checked={isSelected} onChange={() => onToggleSelectRow(record.id)}
                      className="w-4 h-4 rounded border-steel-300 text-primary-500 cursor-pointer" />
                  </td>
                  <td data-sticky className="px-2 py-3 align-middle text-center text-sm text-steel-500 border-b border-r border-steel-100"
                    style={{ position: 'sticky', left: `${CHECK_COL_WIDTH}px`, zIndex: 10, backgroundColor: rowBg }}>
                    {pageOffset + idx + 1}
                  </td>
                  {visibleCols.map((col, colIdx) => {
                    const isSticky = colIdx < 2;
                    const tdStyle = getStickyTdStyle(colIdx, rowBg);
                    return (
                      <td key={col.id}
                        data-sticky={isSticky ? '' : undefined}
                        className={`px-3 py-3 text-sm align-middle border-b border-steel-100 ${colIdx === 1 ? 'border-r' : ''}`}
                        style={tdStyle}>
                        {renderCell(col, record)}
                      </td>
                    );
                  })}
                  <td data-sticky className="px-3 py-3 align-middle border-b border-l border-steel-100"
                    style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: rowBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-center gap-0.5">
                      <button onClick={() => onModify(record)} title="修改"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-primary-50 text-steel-400 hover:text-primary-500 transition-colors cursor-pointer">
                        <i className="ri-edit-line text-sm" />
                      </button>
                      <button onClick={() => onPropose(record)} title="提出"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-amber-50 text-steel-400 hover:text-amber-600 transition-colors cursor-pointer">
                        <i className="ri-file-upload-line text-sm" />
                      </button>
                      {record.status === 'pending_issue' && (
                        <button onClick={() => onIssue(record)} title="签发"
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-emerald-50 text-steel-400 hover:text-emerald-600 transition-colors cursor-pointer">
                          <i className="ri-check-double-line text-sm" />
                        </button>
                      )}
                      <button onClick={() => setReduceTarget(record)} title="核减金额"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-orange-50 text-steel-400 hover:text-orange-500 transition-colors cursor-pointer">
                        <i className="ri-funds-box-line text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {records.length === 0 && (
              <tr>
                <td colSpan={visibleCols.length + 3} className="px-3 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100">
                      <i className="ri-inbox-2-line text-2xl text-steel-300" />
                    </div>
                    <p className="text-sm text-steel-400">暂无签发数据</p>
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
        onUpdateWidth={onUpdateWidth}
        onReset={onResetColumns}
      />

      {reduceTarget && (
        <ReduceAmountModal
          open={!!reduceTarget}
          recordName={reduceTarget.applyName}
          investAmount={reduceTarget.investAmount}
          onClose={() => setReduceTarget(null)}
          onConfirm={(amount, reason) => {
            onReduce(reduceTarget.id, amount, reason);
            setReduceTarget(null);
          }}
        />
      )}
    </div>
  );
}
