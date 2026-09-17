import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { overdueContracts, contractTypes, contractStatuses, amountRanges, overdueOptions, formatCurrency } from '@/mocks/contractOverdueMocks';

export default function OverdueContractListPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    approvalNo: '',
    contractNo: '',
    contractName: '',
    contractorNo: '',
    contractType: '',
    contractStatus: '',
    amountRange: '',
    overdueStatus: '',
    signDateStart: '',
    signDateEnd: '',
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let result = [...overdueContracts];
    if (filters.approvalNo) result = result.filter((c) => c.approvalNo.includes(filters.approvalNo));
    if (filters.contractNo) result = result.filter((c) => c.contractNo.includes(filters.contractNo));
    if (filters.contractName) result = result.filter((c) => c.contractName.includes(filters.contractName));
    if (filters.contractorNo) result = result.filter((c) => c.contractorNo.includes(filters.contractorNo));
    if (filters.contractType) result = result.filter((c) => c.contractType === filters.contractType);
    if (filters.contractStatus) result = result.filter((c) => c.contractStatus === filters.contractStatus);
    if (filters.overdueStatus === 'yes') result = result.filter((c) => c.hasOverdueApp);
    if (filters.overdueStatus === 'no') result = result.filter((c) => !c.hasOverdueApp);
    if (filters.amountRange) {
      const [min, max] = filters.amountRange.split('-');
      const minVal = parseInt(min) * 10000;
      const maxVal = max === '+' ? Infinity : parseInt(max) * 10000;
      result = result.filter((c) => c.contractAmount >= minVal && c.contractAmount <= maxVal);
    }
    if (filters.signDateStart) result = result.filter((c) => c.signDate >= filters.signDateStart);
    if (filters.signDateEnd) result = result.filter((c) => c.signDate <= filters.signDateEnd);
    result.sort((a, b) => b.approvalNo.localeCompare(a.approvalNo));
    return result;
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleReset = () => {
    setFilters({
      approvalNo: '', contractNo: '', contractName: '', contractorNo: '',
      contractType: '', contractStatus: '', amountRange: '', overdueStatus: '',
      signDateStart: '', signDateEnd: '',
    });
    setPage(1);
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Title */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #e8edf3' }}>
          <h1 className="text-lg font-semibold text-slate-800">合同超期申请</h1>
        </div>

        {/* Search */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #e8edf3' }}>
          <div className="grid grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">立项号</span>
              <div className="flex-1 relative">
                <input type="text" value={filters.approvalNo} onChange={(e) => { setFilters({ ...filters, approvalNo: e.target.value }); setPage(1); }} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入立项号" />
                {filters.approvalNo && (
                  <button onClick={() => { setFilters({ ...filters, approvalNo: '' }); setPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                    <i className="ri-close-circle-line text-xs" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同编号</span>
              <input type="text" value={filters.contractNo} onChange={(e) => { setFilters({ ...filters, contractNo: e.target.value }); setPage(1); }} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入合同编号" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同名称</span>
              <input type="text" value={filters.contractName} onChange={(e) => { setFilters({ ...filters, contractName: e.target.value }); setPage(1); }} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入合同名称" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同类型</span>
              <select value={filters.contractType} onChange={(e) => { setFilters({ ...filters, contractType: e.target.value }); setPage(1); }} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">请选择...</option>
                {contractTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同状态</span>
              <select value={filters.contractStatus} onChange={(e) => { setFilters({ ...filters, contractStatus: e.target.value }); setPage(1); }} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">请选择...</option>
                {contractStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同金额</span>
              <select value={filters.amountRange} onChange={(e) => { setFilters({ ...filters, amountRange: e.target.value }); setPage(1); }} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                {amountRanges.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">是否超期申请</span>
              <select value={filters.overdueStatus} onChange={(e) => { setFilters({ ...filters, overdueStatus: e.target.value }); setPage(1); }} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                {overdueOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">厂商编号</span>
              <input type="text" value={filters.contractorNo} onChange={(e) => { setFilters({ ...filters, contractorNo: e.target.value }); setPage(1); }} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入厂商编号" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">签约日期</span>
              <input type="date" value={filters.signDateStart} onChange={(e) => { setFilters({ ...filters, signDateStart: e.target.value }); setPage(1); }} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              <span className="text-sm text-slate-400">—</span>
              <input type="date" value={filters.signDateEnd} onChange={(e) => { setFilters({ ...filters, signDateEnd: e.target.value }); setPage(1); }} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button onClick={() => setPage(1)} className="px-5 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>查询
            </button>
            <button onClick={handleReset} className="px-5 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>重置
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-slate-50">
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap w-20">序号</th>
                <th className="sticky left-20 z-10 bg-slate-50 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>立项号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '160px' }}>合同编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '240px' }}>合同名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>承包商编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '240px' }}>主要内容</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '80px' }}>合同状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>合同类型</th>
                <th className="sticky right-0 z-10 bg-slate-50 px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap w-32">操作</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="sticky left-0 z-10 bg-white px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="sticky left-20 z-10 bg-white px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{c.approvalNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{c.contractNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: '240px' }} title={c.contractName}>{c.contractName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{c.contractorNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: '240px' }} title={c.mainContent}>{c.mainContent}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{c.contractStatus}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{c.contractType}</td>
                  <td className="sticky right-0 z-10 bg-white px-3 py-2.5 text-center whitespace-nowrap">
                    <button onClick={() => navigate(`/project-contract/deferral/application-list?contractId=${c.id}`)} className="px-3 py-1.5 text-xs rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap mx-auto" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>
                      <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-time-line" /></div>超期申请
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-center text-sm text-slate-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #f1f5f9' }}>
            <span className="text-sm text-slate-500">共 {filtered.length} 条，第 {page}/{totalPages} 页</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(1)} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-left-double-line" /></button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-left-s-line" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer ${p === page ? 'text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'}`} style={p === page ? { background: 'linear-gradient(135deg, #3b82f6, #2563eb)' } : undefined}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-right-s-line" /></button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-right-double-line" /></button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}