import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getProjectDemands,
  getRequirementProjectById,
  EngineeringDemand,
  formatCurrency,
} from '@/mocks/engineeringRequirementMocks';
import ApprovalFlowModal from '../components/ApprovalFlowModal';
import ApprovalResultModal from '../components/ApprovalResultModal';

export default function DemandListPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const projectId = urlParams.get('projectId') || '';
  const project = getRequirementProjectById(projectId);
  const demands = getProjectDemands(projectId);

  const [showApprovalFlow, setShowApprovalFlow] = useState(false);
  const [showApprovalResult, setShowApprovalResult] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<EngineeringDemand | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<EngineeringDemand | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState<EngineeringDemand | null>(null);
  const [toast, setToast] = useState<string>('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const canModify = (status: string) => status === '新建' || status === '已驳回' || status === '已撤回';
  const canSubmit = (status: string) => status === '新建' || status === '已驳回' || status === '已撤回';
  const canDelete = (status: string) => status === '新建';
  const canRevoke = (status: string) => status === '审批中';
  const hasApprovalRecords = (status: string) => status !== '新建' && status !== '已撤回';

  const handleModify = useCallback(
    (demand: EngineeringDemand) => {
      if (!canModify(demand.status)) {
        showToast('当前状态不允许修改');
        return;
      }
      navigate(`/project-contract/requirement/form?id=${demand.id}&projectId=${projectId}&mode=edit`);
    },
    [navigate, projectId]
  );

  const handleSubmit = useCallback(
    (demand: EngineeringDemand) => {
      if (!canSubmit(demand.status)) {
        showToast('当前状态不允许呈核');
        return;
      }
      setSelectedDemand(demand);
      setShowApprovalFlow(true);
    },
    []
  );

  const handleViewResult = useCallback(
    (demand: EngineeringDemand) => {
      setSelectedDemand(demand);
      setShowApprovalResult(true);
    },
    []
  );

  const handleDelete = useCallback(
    (demand: EngineeringDemand) => {
      if (!canDelete(demand.status)) {
        showToast('当前状态不允许删除');
        return;
      }
      setConfirmDelete(demand);
    },
    []
  );

  const handleRevoke = useCallback(
    (demand: EngineeringDemand) => {
      if (!canRevoke(demand.status)) {
        showToast('当前状态不允许撤销');
        return;
      }
      setConfirmRevoke(demand);
    },
    []
  );

  const handleDeleteConfirm = () => {
    setConfirmDelete(null);
    showToast('删除成功');
  };

  const handleRevokeConfirm = () => {
    setConfirmRevoke(null);
    showToast('撤销成功');
  };

  const handleNameClick = (demand: EngineeringDemand) => {
    navigate(`/project-contract/requirement/detail?id=${demand.id}&projectId=${projectId}`);
  };

  const statusBg: Record<string, string> = {
    '新建': 'bg-slate-100 text-slate-600',
    '审批中': 'bg-amber-50 text-amber-700',
    '已通过': 'bg-emerald-50 text-emerald-700',
    '已驳回': 'bg-red-50 text-red-700',
    '已撤回': 'bg-violet-50 text-violet-700',
    '已撤销': 'bg-gray-50 text-gray-600',
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        {/* Project Info Card */}
        {project && (
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">立项号</span>
              <span className="text-sm font-medium text-slate-800">{project.approvalNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">项目名称</span>
              <span className="text-sm font-medium text-slate-800">{project.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">业主单位</span>
              <span className="text-sm font-medium text-slate-800">{project.ownerUnit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">项目经理</span>
              <span className="text-sm font-medium text-slate-800">{project.projectManager}</span>
            </div>
            <button
              onClick={() => navigate('/project-contract/requirement')}
              className="ml-auto px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-left-line" />
              </div>
              返回列表
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">工程需求清单</h1>
          <button
            onClick={() => navigate(`/project-contract/requirement/form?projectId=${projectId}&mode=add`)}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line" />
            </div>
            新增
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>序号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工程需求编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工程需求名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工程需求类型</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">采购方式</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">拟推荐供应商</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">需求金额</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">所属事业部</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">需求部门</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {demands.map((d, idx) => (
                <tr key={d.id} className="group hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{idx + 1}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{d.demandNo}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">
                    <button
                      onClick={() => handleNameClick(d)}
                      className="text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                    >
                      {d.demandName}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">
                    {d.demandType}{d.demandTypeLevel2 ? ` / ${d.demandTypeLevel2}` : ''}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{d.purchaseMethod}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">--</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{formatCurrency(d.demandAmount)}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{d.department}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{d.demandDept}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBg[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <div className="flex items-center gap-1">
                      {/* 修改：仅新建/已驳回/已撤回可修改 */}
                      {canModify(d.status) ? (
                        <button
                          onClick={() => handleModify(d)}
                          className="px-2 py-1 text-xs text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
                        >
                          修改
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">修改</span>
                      )}
                      {/* 呈核：仅新建/已驳回/已撤回可呈核 */}
                      {canSubmit(d.status) ? (
                        <button
                          onClick={() => handleSubmit(d)}
                          className="px-2 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap"
                          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                        >
                          呈核
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">呈核</span>
                      )}
                      {/* 查看审批：有审批记录时才显示 */}
                      {hasApprovalRecords(d.status) ? (
                        <button
                          onClick={() => handleViewResult(d)}
                          className="px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                        >
                          查看审批
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">查看审批</span>
                      )}
                      {/* 删除：仅新建可删除 */}
                      {canDelete(d.status) ? (
                        <button
                          onClick={() => handleDelete(d)}
                          className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap"
                        >
                          删除
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">删除</span>
                      )}
                      {/* 撤销：仅审批中可撤销 */}
                      {canRevoke(d.status) ? (
                        <button
                          onClick={() => handleRevoke(d)}
                          className="px-2 py-1 text-xs text-amber-600 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer whitespace-nowrap"
                        >
                          撤销
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">撤销</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {demands.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-slate-300">
              <i className="ri-inbox-line text-2xl" />
            </div>
            暂无工程需求数据
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-5 w-96">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500">
                <i className="ri-question-line" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">确认删除</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">确定要删除工程需求「{confirmDelete.demandName}」吗？此操作不可撤销。</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 cursor-pointer">确认删除</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Revoke */}
      {confirmRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-5 w-96">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <i className="ri-question-line" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">确认撤销</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">确定要撤销工程需求「{confirmRevoke.demandName}」的审批吗？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmRevoke(null)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleRevokeConfirm} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>确认撤销</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Flow Modal */}
      {showApprovalFlow && selectedDemand && (
        <ApprovalFlowModal
          demand={selectedDemand}
          onClose={() => setShowApprovalFlow(false)}
          onSubmit={() => {
            setShowApprovalFlow(false);
            showToast('审批流程已提交');
          }}
        />
      )}

      {/* Approval Result Modal */}
      {showApprovalResult && selectedDemand && (
        <ApprovalResultModal
          demand={selectedDemand}
          onClose={() => setShowApprovalResult(false)}
        />
      )}
    </Layout>
  );
}