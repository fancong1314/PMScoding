import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { researchConfirmList } from '@/mocks/itAcceptanceMocks';

const inputCls = 'px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

export default function ResearchConfirmListPage() {
  const navigate = useNavigate();

  const [searchProjectType, setSearchProjectType] = useState('');
  const [searchCreator, setSearchCreator] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const projectTypes = useMemo(() => {
    const types = new Set(researchConfirmList.map((r) => r.projectType));
    return Array.from(types);
  }, []);

  const filtered = useMemo(() => {
    return researchConfirmList
      .filter((r) => {
        if (searchProjectType && r.projectType !== searchProjectType) return false;
        if (searchCreator && !r.creator.includes(searchCreator)) return false;
        return true;
      })
      .sort((a, b) => b.createDate.localeCompare(a.createDate));
  }, [searchProjectType, searchCreator]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchProjectType(''); setSearchCreator(''); setCurrentPage(1); };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">数研院确认列表</h1>
            <p className="text-xs text-steel-400 mt-0.5">对已通过审批流程的验收申请进行确认</p>
          </div>
          <button onClick={() => navigate('/project-execute/it-acceptance')} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回验收申请列表
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap">项目类型</label>
              <select value={searchProjectType} onChange={(e) => setSearchProjectType(e.target.value)} className={inputCls + ' cursor-pointer'} style={{ width: '180px' }}>
                <option value="">全部</option>
                {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap">创建人</label>
              <input type="text" value={searchCreator} onChange={(e) => setSearchCreator(e.target.value)} placeholder="模糊查询" className={inputCls} style={{ width: '180px' }} />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setCurrentPage(1); }} className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ backgroundColor: '#10b981' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>查询
              </button>
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>重置
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">待确认验收申请</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1100px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '220px' }}>项目名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">验收类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">创建人</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">创建日期</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center" style={{ minWidth: '120px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, idx) => (
                  <tr key={r.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-primary-600 font-mono whitespace-nowrap">{r.projectNo}</td>
                    <td className="px-4 py-3 text-sm text-steel-700">{r.projectName}</td>
                    <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{r.projectType}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${r.acceptanceType === '整体验收' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>{r.acceptanceType}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{r.creator}</td>
                    <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{r.createDate}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => navigate(`/project-execute/it-acceptance/confirm-form?id=${r.id}&projectNo=${r.projectNo}&projectName=${encodeURIComponent(r.projectName)}&projectType=${r.projectType}`)} className="px-3 py-1.5 text-xs text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap">验收确认</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{filtered.length}</span> 条</span>
              <span>第 <span className="font-medium text-steel-700">{currentPage}</span>/{totalPages} 页</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none">
                <option value={10}>10条/页</option><option value={20}>20条/页</option><option value={50}>50条/页</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">首页</button>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-left-s-line" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${currentPage === p ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`} style={currentPage === p ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-right-s-line" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">末页</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}