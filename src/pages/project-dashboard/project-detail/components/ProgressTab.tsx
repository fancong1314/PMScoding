import { useState } from 'react';
import {
  contractOverview,
  overallProgress,
  taskList,
} from '@/mocks/projectDetailMocks';

function RingProgress({ rate, size = 72, strokeWidth = 6, color = '#00d4ff' }: { rate: number; size?: number; strokeWidth?: number; color?: string }) {
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
          style={{ filter: `drop-shadow(0 0 6px ${color}66)`, transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span className="absolute text-base font-bold text-white">{rate}%</span>
    </div>
  );
}

export default function ProgressTab() {
  const [selectedContract, setSelectedContract] = useState(contractOverview[0].name);
  const selectedTaskGroup = taskList.find((t) => t.contractName === selectedContract) || taskList[0];

  return (
    <div className="flex gap-3 h-full" style={{ minHeight: 0 }}>
      {/* Left: Contract overview */}
      <div
        className="w-56 flex-shrink-0 rounded-lg p-3 flex flex-col"
        style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}
      >
        <h3 className="text-xs font-semibold text-white mb-3 flex items-center gap-2">
          <div className="w-1 h-3 rounded-full" style={{ background: '#00d4ff' }} />
          合同概览
        </h3>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {contractOverview.map((c) => (
            <div
              key={c.name}
              onClick={() => setSelectedContract(c.name)}
              className={`rounded-lg p-3 cursor-pointer transition-all ${
                selectedContract === c.name
                  ? 'border border-cyan-400/30'
                  : 'border border-transparent hover:bg-white/[0.03]'
              }`}
              style={selectedContract === c.name ? { background: 'rgba(0,212,255,0.08)' } : undefined}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,212,255,0.1)' }}
                >
                  <i className={`${c.icon} text-xs`} style={{ color: '#00d4ff' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white truncate">{c.name}</p>
                  <p className="text-[10px] text-slate-400">实际进度</p>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.progress}%`, background: 'linear-gradient(90deg, #00d4ff, #00e5c8)' }}
                />
              </div>
              <div className="text-right mt-0.5">
                <span className="text-[10px] font-mono" style={{ color: '#00d4ff' }}>{c.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col gap-3" style={{ minHeight: 0 }}>
        {/* Overall progress */}
        <div
          className="rounded-lg p-4 flex-shrink-0"
          style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3.5 rounded-full" style={{ background: '#00d4ff' }} />
            <h3 className="text-xs font-semibold text-white">年度计划进度</h3>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <RingProgress rate={overallProgress.planProgress} size={72} color="#00d4ff" />
              <div>
                <p className="text-xl font-bold text-white">{overallProgress.planProgress}%</p>
                <p className="text-[10px] text-slate-400">总体计划进度</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RingProgress rate={overallProgress.actualProgress} size={72} color="#ffb800" />
              <div>
                <p className="text-xl font-bold text-white">{overallProgress.actualProgress}%</p>
                <p className="text-[10px] text-slate-400">总体实际进度</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: '#ff4757' }} />
              <div>
                <p className="text-[10px] text-slate-400">偏差率</p>
                <p className="text-xl font-bold" style={{ color: '#ff4757' }}>{overallProgress.deviation}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task details */}
        <div
          className="rounded-lg p-4 flex-1 flex flex-col"
          style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)', minHeight: 0 }}
        >
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 rounded-full" style={{ background: '#00d4ff' }} />
              <h3 className="text-xs font-semibold text-white">
                选定合同: {selectedContract} - 任务详情
              </h3>
            </div>
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="h-7 px-2 text-xs rounded outline-none text-slate-200 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              {contractOverview.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Task table */}
          <div className="overflow-auto flex-1" style={{ minHeight: 0 }}>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left py-2 font-medium whitespace-nowrap">任务名称</th>
                  <th className="text-left py-2 font-medium whitespace-nowrap">计划进度</th>
                  <th className="text-left py-2 font-medium whitespace-nowrap">实际进度</th>
                  <th className="text-center py-2 font-medium whitespace-nowrap">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td colSpan={4} className="py-1 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-cyan-400 font-medium">{selectedTaskGroup.contractName}</span>
                      <span className="text-[10px] text-slate-500">（{selectedTaskGroup.contractCode}）</span>
                    </div>
                  </td>
                </tr>
                {selectedTaskGroup.tasks.map((task, idx) => {
                  const statusColor = task.status === 'done' ? '#00e5c8' : task.status === 'warning' ? '#ff4757' : task.status === 'doing' ? '#00d4ff' : '#64748b';
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 flex items-center justify-center" style={{ color: statusColor }}>
                            {task.status === 'done' && <i className="ri-checkbox-circle-line" />}
                            {task.status === 'warning' && <i className="ri-error-warning-line" />}
                            {task.status === 'doing' && <i className="ri-loader-4-line" />}
                            {task.status === 'pending' && <i className="ri-time-line" />}
                          </div>
                          <div>
                            <p className="text-slate-200 text-xs">{task.name}</p>
                            <p className="text-[10px] text-slate-500">计划 {task.planStart} - {task.planEnd}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width: `${task.planProgress}%`, background: '#00d4ff' }} />
                          </div>
                          <span className="text-[10px] font-mono" style={{ color: '#00d4ff' }}>{task.planProgress}%</span>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width: `${task.actualProgress}%`, background: statusColor }} />
                          </div>
                          <span className="text-[10px] font-mono" style={{ color: statusColor }}>{task.actualProgress}%</span>
                          {task.warning && (
                            <span className="text-[10px] px-1 rounded" style={{ color: '#ff4757', background: 'rgba(255,71,87,0.12)' }}>{task.warning}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        {task.status === 'done' && <span className="text-[10px]" style={{ color: '#00e5c8' }}>已完成</span>}
                        {task.status === 'doing' && <span className="text-[10px]" style={{ color: '#00d4ff' }}>进行中</span>}
                        {task.status === 'warning' && <span className="text-[10px]" style={{ color: '#ff4757' }}>延期</span>}
                        {task.status === 'pending' && <span className="text-[10px] text-slate-500">未开始</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}