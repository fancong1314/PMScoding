import type { ProjectPlan } from '@/mocks/projectPlans';
import { withPaymentPlans, withAnnualPlanOrgFields } from '@/mocks/projectPlans';
import type { ApprovalRecord } from '@/mocks/approvalMocks';
import { getPlanDeclarationAttachmentConfigs } from '@/mocks/archiveConfigMocks';
import { FormViewBlock, FormViewItem } from '@/components/feature/FormLayout';
import { InvestmentEstimateView } from '../form/components/InvestmentEstimateSection';
import { canWithdrawDeclaration } from '@/mocks/approvalMocks';

interface ApprovalResultModalProps {
  open: boolean;
  plan: ProjectPlan | null;
  approvalRecord: ApprovalRecord | null;
  onClose: () => void;
  onWithdraw: (record: ApprovalRecord) => void;
  onGoProcess: (record: ApprovalRecord) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  approving: { label: '审批中', color: '#d97706', bg: '#fffbeb', dot: '#f59e0b' },
  approved: { label: '已通过', color: '#16a34a', bg: '#f0fdf4', dot: '#22c55e' },
  rejected: { label: '已驳回', color: '#dc2626', bg: '#fef2f2', dot: '#ef4444' },
  withdrawn: { label: '已撤回', color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' },
};

const NODE_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  completed: { label: '已完成', bg: '#dcfce7', text: '#16a34a' },
  current: { label: '当前节点', bg: '#fef3c7', text: '#d97706' },
  pending: { label: '待审批', bg: '#f3f4f6', text: '#9ca3af' },
};

const NODE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  approval: { label: '审批', color: '#3b82f6' },
  countersign: { label: '会签', color: '#8b5cf6' },
  or_sign: { label: '或签', color: '#f59e0b' },
  cc: { label: '抄送', color: '#6b7280' },
};

export default function ApprovalResultModal({ open, plan, approvalRecord, onClose, onWithdraw, onGoProcess }: ApprovalResultModalProps) {
  if (!open || !plan || !approvalRecord) return null;

  const planView = withPaymentPlans(withAnnualPlanOrgFields(plan));
  const paymentRows = planView.paymentPlans || [];
  const paymentTotal = paymentRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const statusInfo = STATUS_CONFIG[approvalRecord.status] ?? STATUS_CONFIG.approving;
  const isApplicant = true;
  const canWithdraw = isApplicant && canWithdrawDeclaration(plan, approvalRecord);

  const renderNodeIcon = (nodeType: string, status: string) => {
    const baseCls = 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0';
    const isComplete = status === 'completed';
    const isCurrent = status === 'current';
    const iconCls = isComplete ? 'text-white' : isCurrent ? 'text-white' : 'text-slate-300';
    const bgStyle = isComplete ? { background: '#22c55e' } : isCurrent ? { background: '#f59e0b' } : { background: '#e2e8f0' };

    let icon = 'ri-user-line';
    if (nodeType === 'countersign') icon = 'ri-group-line';
    else if (nodeType === 'or_sign') icon = 'ri-git-branch-line';
    else if (nodeType === 'cc') icon = 'ri-mail-line';

    return (
      <div className={baseCls} style={bgStyle}>
        <i className={`${icon} ${iconCls}`} style={{ fontSize: '12px' }} />
      </div>
    );
  };

  const formatTime = (t?: string) => {
    if (!t) return '';
    try {
      const d = new Date(t);
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch { return t; }
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center pt-[5vh]">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[820px] max-h-[88vh] flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <i className="ri-file-search-line text-white text-sm" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">审批详情</h2>
              <p className="text-xs text-slate-400">{plan.planName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Approval Summary */}
          <div className="grid grid-cols-5 gap-3">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-400 mb-1">审批单号</p>
              <p className="text-sm font-semibold text-slate-800">{approvalRecord.appNo}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-400 mb-1">发起人</p>
              <p className="text-sm font-semibold text-slate-800">{approvalRecord.applicant} <span className="text-xs text-slate-400 font-normal">{approvalRecord.applicantDept}</span></p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-400 mb-1">发起时间</p>
              <p className="text-sm font-semibold text-slate-800">{formatTime(approvalRecord.applyTime)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-400 mb-1">当前状态</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusInfo.dot }} />
                <span className="text-sm font-semibold" style={{ color: statusInfo.color }}>{statusInfo.label}</span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-400 mb-1">业务类型</p>
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary-50 text-primary-600 font-medium">{approvalRecord.businessType}</span>
            </div>
          </div>

          <FormViewBlock title="业务信息">
            <FormViewItem label="年度计划名称" value={plan.planName} fullWidth />
            <FormViewItem label="计划年度" value={`${plan.planYear}年`} />
            <FormViewItem label="项目提报单位" value={plan.businessDivision} />
            <FormViewItem label="提报部门" value={plan.submitDept} />
            <FormViewItem label="实施主管部门" value={plan.implementDept} />
            <FormViewItem label="项目类别" value={plan.projectCategory} />
            <FormViewItem label="投资总估算" value={`${plan.budgetAmount.toFixed(2)} 万元`} />
            <FormViewItem label="项目负责人" value={plan.projectManager} />
            <FormViewItem label="负责人电话" value={plan.projectManagerPhone} />
            {plan.projectMajorType !== '大修' && plan.projectMajorType !== '零固' && (
              <FormViewItem label="效益" value={`${plan.benefit.toFixed(2)} 万元`} />
            )}
            <FormViewItem label="计划开工时间" value={plan.startDate} />
            <FormViewItem label="计划完工时间" value={plan.endDate} />
            {plan.projectMajorType === '大修' && (
              <>
                <FormViewItem label="是否资本性大修" value={plan.isCapitalOverhaul} />
                {plan.isCapitalOverhaul === '是' && (
                  <FormViewItem label="固定资产编码" value={plan.fixedAssetCode} />
                )}
                <FormViewItem label="设备编码" value={plan.equipmentCode} />
                <FormViewItem label="设备名称" value={plan.equipmentName} />
                <FormViewItem label="设备大修理由" value={plan.overhaulReason} multiline fullWidth />
              </>
            )}
            {plan.projectMajorType === '零固' && (
              <>
                <FormViewItem label="设备编码" value={plan.equipmentCode} />
                <FormViewItem label="设备名称" value={plan.equipmentName} />
                <FormViewItem label="设备库存数量" value={plan.equipmentStockQty} />
                <FormViewItem label="规格型号" value={plan.specModel} />
                <FormViewItem label="计量单位" value={plan.measureUnit} />
                <FormViewItem label="需求数量" value={plan.updateQty} />
                <FormViewItem label="申请采购数量" value={plan.purchaseApplyQty} />
                <FormViewItem
                  label="预估单价(万元)"
                  value={plan.unitPrice != null ? plan.unitPrice.toFixed(2) : undefined}
                />
                <FormViewItem label="是否新增零固" value={plan.isNewMinor} />
                {(plan.isNewMinor || '否') === '否' && (
                  <FormViewItem label="固定资产编码" value={plan.fixedAssetCode} />
                )}
                <FormViewItem label="更新理由" value={plan.updateReason} multiline fullWidth />
              </>
            )}
            {plan.projectMajorType !== '大修' && plan.projectMajorType !== '零固' && (
              <FormViewItem label="补充实施理由" value={plan.supplementNote} multiline fullWidth />
            )}
          </FormViewBlock>

          {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') && (
            <FormViewBlock title="项目详细信息">
              {([
                ['currentSituation', '现状'],
                ['necessity', '改造必要性'],
                ['innovation', '项目创新性'],
                ['processDesc', '工艺描述'],
                ['overallIdea', '改造总体思路'],
                ['modificationContent', '改造主要内容'],
                ['modificationPurpose', '改造目的'],
                ['effectDescription', '效果说明/效益计算'],
                ['equipmentDesc', '设备装备描述'],
                ['projectSummary', '项目总体结论'],
              ] as const).map(([field, label]) => (
                <FormViewItem
                  key={field}
                  label={label}
                  value={plan[field] as string}
                  multiline
                  fullWidth
                />
              ))}
            </FormViewBlock>
          )}

          <InvestmentEstimateView plan={planView} />

          {/* 付款计划（四大类通用） */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-primary-500" />
              付款计划
            </h4>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-2 text-xs font-medium text-slate-500 text-left">付款类型</th>
                    <th className="px-3 py-2 text-xs font-medium text-slate-500 text-left">付款月份</th>
                    <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">比例(%)</th>
                    <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">付款金额(万元)</th>
                    <th className="px-3 py-2 text-xs font-medium text-slate-500 text-left">备注</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-sm text-slate-400">暂无付款计划</td>
                    </tr>
                  )}
                  {paymentRows.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100">
                      <td className="px-3 py-2 text-sm text-slate-700">{r.paymentType || '—'}</td>
                      <td className="px-3 py-2 text-sm text-slate-600">{r.paymentMonth || '—'}</td>
                      <td className="px-3 py-2 text-sm text-slate-600 text-right">{r.ratio != null ? r.ratio.toFixed(2) : '—'}</td>
                      <td className="px-3 py-2 text-sm font-medium text-slate-800 text-right">{Number(r.amount || 0).toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm text-slate-500">{r.remark || '—'}</td>
                    </tr>
                  ))}
                </tbody>
                {paymentRows.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-50">
                      <td colSpan={3} className="px-3 py-2 text-sm font-medium text-slate-700 text-right">合计</td>
                      <td className="px-3 py-2 text-sm font-semibold text-slate-800 text-right">{paymentTotal.toFixed(2)}</td>
                      <td className="px-3 py-2 text-xs text-slate-400">
                        投资总估算 {plan.budgetAmount.toFixed(2)} 万元
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* 附件上传要求（档案配置） */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-primary-500" />
              附件上传
            </h4>
            <div className="space-y-2">
              {getPlanDeclarationAttachmentConfigs(plan.projectMajorType || '技改').map((cfg) => (
                <div key={cfg.id} className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-slate-800">{cfg.docName}</span>
                    {cfg.required ? (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-50 text-red-600 border border-red-100">必填</span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-slate-500 border border-slate-100">选填</span>
                    )}
                    {cfg.archived ? (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-50 text-emerald-600 border border-emerald-100">存档</span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-slate-400 border border-slate-100">不存档</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    文件类型：{cfg.fileFormats.join('、')} · 单文件 ≤ {cfg.fileSize}{cfg.fileSizeUnit} · 最多 {cfg.fileCount} 个
                    {cfg.templateFile ? ` · 模板：${cfg.templateFile}` : ''}
                  </p>
                  {cfg.remark && <p className="text-xs text-amber-700 mt-1">{cfg.remark}</p>}
                </div>
              ))}
              {getPlanDeclarationAttachmentConfigs(plan.projectMajorType || '技改').length === 0 && (
                <p className="text-sm text-slate-400 py-2">当前项目大类暂无附件配置</p>
              )}
            </div>
          </div>

          {/* Approval Flow */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-primary-500" />
              审批流程
            </h4>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="space-y-0">
                {/* Start Node */}
                <div className="flex items-start gap-3 pb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <i className="ri-user-line text-white" style={{ fontSize: '12px' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{approvalRecord.applicant}</span>
                      <span className="text-xs text-slate-400">{approvalRecord.applicantDept}</span>
                      <span className="px-1.5 py-0.5 text-xs rounded bg-green-50 text-green-600">已发起</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{formatTime(approvalRecord.applyTime)}</p>
                  </div>
                </div>

                {/* Connector */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: '32px' }}>
                    <div className="w-0.5 h-6 bg-slate-200" />
                  </div>
                </div>

                {/* Approval Nodes */}
                {approvalRecord.nodes.map((node, idx) => {
                  const isCc = node.nodeType === 'cc';
                  const statusInfo2 = NODE_STATUS_CONFIG[node.status] ?? NODE_STATUS_CONFIG.pending;
                  const typeInfo = NODE_TYPE_LABELS[node.nodeType] ?? NODE_TYPE_LABELS.approval;

                  return (
                    <div key={node.nodeId}>
                      <div className={`flex items-start gap-3 py-2 px-3 rounded-lg ${node.status === 'current' ? 'bg-amber-50 border border-amber-200' : isCc ? 'bg-blue-50/50' : ''}`}>
                        {renderNodeIcon(node.nodeType, node.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-800">{node.nodeName}</span>
                            <span className="px-1.5 py-0.5 text-xs rounded" style={{ backgroundColor: typeInfo.color + '15', color: typeInfo.color }}>{typeInfo.label}</span>
                            <span className={`px-1.5 py-0.5 text-xs rounded`} style={{ backgroundColor: statusInfo2.bg, color: statusInfo2.text }}>{statusInfo2.label}</span>
                          </div>

                          {/* Approver details */}
                          <div className="mt-1.5 space-y-1">
                            {node.approvers.map((approver, ai) => (
                              <div key={ai} className="flex items-center gap-2 text-xs">
                                <span className="text-slate-600">{approver.name}</span>
                                <span className="text-slate-400">{approver.department}</span>
                                {approver.result === 'approved' && <span className="text-green-600 font-medium">已通过</span>}
                                {approver.result === 'rejected' && <span className="text-red-600 font-medium">已驳回</span>}
                                {approver.time && <span className="text-slate-400">{formatTime(approver.time)}</span>}
                              </div>
                            ))}
                          </div>

                          {/* Transfer / Add info */}
                          {node.status === 'transferred' && node.transferTo && (
                            <p className="text-xs text-blue-600 mt-1">已转签至 {node.transferTo}</p>
                          )}
                          {node.status === 'added' && node.addedBy && (
                            <p className="text-xs text-blue-600 mt-1">加签：{node.addedBy}（{node.addPosition === 'before' ? '当前节点前' : '当前节点后'}）</p>
                          )}

                          {/* Opinion */}
                          {node.opinion && (
                            <div className="mt-1.5 p-2 rounded bg-slate-50 border border-slate-100">
                              <p className="text-xs text-slate-500">审批意见：{node.opinion}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Connector to next */}
                      {idx < approvalRecord.nodes.length - 1 && !isCc && (
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center flex-shrink-0" style={{ width: '32px' }}>
                            <div className="w-0.5 h-6 bg-slate-200" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* End */}
                {approvalRecord.status === 'approved' && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center flex-shrink-0" style={{ width: '32px' }}>
                        <div className="w-0.5 h-6 bg-slate-200" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-3">
                      <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-white" style={{ fontSize: '12px' }} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-600">审批结束</span>
                        <p className="text-xs text-slate-400 mt-0.5">所有节点已通过</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 flex-shrink-0 bg-slate-50">
          <div className="flex items-center gap-2">
            {canWithdraw && (
              <button
                onClick={() => onWithdraw(approvalRecord)}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-arrow-go-back-line mr-1.5" />
                撤回审批
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}