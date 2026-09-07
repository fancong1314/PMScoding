import { useState, useMemo } from 'react';
import Layout from '@/components/feature/Layout';
import {
  mockKpiStats,
  mockArgumentStats,
  mockMonthlyTrend,
  mockPostEvalStats,
  mockDeptComparison,
  mockAnomalies,
  mockScoreRanks,
  mockRefreshTime,
  type MonthlyTrend,
} from '@/mocks/argumentEvalDashboardMocks';

function RingProgress({ rate, size = 72, strokeWidth = 6 }: { rate: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (rate / 100) * circumference;
  const getColor = () => {
    if (rate >= 90) return '#22c55e';
    if (rate >= 70) return '#eab308';
    return '#ef4444';
  };
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={getColor()} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${getColor()}66)`, transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span className="absolute text-base font-bold text-white">{rate}%</span>
    </div>
  );
}

function TrendChart({ data }: { data: MonthlyTrend[] }) {
  if (data.length < 2) return null;
  const w = 280; const h = 110; const pad = { top: 10, right: 10, bottom: 18, left: 4 };
  const innerW = w - pad.left - pad.right; const innerH = h - pad.top - pad.bottom;
  const maxVal = Math.max(...data.flatMap((d) => [d.applied, d.completed]));
  const yScale = (v: number) => pad.top + innerH - (v / maxVal) * innerH;
  const xScale = (i: number) => pad.left + (i / (data.length - 1)) * innerW;
  const appliedPoints = data.map((d, i) => `${xScale(i)},${yScale(d.applied)}`).join(' ');
  const completedPoints = data.map((d, i) => `${xScale(i)},${yScale(d.completed)}`).join(' ');
  const areaBottom = pad.top + innerH;
  const appliedArea = `M${xScale(0)},${areaBottom} L${appliedPoints.replace(/,/g, ' L')} L${xScale(data.length - 1)},${areaBottom} Z`;
  const completedArea = `M${xScale(0)},${areaBottom} L${completedPoints.replace(/,/g, ' L')} L${xScale(data.length - 1)},${areaBottom} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="gradApplied2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="gradCompleted2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={appliedArea} fill="url(#gradApplied2)" />
      <path d={completedArea} fill="url(#gradCompleted2)" />
      <polyline points={appliedPoints} fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px #38bdf8)' }} />
      <polyline points={completedPoints} fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px #22c55e)' }} />
      {data.map((d, i) => (
        <text key={`lbl-${i}`} x={xScale(i)} y={h - 3} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
          {d.month.slice(5)}
        </text>
      ))}
    </svg>
  );
}

function VBar({ height, color, label, value }: { height: number; color: string; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] text-slate-400 font-mono">{value}</span>
      <div className="w-6 rounded-t-sm transition-all duration-700" style={{ height: `${height}px`, backgroundColor: color, boxShadow: `0 0 6px ${color}44` }} />
      <span className="text-[10px] text-slate-500 whitespace-nowrap">{label}</span>
    </div>
  );
}

function getGradeColor(grade: string) {
  if (grade === '优秀') return '#22c55e';
  if (grade === '良好') return '#38bdf8';
  if (grade === '一般') return '#eab308';
  return '#ef4444';
}

function getRankBadge(rank: number) {
  if (rank === 1) return { bg: '#fbbf24', text: '#78350f', icon: 'ri-medal-line' };
  if (rank === 2) return { bg: '#94a3b8', text: '#334155', icon: 'ri-medal-line' };
  if (rank === 3) return { bg: '#d97706', text: '#78350f', icon: 'ri-medal-line' };
  return { bg: 'rgba(255,255,255,0.08)', text: '#94a3b8', icon: '' };
}

function DashboardContent() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-12-31');

  const kpi = mockKpiStats;
  const argStats = mockArgumentStats;
  const postStats = mockPostEvalStats;
  const depts = mockDeptComparison;
  const maxDeptApp = Math.max(...depts.map((d) => d.applied), 1);
  const anomalies = mockAnomalies;
  const scores = mockScoreRanks;

  const gradeDistribution = useMemo(() => {
    const groups: Record<string, number> = { '优秀': 0, '良好': 0, '一般': 0, '不合格': 0 };
    scores.forEach((s) => { groups[s.grade] = (groups[s.grade] || 0) + 1; });
    return groups;
  }, [scores]);
  const maxGradeCount = Math.max(...Object.values(gradeDistribution), 1);

  const postDistData = [
    { label: '已完成', value: postStats.completedCount, color: '#22c55e' },
    { label: '未按时', value: postStats.overdueCount, color: '#ef4444' },
    { label: '延期', value: postStats.delayedCount, color: '#eab308' },
    { label: '不合格', value: postStats.failedCount, color: '#dc2626' },
  ];
  const maxPostVal = Math.max(...postDistData.map((d) => d.value), 1);

  const statCards = [
    {
      icon: 'ri-file-list-3-line',
      iconBg: 'rgba(56,189,248,0.12)',
      iconColor: '#38bdf8',
      title: '论证申请',
      mainLabel: '发起数量',
      mainVal: argStats.appliedCount,
      subLabel: '完成数量',
      subVal: argStats.completedCount,
      accentColor: '#38bdf8',
    },
    {
      icon: 'ri-check-double-line',
      iconBg: 'rgba(234,179,8,0.12)',
      iconColor: '#eab308',
      title: '审核统计',
      mainLabel: '已审核',
      mainVal: argStats.reviewedCount,
      subLabel: '未审核',
      subVal: argStats.unreviewedCount,
      accentColor: '#eab308',
    },
    {
      icon: 'ri-pen-nib-line',
      iconBg: 'rgba(34,197,94,0.12)',
      iconColor: '#22c55e',
      title: '意见签署',
      mainLabel: '已签署',
      mainVal: argStats.signedCount,
      subLabel: '未签署',
      subVal: argStats.unsignedCount,
      accentColor: '#22c55e',
    },
  ];

  return (
    <div className="h-full" style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #111827 40%, #0f1729 100%)' }}>
      <div className="px-5 py-4 h-full flex flex-col" style={{ minHeight: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">论证后评价看板</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">论证流程及项目后评价关键指标可视化监控</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-7 px-2 text-[11px] rounded-md outline-none text-slate-200" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <span className="text-[11px] text-slate-500">~</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-7 px-2 text-[11px] rounded-md outline-none text-slate-200" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div className="text-[11px] text-slate-500 font-mono whitespace-nowrap flex items-center gap-1">
              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-refresh-line text-cyan-400 text-xs" /></div>
              数据更新于 {mockRefreshTime}
            </div>
          </div>
        </div>

        {/* Content wrapper - flex-1 with overflow */}
        <div className="flex-1 flex flex-col gap-3" style={{ minHeight: 0, overflow: 'auto' }}>

          {/* KPI Cards */}
          <div className="grid grid-cols-6 gap-3 flex-shrink-0">
            {/* Card 1: 论证完成率 - expanded with planned/unplanned */}
            <div className="col-span-3 rounded-lg p-4" style={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(56,189,248,0.12)' }}>
              <div className="flex items-start gap-4">
                <RingProgress rate={kpi.argumentCompletionRate} size={64} strokeWidth={6} />
                <div className="flex-1">
                  <p className="text-[11px] text-slate-400 mb-0.5">论证完成率</p>
                  <p className="text-base font-bold text-white">
                    <span className="text-cyan-400">{kpi.argumentCompleted}</span>
                    <span className="text-slate-500 mx-1 text-xs">/</span>
                    <span className="text-slate-400 text-xs">{kpi.argumentTotal}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-0.5">
                    <div className="w-3 h-3 flex items-center justify-center"><i className="ri-survey-line text-slate-500" /></div>
                    累计论证项目
                  </p>
                </div>
                {/* Planned / Unplanned breakdown */}
                <div className="flex gap-4">
                  <div className="text-center px-2">
                    <p className="text-[10px] text-cyan-400 font-medium mb-1">计划内</p>
                    <div className="space-y-0.5 text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="text-green-400 font-bold">{kpi.argumentPlannedCompleted}</span><span className="text-slate-500">已完成</span></div>
                      <div className="flex items-center gap-1.5"><span className="text-amber-400 font-bold">{kpi.argumentPlannedInProgress}</span><span className="text-slate-500">论证中</span></div>
                      <div className="flex items-center gap-1.5"><span className="text-slate-400 font-bold">{kpi.argumentPlannedNotStarted}</span><span className="text-slate-500">未发起</span></div>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-white/5 space-y-0.5 text-[10px]">
                      <div className="flex items-center gap-1"><span className="text-green-400 text-[9px]">¥{(kpi.argumentPlannedInvestCompleted / 10000).toFixed(0)}万</span></div>
                      <div className="flex items-center gap-1"><span className="text-amber-400 text-[9px]">¥{(kpi.argumentPlannedInvestInProgress / 10000).toFixed(0)}万</span></div>
                      <div className="flex items-center gap-1"><span className="text-slate-400 text-[9px]">¥{(kpi.argumentPlannedInvestNotStarted / 10000).toFixed(0)}万</span></div>
                    </div>
                  </div>
                  <div className="w-px bg-white/5" />
                  <div className="text-center px-2">
                    <p className="text-[10px] text-yellow-400 font-medium mb-1">计划外</p>
                    <div className="space-y-0.5 text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="text-green-400 font-bold">{kpi.argumentUnplannedCompleted}</span><span className="text-slate-500">已完成</span></div>
                      <div className="flex items-center gap-1.5"><span className="text-amber-400 font-bold">{kpi.argumentUnplannedInProgress}</span><span className="text-slate-500">论证中</span></div>
                      <div className="flex items-center gap-1.5"><span className="text-slate-400 font-bold">{kpi.argumentUnplannedNotStarted}</span><span className="text-slate-500">未发起</span></div>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-white/5 space-y-0.5 text-[10px]">
                      <div className="flex items-center gap-1"><span className="text-green-400 text-[9px]">¥{(kpi.argumentUnplannedInvestCompleted / 10000).toFixed(0)}万</span></div>
                      <div className="flex items-center gap-1"><span className="text-amber-400 text-[9px]">¥{(kpi.argumentUnplannedInvestInProgress / 10000).toFixed(0)}万</span></div>
                      <div className="flex items-center gap-1"><span className="text-slate-400 text-[9px]">¥{(kpi.argumentUnplannedInvestNotStarted / 10000).toFixed(0)}万</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: 后评价完成率 - shrunk */}
            <div className="rounded-lg p-2.5 flex items-center gap-2" style={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(34,197,94,0.12)' }}>
              <RingProgress rate={kpi.postEvalCompletionRate} size={48} strokeWidth={5} />
              <div>
                <p className="text-[10px] text-slate-400">后评价完成率</p>
                <p className="text-sm font-bold text-white">
                  <span className="text-green-400">{kpi.postEvalCompleted}</span>
                  <span className="text-slate-500 mx-0.5 text-[10px]">/</span>
                  <span className="text-slate-400 text-[10px]">{kpi.postEvalTotal}</span>
                </p>
              </div>
            </div>

            {/* Card 3: 论证平均处理时长 - shrunk */}
            <div className="rounded-lg p-2.5 flex flex-col justify-center" style={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(234,179,8,0.12)' }}>
              <p className="text-[10px] text-slate-400">论证平均处理时长</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-amber-400">{kpi.avgProcessingDays}</span>
                <span className="text-[10px] text-slate-400">天</span>
              </div>
              <span className="text-[10px] text-green-400 font-mono mt-0.5">↓ {(kpi.prevAvgProcessingDays - kpi.avgProcessingDays).toFixed(1)} 缩短</span>
            </div>

            {/* Card 4: 后评价平均分值 - shrunk */}
            <div className="rounded-lg p-2.5 flex flex-col justify-center" style={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(56,189,248,0.12)' }}>
              <p className="text-[10px] text-slate-400">后评价平均分值</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-cyan-400">{kpi.avgEvalScore}</span>
                <span className="text-[10px] text-slate-400">分</span>
              </div>
              <span className="text-[10px] text-green-400 mt-0.5">良好</span>
            </div>
          </div>

          {/* Row 1: Argument Stats + Post-eval Stats */}
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            {/* Argument Stats */}
            <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 rounded-full bg-cyan-400" />
                  <h3 className="text-xs font-semibold text-white">论证数量统计</h3>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 grid grid-cols-3 gap-2.5">
                  {statCards.map((sc) => (
                    <div key={sc.title} className="rounded-lg p-3 flex flex-col gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: sc.iconBg }}>
                          <i className={`${sc.icon} text-sm`} style={{ color: sc.iconColor }} />
                        </div>
                        <span className="text-[11px] text-slate-300 font-medium">{sc.title}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500">{sc.mainLabel}</span>
                          <span className="text-xl font-bold" style={{ color: sc.accentColor }}>{sc.mainVal}</span>
                        </div>
                        <div className="h-8 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-slate-500">{sc.subLabel}</span>
                          <span className="text-lg font-bold text-slate-300">{sc.subVal}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-shrink-0 flex flex-col items-center self-center">
                  <TrendChart data={mockMonthlyTrend} />
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-0.5 rounded" style={{ backgroundColor: '#38bdf8' }} />
                      <span className="text-[10px] text-slate-500">发起数</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-0.5 rounded" style={{ backgroundColor: '#22c55e' }} />
                      <span className="text-[10px] text-slate-500">完成数</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Post-eval Stats */}
            <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3.5 rounded-full bg-green-400" />
                <h3 className="text-xs font-semibold text-white">项目后评价统计</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {[
                    { label: '达到后评价', val: postStats.reachedCount, color: '#38bdf8' },
                    { label: '已完成评价', val: postStats.completedCount, color: '#22c55e' },
                    { label: '未按时评价', val: postStats.overdueCount, color: '#ef4444' },
                    { label: '延期评价', val: postStats.delayedCount, color: '#eab308' },
                    { label: '抽查数量', val: postStats.spotCheckCount, color: '#a78bfa' },
                    { label: '不合格数量', val: postStats.failedCount, color: '#dc2626' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg text-center py-2.5 px-1" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-xl font-bold" style={{ color: item.color }}>{item.val}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex-shrink-0 flex items-end gap-2.5" style={{ height: 100 }}>
                  {postDistData.map((d) => (
                    <VBar key={d.label} height={(d.value / maxPostVal) * 80} color={d.color} label={d.label} value={d.value} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Department Comparison + Anomalies */}
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3.5 rounded-full bg-amber-400" />
                <h3 className="text-xs font-semibold text-white">部门论证对比</h3>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  {[...depts].sort((a, b) => a.completionRate - b.completionRate).map((d) => (
                    <div key={d.name} className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] text-slate-300 w-20 truncate whitespace-nowrap">{d.name}</span>
                      <div className="flex-1 flex gap-0.5 h-4 items-end">
                        <div className="h-3.5 rounded-l-sm transition-all duration-700" style={{ width: `${(d.completed / maxDeptApp) * 100}%`, backgroundColor: '#22c55e', opacity: 0.8, boxShadow: '0 0 4px rgba(34,197,94,0.3)' }} />
                        <div className="h-2.5 rounded-r-sm transition-all duration-700" style={{ width: `${((d.applied - d.completed) / maxDeptApp) * 100}%`, backgroundColor: 'rgba(255,255,255,0.08)' }} />
                      </div>
                      <span className="text-[11px] font-mono w-11 text-right" style={{ color: d.completionRate >= 85 ? '#22c55e' : d.completionRate >= 75 ? '#eab308' : '#ef4444' }}>{d.completionRate}%</span>
                    </div>
                  ))}
                </div>
                <div className="w-px flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                <div className="w-36 flex-shrink-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#22c55e', opacity: 0.8 }} />
                    <span className="text-[10px] text-slate-500">完成</span>
                    <span className="w-2.5 h-2.5 rounded-sm ml-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
                    <span className="text-[10px] text-slate-500">未完成</span>
                  </div>
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="text-slate-500" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <th className="text-left py-1 font-medium">部门</th>
                        <th className="text-right py-1 font-medium">完成率</th>
                        <th className="text-right py-1 font-medium">均时</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...depts].sort((a, b) => a.completionRate - b.completionRate).map((d) => (
                        <tr key={d.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="py-0.5 text-slate-300 truncate max-w-[70px]">{d.name}</td>
                          <td className="py-0.5 text-right font-mono" style={{ color: d.completionRate >= 85 ? '#22c55e' : d.completionRate >= 75 ? '#eab308' : '#ef4444' }}>{d.completionRate}%</td>
                          <td className="py-0.5 text-right font-mono text-slate-400">{d.avgDays}d</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 rounded-full bg-red-400" />
                  <h3 className="text-xs font-semibold text-white">论证会审异常</h3>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-red-400" style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}>
                  {anomalies.filter((a) => a.overdueDays > 0).length} 条异常
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-slate-500" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th className="text-left py-1.5 font-medium whitespace-nowrap">论证名称</th>
                      <th className="text-left py-1.5 font-medium whitespace-nowrap">申报单位</th>
                      <th className="text-left py-1.5 font-medium whitespace-nowrap">预警类型</th>
                      <th className="text-right py-1.5 font-medium whitespace-nowrap">超期</th>
                      <th className="text-right py-1.5 font-medium whitespace-nowrap">等级</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...anomalies].sort((a, b) => {
                      if (a.severity === '严重' && b.severity !== '严重') return -1;
                      if (a.severity !== '严重' && b.severity === '严重') return 1;
                      return b.overdueDays - a.overdueDays;
                    }).map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td className="py-1.5 text-slate-300 whitespace-nowrap text-[11px]">{a.argName}</td>
                        <td className="py-1.5 text-slate-400 whitespace-nowrap text-[11px]">{a.applicantUnit}</td>
                        <td className="py-1.5 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: a.warnType === '会审超期' ? 'rgba(239,68,68,0.12)' : a.warnType === '资料不全' ? 'rgba(234,179,8,0.12)' : 'rgba(56,189,248,0.1)', color: a.warnType === '会审超期' ? '#fca5a5' : a.warnType === '资料不全' ? '#fde68a' : '#7dd3fc' }}>{a.warnType}</span>
                        </td>
                        <td className="py-1.5 text-right font-mono whitespace-nowrap text-[11px]" style={{ color: a.overdueDays > 0 ? '#ef4444' : '#64748b', fontWeight: a.overdueDays > 0 ? 'bold' : 'normal' }}>
                          {a.overdueDays > 0 ? `${a.overdueDays}天` : '-'}
                        </td>
                        <td className="py-1.5 text-right whitespace-nowrap text-[11px]">
                          <span style={{ color: a.severity === '严重' ? '#ef4444' : '#eab308' }}>
                            {a.severity === '严重' ? '⚠️ 严重' : '🟡 一般'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 3: Score Ranking */}
          <div className="rounded-lg p-4 flex-shrink-0" style={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-3.5 rounded-full bg-purple-400" />
                  <h3 className="text-xs font-semibold text-white">后评价分值排名 TOP {Math.min(10, scores.length)}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="text-slate-500" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <th className="text-left py-1.5 font-medium w-10">排名</th>
                        <th className="text-left py-1.5 font-medium">项目名称</th>
                        <th className="text-left py-1.5 font-medium">填报单位</th>
                        <th className="text-right py-1.5 font-medium">分值</th>
                        <th className="text-right py-1.5 font-medium">等级</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.slice(0, 10).map((s) => {
                        const badge = getRankBadge(s.rank);
                        return (
                          <tr key={s.rank} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td className="py-1">
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold" style={{ backgroundColor: badge.bg, color: badge.text }}>
                                {badge.icon ? (
                                  <div className="w-3 h-3 flex items-center justify-center"><i className={badge.icon} /></div>
                                ) : s.rank}
                              </span>
                            </td>
                            <td className="py-1 text-slate-200 whitespace-nowrap">{s.projectName}</td>
                            <td className="py-1 text-slate-400 whitespace-nowrap">{s.unit}</td>
                            <td className="py-1 text-right font-mono text-sm font-bold text-white whitespace-nowrap">{s.score}</td>
                            <td className="py-1 text-right whitespace-nowrap">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${getGradeColor(s.grade)}20`, color: getGradeColor(s.grade) }}>{s.grade}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-px flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
              <div className="w-40 flex-shrink-0">
                <p className="text-[11px] text-slate-400 mb-2">分值分布</p>
                <div className="space-y-2.5">
                  {['优秀', '良好', '一般', '不合格'].map((grade) => {
                    const count = gradeDistribution[grade] || 0;
                    const barPct = maxGradeCount > 0 ? (count / maxGradeCount) * 100 : 0;
                    return (
                      <div key={grade}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px]" style={{ color: getGradeColor(grade) }}>{grade}</span>
                          <span className="text-[11px] font-mono text-slate-400">{count} 项</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${barPct}%`, backgroundColor: getGradeColor(grade), boxShadow: `0 0 6px ${getGradeColor(grade)}44` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500">总评价</span>
                    <span className="text-white font-bold">{scores.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500">平均分</span>
                    <span className="text-cyan-400 font-bold">{kpi.avgEvalScore}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">最高 / 最低</span>
                    <span className="text-white font-bold">{scores[0].score} / {scores[scores.length - 1].score}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ArgumentEvalDashboardPage() {
  const [isFullscreen, setIsFullscreen] = useState(true);

  if (!isFullscreen) {
    return (
      <Layout mainClassName="flex-1 p-0">
        <div className="relative">
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)' }}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-fullscreen-line text-cyan-400" /></div>
            全屏
          </button>
          <DashboardContent />
        </div>
      </Layout>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#0a0f1e' }}>
      {/* Fullscreen toggle bar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsFullscreen(false)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-fullscreen-exit-line text-cyan-400" /></div>
          退出全屏
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <DashboardContent />
      </div>
    </div>
  );
}