import { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { PlanArchiveRecord } from '@/mocks/planArchiveMocks';
import { MAJOR_CHART_COLORS, PLAN_ARCHIVE_CURRENT_YEAR } from '@/mocks/planArchiveMocks';

interface Props {
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
  const totalCount = records.length;
  const yearCount = records.filter((r) => r.planYear === PLAN_ARCHIVE_CURRENT_YEAR).length;
  const totalBudget = records.reduce((s, r) => s + r.budget, 0);
  const totalBenefit = records.reduce((s, r) => s + r.benefit, 0);
  const executing = records.filter((r) => r.execStatus === '执行中').length;

  const majorDist = useMemo(() => {
    const map = new Map<string, { count: number; budget: number }>();
    records.forEach((r) => {
      const cur = map.get(r.projectMajorCategory) || { count: 0, budget: 0 };
      cur.count += 1;
      cur.budget += r.budget;
      map.set(r.projectMajorCategory, cur);
    });
    return ['新建', '技改', '零固', '大修']
      .filter((k) => map.has(k))
      .map((name) => ({
        name,
        value: map.get(name)!.count,
        budget: Number(map.get(name)!.budget.toFixed(2)),
        fill: MAJOR_CHART_COLORS[name] || '#64748b',
      }));
  }, [records]);

  const unitTop = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => map.set(r.businessUnit, (map.get(r.businessUnit) || 0) + r.budget));
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([unit, budget]) => ({
        unit: unit.replace('事业部', '').replace('部', ''),
        full: unit,
        budget: Number(budget.toFixed(1)),
      }))
      .reverse();
  }, [records]);

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-4 gap-2.5">
        <KpiCard
          icon="ri-folder-3-line text-sky-600"
          accent="bg-sky-50"
          label="年度计划总数"
          value={`${totalCount}`}
          sub="已通过归档计划"
        />
        <KpiCard
          icon="ri-calendar-check-line text-emerald-600"
          accent="bg-emerald-50"
          label="本年计划数"
          value={`${yearCount}`}
          sub={`占总数 ${totalCount ? ((yearCount / totalCount) * 100).toFixed(0) : 0}%`}
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
          sub={`执行中 ${executing} 项`}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white rounded-lg border border-steel-200 px-3 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-steel-800">项目大类分布</h3>
            <span className="text-[11px] text-steel-400">按计划项数</span>
          </div>
          {majorDist.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-sm text-steel-400">暂无数据</div>
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={majorDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="46%"
                    innerRadius={40}
                    outerRadius={62}
                    paddingAngle={2}
                  >
                    {majorDist.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const v = typeof value === 'number' ? value : Number(value) || 0;
                      const budget = (item?.payload as { budget?: number })?.budget ?? 0;
                      return [`${v} 项 · ${budget.toFixed(0)} 万元`, '计划'];
                    }}
                  />
                  <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-3 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-steel-800">项目单位投资 TOP</h3>
            <span className="text-[11px] text-steel-400">万元</span>
          </div>
          {unitTop.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-sm text-steel-400">暂无数据</div>
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitTop} layout="vertical" margin={{ top: 2, right: 12, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8edf3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="unit" width={52} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [`${value} 万元`, '投资估算']}
                    labelFormatter={(_, payload) => (payload?.[0]?.payload as { full?: string })?.full || ''}
                  />
                  <Bar dataKey="budget" name="投资估算" fill="#059669" radius={[0, 6, 6, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
