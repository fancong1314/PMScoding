import Layout from '@/components/feature/Layout';
import { useSearchParams } from 'react-router-dom';
import { getContractById, getWeeklyReportById, getMonthlyReportById } from '@/mocks/contractProgressMocks';

export default function ReportDetailPage() {
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId') ?? '';
  const reportId = searchParams.get('reportId') ?? '';
  const type = searchParams.get('type') ?? 'weekly';

  const contract = getContractById(contractId);
  const report = type === 'weekly'
    ? getWeeklyReportById(contractId, reportId)
    : getMonthlyReportById(contractId, reportId);

  if (!contract || !report) {
    return (
      <Layout>
      <div className="py-12 text-center text-steel-400 text-sm">
        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-steel-300">
          <i className="ri-inbox-line text-3xl" />
        </div>
        未找到报告信息
      </div>
      </Layout>
    );
  }

  const isWeekly = type === 'weekly';
  const wReport = isWeekly ? report as { weekStartDate: string; weekEndDate: string; nextWeekPlan: string } : null;
  const mReport = !isWeekly ? report as { monthStartDate: string; monthEndDate: string; nextMonthPlan: string; workVolume: string } : null;

  return (
    <Layout>
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-steel-800">
            <div className="w-5 h-5 flex items-center justify-center inline-flex mr-1 text-primary-500">
              <i className="ri-file-text-line text-sm" />
            </div>
            {isWeekly ? '周报详情' : '月报详情'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-steel-500">合同名称</span>
            <span className="text-sm font-medium text-steel-800">{contract.contractName}</span>
            <span className="text-xs text-steel-400 mx-2">|</span>
            <span className="text-xs text-steel-500">合同编号</span>
            <span className="text-sm font-medium text-steel-700">{contract.contractNo}</span>
          </div>
        </div>
      </div>

      {/* Detail Info */}
      <div className="bg-white rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-steel-500">汇报人</span>
            <span className="text-sm font-medium text-steel-800">{report.reporter}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-steel-500">汇报时间</span>
            <span className="text-sm font-medium text-steel-800">{report.reportTime}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-steel-500">{isWeekly ? '本周开始日期' : '本月开始日期'}</span>
            <span className="text-sm font-medium text-steel-800">{isWeekly ? wReport?.weekStartDate : mReport?.monthStartDate}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-steel-500">{isWeekly ? '本周结束日期' : '本月结束日期'}</span>
            <span className="text-sm font-medium text-steel-800">{isWeekly ? wReport?.weekEndDate : mReport?.monthEndDate}</span>
          </div>
          {!isWeekly && mReport && (
            <div className="flex flex-col gap-1 lg:col-span-3">
              <span className="text-xs text-steel-500">本月工程量完成情况</span>
              <span className="text-sm text-steel-800">{mReport.workVolume}</span>
            </div>
          )}
        </div>

        <div className="space-y-4" style={{ borderTop: '1px solid #e8edf3' }}>
          <div className="pt-4">
            <h4 className="text-sm font-medium text-steel-800 mb-2">
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1 text-emerald-500">
                <i className="ri-checkbox-circle-line text-xs" />
              </div>
              {isWeekly ? '本周完成工作' : '本月完成工作'}
            </h4>
            <div className="bg-slate-50 rounded-md p-3 text-sm text-steel-700 leading-relaxed">{report.completedWork}</div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium text-steel-800 mb-2">
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1 text-blue-500">
                <i className="ri-calendar-check-line text-xs" />
              </div>
              {isWeekly ? '下周工作计划' : '下月工作计划'}
            </h4>
            <div className="bg-slate-50 rounded-md p-3 text-sm text-steel-700 leading-relaxed">
              {isWeekly ? wReport?.nextWeekPlan : mReport?.nextMonthPlan}
            </div>
          </div>

          {report.problems && (
            <div className="pt-2">
              <h4 className="text-sm font-medium text-steel-800 mb-2">
                <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1 text-red-500">
                  <i className="ri-error-warning-line text-xs" />
                </div>
                问题与风险
              </h4>
              <div className="bg-red-50 rounded-md p-3 text-sm text-red-700 leading-relaxed">{report.problems}</div>
            </div>
          )}

          {/* Attachments */}
          {report.attachments.length > 0 && (
            <div className="pt-2">
              <h4 className="text-sm font-medium text-steel-800 mb-2">
                <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1 text-steel-500">
                  <i className="ri-attachment-line text-xs" />
                </div>
                附件
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.attachments.map((att, idx) => (
                  <button
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-file-download-line text-xs" />
                    </div>
                    {att}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {report.replies.length > 0 && (
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-sm font-semibold text-steel-800 mb-3">
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1 text-primary-500">
              <i className="ri-chat-1-line text-xs" />
            </div>
            回复记录
          </h3>
          <div className="space-y-3">
            {report.replies.slice().reverse().map((reply) => (
              <div key={reply.id} className="bg-slate-50 rounded-md p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                    {reply.replier.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-steel-800">{reply.replier}</span>
                  <span className="text-xs text-steel-400">{reply.replyTime}</span>
                </div>
                <p className="text-sm text-steel-700 pl-8">{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}