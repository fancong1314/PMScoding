import { useState } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { projectCategories, projectManagers } from '@/mocks/projectPlans';
import EquipmentSelectModal from './EquipmentSelectModal';
import type { EquipmentItem } from '@/mocks/equipmentMocks';
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

export default function OverhaulFormSection({ data, errors, onChange, onPatch, sectionRef }: Props) {
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [managerSearch, setManagerSearch] = useState('');

  const filteredManagers = projectManagers.filter(
    (m) => !managerSearch || m.name.includes(managerSearch) || m.id.includes(managerSearch)
  );

  const showAssetCode = data.isCapitalOverhaul === '是';

  return (
    <FormSection
      id="overhaul-info"
      sectionRef={sectionRef}
      title="大修项目信息"
      subtitle="大修专项申报字段"
      icon="ri-tools-line"
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
            {projectCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="计划年度" required>
          <select
            value={data.planYear || nextYear}
            onChange={(e) => onChange('planYear', e.target.value)}
            className={formInputCls() + ' cursor-pointer'}
          >
            {yearOptions.map((y) => <option key={y} value={y}>{y}年</option>)}
          </select>
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="是否资本性大修" required>
          <select
            value={data.isCapitalOverhaul || '是'}
            onChange={(e) => {
              onChange('isCapitalOverhaul', e.target.value);
              if (e.target.value !== '是') onChange('fixedAssetCode', '');
            }}
            className={formInputCls() + ' cursor-pointer'}
          >
            <option value="是">是</option>
            <option value="否">否</option>
          </select>
        </FormField>
        {showAssetCode && (
          <FormField label="固定资产编码" required error={errors.fixedAssetCode}>
            <input
              type="text"
              maxLength={32}
              value={data.fixedAssetCode || ''}
              onChange={(e) => onChange('fixedAssetCode', e.target.value.slice(0, 32))}
              placeholder="请输入固定资产编码"
              className={formInputCls(errors.fixedAssetCode)}
            />
            <p className="text-[10px] text-steel-300 text-right mt-0.5">{(data.fixedAssetCode || '').length}/32</p>
          </FormField>
        )}
      </div>

      <FormField label="年度计划名称" required error={errors.planName}>
        <input
          type="text"
          maxLength={100}
          value={data.planName || ''}
          onChange={(e) => onChange('planName', e.target.value.slice(0, 100))}
          placeholder="请输入年度计划名称"
          className={formInputCls(errors.planName)}
        />
        <p className="text-[10px] text-steel-300 text-right mt-0.5">{(data.planName || '').length}/100</p>
      </FormField>

      <div className={formRow2Cls}>
        <FormField label="计划开工时间" required error={errors.startDate}>
          <input
            type="month"
            value={data.startDate || ''}
            onChange={(e) => onChange('startDate', e.target.value)}
            className={formInputCls(errors.startDate) + ' cursor-pointer'}
          />
        </FormField>
        <FormField label="计划完工时间" required error={errors.endDate}>
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
        <FormField label="设备编码">
          <div
            onClick={() => setShowEquipModal(true)}
            className={`${formInputCls()} cursor-pointer flex items-center justify-between`}
          >
            <span className={data.equipmentCode ? 'text-steel-800 truncate' : 'text-steel-400'}>
              {data.equipmentCode || '请选择设备（可多选）'}
            </span>
            <i className="ri-search-line text-primary-500" />
          </div>
        </FormField>
        <FormField label="设备名称">
          <input
            type="text"
            value={data.equipmentName || ''}
            readOnly
            placeholder="由设备选择自动回填"
            className={formInputCls(undefined, { readonly: true })}
          />
        </FormField>
      </div>

      <div className={formRow2Cls}>
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
        <FormField label="维修面积(m²)">
          <input
            type="number"
            min={0}
            step={1}
            value={data.repairArea || ''}
            onChange={(e) => onChange('repairArea', Number(e.target.value))}
            placeholder="请输入维修面积"
            className={formInputCls()}
          />
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="规定大修周期(年)">
          <input
            type="number"
            min={0}
            step={1}
            value={data.overhaulCycleYears || ''}
            onChange={(e) => onChange('overhaulCycleYears', Number(e.target.value))}
            placeholder="请输入周期"
            className={formInputCls()}
          />
        </FormField>
        <FormField label="上次大修竣工日期" required error={errors.lastOverhaulDate}>
          <input
            type="date"
            value={data.lastOverhaulDate || ''}
            onChange={(e) => onChange('lastOverhaulDate', e.target.value)}
            className={formInputCls(errors.lastOverhaulDate) + ' cursor-pointer'}
          />
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="设备投用时间">
          <input
            type="date"
            value={data.equipmentCommissionDate || ''}
            onChange={(e) => onChange('equipmentCommissionDate', e.target.value)}
            className={formInputCls() + ' cursor-pointer'}
          />
        </FormField>
        <FormField label="项目负责人" required error={errors.projectManager}>
          <div
            onClick={() => setShowManagerModal(true)}
            className={`${formInputCls(errors.projectManager)} cursor-pointer flex items-center justify-between`}
          >
            <span className={data.projectManager ? 'text-steel-800' : 'text-steel-400'}>
              {data.projectManager || '点击选择项目负责人'}
            </span>
            <i className="ri-user-search-line text-steel-400" />
          </div>
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="负责人电话">
          <input
            type="text"
            value={data.projectManagerPhone || ''}
            onChange={(e) => onChange('projectManagerPhone', e.target.value)}
            placeholder="选择负责人后自动带入，可修改"
            className={formInputCls()}
          />
        </FormField>
      </div>

      {([
        ['lastOverhaulContent', '上次大修主要内容', true],
        ['overhaulReason', '设备大修理由', true],
        ['overhaulPlanEffect', '大修方案及效果', true],
      ] as const).map(([field, label, required]) => (
        <FormField key={field} label={label} required={required} error={errors[field]} topAlign>
          <textarea
            rows={3}
            maxLength={250}
            value={(data[field] as string) || ''}
            onChange={(e) => onChange(field, e.target.value.slice(0, 250))}
            placeholder={`请输入${label}`}
            className={formInputCls(errors[field]) + ' resize-none'}
          />
          <p className="text-[10px] text-steel-300 text-right mt-0.5">
            {((data[field] as string) || '').length}/250
          </p>
        </FormField>
      ))}

      {showManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowManagerModal(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-[480px] max-h-[70vh] flex flex-col">
            <div className="px-4 py-3 border-b border-steel-100 font-semibold text-sm text-steel-800">选择项目负责人</div>
            <div className="px-4 py-2 border-b border-steel-100">
              <input
                value={managerSearch}
                onChange={(e) => setManagerSearch(e.target.value)}
                placeholder="输入姓名或工号搜索"
                className={formInputCls()}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredManagers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange('projectManager', m.name);
                    onChange('projectManagerPhone', m.phone);
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

      <EquipmentSelectModal
        open={showEquipModal}
        selectedCodes={(data.equipmentCode || '').split(',').map((s) => s.trim()).filter(Boolean)}
        onClose={() => setShowEquipModal(false)}
        onConfirm={(items: EquipmentItem[]) => {
          onChange('equipmentCode', items.map((i) => i.code).join(','));
          onChange('equipmentName', items.map((i) => i.name).join('、'));
        }}
      />
    </FormSection>
  );
}
