import { employees } from './projectPrepareMocks';

export type LeadershipGroupStatus = '启用' | '停用';

export type LeadershipRole = '组长' | '副组长' | '组员';

export interface LeadershipMemberSlot {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  role: LeadershipRole;
  duty: string;
}

export interface LeadershipGroupConfig {
  id: string;
  name: string;
  workDuty: string;
  sortOrder: number;
  status: LeadershipGroupStatus;
  members: LeadershipMemberSlot[];
  updater: string;
  updatedAt: string;
}

const STORAGE_KEY = 'pms_leadership_team_config_v2';
const LEGACY_KEYS = ['pms_leadership_team_config_v1'];

function emp(i: number) {
  return employees[i % employees.length];
}

function slot(id: string, empIdx: number, role: LeadershipRole, duty: string): LeadershipMemberSlot {
  const e = emp(empIdx);
  return { id, employeeId: e.id, name: e.name, department: e.department, role, duty };
}

const seed: LeadershipGroupConfig[] = [
  {
    id: 'ltg_001',
    name: '领导小组',
    workDuty: '负责项目重大事项决策、资源协调与总体督导，对项目目标达成负总责',
    sortOrder: 1,
    status: '启用',
    members: [
      slot('m1', 0, '组长', '主持领导小组工作，审定重大方案与关键节点'),
      slot('m2', 1, '副组长', '协助组长协调各部门，督办阶段目标落实'),
      slot('m3', 2, '副组长', '分管安全环保与外部手续办理'),
      slot('m4', 3, '组员', '对接建设单位及政府主管部门'),
      slot('m5', 4, '组员', '跟踪投资计划与资金到位情况'),
    ],
    updater: '管理员',
    updatedAt: '2026-03-10 09:20:00',
  },
  {
    id: 'ltg_002',
    name: '项目综合组',
    workDuty: '负责项目日常统筹、计划编制、会议组织、资料归集与信息报送',
    sortOrder: 2,
    status: '启用',
    members: [
      slot('m6', 5, '组长', '组织综合组日常工作，汇总进度与问题清单'),
      slot('m7', 6, '副组长', '负责会议纪要、公文流转与档案收集'),
      slot('m8', 7, '组员', '编制周报月报，维护项目台账'),
      slot('m9', 8, '组员', '对接各专业组，跟踪待办闭环'),
    ],
    updater: '管理员',
    updatedAt: '2026-03-08 14:15:00',
  },
  {
    id: 'ltg_003',
    name: '工程技术组',
    workDuty: '负责技术方案论证、设计联络、图纸会审、变更审核与现场技术支持',
    sortOrder: 3,
    status: '启用',
    members: [
      slot('m10', 9, '组长', '把关技术方案与设计成果，组织图纸会审'),
      slot('m11', 10, '副组长', '负责专业接口协调与设计变更初审'),
      slot('m12', 11, '组员', '土建专业现场技术对接'),
      slot('m13', 12, '组员', '电气自动化专业现场技术对接'),
    ],
    updater: '管理员',
    updatedAt: '2026-03-05 11:00:00',
  },
  {
    id: 'ltg_004',
    name: '安全环保组',
    workDuty: '负责安全三同时、环保合规、现场安全督查与应急管理',
    sortOrder: 4,
    status: '启用',
    members: [
      slot('m14', 13, '组长', '统筹安全环保手续及现场监督检查'),
      slot('m15', 14, '副组长', '组织隐患排查与应急演练'),
      slot('m16', 15, '组员', '现场安全巡查与记录'),
      slot('m17', 16, '组员', '环保设施同步建设跟踪'),
    ],
    updater: '管理员',
    updatedAt: '2026-03-02 16:40:00',
  },
  {
    id: 'ltg_005',
    name: '质量监督组',
    workDuty: '负责质量目标分解、过程检验、验收组织与质量问题闭环',
    sortOrder: 5,
    status: '启用',
    members: [
      slot('m18', 17, '组长', '组织质量验收与不合格品处置'),
      slot('m19', 18, '副组长', '编制质量检验计划并跟踪执行'),
      slot('m20', 19, '组员', '现场质量旁站与资料核查'),
    ],
    updater: '管理员',
    updatedAt: '2026-02-26 10:05:00',
  },
  {
    id: 'ltg_006',
    name: '招标采购组',
    workDuty: '负责招标文件组织、采购进度、供方对接与合同技术附件',
    sortOrder: 6,
    status: '启用',
    members: [
      slot('m21', 0, '组长', '组织招标采购计划与开评标安排'),
      slot('m22', 4, '组员', '编制技术规格书并参与评标'),
      slot('m23', 8, '组员', '跟踪供货进度与到货验收'),
    ],
    updater: '管理员',
    updatedAt: '2026-02-20 09:30:00',
  },
  {
    id: 'ltg_007',
    name: '投资控制组',
    workDuty: '负责概预算管控、变更费用审核、资金计划与结算配合',
    sortOrder: 7,
    status: '停用',
    members: [
      slot('m24', 2, '组长', '审核重大变更费用，控制投资目标'),
      slot('m25', 6, '副组长', '编制资金使用计划并跟踪支付'),
      slot('m26', 11, '组员', '核算工程量与结算资料整理'),
    ],
    updater: '管理员',
    updatedAt: '2026-02-12 15:18:00',
  },
  {
    id: 'ltg_008',
    name: '竣工验收组',
    workDuty: '负责专项验收组织、竣工资料汇编、遗留问题销项与移交',
    sortOrder: 8,
    status: '停用',
    members: [
      slot('m27', 3, '组长', '组织竣工验收会议并出具验收结论'),
      slot('m28', 7, '组员', '汇编竣工档案并办理移交'),
    ],
    updater: '管理员',
    updatedAt: '2026-01-28 13:50:00',
  },
];

function load(): LeadershipGroupConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LeadershipGroupConfig[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (!legacy) continue;
      const parsed = JSON.parse(legacy) as LeadershipGroupConfig[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        persist(parsed);
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  persist(seed);
  return [...seed];
}

export function saveLeadershipMember(
  groupId: string,
  member: LeadershipMemberSlot,
): LeadershipGroupConfig[] {
  const list = load();
  const g = list.find((x) => x.id === groupId);
  if (!g) return getLeadershipGroups();
  const idx = g.members.findIndex((m) => m.id === member.id);
  if (idx >= 0) g.members[idx] = member;
  else g.members.push(member);
  g.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  g.updater = '管理员';
  persist(list);
  return getLeadershipGroups();
}

export function deleteLeadershipMember(groupId: string, memberId: string): LeadershipGroupConfig[] {
  const list = load();
  const g = list.find((x) => x.id === groupId);
  if (!g) return getLeadershipGroups();
  g.members = g.members.filter((m) => m.id !== memberId);
  g.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  g.updater = '管理员';
  persist(list);
  return getLeadershipGroups();
}

function persist(list: LeadershipGroupConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getLeadershipGroups(): LeadershipGroupConfig[] {
  return load().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function saveLeadershipGroup(group: LeadershipGroupConfig): LeadershipGroupConfig[] {
  const list = load();
  const next = { ...group, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19), updater: '管理员' };
  const idx = list.findIndex((g) => g.id === group.id);
  if (idx >= 0) list[idx] = next;
  else list.push(next);
  persist(list);
  return getLeadershipGroups();
}

export function deleteLeadershipGroup(id: string): LeadershipGroupConfig[] {
  persist(load().filter((g) => g.id !== id));
  return getLeadershipGroups();
}

export const leadershipStatusStyle: Record<LeadershipGroupStatus, string> = {
  启用: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  停用: 'bg-slate-100 text-slate-500 border-slate-200',
};

export const leadershipRoleStyle: Record<LeadershipRole, string> = {
  组长: 'bg-violet-50 text-violet-700 border-violet-200',
  副组长: 'bg-sky-50 text-sky-700 border-sky-200',
  组员: 'bg-slate-50 text-slate-600 border-slate-200',
};
