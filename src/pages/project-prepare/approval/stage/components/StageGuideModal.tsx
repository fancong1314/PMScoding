import type { ReactNode } from 'react';
import type { PermitStageDef } from '@/mocks/approvalPermitConfigMocks';

interface Props {
  stage: PermitStageDef;
  onClose: () => void;
}

function Block({
  icon,
  color,
  title,
  children,
}: {
  icon: string;
  color: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-steel-200 overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: '#fafbfd', borderBottom: '1px solid #e8edf3' }}>
        <i className={`${icon} ${color}`} />
        <span className="text-sm font-semibold text-steel-800">{title}</span>
      </div>
      <div className="px-4 py-3 text-sm text-steel-700 whitespace-pre-wrap leading-relaxed">{children}</div>
    </div>
  );
}

export default function StageGuideModal({ stage, onClose }: Props) {
  const g = stage.guide;
  const docs = g.resultFiles.split(/[、，,\n；;]+/).map((s) => s.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[860px] max-w-[96vw] max-h-[88vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-steel-200 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <i className={`${stage.icon} text-xl`} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-steel-800">办理指引 · {stage.name}</h3>
              <p className="text-xs text-steel-400 mt-0.5">按报批报建阶段指引准备资料、明确办结文件与归口部门</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg bg-violet-50 border border-violet-100 px-4 py-3">
              <p className="text-xs text-violet-500 mb-1">办理部门</p>
              <p className="text-sm font-medium text-violet-800">{g.handleDept || '—'}</p>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
              <p className="text-xs text-amber-600 mb-1">政府归口部门</p>
              <p className="text-sm font-medium text-amber-800">{g.govDept || '—'}</p>
            </div>
          </div>

          <Block icon="ri-clipboard-line" color="text-sky-500" title="准备事项">
            {g.prepItems || '—'}
          </Block>

          <div className="rounded-lg border border-steel-200 overflow-hidden bg-white">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: '#fafbfd', borderBottom: '1px solid #e8edf3' }}>
              <i className="ri-file-check-line text-emerald-500" />
              <span className="text-sm font-semibold text-steel-800">办结文件</span>
              <span className="text-xs text-steel-400">办结后上传系统</span>
            </div>
            <div className="px-4 py-3">
              {docs.length === 0 ? (
                <p className="text-sm text-steel-400">暂无办结文件要求</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {docs.map((d) => (
                    <span key={d} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs">
                      <i className="ri-attachment-2" />
                      {d}
                    </span>
                  ))}
                </div>
              )}
              {g.resultFiles && <p className="text-sm text-steel-600 mt-3 whitespace-pre-wrap leading-relaxed">{g.resultFiles}</p>}
            </div>
          </div>

          <Block icon="ri-alert-line" color="text-amber-500" title="注意事项">
            {g.notes || '—'}
          </Block>

          {g.remark && (
            <Block icon="ri-chat-quote-line" color="text-steel-400" title="备注">
              {g.remark}
            </Block>
          )}

          <div className="rounded-lg border border-dashed border-steel-200 px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-steel-800">附件模板</p>
              <p className="text-xs text-steel-400 mt-0.5">{g.templateFile || '本阶段暂无模板文件'}</p>
            </div>
            {g.templateFile && (
              <button
                type="button"
                onClick={() => alert(`开始下载模板：${g.templateFile}`)}
                className="px-3 py-1.5 text-xs text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-download-2-line mr-1" />
                下载模板
              </button>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-steel-200 flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-1.5 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
