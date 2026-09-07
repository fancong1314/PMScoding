interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  confirmType?: 'danger' | 'primary' | 'warning';
}

export default function ConfirmModal({
  open,
  title,
  content,
  onClose,
  onConfirm,
  confirmText = '确认',
  confirmType = 'danger',
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmStyle =
    confirmType === 'danger'
      ? { background: '#ef4444' }
      : confirmType === 'warning'
      ? { background: '#eab308' }
      : { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[400px] p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-warning-50 flex-shrink-0">
            <i className="ri-alert-line text-warning-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-steel-900">{title}</h3>
            <p className="mt-1 text-sm text-steel-500">{content}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-300 rounded-md hover:bg-steel-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white rounded-md transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
            style={confirmStyle}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}