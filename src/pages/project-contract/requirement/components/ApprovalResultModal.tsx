import { useState } from 'react';
import { EngineeringDemand } from '@/mocks/engineeringRequirementMocks';

interface ApprovalResultModalProps {
  demand: EngineeringDemand;
  onClose: () => void;
}

export default function ApprovalResultModal({ demand, onClose }: ApprovalResultModalProps) {
  const [activeTab, setActiveTab] = useState<'flow' | 'log'>('flow');
  const records = demand.approvalRecords || [];

  const statusColors: Record<string, { bg: string; text: string }> = {
    '已通过': { bg: '#ecfdf5', text: '#059669' },
    '已驳回': { bg: '#fef2f2', text: '#dc2626' },
    '待审批': { bg: '#fffbeb', text: '#d97706' },
    '已撤销': { bg: '#f5f3ff', text: '#7c3aed' },
  };

  const actionIcons: Record<string, string> = {
    '发起流程': 'ri-send-plane-line',
    '查看': 'ri-eye-line',
    '核准': 'ri-check-double-line',
    '驳回': 'ri-close-circle-line',
    '转办': 'ri-arrow-right-circle-line',
    '撤销': 'ri-arrow-go-back-line',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-[700px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">审批结果 - {demand.demandName}</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'flow' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            审核结果
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'log' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            审核日志详情
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'flow' && (
            <div>
              {/* Flow Chart */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {records.map((rec, i) => (
                  <div key={rec.id} className="flex items-center gap-2">
                    {i > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-px bg-slate-300" />
                        <i className="ri-arrow-right-line text-slate-300 text-xs" />
                      </div>
                    )}
                    <div
                      className="px-3 py-2 rounded-lg border text-center min-w-[100px]"
                      style={{
                        backgroundColor: statusColors[rec.status]?.bg || '#f8fafc',
                        borderColor: statusColors[rec.status]?.text || '#cbd5e1',
                      }}
                    >
                      <div className="text-xs font-medium" style={{ color: statusColors[rec.status]?.text || '#64748b' }}>
                        {rec.nodeName}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{rec.approver}</div>
                      {rec.status === '已通过' && (
                        <div className="w-5 h-5 flex items-center justify-center mx-auto mt-1 rounded-full bg-emerald-500 text-white text-xs">
                          <i className="ri-check-line" />
                        </div>
                      )}
                      {rec.status === '已驳回' && (
                        <div className="w-5 h-5 flex items-center justify-center mx-auto mt-1 rounded-full bg-red-500 text-white text-xs">
                          <i className="ri-close-line" />
                        </div>
                      )}
                      {rec.status === '待审批' && (
                        <div className="w-5 h-5 flex items-center justify-center mx-auto mt-1 rounded-full bg-amber-500 text-white text-xs">
                          <i className="ri-time-line" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>经办人</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>已审核</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>正在审核</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span>即将审核</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'log' && (
            <div className="space-y-3">
              {records.map((rec, i) => (
                <div key={rec.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xs" style={{ backgroundColor: statusColors[rec.status]?.text || '#64748b' }}>
                      <i className={actionIcons[rec.action] || 'ri-file-list-line'} />
                    </div>
                    {i < records.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-800">{rec.nodeName}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusColors[rec.status]?.bg || '#f8fafc',
                          color: statusColors[rec.status]?.text || '#64748b',
                        }}
                      >
                        {rec.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mb-1">
                      {rec.approver} · {rec.time}
                    </div>
                    <div className="text-sm text-slate-700">
                      <span className="font-medium">{rec.action}</span>
                      {rec.opinion && <span className="text-slate-500">：{rec.opinion}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">关闭</button>
        </div>
      </div>
    </div>
  );
}