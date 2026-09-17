import { useState } from 'react';

interface CompletionTimeModalProps {
  projectName: string;
  contractNo: string;
  currentDate: string;
  onClose: () => void;
  onConfirm: (newDate: string) => void;
}

export default function CompletionTimeModal({ projectName, contractNo, currentDate, onClose, onConfirm }: CompletionTimeModalProps) {
  const [date, setDate] = useState(currentDate);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleConfirm = () => {
    if (!date) { showToast('请选择竣工时间'); return; }
    onConfirm(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-[480px]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">修改竣工时间</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 w-20">工程名称</span>
              <span className="text-sm font-medium text-slate-800">{projectName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 w-20">合同号</span>
              <span className="text-sm font-medium text-slate-800">{contractNo}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 whitespace-nowrap"><span className="text-red-500">*</span>竣工时间</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button onClick={handleConfirm} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>确认</button>
        </div>
      </div>
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </div>
  );
}