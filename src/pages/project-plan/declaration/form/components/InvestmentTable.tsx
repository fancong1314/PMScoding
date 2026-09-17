import { useState } from 'react';

export interface InvestmentRow {
  id: string;
  parentId: string | null;
  level: number;
  fixed: boolean;
  name: string;
  spec: string;
  isFourNine: boolean;
  purchaseCategory: string;
  constructFee: number;
  installFee: number;
  equipFee: number;
  otherFee: number;
  total: number;
  unit: string;
  quantity: number;
  weight: number;
  indicator: string;
  remark: string;
}

// 采购目录下拉选项
const PURCHASE_OPTIONS = ['一般设备', '特种设备', '建筑材料', '信息系统'];

const ROOT_IDS = {
  engineering: 'r_engineering',
  other:       'r_other',
  reserve:     'r_reserve',
  totalInvest: 'r_total',
};

const initialRows: InvestmentRow[] = [
  {
    id: ROOT_IDS.engineering, parentId: null, level: 0, fixed: true,
    name: '工程费用', spec: '', isFourNine: false, purchaseCategory: '',
    constructFee: 0, installFee: 0, equipFee: 0, otherFee: 0, total: 0,
    unit: '', quantity: 0, weight: 0, indicator: '', remark: '',
  },
  {
    id: ROOT_IDS.other, parentId: null, level: 0, fixed: true,
    name: '工程建设其他费', spec: '', isFourNine: false, purchaseCategory: '',
    constructFee: 0, installFee: 0, equipFee: 0, otherFee: 0, total: 0,
    unit: '', quantity: 0, weight: 0, indicator: '', remark: '',
  },
  {
    id: ROOT_IDS.reserve, parentId: null, level: 0, fixed: true,
    name: '预备费', spec: '', isFourNine: false, purchaseCategory: '',
    constructFee: 0, installFee: 0, equipFee: 0, otherFee: 0, total: 0,
    unit: '', quantity: 0, weight: 0, indicator: '', remark: '',
  },
  {
    id: ROOT_IDS.totalInvest, parentId: null, level: 0, fixed: true,
    name: '项目总投资', spec: '', isFourNine: false, purchaseCategory: '',
    constructFee: 0, installFee: 0, equipFee: 0, otherFee: 0, total: 0,
    unit: '', quantity: 0, weight: 0, indicator: '', remark: '',
  },
];

function genId() {
  return `row_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function getDescendants(rows: InvestmentRow[], parentId: string): string[] {
  const direct = rows.filter((r) => r.parentId === parentId).map((r) => r.id);
  return direct.flatMap((id) => [id, ...getDescendants(rows, id)]);
}

function calcTotal(row: InvestmentRow): number {
  return row.constructFee + row.installFee + row.equipFee + row.otherFee;
}

function getTopParentId(rows: InvestmentRow[], row: InvestmentRow): string | null {
  let r = row;
  while (r.parentId) {
    const p = rows.find((x) => x.id === r.parentId);
    if (!p) break;
    r = p;
  }
  return r.id;
}

function canAddChild(rows: InvestmentRow[], row: InvestmentRow): boolean {
  if (row.id === ROOT_IDS.reserve || row.id === ROOT_IDS.totalInvest) return false;
  const topId = getTopParentId(rows, row);
  if (topId === ROOT_IDS.engineering && row.level < 2) return true;
  if (topId === ROOT_IDS.other && row.level < 1) return true;
  return false;
}

function computeParentTotals(rows: InvestmentRow[]): InvestmentRow[] {
  const result = rows.map((r) => ({ ...r }));
  const process = (id: string) => {
    if (id === ROOT_IDS.reserve) return;
    const children = result.filter((r) => r.parentId === id);
    if (children.length > 0) {
      children.forEach((c) => process(c.id));
      const row = result.find((r) => r.id === id)!;
      row.constructFee = children.reduce((s, c) => s + c.constructFee, 0);
      row.installFee   = children.reduce((s, c) => s + c.installFee, 0);
      row.equipFee     = children.reduce((s, c) => s + c.equipFee, 0);
      row.otherFee     = children.reduce((s, c) => s + c.otherFee, 0);
      row.total        = row.constructFee + row.installFee + row.equipFee + row.otherFee;
    } else {
      const row = result.find((r) => r.id === id)!;
      row.total = calcTotal(row);
    }
  };
  [ROOT_IDS.engineering, ROOT_IDS.other].forEach(process);

  // 预备费：明细归零，total 由用户输入，不自动覆盖
  const reserve = result.find((r) => r.id === ROOT_IDS.reserve)!;
  reserve.constructFee = 0;
  reserve.installFee = 0;
  reserve.equipFee = 0;
  reserve.otherFee = 0;
  // reserve.total 保持原值

  // 项目总投资自动汇总
  const totalRow = result.find((r) => r.id === ROOT_IDS.totalInvest)!;
  const eng = result.find((r) => r.id === ROOT_IDS.engineering)!;
  const oth = result.find((r) => r.id === ROOT_IDS.other)!;
  totalRow.constructFee = eng.constructFee + oth.constructFee;
  totalRow.installFee   = eng.installFee + oth.installFee;
  totalRow.equipFee     = eng.equipFee + oth.equipFee;
  totalRow.otherFee     = eng.otherFee + oth.otherFee + reserve.total;
  totalRow.total        = totalRow.constructFee + totalRow.installFee + totalRow.equipFee + totalRow.otherFee;

  return result;
}

function buildOrderedRows(rows: InvestmentRow[]): InvestmentRow[] {
  const rootOrder = [ROOT_IDS.engineering, ROOT_IDS.other, ROOT_IDS.reserve, ROOT_IDS.totalInvest];
  const result: InvestmentRow[] = [];
  const addWithChildren = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (row) {
      result.push(row);
      rows.filter((r) => r.parentId === id).forEach((c) => addWithChildren(c.id));
    }
  };
  rootOrder.forEach(addWithChildren);
  return result;
}

interface Props {
  sectionRef: (el: HTMLDivElement | null) => void;
}

const numInput = (
  value: number,
  onChange: (v: number) => void,
  disabled = false
) => (
  <input
    type="number"
    min="0"
    step="1"
    value={value || ''}
    disabled={disabled}
    onChange={(e) => onChange(Number(e.target.value) || 0)}
    className={`w-full px-1.5 py-1 text-xs border rounded text-right focus:outline-none focus:ring-1 focus:ring-emerald-400 ${disabled ? 'bg-slate-50 text-steel-400 cursor-not-allowed' : 'border-steel-200 bg-white'}`}
    style={{ minWidth: 60 }}
  />
);

export default function InvestmentTable({ sectionRef }: Props) {
  const [rows, setRows] = useState<InvestmentRow[]>(() => computeParentTotals(initialRows));
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const update = (id: string, field: keyof InvestmentRow, value: string | number | boolean) => {
    setRows((prev) => {
      const next = prev.map((r) => r.id === id ? { ...r, [field]: value } : r);
      return computeParentTotals(next);
    });
  };

  const addChild = (parentId: string) => {
    const parent = rows.find((r) => r.id === parentId)!;
    if (!canAddChild(rows, parent)) return;
    const newRow: InvestmentRow = {
      id: genId(), parentId, level: parent.level + 1, fixed: false,
      name: '', spec: '', isFourNine: false, purchaseCategory: '',
      constructFee: 0, installFee: 0, equipFee: 0, otherFee: 0, total: 0,
      unit: '', quantity: 0, weight: 0, indicator: '', remark: '',
    };
    setRows((prev) => {
      const descendants = getDescendants(prev, parentId);
      const lastDescIdx = descendants.length > 0
        ? prev.findIndex((r) => r.id === descendants[descendants.length - 1])
        : prev.findIndex((r) => r.id === parentId);
      const next = [...prev];
      next.splice(lastDescIdx + 1, 0, newRow);
      return computeParentTotals(next);
    });
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const toRemove = new Set([id, ...getDescendants(prev, id)]);
      return computeParentTotals(prev.filter((r) => !toRemove.has(r.id)));
    });
  };

  const clearAll = () => {
    setRows(computeParentTotals(initialRows.map((r) => ({ ...r }))));
  };

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isHidden = (row: InvestmentRow): boolean => {
    if (!row.parentId) return false;
    if (collapsed.has(row.parentId)) return true;
    const parent = rows.find((r) => r.id === row.parentId);
    return parent ? isHidden(parent) : false;
  };

  const ordered = buildOrderedRows(rows);

  const isTotal   = (id: string) => id === ROOT_IDS.totalInvest;
  const isReserve = (id: string) => id === ROOT_IDS.reserve;
  const isRootFixed = (id: string) => id === ROOT_IDS.engineering || id === ROOT_IDS.other || id === ROOT_IDS.reserve || id === ROOT_IDS.totalInvest;

  const fmtNum = (n: number) => n === 0 ? '' : n.toFixed(2);

  // 样式常量
  const groupThCls = 'px-2 py-2 text-xs font-semibold text-steel-700 whitespace-nowrap border-b border-steel-200 bg-slate-50 text-center';
  const thCls = 'px-2 py-2 text-xs font-semibold text-steel-600 whitespace-nowrap border-b border-steel-200 bg-slate-50 text-center';
  const tdCls = 'px-2 py-1.5 text-xs align-middle border-b border-steel-100';

  return (
    <div id="investment-table" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      {/* Section header */}
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-table-2 text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">项目投资估算子表</h3>
        <span className="text-xs text-steel-400 ml-1">填写各项费用明细</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {}}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-steel-600 border border-steel-200 rounded hover:bg-slate-50 cursor-pointer transition-colors whitespace-nowrap"
          >
            <i className="ri-file-download-line" /> 导入模板
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 cursor-pointer transition-colors whitespace-nowrap"
          >
            <i className="ri-delete-bin-line" /> 清空
          </button>
          <button
            onClick={() => {}}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-steel-600 border border-steel-200 rounded hover:bg-slate-50 cursor-pointer transition-colors whitespace-nowrap"
          >
            <i className="ri-eye-line" /> 参考样表
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table style={{ minWidth: 1480, tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
          <colgroup>
            <col style={{ width: 50 }} />
            <col style={{ width: 200 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 60 }} />
            <col style={{ width: 60 }} />
            <col style={{ width: 70 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 80 }} />
          </colgroup>
          <thead>
            {/* 上层表头 */}
            <tr>
              <th rowSpan={2} className={groupThCls}>序号</th>
              <th rowSpan={2} className={groupThCls + ' text-left'}>项目/费用名称</th>
              <th rowSpan={2} className={groupThCls}>规格型号</th>
              <th rowSpan={2} className={groupThCls}>
                <span className="relative group cursor-help inline-flex items-center gap-1">
                  是否四类九款
                  <i className="ri-question-line text-steel-400 text-xs" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-72 px-3 py-2 text-xs text-left leading-relaxed text-white rounded-md shadow-lg z-50 pointer-events-none whitespace-normal" style={{ background: '#1e293b' }}>
                    四类九款是指：软件产品包括操作系统（服务器操作系统、终端操作系统）、数据库（集中式数据库、分布式数据库）两大类四款。硬件产品包括服务器（通用服务器）、终端（台式计算机、便携式计算机、一体式计算机、工作站）两大类五款。
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: '#1e293b' }} />
                  </span>
                </span>
              </th>
              <th rowSpan={2} className={groupThCls}>采购目录</th>
              <th colSpan={5} className={groupThCls} style={{ borderBottom: '1px solid #e2e8f0' }}>费用估算(万元)</th>
              <th colSpan={4} className={groupThCls} style={{ borderBottom: '1px solid #e2e8f0' }}>综合指标</th>
              <th rowSpan={2} className={groupThCls}>备注</th>
              <th rowSpan={2} className={groupThCls}>操作</th>
            </tr>
            {/* 下层表头 */}
            <tr>
              <th className={thCls}>建筑工程费</th>
              <th className={thCls}>安装工程费</th>
              <th className={thCls}>设备费</th>
              <th className={thCls}>其他费</th>
              <th className={thCls}>合计</th>
              <th className={thCls}>单位</th>
              <th className={thCls}>数量</th>
              <th className={thCls}>重量/T</th>
              <th className={thCls}>指标</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((row, idx) => {
              if (isHidden(row)) return null;
              const indent = row.level * 16;
              const isTotalRow = isTotal(row.id);
              const isReserveRow = isReserve(row.id);
              const hasChildren = rows.some((r) => r.parentId === row.id);
              const rowBgClass = isTotalRow
                ? 'bg-slate-100'
                : row.parentId === null
                ? 'bg-slate-50/80'
                : '';

              const leafEditable = !hasChildren && !isTotalRow && !isReserveRow;
              const parentReadonly = hasChildren && !isTotalRow && !isReserveRow;

              return (
                <tr key={row.id} className={rowBgClass}>
                  {/* 序号 */}
                  <td className={tdCls + ' text-center text-steel-400'}>{idx + 1}</td>

                  {/* 名称 */}
                  <td className={tdCls}>
                    <div style={{ paddingLeft: indent }} className="flex items-center gap-1">
                      {hasChildren && (
                        <button
                          onClick={() => toggleCollapse(row.id)}
                          className="w-4 h-4 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer flex-shrink-0"
                        >
                          {collapsed.has(row.id)
                            ? <i className="ri-arrow-right-s-line text-xs" />
                            : <i className="ri-arrow-down-s-line text-xs" />
                          }
                        </button>
                      )}
                      {!hasChildren && <span className="w-4 flex-shrink-0" />}
                      {isRootFixed(row.id) ? (
                        <span className={`text-xs font-semibold ${isTotalRow ? 'text-steel-800' : 'text-steel-700'}`}>{row.name}</span>
                      ) : (
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => update(row.id, 'name', e.target.value)}
                          placeholder="费用名称"
                          className="flex-1 px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-white"
                        />
                      )}
                    </div>
                  </td>

                  {/* 规格型号 */}
                  <td className={tdCls}>
                    {!isRootFixed(row.id) && (
                      <input
                        type="text"
                        value={row.spec}
                        onChange={(e) => update(row.id, 'spec', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-white"
                      />
                    )}
                  </td>

                  {/* 是否四类九款 */}
                  <td className={tdCls + ' text-center'}>
                    {!isRootFixed(row.id) && (
                      <label className="flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={row.isFourNine}
                          onChange={(e) => update(row.id, 'isFourNine', e.target.checked)}
                          className="w-4 h-4 rounded border-steel-300 text-emerald-500 cursor-pointer"
                        />
                      </label>
                    )}
                  </td>

                  {/* 采购目录 — 下拉选择 */}
                  <td className={tdCls}>
                    {!isRootFixed(row.id) && (
                      <select
                        value={row.purchaseCategory}
                        onChange={(e) => update(row.id, 'purchaseCategory', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-white cursor-pointer"
                      >
                        <option value="">请选择</option>
                        {PURCHASE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* 建筑工程费 */}
                  <td className={tdCls}>
                    {isReserveRow ? (
                      <span className="text-xs text-steel-300 text-right block">-</span>
                    ) : leafEditable ? (
                      numInput(row.constructFee, (v) => update(row.id, 'constructFee', v))
                    ) : (
                      <span className="text-xs text-steel-600 text-right block">{fmtNum(row.constructFee)}</span>
                    )}
                  </td>

                  {/* 安装工程费 */}
                  <td className={tdCls}>
                    {isReserveRow ? (
                      <span className="text-xs text-steel-300 text-right block">-</span>
                    ) : leafEditable ? (
                      numInput(row.installFee, (v) => update(row.id, 'installFee', v))
                    ) : (
                      <span className="text-xs text-steel-600 text-right block">{fmtNum(row.installFee)}</span>
                    )}
                  </td>

                  {/* 设备费 */}
                  <td className={tdCls}>
                    {isReserveRow ? (
                      <span className="text-xs text-steel-300 text-right block">-</span>
                    ) : leafEditable ? (
                      numInput(row.equipFee, (v) => update(row.id, 'equipFee', v))
                    ) : (
                      <span className="text-xs text-steel-600 text-right block">{fmtNum(row.equipFee)}</span>
                    )}
                  </td>

                  {/* 其他费 */}
                  <td className={tdCls}>
                    {isReserveRow ? (
                      <span className="text-xs text-steel-300 text-right block">-</span>
                    ) : leafEditable ? (
                      numInput(row.otherFee, (v) => update(row.id, 'otherFee', v))
                    ) : (
                      <span className="text-xs text-steel-600 text-right block">{fmtNum(row.otherFee)}</span>
                    )}
                  </td>

                  {/* 合计 */}
                  <td className={tdCls}>
                    {isReserveRow ? (
                      numInput(row.total, (v) => update(row.id, 'total', v))
                    ) : (
                      <span className={`text-xs text-right block font-medium ${isTotalRow ? 'text-emerald-700' : 'text-steel-700'}`}>
                        {fmtNum(row.total)}
                      </span>
                    )}
                  </td>

                  {/* 单位 */}
                  <td className={tdCls}>
                    {!isRootFixed(row.id) && (
                      <input
                        type="text"
                        value={row.unit}
                        onChange={(e) => update(row.id, 'unit', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-white"
                      />
                    )}
                  </td>

                  {/* 数量 */}
                  <td className={tdCls}>
                    {!isRootFixed(row.id) && numInput(row.quantity, (v) => update(row.id, 'quantity', v))}
                  </td>

                  {/* 重量/T */}
                  <td className={tdCls}>
                    {!isRootFixed(row.id) && numInput(row.weight, (v) => update(row.id, 'weight', v))}
                  </td>

                  {/* 指标 */}
                  <td className={tdCls}>
                    {!isRootFixed(row.id) && (
                      <input
                        type="text"
                        value={row.indicator}
                        onChange={(e) => update(row.id, 'indicator', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-white"
                      />
                    )}
                  </td>

                  {/* 备注 */}
                  <td className={tdCls}>
                    {!isTotalRow && (
                      <input
                        type="text"
                        value={row.remark}
                        onChange={(e) => update(row.id, 'remark', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-white"
                      />
                    )}
                  </td>

                  {/* 操作 */}
                  <td className={tdCls + ' text-center'}>
                    <div className="flex items-center justify-center gap-1">
                      {canAddChild(rows, row) && (
                        <button
                          onClick={() => addChild(row.id)}
                          title="新增子项"
                          className="w-6 h-6 flex items-center justify-center rounded text-emerald-500 hover:bg-emerald-50 cursor-pointer transition-colors"
                        >
                          <i className="ri-add-line text-xs" />
                        </button>
                      )}
                      {!row.fixed && (
                        <button
                          onClick={() => removeRow(row.id)}
                          title="删除"
                          className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 cursor-pointer transition-colors"
                        >
                          <i className="ri-delete-bin-line text-xs" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tip */}
      <div className="px-5 py-3 border-t border-steel-100 bg-slate-50/60">
        <p className="text-xs text-steel-400">
          <i className="ri-information-line mr-1" />
          工程费用支持新增2级子项，工程建设其他费支持新增1级子项；项目总投资由系统自动汇总；预备费仅需填写合计金额。
        </p>
      </div>
    </div>
  );
}