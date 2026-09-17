import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { projects } from '@/mocks/projectPrepareMocks';

export default function ProjectApprovalListPage() {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    if (!searchKey.trim()) return [...projects];
    const kw = searchKey.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.approvalNo.toLowerCase().includes(kw)
    );
  }, [searchKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchKey('');
    setCurrentPage(1);
  }, []);

  const handleRowClick = useCallback(
    (projectId: string) => {
      navigate(`/project-prepare/approval/stage?projectId=${projectId}`);
    },
    [navigate]
  );

  return (
    <Layout>
      <div className="space-y-4">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-steel-900">项目报批报建管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理各项目的报批报建阶段及附件</p>
        </div>

        {/* Search Area */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs text-steel-500 whitespace-nowrap">项目名称/编号</span>
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50"
                  placeholder="搜索 项目名称/编号"
                />
                {searchKey && (
                  <button
                    onClick={() => setSearchKey('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"
                  >
                    <i className="ri-close-circle-line" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-refresh-line" />
                </div>
                重置
              </button>
              <button
                onClick={handleSearch}
                className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line" />
                </div>
                查询
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">项目列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '900px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-16 sticky left-0 bg-slate-50 z-10" style={{ borderRight: '1px solid #e8edf3' }}>
                    序号
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky left-16 bg-slate-50 z-10" style={{ minWidth: '280px', borderRight: '1px solid #e8edf3' }}>
                    项目名称
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">建设单位</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目经理</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center z-10" style={{ minWidth: '120px', borderLeft: '1px solid #e8edf3' }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100">
                          <i className="ri-file-list-3-line text-2xl text-steel-300" />
                        </div>
                        <p className="text-sm text-steel-400">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((project, idx) => (
                    <tr
                      key={project.id}
                      className="border-b border-steel-100 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(project.id)}
                    >
                      <td className="px-4 py-3 text-sm text-steel-500 sticky left-0 bg-white z-10 whitespace-nowrap" style={{ borderRight: '1px solid #e8edf3' }}>
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-800 font-medium sticky left-16 bg-white z-10 whitespace-nowrap" style={{ borderRight: '1px solid #e8edf3', maxWidth: '320px' }}>
                        <span className="truncate block">{project.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-600 font-mono whitespace-nowrap">{project.approvalNo}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{project.constructionUnit}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{project.projectType}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{project.manager}</td>
                      <td className="px-4 py-3 sticky right-0 bg-white z-10" style={{ borderLeft: '1px solid #e8edf3' }}>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(project.id);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                          >
                            <div className="w-3.5 h-3.5 flex items-center justify-center">
                              <i className="ri-building-2-line" />
                            </div>
                            报批报建
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

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>
                共 <span className="font-medium text-steel-700">{filtered.length}</span> 条
              </span>
              <span>
                第 <span className="font-medium text-steel-700">{currentPage}</span>/{totalPages} 页
              </span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none"
              >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs"
              >
                首页
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-arrow-left-s-line" />
              </button>
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (currentPage <= 4) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + i;
                } else {
                  page = currentPage - 3 + i;
                }
                if (page < 1 || page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'text-white'
                        : 'border border-steel-200 text-steel-600 hover:bg-slate-50'
                    }`}
                    style={currentPage === page ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-arrow-right-s-line" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs"
              >
                末页
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}