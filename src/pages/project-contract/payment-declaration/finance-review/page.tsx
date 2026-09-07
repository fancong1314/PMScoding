import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getPayDeclarationById, getPayApprovalRecords, formatCurrency } from '@/mocks/paymentDeclarationMocks';

interface AnchorSection { key: string; label: string; }

const sections: AnchorSection[] = [
  { key: 'basic-info', label: '申报基本信息' },
  { key: 'amount-info', label: '金额明细' },
  { key: 'approval-records', label: '审核记录' },
];

export default function PaymentFinanceReviewPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const declarationId = urlParams.get('declarationId') || '';

  const declaration = getPayDeclarationById(declarationId);
  const records = getPayApprovalRecords(declarationId);

  const [reviewOpinion, setReviewOpinion] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState('');

  const [activeSection, setActiveSection] = useState('basic-info');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { const key = e.target.getAttribute('data-section'); if (key) setActiveSection(key); } }); },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    sections.forEach((s) => { const el = sectionRefs.current[s.key]; if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleReturnSubmit = () => {
    if (!rejectReason.trim()) { showToast('请输入退回原因'); return; }
    setShowRejectModal(false); setRejectReason('');
    showToast('已退回至申报人');
  };

  if (!declaration) {
    return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">申报数据不存在</div></Layout>;
  }

  const infoField = (label: string, value: string) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 whitespace-nowrap w-36">{label}</span>
      <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{value || '--'}</span>
    </div>
  );

  const actionColor = (a: string) => {
    if (a.includes('通过') || a.includes('确认')) return 'bg-emerald-50 text-emerald-700';
    if (a.includes('退回') || a.includes('驳回')) return 'bg-red-50 text-red-700';
    if (a.includes('提交') || a.includes('呈核')) return 'bg-blue-50 text-blue-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <Layout>
      <div className="flex gap-5">
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.key} onClick={() => scrollToSection(s.key)} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeSection === s.key ? 'bg-violet-50 text-violet-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>{s.label}</button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">财务部审核</h1>
              <p className="text-sm text-slate-500 mt-0.5">{declaration.appNo} | {declaration.contractName}</p>
            </div>
            <button onClick={() => navigate(-1)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
            </button>
          </div>

          <div ref={(el) => { sectionRefs.current['basic-info'] = el; }} data-section="basic-info" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-violet-500" />
              <span className="text-sm font-semibold text-slate-800">申报基本信息</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                {infoField('工程款申请编号', declaration.appNo)}
                {infoField('合同编号', declaration.contractNo)}
                {infoField('合同名称', declaration.contractName)}
                {infoField('承包商名称', declaration.contractorName)}
                {infoField('合同签订日期', declaration.contractSignDate)}
                {infoField('计划开工日期', declaration.planStartDate)}
                {infoField('计划竣工日期', declaration.planEndDate)}
                {infoField('实际开工日期', declaration.actualStartDate || '--')}
                {infoField('实际竣工日期', declaration.actualEndDate || '--')}
                {infoField('项目经理', declaration.projectManager)}
                {infoField('申报部门', declaration.declareDept)}
                {infoField('付款类型', declaration.payType)}
                {infoField('申报日期', declaration.declareDate)}
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">工程量内容</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{declaration.workContent}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">申报原因</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{declaration.declareReason}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">项目部审核意见</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-emerald-700 font-medium">{declaration.projectReviewOpinion || '--'}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">主管部门审核意见</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-emerald-700 font-medium">{declaration.supervisoryReviewOpinion || '--'}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">附件</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {declaration.attachmentFiles.map((f, fi) => (
                      <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={(el) => { sectionRefs.current['amount-info'] = el; }} data-section="amount-info" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">金额明细（财务审查）</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                {infoField('合同总金额(元)', formatCurrency(declaration.totalWorkAmount))}
                {infoField('累计已申报金额(元)', formatCurrency(declaration.accumulatedDeclared))}
                {infoField('累计已批准金额(元)', formatCurrency(declaration.accumulatedApproved))}
                {infoField('本次申报金额(元)', formatCurrency(declaration.thisDeclareAmount))}
                {infoField('预付款扣减(元)', formatCurrency(declaration.prepayDeduct))}
                {infoField('质保金扣减(元)', formatCurrency(declaration.warrantyDeduct))}
                {infoField('甲供材扣减(元)', formatCurrency(declaration.materialDeduct))}
                {infoField('其他扣减(元)', formatCurrency(declaration.otherDeduct))}
                <div className="flex items-center gap-2 col-span-2 bg-emerald-50 rounded-md p-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 font-medium">本次实际支付金额(元)</span>
                  <span className="flex-1 px-3 py-1.5 text-base font-bold text-emerald-700 font-mono">{formatCurrency(declaration.actualPayAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={(el) => { sectionRefs.current['approval-records'] = el; }} data-section="approval-records" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-purple-500" />
              <span className="text-sm font-semibold text-slate-800">审核记录</span>
            </div>
            {records.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">暂无审核记录</div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核阶段</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作日期</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((rec) => (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.stage}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColor(rec.operation)}`}>{rec.operation}</span>
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-700">{rec.opinion || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operator}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operateDate}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operateTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mb-8 p-4 bg-violet-50 rounded-lg border border-violet-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-violet-500" />
              <span className="text-sm font-semibold text-slate-800">财务部审核意见 <span className="text-red-500">*</span></span>
            </div>
            <textarea
              value={reviewOpinion}
              onChange={(e) => setReviewOpinion(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
              placeholder="请输入财务审核意见，包括发票核对、金额复核等内容..."
              maxLength={500}
            />
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => { setShowRejectModal(true); }}
              className="px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              退回申报人
            </button>
            <button
              onClick={() => {
                if (!reviewOpinion.trim()) { showToast('请输入财务审核意见'); return; }
                showToast('已确认通过');
              }}
              className="px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              确认（通过）
            </button>
            <button
              onClick={() => { showToast('列印功能：正在生成申报单PDF文件...'); }}
              className="px-5 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-printer-line" /></div>
              列印
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              关闭页面
            </button>
          </div>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-[520px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">退回申报人</h3>
              <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="mb-4">
              <span className="text-sm text-slate-600 mb-2 block">退回原因 <span className="text-red-500">*</span></span>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none" placeholder="请输入退回原因..." maxLength={500} />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleReturnSubmit} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>确认退回</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}