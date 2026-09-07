import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getProjectProgressById, type WeeklyReport, type MonthlyReport } from '@/mocks/wbsDecompositionMocks';

export default function ReportDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id') ?? '';
  const projectId = searchParams.get('projectId') ?? '';
  const type = searchParams.get('type') === 'monthly' ? 'monthly' : 'weekly';
  const projectName = searchParams.get('name') ?? '项目名称';
  const approvalNo = searchParams.get('approvalNo') ?? '';

  const project = getProjectProgressById(projectId);
  const report = type === 'weekly'
    ? project?.weeklyReports.find((r) => r.id === reportId) ?? project?.weeklyReports[0]
    : project?.monthlyReports.find((r) => r.id === reportId) ?? project?.monthlyReports[0];

  const isWeekly = type === 'weekly';

  if (!report) {
    return (
      <Layout>
        <div className="text-center py-8 text-steel-400">暂无数据</div>
      </Layout>
    );
  }

  const startDate = isWeekly ? (report as WeeklyReport).weekStartDate : (report as MonthlyReport).monthStartDate;
  const endDate = isWeekly ? (report as WeeklyReport).weekEndDate : (report as MonthlyReport).monthEndDate;
  const completedWork = report.completedWork;
  const nextPlan = isWeekly ? (report as WeeklyReport).nextWeekPlan : (report as MonthlyReport).nextMonthPlan;
  const problems = report.problems;
  const workVolume = !isWeekly ? (report as MonthlyReport).workVolume : '';

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/project-execute/progress/weekly-monthly?id=${projectId}&name=${encodeURIComponent(projectName)}&approvalNo=${encodeURIComponent(approvalNo)}`)} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 hover:bg-slate-50 cursor-pointer">
            <i className="ri-arrow-left-s-line text-steel-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-steel-900">{isWeekly ? '周报' : '月报'}详情</h1>
            <p className="text-xs text-steel-400">{projectName}（{approvalNo}）</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 p-5 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded p-3">
              <span className="text-xs text-steel-500">项目名称</span>
              <p className="text-sm text-steel-800 font-medium mt-1">{projectName}</p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <span className="text-xs text-steel-500">汇报人</span>
              <p className="text-sm text-steel-800 mt-1">{report.reporter}</p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <span className="text-xs text-steel-500">汇报时间</span>
              <p className="text-sm text-steel-800 mt-1">{report.reportTime}</p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <span className="text-xs text-steel-500">{isWeekly ? '本周' : '本月'}开始日期</span>
              <p className="text-sm text-steel-800 mt-1">{startDate}</p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <span className="text-xs text-steel-500">{isWeekly ? '本周' : '本月'}结束日期</span>
              <p className="text-sm text-steel-800 mt-1">{endDate}</p>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-steel-600 block mb-2">{isWeekly ? '本周' : '本月'}完成工作</span>
            <div className="bg-slate-50 rounded p-3 text-sm text-steel-700">{completedWork}</div>
          </div>
          {nextPlan && (
            <div>
              <span className="text-xs font-medium text-steel-600 block mb-2">{isWeekly ? '下周' : '下月'}工作计划</span>
              <div className="bg-slate-50 rounded p-3 text-sm text-steel-700">{nextPlan}</div>
            </div>
          )}
          {problems && (
            <div>
              <span className="text-xs font-medium text-steel-600 block mb-2">问题与风险</span>
              <div className="bg-slate-50 rounded p-3 text-sm text-steel-700">{problems}</div>
            </div>
          )}
          {!isWeekly && workVolume && (
            <div>
              <span className="text-xs font-medium text-steel-600 block mb-2">本月工程量完成情况</span>
              <div className="bg-slate-50 rounded p-3 text-sm text-steel-700">{workVolume}</div>
            </div>
          )}
          {report.attachments.length > 0 && (
            <div>
              <span className="text-xs font-medium text-steel-600 block mb-2">附件</span>
              <div className="flex flex-wrap gap-2">
                {report.attachments.map((att) => (
                  <button key={att} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-blue-100">
                    <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-download-line text-xs" /></div>
                    {att}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reply records */}
        {report.replies.length > 0 && (
          <div className="bg-white rounded-lg border border-steel-200 p-5">
            <h3 className="text-sm font-medium text-steel-700 mb-4">回复记录</h3>
            <div className="space-y-3">
              {report.replies.map((reply) => (
                <div key={reply.id} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-steel-700">{reply.replier}</span>
                    <span className="text-xs text-steel-400">{reply.replyTime}</span>
                  </div>
                  <p className="text-sm text-steel-600">{reply.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}