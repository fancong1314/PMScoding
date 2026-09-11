import { useState } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import {
  calcProjectDurationMonths,
  constructionOrgTree,
  initiationImplementUnits,
  initiationProfessionalUnits,
  projectCategories,
  projectManagers,
  type OrgNode,
} from '@/mocks/projectPlans';
import AnnualPlanSelectModal from './AnnualPlanSelectModal';

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

const nextYear = String(new Date().getFullYear() + 1);
const yearOptions = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - 1 + i));

function OrgTreeItem({
  node,
  depth,
  selected,
  onSelect,
}: {
  node: OrgNode;
  depth: number;
  selected: string;
  onSelect: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = !!(node.children && node.children.length > 0);
  const isLeaf = !hasChildren;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
          selected === node.name && isLeaf ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-steel-700'
        }`}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={() => {
          if (hasChildren) setExpanded((v) => !v);
          else onSelect(node.name);
        }}
      >
        {hasChildren ? (
          <i className={`ri-arrow-${expanded ? 'down' : 'right'}-s-line text-steel-400 text-sm`} />
        ) : (
          <i className="ri-building-line text-steel-400 text-sm" />
        )}
        <span className="text-sm">{node.name}</span>
        {selected === node.name && isLeaf && <i className="ri-check-line text-emerald-500 ml-auto text-sm" />}
      </div>
      {hasChildren && expanded &&
        node.children!.map((child) => (
          <OrgTreeItem key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
        ))}
    </div>
  );
}

export default function BasicInfoSection({ data, errors, onChange, onPatch, sectionRef }: Props) {
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [managerSearch, setManagerSearch] = useState('');

  const isInPlan = (data.isInPlanProject || '否') === '是';
  const jobChange = data.hasJobChange || '无';
  const duration = data.projectDuration ?? calcProjectDurationMonths(data.startDate, data.endDate);

  const filteredManagers = projectManagers.filter(
    (m) => !managerSearch || m.name.includes(managerSearch) || m.id.includes(managerSearch)
  );

  const patchDates = (startDate: string, endDate: string) => {
    const projectDuration = calcProjectDurationMonths(startDate, endDate);
    if (onPatch) onPatch({ startDate, endDate, projectDuration });
    else {
      onChange('startDate', startDate);
      onChange('endDate', endDate);
      onChange('projectDuration', projectDuration);
    }
  };

  const handleSelectManager = (m: (typeof projectManagers)[0]) => {
    if (onPatch) onPatch({ projectManager: m.name, projectManagerPhone: m.phone });
    else {
      onChange('projectManager', m.name);
      onChange('projectManagerPhone', m.phone);
    }
    setShowManagerModal(false);
    setManagerSearch('');
  };

  const handleSelectAnnualPlan = (plan: ProjectPlan) => {
    const no = plan.planNo || plan.annualPlanNo || '';
    const startDate = plan.startDate?.length === 7 ? `${plan.startDate}-01` : (plan.startDate || data.startDate || '');
    const endDate = plan.endDate?.length === 7 ? `${plan.endDate}-28` : (plan.endDate || data.endDate || '');
    const patch: Partial<ProjectPlan> = {
      annualPlanId: plan.id,
      annualPlanNo: no,
      planName: plan.planName,
      planYear: plan.planYear || data.planYear,
      businessDivision: plan.businessDivision || data.businessDivision,
      projectCategory: plan.projectCategory || data.projectCategory,
      budgetAmount: plan.budgetAmount || data.budgetAmount,
      benefit: plan.benefit ?? data.benefit,
      projectManager: plan.projectManager || data.projectManager,
      projectManagerPhone: plan.projectManagerPhone || data.projectManagerPhone,
      startDate,
      endDate,
      projectDuration: calcProjectDurationMonths(startDate, endDate),
      implementUnit: plan.implementUnit || plan.businessDivision || data.implementUnit,
    };
    if (onPatch) onPatch(patch);
    else Object.entries(patch).forEach(([k, v]) => onChange(k as keyof ProjectPlan, v as string | number));
    setShowPlanModal(false);
  };

  const colClass = 'grid grid-cols-[130px_1fr] gap-3 items-start';

  return (
    <div id="basic-info" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-file-info-line text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">项目基本信息</h3>
        <span className="text-xs text-steel-400 ml-1">基础属性与费用信息</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>是否计划内项目{requiredStar}</label>
            <div>
              <select
                value={data.isInPlanProject || '否'}
                onChange={(e) => {
                  const v = e.target.value as '是' | '否';
                  if (onPatch) {
                    onPatch({
                      isInPlanProject: v,
                      ...(v === '否' ? { annualPlanNo: '', annualPlanId: '' } : {}),
                    });
                  } else {
                    onChange('isInPlanProject', v);
                    if (v === '否') {
                      onChange('annualPlanNo', '');
                      onChange('annualPlanId', '');
                    }
                  }
                }}
                className={inputCls(errors.isInPlanProject) + ' cursor-pointer'}
              >
                <option value="否">否</option>
                <option value="是">是</option>
              </select>
              {errors.isInPlanProject && <p className="mt-1 text-xs text-red-500">{errors.isInPlanProject}</p>}
            </div>
          </div>

          {isInPlan && (
            <div className={colClass}>
              <label className={labelCls}>年度计划号{requiredStar}</label>
              <div>
                <div
                  onClick={() => setShowPlanModal(true)}
                  className={`${inputCls(errors.annualPlanNo)} cursor-pointer flex items-center justify-between`}
                >
                  <span className={data.annualPlanNo ? 'text-steel-800 font-mono text-xs' : 'text-steel-400'}>
                    {data.annualPlanNo || '点击选择已通过的年度计划'}
                  </span>
                  <i className="ri-search-line text-steel-400 text-sm" />
                </div>
                {errors.annualPlanNo && <p className="mt-1 text-xs text-red-500">{errors.annualPlanNo}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className={colClass}>
            <label className={labelCls}>项目单位{requiredStar}</label>
            <div>
              <div
                onClick={() => setShowOrgModal(true)}
                className={`${inputCls(errors.businessDivision)} cursor-pointer flex items-center justify-between`}
              >
                <span className={data.businessDivision ? 'text-steel-800' : 'text-steel-400'}>
                  {data.businessDivision || '点击从组织架构选择'}
                </span>
                <i className="ri-organization-chart text-steel-400 text-sm" />
              </div>
              {errors.businessDivision && <p className="mt-1 text-xs text-red-500">{errors.businessDivision}</p>}
            </div>
          </div>
          <div className={colClass}>
            <label className={labelCls}>项目类别{requiredStar}</label>
            <div>
              <select
                value={data.projectCategory || ''}
                onChange={(e) => onChange('projectCategory', e.target.value)}
                className={inputCls(errors.projectCategory) + ' cursor-pointer'}
              >
                <option value="">请选择项目类别</option>
                {projectCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.projectCategory && <p className="mt-1 text-xs text-red-500">{errors.projectCategory}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className={colClass}>
            <label className={labelCls}>实施主管单位{requiredStar}</label>
            <div>
              <select
                value={data.implementUnit || ''}
                onChange={(e) => onChange('implementUnit', e.target.value)}
                className={inputCls(errors.implementUnit) + ' cursor-pointer'}
              >
                <option value="">请选择实施主管单位</option>
                {initiationImplementUnits.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {errors.implementUnit && <p className="mt-1 text-xs text-red-500">{errors.implementUnit}</p>}
            </div>
          </div>
          <div className={colClass}>
            <label className={labelCls}>专业主管单位{requiredStar}</label>
            <div>
              <select
                value={data.professionalUnit || ''}
                onChange={(e) => onChange('professionalUnit', e.target.value)}
                className={inputCls(errors.professionalUnit) + ' cursor-pointer'}
              >
                <option value="">请选择专业主管单位</option>
                {initiationProfessionalUnits.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {errors.professionalUnit && <p className="mt-1 text-xs text-red-500">{errors.professionalUnit}</p>}
            </div>
          </div>
        </div>

        <div className={colClass}>
          <label className={labelCls}>项目名称{requiredStar}</label>
          <div>
            <input
              type="text"
              value={data.planName || ''}
              onChange={(e) => onChange('planName', e.target.value)}
              placeholder="请输入项目名称"
              className={inputCls(errors.planName)}
            />
            {errors.planName && <p className="mt-1 text-xs text-red-500">{errors.planName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>概算总额(万元){requiredStar}</label>
            <div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={data.budgetAmount || ''}
                  onChange={(e) => onChange('budgetAmount', Number(e.target.value))}
                  placeholder="0.00"
                  className={inputCls(errors.budgetAmount) + ' pr-10'}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">万元</span>
              </div>
              {errors.budgetAmount && <p className="mt-1 text-xs text-red-500">{errors.budgetAmount}</p>}
            </div>
          </div>
          <div className={colClass}>
            <label className={labelCls}>效益(万元)</label>
            <div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={data.benefit ?? ''}
                  onChange={(e) => onChange('benefit', Number(e.target.value))}
                  placeholder="0.00"
                  className={inputCls() + ' pr-10'}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">万元</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>计划年度{requiredStar}</label>
            <div>
              <select
                value={data.planYear || nextYear}
                onChange={(e) => onChange('planYear', e.target.value)}
                className={inputCls(errors.planYear) + ' cursor-pointer'}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}年</option>
                ))}
                {!yearOptions.includes(data.planYear || nextYear) && data.planYear && (
                  <option value={data.planYear}>{data.planYear}年</option>
                )}
              </select>
              {errors.planYear && <p className="mt-1 text-xs text-red-500">{errors.planYear}</p>}
            </div>
          </div>
          <div className={colClass}>
            <label className={labelCls}>项目经理{requiredStar}</label>
            <div>
              <div
                onClick={() => setShowManagerModal(true)}
                className={`${inputCls(errors.projectManager)} cursor-pointer flex items-center justify-between`}
              >
                <span className={data.projectManager ? 'text-steel-800' : 'text-steel-400'}>
                  {data.projectManager || '点击选择项目经理'}
                </span>
                <i className="ri-user-search-line text-steel-400 text-sm" />
              </div>
              {errors.projectManager && <p className="mt-1 text-xs text-red-500">{errors.projectManager}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>项目经理电话</label>
            <input
              type="text"
              value={data.projectManagerPhone || ''}
              onChange={(e) => onChange('projectManagerPhone', e.target.value)}
              placeholder="选择项目经理后自动带入，可修改"
              className={inputCls()}
            />
          </div>
          <div className={colClass}>
            <label className={labelCls}>项目工期</label>
            <div className="relative">
              <input
                type="text"
                value={duration > 0 ? String(duration) : ''}
                readOnly
                placeholder="根据开工/完工日期自动计算"
                className={inputCls() + ' pr-10 bg-slate-50'}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">月</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>计划开工日期{requiredStar}</label>
            <div>
              <input
                type="date"
                value={data.startDate || ''}
                onChange={(e) => patchDates(e.target.value, data.endDate || '')}
                className={inputCls(errors.startDate) + ' cursor-pointer'}
              />
              {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
            </div>
          </div>
          <div className={colClass}>
            <label className={labelCls}>计划完工日期{requiredStar}</label>
            <div>
              <input
                type="date"
                value={data.endDate || ''}
                min={data.startDate || ''}
                onChange={(e) => patchDates(data.startDate || '', e.target.value)}
                className={inputCls(errors.endDate) + ' cursor-pointer'}
              />
              {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>是否涉及岗位增减{requiredStar}</label>
            <div>
              <select
                value={jobChange}
                onChange={(e) => {
                  const v = e.target.value;
                  if (onPatch) {
                    onPatch({ hasJobChange: v, ...(v === '无' ? { jobChangeCount: 0 } : {}) });
                  } else {
                    onChange('hasJobChange', v);
                    if (v === '无') onChange('jobChangeCount', 0);
                  }
                }}
                className={inputCls(errors.hasJobChange) + ' cursor-pointer'}
              >
                <option value="无">无</option>
                <option value="增加">增加</option>
                <option value="减少">减少</option>
              </select>
              {errors.hasJobChange && <p className="mt-1 text-xs text-red-500">{errors.hasJobChange}</p>}
            </div>
          </div>
          {jobChange !== '无' && (
            <div className={colClass}>
              <label className={labelCls}>岗位增减人数{requiredStar}</label>
              <div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={data.jobChangeCount || ''}
                    onChange={(e) => onChange('jobChangeCount', Number(e.target.value))}
                    placeholder="请输入人数"
                    className={inputCls(errors.jobChangeCount) + ' pr-10'}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">人</span>
                </div>
                {errors.jobChangeCount && <p className="mt-1 text-xs text-red-500">{errors.jobChangeCount}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnnualPlanSelectModal
        open={showPlanModal}
        selectedId={data.annualPlanId}
        onClose={() => setShowPlanModal(false)}
        onSelect={handleSelectAnnualPlan}
      />

      {showOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowOrgModal(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-[420px] max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
              <h4 className="text-sm font-semibold text-steel-800">选择项目单位（组织架构）</h4>
              <button onClick={() => setShowOrgModal(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {constructionOrgTree.map((node) => (
                <OrgTreeItem
                  key={node.id}
                  node={node}
                  depth={0}
                  selected={data.businessDivision || ''}
                  onSelect={(name) => {
                    onChange('businessDivision', name);
                    setShowOrgModal(false);
                  }}
                />
              ))}
            </div>
            <p className="px-4 py-2 text-xs text-steel-400 border-t border-steel-100">请选择末级部门作为项目单位</p>
          </div>
        </div>
      )}

      {showManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowManagerModal(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-[480px] max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
              <h4 className="text-sm font-semibold text-steel-800">选择项目经理</h4>
              <button onClick={() => setShowManagerModal(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="px-4 py-3 border-b border-steel-100">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                  <i className="ri-search-line text-steel-400 text-sm" />
                </div>
                <input
                  type="text"
                  value={managerSearch}
                  onChange={(e) => setManagerSearch(e.target.value)}
                  placeholder="输入姓名或工号搜索"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredManagers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectManager(m)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 cursor-pointer border-b border-steel-50 transition-colors ${
                    data.projectManager === m.name ? 'bg-emerald-50' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-steel-800">{m.name}</p>
                    <p className="text-xs text-steel-400">{m.id} · {m.division}</p>
                  </div>
                  <span className="text-xs text-steel-500">{m.phone}</span>
                  {data.projectManager === m.name && (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-check-line text-emerald-500" />
                    </div>
                  )}
                </button>
              ))}
              {filteredManagers.length === 0 && (
                <div className="py-10 text-center text-sm text-steel-400">未找到匹配人员</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
