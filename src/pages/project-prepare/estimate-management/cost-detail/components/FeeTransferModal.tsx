import { useMemo, useState } from 'react';
import {
  ESTIMATE_FEE_TYPES,
  applyFeeTransfer,
  formatCurrencyFixed,
  getProjectFeeLines,
  type EstimateFeeType,
  type EstimateProject,
  type FeeTransferInput,
} from '@/mocks/estimateManagementMocks';
import { FormField, formInputCls } from '@/components/feature/FormLayout';

interface Props {
  project: EstimateProject;
  onClose: () => void;
  onSaved: () => void;
}

interface RowDraft {
  direction: '加' | '减';
  amount: string;
}

const emptyDraft = (): Record<EstimateFeeType, RowDraft> => ({
  设计费: { direction: '减', amount: '' },
  建安费: { direction: '加', amount: '' },
  设备费: { direction: '加', amount: '' },
  其他费: { direction: '减', amount: '' },
});

/** 费用调拨弹窗：可用金额总和不变，单项按万元增减 */
export default function FeeTransferModal({ project, onClose, onSaved }: Props) {
  const lines = useMemo(() => getProjectFeeLines(project.id), [project.id]);
  const [drafts, setDrafts] = useState(emptyDraft);
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');

  const preview = useMemo(() => {
    return lines.map((line) => {
      const draft = drafts[line.type];
      const wan = Number(draft.amount);
      const yuan = !draft.amount || Number.isNaN(wan) || wan <= 0
        ? 0
        : Math.round(wan * 10000 * 100) / 100;
      const signed = draft.direction === '加' ? yuan : -yuan;
      return {
        ...line,
        afterAvailable: Math.round((line.availableAmount + signed) * 100) / 100,
        signed,
      };
    });
  }, [lines, drafts]);

  const sumActual = preview.reduce((s, r) => s + r.actualAmount, 0);
  const sumAvailable = preview.reduce((s, r) => s + r.availableAmount, 0);
  const sumAfter = preview.reduce((s, r) => s + r.afterAvailable, 0);
  const net = preview.reduce((s, r) => s + r.signed, 0);

  const patch = (type: EstimateFeeType, partial: Partial<RowDraft>) => {
    setDrafts((prev) => ({ ...prev, [type]: { ...prev[type], ...partial } }));
    setError('');
  };

  const handleConfirm = () => {
    const inputs: FeeTransferInput[] = ESTIMATE_FEE_TYPES.map((type) => ({
      type,
      direction: drafts[type].direction,
      amountWan: Number(drafts[type].amount) || 0,
    }));
    const result = applyFeeTransfer(project.id, inputs, remark);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[960px] max-w-[96vw] max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="px-6 pt-5 pb-3">
          <h3 className="text-base font-bold text-slate-900">费用调拨</h3>
        </div>

        <div className="px-6 pb-3">
          <div className="rounded-md bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700 leading-relaxed">
            费用调拨无法修改可用总金额，调拨后可用金额总和必须等于原可用金额总和。例：可将建安费的一部分调拨至设备费。调拨金额单位为万元，确认后按 1 万元 = 10,000 元计入。
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6">
          <div className="border border-slate-200 overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#7dd3fc' }}>
                  <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">费用类型</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap">实际立项金额（元）</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap">可用金额（元）</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap">调拨后可用金额（元）</th>
                  <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">费用调拨（万元）</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row) => (
                  <tr key={row.type} className="border-t border-slate-200">
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{row.type}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.actualAmount)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.availableAmount)}</td>
                    <td className={`px-3 py-2.5 text-right font-mono font-medium ${row.afterAvailable < 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {formatCurrencyFixed(row.afterAvailable)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={drafts[row.type].direction}
                          onChange={(e) => patch(row.type, { direction: e.target.value as '加' | '减' })}
                          className="px-2 py-1.5 text-sm border border-slate-200 rounded bg-white cursor-pointer"
                        >
                          <option value="减">减</option>
                          <option value="加">加</option>
                        </select>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={drafts[row.type].amount}
                          onChange={(e) => patch(row.type, { amount: e.target.value })}
                          placeholder="请输入"
                          className="w-28 px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td className="px-3 py-2.5 font-medium text-sky-600">合计</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sky-600">{formatCurrencyFixed(sumActual)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sky-600">{formatCurrencyFixed(sumAvailable)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-amber-600">{formatCurrencyFixed(sumAfter)}</td>
                  <td className={`px-3 py-2.5 font-mono font-medium ${Math.abs(net) > 0.01 ? 'text-red-600' : 'text-emerald-600'}`}>
                    净额 {net > 0 ? '+' : ''}{formatCurrencyFixed(net)} 元
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <FormField label="备注" topAlign>
              <textarea
                rows={3}
                maxLength={100}
                value={remark}
                onChange={(e) => setRemark(e.target.value.slice(0, 100))}
                placeholder="请输入备注（100字以内）"
                className={formInputCls() + ' resize-none'}
              />
              <p className="text-xs text-steel-400 text-right mt-1">{remark.length}/100</p>
            </FormField>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 text-sm border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer bg-white"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-1.5 text-sm rounded text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
