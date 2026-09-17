import { useMemo, useRef } from 'react';
import { getInitiationDeclarationAttachmentConfigs, type AttachmentConfig } from '@/mocks/archiveConfigMocks';

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
}

export type AttachmentUploadMap = Record<string, UploadedFileItem[]>;

interface Props {
  majorType: string;
  uploads: AttachmentUploadMap;
  onChange: (next: AttachmentUploadMap) => void;
  errors?: Record<string, string>;
  sectionRef: (el: HTMLDivElement | null) => void;
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
  files: UploadedFileItem[];
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

export default function AttachmentUploadSection({
  majorType,
  uploads,
  onChange,
  errors = {},
  sectionRef,
  readonly = false,
}: Props) {
  const configs = useMemo(() => getInitiationDeclarationAttachmentConfigs(majorType), [majorType]);

  const handleAdd = (config: AttachmentConfig, fileList: FileList | null) => {
    if (readonly || !fileList || fileList.length === 0) return;
    const current = uploads[config.id] || [];
    const remain = Math.max(0, config.fileCount - current.length);
    const maxBytes = config.fileSize * (config.fileSizeUnit === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024);
    const nextFiles: UploadedFileItem[] = [...current];

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
    <div id="attachment-upload" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-attachment-2 text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">附件上传</h3>
        <span className="text-xs text-steel-400 ml-1">
          依据项目档案配置 · 项目立项申请 · {majorType}类
        </span>
      </div>

      <div className="p-5 space-y-3">
        {configs.length === 0 ? (
          <div className="py-10 text-center text-sm text-steel-400">
            当前项目大类暂无附件配置，请先在「项目档案配置」中维护项目立项申请节点
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

/** 校验必填附件是否已上传 */
export function validateRequiredAttachments(
  majorType: string,
  uploads: AttachmentUploadMap
): Record<string, string> {
  const errors: Record<string, string> = {};
  getInitiationDeclarationAttachmentConfigs(majorType).forEach((cfg) => {
    if (cfg.required && (!(uploads[cfg.id] || []).length)) {
      errors[`attach_${cfg.id}`] = `请上传「${cfg.docName}」`;
    }
  });
  return errors;
}
