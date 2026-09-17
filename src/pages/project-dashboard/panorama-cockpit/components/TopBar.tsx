import { useState, useEffect } from 'react';
import { mockRefreshTime } from '@/mocks/panoramaDashboardMocks';

export default function TopBar() {
  const [now, setNow] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日 星期${weekdays[now.getDay()]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return (
    <div
      className="flex items-center justify-between px-5 flex-shrink-0 relative"
      style={{
        height: 50,
        background: 'linear-gradient(180deg, rgba(5,13,26,0.98) 0%, rgba(8,20,40,0.95) 100%)',
        borderBottom: '1px solid rgba(0,212,255,0.12)',
      }}
    >
      {/* Decorative corners */}
      <div className="absolute bottom-0 left-0 w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff)' }} />

      {/* Left: Date */}
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #0090b0)' }}
        >
          南
        </div>
        <span className="text-xs font-medium" style={{ color: '#e8f0fe', fontFamily: 'monospace' }}>
          {dateStr}
        </span>
      </div>

      {/* Center: Title with decorative frame */}
      <div className="flex flex-col items-center relative">
        <div className="flex items-center gap-3">
          <div className="w-20 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff44)' }} />
          <h1
            className="text-base font-bold tracking-widest"
            style={{
              background: 'linear-gradient(90deg, #00d4ff, #00e5c8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            工程管控一体化全景驾驶舱
          </h1>
          <div className="w-20 h-[1px]" style={{ background: 'linear-gradient(90deg, #00e5c844, transparent)' }} />
        </div>
        <div className="w-full h-px mt-0.5" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff33, #00e5c833, transparent)' }} />
      </div>

      {/* Right: Refresh + Fullscreen */}
      <div className="flex items-center gap-2">
        <span className="text-[10px]" style={{ color: '#475569' }}>
          更新于 {mockRefreshTime.split(' ')[1]}
        </span>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] cursor-pointer transition-colors whitespace-nowrap"
          style={{
            backgroundColor: autoRefresh ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${autoRefresh ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
            color: autoRefresh ? '#00d4ff' : '#64748b',
          }}
        >
          <div className="w-3 h-3 flex items-center justify-center">
            <i className="ri-refresh-line" />
          </div>
          {autoRefresh ? '5min' : '暂停'}
        </button>
        <button
          onClick={() => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
            else document.exitFullscreen().catch(() => {});
          }}
          className="w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-colors hover:bg-white/5"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <i className="ri-fullscreen-line text-sm" style={{ color: '#00d4ff' }} />
        </button>
      </div>
    </div>
  );
}