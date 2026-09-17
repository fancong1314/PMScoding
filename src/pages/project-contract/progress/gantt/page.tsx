import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getContractById } from '@/mocks/contractProgressMocks';
import type { WBSTask } from '@/mocks/contractProgressMocks';

type TimeDimension = 'quarter' | 'month' | 'week' | 'day';

function GanttBar({
  task,
  start,
  end,
  currentDate,
}: {
  task: WBSTask;
  start: Date;
  end: Date;
  currentDate: Date;
}) {
  const total = end.getTime() - start.getTime();
  const planStart = new Date(task.planStartDate).getTime();
  const planEnd = new Date(task.planEndDate).getTime();
  const planLeft = Math.max(0, (planStart - start.getTime()) / total) * 100;
  const planWidth = Math.max(1, ((planEnd - planStart) / total) * 100);
  const planActualWidth = planWidth * (task.planProgress / 100);

  const actualStart = task.actualStartDate ? new Date(task.actualStartDate).getTime() : planStart;
  const actualEnd = task.actualEndDate
    ? new Date(task.actualEndDate).getTime()
    : Math.min(currentDate.getTime(), planEnd);
  const actualLeft = Math.max(0, (actualStart - start.getTime()) / total) * 100;
  const actualDuration = Math.max(0, actualEnd - actualStart);
  const actualWidth = Math.max(1, (actualDuration / total) * 100);
  const actualActualWidth = actualWidth * (task.actualProgress / 100);

  return (
    <div className="relative h-6 flex flex-col gap-0.5 justify-center">
      {/* Plan bar background track */}
      <div className="relative h-2">
        <div
          className="absolute top-0 h-full bg-steel-100 rounded"
          style={{ left: `${planLeft}%`, width: `${planWidth}%` }}
        />
        <div
          className="absolute top-0 h-full bg-blue-300 rounded"
          style={{ left: `${planLeft}%`, width: `${planActualWidth}%` }}
        />
      </div>
      {/* Actual bar */}
      <div className="relative h-2">
        <div
          className="absolute top-0 h-full bg-steel-100 rounded"
          style={{ left: `${actualLeft}%`, width: `${actualWidth}%` }}
        />
        <div
          className={`absolute top-0 h-full rounded ${task.isDelayed ? 'bg-red-400' : 'bg-emerald-500'}`}
          style={{ left: `${actualLeft}%`, width: `${actualActualWidth}%` }}
        />
      </div>
    </div>
  );
}

export default function ContractGanttPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId') ?? '';
  const contract = getContractById(contractId);

  const [dimension, setDimension] = useState<TimeDimension>('month');
  const [hoveredTask, setHoveredTask] = useState<WBSTask | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    (contract?.wbsTasks ?? []).forEach((t) => {
      if (t.level === 1) ids.add(t.id);
    });
    return ids;
  });

  const tasks = contract?.wbsTasks ?? [];

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visibleTasks = useMemo(() => {
    const result: WBSTask[] = [];
    tasks.forEach((t) => {
      if (t.level === 1) {
        result.push(t);
        if (expandedIds.has(t.id)) {
          tasks.forEach((c) => {
            if (c.parentId === t.id) {
              result.push(c);
              if (c.taskType === 'summary' && expandedIds.has(c.id)) {
                tasks.forEach((g) => {
                  if (g.parentId === c.id) result.push(g);
                });
              }
            }
          });
        }
      }
    });
    return result;
  }, [tasks, expandedIds]);

  // Date range
  const allPlanDates = tasks.flatMap((t) => [new Date(t.planStartDate), new Date(t.planEndDate)]);
  const minDate =
    allPlanDates.length > 0
      ? new Date(Math.min(...allPlanDates.map((d) => d.getTime())))
      : new Date('2026-01-01');
  const maxDate =
    allPlanDates.length > 0
      ? new Date(Math.max(...allPlanDates.map((d) => d.getTime())))
      : new Date('2026-12-31');

  const startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
  const currentDate = new Date('2026-07-28');

  // Time columns
  const timeColumns = useMemo(() => {
    const cols: { label: string; date: Date }[] = [];
    if (dimension === 'month') {
      let d = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (d <= endDate) {
        cols.push({ label: `${d.getMonth() + 1}月`, date: new Date(d) });
        d.setMonth(d.getMonth() + 1);
      }
    } else if (dimension === 'quarter') {
      let year = startDate.getFullYear();
      let quarter = Math.floor(startDate.getMonth() / 3);
      const endYear = endDate.getFullYear();
      const endQuarter = Math.floor(endDate.getMonth() / 3);
      while (year < endYear || (year === endYear && quarter <= endQuarter)) {
        cols.push({ label: `Q${quarter + 1}`, date: new Date(year, quarter * 3, 1) });
        quarter += 1;
        if (quarter > 3) { quarter = 0; year += 1; }
      }
    } else if (dimension === 'week') {
      let d = new Date(startDate);
      let weekNum = 1;
      while (d <= endDate) {
        cols.push({ label: `第${weekNum}周`, date: new Date(d) });
        d.setDate(d.getDate() + 7);
        weekNum += 1;
      }
    } else {
      let d = new Date(startDate);
      while (d <= endDate) {
        cols.push({ label: `${d.getDate()}`, date: new Date(d) });
        d.setDate(d.getDate() + 1);
      }
    }
    return cols;
  }, [dimension, startDate.toISOString(), endDate.toISOString()]);

  const colWidth = dimension === 'quarter' ? 140 : dimension === 'month' ? 100 : dimension === 'week' ? 80 : 40;

  const levelBg = (level: number) =>
    level === 1 ? 'bg-amber-50/50' : level === 2 ? 'bg-blue-50/30' : 'bg-white';

  if (!contract) {
    return (
      <Layout>
        <div className="py-16 text-center text-steel-400 text-sm">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-steel-300">
            <i className="ri-inbox-line text-3xl" />
          </div>
          未找到合同信息
        </div>
      </Layout>
    );
  }

  return (
    <Layout mainClassName="flex-1 p-5 overflow-hidden">
      <div className="space-y-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 hover:bg-slate-50 cursor-pointer"
          >
            <i className="ri-arrow-left-s-line text-steel-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-steel-900">进度横道图</h1>
            <p className="text-xs text-steel-400">
              {contract.contractName}（{contract.contractNo}）
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3 flex items-center gap-4 flex-shrink-0 flex-wrap">
          <span className="text-xs text-steel-500 whitespace-nowrap">时间维度</span>
          <div className="flex rounded-md overflow-hidden border border-steel-200">
            {(['quarter', 'month', 'week', 'day'] as TimeDimension[]).map((d) => (
              <button
                key={d}
                onClick={() => setDimension(d)}
                className={`px-3 py-1.5 text-xs cursor-pointer transition-colors whitespace-nowrap ${
                  dimension === d ? 'text-white' : 'text-steel-600 hover:bg-slate-50'
                }`}
                style={
                  dimension === d
                    ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }
                    : undefined
                }
              >
                {d === 'quarter' ? '季度' : d === 'month' ? '月' : d === 'week' ? '周' : '日'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-steel-500 ml-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-2 bg-blue-300 rounded" />
              <span>计划进度</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-2 bg-emerald-500 rounded" />
              <span>实际进度</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-2 bg-red-400 rounded" />
              <span>延误</span>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 bg-white rounded-lg border border-steel-200 overflow-hidden flex flex-col min-h-0">
          <div className="flex overflow-auto flex-1">
            {/* Left: task names (fixed) */}
            <div className="flex-shrink-0 border-r border-steel-200" style={{ minWidth: 280 }}>
              <div className="h-10 bg-steel-50 flex items-center px-4 text-xs font-semibold text-steel-500 border-b border-steel-200">
                任务名称
              </div>
              {visibleTasks.map((task) => {
                const hasChildren = tasks.some((t) => t.parentId === task.id);
                const isExpanded = expandedIds.has(task.id);
                const pad =
                  task.level === 1 ? 'pl-3' : task.level === 2 ? 'pl-8' : 'pl-14';
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-1.5 px-2 text-sm text-steel-800 border-b border-steel-100 ${levelBg(task.level)} ${pad}`}
                    style={{ height: 52 }}
                  >
                    {hasChildren ? (
                      <button
                        onClick={() => toggleExpand(task.id)}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer flex-shrink-0"
                      >
                        <i
                          className={`${
                            isExpanded ? 'ri-subtract-line' : 'ri-add-line'
                          } text-xs text-steel-500`}
                        />
                      </button>
                    ) : (
                      <div className="w-5 h-5 flex-shrink-0" />
                    )}
                    {task.taskType === 'leaf' ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1 flex-shrink-0">
                        叶
                      </span>
                    ) : (
                      <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 rounded px-1 flex-shrink-0">
                        汇
                      </span>
                    )}
                    <span className="truncate text-xs">{task.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Right: Gantt bars */}
            <div className="flex-1 overflow-x-auto">
              {/* Header */}
              <div
                className="flex h-10 bg-steel-50 border-b border-steel-200"
                style={{ minWidth: timeColumns.length * colWidth }}
              >
                {timeColumns.map((col) => (
                  <div
                    key={col.label}
                    className="flex-shrink-0 h-full flex items-center justify-center text-xs font-semibold text-steel-500 border-r border-steel-100 last:border-r-0"
                    style={{ width: colWidth }}
                  >
                    {col.label}
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div style={{ minWidth: timeColumns.length * colWidth }}>
                {visibleTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`relative border-b border-steel-100 ${levelBg(task.level)}`}
                    style={{ height: 52 }}
                    onMouseEnter={(e) => {
                      setHoveredTask(task);
                      setHoverPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setHoverPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {timeColumns.map((col) => (
                        <div
                          key={col.label}
                          className="flex-shrink-0 border-r border-steel-100/60"
                          style={{ width: colWidth }}
                        />
                      ))}
                    </div>

                    {/* Today line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-400/60 z-10 pointer-events-none"
                      style={{
                        left: `${Math.max(
                          0,
                          Math.min(
                            100,
                            ((currentDate.getTime() - startDate.getTime()) /
                              (endDate.getTime() - startDate.getTime())) *
                              100,
                          ),
                        )}%`,
                      }}
                    />

                    {/* Bar */}
                    <div className="absolute inset-x-0" style={{ top: 8, height: 36 }}>
                      <GanttBar
                        task={task}
                        start={startDate}
                        end={endDate}
                        currentDate={currentDate}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hover tooltip */}
        {hoveredTask && (
          <div
            className="fixed z-50 bg-white border border-steel-200 rounded-lg shadow-lg p-3 text-xs text-steel-700 pointer-events-none"
            style={{
              left: Math.min(hoverPos.x + 15, window.innerWidth - 260),
              top: Math.max(hoverPos.y - 10, 60),
              minWidth: 220,
            }}
          >
            <div className="font-semibold text-steel-800 mb-1.5 text-sm">{hoveredTask.name}</div>
            <div className="space-y-1">
              <div>
                类型：
                {hoveredTask.taskType === 'leaf'
                  ? '叶子节点（可汇报）'
                  : '汇总节点（自动汇总）'}
              </div>
              <div>计划进度：{hoveredTask.planProgress}%</div>
              <div>实际进度：{hoveredTask.actualProgress}%</div>
              <div>是否延误：{hoveredTask.isDelayed ? '是' : '否'}</div>
              <div>
                计划时间：{hoveredTask.planStartDate} ~ {hoveredTask.planEndDate}
              </div>
              {hoveredTask.actualStartDate && (
                <div>
                  实际开始：{hoveredTask.actualStartDate}
                  {hoveredTask.actualEndDate ? ` ~ ${hoveredTask.actualEndDate}` : '（进行中）'}
                </div>
              )}
              {hoveredTask.isDelayed && hoveredTask.delayReason && (
                <div className="mt-1 pt-1 border-t border-steel-100 text-red-600">
                  延误原因：{hoveredTask.delayReason}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}