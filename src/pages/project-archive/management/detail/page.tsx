import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getArchiveProjectById,
  getArchiveAttachments,
  getVersionHistory,
  getMissingDocs,
  buildArchiveTree,
  type ArchiveAttachment,
  type VersionRecord,
  type ArchiveTreeNode,
} from '@/mocks/archiveManagementMocks';

export default function ArchiveDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'ap-1';

  const project = getArchiveProjectById(projectId);
  const attachments = getArchiveAttachments(projectId);
  const missingDocs = getMissingDocs(projectId);
  const treeNodes = useMemo(() => buildArchiveTree(projectId), [projectId]);

  // 状态
  const [selectedTreeKey, setSelectedTreeKey] = useState<string | null>(`${projectId}-root`);
  const [expandedTreeKeys, setExpandedTreeKeys] = useState<Set<string>>(new Set([`${projectId}-root`]));
  const [filterFormat, setFilterFormat] = useState('');
  const [filterRequired, setFilterRequired] = useState('');
  const [filterArchive, setFilterArchive] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showVersionModal, setShowVersionModal] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  // 过滤附件
  const filteredAttachments = useMemo(() => {
    let result = attachments;

    if (selectedTreeKey) {
      const selNode = treeNodes.find((n) => n.key === selectedTreeKey);
      if (selNode) {
        if (selNode.type === 'contract') {
          const contractId = selectedTreeKey.replace(`${projectId}-`, '');
          result = result.filter((a) => a.contractId === contractId);
        } else if (selNode.type === 'node') {
          const parts = selectedTreeKey.replace(`${projectId}-`, '').split('-');
          const contractId = parts[0];
          // The sourceFunction is the rest after contractId
          const sourceFunc = selectedTreeKey.substring(`${projectId}-${contractId}-`.length);
          result = result.filter((a) => a.contractId === contractId && a.sourceFunction === sourceFunc);
        }
      }
    }

    if (filterFormat) result = result.filter((a) => a.format === filterFormat);
    if (filterRequired === '必传') result = result.filter((a) => a.required);
    if (filterRequired === '非必传') result = result.filter((a) => !a.required);
    if (filterArchive === '已归档') result = result.filter((a) => a.archiveStatus === '已归档');
    if (filterArchive === '未归档') result = result.filter((a) => a.archiveStatus === '未归档');
    if (keyword.trim()) result = result.filter((a) => a.attachmentName.toLowerCase().includes(keyword.toLowerCase()));

    return result;
  }, [attachments, selectedTreeKey, filterFormat, filterRequired, filterArchive, keyword]);

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">项目不存在</p>
        </div>
      </Layout>
    );
  }

  // 渲染版本历史弹窗
  const versionHistory = showVersionModal ? getVersionHistory(showVersionModal) : [];
  const currentAttachment = showVersionModal ? attachments.find((a) => a.id === showVersionModal) : null;

  // 树节点渲染
  const renderTreeChildren = (parentKey: string) => {
    return treeNodes
      .filter((n) => n.parentKey === parentKey)
      .map((node) => {
        const isExpanded = expandedTreeKeys.has(node.key);
        const hasChildren = treeNodes.some((n) => n.parentKey === node.key);
        const isSelected = selectedTreeKey === node.key;

        return (
          <div key={node.key}>
            <button
              onClick={() => { setSelectedTreeKey(node.key); if (hasChildren) toggleTree(node.key); }}
              className={`w-full flex items-center py-1.5 text-xs transition-colors cursor-pointer ${
                isSelected ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
              }`}
              style={{ paddingLeft: `${(node.type === 'contract' ? 16 : node.type === 'node' ? 32 : 8)}px`, paddingRight: '8px' }}
            >
              {hasChildren && (
                <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mr-0.5">
                  <i className={`ri-arrow-right-s-line text-slate-400 transition-transform text-xs ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              )}
              {!hasChildren && <span className="w-3.5 mr-0.5" />}
              <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mr-1.5">
                <i className={
                  node.type === 'project' ? 'ri-folder-3-line text-amber-500' :
                  node.type === 'contract' ? 'ri-file-text-line text-sky-500' :
                  'ri-node-tree text-slate-400'
                } />
              </div>
              <span className="truncate flex-1 text-left">{node.label}</span>
              <span className="text-xs text-slate-400 ml-1 flex-shrink-0">{node.count}</span>
            </button>
            {hasChildren && isExpanded && renderTreeChildren(node.key)}
          </div>
        );
      });
  };

  const toggleTree = (key: string) => {
    setExpandedTreeKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        {/* 项目信息栏 */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/project-archive/management')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
              <i className="ri-arrow-left-line text-slate-500" />
            </button>
            <div>
              <span className="text-sm text-slate-400">{project.approvalNo}</span>
              <span className="text-sm text-slate-700 font-medium ml-3">{project.projectName}</span>
              <span className={`ml-3 px-2 py-0.5 rounded text-xs ${
                project.projectType === '技改项目' ? 'bg-sky-50 text-sky-600' :
                project.projectType === '环保项目' ? 'bg-emerald-50 text-emerald-600' :
                project.projectType === '基建项目' ? 'bg-amber-50 text-amber-600' :
                project.projectType === '安全项目' ? 'bg-red-50 text-red-600' :
                'bg-violet-50 text-violet-600'
              }`}>{project.projectType}</span>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="px-5 py-4 grid grid-cols-4 gap-4 border-b border-slate-200 bg-white">
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-emerald-700">{project.attachmentTotal}</p>
            <p className="text-xs text-emerald-600">附件总数</p>
          </div>
          <div className="bg-sky-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-sky-700">{project.archivedCount}</p>
            <p className="text-xs text-sky-600">已归档数</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-amber-700">{project.pendingCount}</p>
            <p className="text-xs text-amber-600">待归档数</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-violet-700">{project.completeness}%</p>
            <p className="text-xs text-violet-600">必传完整率</p>
          </div>
        </div>

        {/* 档案缺失提醒 */}
        {missingDocs.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-200" style={{ background: '#fef2f2' }}>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-error-warning-line text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">以下必传附件尚未上传：</p>
                <div className="space-y-1">
                  {missingDocs.map((md, i) => (
                    <div key={i} className="text-xs text-red-600">
                      <span className="text-slate-400">{md.nodePath}</span>
                      <span className="mx-1">&gt;</span>
                      <span className="font-medium">{md.docName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 主体区域 - 左右分栏 */}
        <div className="flex" style={{ minHeight: '500px' }}>
          {/* 左侧档案目录树 */}
          <div className="w-56 flex-shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col">
            <div className="px-3 py-2 border-b border-slate-200">
              <div className="relative">
                <input type="text" placeholder="搜索节点..."
                  className="w-full pl-6 pr-2 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center">
                  <i className="ri-search-line text-slate-400 text-xs" />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {renderTreeChildren(null)}
            </div>
          </div>

          {/* 右侧附件列表 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 筛选条件 */}
            <div className="px-4 py-2 border-b border-slate-200 flex items-center gap-3 bg-white">
              <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">附件格式：全部</option>
                <option value="PDF">PDF</option>
                <option value="DOCX">Word</option>
                <option value="XLSX">Excel</option>
                <option value="JPG">图片</option>
                <option value="DWG">CAD</option>
                <option value="ZIP">压缩包</option>
                <option value="MP4">视频</option>
                <option value="其他">其他</option>
              </select>
              <select value={filterRequired} onChange={(e) => setFilterRequired(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">是否必传：全部</option>
                <option value="必传">必传</option>
                <option value="非必传">非必传</option>
              </select>
              <select value={filterArchive} onChange={(e) => setFilterArchive(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">归档状态：全部</option>
                <option value="已归档">已归档</option>
                <option value="未归档">未归档</option>
              </select>
              <div className="relative flex-1 max-w-xs">
                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索附件名称..." className="w-full pl-7 pr-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center">
                  <i className="ri-search-line text-slate-400 text-xs" />
                </div>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">共{filteredAttachments.length}个附件</span>
            </div>

            {/* 附件列表 */}
            <div className="flex-1 overflow-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-center font-semibold text-slate-600 whitespace-nowrap w-12">序号</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[200px]">附件名称</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">文档名称</th>
                      <th className="px-3 py-2 text-center font-semibold text-slate-600 whitespace-nowrap min-w-[70px]">格式</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[80px]">大小</th>
                      <th className="px-3 py-2 text-center font-semibold text-slate-600 whitespace-nowrap min-w-[60px]">版本</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[70px]">上传人</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">上传时间</th>
                      <th className="px-3 py-2 text-center font-semibold text-slate-600 whitespace-nowrap min-w-[70px]">归档状态</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[100px]">来源功能</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap min-w-[160px]">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttachments.map((a, i) => (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-slate-500 text-center whitespace-nowrap">{i + 1}</td>
                        <td className="px-3 py-2 text-slate-700 whitespace-nowrap max-w-[200px] truncate" title={a.attachmentName}>{a.attachmentName}</td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{a.docName}</td>
                        <td className="px-3 py-2 text-center whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            a.format === 'PDF' ? 'bg-red-50 text-red-600' :
                            a.format === 'XLSX' ? 'bg-emerald-50 text-emerald-600' :
                            a.format === 'ZIP' ? 'bg-amber-50 text-amber-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>{a.format}</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{a.size}</td>
                        <td className="px-3 py-2 text-slate-500 text-center whitespace-nowrap">{a.version}</td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{a.uploader}</td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{a.uploadTime}</td>
                        <td className="px-3 py-2 text-center whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            a.archiveStatus === '已归档' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>{a.archiveStatus}</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap max-w-[100px] truncate">{a.sourceFunction}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button onClick={() => navigate(`/project-archive/management/preview?attachmentId=${a.id}`)}
                              className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">预览</button>
                            <button onClick={() => showToast('附件下载中...')}
                              className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap">下载</button>
                            {a.version !== 'V1' && (
                              <button onClick={() => setShowVersionModal(a.id)}
                                className="px-2 py-1 text-xs text-violet-600 border border-violet-200 rounded hover:bg-violet-50 cursor-pointer whitespace-nowrap">版本历史</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAttachments.length === 0 && (
                      <tr><td colSpan={11} className="px-3 py-10 text-center text-slate-400 text-sm">暂无附件数据</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 版本历史弹窗 */}
      {showVersionModal && currentAttachment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVersionModal(null)}>
          <div className="bg-white rounded-lg shadow-lg w-[640px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">版本历史 - {currentAttachment.docName}</h3>
              <button onClick={() => setShowVersionModal(null)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
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
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${v.versionNo === currentAttachment.version ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {v.versionNo}
                            {v.versionNo === currentAttachment.version && <span className="ml-1 text-emerald-400">(当前)</span>}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{v.fileName}</td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{v.fileSize}</td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{v.uploader}</td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{v.uploadTime}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button onClick={() => navigate(`/project-archive/management/preview?attachmentId=${currentAttachment.id}`)}
                              className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">预览</button>
                            <button onClick={() => showToast('附件下载中...')}
                              className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap">下载</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowVersionModal(null)} className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>
      )}
    </Layout>
  );
}