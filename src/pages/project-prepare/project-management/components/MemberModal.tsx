import { useState } from 'react';
import { employees, type Employee } from '@/mocks/projectPrepareMocks';

interface MemberRow {
  id: string;
  searchText: string;
  selectedEmployee: Employee | null;
  memberType: string;
  showDropdown: boolean;
}

interface MemberModalProps {
  open: boolean;
  projectName: string;
  approvalNo: string;
  onClose: () => void;
  onSubmit: (data: { members: { employeeId: string; memberType: string }[] }) => void;
}

const memberTypeOptions = [
  '项目经理', '合同经办人', '项目创建人', '项目成员', '招标经理', '采购经理',
  '论证经办人', '工程需求资料经办人', '合同预付款申请资料经办人', '合同预结算报支资料经办人', '合同质保金报支资料经办人',
];

export default function MemberModal({ open, projectName, approvalNo, onClose, onSubmit }: MemberModalProps) {
  const [rows, setRows] = useState<MemberRow[]>([
    { id: 'r1', searchText: '', selectedEmployee: null, memberType: '', showDropdown: false },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: `r${Date.now()}`, searchText: '', selectedEmployee: null, memberType: '', showDropdown: false },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateSearch = (id: string, text: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, searchText: text, showDropdown: text.trim().length > 0, selectedEmployee: null } : r))
    );
  };

  const selectEmployee = (rowId: string, emp: Employee) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, selectedEmployee: emp, searchText: `${emp.name}（${emp.employeeNo}）`, showDropdown: false } : r))
    );
  };

  const updateMemberType = (id: string, val: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, memberType: val } : r)));
  };

  const getFilteredEmployees = (text: string) => {
    if (!text.trim()) return [];
    const kw = text.toLowerCase();
    return employees.filter((e) => e.name.toLowerCase().includes(kw) || e.employeeNo.toLowerCase().includes(kw)).slice(0, 6);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    rows.forEach((row, i) => {
      if (!row.selectedEmployee) errs[`row_${i}`] = '请选择成员';
      if (!row.memberType) errs[`type_${i}`] = '请选择成员类型';
    });
    // 重复校验
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
      })),
    });
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';
  const errorInputCls = 'w-full px-3 py-2 text-sm border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[720px] max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">新增成员</h3>
            <p className="text-xs text-steel-400 mt-0.5">{projectName}（{approvalNo}）</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* 项目信息 */}
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

          {/* 成员列表 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-steel-700 font-medium">成员列表</label>
              <button onClick={addRow} className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 border border-primary-200 rounded hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-3 h-3 flex items-center justify-center"><i className="ri-add-line" /></div>
                新增成员行
              </button>
            </div>

            <div className="border border-steel-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">成员</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">部门</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500">成员类型</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-16 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.id} className="border-b border-steel-100 last:border-b-0">
                      <td className="px-3 py-2.5 relative">
                        <input
                          type="text"
                          value={row.searchText}
                          onChange={(e) => updateSearch(row.id, e.target.value)}
                          className={(errors[`row_${idx}`] || errors[`dup_${idx}`]) ? errorInputCls : inputCls}
                          placeholder="输入姓名/工号搜索..."
                        />
                        {row.showDropdown && getFilteredEmployees(row.searchText).length > 0 && (
                          <div className="absolute z-10 left-3 right-3 mt-1 bg-white rounded-lg border border-steel-200 shadow-lg overflow-hidden" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {getFilteredEmployees(row.searchText).map((emp) => (
                              <button
                                key={emp.id}
                                onClick={() => selectEmployee(row.id, emp)}
                                className="w-full text-left px-3 py-2 text-sm text-steel-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
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
                      <td className="px-3 py-2.5">
                        <span className="text-sm text-steel-600">{row.selectedEmployee?.department || '-'}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <select
                          value={row.memberType}
                          onChange={(e) => updateMemberType(row.id, e.target.value)}
                          className={errors[`type_${idx}`] ? errorInputCls + ' cursor-pointer' : inputCls + ' cursor-pointer'}
                        >
                          <option value="">请选择</option>
                          {memberTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {errors[`type_${idx}`] && <p className="text-xs text-red-500 mt-1">{errors[`type_${idx}`]}</p>}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length <= 1}
                          className="w-6 h-6 flex items-center justify-center rounded text-steel-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer mx-auto"
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
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <div className="flex items-center gap-1.5"><i className="ri-send-plane-line" />提交</div>
          </button>
        </div>
      </div>
    </div>
  );
}