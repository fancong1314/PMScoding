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
  onChange,
  rows = 3,
}: {
  label: string;
  field: keyof ProjectPlan;
  value: string;
  placeholder: string;
  onChange: (field: keyof ProjectPlan, value: string) => void;
  rows?: number;
}) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
      <label className={labelCls}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        rows={rows}
        maxLength={500}
        placeholder={placeholder}
        className={textareaCls}
      />
    </div>
  );
}

export default function ProjectTargetSection({ data, onChange, sectionRef }: Props) {
  return (
    <div id="project-target" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-flag-line text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">项目目标</h3>
        <span className="text-xs text-steel-400 ml-1">技术、效益、创新与能源等目标</span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <TextArea label="技术目标" field="techTarget" value={data.techTarget || ''} placeholder="生产/设备/工艺" onChange={onChange} />
          <TextArea label="效益效果" field="benefitTarget" value={data.benefitTarget || ''} placeholder="请输入效益效果" onChange={onChange} />
          <div className="col-span-2">
            <TextArea label="其它目标" field="otherTarget" value={data.otherTarget || ''} placeholder="安全、环保等" onChange={onChange} rows={2} />
          </div>
          <div className="col-span-2">
            <TextArea
              label="创新性、智能数字化"
              field="innovation"
              value={data.innovation || ''}
              placeholder="请输入创新性、智能数字化相关内容"
              onChange={onChange}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="能源提升与评估"
              field="energyAssess"
              value={data.energyAssess || ''}
              placeholder="实施前后能耗的变化，采取的节能降耗措施/新技术"
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
