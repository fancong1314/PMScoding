import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getContractById, getContractApplies, formatCurrency, CommencementApply,
  getHandoverApplies, getStopResumeApplies, getCompletionApplies,
  HandoverApply, StopResumeApply, CompletionApply,
} from '@/mocks/contractExecutionMocks';
import IssueModal from '../components/IssueModal';
import ApprovalFlowConfigModal from '../components/ApprovalFlowConfigModal';
import ApprovalDetailModal from '../components/ApprovalDetailModal';
import CompletionTimeModal from '../components/CompletionTimeModal';

const tabs = [
  { key: 'commencement', label: '开工' },
  { key: 'handover', label: '交工' },
  { key: 'stop-resume', label: '停复工' },
  { key: 'completion', label: '竣工' },
];

export default function ContractExecutionCommencementPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const contract = getContractById(contractId);
  const applies = getContractApplies(contractId);
  const handoverApplies = getHandoverApplies(contractId);
  const stopResumeApplies = getStopResumeApplies(contractId);
  const completionApplies = getCompletionApplies(contractId);

  const [activeTab, setActiveTab] = useState('commencement');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [toast, setToast] = useState('');
  const [issueApply, setIssueApply] = useState<CommencementApply | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showFlowConfig, setShowFlowConfig] = useState(false);
  const [showApprovalDetail, setShowApprovalDetail] = useState(false);
  const [showCompletionTime, setShowCompletionTime] = useState(false);
  const [selectedCompletion, setSelectedCompletion] = useState<CompletionApply | null>(null);
  const [returnModal, setReturnModal] = useState<{ show: boolean; applyId: string }>({ show: false, applyId: '' });
  const [returnReason, setReturnReason] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  // ---- 开工 Tab ----
  const filteredApplies = applies.filter((a) => {
    if (dateRange.start && a.applyTime < dateRange.start) return false;
    if (dateRange.end && a.applyTime > dateRange.end + ' 23:59:59') return false;
    return true;
  });
  const totalPages = Math.ceil(filteredApplies.length / pageSize);
  const paginated = filteredApplies.slice((page - 1) * pageSize, page * pageSize);

  const statusBg: Record<string, string> = {
    '待审批': 'bg-amber-50 text-amber-700',
    '已通过': 'bg-emerald-50 text-emerald-700',
    '已退回': 'bg-red-50 text-red-700',
    '已签发': 'bg-blue-50 text-blue-700',
    '已打印': 'bg-slate-100 text-slate-700',
  };

  const handlePass = useCallback((apply: CommencementApply) => {
    navigate(`/project-contract/execution/approve?applyId=${apply.id}&contractId=${contractId}&mode=pass`);
  }, [navigate, contractId]);

  const handleReturn = useCallback((apply: CommencementApply) => {
    navigate(`/project-contract/execution/approve?applyId=${apply.id}&contractId=${contractId}&mode=return`);
  }, [navigate, contractId]);

  const handleDetail = useCallback((apply: CommencementApply) => {
    navigate(`/project-contract/execution/detail?applyId=${apply.id}&contractId=${contractId}`);
  }, [navigate, contractId]);

  const handlePrintReview = useCallback(() => { showToast('报审单已生成，开始下载...'); }, []);
  const handleIssue = useCallback((apply: CommencementApply) => { setIssueApply(apply); setShowIssueModal(true); }, []);
  const handlePrintOrder = useCallback(() => { showToast('开工令已生成，开始打印...'); }, []);
  const handleExport = () => { showToast('数据导出成功'); };

  // ---- Shared handlers ----
  const handleFlowSubmit = () => { setShowFlowConfig(false); showToast('审批流程已提交'); };
  const handleCompletionTimeConfirm = (newDate: string) => {
    setShowCompletionTime(false);
    showToast(`竣工时间已修改为 ${newDate}`);
  };

  // ---- Pagination ----
  const currentTabData = activeTab === 'commencement' ? filteredApplies :
    activeTab === 'handover' ? handoverApplies :
    activeTab === 'stop-resume' ? stopResumeApplies :
    completionApplies;
  const tabTotalPages = Math.ceil(currentTabData.length / pageSize);
  const tabPaginated = currentTabData.slice((page - 1) * pageSize, page * pageSize);

  // Handover status styles
  const handoverStatusBg: Record<string, string> = {
    '已通过': 'bg-emerald-50 text-emerald-700',
    '待审批': 'bg-amber-50 text-amber-700',
    '已退回': 'bg-red-50 text-red-700',
  };

  // Stop-resume status styles
  const stopResumeStatusBg: Record<string, string> = {
    '已通过': 'bg-emerald-50 text-emerald-700',
    '审批中': 'bg-amber-50 text-amber-700',
    '已退回': 'bg-red-50 text-red-700',
  };

  // Completion stage styles
  const completionStageBg: Record<string, string> = {
    '已通过': 'bg-emerald-50 text-emerald-700',
    '制造部审核中': 'bg-blue-50 text-blue-700',
    '项目部审核中': 'bg-amber-50 text-amber-700',
    '待申报': 'bg-slate-100 text-slate-500',
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        {/* Contract Info */}
        {contract && (
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同金额</span><span className="text-sm font-medium text-slate-800">{formatCurrency(contract.contractAmount)}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">承包商</span><span className="text-sm font-medium text-slate-800">{contract.contractorName}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同状态</span><span className="text-sm font-medium text-slate-800">{contract.contractStatus}</span></div>
            <button onClick={() => navigate('/project-contract/execution')} className="ml-auto px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
              返回列表
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 p-1 bg-slate-100 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`px-4 py-2 text-sm rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.key ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============ 开工 TAB ============ */}
        {activeTab === 'commencement' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 whitespace-nowrap">时间段筛选</span>
                <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-32 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                <span className="text-sm text-slate-400">至</span>
                <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-32 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <button onClick={handleExport} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line" /></div>
                导出数据
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>申请编号</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同编号</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同名称</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同金额(元)</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">建设单位</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">承建单位</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同内容</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">状态</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((apply) => (
                    <tr key={apply.id} className="group hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{apply.applyNo}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{apply.contractNo}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{apply.contractName}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{formatCurrency(apply.contractAmount)}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{apply.constructionUnit}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{apply.contractorUnit}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap max-w-xs truncate">{apply.contractContent}</td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBg[apply.status]}`}>{apply.status}</span></td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                        <div className="flex items-center gap-1 flex-wrap">
                          <button onClick={() => handlePass(apply)} className="px-2 py-1 text-xs text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap">通过</button>
                          <button onClick={() => handleReturn(apply)} className="px-2 py-1 text-xs text-amber-700 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer whitespace-nowrap">退回</button>
                          <button onClick={() => handleDetail(apply)} className="px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap">详情</button>
                          {!contract?.hasSupervisor && (
                            <>
                              <button onClick={() => handlePrintReview()} className="px-2 py-1 text-xs text-blue-700 border border-blue-200 rounded hover:bg-blue-50 cursor-pointer whitespace-nowrap">报审单列印</button>
                              <button onClick={() => handleIssue(apply)} className="px-2 py-1 text-xs text-violet-700 border border-violet-200 rounded hover:bg-violet-50 cursor-pointer whitespace-nowrap">签发</button>
                            </>
                          )}
                          <button onClick={() => handlePrintOrder()} className="px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap">开工令列印</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>共 {filteredApplies.length} 条</span><span>每页 {pageSize} 条</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">上一页</button>
                <span className="px-3 py-1 text-sm text-slate-700">{page} / {totalPages || 1}</span>
                <button onClick={() => setPage(Math.min(totalPages || 1, page + 1))} disabled={page === totalPages || totalPages === 0} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">下一页</button>
              </div>
            </div>
          </>
        )}

        {/* ============ 交工 TAB ============ */}
        {activeTab === 'handover' && (
          <>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>工程名称</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同号</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">立项号</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">建设单位</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">承建单位</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">开工日期</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">完工日期</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-32">交工验收结论</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">内容</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审批状态</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">当前审核人</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {tabPaginated.length === 0 ? (
                    <tr><td colSpan={12} className="px-3 py-8 text-center text-sm text-slate-400">暂无交工数据</td></tr>
                  ) : (
                    (tabPaginated as HandoverApply[]).map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{item.projectName}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.contractNo}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.approvalNo}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.constructionUnit}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.contractorUnit}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.startDate}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.completionDate}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap max-w-xs truncate">{item.acceptanceConclusion || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap max-w-xs truncate">{item.content}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${handoverStatusBg[item.approvalStatus] || 'bg-slate-100 text-slate-600'}`}>{item.approvalStatus}</span></td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.currentReviewer || '--'}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                          <div className="flex items-center gap-1 flex-wrap">
                            <button onClick={() => navigate(`/project-contract/execution/handover-approve?applyId=${item.id}&contractId=${contractId}`)} className="px-2 py-1 text-xs text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap">审批</button>
                            <button onClick={() => navigate(`/project-contract/execution/handover-detail?applyId=${item.id}&contractId=${contractId}`)} className="px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看详情</button>
                            <button onClick={() => showToast('交工单已生成，开始下载...')} className="px-2 py-1 text-xs text-violet-700 border border-violet-200 rounded hover:bg-violet-50 cursor-pointer whitespace-nowrap">列印交工单</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>共 {currentTabData.length} 条</span><span>每页 {pageSize} 条</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">上一页</button>
                <span className="px-3 py-1 text-sm text-slate-700">{page} / {tabTotalPages || 1}</span>
                <button onClick={() => setPage(Math.min(tabTotalPages || 1, page + 1))} disabled={page === tabTotalPages || tabTotalPages === 0} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">下一页</button>
              </div>
            </div>
          </>
        )}

        {/* ============ 停复工 TAB ============ */}
        {activeTab === 'stop-resume' && (
          <>
            <div className="flex items-center justify-end mb-4">
              <button onClick={() => navigate(`/project-contract/execution/stop-resume-form?contractId=${contractId}`)} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
                新增
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>异动编号</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">立项号</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同编号</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同名称</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-32">异动原因</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-32">异动说明</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">异动类型</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">异动日期</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">异动状态</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">文件数量</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">创建人</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">创建日期</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {tabPaginated.length === 0 ? (
                    <tr><td colSpan={13} className="px-3 py-8 text-center text-sm text-slate-400">暂无停复工数据</td></tr>
                  ) : (
                    (tabPaginated as StopResumeApply[]).map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{item.changeNo}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.approvalNo}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.contractNo}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.contractName}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap max-w-xs truncate">{item.reason}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap max-w-xs truncate">{item.description}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.type}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.date}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stopResumeStatusBg[item.status] || 'bg-slate-100 text-slate-600'}`}>{item.status}</span></td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.fileCount}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.creator}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.createDate}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                          <div className="flex items-center gap-1 flex-wrap">
                            <button onClick={() => setShowFlowConfig(true)} className="px-2 py-1 text-xs text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap">呈核</button>
                            {item.source === '施工方发起' && (
                              <button onClick={() => { setReturnModal({ show: true, applyId: item.id }); setReturnReason(''); }} className="px-2 py-1 text-xs text-amber-700 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer whitespace-nowrap">退回</button>
                            )}
                            <button onClick={() => setShowApprovalDetail(true)} className="px-2 py-1 text-xs text-blue-700 border border-blue-200 rounded hover:bg-blue-50 cursor-pointer whitespace-nowrap">查看审批详情</button>
                            <button onClick={() => navigate(`/project-contract/execution/stop-resume-detail?id=${item.id}&contractId=${contractId}`)} className="px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看申报详情</button>
                            <button onClick={() => showToast('停工令已生成，开始打印...')} className="px-2 py-1 text-xs text-violet-700 border border-violet-200 rounded hover:bg-violet-50 cursor-pointer whitespace-nowrap">列印停工令</button>
                            <button onClick={() => showToast('复工令已生成，开始打印...')} className="px-2 py-1 text-xs text-sky-700 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">列印复工令</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>共 {currentTabData.length} 条</span><span>每页 {pageSize} 条</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">上一页</button>
                <span className="px-3 py-1 text-sm text-slate-700">{page} / {tabTotalPages || 1}</span>
                <button onClick={() => setPage(Math.min(tabTotalPages || 1, page + 1))} disabled={page === tabTotalPages || tabTotalPages === 0} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">下一页</button>
              </div>
            </div>

            {/* Return Modal */}
            {returnModal.show && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="bg-white rounded-lg shadow-xl w-[420px]">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-800">退回申请</h3>
                    <button onClick={() => setReturnModal({ show: false, applyId: '' })} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line" /></button>
                  </div>
                  <div className="p-5">
                    <span className="text-sm text-red-600 mb-2 block"><span className="text-red-500">*</span>退回原因</span>
                    <textarea value={returnReason} onChange={(e) => setReturnReason(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" placeholder="请输入退回原因" />
                  </div>
                  <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
                    <button onClick={() => setReturnModal({ show: false, applyId: '' })} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
                    <button onClick={() => { setReturnModal({ show: false, applyId: '' }); showToast('已退回至申报人'); }} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>确认退回</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ============ 竣工 TAB ============ */}
        {activeTab === 'completion' && (
          <>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>工程名称</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同号</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">立项号</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">质量评定</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">是否按图施工完毕</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">变更是否施工完毕</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-32">验收意见</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审批状态</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">当前审核人</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">当前审核阶段</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {tabPaginated.length === 0 ? (
                    <tr><td colSpan={11} className="px-3 py-8 text-center text-sm text-slate-400">暂无竣工数据</td></tr>
                  ) : (
                    (tabPaginated as CompletionApply[]).map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{item.projectName}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.contractNo}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.approvalNo}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.qualityRating || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.builtPerDrawings || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.changesCompleted || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap max-w-xs truncate">{item.acceptanceOpinion || '--'}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${completionStageBg[item.approvalStatus] || 'bg-slate-100 text-slate-600'}`}>{item.approvalStatus}</span></td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.currentReviewer || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.currentStage}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                          <div className="flex items-center gap-1 flex-wrap">
                            {item.currentStage === '项目部审核' && (
                              <button onClick={() => navigate(`/project-contract/execution/completion-project-review?applyId=${item.id}&contractId=${contractId}`)} className="px-2 py-1 text-xs text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap">项目部审核</button>
                            )}
                            {item.currentStage === '制造部审核' && (
                              <button onClick={() => navigate(`/project-contract/execution/completion-manufacturing-review?applyId=${item.id}&contractId=${contractId}`)} className="px-2 py-1 text-xs text-blue-700 border border-blue-200 rounded hover:bg-blue-50 cursor-pointer whitespace-nowrap">制造部审核</button>
                            )}
                            <button onClick={() => setShowApprovalDetail(true)} className="px-2 py-1 text-xs text-violet-700 border border-violet-200 rounded hover:bg-violet-50 cursor-pointer whitespace-nowrap">查看审批详情</button>
                            <button onClick={() => navigate(`/project-contract/execution/completion-detail?applyId=${item.id}&contractId=${contractId}`)} className="px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看申报详情</button>
                            {item.currentStage === '已通过' && (
                              <>
                                <button onClick={() => showToast('竣工单已生成，开始打印...')} className="px-2 py-1 text-xs text-sky-700 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">列印竣工单</button>
                                <button onClick={() => { setSelectedCompletion(item); setShowCompletionTime(true); }} className="px-2 py-1 text-xs text-amber-700 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer whitespace-nowrap">修改竣工时间</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>共 {currentTabData.length} 条</span><span>每页 {pageSize} 条</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">上一页</button>
                <span className="px-3 py-1 text-sm text-slate-700">{page} / {tabTotalPages || 1}</span>
                <button onClick={() => setPage(Math.min(tabTotalPages || 1, page + 1))} disabled={page === tabTotalPages || tabTotalPages === 0} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">下一页</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* Issue Modal */}
      {showIssueModal && issueApply && (
        <IssueModal apply={issueApply} onClose={() => setShowIssueModal(false)} onSubmit={() => { setShowIssueModal(false); showToast('开工令签发成功'); }} />
      )}

      {/* Approval Flow Config Modal */}
      {showFlowConfig && (
        <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={handleFlowSubmit} defaultTitle="停复工审批流程" />
      )}

      {/* Approval Detail Modal */}
      {showApprovalDetail && (
        <ApprovalDetailModal onClose={() => setShowApprovalDetail(false)} />
      )}

      {/* Completion Time Modal */}
      {showCompletionTime && selectedCompletion && (
        <CompletionTimeModal projectName={selectedCompletion.projectName} contractNo={selectedCompletion.contractNo} currentDate={selectedCompletion.completionDate} onClose={() => setShowCompletionTime(false)} onConfirm={handleCompletionTimeConfirm} />
      )}
    </Layout>
  );
}