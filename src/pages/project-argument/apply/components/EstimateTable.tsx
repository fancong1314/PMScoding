import { useState, useMemo } from 'react';

interface EstimateRow {
  id: string;
  seq: string;
  level: 1 | 2 | 3;
  parentId: string | null;
  isFixed: boolean;
  isSummary: boolean;
  feeName: string;
  docNo: string;
  buildCost: number;
  installCost: number;
  equipCost: number;
  otherCost: number;
  total: number;
  remark: string;
  unit: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

const initRows: EstimateRow[] = [
  { id: '1', seq: '1', level: 1, parentId: null, isFixed: true, isSummary: false, feeName: '工程费用', docNo: '', buildCost: 45.00, installCost: 32.50, equipCost: 120.00, otherCost: 0, total: 197.50, remark: '', unit: '', qty: 0, unitPrice: 0, totalPrice: 0 },
  { id: '1-1', seq: '1.1', level: 2, parentId: '1', isFixed: false, isSummary: false, feeName: '土建工程', docNo: 'GC-001', buildCost: 45.00, installCost: 0, equipCost: 0, otherCost: 0, total: 45.00, remark: '', unit: '项', qty: 1, unitPrice: 45.00, totalPrice: 45.00 },
  { id: '1-2', seq: '1.2', level: 2, parentId: '1', isFixed: false, isSummary: false, feeName: '安装工程', docNo: 'GC-002', buildCost: 0, installCost: 32.50, equipCost: 0, otherCost: 0, total: 32.50, remark: '', unit: '项', qty: 1, unitPrice: 32.50, totalPrice: 32.50 },
  { id: '1-3', seq: '1.3', level: 2, parentId: '1', isFixed: false, isSummary: false, feeName: '设备购置', docNo: 'GC-003', buildCost: 0, installCost: 0, equipCost: 120.00, otherCost: 0, total: 120.00, remark: '主要设备', unit: '台套', qty: 3, unitPrice: 40.00, totalPrice: 120.00 },
  { id: '2', seq: '2', level: 1, parentId: null, isFixed: true, isSummary: false, feeName: '工程建设其他费', docNo: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 28.54, total: 28.54, remark: '', unit: '', qty: 0, unitPrice: 0, totalPrice: 0 },
  { id: '2-1', seq: '2.1', level: 2, parentId: '2', isFixed: false, isSummary: false, feeName: '建设单位管理费', docNo: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 15.00, total: 15.00, remark: '', unit: '项', qty: 1, unitPrice: 15.00, totalPrice: 15.00 },
  { id: '2-2', seq: '2.2', level: 2, parentId: '2', isFixed: false, isSummary: false, feeName: '勘察设计费', docNo: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 13.54, total: 13.54, remark: '', unit: '项', qty: 1, unitPrice: 13.54, totalPrice: 13.54 },
  { id: '3', seq: '3', level: 1, parentId: null, isFixed: true, isSummary: false, feeName: '预备费', docNo: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 21.00, total: 21.00, remark: '按工程费用10%计', unit: '', qty: 0, unitPrice: 0, totalPrice: 0 },
  { id: '4', seq: '4', level: 1, parentId: null, isFixed: true, isSummary: true, feeName: '项目总投资', docNo: '', buildCost: 45.00, installCost: 32.50, equipCost: 120.00, otherCost: 49.54, total: 247.04, remark: '', unit: '', qty: 0, unitPrice: 0, totalPrice: 0 },
];

export default function EstimateTable() {
  const [rows, setRows] = useState<EstimateRow[]>(initRows);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const totalAmount = useMemo(() => {
    const totalRow = rows.find((r) => r.feeName === '项目总投资');
    return totalRow?.total ?? 0;
  }, [rows]);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isVisible = (row: EstimateRow): boolean => {
    if (!row.parentId) return true;
    if (collapsed.has(row.parentId)) return false;
    const parent = rows.find((r) => r.id === row.parentId);
    if (!parent) return true;
    return isVisible(parent);
  };

  const handleAddChild = (parentId: string) => {
    const parent = rows.find((r) => r.id === parentId);
    if (!parent || parent.level >= 3) return;
    const siblings = rows.filter((r) => r.parentId === parentId);
    const newRow: EstimateRow = {
      id: `${parentId}-${Date.now()}`,
      seq: `${parent.seq}.${siblings.length + 1}`,
      level: (parent.level + 1) as 2 | 3,
      parentId,
      isFixed: false,
      isSummary: false,
      feeName: '',
      docNo: '',
      buildCost: 0,
      installCost: 0,
      equipCost: 0,
      otherCost: 0,
      total: 0,
      remark: '',
      unit: '',
      qty: 0,
      unitPrice: 0,
      totalPrice: 0,
    };
    const parentIdx = rows.findIndex((r) => r.id === parentId);
    const lastChildIdx = rows.reduce((acc, r, i) => r.parentId === parentId ? i : acc, parentIdx);
    const newRows = [...rows];
    newRows.splice(lastChildIdx + 1, 0, newRow);
    setRows(newRows);
  };

  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id && r.parentId !== id));
  };

  const handleChange = (id: string, field: keyof EstimateRow, value: string | number) => {
    setRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      updated.total = updated.buildCost + updated.installCost + updated.equipCost + updated.otherCost;
      updated.totalPrice = updated.qty * updated.unitPrice;
      return updated;
    }));
  };

  const numInput = (id: string, field: keyof EstimateRow, val: number, disabled = false) => (
    <input
      type="number"
      value={val || ''}
      onChange={(e) => handleChange(id, field, parseFloat(e.target.value) || 0)}
      disabled={disabled}
      className={`w-full px-1.5 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500/30 text-right ${disabled ? 'bg-slate-50 border-steel-100 text-steel-500' : 'border-steel-200 bg-white'}`}
    />
  );

  const textInput = (id: string, field: keyof EstimateRow, val: string, disabled = false) => (
    <input
      type="text"
      value={val}
      onChange={(e) => handleChange(id, field, e.target.value)}
      disabled={disabled}
      className={`w-full px-1.5 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500/30 ${disabled ? 'bg-slate-50 border-steel-100 text-steel-500' : 'border-steel-200 bg-white'}`}
    />
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
          <i className="ri-add-line" /> 新增行
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
          <i className="ri-delete-bin-line" /> 删除行
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-arrow-up-line" /> 上移
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-arrow-down-line" /> 下移
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-download-line" /> 导入模板
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-upload-line" /> 导入数据
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-export-line" /> 导出
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-list-check-2" /> 参考列表
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-steel-500">概算总额（万元）：</span>
          <span className="text-sm font-bold text-steel-800">{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Rules */}
      <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <p className="text-xs text-amber-700 leading-relaxed">
          1. 工程费合计、设备费合计、其他费合计、预备费、项目总投资为自动计算行，不可手动编辑。<br />
          2. 预备费只能输入合计金额，不能新增子级。<br />
          3. 工程费用和工程建设其他费支持新增子级（最多三级）。
        </p>
      </div>

      {/* Table */}
      <div className="border border-steel-200 rounded-lg overflow-hidden overflow-x-auto">
        <table className="text-left" style={{ minWidth: '1400px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f4ff', borderBottom: '1px solid #e8edf3' }}>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 w-12 whitespace-nowrap">序号</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap" style={{ minWidth: '180px' }}>费用名称</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-24">编制文号</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-24">建设工程费</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-24">安装工程费</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-24">设备费</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-24">其他费</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-24">合计（万元）</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-16">单位</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-16">数量</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-20">单价</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-20">总价</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-32">备注</th>
              <th className="px-2 py-2.5 text-xs font-semibold text-steel-600 whitespace-nowrap w-20 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter(isVisible).map((row) => {
              const isSummaryRow = row.isSummary;
              const isLevel1 = row.level === 1;
              const rowBg = isSummaryRow ? '#dcfce7' : isLevel1 ? '#f0f4ff' : row.level === 2 ? '#fafbfd' : 'white';
              const hasChildren = rows.some((r) => r.parentId === row.id);
              const isCollapsed = collapsed.has(row.id);

              return (
                <tr key={row.id} style={{ backgroundColor: rowBg, borderBottom: '1px solid #e8edf3' }}>
                  <td className="px-2 py-1.5 text-xs text-steel-500 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {hasChildren && (
                        <button onClick={() => toggleCollapse(row.id)} className="w-4 h-4 flex items-center justify-center cursor-pointer text-steel-400 hover:text-steel-600">
                          <i className={isCollapsed ? 'ri-arrow-right-s-line text-xs' : 'ri-arrow-down-s-line text-xs'} />
                        </button>
                      )}
                      {!hasChildren && <span className="w-4" />}
                      <span style={{ paddingLeft: `${(row.level - 1) * 12}px` }}>{row.seq}</span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5" style={{ paddingLeft: `${8 + (row.level - 1) * 16}px` }}>
                    {row.isFixed
                      ? <span className={`text-xs font-semibold ${isSummaryRow ? 'text-green-800' : 'text-steel-700'}`}>{row.feeName}</span>
                      : textInput(row.id, 'feeName', row.feeName)}
                  </td>
                  <td className="px-2 py-1.5">{row.isFixed ? '' : textInput(row.id, 'docNo', row.docNo)}</td>
                  <td className="px-2 py-1.5">{numInput(row.id, 'buildCost', row.buildCost, row.isFixed)}</td>
                  <td className="px-2 py-1.5">{numInput(row.id, 'installCost', row.installCost, row.isFixed)}</td>
                  <td className="px-2 py-1.5">{numInput(row.id, 'equipCost', row.equipCost, row.isFixed)}</td>
                  <td className="px-2 py-1.5">{numInput(row.id, 'otherCost', row.otherCost, row.isFixed)}</td>
                  <td className="px-2 py-1.5">
                    <span className={`text-xs font-semibold ${isSummaryRow ? 'text-green-700' : 'text-steel-700'}`}>{row.total.toFixed(2)}</span>
                  </td>
                  <td className="px-2 py-1.5">{row.isFixed ? '' : textInput(row.id, 'unit', row.unit)}</td>
                  <td className="px-2 py-1.5">{row.isFixed ? '' : numInput(row.id, 'qty', row.qty)}</td>
                  <td className="px-2 py-1.5">{row.isFixed ? '' : numInput(row.id, 'unitPrice', row.unitPrice)}</td>
                  <td className="px-2 py-1.5">
                    {row.isFixed ? '' : <span className="text-xs text-steel-600">{row.totalPrice.toFixed(2)}</span>}
                  </td>
                  <td className="px-2 py-1.5">{textInput(row.id, 'remark', row.remark, row.isSummary)}</td>
                  <td className="px-2 py-1.5 text-center">
                    {!row.isFixed && (
                      <div className="flex items-center justify-center gap-1">
                        {row.level < 3 && row.feeName !== '预备费' && (
                          <button onClick={() => handleAddChild(row.id)}
                            className="w-6 h-6 flex items-center justify-center rounded text-green-600 hover:bg-green-50 cursor-pointer" title="新增子级">
                            <i className="ri-add-line text-xs" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteRow(row.id)}
                          className="w-6 h-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 cursor-pointer" title="删除">
                          <i className="ri-delete-bin-line text-xs" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
