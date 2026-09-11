import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { planDeferralRecords, divisions, projectCategories, projectMajorCategories, reportYears } from '@/mocks/planDeferralMocks';
import type { PlanDeferralRecord, PlanApplicationType } from '@/mocks/planDeferralMocks';
import PlanDeferralTable from './components/PlanDeferralTable';
import PlanOperationLogModal from './components/PlanOperationLogModal';

export default function PlanDeferralPage() {
  const navigate = useNavigate();

  const [records] = useState<PlanDeferralRecord[]>(planDeferralRecords);

  const [filterYear, setFilterYear] = useState('');
  const [filterPlanNo, setFilterPlanNo] = useState('');
  const [filterPlanName, setFilterPlanName] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterMajorCategory, setFilterMajorCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [logOpen, setLogOpen] = useState(false);
  const [logRecord, setLogRecord] = useState<PlanDeferralRecord | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterYear && String(r.planYear) !== filterYear) return false;
      if (filterPlanNo && !r.planNo.includes(filterPlanNo)) return false;
      if (filterPlanName && !r.planName.includes(filterPlanName)) return false;
      if (filterDivision && r.division !== filterDivision) return false;
      if (filterMajorCategory && r.projectMajorCategory !== filterMajorCategory) return false;
      if (filterCategory && r.projectType !== filterCategory) return false;
      return true;
    });
  }, [records, filterYear, filterPlanNo, filterPlanName, filterDivision, filterMajorCategory, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageOffset, pageOffset + pageSize);

  const handleReset = () => {
    setFilterYear('');
    setFilterPlanNo('');
    setFilterPlanName('');
    setFilterDivision('');
    setFilterMajorCategory('');
    setFilterCategory('');
    setCurrentPage(1);
  };

  const handleViewLog = (record: PlanDeferralRecord) => {
    setLogRecord(record);
    setLogOpen(true);
  };

  const handleApply = (record: PlanDeferralRecord, type: PlanApplicationType) => {
    navigate(`/project-plan/plan-deferral/form?id=${record.id}&type=${type}`);
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
          <h1 className="text-lg font-semibold text-steel-900">年度计划暂缓</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理年度计划的延期、暂缓、终止及启动申请</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">计划年度</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">全部年度</option>
                {reportYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">年度计划号</label>
              <input
                value={filterPlanNo}
                onChange={(e) => setFilterPlanNo(e.target.value)}
                placeholder="精确匹配"
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">年度计划名称</label>
              <input
                value={filterPlanName}
                onChange={(e) => setFilterPlanName(e.target.value)}
                placeholder="模糊匹配"
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目提报单位</label>
              <select
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">全部项目提报单位</option>
                {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目大类</label>
              <select
                value={filterMajorCategory}
                onChange={(e) => setFilterMajorCategory(e.target.value)}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">全部大类</option>
                {projectMajorCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目类型</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">全部类型</option>
                {projectCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-steel-100">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
              重置
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
              查询
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <span className="text-xs text-steel-400">
            共 <span className="font-semibold text-steel-700">{filtered.length}</span> 条记录
          </span>
        </div>

        <PlanDeferralTable
          records={paginated}
          pageOffset={pageOffset}
          onViewLog={handleViewLog}
          onApply={handleApply}
        />

        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{filtered.length}</span> 条</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none"
              >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
                <option value={100}>100条/页</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-arrow-left-s-line" />
              </button>
              {renderPagination().map((page, i) =>
                page === '...' ? (
                  <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-steel-400 text-sm">···</span>
                ) : (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${currentPage === page ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`}
                    style={currentPage === page ? { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' } : undefined}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-arrow-right-s-line" />
              </button>
            </div>
          </div>
        )}
      </div>

      {logRecord && (
        <PlanOperationLogModal
          open={logOpen}
          planId={logRecord.id}
          planName={logRecord.planName}
          onClose={() => { setLogOpen(false); setLogRecord(null); }}
        />
      )}

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
