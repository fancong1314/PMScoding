import type { ProfessionalPickRecord } from '@/mocks/professionalPickMocks';

interface SignDetailModalProps {
  open: boolean;
  record: ProfessionalPickRecord | null;
  onClose: () => void;
}

export default function SignDetailModal({ open, record, onClose }: SignDetailModalProps) {
  if (!open || !record) return null;

  const inputCls =
    'w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-steel-100/50 cursor-not-allowed';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-3xl mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100 flex-shrink-0">
          <h3 className="text-base font-semibold text-steel-900">签署详情</h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Basic Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-steel-100">
            <h4 className="text-xs font-semibold text-steel-600 mb-2">基础信息</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-steel-500 block mb-1">论证申请单号</label>
                <input value={record.argumentNo} readOnly className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-steel-500 block mb-1">论证申请名称</label>
                <input value={record.argumentName} readOnly className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-steel-500 block mb-1">会审意见签署截至时间</label>
                <input
                  value={
                    record.deadlineStart && record.deadlineEnd
                      ? `${record.deadlineStart} 至 ${record.deadlineEnd}`
                      : '-'
                  }
                  readOnly
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Sign Records */}
          <div>
            <h4 className="text-xs font-semibold text-steel-600 mb-3">会审记录</h4>
            {record.signRecords.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-steel-200">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                  <i className="ri-file-list-3-line text-2xl text-steel-300" />
                </div>
                <p className="text-sm text-steel-400">暂无可审记录</p>
              </div>
            ) : (
              <div className="border border-steel-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-steel-200">
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-16">
                        序号
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">
                        会审人员
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">
                        签署时间
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">
                        会审意见
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">
                        附件
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.signRecords.map((sr, idx) => (
                      <tr key={sr.id} className="border-b border-steel-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-steel-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap font-medium">
                          {sr.person}
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{sr.signTime}</td>
                        <td className="px-4 py-3 text-sm text-steel-700 max-w-sm">
                          <span className="line-clamp-3">{sr.opinion}</span>
                        </td>
                        <td className="px-4 py-3">
                          {sr.attachments.length === 0 ? (
                            <span className="text-sm text-steel-400">-</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {sr.attachments.map((att, ai) => (
                                <a
                                  key={ai}
                                  href="#"
                                  onClick={(e) => e.preventDefault()}
                                  className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 cursor-pointer whitespace-nowrap"
                                  rel="nofollow"
                                >
                                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                                    <i className="ri-file-pdf-line" />
                                  </div>
                                  {att.name}
                                  <span className="text-steel-400">
                                    ({(att.size / 1024 / 1024).toFixed(1)}MB)
                                  </span>
                                </a>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-4 border-t border-steel-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}