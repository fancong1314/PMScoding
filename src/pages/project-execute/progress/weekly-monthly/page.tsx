import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getProjectProgressById, type WeeklyReport, type MonthlyReport } from '@/mocks/wbsDecompositionMocks';

function AddReportModal({
  type,
  projectName,
  isOpen,
  onClose,
  onSubmit,
}: {
  type: 'weekly' | 'monthly';
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
}) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);
  const fmt = (d: Date) => d.toISOString().substring(0, 10);
  const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const monthEnd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const [form, setForm] = useState<Record<string, string>>({
    startDate: type === 'weekly' ? fmt(weekStart) : monthStart,
    endDate: type === 'weekly' ? fmt(weekEnd) : monthEnd,
    completedWork: '',
    nextPlan: '',
    problems: '',
    workVolume: '',
  });

  if (!isOpen) return null;
  const isWeekly = type === 'weekly';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">新增{isWeekly ? '周报' : '月报'}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-steel-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-3">
            <div><span className="text-xs text-steel-500">项目名称</span><p className="text-sm text-steel-800 font-medium">{projectName}</p></div>
            <div><span className="text-xs text-steel-500">汇报人</span><p className="text-sm text-steel-800">张施工</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-steel-500 mb-1 block">{isWeekly ? '本周' : '本月'}开始日期 <span className="text-red-500">*</span></label>
              <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs text-steel-500 mb-1 block">{isWeekly ? '本周' : '本月'}结束日期 <span className="text-red-500">*</span></label>
              <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">{isWeekly ? '本周' : '本月'}完成工作 <span className="text-red-500">*</span></label>
            <textarea value={form.completedWork} onChange={(e) => setForm((p) => ({ ...p, completedWork: e.target.value }))} rows={3} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none" placeholder="请描述本期完成的工作内容" />
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">{isWeekly ? '下周' : '下月'}工作计划</label>
            <textarea value={form.nextPlan} onChange={(e) => setForm((p) => ({ ...p, nextPlan: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none" placeholder="请描述下期工作计划" />
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">问题与风险</label>
            <textarea value={form.problems} onChange={(e) => setForm((p) => ({ ...p, problems: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none" placeholder="请描述存在的问题与风险" />
          </div>
          {!isWeekly && (
            <div>
              <label className="text-xs text-steel-500 mb-1 block">本月工程量完成情况</label>
              <textarea value={form.workVolume} onChange={(e) => setForm((p) => ({ ...p, workVolume: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none" placeholder="请描述本月工程量完成情况" />
            </div>
          )}
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
          <button onClick={() => form.completedWork.trim() && onSubmit(form)} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>提交</button>
        </div>
      </div>
    </div>
  );
}

function ReplyModal({ isOpen, onClose, report, type }: { isOpen: boolean; onClose: () => void; report: WeeklyReport | MonthlyReport | null; type: 'weekly' | 'monthly'; }) {
  const [replyContent, setReplyContent] = useState('');
  if (!isOpen || !report) return null;
  const isWeekly = 'weekStartDate' in report;
  const completedWork = isWeekly ? (report as WeeklyReport).completedWork : (report as MonthlyReport).completedWork;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">回复{type === 'weekly' ? '周报' : '月报'}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-steel-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-4">
              <div><span className="text-xs text-steel-500">汇报人：</span><span className="text-sm text-steel-700">{report.reporter}</span></div>
              <div><span className="text-xs text-steel-500">汇报时间：</span><span className="text-sm text-steel-700">{report.reportTime}</span></div>
            </div>
            <div>
              <span className="text-xs text-steel-500">{isWeekly ? '本周' : '本月'}完成工作：</span>
              <p className="text-sm text-steel-700 mt-1 line-clamp-3">{completedWork}</p>
            </div>
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">回复内容 <span className="text-red-500">*</span></label>
            <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none" placeholder="请输入回复内容" />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-steel-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button onClick={() => replyContent.trim() && onClose()} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>提交</button>
        </div>
      </div>
    </div>
  );
}

function LogModal({ isOpen, onClose, report }: { isOpen: boolean; onClose: () => void; report: WeeklyReport | MonthlyReport | null; }) {
  if (!isOpen || !report) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">操作日志</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-steel-500" /></button>
        </div>
        <div className="p-5">
          <div className="space-y-3">
            {report.logs.map((log, idx) => (
              <div key={log.id} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-700 flex-shrink-0">{idx + 1}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-steel-700">{log.operationType}</span>
                    <span className="text-xs text-steel-400">{log.operationTime}</span>
                  </div>
                  <p className="text-xs text-steel-500">操作人：{log.operator}</p>
                  <p className="text-sm text-steel-700 mt-1">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end px-5 py-3 border-t border-steel-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">关闭</button>
        </div>
      </div>
    </div>
  );
}

export default function WeeklyMonthlyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? 'wbs_001';
  const projectName = searchParams.get('name') ?? '项目名称';
  const approvalNo = searchParams.get('approvalNo') ?? 'LX-2026-001';
  const projectManager = '张明远';

  const project = getProjectProgressById(projectId);
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>(project?.weeklyReports ?? []);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>(project?.monthlyReports ?? []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | MonthlyReport | null>(null);

  const truncate = (s: string, n = 50) => s.length > n ? s.substring(0, n) + '...' : s;

  const handleAdd = (data: Record<string, string>) => {
    const now = new Date().toISOString().substring(0, 10);
    if (tab === 'weekly') {
      const r: WeeklyReport = {
        id: `new-w-${Date.now()}`,
        projectId,
        reporter: '张施工',
        reportTime: now,
        weekStartDate: data.startDate,
        weekEndDate: data.endDate,
        completedWork: data.completedWork,
        nextWeekPlan: data.nextPlan,
        problems: data.problems,
        attachments: [],
        replies: [],
        logs: [{ id: `nl-${Date.now()}`, operationType: '新增', operator: '张施工', operationTime: now, description: '新增周报' }],
      };
      setWeeklyReports((prev) => [r, ...prev]);
    } else {
      const r: MonthlyReport = {
        id: `new-m-${Date.now()}`,
        projectId,
        reporter: '张施工',
        reportTime: now,
        monthStartDate: data.startDate,
        monthEndDate: data.endDate,
        completedWork: data.completedWork,
        nextMonthPlan: data.nextPlan,
        problems: data.problems,
        workVolume: data.workVolume,
        attachments: [],
        replies: [],
        logs: [{ id: `nl-${Date.now()}`, operationType: '新增', operator: '张施工', operationTime: now, description: '新增月报' }],
      };
      setMonthlyReports((prev) => [r, ...prev]);
    }
    setShowAddModal(false);
  };

  const isWeekly = tab === 'weekly';

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/project-execute/progress')} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 hover:bg-slate-50 cursor-pointer">
            <i className="ri-arrow-left-s-line text-steel-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-steel-900">周报月报</h1>
            <p className="text-xs text-steel-400">{projectName}（{approvalNo}）</p>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3">
          <div className="flex items-center gap-6 flex-wrap">
            <div><span className="text-xs text-steel-500">立项号：</span><span className="text-sm font-mono text-steel-700">{approvalNo}</span></div>
            <div><span className="text-xs text-steel-500">项目名称：</span><span className="text-sm text-steel-800 font-medium">{projectName}</span></div>
            <div><span className="text-xs text-steel-500">项目经理：</span><span className="text-sm text-steel-700">{projectManager}</span></div>
          </div>
        </div>

        {/* Tabs + Actions */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-3 border-b border-steel-100">
            <div className="flex gap-4">
              <button onClick={() => setTab('weekly')} className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${tab === 'weekly' ? 'text-primary-600 border-primary-500' : 'text-steel-500 border-transparent hover:text-steel-700'}`}>周报</button>
              <button onClick={() => setTab('monthly')} className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${tab === 'monthly' ? 'text-primary-600 border-primary-500' : 'text-steel-500 border-transparent hover:text-steel-700'}`}>月报</button>
            </div>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 mb-3 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-xs" /></div>
              新增{isWeekly ? '周报' : '月报'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 900 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">汇报人</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">汇报时间</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">{isWeekly ? '本周开始日期' : '本月开始日期'}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">{isWeekly ? '本周结束日期' : '本月结束日期'}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 240 }}>{isWeekly ? '本周完成工作' : '本月完成工作'}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-steel-50 z-10 text-center" style={{ minWidth: 160, borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {(isWeekly ? weeklyReports : monthlyReports).map((r, idx) => {
                  const startDate = 'weekStartDate' in r ? r.weekStartDate : r.monthStartDate;
                  const endDate = 'weekEndDate' in r ? r.weekEndDate : r.monthEndDate;
                  const completedWork = 'completedWork' in r ? r.completedWork : '';
                  return (
                    <tr key={r.id} className="group hover:bg-slate-50" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{r.reporter}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{r.reportTime}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{startDate}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{endDate}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{truncate(completedWork, 50)}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10" style={{ borderLeft: '1px solid #e8edf3' }}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => { setSelectedReport(r); setShowReplyModal(true); }} className="px-2.5 py-1 text-xs text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 cursor-pointer">回复</button>
                          <button onClick={() => navigate(`/project-execute/progress/weekly-monthly/detail?id=${r.id}&projectId=${projectId}&type=${tab}&name=${encodeURIComponent(projectName)}&approvalNo=${encodeURIComponent(approvalNo)}`)} className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 cursor-pointer">详情</button>
                          <button onClick={() => { setSelectedReport(r); setShowLogModal(true); }} className="px-2.5 py-1 text-xs text-steel-600 bg-slate-100 rounded-md hover:bg-slate-200 cursor-pointer">操作日志</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <AddReportModal type={tab} projectName={projectName} isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAdd} />
        <ReplyModal isOpen={showReplyModal} onClose={() => setShowReplyModal(false)} report={selectedReport} type={tab} />
        <LogModal isOpen={showLogModal} onClose={() => setShowLogModal(false)} report={selectedReport} />
      </div>
    </Layout>
  );
}