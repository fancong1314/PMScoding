import { useEffect, useMemo, useRef, useState } from 'react';
import { getSporadicBudgetUploadAttachmentConfigs, type AttachmentConfig } from '@/mocks/archiveConfigMocks';
import {
  calcBudgetEstimateTotal,
  emptyBudgetEstimate,
  type SporadicAttachmentFile,
  type SporadicAttachmentMap,
  type SporadicBudgetEstimate,
} from '@/mocks/sporadicProjectMocks';

type FeeKey = 'designFee' | 'jianAnFee' | 'equipmentFee' | 'otherFee';
type RemarkKey = 'designFeeRemark' | 'jianAnFeeRemark' | 'equipmentFeeRemark' | 'otherFeeRemark';

const FEE_ROWS: { feeKey: FeeKey; remarkKey: RemarkKey; label: string }[] = [
  { feeKey: 'designFee', remarkKey: 'designFeeRemark', label: '设计费' },
  { feeKey: 'jianAnFee', remarkKey: 'jianAnFeeRemark', label: '建安费' },
  { feeKey: 'equipmentFee', remarkKey: 'equipmentFeeRemark', label: '设备费' },
  { feeKey: 'otherFee', remarkKey: 'otherFeeRemark', label: '其他' },
];

function fmt(n: number) {
  return n.toFixed(2);
}

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
    'CAD(dwg/dxf)': '.dwg,.dxf',
    '压缩包(zip/rar/7z)': '.zip,.rar,.7z',
    '视频(mp4/avi)': '.mp4,.avi',
  };
  return formats.map((f) => map[f] || '').filter(Boolean).join(',') || undefined;
}

function validateEstimate(data: SporadicBudgetEstimate): Record<string, string> {
  const e: Record<string, string> = {};
  FEE_ROWS.forEach(({ feeKey }) => {
    const raw = data[feeKey];
    if (raw === undefined || raw === null || Number.isNaN(Number(raw))) {
      e[feeKey] = '请填写费用估算，不涉及填 0';
    } else if (Number(raw) < 0) {
      e[feeKey] = '费用估算不能为负数';
    }
  });
  if (calcBudgetEstimateTotal(data) <= 0) {
    e.budgetAmount = '项目预算金额须大于 0，请填写各项费用';
  }
  return e;
}

function validateBudgetAttachments(uploads: SporadicAttachmentMap): Record<string, string> {
  const errors: Record<string, string> = {};
  getSporadicBudgetUploadAttachmentConfigs().forEach((cfg) => {
    if (cfg.required && (!(uploads[cfg.id] || []).length)) {
      errors[`attach_${cfg.id}`] = `请上传「${cfg.docName}」`;
    }
  });
  return errors;
}

function BudgetAttachmentSection({
  uploads,
  onChange,
  errors = {},
}: {
  uploads: SporadicAttachmentMap;
  onChange: (next: SporadicAttachmentMap) => void;
  errors?: Record<string, string>;
}) {
  const configs = useMemo(() => getSporadicBudgetUploadAttachmentConfigs(), []);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleAdd = (config: AttachmentConfig, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const current = uploads[config.id] || [];
    const remain = Math.max(0, config.fileCount - current.length);
    const maxBytes = config.fileSize * (config.fileSizeUnit === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024);
    const nextFiles: SporadicAttachmentFile[] = [...current];

    Array.from(fileList).slice(0, remain).forEach((file) => {
      if (file.size > maxBytes) {
        alert(`「${file.name}」超过大小限制 ${config.fileSize}${config.fileSizeUnit}`);
        return;
      }
      nextFiles.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
      });
    });

    onChange({ ...uploads, [config.id]: nextFiles });
  };

  const handleRemove = (configId: string, fileId: string) => {
    const list = (uploads[configId] || []).filter((f) => f.id !== fileId);
    onChange({ ...uploads, [configId]: list });
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-attachment-2 text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">附件上传</h3>
        <span className="text-xs text-steel-400 ml-1">
          依据项目档案配置 · 零星协议单审查 · 预算上传
        </span>
      </div>

      <div className="p-5 space-y-3">
        {configs.length === 0 ? (
          <div className="py-10 text-center text-sm text-steel-400">
            当前暂无附件配置，请先在「项目档案配置」中维护零星协议单审查 · 预算上传节点
          </div>
        ) : (
          configs.map((cfg) => {
            const files = uploads[cfg.id] || [];
            const remain = Math.max(0, cfg.fileCount - files.length);
            const error = errors[`attach_${cfg.id}`];
            return (
              <div
                key={cfg.id}
                className={`rounded-lg border p-4 ${error ? 'border-red-300 bg-red-50/20' : 'border-steel-200 bg-white'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-steel-800">{cfg.docName}</h4>
                      {cfg.required ? (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-50 text-red-600 border border-red-100">必填</span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-steel-500 border border-steel-100">选填</span>
                      )}
                      {cfg.archived ? (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-50 text-emerald-600 border border-emerald-100">存档</span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-50 text-steel-400 border border-steel-100">不存档</span>
                      )}
                    </div>
                    <p className="text-xs text-steel-400 mt-1.5">
                      文件类型：{cfg.fileFormats.join('、')} · 单文件 ≤ {cfg.fileSize}{cfg.fileSizeUnit} · 最多 {cfg.fileCount} 个
                    </p>
                    {cfg.remark && (
                      <p className="text-xs text-amber-700 mt-1.5 bg-amber-50 border border-amber-100 rounded px-2 py-1">
                        <i className="ri-information-line mr-1" />
                        {cfg.remark}
                      </p>
                    )}
                  </div>
                  {cfg.templateFile && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
                        onClick={() => alert(`预览模板：${cfg.templateFile}`)}
                      >
                        预览模板
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
                        onClick={() => alert(`开始下载模板：${cfg.templateFile}`)}
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
                      <button
                        type="button"
                        className="text-sm text-sky-600 hover:underline flex-1 truncate text-left cursor-pointer"
                        onClick={() => alert(`预览/下载：${f.name}`)}
                      >
                        {f.name}
                      </button>
                      <span className="text-xs text-steel-400">{formatSize(f.size)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(cfg.id, f.id)}
                        className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-red-500 cursor-pointer"
                      >
                        <i className="ri-close-line" />
                      </button>
                    </div>
                  ))}
                  {remain > 0 && (
                    <button
                      type="button"
                      onClick={() => inputRefs.current[cfg.id]?.click()}
                      className="w-full border border-dashed border-steel-200 rounded-md py-3 text-sm text-steel-500 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-colors"
                    >
                      <i className="ri-upload-cloud-2-line mr-1.5" />
                      上传文件（还可上传 {remain} 个）
                    </button>
                  )}
                  <input
                    ref={(el) => { inputRefs.current[cfg.id] = el; }}
                    type="file"
                    multiple
                    accept={acceptFromFormats(cfg.fileFormats)}
                    className="hidden"
                    onChange={(e) => {
                      handleAdd(cfg, e.target.files);
                      e.target.value = '';
                    }}
                  />
                </div>
                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  declareName: string;
  initialUploader?: string;
  initialUploadTime?: string;
  initialEstimate?: SporadicBudgetEstimate;
  initialAttachments?: SporadicAttachmentMap;
  initialRemark?: string;
  onClose: () => void;
  onSubmit: (payload: {
    estimate: SporadicBudgetEstimate;
    total: number;
    uploader: string;
    uploadTime: string;
    attachments: SporadicAttachmentMap;
    budgetRemark: string;
  }) => void;
}

function nowStr() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export default function BudgetUploadModal({
  open,
  declareName,
  initialUploader = '',
  initialUploadTime = '',
  initialEstimate,
  initialAttachments = {},
  initialRemark = '',
  onClose,
  onSubmit,
}: ModalProps) {
  const [data, setData] = useState<SporadicBudgetEstimate>(initialEstimate || emptyBudgetEstimate());
  const [uploader, setUploader] = useState(initialUploader || '樊聪');
  const [uploadTime, setUploadTime] = useState(initialUploadTime || nowStr());
  const [attachments, setAttachments] = useState<SporadicAttachmentMap>(initialAttachments);
  const [budgetRemark, setBudgetRemark] = useState(initialRemark);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setData(initialEstimate || emptyBudgetEstimate());
      setUploader(initialUploader || '樊聪');
      setUploadTime(initialUploadTime || nowStr());
      setAttachments(initialAttachments);
      setBudgetRemark(initialRemark);
      setErrors({});
    }
  }, [open, initialEstimate, initialUploader, initialUploadTime, initialAttachments, initialRemark]);

  if (!open) return null;

  const total = calcBudgetEstimateTotal(data);

  const updateFee = (feeKey: FeeKey, raw: string) => {
    const amount = raw === '' ? 0 : Number(raw);
    setData((prev) => ({
      ...prev,
      [feeKey]: Number.isFinite(amount) ? amount : 0,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[feeKey];
      delete next.budgetAmount;
      return next;
    });
  };

  const updateRemark = (remarkKey: RemarkKey, value: string) => {
    setData((prev) => ({ ...prev, [remarkKey]: value.slice(0, 200) }));
  };

  const handleSubmit = () => {
    const e = {
      ...validateEstimate(data),
      ...validateBudgetAttachments(attachments),
    };
    if (!uploader.trim()) e.uploader = '请填写预算上传人';
    if (!uploadTime.trim()) e.uploadTime = '请填写上传时间';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSubmit({
      estimate: data,
      total: calcBudgetEstimateTotal(data),
      uploader: uploader.trim(),
      uploadTime: uploadTime.trim(),
      attachments,
      budgetRemark: budgetRemark.trim(),
    });
  };

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
      err ? 'border-red-300 bg-red-50/30' : 'border-steel-200 bg-white'
    }`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[900px] max-w-[94vw] max-h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h3 className="text-base font-semibold text-steel-800">预算上传</h3>
            <p className="text-xs text-steel-400 mt-0.5 truncate max-w-[640px]">{declareName}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer rounded-md hover:bg-slate-50">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
            <div
              className="flex items-center gap-2.5 px-5 py-3.5"
              style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-user-line text-emerald-500" />
              </div>
              <h3 className="text-sm font-semibold text-steel-800">上传信息</h3>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className="flex justify-end items-center text-sm text-steel-600 pt-2 whitespace-nowrap">
                  <span className="text-red-500 mr-0.5">*</span>预算上传人
                </label>
                <div>
                  <input
                    value={uploader}
                    onChange={(e) => {
                      setUploader(e.target.value);
                      setErrors((prev) => { const n = { ...prev }; delete n.uploader; return n; });
                    }}
                    className={inputCls(errors.uploader)}
                    placeholder="请输入预算上传人"
                  />
                  {errors.uploader && <p className="mt-1 text-xs text-red-500">{errors.uploader}</p>}
                </div>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className="flex justify-end items-center text-sm text-steel-600 pt-2 whitespace-nowrap">
                  <span className="text-red-500 mr-0.5">*</span>上传时间
                </label>
                <div>
                  <input
                    type="datetime-local"
                    value={uploadTime.replace(' ', 'T').slice(0, 16)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setUploadTime(v ? `${v.replace('T', ' ')}:00`.slice(0, 19) : '');
                      setErrors((prev) => { const n = { ...prev }; delete n.uploadTime; return n; });
                    }}
                    className={inputCls(errors.uploadTime)}
                  />
                  {errors.uploadTime && <p className="mt-1 text-xs text-red-500">{errors.uploadTime}</p>}
                </div>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start md:col-span-2">
                <label className="flex justify-end items-start text-sm text-steel-600 pt-2 whitespace-nowrap">
                  备注
                </label>
                <div>
                  <textarea
                    value={budgetRemark}
                    maxLength={200}
                    rows={3}
                    onChange={(e) => setBudgetRemark(e.target.value.slice(0, 200))}
                    placeholder="请输入备注，200字以内"
                    className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  <p className="text-[11px] text-steel-300 text-right mt-0.5">{budgetRemark.length}/200</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
            <div
              className="flex items-center gap-2.5 px-5 py-3.5"
              style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className="ri-funds-line text-emerald-500" />
              </div>
              <h3 className="text-sm font-semibold text-steel-800 flex items-center gap-0.5">
                <span className="text-red-500">*</span>
                项目预算
              </h3>
            </div>

            <div className="p-5 space-y-3">
              <div className="rounded-md border border-steel-200 overflow-hidden">
                <table className="w-full table-fixed">
                  <thead>
                    <tr style={{ background: '#5b9bd5' }}>
                      <th className="w-[180px] px-3 py-2.5 text-left text-xs font-semibold text-white">费用类型</th>
                      <th className="w-[220px] px-3 py-2.5 text-left text-xs font-semibold text-white">费用估算（万元）</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-white">备注（非必填）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_ROWS.map(({ feeKey, remarkKey, label }, idx) => {
                      const remark = (data[remarkKey] || '') as string;
                      const amountErr = errors[feeKey];
                      return (
                        <tr key={feeKey} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                          <td className="px-3 py-2.5 text-sm text-steel-700 border-t border-steel-100">{label}</td>
                          <td className="px-3 py-2 border-t border-steel-100">
                            <div>
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={data[feeKey]}
                                onChange={(e) => updateFee(feeKey, e.target.value)}
                                placeholder="0.00"
                                className={`w-full px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                                  amountErr ? 'border-red-300 bg-red-50/30' : 'border-steel-200 bg-white'
                                }`}
                              />
                              {amountErr && <p className="mt-1 text-[11px] text-red-500">{amountErr}</p>}
                            </div>
                          </td>
                          <td className="px-3 py-2 border-t border-steel-100">
                            <div>
                              <input
                                type="text"
                                maxLength={200}
                                value={remark}
                                onChange={(e) => updateRemark(remarkKey, e.target.value)}
                                placeholder="请输入备注，200字以内"
                                className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                              />
                              <p className="text-[10px] text-steel-300 text-right mt-0.5">{remark.length}/200</p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <div className="text-sm font-semibold whitespace-nowrap" style={{ color: '#ea580c' }}>
                  项目预算金额（万元）：{fmt(total)} 万元
                </div>
                {errors.budgetAmount && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <i className="ri-error-warning-line" />
                    {errors.budgetAmount}
                  </p>
                )}
              </div>
            </div>
          </div>

          <BudgetAttachmentSection
            uploads={attachments}
            onChange={(next) => {
              setAttachments(next);
              setErrors((prev) => {
                const nextErr = { ...prev };
                Object.keys(nextErr).forEach((k) => { if (k.startsWith('attach_')) delete nextErr[k]; });
                return nextErr;
              });
            }}
            errors={errors}
          />
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-steel-100 bg-slate-50/80">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer">
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
          >
            提交预算
          </button>
        </div>
      </div>
    </div>
  );
}
