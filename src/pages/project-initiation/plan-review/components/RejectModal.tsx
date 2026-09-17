import { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  mode: 'reject' | 'supplement';
  planName: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function RejectModal({ open, mode, planName, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setReason(''); setError(''); }
  }, [open]);

  if (!open) return null;

  const isReject = mode === 'reject';
  const title = isReject ? '驳回项目' : '补充资料';
  const label = isReject ? '作废理由' : '补充理由';
  const placeholder = isReject ? '请输入驳回作废理由，必填...' : '请说明需要补充的资料内容，必填...';
  const confirmText = isReject ? '确认驳回' : '确认退回';
  const iconCls = isReject ? 'ri-close-circle-line text-red-500' : 'ri-file-add-line text-orange-500';
  const confirmBg = isReject ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600';

  const handleConfirm = () => {
    if (!reason.trim()) { setError(`${label}不能为空`); return; }
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-steel-100">
          <div className="w-8 h-8 flex items-center justify-center">
            <i className={`${iconCls} text-xl`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-steel-800">{title}</h3>
            <p className="text-xs text-steel-400 mt-0.5 line-clamp-1" title={planName}>{planName}</p>
          </div>
          <button onClick={onClose}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-steel-400 transition-colors cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          {!isReject && (
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-orange-50 border border-orange-200">
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-information-line text-orange-500 text-sm" />
              </div>
              <p className="text-xs text-orange-700 leading-relaxed">
                退回后申报人需在规定时间内补充相关资料并重新提交，请明确说明需要补充的内容。
              </p>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-steel-600 mb-1.5">
              {label} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); if (error) setError(''); }}
              placeholder={placeholder}
              rows={4}
              maxLength={500}
              className={`w-full px-3 py-2.5 text-sm rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors ${
                error ? 'border-red-400 focus:border-red-400' : 'border-steel-200 focus:border-primary-400'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {error ? <span className="text-xs text-red-500">{error}</span> : <span />}
              <span className="text-xs text-steel-400">{reason.length}/500</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-lg hover:bg-white transition-colors cursor-pointer whitespace-nowrap">
            取消
          </button>
          <button onClick={handleConfirm}
            className={`px-5 py-2 text-sm text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap ${confirmBg}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
