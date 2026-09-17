import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import DeductionModal from '../components/DeductionModal';
import ApprovalRecordModal from '../components/ApprovalRecordModal';
import { deductionRecords, deductionCategories, availableContracts, deductionStatuses, type DeductionRecord } from '@/mocks/participantManagementMocks';

export default function DeductionListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get('participantId') || '';
  const participantName = searchParams.get('participantName') || '';
  const participantType = searchParams.get('participantType') || '';

  const [records] = useState<DeductionRecord[]>(deductionRecords);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterContract, setFilterContract] = useState('');
  const [filterYear, setFilterYear] = useState('2026');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DeductionRecord | null>(null);
  const [toast, setToast] = useState('');

  const filtered = useMemo(() => {
    return records
      .filter((r) => r.participantId === participantId)
      .filter((r) => {
        if (filterCategory && r.deductionCategory !== filterCategory) return false;
        if (filterContract && r.relatedContract !== filterContract) return false;
        if (filterYear && !r.assessmentDate.startsWith(filterYear)) return false;
        return true;
      })
      .sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate));
  }, [records, participantId, filterCategory, filterContract, filterYear]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setFilterCategory('');
    setFilterContract('');
    setFilterYear('2026');
    setCurrentPage(1);
  };

  const handleSubmitDeduction = (data: Record<string, unknown>) => {
    console.log('New deduction:', data);
    setModalOpen(false);
    setToast('扣分记录保存成功，已提交审批');
    setTimeout(() => setToast(''), 3000);
  };

  const handleViewApproval = (record: DeductionRecord) => {
    setSelectedRecord(record);
    setRecordModalOpen(true);
  };

  const handleCancelApproval = (record: DeductionRecord) => {
    if (record.status !== '待审批') {
      setToast('仅待审批状态的记录可撤销');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    setToast(`已撤销记录 ${record.id} 的审批`);
    setTimeout(() => setToast(''), 3000);
  };

  const renderPagination = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-4">
        {/* Toast */}
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>
            {toast}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/participant/negative-score')} className="flex items-center gap-1 text-sm text-steel-500 hover:text-primary-600 transition-colors cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
            返回参建方列表
          </button>
        </div>

        <div>
          <h1 className="text-lg font-semibold text-steel-900">扣分明细列表</h1>
          <p className="text-xs text-steel-400 mt-0.5">{participantName}（{participantType}）的负面积分明细</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">扣分类别</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {deductionCategories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">关联合同</label>
              <select value={filterContract} onChange={(e) => setFilterContract(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {availableContracts.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">考核日期</label>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                <option value="2026">2026年</option>
                <option value="2025">2025年</option>
                <option value="2024">2024年</option>
              </select>
            </div>
            <div className="col-span-4 flex items-center justify-end gap-2">
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

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">扣分明细</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-add-line" /></div>
                新增
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-success-600 border border-success-200 rounded-md hover:bg-success-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-excel-line" /></div>
                导出扣分明细
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1200px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">扣分类别</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">关联合同</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '200px' }}>单位名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">单位类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">考核日期</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '200px' }}>扣分原因</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">负面积分</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">考核人</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">考核部门</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">发起人</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">审批状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: '180px', borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-file-list-3-line text-2xl text-steel-300" /></div>
                        <p className="text-sm text-steel-400">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, idx) => {
                    const statusDef = deductionStatuses.find((s) => s.value === record.status);
                    return (
                      <tr key={record.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.deductionCategory}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.relatedContract}</td>
                        <td className="px-4 py-3 text-sm text-steel-700 max-w-xs"><span className="line-clamp-1">{record.participantName}</span></td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.participantType}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.assessmentDate}</td>
                        <td className="px-4 py-3 text-sm text-steel-700 max-w-xs"><span className="line-clamp-1">{record.reason}</span></td>
                        <td className="px-4 py-3 text-sm text-steel-700 text-center font-medium">{record.score}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.assessor}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.assessorDept}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.initiator}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          {statusDef && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusDef.color}`}>
                              {statusDef.label}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => handleViewApproval(record)} className="flex items-center gap-1 px-2 py-1 text-xs text-steel-600 border border-steel-200 rounded hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-eye-line" /></div>
                              审批记录
                            </button>
                            <button onClick={() => handleCancelApproval(record)} className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors cursor-pointer whitespace-nowrap ${record.status === '待审批' ? 'text-amber-600 border border-amber-200 hover:bg-amber-50' : 'text-steel-400 border border-steel-100 cursor-not-allowed'}`} disabled={record.status !== '待审批'}>
                              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-close-circle-line" /></div>
                              撤销审批
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

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
              {renderPagination().map((page, i) =>
                page === '...' ? (
                  <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-steel-400 text-sm">...</span>
                ) : (
                  <button key={page} onClick={() => setCurrentPage(page as number)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${currentPage === page ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`} style={currentPage === page ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}>{page}</button>
                )
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-right-s-line" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">末页</button>
            </div>
          </div>
        )}
      </div>

      <DeductionModal
        open={modalOpen}
        participantName={participantName}
        participantType={participantType}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitDeduction}
      />

      <ApprovalRecordModal
        open={recordModalOpen}
        record={selectedRecord}
        onClose={() => setRecordModalOpen(false)}
      />
    </Layout>
  );
}