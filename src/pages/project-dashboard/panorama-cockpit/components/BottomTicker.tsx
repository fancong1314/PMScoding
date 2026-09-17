import { useEffect, useRef } from 'react';
import { mockTickerEvents } from '@/mocks/panoramaDashboardMocks';

const typeTagStyle: Record<string, { bg: string; color: string }> = {
  '重大风险': { bg: 'rgba(255,71,87,0.2)', color: '#ff4757' },
  '进度预警': { bg: 'rgba(255,184,0,0.15)', color: '#ffb800' },
  '审批超期': { bg: 'rgba(255,184,0,0.15)', color: '#ffb800' },
  '里程碑达成': { bg: 'rgba(0,214,143,0.15)', color: '#00d68f' },
  '合同签订': { bg: 'rgba(0,212,255,0.15)', color: '#00d4ff' },
};

export default function BottomTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    let pos = 0;
    const speed = 0.8;
    const animate = () => {
      pos += speed;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (pos >= maxScroll) pos = 0;
      el.scrollLeft = pos;
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="flex items-center flex-shrink-0 overflow-hidden px-3"
      style={{
        height: 34,
        backgroundColor: 'rgba(5,13,26,0.95)',
        borderTop: '1px solid rgba(0,212,255,0.12)',
      }}
    >
      <div className="flex items-center gap-1.5 flex-shrink-0 mr-3">
        <div className="w-3.5 h-3.5 flex items-center justify-center">
          <i className="ri-notification-3-line text-xs" style={{ color: '#00d4ff' }} />
        </div>
        <span className="text-[11px] font-medium" style={{ color: '#00d4ff' }}>实时动态</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-hidden whitespace-nowrap">
        <div className="inline-flex items-center gap-6">
          {[...mockTickerEvents, ...mockTickerEvents].map((e, idx) => {
            const style = typeTagStyle[e.type];
            return (
              <span key={`${e.id}-${idx}`} className="inline-flex items-center gap-2 text-[11px]">
                <span className="font-mono" style={{ color: '#475569' }}>{e.time}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: style.bg, color: style.color }}>
                  {e.type}
                </span>
                <span style={{ color: '#e8f0fe' }}>{e.description}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}