import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { applyRecords, applyProjectTypes, applyManagers, defaultBudgetItems } from '@/mocks/applyMocks';
import type { ApplyRecord, BudgetItem } from '@/mocks/applyMocks';
import BudgetModal from '../components/BudgetModal';

interface FormErrors { [key: string]: string; }

const SECTIONS = [
  { id: 'basic',       title: '基础信息',   icon: 'ri-file-info-line' },
  { id: 'opinion',     title: '论证意见',   icon: 'ri-chat-quote-line' },
  { id: 'investment',  title: '投资与效益', icon: 'ri-funds-line' },
  { id: 'personnel',   title: '人员与工期', icon: 'ri-team-line' },
  { id: 'attachment',  title: '附件上传',   icon: 'ri-attachment-line' },
  { id: 'budget',      title: '项目概算',   icon: 'ri-file-chart-line' },
];

function getStoredRecords(): ApplyRecord[] {
  try { const s = localStorage.getItem('ng_apply_records'); return s ? JSON.parse(s) : applyRecords; }
  catch { return applyRecords; }
}

const emptyForm: Partial<ApplyRecord> = {
  planNo: '', applyName: '', isPreApply: 0, preApplyNo: '', projectType: '',
  manager: '', necessity: '', planScheme: '', techIndicator: '',
  investAmount: undefined as unknown as number, benefitAmount: undefined as unknown as number,
  calcProcess: '', personnelChange: 0, personnelCount: 0, buildDuration: undefined as unknown as number,
};

interface UploadFile { name: string; size: string; }

export default function ApplyFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const isEdit = !!recordId;

  const [formData, setFormData] = useState<Partial<ApplyRecord>>(() => {
    if (recordId) {
      const found = getStoredRecords().find((r) => r.id === recordId);
      return found ? { ...found } : { ...emptyForm };
    }
    return { ...emptyForm };
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [activeSection, setActiveSection] = useState('basic');
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(defaultBudgetItems);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [attachments, setAttachments] = useState<Record<string, UploadFile | null>>({
    promise: null, opinion: null, committee: null, office: null, special: null,
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const budgetTotal = budgetItems.reduce((s, it) => s + it.total, 0);

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

  const handleChange = (field: keyof ApplyRecord, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleFileUpload = (key: string, file: File | null) => {
    if (!file) return;
    const size = file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)}MB` : `${(file.size / 1024).toFixed(0)}KB`;
    setAttachments((prev) => ({ ...prev, [key]: { name: file.name, size } }));
  };

  const removeAttachment = (key: string) => {
    setAttachments((prev) => ({ ...prev, [key]: null }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!formData.applyName?.trim()) e.applyName = '请输入项目名称';
    if (!formData.projectType) e.projectType = '请选择项目类型';
    if (!formData.manager) e.manager = '请选择项目经理';
    if (formData.isPreApply === 1 && !formData.preApplyNo?.trim()) e.preApplyNo = '预立项时预立项号必填';
    if (formData.personnelChange === undefined) e.personnelChange = '请选择人员岗位增减';
    if ((formData.personnelChange === 1 || formData.personnelChange === 2) && (!formData.personnelCount || formData.personnelCount <= 0)) {
      e.personnelCount = '请填写岗位增减人数';
    }
    if (!formData.investAmount || Number(formData.investAmount) < 0) e.investAmount = '请填写投资概算（≥0）';
    if (!formData.benefitAmount || Number(formData.benefitAmount) < 0) e.benefitAmount = '请填写经济社会效益测算（≥0）';
    if (!formData.buildDuration || Number(formData.buildDuration) <= 0) e.buildDuration = '请填写建设工期（月）';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const sectionMap: Record<string, string> = {
        applyName: 'basic', projectType: 'basic', manager: 'basic', preApplyNo: 'basic',
        investAmount: 'investment', benefitAmount: 'investment',
        personnelChange: 'personnel', personnelCount: 'personnel', buildDuration: 'personnel',
      };
      const firstSec = sectionMap[Object.keys(e)[0]] || 'basic';
      scrollToSection(firstSec);
      showToast('请检查并填写必填项', 'error');
      return false;
    }
    return true;
  };

  const doSave = (status: 'draft' | 'pending') => {
    if (status === 'pending' && !validate()) return;
    const records = getStoredRecords();
    const now = new Date().toISOString().split('T')[0];
    const applyNo = `20260${String(Math.floor(Math.random() * 900000 + 100000))}`;

    if (isEdit && recordId) {
      const updated = records.map((r) => r.id === recordId ? { ...r, ...formData, status } : r);
      localStorage.setItem('ng_apply_records', JSON.stringify(updated));
    } else {
      const newRecord: ApplyRecord = {
        ...(formData as ApplyRecord),
        id: String(Date.now()),
        applyNo,
        status,
        applyDate: now,
        reviewer: '王志远',
        operator: '李建国',
        currentStatus: status === 'pending' ? '待审核' : '草稿',
      };
      localStorage.setItem('ng_apply_records', JSON.stringify([newRecord, ...records]));
    }

    navigate('/project-plan/apply', {
      state: { success: true, message: status === 'pending' ? '提交成功，已进入审核流程' : '保存成功' },
    });
  };

  const inputCls = (field: string) =>
    `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors ${errors[field] ? 'border-red-400 bg-red-50/30' : 'border-steel-200 bg-white'}`;
  const labelCls = 'flex justify-end items-start text-sm text-steel-600 pt-2 leading-5';
  const requiredStar = <span className="text-red-500 ml-0.5">*</span>;
  const sectionHeaderCls = 'flex items-center gap-2.5 px-5 py-3.5';

  const AttachmentRow = ({ fieldKey, label }: { fieldKey: string; label: string }) => {
    const file = attachments[fieldKey];
    return (
      <div className="flex items-center gap-3 py-2.5 border-b border-steel-50 last:border-0">
        <span className="text-sm text-steel-600 w-28 flex-shrink-0">{label}</span>
        {file ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 rounded-md flex-1 min-w-0">
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <i className="ri-file-text-line text-primary-500 text-sm" />
              </div>
              <span className="text-xs text-primary-700 truncate flex-1">{file.name}</span>
              <span className="text-xs text-steel-400 flex-shrink-0">{file.size}</span>
            </div>
            <button onClick={() => removeAttachment(fieldKey)}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-steel-400 hover:text-red-500 cursor-pointer flex-shrink-0">
              <i className="ri-close-line text-sm" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-500 border border-dashed border-steel-200 rounded-md hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-upload-2-line" />
            </div>
            点击上传
            <input type="file" className="hidden" onChange={(e) => handleFileUpload(fieldKey, e.target.files?.[0] ?? null)} />
          </label>
        )}
      </div>
    );
  };

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
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all"
                  style={activeSection === sec.id ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white' } : { backgroundColor: '#e8edf3', color: '#718096' }}>
                  {idx + 1}
                </div>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{sec.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Form Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto pb-24 px-6 pt-6" style={{ marginLeft: '200px' }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-steel-900">{isEdit ? '编辑呈核表单' : '新增呈核表单'}</h2>
              <p className="text-xs text-steel-400 mt-0.5">请填写呈核表单，确认无误后点击呈核按钮发起审批流程</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-steel-400">
              <span className="text-red-400">*</span><span>为必填项</span>
            </div>
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
                <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  <label className={labelCls}>年度计划号</label>
                  <input value={formData.planNo || ''} onChange={(e) => handleChange('planNo', e.target.value)}
                    placeholder="请输入或留空由系统生成" className={inputCls('planNo')} />
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  <label className={labelCls}>是否预立项{requiredStar}</label>
                  <div className="flex gap-3 pt-2">
                    {[{ val: 0, label: '否' }, { val: 1, label: '是' }].map((opt) => (
                      <label key={opt.val} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="isPreApply" checked={formData.isPreApply === opt.val}
                          onChange={() => handleChange('isPreApply', opt.val)}
                          className="w-4 h-4 border-steel-300 text-primary-500 cursor-pointer" />
                        <span className="text-sm text-steel-600">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 grid grid-cols-[100px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目名称{requiredStar}</label>
                  <div>
                    <input value={formData.applyName || ''} onChange={(e) => handleChange('applyName', e.target.value)}
                      placeholder="请输入项目名称" className={inputCls('applyName')} />
                    {errors.applyName && <p className="mt-1 text-xs text-red-500">{errors.applyName}</p>}
                  </div>
                </div>
                {formData.isPreApply === 1 && (
                  <div className="col-span-2 grid grid-cols-[100px_1fr] gap-3 items-start">
                    <label className={labelCls}>预立项号{requiredStar}</label>
                    <div>
                      <input value={formData.preApplyNo || ''} onChange={(e) => handleChange('preApplyNo', e.target.value)}
                        placeholder="请输入预立项号" className={inputCls('preApplyNo')} />
                      {errors.preApplyNo && <p className="mt-1 text-xs text-red-500">{errors.preApplyNo}</p>}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目类型{requiredStar}</label>
                  <div>
                    <select value={formData.projectType || ''} onChange={(e) => handleChange('projectType', e.target.value)}
                      className={inputCls('projectType') + ' cursor-pointer'}>
                      <option value="">请选择</option>
                      {applyProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.projectType && <p className="mt-1 text-xs text-red-500">{errors.projectType}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  <label className={labelCls}>项目经理{requiredStar}</label>
                  <div>
                    <select value={formData.manager || ''} onChange={(e) => handleChange('manager', e.target.value)}
                      className={inputCls('manager') + ' cursor-pointer'}>
                      <option value="">请选择</option>
                      {applyManagers.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {errors.manager && <p className="mt-1 text-xs text-red-500">{errors.manager}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 论证意见 */}
          <div id="opinion" ref={(el) => { sectionRefs.current['opinion'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-chat-quote-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">论证意见</h3>
              <span className="text-xs text-steel-400 ml-1">总师室论证意见</span>
            </div>
            <div className="p-5 space-y-4">
              {[
                { field: 'necessity', label: '现状和必要性', placeholder: '请描述项目建设的现状背景及建设必要性...' },
                { field: 'planScheme', label: '方案和主要内容', placeholder: '请描述项目建设方案及主要建设内容...' },
                { field: 'techIndicator', label: '主要技经指标', placeholder: '请填写项目主要技术经济指标...' },
              ].map(({ field, label, placeholder }) => (
                <div key={field} className="grid grid-cols-[120px_1fr] gap-3 items-start">
                  <label className={labelCls}>{label}</label>
                  <div>
                    <div className="border border-steel-200 rounded-md overflow-hidden">
                      <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-50 border-b border-steel-100">
                        {['ri-bold', 'ri-italic', 'ri-list-unordered', 'ri-list-ordered', 'ri-link'].map((icon) => (
                          <button key={icon} type="button"
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-steel-400 cursor-pointer transition-colors">
                            <i className={`${icon} text-xs`} />
                          </button>
                        ))}
                      </div>
                      <textarea value={(formData as Record<string, unknown>)[field] as string || ''}
                        onChange={(e) => handleChange(field as keyof ApplyRecord, e.target.value)}
                        placeholder={placeholder} rows={4} maxLength={500}
                        className="w-full px-3 py-2 text-sm focus:outline-none resize-none" />
                    </div>
                    <div className="flex justify-end mt-0.5">
                      <span className="text-xs text-steel-400">{(((formData as Record<string, unknown>)[field] as string) || '').length}/500</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 投资与效益 */}
          <div id="investment" ref={(el) => { sectionRefs.current['investment'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-funds-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">投资与效益</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>投资概算{requiredStar}</label>
                  <div>
                    <div className="relative">
                      <input type="number" min={0} step="1" value={formData.investAmount || ''}
                        onChange={(e) => handleChange('investAmount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00" className={inputCls('investAmount') + ' pr-12'} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">万元</span>
                    </div>
                    {errors.investAmount && <p className="mt-1 text-xs text-red-500">{errors.investAmount}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                  <label className={labelCls}>效益测算{requiredStar}</label>
                  <div>
                    <div className="relative">
                      <input type="number" min={0} step="1" value={formData.benefitAmount || ''}
                        onChange={(e) => handleChange('benefitAmount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00" className={inputCls('benefitAmount') + ' pr-12'} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">万元</span>
                    </div>
                    {errors.benefitAmount && <p className="mt-1 text-xs text-red-500">{errors.benefitAmount}</p>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                <label className={labelCls}>计算过程</label>
                <div>
                  <div className="border border-steel-200 rounded-md overflow-hidden">
                    <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-50 border-b border-steel-100">
                      {['ri-bold', 'ri-italic', 'ri-list-unordered', 'ri-list-ordered'].map((icon) => (
                        <button key={icon} type="button"
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-steel-400 cursor-pointer transition-colors">
                          <i className={`${icon} text-xs`} />
                        </button>
                      ))}
                    </div>
                    <textarea value={formData.calcProcess || ''} onChange={(e) => handleChange('calcProcess', e.target.value)}
                      placeholder="请填写效益计算的详细过程..." rows={4} maxLength={500}
                      className="w-full px-3 py-2 text-sm focus:outline-none resize-none" />
                  </div>
                  <div className="flex justify-end mt-0.5">
                    <span className="text-xs text-steel-400">{(formData.calcProcess || '').length}/500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: 人员与工期 */}
          <div id="personnel" ref={(el) => { sectionRefs.current['personnel'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-team-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">人员与工期</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>人员岗位增减{requiredStar}</label>
                  <div>
                    <div className="flex gap-3 pt-1.5">
                      {[{ val: 0, label: '无' }, { val: 1, label: '增加' }, { val: 2, label: '减少' }].map((opt) => (
                        <label key={opt.val} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="personnelChange" checked={formData.personnelChange === opt.val}
                            onChange={() => handleChange('personnelChange', opt.val)}
                            className="w-4 h-4 border-steel-300 text-primary-500 cursor-pointer" />
                          <span className="text-sm text-steel-600">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.personnelChange && <p className="mt-1 text-xs text-red-500">{errors.personnelChange}</p>}
                  </div>
                </div>
                {(formData.personnelChange === 1 || formData.personnelChange === 2) && (
                  <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                    <label className={labelCls}>增减人数{requiredStar}</label>
                    <div>
                      <div className="relative">
                        <input type="number" min={1} value={formData.personnelCount || ''}
                          onChange={(e) => handleChange('personnelCount', parseInt(e.target.value) || 0)}
                          placeholder="请输入人数" className={inputCls('personnelCount') + ' pr-8'} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">人</span>
                      </div>
                      {errors.personnelCount && <p className="mt-1 text-xs text-red-500">{errors.personnelCount}</p>}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>建设工期{requiredStar}</label>
                  <div>
                    <div className="relative">
                      <input type="number" min={1} value={formData.buildDuration || ''}
                        onChange={(e) => handleChange('buildDuration', parseInt(e.target.value) || 0)}
                        placeholder="请输入工期月数" className={inputCls('buildDuration') + ' pr-8'} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">月</span>
                    </div>
                    {errors.buildDuration && <p className="mt-1 text-xs text-red-500">{errors.buildDuration}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: 附件上传 */}
          <div id="attachment" ref={(el) => { sectionRefs.current['attachment'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-attachment-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">附件上传</h3>
              <span className="text-xs text-steel-400 ml-1">支持 PDF、Word、Excel 格式，单文件不超过 20MB</span>
            </div>
            <div className="px-5 py-3">
              <AttachmentRow fieldKey="promise"   label="项目承诺书" />
              <AttachmentRow fieldKey="opinion"   label="论证意见" />
              <AttachmentRow fieldKey="committee" label="全委会意见" />
              <AttachmentRow fieldKey="office"    label="办公会意见" />
              <AttachmentRow fieldKey="special"   label="中特等意见" />
            </div>
          </div>

          {/* Section 6: 项目概算 */}
          <div id="budget" ref={(el) => { sectionRefs.current['budget'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-chart-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">项目概算</h3>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-steel-500">概算总额：</span>
                    <span className="text-base font-bold" style={{ color: '#2563eb' }}>{budgetTotal.toFixed(2)}</span>
                    <span className="text-sm text-steel-500">万元</span>
                  </div>
                  <span className="text-xs text-steel-400">
                    共 <span className="font-medium">{budgetItems.length}</span> 条明细
                  </span>
                </div>
                <button onClick={() => setBudgetOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm border border-primary-300 rounded-md transition-colors cursor-pointer hover:bg-primary-50 whitespace-nowrap"
                  style={{ color: '#2563eb' }}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-edit-line" /></div>
                  修改概算表
                </button>
              </div>
              {budgetItems.length > 0 && (
                <div className="mt-4 border border-steel-100 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead style={{ backgroundColor: '#f5f7fa' }}>
                      <tr>
                        {['序号', '费用名称', '建筑工程费', '安装工程费', '设备费', '其他费', '合计(万元)'].map((h) => (
                          <th key={h} className="px-3 py-2 text-steel-600 font-semibold border-b border-steel-200 text-center whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {budgetItems.slice(0, 5).map((item, idx) => (
                        <tr key={item.id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafbfd' }}>
                          <td className="px-3 py-2 text-center text-steel-500 border-b border-steel-50">{item.seq}</td>
                          <td className="px-3 py-2 text-steel-700 border-b border-steel-50 max-w-[200px] truncate">{item.name}</td>
                          <td className="px-3 py-2 text-right text-steel-600 border-b border-steel-50">{item.buildCost.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right text-steel-600 border-b border-steel-50">{item.installCost.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right text-steel-600 border-b border-steel-50">{item.equipCost.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right text-steel-600 border-b border-steel-50">{item.otherCost.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-medium text-steel-800 border-b border-steel-50">{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                      {budgetItems.length > 5 && (
                        <tr>
                          <td colSpan={7} className="px-3 py-2 text-center text-xs text-steel-400">
                            还有 {budgetItems.length - 5} 条，
                            <button onClick={() => setBudgetOpen(true)} className="text-primary-500 hover:underline cursor-pointer">查看全部</button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
        style={{ left: 'calc(14rem + 200px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <span className="text-xs text-steel-400 mr-4 hidden lg:block">
          <i className="ri-information-line mr-1" />
          所有修改将在保存提交后生效
        </span>
        <button onClick={() => navigate('/project-plan/apply')}
          className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
          取消
        </button>
        <button onClick={() => doSave('draft')}
          className="px-5 py-2 text-sm border border-primary-300 rounded-md transition-colors whitespace-nowrap cursor-pointer hover:bg-primary-50"
          style={{ color: '#2563eb' }}>
          <i className="ri-save-line mr-1.5" />
          保存草稿
        </button>
        <button onClick={() => doSave('pending')}
          className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          <i className="ri-send-plane-line" />
          呈核
        </button>
      </div>

      {/* Budget Modal */}
      <BudgetModal open={budgetOpen} onClose={() => setBudgetOpen(false)}
        onSave={(items) => { setBudgetItems(items); showToast('概算表已保存'); }}
        initialItems={budgetItems} />

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
