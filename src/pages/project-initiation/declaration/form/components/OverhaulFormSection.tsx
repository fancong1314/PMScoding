import { useMemo, useState } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import {
  businessDivisions,
  overhaulDivisionUnitMap,
  projectManagers,
} from '@/mocks/projectPlans';
import AnnualPlanSelectModal from './AnnualPlanSelectModal';
import InvolvedStagesField from './InvolvedStagesField';
import type { InvolvedStage } from '@/mocks/projectPlans';

interface Props {
  data: Partial<ProjectPlan>;
  errors: Record<string, string>;
  onChange: (field: keyof ProjectPlan, value: string | number) => void;
  onPatch?: (patch: Partial<ProjectPlan>) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}

const labelCls = 'flex justify-end items-center text-sm text-steel-600 pt-2 whitespace-nowrap';
const requiredStar = <span className="text-red-500 ml-0.5">*</span>;
const inputCls = (err?: string) =>
  `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors ${
    err ? 'border-red-300 bg-red-50/30' : 'border-steel-200 bg-white'
  }`;

export default function OverhaulFormSection({ data, errors, onChange, onPatch, sectionRef }: Props) {
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [managerSearch, setManagerSearch] = useState('');

  const isInPlan = (data.isInPlanProject || '否') === '是';
  const unitOptions = useMemo(
    () => overhaulDivisionUnitMap[data.businessDivision || ''] || [],
    [data.businessDivision]
  );

  const filteredManagers = projectManagers.filter(
    (m) => !managerSearch || m.name.includes(managerSearch) || m.id.includes(managerSearch)
  );

  const patch = (p: Partial<ProjectPlan>) => {
    if (onPatch) onPatch(p);
    else Object.entries(p).forEach(([k, v]) => onChange(k as keyof ProjectPlan, v as string | number));
  };

  const handleSelectAnnualPlan = (plan: ProjectPlan) => {
    const no = plan.planNo || plan.annualPlanNo || '';
    patch({
      annualPlanId: plan.id,
      annualPlanNo: no,
      planName: plan.planName || data.planName,
      planYear: plan.planYear || data.planYear,
      businessDivision: plan.businessDivision || data.businessDivision,
      budgetAmount: plan.budgetAmount || data.budgetAmount,
      declareFee: plan.declareFee ?? data.declareFee ?? plan.budgetAmount,
      projectManager: plan.projectManager || data.projectManager,
      projectManagerPhone: plan.projectManagerPhone || data.projectManagerPhone,
      necessity: plan.necessity || data.necessity,
    });
    setShowPlanModal(false);
  };

  const col = 'grid grid-cols-[130px_1fr] gap-3 items-start';

  return (
    <div id="overhaul-info" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
        <i className="ri-file-info-line text-emerald-500" />
        <h3 className="text-sm font-semibold text-steel-800">基本信息</h3>
        <span className="text-xs text-steel-400 ml-1">营缮立项申报基础字段</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className={col}>
            <label className={labelCls}>项目类型{requiredStar}</label>
            <input type="text" value="营缮" readOnly className={inputCls() + ' bg-slate-50 text-steel-600'} />
          </div>
          <div className={col}>
            <label className={labelCls}>是否计划内{requiredStar}</label>
            <div>
              <select
                value={data.isInPlanProject || '否'}
                onChange={(e) => {
                  const v = e.target.value as '是' | '否';
                  patch({
                    isInPlanProject: v,
                    ...(v === '否' ? { annualPlanNo: '', annualPlanId: '' } : {}),
                  });
                }}
                className={inputCls(errors.isInPlanProject) + ' cursor-pointer'}
              >
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
              {errors.isInPlanProject && <p className="mt-1 text-xs text-red-500">{errors.isInPlanProject}</p>}
            </div>
          </div>
        </div>

        {isInPlan && (
          <div className={col}>
            <label className={labelCls}>项目计划号{requiredStar}</label>
            <div>
              <div
                onClick={() => setShowPlanModal(true)}
                className={`${inputCls(errors.annualPlanNo)} cursor-pointer flex items-center justify-between`}
              >
                <span className={data.annualPlanNo ? 'text-steel-800 font-mono text-xs' : 'text-steel-400'}>
                  {data.annualPlanNo || '点击选择已通过的年度计划'}
                </span>
                <i className="ri-search-line text-primary-500 text-sm" />
              </div>
              {errors.annualPlanNo && <p className="mt-1 text-xs text-red-500">{errors.annualPlanNo}</p>}
            </div>
          </div>
        )}

        <div className={col}>
          <label className={labelCls}>项目名称{requiredStar}</label>
          <div>
            <input
              type="text"
              maxLength={100}
              value={data.planName || ''}
              onChange={(e) => onChange('planName', e.target.value.slice(0, 100))}
              placeholder="请输入项目名称"
              className={inputCls(errors.planName)}
            />
            {errors.planName && <p className="mt-1 text-xs text-red-500">{errors.planName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className={col}>
            <label className={labelCls}>事业部{requiredStar}</label>
            <div>
              <select
                value={data.businessDivision || ''}
                onChange={(e) => {
                  const div = e.target.value;
                  const units = overhaulDivisionUnitMap[div] || [];
                  patch({
                    businessDivision: div,
                    ownerUnit: units.includes(data.ownerUnit || '') ? data.ownerUnit : (units[0] || ''),
                  });
                }}
                className={inputCls(errors.businessDivision) + ' cursor-pointer'}
              >
                <option value="">请选择事业部</option>
                {businessDivisions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.businessDivision && <p className="mt-1 text-xs text-red-500">{errors.businessDivision}</p>}
            </div>
          </div>
          <div className={col}>
            <label className={labelCls}>单位{requiredStar}</label>
            <div>
              <select
                value={data.ownerUnit || ''}
                onChange={(e) => onChange('ownerUnit', e.target.value)}
                disabled={!data.businessDivision}
                className={inputCls(errors.ownerUnit) + ' cursor-pointer disabled:bg-slate-50'}
              >
                <option value="">请选择单位</option>
                {unitOptions.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {errors.ownerUnit && <p className="mt-1 text-xs text-red-500">{errors.ownerUnit}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className={col}>
            <label className={labelCls}>是否为资本性营缮{requiredStar}</label>
            <select
              value={data.isCapitalOverhaul || '是'}
              onChange={(e) => onChange('isCapitalOverhaul', e.target.value)}
              className={inputCls(errors.isCapitalOverhaul) + ' cursor-pointer'}
            >
              <option value="是">是</option>
              <option value="否">否</option>
            </select>
          </div>
          <div className={col}>
            <label className={labelCls}>项目负责人{requiredStar}</label>
            <div>
              <div
                onClick={() => setShowManagerModal(true)}
                className={`${inputCls(errors.projectManager)} cursor-pointer flex items-center justify-between`}
              >
                <span className={data.projectManager ? 'text-steel-800' : 'text-steel-400'}>
                  {data.projectManager || '点击选择项目负责人'}
                </span>
                <i className="ri-search-line text-primary-500 text-sm" />
              </div>
              {errors.projectManager && <p className="mt-1 text-xs text-red-500">{errors.projectManager}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className={col}>
            <label className={labelCls}>申报费用(万元)</label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step={1}
                value={data.declareFee ?? ''}
                onChange={(e) => onChange('declareFee', Number(e.target.value))}
                placeholder="0.00"
                className={inputCls() + ' pr-10'}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">万元</span>
            </div>
          </div>
          <div className={col}>
            <label className={labelCls}>项目计划金额(万元)</label>
            <div className="relative">
              <input
                type="number"
                readOnly
                value={data.budgetAmount ? Number(data.budgetAmount).toFixed(2) : '0.00'}
                className={inputCls() + ' pr-24 bg-slate-50 text-steel-500 cursor-not-allowed'}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">由费用概算合计</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[130px_1fr] gap-3 items-center">
          <label className={labelCls}>涉及阶段</label>
          <InvolvedStagesField
            bare
            value={data.involvedStages as InvolvedStage[] | undefined}
            onChange={(next) => patch({ involvedStages: next })}
          />
        </div>

        <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
          <label className={labelCls + ' items-start'}>项目必要性{requiredStar}</label>
          <div>
            <textarea
              rows={4}
              maxLength={500}
              value={data.necessity || ''}
              onChange={(e) => onChange('necessity', e.target.value.slice(0, 500))}
              placeholder="请输入项目必要性"
              className={inputCls(errors.necessity) + ' resize-none'}
            />
            <p className="text-xs text-steel-400 mt-1 text-right">{(data.necessity || '').length}/500</p>
            {errors.necessity && <p className="mt-1 text-xs text-red-500">{errors.necessity}</p>}
          </div>
        </div>
      </div>

      <AnnualPlanSelectModal
        open={showPlanModal}
        selectedId={data.annualPlanId}
        onClose={() => setShowPlanModal(false)}
        onSelect={handleSelectAnnualPlan}
      />

      {showManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowManagerModal(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-[480px] max-h-[70vh] flex flex-col">
            <div className="px-4 py-3 border-b border-steel-100 font-semibold text-sm text-steel-800">选择项目负责人</div>
            <div className="px-4 py-2 border-b border-steel-100">
              <input value={managerSearch} onChange={(e) => setManagerSearch(e.target.value)} placeholder="输入姓名或工号搜索" className={inputCls()} />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredManagers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    patch({ projectManager: m.name, projectManagerPhone: m.phone });
                    setShowManagerModal(false);
                    setManagerSearch('');
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-emerald-50 cursor-pointer"
                >
                  <span className="text-sm font-medium text-steel-800">{m.name}</span>
                  <span className="text-xs text-steel-400 ml-2">{m.id} · {m.division}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






