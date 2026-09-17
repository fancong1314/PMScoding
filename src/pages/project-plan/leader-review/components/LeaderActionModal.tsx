import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  title: string;
  hint?: string;
  confirmText?: string;
  confirmCls?: string;
  requireReason?: boolean;
  reasonLabel?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function LeaderActionModal({
  open, title, hint, confirmText = '确认', confirmCls = 'bg-sky-500 hover:bg-sky-600',
  requireReason = false, reasonLabel = '原因说明',
  onClose, onConfirm,
}: Props) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError(`请填写${reasonLabel}`);
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">{title}</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {hint && <p className="text-sm text-steel-500 leading-relaxed">{hint}</p>}
          {requireReason && (
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">
                {reasonLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                rows={4}
                maxLength={200}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={`请输入${reasonLabel}（不超过200字）`}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none ${
                  error ? 'border-red-400 bg-red-50/30' : 'border-steel-200'
                }`}
              />
              <div className="flex items-center justify-between mt-1">
                {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
                <span className="text-xs text-steel-400">{reason.length}/200</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer">
            取消
          </button>
          <button type="button" onClick={handleConfirm}
            className={`px-4 py-2 text-sm text-white rounded-md cursor-pointer ${confirmCls}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
