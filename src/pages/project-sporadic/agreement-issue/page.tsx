import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  AGREEMENT_DECLARE_STORAGE_KEY,
  appendAgreementOpLog,
  canReturnRejectIssueItem,
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
import ListPagination from '../components/ListPagination';
import ReasonDialog from '../components/ReasonDialog';

type IssueTab = 'pending' | 'issued';
type ReasonAction = 'return' | 'reject';

const TABS: { key: IssueTab; label: string; icon: string }[] = [
  { key: 'pending', label: '待签发', icon: 'ri-time-line' },
  { key: 'issued', label: '已签发', icon: 'ri-checkbox-circle-line' },
];

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
  const [logTarget, setLogTarget] = useState<SporadicAgreementRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [reasonAction, setReasonAction] = useState<ReasonAction | null>(null);
  const [reasonTargets, setReasonTargets] = useState<SporadicAgreementRecord[]>([]);

  useEffect(() => {
    localStorage.setItem(AGREEMENT_DECLARE_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    setSelectedIds([]);
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const onFocus = () => setRecords(getStored());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

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

  const openReason = (action: ReasonAction, targets: SporadicAgreementRecord[]) => {
    const eligible = targets.filter((r) => canReturnRejectIssueItem(r.issueStatus));
    if (eligible.length === 0) {
      showToast(action === 'return' ? '请选择可退回的记录' : '请选择可驳回的记录');
      return;
    }
    setReasonTargets(eligible);
    setReasonAction(action);
  };

  const handleReasonConfirm = (reason: string) => {
    if (!reasonAction || reasonTargets.length === 0) return;
    const opLabel = reasonAction === 'return' ? '退回' : '驳回';
    const ids = new Set(reasonTargets.map((r) => r.id));

    setRecords((prev) => prev.map((r) => {
      if (!ids.has(r.id)) return r;
      if (reasonAction === 'return') {
        // 待签发退回审查；已签发退回待签发
        const nextIssue = r.issueStatus === 'issued' ? 'pending' : 'none';
        return withAgreementFormFields({
          ...r,
          issueStatus: nextIssue,
          issuer: nextIssue === 'pending' ? '' : r.issuer,
          issueTime: nextIssue === 'pending' ? '' : r.issueTime,
          lastReturnRejectReason: reason,
        });
      }
      // 驳回：申报状态驳回，退出签发池
      return withAgreementFormFields({
        ...r,
        status: 'rejected',
        issueStatus: 'none',
        issuer: '',
        issueTime: '',
        lastReturnRejectReason: reason,
      });
    }));

    reasonTargets.forEach((r) => {
      appendAgreementOpLog({
        bizId: r.id,
        operation: opLabel,
        remark: `签发${opLabel}：${reason}`,
      });
    });

    showToast(`已${opLabel} ${reasonTargets.length} 条记录`);
    setSelectedIds((prev) => prev.filter((id) => !ids.has(id)));
    setReasonAction(null);
    setReasonTargets([]);
  };

  const inputCls =
    'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-3">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">零星协议单签发</h1>
          <p className="text-xs text-steel-400 mt-0.5">待签发协议单可查看详情并办理签发，支持退回与驳回</p>
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
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-steel-100 bg-slate-50/60">
            <span className="text-xs text-steel-500">
              已选 <span className="text-sky-600 font-medium">{selectedIds.length}</span> 条
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const rows = records.filter((r) => selectedIds.includes(r.id));
                  openReason('return', rows);
                }}
                disabled={selectedIds.length === 0}
                className="px-3 py-1.5 text-xs text-orange-600 border border-orange-200 rounded-md hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-arrow-go-back-line mr-1" />退回
              </button>
              <button
                type="button"
                onClick={() => {
                  const rows = records.filter((r) => selectedIds.includes(r.id));
                  openReason('reject', rows);
                }}
                disabled={selectedIds.length === 0}
                className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-close-circle-line mr-1" />驳回
              </button>
            </div>
          </div>
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
            nameClickable
            onDetail={(row) => navigate(`/project-sporadic/agreement-issue/form?mode=view&id=${row.id}`)}
            onIssue={(row) => navigate(`/project-sporadic/agreement-issue/form?mode=issue&id=${row.id}`)}
            onLog={(row) => setLogTarget(row)}
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

      <AgreementOpLogModal
        open={!!logTarget}
        bizId={logTarget?.id || ''}
        title={logTarget?.declareName || ''}
        onClose={() => setLogTarget(null)}
      />

      <ReasonDialog
        open={!!reasonAction}
        title={reasonAction === 'return' ? '退回确认' : '驳回确认'}
        message={
          reasonAction === 'return'
            ? (activeTab === 'issued'
              ? '确认退回所选已签发协议单？退回后将回到待签发。'
              : '确认退回所选待签发协议单？退回后将退出签发池。')
            : '确认驳回所选协议单？驳回后申报状态变为已驳回。'
        }
        confirmText={reasonAction === 'return' ? '确认退回' : '确认驳回'}
        danger={reasonAction === 'reject'}
        count={reasonTargets.length}
        reasonLabel={reasonAction === 'return' ? '退回原因' : '驳回原因'}
        reasonPlaceholder={reasonAction === 'return' ? '请填写退回原因' : '请填写驳回原因'}
        onCancel={() => { setReasonAction(null); setReasonTargets([]); }}
        onConfirm={handleReasonConfirm}
      />

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg bg-steel-800 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}
    </Layout>
  );
}
