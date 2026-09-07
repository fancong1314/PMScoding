import Layout from '@/components/feature/Layout';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { estimateProjects } from '@/mocks/estimateManagementMocks';

const projectTypes = ['请选择...', 'A质量品种', 'B安全环保', 'C节能降耗', 'D工艺装备', 'E智能制造', 'F信息化'];
const ownerUnits = ['请选择...', '炼铁事业部', '炼钢事业部', '轧钢事业部', '能源环保部', '设备部', '安全能环部', '技术中心'];

export default function EstimateListPage() {
  const navigate = useNavigate();
  const [approvalNo, setApprovalNo] = useState('');
  const [projectName, setProjectName] = useState('');
  const [planNo, setPlanNo] = useState('');
  const [projectType, setProjectType] = useState('请选择...');
  const [ownerUnit, setOwnerUnit] = useState('请选择...');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let data = [...estimateProjects];
    data.sort((a, b) => b.approvalDate.localeCompare(a.approvalDate));
    if (approvalNo) data = data.filter((p) => p.approvalNo.includes(approvalNo));
    if (projectName) data = data.filter((p) => p.name.includes(projectName));
    if (planNo) data = data.filter((p) => p.planNo.includes(planNo));
    if (projectType !== '请选择...') data = data.filter((p) => p.projectType === projectType);
    if (ownerUnit !== '请选择...') data = data.filter((p) => p.ownerUnit === ownerUnit);
    if (dateStart) data = data.filter((p) => p.approvalDate >= dateStart);
    if (dateEnd) data = data.filter((p) => p.approvalDate <= dateEnd);
    return data;
  }, [approvalNo, projectName, planNo, projectType, ownerUnit, dateStart, dateEnd]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? pageData.map((p) => p.id) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((sid) => sid !== id)));
  };

  const handleRowClick = (id: string) => {
    navigate(`/project-prepare/estimate-management/detail?projectId=${id}`);
  };

  const handleQuery = () => {
    setPage(1);
  };

  const formatAmount = (v: number) => v.toLocaleString('zh-CN');

  return (
    <Layout>
    <div className="space-y-4">
      {/* Query Panel */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">立项号</label>
            <input type="text" value={approvalNo} onChange={(e) => setApprovalNo(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400" placeholder="请输入立项号" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">项目名称</label>
            <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400" placeholder="请输入项目名称" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">年度计划号</label>
            <input type="text" value={planNo} onChange={(e) => setPlanNo(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400" placeholder="请输入年度计划号" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">项目类型</label>
            <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400 bg-white">
              {projectTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">业主单位</label>
            <select value={ownerUnit} onChange={(e) => setOwnerUnit(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400 bg-white">
              {ownerUnits.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">立项日期</label>
            <div className="flex items-center gap-1">
              <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400" />
              <span className="text-slate-400 text-sm">~</span>
              <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400" />
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={handleQuery} className="px-5 py-2 text-sm font-medium rounded-md text-white whitespace-nowrap cursor-pointer" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
                <i className="ri-search-line" />
              </div>
              查询
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="sticky left-0 top-0 z-30 bg-slate-50 px-3 py-3 w-10 text-left font-medium text-slate-600 border-r border-slate-200">
                  <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={pageData.length > 0 && pageData.every((p) => selectedIds.includes(p.id))} className="w-4 h-4 cursor-pointer" />
                </th>
                <th className="sticky left-10 top-0 z-30 bg-slate-50 px-3 py-3 w-[120px] text-left font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap">
                  立项号
                </th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">年度计划号</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">项目名称</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">立项说明</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">项目类型</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">立项金额(元)</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">预立项金额(元)</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">实际立项金额(元)</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">原始合同金额(元)</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">修正合同金额(元)</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">完工金额(元)</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">结算金额(元)</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">记账金额(元)</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">转固金额(元)</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">立项日期</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">业主单位</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">实施主管单位</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">项目负责人</th>
                <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">是否环保评估</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((project) => (
                <tr key={project.id} className="group border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleRowClick(project.id)}>
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 px-3 py-3 border-r border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(project.id)} onChange={(e) => handleSelectRow(project.id, e.target.checked)} className="w-4 h-4 cursor-pointer" />
                  </td>
                  <td className="sticky left-10 z-10 bg-white group-hover:bg-slate-50 px-3 py-3 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap">
                    {project.approvalNo}
                  </td>
                  <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{project.planNo}</td>
                  <td className="px-3 py-3 text-slate-700 whitespace-nowrap">{project.name}</td>
                  <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{project.description}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>{project.projectType}</span>
                  </td>
                  <td className="px-3 py-3 text-right text-slate-700 font-mono whitespace-nowrap">{formatAmount(project.budgetAmount)}</td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.preBudgetAmount)}</td>
                  <td className="px-3 py-3 text-right text-slate-700 font-mono font-medium whitespace-nowrap">{formatAmount(project.actualBudgetAmount)}</td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.originalContractAmount)}</td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.revisedContractAmount)}</td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.completedAmount)}</td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.settledAmount)}</td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.accountedAmount)}</td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.fixedAmount)}</td>
                  <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{project.approvalDate}</td>
                  <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{project.ownerUnit}</td>
                  <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{project.implementUnit}</td>
                  <td className="px-3 py-3 text-slate-700 font-medium whitespace-nowrap">{project.projectManager}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${project.isEnvAssessment ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{project.isEnvAssessment ? '是' : '否'}</span>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={20} className="px-3 py-8 text-center text-slate-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>共 {total} 条</span>
            <span>每页</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-2 py-1 text-sm border border-slate-200 rounded bg-white">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>条</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50">首页</button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50">上一页</button>
            <span className="px-3 py-1.5 text-sm text-slate-600">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50">下一页</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50">末页</button>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}