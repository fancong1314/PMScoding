import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getContractDocumentById,
  contractCategories,
  purchaseMethods,
  contractAttrs,
  formatCurrency,
  formatPercent,
  changeTypes,
  taxTypes,
  taxItems,
  taxRates,
  materialChangeTypes,
  generateTaxDetails,
  generateBudgetAllocations,
  amountChangeRecords,
  materialChangeRecords,
  type ContractDocument,
  type AmountChangeRecord,
  type MaterialChangeRecord,
  type BudgetAllocation,
} from '@/mocks/contractDocumentMocks';

interface ApprovalNodeConfig {
  id: string;
  name: string;
  approver: string;
}
const approverOptions = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟', '孙伟', '周鹏', '吴昊', '郑明'];

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '合同基本信息' },
  { key: 'date', label: '日期与期限' },
  { key: 'payment', label: '付款比例' },
  { key: 'amount', label: '金额信息' },
  { key: 'personnel', label: '人员信息' },
  { key: 'other', label: '其他信息' },
];

const emptyDoc: ContractDocument = {
  id: '', approvalNo: '', contractNo: '', contractName: '', contractType: '合同开工', contractorNo: '', contractorName: '',
  mainContent: '', contractDate: '', contractAmount: 0, materialAmount: 0, contractStatus: '待确认', contractAttr: '招标',
  frameworkContract: '否', underFramework: '否', purchaseMethod: '', purchaseMethodDesc: '', specialReason: '',
  planStartDate: '', planEndDate: '', jiananDiscountRatio: 0, jiananPaymentRatio: 0, jiananWarrantyRatio: 0,
  equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0,
  otherPrepayRatio: 0, otherWarrantyRatio: 0, originalAmount: 0, originalExcludingTax: 0, originalTax: 0,
  originalMaterialAmount: 0, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0,
  settlementExportDate: '', partyBManager: '', partyARep: '', teamLeader: '', controlReleaseNo: '', route: '',
  supervisorEngineer: '', bidLetterFile: '', attachments: [], contractTextFile: '', safetyBCert: '', safetyBCertNo: '', builderCert: '',
  isDeleted: false,
};

export default function ContractDocumentFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const mode = urlParams.get('mode') || 'add';
  const contractId = urlParams.get('contractId') || '';
  const isEdit = mode === 'edit';
  const existingData = isEdit ? getContractDocumentById(contractId) : null;

  const [formData, setFormData] = useState<ContractDocument>(existingData || { ...emptyDoc });
  const [activeSection, setActiveSection] = useState('basic');
  const [toast, setToast] = useState('');
  const [showAmountChange, setShowAmountChange] = useState(false);
  const [showMaterialChange, setShowMaterialChange] = useState(false);
  const [showBudgetView, setShowBudgetView] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Amount Change Modal State
  const [amtFormData, setAmtFormData] = useState({
    changeType: '订约',
    changeUnit: '炼铁事业部',
    changeAmount: 0,
    changeDesc: '',
    taxDetails: generateTaxDetails().map(t => ({ ...t, amountWithTax: 0 })),
    budgetAllocations: generateBudgetAllocations().map(b => ({ ...b, currentOccupied: 0, balanceAmount: b.estimateAmount - b.demandOccupied - b.contractOccupied })),
  });
  const [showAmtApprovalFlow, setShowAmtApprovalFlow] = useState(false);
  const [showAmtBudget, setShowAmtBudget] = useState(false);
  const [amtApprovalNodes, setAmtApprovalNodes] = useState<ApprovalNodeConfig[]>([
    { id: '1', name: '部门负责人审批', approver: '' },
    { id: '2', name: '分管领导审批', approver: '' },
  ]);
  const [amtApprovalName, setAmtApprovalName] = useState('');

  // Material Change Modal State
  const [matFormData, setMatFormData] = useState({
    changeType: '订约',
    changeUnit: 'ERP系统-炼铁事业部',
    changeAmount: 0,
    changeDesc: '',
    budgetAllocations: generateBudgetAllocations().map(b => ({ ...b, currentOccupied: 0, balanceAmount: b.estimateAmount - b.demandOccupied - b.contractOccupied })),
  });
  const [showMatApprovalFlow, setShowMatApprovalFlow] = useState(false);
  const [showMatBudget, setShowMatBudget] = useState(false);
  const [matApprovalNodes, setMatApprovalNodes] = useState<ApprovalNodeConfig[]>([
    { id: '1', name: '部门负责人审批', approver: '' },
    { id: '2', name: '分管领导审批', approver: '' },
  ]);
  const [matApprovalName, setMatApprovalName] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.contractName.trim()) { showToast('合同名称不能为空'); return; }
    if (!formData.contractType) { showToast('合同类型不能为空'); return; }
    if (!formData.contractorNo.trim()) { showToast('承包商编号不能为空'); return; }
    if (!formData.purchaseMethod) { showToast('采购方式不能为空'); return; }
    if (!formData.contractAttr) { showToast('合同属性不能为空'); return; }
    if (!formData.planStartDate) { showToast('计划开工日期不能为空'); return; }
    if (!formData.planEndDate) { showToast('计划竣工日期不能为空'); return; }
    if (!formData.contractAmount) { showToast('订约金额不能为空'); return; }
    if (!formData.mainContent.trim()) { showToast('主要内容不能为空'); return; }
    showToast('保存成功，合同状态为暂存');
  };

  const handleSubmit = () => {
    if (!formData.contractName.trim()) { showToast('合同名称不能为空'); return; }
    if (!formData.contractType) { showToast('合同类型不能为空'); return; }
    if (!formData.contractorNo.trim()) { showToast('承包商编号不能为空'); return; }
    if (!formData.purchaseMethod) { showToast('采购方式不能为空'); return; }
    if (!formData.contractAttr) { showToast('合同属性不能为空'); return; }
    if (!formData.planStartDate) { showToast('计划开工日期不能为空'); return; }
    if (!formData.planEndDate) { showToast('计划竣工日期不能为空'); return; }
    if (!formData.contractAmount) { showToast('订约金额不能为空'); return; }
    if (!formData.mainContent.trim()) { showToast('主要内容不能为空'); return; }
    showToast('已推送至法务系统，状态变更为待法务审核');
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.getAttribute('data-section') || '');
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    sections.forEach(s => {
      const el = sectionRefs.current[s.key];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const isSupervisor = formData.contractType === '监理';
  const isFramework = formData.frameworkContract === '是';

  const inputClass = 'flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500';
  const disabledClass = 'flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500';
  const selectClass = 'flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500';

  return (
    <Layout>
      <div className="flex gap-5">
        {/* Left Anchor Nav */}
        <div className="w-40 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map(s => (
                <button
                  key={s.key}
                  onClick={() => scrollToSection(s.key)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer whitespace-nowrap ${activeSection === s.key ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
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
            <h1 className="text-lg font-semibold text-slate-800">{isEdit ? '合同修改' : '合同新增'}</h1>
            <div className="flex items-center gap-2">
              <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>
                提交
              </button>
              <button onClick={handleSave} className="px-4 py-1.5 text-sm text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line" /></div>
                保存
              </button>
              <button onClick={() => setShowAmountChange(true)} className="px-3 py-1.5 text-sm text-amber-700 border border-amber-200 rounded-md hover:bg-amber-50 cursor-pointer whitespace-nowrap">合同金额异动</button>
              <button onClick={() => setShowMaterialChange(true)} className="px-3 py-1.5 text-sm text-violet-700 border border-violet-200 rounded-md hover:bg-violet-50 cursor-pointer whitespace-nowrap">甲供材异动</button>
              <button onClick={() => setShowBudgetView(true)} className="px-3 py-1.5 text-sm text-teal-700 border border-teal-200 rounded-md hover:bg-teal-50 cursor-pointer whitespace-nowrap">概算分配查看</button>
              <button onClick={() => navigate('/project-contract/document')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-close-line" /></div>
                取消
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div ref={el => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">合同基本信息</span>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>立项号</span>
                <div className="relative flex-1">
                  <input type="text" value={formData.approvalNo} onChange={e => handleChange('approvalNo', e.target.value)} className={inputClass} />
                  {formData.approvalNo && <button onClick={() => handleChange('approvalNo', '')} className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">合同编号</span>
                <input type="text" value={formData.contractNo} disabled className={disabledClass} placeholder="系统自动生成" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>合同名称</span>
                <input type="text" value={formData.contractName} onChange={e => handleChange('contractName', e.target.value)} className={inputClass} maxLength={100} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>合同类型</span>
                <select value={formData.contractType} onChange={e => handleChange('contractType', e.target.value)} className={selectClass}>
                  {contractCategories.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>承包商编号</span>
                <input type="text" value={formData.contractorNo} onChange={e => handleChange('contractorNo', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">承包商名称</span>
                <input type="text" value={formData.contractorName} onChange={e => handleChange('contractorName', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>采购方式</span>
                <select value={formData.purchaseMethod} onChange={e => handleChange('purchaseMethod', e.target.value)} className={selectClass}>
                  <option value="">请选择</option>
                  {purchaseMethods.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">采购方式说明</span>
                <input type="text" value={formData.purchaseMethodDesc} onChange={e => handleChange('purchaseMethodDesc', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">特殊原因备注</span>
                <input type="text" value={formData.specialReason} onChange={e => handleChange('specialReason', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>合同属性</span>
                <select value={formData.contractAttr} onChange={e => handleChange('contractAttr', e.target.value)} className={selectClass}>
                  <option value="">请选择</option>
                  {contractAttrs.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">框架合同</span>
                <select value={formData.frameworkContract} onChange={e => handleChange('frameworkContract', e.target.value)} className={selectClass}>
                  <option value="否">否</option>
                  <option value="是">是</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">框架下合同</span>
                <select value={formData.underFramework} onChange={e => handleChange('underFramework', e.target.value)} className={isFramework ? disabledClass : selectClass} disabled={isFramework}>
                  <option value="否">否</option>
                  <option value="是">是</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">中标通知书</span>
                <div className="flex items-center gap-1 flex-1">
                  <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-cloud-line" /></div>上传
                  </button>
                  {formData.bidLetterFile && <span className="text-xs text-slate-400 truncate">{formData.bidLetterFile}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">附件上传</span>
                <div className="flex items-center gap-1 flex-1">
                  <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-cloud-line" /></div>上传
                  </button>
                  <span className="text-xs text-slate-400">{formData.attachments.length}个文件</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">合同文本</span>
                <div className="flex items-center gap-1 flex-1">
                  <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-cloud-line" /></div>上传
                  </button>
                  {formData.contractTextFile && <span className="text-xs text-slate-400 truncate">{formData.contractTextFile}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">安全B证附件</span>
                <div className="flex items-center gap-1 flex-1">
                  <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-cloud-line" /></div>上传
                  </button>
                  {formData.safetyBCert && <span className="text-xs text-slate-400 truncate">{formData.safetyBCert}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">安全B证编号</span>
                <input type="text" value={formData.safetyBCertNo} onChange={e => handleChange('safetyBCertNo', e.target.value)} className={inputClass} placeholder="请输入安全B证编号" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">建造师证书</span>
                <div className="flex items-center gap-1 flex-1">
                  <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-cloud-line" /></div>上传
                  </button>
                  {formData.builderCert && <span className="text-xs text-slate-400 truncate">{formData.builderCert}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">监理总监</span>
                <select value={formData.supervisorEngineer} onChange={e => handleChange('supervisorEngineer', e.target.value)} className={isSupervisor ? selectClass : disabledClass} disabled={!isSupervisor}>
                  <option value="">{isSupervisor ? '请选择' : '仅监理合同可选'}</option>
                  <option value="张监理">张监理</option>
                  <option value="李监理">李监理</option>
                  <option value="王监理">王监理</option>
                  <option value="陈监理">陈监理</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date Section */}
          <div ref={el => { sectionRefs.current['date'] = el; }} data-section="date" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">日期与期限</span>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>计划开工日期</span>
                <input type="date" value={formData.planStartDate} onChange={e => handleChange('planStartDate', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>计划竣工日期</span>
                <input type="date" value={formData.planEndDate} onChange={e => handleChange('planEndDate', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>订约日期</span>
                <input type="date" value={formData.contractDate} onChange={e => handleChange('contractDate', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Payment Ratio Section */}
          <div ref={el => { sectionRefs.current['payment'] = el; }} data-section="payment" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-slate-800">付款比例</span>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">建安折扣比例(%)</span>
                <input type="number" step="1" value={formData.jiananDiscountRatio} onChange={e => handleChange('jiananDiscountRatio', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">建安付款比例(%)</span>
                <input type="number" step="1" value={formData.jiananPaymentRatio} onChange={e => handleChange('jiananPaymentRatio', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">建安质保金比例(%)</span>
                <input type="number" step="1" value={formData.jiananWarrantyRatio} onChange={e => handleChange('jiananWarrantyRatio', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">设备付款比例(%)</span>
                <input type="number" step="1" value={formData.equipmentPaymentRatio} onChange={e => handleChange('equipmentPaymentRatio', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">设备质保金比例(%)</span>
                <input type="number" step="1" value={formData.equipmentWarrantyRatio} onChange={e => handleChange('equipmentWarrantyRatio', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">监理付款比例(%)</span>
                <input type="number" step="1" value={formData.supervisorPaymentRatio} onChange={e => handleChange('supervisorPaymentRatio', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">监理质保金比例(%)</span>
                <input type="number" step="1" value={formData.supervisorWarrantyRatio} onChange={e => handleChange('supervisorWarrantyRatio', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">其他预付款比例(%)</span>
                <input type="number" step="1" value={formData.otherPrepayRatio} onChange={e => handleChange('otherPrepayRatio', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">其他质保金比例(%)</span>
                <input type="number" step="1" value={formData.otherWarrantyRatio} onChange={e => handleChange('otherWarrantyRatio', Number(e.target.value))} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div ref={el => { sectionRefs.current['amount'] = el; }} data-section="amount" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-rose-500" />
              <span className="text-sm font-semibold text-slate-800">金额信息</span>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28"><span className="text-red-500">*</span>订约金额(元)</span>
                <input type="number" step="1" value={formData.contractAmount} onChange={e => handleChange('contractAmount', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">原始订约金额(元)</span>
                <input type="text" value={formatCurrency(formData.originalAmount)} disabled className={disabledClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">原始订约除税金额(元)</span>
                <input type="text" value={formatCurrency(formData.originalExcludingTax)} disabled className={disabledClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">原始订约税额(元)</span>
                <input type="text" value={formatCurrency(formData.originalTax)} disabled className={disabledClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">原始甲供材金额(元)</span>
                <input type="number" step="1" value={formData.originalMaterialAmount} onChange={e => handleChange('originalMaterialAmount', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">决算进口金额(元)</span>
                <input type="text" value={formData.settlementImportAmount ? formatCurrency(formData.settlementImportAmount) : '-'} disabled className={disabledClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">决算进口日期</span>
                <input type="text" value={formData.settlementImportDate || '-'} disabled className={disabledClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">决算出口金额(元)</span>
                <input type="text" value={formData.settlementExportAmount ? formatCurrency(formData.settlementExportAmount) : '-'} disabled className={disabledClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">决算出口日期</span>
                <input type="text" value={formData.settlementExportDate || '-'} disabled className={disabledClass} />
              </div>
            </div>
          </div>

          {/* Personnel Section */}
          <div ref={el => { sectionRefs.current['personnel'] = el; }} data-section="personnel" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-violet-500" />
              <span className="text-sm font-semibold text-slate-800">人员信息</span>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">乙方项目经理</span>
                <input type="text" value={formData.partyBManager} onChange={e => handleChange('partyBManager', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">甲方代表</span>
                <input type="text" value={formData.partyARep} onChange={e => handleChange('partyARep', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">施工队伍班组长</span>
                <input type="text" value={formData.teamLeader} onChange={e => handleChange('teamLeader', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">人数解除管控编号</span>
                <input type="text" value={formData.controlReleaseNo} onChange={e => handleChange('controlReleaseNo', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Other Info Section */}
          <div ref={el => { sectionRefs.current['other'] = el; }} data-section="other" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-slate-500" />
              <span className="text-sm font-semibold text-slate-800">其他信息</span>
            </div>
            <div className="grid grid-cols-1 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-1"><span className="text-red-500">*</span>主要内容</span>
                <textarea value={formData.mainContent} onChange={e => handleChange('mainContent', e.target.value)} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">路线</span>
                <input type="text" value={formData.route} onChange={e => handleChange('route', e.target.value)} className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={handleSubmit} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>提交
            </button>
            <button onClick={handleSave} className="px-6 py-2 text-sm text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line" /></div>保存
            </button>
            <button onClick={() => navigate('/project-contract/document')} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>返回
            </button>
          </div>
        </div>
      </div>

      {/* Amount Change Full Modal */}
      {showAmountChange && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto" onClick={() => setShowAmountChange(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-[95vw]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">合同金额异动新增</h3>
              <button onClick={() => setShowAmountChange(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line text-lg" /></button>
            </div>
            <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">立项号</span>
                  <div className="relative flex-1"><input type="text" value={formData.approvalNo} disabled className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /><button className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">合同编号</span>
                  <div className="relative flex-1"><input type="text" value={formData.contractNo || '（保存后自动生成）'} disabled className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /><button className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">流水号</span>
                  <input type="text" value="（系统自动生成）" disabled className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>异动类型</span>
                  <select value={amtFormData.changeType} onChange={e => setAmtFormData(prev => ({ ...prev, changeType: e.target.value }))} className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    {changeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">异动单位</span>
                  <input type="text" value={amtFormData.changeUnit} disabled className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>异动金额(元)</span>
                  <input type="number" step="1" value={amtFormData.changeAmount} onChange={e => setAmtFormData(prev => ({ ...prev, changeAmount: Number(e.target.value) }))} className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-600 mb-1 block"><span className="text-red-500">*</span>异动说明</span>
                <textarea value={amtFormData.changeDesc} onChange={e => setAmtFormData(prev => ({ ...prev, changeDesc: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" maxLength={500} />
              </div>
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-600">
                注意：建安、其他及设备【含税金额】各分配多少元，相应的【合同金额占用预算表】中建安、其他及设备也必须占用多少金额，尤其是总承包、系统集成类型合同一定要注意！
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2">税费明细</div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-2 py-2 text-xs text-slate-600 w-10">选择</th>
                        <th className="px-2 py-2 text-xs text-slate-600">税率类型</th>
                        <th className="px-2 py-2 text-xs text-slate-600">税目</th>
                        <th className="px-2 py-2 text-xs text-slate-600">税率</th>
                        <th className="px-2 py-2 text-xs text-slate-600">含税金额(元)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amtFormData.taxDetails.map(td => (
                        <tr key={td.id} className="border-b border-slate-100">
                          <td className="px-2 py-1.5 text-center"><input type="checkbox" checked={td.selected} onChange={() => setAmtFormData(prev => ({ ...prev, taxDetails: prev.taxDetails.map(t => t.id === td.id ? { ...t, selected: !t.selected } : t) }))} className="w-4 h-4" /></td>
                          <td className="px-2 py-1.5"><select value={td.taxType} onChange={e => setAmtFormData(prev => ({ ...prev, taxDetails: prev.taxDetails.map(t => t.id === td.id ? { ...t, taxType: e.target.value } : t) }))} className="w-full px-1 py-1 text-xs border border-slate-300 rounded bg-white">{taxTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></td>
                          <td className="px-2 py-1.5"><select value={td.taxItem} onChange={e => setAmtFormData(prev => ({ ...prev, taxDetails: prev.taxDetails.map(t => t.id === td.id ? { ...t, taxItem: e.target.value } : t) }))} className="w-full px-1 py-1 text-xs border border-slate-300 rounded bg-white">{taxItems.map(t => <option key={t} value={t}>{t}</option>)}</select></td>
                          <td className="px-2 py-1.5"><select value={td.taxRate} onChange={e => setAmtFormData(prev => ({ ...prev, taxDetails: prev.taxDetails.map(t => t.id === td.id ? { ...t, taxRate: e.target.value } : t) }))} className="w-full px-1 py-1 text-xs border border-slate-300 rounded bg-white">{taxRates.map(t => <option key={t} value={t}>{t}</option>)}</select></td>
                          <td className="px-2 py-1.5"><input type="number" step="1" value={td.amountWithTax} onChange={e => setAmtFormData(prev => ({ ...prev, taxDetails: prev.taxDetails.map(t => t.id === td.id ? { ...t, amountWithTax: Number(e.target.value) } : t) }))} className="w-28 px-1 py-1 text-xs border border-slate-300 rounded bg-white text-right font-mono" disabled={!td.selected} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(() => {
                  const taxTotal = amtFormData.taxDetails.filter(t => t.selected).reduce((s, t) => s + t.amountWithTax, 0);
                  const isTaxValid = Math.abs(taxTotal - amtFormData.changeAmount) < 0.01;
                  return (
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className={isTaxValid ? 'text-emerald-600' : 'text-red-500'}>
                        含税金额合计：{formatCurrency(taxTotal)}（{isTaxValid ? '与异动金额一致' : `与异动金额${taxTotal > amtFormData.changeAmount ? '超出' : '不足'}${formatCurrency(Math.abs(taxTotal - amtFormData.changeAmount))}元`}）
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-5 py-3 border-t border-slate-200">
              <button onClick={() => {
                setShowAmountChange(false);
                showToast('已保存金额异动数据，可在金额异动列表查看');
              }} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
              </button>
              <button onClick={() => { showToast('保存成功，状态为暂存'); setShowAmountChange(false); }} className="px-6 py-2 text-sm text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap">保存</button>
              <button onClick={() => setShowAmtBudget(true)} className="px-6 py-2 text-sm text-teal-700 border border-teal-200 rounded-md hover:bg-teal-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-funds-line" /></div>概算分配
              </button>
              <button onClick={() => setShowAmountChange(false)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Material Change Full Modal */}
      {showMaterialChange && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto" onClick={() => setShowMaterialChange(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-[95vw]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">甲供材异动新增</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>新增</button>
                <button className="px-3 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap" style={{ background: '#f59e0b' }}>修改</button>
                <button className="px-3 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap" style={{ background: '#ef4444' }}>删除</button>
                <button onClick={() => setShowMaterialChange(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line text-lg" /></button>
              </div>
            </div>
            <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">记录编号</span>
                  <input type="text" value="（系统自动生成）" disabled className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">立项号</span>
                  <div className="relative flex-1"><input type="text" value={formData.approvalNo} disabled className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /><button className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">合同编号</span>
                  <div className="relative flex-1"><input type="text" value={formData.contractNo || '（保存后自动生成）'} disabled className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /><button className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>异动类型</span>
                  <select value={matFormData.changeType} onChange={e => setMatFormData(prev => ({ ...prev, changeType: e.target.value }))} className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    {materialChangeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">异动单位</span>
                  <input type="text" value={matFormData.changeUnit} disabled className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                  <span className="text-xs text-slate-400">ERP系统</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>异动金额(元)</span>
                  <input type="number" step="1" value={matFormData.changeAmount} onChange={e => setMatFormData(prev => ({ ...prev, changeAmount: Number(e.target.value) }))} className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-600 mb-1 block"><span className="text-red-500">*</span>异动说明</span>
                <textarea value={matFormData.changeDesc} onChange={e => setMatFormData(prev => ({ ...prev, changeDesc: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" maxLength={500} />
              </div>
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">创建人员</span><input type="text" value="张明远" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">创建日期</span><input type="text" value={new Date().toISOString().slice(0, 19).replace('T', ' ')} disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">修改人员</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">修改日期</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">申请人员</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">申请日期</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">核准人员</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">核准日期</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">状态</span><input type="text" value="暂存" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-5 py-3 border-t border-slate-200">
              <button onClick={() => {
                setShowMaterialChange(false);
                showToast('已保存甲供材异动数据，可在甲供材异动列表查看');
              }} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
              </button>
              <button onClick={() => { showToast('保存成功，状态为暂存'); setShowMaterialChange(false); }} className="px-6 py-2 text-sm text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap">保存</button>
              <button onClick={() => setShowMatBudget(true)} className="px-6 py-2 text-sm text-teal-700 border border-teal-200 rounded-md hover:bg-teal-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-funds-line" /></div>概算分配
              </button>
              <button onClick={() => setShowMaterialChange(false)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Budget View Placeholder */}
      {showBudgetView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBudgetView(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[700px] max-w-[90vw] p-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-slate-800 mb-4">概算分配查看</h3>
            <div className="text-sm text-slate-500">当前合同的概算分配情况（只读查看）</div>
          </div>
        </div>
      )}

      {/* Amount Change Budget Allocation Modal */}
      {showAmtBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowAmtBudget(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[1000px] max-w-[95vw] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-base font-semibold text-slate-800">概算分配 - 合同金额异动</h3>
              <button onClick={() => setShowAmtBudget(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line text-lg" /></button>
            </div>
            <div className="px-5 py-4">
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-600 mb-4">合同占用的概算必须从需求占用的概算里面挑选</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[280px]">概算费用名称</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">概算金额(元)</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">需求已占用金额(元)</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">合同已占用金额(元)</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">本次占用金额</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">是否结余</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">结余金额(元)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amtFormData.budgetAllocations.map((item) => {
                      const availableAmount = item.demandOccupied - item.contractOccupied;
                      const isOverLimit = (item.currentOccupied || 0) > availableAmount;
                      const balanceAmount = item.estimateAmount - item.demandOccupied - item.contractOccupied - (item.currentOccupied || 0);
                      const isCategoryLevel1 = item.estimateName.startsWith('设备工器具购置费') || item.estimateName.startsWith('建筑工程费') || item.estimateName.startsWith('安装工程费') || item.estimateName.startsWith('工程建设其他费');
                      const isCategoryLevel2 = item.estimateName.startsWith('  ') && !item.estimateName.startsWith('    ');
                      const isCategoryLevel3 = item.estimateName.startsWith('    ');
                      return (
                        <tr key={item.id} className={`border-b border-slate-100 ${isCategoryLevel1 ? 'bg-slate-100 font-semibold' : isCategoryLevel2 ? 'bg-slate-50' : ''}`}>
                          <td className={`px-3 py-2 text-slate-700 whitespace-nowrap text-xs ${isCategoryLevel3 ? 'pl-8' : ''}`}>{item.estimateName.trim()}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(item.estimateAmount)}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(item.demandOccupied)}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(item.contractOccupied)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                            {!isCategoryLevel1 ? (
                              <div>
                                <input type="number" step="1" min="0" value={item.currentOccupied || ''} onChange={e => {
                                  const val = Number(e.target.value);
                                  setAmtFormData(prev => ({ ...prev, budgetAllocations: prev.budgetAllocations.map(b => b.id === item.id ? { ...b, currentOccupied: val, balanceAmount: b.estimateAmount - b.demandOccupied - b.contractOccupied - val, isBalance: val > 0 && val >= availableAmount ? '是' : b.isBalance } : b) }));
                                }} className={`w-28 px-1 py-1 text-xs border rounded bg-white text-right font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${isOverLimit ? 'border-red-400 bg-red-50 text-red-600' : 'border-slate-300'}`} />
                                {isOverLimit && <span className="text-xs text-red-500 ml-1">超出可用</span>}
                              </div>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-center">
                            {!isCategoryLevel1 ? (
                              <select value={item.isBalance} onChange={e => setAmtFormData(prev => ({ ...prev, budgetAllocations: prev.budgetAllocations.map(b => b.id === item.id ? { ...b, isBalance: e.target.value } : b) }))} className="px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                                <option value="否">否</option><option value="是">是</option>
                              </select>
                            ) : null}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs text-right font-mono ${balanceAmount < 0 ? 'text-red-600' : 'text-slate-700'}`}>{!isCategoryLevel1 ? formatCurrency(balanceAmount) : null}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-slate-200 sticky bottom-0 bg-white">
              <button onClick={() => { showToast('概算分配数据已保存'); setShowAmtBudget(false); }} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>确认</button>
              <button onClick={() => setShowAmtBudget(false)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Material Change Budget Allocation Modal */}
      {showMatBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowMatBudget(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[1000px] max-w-[95vw] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-base font-semibold text-slate-800">概算分配 - 甲供材异动</h3>
              <button onClick={() => setShowMatBudget(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line text-lg" /></button>
            </div>
            <div className="px-5 py-4">
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-600 mb-4">合同占用的概算必须从需求占用的概算里面挑选</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[280px]">概算费用名称</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">概算金额(元)</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">需求已占用金额(元)</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">合同已占用金额(元)</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">本次占用金额</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">是否结余</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">结余金额(元)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matFormData.budgetAllocations.map((item) => {
                      const availableAmount = item.demandOccupied - item.contractOccupied;
                      const isOverLimit = (item.currentOccupied || 0) > availableAmount;
                      const balanceAmount = item.estimateAmount - item.demandOccupied - item.contractOccupied - (item.currentOccupied || 0);
                      const isCategoryLevel1 = item.estimateName.startsWith('设备工器具购置费') || item.estimateName.startsWith('建筑工程费') || item.estimateName.startsWith('安装工程费') || item.estimateName.startsWith('工程建设其他费');
                      const isCategoryLevel2 = item.estimateName.startsWith('  ') && !item.estimateName.startsWith('    ');
                      const isCategoryLevel3 = item.estimateName.startsWith('    ');
                      return (
                        <tr key={item.id} className={`border-b border-slate-100 ${isCategoryLevel1 ? 'bg-slate-100 font-semibold' : isCategoryLevel2 ? 'bg-slate-50' : ''}`}>
                          <td className={`px-3 py-2 text-slate-700 whitespace-nowrap text-xs ${isCategoryLevel3 ? 'pl-8' : ''}`}>{item.estimateName.trim()}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(item.estimateAmount)}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(item.demandOccupied)}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(item.contractOccupied)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                            {!isCategoryLevel1 ? (
                              <div>
                                <input type="number" step="1" min="0" value={item.currentOccupied || ''} onChange={e => {
                                  const val = Number(e.target.value);
                                  setMatFormData(prev => ({ ...prev, budgetAllocations: prev.budgetAllocations.map(b => b.id === item.id ? { ...b, currentOccupied: val, balanceAmount: b.estimateAmount - b.demandOccupied - b.contractOccupied - val, isBalance: val > 0 && val >= availableAmount ? '是' : b.isBalance } : b) }));
                                }} className={`w-28 px-1 py-1 text-xs border rounded bg-white text-right font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${isOverLimit ? 'border-red-400 bg-red-50 text-red-600' : 'border-slate-300'}`} />
                                {isOverLimit && <span className="text-xs text-red-500 ml-1">超出可用</span>}
                              </div>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-center">
                            {!isCategoryLevel1 ? (
                              <select value={item.isBalance} onChange={e => setMatFormData(prev => ({ ...prev, budgetAllocations: prev.budgetAllocations.map(b => b.id === item.id ? { ...b, isBalance: e.target.value } : b) }))} className="px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                                <option value="否">否</option><option value="是">是</option>
                              </select>
                            ) : null}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs text-right font-mono ${balanceAmount < 0 ? 'text-red-600' : 'text-slate-700'}`}>{!isCategoryLevel1 ? formatCurrency(balanceAmount) : null}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-slate-200 sticky bottom-0 bg-white">
              <button onClick={() => { showToast('概算分配数据已保存'); setShowMatBudget(false); }} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>确认</button>
              <button onClick={() => setShowMatBudget(false)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>
      )}
    </Layout>
  );
}