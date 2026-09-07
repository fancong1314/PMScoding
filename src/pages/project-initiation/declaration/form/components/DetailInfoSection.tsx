import type { ProjectPlan } from '@/mocks/projectPlans';

interface Props {
  data: Partial<ProjectPlan>;
  onChange: (field: keyof ProjectPlan, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}

const textareaFields: { field: keyof ProjectPlan; label: string; placeholder: string; maxLen?: number }[] = [
  { field: 'currentSituation', label: '现  状', placeholder: '描述项目当前现状、存在问题及背景...' },
  { field: 'necessity',        label: '改造必要性', placeholder: '说明开展本项目改造的必要性、紧迫性...' },
  { field: 'innovation',       label: '项目创新性', placeholder: '阐述项目在技术、工艺、管理等方面的创新点...' },
  { field: 'processDesc',      label: '工艺描述', placeholder: '详细描述项目的主要工艺流程和技术方案...' },
  { field: 'overallIdea',      label: '改造总体思路', placeholder: '说明项目整体实施思路、阶段划分及重点工作...' },
  { field: 'modificationContent', label: '改造主要内容', placeholder: '描述本次改造涉及的主要工程内容和范围...' },
  { field: 'modificationPurpose', label: '改造目的', placeholder: '说明实施本次改造需要达成的具体目标...' },
  { field: 'effectDescription', label: '效果说明/效益计算', placeholder: '描述改造后预期效果及效益计算依据...' },
  { field: 'projectSummary',   label: '项目概要总体描述', placeholder: '请输入项目概要总体描述，最多42个中文字符', maxLen: 42 },
];

export default function DetailInfoSection({ data, onChange, sectionRef }: Props) {
  return (
    <div id="detail-info" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-article-line text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">项目详细信息</h3>
        <span className="text-xs text-steel-400 ml-1">现状分析、必要性及总体思路</span>
      </div>

      <div className="p-5 space-y-4">
        {textareaFields.map(({ field, label, placeholder, maxLen }) => (
          <div key={field as string} className="grid grid-cols-[90px_1fr] gap-3 items-start">
            <label className="flex justify-end items-start text-sm text-steel-600 pt-2 whitespace-nowrap">
              {label}
            </label>
            <div>
              <textarea
                value={(data[field] as string) || ''}
                onChange={(e) => onChange(field, e.target.value)}
                placeholder={placeholder}
                rows={4}
                maxLength={maxLen || 500}
                className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-colors"
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-steel-400">
                  {((data[field] as string) || '').length}/{maxLen || 500}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
