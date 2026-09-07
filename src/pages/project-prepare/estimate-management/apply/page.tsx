import Layout from '@/components/feature/Layout';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProjectById, getProjectEstimates, formatCurrency } from '@/mocks/estimateManagementMocks';
import type { EstimateItem } from '@/mocks/estimateManagementMocks';

interface ApplyRow {
  item: EstimateItem;
  depth: number;
  hasChildren: boolean;
}

function buildRows(items: EstimateItem[], expandedIds: Set<string>): ApplyRow[] {
  const rows: ApplyRow[] = [];
  const map = new Map<string, EstimateItem[]>();
  items.forEach((it) => {
    if (it.parentId) {
      const arr = map.get(it.parentId) ?? [];
      arr.push(it);
      map.set(it.parentId, arr);
    }
  });
  function walk(parentId: string | null, depth: number) {
    const children = items.filter((it) => it.parentId === parentId);
    children.forEach((child) => {
      const sub = map.get(child.id) ?? [];
      rows.push({ item: child, depth, hasChildren: sub.length > 0 });
      if (sub.length > 0 && expandedIds.has(child.id)) {
        walk(child.id, depth + 1);
      }
    });
  }
  walk(null, 0);
  return rows;
}

function getLevelStyle(level: number) {
  if (level === 1) return { bg: '#e8f5e9', border: '#66bb6a', text: '#1b5e20' };
  if (level === 2) return { bg: '#e3f2fd', border: '#42a5f5', text: '#0d47a1' };
  return { bg: '#fff3e0', border: '#ffa726', text: '#e65100' };
}

interface ApplyData {
  adjustAmount: number;
  correctionAmount: number;
  surplusAmount: number;
  description: string;
}

export default function EstimateApplyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') ?? '';
  const project = useMemo(() => getProjectById(projectId), [projectId]);
  const [estimates] = useState<EstimateItem[]>(() => getProjectEstimates(projectId));
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    estimates.forEach((it) => { if (it.parentId === null) set.add(it.id); });
    return set;
  });
  const [applyData, setApplyData] = useState<Record<string, ApplyData>>({});
  const [reason, setReason] = useState('');
  const [showApproval, setShowApproval] = useState(false);
  const [approvalNodes, setApprovalNodes] = useState<{ node: string; approver: string }[]>([
    { node: '项目经理审核', approver: '' },
    { node: '工程管理部审核', approver: '' },
  ]);
  const [submitNote, setSubmitNote] = useState('');
  const [approvalError, setApprovalError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const rows = useMemo(() => buildRows(estimates, expandedIds), [estimates, expandedIds]);

  const projectBudget = project?.budgetAmount ?? 0;
  const totalAdjust = useMemo(() => {
    return Object.values(applyData).reduce((s, d) => s + d.adjustAmount, 0);
  }, [applyData]);
  const totalCorrection = useMemo(() => {
    return Object.values(applyData).reduce((s, d) => s + d.correctionAmount, 0);
  }, [applyData]);
  const totalSurplus = useMemo(() => {
    return Object.values(applyData).reduce((s, d) => s + d.surplusAmount, 0);
  }, [applyData]);
  const isTotalConsistent = Math.abs(totalAdjust) < 0.01;
  const hasSurplusIncrease = useMemo(() => {
    return rows.some((row) => {
      const isJieYu = row.item.name === '结余费' || row.item.parentId === 'est1-4';
      const data = applyData[row.item.id];
      if (!isJieYu || !data) return false;
      return data.adjustAmount > 0;
    });
  }, [rows, applyData]);

  const handleToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleCorrectionChange = (id: string, value: number) => {
    setApplyData((prev) => {
      const current = prev[id] ?? { adjustAmount: 0, correctionAmount: 0, surplusAmount: 0, description: '' };
      const newAdjust = current.surplusAmount - value;
      return {
        ...prev,
        [id]: {
          ...current,
          correctionAmount: Math.max(0, value),
          adjustAmount: newAdjust,
        },
      };
    });
  };

  const handleSurplusChange = (id: string, value: number) => {
    setApplyData((prev) => {
      const current = prev[id] ?? { adjustAmount: 0, correctionAmount: 0, surplusAmount: 0, description: '' };
      const newAdjust = value - current.correctionAmount;
      return {
        ...prev,
        [id]: {
          ...current,
          surplusAmount: Math.max(0, value),
          adjustAmount: newAdjust,
        },
      };
    });
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setApplyData((prev) => {
      const current = prev[id] ?? { adjustAmount: 0, correctionAmount: 0, surplusAmount: 0, description: '' };
      return { ...prev, [id]: { ...current, description: value } };
    });
  };

  const handleSubmitApproval = () => {
    const empty = approvalNodes.filter((n) => !n.approver.trim());
    if (empty.length > 0) {
      setApprovalError(`请为以下节点选择审批人：${empty.map((n) => n.node).join('、')}`);
      return;
    }
    setApprovalError('');
    setShowApproval(false);
    alert('概算修正申请已呈核，进入审批流程');
    navigate(`/project-prepare/estimate-management/detail?projectId=${projectId}`);
  };

  const handleAddNode = () => {
    setApprovalNodes((prev) => [...prev, { node: '自定义审批', approver: '' }]);
  };

  const handleRemoveNode = (idx: number) => {
    setApprovalNodes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleNodeChange = (idx: number, field: 'node' | 'approver', value: string) => {
    setApprovalNodes((prev) => prev.map((n, i) => (i === idx ? { ...n, [field]: value } : n)));
  };

  const approverOptions = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟', '孙伟', '周鹏', '吴昊', '郑明'];

  if (!project) {
    return (
      <Layout>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 flex items-center justify-center mb-4">
          <i className="ri-error-warning-line text-3xl text-slate-400" />
        </div>
        <p className="text-slate-500 mb-4">未找到项目信息</p>
        <button onClick={() => navigate('/project-prepare/estimate-management')} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          返回列表
        </button>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="space-y-4">
      {/* Project Info */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-800">概算修正申请</h2>
          <span className="text-sm text-slate-500">立项号：{project.approvalNo}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 text-sm">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">立项号</label>
            <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-700 border border-slate-200">{project.approvalNo}</div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">项目名称</label>
            <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-700 border border-slate-200">{project.name}</div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">审核状态</label>
            <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-700 border border-slate-200">
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 font-medium">新建</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">建档人</label>
            <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-700 border border-slate-200">管理员</div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">建档日期</label>
            <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-700 border border-slate-200">2026-05-29</div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">修改人</label>
            <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-700 border border-slate-200">管理员</div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">修改日期</label>
            <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-700 border border-slate-200">2026-05-29</div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">呈核人</label>
            <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-500 border border-slate-200">-</div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">呈核日期</label>
            <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-500 border border-slate-200">-</div>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-xs text-slate-500 mb-1 block">申请理由</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400" placeholder="请输入申请理由" />
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-2 text-sm text-amber-700 flex items-center gap-2">
        <div className="w-4 h-4 flex items-center justify-center">
          <i className="ri-alert-line" />
        </div>
        结余费调动只允许扣除，不允许增加操作
      </div>

      {/* Validation Banner */}
      {!isTotalConsistent && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-2 text-sm text-red-600 flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-error-warning-line" />
          </div>
          概算总额不能变更，请调整细项金额。当前差额：{formatCurrency(totalAdjust)} 元
        </div>
      )}
      {isTotalConsistent && totalAdjust !== 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md px-4 py-2 text-sm text-emerald-600 flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-check-line" />
          </div>
          概算总额校验通过，可以进行呈核审批
        </div>
      )}
      {hasSurplusIncrease && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-2 text-sm text-red-600 flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-error-warning-line" />
          </div>
          结余费调动只允许扣除，不允许增加操作
        </div>
      )}

      {/* Detail Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 py-3 text-left font-medium text-slate-600">费用名称</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">概算修订金额(元)</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">概算剩余金额(元)</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">调拨申请修正额(元)</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">概算修正额(元)</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">结余金额(元)</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">修正说明</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const style = getLevelStyle(row.item.level);
                const data = applyData[row.item.id] ?? { adjustAmount: 0, correctionAmount: 0, surplusAmount: 0, description: '' };
                const isJieYu = row.item.name === '结余费' || row.item.parentId === 'est1-4';
                const canEdit = row.item.level > 1;
                return (
                  <tr key={row.item.id} className="border-b border-slate-100 transition-colors" style={{ backgroundColor: style.bg, borderLeft: `3px solid ${style.border}` }}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        {row.hasChildren && (
                          <button onClick={() => handleToggle(row.item.id)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/5 cursor-pointer flex-shrink-0">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <i className={expandedIds.has(row.item.id) ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />
                            </div>
                          </button>
                        )}
                        {!row.hasChildren && <div className="w-5" />}
                        <div style={{ paddingLeft: `${row.depth * 16}px` }}>
                          <span className={`text-slate-800 ${row.item.level === 1 ? 'font-bold' : row.item.level === 2 ? 'font-medium' : ''}`}>
                            {row.item.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-700">{formatCurrency(row.item.revisedAmount)}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600">{formatCurrency(row.item.remainingAmount)}</td>
                    <td className="px-3 py-3">
                      {canEdit ? (
                        <div className="text-right font-mono text-slate-700">
                          {data.adjustAmount > 0 ? '+' : ''}{formatCurrency(data.adjustAmount)}
                        </div>
                      ) : (
                        <div className="text-right font-mono text-slate-400">-</div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {canEdit ? (
                        <input
                          type="number"
                          value={data.correctionAmount}
                          onChange={(e) => handleCorrectionChange(row.item.id, Number(e.target.value))}
                          className="w-28 px-2 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400 font-mono text-right"
                          min={0}
                        />
                      ) : (
                        <div className="text-right font-mono text-slate-400">-</div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {canEdit ? (
                        <input
                          type="number"
                          value={data.surplusAmount}
                          onChange={(e) => handleSurplusChange(row.item.id, Number(e.target.value))}
                          className="w-28 px-2 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400 font-mono text-right"
                          min={0}
                        />
                      ) : (
                        <div className="text-right font-mono text-slate-400">-</div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {canEdit ? (
                        <input
                          type="text"
                          value={data.description}
                          onChange={(e) => handleDescriptionChange(row.item.id, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400"
                          placeholder="请输入修正说明"
                        />
                      ) : (
                        <div className="text-slate-400">-</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-600">立项金额：<span className="font-mono font-semibold text-slate-800">{formatCurrency(projectBudget)}</span> 元</span>
            <span className="text-slate-600">调拨合计：<span className={`font-mono font-semibold ${totalAdjust > 0 ? 'text-red-500' : totalAdjust < 0 ? 'text-emerald-600' : 'text-slate-800'}`}>{totalAdjust > 0 ? '+' : ''}{formatCurrency(totalAdjust)}</span> 元</span>
            <span className="text-slate-600">修正合计：<span className="font-mono font-semibold text-slate-800">{formatCurrency(totalCorrection)}</span> 元</span>
            <span className="text-slate-600">结余合计：<span className={`font-mono font-semibold ${hasSurplusIncrease ? 'text-red-500' : 'text-slate-800'}`}>{formatCurrency(totalSurplus)}</span> 元</span>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowApproval(true)}
          disabled={!isTotalConsistent || hasSurplusIncrease}
          className="px-5 py-2 text-sm font-medium rounded-md text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
        >
          <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
            <i className="ri-send-plane-line" />
          </div>
          呈核
        </button>
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="px-5 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
            <i className="ri-close-line" />
          </div>
          取消
        </button>
      </div>

      {/* Approval Flow Modal */}
      {showApproval && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowApproval(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[560px] max-w-[95vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">审批流程配置</h3>
              <button onClick={() => setShowApproval(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                <i className="ri-close-line text-lg" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="space-y-3">
                {approvalNodes.map((node, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={node.node}
                        onChange={(e) => handleNodeChange(idx, 'node', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400"
                      />
                    </div>
                    <div className="w-40">
                      <select
                        value={node.approver}
                        onChange={(e) => handleNodeChange(idx, 'approver', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400 bg-white"
                      >
                        <option value="">选择审批人</option>
                        {approverOptions.map((a) => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <button onClick={() => handleRemoveNode(idx)} className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer rounded hover:bg-red-50">
                      <i className="ri-delete-bin-line" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleAddNode} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-add-line" />
                </div>
                新增审批节点
              </button>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">提交备注</label>
                <textarea value={submitNote} onChange={(e) => setSubmitNote(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400 resize-none" placeholder="请输入提交备注（可选）" />
              </div>
              {approvalError && (
                <div className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-error-warning-line" />
                  </div>
                  {approvalError}
                </div>
              )}
              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleSubmitApproval} className="px-4 py-2 text-sm font-medium rounded-md text-white cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                  确认呈核
                </button>
                <button onClick={() => setShowApproval(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirm */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCancelConfirm(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[400px] max-w-[90vw] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <i className="ri-question-line text-red-500 text-lg" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">确认取消</h3>
                <p className="text-sm text-slate-500">取消后将不保存修改内容，是否确认？</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer">
                否
              </button>
              <button onClick={() => navigate(`/project-prepare/estimate-management/detail?projectId=${projectId}`)} className="px-4 py-2 text-sm rounded-md text-white cursor-pointer" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                是，取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}