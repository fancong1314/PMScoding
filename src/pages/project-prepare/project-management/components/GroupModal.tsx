import { useState } from 'react';
import { FormField, formInputCls } from '@/components/feature/FormLayout';

interface Props {
  open: boolean;
  projectName: string;
  onClose: () => void;
  onSubmit: (data: { name: string; workDuty: string }) => void;
}

/** 添加小组弹窗 */
export default function GroupModal({ open, projectName, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [workDuty, setWorkDuty] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = '请输入小组名称';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSubmit({ name: name.trim(), workDuty: workDuty.trim().slice(0, 100) });
    setName('');
    setWorkDuty('');
    setErrors({});
  };

  const handleClose = () => {
    setName('');
    setWorkDuty('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[520px] max-w-[95vw]">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">添加小组</h3>
            <p className="text-xs text-steel-400 mt-0.5">{projectName}</p>
          </div>
          <button type="button" onClick={handleClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <FormField label="小组名称" required error={errors.name}>
            <input
              type="text"
              value={name}
              maxLength={40}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              placeholder="请输入小组名称"
              className={formInputCls(errors.name)}
            />
          </FormField>
          <FormField label="工作职责" topAlign>
            <textarea
              rows={4}
              maxLength={100}
              value={workDuty}
              onChange={(e) => setWorkDuty(e.target.value.slice(0, 100))}
              placeholder="请输入小组工作职责（选填，100字以内）"
              className={formInputCls() + ' resize-none'}
            />
            <p className="text-xs text-steel-400 text-right mt-1">{workDuty.length}/100</p>
          </FormField>
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3">
          <button type="button" onClick={handleClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
