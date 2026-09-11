import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/feature/Layout';
import {
  JOINT_OPINION_SIGN_STORAGE_KEY,
  isOpinionDeadlineExpired,
  jointOpinionSignRecords as initialRecords,
  type JointOpinionSignRecord,
  type JointOpinionSignTab,
} from '@/mocks/jointOpinionSignMocks';
import SignOpinionModal, { type SignOpinionFormValue } from './components/SignOpinionModal';

function getStored(): JointOpinionSignRecord[] {
  try {
    const s = localStorage.getItem(JOINT_OPINION_SIGN_STORAGE_KEY);
    if (s) return JSON.parse(s) as JointOpinionSignRecord[];
  } catch { /* noop */ }
  return initialRecords.map((r) => ({ ...r }));
}

const TABS: { key: JointOpinionSignTab; label: string }[] = [
  { key: 'pending', label: '待签署' },
  { key: 'signed', label: '已签署' },
];

export default function JointOpinionSignPage() {
  const [records, setRecords] = useState<JointOpinionSignRecord[]>(() => getStored());
  const [activeTab, setActiveTab] = useState<JointOpinionSignTab>('pending');
  const [filterName, setFilterName] = useState('');
  const [appliedName, setAppliedName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deadlineSort, setDeadlineSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalRecord, setModalRecord] = useState<JointOpinionSignRecord | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem(JOINT_OPINION_SIGN_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabCounts = useMemo(() => ({
    pending: records.filter((r) => r.status === 'pending').length,
    signed: records.filter((r) => r.status === 'signed').length,
  }), [records]);

  const filtered = useMemo(() => {
    let list = records.filter((r) => {
      if (r.status !== activeTab) return false;
      if (appliedName && !r.planName.includes(appliedName)) return false;
      return true;
    });
    if (deadlineSort !== 'none') {
      list = [...list].sort((a, b) => {
        const cmp = a.opinionDeadline.localeCompare(b.opinionDeadline);
        return deadlineSort === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [records, activeTab, appliedName, deadlineSort]);

  const displayList = filtered.length > 0 || !appliedName
    ? filtered
    : records.filter((r) => r.status === activeTab);

  useEffect(() => {
    if (appliedName && filtered.length === 0) {
      showToast('未匹配到记录，已展示当前 TAB 全部演示数据', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedName, activeTab]);

  const totalPages = Math.max(1, Math.ceil(displayList.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paginated = displayList.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = () => {
    setAppliedName(filterName.trim());
    setCurrentPage(1);
  };

  const openSign = (record: JointOpinionSignRecord) => {
    if (isOpinionDeadlineExpired(record.opinionDeadline)) {
      showToast('已超过会审意见截至时间，无法签署', 'error');
      return;
    }
    setModalMode('create');
    setModalRecord(record);
    setModalOpen(true);
  };

  const openEdit = (record: JointOpinionSignRecord) => {
    setModalMode('edit');
    setModalRecord(record);
    setModalOpen(true);
  };

  const handleSubmit = (value: SignOpinionFormValue) => {
    if (!modalRecord) return;
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== modalRecord.id) return r;
        return {
          ...r,
          status: 'signed',
          passResult: value.passResult,
          signTime: value.signTime,
          signer: value.signer,
          reviewTime: value.reviewTime,
          reviewers: value.reviewers,
          opinion: value.opinion,
          attachments: value.attachments,
        };
      })
    );
    setModalOpen(false);
    setModalRecord(null);
    if (modalMode === 'create') {
      setActiveTab('signed');
      showToast('意见签署提交成功');
    } else {
      showToast('修改意见提交成功');
    }
  };

  const toggleDeadlineSort = () => {
    setDeadlineSort((prev) => (prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none'));
  };

  return (
    <Layout>
      <div className="p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-steel-900">会审意见签署</h2>
          <p className="text-xs text-steel-400 mt-0.5">年度计划审查 · 对待签署计划进行意见签署与结果维护</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 p-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-md border border-steel-200 p-0.5 bg-slate-50">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-1.5 text-sm rounded cursor-pointer whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-white text-emerald-700 font-medium shadow-sm'
                      : 'text-steel-500 hover:text-steel-700'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-xs ${active ? 'text-emerald-600' : 'text-steel-400'}`}>
                    ({tabCounts[tab.key]})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-steel-600 whitespace-nowrap">年度计划名称</label>
            <input
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="根据名称模糊搜索"
              className="w-56 px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-3 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              查询
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: activeTab === 'signed' ? 1280 : 1180 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-14">序号</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500" style={{ minWidth: 200 }}>年度计划名称</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">计划年度</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">项目大类</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类别</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">投资总估算(万元)</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">效益(万元)</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">申报人</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">项目提报单位</th>
                  {activeTab === 'signed' && (
                    <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">是否通过</th>
                  )}
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">
                    <button type="button" onClick={toggleDeadlineSort} className="inline-flex items-center gap-1 cursor-pointer hover:text-steel-700">
                      会审意见截至时间
                      <i className={`ri-arrow-up-down-line text-steel-400 ${deadlineSort !== 'none' ? 'text-primary-500' : ''}`} />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 w-28 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'signed' ? 12 : 11} className="px-3 py-12 text-center text-sm text-steel-400">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  paginated.map((row, idx) => {
                    const expired = isOpinionDeadlineExpired(row.opinionDeadline);
                    return (
                      <tr key={row.id} className="border-b border-steel-100 hover:bg-slate-50/60">
                        <td className="px-3 py-2.5 text-sm text-steel-500">{(page - 1) * pageSize + idx + 1}</td>
                        <td className="px-3 py-2.5">
                          <button
                            type="button"
                            className="text-sm text-primary-600 hover:text-primary-700 hover:underline cursor-pointer text-left"
                            title={row.planName}
                          >
                            {row.planName}
                          </button>
                        </td>
                        <td className="px-3 py-2.5 text-sm text-steel-700 whitespace-nowrap">{row.planYear}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700">
                            {row.projectMajorType}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{row.projectCategory}</td>
                        <td className="px-3 py-2.5 text-sm font-medium text-steel-800 whitespace-nowrap">
                          {row.budgetAmount.toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">
                          {row.benefit.toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{row.applicant}</td>
                        <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{row.submitUnit}</td>
                        {activeTab === 'signed' && (
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                                row.passResult === '通过'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : row.passResult === '不通过'
                                    ? 'bg-red-50 text-red-600'
                                    : 'bg-slate-100 text-steel-500'
                              }`}
                            >
                              {row.passResult || '—'}
                            </span>
                          </td>
                        )}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-sm ${expired ? 'text-red-500 font-medium' : 'text-steel-600'}`}>
                            {row.opinionDeadline}
                            {expired && (
                              <i
                                className="ri-alarm-warning-fill text-amber-500"
                                title="已超过会审意见截至时间"
                              />
                            )}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center whitespace-nowrap">
                          {activeTab === 'pending' ? (
                            <button
                              type="button"
                              disabled={expired}
                              onClick={() => openSign(row)}
                              className={`text-sm cursor-pointer ${
                                expired
                                  ? 'text-steel-300 cursor-not-allowed'
                                  : 'text-primary-600 hover:text-primary-700'
                              }`}
                              title={expired ? '已超过会审意见截至时间，不可签署' : '意见签署'}
                            >
                              意见签署
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openEdit(row)}
                              className="text-sm text-primary-600 hover:text-primary-700 cursor-pointer"
                            >
                              修改意见
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-steel-100">
            <span className="text-xs text-steel-400">
              共 {displayList.length} 条记录 第 {page} / {totalPages} 页
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 text-xs border border-steel-200 rounded disabled:opacity-40 cursor-pointer"
              >
                上一页
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCurrentPage(n)}
                  className={`w-7 h-7 text-xs rounded cursor-pointer ${
                    page === n ? 'bg-primary-600 text-white' : 'border border-steel-200 text-steel-600'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 text-xs border border-steel-200 rounded disabled:opacity-40 cursor-pointer"
              >
                下一页
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-steel-500">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-steel-200 rounded cursor-pointer"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}条/页</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <SignOpinionModal
        open={modalOpen}
        mode={modalMode}
        record={modalRecord}
        onClose={() => {
          setModalOpen(false);
          setModalRecord(null);
        }}
        onSubmit={handleSubmit}
      />

      {toast && (
        <div
          className={`fixed top-20 right-6 z-[60] px-4 py-2.5 rounded-lg shadow-lg text-sm text-white ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </Layout>
  );
}
