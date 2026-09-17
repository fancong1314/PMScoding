import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  allDisputes,
  getDisputeById,
  getApprovalRecordsByDisputeId,
  formatCurrency,
  statusOptions,
} from '@/mocks/qualityDisputeMocks';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';

export default function QualityDisputeListPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'maintenance' | 'project_review' | 'manufacturing_review'>('maintenance');
  const [searchContractNo, setSearchContractNo] = useState('');
  const [searchDisputeNo, setSearchDisputeNo] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState('');
  const [toast, setToast] = useState('');
  const [showApprovalResult, setShowApprovalResult] = useState(false);
  const [resultDisputeId, setResultDisputeId] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    showToast('删除成功');
  };

  const handleReset = () => {
    setSearchContractNo('');
    setSearchDisputeNo('');
  };

  const handleSearch = () => {
    showToast('查询完成');
  };

  const filtered = useMemo(() => {
    let data = allDisputes.filter((d) => d.stage === activeTab);
    if (searchContractNo.trim()) {
      data = data.filter((d) => d.contractNo.includes(searchContractNo.trim()));
    }
    if (searchDisputeNo.trim()) {
      data = data.filter((d) => d.disputeNo.includes(searchDisputeNo.trim()));
    }
    return data;
  }, [activeTab, searchContractNo, searchDisputeNo]);

  const tabCount = (tab: 'maintenance' | 'project_review' | 'manufacturing_review') => {
    let count = allDisputes.filter((d) => d.stage === tab).length;
    if (searchContractNo.trim()) {
      count = allDisputes.filter((d) => d.stage === tab && d.contractNo.includes(searchContractNo.trim())).length;
    }
    if (searchDisputeNo.trim()) {
      count = allDisputes.filter((d) => d.stage === tab && d.disputeNo.includes(searchDisputeNo.trim())).length;
    }
    return count;
  };

  const statusBadge = (s: string) => {
    const found = statusOptions.find((o) => o.value === s);
    return found ? `${found.color} px-2 py-0.5 rounded-full text-xs font-medium` : 'bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium';
  };

  const colDisputeNoW = 170;
  const colContractNoW = 140;
  const leftStickySecond = colDisputeNoW;
  const colActionsW = 200;

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">质量异议清单</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/project-contract')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
              返回
            </button>
          </div>
        </div>

        {/* Search Area */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">合同编号</span>
            <input type="text" value={searchContractNo} onChange={(e) => setSearchContractNo(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-44" placeholder="请输入合同编号" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">异议编号</span>
            <input type="text" value={searchDisputeNo} onChange={(e) => setSearchDisputeNo(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-44" placeholder="请输入异议编号" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={handleSearch} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>
              查询
            </button>
            <button onClick={handleReset} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
              重置
            </button>
          </div>
        </div>

        {/* TABs */}
        <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-full p-1 w-fit">
          <button onClick={() => setActiveTab('maintenance')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'maintenance' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            质量异议维护({tabCount('maintenance')})
          </button>
          <button onClick={() => setActiveTab('project_review')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'project_review' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            项目部审批({tabCount('project_review')})
          </button>
          <button onClick={() => setActiveTab('manufacturing_review')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'manufacturing_review' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            制造部审批({tabCount('manufacturing_review')})
          </button>
        </div>

        {/* Action Buttons for TAB1 */}
        {activeTab === 'maintenance' && (
          <div className="mb-3 flex items-center gap-2">
            <button onClick={() => navigate('/project-contract/quality-dispute/form?mode=add')} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
              新增
            </button>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 360px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colDisputeNoW}px` }}>异议单号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: `${colContractNoW}px` }}>合同编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>是否造成生产中断</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>发生日期</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>项目部审核状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>项目部当前审核人</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>制造部审核状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>制造部当前审核人</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{row.disputeNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: `${leftStickySecond}px`, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>{row.contractNo}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.causeProductionStop === '是' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{row.causeProductionStop}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.occurrenceDate}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.projectReviewStatus === '待审批' ? 'bg-amber-50 text-amber-700' : row.projectReviewStatus === '已通过' ? 'bg-emerald-50 text-emerald-700' : row.projectReviewStatus === '已驳回' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{row.projectReviewStatus}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.projectReviewer}</td>
                  <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.manufacturingReviewStatus === '待审批' ? 'bg-amber-50 text-amber-700' : row.manufacturingReviewStatus === '已通过' ? 'bg-emerald-50 text-emerald-700' : row.manufacturingReviewStatus === '已驳回' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{row.manufacturingReviewStatus}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{row.manufacturingReviewer}</td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      {activeTab === 'maintenance' && (
                        <>
                          {row.status === '新建' && (
                            <>
                              <button onClick={() => navigate(`/project-contract/quality-dispute/form?mode=edit&id=${row.id}`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">修改</button>
                              <button onClick={() => { setDeleteTargetId(row.id); setShowDeleteConfirm(true); }} className="px-2.5 py-1 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                            </>
                          )}
                        </>
                      )}
                      {activeTab === 'project_review' && (
                        <>
                          <button onClick={() => navigate(`/project-contract/quality-dispute/project-review?id=${row.id}`)} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
                        </>
                      )}
                      {activeTab === 'manufacturing_review' && (
                        <>
                          <button onClick={() => navigate(`/project-contract/quality-dispute/manufacturing-review?id=${row.id}`)} className="px-2.5 py-1 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
                        </>
                      )}
                        <button onClick={() => navigate(`/project-contract/quality-dispute/detail?id=${row.id}`)} className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">查看详情</button>
                      <button onClick={() => { setResultDisputeId(row.id); setShowApprovalResult(true); }} className="px-2.5 py-1 text-xs text-sky-600 border border-sky-200 rounded-md hover:bg-sky-50 cursor-pointer whitespace-nowrap">审批详情</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-sm text-slate-500">共 {filtered.length} 条记录</div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-[420px] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100">
                <i className="ri-error-warning-line text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">确认删除</h3>
                <p className="text-sm text-slate-500">删除后数据不可恢复</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer whitespace-nowrap">确认删除</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Result Modal */}
      {showApprovalResult && (() => {
        const dispute = getDisputeById(resultDisputeId);
        const records = getApprovalRecordsByDisputeId(resultDisputeId);
        if (!dispute) return null;
        return (
          <ApprovalResultModal
            onClose={() => setShowApprovalResult(false)}
            title="审批流详情"
            processName={`质量异议审批 - ${dispute.disputeNo}`}
            status={dispute.status === '已通过' || dispute.status === '已驳回' ? '已完成' : '进行中'}
            nodes={[
              { id: 'n1', seq: 1, name: '质量异议维护', approver: dispute.creator, status: '已通过', action: '提交', operateTime: dispute.createTime.split(' ')[0], opinion: '提交质量异议申请' },
              { id: 'n2', seq: 2, name: '项目部审批', approver: dispute.projectReviewer, status: dispute.projectReviewStatus === '已通过' ? '已通过' : dispute.projectReviewStatus === '已驳回' ? '已驳回' : '审核中', action: dispute.projectReviewStatus === '已通过' ? '通过' : '', operateTime: dispute.projectReviewStatus === '已通过' ? '2026-03-06' : '', opinion: dispute.issueAnalysis || '' },
              { id: 'n3', seq: 3, name: '制造部审批', approver: dispute.manufacturingReviewer, status: dispute.manufacturingReviewStatus === '已通过' ? '已通过' : dispute.manufacturingReviewStatus === '已驳回' ? '已驳回' : '审核中', action: dispute.manufacturingReviewStatus === '已通过' ? '通过' : dispute.manufacturingReviewStatus === '已驳回' ? '驳回' : '', operateTime: dispute.manufacturingReviewStatus === '已通过' ? '2026-03-14' : '', opinion: dispute.approvalOpinion || '' },
            ]}
            logs={records.map((r) => ({ time: `${r.operateDate} ${r.operateTime}`, operator: r.operator, action: r.operation, opinion: r.opinion }))}
          />
        );
      })()}
    </Layout>
  );
}