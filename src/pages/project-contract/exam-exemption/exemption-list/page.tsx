import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getExamContractById, getExamAppsByContractId, formatCurrency } from '@/mocks/examExemptionMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';

export default function ExamExemptionListPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';

  const contract = getExamContractById(contractId);
  const allApps = getExamAppsByContractId(contractId);

  const [activeTab, setActiveTab] = useState<'project' | 'department'>('project');
  const [showFlowConfig, setShowFlowConfig] = useState(false);
  const [flowTargetId, setFlowTargetId] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const projectApps = useMemo(() => allApps.filter((a) => a.stage === 'project'), [allApps]);
  const deptApps = useMemo(() => allApps.filter((a) => a.stage === 'department'), [allApps]);
  const currentApps = activeTab === 'project' ? projectApps : deptApps;

  const handleFlowSubmit = () => { setShowFlowConfig(false); showToast('审批已发起'); };
  const handleReject = () => { if (!rejectReason.trim()) { showToast('请输入退回原因'); return; } setShowRejectModal(false); setRejectReason(''); showToast('已退回'); };
  const handleDelete = () => { setShowDeleteConfirm(false); showToast('已删除'); };

  const statusColor = (s: string) => {
    const map: Record<string, string> = { '项目组新建': 'bg-blue-50 text-blue-700', '项目组退回': 'bg-red-50 text-red-700', '主管部门审核中': 'bg-amber-50 text-amber-700', '已通过': 'bg-emerald-50 text-emerald-700', };
    return map[s] || 'bg-slate-100 text-slate-600';
  };

  if (!contract) return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div></Layout>;

  const colAppNoW = 180;
  const colContractNoW = 150;
  const leftStickySecond = colAppNoW;
  const colActionsW = activeTab === 'project' ? 380 : 380;

  return (
    <Layout>
      <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同金额</span><span className="text-sm font-medium text-slate-800">{formatCurrency(contract.contractAmount)}</span></div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">免考申请清单</h1>
          <button onClick={() => navigate('/project-contract/exam-exemption')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-full p-1 w-fit">
          <button onClick={() => setActiveTab('project')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'project' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>项目部审核</button>
          <button onClick={() => setActiveTab('department')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'department' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>主管部门审核</button>
        </div>

        {activeTab === 'project' && (
          <div className="mb-3 flex items-center gap-2">
            <button onClick={() => navigate(`/project-contract/exam-exemption/project-form?contractId=${contractId}&mode=add`)} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增</button>
          </div>
        )}

        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 380px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colAppNoW}px` }}>合同超期申请单号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colContractNoW}px` }}>合同号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '220px' }}>合同名称</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>合同金额(元)</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>合同计划开始时间</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>合同计划结束时间</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>当前审核人</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentApps.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{app.appNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{app.contractNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: '220px' }} title={app.contractName}>{app.contractName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(app.contractAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.planStartDate}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.planEndDate}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(app.status)}`}>{app.status}</span></td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.currentOperator}</td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      {activeTab === 'project' ? (
                        <>
                          {app.status === '项目组新建' && (
                            <>
                              <button onClick={() => navigate(`/project-contract/exam-exemption/project-form?contractId=${contractId}&appId=${app.id}&mode=edit`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">修改</button>
                              <button onClick={() => { setDeleteTargetId(app.id); setShowDeleteConfirm(true); }} className="px-2.5 py-1 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                            </>
                          )}
                          <button onClick={() => { setRejectTargetId(app.id); setShowRejectModal(true); }} className="px-2.5 py-1 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">退回</button>
                          <button onClick={() => { setFlowTargetId(app.id); setShowFlowConfig(true); }} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => navigate(`/project-contract/exam-exemption/department-confirm?contractId=${contractId}&appId=${app.id}`)} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确认</button>
                          <button onClick={() => { setRejectTargetId(app.id); setShowRejectModal(true); }} className="px-2.5 py-1 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">退回</button>
                          <button onClick={() => { setFlowTargetId(app.id); setShowFlowConfig(true); }} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentApps.length === 0 && (
                <tr><td colSpan={9} className="px-3 py-10 text-center text-sm text-slate-400">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {currentApps.length > 0 && <div className="mt-3 text-sm text-slate-500">共 {currentApps.length} 条记录</div>}
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {showFlowConfig && <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={handleFlowSubmit} defaultTitle={`免考申请审批-${contract.contractNo}`} />}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-[480px] p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-semibold text-slate-800">退回原因</h3><button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line" /></button></div>
            <div className="mb-4"><textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="请输入退回原因..." maxLength={500} /></div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleReject} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>确认退回</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-[420px] p-5">
            <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100"><i className="ri-error-warning-line text-red-600" /></div><div><h3 className="text-base font-semibold text-slate-800">确认删除</h3><p className="text-sm text-slate-500">删除后数据不可恢复</p></div></div>
            <div className="flex items-center justify-end gap-2"><button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button><button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer whitespace-nowrap">确认删除</button></div>
          </div>
        </div>
      )}
    </Layout>
  );
}