import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { approvalRecords, getApprovalRecords, setStoredApprovalRecords, updateApprovalRecord } from '@/mocks/approvalMocks';
import { projectPlans } from '@/mocks/projectPlans';
import { availableApprovers } from '@/mocks/approvalMocks';
import type { ApprovalRecord } from '@/mocks/approvalMocks';
import type { ProjectPlan } from '@/mocks/projectPlans';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  approving: { label: '审批中', color: '#d97706', bg: '#fffbeb', dot: '#f59e0b' },
  approved: { label: '已通过', color: '#16a34a', bg: '#f0fdf4', dot: '#22c55e' },
  rejected: { label: '已驳回', color: '#dc2626', bg: '#fef2f2', dot: '#ef4444' },
  withdrawn: { label: '已撤回', color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' },
};

export default function ApprovalProcessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id') || '';

  const [records, setRecords] = useState<ApprovalRecord[]>(getApprovalRecords());
  const [approvalRecord, setApprovalRecord] = useState<ApprovalRecord | null>(null);
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [opinion, setOpinion] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddSignModal, setShowAddSignModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [transferPerson, setTransferPerson] = useState('');
  const [addSignPerson, setAddSignPerson] = useState('');
  const [addSignPosition, setAddSignPosition] = useState<'before' | 'after'>('after');
  const [transferSearch, setTransferSearch] = useState('');
  const [addSignSearch, setAddSignSearch] = useState('');
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [expandedOpinions, setExpandedOpinions] = useState<Set<string>>(new Set());

  const currentRecordIndex = records.findIndex((r) => r.id === appId);
  const prevRecord = currentRecordIndex > 0 ? records[currentRecordIndex - 1] : null;
  const nextRecord = currentRecordIndex < records.length - 1 ? records[currentRecordIndex + 1] : null;

  useEffect(() => {
    const record = records.find((r) => r.id === appId) || null;
    setApprovalRecord(record);
    if (record) {
      const p = projectPlans.find((pp) => pp.id === record.planId) || null;
      setPlan(p);
    }
  }, [appId, records]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePass = () => {
    if (!approvalRecord) return;
    const updated = { ...approvalRecord };
    const currentIdx = updated.nodes.findIndex((n) => n.status === 'current');
    if (currentIdx >= 0) {
      updated.nodes[currentIdx].status = 'completed';
      updated.nodes[currentIdx].result = '已通过';
      updated.nodes[currentIdx].opinion = opinion;
      updated.nodes[currentIdx].time = new Date().toISOString();
      updated.nodes[currentIdx].approvers = updated.nodes[currentIdx].approvers.map((a) => ({
        ...a,
        result: 'approved' as const,
        opinion,
        time: new Date().toISOString(),
      }));

      const nextIdx = currentIdx + 1;
      if (nextIdx < updated.nodes.length) {
        updated.nodes[nextIdx].status = 'current';
        updated.currentNode = updated.nodes[nextIdx].nodeName;
        updated.currentNodeType = updated.nodes[nextIdx].nodeType;
      } else {
        updated.status = 'approved';
        updated.currentNode = '';
      }
    }
    updateApprovalRecord(updated);
    setRecords(getApprovalRecords());
    setApprovalRecord(updated);
    setOpinion('');
    setShowConfirmPass(false);
    showToast('审批通过，已流转至下一节点');
  };

  const handleReject = () => {
    if (!approvalRecord || !rejectReason.trim()) return;
    const updated = { ...approvalRecord, status: 'rejected' as const };
    const currentIdx = updated.nodes.findIndex((n) => n.status === 'current');
    if (currentIdx >= 0) {
      updated.nodes[currentIdx].status = 'completed';
      updated.nodes[currentIdx].result = '已驳回';
      updated.nodes[currentIdx].opinion = rejectReason;
      updated.nodes[currentIdx].time = new Date().toISOString();
      updated.nodes[currentIdx].approvers = updated.nodes[currentIdx].approvers.map((a) => ({
        ...a,
        result: 'rejected' as const,
        opinion: rejectReason,
        time: new Date().toISOString(),
      }));
      updated.currentNode = '';
    }
    updateApprovalRecord(updated);
    setRecords(getApprovalRecords());
    setApprovalRecord(updated);
    setShowRejectModal(false);
    setRejectReason('');
    showToast('已驳回');
  };

  const handleTransfer = () => {
    if (!approvalRecord || !transferPerson) return;
    const updated = { ...approvalRecord };
    const currentIdx = updated.nodes.findIndex((n) => n.status === 'current');
    if (currentIdx >= 0) {
      updated.nodes[currentIdx].status = 'transferred';
      updated.nodes[currentIdx].transferTo = transferPerson;
    }
    updateApprovalRecord(updated);
    setRecords(getApprovalRecords());
    setApprovalRecord(updated);
    setShowTransferModal(false);
    setTransferPerson('');
    showToast(`已转签至 ${transferPerson}`);
  };

  const handleAddSign = () => {
    if (!approvalRecord || !addSignPerson) return;
    const updated = { ...approvalRecord };
    const currentIdx = updated.nodes.findIndex((n) => n.status === 'current');
    if (currentIdx >= 0) {
      updated.nodes[currentIdx].status = 'completed';
      updated.nodes[currentIdx].result = '已通过';
      updated.nodes[currentIdx].opinion = opinion;
      updated.nodes[currentIdx].time = new Date().toISOString();
      const newNode = {
        nodeId: `added_${Date.now()}`,
        nodeName: '加签审批',
        nodeType: 'approval' as const,
        approvers: [{ name: addSignPerson, department: '' }],
        status: 'current' as const,
        addedBy: '当前审批人',
        addPosition: addSignPosition,
      };
      if (addSignPosition === 'after') {
        updated.nodes.splice(currentIdx + 1, 0, newNode);
      } else {
        updated.nodes.splice(currentIdx, 0, newNode);
        updated.nodes[currentIdx + 1].status = 'pending';
      }
      updated.currentNode = newNode.nodeName;
      updated.currentNodeType = newNode.nodeType;
    }
    updateApprovalRecord(updated);
    setRecords(getApprovalRecords());
    setApprovalRecord(updated);
    setShowAddSignModal(false);
    setAddSignPerson('');
    setOpinion('');
    showToast(`已加签至 ${addSignPerson}`);
  };

  const handlePrev = () => {
    if (prevRecord) navigate(`/project-plan/approval-process?id=${prevRecord.id}`);
  };

  const handleNext = () => {
    if (nextRecord) navigate(`/project-plan/approval-process?id=${nextRecord.id}`);
  };

  const toggleOpinion = (nodeId: string) => {
    setExpandedOpinions((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId); else next.add(nodeId);
      return next;
    });
  };

  const filteredPerson = (search: string) =>
    availableApprovers.filter((p) => !search || p.name.includes(search) || p.department.includes(search));

  if (!approvalRecord || !plan) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-slate-100">
              <i className="ri-file-search-line text-2xl text-slate-300" />
            </div>
            <p className="mt-4 text-slate-500">未找到审批记录</p>
            <button onClick={() => navigate('/project-plan/declaration')} className="mt-3 text-sm text-primary-500 hover:underline cursor-pointer">返回列表</button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusInfo = STATUS_CONFIG[approvalRecord.status] ?? STATUS_CONFIG.approving;
  const isApprover = approvalRecord.status === 'approving';
  const currNode = approvalRecord.nodes.find((n) => n.status === 'current');

  return (
    <Layout>
      <div className="space-y-4">
        {/* Title & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/project-plan/declaration')} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer">
              <i className="ri-arrow-left-line" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-800 flex items-center gap-3">
                审批处理
                <span className="px-2.5 py-0.5 text-xs rounded-full bg-primary-50 text-primary-600">计划申报</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} disabled={!prevRecord} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap">
              <i className="ri-arrow-left-s-line mr-1" />上一条
            </button>
            <span className="text-xs text-slate-400">{currentRecordIndex + 1} / {records.length}</span>
            <button onClick={handleNext} disabled={!nextRecord} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap">
              下一条<i className="ri-arrow-right-s-line ml-1" />
            </button>
          </div>
        </div>

        {/* Approval Summary */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-6 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">审批单号</p>
              <p className="text-sm font-semibold text-slate-800">{approvalRecord.appNo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">发起人</p>
              <p className="text-sm font-semibold text-slate-800">{approvalRecord.applicant} <span className="text-xs text-slate-400 font-normal">{approvalRecord.applicantDept}</span></p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">发起时间</p>
              <p className="text-sm font-semibold text-slate-800">{approvalRecord.applyTime}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">当前节点</p>
              <p className="text-sm font-semibold text-slate-800">{currNode ? currNode.nodeName : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">节点类型</p>
              {currNode ? (
                <span className="px-2 py-0.5 text-xs rounded bg-primary-50 text-primary-600">{currNode.nodeType === 'approval' ? '审批' : currNode.nodeType === 'countersign' ? '会签' : currNode.nodeType === 'or_sign' ? '或签' : '抄送'}</span>
              ) : <span className="text-sm text-slate-400">—</span>}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">当前状态</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusInfo.dot }} />
                <span className="text-sm font-semibold" style={{ color: statusInfo.color }}>{statusInfo.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Two Columns */}
        <div className="flex gap-4">
          {/* Left: Business Info */}
          <div className="flex-[1.2] min-w-0">
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-primary-500" />
                  业务信息
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Group 1: Basic Info */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 mb-2 pb-1 border-b border-slate-100">项目基本信息</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-50">
                      <span className="text-sm text-slate-500">年度计划名称</span>
                      <span className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{plan.planName}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-50">
                      <span className="text-sm text-slate-500">项目单位</span>
                      <span className="text-sm text-slate-700">{plan.businessDivision}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-50">
                      <span className="text-sm text-slate-500">项目类别</span>
                      <span className="text-sm text-slate-700">{plan.projectCategory}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-50">
                      <span className="text-sm text-slate-500">项目负责人</span>
                      <span className="text-sm text-slate-700">{plan.projectManager}</span>
                    </div>
                  </div>
                </div>
                {/* Group 2: Finance */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 mb-2 pb-1 border-b border-slate-100">金额信息</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-50">
                      <span className="text-sm text-slate-500">投资总估算(万元)</span>
                      <input type="text" defaultValue={plan.budgetAmount.toFixed(2)} className="w-28 px-2 py-0.5 text-sm border border-slate-200 rounded text-right font-medium text-slate-800 bg-white" />
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-50">
                      <span className="text-sm text-slate-500">效益(万元)</span>
                      <input type="text" defaultValue={plan.benefit.toFixed(2)} className="w-28 px-2 py-0.5 text-sm border border-slate-200 rounded text-right font-medium text-slate-800 bg-white" />
                    </div>
                  </div>
                </div>
                {/* Group 3: Dates */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 mb-2 pb-1 border-b border-slate-100">日期信息</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-50">
                      <span className="text-sm text-slate-500">计划开工时间</span>
                      <input type="text" defaultValue={plan.startDate} className="w-28 px-2 py-0.5 text-sm border border-slate-200 rounded text-right text-slate-700 bg-white" />
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-50">
                      <span className="text-sm text-slate-500">完工时间</span>
                      <input type="text" defaultValue={plan.endDate} className="w-28 px-2 py-0.5 text-sm border border-slate-200 rounded text-right text-slate-700 bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Approval Flow */}
          <div className="flex-1 min-w-0">
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-amber-400" />
                  审批流程
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-0">
                  {/* Start */}
                  <div className="flex items-start gap-2 pb-2">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <i className="ri-user-line text-white" style={{ fontSize: '10px' }} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-700">{approvalRecord.applicant}</span>
                      <span className="text-xs text-slate-400 ml-1">发起</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col items-center flex-shrink-0" style={{ width: '28px' }}>
                      <div className="w-0.5 h-5 bg-slate-200" />
                    </div>
                  </div>

                  {/* Nodes */}
                  {approvalRecord.nodes.map((node, idx) => {
                    const isCompleted = node.status === 'completed';
                    const isCurrent = node.status === 'current';
                    const isCc = node.nodeType === 'cc';
                    const hasExpanded = expandedOpinions.has(node.nodeId);

                    return (
                      <div key={node.nodeId}>
                        <div className={`flex items-start gap-2 py-1.5 px-2 rounded-md ${isCurrent ? 'bg-amber-50 border border-amber-200' : isCc ? 'bg-blue-50/50' : ''}`}>
                          {isCompleted ? (
                            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <i className="ri-check-line text-white" style={{ fontSize: '10px' }} />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{idx + 1}</span>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-slate-300 text-xs">{idx + 1}</span>
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-semibold text-slate-700">{node.nodeName}</span>
                              <span className="text-xs px-1 rounded" style={{ fontSize: '9px', backgroundColor: isCompleted ? '#dcfce7' : isCurrent ? '#fef3c7' : '#f3f4f6', color: isCompleted ? '#16a34a' : isCurrent ? '#d97706' : '#9ca3af' }}>
                                {isCompleted ? '已通过' : isCurrent ? '审批中' : '待审批'}
                              </span>
                              {isCc && <span className="text-xs text-blue-500" style={{ fontSize: '9px' }}>抄送</span>}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              {node.approvers.map((a, ai) => (
                                <span key={ai} className="text-xs text-slate-500">{a.name}{ai < node.approvers.length - 1 ? '、' : ''}</span>
                              ))}
                            </div>
                            {node.opinion && (
                              <div>
                                <button onClick={() => toggleOpinion(node.nodeId)} className="text-xs text-primary-500 hover:underline cursor-pointer mt-0.5">
                                  审批意见 {hasExpanded ? '▲' : '▼'}
                                </button>
                                {hasExpanded && (
                                  <p className="text-xs text-slate-500 mt-0.5 p-1.5 rounded bg-slate-50">{node.opinion}</p>
                                )}
                              </div>
                            )}
                            {node.time && <p className="text-xs text-slate-400 mt-0.5">{node.time}</p>}
                            {node.status === 'transferred' && node.transferTo && (
                              <p className="text-xs text-blue-600 mt-0.5">已转签至 {node.transferTo}</p>
                            )}
                          </div>
                        </div>
                        {idx < approvalRecord.nodes.length - 1 && !isCc && (
                          <div className="flex items-start gap-2">
                            <div className="flex flex-col items-center flex-shrink-0" style={{ width: '28px' }}>
                              <div className="w-0.5 h-4 bg-slate-200" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* End if approved */}
                  {approvalRecord.status === 'approved' && (
                    <>
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col items-center flex-shrink-0" style={{ width: '28px' }}>
                          <div className="w-0.5 h-4 bg-slate-200" />
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-400 flex items-center justify-center flex-shrink-0">
                          <i className="ri-check-line text-white" style={{ fontSize: '10px' }} />
                        </div>
                        <span className="text-xs text-slate-500 mt-1">审批完成</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Operations (only for current approver in approving status) */}
        {isApprover && (
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  placeholder="请输入审批意见（选填）"
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <button
                    onClick={() => setShowConfirmPass(true)}
                    className="px-5 py-2 text-sm text-white rounded-lg hover:opacity-90 cursor-pointer whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                  >
                    <i className="ri-check-line mr-1" />
                    通过
                  </button>
                  {showConfirmPass && (
                    <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg border border-slate-200 shadow-lg p-3 z-20 w-48">
                      <p className="text-xs text-slate-600 mb-2">确认通过该审批？</p>
                      <div className="flex items-center gap-2">
                        <button onClick={handlePass} className="flex-1 px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600 cursor-pointer whitespace-nowrap">确认</button>
                        <button onClick={() => setShowConfirmPass(false)} className="flex-1 px-3 py-1 text-xs text-slate-500 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-5 py-2 text-sm text-white rounded-lg hover:opacity-90 cursor-pointer whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                >
                  <i className="ri-close-line mr-1" />
                  驳回
                </button>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-share-forward-line mr-1" />
                  转签
                </button>
                <button
                  onClick={() => setShowAddSignModal(true)}
                  className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-user-add-line mr-1" />
                  加签
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[420px] p-5 z-10">
            <h3 className="text-base font-semibold text-slate-800 mb-3">驳回原因</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入驳回原因（必填）"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleReject} disabled={!rejectReason.trim()} className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50 hover:opacity-90 cursor-pointer whitespace-nowrap" style={{ background: '#ef4444' }}>确认驳回</button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowTransferModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[400px] p-5 z-10">
            <h3 className="text-base font-semibold text-slate-800 mb-3">转签</h3>
            <div className="relative mb-3">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                <i className="ri-search-line text-slate-300 text-sm" />
              </div>
              <input type="text" value={transferSearch} onChange={(e) => setTransferSearch(e.target.value)} placeholder="搜索转签人姓名或部门..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-0.5 border border-slate-100 rounded-lg">
              {filteredPerson(transferSearch).map((p) => (
                <button key={p.name} onClick={() => setTransferPerson(p.name)} className={`w-full px-3 py-1.5 text-left text-sm hover:bg-primary-50 cursor-pointer flex items-center gap-2 ${transferPerson === p.name ? 'bg-primary-50 text-primary-600' : 'text-slate-700'}`}>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-slate-400">{p.department}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setShowTransferModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleTransfer} disabled={!transferPerson} className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50 hover:opacity-90 cursor-pointer whitespace-nowrap" style={{ background: '#3b82f6' }}>确认转签</button>
            </div>
          </div>
        </div>
      )}

      {/* AddSign Modal */}
      {showAddSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddSignModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[400px] p-5 z-10">
            <h3 className="text-base font-semibold text-slate-800 mb-3">加签</h3>
            <div className="mb-3">
              <label className="text-xs text-slate-500 mb-1 block">加签位置</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setAddSignPosition('before')} className={`flex-1 px-3 py-2 text-sm rounded-lg border cursor-pointer whitespace-nowrap ${addSignPosition === 'before' ? 'border-primary-400 bg-primary-50 text-primary-600' : 'border-slate-200 text-slate-500'}`}>当前节点前</button>
                <button onClick={() => setAddSignPosition('after')} className={`flex-1 px-3 py-2 text-sm rounded-lg border cursor-pointer whitespace-nowrap ${addSignPosition === 'after' ? 'border-primary-400 bg-primary-50 text-primary-600' : 'border-slate-200 text-slate-500'}`}>当前节点后</button>
              </div>
            </div>
            <div className="relative mb-3">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                <i className="ri-search-line text-slate-300 text-sm" />
              </div>
              <input type="text" value={addSignSearch} onChange={(e) => setAddSignSearch(e.target.value)} placeholder="搜索加签人姓名或部门..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-0.5 border border-slate-100 rounded-lg">
              {filteredPerson(addSignSearch).map((p) => (
                <button key={p.name} onClick={() => setAddSignPerson(p.name)} className={`w-full px-3 py-1.5 text-left text-sm hover:bg-primary-50 cursor-pointer flex items-center gap-2 ${addSignPerson === p.name ? 'bg-primary-50 text-primary-600' : 'text-slate-700'}`}>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-slate-400">{p.department}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setShowAddSignModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleAddSign} disabled={!addSignPerson} className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50 hover:opacity-90 cursor-pointer whitespace-nowrap" style={{ background: '#3b82f6' }}>确认加签</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={toast.type === 'success' ? 'ri-checkbox-circle-line text-green-500' : 'ri-close-circle-line text-red-500'} />
            </div>
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{toast.msg}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}