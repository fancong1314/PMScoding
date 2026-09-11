import { projectPlans, withPaymentPlans, withInitiationDetailFields } from '@/mocks/projectPlans';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { getInitiationDeclarationAttachmentConfigs } from '@/mocks/archiveConfigMocks';

interface Props {
  open: boolean;
  linkedPlanId: string;
  fallbackName?: string;
  onClose: () => void;
  onEdit?: () => void;
}

function getPlan(linkedPlanId: string): ProjectPlan | null {
  try {
    const keys = ['ng_init_decl_plans_v6', 'ng_init_decl_plans_v5', 'ng_init_decl_plans_v4', 'ng_init_decl_plans_v3', 'ng_init_decl_plans_v2', 'ng_init_decl_plans_v1'];
    for (const key of keys) {
      const s = localStorage.getItem(key);
      if (s) {
        const list = JSON.parse(s) as ProjectPlan[];
        const found = list.find((p) => p.id === linkedPlanId);
        if (found) return withPaymentPlans(withInitiationDetailFields(found));
      }
    }
  } catch { /* noop */ }
  const fromMock = projectPlans.find((p) => p.id === linkedPlanId);
  return fromMock ? withPaymentPlans(withInitiationDetailFields(fromMock)) : null;
}

const FieldRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-4 py-2 px-3 rounded bg-white">
    <span className="text-sm text-slate-500 w-36 flex-shrink-0 pt-0.5">{label}</span>
    <span className="text-sm text-slate-700 flex-1 whitespace-pre-wrap">{value || '—'}</span>
  </div>
);

export default function PlanReviewDetailModal({ open, linkedPlanId, fallbackName, onClose, onEdit }: Props) {
  if (!open) return null;

  const plan = getPlan(linkedPlanId);
  const paymentRows = plan?.paymentPlans || [];
  const paymentTotal = paymentRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const isNewOrTech = plan?.projectMajorType === '新建' || plan?.projectMajorType === '技改';

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center pt-[5vh]">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[820px] max-h-[88vh] flex flex-col overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <i className="ri-file-info-line text-white text-sm" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">项目详情</h2>
              <p className="text-xs text-slate-400">{plan?.planName || fallbackName || linkedPlanId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {plan && onEdit && (
              <button type="button" onClick={onEdit} className="px-3 py-1.5 text-xs text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer">
                去修改
              </button>
            )}
            <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!plan ? (
            <div className="py-16 text-center text-sm text-slate-400">
              未找到关联的项目立项申请数据（{linkedPlanId}）
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-primary-500" />
                  业务信息
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                  {isNewOrTech && (
                    <>
                      <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                        <span className="text-sm text-slate-500">是否计划内项目</span>
                        <span className="text-sm font-medium text-slate-800">{plan.isInPlanProject || (plan.annualPlanNo ? '是' : '否')}</span>
                      </div>
                      {(plan.isInPlanProject === '是' || !!plan.annualPlanNo) && (
                        <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                          <span className="text-sm text-slate-500">年度计划号</span>
                          <span className="text-sm font-medium text-slate-800 font-mono">{plan.annualPlanNo || '—'}</span>
                        </div>
                      )}
                    </>
                  )}
                  {[
                    ['项目大类', plan.projectMajorType],
                    ['计划年度', `${plan.planYear}年`],
                    ['项目单位', plan.businessDivision],
                    ...(isNewOrTech ? [
                      ['实施主管单位', plan.implementUnit || '—'],
                      ['专业主管单位', plan.professionalUnit || '—'],
                    ] as const : []),
                    ['项目类别', plan.projectCategory],
                    ['概算总额', `${plan.budgetAmount.toFixed(2)} 万元`],
                    ...(isNewOrTech ? [['效益', `${plan.benefit.toFixed(2)} 万元`] as const] : []),
                    [isNewOrTech ? '项目经理' : '项目负责人', plan.projectManager],
                    [isNewOrTech ? '项目经理电话' : '负责人电话', plan.projectManagerPhone || '—'],
                    ...(isNewOrTech ? [
                      ['计划开工日期', plan.startDate || '—'],
                      ['计划完工日期', plan.endDate || '—'],
                      ['项目工期', plan.projectDuration ? `${plan.projectDuration} 月` : '—'],
                      ['岗位增减', (plan.hasJobChange || '无') === '无' ? '无' : `${plan.hasJobChange}${plan.jobChangeCount ? ` ${plan.jobChangeCount}人` : ''}`],
                    ] as const : [
                      ['计划开工时间', plan.startDate || '—'],
                      ['计划完工时间', plan.endDate || '—'],
                    ]),
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                      <span className="text-sm text-slate-500">{label}</span>
                      <span className="text-sm font-medium text-slate-800 text-right max-w-[250px] truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isNewOrTech && (
                <>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-primary-500" />
                      项目详细信息
                    </h4>
                    <div className="space-y-2 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                      <FieldRow label="项目必要性" value={plan.necessity} />
                      <FieldRow label="项目可行性" value={plan.projectFeasibility} />
                      <FieldRow label="项目主要内容" value={plan.modificationContent} />
                      <FieldRow label="主要设备/设施" value={plan.deviceFacility} />
                      <FieldRow label="费用估算/需求分析" value={plan.costAnalysis} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-primary-500" />
                      公辅配套
                    </h4>
                    <div className="space-y-2 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                      <FieldRow label="水" value={plan.auxWater} />
                      <FieldRow label="电" value={plan.auxElec} />
                      <FieldRow label="燃气" value={plan.auxGas} />
                      <FieldRow label="氧气/氩气（汽）" value={plan.auxOxygen} />
                      <FieldRow label="其他" value={plan.auxOther} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-primary-500" />
                      项目目标
                    </h4>
                    <div className="space-y-2 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                      <FieldRow label="技术目标" value={plan.techTarget} />
                      <FieldRow label="效益效果" value={plan.benefitTarget} />
                      <FieldRow label="其它目标" value={plan.otherTarget} />
                      <FieldRow label="创新性、智能数字化" value={plan.innovation} />
                      <FieldRow label="能源提升与评估" value={plan.energyAssess} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-primary-500" />
                      项目研究报告人员
                    </h4>
                    <div className="rounded-lg border border-slate-200 overflow-x-auto">
                      <table className="w-full text-left" style={{ minWidth: 760 }}>
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            {['序号', '工号', '姓名', '职称', '单位', '职务', '甲方工作职责', '备注'].map((h) => (
                              <th key={h} className="px-3 py-2 text-xs font-medium text-slate-500">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(plan.researchPersons || []).map((r) => (
                            <tr key={r.id} className="border-b border-slate-100">
                              <td className="px-3 py-2 text-sm text-slate-500">{r.seq}</td>
                              <td className="px-3 py-2 text-sm text-slate-600">{r.empNo || '—'}</td>
                              <td className="px-3 py-2 text-sm text-slate-800">{r.name || '—'}</td>
                              <td className="px-3 py-2 text-sm text-slate-600">{r.title || '—'}</td>
                              <td className="px-3 py-2 text-sm text-slate-600">{r.unit || '—'}</td>
                              <td className="px-3 py-2 text-sm text-slate-600">{r.position || '—'}</td>
                              <td className="px-3 py-2 text-sm text-slate-600">{r.partyDuty || '—'}</td>
                              <td className="px-3 py-2 text-sm text-slate-500">{r.remark || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

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
                      </tr>
                    </thead>
                    <tbody>
                      {paymentRows.map((r) => (
                        <tr key={r.id} className="border-b border-slate-100">
                          <td className="px-3 py-2 text-sm text-slate-700">{r.paymentType || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{r.paymentMonth || '—'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600 text-right">{r.ratio != null ? r.ratio.toFixed(2) : '—'}</td>
                          <td className="px-3 py-2 text-sm font-medium text-slate-800 text-right">{Number(r.amount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    {paymentRows.length > 0 && (
                      <tfoot>
                        <tr className="bg-slate-50">
                          <td colSpan={3} className="px-3 py-2 text-sm font-medium text-slate-700 text-right">合计</td>
                          <td className="px-3 py-2 text-sm font-semibold text-slate-800 text-right">{paymentTotal.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              {isNewOrTech && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full bg-primary-500" />
                    风险与机遇评估
                  </h4>
                  <div className="rounded-lg border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left" style={{ minWidth: 1000 }}>
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          {['序号', '风险', '风险等级', '风险状态', '风险分类', '应对策略', '执行部门'].map((h) => (
                            <th key={h} className="px-3 py-2 text-xs font-medium text-slate-500">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(plan.riskAssessRows || []).map((r) => (
                          <tr key={r.id} className="border-b border-slate-100">
                            <td className="px-3 py-2 text-sm text-slate-500">{r.seq}</td>
                            <td className="px-3 py-2 text-sm text-slate-800">{r.risk || '—'}</td>
                            <td className="px-3 py-2 text-sm text-slate-600">{r.riskLevel}</td>
                            <td className="px-3 py-2 text-sm text-slate-600">{r.riskStatus}</td>
                            <td className="px-3 py-2 text-sm text-slate-600">{r.riskCategory}</td>
                            <td className="px-3 py-2 text-sm text-slate-600">{r.strategy}</td>
                            <td className="px-3 py-2 text-sm text-slate-600">{r.execDept || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
                      </div>
                      <p className="text-xs text-slate-400">
                        文件类型：{cfg.fileFormats.join('、')} · 单文件 ≤ {cfg.fileSize}{cfg.fileSizeUnit} · 最多 {cfg.fileCount} 个
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 flex justify-end flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
