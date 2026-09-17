import { FormSection, FormField, formRow2Cls, formInputCls } from '@/components/feature/FormLayout';
import { jointReviewPassAttachmentConfigs } from '@/mocks/planReviewMocks';
import { getOverviewJointReviewDetail } from '@/mocks/initiationOverviewMocks';

interface Props {
  overviewId: string;
}

function formatDateTime(value?: string) {
  if (!value) return '—';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value.replace('T', ' ');
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${mo}-${day} ${h}:${mi}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function JointReviewReadonlyTab({ overviewId }: Props) {
  const detail = getOverviewJointReviewDetail(overviewId);
  const { meeting, attachments } = detail;
  const summary = meeting.opinionSummary || '';

  return (
    <div className="space-y-4">
      <FormSection title="会审基本信息" icon="ri-calendar-event-line" subtitle="只读查看，不可编辑">
        <div className={formRow2Cls}>
          <FormField label="会审时间">
            <div className={formInputCls(undefined, { readonly: true })}>
              {formatDateTime(meeting.reviewTime)}
            </div>
          </FormField>
          <FormField label="会审意见截至时间">
            <div className={formInputCls(undefined, { readonly: true })}>
              {formatDateTime(meeting.opinionDeadline)}
            </div>
          </FormField>
          <FormField label="会审地点" fullWidth>
            <div className={formInputCls(undefined, { readonly: true })}>
              {meeting.location || '—'}
            </div>
          </FormField>
        </div>
      </FormSection>

      <FormSection title="会审人员" icon="ri-team-line" subtitle="专业意见自动带入签署结果">
        <div className="overflow-x-auto border border-steel-200 rounded-lg">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-steel-200">
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left w-12">序号</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left w-48">参与人员</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left w-40">专业单位</th>
                <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">专业意见</th>
              </tr>
            </thead>
            <tbody>
              {meeting.participants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center text-sm text-steel-400">暂无会审人员</td>
                </tr>
              ) : (
                meeting.participants.map((row, idx) => (
                  <tr key={row.id} className="border-b border-steel-100">
                    <td className="px-3 py-2.5 text-sm text-steel-500">{idx + 1}</td>
                    <td className="px-3 py-2.5 text-sm text-steel-700">
                      {row.personName}
                      {row.personId ? ` (${row.personId})` : ''}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-steel-600">{row.unit || '—'}</td>
                    <td className="px-3 py-2.5">
                      <div className="px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-600 whitespace-pre-wrap min-h-[52px]">
                        {(row.opinion || '').trim()
                          || (row.signed ? '暂无签署意见' : '尚未签署，无意见可带入')}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="意见汇总" icon="ri-chat-quote-line">
        <FormField label="意见汇总" topAlign fullWidth>
          <div className={`${formInputCls(undefined, { readonly: true })} min-h-[96px] whitespace-pre-wrap leading-relaxed`}>
            {summary || '—'}
          </div>
          <p className="mt-1 text-xs text-steel-400 text-right">{summary.length}/200</p>
        </FormField>
      </FormSection>

      <FormSection
        title="附件上传"
        icon="ri-attachment-2"
        subtitle="依据项目档案配置 · 立项会审 · 意见汇总表与其他附件"
      >
        <div className="space-y-3">
          {jointReviewPassAttachmentConfigs.map((cfg) => {
            const files = attachments[cfg.id] || [];
            return (
              <div key={cfg.id} className="rounded-lg border border-steel-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
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
                    <p className="text-xs text-steel-400 mt-1.5">
                      文件类型：{cfg.fileFormats.join('、')} · 单文件 ≤ {cfg.fileSize}{cfg.fileSizeUnit} · 最多 {cfg.fileCount} 个
                    </p>
                    {cfg.remark && (
                      <p className="text-xs text-amber-700 mt-1.5 bg-amber-50 border border-amber-100 rounded px-2 py-1">
                        <i className="ri-information-line mr-1" />
                        {cfg.remark}
                      </p>
                    )}
                  </div>
                  {cfg.templateFile && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        className="px-2 py-1 text-xs text-steel-600 border border-steel-200 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                        onClick={() => alert(`预览模板：${cfg.templateFile}`)}
                      >
                        预览模板
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
                        onClick={() => alert(`开始下载模板：${cfg.templateFile}`)}
                      >
                        下载模板
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  {files.length === 0 ? (
                    <p className="text-sm text-steel-400 py-3 text-center border border-dashed border-steel-200 rounded-md">
                      暂无已上传附件
                    </p>
                  ) : (
                    files.map((f) => (
                      <div key={f.id} className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50 border border-steel-100">
                        <i className="ri-attachment-2 text-steel-400" />
                        <button
                          type="button"
                          className="text-sm text-sky-600 hover:underline flex-1 truncate text-left cursor-pointer"
                          onClick={() => alert(`预览/下载：${f.name}`)}
                          title="预览或下载"
                        >
                          {f.name}
                        </button>
                        <span className="text-xs text-steel-400">{formatSize(f.size)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </FormSection>
    </div>
  );
}
