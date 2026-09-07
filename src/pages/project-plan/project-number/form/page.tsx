import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  projectNumberRecords,
  projectNumberDivisions,
  projectNumberUnits,
  projectNumberClassification,
  projectNumberEngineeringTypes,
  projectNumberOwnerUnits,
} from '@/mocks/projectNumberMocks';
import type { ProjectNumberRecord } from '@/mocks/projectNumberMocks';

const SECTIONS = [
  { id: 'basic',    title: '基本信息',       icon: 'ri-file-info-line' },
  { id: 'plan',     title: '计划信息',       icon: 'ri-calendar-line' },
  { id: 'unit',     title: '单位信息',       icon: 'ri-building-2-line' },
  { id: 'assess',   title: '评估信息',       icon: 'ri-shield-check-line' },
  { id: 'attach',   title: '附件上传',       icon: 'ri-attachment-line' },
];

function getRecord(id: string | null): ProjectNumberRecord | null {
  if (!id) return null;
  return projectNumberRecords.find((r) => r.id === id) ?? null;
}

export default function ProjectNumberFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const mode = searchParams.get('mode');
  const record = getRecord(recordId);
  const isEdit = !!record && mode === 'edit';

  // Form fields
  const [projectNo, setProjectNo] = useState(record?.projectNo ?? '');
  const [isPlanInternal, setIsPlanInternal] = useState(record?.isPlanInternal ? '是' : '否');
  const [projectName, setProjectName] = useState(record?.projectName ?? '');
  const [projectDesc, setProjectDesc] = useState('');
  const [remark, setRemark] = useState('');
  const [initialDesc, setInitialDesc] = useState('');
  const [classification, setClassification] = useState(record?.status === 'active' ? '正式立项' : '正式立项');
  const [division, setDivision] = useState(record?.division ?? projectNumberDivisions[0]);
  const [otherUnits, setOtherUnits] = useState<string[]>([]);
  const [isPreProject, setIsPreProject] = useState(record?.isPreProject ? '是' : '否');
  const [projectAmount, setProjectAmount] = useState(record?.projectAmount?.toFixed(2) ?? '0.00');
  const [isPreSupplement, setIsPreSupplement] = useState('否');
  const [projectDate, setProjectDate] = useState(record?.projectDate ?? '');
  const [planStartDate, setPlanStartDate] = useState(record?.planStartDate ?? '');
  const [planEndDate, setPlanEndDate] = useState(record?.planEndDate ?? '');
  const [progress, setProgress] = useState('');
  const [implementUnit, setImplementUnit] = useState(record?.implementUnit ?? projectNumberUnits[0]);
  const [projectManager, setProjectManager] = useState(record?.projectManager ?? '');
  const [needSafety, setNeedSafety] = useState(record?.needSafetyAssessment ? '是' : '否');
  const [planNo, setPlanNo] = useState(record?.planNo ?? '');
  const [engType, setEngType] = useState(projectNumberEngineeringTypes[0]);
  const [ownerUnit, setOwnerUnit] = useState(record?.ownerUnit ?? projectNumberOwnerUnits[0]);
  const [managerPhone, setManagerPhone] = useState(record?.managerPhone ?? '');
  const [activeSection, setActiveSection] = useState('basic');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showPlanSearch, setShowPlanSearch] = useState(false);
  const [planSearchText, setPlanSearchText] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-100px 0px -50% 0px' }
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

  const handleSubmit = () => {
    if (!projectNo.trim()) { showToast('请输入立项号', 'error'); return; }
    if (!projectName.trim()) { showToast('请输入项目名称', 'error'); return; }
    if (!planNo.trim()) { showToast('请输入年度计划号', 'error'); return; }
    showToast(isEdit ? '修改成功' : '保存成功');
    setTimeout(() => navigate('/project-plan/project-number'), 1000);
  };

  const handleCancel = () => navigate('/project-plan/project-number');

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white';
  const selectCls = inputCls + ' cursor-pointer';
  const readonlyCls = 'w-full px-3 py-2 text-sm border border-steel-100 rounded-md bg-slate-50 text-steel-600';
  const labelCls = 'flex justify-end items-start text-sm text-steel-600 pt-2 leading-5';
  const sectionHeaderCls = 'flex items-center gap-2.5 px-5 py-3.5';

  const planSearchResults = [
    { planNo: '26J32500', name: '中普商业智能平台数字化整合提升', division: '科技质量部' },
    { planNo: '26J51200', name: '科技质量基础新型高效净化水系统', division: '安全环保部' },
    { planNo: '26J40300', name: '第三炼钢厂内产线30m行车组合升级改造', division: '炼钢事业部' },
    { planNo: '26J30400', name: '特殊智能运矿人员管理系统', division: '炼铁事业部' },
    { planNo: '26J30300', name: '钢铁业务园区内区QMS系统建设', division: '科技质量部' },
  ].filter((p) => !planSearchText || p.planNo.includes(planSearchText) || p.name.includes(planSearchText));

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
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{sec.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Form Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6" style={{ marginLeft: '200px' }}>
          {/* Title */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-steel-900">
                {isEdit ? '修改立项号' : '手动新增立项号'}
              </h2>
              <p className="text-xs text-steel-400 mt-0.5">
                {isEdit ? `正在修改「${record?.projectNo}」的立项信息` : '请填写立项号基本信息，带 * 号为必填项'}
              </p>
            </div>
          </div>

          {/* Top Notice */}
          {!isEdit && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-information-line text-amber-500 text-base" />
              </div>
              <div className="text-xs text-amber-800 leading-relaxed">
                <span className="font-medium">提示：</span>
                手动新增立项号时，21年及21年以后数据，则启用新流程。请确保填写的立项号信息准确完整。
              </div>
            </div>
          )}

          {/* Section 1: 基本信息 */}
          <div id="basic" ref={(el) => { sectionRefs.current['basic'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-info-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">基本信息</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* 立项号 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>立项号 <span className="text-red-500 ml-0.5">*</span></label>
                  <input value={projectNo} onChange={(e) => setProjectNo(e.target.value)} placeholder="请输入立项号" className={isEdit ? readonlyCls : inputCls} readOnly={isEdit} />
                </div>
                {/* 是否计划内 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>是否计划内 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={isPlanInternal} onChange={(e) => setIsPlanInternal(e.target.value)} className={selectCls}>
                    <option value="">请选择</option>
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
                {/* 项目名称 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目名称 <span className="text-red-500 ml-0.5">*</span></label>
                  <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="请输入项目名称" className={inputCls} />
                </div>
                {/* 立项分类 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>立项分类 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={classification} onChange={(e) => setClassification(e.target.value)} className={selectCls}>
                    {projectNumberClassification.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* 立项说明 */}
                <div className="col-span-2 grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>立项说明</label>
                  <textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} placeholder="请输入立项说明" rows={3} maxLength={500} className={inputCls + ' resize-none'} />
                </div>
                {/* 备注 */}
                <div className="col-span-2 grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>备注</label>
                  <textarea value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="请输入备注" rows={2} maxLength={500} className={inputCls + ' resize-none'} />
                </div>
                {/* 初始立项说明 */}
                <div className="col-span-2 grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>初始立项说明</label>
                  <textarea value={initialDesc} onChange={(e) => setInitialDesc(e.target.value)} placeholder="请输入初始立项说明" rows={3} maxLength={500} className={inputCls + ' resize-none'} />
                </div>
                {/* 项目报审资料 */}
                <div className="col-span-2 grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目报审资料</label>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                      <i className="ri-upload-cloud-2-line" />
                      项目报审资料上传
                    </button>
                    <span className="text-xs text-steel-400">无附件</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 计划信息 */}
          <div id="plan" ref={(el) => { sectionRefs.current['plan'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-calendar-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">计划信息</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* 所属事业部 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>所属事业部 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={division} onChange={(e) => setDivision(e.target.value)} className={selectCls}>
                    {projectNumberDivisions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                {/* 其他参与单位 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>其他参与单位</label>
                  <div className="border border-steel-200 rounded-md p-2 max-h-32 overflow-y-auto bg-white">
                    {projectNumberUnits.map((u) => (
                      <label key={u} className="flex items-center gap-2 py-1 cursor-pointer">
                        <input type="checkbox" checked={otherUnits.includes(u)}
                          onChange={(e) => {
                            if (e.target.checked) setOtherUnits((prev) => [...prev, u]);
                            else setOtherUnits((prev) => prev.filter((x) => x !== u));
                          }}
                          className="rounded border-steel-300 text-primary-500 cursor-pointer" />
                        <span className="text-sm text-steel-700">{u}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* 是否预立项 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>是否预立项</label>
                  <select value={isPreProject} onChange={(e) => setIsPreProject(e.target.value)} className={selectCls}>
                    <option value="">请选择</option>
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
                {/* 立项金额 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>立项金额</label>
                  <div className="relative">
                    <input type="number" min={0} step="1" value={projectAmount}
                      onChange={(e) => setProjectAmount(e.target.value)} placeholder="0.00" className={inputCls + ' pr-12'} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">万元</span>
                  </div>
                </div>
                {/* 是否预补立项 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>是否预补立项</label>
                  <select value={isPreSupplement} onChange={(e) => setIsPreSupplement(e.target.value)} className={selectCls}>
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
                </div>
                {/* 立项日期 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>立项日期</label>
                  <input type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} className={inputCls} />
                </div>
                {/* 计划开始日期 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>计划开始日期</label>
                  <input type="date" value={planStartDate} onChange={(e) => setPlanStartDate(e.target.value)} className={inputCls} />
                </div>
                {/* 计划完成时间 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>
                    <span>计划完成时间</span>
                    <span className="ml-1 group relative cursor-help">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-information-line text-steel-400 text-xs" />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-steel-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        计划完成时间 = 数字化项目上线日期
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-steel-800" />
                      </div>
                    </span>
                  </label>
                  <input type="date" value={planEndDate} onChange={(e) => setPlanEndDate(e.target.value)} className={inputCls} min={planStartDate || undefined} />
                </div>
                {/* 项目进展情况 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目进展情况</label>
                  <input value={progress} onChange={(e) => setProgress(e.target.value)} placeholder="请输入项目进展情况" className={inputCls} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 单位信息 */}
          <div id="unit" ref={(el) => { sectionRefs.current['unit'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-building-2-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">单位信息</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* 实施主管单位 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>实施主管单位</label>
                  <select value={implementUnit} onChange={(e) => setImplementUnit(e.target.value)} className={selectCls}>
                    {projectNumberUnits.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                {/* 项目负责人 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目负责人</label>
                  <input value={projectManager} onChange={(e) => setProjectManager(e.target.value)} placeholder="请输入项目负责人" className={inputCls} />
                </div>
                {/* 项目负责人电话 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>负责人电话</label>
                  <input type="tel" value={managerPhone} onChange={(e) => setManagerPhone(e.target.value)} placeholder="请输入联系电话" className={inputCls} />
                </div>
                {/* 年度计划号 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>年度计划号 <span className="text-red-500 ml-0.5">*</span></label>
                  <div className="relative">
                    <input value={planNo} onChange={(e) => setPlanNo(e.target.value)} placeholder="请输入或搜索年度计划号" className={inputCls + ' pr-10'} />
                    <button onClick={() => setShowPlanSearch(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-steel-400 hover:text-primary-500 transition-colors cursor-pointer">
                      <i className="ri-search-line text-sm" />
                    </button>
                  </div>
                </div>
                {/* 工程类型 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>工程类型 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={engType} onChange={(e) => setEngType(e.target.value)} className={selectCls}>
                    {projectNumberEngineeringTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {/* 业主单位 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>业主单位 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={ownerUnit} onChange={(e) => setOwnerUnit(e.target.value)} className={selectCls}>
                    {projectNumberOwnerUnits.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: 评估信息 */}
          <div id="assess" ref={(el) => { sectionRefs.current['assess'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-shield-check-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">评估信息</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* 是否需要职业健康安全评估 */}
                <div className="grid grid-cols-[140px_1fr] gap-3 items-start">
                  <label className={labelCls}>职业健康安全评估</label>
                  <select value={needSafety} onChange={(e) => setNeedSafety(e.target.value)} className={selectCls}>
                    <option value="">请选择</option>
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: 附件上传 */}
          <div id="attach" ref={(el) => { sectionRefs.current['attach'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-attachment-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">附件上传</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目提交资料</label>
                  <div className="border-2 border-dashed border-steel-200 rounded-lg p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                      <i className="ri-upload-cloud-2-line text-xl text-steel-400" />
                    </div>
                    <p className="text-sm text-steel-500">点击上传或拖拽文件到此处</p>
                    <p className="text-xs text-steel-400 mt-1">支持 PDF、DOC、XLS、图片等格式，单个文件不超过50MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>初步设计审查资料</label>
                  <div className="border-2 border-dashed border-steel-200 rounded-lg p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                      <i className="ri-upload-cloud-2-line text-xl text-steel-400" />
                    </div>
                    <p className="text-sm text-steel-500">点击上传或拖拽文件到此处</p>
                    <p className="text-xs text-steel-400 mt-1">支持 PDF、DOC、XLS、图片等格式，单个文件不超过50MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
        style={{ left: 'calc(14rem + 200px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={handleCancel}
          className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
          取消
        </button>
        <button onClick={handleSubmit}
          className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          <i className="ri-check-line" />
          提交
        </button>
      </div>

      {/* Plan Search Modal */}
      {showPlanSearch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPlanSearch(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[600px] max-h-[70vh] flex flex-col" style={{ maxWidth: '90vw' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
              <h3 className="text-base font-semibold text-steel-800">选择年度计划号</h3>
              <button onClick={() => setShowPlanSearch(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 hover:text-steel-600 transition-colors cursor-pointer">
                <i className="ri-close-line text-lg" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-3">
                <input value={planSearchText} onChange={(e) => setPlanSearchText(e.target.value)}
                  placeholder="搜索年度计划号或项目名称" className={inputCls + ' pr-10'} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line text-steel-300" />
                </div>
              </div>
              <div className="border border-steel-200 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-3 py-2 text-xs font-medium text-steel-500">年度计划号</th>
                      <th className="px-3 py-2 text-xs font-medium text-steel-500">年度计划名称</th>
                      <th className="px-3 py-2 text-xs font-medium text-steel-500">事业部</th>
                      <th className="px-3 py-2 text-xs font-medium text-steel-500 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planSearchResults.map((p) => (
                      <tr key={p.planNo} className="border-b border-steel-100 hover:bg-slate-50">
                        <td className="px-3 py-2.5 text-sm font-mono text-steel-700">{p.planNo}</td>
                        <td className="px-3 py-2.5 text-sm text-steel-800">{p.name}</td>
                        <td className="px-3 py-2.5 text-sm text-steel-600">{p.division}</td>
                        <td className="px-3 py-2.5 text-center">
                          <button onClick={() => { setPlanNo(p.planNo); setShowPlanSearch(false); }}
                            className="px-3 py-1 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                            选择
                          </button>
                        </td>
                      </tr>
                    ))}
                    {planSearchResults.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-center text-sm text-steel-400">未找到匹配的年度计划号</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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