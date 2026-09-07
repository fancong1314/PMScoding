import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { postEvalProjects, evalItems, getApprovalDetail, type PostEvalProject, type EvalItem, type DeferralRecord } from '@/mocks/postEvaluationMocks';

export default function EvaluationCatalogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') || '';
  const project = postEvalProjects.find(p => p.id === projectId) || null;
  const items = evalItems[projectId] || [];

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal states
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showNeedEvalModal, setShowNeedEvalModal] = useState(false);
  const [showDeferralModal, setShowDeferralModal] = useState(false);
  const [showDeferralRecordModal, setShowDeferralRecordModal] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [showEvalDetailModal, setShowEvalDetailModal] = useState(false);
  const [showApprovalDetailModal, setShowApprovalDetailModal] = useState(false);
  const [showTerminationModal, setShowTerminationModal] = useState(false);
  const [showApprovalFlowModal, setShowApprovalFlowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EvalItem | null>(null);
  // Termination states
  const [terminationReason, setTerminationReason] = useState('');
  const [terminationAttachments, setTerminationAttachments] = useState<{ id: string; name: string }[]>([]);
  // Approval flow config
  const [approvalFlowType, setApprovalFlowType] = useState<'default' | 'custom'>('default');
  const [customApprovalNodes, setCustomApprovalNodes] = useState<{ id: string; name: string; reviewer: string }[]>([]);
  const [currentDeferralRecords, setCurrentDeferralRecords] = useState<DeferralRecord[]>([]);

  // Form states
  const [smsPerson, setSmsPerson] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [needEvalValue, setNeedEvalValue] = useState('是');
  const [delayDate, setDelayDate] = useState('');
  const [delayReason, setDelayReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Local evalItems state for direct editing
  const [localItems, setLocalItems] = useState<EvalItem[]>([]);
  useEffect(() => { setLocalItems(JSON.parse(JSON.stringify(items))); }, [projectId]);

  const totalPages = Math.ceil(localItems.length / pageSize);
  const paginatedItems = localItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginatedItems.map(i => i.id)));
  };

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 2000); };

  const handleBatchSms = () => {
    if (selectedIds.size === 0) { alert('请先勾选评价细项'); return; }
    if (!smsPerson.trim()) { alert('请选择新的短信通知人2'); return; }
    setLocalItems(prev => prev.map(item => selectedIds.has(item.id) ? { ...item, smsNotify2: smsPerson } : item));
    setShowSmsModal(false); setSmsPerson(''); showSuccess(`已批量修改${selectedIds.size}条评价细项的短信通知人2`);
  };

  const handleBatchDeadline = () => {
    if (selectedIds.size === 0) { alert('请先勾选评价细项'); return; }
    if (!newDeadline) { alert('请选择新的评价截至时间'); return; }
    setLocalItems(prev => prev.map(item => selectedIds.has(item.id) ? { ...item, shouldEndDate: newDeadline } : item));
    setShowDeadlineModal(false); setNewDeadline(''); showSuccess(`已批量修改${selectedIds.size}条评价细项的截至时间`);
  };

  const handleBatchNeedEval = () => {
    if (selectedIds.size === 0) { alert('请先勾选评价细项'); return; }
    setLocalItems(prev => prev.map(item => selectedIds.has(item.id) ? { ...item, needEval: needEvalValue } : item));
    setShowNeedEvalModal(false); showSuccess(`已批量设置${selectedIds.size}条评价细项为${needEvalValue === '是' ? '需要' : '不需要'}评价`);
  };

  const handleDeferral = () => {
    if (!delayDate) { alert('请选择延期时间'); return; }
    if (!delayReason.trim()) { alert('请填写延期原因'); return; }
    if (selectedItem) {
      setLocalItems(prev => prev.map(item => item.id === selectedItem.id ? {
        ...item, isDelayed: '是', delayedTo: delayDate, delayReason, shouldEndDate: delayDate,
      } : item));
    }
    setShowDeferralModal(false); setDelayDate(''); setDelayReason(''); showSuccess('延期申请已提交，请等待审批');
  };

  const handleAddTerminationAttachment = () => {
    const newId = `attach-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newName = `终止申请附件_${terminationAttachments.length + 1}.pdf`;
    setTerminationAttachments(prev => [...prev, { id: newId, name: newName }]);
  };

  const handleRemoveTerminationAttachment = (id: string) => {
    setTerminationAttachments(prev => prev.filter(f => f.id !== id));
  };

  const handleTerminationPresent = () => {
    if (!terminationReason.trim()) { alert('请输入终止原因'); return; }
    setShowTerminationModal(false);
    setShowApprovalFlowModal(true);
  };

  const handleAddApprovalNode = () => {
    const idx = customApprovalNodes.length + 1;
    const reviewers = ['张总师', '李主任', '王部长', '赵经理', '陈主管', '周高工'];
    const reviewIdx = (idx - 1) % reviewers.length;
    setCustomApprovalNodes(prev => [...prev, {
      id: `node-${Date.now()}`,
      name: `审批节点${idx}`,
      reviewer: reviewers[reviewIdx],
    }]);
  };

  const handleRemoveApprovalNode = (id: string) => {
    setCustomApprovalNodes(prev => prev.filter(n => n.id !== id));
  };

  const handleApprovalFlowSubmit = () => {
    if (approvalFlowType === 'custom' && customApprovalNodes.length === 0) {
      alert('请至少添加一个审批节点'); return;
    }
    setShowApprovalFlowModal(false);
    setTerminationReason('');
    setTerminationAttachments([]);
    setCustomApprovalNodes([]);
    setApprovalFlowType('default');
    showSuccess('后评价终止申请已呈核，审批流程已发起');
  };

  const openDeferralRecord = (item: EvalItem) => {
    setSelectedItem(item);
    setCurrentDeferralRecords(item.deferralRecords);
    setShowDeferralRecordModal(true);
  };

  const openOperationLog = (item: EvalItem) => {
    setSelectedItem(item);
    setShowOperationLogModal(true);
  };

  const openEvalDetail = (item: EvalItem) => {
    setSelectedItem(item);
    setShowEvalDetailModal(true);
  };

  const handleDesignatedChange = (itemId: string, value: string) => {
    setLocalItems(prev => prev.map(item => item.id === itemId ? { ...item, designatedPerson: value } : item));
  };

  const evalStatusStyle = (s: string) => {
    if (s === '已确认') return 'bg-emerald-100 text-emerald-700';
    if (s === '自评中') return 'bg-sky-100 text-sky-700';
    if (s === '专评中') return 'bg-amber-100 text-amber-700';
    if (s === '综评中') return 'bg-violet-100 text-violet-700';
    return 'bg-slate-100 text-slate-500';
  };

  const getOperationButtons = (item: EvalItem) => {
    const btns: { label: string; onClick: () => void; style?: string }[] = [];
    btns.push({ label: '延期申请', onClick: () => { setSelectedItem(item); setShowDeferralModal(true); } });
    btns.push({ label: '延期记录', onClick: () => openDeferralRecord(item) });
    btns.push({ label: '操作日志', onClick: () => openOperationLog(item) });
    if (item.evalType === '自评价') btns.push({ label: '自评', onClick: () => navigate(`/project-close/post-evaluation/self-eval?projectId=${item.projectId}&itemId=${item.id}`), style: 'bg-sky-500' });
    if (item.evalType === '专业评价')
      btns.push({ label: '专评', onClick: () => navigate(`/project-close/post-evaluation/prof-eval?projectId=${item.projectId}&itemId=${item.id}`), style: 'bg-amber-500' });
    if (item.evalType === '综合评价')
      btns.push({ label: '综评', onClick: () => navigate(`/project-close/post-evaluation/comp-eval?projectId=${item.projectId}&itemId=${item.id}`), style: 'bg-violet-500' });
    btns.push({ label: '评价详情', onClick: () => openEvalDetail(item) });
    return btns;
  };

  const approvalDetail = getApprovalDetail('延期申请');

  if (!project) {
    return (
      <Layout><div className="flex items-center justify-center py-20 text-slate-400">未找到项目信息</div></Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/project-close/post-evaluation')} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer">
              <i className="ri-arrow-left-line text-slate-500" />
            </button>
            <h1 className="text-base font-semibold text-slate-800">评价目录</h1>
          </div>
          <span className="text-sm text-slate-400">共{localItems.length}条</span>
        </div>

        {/* Project Info */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div><span className="text-slate-500">项目号：</span>
            <span className="text-slate-800 font-medium">{project.approvalNo}</span>
            <span className="text-sky-500 ml-2 cursor-pointer hover:underline">点击查看立项生命周期信息</span>
          </div>
          <div><span className="text-slate-500">项目名称：</span><span className="text-slate-800">{project.projectName}</span></div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">立项信息上传：</span>
            <div className="flex items-center gap-1 px-2 py-1 border border-dashed border-slate-300 rounded cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
              <i className="ri-upload-cloud-2-line text-slate-400 text-xs" />
              <span className="text-xs text-slate-400">点击上传</span>
            </div>
          </div>
        </div>

        {/* Batch Operations */}
        <div className="px-5 py-2.5 border-b border-slate-200 flex items-center gap-2 flex-wrap">
          <button onClick={() => { if (selectedIds.size === 0) { alert('请先勾选评价细项'); return; } setShowSmsModal(true); }}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
            <i className="ri-user-shared-line" />批量修改短信通知人
          </button>
          <button onClick={() => { if (selectedIds.size === 0) { alert('请先勾选评价细项'); return; } setShowDeadlineModal(true); }}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
            <i className="ri-time-line" />批量修改评价截至时间
          </button>
          <button onClick={() => { if (selectedIds.size === 0) { alert('请先勾选评价细项'); return; } setShowNeedEvalModal(true); }}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
            <i className="ri-list-check-2" />批量设置是否需要评价
          </button>
          <button onClick={() => { if (selectedIds.size === 0) { alert('请先勾选评价细项'); return; } alert(`已向${selectedIds.size}条评价细项发送讯息通知`); }}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
            <i className="ri-mail-send-line" />发送讯息
          </button>
          {selectedIds.size > 0 && <span className="text-xs text-slate-500 ml-2">已选{selectedIds.size}项</span>}
          <div className="flex-1" />
          <button onClick={() => { setTerminationReason(''); setTerminationAttachments([]); setShowTerminationModal(true); }}
            className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap flex items-center gap-1"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            <i className="ri-close-circle-line" />后评价终止申请
          </button>
        </div>

        {successMsg && (
          <div className="mx-5 mt-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700 flex items-center gap-1">
            <i className="ri-check-line" />{successMsg}
          </div>
        )}

        {/* Table - left columns fixed, right operations fixed, middle scrollable */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="sticky left-0 bg-slate-50 z-10 px-2 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap text-center w-10">
                  <input type="checkbox" checked={selectedIds.size === paginatedItems.length && paginatedItems.length > 0} onChange={toggleSelectAll} />
                </th>
                <th className="sticky left-10 bg-slate-50 z-10 px-2 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap text-center w-12">序号</th>
                <th className="sticky left-[88px] bg-slate-50 z-10 px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap text-center min-w-[120px]">评价职能</th>
                {['短信通知人1','短信通知人2','指定人','实际操作人','是否需要后评价','评价类型','应结束评价时间','系统发送信息时间','实际结束时间','拟稿时间','是否延期','延期至','延期原因','评价状态'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap text-center min-w-[100px]">{h}</th>
                ))}
                <th className="sticky right-0 bg-slate-50 z-10 px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap text-center min-w-[280px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item, i) => {
                const btns = getOperationButtons(item);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="sticky left-0 bg-white z-10 px-2 py-2 text-center whitespace-nowrap">
                      <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)} />
                    </td>
                    <td className="sticky left-10 bg-white z-10 px-2 py-2 text-slate-700 text-center whitespace-nowrap text-xs">{item.seq}</td>
                    <td className="sticky left-[88px] bg-white z-10 px-3 py-2 text-slate-700 whitespace-nowrap text-xs font-medium">{item.evalFunction}</td>
                    <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs">{item.smsNotify1 || '-'}</td>
                    <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs">{item.smsNotify2 || '-'}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                      <input type="text" value={item.designatedPerson} onChange={e => handleDesignatedChange(item.id, e.target.value)}
                        className="w-20 px-1.5 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500" />
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs">{item.actualOperator || '-'}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${item.needEval === '是' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{item.needEval}</span>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${item.evalType === '自评价' ? 'bg-sky-50 text-sky-600' : item.evalType === '专业评价' ? 'bg-amber-50 text-amber-600' : 'bg-violet-50 text-violet-600'}`}>{item.evalType}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs">{item.shouldEndDate || '-'}</td>
                    <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs">{item.systemSendDate || '-'}</td>
                    <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs">{item.actualEndDate || '-'}</td>
                    <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs">{item.draftDate || '-'}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${item.isDelayed === '是' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{item.isDelayed}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-center whitespace-nowrap text-xs">{item.delayedTo || '-'}</td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs max-w-[120px] truncate" title={item.delayReason}>{item.delayReason || '-'}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${evalStatusStyle(item.evalStatus)}`}>{item.evalStatus}</span>
                    </td>
                    <td className="sticky right-0 bg-white z-10 px-2 py-2 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-0.5">
                        {btns.map((btn, bi) => (
                          <button key={bi} onClick={btn.onClick}
                            className={`px-1.5 py-0.5 text-xs text-white rounded cursor-pointer whitespace-nowrap ${btn.style || ''}`}
                            style={!btn.style ? { background: 'linear-gradient(135deg, #3b82f6, #2563eb)' } : undefined}>
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">每页{pageSize}条，共{localItems.length}条</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-left-double-line" /></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-left-s-line" /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const pg = start + i;
                if (pg > totalPages) return null;
                return <button key={pg} onClick={() => setCurrentPage(pg)} className={`w-7 h-7 flex items-center justify-center text-xs border rounded cursor-pointer ${pg === currentPage ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-medium' : 'border-slate-300 hover:bg-slate-100'}`}>{pg}</button>;
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-right-s-line" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-right-double-line" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: 批量修改短信通知人 */}
      {showSmsModal && (
        <ModalWrapper title="批量修改短信通知人" onClose={() => setShowSmsModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">新的短信通知人2 <span className="text-red-500">*</span></label>
              <select value={smsPerson} onChange={e => setSmsPerson(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">请选择</option>
                {['王志强','张建国','李卫东','赵永刚','陈明辉','吴国栋','钱志宏','周建华','黄明达','郑国梁','马建国','冯志伟'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="text-xs text-slate-500">已选细项数量：<span className="font-medium text-slate-800">{selectedIds.size}</span></div>
          </div>
          <ModalFooter onCancel={() => { setShowSmsModal(false); setSmsPerson(''); }} onConfirm={handleBatchSms} confirmText="确认" />
        </ModalWrapper>
      )}

      {/* Modal: 批量修改评价截至时间 */}
      {showDeadlineModal && (
        <ModalWrapper title="批量修改评价截至时间" onClose={() => setShowDeadlineModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">新的评价截至时间 <span className="text-red-500">*</span></label>
              <input type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="text-xs text-slate-500">已选细项数量：<span className="font-medium text-slate-800">{selectedIds.size}</span></div>
          </div>
          <ModalFooter onCancel={() => { setShowDeadlineModal(false); setNewDeadline(''); }} onConfirm={handleBatchDeadline} confirmText="确认" />
        </ModalWrapper>
      )}

      {/* Modal: 批量设置是否需要评价 */}
      {showNeedEvalModal && (
        <ModalWrapper title="批量设置是否需要评价" onClose={() => setShowNeedEvalModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">设置为</label>
              <div className="flex items-center gap-4">
                {['是','否'].map(v => (
                  <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="needEval" value={v} checked={needEvalValue === v} onChange={e => setNeedEvalValue(e.target.value)} />
                    <span className="text-sm text-slate-700">{v}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-500">已选细项数量：<span className="font-medium text-slate-800">{selectedIds.size}</span></div>
          </div>
          <ModalFooter onCancel={() => setShowNeedEvalModal(false)} onConfirm={handleBatchNeedEval} confirmText="确认" />
        </ModalWrapper>
      )}

      {/* Modal: 延期申请 */}
      {showDeferralModal && selectedItem && (
        <ModalWrapper title="延期申请" onClose={() => { setShowDeferralModal(false); setDelayDate(''); setDelayReason(''); }}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">延期时间 <span className="text-red-500">*</span></label>
              <input type="date" value={delayDate} onChange={e => setDelayDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-slate-600 mb-1 block">延期原因 <span className="text-red-500">*</span></label>
              <textarea value={delayReason} onChange={e => setDelayReason(e.target.value)} rows={3}
                placeholder="请输入延期原因" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
            </div>
          </div>
          <ModalFooter onCancel={() => { setShowDeferralModal(false); setDelayDate(''); setDelayReason(''); }}
            onConfirm={handleDeferral} confirmText="呈核"
            confirmStyle={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }} />
        </ModalWrapper>
      )}

      {/* Modal: 延期记录 */}
      {showDeferralRecordModal && selectedItem && (
        <ModalWrapper title="延期记录" onClose={() => setShowDeferralRecordModal(false)} wide>
          {currentDeferralRecords.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400">暂无延期记录</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  {['申请人','申请时间','应结束评价时间(延期前)','延期时间','延期原因','审批详情'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentDeferralRecords.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-3 py-2 text-slate-700 text-xs">{r.applicant}</td>
                    <td className="px-3 py-2 text-slate-600 text-xs">{r.applyTime}</td>
                    <td className="px-3 py-2 text-slate-600 text-xs">{r.originalEndDate}</td>
                    <td className="px-3 py-2 text-slate-600 text-xs">{r.delayedTo}</td>
                    <td className="px-3 py-2 text-slate-500 text-xs max-w-[200px] truncate" title={r.delayReason}>{r.delayReason}</td>
                    <td className="px-3 py-2 text-xs">
                      <button onClick={() => { setShowApprovalDetailModal(true); }}
                        className="text-sky-500 hover:underline cursor-pointer whitespace-nowrap">查看审批详情</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex justify-end mt-4">
            <button onClick={() => setShowDeferralRecordModal(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">关闭</button>
          </div>
        </ModalWrapper>
      )}

      {/* Modal: 操作日志 */}
      {showOperationLogModal && selectedItem && (
        <ModalWrapper title="操作日志" onClose={() => setShowOperationLogModal(false)} wide>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['操作类型','操作人','操作时间','操作详情','修改前','修改后'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedItem.operationLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2 text-xs"><span className={`px-1.5 py-0.5 rounded whitespace-nowrap ${log.operationType.includes('修改') ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}>{log.operationType}</span></td>
                  <td className="px-3 py-2 text-slate-700 text-xs whitespace-nowrap">{log.operator}</td>
                  <td className="px-3 py-2 text-slate-600 text-xs whitespace-nowrap">{log.operationTime}</td>
                  <td className="px-3 py-2 text-slate-500 text-xs max-w-[200px] truncate" title={log.detail}>{log.detail}</td>
                  <td className="px-3 py-2 text-slate-500 text-xs max-w-[180px] truncate" title={log.beforeValue || ''}>
                    {log.beforeValue ? <span className="text-red-500">{log.beforeValue}</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-3 py-2 text-slate-500 text-xs max-w-[180px] truncate" title={log.afterValue || ''}>
                    {log.afterValue ? <span className="text-emerald-600">{log.afterValue}</span> : <span className="text-slate-300">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <button onClick={() => setShowOperationLogModal(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">关闭</button>
          </div>
        </ModalWrapper>
      )}

      {/* Modal: 评价详情 */}
      {showEvalDetailModal && selectedItem && (
        <EvalDetailModal item={selectedItem} project={project} onClose={() => setShowEvalDetailModal(false)} />
      )}

      {/* Modal: 审批详情 */}
      {showApprovalDetailModal && (
        <ApprovalDetailModal approvalDetail={approvalDetail} bizType="延期申请" onClose={() => setShowApprovalDetailModal(false)} />
      )}

      {/* Modal: 后评价终止申请 */}
      {showTerminationModal && (
        <ModalWrapper title="后评价终止申请" onClose={() => setShowTerminationModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">终止原因 <span className="text-red-500">*</span></label>
              <textarea value={terminationReason} onChange={e => setTerminationReason(e.target.value)} rows={4} maxLength={500}
                placeholder="请输入后评价终止原因..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
              <div className="text-right text-xs text-slate-400 mt-1">{terminationReason.length}/500</div>
            </div>
            <div>
              <label className="text-xs text-slate-600 mb-1 block">附件上传</label>
              {terminationAttachments.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {terminationAttachments.map(f => (
                    <div key={f.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-pdf-line text-red-500" /></div>
                        <span className="text-xs text-slate-700">{f.name}</span>
                      </div>
                      <button onClick={() => handleRemoveTerminationAttachment(f.id)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 cursor-pointer">
                        <i className="ri-close-line" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div onClick={handleAddTerminationAttachment}
                className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-emerald-300 transition-colors cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-1.5">
                  <i className="ri-upload-cloud-2-line text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">点击上传附件</p>
                <p className="text-xs text-slate-400 mt-0.5">支持 PDF、Word 等格式</p>
              </div>
            </div>
          </div>
          <ModalFooter onCancel={() => { setShowTerminationModal(false); setTerminationReason(''); setTerminationAttachments([]); }}
            onConfirm={handleTerminationPresent} confirmText="呈核"
            confirmStyle={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }} />
        </ModalWrapper>
      )}

      {/* Modal: 审批流配置 */}
      {showApprovalFlowModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={() => setShowApprovalFlowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-[650px] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-800">审批流程设置</h2>
              <button onClick={() => setShowApprovalFlowModal(false)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-slate-500 mb-4">请选择审批流程类型并配置审批节点</p>
              <div className="flex items-center gap-6 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="flowType" value="default" checked={approvalFlowType === 'default'}
                    onChange={() => setApprovalFlowType('default')} className="w-4 h-4 accent-emerald-500" />
                  <span className="text-sm text-slate-700">默认审批流程</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="flowType" value="custom" checked={approvalFlowType === 'custom'}
                    onChange={() => setApprovalFlowType('custom')} className="w-4 h-4 accent-emerald-500" />
                  <span className="text-sm text-slate-700">自定义审批流程</span>
                </label>
              </div>

              {approvalFlowType === 'default' ? (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-2">默认审批节点</p>
                  <div className="space-y-2">
                    {['项目经理审批', '主管单位审批', '总师室审批'].map((node, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-3 py-2 bg-white rounded-md border border-slate-100">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>{idx + 1}</div>
                        <span className="text-sm text-slate-700 font-medium">{node}</span>
                        <span className="text-xs text-slate-400 ml-auto">系统自动分配</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <button onClick={handleAddApprovalNode}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md hover:opacity-90 cursor-pointer whitespace-nowrap mb-3"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <i className="ri-add-line" />添加审批节点
                  </button>
                  {customApprovalNodes.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">请点击上方按钮添加审批节点</div>
                  ) : (
                    <div className="space-y-2">
                      {customApprovalNodes.map((node, idx) => (
                        <div key={node.id} className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>{idx + 1}</div>
                          <div className="flex-1">
                            <span className="text-sm text-slate-700 font-medium">{node.name}</span>
                            <span className="text-xs text-slate-400 ml-2">审批人: {node.reviewer}</span>
                          </div>
                          <button onClick={() => handleRemoveApprovalNode(node.id)}
                            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 cursor-pointer">
                            <i className="ri-delete-bin-line" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setShowApprovalFlowModal(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleApprovalFlowSubmit} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>确认呈核</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

// --- Shared Modal Components ---

function ModalWrapper({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div className={`bg-white rounded-lg shadow-xl border border-slate-200 max-h-[85vh] overflow-y-auto ${wide ? 'w-[800px]' : 'w-[480px]'}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ onCancel, onConfirm, confirmText, confirmStyle }: { onCancel: () => void; onConfirm: () => void; confirmText: string; confirmStyle?: React.CSSProperties }) {
  return (
    <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-slate-200">
      <button onClick={onCancel} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">取消</button>
      <button onClick={onConfirm} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
        style={confirmStyle || { background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>{confirmText}</button>
    </div>
  );
}

function ApprovalDetailModal({ approvalDetail, bizType, onClose }: { approvalDetail: { approvalNo: string; applicant: string; applyTime: string; nodes: { seq: number; nodeName: string; reviewer: string; status: string; opinion: string; time: string }[] }; bizType: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-[580px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">审批详情 - {bizType}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
        </div>
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-slate-500">审批单号：</span><span className="text-slate-800 font-medium">{approvalDetail.approvalNo}</span></div>
          <div><span className="text-slate-500">业务类型：</span><span className="text-slate-800">{bizType}</span></div>
          <div><span className="text-slate-500">发起人：</span><span className="text-slate-800">{approvalDetail.applicant}</span></div>
          <div><span className="text-slate-500">发起时间：</span><span className="text-slate-800">{approvalDetail.applyTime}</span></div>
        </div>
        <div className="px-5 py-4">
          <div className="relative pl-8">
            <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-slate-200" />
            {approvalDetail.nodes.map((node, idx) => {
              const isApproved = node.status === 'approved';
              const isRejected = node.status === 'rejected';
              const isProcessing = node.status === 'processing';
              const statusColor = isApproved ? 'bg-emerald-500' : isRejected ? 'bg-red-500' : isProcessing ? 'bg-amber-500' : 'bg-slate-300';
              const textColor = isApproved ? 'text-emerald-600' : isRejected ? 'text-red-600' : isProcessing ? 'text-amber-600' : 'text-slate-400';
              const borderColor = isApproved ? 'border-emerald-100' : isRejected ? 'border-red-100' : isProcessing ? 'border-amber-100' : 'border-slate-100';
              return (
                <div key={idx} className={`relative mb-3 last:mb-0 p-3 rounded-md border ${borderColor}`}>
                  <div className={`absolute -left-[22px] top-3 w-3 h-3 rounded-full border-2 border-white ${statusColor}`} />
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-800">{node.seq}. {node.nodeName}</span>
                    <span className={`text-xs font-medium ${textColor}`}>
                      {isApproved ? '已通过' : isRejected ? '已驳回' : isProcessing ? '审批中' : '待审批'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">审批人：{node.reviewer}</p>
                  {node.opinion && <p className="text-xs text-slate-500 mt-1">意见：{node.opinion}</p>}
                  {node.time && <p className="text-xs text-slate-400 mt-1">时间：{node.time}</p>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}

function EvalDetailModal({ item, project, onClose }: { item: EvalItem; project: PostEvalProject; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'self' | 'prof' | 'comp'>('self');
  const tabs = [
    { key: 'self' as const, label: '自评' },
    { key: 'prof' as const, label: '专评' },
    { key: 'comp' as const, label: '综评' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-[900px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">评价详情 - {item.evalFunction}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200">
          <div className="flex items-center gap-0">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors relative ${
                  activeTab === tab.key ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'
                }`}>
                {tab.label}
                {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4">
          {/* Project basic info */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-1.5 mb-4 pb-3 border-b border-slate-100 text-xs">
            <div><span className="text-slate-500">立项号：</span><span className="text-slate-800">{project.approvalNo}</span></div>
            <div><span className="text-slate-500">项目名称：</span><span className="text-slate-800">{project.projectName}</span></div>
            <div><span className="text-slate-500">立项时间：</span><span className="text-slate-800">{project.approvalDate}</span></div>
            <div><span className="text-slate-500">项目类型：</span><span className="text-slate-800">{project.projectType}</span></div>
            <div><span className="text-slate-500">主管单位：</span><span className="text-slate-800">{project.supervisorUnit}</span></div>
            <div><span className="text-slate-500">实施单位：</span><span className="text-slate-800">{project.ownerUnit}</span></div>
            <div><span className="text-slate-500">项目经理：</span><span className="text-slate-800">{project.projectManager}</span></div>
            <div><span className="text-slate-500">联系方式：</span><span className="text-slate-800">138****5678</span></div>
          </div>

          {activeTab === 'self' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">自评结果</h3>
              {[
                { label: '项目主要内容-计划建设内容', value: project.approvalDesc },
                { label: '实现情况', value: '已按计划完成全部建设内容，各项指标达到设计要求。' },
                { label: '差异内容', value: '实际建设过程中新增了部分辅助设施。' },
                { label: '得分', value: '25分' },
                { label: '质量情况-验收合格', value: '是' },
                { label: '整改项', value: '无' },
                { label: '设备验收', value: '是' },
                { label: '热负荷试车', value: '是' },
                { label: '质量得分', value: '20分' },
                { label: '项目技术目标', value: '达到行业领先技术水平。' },
                { label: '技术实现情况', value: '项目技术目标已全面实现。' },
                { label: '技术差异率', value: '+5.2%' },
                { label: '技术得分', value: '15分' },
                { label: '效益效果', value: '投资回收期约3.5年' },
                { label: '效益实现情况', value: '产能提升12%，年节约成本约320万元。' },
                { label: '效益差异率', value: '+3.1%' },
                { label: '效益得分', value: '18分' },
                { label: '总得分', value: '92分' },
              ].map((row, i) => (
                <div key={i} className="flex gap-4 py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 w-40 flex-shrink-0">{row.label}</span>
                  <span className="text-slate-800">{row.value}</span>
                </div>
              ))}
              <h3 className="text-sm font-semibold text-slate-800 pt-3 pb-2 border-b border-slate-100">后评价基本信息</h3>
              {[
                { label: '短信通知人', value: item.smsNotify1 || '-' },
                { label: '评价人', value: item.designatedPerson || '-' },
                { label: '应结束时间', value: item.shouldEndDate || '-' },
                { label: '实际评价时间', value: item.actualEndDate || '-' },
                { label: '评价状态', value: item.evalStatus },
                { label: '是否延期', value: item.isDelayed || '-' },
              ].map((row, i) => (
                <div key={i} className="flex gap-4 py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 w-40 flex-shrink-0">{row.label}</span>
                  <span className="text-slate-800">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prof' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">专评结果</h3>
              <div className="flex gap-4 py-1.5 border-b border-slate-50">
                <span className="text-slate-500 w-40 flex-shrink-0">项目主要内容</span>
                <span className="text-slate-800">{project.approvalDesc}</span>
              </div>
              <div className="flex gap-4 py-1.5 border-b border-slate-50">
                <span className="text-slate-500 w-40 flex-shrink-0">专业考评意见</span>
                <span className="text-slate-800">{item.evalStatus === '已确认' ? `经专业评审，该项目施工质量、技术指标、安全环保等方面均达到设计要求和行业标准，${item.evalFunction}综合评价合格，建议通过专业评价。` : '暂无'}</span>
              </div>
            </div>
          )}

          {activeTab === 'comp' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">综评结果</h3>
              {[
                { label: '项目主要内容', value: project.approvalDesc },
                { label: '计划建设内容实现', value: '已按计划完成全部建设内容。' },
                { label: '质量情况', value: '验收合格，无整改项。' },
                { label: '技术目标', value: '已全面实现，关键指标超设计值。' },
                { label: '效益效果', value: '经济效益显著，投资回收期合理。' },
                { label: '专业评价意见', value: '综合评价合格。' },
                { label: '综评得分', value: '89分' },
              ].map((row, i) => (
                <div key={i} className="flex gap-4 py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 w-40 flex-shrink-0">{row.label}</span>
                  <span className="text-slate-800">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}