import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { signboardContracts, contractTypes, formatCurrency, processItemsMap, ProcessItem } from '@/mocks/signboardMocks';

interface AcceptanceRecord {
  contractName: string;
  contractNo: string;
  processName: string;
  category: string;
  processNo: string;
  description: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: string;
  contractId: string;
  itemId: string;
}

const acceptanceStatusLabel: Record<string, string> = {
  pending: '待完成',
  waiting_approval: '待审批',
  approved: '已通过',
  rejected: '已驳回',
};

const acceptanceStatusColor: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-600',
  waiting_approval: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
};

export default function SignboardContractListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    approvalNo: '',
    contractNo: '',
    contractName: '',
    contractType: '',
  });
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [showAcceptanceList, setShowAcceptanceList] = useState(false);

  // Build all acceptance records from all contracts
  const allAcceptanceRecords: AcceptanceRecord[] = useMemo(() => {
    const records: AcceptanceRecord[] = [];
    signboardContracts.forEach((c) => {
      const items = processItemsMap[c.id] || [];
      items.forEach((item) => {
        records.push({
          contractName: c.contractName,
          contractNo: c.contractNo,
          processName: item.processName,
          category: item.category,
          processNo: item.processNo,
          description: item.description,
          plannedStartDate: item.plannedStartDate,
          plannedEndDate: item.plannedEndDate,
          status: item.status,
          contractId: c.id,
          itemId: item.id,
        });
      });
    });
    return records;
  }, []);

  const handleSearch = () => { setPage(1); };

  const filtered = signboardContracts.filter((c) => {
    if (searchParams.approvalNo && !c.approvalNo.includes(searchParams.approvalNo)) return false;
    if (searchParams.contractNo && !c.contractNo.includes(searchParams.contractNo)) return false;
    if (searchParams.contractName && !c.contractName.includes(searchParams.contractName)) return false;
    if (searchParams.contractType && c.contractType !== searchParams.contractType) return false;
    return true;
  }).sort((a, b) => b.approvalNo.localeCompare(a.approvalNo));

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: 'index', title: '序号', width: 60 },
    { key: 'approvalNo', title: '立项号', width: 120 },
    { key: 'projectName', title: '项目名称', width: 240 },
    { key: 'contractNo', title: '合同编号', width: 130 },
    { key: 'contractName', title: '合同名称', width: 280 },
    { key: 'contractType', title: '合同类型', width: 110 },
    { key: 'contractorNo', title: '承包商编号', width: 110 },
    { key: 'mainContent', title: '主要内容', width: 280 },
    { key: 'contractDate', title: '订约日期', width: 110 },
    { key: 'revisedAmount', title: '修正订约金额(元)', width: 150 },
    { key: 'contractStatus', title: '合同状态', width: 90 },
    { key: 'actions', title: '操作', width: 100 },
  ];

  const statusBg: Record<string, string> = {
    '执行中': 'bg-emerald-50 text-emerald-700',
    '已完工': 'bg-blue-50 text-blue-700',
    '已结算': 'bg-slate-100 text-slate-700',
    '已暂停': 'bg-amber-50 text-amber-700',
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h1 className="text-lg font-semibold text-slate-800 mb-4">合同举牌验收 — 合同列表</h1>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAcceptanceList(true)}
              className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-file-list-3-line" /></div>
              验收清单
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">立项号</span>
            <div className="relative">
              <input type="text" value={searchParams.approvalNo} onChange={(e) => setSearchParams({ ...searchParams, approvalNo: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
              {searchParams.approvalNo && (
                <button onClick={() => setSearchParams({ ...searchParams, approvalNo: '' })} className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                  <i className="ri-close-circle-line" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同编号</span>
            <input type="text" value={searchParams.contractNo} onChange={(e) => setSearchParams({ ...searchParams, contractNo: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-44 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同名称</span>
            <input type="text" value={searchParams.contractName} onChange={(e) => setSearchParams({ ...searchParams, contractName: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-52 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同类型</span>
            <select value={searchParams.contractType} onChange={(e) => setSearchParams({ ...searchParams, contractType: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md w-40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              <option value="">请选择...</option>
              {contractTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <button onClick={handleSearch} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-search-line" /></div>
            查询
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 360px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                {columns.map((col, idx) => (
                  <th
                    key={col.key}
                    className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap"
                    style={
                      col.key === 'index' || col.key === 'approvalNo'
                        ? { position: 'sticky', left: col.key === 'index' ? 0 : 60, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }
                        : col.key === 'actions'
                          ? { position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0' }
                          : undefined
                    }
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, idx) => (
                <tr key={row.id} className="group hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 60, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
                    {row.approvalNo}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{row.projectName}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{row.contractNo}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{row.contractName}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{row.contractType}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{row.contractorNo}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{row.mainContent}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{row.contractDate}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(row.revisedAmount)}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBg[row.contractStatus]}`}>{row.contractStatus}</span>
                  </td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <button
                      onClick={() => navigate(`/project-contract/signboard/management?contractId=${row.id}`)}
                      className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                    >
                      举牌验收
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-slate-500">共 {filtered.length} 条</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">上一页</button>
            <span className="px-3 py-1 text-sm text-slate-700">{page} / {totalPages || 1}</span>
            <button onClick={() => setPage(Math.min(totalPages || 1, page + 1))} disabled={page === totalPages || totalPages === 0} className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">下一页</button>
          </div>
        </div>
      </div>

      {/* 验收清单 Modal */}
      {showAcceptanceList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAcceptanceList(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[1300px] max-w-[95vw] max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">验收清单 — 全部合同工序验收记录</h3>
              <button onClick={() => setShowAcceptanceList(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                <i className="ri-close-line text-lg" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-20 bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同名称</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同号</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工序名称</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">分类</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工序编号</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工序说明</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">计划开始完成时间</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">状态</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAcceptanceRecords.map((rec, idx) => (
                      <tr key={`${rec.contractId}-${rec.itemId}`} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.contractName}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.contractNo}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.processName}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.category}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.processNo}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.description}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.plannedStartDate} ~ {rec.plannedEndDate}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${acceptanceStatusColor[rec.status]}`}>
                            {acceptanceStatusLabel[rec.status]}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setShowAcceptanceList(false);
                                navigate(`/project-contract/signboard/detail?contractId=${rec.contractId}&itemId=${rec.itemId}`);
                              }}
                              className="px-2.5 py-1 text-xs text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 cursor-pointer whitespace-nowrap"
                            >
                              查看详情
                            </button>
                            <button
                              onClick={() => {
                                setShowAcceptanceList(false);
                                navigate(`/project-contract/signboard/management?contractId=${rec.contractId}`);
                              }}
                              className="px-2.5 py-1 text-xs text-purple-600 border border-purple-200 rounded-md hover:bg-purple-50 cursor-pointer whitespace-nowrap"
                            >
                              审批记录
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {allAcceptanceRecords.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-3 py-12 text-center text-slate-400 text-sm">暂无验收记录</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
              <span className="text-sm text-slate-500">共 {allAcceptanceRecords.length} 条记录</span>
              <button
                onClick={() => setShowAcceptanceList(false)}
                className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}