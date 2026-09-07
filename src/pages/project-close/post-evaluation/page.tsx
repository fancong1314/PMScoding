import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { postEvalProjects, type PostEvalProject } from '@/mocks/postEvaluationMocks';

export default function PostEvaluationListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    approvalNo: '', projectName: '', projectType: '', ownerUnit: '',
    isSpotCheck: '', planDateStart: '', planDateEnd: '', evalDone: '', evalFunc: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredData = useMemo(() => postEvalProjects.filter(p => {
    if (filters.approvalNo && !p.approvalNo.includes(filters.approvalNo)) return false;
    if (filters.projectName && !p.projectName.includes(filters.projectName)) return false;
    if (filters.projectType && p.projectType !== filters.projectType) return false;
    if (filters.ownerUnit && p.ownerUnit !== filters.ownerUnit) return false;
    if (filters.planDateStart && p.approvalDate < filters.planDateStart) return false;
    if (filters.planDateEnd && p.approvalDate > filters.planDateEnd) return false;
    return true;
  }), [filters]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const projectTypes = [...new Set(postEvalProjects.map(p => p.projectType))];
  const ownerUnits = [...new Set(postEvalProjects.map(p => p.ownerUnit))];

  const fmtCurrency = (n: number) => {
    if (n >= 100000000) return `${(n / 100000000).toFixed(2)}亿`;
    if (n >= 10000) return `${(n / 10000).toFixed(2)}万`;
    return n.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
  };

  const handleEnterCatalog = (p: PostEvalProject) => {
    navigate(`/project-close/post-evaluation/catalog?id=${p.id}`);
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h1 className="text-base font-semibold text-slate-800">项目后评价</h1>
          <span className="text-sm text-slate-400">共{filteredData.length}条</span>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: '立项号', value: filters.approvalNo, key: 'approvalNo' },
              { label: '项目名称', value: filters.projectName, key: 'projectName' },
            ].map(f => (
              <div key={f.key} className="flex items-center gap-2">
                <label className="text-xs text-slate-600 whitespace-nowrap w-20">{f.label}</label>
                <input type="text" value={f.value} onChange={e => { setFilters(prev => ({ ...prev, [f.key]: e.target.value })); setCurrentPage(1); }}
                  className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">项目类型</label>
              <select value={filters.projectType} onChange={e => { setFilters(prev => ({ ...prev, projectType: e.target.value })); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">全部</option>
                {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">业主单位</label>
              <select value={filters.ownerUnit} onChange={e => { setFilters(prev => ({ ...prev, ownerUnit: e.target.value })); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">全部</option>
                {ownerUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">是否抽查</label>
              <select value={filters.isSpotCheck} onChange={e => { setFilters(prev => ({ ...prev, isSpotCheck: e.target.value })); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">全部</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">后评价计划段</label>
              <div className="flex items-center gap-1 flex-1">
                <input type="date" value={filters.planDateStart} onChange={e => { setFilters(prev => ({ ...prev, planDateStart: e.target.value })); setCurrentPage(1); }}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                <span className="text-slate-400 text-xs">-</span>
                <input type="date" value={filters.planDateEnd} onChange={e => { setFilters(prev => ({ ...prev, planDateEnd: e.target.value })); setCurrentPage(1); }}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">评价完成</label>
              <select value={filters.evalDone} onChange={e => { setFilters(prev => ({ ...prev, evalDone: e.target.value })); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">全部</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">评价职能</label>
              <select value={filters.evalFunc} onChange={e => { setFilters(prev => ({ ...prev, evalFunc: e.target.value })); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">全部</option>
                <option value="项目经理">项目经理</option>
                <option value="环保评价">环保评价</option>
                <option value="安全评价">安全评价</option>
                <option value="消防评价">消防评价</option>
                <option value="节能评价">节能评价</option>
                <option value="经济效益评价">经济效益评价</option>
                <option value="社会效益评价">社会效益评价</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
            <button onClick={() => setCurrentPage(1)} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>查询
            </button>
            <button onClick={() => { setFilters({ approvalNo: '', projectName: '', projectType: '', ownerUnit: '', isSpotCheck: '', planDateStart: '', planDateEnd: '', evalDone: '', evalFunc: '' }); setCurrentPage(1); }}
              className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>重置
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['立项号','年度计划号','项目名称','立项说明','项目类型','立项金额(元)','预立项金额(元)','实际立项金额(元)','立项日期','业主单位','实施主管单位','项目经理','操作'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((p, i) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs font-medium">{p.approvalNo}</td>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs">{p.planNo}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs max-w-[160px] truncate" title={p.projectName}>{p.projectName}</td>
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs max-w-[140px] truncate" title={p.approvalDesc}>{p.approvalDesc}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${p.projectType === '技改项目' ? 'bg-sky-50 text-sky-600' : p.projectType === '环保项目' ? 'bg-emerald-50 text-emerald-600' : p.projectType === '基建项目' ? 'bg-amber-50 text-amber-600' : p.projectType === '信息化项目' ? 'bg-violet-50 text-violet-600' : 'bg-red-50 text-red-600'}`}>{p.projectType}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.approvalAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.preApprovalAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.actualApprovalAmount)}</td>
                  <td className="px-3 py-2 text-slate-500 text-center whitespace-nowrap text-xs">{p.approvalDate}</td>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs">{p.ownerUnit}</td>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs">{p.supervisorUnit}</td>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs">{p.projectManager}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <button onClick={() => handleEnterCatalog(p)}
                      className="px-2.5 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                      进入评价目录
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">每页{pageSize}条，共{filteredData.length}条</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-left-double-line" /></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-left-s-line" /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const pg = start + i;
                if (pg > totalPages) return null;
                return <button key={pg} onClick={() => setCurrentPage(pg)} className={`w-7 h-7 flex items-center justify-center text-xs border rounded cursor-pointer ${pg === currentPage ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-medium' : 'border-slate-300 hover:bg-slate-100'}`}>{pg}</button>;
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-right-s-line" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-right-double-line" /></button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}