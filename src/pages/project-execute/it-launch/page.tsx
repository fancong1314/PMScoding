import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';

interface ItLaunchApplication {
  id: string;
  projectNo: string;
  projectName: string;
  launchType: string;
  projectType: string;
  creator: string;
  createTime: string;
  plannedLaunchTime: string;
  approvalNode: string;
  status: string;
  launchNote?: string;
  estimatedStayHours?: number;
  impactScope?: string;
  riskAssessment?: string;
  attachments?: { name: string; uploaded: boolean }[];
  selectedContracts?: string[];
}

interface ApprovalNodeConfig {
  nodeId: string;
  nodeName: string;
  approver: string;
  approverDept: string;
  sequence: number;
}

interface ApprovalHistoryRecord {
  id: string;
  applicationId: string;
  sequence: number;
  nodeName: string;
  approver: string;
  status: string;
  opinion: string;
  time: string;
}

import { itLaunchApplications, defaultApprovalNodes, approvalHistories } from '@/mocks/itLaunchMocks';

const statusStyle: Record<string, string> = {
  '新建': 'bg-slate-100 text-slate-600 border-slate-200',
  '审批中': 'bg-amber-50 text-amber-700 border-amber-200',
  '已通过': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '已驳回': 'bg-red-50 text-red-700 border-red-200',
};

const approvalStatusStyle: Record<string, string> = {
  '已通过': 'bg-emerald-50 text-emerald-700',
  '已驳回': 'bg-red-50 text-red-700',
  '审批中': 'bg-amber-50 text-amber-700',
  '待审批': 'bg-slate-100 text-slate-500',
};

export default function ItLaunchListPage() {
  const navigate = useNavigate();
  const [searchProjectNo, setSearchProjectNo] = useState('');
  const [applications] = useState<ItLaunchApplication[]>(itLaunchApplications);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Approval flow config modal
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalModalAppId, setApprovalModalAppId] = useState('');
  const [editableNodes, setEditableNodes] = useState<ApprovalNodeConfig[]>([]);

  // Approval detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalAppId, setDetailModalAppId] = useState('');

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (searchProjectNo && !a.projectNo.toLowerCase().includes(searchProjectNo.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.createTime.localeCompare(a.createTime));
  }, [applications, searchProjectNo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const canEdit = (status: string) => status === '新建' || status === '已驳回';
  const hasApprovalHistory = (id: string) => approvalHistories.some((h) => h.applicationId === id);

  const handleReset = () => {
    setSearchProjectNo('');
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      showToast('删除成功');
      setDeleteConfirm(null);
    }
  };

  const openApprovalModal = (appId: string) => {
    setApprovalModalAppId(appId);
    setEditableNodes(defaultApprovalNodes.map((n) => ({ ...n })));
    setApprovalModalOpen(true);
  };

  const handleApprovalSubmit = () => {
    showToast('自定义审批流已发起');
    setApprovalModalOpen(false);
  };

  const openDetailModal = (appId: string) => {
    setDetailModalAppId(appId);
    setDetailModalOpen(true);
  };

  const appHistories = useMemo(() => {
    return approvalHistories.filter((h) => h.applicationId === detailModalAppId).sort((a, b) => a.sequence - b.sequence);
  }, [detailModalAppId]);

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-4">
        {/* Toast */}
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>
            {toast}
          </div>
        )}

        <div>
          <h1 className="text-lg font-semibold text-steel-900">信息化项目上线申请</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理信息化项目上线申请，支持自定义审批流配置</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap">立项号</label>
              <input
                type="text"
                value={searchProjectNo}
                onChange={(e) => setSearchProjectNo(e.target.value)}
                placeholder="请输入立项号模糊查询"
                className={inputCls}
                style={{ width: '240px' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setCurrentPage(1); }} className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
                查询
              </button>
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
                重置
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">上线申请列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
            </div>
            <button
              onClick={() => navigate('/project-execute/it-launch/form')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
              新增
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1400px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">立项号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '240px' }}>项目名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">上线类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">创建人</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">创建时间</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">计划上线时间</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '220px' }}>审批节点</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">流程状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: '200px', borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((record, idx) => (
                  <tr key={record.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-primary-600 font-mono whitespace-nowrap">{record.projectNo}</td>
                    <td className="px-4 py-3 text-sm text-steel-700">{record.projectName}</td>
                    <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${record.launchType === '整体上线' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>{record.launchType}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.creator}</td>
                    <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{record.createTime}</td>
                    <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{record.plannedLaunchTime}</td>
                    <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{record.approvalNode}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle[record.status] || ''}`}>{record.status}</span>
                    </td>
                    <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                      <div className="flex items-center gap-1.5">
                        {canEdit(record.status) && (
                          <button
                            onClick={() => navigate(`/project-execute/it-launch/form?id=${record.id}`)}
                            className="px-2.5 py-1.5 text-xs text-amber-700 border border-amber-200 rounded-md hover:bg-amber-50 cursor-pointer whitespace-nowrap"
                          >
                            修改
                          </button>
                        )}
                        {canEdit(record.status) && (
                          <button
                            onClick={() => setDeleteConfirm(record.id)}
                            className="px-2.5 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap"
                          >
                            删除
                          </button>
                        )}
                        <button
                          onClick={() => openApprovalModal(record.id)}
                          className="px-2.5 py-1.5 text-xs text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap"
                        >
                          数研院呈核
                        </button>
                        {hasApprovalHistory(record.id) && (
                          <button
                            onClick={() => openDetailModal(record.id)}
                            className="px-2.5 py-1.5 text-xs text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
                          >
                            审批详情
                          </button>
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
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
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

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-96 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 flex-shrink-0">
                <i className="ri-error-warning-line text-red-500 text-xl" />
              </div>
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
              <button onClick={() => setApprovalModalOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-xs text-steel-500 block mb-1">审批流名称</label>
                <div className="px-3 py-2 text-sm text-steel-700 bg-slate-50 rounded-md border border-steel-200">信息化项目上线审批流程</div>
              </div>
              <div>
                <label className="text-xs text-steel-500 block mb-2">审批节点列表</label>
                <div className="space-y-3">
                  {editableNodes.map((node) => (
                    <div key={node.nodeId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-steel-100">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>{node.sequence}</div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-steel-700">{node.nodeName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-steel-400">审批人:</span>
                        <select
                          value={node.approver}
                          onChange={(e) => {
                            const updated = editableNodes.map((n) => n.nodeId === node.nodeId ? { ...n, approver: e.target.value } : n);
                            setEditableNodes(updated);
                          }}
                          className="px-2 py-1.5 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
                        >
                          <option value="周明辉">周明辉 (智能制造事业部)</option>
                          <option value="吴建国">吴建国 (信息技术部)</option>
                          <option value="郑文斌">郑文斌 (数研院)</option>
                          <option value="孙志强">孙志强 (安全环保部)</option>
                          <option value="林晓东">林晓东 (项目管理办公室)</option>
                          <option value="陈永强">陈永强 (运营管理部)</option>
                          <option value="刘建华">刘建华 (炼钢事业部)</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-2">
              <button onClick={() => setApprovalModalOpen(false)} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleApprovalSubmit} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>确认发起</button>
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
              <div>
                <h3 className="text-base font-semibold text-steel-800">审批详情</h3>
                <p className="text-xs text-steel-400 mt-0.5">审批流程轨迹及结果</p>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-4 gap-3 bg-slate-50 rounded-lg p-3 border border-steel-100">
                <div><label className="text-xs text-steel-400 block mb-0.5">审批单号</label><span className="text-sm text-steel-700 font-mono">{detailModalAppId}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">业务类型</label><span className="text-sm text-steel-700">信息化项目上线申请</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">发起人</label><span className="text-sm text-steel-700">{applications.find((a) => a.id === detailModalAppId)?.creator || '-'}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">发起时间</label><span className="text-sm text-steel-700">{applications.find((a) => a.id === detailModalAppId)?.createTime || '-'}</span></div>
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
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-history-line text-xl text-steel-300" /></div>
                              <p className="text-sm text-steel-400">暂无审批记录</p>
                            </div>
                          </td>
                        </tr>
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