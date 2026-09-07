import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { issuanceRecords, issuanceCompanyList, issuanceDivisionList, issuanceUnitList, issuanceProjectTypes } from '@/mocks/issuanceMocks';
import type { IssuanceRecord } from '@/mocks/issuanceMocks';
import { defaultBudgetTree } from '@/mocks/reviewMocks';
import type { BudgetTreeNode } from '@/mocks/reviewMocks';
import BudgetReviewTable from '@/pages/project-plan/review/form/components/BudgetReviewTable';

const SECTIONS = [
  { id: 'basic',  title: '基础信息',       icon: 'ri-file-info-line' },
  { id: 'budget', title: '项目立项概算表', icon: 'ri-table-line' },
];

function getRecord(id: string | null): IssuanceRecord | null {
  if (!id) return null;
  try {
    const stored = localStorage.getItem('ng_issuance_records');
    const records: IssuanceRecord[] = stored ? JSON.parse(stored) : issuanceRecords;
    return records.find((r) => r.id === id) ?? null;
  } catch { return null; }
}

function calcBudgetTotal(tree: BudgetTreeNode[]): number {
  const totalNode = tree.find((n) => n.category === 'total');
  return totalNode ? totalNode.total : 0;
}

export default function IssuanceFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const record = getRecord(recordId);

  // Form fields
  const [company, setCompany] = useState(issuanceCompanyList[0]);
  const [division, setDivision] = useState(issuanceDivisionList[0]);
  const [ownerUnit, setOwnerUnit] = useState(issuanceUnitList[0]);
  const [implUnit, setImplUnit] = useState(issuanceUnitList[1]);
  const [profUnit, setProfUnit] = useState(issuanceUnitList[2]);
  const [multiProject, setMultiProject] = useState('否');
  const [projectType, setProjectType] = useState(record?.projectType ?? issuanceProjectTypes[0]);
  const [remark, setRemark] = useState('');
  const [issueNote, setIssueNote] = useState('');
  const [annualBenefit, setAnnualBenefit] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetTree, setBudgetTree] = useState<BudgetTreeNode[]>(defaultBudgetTree);
  const [activeSection, setActiveSection] = useState('basic');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const budgetTotal = calcBudgetTotal(budgetTree);

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

  const handleSave = () => showToast('保存成功');

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white';
  const selectCls = inputCls + ' cursor-pointer';
  const readonlyCls = 'w-full px-3 py-2 text-sm border border-steel-100 rounded-md bg-slate-50 text-steel-600';
  const labelCls = 'flex justify-end items-start text-sm text-steel-600 pt-2 leading-5';
  const sectionHeaderCls = 'flex items-center gap-2.5 px-5 py-3.5';

  const RichTextArea = ({
    value, onChange, placeholder, rows = 4,
  }: { value: string; onChange: (v: string) => void; placeholder: string; rows?: number }) => (
    <div className="border border-steel-200 rounded-md overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-50 border-b border-steel-100">
        {['ri-bold', 'ri-italic', 'ri-list-unordered', 'ri-list-ordered', 'ri-link'].map((icon) => (
          <button key={icon} type="button"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-steel-400 cursor-pointer transition-colors">
            <i className={`${icon} text-xs`} />
          </button>
        ))}
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        rows={rows} maxLength={500} className="w-full px-3 py-2 text-sm focus:outline-none resize-none" />
      <div className="flex justify-end px-2 py-1 bg-slate-50 border-t border-steel-100">
        <span className="text-xs text-steel-400">{value.length}/500</span>
      </div>
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
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{sec.title}</span>
              </button>
            ))}
          </nav>

          {/* Budget amount quick display */}
          <div className="px-3 pb-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <p className="text-xs text-steel-400 mb-1">概算总额（下达）</p>
              <p className="text-base font-bold" style={{ color: '#16a34a' }}>{budgetTotal.toFixed(2)}</p>
              <p className="text-xs text-steel-400">万元</p>
            </div>
          </div>
        </div>

        {/* Right Form Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6" style={{ marginLeft: '200px' }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-steel-900">
                立项{record ? '修改' : '签发'}表单
              </h2>
              <p className="text-xs text-steel-400 mt-0.5">
                {record ? `正在修改「${record.applyName}」的立项信息` : '新建立项签发表单'}
              </p>
            </div>
            {record && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-steel-200 bg-slate-50">
                <span className="text-xs text-steel-400">论证申请单号：</span>
                <span className="text-xs font-medium text-steel-700">{record.applyNo}</span>
              </div>
            )}
          </div>

          {/* Section 1: 基础信息 */}
          <div id="basic" ref={(el) => { sectionRefs.current['basic'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-info-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">基础信息</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">

                {/* Readonly applyNo */}
                <div className="col-span-2 grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>论证申请单号</label>
                  <div className={readonlyCls}>{record?.applyNo ?? '系统自动生成'}</div>
                </div>

                {/* 公司别 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>公司别 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={company} onChange={(e) => setCompany(e.target.value)} className={selectCls}>
                    {issuanceCompanyList.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* 所属事业部 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>所属事业部 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={division} onChange={(e) => setDivision(e.target.value)} className={selectCls}>
                    {issuanceDivisionList.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* 业主单位 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>业主单位 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={ownerUnit} onChange={(e) => setOwnerUnit(e.target.value)} className={selectCls}>
                    {issuanceUnitList.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                {/* 实施主管单位 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>实施主管单位 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={implUnit} onChange={(e) => setImplUnit(e.target.value)} className={selectCls}>
                    {issuanceUnitList.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                {/* 专业主管单位 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>专业主管单位 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={profUnit} onChange={(e) => setProfUnit(e.target.value)} className={selectCls}>
                    {issuanceUnitList.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                {/* 是否下达多立项 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>是否下达多立项</label>
                  <select value={multiProject} onChange={(e) => setMultiProject(e.target.value)} className={selectCls}>
                    {['否', '是'].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {/* 项目类型 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目类型 <span className="text-red-500 ml-0.5">*</span></label>
                  <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className={selectCls}>
                    {issuanceProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* 审核年效益 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>审核年效益</label>
                  <div className="relative">
                    <input type="number" min={0} step="1" value={annualBenefit}
                      onChange={(e) => setAnnualBenefit(e.target.value)}
                      placeholder="0.00" className={inputCls + ' pr-12'} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">万元</span>
                  </div>
                </div>

                {/* 项目经理电话 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目经理电话</label>
                  <input type="tel" value={managerPhone} onChange={(e) => setManagerPhone(e.target.value)}
                    placeholder="请输入联系电话" className={inputCls} />
                </div>

                {/* 计划开工日期 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>计划开工日期</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
                </div>

                {/* 计划完工日期 */}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>计划完工日期</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls}
                    min={startDate || undefined} />
                </div>

                {/* 立项说明 */}
                <div className="col-span-2 grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>立项说明 <span className="text-red-500 ml-0.5">*</span></label>
                  <RichTextArea value={issueNote} onChange={setIssueNote}
                    placeholder="请填写立项说明，包括项目建设目标、主要建设内容及预期效果..." rows={5} />
                </div>

                {/* 备注 */}
                <div className="col-span-2 grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>备注</label>
                  <RichTextArea value={remark} onChange={setRemark}
                    placeholder="请填写备注信息..." rows={3} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 项目立项概算表（下达） */}
          <div id="budget" ref={(el) => { sectionRefs.current['budget'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-table-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">项目立项概算表（下达）</h3>
              <span className="text-xs text-steel-400 ml-1">树形层级结构，支持增删明细行，数值自动汇总</span>
            </div>
            <div className="p-5">
              <BudgetReviewTable
                treeData={budgetTree}
                onChange={setBudgetTree}
                budgetTotal={budgetTotal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
        style={{ left: 'calc(14rem + 200px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <span className="text-xs text-steel-400 mr-4 hidden lg:block">
          <i className="ri-information-line mr-1" />
          保存后数据将暂存，签发后项目正式立项
        </span>
        <button onClick={() => navigate('/project-plan/issuance')}
          className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
          取消
        </button>
        <button onClick={handleSave}
          className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          <i className="ri-save-line" />
          保存
        </button>
      </div>

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
