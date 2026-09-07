import { useState } from 'react';

interface PersonRow {
  id: string;
  seq: number;
  empNo: string;
  name: string;
  title: string;
  unit: string;
  position: string;
  partyDuty: string;
  remark: string;
}

const initRows: PersonRow[] = [
  { id: '1', seq: 1, empNo: 'EMP001', name: '张建国', title: '高级工程师', unit: '炼钢事业部', position: '项目经理', partyDuty: '负责与甲方沟通项目整体推进和决策协调', remark: '负责整体方案设计' },
  { id: '2', seq: 2, empNo: 'EMP002', name: '李明华', title: '工程师', unit: '设备管理部', position: '技术负责人', partyDuty: '对接甲方设备管理部门，协调设备选型需求', remark: '负责设备选型' },
  { id: '3', seq: 3, empNo: 'EMP003', name: '王志远', title: '助理工程师', unit: '科技质量部', position: '成员', partyDuty: '配合甲方质量管控工作，参与质量验收', remark: '负责质量管控' },
  { id: '4', seq: 4, empNo: 'EMP004', name: '陈建华', title: '高级工程师', unit: '安全环保部', position: '安全专员', partyDuty: '对接甲方安全管理部门，落实安全三同时要求', remark: '负责安全管理' },
];

export default function ResearchPersonTable() {
  const [rows, setRows] = useState<PersonRow[]>(initRows);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<PersonRow>>({});

  const handleAdd = () => {
    const newRow: PersonRow = {
      id: Date.now().toString(),
      seq: rows.length + 1,
      empNo: '',
      name: '',
      title: '',
      unit: '',
      position: '',
      partyDuty: '',
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
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, ...editRow } as PersonRow : r));
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
        <span className="ml-auto text-xs text-steel-400">共 {rows.length} 条</span>
      </div>
      <div className="border border-steel-200 rounded-lg overflow-x-auto">
        <table className="w-full text-left" style={{ minWidth: 900 }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-12 whitespace-nowrap">序号</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-24 whitespace-nowrap">工号</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-24 whitespace-nowrap">姓名</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">职称</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">单位</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">职务</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 200 }}>甲方工作职责</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">备注</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-xs text-steel-400">暂无数据</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`border-b border-steel-100 cursor-pointer transition-colors ${selectedId === row.id ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
                  <td className="px-3 py-2 text-xs text-steel-500">{row.seq}</td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input value={editRow.empNo ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, empNo: e.target.value }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-700">{row.empNo}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input value={editRow.name ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, name: e.target.value }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-700">{row.name}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input value={editRow.title ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, title: e.target.value }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-600">{row.title}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input value={editRow.unit ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, unit: e.target.value }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-600">{row.unit}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input value={editRow.position ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, position: e.target.value }))} className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-600">{row.position}</span>}
                  </td>
                  {/* 甲方工作职责 */}
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? <input value={editRow.partyDuty ?? ''} maxLength={100} onChange={(e) => setEditRow((p) => ({ ...p, partyDuty: e.target.value }))} placeholder="最多100字" className={inputCls} onClick={(e) => e.stopPropagation()} />
                      : <span className="text-xs text-steel-600 line-clamp-2">{row.partyDuty}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === row.id
                      ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <input value={editRow.remark ?? ''} onChange={(e) => setEditRow((p) => ({ ...p, remark: e.target.value }))} className={inputCls} />
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