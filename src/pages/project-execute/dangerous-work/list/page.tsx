import { useState, useMemo } from 'react';
import Layout from '@/components/feature/Layout';
import DangerousWorkDetailModal from '../components/DangerousWorkDetailModal';
import { dangerousWorks, dangerousWorkBusinessUnits, dangerousWorkDepartments, type DangerousWork } from '@/mocks/participantManagementMocks';

export default function DangerousWorkListPage() {
  const [records] = useState<DangerousWork[]>(dangerousWorks);

  const [filterProjectName, setFilterProjectName] = useState('');
  const [filterBusinessUnit, setFilterBusinessUnit] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<DangerousWork | null>(null);
  const [toast, setToast] = useState('');

  const projectNames = useMemo(() => [...new Set(records.map((r) => r.projectName))], [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterProjectName && r.projectName !== filterProjectName) return false;
      if (filterBusinessUnit && r.businessUnit !== filterBusinessUnit) return false;
      if (filterDepartment && r.department !== filterDepartment) return false;
      return true;
    }).sort((a, b) => b.id.localeCompare(a.id));
  }, [records, filterProjectName, filterBusinessUnit, filterDepartment]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setFilterProjectName('');
    setFilterBusinessUnit('');
    setFilterDepartment('');
    setCurrentPage(1);
  };

  const handleSync = () => {
    setToast('数据同步成功，已更新最新危险作业数据');
    setTimeout(() => setToast(''), 3000);
  };

  const handleViewDetail = (work: DangerousWork) => {
    setSelectedWork(work);
    setDetailOpen(true);
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
  const selectCls = inputCls + ' cursor-pointer';

  return (
    <Layout>
      <div className="space-y-4">
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>
            {toast}
          </div>
        )}

        <div>
          <h1 className="text-lg font-semibold text-steel-900">危险作业管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">外部系统推送的危险作业数据管理与同步</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目名称</label>
              <select value={filterProjectName} onChange={(e) => { setFilterProjectName(e.target.value); setCurrentPage(1); }} className={selectCls}>
                <option value="">全部</option>
                {projectNames.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">所属事业部</label>
              <select value={filterBusinessUnit} onChange={(e) => { setFilterBusinessUnit(e.target.value); setCurrentPage(1); }} className={selectCls}>
                <option value="">全部</option>
                {dangerousWorkBusinessUnits.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">所属部门</label>
              <select value={filterDepartment} onChange={(e) => { setFilterDepartment(e.target.value); setCurrentPage(1); }} className={selectCls}>
                <option value="">全部</option>
                {dangerousWorkDepartments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
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

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">危险作业列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSync} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-refresh-line" /></div>
                数据同步
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-success-600 border border-success-200 rounded-md hover:bg-success-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-excel-line" /></div>
                导出
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1100px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">所属事业部</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">所属部门</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">日期</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '180px' }}>危险源</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '260px' }}>危险作业内容</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: '100px', borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
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
                      <td className="px-4 py-3 text-sm text-primary-600 font-medium whitespace-nowrap">{record.projectName}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{record.businessUnit}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.department}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.startTime.slice(0, 10)}</td>
                      <td className="px-4 py-3 text-sm text-red-600 whitespace-nowrap">{record.hazardSource}</td>
                      <td className="px-4 py-3 text-sm text-steel-700"><span className="line-clamp-1">{record.workContent}</span></td>
                      <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                        <div className="flex items-center justify-center">
                          <button onClick={() => handleViewDetail(record)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                            <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-eye-line" /></div>
                            详情
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

      <DangerousWorkDetailModal
        open={detailOpen}
        work={selectedWork}
        onClose={() => setDetailOpen(false)}
      />
    </Layout>
  );
}