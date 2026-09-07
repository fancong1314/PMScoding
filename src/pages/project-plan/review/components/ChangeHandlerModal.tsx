import { useState } from 'react';
import { reviewStaffList } from '@/mocks/reviewMocks';

interface Props {
  open: boolean;
  currentHandler: string;
  recordName: string;
  onClose: () => void;
  onConfirm: (newHandler: string) => void;
}

export default function ChangeHandlerModal({ open, currentHandler, recordName, onClose, onConfirm }: Props) {
  const [selected, setSelected] = useState(currentHandler);

  if (!open) return null;

  const handleConfirm = () => {
    if (selected && selected !== currentHandler) {
      onConfirm(selected);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-steel-200 w-[420px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100" style={{ backgroundColor: '#fafbfd' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <i className="ri-user-settings-line text-white text-sm" />
            </div>
            <h3 className="text-sm font-semibold text-steel-800">更换经办人</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-steel-400 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-steel-500 mb-3 truncate">
            为「<span className="font-medium text-steel-700">{recordName}</span>」更换审核经办人
          </p>
          <div className="text-xs text-steel-500 mb-2">当前经办人：<span className="font-medium text-steel-700">{currentHandler}</span></div>
          <div className="text-xs text-steel-500 mb-2">选择新经办人：</div>
          <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
            {reviewStaffList.map((staff) => (
              <button
                key={staff}
                onClick={() => setSelected(staff)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all cursor-pointer text-left whitespace-nowrap ${
                  selected === staff
                    ? 'border-primary-400 font-medium'
                    : 'border-steel-200 text-steel-600 hover:border-steel-300 hover:bg-slate-50'
                }`}
                style={selected === staff ? { backgroundColor: '#eff6ff', color: '#2563eb' } : undefined}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={selected === staff ? { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white' } : { backgroundColor: '#e8edf3', color: '#64748b' }}>
                    {staff[0]}
                  </div>
                  <span>{staff}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || selected === currentHandler}
            className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            确认更换
          </button>
        </div>
      </div>
    </div>
  );
}
