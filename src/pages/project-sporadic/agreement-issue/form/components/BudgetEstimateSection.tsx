import type { SporadicBudgetEstimate } from '@/mocks/sporadicProjectMocks';
import { calcBudgetEstimateTotal } from '@/mocks/sporadicProjectMocks';

type FeeKey = 'designFee' | 'jianAnFee' | 'equipmentFee' | 'otherFee';
type RemarkKey = 'designFeeRemark' | 'jianAnFeeRemark' | 'equipmentFeeRemark' | 'otherFeeRemark';

const FEE_ROWS: { feeKey: FeeKey; remarkKey: RemarkKey; label: string }[] = [
  { feeKey: 'designFee', remarkKey: 'designFeeRemark', label: '设计费' },
  { feeKey: 'jianAnFee', remarkKey: 'jianAnFeeRemark', label: '建安费' },
  { feeKey: 'equipmentFee', remarkKey: 'equipmentFeeRemark', label: '设备费' },
  { feeKey: 'otherFee', remarkKey: 'otherFeeRemark', label: '其他' },
];

function fmt(n: number) {
  return n.toFixed(2);
}

export function validateBudgetEstimate(data: SporadicBudgetEstimate): Record<string, string> {
  const e: Record<string, string> = {};
  FEE_ROWS.forEach(({ feeKey }) => {
    const raw = data[feeKey];
    if (raw === undefined || raw === null || Number.isNaN(Number(raw))) {
      e[feeKey] = '请填写费用估算，不涉及填 0';
    } else if (Number(raw) < 0) {
      e[feeKey] = '费用估算不能为负数';
    }
  });
  if (calcBudgetEstimateTotal(data) <= 0) {
    e.budgetAmount = '项目预算金额须大于 0，请填写各项费用';
  }
  return e;
}

interface Props {
  data: SporadicBudgetEstimate;
  errors?: Record<string, string>;
  onChange: (next: SporadicBudgetEstimate) => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
  readonly?: boolean;
}

/** 签发页 · 项目预算栏目 */
export default function BudgetEstimateSection({
  data,
  errors = {},
  onChange,
  sectionRef,
  readonly = false,
}: Props) {
  const total = calcBudgetEstimateTotal(data);

  const updateFee = (feeKey: FeeKey, raw: string) => {
    if (readonly) return;
    const amount = raw === '' ? 0 : Number(raw);
    onChange({
      ...data,
      [feeKey]: Number.isFinite(amount) ? amount : 0,
    });
  };

  const updateRemark = (remarkKey: RemarkKey, value: string) => {
    if (readonly) return;
    onChange({ ...data, [remarkKey]: value.slice(0, 200) });
  };

  return (
    <div id="project-budget" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <i className="ri-funds-line text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800 flex items-center gap-0.5">
          <span className="text-red-500">*</span>
          项目预算
        </h3>
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
              {FEE_ROWS.map(({ feeKey, remarkKey, label }, idx) => {
                const remark = (data[remarkKey] || '') as string;
                const amountErr = errors[feeKey];
                return (
                  <tr key={feeKey} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td className="px-3 py-2.5 text-sm text-steel-700 border-t border-steel-100">{label}</td>
                    <td className="px-3 py-2 border-t border-steel-100">
                      {readonly ? (
                        <span className="text-sm font-medium text-steel-800">{fmt(Number(data[feeKey]) || 0)}</span>
                      ) : (
                        <div>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={data[feeKey]}
                            onChange={(e) => updateFee(feeKey, e.target.value)}
                            placeholder="0.00"
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
          {errors.budgetAmount && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <i className="ri-error-warning-line" />
              {errors.budgetAmount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
