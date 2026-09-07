import { useState } from 'react';
import type { PlanPriorityLevel } from '@/mocks/planReviewMocks';
import { PRIORITY_LEVEL_TIPS } from '@/mocks/planReviewMocks';

interface Props {
  open: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (level: PlanPriorityLevel) => void;
}

const LEVELS: PlanPriorityLevel[] = ['A', 'B', 'C', 'D'];

const LEVEL_STYLE: Record<PlanPriorityLevel, string> = {
  A: 'border-rose-300 bg-rose-50 text-rose-700',
  B: 'border-amber-300 bg-amber-50 text-amber-700',
  C: 'border-sky-300 bg-sky-50 text-sky-700',
  D: 'border-slate-300 bg-slate-50 text-slate-600',
};

export default function PriorityBatchModal({ open, selectedCount, onClose, onConfirm }: Props) {
  const [level, setLevel] = useState<PlanPriorityLevel>('A');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h3 className="text-base font-semibold text-steel-800">优先级排序</h3>
            <p className="text-xs text-steel-400 mt-0.5">
              已选 <span className="text-primary-600 font-medium">{selectedCount}</span> 条年度计划，请选择优先级等级
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {LEVELS.map((lv) => (
              <button
                key={lv}
                type="button"
                onClick={() => setLevel(lv)}
                className={`px-3 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                  level === lv
                    ? `${LEVEL_STYLE[lv]} ring-2 ring-offset-1 ring-emerald-400`
                    : 'border-steel-200 bg-white text-steel-600 hover:bg-slate-50'
                }`}
              >
                {lv}类
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-steel-200 bg-slate-50/80 p-4 space-y-3">
            <p className="text-xs font-semibold text-steel-600 flex items-center gap-1.5">
              <i className="ri-information-line text-emerald-500" />
              各等级判断标准
            </p>
            {LEVELS.map((lv) => (
              <div
                key={lv}
                className={`rounded-md border px-3 py-2.5 text-xs leading-relaxed ${
                  level === lv ? LEVEL_STYLE[lv] : 'border-steel-100 bg-white text-steel-600'
                }`}
              >
                <span className="font-semibold mr-1">{lv}类：</span>
                {PRIORITY_LEVEL_TIPS[lv]}
              </div>
            ))}
            <p className="text-[11px] text-steel-400 pt-1 border-t border-steel-100">
              注：内部收益率（FIRR）、静态投资回收期计算方法由财务部确定。
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-white cursor-pointer whitespace-nowrap"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onConfirm(level)}
            className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}
          >
            确认设置（{level}类）
          </button>
        </div>
      </div>
    </div>
  );
}
