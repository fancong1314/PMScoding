import { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';
import type { PlanArchiveRecord } from '@/mocks/planArchiveMocks';
import { MAJOR_CHART_COLORS, PLAN_ARCHIVE_CURRENT_YEAR } from '@/mocks/planArchiveMocks';

interface Props {
  /** 统计数据源（含已通过 + 已驳回） */
  records: PlanArchiveRecord[];
}

function KpiCard({
  icon, label, value, sub, accent,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-steel-200 px-3 py-2.5 flex items-center gap-2.5 min-w-0">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
        <i className={`${icon} text-base`} />
      </div>
      <div className="min-w-0 leading-tight">
        <p className="text-[11px] text-steel-400">{label}</p>
        <p className="text-lg font-semibold text-steel-900 tabular-nums truncate">{value}</p>
        {sub && <p className="text-[10px] text-steel-400 truncate">{sub}</p>}
      </div>
    </div>
  );
}

export default function ArchiveSummaryCharts({ records }: Props) {
  const declared = records.length;
  const rejected = records.filter((r) => r.reviewOutcome === 'rejected').length;
  const approved = records.filter((r) => r.reviewOutcome === 'approved').length;
  const totalBudget = records.reduce((s, r) => s + r.budget, 0);
  const totalBenefit = records.reduce((s, r) => s + r.benefit, 0);

  const yearRecords = records.filter((r) => r.planYear === PLAN_ARCHIVE_CURRENT_YEAR);
  const yearDeclared = yearRecords.length;
  const yearRejected = yearRecords.filter((r) => r.reviewOutcome === 'rejected').length;
  const yearApproved = yearRecords.filter((r) => r.reviewOutcome === 'approved').length;
  const yearBudget = yearRecords.reduce((s, r) => s + r.budget, 0);
  const yearBenefit = yearRecords.reduce((s, r) => s + r.benefit, 0);

  const majorDist = useMemo(() => {
    const map = new Map<string, { count: number; budget: number }>();
    records.forEach((r) => {
      const cur = map.get(r.projectMajorCategory) || { count: 0, budget: 0 };
      cur.count += 1;
      cur.budget += r.budget;
      map.set(r.projectMajorCategory, cur);
    });
    return ['新建', '技改', '零固', '营缮']
      .filter((k) => map.has(k))
      .map((name) => ({
        name,
        value: map.get(name)!.count,
        budget: Number(map.get(name)!.budget.toFixed(0)),
        fill: MAJOR_CHART_COLORS[name] || '#64748b',
      }));
  }, [records]);

  const deptStats = useMemo(() => {
    const map = new Map<string, { count: number; budget: number }>();
    records.forEach((r) => {
      const cur = map.get(r.businessUnit) || { count: 0, budget: 0 };
      cur.count += 1;
      cur.budget += r.budget;
      map.set(r.businessUnit, cur);
    });
    return [...map.entries()]
      .map(([dept, v]) => ({
        dept: dept.replace('事业部', '').replace('部', ''),
        full: dept,
        budget: Number(v.budget.toFixed(0)),
        count: v.count,
      }))
      .sort((a, b) => b.budget - a.budget);
  }, [records]);

  const renderMajorLabel = (props: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    outerRadius?: number;
    name?: string;
    value?: number;
    payload?: { budget?: number };
  }) => {
    const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, name = '', value = 0, payload } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 18;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const budget = payload?.budget ?? 0;
    return (
      <text
        x={x}
        y={y}
        fill="#334155"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={11}
      >
        {`${name} ${value}项/${budget}万`}
      </text>
    );
  };

  return (
    <div className="space-y-2.5">
      {/* 第一行：总体 */}
      <div className="grid grid-cols-5 gap-2.5">
        <KpiCard
          icon="ri-file-list-3-line text-sky-600"
          accent="bg-sky-50"
          label="申报总数"
          value={`${declared}`}
          sub="全部申报计划"
        />
        <KpiCard
          icon="ri-close-circle-line text-red-500"
          accent="bg-red-50"
          label="已驳回数量"
          value={`${rejected}`}
          sub={declared ? `占申报 ${((rejected / declared) * 100).toFixed(0)}%` : undefined}
        />
        <KpiCard
          icon="ri-checkbox-circle-line text-emerald-600"
          accent="bg-emerald-50"
          label="已通过数量"
          value={`${approved}`}
          sub={declared ? `占申报 ${((approved / declared) * 100).toFixed(0)}%` : undefined}
        />
        <KpiCard
          icon="ri-funds-line text-violet-600"
          accent="bg-violet-50"
          label="投资总估算合计"
          value={`${totalBudget.toFixed(0)}`}
          sub="单位：万元"
        />
        <KpiCard
          icon="ri-line-chart-line text-amber-600"
          accent="bg-amber-50"
          label="预计效益合计"
          value={`${totalBenefit.toFixed(0)}`}
          sub="单位：万元"
        />
      </div>

      {/* 第二行：本年 */}
      <div className="grid grid-cols-5 gap-2.5">
        <KpiCard
          icon="ri-calendar-check-line text-sky-600"
          accent="bg-sky-50"
          label="本年申报总数"
          value={`${yearDeclared}`}
          sub={`${PLAN_ARCHIVE_CURRENT_YEAR}年`}
        />
        <KpiCard
          icon="ri-close-circle-line text-red-500"
          accent="bg-red-50"
          label="本年已驳回"
          value={`${yearRejected}`}
          sub={yearDeclared ? `占本年 ${((yearRejected / yearDeclared) * 100).toFixed(0)}%` : undefined}
        />
        <KpiCard
          icon="ri-checkbox-circle-line text-emerald-600"
          accent="bg-emerald-50"
          label="本年已通过数"
          value={`${yearApproved}`}
          sub={yearDeclared ? `占本年 ${((yearApproved / yearDeclared) * 100).toFixed(0)}%` : undefined}
        />
        <KpiCard
          icon="ri-funds-line text-violet-600"
          accent="bg-violet-50"
          label="本年投资总估算"
          value={`${yearBudget.toFixed(0)}`}
          sub="单位：万元"
        />
        <KpiCard
          icon="ri-line-chart-line text-amber-600"
          accent="bg-amber-50"
          label="本年预计效益"
          value={`${yearBenefit.toFixed(0)}`}
          sub="单位：万元"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white rounded-lg border border-steel-200 px-3 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-steel-800">项目大类分布</h3>
            <span className="text-[11px] text-steel-400">项数 / 投资(万元)</span>
          </div>
          {majorDist.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-steel-400">暂无数据</div>
          ) : (
            <div className="h-52 flex gap-2">
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={majorDist}
                      dataKey="value"
                      nameKey="name"
                      cx="42%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={58}
                      paddingAngle={2}
                      label={renderMajorLabel}
                      labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                    >
                      {majorDist.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={22} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-36 flex-shrink-0 flex flex-col justify-center gap-1.5 pr-1">
                {majorDist.map((d) => (
                  <div key={d.name} className="rounded-md border border-steel-100 bg-slate-50/80 px-2 py-1.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                      <span className="text-xs font-medium text-steel-700">{d.name}</span>
                    </div>
                    <p className="text-[11px] text-steel-600 pl-3.5 tabular-nums">
                      {d.value} 项 · {d.budget} 万
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-3 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-steel-800">项目提报部门统计</h3>
            <span className="text-[11px] text-steel-400">投资(万) / 总数</span>
          </div>
          {deptStats.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-steel-400">暂无数据</div>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deptStats}
                  margin={{ top: 18, right: 8, left: 0, bottom: 28 }}
                  barCategoryGap="18%"
                  barGap={2}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8edf3" vertical={false} />
                  <XAxis
                    dataKey="dept"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={40}
                  />
                  <YAxis
                    yAxisId="budget"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <YAxis
                    yAxisId="count"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                    allowDecimals={false}
                  />
                  <Bar yAxisId="budget" dataKey="budget" name="投资总额" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={18}>
                    <LabelList
                      dataKey="budget"
                      position="top"
                      fontSize={9}
                      fill="#047857"
                      formatter={(v: number) => `${v}`}
                    />
                  </Bar>
                  <Bar yAxisId="count" dataKey="count" name="计划总数" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={18}>
                    <LabelList
                      dataKey="count"
                      position="top"
                      fontSize={9}
                      fill="#1d4ed8"
                      formatter={(v: number) => `${v}`}
                    />
                  </Bar>
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={18}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
