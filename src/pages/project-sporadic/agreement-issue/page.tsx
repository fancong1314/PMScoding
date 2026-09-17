import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  AGREEMENT_DECLARE_STORAGE_KEY,
  sortAgreementsByDeclareTime,
  sporadicAgreementRecords as initial,
  sporadicAgreementStatusOptions,
  sporadicProjectTypes,
  sporadicSubmitUnits,
  withAgreementFormFields,
  type SporadicAgreementRecord,
  type SporadicAgreementStatus,
} from '@/mocks/sporadicProjectMocks';
import AgreementTable from '../components/AgreementTable';
import ListPagination from '../components/ListPagination';

type IssueTab = 'pending' | 'issued';

const TABS: { key: IssueTab; label: string; icon: string }[] = [
  { key: 'pending', label: '待签发', icon: 'ri-time-line' },
  { key: 'issued', label: '已签发', icon: 'ri-checkbox-circle-line' },
];

function getStored(): SporadicAgreementRecord[] {
  try {
    const s = localStorage.getItem(AGREEMENT_DECLARE_STORAGE_KEY);
    if (s) return (JSON.parse(s) as SporadicAgreementRecord[]).map(withAgreementFormFields);
    localStorage.removeItem('ng_sporadic_agreement_v5');
    localStorage.removeItem('ng_sporadic_agreement_v4');
    localStorage.removeItem('ng_sporadic_agreement_v3');
    localStorage.removeItem('ng_sporadic_agreement_v2');
    localStorage.removeItem('ng_sporadic_agreement_v1');
  } catch { /* noop */ }
  return initial.map((r) => withAgreementFormFields(r));
}

export default function AgreementIssuePage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<SporadicAgreementRecord[]>(() => getStored());
  const [activeTab, setActiveTab] = useState<IssueTab>('pending');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterUrgent, setFilterUrgent] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState<SporadicAgreementStatus | ''>('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    localStorage.setItem(AGREEMENT_DECLARE_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    setSelectedIds([]);
    setCurrentPage(1);
  }, [activeTab]);

  // 刷新时从 storage 同步（签发页返回后）
  useEffect(() => {
    const onFocus = () => setRecords(getStored());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const tabSeed = useMemo(
    () => sortAgreementsByDeclareTime(
      records.filter((r) => r.issueStatus === activeTab),
    ),
    [records, activeTab],
  );

  const tabCounts = useMemo(() => ({
    pending: records.filter((r) => r.issueStatus === 'pending').length,
    issued: records.filter((r) => r.issueStatus === 'issued').length,
  }), [records]);

  const matched = useMemo(() => {
    return tabSeed.filter((r) => {
      if (filterName && !r.declareName.includes(filterName)) return false;
      if (filterUrgent === 'yes' && !r.isUrgent) return false;
      if (filterUrgent === 'no' && r.isUrgent) return false;
      if (filterType && r.projectType !== filterType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterUnit && r.submitUnit !== filterUnit) return false;
      if (filterSupplier && !r.supplierName.includes(filterSupplier)) return false;
      return true;
    });
  }, [tabSeed, filterName, filterUrgent, filterType, filterStatus, filterUnit, filterSupplier]);

  const emptyHint = matched.length === 0;
  const filtered = emptyHint ? tabSeed : matched;
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageOffset, pageOffset + pageSize);

  const handleReset = () => {
    setFilterName('');
    setFilterUrgent('');
    setFilterType('');
    setFilterStatus('');
    setFilterUnit('');
    setFilterSupplier('');
    setCurrentPage(1);
  };

  const inputCls =
    'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-3">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">零星协议单签发</h1>
          <p className="text-xs text-steel-400 mt-0.5">待签发协议单可查看详情并办理签发</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-1 py-1 inline-flex flex-wrap gap-0.5">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-5 py-2 text-sm rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  active ? 'text-white font-medium' : 'text-steel-500 hover:text-steel-700'
                }`}
                style={active ? {
                  background: tab.key === 'pending'
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                } : undefined}
              >
                <i className={tab.icon} />
                {tab.label}
                <span className={`ml-1 text-xs ${active ? 'text-white/80' : 'text-steel-400'}`}>
                  ({tabCounts[tab.key]})
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">申报名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">是否紧急抢修</label>
              <select value={filterUrgent} onChange={(e) => setFilterUrgent(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                <option value="yes">是</option>
                <option value="no">否</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">项目类型</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部类型</option>
                {sporadicProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">申报状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SporadicAgreementStatus | '')}
                className={inputCls + ' cursor-pointer'}
              >
                {sporadicAgreementStatusOptions.map((o) => (
                  <option key={o.value || 'all'} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">提报单位</label>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部单位</option>
                {sporadicSubmitUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">供应商</label>
              <input value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-steel-100">
            <button type="button" onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              <i className="ri-refresh-line" />重置
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
            >
              <i className="ri-search-line" />查询
            </button>
          </div>
        </div>

        {emptyHint && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
            当前筛选无匹配数据，已回退展示本 TAB 全部演示数据
          </div>
        )}

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <AgreementTable
            rows={paginated}
            selectedIds={selectedIds}
            pageOffset={pageOffset}
            onToggleAll={(checked) => {
              if (checked) setSelectedIds(paginated.map((r) => r.id));
              else setSelectedIds((prev) => prev.filter((id) => !paginated.some((r) => r.id === id)));
            }}
            onToggleRow={(id) => {
              setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
            }}
            mode={activeTab === 'pending' ? 'issue-pending' : 'issue-issued'}
            onDetail={(row) => navigate(`/project-sporadic/agreement-issue/form?mode=view&id=${row.id}`)}
            onIssue={(row) => navigate(`/project-sporadic/agreement-issue/form?mode=issue&id=${row.id}`)}
          />
          <ListPagination
            total={filtered.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          />
        </div>
      </div>
    </Layout>
  );
}
