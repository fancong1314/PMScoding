import { useState } from 'react';
import {
  mockProjectPoints,
  mockSummary,
  type ProjectPoint,
} from '@/mocks/panoramaDashboardMocks';

const typeColorMap: Record<string, string> = {
  '技改': '#00e5c8',
  '大中修': '#ff8c32',
  '零固': '#36d986',
  '零星施工': '#a855f7',
};

function ProjectTooltip({ point }: { point: ProjectPoint }) {
  return (
    <div
      className="rounded-lg p-2.5 text-xs"
      style={{
        backgroundColor: 'rgba(8,18,38,0.95)',
        border: '1px solid rgba(0,212,255,0.3)',
        backdropFilter: 'blur(8px)',
        minWidth: 180,
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: typeColorMap[point.type] }} />
        <span className="font-semibold text-white truncate">{point.name}</span>
      </div>
      <div className="space-y-0.5" style={{ color: '#94a3b8' }}>
        <div className="flex justify-between"><span>立项号</span><span style={{ color: '#e8f0fe' }}>{point.projectNo}</span></div>
        <div className="flex justify-between"><span>项目类型</span><span style={{ color: typeColorMap[point.type] }}>{point.type}</span></div>
        <div className="flex justify-between"><span>批复金额</span><span style={{ color: '#e8f0fe' }}>¥{point.approvedAmount.toLocaleString()}万</span></div>
        <div className="flex justify-between"><span>当前进度</span><span style={{ color: '#00d4ff' }}>{point.progress}%</span></div>
        <div className="flex justify-between"><span>施工状态</span><span style={{ color: point.status === '收尾中' ? '#36d986' : '#00d4ff' }}>{point.status}</span></div>
      </div>
    </div>
  );
}

export default function MapSection() {
  const [hoveredPoint, setHoveredPoint] = useState<ProjectPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handlePointEnter = (p: ProjectPoint, e: React.MouseEvent) => {
    setHoveredPoint(p);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
  };

  return (
    <div className="relative rounded-lg overflow-hidden flex-1 min-h-0" style={{ border: '1px solid rgba(0,212,255,0.12)' }}>
      {/* Background image */}
      <img
        src="https://static.readdy.ai/image/d1a72a6b93b6d9c6b45ef8f686c78cdb/a392b2d8fbb5ab2b7a3f5d6eee64aa0b.jpeg"
        alt="南钢厂区3D地图"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.8) contrast(1.1)' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scan line */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.12), transparent)', animation: 'scanLine 3s linear infinite' }} />
      <style>{`@keyframes scanLine { 0% { top: 0%; } 100% { top: 100%; } }`}</style>

      {/* Project points */}
      {mockProjectPoints.map((p) => (
        <div key={p.id} className="absolute z-10 cursor-pointer"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
          onMouseEnter={(e) => handlePointEnter(p, e)} onMouseLeave={() => setHoveredPoint(null)}
        >
          <div className="absolute inset-0 rounded-full"
            style={{
              width: 24, height: 24, left: -8, top: -8,
              border: `1.5px solid ${typeColorMap[p.type]}`,
              animation: 'pulseRing 1.5s ease-out infinite',
            }}
          />
          <div className="w-2.5 h-2.5 rounded-full relative"
            style={{
              backgroundColor: typeColorMap[p.type],
              boxShadow: `0 0 8px ${typeColorMap[p.type]}, 0 0 16px ${typeColorMap[p.type]}44`,
            }}
          />
        </div>
      ))}
      <style>{`@keyframes pulseRing { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }`}</style>

      {/* Tooltip */}
      {hoveredPoint && (
        <div className="fixed z-50" style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)' }}>
          <ProjectTooltip point={hoveredPoint} />
        </div>
      )}

      {/* Type legend at bottom-right */}
      <div className="absolute bottom-2 right-2 z-10 rounded-lg px-2.5 py-1.5"
        style={{
          backgroundColor: 'rgba(8,18,38,0.85)',
          border: '1px solid rgba(0,212,255,0.15)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <div className="flex flex-wrap gap-2">
          {mockSummary.typeDistribution.map((t) => (
            <div key={t.type} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
              <span className="text-[9px]" style={{ color: '#e8f0fe' }}>{t.type}</span>
              <span className="text-[9px] font-mono" style={{ color: t.color }}>{t.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}