import { useState } from 'react';
import { getProcessItemsByContractId } from '@/mocks/signboardMocks';

interface Props {
  contractId: string;
  contractName: string;
  onClose: () => void;
  onSubmit: (result: 'pass' | 'reject', opinion: string) => void;
}

const COLUMNS = [
  { key: 'processNo', title: '工序编号', width: 100 },
  { key: 'processName', title: '工序名称', width: 150 },
  { key: 'description', title: '工序说明', width: 260 },
  { key: 'plannedTime', title: '计划开始-完成时间', width: 200 },
];

export default function ScheduleApprovalModal({ contractId, contractName, onClose, onSubmit }: Props) {
  const items = getProcessItemsByContractId(contractId);
  const totalCount = items.length;
  const pendingCount = items.filter(i => i.status === 'pending').length;
  const waitingCount = items.filter(i => i.status === 'waiting_approval').length;
  const approvedCount = items.filter(i => i.status === 'approved').length;
  const rejectedCount = items.filter(i => i.status === 'rejected').length;

  const [result, setResult] = useState<'pass' | 'reject' | ''>('');
  const [opinion, setOpinion] = useState('');

  const handleSubmit = () => {
    if (!result) return;
    if (result === 'reject' && !opinion.trim()) return;
    onSubmit(result, opinion);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl w-[960px] max-h-[92vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <h3 className="text-base font-semibold text-slate-800">预排审批</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer text-slate-400">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Summary */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-5">
            <div className="text-sm text-slate-600 mb-2">合同工序预排概要</div>
            <div className="text-sm font-medium text-slate-800 mb-2">{contractName}</div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-slate-500">工序细项总数：</span>
                <span className="font-semibold text-slate-800">{totalCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-slate-500">待完成：</span>
                <span className="font-semibold text-slate-800">{pendingCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-slate-500">待审批：</span>
                <span className="font-semibold text-slate-800">{waitingCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-500">已通过：</span>
                <span className="font-semibold text-slate-800">{approvedCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-slate-500">已驳回：</span>
                <span className="font-semibold text-slate-800">{rejectedCount}</span>
              </div>
            </div>
          </div>

          {/* Process Items Table */}
          <div className="mb-5">
            <div className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              施工方最新拆分工序明细项列表
              <span className="text-xs text-slate-400 font-normal ml-1">（共 {totalCount} 项）</span>
            </div>
            <div className="overflow-auto border border-slate-200 rounded-lg" style={{ maxHeight: 300 }}>
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-100" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ width: 50, position: 'sticky', left: 0, zIndex: 15, backgroundColor: '#f1f5f9' }}>序号</th>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap"
                        style={{ minWidth: col.width }}
                      >
                        {col.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-1.5 text-sm text-slate-500 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 5, backgroundColor: '#ffffff' }}>{idx + 1}</td>
                      <td className="px-3 py-1.5 text-sm text-slate-700 whitespace-nowrap">{item.processNo}</td>
                      <td className="px-3 py-1.5 text-sm text-slate-700 whitespace-nowrap">{item.processName}</td>
                      <td className="px-3 py-1.5 text-sm text-slate-600 whitespace-nowrap">{item.description}</td>
                      <td className="px-3 py-1.5 text-sm text-slate-700 whitespace-nowrap">
                        {item.plannedStartDate} ~ {item.plannedEndDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Approval Form */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-700 mb-2"><span className="text-red-500">*</span> 审批结果</label>
            <div className="flex gap-3">
              <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${result === 'pass' ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="approvalResult" value="pass" checked={result === 'pass'} onChange={() => setResult('pass')} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${result === 'pass' ? 'border-emerald-500' : 'border-slate-300'}`}>
                  {result === 'pass' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                <span className="text-sm font-medium text-slate-700">整体通过</span>
              </label>
              <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${result === 'reject' ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="approvalResult" value="reject" checked={result === 'reject'} onChange={() => setResult('reject')} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${result === 'reject' ? 'border-red-500' : 'border-slate-300'}`}>
                  {result === 'reject' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                </div>
                <span className="text-sm font-medium text-slate-700">整体驳回</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              审批意见
              {result === 'reject' && <span className="text-red-500 ml-1">*</span>}
              <span className="text-xs text-slate-400 font-normal ml-2">(审批驳回时必输，需说明驳回原因及修改方向)</span>
            </label>
            <textarea
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              placeholder={result === 'reject' ? '请输入驳回原因及修改方向...' : '审批意见（通过时选填）...'}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap">取消</button>
          <button
            onClick={handleSubmit}
            disabled={!result || (result === 'reject' && !opinion.trim())}
            className="px-4 py-2 text-sm text-white rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: result === 'reject' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            确认提交
          </button>
        </div>
      </div>
    </div>
  );
}