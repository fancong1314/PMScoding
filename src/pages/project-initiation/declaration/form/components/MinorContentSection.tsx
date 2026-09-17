import type { MinorContentRow } from '@/mocks/projectPlans';
import {
  calcMinorContentSubtotal,
  calcMinorContentTotal,
  defaultMinorContentRows,
} from '@/mocks/projectPlans';

interface Props {
  rows?: MinorContentRow[];
  onChange: (rows: MinorContentRow[]) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  readonly?: boolean;
}

export default function MinorContentSection({ rows: controlledRows, onChange, sectionRef, readonly }: Props) {
  const rows = controlledRows ?? defaultMinorContentRows;
  const total = calcMinorContentTotal(rows);

  const setRows = (next: MinorContentRow[]) => onChange(next);

  const handleAdd = () => {
    if (readonly) return;
    const newRow: MinorContentRow = {
      id: `mc_${Date.now()}`,
      seq: rows.length + 1,
      name: '',
      specModel: '',
      unitPrice: 0,
      qty: 1,
      measureUnit: '台',
      otherFee: 0,
      remark: '',
    };
    setRows([...rows, newRow]);
  };

  const handleDelete = (id: string) => {
    if (readonly) return;
    setRows(rows.filter((r) => r.id !== id).map((r, i) => ({ ...r, seq: i + 1 })));
  };

  const updateRow = (id: string, patch: Partial<MinorContentRow>) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const inputCls = 'w-full px-2 py-1.5 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500/30 bg-white';

  return (
    <div id="minor-content" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-list-check-2 text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">零固内容明细</h3>
        <span className="text-xs text-steel-400 ml-1">维护论证申请零固内容明细。合计金额随编辑自动汇总。</span>
        <span className="ml-auto text-sm font-semibold text-emerald-600 whitespace-nowrap">
          合计：{total.toFixed(2)}万元
        </span>
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
          <table className="w-full text-left" style={{ minWidth: 1100 }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-14 whitespace-nowrap">序号</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 140 }}>名称</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 120 }}>规格型号</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 110 }}>预估单价(万元)</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 80 }}>数量</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 90 }}>计量单位</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 110 }}>其他费用(万元)</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 120 }}>备注</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 100 }}>小计(万元)</th>
                {!readonly && <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-20 text-center">操作</th>}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={readonly ? 9 : 10} className="px-3 py-8 text-center text-xs text-steel-400">暂无明细，请点击新增</td>
                </tr>
              ) : (
                rows.map((row) => {
                  const subtotal = calcMinorContentSubtotal(row);
                  return (
                    <tr key={row.id} className="border-b border-steel-100">
                      <td className="px-3 py-2 text-xs text-steel-500">{row.seq}</td>
                      <td className="px-3 py-2">
                        {readonly ? (
                          <span className="text-xs text-steel-700">{row.name || '—'}</span>
                        ) : (
                          <input
                            value={row.name}
                            onChange={(e) => updateRow(row.id, { name: e.target.value })}
                            className={inputCls}
                            placeholder="名称"
                          />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {readonly ? (
                          <span className="text-xs text-steel-700">{row.specModel || '—'}</span>
                        ) : (
                          <input
                            value={row.specModel}
                            onChange={(e) => updateRow(row.id, { specModel: e.target.value })}
                            className={inputCls}
                            placeholder="规格型号"
                          />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {readonly ? (
                          <span className="text-xs text-steel-700">{Number(row.unitPrice || 0).toFixed(2)}</span>
                        ) : (
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={row.unitPrice}
                            onChange={(e) => updateRow(row.id, { unitPrice: Number(e.target.value) })}
                            className={inputCls}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {readonly ? (
                          <span className="text-xs text-steel-700">{row.qty}</span>
                        ) : (
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={row.qty}
                            onChange={(e) => updateRow(row.id, { qty: Number(e.target.value) })}
                            className={inputCls}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {readonly ? (
                          <span className="text-xs text-steel-700">{row.measureUnit || '—'}</span>
                        ) : (
                          <input
                            value={row.measureUnit}
                            onChange={(e) => updateRow(row.id, { measureUnit: e.target.value })}
                            className={inputCls}
                            placeholder="台"
                          />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {readonly ? (
                          <span className="text-xs text-steel-700">{Number(row.otherFee || 0).toFixed(2)}</span>
                        ) : (
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={row.otherFee}
                            onChange={(e) => updateRow(row.id, { otherFee: Number(e.target.value) })}
                            className={inputCls}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {readonly ? (
                          <span className="text-xs text-steel-700">{row.remark || '—'}</span>
                        ) : (
                          <input
                            value={row.remark}
                            onChange={(e) => updateRow(row.id, { remark: e.target.value })}
                            className={inputCls}
                            placeholder="备注"
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs font-medium text-steel-800 whitespace-nowrap">
                        {subtotal.toFixed(2)}
                      </td>
                      {!readonly && (
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete(row.id)}
                            className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
                          >
                            删除
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
