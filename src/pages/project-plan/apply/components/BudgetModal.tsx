import { useState, useRef } from 'react';
import { defaultBudgetItems } from '@/mocks/applyMocks';
import type { BudgetItem } from '@/mocks/applyMocks';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (items: BudgetItem[]) => void;
  initialItems?: BudgetItem[];
}

function calcTotal(item: BudgetItem): number {
  return item.buildCost + item.installCost + item.equipCost + item.otherCost;
}

const categoryLabels: Record<string, string> = {
  engineering: '工程费用',
  otherEngineering: '工程建设其他费',
  reserve: '预备费',
  item: '明细项',
};

export default function BudgetModal({ open, onClose, onSave, initialItems }: Props) {
  const [items, setItems] = useState<BudgetItem[]>(initialItems ?? defaultBudgetItems);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'ready' | 'success'>('idle');
  const [importFileName, setImportFileName] = useState('');
  const [showSample, setShowSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const totalAmount = items.reduce((sum, it) => sum + (it.id === 'b8' ? it.total : it.buildCost + it.installCost + it.equipCost + it.otherCost), 0);

  const engineeringTotal = items
    .filter((it) => ['b1', 'b2', 'b3'].includes(it.id))
    .reduce((s, it) => s + calcTotal(it), 0);
  const otherEngTotal = items
    .filter((it) => ['b4', 'b5', 'b6', 'b7'].includes(it.id))
    .reduce((s, it) => s + calcTotal(it), 0);
  const reserveTotal = items.filter((it) => it.id === 'b8').reduce((s, it) => s + it.total, 0);
  const projectTotal = engineeringTotal + otherEngTotal + reserveTotal;

  const updateItem = (id: string, field: keyof BudgetItem, val: string | number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: val };
        if (['buildCost', 'installCost', 'equipCost', 'otherCost'].includes(field as string)) {
          updated.total = updated.buildCost + updated.installCost + updated.equipCost + updated.otherCost;
        }
        return updated;
      })
    );
  };

  const addItem = () => {
    const newItem: BudgetItem = {
      id: `b${Date.now()}`,
      seq: '',
      name: '',
      spec: '',
      buildCost: 0,
      installCost: 0,
      equipCost: 0,
      otherCost: 0,
      total: 0,
      unit: '项',
      quantity: 1,
      weight: 0,
      indicator: '',
      remark: '',
      category: 'item',
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFileName(file.name);
      setImportStatus('ready');
    }
  };

  const handleUpload = () => {
    if (importStatus !== 'ready') return;
    setImportStatus('success');
    setTimeout(() => setImportStatus('idle'), 2000);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setImportFileName('');
  };

  const handleClear = () => {
    if (confirmClear) {
      setItems([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  const inputCls = 'w-full px-1.5 py-1 text-xs border-0 border-b border-steel-100 focus:outline-none focus:border-primary-400 bg-transparent text-steel-700';
  const numInputCls = 'w-full px-1.5 py-1 text-xs border-0 border-b border-steel-100 focus:outline-none focus:border-primary-400 bg-transparent text-steel-700 text-right';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-steel-200 flex flex-col"
        style={{ width: '90vw', maxWidth: '1200px', maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-steel-200 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-file-chart-line text-primary-500" />
            </div>
            <span className="text-sm font-semibold text-steel-800">项目概算表</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary-50 text-primary-600 font-medium">
              概算总额：<span className="font-bold">{projectTotal.toFixed(2)}</span> 万元
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-steel-400 cursor-pointer">
            <i className="ri-close-line text-base" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-steel-100 bg-slate-50/60 flex-shrink-0">
          <button
            onClick={() => { const a = document.createElement('a'); a.href = '#'; a.download = '概算表导入模板.xlsx'; a.click(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-white transition-colors cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-2-line" /></div>
            导入模板下载
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-white transition-colors cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-excel-2-line" /></div>
            导入概算明细
            <input ref={fileInputRef} type="file" accept=".xls,.xlsx" className="hidden" onChange={handleFileChange} />
          </label>
          {importFileName && (
            <span className="text-xs text-steel-400 max-w-[140px] truncate" title={importFileName}>{importFileName}</span>
          )}
          <button
            onClick={handleUpload}
            disabled={importStatus !== 'ready'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap ${importStatus === 'ready' ? 'text-primary-600 border-primary-300 bg-primary-50 hover:bg-primary-100' : importStatus === 'success' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-steel-400 border-steel-100 bg-slate-50 cursor-not-allowed'}`}>
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={importStatus === 'success' ? 'ri-checkbox-circle-line' : 'ri-upload-cloud-2-line'} />
            </div>
            {importStatus === 'success' ? '上传成功' : '开始上传'}
          </button>
          <button onClick={handleClear}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md transition-colors cursor-pointer whitespace-nowrap ${confirmClear ? 'text-white border-red-500 bg-red-500' : 'text-red-500 border-red-200 hover:bg-red-50'}`}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-delete-bin-line" /></div>
            {confirmClear ? '确认清空？' : '清空概算表'}
          </button>
          {confirmClear && (
            <button onClick={() => setConfirmClear(false)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-steel-500 hover:text-steel-700 cursor-pointer whitespace-nowrap">
              取消
            </button>
          )}
          <button onClick={() => setShowSample(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-white transition-colors cursor-pointer whitespace-nowrap ml-auto">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-question-line" /></div>
            参考样表
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table style={{ minWidth: '1100px', tableLayout: 'fixed', borderCollapse: 'collapse', width: '100%' }}>
            <colgroup>
              <col style={{ width: '50px' }} />
              <col style={{ width: '45px' }} />
              <col style={{ width: '180px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '70px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '50px' }} />
              <col style={{ width: '55px' }} />
              <col style={{ width: '55px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '40px' }} />
            </colgroup>
            <thead className="sticky top-0 z-10" style={{ backgroundColor: '#f5f7fa' }}>
              <tr>
                {['操作', '序号', '项目/费用名称', '规格型号', '建筑工程费', '安装工程费', '设备费', '其他费', '合计(万元)', '单位', '数量', '重量(t)', '指标', '备注', ''].map((h, i) => (
                  <th key={i} className="px-2 py-2.5 text-xs font-semibold text-steel-600 border-b border-r border-steel-200 text-center whitespace-nowrap last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-primary-50/30 transition-colors">
                  <td className="px-2 py-1.5 border-b border-r border-steel-100 text-center">
                    <button onClick={() => removeItem(item.id)}
                      className="w-6 h-6 flex items-center justify-center mx-auto rounded text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
                      <i className="ri-subtract-line text-sm" />
                    </button>
                  </td>
                  <td className="border-b border-r border-steel-100">
                    <input className={inputCls + ' text-center'} value={item.seq}
                      onChange={(e) => updateItem(item.id, 'seq', e.target.value)} placeholder="序号" />
                  </td>
                  <td className="border-b border-r border-steel-100">
                    <input className={inputCls} value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="费用名称" />
                  </td>
                  <td className="border-b border-r border-steel-100">
                    <input className={inputCls} value={item.spec}
                      onChange={(e) => updateItem(item.id, 'spec', e.target.value)} placeholder="规格" />
                  </td>
                  {(['buildCost', 'installCost', 'equipCost', 'otherCost'] as const).map((f) => (
                    <td key={f} className="border-b border-r border-steel-100">
                      <input type="number" min={0} className={numInputCls} value={item[f]}
                        onChange={(e) => updateItem(item.id, f, parseFloat(e.target.value) || 0)} />
                    </td>
                  ))}
                  <td className="border-b border-r border-steel-100 px-2 py-1.5 text-xs text-right font-medium text-steel-800">
                    {item.total.toFixed(2)}
                  </td>
                  <td className="border-b border-r border-steel-100">
                    <input className={inputCls + ' text-center'} value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)} />
                  </td>
                  <td className="border-b border-r border-steel-100">
                    <input type="number" min={0} className={numInputCls} value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                  </td>
                  <td className="border-b border-r border-steel-100">
                    <input type="number" min={0} className={numInputCls} value={item.weight}
                      onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value) || 0)} />
                  </td>
                  <td className="border-b border-r border-steel-100">
                    <input className={inputCls} value={item.indicator}
                      onChange={(e) => updateItem(item.id, 'indicator', e.target.value)} placeholder="" />
                  </td>
                  <td className="border-b border-r border-steel-100">
                    <input className={inputCls} value={item.remark}
                      onChange={(e) => updateItem(item.id, 'remark', e.target.value)} placeholder="" />
                  </td>
                  <td className="border-b border-steel-100" />
                </tr>
              ))}

              {/* Add row */}
              <tr>
                <td colSpan={15} className="px-3 py-2 border-b border-steel-100">
                  <button onClick={addItem}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 cursor-pointer">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 transition-colors">
                      <i className="ri-add-line text-sm" />
                    </div>
                    新增明细行
                  </button>
                </td>
              </tr>

              {/* Summary rows */}
              {[
                { label: '工程费用', value: engineeringTotal },
                { label: '工程建设其他费', value: otherEngTotal },
                { label: '预备费', value: reserveTotal },
                { label: '项目总投资', value: projectTotal, bold: true },
              ].map((row) => (
                <tr key={row.label} style={row.bold ? { backgroundColor: '#eff6ff' } : { backgroundColor: '#f9fafb' }}>
                  <td className="border-b border-r border-steel-100" />
                  <td colSpan={2} className={`px-3 py-2 text-xs border-b border-r border-steel-100 ${row.bold ? 'font-bold text-primary-700' : 'font-semibold text-steel-700'}`}>
                    {row.label}
                  </td>
                  <td colSpan={4} className="border-b border-r border-steel-100" />
                  <td className={`px-2 py-2 text-xs text-right border-b border-r border-steel-100 ${row.bold ? 'font-bold text-primary-700' : 'font-medium text-steel-800'}`}>
                    {row.value.toFixed(2)}
                  </td>
                  <td colSpan={7} className="border-b border-steel-100" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-steel-200 flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
            取消
          </button>
          <button onClick={() => { onSave(items); onClose(); }}
            className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <i className="ri-save-line" />
            保存概算表
          </button>
        </div>
      </div>

      {/* Sample reference modal */}
      {showSample && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSample(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 p-6 w-[480px] max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-steel-800">概算表填写参考样表</span>
              <button onClick={() => setShowSample(false)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-steel-400" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-steel-600">
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <p className="font-semibold text-steel-700 mb-2">字段说明</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>序号</strong>：费用条目序号，如 1.1、1.2、2.1</li>
                  <li><strong>项目/费用名称</strong>：具体费用项目的名称</li>
                  <li><strong>建筑工程费</strong>：土建、结构等建筑工程费用（万元）</li>
                  <li><strong>安装工程费</strong>：设备安装调试等费用（万元）</li>
                  <li><strong>设备费</strong>：购置设备的费用（万元）</li>
                  <li><strong>其他费</strong>：不属于上述三类的其他费用（万元）</li>
                  <li><strong>合计</strong>：系统自动计算，四项之和</li>
                </ul>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                <p className="font-semibold text-amber-700 mb-1">注意事项</p>
                <p>导入Excel时请严格使用下载的模板格式，数值字段请填写纯数字，不含单位，避免解析错误。</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
