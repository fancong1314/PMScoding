import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getCompletionById, getContractById } from '@/mocks/contractExecutionMocks';
import ApprovalFlowConfigModal from '../components/ApprovalFlowConfigModal';
import ApprovalDetailModal from '../components/ApprovalDetailModal';

export default function CompletionProjectReviewPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const applyId = urlParams.get('applyId') || '';
  const contractId = urlParams.get('contractId') || '';

  const apply = getCompletionById(applyId);
  const contract = getContractById(contractId);

  const [toast, setToast] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [showFlowConfig, setShowFlowConfig] = useState(false);
  const [showApprovalDetail, setShowApprovalDetail] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleReturn = () => {
    if (!returnReason.trim()) { showToast('请输入退回原因'); return; }
    setShowReturnModal(false);
    showToast('已退回至申报人');
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-slate-800">项目部审核</h1>
          <button onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        {/* Basic Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-800">基础信息</span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">工程名称</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.projectName || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">质量评定</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.qualityRating || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">变更是否施工完毕</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.changesCompleted || '--'}</span></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">合同号</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.contractNo || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">是否按图施工完毕</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.builtPerDrawings || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">验收意见</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.acceptanceOpinion || '--'}</span></div>
            </div>
          </div>
        </div>

        {/* Old Material Records */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-slate-800">旧料使用记录</span>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">名称</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">单位</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">数量</th>
                </tr>
              </thead>
              <tbody>
                {(apply?.oldMaterialRecords || []).length > 0 ? (
                  (apply?.oldMaterialRecords || []).map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{m.name}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{m.unit}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{m.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="px-3 py-8 text-center text-sm text-slate-400">暂无旧料使用记录</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Records */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-slate-800">申报流程记录</span>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">阶段</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                </tr>
              </thead>
              <tbody>
                {(apply?.approvalRecords || []).map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.stage}</td>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.action}</td>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operator}</td>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.date} {rec.time}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{rec.opinion || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
          <button onClick={() => setShowReturnModal(true)} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>退回申报人
          </button>
          <button onClick={() => setShowFlowConfig(true)} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
          </button>
          <button onClick={() => setShowApprovalDetail(true)} className="px-6 py-2 text-sm text-violet-700 border border-violet-200 rounded-md hover:bg-violet-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-search-line" /></div>查看审批详情
          </button>
          <button onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>返回
          </button>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl w-[420px]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">退回申报人</h3>
              <button onClick={() => setShowReturnModal(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="p-5">
              <span className="text-sm text-red-600 mb-2 block"><span className="text-red-500">*</span>退回原因</span>
              <textarea value={returnReason} onChange={(e) => setReturnReason(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" placeholder="请输入退回原因" maxLength={500} />
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleReturn} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>确认退回</button>
            </div>
          </div>
        </div>
      )}

      {showFlowConfig && (
        <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={() => { setShowFlowConfig(false); showToast('项目部审批流程已提交'); }} defaultTitle="竣工项目部审批流程" />
      )}

      {showApprovalDetail && (
        <ApprovalDetailModal onClose={() => setShowApprovalDetail(false)} nodes={[
          { name: '申报人', status: 'done' },
          { name: '项目部审核', status: 'active' },
          { name: '制造部审核', status: 'pending' },
        ]} />
      )}

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}