import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { projectProgressItems, type ProjectProgressItem } from '@/mocks/wbsDecompositionMocks';

const wbsStatusTag = (status: string) => {
  if (status === '已通过') return <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">已通过</span>;
  if (status === '审批中') return <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">审批中</span>;
  return <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">未拆解</span>;
};

export default function ProjectProgressListPage() {
  const navigate = useNavigate();
  const [approvalNo, setApprovalNo] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const projectTypes = ['', 'A质量品种', 'B安全环保', 'C节能降耗', 'D工艺装备', 'E智能制造', 'F信息化'];

  const filtered = useMemo(() => {
    return projectProgressItems.filter((p) => {
      if (approvalNo && !p.approvalNo.includes(approvalNo)) return false;
      if (projectName && !p.projectName.includes(projectName)) return false;
      if (projectType && p.projectType !== projectType) return false;
      if (projectManager && !p.projectManager.includes(projectManager)) return false;
      return true;
    });
  }, [approvalNo, projectName, projectType, projectManager]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const inputCls = 'px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 bg-white';

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">项目进度管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">已通过WBS拆解审批的项目进度管理</p>
        </div>

        {/* 搜索 */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="flex items-end flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-steel-500">立项号</label>
              <input type="text" value={approvalNo} onChange={(e) => { setApprovalNo(e.target.value); setCurrentPage(1); }} className={inputCls} placeholder="支持模糊匹配" style={{ width: 160 }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-steel-500">项目名称</label>
              <input type="text" value={projectName} onChange={(e) => { setProjectName(e.target.value); setCurrentPage(1); }} className={inputCls} placeholder="支持模糊匹配" style={{ width: 200 }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-steel-500">项目类型</label>
              <select value={projectType} onChange={(e) => { setProjectType(e.target.value); setCurrentPage(1); }} className={inputCls} style={{ width: 140 }}>
                {projectTypes.map((t) => <option key={t} value={t}>{t || '全部'}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-steel-500">项目经理</label>
              <input type="text" value={projectManager} onChange={(e) => { setProjectManager(e.target.value); setCurrentPage(1); }} className={inputCls} placeholder="支持模糊匹配" style={{ width: 140 }} />
            </div>
            <button onClick={() => setCurrentPage(1)} className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line text-xs" /></div>
              查询
            </button>
          </div>
        </div>

        {/* 列表 */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <span className="text-sm font-medium text-steel-700">项目列表</span>
            <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 1100 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 240 }}>项目名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目经理</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">任务总数</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 160 }}>计划完成进度</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 160 }}>实际完成进度</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">WBS状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-steel-50 z-10 text-center" style={{ minWidth: 240, borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item, idx) => {
                  const isApproved = item.wbsStatus === '已通过';
                  const baseQ = `?id=${item.id}&name=${encodeURIComponent(item.projectName)}&approvalNo=${encodeURIComponent(item.approvalNo)}`;
                  return (
                    <tr key={item.id} className="group hover:bg-slate-50" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 font-mono whitespace-nowrap">{item.approvalNo}</td>
                      <td className="px-4 py-3 text-sm text-steel-800 font-medium whitespace-nowrap">{item.projectName}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{item.projectType}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{item.projectManager}</td>
                      <td className="px-4 py-3 text-sm text-steel-700 font-mono whitespace-nowrap">{item.totalTasks}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-steel-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${item.planProgress}%` }} />
                          </div>
                          <span className="text-xs font-mono text-steel-600">{item.planProgress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-steel-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.actualProgress < item.planProgress ? 'bg-red-400' : 'bg-emerald-500'}`} style={{ width: `${item.actualProgress}%` }} />
                          </div>
                          <span className={`text-xs font-mono ${item.actualProgress < item.planProgress ? 'text-red-500' : 'text-emerald-600'}`}>{item.actualProgress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{wbsStatusTag(item.wbsStatus)}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10" style={{ borderLeft: '1px solid #e8edf3' }}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => navigate(`/project-execute/progress/weekly-monthly${baseQ}`)}
                            className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 cursor-pointer whitespace-nowrap"
                          >
                            <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5"><i className="ri-file-list-line text-xs" /></div>
                            周报月报
                          </button>
                          <button
                            onClick={() => isApproved ? navigate(`/project-execute/progress/report${baseQ}`) : null}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${isApproved ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer' : 'text-steel-400 bg-steel-100 cursor-not-allowed'}`}
                            title={!isApproved ? 'WBS未通过审批，不可汇报' : ''}
                          >
                            <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5"><i className="ri-bar-chart-line text-xs" /></div>
                            项目进度汇报
                          </button>
                          <button
                            onClick={() => navigate(`/project-execute/progress/gantt${baseQ}`)}
                            className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100 cursor-pointer whitespace-nowrap"
                          >
                            <div className="w-3 h-3 flex items-center justify-center inline-flex mr-0.5"><i className="ri-bar-chart-box-line text-xs" /></div>
                            进度图表
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-steel-100">
            <span className="text-sm text-steel-500">共 {filtered.length} 条，第 {currentPage}/{totalPages} 页</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"><i className="ri-arrow-left-s-line" /></button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer ${currentPage === p ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`} style={currentPage === p ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"><i className="ri-arrow-right-s-line" /></button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}