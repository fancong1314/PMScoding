import { useMemo, useState } from 'react';
import Layout from '@/components/feature/Layout';
import {
  frameworkContractRecords,
  frameworkContractStatusMap,
  frameworkContractStatusOptions,
  frameworkSuppliers,
  type FrameworkContractRecord,
  type FrameworkContractStatus,
} from '@/mocks/sporadicProjectMocks';
import ListPagination from '../components/ListPagination';

export default function FrameworkContractPage() {
  const [filterNo, setFilterNo] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterStatus, setFilterStatus] = useState<FrameworkContractStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const matched = useMemo(() => {
    return frameworkContractRecords.filter((r) => {
      if (filterNo && !r.contractNo.includes(filterNo)) return false;
      if (filterName && !r.contractName.includes(filterName)) return false;
      if (filterSupplier && r.supplierName !== filterSupplier) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      return true;
    });
  }, [filterNo, filterName, filterSupplier, filterStatus]);

  const emptyHint = matched.length === 0;
  const filtered = emptyHint ? frameworkContractRecords : matched;
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageOffset, pageOffset + pageSize);

  const handleReset = () => {
    setFilterNo('');
    setFilterName('');
    setFilterSupplier('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  const inputCls =
    'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';
  const thCls = 'px-3 py-2.5 text-xs font-semibold text-steel-500 text-left whitespace-nowrap';
  const tdCls = 'px-3 py-2.5 text-sm text-steel-700';

  return (
    <Layout>
      <div className="space-y-3">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">框架合同管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理5万以内零星施工工程的框架合同（当前仅支持列表查看）</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">合同编号</label>
              <input value={filterNo} onChange={(e) => setFilterNo(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">合同名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">供应商</label>
              <select value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部供应商</option>
                {frameworkSuppliers.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">合同状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FrameworkContractStatus | '')}
                className={inputCls + ' cursor-pointer'}
              >
                {frameworkContractStatusOptions.map((o) => (
                  <option key={o.value || 'all'} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-steel-100">
            <button type="button" onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              <i className="ri-refresh-line" />重置
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
            >
              <i className="ri-search-line" />查询
            </button>
          </div>
        </div>

        {emptyHint && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
            未匹配到筛选结果，已回退展示全部框架合同演示数据
          </div>
        )}

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-steel-200" style={{ backgroundColor: '#f8fafc' }}>
                  <th className={`${thCls} w-12 text-center`}>序号</th>
                  <th className={thCls}>合同编号</th>
                  <th className={thCls}>合同名称</th>
                  <th className={thCls}>供应商</th>
                  <th className={thCls}>供应商编号</th>
                  <th className={thCls}>主要内容</th>
                  <th className={thCls}>订约日期</th>
                  <th className={`${thCls} text-center`}>合同状态</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r: FrameworkContractRecord, idx) => {
                  const st = frameworkContractStatusMap[r.status];
                  return (
                    <tr key={r.id} className="border-b border-steel-100 hover:bg-slate-50/80 transition-colors">
                      <td className={`${tdCls} text-center text-steel-400 text-xs`}>{pageOffset + idx + 1}</td>
                      <td className={`${tdCls} whitespace-nowrap font-mono text-xs text-primary-700`}>{r.contractNo}</td>
                      <td className={`${tdCls} font-medium max-w-[240px]`}>
                        <span className="line-clamp-2 leading-5" title={r.contractName}>{r.contractName}</span>
                      </td>
                      <td className={`${tdCls} whitespace-nowrap`}>{r.supplierName}</td>
                      <td className={`${tdCls} whitespace-nowrap font-mono text-xs text-steel-500`}>{r.supplierNo}</td>
                      <td className={`${tdCls} max-w-[280px]`}>
                        <span className="line-clamp-2 leading-5 text-steel-600" title={r.mainContent}>{r.mainContent}</span>
                      </td>
                      <td className={`${tdCls} whitespace-nowrap text-steel-600`}>{r.signDate}</td>
                      <td className={`${tdCls} text-center whitespace-nowrap`}>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${st.cls}`}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ListPagination
            total={filtered.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          />
        </div>
      </div>
    </Layout>
  );
}
