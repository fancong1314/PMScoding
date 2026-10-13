export interface ProjectItem {
  id: string;
  name: string;
  approvalNo: string;
  constructionUnit: string;
  projectType: string;
  /** 项目大类：新建/技改/营缮/零固 */
  majorType: ProjectMajorType;
  /** 项目小类 */
  minorType: string;
  manager: string;
  building: string;
  createDate: string;
  /** 是否报批报建（与立项申请字段同步） */
  needApprovalPermit: '是' | '否';
}

/** 项目大类 */
export type ProjectMajorType = '新建' | '技改' | '营缮' | '零固';

/** 项目组成员组建审批状态 */
export type MemberTeamStatus = '待完善' | '待呈核' | '审批中' | '已定版' | '已驳回';

/** 默认成员配置中的小组（含默认组长） */
export interface DefaultMemberGroupSlot {
  name: string;
  workDuty: string;
  leaderEmployeeId: string;
  leaderName: string;
}

/** 默认成员配置方案：大类多选 + 小类多选 → 一套默认小组/组长 */
export interface DefaultMemberConfigScheme {
  id: string;
  name: string;
  /** 适用项目大类（多选） */
  majorTypes: ProjectMajorType[];
  minorTypes: string[];
  groups: DefaultMemberGroupSlot[];
  updater: string;
  updatedAt: string;
  enabled: boolean;
}

/** 项目成员组建操作日志 */
export interface MemberTeamApprovalRecord {
  id: string;
  projectId: string;
  /** 操作类型：完善通知 / 呈核 / 审批通过 / 审批驳回 / 修改成员 等 */
  operationType: string;
  operator: string;
  operationTime: string;
  remark: string;
  result?: '通过' | '驳回' | '';
  /** 关联审批流程 ID（有呈核/审批类操作时生成，可点击查看） */
  processId?: string;
  /** 审批流程节点快照 */
  processNodes?: { name: string; approver: string; status: string }[];
}

/** 项目成员组建元数据 */
export interface MemberTeamMeta {
  projectId: string;
  status: MemberTeamStatus;
  /** 完善成员通知是否已发送 */
  notifySent: boolean;
  notifySentAt?: string;
  lastPresentAt?: string;
  finalizedAt?: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  name: string;
  employeeNo: string;
  department: string;
  phone: string;
  memberType: '项目负责人' | '项目申报人' | '合同经办人' | '项目创建人' | '项目成员' | '招标经理' | '采购经理' | '论证经办人' | '工程需求资料经办人' | '合同预付款申请资料经办人' | '合同预结算报支资料经办人' | '合同质保金报支资料经办人';
  relatedContract: string;
  /** 关联合同编号（合同经办人展示用） */
  relatedContractNo?: string;
  status: '正常' | '审批中' | '已移除';
  createDate: string;
  /** 所属小组 */
  groupId: string;
  groupName: string;
  /** 工作职责（≤100字） */
  workDuty: string;
}

/** 项目小组 */
export interface ProjectGroup {
  id: string;
  projectId: string;
  name: string;
  /** 小组工作职责 */
  workDuty: string;
  createDate: string;
}

export interface MaterialCategory {
  key: string;
  label: string;
  icon: string;
  items: MaterialItem[];
}

export interface MaterialItem {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'pending' | 'expired' | 'warning';
  uploadDate?: string;
  uploader?: string;
  fileName?: string;
  children?: MaterialItem[];
}

export interface Employee {
  id: string;
  name: string;
  employeeNo: string;
  department: string;
  phone: string;
  email: string;
}

const projectTypes = ['基建工程', '设备更新', '技术改造', '环保治理', '信息化项目', '安全整改'];
const buildings = ['1#高炉', '2#转炉', '3#连铸', '轧钢车间', '原料场', '焦化区', '烧结区', '能源中心', '污水处理厂', '配电室'];
const constructionUnits = ['南京钢铁集团有限公司', '江苏钢铁建设集团', '中冶天工集团有限公司', '上海宝冶集团有限公司', '江苏省建工集团有限公司'];
const managers = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟', '周鹏', '吴昊', '郑明', '孙伟'];

export const projectMajorTypes: ProjectMajorType[] = ['新建', '技改', '营缮', '零固'];

/** 大类对应可选小类（默认成员配置按大类+小类组合） */
export const projectMinorTypesByMajor: Record<ProjectMajorType, string[]> = {
  新建: ['信息化', '智能化', '土建工程', '电力工程', '环保工程'],
  技改: ['品种质量', '安全环保', '装备升级', '节能降耗', '智能制造'],
  营缮: ['设备营缮', '设施维修', '管道维修'],
  零固: ['设备更新', '信息化建设', '安全设施'],
};

const projectNames = [
  '炼铁厂1#高炉环保升级改造工程',
  '炼钢厂2#转炉设备更新项目',
  '轧钢车间自动化控制系统升级',
  '原料场智能化改造工程项目',
  '焦化区环保设施新建工程',
  '烧结区脱硫脱硝改造项目',
  '能源中心余热发电系统工程',
  '污水处理厂扩建改造工程',
  '配电室高低压设备更新项目',
  '办公楼信息化基础设施建设项目',
  '厂区道路硬化及管网改造工程',
  '安全防护设施完善升级项目',
  '仓储物流中心建设工程',
  '环保监测站房建设项目',
  '消防系统升级改造工程',
];

const projectMajorMinorSeed: { majorType: ProjectMajorType; minorType: string }[] = [
  { majorType: '技改', minorType: '安全环保' },
  { majorType: '零固', minorType: '设备更新' },
  { majorType: '技改', minorType: '装备升级' },
  { majorType: '新建', minorType: '智能化' },
  { majorType: '新建', minorType: '环保工程' },
  { majorType: '技改', minorType: '安全环保' },
  { majorType: '技改', minorType: '节能降耗' },
  { majorType: '新建', minorType: '土建工程' },
  { majorType: '零固', minorType: '设备更新' },
  { majorType: '新建', minorType: '信息化' },
  { majorType: '营缮', minorType: '设施维修' },
  { majorType: '技改', minorType: '安全环保' },
  { majorType: '新建', minorType: '土建工程' },
  { majorType: '新建', minorType: '环保工程' },
  { majorType: '技改', minorType: '安全环保' },
];

export const projects: ProjectItem[] = Array.from({ length: 15 }, (_, i) => {
  const seq = String(i + 1).padStart(3, '0');
  const mm = projectMajorMinorSeed[i];
  return {
    id: `proj_${seq}`,
    name: projectNames[i],
    approvalNo: `LX-2026-${seq}`,
    constructionUnit: constructionUnits[i % constructionUnits.length],
    projectType: projectTypes[i % projectTypes.length],
    majorType: mm.majorType,
    minorType: mm.minorType,
    manager: managers[i % managers.length],
    building: buildings[i % buildings.length],
    createDate: `2026-0${1 + (i % 5)}-${String(1 + (i % 28)).padStart(2, '0')}`,
    needApprovalPermit: mm.majorType === '零固' && i % 3 !== 0 ? '否' : (i % 5 === 0 ? '否' : '是'),
  };
});

const departments = ['工程管理部', '质量安全部', '设备管理部', '生产运营部', '技术部', '财务部', '人力资源部', '基建部', '安全环保部', '采购部'];
const memberTypes: ProjectMember['memberType'][] = ['项目成员', '招标经理', '采购经理'];

/** 默认置顶、不属于任何小组、仅允许变更不可删除 */
export const CORE_MEMBER_TYPES: ProjectMember['memberType'][] = ['项目负责人', '项目申报人', '合同经办人'];

export function isCoreMemberType(type: string): boolean {
  return (CORE_MEMBER_TYPES as string[]).includes(type) || type === '项目提报人';
}

export function normalizeMemberTypeLabel(type: string): ProjectMember['memberType'] {
  if (type === '项目提报人') return '项目申报人';
  return type as ProjectMember['memberType'];
}

export function formatRelatedContract(member: ProjectMember): string {
  const name = member.relatedContract && member.relatedContract !== '-' ? member.relatedContract : '';
  const no = member.relatedContractNo?.trim() || '';
  if (member.memberType === '合同经办人') {
    if (no && name) return `${no} ${name}`;
    return name || no || '—';
  }
  return name || '—';
}
const contractNames = [
  '土建工程施工合同', '钢结构安装合同', '设备安装调试合同', '电气自动化施工合同',
  '管道工程施工合同', '防腐保温工程合同', '土方开挖工程合同', '装饰装修工程合同',
];
const employeeNames = [
  '王建国', '李志强', '张伟明', '刘卫东', '陈建华', '赵鹏', '孙伟', '周明', '吴昊', '郑强',
  '钱程', '冯亮', '黄磊', '马超', '董洋', '袁磊', '卢斌', '蒋文', '蔡明', '贾涛',
];
const groupSeedDefs = [
  { name: '领导小组', workDuty: '负责现场施工组织、进度协调及质量安全管控' },
  { name: '项目办', workDuty: '负责合同经办、招标采购及资料报支' },
  { name: '土建小组', workDuty: '负责技术方案论证、设计对接与变更审核' },
];
const dutySeedPool = [
  '统筹项目整体推进与内外协调',
  '负责合同签订、变更及履约跟踪',
  '对接设计联络与施工图审核',
  '跟进现场施工与进度反馈',
  '组织招标文件编制与开评标',
  '负责设备材料采购与供货对接',
  '配合论证材料整理与报送',
  '收集工程需求资料并归档',
];

export const employees: Employee[] = Array.from({ length: 20 }, (_, i) => ({
  id: `emp_${String(i + 1).padStart(3, '0')}`,
  name: employeeNames[i],
  employeeNo: `NG${String(10001 + i)}`,
  department: departments[i % departments.length],
  phone: `138${String(10000000 + i * 1234).padStart(8, '0')}`,
  email: `${employeeNames[i]}@ngsteel.com`,
}));

const groupStore = new Map<string, ProjectGroup[]>();
const memberStore = new Map<string, ProjectMember[]>();

function ensureGroups(projectId: string): ProjectGroup[] {
  if (!groupStore.has(projectId)) {
    groupStore.set(
      projectId,
      groupSeedDefs.map((g, i) => ({
        id: `grp_${projectId}_${i + 1}`,
        projectId,
        name: g.name,
        workDuty: g.workDuty,
        createDate: `2026-01-${String(5 + i).padStart(2, '0')}`,
      })),
    );
  }
  return groupStore.get(projectId)!;
}

export function getProjectGroups(projectId: string): ProjectGroup[] {
  return [...ensureGroups(projectId)];
}

export function addProjectGroup(
  projectId: string,
  data: { name: string; workDuty: string },
): ProjectGroup {
  const list = ensureGroups(projectId);
  const group: ProjectGroup = {
    id: `grp_${projectId}_${Date.now()}`,
    projectId,
    name: data.name.trim(),
    workDuty: data.workDuty.trim().slice(0, 100),
    createDate: new Date().toISOString().split('T')[0],
  };
  list.push(group);
  return group;
}

export function getProjectMembers(projectId: string): ProjectMember[] {
  if (!memberStore.has(projectId)) {
    const groups = ensureGroups(projectId);
    const project = projects.find((p) => p.id === projectId);
    const extraCount = 3 + (parseInt(projectId.split('_')[1] || '1', 10) % 6);
    const contractName = contractNames[parseInt(projectId.split('_')[1] || '1', 10) % contractNames.length];
    const contractNo = `HT-${project?.approvalNo || 'LX-2026-000'}-001`;
    const coreDuty: Record<string, string> = {
      项目负责人: '统筹项目整体推进与内外协调',
      项目申报人: '负责项目立项申报、资料报送与进度跟踪',
      合同经办人: '负责合同签订、变更及履约跟踪',
    };
    const coreMembers: ProjectMember[] = CORE_MEMBER_TYPES.map((type, i) => {
      const emp = employees[i % employees.length];
      const isHandler = type === '合同经办人';
      return {
        id: `pm_${projectId}_core_${String(i + 1).padStart(3, '0')}`,
        projectId,
        name: emp.name,
        employeeNo: emp.employeeNo,
        department: emp.department,
        phone: emp.phone,
        memberType: type,
        relatedContract: isHandler ? contractName : '-',
        relatedContractNo: isHandler ? contractNo : '',
        status: '正常',
        createDate: project?.createDate || '2026-01-10',
        groupId: '',
        groupName: '',
        workDuty: coreDuty[type],
      };
    });
    const extra: ProjectMember[] = Array.from({ length: extraCount }, (_, i) => {
      const emp = employees[(i + 3) % employees.length];
      const group = groups[i % groups.length];
      return {
        id: `pm_${projectId}_${String(i + 1).padStart(3, '0')}`,
        projectId,
        name: emp.name,
        employeeNo: emp.employeeNo,
        department: emp.department,
        phone: emp.phone,
        memberType: memberTypes[i % memberTypes.length],
        relatedContract: '-',
        relatedContractNo: '',
        status: (i === 0 ? '审批中' : '正常') as ProjectMember['status'],
        createDate: `2026-0${1 + (i % 5)}-${String(10 + (i % 20)).padStart(2, '0')}`,
        groupId: group.id,
        groupName: group.name,
        workDuty: dutySeedPool[i % dutySeedPool.length],
      };
    });
    memberStore.set(projectId, [...coreMembers, ...extra]);
  }
  return [...memberStore.get(projectId)!];
}

export function setProjectMembers(projectId: string, members: ProjectMember[]) {
  memberStore.set(projectId, members);
}

/** 成员变更/新增审批可视化节点 */
export function getMemberChangeApproval(member: ProjectMember): {
  processName: string;
  status: string;
  nodes: { id: string; seq: number; name: string; approver: string; status: string; action: string; operateTime: string; opinion: string }[];
  logs: { time: string; operator: string; action: string; opinion: string }[];
} {
  const isPending = member.status === '审批中';
  const isRemoved = member.status === '已移除';
  const processName = isPending
    ? `${member.memberType}变更审批 · ${member.name}`
    : isRemoved
      ? `${member.memberType}移除审批 · ${member.name}`
      : `${member.memberType}任职确认 · ${member.name}`;
  const overall = isPending ? '进行中' : isRemoved ? '已通过' : '已完成';
  const nodes = isPending
    ? [
        { id: 'n1', seq: 1, name: '项目负责人提交', approver: member.name, status: '已通过', action: '提交变更', operateTime: `${member.createDate} 09:20:00`, opinion: '申请调整成员职责/人选' },
        { id: 'n2', seq: 2, name: '工程管理部审核', approver: '李建国', status: '审核中', action: '待审核', operateTime: '', opinion: '' },
        { id: 'n3', seq: 3, name: '分管领导核准', approver: '赵卫东', status: '待处理', action: '待处理', operateTime: '', opinion: '' },
      ]
    : [
        { id: 'n1', seq: 1, name: '项目负责人提交', approver: member.name, status: '已通过', action: '提交', operateTime: `${member.createDate} 09:20:00`, opinion: '确认任职信息' },
        { id: 'n2', seq: 2, name: '工程管理部审核', approver: '李建国', status: '已通过', action: '通过', operateTime: `${member.createDate} 11:05:00`, opinion: '人员配置合理' },
        { id: 'n3', seq: 3, name: '分管领导核准', approver: '赵卫东', status: '已通过', action: '核准', operateTime: `${member.createDate} 15:40:00`, opinion: '同意' },
      ];
  const logs = nodes
    .filter((n) => n.operateTime)
    .map((n) => ({ time: n.operateTime, operator: n.approver, action: n.action, opinion: n.opinion || '—' }));
  return { processName, status: overall, nodes, logs };
}

export const materialCategories: MaterialCategory[] = [
  {
    key: 'design',
    label: '设计资料',
    icon: 'ri-pencil-ruler-2-line',
    items: [
      {
        id: 'd1',
        name: '初步设计',
        type: '设计阶段',
        status: 'completed',
        uploadDate: '2026-01-15',
        uploader: '张设计',
        fileName: '初步设计说明书_v1.2.pdf',
      },
      {
        id: 'd2',
        name: '施工图设计',
        type: '设计阶段',
        status: 'completed',
        uploadDate: '2026-02-20',
        uploader: '李工',
        fileName: '施工图纸全套.zip',
        children: [
          { id: 'd2-1', name: '结构施工图', type: '子项', status: 'completed', uploadDate: '2026-02-18', uploader: '李工', fileName: '结构施工图_v1.0.pdf' },
          { id: 'd2-2', name: '电气施工图', type: '子项', status: 'completed', uploadDate: '2026-02-19', uploader: '李工', fileName: '电气施工图_v1.0.pdf' },
          { id: 'd2-3', name: '给排水施工图', type: '子项', status: 'pending' },
          { id: 'd2-4', name: '暖通施工图', type: '子项', status: 'warning' },
        ],
      },
      {
        id: 'd3',
        name: '设计变更',
        type: '变更文件',
        status: 'completed',
        uploadDate: '2026-03-05',
        uploader: '王工',
        fileName: '设计变更通知单_20260305.pdf',
      },
      {
        id: 'd4',
        name: '竣工图设计',
        type: '竣工文件',
        status: 'pending',
        children: [
          { id: 'd4-1', name: '建筑竣工图', type: '子项', status: 'pending' },
          { id: 'd4-2', name: '结构竣工图', type: '子项', status: 'warning' },
          { id: 'd4-3', name: '电气竣工图', type: '子项', status: 'pending' },
          { id: 'd4-4', name: '管道竣工图', type: '子项', status: 'pending' },
        ],
      },
    ],
  },
  {
    key: 'other-service',
    label: '其他服务类资料',
    icon: 'ri-folder-chart-line',
    items: [
      {
        id: 'os1',
        name: '勘察报告',
        type: '勘察文件',
        status: 'completed',
        uploadDate: '2025-11-10',
        uploader: '王勘察',
        fileName: '地质勘察报告_终版.pdf',
        children: [
          { id: 'os1-1', name: '工程地质勘察报告', type: '子项', status: 'completed', uploadDate: '2025-11-10', uploader: '王勘察', fileName: '工程地质勘察报告.pdf' },
          { id: 'os1-2', name: '水文地质勘察报告', type: '子项', status: 'completed', uploadDate: '2025-11-20', uploader: '刘勘察', fileName: '水文地质勘察报告.pdf' },
          { id: 'os1-3', name: '地下管线探测报告', type: '子项', status: 'pending' },
        ],
      },
      {
        id: 'os2',
        name: '安全评价报告',
        type: '安评文件',
        status: 'completed',
        uploadDate: '2025-12-05',
        uploader: '赵安全',
        fileName: '安全预评价报告.pdf',
      },
      {
        id: 'os3',
        name: '环境影响评价',
        type: '环评文件',
        status: 'completed',
        uploadDate: '2025-12-15',
        uploader: '钱环保',
        fileName: '环评报告_批复版.pdf',
      },
      {
        id: 'os4',
        name: '职业健康评价',
        type: '职业健康评价',
        status: 'pending',
      },
      {
        id: 'os5',
        name: '其它',
        type: '其他文件',
        status: 'warning',
      },
    ],
  },
];

export const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  completed: { label: '已完成', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: 'ri-check-double-line' },
  pending: { label: '待上传', color: 'bg-sky-50 text-sky-600 border border-sky-200', icon: 'ri-time-line' },
  expired: { label: '已过期', color: 'bg-red-50 text-red-600 border border-red-200', icon: 'ri-error-warning-line' },
  warning: { label: '空缺提醒', color: 'bg-amber-50 text-amber-600 border border-amber-200', icon: 'ri-alert-line' },
};

export const memberTypeConfig: Record<string, { color: string; icon: string }> = {
  '项目负责人': { color: 'bg-violet-50 text-violet-700 border border-violet-200', icon: 'ri-user-star-line' },
  '项目申报人': { color: 'bg-indigo-50 text-indigo-700 border border-indigo-200', icon: 'ri-user-follow-line' },
  '合同经办人': { color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: 'ri-file-text-line' },
  '项目创建人': { color: 'bg-teal-50 text-teal-700 border border-teal-200', icon: 'ri-user-add-line' },
  '项目成员': { color: 'bg-slate-100 text-slate-600 border border-slate-200', icon: 'ri-user-line' },
  '招标经理': { color: 'bg-orange-50 text-orange-700 border border-orange-200', icon: 'ri-auction-line' },
  '采购经理': { color: 'bg-pink-50 text-pink-700 border border-pink-200', icon: 'ri-shopping-cart-line' },
  '论证经办人': { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: 'ri-file-search-line' },
  '工程需求资料经办人': { color: 'bg-cyan-50 text-cyan-700 border border-cyan-200', icon: 'ri-folder-line' },
  '合同预付款申请资料经办人': { color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: 'ri-money-cny-box-line' },
  '合同预结算报支资料经办人': { color: 'bg-lime-50 text-lime-700 border border-lime-200', icon: 'ri-bill-line' },
  '合同质保金报支资料经办人': { color: 'bg-rose-50 text-rose-700 border border-rose-200', icon: 'ri-shield-line' },
};

export const memberTeamStatusStyle: Record<MemberTeamStatus, { bg: string; text: string; border: string }> = {
  待完善: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  待呈核: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  审批中: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  已定版: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  已驳回: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const DEFAULT_MEMBER_CONFIG_KEY = 'pms_default_member_config_v2';
const TEAM_META_KEY = 'pms_member_team_meta_v1';
const TEAM_APPROVAL_KEY = 'pms_member_team_approval_v3';

const defaultMemberConfigSeed: DefaultMemberConfigScheme[] = [
  {
    id: 'dmc_001',
    name: '新建·信息化/智能化默认配置',
    majorTypes: ['新建'],
    minorTypes: ['信息化', '智能化'],
    groups: [
      { name: '领导小组', workDuty: '统筹项目决策、重大事项审批与资源协调', leaderEmployeeId: 'emp_001', leaderName: '王建国' },
      { name: '项目办', workDuty: '负责合同、招标、资料报支与日常协调', leaderEmployeeId: 'emp_002', leaderName: '李志强' },
      { name: '信息化实施组', workDuty: '负责系统建设、联调测试与上线运维', leaderEmployeeId: 'emp_003', leaderName: '张伟明' },
    ],
    updater: '管理员',
    updatedAt: '2026-03-01 10:20:00',
    enabled: true,
  },
  {
    id: 'dmc_002',
    name: '技改·品种质量/安全环保/装备升级默认配置',
    majorTypes: ['技改'],
    minorTypes: ['品种质量', '安全环保', '装备升级'],
    groups: [
      { name: '领导小组', workDuty: '负责技改方案决策与进度督办', leaderEmployeeId: 'emp_001', leaderName: '王建国' },
      { name: '项目办', workDuty: '负责合同经办、招标采购及资料报支', leaderEmployeeId: 'emp_004', leaderName: '刘卫东' },
      { name: '工艺技术组', workDuty: '负责技术方案论证、设计对接与变更审核', leaderEmployeeId: 'emp_005', leaderName: '陈建华' },
      { name: '安全环保组', workDuty: '负责安全三同时、环保合规与现场督查', leaderEmployeeId: 'emp_006', leaderName: '赵鹏' },
    ],
    updater: '管理员',
    updatedAt: '2026-03-05 14:30:00',
    enabled: true,
  },
  {
    id: 'dmc_003',
    name: '营缮·设备营缮/设施维修默认配置',
    majorTypes: ['营缮'],
    minorTypes: ['设备营缮', '设施维修'],
    groups: [
      { name: '领导小组', workDuty: '统筹营缮计划与现场组织', leaderEmployeeId: 'emp_007', leaderName: '孙伟' },
      { name: '项目办', workDuty: '负责合同与资料报支', leaderEmployeeId: 'emp_002', leaderName: '李志强' },
      { name: '施工协调组', workDuty: '负责现场施工协调与进度反馈', leaderEmployeeId: 'emp_008', leaderName: '周明' },
    ],
    updater: '管理员',
    updatedAt: '2026-02-18 09:15:00',
    enabled: true,
  },
  {
    id: 'dmc_004',
    name: '零固·设备更新/信息化建设默认配置',
    majorTypes: ['零固'],
    minorTypes: ['设备更新', '信息化建设'],
    groups: [
      { name: '领导小组', workDuty: '负责购置决策与验收把关', leaderEmployeeId: 'emp_001', leaderName: '王建国' },
      { name: '项目办', workDuty: '负责采购对接与合同资料', leaderEmployeeId: 'emp_009', leaderName: '吴昊' },
    ],
    updater: '管理员',
    updatedAt: '2026-02-20 11:00:00',
    enabled: true,
  },
  {
    id: 'dmc_005',
    name: '新建+技改·节能/智能制造通用配置（停用示例）',
    majorTypes: ['新建', '技改'],
    minorTypes: ['节能降耗', '智能制造', '智能化'],
    groups: [
      { name: '领导小组', workDuty: '统筹节能与智能制造技改推进', leaderEmployeeId: 'emp_003', leaderName: '张伟明' },
      { name: '项目办', workDuty: '负责合同与招标', leaderEmployeeId: 'emp_004', leaderName: '刘卫东' },
    ],
    updater: '管理员',
    updatedAt: '2026-01-12 16:40:00',
    enabled: false,
  },
];

const teamStatusSeed: MemberTeamStatus[] = ['待完善', '待呈核', '审批中', '已定版', '已驳回', '待完善', '待呈核', '审批中', '已定版', '已驳回', '待完善', '待呈核', '审批中', '已定版', '待完善'];

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureDefaultConfigs(): DefaultMemberConfigScheme[] {
  const cached = loadJson<DefaultMemberConfigScheme[] | null>(DEFAULT_MEMBER_CONFIG_KEY, null);
  if (cached && cached.length > 0) return cached;
  saveJson(DEFAULT_MEMBER_CONFIG_KEY, defaultMemberConfigSeed);
  return [...defaultMemberConfigSeed];
}

export function getDefaultMemberConfigs(): DefaultMemberConfigScheme[] {
  return ensureDefaultConfigs();
}

export function saveDefaultMemberConfig(scheme: DefaultMemberConfigScheme): DefaultMemberConfigScheme[] {
  const list = ensureDefaultConfigs();
  const idx = list.findIndex((s) => s.id === scheme.id);
  const next = { ...scheme, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) };
  if (idx >= 0) list[idx] = next;
  else list.unshift(next);
  saveJson(DEFAULT_MEMBER_CONFIG_KEY, list);
  return [...list];
}

export function deleteDefaultMemberConfig(id: string): DefaultMemberConfigScheme[] {
  const list = ensureDefaultConfigs().filter((s) => s.id !== id);
  saveJson(DEFAULT_MEMBER_CONFIG_KEY, list);
  return list;
}

export function findDefaultConfigForProject(majorType: ProjectMajorType, minorType: string): DefaultMemberConfigScheme | undefined {
  return ensureDefaultConfigs().find(
    (s) => s.enabled && s.majorTypes.includes(majorType) && s.minorTypes.includes(minorType),
  );
}

function buildTeamMetaSeed(): Record<string, MemberTeamMeta> {
  const map: Record<string, MemberTeamMeta> = {};
  projects.forEach((p, i) => {
    const status = teamStatusSeed[i % teamStatusSeed.length];
    map[p.id] = {
      projectId: p.id,
      status,
      notifySent: status !== '待完善',
      notifySentAt: status !== '待完善' ? `2026-0${2 + (i % 4)}-${String(8 + (i % 18)).padStart(2, '0')} 09:30:00` : undefined,
      lastPresentAt: ['审批中', '已定版', '已驳回'].includes(status)
        ? `2026-0${3 + (i % 3)}-${String(10 + (i % 15)).padStart(2, '0')} 14:00:00`
        : undefined,
      finalizedAt: status === '已定版' ? `2026-0${4 + (i % 2)}-${String(12 + (i % 10)).padStart(2, '0')} 16:20:00` : undefined,
    };
  });
  return map;
}

function ensureTeamMetaMap(): Record<string, MemberTeamMeta> {
  const cached = loadJson<Record<string, MemberTeamMeta> | null>(TEAM_META_KEY, null);
  if (cached && Object.keys(cached).length > 0) return cached;
  const seed = buildTeamMetaSeed();
  saveJson(TEAM_META_KEY, seed);
  return seed;
}

export function getMemberTeamMeta(projectId: string): MemberTeamMeta {
  const map = ensureTeamMetaMap();
  if (!map[projectId]) {
    map[projectId] = { projectId, status: '待完善', notifySent: false };
    saveJson(TEAM_META_KEY, map);
  }
  return { ...map[projectId] };
}

export function setMemberTeamMeta(projectId: string, patch: Partial<MemberTeamMeta>): MemberTeamMeta {
  const map = ensureTeamMetaMap();
  map[projectId] = { ...getMemberTeamMeta(projectId), ...patch, projectId };
  saveJson(TEAM_META_KEY, map);
  return { ...map[projectId] };
}

function buildApprovalSeed(): Record<string, MemberTeamApprovalRecord[]> {
  const map: Record<string, MemberTeamApprovalRecord[]> = {};
  projects.forEach((p, i) => {
    const meta = buildTeamMetaSeed()[p.id];
    const records: MemberTeamApprovalRecord[] = [];
    if (meta.notifySent) {
      records.push({
        id: `${p.id}_apr_1`,
        projectId: p.id,
        operationType: '发送完善成员通知',
        operator: '管理员',
        operationTime: meta.notifySentAt || '2026-02-10 09:30:00',
        remark: `已向各小组组长推送完善成员待办，共 ${3 + (i % 2)} 个小组`,
        result: '',
      });
    }
    if (['审批中', '已定版', '已驳回'].includes(meta.status)) {
      const processId = `LC-CY-${p.approvalNo.replace('LX-', '')}-${String(i + 1).padStart(2, '0')}`;
      records.push({
        id: `${p.id}_apr_2`,
        projectId: p.id,
        operationType: '呈核（发起领导审批）',
        operator: '管理员',
        operationTime: meta.lastPresentAt || '2026-03-12 14:00:00',
        remark: '项目组成员已核实完毕，呈请公司领导审批定版',
        result: '',
        processId,
        processNodes: [
          { name: '管理员呈核', approver: '管理员', status: '已通过' },
          { name: '工程管理部复核', approver: '李建国', status: meta.status === '审批中' ? '审核中' : '已通过' },
          { name: '公司分管领导审批', approver: '赵卫东', status: meta.status === '审批中' ? '待处理' : meta.status === '已驳回' ? '已驳回' : '已通过' },
        ],
      });
    }
    if (meta.status === '已定版') {
      const processId = `LC-CY-${p.approvalNo.replace('LX-', '')}-${String(i + 1).padStart(2, '0')}`;
      records.push({
        id: `${p.id}_apr_3`,
        projectId: p.id,
        operationType: '领导审批通过',
        operator: '赵卫东',
        operationTime: meta.finalizedAt || '2026-04-15 16:20:00',
        remark: '成员配置合理，同意定版生效',
        result: '通过',
        processId,
        processNodes: [
          { name: '管理员呈核', approver: '管理员', status: '已通过' },
          { name: '工程管理部复核', approver: '李建国', status: '已通过' },
          { name: '公司分管领导审批', approver: '赵卫东', status: '已通过' },
        ],
      });
    }
    if (meta.status === '已驳回') {
      const processId = `LC-CY-${p.approvalNo.replace('LX-', '')}-${String(i + 1).padStart(2, '0')}`;
      records.push({
        id: `${p.id}_apr_3`,
        projectId: p.id,
        operationType: '领导审批驳回',
        operator: '赵卫东',
        operationTime: `2026-0${3 + (i % 2)}-${String(18 + (i % 8)).padStart(2, '0')} 11:10:00`,
        remark: '部分小组职责交叉，请核实后重新呈核',
        result: '驳回',
        processId,
        processNodes: [
          { name: '管理员呈核', approver: '管理员', status: '已通过' },
          { name: '工程管理部复核', approver: '李建国', status: '已通过' },
          { name: '公司分管领导审批', approver: '赵卫东', status: '已驳回' },
        ],
      });
    }
    if (records.length === 0) {
      records.push({
        id: `${p.id}_apr_0`,
        projectId: p.id,
        operationType: '立项自动套用默认配置',
        operator: '系统',
        operationTime: `${p.createDate} 08:00:00`,
        remark: `按「${p.majorType} + ${p.minorType}」匹配默认成员配置，已生成默认小组与组长`,
        result: '',
      });
    }
    map[p.id] = records;
  });
  return map;
}

function ensureApprovalMap(): Record<string, MemberTeamApprovalRecord[]> {
  const cached = loadJson<Record<string, MemberTeamApprovalRecord[]> | null>(TEAM_APPROVAL_KEY, null);
  if (cached && Object.keys(cached).length > 0) return cached;
  const seed = buildApprovalSeed();
  saveJson(TEAM_APPROVAL_KEY, seed);
  return seed;
}

export function getMemberTeamApprovalRecords(projectId: string): MemberTeamApprovalRecord[] {
  const map = ensureApprovalMap();
  if (!map[projectId]) {
    map[projectId] = [];
    saveJson(TEAM_APPROVAL_KEY, map);
  }
  return [...map[projectId]].sort((a, b) => b.operationTime.localeCompare(a.operationTime));
}

export function addMemberTeamApprovalRecord(
  projectId: string,
  record: Omit<MemberTeamApprovalRecord, 'id' | 'projectId'>,
): MemberTeamApprovalRecord[] {
  const map = ensureApprovalMap();
  const list = map[projectId] || [];
  const next: MemberTeamApprovalRecord = {
    ...record,
    id: `${projectId}_apr_${Date.now()}`,
    projectId,
  };
  list.push(next);
  map[projectId] = list;
  saveJson(TEAM_APPROVAL_KEY, map);
  return getMemberTeamApprovalRecords(projectId);
}

/** 完善成员：向各组长发送待办通知 */
export function notifyCompleteMembers(projectId: string, operator = '管理员'): { meta: MemberTeamMeta; leaderCount: number } {
  const groups = getProjectGroups(projectId);
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const meta = setMemberTeamMeta(projectId, {
    status: '待完善',
    notifySent: true,
    notifySentAt: now,
  });
  addMemberTeamApprovalRecord(projectId, {
    operationType: '发送完善成员通知',
    operator,
    operationTime: now,
    remark: `已向 ${groups.length} 个小组组长推送完善成员待办`,
    result: '',
  });
  return { meta, leaderCount: groups.length };
}

/** 呈核：发起领导审批 */
export function presentMemberTeam(
  projectId: string,
  remark: string,
  operator = '管理员',
  attachmentNames: string[] = [],
): MemberTeamMeta {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const project = getProjectById(projectId);
  const processId = `LC-CY-${(project?.approvalNo || projectId).replace('LX-', '')}-${Date.now().toString().slice(-4)}`;
  const meta = setMemberTeamMeta(projectId, { status: '审批中', lastPresentAt: now });
  const attachText = attachmentNames.length > 0 ? `；附件：${attachmentNames.join('、')}` : '；未上传附件';
  addMemberTeamApprovalRecord(projectId, {
    operationType: '呈核（发起领导审批）',
    operator,
    operationTime: now,
    remark: `${remark || '项目组成员已核实完毕，呈请公司领导审批定版'}${attachText}`,
    result: '',
    processId,
    processNodes: [
      { name: '管理员呈核', approver: operator, status: '已通过' },
      { name: '工程管理部复核', approver: '李建国', status: '审核中' },
      { name: '公司分管领导审批', approver: '赵卫东', status: '待处理' },
    ],
  });
  return meta;
}

/** 定版后修改：解锁继续编辑 */
export function unlockMemberTeamForEdit(projectId: string, operator = '管理员'): MemberTeamMeta {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const meta = setMemberTeamMeta(projectId, { status: '待呈核', finalizedAt: undefined });
  addMemberTeamApprovalRecord(projectId, {
    operationType: '修改成员（解锁编辑）',
    operator,
    operationTime: now,
    remark: '定版后管理员发起成员调整，需重新呈核',
    result: '',
  });
  return meta;
}

export function getProjectById(projectId: string): ProjectItem | undefined {
  return projects.find((p) => p.id === projectId);
}

function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const escape = (cell: string) => `"${String(cell ?? '').replace(/"/g, '""')}"`;
  const csv = `\uFEFF${headers.map(escape).join(',')}\n${rows.map((r) => r.map(escape).join(',')).join('\n')}`;
  const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const MEMBER_IMPORT_HEADERS = [
  '成员姓名', '工号', '部门', '手机号', '成员类型', '工作职责', '小组名称', '关联合同编号', '关联合同名称',
];

/** 导出成员列表为 Excel 兼容的 CSV（UTF-8 BOM） */
export function exportMembersToExcel(
  project: ProjectItem,
  members: ProjectMember[],
  groups: ProjectGroup[],
): void {
  const headers = ['序号', ...MEMBER_IMPORT_HEADERS, '变更状态', '创建日期'];
  const rows = members.map((m, i) => {
    const group = groups.find((g) => g.id === m.groupId);
    return [
      String(i + 1),
      m.name,
      m.employeeNo,
      m.department,
      m.phone,
      m.memberType,
      m.workDuty,
      isCoreMemberType(m.memberType) ? '' : (group?.name || m.groupName || ''),
      m.relatedContractNo || '',
      m.relatedContract === '-' ? '' : m.relatedContract,
      m.status,
      m.createDate,
    ];
  });
  downloadCsv(`项目成员列表_${project.approvalNo}_${project.name}.xls`, headers, rows);
}

/** 导出成员导入模板 */
export function exportMemberImportTemplate(): void {
  const sample: string[] = ['张三', 'NG10021', '工程管理部', '13800001111', '项目成员', '负责现场施工协调', '土建小组', '', ''];
  downloadCsv('项目成员导入模板.xls', MEMBER_IMPORT_HEADERS, [sample]);
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (c === '"') {
        inQ = false;
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQ = true;
    } else if (c === ',') {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out;
}

export interface ImportedMemberRow {
  name: string;
  employeeNo: string;
  department: string;
  phone: string;
  memberType: ProjectMember['memberType'];
  workDuty: string;
  groupName: string;
  relatedContractNo: string;
  relatedContract: string;
}

const validMemberTypes = new Set<string>([
  '项目负责人', '项目申报人', '项目提报人', '合同经办人', '项目创建人', '项目成员', '招标经理', '采购经理',
  '论证经办人', '工程需求资料经办人', '合同预付款申请资料经办人', '合同预结算报支资料经办人', '合同质保金报支资料经办人',
]);

/** 解析成员导入文件（CSV / Excel 兼容文本） */
export function parseMemberImportText(text: string): { rows: ImportedMemberRow[]; error?: string } {
  const raw = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = raw.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return { rows: [], error: '导入文件无有效数据，请使用导出的模板填写后导入' };
  const header = parseCsvLine(lines[0]);
  const idx = (name: string) => header.findIndex((h) => h.replace(/\s/g, '') === name);
  const col = {
    name: idx('成员姓名'),
    employeeNo: idx('工号'),
    department: idx('部门'),
    phone: idx('手机号'),
    memberType: idx('成员类型'),
    workDuty: idx('工作职责'),
    groupName: idx('小组名称'),
    contractNo: idx('关联合同编号'),
    contractName: idx('关联合同名称') >= 0 ? idx('关联合同名称') : idx('关联合同'),
  };
  if (col.name < 0 || col.employeeNo < 0 || col.memberType < 0) {
    return { rows: [], error: '模板表头不正确，请先下载「导出模板」后按字段填写' };
  }
  const rows: ImportedMemberRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    const name = cells[col.name] || '';
    const employeeNo = cells[col.employeeNo] || '';
    if (!name && !employeeNo) continue;
    const memberType = (cells[col.memberType] || '项目成员').trim();
    if (!validMemberTypes.has(memberType)) {
      return { rows: [], error: `第 ${i + 1} 行成员类型「${memberType}」无效` };
    }
    rows.push({
      name,
      employeeNo,
      department: col.department >= 0 ? cells[col.department] || '' : '',
      phone: col.phone >= 0 ? cells[col.phone] || '' : '',
      memberType: normalizeMemberTypeLabel(memberType),
      workDuty: col.workDuty >= 0 ? cells[col.workDuty] || '' : '',
      groupName: col.groupName >= 0 ? cells[col.groupName] || '' : '',
      relatedContractNo: col.contractNo >= 0 ? cells[col.contractNo] || '' : '',
      relatedContract: col.contractName >= 0 ? cells[col.contractName] || '-' : '-',
    });
  }
  if (rows.length === 0) return { rows: [], error: '未解析到可导入的成员行' };
  return { rows };
}

/** 按流程 ID 查看审批流程；无 processId 时回退为项目最新流程 */
export function getMemberTeamApprovalFlow(projectId: string, processId?: string): {
  processName: string;
  status: string;
  nodes: { id: string; seq: number; name: string; approver: string; status: string; action: string; operateTime: string; opinion: string }[];
  logs: { time: string; operator: string; action: string; opinion: string }[];
} {
  const meta = getMemberTeamMeta(projectId);
  const records = getMemberTeamApprovalRecords(projectId);
  const flowRecords = processId
    ? records.filter((r) => r.processId === processId)
    : records.filter((r) => r.processNodes && r.processNodes.length > 0);
  const anchor = flowRecords[0] || records.find((r) => r.operationType.includes('呈核'));
  const nodesSrc = anchor?.processNodes || [
    { name: '管理员呈核', approver: '管理员', status: meta.status === '待完善' || meta.status === '待呈核' ? '待处理' : '已通过' },
    { name: '工程管理部复核', approver: '李建国', status: meta.status === '审批中' ? '审核中' : meta.status === '已定版' || meta.status === '已驳回' ? '已通过' : '待处理' },
    { name: '公司分管领导审批', approver: '赵卫东', status: meta.status === '已定版' ? '已通过' : meta.status === '已驳回' ? '已驳回' : '待处理' },
  ];
  const overall =
    anchor?.result === '通过' ? '已通过' :
    anchor?.result === '驳回' ? '已驳回' :
    meta.status === '已定版' ? '已通过' :
    meta.status === '已驳回' ? '已驳回' :
    meta.status === '审批中' ? '进行中' : '未发起';
  const nodes = nodesSrc.map((n, i) => ({
    id: `tn_${i + 1}`,
    seq: i + 1,
    name: n.name,
    approver: n.approver,
    status: n.status,
    action: n.status === '已通过' ? '通过' : n.status === '已驳回' ? '驳回' : n.status === '审核中' ? '审核中' : '待处理',
    operateTime: i === 0 && anchor ? anchor.operationTime : '',
    opinion: i === 0 && anchor ? anchor.remark : '',
  }));
  const logs = (flowRecords.length > 0 ? flowRecords : records).map((r) => ({
    time: r.operationTime,
    operator: r.operator,
    action: r.operationType,
    opinion: r.remark || '—',
  }));
  return {
    processName: processId
      ? `项目组成员组建领导审批 · ${processId}`
      : '项目组成员组建领导审批',
    status: overall,
    nodes,
    logs,
  };
}