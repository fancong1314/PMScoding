import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { monitorContracts, type MonitorContract } from '@/mocks/monitorConfigMocks';

const statusStyle: Record<string, string> = {
  '已配置': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '未配置': 'bg-slate-100 text-slate-500 border-slate-200',
  '配置异常': 'bg-red-50 text-red-700 border-red-200',
};

const configStatusOptions = ['全部', '已配置', '未配置', '配置异常'];

export default function MonitorConfigListPage() {
  const navigate = useNavigate();
  const [contracts] = useState<MonitorContract[]>(monitorContracts);

  const [searchContractNo, setSearchContractNo] = useState('');
  const [searchContractName, setSearchContractName] = useState('');
  const [filterStatus, setFilterStatus] = useState('全部');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      if (searchContractNo && !c.contractNo.toLowerCase().includes(searchContractNo.toLowerCase())) return false;
      if (searchContractName && !c.contractName.toLowerCase().includes(searchContractName.toLowerCase())) return false;
      if (filterStatus !== '全部' && c.configStatus !== filterStatus) return false;
      return true;
    });
  }, [contracts, searchContractNo, searchContractName, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setSearchContractNo('');
    setSearchContractName('');
    setFilterStatus('全部');
    setCurrentPage(1);
  };

  const handleSync = (contractNo: string) => {
    showToast(`合同 ${contractNo} 设备同步成功`);
  };

  const handleRemove = () => {
    if (removeConfirm) {
      showToast('设备关联已移除');
      setRemoveConfirm(null);
    }
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-4">
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>
            {toast}
          </div>
        )}

        <div>
          <h1 className="text-lg font-semibold text-steel-900">合同监控配置</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理各合同的监控设备关联状态，支持设备配置与海康平台同步</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap">合同编号</label>
              <input
                type="text"
                value={searchContractNo}
                onChange={(e) => setSearchContractNo(e.target.value)}
                placeholder="模糊查询"
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap">合同名称</label>
              <input
                type="text"
                value={searchContractName}
                onChange={(e) => setSearchContractName(e.target.value)}
                placeholder="模糊查询"
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap">配置状态</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputCls + ' cursor-pointer'}>
                {configStatusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
                重置
              </button>
              <button onClick={() => setCurrentPage(1)} className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
                查询
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">合同监控配置列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1500px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同编号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '220px' }}>合同名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '220px' }}>项目名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">关联设备数</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">在线设备数</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">离线设备数</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">配置状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: '240px', borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((record, idx) => (
                  <tr key={record.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-primary-600 font-mono whitespace-nowrap">{record.contractNo}</td>
                    <td className="px-4 py-3 text-sm text-steel-700">{record.contractName}</td>
                    <td className="px-4 py-3 text-sm text-steel-600 font-mono whitespace-nowrap">{record.projectNo}</td>
                    <td className="px-4 py-3 text-sm text-steel-700">{record.projectName}</td>
                    <td className="px-4 py-3 text-sm text-steel-600 text-center">{record.associatedDeviceCount}</td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium text-center">{record.onlineDeviceCount}</td>
                    <td className="px-4 py-3 text-sm text-red-500 font-medium text-center">{record.offlineDeviceCount}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle[record.configStatus] || ''}`}>{record.configStatus}</span>
                    </td>
                    <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigate(`/system-config/monitor-config/config?contractId=${record.id}`)}
                          className="px-2.5 py-1.5 text-xs text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap"
                        >
                          配置
                        </button>
                        <button
                          onClick={() => handleSync(record.contractNo)}
                          className="px-2.5 py-1.5 text-xs text-sky-700 border border-sky-200 rounded-md hover:bg-sky-50 cursor-pointer whitespace-nowrap"
                        >
                          同步
                        </button>
                        <button
                          onClick={() => setRemoveConfirm(record.id)}
                          className="px-2.5 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap"
                        >
                          移除配置
                        </button>
                      </div>
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
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
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

      {/* Remove Confirm Modal */}
      {removeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setRemoveConfirm(null)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-96 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 flex-shrink-0">
                <i className="ri-error-warning-line text-red-500 text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-steel-800">确认移除配置</h4>
                <p className="text-xs text-steel-500 mt-0.5">将移除该合同下所有设备关联，确定继续？</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRemoveConfirm(null)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleRemove} className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 cursor-pointer whitespace-nowrap">确认移除</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}