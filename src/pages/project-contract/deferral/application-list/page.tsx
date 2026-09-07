import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getContractById, getApplicationsByContractId, formatCurrency } from '@/mocks/contractOverdueMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';

export default function OverdueApplicationListPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';

  const contract = getContractById(contractId);
  const allApplications = getApplicationsByContractId(contractId);

  const [activeTab, setActiveTab] = useState<'project' | 'department'>('project');
  const [showFlowConfig, setShowFlowConfig] = useState(false);
  const [flowTargetId, setFlowTargetId] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const projectApps = useMemo(() => allApplications.filter((a) => a.stage === 'project'), [allApplications]);
  const deptApps = useMemo(() => allApplications.filter((a) => a.stage === 'department'), [allApplications]);
  const currentApps = activeTab === 'project' ? projectApps : deptApps;

  const handleFlowSubmit = () => {
    setShowFlowConfig(false);
    showToast('审批流程已提交');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) { showToast('请输入退回原因'); return; }
    setShowRejectModal(false);
    setRejectReason('');
    showToast('已退回');
  };

  const handleConfirm = (id: string) => {
    showToast('确认通过，数据已推送至主管部门审核流程');
  };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      '项目组审核中': 'bg-amber-50 text-amber-700',
      '主管部门审核中': 'bg-blue-50 text-blue-700',
      '已通过': 'bg-emerald-50 text-emerald-700',
      '项目组退回': 'bg-red-50 text-red-700',
      '主管部门退回': 'bg-red-50 text-red-700',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  if (!contract) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div>
      </Layout>
    );
  }

  const colAppNoW = 170;
  const colContractNoW = 150;
  const leftStickySecond = colAppNoW;
  const colActionsW = activeTab === 'project' ? 420 : 420;

  return (
    <Layout>
      {/* Contract Info Bar */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同金额</span><span className="text-sm font-medium text-slate-800">{formatCurrency(contract.contractAmount)}</span></div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">合同超期申请清单</h1>
          <button onClick={() => navigate('/project-contract/deferral')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-full p-1 w-fit">
          <button onClick={() => setActiveTab('project')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'project' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            项目组审核
          </button>
          <button onClick={() => setActiveTab('department')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'department' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            主管部门审核
          </button>
        </div>

        {/* Add button for project tab */}
        {activeTab === 'project' && (
          <div className="mb-3">
            <button onClick={() => navigate(`/project-contract/deferral/project-form?contractId=${contractId}&mode=add`)} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增超期申请
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 380px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colAppNoW}px` }}>合同延期申请单号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colContractNoW}px` }}>合同号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '220px' }}>合同名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>合同类型</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>合同金额(元)</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>合同计划开始时间</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>合同计划结束时间</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>施工单位编码</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '170px' }}>施工单位名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>施工单位责任人</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>合同延期竣工日期</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '240px' }}>申请执行延期理由</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>业主单位</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>所属事业部</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>下一审核人</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>状态</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentApps.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{app.appNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{app.contractNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: '220px' }} title={app.contractName}>{app.contractName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.contractType}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(app.contractAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.planStartDate}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.planEndDate}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.builderCode}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.builderName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.builderPerson}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.delayCompletionDate}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: '240px' }} title={app.delayReason}>{app.delayReason}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.ownerUnit}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.businessUnit}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.nextReviewer}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(app.status)}`}>{app.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      {/* 确认 — both tabs */}
                      <button onClick={() => handleConfirm(app.id)} className="px-2.5 py-1 text-xs rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>
                        <div className="w-3 h-3 flex items-center justify-center"><i className="ri-check-line" /></div>确认
                      </button>
                      {/* 呈核 — both tabs */}
                      <button onClick={() => { setFlowTargetId(app.id); setShowFlowConfig(true); }} className="px-2.5 py-1 text-xs rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' }}>
                        <div className="w-3 h-3 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
                      </button>
                      {/* 退回 — both tabs */}
                      <button onClick={() => { setRejectTargetId(app.id); setShowRejectModal(true); }} className="px-2.5 py-1 text-xs text-red-600 border border-red-300 rounded-md hover:bg-red-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                        <div className="w-3 h-3 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>退回
                      </button>
                      {/* 详情 — both tabs */}
                      <button onClick={() => navigate(`/project-contract/deferral/detail?contractId=${contractId}&appId=${app.id}`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                        <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-list-3-line" /></div>详情
                      </button>
                      {/* 查看审批详情 — both tabs */}
                      <button onClick={() => navigate(`/project-contract/deferral/detail?contractId=${contractId}&appId=${app.id}&tab=approval`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                        <div className="w-3 h-3 flex items-center justify-center"><i className="ri-auction-line" /></div>查看审批详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentApps.length === 0 && (
                <tr>
                  <td colSpan={17} className="px-3 py-10 text-center text-sm text-slate-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        {currentApps.length > 0 && (
          <div className="mt-3 text-sm text-slate-500">共 {currentApps.length} 条记录</div>
        )}
      </div>

      {/* Toast */}
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {/* Flow Config Modal */}
      {showFlowConfig && (
        <ApprovalFlowConfigModal
          onClose={() => setShowFlowConfig(false)}
          onConfirm={handleFlowSubmit}
          defaultTitle={`超期申请审批-${contract.contractNo || ''}`}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-[480px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">退回原因</h3>
              <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="mb-4">
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="请输入退回原因..." maxLength={500} />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleReject} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>确认退回</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}