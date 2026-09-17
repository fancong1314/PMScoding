import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getJointOpinionSignAttachmentConfigs,
  type AttachmentConfig,
} from '@/mocks/archiveConfigMocks';
import type {
  JointOpinionAttachmentFile,
  JointOpinionPassResult,
  JointOpinionSignRecord,
} from '@/mocks/jointOpinionSignMocks';

export interface SignOpinionFormValue {
  signTime: string;
  signer: string;
  reviewTime: string;
  reviewers: string;
  passResult: JointOpinionPassResult;
  opinion: string;
  attachments: JointOpinionAttachmentFile[];
}

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  record: JointOpinionSignRecord | null;
  onClose: () => void;
  onSubmit: (value: SignOpinionFormValue) => void;
}

type UploadMap = Record<string, JointOpinionAttachmentFile[]>;

function nowDateTimeLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toDatetimeLocal(v: string): string {
  if (!v) return nowDateTimeLocal();
  return v.includes('T') ? v.slice(0, 16) : v.replace(' ', 'T').slice(0, 16);
}

function fromDatetimeLocal(v: string): string {
  if (!v) return '';
  return v.replace('T', ' ');
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
  };
  return formats.map((f) => map[f] || '').filter(Boolean).join(',') || undefined;
}

function ConfigCard({
  config,
  files,
  error,
  onAdd,
  onRemove,
}: {
  config: AttachmentConfig;
  files: JointOpinionAttachmentFile[];
  error?: string;
  onAdd: (files: FileList | null) => void;
  onRemove: (fileId: string) => void;
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
        {config.templateFile && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="px-2 py-1 text-xs text-steel-600 border border-steel-200 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap"
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
          </div>
        )}
      </div>

      {files.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-slate-50 border border-steel-100">
              <span className="text-xs text-steel-700 truncate">
                <i className="ri-file-line mr-1 text-steel-400" />
                {f.name}
                <span className="text-steel-400 ml-2">{formatSize(f.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => onRemove(f.id)}
                className="text-xs text-red-500 hover:text-red-600 cursor-pointer whitespace-nowrap"
              >
                移除
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        disabled={remain <= 0}
        onClick={() => inputRef.current?.click()}
        className="w-full py-3 border border-dashed border-steel-300 rounded-md text-xs text-steel-500 hover:border-primary-400 hover:text-primary-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上传文件（还可上传 {remain} 个）
      </button>
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
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function SignOpinionModal({ open, mode, record, onClose, onSubmit }: Props) {
  const configs = useMemo(
    () => getJointOpinionSignAttachmentConfigs(record?.projectMajorType),
    [record?.projectMajorType]
  );

  const [signTime, setSignTime] = useState('');
  const [signer, setSigner] = useState('超级管理员');
  const [reviewTime, setReviewTime] = useState('');
  const [reviewers, setReviewers] = useState('');
  const [passResult, setPassResult] = useState<JointOpinionPassResult>('');
  const [opinion, setOpinion] = useState('');
  const [uploads, setUploads] = useState<UploadMap>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !record) return;
    setSignTime(toDatetimeLocal(record.signTime || nowDateTimeLocal()));
    setSigner(record.signer || '超级管理员');
    setReviewTime(toDatetimeLocal(record.reviewTime || nowDateTimeLocal()));
    setReviewers(record.reviewers || '');
    setPassResult(record.passResult || '');
    setOpinion(record.opinion || '');
    const map: UploadMap = {};
    const firstCfg = getJointOpinionSignAttachmentConfigs(record.projectMajorType)[0];
    if (firstCfg && record.attachments?.length) {
      map[firstCfg.id] = record.attachments.map((a) => ({ ...a }));
    }
    setUploads(map);
    setErrors({});
  }, [open, record]);

  if (!open || !record) return null;

  const labelCls = 'text-sm text-steel-600 whitespace-nowrap pt-2';
  const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
      err ? 'border-red-300 bg-red-50/30' : 'border-steel-200 bg-white'
    }`;

  const handleAddFiles = (config: AttachmentConfig, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const current = uploads[config.id] || [];
    const remain = Math.max(0, config.fileCount - current.length);
    const maxBytes = config.fileSize * 1024 * 1024;
    const next = [...current];
    Array.from(fileList).slice(0, remain).forEach((file) => {
      if (file.size > maxBytes) {
        alert(`「${file.name}」超过大小限制 ${config.fileSize}${config.fileSizeUnit}`);
        return;
      }
      next.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
      });
    });
    setUploads((prev) => ({ ...prev, [config.id]: next }));
    setErrors((prev) => {
      const n = { ...prev };
      delete n[`attach_${config.id}`];
      return n;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!passResult) e.passResult = '请选择是否通过';
    if (!opinion.trim()) e.opinion = '请填写会审意见';
    else if (opinion.trim().length > 200) e.opinion = '会审意见不超过200字';
    configs.forEach((cfg) => {
      if (cfg.required && !(uploads[cfg.id] || []).length) {
        e[`attach_${cfg.id}`] = `请上传「${cfg.docName}」`;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const attachments = configs.flatMap((c) => uploads[c.id] || []);
    onSubmit({
      signTime: fromDatetimeLocal(signTime),
      signer: signer.trim() || '超级管理员',
      reviewTime: fromDatetimeLocal(reviewTime),
      reviewers: reviewers.trim(),
      passResult,
      opinion: opinion.trim(),
      attachments,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-steel-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-steel-800">
            {mode === 'edit' ? '修改意见签署' : '新增意见签署'}
          </h3>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
            <label className={labelCls}>年度计划名称</label>
            <div className="px-3 py-2 text-sm text-steel-800 bg-slate-50 border border-steel-100 rounded-md">
              {record.planName}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
              <label className={labelCls}>签署时间</label>
              <input
                type="datetime-local"
                value={signTime}
                onChange={(e) => setSignTime(e.target.value)}
                className={inputCls()}
              />
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
              <label className={labelCls}>签署人</label>
              <input
                type="text"
                value={signer}
                onChange={(e) => setSigner(e.target.value)}
                className={inputCls()}
                placeholder="请输入签署人"
              />
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
              <label className={labelCls}>会审时间</label>
              <input
                type="datetime-local"
                value={reviewTime}
                onChange={(e) => setReviewTime(e.target.value)}
                className={inputCls()}
              />
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
              <label className={labelCls}>会审人员</label>
              <input
                type="text"
                value={reviewers}
                onChange={(e) => setReviewers(e.target.value)}
                className={inputCls()}
                placeholder="请输入会审人员"
              />
            </div>
          </div>

          <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
            <label className={labelCls}>
              是否通过<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div>
              <div className="flex items-center gap-6 pt-2">
                {(['通过', '不通过'] as const).map((opt) => (
                  <label key={opt} className="inline-flex items-center gap-2 text-sm text-steel-700 cursor-pointer">
                    <input
                      type="radio"
                      name="passResult"
                      checked={passResult === opt}
                      onChange={() => {
                        setPassResult(opt);
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.passResult;
                          return n;
                        });
                      }}
                      className="accent-primary-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.passResult && <p className="mt-1 text-xs text-red-500">{errors.passResult}</p>}
            </div>
          </div>

          <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
            <label className={labelCls}>
              会审意见<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div>
              <textarea
                rows={4}
                maxLength={200}
                value={opinion}
                onChange={(e) => {
                  setOpinion(e.target.value.slice(0, 200));
                  if (errors.opinion) {
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.opinion;
                      return n;
                    });
                  }
                }}
                placeholder="请输入，200字以内"
                className={inputCls(errors.opinion) + ' resize-none'}
              />
              <p className="text-xs text-steel-400 mt-1 text-right">{opinion.length}/200</p>
              {errors.opinion && <p className="mt-1 text-xs text-red-500">{errors.opinion}</p>}
            </div>
          </div>

          <div className="rounded-lg border border-steel-200 overflow-hidden">
            <div
              className="flex items-center gap-2.5 px-4 py-3"
              style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
            >
              <i className="ri-attachment-2 text-emerald-500" />
              <h4 className="text-sm font-semibold text-steel-800">附件上传</h4>
              <span className="text-xs text-steel-400 ml-1">
                依据项目档案配置 · 会审意见签署 · {record.projectMajorType}类
              </span>
            </div>
            <div className="p-4 space-y-3">
              {configs.length === 0 ? (
                <p className="text-sm text-steel-400 py-4 text-center">
                  当前暂无附件配置，请先在「项目档案配置」中维护会审意见签署节点
                </p>
              ) : (
                configs.map((cfg) => (
                  <ConfigCard
                    key={cfg.id}
                    config={cfg}
                    files={uploads[cfg.id] || []}
                    error={errors[`attach_${cfg.id}`]}
                    onAdd={(fl) => handleAddFiles(cfg, fl)}
                    onRemove={(fid) =>
                      setUploads((prev) => ({
                        ...prev,
                        [cfg.id]: (prev[cfg.id] || []).filter((f) => f.id !== fid),
                      }))
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-steel-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            提交
          </button>
        </div>
      </div>
    </div>
  );
}
