import { mockKpiCards } from '@/mocks/panoramaDashboardMocks';

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const w = 120;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-70">
      <defs>
        <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#sparkGrad-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KpiCards() {
  return (
    <div className="flex gap-2 flex-shrink-0">
      {mockKpiCards.map((kpi) => (
        <div
          key={kpi.label}
          className="flex-1 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden"
          style={{
            background: 'rgba(8,18,38,0.85)',
            border: '1px solid rgba(0,212,255,0.12)',
            backdropFilter: 'blur(10px)',
            minHeight: 86,
          }}
        >
          {/* top-left accent dot */}
          <div className="absolute top-0 left-0 w-6 h-[2px]" style={{ backgroundColor: kpi.color }} />
          <div className="absolute top-0 left-0 w-[2px] h-4" style={{ backgroundColor: kpi.color }} />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] mb-0.5" style={{ color: '#94a3b8' }}>{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight" style={{ color: kpi.color, fontFamily: 'monospace' }}>{kpi.value}</span>
                {kpi.unit && <span className="text-[10px]" style={{ color: '#64748b' }}>{kpi.unit}</span>}
              </div>
            </div>
          </div>

          <div className="mt-1">
            <SparkLine data={kpi.trend} color={kpi.color} />
          </div>
        </div>
      ))}
    </div>
  );
}