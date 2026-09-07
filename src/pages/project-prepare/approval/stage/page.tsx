import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { projects } from '@/mocks/projectPrepareMocks';
import {
  getProjectStages,
  getStageAttachments,
  getStageOperationLogs,
  getStageStatusColor,
  getStageStatusIcon,
  getFileTypeIcon,
  getFileTypeColor,
  getOperationTypeColor,
  getOperationTypeIcon,
  addAttachment,
  addOperationLog,
  deleteAttachments,
  updateAttachmentDescription,
  updateStageStatus,
  type ApprovalStage,
  type StageAttachment,
  type OperationLog,
} from '@/mocks/projectApprovalMocks';

// Modal types
interface ModalState {
  type: 'upload' | 'edit' | 'logs' | 'delete' | null;
  stageId?: string;
  attachment?: StageAttachment;
  selectedIds?: string[];
}

export default function ProjectApprovalStagePage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const projectId = urlParams.get('projectId') || '';

  const project = useMemo(() => projects.find((p) => p.id === projectId), [projectId]);
  const stages = useMemo(() => getProjectStages(projectId), [projectId]);

  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [selectedAttachmentIds, setSelectedAttachmentIds] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalState>({ type: null });

  // Upload modal state
  const [uploadFiles, setUploadFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const [uploadDescription, setUploadDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Edit modal state
  const [editDescription, setEditDescription] = useState('');

  // Refresh attachments
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const attachments = useMemo(() => {
    if (!expandedStageId) return [];
    return getStageAttachments(expandedStageId);
  }, [expandedStageId]);

  const handleToggleStage = useCallback((stageId: string) => {
    setExpandedStageId((prev) => {
      const next = prev === stageId ? null : stageId;
      setSelectedAttachmentIds(new Set());
      return next;
    });
  }, []);

  const handleToggleAttachment = useCallback((id: string) => {
    setSelectedAttachmentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedAttachmentIds.size === attachments.length) {
      setSelectedAttachmentIds(new Set());
    } else {
      setSelectedAttachmentIds(new Set(attachments.map((a) => a.id)));
    }
  }, [attachments, selectedAttachmentIds.size]);

  const handleUpload = useCallback(() => {
    if (!modal.stageId || uploadFiles.length === 0) return;

    uploadFiles.forEach((file) => {
      addAttachment(modal.stageId!, {
        stageId: modal.stageId!,
        name: file.name,
        fileType: file.type,
        fileSize: file.size,
        description: uploadDescription,
        uploader: '管理员',
        uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        downloadUrl: '#',
      });
      addOperationLog(modal.stageId!, {
        stageId: modal.stageId!,
        operator: '管理员',
        operationTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        operationType: '上传',
        operationContent: `上传附件《${file.name}》`,
        result: '成功',
      });
    });

    // Update stage status if was "未开始"
    const stage = stages.find((s) => s.id === modal.stageId);
    if (stage && stage.status === '未开始') {
      updateStageStatus(modal.stageId, '进行中');
    }

    setModal({ type: null });
    setUploadFiles([]);
    setUploadDescription('');
    refresh();
  }, [modal.stageId, uploadFiles, uploadDescription, stages, refresh]);

  const handleEditSave = useCallback(() => {
    if (!modal.attachment) return;
    updateAttachmentDescription(modal.attachment.id, editDescription);
    addOperationLog(modal.attachment.stageId, {
      stageId: modal.attachment.stageId,
      operator: '管理员',
      operationTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      operationType: '修改',
      operationContent: `修改附件《${modal.attachment.name}》说明`,
      result: '成功',
    });
    setModal({ type: null });
    setEditDescription('');
    refresh();
  }, [modal.attachment, editDescription, refresh]);

  const handleDelete = useCallback(() => {
    if (!modal.selectedIds || modal.selectedIds.length === 0) return;
    deleteAttachments(modal.selectedIds);
    modal.selectedIds.forEach((id) => {
      const att = attachments.find((a) => a.id === id);
      if (att) {
        addOperationLog(att.stageId, {
          stageId: att.stageId,
          operator: '管理员',
          operationTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
          operationType: '删除',
          operationContent: `删除附件《${att.name}》`,
          result: '成功',
        });
      }
    });
    setModal({ type: null });
    setSelectedAttachmentIds(new Set());
    refresh();
  }, [modal.selectedIds, attachments, refresh]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map((f) => {
      const size = f.size > 1024 * 1024
        ? `${(f.size / (1024 * 1024)).toFixed(1)}MB`
        : `${(f.size / 1024).toFixed(0)}KB`;
      const ext = f.name.split('.').pop() || '';
      let type = '未知';
      const lowerExt = ext.toLowerCase();
      if (['pdf'].includes(lowerExt)) type = 'PDF';
      else if (['doc', 'docx'].includes(lowerExt)) type = 'Word';
      else if (['xls', 'xlsx'].includes(lowerExt)) type = 'Excel';
      else if (['ppt', 'pptx'].includes(lowerExt)) type = 'PPT';
      else if (['jpg', 'jpeg', 'png'].includes(lowerExt)) type = '图片';
      else if (['rar', 'zip'].includes(lowerExt)) type = '压缩包';
      return { name: f.name, size, type };
    });
    setUploadFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((f) => {
      const size = f.size > 1024 * 1024
        ? `${(f.size / (1024 * 1024)).toFixed(1)}MB`
        : `${(f.size / 1024).toFixed(0)}KB`;
      const ext = f.name.split('.').pop() || '';
      let type = '未知';
      const lowerExt = ext.toLowerCase();
      if (['pdf'].includes(lowerExt)) type = 'PDF';
      else if (['doc', 'docx'].includes(lowerExt)) type = 'Word';
      else if (['xls', 'xlsx'].includes(lowerExt)) type = 'Excel';
      else if (['ppt', 'pptx'].includes(lowerExt)) type = 'PPT';
      else if (['jpg', 'jpeg', 'png'].includes(lowerExt)) type = '图片';
      else if (['rar', 'zip'].includes(lowerExt)) type = '压缩包';
      return { name: f.name, size, type };
    });
    setUploadFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeUploadFile = useCallback((index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100">
              <i className="ri-file-list-3-line text-2xl text-steel-300" />
            </div>
            <p className="text-sm text-steel-400">未找到项目信息</p>
            <button
              onClick={() => navigate('/project-prepare/approval')}
              className="mt-2 px-4 py-2 text-sm text-white rounded-md cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
            >
              返回列表
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        {/* Project Info Header */}
        <div className="bg-white rounded-lg border border-steel-200 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-steel-900">报批报建阶段</h1>
            <button
              onClick={() => navigate('/project-prepare/approval')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-left-line" />
              </div>
              返回
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">项目名称</span>
              <span className="text-sm text-steel-800 font-medium truncate">{project.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">立项号</span>
              <span className="text-sm text-steel-700 font-mono">{project.approvalNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">建设单位</span>
              <span className="text-sm text-steel-700">{project.constructionUnit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">项目类型</span>
              <span className="text-sm text-steel-700">{project.projectType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">项目经理</span>
              <span className="text-sm text-steel-700">{project.manager}</span>
            </div>
          </div>
        </div>

        {/* Horizontal Flow Step Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-5 py-5">
          <div className="flex items-center justify-between">
            {stages.map((stage, idx) => {
              const isActive = expandedStageId === stage.id;
              const isCompleted = stage.status === '已完成';
              const isInProgress = stage.status === '进行中';
              const attachmentCount = getStageAttachments(stage.id).length;

              return (
                <div key={stage.id} className="flex items-center flex-1">
                  <button
                    onClick={() => handleToggleStage(stage.id)}
                    className={`relative flex flex-col items-center gap-2 px-3 py-3 rounded-lg transition-all cursor-pointer min-w-0 flex-1 ${
                      isActive
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    {/* Stage Node */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isInProgress
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className={isCompleted ? 'ri-check-line' : isInProgress ? 'ri-loader-4-line' : 'ri-time-line'} />
                      </div>
                    </div>

                    {/* Stage Name */}
                    <span className={`text-xs font-medium text-center whitespace-nowrap ${isActive ? 'text-primary-700' : 'text-steel-700'}`}>
                      {stage.name}
                    </span>

                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStageStatusColor(stage.status)}`}>
                      <div className="w-3 h-3 flex items-center justify-center">
                        <i className={getStageStatusIcon(stage.status)} />
                      </div>
                      {stage.status}
                    </span>

                    {/* Attachment Count Badge */}
                    {attachmentCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                        {attachmentCount}
                      </span>
                    )}
                  </button>

                  {/* Arrow Connector */}
                  {idx < stages.length - 1 && (
                    <div className="flex items-center px-1 flex-shrink-0">
                      <div className="w-8 h-px bg-steel-300" />
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-steel-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage Attachment Management */}
        {expandedStageId && (
          <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
            {/* Stage Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-steel-800">
                  {stages.find((s) => s.id === expandedStageId)?.name}
                </span>
                <span className="text-xs text-steel-400">
                  共 {attachments.length} 个附件
                </span>
                {selectedAttachmentIds.size > 0 && (
                  <span className="text-xs text-primary-600 font-medium">
                    已选 {selectedAttachmentIds.size} 个
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setModal({ type: 'upload', stageId: expandedStageId });
                    setUploadFiles([]);
                    setUploadDescription('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                >
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className="ri-upload-cloud-line" />
                  </div>
                  上传附件
                </button>
                {selectedAttachmentIds.size > 0 && (
                  <>
                    <button
                      onClick={() => {
                        setModal({ type: 'delete', selectedIds: Array.from(selectedAttachmentIds) });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap bg-red-500"
                    >
                      <div className="w-3.5 h-3.5 flex items-center justify-center">
                        <i className="ri-delete-bin-line" />
                      </div>
                      删除
                    </button>
                    <button
                      onClick={() => {
                        // Simulate batch download
                        alert('已开始批量下载选中附件');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <div className="w-3.5 h-3.5 flex items-center justify-center">
                        <i className="ri-download-line" />
                      </div>
                      下载
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setModal({ type: 'logs', stageId: expandedStageId });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className="ri-file-list-3-line" />
                  </div>
                  操作日志
                </button>
              </div>
            </div>

            {/* Attachment Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: '1000px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={attachments.length > 0 && attachments.every((a) => selectedAttachmentIds.has(a.id))}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-steel-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">序号</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '280px' }}>附件名称</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">文件类型</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">文件大小</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '240px' }}>附件说明</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">上传人</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">上传时间</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center z-10" style={{ minWidth: '160px', borderLeft: '1px solid #e8edf3' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {attachments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100">
                            <i className="ri-folder-line text-xl text-steel-300" />
                          </div>
                          <p className="text-sm text-steel-400">该阶段暂无附件</p>
                          <button
                            onClick={() => {
                              setModal({ type: 'upload', stageId: expandedStageId });
                              setUploadFiles([]);
                              setUploadDescription('');
                            }}
                            className="mt-1 px-3 py-1.5 text-xs text-white rounded-md hover:opacity-90 cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                          >
                            上传附件
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    attachments.map((att, idx) => (
                      <tr key={att.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedAttachmentIds.has(att.id)}
                            onChange={() => handleToggleAttachment(att.id)}
                            className="w-4 h-4 rounded border-steel-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-steel-800 font-medium whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 flex items-center justify-center ${getFileTypeColor(att.fileType)}`}>
                              <i className={getFileTypeIcon(att.fileType)} />
                            </div>
                            <span className="truncate">{att.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{att.fileType}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{att.fileSize}</td>
                        <td className="px-4 py-3 text-sm text-steel-600">
                          <span className="truncate block max-w-xs">{att.description || '-'}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{att.uploader}</td>
                        <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{att.uploadTime}</td>
                        <td className="px-4 py-3 sticky right-0 bg-white z-10" style={{ borderLeft: '1px solid #e8edf3' }}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => alert('下载附件')}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-steel-500 hover:bg-slate-100 hover:text-primary-600 transition-colors cursor-pointer"
                              title="下载"
                            >
                              <i className="ri-download-line text-sm" />
                            </button>
                            <button
                              onClick={() => {
                                setModal({ type: 'edit', attachment: att });
                                setEditDescription(att.description);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-steel-500 hover:bg-slate-100 hover:text-primary-600 transition-colors cursor-pointer"
                              title="修改说明"
                            >
                              <i className="ri-edit-line text-sm" />
                            </button>
                            <button
                              onClick={() => {
                                setModal({ type: 'delete', selectedIds: [att.id] });
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-steel-500 hover:bg-slate-100 hover:text-red-500 transition-colors cursor-pointer"
                              title="删除"
                            >
                              <i className="ri-delete-bin-line text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {modal.type === 'upload' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-steel-100">
              <h3 className="text-sm font-semibold text-steel-800">上传附件</h3>
              <button
                onClick={() => { setModal({ type: null }); setUploadFiles([]); setUploadDescription(''); }}
                className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer rounded-md hover:bg-slate-100"
              >
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging ? 'border-primary-500 bg-primary-50' : 'border-steel-300 bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2 text-steel-400">
                  <i className="ri-upload-cloud-2-line text-2xl" />
                </div>
                <p className="text-sm text-steel-600 mb-1">点击选择文件或拖拽文件至此</p>
                <p className="text-xs text-steel-400">支持批量选择，单个不超过50MB，单次不超过20个</p>
                <p className="text-xs text-steel-400 mt-1">PDF、Word、Excel、PPT、图片（JPG、PNG）、压缩包（RAR、ZIP）</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.rar,.zip"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block mt-3 px-4 py-1.5 text-xs text-white rounded-md cursor-pointer hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                >
                  选择文件
                </label>
              </div>

              {/* File List */}
              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-steel-500 font-medium">已选择 {uploadFiles.length} 个文件</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {uploadFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-md">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-4 h-4 flex items-center justify-center text-steel-400">
                            <i className="ri-file-line" />
                          </div>
                          <span className="text-xs text-steel-700 truncate">{file.name}</span>
                          <span className="text-xs text-steel-400 flex-shrink-0">({file.size})</span>
                        </div>
                        <button
                          onClick={() => removeUploadFile(idx)}
                          className="w-5 h-5 flex items-center justify-center text-steel-400 hover:text-red-500 cursor-pointer flex-shrink-0"
                        >
                          <i className="ri-close-line" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs text-steel-500 font-medium block mb-1.5">附件说明</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none bg-slate-50"
                  rows={3}
                  placeholder="为本次上传的附件添加统一说明备注（可选）"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50">
              <button
                onClick={() => { setModal({ type: null }); setUploadFiles([]); setUploadDescription(''); }}
                className="px-4 py-2 text-sm text-steel-600 border border-steel-300 rounded-md hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                取消
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadFiles.length === 0}
                className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                确认上传
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Description Modal */}
      {modal.type === 'edit' && modal.attachment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-steel-100">
              <h3 className="text-sm font-semibold text-steel-800">修改附件说明</h3>
              <button
                onClick={() => { setModal({ type: null }); setEditDescription(''); }}
                className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer rounded-md hover:bg-slate-100"
              >
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs text-steel-500 font-medium block mb-1.5">附件名称</label>
                <p className="text-sm text-steel-800 px-3 py-2 bg-slate-50 rounded-md">{modal.attachment.name}</p>
              </div>
              <div>
                <label className="text-xs text-steel-500 font-medium block mb-1.5">附件说明</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none bg-slate-50"
                  rows={3}
                  placeholder="请输入附件说明"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50">
              <button
                onClick={() => { setModal({ type: null }); setEditDescription(''); }}
                className="px-4 py-2 text-sm text-steel-600 border border-steel-300 rounded-md hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                取消
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal.type === 'delete' && modal.selectedIds && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-5 py-4 text-center">
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3 rounded-full bg-red-50">
                <i className="ri-error-warning-line text-xl text-red-500" />
              </div>
              <h3 className="text-sm font-semibold text-steel-800 mb-1">确认删除</h3>
              <p className="text-xs text-steel-500">
                确定删除选中的 {modal.selectedIds.length} 个附件吗？此操作不可恢复。
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50">
              <button
                onClick={() => setModal({ type: null })}
                className="px-4 py-2 text-sm text-steel-600 border border-steel-300 rounded-md hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap bg-red-500"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operation Log Modal */}
      {modal.type === 'logs' && modal.stageId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden" style={{ maxHeight: '80vh' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-steel-100">
              <h3 className="text-sm font-semibold text-steel-800">
                {stages.find((s) => s.id === modal.stageId)?.name} - 操作日志
              </h3>
              <button
                onClick={() => setModal({ type: null })}
                className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer rounded-md hover:bg-slate-100"
              >
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10">
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">序号</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">操作人</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">操作时间</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">操作类型</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '280px' }}>操作内容</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">操作结果</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const logs = getStageOperationLogs(modal.stageId!);
                    if (logs.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100">
                                <i className="ri-file-list-3-line text-xl text-steel-300" />
                              </div>
                              <p className="text-sm text-steel-400">暂无操作日志</p>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                    return logs.map((log, idx) => (
                      <tr key={log.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-steel-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{log.operator}</td>
                        <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{log.operationTime}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getOperationTypeColor(log.operationType)}`}>
                            <div className="w-3 h-3 flex items-center justify-center">
                              <i className={getOperationTypeIcon(log.operationType)} />
                            </div>
                            {log.operationType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-700">
                          <span className="truncate block max-w-xs">{log.operationContent}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            log.result === '成功'
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-red-600 bg-red-50'
                          }`}>
                            <div className="w-3 h-3 flex items-center justify-center">
                              <i className={log.result === '成功' ? 'ri-check-line' : 'ri-close-line'} />
                            </div>
                            {log.result}
                          </span>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end px-5 py-3 border-t border-steel-100 bg-slate-50">
              <button
                onClick={() => setModal({ type: null })}
                className="px-4 py-2 text-sm text-steel-600 border border-steel-300 rounded-md hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}