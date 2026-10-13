import { useRef, useState } from 'react';
import { FormField, formInputCls, formRow2Cls } from '@/components/feature/FormLayout';
import { employees } from '@/mocks/projectPrepareMocks';
import type { PermitStageDoc } from '@/mocks/approvalPermitConfigMocks';
import {
  addAttachment,
  addOperationLog,
  deleteAttachments,
  getFileTypeColor,
  getFileTypeIcon,
  updateAttachment,
  updateStageStatus,
  type StageAttachment,
} from '@/mocks/projectApprovalMocks';

interface Props {
  stageId: string;
  stageName: string;
  docs: PermitStageDoc[];
  attachments: StageAttachment[];
  onChange: () => void;
  onOpenLogs: () => void;
}

export default function StageResultUploadSection({
  stageId,
  stageName,
  docs,
  attachments,
  onChange,
  onOpenLogs,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editing, setEditing] = useState<StageAttachment | null>(null);
  const [uploadDocId, setUploadDocId] = useState('');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (attachments.length > 0 && attachments.every((a) => selectedIds.has(a.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(attachments.map((a) => a.id)));
    }
  };

  const handleDelete = (items: StageAttachment[]) => {
    if (items.length === 0) return;
    deleteAttachments(items.map((i) => i.id));
    items.forEach((item) => {
      addOperationLog(stageId, {
        stageId,
        operator: '管理员',
        operationTime: nowStr(),
        operationType: '删除',
        operationContent: `删除附件《${item.name}》`,
        result: '成功',
      });
    });
    setSelectedIds(new Set());
    onChange();
  };

  const openUpload = (docId?: string) => {
    setUploadDocId(docId || docs[0]?.id || '');
    setUploadOpen(true);
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-steel-800">{stageName}</span>
          <span className="text-xs text-steel-400">共 {attachments.length} 个附件</span>
          {docs.length > 0 && (
            <span className="text-xs text-steel-400">· 配置要求 {docs.length} 类办结文件</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={() => handleDelete(attachments.filter((a) => selectedIds.has(a.id)))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-delete-bin-line" />
              删除所选
            </button>
          )}
          <button
            type="button"
            onClick={onOpenLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-file-list-3-line" />
            操作日志
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left" style={{ minWidth: 1200 }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={attachments.length > 0 && attachments.every((a) => selectedIds.has(a.id))}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-steel-300 text-primary-600"
                />
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">序号</th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">办结文件</th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">附件名称</th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">文件类型</th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">文件大小</th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">附件说明</th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">办理人员</th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">上传人</th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">上传时间</th>
              <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: 120, borderLeft: '1px solid #e8edf3' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {attachments.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-sm text-steel-400">暂无附件</td>
                <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      title="上传附件"
                      onClick={() => openUpload()}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:text-primary-700 cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-upload-2-line" />
                      上传
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              attachments.map((item, idx) => (
                <tr key={item.id} className="border-b border-steel-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded border-steel-300 text-primary-600"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-steel-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-steel-800 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100 text-xs font-medium">
                      {item.docName || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-steel-800">
                    <span className="inline-flex items-center gap-1.5">
                      <i className={`${getFileTypeIcon(item.fileType)} ${getFileTypeColor(item.fileType)}`} />
                      <span className="truncate max-w-[220px]" title={item.name}>{item.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{item.fileType}</td>
                  <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{item.fileSize}</td>
                  <td className="px-4 py-3 text-sm text-steel-600 max-w-[220px]">
                    <span className="line-clamp-2" title={item.description}>{item.description || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{item.handler || '—'}</td>
                  <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{item.uploader}</td>
                  <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{item.uploadTime}</td>
                  <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                    <div className="flex items-center justify-center gap-1">
                      <button type="button" title="上传" onClick={() => openUpload(item.docId)} className="w-7 h-7 flex items-center justify-center text-steel-500 hover:text-primary-600 cursor-pointer">
                        <i className="ri-upload-2-line" />
                      </button>
                      <button type="button" title="预览" onClick={() => alert(`预览附件：${item.name}`)} className="w-7 h-7 flex items-center justify-center text-steel-500 hover:text-primary-600 cursor-pointer">
                        <i className="ri-eye-line" />
                      </button>
                      <button type="button" title="编辑" onClick={() => setEditing(item)} className="w-7 h-7 flex items-center justify-center text-steel-500 hover:text-primary-600 cursor-pointer">
                        <i className="ri-edit-line" />
                      </button>
                      <button type="button" title="删除" onClick={() => handleDelete([item])} className="w-7 h-7 flex items-center justify-center text-steel-500 hover:text-red-500 cursor-pointer">
                        <i className="ri-delete-bin-line" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {uploadOpen && (
        <AttachmentFormModal
          title="上传附件"
          docs={docs}
          initialDocId={uploadDocId}
          onClose={() => setUploadOpen(false)}
          onSubmit={(data) => {
            addAttachment(stageId, {
              stageId,
              docId: data.docId,
              docName: data.docName,
              name: data.fileName,
              fileType: data.fileType,
              fileSize: data.fileSize,
              description: data.description,
              uploader: '管理员',
              uploadTime: nowStr(),
              handler: data.handler,
              downloadUrl: '#',
            });
            addOperationLog(stageId, {
              stageId,
              operator: '管理员',
              operationTime: nowStr(),
              operationType: '上传',
              operationContent: `上传办结文件「${data.docName}」附件《${data.fileName}》，办理人员：${data.handler}`,
              result: '成功',
            });
            updateStageStatus(stageId, '进行中');
            setUploadOpen(false);
            onChange();
          }}
        />
      )}

      {editing && (
        <AttachmentFormModal
          title="编辑附件"
          docs={docs}
          initial={editing}
          initialDocId={editing.docId}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            updateAttachment(editing.id, {
              description: data.description,
              handler: data.handler,
              name: data.fileName || editing.name,
              fileType: data.fileType || editing.fileType,
              fileSize: data.fileSize || editing.fileSize,
              docId: data.docId,
              docName: data.docName,
            });
            addOperationLog(stageId, {
              stageId,
              operator: '管理员',
              operationTime: nowStr(),
              operationType: '修改',
              operationContent: `修改办结文件「${data.docName}」附件《${data.fileName || editing.name}》`,
              result: '成功',
            });
            setEditing(null);
            onChange();
          }}
        />
      )}
    </div>
  );
}

function nowStr() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function AttachmentFormModal({
  title,
  docs,
  initial,
  initialDocId,
  onClose,
  onSubmit,
}: {
  title: string;
  docs: PermitStageDoc[];
  initial?: StageAttachment | null;
  initialDocId?: string;
  onClose: () => void;
  onSubmit: (data: {
    docId: string;
    docName: string;
    fileName: string;
    fileType: string;
    fileSize: string;
    description: string;
    handler: string;
  }) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [docId, setDocId] = useState(initialDocId || initial?.docId || docs[0]?.id || '');
  const [fileName, setFileName] = useState(initial?.name || '');
  const [fileType, setFileType] = useState(initial?.fileType || '');
  const [fileSize, setFileSize] = useState(initial?.fileSize || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [handler, setHandler] = useState(initial?.handler || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickFile = (list: FileList | null) => {
    const file = list?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileType(file.name.split('.').pop()?.toUpperCase() || '文件');
    setFileSize(file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)}MB` : `${Math.max(1, Math.round(file.size / 1024))}KB`);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.fileName;
      return next;
    });
  };

  const handleOk = () => {
    const e: Record<string, string> = {};
    if (!docId) e.docId = '请选择办结文件';
    if (!fileName.trim()) e.fileName = '请选择或上传附件';
    if (!handler.trim()) e.handler = '请选择办理人';
    setErrors(e);
    if (Object.keys(e).length) return;
    const doc = docs.find((d) => d.id === docId);
    onSubmit({
      docId,
      docName: doc?.docName || initial?.docName || '—',
      fileName: fileName.trim(),
      fileType: fileType || '文件',
      fileSize: fileSize || '—',
      description: description.trim(),
      handler: handler.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[560px] max-w-[95vw]">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-steel-800">{title}</h3>
          <button type="button" onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <FormField label="办结文件" required error={errors.docId} fullWidth>
            <select
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              className={formInputCls(errors.docId) + ' cursor-pointer'}
            >
              <option value="">请选择配置要求的办结文件</option>
              {docs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.docName}{d.required ? '（必填）' : '（选填）'}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="附件" required error={errors.fileName} fullWidth>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-2 text-sm text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-upload-2-line mr-1" />
                选择文件
              </button>
              <span className={`text-sm truncate ${fileName ? 'text-steel-800' : 'text-steel-400'}`}>
                {fileName || '未选择文件（实际上传文件名）'}
              </span>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  pickFile(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>
          </FormField>
          <div className={formRow2Cls}>
            <FormField label="办理人" required error={errors.handler}>
              <select
                value={handler}
                onChange={(e) => setHandler(e.target.value)}
                className={formInputCls(errors.handler) + ' cursor-pointer'}
              >
                <option value="">请选择办理人</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>{emp.name}（{emp.department}）</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="附件说明" topAlign fullWidth>
            <textarea
              rows={3}
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="请填写附件说明"
              className={formInputCls() + ' resize-none'}
            />
            <p className="text-xs text-steel-400 text-right mt-1">{description.length}/200</p>
          </FormField>
        </div>
        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button
            type="button"
            onClick={handleOk}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
