import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getReimbContractById,
  getSettlementById,
  getSettlementInvoices,
  getSettlementSAAItems,
  settlementChangeTypeOptions,
  incomeExpenseOptions,
  costTypeOptions,
  settlementUnitOptions,
  invoiceTypeOptions,
  formatCurrency,
  SettlementInvoice,
  SettlementSAAItem,
} from '@/mocks/paymentReimbursementMocks';

export default function SettlementFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const appId = urlParams.get('appId') || '';
  const isEdit = !!appId;

  const contract = getReimbContractById(contractId);
  const existingApp = isEdit ? getSettlementById(appId) : null;

  const today = new Date().toISOString().split('T')[0];
  const serialGen = `LS${new Date().toISOString().replace(/-/g, '').slice(0, 14)}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    contractNo: contract?.contractNo || '',
    changeType: '',
    incomeExpense: '',
    applicant: '当前用户',
    applyDate: today,
    submitter: '',
    submitStatus: '待呈核',
    submitDate: '',
    modifier: '',
    modifyDate: '',
    serialNo: serialGen,
    costType: '',
    settlementUnit: '',
    settlementAmount: '0.00',
    invoiceAmount: '0.00',
    voucherDate: '',
    remark: '',
    reimbursementNo: '',
    reimbursementStatus: '',
    reimbursementDate: '',
    financeSettlementDate: '',
    financeSettlementPerson: '',
    financeSettlementStatus: '',
    uploadFiles: [] as string[],
  });

  const [invoices, setInvoices] = useState<SettlementInvoice[]>([]);
  const [invoiceModal, setInvoiceModal] = useState<{ open: boolean; editId?: string }>({ open: false });
  const [toast, setToast] = useState('');
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  useEffect(() => {
    if (existingApp) {
      setFormData({
        contractNo: existingApp.contractNo || contract?.contractNo || '',
        changeType: existingApp.changeType,
        incomeExpense: existingApp.incomeExpense,
        applicant: existingApp.applicant,
        applyDate: existingApp.applyDate,
        submitter: existingApp.submitter,
        submitStatus: existingApp.submitStatus,
        submitDate: existingApp.submitDate,
        modifier: '当前用户',
        modifyDate: today,
        serialNo: existingApp.serialNo,
        costType: existingApp.costType,
        settlementUnit: existingApp.settlementUnit,
        settlementAmount: String(existingApp.settlementAmount),
        invoiceAmount: String(existingApp.invoiceAmount),
        voucherDate: existingApp.voucherDate,
        remark: existingApp.remark,
        reimbursementNo: existingApp.reimbursementNo,
        reimbursementStatus: existingApp.reimbursementStatus,
        reimbursementDate: existingApp.reimbursementDate,
        financeSettlementDate: existingApp.financeSettlementDate,
        financeSettlementPerson: existingApp.financeSettlementPerson,
        financeSettlementStatus: existingApp.financeSettlementStatus,
        uploadFiles: existingApp.attachmentFiles || [],
      });
      setInvoices(getSettlementInvoices(appId));
    }
  }, [existingApp, contract, appId]);

  // Invoice summary calculations
  const invoiceTotal = invoices.reduce((sum, inv) => sum + inv.invoiceAmount, 0);
  const taxTotal = invoices.reduce((sum, inv) => sum + inv.taxAmount, 0);
  const taxExcludedTotal = invoices.reduce((sum, inv) => sum + inv.taxExcludedPrice, 0);

  // SAA items derived from invoices
  const saaItems: SettlementSAAItem[] = invoices.map((inv, idx) => ({
    id: `saa-${inv.id}`,
    appId: appId || 'new',
    planningNo: `FYGH-${today.replace(/-/g, '')}-${String(3000 + idx).padStart(3, '0')}`,
    applyNo: formData.serialNo ? `JSJS-${formData.serialNo}` : '',
    serialNo: inv.serialNo,
    debitCredit: '借',
    payAmount: inv.invoiceAmount,
    accountSubject: `在建工程-${formData.costType === '设备' ? '设备购置费' : formData.costType === '建安' ? '土建施工费' : '工程结算费'}`,
    description: `${contract?.contractName?.slice(0, 12) || ''}结算款${idx + 1}`,
    modifier: '当前用户',
    modifyDate: today,
  }));

  const handleSubmit = () => {
    if (!formData.changeType) { showToast('请选择异动类型'); return; }
    if (!formData.incomeExpense) { showToast('请选择收支专案'); return; }
    if (!formData.costType) { showToast('请选择费用类别'); return; }
    if (!formData.settlementUnit) { showToast('请选择结算单位'); return; }
    showToast(isEdit ? '修改成功' : '提交成功');
    setTimeout(() => navigate(`/project-contract/payment-reimbursement/reimbursement-list?contractId=${contractId}`), 500);
  };

  const handleFileUpload = () => {
    showToast('文件选择中...');
    setFormData((prev) => ({ ...prev, uploadFiles: [...prev.uploadFiles, `附件_${prev.uploadFiles.length + 1}.pdf`] }));
  };

  const removeFile = (idx: number) => {
    setFormData((prev) => ({ ...prev, uploadFiles: prev.uploadFiles.filter((_, i) => i !== idx) }));
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    showToast('发票已删除');
    setDeleteInvoiceId(null);
  };

  if (!contract) return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div></Layout>;

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">{isEdit ? '编辑' : '新增'}结算报支</h1>
          <button onClick={() => navigate(`/project-contract/payment-reimbursement/reimbursement-list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Anchor Nav */}
          <nav className="w-40 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              <a href="#settle-base" className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-information-line text-xs" /></div>结算基本信息
              </a>
              <a href="#settle-reimburse" className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-bank-card-line text-xs" /></div>报支信息
              </a>
              <a href="#settle-invoice" className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-file-list-3-line text-xs" /></div>结算发票清单
              </a>
              <a href="#settle-content" className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-calculator-line text-xs" /></div>结算金额申请内容
              </a>
            </div>
          </nav>

          {/* Right Form */}
          <div className="flex-1 min-w-0">
            {/* Section 1: 结算基本信息 */}
            <section id="settle-base" className="mb-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #f59e0b, #d97706)' }} />
                结算基本信息
              </h2>
              <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">合同编号</span>
                    <input type="text" value={formData.contractNo} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">异动类型</span>
                    <select value={formData.changeType} onChange={(e) => setFormData((prev) => ({ ...prev, changeType: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                      <option value="">请选择</option>
                      {settlementChangeTypeOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">收支专案</span>
                    <select value={formData.incomeExpense} onChange={(e) => setFormData((prev) => ({ ...prev, incomeExpense: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                      <option value="">请选择</option>
                      {incomeExpenseOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">申请人员</span>
                    <input type="text" value={formData.applicant} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">申请日期</span>
                    <input type="text" value={formData.applyDate} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">呈核人员</span>
                    <input type="text" value={formData.submitter || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-start gap-3 col-span-2">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right pt-1">附件上传</span>
                    <div className="flex-1">
                      <button onClick={handleFileUpload} className="px-3 py-1.5 text-sm text-amber-600 border border-amber-300 rounded-md hover:bg-amber-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-2-line" /></div>其它附件
                      </button>
                      {formData.uploadFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {formData.uploadFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-line text-xs" /></div>
                              <span>{f}</span>
                              <button onClick={() => removeFile(i)} className="w-4 h-4 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">呈核状态</span>
                    <input type="text" value={formData.submitStatus} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">呈核日期</span>
                    <input type="text" value={formData.submitDate || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">修改人员</span>
                    <input type="text" value={formData.modifier || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: 报支信息 */}
            <section id="settle-reimburse" className="mb-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #10b981, #059669)' }} />
                报支信息
              </h2>
              <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">流水号</span>
                    <input type="text" value={formData.serialNo} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">费用类别</span>
                    <select value={formData.costType} onChange={(e) => setFormData((prev) => ({ ...prev, costType: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                      <option value="">请选择</option>
                      {costTypeOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">结算单位</span>
                    <select value={formData.settlementUnit} onChange={(e) => setFormData((prev) => ({ ...prev, settlementUnit: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                      <option value="">请选择</option>
                      {settlementUnitOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">结算金额(元)</span>
                    <input type="text" value={formData.settlementAmount} onChange={(e) => setFormData((prev) => ({ ...prev, settlementAmount: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">发票金额(含税)(元)</span>
                    <input type="text" value={formData.invoiceAmount} onChange={(e) => setFormData((prev) => ({ ...prev, invoiceAmount: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">传票日期</span>
                    <input type="date" value={formData.voucherDate} onChange={(e) => setFormData((prev) => ({ ...prev, voucherDate: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div className="flex items-start gap-3 col-span-2">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right pt-1">备注</span>
                    <textarea value={formData.remark} onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" rows={2} placeholder="请输入备注" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">报支单号</span>
                    <input type="text" value={formData.reimbursementNo || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">报支状态</span>
                    <input type="text" value={formData.reimbursementStatus || '未报支'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">报支日期</span>
                    <input type="text" value={formData.reimbursementDate || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">财务决算日期</span>
                    <input type="text" value={formData.financeSettlementDate || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">财务决算人员</span>
                    <input type="text" value={formData.financeSettlementPerson || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">财务决算状态</span>
                    <input type="text" value={formData.financeSettlementStatus || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-32 flex-shrink-0 text-right">修改日期</span>
                    <input type="text" value={formData.modifyDate || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: 结算发票清单 */}
            <section id="settle-invoice" className="mb-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6, #2563eb)' }} />
                结算发票清单
              </h2>
              {/* Summary Bar */}
              <div className="bg-blue-50/50 rounded-lg border border-blue-200 p-3 mb-3 flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">结算申请编号</span>
                  <span className="text-sm font-medium text-slate-700">{formData.serialNo || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">结算金额</span>
                  <span className="text-sm font-mono font-medium text-slate-700">{formatCurrency(Number(formData.settlementAmount) || 0)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">发票税后总金额</span>
                  <span className="text-sm font-mono font-medium text-amber-700">{formatCurrency(invoiceTotal)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">发票税前总金额</span>
                  <span className="text-sm font-mono font-medium text-emerald-700">{formatCurrency(taxExcludedTotal)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">发票税额总金额</span>
                  <span className="text-sm font-mono font-medium text-violet-700">{formatCurrency(taxTotal)}</span>
                </div>
              </div>
              <div className="mb-3">
                <button onClick={() => setInvoiceModal({ open: true })} className="px-3 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增
                </button>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同结算发票登录编号</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">流水号</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">发票号码</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">发票日期</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">发票金额(元)</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">发票类型</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">税率</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">含税价(元)</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">税额(元)</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">不含税价(元)</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{inv.registerNo}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{inv.serialNo}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap font-mono">{inv.invoiceNo}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{inv.invoiceDate}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(inv.invoiceAmount)}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{inv.invoiceType}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{inv.taxRate}%</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(inv.taxIncludedPrice)}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(inv.taxAmount)}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(inv.taxExcludedPrice)}</td>
                        <td className="px-3 py-2.5 text-center whitespace-nowrap">
                          <button onClick={() => setInvoiceModal({ open: true, editId: inv.id })} className="px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap mr-1">修改</button>
                          <button onClick={() => setDeleteInvoiceId(inv.id)} className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr><td colSpan={11} className="px-3 py-8 text-center text-sm text-slate-400">暂无发票明细，请点击"新增"添加</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: 结算金额申请内容 */}
            <section id="settle-content" className="mb-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)' }} />
                结算金额申请内容
              </h2>
              <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-3 mb-3 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">结算申请编号</span>
                  <span className="text-sm font-medium text-slate-700">{formData.serialNo || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">结算金额(元)</span>
                  <span className="text-sm font-mono font-medium text-slate-700">{formatCurrency(Number(formData.settlementAmount) || 0)}</span>
                </div>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同预付款费用规划编号</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同预付款申请编号</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">流水号</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">借/贷</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">付款金额(元)</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '180px' }}>会计科目</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '220px' }}>费用说明</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">修改人</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">修改日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saaItems.map((item, idx) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.planningNo}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.applyNo || '-'}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.serialNo}</td>
                        <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{item.debitCredit}</span>
                        </td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(item.payAmount)}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.accountSubject}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.description}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.modifier}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.modifyDate}</td>
                      </tr>
                    ))}
                    {saaItems.length === 0 && (
                      <tr><td colSpan={9} className="px-3 py-8 text-center text-sm text-slate-400">暂无金额申请内容，请先添加发票明细</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #e8edf3' }}>
              <button onClick={handleSubmit} className="px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-check-line" /></div>提交
              </button>
              <button onClick={() => showToast('已保存')} className="px-5 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-save-line" /></div>保存
              </button>
              <button onClick={() => navigate(`/project-contract/payment-reimbursement/reimbursement-list?contractId=${contractId}`)} className="px-5 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-close-line" /></div>取消
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {invoiceModal.open && <InvoiceModal
        isEdit={!!invoiceModal.editId}
        initialData={invoiceModal.editId ? invoices.find((inv) => inv.id === invoiceModal.editId) || null : null}
        appSerialNo={formData.serialNo}
        onSave={(invData) => {
          if (invoiceModal.editId) {
            setInvoices((prev) => prev.map((inv) => inv.id === invoiceModal.editId ? { ...inv, ...invData, modifier: '当前用户', modifyDate: today } : inv));
          } else {
            const newInv: SettlementInvoice = {
              id: `inv-new-${Date.now()}`,
              appId: appId || 'new',
              registerNo: `FPDJ-${today.replace(/-/g, '')}-${String(invoices.length + 1).padStart(3, '0')}`,
              serialNo: `${formData.serialNo}-${String(invoices.length + 1).padStart(2, '0')}`,
              ...invData,
              creator: '当前用户',
              createDate: today,
              modifier: '当前用户',
              modifyDate: today,
            };
            setInvoices((prev) => [...prev, newInv]);
          }
          setInvoiceModal({ open: false });
          showToast(invoiceModal.editId ? '发票修改成功' : '发票新增成功');
        }}
        onClose={() => setInvoiceModal({ open: false })}
      />}

      {/* Delete Invoice Confirm */}
      {deleteInvoiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteInvoiceId(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[400px] p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-2">删除确认</h3>
            <p className="text-sm text-slate-600 mb-5">确认删除该发票记录吗？删除后无法恢复。</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteInvoiceId(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={() => handleDeleteInvoice(deleteInvoiceId)} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}

// Invoice Modal sub-component
function InvoiceModal({ isEdit, initialData, appSerialNo, onSave, onClose }: {
  isEdit: boolean;
  initialData: SettlementInvoice | null;
  appSerialNo: string;
  onSave: (data: { invoiceNo: string; invoiceDate: string; invoiceAmount: number; invoiceType: string; taxRate: number; taxIncludedPrice: number; taxAmount: number; taxExcludedPrice: number }) => void;
  onClose: () => void;
}) {
  const today = new Date().toISOString().split('T')[0];
  const [invForm, setInvForm] = useState({
    invoiceNo: initialData?.invoiceNo || '',
    invoiceDate: initialData?.invoiceDate || today,
    invoiceAmount: String(initialData?.invoiceAmount || '0.00'),
    invoiceType: initialData?.invoiceType || '',
    taxRate: String(initialData?.taxRate || '0.00'),
    taxIncludedPrice: String(initialData?.taxIncludedPrice || '0.00'),
    taxAmount: String(initialData?.taxAmount || '0.00'),
    taxExcludedPrice: String(initialData?.taxExcludedPrice || '0.00'),
  });

  useEffect(() => {
    const amt = Number(invForm.invoiceAmount) || 0;
    const rate = Number(invForm.taxRate) || 0;
    const taxInc = amt;
    const taxAmt = rate > 0 ? amt * rate / (100 + rate) : 0;
    const taxExc = amt - taxAmt;
    setInvForm((prev) => ({
      ...prev,
      taxIncludedPrice: formatCurrency(taxInc),
      taxAmount: formatCurrency(taxAmt),
      taxExcludedPrice: formatCurrency(taxExc),
    }));
  }, [invForm.invoiceAmount, invForm.taxRate]);

  const handleSave = () => {
    if (!invForm.invoiceNo.trim()) { return; }
    const invNoPattern = /^\d{8}-\d{10}$/;
    if (!invNoPattern.test(invForm.invoiceNo.trim())) { return; }
    if (!invForm.invoiceDate) { return; }
    if (!invForm.invoiceType) { return; }
    onSave({
      invoiceNo: invForm.invoiceNo.trim(),
      invoiceDate: invForm.invoiceDate,
      invoiceAmount: Number(invForm.invoiceAmount) || 0,
      invoiceType: invForm.invoiceType,
      taxRate: Number(invForm.taxRate) || 0,
      taxIncludedPrice: Number(invForm.taxIncludedPrice) || 0,
      taxAmount: Number(invForm.taxAmount) || 0,
      taxExcludedPrice: Number(invForm.taxExcludedPrice) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[720px] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #e8edf3' }}>
          <h3 className="text-base font-semibold text-slate-800">{isEdit ? '修改' : '新增'}结算发票</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer">
            <i className="ri-close-line text-slate-500" />
          </button>
        </div>
        <div className="overflow-auto flex-1 p-5">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">结算申请编号</span>
              <input type="text" value={appSerialNo} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">流水号</span>
              <input type="text" value={`${appSerialNo}-${isEdit ? '01' : '01'}`} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">发票号码<span className="text-red-500">*</span></span>
              <input type="text" value={invForm.invoiceNo} onChange={(e) => setInvForm((prev) => ({ ...prev, invoiceNo: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono" placeholder="XXXXXXXX-YYYYYYYYYY" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">发票金额(元)<span className="text-red-500">*</span></span>
              <input type="text" value={invForm.invoiceAmount} onChange={(e) => setInvForm((prev) => ({ ...prev, invoiceAmount: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">发票日期<span className="text-red-500">*</span></span>
              <input type="date" value={invForm.invoiceDate} onChange={(e) => setInvForm((prev) => ({ ...prev, invoiceDate: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">发票类型<span className="text-red-500">*</span></span>
              <select value={invForm.invoiceType} onChange={(e) => setInvForm((prev) => ({ ...prev, invoiceType: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option value="">请选择</option>
                {invoiceTypeOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">税率</span>
              <input type="text" value={invForm.taxRate} onChange={(e) => setInvForm((prev) => ({ ...prev, taxRate: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">含税价(元)</span>
              <input type="text" value={invForm.taxIncludedPrice} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">建档人员</span>
              <input type="text" value="当前用户" readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">修改人员</span>
              <input type="text" value="当前用户" readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">税额(元)</span>
              <input type="text" value={invForm.taxAmount} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">不含税价(元)</span>
              <input type="text" value={invForm.taxExcludedPrice} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">建档日期</span>
              <input type="text" value={today} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">修改日期</span>
              <input type="text" value={today} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4" style={{ borderTop: '1px solid #e8edf3' }}>
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
}