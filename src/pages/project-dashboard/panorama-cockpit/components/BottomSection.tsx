import { useState } from 'react';
import {
  mockFundChain,
  mockCostDeviationStacks,
  mockTopOverspend,
  mockCostCategoryPie,
  mockPostEvalTop5,
  mockPostEvalBottom5,
  mockScoreDistribution,
  mockRiskAnalysis,
  mockBottomAnomalyStats,
  mockEnterpriseCostManage,
} from '@/mocks/panoramaDashboardMocks';

/* ─── helpers ─── */
const PanelBox = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-lg flex flex-col overflow-hidden ${className}`}
    style={{
      background: 'rgba(8,18,38,0.85)',
      border: '1px solid rgba(0,212,255,0.12)',
      backdropFilter: 'blur(10px)',
    }}
  >
    {children}
  </div>
);

const SectHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1.5 flex-shrink-0">
    <div className="w-[3px] h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#00d4ff' }} />
    <h4 className="text-[11px] font-semibold" style={{ color: '#e8f0fe' }}>{title}</h4>
  </div>
);

function FundSegment({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-bold" style={{ color: '#00d4ff', fontFamily: 'monospace' }}>{value}</span>
      <span className="text-[9px] mt-0.5" style={{ color: '#64748b' }}>{label}</span>
    </div>
  );
}

function FundArrow({ rate }: { rate: number }) {
  const color = rate >= 80 ? '#00d68f' : rate >= 60 ? '#ffb800' : '#ff4757';
  return (
    <div className="flex flex-col items-center px-1">
      <div className="flex items-center gap-0.5">
        <div className="w-4 h-px" style={{ backgroundColor: color }} />
        <i className="ri-arrow-right-s-line text-xs" style={{ color }} />
      </div>
      <span className="text-[8px] font-mono whitespace-nowrap" style={{ color }}>{rate}%</span>
    </div>
  );
}

function RingProgressSmall({ rate }: { rate: number }) {
  const size = 44;
  const sw = 3;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (rate / 100) * circ;
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#00d4ff" strokeWidth={sw} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          style={{ filter: 'drop-shadow(0 0 3px rgba(0,212,255,0.5))' }} />
      </svg>
      <span className="absolute text-[9px] font-bold" style={{ color: '#00d4ff', fontFamily: 'monospace' }}>{rate}%</span>
    </div>
  );
}

function PieChart({ categories, size }: { categories: { name: string; color: string; pct: number }[]; size: number }) {
  const r = size / 2;
  const center = size / 2;
  let cumulativePercent = 0;
  const slices = categories.map((cat) => {
    const startPercent = cumulativePercent;
    cumulativePercent += cat.pct;
    const endPercent = cumulativePercent;
    const startAngle = (startPercent / 100) * 360 - 90;
    const endAngle = (endPercent / 100) * 360 - 90;
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    const x1 = center + r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = center + r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = center + r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = center + r * Math.sin((endAngle * Math.PI) / 180);
    return { d: `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: cat.color };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((slice, i) => <path key={i} d={slice.d} fill={slice.color} />)}
    </svg>
  );
}

/* ─── FundChainBar ─── */
function FundChainBar() {
  const fc = mockFundChain;
  return (
    <div
      className="rounded-lg flex items-center justify-between px-5 py-2 flex-shrink-0"
      style={{
        background: 'rgba(8,18,38,0.85)',
        border: '1px solid rgba(0,212,255,0.12)',
        backdropFilter: 'blur(10px)',
        height: 52,
      }}
    >
      <FundSegment label="计划金额" value={`${(fc.planAmount / 10000).toFixed(1)}亿`} />
      <FundArrow rate={fc.approveRate} />
      <FundSegment label="批复金额" value={`${(fc.approvedAmount / 10000).toFixed(1)}亿`} />
      <FundArrow rate={fc.contractConversionRate} />
      <FundSegment label="合同金额" value={`${(fc.contractAmount / 10000).toFixed(1)}亿`} />
      <FundArrow rate={fc.paymentRate} />
      <FundSegment label="已付金额" value={`${(fc.paidAmount / 10000).toFixed(1)}亿`} />
      <div className="h-6" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }} />
      <div className="flex items-center gap-2">
        <RingProgressSmall rate={fc.investCompletionRate} />
        <span className="text-[10px]" style={{ color: '#64748b' }}>投资完成率</span>
      </div>
    </div>
  );
}

/* ─── Panel 1: 成本预算执行监控 ─── */
function CostBudgetPanel() {
  const fc = mockFundChain;
  const maxCt = Math.max(...mockCostDeviationStacks.map(x => x.count));
  const maxOs = Math.max(...mockTopOverspend.map(x => x.amount));

  return (
    <PanelBox className="flex-1 min-w-0">
      <SectHeader title="项目成本预算及执行监控" />
      <div className="flex-1 flex flex-col px-2.5 pb-2 gap-1.5 min-h-0">
        {/* Row: ring + deviation */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex flex-col items-center">
            <RingProgressSmall rate={fc.investCompletionRate} />
            <p className="text-[8px] mt-0.5" style={{ color: '#475569' }}>整体预算执行率</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] mb-0.5" style={{ color: '#475569' }}>成本偏差项目分布</p>
            <div className="flex items-end h-8 gap-0.5">
              {mockCostDeviationStacks.map((s) => {
                const h = (s.count / maxCt) * 100;
                return (
                  <div key={s.label} className="flex-1 flex flex-col items-center gap-0.5">
                    <span className="text-[8px] font-mono" style={{ color: s.color }}>{s.count}</span>
                    <div className="w-full rounded-t-sm" style={{ height: `${h}%`, backgroundColor: s.color, minHeight: '3px' }} />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-1 text-[7px] mt-0.5" style={{ color: '#475569' }}>
              <span style={{ color: '#ff4757' }}>超支&gt;10%</span>
              <span style={{ color: '#ff8c32' }}>5-10%</span>
              <span style={{ color: '#00d68f' }}>±5%</span>
              <span style={{ color: '#00e5c8' }}>节约</span>
            </div>
          </div>
        </div>

        {/* Overspend TOP5 */}
        <div className="flex-1 min-h-0 flex flex-col">
          <p className="text-[8px] mb-1" style={{ color: '#475569' }}>项目超支金额TOP5</p>
          <div className="flex-1 flex flex-col justify-between">
            {mockTopOverspend.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold w-3 text-center flex-shrink-0" style={{ color: '#ff4757' }}>{idx + 1}</span>
                <span className="text-[9px] truncate w-20 flex-shrink-0" style={{ color: '#94a3b8' }}>{p.name}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(p.amount / maxOs) * 100}%`, backgroundColor: '#ff4757' }} />
                </div>
                <span className="text-[9px] font-mono flex-shrink-0" style={{ color: '#ff4757' }}>+{p.amount.toLocaleString()}万</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  );
}

/* ─── Panel 2: 成本分项监控 ─── */
function CostCategoryPanel() {
  const totalCost = mockCostCategoryPie.reduce((s, c) => s + c.amount, 0);
  return (
    <PanelBox className="flex-1 min-w-0">
      <SectHeader title="成本分项监控" />
      <div className="flex-1 flex flex-col px-2.5 pb-2 min-h-0">
        {/* horizontal bars */}
        <div className="flex-1 flex flex-col justify-between">
          {mockCostCategoryPie.map((c) => (
            <div key={c.name} className="flex items-center gap-1.5">
              <span className="text-[9px] w-10 flex-shrink-0 truncate" style={{ color: '#94a3b8' }}>{c.name}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
              </div>
              <span className="text-[9px] font-mono w-14 text-right flex-shrink-0" style={{ color: c.color }}>{c.amount.toLocaleString()}万</span>
            </div>
          ))}
        </div>
        {/* pie + legend */}
        <div className="flex items-center gap-2 mt-1.5 pt-1.5 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <PieChart categories={mockCostCategoryPie} size={60} />
          <div className="flex flex-col gap-0.5 min-w-0">
            {mockCostCategoryPie.map((c) => (
              <div key={c.name} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-[8px]" style={{ color: '#94a3b8' }}>{c.name}</span>
                <span className="text-[8px] font-mono" style={{ color: c.color }}>{c.pct}%</span>
              </div>
            ))}
            <div className="mt-0.5">
              <span className="text-[8px]" style={{ color: '#64748b' }}>总成本</span>
              <span className="text-[10px] font-bold font-mono ml-1" style={{ color: '#e8f0fe' }}>{(totalCost / 10000).toFixed(1)}亿</span>
            </div>
          </div>
        </div>
      </div>
    </PanelBox>
  );
}

/* ─── Panel 3: 项目后评价排名 ─── */
function PostEvalPanel() {
  const maxScore = Math.max(...mockScoreDistribution.map(x => x.count));
  return (
    <PanelBox className="flex-1 min-w-0">
      <SectHeader title="项目后评价排名" />
      <div className="flex-1 flex gap-2 px-2.5 pb-2 min-h-0">
        {/* top5 + bottom5 */}
        <div className="flex-[1.6] flex gap-2 min-w-0">
          <div className="flex-1 min-w-0 flex flex-col">
            <p className="text-[9px] mb-1 font-semibold flex-shrink-0" style={{ color: '#00d68f' }}>前5名</p>
            <div className="flex-1 flex flex-col justify-between min-h-0">
              {mockPostEvalTop5.map((item) => (
                <div key={item.rank} className="flex items-center gap-1 py-0.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span className="text-[9px] font-bold w-4 text-center flex-shrink-0" style={{ color: '#ffb800' }}>{item.rank}</span>
                  <span className="text-[9px] truncate flex-1 min-w-0" style={{ color: '#94a3b8' }}>{item.name}</span>
                  <span className="text-[9px] font-mono font-bold flex-shrink-0" style={{ color: '#00d68f' }}>{item.score}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <p className="text-[9px] mb-1 font-semibold flex-shrink-0" style={{ color: '#ff4757' }}>后5名</p>
            <div className="flex-1 flex flex-col justify-between min-h-0">
              {mockPostEvalBottom5.map((item) => (
                <div key={item.rank} className="flex items-center gap-1 py-0.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span className="text-[9px] font-bold w-4 text-center flex-shrink-0" style={{ color: '#ff4757' }}>{item.rank}</span>
                  <span className="text-[9px] truncate flex-1 min-w-0" style={{ color: '#94a3b8' }}>{item.name}</span>
                  <span className="text-[9px] font-mono font-bold flex-shrink-0" style={{ color: '#ff4757' }}>{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* score distribution */}
        <div className="flex-1 flex flex-col min-w-0">
          <p className="text-[9px] mb-1 flex-shrink-0" style={{ color: '#475569' }}>评分分布</p>
          <div className="flex-1 flex items-end gap-0.5 min-h-0">
            {mockScoreDistribution.map((d) => {
              const h = (d.count / maxScore) * 100;
              return (
                <div key={d.range} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                  <span className="text-[8px] font-mono mb-0.5" style={{ color: d.color }}>{d.count}</span>
                  <div className="w-full rounded-t-sm" style={{ height: `${h}%`, backgroundColor: d.color, minHeight: '4px' }} />
                  <span className="text-[7px] mt-0.5" style={{ color: '#475569' }}>{d.range}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PanelBox>
  );
}

/* ─── Panel 4: 运营风险与成本分析 ─── */
function RiskAnalysisPanel() {
  return (
    <PanelBox className="flex-1 min-w-0">
      <SectHeader title="运营风险与成本分析" />
      <div className="flex-1 flex flex-col px-2.5 pb-2 gap-1 min-h-0 overflow-auto">
        {mockRiskAnalysis.map((item, idx) => {
          const levelColor = item.riskLevel === '高' ? '#ff4757' : item.riskLevel === '中' ? '#ff8c32' : '#00d68f';
          return (
            <div key={item.id} className="flex items-center gap-1.5 py-0.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span className="text-[9px] font-bold w-4 text-center flex-shrink-0" style={{ color: levelColor }}>{idx + 1}</span>
              <span className="text-[9px] truncate flex-1 min-w-0" style={{ color: '#94a3b8' }}>{item.name}</span>
              <span className="text-[8px] px-1 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: `${levelColor}18`, color: levelColor }}>{item.riskLevel}</span>
              <span className="text-[9px] font-mono flex-shrink-0" style={{ color: levelColor }}>{item.score}</span>
            </div>
          );
        })}
      </div>
    </PanelBox>
  );
}

/* ─── Panel 5: 异常统计 ─── */
function AnomalyStatsPanel() {
  const maxV = Math.max(...mockBottomAnomalyStats.map(x => Math.max(x.anomaly, x.warning)));
  return (
    <PanelBox className="flex-1 min-w-0">
      <SectHeader title="异常统计" />
      <div className="flex-1 flex flex-col px-2.5 pb-2 min-h-0">
        {/* legend */}
        <div className="flex items-center gap-3 mb-1 flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#00d4ff' }} />
            <span className="text-[8px]" style={{ color: '#94a3b8' }}>异常</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#ff8c32' }} />
            <span className="text-[8px]" style={{ color: '#94a3b8' }}>预警</span>
          </div>
        </div>
        {/* bars */}
        <div className="flex-1 flex items-end gap-1 min-h-0">
          {mockBottomAnomalyStats.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
              <div className="w-full flex flex-col items-center justify-end gap-px" style={{ height: `${(Math.max(d.anomaly, d.warning) / maxV) * 100}%`, minHeight: '10px' }}>
                <div className="w-full rounded-t-sm" style={{ height: `${(d.anomaly / Math.max(d.anomaly, d.warning)) * 100}%`, backgroundColor: '#00d4ff', minHeight: '2px' }} />
                <div className="w-full rounded-t-sm" style={{ height: `${(d.warning / Math.max(d.anomaly, d.warning)) * 100}%`, backgroundColor: '#ff8c32', minHeight: '2px' }} />
              </div>
              <span className="text-[7px] mt-0.5" style={{ color: '#475569' }}>{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </PanelBox>
  );
}

/* ─── Panel 6: 企业成本管理 ─── */
function EnterpriseCostPanel() {
  const maxAmt = Math.max(...mockEnterpriseCostManage.map(x => x.amount));
  return (
    <PanelBox className="flex-1 min-w-0">
      <SectHeader title="企业成本管理" />
      <div className="flex-1 flex flex-col px-2.5 pb-2 gap-1 min-h-0">
        {mockEnterpriseCostManage.map((item) => (
          <div key={item.dept} className="flex items-center gap-1.5">
            <span className="text-[9px] w-10 flex-shrink-0 truncate" style={{ color: '#94a3b8' }}>{item.dept}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: `${(item.amount / maxAmt) * 100}%`, backgroundColor: item.color }} />
            </div>
            <span className="text-[9px] font-mono w-10 text-right flex-shrink-0" style={{ color: item.color }}>{(item.amount / 10000).toFixed(1)}亿</span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

/* ─── Main BottomSection ─── */
export default function BottomSection() {
  return (
    <div className="flex flex-col gap-2 flex-shrink-0" style={{ height: '38%' }}>
      <FundChainBar />
      <div className="flex-1 flex gap-2 min-h-0">
        <CostBudgetPanel />
        <CostCategoryPanel />
        <PostEvalPanel />
        <div className="flex flex-col gap-2 flex-1 min-w-0" style={{ maxWidth: 340 }}>
          <div className="flex gap-2 flex-1 min-h-0">
            <RiskAnalysisPanel />
            <AnomalyStatsPanel />
          </div>
          <div className="flex-1 min-h-0">
            <EnterpriseCostPanel />
          </div>
        </div>
      </div>
    </div>
  );
}