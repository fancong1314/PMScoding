import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  OVERVIEW_STORAGE_KEY,
  initiationOverviewRecords as initial,
  overviewProjectTypes,
  overviewStatusOptions,
  overviewUnits,
  type InitiationOverviewRecord,
  type OverviewProjectStatus,
} from '@/mocks/initiationOverviewMocks';
import DeclOperationLogModal from '@/pages/project-initiation/declaration/components/DeclOperationLogModal';
import OverviewTable from './components/OverviewTable';

function getStored(): InitiationOverviewRecord[] {
  try {
    const s = localStorage.getItem(OVERVIEW_STORAGE_KEY);
    if (s) {
      const parsed = JSON.parse(s) as InitiationOverviewRecord[];
      // 兼容旧缓存：缺字段时回退 seed
      if (parsed.every((r) => r.linkedPlanId && r.lifecycleStage)) return parsed;
    }
    localStorage.removeItem('ng_init_overview_v1');
    localStorage.removeItem('ng_init_overview_v2');
    localStorage.removeItem('ng_init_overview_v3');
  } catch { /* noop */ }
  return initial.map((r) => ({ ...r }));
}

export default function InitiationOverviewPage() {
  const navigate = useNavigate();
  const [records] = useState<InitiationOverviewRecord[]>(() => getStored());
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [logTarget, setLogTarget] = useState<InitiationOverviewRecord | null>(null);

  const [filterName, setFilterName] = useState('');
  const [filterApprovalNo, setFilterApprovalNo] = useState('');
  const [filterPlanNo, setFilterPlanNo] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState<OverviewProjectStatus | ''>('');
  const [filterManager, setFilterManager] = useState('');
  const [approvalFrom, setApprovalFrom] = useState('');
  const [approvalTo, setApprovalTo] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem(OVERVIEW_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const hasFilter = !!(
    filterName || filterApprovalNo || filterPlanNo || filterUnit || filterType
    || filterStatus || filterManager || approvalFrom || approvalTo
  );

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterName && !r.projectName.includes(filterName)) return false;
      if (filterApprovalNo && !r.approvalNo.includes(filterApprovalNo)) return false;
      if (filterPlanNo && !(r.annualPlanNo || '').includes(filterPlanNo)) return false;
      if (filterUnit && r.businessUnit !== filterUnit) return false;
      if (filterType && r.projectType !== filterType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterManager && !r.projectManager.includes(filterManager)) return false;
      if (approvalFrom && r.approvalDate < approvalFrom) return false;
      if (approvalTo && r.approvalDate > approvalTo) return false;
      return true;
    });
  }, [
    records, filterName, filterApprovalNo, filterPlanNo, filterUnit, filterType,
    filterStatus, filterManager, approvalFrom, approvalTo,
  ]);

  const displayList = filtered.length > 0 || !hasFilter ? filtered : records;
  const usedFallback = filtered.length === 0 && displayList.length > 0;

  const totalBudget = useMemo(() => displayList.reduce((s, r) => s + r.budgetAmount, 0), [displayList]);
  const totalActual = useMemo(() => displayList.reduce((s, r) => s + r.actualAmount, 0), [displayList]);
  const totalPages = Math.ceil(displayList.length / pageSize) || 1;
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = displayList.slice(pageOffset, pageOffset + pageSize);

  const handleReset = () => {
    setFilterName('');
    setFilterApprovalNo('');
    setFilterPlanNo('');
    setFilterUnit('');
    setFilterType('');
    setFilterStatus('');
    setFilterManager('');
    setApprovalFrom('');
    setApprovalTo('');
    setCurrentPage(1);
  };

  const handleExport = () => {
    const n = selectedRows.length > 0 ? selectedRows.length : displayList.length;
    showToast(`正在导出 ${n} 条数据...`, 'info');
  };

  const handleView = (record: InitiationOverviewRecord) => {
    navigate(`/project-initiation/overview/detail?id=${record.id}`);
  };

  const handleViewLog = (record: InitiationOverviewRecord) => {
    setLogTarget(record);
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
          <h1 className="text-lg font-semibold text-steel-900">项目总览</h1>
          <p className="text-xs text-steel-400 mt-0.5">已立项项目全量清单，支持按状态与关键信息检索、导出与详情查看</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="根据项目名称模糊搜索" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">立项号</label>
              <input value={filterApprovalNo} onChange={(e) => setFilterApprovalNo(e.target.value)} placeholder="根据立项号搜索" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">年度计划号</label>
              <input value={filterPlanNo} onChange={(e) => setFilterPlanNo(e.target.value)} placeholder="根据年度计划号搜索" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目提报单位</label>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部单位</option>
                {overviewUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目类型</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部类型</option>
                {overviewProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as OverviewProjectStatus | '')}
                className={inputCls + ' cursor-pointer'}
              >
                {overviewStatusOptions.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目负责人</label>
              <input value={filterManager} onChange={(e) => setFilterManager(e.target.value)} placeholder="根据负责人模糊搜索" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">立项日期</label>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <input type="date" value={approvalFrom} onChange={(e) => setApprovalFrom(e.target.value)} className={inputCls + ' cursor-pointer'} title="起始日期" />
                <span className="text-xs text-steel-400 flex-shrink-0">至</span>
                <input type="date" value={approvalTo} onChange={(e) => setApprovalTo(e.target.value)} className={inputCls + ' cursor-pointer'} title="结束日期" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-steel-100">
            <button type="button" onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              <i className="ri-refresh-line" />重置
            </button>
            <button type="button" onClick={() => setCurrentPage(1)}
              className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#1e3a5f,#2d5a8e)' }}>
              <i className="ri-search-line" />查询
            </button>
          </div>
        </div>

        {usedFallback && (
          <p className="text-xs text-amber-600 -mt-2">当前筛选无匹配结果，已展示全部演示数据</p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2">
          <button type="button" onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
            <i className="ri-file-excel-2-line" />导出
          </button>
          <div className="flex items-center gap-1.5 text-sm text-steel-500 bg-white border border-steel-200 rounded-lg px-3 py-2">
            <i className="ri-bar-chart-box-line text-steel-400" />
            <span>共</span>
            <span className="font-semibold text-steel-800">{displayList.length}</span>
            <span>项</span>
            {selectedRows.length > 0 && (
              <>
                <span className="text-steel-300 mx-1">|</span>
                <span>已选</span>
                <span className="font-semibold text-primary-600">{selectedRows.length}</span>
                <span>项</span>
              </>
            )}
          </div>
        </div>

        <OverviewTable
          records={paginated}
          selectedRows={selectedRows}
          pageOffset={pageOffset}
          totalCount={displayList.length}
          totalBudget={totalBudget}
          totalActual={totalActual}
          onToggleSelectAll={() => {
            const ids = paginated.map((r) => r.id);
            const allOnPage = ids.every((id) => selectedRows.includes(id));
            setSelectedRows((prev) =>
              allOnPage ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids]))
            );
          }}
          onToggleSelectRow={(id) =>
            setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
          }
          onView={handleView}
          onViewLog={handleViewLog}
        />

        {displayList.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{displayList.length}</span> 条记录</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer">
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 disabled:opacity-40 cursor-pointer">
                <i className="ri-arrow-left-s-line" />
              </button>
              {renderPagination().map((page, i) =>
                page === '...' ? (
                  <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-steel-400 text-sm">···</span>
                ) : (
                  <button key={page} type="button" onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer ${
                      currentPage === page ? 'text-white' : 'border border-steel-200 text-steel-600'
                    }`}
                    style={currentPage === page ? { background: 'linear-gradient(135deg,#1e3a5f,#2d5a8e)' } : undefined}>
                    {page}
                  </button>
                )
              )}
              <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 disabled:opacity-40 cursor-pointer">
                <i className="ri-arrow-right-s-line" />
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${
            toast.type === 'success' ? 'bg-green-50 border-green-200' :
            toast.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-sky-50 border-sky-200'
          }`}>
            <span className={`text-sm ${
              toast.type === 'success' ? 'text-green-700' :
              toast.type === 'error' ? 'text-red-700' : 'text-sky-700'
            }`}>{toast.msg}</span>
          </div>
        </div>
      )}

      <DeclOperationLogModal
        open={!!logTarget}
        planId={logTarget?.id || ''}
        planName={logTarget?.projectName || ''}
        linkedPlanId={logTarget?.linkedPlanId}
        mode="overview"
        onClose={() => setLogTarget(null)}
      />
    </Layout>
  );
}
