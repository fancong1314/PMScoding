import { useState } from 'react';
import type { ReportRecord } from '@/mocks/contractProgressMocks';

interface ReportRecordModalProps {
  records: ReportRecord[];
  onClose: () => void;
}

export default function ReportRecordModal({ records, onClose }: ReportRecordModalProps) {
  const [detailTarget, setDetailTarget] = useState<ReportRecord | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-[90vw] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #e8edf3' }}>
          <h3 className="text-sm font-semibold text-steel-800">汇报记录</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-steel-50" style={{ borderBottom: '1px solid #e8edf3' }}>
                  <th className="sticky left-0 z-20 px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap bg-steel-50" style={{ minWidth: 140, borderRight: '1px solid #e8edf3' }}>任务名称</th>
                  <th className="sticky left-[140px] z-20 px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap bg-steel-50" style={{ minWidth: 80, borderRight: '1px solid #e8edf3' }}>汇报人</th>
                  <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 120 }}>汇报时间</th>
                  <th className="px-3 py-2.5 text-center font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 100 }}>汇报前进度</th>
                  <th className="px-3 py-2.5 text-center font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 100 }}>汇报后进度</th>
                  <th className="px-3 py-2.5 text-center font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 90 }}>当前计划进度</th>
                  <th className="px-3 py-2.5 text-center font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 80 }}>是否延误</th>
                  <th className="sticky right-0 z-20 px-3 py-2.5 text-center font-medium text-steel-600 whitespace-nowrap bg-steel-50" style={{ minWidth: 80, borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr
                    key={rec.id}
                    className="group hover:bg-slate-50 transition-colors"
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                  >
                    <td className="sticky left-0 z-10 px-3 py-2.5 text-steel-800 font-medium whitespace-nowrap bg-white group-hover:bg-slate-50" style={{ minWidth: 140, borderRight: '1px solid #e8edf3' }}>{rec.taskName}</td>
                    <td className="sticky left-[140px] z-10 px-3 py-2.5 text-steel-600 whitespace-nowrap bg-white group-hover:bg-slate-50" style={{ minWidth: 80, borderRight: '1px solid #e8edf3' }}>{rec.reporter}</td>
                    <td className="px-3 py-2.5 text-steel-600 whitespace-nowrap" style={{ minWidth: 120 }}>{rec.reportTime}</td>
                    <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ minWidth: 100 }}>
                      <span className="text-xs font-mono text-steel-600">{rec.beforeProgress}%</span>
                    </td>
                    <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ minWidth: 100 }}>
                      <span className="text-xs font-mono text-emerald-600 font-medium">{rec.afterProgress}%</span>
                    </td>
                    <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ minWidth: 90 }}>
                      <span className="text-xs font-mono text-steel-500">{rec.currentPlanProgress}%</span>
                    </td>
                    <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ minWidth: 80 }}>
                      {rec.isDelayed ? (
                        <span className="text-xs text-red-600 font-medium">是</span>
                      ) : (
                        <span className="text-xs text-steel-400">否</span>
                      )}
                    </td>
                    <td className="sticky right-0 z-10 px-3 py-2.5 text-center whitespace-nowrap bg-white group-hover:bg-slate-50" style={{ minWidth: 80, borderLeft: '1px solid #e8edf3' }}>
                      <button
                        onClick={() => setDetailTarget(rec)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 py-3 flex justify-end" style={{ borderTop: '1px solid #e8edf3' }}>
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>

      {/* Detail Modal */}
      {detailTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setDetailTarget(null)}>
          <div className="bg-white rounded-lg shadow-lg w-[520px] max-w-[90vw] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #e8edf3' }}>
              <h3 className="text-sm font-semibold text-steel-800">汇报详情</h3>
              <button onClick={() => setDetailTarget(null)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-steel-500">任务名称</span>
                  <span className="text-sm font-medium text-steel-800">{detailTarget.taskName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-steel-500">汇报人</span>
                  <span className="text-sm font-medium text-steel-800">{detailTarget.reporter}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-steel-500">汇报时间</span>
                  <span className="text-sm font-medium text-steel-800">{detailTarget.reportTime}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-steel-500">是否延误</span>
                  <span className={`text-sm font-medium ${detailTarget.isDelayed ? 'text-red-600' : 'text-emerald-600'}`}>
                    {detailTarget.isDelayed ? '是' : '否'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 py-2" style={{ borderTop: '1px solid #e8edf3' }}>
                <div>
                  <span className="text-xs text-steel-500">汇报前进度</span>
                  <p className="text-lg font-bold text-steel-700">{detailTarget.beforeProgress}%</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-steel-400">
                  <i className="ri-arrow-right-line" />
                </div>
                <div>
                  <span className="text-xs text-steel-500">汇报后进度</span>
                  <p className="text-lg font-bold text-emerald-600">{detailTarget.afterProgress}%</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-steel-400">
                  <i className="ri-arrow-right-line" />
                </div>
                <div>
                  <span className="text-xs text-steel-500">当前计划进度</span>
                  <p className="text-lg font-bold text-steel-700">{detailTarget.currentPlanProgress}%</p>
                </div>
              </div>
              {detailTarget.isDelayed && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-xs text-red-500 font-medium mb-1">延误原因</p>
                  <p className="text-sm text-red-700">{detailTarget.delayReason}</p>
                </div>
              )}
              {detailTarget.solution && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-xs text-blue-500 font-medium mb-1">解决方法</p>
                  <p className="text-sm text-blue-700">{detailTarget.solution}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-steel-500 font-medium mb-1">进度说明</p>
                <p className="text-sm text-steel-700">{detailTarget.progressDesc}</p>
              </div>
              {detailTarget.attachments.length > 0 && (
                <div>
                  <p className="text-xs text-steel-500 font-medium mb-1">附件</p>
                  <div className="flex flex-wrap gap-2">
                    {detailTarget.attachments.map((att, idx) => (
                      <button key={idx} className="flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer">
                        <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line text-xs" /></div>
                        {att}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-4 py-3 flex justify-end" style={{ borderTop: '1px solid #e8edf3' }}>
              <button onClick={() => setDetailTarget(null)} className="px-4 py-1.5 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}