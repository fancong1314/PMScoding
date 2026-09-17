import { useMemo } from 'react';
import {
  projectStageFlow,
  projectInfoCards,
  keyMetrics,
  fundDistribution,
  contractProgressList,
  paymentData,
  contractAmountTypes,
  contractAmountChartData,
  type ProjectOption,
} from '@/mocks/projectDetailMocks';

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-3.5 rounded-full" style={{ background: '#00d4ff' }} />
      <h3 className="text-xs font-semibold text-white">{title}</h3>
    </div>
  );
}

function RingSmall({ rate, size = 56, strokeWidth = 5, color = '#00d4ff' }: { rate: number; size?: number; strokeWidth?: number; color?: string }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (rate / 100) * c;
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 5px ${color}66)`, transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span className="absolute text-xs font-bold text-white">{rate}%</span>
    </div>
  );
}

function DonutChart({ data, size = 80, strokeWidth = 14 }: { data: { value: number; color: string }[]; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} className="-rotate-90">
      {data.map((d, i) => {
        const seg = total > 0 ? (d.value / total) * c : 0;
        const curOffset = offset;
        offset -= seg;
        return (
          <circle
            key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color}
            strokeWidth={strokeWidth} strokeLinecap="butt"
            strokeDasharray={`${seg} ${c - seg}`} strokeDashoffset={curOffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        );
      })}
    </svg>
  );
}

export default function BasicInfoTab({ project }: { project: ProjectOption }) {
  const donutTotal = useMemo(() => contractAmountChartData.reduce((s, d) => s + d.value, 0), []);

  return (
    <div className="space-y-3">
      {/* Project title + stage flow + info cards */}
      <div
        className="rounded-lg p-4"
        style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}
      >
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-white">
            {project.name}（{project.number}）
          </h2>
        </div>
        {/* Stage flow */}
        <div className="flex items-center justify-center gap-1 mb-4 flex-wrap">
          {projectStageFlow.map((stage, idx) => (
            <div key={stage.name} className="flex items-center">
              <div
                className={`px-3 py-1 rounded text-xs whitespace-nowrap ${stage.active ? 'text-white font-medium' : 'text-slate-500'}`}
                style={
                  stage.active
                    ? { background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {stage.name}
              </div>
              {idx < projectStageFlow.length - 1 && (
                <div
                  className="w-5 h-px mx-0.5 flex-shrink-0"
                  style={{ background: stage.completed ? '#00d4ff' : '#334155' }}
                />
              )}
            </div>
          ))}
        </div>
        {/* Info cards */}
        <div className="grid grid-cols-6 gap-3">
          {projectInfoCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="w-6 h-6 mx-auto mb-1.5 flex items-center justify-center rounded-full" style={{ background: 'rgba(0,212,255,0.08)' }}>
                <i className={`${card.icon} text-xs`} style={{ color: '#00d4ff' }} />
              </div>
              <p className="text-[10px] text-slate-400 mb-0.5">{card.label}</p>
              <p className="text-sm font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Key metrics with glow */}
      <div className="grid grid-cols-5 gap-3">
        {keyMetrics.map((m) => (
          <div
            key={m.label}
            className="relative rounded-lg p-4 text-center overflow-hidden"
            style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}
          >
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-10 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.35) 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              <div
                className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(0,212,255,0.1)' }}
              >
                <i className={`${m.icon} text-lg`} style={{ color: m.color }} />
              </div>
              <p className="text-xl font-bold text-white mb-0.5">{m.value}</p>
              <p className="text-[10px] text-slate-400">
                {m.label}（{m.unit}）
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: 3 panels */}
      <div className="grid grid-cols-3 gap-3">
        {/* Fund distribution */}
        <div
          className="rounded-lg p-4"
          style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}
        >
          <SectionTitle title="项目资金分布情况" />
          <div className="grid grid-cols-2 gap-3">
            {fundDistribution.map((item) => (
              <div
                key={item.name}
                className="rounded-lg p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-8 h-8 mx-auto mb-1 flex items-center justify-center rounded-full"
                  style={{ background: 'rgba(0,212,255,0.1)' }}
                >
                  <i className={`${item.icon} text-sm`} style={{ color: '#00d4ff' }} />
                </div>
                <p className="text-lg font-bold text-white">{item.amount}</p>
                <p className="text-[10px] text-slate-400">{item.name}（万元）</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contract progress */}
        <div
          className="rounded-lg p-4"
          style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}
        >
          <SectionTitle title="项目进度情况" />
          <div className="space-y-2.5">
            {contractProgressList.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-300">{c.name}</span>
                  <span className="text-[11px] font-mono" style={{ color: '#00d4ff' }}>
                    {c.progress}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${c.progress}%`,
                      background: 'linear-gradient(90deg, #00d4ff, #00e5c8)',
                      boxShadow: '0 0 6px rgba(0,212,255,0.3)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment + Contract amount distribution */}
        <div className="flex flex-col gap-3">
          {/* Payment */}
          <div
            className="rounded-lg p-4 flex-1"
            style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}
          >
            <SectionTitle title="项目付款情况" />
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <RingSmall rate={paymentData.totalRate} size={56} />
                <p className="text-[10px] text-slate-400">总付款金额</p>
                <p className="text-sm font-bold text-white">{paymentData.totalAmount}</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {paymentData.contracts.map((c) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-16 truncate">{c.name}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.rate}%`, background: 'linear-gradient(90deg, #00d4ff, #00e5c8)' }}
                      />
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: '#00d4ff' }}>{c.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contract amount distribution */}
          <div
            className="rounded-lg p-4 flex-1"
            style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}
          >
            <SectionTitle title="项目合同金额分布" />
            <div className="flex gap-3 items-center">
              <div className="flex-1 grid grid-cols-2 gap-2">
                {contractAmountTypes.map((t) => (
                  <div key={t.name} className="text-center">
                    <div
                      className="w-7 h-7 mx-auto mb-1 flex items-center justify-center rounded-full"
                      style={{ background: 'rgba(0,212,255,0.1)' }}
                    >
                      <i className={`${t.icon} text-xs`} style={{ color: '#00d4ff' }} />
                    </div>
                    <p className="text-sm font-bold text-white">{t.amount}</p>
                    <p className="text-[9px] text-slate-400">{t.name}</p>
                  </div>
                ))}
              </div>
              <div className="flex-shrink-0 flex flex-col items-center">
                <DonutChart data={contractAmountChartData.map((d) => ({ value: d.value, color: d.color }))} size={70} strokeWidth={12} />
                <p className="text-[9px] text-slate-500 mt-1">万元</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}