import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getUndertakeDemandById,
  getRequirementProjectById,
  formatCurrency,
  handlers,
  projectCategories,
  purchaseModes,
  purchasePlans,
  qualificationLevels,
  projectVarieties,
  bidMethods,
  supplierLevels,
} from '@/mocks/engineeringRequirementMocks';
import ApprovalFlowModal from '@/pages/project-contract/requirement/components/ApprovalFlowModal';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '基础信息' },
  { key: 'bid', label: '招标信息' },
  { key: 'undertake', label: '承办信息' },
  { key: 'extra', label: '附加信息' },
  { key: 'entrust', label: '委托信息' },
  { key: 'attachment', label: '附件' },
  { key: 'system', label: '系统信息' },
];

export default function UndertakeFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const demandId = urlParams.get('demandId') || '';
  const projectId = urlParams.get('projectId') || '';

  const demand = getUndertakeDemandById(demandId);
  const project = getRequirementProjectById(projectId);

  const [formData, setFormData] = useState({
    reviewAmount: demand?.reviewAmount ?? 0,
    splitSection: demand?.splitSection ?? false,
    hasBusinessBid: demand?.hasBusinessBid ?? false,
    projectCategory: demand?.projectCategory ?? '',
    purchaseMode: demand?.purchaseMode ?? '',
    purchasePlan: demand?.purchasePlan ?? '',
    weightRatio: demand?.weightRatio ?? 0,
    qualificationLevel: demand?.qualificationLevel ?? '',
    bidOpenDate: demand?.bidOpenDate ?? '',
    projectVariety: demand?.projectVariety ?? '',
    isSmartBid: demand?.isSmartBid ?? false,
    bidMethod: demand?.bidMethod ?? '',
    supplierLevelReq: demand?.supplierLevelReq ?? '',
    supplierOnSite: demand?.supplierOnSite ?? false,
    undertakeInfo: demand?.undertakeInfo ?? '',
    returnOpinion: demand?.returnOpinion ?? '',
    handlerChangeRecord: demand?.handlerChangeRecord ?? '',
    returnRecord: demand?.returnRecord ?? '',
    entrustNo: demand?.entrustNo ?? '',
    mergeEntrustNo: demand?.mergeEntrustNo ?? '',
    internalAttachments: demand?.internalAttachments ?? [],
    externalAttachments: demand?.externalAttachments ?? [],
  });

  const [activeSection, setActiveSection] = useState('basic');
  const [showApprovalFlow, setShowApprovalFlow] = useState(false);
  const [toast, setToast] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    showToast('保存成功');
  };

  const handleSubmit = () => {
    if (!formData.projectCategory) {
      showToast('工程分类不能为空');
      return;
    }
    if (!formData.qualificationLevel) {
      showToast('资质等级不能为空');
      return;
    }
    if (!formData.bidOpenDate) {
      showToast('拟定开标日期不能为空');
      return;
    }
    if (!formData.projectVariety) {
      showToast('工程品种不能为空');
      return;
    }
    if (!formData.bidMethod) {
      showToast('招标方式不能为空');
      return;
    }
    if (!formData.undertakeInfo.trim()) {
      showToast('承办需求信息不能为空');
      return;
    }
    setShowApprovalFlow(true);
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('data-section') || '');
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((s) => {
      const el = sectionRefs.current[s.key];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <div className="flex gap-5">
        {/* Left Anchor Nav */}
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => scrollToSection(s.key)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                    activeSection === s.key
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-slate-800">主管单位承办呈核</h1>
            <button
              onClick={() => navigate(`/project-contract/undertake/demand-list?projectId=${projectId}`)}
              className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-left-line" />
              </div>
              返回
            </button>
          </div>

          {/* Basic Info */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">基础信息</span>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">工程需求编号</span>
                <input
                  type="text"
                  value={demand?.demandNo || ''}
                  disabled
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">工程需求名称</span>
                <input
                  type="text"
                  value={demand?.demandName || ''}
                  disabled
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">初审金额</span>
                <input
                  type="text"
                  value={formatCurrency(formData.reviewAmount)}
                  disabled
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">是否拆分标段</span>
                <select
                  value={String(formData.splitSection)}
                  onChange={(e) => handleChange('splitSection', e.target.value === 'true')}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="false">否</option>
                  <option value="true">是</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">是否填写商务标书</span>
                <select
                  value={String(formData.hasBusinessBid)}
                  onChange={(e) => handleChange('hasBusinessBid', e.target.value === 'true')}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="false">否</option>
                  <option value="true">是</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bid Info */}
          <div ref={(el) => { sectionRefs.current['bid'] = el; }} data-section="bid" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">招标信息</span>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>工程分类</span>
                <select
                  value={formData.projectCategory}
                  onChange={(e) => handleChange('projectCategory', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {projectCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">采购模式</span>
                <select
                  value={formData.purchaseMode}
                  onChange={(e) => handleChange('purchaseMode', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {purchaseModes.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">采购计划</span>
                <select
                  value={formData.purchasePlan}
                  onChange={(e) => handleChange('purchasePlan', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {purchasePlans.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">权重比例</span>
                <input
                  type="number"
                  value={formData.weightRatio}
                  onChange={(e) => handleChange('weightRatio', Number(e.target.value))}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="请输入"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>资质等级</span>
                <select
                  value={formData.qualificationLevel}
                  onChange={(e) => handleChange('qualificationLevel', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {qualificationLevels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>拟定开标日期</span>
                <input
                  type="date"
                  value={formData.bidOpenDate}
                  onChange={(e) => handleChange('bidOpenDate', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>工程品种</span>
                <select
                  value={formData.projectVariety}
                  onChange={(e) => handleChange('projectVariety', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {projectVarieties.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">是否智能评标</span>
                <select
                  value={String(formData.isSmartBid)}
                  onChange={(e) => handleChange('isSmartBid', e.target.value === 'true')}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="false">否</option>
                  <option value="true">是</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>招标方式</span>
                <select
                  value={formData.bidMethod}
                  onChange={(e) => handleChange('bidMethod', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {bidMethods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">合格供应商等级</span>
                <select
                  value={formData.supplierLevelReq}
                  onChange={(e) => handleChange('supplierLevelReq', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {supplierLevels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">供应商到开标现场</span>
                <select
                  value={String(formData.supplierOnSite)}
                  onChange={(e) => handleChange('supplierOnSite', e.target.value === 'true')}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="false">否</option>
                  <option value="true">是</option>
                </select>
              </div>
            </div>
          </div>

          {/* Undertake Info */}
          <div ref={(el) => { sectionRefs.current['undertake'] = el; }} data-section="undertake" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-slate-800">承办信息</span>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-1"><span className="text-red-500">*</span>承办需求信息</span>
                <textarea
                  value={formData.undertakeInfo}
                  onChange={(e) => handleChange('undertakeInfo', e.target.value)}
                  rows={3}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="请填写承办说明"
                />
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-1">承办退回意见</span>
                <textarea
                  value={formData.returnOpinion}
                  onChange={(e) => handleChange('returnOpinion', e.target.value)}
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="退回时填写"
                />
              </div>
            </div>
          </div>

          {/* Extra Info */}
          <div ref={(el) => { sectionRefs.current['extra'] = el; }} data-section="extra" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-violet-500" />
              <span className="text-sm font-semibold text-slate-800">附加信息</span>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-1">经办人调整记录</span>
                <textarea
                  value={formData.handlerChangeRecord}
                  disabled
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                  placeholder="系统自动记录"
                />
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-1">退回记录</span>
                <textarea
                  value={formData.returnRecord}
                  disabled
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                  placeholder="系统自动记录"
                />
              </div>
            </div>
          </div>

          {/* Entrust Info */}
          <div ref={(el) => { sectionRefs.current['entrust'] = el; }} data-section="entrust" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-cyan-500" />
              <span className="text-sm font-semibold text-slate-800">委托信息</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">委托单号</span>
                <input
                  type="text"
                  value={formData.entrustNo}
                  onChange={(e) => handleChange('entrustNo', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="系统自动生成或输入"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">合并委托单号</span>
                <input
                  type="text"
                  value={formData.mergeEntrustNo}
                  onChange={(e) => handleChange('mergeEntrustNo', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="多个合同合并招标时填写"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div ref={(el) => { sectionRefs.current['attachment'] = el; }} data-section="attachment" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-rose-500" />
              <span className="text-sm font-semibold text-slate-800">附件</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">对内附件</span>
                <div className="flex items-center gap-2 flex-1">
                  <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-upload-cloud-line" />
                    </div>
                    上传文件
                  </button>
                  <span className="text-xs text-slate-400">已上传 {formData.internalAttachments.length} 个文件</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">对外附件</span>
                <div className="flex items-center gap-2 flex-1">
                  <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-upload-cloud-line" />
                    </div>
                    上传文件
                  </button>
                  <span className="text-xs text-slate-400">已上传 {formData.externalAttachments.length} 个文件</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div ref={(el) => { sectionRefs.current['system'] = el; }} data-section="system" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-slate-500" />
              <span className="text-sm font-semibold text-slate-800">系统信息</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">创建人</span>
                <input
                  type="text"
                  value={demand?.createUser || ''}
                  disabled
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">创建时间</span>
                <input
                  type="text"
                  value={demand?.createTime || ''}
                  disabled
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">修改人</span>
                <input
                  type="text"
                  value={demand?.modifyUser || ''}
                  disabled
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">修改时间</span>
                <input
                  type="text"
                  value={demand?.modifyTime || ''}
                  disabled
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-send-plane-line" />
              </div>
              呈核
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-save-line" />
              </div>
              保存
            </button>
            <button
              onClick={() => navigate(`/project-contract/undertake/demand-list?projectId=${projectId}`)}
              className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-go-back-line" />
              </div>
              返回
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* Approval Flow Modal */}
      {showApprovalFlow && demand && (
        <ApprovalFlowModal
          demand={demand}
          onClose={() => setShowApprovalFlow(false)}
          onSubmit={() => {
            setShowApprovalFlow(false);
            showToast('审批流程已提交');
          }}
        />
      )}
    </Layout>
  );
}