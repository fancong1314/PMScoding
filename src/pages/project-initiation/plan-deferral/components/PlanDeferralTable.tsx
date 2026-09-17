import type { CSSProperties } from 'react';
import type { PlanDeferralRecord, PlanApplicationType } from '@/mocks/planDeferralMocks';
import { planDeferralStatusMap, planApprovalStatusMap, planActionConfig } from '@/mocks/planDeferralMocks';

interface ColDef {
  id: string;
  label: string;
  width: number;
  align?: 'left' | 'center' | 'right';
}

const SEQ_W = 56;
const ACTION_W = 300;

/** 左侧固定列（紧随序号之后） */
const LEFT_PIN_IDS = ['planNo', 'planName'] as const;

const COLUMNS: ColDef[] = [
  { id: 'planNo', label: '立项号', width: 130 },
  { id: 'planName', label: '项目名称', width: 240 },
  { id: 'projectMajorCategory', label: '项目大类', width: 90, align: 'center' },
  { id: 'projectType', label: '项目类型', width: 120 },
  { id: 'planYear', label: '计划年度', width: 90, align: 'center' },
  { id: 'planStatus', label: '项目状态', width: 100, align: 'center' },
  { id: 'approvalStatus', label: '审批状态', width: 110, align: 'center' },
];

const midW = COLUMNS.reduce((s, c) => s + c.width, 0);
const totalW = SEQ_W + midW + ACTION_W;
const hBg = '#f5f7fa';

interface Props {
  records: PlanDeferralRecord[];
  pageOffset: number;
  onViewLog: (record: PlanDeferralRecord) => void;
  onApply: (record: PlanDeferralRecord, type: PlanApplicationType) => void;
}

export default function PlanDeferralTable({ records, pageOffset, onViewLog, onApply }: Props) {
  const leftPinCols = LEFT_PIN_IDS
    .map((id) => COLUMNS.find((c) => c.id === id))
    .filter((c): c is ColDef => !!c);
  const scrollCols = COLUMNS.filter((c) => !(LEFT_PIN_IDS as readonly string[]).includes(c.id));
  const visibleCols = [...leftPinCols, ...scrollCols];
  const pinCount = leftPinCols.length;
  const lastPinIdx = pinCount - 1;
  const leftFixedW = SEQ_W;

  const stickyLeftOf = (i: number) => {
    let left = leftFixedW;
    for (let j = 0; j < i; j++) left += visibleCols[j]?.width ?? 0;
    return left;
  };

  const thStyle = (i: number): CSSProperties => {
    if (i >= pinCount) return { backgroundColor: hBg };
    return {
      position: 'sticky',
      left: stickyLeftOf(i),
      zIndex: 20,
      backgroundColor: hBg,
      ...(i === lastPinIdx ? { boxShadow: '2px 0 6px -2px rgba(0,0,0,0.1)' } : {}),
    };
  };

  const tdStyle = (i: number, bg: string): CSSProperties | undefined => {
    if (i >= pinCount) return undefined;
    return {
      position: 'sticky',
      left: stickyLeftOf(i),
      zIndex: 10,
      backgroundColor: bg,
      ...(i === lastPinIdx ? { boxShadow: '2px 0 6px -2px rgba(0,0,0,0.06)' } : {}),
    };
  };

  const alignCls = (align?: ColDef['align']) => {
    if (align === 'right') return 'text-right';
    if (align === 'center') return 'text-center';
    return 'text-left';
  };

  const renderCell = (colId: string, record: PlanDeferralRecord) => {
    switch (colId) {
      case 'planNo':
        return (
          <span className="font-mono text-xs text-primary-700 font-medium whitespace-nowrap">
            {record.planNo}
          </span>
        );
      case 'planName':
        return (
          <span className="text-sm text-steel-800 font-medium leading-5 line-clamp-1" title={record.planName}>
            {record.planName}
          </span>
        );
      case 'projectMajorCategory':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap bg-emerald-50 text-emerald-700">
            {record.projectMajorCategory}
          </span>
        );
      case 'projectType':
        return <span className="text-sm text-steel-600 whitespace-nowrap">{record.projectType}</span>;
      case 'planYear':
        return <span className="text-sm text-steel-700 whitespace-nowrap">{record.planYear}年</span>;
      case 'planStatus': {
        const s = planDeferralStatusMap[record.planStatus];
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${s.color}`}>
            {s.label}
          </span>
        );
      }
      case 'approvalStatus': {
        const s = planApprovalStatusMap[record.approvalStatus];
        return (
          <span className="inline-flex items-center justify-center gap-1 text-xs font-medium text-steel-600 whitespace-nowrap">
            <i className={`ri-checkbox-blank-circle-fill text-[8px] ${s.dotColor}`} />
            {s.label}
          </span>
        );
      }
      default:
        return <span className="text-sm text-steel-400">—</span>;
    }
  };

  const visibleActions = (record: PlanDeferralRecord): PlanApplicationType[] => {
    return record.allowedActions.filter((action) => {
      if (action === 'execute') return record.planStatus === '暂缓';
      return true;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-steel-100 bg-slate-50">
        <span className="text-xs text-steel-500">
          共 <span className="font-medium text-steel-700">{records.length}</span> 条
        </span>
      </div>

      <div className="overflow-x-auto">
        <table
          style={{
            width: totalW,
            minWidth: totalW,
            tableLayout: 'fixed',
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}
        >
          <colgroup>
            <col style={{ width: SEQ_W }} />
            {visibleCols.map((c) => (
              <col key={c.id} style={{ width: c.width }} />
            ))}
            <col style={{ width: ACTION_W }} />
          </colgroup>
          <thead>
            <tr>
              <th
                className="border-b border-steel-200 px-2 py-3 text-xs font-semibold text-steel-600 text-center whitespace-nowrap"
                style={{ position: 'sticky', left: 0, zIndex: 21, backgroundColor: hBg }}
              >
                序号
              </th>
              {visibleCols.map((col, i) => (
                <th
                  key={col.id}
                  className={`border-b border-steel-200 px-3 py-3 text-xs font-semibold text-steel-600 whitespace-nowrap ${
                    i === lastPinIdx ? 'border-r' : ''
                  } ${alignCls(col.align)}`}
                  style={thStyle(i)}
                >
                  {col.label}
                </th>
              ))}
              <th
                className="border-b border-l border-steel-200 px-3 py-3 text-center text-xs font-semibold text-steel-600 whitespace-nowrap"
                style={{
                  position: 'sticky',
                  right: 0,
                  zIndex: 21,
                  backgroundColor: hBg,
                  boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.1)',
                }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + 2} className="px-3 py-16 text-center text-sm text-steel-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100">
                      <i className="ri-inbox-2-line text-xl text-steel-300" />
                    </div>
                    <span>暂无数据</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record, idx) => {
                const rowBg = idx % 2 === 0 ? '#ffffff' : '#fafbfd';
                return (
                  <tr key={record.id} style={{ backgroundColor: rowBg }}>
                    <td
                      className="px-2 py-2.5 text-center text-sm text-steel-500 border-b border-steel-100"
                      style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: rowBg }}
                    >
                      {pageOffset + idx + 1}
                    </td>
                    {visibleCols.map((col, i) => (
                      <td
                        key={col.id}
                        className={`px-3 py-2.5 text-sm border-b border-steel-100 align-middle overflow-hidden ${
                          i === lastPinIdx ? 'border-r' : ''
                        } ${alignCls(col.align)}`}
                        style={tdStyle(i, rowBg)}
                      >
                        {renderCell(col.id, record)}
                      </td>
                    ))}
                    <td
                      className="px-2 py-2.5 text-center border-b border-l border-steel-100"
                      style={{
                        position: 'sticky',
                        right: 0,
                        zIndex: 10,
                        backgroundColor: rowBg,
                        boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="inline-flex items-center justify-center gap-1 flex-nowrap">
                        <button
                          type="button"
                          onClick={() => onViewLog(record)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-steel-200 text-steel-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-file-list-3-line text-xs" />
                          操作日志
                        </button>
                        {visibleActions(record).map((action) => {
                          const cfg = planActionConfig[action];
                          return (
                            <button
                              type="button"
                              key={action}
                              onClick={() => onApply(record, action)}
                              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${cfg.color}`}
                            >
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
