import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  argumentApplyRecords,
  argumentProjectTypes,
  argumentBuildUnits,
  argumentDivisions,
  argumentImplementUnits,
  argumentProfessionalUnits,
  projectPlans,
  type ProjectPlan,
} from '@/mocks/argumentApplyMocks';
import ArgumentInfo3Table from '../components/ArgumentInfo3Table';
import EstimateTable from '../components/EstimateTable';
import ResearchPersonTable from '../components/ResearchPersonTable';
import RiskAssessTable from '../components/RiskAssessTable';
import ComputeResourceSection, { type ComputeResourceRow } from '@/components/feature/ComputeResourceSection';

const SECTIONS = [
  { id: 'info1', title: '论证基本信息1', icon: 'ri-file-info-line' },
  { id: 'info2', title: '论证基本信息2', icon: 'ri-file-text-line' },
  { id: 'info3', title: '论证基本信息3', icon: 'ri-table-line' },
  { id: 'estimate', title: '论证估算申请表', icon: 'ri-money-cny-circle-line' },
  { id: 'compute', title: '通算/智算资源配置', icon: 'ri-cloud-line' },
  { id: 'person', title: '项目研究报告人员', icon: 'ri-team-line' },
  { id: 'risk', title: '风险与机遇评估', icon: 'ri-shield-check-line' },
];

export default function ArgumentApplyFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const mode = searchParams.get('mode');
  const record = recordId ? argumentApplyRecords.find((r) => r.id === recordId) : null;
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  // Section 1 fields
  const [applyNo] = useState(record?.applyNo ?? `LZ-2026-${String(Date.now()).slice(-3)}`);
  const [planNo, setPlanNo] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<ProjectPlan | null>(null);
  const [applyName, setApplyName] = useState(record?.applyName ?? '');
  const [isSupplementProject, setIsSupplementProject] = useState('否');
  const [isSupplementArgument, setIsSupplementArgument] = useState('否');
  const [projectType, setProjectType] = useState(record?.projectType ?? '');
  const [isPreProject, setIsPreProject] = useState('否');
  const [preProjectNo, setPreProjectNo] = useState('');
  const [positionChange, setPositionChange] = useState('无');
  const [positionCount, setPositionCount] = useState('');
  const [division, setDivision] = useState(record?.division ?? '');
  const [implementUnit, setImplementUnit] = useState('');
  const [professionalUnit, setProfessionalUnit] = useState('');
  const [projectDuration, setProjectDuration] = useState('');
  const [applyFee, setApplyFee] = useState('');
  const [buildPeriod, setBuildPeriod] = useState('');
  const [status] = useState(record?.status ?? '草稿');
  const [necessity, setNecessity] = useState('');
  const [feasibility, setFeasibility] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [deviceFacility, setDeviceFacility] = useState('');

  // Section 2 fields
  const [auxWater, setAuxWater] = useState('');
  const [auxElec, setAuxElec] = useState('');
  const [auxGas, setAuxGas] = useState('');
  const [auxOxygen, setAuxOxygen] = useState('');
  const [auxOther, setAuxOther] = useState('');
  const [techTarget, setTechTarget] = useState('');
  const [benefitTarget, setBenefitTarget] = useState('');
  const [otherTarget, setOtherTarget] = useState('');
  const [innovation, setInnovation] = useState('');
  const [energyAssess, setEnergyAssess] = useState('');
  const [costAnalysis, setCostAnalysis] = useState('');
  const [buildPeriodAttachments, setBuildPeriodAttachments] = useState<{ id: string; name: string }[]>([]);

  const [activeSection, setActiveSection] = useState('info1');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState<'cancel' | 'submit'>('cancel');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planSearchNo, setPlanSearchNo] = useState('');
  const [planSearchName, setPlanSearchName] = useState('');
  const [planSearchType, setPlanSearchType] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Compute resource state
  const [tongSuanHas, setTongSuanHas] = useState('否');
  const [zhiSuanHas, setZhiSuanHas] = useState('否');
  const [tongSuanRows, setTongSuanRows] = useState<ComputeResourceRow[]>([]);
  const [zhiSuanRows, setZhiSuanRows] = useState<ComputeResourceRow[]>([]);

  const filteredPlans = useMemo(() => {
    return projectPlans.filter((p) => {
      if (planSearchNo && !p.planNo.includes(planSearchNo)) return false;
      if (planSearchName && !p.planName.includes(planSearchName)) return false;
      if (planSearchType && p.projectType !== planSearchType) return false;
      return true;
    });
  }, [planSearchNo, planSearchName, planSearchType]);

  const handleSelectPlan = (plan: ProjectPlan) => {
    setSelectedPlan(plan);
    setPlanNo(plan.planNo);
    setApplyName(plan.planName);
    setProjectType(plan.projectType);
    setApplyFee(`¥${plan.estimateTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    setShowPlanModal(false);
  };

  const handlePlanNoClick = () => {
    if (!isView) setShowPlanModal(true);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibilityMap: Record<string, number> = {};
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibilityMap[id] = entry.intersectionRatio;
          const maxId = Object.entries(visibilityMap).sort((a, b) => b[1] - a[1])[0]?.[0];
          if (maxId) setActiveSection(maxId);
        },
        { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-80px 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  }, []);

  const validate = () => {
    if (!planNo.trim()) { showToast('请选择年度计划号', 'error'); return false; }
    if (!applyName.trim()) { showToast('请填写论证申请名称', 'error'); return false; }
    if (!projectType) { showToast('请选择项目类型', 'error'); return false; }
    if (!division) { showToast('请选择事业部', 'error'); return false; }
    if (!implementUnit) { showToast('请选择实施责任单位', 'error'); return false; }
    if (!professionalUnit) { showToast('请选择专业主管单位', 'error'); return false; }
    if (necessity.trim().length < 10) { showToast('项目必要性不少于10字符', 'error'); return false; }
    if (feasibility.trim().length < 10) { showToast('项目可行性不少于10字符', 'error'); return false; }
    if (mainContent.trim().length < 10) { showToast('项目主要内容不少于10字符', 'error'); return false; }
    return true;
  };

  const handleSaveDraft = () => {
    if (!applyName.trim()) { showToast('请填写论证申请名称', 'error'); return; }
    showToast('保存成功，状态已更新为草稿');
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setConfirmType('submit');
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setConfirmType('cancel');
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (confirmType === 'cancel') {
      navigate('/project-argument/apply');
    } else {
      showToast('呈核成功，已提交至领导审批流程，状态更新为审批中');
      setTimeout(() => navigate('/project-argument/apply'), 1500);
    }
    setShowConfirm(false);
  };

  const handleBuildPeriodUpload = () => {
    if (isView) return;
    const newFile = { id: `bf_${Date.now()}`, name: `建设工期附件_${buildPeriodAttachments.length + 1}.pdf` };
    setBuildPeriodAttachments((prev) => [...prev, newFile]);
    showToast('附件上传成功');
  };

  const handleBuildPeriodRemove = (fileId: string) => {
    setBuildPeriodAttachments((prev) => prev.filter((f) => f.id !== fileId));
    showToast('附件已删除');
  };

  const inputCls = `w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${isView ? 'bg-slate-50 text-steel-600' : 'bg-white'}`;
  const selectCls = inputCls + ' cursor-pointer';
  const textareaCls = `w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none ${isView ? 'bg-slate-50 text-steel-600' : 'bg-white'}`;
  const readonlyCls = 'w-full px-3 py-2 text-sm border border-steel-100 rounded-md bg-slate-50 text-steel-600';
  const labelCls = 'flex justify-end items-start text-sm text-steel-600 pt-2 leading-5 flex-shrink-0';
  const sectionHeaderCls = 'flex items-center gap-2.5 px-5 py-3.5';

  const radioGroup = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: string[],
    required = false
  ) => (
    <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
      <label className={labelCls}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-4 pt-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name={label} value={opt} checked={value === opt}
              onChange={() => !isView && onChange(opt)}
              disabled={isView}
              className="text-primary-500 cursor-pointer" />
            <span className="text-sm text-steel-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const formField = (
    label: string,
    content: React.ReactNode,
    required = false,
    colSpan = false
  ) => (
    <div className={`grid gap-3 items-start ${colSpan ? 'col-span-2 grid-cols-[130px_1fr]' : 'grid-cols-[130px_1fr]'}`}>
      <label className={labelCls}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {content}
    </div>
  );

  return (
    <Layout mainClassName="flex-1 relative">
      <div className="flex" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
        {/* Left Anchor Nav */}
        <div className="fixed z-30 flex flex-col py-5"
          style={{ left: '14rem', top: '3.5rem', width: '200px', height: 'calc(100vh - 3.5rem)', background: 'white', borderRight: '1px solid #e8edf3' }}>
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-steel-400 uppercase tracking-wider">表单导航</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3">
            {SECTIONS.map((sec, idx) => (
              <button key={sec.id} onClick={() => scrollToSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all cursor-pointer mb-0.5 text-left ${activeSection === sec.id ? 'font-medium' : 'text-steel-500 hover:text-steel-700 hover:bg-slate-50'}`}
                style={activeSection === sec.id ? { color: '#2563eb', backgroundColor: '#eff6ff' } : undefined}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={activeSection === sec.id ? { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white' } : { backgroundColor: '#e8edf3', color: '#718096' }}>
                  {idx + 1}
                </div>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xs">{sec.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Form Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6" style={{ marginLeft: '200px' }}>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-steel-900">
              {isView ? '查看论证申请' : isEdit ? '编辑论证申请' : '新增论证申请'}
            </h2>
            <p className="text-xs text-steel-400 mt-0.5">
              {isView ? '当前为只读模式，不可编辑' : '请填写论证申请信息，带 * 号为必填项'}
            </p>
          </div>

          {/* Section 1: 论证基本信息1 */}
          <div id="info1" ref={(el) => { sectionRefs.current['info1'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-info-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">一、论证基本信息1</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* 年度计划号 */}
                {formField('年度计划号', (
                  <div className="relative">
                    <input value={planNo} readOnly
                      onClick={handlePlanNoClick}
                      className={`${readonlyCls} ${!isView ? 'cursor-pointer hover:border-primary-300 transition-colors' : ''}`}
                      placeholder="点击选择年度计划" />
                    {!isView && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-search-line text-steel-400" />
                        </div>
                      </div>
                    )}
                  </div>
                ), true)}
                {/* 论证申请单号 */}
                {formField('论证申请单号', <input value={applyNo} readOnly className={readonlyCls} />)}
                {/* 是否增补立项 */}
                {radioGroup('是否增补立项', isSupplementProject, setIsSupplementProject, ['是', '否'])}
                {/* 是否增补论证 */}
                {radioGroup('是否增补论证', isSupplementArgument, setIsSupplementArgument, ['是', '否'])}
                {/* 论证申请名称 */}
                {formField('论证申请名称', <input value={applyName} onChange={(e) => !isView && setApplyName(e.target.value)} placeholder="选择年度计划后自动带入" className={inputCls} readOnly={isView} />, true)}
                {/* 项目类别 */}
                {formField('项目类别', (
                  <select value={projectType} onChange={(e) => !isView && setProjectType(e.target.value)} className={selectCls} disabled={isView}>
                    <option value="">请选择</option>
                    {argumentProjectTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                ), true)}
                {/* 是否预立项 */}
                {radioGroup('是否预立项', isPreProject, setIsPreProject, ['是', '否'])}
                {/* 预立项号 */}
                {formField('预立项号', <input value={preProjectNo} readOnly className={readonlyCls} placeholder="系统自动填充" />)}
                {/* 是否涉及岗位增减 */}
                {radioGroup('是否涉及岗位增减', positionChange, setPositionChange, ['无', '增加', '减少'])}
                {/* 岗位增减人数 */}
                {positionChange !== '无' && formField('岗位增减人数', (
                  <div className="relative">
                    <input type="number" value={positionCount} onChange={(e) => !isView && setPositionCount(e.target.value)} placeholder="请输入人数" className={inputCls + ' pr-8'} readOnly={isView} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">人</span>
                  </div>
                ))}
                {/* 项目人力配置方向说明 */}
                <div className="col-span-2">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex gap-2">
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-information-line text-amber-500 text-sm" />
                    </div>
                    <p className="text-xs text-amber-800">
                      <span className="font-medium">项目人力配置方向说明：</span>
                      无新增人力 / 无新增需求不管有无人员增减都需要上传项目人力资源方案
                    </p>
                  </div>
                </div>
                {/* 事业部 */}
                {formField('事业部', (
                  <select value={division} onChange={(e) => !isView && setDivision(e.target.value)} className={selectCls} disabled={isView}>
                    <option value="">请选择</option>
                    {argumentDivisions.map((d) => <option key={d}>{d}</option>)}
                  </select>
                ), true)}
                {/* 实施责任单位 */}
                {formField('实施责任单位', (
                  <select value={implementUnit} onChange={(e) => !isView && setImplementUnit(e.target.value)} className={selectCls} disabled={isView}>
                    <option value="">请选择</option>
                    {argumentImplementUnits.map((u) => <option key={u}>{u}</option>)}
                  </select>
                ), true)}
                {/* 专业主管单位 */}
                {formField('专业主管单位', (
                  <select value={professionalUnit} onChange={(e) => !isView && setProfessionalUnit(e.target.value)} className={selectCls} disabled={isView}>
                    <option value="">请选择</option>
                    {argumentProfessionalUnits.map((u) => <option key={u}>{u}</option>)}
                  </select>
                ), true)}
                {/* 项目工期 */}
                {formField('项目工期', (
                  <div className="relative">
                    <input type="number" value={projectDuration} onChange={(e) => !isView && setProjectDuration(e.target.value)} placeholder="请输入工期月数" className={inputCls + ' pr-10'} readOnly={isView} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">月</span>
                  </div>
                ))}
                {/* 申报费用 */}
                {formField('申报费用', <input value={applyFee} readOnly className={readonlyCls + ' font-semibold'} placeholder="选择年度计划后自动计算概算总额" />)}
                {/* 建设工期 */}
                {formField('建设工期', <input value={buildPeriod} onChange={(e) => !isView && setBuildPeriod(e.target.value)} placeholder="方案对比、选型、对标、考察情况" className={inputCls} readOnly={isView} />)}
                {/* 状态 */}
                {formField('状态', <input value={status} readOnly className={readonlyCls} />)}
                {/* 项目必要性 */}
                <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目必要性 <span className="text-red-500 ml-0.5">*</span></label>
                  <div>
                    <textarea value={necessity} onChange={(e) => !isView && setNecessity(e.target.value)} rows={4} maxLength={500} placeholder="主要阐述项目的必要性，500字以内" className={textareaCls} readOnly={isView} />
                    <p className="text-xs text-steel-400 mt-1 text-right">{necessity.length}/500</p>
                  </div>
                </div>
                {/* 项目可行性 */}
                <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目可行性 <span className="text-red-500 ml-0.5">*</span></label>
                  <div>
                    <textarea value={feasibility} onChange={(e) => !isView && setFeasibility(e.target.value)} rows={4} maxLength={500} placeholder="方案对比、选型、对标、考察情况" className={textareaCls} readOnly={isView} />
                    <p className="text-xs text-steel-400 mt-1 text-right">{feasibility.length}/500</p>
                  </div>
                </div>
                {/* 项目主要内容 */}
                <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目主要内容 <span className="text-red-500 ml-0.5">*</span></label>
                  <div>
                    <textarea value={mainContent} onChange={(e) => !isView && setMainContent(e.target.value)} rows={4} maxLength={500} placeholder="项目建设内容，包括工艺布置、设备选型、安全三同时等" className={textareaCls} readOnly={isView} />
                    <p className="text-xs text-steel-400 mt-1 text-right">{mainContent.length}/500</p>
                  </div>
                </div>
                {/* 主要设备/设施 */}
                <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                  <label className={labelCls}>主要设备/设施</label>
                  <textarea value={deviceFacility} onChange={(e) => !isView && setDeviceFacility(e.target.value)} rows={3} maxLength={500} placeholder="材质、寿命、可靠性" className={textareaCls} readOnly={isView} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 论证基本信息2 */}
          <div id="info2" ref={(el) => { sectionRefs.current['info2'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-text-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">二、论证基本信息2</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* 公辅配套 */}
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-steel-500 mb-3 pb-2 border-b border-steel-100">公辅配套</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                      <label className={labelCls}>水</label>
                      <textarea value={auxWater} onChange={(e) => !isView && setAuxWater(e.target.value)} rows={2} maxLength={500} placeholder="对水、电、气/汽/公辅的配套要求" className={textareaCls} readOnly={isView} />
                    </div>
                    <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                      <label className={labelCls}>电</label>
                      <textarea value={auxElec} onChange={(e) => !isView && setAuxElec(e.target.value)} rows={2} maxLength={500} placeholder="请输入" className={textareaCls} readOnly={isView} />
                    </div>
                    <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                      <label className={labelCls}>燃气</label>
                      <textarea value={auxGas} onChange={(e) => !isView && setAuxGas(e.target.value)} rows={2} maxLength={500} placeholder="请输入" className={textareaCls} readOnly={isView} />
                    </div>
                    <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                      <label className={labelCls}>氧气/氩气（汽）</label>
                      <textarea value={auxOxygen} onChange={(e) => !isView && setAuxOxygen(e.target.value)} rows={2} maxLength={500} placeholder="请输入" className={textareaCls} readOnly={isView} />
                    </div>
                    <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                      <label className={labelCls}>其他</label>
                      <textarea value={auxOther} onChange={(e) => !isView && setAuxOther(e.target.value)} rows={2} maxLength={500} placeholder="请输入" className={textareaCls} readOnly={isView} />
                    </div>
                  </div>
                </div>

                {/* 项目目标 */}
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-steel-500 mb-3 pb-2 border-b border-steel-100">项目目标</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                      <label className={labelCls}>技术目标</label>
                      <textarea value={techTarget} onChange={(e) => !isView && setTechTarget(e.target.value)} rows={3} maxLength={500} placeholder="生产/设备/工艺" className={textareaCls} readOnly={isView} />
                    </div>
                    <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                      <label className={labelCls}>效益效果</label>
                      <textarea value={benefitTarget} onChange={(e) => !isView && setBenefitTarget(e.target.value)} rows={3} maxLength={500} placeholder="请输入效益效果" className={textareaCls} readOnly={isView} />
                    </div>
                    <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                      <label className={labelCls}>其它目标</label>
                      <textarea value={otherTarget} onChange={(e) => !isView && setOtherTarget(e.target.value)} rows={2} maxLength={500} placeholder="安全、环保等" className={textareaCls} readOnly={isView} />
                    </div>
                  </div>
                </div>

                {/* 创新性、智能数字化 */}
                <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                  <label className={labelCls}>创新性、智能数字化</label>
                  <textarea value={innovation} onChange={(e) => !isView && setInnovation(e.target.value)} rows={3} maxLength={500} placeholder="请输入创新性、智能数字化相关内容" className={textareaCls} readOnly={isView} />
                </div>

                {/* 能源的提升与评估 */}
                <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                  <label className={labelCls}>能源提升与评估</label>
                  <textarea value={energyAssess} onChange={(e) => !isView && setEnergyAssess(e.target.value)} rows={3} maxLength={500} placeholder="实施前后能耗的变化，采取的节能降耗措施/新技术" className={textareaCls} readOnly={isView} />
                </div>

                {/* 费用的估算/相关需求分析 */}
                <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                  <label className={labelCls}>费用估算/需求分析</label>
                  <textarea value={costAnalysis} onChange={(e) => !isView && setCostAnalysis(e.target.value)} rows={3} maxLength={500} placeholder="请输入费用估算及相关需求分析" className={textareaCls} readOnly={isView} />
                </div>

                {/* 建设工期附件 */}
                <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                  <label className={labelCls}>建设工期附件</label>
                  <div>
                    {buildPeriodAttachments.length > 0 && (
                      <div className="space-y-1.5 mb-2">
                        {buildPeriodAttachments.map((file) => (
                          <div key={file.id} className="flex items-center justify-between bg-slate-50 border border-steel-200 rounded-md px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-pdf-line text-red-500" /></div>
                              <span className="text-sm text-steel-700">{file.name}</span>
                            </div>
                            {!isView && (
                              <button onClick={() => handleBuildPeriodRemove(file.id)} className="w-5 h-5 flex items-center justify-center text-steel-400 hover:text-red-500 cursor-pointer">
                                <i className="ri-close-line" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      onClick={handleBuildPeriodUpload}
                      className={`border-2 border-dashed border-steel-200 rounded-lg p-4 text-center transition-colors ${!isView ? 'hover:border-primary-300 cursor-pointer' : ''}`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-1.5">
                        <i className="ri-upload-cloud-2-line text-steel-400" />
                      </div>
                      <p className="text-sm text-steel-500">点击上传建设工期附件</p>
                      <p className="text-xs text-steel-400 mt-0.5">支持 PDF、DOC、XLS、图片等格式</p>
                    </div>
                  </div>
                </div>

                {/* 论证文件上传 */}
                <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                  <label className={labelCls}>
                    论证文件上传
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div>
                    <div className="border-2 border-dashed border-steel-200 rounded-lg p-5 text-center hover:border-primary-300 transition-colors cursor-pointer">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                        <i className="ri-upload-cloud-2-line text-xl text-steel-400" />
                      </div>
                      <p className="text-sm text-steel-500">点击上传或拖拽文件到此处</p>
                      <p className="text-xs text-steel-400 mt-1">必传附件，支持 PDF、DOC、XLS、图片等格式，单个文件不超过50MB</p>
                    </div>
                    <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                      <i className="ri-information-line" />
                      示例件：请参考系统提供的论证文件示例模板
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 论证基本信息3 */}
          <div id="info3" ref={(el) => { sectionRefs.current['info3'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-table-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">三、论证基本信息3</h3>
            </div>
            <div className="p-5">
              <ArgumentInfo3Table />
            </div>
          </div>

          {/* Section 4: 论证估算申请表 */}
          <div id="estimate" ref={(el) => { sectionRefs.current['estimate'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-money-cny-circle-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">四、论证估算申请表</h3>
            </div>
            <div className="p-5">
              <EstimateTable />
            </div>
          </div>

          {/* Section: 通算/智算资源配置 */}
          <ComputeResourceSection
            tongSuanHas={tongSuanHas}
            zhiSuanHas={zhiSuanHas}
            tongSuanRows={tongSuanRows}
            zhiSuanRows={zhiSuanRows}
            onTongSuanHasChange={setTongSuanHas}
            onZhiSuanHasChange={setZhiSuanHas}
            onTongSuanRowsChange={setTongSuanRows}
            onZhiSuanRowsChange={setZhiSuanRows}
            readonly={isView}
            sectionRef={(el) => { sectionRefs.current['compute'] = el; }}
          />

          {/* Section 5: 项目研究报告人员 */}
          <div id="person" ref={(el) => { sectionRefs.current['person'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-team-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">五、项目研究报告人员</h3>
            </div>
            <div className="p-5">
              <ResearchPersonTable />
            </div>
          </div>

          {/* Section 6: 风险与机遇评估 */}
          <div id="risk" ref={(el) => { sectionRefs.current['risk'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-shield-check-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">六、风险与机遇评估</h3>
            </div>
            <div className="p-5">
              <RiskAssessTable />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {!isView && (
        <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
          style={{ left: 'calc(14rem + 200px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
          <button onClick={handleCancel}
            className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
            取消
          </button>
          <button onClick={handleSaveDraft}
            className="px-5 py-2 text-sm text-steel-700 border border-steel-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5">
            <i className="ri-save-line" />
            保存草稿
          </button>
          <button onClick={handleSubmit}
            className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            <i className="ri-send-plane-line" />
            呈核
          </button>
        </div>
      )}
      {isView && (
        <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
          style={{ left: 'calc(14rem + 200px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
          <button onClick={() => navigate('/project-argument/apply')}
            className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
            返回列表
          </button>
        </div>
      )}

      {/* Project Plan Selection Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPlanModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[900px] max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-semibold text-steel-800">选择年度计划</h3>
                <p className="text-xs text-steel-400 mt-0.5">选择一个年度计划后，系统将自动带出年度计划号及项目信息</p>
              </div>
              <button onClick={() => setShowPlanModal(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-steel-100 flex-shrink-0">
              <div className="grid grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-steel-500 whitespace-nowrap">年度计划号</label>
                  <input value={planSearchNo} onChange={(e) => setPlanSearchNo(e.target.value)} placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-steel-500 whitespace-nowrap">年度计划名称</label>
                  <input value={planSearchName} onChange={(e) => setPlanSearchName(e.target.value)} placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-steel-500 whitespace-nowrap">项目类型</label>
                  <select value={planSearchType} onChange={(e) => setPlanSearchType(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer">
                    <option value="">全部</option>
                    {argumentProjectTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => { setPlanSearchNo(''); setPlanSearchName(''); setPlanSearchType(''); }}
                    className="px-3 py-1.5 text-xs text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                    重置
                  </button>
                  <button className="px-4 py-1.5 text-xs text-white rounded-md hover:opacity-90 cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                    查询
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">年度计划号</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">年度计划名称</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">事业部</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap text-right">概算总额</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-20 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-file-list-3-line text-steel-300" /></div>
                          <p className="text-sm text-steel-400">暂无匹配的计划数据</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPlans.map((plan, idx) => (
                      <tr key={plan.id} className={`border-b border-steel-100 hover:bg-slate-50 transition-colors cursor-pointer ${selectedPlan?.id === plan.id ? 'bg-primary-50' : ''}`}
                        onClick={() => handleSelectPlan(plan)}>
                        <td className="px-4 py-2.5 text-sm text-steel-500">{idx + 1}</td>
                        <td className="px-4 py-2.5 text-sm text-primary-600 font-mono font-medium whitespace-nowrap">{plan.planNo}</td>
                        <td className="px-4 py-2.5 text-sm text-steel-700 whitespace-nowrap">{plan.planName}</td>
                        <td className="px-4 py-2.5 text-sm text-steel-600 whitespace-nowrap">{plan.projectType}</td>
                        <td className="px-4 py-2.5 text-sm text-steel-600 whitespace-nowrap">{plan.division}</td>
                        <td className="px-4 py-2.5 text-sm text-steel-700 text-right font-mono whitespace-nowrap">¥{plan.estimateTotal.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan); }}
                            className="px-3 py-1 text-xs text-white rounded-md hover:opacity-90 cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                            选择
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-steel-200 flex justify-end flex-shrink-0">
              <button onClick={() => setShowPlanModal(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[420px] p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmType === 'cancel' ? 'bg-amber-100' : 'bg-green-100'}`}>
                <i className={`text-lg ${confirmType === 'cancel' ? 'ri-question-line text-amber-600' : 'ri-send-plane-line text-green-600'}`} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-steel-800 mb-1">
                  {confirmType === 'cancel' ? '放弃编辑' : '确认呈核'}
                </h3>
                <p className="text-sm text-steel-500">
                  {confirmType === 'cancel'
                    ? '确定要放弃当前编辑内容并返回列表吗？未保存的数据将被丢弃。'
                    : '确认无误后将提交论证申请至领导审批流程，状态将更新为"审批中"，是否继续？'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                取消
              </button>
              <button onClick={handleConfirm}
                className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 cursor-pointer whitespace-nowrap"
                style={{ background: confirmType === 'cancel' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                {confirmType === 'cancel' ? '确认放弃' : '确认呈核'}
              </button>
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