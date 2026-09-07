import { useState } from 'react';
import { argumentIndicatorTypes } from '@/mocks/argumentApplyMocks';

interface IndicatorRow {
  id: string;
  seq: number;
  indicatorType: string;
  indicatorName: string;
  originalValue: number;
  targetValue: number;
  remark: string;
}

const initRows: IndicatorRow[] = [
  { id: '1', seq: 1, indicatorType: '产量指标', indicatorName: '日产量（吨/天）', originalValue: 1050.00, targetValue: 1200.00, remark: '目标值需高出原值的整数倍，%' },
  { id: '2', seq: 2, indicatorType: '质量指标', indicatorName: '产品合格率（%）', originalValue: 98.50, targetValue: 99.50, remark: '' },
  { id: '3', seq: 3, indicatorType: '能耗指标', indicatorName: '吨钢综合能耗（kgce/t）', originalValue: 580.00, targetValue: 550.00, remark: '降低能耗' },
];

export default function IndicatorTable() {
  const [rows, setRows] = useState<IndicatorRow[]>(initRows);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<IndicatorRow>>({});

  const handleAdd = () => {
    const newRow: IndicatorRow = {
      id: Date.now().toString(),
      seq: rows.length + 1,
      indicatorType: argumentIndicatorTypes[0],
      indicatorName: '',
      originalValue: 0,
      targetValue: 0,
      remark: '',
    };
    setRows((prev) => [...prev, newRow]);
    setEditingId(newRow.id);
    setEditRow(newRow);
  };

  const handleEdit = () => {
    if (!selectedId) return;
    const row = rows.find((r) => r.id === selectedId);
    if (!row) return;
    setEditingId(selectedId);
    setEditRow({ ...row });
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setRows((prev) => prev.filter((r) => r.id !== selectedId).map((r, i) => ({ ...r, seq: i + 1 })));
    setSelectedId(null);
  };

  const handleSaveRow = (id: string) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, ...editRow } as IndicatorRow : r));
    setEditingId(null);
    setEditRow({});
  };

  const inputCls = 'w-full px-2 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500/30 bg-white';
  const selectCls = inputCls + ' cursor-pointer';

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
          <i className="ri-add-line" /> 新增
        </button>
        <button onClick={handleEdit} disabled={!selectedId}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          <i className="ri-edit-line" /> 修改
        </button>
        <button onClick={handleDelete} disabled={!selectedId}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
          <i className="ri-delete-bin-line" /> 删除
        </button>
        <span className="ml-auto text-xs text-steel-400">查询成功</span>
      </div>
      <div className="border border-steel-200 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-12">序号</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-28">指标类型</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">指标名称</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-28">原值</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-28">目标值</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">备注</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-xs text-steel-400">暂无数据</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`border-b border-steel-100 cursor-pointer transition-colors ${selectedId === row.id ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
                  <td className="px-3 py-2 text-xs text-steel-500">{row.seq}</td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <select value={editRow.indicatorType ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, indicatorType: e.target.value }))} className={selectCls} onClick={(e) => e.stopPropagation()}>
                          {argumentIndicatorTypes.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      : <span className="text-xs text-steel-700">{row.indicatorType}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input value={editRow.indicatorName ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, indicatorName: e.target.value }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-700">{row.indicatorName}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input type="number" step="1" value={editRow.originalValue ?? 0} onChange={(e) => setEditRow((p) => ({ ...p, originalValue: parseFloat(e.target.value) || 0 }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-700">{row.originalValue.toFixed(2)}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input type="number" step="1" value={editRow.targetValue ?? 0} onChange={(e) => setEditRow((p) => ({ ...p, targetValue: parseFloat(e.target.value) || 0 }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-700">{row.targetValue.toFixed(2)}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <input value={editRow.remark ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, remark: e.target.value }))} className={inputCls} placeholder="目标值需高出原值的整数倍，%" />
                          <button onClick={() => handleSaveRow(row.id)} className="text-xs text-green-600 hover:text-green-800 cursor-pointer font-medium whitespace-nowrap">保存</button>
                        </div>
                      )
                      : <span className="text-xs text-steel-500">{row.remark}</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
