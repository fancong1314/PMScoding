import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { allPayContracts, contractStatusOptions, contractTypeOptions, formatCurrency } from '@/mocks/paymentDeclarationMocks';

export default function PaymentDeclarationListPage() {
  const navigate = useNavigate();

  const [projectNo, setProjectNo] = useState('');
  const [contractNo, setContractNo] = useState('');
  const [contractName, setContractName] = useState('');
  const [contractorNo, setContractorNo] = useState('');
  const [contractStatus, setContractStatus] = useState('');
  const [contractType, setContractType] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleReset = () => {
    setProjectNo(''); setContractNo(''); setContractName(''); setContractorNo('');
    setContractStatus(''); setContractType('');
  };

  const handleSearch = () => { showToast('查询完成'); };

  const filtered = useMemo(() => {
    let data = [...allPayContracts];
    if (projectNo.trim()) data = data.filter((r) => r.projectNo.includes(projectNo.trim()));
    if (contractNo.trim()) data = data.filter((r) => r.contractNo.includes(contractNo.trim()));
    if (contractName.trim()) data = data.filter((r) => r.contractName.includes(contractName.trim()));
    if (contractorNo.trim()) data = data.filter((r) => r.contractorNo.includes(contractorNo.trim()));
    if (contractStatus) data = data.filter((r) => r.status === contractStatus);
    if (contractType) data = data.filter((r) => r.type === contractType);
    return data;
  }, [projectNo, contractNo, contractName, contractorNo, contractStatus, contractType]);

  const colProjectNoW = 150;
  const colContractNoW = 140;
  const leftStickySecond = colProjectNoW;
  const colActionsW = 150;

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">工程款申报 - 合同列表</h1>
        </div>

        {/* Search Area */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">立项号</span>
            <div className="relative">
              <input type="text" value={projectNo} onChange={(e) => setProjectNo(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-36" placeholder="请输入立项号" />
              {projectNo && (
                <button onClick={() => setProjectNo('')} className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同编号</span>
            <input type="text" value={contractNo} onChange={(e) => setContractNo(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-36" placeholder="请输入合同编号" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同名称</span>
            <input type="text" value={contractName} onChange={(e) => setContractName(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-36" placeholder="请输入合同名称" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">承包商编号</span>
            <input type="text" value={contractorNo} onChange={(e) => setContractorNo(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-32" placeholder="请输入承包商编号" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同状态</span>
            <select value={contractStatus} onChange={(e) => setContractStatus(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              {contractStatusOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同类型</span>
            <select value={contractType} onChange={(e) => setContractType(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              {contractTypeOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSearch} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
              查询
            </button>
            <button onClick={handleReset} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
              重置
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 340px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colProjectNoW}px` }}>立项号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colContractNoW}px` }}>合同编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '220px' }}>合同名称</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>承包商编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '260px' }}>主要内容</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>订约日期</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>预付款百分比(%)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>质保金百分比(%)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>合同付款比例(%)</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '150px' }}>修正订约金额(元)</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>合同状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>合同类型</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{row.projectNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{row.contractNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '220px' }} title={row.contractName}>{row.contractName}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.contractorNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '260px' }} title={row.mainContent}>{row.mainContent}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.signingDate}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{row.prepayPct}%</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{row.warrantyPct}%</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right">{row.payRatioPct}%</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(row.adjustedAmount)}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.status === '执行中' ? 'bg-emerald-50 text-emerald-700' : row.status === '已完工' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{row.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.type}</td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <button
                      onClick={() => navigate(`/project-contract/payment-declaration/declaration-list?contractId=${row.id}`)}
                      className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                    >
                      工程款申报清单
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={13} className="px-3 py-10 text-center text-sm text-slate-400">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-sm text-slate-500">共 {filtered.length} 条记录</div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}