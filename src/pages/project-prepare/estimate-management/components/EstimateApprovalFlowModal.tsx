import { useMemo, useState } from 'react';
import {
  advanceSupplementApproval,
  getPendingSupplement,
  getProjectById,
  type EstimateApprovalFlowNode,
  type EstimateFlowNodeStatus,
  type EstimateProject,
} from '@/mocks/estimateManagementMocks';

interface Props {
  project: EstimateProject;
  onClose: () => void;
  onChanged?: () => void;
}

const nodeStatusStyle: Record<EstimateFlowNodeStatus, { bg: string; border: string; text: string; icon: string; badge: string }> = {
  passed: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'ri-checkbox-circle-fill text-emerald-500', badge: '已通过' },
  current: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'ri-loader-4-line text-amber-500', badge: '审批中' },
  pending: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500', icon: 'ri-time-line text-slate-400', badge: '待审批' },
  rejected: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', icon: 'ri-close-circle-fill text-red-500', badge: '已驳回' },
};

/** 项目概算管理 · 审批状态可视化流程弹窗 */
export default function EstimateApprovalFlowModal({ project, onClose, onChanged }: Props) {
  const [tick, setTick] = useState(0);
  const [hint, setHint] = useState('');
  const current = useMemo(() => getProjectById(project.id) || project, [project, tick]);
  const nodes: EstimateApprovalFlowNode[] = current.approvalFlow || [];
  const pending = getPendingSupplement(current.id);
  const doneCount = nodes.filter((n) => n.status === 'passed').length;
  const progress = nodes.length > 0 ? Math.round((doneCount / nodes.length) * 100) : 0;

  const act = (pass: boolean) => {
    const result = advanceSupplementApproval(current.id, pass);
    setHint(result.message);
    setTick((n) => n + 1);
    onChanged?.();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[540px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-steel-100">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-steel-800">审批记录</h3>
            <p className="text-xs text-steel-400 mt-0.5 font-mono">{current.approvalNo}</p>
            <p className="text-xs text-steel-500 mt-0.5 truncate">{current.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer flex-shrink-0"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-b border-steel-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-steel-500">审批进度</span>
            <span className="text-xs font-semibold text-steel-700">{doneCount} / {nodes.length} 节点已完成</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {nodes.length === 0 ? (
            <p className="text-sm text-steel-400 text-center py-12">暂无审批流程数据</p>
          ) : (
            <div className="space-y-0">
              {nodes.map((node, idx) => {
                const style = nodeStatusStyle[node.status] || nodeStatusStyle.pending;
                const isCurrent = node.status === 'current';
                return (
                  <div key={`${node.name}-${idx}`} className="flex flex-col items-center">
                    {idx > 0 && (
                      <div
                        className={`w-0.5 h-5 ${
                          node.status === 'pending'
                            ? 'bg-slate-200'
                            : node.status === 'rejected'
                              ? 'bg-red-200'
                              : 'bg-emerald-300'
                        }`}
                      />
                    )}
                    <div
                      className={`w-full border-2 rounded-xl p-4 transition-all ${style.bg} ${style.border} ${
                        isCurrent ? 'ring-2 ring-offset-2 ring-amber-400' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
                          <i className={`${style.icon} text-base`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-steel-800">{node.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${style.bg} ${style.text} ${style.border}`}>
                              {style.badge}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-steel-500">审批人：{node.role}</p>
                          {node.time && (
                            <p className="mt-1 text-xs text-steel-400">
                              <i className="ri-time-line mr-1" />
                              {node.time}
                            </p>
                          )}
                          {node.opinion && (
                            <div className="mt-2 text-xs text-steel-600 bg-white/70 rounded-lg px-3 py-2 border border-steel-100">
                              <i className="ri-chat-1-line mr-1.5" />
                              {node.opinion}
                            </div>
                          )}
                          {isCurrent && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              当前审批节点
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-steel-100">
          <span className="text-xs text-steel-500 truncate">{hint}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {pending && (
              <>
                <button
                  type="button"
                  onClick={() => act(false)}
                  className="px-4 py-1.5 text-sm border border-red-200 text-red-600 rounded-md hover:bg-red-50 cursor-pointer"
                >
                  驳回
                </button>
                <button
                  type="button"
                  onClick={() => act(true)}
                  className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}
                >
                  审批通过
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-slate-50 cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
