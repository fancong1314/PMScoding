import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { itAcceptanceApplications, approvalHistories } from '@/mocks/itAcceptanceMocks';

const statusStyle: Record<string, string> = {
  '新建': 'bg-slate-100 text-slate-600 border-slate-200',
  '审批中': 'bg-amber-50 text-amber-700 border-amber-200',
  '内部审核通过': 'bg-sky-50 text-sky-700 border-sky-200',
  '已驳回': 'bg-red-50 text-red-700 border-red-200',
  '已确认': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const approvalStatusStyle: Record<string, string> = {
  '已通过': 'bg-emerald-50 text-emerald-700',
  '已驳回': 'bg-red-50 text-red-700',
  '审批中': 'bg-amber-50 text-amber-700',
  '待审批': 'bg-slate-100 text-slate-500',
};

export default function ItAcceptanceListPage() {
  const navigate = useNavigate();

  const [searchProjectNo, setSearchProjectNo] = useState('');
  const [onlyConfirmed, setOnlyConfirmed] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Approval detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalAppId, setDetailModalAppId] = useState('');

  // Approval flow modal
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalNodes, setApprovalNodes] = useState([
    { nodeId: 'n1', nodeName: '项目部审核', approver: '项目负责人', approverDept: '项目部', sequence: 1 },
    { nodeId: 'n2', nodeName: '信息技术部审批', approver: '吴建国', approverDept: '信息技术部', sequence: 2 },
    { nodeId: 'n3', nodeName: '数研院呈核', approver: '郑文斌', approverDept: '数研院', sequence: 3 },
    { nodeId: 'n4', nodeName: '安全环保部会签', approver: '孙志强', approverDept: '安全环保部', sequence: 4 },
    { nodeId: 'n5', nodeName: '事业部确认', approver: '林晓东', approverDept: '项目管理办公室', sequence: 5 },
  ]);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = useMemo(() => {
    return itAcceptanceApplications
      .filter((a) => {
        if (searchProjectNo && !a.projectNo.toLowerCase().includes(searchProjectNo.toLowerCase())) return false;
        if (onlyConfirmed && a.status !== '已确认') return false;
        return true;
      })
      .sort((a, b) => b.createTime.localeCompare(a.createTime));
  }, [searchProjectNo, onlyConfirmed]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const canEdit = (status: string) => status === '新建' || status === '已驳回';
  const hasHistory = (id: string) => approvalHistories.some((h) => h.applicationId === id);

  const appHistories = useMemo(() => {
    return approvalHistories.filter((h) => h.applicationId === detailModalAppId).sort((a, b) => a.sequence - b.sequence);
  }, [detailModalAppId]);

  const handleReset = () => { setSearchProjectNo(''); setOnlyConfirmed(false); setCurrentPage(1); };
  const handleDelete = () => { if (deleteConfirm) { showToast('删除成功'); setDeleteConfirm(null); } };

  const inputCls = 'px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-4">
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>{toast}
          </div>
        )}

        <div>
          <h1 className="text-lg font-semibold text-steel-900">信息化项目验收申请</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理信息化项目验收申请，支持审批流配置和数研院确认</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap">立项号</label>
              <input type="text" value={searchProjectNo} onChange={(e) => setSearchProjectNo(e.target.value)} placeholder="模糊查询" className={inputCls} style={{ width: '200px' }} />
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={onlyConfirmed} onChange={(e) => setOnlyConfirmed(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#059669' }} />
              <span className="text-xs text-steel-500 whitespace-nowrap">已确认</span>
            </label>
            <div className="flex items-center gap-2">
              <button onClick={() => { setCurrentPage(1); }} className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ backgroundColor: '#10b981' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>查询
              </button>
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>重置
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/project-execute/it-acceptance/form')} className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>验收申请
          </button>
          <button onClick={() => navigate('/project-execute/it-acceptance/research-confirm')} className="flex items-center gap-1.5 px-4 py-2 text-sm text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-shield-check-line" /></div>数研院确认
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">验收申请列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1200px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '220px' }}>项目名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">验收类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">创建人</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">创建时间</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '180px' }}>审批节点</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">流程状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ borderLeft: '1px solid #e8edf3', minWidth: '200px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((a, idx) => (
                  <tr key={a.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-primary-600 font-mono whitespace-nowrap">{a.projectNo}</td>
                    <td className="px-4 py-3 text-sm text-steel-700">{a.projectName}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${a.acceptanceType === '整体验收' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>{a.acceptanceType}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{a.creator}</td>
                    <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{a.createTime}</td>
                    <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{a.approvalNode}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle[a.status] || ''}`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                      <div className="flex items-center gap-1.5">
                        {canEdit(a.status) && (
                          <button onClick={() => navigate(`/project-execute/it-acceptance/form?id=${a.id}`)} className="px-2.5 py-1.5 text-xs text-amber-700 border border-amber-200 rounded-md hover:bg-amber-50 cursor-pointer whitespace-nowrap">修改</button>
                        )}
                        {canEdit(a.status) && (
                          <button onClick={() => setDeleteConfirm(a.id)} className="px-2.5 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                        )}
                        <button onClick={() => { setApprovalModalOpen(true); }} className="px-2.5 py-1.5 text-xs text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap">数研院呈核</button>
                        {hasHistory(a.id) && (
                          <button onClick={() => { setDetailModalAppId(a.id); setDetailModalOpen(true); }} className="px-2.5 py-1.5 text-xs text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap">审批详情</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{filtered.length}</span> 条</span>
              <span>第 <span className="font-medium text-steel-700">{currentPage}</span>/{totalPages} 页</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none">
                <option value={10}>10条/页</option><option value={20}>20条/页</option><option value={50}>50条/页</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">首页</button>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-left-s-line" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${currentPage === p ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`} style={currentPage === p ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-right-s-line" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">末页</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-96 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 flex-shrink-0"><i className="ri-error-warning-line text-red-500 text-xl" /></div>
              <div><h4 className="text-sm font-semibold text-steel-800">确认删除</h4><p className="text-xs text-steel-500 mt-0.5">删除后数据不可恢复，确定继续？</p></div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 cursor-pointer whitespace-nowrap">确认删除</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Flow Modal */}
      {approvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setApprovalModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[640px] max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <div><h3 className="text-base font-semibold text-steel-800">自定义审批流配置</h3><p className="text-xs text-steel-400 mt-0.5">配置审批节点及审批人，确认后发起审批</p></div>
              <button onClick={() => setApprovalModalOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div><label className="text-xs text-steel-500 block mb-1">审批流名称</label><div className="px-3 py-2 text-sm text-steel-700 bg-slate-50 rounded-md border border-steel-200">信息化项目验收审批流程</div></div>
              <div><label className="text-xs text-steel-500 block mb-2">审批节点列表</label>
                <div className="space-y-3">
                  {approvalNodes.map((n) => (
                    <div key={n.nodeId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-steel-100">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>{n.sequence}</div>
                      <div className="flex-1"><span className="text-sm font-medium text-steel-700">{n.nodeName}</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-steel-400">审批人:</span>
                        <select value={n.approver} onChange={(e) => setApprovalNodes((prev) => prev.map((x) => x.nodeId === n.nodeId ? { ...x, approver: e.target.value } : x))} className="px-2 py-1.5 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
                          <option value="项目负责人">项目负责人</option><option value="吴建国">吴建国</option><option value="郑文斌">郑文斌</option><option value="孙志强">孙志强</option><option value="林晓东">林晓东</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-2">
              <button onClick={() => setApprovalModalOpen(false)} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={() => { showToast('审批流已发起'); setApprovalModalOpen(false); }} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>确认发起</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Detail Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[720px] max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <div><h3 className="text-base font-semibold text-steel-800">审批详情</h3><p className="text-xs text-steel-400 mt-0.5">审批流程轨迹及结果</p></div>
              <button onClick={() => setDetailModalOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-4 gap-3 bg-slate-50 rounded-lg p-3 border border-steel-100">
                <div><label className="text-xs text-steel-400 block mb-0.5">审批单号</label><span className="text-sm text-steel-700 font-mono">{detailModalAppId}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">业务类型</label><span className="text-sm text-steel-700">信息化项目验收申请</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">发起人</label><span className="text-sm text-steel-700">{itAcceptanceApplications.find((a) => a.id === detailModalAppId)?.creator || '-'}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">发起时间</label><span className="text-sm text-steel-700">{itAcceptanceApplications.find((a) => a.id === detailModalAppId)?.createTime || '-'}</span></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-steel-700 mb-2">审批轨迹</h4>
                <div className="border border-steel-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">序号</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">节点名称</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">审批人</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">审批状态</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500" style={{ minWidth: '200px' }}>审批意见</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">审批时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appHistories.length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-12 text-center"><div className="flex flex-col items-center gap-2"><div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-history-line text-xl text-steel-300" /></div><p className="text-sm text-steel-400">暂无审批记录</p></div></td></tr>
                      ) : (
                        appHistories.map((h) => (
                          <tr key={h.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-2.5 text-sm text-steel-500 whitespace-nowrap">{h.sequence}</td>
                            <td className="px-3 py-2.5 text-sm text-steel-700 whitespace-nowrap">{h.nodeName}</td>
                            <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{h.approver}</td>
                            <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${approvalStatusStyle[h.status] || ''}`}>{h.status}</span>
                            </td>
                            <td className="px-3 py-2.5 text-sm text-steel-700">{h.opinion}</td>
                            <td className="px-3 py-2.5 text-sm text-steel-500 whitespace-nowrap">{h.time}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-steel-200 flex justify-end">
              <button onClick={() => setDetailModalOpen(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}