import { useEffect, useMemo, useRef, useState } from 'react';
import {
  defaultJointMeeting,
  jointReviewPassAttachmentConfigs,
  jointReviewPersonnel,
  type JointReviewMeetingInfo,
  type JointReviewParticipantInfo,
  type PlanReviewRecord,
} from '@/mocks/planReviewMocks';

export interface JointReviewPassPayload {
  meeting: JointReviewMeetingInfo;
  attachments: Record<string, { id: string; name: string; size: number }[]>;
}

interface Props {
  open: boolean;
  record: PlanReviewRecord | null;
  onClose: () => void;
  onConfirm: (payload: JointReviewPassPayload) => void;
}

type UploadedFile = { id: string; name: string; size: number };
type UploadMap = Record<string, UploadedFile[]>;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function acceptFromFormats(formats: string[]) {
  const map: Record<string, string> = {
    PDF: '.pdf',
    'Word(doc/docx)': '.doc,.docx',
    'Excel(xls/xlsx)': '.xls,.xlsx',
    '图片(jpg/png/bmp)': '.jpg,.jpeg,.png,.bmp',
  };
  return formats.map((f) => map[f] || '').filter(Boolean).join(',') || undefined;
}

function newParticipant(): JointReviewParticipantInfo {
  return {
    id: `jp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    personId: '',
    personName: '',
    unit: '',
    opinion: '',
  };
}

function cloneMeeting(src: JointReviewMeetingInfo): JointReviewMeetingInfo {
  return {
    reviewTime: src.reviewTime,
    location: src.location,
    opinionDeadline: src.opinionDeadline || '',
    opinionSummary: src.opinionSummary || '',
    participants: src.participants.map((p) => ({
      ...p,
      // 专业意见自动带入参与人员已填写的签署意见
      opinion: (p.opinion || '').trim(),
      attachments: p.attachments ? [...p.attachments] : [],
    })),
  };
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

export default function JointReviewPassModal({ open, record, onClose, onConfirm }: Props) {
  const [reviewTime, setReviewTime] = useState('');
  const [location, setLocation] = useState('');
  const [opinionDeadline, setOpinionDeadline] = useState('');
  const [rows, setRows] = useState<JointReviewParticipantInfo[]>([newParticipant()]);
  const [opinionSummary, setOpinionSummary] = useState('');
  const [uploads, setUploads] = useState<UploadMap>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [personSearch, setPersonSearch] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !record) return;
    const base = record.jointMeeting
      ? cloneMeeting(record.jointMeeting)
      : cloneMeeting(defaultJointMeeting(Number(record.zsSortNo) || 0));
    setReviewTime(base.reviewTime);
    setLocation(base.location);
    setOpinionDeadline(base.opinionDeadline || '');
    setRows(base.participants.length > 0 ? base.participants : [newParticipant()]);
    setOpinionSummary(base.opinionSummary || '');
    setUploads({});
    setErrors({});
    setPersonSearch(
      Object.fromEntries(
        base.participants
          .filter((p) => p.personId)
          .map((p) => [p.id, `${p.personName} (${p.personId})`])
      )
    );
    setOpenDropdown(null);
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

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
      err ? 'border-red-400 bg-red-50/30' : 'border-steel-200'
    }`;

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

  const handleAddFiles = (configId: string, maxCount: number, maxMb: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const current = uploads[configId] || [];
    const remain = Math.max(0, maxCount - current.length);
    const maxBytes = maxMb * 1024 * 1024;
    const nextFiles = [...current];
    Array.from(fileList).slice(0, remain).forEach((file) => {
      if (file.size > maxBytes) {
        alert(`「${file.name}」超过大小限制 ${maxMb}MB`);
        return;
      }
      nextFiles.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
      });
    });
    setUploads((prev) => ({ ...prev, [configId]: nextFiles }));
    setErrors((prev) => {
      const n = { ...prev };
      delete n[`attach_${configId}`];
      return n;
    });
  };

  const handleRemoveFile = (configId: string, fileId: string) => {
    setUploads((prev) => ({
      ...prev,
      [configId]: (prev[configId] || []).filter((f) => f.id !== fileId),
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!reviewTime) e.reviewTime = '请选择会审时间';
    if (!location.trim()) e.location = '请输入会审地点';
    if (rows.length === 0) e.participants = '请至少添加一名会审人员';
    rows.forEach((r, i) => {
      if (!r.personId) e[`row_${r.id}`] = `第 ${i + 1} 行请选择参与人员`;
    });
    if (opinionSummary.length > 200) e.opinionSummary = '意见汇总不超过 200 字';
    jointReviewPassAttachmentConfigs.forEach((cfg) => {
      if (cfg.required && !(uploads[cfg.id] || []).length) {
        e[`attach_${cfg.id}`] = `请上传「${cfg.docName}」`;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    onConfirm({
      meeting: {
        reviewTime,
        location: location.trim(),
        opinionDeadline,
        participants: rows.map((r) => ({ ...r, opinion: (r.opinion || '').trim() })),
        opinionSummary: opinionSummary.trim(),
      },
      attachments: uploads,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">会审通过确认</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">
                会审时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={reviewTime}
                onChange={(e) => {
                  setReviewTime(e.target.value);
                  if (errors.reviewTime) setErrors((p) => { const n = { ...p }; delete n.reviewTime; return n; });
                }}
                className={inputCls(errors.reviewTime) + ' cursor-pointer'}
              />
              {errors.reviewTime && <p className="mt-1 text-xs text-red-500">{errors.reviewTime}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-600 mb-1.5">会审意见截至时间</label>
              <div className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-700">
                {formatDateTime(opinionDeadline)}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-steel-600 mb-1.5">
                会审地点 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((p) => { const n = { ...p }; delete n.location; return n; });
                }}
                placeholder="请输入"
                className={inputCls(errors.location)}
              />
              {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-steel-600">会审人员</label>
              <button
                type="button"
                onClick={() => setRows((prev) => [...prev, newParticipant()])}
                className="px-3 py-1 text-xs text-white rounded-md cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
              >
                新增
              </button>
            </div>
            {errors.participants && <p className="mb-2 text-xs text-red-500">{errors.participants}</p>}
            <div className="rounded-lg border border-steel-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-steel-200">
                    <th className="px-3 py-2 text-xs font-medium text-steel-500 text-left w-[28%]">参与人员 <span className="text-red-500">*</span></th>
                    <th className="px-3 py-2 text-xs font-medium text-steel-500 text-left w-[18%]">专业单位</th>
                    <th className="px-3 py-2 text-xs font-medium text-steel-500 text-left">专业意见（自动带入）</th>
                    <th className="px-3 py-2 text-xs font-medium text-steel-500 text-center w-16">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const kw = personSearch[row.id] ?? (row.personName ? `${row.personName} (${row.personId})` : '');
                    const options = filteredPeople(personSearch[row.id] || '');
                    return (
                      <tr key={row.id} className="border-b border-steel-100 align-top">
                        <td className="px-3 py-2 relative">
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
                                      r.id === row.id
                                        ? { ...r, personId: '', personName: '', unit: '', opinion: r.opinion }
                                        : r
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
                                      setPersonSearch((prev) => ({ ...prev, [row.id]: `${p.name} (${p.id})` }));
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
                          {errors[`row_${row.id}`] && <p className="mt-1 text-xs text-red-500">{errors[`row_${row.id}`]}</p>}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={row.unit}
                            readOnly
                            placeholder="自动带入"
                            className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-500"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <textarea
                            value={row.opinion || ''}
                            readOnly
                            rows={2}
                            placeholder={row.signed ? '暂无签署意见' : '尚未签署，无意见可带入'}
                            className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-600 resize-none cursor-default"
                            title="专业意见自动带入参与人员签署意见，无需手工输入"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                            className="text-xs text-red-500 hover:underline cursor-pointer"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-steel-600 mb-1.5">
              意见汇总
              <span className="text-steel-400 font-normal ml-2">({opinionSummary.length}/200)</span>
            </label>
            <textarea
              value={opinionSummary}
              maxLength={200}
              rows={3}
              onChange={(e) => {
                setOpinionSummary(e.target.value.slice(0, 200));
                if (errors.opinionSummary) setErrors((p) => { const n = { ...p }; delete n.opinionSummary; return n; });
              }}
              placeholder="请填写会审意见汇总（选填，不超过 200 字）"
              className={inputCls(errors.opinionSummary) + ' resize-none'}
            />
            {errors.opinionSummary && <p className="mt-1 text-xs text-red-500">{errors.opinionSummary}</p>}
          </div>

          <div className="rounded-lg border border-steel-200 overflow-hidden">
            <div
              className="flex items-center gap-2.5 px-4 py-3"
              style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
            >
              <i className="ri-attachment-2 text-emerald-500" />
              <h4 className="text-sm font-semibold text-steel-800">附件上传</h4>
              <span className="text-xs text-steel-400">意见汇总表与其他附件</span>
            </div>
            <div className="p-4 space-y-3">
              {jointReviewPassAttachmentConfigs.map((cfg) => (
                <PassAttachCard
                  key={cfg.id}
                  config={cfg}
                  files={uploads[cfg.id] || []}
                  error={errors[`attach_${cfg.id}`]}
                  onAdd={(fl) => handleAddFiles(cfg.id, cfg.fileCount, cfg.fileSize, fl)}
                  onRemove={(fid) => handleRemoveFile(cfg.id, fid)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer">
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer bg-emerald-500 hover:bg-emerald-600"
          >
            确认通过
          </button>
        </div>
      </div>
    </div>
  );
}

function PassAttachCard({
  config,
  files,
  error,
  onAdd,
  onRemove,
}: {
  config: (typeof jointReviewPassAttachmentConfigs)[number];
  files: UploadedFile[];
  error?: string;
  onAdd: (files: FileList | null) => void;
  onRemove: (fileId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const remain = Math.max(0, config.fileCount - files.length);

  return (
    <div className={`rounded-lg border p-4 ${error ? 'border-red-300 bg-red-50/20' : 'border-steel-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-steel-800">{config.docName}</h4>
            {config.required ? (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-50 text-red-600 border border-red-100">必填</span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-steel-500 border border-steel-100">选填</span>
            )}
            {config.archived ? (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-50 text-emerald-600 border border-emerald-100">存档</span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-steel-400 border border-steel-100">不存档</span>
            )}
          </div>
          <p className="text-xs text-steel-400 mt-1.5">
            文件类型：{config.fileFormats.join('、')} · 单文件 ≤ {config.fileSize}{config.fileSizeUnit} · 最多 {config.fileCount} 个
          </p>
          {config.remark && (
            <p className="text-xs text-amber-700 mt-1.5 bg-amber-50 border border-amber-100 rounded px-2 py-1">
              <i className="ri-information-line mr-1" />
              {config.remark}
            </p>
          )}
        </div>
        {config.templateFile && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="px-2 py-1 text-xs text-steel-600 border border-steel-200 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              onClick={() => alert(`预览模板：${config.templateFile}`)}
            >
              预览模板
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
              onClick={() => alert(`开始下载模板：${config.templateFile}`)}
            >
              下载模板
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {files.map((f) => (
          <div key={f.id} className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50 border border-steel-100">
            <i className="ri-attachment-2 text-steel-400" />
            <span className="text-sm text-steel-700 flex-1 truncate">{f.name}</span>
            <span className="text-xs text-steel-400">{formatSize(f.size)}</span>
            <button
              type="button"
              onClick={() => onRemove(f.id)}
              className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-red-500 cursor-pointer"
            >
              <i className="ri-close-line" />
            </button>
          </div>
        ))}
        {remain > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border border-dashed border-steel-200 rounded-md py-3 text-sm text-steel-500 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-colors"
          >
            <i className="ri-upload-cloud-2-line mr-1.5" />
            上传文件（还可上传 {remain} 个）
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptFromFormats(config.fileFormats)}
          className="hidden"
          onChange={(e) => {
            onAdd(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
