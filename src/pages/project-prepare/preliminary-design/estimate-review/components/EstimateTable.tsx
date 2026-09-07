import { type EstimateItem } from '@/mocks/designReviewMocks';

interface EstimateTableProps {
  data: EstimateItem[];
  isEditMode: boolean;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onAmountChange: (id: string, value: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (parentId: string, parentName: string, level: number) => void;
  formatMoney: (n: number) => string;
}

function getLevelStyle(level: number) {
  switch (level) {
    case 1:
      return { backgroundColor: '#e8f5e9', borderLeft: '3px solid #66bb6a' };
    case 2:
      return { backgroundColor: '#e3f2fd', borderLeft: '3px solid #42a5f5' };
    case 3:
      return { backgroundColor: '#fff3e0', borderLeft: '3px solid #ffa726' };
    default:
      return { backgroundColor: '#f8fafc', borderLeft: '3px solid #94a3b8' };
  }
}

export default function EstimateTable({
  data,
  isEditMode,
  expandedIds,
  onToggleExpand,
  onAmountChange,
  onDeleteItem,
  onAddItem,
  formatMoney,
}: EstimateTableProps) {
  const rows: React.ReactNode[] = [];

  const collectRows = (parentId: string | null = null, depth = 0) => {
    const children = data.filter((i) => i.parentId === parentId);

    children.forEach((item) => {
      const hasChildren = data.some((e) => e.parentId === item.id);
      const isExpanded = expandedIds.has(item.id);
      const canAddChild = isEditMode && item.level < 3 && item.name !== '项目总投资';
      const canDelete = isEditMode && item.level > 1;
      const canEditAmount = isEditMode && item.level > 1;

      rows.push(
        <tr
          key={item.id}
          className="border-b border-steel-100 transition-colors hover:opacity-90"
          style={getLevelStyle(item.level)}
        >
          {/* 展开收起 */}
          <td className="px-3 py-2.5 text-center w-10">
            {hasChildren ? (
              <button
                onClick={() => onToggleExpand(item.id)}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/5 transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <i className="ri-arrow-down-s-line text-steel-500 text-sm" />
                ) : (
                  <i className="ri-arrow-right-s-line text-steel-500 text-sm" />
                )}
              </button>
            ) : (
              <span className="inline-block w-5" />
            )}
          </td>

          {/* 费用名称 */}
          <td
            className="px-3 py-2.5 text-sm text-steel-800 whitespace-nowrap"
            style={{ paddingLeft: `${12 + depth * 20}px`, minWidth: '220px' }}
          >
            <span
              className={
                item.level === 1
                  ? 'font-semibold'
                  : item.level === 2
                    ? 'font-medium'
                    : ''
              }
            >
              {item.name}
            </span>
            {item.level === 1 && item.name === '项目总投资' && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-steel-100 text-steel-600 border border-steel-200">
                汇总
              </span>
            )}
          </td>

          {/* 规格型号 */}
          <td
            className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap"
            style={{ minWidth: '140px' }}
          >
            {item.spec || '-'}
          </td>

          {/* 采购目录 */}
          <td
            className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap"
            style={{ minWidth: '110px' }}
          >
            {item.catalog || '-'}
          </td>

          {/* 四类九款 */}
          <td
            className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap"
            style={{ minWidth: '110px' }}
          >
            {item.fourClassNine || '-'}
          </td>

          {/* 采购细类 */}
          <td
            className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap"
            style={{ minWidth: '110px' }}
          >
            {item.subClass || '-'}
          </td>

          {/* 概算原始金额 */}
          <td
            className="px-3 py-2.5 text-sm text-steel-500 font-mono text-right whitespace-nowrap"
            style={{ minWidth: '130px' }}
          >
            {formatMoney(item.originalAmount)}
          </td>

          {/* 概算修订金额 */}
          <td
            className="px-3 py-2.5 text-sm font-mono text-right whitespace-nowrap"
            style={{ minWidth: '130px' }}
          >
            {canEditAmount ? (
              <div className="relative inline-block w-full max-w-[140px]">
                <input
                  type="number"
                  value={item.revisedAmount}
                  onChange={(e) => onAmountChange(item.id, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-steel-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white text-right font-mono"
                  min={0}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-steel-300 pointer-events-none">
                  元
                </span>
              </div>
            ) : (
              <span
                className={`font-mono ${
                  item.level === 1 ? 'font-semibold text-steel-800' : 'text-steel-700'
                }`}
              >
                {formatMoney(item.revisedAmount)}
              </span>
            )}
          </td>

          {/* 操作 */}
          <td
            className="px-3 py-2.5 text-center whitespace-nowrap"
            style={{ minWidth: '120px' }}
          >
            <div className="flex items-center justify-center gap-1">
              {canAddChild && (
                <button
                  onClick={() => onAddItem(item.id, item.name, item.level)}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-primary-50 text-primary-600 transition-colors cursor-pointer"
                  title="新增细项"
                >
                  <i className="ri-add-line text-sm" />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-danger-50 text-danger-500 transition-colors cursor-pointer"
                  title="删除细项"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              )}
              {!canAddChild && !canDelete && (
                <span className="text-xs text-steel-300">-</span>
              )}
            </div>
          </td>
        </tr>
      );

      if (isExpanded) {
        collectRows(item.id, depth + 1);
      }
    });
  };

  collectRows();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" style={{ minWidth: '1100px' }}>
        <thead>
          <tr
            style={{
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e8edf3',
            }}
          >
            <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center w-10" />
            <th
              className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap"
              style={{ minWidth: '220px' }}
            >
              费用名称
            </th>
            <th
              className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap"
              style={{ minWidth: '140px' }}
            >
              规格型号
            </th>
            <th
              className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap"
              style={{ minWidth: '110px' }}
            >
              采购目录
            </th>
            <th
              className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap"
              style={{ minWidth: '110px' }}
            >
              四类九款
            </th>
            <th
              className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap"
              style={{ minWidth: '110px' }}
            >
              采购细类
            </th>
            <th
              className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-right"
              style={{ minWidth: '130px' }}
            >
              概算原始金额(元)
            </th>
            <th
              className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-right"
              style={{ minWidth: '130px' }}
            >
              概算修订金额(元)
            </th>
            <th
              className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center"
              style={{ minWidth: '120px' }}
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}