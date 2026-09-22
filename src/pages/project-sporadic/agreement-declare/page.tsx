import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  AGREEMENT_DECLARE_STORAGE_KEY,
  canDeleteAgreement,
  canEditAgreement,
  canWithdrawAgreement,
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
import AgreementOpLogModal from '../components/AgreementOpLogModal';
import ConfirmDialog from '../components/ConfirmDialog';
import ListPagination from '../components/ListPagination';

function getStored(): SporadicAgreementRecord[] {
  try {
    const s = localStorage.getItem(AGREEMENT_DECLARE_STORAGE_KEY);
    if (s) return (JSON.parse(s) as SporadicAgreementRecord[]).map(withAgreementFormFields);
    localStorage.removeItem('ng_sporadic_agreement_v7');
    localStorage.removeItem('ng_sporadic_agreement_v6');
    localStorage.removeItem('ng_sporadic_agreement_v5');
    localStorage.removeItem('ng_sporadic_agreement_v4');
    localStorage.removeItem('ng_sporadic_agreement_v3');
    localStorage.removeItem('ng_sporadic_agreement_v2');
    localStorage.removeItem('ng_sporadic_agreement_v1');
  } catch { /* noop */ }
  return initial.map((r) => withAgreementFormFields(r));
}

export default function AgreementDeclarePage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<SporadicAgreementRecord[]>(() => getStored());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterUrgent, setFilterUrgent] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState<SporadicAgreementStatus | ''>('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmKind, setConfirmKind] = useState<'delete' | 'withdraw' | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<SporadicAgreementRecord | null>(null);
  const [logTarget, setLogTarget] = useState<SporadicAgreementRecord | null>(null);

  useEffect(() => {
    localStorage.setItem(AGREEMENT_DECLARE_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const matched = useMemo(() => {
    const list = records.filter((r) => {
      if (filterName && !r.declareName.includes(filterName)) return false;
      if (filterUrgent === 'yes' && !r.isUrgent) return false;
      if (filterUrgent === 'no' && r.isUrgent) return false;
      if (filterType && r.projectType !== filterType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterUnit && r.submitUnit !== filterUnit) return false;
      if (filterSupplier && !r.supplierName.includes(filterSupplier)) return false;
      return true;
    });
    return sortAgreementsByDeclareTime(list);
  }, [records, filterName, filterUrgent, filterType, filterStatus, filterUnit, filterSupplier]);

  const emptyHint = matched.length === 0;
  const filtered = emptyHint ? sortAgreementsByDeclareTime(records) : matched;
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

  const handleConfirm = () => {
    if (!confirmTarget || !confirmKind) return;
    if (confirmKind === 'delete') {
      setRecords((prev) => prev.filter((r) => r.id !== confirmTarget.id));
      setSelectedIds((prev) => prev.filter((id) => id !== confirmTarget.id));
      showToast('已删除该协议单');
    } else {
      setRecords((prev) =>
        prev.map((r) => (r.id === confirmTarget.id ? { ...r, status: 'withdrawn' as const } : r)),
      );
      showToast('已撤回该协议单');
    }
    setConfirmKind(null);
    setConfirmTarget(null);
  };

  const inputCls =
    'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-3">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">零星协议单申报</h1>
          <p className="text-xs text-steel-400 mt-0.5">提报单位选择框架合同后发起零星协议单（5万以内零星施工）</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-28 text-right flex-shrink-0">申报名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-28 text-right flex-shrink-0">是否紧急抢修</label>
              <select value={filterUrgent} onChange={(e) => setFilterUrgent(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部</option>
                <option value="yes">是</option>
                <option value="no">否</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-28 text-right flex-shrink-0">项目类型</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部类型</option>
                {sporadicProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-28 text-right flex-shrink-0">申报状态</label>
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
              <label className="text-xs text-steel-500 whitespace-nowrap w-28 text-right flex-shrink-0">提报单位</label>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部单位</option>
                {sporadicSubmitUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-28 text-right flex-shrink-0">供应商</label>
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
            未匹配到筛选结果，已回退展示全部协议单演示数据
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/project-sporadic/agreement-declare/form?mode=new')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
          >
            <i className="ri-add-line" />新增
          </button>
          <span className="text-xs text-steel-400">
            已选 {selectedIds.length} 条 · 共 {filtered.length} 条
            <span className="ml-2 inline-flex items-center gap-1 text-steel-400">
              <i className="ri-alarm-warning-fill text-red-500 text-[11px]" />
              红色警示角标表示紧急抢修
            </span>
          </span>
        </div>

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
            mode="declare"
            canDelete={(r) => canDeleteAgreement(r.status)}
            canEdit={(r) => canEditAgreement(r.status)}
            canWithdraw={(r) => canWithdrawAgreement(r.status)}
            onEdit={(r) => navigate(`/project-sporadic/agreement-declare/form?mode=edit&id=${r.id}`)}
            onDetail={(r) => navigate(`/project-sporadic/agreement-declare/form?mode=view&id=${r.id}`)}
            onDelete={(r) => { setConfirmTarget(r); setConfirmKind('delete'); }}
            onWithdraw={(r) => { setConfirmTarget(r); setConfirmKind('withdraw'); }}
            onLog={(r) => setLogTarget(r)}
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

      <ConfirmDialog
        open={!!confirmKind && !!confirmTarget}
        title={confirmKind === 'delete' ? '确认删除' : '确认撤回'}
        message={
          confirmKind === 'delete'
            ? `确定删除协议单「${confirmTarget?.declareName || ''}」吗？删除后不可恢复。`
            : `确定撤回协议单「${confirmTarget?.declareName || ''}」吗？撤回后可重新修改再提交。`
        }
        confirmText={confirmKind === 'delete' ? '确认删除' : '确认撤回'}
        danger={confirmKind === 'delete'}
        onCancel={() => { setConfirmKind(null); setConfirmTarget(null); }}
        onConfirm={handleConfirm}
      />

      <AgreementOpLogModal
        open={!!logTarget}
        bizId={logTarget?.id || ''}
        title={logTarget?.declareName || ''}
        onClose={() => setLogTarget(null)}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-4 py-2.5 rounded-lg bg-steel-800 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}
    </Layout>
  );
}
