import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getStopResumeById, getContractById } from '@/mocks/contractExecutionMocks';

export default function StopResumeDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const id = urlParams.get('id') || '';
  const contractId = urlParams.get('contractId') || '';

  const apply = getStopResumeById(id);
  const contract = getContractById(contractId);

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-slate-800">停复工申报详情</h1>
          <button onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-800">基础信息</span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">异动编号</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.changeNo || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">立项号</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.approvalNo || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">合同编号</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.contractNo || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">合同名称</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.contractName || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">异动类型</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.type || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">异动状态</span><span className="flex-1 px-3 py-1.5 text-sm font-medium text-slate-800">{apply?.status || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">合同异动日期</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.date || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">文件数量</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.fileCount ?? '--'}</span></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">是否免除考核</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.exemptAssessment || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">创建人</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.creator || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">修改人</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.modifier || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">创建日期</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.createDate || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">修改日期</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.modifyDate || '--'}</span></div>
            </div>
            <div className="col-span-2 flex items-start gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24 mt-1">异动原因</span><span className="flex-1 px-3 py-2 text-sm text-slate-800 bg-slate-50 rounded">{apply?.reason || '--'}</span></div>
            <div className="col-span-2 flex items-start gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24 mt-1">异动说明</span><span className="flex-1 px-3 py-2 text-sm text-slate-800 bg-slate-50 rounded">{apply?.description || '--'}</span></div>
          </div>
        </div>

        {/* Approval Records */}
        <div className="mb-6">
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

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
          <button onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>返回
          </button>
        </div>
      </div>
    </Layout>
  );
}