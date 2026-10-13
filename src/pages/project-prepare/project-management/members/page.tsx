import { Fragment, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import ApprovalResultModal from '@/components/feature/ApprovalResultModal';
import MemberModal from '../components/MemberModal';
import ChangeModal from '../components/ChangeModal';
import GroupModal from '../components/GroupModal';
import TeamApprovalRecordModal from '../components/TeamApprovalRecordModal';
import PresentApprovalModal from '../components/PresentApprovalModal';
import {
  addProjectGroup,
  employees,
  exportMemberImportTemplate,
  exportMembersToExcel,
  formatRelatedContract,
  getMemberChangeApproval,
  getMemberTeamApprovalRecords,
  getMemberTeamMeta,
  getProjectById,
  getProjectGroups,
  getProjectMembers,
  isCoreMemberType,
  memberTeamStatusStyle,
  memberTypeConfig,
  parseMemberImportText,
  presentMemberTeam,
  setProjectMembers,
  unlockMemberTeamForEdit,
  type MemberTeamApprovalRecord,
  type MemberTeamMeta,
  type ProjectGroup,
  type ProjectMember,
} from '@/mocks/projectPrepareMocks';

export default function MemberListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const projectFromUrl = getProjectById(projectId);
  const projectName = searchParams.get('projectName') || projectFromUrl?.name || '';
  const approvalNo = searchParams.get('approvalNo') || projectFromUrl?.approvalNo || '';
  const importRef = useRef<HTMLInputElement>(null);

  const [members, setMembers] = useState<ProjectMember[]>(() => getProjectMembers(projectId));
  const [groups, setGroups] = useState<ProjectGroup[]>(() => getProjectGroups(projectId));
  const [teamMeta, setTeamMeta] = useState<MemberTeamMeta>(() => getMemberTeamMeta(projectId));
  const [approvalRecords, setApprovalRecords] = useState<MemberTeamApprovalRecord[]>(() =>
    getMemberTeamApprovalRecords(projectId),
  );
  const [searchKey, setSearchKey] = useState('');
  const [toast, setToast] = useState('');

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [changeType, setChangeType] = useState<string>('项目负责人');
  const [currentMember, setCurrentMember] = useState<ProjectMember | null>(null);
  const [approvalMember, setApprovalMember] = useState<ProjectMember | null>(null);
  const [approvalRecordOpen, setApprovalRecordOpen] = useState(false);
  const [presentOpen, setPresentOpen] = useState(false);

  const isLocked = teamMeta.status === '审批中';
  const statusStyle = memberTeamStatusStyle[teamMeta.status];

  const filtered = useMemo(() => {
    let list = [...members];
    if (searchKey.trim()) {
      const kw = searchKey.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(kw) || m.groupName.toLowerCase().includes(kw) || m.memberType.includes(kw));
    }
    return list;
  }, [members, searchKey]);

  const coreMembers = useMemo(() => {
    const order: Record<string, number> = { 项目负责人: 0, 项目申报人: 1, 合同经办人: 2 };
    return filtered
      .filter((m) => isCoreMemberType(m.memberType))
      .sort((a, b) => (order[a.memberType] ?? 9) - (order[b.memberType] ?? 9));
  }, [filtered]);

  const groupedSections = useMemo(() => {
    const rest = filtered.filter((m) => !isCoreMemberType(m.memberType));
    const map = new Map<string, { group: ProjectGroup | null; members: ProjectMember[] }>();
    groups.forEach((g) => map.set(g.id, { group: g, members: [] }));
    rest.forEach((m) => {
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

  const refreshApproval = () => {
    setApprovalRecords(getMemberTeamApprovalRecords(projectId));
    setTeamMeta(getMemberTeamMeta(projectId));
  };

  const syncMembers = (next: ProjectMember[]) => {
    setMembers(next);
    setProjectMembers(projectId, next);
  };

  const ensureEditable = (actionLabel: string) => {
    if (isLocked) {
      showToast(`审批进行中，暂不可${actionLabel}`);
      return false;
    }
    if (teamMeta.status === '已定版') {
      unlockMemberTeamForEdit(projectId);
      refreshApproval();
    }
    return true;
  };

  const handleAddGroup = (data: { name: string; workDuty: string }) => {
    if (!ensureEditable('添加小组')) return;
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
    if (!ensureEditable('添加成员')) return;
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
        relatedContractNo: '',
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

  const handleChange = (record: ProjectMember) => {
    if (isLocked) {
      showToast('审批进行中，暂不可变更');
      return;
    }
    if (teamMeta.status === '已定版') {
      unlockMemberTeamForEdit(projectId);
      refreshApproval();
    }
    setCurrentMember(record);
    setChangeType(record.memberType);
    setChangeModalOpen(true);
  };

  const handleDelete = (member: ProjectMember) => {
    if (isCoreMemberType(member.memberType)) {
      showToast(`${member.memberType}不允许删除`);
      return;
    }
    if (!ensureEditable('删除')) return;
    syncMembers(members.filter((m) => m.id !== member.id));
    showToast(`成员 ${member.name} 已移除`);
  };

  const handleSubmitChange = (data: { newMemberId: string; reason: string }) => {
    const emp = employees.find((e) => e.id === data.newMemberId);
    if (currentMember && emp) {
      syncMembers(members.map((m) => (
        m.id === currentMember.id
          ? { ...m, name: emp.name, employeeNo: emp.employeeNo, department: emp.department, phone: emp.phone, status: '审批中' as const }
          : m
      )));
    }
    setChangeModalOpen(false);
    showToast('变更申请已提交，进入审批流程');
  };

  const handlePresent = (remark: string, attachmentNames: string[]) => {
    if (members.length === 0) {
      showToast('请先完善项目成员后再呈核');
      return;
    }
    presentMemberTeam(projectId, remark, '管理员', attachmentNames);
    refreshApproval();
    setPresentOpen(false);
    showToast('已呈核，审批中不可编辑或变更成员');
  };

  const fallbackProject = projectFromUrl || {
    id: projectId,
    name: projectName,
    approvalNo,
    constructionUnit: '',
    projectType: '',
    majorType: '技改' as const,
    minorType: '',
    manager: '',
    building: '',
    createDate: '',
    needApprovalPermit: '是',
  };

  const handleExport = () => {
    exportMembersToExcel(fallbackProject, members, groups);
    showToast('成员列表已导出为 Excel');
  };

  const handleExportTemplate = () => {
    exportMemberImportTemplate();
    showToast('已下载成员导入模板');
  };

  const handleImportFile = (file: File) => {
    if (!ensureEditable('导入')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const { rows, error } = parseMemberImportText(text);
      if (error) {
        showToast(error);
        return;
      }
      const today = new Date().toISOString().split('T')[0];
      const next = [...members];
      let added = 0;
      let skippedCore = 0;
      rows.forEach((row, i) => {
        if (isCoreMemberType(row.memberType)) {
          skippedCore += 1;
          return;
        }
        if (next.some((m) => m.employeeNo && row.employeeNo && m.employeeNo === row.employeeNo && m.memberType === row.memberType)) {
          return;
        }
        const emp = employees.find((e) => e.employeeNo === row.employeeNo || e.name === row.name);
        const group = groups.find((g) => g.name === row.groupName) || groups[0];
        next.push({
          id: `pm_${projectId}_imp_${Date.now()}_${i}`,
          projectId,
          name: row.name || emp?.name || '',
          employeeNo: row.employeeNo || emp?.employeeNo || '',
          department: row.department || emp?.department || '',
          phone: row.phone || emp?.phone || '',
          memberType: row.memberType,
          relatedContract: row.relatedContract || '-',
          relatedContractNo: row.relatedContractNo || '',
          status: '审批中',
          createDate: today,
          groupId: group?.id || '',
          groupName: group?.name || row.groupName || '',
          workDuty: row.workDuty,
        });
        added += 1;
      });
      syncMembers(next);
      if (added === 0 && skippedCore > 0) {
        showToast('项目负责人、项目申报人、合同经办人已默认存在，未重复导入；其余行无有效数据');
      } else if (added === 0) {
        showToast('没有新增成员（可能与现有工号重复）');
      } else {
        showToast(`成功导入 ${added} 名成员${skippedCore ? `，已跳过 ${skippedCore} 条核心成员` : ''}`);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const approvalData = approvalMember ? getMemberChangeApproval(approvalMember) : null;
  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  const renderMemberRow = (member: ProjectMember, idx: number, hideDelete: boolean) => {
    const typeCfg = memberTypeConfig[member.memberType] || memberTypeConfig['项目成员'];
    return (
      <tr key={member.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
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
          <span className="line-clamp-2" title={formatRelatedContract(member)}>{formatRelatedContract(member)}</span>
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
            <button
              type="button"
              onClick={() => handleChange(member)}
              disabled={isLocked}
              title={isLocked ? '审批中不可变更' : '变更'}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded whitespace-nowrap ${
                isLocked
                  ? 'text-steel-400 border border-steel-200 bg-slate-50 cursor-not-allowed'
                  : 'text-primary-600 border border-primary-200 hover:bg-primary-50 cursor-pointer'
              }`}
            >
              <i className="ri-user-settings-line" />
              变更
            </button>
            {!hideDelete && (
              <button
                type="button"
                onClick={() => handleDelete(member)}
                disabled={isLocked}
                title={isLocked ? '审批中不可删除' : '删除'}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded whitespace-nowrap ${
                  isLocked
                    ? 'text-steel-400 border border-steel-200 bg-slate-50 cursor-not-allowed'
                    : 'text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer'
                }`}
              >
                <i className="ri-delete-bin-line" />
                删除
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const btnOutline = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap border';

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
          <p className="text-xs text-steel-400 mt-0.5">项目成员组建与领导审批定版</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-5 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-steel-500">项目名称</span>
                <span className="text-sm font-semibold text-steel-800">{projectName || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-steel-500">立项号</span>
                <span className="text-sm font-medium text-steel-700">{approvalNo || '—'}</span>
              </div>
              {projectFromUrl && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-steel-500">项目分类</span>
                    <span className="text-sm text-steel-700">{projectFromUrl.majorType} · {projectFromUrl.minorType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-steel-500">是否报批报建</span>
                    <span className="text-sm text-steel-700">{projectFromUrl.needApprovalPermit}</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-steel-500">审批状态</span>
                <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                  {teamMeta.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (teamMeta.status === '审批中') {
                    showToast('已在审批中，请查看操作日志');
                    return;
                  }
                  if (teamMeta.status === '已定版') {
                    showToast('已定版，调整成员后请重新呈核');
                  }
                  setPresentOpen(true);
                }}
                className={`${btnOutline} text-violet-700 bg-violet-50 border-violet-200 hover:bg-violet-100`}
              >
                <i className="ri-send-plane-line" />
                呈核
              </button>
              <button
                type="button"
                onClick={() => {
                  setApprovalRecords(getMemberTeamApprovalRecords(projectId));
                  setApprovalRecordOpen(true);
                }}
                className={`${btnOutline} text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100`}
              >
                <i className="ri-file-list-3-line" />
                操作日志
              </button>
            </div>
          </div>
        </div>

        {isLocked && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-amber-800">
            当前成员组建正在审批中，暂不可编辑、修改或变更成员。如需调整，请待审批结束后再操作。
          </div>
        )}

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100 gap-3 flex-wrap">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <span className="text-sm text-steel-700 font-medium whitespace-nowrap">成员列表</span>
              <span className="text-xs text-steel-400 whitespace-nowrap">共 {filtered.length} 人 · {groups.length} 个小组</span>
              <div className="flex items-center gap-2 flex-1 min-w-[180px] max-w-xs">
                <i className="ri-search-line text-steel-400 text-sm" />
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className={inputCls}
                  placeholder="姓名 / 小组 / 成员类型"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => { if (ensureEditable('添加小组')) setGroupModalOpen(true); }}
                className={`${btnOutline} ${isLocked ? 'text-steel-400 bg-slate-50 border-steel-200 cursor-not-allowed' : 'text-sky-700 bg-sky-50 border-sky-200 hover:bg-sky-100'}`}
              >
                <i className="ri-group-line" />
                添加小组
              </button>
              <button
                type="button"
                onClick={() => { if (ensureEditable('导入')) importRef.current?.click(); }}
                className={`${btnOutline} ${isLocked ? 'text-steel-400 bg-slate-50 border-steel-200 cursor-not-allowed' : 'text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100'}`}
              >
                <i className="ri-upload-2-line" />
                导入
              </button>
              <button
                type="button"
                onClick={handleExport}
                className={`${btnOutline} text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100`}
              >
                <i className="ri-file-excel-2-line" />
                导出
              </button>
              <button
                type="button"
                onClick={handleExportTemplate}
                className={`${btnOutline} text-steel-600 bg-slate-50 border-steel-200 hover:bg-slate-100`}
              >
                <i className="ri-download-2-line" />
                导出模板
              </button>
              <button
                type="button"
                onClick={() => { if (ensureEditable('添加成员')) setMemberModalOpen(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md whitespace-nowrap"
                style={{ background: isLocked ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', cursor: isLocked ? 'not-allowed' : 'pointer' }}
              >
                <i className="ri-add-line" />
                添加成员
              </button>
              <input
                ref={importRef}
                type="file"
                accept=".csv,.xls,.xlsx,.txt"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportFile(file);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 1200 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">序号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">成员姓名</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">工号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">部门</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">手机号</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">成员类型</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">工作职责</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">关联合同</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">变更状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap sticky right-0 bg-slate-50 text-center" style={{ minWidth: 180, borderLeft: '1px solid #e8edf3' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {coreMembers.length === 0 && groupedSections.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center text-sm text-steel-400">暂无数据</td>
                  </tr>
                ) : (
                  <>
                    {coreMembers.map((member, idx) => renderMemberRow(member, idx, true))}
                    {groupedSections.map((section) => (
                      <Fragment key={section.group?.id || 'none'}>
                        <tr className="bg-sky-50/70">
                          <td colSpan={10} className="px-4 py-2.5">
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
                            <td colSpan={10} className="px-4 py-3 text-xs text-steel-400">该小组暂无成员</td>
                          </tr>
                        ) : (
                          section.members.map((member, idx) => renderMemberRow(member, idx, false))
                        )}
                      </Fragment>
                    ))}
                  </>
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

      <PresentApprovalModal
        open={presentOpen}
        projectName={projectName}
        approvalNo={approvalNo}
        memberCount={members.length}
        groupCount={groups.length}
        onClose={() => setPresentOpen(false)}
        onSubmit={handlePresent}
      />

      {approvalRecordOpen && (
        <TeamApprovalRecordModal
          projectId={projectId}
          records={approvalRecords}
          onClose={() => setApprovalRecordOpen(false)}
        />
      )}

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
