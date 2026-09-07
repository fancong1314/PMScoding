import { useState } from 'react';

interface Props {
  open: boolean;
  recordName: string;
  investAmount: number;
  onClose: () => void;
  onConfirm: (amount: number, reason: string) => void;
}

export default function ReduceAmountModal({ open, recordName, investAmount, onClose, onConfirm }: Props) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; reason?: string }>({});

  if (!open) return null;

  const handleConfirm = () => {
    const e: { amount?: string; reason?: string } = {};
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) e.amount = '请输入有效的核减金额（大于0）';
    else if (num >= investAmount) e.amount = `核减金额不能大于等于投资总额（${investAmount.toFixed(2)} 万元）`;
    if (!reason.trim()) e.reason = '请填写核减原因';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onConfirm(num, reason.trim());
    setAmount('');
    setReason('');
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    setReason('');
    setErrors({});
    onClose();
  };

  const remaining = investAmount - (parseFloat(amount) || 0);

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-xl border border-steel-200 w-[480px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100" style={{ backgroundColor: '#fafbfd' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-orange-500">
              <i className="ri-funds-box-line text-white text-sm" />
            </div>
            <h3 className="text-sm font-semibold text-steel-800">核减金额</h3>
          </div>
          <button onClick={handleClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-steel-400 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-steel-500 line-clamp-1">
            对「<span className="font-medium text-steel-700">{recordName}</span>」进行投资金额核减
          </p>

          {/* Amount info */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg" style={{ backgroundColor: '#fafbfd', border: '1px solid #e8edf3' }}>
            <div className="text-center">
              <p className="text-xs text-steel-400 mb-1">立项投资总额</p>
              <p className="text-base font-bold text-steel-800">{investAmount.toFixed(2)} <span className="text-xs font-normal text-steel-400">万元</span></p>
            </div>
            <div className="text-center border-l border-steel-100">
              <p className="text-xs text-steel-400 mb-1">核减后余额（预估）</p>
              <p className={`text-base font-bold ${remaining > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {remaining > 0 ? remaining.toFixed(2) : '—'} <span className="text-xs font-normal text-steel-400">万元</span>
              </p>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium text-steel-700 mb-1.5">
              核减金额 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={0.01}
                step="1"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: undefined })); }}
                placeholder="请输入核减金额"
                className={`w-full px-3 py-2.5 text-sm pr-12 border rounded-md focus:outline-none focus:ring-2 transition-colors ${errors.amount ? 'border-red-400 bg-red-50/30 focus:ring-red-500/20' : 'border-steel-200 focus:ring-primary-500/20 focus:border-primary-500'}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">万元</span>
            </div>
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
          </div>

          {/* Reason input */}
          <div>
            <label className="block text-sm font-medium text-steel-700 mb-1.5">
              核减原因 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); setErrors((p) => ({ ...p, reason: undefined })); }}
              placeholder="请填写核减原因说明..."
              maxLength={300}
              rows={3}
              className={`w-full px-3 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 resize-none transition-colors ${errors.reason ? 'border-red-400 bg-red-50/30 focus:ring-red-500/20' : 'border-steel-200 focus:ring-primary-500/20 focus:border-primary-500'}`}
            />
            <div className="flex items-center justify-between mt-0.5">
              {errors.reason ? <span className="text-xs text-red-500">{errors.reason}</span> : <span />}
              <span className="text-xs text-steel-400">{reason.length}/300</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100">
          <button onClick={handleClose}
            className="px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
            取消
          </button>
          <button onClick={handleConfirm}
            className="px-4 py-2 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5">
            <i className="ri-funds-box-line" />
            确认核减
          </button>
        </div>
      </div>
    </div>
  );
}
