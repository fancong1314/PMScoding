import { useState } from 'react';
import type { EstimateItem } from '@/mocks/estimateManagementMocks';
import { formatCurrency } from '@/mocks/estimateManagementMocks';

interface ModifyModalProps {
  item: EstimateItem;
  onClose: () => void;
  onSave: (data: { revisedAmount: number; demandAmount: number }) => void;
}

export default function ModifyModal({ item, onClose, onSave }: ModifyModalProps) {
  const [revisedAmount, setRevisedAmount] = useState(item.revisedAmount);
  const [demandAmount, setDemandAmount] = useState(item.demandAmount);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (revisedAmount < 0) {
      setError('概算修订金额必须大于等于0');
      return;
    }
    if (demandAmount < 0) {
      setError('工程需求动用金额必须大于等于0');
      return;
    }
    if (demandAmount > revisedAmount) {
      setError('工程需求动用金额不能大于概算修订金额');
      return;
    }
    setError('');
    onSave({ revisedAmount, demandAmount });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[640px] max-w-[90vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">修改概算明细</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {/* Buttons */}
          <div className="flex items-center gap-2 mb-4">
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md text-white cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
                <i className="ri-save-line" />
              </div>
              保存修改
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
                <i className="ri-close-line" />
              </div>
              关闭
            </button>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">费用名称</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md text-slate-700 border border-slate-200">
                  {item.name}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  概算修订金额(元)
                  <span className="text-amber-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  value={revisedAmount}
                  onChange={(e) => { setRevisedAmount(Number(e.target.value)); setError(''); }}
                  className="w-full px-3 py-2 text-sm border border-amber-300 rounded-md focus:outline-none focus:border-amber-500 font-mono"
                />
                <div className="text-xs text-amber-500 mt-0.5">可修改</div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  工程需求动用金额(元)
                  <span className="text-amber-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  value={demandAmount}
                  onChange={(e) => { setDemandAmount(Number(e.target.value)); setError(''); }}
                  className="w-full px-3 py-2 text-sm border border-amber-300 rounded-md focus:outline-none focus:border-amber-500 font-mono"
                />
                <div className="text-xs text-amber-500 mt-0.5">可修改</div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">合同动用金额(元)</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md text-slate-700 font-mono border border-slate-200">
                  {formatCurrency(item.contractAmount)}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">创建人</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md text-slate-500 border border-slate-200">
                  {item.creator}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">修改人</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md text-slate-500 border border-slate-200">
                  {item.modifier}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">规格型号</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md text-slate-700 border border-slate-200">
                  {item.spec || '-'}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">概算原始金额(元)</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md text-slate-700 font-mono border border-slate-200">
                  {formatCurrency(item.originalAmount)}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">剩余金额(元)</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md font-mono border border-slate-200">
                  <span className={item.remainingAmount > 0 ? 'text-emerald-600' : item.remainingAmount < 0 ? 'text-red-500' : 'text-slate-500'}>
                    {formatCurrency(item.remainingAmount)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">创建时间</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md text-slate-500 border border-slate-200">
                  {item.createdAt}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">修改时间</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md text-slate-500 border border-slate-200">
                  {item.modifiedAt}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">层级</label>
                <div className="px-3 py-2 text-sm bg-slate-100 rounded-md text-slate-700 border border-slate-200">
                  {item.level}级
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-error-warning-line" />
              </div>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}