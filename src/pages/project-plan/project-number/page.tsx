import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { projectNumberRecords, projectNumberTypes, projectNumberUnits, projectNumberOwnerUnits } from '@/mocks/projectNumberMocks';
import type { ProjectNumberRecord } from '@/mocks/projectNumberMocks';
import { useColumnConfig } from '@/hooks/useColumnConfig';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import ProjectNumberTable from './components/ProjectNumberTable';
import OperationLogModal from './components/OperationLogModal';
import ConfirmModal from '@/pages/project-plan/declaration/components/ConfirmModal';

const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: 'projectName',       label: '项目名称',           visible: true,  width: 260 },
  { id: 'isPreProject',      label: '是否预立项',         visible: true,  width: 90  },
  { id: 'preProjectAmount',  label: '预立项金额',         visible: true,  width: 100 },
  { id: 'preProjectDate',    label: '预立项日期',         visible: true,  width: 100 },
  { id: 'planNo',            label: '年度计划号',         visible: true,  width: 110 },
  { id: 'applyNo',           label: '论证申请单号',       visible: false, width: 130 },
  { id: 'projectContent',    label: '项目内容',           visible: false, width: 200 },
  { id: 'projectAmount',     label: '立项金额',           visible: true,  width: 110 },
  { id: 'projectDate',       label: '立项日期',           visible: true,  width: 100 },
  { id: 'division',          label: '所属事业部',         visible: true,  width: 110 },
  { id: 'ownerUnit',         label: '业主单位',           visible: true,  width: 110 },
  { id: 'implementUnit',     label: '实施主管部门',       visible: true,  width: 110 },
  { id: 'professionalUnit',  label: '专业主管部门',       visible: false, width: 110 },
  { id: 'isPlanInternal',    label: '是否计划内',         visible: true,  width: 90  },
  { id: 'isSuperFast',       label: '是否超平快',         visible: false, width: 90  },
  { id: 'needSafetyAssessment', label: '是否需要职业健康安全评估', visible: false, width: 140 },
  { id: 'needHealthAssessment', label: '是否需要职业卫生评估',     visible: false, width: 130 },
  { id: 'projectType',       label: '工程类型',           visible: true,  width: 120 },
  { id: 'planStartDate',     label: '计划开工时间',       visible: true,  width: 100 },
  { id: 'planEndDate',       label: '计划完成时间',       visible: true,  width: 100 },
  { id: 'projectManager',    label: '项目负责人',         visible: true,  width: 120 },
  { id: 'managerPhone',      label: '项目负责人电话',     visible: false, width: 120 },
  { id: 'status',            label: '状态',               visible: true,  width: 90  },
];

export default function ProjectNumberPage() {
  const navigate = useNavigate();

  const [records, setRecords] = useState<ProjectNumberRecord[]>(projectNumberRecords);
  const [filterProjectNo, setFilterProjectNo] = useState('');
  const [filterProjectName, setFilterProjectName] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterIsPreProject, setFilterIsPreProject] = useState('');
  const [filterPlanNo, setFilterPlanNo] = useState('');
  const [filterImplementUnit, setFilterImplementUnit] = useState('');
  const [filterProjectType, setFilterProjectType] = useState('');
  const [filterOwnerUnit, setFilterOwnerUnit] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [logOpen, setLogOpen] = useState(false);
  const [logRecord, setLogRecord] = useState<ProjectNumberRecord | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: '', content: '', onConfirm: () => {}, confirmText: '确认', confirmType: 'danger' as 'danger' | 'primary' | 'warning',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { columns, resetColumns, toggleVisible, reorderColumns, updateWidth } =
    useColumnConfig('project-number-list', DEFAULT_COLUMNS);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterProjectNo && !r.projectNo.includes(filterProjectNo)) return false;
      if (filterProjectName && !r.projectName.includes(filterProjectName)) return false;
      if (filterStartDate && r.projectDate && r.projectDate < filterStartDate) return false;
      if (filterEndDate && r.projectDate && r.projectDate > filterEndDate) return false;
      if (filterIsPreProject !== '' && String(r.isPreProject) !== filterIsPreProject) return false;
      if (filterPlanNo && !r.planNo.includes(filterPlanNo)) return false;
      if (filterImplementUnit && r.implementUnit !== filterImplementUnit) return false;
      if (filterProjectType && r.projectType !== filterProjectType) return false;
      if (filterOwnerUnit && r.ownerUnit !== filterOwnerUnit) return false;
      return true;
    });
  }, [records, filterProjectNo, filterProjectName, filterStartDate, filterEndDate, filterIsPreProject, filterPlanNo, filterImplementUnit, filterProjectType, filterOwnerUnit]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageOffset, pageOffset + pageSize);

  const handleReset = () => {
    setFilterProjectNo(''); setFilterProjectName(''); setFilterStartDate('');
    setFilterEndDate(''); setFilterIsPreProject(''); setFilterPlanNo('');
    setFilterImplementUnit(''); setFilterProjectType(''); setFilterOwnerUnit('');
    setCurrentPage(1);
  };

  const handleModify = (record: ProjectNumberRecord) => {
    navigate(`/project-plan/project-number/form?id=${record.id}&mode=edit`);
  };

  const handleDelete = (record: ProjectNumberRecord) => {
    setConfirmConfig({
      title: '删除确认',
      content: `确定要删除立项号「${record.projectNo}」的信息吗？删除后将无法恢复。`,
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

  const handleChange = (record: ProjectNumberRecord) => {
    navigate(`/project-plan/project-number/change-form?id=${record.id}`);
  };

  const handlePrint = (record: ProjectNumberRecord) => {
    showToast(`正在生成「${record.projectName}」的立项通知单...`, 'success');
    setTimeout(() => {
      showToast('立项通知单已生成，请使用浏览器打印功能打印');
    }, 1500);
  };

  const handleViewLog = (record: ProjectNumberRecord) => {
    setLogRecord(record);
    setLogOpen(true);
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
          <h1 className="text-lg font-semibold text-steel-900">立项号管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理项目立项号的全生命周期信息</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-5 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">立项号</label>
              <input value={filterProjectNo} onChange={(e) => setFilterProjectNo(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目名称</label>
              <input value={filterProjectName} onChange={(e) => setFilterProjectName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
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
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">是否预立项</label>
              <select value={filterIsPreProject} onChange={(e) => setFilterIsPreProject(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">年度计划号</label>
              <div className="relative flex-1">
                <input value={filterPlanNo} onChange={(e) => setFilterPlanNo(e.target.value)} placeholder="精确匹配" className={inputCls + ' pr-8'} />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                  <i className="ri-search-line text-steel-300 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">实施主管单位</label>
              <select value={filterImplementUnit} onChange={(e) => setFilterImplementUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {projectNumberUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目类型</label>
              <select value={filterProjectType} onChange={(e) => setFilterProjectType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {projectNumberTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">业主单位</label>
              <select value={filterOwnerUnit} onChange={(e) => setFilterOwnerUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {projectNumberOwnerUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
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
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/project-plan/project-number/form')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
              手动新增
            </button>
          </div>
          <div className="text-xs text-steel-400">
            共 <span className="font-semibold text-steel-700">{filtered.length}</span> 条记录
          </div>
        </div>

        {/* Table */}
        <ProjectNumberTable
          records={paginated}
          columns={columns}
          pageOffset={pageOffset}
          onModify={handleModify}
          onDelete={handleDelete}
          onChange={handleChange}
          onPrint={handlePrint}
          onViewLog={handleViewLog}
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
                    style={currentPage === page ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}>
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
      <OperationLogModal open={logOpen} record={logRecord} onClose={() => { setLogOpen(false); setLogRecord(null); }} />

      {/* Confirm Modal */}
      <ConfirmModal open={confirmOpen} title={confirmConfig.title} content={confirmConfig.content}
        onClose={() => setConfirmOpen(false)} onConfirm={confirmConfig.onConfirm}
        confirmText={confirmConfig.confirmText} confirmType={confirmConfig.confirmType} />

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