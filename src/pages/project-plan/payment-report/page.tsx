import { useMemo, useState } from 'react';
import Layout from '@/components/feature/Layout';
import {
  planPaymentSources,
  paymentReportYears,
  paymentReportMajorCategories,
  paymentReportUnits,
  MONTH_LABELS,
  buildPaymentMatrix,
  getMonthDetails,
} from '@/mocks/planPaymentReportMocks';
import type { MonthProjectDetail, PlanPaymentSource } from '@/mocks/planPaymentReportMocks';

function fmt(n: number) {
  if (!n) return '—';
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function MonthDetailDrawer({
  open,
  year,
  monthIndex,
  details,
  onClose,
}: {
  open: boolean;
  year: string;
  monthIndex: number;
  details: MonthProjectDetail[];
  onClose: () => void;
}) {
  if (!open) return null;
  const total = details.reduce((s, d) => s + d.amount, 0);
  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="relative w-full max-w-lg h-full bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h3 className="text-base font-semibold text-steel-800">{year}年{MONTH_LABELS[monthIndex]}付款明细</h3>
            <p className="text-xs text-steel-400 mt-0.5">共 {details.length} 笔 · 合计 {fmt(total)} 万元</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {details.length === 0 ? (
            <p className="py-16 text-center text-sm text-steel-400">该月无计划付款</p>
          ) : (
            <div className="space-y-2.5">
              {details.map((d, i) => (
                <div key={`${d.planId}-${i}`} className="rounded-lg border border-steel-200 px-3.5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-steel-800 leading-snug">{d.planName}</p>
                      <p className="text-xs text-steel-400 mt-1 font-mono">{d.planNo}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-700 tabular-nums whitespace-nowrap">{fmt(d.amount)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-50 text-emerald-700">{d.projectMajorCategory}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-steel-600">{d.businessUnit}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-sky-50 text-sky-700">{d.paymentType}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlanPaymentReportPage() {
  const [sources] = useState<PlanPaymentSource[]>(planPaymentSources);
  const [paymentYear, setPaymentYear] = useState('2026');
  const [filterMajor, setFilterMajor] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterName, setFilterName] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [monthDrawer, setMonthDrawer] = useState<number | null>(null);

  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      if (filterMajor && s.projectMajorCategory !== filterMajor) return false;
      if (filterUnit && s.businessUnit !== filterUnit) return false;
      if (filterName && !s.planName.includes(filterName) && !s.planNo.includes(filterName)) return false;
      return true;
    });
  }, [sources, filterMajor, filterUnit, filterName]);

  const matrix = useMemo(
    () => buildPaymentMatrix(filteredSources, paymentYear),
    [filteredSources, paymentYear]
  );

  const displayMatrix = useMemo(() => {
    if (matrix.rows.length > 0) return matrix;
    return buildPaymentMatrix(sources, paymentYear);
  }, [matrix, sources, paymentYear]);

  const usedFallback = matrix.rows.length === 0 && displayMatrix.rows.length > 0
    && !!(filterMajor || filterUnit || filterName);

  const monthDetails = useMemo(() => {
    if (monthDrawer == null) return [];
    const base = usedFallback ? sources : filteredSources;
    return getMonthDetails(base, paymentYear, monthDrawer);
  }, [monthDrawer, usedFallback, sources, filteredSources, paymentYear]);

  const handleReset = () => {
    setFilterMajor('');
    setFilterUnit('');
    setFilterName('');
  };

  const handleExport = () => {
    setToast(`正在导出 ${paymentYear}年付款计划表（${displayMatrix.rows.length} 个项目）...`);
    setTimeout(() => setToast(null), 2800);
  };

  const inputCls = 'w-full px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">年度付款计划报表</h1>
            <p className="text-xs text-steel-400 mt-0.5">
              按年度计划表单「付款计划」自动汇总，生成财务可对账的月度付款表（单位：万元）
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
          >
            <i className="ri-file-excel-2-line" />
            导出付款计划表
          </button>
        </div>

        {/* 筛选 */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3">
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-x-4 gap-y-2.5">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right flex-shrink-0">付款年度</label>
              <select value={paymentYear} onChange={(e) => setPaymentYear(e.target.value)} className={inputCls + ' cursor-pointer'}>
                {paymentReportYears.map((y) => <option key={y} value={y}>{y}年</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right flex-shrink-0">项目大类</label>
              <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {paymentReportMajorCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right flex-shrink-0">项目单位</label>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {paymentReportUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 xl:col-span-1">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right flex-shrink-0">计划名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="名称/计划号" className={inputCls} />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={handleReset}
                className="px-3 py-1.5 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                重置
              </button>
            </div>
          </div>
        </div>

        {usedFallback && (
          <p className="text-xs text-amber-600 -mt-1">当前筛选在该付款年度无匹配项目，已展示全部演示数据</p>
        )}

        {/* 矩阵表 */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-steel-100 bg-slate-50/80">
            <h3 className="text-sm font-semibold text-steel-800">项目月度付款明细表</h3>
            <span className="text-xs text-steel-400">行=年度计划 · 列=付款月份 · 点击月列头查看来源</span>
          </div>
          <div className="overflow-x-auto">
            <table className="border-collapse text-left" style={{ minWidth: 1480, width: '100%' }}>
              <thead>
                <tr className="bg-slate-50">
                  <th className="sticky left-0 z-20 bg-slate-50 px-2 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 w-10">序号</th>
                  <th className="sticky left-10 z-20 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-steel-500 border-b border-r border-steel-200 min-w-[200px]">年度计划名称</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">项目单位</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap">大类</th>
                  {MONTH_LABELS.map((m, i) => (
                    <th
                      key={m}
                      className="px-1.5 py-2 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap cursor-pointer hover:text-emerald-600 hover:bg-emerald-50/50"
                      onClick={() => setMonthDrawer(i)}
                      title={`查看${paymentYear}年${m}付款来源项目`}
                    >
                      {paymentYear}年{m}
                    </th>
                  ))}
                  <th className="sticky right-0 z-20 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-steel-700 border-b border-l border-steel-200 whitespace-nowrap">行合计</th>
                </tr>
              </thead>
              <tbody>
                {displayMatrix.rows.length > 0 && (
                  <tr className="bg-emerald-50/60">
                    <td className="sticky left-0 z-10 bg-emerald-50 px-2 py-2.5 border-b border-emerald-100" colSpan={2}>
                      <span className="text-xs font-semibold text-emerald-800 pl-2">月度合计</span>
                    </td>
                    <td className="bg-emerald-50 border-b border-emerald-100" colSpan={2} />
                    {displayMatrix.monthTotals.map((amt, mi) => (
                      <td
                        key={mi}
                        className={`px-1.5 py-2.5 text-center text-xs font-semibold tabular-nums border-b border-emerald-100 cursor-pointer hover:bg-emerald-100 ${amt > 0 ? 'text-emerald-800' : 'text-emerald-400'}`}
                        onClick={() => setMonthDrawer(mi)}
                      >
                        {fmt(amt)}
                      </td>
                    ))}
                    <td className="sticky right-0 z-10 bg-emerald-50 px-3 py-2.5 text-center text-sm font-bold text-emerald-800 tabular-nums border-b border-l border-emerald-100">
                      {fmt(displayMatrix.yearTotal)}
                    </td>
                  </tr>
                )}
                {displayMatrix.rows.length === 0 ? (
                  <tr>
                    <td colSpan={17} className="py-14 text-center text-sm text-steel-400">
                      {paymentYear}年暂无付款计划数据
                    </td>
                  </tr>
                ) : (
                  displayMatrix.rows.map((row, idx) => {
                    const rowBg = idx % 2 === 0 ? '#ffffff' : '#fafbfd';
                    return (
                      <tr key={row.source.id} style={{ backgroundColor: rowBg }}>
                        <td className="sticky left-0 z-10 px-2 py-2 text-center text-xs text-steel-500 border-b border-steel-100" style={{ backgroundColor: rowBg }}>
                          {idx + 1}
                        </td>
                        <td className="sticky left-10 z-10 px-3 py-2 border-b border-r border-steel-100" style={{ backgroundColor: rowBg, boxShadow: '2px 0 6px -2px rgba(0,0,0,0.05)' }}>
                          <p className="text-sm text-steel-800 font-medium line-clamp-1" title={row.source.planName}>{row.source.planName}</p>
                          <p className="text-[10px] text-steel-400 font-mono mt-0.5">{row.source.planNo}</p>
                        </td>
                        <td className="px-2 py-2 text-center border-b border-steel-100">
                          <span className="text-[11px] text-steel-600 whitespace-nowrap">{row.source.businessUnit}</span>
                        </td>
                        <td className="px-2 py-2 text-center border-b border-steel-100">
                          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">{row.source.projectMajorCategory}</span>
                        </td>
                        {row.months.map((amt, mi) => (
                          <td
                            key={mi}
                            className={`px-1.5 py-2 text-center text-xs tabular-nums border-b border-steel-100 ${amt > 0 ? 'text-steel-800 font-medium cursor-pointer hover:bg-emerald-50' : 'text-steel-300'}`}
                            onClick={() => amt > 0 && setMonthDrawer(mi)}
                          >
                            {fmt(amt)}
                          </td>
                        ))}
                        <td className="sticky right-0 z-10 px-3 py-2 text-center text-xs font-semibold text-emerald-700 tabular-nums border-b border-l border-steel-100" style={{ backgroundColor: rowBg }}>
                          {fmt(row.rowTotal)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-steel-400 leading-relaxed px-1">
          说明：本表根据各年度计划申报表单中「付款计划」栏目的付款月份与金额自动归集；同一项目在同一月份多笔付款已合并展示。财务可按月份下钻查看项目来源，并导出全表用于资金排程。
        </p>
      </div>

      <MonthDetailDrawer
        open={monthDrawer != null}
        year={paymentYear}
        monthIndex={monthDrawer ?? 0}
        details={monthDetails}
        onClose={() => setMonthDrawer(null)}
      />

      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border bg-emerald-50 border-emerald-200">
            <i className="ri-information-line text-emerald-600" />
            <span className="text-sm text-emerald-700">{toast}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
