import { useState } from 'react';

interface Props {
  open: boolean;
  recordName: string;
  onClose: () => void;
  onConfirm: (returnType: 1 | 2, reason: string) => void;
}

export default function ReturnModal({ open, recordName, onClose, onConfirm }: Props) {
  const [returnType, setReturnType] = useState<1 | 2>(1);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  if (!open) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setReasonError('退回原因不能为空');
      return;
    }
    onConfirm(returnType, reason.trim());
    setReason('');
    setReasonError('');
    setReturnType(1);
    onClose();
  };

  const handleClose = () => {
    setReason('');
    setReasonError('');
    setReturnType(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-xl border border-steel-200 w-[480px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100" style={{ backgroundColor: '#fafbfd' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-red-500">
              <i className="ri-arrow-go-back-line text-white text-sm" />
            </div>
            <h3 className="text-sm font-semibold text-steel-800">退回操作</h3>
          </div>
          <button onClick={handleClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-steel-400 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-steel-500 truncate">
            将「<span className="font-medium text-steel-700">{recordName}</span>」退回
          </p>
          <div>
            <div className="text-sm text-steel-700 font-medium mb-2">
              退回类型 <span className="text-red-500 ml-0.5">*</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 1 as const, label: '退回立项申请人', desc: '退回给原申请人修改', icon: 'ri-user-line' },
                { val: 2 as const, label: '退回总师室', desc: '退回给总师室重新论证', icon: 'ri-building-3-line' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setReturnType(opt.val)}
                  className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    returnType === opt.val ? 'border-red-400' : 'border-steel-200 hover:border-steel-300'
                  }`}
                  style={returnType === opt.val ? { backgroundColor: '#fff5f5' } : undefined}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full ${returnType === opt.val ? 'bg-red-100' : 'bg-slate-100'}`}>
                      <i className={`${opt.icon} text-xs ${returnType === opt.val ? 'text-red-500' : 'text-steel-400'}`} />
                    </div>
                    <span className={`text-sm font-medium ${returnType === opt.val ? 'text-red-600' : 'text-steel-600'}`}>{opt.label}</span>
                  </div>
                  <p className="text-xs text-steel-400 pl-8">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-steel-700 font-medium mb-2">
              退回原因 <span className="text-red-500 ml-0.5">*</span>
            </div>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); setReasonError(''); }}
              placeholder="请填写退回原因说明（不超过500字）..."
              maxLength={500}
              rows={4}
              className={`w-full px-3 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 resize-none transition-colors ${
                reasonError ? 'border-red-400 bg-red-50/30 focus:ring-red-500/20 focus:border-red-500' : 'border-steel-200 focus:ring-primary-500/20 focus:border-primary-500'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {reasonError ? <span className="text-xs text-red-500">{reasonError}</span> : <span />}
              <span className="text-xs text-steel-400">{reason.length}/500</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100">
          <button onClick={handleClose}
            className="px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
            取消
          </button>
          <button onClick={handleConfirm}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-arrow-go-back-line mr-1.5" />
            确认退回
          </button>
        </div>
      </div>
    </div>
  );
}
