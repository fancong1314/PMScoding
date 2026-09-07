import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { techRenovationProjects, projectTypes, ownerUnits } from '@/mocks/completionAcceptanceMocks';

const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

export default function TechRenovationListPage() {
  const navigate = useNavigate();

  const [searchProjectNo, setSearchProjectNo] = useState('');
  const [searchProjectName, setSearchProjectName] = useState('');
  const [searchProjectType, setSearchProjectType] = useState('');
  const [approvalDateFrom, setApprovalDateFrom] = useState('');
  const [approvalDateTo, setApprovalDateTo] = useState('');
  const [searchOwnerUnit, setSearchOwnerUnit] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return techRenovationProjects
      .filter((p) => {
        if (searchProjectNo && !p.projectNo.toLowerCase().includes(searchProjectNo.toLowerCase())) return false;
        if (searchProjectName && !p.projectName.toLowerCase().includes(searchProjectName.toLowerCase())) return false;
        if (searchProjectType && p.projectType !== searchProjectType) return false;
        if (searchOwnerUnit && p.ownerUnit !== searchOwnerUnit) return false;
        if (approvalDateFrom && p.approvalDate < approvalDateFrom) return false;
        if (approvalDateTo && p.approvalDate > approvalDateTo) return false;
        return true;
      })
      .sort((a, b) => b.completionDate.localeCompare(a.completionDate));
  }, [searchProjectNo, searchProjectName, searchProjectType, searchOwnerUnit, approvalDateFrom, approvalDateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setSearchProjectNo(''); setSearchProjectName(''); setSearchProjectType('');
    setApprovalDateFrom(''); setApprovalDateTo(''); setSearchOwnerUnit('');
    setCurrentPage(1);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">技改类竣工项目清单</h1>
            <p className="text-xs text-steel-400 mt-0.5">查看已竣工的技改类项目汇总数据</p>
          </div>
          <button onClick={() => navigate('/project-execute/completion')} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回项目列表
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right">立项号</label>
              <input type="text" value={searchProjectNo} onChange={(e) => setSearchProjectNo(e.target.value)} placeholder="模糊查询" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-16 text-right">项目名称</label>
              <input type="text" value={searchProjectName} onChange={(e) => setSearchProjectName(e.target.value)} placeholder="模糊查询" className={inputCls} />
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

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">技改类竣工项目</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1900px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">序号</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">事业部</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '240px' }}>项目名称</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">原始合同金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">修正合同金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">完工金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">结算金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">转固金额(元)</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项日期</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">竣工日期</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">业主单位</th>
                  <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目负责人</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p, idx) => (
                  <tr key={p.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-3 py-3 text-sm text-primary-600 font-mono whitespace-nowrap">{p.projectNo}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 whitespace-nowrap">{p.businessUnit}</td>
                    <td className="px-3 py-3 text-sm text-steel-700">{p.projectName}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 whitespace-nowrap">{p.projectType}</td>
                    <td className="px-3 py-3 text-sm text-steel-700 font-mono whitespace-nowrap text-right">{formatCurrency(p.approvalAmount)}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 font-mono whitespace-nowrap text-right">{formatCurrency(p.originalContractAmount)}</td>
                    <td className="px-3 py-3 text-sm text-steel-700 font-mono whitespace-nowrap text-right">{formatCurrency(p.adjustedContractAmount)}</td>
                    <td className="px-3 py-3 text-sm text-emerald-700 font-medium font-mono whitespace-nowrap text-right">{formatCurrency(p.completionAmount)}</td>
                    <td className="px-3 py-3 text-sm text-steel-700 font-mono whitespace-nowrap text-right">{formatCurrency(p.settlementAmount)}</td>
                    <td className="px-3 py-3 text-sm text-primary-700 font-medium font-mono whitespace-nowrap text-right">{formatCurrency(p.fixedAssetAmount)}</td>
                    <td className="px-3 py-3 text-sm text-steel-500 whitespace-nowrap">{p.approvalDate}</td>
                    <td className="px-3 py-3 text-sm text-emerald-600 font-medium whitespace-nowrap">{p.completionDate}</td>
                    <td className="px-3 py-3 text-sm text-steel-600 whitespace-nowrap">{p.ownerUnit}</td>
                    <td className="px-3 py-3 text-sm text-steel-700 whitespace-nowrap">{p.projectManager}</td>
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