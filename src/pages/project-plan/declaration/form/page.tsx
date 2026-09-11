import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { projectPlans, withPaymentPlans, normalizeReviewStatus, withAnnualPlanOrgFields, ANNUAL_DECL_STORAGE_KEY } from '@/mocks/projectPlans';
import type { ProjectPlan, ProjectMajorType, PaymentPlanRow } from '@/mocks/projectPlans';
import BasicInfoSection from './components/BasicInfoSection';
import DetailInfoSection from './components/DetailInfoSection';
import PaymentPlanSection, { validatePaymentPlans } from './components/PaymentPlanSection';
import OverhaulFormSection from './components/OverhaulFormSection';
import MinorFormSection from './components/MinorFormSection';
import InvestmentEstimateSection, { validateInvestmentEstimate } from './components/InvestmentEstimateSection';
import AttachmentUploadSection, {
  validateRequiredAttachments,
  type AttachmentUploadMap,
} from './components/AttachmentUploadSection';

const NEW_TECH_SECTIONS = [
  { id: 'basic-info', title: '项目基本信息', icon: 'ri-file-info-line' },
  { id: 'detail-info', title: '项目详细信息', icon: 'ri-article-line' },
  { id: 'investment-estimate', title: '年度计划投资估算', icon: 'ri-funds-line' },
  { id: 'payment-plan', title: '付款计划', icon: 'ri-calendar-schedule-line' },
  { id: 'attachment-upload', title: '附件上传', icon: 'ri-attachment-2' },
];

const OVERHAUL_SECTIONS = [
  { id: 'overhaul-info', title: '大修项目信息', icon: 'ri-tools-line' },
  { id: 'investment-estimate', title: '年度计划投资估算', icon: 'ri-funds-line' },
  { id: 'payment-plan', title: '付款计划', icon: 'ri-calendar-schedule-line' },
  { id: 'attachment-upload', title: '附件上传', icon: 'ri-attachment-2' },
];

const MINOR_SECTIONS = [
  { id: 'minor-info', title: '基本资料维护', icon: 'ri-box-3-line' },
  { id: 'investment-estimate', title: '年度计划投资估算', icon: 'ri-funds-line' },
  { id: 'payment-plan', title: '付款计划', icon: 'ri-calendar-schedule-line' },
  { id: 'attachment-upload', title: '附件上传', icon: 'ri-attachment-2' },
];

const PATH_TYPE_MAP: Record<string, ProjectMajorType> = {
  '/project-plan/declaration/form/new': '新建',
  '/project-plan/declaration/form/tech': '技改',
  '/project-plan/declaration/form/overhaul': '大修',
  '/project-plan/declaration/form/minor': '零固',
};

const STORAGE_KEY = ANNUAL_DECL_STORAGE_KEY;
const nextPlanYear = String(new Date().getFullYear() + 1);

function getStoredPlans(): ProjectPlan[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
      || localStorage.getItem('ng_decl_plans_v11')
      || localStorage.getItem('ng_decl_plans_v10')
      || localStorage.getItem('ng_decl_plans_v9')
      || localStorage.getItem('ng_decl_plans_v8')
      || localStorage.getItem('ng_decl_plans_v7')
      || localStorage.getItem('ng_decl_plans_v6')
      || localStorage.getItem('ng_decl_plans_v5');
    if (!s) return projectPlans.map((p) => withPaymentPlans(withAnnualPlanOrgFields(p)));
    return JSON.parse(s).map((p: ProjectPlan) => withPaymentPlans(withAnnualPlanOrgFields({
      ...p,
      projectMajorType: p.projectMajorType || '技改',
      reviewStatus: normalizeReviewStatus(p.reviewStatus as string),
    })));
  } catch { return projectPlans.map((p) => withPaymentPlans(withAnnualPlanOrgFields(p))); }
}

const emptyForm: Partial<ProjectPlan> = {
  planYear: nextPlanYear,
  businessDivision: '',
  submitDept: '',
  implementDept: '',
  projectMajorType: '新建',
  projectCategory: '',
  planName: '',
  budgetAmount: 0,
  benefit: 0,
  year1Payment: 0,
  year2Payment: 0,
  year3Payment: 0,
  paymentPlans: [],
  projectManager: '',
  projectManagerPhone: '',
  currentReviewer: '',
  latestStage: '计划申报',
  reviewStatus: 'draft',
  applicant: '当前用户',
  startDate: '',
  endDate: '',
  supplementNote: '',
  currentSituation: '',
  necessity: '',
  innovation: '',
  processDesc: '',
  overallIdea: '',
  modificationContent: '',
  modificationPurpose: '',
  effectDescription: '',
  projectSummary: '',
  equipmentDesc: '',
  jianAnFee: 0,
  designFee: 0,
  equipmentFee: 0,
  otherFee: 0,
  designFeeRemark: '',
  jianAnFeeRemark: '',
  equipmentFeeRemark: '',
  otherFeeRemark: '',
  hasJobChange: '否',
  jobChangeCount: 0,
  isCapitalOverhaul: '是',
  fixedAssetCode: '',
  equipmentCode: '',
  equipmentName: '',
  repairArea: 0,
  overhaulCycleYears: 0,
  lastOverhaulDate: '',
  isStandardOverhaul: '否',
  equipmentCommissionDate: '',
  lastOverhaulContent: '',
  overhaulReason: '',
  overhaulPlanEffect: '',
  specModel: '',
  measureUnit: '',
  updateQty: 0,
  equipmentStockQty: 0,
  purchaseApplyQty: 0,
  unitPrice: 0,
  isNewMinor: '否',
  updateReason: '',
};

export default function DeclarationFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('id');
  const mode = searchParams.get('mode');
  const fromLeaderReview = searchParams.get('from') === 'leader-review';
  const lrId = searchParams.get('lrId');
  const isEdit = !!planId;
  const returnPath = fromLeaderReview ? '/project-plan/leader-review' : '/project-plan/declaration';
  const LEADER_REVIEW_STORAGE = 'ng_plan_leader_review_v6';

  const routeMajorType: ProjectMajorType = useMemo(() => {
    if (PATH_TYPE_MAP[location.pathname]) return PATH_TYPE_MAP[location.pathname];
    const q = searchParams.get('type') as ProjectMajorType | null;
    if (q === '新建' || q === '技改' || q === '大修' || q === '零固') return q;
    return '新建';
  }, [location.pathname, searchParams]);

  const [form, setForm] = useState<Partial<ProjectPlan>>(() => {
    if (planId) {
      const found = getStoredPlans().find((p) => p.id === planId);
      return found ? { ...found } : { ...emptyForm, projectMajorType: routeMajorType };
    }
    return { ...emptyForm, projectMajorType: routeMajorType };
  });

  const majorType = (form.projectMajorType || routeMajorType) as ProjectMajorType;
  const overhaulMode = majorType === '大修';
  const minorMode = majorType === '零固';
  const SECTIONS = overhaulMode ? OVERHAUL_SECTIONS : minorMode ? MINOR_SECTIONS : NEW_TECH_SECTIONS;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentUploadMap>({});
  const [submitConfirm, setSubmitConfirm] = useState(false);
  const paymentPlans = form.paymentPlans || [];

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const visibilityMap: Record<string, number> = {};
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibilityMap[id] = entry.intersectionRatio;
          const max = Object.entries(visibilityMap).sort((a, b) => b[1] - a[1])[0]?.[0];
          if (max) setActiveSection(max);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-80px 0px -50% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [SECTIONS]);

  const scrollToSection = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  }, []);

  const handleChange = (field: keyof ProjectPlan, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
    if (errors[field as string]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field as string]; return next; });
    }
  };

  const handlePatch = (patch: Partial<ProjectPlan>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setDirty(true);
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((k) => { delete next[k]; });
      return next;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.businessDivision) e.businessDivision = '请选择项目提报单位';
    if (!form.implementDept) e.implementDept = '请选择实施主管部门';
    if (!form.projectCategory) e.projectCategory = '请选择项目类别';
    if (!form.planName?.trim()) e.planName = '请输入年度计划名称';
    Object.assign(e, validateInvestmentEstimate(form));
    if (!form.projectManager) e.projectManager = '请选择项目负责人';
    if (!form.planYear) e.planYear = '请选择计划年度';
    if (form.startDate && form.endDate && form.startDate >= form.endDate) {
      e.endDate = '完工时间须晚于开工时间';
    }

    if (overhaulMode) {
      if (!form.startDate) e.startDate = '请选择计划开工时间';
      if (!form.endDate) e.endDate = '请选择计划完工时间';
      if ((form.isCapitalOverhaul || '是') === '是' && !form.fixedAssetCode?.trim()) {
        e.fixedAssetCode = '请输入固定资产编码';
      }
      if (!form.lastOverhaulDate) e.lastOverhaulDate = '请选择上次大修竣工日期';
      if (!form.lastOverhaulContent?.trim()) e.lastOverhaulContent = '请填写上次大修主要内容';
      if (!form.overhaulReason?.trim()) e.overhaulReason = '请填写设备大修理由';
      if (!form.overhaulPlanEffect?.trim()) e.overhaulPlanEffect = '请填写大修方案及效果';
    } else if (minorMode) {
      if (!form.startDate) e.startDate = '请选择计划开工时间';
      if (!form.endDate) e.endDate = '请选择计划完工时间';
      if (!form.specModel?.trim()) e.specModel = '请输入规格型号';
      if (!form.measureUnit?.trim()) e.measureUnit = '请输入计量单位';
      if (!form.updateQty || Number(form.updateQty) <= 0) e.updateQty = '请填写需求数量';
      if (!form.purchaseApplyQty || Number(form.purchaseApplyQty) <= 0) e.purchaseApplyQty = '请填写申请采购数量';
      if (!form.unitPrice || Number(form.unitPrice) <= 0) e.unitPrice = '请填写预估单价';
      if ((form.isNewMinor || '否') === '否' && !form.fixedAssetCode?.trim()) {
        e.fixedAssetCode = '请输入固定资产编码';
      }
      if (!form.updateReason?.trim()) e.updateReason = '请填写更新理由';
    }

    Object.assign(e, validatePaymentPlans(paymentPlans, Number(form.budgetAmount) || 0));
    Object.assign(e, validateRequiredAttachments(majorType, attachments));
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0];
      if (firstKey.startsWith('attach_')) scrollToSection('attachment-upload');
      else if (firstKey.startsWith('payment') || firstKey === 'paymentPlanTotal') scrollToSection('payment-plan');
      else if (
        firstKey === 'budgetAmount' ||
        firstKey === 'designFee' ||
        firstKey === 'jianAnFee' ||
        firstKey === 'equipmentFee' ||
        firstKey === 'otherFee'
      ) scrollToSection('investment-estimate');
      else if (minorMode) scrollToSection('minor-info');
      else scrollToSection(overhaulMode ? 'overhaul-info' : 'basic-info');
      showToast('请检查并填写必填项', 'error');
    }
    return Object.keys(e).length === 0;
  };

  const persist = (status: ProjectPlan['reviewStatus'], message: string) => {
    const plans = getStoredPlans();
    const now = new Date().toISOString().split('T')[0];
    const latestStage =
      status === 'dept_review' ? '部门内审' :
      status === 'draft' ? (isEdit ? (form.latestStage || '草稿') : '草稿') :
      form.latestStage || '计划申报';

    let savedPlan: ProjectPlan | null = null;
    if (isEdit && planId) {
      const updated = plans.map((p) => {
        if (p.id !== planId) return p;
        savedPlan = { ...p, ...form, projectMajorType: majorType, reviewStatus: status, latestStage, updatedAt: now };
        return savedPlan;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else {
      const newPlan: ProjectPlan = {
        ...(form as ProjectPlan),
        projectMajorType: majorType,
        id: String(Date.now()),
        reviewStatus: status,
        latestStage,
        createdAt: now,
        updatedAt: now,
      };
      savedPlan = newPlan;
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newPlan, ...plans]));
    }
    setDirty(false);

    if (fromLeaderReview && lrId) {
      try {
        const raw = localStorage.getItem(LEADER_REVIEW_STORAGE);
        const list = raw ? JSON.parse(raw) as Array<Record<string, unknown>> : [];
        const next = list.map((r) => {
          if (r.id !== lrId) return r;
          return {
            ...r,
            status: 'leader_passed',
            planName: savedPlan?.planName || form.planName || r.planName,
            planYear: savedPlan?.planYear || form.planYear || r.planYear,
            projectMajorCategory: savedPlan?.projectMajorType || majorType || r.projectMajorCategory,
            projectCategory: savedPlan?.projectCategory || form.projectCategory || r.projectCategory,
            businessUnit: savedPlan?.businessDivision || form.businessDivision || r.businessUnit,
            budget: Number(savedPlan?.budgetAmount ?? form.budgetAmount ?? r.budget) || 0,
            benefit: Number(savedPlan?.benefit ?? form.benefit ?? r.benefit) || 0,
            startDate: savedPlan?.startDate || form.startDate || r.startDate,
            endDate: savedPlan?.endDate || form.endDate || r.endDate,
          };
        });
        localStorage.setItem(LEADER_REVIEW_STORAGE, JSON.stringify(next));
      } catch { /* noop */ }
      navigate(returnPath, {
        state: { success: true, message: '修改已保存', tab: 'leader_passed' },
      });
      return;
    }

    navigate('/project-plan/declaration', { state: { success: true, message } });
  };

  const doSaveDraft = () => {
    if (!validate()) return;
    persist(fromLeaderReview ? (form.reviewStatus || 'draft') : 'draft', fromLeaderReview ? '修改已保存' : '保存草稿成功');
  };

  const doSubmit = () => {
    if (!validate()) return;
    setSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    setSubmitConfirm(false);
    persist('dept_review', '已发起部门审批，状态变更为部门内审');
  };

  const handleBack = () => {
    if (dirty) {
      setPendingNav(returnPath);
      setLeaveConfirm(true);
    } else {
      navigate(returnPath);
    }
  };

  return (
    <Layout mainClassName="flex-1 relative">
      <div className="flex" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
        <div
          className="fixed z-30 flex flex-col py-5"
          style={{ left: '14rem', top: '3.5rem', width: 196, height: 'calc(100vh - 3.5rem)', background: 'white', borderRight: '1px solid #e8edf3' }}
        >
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-steel-400 uppercase tracking-wider">表单导航</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all cursor-pointer mb-0.5 text-left ${
                  activeSection === s.id ? 'font-medium' : 'text-steel-500 hover:text-steel-700 hover:bg-slate-50'
                }`}
                style={activeSection === s.id ? { color: '#059669', backgroundColor: '#f0fdf4' } : undefined}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={activeSection === s.id ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' } : { backgroundColor: '#e8edf3', color: '#718096' }}
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
              <h2 className="text-lg font-semibold text-steel-900">
                {fromLeaderReview
                  ? `修改年度计划（${majorType}）`
                  : isEdit
                    ? `编辑年度计划申报（${majorType}）`
                    : `新增年度计划申报（${majorType}）`}
              </h2>
              <p className="text-xs text-steel-400 mt-0.5">
                {fromLeaderReview
                  ? `项目办呈送 · 已通过后发起修改：${form.planName || planId}`
                  : isEdit
                    ? `当前编辑：${form.planName || planId}`
                    : `当前项目大类：${majorType}，请填写信息后保存或提交`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-steel-400">
              <span className="text-red-400">*</span>
              <span>为必填项</span>
            </div>
          </div>

          <div className="space-y-4">
            {overhaulMode ? (
              <OverhaulFormSection
                data={form}
                errors={errors}
                onChange={handleChange}
                onPatch={handlePatch}
                sectionRef={(el) => { sectionRefs.current['overhaul-info'] = el; }}
              />
            ) : minorMode ? (
              <MinorFormSection
                data={form}
                errors={errors}
                onChange={handleChange}
                onPatch={handlePatch}
                sectionRef={(el) => { sectionRefs.current['minor-info'] = el; }}
              />
            ) : (
              <>
                <BasicInfoSection
                  data={form}
                  errors={errors}
                  onChange={handleChange}
                  onPatch={handlePatch}
                  sectionRef={(el) => { sectionRefs.current['basic-info'] = el; }}
                />
                <DetailInfoSection
                  data={form}
                  onChange={(f, v) => handleChange(f, v)}
                  sectionRef={(el) => { sectionRefs.current['detail-info'] = el; }}
                />
              </>
            )}

            <InvestmentEstimateSection
              data={form}
              errors={errors}
              onPatch={handlePatch}
              sectionRef={(el) => { sectionRefs.current['investment-estimate'] = el; }}
            />

            <PaymentPlanSection
              rows={paymentPlans}
              budgetAmount={Number(form.budgetAmount) || 0}
              errors={errors}
              onChange={(rows: PaymentPlanRow[]) => {
                setForm((prev) => ({ ...prev, paymentPlans: rows }));
                setDirty(true);
                setErrors((prev) => {
                  const n = { ...prev };
                  Object.keys(n).forEach((k) => {
                    if (k.startsWith('payment') || k === 'paymentPlanTotal') delete n[k];
                  });
                  return n;
                });
              }}
              sectionRef={(el) => { sectionRefs.current['payment-plan'] = el; }}
            />

            <AttachmentUploadSection
              majorType={majorType}
              uploads={attachments}
              onChange={(next) => {
                setAttachments(next);
                setDirty(true);
                setErrors((prev) => {
                  const n = { ...prev };
                  Object.keys(n).forEach((k) => { if (k.startsWith('attach_')) delete n[k]; });
                  return n;
                });
              }}
              errors={errors}
              sectionRef={(el) => { sectionRefs.current['attachment-upload'] = el; }}
            />
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
        style={{ left: 'calc(14rem + 196px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}
      >
        <span className="text-xs text-steel-400 mr-auto">
          <i className="ri-shield-check-line mr-1 text-emerald-500" />
          提交前请确认必填项已填写完整
        </span>
        <button onClick={handleBack} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
          <i className="ri-arrow-left-line mr-1" />返回
        </button>
        {mode === 'review' || fromLeaderReview ? (
          <button
            onClick={doSaveDraft}
            className="px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <i className="ri-save-line mr-1" />保存
          </button>
        ) : (
          <>
            <button onClick={doSaveDraft} className="px-5 py-2 text-sm border border-emerald-300 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap" style={{ color: '#059669' }}>
              <i className="ri-save-line mr-1.5" />保存草稿
            </button>
            <button
              onClick={doSubmit}
              className="px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <i className="ri-send-plane-line" />提交
            </button>
          </>
        )}
      </div>

      {submitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSubmitConfirm(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-96 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50">
                <i className="ri-question-line text-emerald-500 text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-steel-800">确认提交</h4>
                <p className="text-xs text-steel-500 mt-0.5">是否确认发起部门审批？确认后状态将变更为「部门内审」。</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSubmitConfirm(false)} className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-slate-50 cursor-pointer">否</button>
              <button onClick={confirmSubmit} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>是</button>
            </div>
          </div>
        </div>
      )}

      {leaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setLeaveConfirm(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-96 p-6">
            <h4 className="text-sm font-semibold text-steel-800 mb-2">确认离开？</h4>
            <p className="text-xs text-steel-500 mb-4">当前页面有未保存的修改，离开后将丢失。</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setLeaveConfirm(false)} className="px-4 py-2 text-sm border border-steel-200 rounded-md cursor-pointer">继续编辑</button>
              <button onClick={() => { setLeaveConfirm(false); if (pendingNav) navigate(pendingNav); }} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>确认离开</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{toast.msg}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
