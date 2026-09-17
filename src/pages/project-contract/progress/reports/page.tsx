import Layout from '@/components/feature/Layout';
import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getContractById, getWeeklyReports, getMonthlyReports } from '@/mocks/contractProgressMocks';
import type { WeeklyReport, MonthlyReport } from '@/mocks/contractProgressMocks';

interface ReplyModalProps {
  report: WeeklyReport | MonthlyReport;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

function ReplyModal({ report, onClose, onSubmit }: ReplyModalProps) {
  const [content, setContent] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #e8edf3' }}>
          <h3 className="text-sm font-semibold text-steel-800">回复周报/月报</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-slate-50 rounded-md p-3 text-sm text-steel-600">
            <p className="font-medium text-steel-800 mb-1">{report instanceof Object && 'weekStartDate' in report ? '周报' : '月报'}内容</p>
            <p className="line-clamp-2">{(report as WeeklyReport).completedWork ?? (report as MonthlyReport).completedWork}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-steel-500 font-medium">回复内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入回复内容..."
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-400 resize-none"
            />
            <span className="text-xs text-steel-400 text-right">{content.length}/500</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: '1px solid #e8edf3' }}>
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
          <button
            onClick={() => { if (content.trim()) { onSubmit(content); } }}
            disabled={!content.trim()}
            className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer disabled:opacity-50 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            提交回复
          </button>
        </div>
      </div>
    </div>
  );
}

interface LogModalProps {
  logs: { id: string; operationType: string; operator: string; operationTime: string; description: string; detailContent?: string }[];
  onClose: () => void;
}

function LogModal({ logs, onClose }: LogModalProps) {
  const typeStyle = (type: string) => {
    if (type === '新增') return { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700', icon: 'ri-add-circle-line' };
    if (type === '修改') return { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700', icon: 'ri-edit-line' };
    if (type === '回复') return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', icon: 'ri-reply-line' };
    if (type === '删除') return { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700', icon: 'ri-delete-bin-line' };
    return { dot: 'bg-steel-400', badge: 'bg-slate-100 text-slate-600', icon: 'ri-file-list-line' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[640px] max-w-[90vw] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #e8edf3' }}>
          <h3 className="text-sm font-semibold text-steel-800">操作日志</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {logs.map((log, idx) => {
              const style = typeStyle(log.operationType);
              return (
                <div key={log.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    {idx < logs.length - 1 && <div className="w-px flex-1 bg-steel-200 mt-1" />}
                  </div>
                  <div className="pb-3 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className={`w-4 h-4 flex items-center justify-center ${style.badge.split(' ')[1]} mr-0.5`}>
                        <i className={`${style.icon} text-xs`} />
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${style.badge}`}>
                        {log.operationType}
                      </span>
                      <span className="text-xs font-medium text-steel-700">{log.operator}</span>
                      <span className="text-xs text-steel-400">{log.operationTime}</span>
                    </div>
                    <p className="text-sm text-steel-600 mb-1">{log.description}</p>
                    {log.detailContent && (
                      <div className="bg-slate-50 rounded-md p-2.5 mt-1 border border-slate-100">
                        <p className="text-xs text-steel-400 mb-1">{log.operationType === '回复' ? '回复内容' : log.operationType === '新增' ? '新增内容' : '修改内容'}</p>
                        <p className="text-sm text-steel-700 leading-relaxed">{log.detailContent}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-4 py-3 flex justify-end" style={{ borderTop: '1px solid #e8edf3' }}>
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}

export default function ReportListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contractId = searchParams.get('contractId') ?? '';
  const contract = getContractById(contractId);
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');
  const [replyTarget, setReplyTarget] = useState<WeeklyReport | MonthlyReport | null>(null);
  const [logTarget, setLogTarget] = useState<WeeklyReport | MonthlyReport | null>(null);

  const weeklyData = useMemo(() => getWeeklyReports(contractId), [contractId]);
  const monthlyData = useMemo(() => getMonthlyReports(contractId), [contractId]);

  const handleReply = (content: string) => {
    if (replyTarget) {
      replyTarget.replies.push({
        id: `reply-new-${Date.now()}`,
        replier: '管理员',
        replyTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        content,
      });
      replyTarget.operationLogs.push({
        id: `log-new-${Date.now()}`,
        operationType: '回复',
        operator: '管理员',
        operationTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        description: '甲方回复' + ('weekStartDate' in replyTarget ? '周报' : '月报'),
      });
    }
    setReplyTarget(null);
  };

  if (!contract) {
    return (
      <div className="py-12 text-center text-steel-400 text-sm">
        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-steel-300">
          <i className="ri-inbox-line text-3xl" />
        </div>
        未找到合同信息
      </div>
    );
  }

  return (
    <Layout>
    <div className="space-y-4">
      {/* Contract Info */}
      <div className="bg-white rounded-lg p-4 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-steel-500">合同名称</span>
          <span className="text-sm font-semibold text-steel-800">{contract.contractName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-steel-500">合同编号</span>
          <span className="text-sm font-medium text-steel-700">{contract.contractNo}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-steel-500">承包商</span>
          <span className="text-sm text-steel-700">{contract.contractorName}</span>
        </div>
        <button
          onClick={() => navigate('/project-contract/progress')}
          className="ml-auto px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <div className="w-3 h-3 flex items-center justify-center inline-flex mr-1">
            <i className="ri-arrow-left-line text-xs" />
          </div>
          返回列表
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-lg w-fit mb-4">
          <button
            onClick={() => setTab('weekly')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-all whitespace-nowrap ${
              tab === 'weekly' ? 'text-white shadow-sm' : 'text-steel-500 hover:text-steel-700'
            }`}
            style={tab === 'weekly' ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}
          >
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
              <i className="ri-calendar-line text-xs" />
            </div>
            周报 ({weeklyData.length})
          </button>
          <button
            onClick={() => setTab('monthly')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-all whitespace-nowrap ${
              tab === 'monthly' ? 'text-white shadow-sm' : 'text-steel-500 hover:text-steel-700'
            }`}
            style={tab === 'monthly' ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}
          >
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
              <i className="ri-calendar-2-line text-xs" />
            </div>
            月报 ({monthlyData.length})
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-steel-50" style={{ borderBottom: '1px solid #e8edf3' }}>
                <th className="sticky left-0 z-20 px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap bg-steel-50" style={{ minWidth: 90, borderRight: '1px solid #e8edf3' }}>汇报人</th>
                <th className="sticky left-[90px] z-20 px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap bg-steel-50" style={{ minWidth: 100, borderRight: '1px solid #e8edf3' }}>汇报时间</th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 120 }}>
                  {tab === 'weekly' ? '本周开始日期' : '本月开始日期'}
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 120 }}>
                  {tab === 'weekly' ? '本周结束日期' : '本月结束日期'}
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 300 }}>完成工作</th>
                <th className="sticky right-0 z-20 px-3 py-2.5 text-center font-medium text-steel-600 whitespace-nowrap bg-steel-50" style={{ minWidth: 240, borderLeft: '1px solid #e8edf3' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {(tab === 'weekly' ? weeklyData : monthlyData).map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50 transition-colors"
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                >
                  <td className="sticky left-0 z-10 px-3 py-2.5 text-steel-800 whitespace-nowrap bg-white group-hover:bg-slate-50" style={{ minWidth: 90, borderRight: '1px solid #e8edf3' }}>{item.reporter}</td>
                  <td className="sticky left-[90px] z-10 px-3 py-2.5 text-steel-600 whitespace-nowrap bg-white group-hover:bg-slate-50" style={{ minWidth: 100, borderRight: '1px solid #e8edf3' }}>{item.reportTime}</td>
                  <td className="px-3 py-2.5 text-steel-600 whitespace-nowrap" style={{ minWidth: 120 }}>
                    {tab === 'weekly' ? (item as WeeklyReport).weekStartDate : (item as MonthlyReport).monthStartDate}
                  </td>
                  <td className="px-3 py-2.5 text-steel-600 whitespace-nowrap" style={{ minWidth: 120 }}>
                    {tab === 'weekly' ? (item as WeeklyReport).weekEndDate : (item as MonthlyReport).monthEndDate}
                  </td>
                  <td className="px-3 py-2.5 text-steel-600 whitespace-nowrap" style={{ minWidth: 300 }}>
                    <span className="truncate block max-w-[300px]" title={item.completedWork}>
                      {item.completedWork}
                    </span>
                  </td>
                  <td className="sticky right-0 z-10 px-3 py-2.5 text-center whitespace-nowrap bg-white group-hover:bg-slate-50" style={{ minWidth: 240, borderLeft: '1px solid #e8edf3' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setReplyTarget(item)}
                        className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5">
                          <i className="ri-reply-line text-xs" />
                        </div>
                        回复
                      </button>
                      <button
                        onClick={() => setLogTarget(item)}
                        className="px-2.5 py-1 text-xs font-medium text-steel-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5">
                          <i className="ri-history-line text-xs" />
                        </div>
                        操作日志
                      </button>
                      <button
                        onClick={() => navigate(`/project-contract/progress/report-detail?contractId=${contractId}&reportId=${item.id}&type=${tab}`)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5">
                          <i className="ri-eye-line text-xs" />
                        </div>
                        详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {replyTarget && <ReplyModal report={replyTarget} onClose={() => setReplyTarget(null)} onSubmit={handleReply} />}
      {logTarget && <LogModal logs={logTarget.operationLogs} onClose={() => setLogTarget(null)} />}
    </div>
    </Layout>
  );
}