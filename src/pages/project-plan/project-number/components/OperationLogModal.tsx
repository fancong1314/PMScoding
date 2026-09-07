import { useState } from 'react';
import { operationLogs } from '@/mocks/projectNumberMocks';
import type { ProjectNumberRecord } from '@/mocks/projectNumberMocks';

interface Props {
  open: boolean;
  record: ProjectNumberRecord | null;
  onClose: () => void;
}

const operationTypeMap: Record<string, { label: string; color: string; icon: string }> = {
  create: { label: '新增', color: 'bg-emerald-50 text-emerald-700', icon: 'ri-add-circle-line' },
  delete: { label: '删除', color: 'bg-red-50 text-red-600', icon: 'ri-delete-bin-line' },
  update: { label: '修改', color: 'bg-sky-50 text-sky-700', icon: 'ri-edit-line' },
  change: { label: '变更', color: 'bg-amber-50 text-amber-700', icon: 'ri-exchange-line' },
};

export default function OperationLogModal({ open, record, onClose }: Props) {
  const [showFlow, setShowFlow] = useState(false);

  if (!open || !record) return null;

  const logs = operationLogs.filter((l) => l.projectId === record.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[800px] max-h-[80vh] flex flex-col" style={{ maxWidth: '90vw' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h3 className="text-base font-semibold text-steel-800">操作日志</h3>
            <p className="text-xs text-steel-400 mt-0.5">
              立项号：<span className="font-mono font-medium">{record.projectNo}</span> · {record.projectName}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 hover:text-steel-600 transition-colors cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100">
                <i className="ri-inbox-2-line text-2xl text-steel-300" />
              </div>
              <p className="text-sm text-steel-400">暂无操作日志</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const typeInfo = operationTypeMap[log.operation];
                return (
                  <div key={log.id} className="border border-steel-100 rounded-lg p-4 hover:border-steel-200 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          <i className={typeInfo.icon} />
                          {typeInfo.label}
                        </span>
                        <span className="text-sm font-medium text-steel-700">{log.operator}</span>
                      </div>
                      <span className="text-xs text-steel-400">{log.operationTime}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-steel-400">变更理由：</span>
                        <span className="text-steel-700">{log.changeReason}</span>
                      </div>
                      <div>
                        <span className="text-steel-400">变更备注：</span>
                        <span className="text-steel-700">{log.changeRemark}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-steel-400">变更状态：</span>
                      <button
                        onClick={() => setShowFlow(true)}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline cursor-pointer"
                      >
                        {log.changeStatus}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Approval Flow Visualization */}
          {showFlow && (
            <div className="mt-5 border border-steel-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-steel-800">审批流程</h4>
                <button onClick={() => setShowFlow(false)} className="text-xs text-steel-400 hover:text-steel-600 cursor-pointer">
                  收起
                </button>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { name: '发起人', status: 'completed', time: '2026-03-15 09:00' },
                  { name: '部门领导', status: 'completed', time: '2026-03-15 14:30' },
                  { name: '专业部门', status: 'completed', time: '2026-03-16 10:00' },
                  { name: '公司领导', status: 'completed', time: '2026-03-17 16:00' },
                ].map((node, idx, arr) => (
                  <div key={node.name} className="flex items-center gap-2">
                    <div className={`flex flex-col items-center ${node.status === 'completed' ? 'text-emerald-600' : 'text-steel-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${node.status === 'completed' ? 'bg-emerald-50 border-2 border-emerald-500' : 'bg-slate-100 border-2 border-steel-200'}`}>
                        {node.status === 'completed' ? <i className="ri-check-line" /> : idx + 1}
                      </div>
                      <span className="text-xs mt-1 whitespace-nowrap">{node.name}</span>
                      {node.time && <span className="text-[10px] text-steel-400">{node.time}</span>}
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="w-8 h-px bg-emerald-300 mb-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-steel-100">
          <button onClick={onClose}
            className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}