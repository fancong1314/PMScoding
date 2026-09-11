import { useMemo, useState } from 'react';
import { getApprovedAnnualPlans } from '@/mocks/projectPlans';
import type { ProjectPlan } from '@/mocks/projectPlans';

interface Props {
  open: boolean;
  selectedId?: string;
  onClose: () => void;
  onSelect: (plan: ProjectPlan) => void;
}

export default function AnnualPlanSelectModal({ open, selectedId, onClose, onSelect }: Props) {
  const [keyword, setKeyword] = useState('');
  const plans = useMemo(() => (open ? getApprovedAnnualPlans() : []), [open]);

  const filtered = useMemo(() => {
    const k = keyword.trim();
    if (!k) return plans;
    return plans.filter(
      (p) =>
        (p.planName || '').includes(k) ||
        (p.planNo || '').includes(k) ||
        (p.annualPlanNo || '').includes(k)
    );
  }, [plans, keyword]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/35" />
      <div
        className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h4 className="text-sm font-semibold text-steel-800">选择年度计划</h4>
            <p className="text-xs text-steel-400 mt-0.5">仅展示申请通过（已转计划）的年度计划，可按计划名称、计划号搜索</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-steel-400 hover:bg-slate-100 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-steel-100">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-steel-400 text-sm" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索计划名称 / 计划号"
              className="w-full pl-9 pr-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-slate-50 border-b border-steel-200">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-steel-600 w-[140px]">计划号</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-steel-600">计划名称</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-steel-600 w-[100px]">计划年度</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-steel-600 w-[120px]">项目提报单位</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-steel-600 w-[110px]">投资估算</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-steel-600 w-[80px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center text-sm text-steel-400">
                    暂无匹配的已通过年度计划
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const no = p.planNo || p.annualPlanNo || '—';
                  const active = selectedId === p.id;
                  return (
                    <tr key={p.id} className={`border-b border-steel-100 ${active ? 'bg-emerald-50/60' : 'hover:bg-slate-50'}`}>
                      <td className="px-4 py-2.5 font-mono text-xs text-primary-700 whitespace-nowrap">{no}</td>
                      <td className="px-4 py-2.5 text-steel-800">
                        <span className="line-clamp-1" title={p.planName}>{p.planName}</span>
                      </td>
                      <td className="px-4 py-2.5 text-steel-600 whitespace-nowrap">{p.planYear}年</td>
                      <td className="px-4 py-2.5 text-steel-600 whitespace-nowrap">{p.businessDivision}</td>
                      <td className="px-4 py-2.5 text-right text-steel-700 tabular-nums whitespace-nowrap">
                        {Number(p.budgetAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => onSelect(p)}
                          className="px-2.5 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded cursor-pointer"
                        >
                          选择
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-steel-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
