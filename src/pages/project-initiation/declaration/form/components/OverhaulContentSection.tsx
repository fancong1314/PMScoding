import { useState } from 'react';
import type { OverhaulContentRow } from '@/mocks/projectPlans';
import { defaultOverhaulContentRows, overhaulContentCategories } from '@/mocks/projectPlans';
import EquipmentSelectModal from './EquipmentSelectModal';
import type { EquipmentItem } from '@/mocks/equipmentMocks';

interface Props {
  rows?: OverhaulContentRow[];
  onChange: (rows: OverhaulContentRow[]) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  readonly?: boolean;
}

export default function OverhaulContentSection({ rows: controlledRows, onChange, sectionRef, readonly }: Props) {
  const rows = controlledRows ?? defaultOverhaulContentRows;
  const [pickRowId, setPickRowId] = useState<string | null>(null);

  const setRows = (next: OverhaulContentRow[]) => onChange(next);

  const handleAdd = () => {
    if (readonly) return;
    const newRow: OverhaulContentRow = {
      id: `oc_${Date.now()}`,
      seq: rows.length + 1,
      category: overhaulContentCategories[0],
      partCode: '',
      partName: '',
      content: '',
    };
    setRows([...rows, newRow]);
  };

  const handleDelete = (id: string) => {
    if (readonly) return;
    setRows(rows.filter((r) => r.id !== id).map((r, i) => ({ ...r, seq: i + 1 })));
  };

  const updateRow = (id: string, patch: Partial<OverhaulContentRow>) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const inputCls = 'w-full px-2 py-1.5 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500/30 bg-white';
  const selectCls = inputCls + ' cursor-pointer';

  return (
    <div id="overhaul-content" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-list-check-2 text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">营缮内容明细</h3>
        <span className="text-xs text-steel-400 ml-1">维护营缮设备部件与营缮内容明细</span>
      </div>

      <div className="p-5">
        {!readonly && (
          <div className="mb-3">
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              <i className="ri-add-line" /> 新增
            </button>
          </div>
        )}

        <div className="border border-steel-200 rounded-lg overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 900 }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-14 whitespace-nowrap">序号</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-36 whitespace-nowrap">类别</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 200 }}>设备部件/零件编码</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 160 }}>设备部件/零件名称</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 180 }}>营缮内容</th>
                {!readonly && <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-20 text-center">操作</th>}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={readonly ? 5 : 6} className="px-3 py-8 text-center text-xs text-steel-400">暂无明细，请点击新增</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-steel-100">
                    <td className="px-3 py-2 text-xs text-steel-500">{row.seq}</td>
                    <td className="px-3 py-2">
                      {readonly ? (
                        <span className="text-xs text-steel-700">{row.category || '—'}</span>
                      ) : (
                        <select
                          value={row.category}
                          onChange={(e) => updateRow(row.id, { category: e.target.value })}
                          className={selectCls}
                        >
                          {overhaulContentCategories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {readonly ? (
                        <span className="text-xs font-mono text-steel-700">{row.partCode || '—'}</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            value={row.partCode}
                            readOnly
                            placeholder="请选择设备部件/零件"
                            className={inputCls + ' bg-slate-50 flex-1'}
                          />
                          <button
                            type="button"
                            onClick={() => setPickRowId(row.id)}
                            className="w-8 h-8 flex items-center justify-center rounded border border-primary-200 text-primary-600 hover:bg-primary-50 cursor-pointer flex-shrink-0"
                            title="选择设备"
                          >
                            <i className="ri-search-line text-sm" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {readonly ? (
                        <span className="text-xs text-steel-700">{row.partName || '—'}</span>
                      ) : (
                        <input
                          value={row.partName}
                          readOnly
                          placeholder="挑选编码后自动带入"
                          className={inputCls + ' bg-slate-50'}
                        />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {readonly ? (
                        <span className="text-xs text-steel-700">{row.content || '—'}</span>
                      ) : (
                        <input
                          value={row.content}
                          onChange={(e) => updateRow(row.id, { content: e.target.value })}
                          placeholder="请输入"
                          className={inputCls}
                        />
                      )}
                    </td>
                    {!readonly && (
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="text-xs text-red-500 hover:underline cursor-pointer"
                        >
                          删除
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EquipmentSelectModal
        open={!!pickRowId}
        selectedCodes={pickRowId ? [rows.find((r) => r.id === pickRowId)?.partCode || ''].filter(Boolean) : []}
        multiple={false}
        title="选择设备部件/零件"
        onClose={() => setPickRowId(null)}
        onConfirm={(items: EquipmentItem[]) => {
          if (!pickRowId || items.length === 0) return;
          const item = items[0];
          updateRow(pickRowId, { partCode: item.code, partName: item.name });
          setPickRowId(null);
        }}
      />
    </div>
  );
}
