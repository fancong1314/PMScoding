import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getProjectById, getDemandsByProjectId, formatCurrency, demandTypes, procurementMethods, demandDepts } from '@/mocks/changePricingMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';

export default function ChangePricingDemandListPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const projectId = urlParams.get('projectId') || '';

  const project = getProjectById(projectId);
  const allDemands = getDemandsByProjectId(projectId);

  const [activeTab, setActiveTab] = useState<'declare' | 'undertake'>('declare');
  const [showFlowConfig, setShowFlowConfig] = useState(false);
  const [showApprovalResult, setShowApprovalResult] = useState(false);
  const [selectedDemandId, setSelectedDemandId] = useState('');
  const [toast, setToast] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      '新建': 'bg-blue-50 text-blue-700',
      '审批中': 'bg-amber-50 text-amber-700',
      '已通过': 'bg-emerald-50 text-emerald-700',
      '已驳回': 'bg-red-50 text-red-700',
      '已撤回': 'bg-slate-100 text-slate-600',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  const handleFlowSubmit = () => { setShowFlowConfig(false); showToast('审批流程已提交'); };

  const handleDelete = () => { setShowDeleteConfirm(false); showToast('已删除'); };

  const handleRevoke = () => { showToast('已撤销审批'); };

  const handleConfirm = () => { showToast('数据已推送至招采系统'); };

  const handleReturn = () => { showToast('已退回发起人'); };

  const handleWithdraw = () => { showToast('已撤回招采流程'); };

  if (!project) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">项目数据不存在</div>
      </Layout>
    );
  }

  const colDemandNoW = 150;
  const colDemandNameW = 200;
  const leftStickySecond = colDemandNoW;
  const colActionsW = activeTab === 'declare' ? 420 : 420;

  return (
    <Layout>
      {/* Project Info Bar */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">立项号</span><span className="text-sm font-medium text-slate-800">{project.approvalNo}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">项目名称</span><span className="text-sm font-medium text-slate-800">{project.projectName}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">项目经理</span><span className="text-sm font-medium text-slate-800">{project.projectManager}</span></div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">工程需求清单</h1>
          <button onClick={() => navigate('/project-contract/change-pricing')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-full p-1 w-fit">
          <button onClick={() => setActiveTab('declare')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'declare' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            工程需求申报
          </button>
          <button onClick={() => setActiveTab('undertake')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'undertake' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            主管单位承办
          </button>
        </div>

        {/* TAB1: 工程需求申报 - Add button */}
        {activeTab === 'declare' && (
          <div className="mb-3">
            <button onClick={() => navigate(`/project-contract/change-pricing/demand-form?projectId=${projectId}&mode=add`)} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 380px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: '60px' }}>序号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: '60px', zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colDemandNoW}px` }}>工程需求编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: `${colDemandNameW}px` }}>工程需求名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>工程需求类型</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>采购方式</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '160px' }}>拟推荐供应商</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>需求金额</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>所属事业部</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>需求部门</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>状态</th>
                {activeTab === 'undertake' && (
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>当前经办人</th>
                )}
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {allDemands.map((demand, idx) => (
                <tr key={demand.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 text-center whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{idx + 1}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap" style={{ position: 'sticky', left: '60px', zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
                    <span className="text-primary-600 cursor-pointer hover:underline" onClick={() => navigate(`/project-contract/change-pricing/demand-detail?projectId=${projectId}&demandId=${demand.id}`)}>{demand.demandNo}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: `${colDemandNameW}px` }} title={demand.demandName}>{demand.demandName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{demand.demandType}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{demand.procurementMethod}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{demand.recommendedSupplier || '--'}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(demand.demandAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{demand.businessUnit}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{demand.demandDept}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(demand.status)}`}>{demand.status}</span>
                  </td>
                  {activeTab === 'undertake' && (
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">
                      <span className="text-primary-600 cursor-pointer hover:underline">{demand.currentHandler}</span>
                    </td>
                  )}
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      {activeTab === 'declare' ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/project-contract/change-pricing/demand-form?projectId=${projectId}&demandId=${demand.id}&mode=edit`); }} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">修改</button>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedDemandId(demand.id); setShowFlowConfig(true); }} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedDemandId(demand.id); setShowApprovalResult(true); }} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看审批结果</button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteTargetId(demand.id); setShowDeleteConfirm(true); }} className="px-2.5 py-1 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                          <button onClick={(e) => { e.stopPropagation(); handleRevoke(); }} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">撤销</button>
                        </>
                      ) : (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); handleReturn(); }} className="px-2.5 py-1 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">退回发起人</button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/project-contract/change-pricing/submit?projectId=${projectId}&demandId=${demand.id}`); }} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
                          <button onClick={(e) => { e.stopPropagation(); handleConfirm(); }} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确认</button>
                          <button onClick={(e) => { e.stopPropagation(); handleWithdraw(); }} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">撤回</button>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedDemandId(demand.id); setShowApprovalResult(true); }} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看审批结果</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {allDemands.length === 0 && (
                <tr><td colSpan={activeTab === 'undertake' ? 12 : 11} className="px-3 py-10 text-center text-sm text-slate-400">暂无工程需求数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {allDemands.length > 0 && (
          <div className="mt-3 text-sm text-slate-500">共 {allDemands.length} 条记录</div>
        )}
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {showFlowConfig && (
        <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={handleFlowSubmit} defaultTitle={`工程需求审批-${projectId}`} />
      )}

      {showApprovalResult && (
        <ApprovalResultModal
          onClose={() => setShowApprovalResult(false)}
          title="审批结果"
          processName={`工程需求审批 - ${selectedDemandId}`}
          status="进行中"
          nodes={[
            { id: 'na', seq: 1, name: '部门负责人审批', approver: '王建国', status: '已通过', action: '核准', operateTime: '2024-02-10 09:00:00', opinion: '技术方案可行，同意按此方案推进。' },
            { id: 'nb', seq: 2, name: '分管领导审批', approver: '陈副总', status: '审核中', action: '', operateTime: '', opinion: '' },
            { id: 'nc', seq: 3, name: '事业部审批', approver: '施海峰', status: '待处理', action: '', operateTime: '', opinion: '' },
          ]}
          logs={[
            { time: '2024-02-01 08:30:00', operator: '王工', action: '提交申请', opinion: '自动化控制系统升级至DCS系统申请。' },
            { time: '2024-02-01 10:00:00', operator: '王工', action: '呈核', opinion: '呈核炼铁事业部。' },
            { time: '2024-02-10 09:00:00', operator: '王建国', action: '核准', opinion: '技术方案可行，同意按此方案推进。' },
          ]}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-[420px] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100"><i className="ri-error-warning-line text-red-600" /></div>
              <div><h3 className="text-base font-semibold text-slate-800">确认删除</h3><p className="text-sm text-slate-500">删除后数据不可恢复</p></div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer whitespace-nowrap">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}