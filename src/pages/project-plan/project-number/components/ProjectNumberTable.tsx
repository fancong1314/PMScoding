import { useState } from 'react';
import type { ProjectNumberRecord } from '@/mocks/projectNumberMocks';
import { projectNumberStatusMap } from '@/mocks/projectNumberMocks';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import ColumnSettingsPanel from '@/pages/project-plan/declaration/components/ColumnSettingsPanel';

interface Props {
  records: ProjectNumberRecord[];
  columns: ColumnDef[];
  pageOffset: number;
  onModify: (record: ProjectNumberRecord) => void;
  onDelete: (record: ProjectNumberRecord) => void;
  onChange: (record: ProjectNumberRecord) => void;
  onPrint: (record: ProjectNumberRecord) => void;
  onViewLog: (record: ProjectNumberRecord) => void;
  onToggleVisible: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onUpdateWidth: (id: string, width: number) => void;
  onResetColumns: () => void;
}

const SEQ_COL_WIDTH = 50;
const ACTION_COL_WIDTH = 220;
const LEFT_FIXED_WIDTH = SEQ_COL_WIDTH + 120; // 序号 + 立项号

export default function ProjectNumberTable({
  records, columns, pageOffset,
  onModify, onDelete, onChange, onPrint, onViewLog,
  onToggleVisible, onReorder, onUpdateWidth, onResetColumns,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const visibleCols = columns.filter((c) => c.visible);
  const middleWidth = visibleCols.reduce((sum, c) => sum + c.width, 0);
  const totalWidth = LEFT_FIXED_WIDTH + middleWidth + ACTION_COL_WIDTH;
  const headerBg = '#f5f7fa';

  const getStickyThStyle = (colIdx: number) => {
    if (colIdx === 0) return { position: 'sticky' as const, left: `${LEFT_FIXED_WIDTH}px`, zIndex: 20, backgroundColor: headerBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' };
    return { backgroundColor: headerBg };
  };

  const getStickyTdStyle = (colIdx: number, rowBg: string) => {
    if (colIdx === 0) return { position: 'sticky' as const, left: `${LEFT_FIXED_WIDTH}px`, zIndex: 10, backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' };
    return undefined;
  };

  const renderCell = (col: ColumnDef, record: ProjectNumberRecord): React.ReactNode => {
    switch (col.id) {
      case 'projectNo':
        return <span className="font-mono text-xs font-semibold text-steel-700 whitespace-nowrap">{record.projectNo}</span>;
      case 'isPreProject':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${record.isPreProject ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
            {record.isPreProject ? '是' : '否'}
          </span>
        );
      case 'preProjectAmount':
        return record.isPreProject
          ? <span className="text-sm text-steel-700">{record.preProjectAmount.toFixed(2)} <span className="text-xs text-steel-400">万元</span></span>
          : <span className="text-steel-300">—</span>;
      case 'preProjectDate':
        return record.isPreProject
          ? <span className="text-sm text-steel-600 whitespace-nowrap">{record.preProjectDate}</span>
          : <span className="text-steel-300">—</span>;
      case 'projectName':
        return (
          <span className="text-sm text-steel-800 font-medium leading-relaxed cursor-pointer hover:underline" style={{ color: '#2563eb' }} onClick={() => onModify(record)}>
            {record.projectName}
          </span>
        );
      case 'planNo':
        return <span className="font-mono text-xs text-steel-600 whitespace-nowrap">{record.planNo}</span>;
      case 'applyNo':
        return <span className="font-mono text-xs text-steel-600 whitespace-nowrap">{record.applyNo}</span>;
      case 'projectContent':
        return <span className="text-sm text-steel-600 line-clamp-2" title={record.projectContent}>{record.projectContent}</span>;
      case 'projectAmount':
        return (
          <div className="text-right">
            <span className="text-sm font-medium text-steel-800">{record.projectAmount.toFixed(2)}</span>
            <span className="text-xs text-steel-400 ml-1">万元</span>
          </div>
        );
      case 'projectDate':
        return <span className="text-sm text-steel-600 whitespace-nowrap">{record.projectDate}</span>;
      case 'division':
        return <span className="text-sm text-steel-700 whitespace-nowrap">{record.division}</span>;
      case 'ownerUnit':
        return <span className="text-sm text-steel-700 whitespace-nowrap">{record.ownerUnit}</span>;
      case 'implementUnit':
        return <span className="text-sm text-steel-700 whitespace-nowrap">{record.implementUnit}</span>;
      case 'professionalUnit':
        return <span className="text-sm text-steel-700 whitespace-nowrap">{record.professionalUnit}</span>;
      case 'isPlanInternal':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${record.isPlanInternal ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {record.isPlanInternal ? '是' : '否'}
          </span>
        );
      case 'isSuperFast':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${record.isSuperFast ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
            {record.isSuperFast ? '是' : '否'}
          </span>
        );
      case 'needSafetyAssessment':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${record.needSafetyAssessment ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
            {record.needSafetyAssessment ? '是' : '否'}
          </span>
        );
      case 'needHealthAssessment':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${record.needHealthAssessment ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
            {record.needHealthAssessment ? '是' : '否'}
          </span>
        );
      case 'projectType':
        return <span className="text-sm text-steel-700 whitespace-nowrap">{record.projectType}</span>;
      case 'planStartDate':
        return <span className="text-sm text-steel-600 whitespace-nowrap">{record.planStartDate}</span>;
      case 'planEndDate':
        return <span className="text-sm text-steel-600 whitespace-nowrap">{record.planEndDate}</span>;
      case 'projectManager':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
              {record.projectManager[0]}
            </div>
            <span className="text-sm text-steel-600 whitespace-nowrap">{record.projectManager}</span>
          </div>
        );
      case 'managerPhone':
        return <span className="text-sm text-steel-600 whitespace-nowrap">{record.managerPhone}</span>;
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${projectNumberStatusMap[record.status]?.color ?? ''}`}>
            {projectNumberStatusMap[record.status]?.label ?? record.status}
          </span>
        );
      default:
        return <span className="text-sm text-steel-600">—</span>;
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
            <col style={{ width: `${SEQ_COL_WIDTH}px` }} />
            <col style={{ width: '120px' }} />
            {visibleCols.map((c) => <col key={c.id} style={{ width: `${c.width}px` }} />)}
            <col style={{ width: `${ACTION_COL_WIDTH}px` }} />
          </colgroup>
          <thead>
            <tr>
              <th className="border-b border-r border-steel-200 px-2 py-3 text-xs font-semibold text-steel-600 text-center align-middle whitespace-nowrap"
                style={{ position: 'sticky', left: 0, zIndex: 20, backgroundColor: headerBg }}>
                序号
              </th>
              <th className="border-b border-r border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600 whitespace-nowrap align-middle"
                style={{ position: 'sticky', left: `${SEQ_COL_WIDTH}px`, zIndex: 20, backgroundColor: headerBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' }}>
                立项号
              </th>
              {visibleCols.map((col, colIdx) => (
                <th key={col.id}
                  className={`border-b border-steel-200 px-3 py-3 text-left text-xs font-semibold text-steel-600 whitespace-nowrap align-middle ${colIdx === 0 ? 'border-r' : ''}`}
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
              const rowBg = idx % 2 === 0 ? '#ffffff' : '#fafbfd';
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
                  <td data-sticky className="px-2 py-3 align-middle text-center text-sm text-steel-500 border-b border-r border-steel-100"
                    style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: rowBg }}>
                    {pageOffset + idx + 1}
                  </td>
                  <td data-sticky className="px-3 py-3 align-middle border-b border-r border-steel-100"
                    style={{ position: 'sticky', left: `${SEQ_COL_WIDTH}px`, zIndex: 10, backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                    <span className="font-mono text-xs font-semibold text-steel-700 whitespace-nowrap">{record.projectNo}</span>
                  </td>
                  {visibleCols.map((col, colIdx) => {
                    const isSticky = colIdx < 1;
                    const tdStyle = getStickyTdStyle(colIdx, rowBg);
                    return (
                      <td key={col.id}
                        data-sticky={isSticky ? '' : undefined}
                        className={`px-3 py-3 text-sm align-middle border-b border-steel-100 ${colIdx === 0 ? 'border-r' : ''}`}
                        style={tdStyle}>
                        {renderCell(col, record)}
                      </td>
                    );
                  })}
                  <td data-sticky className="px-2 py-3 align-middle border-b border-l border-steel-100"
                    style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: rowBg, boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-center gap-0.5 flex-wrap">
                      <button onClick={() => onModify(record)} title="修改"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-primary-50 text-steel-400 hover:text-primary-500 transition-colors cursor-pointer">
                        <i className="ri-edit-line text-sm" />
                      </button>
                      <button onClick={() => onDelete(record)} title="删除"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-steel-400 hover:text-red-500 transition-colors cursor-pointer">
                        <i className="ri-delete-bin-line text-sm" />
                      </button>
                      <button onClick={() => onChange(record)} title="变更"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-amber-50 text-steel-400 hover:text-amber-600 transition-colors cursor-pointer">
                        <i className="ri-exchange-line text-sm" />
                      </button>
                      <button onClick={() => onPrint(record)} title="列印立项通知单"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-steel-400 hover:text-steel-700 transition-colors cursor-pointer">
                        <i className="ri-printer-line text-sm" />
                      </button>
                      <button onClick={() => onViewLog(record)} title="操作日志"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-sky-50 text-steel-400 hover:text-sky-600 transition-colors cursor-pointer">
                        <i className="ri-file-list-3-line text-sm" />
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
                    <p className="text-sm text-steel-400">暂无立项号数据</p>
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