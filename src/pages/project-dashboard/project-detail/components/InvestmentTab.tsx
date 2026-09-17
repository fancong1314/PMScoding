import { useMemo } from 'react';
import {
  investmentSummary,
  costTypeProportions,
  diffMetrics,
  deviations,
  costDiffAnalysis,
  costTypeAvailable,
  contractProportion,
  contractTypeBars,
  paymentTable,
} from '@/mocks/projectDetailMocks';

function RingLarge({ rate, size = 100, strokeWidth = 8, color = '#00d4ff' }: { rate: number; size?: number; strokeWidth?: number; color?: string }) {
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
          style={{ filter: `drop-shadow(0 0 8px ${color}66)`, transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span className="absolute text-lg font-bold text-white">{rate}%</span>
    </div>
  );
}

function DonutChart({ data, size = 90, strokeWidth = 14 }: { data: { value: number; color: string }[]; size?: number; strokeWidth?: number }) {
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

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-3.5 rounded-full" style={{ background: '#00d4ff' }} />
      <h3 className="text-xs font-semibold text-white">{title}</h3>
    </div>
  );
}

export default function InvestmentTab() {
  const costTotal = useMemo(() => costTypeProportions.reduce((s, d) => s + d.amount, 0), []);
  const propTotal = useMemo(() => contractProportion.reduce((s, d) => s + d.value, 0), []);
  const maxDiffPlanned = useMemo(() => Math.max(...costDiffAnalysis.map((d) => d.planned), 1), []);

  return (
    <div className="grid grid-cols-12 gap-3">
      {/* Left column: 3 cols */}
      <div className="col-span-3 flex flex-col gap-3">
        {/* Occupancy ring */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <SectionTitle title="项目金额占用情况" />
          <div className="flex flex-col items-center gap-3">
            <RingLarge rate={investmentSummary.occupancyRate} size={100} color="#00d4ff" />
            <div className="grid grid-cols-3 gap-2 w-full">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 mb-0.5">项目总额</p>
                <p className="text-sm font-bold text-white">{investmentSummary.totalAmount.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 mb-0.5">占用金额</p>
                <p className="text-sm font-bold" style={{ color: '#ffb800' }}>{investmentSummary.usedAmount.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 mb-0.5">可用金额</p>
                <p className="text-sm font-bold" style={{ color: '#00e5c8' }}>{investmentSummary.availableAmount.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">占用比例</p>
          </div>
        </div>

        {/* Cost type donut */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <SectionTitle title="项目各费用类型占比" />
          <div className="flex items-center gap-3">
            <DonutChart
              data={costTypeProportions.map((d) => ({ value: d.amount, color: d.color }))}
              size={90}
              strokeWidth={14}
            />
            <div className="flex-1 space-y-1.5">
              {costTypeProportions.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-[10px] text-slate-400">{item.name}</span>
                  <span className="text-[10px] font-mono text-slate-300 ml-auto">{((item.amount / costTotal) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center column: 5 cols */}
      <div className="col-span-5 flex flex-col gap-3">
        {/* Diff metrics - 4 cards */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <SectionTitle title="投资差异情况" />
          <div className="grid grid-cols-4 gap-3">
            {diffMetrics.map((m) => (
              <div key={m.label} className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center rounded-full" style={{ background: 'rgba(0,212,255,0.1)' }}>
                  <i className={`${m.icon} text-sm`} style={{ color: '#00d4ff' }} />
                </div>
                <p className="text-lg font-bold text-white">{m.value}</p>
                <p className="text-[10px] text-slate-400">{m.label}（{m.unit}）</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deviation cards 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {deviations.map((d) => (
            <div
              key={d.label}
              className="rounded-lg p-3"
              style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-[10px] text-slate-400 mb-2">{d.label}</p>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xl font-bold" style={{ color: d.color }}>{d.amount}</span>
                  <span className="text-[10px] text-slate-400 ml-0.5">万元</span>
                </div>
                <span className="text-lg font-bold" style={{ color: d.color }}>+{d.rate}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cost diff analysis bar chart + Available amounts */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          <div className="rounded-lg p-4" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <SectionTitle title="费用类型差异分析" />
            <div className="space-y-2">
              {costDiffAnalysis.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 flex items-end gap-1 h-6">
                      <div
                        className="rounded-sm"
                        style={{
                          width: `${(item.planned / maxDiffPlanned) * 100}%`,
                          height: '20px',
                          background: '#00d4ff',
                          opacity: 0.7,
                        }}
                      />
                      <div
                        className="rounded-sm"
                        style={{
                          width: `${(item.actual / maxDiffPlanned) * 100}%`,
                          height: '20px',
                          background: '#ff8c32',
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[9px] text-cyan-400">立项 {item.planned}</span>
                    <span className="text-[9px] text-orange-400">实际 {item.actual}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg p-4" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <SectionTitle title="费用类型可用金额" />
            <div className="grid grid-cols-2 gap-3">
              {costTypeAvailable.map((item) => (
                <div key={item.name} className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] text-slate-400 mb-1">{item.name}</p>
                  <p className="text-xl font-bold text-white">{item.rate}%</p>
                  <div className="h-1 rounded-full overflow-hidden mt-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.rate}%`, background: item.color }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 mt-1">可用金额{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right column: 4 cols */}
      <div className="col-span-4 flex flex-col gap-3">
        {/* Contract proportion ring */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <SectionTitle title="各合同占比分析" />
          <div className="flex items-center gap-3">
            <DonutChart
              data={contractProportion.map((d) => ({ value: d.value, color: d.color }))}
              size={85}
              strokeWidth={12}
            />
            <div className="flex-1 space-y-1">
              {contractProportion.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-[10px] text-slate-400 w-8">{item.name}</span>
                  <span className="text-[10px] font-mono text-slate-300">{item.value.toLocaleString()}</span>
                  <span className="text-[10px] font-mono ml-auto" style={{ color: item.color }}>
                    {((item.value / propTotal) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contract type stacked bars */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <SectionTitle title="合同类型占比分析" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] text-slate-500 w-8" />
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[9px] text-slate-500">建筑费</span>
                <span className="text-[9px] text-slate-500">安装费</span>
                <span className="text-[9px] text-slate-500">设备费</span>
                <span className="text-[9px] text-slate-500">其他</span>
              </div>
            </div>
            {contractTypeBars.map((bar) => (
              <div key={bar.name} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-8 truncate">{bar.name}</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden flex">
                  {bar.values.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        width: `${v}%`,
                        background: ['#00d4ff', '#ff8c32', '#36d986', '#a855f7'][i],
                        opacity: 0.8,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment table */}
        <div className="rounded-lg p-4 flex-1" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <SectionTitle title="各合同付款情况" />
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-slate-400" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left py-1.5 font-medium">合同名称</th>
                  <th className="text-left py-1.5 font-medium">承建方</th>
                  <th className="text-right py-1.5 font-medium">合同金额</th>
                  <th className="text-right py-1.5 font-medium">已付金额</th>
                  <th className="text-right py-1.5 font-medium">付款比例</th>
                </tr>
              </thead>
              <tbody>
                {paymentTable.map((row) => (
                  <tr key={row.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="py-1.5 text-slate-300">{row.name}</td>
                    <td className="py-1.5 text-slate-400">{row.party}</td>
                    <td className="py-1.5 text-right font-mono text-slate-300">{row.amount.toLocaleString()}</td>
                    <td className="py-1.5 text-right font-mono text-slate-300">{row.paid.toLocaleString()}</td>
                    <td className="py-1.5 text-right">
                      <span className="text-[10px] font-mono" style={{ color: row.rate >= 80 ? '#00e5c8' : row.rate >= 50 ? '#00d4ff' : '#ffb800' }}>{row.rate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}