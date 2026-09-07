import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getDisputeById, getSupplierByCode, formatCurrency } from '@/mocks/qualityDisputeMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';

export default function QualityDisputeProjectReviewPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const id = urlParams.get('id') || '';

  const dispute = getDisputeById(id);
  const [needQualityJudgment, setNeedQualityJudgment] = useState(dispute?.needQualityJudgment || '否');
  const [issueAnalysis, setIssueAnalysis] = useState(dispute?.issueAnalysis || '');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const [showFlowConfig, setShowFlowConfig] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleSubmit = () => {
    if (!needQualityJudgment) {
      showToast('请选择是否需要质量判定部门判定');
      return;
    }
    setShowFlowConfig(true);
  };

  const handleFlowSubmit = () => {
    setShowFlowConfig(false);
    showToast('提交成功，审批已发起');
  };

  if (!dispute) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">异议数据不存在</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">项目部呈核</h1>
            <p className="text-sm text-slate-500 mt-0.5">{dispute.disputeNo}</p>
          </div>
          <button
            onClick={() => navigate('/project-contract/quality-dispute')}
            className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
            返回
          </button>
        </div>

        {/* Basic Info Display */}
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
            <span className="text-sm text-slate-500">供应商</span>
            <span className="text-sm font-medium text-slate-800">{dispute.supplierName}</span>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">异议信息</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-36">异议单号</span>
              <input type="text" value={dispute.disputeNo} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-36">异议金额(元)</span>
              <input type="text" value={formatCurrency(dispute.disputeAmount)} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-36">采购员</span>
              <input type="text" value={dispute.purchaser} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">附件</span>
              <div className="flex-1">
                {attachments.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {attachments.map((f, fi) => (
                      <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>
                    ))}
                  </div>
                ) : <span className="text-sm text-slate-400">暂无附件</span>}
                <button className="mt-1 px-3 py-1.5 text-xs text-slate-600 border border-dashed border-slate-300 rounded-md hover:bg-white cursor-pointer flex items-center gap-1 whitespace-nowrap">
                  <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-upload-line" /></div>
                  上传附件
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">项目部审核</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>是否需要质量判定部门判定</span>
              <select value={needQualityJudgment} onChange={(e) => setNeedQualityJudgment(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-36">异议数量</span>
              <input type="text" value={dispute.disputeQuantity} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">问题分析</span>
              <textarea value={issueAnalysis} onChange={(e) => setIssueAnalysis(e.target.value)} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="请输入问题分析..." />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-36">审核状态</span>
              <input type="text" value={dispute.projectReviewStatus} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
          <button onClick={handleSubmit} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>
            提交
          </button>
          <button onClick={() => navigate('/project-contract/quality-dispute')} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {showFlowConfig && (
        <ApprovalFlowConfigModal
          onClose={() => setShowFlowConfig(false)}
          onConfirm={handleFlowSubmit}
          defaultTitle={`质量异议审批-${dispute.disputeNo}`}
        />
      )}
    </Layout>
  );
}