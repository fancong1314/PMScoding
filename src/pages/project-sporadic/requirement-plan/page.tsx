import { useMemo, useState } from 'react';
import Layout from '@/components/feature/Layout';
import {
  sporadicProjectTypes,
  sporadicRequirementPlanRecords,
  sporadicRequirementPlanStatusMap,
  sporadicRequirementPlanStatusOptions,
  sporadicSubmitUnits,
  type SporadicRequirementPlanStatus,
} from '@/mocks/sporadicProjectMocks';
import ListPagination from '../components/ListPagination';

export default function SporadicRequirementPlanPage() {
  const [filterNo, setFilterNo] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState<SporadicRequirementPlanStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const matched = useMemo(() => {
    return sporadicRequirementPlanRecords.filter((r) => {
      if (filterNo && !r.planNo.includes(filterNo)) return false;
      if (filterName && !r.planName.includes(filterName)) return false;
      if (filterUnit && r.submitUnit !== filterUnit) return false;
      if (filterType && r.projectType !== filterType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      return true;
    });
  }, [filterNo, filterName, filterUnit, filterType, filterStatus]);

  const emptyHint = matched.length === 0;
  const filtered = emptyHint ? sporadicRequirementPlanRecords : matched;
  const pageOffset = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageOffset, pageOffset + pageSize);

  const handleReset = () => {
    setFilterNo('');
    setFilterName('');
    setFilterUnit('');
    setFilterType('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  const inputCls =
    'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';
  const thCls = 'px-3 py-2.5 text-xs font-semibold text-steel-500 text-left whitespace-nowrap';
  const tdCls = 'px-3 py-2.5 text-sm text-steel-700';

  return (
    <Layout>
      <div className="space-y-3">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">需求计划管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理零星工程施工需求计划提报与审批（当前仅支持列表查看）</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">计划编号</label>
              <input value={filterNo} onChange={(e) => setFilterNo(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">计划名称</label>
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="模糊匹配" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">提报单位</label>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option value="">全部单位</option>
                {sporadicSubmitUnits.map((u) => <option key={u} value={u}>{u}</option>)}
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
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">审批状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SporadicRequirementPlanStatus | '')}
                className={inputCls + ' cursor-pointer'}
              >
                {sporadicRequirementPlanStatusOptions.map((o) => (
                  <option key={o.value || 'all'} value={o.value}>{o.label}</option>
                ))}
              </select>
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
            未匹配到筛选结果，已回退展示全部需求计划演示数据
          </div>
        )}

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-steel-200" style={{ backgroundColor: '#f8fafc' }}>
                  <th className={`${thCls} w-12 text-center`}>序号</th>
                  <th className={thCls}>计划编号</th>
                  <th className={thCls}>计划名称</th>
                  <th className={thCls}>项目类型</th>
                  <th className={thCls}>提报单位</th>
                  <th className={thCls}>提报人</th>
                  <th className={thCls}>提报时间</th>
                  <th className={`${thCls} text-right`}>计划金额(万元)</th>
                  <th className={thCls}>计划开-完工时间</th>
                  <th className={`${thCls} text-center`}>审批状态</th>
                  <th className={thCls}>备注</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, idx) => {
                  const st = sporadicRequirementPlanStatusMap[r.status];
                  return (
                    <tr key={r.id} className="border-b border-steel-100 hover:bg-slate-50/80 transition-colors">
                      <td className={`${tdCls} text-center text-steel-400 text-xs`}>{pageOffset + idx + 1}</td>
                      <td className={`${tdCls} whitespace-nowrap font-mono text-xs`}>{r.planNo}</td>
                      <td className={`${tdCls} font-medium max-w-[260px]`}>
                        <div className="truncate" title={r.planName}>{r.planName}</div>
                      </td>
                      <td className={`${tdCls} whitespace-nowrap`}>
                        <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-slate-100 text-steel-600">{r.projectType}</span>
                      </td>
                      <td className={`${tdCls} whitespace-nowrap`}>{r.submitUnit}</td>
                      <td className={`${tdCls} whitespace-nowrap`}>{r.submitter}</td>
                      <td className={`${tdCls} whitespace-nowrap text-xs text-steel-500`}>{r.submitTime}</td>
                      <td className={`${tdCls} text-right font-mono whitespace-nowrap`}>{r.planAmount.toFixed(2)}</td>
                      <td className={`${tdCls} whitespace-nowrap text-xs text-steel-600`}>
                        {r.startDate}<span className="text-steel-300 mx-1">至</span>{r.endDate}
                      </td>
                      <td className={`${tdCls} text-center whitespace-nowrap`}>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className={`${tdCls} max-w-[200px]`}>
                        <div className="truncate text-steel-500" title={r.remark}>{r.remark || '—'}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
