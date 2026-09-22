import { useEffect, useState } from 'react';
import { employees, type Employee, type ProjectGroup } from '@/mocks/projectPrepareMocks';

interface MemberRow {
  id: string;
  searchText: string;
  selectedEmployee: Employee | null;
  memberType: string;
  groupId: string;
  workDuty: string;
  showDropdown: boolean;
}

interface MemberModalProps {
  open: boolean;
  projectName: string;
  approvalNo: string;
  groups: ProjectGroup[];
  onClose: () => void;
  onSubmit: (data: {
    members: { employeeId: string; memberType: string; groupId: string; workDuty: string }[];
  }) => void;
}

const memberTypeOptions = [
  '项目负责人', '合同经办人', '项目创建人', '项目成员', '招标经理', '采购经理',
  '论证经办人', '工程需求资料经办人', '合同预付款申请资料经办人', '合同预结算报支资料经办人', '合同质保金报支资料经办人',
];

const emptyRow = (): MemberRow => ({
  id: `r${Date.now()}`,
  searchText: '',
  selectedEmployee: null,
  memberType: '',
  groupId: '',
  workDuty: '',
  showDropdown: false,
});

export default function MemberModal({ open, projectName, approvalNo, groups, onClose, onSubmit }: MemberModalProps) {
  const [rows, setRows] = useState<MemberRow[]>([emptyRow()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setRows([emptyRow()]);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateSearch = (id: string, text: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, searchText: text, showDropdown: text.trim().length > 0, selectedEmployee: null } : r)),
    );
  };

  const selectEmployee = (rowId: string, emp: Employee) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, selectedEmployee: emp, searchText: `${emp.name}（${emp.employeeNo}）`, showDropdown: false } : r)),
    );
  };

  const patchRow = (id: string, partial: Partial<MemberRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...partial } : r)));
  };

  const getFilteredEmployees = (text: string) => {
    if (!text.trim()) return [];
    const kw = text.toLowerCase();
    return employees.filter((e) => e.name.toLowerCase().includes(kw) || e.employeeNo.toLowerCase().includes(kw)).slice(0, 6);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (groups.length === 0) errs.groups = '请先添加小组后再新增成员';
    rows.forEach((row, i) => {
      if (!row.selectedEmployee) errs[`row_${i}`] = '请选择成员';
      if (!row.memberType) errs[`type_${i}`] = '请选择成员类型';
      if (!row.groupId) errs[`group_${i}`] = '请选择小组';
      if (!row.workDuty.trim()) errs[`duty_${i}`] = '请填写工作职责';
    });
    const seen = new Set<string>();
    rows.forEach((row, i) => {
      if (row.selectedEmployee) {
        if (seen.has(row.selectedEmployee.id)) errs[`dup_${i}`] = '同一成员不能重复添加';
        seen.add(row.selectedEmployee.id);
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      members: rows.map((r) => ({
        employeeId: r.selectedEmployee!.id,
        memberType: r.memberType,
        groupId: r.groupId,
        workDuty: r.workDuty.trim().slice(0, 100),
      })),
    });
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';
  const errorInputCls = 'w-full px-3 py-2 text-sm border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[980px] max-w-[96vw] max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">新增成员</h3>
            <p className="text-xs text-steel-400 mt-0.5">{projectName}（{approvalNo}）</p>
          </div>
          <button type="button" onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-3 border border-steel-100">
            <div>
              <label className="text-xs text-steel-400 block mb-1">项目名称</label>
              <span className="text-sm text-steel-700 font-medium">{projectName}</span>
            </div>
            <div>
              <label className="text-xs text-steel-400 block mb-1">立项号</label>
              <span className="text-sm text-steel-700 font-mono">{approvalNo}</span>
            </div>
          </div>

          {errors.groups && (
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">{errors.groups}</div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-steel-700 font-medium">成员列表</label>
              <button type="button" onClick={addRow} className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 border border-primary-200 rounded hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-add-line" />
                新增成员行
              </button>
            </div>

            <div className="border border-steel-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: 860 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">成员</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">部门</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">成员类型</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">小组</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">工作职责</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-16 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.id} className="border-b border-steel-100 last:border-b-0 align-top">
                      <td className="px-3 py-2.5 relative min-w-[180px]">
                        <input
                          type="text"
                          value={row.searchText}
                          onChange={(e) => updateSearch(row.id, e.target.value)}
                          className={(errors[`row_${idx}`] || errors[`dup_${idx}`]) ? errorInputCls : inputCls}
                          placeholder="输入姓名/工号搜索..."
                        />
                        {row.showDropdown && getFilteredEmployees(row.searchText).length > 0 && (
                          <div className="absolute z-10 left-3 right-3 mt-1 bg-white rounded-lg border border-steel-200 shadow-lg overflow-hidden" style={{ maxHeight: 200, overflowY: 'auto' }}>
                            {getFilteredEmployees(row.searchText).map((emp) => (
                              <button
                                key={emp.id}
                                type="button"
                                onClick={() => selectEmployee(row.id, emp)}
                                className="w-full text-left px-3 py-2 text-sm text-steel-700 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                              >
                                <span>{emp.name}（{emp.employeeNo}）</span>
                                <span className="text-xs text-steel-400">{emp.department}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {(errors[`row_${idx}`] || errors[`dup_${idx}`]) && (
                          <p className="text-xs text-red-500 mt-1">{errors[`row_${idx}`] || errors[`dup_${idx}`]}</p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm text-steel-600">{row.selectedEmployee?.department || '—'}</span>
                      </td>
                      <td className="px-3 py-2.5 min-w-[150px]">
                        <select
                          value={row.memberType}
                          onChange={(e) => patchRow(row.id, { memberType: e.target.value })}
                          className={errors[`type_${idx}`] ? `${errorInputCls} cursor-pointer` : `${inputCls} cursor-pointer`}
                        >
                          <option value="">请选择</option>
                          {memberTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {errors[`type_${idx}`] && <p className="text-xs text-red-500 mt-1">{errors[`type_${idx}`]}</p>}
                      </td>
                      <td className="px-3 py-2.5 min-w-[140px]">
                        <select
                          value={row.groupId}
                          onChange={(e) => patchRow(row.id, { groupId: e.target.value })}
                          className={errors[`group_${idx}`] ? `${errorInputCls} cursor-pointer` : `${inputCls} cursor-pointer`}
                        >
                          <option value="">请选择小组</option>
                          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                        {errors[`group_${idx}`] && <p className="text-xs text-red-500 mt-1">{errors[`group_${idx}`]}</p>}
                      </td>
                      <td className="px-3 py-2.5 min-w-[200px]">
                        <input
                          type="text"
                          maxLength={100}
                          value={row.workDuty}
                          onChange={(e) => patchRow(row.id, { workDuty: e.target.value.slice(0, 100) })}
                          placeholder="请输入工作职责（≤100字）"
                          className={errors[`duty_${idx}`] ? errorInputCls : inputCls}
                        />
                        <p className="text-[10px] text-steel-400 text-right mt-0.5">{row.workDuty.length}/100</p>
                        {errors[`duty_${idx}`] && <p className="text-xs text-red-500">{errors[`duty_${idx}`]}</p>}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length <= 1}
                          className="w-6 h-6 flex items-center justify-center rounded text-steel-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer mx-auto"
                        >
                          <i className="ri-delete-bin-line text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            提交
          </button>
        </div>
      </div>
    </div>
  );
}
