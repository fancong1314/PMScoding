import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  contractDocuments,
  contractDocTypes,
  contractDocStatuses,
  formatCurrency,
} from '@/mocks/contractDocumentMocks';

export default function ContractDocumentListPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    approvalNo: '',
    amountMin: '',
    amountMax: '',
    contractType: '',
    contractStatus: '',
    contractNo: '',
    contractorNo: '',
    contractName: '',
    signDateStart: '',
    signDateEnd: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [toast, setToast] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      approvalNo: '',
      amountMin: '',
      amountMax: '',
      contractType: '',
      contractStatus: '',
      contractNo: '',
      contractorNo: '',
      contractName: '',
      signDateStart: '',
      signDateEnd: '',
    });
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return contractDocuments.filter(c => {
      if (filters.approvalNo && !c.approvalNo.includes(filters.approvalNo)) return false;
      if (filters.amountMin && c.contractAmount < Number(filters.amountMin)) return false;
      if (filters.amountMax && c.contractAmount > Number(filters.amountMax)) return false;
      if (filters.contractType && c.contractType !== filters.contractType) return false;
      if (filters.contractStatus && c.contractStatus !== filters.contractStatus) return false;
      if (filters.contractNo && !c.contractNo.includes(filters.contractNo)) return false;
      if (filters.contractorNo && !c.contractorNo.includes(filters.contractorNo)) return false;
      if (filters.contractName && !c.contractName.includes(filters.contractName)) return false;
      if (filters.signDateStart && c.contractDate < filters.signDateStart) return false;
      if (filters.signDateEnd && c.contractDate > filters.signDateEnd) return false;
      return true;
    }).sort((a, b) => b.contractDate.localeCompare(a.contractDate));
  }, [filters]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已确认': return 'bg-emerald-50 text-emerald-700';
      case '待确认': return 'bg-amber-50 text-amber-700';
      case '已结案': return 'bg-blue-50 text-blue-700';
      case '已核销': return 'bg-violet-50 text-violet-700';
      case '已抛送': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getTypeStyle = (type: string) => {
    if (type === '合同开工') return 'bg-sky-50 text-sky-700';
    if (type === '合同交工') return 'bg-teal-50 text-teal-700';
    if (type === '合同竣工') return 'bg-indigo-50 text-indigo-700';
    if (type === '结算进口') return 'bg-orange-50 text-orange-700';
    if (type === '结算出口') return 'bg-rose-50 text-rose-700';
    return 'bg-slate-50 text-slate-600';
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    showToast('删除成功');
    setDeleteConfirmId('');
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-slate-800">合同资料管理</h1>
            <span className="text-sm text-slate-400">资料共{filteredData.length}笔</span>
          </div>
          <button
            onClick={() => navigate('/project-contract/document/form?mode=add')}
            className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line" />
            </div>
            新增
          </button>
        </div>

        {/* Search Filters */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">立项号</label>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={filters.approvalNo}
                  onChange={(e) => handleFilterChange('approvalNo', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                {filters.approvalNo && (
                  <button
                    onClick={() => handleFilterChange('approvalNo', '')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <i className="ri-close-circle-line text-xs" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">合同金额</label>
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="number"
                  value={filters.amountMin}
                  onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                  placeholder="起"
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  value={filters.amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                  placeholder="止"
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">合同类型</label>
              <select
                value={filters.contractType}
                onChange={(e) => handleFilterChange('contractType', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">请选择</option>
                {contractDocTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">合同状态</label>
              <select
                value={filters.contractStatus}
                onChange={(e) => handleFilterChange('contractStatus', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">请选择</option>
                {contractDocStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">合同编号</label>
              <input
                type="text"
                value={filters.contractNo}
                onChange={(e) => handleFilterChange('contractNo', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">厂商编号</label>
              <input
                type="text"
                value={filters.contractorNo}
                onChange={(e) => handleFilterChange('contractorNo', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">合同名称</label>
              <input
                type="text"
                value={filters.contractName}
                onChange={(e) => handleFilterChange('contractName', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">签约日期</label>
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="date"
                  value={filters.signDateStart}
                  onChange={(e) => handleFilterChange('signDateStart', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="date"
                  value={filters.signDateEnd}
                  onChange={(e) => handleFilterChange('signDateEnd', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line" />
              </div>
              查询
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-refresh-line" />
              </div>
              重置
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="sticky left-0 bg-slate-50 z-10 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[110px]">立项号</th>
                  <th className="sticky left-[110px] bg-slate-50 z-10 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">合同编号</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[200px]">合同名称</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[90px]">合同类型</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[110px]">承包商编号</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[180px]">主要内容</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[100px]">订约日期</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">合同金额(元)</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">甲供材金额(元)</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[85px]">合同状态</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[110px]">决算进口日期</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">决算进口金额</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[110px]">决算出口日期</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">决算出口金额</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[110px]">合计</th>
                  <th className="sticky right-0 bg-slate-50 z-10 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[280px]">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer" style={{ borderBottom: '1px solid #f1f5f9' }} onClick={() => navigate(`/project-contract/document/form?mode=edit&contractId=${c.id}`)}>
                    <td className="sticky left-0 bg-white z-10 px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{c.approvalNo}</td>
                    <td className="sticky left-[110px] bg-white z-10 px-3 py-2 text-slate-700 whitespace-nowrap text-xs font-medium">{c.contractNo}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{c.contractName}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${getTypeStyle(c.contractType)}`}>{c.contractType}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{c.contractorNo}</td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap text-xs max-w-[200px] overflow-hidden text-ellipsis">{c.mainContent}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{c.contractDate}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(c.contractAmount)}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(c.materialAmount)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusStyle(c.contractStatus)}`}>{c.contractStatus}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs">{c.settlementImportDate || '-'}</td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs text-right font-mono">{c.settlementImportAmount ? formatCurrency(c.settlementImportAmount) : '-'}</td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs">{c.settlementExportDate || '-'}</td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs text-right font-mono">{c.settlementExportAmount ? formatCurrency(c.settlementExportAmount) : '-'}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono font-medium">{formatCurrency(c.contractAmount + c.materialAmount)}</td>
                    <td className="sticky right-0 bg-white z-10 px-3 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/project-contract/document/form?mode=edit&contractId=${c.id}`)}
                          className="px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50 cursor-pointer whitespace-nowrap"
                        >
                          修改
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap"
                        >
                          删除
                        </button>
                        <button
                          onClick={() => navigate(`/project-contract/document/amount-change?contractId=${c.id}`)}
                          className="px-2 py-1 text-xs text-amber-600 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer whitespace-nowrap"
                        >
                          金额异动
                        </button>
                        <button
                          onClick={() => navigate(`/project-contract/document/material-change?contractId=${c.id}`)}
                          className="px-2 py-1 text-xs text-violet-600 border border-violet-200 rounded hover:bg-violet-50 cursor-pointer whitespace-nowrap"
                        >
                          甲供材异动
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={16} className="px-3 py-10 text-center text-slate-400 text-sm">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">每页{pageSize}条，共{filteredData.length}条</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"
              >
                <i className="ri-arrow-left-double-line" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"
              >
                <i className="ri-arrow-left-s-line" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const p = start + i;
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 flex items-center justify-center text-xs border rounded cursor-pointer ${p === currentPage ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-medium' : 'border-slate-300 hover:bg-slate-100'}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"
              >
                <i className="ri-arrow-right-s-line" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"
              >
                <i className="ri-arrow-right-double-line" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirmId('')}>
          <div className="bg-white rounded-lg shadow-lg w-[400px] max-w-[90vw] p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <i className="ri-question-line text-red-500 text-lg" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">确认删除</h3>
                <p className="text-sm text-slate-500">确定删除该合同资料？删除后不可恢复。</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setDeleteConfirmId('')} className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm rounded-md text-white cursor-pointer" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>
      )}
    </Layout>
  );
}