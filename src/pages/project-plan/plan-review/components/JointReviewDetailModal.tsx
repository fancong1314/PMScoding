import { useEffect, useMemo, useState } from 'react';
import {
  jointReviewPersonnel,
  defaultJointMeeting,
} from '@/mocks/planReviewMocks';
import type { PlanReviewRecord, JointReviewMeetingInfo, JointReviewParticipantInfo } from '@/mocks/planReviewMocks';

export interface JointReviewDetailPayload {
  reviewTime: string;
  location: string;
  opinionDeadline: string;
  participants: JointReviewParticipantInfo[];
  sendNotice: boolean;
}

interface Props {
  open: boolean;
  record: PlanReviewRecord | null;
  onClose: () => void;
  onSubmit: (payload: JointReviewDetailPayload) => void;
}

function newRow(): JointReviewParticipantInfo {
  return {
    id: `jp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    personId: '',
    personName: '',
    unit: '',
    opinion: '',
    signed: false,
    signTime: '',
    passResult: '',
    attachments: [],
  };
}

function cloneMeeting(m: JointReviewMeetingInfo): JointReviewMeetingInfo {
  return {
    reviewTime: m.reviewTime,
    location: m.location,
    opinionDeadline: m.opinionDeadline || '',
    opinionSummary: m.opinionSummary || '',
    participants: m.participants.map((p) => ({ ...p, attachments: p.attachments ? [...p.attachments] : [] })),
  };
}

function formatReviewTime(value: string) {
  if (!value) return '—';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value.replace('T', ' ');
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${y}/${mo}/${day} ${h}:${mi}`;
}

export default function JointReviewDetailModal({ open, record, onClose, onSubmit }: Props) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [reviewTime, setReviewTime] = useState('');
  const [location, setLocation] = useState('');
  const [opinionDeadline, setOpinionDeadline] = useState('');
  const [rows, setRows] = useState<JointReviewParticipantInfo[]>([newRow()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [personSearch, setPersonSearch] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const loadFromRecord = (r: PlanReviewRecord) => {
    const base = r.jointMeeting
      ? cloneMeeting(r.jointMeeting)
      : cloneMeeting(defaultJointMeeting(Number(r.zsSortNo) || 0));
    setReviewTime(base.reviewTime);
    setLocation(base.location);
    setOpinionDeadline(base.opinionDeadline || '');
    setRows(base.participants.length > 0 ? base.participants : [newRow()]);
    setPersonSearch(
      Object.fromEntries(
        base.participants
          .filter((p) => p.personId)
          .map((p) => [p.id, `${p.personName} (${p.personId})`])
      )
    );
    setErrors({});
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (!open || !record) return;
    setMode('view');
    loadFromRecord(record);
  }, [open, record]);

  const filteredPeople = useMemo(() => {
    return (keyword: string) => {
      const k = keyword.trim();
      if (!k) return jointReviewPersonnel;
      return jointReviewPersonnel.filter(
        (p) => p.name.includes(k) || p.id.includes(k) || p.unit.includes(k)
      );
    };
  }, []);

  if (!open || !record) return null;

  const isEdit = mode === 'edit';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!reviewTime) e.reviewTime = '请选择会审时间';
    if (!location.trim()) e.location = '请输入会审地点';
    if (!opinionDeadline) e.opinionDeadline = '请选择会审意见截至时间';
    if (rows.length === 0) e.participants = '请至少添加一名会审人员';
    rows.forEach((r, i) => {
      if (!r.personId) e[`row_${r.id}`] = `第 ${i + 1} 行请选择参与人员`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const doSubmit = (sendNotice: boolean) => {
    if (!validate()) return;
    onSubmit({
      reviewTime,
      location: location.trim(),
      opinionDeadline,
      participants: rows,
      sendNotice,
    });
  };

  const selectPerson = (rowId: string, personId: string) => {
    const person = jointReviewPersonnel.find((p) => p.id === personId);
    if (!person) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, personId: person.id, personName: person.name, unit: person.unit }
          : r
      )
    );
    setOpenDropdown(null);
    setErrors((prev) => {
      const n = { ...prev };
      delete n[`row_${rowId}`];
      delete n.participants;
      return n;
    });
  };

  const handleCancelEdit = () => {
    loadFromRecord(record);
    setMode('view');
  };

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
      err ? 'border-red-400 bg-red-50/30' : 'border-steel-200'
    }`;

  const readonlyCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-700';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">
            {isEdit ? '修改会审通知' : '会审详情'}
          </h3>
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
            <p className="text-xs text-emerald-700 leading-relaxed">
              {isEdit
                ? '选择会审人员后，会发送短信通知审人员'
                : '以下为发送专业会审通知时配置的信息，可点击「修改」进行调整'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">年度计划名称</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5">
                <p className="text-sm text-steel-800 leading-relaxed">{record.planName}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">项目提报单位</label>
              <div className="rounded-lg border border-steel-200 bg-slate-50 px-3 py-2.5">
                <p className="text-sm text-steel-800 leading-relaxed">{record.businessUnit}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">
                会审时间 {isEdit && <span className="text-red-500">*</span>}
              </label>
              {isEdit ? (
                <>
                  <input
                    type="datetime-local"
                    value={reviewTime}
                    onChange={(e) => {
                      setReviewTime(e.target.value);
                      if (errors.reviewTime) {
                        setErrors((p) => {
                          const n = { ...p };
                          delete n.reviewTime;
                          return n;
                        });
                      }
                    }}
                    className={inputCls(errors.reviewTime) + ' cursor-pointer'}
                  />
                  {errors.reviewTime && <p className="mt-1 text-xs text-red-500">{errors.reviewTime}</p>}
                </>
              ) : (
                <div className={readonlyCls}>{formatReviewTime(reviewTime)}</div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">
                会审意见截至时间 {isEdit && <span className="text-red-500">*</span>}
              </label>
              {isEdit ? (
                <>
                  <input
                    type="datetime-local"
                    value={opinionDeadline}
                    onChange={(e) => {
                      setOpinionDeadline(e.target.value);
                      if (errors.opinionDeadline) {
                        setErrors((p) => {
                          const n = { ...p };
                          delete n.opinionDeadline;
                          return n;
                        });
                      }
                    }}
                    className={inputCls(errors.opinionDeadline) + ' cursor-pointer'}
                  />
                  {errors.opinionDeadline && <p className="mt-1 text-xs text-red-500">{errors.opinionDeadline}</p>}
                </>
              ) : (
                <div className={readonlyCls}>{formatReviewTime(opinionDeadline)}</div>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-steel-600 mb-1.5">
                会审地点 {isEdit && <span className="text-red-500">*</span>}
              </label>
              {isEdit ? (
                <>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location) {
                        setErrors((p) => {
                          const n = { ...p };
                          delete n.location;
                          return n;
                        });
                      }
                    }}
                    placeholder="请输入"
                    className={inputCls(errors.location)}
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                </>
              ) : (
                <div className={readonlyCls}>{location || '—'}</div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-steel-600">会审人员</label>
              {isEdit && (
                <button
                  type="button"
                  onClick={() => setRows((prev) => [...prev, newRow()])}
                  className="px-3 py-1 text-xs text-white rounded-md cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
                >
                  新增
                </button>
              )}
            </div>
            {errors.participants && <p className="mb-2 text-xs text-red-500">{errors.participants}</p>}
            <div className="rounded-lg border border-steel-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-steel-200">
                    <th className="px-3 py-2 text-xs font-medium text-steel-500 text-left">
                      参与人员 {isEdit && <span className="text-red-500">*</span>}
                    </th>
                    <th className="px-3 py-2 text-xs font-medium text-steel-500 text-left">专业单位</th>
                    {isEdit && (
                      <th className="px-3 py-2 text-xs font-medium text-steel-500 text-center w-20">操作</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={isEdit ? 3 : 2} className="px-3 py-8 text-center text-sm text-steel-400">
                        暂无会审人员
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => {
                      const kw = personSearch[row.id] ?? (row.personName ? `${row.personName} (${row.personId})` : '');
                      const options = filteredPeople(personSearch[row.id] || '');
                      return (
                        <tr key={row.id} className="border-b border-steel-100 align-top">
                          <td className="px-3 py-2 relative">
                            {isEdit ? (
                              <>
                                <div className="relative">
                                  <input
                                    value={kw}
                                    onFocus={() => setOpenDropdown(row.id)}
                                    onChange={(e) => {
                                      setPersonSearch((p) => ({ ...p, [row.id]: e.target.value }));
                                      setOpenDropdown(row.id);
                                      if (row.personId) {
                                        setRows((prev) =>
                                          prev.map((r) =>
                                            r.id === row.id ? { ...r, personId: '', personName: '', unit: '' } : r
                                          )
                                        );
                                      }
                                    }}
                                    placeholder="请选择"
                                    className={inputCls(errors[`row_${row.id}`])}
                                  />
                                  {openDropdown === row.id && (
                                    <div className="absolute z-20 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-steel-200 rounded-md shadow-lg">
                                      {options.map((p) => (
                                        <button
                                          key={p.id}
                                          type="button"
                                          onClick={() => {
                                            selectPerson(row.id, p.id);
                                            setPersonSearch((prev) => ({
                                              ...prev,
                                              [row.id]: `${p.name} (${p.id})`,
                                            }));
                                          }}
                                          className="w-full text-left px-3 py-2 text-sm hover:bg-sky-50 cursor-pointer"
                                        >
                                          {p.name} ({p.id})
                                        </button>
                                      ))}
                                      {options.length === 0 && (
                                        <p className="px-3 py-3 text-xs text-steel-400 text-center">无匹配人员</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {errors[`row_${row.id}`] && (
                                  <p className="mt-1 text-xs text-red-500">{errors[`row_${row.id}`]}</p>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-steel-800">
                                {row.personName ? `${row.personName} (${row.personId})` : '—'}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {isEdit ? (
                              <input
                                value={row.unit}
                                readOnly
                                placeholder="自动带入"
                                className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-500"
                              />
                            ) : (
                              <span className="text-sm text-steel-600">{row.unit || '—'}</span>
                            )}
                          </td>
                          {isEdit && (
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                                className="text-xs text-red-500 hover:underline cursor-pointer"
                              >
                                删除
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50">
          {!isEdit ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
              >
                修改
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => doSubmit(false)}
                className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
              >
                提交
              </button>
              <button
                type="button"
                onClick={() => doSubmit(true)}
                className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
              >
                提交并发送会审通知
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
