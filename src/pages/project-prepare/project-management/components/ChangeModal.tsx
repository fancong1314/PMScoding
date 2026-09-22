import { useState } from 'react';
import { employees, type Employee, type ProjectMember } from '@/mocks/projectPrepareMocks';

// 需要发起变更申请的成员类型
const CHANGE_TYPES_MAP: Record<string, string> = {
  '项目负责人': '项目负责人变更',
  '合同经办人': '合同经办人变更',
  '论证经办人': '论证经办人变更',
  '工程需求资料经办人': '工程需求资料经办人变更',
  '合同预付款申请资料经办人': '合同预付款申请资料经办人变更',
  '合同预结算报支资料经办人': '合同预结算报支资料经办人变更',
  '合同质保金报支资料经办人': '合同质保金报支资料经办人变更',
};

interface ChangeModalProps {
  open: boolean;
  changeType: string;
  projectName: string;
  approvalNo: string;
  currentMember: ProjectMember | null;
  onClose: () => void;
  onSubmit: (data: { newMemberId: string; reason: string }) => void;
}

// 是否为合同经办人类型（需要展示合同信息）
const isContractType = (type: string) =>
  ['合同经办人', '合同预付款申请资料经办人', '合同预结算报支资料经办人', '合同质保金报支资料经办人'].includes(type);

export default function ChangeModal({ open, changeType, projectName, approvalNo, currentMember, onClose, onSubmit }: ChangeModalProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [reason, setReason] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  // 变更类型标签
  const changeTypeLabel = CHANGE_TYPES_MAP[changeType] || `${changeType}变更`;

  const getFilteredEmployees = () => {
    if (!searchText.trim()) return [];
    const kw = searchText.toLowerCase();
    return employees
      .filter((e) => e.id !== currentMember?.id)
      .filter((e) => e.name.toLowerCase().includes(kw) || e.employeeNo.toLowerCase().includes(kw))
      .slice(0, 6);
  };

  const selectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setSearchText(`${emp.name}（${emp.employeeNo}）`);
    setShowDropdown(false);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedEmployee) errs.employee = '请选择新成员';
    if (selectedEmployee && currentMember && selectedEmployee.id === currentMember.id) errs.employee = '新成员不能与原成员相同';
    if (!reason.trim()) errs.reason = '请输入变更原因';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ newMemberId: selectedEmployee!.id, reason });
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';
  const errorInputCls = 'w-full px-3 py-2 text-sm border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30';

  const showContractInfo = currentMember && isContractType(changeType);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[580px] max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">{changeTypeLabel}申请</h3>
            <p className="text-xs text-steel-400 mt-0.5">{projectName}（{approvalNo}）</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* 变更类型 */}
          <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
            <label className="text-xs text-steel-400 block mb-1">变更类型</label>
            <span className="text-sm text-steel-800 font-medium">{changeTypeLabel}</span>
          </div>

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

          {/* 原成员信息 */}
          {currentMember && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <label className="text-xs text-amber-600 block mb-2 font-medium">当前成员</label>
              <div className={`grid gap-3 ${showContractInfo ? 'grid-cols-2' : 'grid-cols-3'}`}>
                <div>
                  <label className="text-xs text-steel-400 block mb-0.5">姓名</label>
                  <span className="text-sm text-steel-800 font-medium">{currentMember.name}</span>
                </div>
                <div>
                  <label className="text-xs text-steel-400 block mb-0.5">工号</label>
                  <span className="text-sm text-steel-600 font-mono">{currentMember.employeeNo}</span>
                </div>
                <div>
                  <label className="text-xs text-steel-400 block mb-0.5">部门</label>
                  <span className="text-sm text-steel-600">{currentMember.department}</span>
                </div>
                {/* 合同相关类型展示合同信息 */}
                {showContractInfo && currentMember.relatedContract && currentMember.relatedContract !== '-' && (
                  <>
                    <div>
                      <label className="text-xs text-steel-400 block mb-0.5">关联合同名称</label>
                      <span className="text-sm text-steel-700">{currentMember.relatedContract}</span>
                    </div>
                    <div>
                      <label className="text-xs text-steel-400 block mb-0.5">关联合同编号</label>
                      <span className="text-sm text-steel-600 font-mono">
                        {`CT-${approvalNo}-${String(Math.abs(currentMember.relatedContract.charCodeAt(0) % 100)).padStart(3, '0')}`}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 新成员选择 */}
          <div className="relative">
            <label className="text-sm text-steel-700 block mb-1.5">新成员选择<span className="text-red-500 ml-1">*</span></label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setShowDropdown(e.target.value.trim().length > 0); setSelectedEmployee(null); }}
              className={errors?.employee ? errorInputCls : inputCls}
              placeholder="输入姓名/工号搜索..."
            />
            {showDropdown && getFilteredEmployees().length > 0 && (
              <div className="absolute z-10 left-0 right-0 mt-1 bg-white rounded-lg border border-steel-200 shadow-lg overflow-hidden" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {getFilteredEmployees().map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => selectEmployee(emp)}
                    className="w-full text-left px-3 py-2 text-sm text-steel-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>{emp.name}（{emp.employeeNo}）</span>
                    <span className="text-xs text-steel-400">{emp.department}</span>
                  </button>
                ))}
              </div>
            )}
            {errors?.employee && <p className="text-xs text-red-500 mt-1">{errors.employee}</p>}
          </div>

          {/* 变更原因 */}
          <div>
            <label className="text-sm text-steel-700 block mb-1.5">变更原因<span className="text-red-500 ml-1">*</span></label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={500}
              className={errors?.reason ? errorInputCls + ' resize-none' : inputCls + ' resize-none'}
              placeholder="请输入变更原因..."
            />
            {errors?.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
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