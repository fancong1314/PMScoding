import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { allIssues, issueStatuses, type Issue } from '@/mocks/qualitySafetyMocks';
import IssueModal from '../components/IssueModal';
import ReviewModal from '../components/ReviewModal';
import ApprovalDetailModal from '../components/ApprovalDetailModal';
import DetailModal from '../components/DetailModal';

export default function IssueListPage() {
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId') || '';
  const contractName = searchParams.get('contractName') || '';
  const contractNo = searchParams.get('contractNo') || '';

  const [activeTab, setActiveTab] = useState<'quality' | 'safety'>('quality');
  const [filterIssueNo, setFilterIssueNo] = useState('');
  const [filterIssueType, setFilterIssueType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueModalMode, setIssueModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewIssue, setReviewIssue] = useState<Issue | null>(null);

  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalIssue, setApprovalIssue] = useState<Issue | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailIssue, setDetailIssue] = useState<Issue | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmContent, setConfirmContent] = useState('');
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return allIssues.filter((r) => {
      if (r.contractId !== contractId) return false;
      if (r.issueCategory !== activeTab) return false;
      if (filterIssueNo && !r.issueNo.includes(filterIssueNo)) return false;
      if (filterIssueType && !r.issueType.includes(filterIssueType)) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      return true;
    }).sort((a, b) => b.createTime.localeCompare(a.createTime));
  }, [activeTab, contractId, filterIssueNo, filterIssueType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setFilterIssueNo('');
    setFilterIssueType('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setIssueModalMode('create');
    setActiveIssue(null);
    setIssueModalOpen(true);
  };

  const handleEdit = (issue: Issue) => {
    if (issue.status === '已关闭') {
      showToast('已关闭的问题不允许修改', 'error');
      return;
    }
    setIssueModalMode('edit');
    setActiveIssue(issue);
    setIssueModalOpen(true);
  };

  const handleClose = (issue: Issue) => {
    if (issue.status === '已关闭') {
      showToast('该问题已关闭，无需重复操作', 'error');
      return;
    }
    setConfirmTitle('关闭问题确认');
    setConfirmContent(`确定要关闭问题「${issue.issueNo}」吗？关闭后不可恢复。`);
    setConfirmCallback(() => () => {
      showToast('问题已关闭');
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleWithdraw = (issue: Issue) => {
    setConfirmTitle('撤回问题确认');
    setConfirmContent(`确定要撤回问题「${issue.issueNo}」吗？撤回后将恢复至草稿状态。`);
    setConfirmCallback(() => () => {
      showToast('问题已撤回');
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleReview = (issue: Issue) => {
    setReviewIssue(issue);
    setReviewOpen(true);
  };

  const handleViewDetail = (issue: Issue) => {
    setDetailIssue(issue);
    setDetailOpen(true);
  };

  const handleApprovalDetail = (issue: Issue) => {
    setApprovalIssue(issue);
    setApprovalOpen(true);
  };

  const handleExport = () => {
    showToast('问题数据导出成功');
  };

  const getStatusStyle = (status: string) => {
    const s = issueStatuses.find((is) => is.value === status);
    return s?.color || 'bg-slate-100 text-slate-600';
  };

  const renderPagination = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">质量安全问题管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">
            合同：{contractName}（{contractNo}）
          </p>
        </div>

        {/* Tab切换 */}
        <div className="bg-white rounded-lg border border-steel-200 px-1 py-1 inline-flex">
          <button
            onClick={() => { setActiveTab('quality'); setCurrentPage(1); }}
            className={`px-5 py-2 text-sm rounded-full transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'quality' ? 'text-white font-medium' : 'text-steel-500 hover:text-steel-700'}`}
            style={activeTab === 'quality' ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}
          >
            <div className="flex items-center gap-1.5">
              <i className="ri-hammer-line" />
              质量问题
            </div>
          </button>
          <button
            onClick={() => { setActiveTab('safety'); setCurrentPage(1); }}
            className={`px-5 py-2 text-sm rounded-full transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'safety' ? 'text-white font-medium' : 'text-steel-500 hover:text-steel-700'}`}
            style={activeTab === 'safety' ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}
          >
            <div className="flex items-center gap-1.5">
              <i className="ri-shield-star-line" />
              安全问题
            </div>
          </button>
        </div>

        {/* 查询区 */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-5 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">问题编号</label>
              <input value={filterIssueNo} onChange={(e) => setFilterIssueNo(e.target.value)} placeholder="请输入问题编号" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">问题类型</label>
              <input value={filterIssueType} onChange={(e) => setFilterIssueType(e.target.value)} placeholder="请输入问题类型" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">状态</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {issueStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
                重置
              </button>
              <button onClick={() => setCurrentPage(1)} className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
                查询
              </button>
            </div>
          </div>
        </div>

        {/* 功能按钮区 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={handleCreate} className="flex items-center gap-1.5 px-4 py-2 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-add-line" /></div>
              新增{activeTab === 'quality' ? '质量' : '安全'}问题
            </button>
            <button onClick={handleExport} className="flex items-center gap-1.5 px-4 py-2 text-xs text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 transition-colors cursor-pointer whitespace-nowrap">
              <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-download-2-line" /></div>
              导出
            </button>
          </div>
          <div className="text-xs text-steel-400">
            共 <span className="font-semibold text-steel-700">{filtered.length}</span> 条记录
          </div>
        </div>

        {/* 数据列表 */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1200px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">问题编号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">问题类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">发起人</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">发起单位</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">发起时间</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">问题等级</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">整改期限</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '200px' }}>问题描述</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: '340px', borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-file-list-3-line text-2xl text-steel-300" /></div>
                        <p className="text-sm text-steel-400">暂无{activeTab === 'quality' ? '质量' : '安全'}问题数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((issue, idx) => (
                    <tr key={issue.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-mono text-primary-600 whitespace-nowrap">{issue.issueNo}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{issue.issueType}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{issue.initiator}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{issue.initiatorUnit}</td>
                      <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{issue.createTime}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${issue.issueLevel === '重大' ? 'bg-red-50 text-red-700 border border-red-200' : issue.issueLevel === '较大' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                          {issue.issueLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{issue.deadline}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 max-w-xs"><span className="line-clamp-2">{issue.description}</span></td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(issue.status)}`}>{issue.status}</span>
                      </td>
                      <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          <button onClick={() => handleEdit(issue)} className="flex items-center gap-1 px-2 py-1 text-xs text-steel-600 border border-steel-200 rounded hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                            <i className="ri-edit-line" />修改
                          </button>
                          <button onClick={() => handleWithdraw(issue)} className="flex items-center gap-1 px-2 py-1 text-xs text-amber-600 border border-amber-200 rounded hover:bg-amber-50 transition-colors cursor-pointer whitespace-nowrap">
                            <i className="ri-arrow-go-back-line" />撤回
                          </button>
                          <button onClick={() => handleClose(issue)} className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap">
                            <i className="ri-close-circle-line" />关闭
                          </button>
                          <button onClick={() => handleReview(issue)} className="flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 transition-colors cursor-pointer whitespace-nowrap">
                            <i className="ri-check-double-line" />复查
                          </button>
                          <button onClick={() => handleViewDetail(issue)} className="flex items-center gap-1 px-2 py-1 text-xs text-violet-600 border border-violet-200 rounded hover:bg-violet-50 transition-colors cursor-pointer whitespace-nowrap">
                            <i className="ri-file-list-line" />查看详情
                          </button>
                          <button onClick={() => handleApprovalDetail(issue)} className="flex items-center gap-1 px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 transition-colors cursor-pointer whitespace-nowrap">
                            <i className="ri-flow-chart" />审批详情
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 分页 */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{filtered.length}</span> 条</span>
              <span>第 <span className="font-medium text-steel-700">{currentPage}</span>/{totalPages} 页</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none">
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">首页</button>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-left-s-line" /></button>
              {renderPagination().map((page, i) =>
                page === '...' ? (
                  <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-steel-400 text-sm">...</span>
                ) : (
                  <button key={page} onClick={() => setCurrentPage(page as number)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${currentPage === page ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`} style={currentPage === page ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}>{page}</button>
                )
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-right-s-line" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">末页</button>
            </div>
          </div>
        )}
      </div>

      {/* 新增/修改/查看弹窗 */}
      <IssueModal
        open={issueModalOpen}
        mode={issueModalMode}
        issue={activeIssue}
        contractName={contractName}
        contractNo={contractNo}
        issueCategory={activeTab}
        onClose={() => { setIssueModalOpen(false); setActiveIssue(null); }}
        onSubmit={(data) => {
          if (issueModalMode === 'create') {
            showToast(`${activeTab === 'quality' ? '质量' : '安全'}问题新增成功`);
          } else {
            showToast('问题修改成功');
          }
          setIssueModalOpen(false);
        }}
      />

      {/* 复查弹窗 */}
      <ReviewModal
        open={reviewOpen}
        issue={reviewIssue}
        onClose={() => { setReviewOpen(false); setReviewIssue(null); }}
        onSubmit={(data) => {
          showToast(`复查${data.result === '通过' ? '通过' : '驳回'}，已更新问题状态`);
          setReviewOpen(false);
        }}
      />

      {/* 审批详情弹窗 */}
      <ApprovalDetailModal
        open={approvalOpen}
        issue={approvalIssue}
        onClose={() => { setApprovalOpen(false); setApprovalIssue(null); }}
      />

      {/* 查看详情弹窗 */}
      <DetailModal
        open={detailOpen}
        issue={detailIssue}
        onClose={() => { setDetailOpen(false); setDetailIssue(null); }}
      />

      {/* 确认弹窗 */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[420px] p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-question-line text-lg text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-steel-800 mb-1">{confirmTitle}</h3>
                <p className="text-sm text-steel-500">{confirmContent}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={confirmCallback} className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>确认</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="w-5 h-5 flex items-center justify-center"><i className={toast.type === 'success' ? 'ri-checkbox-circle-line text-green-500' : 'ri-close-circle-line text-red-500'} /></div>
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{toast.message}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}