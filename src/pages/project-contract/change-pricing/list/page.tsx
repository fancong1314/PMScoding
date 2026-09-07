import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { changePricingProjects, projectTypes, ownerUnits, formatCurrency } from '@/mocks/changePricingMocks';

export default function ChangePricingProjectListPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    approvalNo: '', projectName: '', planNo: '', projectType: '',
    ownerUnit: '', startDate: '', endDate: '',
  });

  const filteredProjects = useMemo(() => {
    return changePricingProjects.filter((p) => {
      if (filters.approvalNo && !p.approvalNo.includes(filters.approvalNo)) return false;
      if (filters.projectName && !p.projectName.includes(filters.projectName)) return false;
      if (filters.planNo && !p.planNo.includes(filters.planNo)) return false;
      if (filters.projectType && p.projectType !== filters.projectType) return false;
      if (filters.ownerUnit && p.ownerUnit !== filters.ownerUnit) return false;
      if (filters.startDate && p.approvalDate < filters.startDate) return false;
      if (filters.endDate && p.approvalDate > filters.endDate) return false;
      return true;
    });
  }, [filters]);

  const handleReset = () => {
    setFilters({ approvalNo: '', projectName: '', planNo: '', projectType: '', ownerUnit: '', startDate: '', endDate: '' });
  };

  const colApprovalNoW = 140;
  const colPlanNoW = 130;
  const leftStickySecond = colApprovalNoW;
  const colActionsW = 100;

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-5 border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-800 mb-4">合同变更核价管理</h1>

          {/* Search */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">立项号</span>
              <input type="text" value={filters.approvalNo} onChange={(e) => setFilters({ ...filters, approvalNo: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="支持模糊匹配" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">项目名称</span>
              <input type="text" value={filters.projectName} onChange={(e) => setFilters({ ...filters, projectName: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="支持模糊匹配" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">年度计划号</span>
              <div className="flex-1 relative">
                <input type="text" value={filters.planNo} onChange={(e) => setFilters({ ...filters, planNo: e.target.value })} className="w-full px-3 py-1.5 pr-8 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="支持模糊匹配" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer" title="年度计划号由立项管理部门统一分配">
                  <i className="ri-question-line text-xs" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">项目类型</span>
              <select value={filters.projectType} onChange={(e) => setFilters({ ...filters, projectType: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">请选择...</option>
                {projectTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">业主单位</span>
              <select value={filters.ownerUnit} onChange={(e) => setFilters({ ...filters, ownerUnit: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">请选择...</option>
                {ownerUnits.map((u) => (<option key={u} value={u}>{u}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">立项日期</span>
              <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              <span className="text-sm text-slate-400">至</span>
              <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-6 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-search-line" /></div>查询
            </button>
            <button onClick={handleReset} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">重置</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colApprovalNoW}px` }}>立项号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colPlanNoW}px` }}>年度计划号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '220px' }}>项目名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '200px' }}>立项说明</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>项目类型</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>立项金额(元)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>预立项金额(元)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '140px' }}>实际立项金额(元)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '140px' }}>原始合同金额(元)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '140px' }}>修正合同金额(元)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>完工金额(元)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>结算金额(元)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>记账金额(元)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>转固金额(元)</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>立项日期</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>业主单位</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '140px' }}>实施主管单位</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>项目经理</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>是否环保评估</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-50/60 transition-colors cursor-pointer" style={{ borderBottom: '1px solid #f1f5f9' }} onClick={() => navigate(`/project-contract/change-pricing/demand-list?projectId=${p.id}`)}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{p.approvalNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{p.planNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: '220px' }} title={p.projectName}>{p.projectName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: '200px' }} title={p.approvalDesc}>{p.approvalDesc}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{p.projectType}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(p.approvalAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(p.preApprovalAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(p.actualApprovalAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(p.originalContractAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-medium text-amber-600">{formatCurrency(p.revisedContractAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(p.completedAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(p.settledAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(p.bookedAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(p.fixedAssetAmount)}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{p.approvalDate}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{p.ownerUnit}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{p.implementUnit}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{p.projectManager}</td>
                  <td className="px-3 py-2.5 text-sm text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.hasEnvAssessment === '是' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{p.hasEnvAssessment}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <span className="text-xs text-primary-600 hover:text-primary-700 font-medium">查看工程需求</span>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr><td colSpan={20} className="px-3 py-10 text-center text-sm text-slate-400">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredProjects.length > 0 && (
          <div className="p-3 text-sm text-slate-500 border-t border-slate-200">共 {filteredProjects.length} 条记录</div>
        )}
      </div>
    </Layout>
  );
}