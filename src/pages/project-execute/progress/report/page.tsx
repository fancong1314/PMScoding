import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getProjectProgressById, type WBSTask, type ProgressReport } from '@/mocks/wbsDecompositionMocks';

function ProgressReportModal({
  isOpen,
  onClose,
  tasks,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  tasks: WBSTask[];
  onSubmit: (data: Record<string, string>) => void;
}) {
  const leafTasks = tasks.filter((t) => t.taskType === 'leaf');
  const [form, setForm] = useState({ taskId: '', actualStartDate: '', actualEndDate: '', progress: '', isDelayed: '否', delayReason: '', solution: '', progressDesc: '' });
  const selectedTask = leafTasks.find((t) => t.id === form.taskId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">新增进度汇报</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-steel-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-steel-500 mb-1 block">任务名称 <span className="text-red-500">*</span></label>
            <select value={form.taskId} onChange={(e) => setForm((p) => ({ ...p, taskId: e.target.value }))} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 bg-white">
              <option value="">请选择叶子任务</option>
              {leafTasks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          {selectedTask && (
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-steel-600 space-y-1">
              <div>计划时间：{selectedTask.planStartDate} ~ {selectedTask.planEndDate}</div>
              <div>当前实际进度：{selectedTask.actualProgress}%</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-steel-500 mb-1 block">实际开始日期 <span className="text-red-500">*</span></label>
              <input type="date" value={form.actualStartDate} onChange={(e) => setForm((p) => ({ ...p, actualStartDate: e.target.value }))} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs text-steel-500 mb-1 block">实际结束日期</label>
              <input type="date" value={form.actualEndDate} onChange={(e) => setForm((p) => ({ ...p, actualEndDate: e.target.value }))} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">实际进度(%) <span className="text-red-500">*</span></label>
            <input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm((p) => ({ ...p, progress: e.target.value }))} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500" placeholder="0-100" />
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">是否延误 <span className="text-red-500">*</span></label>
            <select value={form.isDelayed} onChange={(e) => setForm((p) => ({ ...p, isDelayed: e.target.value }))} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 bg-white">
              <option value="否">否</option>
              <option value="是">是</option>
            </select>
          </div>
          {form.isDelayed === '是' && (
            <>
              <div>
                <label className="text-xs text-steel-500 mb-1 block">延误原因 <span className="text-red-500">*</span></label>
                <textarea value={form.delayReason} onChange={(e) => setForm((p) => ({ ...p, delayReason: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none" placeholder="请描述延误原因" />
              </div>
              <div>
                <label className="text-xs text-steel-500 mb-1 block">解决方法</label>
                <textarea value={form.solution} onChange={(e) => setForm((p) => ({ ...p, solution: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none" placeholder="请描述解决方法" />
              </div>
            </>
          )}
          <div>
            <label className="text-xs text-steel-500 mb-1 block">进度说明</label>
            <textarea value={form.progressDesc} onChange={(e) => setForm((p) => ({ ...p, progressDesc: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none" placeholder="请描述进度情况" />
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">附件</label>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-steel-600 border border-steel-200 border-dashed rounded-md hover:bg-slate-50 cursor-pointer">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-2-line text-xs" /></div>
              点击上传附件
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-steel-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button onClick={() => form.taskId && form.actualStartDate && form.progress && onSubmit(form)} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>提交</button>
        </div>
      </div>
    </div>
  );
}

function ReportRecordModal({ isOpen, onClose, taskName, reports }: { isOpen: boolean; onClose: () => void; taskName: string; reports: ProgressReport[]; }) {
  const [detailReport, setDetailReport] = useState<ProgressReport | null>(null);
  if (!isOpen) return null;

  if (detailReport) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => setDetailReport(null)} />
        <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
            <h3 className="text-base font-semibold text-steel-800">汇报详情</h3>
            <button onClick={() => setDetailReport(null)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-steel-500" /></button>
          </div>
          <div className="p-5 space-y-3">
            {[['任务名称', detailReport.taskName], ['汇报人', detailReport.reporter], ['汇报时间', detailReport.reportTime], ['实际开始日期', detailReport.actualStartDate], ['实际结束日期', detailReport.actualEndDate ?? '-'], ['实际进度', `${detailReport.afterProgress}%`], ['是否延误', detailReport.isDelayed ? '是' : '否'], ['延误原因', detailReport.delayReason || '-'], ['解决方法', detailReport.solution || '-'], ['进度说明', detailReport.progressDesc || '-']].map(([label, val]) => (
              <div key={label} className="flex gap-4">
                <span className="text-xs text-steel-500 w-20 flex-shrink-0">{label}</span>
                <span className="text-sm text-steel-800">{val}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end px-5 py-3 border-t border-steel-100">
            <button onClick={() => setDetailReport(null)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">关闭</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">汇报记录 - {taskName}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-steel-500" /></button>
        </div>
        <div className="p-5">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                {['序号', '汇报人', '汇报时间', '汇报前进度', '汇报后进度', '当前计划进度', '是否延误', '操作'].map((h) => (
                  <th key={h} className="px-3 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-xs text-steel-500">{idx + 1}</td>
                  <td className="px-3 py-2 text-xs text-steel-700">{r.reporter}</td>
                  <td className="px-3 py-2 text-xs text-steel-600 whitespace-nowrap">{r.reportTime}</td>
                  <td className="px-3 py-2 text-xs text-steel-700">{r.beforeProgress}%</td>
                  <td className="px-3 py-2 text-xs font-medium text-emerald-700">{r.afterProgress}%</td>
                  <td className="px-3 py-2 text-xs text-steel-600">{r.currentPlanProgress}%</td>
                  <td className="px-3 py-2"><span className={`text-xs font-medium ${r.isDelayed ? 'text-red-600' : 'text-emerald-600'}`}>{r.isDelayed ? '是' : '否'}</span></td>
                  <td className="px-3 py-2"><button onClick={() => setDetailReport(r)} className="text-xs text-blue-600 hover:underline cursor-pointer">详情</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end px-5 py-3 border-t border-steel-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">关闭</button>
        </div>
      </div>
    </div>
  );
}

export default function ProgressReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? 'wbs_001';
  const projectName = searchParams.get('name') ?? '项目名称';
  const approvalNo = searchParams.get('approvalNo') ?? '';

  const project = getProjectProgressById(projectId);
  const [reports, setReports] = useState<ProgressReport[]>(project?.progressReports ?? []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [recordModal, setRecordModal] = useState<{ task: WBSTask; reports: ProgressReport[] } | null>(null);

  const tasks = project?.tasks ?? [];
  const leafTasks = tasks.filter((t) => t.taskType === 'leaf');

  const planProgress = useMemo(() => {
    if (!leafTasks.length) return 0;
    return Math.round(leafTasks.reduce((s, t) => s + t.planProgress, 0) / leafTasks.length);
  }, [leafTasks]);

  const actualProgress = useMemo(() => {
    if (!leafTasks.length) return 0;
    return Math.round(leafTasks.reduce((s, t) => s + (t.actualProgress ?? 0), 0) / leafTasks.length);
  }, [leafTasks]);

  const visibleTasks = useMemo(() => {
    const result: WBSTask[] = [];
    tasks.forEach((t) => {
      if (t.level === 1) {
        result.push(t);
        tasks.forEach((c) => {
          if (c.parentId === t.id) {
            result.push(c);
            tasks.forEach((g) => {
              if (g.parentId === c.id) result.push(g);
            });
          }
        });
      }
    });
    return result;
  }, [tasks]);

  const handleAddReport = (data: Record<string, string>) => {
    const task = tasks.find((t) => t.id === data.taskId);
    if (!task) return;
    const before = task.actualProgress ?? 0;
    const after = Number(data.progress);
    const delayed = data.isDelayed === '是';
    const now = new Date().toISOString().substring(0, 10);
    const r: ProgressReport = {
      id: `new-pr-${Date.now()}`,
      taskId: data.taskId,
      taskName: task.name,
      reporter: '张施工',
      reportTime: now + ' 10:00:00',
      beforeProgress: before,
      afterProgress: after,
      planStartDate: task.planStartDate,
      planEndDate: task.planEndDate,
      currentPlanProgress: task.planProgress,
      isDelayed: delayed,
      delayReason: data.delayReason,
      solution: data.solution,
      progressDesc: data.progressDesc,
      actualStartDate: data.actualStartDate,
      actualEndDate: data.actualEndDate,
      attachments: [],
    };
    setReports((prev) => [r, ...prev]);
    setShowAddModal(false);
  };

  const levelBg = (level: number) => level === 1 ? 'bg-amber-50/40' : level === 2 ? 'bg-blue-50/30' : 'bg-white';
  const levelPad = (level: number) => level === 1 ? '' : level === 2 ? 'pl-6' : 'pl-12';

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/project-execute/progress')} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 hover:bg-slate-50 cursor-pointer">
            <i className="ri-arrow-left-s-line text-steel-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-steel-900">项目进度汇报</h1>
            <p className="text-xs text-steel-400">{projectName}（{approvalNo}）</p>
          </div>
        </div>

        {/* Project info bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3">
          <div className="flex items-center gap-6 flex-wrap">
            <div><span className="text-xs text-steel-500">立项号：</span><span className="text-sm font-mono text-steel-700">{approvalNo}</span></div>
            <div><span className="text-xs text-steel-500">项目名称：</span><span className="text-sm font-medium text-steel-800">{projectName}</span></div>
            <div><span className="text-xs text-steel-500">项目经理：</span><span className="text-sm text-steel-700">{project?.projectManager ?? '张明远'}</span></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500">整体进度：</span>
              <div className="w-28 h-2 bg-steel-100 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-blue-200 rounded-full" style={{ width: `${planProgress}%` }} />
                <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full" style={{ width: `${actualProgress}%` }} />
              </div>
              <span className="text-xs text-steel-500">计划{planProgress}% / 实际{actualProgress}%</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-xs" /></div>
            新增汇报
          </button>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-steel-100">
            <span className="text-sm font-medium text-steel-700">WBS任务进度</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 1100 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  {['序号', '任务名称', '任务层级', '类型', '权重(%)', '计划开始', '计划结束', '实际开始', '实际结束', '计划进度', '实际进度', '是否延误'].map((h) => (
                    <th key={h} className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">{h}</th>
                  ))}
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-steel-50 text-center" style={{ minWidth: 130, borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((task, idx) => (
                  <tr key={task.id} className={`${levelBg(task.level)} hover:bg-slate-50/60`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-3 py-2.5 text-xs text-steel-500 whitespace-nowrap">{idx + 1}</td>
                    <td className={`px-3 py-2.5 text-sm text-steel-800 font-medium whitespace-nowrap ${levelPad(task.level)}`}>{task.name}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${task.level === 1 ? 'bg-amber-100 text-amber-700' : task.level === 2 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{task.level}级</span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {task.taskType === 'leaf'
                        ? <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-1.5 py-0.5">可汇报</span>
                        : <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5">自动汇总</span>}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono text-steel-700 whitespace-nowrap">{task.weight}%</td>
                    <td className="px-3 py-2.5 text-xs text-steel-600 whitespace-nowrap">{task.planStartDate}</td>
                    <td className="px-3 py-2.5 text-xs text-steel-600 whitespace-nowrap">{task.planEndDate}</td>
                    <td className="px-3 py-2.5 text-xs text-steel-600 whitespace-nowrap">{task.actualStartDate ?? '-'}</td>
                    <td className="px-3 py-2.5 text-xs text-steel-600 whitespace-nowrap">{task.actualEndDate ?? '-'}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-steel-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${task.planProgress}%` }} />
                        </div>
                        <span className="text-xs font-mono text-steel-600">{task.planProgress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-steel-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${task.isDelayed ? 'bg-red-400' : 'bg-emerald-500'}`} style={{ width: `${task.actualProgress}%` }} />
                        </div>
                        <span className={`text-xs font-mono ${task.isDelayed ? 'text-red-500' : 'text-emerald-600'}`}>{task.actualProgress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {task.isDelayed
                        ? <span className="inline-flex items-center gap-0.5 text-xs text-red-600 font-medium"><i className="ri-alarm-warning-line text-xs" />是</span>
                        : <span className="text-xs text-emerald-600">否</span>}
                    </td>
                    <td className="px-3 py-2.5 text-center whitespace-nowrap sticky right-0 bg-white z-10" style={{ borderLeft: '1px solid #e8edf3' }}>
                      <div className="flex items-center justify-center gap-1">
                        {task.taskType === 'leaf' && (
                          <button onClick={() => setRecordModal({ task, reports: reports.filter((r) => r.taskId === task.id) })} className="px-2 py-0.5 text-xs text-blue-700 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer">汇报记录</button>
                        )}
                        <button className="px-2 py-0.5 text-xs text-steel-600 bg-slate-100 rounded hover:bg-slate-200 cursor-pointer">详情</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ProgressReportModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} tasks={tasks} onSubmit={handleAddReport} />
        {recordModal && (
          <ReportRecordModal isOpen={true} onClose={() => setRecordModal(null)} taskName={recordModal.task.name} reports={recordModal.reports} />
        )}
      </div>
    </Layout>
  );
}