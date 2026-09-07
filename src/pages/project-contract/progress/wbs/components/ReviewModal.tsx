import { useState } from 'react';
import type { Contract } from '@/mocks/contractProgressMocks';

interface ReviewModalProps {
  contract: Contract;
  onClose: () => void;
}

export default function ReviewModal({ contract, onClose }: ReviewModalProps) {
  const [result, setResult] = useState<'pass' | 'reject'>('pass');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const l1Count = contract.wbsTasks.filter((t) => t.level === 1).length;
  const l2Count = contract.wbsTasks.filter((t) => t.level === 2).length;
  const l3Count = contract.wbsTasks.filter((t) => t.level === 3).length;
  const totalWeight = contract.wbsTasks.filter((t) => t.level === 1).reduce((s, t) => s + t.weight, 0);
  const weightValid = totalWeight === 100;

  const handleSubmit = () => {
    if (result === 'reject' && !comment.trim()) {
      setError('审核驳回时必须填写审核意见');
      return;
    }
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[560px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #e8edf3' }}>
          <h3 className="text-sm font-semibold text-steel-800">WBS拆解整体审核</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary */}
          <div className="bg-slate-50 rounded-md p-3">
            <p className="text-xs font-medium text-steel-700 mb-2">WBS拆解概要</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-steel-800">{l1Count}</p>
                <p className="text-xs text-steel-500">1级任务</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-steel-800">{l2Count}</p>
                <p className="text-xs text-steel-500">2级任务</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-steel-800">{l3Count}</p>
                <p className="text-xs text-steel-500">3级任务</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-steel-800">{contract.wbsTasks.length}</p>
                <p className="text-xs text-steel-500">总任务数</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-steel-500">权重校验：</span>
              <span className={`text-xs font-medium ${weightValid ? 'text-emerald-600' : 'text-red-600'}`}>
                {weightValid ? '权重合计100%，校验通过' : `权重合计${totalWeight}%，校验不通过`}
              </span>
            </div>
          </div>

          {/* Result */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-steel-500 font-medium">审核结果</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reviewResult"
                  checked={result === 'pass'}
                  onChange={() => { setResult('pass'); setError(''); }}
                  className="w-4 h-4 accent-primary-500"
                />
                <span className="text-sm text-steel-700">整体通过</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reviewResult"
                  checked={result === 'reject'}
                  onChange={() => setResult('reject')}
                  className="w-4 h-4 accent-red-500"
                />
                <span className="text-sm text-steel-700">整体驳回</span>
              </label>
            </div>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-steel-500 font-medium">
              整体审核意见 {result === 'reject' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={comment}
              onChange={(e) => { setComment(e.target.value); setError(''); }}
              placeholder={result === 'reject' ? '请填写驳回原因及整体修改意见...' : '可填写审核意见（选填）'}
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-400 resize-none"
            />
            <span className="text-xs text-steel-400 text-right">{comment.length}/500</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: '1px solid #e8edf3' }}>
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            确认提交
          </button>
        </div>
      </div>
    </div>
  );
}