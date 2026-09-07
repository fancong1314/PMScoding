import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getPayDeclarationById, getPayApprovalRecords, formatCurrency } from '@/mocks/paymentDeclarationMocks';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';

interface AnchorSection { key: string; label: string; }

const sections: AnchorSection[] = [
  { key: 'info', label: '申报信息' },
  { key: 'records', label: '完整流程记录' },
];

export default function PaymentDeclarationDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const declarationId = urlParams.get('declarationId') || '';

  const declaration = getPayDeclarationById(declarationId);
  const records = getPayApprovalRecords(declarationId);

  const [activeSection, setActiveSection] = useState('info');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [showApprovalResult, setShowApprovalResult] = useState(false);

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

  if (!declaration) {
    return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">申报数据不存在</div></Layout>;
  }

  const infoField = (label: string, value: string) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 whitespace-nowrap w-40">{label}</span>
      <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{value || '--'}</span>
    </div>
  );

  const actionColor = (a: string) => {
    if (a.includes('通过') || a.includes('确认')) return 'bg-emerald-50 text-emerald-700';
    if (a.includes('退回') || a.includes('驳回')) return 'bg-red-50 text-red-700';
    if (a.includes('提交') || a.includes('呈核')) return 'bg-blue-50 text-blue-700';
    return 'bg-slate-100 text-slate-600';
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      '待项目部审核': 'bg-amber-50 text-amber-700',
      '待主管部门审核': 'bg-blue-50 text-blue-700',
      '待财务审核': 'bg-violet-50 text-violet-700',
      '已通过': 'bg-emerald-50 text-emerald-700',
      '已驳回': 'bg-red-50 text-red-700',
    };
    return map[s] || 'bg-slate-100 text-slate-600';
  };

  return (
    <Layout>
      <div className="flex gap-5">
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.key} onClick={() => scrollToSection(s.key)} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeSection === s.key ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>{s.label}</button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">工程款申报详情</h1>
              <p className="text-sm text-slate-500 mt-0.5">{declaration.appNo}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowApprovalResult(true)}
                className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-git-branch-line" /></div>
                查看审批流详情
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
                返回
              </button>
            </div>
          </div>

          {/* Basic Info Banner */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{declaration.contractNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{declaration.contractName}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">状态</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(declaration.status)}`}>{declaration.status}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">付款类型</span><span className="text-sm font-medium text-slate-800">{declaration.payType}</span></div>
          </div>

          {/* Info Section */}
          <div ref={(el) => { sectionRefs.current['info'] = el; }} data-section="info" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">申报信息</span>
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
                {infoField('工程事业部', declaration.projectDept)}
                {infoField('付款类型', declaration.payType)}
                {infoField('申报日期', declaration.declareDate)}
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-40 mt-0.5">工程量内容</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{declaration.workContent}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-40 mt-0.5">申报原因</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{declaration.declareReason}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-3 uppercase">金额明细</div>
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
                    <span className="text-sm text-slate-600 whitespace-nowrap w-40 font-medium">实际支付金额(元)</span>
                    <span className="flex-1 px-3 py-1.5 text-base font-bold text-emerald-700 font-mono">{formatCurrency(declaration.actualPayAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-3 uppercase">审核意见汇总</div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-40">项目部审核意见</span>
                    <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{declaration.projectReviewOpinion || '--'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-40">主管部门审核意见</span>
                    <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{declaration.supervisoryReviewOpinion || '--'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-40">财务部审核意见</span>
                    <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{declaration.financeReviewOpinion || '--'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-3 uppercase">附件与系统信息</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex items-start gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-40 mt-0.5">附件</span>
                    <div className="flex-1 flex flex-wrap gap-2">
                      {declaration.attachmentFiles.map((f, fi) => (
                        <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>
                      ))}
                      {declaration.attachmentFiles.length === 0 && <span className="text-sm text-slate-400">暂无附件</span>}
                    </div>
                  </div>
                  {infoField('创建人', declaration.creator)}
                  {infoField('创建时间', declaration.createTime)}
                  {infoField('修改人', declaration.modifier || '--')}
                  {infoField('修改时间', declaration.modifyTime || '--')}
                </div>
              </div>
            </div>
          </div>

          {/* Records Section */}
          <div ref={(el) => { sectionRefs.current['records'] = el; }} data-section="records" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-purple-500" />
              <span className="text-sm font-semibold text-slate-800">完整流程记录</span>
            </div>
            {records.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">暂无流程记录</div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">序号</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核阶段</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作日期</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((rec, idx) => (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{idx + 1}</td>
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

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => navigate(-1)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              返回
            </button>
          </div>
        </div>
      </div>

      {showApprovalResult && (
        <ApprovalResultModal
          onClose={() => setShowApprovalResult(false)}
          title="审批流详情"
          processName={`工程款申报审批 - ${declaration.appNo}`}
          status={declaration.status === '已通过' ? '已完成' : '进行中'}
          nodes={[
            { id: 'n1', seq: 1, name: '项目部审核', approver: '李志强', status: declaration.stage === 'project' ? '审核中' : (declaration.projectReviewOpinion ? '已通过' : '待处理'), action: declaration.projectReviewOpinion ? '通过' : '', operateTime: declaration.projectReviewOpinion ? declaration.modifyTime.split(' ')[0] : '', opinion: declaration.projectReviewOpinion || '' },
            { id: 'n2', seq: 2, name: '主管部门审核', approver: '钱永刚', status: declaration.stage === 'supervisory' ? '审核中' : (declaration.supervisoryReviewOpinion ? '已通过' : '待处理'), action: declaration.supervisoryReviewOpinion ? '通过' : '', operateTime: declaration.supervisoryReviewOpinion ? declaration.modifyTime.split(' ')[0] : '', opinion: declaration.supervisoryReviewOpinion || '' },
            { id: 'n3', seq: 3, name: '财务部审核', approver: '孙丽华', status: declaration.stage === 'finance' ? '审核中' : '待处理', action: '', operateTime: '', opinion: '' },
          ]}
          logs={records.map((r) => ({ time: `${r.operateDate} ${r.operateTime}`, operator: r.operator, action: r.operation, opinion: r.opinion }))}
        />
      )}
    </Layout>
  );
}