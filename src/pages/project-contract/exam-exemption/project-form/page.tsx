import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getExamContractById, getExamAppById, getExamApprovalRecordsByAppId, formatCurrency, exemptionTypes } from '@/mocks/examExemptionMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';

interface AnchorSection { key: string; label: string; }
const sections: AnchorSection[] = [
  { key: 'left', label: '左侧信息' },
  { key: 'right', label: '右侧信息' },
  { key: 'records', label: '审核记录' },
];

export default function ExamExemptionProjectFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const appId = urlParams.get('appId') || '';
  const mode = urlParams.get('mode') || 'add';

  const contract = getExamContractById(contractId);
  const existingApp = appId ? getExamAppById(appId) : null;
  const isEdit = !!existingApp;
  const records = appId ? getExamApprovalRecordsByAppId(appId) : [];

  const [activeSection, setActiveSection] = useState('left');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [formData, setFormData] = useState({
    appNo: existingApp?.appNo || '',
    contractNo: contract?.contractNo || '',
    contractAmount: contract?.contractAmount || 0,
    planStartDate: existingApp?.planStartDate || contract?.signDate || '',
    actualStartDate: existingApp?.actualStartDate || '',
    exemptionDays: existingApp?.exemptionDays || 0,
    exemptionType: existingApp?.exemptionType || '',
    contractText: existingApp?.contractText || '标准合同文本',
    overdueReason: existingApp?.overdueReason || '',
    confirmReason: '',
    currentOperator: existingApp?.currentOperator || '当前用户',
    applyDate: existingApp?.applyDate || new Date().toISOString().split('T')[0],
    approvalNo: existingApp?.approvalNo || contract?.approvalNo || '',
    contractName: contract?.contractName || '',
    agreedPenaltyAmount: existingApp?.agreedPenaltyAmount || 0,
    planEndDate: existingApp?.planEndDate || '',
    actualEndDate: existingApp?.actualEndDate || '',
    exemptionAmount: existingApp?.exemptionAmount || 0,
    attachments: existingApp?.attachments || [],
    finalPenaltyAmount: existingApp?.finalPenaltyAmount || 0,
  });

  const [toast, setToast] = useState('');
  const [showFlowConfig, setShowFlowConfig] = useState(false);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const scrollToSection = (key: string) => { setActiveSection(key); const el = sectionRefs.current[key]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.getAttribute('data-section') || ''); }); },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    sections.forEach((s) => { const el = sectionRefs.current[s.key]; if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const finalAmt = formData.agreedPenaltyAmount - formData.exemptionAmount;
    setFormData((prev) => ({ ...prev, finalPenaltyAmount: finalAmt > 0 ? finalAmt : 0 }));
  }, [formData.agreedPenaltyAmount, formData.exemptionAmount]);

  if (!contract) return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div></Layout>;

  const handleSave = () => {
    if (!formData.overdueReason.trim()) { showToast('请输入合同超期原因'); return; }
    if (!formData.exemptionType) { showToast('请选择免考核类型'); return; }
    showToast(isEdit ? '保存成功' : '暂存成功');
  };

  const handleFlowSubmit = () => { setShowFlowConfig(false); showToast('审批已发起'); };

  const actionColor = (a: string) => {
    if (a.includes('通过') || a.includes('确认')) return 'bg-emerald-50 text-emerald-700';
    if (a.includes('退回')) return 'bg-red-50 text-red-700';
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
              {sections.map((s) => (<button key={s.key} onClick={() => scrollToSection(s.key)} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeSection === s.key ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>{s.label}</button>))}
            </nav>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-lg font-semibold text-slate-800">{isEdit ? '修改免考申请' : '新增免考申请'}</h1></div>
            <button onClick={() => navigate(`/project-contract/exam-exemption/exemption-list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回</button>
          </div>

          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
          </div>

          {/* Left & Right layout */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div ref={(el) => { sectionRefs.current['left'] = el; }} data-section="left">
              <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-emerald-500" /><span className="text-sm font-semibold text-slate-800">左侧信息</span></div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                {[
                  ['合同超期申请单号', formData.appNo || '新增时自动生成', true],
                  ['合同编号', formData.contractNo, true],
                  ['合同金额(元)', formatCurrency(formData.contractAmount), true],
                  ['计划开工时间', formData.planStartDate, true],
                  ['实际开工时间', '', false],
                  ['合同免除考核天数', '', false],
                  ['最终考核金额', formatCurrency(formData.finalPenaltyAmount), true],
                  ['免考核类型', '', false],
                  ['合同文本', formData.contractText, true],
                ].map(([label, value, readonly], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-32">{label}</span>
                    {readonly ? (
                      <input type="text" value={value as string} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                    ) : label === '免考核类型' ? (
                      <select value={formData.exemptionType} onChange={(e) => setFormData({ ...formData, exemptionType: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                        <option value="">请选择</option>{exemptionTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                      </select>
                    ) : label === '实际开工时间' ? (
                      <input type="date" value={formData.actualStartDate} onChange={(e) => setFormData({ ...formData, actualStartDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    ) : label === '合同免除考核天数' ? (
                      <input type="number" value={formData.exemptionDays || ''} onChange={(e) => setFormData({ ...formData, exemptionDays: Number(e.target.value) })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    ) : (
                      <input type="text" value={value as string} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                    )}
                  </div>
                ))}
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-1"><span className="text-red-500">*</span>合同超期原因</span>
                  <textarea value={formData.overdueReason} onChange={(e) => setFormData({ ...formData, overdueReason: e.target.value })} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" maxLength={250} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div ref={(el) => { sectionRefs.current['right'] = el; }} data-section="right">
              <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-blue-500" /><span className="text-sm font-semibold text-slate-800">右侧信息</span></div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                {[
                  ['立项号', formData.approvalNo, true],
                  ['合同名称', formData.contractName, true],
                  ['合同约定考核金额(元)', formatCurrency(formData.agreedPenaltyAmount), true],
                  ['计划竣工时间', formData.planEndDate, true],
                  ['实际竣工时间', '', false],
                  ['免除考核金额', '', false],
                ].map(([label, value, readonly], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-32">{label}</span>
                    {readonly ? (
                      <input type="text" value={value as string} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                    ) : label === '实际竣工时间' ? (
                      <input type="date" value={formData.actualEndDate} onChange={(e) => setFormData({ ...formData, actualEndDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    ) : (
                      <input type="number" value={formData.exemptionAmount || ''} onChange={(e) => setFormData({ ...formData, exemptionAmount: Number(e.target.value) })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="单位：元" step="1" />
                    )}
                  </div>
                ))}
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-0.5">申报人上传其他附件</span>
                  <div className="flex-1">
                    {formData.attachments.length > 0 ? (
                      <div className="flex flex-wrap gap-2">{formData.attachments.map((f, fi) => (<span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>))}</div>
                    ) : <span className="text-sm text-slate-400">暂无附件</span>}
                    <button className="mt-2 px-3 py-1.5 text-xs text-slate-600 border border-dashed border-slate-300 rounded-md hover:bg-white cursor-pointer flex items-center gap-1 whitespace-nowrap"><div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-upload-line" /></div>上传附件</button>
                  </div>
                </div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-32">当前操作人</span><input type="text" value={formData.currentOperator} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-32">申报日期</span><input type="text" value={formData.applyDate} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
              </div>
            </div>
          </div>

          {/* Approval Records */}
          <div ref={(el) => { sectionRefs.current['records'] = el; }} data-section="records" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-purple-500" /><span className="text-sm font-semibold text-slate-800">审核记录</span></div>
            {records.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">暂无审核记录</div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50"><tr style={{ borderBottom: '1px solid #e2e8f0' }}><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核阶段</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作日期</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th></tr></thead>
                  <tbody>
                    {records.map((rec) => (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.stage}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColor(rec.operation)}`}>{rec.operation}</span></td>
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

          {/* Bottom */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => setShowFlowConfig(true)} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}><div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核</button>
            <button onClick={handleSave} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line" /></div>保存</button>
            <button onClick={() => navigate(`/project-contract/exam-exemption/exemption-list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
          </div>
        </div>
      </div>
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
      {showFlowConfig && <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={handleFlowSubmit} defaultTitle={`免考申请审批-${contract.contractNo}`} />}
    </Layout>
  );
}