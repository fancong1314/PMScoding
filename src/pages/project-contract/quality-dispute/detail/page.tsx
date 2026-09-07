import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getDisputeById, getApprovalRecordsByDisputeId, formatCurrency } from '@/mocks/qualityDisputeMocks';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'info', label: '异议信息' },
  { key: 'records', label: '完整流程记录' },
];

export default function QualityDisputeDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const id = urlParams.get('id') || '';

  const dispute = getDisputeById(id);
  const records = getApprovalRecordsByDisputeId(id);

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
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const key = e.target.getAttribute('data-section');
            if (key) setActiveSection(key);
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

  if (!dispute) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">异议数据不存在</div>
      </Layout>
    );
  }

  const infoField = (label: string, value: string) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 whitespace-nowrap w-40">{label}</span>
      <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{value || '--'}</span>
    </div>
  );

  const actionColor = (a: string) => {
    if (a.includes('通过') || a.includes('确认')) return 'bg-emerald-50 text-emerald-700';
    if (a.includes('驳回')) return 'bg-red-50 text-red-700';
    if (a.includes('提交') || a.includes('呈核')) return 'bg-blue-50 text-blue-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <Layout>
      <div className="flex gap-5">
        {/* Left Anchor */}
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => scrollToSection(s.key)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeSection === s.key ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">质量异议详情</h1>
              <p className="text-sm text-slate-500 mt-0.5">{dispute.disputeNo}</p>
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
                onClick={() => navigate('/project-contract/quality-dispute')}
                className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
                返回
              </button>
            </div>
          </div>

          {/* Basic Info Banner */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">合同编号</span>
              <span className="text-sm font-medium text-slate-800">{dispute.contractNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">合同名称</span>
              <span className="text-sm font-medium text-slate-800">{dispute.contractName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">状态</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${dispute.status === '新建' ? 'bg-blue-50 text-blue-700' : dispute.status === '已通过' ? 'bg-emerald-50 text-emerald-700' : dispute.status === '已驳回' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{dispute.status}</span>
            </div>
          </div>

          {/* Dispute Info Section */}
          <div ref={(el) => { sectionRefs.current['info'] = el; }} data-section="info" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">异议信息</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                {infoField('异议单号', dispute.disputeNo)}
                {infoField('合同号', dispute.contractNo)}
                {infoField('供应商代码', dispute.supplierCode)}
                {infoField('供应商名称', dispute.supplierName)}
                {infoField('采购员', dispute.purchaser)}
                {infoField('采购员联系方式', dispute.purchaserContact)}
                {infoField('申请人', dispute.applicant)}
                {infoField('异议金额(元)', formatCurrency(dispute.disputeAmount))}
                {infoField('异议数量', String(dispute.disputeQuantity))}
                {infoField('是否造成生产中断', dispute.causeProductionStop)}
                {infoField('生产中断时间(小时)', dispute.stopHours > 0 ? `${dispute.stopHours} 小时` : '--')}
                {infoField('发生日期', dispute.occurrenceDate)}
                {infoField('品种类别', dispute.categoryType)}
                {infoField('是否需要供应商整改', dispute.needSupplierRectify)}
                {infoField('供应商整改单号', dispute.supplierRectifyNo)}
                {infoField('是否需要质量判定部门判定', dispute.needQualityJudgment)}
                {infoField('问题分析', dispute.issueAnalysis)}
                {infoField('是否属于质量异议', dispute.isQualityIssue)}
                {infoField('审批意见', dispute.approvalOpinion)}
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-40 mt-0.5">附件</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {dispute.attachments.map((f, fi) => (
                      <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>
                    ))}
                  </div>
                </div>
                {infoField('创建人', dispute.creator)}
                {infoField('创建时间', dispute.createTime)}
                {infoField('修改人', dispute.modifier)}
                {infoField('修改时间', dispute.modifyTime)}
              </div>
            </div>
          </div>

          {/* Approval Records Section */}
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

          {/* Bottom Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => navigate('/project-contract/quality-dispute')}
              className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              返回
            </button>
          </div>
        </div>
      </div>

      {/* Approval Result Modal */}
      {showApprovalResult && (
        <ApprovalResultModal
          onClose={() => setShowApprovalResult(false)}
          title="审批流详情"
          processName={`质量异议审批 - ${dispute.disputeNo}`}
          status={dispute.status === '已通过' || dispute.status === '已驳回' ? '已完成' : '进行中'}
          nodes={[
            { id: 'n1', seq: 1, name: '质量异议维护', approver: dispute.creator, status: '已通过', action: '提交', operateTime: dispute.createTime.split(' ')[0], opinion: '提交质量异议申请' },
            { id: 'n2', seq: 2, name: '项目部审批', approver: dispute.projectReviewer, status: dispute.projectReviewStatus === '已通过' ? '已通过' : dispute.projectReviewStatus === '已驳回' ? '已驳回' : '审核中', action: dispute.projectReviewStatus === '已通过' ? '通过' : dispute.projectReviewStatus === '已驳回' ? '驳回' : '', operateTime: dispute.projectReviewStatus === '已通过' ? dispute.modifyTime.split(' ')[0] : '', opinion: dispute.issueAnalysis || '' },
            { id: 'n3', seq: 3, name: '制造部审批', approver: dispute.manufacturingReviewer, status: dispute.manufacturingReviewStatus === '已通过' ? '已通过' : dispute.manufacturingReviewStatus === '已驳回' ? '已驳回' : '审核中', action: dispute.manufacturingReviewStatus === '已通过' ? '通过' : dispute.manufacturingReviewStatus === '已驳回' ? '驳回' : '', operateTime: dispute.manufacturingReviewStatus === '已通过' ? dispute.modifyTime.split(' ')[0] : '', opinion: dispute.approvalOpinion || '' },
          ]}
          logs={records.map((r) => ({ time: `${r.operateDate} ${r.operateTime}`, operator: r.operator, action: r.operation, opinion: r.opinion }))}
        />
      )}
    </Layout>
  );
}