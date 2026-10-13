import { useMemo, useRef, useState } from 'react';
import {
  ESTIMATE_FEE_TYPES,
  formatCurrencyFixed,
  getPendingSupplement,
  getPlanControl,
  getProjectFeeLines,
  isFeeChangeLocked,
  submitFeeSupplement,
  yuanToWan,
  type EstimateFeeType,
  type EstimateProject,
} from '@/mocks/estimateManagementMocks';
import { getEstimateFeeSupplementAttachmentConfigs } from '@/mocks/archiveConfigMocks';
import { FormField, formInputCls } from '@/components/feature/FormLayout';
import AttachmentUploadSection, {
  type AttachmentUploadMap,
} from '@/pages/project-initiation/declaration/form/components/AttachmentUploadSection';

interface Props {
  project: EstimateProject;
  onClose: () => void;
  onSubmitted: (message: string) => void;
}

interface RowDraft {
  direction: '加' | '减';
  amount: string;
}

const emptyDraft = (): Record<EstimateFeeType, RowDraft> => ({
  设计费: { direction: '加', amount: '' },
  建安费: { direction: '加', amount: '' },
  设备费: { direction: '减', amount: '' },
  其他费: { direction: '加', amount: '' },
});

/** 费用增补申请弹窗 */
export default function FeeSupplementModal({ project, onClose, onSubmitted }: Props) {
  const locked = isFeeChangeLocked(project.id);
  const pending = getPendingSupplement(project.id);
  const plan = useMemo(() => getPlanControl(project), [project]);
  const lines = useMemo(() => getProjectFeeLines(project.id), [project.id]);
  const attachConfigs = useMemo(() => getEstimateFeeSupplementAttachmentConfigs(), []);
  const [drafts, setDrafts] = useState(emptyDraft);
  const [reason, setReason] = useState('');
  const [uploads, setUploads] = useState<AttachmentUploadMap>({});
  const [attachErrors, setAttachErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const attachRef = useRef<HTMLDivElement | null>(null);

  const preview = useMemo(() => lines.map((line) => {
    const draft = drafts[line.type];
    const wan = Number(draft.amount);
    const yuan = !draft.amount || Number.isNaN(wan) || wan <= 0 ? 0 : Math.round(wan * 10000 * 100) / 100;
    const signed = draft.direction === '加' ? yuan : -yuan;
    return { ...line, signed };
  }), [lines, drafts]);

  const sum = (key: 'actualAmount' | 'demandOccupied' | 'contractOccupied' | 'availableAmount') =>
    preview.reduce((s, r) => s + r[key], 0);
  const net = preview.reduce((s, r) => s + r.signed, 0);

  const patch = (type: EstimateFeeType, partial: Partial<RowDraft>) => {
    setDrafts((prev) => ({ ...prev, [type]: { ...prev[type], ...partial } }));
    setError('');
  };

  const handleConfirm = () => {
    const aErr: Record<string, string> = {};
    attachConfigs.forEach((cfg) => {
      if (cfg.required && !(uploads[cfg.id] || []).length) {
        aErr[`attach_${cfg.id}`] = `请上传「${cfg.docName}」`;
      }
    });
    setAttachErrors(aErr);
    if (Object.keys(aErr).length) {
      setError('请完善必填附件后再提交');
      attachRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const attachmentNames = Object.values(uploads).flat().map((f) => f.name);
    const result = submitFeeSupplement(
      project.id,
      ESTIMATE_FEE_TYPES.map((type) => ({
        type,
        direction: drafts[type].direction,
        amountWan: Number(drafts[type].amount) || 0,
      })),
      reason,
      attachmentNames,
    );
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onSubmitted(result.message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[1080px] max-w-[96vw] max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="px-6 pt-5 pb-3">
          <h3 className="text-base font-bold text-slate-900">费用增补申请</h3>
        </div>

        <div className="px-6">
          <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-red-600 leading-relaxed">
            请注意，项目费用不能超过计划管控金额，所以增补费用不能超过计划可用金额。费用增补需要审批，审批通过后会自动更新费用数据，审批期间无法执行任何费用加减操作。
          </div>
        </div>

        <div className="px-6 py-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="text-slate-500">计划名称：</span>
            <span className="text-slate-800">{plan.planName}（{plan.planNo}）</span>
          </div>
          <div>
            <span className="text-sky-600">计划管控金额（万元）：</span>
            <span className="font-mono text-sky-600">{yuanToWan(plan.controlAmount)}</span>
          </div>
          <div>
            <span className="text-sky-600">计划占用金额（万元）：</span>
            <span className="font-mono text-sky-600">{yuanToWan(plan.occupiedAmount)}</span>
          </div>
          <div>
            <span className="text-amber-600">计划可用金额（万元）：</span>
            <span className="font-mono text-amber-600">{yuanToWan(plan.availableAmount)}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 space-y-4 pb-2">
          <div className="border border-slate-200 overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#7dd3fc' }}>
                  <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">费用类型</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap">项目实际金额（元）</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap">需求占用金额（元）</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap">合同占用金额（元）</th>
                  <th className="px-3 py-2.5 text-right font-medium text-white whitespace-nowrap">可用金额（元）</th>
                  <th className="px-3 py-2.5 text-left font-medium text-white whitespace-nowrap">增补费用（万元）</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row) => (
                  <tr key={row.type} className="border-t border-slate-200">
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{row.type}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.actualAmount)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.demandOccupied)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.contractOccupied)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">{formatCurrencyFixed(row.availableAmount)}</td>
                    <td className="px-3 py-2">
                      {locked ? (
                        <span className="text-xs text-slate-400">审批中</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            value={drafts[row.type].direction}
                            onChange={(e) => patch(row.type, { direction: e.target.value as '加' | '减' })}
                            className="px-2 py-1.5 text-sm border border-slate-200 rounded bg-white cursor-pointer"
                          >
                            <option value="减">减</option>
                            <option value="加">加</option>
                          </select>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={drafts[row.type].amount}
                            onChange={(e) => patch(row.type, { amount: e.target.value })}
                            placeholder="请输入"
                            className="w-28 px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:border-sky-400"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td className="px-3 py-2.5 font-medium text-sky-600">合计</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sky-600">{formatCurrencyFixed(sum('actualAmount'))}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sky-600">{formatCurrencyFixed(sum('demandOccupied'))}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sky-600">{formatCurrencyFixed(sum('contractOccupied'))}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sky-600">{formatCurrencyFixed(sum('availableAmount'))}</td>
                  <td className={`px-3 py-2.5 font-mono font-medium ${net > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                    {net === 0 ? '—' : `${net > 0 ? '+' : ''}${yuanToWan(net)}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {pending && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
              当前增补审批中：{pending.reason}。审批通过前不能再次增减费用。
            </p>
          )}

          {!locked && (
            <>
              <FormField label="增补原因" topAlign>
                <textarea
                  rows={3}
                  maxLength={100}
                  value={reason}
                  onChange={(e) => setReason(e.target.value.slice(0, 100))}
                  placeholder="请输入备注（100字以内）"
                  className={formInputCls() + ' resize-none'}
                />
                <p className="text-xs text-steel-400 text-right mt-1">{reason.length}/100</p>
              </FormField>

              <AttachmentUploadSection
                majorType={project.majorType}
                uploads={uploads}
                onChange={(next) => {
                  setUploads(next);
                  setAttachErrors({});
                  setError('');
                }}
                errors={attachErrors}
                sectionRef={(el) => { attachRef.current = el; }}
                configs={attachConfigs}
                sourceLabel="依据项目档案配置 · 项目概算管理 · 费用增补"
              />
            </>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 text-sm border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer bg-white"
          >
            取消
          </button>
          {!locked && (
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-1.5 text-sm rounded text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
            >
              确认
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
