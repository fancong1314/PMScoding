import { useEffect, useState } from 'react';
import type { PlanArchiveRecord } from '@/mocks/planArchiveMocks';
import { getAvailableAmount } from '@/mocks/planArchiveMocks';

interface Props {
  open: boolean;
  record: PlanArchiveRecord | null;
  onClose: () => void;
  /** 提交费用增补：进入审批中 */
  onSubmit: (recordId: string, newControlAmount: number) => void;
}

export default function EditControlAmountModal({ open, record, onClose, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && record) {
      setValue(record.controlAmount.toFixed(2));
      setError('');
    }
  }, [open, record]);

  if (!open || !record) return null;

  const occupied = record.occupiedAmount;
  const available = getAvailableAmount(record);

  const handleConfirm = () => {
    const num = Number(value);
    if (!value.trim() || Number.isNaN(num)) {
      setError('请输入有效的计划管控金额');
      return;
    }
    if (num < occupied) {
      setError('修改后的计划管控金额不能小于计划占用金额');
      return;
    }
    if (num === record.controlAmount) {
      setError('请修改为与当前管控金额不同的数值');
      return;
    }
    onSubmit(record.id, Number(num.toFixed(2)));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg border border-steel-200 w-[480px] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-900">修改计划管控金额</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-steel-400 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">
            <i className="ri-error-warning-line mt-0.5 flex-shrink-0" />
            <span>修改后的计划管控金额不能小于计划占用金额</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="w-[130px] flex-shrink-0 text-right text-steel-600 pt-0.5">年度计划名称</span>
              <span className="text-steel-800 leading-relaxed">{record.planName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-[130px] flex-shrink-0 text-right text-steel-600">计划管控金额（万元）</span>
              <span className="font-semibold text-red-500 tabular-nums">{record.controlAmount.toFixed(2)}万元</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-[130px] flex-shrink-0 text-right text-steel-600">计划可用金额</span>
              <span className="text-steel-800 tabular-nums">{available.toFixed(2)}万元</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-[130px] flex-shrink-0 text-right text-steel-600">计划占用金额</span>
              <span className="text-steel-800 tabular-nums">{occupied.toFixed(2)}万元</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-[130px] flex-shrink-0 text-right text-steel-600 whitespace-nowrap">
                将计划管控金额修改至
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setError('');
                  }}
                  className={`w-40 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 tabular-nums ${
                    error
                      ? 'border-red-400 bg-red-50/30 focus:ring-red-500/20'
                      : 'border-steel-200 focus:ring-primary-500/20 focus:border-primary-500'
                  }`}
                />
                <span className="text-sm text-steel-500">万元</span>
              </div>
            </div>
            {error && <p className="text-xs text-red-500 pl-[142px]">{error}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-300 rounded-md hover:bg-slate-50 cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
