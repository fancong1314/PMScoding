import { useState } from 'react';
import { type EstimateItem } from '@/mocks/designReviewMocks';

interface AddItemModalProps {
  parentId: string;
  parentName: string;
  level: number;
  onClose: () => void;
  onSave: (item: EstimateItem) => void;
}

const catalogs = ['', '建筑工程', '安装工程', '设备采购', '材料采购', '备件采购', '管道工程', '技术服务'];
const fourClassNines = ['', '四类九款-1', '四类九款-2', '四类九款-3', '四类九款-4', '四类九款-5', '四类九款-6'];
const subClasses = ['', '土建工程', '基础工程', '设备安装', '安装作业', '主材', '备品备件', '工艺管道', '设计服务', '监理服务'];

export default function AddItemModal({ parentId, parentName, level, onClose, onSave }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [spec, setSpec] = useState('');
  const [catalog, setCatalog] = useState('');
  const [fourClassNine, setFourClassNine] = useState('');
  const [subClass, setSubClass] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const inputCls =
    'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  const handleSave = () => {
    setError('');
    if (!name.trim()) {
      setError('费用名称不能为空');
      return;
    }
    const num = Number(amount);
    if (amount.trim() === '' || isNaN(num) || num < 0) {
      setError('修订金额必须大于等于0');
      return;
    }

    const newItem: EstimateItem = {
      id: `new-${Date.now()}`,
      name: name.trim(),
      spec: spec.trim(),
      catalog: catalog || '',
      fourClassNine: fourClassNine || '',
      subClass: subClass || '',
      originalAmount: num,
      revisedAmount: num,
      level: level as 1 | 2 | 3,
      parentId,
    };

    onSave(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl border border-steel-200 w-full max-w-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-steel-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-steel-900">
              新增{level === 2 ? '二级' : '三级'}细项
            </h3>
            <p className="text-xs text-steel-400 mt-0.5">父级: {parentName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-steel-500" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          <div>
            <label className="text-xs text-steel-500 mb-1 block">
              费用名称 <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="输入费用名称"
            />
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">规格型号</label>
            <input
              type="text"
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className={inputCls}
              placeholder="输入规格型号"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-steel-500 mb-1 block">采购目录</label>
              <select
                value={catalog}
                onChange={(e) => setCatalog(e.target.value)}
                className={inputCls}
              >
                {catalogs.map((c) => (
                  <option key={c} value={c}>
                    {c || '请选择'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-steel-500 mb-1 block">四类九款</label>
              <select
                value={fourClassNine}
                onChange={(e) => setFourClassNine(e.target.value)}
                className={inputCls}
              >
                {fourClassNines.map((f) => (
                  <option key={f} value={f}>
                    {f || '请选择'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-steel-500 mb-1 block">采购细类</label>
              <select
                value={subClass}
                onChange={(e) => setSubClass(e.target.value)}
                className={inputCls}
              >
                {subClasses.map((s) => (
                  <option key={s} value={s}>
                    {s || '请选择'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-steel-500 mb-1 block">
                修订金额(元) <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`${inputCls} pr-10`}
                  placeholder="输入金额"
                  min={0}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">
                  元
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-5 py-2.5 border-t border-steel-100 bg-danger-50 flex items-center gap-2 flex-shrink-0">
            <div className="w-4 h-4 flex items-center justify-center text-danger-600">
              <i className="ri-error-warning-line" />
            </div>
            <span className="text-sm text-danger-700">{error}</span>
          </div>
        )}

        <div className="px-5 py-3 border-t border-steel-100 flex items-center justify-end gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            确认新增
          </button>
        </div>
      </div>
    </div>
  );
}