import {
  OVERVIEW_LIFECYCLE_STAGES,
  getLifecycleStageIndex,
  type OverviewLifecycleStage,
} from '@/mocks/initiationOverviewMocks';

interface Props {
  current: OverviewLifecycleStage;
}

export default function LifecycleStepper({ current }: Props) {
  const currentIdx = Math.max(0, getLifecycleStageIndex(current));

  return (
    <div className="bg-white rounded-xl border border-steel-200 px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-steel-800">项目阶段进度</h2>
          <p className="text-xs text-steel-400 mt-0.5">可视化展示当前项目所处生命周期节点</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
          <i className="ri-focus-3-line" />
          当前：{OVERVIEW_LIFECYCLE_STAGES[currentIdx]?.label || '已立项'}
        </span>
      </div>

      <div className="relative px-2">
        <div className="absolute top-5 left-8 right-8 h-1 rounded-full bg-slate-100" />
        <div
          className="absolute top-5 left-8 h-1 rounded-full transition-all duration-500"
          style={{
            width: `calc(${(currentIdx / Math.max(1, OVERVIEW_LIFECYCLE_STAGES.length - 1)) * 100}% - 0px)`,
            maxWidth: 'calc(100% - 4rem)',
            background: 'linear-gradient(90deg, #0ea5e9, #0284c7)',
          }}
        />
        <div className="relative flex justify-between gap-2">
          {OVERVIEW_LIFECYCLE_STAGES.map((stage, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            const pending = idx > currentIdx;
            return (
              <div key={stage.key} className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    active
                      ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-200 scale-105'
                      : done
                        ? 'bg-sky-50 border-sky-400 text-sky-600'
                        : 'bg-white border-slate-200 text-slate-300'
                  }`}
                >
                  {done ? (
                    <i className="ri-check-line text-lg" />
                  ) : (
                    <i className={`${stage.icon} text-base`} />
                  )}
                </div>
                <div className="mt-2.5 text-center px-0.5">
                  <p className={`text-[11px] font-semibold leading-tight ${
                    active ? 'text-sky-700' : done ? 'text-steel-700' : 'text-steel-400'
                  }`}>
                    {stage.label}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${
                    pending ? 'text-steel-300' : active ? 'text-sky-500' : 'text-emerald-500'
                  }`}>
                    {done ? '已完成' : active ? '进行中' : '未开始'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
