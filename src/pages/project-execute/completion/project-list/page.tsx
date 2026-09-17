import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { completionProjects, projectTypes, ownerUnits } from '@/mocks/completionAcceptanceMocks';

const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

export default function CompletionProjectListPage() {
  const navigate = useNavigate();

  const [searchProjectNo, setSearchProjectNo] = useState('');
  const [searchProjectName, setSearchProjectName] = useState('');
  const [searchPlanNo, setSearchPlanNo] = useState('');
  const [searchProjectType, setSearchProjectType] = useState('');
  const [searchOwnerUnit, setSearchOwnerUnit] = useState('');
  const [approvalDateFrom, setApprovalDateFrom] = useState('');
  const [approvalDateTo, setApprovalDateTo] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [completionDateFrom, setCompletionDateFrom] = useState('');
  const [completionDateTo, setCompletionDateTo] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return completionProjects
      .filter((p) => {
        if (searchProjectNo && !p.projectNo.toLowerCase().includes(searchProjectNo.toLowerCase())) return false;
        if (searchProjectName && !p.projectName.toLowerCase().includes(searchProjectName.toLowerCase())) return false;
        if (searchPlanNo && !p.planNo.toLowerCase().includes(searchPlanNo.toLowerCase())) return false;
        if (searchProjectType && p.projectType !== searchProjectType) return false;
        if (searchOwnerUnit && p.ownerUnit !== searchOwnerUnit) return false;
        if (approvalDateFrom && p.approvalDate < approvalDateFrom) return false;
        if (approvalDateTo && p.approvalDate > approvalDateTo) return false;
        return true;
      })
      .sort((a, b) => b.approvalDate.localeCompare(a.approvalDate));
  }, [searchProjectNo, searchProjectName, searchPlanNo, searchProjectType, searchOwnerUnit, approvalDateFrom, approvalDateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setSearchProjectNo('');
    setSearchProjectName('');
    setSearchPlanNo('');
    setSearchProjectType('');
    setSearchOwnerUnit('');
    setApprovalDateFrom('');
    setApprovalDateTo('');
    setSearchStatus('');
    setCompletionDateFrom('');
    setCompletionDateTo('');
    setCurrentPage(1);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">项目交竣工申请</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理项目交竣工申请，查看项目列表并进入交竣工申请流程</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right">立项号</label>
              <input type="text" value={searchProjectNo} onChange={(e) => setSearchProjectNo(e.target.value)} placeholder="模糊查询" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right">项目名称</label>
              <input type="text" value={searchProjectName} onChange={(e) => setSearchProjectName(e.target.value)} placeholder="模糊查询" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right">年度计划号</label>
              <input type="text" value={searchPlanNo} onChange={(e) => setSearchPlanNo(e.target.value)} placeholder="模糊查询" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right">项目类型</label>
              <select value={searchProjectType} onChange={(e) => setSearchProjectType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right">业主单位</label>
              <select value={searchOwnerUnit} onChange={(e) => setSearchOwnerUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {ownerUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right">立项日期</label>
              <input type="date" value={approvalDateFrom} onChange={(e) => setApprovalDateFrom(e.target.value)} className={inputCls} style={{ width: '150px' }} />
              <span className="text-steel-400 text-sm">~</span>
              <input type="date" value={approvalDateTo} onChange={(e) => setApprovalDateTo(e.target.value)} className={inputCls} style={{ width: '150px' }} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-steel-100">
            <button onClick={() => { setCurrentPage(1); }} className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ backgroundColor: '#10b981' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>查询
            </button>
            <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>重置
            </button>
          </div>
        </div>

        {/* General Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/project-execute/completion/tech-renovation')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-amber-700 border border-amber-300 rounded-md hover:bg-amber-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-list-3-line" /></div>技改类竣工项目清单
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">项目列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">序号</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">年度计划号</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '240px' }}>项目名称</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">预立项金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">实际立项金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">原始合同金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">修正合同金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项日期</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">专业主管单位</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">业主单位</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目负责人</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ borderLeft: '1px solid #e8edf3', minWidth: '140px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p, idx) => (
                  <tr key={p.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-3 py-3 text-sm text-primary-600 font-mono whitespace-nowrap">{p.projectNo}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 font-mono whitespace-nowrap">{p.planNo}</td>
                    <td className="px-3 py-3 text-sm text-steel-700">{p.projectName}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 whitespace-nowrap">{p.projectType}</td>
                    <td className="px-3 py-3 text-sm text-steel-700 font-mono whitespace-nowrap text-right">{formatCurrency(p.approvalAmount)}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 font-mono whitespace-nowrap text-right">{formatCurrency(p.preApprovalAmount)}</td>
                    <td className="px-3 py-3 text-sm text-steel-700 font-mono whitespace-nowrap text-right">{formatCurrency(p.actualApprovalAmount)}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 font-mono whitespace-nowrap text-right">{formatCurrency(p.originalContractAmount)}</td>
                    <td className="px-3 py-3 text-sm text-steel-700 font-mono whitespace-nowrap text-right">{formatCurrency(p.adjustedContractAmount)}</td>
                    <td className="px-3 py-3 text-sm text-steel-500 whitespace-nowrap">{p.approvalDate}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 whitespace-nowrap">{p.proDept}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 whitespace-nowrap">{p.ownerUnit}</td>
                    <td className="px-3 py-3 text-sm text-steel-700 whitespace-nowrap">{p.projectManager}</td>
                    <td className="px-3 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                      <button
                        onClick={() => navigate(`/project-execute/completion/application-list?projectNo=${p.projectNo}&planNo=${p.planNo}&projectName=${encodeURIComponent(p.projectName)}`)}
                        className="px-3 py-1.5 text-xs text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap"
                      >
                        交竣工申请
                      </button>
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