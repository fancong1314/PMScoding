import { useRef } from 'react';
import type { AttachmentConfig } from '@/mocks/archiveConfigMocks';

export interface LocalUploadFile {
  id: string;
  name: string;
  size: number;
}

export type LocalUploadMap = Record<string, LocalUploadFile[]>;

function acceptFromFormats(formats: string[]) {
  const map: Record<string, string> = {
    PDF: '.pdf',
    'Word(doc/docx)': '.doc,.docx',
    'Excel(xls/xlsx)': '.xls,.xlsx',
    '图片(jpg/png/bmp)': '.jpg,.jpeg,.png,.bmp',
    'CAD(dwg/dxf)': '.dwg,.dxf',
    '压缩包(zip/rar/7z)': '.zip,.rar,.7z',
    '视频(mp4/avi)': '.mp4,.avi',
    其他: '.mp3,.wav,.m4a,.aac,.ppt,.pptx,.txt',
  };
  return formats.map((f) => map[f] || '').filter(Boolean).join(',') || undefined;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ConfigCard({
  config,
  files,
  onAdd,
  onRemove,
}: {
  config: AttachmentConfig;
  files: LocalUploadFile[];
  onAdd: (files: FileList | null) => void;
  onRemove: (fileId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const remain = Math.max(0, config.fileCount - files.length);

  return (
    <div className="rounded-lg border border-steel-200 bg-white p-4">
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
          <div className="flex items-center gap-1 flex-shrink-0">
            <button type="button" className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">
              预览模板
            </button>
            <button type="button" className="px-2 py-1 text-xs text-emerald-600 border border-emerald-300 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap">
              下载模板
            </button>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <ul className="mb-2 space-y-1">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between text-xs bg-slate-50 rounded px-2 py-1.5">
              <span className="truncate text-slate-700">{f.name}</span>
              <span className="text-slate-400 mx-2 flex-shrink-0">{formatSize(f.size)}</span>
              <button type="button" onClick={() => onRemove(f.id)} className="text-red-500 hover:text-red-600 cursor-pointer flex-shrink-0">
                移除
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept={acceptFromFormats(config.fileFormats)}
        onChange={(e) => {
          onAdd(e.target.files);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        disabled={remain <= 0}
        onClick={() => inputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-lg py-5 text-center cursor-pointer ${
          remain <= 0 ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed' : 'border-slate-300 bg-slate-50/80 hover:border-emerald-400 hover:bg-emerald-50/30'
        }`}
      >
        <i className="ri-upload-cloud-2-line text-lg text-slate-400 block mb-1" />
        <span className="text-sm text-slate-500">上传文件（还可上传 {remain} 个）</span>
      </button>
    </div>
  );
}

interface Props {
  subtitle: string;
  configs: AttachmentConfig[];
  uploads: LocalUploadMap;
  onChange: (next: LocalUploadMap) => void;
}

/** 档案管理侧：依据档案配置渲染的标准附件上传栏目 */
export default function ArchiveDocUploadSection({ subtitle, configs, uploads, onChange }: Props) {
  const handleAdd = (configId: string, maxCount: number, maxMb: number, fileList: FileList | null) => {
    if (!fileList?.length) return;
    const current = uploads[configId] || [];
    const nextFiles = [...current];
    Array.from(fileList).forEach((file) => {
      if (nextFiles.length >= maxCount) return;
      if (file.size > maxMb * 1024 * 1024) return;
      nextFiles.push({ id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: file.name, size: file.size });
    });
    onChange({ ...uploads, [configId]: nextFiles });
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <i className="ri-attachment-2 text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">附件上传</h3>
        <span className="text-xs text-steel-400 ml-1">{subtitle}</span>
      </div>
      <div className="p-5 space-y-4">
        {configs.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">当前节点暂无附件配置，请先在「项目档案配置」中维护</p>
        ) : (
          configs.map((cfg) => (
            <ConfigCard
              key={cfg.id}
              config={cfg}
              files={uploads[cfg.id] || []}
              onAdd={(fl) => handleAdd(cfg.id, cfg.fileCount, cfg.fileSizeUnit === 'GB' ? cfg.fileSize * 1024 : cfg.fileSize, fl)}
              onRemove={(fid) =>
                onChange({
                  ...uploads,
                  [cfg.id]: (uploads[cfg.id] || []).filter((f) => f.id !== fid),
                })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
