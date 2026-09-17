import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { examExemptionContracts, contractTypes, contractStatuses, formatCurrency } from '@/mocks/examExemptionMocks';
import { amountRanges, overdueOptions } from '@/mocks/contractOverdueMocks';

export default function ExamExemptionContractListPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    approvalNo: '', contractAmount: '', hasOverdue: '', contractType: '',
    contractStatus: '', contractNo: '', contractorNo: '', contractName: '', startDate: '', endDate: '',
  });

  const filtered = useMemo(() => {
    return examExemptionContracts.filter((c) => {
      if (filters.approvalNo && !c.approvalNo.includes(filters.approvalNo)) return false;
      if (filters.contractNo && !c.contractNo.includes(filters.contractNo)) return false;
      if (filters.contractName && !c.contractName.includes(filters.contractName)) return false;
      if (filters.contractorNo && !c.contractorNo.includes(filters.contractorNo)) return false;
      if (filters.contractType && c.contractType !== filters.contractType) return false;
      if (filters.contractStatus && c.contractStatus !== filters.contractStatus) return false;
      if (filters.contractAmount) {
        const [low, high] = filters.contractAmount.split('-');
        const amt = c.contractAmount / 10000;
        if (high === '+' && amt < Number(low)) return false;
        if (high !== '+' && (amt < Number(low) || amt >= Number(high))) return false;
      }
      if (filters.startDate && c.signDate < filters.startDate) return false;
      if (filters.endDate && c.signDate > filters.endDate) return false;
      return true;
    });
  }, [filters]);

  const handleReset = () => setFilters({ approvalNo: '', contractAmount: '', hasOverdue: '', contractType: '', contractStatus: '', contractNo: '', contractorNo: '', contractName: '', startDate: '', endDate: '' });

  const colApprovalNoW = 140;
  const colContractNoW = 150;
  const leftStickySecond = colApprovalNoW;

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-5 border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-800 mb-4">合同超期免考申请</h1>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">立项号</span>
              <input type="text" value={filters.approvalNo} onChange={(e) => setFilters({ ...filters, approvalNo: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同金额</span>
              <select value={filters.contractAmount} onChange={(e) => setFilters({ ...filters, contractAmount: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                {amountRanges.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">是否超期申请</span>
              <select value={filters.hasOverdue} onChange={(e) => setFilters({ ...filters, hasOverdue: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                {overdueOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同类型</span>
              <select value={filters.contractType} onChange={(e) => setFilters({ ...filters, contractType: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">请选择...</option>
                {contractTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同状态</span>
              <select value={filters.contractStatus} onChange={(e) => setFilters({ ...filters, contractStatus: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">请选择...</option>
                {contractStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同编号</span>
              <input type="text" value={filters.contractNo} onChange={(e) => setFilters({ ...filters, contractNo: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">厂商编号</span>
              <input type="text" value={filters.contractorNo} onChange={(e) => setFilters({ ...filters, contractorNo: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同名称</span>
              <input type="text" value={filters.contractName} onChange={(e) => setFilters({ ...filters, contractName: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">签约日期</span>
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

        <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colApprovalNoW}px` }}>立项号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colContractNoW}px` }}>合同编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>合同类型</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '220px' }}>合同名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>承包商编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '250px' }}>主要内容</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>合同状态</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: '100px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50/60 transition-colors cursor-pointer" style={{ borderBottom: '1px solid #f1f5f9' }} onClick={() => navigate(`/project-contract/exam-exemption/exemption-list?contractId=${c.id}`)}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{c.approvalNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{c.contractNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{c.contractType}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: '220px' }} title={c.contractName}>{c.contractName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{c.contractorNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap truncate" style={{ maxWidth: '250px' }} title={c.mainContent}>{c.mainContent}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{c.contractStatus}</span></td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <span className="text-xs text-primary-600 hover:text-primary-700 font-medium">查看免考申请</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-10 text-center text-sm text-slate-400">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && <div className="p-3 text-sm text-slate-500 border-t border-slate-200">共 {filtered.length} 条记录</div>}
      </div>
    </Layout>
  );
}