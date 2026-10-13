import { useMemo, useState } from 'react';
import Layout from '@/components/feature/Layout';
import { FormField, formInputCls, formRow2Cls } from '@/components/feature/FormLayout';
import { employees } from '@/mocks/projectPrepareMocks';
import {
  deleteLeadershipGroup,
  deleteLeadershipMember,
  getLeadershipGroups,
  leadershipRoleStyle,
  saveLeadershipGroup,
  saveLeadershipMember,
  type LeadershipGroupConfig,
  type LeadershipMemberSlot,
  type LeadershipRole,
} from '@/mocks/leadershipTeamConfigMocks';

function emptyMember(role: LeadershipRole): LeadershipMemberSlot {
  return {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    employeeId: '',
    name: '',
    department: '',
    role,
    duty: '',
  };
}

function emptyGroup(sortOrder: number): LeadershipGroupConfig {
  return {
    id: `ltg_${Date.now()}`,
    name: '',
    workDuty: '',
    sortOrder,
    status: '启用',
    members: [emptyMember('组长')],
    updater: '管理员',
    updatedAt: '',
  };
}

function avatarColor(name: string) {
  const colors = ['#1d4ed8', '#0f766e', '#b45309', '#be123c', '#6d28d9', '#0369a1'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i) * (i + 1)) % colors.length;
  return colors[h];
}

export default function LeadershipTeamConfigPage() {
  const [groups, setGroups] = useState<LeadershipGroupConfig[]>(() => getLeadershipGroups());
  const [filterStatus, setFilterStatus] = useState<'全部' | '启用' | '停用'>('全部');
  const [keyword, setKeyword] = useState('');
  const [toast, setToast] = useState('');
  const [groupModal, setGroupModal] = useState<LeadershipGroupConfig | null>(null);
  const [memberModal, setMemberModal] = useState<{ groupId: string; member: LeadershipMemberSlot } | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      if (filterStatus !== '全部' && g.status !== filterStatus) return false;
      if (keyword.trim()) {
        const kw = keyword.trim();
        const hitName = g.name.includes(kw) || g.workDuty.includes(kw);
        const hitMember = g.members.some((m) => m.name.includes(kw) || m.duty.includes(kw));
        if (!hitName && !hitMember) return false;
      }
      return true;
    });
  }, [groups, filterStatus, keyword]);

  const display = filtered.length > 0 ? filtered : groups;
  const root = display[0];
  const children = display.slice(1);

  const stats = useMemo(() => {
    const enabled = groups.filter((g) => g.status === '启用').length;
    const people = groups.reduce((n, g) => n + g.members.length, 0);
    return { groupCount: groups.length, enabled, people };
  }, [groups]);

  return (
    <Layout>
      <div className="space-y-4">
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <i className="ri-check-line" />
            {toast}
          </div>
        )}

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">领导小组配置</h1>
            <p className="text-xs text-steel-400 mt-0.5">以组织架构形式维护项目领导小组：小组、职责与组员</p>
          </div>
          <button
            type="button"
            onClick={() => setGroupModal(emptyGroup(groups.length + 1))}
            className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            <i className="ri-add-line mr-1" />
            新增小组
          </button>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
            <FormField label="搜索">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className={formInputCls()}
                placeholder="小组名称 / 职责 / 成员"
              />
            </FormField>
            <FormField label="状态">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className={formInputCls() + ' cursor-pointer'}
              >
                <option value="全部">全部</option>
                <option value="启用">启用</option>
                <option value="停用">停用</option>
              </select>
            </FormField>
            <div className="flex items-end gap-4 pb-1 text-xs text-steel-500">
              <span>小组 <b className="text-steel-800 text-sm">{stats.groupCount}</b></span>
              <span>启用 <b className="text-emerald-600 text-sm">{stats.enabled}</b></span>
              <span>成员 <b className="text-primary-600 text-sm">{stats.people}</b></span>
            </div>
          </div>
          {filtered.length === 0 && (
            <p className="text-xs text-amber-700 mt-3 bg-amber-50 border border-amber-100 rounded px-3 py-2">
              未匹配到筛选结果，已回退展示全部 {groups.length} 个小组
            </p>
          )}
        </div>

        {/* 组织架构画布 */}
        <div
          className="rounded-xl border border-steel-200 overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at top, #eff6ff 0%, #f8fafc 42%, #f1f5f9 100%)',
          }}
        >
          <div className="px-5 py-3 border-b border-steel-100/80 flex items-center justify-between bg-white/60 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                <i className="ri-organization-chart text-sm" />
              </div>
              <div>
                <p className="text-sm font-semibold text-steel-800">项目领导小组组织架构</p>
                <p className="text-[11px] text-steel-400">自上而下：领导小组 → 专业小组 → 组员</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto px-6 py-8">
            {!root ? (
              <div className="text-center py-16 text-sm text-steel-400">暂无小组，请点击「新增小组」</div>
            ) : (
              <div className="min-w-max mx-auto flex flex-col items-center">
                {/* 顶层节点 */}
                <OrgGroupCard
                  group={root}
                  featured
                  onEditGroup={() => setGroupModal({ ...root, members: root.members.map((m) => ({ ...m })) })}
                  onDeleteGroup={() => {
                    setGroups(deleteLeadershipGroup(root.id));
                    showToast('小组已删除');
                  }}
                  onAddMember={(role) => setMemberModal({ groupId: root.id, member: emptyMember(role) })}
                  onEditMember={(m) => setMemberModal({ groupId: root.id, member: { ...m } })}
                  onDeleteMember={(m) => {
                    if (m.role === '组长' && root.members.filter((x) => x.role === '组长').length <= 1) {
                      showToast('每个小组至少保留一名组长');
                      return;
                    }
                    setGroups(deleteLeadershipMember(root.id, m.id));
                    showToast('组员已删除');
                  }}
                />

                {children.length > 0 && (
                  <>
                    {/* 竖线 */}
                    <div className="w-px h-8 bg-steel-300" />
                    {/* 横梁 */}
                    <div className="relative w-full flex justify-center" style={{ minWidth: children.length * 280 }}>
                      <div
                        className="absolute top-0 h-px bg-steel-300"
                        style={{
                          left: `calc(100% / ${children.length} / 2)`,
                          right: `calc(100% / ${children.length} / 2)`,
                        }}
                      />
                      <div className="flex w-full">
                        {children.map((g) => (
                          <div key={g.id} className="flex-1 flex flex-col items-center px-3" style={{ minWidth: 260 }}>
                            <div className="w-px h-8 bg-steel-300" />
                            <OrgGroupCard
                              group={g}
                              onEditGroup={() => setGroupModal({ ...g, members: g.members.map((m) => ({ ...m })) })}
                              onDeleteGroup={() => {
                                setGroups(deleteLeadershipGroup(g.id));
                                showToast('小组已删除');
                              }}
                              onAddMember={(role) => setMemberModal({ groupId: g.id, member: emptyMember(role) })}
                              onEditMember={(m) => setMemberModal({ groupId: g.id, member: { ...m } })}
                              onDeleteMember={(m) => {
                                if (m.role === '组长' && g.members.filter((x) => x.role === '组长').length <= 1) {
                                  showToast('每个小组至少保留一名组长');
                                  return;
                                }
                                setGroups(deleteLeadershipMember(g.id, m.id));
                                showToast('组员已删除');
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {groupModal && (
        <GroupModal
          group={groupModal}
          onClose={() => setGroupModal(null)}
          onSave={(next) => {
            setGroups(saveLeadershipGroup(next));
            setGroupModal(null);
            showToast(groupModal.updatedAt ? '小组信息已更新' : '小组已新增');
          }}
        />
      )}

      {memberModal && (
        <MemberModal
          member={memberModal.member}
          onClose={() => setMemberModal(null)}
          onSave={(next) => {
            setGroups(saveLeadershipMember(memberModal.groupId, next));
            setMemberModal(null);
            showToast(memberModal.member.name ? '组员信息已更新' : '组员已新增');
          }}
        />
      )}
    </Layout>
  );
}

function OrgGroupCard({
  group,
  featured,
  onEditGroup,
  onDeleteGroup,
  onAddMember,
  onEditMember,
  onDeleteMember,
}: {
  group: LeadershipGroupConfig;
  featured?: boolean;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onAddMember: (role: LeadershipRole) => void;
  onEditMember: (m: LeadershipMemberSlot) => void;
  onDeleteMember: (m: LeadershipMemberSlot) => void;
}) {
  const leaders = group.members.filter((m) => m.role === '组长');
  const deputies = group.members.filter((m) => m.role === '副组长');
  const staff = group.members.filter((m) => m.role === '组员');
  const disabled = group.status === '停用';

  return (
    <div
      className={`w-[248px] rounded-xl border bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
        featured ? 'border-primary-300 ring-2 ring-primary-100' : disabled ? 'border-steel-200 opacity-75' : 'border-steel-200'
      }`}
    >
      {/* 小组头 */}
      <div
        className="px-3.5 py-3 relative"
        style={{
          background: featured
            ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
            : disabled
              ? 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)'
              : 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-semibold text-white truncate">{group.name || '未命名小组'}</h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border bg-white/15 text-white border-white/30`}>
                {group.status}
              </span>
            </div>
            <p className="text-[11px] text-white/85 mt-1.5 leading-relaxed line-clamp-2" title={group.workDuty}>
              {group.workDuty || '暂无职责说明'}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button type="button" title="编辑小组" onClick={onEditGroup} className="w-6 h-6 flex items-center justify-center rounded text-white/90 hover:bg-white/20 cursor-pointer">
              <i className="ri-edit-line text-xs" />
            </button>
            <button type="button" title="删除小组" onClick={onDeleteGroup} className="w-6 h-6 flex items-center justify-center rounded text-white/90 hover:bg-white/20 cursor-pointer">
              <i className="ri-delete-bin-line text-xs" />
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-white/75">
          <span><i className="ri-team-line mr-0.5" />{group.members.length} 人</span>
          <span>排序 {group.sortOrder}</span>
        </div>
      </div>

      {/* 成员区 */}
      <div className="px-3 py-2.5 space-y-2.5 max-h-[320px] overflow-y-auto">
        <MemberBlock
          title="组长"
          role="组长"
          members={leaders}
          onAdd={() => onAddMember('组长')}
          canAdd={leaders.length === 0}
          onEdit={onEditMember}
          onDelete={onDeleteMember}
        />
        <MemberBlock
          title="副组长"
          role="副组长"
          members={deputies}
          onAdd={() => onAddMember('副组长')}
          canAdd
          onEdit={onEditMember}
          onDelete={onDeleteMember}
        />
        <MemberBlock
          title="组员"
          role="组员"
          members={staff}
          onAdd={() => onAddMember('组员')}
          canAdd
          onEdit={onEditMember}
          onDelete={onDeleteMember}
        />
      </div>
    </div>
  );
}

function MemberBlock({
  title,
  role,
  members,
  canAdd,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string;
  role: LeadershipRole;
  members: LeadershipMemberSlot[];
  canAdd: boolean;
  onAdd: () => void;
  onEdit: (m: LeadershipMemberSlot) => void;
  onDelete: (m: LeadershipMemberSlot) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${leadershipRoleStyle[role]}`}>{title}</span>
        {canAdd && (
          <button type="button" onClick={onAdd} className="text-[10px] text-primary-600 hover:text-primary-700 cursor-pointer">
            <i className="ri-add-line" /> 新增
          </button>
        )}
      </div>
      {members.length === 0 ? (
        <p className="text-[11px] text-steel-400 py-1 pl-1">暂无{title}</p>
      ) : (
        <div className="space-y-1.5">
          {members.map((m) => (
            <div
              key={m.id}
              className="group flex items-start gap-2 rounded-lg border border-steel-100 bg-slate-50/80 px-2 py-1.5 hover:border-primary-200 hover:bg-primary-50/40 transition-colors"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0 mt-0.5"
                style={{ backgroundColor: avatarColor(m.name || '?') }}
              >
                {(m.name || '?').slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-steel-800 truncate">{m.name || '未选人员'}</span>
                </div>
                <p className="text-[10px] text-steel-400 truncate">{m.department || '—'}</p>
                <p className="text-[10px] text-steel-500 mt-0.5 line-clamp-2 leading-snug" title={m.duty}>{m.duty || '暂无职责'}</p>
              </div>
              <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" title="编辑" onClick={() => onEdit(m)} className="w-5 h-5 flex items-center justify-center text-steel-400 hover:text-primary-600 cursor-pointer">
                  <i className="ri-pencil-line text-[11px]" />
                </button>
                <button type="button" title="删除" onClick={() => onDelete(m)} className="w-5 h-5 flex items-center justify-center text-steel-400 hover:text-red-500 cursor-pointer">
                  <i className="ri-close-line text-[11px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupModal({
  group,
  onClose,
  onSave,
}: {
  group: LeadershipGroupConfig;
  onClose: () => void;
  onSave: (g: LeadershipGroupConfig) => void;
}) {
  const [name, setName] = useState(group.name);
  const [workDuty, setWorkDuty] = useState(group.workDuty);
  const [sortOrder, setSortOrder] = useState(group.sortOrder);
  const [status, setStatus] = useState(group.status);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOk = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = '请输入小组名称';
    if (!workDuty.trim()) e.workDuty = '请输入小组职责';
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({
      ...group,
      name: name.trim(),
      workDuty: workDuty.trim(),
      sortOrder: Number(sortOrder) || 1,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[520px] max-w-[95vw]">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-steel-800">{group.updatedAt ? '编辑小组' : '新增小组'}</h3>
          <button type="button" onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <FormField label="小组名称" required error={errors.name} fullWidth>
            <input value={name} onChange={(e) => setName(e.target.value)} className={formInputCls(errors.name)} placeholder="如：领导小组、工程技术组" maxLength={40} />
          </FormField>
          <FormField label="小组职责" required error={errors.workDuty} topAlign fullWidth>
            <textarea rows={3} value={workDuty} onChange={(e) => setWorkDuty(e.target.value)} className={formInputCls(errors.workDuty) + ' resize-none'} placeholder="请描述小组工作职责" maxLength={200} />
          </FormField>
          <div className={formRow2Cls}>
            <FormField label="排序">
              <input type="number" min={1} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={formInputCls()} />
            </FormField>
            <FormField label="状态">
              <select value={status} onChange={(e) => setStatus(e.target.value as LeadershipGroupConfig['status'])} className={formInputCls() + ' cursor-pointer'}>
                <option value="启用">启用</option>
                <option value="停用">停用</option>
              </select>
            </FormField>
          </div>
          {!group.updatedAt && (
            <p className="text-xs text-steel-400 bg-slate-50 border border-steel-100 rounded-md px-3 py-2">
              新增后将默认创建一名空缺组长席位，可在架构卡片中继续维护组员。
            </p>
          )}
        </div>
        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button type="button" onClick={handleOk} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>保存</button>
        </div>
      </div>
    </div>
  );
}

function MemberModal({
  member,
  onClose,
  onSave,
}: {
  member: LeadershipMemberSlot;
  onClose: () => void;
  onSave: (m: LeadershipMemberSlot) => void;
}) {
  const [role, setRole] = useState(member.role);
  const [employeeId, setEmployeeId] = useState(member.employeeId);
  const [duty, setDuty] = useState(member.duty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const emp = employees.find((x) => x.id === employeeId);

  const handleOk = () => {
    const e: Record<string, string> = {};
    if (!employeeId) e.employeeId = '请选择人员';
    if (!duty.trim()) e.duty = '请填写成员职责';
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({
      ...member,
      role,
      employeeId,
      name: emp?.name || '',
      department: emp?.department || '',
      duty: duty.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[520px] max-w-[95vw]">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-steel-800">{member.name ? '编辑组员' : '新增组员'}</h3>
          <button type="button" onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className={formRow2Cls}>
            <FormField label="角色" required>
              <select value={role} onChange={(e) => setRole(e.target.value as LeadershipRole)} className={formInputCls() + ' cursor-pointer'}>
                <option value="组长">组长</option>
                <option value="副组长">副组长</option>
                <option value="组员">组员</option>
              </select>
            </FormField>
            <FormField label="工号">
              <input readOnly value={emp?.employeeNo || '—'} className={formInputCls('', { readonly: true })} />
            </FormField>
          </div>
          <FormField label="人员" required error={errors.employeeId} fullWidth>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className={formInputCls(errors.employeeId) + ' cursor-pointer'}
            >
              <option value="">请选择人员</option>
              {employees.map((x) => (
                <option key={x.id} value={x.id}>{x.name}（{x.department}）</option>
              ))}
            </select>
          </FormField>
          <FormField label="成员职责" required error={errors.duty} topAlign fullWidth>
            <textarea
              rows={3}
              maxLength={100}
              value={duty}
              onChange={(e) => setDuty(e.target.value.slice(0, 100))}
              className={formInputCls(errors.duty) + ' resize-none'}
              placeholder="请填写该成员在小组中的工作职责"
            />
          </FormField>
        </div>
        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button type="button" onClick={handleOk} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>保存</button>
        </div>
      </div>
    </div>
  );
}
