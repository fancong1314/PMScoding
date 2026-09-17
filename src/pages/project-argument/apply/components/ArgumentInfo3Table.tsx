import { useState } from 'react';

interface Info3Row {
  id: string;
  seq: number;
  deviceName: string;
  originalValue: string;
  residualValue: string;
  spareParts: string;
}

const initRows: Info3Row[] = [
  { id: '1', seq: 1, deviceName: '高炉热风炉系统', originalValue: '12,500,000.00', residualValue: '3,200,000.00', spareParts: '燃烧器总成×2、热风阀×3' },
  { id: '2', seq: 2, deviceName: '转炉除尘风机', originalValue: '8,900,000.00', residualValue: '1,800,000.00', spareParts: '叶轮×1、轴承座×2' },
  { id: '3', seq: 3, deviceName: '热轧精轧机组', originalValue: '25,000,000.00', residualValue: '6,500,000.00', spareParts: '轧辊×4、导卫装置×2' },
];

export default function ArgumentInfo3Table() {
  const [rows, setRows] = useState<Info3Row[]>(initRows);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<Info3Row>>({});

  const handleAdd = () => {
    const newRow: Info3Row = {
      id: Date.now().toString(),
      seq: rows.length + 1,
      deviceName: '',
      originalValue: '',
      residualValue: '',
      spareParts: '',
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
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, ...editRow } as Info3Row : r));
    setEditingId(null);
    setEditRow({});
  };

  const inputCls = 'w-full px-2 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500/30 bg-white';

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
        <span className="ml-auto text-xs text-steel-400">查无资料</span>
      </div>
      <div className="border border-steel-200 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-12">序号</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500" style={{ minWidth: '150px' }}>设备名称</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 text-right" style={{ minWidth: '120px' }}>原值</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 text-right" style={{ minWidth: '120px' }}>残值</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500" style={{ minWidth: '200px' }}>剩余备件</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 text-center w-16">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-xs text-steel-400">暂无数据，点击新增添加</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`border-b border-steel-100 cursor-pointer transition-colors ${selectedId === row.id ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
                  <td className="px-3 py-2 text-xs text-steel-500">{row.seq}</td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input value={editRow.deviceName ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, deviceName: e.target.value }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-700">{row.deviceName}</span>}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {editingId === row.id
                      ? <input value={editRow.originalValue ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, originalValue: e.target.value }))} className={inputCls + ' text-right'} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-700">¥{row.originalValue}</span>}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {editingId === row.id
                      ? <input value={editRow.residualValue ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, residualValue: e.target.value }))} className={inputCls + ' text-right'} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-700">¥{row.residualValue}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input value={editRow.spareParts ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, spareParts: e.target.value }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-600">{row.spareParts}</span>}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {editingId === row.id ? (
                      <button onClick={(e) => { e.stopPropagation(); handleSaveRow(row.id); }}
                        className="text-xs text-green-600 hover:text-green-800 cursor-pointer font-medium">保存</button>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); setRows((prev) => prev.filter((r) => r.id !== row.id).map((r, i) => ({ ...r, seq: i + 1 }))); setSelectedId(null); }}
                        className="text-xs text-red-500 hover:text-red-700 cursor-pointer">
                        <i className="ri-delete-bin-line" />
                      </button>
                    )}
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