import { useState, useRef, useEffect } from 'react';
import type { DeferralProject, ApplicationType } from '@/mocks/deferralMocks';
import { projectStatusMap, approvalStatusMap, appTypeMap } from '@/mocks/deferralMocks';
import type { ColumnDef } from '@/hooks/useColumnConfig';

interface Props {
  records: DeferralProject[];
  columns: ColumnDef[];
  pageOffset: number;
  onViewLog: (project: DeferralProject) => void;
  onApply: (project: DeferralProject, type: ApplicationType) => void;
  onToggleVisible: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onUpdateWidth: (id: string, width: number) => void;
  onResetColumns: () => void;
}

function ColumnSettingsPanel({
  columns,
  onToggleVisible,
  onReorder,
  onReset,
  onClose,
}: {
  columns: ColumnDef[];
  onToggleVisible: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  return (
    <div className="absolute right-0 top-8 z-50 w-64 bg-white border border-steel-200 rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-steel-800">自定义表头</span>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="text-xs text-steel-400 hover:text-primary-600 cursor-pointer whitespace-nowrap">重置</button>
          <button onClick={onClose} className="w-5 h-5 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"><i className="ri-close-line" /></button>
        </div>
      </div>
      <div className="space-y-1 max-h-72 overflow-y-auto">
        {columns.map((col, idx) => (
          <div
            key={col.id}
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragIdx !== null && dragIdx !== idx) { onReorder(dragIdx, idx); setDragIdx(null); } }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-grab"
          >
            <div className="w-4 h-4 flex items-center justify-center text-steel-300 flex-shrink-0"><i className="ri-drag-move-2-line text-sm" /></div>
            <label className="flex items-center gap-2 flex-1 cursor-pointer">
              <input type="checkbox" checked={col.visible} onChange={() => onToggleVisible(col.id)} className="rounded cursor-pointer" />
              <span className="text-sm text-steel-700">{col.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

const opBtnStyle: Record<string, string> = {
  delay:     'text-amber-600 hover:bg-amber-50 border-amber-200',
  suspend:   'text-sky-600 hover:bg-sky-50 border-sky-200',
  cancel:    'text-orange-600 hover:bg-orange-50 border-orange-200',
  terminate: 'text-red-600 hover:bg-red-50 border-red-200',
  change:    'text-violet-600 hover:bg-violet-50 border-violet-200',
};

export default function DeferralTable({
  records, columns, pageOffset,
  onViewLog, onApply,
  onToggleVisible, onReorder, onUpdateWidth, onResetColumns,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<{ colId: string; startX: number; startW: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResizeMouseDown = (colId: string, startX: number, startW: number) => {
    resizingRef.current = { colId, startX, startW };
    const onMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = e.clientX - resizingRef.current.startX;
      const newW = Math.max(80, resizingRef.current.startW + delta);
      onUpdateWidth(resizingRef.current.colId, newW);
    };
    const onUp = () => { resizingRef.current = null; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const visibleCols = columns.filter((c) => c.visible);

  const renderCell = (col: ColumnDef, record: DeferralProject) => {
    switch (col.id) {
      case 'projectNo':
        return <span className="font-mono text-xs text-steel-700">{record.projectNo}</span>;
      case 'companyAlias':
        return <span className="text-sm text-steel-700">{record.companyAlias}</span>;
      case 'isPreProject':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${record.isPreProject ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
            {record.isPreProject ? '是' : '否'}
          </span>
        );
      case 'preProjectAmount':
        return record.isPreProject
          ? <span className="text-sm text-steel-700 font-medium">{record.preProjectAmount} <span className="text-xs text-steel-400">万元</span></span>
          : <span className="text-steel-300">—</span>;
      case 'preProjectDate':
        return record.isPreProject
          ? <span className="text-sm text-steel-600">{record.preProjectDate}</span>
          : <span className="text-steel-300">—</span>;
      case 'projectName':
        return <span className="text-sm text-steel-800 font-medium leading-relaxed">{record.projectName}</span>;
      case 'planNo':
        return <span className="font-mono text-xs text-steel-600">{record.planNo}</span>;
      case 'projectStatus': {
        const s = projectStatusMap[record.projectStatus];
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>;
      }
      case 'approvalStatus': {
        const s = approvalStatusMap[record.approvalStatus];
        return (
          <span className={`text-xs font-medium ${s.color}`}>
            <i className="ri-checkbox-blank-circle-fill text-[8px] mr-1 align-middle" />{s.label}
          </span>
        );
      }
      default:
        return <span className="text-sm text-steel-600">—</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-steel-100 bg-slate-50">
        <span className="text-xs text-steel-500">共 <span className="font-medium text-steel-700">{records.length}</span> 条</span>
        <div ref={settingsRef} className="relative">
          <button onClick={() => setSettingsOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-steel-500 border border-steel-200 rounded-md px-2.5 py-1.5 hover:bg-white transition-colors cursor-pointer whitespace-nowrap">
            <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-layout-column-line" /></div>
            表头设置
          </button>
          {settingsOpen && (
            <ColumnSettingsPanel columns={columns} onToggleVisible={onToggleVisible} onReorder={onReorder} onReset={onResetColumns} onClose={() => setSettingsOpen(false)} />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left" style={{ minWidth: 1200 }}>
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2.5 text-center text-xs font-medium text-steel-500 border-b border-steel-200" style={{ width: 50 }}>序号</th>
              {visibleCols.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-2.5 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap relative group select-none"
                  style={{ width: col.width, minWidth: col.width }}
                >
                  {col.label}
                  <div
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize group-hover:bg-primary-300 transition-colors"
                    onMouseDown={(e) => handleResizeMouseDown(col.id, e.clientX, col.width ?? 120)}
                  />
                </th>
              ))}
              <th className="sticky right-0 z-10 bg-slate-50 px-3 py-2.5 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap" style={{ width: 260 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + 2} className="text-center py-16 text-steel-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100">
                      <i className="ri-inbox-2-line text-xl text-steel-300" />
                    </div>
                    <span className="text-sm">暂无数据</span>
                  </div>
                </td>
              </tr>
            ) : records.map((record, idx) => (
              <tr key={record.id} className="border-b border-steel-100 hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-10 bg-white px-3 py-3 text-center text-sm text-steel-500 group-hover:bg-slate-50">{pageOffset + idx + 1}</td>
                {visibleCols.map((col) => (
                  <td key={col.id} className="px-3 py-3 text-left align-middle" style={{ width: col.width, maxWidth: col.width }}>
                    <div className="overflow-hidden">{renderCell(col, record)}</div>
                  </td>
                ))}
                <td className="sticky right-0 z-10 bg-white px-3 py-3">
                  <div className="flex items-center gap-1.5 justify-center flex-wrap">
                    <button
                      onClick={() => onViewLog(record)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-steel-200 text-steel-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-file-list-3-line text-xs" />操作日志
                    </button>
                    {record.allowedOps.map((op) => {
                      const info = appTypeMap[op];
                      return (
                        <button
                          key={op}
                          onClick={() => onApply(record, op)}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${opBtnStyle[op]}`}
                        >
                          {info.label}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
