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

export default function MinorFormSection({ data, errors, onChange, onPatch, sectionRef }: Props) {
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [managerSearch, setManagerSearch] = useState('');

  const isInPlan = (data.isInPlanProject || '否') === '是';
  const showAssetCode = (data.isNewMinor || '否') === '否';

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
      submitDept: plan.submitDept || data.submitDept,
      implementDept: plan.implementDept || data.implementDept,
      projectCategory: plan.projectCategory || data.projectCategory,
      budgetAmount: plan.budgetAmount || data.budgetAmount,
      projectManager: plan.projectManager || data.projectManager,
      projectManagerPhone: plan.projectManagerPhone || data.projectManagerPhone,
      startDate: plan.startDate || data.startDate,
      endDate: plan.endDate || data.endDate,
      equipmentCode: plan.equipmentCode || data.equipmentCode,
      equipmentName: plan.equipmentName || data.equipmentName,
      equipmentStockQty: plan.equipmentStockQty ?? data.equipmentStockQty,
      specModel: plan.specModel || data.specModel,
      measureUnit: plan.measureUnit || data.measureUnit,
      updateQty: plan.updateQty ?? data.updateQty,
      purchaseApplyQty: plan.purchaseApplyQty ?? data.purchaseApplyQty,
      unitPrice: plan.unitPrice ?? data.unitPrice,
      isNewMinor: plan.isNewMinor || data.isNewMinor,
      fixedAssetCode: plan.fixedAssetCode || data.fixedAssetCode,
      updateReason: plan.updateReason || data.updateReason,
    });
    setShowPlanModal(false);
  };

  return (
    <FormSection
      id="minor-info"
      sectionRef={sectionRef}
      title="基本资料维护"
      subtitle="零固专项申报字段"
      icon="ri-box-3-line"
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
        {isInPlan && (
          <FormField label="年度计划号" required error={errors.annualPlanNo}>
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
      </div>

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
        <FormField label="计划年度" required error={errors.planYear}>
          <select
            value={data.planYear || nextYear}
            onChange={(e) => onChange('planYear', e.target.value)}
            className={formInputCls(errors.planYear) + ' cursor-pointer'}
          >
            {yearOptions.map((y) => <option key={y} value={y}>{y}年</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="项目名称" required error={errors.planName}>
        <input
          type="text"
          maxLength={100}
          value={data.planName || ''}
          onChange={(e) => onChange('planName', e.target.value.slice(0, 100))}
          placeholder="请输入项目名称"
          className={formInputCls(errors.planName)}
        />
        <p className="text-[10px] text-steel-300 text-right mt-0.5">{(data.planName || '').length}/100</p>
      </FormField>

      <div className={formRow2Cls}>
        <FormField label="计划开工时间" required error={errors.startDate}>
          <input
            type="month"
            value={data.startDate?.length === 10 ? data.startDate.slice(0, 7) : (data.startDate || '')}
            onChange={(e) => onChange('startDate', e.target.value)}
            className={formInputCls(errors.startDate) + ' cursor-pointer'}
          />
        </FormField>
        <FormField label="计划完工时间" required error={errors.endDate}>
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
        <FormField label="设备编码">
          <div
            onClick={() => setShowEquipModal(true)}
            className={`${formInputCls()} cursor-pointer flex items-center justify-between`}
          >
            <span className={data.equipmentCode ? 'text-steel-800 truncate' : 'text-steel-400'}>
              {data.equipmentCode || '点击搜索并选择设备'}
            </span>
            <i className="ri-search-line text-primary-500" />
          </div>
        </FormField>
        <FormField label="设备名称">
          <input
            type="text"
            value={data.equipmentName || ''}
            readOnly
            placeholder="由设备选择后自动回填"
            className={formInputCls(undefined, { readonly: true })}
          />
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="设备库存数量">
          <input
            type="number"
            readOnly
            value={data.equipmentStockQty ?? ''}
            placeholder="选择设备后自动带出"
            className={formInputCls(undefined, { readonly: true })}
          />
        </FormField>
        <FormField label="规格型号" required error={errors.specModel}>
          <input
            type="text"
            maxLength={100}
            value={data.specModel || ''}
            onChange={(e) => onChange('specModel', e.target.value.slice(0, 100))}
            placeholder="请输入规格型号"
            className={formInputCls(errors.specModel)}
          />
          <p className="text-[10px] text-steel-300 text-right mt-0.5">{(data.specModel || '').length}/100</p>
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="计量单位" required error={errors.measureUnit}>
          <input
            type="text"
            maxLength={25}
            value={data.measureUnit || ''}
            onChange={(e) => onChange('measureUnit', e.target.value.slice(0, 25))}
            placeholder="如：台、套"
            className={formInputCls(errors.measureUnit)}
          />
          <p className="text-[10px] text-steel-300 text-right mt-0.5">{(data.measureUnit || '').length}/25</p>
        </FormField>
        <FormField label="需求数量" required error={errors.updateQty}>
          <input
            type="number"
            min={0}
            step={1}
            value={data.updateQty ?? ''}
            onChange={(e) => onChange('updateQty', Number(e.target.value) || 0)}
            placeholder="0"
            className={formInputCls(errors.updateQty)}
          />
        </FormField>
      </div>

      <div className={formRow2Cls}>
        <FormField label="申请采购数量" required error={errors.purchaseApplyQty}>
          <input
            type="number"
            min={0}
            step={1}
            value={data.purchaseApplyQty ?? ''}
            onChange={(e) => onChange('purchaseApplyQty', Number(e.target.value) || 0)}
            placeholder="0"
            className={formInputCls(errors.purchaseApplyQty)}
          />
        </FormField>
        <FormField label="预估单价(万元)" required error={errors.unitPrice}>
          <input
            type="number"
            min={0}
            step={0.01}
            value={data.unitPrice ?? ''}
            onChange={(e) => onChange('unitPrice', Number(e.target.value) || 0)}
            placeholder="0"
            className={formInputCls(errors.unitPrice)}
          />
        </FormField>
      </div>

      <div className={formRow2Cls}>
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
        <FormField label="是否新增零固" required>
          <select
            value={data.isNewMinor || '否'}
            onChange={(e) => {
              onChange('isNewMinor', e.target.value);
              if (e.target.value === '是') onChange('fixedAssetCode', '');
            }}
            className={formInputCls() + ' cursor-pointer'}
          >
            <option value="否">否</option>
            <option value="是">是</option>
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

      <div className={formRow2Cls}>
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

      <InvolvedStagesField
        value={data.involvedStages as InvolvedStage[] | undefined}
        onChange={(next) => patch({ involvedStages: next })}
      />

      <FormField label="更新理由" required error={errors.updateReason} topAlign>
        <textarea
          rows={3}
          maxLength={250}
          value={data.updateReason || ''}
          onChange={(e) => onChange('updateReason', e.target.value.slice(0, 250))}
          placeholder="请输入更新理由"
          className={formInputCls(errors.updateReason) + ' resize-none'}
        />
        <p className="text-[10px] text-steel-300 text-right mt-0.5">{(data.updateReason || '').length}/250</p>
      </FormField>

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
        multiple={false}
        title="搜索并选择设备明细清单"
        selectedCodes={(data.equipmentCode || '').split(',').map((s) => s.trim()).filter(Boolean)}
        onClose={() => setShowEquipModal(false)}
        onConfirm={(items: EquipmentItem[]) => {
          const item = items[0];
          if (item) {
            onChange('equipmentCode', item.code);
            onChange('equipmentName', item.name);
            onChange('equipmentStockQty', item.stockQty);
            if (item.model) onChange('specModel', item.model);
          } else {
            onChange('equipmentCode', '');
            onChange('equipmentName', '');
            onChange('equipmentStockQty', 0);
          }
        }}
      />
    </FormSection>
  );
}
