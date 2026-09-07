import { useState, useEffect } from 'react';
import type { ProfessionalPickRecord } from '@/mocks/professionalPickMocks';
import { orgUnits } from '@/mocks/professionalPickMocks';

interface PickModalProps {
  open: boolean;
  mode: 'pick' | 'edit';
  record: ProfessionalPickRecord | null;
  onClose: () => void;
  onSubmit: (data: {
    recordId: string;
    deadlineStart: string;
    deadlineEnd: string;
    selectedUnits: { id: string; unitName: string }[];
  }) => void;
}

export default function PickModal({ open, mode, record, onClose, onSubmit }: PickModalProps) {
  const [deadlineStart, setDeadlineStart] = useState('');
  const [deadlineEnd, setDeadlineEnd] = useState('');
  const [units, setUnits] = useState<{ id: string; unitName: string }[]>([]);
  const [errors, setErrors] = useState<{ deadline?: string; units?: string }>({});

  useEffect(() => {
    if (open && record) {
      if (mode === 'edit') {
        setDeadlineStart(record.deadlineStart?.slice(0, 16) || '');
        setDeadlineEnd(record.deadlineEnd?.slice(0, 16) || '');
        setUnits(record.selectedUnits.map((u) => ({ ...u })));
      } else {
        setDeadlineStart('');
        setDeadlineEnd('');
        setUnits([]);
      }
      setErrors({});
    }
  }, [open, record, mode]);

  if (!open || !record) return null;

  const handleAddUnit = () => {
    setUnits((prev) => [
      ...prev,
      { id: `new_${Date.now()}_${prev.length}`, unitName: '' },
    ]);
  };

  const handleDeleteUnit = (id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  };

  const handleUnitChange = (id: string, unitName: string) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, unitName } : u)));
  };

  const handleSubmit = () => {
    const newErrors: { deadline?: string; units?: string } = {};
    if (!deadlineStart || !deadlineEnd) {
      newErrors.deadline = '请选择会审意见签署截至时间';
    }
    if (deadlineStart && deadlineEnd && deadlineStart > deadlineEnd) {
      newErrors.deadline = '开始时间不能晚于结束时间';
    }
    if (units.length === 0) {
      newErrors.units = '请至少选择一个专业单位';
    }
    if (units.some((u) => !u.unitName)) {
      newErrors.units = '请为所有专业单位选择具体部门';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      recordId: record.id,
      deadlineStart,
      deadlineEnd,
      selectedUnits: units,
    });
  };

  const inputCls =
    'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100 flex-shrink-0">
          <h3 className="text-base font-semibold text-steel-900">
            {mode === 'pick' ? '会审专业挑选' : '会审专业修改'}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Basic Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-steel-100">
            <h4 className="text-xs font-semibold text-steel-600 mb-2">基础信息</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-steel-500 block mb-1">论证申请单号</label>
                <input
                  value={record.argumentNo}
                  readOnly
                  className={inputCls + ' bg-steel-100/50 cursor-not-allowed'}
                />
              </div>
              <div>
                <label className="text-xs text-steel-500 block mb-1">论证申请名称</label>
                <input
                  value={record.argumentName}
                  readOnly
                  className={inputCls + ' bg-steel-100/50 cursor-not-allowed'}
                />
              </div>
              <div>
                <label className="text-xs text-steel-500 block mb-1">总师室经办人</label>
                <input value={record.handler} readOnly className={inputCls + ' bg-steel-100/50 cursor-not-allowed'} />
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs text-steel-700 block mb-1.5">
              会审意见签署截至时间 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="datetime-local"
                value={deadlineStart}
                onChange={(e) => {
                  setDeadlineStart(e.target.value);
                  setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 ${
                  errors.deadline ? 'border-red-300' : 'border-steel-200'
                }`}
              />
              <span className="text-steel-400 text-sm flex-shrink-0">至</span>
              <input
                type="datetime-local"
                value={deadlineEnd}
                onChange={(e) => {
                  setDeadlineEnd(e.target.value);
                  setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 ${
                  errors.deadline ? 'border-red-300' : 'border-steel-200'
                }`}
              />
            </div>
            {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
          </div>

          {/* Professional Units */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-steel-700">
                专业单位列表 <span className="text-red-500">*</span>
              </label>
              <button
                onClick={handleAddUnit}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                <div className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className="ri-add-line" />
                </div>
                新增专业单位
              </button>
            </div>
            {errors.units && <p className="text-xs text-red-500 mb-2">{errors.units}</p>}

            {units.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-steel-200">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                  <i className="ri-team-line text-xl text-steel-300" />
                </div>
                <p className="text-sm text-steel-400">暂无可选专业单位，请点击「新增专业单位」添加</p>
              </div>
            ) : (
              <div className="border border-steel-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-steel-200">
                      <th className="px-3 py-2 text-xs font-semibold text-steel-500 w-16">序号</th>
                      <th className="px-3 py-2 text-xs font-semibold text-steel-500">专业单位</th>
                      <th className="px-3 py-2 text-xs font-semibold text-steel-500 w-16 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((unit, idx) => (
                      <tr key={unit.id} className="border-b border-steel-100 last:border-b-0">
                        <td className="px-3 py-2.5 text-sm text-steel-500">{idx + 1}</td>
                        <td className="px-3 py-2.5">
                          <select
                            value={unit.unitName}
                            onChange={(e) => handleUnitChange(unit.id, e.target.value)}
                            className={`w-full px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 cursor-pointer ${
                              errors.units && !unit.unitName ? 'border-red-300' : 'border-steel-200'
                            }`}
                          >
                            <option value="">请选择专业单位</option>
                            {orgUnits.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => handleDeleteUnit(unit.id)}
                            className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer rounded-md hover:bg-red-50 transition-colors"
                            title="删除"
                          >
                            <i className="ri-delete-bin-line text-sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-steel-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            提交
          </button>
        </div>
      </div>
    </div>
  );
}