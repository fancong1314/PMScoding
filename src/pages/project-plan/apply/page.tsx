import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { applyRecords, applyProjectTypes } from '@/mocks/applyMocks';
import type { ApplyRecord } from '@/mocks/applyMocks';
import { useColumnConfig } from '@/hooks/useColumnConfig';
import type { ColumnDef } from '@/hooks/useColumnConfig';
import ApplyTable from './components/ApplyTable';
import ConfirmModal from '@/pages/project-plan/declaration/components/ConfirmModal';

const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: 'applyNo',      label: '论证申请单号', visible: true,  width: 130 },
  { id: 'applyName',    label: '论证申请名称', visible: true,  width: 220 },
  { id: 'planNo',       label: '年度计划号',   visible: true,  width: 110 },
  { id: 'projectType',  label: '项目类型',     visible: true,  width: 120 },
  { id: 'manager',      label: '项目经理',     visible: true,  width: 90  },
  { id: 'investAmount', label: '投资概算',     visible: false, width: 110 },
  { id: 'status',       label: '状态',         visible: true,  width: 150 },
];

function getStoredRecords(): ApplyRecord[] {
  try {
    const s = localStorage.getItem('ng_apply_records');
    return s ? JSON.parse(s) : applyRecords;
  } catch { return applyRecords; }
}

function setStoredRecords(records: ApplyRecord[]) {
  try { localStorage.setItem('ng_apply_records', JSON.stringify(records)); } catch { /* ignore */ }
}

export default function ProjectApplyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [records, setRecords] = useState<ApplyRecord[]>(getStoredRecords);
  const [planNo, setPlanNo] = useState('');
  const [applyName, setApplyName] = useState('');
  const [applyNo, setApplyNo] = useState('');
  const [projectType, setProjectType] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', content: '', onConfirm: () => {}, confirmText: '确认', confirmType: 'primary' as 'danger' | 'primary' | 'warning' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { columns, resetColumns, toggleVisible, reorderColumns, updateWidth } =
    useColumnConfig('project-apply-list', DEFAULT_COLUMNS);

  useEffect(() => {
    if (location.state?.success) {
      showToast(location.state.message || '操作成功', 'success');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  useEffect(() => { setStoredRecords(records); }, [records]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = () => setCurrentPage(1);

  const handleReset = () => {
    setPlanNo(''); setApplyName(''); setApplyNo('');
    setProjectType(''); setReviewer('');
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (planNo && !r.planNo.includes(planNo)) return false;
      if (applyName && !r.applyName.includes(applyName)) return false;
      if (applyNo && r.applyNo !== applyNo) return false;
      if (projectType && r.projectType !== projectType) return false;
      if (reviewer && !r.reviewer.includes(reviewer)) return false;
      return true;
    });
  }, [records, planNo, applyName, applyNo, projectType, reviewer]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageOffset, pageOffset + pageSize);

  const handleView = (record: ApplyRecord) => navigate(`/project-plan/apply/present-form?id=${record.id}&readonly=true`);

  // 立项申请：通知战运部朱科长
  const handleNewApplyAction = (record: ApplyRecord) => {
    setConfirmConfig({
      title: '立项申请确认',
      content: `确定要将「${record.applyName}」提交立项申请？系统将自动向战运部朱科长发送消息通知。`,
      onConfirm: () => {
        showToast('立项申请已提交，消息通知已发送至战运部朱科长', 'success');
        setConfirmOpen(false);
      },
      confirmText: '确认提交', confirmType: 'primary',
    });
    setConfirmOpen(true);
  };

  const handlePrint = (record: ApplyRecord) => {
    showToast(`正在打印「${record.applyName}」...`, 'success');
  };

  // 呈核：跳转到呈核表单页
  const handlePresent = (record: ApplyRecord) => {
    navigate(`/project-plan/apply/present-form?id=${record.id}`);
  };

  // 表格操作列：呈核跳转呈核表单页
  const handleTablePresent = (record: ApplyRecord) => {
    navigate(`/project-plan/apply/present-form?id=${record.id}`);
  };

  const handleDelete = (record: ApplyRecord) => {
    setConfirmConfig({
      title: '删除确认',
      content: `确定要删除「${record.applyName}」？删除后不可恢复。`,
      onConfirm: () => {
        setRecords((prev) => prev.filter((r) => r.id !== record.id));
        setSelectedRows((prev) => prev.filter((id) => id !== record.id));
        showToast('删除成功');
        setConfirmOpen(false);
      },
      confirmText: '删除', confirmType: 'danger',
    });
    setConfirmOpen(true);
  };

  const toggleSelectAll = () => {
    setSelectedRows(selectedRows.length === paginated.length ? [] : paginated.map((r) => r.id));
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
        <div>
          <h1 className="text-lg font-semibold text-steel-900">项目立项申请</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理项目立项申请的全流程信息</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">年度计划号</label>
              <input value={planNo} onChange={(e) => setPlanNo(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">论证申请名称</label>
              <input value={applyName} onChange={(e) => setApplyName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">论证申请单号</label>
              <input value={applyNo} onChange={(e) => setApplyNo(e.target.value)} placeholder="精确匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-20 text-right flex-shrink-0">项目类型</label>
              <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {applyProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">审核经办人</label>
              <div className="relative flex-1">
                <input value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="模糊匹配" className={inputCls + ' pr-8'} />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                  <i className="ri-user-search-line text-steel-300 text-sm" />
                </div>
              </div>
            </div>

          </div>
          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-steel-100">
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
              重置
            </button>
            <button onClick={handleSearch}
              className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
              查询
            </button>
          </div>
        </div>

        {/* Action Buttons & Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => {
              if (selectedRows.length !== 1) {
                showToast('请选择一条记录进行立项申请', 'error'); return;
              }
              const target = records.find((r) => r.id === selectedRows[0]);
              if (!target) return;
              handleNewApplyAction(target);
            }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
              立项申请
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs text-steel-400">
            <span>共 <span className="font-semibold text-steel-700">{filtered.length}</span> 条记录</span>
          </div>
        </div>

        {/* Table */}
        <ApplyTable
          records={paginated}
          selectedRows={selectedRows}
          columns={columns}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectRow={(id) => setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id])}
          onView={handleView}
          onPresent={handleTablePresent}
          onNewApply={handleNewApplyAction}
          onPrint={handlePrint}
          onDelete={handleDelete}
          onToggleVisible={toggleVisible}
          onReorder={reorderColumns}
          onUpdateWidth={updateWidth}
          onResetColumns={resetColumns}
          pageOffset={pageOffset}
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

      <ConfirmModal open={confirmOpen} title={confirmConfig.title} content={confirmConfig.content}
        onClose={() => setConfirmOpen(false)} onConfirm={confirmConfig.onConfirm}
        confirmText={confirmConfig.confirmText} confirmType={confirmConfig.confirmType} />

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
