import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { designReviewProjects, type DesignReviewProject } from '@/mocks/designReviewMocks';

export default function PreliminaryDesignListPage() {
  const navigate = useNavigate();
  const [approvalNo, setApprovalNo] = useState('');
  const [projectType, setProjectType] = useState('');
  const [projectName, setProjectName] = useState('');
  const [ownerUnit, setOwnerUnit] = useState('');
  const [planNo, setPlanNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const projectTypes = ['全部', 'A质量品种', 'B安全环保', 'C节能降耗', 'D工艺装备', 'E智能制造', 'F信息化'];
  const ownerUnits = ['全部', '炼铁事业部', '炼钢事业部', '轧钢事业部', '能源环保部', '设备部', '安全能环部', '技术中心'];

  const filtered = useMemo(() => {
    let result = [...designReviewProjects];
    if (approvalNo.trim()) {
      result = result.filter((p) => p.approvalNo.toLowerCase().includes(approvalNo.toLowerCase()));
    }
    if (projectType && projectType !== '全部') {
      result = result.filter((p) => p.projectType === projectType);
    }
    if (projectName.trim()) {
      const kw = projectName.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(kw));
    }
    if (ownerUnit && ownerUnit !== '全部') {
      result = result.filter((p) => p.ownerUnit === ownerUnit);
    }
    if (planNo.trim()) {
      result = result.filter((p) => p.planNo.toLowerCase().includes(planNo.toLowerCase()));
    }
    if (startDate) {
      result = result.filter((p) => p.approvalDate >= startDate);
    }
    if (endDate) {
      result = result.filter((p) => p.approvalDate <= endDate);
    }
    return result.sort((a, b) => b.approvalDate.localeCompare(a.approvalDate));
  }, [approvalNo, projectType, projectName, ownerUnit, planNo, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((p) => p.id)));
    }
  };

  const handleNavigateEstimate = (project: DesignReviewProject) => {
    navigate(`/project-prepare/preliminary-design/estimate-review?id=${project.id}&name=${encodeURIComponent(project.name)}&approvalNo=${encodeURIComponent(project.approvalNo)}`);
  };

  const handleNavigateWBS = (project: DesignReviewProject) => {
    navigate(`/project-prepare/preliminary-design/wbs-decomposition?id=${project.id}&name=${encodeURIComponent(project.name)}&approvalNo=${encodeURIComponent(project.approvalNo)}`);
  };

  const handleReset = () => {
    setApprovalNo('');
    setProjectType('');
    setProjectName('');
    setOwnerUnit('');
    setPlanNo('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
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

  const formatMoney = (n: number) => {
    if (n === 0) return '0.00';
    return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">初步设计审查</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理已立项项目的初步设计与概算审查</p>
        </div>

        {/* 查询筛选区 */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">立项号</label>
              <input type="text" value={approvalNo} onChange={(e) => { setApprovalNo(e.target.value); setCurrentPage(1); }} className={inputCls} placeholder="支持模糊匹配" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目类型</label>
              <select value={projectType} onChange={(e) => { setProjectType(e.target.value); setCurrentPage(1); }} className={inputCls}>
                {projectTypes.map((t) => <option key={t} value={t === '全部' ? '' : t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目名称</label>
              <input type="text" value={projectName} onChange={(e) => { setProjectName(e.target.value); setCurrentPage(1); }} className={inputCls} placeholder="支持模糊匹配" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">业主单位</label>
              <select value={ownerUnit} onChange={(e) => { setOwnerUnit(e.target.value); setCurrentPage(1); }} className={inputCls}>
                {ownerUnits.map((u) => <option key={u} value={u === '全部' ? '' : u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">年度计划号</label>
              <div className="relative w-full">
                <input type="text" value={planNo} onChange={(e) => { setPlanNo(e.target.value); setCurrentPage(1); }} className={`${inputCls} pr-9`} placeholder="支持模糊匹配" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-steel-400">
                  <i className="ri-calendar-line" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">立项日期</label>
              <div className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className={`${inputCls} pr-9`} />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-steel-400 pointer-events-none">
                    <i className="ri-calendar-line" />
                  </div>
                </div>
                <span className="text-xs text-steel-400">至</span>
                <div className="relative flex-1">
                  <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className={`${inputCls} pr-9`} />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-steel-400 pointer-events-none">
                    <i className="ri-calendar-line" />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-2">
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
                重置
              </button>
              <button onClick={() => setCurrentPage(1)} className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
                查询
              </button>
            </div>
          </div>
        </div>

        {/* 数据列表 */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">项目列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
              {selectedIds.size > 0 && (
                <span className="text-xs text-primary-600 font-medium">已选 {selectedIds.size} 项</span>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1200px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={paginated.length > 0 && paginated.every((p) => selectedIds.has(p.id))}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-steel-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">年度计划号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '240px' }}>项目名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '200px' }}>立项说明</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-right">立项金额(元)</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-right">预立项金额(元)</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-right">实际立项金额(元)</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项日期</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">业主单位</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">实施主管单位</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-file-list-3-line text-2xl text-steel-300" /></div>
                        <p className="text-sm text-steel-400">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((project, idx) => (
                    <tr key={project.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(project.id)}
                          onChange={() => toggleSelect(project.id)}
                          className="w-4 h-4 rounded border-steel-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 font-mono whitespace-nowrap">{project.approvalNo}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 font-mono whitespace-nowrap">{project.planNo}</td>
                      <td className="px-4 py-3 text-sm text-steel-800 font-medium max-w-xs"><span className="line-clamp-1">{project.name}</span></td>
                      <td className="px-4 py-3 text-sm text-steel-600 max-w-xs"><span className="line-clamp-1">{project.description}</span></td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{project.projectType}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 font-mono text-right whitespace-nowrap">{formatMoney(project.budgetAmount)}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 font-mono text-right whitespace-nowrap">{formatMoney(project.preBudgetAmount)}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 font-mono text-right whitespace-nowrap">{formatMoney(project.actualBudgetAmount)}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{project.approvalDate}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{project.ownerUnit}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{project.implementUnit}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{project.projectManager}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleNavigateEstimate(project)}
                            className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5">
                              <i className="ri-calculator-line text-xs" />
                            </div>
                            概算审查
                          </button>
                          <button
                            onClick={() => handleNavigateWBS(project)}
                            className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5">
                              <i className="ri-node-tree text-xs" />
                            </div>
                            项目任务拆解
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

        {/* 分页 */}
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
    </Layout>
  );
}