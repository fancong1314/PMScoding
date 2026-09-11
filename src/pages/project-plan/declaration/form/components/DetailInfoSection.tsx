import type { ProjectPlan } from '@/mocks/projectPlans';
import { FormSection, FormField, formInputCls } from '@/components/feature/FormLayout';

interface Props {
  data: Partial<ProjectPlan>;
  onChange: (field: keyof ProjectPlan, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}

const textareaFields: { field: keyof ProjectPlan; label: string; placeholder: string; maxLen?: number }[] = [
  { field: 'currentSituation', label: '现状', placeholder: '描述项目当前现状、存在问题及背景...' },
  { field: 'necessity', label: '改造必要性', placeholder: '说明开展本项目改造的必要性、紧迫性...' },
  { field: 'innovation', label: '项目创新性', placeholder: '阐述项目在技术、工艺、管理等方面的创新点...' },
  { field: 'processDesc', label: '工艺描述', placeholder: '详细描述项目的主要工艺流程和技术方案...' },
  { field: 'overallIdea', label: '改造总体思路', placeholder: '说明项目整体实施思路、阶段划分及重点工作...' },
  { field: 'modificationContent', label: '改造主要内容', placeholder: '描述本次改造涉及的主要工程内容和范围...' },
  { field: 'modificationPurpose', label: '改造目的', placeholder: '说明实施本次改造需要达成的具体目标...' },
  { field: 'effectDescription', label: '效果说明/效益计算', placeholder: '描述改造后预期效果及效益计算依据...' },
  { field: 'equipmentDesc', label: '设备装备描述', placeholder: '请描述主要设备及装备配置情况...', maxLen: 1000 },
  { field: 'projectSummary', label: '项目总体结论', placeholder: '请输入项目总体结论', maxLen: 500 },
];

export default function DetailInfoSection({ data, onChange, sectionRef }: Props) {
  return (
    <FormSection
      id="detail-info"
      sectionRef={sectionRef}
      title="项目详细信息"
      subtitle="现状分析、必要性及总体思路"
      icon="ri-article-line"
    >
      {textareaFields.map(({ field, label, placeholder, maxLen }) => {
        const limit = maxLen || 500;
        const value = (data[field] as string) || '';
        return (
          <FormField key={field as string} label={label} topAlign>
            <textarea
              value={value}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={placeholder}
              rows={4}
              maxLength={limit}
              className={formInputCls() + ' resize-none'}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-steel-400">{value.length}/{limit}</span>
            </div>
          </FormField>
        );
      })}
    </FormSection>
  );
}
