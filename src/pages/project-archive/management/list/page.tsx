import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { archiveProjects, type ArchiveProject } from '@/mocks/archiveManagementMocks';

export default function ArchiveManagementListPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    approvalNo: '',
    projectName: '',
    projectType: '',
    archiveStatus: '',
    updateStart: '',
    updateEnd: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    return archiveProjects.filter((p) => {
      if (filters.approvalNo && !p.approvalNo.includes(filters.approvalNo)) return false;
      if (filters.projectName && !p.projectName.includes(filters.projectName)) return false;
      if (filters.projectType && p.projectType !== filters.projectType) return false;
      if (filters.archiveStatus) {
        if (filters.archiveStatus === '已归档' && p.pendingCount > 0) return false;
        if (filters.archiveStatus === '未归档' && p.archivedCount > 0) return false;
        if (filters.archiveStatus === '部分归档' && (p.pendingCount === 0 || p.archivedCount === 0)) return false;
      }
      if (filters.updateStart && p.lastUpdated < filters.updateStart) return false;
      if (filters.updateEnd && p.lastUpdated > filters.updateEnd) return false;
      return true;
    }).sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  }, [filters]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 统计
  const totalProjects = archiveProjects.length;
  const totalAttachments = archiveProjects.reduce((s, p) => s + p.attachmentTotal, 0);
  const totalArchived = archiveProjects.reduce((s, p) => s + p.archivedCount, 0);
  const avgCompleteness = archiveProjects.length > 0
    ? (archiveProjects.reduce((s, p) => s + p.completeness, 0) / archiveProjects.length)
    : 0;

  const projectTypes = [...new Set(archiveProjects.map((p) => p.projectType))];

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-slate-800">项目档案管理</h1>
            <span className="text-sm text-slate-400">共{filteredData.length}个项目</span>
          </div>
        </div>

        {/* Search Filters */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-16">立项号</label>
              <input type="text" value={filters.approvalNo}
                onChange={(e) => { setFilters({ ...filters, approvalNo: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-16">项目名称</label>
              <input type="text" value={filters.projectName}
                onChange={(e) => { setFilters({ ...filters, projectName: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-16">项目类型</label>
              <select value={filters.projectType}
                onChange={(e) => { setFilters({ ...filters, projectType: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">全部</option>
                {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-16">归档状态</label>
              <select value={filters.archiveStatus}
                onChange={(e) => { setFilters({ ...filters, archiveStatus: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">全部</option>
                <option value="已归档">已归档</option>
                <option value="未归档">未归档</option>
                <option value="部分归档">部分归档</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-16">更新时间</label>
              <div className="flex items-center gap-1 flex-1">
                <input type="date" value={filters.updateStart}
                  onChange={(e) => { setFilters({ ...filters, updateStart: e.target.value }); setCurrentPage(1); }}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                <span className="text-slate-400 text-xs">-</span>
                <input type="date" value={filters.updateEnd}
                  onChange={(e) => { setFilters({ ...filters, updateEnd: e.target.value }); setCurrentPage(1); }}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
            <button onClick={() => setCurrentPage(1)} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
              查询
            </button>
            <button onClick={() => { setFilters({ approvalNo: '', projectName: '', projectType: '', archiveStatus: '', updateStart: '', updateEnd: '' }); setCurrentPage(1); }}
              className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
              重置
            </button>
          </div>
        </div>

        {/* 统计摘要 */}
        <div className="px-5 py-4 grid grid-cols-4 gap-4 border-b border-slate-200 bg-white">
          <div className="text-center py-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}>
            <p className="text-2xl font-bold text-emerald-700">{totalProjects}</p>
            <p className="text-xs text-emerald-600 mt-1">项目总数</p>
          </div>
          <div className="text-center py-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}>
            <p className="text-2xl font-bold text-sky-700">{totalAttachments.toLocaleString()}</p>
            <p className="text-xs text-sky-600 mt-1">附件总数</p>
          </div>
          <div className="text-center py-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
            <p className="text-2xl font-bold text-emerald-700">{totalArchived.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 mt-1">已归档数</p>
          </div>
          <div className="text-center py-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #fefce8, #fef9c3)' }}>
            <p className="text-2xl font-bold text-amber-700">{avgCompleteness.toFixed(1)}%</p>
            <p className="text-xs text-amber-600 mt-1">档案完整率</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap w-14">序号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">立项号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[220px]">项目名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[100px]">项目类型</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[80px]">合同数量</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[80px]">附件总数</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[80px]">已归档数</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[80px]">待归档数</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[100px]">档案完整度</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[110px]">最近更新时间</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[100px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((p, i) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" style={{ borderBottom: '1px solid #f1f5f9' }}
                  onClick={() => navigate(`/project-archive/management/detail?projectId=${p.id}`)}>
                  <td className="px-3 py-2 text-slate-500 text-center whitespace-nowrap text-xs">{(currentPage - 1) * pageSize + i + 1}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs font-medium">{p.approvalNo}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{p.projectName}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      p.projectType === '技改项目' ? 'bg-sky-50 text-sky-600' :
                      p.projectType === '环保项目' ? 'bg-emerald-50 text-emerald-600' :
                      p.projectType === '基建项目' ? 'bg-amber-50 text-amber-600' :
                      p.projectType === '安全项目' ? 'bg-red-50 text-red-600' :
                      'bg-violet-50 text-violet-600'
                    }`}>{p.projectType}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs">{p.contractCount}</td>
                  <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs font-mono">{p.attachmentTotal}</td>
                  <td className="px-3 py-2 text-emerald-600 text-center whitespace-nowrap text-xs font-mono font-medium">{p.archivedCount}</td>
                  <td className="px-3 py-2 text-amber-600 text-center whitespace-nowrap text-xs font-mono">{p.pendingCount}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${p.completeness >= 85 ? 'bg-emerald-500' : p.completeness >= 75 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${p.completeness}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-600 w-10 text-right">{p.completeness}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs">{p.lastUpdated}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/project-archive/management/detail?projectId=${p.id}`)}
                      className="px-3 py-1.5 text-xs text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap">
                      查看档案
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">每页{pageSize}条，共{filteredData.length}条</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40">
                <i className="ri-arrow-left-double-line" />
              </button>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40">
                <i className="ri-arrow-left-s-line" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const p = start + i;
                if (p > totalPages) return null;
                return (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 flex items-center justify-center text-xs border rounded cursor-pointer ${p === currentPage ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-medium' : 'border-slate-300 hover:bg-slate-100'}`}>{p}</button>
                );
              })}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40">
                <i className="ri-arrow-right-s-line" />
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40">
                <i className="ri-arrow-right-double-line" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}