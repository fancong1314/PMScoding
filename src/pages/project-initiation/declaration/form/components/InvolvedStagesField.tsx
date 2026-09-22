import { FormField } from '@/components/feature/FormLayout';
import {
  INVOLVED_STAGE_OPTIONS,
  type InvolvedStage,
} from '@/mocks/projectPlans';

interface Props {
  value?: InvolvedStage[];
  onChange: (next: InvolvedStage[]) => void;
  /** 营缮等手写布局时关闭 FormField 外壳 */
  bare?: boolean;
}

/** 立项申请 · 涉及阶段（多选） */
export default function InvolvedStagesField({ value, onChange, bare }: Props) {
  const selected = value || [];

  const toggle = (opt: InvolvedStage) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };

  const controls = (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-1.5">
      {INVOLVED_STAGE_OPTIONS.map((opt) => (
        <label
          key={opt}
          className="inline-flex items-center gap-2 text-sm text-steel-700 cursor-pointer select-none"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: '#059669' }}
          />
          {opt}
        </label>
      ))}
    </div>
  );

  if (bare) return controls;

  return <FormField label="涉及阶段">{controls}</FormField>;
}
