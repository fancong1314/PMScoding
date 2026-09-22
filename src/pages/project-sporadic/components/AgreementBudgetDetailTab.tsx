import {
  emptyBudgetEstimate,
  type SporadicAgreementRecord,
} from '@/mocks/sporadicProjectMocks';
import BudgetEstimateSection from '@/pages/project-sporadic/agreement-issue/form/components/BudgetEstimateSection';
import BudgetDetailAttachmentSection from '@/pages/project-sporadic/agreement-issue/form/components/BudgetDetailAttachmentSection';

interface Props {
  form: SporadicAgreementRecord;
}

/** 查看零星协议单 · 预算详情 TAB */
export default function AgreementBudgetDetailTab({ form }: Props) {
  const uploaded = !!(form.budgetStatus && form.budgetStatus !== 'none');

  if (!uploaded) {
    return (
      <div className="bg-white rounded-lg border border-steel-200 px-6 py-16 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
          <i className="ri-funds-box-line text-xl text-steel-400" />
        </div>
        <p className="text-sm text-steel-500">预算尚未上传</p>
        <p className="text-xs text-steel-400 mt-1">审查阶段完成预算上传后，此处将展示预算相关信息与附件</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
        <div
          className="flex items-center gap-2.5 px-5 py-3.5"
          style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-file-info-line text-emerald-500" />
          </div>
          <h3 className="text-sm font-semibold text-steel-800">预算上传信息</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="grid grid-cols-[130px_1fr] gap-3 items-center">
            <span className="text-sm text-steel-600 text-right whitespace-nowrap">预算上传人</span>
            <span className="text-sm text-steel-800">{form.budgetUploader || '—'}</span>
          </div>
          <div className="grid grid-cols-[130px_1fr] gap-3 items-center">
            <span className="text-sm text-steel-600 text-right whitespace-nowrap">上传时间</span>
            <span className="text-sm text-steel-800">{form.budgetUploadTime || '—'}</span>
          </div>
          <div className="grid grid-cols-[130px_1fr] gap-3 items-start md:col-span-2">
            <span className="text-sm text-steel-600 text-right whitespace-nowrap pt-0.5">备注</span>
            <span className="text-sm text-steel-700 whitespace-pre-wrap leading-relaxed">{form.budgetRemark || '—'}</span>
          </div>
        </div>
      </div>

      <BudgetEstimateSection
        data={form.budgetEstimate || emptyBudgetEstimate()}
        onChange={() => {}}
        showUploadRemark={false}
        readonly
      />

      <BudgetDetailAttachmentSection uploads={form.budgetAttachments || {}} />
    </div>
  );
}
