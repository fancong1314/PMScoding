import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  PRELIM_STORAGE_KEY,
  PRELIM_TABS,
  initPrelimRecords as initial,
  prelimCategories,
  prelimMajorTypes,
  prelimUnits,
  prelimYears,
  type InitPrelimRecord,
  type PrelimStatus,
} from '@/mocks/initOfficePrelimReviewMocks';
import { initiationMajorTypeFormPath } from '@/mocks/projectPlans';
import type { ProjectMajorType } from '@/mocks/projectPlans';
import { useColumnConfig } from '@/hooks/useColumnConfig';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import LeaderActionModal from '@/pages/project-initiation/leader-review/components/LeaderActionModal';
import PrelimReviewTable from './components/PrelimReviewTable';
import type { PrelimRowAction } from './components/PrelimReviewTable';

const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: 'isInPlanProject', label: '是否计划内项目', visible: true, width: 120 },
  { id: 'needApprovalPermit', label: '是否报批报建', visible: true, width: 110 },
  { id: 'annualPlanNo', label: '年度计划号', visible: true, width: 140 },
  { id: 'planYear', label: '计划年度', visible: true, width: 90 },
  { id: 'projectMajorType', label: '项目大类', visible: true, width: 90 },
  { id: 'businessDivision', label: '项目提报单位', visible: true, width: 120 },
  { id: 'submitDept', label: '提报部门', visible: false, width: 120 },
  { id: 'implementDept', label: '实施主管部门', visible: true, width: 120 },
  { id: 'ownerUnit', label: '单位', visible: false, width: 120 },
  { id: 'implementUnit', label: '实施主管单位', visible: false, width: 120 },
  { id: 'professionalUnit', label: '专业主管单位', visible: false, width: 120 },
  { id: 'projectCategory', label: '项目类别', visible: true, width: 100 },
  { id: 'budgetAmount', label: '立项总概算(万元)', visible: true, width: 140 },
  { id: 'declareFee', label: '申报费用(万元)', visible: false, width: 120 },
  { id: 'isCapitalOverhaul', label: '是否资本性营缮', visible: false, width: 120 },
  { id: 'argumentApplyNo', label: '论证申请单号', visible: false, width: 130 },
  { id: 'isScrapRenew', label: '是否报废更新', visible: false, width: 110 },
  { id: 'benefit', label: '效益(万元)', visible: true, width: 110 },
  { id: 'projectManager', label: '项目负责人', visible: true, width: 120 },
  { id: 'projectManagerPhone', label: '负责人电话', visible: false, width: 120 },
  { id: 'startDate', label: '计划开工时间', visible: true, width: 120 },
  { id: 'endDate', label: '计划完工时间', visible: true, width: 120 },
  { id: 'projectDuration', label: '绝对工期', visible: false, width: 110 },
  { id: 'hasJobChange', label: '涉及岗位增减', visible: false, width: 110 },
  { id: 'currentReviewer', label: '当前审核人', visible: true, width: 110 },
  { id: 'reviewStatus', label: '审核状态', visible: true, width: 100 },
  { id: 'applicant', label: '申报人', visible: true, width: 90 },
];

function getStored(): InitPrelimRecord[] {
  try {
    const s = localStorage.getItem(PRELIM_STORAGE_KEY);
    if (s) return JSON.parse(s) as InitPrelimRecord[];
  } catch { /* noop */ }
  return initial.map((r) => ({ ...r }));
}

function formPathFor(major: string) {
  return initiationMajorTypeFormPath[major as ProjectMajorType] || initiationMajorTypeFormPath['技改'];
}

type ActionKind = 'pass' | 'reject' | 'return' | 'restore' | null;

export default function OfficePrelimReviewPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<InitPrelimRecord[]>(() => getStored());
  const [activeTab, setActiveTab] = useState<PrelimStatus>('pending');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [filterName, setFilterName] = useState('');
  const [filterPlanNo, setFilterPlanNo] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMajor, setFilterMajor] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterInPlan, setFilterInPlan] = useState('');
  const [filterManager, setFilterManager] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [budgetSort, setBudgetSort] = useState<'desc' | 'asc' | null>(null);
  const [benefitSort, setBenefitSort] = useState<'desc' | 'asc' | null>(null);

  const [actionKind, setActionKind] = useState<ActionKind>(null);
  const [actionIds, setActionIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const { columns, resetColumns, toggleVisible, reorderColumns } =
    useColumnConfig('init-office-prelim-cols-v3', DEFAULT_COLUMNS);

  useEffect(() => {
    localStorage.setItem(PRELIM_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    setSelectedRows([]);
    setCurrentPage(1);
  }, [activeTab]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabCounts = useMemo(() => ({
    pending: records.filter((r) => r.prelimStatus === 'pending').length,
    returned: records.filter((r) => r.prelimStatus === 'returned').length,
    rejected: records.filter((r) => r.prelimStatus === 'rejected').length,
    passed: records.filter((r) => r.prelimStatus === 'passed').length,
  }), [records]);

  const filtered = useMemo(() => {
    let list = records.filter((r) => {
      if (r.prelimStatus !== activeTab) return false;
      if (filterName && !r.planName.includes(filterName)) return false;
      if (filterPlanNo && !(r.annualPlanNo || '').includes(filterPlanNo)) return false;
      if (filterYear && r.planYear !== filterYear) return false;
      if (filterMajor && r.projectMajorType !== filterMajor) return false;
      if (filterUnit && r.businessDivision !== filterUnit) return false;
      if (filterCategory && r.projectCategory !== filterCategory) return false;
      if (filterManager && !r.projectManager.includes(filterManager)) return false;
      if (filterInPlan) {
        const inPlan = r.isInPlanProject || (r.annualPlanNo ? '是' : '否');
        if (inPlan !== filterInPlan) return false;
      }
      return true;
    });
    list = [...list];
    if (budgetSort === 'desc') list.sort((a, b) => b.budgetAmount - a.budgetAmount);
    else if (budgetSort === 'asc') list.sort((a, b) => a.budgetAmount - b.budgetAmount);
    else if (benefitSort === 'desc') list.sort((a, b) => b.benefit - a.benefit);
    else if (benefitSort === 'asc') list.sort((a, b) => a.benefit - b.benefit);
    return list;
  }, [records, activeTab, filterName, filterPlanNo, filterYear, filterMajor, filterUnit, filterCategory, filterInPlan, filterManager, budgetSort, benefitSort]);

  const tabAll = useMemo(
    () => records.filter((r) => r.prelimStatus === activeTab),
    [records, activeTab]
  );

  const hasFilter = !!(filterName || filterPlanNo || filterYear || filterMajor || filterUnit || filterCategory || filterInPlan || filterManager);
  const displayList = filtered.length > 0 || !hasFilter
    ? filtered
    : tabAll;
  const usedFallback = filtered.length === 0 && displayList.length > 0;

  const totalBudget = useMemo(() => displayList.reduce((s, r) => s + r.budgetAmount, 0), [displayList]);
  const totalPages = Math.ceil(displayList.length / pageSize) || 1;
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = displayList.slice(pageOffset, pageOffset + pageSize);

  const handleReset = () => {
    setFilterName('');
    setFilterPlanNo('');
    setFilterYear('');
    setFilterMajor('');
    setFilterUnit('');
    setFilterCategory('');
    setFilterInPlan('');
    setFilterManager('');
    setBudgetSort(null);
    setBenefitSort(null);
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

  const applyStatus = (ids: string[], status: PrelimStatus, reason?: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (!ids.includes(r.id)) return r;
        const next: InitPrelimRecord = {
          ...r,
          prelimStatus: status,
          latestStage:
            status === 'passed' ? '初审通过' :
            status === 'returned' ? '已退回' :
            status === 'rejected' ? '已驳回' : '待初审',
          reviewStatus:
            status === 'passed' ? 'pending_joint' :
            status === 'returned' ? 'returned' :
            status === 'rejected' ? 'rejected' : 'dept_review',
        };
        if (status === 'rejected' || status === 'returned') {
          next.prevPrelimStatus = r.prelimStatus;
          next.cancelReason = reason;
        }
        if (status === 'pending') {
          next.cancelReason = undefined;
        }
        return next;
      })
    );
    setSelectedRows((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const handleActionConfirm = (reason: string) => {
    const ids = [...actionIds];
    const count = ids.length;
    if (actionKind === 'pass') {
      applyStatus(ids, 'passed');
      showToast(`已通过 ${count} 条项目初审`);
      setActiveTab('passed');
    } else if (actionKind === 'return') {
      applyStatus(ids, 'returned', reason);
      showToast(`已退回 ${count} 条项目`, 'info');
      setActiveTab('returned');
    } else if (actionKind === 'reject') {
      applyStatus(ids, 'rejected', reason);
      showToast(`已驳回 ${count} 条项目`, 'info');
      setActiveTab('rejected');
    } else if (actionKind === 'restore') {
      const first = records.find((r) => ids.includes(r.id));
      const backTab: PrelimStatus = first?.prevPrelimStatus || 'pending';
      setRecords((prev) =>
        prev.map((r) => {
          if (!ids.includes(r.id)) return r;
          const back = r.prevPrelimStatus || 'pending';
          return {
            ...r,
            prelimStatus: back,
            prevPrelimStatus: undefined,
            cancelReason: undefined,
            latestStage:
              back === 'pending' ? '待初审' :
              back === 'passed' ? '初审通过' :
              back === 'returned' ? '已退回' : '已驳回',
            reviewStatus:
              back === 'pending' ? 'dept_review' :
              back === 'passed' ? 'pending_joint' :
              back === 'returned' ? 'returned' : 'rejected',
          };
        })
      );
      setSelectedRows((prev) => prev.filter((id) => !ids.includes(id)));
      showToast(`已恢复 ${count} 条项目至上个状态`);
      setActiveTab(backTab);
    }
    setActionKind(null);
    setActionIds([]);
  };

  const handleRowAction = (action: PrelimRowAction, record: InitPrelimRecord) => {
    if (action === 'view') {
      const base = formPathFor(record.projectMajorType);
      navigate(`${base}?id=${record.id}&mode=review&from=office-prelim`);
      return;
    }
    if (action === 'restore') {
      setActionIds([record.id]);
      setActionKind('restore');
    }
  };

  const handleExport = () => {
    const n = selectedRows.length > 0 ? selectedRows.length : displayList.length;
    showToast(`正在导出 ${n} 条数据...`, 'info');
  };

  const showPendingBatch = activeTab === 'pending';
  const showExport = activeTab === 'pending' || activeTab === 'passed';

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
      case 'pass':
        return {
          title: '通过确认',
          hint: `确认通过已选 ${n} 条项目初审？通过后将进入「初审通过」。`,
          confirmText: '确认通过',
          confirmCls: 'bg-emerald-500 hover:bg-emerald-600',
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
          hint: `确认驳回已选 ${n} 条项目？驳回后项目作废，可通过「恢复」还原至上个状态。`,
          confirmText: '确认驳回',
          confirmCls: 'bg-red-500 hover:bg-red-600',
          requireReason: true,
          reasonLabel: '驳回原因',
        };
      case 'restore':
        return {
          title: '恢复确认',
          hint: `确认将已选 ${n} 条项目恢复至上个状态？`,
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
          <h1 className="text-lg font-semibold text-steel-900">项目立项初审</h1>
          <p className="text-xs text-steel-400 mt-0.5">对已报送的项目立项申请进行项目办初审：通过、退回、驳回与恢复</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="根据项目名称模糊搜索" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">计划年度</label>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部年度</option>
                {prelimYears.map((y) => <option key={y} value={y}>{y}年</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目大类</label>
              <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部大类</option>
                {prelimMajorTypes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目提报单位</label>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部单位</option>
                {prelimUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目类别</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部类别</option>
                {prelimCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">是否计划内</label>
              <select value={filterInPlan} onChange={(e) => setFilterInPlan(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">年度计划号</label>
              <input value={filterPlanNo} onChange={(e) => setFilterPlanNo(e.target.value)} placeholder="根据年度计划号搜索" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目负责人</label>
              <input value={filterManager} onChange={(e) => setFilterManager(e.target.value)} placeholder="根据负责人模糊搜索" className={inputCls} />
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

        <div className="bg-white rounded-lg border border-steel-200 px-1 py-1 inline-flex flex-wrap gap-0.5">
          {PRELIM_TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 text-sm rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  active ? 'text-white font-medium' : 'text-steel-500 hover:text-steel-700'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #10b981, #059669)' } : undefined}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs ${active ? 'text-emerald-100' : 'text-steel-400'}`}>
                  ({tabCounts[tab.key]})
                </span>
              </button>
            );
          })}
        </div>

        {usedFallback && (
          <p className="text-xs text-amber-600 -mt-2">当前筛选无匹配结果，已展示本分区全部演示数据</p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {showExport && (
              <button type="button" onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                <i className="ri-file-excel-2-line" />导出
              </button>
            )}
            {showPendingBatch && (
              <>
                <button type="button" onClick={() => openBatchAction('pass')}
                  className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap bg-emerald-500 hover:bg-emerald-600">
                  通过
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

        <PrelimReviewTable
          records={paginated}
          selectedRows={selectedRows}
          columns={columns}
          pageOffset={pageOffset}
          activeTab={activeTab}
          budgetSort={budgetSort}
          benefitSort={benefitSort}
          onSortBudget={() => {
            setBudgetSort((p) => (!p ? 'desc' : p === 'desc' ? 'asc' : null));
            setBenefitSort(null);
          }}
          onSortBenefit={() => {
            setBenefitSort((p) => (!p ? 'desc' : p === 'desc' ? 'asc' : null));
            setBudgetSort(null);
          }}
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
          onToggleVisible={toggleVisible}
          onReorder={reorderColumns}
          onResetColumns={resetColumns}
          onRowAction={handleRowAction}
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
