import { useState } from 'react';
import { getProjectRevisionLogs, formatCurrency } from '@/mocks/estimateManagementMocks';
import type { EstimateRevisionLog } from '@/mocks/estimateManagementMocks';

interface RevisionLogModalProps {
  projectId: string;
  onClose: () => void;
}

function DetailModal({ log, onClose }: { log: EstimateRevisionLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[900px] max-w-[95vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">概算修正申请详情</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {/* Project Info */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div><span className="text-slate-500">立项号：</span><span className="text-slate-800">{log.approvalNo}</span></div>
            <div><span className="text-slate-500">项目名称：</span><span className="text-slate-800">{log.name}</span></div>
            <div><span className="text-slate-500">审核状态：</span>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                log.status === '已通过' ? 'bg-emerald-50 text-emerald-600' :
                log.status === '审批中' ? 'bg-blue-50 text-blue-600' :
                log.status === '已驳回' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
              }`}>{log.status}</span>
            </div>
            <div><span className="text-slate-500">建档人：</span><span className="text-slate-800">{log.creator}</span></div>
            <div><span className="text-slate-500">建档日期：</span><span className="text-slate-800">{log.createDate}</span></div>
            <div><span className="text-slate-500">修改人：</span><span className="text-slate-800">{log.modifier}</span></div>
            <div><span className="text-slate-500">修改日期：</span><span className="text-slate-800">{log.modifyDate}</span></div>
            <div><span className="text-slate-500">呈核人：</span><span className="text-slate-800">{log.submitter}</span></div>
            <div><span className="text-slate-500">呈核日期：</span><span className="text-slate-800">{log.submitDate}</span></div>
          </div>
          <div className="text-sm">
            <span className="text-slate-500">申请理由：</span>
            <span className="text-slate-800">{log.reason}</span>
          </div>

          {/* Detail Items Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-2 text-left font-medium text-slate-600">费用名称</th>
                  <th className="px-3 py-2 text-right font-medium text-slate-600">概算修订金额(元)</th>
                  <th className="px-3 py-2 text-right font-medium text-slate-600">概算剩余金额(元)</th>
                  <th className="px-3 py-2 text-right font-medium text-slate-600">调拨申请修正额(元)</th>
                  <th className="px-3 py-2 text-right font-medium text-slate-600">概算修正额(元)</th>
                  <th className="px-3 py-2 text-right font-medium text-slate-600">结余金额(元)</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">修正说明</th>
                </tr>
              </thead>
              <tbody>
                {log.detailItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 text-slate-700">
                      <span className={item.level === 1 ? 'font-bold' : item.level === 2 ? 'font-medium' : ''}>{item.name}</span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-slate-700">{formatCurrency(item.revisedAmount)}</td>
                    <td className="px-3 py-2 text-right font-mono text-slate-600">{formatCurrency(item.remainingAmount)}</td>
                    <td className={`px-3 py-2 text-right font-mono ${item.adjustAmount > 0 ? 'text-red-500' : item.adjustAmount < 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {item.adjustAmount > 0 ? '+' : ''}{formatCurrency(item.adjustAmount)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-slate-700">{formatCurrency(item.correctionAmount)}</td>
                    <td className="px-3 py-2 text-right font-mono text-slate-600">{formatCurrency(item.surplusAmount)}</td>
                    <td className="px-3 py-2 text-slate-600">{item.description}</td>
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

function ApprovalRecordModal({ log, onClose }: { log: EstimateRevisionLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">审批记录</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>
        <div className="px-5 py-4">
          <div className="space-y-4">
            {log.approvalFlow.map((flow, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    flow.status === '已通过' ? 'bg-emerald-500' :
                    flow.status === '已驳回' ? 'bg-red-500' : 'bg-slate-400'
                  }`}>
                    {flow.status === '已通过' ? <i className="ri-check-line" /> :
                     flow.status === '已驳回' ? <i className="ri-close-line" /> : <i className="ri-time-line" />}
                  </div>
                  {idx < log.approvalFlow.length - 1 && (
                    <div className="w-0.5 h-6 bg-slate-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">{flow.node}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      flow.status === '已通过' ? 'bg-emerald-50 text-emerald-600' :
                      flow.status === '已驳回' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                    }`}>{flow.status}</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-0.5">审批人：{flow.approver}</div>
                  {flow.time && <div className="text-sm text-slate-500">审批时间：{flow.time}</div>}
                  {flow.comment && <div className="text-sm text-slate-600 mt-1 bg-slate-50 rounded-md px-3 py-2">{flow.comment}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RevisionLogModal({ projectId, onClose }: RevisionLogModalProps) {
  const logs = getProjectRevisionLogs(projectId);
  const [detailLog, setDetailLog] = useState<EstimateRevisionLog | null>(null);
  const [approvalLog, setApprovalLog] = useState<EstimateRevisionLog | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[1100px] max-w-[95vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">修订日志</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>
        <div className="px-5 py-4">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-3 text-left font-medium text-slate-600">立项号</th>
                  <th className="px-3 py-3 text-left font-medium text-slate-600">项目名称</th>
                  <th className="px-3 py-3 text-left font-medium text-slate-600">审核状态</th>
                  <th className="px-3 py-3 text-left font-medium text-slate-600">申请理由</th>
                  <th className="px-3 py-3 text-left font-medium text-slate-600">建档人</th>
                  <th className="px-3 py-3 text-left font-medium text-slate-600">建档日期</th>
                  <th className="px-3 py-3 text-left font-medium text-slate-600">修改人</th>
                  <th className="px-3 py-3 text-left font-medium text-slate-600">修改日期</th>
                  <th className="px-3 py-3 text-left font-medium text-slate-600">呈核人</th>
                  <th className="px-3 py-3 text-left font-medium text-slate-600">呈核日期</th>
                  <th className="px-3 py-3 text-center font-medium text-slate-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-3 text-slate-700 font-medium">{log.approvalNo}</td>
                    <td className="px-3 py-3 text-slate-700">{log.name}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        log.status === '已通过' ? 'bg-emerald-50 text-emerald-600' :
                        log.status === '审批中' ? 'bg-blue-50 text-blue-600' :
                        log.status === '已驳回' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                      }`}>{log.status}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 max-w-[200px] truncate">{log.reason}</td>
                    <td className="px-3 py-3 text-slate-600">{log.creator}</td>
                    <td className="px-3 py-3 text-slate-600">{log.createDate}</td>
                    <td className="px-3 py-3 text-slate-600">{log.modifier}</td>
                    <td className="px-3 py-3 text-slate-600">{log.modifyDate}</td>
                    <td className="px-3 py-3 text-slate-600">{log.submitter}</td>
                    <td className="px-3 py-3 text-slate-600">{log.submitDate}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 justify-center">
                        <button onClick={() => setDetailLog(log)} className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-600 hover:bg-blue-50 cursor-pointer whitespace-nowrap">
                          详情
                        </button>
                        <button onClick={() => setApprovalLog(log)} className="px-2 py-1 text-xs rounded border border-emerald-300 text-emerald-600 hover:bg-emerald-50 cursor-pointer whitespace-nowrap">
                          审批记录
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-3 py-8 text-center text-slate-400">暂无修订记录</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Nested Modals */}
      {detailLog && <DetailModal log={detailLog} onClose={() => setDetailLog(null)} />}
      {approvalLog && <ApprovalRecordModal log={approvalLog} onClose={() => setApprovalLog(null)} />}
    </div>
  );
}