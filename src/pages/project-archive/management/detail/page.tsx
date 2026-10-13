import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { FormField, formInputCls } from '@/components/feature/FormLayout';
import ArchiveDocUploadSection, { type LocalUploadMap } from '../components/ArchiveDocUploadSection';
import {
  addManualArchiveAttachment,
  buildArchiveTree,
  getArchiveAttachments,
  getArchiveProjectById,
  getMissingDocs,
  getVersionHistory,
  loadArchiveMgmtStore,
  replaceArchiveAttachment,
  type ArchiveAttachment,
} from '@/mocks/archiveManagementMocks';
import {
  getAttachmentConfigs,
  getMeetingMinutesAttachmentConfigs,
  loadArchiveConfigStore,
  type AttachmentConfig,
  type FunctionNode,
} from '@/mocks/archiveConfigMocks';

function bumpVersion(v: string) {
  const n = Number((v || 'V1').replace(/\D/g, '')) || 1;
  return `V${n + 1}`;
}

export default function ArchiveDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'ap-1';

  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => {
    loadArchiveMgmtStore();
    setTick((t) => t + 1);
  }, []);

  const project = getArchiveProjectById(projectId);
  const attachments = useMemo(() => getArchiveAttachments(projectId), [projectId, tick]);
  const missingDocs = getMissingDocs(projectId);
  const treeNodes = useMemo(() => buildArchiveTree(projectId), [projectId, tick]);

  const [selectedTreeKey, setSelectedTreeKey] = useState<string | null>(`${projectId}-root`);
  const [expandedTreeKeys, setExpandedTreeKeys] = useState<Set<string>>(
    new Set([`${projectId}-root`, `${projectId}-meeting`]),
  );
  const [filterFormat, setFilterFormat] = useState('');
  const [filterRequired, setFilterRequired] = useState('');
  const [filterArchive, setFilterArchive] = useState('');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [keyword, setKeyword] = useState('');
  const [listMode, setListMode] = useState<'all' | 'history'>('all');
  const [showVersionModal, setShowVersionModal] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'manual' | 'meeting'>('manual');
  const [selectedMountNodeId, setSelectedMountNodeId] = useState('');
  const [uploadMap, setUploadMap] = useState<LocalUploadMap>({});

  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const mountNodes: FunctionNode[] = useMemo(() => {
    const store = loadArchiveConfigStore();
    return store.nodes.filter((n) => n.nodeKind === 'mount' && n.enabled && n.bizCode && n.bizCode !== 'MEETING_MINUTES');
  }, [tick]);

  const selectedMountNode = mountNodes.find((n) => n.id === selectedMountNodeId);
  const uploadConfigs: AttachmentConfig[] = useMemo(() => {
    if (uploadMode === 'meeting') return getMeetingMinutesAttachmentConfigs();
    if (!selectedMountNodeId) return [];
    return getAttachmentConfigs(selectedMountNodeId).filter((c) => c.enabled);
  }, [uploadMode, selectedMountNodeId, tick]);

  const filteredAttachments = useMemo(() => {
    let result = attachments;

    if (listMode === 'history') {
      result = result.filter((a) => a.archiveStatus === '已归档');
    }

    if (selectedTreeKey) {
      const selNode = treeNodes.find((n) => n.key === selectedTreeKey);
      if (selNode) {
        if (selNode.type === 'meeting') {
          result = result.filter((a) => a.origin === 'meeting' || a.sourceFunction === '会议纪要');
        } else if (selNode.type === 'contract') {
          const contractId = selectedTreeKey.replace(`${projectId}-`, '');
          result = result.filter((a) => a.contractId === contractId);
        } else if (selNode.type === 'node') {
          const contractKeyPrefix = `${projectId}-`;
          const rest = selectedTreeKey.substring(contractKeyPrefix.length);
          const dashIdx = rest.indexOf('-');
          const contractId = dashIdx >= 0 ? rest.slice(0, dashIdx) : rest;
          const sourceFunc = dashIdx >= 0 ? rest.slice(dashIdx + 1) : '';
          result = result.filter((a) => a.contractId === contractId && a.sourceFunction === sourceFunc);
        }
      }
    }

    if (filterFormat) result = result.filter((a) => a.format === filterFormat);
    if (filterRequired === '必传') result = result.filter((a) => a.required);
    if (filterRequired === '非必传') result = result.filter((a) => !a.required);
    if (filterArchive === '已归档') result = result.filter((a) => a.archiveStatus === '已归档');
    if (filterArchive === '未归档') result = result.filter((a) => a.archiveStatus === '未归档');
    if (filterOrigin === 'business') result = result.filter((a) => !a.origin || a.origin === 'business');
    if (filterOrigin === 'manual') result = result.filter((a) => a.origin === 'manual');
    if (filterOrigin === 'meeting') result = result.filter((a) => a.origin === 'meeting');
    if (keyword.trim()) result = result.filter((a) => a.attachmentName.toLowerCase().includes(keyword.toLowerCase()) || a.docName.includes(keyword));

    if (result.length === 0 && listMode === 'history' && !keyword && !filterFormat && !filterRequired && !filterOrigin) {
      const fallback = attachments.filter((a) => a.archiveStatus === '已归档');
      if (fallback.length > 0) return fallback;
    }

    return result;
  }, [attachments, selectedTreeKey, filterFormat, filterRequired, filterArchive, filterOrigin, keyword, listMode, treeNodes, projectId]);

  const openManualUpload = (mode: 'manual' | 'meeting') => {
    setUploadMode(mode);
    setUploadMap({});
    setSelectedMountNodeId(mode === 'manual' ? (mountNodes[0]?.id || '') : '');
    setShowUploadModal(true);
  };

  const submitUpload = () => {
    if (uploadMode === 'manual' && !selectedMountNode) {
      showToast('请选择档案配置节点');
      return;
    }
    const pairs: { cfg: AttachmentConfig; file: { name: string; size: number } }[] = [];
    uploadConfigs.forEach((cfg) => {
      (uploadMap[cfg.id] || []).forEach((f) => pairs.push({ cfg, file: f }));
    });
    if (pairs.length === 0) {
      showToast('请至少上传一个附件');
      return;
    }
    const missingRequired = uploadConfigs.filter((c) => c.required && !(uploadMap[c.id] || []).length);
    if (missingRequired.length > 0) {
      showToast(`请上传必填附件：${missingRequired.map((c) => c.docName).join('、')}`);
      return;
    }

    pairs.forEach(({ cfg, file }) => {
      addManualArchiveAttachment({
        projectId,
        mode: uploadMode,
        nodeId: selectedMountNode?.id,
        nodePath: uploadMode === 'meeting' ? '项目档案固定节点 > 会议纪要' : (selectedMountNode?.path || ''),
        bizCode: uploadMode === 'meeting' ? 'MEETING_MINUTES' : (selectedMountNode?.bizCode || undefined),
        sourceFunction: uploadMode === 'meeting' ? '会议纪要' : (selectedMountNode?.name || '手动归档'),
        docName: cfg.docName,
        configDocId: cfg.id,
        required: cfg.required,
        file,
      });
    });
    showToast(`已成功上传 ${pairs.length} 个附件`);
    setShowUploadModal(false);
    if (uploadMode === 'meeting') {
      setSelectedTreeKey(`${projectId}-meeting`);
      setExpandedTreeKeys((prev) => new Set([...prev, `${projectId}-root`, `${projectId}-meeting`]));
    }
    refresh();
  };

  const triggerReplace = (id: string) => {
    setReplaceTargetId(id);
    replaceInputRef.current?.click();
  };

  const onReplaceFile = (fileList: FileList | null) => {
    if (!replaceTargetId || !fileList?.[0]) return;
    const file = fileList[0];
    const result = replaceArchiveAttachment(replaceTargetId, { name: file.name, size: file.size });
    showToast(result.message);
    setReplaceTargetId(null);
    if (replaceInputRef.current) replaceInputRef.current.value = '';
    refresh();
  };

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">项目不存在</p>
        </div>
      </Layout>
    );
  }

  const versionHistory = showVersionModal ? getVersionHistory(showVersionModal) : [];
  const currentAttachment = showVersionModal ? attachments.find((a) => a.id === showVersionModal) : null;

  const renderTreeChildren = (parentKey: string | null) => {
    return treeNodes
      .filter((n) => n.parentKey === parentKey)
      .map((node) => {
        const isExpanded = expandedTreeKeys.has(node.key);
        const hasChildren = treeNodes.some((n) => n.parentKey === node.key);
        const isSelected = selectedTreeKey === node.key;
        const pad = node.type === 'project' ? 8 : node.type === 'meeting' || node.type === 'contract' ? 16 : 32;

        return (
          <div key={node.key}>
            <button
              type="button"
              onClick={() => {
                setSelectedTreeKey(node.key);
                if (node.type === 'meeting') setListMode('all');
                if (hasChildren) toggleTree(node.key);
              }}
              className={`w-full flex items-center py-1.5 text-xs transition-colors cursor-pointer ${
                isSelected ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
              }`}
              style={{ paddingLeft: `${pad}px`, paddingRight: '8px' }}
            >
              {hasChildren ? (
                <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mr-0.5">
                  <i className={`ri-arrow-right-s-line text-slate-400 transition-transform text-xs ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              ) : (
                <span className="w-3.5 mr-0.5" />
              )}
              <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mr-1.5">
                <i
                  className={
                    node.type === 'project'
                      ? 'ri-folder-3-line text-amber-500'
                      : node.type === 'meeting'
                        ? 'ri-mic-line text-violet-500'
                        : node.type === 'contract'
                          ? 'ri-file-text-line text-sky-500'
                          : 'ri-node-tree text-slate-400'
                  }
                />
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

  const originBadge = (a: ArchiveAttachment) => {
    if (a.origin === 'meeting') return <span className="px-1 py-0.5 rounded text-[10px] bg-violet-50 text-violet-600">会议</span>;
    if (a.origin === 'manual') return <span className="px-1 py-0.5 rounded text-[10px] bg-amber-50 text-amber-600">手动</span>;
    return <span className="px-1 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500">业务</span>;
  };

  return (
    <Layout>
      <input ref={replaceInputRef} type="file" className="hidden" onChange={(e) => onReplaceFile(e.target.files)} />

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <button type="button" onClick={() => navigate('/project-archive/management')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
              <i className="ri-arrow-left-line text-slate-500" />
            </button>
            <div className="min-w-0">
              <span className="text-sm text-slate-400">{project.approvalNo}</span>
              <span className="text-sm text-slate-700 font-medium ml-3">{project.projectName}</span>
              <span
                className={`ml-3 px-2 py-0.5 rounded text-xs ${
                  project.projectType === '技改项目'
                    ? 'bg-sky-50 text-sky-600'
                    : project.projectType === '环保项目'
                      ? 'bg-emerald-50 text-emerald-600'
                      : project.projectType === '基建项目'
                        ? 'bg-amber-50 text-amber-600'
                        : project.projectType === '安全项目'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-violet-50 text-violet-600'
                }`}
              >
                {project.projectType}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => openManualUpload('meeting')}
              className="px-3 py-1.5 text-xs text-violet-700 border border-violet-200 rounded-md hover:bg-violet-50 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-mic-line mr-1" />
              上传会议纪要
            </button>
            <button
              type="button"
              onClick={() => openManualUpload('manual')}
              className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <i className="ri-upload-2-line mr-1" />
              手动新增附件
            </button>
          </div>
        </div>

        <div className="px-5 py-4 grid grid-cols-4 gap-4 border-b border-slate-200 bg-white">
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-emerald-700">{attachments.length}</p>
            <p className="text-xs text-emerald-600">当前档案数</p>
          </div>
          <div className="bg-sky-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-sky-700">{attachments.filter((a) => a.archiveStatus === '已归档').length}</p>
            <p className="text-xs text-sky-600">已归档数</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-amber-700">{attachments.filter((a) => a.archiveStatus === '未归档').length}</p>
            <p className="text-xs text-amber-600">待归档数</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-violet-700">{attachments.filter((a) => a.origin === 'meeting').length}</p>
            <p className="text-xs text-violet-600">会议纪要</p>
          </div>
        </div>

        {missingDocs.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-200" style={{ background: '#fef2f2' }}>
            <div className="flex items-start gap-2">
              <i className="ri-error-warning-line text-red-500 mt-0.5" />
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

        <div className="flex" style={{ minHeight: '500px' }}>
          <div className="w-56 flex-shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col">
            <div className="px-3 py-2 border-b border-slate-200 text-xs text-slate-500">档案目录（含固定节点：会议纪要）</div>
            <div className="flex-1 overflow-y-auto py-1">{renderTreeChildren(null)}</div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-2 border-b border-slate-200 flex items-center gap-0 bg-white">
              <button
                type="button"
                onClick={() => setListMode('all')}
                className={`px-3 py-2 text-sm cursor-pointer border-b-2 ${
                  listMode === 'all' ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-slate-500'
                }`}
              >
                全部附件
              </button>
              <button
                type="button"
                onClick={() => {
                  setListMode('history');
                  setFilterArchive('已归档');
                }}
                className={`px-3 py-2 text-sm cursor-pointer border-b-2 ${
                  listMode === 'history' ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-slate-500'
                }`}
              >
                已归档历史
              </button>
            </div>

            <div className="px-4 py-2 border-b border-slate-200 flex items-center gap-3 bg-white flex-wrap">
              <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)} className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white">
                <option value="">附件格式：全部</option>
                {['PDF', 'DOCX', 'XLSX', 'JPG', 'ZIP', 'MP3', 'M4A', 'WAV', 'PPTX', 'MP4'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <select value={filterRequired} onChange={(e) => setFilterRequired(e.target.value)} className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white">
                <option value="">是否必传：全部</option>
                <option value="必传">必传</option>
                <option value="非必传">非必传</option>
              </select>
              <select value={filterArchive} onChange={(e) => setFilterArchive(e.target.value)} className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white">
                <option value="">归档状态：全部</option>
                <option value="已归档">已归档</option>
                <option value="未归档">未归档</option>
              </select>
              <select value={filterOrigin} onChange={(e) => setFilterOrigin(e.target.value)} className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white">
                <option value="">来源：全部</option>
                <option value="business">业务汇总</option>
                <option value="manual">手动新增</option>
                <option value="meeting">会议纪要</option>
              </select>
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索附件/文档名称..."
                  className="w-full pl-7 pr-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <i className="ri-search-line absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">共{filteredAttachments.length}个附件</span>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 sticky top-0">
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2 text-center font-semibold text-slate-600 w-12">序号</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 min-w-[180px]">附件名称</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 min-w-[110px]">文档名称</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-600">格式</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">大小</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-600">版本</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">上传人</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 min-w-[120px]">上传时间</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-600">归档</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 min-w-[120px]">来源</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 min-w-[200px]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttachments.map((a, i) => (
                    <tr key={a.id} className="hover:bg-slate-50" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2 text-center text-slate-500">{i + 1}</td>
                      <td className="px-3 py-2 text-slate-700 max-w-[180px] truncate" title={a.attachmentName}>{a.attachmentName}</td>
                      <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{a.docName}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{a.format}</span>
                      </td>
                      <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{a.size}</td>
                      <td className="px-3 py-2 text-center text-slate-500">{a.version}</td>
                      <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{a.uploader}</td>
                      <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{a.uploadTime}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded ${a.archiveStatus === '已归档' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {a.archiveStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 flex-wrap">
                          {originBadge(a)}
                          <span className="text-slate-500 truncate max-w-[80px]" title={a.sourceFunction}>{a.sourceFunction}</span>
                        </div>
                        {a.bizCode && <div className="text-[10px] text-violet-500 font-mono truncate">{a.bizCode}</div>}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => navigate(`/project-archive/management/preview?attachmentId=${a.id}`)}
                            className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer"
                          >
                            预览
                          </button>
                          <button type="button" onClick={() => showToast(`开始下载：${a.attachmentName}`)} className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer">
                            下载
                          </button>
                          <button type="button" onClick={() => triggerReplace(a.id)} className="px-2 py-1 text-xs text-amber-700 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer">
                            替换
                          </button>
                          <button type="button" onClick={() => setShowVersionModal(a.id)} className="px-2 py-1 text-xs text-violet-600 border border-violet-200 rounded hover:bg-violet-50 cursor-pointer">
                            版本
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAttachments.length === 0 && (
                    <tr>
                      <td colSpan={11} className="px-3 py-10 text-center text-slate-400 text-sm">
                        暂无附件数据
                        {selectedTreeKey?.endsWith('-meeting') && (
                          <button type="button" onClick={() => openManualUpload('meeting')} className="ml-2 text-violet-600 hover:underline cursor-pointer">
                            去上传会议纪要
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 手动 / 会议纪要上传弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[760px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">
                {uploadMode === 'meeting' ? '上传会议纪要' : '手动新增档案附件'}
              </h3>
              <button type="button" onClick={() => setShowUploadModal(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {uploadMode === 'manual' && (
                <FormField label="档案配置节点" required>
                  <select
                    value={selectedMountNodeId}
                    onChange={(e) => {
                      setSelectedMountNodeId(e.target.value);
                      setUploadMap({});
                    }}
                    className={formInputCls()}
                  >
                    <option value="">请选择节点</option>
                    {mountNodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.path}（{n.bizCode}）
                      </option>
                    ))}
                  </select>
                </FormField>
              )}
              {uploadMode === 'meeting' && (
                <p className="text-xs text-violet-700 bg-violet-50 border border-violet-100 rounded px-3 py-2">
                  当前为项目固定节点「会议纪要」，附件要求来自项目档案配置 · MEETING_MINUTES
                </p>
              )}

              <ArchiveDocUploadSection
                subtitle={
                  uploadMode === 'meeting'
                    ? '依据项目档案配置 · 会议纪要'
                    : `依据项目档案配置 · ${selectedMountNode?.name || '请选择节点'}`
                }
                configs={uploadConfigs}
                uploads={uploadMap}
                onChange={setUploadMap}
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-md cursor-pointer">
                取消
              </button>
              <button
                type="button"
                onClick={submitUpload}
                className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                确认上传归档
              </button>
            </div>
          </div>
        </div>
      )}

      {showVersionModal && currentAttachment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVersionModal(null)}>
          <div className="bg-white rounded-lg shadow-lg w-[640px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">版本历史 - {currentAttachment.docName}</h3>
              <button type="button" onClick={() => setShowVersionModal(null)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="p-6">
              {versionHistory.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">暂无历史版本（当前 {currentAttachment.version}）</p>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-center font-semibold text-slate-600">版本号</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">文件名</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">大小</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">上传人</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">上传时间</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versionHistory.map((v) => (
                      <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded ${v.versionNo === currentAttachment.version ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {v.versionNo}
                            {v.versionNo === currentAttachment.version && ' (当前)'}
                          </span>
                        </td>
                        <td className="px-3 py-2">{v.fileName}</td>
                        <td className="px-3 py-2">{v.fileSize}</td>
                        <td className="px-3 py-2">{v.uploader}</td>
                        <td className="px-3 py-2">{v.uploadTime}</td>
                        <td className="px-3 py-2">
                          <button type="button" onClick={() => showToast(`下载 ${v.fileName}`)} className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded cursor-pointer">
                            下载
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => triggerReplace(currentAttachment.id)} className="px-4 py-2 text-sm text-amber-700 border border-amber-200 rounded-md cursor-pointer">
                替换为新版本（{bumpVersion(currentAttachment.version)}）
              </button>
              <button type="button" onClick={() => setShowVersionModal(null)} className="px-4 py-2 text-sm border border-slate-300 rounded-md cursor-pointer">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>
      )}
    </Layout>
  );
}
