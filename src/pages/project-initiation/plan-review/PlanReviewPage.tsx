import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  planReviewRecords as initial,
  planReviewBusinessUnits,
  planReviewCategories,
  planReviewMajorCategories,
  planReviewYears,
  normalizePlanReviewStatus,
  RETURN_RESTART_NODE_OPTIONS,
} from '@/mocks/planReviewMocks';
import type { PlanReviewRecord, PlanReviewStatus, ReturnRestartNode } from '@/mocks/planReviewMocks';
import { initiationMajorTypeFormPath } from '@/mocks/projectPlans';
import type { ProjectMajorType } from '@/mocks/projectPlans';
import { useColumnConfig } from '@/hooks/useColumnConfig';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import PlanReviewTable from './components/PlanReviewTable';
import JointReviewNoticeModal from './components/JointReviewNoticeModal';
import type { JointReviewPassPayload } from './components/JointReviewPassModal';
import PlanReviewDetailModal from './components/PlanReviewDetailModal';
import ReturnReviewModal from './components/ReturnReviewModal';

type ReviewDept = 'business-unit' | 'professional-dept' | 'chief-engineer' | 'operations-dept' | 'budget-committee' | 'zhongte-stage';
type JointTab = 'pending_joint' | 'reviewing';

const DEPT_TITLES: Record<ReviewDept, string> = {
  'business-unit': '事业部阶段',
  'professional-dept': '专业部门阶段',
  'chief-engineer': '总师室阶段',
  'operations-dept': '全委会阶段',
  'budget-committee': '预算委员会阶段',
  'zhongte-stage': '项目立项会审',
};

function getDefaultColumns(_reviewDept: ReviewDept): ColumnDef[] {
  return [
    { id: 'applyYear',              label: '计划年度',        visible: true,  width: 90  },
    { id: 'projectMajorCategory',   label: '项目大类',        visible: true,  width: 90  },
    { id: 'businessUnit',           label: '项目单位',        visible: true,  width: 120 },
    { id: 'projectCategory',        label: '项目类别',        visible: true,  width: 120 },
    { id: 'planName',               label: '项目名称',    visible: true,  width: 260 },
    { id: 'budget',                 label: '投资总估算(万元)', visible: true,  width: 130 },
    { id: 'benefit',                label: '效益(万元)',       visible: true,  width: 100 },
    { id: 'payment2',               label: '第二年付款(万元)', visible: false, width: 130 },
    { id: 'payment3',               label: '第三年付款(万元)', visible: false, width: 130 },
    { id: 'projectManager',         label: '项目负责人',      visible: true,  width: 120 },
    { id: 'projectStatus',          label: '状态',            visible: true,  width: 110 },
    { id: 'startTime',              label: '计划开工时间',    visible: true,  width: 110 },
    { id: 'endTime',                label: '计划完工时间',    visible: true,  width: 110 },
    { id: 'applicant',              label: '申报人',          visible: true,  width: 90  },
    { id: 'applyDate',              label: '申报日期',        visible: true,  width: 100 },
    { id: 'cancelReason',           label: '退回/作废理由',   visible: false, width: 160 },
  ];
}

function normalizeRecord(r: PlanReviewRecord): PlanReviewRecord {
  return {
    ...r,
    projectStatus: normalizePlanReviewStatus(r.projectStatus as string),
    linkedPlanId: r.linkedPlanId || r.id,
  };
}

function getStored(key: string): PlanReviewRecord[] {
  try {
    const s = localStorage.getItem(key);
    if (s) return (JSON.parse(s) as PlanReviewRecord[]).map(normalizeRecord);
    return initial.map(normalizeRecord);
  } catch {
    return initial.map(normalizeRecord);
  }
}

function formPathFor(major: string) {
  return initiationMajorTypeFormPath[major as ProjectMajorType] || initiationMajorTypeFormPath['技改'];
}

interface Props { reviewDept: ReviewDept; }

export default function PlanReviewPage({ reviewDept }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isJointReview = reviewDept === 'zhongte-stage';
  const storageKey = `ng_init_plan_review_${reviewDept}_v5`;
  const colKey = `init-plan-review-cols-${reviewDept}-v1`;

  const [records, setRecords] = useState<PlanReviewRecord[]>(() => getStored(storageKey));
  const [activeTab, setActiveTab] = useState<JointTab>('pending_joint');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterYear, setFilterYear] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMajorCategory, setFilterMajorCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [headerSortField, setHeaderSortField] = useState<'budget' | 'benefit' | null>(null);
  const [headerSortDir, setHeaderSortDir] = useState<'none' | 'desc' | 'asc'>('none');
  const [pageSize, setPageSize] = useState(20);

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<PlanReviewRecord | null>(null);
  const [returnTarget, setReturnTarget] = useState<PlanReviewRecord | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const { columns, resetColumns, toggleVisible, reorderColumns } =
    useColumnConfig(colKey, getDefaultColumns(reviewDept));

  useEffect(() => {
    if (location.state?.success) {
      showToast(location.state.message || '操作成功', 'success');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(records));
  }, [records, storageKey]);

  useEffect(() => {
    setSelectedRows([]);
    setCurrentPage(1);
  }, [activeTab]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabCounts = useMemo(() => ({
    pending_joint: records.filter((r) => r.projectStatus === 'pending_joint').length,
    reviewing: records.filter((r) => r.projectStatus === 'reviewing').length,
  }), [records]);

  const filtered = useMemo(() => {
    let list = records.filter((r) => {
      if (isJointReview && r.projectStatus !== activeTab) return false;
      if (filterYear && r.applyYear !== filterYear) return false;
      if (filterName && !r.planName.includes(filterName)) return false;
      if (filterUnit && r.businessUnit !== filterUnit) return false;
      if (filterCategory && r.projectCategory !== filterCategory) return false;
      if (filterMajorCategory && r.projectMajorCategory !== filterMajorCategory) return false;
      return true;
    });
    if (headerSortField && headerSortDir !== 'none') {
      list = [...list].sort((a, b) => {
        const valA = a[headerSortField];
        const valB = b[headerSortField];
        return headerSortDir === 'desc' ? valB - valA : valA - valB;
      });
    }
    return list;
  }, [records, activeTab, isJointReview, filterYear, filterName, filterUnit, filterCategory, filterMajorCategory, headerSortField, headerSortDir]);

  const totalBudget = useMemo(() => filtered.reduce((s, r) => s + r.budget, 0), [filtered]);
  const selectedBudget = useMemo(() => filtered.filter((r) => selectedRows.includes(r.id)).reduce((s, r) => s + r.budget, 0), [filtered, selectedRows]);
  const selectedCount = selectedRows.length;
  const selectedPlans = useMemo(() => records.filter((r) => selectedRows.includes(r.id)), [records, selectedRows]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageOffset, pageOffset + pageSize);

  const handleHeaderSort = (field: 'budget' | 'benefit') => {
    setHeaderSortField(field);
    setHeaderSortDir((prev) => {
      if (headerSortField !== field) return 'desc';
      if (prev === 'none') return 'desc';
      if (prev === 'desc') return 'asc';
      return 'none';
    });
  };

  const handleReset = () => {
    setFilterYear(''); setFilterName(''); setFilterUnit('');
    setFilterCategory(''); setFilterMajorCategory('');
    setHeaderSortField(null); setHeaderSortDir('none');
    setCurrentPage(1);
  };

  const handlePass = (record: PlanReviewRecord, payload: JointReviewPassPayload) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? {
              ...r,
              projectStatus: 'approved' as PlanReviewStatus,
              latestStage: '会审通过',
              jointMeeting: payload.meeting,
            }
          : r
      )
    );
    setSelectedRows((prev) => prev.filter((id) => id !== record.id));
    showToast(`「${record.planName.slice(0, 18)}」会审通过`);
  };

  const handleReject = (id: string, reason: string) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, projectStatus: 'rejected' as PlanReviewStatus, cancelReason: reason, isCancelled: true, latestStage: '已驳回' } : r));
    setSelectedRows((prev) => prev.filter((rid) => rid !== id));
    showToast('已驳回，年度计划已作废', 'info');
  };

  const handleReturn = (reason: string, restartNode: ReturnRestartNode) => {
    if (!returnTarget) return;
    const nodeLabel = RETURN_RESTART_NODE_OPTIONS.find((o) => o.value === restartNode)?.label || restartNode;
    setRecords((prev) => prev.map((r) => r.id === returnTarget.id ? {
      ...r,
      projectStatus: 'returned' as PlanReviewStatus,
      cancelReason: reason,
      returnRestartNode: restartNode,
      latestStage: `已退回（${nodeLabel}）`,
    } : r));
    setSelectedRows((prev) => prev.filter((id) => id !== returnTarget.id));
    setReturnTarget(null);
    showToast(`已退回，重新提交后从「${nodeLabel}」开始审批`, 'info');
  };

  const handleModify = (record: PlanReviewRecord) => {
    const path = formPathFor(record.projectMajorCategory);
    navigate(`${path}?id=${record.linkedPlanId}&mode=review`);
  };

  const handleView = (record: PlanReviewRecord) => setDetailTarget(record);

  const handleOpenNotice = () => {
    if (selectedRows.length === 0) {
      showToast('请先选择需要发起会审的年度计划', 'error');
      return;
    }
    setNoticeOpen(true);
  };

  const handleNoticeSubmit = (payload: {
    reviewTime: string;
    location: string;
    participants: { id: string; personId: string; personName: string; unit: string }[];
    sendNotice: boolean;
  }) => {
    const count = selectedRows.length;
    const meeting = {
      reviewTime: payload.reviewTime,
      location: payload.location,
      participants: payload.participants.map((p) => ({ ...p, opinion: '' })),
      opinionSummary: '',
    };
    setRecords((prev) =>
      prev.map((r) =>
        selectedRows.includes(r.id)
          ? {
              ...r,
              projectStatus: 'reviewing' as PlanReviewStatus,
              latestStage: '会审中',
              jointMeeting: meeting,
            }
          : r
      )
    );
    setSelectedRows([]);
    setNoticeOpen(false);
    setActiveTab('reviewing');
    showToast(
      payload.sendNotice
        ? `已提交并发送会审通知，${count} 条计划进入会审中`
        : `已提交会审，${count} 条计划进入会审中`
    );
  };

  const handleExportAll = () => showToast(`正在导出 ${selectedRows.length > 0 ? selectedRows.length : filtered.length} 条数据...`, 'info');

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
  const paginationPages = renderPagination();

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">{DEPT_TITLES[reviewDept]}</h1>
          <p className="text-xs text-steel-400 mt-0.5">
            {isJointReview
              ? '对待会审项目发起专业会审通知，对会审中项目进行通过、驳回与退回'
              : '对申报的项目立项进行审查'}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">计划年度</label>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部年度</option>
                {planReviewYears.map((y) => <option key={y} value={y}>{y}年</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目单位</label>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部项目单位</option>
                {planReviewBusinessUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目大类</label>
              <select value={filterMajorCategory} onChange={(e) => setFilterMajorCategory(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部大类</option>
                {planReviewMajorCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目类别</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部类别</option>
                {planReviewCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
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

        {isJointReview && (
          <div className="bg-white rounded-lg border border-steel-200 px-1 py-1 inline-flex flex-wrap gap-0.5">
            {([
              { key: 'pending_joint' as const, label: '待会审' },
              { key: 'reviewing' as const, label: '会审中' },
            ]).map((tab) => {
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
        )}

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isJointReview && activeTab === 'pending_joint' && (
              <button
                type="button"
                onClick={handleOpenNotice}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
              >
                <i className="ri-mail-send-line" />
                专业会审通知
                {selectedRows.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">{selectedRows.length}</span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleExportAll}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-file-excel-2-line" />
              导出Excel
              {selectedRows.length > 0 && <span className="ml-1 text-xs text-steel-400">({selectedRows.length}条)</span>}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-steel-500 bg-white border border-steel-200 rounded-lg px-3 py-2">
            <i className="ri-bar-chart-box-line text-steel-400" />
            <span>总申报金额</span>
            <span className="font-semibold text-steel-800">{totalBudget.toFixed(3)}万元</span>
            <span className="text-steel-300">|</span>
            <span className="font-semibold text-steel-800">{filtered.length}</span>
            <span>项</span>
            {selectedCount > 0 && (
              <>
                <span className="text-steel-300 mx-1">|</span>
                <span>所选金额合计</span>
                <span className="font-semibold text-primary-600">{selectedBudget.toFixed(3)}万元</span>
                <span className="text-steel-300">|</span>
                <span className="font-semibold text-primary-600">{selectedCount}</span>
                <span>项</span>
              </>
            )}
          </div>
        </div>

        <PlanReviewTable
          records={paginated}
          selectedRows={selectedRows}
          columns={columns}
          reviewDept={reviewDept}
          actionMode={isJointReview ? activeTab : 'reviewing'}
          pageOffset={pageOffset}
          sortField={headerSortField}
          sortDir={headerSortDir}
          onHeaderSort={handleHeaderSort}
          onToggleSelectAll={() => setSelectedRows(selectedRows.length === paginated.length ? [] : paginated.map((r) => r.id))}
          onToggleSelectRow={(id) => setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id])}
          onPass={handlePass}
          onReject={handleReject}
          onReturn={(record) => setReturnTarget(record)}
          onView={handleView}
          onModify={handleModify}
          onToggleVisible={toggleVisible}
          onReorder={reorderColumns}
          onResetColumns={resetColumns}
        />

        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{filtered.length}</span> 条</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none">
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
              {paginationPages.map((page, i) =>
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

      <JointReviewNoticeModal
        open={noticeOpen}
        planNames={selectedPlans.map((p) => p.planName)}
        onClose={() => setNoticeOpen(false)}
        onSubmit={handleNoticeSubmit}
      />

      <PlanReviewDetailModal
        open={!!detailTarget}
        linkedPlanId={detailTarget?.linkedPlanId || ''}
        fallbackName={detailTarget?.planName}
        onClose={() => setDetailTarget(null)}
        onEdit={detailTarget ? () => {
          const t = detailTarget;
          setDetailTarget(null);
          handleModify(t);
        } : undefined}
      />

      <ReturnReviewModal
        open={!!returnTarget}
        planName={returnTarget?.planName || ''}
        onClose={() => setReturnTarget(null)}
        onConfirm={handleReturn}
      />

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
