interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = '确认',
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-[420px] max-w-[95vw] overflow-hidden">
        <div className="px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">{title}</h3>
        </div>
        <div className="px-5 py-5">
          <p className="text-sm text-steel-600 leading-relaxed">{message}</p>
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
            onClick={onConfirm}
            className={`px-4 py-2 text-sm text-white rounded-md cursor-pointer ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
