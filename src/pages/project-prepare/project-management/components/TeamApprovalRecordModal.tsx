import { useState } from 'react';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';
import {
  getMemberTeamApprovalFlow,
  type MemberTeamApprovalRecord,
} from '@/mocks/projectPrepareMocks';

interface Props {
  projectId: string;
  records: MemberTeamApprovalRecord[];
  onClose: () => void;
}

export default function TeamApprovalRecordModal({ projectId, records, onClose }: Props) {
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null);
  const flow = activeProcessId ? getMemberTeamApprovalFlow(projectId, activeProcessId) : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-lg w-[720px] max-w-[90vw] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #e8edf3' }}>
            <h3 className="text-sm font-semibold text-steel-800">操作日志</h3>
            <button type="button" onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {records.length === 0 ? (
              <div className="py-12 text-center text-sm text-steel-400">暂无操作日志</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">操作时间</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">操作人</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">操作类型</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">备注</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">流程ID</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.id} className="border-b border-steel-100 hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-xs text-steel-500 whitespace-nowrap">{rec.operationTime}</td>
                      <td className="px-4 py-2.5 text-sm text-steel-700 whitespace-nowrap">{rec.operator}</td>
                      <td className="px-4 py-2.5 text-sm text-steel-800 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          {rec.operationType}
                          {rec.result === '通过' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">通过</span>
                          )}
                          {rec.result === '驳回' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">驳回</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-steel-600 max-w-[220px]">
                        <span className="line-clamp-2" title={rec.remark}>{rec.remark || '—'}</span>
                      </td>
                      <td className="px-4 py-2.5 text-sm whitespace-nowrap">
                        {rec.processId ? (
                          <button
                            type="button"
                            onClick={() => setActiveProcessId(rec.processId!)}
                            className="text-primary-600 hover:text-primary-700 hover:underline font-mono text-xs cursor-pointer"
                            title="查看审批流程"
                          >
                            {rec.processId}
                          </button>
                        ) : (
                          <span className="text-xs text-steel-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="px-4 py-3 flex justify-end" style={{ borderTop: '1px solid #e8edf3' }}>
            <button type="button" onClick={onClose} className="px-4 py-1.5 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
          </div>
        </div>
      </div>

      {flow && activeProcessId && (
        <ApprovalResultModal
          onClose={() => setActiveProcessId(null)}
          title="审批流程"
          processName={flow.processName}
          status={flow.status}
          nodes={flow.nodes}
          logs={flow.logs}
        />
      )}
    </>
  );
}
