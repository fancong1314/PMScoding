import { useState } from 'react';
import type { ApplyRecord } from '@/mocks/applyMocks';
import { applyStatusMap } from '@/mocks/applyMocks';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import ColumnSettingsPanel from '@/pages/project-plan/declaration/components/ColumnSettingsPanel';

interface Props {
  records: ApplyRecord[];
  selectedRows: string[];
  columns: ColumnDef[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onView: (record: ApplyRecord) => void;
  onDelete: (record: ApplyRecord) => void;
  onPresent: (record: ApplyRecord) => void;
  onNewApply: (record: ApplyRecord) => void;
  onPrint: (record: ApplyRecord) => void;
  onToggleVisible: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onUpdateWidth: (id: string, width: number) => void;
  onResetColumns: () => void;
  pageOffset: number;
}

const SEQ_COL_WIDTH = 60;
const CHECK_COL_WIDTH = 44;
const ACTION_COL_WIDTH = 140;
const LEFT_FIXED_WIDTH = CHECK_COL_WIDTH + SEQ_COL_WIDTH;

function renderCell(col: ColumnDef, record: ApplyRecord): React.ReactNode {
  switch (col.id) {
    case 'applyNo':
      return (
        <span className="font-medium cursor-pointer hover:underline" style={{ color: '#2563eb' }}>
          {record.applyNo}
        </span>
      );
    case 'applyName':
      return (
        <span className="line-clamp-1 text-steel-700" title={record.applyName}>
          {record.applyName}
        </span>
      );
    case 'planNo':
      return <span className="text-steel-600 whitespace-nowrap">{record.planNo}</span>;
    case 'projectType':
      return <span className="text-steel-600 whitespace-nowrap">{record.projectType}</span>;
    case 'manager':
      return <span className="text-steel-600 whitespace-nowrap">{record.manager}</span>;
    case 'investAmount':
      return <span className="font-medium text-steel-800 whitespace-nowrap">{record.investAmount.toFixed(2)} 万元</span>;
    case 'status':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${applyStatusMap[record.status].color}`}>
          {applyStatusMap[record.status].label}
        </span>
      );
    default:
      return null;
  }
}

export default function ApplyTable({
  records, selectedRows, columns,
  onToggleSelectAll, onToggleSelectRow,
  onView, onDelete, onPresent, onNewApply, onPrint,
  onToggleVisible, onReorder, onUpdateWidth, onResetColumns,
  pageOffset,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const visibleCols = columns.filter((c) => c.visible && !c.required);
  const middleWidth = visibleCols.reduce((sum, c) => sum + c.width, 0);
  const totalWidth = LEFT_FIXED_WIDTH + middleWidth + ACTION_COL_WIDTH;
  const isAllSelected = records.length > 0 && selectedRows.length === records.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < records.length;

  const stickyHeader = { backgroundColor: '#f5f7fa' };

  // Compute cumulative left offsets for the first two data columns (sticky)
  const col0Left = LEFT_FIXED_WIDTH;
  const col1Left = LEFT_FIXED_WIDTH + (visibleCols[0]?.width ?? 0);

  const getStickyThStyle = (colIdx: number) => {
    if (colIdx === 0) return { position: 'sticky' as const, left: `${col0Left}px`, zIndex: 20, ...stickyHeader };
    if (colIdx === 1) return { position: 'sticky' as const, left: `${col1Left}px`, zIndex: 20, ...stickyHeader, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' };
    return stickyHeader;
  };

  const getStickyTdStyle = (colIdx: number, rowBg: string) => {
    if (colIdx === 0) return { position: 'sticky' as const, left: `${col0Left}px`, zIndex: 10, backgroundColor: rowBg };
    if (colIdx === 1) return { position: 'sticky' as const, left: `${col1Left}px`, zIndex: 10, backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' };
    return undefined;
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-end px-4 py-2 border-b border-steel-100 bg-slate-50/60">
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-white hover:text-primary-600 hover:border-primary-300 transition-colors cursor-pointer whitespace-nowrap"
        >
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
                style={{ position: 'sticky', left: 0, zIndex: 20, ...stickyHeader }}>
                <input type="checkbox" checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-steel-300 text-primary-500 cursor-pointer" />
              </th>
              <th className="border-b border-r border-steel-200 px-2 py-3 text-xs font-semibold text-steel-600 text-center align-middle whitespace-nowrap"
                style={{ position: 'sticky', left: `${CHECK_COL_WIDTH}px`, zIndex: 20, ...stickyHeader }}>
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
                style={{ position: 'sticky', right: 0, zIndex: 20, ...stickyHeader, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.1)' }}>
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
                  style={{ backgroundColor: rowBg }}
                >
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
                      <button onClick={() => onView(record)} title="查看"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-primary-50 text-steel-400 hover:text-primary-500 transition-colors cursor-pointer">
                        <i className="ri-eye-line text-sm" />
                      </button>
                      <button onClick={() => onNewApply(record)} title="立项申请"
                        className="px-2 py-1 text-xs rounded font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap">
                        立项申请
                      </button>
                      <button onClick={() => onPrint(record)} title="打印"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-steel-400 hover:text-steel-600 transition-colors cursor-pointer">
                        <i className="ri-printer-line text-sm" />
                      </button>
                      <button onClick={() => onPresent(record)} title="呈核"
                        className="px-2 py-1 text-xs rounded font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap">
                        呈核
                      </button>
                      {record.status === 'draft' && (
                        <button onClick={() => onDelete(record)} title="删除"
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-steel-400 hover:text-red-500 transition-colors cursor-pointer">
                          <i className="ri-delete-bin-line text-sm" />
                        </button>
                      )}
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
        onUpdateWidth={onUpdateWidth}
        onReset={onResetColumns}
      />
    </div>
  );
}
