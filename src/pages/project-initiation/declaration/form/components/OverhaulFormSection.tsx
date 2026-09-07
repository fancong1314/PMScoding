import { useState } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { constructionOrgTree, projectCategories, projectManagers, type OrgNode } from '@/mocks/projectPlans';
import EquipmentSelectModal from './EquipmentSelectModal';
import type { EquipmentItem } from '@/mocks/equipmentMocks';

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
  node, depth, selected, onSelect,
}: { node: OrgNode; depth: number; selected: string; onSelect: (name: string) => void }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = !!(node.children && node.children.length > 0);
  const isLeaf = !hasChildren;
  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer ${
          selected === node.name && isLeaf ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-steel-700'
        }`}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={() => { if (hasChildren) setExpanded((v) => !v); else onSelect(node.name); }}
      >
        {hasChildren ? <i className={`ri-arrow-${expanded ? 'down' : 'right'}-s-line text-steel-400 text-sm`} /> : <i className="ri-building-line text-steel-400 text-sm" />}
        <span className="text-sm">{node.name}</span>
      </div>
      {hasChildren && expanded && node.children!.map((c) => (
        <OrgTreeItem key={c.id} node={c} depth={depth + 1} selected={selected} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function OverhaulFormSection({ data, errors, onChange, sectionRef }: Props) {
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [managerSearch, setManagerSearch] = useState('');

  const filteredManagers = projectManagers.filter(
    (m) => !managerSearch || m.name.includes(managerSearch) || m.id.includes(managerSearch)
  );

  const col = 'grid grid-cols-[110px_1fr] gap-3 items-start';
  const showAssetCode = data.isCapitalOverhaul === '是';

  return (
    <div id="overhaul-info" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
        <i className="ri-tools-line text-emerald-500" />
        <h3 className="text-sm font-semibold text-steel-800">大修项目信息</h3>
        <span className="text-xs text-steel-400 ml-1">大修专项申报字段</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className={col}>
            <label className={labelCls}>项目单位{requiredStar}</label>
            <div>
              <div onClick={() => setShowOrgModal(true)} className={`${inputCls(errors.businessDivision)} cursor-pointer flex items-center justify-between`}>
                <span className={data.businessDivision ? 'text-steel-800' : 'text-steel-400'}>{data.businessDivision || '点击从组织架构选择'}</span>
                <i className="ri-organization-chart text-steel-400 text-sm" />
              </div>
              {errors.businessDivision && <p className="mt-1 text-xs text-red-500">{errors.businessDivision}</p>}
            </div>
          </div>
          <div className={col}>
            <label className={labelCls}>项目类别{requiredStar}</label>
            <div>
              <select value={data.projectCategory || ''} onChange={(e) => onChange('projectCategory', e.target.value)} className={inputCls(errors.projectCategory) + ' cursor-pointer'}>
                <option value="">请选择项目类别</option>
                {projectCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.projectCategory && <p className="mt-1 text-xs text-red-500">{errors.projectCategory}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
            <label className={labelCls + ' text-xs'}>是否资本性大修{requiredStar}</label>
            <select
              value={data.isCapitalOverhaul || '是'}
              onChange={(e) => {
                onChange('isCapitalOverhaul', e.target.value);
                if (e.target.value !== '是') onChange('fixedAssetCode', '');
              }}
              className={inputCls() + ' cursor-pointer'}
            >
              <option value="是">是</option>
              <option value="否">否</option>
            </select>
          </div>
          {showAssetCode && (
            <div className="grid grid-cols-[110px_1fr] gap-2 items-start">
              <label className={labelCls + ' text-xs'}>固定资产编码{requiredStar}</label>
              <div>
                <input
                  type="text"
                  maxLength={32}
                  value={data.fixedAssetCode || ''}
                  onChange={(e) => onChange('fixedAssetCode', e.target.value.slice(0, 32))}
                  placeholder="请输入固定资产编码"
                  className={inputCls(errors.fixedAssetCode)}
                />
                <p className="text-[10px] text-steel-300 text-right mt-0.5">{(data.fixedAssetCode || '').length}/32</p>
                {errors.fixedAssetCode && <p className="mt-1 text-xs text-red-500">{errors.fixedAssetCode}</p>}
              </div>
            </div>
          )}
          <div className="grid grid-cols-[90px_1fr] gap-2 items-start">
            <label className={labelCls + ' text-xs'}>计划年度{requiredStar}</label>
            <select value={data.planYear || nextYear} onChange={(e) => onChange('planYear', e.target.value)} className={inputCls(errors.planYear) + ' cursor-pointer'}>
              {yearOptions.map((y) => <option key={y} value={y}>{y}年</option>)}
            </select>
          </div>
        </div>

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
            <p className="text-[10px] text-steel-300 text-right mt-0.5">{(data.planName || '').length}/100</p>
            {errors.planName && <p className="mt-1 text-xs text-red-500">{errors.planName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div className={col}>
            <label className={labelCls}>计划开工时间{requiredStar}</label>
            <div>
              <input type="month" value={data.startDate || ''} onChange={(e) => onChange('startDate', e.target.value)} className={inputCls(errors.startDate) + ' cursor-pointer'} />
              {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
            </div>
          </div>
          <div className={col}>
            <label className={labelCls}>计划完工时间{requiredStar}</label>
            <div>
              <input type="month" value={data.endDate || ''} min={data.startDate || ''} onChange={(e) => onChange('endDate', e.target.value)} className={inputCls(errors.endDate) + ' cursor-pointer'} />
              {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div className={col}>
            <label className={labelCls}>设备编码</label>
            <div
              onClick={() => setShowEquipModal(true)}
              className={`${inputCls()} cursor-pointer flex items-center justify-between`}
            >
              <span className={data.equipmentCode ? 'text-steel-800 truncate' : 'text-steel-400'}>
                {data.equipmentCode || '请选择设备（可多选）'}
              </span>
              <i className="ri-search-line text-primary-500" />
            </div>
          </div>
          <div className={col}>
            <label className={labelCls}>设备名称</label>
            <input type="text" value={data.equipmentName || ''} readOnly placeholder="由设备选择自动回填" className={inputCls() + ' bg-slate-50 text-steel-500'} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-6">
          <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
            <label className={labelCls + ' text-xs'}>投资总估算(万元){requiredStar}</label>
            <div>
              <input type="number" min={0} step={1} value={data.budgetAmount || ''} onChange={(e) => onChange('budgetAmount', Number(e.target.value))} placeholder="0.00" className={inputCls(errors.budgetAmount)} />
              {errors.budgetAmount && <p className="mt-1 text-xs text-red-500">{errors.budgetAmount}</p>}
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
            <label className={labelCls + ' text-xs'}>维修面积(m²)</label>
            <input type="number" min={0} step={1} value={data.repairArea || ''} onChange={(e) => onChange('repairArea', Number(e.target.value))} placeholder="请输入维修面积" className={inputCls()} />
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
            <label className={labelCls + ' text-xs'}>规定大修周期(年)</label>
            <input type="number" min={0} step={1} value={data.overhaulCycleYears || ''} onChange={(e) => onChange('overhaulCycleYears', Number(e.target.value))} placeholder="请输入周期" className={inputCls()} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div className={col}>
            <label className={labelCls}>上次大修竣工日期{requiredStar}</label>
            <div>
              <input type="date" value={data.lastOverhaulDate || ''} onChange={(e) => onChange('lastOverhaulDate', e.target.value)} className={inputCls(errors.lastOverhaulDate) + ' cursor-pointer'} />
              {errors.lastOverhaulDate && <p className="mt-1 text-xs text-red-500">{errors.lastOverhaulDate}</p>}
            </div>
          </div>
          <div className={col}>
            <label className={labelCls}>设备投用时间</label>
            <input type="date" value={data.equipmentCommissionDate || ''} onChange={(e) => onChange('equipmentCommissionDate', e.target.value)} className={inputCls() + ' cursor-pointer'} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div className={col}>
            <label className={labelCls}>项目负责人{requiredStar}</label>
            <div>
              <div onClick={() => setShowManagerModal(true)} className={`${inputCls(errors.projectManager)} cursor-pointer flex items-center justify-between`}>
                <span className={data.projectManager ? 'text-steel-800' : 'text-steel-400'}>{data.projectManager || '点击选择项目负责人'}</span>
                <i className="ri-user-search-line text-steel-400" />
              </div>
              {errors.projectManager && <p className="mt-1 text-xs text-red-500">{errors.projectManager}</p>}
            </div>
          </div>
          <div className={col}>
            <label className={labelCls}>负责人电话</label>
            <input
              type="text"
              value={data.projectManagerPhone || ''}
              onChange={(e) => onChange('projectManagerPhone', e.target.value)}
              placeholder="选择负责人后自动带入，可修改"
              className={inputCls()}
            />
          </div>
        </div>

        {([
          ['lastOverhaulContent', '上次大修主要内容', true],
          ['overhaulReason', '设备大修理由', true],
          ['overhaulPlanEffect', '大修方案及效果', true],
        ] as const).map(([field, label, required]) => (
          <div key={field} className="grid grid-cols-[120px_1fr] gap-3 items-start">
            <label className={labelCls}>{label}{required && requiredStar}</label>
            <div>
              <textarea
                rows={3}
                maxLength={250}
                value={(data[field] as string) || ''}
                onChange={(e) => onChange(field, e.target.value.slice(0, 250))}
                placeholder={`请输入${label}`}
                className={inputCls(errors[field]) + ' resize-none'}
              />
              <p className="text-[10px] text-steel-300 text-right mt-0.5">{((data[field] as string) || '').length}/250</p>
              {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
            </div>
          </div>
        ))}
      </div>

      {showOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowOrgModal(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-[420px] max-h-[70vh] flex flex-col">
            <div className="px-4 py-3 border-b border-steel-100 font-semibold text-sm text-steel-800">选择项目单位</div>
            <div className="flex-1 overflow-y-auto p-3">
              {constructionOrgTree.map((n) => (
                <OrgTreeItem key={n.id} node={n} depth={0} selected={data.businessDivision || ''} onSelect={(name) => { onChange('businessDivision', name); setShowOrgModal(false); }} />
              ))}
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
