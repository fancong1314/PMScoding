import { useState } from 'react';
import {
  ESTIMATE_FEE_TYPES,
  formatCurrencyFixed,
  getProjectSupplementRecords,
  type EstimateApprovalFlowNode,
  type EstimateProject,
  type EstimateTransferSnapshot,
} from '@/mocks/estimateManagementMocks';
import EstimateApprovalFlowModal from './EstimateApprovalFlowModal';

interface Props {
  project: EstimateProject;
  onClose: () => void;
}

function SnapshotBlock({ snap }: { snap: EstimateTransferSnapshot }) {
  const total = ESTIMATE_FEE_TYPES.reduce((s, t) => s + (snap[t] || 0), 0);
  return (
    <div className="text-xs leading-5 text-slate-700 whitespace-nowrap">
      {ESTIMATE_FEE_TYPES.map((t) => (
        <div key={t}>{t}：{formatCurrencyFixed(snap[t] || 0)}</div>
      ))}
      <div className="font-medium text-sky-600">合计：{formatCurrencyFixed(total)}</div>
    </div>
  );
}

/** 费用增补记录弹窗 */
export default function SupplementRecordModal({ project, onClose }: Props) {
  const records = getProjectSupplementRecords(project.id);
  const [flowView, setFlowView] = useState<{
    processId: string;
    nodes: EstimateApprovalFlowNode[];
  } | null>(null);

  return (
    <>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-[1100px] max-w-[96vw] max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-base font-bold text-slate-900">费用增补记录</h3>
            <p className="text-xs text-slate-400 mt-1">{project.name}</p>
          </div>

          <div className="flex-1 overflow-auto px-6 pb-2">
            <div className="border border-slate-200 overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ backgroundColor: '#7dd3fc' }}>
                    <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">操作人</th>
                    <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">操作时间</th>
                    <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">增补前</th>
                    <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">增补后</th>
                    <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">增补原因</th>
                    <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">附件</th>
                    <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">审批流程ID</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200 align-top">
                      <td className="px-3 py-3 text-slate-700 whitespace-nowrap">{row.operator}</td>
                      <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{row.time}</td>
                      <td className="px-3 py-3"><SnapshotBlock snap={row.before} /></td>
                      <td className="px-3 py-3"><SnapshotBlock snap={row.after} /></td>
                      <td className="px-3 py-3 text-slate-600 leading-relaxed max-w-[200px]">{row.reason || '—'}</td>
                      <td className="px-3 py-3 text-slate-600 max-w-[180px]">
                        {row.attachments.length === 0 ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <div className="space-y-1">
                            {row.attachments.map((name) => (
                              <button
                                key={name}
                                type="button"
                                onClick={() => alert(`预览附件：${name}`)}
                                className="block text-xs text-sky-600 hover:underline cursor-pointer truncate max-w-[160px] text-left"
                                title={name}
                              >
                                <i className="ri-attachment-2 mr-0.5" />
                                {name}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setFlowView({ processId: row.processId, nodes: row.flowNodes })}
                          className="text-xs font-mono text-primary-600 hover:text-primary-700 hover:underline cursor-pointer"
                          title="查看审批流程"
                        >
                          {row.processId}
                        </button>
                        <div className="mt-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              row.status === '已通过'
                                ? 'bg-emerald-50 text-emerald-600'
                                : row.status === '已驳回'
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {row.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr className="border-t border-slate-200">
                      <td colSpan={7} className="px-3 py-10 text-center text-slate-400">暂无增补记录</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-1.5 text-sm border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer bg-white"
            >
              关闭
            </button>
          </div>
        </div>
      </div>

      {flowView && (
        <EstimateApprovalFlowModal
          project={project}
          onClose={() => setFlowView(null)}
          flowNodes={flowView.nodes}
          processId={flowView.processId}
          readonly
        />
      )}
    </>
  );
}
