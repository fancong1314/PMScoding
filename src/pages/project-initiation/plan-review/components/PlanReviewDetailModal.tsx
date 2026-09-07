import { projectPlans, withPaymentPlans, initiationMajorTypeFormPath } from '@/mocks/projectPlans';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { getPlanDeclarationAttachmentConfigs } from '@/mocks/archiveConfigMocks';

interface Props {
  open: boolean;
  linkedPlanId: string;
  fallbackName?: string;
  onClose: () => void;
  onEdit?: () => void;
}

function getPlan(linkedPlanId: string): ProjectPlan | null {
  try {
    const keys = ['ng_init_decl_plans_v1', 'ng_decl_plans_v8', 'ng_decl_plans_v7'];
    for (const key of keys) {
      const s = localStorage.getItem(key);
      if (s) {
        const list = JSON.parse(s) as ProjectPlan[];
        const found = list.find((p) => p.id === linkedPlanId);
        if (found) return withPaymentPlans(found);
      }
    }
  } catch { /* noop */ }
  const fromMock = projectPlans.find((p) => p.id === linkedPlanId);
  return fromMock ? withPaymentPlans(fromMock) : null;
}

const DETAIL_FIELDS: { field: keyof ProjectPlan; label: string }[] = [
  { field: 'currentSituation', label: '现状' },
  { field: 'necessity', label: '改造必要性' },
  { field: 'innovation', label: '项目创新性' },
  { field: 'processDesc', label: '工艺描述' },
  { field: 'overallIdea', label: '改造总体思路' },
  { field: 'modificationContent', label: '改造主要内容' },
  { field: 'modificationPurpose', label: '改造目的' },
  { field: 'effectDescription', label: '效果说明/效益计算' },
  { field: 'projectSummary', label: '项目概要总体描述' },
];

export default function PlanReviewDetailModal({ open, linkedPlanId, fallbackName, onClose, onEdit }: Props) {
  if (!open) return null;

  const plan = getPlan(linkedPlanId);
  const paymentRows = plan?.paymentPlans || [];
  const paymentTotal = paymentRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

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
              <button
                type="button"
                onClick={onEdit}
                className="px-3 py-1.5 text-xs text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer"
              >
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
                  {[
                    ['项目大类', plan.projectMajorType],
                    ['计划年度', `${plan.planYear}年`],
                    ['项目单位', plan.businessDivision],
                    ['项目类别', plan.projectCategory],
                    ['投资总估算', `${plan.budgetAmount.toFixed(2)} 万元`],
                    ['项目负责人', plan.projectManager],
                    ['负责人电话', plan.projectManagerPhone || '—'],
                    ['计划开工时间', plan.startDate || '—'],
                    ['计划完工时间', plan.endDate || '—'],
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                      <span className="text-sm text-slate-500">{label}</span>
                      <span className="text-sm font-medium text-slate-800 text-right max-w-[250px] truncate">{value}</span>
                    </div>
                  ))}
                  {plan.projectMajorType === '大修' && (
                    <>
                      <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                        <span className="text-sm text-slate-500">是否资本性大修</span>
                        <span className="text-sm font-medium text-slate-800">{plan.isCapitalOverhaul || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                        <span className="text-sm text-slate-500">设备名称</span>
                        <span className="text-sm font-medium text-slate-800">{plan.equipmentName || '—'}</span>
                      </div>
                      <div className="col-span-2 flex items-start justify-between py-1.5 px-3 rounded bg-white">
                        <span className="text-sm text-slate-500 flex-shrink-0">设备大修理由</span>
                        <span className="text-sm text-slate-700 text-right">{plan.overhaulReason || '—'}</span>
                      </div>
                    </>
                  )}
                  {plan.projectMajorType === '零固' && (
                    <>
                      <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                        <span className="text-sm text-slate-500">规格型号</span>
                        <span className="text-sm font-medium text-slate-800">{plan.specModel || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-3 rounded bg-white">
                        <span className="text-sm text-slate-500">是否新增零固</span>
                        <span className="text-sm font-medium text-slate-800">{plan.isNewMinor || '—'}</span>
                      </div>
                      <div className="col-span-2 flex items-start justify-between py-1.5 px-3 rounded bg-white">
                        <span className="text-sm text-slate-500 flex-shrink-0">更新理由</span>
                        <span className="text-sm text-slate-700 text-right">{plan.updateReason || '—'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full bg-primary-500" />
                    项目详细信息
                  </h4>
                  <div className="space-y-2 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                    {DETAIL_FIELDS.map(({ field, label }) => (
                      <div key={field} className="flex items-start gap-4 py-2 px-3 rounded bg-white">
                        <span className="text-sm text-slate-500 w-36 flex-shrink-0">{label}</span>
                        <span className="text-sm text-slate-700 flex-1 whitespace-pre-wrap">
                          {(plan[field] as string) || '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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
                      {paymentRows.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-3 py-4 text-center text-sm text-slate-400">暂无付款计划</td>
                        </tr>
                      )}
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

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-primary-500" />
                  附件上传
                </h4>
                <div className="space-y-2">
                  {getPlanDeclarationAttachmentConfigs(plan.projectMajorType).map((cfg) => (
                    <div key={cfg.id} className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-800">{cfg.docName}</span>
                        {cfg.required && <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-50 text-red-600 border border-red-100">必填</span>}
                      </div>
                      <p className="text-xs text-slate-400">文件类型：{cfg.fileFormats.join('、')}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-300 mt-2">
                  表单路径：{initiationMajorTypeFormPath[plan.projectMajorType]}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end px-6 py-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-slate-50 cursor-pointer">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
