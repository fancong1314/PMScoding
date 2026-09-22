import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
  /** 已选条数，批量时展示 */
  count?: number;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  maxLength?: number;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function ReasonDialog({
  open,
  title,
  message,
  confirmText = '确认',
  danger = false,
  count,
  reasonLabel = '原因',
  reasonPlaceholder = '请输入原因',
  maxLength = 200,
  onConfirm,
  onCancel,
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
    const text = reason.trim();
    if (!text) {
      setError(`请填写${reasonLabel}`);
      return;
    }
    onConfirm(text);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-[480px] max-w-[95vw] overflow-hidden">
        <div className="px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">{title}</h3>
        </div>
        <div className="px-5 py-5 space-y-3">
          <p className="text-sm text-steel-600 leading-relaxed">
            {message}
            {typeof count === 'number' && count > 0 && (
              <span className="text-sky-600 font-medium">（共 {count} 条）</span>
            )}
          </p>
          <div>
            <label className="text-sm text-steel-600 mb-1.5 block">
              <span className="text-red-500 mr-0.5">*</span>{reasonLabel}
            </label>
            <textarea
              value={reason}
              maxLength={maxLength}
              rows={4}
              onChange={(e) => {
                setReason(e.target.value.slice(0, maxLength));
                if (error) setError('');
              }}
              placeholder={reasonPlaceholder}
              className={`w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                error ? 'border-red-300 bg-red-50/30' : 'border-steel-200'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
              <p className="text-[11px] text-steel-300">{reason.length}/{maxLength}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50/80">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-white cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm text-white rounded-md cursor-pointer ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
