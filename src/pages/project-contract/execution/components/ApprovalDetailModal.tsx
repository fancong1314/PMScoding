import { useState } from 'react';

interface ApprovalLogItem {
  time: string;
  operator: string;
  action: string;
  opinion: string;
}

interface ApprovalDetailModalProps {
  onClose: () => void;
  approvalLogs?: ApprovalLogItem[];
  currentNode?: string;
  nodes?: { name: string; status: 'done' | 'active' | 'pending' }[];
}

export default function ApprovalDetailModal({ onClose, approvalLogs, currentNode, nodes }: ApprovalDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'result' | 'log'>('result');

  const defaultNodes = nodes || [
    { name: '经办人', status: 'done' as const },
    { name: '部门负责人审批', status: 'done' as const },
    { name: '分管领导审批', status: 'active' as const },
    { name: '制造部终审', status: 'pending' as const },
  ];

  const defaultLogs = approvalLogs || [
    { time: '2026-06-10 09:00:00', operator: '赵明华', action: '发起流程', opinion: '提交审批申请' },
    { time: '2026-06-10 14:00:00', operator: '陈建国', action: '核准', opinion: '审核通过，同意上报' },
    { time: '2026-06-10 16:30:00', operator: '王志强', action: '核准(加签)', opinion: '建议补充安全措施方案后通过' },
  ];

  const showLogs = approvalLogs || defaultLogs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-[700px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-shrink-0">
          <h3 className="text-base font-semibold text-slate-800">审批详情</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 px-5">
          <button onClick={() => setActiveTab('result')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'result' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            审核结果
          </button>
          <button onClick={() => setActiveTab('log')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'log' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            审核日志详情
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'result' ? (
            <div>
              {/* Flow Chart */}
              <div className="flex items-center justify-center gap-0 flex-wrap py-4">
                {defaultNodes.map((node, idx) => (
                  <div key={idx} className="flex items-center">
                    {idx > 0 && (
                      <div className="flex items-center">
                        <div className={`h-0.5 w-8 ${node.status === 'done' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <div className="w-3 h-3 flex items-center justify-center">
                          <div className={`w-2 h-2 rotate-45 ${node.status === 'done' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                        <div className={`h-0.5 w-8 ${node.status === 'done' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                    )}
                    <div className={`px-4 py-3 rounded-xl text-center min-w-[100px] ${
                      node.status === 'done' ? 'bg-white border-2 border-emerald-500' :
                      node.status === 'active' ? 'bg-amber-500 text-white shadow-md' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      <div className="text-xs font-semibold">{node.name}</div>
                      <div className="text-xs mt-0.5 opacity-70">
                        {node.status === 'done' ? '已审核' : node.status === 'active' ? '审核中' : '待审核'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' }} />
                  经办人
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded bg-white border-2 border-emerald-500" />
                  已审核人
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded bg-amber-500" />
                  正在审核人
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300" />
                  即将审核人
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作类型</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审批意见</th>
                  </tr>
                </thead>
                <tbody>
                  {showLogs.map((log, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{log.time}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{log.operator}</td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          log.action.includes('驳回') || log.action.includes('退回') ? 'bg-red-50 text-red-700' :
                          log.action.includes('加签') ? 'bg-blue-50 text-blue-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>{log.action}</span>
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">{log.opinion || '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}