import { useState } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { constructionOrgTree, projectCategories, projectManagers, type OrgNode } from '@/mocks/projectPlans';

interface Props {
  data: Partial<ProjectPlan>;
  errors: Record<string, string>;
  onChange: (field: keyof ProjectPlan, value: string | number) => void;
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

export default function BasicInfoSection({ data, errors, onChange, sectionRef }: Props) {
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
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

  const colClass = 'grid grid-cols-[100px_1fr] gap-3 items-start';

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
        {/* 项目单位 + 项目类别 */}
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

        {/* 年度计划名称 */}
        <div className={colClass}>
          <label className={labelCls}>年度计划名称{requiredStar}</label>
          <div>
            <input
              type="text"
              value={data.planName || ''}
              onChange={(e) => onChange('planName', e.target.value)}
              placeholder="请输入年度计划名称"
              className={inputCls(errors.planName)}
            />
            {errors.planName && <p className="mt-1 text-xs text-red-500">{errors.planName}</p>}
          </div>
        </div>

        {/* 效益 + 投资总估算 */}
        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>效益(万元)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={data.benefit || ''}
              onChange={(e) => onChange('benefit', Number(e.target.value))}
              placeholder="0.00"
              className={inputCls()}
            />
          </div>
          <div className={colClass}>
            <label className={labelCls}>投资总估算(万元){requiredStar}</label>
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
        </div>

        {/* 岗位增减 */}
        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>涉及岗位增减</label>
            <select
              value={data.hasJobChange || '否'}
              onChange={(e) => onChange('hasJobChange', e.target.value)}
              className={inputCls() + ' cursor-pointer'}
            >
              <option value="否">否</option>
              <option value="是">是</option>
            </select>
          </div>
          {data.hasJobChange === '是' && (
            <div className={colClass}>
              <label className={labelCls}>增减人数</label>
              <div className="relative">
                <input
                  type="number"
                  value={data.jobChangeCount || ''}
                  onChange={(e) => onChange('jobChangeCount', Number(e.target.value))}
                  placeholder="负数为减少，正数为增加"
                  className={inputCls() + ' pr-8'}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">人</span>
              </div>
            </div>
          )}
        </div>

        {/* 项目负责人 + 电话 */}
        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>项目负责人{requiredStar}</label>
            <div>
              <div
                onClick={() => setShowManagerModal(true)}
                className={`${inputCls(errors.projectManager)} cursor-pointer flex items-center justify-between`}
              >
                <span className={data.projectManager ? 'text-steel-800' : 'text-steel-400'}>
                  {data.projectManager || '点击选择项目负责人'}
                </span>
                <i className="ri-user-search-line text-steel-400 text-sm" />
              </div>
              {errors.projectManager && <p className="mt-1 text-xs text-red-500">{errors.projectManager}</p>}
            </div>
          </div>
          <div className={colClass}>
            <label className={labelCls}>负责人电话</label>
            <input
              type="text"
              value={data.projectManagerPhone || ''}
              onChange={(e) => onChange('projectManagerPhone', e.target.value)}
              placeholder="选择项目负责人后自动带入，可修改"
              className={inputCls()}
            />
          </div>
        </div>

        {/* 计划年度 + 开工 + 完工 */}
        <div className="grid grid-cols-3 gap-x-6">
          <div className="grid grid-cols-[90px_1fr] gap-2 items-start">
            <label className={labelCls + ' text-xs'}>计划年度{requiredStar}</label>
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
          <div className="grid grid-cols-[90px_1fr] gap-2 items-start">
            <label className={labelCls + ' text-xs'}>计划开工</label>
            <input
              type="month"
              value={data.startDate || ''}
              onChange={(e) => onChange('startDate', e.target.value)}
              className={inputCls() + ' cursor-pointer'}
            />
          </div>
          <div className="grid grid-cols-[90px_1fr] gap-2 items-start">
            <label className={labelCls + ' text-xs'}>计划完工</label>
            <input
              type="month"
              value={data.endDate || ''}
              onChange={(e) => onChange('endDate', e.target.value)}
              min={data.startDate || ''}
              className={inputCls(errors.endDate) + ' cursor-pointer'}
            />
            {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
          </div>
        </div>

        {/* 绝对工期 */}
        <div className="grid grid-cols-2 gap-x-8">
          <div className={colClass}>
            <label className={labelCls}>绝对工期</label>
            <div className="relative">
              <input
                type="text"
                value={(() => {
                  if (!data.startDate || !data.endDate) return '';
                  const [sy, sm] = data.startDate.split('-').map(Number);
                  const [ey, em] = data.endDate.split('-').map(Number);
                  const months = (ey - sy) * 12 + (em - sm);
                  return months > 0 ? `${months} 个月` : '';
                })()}
                readOnly
                className={inputCls() + ' bg-slate-100 text-steel-500 cursor-not-allowed'}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">自动计算</span>
            </div>
          </div>
        </div>
      </div>

      {/* 组织架构选择 */}
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

      {/* 项目负责人选择 */}
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
