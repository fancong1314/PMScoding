import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getExamContractById, getExamAppById, getExamApprovalRecordsByAppId, formatCurrency } from '@/mocks/examExemptionMocks';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';

interface AnchorSection { key: string; label: string; }
const sections: AnchorSection[] = [
  { key: 'basic', label: '申请信息' },
  { key: 'records', label: '完整流程记录' },
];

export default function ExamExemptionDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const appId = urlParams.get('appId') || '';

  const contract = getExamContractById(contractId);
  const app = getExamAppById(appId);
  const records = appId ? getExamApprovalRecordsByAppId(appId) : [];

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [showApprovalResult, setShowApprovalResult] = useState(false);

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

  const actionColor = (a: string) => {
    if (a.includes('通过') || a.includes('确认')) return 'bg-emerald-50 text-emerald-700';
    if (a.includes('退回')) return 'bg-red-50 text-red-700';
    if (a.includes('提交') || a.includes('呈核')) return 'bg-blue-50 text-blue-700';
    return 'bg-slate-100 text-slate-600';
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = { '项目组新建': 'bg-blue-50 text-blue-700', '项目组退回': 'bg-red-50 text-red-700', '主管部门审核中': 'bg-amber-50 text-amber-700', '已通过': 'bg-emerald-50 text-emerald-700' };
    return map[s] || 'bg-slate-100 text-slate-600';
  };

  const infoField = (label: string, value: string) => (
    <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-36">{label}</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{value}</span></div>
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
            <div><h1 className="text-lg font-semibold text-slate-800">免考申请详情</h1><p className="text-sm text-slate-500 mt-0.5">{app.appNo}</p></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowApprovalResult(true)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-git-branch-line" /></div>查看审批流详情</button>
              <button onClick={() => navigate(`/project-contract/exam-exemption/exemption-list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回</button>
            </div>
          </div>

          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">状态</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(app.status)}`}>{app.status}</span></div>
          </div>

          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-emerald-500" /><span className="text-sm font-semibold text-slate-800">申请信息</span></div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                {infoField('合同超期申请单号', app.appNo)}
                {infoField('立项号', app.approvalNo)}
                {infoField('合同编号', app.contractNo)}
                {infoField('合同名称', app.contractName)}
                {infoField('合同金额(元)', formatCurrency(app.contractAmount))}
                {infoField('合同约定考核金额(元)', formatCurrency(app.agreedPenaltyAmount))}
                {infoField('计划开工时间', app.planStartDate)}
                {infoField('计划竣工时间', app.planEndDate)}
                {infoField('实际开工时间', app.actualStartDate)}
                {infoField('实际竣工时间', app.actualEndDate)}
                {infoField('合同免除考核天数', `${app.exemptionDays} 天`)}
                {infoField('免除考核金额', formatCurrency(app.exemptionAmount))}
                {infoField('最终考核金额', formatCurrency(app.finalPenaltyAmount))}
                {infoField('免考核类型', app.exemptionType)}
                {infoField('合同文本', app.contractText)}
                <div className="col-span-2 flex items-start gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">合同超期原因</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800 whitespace-pre-wrap">{app.overdueReason}</span></div>
                {app.confirmReason && <div className="col-span-2 flex items-start gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">确认/退回原因</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800 whitespace-pre-wrap">{app.confirmReason}</span></div>}
                {infoField('当前操作人', app.currentOperator)}
                {infoField('申报日期', app.applyDate)}
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">申报人上传其他附件</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {app.attachments.map((f, fi) => (<span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={(el) => { sectionRefs.current['records'] = el; }} data-section="records" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-purple-500" /><span className="text-sm font-semibold text-slate-800">完整流程记录</span></div>
            {records.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">暂无流程记录</div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50"><tr style={{ borderBottom: '1px solid #e2e8f0' }}><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">序号</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核阶段</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作日期</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th></tr></thead>
                  <tbody>
                    {records.map((rec, idx) => (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{idx + 1}</td>
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
            <button onClick={() => navigate(`/project-contract/exam-exemption/exemption-list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">返回</button>
          </div>
        </div>
      </div>

      {showApprovalResult && (
        <ApprovalResultModal onClose={() => setShowApprovalResult(false)} title="审批流详情" processName={`免考申请审批 - ${app.appNo}`} status={app.status === '已通过' ? '已完成' : '进行中'}
          nodes={[{ id: 'n1', seq: 1, name: '项目组审核', approver: '张涛', status: '已通过', action: '审核通过', operateTime: '2024-08-28', opinion: '原因属实，材料齐全。' }, { id: 'n2', seq: 2, name: '制造部确认', approver: '施海峰', status: app.status === '已通过' ? '已通过' : '审核中', action: '', operateTime: '', opinion: '' }]}
          logs={records.map((r) => ({ time: `${r.operateDate} ${r.operateTime}`, operator: r.operator, action: r.operation, opinion: r.opinion }))}
        />
      )}
    </Layout>
  );
}