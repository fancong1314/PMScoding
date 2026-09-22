import {
  formatCurrencyFixed,
  getProjectOccupyDetails,
  type EstimateProject,
} from '@/mocks/estimateManagementMocks';

interface Props {
  project: EstimateProject;
  onClose: () => void;
}

/** 项目概算管理 · 占用金额明细弹窗 */
export default function OccupyAmountDetailModal({ project, onClose }: Props) {
  const rows = getProjectOccupyDetails(project.id);
  const sumDesign = rows.reduce((s, r) => s + r.designFee, 0);
  const sumJianAn = rows.reduce((s, r) => s + r.jianAnFee, 0);
  const sumEquipment = rows.reduce((s, r) => s + r.equipmentFee, 0);
  const sumOther = rows.reduce((s, r) => s + r.otherFee, 0);
  const sumTotal = rows.reduce((s, r) => s + r.total, 0);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[920px] max-w-[96vw] max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="px-6 pt-5 pb-3">
          <h3 className="text-base font-bold text-slate-900">占用金额明细</h3>
        </div>

        <div className="px-6 pb-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <div className="flex items-baseline gap-1.5">
            <span className="text-slate-500 whitespace-nowrap">项目名称：</span>
            <span className="text-slate-800 font-medium">{project.name}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-slate-500 whitespace-nowrap">实际立项金额（元）：</span>
            <span className="text-slate-800 font-mono">{formatCurrencyFixed(project.actualBudgetAmount)}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-slate-500 whitespace-nowrap">项目占用金额（元）：</span>
            <span className="text-slate-800 font-mono">{formatCurrencyFixed(project.occupiedAmount)}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sky-500 whitespace-nowrap">项目可用金额（元）：</span>
            <span className="text-sky-500 font-mono font-medium">{formatCurrencyFixed(project.availableAmount)}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-2">
          <div className="border border-slate-200 overflow-hidden rounded-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#7dd3fc' }}>
                  <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap border-r border-sky-200/60">合同\需求名称</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap border-r border-sky-200/60">设计费</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap border-r border-sky-200/60">建安费</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap border-r border-sky-200/60">设备费</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap border-r border-sky-200/60">其他费用</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap">合计</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200">
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{row.name}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.designFee)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.jianAnFee)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.equipmentFee)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.otherFee)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.total)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr className="border-t border-slate-200">
                    <td colSpan={6} className="px-3 py-8 text-center text-slate-400">暂无占用明细</td>
                  </tr>
                )}
                <tr className="border-t border-slate-200 bg-slate-50/50">
                  <td className="px-3 py-2.5 font-medium text-sky-500">合计</td>
                  <td className="px-3 py-2.5 text-right font-mono font-medium text-sky-500">{formatCurrencyFixed(sumDesign)}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-medium text-sky-500">{formatCurrencyFixed(sumJianAn)}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-medium text-sky-500">{formatCurrencyFixed(sumEquipment)}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-medium text-sky-500">{formatCurrencyFixed(sumOther)}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-medium text-sky-500">{formatCurrencyFixed(sumTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 text-sm border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer bg-white"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
