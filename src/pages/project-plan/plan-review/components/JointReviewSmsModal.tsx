import { useEffect, useState } from 'react';
import type { PlanReviewRecord } from '@/mocks/planReviewMocks';

interface Props {
  open: boolean;
  record: PlanReviewRecord | null;
  onClose: () => void;
  onSend: (payload: { type: 'opinion' | 'meeting'; personIds: string[] }) => void;
}

function formatDateTime(value?: string) {
  if (!value) return '—';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value.replace('T', ' ');
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${mo}-${day} ${h}:${mi}`;
}

export default function JointReviewSmsModal({ open, record, onClose, onSend }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !record) return;
    setSelected([]);
  }, [open, record]);

  if (!open || !record) return null;

  const participants = record.jointMeeting?.participants || [];
  const allIds = participants.map((p) => p.id);
  const allSelected = allIds.length > 0 && selected.length === allIds.length;
  const indeterminate = selected.length > 0 && selected.length < allIds.length;

  const toggleAll = () => {
    setSelected(allSelected ? [] : allIds);
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSend = (type: 'opinion' | 'meeting') => {
    if (selected.length === 0) {
      alert('请先选择通知人员');
      return;
    }
    onSend({ type, personIds: selected });
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">短信通知</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <i className="ri-information-line text-emerald-600 mt-0.5" />
            <p className="text-xs text-emerald-700 leading-relaxed">请选择通知人员后再选择通知类型</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">年度计划名称</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {record.planName}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">项目提报单位</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {record.businessUnit}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">会审时间</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {formatDateTime(record.jointMeeting?.reviewTime)}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">会审意见截至时间</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {formatDateTime(record.jointMeeting?.opinionDeadline)}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-steel-600 mb-1.5">会审地点</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5 text-sm text-steel-800">
                {record.jointMeeting?.location || '—'}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-steel-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-steel-200">
                  <th className="px-3 py-2.5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = indeterminate;
                      }}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-steel-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">专业单位</th>
                  <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">参会人员</th>
                  <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">是否签署</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-10 text-center text-sm text-steel-400">
                      暂无会审人员
                    </td>
                  </tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p.id} className="border-b border-steel-100">
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(p.id)}
                          onChange={() => toggleOne(p.id)}
                          className="w-4 h-4 rounded border-steel-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-sm text-steel-700">{p.unit || '—'}</td>
                      <td className="px-3 py-2.5 text-sm text-steel-800">{p.personName || '—'}</td>
                      <td className="px-3 py-2.5 text-sm text-steel-600">{p.signed ? '是' : '否'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => handleSend('opinion')}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
          >
            发送会审意见填写通知
          </button>
          <button
            type="button"
            onClick={() => handleSend('meeting')}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
          >
            发送会审通知
          </button>
        </div>
      </div>
    </div>
  );
}
