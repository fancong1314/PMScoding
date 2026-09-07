import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getExamContractById, getExamAppById, getExamApprovalRecordsByAppId, formatCurrency, exemptionTypes } from '@/mocks/examExemptionMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';

interface AnchorSection { key: string; label: string; }
const sections: AnchorSection[] = [
  { key: 'basic', label: '基础信息' },
  { key: 'records', label: '审核记录' },
];

export default function ExamExemptionDepartmentConfirmPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const appId = urlParams.get('appId') || '';

  const contract = getExamContractById(contractId);
  const app = getExamAppById(appId);
  const records = appId ? getExamApprovalRecordsByAppId(appId) : [];

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [exemptionType, setExemptionType] = useState(app?.exemptionType || '');
  const [agreedPenaltyAmount, setAgreedPenaltyAmount] = useState(app?.agreedPenaltyAmount || 0);
  const [actualStartDate, setActualStartDate] = useState(app?.actualStartDate || '');
  const [actualEndDate, setActualEndDate] = useState(app?.actualEndDate || '');
  const [exemptionAmount, setExemptionAmount] = useState(app?.exemptionAmount || 0);
  const [overdueReason, setOverdueReason] = useState(app?.overdueReason || '');
  const [exemptionDays, setExemptionDays] = useState(app?.exemptionDays || 0);
  const [confirmReason, setConfirmReason] = useState('');
  const [toast, setToast] = useState('');
  const [showFlowConfig, setShowFlowConfig] = useState(false);
  const [showApprovalResult, setShowApprovalResult] = useState(false);

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

  if (!contract || !app) return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">数据不存在</div></Layout>;

  const finalPenaltyAmount = Math.max(0, agreedPenaltyAmount - exemptionAmount);

  const handleFlowSubmit = () => { setShowFlowConfig(false); showToast('审批已发起'); };
  const handleConfirm = () => { showToast('确认通过'); };
  const handleReject = () => { if (!confirmReason.trim()) { showToast('请输入退回原因'); return; } showToast('已退回'); };

  const actionColor = (a: string) => {
    if (a.includes('通过') || a.includes('确认')) return 'bg-emerald-50 text-emerald-700';
    if (a.includes('退回')) return 'bg-red-50 text-red-700';
    if (a.includes('提交') || a.includes('呈核')) return 'bg-blue-50 text-blue-700';
    return 'bg-slate-100 text-slate-600';
  };

  const readOnlyField = (label: string, value: string) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 whitespace-nowrap w-36">{label}</span>
      <input type="text" value={value} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
    </div>
  );

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
            <div><h1 className="text-lg font-semibold text-slate-800">主管部门确认免考申请</h1><p className="text-sm text-slate-500 mt-0.5">{app.appNo}</p></div>
            <button onClick={() => navigate(`/project-contract/exam-exemption/exemption-list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回</button>
          </div>

          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
          </div>

          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-emerald-500" /><span className="text-sm font-semibold text-slate-800">基础信息</span></div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                {readOnlyField('合同超期申请单号', app.appNo)}
                {readOnlyField('立项号', app.approvalNo)}
                {readOnlyField('合同编号', app.contractNo)}
                {readOnlyField('合同名称', app.contractName)}
                {readOnlyField('合同金额(元)', formatCurrency(app.contractAmount))}
                {/* 合同约定考核金额 - 可编辑 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同约定考核金额(元)</span>
                  <input type="number" value={agreedPenaltyAmount || ''} onChange={(e) => setAgreedPenaltyAmount(Number(e.target.value))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" step="1" />
                </div>
                {readOnlyField('计划开工时间', app.planStartDate)}
                {readOnlyField('计划竣工时间', app.planEndDate)}
                {/* 实际开工时间 - 可编辑 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">实际开工时间</span>
                  <input type="date" value={actualStartDate} onChange={(e) => setActualStartDate(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                {/* 实际竣工时间 - 可编辑 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">实际竣工时间</span>
                  <input type="date" value={actualEndDate} onChange={(e) => setActualEndDate(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                {/* 合同免除考核天数 - 可编辑 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同免除考核天数</span>
                  <input type="number" value={exemptionDays || ''} onChange={(e) => setExemptionDays(Number(e.target.value))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                {/* 免除考核金额 - 可编辑 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">免除考核金额</span>
                  <input type="number" value={exemptionAmount || ''} onChange={(e) => setExemptionAmount(Number(e.target.value))} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" step="1" />
                </div>
                {/* 最终考核金额 - 只读自动计算 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">最终考核金额</span>
                  <input type="text" value={formatCurrency(finalPenaltyAmount)} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                {readOnlyField('合同文本', app.contractText || '--')}
                {/* 合同超期原因 - 可编辑 */}
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">合同超期原因</span>
                  <textarea value={overdueReason} onChange={(e) => setOverdueReason(e.target.value)} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" maxLength={250} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">免考核类型</span>
                  <select value={exemptionType} onChange={(e) => setExemptionType(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option>{exemptionTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
                {readOnlyField('申报人', app.currentOperator)}
                {readOnlyField('申报日期', app.applyDate)}
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">申报人上传其他附件</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {app.attachments.map((f, fi) => (<span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">确认/退回原因</span>
              <textarea value={confirmReason} onChange={(e) => setConfirmReason(e.target.value)} rows={4} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="退回时必填" maxLength={500} />
            </div>
          </div>

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

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={handleConfirm} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>确认</button>
            <button onClick={handleReject} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}><div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>退回</button>
            <button onClick={() => setShowFlowConfig(true)} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}><div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核</button>
            <button onClick={() => setShowApprovalResult(true)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看审批流详情</button>
            <button onClick={() => navigate(`/project-contract/exam-exemption/exemption-list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
          </div>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
      {showFlowConfig && <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={handleFlowSubmit} defaultTitle={`免考申请审批-${contract.contractNo}`} />}
      {showApprovalResult && (
        <ApprovalResultModal onClose={() => setShowApprovalResult(false)} title="审批流详情" processName={`免考申请审批 - ${app.appNo}`} status="进行中"
          nodes={[{ id: 'n1', seq: 1, name: '项目部审核', approver: '张涛', status: '已通过', action: '审核通过', operateTime: '2024-08-28', opinion: '原因属实，材料齐全。' }, { id: 'n2', seq: 2, name: '制造部审核', approver: '施海峰', status: '审核中', action: '', operateTime: '', opinion: '' }]}
          logs={[{ time: '2024-08-20 09:00:00', operator: '黄工', action: '提交申请', opinion: '申请免除考核55天。' }, { time: '2024-08-28 14:00:00', operator: '张涛', action: '审核通过', opinion: '原因属实，材料齐全。' }]}
        />
      )}
    </Layout>
  );
}