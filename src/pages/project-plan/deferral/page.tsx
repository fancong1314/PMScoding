import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { deferralProjects, projectTypes, companyAliases, ownerUnits, implementUnits, projectStatusMap } from '@/mocks/deferralMocks';
import type { DeferralProject, ApplicationType, ProjectStatus } from '@/mocks/deferralMocks';
import { useColumnConfig } from '@/hooks/useColumnConfig';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import DeferralTable from './components/DeferralTable';
import OperationLogModal from './components/OperationLogModal';

const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: 'projectNo',       label: '立项号',     visible: true, width: 120 },
  { id: 'companyAlias',    label: '公司别',     visible: true, width: 100 },
  { id: 'isPreProject',    label: '是否预立项', visible: true, width: 90  },
  { id: 'preProjectAmount',label: '预立项金额', visible: true, width: 110 },
  { id: 'preProjectDate',  label: '预立项日期', visible: true, width: 110 },
  { id: 'projectName',     label: '项目名称',   visible: true, width: 280 },
  { id: 'planNo',          label: '年度计划号', visible: true, width: 110 },
  { id: 'projectStatus',   label: '项目状态',   visible: true, width: 110 },
  { id: 'approvalStatus',  label: '审批状态',   visible: true, width: 100 },
];

export default function ProjectDeferralPage() {
  const navigate = useNavigate();

  const [projects] = useState<DeferralProject[]>(deferralProjects);
  const [filterProjectNo, setFilterProjectNo] = useState('');
  const [filterPlanNo, setFilterPlanNo] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterImplementUnit, setFilterImplementUnit] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterProjectType, setFilterProjectType] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterOwnerUnit, setFilterOwnerUnit] = useState('');
  const [filterProjectStatus, setFilterProjectStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [logOpen, setLogOpen] = useState(false);
  const [logProject, setLogProject] = useState<DeferralProject | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const { columns, resetColumns, toggleVisible, reorderColumns, updateWidth } =
    useColumnConfig('project-deferral-list', DEFAULT_COLUMNS);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filterProjectNo && !p.projectNo.includes(filterProjectNo)) return false;
      if (filterPlanNo && p.planNo !== filterPlanNo) return false;
      if (filterName && !p.projectName.includes(filterName)) return false;
      if (filterImplementUnit && p.implementUnit !== filterImplementUnit) return false;
      if (filterStartDate && p.planStartDate < filterStartDate) return false;
      if (filterEndDate && p.planStartDate > filterEndDate) return false;
      if (filterProjectType && p.projectType !== filterProjectType) return false;
      if (filterCompany && p.companyAlias !== filterCompany) return false;
      if (filterOwnerUnit && p.ownerUnit !== filterOwnerUnit) return false;
      if (filterProjectStatus && p.projectStatus !== filterProjectStatus) return false;
      return true;
    });
  }, [projects, filterProjectNo, filterPlanNo, filterName, filterImplementUnit,
      filterStartDate, filterEndDate, filterProjectType, filterCompany, filterOwnerUnit, filterProjectStatus]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageOffset, pageOffset + pageSize);

  const handleReset = () => {
    setFilterProjectNo(''); setFilterPlanNo(''); setFilterName('');
    setFilterImplementUnit(''); setFilterStartDate(''); setFilterEndDate('');
    setFilterProjectType(''); setFilterCompany(''); setFilterOwnerUnit('');
    setFilterProjectStatus(''); setCurrentPage(1);
  };

  const handleViewLog = (project: DeferralProject) => {
    setLogProject(project);
    setLogOpen(true);
  };

  const handleApply = (project: DeferralProject, type: ApplicationType) => {
    navigate(`/project-plan/deferral/form?id=${project.id}&type=${type}`);
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
          <h1 className="text-lg font-semibold text-steel-900">项目立项变更</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理项目延期、暂缓、取消、终止及立项变更申请</p>
        </div>

        {/* Notice Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex gap-3">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-information-line text-amber-500 text-base" />
          </div>
          <div className="text-xs text-amber-800 leading-relaxed">
            <span className="font-medium">审批流程说明：</span>
            立项状态及延期申请，在事业部/职能部门领导审核完后，需经专业部门审核，信息化项目由<strong>汝金同</strong>审核，人工智能项目由<strong>李瑾彦</strong>审核，自动化类由<strong>程鑫祥</strong>审核，其他类由<strong>赵航</strong>审核，再发起公司领导审批！此流程中的"立项变更"，为项目增补论证的前置审批，在事业部/职能部门领导审核完后，直接发起公司领导审批，公司领导同意后仍需发起增补论证流程。
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">立项号</label>
              <input value={filterProjectNo} onChange={(e) => setFilterProjectNo(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">年度计划号</label>
              <input value={filterPlanNo} onChange={(e) => setFilterPlanNo(e.target.value)} placeholder="精确匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">实施主管单位</label>
              <select value={filterImplementUnit} onChange={(e) => setFilterImplementUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {implementUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">立项日期</label>
              <div className="flex-1 flex items-center gap-1.5">
                <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="flex-1 px-2 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-slate-50" />
                <span className="text-steel-400 text-xs flex-shrink-0">至</span>
                <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="flex-1 px-2 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-slate-50" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目类型</label>
              <select value={filterProjectType} onChange={(e) => setFilterProjectType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">公司别</label>
              <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {companyAliases.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">业主单位</label>
              <select value={filterOwnerUnit} onChange={(e) => setFilterOwnerUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {ownerUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目状态</label>
              <select value={filterProjectStatus} onChange={(e) => setFilterProjectStatus(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部状态</option>
                {(Object.keys(projectStatusMap) as ProjectStatus[]).map((k) => (
                  <option key={k} value={k}>{projectStatusMap[k].label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-steel-100">
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>重置
            </button>
            <button onClick={() => setCurrentPage(1)}
              className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>查询
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-end">
          <span className="text-xs text-steel-400">
            共 <span className="font-semibold text-steel-700">{filtered.length}</span> 条记录
          </span>
        </div>

        {/* Table */}
        <DeferralTable
          records={paginated}
          columns={columns}
          pageOffset={pageOffset}
          onViewLog={handleViewLog}
          onApply={handleApply}
          onToggleVisible={toggleVisible}
          onReorder={reorderColumns}
          onUpdateWidth={updateWidth}
          onResetColumns={resetColumns}
        />

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{filtered.length}</span> 条</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none">
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
                <option value={100}>100条/页</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
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
                    style={currentPage === page ? { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' } : undefined}>
                    {page}
                  </button>
                )
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <i className="ri-arrow-right-s-line" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Operation Log Modal */}
      {logProject && (
        <OperationLogModal
          open={logOpen}
          projectId={logProject.id}
          projectName={logProject.projectName}
          onClose={() => { setLogOpen(false); setLogProject(null); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-sky-50 border-sky-200'}`}>
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={toast.type === 'success' ? 'ri-checkbox-circle-line text-green-500' : 'ri-information-line text-sky-500'} />
            </div>
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-sky-700'}`}>{toast.message}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
