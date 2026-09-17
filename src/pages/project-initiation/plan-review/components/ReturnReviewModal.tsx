import { useEffect, useState } from 'react';
import { INIT_RETURN_RESTART_NODE_OPTIONS, type ReturnRestartNode } from '@/mocks/planReviewMocks';

interface Props {
  open: boolean;
  planName: string;
  onClose: () => void;
  onConfirm: (reason: string, restartNode: ReturnRestartNode) => void;
}

export default function ReturnReviewModal({ open, planName, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState('');
  const [restartNode, setRestartNode] = useState<ReturnRestartNode>('re_joint');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setRestartNode('re_joint');
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('退回理由不能为空');
      return;
    }
    onConfirm(reason.trim(), restartNode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-steel-100">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-50">
            <i className="ri-arrow-go-back-line text-orange-500 text-lg" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-steel-800">退回项目</h3>
            <p className="text-xs text-steel-400 mt-0.5 line-clamp-1" title={planName}>{planName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-steel-400 cursor-pointer"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-orange-50 border border-orange-200">
            <i className="ri-information-line text-orange-500 text-sm mt-0.5" />
            <p className="text-xs text-orange-700 leading-relaxed">
              退回后需填写退回理由，并指定重新提交后从哪个节点开始审批。
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-steel-600 mb-1.5">
              退回理由 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="请输入退回理由，必填..."
              rows={4}
              maxLength={500}
              className={`w-full px-3 py-2.5 text-sm rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                error ? 'border-red-400' : 'border-steel-200 focus:border-primary-400'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {error ? <span className="text-xs text-red-500">{error}</span> : <span />}
              <span className="text-xs text-steel-400">{reason.length}/500</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-steel-600 mb-2">
              重新提交后起始审批节点 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {INIT_RETURN_RESTART_NODE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                    restartNode === opt.value
                      ? 'border-primary-400 bg-primary-50/50'
                      : 'border-steel-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="restart-node"
                    checked={restartNode === opt.value}
                    onChange={() => setRestartNode(opt.value)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-steel-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-lg hover:bg-white cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 text-sm text-white rounded-lg bg-orange-500 hover:bg-orange-600 cursor-pointer"
          >
            确认退回
          </button>
        </div>
      </div>
    </div>
  );
}
