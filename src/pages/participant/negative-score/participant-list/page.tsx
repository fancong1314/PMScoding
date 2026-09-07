import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { participants, participantTypes, deductionRecords, type Participant } from '@/mocks/participantManagementMocks';

export default function ParticipantListPage() {
  const navigate = useNavigate();
  const [records] = useState<Participant[]>(participants);

  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterYear, setFilterYear] = useState('2026');
  const [sortDesc, setSortDesc] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Compute scores per participant from deduction records filtered by year
  const participantScores = useMemo(() => {
    const yearFiltered = deductionRecords.filter((r) => r.assessmentDate.startsWith(filterYear));
    const scoreMap: Record<string, number> = {};
    yearFiltered.forEach((r) => {
      scoreMap[r.participantId] = (scoreMap[r.participantId] || 0) + r.score;
    });
    return scoreMap;
  }, [filterYear]);

  const filtered = useMemo(() => {
    let data = records.filter((r) => {
      if (filterName && !r.name.includes(filterName)) return false;
      if (filterType && r.type !== filterType) return false;
      if (filterCode && !r.code.includes(filterCode)) return false;
      return true;
    });
    data = data.sort((a, b) => {
      const scoreA = participantScores[a.id] || 0;
      const scoreB = participantScores[b.id] || 0;
      return sortDesc ? scoreB - scoreA : scoreA - scoreB;
    });
    return data;
  }, [records, filterName, filterType, filterCode, participantScores, sortDesc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setFilterName('');
    setFilterType('');
    setFilterCode('');
    setFilterYear('2026');
    setSortDesc(true);
    setCurrentPage(1);
  };

  const handleViewDeductions = (pt: Participant) => {
    navigate(`/participant/negative-score/deduction-list?participantId=${pt.id}&participantName=${encodeURIComponent(pt.name)}&participantType=${encodeURIComponent(pt.type)}`);
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
        <div>
          <h1 className="text-lg font-semibold text-steel-900">负面积分管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">参建方负面积分排名与扣分明细管理</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">单位名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="请输入单位名称" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">单位类型</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {participantTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">单位编号</label>
              <input value={filterCode} onChange={(e) => setFilterCode(e.target.value)} placeholder="请输入单位编号" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">考核日期</label>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={inputCls + ' cursor-pointer'}>
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
              <span className="text-sm text-steel-700 font-medium">参建方列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-success-600 border border-success-200 rounded-md hover:bg-success-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-excel-line" /></div>
                导出排名
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-list-line" /></div>
                导出扣分明细
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '900px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '280px' }}>单位名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">单位类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">单位编号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap cursor-pointer select-none" onClick={() => setSortDesc(!sortDesc)}>
                    <div className="flex items-center gap-1">
                      负面积分合计
                      <div className="w-3.5 h-3.5 flex items-center justify-center">
                        <i className={sortDesc ? 'ri-arrow-down-line' : 'ri-arrow-up-line'} />
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-file-list-3-line text-2xl text-steel-300" /></div>
                        <p className="text-sm text-steel-400">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, idx) => {
                    const dynamicScore = participantScores[record.id] || 0;
                    const isWarning = dynamicScore > 20;
                    return (
                      <tr key={record.id} className={`border-b border-steel-100 hover:bg-slate-50 transition-colors ${isWarning ? 'bg-red-50/40' : ''}`}>
                        <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-steel-800 font-medium max-w-xs"><span className="line-clamp-1">{record.name}</span></td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.type === '监理' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            record.type === '施工方' ? 'bg-green-50 text-green-700 border border-green-200' :
                            record.type === '设计' ? 'bg-violet-50 text-violet-700 border border-violet-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-steel-600 whitespace-nowrap">{record.code}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span className={`font-bold ${isWarning ? 'text-red-600' : 'text-steel-700'}`}>
                            {dynamicScore}
                          </span>
                          {isWarning && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                              <div className="w-3 h-3 flex items-center justify-center mr-0.5"><i className="ri-alert-line" /></div>
                              预警
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center">
                            <button onClick={() => handleViewDeductions(record)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                              <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-list-line" /></div>
                              扣分明细
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
    </Layout>
  );
}