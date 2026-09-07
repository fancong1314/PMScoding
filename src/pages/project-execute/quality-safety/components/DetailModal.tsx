import { useState } from 'react';
import { type Issue } from '@/mocks/qualitySafetyMocks';

interface DetailModalProps {
  open: boolean;
  issue: Issue | null;
  onClose: () => void;
}

export default function DetailModal({ open, issue, onClose }: DetailModalProps) {
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'timeline'>('info');

  if (!open || !issue) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[680px] max-h-[85vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">问题详情 - {issue.issueNo}</h3>
            <p className="text-xs text-steel-400 mt-0.5">{issue.issueType} | {issue.issueLevel} | {issue.status}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Tab切换 */}
          <div className="bg-slate-50 rounded-lg border border-steel-100 p-1 inline-flex mb-4">
            <button
              onClick={() => setActiveDetailTab('info')}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors cursor-pointer whitespace-nowrap ${activeDetailTab === 'info' ? 'text-steel-800 font-medium bg-white border border-steel-200' : 'text-steel-500 hover:text-steel-700'}`}
            >
              基本信息
            </button>
            <button
              onClick={() => setActiveDetailTab('timeline')}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors cursor-pointer whitespace-nowrap ${activeDetailTab === 'timeline' ? 'text-steel-800 font-medium bg-white border border-steel-200' : 'text-steel-500 hover:text-steel-700'}`}
            >
              整改时间轴
            </button>
          </div>

          {activeDetailTab === 'info' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <label className="text-xs text-steel-400 block mb-1">问题编号</label>
                  <span className="text-sm text-steel-700 font-mono">{issue.issueNo}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <label className="text-xs text-steel-400 block mb-1">问题类型</label>
                  <span className="text-sm text-steel-700">{issue.issueType}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <label className="text-xs text-steel-400 block mb-1">发起人</label>
                  <span className="text-sm text-steel-700">{issue.initiator}（{issue.initiatorUnit}）</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <label className="text-xs text-steel-400 block mb-1">发起时间</label>
                  <span className="text-sm text-steel-700">{issue.createTime}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <label className="text-xs text-steel-400 block mb-1">问题等级</label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${issue.issueLevel === '重大' ? 'bg-red-50 text-red-700 border border-red-200' : issue.issueLevel === '较大' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>{issue.issueLevel}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <label className="text-xs text-steel-400 block mb-1">整改期限</label>
                  <span className="text-sm text-steel-700">{issue.deadline}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">问题描述</label>
                <p className="text-sm text-steel-700 leading-relaxed">{issue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <h4 className="text-sm font-medium text-steel-700 mb-2">施工方信息</h4>
                  <div className="space-y-1.5 text-sm">
                    <div><span className="text-steel-400">名称：</span><span className="text-steel-700">{issue.constructionUnit}</span></div>
                    <div><span className="text-steel-400">扣分值：</span><span className="text-steel-700">{issue.constructionDeductionScore || 0} 分</span></div>
                    <div><span className="text-steel-400">扣款金额：</span><span className="text-steel-700">{issue.constructionDeductionAmount || 0} 元</span></div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <h4 className="text-sm font-medium text-steel-700 mb-2">监理方信息</h4>
                  <div className="space-y-1.5 text-sm">
                    <div><span className="text-steel-400">名称：</span><span className="text-steel-700">{issue.supervisorUnit}</span></div>
                    <div><span className="text-steel-400">扣分值：</span><span className="text-steel-700">{issue.supervisorDeductionScore || 0} 分</span></div>
                    <div><span className="text-steel-400">扣款金额：</span><span className="text-steel-700">{issue.supervisorDeductionAmount || 0} 元</span></div>
                  </div>
                </div>
              </div>

              {issue.attachments.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <label className="text-xs text-steel-400 block mb-2">附件列表</label>
                  <div className="space-y-2">
                    {issue.attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded bg-steel-100">
                          <i className={`${att.type === 'image' ? 'ri-image-line' : att.type === 'pdf' ? 'ri-file-pdf-line' : 'ri-file-line'} text-steel-500`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-steel-700 truncate">{att.name}</p>
                          <p className="text-xs text-steel-400">{att.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeDetailTab === 'timeline' && (
            <div className="space-y-0">
              {issue.rectifyRecords.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-steel-100">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                    <i className="ri-time-line text-xl text-steel-300" />
                  </div>
                  <p className="text-sm text-steel-400">暂无整改记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issue.rectifyRecords.map((record, idx) => (
                    <div key={record.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${record.type === '发起' ? 'bg-red-500' : record.type === '整改' ? 'bg-blue-500' : 'bg-green-500'}`} />
                        {idx < issue.rectifyRecords.length - 1 && <div className="w-px flex-1 bg-steel-200 mt-1" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${record.type === '发起' ? 'bg-red-50 text-red-700' : record.type === '整改' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>{record.type}</span>
                            <span className="text-xs text-steel-500">{record.time}</span>
                            <span className="text-xs text-steel-600 font-medium">{record.operator}</span>
                          </div>
                          <p className="text-sm text-steel-700 leading-relaxed">{record.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}