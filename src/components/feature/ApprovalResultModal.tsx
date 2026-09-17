import { useState } from 'react';

interface ApprovalNode {
  id: string;
  seq: number;
  name: string;
  approver: string;
  status: string;
  action: string;
  operateTime: string;
  opinion: string;
}

interface ApprovalResultModalProps {
  onClose: () => void;
  title: string;
  processName: string;
  status: string;
  nodes: ApprovalNode[];
  logs?: { time: string; operator: string; action: string; opinion: string }[];
}

export default function ApprovalResultModal({ onClose, title, processName, status, nodes, logs }: ApprovalResultModalProps) {
  const [activeTab, setActiveTab] = useState<'result' | 'log'>('result');

  const statusColor = (s: string) => {
    switch (s) {
      case '通过': case '已通过': return 'bg-emerald-500';
      case '审核中': case '进行中': return 'bg-amber-500';
      case '驳回': case '已驳回': return 'bg-red-500';
      case '待处理': return 'bg-slate-300';
      case '已撤回': return 'bg-slate-400';
      default: return 'bg-slate-300';
    }
  };

  const fillColor = (s: string) => {
    if (s === '通过' || s === '已通过') return 'bg-emerald-100 border-emerald-400 text-emerald-700';
    if (s === '审核中' || s === '进行中') return 'bg-amber-50 border-amber-400 text-amber-700';
    if (s === '驳回' || s === '已驳回') return 'bg-red-50 border-red-400 text-red-700';
    return 'bg-slate-50 border-slate-300 text-slate-500';
  };

  const actionBadge = (action: string) => {
    if (action.includes('通过') || action.includes('确认') || action.includes('核准')) return 'bg-emerald-50 text-emerald-700';
    if (action.includes('退回') || action.includes('驳回')) return 'bg-red-50 text-red-700';
    if (action.includes('提交') || action.includes('呈核') || action.includes('发起')) return 'bg-blue-50 text-blue-700';
    if (action.includes('撤销')) return 'bg-slate-50 text-slate-600';
    return 'bg-slate-50 text-slate-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[760px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{processName}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line" /></button>
        </div>

        {/* Process Status */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">审批状态：</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === '已通过' || status === '已完成' ? 'bg-emerald-50 text-emerald-700' :
              status === '进行中' ? 'bg-amber-50 text-amber-700' :
              'bg-slate-100 text-slate-600'
            }`}>{status}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 bg-slate-50 flex-shrink-0">
          <button onClick={() => setActiveTab('result')} className={`px-4 py-1.5 text-sm rounded-t-md cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'result' ? 'bg-white text-slate-800 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
            审核结果
          </button>
          <button onClick={() => setActiveTab('log')} className={`px-4 py-1.5 text-sm rounded-t-md cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'log' ? 'bg-white text-slate-800 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
            审核日志详情
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'result' ? (
            <div>
              {/* Flow Visualization */}
              <div className="mb-5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-2 uppercase">流程审批进度</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-1.5 rounded-full text-xs font-medium text-white bg-primary-600">发起人</div>
                  {nodes.map((node, idx) => (
                    <div key={node.id} className="flex items-center gap-2">
                      <div className="w-3 h-3 flex items-center justify-center text-slate-300"><i className="ri-arrow-right-line text-xs" /></div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${fillColor(node.status)}`}>
                        {node.name}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 flex items-center justify-center text-slate-300"><i className="ri-arrow-right-line text-xs" /></div>
                    <div className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-500">结束</div>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200 flex-wrap">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary-600" /><span className="text-xs text-slate-500">经办人</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-white border-2 border-emerald-400" /><span className="text-xs text-slate-500">已审核</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400" /><span className="text-xs text-slate-500">审核中</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-300" /><span className="text-xs text-slate-500">待审核</span></div>
                </div>
              </div>

              {/* Node Details */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 mb-2 uppercase">节点详情</div>
                {nodes.map((node) => (
                  <div key={node.id} className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">#{node.seq}</span>
                        <span className="text-sm font-medium text-slate-800">{node.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${fillColor(node.status)}`}>{node.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div><span className="text-slate-400">审批人：</span>{node.approver}</div>
                      <div><span className="text-slate-400">操作时间：</span>{node.operateTime || '--'}</div>
                      <div className="col-span-2"><span className="text-slate-400">审批意见：</span>{node.opinion || '--'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-3 uppercase">审核日志</div>
              {logs && logs.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
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
                      {logs.map((log, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{log.time}</td>
                          <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{log.operator}</td>
                          <td className="px-3 py-2 text-sm whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionBadge(log.action)}`}>{log.action}</span>
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-700">{log.opinion || '--'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-slate-400">暂无审核日志</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-200 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}