import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  argumentApplyRecords,
  argumentProjectTypes,
  argumentBuildUnits,
} from '@/mocks/argumentApplyMocks';
import type { ArgumentApplyRecord } from '@/mocks/argumentApplyMocks';
import ConfirmModal from '@/pages/project-plan/declaration/components/ConfirmModal';
import ArgumentDetailModal from '../approval/components/ArgumentDetailModal';

const STATUS_COLORS: Record<string, string> = {
  草稿: 'bg-slate-100 text-slate-600',
  审批中: 'bg-amber-50 text-amber-700 border border-amber-200',
  已通过: 'bg-green-50 text-green-700 border border-green-200',
  已驳回: 'bg-red-50 text-red-700 border border-red-200',
};

export default function ArgumentApplyPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ArgumentApplyRecord[]>(argumentApplyRecords);

  const [filterApplyNo, setFilterApplyNo] = useState('');
  const [filterApplyName, setFilterApplyName] = useState('');
  const [filterProjectType, setFilterProjectType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBuildUnit, setFilterBuildUnit] = useState('');
  const [filterPlanNo, setFilterPlanNo] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: '', content: '', onConfirm: () => {}, confirmText: '确认', confirmType: 'danger' as 'danger' | 'primary' | 'warning',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailApplyNo, setDetailApplyNo] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterApplyNo && !r.applyNo.includes(filterApplyNo)) return false;
      if (filterApplyName && !r.applyName.includes(filterApplyName)) return false;
      if (filterProjectType && r.projectType !== filterProjectType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterBuildUnit && r.buildUnit !== filterBuildUnit) return false;
      if (filterPlanNo && !r.planNo.includes(filterPlanNo)) return false;
      if (filterStartDate && r.applyDate < filterStartDate) return false;
      if (filterEndDate && r.applyDate > filterEndDate) return false;
      return true;
    }).sort((a, b) => b.applyDate.localeCompare(a.applyDate));
  }, [records, filterApplyNo, filterApplyName, filterProjectType, filterStatus, filterBuildUnit, filterPlanNo, filterStartDate, filterEndDate]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setFilterApplyNo(''); setFilterApplyName(''); setFilterProjectType('');
    setFilterStatus(''); setFilterBuildUnit(''); setFilterPlanNo('');
    setFilterStartDate(''); setFilterEndDate(''); setCurrentPage(1);
  };

  const handleDelete = (record: ArgumentApplyRecord) => {
    if (record.status !== '草稿') {
      showToast('仅草稿状态的记录可删除', 'error');
      return;
    }
    setConfirmConfig({
      title: '删除确认',
      content: `确定要删除论证申请「${record.applyName}」吗？删除后将无法恢复。`,
      onConfirm: () => {
        setRecords((prev) => prev.filter((r) => r.id !== record.id));
        showToast('删除成功');
        setConfirmOpen(false);
      },
      confirmText: '确认删除',
      confirmType: 'danger',
    });
    setConfirmOpen(true);
  };

  const renderPagination = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
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
          <h1 className="text-lg font-semibold text-steel-900">项目论证申请</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理项目论证申请的全流程，支持新增、编辑、审批</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-5 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">论证申请单号</label>
              <input value={filterApplyNo} onChange={(e) => setFilterApplyNo(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">论证申请名称</label>
              <input value={filterApplyName} onChange={(e) => setFilterApplyName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目类型</label>
              <select value={filterProjectType} onChange={(e) => setFilterProjectType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {argumentProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">状态</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                <option value="草稿">草稿</option>
                <option value="审批中">审批中</option>
                <option value="已通过">已通过</option>
                <option value="已驳回">已驳回</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">建设单位</label>
              <select value={filterBuildUnit} onChange={(e) => setFilterBuildUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {argumentBuildUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">年度计划号</label>
              <input value={filterPlanNo} onChange={(e) => setFilterPlanNo(e.target.value)} placeholder="请输入" className={inputCls} />
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">申报日期</label>
              <div className="flex-1 flex items-center gap-1.5">
                <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="flex-1 px-2 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-slate-50" />
                <span className="text-steel-400 text-xs flex-shrink-0">至</span>
                <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="flex-1 px-2 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-slate-50" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-steel-100">
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

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/project-argument/apply/form')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
            新增
          </button>
          <div className="text-xs text-steel-400">
            共 <span className="font-semibold text-steel-700">{filtered.length}</span> 条记录
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1100px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">论证申请单号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '260px' }}>论证申请名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">申报费用（万元）</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">建设单位</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">事业部</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目经理</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">申报日期</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: '140px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100">
                          <i className="ri-file-list-3-line text-2xl text-steel-300" />
                        </div>
                        <p className="text-sm text-steel-400">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, idx) => (
                    <tr key={record.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-mono whitespace-nowrap"><button onClick={() => { setDetailApplyNo(record.applyNo); setDetailOpen(true); }} className="text-primary-600 hover:text-primary-800 hover:underline cursor-pointer transition-colors">{record.applyNo}</button></td>
                      <td className="px-4 py-3 text-sm text-steel-800 max-w-xs">
                        <span className="line-clamp-2">{record.applyName}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.projectType}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap font-medium">{record.applyAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.buildUnit}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.division}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.projectManager}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[record.status]}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{record.applyDate}</td>
                      <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => navigate(`/project-argument/apply/form?id=${record.id}&mode=view`)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                            <i className="ri-eye-line" />
                            查看
                          </button>
                          {(record.status === '草稿' || record.status === '已驳回') && (
                            <button
                              onClick={() => navigate(`/project-argument/apply/form?id=${record.id}&mode=edit`)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap">
                              <i className="ri-edit-line" />
                              编辑
                            </button>
                          )}
                          {record.status === '草稿' && (
                            <button
                              onClick={() => handleDelete(record)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap">
                              <i className="ri-delete-bin-line" />
                              删除
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
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
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none">
                <option value={15}>15条/页</option>
                <option value={30}>30条/页</option>
                <option value={50}>50条/页</option>
              </select>
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
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <i className="ri-arrow-right-s-line" />
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">
                末页
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal open={confirmOpen} title={confirmConfig.title} content={confirmConfig.content}
        onClose={() => setConfirmOpen(false)} onConfirm={confirmConfig.onConfirm}
        confirmText={confirmConfig.confirmText} confirmType={confirmConfig.confirmType} />

      <ArgumentDetailModal open={detailOpen} applyNo={detailApplyNo} onClose={() => setDetailOpen(false)} />

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
