import { useState, useMemo } from 'react';
import Layout from '@/components/feature/Layout';
import { useNavigate } from 'react-router-dom';
import { contracts, allIssues, issueStatuses, type Contract } from '@/mocks/qualitySafetyMocks';

export default function ContractListPage() {
  const navigate = useNavigate();
  const [records] = useState<Contract[]>(contracts);

  const [filterProjectNo, setFilterProjectNo] = useState('');
  const [filterProjectName, setFilterProjectName] = useState('');
  const [filterContractNo, setFilterContractNo] = useState('');
  const [filterContractName, setFilterContractName] = useState('');
  const [filterConstructionUnit, setFilterConstructionUnit] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 问题清单弹窗
  const [issueListOpen, setIssueListOpen] = useState(false);
  const [issueListPage, setIssueListPage] = useState(1);
  const [issueListPageSize, setIssueListPageSize] = useState(10);

  const allIssuesMemo = useMemo(() => {
    return [...allIssues].sort((a, b) => b.createTime.localeCompare(a.createTime));
  }, []);

  const issueListTotalPages = Math.max(1, Math.ceil(allIssuesMemo.length / issueListPageSize));
  const issueListPaginated = allIssuesMemo.slice((issueListPage - 1) * issueListPageSize, issueListPage * issueListPageSize);

  const getIssueStatusStyle = (status: string) => {
    const s = issueStatuses.find((is) => is.value === status);
    return s?.color || 'bg-slate-100 text-slate-600';
  };

  const renderIssuePagination = () => {
    const pages: (number | '...')[] = [];
    if (issueListTotalPages <= 7) {
      for (let i = 1; i <= issueListTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (issueListPage > 3) pages.push('...');
      for (let i = Math.max(2, issueListPage - 1); i <= Math.min(issueListTotalPages - 1, issueListPage + 1); i++) pages.push(i);
      if (issueListPage < issueListTotalPages - 2) pages.push('...');
      pages.push(issueListTotalPages);
    }
    return pages;
  };

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterProjectNo && !r.projectNo.includes(filterProjectNo)) return false;
      if (filterProjectName && !r.projectName.includes(filterProjectName)) return false;
      if (filterContractNo && !r.contractNo.includes(filterContractNo)) return false;
      if (filterContractName && !r.contractName.includes(filterContractName)) return false;
      if (filterConstructionUnit && !r.constructionUnit.includes(filterConstructionUnit)) return false;
      return true;
    }).sort((a, b) => b.createDate.localeCompare(a.createDate));
  }, [records, filterProjectNo, filterProjectName, filterContractNo, filterContractName, filterConstructionUnit]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setFilterProjectNo('');
    setFilterProjectName('');
    setFilterContractNo('');
    setFilterContractName('');
    setFilterConstructionUnit('');
    setCurrentPage(1);
  };

  const handleViewIssues = (contract: Contract) => {
    navigate(`/project-execute/quality-safety/issues?contractId=${contract.id}&contractName=${encodeURIComponent(contract.contractName)}&contractNo=${encodeURIComponent(contract.contractNo)}`);
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
          <h1 className="text-lg font-semibold text-steel-900">质量安全管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理工程合同关联的质量安全问题，统计整改情况</p>
        </div>

        {/* 功能按钮区 */}
        <div className="flex items-center justify-end">
          <button onClick={() => { setIssueListOpen(true); setIssueListPage(1); }} className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-list-2-line" /></div>
            问题清单
          </button>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">立项号</label>
              <input value={filterProjectNo} onChange={(e) => setFilterProjectNo(e.target.value)} placeholder="请输入立项号" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目名称</label>
              <input value={filterProjectName} onChange={(e) => setFilterProjectName(e.target.value)} placeholder="请输入项目名称" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">合同编号</label>
              <input value={filterContractNo} onChange={(e) => setFilterContractNo(e.target.value)} placeholder="请输入合同编号" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">合同名称</label>
              <input value={filterContractName} onChange={(e) => setFilterContractName(e.target.value)} placeholder="请输入合同名称" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">施工单位</label>
              <input value={filterConstructionUnit} onChange={(e) => setFilterConstructionUnit(e.target.value)} placeholder="请输入施工单位" className={inputCls} />
            </div>
            <div className="col-span-5 flex items-center justify-end gap-2">
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

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1400px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">项次</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '220px' }}>项目名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同编号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '220px' }}>合同名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">所属事业部</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">施工单位</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">扣分值合计</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">问题数量</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">已整改</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">待整改</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: '120px', borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-file-list-3-line text-2xl text-steel-300" /></div>
                        <p className="text-sm text-steel-400">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, idx) => (
                    <tr key={record.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-mono text-primary-600 whitespace-nowrap">{record.projectNo}</td>
                      <td className="px-4 py-3 text-sm text-steel-800 max-w-xs"><span className="line-clamp-2">{record.projectName}</span></td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.projectType}</td>
                      <td className="px-4 py-3 text-sm font-mono text-steel-700 whitespace-nowrap">{record.contractNo}</td>
                      <td className="px-4 py-3 text-sm text-steel-800 max-w-xs"><span className="line-clamp-2">{record.contractName}</span></td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.contractType}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.businessUnit}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.constructionUnit}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 text-center font-bold">{record.totalDeductionScore}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 text-center font-medium">{record.totalIssues}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">{record.resolvedIssues}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">{record.pendingIssues}</span>
                      </td>
                      <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                        <div className="flex items-center justify-center">
                          <button onClick={() => handleViewIssues(record)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                            <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-list-line" /></div>
                            问题列表
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

      {/* 问题清单弹窗 */}
      {issueListOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIssueListOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[95vw] max-w-[1400px] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-steel-200">
              <div>
                <h2 className="text-lg font-semibold text-steel-900">问题清单</h2>
                <p className="text-xs text-steel-400 mt-0.5">展示所有合同下已发起的质量安全问题列表</p>
              </div>
              <button onClick={() => setIssueListOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
                <i className="ri-close-line text-lg text-steel-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto px-6 py-4">
              <table className="w-full text-left" style={{ minWidth: '1500px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">序号</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '200px' }}>合同名称</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">合同编号</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">问题编号</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">问题类型</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">发起人</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">发起单位</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">发起时间</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">问题等级</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">整改期限</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '240px' }}>问题描述</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">状态</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap text-center" style={{ minWidth: '140px' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {issueListPaginated.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-16 text-center">
                        <p className="text-sm text-steel-400">暂无问题数据</p>
                      </td>
                    </tr>
                  ) : (
                    issueListPaginated.map((issue, idx) => (
                      <tr key={issue.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2.5 text-sm text-steel-500">{(issueListPage - 1) * issueListPageSize + idx + 1}</td>
                        <td className="px-3 py-2.5 text-sm text-steel-700 max-w-xs"><span className="line-clamp-1">{issue.contractName}</span></td>
                        <td className="px-3 py-2.5 text-sm font-mono text-steel-600 whitespace-nowrap">{issue.contractNo}</td>
                        <td className="px-3 py-2.5 text-sm font-mono text-primary-600 whitespace-nowrap">{issue.issueNo}</td>
                        <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{issue.issueType}</td>
                        <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{issue.initiator}</td>
                        <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{issue.initiatorUnit}</td>
                        <td className="px-3 py-2.5 text-sm text-steel-500 whitespace-nowrap">{issue.createTime}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${issue.issueLevel === '重大' ? 'bg-red-50 text-red-700 border border-red-200' : issue.issueLevel === '较大' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                            {issue.issueLevel}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-sm text-steel-500 whitespace-nowrap">{issue.deadline}</td>
                        <td className="px-3 py-2.5 text-sm text-steel-700 max-w-xs"><span className="line-clamp-2">{issue.description}</span></td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getIssueStatusStyle(issue.status)}`}>{issue.status}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => { navigate(`/project-execute/quality-safety/issues?contractId=${issue.contractId}&contractName=${encodeURIComponent(issue.contractName)}&contractNo=${encodeURIComponent(issue.contractNo)}`); setIssueListOpen(false); }} className="flex items-center gap-0.5 px-2 py-1 text-xs text-primary-600 border border-primary-200 rounded hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap">
                              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-eye-line" /></div>
                              查看详情
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {allIssuesMemo.length > 0 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-steel-200">
                <div className="flex items-center gap-3 text-sm text-steel-500">
                  <span>共 <span className="font-medium text-steel-700">{allIssuesMemo.length}</span> 条</span>
                  <span>第 <span className="font-medium text-steel-700">{issueListPage}</span>/{issueListTotalPages} 页</span>
                  <select value={issueListPageSize} onChange={(e) => { setIssueListPageSize(Number(e.target.value)); setIssueListPage(1); }} className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none">
                    <option value={10}>10条/页</option>
                    <option value={20}>20条/页</option>
                    <option value={50}>50条/页</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setIssueListPage(1)} disabled={issueListPage === 1} className="w-7 h-7 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">首页</button>
                  <button onClick={() => setIssueListPage((p) => Math.max(1, p - 1))} disabled={issueListPage === 1} className="w-7 h-7 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-left-s-line" /></button>
                  {renderIssuePagination().map((page, i) =>
                    page === '...' ? (
                      <span key={`idot-${i}`} className="w-7 h-7 flex items-center justify-center text-steel-400 text-sm">...</span>
                    ) : (
                      <button key={page} onClick={() => setIssueListPage(page as number)} className={`w-7 h-7 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${issueListPage === page ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`} style={issueListPage === page ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}>{page}</button>
                    )
                  )}
                  <button onClick={() => setIssueListPage((p) => Math.min(issueListTotalPages, p + 1))} disabled={issueListPage === issueListTotalPages} className="w-7 h-7 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-right-s-line" /></button>
                  <button onClick={() => setIssueListPage(issueListTotalPages)} disabled={issueListPage === issueListTotalPages} className="w-7 h-7 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">末页</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}