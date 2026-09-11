import type { ProjectPlan } from '@/mocks/projectPlans';
import { withPaymentPlans, withInitiationDetailFields } from '@/mocks/projectPlans';
import type { ApprovalRecord } from '@/mocks/approvalMocks';
import { getInitiationDeclarationAttachmentConfigs } from '@/mocks/archiveConfigMocks';

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

export default function ApprovalResultModal({ open, plan: planRaw, approvalRecord, onClose, onWithdraw, onGoProcess }: ApprovalResultModalProps) {
  if (!open || !planRaw || !approvalRecord) return null;

  const plan = withPaymentPlans(withInitiationDetailFields(planRaw));
  const paymentRows = plan.paymentPlans || [];
  const paymentTotal = paymentRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const statusInfo = STATUS_CONFIG[approvalRecord.status] ?? STATUS_CONFIG.approving;
  const isApplicant = true;
  const canWithdraw = approvalRecord.status === 'approving' && isApplicant;

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

          {/* Business Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-primary-500" />
              业务信息
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
              {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改' || plan.projectMajorType === '大修') && (
                <>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">
                      {plan.projectMajorType === '大修' ? '是否计划内' : '是否计划内项目'}
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {plan.isInPlanProject || (plan.annualPlanNo ? '是' : '否')}
                    </span>
                  </div>
                  {(plan.isInPlanProject === '是' || !!plan.annualPlanNo) && (
                    <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                      <span className="text-sm text-slate-500">
                        {plan.projectMajorType === '大修' ? '项目计划号' : '年度计划号'}
                      </span>
                      <span className="text-sm font-medium text-slate-800 font-mono">{plan.annualPlanNo || '—'}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                <span className="text-sm text-slate-500">项目名称</span>
                <span className="text-sm font-medium text-slate-800 text-right max-w-[250px] truncate">{plan.planName}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                <span className="text-sm text-slate-500">计划年度</span>
                <span className="text-sm font-medium text-slate-800">{plan.planYear}年</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                <span className="text-sm text-slate-500">项目单位</span>
                <span className="text-sm font-medium text-slate-800">{plan.businessDivision}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                <span className="text-sm text-slate-500">项目类别</span>
                <span className="text-sm font-medium text-slate-800">{plan.projectCategory}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                <span className="text-sm text-slate-500">
                  {plan.projectMajorType === '大修' || plan.projectMajorType === '零固' ? '项目计划金额' : '概算总额'}
                </span>
                <span className="text-sm font-semibold text-slate-800">{plan.budgetAmount.toFixed(2)} 万元</span>
              </div>
              {(plan.projectMajorType === '大修' || plan.projectMajorType === '零固') && (
                <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                  <span className="text-sm text-slate-500">申报费用</span>
                  <span className="text-sm font-medium text-slate-800">
                    {plan.declareFee != null ? `${Number(plan.declareFee).toFixed(2)} 万元` : '—'}
                  </span>
                </div>
              )}
              {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') && (
                <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                  <span className="text-sm text-slate-500">效益</span>
                  <span className="text-sm font-medium text-slate-800">{plan.benefit.toFixed(2)} 万元</span>
                </div>
              )}
              <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                <span className="text-sm text-slate-500">
                  {plan.projectMajorType === '大修' || plan.projectMajorType === '零固' ? '项目负责人' : (plan.projectMajorType === '新建' || plan.projectMajorType === '技改') ? '项目经理' : '项目负责人'}
                </span>
                <span className="text-sm font-medium text-slate-800">{plan.projectManager}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                <span className="text-sm text-slate-500">
                  {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') ? '项目经理电话' : '负责人电话'}
                </span>
                <span className="text-sm font-medium text-slate-800">{plan.projectManagerPhone || '—'}</span>
              </div>
              {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') ? (
                <>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">实施主管单位</span>
                    <span className="text-sm font-medium text-slate-800">{plan.implementUnit || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">专业主管单位</span>
                    <span className="text-sm font-medium text-slate-800">{plan.professionalUnit || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">计划开工日期</span>
                    <span className="text-sm font-medium text-slate-800">{plan.startDate || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">计划完工日期</span>
                    <span className="text-sm font-medium text-slate-800">{plan.endDate || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">项目工期</span>
                    <span className="text-sm font-medium text-slate-800">
                      {plan.projectDuration ? `${plan.projectDuration} 月` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">是否涉及岗位增减</span>
                    <span className="text-sm font-medium text-slate-800">
                      {(plan.hasJobChange || '无') === '无'
                        ? '无'
                        : `${plan.hasJobChange}${plan.jobChangeCount ? ` ${plan.jobChangeCount}人` : ''}`}
                    </span>
                  </div>
                </>
              ) : null}
              {plan.projectMajorType === '大修' && (
                <>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">是否计划内</span>
                    <span className="text-sm font-medium text-slate-800">{plan.isInPlanProject || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">项目计划号</span>
                    <span className="text-sm font-medium text-slate-800 font-mono">{plan.annualPlanNo || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">事业部</span>
                    <span className="text-sm font-medium text-slate-800">{plan.businessDivision || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">单位</span>
                    <span className="text-sm font-medium text-slate-800">{plan.ownerUnit || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">是否为资本性大修</span>
                    <span className="text-sm font-medium text-slate-800">{plan.isCapitalOverhaul || '—'}</span>
                  </div>
                  <div className="col-span-2 flex items-start gap-4 py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500 w-28 flex-shrink-0">项目必要性</span>
                    <span className="text-sm text-slate-700 flex-1 whitespace-pre-wrap">{plan.necessity || '—'}</span>
                  </div>
                </>
              )}
              {plan.projectMajorType === '零固' && (
                <>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">是否计划内</span>
                    <span className="text-sm font-medium text-slate-800">{plan.isInPlanProject || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">项目计划号</span>
                    <span className="text-sm font-medium text-slate-800 font-mono">{plan.annualPlanNo || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">论证申请单号</span>
                    <span className="text-sm font-medium text-slate-800 font-mono">{plan.argumentApplyNo || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">事业部</span>
                    <span className="text-sm font-medium text-slate-800">{plan.businessDivision || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">单位</span>
                    <span className="text-sm font-medium text-slate-800">{plan.ownerUnit || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500">是否报废更新</span>
                    <span className="text-sm font-medium text-slate-800">{plan.isScrapRenew || '—'}</span>
                  </div>
                  <div className="col-span-2 flex items-start gap-4 py-1.5 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500 w-28 flex-shrink-0">项目必要性</span>
                    <span className="text-sm text-slate-700 flex-1 whitespace-pre-wrap">{plan.necessity || '—'}</span>
                  </div>
                </>
              )}
              {plan.projectMajorType !== '大修' && plan.projectMajorType !== '零固' && (
                <div className="col-span-2 flex items-start justify-between py-1.5 px-3 rounded bg-white">
                  <span className="text-sm text-slate-500 flex-shrink-0">补充实施理由</span>
                  <span className="text-sm text-slate-700 text-right">{plan.supplementNote || '—'}</span>
                </div>
              )}
            </div>
          </div>

          {/* 大修内容明细 */}
          {plan.projectMajorType === '大修' && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                大修内容明细
              </h4>
              <div className="rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: 720 }}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['序号', '类别', '设备部件/零件编码', '设备部件/零件名称', '大修内容'].map((h) => (
                        <th key={h} className="px-3 py-2 text-xs font-medium text-slate-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(plan.overhaulContentRows && plan.overhaulContentRows.length > 0) ? (
                      plan.overhaulContentRows.map((r) => (
                        <tr key={r.id} className="border-b border-slate-100">
                          <td className="px-3 py-2 text-sm text-slate-500">{r.seq}</td>
                          <td className="px-3 py-2 text-sm text-slate-700">{r.category || '—'}</td>
                          <td className="px-3 py-2 text-sm font-mono text-slate-600">{r.partCode || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-800">{r.partName || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.content || '—'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-sm text-slate-400">暂无大修内容明细</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 零固内容明细 */}
          {plan.projectMajorType === '零固' && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                零固内容明细
                <span className="ml-auto text-sm font-semibold text-emerald-600">
                  合计：{(
                    (plan.minorContentRows || []).reduce(
                      (s, r) => s + ((Number(r.unitPrice) || 0) * (Number(r.qty) || 0) + (Number(r.otherFee) || 0)),
                      0
                    )
                  ).toFixed(2)}万元
                </span>
              </h4>
              <div className="rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: 960 }}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['序号', '名称', '规格型号', '预估单价(万元)', '数量', '计量单位', '其他费用(万元)', '备注', '小计(万元)'].map((h) => (
                        <th key={h} className="px-3 py-2 text-xs font-medium text-slate-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(plan.minorContentRows && plan.minorContentRows.length > 0) ? (
                      plan.minorContentRows.map((r) => {
                        const sub = Math.round(((Number(r.unitPrice) || 0) * (Number(r.qty) || 0) + (Number(r.otherFee) || 0)) * 100) / 100;
                        return (
                          <tr key={r.id} className="border-b border-slate-100">
                            <td className="px-3 py-2 text-sm text-slate-500">{r.seq}</td>
                            <td className="px-3 py-2 text-sm text-slate-800">{r.name || '—'}</td>
                            <td className="px-3 py-2 text-sm text-slate-600">{r.specModel || '—'}</td>
                            <td className="px-3 py-2 text-sm text-slate-700">{Number(r.unitPrice || 0).toFixed(2)}</td>
                            <td className="px-3 py-2 text-sm text-slate-700">{r.qty}</td>
                            <td className="px-3 py-2 text-sm text-slate-600">{r.measureUnit || '—'}</td>
                            <td className="px-3 py-2 text-sm text-slate-700">{Number(r.otherFee || 0).toFixed(2)}</td>
                            <td className="px-3 py-2 text-sm text-slate-500">{r.remark || '—'}</td>
                            <td className="px-3 py-2 text-sm font-medium text-slate-800">{sub.toFixed(2)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-3 py-4 text-center text-sm text-slate-400">暂无零固内容明细</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 项目详细信息（新建/技改） */}
          {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                项目详细信息
              </h4>
              <div className="space-y-2 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                {([
                  ['necessity', '项目必要性'],
                  ['projectFeasibility', '项目可行性'],
                  ['modificationContent', '项目主要内容'],
                  ['deviceFacility', '主要设备/设施'],
                  ['costAnalysis', '费用估算/需求分析'],
                ] as const).map(([field, label]) => (
                  <div key={field} className="flex items-start gap-4 py-2 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500 w-36 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-slate-700 flex-1 whitespace-pre-wrap leading-relaxed">
                      {(plan[field] as string) || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                公辅配套
              </h4>
              <div className="space-y-2 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                {([
                  ['auxWater', '水'],
                  ['auxElec', '电'],
                  ['auxGas', '燃气'],
                  ['auxOxygen', '氧气/氩气（汽）'],
                  ['auxOther', '其他'],
                ] as const).map(([field, label]) => (
                  <div key={field} className="flex items-start gap-4 py-2 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500 w-36 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-slate-700 flex-1 whitespace-pre-wrap leading-relaxed">
                      {(plan[field] as string) || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                项目目标
              </h4>
              <div className="space-y-2 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                {([
                  ['techTarget', '技术目标'],
                  ['benefitTarget', '效益效果'],
                  ['otherTarget', '其它目标'],
                  ['innovation', '创新性、智能数字化'],
                  ['energyAssess', '能源提升与评估'],
                ] as const).map(([field, label]) => (
                  <div key={field} className="flex items-start gap-4 py-2 px-3 rounded bg-white">
                    <span className="text-sm text-slate-500 w-36 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-slate-700 flex-1 whitespace-pre-wrap leading-relaxed">
                      {(plan[field] as string) || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 研究报告人员（新建/技改/大修/零固） */}
          {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改' || plan.projectMajorType === '大修' || plan.projectMajorType === '零固') && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                项目研究报告人员
              </h4>
              <div className="rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: 760 }}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-3 py-2 text-xs font-medium text-slate-500">序号</th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500">工号</th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500">姓名</th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500">职称</th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500">单位</th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500">职务</th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500">甲方工作职责</th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(plan.researchPersons && plan.researchPersons.length > 0) ? (
                      plan.researchPersons.map((r) => (
                        <tr key={r.id} className="border-b border-slate-100">
                          <td className="px-3 py-2 text-sm text-slate-500">{r.seq}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.empNo || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-800">{r.name || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.title || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.unit || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.position || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600 max-w-[200px]">{r.partyDuty || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-500">{r.remark || '—'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-3 py-4 text-center text-sm text-slate-400">暂无研究报告人员</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                        概算/计划金额 {plan.budgetAmount.toFixed(2)} 万元
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                风险与机遇评估
              </h4>
              <div className="rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: 1200 }}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['序号', '风险', '风险等级', '风险状态', '风险分类', '影响等级/后果', '严重程度', '风险类别', '应对策略', '执行部门'].map((h) => (
                        <th key={h} className="px-3 py-2 text-xs font-medium text-slate-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(plan.riskAssessRows && plan.riskAssessRows.length > 0) ? (
                      plan.riskAssessRows.map((r) => (
                        <tr key={r.id} className="border-b border-slate-100">
                          <td className="px-3 py-2 text-sm text-slate-500">{r.seq}</td>
                          <td className="px-3 py-2 text-sm text-slate-800">{r.risk || '—'}</td>
                          <td className="px-3 py-2 text-sm">
                            <span className={`px-1.5 py-0.5 text-xs rounded-full ${r.riskLevel === '高' ? 'bg-red-100 text-red-700' : r.riskLevel === '中' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                              {r.riskLevel}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.riskStatus || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.riskCategory || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.impactLevel || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.severity || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.riskType || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.strategy || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.execDept || '—'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="px-3 py-4 text-center text-sm text-slate-400">暂无风险评估数据</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 附件上传要求（档案配置） */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-primary-500" />
              附件上传
            </h4>
            <div className="space-y-2">
              {getInitiationDeclarationAttachmentConfigs(plan.projectMajorType || '技改').map((cfg) => (
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
              {getInitiationDeclarationAttachmentConfigs(plan.projectMajorType || '技改').length === 0 && (
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
