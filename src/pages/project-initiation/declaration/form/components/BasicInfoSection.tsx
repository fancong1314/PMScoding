import { useState } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { projectCategories, projectManagers } from '@/mocks/projectPlans';
import {
  FormSection,
  FormField,
  formRow2Cls,
  formInputCls,
} from '@/components/feature/FormLayout';
import SubmitOrgFields from './SubmitOrgFields';
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

const nextYear = String(new Date().getFullYear() + 1);
const yearOptions = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - 1 + i));

export default function BasicInfoSection({ data, errors, onChange, onPatch, sectionRef }: Props) {
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [managerSearch, setManagerSearch] = useState('');

  const isInPlan = (data.isInPlanProject || '否') === '是';

  const filteredManagers = projectManagers.filter(
    (m) => !managerSearch || m.name.includes(managerSearch) || m.id.includes(managerSearch)
  );

  const patch = (p: Partial<ProjectPlan>) => {
    if (onPatch) onPatch(p);
    else Object.entries(p).forEach(([k, v]) => onChange(k as keyof ProjectPlan, v as string | number));
  };

  const handleSelectManager = (m: (typeof projectManagers)[0]) => {
    patch({ projectManager: m.name, projectManagerPhone: m.phone });
    setShowManagerModal(false);
    setManagerSearch('');
  };

  const handleSelectAnnualPlan = (plan: ProjectPlan) => {
    const no = plan.planNo || plan.annualPlanNo || '';
    patch({
      annualPlanId: plan.id,
      annualPlanNo: no,
      planName: plan.planName || data.planName,
      planYear: plan.planYear || data.planYear,
      businessDivision: plan.businessDivision || data.businessDivision,
      submitDept: plan.submitDept || data.submitDept,
      implementDept: plan.implementDept || data.implementDept,
      projectCategory: plan.projectCategory || data.projectCategory,
      budgetAmount: plan.budgetAmount || data.budgetAmount,
      benefit: plan.benefit ?? data.benefit,
      projectManager: plan.projectManager || data.projectManager,
      projectManagerPhone: plan.projectManagerPhone || data.projectManagerPhone,
      startDate: plan.startDate || data.startDate,
      endDate: plan.endDate || data.endDate,
      hasJobChange: plan.hasJobChange || data.hasJobChange,
      jobChangeCount: plan.jobChangeCount ?? data.jobChangeCount,
    });
    setShowPlanModal(false);
  };

  const absoluteDuration = (() => {
    if (!data.startDate || !data.endDate) return '';
    const [sy, sm] = data.startDate.split('-').map(Number);
    const [ey, em] = data.endDate.split('-').map(Number);
    if (!sy || !sm || !ey || !em) return '';
    const months = (ey - sy) * 12 + (em - sm);
    return months > 0 ? `${months} 个月` : '';
  })();

  return (
    <FormSection
      id="basic-info"
      sectionRef={sectionRef}
      title="项目基本信息"
      subtitle="基础属性与费用信息"
      icon="ri-file-info-line"
    >
      <div className={formRow2Cls}>
        <FormField label="是否计划内项目" required error={errors.isInPlanProject}>
          <select
            value={data.isInPlanProject || '否'}
            onChange={(e) => {
              const v = e.target.value as '是' | '否';
              patch({
                isInPlanProject: v,
                ...(v === '否' ? { annualPlanNo: '', annualPlanId: '' } : {}),
              });
            }}
            className={formInputCls(errors.isInPlanProject) + ' cursor-pointer'}
          >
            <option value="否">否</option>
            <option value="是">是</option>
          </select>
        </FormField>
        <FormField label="是否报批报建" required error={errors.needApprovalPermit}>
          <select
            value={data.needApprovalPermit || ''}
            onChange={(e) => patch({ needApprovalPermit: e.target.value as '是' | '否' })}
            className={formInputCls(errors.needApprovalPermit) + ' cursor-pointer'}
          >
            <option value="">请选择</option>
            <option value="是">是</option>
            <option value="否">否</option>
          </select>
        </FormField>
      </div>
      {isInPlan && (
        <FormField label="年度计划号" required error={errors.annualPlanNo} fullWidth>
          <div
            onClick={() => setShowPlanModal(true)}
            className={`${formInputCls(errors.annualPlanNo)} cursor-pointer flex items-center justify-between`}
          >
            <span className={data.annualPlanNo ? 'text-steel-800 font-mono text-xs' : 'text-steel-400'}>
              {data.annualPlanNo || '点击选择已通过的年度计划'}
            </span>
            <i className="ri-search-line text-primary-500 text-sm" />
          </div>
        </FormField>
      )}

      <SubmitOrgFields data={data} errors={errors} onChange={onChange} onPatch={onPatch} />

      <div className={formRow2Cls}>
        <FormField label="项目类别" required error={errors.projectCategory}>
          <select
            value={data.projectCategory || ''}
            onChange={(e) => onChange('projectCategory', e.target.value)}
            className={formInputCls(errors.projectCategory) + ' cursor-pointer'}
          >
            <option value="">请选择项目类别</option>
            {projectCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>
        <FormField label="计划年度" required error={errors.planYear}>
          <select
            value={data.planYear || nextYear}
            onChange={(e) => onChange('planYear', e.target.value)}
            className={formInputCls(errors.planYear) + ' cursor-pointer'}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
            {!yearOptions.includes(data.planYear || nextYear) && data.planYear && (
              <option value={data.planYear}>{data.planYear}年</option>
            )}
          </select>
        </FormField>
      </div>

      <FormField label="项目名称" required error={errors.planName}>
        <input
          type="text"
          value={data.planName || ''}
          onChange={(e) => onChange('planName', e.target.value)}
          placeholder="请输入项目名称"
          className={formInputCls(errors.planName)}
        />
      </FormField>

      <div className={formRow2Cls}>
        <FormField label="效益(万元)">
          <input
            type="number"
            min={0}
            step={0.01}
            value={data.benefit ?? ''}
            onChange={(e) => onChange('benefit', Number(e.target.value))}
            placeholder="0.00"
            className={formInputCls()}
          />
        </FormField>
        <FormField label="立项总概算(万元)">
          <div className="relative">
            <input
              type="number"
              readOnly
              value={data.budgetAmount ? Number(data.budgetAmount).toFixed(2) : '0.00'}
              className={formInputCls(undefined, { readonly: true }) + ' cursor-not-allowed'}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">由费用概算合计</span>
          </div>
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="涉及岗位增减">
          <select
            value={data.hasJobChange === '是' || data.hasJobChange === '否' ? data.hasJobChange : (data.hasJobChange && data.hasJobChange !== '无' ? '是' : '否')}
            onChange={(e) => {
              const v = e.target.value;
              patch({ hasJobChange: v, ...(v === '否' ? { jobChangeCount: 0 } : {}) });
            }}
            className={formInputCls() + ' cursor-pointer'}
          >
            <option value="否">否</option>
            <option value="是">是</option>
          </select>
        </FormField>
        {(data.hasJobChange === '是' || (data.hasJobChange && data.hasJobChange !== '否' && data.hasJobChange !== '无')) && (
          <FormField label="增减人数" error={errors.jobChangeCount}>
            <input
              type="number"
              value={data.jobChangeCount || ''}
              onChange={(e) => onChange('jobChangeCount', Number(e.target.value))}
              placeholder="负数为减少，正数为增加"
              className={formInputCls(errors.jobChangeCount)}
            />
          </FormField>
        )}
      </div>

      <InvolvedStagesField
        value={data.involvedStages as InvolvedStage[] | undefined}
        onChange={(next) => patch({ involvedStages: next })}
      />

      <div className={formRow2Cls}>
        <FormField label="项目负责人" required error={errors.projectManager}>
          <div
            onClick={() => setShowManagerModal(true)}
            className={`${formInputCls(errors.projectManager)} cursor-pointer flex items-center justify-between`}
          >
            <span className={data.projectManager ? 'text-steel-800' : 'text-steel-400'}>
              {data.projectManager || '点击选择项目负责人'}
            </span>
            <i className="ri-search-line text-primary-500 text-sm" />
          </div>
        </FormField>
        <FormField label="负责人电话">
          <input
            type="text"
            value={data.projectManagerPhone || ''}
            onChange={(e) => onChange('projectManagerPhone', e.target.value)}
            placeholder="选择负责人后自动带出"
            className={formInputCls()}
          />
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="计划开工时间" error={errors.startDate}>
          <input
            type="month"
            value={data.startDate?.length === 10 ? data.startDate.slice(0, 7) : (data.startDate || '')}
            onChange={(e) => onChange('startDate', e.target.value)}
            className={formInputCls(errors.startDate) + ' cursor-pointer'}
          />
        </FormField>
        <FormField label="计划完工时间" error={errors.endDate}>
          <input
            type="month"
            value={data.endDate?.length === 10 ? data.endDate.slice(0, 7) : (data.endDate || '')}
            min={(data.startDate?.length === 10 ? data.startDate.slice(0, 7) : data.startDate) || ''}
            onChange={(e) => onChange('endDate', e.target.value)}
            className={formInputCls(errors.endDate) + ' cursor-pointer'}
          />
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="绝对工期">
          <div className="relative">
            <input
              type="text"
              value={absoluteDuration}
              readOnly
              className={formInputCls(undefined, { readonly: true }) + ' cursor-not-allowed'}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">自动计算</span>
          </div>
        </FormField>
      </div>

      <AnnualPlanSelectModal
        open={showPlanModal}
        selectedId={data.annualPlanId}
        onClose={() => setShowPlanModal(false)}
        onSelect={handleSelectAnnualPlan}
      />

      {showManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowManagerModal(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-[480px] max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
              <h4 className="text-sm font-semibold text-steel-800">选择项目负责人</h4>
              <button onClick={() => setShowManagerModal(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="px-4 py-3 border-b border-steel-100">
              <input
                type="text"
                value={managerSearch}
                onChange={(e) => setManagerSearch(e.target.value)}
                placeholder="输入姓名或工号搜索"
                className={formInputCls()}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredManagers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectManager(m)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 cursor-pointer border-b border-steel-50 ${
                    data.projectManager === m.name ? 'bg-emerald-50' : ''
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 text-white"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-steel-800">{m.name}</div>
                    <div className="text-xs text-steel-400">{m.id} · {m.division}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </FormSection>
  );
}
