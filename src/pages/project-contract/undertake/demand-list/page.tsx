import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getUndertakeProjectDemands,
  getRequirementProjectById,
  UndertakeDemand,
  formatCurrency,
  handlers,
} from '@/mocks/engineeringRequirementMocks';
import ApprovalResultModal from '@/pages/project-contract/requirement/components/ApprovalResultModal';

export default function UndertakeDemandListPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const projectId = urlParams.get('projectId') || '';
  const project = getRequirementProjectById(projectId);
  const demands = getUndertakeProjectDemands(projectId);

  const [showApprovalResult, setShowApprovalResult] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<UndertakeDemand | null>(null);
  const [showChangeHandler, setShowChangeHandler] = useState(false);
  const [changeHandlerDemand, setChangeHandlerDemand] = useState<UndertakeDemand | null>(null);
  const [newHandler, setNewHandler] = useState('');
  const [showReturn, setShowReturn] = useState(false);
  const [returnDemand, setReturnDemand] = useState<UndertakeDemand | null>(null);
  const [returnOpinion, setReturnOpinion] = useState('');
  const [showConfirmPush, setShowConfirmPush] = useState(false);
  const [confirmPushDemand, setConfirmPushDemand] = useState<UndertakeDemand | null>(null);
  const [showRevoke, setShowRevoke] = useState(false);
  const [revokeDemand, setRevokeDemand] = useState<UndertakeDemand | null>(null);
  const [showRestart, setShowRestart] = useState(false);
  const [restartDemand, setRestartDemand] = useState<UndertakeDemand | null>(null);
  const [showBid, setShowBid] = useState(false);
  const [bidDemand, setBidDemand] = useState<UndertakeDemand | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const statusBg: Record<string, string> = {
    '已提交承办': 'bg-slate-100 text-slate-600',
    '承办中': 'bg-blue-50 text-blue-700',
    '已退回': 'bg-red-50 text-red-700',
    '已呈核审批': 'bg-amber-50 text-amber-700',
    '商务标书审批中': 'bg-violet-50 text-violet-700',
    '商务标书已通过': 'bg-emerald-50 text-emerald-700',
    '已推送招采': 'bg-cyan-50 text-cyan-700',
    '已撤回招采': 'bg-gray-50 text-gray-600',
    '已重新发起': 'bg-teal-50 text-teal-700',
  };

  const handleViewResult = useCallback((demand: UndertakeDemand) => {
    setSelectedDemand(demand);
    setShowApprovalResult(true);
  }, []);

  const handleChangeHandler = (demand: UndertakeDemand) => {
    setChangeHandlerDemand(demand);
    setNewHandler(demand.currentHandler);
    setShowChangeHandler(true);
  };

  const handleSaveHandler = () => {
    if (!newHandler) {
      showToast('请选择经办人');
      return;
    }
    setShowChangeHandler(false);
    showToast('经办人修改成功');
  };

  const handleReturn = (demand: UndertakeDemand) => {
    setReturnDemand(demand);
    setReturnOpinion('');
    setShowReturn(true);
  };

  const handleReturnConfirm = () => {
    if (!returnOpinion.trim()) {
      showToast('请填写退回意见');
      return;
    }
    setShowReturn(false);
    showToast('退回发起人成功');
  };

  const handleSubmit = (demand: UndertakeDemand) => {
    navigate(`/project-contract/undertake/form?demandId=${demand.id}&projectId=${projectId}`);
  };

  const handleReturnBid = (demand: UndertakeDemand) => {
    setReturnDemand(demand);
    setReturnOpinion('');
    setShowReturn(true);
  };

  const handleConfirmPush = (demand: UndertakeDemand) => {
    setConfirmPushDemand(demand);
    setShowConfirmPush(true);
  };

  const handleConfirmPushConfirm = () => {
    setShowConfirmPush(false);
    showToast('已推送至招采系统');
  };

  const handleRevoke = (demand: UndertakeDemand) => {
    setRevokeDemand(demand);
    setShowRevoke(true);
  };

  const handleRevokeConfirm = () => {
    setShowRevoke(false);
    showToast('招采流程已撤回');
  };

  const handleRestart = (demand: UndertakeDemand) => {
    setRestartDemand(demand);
    setShowRestart(true);
  };

  const handleRestartConfirm = () => {
    setShowRestart(false);
    showToast('重新发起委托成功');
  };

  const handleBusinessBid = (demand: UndertakeDemand) => {
    setBidDemand(demand);
    setShowBid(true);
  };

  const handleBidConfirm = () => {
    setShowBid(false);
    showToast('商务标书呈核已发起');
  };

  const handleNameClick = (demand: UndertakeDemand) => {
    navigate(`/project-contract/undertake/detail?id=${demand.id}&projectId=${projectId}`);
  };

  // 操作按钮状态控制
  const canReturn = (s: string) => s === '已提交承办' || s === '承办中' || s === '已退回';
  const canSubmit = (s: string) => s === '已提交承办' || s === '承办中' || s === '已退回';
  const canReturnBid = (s: string) => s === '商务标书已通过' || s === '已推送招采';
  const canConfirm = (s: string) => s === '已呈核审批' || s === '商务标书已通过';
  const canRevoke = (s: string) => s === '已推送招采';
  const canRestart = (s: string) => s === '已撤回招采';
  const canBusinessBid = (s: string) => s === '承办中' || s === '已退回';
  const hasApproval = (s: string) => s !== '已提交承办' && s !== '承办中' && s !== '已退回';

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
              onClick={() => navigate('/project-contract/undertake')}
              className="ml-auto px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
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
          <span className="text-sm text-slate-500">主管单位承办视角</span>
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
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">是否填写商务标书</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">当前经办人</th>
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
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{d.demandType}{d.demandTypeLevel2 ? ` / ${d.demandTypeLevel2}` : ''}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{d.purchaseMethod}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">--</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{formatCurrency(d.demandAmount)}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{d.department}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{d.demandDept}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.hasBusinessBid ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {d.hasBusinessBid ? '是' : '否'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBg[d.undertakeStatus] || 'bg-slate-100 text-slate-600'}`}>
                      {d.undertakeStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">
                    <button
                      onClick={() => handleChangeHandler(d)}
                      className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {d.currentHandler}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <div className="flex items-center gap-1 flex-wrap">
                      {/* 退回发起人 */}
                      {canReturn(d.undertakeStatus) ? (
                        <button onClick={() => handleReturn(d)} className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap">
                          退回发起人
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">退回发起人</span>
                      )}
                      {/* 呈核 */}
                      {canSubmit(d.undertakeStatus) ? (
                        <button onClick={() => handleSubmit(d)} className="px-2 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                          呈核
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">呈核</span>
                      )}
                      {/* 退回商务标书 */}
                      {canReturnBid(d.undertakeStatus) ? (
                        <button onClick={() => handleReturnBid(d)} className="px-2 py-1 text-xs text-orange-600 border border-orange-200 rounded hover:bg-orange-50 cursor-pointer whitespace-nowrap">
                          退回商务标书
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">退回商务标书</span>
                      )}
                      {/* 确认 */}
                      {canConfirm(d.undertakeStatus) ? (
                        <button onClick={() => handleConfirmPush(d)} className="px-2 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                          确认
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">确认</span>
                      )}
                      {/* 撤回 */}
                      {canRevoke(d.undertakeStatus) ? (
                        <button onClick={() => handleRevoke(d)} className="px-2 py-1 text-xs text-amber-600 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer whitespace-nowrap">
                          撤回
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">撤回</span>
                      )}
                      {/* 重新发起委托 */}
                      {canRestart(d.undertakeStatus) ? (
                        <button onClick={() => handleRestart(d)} className="px-2 py-1 text-xs text-cyan-600 border border-cyan-200 rounded hover:bg-cyan-50 cursor-pointer whitespace-nowrap">
                          重新发起委托
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">重新发起委托</span>
                      )}
                      {/* 发起商务标书呈核 */}
                      {canBusinessBid(d.undertakeStatus) ? (
                        <button onClick={() => handleBusinessBid(d)} className="px-2 py-1 text-xs text-violet-600 border border-violet-200 rounded hover:bg-violet-50 cursor-pointer whitespace-nowrap">
                          发起商务标书呈核
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">发起商务标书呈核</span>
                      )}
                      {/* 查看审批结果 */}
                      {hasApproval(d.undertakeStatus) ? (
                        <button onClick={() => handleViewResult(d)} className="px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                          查看审批结果
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">查看审批结果</span>
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

      {/* Change Handler Modal */}
      {showChangeHandler && changeHandlerDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-5 w-96">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-800">修改当前经办人</h3>
              <button onClick={() => setShowChangeHandler(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="mb-4">
              <span className="text-sm text-slate-500 block mb-2">当前经办人：{changeHandlerDemand.currentHandler}</span>
              <span className="text-sm text-slate-600 block mb-2">新经办人</span>
              <select
                value={newHandler}
                onChange={(e) => setNewHandler(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">请选择</option>
                {handlers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowChangeHandler(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleSaveHandler} className="px-4 py-1.5 text-sm text-white bg-emerald-500 rounded-md hover:bg-emerald-600 cursor-pointer">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturn && returnDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-5 w-[480px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-800">退回确认</h3>
              <button onClick={() => setShowReturn(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-3">退回工程需求「{returnDemand.demandName}」</p>
            <div className="mb-4">
              <span className="text-sm text-slate-600 block mb-2"><span className="text-red-500">*</span> 退回意见</span>
              <textarea
                value={returnOpinion}
                onChange={(e) => setReturnOpinion(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="请填写退回意见"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowReturn(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleReturnConfirm} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 cursor-pointer">确认退回</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Push Modal */}
      {showConfirmPush && confirmPushDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-5 w-96">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <i className="ri-question-line" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">确认推送</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">确定将工程需求「{confirmPushDemand.demandName}」推送至招采系统，发起招采需求委托执行吗？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirmPush(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleConfirmPushConfirm} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确认推送</button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Modal */}
      {showRevoke && revokeDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-5 w-96">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <i className="ri-question-line" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">确认撤回</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">确定要撤回工程需求「{revokeDemand.demandName}」的招采流程吗？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRevoke(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleRevokeConfirm} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>确认撤回</button>
            </div>
          </div>
        </div>
      )}

      {/* Restart Modal */}
      {showRestart && restartDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-5 w-96">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-50 text-cyan-500">
                <i className="ri-question-line" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">重新发起委托</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">确定重新向招采系统推送工程需求「{restartDemand.demandName}」的数据，发起新的招采需求委托吗？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRestart(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleRestartConfirm} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>确认重新发起</button>
            </div>
          </div>
        </div>
      )}

      {/* Business Bid Modal */}
      {showBid && bidDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-5 w-96">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-50 text-violet-500">
                <i className="ri-question-line" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">发起商务标书呈核</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">确定发起工程需求「{bidDemand.demandName}」的商务标书呈核吗？系统将校验是否已填写商务标书。</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowBid(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleBidConfirm} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>确认发起</button>
            </div>
          </div>
        </div>
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