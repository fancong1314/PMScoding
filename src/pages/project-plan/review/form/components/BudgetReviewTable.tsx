import { useState, useCallback } from 'react';
import type { BudgetTreeNode } from '@/mocks/reviewMocks';

interface Props {
  treeData: BudgetTreeNode[];
  onChange: (tree: BudgetTreeNode[]) => void;
  budgetTotal: number;
}

type CostField = 'buildCost' | 'installCost' | 'equipCost' | 'otherCost';
const COST_FIELDS: CostField[] = ['buildCost', 'installCost', 'equipCost', 'otherCost'];

function calcNodeTotal(node: BudgetTreeNode): number {
  return node.buildCost + node.installCost + node.equipCost + node.otherCost;
}

function recalcTree(nodes: BudgetTreeNode[]): BudgetTreeNode[] {
  return nodes.map((node) => {
    if (node.category === 'total') {
      // 项目总投资 = sum of other 3 level-1 nodes
      const engineering = nodes.find((n) => n.category === 'engineering');
      const other = nodes.find((n) => n.category === 'otherEngineering');
      const reserve = nodes.find((n) => n.category === 'reserve');
      const recalcedChildren = (engineering?.children || []).map(recalcL2);
      const engNode = recalcedChildren.reduce((acc, c) => ({ ...acc }), engineering);
      const cols = COST_FIELDS.reduce((acc, f) => {
        const engVal = (engineering ? sumChildrenCost(engineering.children, f) : 0);
        const otherVal = (other ? sumChildrenCost(other.children, f) : 0);
        const reserveVal = (reserve ? reserve[f] : 0);
        return { ...acc, [f]: engVal + otherVal + reserveVal };
      }, {} as Record<CostField, number>);
      void recalcedChildren; void engNode;
      const total = cols.buildCost + cols.installCost + cols.equipCost + cols.otherCost
        + (reserve?.total ?? 0)
        - (reserve ? COST_FIELDS.reduce((s, f) => s + reserve[f], 0) : 0);
      // total = sum of the three level-1 totals
      const engTotal = engineering ? sumL1Total(engineering) : 0;
      const otherTotal = other ? sumL1Total(other) : 0;
      const reserveTotal = reserve?.total ?? 0;
      return { ...node, ...cols, total: engTotal + otherTotal + reserveTotal };
    }
    if (node.level === 1) {
      const updatedChildren = node.children.map(recalcL2);
      if (node.category === 'reserve') {
        return { ...node, children: updatedChildren };
      }
      const cols = COST_FIELDS.reduce((acc, f) => {
        return { ...acc, [f]: updatedChildren.reduce((s, c) => s + c[f], 0) };
      }, {} as Record<CostField, number>);
      const nodeTotal = updatedChildren.reduce((s, c) => s + c.total, 0);
      return { ...node, children: updatedChildren, ...cols, total: nodeTotal };
    }
    return node;
  });
}

function recalcL2(node: BudgetTreeNode): BudgetTreeNode {
  if (node.level !== 2) return node;
  const updatedChildren = node.children.map(recalcL3);
  if (updatedChildren.length === 0) {
    // no children, keep user-input values, recalc total
    const total = calcNodeTotal(node);
    return { ...node, children: [], total };
  }
  const cols = COST_FIELDS.reduce((acc, f) => {
    return { ...acc, [f]: updatedChildren.reduce((s, c) => s + c[f], 0) };
  }, {} as Record<CostField, number>);
  const nodeTotal = updatedChildren.reduce((s, c) => s + c.total, 0);
  return { ...node, children: updatedChildren, ...cols, total: nodeTotal };
}

function recalcL3(node: BudgetTreeNode): BudgetTreeNode {
  if (node.level !== 3) return node;
  const total = calcNodeTotal(node);
  return { ...node, total };
}

function sumChildrenCost(children: BudgetTreeNode[], field: CostField): number {
  return children.reduce((s, c) => s + c[field], 0);
}

function sumL1Total(node: BudgetTreeNode): number {
  if (node.category === 'reserve') return node.total;
  if (node.children.length === 0) return node.total;
  return node.children.reduce((s, c) => s + c.total, 0);
}

function genId() { return `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

function formatNum(v: number) { return v === 0 ? '' : v.toFixed(2); }

function numInput(
  val: number,
  onChange: (v: number) => void,
  disabled: boolean,
  cls = ''
) {
  return (
    <input
      type="number"
      min={0}
      step="1"
      value={val === 0 ? '' : val}
      disabled={disabled}
      onChange={(e) => {
        const n = parseFloat(e.target.value);
        onChange(isNaN(n) || n < 0 ? 0 : n);
      }}
      className={`w-full px-1.5 py-1 text-xs text-right border rounded focus:outline-none focus:ring-1 focus:ring-primary-400/40 ${disabled ? 'bg-transparent border-transparent text-steel-700 cursor-default' : 'bg-white border-steel-200 text-steel-700'} ${cls}`}
      placeholder="0.00"
    />
  );
}

export default function BudgetReviewTable({ treeData, onChange, budgetTotal }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<{ node: BudgetTreeNode; parentId: string | null } | null>(null);

  const updateTree = useCallback((newTree: BudgetTreeNode[]) => {
    onChange(recalcTree(newTree));
  }, [onChange]);

  const updateNode = (nodeId: string, updates: Partial<BudgetTreeNode>, tree: BudgetTreeNode[]): BudgetTreeNode[] => {
    return tree.map((node) => {
      if (node.id === nodeId) return { ...node, ...updates };
      return { ...node, children: updateNode(nodeId, updates, node.children) };
    });
  };

  const handleFieldChange = (nodeId: string, field: keyof BudgetTreeNode, value: string | number) => {
    const updated = updateNode(nodeId, { [field]: value }, treeData);
    updateTree(updated);
  };

  const addL2Child = (parentId: string) => {
    const newNode: BudgetTreeNode = {
      id: genId(), level: 2, category: 'engineering',
      name: '', spec: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 0, total: 0,
      unit: '', quantity: 0, weight: 0, indicator: '', remark: '', isFixed: false, children: [],
    };
    const addToParent = (nodes: BudgetTreeNode[]): BudgetTreeNode[] => nodes.map((n) =>
      n.id === parentId ? { ...n, children: [...n.children, newNode] } : { ...n, children: addToParent(n.children) }
    );
    updateTree(addToParent(treeData));
  };

  const addL3Child = (parentId: string, parentCategory: string) => {
    const newNode: BudgetTreeNode = {
      id: genId(), level: 3, category: parentCategory as BudgetTreeNode['category'],
      name: '', spec: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 0, total: 0,
      unit: '', quantity: 0, weight: 0, indicator: '', remark: '', isFixed: false, children: [],
    };
    const addToParent = (nodes: BudgetTreeNode[]): BudgetTreeNode[] => nodes.map((n) =>
      n.id === parentId ? { ...n, children: [...n.children, newNode] } : { ...n, children: addToParent(n.children) }
    );
    updateTree(addToParent(treeData));
  };

  const deleteNode = (nodeId: string) => {
    const removeFromTree = (nodes: BudgetTreeNode[]): BudgetTreeNode[] =>
      nodes.filter((n) => n.id !== nodeId).map((n) => ({ ...n, children: removeFromTree(n.children) }));
    updateTree(removeFromTree(treeData));
    setConfirmDelete(null);
  };

  const textInput = (
    nodeId: string,
    field: keyof BudgetTreeNode,
    value: string,
    disabled: boolean,
    placeholder = ''
  ) => (
    <input
      type="text"
      value={value}
      disabled={disabled}
      onChange={(e) => handleFieldChange(nodeId, field, e.target.value)}
      placeholder={disabled ? '' : placeholder}
      className={`w-full px-1.5 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-400/40 ${disabled ? 'bg-transparent border-transparent text-steel-700' : 'bg-white border-steel-200 text-steel-700'}`}
    />
  );

  const thCls = 'px-2 py-2 text-xs font-semibold text-steel-600 text-center whitespace-nowrap border-b border-r border-steel-200 align-middle';
  const tdBase = 'px-1.5 py-1.5 align-middle border-b border-r border-steel-100';

  const renderL1Row = (node: BudgetTreeNode) => {
    const isTotal = node.category === 'total';
    const isReserve = node.category === 'reserve';
    const bgStyle = { backgroundColor: '#ecfdf5' };
    const hasChildren = node.children.length > 0;

    return (
      <tr key={node.id} style={bgStyle}>
        <td className={`${tdBase} text-center font-bold text-sm text-steel-700`} style={{ ...bgStyle }}>
          {!isTotal && (
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => addL2Child(node.id)}
                className="w-5 h-5 flex items-center justify-center rounded-full text-white text-xs cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#ef4444' }}
                title="添加子行">
                <i className="ri-add-line" />
              </button>
              {hasChildren && (
                <button
                  onClick={() => setConfirmDelete({ node, parentId: null })}
                  className="w-5 h-5 flex items-center justify-center rounded-full text-white text-xs cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#22c55e' }}
                  title="删除所有子行">
                  <i className="ri-subtract-line" />
                </button>
              )}
            </div>
          )}
        </td>
        <td className={`${tdBase} text-center text-sm font-bold text-steel-800`} style={bgStyle}>{node.seqLabel}</td>
        <td className={`${tdBase} text-sm font-bold text-steel-800`} style={bgStyle}>
          <span className="px-1.5">{node.name}</span>
        </td>
        <td className={`${tdBase}`} style={bgStyle} />
        {COST_FIELDS.map((f) => (
          <td key={f} className={`${tdBase} text-right text-xs font-semibold text-steel-800`} style={bgStyle}>
            <span className="px-1.5">{formatNum(node[f] as number) || '—'}</span>
          </td>
        ))}
        <td className={`${tdBase} text-right`} style={bgStyle}>
          {isReserve
            ? numInput(node.total, (v) => handleFieldChange(node.id, 'total', v), false, 'font-bold')
            : <span className="px-1.5 text-xs font-bold text-steel-800">{formatNum(node.total) || '—'}</span>
          }
        </td>
        <td className={tdBase} style={bgStyle} />
        <td className={tdBase} style={bgStyle} />
        <td className={tdBase} style={bgStyle} />
        <td className={tdBase} style={bgStyle} />
        <td className={`${tdBase} text-xs text-steel-500`} style={bgStyle}>
          {node.category === 'otherEngineering' ? (
            <span className="px-1.5 text-steel-500">{node.remark}</span>
          ) : null}
        </td>
      </tr>
    );
  };

  const renderL2Row = (node: BudgetTreeNode, parentId: string) => {
    const bgStyle = { backgroundColor: '#f1f5f9' };
    const hasChildren = node.children.length > 0;
    const costsDisabled = hasChildren; // if has children, costs come from children

    return (
      <tr key={node.id} style={bgStyle}>
        <td className={`${tdBase} text-center`} style={bgStyle}>
          <div className="flex items-center justify-center gap-1 pl-4">
            <button onClick={() => setConfirmDelete({ node, parentId })}
              className="w-5 h-5 flex items-center justify-center rounded-full text-white text-xs cursor-pointer hover:opacity-80"
              style={{ backgroundColor: '#22c55e' }} title="删除此行">
              <i className="ri-subtract-line" />
            </button>
            <button onClick={() => addL3Child(node.id, node.category)}
              className="w-5 h-5 flex items-center justify-center rounded-full text-white text-xs cursor-pointer hover:opacity-80"
              style={{ backgroundColor: '#ef4444' }} title="添加三级子行">
              <i className="ri-add-line" />
            </button>
          </div>
        </td>
        <td className={`${tdBase}`} style={bgStyle} />
        <td className={`${tdBase} pl-6`} style={bgStyle}>
          {textInput(node.id, 'name', node.name, false, '费用名称')}
        </td>
        <td className={`${tdBase}`} style={bgStyle}>
          {textInput(node.id, 'spec', node.spec, false, '规格型号')}
        </td>
        {COST_FIELDS.map((f) => (
          <td key={f} className={tdBase} style={bgStyle}>
            {numInput(node[f] as number, (v) => handleFieldChange(node.id, f, v), costsDisabled)}
          </td>
        ))}
        <td className={`${tdBase} text-right text-xs font-semibold text-steel-700`} style={bgStyle}>
          <span className="px-1.5">{formatNum(node.total) || '—'}</span>
        </td>
        <td className={tdBase} style={bgStyle}>
          {textInput(node.id, 'unit', node.unit, false, '单位')}
        </td>
        <td className={tdBase} style={bgStyle}>
          {numInput(node.quantity, (v) => handleFieldChange(node.id, 'quantity', v), false)}
        </td>
        <td className={tdBase} style={bgStyle}>
          {numInput(node.weight, (v) => handleFieldChange(node.id, 'weight', v), false)}
        </td>
        <td className={tdBase} style={bgStyle}>
          {textInput(node.id, 'indicator', node.indicator, false, '指标')}
        </td>
        <td className={tdBase} style={bgStyle}>
          {textInput(node.id, 'remark', node.remark, false, '备注')}
        </td>
      </tr>
    );
  };

  const renderL3Row = (node: BudgetTreeNode, parentId: string) => {
    return (
      <tr key={node.id} style={{ backgroundColor: '#ffffff' }}>
        <td className={`${tdBase} text-center`}>
          <div className="flex items-center justify-center pl-8">
            <button onClick={() => setConfirmDelete({ node, parentId })}
              className="w-5 h-5 flex items-center justify-center rounded-full text-white text-xs cursor-pointer hover:opacity-80"
              style={{ backgroundColor: '#22c55e' }} title="删除此行">
              <i className="ri-subtract-line" />
            </button>
          </div>
        </td>
        <td className={tdBase} />
        <td className={`${tdBase} pl-10`}>
          {textInput(node.id, 'name', node.name, false, '明细名称')}
        </td>
        <td className={tdBase}>
          {textInput(node.id, 'spec', node.spec, false, '规格型号')}
        </td>
        {COST_FIELDS.map((f) => (
          <td key={f} className={tdBase}>
            {numInput(node[f] as number, (v) => handleFieldChange(node.id, f, v), false)}
          </td>
        ))}
        <td className="px-1.5 py-1.5 align-middle border-b border-r border-steel-100 text-right text-xs font-semibold text-emerald-700">
          {formatNum(node.total) || '—'}
        </td>
        <td className={tdBase}>
          {textInput(node.id, 'unit', node.unit, false, '单位')}
        </td>
        <td className={tdBase}>
          {numInput(node.quantity, (v) => handleFieldChange(node.id, 'quantity', v), false)}
        </td>
        <td className={tdBase}>
          {numInput(node.weight, (v) => handleFieldChange(node.id, 'weight', v), false)}
        </td>
        <td className={tdBase}>
          {textInput(node.id, 'indicator', node.indicator, false, '指标')}
        </td>
        <td className={tdBase}>
          {textInput(node.id, 'remark', node.remark, false, '备注')}
        </td>
      </tr>
    );
  };

  const renderRows = (nodes: BudgetTreeNode[]): React.ReactNode[] => {
    const rows: React.ReactNode[] = [];
    for (const node of nodes) {
      if (node.level === 1) {
        rows.push(renderL1Row(node));
        for (const child of node.children) {
          rows.push(renderL2Row(child, node.id));
          for (const grandchild of child.children) {
            rows.push(renderL3Row(grandchild, child.id));
          }
        }
      }
    }
    return rows;
  };

  return (
    <div className="relative">
      {/* Total Summary Bar */}
      <div className="flex items-center gap-6 px-4 py-2.5 mb-3 rounded-lg border border-steel-200" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-money-cny-circle-line text-emerald-600 text-base" />
          </div>
          <span className="text-sm text-steel-600">概算总额：</span>
          <span className="text-lg font-bold" style={{ color: '#16a34a' }}>{budgetTotal.toFixed(2)}</span>
          <span className="text-sm text-steel-500">万元</span>
        </div>
        <div className="h-4 border-l border-steel-200" />
        <p className="text-xs text-steel-400">概算总额 = 项目总投资合计，实时同步计算</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-steel-200">
        <table style={{ minWidth: '1200px', tableLayout: 'auto', borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ backgroundColor: '#f5f7fa' }}>
              <th className={thCls} rowSpan={2} style={{ width: '64px' }}>操作</th>
              <th className={thCls} rowSpan={2} style={{ width: '36px' }}>序号</th>
              <th className={thCls} rowSpan={2} style={{ minWidth: '160px' }}>项目/费用名称</th>
              <th className={thCls} rowSpan={2} style={{ minWidth: '100px' }}>规格型号</th>
              <th className={thCls} colSpan={5}>费用估算表（万元）</th>
              <th className={thCls} colSpan={4}>综合指标</th>
              <th className={thCls} rowSpan={2} style={{ minWidth: '80px' }}>备注</th>
            </tr>
            <tr style={{ backgroundColor: '#f5f7fa' }}>
              {['建筑工程费', '安装工程费', '设备费', '其他费', '合计'].map((h) => (
                <th key={h} className={thCls} style={{ minWidth: '80px' }}>{h}</th>
              ))}
              {['单位', '数量', '重量/t', '指标'].map((h) => (
                <th key={h} className={thCls} style={{ minWidth: '56px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderRows(treeData)}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[9995] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-xl border border-steel-200 w-[360px] overflow-hidden">
            <div className="px-5 py-4 border-b border-steel-100" style={{ backgroundColor: '#fafbfd' }}>
              <h3 className="text-sm font-semibold text-steel-800">确认删除</h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-steel-600">
                确定要删除「<span className="font-medium text-red-600">{confirmDelete.node.name || '此行'}</span>」
                {confirmDelete.node.level === 1 ? '及其所有子行' : confirmDelete.node.level === 2 ? '及其所有三级子行' : ''}？
              </p>
              <p className="text-xs text-steel-400 mt-1">删除后数据将不可恢复</p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100">
              <button onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                取消
              </button>
              <button onClick={() => deleteNode(confirmDelete.node.id)}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap">
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
