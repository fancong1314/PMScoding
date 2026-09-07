import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { subcontractApplications, subcontractTypes, subcontractStatuses } from '@/mocks/subcontractMocks';

export default function SubcontractListPage() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    approvalNo: '', contractNo: '', contractName: '', signingUnit: '',
    subType: '', subUnit: '', contractStatus: '',
  });
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(() => {
    return subcontractApplications
      .filter((a) => {
        if (searchParams.approvalNo && !a.approvalNo.includes(searchParams.approvalNo)) return false;
        if (searchParams.contractNo && !a.contractNo.includes(searchParams.contractNo)) return false;
        if (searchParams.contractName && !a.contractName.includes(searchParams.contractName)) return false;
        if (searchParams.signingUnit && !a.signingUnit.includes(searchParams.signingUnit)) return false;
        if (searchParams.subType && a.subType !== searchParams.subType) return false;
        if (searchParams.subUnit && !a.subUnit.includes(searchParams.subUnit)) return false;
        if (searchParams.contractStatus && a.contractStatus !== searchParams.contractStatus) return false;
        return true;
      })
      .sort((a, b) => b.createDate.localeCompare(a.createDate));
  }, [searchParams]);

  const tabData = useMemo(() => {
    const pending = filtered.filter((a) => a.status === 'pending');
    const approved = filtered.filter((a) => a.status === 'approved');
    const rejected = filtered.filter((a) => a.status === 'rejected');
    return { pending, approved, rejected };
  }, [filtered]);

  const currentList = useMemo(() => tabData[activeTab], [tabData, activeTab]);
  const totalPages = Math.ceil(currentList.length / pageSize);
  const paginated = currentList.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = () => setPage(1);
  const handleReset = () => {
    setSearchParams({ approvalNo: '', contractNo: '', contractName: '', signingUnit: '', subType: '', subUnit: '', contractStatus: '' });
    setPage(1);
  };

  const statusColorMap: Record<string, string> = {
    '待审核': 'bg-amber-50 text-amber-700',
    '已通过': 'bg-emerald-50 text-emerald-700',
    '已驳回': 'bg-red-50 text-red-700',
  };
  const statusLabelMap: Record<string, string> = {
    pending: '待审核', approved: '已通过', rejected: '已驳回',
  };

  const colApprovalNoW = 130;
  const colContractNoW = 150;
  const leftSecond = colApprovalNoW;
  const colActionsW = 200;

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h1 className="text-lg font-semibold text-slate-800 mb-4">合同施工分包审核</h1>

        {/* Search Area */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-600 whitespace-nowrap">立项号</span>
            <input type="text" value={searchParams.approvalNo} onChange={(e) => setSearchParams({ ...searchParams, approvalNo: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-36 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同编号</span>
            <input type="text" value={searchParams.contractNo} onChange={(e) => setSearchParams({ ...searchParams, contractNo: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同名称</span>
            <input type="text" value={searchParams.contractName} onChange={(e) => setSearchParams({ ...searchParams, contractName: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-48 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-600 whitespace-nowrap">签订单位</span>
            <input type="text" value={searchParams.signingUnit} onChange={(e) => setSearchParams({ ...searchParams, signingUnit: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-44 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-600 whitespace-nowrap">分包类型</span>
            <select value={searchParams.subType} onChange={(e) => setSearchParams({ ...searchParams, subType: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-36 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              <option value="">请选择...</option>
              {subcontractTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-600 whitespace-nowrap">分包单位</span>
            <input type="text" value={searchParams.subUnit} onChange={(e) => setSearchParams({ ...searchParams, subUnit: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同状态</span>
            <select value={searchParams.contractStatus} onChange={(e) => setSearchParams({ ...searchParams, contractStatus: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-32 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              <option value="">请选择...</option>
              {subcontractStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <button onClick={handleSearch} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-search-line" /></div>查询
          </button>
          <button onClick={handleReset} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap flex items-center gap-1">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>重置
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-full p-1 w-fit">
          <button onClick={() => { setActiveTab('pending'); setPage(1); }} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'pending' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            待审核({tabData.pending.length})
          </button>
          <button onClick={() => { setActiveTab('approved'); setPage(1); }} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'approved' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            已通过({tabData.approved.length})
          </button>
          <button onClick={() => { setActiveTab('rejected'); setPage(1); }} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'rejected' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            已驳回({tabData.rejected.length})
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 420px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colApprovalNoW}px` }}>立项号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: `${leftSecond}px`, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colContractNoW}px` }}>合同编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '240px' }}>合同名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '200px' }}>签订单位</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>分包类型</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '200px' }}>分包单位</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>合同状态</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{row.approvalNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: `${leftSecond}px`, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{row.contractNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.contractName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.signingUnit}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.subType}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.subUnit}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.contractStatus === '执行中' ? 'bg-emerald-50 text-emerald-700' : row.contractStatus === '已完工' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{row.contractStatus}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      {activeTab === 'pending' && (
                        <button onClick={() => navigate(`/project-contract/subcontract/review?id=${row.id}`)} className="px-2.5 py-1 text-xs rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' }}>
                          <div className="w-3 h-3 flex items-center justify-center"><i className="ri-check-double-line" /></div>审核
                        </button>
                      )}
                      <button onClick={() => navigate(`/project-contract/subcontract/detail?id=${row.id}`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                        <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-list-3-line" /></div>查看详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-12 text-center text-sm text-slate-400">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-slate-500">共 {currentList.length} 条</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">上一页</button>
            <span className="px-3 py-1 text-sm text-slate-700">{page} / {totalPages || 1}</span>
            <button onClick={() => setPage(Math.min(totalPages || 1, page + 1))} disabled={page === totalPages || totalPages === 0} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">下一页</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}