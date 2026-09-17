import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  FormField,
  FormSection,
  formInputCls,
  formRow2Cls,
} from '@/components/feature/FormLayout';
import {
  AGREEMENT_DECLARE_STORAGE_KEY,
  calcBudgetEstimateTotal,
  emptyAgreementForm,
  emptyBudgetEstimate,
  sporadicAgreementRecords as seed,
  sporadicProjectTypes,
  withAgreementFormFields,
  type SporadicAgreementRecord,
  type SporadicProjectType,
} from '@/mocks/sporadicProjectMocks';
import type { ResearchPersonRow } from '@/mocks/projectPlans';
import ResearchPersonSection from '@/pages/project-initiation/declaration/form/components/ResearchPersonSection';
import AttachmentUploadSection, {
  validateRequiredAttachments,
  type AttachmentUploadMap,
} from '@/pages/project-sporadic/agreement-declare/form/components/AttachmentUploadSection';
import ContractSelectModal from '@/pages/project-sporadic/agreement-declare/form/components/ContractSelectModal';
import PersonSelectModal from '@/pages/project-sporadic/agreement-declare/form/components/PersonSelectModal';
import BudgetEstimateSection, { validateBudgetEstimate } from './components/BudgetEstimateSection';
import PlanAttachmentSection, { validatePlanAttachments } from './components/PlanAttachmentSection';

const SECTIONS = [
  { id: 'basic', title: '基本信息', icon: 'ri-file-info-line' },
  { id: 'detail', title: '详细信息', icon: 'ri-file-text-line' },
  { id: 'research-person', title: '研究报告人员', icon: 'ri-team-line' },
  { id: 'attachment-upload', title: '附件上传', icon: 'ri-attachment-2' },
  { id: 'project-budget', title: '项目预算', icon: 'ri-funds-line' },
  { id: 'plan-attachment', title: '方案上传', icon: 'ri-file-upload-line' },
];

const BUDGET_LIMIT = 5;

function loadAgreements(): SporadicAgreementRecord[] {
  try {
    const s = localStorage.getItem(AGREEMENT_DECLARE_STORAGE_KEY);
    if (s) {
      return (JSON.parse(s) as SporadicAgreementRecord[]).map(withAgreementFormFields);
    }
    localStorage.removeItem('ng_sporadic_agreement_v5');
    localStorage.removeItem('ng_sporadic_agreement_v4');
    localStorage.removeItem('ng_sporadic_agreement_v3');
    localStorage.removeItem('ng_sporadic_agreement_v2');
    localStorage.removeItem('ng_sporadic_agreement_v1');
  } catch { /* noop */ }
  return seed.map((r) => withAgreementFormFields(r));
}

function saveAgreements(list: SporadicAgreementRecord[]) {
  localStorage.setItem(AGREEMENT_DECLARE_STORAGE_KEY, JSON.stringify(list));
}

function nowStr() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export default function AgreementIssueFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') || 'issue') as 'issue' | 'view';
  const planId = searchParams.get('id') || '';
  const isView = mode === 'view';
  const isIssue = mode === 'issue';

  const [form, setForm] = useState<SporadicAgreementRecord>(() => emptyAgreementForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [contractOpen, setContractOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState<'manager' | 'leader' | null>(null);
  const [activeSection, setActiveSection] = useState('basic');

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = loadAgreements();
    const found = list.find((r) => r.id === planId);
    if (found) setForm(withAgreementFormFields(found));
    else {
      setToast('未找到该协议单，已返回列表');
      setTimeout(() => navigate('/project-sporadic/agreement-issue'), 1200);
    }
  }, [mode, planId, navigate]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const patch = (partial: Partial<SporadicAgreementRecord>) => {
    if (isView) return;
    setForm((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(partial).forEach((k) => { delete next[k]; });
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const onScroll = () => {
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = sectionRefs.current[s.id];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) current = s.id;
      }
      setActiveSection(current);
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.frameworkContractId) e.frameworkContractName = '请选择框架合同';
    if (!form.declareName.trim()) e.declareName = '请填写申报名称';
    if (!form.projectType) e.projectType = '请选择项目类型';
    if (!form.leaderName.trim()) e.leaderName = '请选择分管领导';
    if (!form.projectManager.trim()) e.projectManager = '请选择项目负责人';
    if (!form.projectManagerPhone.trim()) e.projectManagerPhone = '请填写负责人电话';
    if (!form.implementYear.trim()) e.implementYear = '请填写实施年度';
    if (!form.startDate) e.startDate = '请选择计划开工时间';
    if (!form.endDate) e.endDate = '请选择计划完工时间';
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      e.endDate = '计划完工时间不能早于开工时间';
    }
    const budget = Number(form.budgetAmount ?? form.amount ?? 0);
    if (!budget || budget <= 0) e.budgetAmount = '请填写概算金额';
    else if (!form.isUrgent && budget > BUDGET_LIMIT) {
      e.budgetAmount = `非紧急抢修时概算不能超过 ${BUDGET_LIMIT} 万元`;
    }
    if (!form.declareDetail?.trim()) e.declareDetail = '请填写申报详情';
    if (!form.supplierContact?.trim()) e.supplierContact = '请填写施工单位负责人';
    if (!form.supplierPhone?.trim()) e.supplierPhone = '请填写负责人联系方式';
    Object.assign(e, validateRequiredAttachments(form.attachments || {}));
    Object.assign(e, validateBudgetEstimate(form.budgetEstimate || emptyBudgetEstimate()));
    Object.assign(e, validatePlanAttachments(form.planAttachments || {}));
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const first = Object.keys(e)[0];
      const map: Record<string, string> = {
        frameworkContractName: 'basic', declareName: 'basic', projectType: 'basic',
        leaderName: 'basic', projectManager: 'basic', projectManagerPhone: 'basic',
        implementYear: 'basic', startDate: 'basic', endDate: 'basic', budgetAmount: 'basic',
        supplierContact: 'basic', supplierPhone: 'basic', declareDetail: 'detail',
        designFee: 'project-budget', jianAnFee: 'project-budget', equipmentFee: 'project-budget',
        otherFee: 'project-budget',
      };
      let sectionId = map[first] || 'basic';
      if (first.startsWith('attach_')) sectionId = 'attachment-upload';
      if (first.startsWith('plan_attach_')) sectionId = 'plan-attachment';
      scrollToSection(sectionId);
      showToast('请完善必填项后再签发');
      return false;
    }
    return true;
  };

  const handleIssue = () => {
    if (!validate()) return;
    const list = loadAgreements();
    const estimate = form.budgetEstimate || emptyBudgetEstimate();
    const total = calcBudgetEstimateTotal(estimate);
    const payload = withAgreementFormFields({
      ...form,
      budgetEstimate: estimate,
      budgetAmount: total,
      amount: total,
      issueStatus: 'issued',
      issuer: form.issuer || '樊聪',
      issueTime: nowStr(),
    });
    const next = list.map((r) => (r.id === planId ? { ...payload, id: planId } : r));
    saveAgreements(next);
    showToast('协议单已签发');
    setTimeout(() => navigate('/project-sporadic/agreement-issue'), 600);
  };

  const pageTitle = isView ? '查看零星协议单' : '签发零星协议单';
  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [String(y - 1), String(y), String(y + 1), String(y + 2)];
  }, []);

  return (
    <Layout>
      <div className="relative flex h-[calc(100vh-56px)] -mx-6 -mt-4 -mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-[196px] border-r border-steel-200 bg-white pt-5 flex flex-col z-10">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-steel-400 uppercase tracking-wider">表单导航</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all cursor-pointer mb-0.5 text-left ${
                  activeSection === s.id ? 'font-medium' : 'text-steel-500 hover:text-steel-700 hover:bg-slate-50'
                }`}
                style={activeSection === s.id ? { color: '#059669', backgroundColor: '#f0fdf4' } : undefined}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={activeSection === s.id
                    ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }
                    : { backgroundColor: '#e8edf3', color: '#718096' }}
                >
                  {i + 1}
                </div>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{s.title}</span>
              </button>
            ))}
          </nav>
        </div>

        <div ref={contentRef} className="flex-1 overflow-y-auto pb-24 px-6 pt-6" style={{ marginLeft: 196 }}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-steel-900">{pageTitle}</h2>
              <p className="text-xs text-steel-400 mt-0.5">
                {isView
                  ? `只读查看：${form.declareName || planId}`
                  : `签发确认：${form.declareName || planId}（含项目预算与方案上传）`}
              </p>
            </div>
            {!isView && (
              <div className="flex items-center gap-1.5 text-xs text-steel-400">
                <span className="text-red-400">*</span>
                <span>为必填项</span>
              </div>
            )}
          </div>

          <div className={`space-y-4 ${isView ? 'pointer-events-none' : ''}`}>
            <FormSection
              id="basic"
              title="基本信息"
              subtitle="合同与项目基础字段"
              icon="ri-file-info-line"
              sectionRef={(el) => { sectionRefs.current.basic = el; }}
            >
              <div className={formRow2Cls}>
                <FormField label="是否紧急抢修" required error={errors.isUrgent}>
                  <div className="flex items-center gap-2">
                    <select
                      value={form.isUrgent ? 'yes' : 'no'}
                      disabled={isView}
                      onChange={(e) => patch({ isUrgent: e.target.value === 'yes' })}
                      className={formInputCls(errors.isUrgent) + ' cursor-pointer flex-1'}
                    >
                      <option value="no">否</option>
                      <option value="yes">是</option>
                    </select>
                    {form.isUrgent && (
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500 text-white shadow-sm shadow-red-200 flex-shrink-0"
                        title="紧急抢修 · 需优先处理"
                      >
                        <i className="ri-alarm-warning-fill text-sm leading-none" />
                      </span>
                    )}
                  </div>
                </FormField>
                <FormField label="合同名称" required error={errors.frameworkContractName}>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={form.frameworkContractName || ''}
                      placeholder="点击选择已签订框架合同"
                      className={formInputCls(errors.frameworkContractName, { readonly: true })}
                    />
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => setContractOpen(true)}
                        className="flex-shrink-0 px-3 py-2 text-sm text-sky-600 border border-sky-200 rounded-md hover:bg-sky-50 cursor-pointer whitespace-nowrap"
                      >
                        选择
                      </button>
                    )}
                  </div>
                </FormField>
                <FormField label="合同编号">
                  <input readOnly value={form.frameworkContractNo || ''} className={formInputCls('', { readonly: true })} placeholder="选择合同后自动带出" />
                </FormField>
                <FormField label="供应商">
                  <input readOnly value={form.supplierName || ''} className={formInputCls('', { readonly: true })} placeholder="选择合同后自动带出" />
                </FormField>
                <FormField label="施工单位负责人" required error={errors.supplierContact}>
                  <input
                    value={form.supplierContact || ''}
                    disabled={isView}
                    onChange={(e) => patch({ supplierContact: e.target.value })}
                    className={formInputCls(errors.supplierContact)}
                    placeholder="选择合同后带出，可修改"
                  />
                </FormField>
                <FormField label="负责人联系方式" required error={errors.supplierPhone}>
                  <input
                    value={form.supplierPhone || ''}
                    disabled={isView}
                    onChange={(e) => patch({ supplierPhone: e.target.value })}
                    className={formInputCls(errors.supplierPhone)}
                    placeholder="选择合同后带出，可修改"
                  />
                </FormField>
                <FormField label="申报名称" required error={errors.declareName} fullWidth>
                  <input
                    value={form.declareName}
                    disabled={isView}
                    onChange={(e) => patch({ declareName: e.target.value })}
                    className={formInputCls(errors.declareName)}
                    placeholder="请输入申报名称"
                  />
                </FormField>
                <FormField label="项目类型" required error={errors.projectType}>
                  <select
                    value={form.projectType}
                    disabled={isView}
                    onChange={(e) => patch({ projectType: e.target.value as SporadicProjectType })}
                    className={formInputCls(errors.projectType) + ' cursor-pointer'}
                  >
                    {sporadicProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>
                <FormField label="分管领导" required error={errors.leaderName}>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={form.leaderName || ''}
                      placeholder="点击选择分管领导"
                      className={formInputCls(errors.leaderName, { readonly: true })}
                    />
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => setPersonOpen('leader')}
                        className="flex-shrink-0 px-3 py-2 text-sm text-sky-600 border border-sky-200 rounded-md hover:bg-sky-50 cursor-pointer whitespace-nowrap"
                      >
                        选择
                      </button>
                    )}
                  </div>
                </FormField>
                <FormField label="项目负责人" required error={errors.projectManager}>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={form.projectManager || ''}
                      placeholder="点击选择项目负责人"
                      className={formInputCls(errors.projectManager, { readonly: true })}
                    />
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => setPersonOpen('manager')}
                        className="flex-shrink-0 px-3 py-2 text-sm text-sky-600 border border-sky-200 rounded-md hover:bg-sky-50 cursor-pointer whitespace-nowrap"
                      >
                        选择
                      </button>
                    )}
                  </div>
                </FormField>
                <FormField label="负责人电话" required error={errors.projectManagerPhone}>
                  <input
                    value={form.projectManagerPhone || ''}
                    disabled={isView}
                    onChange={(e) => patch({ projectManagerPhone: e.target.value })}
                    className={formInputCls(errors.projectManagerPhone)}
                    placeholder="选择负责人后自动带出"
                  />
                </FormField>
                <FormField label="实施年度" required error={errors.implementYear}>
                  <select
                    value={form.implementYear || ''}
                    disabled={isView}
                    onChange={(e) => patch({ implementYear: e.target.value })}
                    className={formInputCls(errors.implementYear) + ' cursor-pointer'}
                  >
                    <option value="">请选择</option>
                    {years.map((y) => <option key={y} value={y}>{y}年</option>)}
                  </select>
                </FormField>
                <FormField label="计划开工时间" required error={errors.startDate}>
                  <input
                    type="date"
                    value={form.startDate}
                    disabled={isView}
                    onChange={(e) => patch({ startDate: e.target.value })}
                    className={formInputCls(errors.startDate)}
                  />
                </FormField>
                <FormField label="计划完工时间" required error={errors.endDate}>
                  <input
                    type="date"
                    value={form.endDate}
                    disabled={isView}
                    onChange={(e) => patch({ endDate: e.target.value })}
                    className={formInputCls(errors.endDate)}
                  />
                </FormField>
                <FormField label="概算(万元)" required error={errors.budgetAmount}>
                  <div>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.budgetAmount ?? form.amount ?? ''}
                      disabled={isView}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        patch({ budgetAmount: v, amount: v });
                      }}
                      className={formInputCls(errors.budgetAmount)}
                      placeholder={form.isUrgent ? '紧急抢修可超过5万' : '非紧急抢修不得超过5万'}
                    />
                    <p className="mt-1 text-[11px] text-steel-400">
                      {form.isUrgent
                        ? '紧急抢修：概算金额可以超过 5 万元'
                        : '非紧急抢修：概算金额不能超过 5 万元'}
                    </p>
                  </div>
                </FormField>
              </div>
            </FormSection>

            <FormSection
              id="detail"
              title="详细信息"
              subtitle="申报说明与方案描述"
              icon="ri-file-text-line"
              sectionRef={(el) => { sectionRefs.current.detail = el; }}
            >
              <div className="space-y-4">
                <FormField label="申报详情" required error={errors.declareDetail} topAlign fullWidth>
                  <textarea
                    rows={4}
                    value={form.declareDetail || ''}
                    disabled={isView}
                    onChange={(e) => patch({ declareDetail: e.target.value })}
                    className={formInputCls(errors.declareDetail)}
                    placeholder="请填写申报详情（提交时必填）"
                  />
                </FormField>
                <FormField label="现状" topAlign fullWidth>
                  <textarea
                    rows={3}
                    value={form.currentStatus || ''}
                    disabled={isView}
                    onChange={(e) => patch({ currentStatus: e.target.value })}
                    className={formInputCls()}
                    placeholder="请描述现场现状"
                  />
                </FormField>
                <FormField label="改造必要性" topAlign fullWidth>
                  <textarea
                    rows={3}
                    value={form.necessity || ''}
                    disabled={isView}
                    onChange={(e) => patch({ necessity: e.target.value })}
                    className={formInputCls()}
                    placeholder="请说明改造/施工必要性"
                  />
                </FormField>
                <FormField label="主要内容" topAlign fullWidth>
                  <textarea
                    rows={3}
                    value={form.mainContent || ''}
                    disabled={isView}
                    onChange={(e) => patch({ mainContent: e.target.value })}
                    className={formInputCls()}
                    placeholder="请填写主要施工内容"
                  />
                </FormField>
              </div>
            </FormSection>

            <ResearchPersonSection
              rows={form.researchPersons}
              onChange={(rows: ResearchPersonRow[]) => patch({ researchPersons: rows })}
              sectionRef={(el) => { sectionRefs.current['research-person'] = el; }}
              readonly={isView}
            />

            <AttachmentUploadSection
              uploads={(form.attachments || {}) as AttachmentUploadMap}
              onChange={(next) => {
                if (isView) return;
                setForm((prev) => ({ ...prev, attachments: next }));
                setErrors((prev) => {
                  const cleared = { ...prev };
                  Object.keys(cleared).forEach((k) => {
                    if (k.startsWith('attach_')) delete cleared[k];
                  });
                  return cleared;
                });
              }}
              errors={errors}
              sectionRef={(el) => { sectionRefs.current['attachment-upload'] = el; }}
              readonly={isView}
            />

            <BudgetEstimateSection
              data={form.budgetEstimate || emptyBudgetEstimate()}
              errors={errors}
              onChange={(next) => {
                if (isView) return;
                const total = calcBudgetEstimateTotal(next);
                setForm((prev) => ({
                  ...prev,
                  budgetEstimate: next,
                  budgetAmount: total,
                  amount: total,
                }));
                setErrors((prev) => {
                  const cleared = { ...prev };
                  ['designFee', 'jianAnFee', 'equipmentFee', 'otherFee', 'budgetAmount'].forEach((k) => {
                    delete cleared[k];
                  });
                  return cleared;
                });
              }}
              sectionRef={(el) => { sectionRefs.current['project-budget'] = el; }}
              readonly={isView}
            />

            <PlanAttachmentSection
              uploads={form.planAttachments || {}}
              onChange={(next) => {
                if (isView) return;
                setForm((prev) => ({ ...prev, planAttachments: next }));
                setErrors((prev) => {
                  const cleared = { ...prev };
                  Object.keys(cleared).forEach((k) => {
                    if (k.startsWith('plan_attach_')) delete cleared[k];
                  });
                  return cleared;
                });
              }}
              errors={errors}
              sectionRef={(el) => { sectionRefs.current['plan-attachment'] = el; }}
              readonly={isView}
            />
          </div>
        </div>

        <div
          className="absolute left-[196px] right-0 bottom-0 z-20 border-t border-steel-200 bg-white/95 backdrop-blur px-6 py-3 flex items-center justify-end gap-2"
        >
          <button
            type="button"
            onClick={() => navigate('/project-sporadic/agreement-issue')}
            className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-slate-50 cursor-pointer"
          >
            {isView ? '返回' : '取消'}
          </button>
          {isIssue && (
            <button
              type="button"
              onClick={handleIssue}
              className="px-5 py-2 text-sm text-white rounded-md cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}
            >
              确认签发
            </button>
          )}
        </div>
      </div>

      <ContractSelectModal
        open={contractOpen}
        selectedId={form.frameworkContractId}
        onClose={() => setContractOpen(false)}
        onSelect={(c) => {
          patch({
            frameworkContractId: c.id,
            frameworkContractNo: c.contractNo,
            frameworkContractName: c.contractName,
            supplierName: c.supplierName,
            supplierNo: c.supplierNo,
            supplierContact: c.contractorContact,
            supplierPhone: c.contractorPhone,
          });
          setContractOpen(false);
        }}
      />

      <PersonSelectModal
        open={!!personOpen}
        title={personOpen === 'leader' ? '选择分管领导' : '选择项目负责人'}
        mode={personOpen || 'manager'}
        selectedId={personOpen === 'leader' ? form.leaderId : form.projectManagerId}
        onClose={() => setPersonOpen(null)}
        onSelect={(p) => {
          if (personOpen === 'leader') {
            patch({ leaderId: p.id, leaderName: p.name });
          } else {
            patch({
              projectManagerId: p.id,
              projectManager: p.name,
              projectManagerPhone: p.phone,
              submitUnit: form.submitUnit || p.unit,
            });
          }
          setPersonOpen(null);
        }}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-4 py-2.5 rounded-lg bg-steel-800 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}
    </Layout>
  );
}
