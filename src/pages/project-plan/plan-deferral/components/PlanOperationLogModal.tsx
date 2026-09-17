import { useState, useMemo } from 'react';
import { planOperationLogs, planAppTypeMap, planApprovalStatusMap } from '@/mocks/planDeferralMocks';
import type { PlanApplicationType, PlanApprovalStatus } from '@/mocks/planDeferralMocks';
import PlanApprovalFlowModal from './PlanApprovalFlowModal';

interface Props {
  open: boolean;
  planId: string;
  planName: string;
  onClose: () => void;
}

const appTypeOptions = [
  { value: '', label: '全部类型' },
  { value: 'delay', label: '延期申请' },
  { value: 'suspend', label: '暂缓申请' },
  { value: 'terminate', label: '终止申请' },
  { value: 'execute', label: '启动申请' },
];

export default function PlanOperationLogModal({ open, planId, planName, onClose }: Props) {
  const [filterType, setFilterType] = useState('');
  const [filterApplicant, setFilterApplicant] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalFlowOpen, setApprovalFlowOpen] = useState(false);
  const [selectedFlowId, setSelectedFlowId] = useState('');
  const pageSize = 5;

  const logs = useMemo(() => {
    return planOperationLogs.filter((log) => {
      if (log.planId !== planId) return false;
      if (filterType && log.appType !== filterType) return false;
      if (filterApplicant && !log.applicant.includes(filterApplicant)) return false;
      if (filterStartDate && log.applyTime < filterStartDate) return false;
      if (filterEndDate && log.applyTime > filterEndDate + ' 23:59:59') return false;
      return true;
    });
  }, [planId, filterType, filterApplicant, filterStartDate, filterEndDate]);

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  const paginated = logs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleViewFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setApprovalFlowOpen(true);
  };

  const handleReset = () => {
    setFilterType('');
    setFilterApplicant('');
    setFilterStartDate('');
    setFilterEndDate('');
    setCurrentPage(1);
  };

  if (!open) return null;

  const inputCls = 'px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 text-steel-700';

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div
          className="relative z-10 w-[860px] max-h-[85vh] bg-white rounded-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-steel-100 flex items-start justify-between flex-shrink-0">
            <div>
              <h2 className="text-base font-semibold text-steel-900">操作日志</h2>
              <p className="text-xs text-steel-400 mt-0.5 max-w-xl truncate">{planName}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-steel-400 hover:text-steel-600 flex-shrink-0">
              <i className="ri-close-line text-lg" />
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 py-3 border-b border-steel-100 bg-slate-50 flex-shrink-0">
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                className={inputCls + ' cursor-pointer'}
              >
                {appTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <input
                value={filterApplicant}
                onChange={(e) => { setFilterApplicant(e.target.value); setCurrentPage(1); }}
                placeholder="申请人"
                className={inputCls + ' w-32'}
              />
              <div className="flex items-center gap-1.5">
                <input type="date" value={filterStartDate} onChange={(e) => { setFilterStartDate(e.target.value); setCurrentPage(1); }} className={inputCls} />
                <span className="text-steel-400 text-sm">至</span>
                <input type="date" value={filterEndDate} onChange={(e) => { setFilterEndDate(e.target.value); setCurrentPage(1); }} className={inputCls} />
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-refresh-line mr-1" />重置
              </button>
              <span className="ml-auto text-xs text-steel-400">
                共 <span className="font-medium text-steel-700">{logs.length}</span> 条记录
              </span>
            </div>
          </div>

          {/* Log List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {paginated.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <i className="ri-file-list-3-line text-xl text-steel-300" />
                </div>
                <p className="text-sm text-steel-400">暂无操作日志记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paginated.map((log) => {
                  const typeInfo = planAppTypeMap[log.appType as PlanApplicationType];
                  const statusInfo = planApprovalStatusMap[log.approvalStatus as PlanApprovalStatus];
                  return (
                    <div key={log.id} className="border border-steel-100 rounded-xl p-4 hover:border-steel-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium border ${typeInfo.color}`}>
                          {typeInfo.label}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-medium text-steel-800">{log.applicant}</span>
                              <span className="text-steel-400 text-xs">
                                <i className="ri-time-line mr-1" />{log.applyTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs font-medium flex items-center gap-1">
                                <i className={`ri-checkbox-blank-circle-fill text-[8px] ${statusInfo.dotColor}`} />
                                <span className="text-steel-600">{statusInfo.label}</span>
                              </span>
                              <button
                                onClick={() => handleViewFlow(log.approvalFlowId)}
                                className="text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer whitespace-nowrap"
                              >
                                <i className="ri-flow-chart mr-0.5" />查看审批流程
                              </button>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-steel-600 leading-relaxed line-clamp-2">{log.applyReason}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination & Footer */}
          <div className="px-6 py-3 border-t border-steel-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer">
                <i className="ri-arrow-left-s-line text-sm" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs cursor-pointer transition-colors ${currentPage === p ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`}
                  style={currentPage === p ? { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' } : undefined}>
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer">
                <i className="ri-arrow-right-s-line text-sm" />
              </button>
            </div>
            <button onClick={onClose} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
              关闭
            </button>
          </div>
        </div>
      </div>

      <PlanApprovalFlowModal
        open={approvalFlowOpen}
        flowId={selectedFlowId}
        onClose={() => setApprovalFlowOpen(false)}
      />
    </>
  );
}
