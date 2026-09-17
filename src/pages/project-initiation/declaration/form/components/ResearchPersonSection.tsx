import { useState } from 'react';
import type { ResearchPersonRow } from '@/mocks/projectPlans';
import { defaultResearchPersons } from '@/mocks/projectPlans';

interface Props {
  rows?: ResearchPersonRow[];
  onChange: (rows: ResearchPersonRow[]) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  readonly?: boolean;
}

export default function ResearchPersonSection({ rows: controlledRows, onChange, sectionRef, readonly }: Props) {
  const rows = controlledRows ?? defaultResearchPersons;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<ResearchPersonRow>>({});

  const setRows = (next: ResearchPersonRow[]) => onChange(next);

  const handleAdd = () => {
    if (readonly) return;
    const newRow: ResearchPersonRow = {
      id: `rp_${Date.now()}`,
      seq: rows.length + 1,
      empNo: '',
      name: '',
      title: '',
      unit: '',
      position: '',
      partyDuty: '',
      remark: '',
    };
    setRows([...rows, newRow]);
    setEditingId(newRow.id);
    setEditRow(newRow);
  };

  const handleEdit = () => {
    if (readonly || !selectedId) return;
    const row = rows.find((r) => r.id === selectedId);
    if (!row) return;
    setEditingId(selectedId);
    setEditRow({ ...row });
  };

  const handleDelete = () => {
    if (readonly || !selectedId) return;
    setRows(rows.filter((r) => r.id !== selectedId).map((r, i) => ({ ...r, seq: i + 1 })));
    setSelectedId(null);
  };

  const handleSaveRow = (id: string) => {
    setRows(rows.map((r) => (r.id === id ? ({ ...r, ...editRow } as ResearchPersonRow) : r)));
    setEditingId(null);
    setEditRow({});
  };

  const inputCls = 'w-full px-2 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500/30 bg-white';

  return (
    <div id="research-person" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-team-line text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">项目研究报告人员</h3>
        <span className="text-xs text-steel-400 ml-1">提报单位内部评审人员/报告编制人员</span>
      </div>

      <div className="p-5">
        {!readonly && (
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              <i className="ri-add-line" /> 新增
            </button>
            <button
              type="button"
              onClick={handleEdit}
              disabled={!selectedId}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
            >
              <i className="ri-edit-line" /> 修改
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!selectedId}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              <i className="ri-delete-bin-line" /> 删除
            </button>
            <span className="ml-auto text-xs text-steel-400">共 {rows.length} 条</span>
          </div>
        )}

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
                {!readonly && <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-16 text-center">操作</th>}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={readonly ? 8 : 9} className="px-3 py-8 text-center text-xs text-steel-400">暂无数据</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => !readonly && setSelectedId(row.id)}
                    className={`border-b border-steel-100 transition-colors ${
                      selectedId === row.id ? 'bg-primary-50' : 'hover:bg-slate-50'
                    } ${readonly ? '' : 'cursor-pointer'}`}
                  >
                    <td className="px-3 py-2 text-xs text-steel-500">{row.seq}</td>
                    {(['empNo', 'name', 'title', 'unit', 'position', 'partyDuty', 'remark'] as const).map((key) => (
                      <td key={key} className="px-3 py-2">
                        {editingId === row.id ? (
                          <input
                            value={(editRow[key] as string) ?? ''}
                            onChange={(e) => setEditRow((p) => ({ ...p, [key]: e.target.value }))}
                            className={inputCls}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="text-xs text-steel-700">{row[key] || '—'}</span>
                        )}
                      </td>
                    ))}
                    {!readonly && (
                      <td className="px-3 py-2 text-center">
                        {editingId === row.id ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveRow(row.id);
                            }}
                            className="text-xs text-primary-600 hover:underline cursor-pointer"
                          >
                            保存
                          </button>
                        ) : (
                          <span className="text-xs text-steel-300">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
