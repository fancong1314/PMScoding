import { useState } from 'react';
import {
  mockFundChain,
  mockTypeAvgProgress,
  mockProgressIntervals,
  mockRedBlackList,
  mockTypeInvestPct,
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

function RingChart({ rate, size }: { rate: number; size: number }) {
  const strokeWidth = 5;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (rate / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#00d4ff" strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ filter: 'drop-shadow(0 0 5px rgba(0,212,255,0.5))', transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color: '#00d4ff', fontFamily: 'monospace' }}>{rate}%</span>
    </div>
  );
}

/* ─── Panel 1: 项目概览 ─── */
function ProjectOverview() {
  const fc = mockFundChain;
  return (
    <PanelBox className="flex-shrink-0">
      <SectHeader title="项目概览" />
      <div className="px-2.5 pb-2 flex flex-col gap-2">
        {/* Colored tags */}
        <div className="grid grid-cols-2 gap-1">
          {mockTypeInvestPct.map((t) => (
            <div key={t.type} className="flex items-center gap-1 px-1.5 py-1 rounded text-[10px]" style={{ backgroundColor: `${t.color}12` }}>
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: t.color }} />
              <span style={{ color: t.color }}>{t.type}</span>
              <span className="text-xs font-bold ml-auto" style={{ color: t.color, fontFamily: 'monospace' }}>{t.pct}%</span>
            </div>
          ))}
        </div>

        {/* Ring chart */}
        <div className="flex items-center justify-center">
          <RingChart rate={fc.investCompletionRate} size={72} />
        </div>

        {/* Two metric cards */}
        <div className="flex gap-2">
          <div className="flex-1 rounded-md px-2 py-1.5 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <p className="text-[10px]" style={{ color: '#64748b' }}>整体完工率</p>
            <p className="text-sm font-bold mt-0.5" style={{ color: '#e8f0fe', fontFamily: 'monospace' }}>{fc.completionRate}%</p>
          </div>
          <div className="flex-1 rounded-md px-2 py-1.5 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <p className="text-[10px]" style={{ color: '#64748b' }}>成本偏差率</p>
            <p className="text-sm font-bold mt-0.5" style={{ color: fc.costDeviationRate > 0 ? '#ff4757' : fc.costDeviationRate < 0 ? '#00d68f' : '#64748b', fontFamily: 'monospace' }}>
              {fc.costDeviationRate > 0 ? '+' : ''}{fc.costDeviationRate}%
            </p>
          </div>
        </div>

        {/* Type avg progress bars */}
        <div className="space-y-1">
          {mockTypeAvgProgress.map((t) => (
            <div key={t.type} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: t.color }} />
              <span className="text-[10px] w-10 flex-shrink-0" style={{ color: '#94a3b8' }}>{t.type}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
              </div>
              <span className="text-[10px] font-mono w-8 text-right flex-shrink-0" style={{ color: t.color }}>{t.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </PanelBox>
  );
}

/* ─── Panel 2: 进度区间分布 ─── */
function ProgressIntervalPanel() {
  const maxCount = Math.max(...mockProgressIntervals.map(i => i.count));
  return (
    <PanelBox className="flex-shrink-0">
      <SectHeader title="进度区间分布" />
      <div className="px-2.5 pb-2 flex flex-col" style={{ height: 140 }}>
        <div className="flex gap-1.5 flex-1 items-end">
          {/* Y-axis */}
          <div className="flex flex-col justify-between text-[8px] pr-1 flex-shrink-0" style={{ color: '#475569', height: '100%' }}>
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>
          {/* Bars */}
          <div className="flex-1 flex items-end gap-2 h-full">
            {mockProgressIntervals.map((iv) => {
              const h = (iv.count / maxCount) * 100;
              const total = iv.tech + iv.overhaul + iv.fixedAsset + iv.sporadic;
              return (
                <div key={iv.range} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                  <span className="text-[9px] font-mono" style={{ color: '#e8f0fe' }}>{iv.count}</span>
                  <div className="w-full flex flex-col justify-end rounded-sm overflow-hidden" style={{ height: `${h}%`, minHeight: '16px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ height: `${(iv.tech / total) * 100}%`, backgroundColor: '#00e5c8', minHeight: '1px' }} />
                    <div style={{ height: `${(iv.overhaul / total) * 100}%`, backgroundColor: '#ff8c32', minHeight: '1px' }} />
                    <div style={{ height: `${(iv.fixedAsset / total) * 100}%`, backgroundColor: '#36d986', minHeight: '1px' }} />
                    <div style={{ height: `${(iv.sporadic / total) * 100}%`, backgroundColor: '#a855f7', minHeight: '1px' }} />
                  </div>
                  <span className="text-[8px]" style={{ color: '#64748b' }}>{iv.range}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PanelBox>
  );
}

/* ─── Panel 3: 重点项目红黑榜 ─── */
function RedBlackListPanel() {
  const redList = mockRedBlackList.filter(p => p.isRed);
  const blackList = mockRedBlackList.filter(p => !p.isRed);
  const maxRed = Math.max(...redList.map(p => p.score));
  return (
    <PanelBox className="flex-1 min-h-0">
      <SectHeader title="重点项目红黑榜" />
      <div className="px-2.5 pb-2 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
        {/* Red list (lagging) */}
        <div className="flex-1 flex flex-col min-h-0">
          <p className="text-[9px] mb-1 flex-shrink-0" style={{ color: '#ff4757' }}>进度滞后项目</p>
          <div className="flex-1 flex flex-col justify-between min-h-0 overflow-auto">
            {redList.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1.5 py-0.5">
                <span className="text-[10px] font-bold w-3 text-center flex-shrink-0" style={{ color: '#ff4757' }}>{idx + 1}</span>
                <span className="text-[10px] truncate flex-1 min-w-0" style={{ color: '#94a3b8' }}>{p.name}</span>
                <div className="w-14 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(p.score / maxRed) * 100}%`, backgroundColor: p.color }} />
                </div>
                <span className="text-[9px] font-bold font-mono w-9 text-right flex-shrink-0" style={{ color: p.color }}>{p.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

        {/* Black list (good) */}
        <div className="flex-1 flex flex-col min-h-0">
          <p className="text-[9px] mb-1 flex-shrink-0" style={{ color: '#00d68f' }}>进度优秀项目</p>
          <div className="flex-1 flex flex-col justify-between min-h-0 overflow-auto">
            {blackList.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1.5 py-0.5">
                <span className="text-[10px] font-bold w-3 text-center flex-shrink-0" style={{ color: '#00d68f' }}>{idx + 1}</span>
                <span className="text-[10px] truncate flex-1 min-w-0" style={{ color: '#94a3b8' }}>{p.name}</span>
                <div className="w-14 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${p.score}%`, backgroundColor: p.color }} />
                </div>
                <span className="text-[9px] font-bold font-mono w-9 text-right flex-shrink-0" style={{ color: p.color }}>{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  );
}

/* ─── Main LeftPanel ─── */
export default function LeftPanel() {
  return (
    <div className="flex flex-col gap-2 flex-shrink-0 overflow-y-auto" style={{ width: 280 }}>
      <ProjectOverview />
      <ProgressIntervalPanel />
      <RedBlackListPanel />
    </div>
  );
}