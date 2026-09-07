import type { PlanDeferralRecord, PlanApplicationType } from '@/mocks/planDeferralMocks';
import { planDeferralStatusMap, planApprovalStatusMap, planActionConfig } from '@/mocks/planDeferralMocks';

interface ColDef {
  id: string;
  label: string;
  width: number;
}

const COLUMNS: ColDef[] = [
  { id: 'planNo', label: '年度计划号', width: 110 },
  { id: 'planName', label: '年度计划名称', width: 220 },
  { id: 'projectMajorCategory', label: '项目大类', width: 90 },
  { id: 'projectType', label: '项目类型', width: 110 },
  { id: 'investAmount', label: '投资总估算（万元）', width: 140 },
  { id: 'planYear', label: '计划年度', width: 90 },
  { id: 'planStatus', label: '计划状态', width: 100 },
  { id: 'approvalStatus', label: '审批状态', width: 100 },
];

interface Props {
  records: PlanDeferralRecord[];
  pageOffset: number;
  onViewLog: (record: PlanDeferralRecord) => void;
  onApply: (record: PlanDeferralRecord, type: PlanApplicationType) => void;
}

export default function PlanDeferralTable({ records, pageOffset, onViewLog, onApply }: Props) {
  const renderCell = (colId: string, record: PlanDeferralRecord) => {
    switch (colId) {
      case 'planNo':
        return <span className="font-mono text-xs text-primary-700 font-medium">{record.planNo}</span>;
      case 'planName':
        return <span className="text-sm text-steel-800 font-medium leading-snug">{record.planName}</span>;
      case 'projectMajorCategory':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap bg-emerald-50 text-emerald-700">
            {record.projectMajorCategory}
          </span>
        );
      case 'projectType':
        return <span className="text-sm text-steel-600 whitespace-nowrap">{record.projectType}</span>;
      case 'investAmount':
        return (
          <span className="text-sm text-steel-800 font-medium tabular-nums">
            {record.investAmount.toFixed(2)}
          </span>
        );
      case 'planYear':
        return <span className="text-sm text-steel-700 whitespace-nowrap">{record.planYear}年</span>;
      case 'planStatus': {
        const s = planDeferralStatusMap[record.planStatus];
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.color}`}>
            {s.label}
          </span>
        );
      }
      case 'approvalStatus': {
        const s = planApprovalStatusMap[record.approvalStatus];
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-steel-600">
            <i className={`ri-checkbox-blank-circle-fill text-[8px] ${s.dotColor}`} />
            {s.label}
          </span>
        );
      }
      default:
        return <span className="text-sm text-steel-400">—</span>;
    }
  };

  /** 启动仅暂缓状态可操作；其余按 allowedActions，且过滤掉不该出现的启动 */
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
        <table className="w-full border-collapse text-left" style={{ minWidth: 1280 }}>
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2.5 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap" style={{ width: 50 }}>
                序号
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-2.5 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap"
                  style={{ width: col.width, minWidth: col.width }}
                >
                  {col.label}
                </th>
              ))}
              <th
                className="sticky right-0 z-10 bg-slate-50 px-3 py-2.5 text-center text-xs font-medium text-steel-500 border-b border-steel-200 whitespace-nowrap"
                style={{ width: 280, minWidth: 280 }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 2} className="text-center py-16 text-steel-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100">
                      <i className="ri-inbox-2-line text-xl text-steel-300" />
                    </div>
                    <span className="text-sm">暂无数据</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record, idx) => (
                <tr key={record.id} className="border-b border-steel-100 hover:bg-slate-50/60 transition-colors">
                  <td className="sticky left-0 z-10 bg-white px-3 py-3 text-center text-sm text-steel-500">
                    {pageOffset + idx + 1}
                  </td>
                  {COLUMNS.map((col) => (
                    <td
                      key={col.id}
                      className="px-3 py-3 align-middle"
                      style={{ width: col.width, maxWidth: col.width }}
                    >
                      <div className="overflow-hidden">{renderCell(col.id, record)}</div>
                    </td>
                  ))}
                  <td className="sticky right-0 z-10 bg-white px-3 py-3">
                    <div className="flex items-center gap-1.5 justify-center flex-wrap">
                      <button
                        type="button"
                        onClick={() => onViewLog(record)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-steel-200 text-steel-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-file-list-3-line text-xs" />操作日志
                      </button>
                      {visibleActions(record).map((action) => {
                        const cfg = planActionConfig[action];
                        return (
                          <button
                            type="button"
                            key={action}
                            onClick={() => onApply(record, action)}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${cfg.color}`}
                          >
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
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
