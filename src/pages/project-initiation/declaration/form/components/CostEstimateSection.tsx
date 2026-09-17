import type { Ref } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { calcInvestmentEstimateTotal } from '@/mocks/projectPlans';
import { getAvailableAmount, planArchiveRecords } from '@/mocks/planArchiveMocks';

export type CostFeeKey = 'designFee' | 'jianAnFee' | 'equipmentFee' | 'otherFee';
export type CostRemarkKey =
  | 'designFeeRemark'
  | 'jianAnFeeRemark'
  | 'equipmentFeeRemark'
  | 'otherFeeRemark';

const FEE_ROWS: {
  feeKey: CostFeeKey;
  remarkKey: CostRemarkKey;
  label: string;
  amountPlaceholder?: string;
}[] = [
  { feeKey: 'designFee', remarkKey: 'designFeeRemark', label: '设计费' },
  { feeKey: 'jianAnFee', remarkKey: 'jianAnFeeRemark', label: '建安费' },
  { feeKey: 'equipmentFee', remarkKey: 'equipmentFeeRemark', label: '设备费' },
  {
    feeKey: 'otherFee',
    remarkKey: 'otherFeeRemark',
    label: '其他',
    amountPlaceholder: '请输入，不包含填0',
  },
];

export interface PlanAmountSummary {
  controlAmount: number;
  occupiedAmount: number;
  availableAmount: number;
}

/** 按关联年度计划解析计划管控/占用/可用金额（演示：取计划资料管理数据） */
export function resolvePlanAmountSummary(
  annualPlanId?: string,
  annualPlanNo?: string
): PlanAmountSummary | null {
  if (!annualPlanId && !annualPlanNo) return null;
  const rec =
    planArchiveRecords.find(
      (r) =>
        (annualPlanId && (r.linkedPlanId === annualPlanId || r.id === annualPlanId)) ||
        (annualPlanNo && r.planNo === annualPlanNo)
    ) || null;
  if (rec) {
    return {
      controlAmount: rec.controlAmount,
      occupiedAmount: rec.occupiedAmount,
      availableAmount: getAvailableAmount(rec),
    };
  }
  // 已选计划但档案库暂无对应记录时的演示回退
  return { controlAmount: 300, occupiedAmount: 200, availableAmount: 100 };
}

interface Props {
  data: Partial<ProjectPlan>;
  errors: Record<string, string>;
  onPatch: (patch: Partial<ProjectPlan>) => void;
  sectionRef?: Ref<HTMLDivElement>;
  readonly?: boolean;
}

function feeAmount(data: Partial<ProjectPlan>, key: CostFeeKey): number {
  if (key === 'designFee') return Number(data.designFee ?? data.installFee) || 0;
  return Number(data[key]) || 0;
}

export function validateCostEstimate(data: Partial<ProjectPlan>): Record<string, string> {
  const e: Record<string, string> = {};
  FEE_ROWS.forEach(({ feeKey }) => {
    const raw = feeKey === 'designFee' ? (data.designFee ?? data.installFee) : data[feeKey];
    if (raw === undefined || raw === null || (typeof raw === 'string' && raw === '')) {
      e[feeKey] = '请填写费用估算，不涉及填 0';
    } else if (Number(raw) < 0) {
      e[feeKey] = '费用估算不能为负数';
    }
  });
  const total = calcInvestmentEstimateTotal({
    designFee: feeAmount(data, 'designFee'),
    jianAnFee: feeAmount(data, 'jianAnFee'),
    equipmentFee: feeAmount(data, 'equipmentFee'),
    otherFee: feeAmount(data, 'otherFee'),
  });
  if (total <= 0) e.budgetAmount = '项目预算金额须大于 0，请填写各项费用';

  const isInPlan = (data.isInPlanProject || '否') === '是';
  if (isInPlan) {
    const summary = resolvePlanAmountSummary(data.annualPlanId, data.annualPlanNo);
    if (summary && total > summary.availableAmount + 1e-9) {
      e.budgetAmount = '项目预算费用不能超过计划可用金额';
    }
  }
  return e;
}

function fmt(n: number) {
  return n.toFixed(2);
}

/** 项目立项 · 项目费用概算表（设计费/建安费/设备费/其他） */
export default function CostEstimateSection({
  data,
  errors,
  onPatch,
  sectionRef,
  readonly = false,
}: Props) {
  const isInPlan = (data.isInPlanProject || '否') === '是';
  const planAmounts = isInPlan
    ? resolvePlanAmountSummary(data.annualPlanId, data.annualPlanNo)
    : null;

  const total = calcInvestmentEstimateTotal({
    designFee: feeAmount(data, 'designFee'),
    jianAnFee: feeAmount(data, 'jianAnFee'),
    equipmentFee: feeAmount(data, 'equipmentFee'),
    otherFee: feeAmount(data, 'otherFee'),
  });

  const exceedAvailable =
    !!planAmounts && total > planAmounts.availableAmount + 1e-9;

  const updateFee = (feeKey: CostFeeKey, raw: string) => {
    const amount = raw === '' ? 0 : Number(raw);
    const next = {
      designFee: feeAmount(data, 'designFee'),
      jianAnFee: feeAmount(data, 'jianAnFee'),
      equipmentFee: feeAmount(data, 'equipmentFee'),
      otherFee: feeAmount(data, 'otherFee'),
      [feeKey]: Number.isFinite(amount) ? amount : 0,
    };
    onPatch({
      ...next,
      budgetAmount: calcInvestmentEstimateTotal(next),
      declareFee: calcInvestmentEstimateTotal(next),
    });
  };

  const updateRemark = (remarkKey: CostRemarkKey, value: string) => {
    onPatch({ [remarkKey]: value.slice(0, 200) });
  };

  const remarkValue = (remarkKey: CostRemarkKey) => {
    if (remarkKey === 'designFeeRemark') {
      return (data.designFeeRemark || data.installFeeRemark || '') as string;
    }
    return (data[remarkKey] as string) || '';
  };

  return (
    <div id="cost-estimate" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i className="ri-funds-line text-emerald-500" />
          </div>
          <h3 className="text-sm font-semibold text-steel-800 flex items-center gap-0.5">
            <span className="text-red-500">*</span>
            项目费用概算表
          </h3>
        </div>
        {isInPlan && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <span className="text-steel-600 whitespace-nowrap">
              计划管控金额（万元）：
              <span className="font-semibold tabular-nums" style={{ color: '#3b82f6' }}>
                {planAmounts ? `${fmt(planAmounts.controlAmount)} 万元` : '—'}
              </span>
            </span>
            <span className="text-steel-600 whitespace-nowrap">
              计划占用金额：
              <span className="font-semibold tabular-nums" style={{ color: '#3b82f6' }}>
                {planAmounts ? `${fmt(planAmounts.occupiedAmount)} 万元` : '—'}
              </span>
            </span>
            <span className="text-steel-600 whitespace-nowrap">
              计划可用金额：
              <span className="font-semibold tabular-nums" style={{ color: '#ea580c' }}>
                {planAmounts ? `${fmt(planAmounts.availableAmount)} 万元` : '—'}
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="rounded-md border border-steel-200 overflow-hidden">
          <table className="w-full table-fixed">
            <thead>
              <tr style={{ background: '#5b9bd5' }}>
                <th className="w-[180px] px-3 py-2.5 text-left text-xs font-semibold text-white">费用类型</th>
                <th className="w-[220px] px-3 py-2.5 text-left text-xs font-semibold text-white">费用估算（万元）</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white">备注（非必填）</th>
              </tr>
            </thead>
            <tbody>
              {FEE_ROWS.map(({ feeKey, remarkKey, label, amountPlaceholder }, idx) => {
                const amount = feeAmount(data, feeKey);
                const remark = remarkValue(remarkKey);
                const amountErr = errors[feeKey];
                const rawVal = feeKey === 'designFee' ? (data.designFee ?? data.installFee) : data[feeKey];
                return (
                  <tr key={feeKey} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td className="px-3 py-2.5 text-sm text-steel-700 border-t border-steel-100">{label}</td>
                    <td className="px-3 py-2 border-t border-steel-100">
                      {readonly ? (
                        <span className="text-sm font-medium text-steel-800">
                          {rawVal != null && rawVal !== '' ? fmt(amount) : '—'}
                        </span>
                      ) : (
                        <div>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={rawVal === undefined || rawVal === null ? '' : rawVal}
                            onChange={(e) => updateFee(feeKey, e.target.value)}
                            placeholder={amountPlaceholder || '0.00'}
                            className={`w-full px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                              amountErr ? 'border-red-300 bg-red-50/30' : 'border-steel-200 bg-white'
                            }`}
                          />
                          {amountErr && <p className="mt-1 text-[11px] text-red-500">{amountErr}</p>}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 border-t border-steel-100">
                      {readonly ? (
                        <span className="text-sm text-steel-600 break-words">{remark || '—'}</span>
                      ) : (
                        <div>
                          <input
                            type="text"
                            maxLength={200}
                            value={remark}
                            onChange={(e) => updateRemark(remarkKey, e.target.value)}
                            placeholder="请输入备注，200字以内"
                            className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                          />
                          <p className="text-[10px] text-steel-300 text-right mt-0.5">{remark.length}/200</p>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="text-sm font-semibold whitespace-nowrap" style={{ color: '#ea580c' }}>
            项目预算金额（万元）：{fmt(total)} 万元
          </div>
          {(exceedAvailable || errors.budgetAmount) && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <i className="ri-error-warning-line" />
              {errors.budgetAmount || '项目预算费用不能超过计划可用金额'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** 详情/审批弹窗只读块 */
export function CostEstimateView({ plan }: { plan: ProjectPlan }) {
  return (
    <CostEstimateSection
      data={plan}
      errors={{}}
      onPatch={() => {}}
      readonly
    />
  );
}
