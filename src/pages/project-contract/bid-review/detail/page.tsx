import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getBidReviewDemandById, getRequirementProjectById, formatCurrency } from '@/mocks/engineeringRequirementMocks';

export default function BidReviewDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const demandId = urlParams.get('id') || '';
  const projectId = urlParams.get('projectId') || '';

  const demand = getBidReviewDemandById(demandId);
  const project = getRequirementProjectById(projectId);

  const getLevelColor = (level: number) => {
    if (level === 1) return { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' };
    if (level === 2) return { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8' };
    return { bg: '#fffbeb', border: '#f59e0b', text: '#b45309' };
  };

  if (!demand) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-slate-300">
            <i className="ri-inbox-line text-2xl" />
          </div>
          <p className="text-sm text-slate-500">未找到需求数据</p>
          <button
            onClick={() => navigate(`/project-contract/bid-review/demand-list?projectId=${projectId}`)}
            className="mt-3 px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer"
          >
            返回列表
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">需求详情</h1>
          <button
            onClick={() => navigate(`/project-contract/bid-review/demand-list?projectId=${projectId}`)}
            className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-left-line" />
            </div>
            返回
          </button>
        </div>

        {/* Project Info */}
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
          </div>
        )}

        {/* Basic Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-800">基础信息</span>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">工程需求编号</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.demandNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">需求名称</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.demandName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">立项号</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.approvalNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">所属事业部</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">需求类型</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">
                {demand.demandType}{demand.demandTypeLevel2 ? ` / ${demand.demandTypeLevel2}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">采购目录</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.purchaseCategory}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">需求部门</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.demandDept}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">采购方式</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.purchaseMethod}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">是否有甲供材</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.hasMaterial ? '是' : '否'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">需求金额</span>
              <span className="flex-1 px-3 py-1.5 text-sm font-medium text-slate-800">{formatCurrency(demand.demandAmount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">计划金额</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{formatCurrency(demand.planAmount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">甲供材金额</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{formatCurrency(demand.materialAmount)}</span>
            </div>
            <div className="flex items-center gap-2 col-span-3">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">需求原因</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.demandReason}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">经办人</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.handler}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">是否主体合同</span>
              <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{demand.isMainContract ? '是' : '否'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">状态</span>
              <span className="flex-1 px-3 py-1.5 text-sm">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                  backgroundColor: demand.status === '已通过' ? '#ecfdf5' : demand.status === '已驳回' ? '#fef2f2' : demand.status === '审批中' ? '#fffbeb' : '#f8fafc',
                  color: demand.status === '已通过' ? '#059669' : demand.status === '已驳回' ? '#dc2626' : demand.status === '审批中' ? '#d97706' : '#64748b',
                }}>
                  {demand.status}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 col-span-3">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">对内附件</span>
              <div className="flex items-center gap-2 flex-1">
                {demand.internalAttachments.map((f, i) => (
                  <span key={i} className="px-2 py-1 text-xs text-emerald-700 bg-emerald-50 rounded border border-emerald-200 flex items-center gap-1">
                    <div className="w-3 h-3 flex items-center justify-center">
                      <i className="ri-file-line" />
                    </div>
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 col-span-3">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">对外附件</span>
              <div className="flex items-center gap-2 flex-1">
                {demand.externalAttachments.map((f, i) => (
                  <span key={i} className="px-2 py-1 text-xs text-emerald-700 bg-emerald-50 rounded border border-emerald-200 flex items-center gap-1">
                    <div className="w-3 h-3 flex items-center justify-center">
                      <i className="ri-file-line" />
                    </div>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demand Details */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-slate-800">工程需求明细</span>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">序号</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工程细项说明</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">招标工程量</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">计量单位</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">绝对工期</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">承包方式</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">暂估金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">说明</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">使用单位</th>
                </tr>
              </thead>
              <tbody>
                {demand.details.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-2 py-2 text-sm text-slate-700">{idx + 1}</td>
                    <td className="px-2 py-2 text-sm text-slate-700">{d.description}</td>
                    <td className="px-2 py-2 text-sm text-slate-700">{d.quantity}</td>
                    <td className="px-2 py-2 text-sm text-slate-700">{d.unit}</td>
                    <td className="px-2 py-2 text-sm text-slate-700">{d.durationDays}</td>
                    <td className="px-2 py-2 text-sm text-slate-700">{d.contractMethod}</td>
                    <td className="px-2 py-2 text-sm text-slate-700">{formatCurrency(d.estimatedAmount)}</td>
                    <td className="px-2 py-2 text-sm text-slate-700">{d.remark || '--'}</td>
                    <td className="px-2 py-2 text-sm text-slate-700">{d.usageUnit}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50">
                <tr>
                  <td colSpan={6} className="px-2 py-2 text-right text-sm font-medium text-slate-600">
                    合计
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-slate-800">
                    {formatCurrency(demand.details.reduce((s, d) => s + d.estimatedAmount, 0))}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Amount Occupation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-slate-800">工程需求金额占用明细</span>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">概算费用名称</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">概算金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">已占用金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">概算剩余金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">甲供材占用金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">需求占用金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">最后一笔需求</th>
                </tr>
              </thead>
              <tbody>
                {demand.occupationDetails.map((o) => {
                  const color = getLevelColor(o.level);
                  const paddingLeft = o.level * 16;
                  return (
                    <tr
                      key={o.estimateId}
                      className="hover:bg-slate-50"
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        borderLeft: `3px solid ${color.border}`,
                        backgroundColor: color.bg,
                      }}
                    >
                      <td className="px-2 py-2 text-sm font-medium" style={{ color: color.text, paddingLeft: `${paddingLeft + 8}px` }}>
                        {o.estimateName}
                      </td>
                      <td className="px-2 py-2 text-sm text-slate-700">{formatCurrency(o.estimateAmount)}</td>
                      <td className="px-2 py-2 text-sm text-slate-700">{formatCurrency(o.occupiedAmount)}</td>
                      <td className="px-2 py-2 text-sm text-slate-700">{formatCurrency(o.remainingAmount)}</td>
                      <td className="px-2 py-2 text-sm text-slate-700">{formatCurrency(o.materialOccupiedAmount)}</td>
                      <td className="px-2 py-2 text-sm text-slate-700">{formatCurrency(o.demandOccupiedAmount)}</td>
                      <td className="px-2 py-2 text-sm text-slate-700">{o.isLastDemand ? '是' : '否'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-center pt-4 border-t border-slate-200">
          <button
            onClick={() => navigate(`/project-contract/bid-review/demand-list?projectId=${projectId}`)}
            className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-go-back-line" />
            </div>
            返回
          </button>
        </div>
      </div>
    </Layout>
  );
}