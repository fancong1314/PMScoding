import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import ArgumentDetailModal from '../approval/components/ArgumentDetailModal';
import {
  opinionSignRecords,
  opinionSignStatuses,
  opinionSignProjectTypes,
  opinionSignBuildUnits,
  opinionSignHandlers,
  type OpinionSignRecord,
} from '@/mocks/opinionSignMocks';

const STATUS_COLORS: Record<string, string> = {
  '草稿': 'bg-slate-100 text-slate-600',
  '待签署': 'bg-sky-50 text-sky-700 border border-sky-200',
  '已签署': 'bg-blue-50 text-blue-700 border border-blue-200',
  '待呈核': 'bg-amber-50 text-amber-700 border border-amber-200',
  '审批中': 'bg-amber-50 text-amber-700 border border-amber-200',
  '待确认': 'bg-orange-50 text-orange-700 border border-orange-200',
  '已确认': 'bg-green-50 text-green-700 border border-green-200',
  '待全委会': 'bg-violet-50 text-violet-700 border border-violet-200',
  '全委会审批中': 'bg-purple-50 text-purple-700 border border-purple-200',
};

const ACTIONS_MAP: Record<string, string[]> = {
  '草稿': ['意见签署', '列印'],
  '待签署': ['意见签署', '列印'],
  '已签署': ['呈核', '列印'],
  '待呈核': ['呈核', '列印'],
  '审批中': ['列印'],
  '待确认': ['确认', '取消确认', '列印'],
  '已确认': ['呈核至全委会', '取消确认', '列印'],
  '待全委会': ['呈核至全委会', '列印'],
  '全委会审批中': ['列印'],
};

export default function OpinionSignPage() {
  const navigate = useNavigate();
  const [records] = useState<OpinionSignRecord[]>(opinionSignRecords);

  const [filterApplyNo, setFilterApplyNo] = useState('');
  const [filterPlanNo, setFilterPlanNo] = useState('');
  const [filterApplyName, setFilterApplyName] = useState('');
  const [filterProjectType, setFilterProjectType] = useState('');
  const [filterHandler, setFilterHandler] = useState('');
  const [filterBuildUnit, setFilterBuildUnit] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmContent, setConfirmContent] = useState('');
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailApplyNo, setDetailApplyNo] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterApplyNo && !r.applyNo.includes(filterApplyNo)) return false;
      if (filterPlanNo && !r.planNo.includes(filterPlanNo)) return false;
      if (filterApplyName && !r.applyName.includes(filterApplyName)) return false;
      if (filterProjectType && r.projectType !== filterProjectType) return false;
      if (filterHandler && r.handler !== filterHandler) return false;
      if (filterBuildUnit && r.buildUnit !== filterBuildUnit) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      return true;
    }).sort((a, b) => b.createDate.localeCompare(a.createDate));
  }, [records, filterApplyNo, filterPlanNo, filterApplyName, filterProjectType, filterHandler, filterBuildUnit, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setFilterApplyNo('');
    setFilterPlanNo('');
    setFilterApplyName('');
    setFilterProjectType('');
    setFilterHandler('');
    setFilterBuildUnit('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  const handleSign = (record: OpinionSignRecord) => {
    navigate(`/project-argument/opinion-sign/form?id=${record.id}`);
  };

  const handlePresent = (record: OpinionSignRecord) => {
    setConfirmTitle('呈核确认');
    setConfirmContent(`确定要将论证申请「${record.applyName}」提交至下一审批节点吗？`);
    setConfirmCallback(() => () => {
      showToast('呈核成功，已提交至下一审批节点');
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleConfirm = (record: OpinionSignRecord) => {
    setConfirmTitle('确认处理');
    setConfirmContent(`确定要确认论证申请「${record.applyName}」的处理结果吗？`);
    setConfirmCallback(() => () => {
      showToast('确认成功，记录状态已更新');
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleCancelConfirm = (record: OpinionSignRecord) => {
    setConfirmTitle('取消确认');
    setConfirmContent(`确定要撤销论证申请「${record.applyName}」的已确认状态吗？`);
    setConfirmCallback(() => () => {
      showToast('取消确认成功，记录状态已恢复');
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handlePrint = (record: OpinionSignRecord) => {
    showToast('正在生成论证意见文档，请稍候...');
    setTimeout(() => {
      showToast('文档生成成功，已打开打印预览');
    }, 1500);
  };

  const handlePresentCommittee = (record: OpinionSignRecord) => {
    setConfirmTitle('呈核至全委会确认');
    setConfirmContent(`确定要将论证申请「${record.applyName}」提交至全委会审批吗？`);
    setConfirmCallback(() => () => {
      showToast('呈核至全委会成功，已发送待办通知');
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
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
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-steel-900">论证意见签署</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理论证申请的意见签署流程，支持呈核、确认、列印等操作</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-5 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">论证申请号</label>
              <input value={filterApplyNo} onChange={(e) => setFilterApplyNo(e.target.value)} placeholder="请输入" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">年度计划号</label>
              <input value={filterPlanNo} onChange={(e) => setFilterPlanNo(e.target.value)} placeholder="请输入" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">论证申请名称</label>
              <input value={filterApplyName} onChange={(e) => setFilterApplyName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目类型</label>
              <select value={filterProjectType} onChange={(e) => setFilterProjectType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {opinionSignProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">总师室经办人</label>
              <select value={filterHandler} onChange={(e) => setFilterHandler(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {opinionSignHandlers.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">建设单位</label>
              <select value={filterBuildUnit} onChange={(e) => setFilterBuildUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {opinionSignBuildUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">状态</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {opinionSignStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
                重置
              </button>
              <button onClick={() => setCurrentPage(1)}
                className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
                查询
              </button>
            </div>
          </div>
        </div>

        {/* Count */}
        <div className="text-xs text-steel-400">
          共 <span className="font-semibold text-steel-700">{filtered.length}</span> 条记录
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1100px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">项次</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">论证申请单号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '280px' }}>论证申请单名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">是否效益项目</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">建立日期</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: '360px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100">
                          <i className="ri-file-list-3-line text-2xl text-steel-300" />
                        </div>
                        <p className="text-sm text-steel-400">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, idx) => {
                    const actions = ACTIONS_MAP[record.status] || ['列印'];
                    return (
                      <tr key={record.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="px-4 py-3 text-sm font-mono whitespace-nowrap"><button onClick={() => { setDetailApplyNo(record.applyNo); setDetailOpen(true); }} className="text-primary-600 hover:text-primary-800 hover:underline cursor-pointer transition-colors">{record.applyNo}</button></td>
                        <td className="px-4 py-3 text-sm text-steel-800 max-w-xs">
                          <span className="line-clamp-2">{record.applyName}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.projectType}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${record.isBenefit ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600'}`}>
                            {record.isBenefit ? '是' : '否'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{record.createDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[record.status] || 'bg-slate-100 text-slate-600'}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {actions.map((action) => {
                              if (action === '意见签署') {
                                return (
                                  <button key={action} onClick={() => handleSign(record)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                                    <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-edit-line" /></div>
                                    {action}
                                  </button>
                                );
                              }
                              if (action === '呈核') {
                                return (
                                  <button key={action} onClick={() => handlePresent(record)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-amber-700 border border-amber-200 rounded-md hover:bg-amber-50 transition-colors cursor-pointer whitespace-nowrap">
                                    <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-send-plane-line" /></div>
                                    {action}
                                  </button>
                                );
                              }
                              if (action === '确认') {
                                return (
                                  <button key={action} onClick={() => handleConfirm(record)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-green-700 border border-green-200 rounded-md hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap">
                                    <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-check-line" /></div>
                                    {action}
                                  </button>
                                );
                              }
                              if (action === '取消确认') {
                                return (
                                  <button key={action} onClick={() => handleCancelConfirm(record)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap">
                                    <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-close-line" /></div>
                                    {action}
                                  </button>
                                );
                              }
                              if (action === '列印') {
                                return (
                                  <button key={action} onClick={() => handlePrint(record)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                                    <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-printer-line" /></div>
                                    {action}
                                  </button>
                                );
                              }
                              if (action === '呈核至全委会') {
                                return (
                                  <button key={action} onClick={() => handlePresentCommittee(record)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-violet-700 border border-violet-200 rounded-md hover:bg-violet-50 transition-colors cursor-pointer whitespace-nowrap">
                                    <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-government-line" /></div>
                                    {action}
                                  </button>
                                );
                              }
                              return null;
                            })}
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

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{filtered.length}</span> 条</span>
              <span>第 <span className="font-medium text-steel-700">{currentPage}</span>/{totalPages} 页</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none">
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
              </select>
              <button onClick={() => { setCurrentPage(1); showToast('列表已刷新'); }}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 cursor-pointer"
                title="刷新">
                <i className="ri-refresh-line" />
              </button>
              <button onClick={() => showToast('正在生成打印预览...')}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 cursor-pointer"
                title="打印">
                <i className="ri-printer-line" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">
                首页
              </button>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <i className="ri-arrow-left-s-line" />
              </button>
              {renderPagination().map((page, i) =>
                page === '...' ? (
                  <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-steel-400 text-sm">···</span>
                ) : (
                  <button key={page} onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${currentPage === page ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`}
                    style={currentPage === page ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}>
                    {page}
                  </button>
                )
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <i className="ri-arrow-right-s-line" />
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">
                末页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[420px] p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-question-line text-lg text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-steel-800 mb-1">{confirmTitle}</h3>
                <p className="text-sm text-steel-500">{confirmContent}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                取消
              </button>
              <button onClick={confirmCallback}
                className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      <ArgumentDetailModal open={detailOpen} applyNo={detailApplyNo} onClose={() => setDetailOpen(false)} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={toast.type === 'success' ? 'ri-checkbox-circle-line text-green-500' : 'ri-close-circle-line text-red-500'} />
            </div>
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{toast.message}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}