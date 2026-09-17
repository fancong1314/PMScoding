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
  const [managerSearch, setManagerSearch] = useState('');

  const filteredManagers = projectManagers.filter(
    (m) => !managerSearch || m.name.includes(managerSearch) || m.id.includes(managerSearch)
  );

  const handleSelectManager = (m: (typeof projectManagers)[0]) => {
    onChange('projectManager', m.name);
    onChange('projectManagerPhone', m.phone);
    setShowManagerModal(false);
    setManagerSearch('');
  };

  const absoluteDuration = (() => {
    if (!data.startDate || !data.endDate) return '';
    const [sy, sm] = data.startDate.split('-').map(Number);
    const [ey, em] = data.endDate.split('-').map(Number);
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
        <FormField label="计划年度" required>
          <select
            value={data.planYear || nextYear}
            onChange={(e) => onChange('planYear', e.target.value)}
            className={formInputCls() + ' cursor-pointer'}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="年度计划名称" required error={errors.planName}>
        <input
          type="text"
          value={data.planName || ''}
          onChange={(e) => onChange('planName', e.target.value)}
          placeholder="请输入年度计划名称"
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
        <FormField label="投资总估算(万元)">
          <div className="relative">
            <input
              type="number"
              readOnly
              value={data.budgetAmount ? Number(data.budgetAmount).toFixed(2) : '0.00'}
              className={formInputCls(undefined, { readonly: true }) + ' cursor-not-allowed'}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">由投资估算合计</span>
          </div>
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="涉及岗位增减">
          <select
            value={data.hasJobChange || '否'}
            onChange={(e) => onChange('hasJobChange', e.target.value)}
            className={formInputCls() + ' cursor-pointer'}
          >
            <option value="否">否</option>
            <option value="是">是</option>
          </select>
        </FormField>
        {data.hasJobChange === '是' && (
          <FormField label="增减人数">
            <input
              type="number"
              value={data.jobChangeCount || ''}
              onChange={(e) => onChange('jobChangeCount', Number(e.target.value))}
              placeholder="负数为减少，正数为增加"
              className={formInputCls()}
            />
          </FormField>
        )}
      </div>

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
        <FormField label="计划开工时间">
          <input
            type="month"
            value={data.startDate || ''}
            onChange={(e) => onChange('startDate', e.target.value)}
            className={formInputCls(errors.startDate) + ' cursor-pointer'}
          />
        </FormField>
        <FormField label="计划完工时间" error={errors.endDate}>
          <input
            type="month"
            value={data.endDate || ''}
            min={data.startDate || ''}
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

      <FormField label="补充实施理由" topAlign>
        <textarea
          rows={3}
          maxLength={500}
          value={data.supplementNote || ''}
          onChange={(e) => onChange('supplementNote', e.target.value.slice(0, 500))}
          placeholder="请输入补充实施理由"
          className={formInputCls() + ' resize-none'}
        />
      </FormField>

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
                className={formInputCls(undefined, { readonly: true })}
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
