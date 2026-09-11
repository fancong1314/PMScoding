import type { PlanReviewRecord } from '@/mocks/planReviewMocks';
import { getOpinionSignSummary } from '@/mocks/planReviewMocks';

interface Props {
  open: boolean;
  record: PlanReviewRecord | null;
  onClose: () => void;
}

function formatDateTime(value?: string) {
  if (!value) return '—';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value.replace('T', ' ');
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${mo}-${day} ${h}:${mi}`;
}

export default function OpinionSignRecordsModal({ open, record, onClose }: Props) {
  if (!open || !record) return null;

  const meeting = record.jointMeeting;
  const participants = meeting?.participants || [];
  const summary = getOpinionSignSummary(meeting);

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">签署记录</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">年度计划名称</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {record.planName}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">项目提报单位</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {record.businessUnit}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">会审时间</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {formatDateTime(meeting?.reviewTime)}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">会审意见截至时间</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {formatDateTime(meeting?.opinionDeadline)}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-steel-600 mb-1.5">会审地点</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {meeting?.location || '—'}
              </div>
            </div>
          </div>

          <div className="text-xs text-steel-500">
            签署进度：
            <span className="text-sky-500 font-medium ml-1">{summary.signed}/{summary.total}</span>
            <span className="text-emerald-600 ml-3">通过:{summary.passCount}人</span>
            <span className="text-red-600 ml-3">不通过:{summary.failCount}人</span>
          </div>

          <div className="rounded-lg border border-steel-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="bg-sky-50 border-b border-steel-200">
                    <th className="px-3 py-2.5 text-xs font-medium text-steel-600 text-left whitespace-nowrap">会审人员</th>
                    <th className="px-3 py-2.5 text-xs font-medium text-steel-600 text-left whitespace-nowrap">签署时间</th>
                    <th className="px-3 py-2.5 text-xs font-medium text-steel-600 text-left">会审意见</th>
                    <th className="px-3 py-2.5 text-xs font-medium text-steel-600 text-left whitespace-nowrap">会审结果</th>
                    <th className="px-3 py-2.5 text-xs font-medium text-steel-600 text-left whitespace-nowrap">文档名称1</th>
                    <th className="px-3 py-2.5 text-xs font-medium text-steel-600 text-left whitespace-nowrap">文档名称2</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-10 text-center text-sm text-steel-400">
                        暂无会审人员
                      </td>
                    </tr>
                  ) : (
                    participants.map((p) => {
                      const docs = p.attachments || [];
                      const doc1 = docs[0];
                      const restDocs = docs.slice(1);
                      return (
                        <tr key={p.id} className="border-b border-steel-100 align-top">
                          <td className="px-3 py-2.5 text-sm text-steel-800 whitespace-nowrap">
                            {p.personName}
                            {p.unit ? ` (${p.unit})` : ''}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">
                            {p.signed ? formatDateTime(p.signTime) : '—'}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-steel-600 max-w-[220px]">
                            {p.signed ? (p.opinion || '—') : '—'}
                          </td>
                          <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                            {!p.signed ? (
                              <span className="text-steel-300">—</span>
                            ) : p.passResult === '通过' ? (
                              <span className="text-sky-600 font-medium">通过</span>
                            ) : p.passResult === '不通过' ? (
                              <span className="text-red-600 font-medium">不通过</span>
                            ) : (
                              <span className="text-steel-300">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-sm">
                            {doc1 ? (
                              <button
                                type="button"
                                className="text-sky-600 hover:underline cursor-pointer"
                                onClick={() => alert(`预览附件：${doc1.name}`)}
                              >
                                {doc1.name}
                              </button>
                            ) : (
                              <span className="text-steel-300">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-sm">
                            {restDocs.length > 0 ? (
                              <button
                                type="button"
                                className="text-sky-600 hover:underline cursor-pointer"
                                onClick={() => alert(`预览附件：${restDocs.map((d) => d.name).join('、')}`)}
                              >
                                {restDocs.map((d) => d.name).join('、')}
                              </button>
                            ) : (
                              <span className="text-steel-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-5 py-3 border-t border-steel-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
