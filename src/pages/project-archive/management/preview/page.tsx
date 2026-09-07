import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getArchiveAttachments, getVersionHistory, type ArchiveAttachment } from '@/mocks/archiveManagementMocks';

export default function ArchivePreviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const attachmentId = searchParams.get('attachmentId') || 'aa-1';

  // 查找附件
  const allAttachments = Object.values(
    Object.fromEntries(
      Object.entries({
        ap1: getArchiveAttachments('ap-1'),
        ap2: getArchiveAttachments('ap-2'),
      }).flatMap(([, atts]) => atts.map((a) => [a.id, a] as const))
    )
  );
  const attachment = allAttachments.find((a) => a.id === attachmentId);
  const versionHistory = attachmentId ? getVersionHistory(attachmentId) : [];
  const [showVersionModal, setShowVersionModal] = useState(false);

  if (!attachment) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">附件不存在</p>
        </div>
      </Layout>
    );
  }

  const isPreviewable = ['PDF', 'JPG', 'PNG', 'BMP', 'DOCX', 'XLSX'].includes(attachment.format);

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        {/* 顶部信息栏 */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
              <i className="ri-arrow-left-line text-slate-500" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">{attachment.attachmentName}</h2>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* 文件预览区 */}
          <div className="flex-1 p-6 flex items-center justify-center" style={{ minHeight: '500px', backgroundColor: '#f8fafc' }}>
            {isPreviewable ? (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <i className={`text-4xl ${
                    attachment.format === 'PDF' ? 'ri-file-pdf-line text-red-500' :
                    attachment.format === 'XLSX' ? 'ri-file-excel-2-line text-emerald-500' :
                    attachment.format === 'DOCX' ? 'ri-file-word-2-line text-sky-500' :
                    'ri-image-line text-amber-500'
                  }`} />
                </div>
                <p className="text-sm text-slate-600 font-medium">{attachment.attachmentName}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {attachment.format === 'PDF' ? 'PDF文档 - 支持在线逐页浏览' :
                    attachment.format === 'XLSX' ? 'Excel表格 - 支持在线渲染查看' :
                    attachment.format === 'DOCX' ? 'Word文档 - 支持在线渲染查看' :
                    '图片文件 - 支持在线轮播浏览'}
                </p>
                <div className="mt-6 p-6 border-2 border-dashed border-slate-300 rounded-lg bg-white">
                  <p className="text-slate-500 text-sm">文件内容预览区域</p>
                  <p className="text-slate-400 text-xs mt-1">（实际环境中在此展示文件内容）</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <i className={`text-4xl ${
                    attachment.format === 'ZIP' ? 'ri-file-zip-line text-amber-500' :
                    attachment.format === 'MP4' ? 'ri-video-line text-violet-500' :
                    attachment.format === 'DWG' ? 'ri-file-settings-line text-slate-500' :
                    'ri-file-unknow-line text-slate-400'
                  }`} />
                </div>
                <p className="text-sm text-slate-600 font-medium">{attachment.attachmentName}</p>
                <p className="text-xs text-slate-400 mt-1">{attachment.format} 格式暂不支持在线预览，请下载后查看</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button className="px-4 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line" /></div>
                    下载查看
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 附件元数据区 */}
          <div className="w-72 flex-shrink-0 border-l border-slate-200 p-5 bg-white">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">附件信息</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400">文档名称</p>
                <p className="text-sm text-slate-700">{attachment.docName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">附件格式</p>
                <p className="text-sm text-slate-700">{attachment.format}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">附件大小</p>
                <p className="text-sm text-slate-700">{attachment.size}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">版本号</p>
                <p className="text-sm text-slate-700">{attachment.version}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">上传人</p>
                <p className="text-sm text-slate-700">{attachment.uploader}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">上传时间</p>
                <p className="text-sm text-slate-700">{attachment.uploadTime}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">归档状态</p>
                <p className="text-sm">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${attachment.archiveStatus === '已归档' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{attachment.archiveStatus}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">来源功能</p>
                <p className="text-sm text-slate-700">{attachment.nodePath}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">所属合同</p>
                <p className="text-sm text-slate-700">{attachment.contractNo} {attachment.contractName}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button className="w-full px-4 py-2 text-sm text-white rounded-md cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line" /></div>
                下载附件
              </button>
              {versionHistory.length > 1 && (
                <button onClick={() => setShowVersionModal(true)}
                  className="w-full px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-md hover:bg-violet-50 cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-history-line" /></div>
                  查看版本历史
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 版本历史弹窗 */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVersionModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">版本历史 - {attachment.docName}</h3>
              <button onClick={() => setShowVersionModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-center font-semibold text-slate-600 whitespace-nowrap">版本号</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[180px]">文件名</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">文件大小</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">上传人</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">上传时间</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versionHistory.map((v) => (
                      <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-center whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${v.versionNo === attachment.version ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {v.versionNo}
                            {v.versionNo === attachment.version && <span className="ml-1 text-emerald-400">(当前)</span>}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{v.fileName}</td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{v.fileSize}</td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{v.uploader}</td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{v.uploadTime}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">预览</button>
                            <button className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap">下载</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowVersionModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}