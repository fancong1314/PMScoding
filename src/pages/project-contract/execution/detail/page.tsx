import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getApplyById, getContractById, formatCurrency } from '@/mocks/contractExecutionMocks';

export default function ContractExecutionDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const applyId = urlParams.get('applyId') || '';
  const contractId = urlParams.get('contractId') || '';

  const apply = getApplyById(applyId);
  const contract = getContractById(contractId);

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">开工令详情</h1>
          <button
            onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)}
            className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
            返回
          </button>
        </div>

        {/* Contract Info */}
        {contract && (
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同金额</span><span className="text-sm font-medium text-slate-800">{formatCurrency(contract.contractAmount)}</span></div>
          </div>
        )}

        {/* Basic Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-800">基础信息</span>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">建设单位</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.constructionUnit || '--'}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">申请编号</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.applyNo || '--'}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">合同名称</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.contractName || '--'}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">承建单位</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.contractorUnit || '--'}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">合同编号</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.contractNo || '--'}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-28">合同金额</span><span className="flex-1 px-3 py-1.5 text-sm font-semibold text-slate-800">{formatCurrency(apply?.contractAmount ?? 0)}</span></div>
            <div className="flex items-center gap-2 col-span-3"><span className="text-sm text-slate-600 whitespace-nowrap w-28">承办范围</span><span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{apply?.contractContent || '--'}</span></div>
            <div className="flex items-center gap-2 col-span-3"><span className="text-sm text-slate-600 whitespace-nowrap w-28">上传施工图审查资料</span>
              <div className="flex-1 flex items-center gap-2">
                {apply?.drawingReviewFiles.map((f, i) => (
                  <span key={i} className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded border border-slate-200 flex items-center gap-1">
                    <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line" /></div>
                    {f}
                  </span>
                )) || <span className="text-sm text-slate-400">无</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-slate-800">规定的施工内容及条件核查表</span>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">序号</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">核查内容</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">完成勾选状态</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">附件</th>
                </tr>
              </thead>
              <tbody>
                {apply?.checkItems.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{idx + 1}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{item.content}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">
                      {item.checked ? (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 flex items-center gap-1 inline-flex">
                          <div className="w-3 h-3 flex items-center justify-center"><i className="ri-checkbox-circle-line" /></div>
                          已完成
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500 flex items-center gap-1 inline-flex">
                          <div className="w-3 h-3 flex items-center justify-center"><i className="ri-close-circle-line" /></div>
                          未完成
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">
                      {item.attachments.length > 0 ? (
                        <div className="flex items-center gap-1">
                          {item.attachments.map((f, fi) => (
                            <span key={fi} className="px-2 py-0.5 text-xs text-slate-600 bg-slate-100 rounded border border-slate-200 flex items-center gap-1">
                              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line" /></div>
                              {f}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Records */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-slate-800">审批流程记录</span>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核阶段</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作内容</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作日期</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                </tr>
              </thead>
              <tbody>
                {apply?.approvalRecords.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.stage}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        rec.status === '已通过' ? 'bg-emerald-50 text-emerald-700' :
                        rec.status === '已退回' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {rec.action}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-slate-700">{rec.opinion || '--'}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{rec.content || '--'}</td>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operator}</td>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.date || '--'}</td>
                    <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.time || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)}
            className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>
            返回
          </button>
        </div>
      </div>
    </Layout>
  );
}