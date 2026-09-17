import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getPayContractById, getPayDeclarationsByContractId, getPayDeclarationById, formatCurrency } from '@/mocks/paymentDeclarationMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';
import { getPayApprovalRecords } from '@/mocks/paymentDeclarationMocks';

export default function PaymentDeclarationAppListPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';

  const contract = getPayContractById(contractId);
  const allApps = getPayDeclarationsByContractId(contractId);

  const [activeTab, setActiveTab] = useState<'project' | 'supervisory' | 'finance'>('project');
  const [showFlowConfig, setShowFlowConfig] = useState(false);
  const [flowTargetId, setFlowTargetId] = useState('');
  const [toast, setToast] = useState('');
  const [showApprovalResult, setShowApprovalResult] = useState(false);
  const [resultTargetId, setResultTargetId] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const projectApps = useMemo(() => allApps.filter((a) => a.stage === 'project'), [allApps]);
  const supervisoryApps = useMemo(() => allApps.filter((a) => a.stage === 'supervisory'), [allApps]);
  const financeApps = useMemo(() => allApps.filter((a) => a.stage === 'finance'), [allApps]);
  const currentApps = activeTab === 'project' ? projectApps : activeTab === 'supervisory' ? supervisoryApps : financeApps;

  const handleFlowSubmit = () => { setShowFlowConfig(false); showToast('审批已发起'); };

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

  const colAppNoW = 170;
  const colContentW = 230;
  const leftStickySecond = colAppNoW;

  if (!contract) return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div></Layout>;

  const colActionsW = activeTab === 'project' ? 360 : activeTab === 'supervisory' ? 420 : 260;

  return (
    <Layout>
      <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同金额</span><span className="text-sm font-medium text-slate-800">{formatCurrency(contract.adjustedAmount)}</span></div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">工程款申报清单</h1>
          <button onClick={() => navigate('/project-contract/payment-declaration')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        {/* TABs */}
        <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-full p-1 w-fit">
          <button onClick={() => setActiveTab('project')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'project' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>项目部呈核({projectApps.length})</button>
          <button onClick={() => setActiveTab('supervisory')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'supervisory' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>主管部门呈核({supervisoryApps.length})</button>
          <button onClick={() => setActiveTab('finance')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'finance' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>财务部呈核({financeApps.length})</button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 380px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colAppNoW}px` }}>工程款申请编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colContentW}px` }}>工程量内容</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '140px' }}>本次核减后金额(元)</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>付款类型</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '140px' }}>合同金额(元)</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>申报日期</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>下一审核人</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>状态</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentApps.map((app) => (
                <tr key={`${app.stage}-${app.id}`} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{app.appNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', maxWidth: `${colContentW}px` }} title={app.workContent}>{app.workContent}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(app.reductionAmount > 0 ? app.thisDeclareAmount : app.thisDeclareAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.payType === '预付款' ? 'bg-sky-50 text-sky-700' : app.payType === '进度款' ? 'bg-emerald-50 text-emerald-700' : app.payType === '结算款' ? 'bg-amber-50 text-amber-700' : 'bg-violet-50 text-violet-700'}`}>{app.payType}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(app.contractAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.declareDate}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.nextReviewer}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(app.status)}`}>{app.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      {activeTab === 'project' && (
                        <>
                          <button onClick={() => { setFlowTargetId(app.id); setShowFlowConfig(true); }} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
                          <button onClick={() => navigate(`/project-contract/payment-declaration/project-review?declarationId=${app.id}`)} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>审核</button>
                          <button onClick={() => { setResultTargetId(app.id); setShowApprovalResult(true); }} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">审批详情</button>
                          <button onClick={() => navigate(`/project-contract/payment-declaration/detail?declarationId=${app.id}`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看详情</button>
                        </>
                      )}
                      {activeTab === 'supervisory' && (
                        <>
                          <button onClick={() => { setFlowTargetId(app.id); setShowFlowConfig(true); }} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
                          <button onClick={() => navigate(`/project-contract/payment-declaration/supervisory-review?declarationId=${app.id}`)} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>审核</button>
                          <button onClick={() => { setResultTargetId(app.id); setShowApprovalResult(true); }} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">审批详情</button>
                          <button onClick={() => navigate(`/project-contract/payment-declaration/detail?declarationId=${app.id}`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看详情</button>
                        </>
                      )}
                      {activeTab === 'finance' && (
                        <>
                          <button onClick={() => navigate(`/project-contract/payment-declaration/finance-review?declarationId=${app.id}`)} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>审核</button>
                          <button onClick={() => navigate(`/project-contract/payment-declaration/detail?declarationId=${app.id}`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看详情</button>
                          <button onClick={() => showToast('列印功能：正在生成PDF...')} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">列印</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {currentApps.length > 0 && <div className="mt-3 text-sm text-slate-500">共 {currentApps.length} 条记录</div>}
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {showFlowConfig && <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={handleFlowSubmit} defaultTitle={`工程款申报审批-${contract.contractNo}`} />}

      {showApprovalResult && (() => {
        const target = getPayDeclarationById(resultTargetId);
        if (!target) return null;
        const records = getPayApprovalRecords(resultTargetId);
        return (
          <ApprovalResultModal
            onClose={() => setShowApprovalResult(false)}
            title="审批流详情"
            processName={`工程款申报审批 - ${target.appNo}`}
            status={target.status === '已通过' ? '已完成' : '进行中'}
            nodes={[
              { id: 'n1', seq: 1, name: '项目部审核', approver: '李志强', status: target.stage === 'project' ? '审核中' : (target.projectReviewOpinion ? '已通过' : '待处理'), action: target.projectReviewOpinion ? '通过' : '', operateTime: target.projectReviewOpinion ? target.modifyTime.split(' ')[0] : '', opinion: target.projectReviewOpinion || '' },
              { id: 'n2', seq: 2, name: '主管部门审核', approver: '钱永刚', status: target.stage === 'supervisory' ? '审核中' : (target.supervisoryReviewOpinion ? '已通过' : '待处理'), action: target.supervisoryReviewOpinion ? '通过' : '', operateTime: target.supervisoryReviewOpinion ? target.modifyTime.split(' ')[0] : '', opinion: target.supervisoryReviewOpinion || '' },
              { id: 'n3', seq: 3, name: '财务部审核', approver: '孙丽华', status: target.stage === 'finance' ? '审核中' : '待处理', action: '', operateTime: '', opinion: '' },
            ]}
            logs={records.map((r) => ({ time: `${r.operateDate} ${r.operateTime}`, operator: r.operator, action: r.operation, opinion: r.opinion }))}
          />
        );
      })()}
    </Layout>
  );
}