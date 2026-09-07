import { useState } from 'react';
import type { ReviewRecord } from '@/mocks/reviewMocks';
import { reviewStatusMap } from '@/mocks/reviewMocks';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import ColumnSettingsPanel from '@/pages/project-plan/declaration/components/ColumnSettingsPanel';
import ChangeHandlerModal from './ChangeHandlerModal';
import ReturnModal from './ReturnModal';

interface Props {
  records: ReviewRecord[];
  selectedRows: string[];
  columns: ColumnDef[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onViewForm: (record: ReviewRecord) => void;
  onChangeHandler: (id: string, newHandler: string) => void;
  onReturn: (id: string, returnType: 1 | 2, reason: string) => void;
  onToggleVisible: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onUpdateWidth: (id: string, width: number) => void;
  onResetColumns: () => void;
  pageOffset: number;
}

const SEQ_COL_WIDTH = 60;
const CHECK_COL_WIDTH = 44;
const ACTION_COL_WIDTH = 150;
const LEFT_FIXED_WIDTH = CHECK_COL_WIDTH + SEQ_COL_WIDTH;

export default function ReviewTable({
  records, selectedRows, columns,
  onToggleSelectAll, onToggleSelectRow,
  onViewForm, onChangeHandler, onReturn,
  onToggleVisible, onReorder, onUpdateWidth, onResetColumns,
  pageOffset,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [changeHandlerTarget, setChangeHandlerTarget] = useState<ReviewRecord | null>(null);
  const [returnTarget, setReturnTarget] = useState<ReviewRecord | null>(null);

  const visibleCols = columns.filter((c) => c.visible);
  const middleWidth = visibleCols.reduce((sum, c) => sum + c.width, 0);
  const totalWidth = LEFT_FIXED_WIDTH + middleWidth + ACTION_COL_WIDTH;
  const isAllSelected = records.length > 0 && selectedRows.length === records.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < records.length;

  const stickyHeaderBg = '#f5f7fa';

  const col0Left = LEFT_FIXED_WIDTH;
  const col1Left = LEFT_FIXED_WIDTH + (visibleCols[0]?.width ?? 0);

  const getStickyThStyle = (colIdx: number) => {
    if (colIdx === 0) return { position: 'sticky' as const, left: `${col0Left}px`, zIndex: 20, backgroundColor: stickyHeaderBg };
    if (colIdx === 1) return { position: 'sticky' as const, left: `${col1Left}px`, zIndex: 20, backgroundColor: stickyHeaderBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' };
    return { backgroundColor: stickyHeaderBg };
  };

  const getStickyTdStyle = (colIdx: number, rowBg: string) => {
    if (colIdx === 0) return { position: 'sticky' as const, left: `${col0Left}px`, zIndex: 10, backgroundColor: rowBg };
    if (colIdx === 1) return { position: 'sticky' as const, left: `${col1Left}px`, zIndex: 10, backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' };
    return undefined;
  };

  const renderCell = (col: ColumnDef, record: ReviewRecord): React.ReactNode => {
    switch (col.id) {
      case 'applyName':
        return (
          <span className="line-clamp-1 text-steel-700 cursor-pointer hover:underline"
            style={{ color: '#2563eb' }}
            onClick={() => onViewForm(record)}
            title={record.applyName}>
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
          <button
            onClick={() => setChangeHandlerTarget(record)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors cursor-pointer group hover:bg-primary-50 whitespace-nowrap"
            style={{ color: '#2563eb' }}
            title="点击更换经办人">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
              {record.handler[0]}
            </div>
            <span>{record.handler}</span>
            <div className="w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="ri-pencil-line text-xs" />
            </div>
          </button>
        );
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${reviewStatusMap[record.status]?.color ?? ''}`}>
            {reviewStatusMap[record.status]?.label ?? record.status}
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
                style={{ position: 'sticky', left: 0, zIndex: 20, backgroundColor: stickyHeaderBg }}>
                <input type="checkbox" checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-steel-300 text-primary-500 cursor-pointer" />
              </th>
              <th className="border-b border-r border-steel-200 px-2 py-3 text-xs font-semibold text-steel-600 text-center align-middle whitespace-nowrap"
                style={{ position: 'sticky', left: `${CHECK_COL_WIDTH}px`, zIndex: 20, backgroundColor: stickyHeaderBg }}>
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
                style={{ position: 'sticky', right: 0, zIndex: 20, backgroundColor: stickyHeaderBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.1)' }}>
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
                      <button onClick={() => onViewForm(record)} title="呈核表单"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-primary-50 text-steel-400 hover:text-primary-500 transition-colors cursor-pointer">
                        <i className="ri-send-plane-line text-sm" />
                      </button>
                      <button onClick={() => setReturnTarget(record)} title="退回"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-steel-400 hover:text-red-500 transition-colors cursor-pointer">
                        <i className="ri-arrow-go-back-line text-sm" />
                      </button>
                      <button onClick={() => onViewForm(record)} title="查看"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-steel-400 hover:text-steel-600 transition-colors cursor-pointer">
                        <i className="ri-eye-line text-sm" />
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
                    <p className="text-sm text-steel-400">暂无审核数据</p>
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

      <ChangeHandlerModal
        open={!!changeHandlerTarget}
        currentHandler={changeHandlerTarget?.handler ?? ''}
        recordName={changeHandlerTarget?.applyName ?? ''}
        onClose={() => setChangeHandlerTarget(null)}
        onConfirm={(newHandler) => {
          if (changeHandlerTarget) onChangeHandler(changeHandlerTarget.id, newHandler);
          setChangeHandlerTarget(null);
        }}
      />

      <ReturnModal
        open={!!returnTarget}
        recordName={returnTarget?.applyName ?? ''}
        onClose={() => setReturnTarget(null)}
        onConfirm={(returnType, reason) => {
          if (returnTarget) onReturn(returnTarget.id, returnType, reason);
          setReturnTarget(null);
        }}
      />
    </div>
  );
}
