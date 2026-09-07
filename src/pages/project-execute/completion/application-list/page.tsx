import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { completionApplications, approvalNodes, approvalHistories, completionContracts } from '@/mocks/completionAcceptanceMocks';

const statusStyle: Record<string, string> = {
  '未提交': 'bg-slate-100 text-slate-600 border-slate-200',
  '审批中': 'bg-amber-50 text-amber-700 border-amber-200',
  '已确认': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '已驳回': 'bg-red-50 text-red-700 border-red-200',
};

const approvalStatusStyle: Record<string, string> = {
  '已通过': 'bg-emerald-50 text-emerald-700',
  '已驳回': 'bg-red-50 text-red-700',
  '审批中': 'bg-amber-50 text-amber-700',
  '待审批': 'bg-slate-100 text-slate-500',
};

export default function CompletionApplicationListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectNo = searchParams.get('projectNo') || '';
  const planNo = searchParams.get('planNo') || '';
  const projectName = searchParams.get('projectName') || '';

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Approval flow modal
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalModalAppId, setApprovalModalAppId] = useState('');
  const [nodes, setNodes] = useState(approvalNodes.map((n) => ({ ...n })));

  // Approval detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalAppId, setDetailModalAppId] = useState('');

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Confirm modals (交工确认/竣工确认)
  const [confirmAction, setConfirmAction] = useState<{ id: string; type: string } | null>(null);

  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const apps = useMemo(() => {
    return completionApplications
      .filter((a) => a.projectNo === projectNo)
      .sort((a, b) => b.changeDate.localeCompare(a.changeDate));
  }, [projectNo]);

  const projectContracts = useMemo(() => {
    return completionContracts.filter((c) => c.projectNo === projectNo);
  }, [projectNo]);

  const totalPages = Math.max(1, Math.ceil(apps.length / pageSize));
  const paginated = apps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const canEdit = (status: string) => status === '未提交' || status === '已驳回';
  const hasApprovalHistory = (id: string) => approvalHistories.some((h) => h.applicationId === id);

  const appHistories = useMemo(() => {
    return approvalHistories.filter((h) => h.applicationId === detailModalAppId).sort((a, b) => a.sequence - b.sequence);
  }, [detailModalAppId]);

  const handleDelete = () => {
    if (deleteConfirm) { showToast('删除成功'); setDeleteConfirm(null); }
  };

  const handleConfirm = () => {
    if (confirmAction) { showToast(`${confirmAction.type}确认成功`); setConfirmAction(null); }
  };

  const openApprovalModal = (appId: string) => {
    setApprovalModalAppId(appId);
    setNodes(approvalNodes.map((n) => ({ ...n })));
    setApprovalModalOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-4">
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>{toast}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">交竣工申请列表</h1>
            <p className="text-xs text-steel-400 mt-0.5">
              当前项目：<span className="text-steel-700 font-medium">{projectName}</span>
              <span className="mx-2">|</span>立项号：<span className="text-steel-700 font-mono">{projectNo}</span>
              <span className="mx-2">|</span>年度计划号：<span className="text-steel-700 font-mono">{planNo}</span>
            </p>
          </div>
          <button onClick={() => navigate('/project-execute/completion')} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回项目列表
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">交竣工申请记录</span>
              <span className="text-xs text-steel-400">共 {apps.length} 条</span>
            </div>
            <button
              onClick={() => navigate(`/project-execute/completion/application-form?projectNo=${projectNo}&planNo=${planNo}&projectName=${encodeURIComponent(projectName)}`)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1400px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">交/竣工编号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">年度计划号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500" style={{ minWidth: '200px' }}>项目名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500" style={{ minWidth: '160px' }}>异动原因</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500" style={{ minWidth: '160px' }}>异动说明</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">异动类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">异动日期</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">异动状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">文件数量</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ borderLeft: '1px solid #e8edf3', minWidth: '220px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((a, idx) => (
                  <tr key={a.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-primary-600 font-mono whitespace-nowrap">{a.changeNo}</td>
                    <td className="px-4 py-3 text-sm text-steel-600 font-mono whitespace-nowrap">{a.projectNo}</td>
                    <td className="px-4 py-3 text-sm text-steel-600 font-mono whitespace-nowrap">{a.planNo}</td>
                    <td className="px-4 py-3 text-sm text-steel-700">{a.projectName}</td>
                    <td className="px-4 py-3 text-sm text-steel-700">{a.changeReason}</td>
                    <td className="px-4 py-3 text-sm text-steel-600">{a.changeNote}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${a.changeType === '交工' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>{a.changeType}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{a.changeDate}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle[a.status] || ''}`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-steel-600 text-center whitespace-nowrap">{a.fileCount}</td>
                    <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                      <div className="flex items-center gap-1.5">
                        {/* 交工：仅呈核，审批通过后自动交工，无交工确认按钮 */}
                        {a.changeType === '交工' && a.status !== '已确认' && (
                          <button onClick={() => openApprovalModal(a.id)} className="px-2.5 py-1.5 text-xs text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap">呈核</button>
                        )}
                        {a.changeType === '交工' && a.status === '已确认' && (
                          <span className="px-2.5 py-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md whitespace-nowrap">已交工</span>
                        )}
                        {a.changeType === '竣工' && a.status !== '已确认' && (
                          <button onClick={() => setConfirmAction({ id: a.id, type: '竣工确认' })} className="px-2.5 py-1.5 text-xs text-violet-700 border border-violet-200 rounded-md hover:bg-violet-50 cursor-pointer whitespace-nowrap">竣工确认</button>
                        )}
                        {canEdit(a.status) && (
                          <button onClick={() => navigate(`/project-execute/completion/application-form?projectNo=${a.projectNo}&planNo=${a.planNo}&projectName=${encodeURIComponent(a.projectName)}&id=${a.id}`)} className="px-2.5 py-1.5 text-xs text-amber-700 border border-amber-200 rounded-md hover:bg-amber-50 cursor-pointer whitespace-nowrap">修改</button>
                        )}
                        {canEdit(a.status) && (
                          <button onClick={() => setDeleteConfirm(a.id)} className="px-2.5 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
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
        {apps.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>共 <span className="font-medium text-steel-700">{apps.length}</span> 条</span>
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

        {/* Contract List */}
        {projectContracts.length > 0 && (
          <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-steel-700 font-medium">合同清单</span>
                <span className="text-xs text-steel-400">共 {projectContracts.length} 条</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: '900px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '150px' }}>合同编号</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '280px' }}>合同名称</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同状态</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同类型</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">承包商编号</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">硬件状态</th>
                  </tr>
                </thead>
                <tbody>
                  {projectContracts.map((c) => (
                    <tr key={c.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/project-contract/document/form?mode=edit&contractId=${c.id}`)}
                          className="text-primary-600 font-mono hover:underline cursor-pointer"
                        >
                          {c.contractNo}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-700">{c.contractName}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          c.contractStatus === '已确认' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>{c.contractStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{c.contractType}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 font-mono whitespace-nowrap">{c.contractorNo}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                          c.hardwareStatus === '在线' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.hardwareStatus === '在线' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                          {c.hardwareStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <div>
                <h4 className="text-sm font-semibold text-steel-800">确认删除</h4>
                <p className="text-xs text-steel-500 mt-0.5">删除后数据不可恢复，确定继续？</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 cursor-pointer whitespace-nowrap">确认删除</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-96 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 flex-shrink-0"><i className="ri-checkbox-circle-line text-emerald-500 text-xl" /></div>
              <div>
                <h4 className="text-sm font-semibold text-steel-800">确认{confirmAction.type}？</h4>
                <p className="text-xs text-steel-500 mt-0.5">确认后将不可撤回，确定继续？</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleConfirm} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确认</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Flow Config Modal */}
      {approvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setApprovalModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[640px] max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-steel-800">自定义审批流配置</h3>
                <p className="text-xs text-steel-400 mt-0.5">配置审批节点及审批人，确认后发起审批</p>
              </div>
              <button onClick={() => setApprovalModalOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-xs text-steel-500 block mb-1">审批流名称</label>
                <div className="px-3 py-2 text-sm text-steel-700 bg-slate-50 rounded-md border border-steel-200">交竣工审批流程</div>
              </div>
              <div>
                <label className="text-xs text-steel-500 block mb-2">审批节点列表</label>
                <div className="space-y-3">
                  {nodes.map((node) => (
                    <div key={node.nodeId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-steel-100">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>{node.sequence}</div>
                      <div className="flex-1"><span className="text-sm font-medium text-steel-700">{node.nodeName}</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-steel-400">审批人:</span>
                        <select value={node.approver} onChange={(e) => { setNodes((prev) => prev.map((n) => n.nodeId === node.nodeId ? { ...n, approver: e.target.value } : n)); }} className="px-2 py-1.5 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
                          <option value="周建国">周建国</option><option value="郑文斌">郑文斌</option><option value="吴建国">吴建国</option><option value="孙志强">孙志强</option><option value="林晓东">林晓东</option>
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
    </Layout>
  );
}