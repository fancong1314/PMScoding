import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getReimbContractById, getPrepaymentById, prepayChangeTypeOptions, incomeExpenseOptions, costTypeOptions, formatCurrency } from '@/mocks/paymentReimbursementMocks';

export default function PrepaymentFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const appId = urlParams.get('appId') || '';
  const isEdit = !!appId;

  const contract = getReimbContractById(contractId);
  const existingApp = isEdit ? getPrepaymentById(appId) : null;

  const [formData, setFormData] = useState({
    contractNo: contract?.contractNo || '',
    changeType: '',
    incomeExpense: '',
    applicant: '当前用户',
    applyDate: new Date().toISOString().split('T')[0],
    submitter: '',
    submitStatus: '待呈核',
    submitDate: '',
    modifier: '',
    modifyDate: '',
    // 报支信息
    serialNo: `LS${new Date().toISOString().replace(/-/g, '').slice(0, 14)}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
    costType: '',
    prepayAmount: '0.00',
    voucherDate: '',
    reimbursementNo: '',
    reimbursementStatus: '',
    reimbursementDate: '',
    // attachments
    uploadFiles: [] as string[],
    prepayTableFile: '',
  });

  const [toast, setToast] = useState('');

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
        modifyDate: new Date().toISOString().split('T')[0],
        serialNo: existingApp.serialNo,
        costType: existingApp.costType,
        prepayAmount: String(existingApp.prepayAmount),
        voucherDate: existingApp.voucherDate,
        reimbursementNo: existingApp.reimbursementNo,
        reimbursementStatus: existingApp.reimbursementStatus,
        reimbursementDate: existingApp.reimbursementDate,
        uploadFiles: existingApp.attachmentFiles || [],
        prepayTableFile: existingApp.prepayTableFile || '',
      });
    }
  }, [existingApp, contract]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleSubmit = () => {
    if (!formData.changeType) { showToast('请选择异动类型'); return; }
    if (!formData.incomeExpense) { showToast('请选择收支专案'); return; }
    if (!formData.costType) { showToast('请选择费用类别'); return; }
    showToast(isEdit ? '修改成功' : '提交成功');
    setTimeout(() => navigate(`/project-contract/payment-reimbursement/reimbursement-list?contractId=${contractId}`), 500);
  };

  const handleFileUpload = () => {
    showToast('文件选择中...');
    setFormData((prev) => ({ ...prev, uploadFiles: [...prev.uploadFiles, `附件_${prev.uploadFiles.length + 1}.pdf`] }));
  };

  const handlePrepayTableUpload = () => {
    showToast('预付款申报表上传中...');
    setFormData((prev) => ({ ...prev, prepayTableFile: '预付款申报表.pdf' }));
  };

  const removeFile = (idx: number) => {
    setFormData((prev) => ({ ...prev, uploadFiles: prev.uploadFiles.filter((_, i) => i !== idx) }));
  };

  if (!contract) return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div></Layout>;

  const sectionIds = ['base-info', 'reimburse-info', 'prepay-table'];

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">{isEdit ? '编辑' : '新增'}预付款报支</h1>
          <button onClick={() => navigate(`/project-contract/payment-reimbursement/reimbursement-list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Anchor Nav */}
          <nav className="w-40 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              <a href="#base-info" className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-information-line text-xs" /></div>基础信息
              </a>
              <a href="#reimburse-info" className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-bank-card-line text-xs" /></div>报支信息
              </a>
              <a href="#prepay-table" className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-file-list-3-line text-xs" /></div>预付款申报表
              </a>
            </div>
          </nav>

          {/* Right Form */}
          <div className="flex-1 min-w-0">
            {/* Section 1: 基础信息 */}
            <section id="base-info" className="mb-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6, #2563eb)' }} />
                基础信息
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">合同编号</span>
                  <input type="text" value={formData.contractNo} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">异动类型</span>
                  <select value={formData.changeType} onChange={(e) => setFormData((prev) => ({ ...prev, changeType: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="">请选择</option>
                    {prepayChangeTypeOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">收支专案</span>
                  <select value={formData.incomeExpense} onChange={(e) => setFormData((prev) => ({ ...prev, incomeExpense: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="">请选择</option>
                    {incomeExpenseOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">申请人员</span>
                  <input type="text" value={formData.applicant} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">申请日期</span>
                  <input type="text" value={formData.applyDate} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">呈核人员</span>
                  <input type="text" value={formData.submitter || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">呈核状态</span>
                  <input type="text" value={formData.submitStatus} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right pt-1">附件上传</span>
                  <div className="flex-1">
                    <button onClick={handleFileUpload} className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
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
                <div className="flex items-start gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right pt-1">合同文本</span>
                  <div className="flex-1">
                    <button onClick={() => showToast('查看合同文本：' + contract.contractNo)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                      <div className="w-4 h-4 flex items-center justify-center"><i className="ri-eye-line" /></div>查看合同文本
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">呈核日期</span>
                  <input type="text" value={formData.submitDate || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">修改人员</span>
                  <input type="text" value={formData.modifier || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
              </div>
            </section>

            {/* Section 2: 报支信息 */}
            <section id="reimburse-info" className="mb-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #10b981, #059669)' }} />
                报支信息
              </h2>
              <div className="bg-slate-50/60 rounded-lg border border-slate-200 p-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">流水号</span>
                    <input type="text" value={formData.serialNo} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">费用类别</span>
                    <select value={formData.costType} onChange={(e) => setFormData((prev) => ({ ...prev, costType: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option value="">请选择</option>
                      {costTypeOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">预付金额(元)</span>
                    <input type="text" value={formData.prepayAmount} onChange={(e) => setFormData((prev) => ({ ...prev, prepayAmount: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">传票日期</span>
                    <input type="date" value={formData.voucherDate} onChange={(e) => setFormData((prev) => ({ ...prev, voucherDate: e.target.value }))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">报支单号</span>
                    <input type="text" value={formData.reimbursementNo || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">报支状态</span>
                    <input type="text" value={formData.reimbursementStatus || '未报支'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">报支日期</span>
                    <input type="text" value={formData.reimbursementDate || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-28 flex-shrink-0 text-right">修改日期</span>
                    <input type="text" value={formData.modifyDate || '-'} readOnly className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: 预付款申报表 */}
            <section id="prepay-table" className="mb-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #f59e0b, #d97706)' }} />
                预付款申报表
              </h2>
              <div className="bg-slate-50/60 rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">预付款申报表</span>
                  <button onClick={handlePrepayTableUpload} className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-2-line" /></div>上传
                  </button>
                  {formData.prepayTableFile && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-excel-2-line text-green-600 text-xs" /></div>
                      <span>{formData.prepayTableFile}</span>
                      <button onClick={() => setFormData((prev) => ({ ...prev, prepayTableFile: '' }))} className="w-4 h-4 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #e8edf3' }}>
              <button onClick={handleSubmit} className="px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
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

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}