import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getBidReviewProjectDemands,
  getRequirementProjectById,
  BidReviewDemand,
  formatCurrency,
  handlers,
} from '@/mocks/engineeringRequirementMocks';
import ApprovalResultModal from '@/pages/project-contract/requirement/components/ApprovalResultModal';

export default function BidReviewDemandListPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const projectId = urlParams.get('projectId') || '';
  const project = getRequirementProjectById(projectId);
  const demands = getBidReviewProjectDemands(projectId);

  const [showApprovalResult, setShowApprovalResult] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<BidReviewDemand | null>(null);
  const [showChangeHandler, setShowChangeHandler] = useState(false);
  const [changeHandlerDemand, setChangeHandlerDemand] = useState<BidReviewDemand | null>(null);
  const [newHandler, setNewHandler] = useState('');
  const [showReturn, setShowReturn] = useState(false);
  const [returnDemand, setReturnDemand] = useState<BidReviewDemand | null>(null);
  const [returnOpinion, setReturnOpinion] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const statusBg: Record<string, string> = {
    '待审核': 'bg-slate-100 text-slate-600',
    '审核中': 'bg-amber-50 text-amber-700',
    '已通过': 'bg-emerald-50 text-emerald-700',
    '已退回': 'bg-red-50 text-red-700',
  };

  const handleViewResult = useCallback((demand: BidReviewDemand) => {
    setSelectedDemand(demand);
    setShowApprovalResult(true);
  }, []);

  const handleChangeHandler = (demand: BidReviewDemand) => {
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

  const handleReturn = (demand: BidReviewDemand) => {
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

  const handleSubmit = (demand: BidReviewDemand) => {
    navigate(`/project-contract/bid-review/form?demandId=${demand.id}&projectId=${projectId}`);
  };

  const handleNameClick = (demand: BidReviewDemand) => {
    navigate(`/project-contract/bid-review/detail?id=${demand.id}&projectId=${projectId}`);
  };

  const canReturn = (s: string) => s === '待审核' || s === '审核中';
  const canSubmit = (s: string) => s === '待审核' || s === '审核中';
  const hasApproval = (s: string) => s !== '待审核';

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
              onClick={() => navigate('/project-contract/bid-review')}
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
          <span className="text-sm text-slate-500">合同商务标书审核视角</span>
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
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBg[d.bidReviewStatus] || 'bg-slate-100 text-slate-600'}`}>
                      {d.bidReviewStatus}
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
                      {canReturn(d.bidReviewStatus) ? (
                        <button onClick={() => handleReturn(d)} className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap">
                          退回
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">退回</span>
                      )}
                      {canSubmit(d.bidReviewStatus) ? (
                        <button onClick={() => handleSubmit(d)} className="px-2 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                          呈核
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-slate-300 border border-slate-100 rounded bg-slate-50 whitespace-nowrap">呈核</span>
                      )}
                      {hasApproval(d.bidReviewStatus) ? (
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