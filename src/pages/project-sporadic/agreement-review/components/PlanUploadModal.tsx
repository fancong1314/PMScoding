import { useEffect, useMemo, useRef, useState } from 'react';
import { getSporadicPlanUploadAttachmentConfigs, type AttachmentConfig } from '@/mocks/archiveConfigMocks';
import type { SporadicAttachmentMap, SporadicAttachmentFile } from '@/mocks/sporadicProjectMocks';

export type PlanAttachmentMap = SporadicAttachmentMap;

interface SectionProps {
  uploads: PlanAttachmentMap;
  onChange: (next: PlanAttachmentMap) => void;
  errors?: Record<string, string>;
  readonly?: boolean;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function acceptFromFormats(formats: string[]) {
  const map: Record<string, string> = {
    PDF: '.pdf',
    'Word(doc/docx)': '.doc,.docx',
    'Excel(xls/xlsx)': '.xls,.xlsx',
    '图片(jpg/png/bmp)': '.jpg,.jpeg,.png,.bmp',
    'CAD(dwg/dxf)': '.dwg,.dxf',
    '压缩包(zip/rar/7z)': '.zip,.rar,.7z',
    '视频(mp4/avi)': '.mp4,.avi',
  };
  return formats.map((f) => map[f] || '').filter(Boolean).join(',') || undefined;
}

function ConfigCard({
  config,
  files,
  error,
  onAdd,
  onRemove,
  readonly,
}: {
  config: AttachmentConfig;
  files: SporadicAttachmentFile[];
  error?: string;
  onAdd: (files: FileList | null) => void;
  onRemove: (fileId: string) => void;
  readonly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const remain = Math.max(0, config.fileCount - files.length);

  return (
    <div className={`rounded-lg border p-4 ${error ? 'border-red-300 bg-red-50/20' : 'border-steel-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-steel-800">{config.docName}</h4>
            {config.required ? (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-50 text-red-600 border border-red-100">必填</span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-steel-500 border border-steel-100">选填</span>
            )}
            {config.archived ? (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-50 text-emerald-600 border border-emerald-100">存档</span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-steel-400 border border-steel-100">不存档</span>
            )}
          </div>
          <p className="text-xs text-steel-400 mt-1.5">
            文件类型：{config.fileFormats.join('、')} · 单文件 ≤ {config.fileSize}{config.fileSizeUnit} · 最多 {config.fileCount} 个
          </p>
          {config.remark && (
            <p className="text-xs text-amber-700 mt-1.5 bg-amber-50 border border-amber-100 rounded px-2 py-1">
              <i className="ri-information-line mr-1" />
              {config.remark}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {config.templateFile && (
            <>
              <button
                type="button"
                className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
                onClick={() => alert(`预览模板：${config.templateFile}`)}
              >
                预览模板
              </button>
              <button
                type="button"
                className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
                onClick={() => alert(`开始下载模板：${config.templateFile}`)}
              >
                下载模板
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {files.map((f) => (
          <div key={f.id} className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50 border border-steel-100">
            <i className="ri-attachment-2 text-steel-400" />
            <button
              type="button"
              className="text-sm text-sky-600 hover:underline flex-1 truncate text-left cursor-pointer"
              onClick={() => alert(`预览/下载：${f.name}`)}
            >
              {f.name}
            </button>
            <span className="text-xs text-steel-400">{formatSize(f.size)}</span>
            {!readonly && (
              <button
                type="button"
                onClick={() => onRemove(f.id)}
                className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-red-500 cursor-pointer"
              >
                <i className="ri-close-line" />
              </button>
            )}
          </div>
        ))}

        {!readonly && remain > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border border-dashed border-steel-200 rounded-md py-3 text-sm text-steel-500 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-colors"
          >
            <i className="ri-upload-cloud-2-line mr-1.5" />
            上传文件（还可上传 {remain} 个）
          </button>
        )}
        {readonly && files.length === 0 && (
          <p className="text-sm text-steel-400 py-3 text-center border border-dashed border-steel-200 rounded-md">
            暂无已上传附件
          </p>
        )}
        {!readonly && (
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptFromFormats(config.fileFormats)}
            className="hidden"
            onChange={(e) => {
              onAdd(e.target.files);
              e.target.value = '';
            }}
          />
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function PlanAttachmentSection({ uploads, onChange, errors = {}, readonly = false }: SectionProps) {
  const configs = useMemo(() => getSporadicPlanUploadAttachmentConfigs(), []);

  const handleAdd = (config: AttachmentConfig, fileList: FileList | null) => {
    if (readonly || !fileList || fileList.length === 0) return;
    const current = uploads[config.id] || [];
    const remain = Math.max(0, config.fileCount - current.length);
    const maxBytes = config.fileSize * (config.fileSizeUnit === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024);
    const nextFiles: SporadicAttachmentFile[] = [...current];

    Array.from(fileList).slice(0, remain).forEach((file) => {
      if (file.size > maxBytes) {
        alert(`「${file.name}」超过大小限制 ${config.fileSize}${config.fileSizeUnit}`);
        return;
      }
      nextFiles.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
      });
    });

    onChange({ ...uploads, [config.id]: nextFiles });
  };

  const handleRemove = (configId: string, fileId: string) => {
    if (readonly) return;
    const list = (uploads[configId] || []).filter((f) => f.id !== fileId);
    onChange({ ...uploads, [configId]: list });
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-attachment-2 text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">附件上传</h3>
        <span className="text-xs text-steel-400 ml-1">
          依据项目档案配置 · 零星协议单审查 · 方案上传
        </span>
      </div>

      <div className="p-5 space-y-3">
        {configs.length === 0 ? (
          <div className="py-10 text-center text-sm text-steel-400">
            当前暂无附件配置，请先在「项目档案配置」中维护零星协议单审查节点
          </div>
        ) : (
          configs.map((cfg) => (
            <ConfigCard
              key={cfg.id}
              config={cfg}
              files={uploads[cfg.id] || []}
              error={errors[`attach_${cfg.id}`]}
              onAdd={(fl) => handleAdd(cfg, fl)}
              onRemove={(fid) => handleRemove(cfg.id, fid)}
              readonly={readonly}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function validatePlanAttachments(uploads: PlanAttachmentMap): Record<string, string> {
  const errors: Record<string, string> = {};
  getSporadicPlanUploadAttachmentConfigs().forEach((cfg) => {
    if (cfg.required && (!(uploads[cfg.id] || []).length)) {
      errors[`attach_${cfg.id}`] = `请上传「${cfg.docName}」`;
    }
  });
  return errors;
}

interface ModalProps {
  open: boolean;
  declareName: string;
  initialUploader?: string;
  initialUploadTime?: string;
  initialUploads?: PlanAttachmentMap;
  initialNeedPlan?: boolean;
  initialRemark?: string;
  onClose: () => void;
  onSubmit: (payload: {
    uploads: PlanAttachmentMap;
    uploader: string;
    uploadTime: string;
    needPlan: boolean;
    planRemark: string;
  }) => void;
}

function nowStr() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export default function PlanUploadModal({
  open,
  declareName,
  initialUploader = '',
  initialUploadTime = '',
  initialUploads = {},
  initialNeedPlan = true,
  initialRemark = '',
  onClose,
  onSubmit,
}: ModalProps) {
  const [uploads, setUploads] = useState<PlanAttachmentMap>(initialUploads);
  const [uploader, setUploader] = useState(initialUploader || '樊聪');
  const [uploadTime, setUploadTime] = useState(initialUploadTime || nowStr());
  const [needPlan, setNeedPlan] = useState(initialNeedPlan);
  const [planRemark, setPlanRemark] = useState(initialRemark);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setUploads(initialUploads);
      setUploader(initialUploader || '樊聪');
      setUploadTime(initialUploadTime || nowStr());
      setNeedPlan(initialNeedPlan);
      setPlanRemark(initialRemark);
      setErrors({});
    }
  }, [open, initialUploads, initialUploader, initialUploadTime, initialNeedPlan, initialRemark]);

  if (!open) return null;

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!uploader.trim()) e.uploader = '请填写方案上传人';
    if (!uploadTime.trim()) e.uploadTime = '请填写上传时间';
    if (needPlan) {
      Object.assign(e, validatePlanAttachments(uploads));
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSubmit({
      uploads: needPlan ? uploads : {},
      uploader: uploader.trim(),
      uploadTime: uploadTime.trim(),
      needPlan,
      planRemark: planRemark.trim(),
    });
  };

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
      err ? 'border-red-300 bg-red-50/30' : 'border-steel-200 bg-white'
    }`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[860px] max-w-[94vw] max-h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h3 className="text-base font-semibold text-steel-800">方案上传</h3>
            <p className="text-xs text-steel-400 mt-0.5 truncate max-w-[640px]">{declareName}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer rounded-md hover:bg-slate-50">
            <i className="ri-close-line text-lg" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
            <div
              className="flex items-center gap-2.5 px-5 py-3.5"
              style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-user-line text-emerald-500" />
              </div>
              <h3 className="text-sm font-semibold text-steel-800">上传信息</h3>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className="flex justify-end items-center text-sm text-steel-600 pt-2 whitespace-nowrap">
                  <span className="text-red-500 mr-0.5">*</span>是否需要方案
                </label>
                <div className="flex items-center gap-5 pt-2">
                  <label className="inline-flex items-center gap-1.5 text-sm text-steel-700 cursor-pointer">
                    <input
                      type="radio"
                      name="needPlan"
                      checked={needPlan}
                      onChange={() => setNeedPlan(true)}
                      className="accent-emerald-600 cursor-pointer"
                    />
                    是
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-sm text-steel-700 cursor-pointer">
                    <input
                      type="radio"
                      name="needPlan"
                      checked={!needPlan}
                      onChange={() => setNeedPlan(false)}
                      className="accent-emerald-600 cursor-pointer"
                    />
                    否
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start md:col-span-2">
                <label className="flex justify-end items-start text-sm text-steel-600 pt-2 whitespace-nowrap">
                  备注
                </label>
                <div>
                  <textarea
                    value={planRemark}
                    maxLength={100}
                    rows={3}
                    onChange={(e) => setPlanRemark(e.target.value.slice(0, 100))}
                    placeholder="请输入备注，100字以内"
                    className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  <p className="text-[11px] text-steel-300 text-right mt-0.5">{planRemark.length}/100</p>
                </div>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className="flex justify-end items-center text-sm text-steel-600 pt-2 whitespace-nowrap">
                  <span className="text-red-500 mr-0.5">*</span>方案上传人
                </label>
                <div>
                  <input
                    value={uploader}
                    onChange={(e) => {
                      setUploader(e.target.value);
                      setErrors((prev) => { const n = { ...prev }; delete n.uploader; return n; });
                    }}
                    className={inputCls(errors.uploader)}
                    placeholder="请输入方案上传人"
                  />
                  {errors.uploader && <p className="mt-1 text-xs text-red-500">{errors.uploader}</p>}
                </div>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className="flex justify-end items-center text-sm text-steel-600 pt-2 whitespace-nowrap">
                  <span className="text-red-500 mr-0.5">*</span>上传时间
                </label>
                <div>
                  <input
                    type="datetime-local"
                    value={uploadTime.replace(' ', 'T').slice(0, 16)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setUploadTime(v ? `${v.replace('T', ' ')}:00`.slice(0, 19) : '');
                      setErrors((prev) => { const n = { ...prev }; delete n.uploadTime; return n; });
                    }}
                    className={inputCls(errors.uploadTime)}
                  />
                  {errors.uploadTime && <p className="mt-1 text-xs text-red-500">{errors.uploadTime}</p>}
                </div>
              </div>
            </div>
          </div>

          {needPlan && (
            <PlanAttachmentSection
              uploads={uploads}
              onChange={(next) => {
                setUploads(next);
                setErrors((prev) => {
                  const nextErr = { ...prev };
                  Object.keys(nextErr).forEach((k) => { if (k.startsWith('attach_')) delete nextErr[k]; });
                  return nextErr;
                });
              }}
              errors={errors}
            />
          )}
          {!needPlan && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
              <i className="ri-information-line mr-1" />
              已选择「不需要方案」，提交后无需上传方案附件
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50/80">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer">
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}
          >
            提交方案
          </button>
        </div>
      </div>
    </div>
  );
}
