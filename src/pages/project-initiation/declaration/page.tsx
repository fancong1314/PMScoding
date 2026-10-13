import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { projectPlans, reviewStatusMap, businessDivisions, projectCategories, projectMajorTypes, initiationMajorTypeFormPath, withPaymentPlans, withInitiationDetailFields, withInvestmentEstimateFields, normalizeReviewStatus } from '@/mocks/projectPlans';
import type { ProjectPlan, ProjectMajorType } from '@/mocks/projectPlans';
import { useColumnConfig } from '@/hooks/useColumnConfig';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import DeclarationTable from './components/DeclarationTable';
import ConfirmModal from './components/ConfirmModal';
import ApprovalResultModal from './components/ApprovalResultModal';
import DeclOperationLogModal from './components/DeclOperationLogModal';
import { getApprovalRecords, setStoredApprovalRecords, getApprovalByPlanId, canWithdrawDeclaration } from '@/mocks/approvalMocks';
import type { ApprovalRecord } from '@/mocks/approvalMocks';
import { appendDeclOperationLog } from '@/mocks/declarationOperationLogs';
import Layout from '@/components/feature/Layout';

const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: 'isInPlanProject',  label: '是否计划内项目',      visible: true,  width: 120 },
  { id: 'needApprovalPermit', label: '是否报批报建',      visible: true,  width: 110 },
  { id: 'annualPlanNo',     label: '年度计划号',          visible: true,  width: 140 },
  { id: 'planYear',         label: '计划年度',            visible: true,  width: 90  },
  { id: 'projectMajorType', label: '项目大类',            visible: true,  width: 90  },
  { id: 'businessDivision', label: '项目提报单位',        visible: true,  width: 120 },
  { id: 'submitDept',       label: '提报部门',            visible: false, width: 120 },
  { id: 'implementDept',    label: '实施主管部门',        visible: true,  width: 120 },
  { id: 'ownerUnit',        label: '单位',                visible: false, width: 120 },
  { id: 'implementUnit',    label: '实施主管单位',        visible: false, width: 120 },
  { id: 'professionalUnit', label: '专业主管单位',        visible: false, width: 120 },
  { id: 'projectCategory',  label: '项目类别',            visible: true,  width: 100 },
  { id: 'budgetAmount',     label: '立项总概算(万元)',    visible: true,  width: 140 },
  { id: 'declareFee',       label: '申报费用(万元)',      visible: false, width: 120 },
  { id: 'isCapitalOverhaul', label: '是否资本性营缮',     visible: false, width: 120 },
  { id: 'argumentApplyNo',  label: '论证申请单号',        visible: false, width: 130 },
  { id: 'isScrapRenew',     label: '是否报废更新',        visible: false, width: 110 },
  { id: 'benefit',          label: '效益(万元)',          visible: true,  width: 110 },
  { id: 'projectManager',   label: '项目负责人',          visible: true,  width: 120 },
  { id: 'projectManagerPhone', label: '负责人电话',       visible: false, width: 120 },
  { id: 'startDate',        label: '计划开工时间',        visible: true,  width: 120 },
  { id: 'endDate',          label: '计划完工时间',        visible: true,  width: 120 },
  { id: 'projectDuration',  label: '绝对工期',            visible: false, width: 110 },
  { id: 'hasJobChange',     label: '涉及岗位增减',        visible: false, width: 110 },
  { id: 'currentReviewer',  label: '当前审核人',          visible: true,  width: 110 },
  { id: 'reviewStatus',     label: '审核状态',            visible: true,  width: 100 },
  { id: 'applicant',        label: '申报人',              visible: true,  width: 90  },
];

const STORAGE_KEY = 'ng_init_decl_plans_v11';

function normalizePlans(list: ProjectPlan[]): ProjectPlan[] {
  return list.map((p) => withInvestmentEstimateFields(withPaymentPlans(withInitiationDetailFields({
    ...p,
    projectMajorType: p.projectMajorType || '技改',
    reviewStatus: normalizeReviewStatus(p.reviewStatus as string),
  }))));
}

function getStoredPlans(): ProjectPlan[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return normalizePlans(JSON.parse(stored));
    localStorage.removeItem('ng_init_decl_plans_v10');
    localStorage.removeItem('ng_init_decl_plans_v9');
    localStorage.removeItem('ng_init_decl_plans_v8');
    localStorage.removeItem('ng_init_decl_plans_v7');
    localStorage.removeItem('ng_init_decl_plans_v6');
    localStorage.removeItem('ng_init_decl_plans_v5');
    localStorage.removeItem('ng_init_decl_plans_v4');
    localStorage.removeItem('ng_init_decl_plans_v3');
    localStorage.removeItem('ng_init_decl_plans_v2');
    localStorage.removeItem('ng_init_decl_plans_v1');
    return normalizePlans(projectPlans);
  } catch {
    return normalizePlans(projectPlans);
  }
}
function setStoredPlans(plans: ProjectPlan[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch { /* noop */ }
}

export default function ProjectPlanDeclaration() {
  const navigate = useNavigate();
  const location = useLocation();
  const importRef = useRef<HTMLInputElement>(null);

  const [plans, setPlans] = useState<ProjectPlan[]>(getStoredPlans);
  const [activeMajorType, setActiveMajorType] = useState<ProjectMajorType>('新建');
  const [searchText, setSearchText] = useState('');
  const [filterPlanYear, setFilterPlanYear] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterReviewStatus, setFilterReviewStatus] = useState('');
  const [budgetSort, setBudgetSort] = useState<'desc' | 'asc' | null>(null);
  const [benefitSort, setBenefitSort] = useState<'desc' | 'asc' | null>(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const [pageSize, setPageSize]         = useState(20);
  const [toast, setToast]               = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [confirmCfg, setConfirmCfg]     = useState({
    title: '', content: '', confirmText: '确认',
    confirmType: 'danger' as 'danger' | 'primary' | 'warning',
    onConfirm: () => {},
  });

  // Approval / log modals state
  const [logOpen, setLogOpen] = useState(false);
  const [logPlan, setLogPlan] = useState<ProjectPlan | null>(null);
  const [approvalResultOpen, setApprovalResultOpen] = useState(false);
  const [approvalResultPlan, setApprovalResultPlan] = useState<ProjectPlan | null>(null);
  const [approvalResultRecord, setApprovalResultRecord] = useState<ApprovalRecord | null>(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState<ProjectPlan | null>(null);
  const [approvalRecords, setApprovalRecords] = useState<ApprovalRecord[]>(getApprovalRecords());

  const { columns, resetColumns, toggleVisible, reorderColumns, updateWidth } =
    useColumnConfig('init-decl-plans-v9', DEFAULT_COLUMNS);

  useEffect(() => {
    if (location.state?.success) {
      showToast(location.state.message || '操作成功', 'success');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  useEffect(() => { setStoredPlans(plans); }, [plans]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSortBudget = () => {
    setBudgetSort((prev) => {
      if (!prev) return 'desc';
      if (prev === 'desc') return 'asc';
      return null;
    });
    setBenefitSort(null);
  };

  const handleSortBenefit = () => {
    setBenefitSort((prev) => {
      if (!prev) return 'desc';
      if (prev === 'desc') return 'asc';
      return null;
    });
    setBudgetSort(null);
  };

  const filtered = useMemo(() => {
    const inTab = plans.filter((p) => p.projectMajorType === activeMajorType);
    let list = inTab.filter((p) => {
      if (searchText && !p.planName.includes(searchText)) return false;
      if (filterPlanYear && p.planYear !== filterPlanYear) return false;
      if (filterDivision && p.businessDivision !== filterDivision) return false;
      if (filterCategory && p.projectCategory !== filterCategory) return false;
      if (filterReviewStatus && p.reviewStatus !== filterReviewStatus) return false;
      return true;
    });
    // 查询无匹配时回退当前大类全量数据
    if (list.length === 0 && inTab.length > 0 && (searchText || filterPlanYear || filterDivision || filterCategory || filterReviewStatus)) {
      list = [...inTab];
    }
    list = [...list];
    if (budgetSort === 'desc') list.sort((a, b) => b.budgetAmount - a.budgetAmount);
    else if (budgetSort === 'asc') list.sort((a, b) => a.budgetAmount - b.budgetAmount);
    else if (benefitSort === 'desc') list.sort((a, b) => b.benefit - a.benefit);
    else if (benefitSort === 'asc') list.sort((a, b) => a.benefit - b.benefit);
    else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [plans, activeMajorType, searchText, filterPlanYear, filterDivision, filterCategory, filterReviewStatus, budgetSort, benefitSort]);

  const tabCounts = useMemo(() => {
    const counts = Object.fromEntries(projectMajorTypes.map((t) => [t, 0])) as Record<ProjectMajorType, number>;
    plans.forEach((p) => {
      if (counts[p.projectMajorType] !== undefined) counts[p.projectMajorType] += 1;
    });
    return counts;
  }, [plans]);

  const totalBudget = filtered.reduce((s, p) => s + p.budgetAmount, 0);
  const totalPages  = Math.ceil(filtered.length / pageSize);
  const pageOffset  = (currentPage - 1) * pageSize;
  const paginated   = filtered.slice(pageOffset, pageOffset + pageSize);

  const handleSearch = () => setCurrentPage(1);
  const handleReset = () => {
    setSearchText(''); setFilterPlanYear(''); setFilterDivision(''); setFilterCategory(''); setFilterReviewStatus('');
    setBudgetSort(null); setBenefitSort(null); setCurrentPage(1);
  };

  const handleEdit = (plan: ProjectPlan) => {
    const base = initiationMajorTypeFormPath[plan.projectMajorType] || initiationMajorTypeFormPath['技改'];
    navigate(`${base}?id=${plan.id}`);
  };
  const handleAdd = () => navigate(initiationMajorTypeFormPath[activeMajorType]);

  const handleViewLog = (plan: ProjectPlan) => {
    setLogPlan(plan);
    setLogOpen(true);
  };

  const handleDelete = (plan: ProjectPlan) => {
    setConfirmCfg({
      title: '删除确认',
      content: `确定删除「${plan.planName}」？删除后不可恢复。`,
      confirmText: '删除',
      confirmType: 'danger',
      onConfirm: () => {
        setPlans((prev) => prev.filter((p) => p.id !== plan.id));
        showToast('删除成功');
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  const handleExport = () => showToast('正在导出，请稍候...', 'success');
  const handleTemplateDownload = () => showToast('模板下载中...', 'success');
  const handleImport = () => importRef.current?.click();

  const handleViewApproval = (plan: ProjectPlan) => {
    const record = getApprovalByPlanId(plan.id);
    if (record) {
      setApprovalResultPlan(plan);
      setApprovalResultRecord(record);
      setApprovalResultOpen(true);
    }
  };

  const handleProcessApproval = (plan: ProjectPlan) => {
    const record = getApprovalByPlanId(plan.id);
    if (record) {
      navigate(`/project-plan/approval-process?id=${record.id}`);
    }
  };

  const handleWithdrawApproval = (record: ApprovalRecord) => {
    const plan = plans.find((p) => p.id === record.planId) || approvalResultPlan;
    if (!plan) return;
    if (!canWithdrawDeclaration(plan, record)) {
      showToast('该申请已有审批记录，无法撤回', 'error');
      return;
    }
    setWithdrawTarget(plan);
    setApprovalResultOpen(false);
    setWithdrawModalOpen(true);
  };

  const handleWithdrawPlan = (plan: ProjectPlan) => {
    const record = getApprovalByPlanId(plan.id);
    if (!canWithdrawDeclaration(plan, record)) {
      showToast('仅提交后且尚未有任何审批时允许撤回', 'error');
      return;
    }
    setWithdrawTarget(plan);
    setWithdrawModalOpen(true);
  };

  const confirmWithdraw = () => {
    if (!withdrawTarget) return;
    const record = getApprovalByPlanId(withdrawTarget.id);
    if (record && record.status === 'approving') {
      const updated = { ...record, status: 'withdrawn' as const, currentNode: '' };
      const records = getApprovalRecords().map((r) => (r.id === updated.id ? updated : r));
      setStoredApprovalRecords(records);
      setApprovalRecords(records);
    }
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === withdrawTarget.id
          ? { ...p, reviewStatus: 'draft' as const, latestStage: '草稿', currentReviewer: '', updatedAt: timeStr.slice(0, 10) }
          : p
      )
    );
    appendDeclOperationLog({
      planId: withdrawTarget.id,
      operateTime: timeStr,
      operator: withdrawTarget.applicant || '当前用户',
      operation: '撤回',
      remark: '提交后尚未审批，自行撤回至草稿，可修改后重新发起',
      approvalNo: record?.appNo,
    });
    setWithdrawModalOpen(false);
    setWithdrawTarget(null);
    showToast('已撤回，状态恢复为草稿，可修改后重新提交');
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

  return (
    <Layout>
      <div className="space-y-3">
        {/* Title */}
        <div>
          <h1 className="text-lg font-semibold text-steel-900">项目立项申请</h1>
          <p className="text-xs text-steel-400 mt-0.5">按项目大类管理项目立项申请及审批状态</p>
        </div>

        {/* 项目大类 TAB */}
        <div className="bg-white rounded-lg border border-steel-200 px-1 py-1 inline-flex flex-wrap gap-0.5">
          {projectMajorTypes.map((type) => {
            const active = activeMajorType === type;
            return (
              <button
                key={type}
                onClick={() => { setActiveMajorType(type); setCurrentPage(1); }}
                className={`px-5 py-2 text-sm rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  active ? 'text-white font-medium' : 'text-steel-500 hover:text-steel-700'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #10b981, #059669)' } : undefined}
              >
                {type}
                <span className={`ml-1.5 text-xs ${active ? 'text-emerald-100' : 'text-steel-400'}`}>
                  ({tabCounts[type]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                <i className="ri-search-line text-steel-400 text-sm" />
              </div>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索项目名称"
                className="w-full pl-9 pr-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50"
              />
            </div>
            <select
              value={filterPlanYear}
              onChange={(e) => setFilterPlanYear(e.target.value)}
              className="px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 cursor-pointer"
            >
              <option value="">全部年度</option>
              {Array.from(new Set(plans.map((p) => p.planYear))).sort().reverse().map((y) => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <select
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              className="px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 cursor-pointer"
            >
              <option value="">全部项目提报单位</option>
              {businessDivisions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 cursor-pointer"
            >
              <option value="">全部类别</option>
              {projectCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={filterReviewStatus}
              onChange={(e) => setFilterReviewStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 cursor-pointer"
            >
              <option value="">全部审核状态</option>
              {Object.entries(reviewStatusMap).map(([key, v]) => (
                <option key={key} value={key}>{v.label}</option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <i className="ri-search-line mr-1.5" />
              查询
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-refresh-line mr-1.5" />
              重置
            </button>
          </div>
        </div>

        {/* Summary + Action Buttons Row */}
        <div className="flex items-center justify-between">
          {/* Summary Info */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-steel-200 bg-white">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-bar-chart-2-line text-emerald-500 text-base" />
            </div>
            <span className="text-sm text-steel-500">总申报金额：</span>
            <span className="text-base font-semibold text-steel-800">{totalBudget.toFixed(3)}万元</span>
            <span className="text-steel-300 mx-1">|</span>
            <span className="text-sm text-steel-500">共</span>
            <span className="text-base font-semibold text-emerald-600">{filtered.length}</span>
            <span className="text-sm text-steel-500">项</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
              立项申请
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-2-line" /></div>
              导出表格
            </button>
            <button
              onClick={handleTemplateDownload}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-download-line" /></div>
              模板下载
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-2-line" /></div>
              导入
            </button>
            <input ref={importRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={() => showToast('导入成功', 'success')} />
          </div>
        </div>

        {/* Table */}
        <DeclarationTable
          plans={paginated}
          columns={columns}
          onToggleVisible={toggleVisible}
          onReorder={reorderColumns}
          onResetColumns={resetColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewLog={handleViewLog}
          onViewApproval={handleViewApproval}
          onProcessApproval={handleProcessApproval}
          onWithdraw={handleWithdrawPlan}
          getApprovalRecord={getApprovalByPlanId}
          pageOffset={pageOffset}
          budgetSort={budgetSort}
          benefitSort={benefitSort}
          onSortBudget={handleSortBudget}
          onSortBenefit={handleSortBenefit}
        />

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>
                共 <span className="font-medium text-steel-700">{filtered.length}</span> 条，
                第 <span className="font-medium text-steel-700">{currentPage}</span> /
                <span className="font-medium text-steel-700"> {totalPages || 1}</span> 页
              </span>
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
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <i className="ri-skip-left-line text-sm" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-s-line" />
              </button>
              {renderPagination().map((page, i) =>
                page === '...' ? (
                  <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-steel-400 text-sm">···</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${
                      currentPage === page ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'
                    }`}
                    style={currentPage === page ? { background: 'linear-gradient(135deg, #10b981, #059669)' } : undefined}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <i className="ri-arrow-right-s-line" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages || 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <i className="ri-skip-right-line text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={confirmCfg.title}
        content={confirmCfg.content}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmCfg.onConfirm}
        confirmText={confirmCfg.confirmText}
        confirmType={confirmCfg.confirmType}
      />

      {/* Approval Init Modal removed: 提交在新增/编辑页发起部门内审 */}

      <DeclOperationLogModal
        open={logOpen}
        planId={logPlan?.id || ''}
        planName={logPlan?.planName || ''}
        onClose={() => { setLogOpen(false); setLogPlan(null); }}
      />

      {/* Approval Result Modal */}
      <ApprovalResultModal
        open={approvalResultOpen}
        plan={approvalResultPlan}
        approvalRecord={approvalResultRecord}
        onClose={() => { setApprovalResultOpen(false); setApprovalResultPlan(null); setApprovalResultRecord(null); }}
        onWithdraw={handleWithdrawApproval}
        onGoProcess={(record) => {
          setApprovalResultOpen(false);
          navigate(`/project-plan/approval-process?id=${record.id}`);
        }}
      />

      {/* Withdraw Confirmation */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setWithdrawModalOpen(false); setWithdrawTarget(null); }} />
          <div className="relative bg-white rounded-xl shadow-xl w-[400px] p-5 z-10">
            <h3 className="text-base font-semibold text-slate-800 mb-3">撤回申请</h3>
            <p className="text-sm text-slate-700 mb-2">
              确认撤回「{withdrawTarget?.planName}」？
            </p>
            <p className="text-sm text-slate-500 mb-4">
              撤回后状态恢复为草稿，可修改后重新发起。仅在尚未有任何审批时允许撤回。
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => { setWithdrawModalOpen(false); setWithdrawTarget(null); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={confirmWithdraw} className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 cursor-pointer whitespace-nowrap" style={{ background: '#ef4444' }}>确认撤回</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={toast.type === 'success' ? 'ri-checkbox-circle-line text-green-500' : 'ri-close-circle-line text-red-500'} />
            </div>
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{toast.msg}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}