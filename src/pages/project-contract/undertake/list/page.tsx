import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  requirementProjects,
  formatCurrency,
} from '@/mocks/engineeringRequirementMocks';

export default function UndertakeListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    approvalNo: '',
    name: '',
    planNo: '',
    projectType: '',
    ownerUnit: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const projectTypes = ['A质量品种', 'B安全环保', 'C节能降耗', 'D工艺装备', 'E智能制造', 'F信息化'];
  const ownerUnits = ['炼铁事业部', '炼钢事业部', '轧钢事业部', '能源环保部', '设备部', '安全能环部', '技术中心'];

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setSearchParams({
      approvalNo: '',
      name: '',
      planNo: '',
      projectType: '',
      ownerUnit: '',
      startDate: '',
      endDate: '',
    });
    setPage(1);
  };

  const filtered = requirementProjects.filter((p) => {
    if (searchParams.approvalNo && !p.approvalNo.includes(searchParams.approvalNo)) return false;
    if (searchParams.name && !p.name.includes(searchParams.name)) return false;
    if (searchParams.planNo && !p.planNo.includes(searchParams.planNo)) return false;
    if (searchParams.projectType && p.projectType !== searchParams.projectType) return false;
    if (searchParams.ownerUnit && p.ownerUnit !== searchParams.ownerUnit) return false;
    if (searchParams.startDate && p.approvalDate < searchParams.startDate) return false;
    if (searchParams.endDate && p.approvalDate > searchParams.endDate) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleRowClick = useCallback(
    (projectId: string) => {
      navigate(`/project-contract/undertake/demand-list?projectId=${projectId}`);
    },
    [navigate]
  );

  const columns = [
    { key: 'approvalNo', title: '立项号', width: 120 },
    { key: 'planNo', title: '年度计划号', width: 120 },
    { key: 'name', title: '项目名称', width: 240 },
    { key: 'description', title: '立项说明', width: 280 },
    { key: 'projectType', title: '项目类型', width: 100 },
    { key: 'budgetAmount', title: '立项金额(元)', width: 140 },
    { key: 'preBudgetAmount', title: '预立项金额(元)', width: 140 },
    { key: 'actualBudgetAmount', title: '实际立项金额(元)', width: 150 },
    { key: 'originalContractAmount', title: '原始合同金额(元)', width: 150 },
    { key: 'revisedContractAmount', title: '修正合同金额(元)', width: 150 },
    { key: 'completedAmount', title: '完工金额(元)', width: 130 },
    { key: 'settledAmount', title: '结算金额(元)', width: 130 },
    { key: 'accountedAmount', title: '记账金额(元)', width: 130 },
    { key: 'fixedAmount', title: '转固金额(元)', width: 130 },
    { key: 'approvalDate', title: '立项日期', width: 110 },
    { key: 'ownerUnit', title: '业主单位', width: 110 },
    { key: 'implementUnit', title: '实施主管单位', width: 120 },
    { key: 'projectManager', title: '项目经理', width: 100 },
    { key: 'isEnvAssessment', title: '是否环保评估', width: 110 },
  ];

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5 mb-4">
        <h1 className="text-lg font-semibold text-slate-800 mb-4">项目列表</h1>

        {/* Search Area */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">立项号</span>
            <div className="relative">
              <input
                type="text"
                value={searchParams.approvalNo}
                onChange={(e) => setSearchParams({ ...searchParams, approvalNo: e.target.value })}
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="请输入"
              />
              {searchParams.approvalNo && (
                <button
                  onClick={() => setSearchParams({ ...searchParams, approvalNo: '' })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <i className="ri-close-circle-line" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">项目名称</span>
            <input
              type="text"
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-48 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="请输入"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">年度计划号</span>
            <div className="relative">
              <input
                type="text"
                value={searchParams.planNo}
                onChange={(e) => setSearchParams({ ...searchParams, planNo: e.target.value })}
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="请输入"
              />
              {searchParams.planNo && (
                <button
                  onClick={() => setSearchParams({ ...searchParams, planNo: '' })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <i className="ri-close-circle-line" />
                </button>
              )}
              <div className="w-4 h-4 flex items-center justify-center ml-1 inline-flex text-slate-400 cursor-pointer" title="年度计划号格式：JH-YYYY-XXX">
                <i className="ri-question-line" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">项目类型</span>
            <select
              value={searchParams.projectType}
              onChange={(e) => setSearchParams({ ...searchParams, projectType: e.target.value })}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-36 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">请选择...</option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">业主单位</span>
            <select
              value={searchParams.ownerUnit}
              onChange={(e) => setSearchParams({ ...searchParams, ownerUnit: e.target.value })}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-36 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">请选择...</option>
              {ownerUnits.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">立项日期</span>
            <input
              type="date"
              value={searchParams.startDate}
              onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-32 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <span className="text-sm text-slate-400">至</span>
            <input
              type="date"
              value={searchParams.endDate}
              onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-32 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
              <i className="ri-search-line" />
            </div>
            查询
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            重置
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 320px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                {columns.map((col, idx) => (
                  <th
                    key={col.key}
                    className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap"
                    style={idx < 2 ? {
                      position: 'sticky',
                      left: idx === 0 ? 0 : 120,
                      zIndex: 30,
                      backgroundColor: '#f8fafc',
                      borderRight: '1px solid #e2e8f0',
                    } : undefined}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr
                  key={row.id}
                  className="group hover:bg-slate-50 cursor-pointer transition-colors"
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                  onClick={() => handleRowClick(row.id)}
                >
                  {columns.map((col, cIdx) => {
                    let value: React.ReactNode = (row as Record<string, unknown>)[col.key] as React.ReactNode;
                    if (col.key === 'budgetAmount' || col.key === 'preBudgetAmount' || col.key === 'actualBudgetAmount' || col.key === 'originalContractAmount' || col.key === 'revisedContractAmount' || col.key === 'completedAmount' || col.key === 'settledAmount' || col.key === 'accountedAmount' || col.key === 'fixedAmount') {
                      value = formatCurrency(row[col.key as keyof typeof row] as number);
                    } else if (col.key === 'isEnvAssessment') {
                      value = row.isEnvAssessment ? '是' : '否';
                    }
                    const isFixed = cIdx < 2;
                    return (
                      <td
                        key={col.key}
                        className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap"
                        style={isFixed ? {
                          position: 'sticky',
                          left: cIdx === 0 ? 0 : 120,
                          zIndex: 10,
                          backgroundColor: '#ffffff',
                          borderRight: '1px solid #e2e8f0',
                        } : undefined}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>共 {filtered.length} 条</span>
            <span>每页</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>条</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              上一页
            </button>
            <span className="px-3 py-1 text-sm text-slate-700">
              {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages || 1, page + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}