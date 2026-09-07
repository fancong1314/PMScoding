import Layout from '@/components/feature/Layout';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { contracts } from '@/mocks/contractProgressMocks';

export default function ContractListPage() {
  const navigate = useNavigate();
  const [searchApprovalNo, setSearchApprovalNo] = useState('');
  const [searchContractType, setSearchContractType] = useState('');
  const [searchContractNo, setSearchContractNo] = useState('');
  const [searchProjectType, setSearchProjectType] = useState('');
  const [searchContractName, setSearchContractName] = useState('');
  const [searchOwnerUnit, setSearchOwnerUnit] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      if (searchApprovalNo && !c.approvalNo.includes(searchApprovalNo)) return false;
      if (searchContractType && c.contractType !== searchContractType) return false;
      if (searchContractNo && !c.contractNo.includes(searchContractNo)) return false;
      if (searchProjectType && c.projectType !== searchProjectType) return false;
      if (searchContractName && !c.contractName.includes(searchContractName)) return false;
      if (searchOwnerUnit && c.ownerUnit !== searchOwnerUnit) return false;
      return true;
    });
  }, [searchApprovalNo, searchContractType, searchContractNo, searchProjectType, searchContractName, searchOwnerUnit]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusTag = (status: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      '执行中': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
      '已完工': { bg: 'bg-blue-50', text: 'text-blue-700' },
      '已结算': { bg: 'bg-slate-100', text: 'text-slate-700' },
      '已暂停': { bg: 'bg-amber-50', text: 'text-amber-700' },
      '待启动': { bg: 'bg-gray-50', text: 'text-gray-700' },
    };
    const s = map[status] ?? { bg: 'bg-gray-50', text: 'text-gray-700' };
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}>
        {status}
      </span>
    );
  };

  return (
    <Layout>
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-steel-500 font-medium">立项号</label>
            <div className="relative">
              <input
                type="text"
                value={searchApprovalNo}
                onChange={(e) => setSearchApprovalNo(e.target.value)}
                placeholder="请输入立项号"
                className="w-48 px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-400 pr-8"
              />
              {searchApprovalNo && (
                <button
                  onClick={() => setSearchApprovalNo('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center cursor-pointer text-steel-400 hover:text-steel-600"
                >
                  <i className="ri-close-line text-xs" />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-steel-500 font-medium">合同类型</label>
            <select
              value={searchContractType}
              onChange={(e) => setSearchContractType(e.target.value)}
              className="w-40 px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-400 bg-white"
            >
              <option value="">请选择...</option>
              <option value="施工合同">施工合同</option>
              <option value="采购合同">采购合同</option>
              <option value="设计合同">设计合同</option>
              <option value="监理合同">监理合同</option>
              <option value="设备合同">设备合同</option>
              <option value="技术服务合同">技术服务合同</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-steel-500 font-medium">合同编号</label>
            <input
              type="text"
              value={searchContractNo}
              onChange={(e) => setSearchContractNo(e.target.value)}
              placeholder="请输入合同编号"
              className="w-48 px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-steel-500 font-medium">项目类型</label>
            <select
              value={searchProjectType}
              onChange={(e) => setSearchProjectType(e.target.value)}
              className="w-40 px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-400 bg-white"
            >
              <option value="">请选择...</option>
              <option value="A质量品种">A质量品种</option>
              <option value="B安全环保">B安全环保</option>
              <option value="C节能降耗">C节能降耗</option>
              <option value="D工艺装备">D工艺装备</option>
              <option value="E智能制造">E智能制造</option>
              <option value="F信息化">F信息化</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-steel-500 font-medium">合同名称</label>
            <input
              type="text"
              value={searchContractName}
              onChange={(e) => setSearchContractName(e.target.value)}
              placeholder="请输入合同名称"
              className="w-56 px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-steel-500 font-medium">业主单位</label>
            <select
              value={searchOwnerUnit}
              onChange={(e) => setSearchOwnerUnit(e.target.value)}
              className="w-40 px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-400 bg-white"
            >
              <option value="">请选择...</option>
              <option value="炼铁事业部">炼铁事业部</option>
              <option value="炼钢事业部">炼钢事业部</option>
              <option value="轧钢事业部">轧钢事业部</option>
              <option value="能源环保部">能源环保部</option>
              <option value="设备部">设备部</option>
              <option value="安全能环部">安全能环部</option>
              <option value="技术中心">技术中心</option>
            </select>
          </div>
          <button
            onClick={() => { setCurrentPage(1); }}
            className="px-5 py-1.5 text-sm font-medium text-white rounded-md cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
              <i className="ri-search-line text-xs" />
            </div>
            查询
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-steel-50" style={{ borderBottom: '1px solid #e8edf3' }}>
                <th className="sticky left-0 z-20 px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap bg-steel-50" style={{ minWidth: 130, borderRight: '1px solid #e8edf3' }}>立项号</th>
                <th className="sticky left-[130px] z-20 px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap bg-steel-50" style={{ minWidth: 130, borderRight: '1px solid #e8edf3' }}>合同编号</th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 280 }}>合同名称</th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 100 }}>合同类型</th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 120 }}>承包商编号</th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 200 }}>主要内容</th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 140 }}>计划完成进度(%)</th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 140 }}>实际完成进度(%)</th>
                <th className="px-3 py-2.5 text-left font-medium text-steel-600 whitespace-nowrap" style={{ minWidth: 90 }}>合同状态</th>
                <th className="sticky right-0 z-20 px-3 py-2.5 text-center font-medium text-steel-600 whitespace-nowrap bg-steel-50" style={{ minWidth: 240, borderLeft: '1px solid #e8edf3' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((item, idx) => {
                const progressDiff = item.actualProgress - item.planProgress;
                return (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50 transition-colors"
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                  >
                    <td className="sticky left-0 z-10 px-3 py-2.5 text-steel-800 whitespace-nowrap bg-white group-hover:bg-slate-50" style={{ minWidth: 130, borderRight: '1px solid #e8edf3' }}>{item.approvalNo}</td>
                    <td className="sticky left-[130px] z-10 px-3 py-2.5 text-steel-800 font-medium whitespace-nowrap bg-white group-hover:bg-slate-50" style={{ minWidth: 130, borderRight: '1px solid #e8edf3' }}>{item.contractNo}</td>
                    <td className="px-3 py-2.5 text-steel-800 font-medium whitespace-nowrap" style={{ minWidth: 280 }}>{item.contractName}</td>
                    <td className="px-3 py-2.5 text-steel-600 whitespace-nowrap" style={{ minWidth: 100 }}>{item.contractType}</td>
                    <td className="px-3 py-2.5 text-steel-600 whitespace-nowrap font-mono" style={{ minWidth: 120 }}>{item.contractorNo}</td>
                    <td className="px-3 py-2.5 text-steel-600 whitespace-nowrap" style={{ minWidth: 200 }}>{item.mainContent}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ minWidth: 140 }}>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-steel-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${item.planProgress}%` }} />
                        </div>
                        <span className="text-xs text-steel-600 font-mono">{item.planProgress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ minWidth: 140 }}>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-steel-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${progressDiff < 0 ? 'bg-red-400' : 'bg-emerald-500'}`}
                            style={{ width: `${item.actualProgress}%` }}
                          />
                        </div>
                        <span className={`text-xs font-mono ${progressDiff < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{item.actualProgress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ minWidth: 90 }}>{statusTag(item.contractStatus)}</td>
                    <td className="sticky right-0 z-10 px-3 py-2.5 text-center whitespace-nowrap bg-white group-hover:bg-slate-50" style={{ minWidth: 240, borderLeft: '1px solid #e8edf3' }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate(`/project-contract/progress/reports?contractId=${item.id}`)}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5">
                            <i className="ri-file-list-line text-xs" />
                          </div>
                          周报月报
                        </button>
                        <button
                          onClick={() => navigate(`/project-contract/progress/gantt?contractId=${item.id}`)}
                          className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5">
                            <i className="ri-bar-chart-box-line text-xs" />
                          </div>
                          进度图表
                        </button>
                        <button
                          onClick={() => navigate(`/project-contract/progress/wbs?contractId=${item.id}`)}
                          className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5">
                            <i className="ri-node-tree text-xs" />
                          </div>
                          任务拆解
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty */}
        {pagedData.length === 0 && (
          <div className="py-12 text-center text-steel-400 text-sm">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-steel-300">
              <i className="ri-inbox-line text-3xl" />
            </div>
            暂无数据
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #e8edf3' }}>
          <div className="flex items-center gap-2 text-sm text-steel-500">
            <span>每页</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 border border-steel-200 rounded text-sm bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>条</span>
            <span className="ml-2">共 {filtered.length} 条</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <i className="ri-arrow-left-s-line" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium cursor-pointer ${
                  p === currentPage ? 'text-white' : 'text-steel-600 hover:bg-slate-50 border border-steel-200'
                }`}
                style={p === currentPage ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}
              >
                {p}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}