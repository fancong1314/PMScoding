interface Props {
  open: boolean;
  planName: string;
  mode: 'pass' | 'submit' | 'present';
  onClose: () => void;
  onConfirm: () => void;
}

const CONFIG = {
  pass: {
    icon: 'ri-checkbox-circle-line',
    iconColor: 'text-emerald-500',
    title: '确认会审通过',
    desc: '确认通过该项目立项会审？通过后将更新项目状态。',
    confirmText: '确认通过',
    confirmCls: 'bg-emerald-500 hover:bg-emerald-600',
  },
  submit: {
    icon: 'ri-send-plane-line',
    iconColor: 'text-sky-500',
    title: '提交至下一级',
    desc: '确认将该项目提交至下一级审查部门？',
    confirmText: '确认提交',
    confirmCls: 'bg-sky-500 hover:bg-sky-600',
  },
  present: {
    icon: 'ri-user-received-2-line',
    iconColor: 'text-sky-500',
    title: '呈核确认',
    desc: '确认将该项目呈核至部门领导审核？审核通过后将进入下一审查流程。',
    confirmText: '确认呈核',
    confirmCls: 'bg-sky-500 hover:bg-sky-600',
  },
};

export default function PassConfirmModal({ open, planName, mode, onClose, onConfirm }: Props) {
  if (!open) return null;
  const cfg = CONFIG[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-5 py-5 text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-50 mx-auto mb-3">
            <i className={`${cfg.icon} ${cfg.iconColor} text-3xl`} />
          </div>
          <h3 className="text-sm font-semibold text-steel-800 mb-1">{cfg.title}</h3>
          <p className="text-xs text-steel-500 mb-2">{cfg.desc}</p>
          <p className="text-xs text-steel-700 font-medium bg-slate-50 rounded-lg px-3 py-2 border border-steel-100 line-clamp-2">{planName}</p>
        </div>
        <div className="flex items-center gap-2 px-5 pb-5">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm text-steel-600 border border-steel-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
            取消
          </button>
          <button onClick={onConfirm}
            className={`flex-1 py-2 text-sm text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap ${cfg.confirmCls}`}>
            {cfg.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
