import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { contracts, formatCurrency } from '@/mocks/contractExecutionMocks';

export default function ContractExecutionListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    approvalNo: '',
    contractAmountMin: '',
    contractAmountMax: '',
    contractType: '',
    contractStatus: '',
    contractNo: '',
    contractorNo: '',
    contractName: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const contractTypes = ['施工总承包', '专业分包', '劳务分包', '设备采购', '设计合同', '监理合同', '咨询合同', 'EPC总承包'];
  const contractStatuses = ['执行中', '已完工', '已结算', '已暂停', '已终止', '草稿'];

  const handleSearch = () => { setPage(1); };
  const handleReset = () => {
    setSearchParams({
      approvalNo: '', contractAmountMin: '', contractAmountMax: '',
      contractType: '', contractStatus: '', contractNo: '',
      contractorNo: '', contractName: '', startDate: '', endDate: '',
    });
    setPage(1);
  };

  const filtered = contracts.filter((c) => {
    if (searchParams.approvalNo && !c.approvalNo.includes(searchParams.approvalNo)) return false;
    if (searchParams.contractAmountMin && c.contractAmount < Number(searchParams.contractAmountMin)) return false;
    if (searchParams.contractAmountMax && c.contractAmount > Number(searchParams.contractAmountMax)) return false;
    if (searchParams.contractType && c.contractType !== searchParams.contractType) return false;
    if (searchParams.contractStatus && c.contractStatus !== searchParams.contractStatus) return false;
    if (searchParams.contractNo && !c.contractNo.includes(searchParams.contractNo)) return false;
    if (searchParams.contractorNo && !c.contractorNo.includes(searchParams.contractorNo)) return false;
    if (searchParams.contractName && !c.contractName.includes(searchParams.contractName)) return false;
    if (searchParams.startDate && c.contractDate < searchParams.startDate) return false;
    if (searchParams.endDate && c.contractDate > searchParams.endDate) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleRowClick = useCallback((contractId: string) => {
    navigate(`/project-contract/execution/list?contractId=${contractId}`);
  }, [navigate]);

  const columns = [
    { key: 'approvalNo', title: '立项号', width: 120 },
    { key: 'contractNo', title: '合同编号', width: 120 },
    { key: 'contractName', title: '合同名称', width: 260 },
    { key: 'contractorNo', title: '承包商编号', width: 110 },
    { key: 'contractorName', title: '承包商名称', width: 220 },
    { key: 'mainContent', title: '主要内容', width: 240 },
    { key: 'contractDate', title: '订约日期', width: 110 },
    { key: 'prepaymentPercent', title: '预付款百分比(%)', width: 110 },
    { key: 'warrantyPercent', title: '质保金百分比(%)', width: 110 },
    { key: 'paymentPercent', title: '合同付款比例(%)', width: 110 },
    { key: 'revisedAmount', title: '修正订约金额(元)', width: 140 },
    { key: 'contractStatus', title: '合同状态', width: 90 },
    { key: 'contractType', title: '合同类型', width: 100 },
  ];

  const statusBg: Record<string, string> = {
    '执行中': 'bg-emerald-50 text-emerald-700',
    '已完工': 'bg-blue-50 text-blue-700',
    '已结算': 'bg-slate-100 text-slate-700',
    '已暂停': 'bg-amber-50 text-amber-700',
    '已终止': 'bg-red-50 text-red-700',
    '草稿': 'bg-gray-50 text-gray-600',
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5 mb-4">
        <h1 className="text-lg font-semibold text-slate-800 mb-4">合同列表</h1>

        {/* Search Area */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">立项号</span>
            <div className="relative">
              <input type="text" value={searchParams.approvalNo} onChange={(e) => setSearchParams({ ...searchParams, approvalNo: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
              {searchParams.approvalNo && (
                <button onClick={() => setSearchParams({ ...searchParams, approvalNo: '' })} className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                  <i className="ri-close-circle-line" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同金额</span>
            <input type="number" value={searchParams.contractAmountMin} onChange={(e) => setSearchParams({ ...searchParams, contractAmountMin: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-32 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="最小值" />
            <span className="text-sm text-slate-400">-</span>
            <input type="number" value={searchParams.contractAmountMax} onChange={(e) => setSearchParams({ ...searchParams, contractAmountMax: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-32 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="最大值" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同类型</span>
            <select value={searchParams.contractType} onChange={(e) => setSearchParams({ ...searchParams, contractType: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-36 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              <option value="">请选择</option>
              {contractTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同状态</span>
            <select value={searchParams.contractStatus} onChange={(e) => setSearchParams({ ...searchParams, contractStatus: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-36 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              <option value="">请选择</option>
              {contractStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同编号</span>
            <input type="text" value={searchParams.contractNo} onChange={(e) => setSearchParams({ ...searchParams, contractNo: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">厂商编号</span>
            <input type="text" value={searchParams.contractorNo} onChange={(e) => setSearchParams({ ...searchParams, contractorNo: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同名称</span>
            <input type="text" value={searchParams.contractName} onChange={(e) => setSearchParams({ ...searchParams, contractName: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-48 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">签约日期</span>
            <input type="date" value={searchParams.startDate} onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-32 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            <span className="text-sm text-slate-400">至</span>
            <input type="date" value={searchParams.endDate} onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-32 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <button onClick={handleSearch} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-search-line" /></div>
            查询
          </button>
          <button onClick={handleReset} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">重置</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 360px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                {columns.map((col, idx) => (
                  <th key={col.key} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={idx < 2 ? { position: 'sticky', left: idx === 0 ? 0 : 120, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' } : undefined}>
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-50 cursor-pointer transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }} onClick={() => handleRowClick(row.id)}>
                  {columns.map((col, cIdx) => {
                    let value: React.ReactNode = (row as Record<string, unknown>)[col.key] as React.ReactNode;
                    if (col.key === 'revisedAmount') { value = formatCurrency(row.revisedAmount); }
                    if (col.key === 'contractStatus') { value = <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBg[row.contractStatus]}`}>{row.contractStatus}</span>; }
                    const isFixed = cIdx < 2;
                    return (
                      <td key={col.key} className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap" style={isFixed ? { position: 'sticky', left: cIdx === 0 ? 0 : 120, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' } : undefined}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>共 {filtered.length} 条</span>
            <span>每页</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>条</span>
          </div>
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