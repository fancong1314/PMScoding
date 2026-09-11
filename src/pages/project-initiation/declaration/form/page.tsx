import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { projectPlans, withPaymentPlans, withInitiationDetailFields, normalizeReviewStatus, defaultResearchPersons, defaultRiskAssessRows, defaultOverhaulContentRows, defaultMinorContentRows } from '@/mocks/projectPlans';
import type { ProjectPlan, ProjectMajorType, PaymentPlanRow } from '@/mocks/projectPlans';
import BasicInfoSection from './components/BasicInfoSection';
import DetailInfoSection from './components/DetailInfoSection';
import AuxFacilitySection from './components/AuxFacilitySection';
import ProjectTargetSection from './components/ProjectTargetSection';
import ResearchPersonSection from './components/ResearchPersonSection';
import RiskAssessSection from './components/RiskAssessSection';
import PaymentPlanSection, { validatePaymentPlans } from './components/PaymentPlanSection';
import OverhaulFormSection from './components/OverhaulFormSection';
import OverhaulContentSection from './components/OverhaulContentSection';
import MinorFormSection from './components/MinorFormSection';
import MinorContentSection from './components/MinorContentSection';
import AttachmentUploadSection, {
  validateRequiredAttachments,
  type AttachmentUploadMap,
} from './components/AttachmentUploadSection';

const NEW_TECH_SECTIONS = [
  { id: 'basic-info', title: '项目基本信息', icon: 'ri-file-info-line' },
  { id: 'detail-info', title: '项目详细信息', icon: 'ri-article-line' },
  { id: 'aux-facility', title: '公辅配套', icon: 'ri-flashlight-line' },
  { id: 'project-target', title: '项目目标', icon: 'ri-flag-line' },
  { id: 'research-person', title: '研究报告人员', icon: 'ri-team-line' },
  { id: 'payment-plan', title: '付款计划', icon: 'ri-calendar-schedule-line' },
  { id: 'risk-assess', title: '风险与机遇评估', icon: 'ri-shield-check-line' },
  { id: 'attachment-upload', title: '附件上传', icon: 'ri-attachment-2' },
];

const OVERHAUL_SECTIONS = [
  { id: 'overhaul-info', title: '基本信息', icon: 'ri-file-info-line' },
  { id: 'overhaul-content', title: '大修内容明细', icon: 'ri-list-check-2' },
  { id: 'research-person', title: '研究报告人员', icon: 'ri-team-line' },
  { id: 'payment-plan', title: '付款计划', icon: 'ri-calendar-schedule-line' },
  { id: 'attachment-upload', title: '附件上传', icon: 'ri-attachment-2' },
];

const MINOR_SECTIONS = [
  { id: 'minor-info', title: '基本信息', icon: 'ri-file-info-line' },
  { id: 'minor-content', title: '零固内容明细', icon: 'ri-list-check-2' },
  { id: 'research-person', title: '研究报告人员', icon: 'ri-team-line' },
  { id: 'payment-plan', title: '付款计划', icon: 'ri-calendar-schedule-line' },
  { id: 'attachment-upload', title: '附件上传', icon: 'ri-attachment-2' },
];

const PATH_TYPE_MAP: Record<string, ProjectMajorType> = {
  '/project-initiation/declaration/form/new': '新建',
  '/project-initiation/declaration/form/tech': '技改',
  '/project-initiation/declaration/form/overhaul': '大修',
  '/project-initiation/declaration/form/minor': '零固',
};

const STORAGE_KEY = 'ng_init_decl_plans_v6';
const nextPlanYear = String(new Date().getFullYear() + 1);

function getStoredPlans(): ProjectPlan[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    const list: ProjectPlan[] = s ? JSON.parse(s) : projectPlans;
    return list.map((p) => withPaymentPlans(withInitiationDetailFields({
      ...p,
      projectMajorType: p.projectMajorType || '技改',
      reviewStatus: normalizeReviewStatus(p.reviewStatus as string),
    })));
  } catch {
    return projectPlans.map((p) => withPaymentPlans(withInitiationDetailFields(p)));
  }
}

const emptyForm: Partial<ProjectPlan> = {
  planYear: nextPlanYear,
  businessDivision: '',
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
  jianAnFee: 0,
  equipmentFee: 0,
  otherFee: 0,
  hasJobChange: '无',
  jobChangeCount: 0,
  isInPlanProject: '否',
  annualPlanNo: '',
  annualPlanId: '',
  implementUnit: '',
  professionalUnit: '',
  projectDuration: 0,
  projectFeasibility: '',
  deviceFacility: '',
  auxWater: '',
  auxElec: '',
  auxGas: '',
  auxOxygen: '',
  auxOther: '',
  techTarget: '',
  benefitTarget: '',
  otherTarget: '',
  energyAssess: '',
  costAnalysis: '',
  researchPersons: defaultResearchPersons,
  riskAssessRows: defaultRiskAssessRows,
  overhaulContentRows: defaultOverhaulContentRows,
  minorContentRows: defaultMinorContentRows,
  declareFee: 0,
  ownerUnit: '',
  isCapitalOverhaul: '是',
  argumentApplyNo: '',
  isScrapRenew: '是',
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
  inUseQty: 0,
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
  const returnPath = fromLeaderReview ? '/project-initiation/leader-review' : '/project-initiation/declaration';
  const LEADER_REVIEW_STORAGE = 'ng_init_leader_review_v1';

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
    if (!form.businessDivision) e.businessDivision = overhaulMode || minorMode ? '请选择事业部' : '请选择项目单位';
    if (!overhaulMode && !minorMode && !form.projectCategory) e.projectCategory = '请选择项目类别';
    if (!form.planName?.trim()) e.planName = '请输入项目名称';
    if (!form.budgetAmount || Number(form.budgetAmount) <= 0) {
      e.budgetAmount = overhaulMode || minorMode ? '请填写项目计划金额' : '请填写概算总额';
    }
    if (!form.projectManager) e.projectManager = overhaulMode || minorMode ? '请选择项目负责人' : '请选择项目经理';
    if (!overhaulMode && !minorMode && !form.planYear) e.planYear = '请选择计划年度';
    if (form.startDate && form.endDate && form.startDate >= form.endDate) {
      e.endDate = '完工日期须晚于开工日期';
    }

    if (!overhaulMode && !minorMode) {
      if (!form.isInPlanProject) e.isInPlanProject = '请选择是否计划内项目';
      if (form.isInPlanProject === '是' && !form.annualPlanNo?.trim()) {
        e.annualPlanNo = '请选择年度计划号';
      }
      if (!form.implementUnit) e.implementUnit = '请选择实施主管单位';
      if (!form.professionalUnit) e.professionalUnit = '请选择专业主管单位';
      if (!form.startDate) e.startDate = '请选择计划开工日期';
      if (!form.endDate) e.endDate = '请选择计划完工日期';
      if (!form.hasJobChange) e.hasJobChange = '请选择是否涉及岗位增减';
      if ((form.hasJobChange === '增加' || form.hasJobChange === '减少') && (!form.jobChangeCount || Number(form.jobChangeCount) <= 0)) {
        e.jobChangeCount = '请填写岗位增减人数';
      }
    }

    if (overhaulMode) {
      if (!form.isInPlanProject) e.isInPlanProject = '请选择是否计划内';
      if (form.isInPlanProject === '是' && !form.annualPlanNo?.trim()) {
        e.annualPlanNo = '请选择项目计划号';
      }
      if (!form.ownerUnit) e.ownerUnit = '请选择单位';
      if (!form.isCapitalOverhaul) e.isCapitalOverhaul = '请选择是否为资本性大修';
      if (!form.necessity?.trim()) e.necessity = '请填写项目必要性';
    } else if (minorMode) {
      if (!form.isInPlanProject) e.isInPlanProject = '请选择是否计划内';
      if (form.isInPlanProject === '是' && !form.annualPlanNo?.trim()) {
        e.annualPlanNo = '请选择项目计划号';
      }
      if (!form.ownerUnit) e.ownerUnit = '请选择单位';
      if (!form.isScrapRenew) e.isScrapRenew = '请选择是否报废更新';
      if (!form.necessity?.trim()) e.necessity = '请填写项目必要性';
    }

    Object.assign(e, validatePaymentPlans(paymentPlans, Number(form.budgetAmount) || 0));
    Object.assign(e, validateRequiredAttachments(majorType, attachments));
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0];
      if (firstKey.startsWith('attach_')) scrollToSection('attachment-upload');
      else if (firstKey.startsWith('payment') || firstKey === 'paymentPlanTotal') scrollToSection('payment-plan');
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
            status: 'modified',
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
        state: { success: true, message: '修改已保存，项目已进入「已修改」', tab: 'modified' },
      });
      return;
    }

    navigate('/project-initiation/declaration', { state: { success: true, message } });
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
                  ? `修改项目立项（${majorType}）`
                  : isEdit
                    ? `编辑项目立项申请（${majorType}）`
                    : `新增项目立项申请（${majorType}）`}
              </h2>
              <p className="text-xs text-steel-400 mt-0.5">
                {fromLeaderReview
                  ? `项目立项签发 · 领导通过后发起修改：${form.planName || planId}`
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
              <>
                <OverhaulFormSection
                  data={form}
                  errors={errors}
                  onChange={handleChange}
                  onPatch={handlePatch}
                  sectionRef={(el) => { sectionRefs.current['overhaul-info'] = el; }}
                />
                <OverhaulContentSection
                  rows={form.overhaulContentRows}
                  onChange={(rows) => {
                    setForm((prev) => ({ ...prev, overhaulContentRows: rows }));
                    setDirty(true);
                  }}
                  sectionRef={(el) => { sectionRefs.current['overhaul-content'] = el; }}
                />
                <ResearchPersonSection
                  rows={form.researchPersons}
                  onChange={(rows) => {
                    setForm((prev) => ({ ...prev, researchPersons: rows }));
                    setDirty(true);
                  }}
                  sectionRef={(el) => { sectionRefs.current['research-person'] = el; }}
                />
              </>
            ) : minorMode ? (
              <>
                <MinorFormSection
                  data={form}
                  errors={errors}
                  onChange={handleChange}
                  onPatch={handlePatch}
                  sectionRef={(el) => { sectionRefs.current['minor-info'] = el; }}
                />
                <MinorContentSection
                  rows={form.minorContentRows}
                  onChange={(rows) => {
                    setForm((prev) => ({ ...prev, minorContentRows: rows }));
                    setDirty(true);
                  }}
                  sectionRef={(el) => { sectionRefs.current['minor-content'] = el; }}
                />
                <ResearchPersonSection
                  rows={form.researchPersons}
                  onChange={(rows) => {
                    setForm((prev) => ({ ...prev, researchPersons: rows }));
                    setDirty(true);
                  }}
                  sectionRef={(el) => { sectionRefs.current['research-person'] = el; }}
                />
              </>
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
                <AuxFacilitySection
                  data={form}
                  onChange={(f, v) => handleChange(f, v)}
                  sectionRef={(el) => { sectionRefs.current['aux-facility'] = el; }}
                />
                <ProjectTargetSection
                  data={form}
                  onChange={(f, v) => handleChange(f, v)}
                  sectionRef={(el) => { sectionRefs.current['project-target'] = el; }}
                />
                <ResearchPersonSection
                  rows={form.researchPersons}
                  onChange={(rows) => {
                    setForm((prev) => ({ ...prev, researchPersons: rows }));
                    setDirty(true);
                  }}
                  sectionRef={(el) => { sectionRefs.current['research-person'] = el; }}
                />
              </>
            )}

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

            {!overhaulMode && !minorMode && (
              <RiskAssessSection
                rows={form.riskAssessRows}
                onChange={(rows) => {
                  setForm((prev) => ({ ...prev, riskAssessRows: rows }));
                  setDirty(true);
                }}
                sectionRef={(el) => { sectionRefs.current['risk-assess'] = el; }}
              />
            )}

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
