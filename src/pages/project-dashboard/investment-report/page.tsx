import { useState, useMemo } from 'react';
import Layout from '@/components/feature/Layout';
import {
  unitReportRows,
  reportSummary,
  reportYears,
  reviewStages,
  type UnitReportRow,
  type ProjectTypeData,
} from '@/mocks/investmentReportMocks';

function fmt(val: number): string {
  if (val === 0) return '0.00';
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtInt(val: number): string {
  if (val === 0) return '0';
  return String(val);
}

const PROJECT_TYPES: { key: keyof UnitReportRow; label: string }[] = [
  { key: 'pinZhongZhiLiang', label: '品种质量' },
  { key: 'tiXiaoZengYi', label: '提效增益' },
  { key: 'zhinengXinXi', label: '智能制造-信息化' },
  { key: 'zhinengZiDongHua', label: '智能制造-自动化' },
  { key: 'zhuangBeiShengJi', label: '装备升级' },
  { key: 'anQuanHuanBao', label: '安全环保' },
  { key: 'total', label: '合计' },
];

const COL_COLORS = [
  'bg-sky-100',
  'bg-teal-100',
  'bg-indigo-100',
  'bg-purple-100',
  'bg-amber-100',
  'bg-emerald-100',
  'bg-rose-100',
];

const COL_HEADER_COLORS = [
  { bg: '#e0f2fe', border: '#bae6fd' },
  { bg: '#ccfbf1', border: '#99f6e4' },
  { bg: '#e0e7ff', border: '#c7d2fe' },
  { bg: '#ede9fe', border: '#ddd6fe' },
  { bg: '#fef9c3', border: '#fde68a' },
  { bg: '#dcfce7', border: '#bbf7d0' },
  { bg: '#ffe4e6', border: '#fecdd3' },
];

function sumField(rows: UnitReportRow[], typeKey: keyof UnitReportRow, field: keyof ProjectTypeData): number {
  return rows.reduce((s, row) => {
    const d = row[typeKey] as ProjectTypeData;
    return s + d[field];
  }, 0);
}

export default function InvestmentReportPage() {
  const [year, setYear] = useState('2024');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reviewStage, setReviewStage] = useState('申报阶段');
  const [includeSubsidiary, setIncludeSubsidiary] = useState('');
  const [queried, setQueried] = useState(true);

  const displayRows = useMemo(() => {
    if (!queried) return [];
    return unitReportRows;
  }, [queried]);

  const totalRow: UnitReportRow = useMemo(() => {
    const calc = (key: keyof UnitReportRow): ProjectTypeData => ({
      declareAmount: sumField(displayRows, key, 'declareAmount'),
      benefit: sumField(displayRows, key, 'benefit'),
      count: sumField(displayRows, key, 'count'),
    });
    return {
      unitName: '合计',
      pinZhongZhiLiang: calc('pinZhongZhiLiang'),
      tiXiaoZengYi: calc('tiXiaoZengYi'),
      zhinengXinXi: calc('zhinengXinXi'),
      zhinengZiDongHua: calc('zhinengZiDongHua'),
      zhuangBeiShengJi: calc('zhuangBeiShengJi'),
      anQuanHuanBao: calc('anQuanHuanBao'),
      total: calc('total'),
    };
  }, [displayRows]);

  const handleQuery = () => setQueried(true);
  const handleReset = () => {
    setYear('2024');
    setDateFrom('');
    setDateTo('');
    setReviewStage('申报阶段');
    setIncludeSubsidiary('');
    setQueried(true);
  };

  const inputCls =
    'px-2 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 bg-white';

  const { totalInvestment, totalEquipmentFee, totalConstructionFee, totalOtherFee } = reportSummary;
  const equipPct = ((totalEquipmentFee / totalInvestment) * 100).toFixed(2);
  const consPct = ((totalConstructionFee / totalInvestment) * 100).toFixed(2);
  const otherPct = ((totalOtherFee / totalInvestment) * 100).toFixed(2);

  return (
    <Layout>
      <div className="space-y-3">
        {/* Title */}
        <div>
          <h1 className="text-lg font-semibold text-steel-900">年度计划投资报表</h1>
          <p className="text-xs text-steel-400 mt-0.5">按单位统计各项目类型的申报金额、效益及项数</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Year */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-steel-500 whitespace-nowrap">年度</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={inputCls + ' cursor-pointer w-24'}
              >
                {reportYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-steel-500 whitespace-nowrap">申报日期</label>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className={inputCls + ' w-36 pr-2'}
                  />
                </div>
                <span className="text-steel-300 text-sm">~</span>
                <div className="relative">
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className={inputCls + ' w-36 pr-2'}
                  />
                </div>
              </div>
            </div>

            {/* Review Stage */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-steel-500 whitespace-nowrap">审核阶段</label>
              <select
                value={reviewStage}
                onChange={(e) => setReviewStage(e.target.value)}
                className={inputCls + ' cursor-pointer w-32'}
              >
                {reviewStages.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Include Subsidiary */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-steel-500 whitespace-nowrap">是否包含子公司</label>
              <select
                value={includeSubsidiary}
                onChange={(e) => setIncludeSubsidiary(e.target.value)}
                className={inputCls + ' cursor-pointer w-28'}
              >
                <option value="">请选择...</option>
                <option value="yes">是</option>
                <option value="no">否</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-refresh-line" />
                </div>
                重置
              </button>
              <button
                onClick={handleQuery}
                className="flex items-center gap-1 px-4 py-1.5 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg,#1e3a5f,#2d5a8e)' }}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line" />
                </div>
                查询
              </button>
            </div>
          </div>
        </div>

        {/* Summary + Export */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs text-steel-400 font-medium">单位：（万元）</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-steel-500">总投资</span>
              <span className="text-sm font-bold text-steel-900">{totalInvestment.toLocaleString()}</span>
            </div>
            <div className="w-px h-4 bg-steel-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-steel-500">总设备费</span>
              <span className="text-sm font-bold text-sky-700">{totalEquipmentFee.toLocaleString()}</span>
              <span className="text-xs text-steel-400">（占比{equipPct}%）</span>
            </div>
            <div className="w-px h-4 bg-steel-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-steel-500">总建安费</span>
              <span className="text-sm font-bold text-teal-700">{totalConstructionFee.toLocaleString()}</span>
              <span className="text-xs text-steel-400">（占比{consPct}%）</span>
            </div>
            <div className="w-px h-4 bg-steel-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-steel-500">总其他费</span>
              <span className="text-sm font-bold text-amber-700">{totalOtherFee.toLocaleString()}</span>
              <span className="text-xs text-steel-400">（占比{otherPct}%）</span>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#047857,#059669)' }}>
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-file-excel-2-line" />
            </div>
            导出报表
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse" style={{ minWidth: '1400px' }}>
              <thead>
                {/* Row 1: Category headers */}
                <tr>
                  <th
                    rowSpan={2}
                    className="border border-steel-300 px-2 py-2 text-center font-semibold text-steel-700 whitespace-nowrap sticky left-0 z-10"
                    style={{ backgroundColor: '#f0f4f8', minWidth: '64px' }}
                  >
                    单位
                  </th>
                  {PROJECT_TYPES.map((pt, idx) => (
                    <th
                      key={pt.key}
                      colSpan={3}
                      className="border border-steel-300 px-2 py-2 text-center font-semibold text-steel-700 whitespace-nowrap"
                      style={{
                        backgroundColor: COL_HEADER_COLORS[idx].bg,
                        borderColor: COL_HEADER_COLORS[idx].border,
                      }}
                    >
                      {pt.label}
                    </th>
                  ))}
                </tr>
                {/* Row 2: Sub-column headers */}
                <tr>
                  {PROJECT_TYPES.map((pt, idx) => (
                    <>
                      <th
                        key={`${pt.key}-da`}
                        className="border border-steel-300 px-2 py-1.5 text-center font-medium text-steel-600 whitespace-nowrap"
                        style={{ backgroundColor: COL_HEADER_COLORS[idx].bg }}
                      >
                        申报金额
                      </th>
                      <th
                        key={`${pt.key}-b`}
                        className="border border-steel-300 px-2 py-1.5 text-center font-medium text-steel-600 whitespace-nowrap"
                        style={{ backgroundColor: COL_HEADER_COLORS[idx].bg }}
                      >
                        效益
                      </th>
                      <th
                        key={`${pt.key}-c`}
                        className="border border-steel-300 px-2 py-1.5 text-center font-medium text-steel-600 whitespace-nowrap"
                        style={{ backgroundColor: COL_HEADER_COLORS[idx].bg }}
                      >
                        项数
                      </th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, rowIdx) => (
                  <tr key={row.unitName} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td
                      className="border border-steel-200 px-2 py-1.5 text-center font-medium text-steel-700 whitespace-nowrap sticky left-0 z-10"
                      style={{ backgroundColor: rowIdx % 2 === 0 ? 'white' : '#f8fafc' }}
                    >
                      {row.unitName}
                    </td>
                    {PROJECT_TYPES.map((pt, idx) => {
                      const d = row[pt.key] as ProjectTypeData;
                      const isTotal = pt.key === 'total';
                      const cellBg = isTotal
                        ? rowIdx % 2 === 0 ? '#fff1f2' : '#fce7f3'
                        : undefined;
                      return (
                        <>
                          <td
                            key={`${row.unitName}-${pt.key}-da`}
                            className={`border border-steel-200 px-2 py-1.5 text-right whitespace-nowrap ${isTotal ? 'font-semibold text-rose-700' : 'text-steel-700'}`}
                            style={{ backgroundColor: cellBg }}
                          >
                            {d.declareAmount === 0 ? (
                              <span className="text-steel-300">0.00</span>
                            ) : (
                              fmt(d.declareAmount)
                            )}
                          </td>
                          <td
                            key={`${row.unitName}-${pt.key}-b`}
                            className={`border border-steel-200 px-2 py-1.5 text-right whitespace-nowrap ${isTotal ? 'font-semibold text-rose-700' : 'text-steel-700'}`}
                            style={{ backgroundColor: cellBg }}
                          >
                            {d.benefit === 0 ? (
                              <span className="text-steel-300">0.00</span>
                            ) : (
                              fmt(d.benefit)
                            )}
                          </td>
                          <td
                            key={`${row.unitName}-${pt.key}-c`}
                            className={`border border-steel-200 px-2 py-1.5 text-center whitespace-nowrap ${isTotal ? 'font-semibold text-rose-700' : d.count === 0 ? 'text-steel-300' : 'text-sky-600 font-medium'}`}
                            style={{ backgroundColor: cellBg }}
                          >
                            {fmtInt(d.count)}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                ))}
                {/* Total Row */}
                {displayRows.length > 0 && (
                  <tr style={{ backgroundColor: '#f0f9ff' }}>
                    <td
                      className="border border-steel-300 px-2 py-1.5 text-center font-bold text-steel-900 whitespace-nowrap sticky left-0 z-10"
                      style={{ backgroundColor: '#e0f2fe' }}
                    >
                      合计
                    </td>
                    {PROJECT_TYPES.map((pt) => {
                      const d = totalRow[pt.key] as ProjectTypeData;
                      const isTotal = pt.key === 'total';
                      return (
                        <>
                          <td
                            key={`total-${pt.key}-da`}
                            className={`border border-steel-300 px-2 py-1.5 text-right font-bold whitespace-nowrap ${isTotal ? 'text-rose-700' : 'text-steel-800'}`}
                            style={{ backgroundColor: isTotal ? '#fce7f3' : '#f0f9ff' }}
                          >
                            {fmt(d.declareAmount)}
                          </td>
                          <td
                            key={`total-${pt.key}-b`}
                            className={`border border-steel-300 px-2 py-1.5 text-right font-bold whitespace-nowrap ${isTotal ? 'text-rose-700' : 'text-steel-800'}`}
                            style={{ backgroundColor: isTotal ? '#fce7f3' : '#f0f9ff' }}
                          >
                            {fmt(d.benefit)}
                          </td>
                          <td
                            key={`total-${pt.key}-c`}
                            className={`border border-steel-300 px-2 py-1.5 text-center font-bold whitespace-nowrap ${isTotal ? 'text-rose-700' : 'text-sky-700'}`}
                            style={{ backgroundColor: isTotal ? '#fce7f3' : '#f0f9ff' }}
                          >
                            {fmtInt(d.count)}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                )}
                {displayRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={1 + PROJECT_TYPES.length * 3}
                      className="border border-steel-200 py-12 text-center text-steel-400 text-sm"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                          <i className="ri-inbox-2-line text-3xl text-steel-300" />
                        </div>
                        暂无数据，请点击查询按钮加载报表
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats footer */}
        {displayRows.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-steel-400 px-1">
            <span>共 <span className="font-medium text-steel-600">{displayRows.length}</span> 个单位</span>
            <span>总项目数 <span className="font-medium text-sky-600">{totalRow.total.count}</span> 项</span>
            <span>总申报金额 <span className="font-medium text-steel-700">{fmt(totalRow.total.declareAmount)}</span> 万元</span>
            <span>总效益 <span className="font-medium text-teal-700">{fmt(totalRow.total.benefit)}</span> 万元</span>
          </div>
        )}
      </div>
    </Layout>
  );
}
