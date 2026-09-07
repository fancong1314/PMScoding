import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import MemberModal from '../components/MemberModal';
import ChangeModal from '../components/ChangeModal';
import { getProjectMembers, employees, type ProjectMember, memberTypeConfig } from '@/mocks/projectPrepareMocks';

export default function MemberListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const projectName = searchParams.get('projectName') || '';
  const approvalNo = searchParams.get('approvalNo') || '';

  const [members, setMembers] = useState<ProjectMember[]>(getProjectMembers(projectId));
  const [searchKey, setSearchKey] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState('');

  // 弹窗
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [changeType, setChangeType] = useState<string>('项目经理变更');
  const [currentMember, setCurrentMember] = useState<ProjectMember | null>(null);

  // 需要发起变更申请的成员类型
  const CHANGEABLE_TYPES = [
    '项目经理', '合同经办人',
    '论证经办人', '工程需求资料经办人',
    '合同预付款申请资料经办人', '合同预结算报支资料经办人', '合同质保金报支资料经办人',
  ];

  const filtered = useMemo(() => {
    let list = [...members];
    // 按成员类型优先级排列
    const priority: Record<string, number> = { '项目经理': 0, '合同经办人': 1, '项目创建人': 2, '招标经理': 3, '采购经理': 4, '项目成员': 5 };
    list.sort((a, b) => (priority[a.memberType] ?? 99) - (priority[b.memberType] ?? 99));
    if (searchKey.trim()) {
      const kw = searchKey.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(kw));
    }
    return list;
  }, [members, searchKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((m) => m.id)));
    }
  };

  const handleAddMembers = (data: { members: { employeeId: string; memberType: string }[] }) => {
    const newMembers = data.members.map((m, i) => {
      const emp = employees.find((e) => e.id === m.employeeId)!;
      return {
        id: `pm_${projectId}_${String(members.length + i + 1).padStart(3, '0')}`,
        projectId,
        name: emp.name,
        employeeNo: emp.employeeNo,
        department: emp.department,
        phone: emp.phone,
        memberType: m.memberType as ProjectMember['memberType'],
        relatedContract: '-',
        status: '审批中' as const,
        createDate: new Date().toISOString().split('T')[0],
      };
    });
    setMembers((prev) => [...prev, ...newMembers]);
    setMemberModalOpen(false);
    setToast(`成功添加 ${newMembers.length} 名成员`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleChange = (record: ProjectMember, type: string) => {
    setCurrentMember(record);
    setChangeType(type);
    setChangeModalOpen(true);
  };

  const handleDelete = (member: ProjectMember) => {
    const coreTypes = ['项目经理', '合同经办人', '项目创建人'];
    if (coreTypes.includes(member.memberType)) {
      setToast(`核心成员（${member.memberType}）不允许删除`);
      setTimeout(() => setToast(''), 3000);
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    setToast(`成员 ${member.name} 已移除`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmitChange = (data: { newMemberId: string; reason: string }) => {
    console.log('Change request:', { ...data, type: changeType, oldMember: currentMember });
    setChangeModalOpen(false);
    setToast('变更申请已提交，进入审批流程');
    setTimeout(() => setToast(''), 3000);
  };

  const renderPagination = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

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

        {/* 面包屑返回 */}
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/project-prepare/project-management')} className="flex items-center gap-1 text-sm text-steel-500 hover:text-primary-600 transition-colors cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
            返回项目列表
          </button>
        </div>

        <div>
          <h1 className="text-lg font-semibold text-steel-900">项目成员列表</h1>
          <p className="text-xs text-steel-400 mt-0.5">{projectName}（{approvalNo}）</p>
        </div>

        {/* 查询 + 功能按钮 */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md">
              <div className="w-4 h-4 flex items-center justify-center text-steel-400"><i className="ri-search-line text-sm" /></div>
              <input
                type="text"
                value={searchKey}
                onChange={(e) => { setSearchKey(e.target.value); setCurrentPage(1); }}
                className={inputCls}
                placeholder="输入姓名搜索..."
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMemberModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-add-line" /></div>
                添加成员
              </button>
            </div>
          </div>
        </div>

        {/* 数据列表 */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">成员列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 条</span>
              {selectedIds.size > 0 && (
                <span className="text-xs text-primary-600 font-medium">已选 {selectedIds.size} 项</span>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1200px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={paginated.length > 0 && paginated.every((m) => selectedIds.has(m.id))}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-steel-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">成员姓名</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">工号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">部门</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">手机号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">成员类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">关联合同</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: '260px', borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-file-list-3-line text-2xl text-steel-300" /></div>
                        <p className="text-sm text-steel-400">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((member, idx) => {
                    const typeCfg = memberTypeConfig[member.memberType] || memberTypeConfig['项目成员'];
                    return (
                      <tr key={member.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(member.id)}
                            onChange={() => toggleSelect(member.id)}
                            className="w-4 h-4 rounded border-steel-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-steel-800 font-medium whitespace-nowrap">{member.name}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 font-mono">{member.employeeNo}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{member.department}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{member.phone}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeCfg.color}`}>
                            <div className="w-3 h-3 flex items-center justify-center"><i className={typeCfg.icon} /></div>
                            {member.memberType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-600 max-w-xs"><span className="line-clamp-1">{member.relatedContract}</span></td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          {member.status === '正常' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">正常</span>
                          ) : member.status === '审批中' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">审批中</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">已移除</span>
                          )}
                        </td>
                        <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {CHANGEABLE_TYPES.includes(member.memberType) && (
                              <button
                                onClick={() => handleChange(member, member.memberType)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 border border-primary-200 rounded hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap"
                              >
                                <div className="w-3 h-3 flex items-center justify-center"><i className="ri-user-settings-line" /></div>
                                变更
                              </button>
                            )}
                            <button onClick={() => handleDelete(member)} className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap">
                              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-delete-bin-line" /></div>
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 分页 */}
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
              {renderPagination().map((page, i) =>
                page === '...' ? (
                  <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-steel-400 text-sm">...</span>
                ) : (
                  <button key={page} onClick={() => setCurrentPage(page as number)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${currentPage === page ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'}`} style={currentPage === page ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}>{page}</button>
                )
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="ri-arrow-right-s-line" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">末页</button>
            </div>
          </div>
        )}
      </div>

      <MemberModal
        open={memberModalOpen}
        projectName={projectName}
        approvalNo={approvalNo}
        onClose={() => setMemberModalOpen(false)}
        onSubmit={handleAddMembers}
      />

      <ChangeModal
        open={changeModalOpen}
        changeType={changeType}
        projectName={projectName}
        approvalNo={approvalNo}
        currentMember={currentMember}
        onClose={() => setChangeModalOpen(false)}
        onSubmit={handleSubmitChange}
      />
    </Layout>
  );
}