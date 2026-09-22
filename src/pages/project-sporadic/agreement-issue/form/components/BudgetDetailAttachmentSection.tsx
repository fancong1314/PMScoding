import { useMemo } from 'react';
import { getSporadicBudgetUploadAttachmentConfigs } from '@/mocks/archiveConfigMocks';
import type { SporadicAttachmentMap } from '@/mocks/sporadicProjectMocks';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  uploads: SporadicAttachmentMap;
  sectionRef?: (el: HTMLDivElement | null) => void;
}

/** 签发/详情页 · 预算明细表附件（只读展示） */
export default function BudgetDetailAttachmentSection({ uploads, sectionRef }: Props) {
  const configs = useMemo(() => getSporadicBudgetUploadAttachmentConfigs(), []);

  return (
    <div id="budget-attachment" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-attachment-2 text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">附件上传</h3>
        <span className="text-xs text-steel-400 ml-1">
          依据项目档案配置 · 零星协议单审查 · 预算上传
        </span>
      </div>

      <div className="p-5 space-y-3">
        {configs.length === 0 ? (
          <div className="py-8 text-center text-sm text-steel-400">暂无预算明细表附件配置</div>
        ) : (
          configs.map((cfg) => {
            const files = uploads[cfg.id] || [];
            return (
              <div key={cfg.id} className="rounded-lg border border-steel-200 bg-white p-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h4 className="text-sm font-semibold text-steel-800">{cfg.docName}</h4>
                  {cfg.required ? (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-50 text-red-600 border border-red-100">必填</span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-steel-500 border border-steel-100">选填</span>
                  )}
                  {cfg.archived ? (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-50 text-emerald-600 border border-emerald-100">存档</span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-steel-400 border border-steel-100">不存档</span>
                  )}
                </div>
                <p className="text-xs text-steel-400 mb-3">
                  文件类型：{cfg.fileFormats.join('、')} · 单文件 ≤ {cfg.fileSize}{cfg.fileSizeUnit} · 最多 {cfg.fileCount} 个
                </p>
                {cfg.remark && (
                  <p className="text-xs text-amber-700 mb-3 bg-amber-50 border border-amber-100 rounded px-2 py-1">
                    <i className="ri-information-line mr-1" />
                    {cfg.remark}
                  </p>
                )}
                {files.length === 0 ? (
                  <p className="text-sm text-steel-400 py-3 text-center border border-dashed border-steel-200 rounded-md">
                    暂无已上传附件
                  </p>
                ) : (
                  <div className="space-y-2">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
