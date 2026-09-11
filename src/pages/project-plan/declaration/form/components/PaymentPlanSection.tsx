import { useEffect } from 'react';
import type { PaymentPlanRow } from '@/mocks/projectPlans';

interface Props {
  rows: PaymentPlanRow[];
  budgetAmount: number;
  errors?: Record<string, string>;
  onChange: (rows: PaymentPlanRow[]) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function newRow(): PaymentPlanRow {
  return {
    id: `pp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    paymentType: '',
    paymentMonth: '',
    amount: 0,
    ratio: undefined,
    remark: '',
  };
}

export function sumPaymentAmount(rows: PaymentPlanRow[]) {
  return round2(rows.reduce((s, r) => s + (Number(r.amount) || 0), 0));
}

export function validatePaymentPlans(
  rows: PaymentPlanRow[],
  budgetAmount: number
): Record<string, string> {
  const errors: Record<string, string> = {};
  const total = sumPaymentAmount(rows);
  const budget = Number(budgetAmount) || 0;

  if (budget > 0 && total > budget + 0.001) {
    errors.paymentPlanTotal = `付款计划合计 ${total.toFixed(2)} 万元已超过投资总估算 ${budget.toFixed(2)} 万元`;
  }

  rows.forEach((r, idx) => {
    const hasAny = !!(r.paymentType.trim() || r.paymentMonth || r.amount || r.remark.trim());
    if (!hasAny) return;
    if (!r.paymentType.trim()) errors[`payment_${r.id}_type`] = `第 ${idx + 1} 行请填写付款类型`;
    if (!r.paymentMonth) errors[`payment_${r.id}_month`] = `第 ${idx + 1} 行请选择付款月份`;
    if (!r.amount || Number(r.amount) <= 0) errors[`payment_${r.id}_amount`] = `第 ${idx + 1} 行请填写付款金额`;
    if (r.remark.length > 100) errors[`payment_${r.id}_remark`] = `第 ${idx + 1} 行备注不能超过100字`;
  });

  return errors;
}

export default function PaymentPlanSection({
  rows,
  budgetAmount,
  errors = {},
  onChange,
  sectionRef,
}: Props) {
  const total = sumPaymentAmount(rows);
  const budget = Number(budgetAmount) || 0;
  const overBudget = budget > 0 && total > budget + 0.001;
  const remain = round2(Math.max(0, budget - total));

  // 投资总估算变更时，已填比例的行自动重算金额
  useEffect(() => {
    if (budget <= 0) return;
    let changed = false;
    const next = rows.map((r) => {
      if (r.ratio == null || Number.isNaN(Number(r.ratio))) return r;
      const amount = round2((budget * Number(r.ratio)) / 100);
      if (amount !== r.amount) {
        changed = true;
        return { ...r, amount };
      }
      return r;
    });
    if (changed) onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅响应投资总估算变化
  }, [budget]);

  const updateRow = (id: string, patch: Partial<PaymentPlanRow>) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const handleRatioChange = (id: string, ratioStr: string) => {
    if (ratioStr === '') {
      updateRow(id, { ratio: undefined });
      return;
    }
    const ratio = Number(ratioStr);
    if (Number.isNaN(ratio)) return;
    const amount = budget > 0 ? round2((budget * ratio) / 100) : 0;
    updateRow(id, { ratio, amount });
  };

  const handleAmountChange = (id: string, amountStr: string) => {
    const amount = amountStr === '' ? 0 : Number(amountStr);
    if (Number.isNaN(amount)) return;
    const ratio = budget > 0 ? round2((amount / budget) * 100) : undefined;
    updateRow(id, { amount, ratio });
  };

  return (
    <div id="payment-plan" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-calendar-schedule-line text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">付款计划</h3>
        <span className="text-xs text-steel-400 ml-1">按月份编制付款安排，合计不得超过投资总估算</span>
      </div>

      <div className="p-5 space-y-3">
        <div
          className={`flex items-start gap-2 px-3 py-2.5 rounded-md border text-sm ${
            budget > 0
              ? 'bg-emerald-50/60 border-emerald-100 text-emerald-800'
              : 'bg-amber-50 border-amber-100 text-amber-800'
          }`}
        >
          <i className="ri-information-line mt-0.5 flex-shrink-0" />
          <div>
            {budget > 0 ? (
              <>
                当前投资总估算为 <span className="font-semibold">{budget.toFixed(2)}</span> 万元，
                付款计划合计金额不得超过该金额；填写比例时可按投资总估算自动计算付款金额。
              </>
            ) : (
              <>请先在上方「年度计划投资估算」中填写各项费用（合计为投资总估算）后，再编制付款计划。</>
            )}
          </div>
        </div>

        <div className="overflow-x-auto border border-steel-200 rounded-lg">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-steel-200">
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left w-12">序号</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left w-36">付款类型</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left w-36">付款月份</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left w-28">比例(%)</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left w-36">付款金额(万元)</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">备注</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-center w-16">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-steel-400">
                    暂无付款计划，请点击下方「新增行」添加
                  </td>
                </tr>
              )}
              {rows.map((row, idx) => (
                <tr key={row.id} className="border-b border-steel-100 hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-sm text-steel-500">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.paymentType}
                      onChange={(e) => updateRow(row.id, { paymentType: e.target.value })}
                      placeholder="请输入"
                      className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                        errors[`payment_${row.id}_type`] ? 'border-red-300 bg-red-50/30' : 'border-steel-200'
                      }`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="month"
                      value={row.paymentMonth}
                      onChange={(e) => updateRow(row.id, { paymentMonth: e.target.value })}
                      className={`w-full px-2 py-1.5 text-sm border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                        errors[`payment_${row.id}_month`] ? 'border-red-300 bg-red-50/30' : 'border-steel-200'
                      }`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={row.ratio ?? ''}
                      onChange={(e) => handleRatioChange(row.id, e.target.value)}
                      placeholder="按比例"
                      disabled={budget <= 0}
                      className="w-full px-2 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-slate-50 disabled:text-steel-300"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={row.amount || ''}
                      onChange={(e) => handleAmountChange(row.id, e.target.value)}
                      placeholder="0.00"
                      className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                        errors[`payment_${row.id}_amount`] ? 'border-red-300 bg-red-50/30' : 'border-steel-200'
                      }`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.remark}
                      maxLength={100}
                      onChange={(e) => updateRow(row.id, { remark: e.target.value.slice(0, 100) })}
                      placeholder="100字以内"
                      className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                        errors[`payment_${row.id}_remark`] ? 'border-red-300 bg-red-50/30' : 'border-steel-200'
                      }`}
                    />
                    <p className="text-[10px] text-steel-300 mt-0.5 text-right">{row.remark.length}/100</p>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => onChange(rows.filter((r) => r.id !== row.id))}
                      className="w-7 h-7 inline-flex items-center justify-center text-steel-400 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer"
                      title="删除"
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50">
                  <td colSpan={3} className="px-3 py-2.5 text-sm font-medium text-steel-700 text-right">
                    合计
                  </td>
                  <td className="px-3 py-2.5 text-sm text-steel-500">
                    {budget > 0 ? `${round2((total / budget) * 100).toFixed(2)}%` : '—'}
                  </td>
                  <td className={`px-3 py-2.5 text-sm font-semibold ${overBudget ? 'text-red-600' : 'text-steel-800'}`}>
                    {total.toFixed(2)}
                  </td>
                  <td colSpan={2} className="px-3 py-2.5 text-xs text-steel-400">
                    {budget > 0 ? `剩余可分配 ${remain.toFixed(2)} 万元` : ''}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {(errors.paymentPlanTotal || overBudget) && (
          <p className="text-xs text-red-500">
            {errors.paymentPlanTotal || `付款计划合计 ${total.toFixed(2)} 万元已超过投资总估算 ${budget.toFixed(2)} 万元`}
          </p>
        )}

        <button
          type="button"
          onClick={() => onChange([...rows, newRow()])}
          className="px-3 py-1.5 text-sm border border-dashed border-emerald-300 text-emerald-600 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-1" />
          新增行
        </button>
      </div>
    </div>
  );
}
