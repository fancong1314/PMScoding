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
  rows = 2,
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

export default function AuxFacilitySection({ data, onChange, sectionRef }: Props) {
  return (
    <div id="aux-facility" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-flashlight-line text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">公辅配套</h3>
        <span className="text-xs text-steel-400 ml-1">水、电、气等公辅配套要求</span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <TextArea label="水" field="auxWater" value={data.auxWater || ''} placeholder="对水、电、气/汽等公辅的配套要求" onChange={onChange} />
          <TextArea label="电" field="auxElec" value={data.auxElec || ''} placeholder="请输入" onChange={onChange} />
          <TextArea label="燃气" field="auxGas" value={data.auxGas || ''} placeholder="请输入" onChange={onChange} />
          <TextArea label="氧气/氩气（汽）" field="auxOxygen" value={data.auxOxygen || ''} placeholder="请输入" onChange={onChange} />
          <div className="col-span-2">
            <TextArea label="其他" field="auxOther" value={data.auxOther || ''} placeholder="请输入其他公辅配套需求" onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
