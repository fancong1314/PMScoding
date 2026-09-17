import { projectPlans, withPaymentPlans, withInitiationDetailFields, withInvestmentEstimateFields, initiationMajorTypeFormPath } from '@/mocks/projectPlans';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { getInitiationDeclarationAttachmentConfigs } from '@/mocks/archiveConfigMocks';
import { FormViewBlock, FormViewItem } from '@/components/feature/FormLayout';
import { CostEstimateView } from '@/pages/project-initiation/declaration/form/components/CostEstimateSection';

interface Props {
  open: boolean;
  linkedPlanId: string;
  fallbackName?: string;
  onClose: () => void;
  onEdit?: () => void;
}

function getPlan(linkedPlanId: string): ProjectPlan | null {
  try {
    const keys = ['ng_init_decl_plans_v9', 'ng_init_decl_plans_v8', 'ng_init_decl_plans_v7', 'ng_init_decl_plans_v6'];
    for (const key of keys) {
      const s = localStorage.getItem(key);
      if (s) {
        const list = JSON.parse(s) as ProjectPlan[];
        const found = list.find((p) => p.id === linkedPlanId);
        if (found) {
          return withInvestmentEstimateFields(withPaymentPlans(withInitiationDetailFields(found)));
        }
      }
    }
  } catch { /* noop */ }
  const fromMock = projectPlans.find((p) => p.id === linkedPlanId);
  return fromMock
    ? withInvestmentEstimateFields(withPaymentPlans(withInitiationDetailFields(fromMock)))
    : null;
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
  { field: 'equipmentDesc', label: '设备装备描述' },
  { field: 'projectSummary', label: '项目总体结论' },
];

export default function PlanReviewDetailModal({ open, linkedPlanId, fallbackName, onClose, onEdit }: Props) {
  if (!open) return null;

  const plan = getPlan(linkedPlanId);

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
              <FormViewBlock title="业务信息">
                <FormViewItem label="项目大类" value={plan.projectMajorType} />
                <FormViewItem label="计划年度" value={`${plan.planYear}年`} />
                <FormViewItem label="项目提报单位" value={plan.businessDivision} />
                <FormViewItem label="提报部门" value={plan.submitDept} />
                <FormViewItem label="实施主管部门" value={plan.implementDept} />
                <FormViewItem label="项目类别" value={plan.projectCategory} />
                <FormViewItem label="立项总概算" value={`${plan.budgetAmount.toFixed(2)} 万元`} />
                <FormViewItem label="项目负责人" value={plan.projectManager} />
                <FormViewItem label="负责人电话" value={plan.projectManagerPhone} />
                <FormViewItem label="计划开工时间" value={plan.startDate} />
                <FormViewItem label="计划完工时间" value={plan.endDate} />
                {plan.projectMajorType === '营缮' && (
                  <>
                    <FormViewItem label="是否资本性营缮" value={plan.isCapitalOverhaul} />
                    <FormViewItem label="设备名称" value={plan.equipmentName} />
                    <FormViewItem label="设备营缮理由" value={plan.overhaulReason} multiline fullWidth />
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
                    <FormViewItem label="是否新增零固" value={plan.isNewMinor} />
                    <FormViewItem label="更新理由" value={plan.updateReason} multiline fullWidth />
                  </>
                )}
              </FormViewBlock>

              {(plan.projectMajorType === '新建' || plan.projectMajorType === '技改') && (
                <FormViewBlock title="项目详细信息">
                  {DETAIL_FIELDS.map(({ field, label }) => (
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

              <CostEstimateView plan={plan} />

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-primary-500" />
                  附件上传
                </h4>
                <div className="space-y-2">
                  {getInitiationDeclarationAttachmentConfigs(plan.projectMajorType).map((cfg) => (
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
