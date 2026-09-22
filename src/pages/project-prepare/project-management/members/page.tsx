import { Fragment, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';
import MemberModal from '../components/MemberModal';
import ChangeModal from '../components/ChangeModal';
import GroupModal from '../components/GroupModal';
import {
  addProjectGroup,
  employees,
  getMemberChangeApproval,
  getProjectGroups,
  getProjectMembers,
  memberTypeConfig,
  setProjectMembers,
  type ProjectGroup,
  type ProjectMember,
} from '@/mocks/projectPrepareMocks';

export default function MemberListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const projectName = searchParams.get('projectName') || '';
  const approvalNo = searchParams.get('approvalNo') || '';

  const [members, setMembers] = useState<ProjectMember[]>(() => getProjectMembers(projectId));
  const [groups, setGroups] = useState<ProjectGroup[]>(() => getProjectGroups(projectId));
  const [searchKey, setSearchKey] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [changeType, setChangeType] = useState<string>('项目负责人变更');
  const [currentMember, setCurrentMember] = useState<ProjectMember | null>(null);
  const [approvalMember, setApprovalMember] = useState<ProjectMember | null>(null);

  const CHANGEABLE_TYPES = [
    '项目负责人', '合同经办人',
    '论证经办人', '工程需求资料经办人',
    '合同预付款申请资料经办人', '合同预结算报支资料经办人', '合同质保金报支资料经办人',
  ];

  const filtered = useMemo(() => {
    let list = [...members];
    const priority: Record<string, number> = {
      项目负责人: 0, 合同经办人: 1, 项目创建人: 2, 招标经理: 3, 采购经理: 4, 项目成员: 5,
    };
    list.sort((a, b) => (priority[a.memberType] ?? 99) - (priority[b.memberType] ?? 99));
    if (searchKey.trim()) {
      const kw = searchKey.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(kw) || m.groupName.toLowerCase().includes(kw));
    }
    return list;
  }, [members, searchKey]);

  const groupedSections = useMemo(() => {
    const map = new Map<string, { group: ProjectGroup | null; members: ProjectMember[] }>();
    groups.forEach((g) => map.set(g.id, { group: g, members: [] }));
    filtered.forEach((m) => {
      if (!map.has(m.groupId)) {
        map.set(m.groupId, {
          group: { id: m.groupId, projectId, name: m.groupName || '未分组', workDuty: '', createDate: '' },
          members: [],
        });
      }
      map.get(m.groupId)!.members.push(m);
    });
    return [...map.values()].filter((s) => s.members.length > 0 || !searchKey.trim());
  }, [filtered, groups, projectId, searchKey]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const syncMembers = (next: ProjectMember[]) => {
    setMembers(next);
    setProjectMembers(projectId, next);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const handleAddGroup = (data: { name: string; workDuty: string }) => {
    if (groups.some((g) => g.name === data.name)) {
      showToast('小组名称已存在');
      return;
    }
    const group = addProjectGroup(projectId, data);
    setGroups(getProjectGroups(projectId));
    setGroupModalOpen(false);
    showToast(`小组「${group.name}」已添加`);
  };

  const handleAddMembers = (data: {
    members: { employeeId: string; memberType: string; groupId: string; workDuty: string }[];
  }) => {
    const newMembers = data.members.map((m, i) => {
      const emp = employees.find((e) => e.id === m.employeeId)!;
      const group = groups.find((g) => g.id === m.groupId);
      return {
        id: `pm_${projectId}_${Date.now()}_${i}`,
        projectId,
        name: emp.name,
        employeeNo: emp.employeeNo,
        department: emp.department,
        phone: emp.phone,
        memberType: m.memberType as ProjectMember['memberType'],
        relatedContract: '-',
        status: '审批中' as const,
        createDate: new Date().toISOString().split('T')[0],
        groupId: m.groupId,
        groupName: group?.name || '',
        workDuty: m.workDuty,
      };
    });
    syncMembers([...members, ...newMembers]);
    setMemberModalOpen(false);
    showToast(`成功添加 ${newMembers.length} 名成员`);
  };

  const handleChange = (record: ProjectMember, type: string) => {
    setCurrentMember(record);
    setChangeType(type);
    setChangeModalOpen(true);
  };

  const handleDelete = (member: ProjectMember) => {
    const coreTypes = ['项目负责人', '合同经办人', '项目创建人'];
    if (coreTypes.includes(member.memberType)) {
      showToast(`核心成员（${member.memberType}）不允许删除`);
      return;
    }
    syncMembers(members.filter((m) => m.id !== member.id));
    showToast(`成员 ${member.name} 已移除`);
  };

  const handleSubmitChange = (data: { newMemberId: string; reason: string }) => {
    console.log('Change request:', { ...data, type: changeType, oldMember: currentMember });
    if (currentMember) {
      syncMembers(members.map((m) => (m.id === currentMember.id ? { ...m, status: '审批中' as const } : m)));
    }
    setChangeModalOpen(false);
    showToast('变更申请已提交，进入审批流程');
  };

  const approvalData = approvalMember ? getMemberChangeApproval(approvalMember) : null;
  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  return (
    <Layout>
      <div className="space-y-4">
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <i className="ri-check-line" />
            {toast}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate('/project-prepare/project-management')} className="flex items-center gap-1 text-sm text-steel-500 hover:text-primary-600 cursor-pointer">
            <i className="ri-arrow-left-line" />
            返回项目列表
          </button>
        </div>

        <div>
          <h1 className="text-lg font-semibold text-steel-900">项目成员列表</h1>
          <p className="text-xs text-steel-400 mt-0.5">{projectName}（{approvalNo}）</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md">
              <i className="ri-search-line text-steel-400 text-sm" />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className={inputCls}
                placeholder="输入姓名或小组名称搜索..."
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('正在导出项目小组成立通知…')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 bg-white rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                title="导出项目小组成立通知"
              >
                <i className="ri-file-download-line" />
                导出通知
              </button>
              <button
                type="button"
                onClick={() => setGroupModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-sky-700 border border-sky-200 bg-sky-50 rounded-md hover:bg-sky-100 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-group-line" />
                添加小组
              </button>
              <button
                type="button"
                onClick={() => setMemberModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                <i className="ri-add-line" />
                添加成员
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">成员列表</span>
              <span className="text-xs text-steel-400">共 {filtered.length} 人 · {groups.length} 个小组</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 1280 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 w-12" />
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">成员姓名</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">工号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">部门</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">手机号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">成员类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">工作职责</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">关联合同</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">变更状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: 220, borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {groupedSections.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center text-sm text-steel-400">暂无数据</td>
                  </tr>
                ) : (
                  groupedSections.map((section) => (
                    <Fragment key={section.group?.id || 'none'}>
                      <tr className="bg-sky-50/70">
                        <td colSpan={11} className="px-4 py-2.5">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700">
                              <i className="ri-team-line" />
                              {section.group?.name || '未分组'}
                            </span>
                            <span className="text-xs text-sky-600">{section.members.length} 人</span>
                            {section.group?.workDuty && (
                              <span className="text-xs text-steel-500">职责：{section.group.workDuty}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {section.members.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="px-4 py-3 text-xs text-steel-400">该小组暂无成员</td>
                        </tr>
                      ) : (
                        section.members.map((member, idx) => {
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
                              <td className="px-4 py-3 text-sm text-steel-500">{idx + 1}</td>
                              <td className="px-4 py-3 text-sm text-steel-800 font-medium whitespace-nowrap">{member.name}</td>
                              <td className="px-4 py-3 text-sm text-steel-600 font-mono">{member.employeeNo}</td>
                              <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{member.department}</td>
                              <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{member.phone}</td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeCfg.color}`}>
                                  <i className={typeCfg.icon} />
                                  {member.memberType}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-steel-600 max-w-[220px]">
                                <span className="line-clamp-2" title={member.workDuty}>{member.workDuty || '—'}</span>
                              </td>
                              <td className="px-4 py-3 text-sm text-steel-600 max-w-xs">
                                <span className="line-clamp-1">{member.relatedContract}</span>
                              </td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setApprovalMember(member)}
                                  className="cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-primary-300 rounded-full transition"
                                  title="点击查看审批详情"
                                >
                                  {member.status === '正常' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">正常</span>
                                  ) : member.status === '审批中' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">审批中</span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">已移除</span>
                                  )}
                                </button>
                              </td>
                              <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                  {CHANGEABLE_TYPES.includes(member.memberType) && (
                                    <button
                                      type="button"
                                      onClick={() => handleChange(member, member.memberType)}
                                      className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 border border-primary-200 rounded hover:bg-primary-50 cursor-pointer whitespace-nowrap"
                                    >
                                      <i className="ri-user-settings-line" />
                                      变更
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(member)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap"
                                  >
                                    <i className="ri-delete-bin-line" />
                                    删除
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <GroupModal
        open={groupModalOpen}
        projectName={projectName}
        onClose={() => setGroupModalOpen(false)}
        onSubmit={handleAddGroup}
      />

      <MemberModal
        open={memberModalOpen}
        projectName={projectName}
        approvalNo={approvalNo}
        groups={groups}
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

      {approvalMember && approvalData && (
        <ApprovalResultModal
          onClose={() => setApprovalMember(null)}
          title="变更状态 · 审批详情"
          processName={approvalData.processName}
          status={approvalData.status}
          nodes={approvalData.nodes}
          logs={approvalData.logs}
        />
      )}
    </Layout>
  );
}
