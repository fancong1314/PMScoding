import { useState } from 'react';
import type { ProjectPlan } from '@/mocks/projectPlans';
import { constructionOrgTree, findOrgParentName, type OrgNode } from '@/mocks/projectPlans';
import { FormField, formRow2Cls, formInputCls } from '@/components/feature/FormLayout';

function OrgTreeItem({
  node,
  depth,
  selected,
  leafOnly,
  onSelect,
}: {
  node: OrgNode;
  depth: number;
  selected: string;
  leafOnly: boolean;
  onSelect: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = !!(node.children && node.children.length > 0);
  const selectable = leafOnly ? !hasChildren : true;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
          selected === node.name && selectable ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-steel-700'
        }`}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={() => {
          if (hasChildren && leafOnly) setExpanded((v) => !v);
          else if (hasChildren && !leafOnly) onSelect(node.name);
          else if (!hasChildren) onSelect(node.name);
          else setExpanded((v) => !v);
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            <i className={`ri-arrow-${expanded ? 'down' : 'right'}-s-line text-steel-400 text-sm`} />
          </button>
        ) : (
          <i className="ri-building-line text-steel-400 text-sm" />
        )}
        <span className="text-sm">{node.name}</span>
        {selected === node.name && selectable && <i className="ri-check-line text-emerald-500 ml-auto text-sm" />}
      </div>
      {hasChildren && expanded &&
        node.children!.map((child) => (
          <OrgTreeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            selected={selected}
            leafOnly={leafOnly}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

interface Props {
  data: Partial<ProjectPlan>;
  errors: Record<string, string>;
  onChange: (field: keyof ProjectPlan, value: string | number) => void;
  onPatch?: (patch: Partial<ProjectPlan>) => void;
}

export default function SubmitOrgFields({ data, errors, onChange, onPatch }: Props) {
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);

  const patch = (p: Partial<ProjectPlan>) => {
    if (onPatch) onPatch(p);
    else Object.entries(p).forEach(([k, v]) => onChange(k as keyof ProjectPlan, v as string | number));
  };

  return (
    <>
      <div className={formRow2Cls}>
        <FormField label="项目提报单位" required error={errors.businessDivision}>
          <div
            onClick={() => setShowUnitModal(true)}
            className={`${formInputCls(errors.businessDivision)} cursor-pointer flex items-center justify-between`}
          >
            <span className={data.businessDivision ? 'text-steel-800' : 'text-steel-400'}>
              {data.businessDivision || '点击从组织架构选择'}
            </span>
            <i className="ri-organization-chart text-steel-400 text-sm" />
          </div>
        </FormField>
        <FormField label="提报部门">
          <input
            type="text"
            readOnly
            value={data.submitDept || ''}
            placeholder="选择提报单位后自动带出"
            className={formInputCls(undefined, { readonly: true })}
          />
        </FormField>
      </div>

      <FormField label="实施主管部门" required error={errors.implementDept}>
        <div
          onClick={() => setShowDeptModal(true)}
          className={`${formInputCls(errors.implementDept)} cursor-pointer flex items-center justify-between`}
        >
          <span className={data.implementDept ? 'text-steel-800' : 'text-steel-400'}>
            {data.implementDept || '点击从组织架构选择部门'}
          </span>
          <i className="ri-organization-chart text-steel-400 text-sm" />
        </div>
      </FormField>

      {showUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowUnitModal(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-[480px] max-h-[70vh] flex flex-col">
            <div className="px-4 py-3 border-b border-steel-100 font-semibold text-sm text-steel-800">
              选择项目提报单位（组织架构）
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {constructionOrgTree.map((n) => (
                <OrgTreeItem
                  key={n.id}
                  node={n}
                  depth={0}
                  selected={data.businessDivision || ''}
                  leafOnly
                  onSelect={(name) => {
                    const parent = findOrgParentName(name);
                    const skip = ['生产制造体系', '工程建设体系', '职能支持体系', '贵港钢铁集团'];
                    patch({
                      businessDivision: name,
                      submitDept: parent && !skip.includes(parent) ? parent : '',
                    });
                    setShowUnitModal(false);
                  }}
                />
              ))}
            </div>
            <p className="px-4 py-2 text-xs text-steel-400 border-t border-steel-100">
              请选择末级单位作为项目提报单位，提报部门将自动带出其上级
            </p>
          </div>
        </div>
      )}

      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowDeptModal(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-[480px] max-h-[70vh] flex flex-col">
            <div className="px-4 py-3 border-b border-steel-100 font-semibold text-sm text-steel-800">
              选择实施主管部门（组织架构）
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {constructionOrgTree.map((n) => (
                <OrgTreeItem
                  key={n.id}
                  node={n}
                  depth={0}
                  selected={data.implementDept || ''}
                  leafOnly={false}
                  onSelect={(name) => {
                    if (['贵港钢铁集团', '生产制造体系', '工程建设体系', '职能支持体系'].includes(name)) return;
                    onChange('implementDept', name);
                    setShowDeptModal(false);
                  }}
                />
              ))}
            </div>
            <p className="px-4 py-2 text-xs text-steel-400 border-t border-steel-100">请手动选择实施主管部门</p>
          </div>
        </div>
      )}
    </>
  );
}
