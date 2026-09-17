import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  mockConstructionProjects,
  mockConstructionContracts,
  mockConstructionMembers,
  type ConstructionMember,
} from '@/mocks/constructionMemberMocks';

export default function ConstructionMemberDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = parseInt(searchParams.get('projectId') || '1', 10);

  const project = useMemo(() => mockConstructionProjects.find((p) => p.id === projectId) || mockConstructionProjects[0], [projectId]);

  const projectContracts = useMemo(
    () => mockConstructionContracts.filter((c) => c.projectId === projectId),
    [projectId],
  );

  const [activeContractId, setActiveContractId] = useState<number>(projectContracts[0]?.id || 0);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchName, setSearchName] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [contractSearchKeyword, setContractSearchKeyword] = useState('');

  // Approval modal
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalMember, setApprovalMember] = useState<ConstructionMember | null>(null);
  const [approvalComment, setApprovalComment] = useState('');

  // Detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailMember, setDetailMember] = useState<ConstructionMember | null>(null);

  // Filter contracts
  const filteredContracts = useMemo(() => {
    if (!contractSearchKeyword) return projectContracts;
    return projectContracts.filter(
      (c) => c.contractName.toLowerCase().includes(contractSearchKeyword.toLowerCase()),
    );
  }, [projectContracts, contractSearchKeyword]);

  // Members for active contract
  const activeMembers = useMemo(() => {
    const all = mockConstructionMembers.filter(
      (m) => m.contractId === activeContractId && m.status === activeTab,
    );
    if (!searchName) return all;
    return all.filter((m) => m.name.toLowerCase().includes(searchName.toLowerCase()));
  }, [activeContractId, activeTab, searchName]);

  // Sync tabs when switching contracts
  const handleContractSelect = useCallback((contractId: number) => {
    setActiveContractId(contractId);
    setSelectedIds(new Set());
    setSearchName('');
  }, []);

  // Select all toggle
  const toggleSelectAll = () => {
    if (selectedIds.size === activeMembers.length && activeMembers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(activeMembers.map((m) => m.id)));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Approval
  const openApproval = (member: ConstructionMember) => {
    setApprovalMember(member);
    setApprovalComment('');
    setShowApprovalModal(true);
  };

  const handleApprove = () => {
    if (!approvalMember) return;
    const member = mockConstructionMembers.find((m) => m.id === approvalMember.id);
    if (member) {
      member.status = 'approved';
      member.approveComment = approvalComment || '资质审核通过，同意入场';
      member.approveTime = new Date().toISOString().split('T')[0];
      member.approver = '管理员';
    }
    setShowApprovalModal(false);
    setApprovalMember(null);
    setSelectedIds(new Set());
  };

  const handleReject = () => {
    if (!approvalMember) return;
    if (!approvalComment.trim()) {
      alert('请填写驳回原因');
      return;
    }
    const member = mockConstructionMembers.find((m) => m.id === approvalMember.id);
    if (member) {
      member.status = 'rejected';
      member.approveComment = approvalComment;
      member.approveTime = new Date().toISOString().split('T')[0];
      member.approver = '管理员';
    }
    setShowApprovalModal(false);
    setApprovalMember(null);
    setSelectedIds(new Set());
  };

  // Batch operations
  const batchApprove = () => {
    if (selectedIds.size === 0) return;
    selectedIds.forEach((id) => {
      const member = mockConstructionMembers.find((m) => m.id === id);
      if (member) {
        member.status = 'approved';
        member.approveComment = '批量审批通过';
        member.approveTime = new Date().toISOString().split('T')[0];
        member.approver = '管理员';
      }
    });
    setSelectedIds(new Set());
  };

  const batchReject = () => {
    if (selectedIds.size === 0) return;
    selectedIds.forEach((id) => {
      const member = mockConstructionMembers.find((m) => m.id === id);
      if (member) {
        member.status = 'rejected';
        member.approveComment = '批量审批驳回';
        member.approveTime = new Date().toISOString().split('T')[0];
        member.approver = '管理员';
      }
    });
    setSelectedIds(new Set());
  };

  // Return to rejected
  const returnToRejected = (member: ConstructionMember) => {
    const m = mockConstructionMembers.find((em) => em.id === member.id);
    if (m) {
      m.status = 'rejected';
      m.approveComment = '资质不符，退回处理';
      m.approveTime = new Date().toISOString().split('T')[0];
    }
  };

  // Export
  const handleExport = () => {
    alert('导出功能：将导出当前合同下所有状态成员数据为Excel');
  };

  // View detail
  const openDetail = (member: ConstructionMember) => {
    setDetailMember(member);
    setShowDetailModal(true);
  };

  const statusLabel = (s: string) => {
    if (s === 'pending') return { label: '待审批', cls: 'bg-amber-100 text-amber-700' };
    if (s === 'approved') return { label: '已通过', cls: 'bg-green-100 text-green-700' };
    return { label: '已驳回', cls: 'bg-red-100 text-red-700' };
  };

  return (
    <Layout>
      <div>
        {/* Top Info Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/participant/construction-member')}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background-100 transition-colors cursor-pointer text-foreground-600"
            >
              <i className="ri-arrow-left-line" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-foreground-950">{project.projectName}</h2>
              <p className="text-xs text-foreground-500">立项号：{project.projectNumber}</p>
            </div>
          </div>
        </div>

        {/* Main Layout - Left / Right */}
        <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {/* Left: Contract List */}
          <div className="w-64 flex-shrink-0" style={{ border: '1px solid #e8edf3', borderRadius: '8px', backgroundColor: '#fff' }}>
            <div className="p-3" style={{ borderBottom: '1px solid #e8edf3' }}>
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center">
                  <i className="ri-search-line text-foreground-400 text-xs" />
                </div>
                <input
                  type="text"
                  value={contractSearchKeyword}
                  onChange={(e) => setContractSearchKeyword(e.target.value)}
                  placeholder="合同名称模糊搜索"
                  className="w-full h-8 pl-7 pr-3 text-xs border border-background-200 rounded-md bg-white text-foreground-800 outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {filteredContracts.length === 0 ? (
                <div className="p-4 text-center text-xs text-foreground-400">暂无匹配合同</div>
              ) : (
                filteredContracts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleContractSelect(c.id)}
                    className={`w-full text-left px-3 py-2.5 text-xs transition-colors cursor-pointer border-l-2 ${
                      activeContractId === c.id
                        ? 'bg-primary-50 text-primary-600 border-primary-500 font-medium'
                        : 'text-foreground-700 hover:bg-background-50 border-transparent'
                    }`}
                    style={{ borderBottom: '1px solid #f5f6f7' }}
                  >
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis">{c.contractName}</div>
                    <div className={`text-2xs mt-0.5 font-mono ${
                      activeContractId === c.id ? 'text-primary-400' : 'text-foreground-400'
                    }`}>
                      {c.contractNo}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Member List */}
          <div className="flex-1" style={{ border: '1px solid #e8edf3', borderRadius: '8px', backgroundColor: '#fff' }}>
            {/* Tabs */}
            <div className="flex items-center justify-between px-4 pt-3" style={{ borderBottom: '1px solid #e8edf3' }}>
              <div className="flex items-center gap-1">
                {(['pending', 'approved', 'rejected'] as const).map((tab) => {
                  const count = mockConstructionMembers.filter(
                    (m) => m.contractId === activeContractId && m.status === tab,
                  ).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setSelectedIds(new Set()); }}
                      className={`px-4 py-2 text-xs font-medium rounded-t-md transition-colors cursor-pointer whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-white text-primary-600 border-b-2 border-primary-500'
                          : 'text-foreground-500 hover:text-foreground-700'
                      }`}
                    >
                      {tab === 'pending' ? '待审批' : tab === 'approved' ? '已通过' : '已驳回'}
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-2xs ${
                        tab === 'pending' ? 'bg-amber-100 text-amber-700' :
                        tab === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pb-2">
                {activeTab === 'pending' && (
                  <>
                    <button
                      onClick={batchApprove}
                      disabled={selectedIds.size === 0}
                      className="h-7 px-3 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <div className="w-3 h-3 inline-flex items-center justify-center mr-0.5"><i className="ri-check-line" /></div>
                      批量通过
                    </button>
                    <button
                      onClick={batchReject}
                      disabled={selectedIds.size === 0}
                      className="h-7 px-3 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <div className="w-3 h-3 inline-flex items-center justify-center mr-0.5"><i className="ri-close-line" /></div>
                      批量驳回
                    </button>
                  </>
                )}
                <div className="relative ml-2">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center">
                    <i className="ri-search-line text-foreground-400 text-2xs" />
                  </div>
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="根据姓名模糊搜索"
                    className="h-7 w-40 pl-6 pr-2 text-xs border border-background-200 rounded-md bg-white text-foreground-800 outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <button
                  onClick={handleExport}
                  className="h-7 px-3 text-xs font-medium bg-primary-500 text-background-50 rounded-md hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <div className="w-3 h-3 inline-flex items-center justify-center mr-0.5"><i className="ri-download-2-line" /></div>
                  导出
                </button>
              </div>
            </div>

            {/* Member Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#f8fafb' }}>
                    <th className="px-3 py-2.5 text-center w-10">
                      <input
                        type="checkbox"
                        checked={activeMembers.length > 0 && selectedIds.size === activeMembers.length}
                        onChange={toggleSelectAll}
                        className="w-3.5 h-3.5 cursor-pointer accent-primary-500"
                      />
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">序号</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">合同名称</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">企业名称</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">姓名</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">身份证号</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">手机号</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">人员类型</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">资质附件</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">入场时间</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">结束入场时间</th>
                    {activeTab === 'pending' && (
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">审批状态</th>
                    )}
                    <th className="text-center px-3 py-2.5 text-xs font-semibold text-foreground-700 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMembers.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'pending' ? 13 : 12} className="text-center py-10 text-foreground-400 text-xs">
                        暂无成员数据
                      </td>
                    </tr>
                  ) : (
                    activeMembers.map((m, idx) => {
                      const isSelected = selectedIds.has(m.id);
                      const st = statusLabel(m.status);
                      return (
                        <tr
                          key={m.id}
                          className={`transition-colors ${isSelected ? 'bg-primary-50' : 'hover:bg-background-50'}`}
                          style={{ borderBottom: '1px solid #f0f2f5' }}
                        >
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(m.id)}
                              className="w-3.5 h-3.5 cursor-pointer accent-primary-500"
                            />
                          </td>
                          <td className="px-3 py-2 text-foreground-700 whitespace-nowrap text-xs">{idx + 1}</td>
                          <td className="px-3 py-2 text-foreground-700 whitespace-nowrap text-xs max-w-32 overflow-hidden text-ellipsis">{m.contractName}</td>
                          <td className="px-3 py-2 text-foreground-700 whitespace-nowrap text-xs">{m.companyName}</td>
                          <td className="px-3 py-2 text-foreground-800 whitespace-nowrap text-xs font-medium">{m.name}</td>
                          <td className="px-3 py-2 text-foreground-600 whitespace-nowrap font-mono text-xs">{m.idCard}</td>
                          <td className="px-3 py-2 text-foreground-600 whitespace-nowrap font-mono text-xs">{m.phone}</td>
                          <td className="px-3 py-2 text-foreground-700 whitespace-nowrap text-xs">{m.personType}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                            <span className="text-primary-600 hover:text-primary-700 cursor-pointer underline">{m.attachmentName}</span>
                          </td>
                          <td className="px-3 py-2 text-foreground-600 whitespace-nowrap text-xs">{m.entryTime}</td>
                          <td className="px-3 py-2 text-foreground-600 whitespace-nowrap text-xs">{m.exitTime}</td>
                          {activeTab === 'pending' && (
                            <td className="px-3 py-2 text-center whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${st.cls}`}>{st.label}</span>
                            </td>
                          )}
                          <td className="px-3 py-2 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              {activeTab === 'pending' && (
                                <>
                                  <button
                                    onClick={() => openApproval(m)}
                                    className="text-xs text-green-600 hover:text-green-700 font-medium px-1.5 py-1 cursor-pointer whitespace-nowrap"
                                  >
                                    <div className="w-3 h-3 inline-flex items-center justify-center mr-0.5"><i className="ri-check-double-line" /></div>审批
                                  </button>
                                  <button
                                    onClick={() => openDetail(m)}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium px-1.5 py-1 cursor-pointer whitespace-nowrap"
                                  >
                                    <div className="w-3 h-3 inline-flex items-center justify-center mr-0.5"><i className="ri-eye-line" /></div>查看
                                  </button>
                                </>
                              )}
                              {activeTab === 'approved' && (
                                <>
                                  <button
                                    onClick={() => openDetail(m)}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium px-1.5 py-1 cursor-pointer whitespace-nowrap"
                                  >
                                    <div className="w-3 h-3 inline-flex items-center justify-center mr-0.5"><i className="ri-eye-line" /></div>查看
                                  </button>
                                  <button
                                    onClick={() => { returnToRejected(m); setSelectedIds(new Set()); }}
                                    className="text-xs text-orange-600 hover:text-orange-700 font-medium px-1.5 py-1 cursor-pointer whitespace-nowrap"
                                  >
                                    <div className="w-3 h-3 inline-flex items-center justify-center mr-0.5"><i className="ri-arrow-go-back-line" /></div>退回
                                  </button>
                                </>
                              )}
                              {activeTab === 'rejected' && (
                                <button
                                  onClick={() => openDetail(m)}
                                  className="text-xs text-primary-600 hover:text-primary-700 font-medium px-1.5 py-1 cursor-pointer whitespace-nowrap"
                                >
                                  <div className="w-3 h-3 inline-flex items-center justify-center mr-0.5"><i className="ri-eye-line" /></div>查看
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer count */}
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: '1px solid #e8edf3' }}>
              <span className="text-xs text-foreground-500">
                共 {activeMembers.length} 条记录
                {selectedIds.size > 0 && (
                  <span className="ml-2 text-primary-600">（已选 {selectedIds.size} 条）</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && approvalMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #e8edf3' }}>
                <h3 className="text-sm font-semibold text-foreground-950">施工成员审批</h3>
                <button
                  onClick={() => { setShowApprovalModal(false); setApprovalMember(null); }}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-background-100 transition-colors cursor-pointer text-foreground-500"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
              <div className="px-5 py-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-foreground-500">姓名：</span><span className="text-foreground-800 font-medium">{approvalMember.name}</span></div>
                  <div><span className="text-foreground-500">身份证号：</span><span className="text-foreground-700 font-mono">{approvalMember.idCard}</span></div>
                  <div><span className="text-foreground-500">手机号：</span><span className="text-foreground-700 font-mono">{approvalMember.phone}</span></div>
                  <div><span className="text-foreground-500">人员类型：</span><span className="text-foreground-700">{approvalMember.personType}</span></div>
                  <div className="col-span-2"><span className="text-foreground-500">企业名称：</span><span className="text-foreground-700">{approvalMember.companyName}</span></div>
                  <div className="col-span-2"><span className="text-foreground-500">合同名称：</span><span className="text-foreground-700">{approvalMember.contractName}</span></div>
                  <div><span className="text-foreground-500">入场时间：</span><span className="text-foreground-700">{approvalMember.entryTime}</span></div>
                  <div><span className="text-foreground-500">结束入场时间：</span><span className="text-foreground-700">{approvalMember.exitTime}</span></div>
                  <div className="col-span-2"><span className="text-foreground-500">资质附件：</span><span className="text-primary-600 hover:text-primary-700 underline cursor-pointer">{approvalMember.attachmentName}</span></div>
                </div>
                <div className="mt-4">
                  <label className="text-xs text-foreground-600 font-medium block mb-1">审批意见</label>
                  <textarea
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="请输入审批意见（通过时选填，驳回时必填）"
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 text-xs border border-background-200 rounded-md bg-white text-foreground-800 outline-none focus:border-primary-500 transition-colors resize-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #e8edf3' }}>
                <button
                  onClick={() => { setShowApprovalModal(false); setApprovalMember(null); }}
                  className="h-8 px-4 text-xs font-medium text-foreground-600 bg-background-100 rounded-md hover:bg-background-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  关闭
                </button>
                <button
                  onClick={handleReject}
                  className="h-8 px-4 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  驳回
                </button>
                <button
                  onClick={handleApprove}
                  className="h-8 px-4 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  通过
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && detailMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-4">
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #e8edf3' }}>
                <h3 className="text-sm font-semibold text-foreground-950">施工成员详情</h3>
                <button
                  onClick={() => { setShowDetailModal(false); setDetailMember(null); }}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-background-100 transition-colors cursor-pointer text-foreground-500"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
              <div className="px-5 py-4">
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div><span className="text-foreground-500">姓名：</span><span className="text-foreground-800 font-medium">{detailMember.name}</span></div>
                  <div><span className="text-foreground-500">身份证号：</span><span className="text-foreground-700 font-mono">{detailMember.idCard}</span></div>
                  <div><span className="text-foreground-500">手机号：</span><span className="text-foreground-700 font-mono">{detailMember.phone}</span></div>
                  <div><span className="text-foreground-500">人员类型：</span><span className="text-foreground-700">{detailMember.personType}</span></div>
                  <div className="col-span-2"><span className="text-foreground-500">企业名称：</span><span className="text-foreground-700">{detailMember.companyName}</span></div>
                  <div className="col-span-2"><span className="text-foreground-500">合同名称：</span><span className="text-foreground-700">{detailMember.contractName}</span></div>
                  <div><span className="text-foreground-500">合同编号：</span><span className="text-foreground-700 font-mono">{detailMember.contractNo}</span></div>
                  <div><span className="text-foreground-500">审批状态：</span>
                    {(() => {
                      const st = statusLabel(detailMember.status);
                      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${st.cls}`}>{st.label}</span>;
                    })()}
                  </div>
                  <div><span className="text-foreground-500">入场时间：</span><span className="text-foreground-700">{detailMember.entryTime}</span></div>
                  <div><span className="text-foreground-500">结束入场时间：</span><span className="text-foreground-700">{detailMember.exitTime}</span></div>
                  <div className="col-span-2"><span className="text-foreground-500">资质附件：</span><span className="text-primary-600 hover:text-primary-700 underline cursor-pointer">{detailMember.attachmentName}</span></div>
                </div>

                {/* Approval Info */}
                <div style={{ borderTop: '1px solid #e8edf3', paddingTop: '12px' }}>
                  <h4 className="text-xs font-semibold text-foreground-800 mb-3">审批信息</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-foreground-500">提交时间：</span><span className="text-foreground-700">{detailMember.submitTime}</span></div>
                    <div><span className="text-foreground-500">审批时间：</span><span className="text-foreground-700">{detailMember.approveTime || '-'}</span></div>
                    <div><span className="text-foreground-500">审批人：</span><span className="text-foreground-700">{detailMember.approver || '-'}</span></div>
                    <div><span className="text-foreground-500">审批意见：</span><span className="text-foreground-700">{detailMember.approveComment || '-'}</span></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end px-5 py-3" style={{ borderTop: '1px solid #e8edf3' }}>
                <button
                  onClick={() => { setShowDetailModal(false); setDetailMember(null); }}
                  className="h-8 px-4 text-xs font-medium text-foreground-600 bg-background-100 rounded-md hover:bg-background-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}