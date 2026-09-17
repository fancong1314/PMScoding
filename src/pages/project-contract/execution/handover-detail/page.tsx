import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getHandoverById } from '@/mocks/contractExecutionMocks';

export default function HandoverDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const applyId = urlParams.get('applyId') || '';
  const contractId = urlParams.get('contractId') || '';

  const apply = getHandoverById(applyId);

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-slate-800">交工申报详情</h1>
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
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">工程名称</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.projectName || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">合同号</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.contractNo || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">建设单位</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.constructionUnit || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">开工日期</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.startDate || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">监理单位</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.supervisorUnit || '--'}</span></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">立项号</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.approvalNo || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">承建单位</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.contractorUnit || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">完工日期</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.completionDate || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">施工单位</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.constructionCompany || '--'}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">主管单位</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.responsibleUnit || '--'}</span></div>
            </div>
            <div className="col-span-2 space-y-3">
              <div className="flex items-start gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">交工验收结论</span><span className="flex-1 px-3 py-2 text-sm text-slate-800 bg-slate-50 rounded">{apply?.acceptanceConclusion || '--'}</span></div>
              <div className="flex items-start gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">内容</span><span className="flex-1 px-3 py-2 text-sm text-slate-800 bg-slate-50 rounded">{apply?.content || '--'}</span></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">实物交接表</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {(apply?.handoverFiles || []).map((f, i) => (
                    <span key={i} className="px-2 py-1 text-xs text-slate-600 bg-white rounded border border-slate-200 flex items-center gap-1">
                      <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line" /></div>{f}
                      <button className="w-4 h-4 flex items-center justify-center text-blue-500 hover:text-blue-700 cursor-pointer ml-1"><i className="ri-download-line" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Flow */}
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