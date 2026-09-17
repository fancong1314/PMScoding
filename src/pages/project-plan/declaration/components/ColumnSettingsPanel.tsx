import { useState, useRef } from 'react';
import type { ColumnDef } from '@/hooks/useColumnConfig';

interface Props {
  open: boolean;
  columns: ColumnDef[];
  onClose: () => void;
  onToggleVisible: (id: string) => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
  onUpdateWidth?: (id: string, width: number) => void;
  onReset: () => void;
}

export default function ColumnSettingsPanel({
  open,
  columns,
  onClose,
  onToggleVisible,
  onReorder,
  onReset,
}: Props) {
  const dragFromIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  if (!open) return null;

  const handleDragStart = (idx: number) => {
    dragFromIdx.current = idx;
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (dragFromIdx.current !== null && dragFromIdx.current !== idx) {
      onReorder(dragFromIdx.current, idx);
    }
    dragFromIdx.current = null;
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    dragFromIdx.current = null;
    setDragOverIdx(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-24 pr-6">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-steel-200 shadow-lg w-[280px] flex flex-col"
           style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-steel-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-settings-3-line text-primary-500 text-sm" />
            </div>
            <span className="text-sm font-semibold text-steel-800">表头设置</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-steel-400 cursor-pointer transition-colors"
          >
            <i className="ri-close-line text-base" />
          </button>
        </div>

        {/* Hint */}
        <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100 flex-shrink-0">
          <p className="text-xs text-blue-600">
            <i className="ri-information-line mr-1" />
            拖拽行可调整列顺序；序号列和操作列强制显示
          </p>
        </div>

        {/* Column list */}
        <div className="overflow-y-auto flex-1 px-3 py-2">
          {/* Table header row */}
          <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
            <div className="w-6 flex-shrink-0" />
            <div className="flex-1 text-xs font-medium text-steel-400">列名</div>
            <div className="w-14 text-xs font-medium text-steel-400 text-center">显示</div>
          </div>

          {columns.map((col, idx) => (
            <div
              key={col.id}
              draggable={!col.required}
              onDragStart={() => !col.required && handleDragStart(idx)}
              onDragOver={(e) => !col.required && handleDragOver(e, idx)}
              onDrop={() => !col.required && handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg mb-1 transition-colors ${
                dragOverIdx === idx ? 'bg-blue-50 border border-dashed border-primary-400' : 'hover:bg-slate-50'
              } ${col.required ? 'opacity-60' : 'cursor-grab active:cursor-grabbing'}`}
            >
              {/* Drag handle */}
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {col.required ? (
                  <i className="ri-lock-line text-xs text-steel-300" />
                ) : (
                  <i className="ri-drag-move-2-line text-sm text-steel-300" />
                )}
              </div>

              {/* Label */}
              <div className="flex-1 text-sm text-steel-700">{col.label}</div>

              {/* Visible toggle */}
              <div className="w-14 flex items-center justify-center flex-shrink-0">
                <button
                  disabled={col.required}
                  onClick={() => !col.required && onToggleVisible(col.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    col.required ? 'cursor-not-allowed' : 'cursor-pointer'
                  } ${col.visible ? 'bg-primary-500' : 'bg-steel-200'}`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      col.visible ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-steel-200 flex-shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-refresh-line" />
            </div>
            重置默认
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-white rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}