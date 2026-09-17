import { useMemo, useState } from 'react';
import Layout from '@/components/feature/Layout';
import {
  planArchiveRecords,
  planArchiveYears,
  planArchiveMajorCategories,
  planArchiveProjectTypes,
  planArchiveUnits,
  PLAN_ARCHIVE_CURRENT_YEAR,
  PRIORITY_SORT_ORDER,
} from '@/mocks/planArchiveMocks';
import type { PlanArchiveRecord } from '@/mocks/planArchiveMocks';
import ArchiveSummaryCharts from './components/ArchiveSummaryCharts';
import ArchiveTable from './components/ArchiveTable';
import EditControlAmountModal from './components/EditControlAmountModal';
import OccupyDetailModal from './components/OccupyDetailModal';
import PlanReviewDetailModal from '@/pages/project-plan/plan-review/components/PlanReviewDetailModal';
import DeclOperationLogModal from '@/pages/project-plan/declaration/components/DeclOperationLogModal';

export default function PlanArchivePage() {
  const [records, setRecords] = useState<PlanArchiveRecord[]>(() =>
    planArchiveRecords.map((r) => ({ ...r })),
  );

  const [filterYear, setFilterYear] = useState('');
  const [filterMajor, setFilterMajor] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [prioritySortDir, setPrioritySortDir] = useState<'none' | 'asc' | 'desc'>('none');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailTarget, setDetailTarget] = useState<PlanArchiveRecord | null>(null);
  const [logTarget, setLogTarget] = useState<PlanArchiveRecord | null>(null);
  const [editControlTarget, setEditControlTarget] = useState<PlanArchiveRecord | null>(null);
  const [occupyTarget, setOccupyTarget] = useState<PlanArchiveRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = useMemo(() => {
    let list = records.filter((r) => {
      if (filterYear && r.planYear !== filterYear) return false;
      if (filterMajor && r.projectMajorCategory !== filterMajor) return false;
      if (filterType && r.projectType !== filterType) return false;
      if (filterName && !r.planName.includes(filterName)) return false;
      if (filterUnit && r.businessUnit !== filterUnit) return false;
      return true;
    });
    if (prioritySortDir !== 'none') {
      list = [...list].sort((a, b) => {
        const pa = PRIORITY_SORT_ORDER[a.priorityLevel] ?? 99;
        const pb = PRIORITY_SORT_ORDER[b.priorityLevel] ?? 99;
        return prioritySortDir === 'desc' ? pb - pa : pa - pb;
      });
    }
    return list;
  }, [records, filterYear, filterMajor, filterType, filterName, filterUnit, prioritySortDir]);

  const displayList = useMemo(() => {
    const base = filtered.length > 0 ? filtered : records;
    let list = base.filter((r) => r.reviewOutcome === 'approved');
    if (list.length === 0) {
      list = records.filter((r) => r.reviewOutcome === 'approved');
    }
    if (prioritySortDir !== 'none') {
      list = [...list].sort((a, b) => {
        const pa = PRIORITY_SORT_ORDER[a.priorityLevel] ?? 99;
        const pb = PRIORITY_SORT_ORDER[b.priorityLevel] ?? 99;
        return prioritySortDir === 'desc' ? pb - pa : pa - pb;
      });
    }
    return list;
  }, [filtered, records, prioritySortDir]);

  /** 统计用：筛选后含已通过 + 已驳回 */
  const statsList = useMemo(() => {
    if (filtered.length > 0) return filtered;
    return records;
  }, [filtered, records]);

  const usedFallback = filtered.length === 0 && records.length > 0
    && !!(filterYear || filterMajor || filterType || filterName || filterUnit);

  const totalPages = Math.ceil(displayList.length / pageSize) || 1;
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = displayList.slice(pageOffset, pageOffset + pageSize);

  const handlePrioritySort = () => {
    setPrioritySortDir((prev) => {
      if (prev === 'none') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'none';
    });
  };

  const handleReset = () => {
    setFilterYear('');
    setFilterMajor('');
    setFilterType('');
    setFilterName('');
    setFilterUnit('');
    setPrioritySortDir('none');
    setCurrentPage(1);
  };

  const handleQuery = () => {
    setCurrentPage(1);
    if (filtered.length === 0 && records.length > 0) {
      showToast('无匹配结果，已展示全部已通过计划');
    }
  };

  const handleExport = () => {
    showToast(`正在导出 ${displayList.length} 条已通过年度计划...`);
  };

  const handleSubmitControlAmount = (recordId: string, newControlAmount: number) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              amountStatus: '审批中',
              pendingControlAmount: newControlAmount,
            }
          : r,
      ),
    );
    showToast('费用增补已提交，金额状态为「审批中」');
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

  const inputCls = 'w-full px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">年度计划总览</h1>
            <p className="text-xs text-steel-400 mt-0.5">
              汇集项目部审查通过的年度计划档案，支持汇总分析与多维检索（当前统计口径：{PLAN_ARCHIVE_CURRENT_YEAR}年）
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
          >
            <i className="ri-file-excel-2-line" />
            导出清单
          </button>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-2.5">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">计划年度</label>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部年度</option>
                {planArchiveYears.map((y) => <option key={y} value={y}>{y}年</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目大类</label>
              <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部大类</option>
                {planArchiveMajorCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目类型</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部类型</option>
                {planArchiveProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">年度计划名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="模糊搜索计划名称" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目提报单位</label>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部单位</option>
                {planArchiveUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={handleQuery}
                className="flex items-center gap-1.5 px-5 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg,#1e3a5f,#2d5a8e)' }}>
                <i className="ri-search-line" />查询
              </button>
              <button type="button" onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                <i className="ri-refresh-line" />重置
              </button>
            </div>
          </div>
        </div>

        {usedFallback && (
          <p className="text-xs text-amber-600 -mt-2">当前筛选无匹配结果，已展示全部已通过演示数据</p>
        )}

        <ArchiveSummaryCharts records={statsList} />

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-steel-800">已通过年度计划清单</h2>
          <span className="text-xs text-steel-400">
            共 <span className="font-semibold text-steel-700">{displayList.length}</span> 条
          </span>
        </div>

        <ArchiveTable
          records={paginated}
          pageOffset={pageOffset}
          sortDir={prioritySortDir}
          onPrioritySort={handlePrioritySort}
          onView={setDetailTarget}
          onViewLog={setLogTarget}
          onEditControlAmount={setEditControlTarget}
          onViewOccupy={setOccupyTarget}
        />

        {displayList.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-2.5">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{displayList.length}</span> 条</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none"
              >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <i className="ri-arrow-left-s-line" />
              </button>
              {renderPagination().map((page, i) =>
                page === '...' ? (
                  <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-steel-400 text-sm">···</span>
                ) : (
                  <button key={page} type="button" onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer ${
                      currentPage === page ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'
                    }`}
                    style={currentPage === page ? { background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' } : undefined}>
                    {page}
                  </button>
                )
              )}
              <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <i className="ri-arrow-right-s-line" />
              </button>
            </div>
          </div>
        )}
      </div>

      <PlanReviewDetailModal
        open={!!detailTarget}
        linkedPlanId={detailTarget?.linkedPlanId || ''}
        fallbackName={detailTarget?.planName}
        onClose={() => setDetailTarget(null)}
      />

      <DeclOperationLogModal
        open={!!logTarget}
        planId={logTarget?.linkedPlanId || ''}
        planName={logTarget?.planName || ''}
        onClose={() => setLogTarget(null)}
      />

      <EditControlAmountModal
        open={!!editControlTarget}
        record={editControlTarget}
        onClose={() => setEditControlTarget(null)}
        onSubmit={handleSubmitControlAmount}
      />

      <OccupyDetailModal
        open={!!occupyTarget}
        record={occupyTarget}
        onClose={() => setOccupyTarget(null)}
      />

      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border bg-sky-50 border-sky-200">
            <i className="ri-information-line text-sky-500" />
            <span className="text-sm text-sky-700">{toast}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
