import { useState } from 'react';
import {
  mockMonitorFeeds,
  mockAlerts,
  mockBizNav,
  mockInvestmentTrends,
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

const SectHeader = ({ title, extra }: { title: string; extra?: React.ReactNode }) => (
  <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5 flex-shrink-0">
    <div className="flex items-center gap-1.5">
      <div className="w-[3px] h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#00d4ff' }} />
      <h4 className="text-[11px] font-semibold" style={{ color: '#e8f0fe' }}>{title}</h4>
    </div>
    {extra}
  </div>
);

/* ─── Panel 1: 施工监控 ─── */
function MonitorPanel() {
  const onlineCount = mockMonitorFeeds.filter(m => m.online).length;
  return (
    <PanelBox className="flex-shrink-0">
      <SectHeader
        title="施工监控"
        extra={<span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>在线 {onlineCount}路</span>}
      />
      <div className="px-2.5 pb-2.5 grid grid-cols-2 gap-1.5" style={{ height: 150 }}>
        {mockMonitorFeeds.map((feed) => (
          <div key={feed.id} className="relative rounded-md overflow-hidden cursor-pointer group"
            style={{ border: `1px solid ${feed.online ? 'rgba(0,214,143,0.2)' : 'rgba(255,255,255,0.06)'}` }}
          >
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: feed.online ? '#0d1f3c' : '#111827' }}>
              {feed.online ? (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d1f3c, #1e3a6e)' }}>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-5 h-5 flex items-center justify-center"><i className="ri-vidicon-line text-base" style={{ color: '#00d4ff' }} /></div>
                    <span className="text-[9px]" style={{ color: '#00d4ff' }}>LIVE</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-5 h-5 flex items-center justify-center"><i className="ri-camera-off-line text-base" style={{ color: '#475569' }} /></div>
                  <span className="text-[9px]" style={{ color: '#64748b' }}>OFF</span>
                </div>
              )}
            </div>
            <div className="absolute top-1 left-1 flex items-center gap-1 px-1 py-0.5 rounded text-[8px] z-10" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: feed.online ? '#00d68f' : '#ff4757' }} />
              <span style={{ color: feed.online ? '#00d68f' : '#ff4757' }}>{feed.online ? 'LIVE' : 'OFF'}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 text-[8px] truncate z-10" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#e8f0fe' }}>
              {feed.contractName}
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity border border-[rgba(0,212,255,0.4)]" />
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

/* ─── Panel 2: 异常统计 ─── */
function AnomalyPanel() {
  const maxAmt = Math.max(...mockInvestmentTrends.map(x => x.amount));
  // Fake line data for overlay
  const lineData = mockInvestmentTrends.map((t, i) => ({
    ...t,
    lineVal: t.amount * (0.7 + Math.sin(i * 0.8) * 0.15),
  }));
  const maxLine = Math.max(...lineData.map(x => x.lineVal));

  return (
    <PanelBox className="flex-1 min-h-0">
      <SectHeader title="异常统计" />
      <div className="px-2.5 pb-2 flex flex-col flex-1 min-h-0">
        {/* Legend */}
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

        {/* Chart area */}
        <div className="flex-1 relative min-h-0">
          <div className="absolute inset-0 flex items-end gap-1">
            {lineData.map((d, idx) => {
              const barH = (d.amount / maxAmt) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                  <div className="w-full rounded-t-sm" style={{ height: `${barH}%`, backgroundColor: '#00d4ff', minHeight: '2px', opacity: 0.7 }} />
                  <span className="text-[7px] mt-0.5" style={{ color: '#475569' }}>{d.month}</span>
                </div>
              );
            })}
          </div>
          {/* Line overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            <polyline
              fill="none"
              stroke="#ff8c32"
              strokeWidth="1.5"
              points={lineData.map((d, i) => {
                const x = ((i + 0.5) / lineData.length) * 100;
                const y = 100 - (d.lineVal / maxLine) * 90;
                return `${x}%,${y}%`;
              }).join(' ')}
            />
            {lineData.map((d, i) => {
              const x = ((i + 0.5) / lineData.length) * 100;
              const y = 100 - (d.lineVal / maxLine) * 90;
              return (
                <circle key={i} cx={`${x}%`} cy={`${y}%`} r="2" fill="#ff8c32" />
              );
            })}
          </svg>
        </div>
      </div>
    </PanelBox>
  );
}

/* ─── Panel 3: 业务线管理 ─── */
function BizNavPanel() {
  const [hoveredBiz, setHoveredBiz] = useState<string | null>(null);
  return (
    <PanelBox className="flex-1 min-h-0">
      <SectHeader title="业务线管理" />
      <div className="px-2.5 pb-2 grid grid-cols-2 gap-1.5 flex-1 min-h-0 content-start overflow-auto">
        {mockBizNav.map((item) => (
          <div key={item.dept}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-all"
            style={{
              backgroundColor: hoveredBiz === item.dept ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)',
              border: hoveredBiz === item.dept ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
            }}
            onMouseEnter={() => setHoveredBiz(item.dept)}
            onMouseLeave={() => setHoveredBiz(null)}
          >
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <i className={`${item.icon} text-xs`} style={{ color: '#00d4ff' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] truncate" style={{ color: '#e8f0fe' }}>{item.dept}</p>
              <p className="text-[9px]" style={{ color: '#64748b' }}>
                <span className="text-xs font-bold font-mono" style={{ color: '#00d4ff' }}>{item.projectCount}</span> 个项目
              </p>
            </div>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

/* ─── Alert mini cards (kept from original) ─── */
function AlertMiniCards() {
  return (
    <div className="grid grid-cols-2 gap-1.5 flex-shrink-0 px-2.5 pb-2">
      {mockAlerts.map((alert) => (
        <div key={alert.name} className="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer hover:bg-white/5 transition-colors"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: alert.count > 0 ? `2px solid ${alert.color}` : '2px solid transparent' }}
        >
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i className={`${alert.icon} text-xs`} style={{ color: alert.count > 0 ? alert.color : '#475569' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] truncate" style={{ color: '#64748b' }}>{alert.name}</p>
            <p className="text-sm font-bold font-mono" style={{ color: alert.count > 0 ? alert.color : '#475569' }}>{alert.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main RightPanel ─── */
export default function RightPanel() {
  return (
    <div className="flex flex-col gap-2 flex-shrink-0 overflow-y-auto" style={{ width: 300 }}>
      <MonitorPanel />
      <AlertMiniCards />
      <AnomalyPanel />
      <BizNavPanel />
    </div>
  );
}