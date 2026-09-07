import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { epcContracts } from '@/mocks/epcEquipmentMocks';

export default function EpcEquipmentListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ contractNo: '', contractName: '' });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(() => {
    return epcContracts.filter((c) => {
      if (searchParams.contractNo && !c.contractNo.includes(searchParams.contractNo)) return false;
      if (searchParams.contractName && !c.contractName.includes(searchParams.contractName)) return false;
      return true;
    }).sort((a, b) => b.contractNo.localeCompare(a.contractNo));
  }, [searchParams]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = () => setPage(1);
  const handleReset = () => { setSearchParams({ contractNo: '', contractName: '' }); setPage(1); };

  const colContractNoW = 170;
  const colContractNameW = 260;
  const leftSecond = colContractNoW;
  const colActionsW = 220;

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h1 className="text-lg font-semibold text-slate-800 mb-4">EPC合同设备验收</h1>

        {/* Search Area */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同编号</span>
            <input type="text" value={searchParams.contractNo} onChange={(e) => setSearchParams({ ...searchParams, contractNo: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-44 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同名称</span>
            <input type="text" value={searchParams.contractName} onChange={(e) => setSearchParams({ ...searchParams, contractName: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-52 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <button onClick={handleSearch} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-search-line" /></div>查询
          </button>
          <button onClick={handleReset} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap flex items-center gap-1">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>重置
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 340px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colContractNoW}px` }}>合同编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: `${leftSecond}px`, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colContractNameW}px` }}>合同名称</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>申报设备数量</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>已通过设备数量</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>已驳回设备数量</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>待审核设备数量</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '90px' }}>状态</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{row.contractNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: `${leftSecond}px`, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{row.contractName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-center font-medium">{row.totalDevices}</td>
                  <td className="px-3 py-2.5 text-sm text-emerald-600 whitespace-nowrap text-center font-medium">{row.clientPassed}</td>
                  <td className="px-3 py-2.5 text-sm text-red-600 whitespace-nowrap text-center font-medium">{row.clientRejected}</td>
                  <td className="px-3 py-2.5 text-sm text-amber-600 whitespace-nowrap text-center font-medium">{row.clientPending}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">{row.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => navigate(`/project-contract/epc-equipment/review?contractId=${row.id}`)} className="px-2.5 py-1 text-xs rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' }}>
                        <div className="w-3 h-3 flex items-center justify-center"><i className="ri-check-double-line" /></div>审核
                      </button>
                      <button onClick={() => navigate(`/project-contract/epc-equipment/detail?contractId=${row.id}`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
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

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-slate-500">共 {filtered.length} 条</div>
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