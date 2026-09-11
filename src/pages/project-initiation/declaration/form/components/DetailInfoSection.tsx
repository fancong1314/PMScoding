import type { ProjectPlan } from '@/mocks/projectPlans';

interface Props {
  data: Partial<ProjectPlan>;
  onChange: (field: keyof ProjectPlan, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}

const labelCls = 'flex justify-end items-start text-sm text-steel-600 pt-2 whitespace-nowrap';
const textareaCls =
  'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-colors';

function TextArea({
  label,
  field,
  value,
  placeholder,
  required,
  onChange,
  rows = 4,
}: {
  label: string;
  field: keyof ProjectPlan;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (field: keyof ProjectPlan, value: string) => void;
  rows?: number;
}) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
      <label className={labelCls}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          rows={rows}
          maxLength={500}
          placeholder={placeholder}
          className={textareaCls}
        />
        <p className="text-xs text-steel-400 mt-1 text-right">{value.length}/500</p>
      </div>
    </div>
  );
}

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
        <span className="text-xs text-steel-400 ml-1">必要性、可行性、主要内容等</span>
      </div>

      <div className="p-5 space-y-5">
        <TextArea
          label="项目必要性"
          field="necessity"
          value={data.necessity || ''}
          placeholder="主要阐述项目的必要性，500字以内"
          required
          onChange={onChange}
        />
        <TextArea
          label="项目可行性"
          field="projectFeasibility"
          value={data.projectFeasibility || ''}
          placeholder="方案对比、选型、对标、考察情况"
          required
          onChange={onChange}
        />
        <TextArea
          label="项目主要内容"
          field="modificationContent"
          value={data.modificationContent || ''}
          placeholder="项目建设内容，包括工艺布置、设备选型、安全三同时等"
          required
          onChange={onChange}
        />
        <TextArea
          label="主要设备/设施"
          field="deviceFacility"
          value={data.deviceFacility || ''}
          placeholder="材质、寿命、可靠性"
          onChange={onChange}
          rows={3}
        />
        <TextArea
          label="费用估算/需求分析"
          field="costAnalysis"
          value={data.costAnalysis || ''}
          placeholder="请输入费用估算及相关需求分析"
          onChange={onChange}
          rows={3}
        />
      </div>
    </div>
  );
}
