import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { deferralProjects, appTypeMap } from '@/mocks/deferralMocks';
import type { ApplicationType, DeferralProject } from '@/mocks/deferralMocks';

const APP_TYPE_CONFIG: Record<ApplicationType, {
  title: string;
  color: string;
  borderColor: string;
  icon: string;
  showNewDate: boolean;
  desc: string;
}> = {
  delay: {
    title: '延期申请',
    color: 'bg-amber-500',
    borderColor: 'border-amber-400',
    icon: 'ri-time-line',
    showNewDate: true,
    desc: '申请延长年度计划完成时间，请填写延期理由及新的计划完成日期。',
  },
  suspend: {
    title: '暂缓申请',
    color: 'bg-sky-500',
    borderColor: 'border-sky-400',
    icon: 'ri-pause-circle-line',
    showNewDate: false,
    desc: '申请暂时停止项目推进，请详细说明暂缓原因及预计恢复时间。',
  },
  cancel: {
    title: '取消申请',
    color: 'bg-orange-500',
    borderColor: 'border-orange-400',
    icon: 'ri-close-circle-line',
    showNewDate: false,
    desc: '申请取消该项目，请详细说明取消原因。取消后项目将终止推进。',
  },
  terminate: {
    title: '终止申请',
    color: 'bg-red-500',
    borderColor: 'border-red-400',
    icon: 'ri-stop-circle-line',
    showNewDate: false,
    desc: '申请终止该项目，请详细说明终止原因。终止为不可逆操作，请谨慎申请。',
  },
  change: {
    title: '立项变更',
    color: 'bg-violet-500',
    borderColor: 'border-violet-400',
    icon: 'ri-exchange-line',
    showNewDate: false,
    desc: '申请对项目立项信息进行变更，如投资金额调整、范围变更等。提交后需经公司领导审批，批准后仍需发起增补论证流程。',
  },
};

interface FormErrors {
  changeDesc?: string;
  newEndDate?: string;
  attachments?: string;
}

export default function DeferralFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const appType = (searchParams.get('type') ?? 'delay') as ApplicationType;

  const [project, setProject] = useState<DeferralProject | null>(null);
  const [changeDesc, setChangeDesc] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const config = APP_TYPE_CONFIG[appType] ?? APP_TYPE_CONFIG.delay;

  useEffect(() => {
    const found = deferralProjects.find((p) => p.id === projectId);
    setProject(found ?? null);
  }, [projectId]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!changeDesc.trim()) errs.changeDesc = '变更说明不能为空';
    else if (changeDesc.length > 500) errs.changeDesc = '变更说明不能超过500字';
    if (config.showNewDate) {
      if (!newEndDate) errs.newEndDate = '请选择延期完成时间';
      else if (project && newEndDate <= project.planEndDate) errs.newEndDate = '新计划完成日期必须晚于原计划完成日期';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { showToast('请检查并修正表单中的错误项', 'error'); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/project-plan/deferral', { state: { success: true, message: `${config.title}已提交，等待审批流程处理` } });
    }, 1200);
  };

  const handleSubmitToLeader = () => {
    if (!validate()) { showToast('请检查并修正表单中的错误项', 'error'); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/project-plan/deferral', { state: { success: true, message: `${config.title}已提交至公司领导审批` } });
    }, 1200);
  };

  const handleSaveDraft = () => {
    if (!changeDesc.trim()) { showToast('请先填写变更说明再保存草稿', 'error'); return; }
    setSavingDraft(true);
    setTimeout(() => {
      setSavingDraft(false);
      showToast('草稿已保存');
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 20 * 1024 * 1024;
    const valid = files.filter((f) => {
      if (!validTypes.includes(f.type)) { showToast(`文件 ${f.name} 格式不支持，仅支持PDF、Word、图片`, 'error'); return false; }
      if (f.size > maxSize) { showToast(`文件 ${f.name} 超过20MB限制`, 'error'); return false; }
      return true;
    });
    setAttachments((prev) => [...prev, ...valid]);
    e.target.value = '';
  };

  const removeAttachment = (idx: number) => setAttachments((prev) => prev.filter((_, i) => i !== idx));

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return 'ri-file-pdf-line text-red-500';
    if (file.type.startsWith('image/')) return 'ri-image-line text-sky-500';
    return 'ri-file-word-line text-primary-500';
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
  };

  const typeInfo = appTypeMap[appType];

  return (
    <Layout>
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setConfirmLeave(true)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-steel-200 text-steel-500 hover:bg-slate-50 transition-colors cursor-pointer">
              <i className="ri-arrow-left-line" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border text-white ${config.color} border-transparent`}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className={config.icon} /></div>
                  {config.title}
                </span>
              </div>
              <p className="text-xs text-steel-400 mt-1">{config.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setConfirmLeave(true)}
              className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
              取消
            </button>
            <button onClick={handleSaveDraft} disabled={savingDraft}
              className="flex items-center gap-1.5 px-4 py-2 text-sm border rounded-lg transition-colors cursor-pointer whitespace-nowrap border-steel-200 text-steel-600 hover:bg-slate-50 disabled:opacity-60">
              {savingDraft ? <><i className="ri-loader-4-line animate-spin" /> 保存中...</> : <><i className="ri-save-line" /> 保存草稿</>}
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
              {submitting ? <><i className="ri-loader-4-line animate-spin" /> 提交中...</> : <><i className="ri-send-plane-line" /> 呈核</>}
            </button>
            <button onClick={handleSubmitToLeader} disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
              {submitting ? <><i className="ri-loader-4-line animate-spin" /> 提交中...</> : <><i className="ri-send-plane-line" /> 呈核公司领导</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left: Anchor Nav */}
          <div className="col-span-2">
            <div className="sticky top-4 bg-white rounded-lg border border-steel-200 p-3 space-y-1">
              <p className="text-xs text-steel-400 px-2 mb-2 font-medium">表单导航</p>
              {[
                { id: 'sec-basic', label: '项目基本信息', icon: 'ri-information-line' },
                { id: 'sec-change', label: '变更申请信息', icon: 'ri-edit-2-line' },
                { id: 'sec-attach', label: '附件上传', icon: 'ri-attachment-line' },
              ].map((item) => (
                <a key={item.id} href={`#${item.id}`}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-steel-600 hover:bg-slate-50 hover:text-primary-600 transition-colors cursor-pointer">
                  <div className="w-4 h-4 flex items-center justify-center"><i className={item.icon} /></div>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form Sections */}
          <div className="col-span-10 space-y-4">
            {/* Section 1: Basic Info */}
            <div id="sec-basic" className="bg-white rounded-lg border border-steel-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-steel-100 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                <h2 className="text-sm font-semibold text-steel-800">项目基本信息</h2>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs border font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
              </div>
              {project ? (
                <div className="p-5 grid grid-cols-3 gap-x-8 gap-y-4">
                  {[
                    { label: '立项号', value: project.projectNo },
                    { label: '年度计划号', value: project.planNo },
                    { label: '项目类型', value: project.projectType },
                    { label: '公司别', value: project.companyAlias },
                    { label: '业主单位', value: project.ownerUnit },
                    { label: '项目负责人', value: project.projectManager },
                    { label: '立项金额', value: `${project.projectAmount} 万元` },
                    { label: '申请时间', value: new Date().toLocaleDateString('zh-CN') },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="text-xs text-steel-400">{label}</span>
                      <span className="text-sm text-steel-800 font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="col-span-3 flex flex-col gap-1">
                    <span className="text-xs text-steel-400">项目名称</span>
                    <span className="text-sm text-steel-800 font-medium leading-relaxed">{project.projectName}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-steel-400">计划开始日期</span>
                    <span className="text-sm text-steel-800">{project.planStartDate}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-steel-400">计划完成日期</span>
                    <span className="text-sm text-steel-800">{project.planEndDate}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-steel-400">当前项目状态</span>
                    <span className="text-sm text-steel-800">{project.projectStatus}</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-steel-400">项目信息加载中...</div>
              )}
            </div>

            {/* Section 2: Change Application */}
            <div id="sec-change" className="bg-white rounded-lg border border-steel-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-steel-100 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                <h2 className="text-sm font-semibold text-steel-800">变更申请信息</h2>
              </div>
              <div className="p-5 space-y-5">
                {/* New End Date (only for delay) */}
                {config.showNewDate && (
                  <div>
                    <label className="block text-sm font-medium text-steel-700 mb-1.5">
                      延期完成时间 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <span className="text-xs text-steel-400">原计划完成：</span>
                        <span className="text-sm font-medium text-steel-700 ml-1">{project?.planEndDate ?? '—'}</span>
                      </div>
                      <i className="ri-arrow-right-line text-steel-300" />
                      <div className="flex-1 max-w-xs">
                        <input
                          type="date"
                          value={newEndDate}
                          onChange={(e) => { setNewEndDate(e.target.value); if (errors.newEndDate) setErrors((prev) => ({ ...prev, newEndDate: undefined })); }}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.newEndDate ? 'border-red-400 bg-red-50' : 'border-steel-200 bg-slate-50'}`}
                          min={project?.planEndDate}
                        />
                        {errors.newEndDate && <p className="text-xs text-red-500 mt-1">{errors.newEndDate}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Change Description */}
                <div>
                  <label className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-steel-700">
                      变更说明 <span className="text-red-500">*</span>
                    </span>
                    <span className={`text-xs ${changeDesc.length > 450 ? 'text-red-500' : 'text-steel-400'}`}>
                      {changeDesc.length} / 500
                    </span>
                  </label>
                  <textarea
                    value={changeDesc}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) setChangeDesc(e.target.value);
                      if (errors.changeDesc) setErrors((prev) => ({ ...prev, changeDesc: undefined }));
                    }}
                    rows={6}
                    placeholder={`请详细填写${config.title}的原因和说明（最多500字）...`}
                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none leading-relaxed ${errors.changeDesc ? 'border-red-400 bg-red-50' : 'border-steel-200 bg-slate-50'}`}
                  />
                  {errors.changeDesc && <p className="text-xs text-red-500 mt-1">{errors.changeDesc}</p>}
                  {appType === 'terminate' && (
                    <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5"><i className="ri-alert-line text-red-500 text-sm" /></div>
                      <p className="text-xs text-red-600">终止申请为不可逆操作，项目终止后无法恢复，请确认后再提交。</p>
                    </div>
                  )}
                  {appType === 'change' && (
                    <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-violet-50 border border-violet-100 rounded-lg">
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5"><i className="ri-information-line text-violet-500 text-sm" /></div>
                      <p className="text-xs text-violet-700">立项变更经公司领导审批通过后，仍需另行发起增补论证流程。</p>
                    </div>
                  )}
                </div>

                {/* Applicant Info (auto-filled, read-only) */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-steel-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-steel-400">申请人</span>
                    <span className="text-sm text-steel-700 font-medium">当前登录用户</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-steel-400">申请时间</span>
                    <span className="text-sm text-steel-700">{new Date().toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-steel-400">申请类型</span>
                    <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeInfo.color}`}>{typeInfo.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Attachments */}
            <div id="sec-attach" className="bg-white rounded-lg border border-steel-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-steel-100 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary-500" />
                <h2 className="text-sm font-semibold text-steel-800">附件上传</h2>
                <span className="text-xs text-steel-400 ml-1">（选填，支持PDF、Word、图片，单文件≤20MB）</span>
              </div>
              <div className="p-5">
                {/* Upload Area */}
                <label className="block w-full border-2 border-dashed border-steel-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
                  <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" onChange={handleFileChange} className="hidden" />
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <i className="ri-upload-cloud-2-line text-2xl text-steel-300" />
                  </div>
                  <p className="text-sm font-medium text-steel-600">点击或拖拽文件到此处上传</p>
                  <p className="text-xs text-steel-400 mt-1">支持 PDF、Word、JPG、PNG、GIF，单文件不超过 20MB</p>
                </label>

                {/* Uploaded Files */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-lg border border-steel-100">
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <i className={`${getFileIcon(file)} text-xl`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-steel-700 truncate">{file.name}</p>
                          <p className="text-xs text-steel-400">{formatFileSize(file.size)}</p>
                        </div>
                        <button onClick={() => removeAttachment(idx)} className="w-7 h-7 flex items-center justify-center rounded-md text-steel-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0">
                          <i className="ri-delete-bin-line text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="bg-white rounded-lg border border-steel-200 px-5 py-3.5 flex items-center justify-end gap-3">
              <button onClick={() => setConfirmLeave(true)}
                className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                取消
              </button>
              <button onClick={handleSaveDraft} disabled={savingDraft}
                className="flex items-center gap-1.5 px-5 py-2 text-sm border border-steel-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap text-steel-600 disabled:opacity-60">
                {savingDraft ? <><i className="ri-loader-4-line animate-spin" /> 保存中...</> : <><i className="ri-save-line" /> 保存草稿</>}
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-1.5 px-6 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
                {submitting ? <><i className="ri-loader-4-line animate-spin" /> 提交中...</> : <><i className="ri-send-plane-line" /> 呈核</>}
              </button>
              <button onClick={handleSubmitToLeader} disabled={submitting}
                className="flex items-center gap-1.5 px-6 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                {submitting ? <><i className="ri-loader-4-line animate-spin" /> 提交中...</> : <><i className="ri-send-plane-line" /> 呈核公司领导</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Leave Modal */}
      {confirmLeave && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setConfirmLeave(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 bg-white rounded-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <i className="ri-alert-line text-amber-500" />
              </div>
              <h3 className="text-sm font-semibold text-steel-800">确认离开？</h3>
            </div>
            <p className="text-sm text-steel-500 mb-5">当前表单内容尚未提交，离开将丢失已填写的内容。</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmLeave(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">继续填写</button>
              <button onClick={() => navigate('/project-plan/deferral')} className="px-4 py-2 text-sm text-white rounded-lg cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>确认离开</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={toast.type === 'success' ? 'ri-checkbox-circle-line text-green-500' : 'ri-close-circle-line text-red-500'} />
            </div>
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{toast.message}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
