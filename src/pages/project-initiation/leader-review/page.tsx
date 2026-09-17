import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  leaderReviewRecords as initial,
  leaderReviewYears,
  leaderReviewMajorCategories,
  leaderReviewUnits,
  LEADER_REVIEW_TABS,
} from '@/mocks/planLeaderReviewMocks';
import type { LeaderReviewRecord, LeaderReviewStatus } from '@/mocks/planLeaderReviewMocks';
import { initiationMajorTypeFormPath } from '@/mocks/projectPlans';
import type { ProjectMajorType } from '@/mocks/projectPlans';
import LeaderReviewTable from './components/LeaderReviewTable';
import type { RowAction, LeaderSortField } from './components/LeaderReviewTable';
import LeaderActionModal from './components/LeaderActionModal';

const STORAGE_KEY = 'ng_init_leader_review_v5';

/** 立项签发 TAB：已通过 → 已立项（不影响年度计划签发） */
const INIT_LEADER_REVIEW_TABS = LEADER_REVIEW_TABS.map((t) =>
  t.key === 'leader_passed' ? { ...t, label: '已立项' } : t
);

function getStored(): LeaderReviewRecord[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) {
      const list = JSON.parse(s) as Array<LeaderReviewRecord & { status: string }>;
      return list.map((r) => {
        // 旧「已修改 / 已通过(approved)」并入已立项
        if (r.status === 'modified' || r.status === 'approved') {
          return { ...r, status: 'leader_passed' as LeaderReviewStatus };
        }
        return r as LeaderReviewRecord;
      });
    }
    localStorage.removeItem('ng_init_leader_review_v4');
    localStorage.removeItem('ng_init_leader_review_v3');
    localStorage.removeItem('ng_init_leader_review_v2');
    localStorage.removeItem('ng_init_leader_review_v1');
  } catch { /* noop */ }
  return initial.map((r) => ({ ...r }));
}

type ActionKind = 'present' | 'return' | 'reject' | 'pass' | 'restore' | null;

export default function LeaderReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState<LeaderReviewRecord[]>(() => getStored());
  const [activeTab, setActiveTab] = useState<LeaderReviewStatus>('pending_present');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [filterYear, setFilterYear] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterMajor, setFilterMajor] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [startTo, setStartTo] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [headerSortField, setHeaderSortField] = useState<LeaderSortField | null>(null);
  const [headerSortDir, setHeaderSortDir] = useState<'none' | 'desc' | 'asc'>('none');

  const [actionKind, setActionKind] = useState<ActionKind>(null);
  const [actionIds, setActionIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    setSelectedRows([]);
    setCurrentPage(1);
  }, [activeTab]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const st = location.state as { success?: boolean; message?: string; tab?: LeaderReviewStatus } | null;
    if (!st?.message) return;
    showToast(st.message, st.success === false ? 'error' : 'success');
    const tabKeys = INIT_LEADER_REVIEW_TABS.map((t) => t.key);
    if (st.tab && tabKeys.includes(st.tab)) setActiveTab(st.tab);
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let list = records.filter((r) => {
      if (r.status !== activeTab) return false;
      if (filterYear && r.planYear !== filterYear) return false;
      if (filterName && !r.planName.includes(filterName)) return false;
      if (filterMajor && r.projectMajorCategory !== filterMajor) return false;
      if (filterUnit && r.businessUnit !== filterUnit) return false;
      if (startFrom && r.startDate < startFrom) return false;
      if (startTo && r.startDate > startTo) return false;
      return true;
    });
    if (headerSortField && headerSortDir !== 'none') {
      list = [...list].sort((a, b) => {
        const va = a[headerSortField];
        const vb = b[headerSortField];
        return headerSortDir === 'desc' ? vb - va : va - vb;
      });
    }
    return list;
  }, [records, activeTab, filterYear, filterName, filterMajor, filterUnit, startFrom, startTo, headerSortField, headerSortDir]);

  const displayList = useMemo(() => {
    if (filtered.length > 0) return filtered;
    return records.filter((r) => r.status === activeTab);
  }, [filtered, records, activeTab]);

  const usedFallback = filtered.length === 0 && displayList.length > 0;

  const totalBudget = useMemo(() => displayList.reduce((s, r) => s + r.budget, 0), [displayList]);
  const totalPages = Math.ceil(displayList.length / pageSize) || 1;
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = displayList.slice(pageOffset, pageOffset + pageSize);

  const handleHeaderSort = (field: LeaderSortField) => {
    setHeaderSortField(field);
    setHeaderSortDir((prev) => {
      if (headerSortField !== field) return 'desc';
      if (prev === 'none') return 'desc';
      if (prev === 'desc') return 'asc';
      return 'none';
    });
  };

  const handleReset = () => {
    setFilterYear('');
    setFilterName('');
    setFilterMajor('');
    setFilterUnit('');
    setStartFrom('');
    setStartTo('');
    setHeaderSortField(null);
    setHeaderSortDir('none');
    setCurrentPage(1);
  };

  const openBatchAction = (kind: ActionKind) => {
    if (selectedRows.length === 0) {
      showToast('请先勾选需要操作的项目', 'error');
      return;
    }
    setActionIds([...selectedRows]);
    setActionKind(kind);
  };

  const openSingleAction = (kind: ActionKind, id: string) => {
    setActionIds([id]);
    setActionKind(kind);
  };

  const applyStatus = (ids: string[], status: LeaderReviewStatus, reason?: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              status,
              cancelReason: reason !== undefined ? reason : (status === 'pending_present' ? undefined : r.cancelReason),
            }
          : r
      )
    );
    setSelectedRows((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const handleActionConfirm = (reason: string) => {
    const ids = [...actionIds];
    const count = ids.length;
    if (actionKind === 'present') {
      applyStatus(ids, 'leader_reviewing');
      showToast(`已呈核至领导并发起审批，共 ${count} 条`);
      setActiveTab('leader_reviewing');
    } else if (actionKind === 'return') {
      applyStatus(ids, 'returned', reason);
      showToast(`已退回 ${count} 条项目`, 'info');
      setActiveTab('returned');
    } else if (actionKind === 'reject') {
      applyStatus(ids, 'rejected', reason);
      showToast(`已驳回 ${count} 条项目`, 'info');
    } else if (actionKind === 'pass') {
      applyStatus(ids, 'leader_passed');
      showToast(`已立项下达 ${count} 条项目`);
      setActiveTab('leader_passed');
    } else if (actionKind === 'restore') {
      applyStatus(ids, 'pending_present');
      showToast(`已恢复 ${count} 条项目至待呈核`);
      setActiveTab('pending_present');
    }
    setActionKind(null);
    setActionIds([]);
  };

  const handleExport = () => {
    const n = selectedRows.length > 0 ? selectedRows.length : displayList.length;
    showToast(`正在导出 ${n} 条数据...`, 'info');
  };

  const handleRowAction = (action: RowAction, record: LeaderReviewRecord) => {
    const major = record.projectMajorCategory as ProjectMajorType;
    const base = initiationMajorTypeFormPath[major] || initiationMajorTypeFormPath['技改'];
    if (action === 'view') {
      navigate(`${base}?id=${record.linkedPlanId}&mode=review`);
      return;
    }
    if (action === 'edit') {
      if (activeTab === 'leader_passed') {
        navigate(`${base}?id=${record.linkedPlanId}&from=leader-review&lrId=${record.id}`);
      } else {
        navigate(`${base}?id=${record.linkedPlanId}`);
      }
      return;
    }
    openSingleAction(action, record.id);
  };

  const showPresentBatch = activeTab === 'pending_present';
  const showPendingActionBatch = activeTab === 'pending_present';
  const showRestoreBatch = activeTab === 'leader_returned';

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

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

  const actionModalCfg = (() => {
    const n = actionIds.length;
    switch (actionKind) {
      case 'present':
        return {
          title: '呈核至领导',
          hint: `确认将已选 ${n} 条项目呈核至领导并发起审批？`,
          confirmText: '确认呈核',
          confirmCls: 'bg-cyan-500 hover:bg-cyan-600',
          requireReason: false,
        };
      case 'return':
        return {
          title: '退回确认',
          hint: `确认退回已选 ${n} 条项目？`,
          confirmText: '确认退回',
          confirmCls: 'bg-orange-500 hover:bg-orange-600',
          requireReason: true,
          reasonLabel: '退回原因',
        };
      case 'reject':
        return {
          title: '驳回确认',
          hint: `确认驳回已选 ${n} 条项目？`,
          confirmText: '确认驳回',
          confirmCls: 'bg-red-500 hover:bg-red-600',
          requireReason: true,
          reasonLabel: '驳回原因',
        };
      case 'pass':
        return {
          title: '立项下达确认',
          hint: `确认对已选 ${n} 条项目执行立项下达？下达后将进入「已立项」。`,
          confirmText: '确认立项下达',
          confirmCls: 'bg-emerald-500 hover:bg-emerald-600',
          requireReason: false,
        };
      case 'restore':
        return {
          title: '恢复确认',
          hint: `确认将已选 ${n} 条项目恢复至待呈核？`,
          confirmText: '确认恢复',
          confirmCls: 'bg-violet-500 hover:bg-violet-600',
          requireReason: false,
        };
      default:
        return null;
    }
  })();

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">项目立项签发</h1>
          <p className="text-xs text-steel-400 mt-0.5">
            对会审后的项目立项进行呈核领导、审批处置与状态跟踪
          </p>
        </div>

        {/* 搜索筛选 */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">计划年度</label>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {leaderReviewYears.map((y) => <option key={y} value={y}>{y}年</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="根据项目名称模糊搜索" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目大类</label>
              <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                {leaderReviewMajorCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">开工时间</label>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <input type="date" value={startFrom} onChange={(e) => setStartFrom(e.target.value)} className={inputCls + ' cursor-pointer'} title="起始日期" />
                <span className="text-xs text-steel-400 flex-shrink-0">至</span>
                <input type="date" value={startTo} onChange={(e) => setStartTo(e.target.value)} className={inputCls + ' cursor-pointer'} title="结束日期" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目提报单位</label>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">请选择部门</option>
                {leaderReviewUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={() => setCurrentPage(1)}
                className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
                <i className="ri-search-line" />查询
              </button>
              <button type="button" onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                <i className="ri-refresh-line" />重置
              </button>
            </div>
          </div>
        </div>

        {/* TAB */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-x-auto">
          <div className="inline-flex min-w-full divide-x divide-steel-200">
            {INIT_LEADER_REVIEW_TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-3 py-2.5 text-sm whitespace-nowrap cursor-pointer transition-colors ${
                    active
                      ? 'text-emerald-700 font-medium bg-emerald-50/80'
                      : 'text-steel-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {usedFallback && (
          <p className="text-xs text-amber-600 -mt-2">当前筛选无匹配结果，已展示本分区全部演示数据</p>
        )}

        {/* 操作栏 */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={handleExport}
              className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
              导出
            </button>
            {showPresentBatch && (
              <button type="button" onClick={() => openBatchAction('present')}
                className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)' }}>
                呈核至领导
                {selectedRows.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-white/25 rounded-full">{selectedRows.length}</span>
                )}
              </button>
            )}
            {showPendingActionBatch && (
              <>
                <button type="button" onClick={() => openBatchAction('pass')}
                  className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap bg-emerald-500 hover:bg-emerald-600">
                  立项下达
                  {selectedRows.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-white/25 rounded-full">{selectedRows.length}</span>
                  )}
                </button>
                <button type="button" onClick={() => openBatchAction('reject')}
                  className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap bg-red-500 hover:bg-red-600">
                  驳回
                  {selectedRows.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-white/25 rounded-full">{selectedRows.length}</span>
                  )}
                </button>
                <button type="button" onClick={() => openBatchAction('return')}
                  className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap bg-orange-500 hover:bg-orange-600">
                  退回
                  {selectedRows.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-white/25 rounded-full">{selectedRows.length}</span>
                  )}
                </button>
              </>
            )}
            {showRestoreBatch && (
              <button type="button" onClick={() => openBatchAction('restore')}
                className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap bg-violet-500 hover:bg-violet-600">
                恢复
                {selectedRows.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-white/25 rounded-full">{selectedRows.length}</span>
                )}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-steel-500 bg-white border border-steel-200 rounded-lg px-3 py-2">
            <i className="ri-bar-chart-box-line text-steel-400" />
            <span>总申报金额</span>
            <span className="font-semibold text-steel-800">{totalBudget.toFixed(2)}万元</span>
            <span className="text-steel-300">|</span>
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

        <LeaderReviewTable
          records={paginated}
          selectedRows={selectedRows}
          pageOffset={pageOffset}
          activeTab={activeTab}
          sortField={headerSortField}
          sortDir={headerSortDir}
          onHeaderSort={handleHeaderSort}
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
          onRowAction={handleRowAction}
        />

        {displayList.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{displayList.length}</span> 条记录</span>
              <span>第 {currentPage} / {totalPages} 页</span>
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

      {actionModalCfg && (
        <LeaderActionModal
          open={!!actionKind}
          title={actionModalCfg.title}
          hint={actionModalCfg.hint}
          confirmText={actionModalCfg.confirmText}
          confirmCls={actionModalCfg.confirmCls}
          requireReason={actionModalCfg.requireReason}
          reasonLabel={actionModalCfg.reasonLabel}
          onClose={() => { setActionKind(null); setActionIds([]); }}
          onConfirm={handleActionConfirm}
        />
      )}

      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${
            toast.type === 'success' ? 'bg-green-50 border-green-200' :
            toast.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-sky-50 border-sky-200'
          }`}>
            <i className={
              toast.type === 'success' ? 'ri-checkbox-circle-line text-green-500' :
              toast.type === 'error' ? 'ri-error-warning-line text-red-500' : 'ri-information-line text-sky-500'
            } />
            <span className={`text-sm ${
              toast.type === 'success' ? 'text-green-700' :
              toast.type === 'error' ? 'text-red-700' : 'text-sky-700'
            }`}>{toast.msg}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
