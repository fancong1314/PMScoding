import { useMemo, useState } from 'react';
import { FormField, formInputCls } from '@/components/feature/FormLayout';
import { getProjectMemberPresentAttachmentConfigs } from '@/mocks/archiveConfigMocks';
import AttachmentUploadSection, {
  type AttachmentUploadMap,
} from '@/pages/project-initiation/declaration/form/components/AttachmentUploadSection';

interface Props {
  open: boolean;
  projectName: string;
  approvalNo: string;
  memberCount: number;
  groupCount: number;
  onClose: () => void;
  onSubmit: (remark: string, attachmentNames: string[]) => void;
}

/** 呈核：发起领导审批 */
export default function PresentApprovalModal({
  open,
  projectName,
  approvalNo,
  memberCount,
  groupCount,
  onClose,
  onSubmit,
}: Props) {
  const [remark, setRemark] = useState('项目组成员已核实完毕，呈请公司领导审批定版。');
  const [error, setError] = useState('');
  const [uploads, setUploads] = useState<AttachmentUploadMap>({});
  const configs = useMemo(() => getProjectMemberPresentAttachmentConfigs(), []);

  if (!open) return null;

  const collectAttachmentNames = () =>
    Object.values(uploads)
      .flat()
      .map((f) => f.name)
      .filter(Boolean);

  const reset = () => {
    setRemark('项目组成员已核实完毕，呈请公司领导审批定版。');
    setError('');
    setUploads({});
  };

  const handleSubmit = () => {
    if (!remark.trim()) {
      setError('请填写呈核说明');
      return;
    }
    onSubmit(remark.trim(), collectAttachmentNames());
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[840px] max-w-[95vw] max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-steel-800">呈核 · 发起领导审批</h3>
            <p className="text-xs text-steel-400 mt-0.5">{projectName}（{approvalNo}）</p>
          </div>
          <button type="button" onClick={handleClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2.5 text-xs text-amber-800 space-y-1">
            <p>呈核后将进入公司领导审批流程；审批通过后项目组成员正式定版生效。当前共 {groupCount} 个小组、{memberCount} 名成员。</p>
            <p className="font-medium">呈核后状态变为「审批中」期间，不可对成员进行编辑、修改或变更，请确认名单无误后再提交。</p>
          </div>
          <FormField label="呈核说明" required error={error} topAlign fullWidth>
            <textarea
              rows={4}
              maxLength={200}
              value={remark}
              onChange={(e) => { setRemark(e.target.value.slice(0, 200)); setError(''); }}
              placeholder="请填写呈核说明"
              className={formInputCls(error) + ' resize-none'}
            />
            <p className="text-xs text-steel-400 text-right mt-1">{remark.length}/200</p>
          </FormField>
          <AttachmentUploadSection
            majorType=""
            configs={configs}
            sourceLabel="依据项目档案配置 · 项目成员管理 · 呈核选填"
            uploads={uploads}
            onChange={setUploads}
            sectionRef={() => undefined}
          />
          <p className="text-xs text-steel-500">审批流程：管理员呈核 → 工程管理部复核 → 公司分管领导审批</p>
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={handleClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            确认呈核
          </button>
        </div>
      </div>
    </div>
  );
}
