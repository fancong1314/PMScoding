// 项目档案配置 - Mock数据（挂载点 + 条件规则引擎 + 可配置节点树）

export interface MountPoint {
  bizCode: string;
  name: string;
  domain: string;
  contextObjects: string[];
  fieldCodes: string[];
  routeHint?: string;
  enabled: boolean;
}

export interface ConditionFieldDef {
  code: string;
  name: string;
  valueType: 'enum' | 'string' | 'number' | 'boolean';
  options?: string[];
}

export type RuleOperator =
  | '='
  | '!='
  | 'IN'
  | 'NOT_IN'
  | '>'
  | '>='
  | '<'
  | '<='
  | 'EMPTY'
  | 'NOT_EMPTY';

export interface RuleCondition {
  id: string;
  field: string;
  op: RuleOperator;
  value: string | string[] | number | boolean | null;
}

export interface RuleGroup {
  id: string;
  logic: 'AND' | 'OR';
  conditions: RuleCondition[];
}

export interface RuleExpression {
  logic: 'AND' | 'OR';
  groups: RuleGroup[];
}

export interface FunctionNode {
  id: string;
  name: string;
  level: number;
  parentId: string | null;
  path: string;
  configStatus: 'configured' | 'unconfigured' | 'partial';
  /** folder=仅目录；mount=可配附件须绑 bizCode */
  nodeKind: 'folder' | 'mount';
  bizCode?: string | null;
  enabled: boolean;
}

export interface AttachmentConfig {
  id: string;
  nodeId: string;
  docName: string;
  type: string;
  /** 适用项目大类（年度计划等场景）；为空表示不限 */
  projectMajorTypes?: string[];
  versionManaged: boolean;
  required: boolean;
  fileFormats: string[];
  fileSize: number;
  fileSizeUnit: 'MB' | 'GB';
  fileCount: number;
  archived: boolean;
  remark: string;
  templateFile: string;
  enabled: boolean;
}

export interface ConditionConfig {
  id: string;
  nodeId: string;
  conditionName: string;
  priority: number;
  expression: RuleExpression;
  /** 兼容旧字段：可从 expression 推导或保留 seed */
  contractTypes?: string[];
  projectTypes?: string[];
  status: 'enabled' | 'disabled';
  attachments: AttachmentConfig[];
}

export interface ArchiveConfigStore {
  nodes: FunctionNode[];
  attachmentConfigs: Record<string, AttachmentConfig[]>;
  conditionConfigs: Record<string, ConditionConfig[]>;
}

export const ARCHIVE_CONFIG_STORAGE_KEY = 'pms_archive_config_v5';

export const ARCHIVE_BIZ_CODES = {
  ACCEPTANCE_RECORD_CREATE: 'ACCEPTANCE_RECORD_CREATE',
  ACCEPTANCE_RECORD_EDIT: 'ACCEPTANCE_RECORD_EDIT',
  ACCEPTANCE_CONFIRM: 'ACCEPTANCE_CONFIRM',
  OVERDUE_APPLY_CREATE: 'OVERDUE_APPLY_CREATE',
  OVERDUE_APPLY_EDIT: 'OVERDUE_APPLY_EDIT',
  OVERDUE_APPLY_DELETE: 'OVERDUE_APPLY_DELETE',
  PAYMENT_DECLARE_CREATE: 'PAYMENT_DECLARE_CREATE',
  PAYMENT_DECLARE_EDIT: 'PAYMENT_DECLARE_EDIT',
  START_ORDER_APPROVE: 'START_ORDER_APPROVE',
  START_ORDER_ISSUE: 'START_ORDER_ISSUE',
  PROJECT_MEMBER_MANAGE: 'PROJECT_MEMBER_MANAGE',
  PLAN_DECLARATION: 'PLAN_DECLARATION',
  JOINT_OPINION_SIGN: 'JOINT_OPINION_SIGN',
  INITIATION_APPLY: 'INITIATION_APPLY',
  SPORADIC_AGREEMENT: 'SPORADIC_AGREEMENT',
  SPORADIC_PLAN_UPLOAD: 'SPORADIC_PLAN_UPLOAD',
  SPORADIC_BUDGET_UPLOAD: 'SPORADIC_BUDGET_UPLOAD',
  /** 项目档案固定节点：会议纪要 */
  MEETING_MINUTES: 'MEETING_MINUTES',
} as const;

export type ArchiveBizCode = (typeof ARCHIVE_BIZ_CODES)[keyof typeof ARCHIVE_BIZ_CODES];

// 合同类型 / 项目类型字典（条件字段枚举复用）
export const contractTypeOptions = [
  '总承包合同', '施工分包合同', '设备采购合同', '技术服务合同',
  '设计合同', '监理合同', '咨询服务合同', '物资采购合同',
  '租赁合同', '其他合同',
];

export const projectTypeOptions = [
  '技改项目', '维修项目', '基建项目', '环保项目',
  '安全项目', '信息化项目', '科研项目',
];

export const projectMajorTypeOptions = ['新建', '技改', '营缮', '零固'];

export const conditionFieldDefs: ConditionFieldDef[] = [
  { code: 'contractType', name: '合同类型', valueType: 'enum', options: contractTypeOptions },
  { code: 'projectType', name: '项目类型', valueType: 'enum', options: projectTypeOptions },
  { code: 'projectMajorType', name: '项目大类', valueType: 'enum', options: projectMajorTypeOptions },
  { code: 'contractAmount', name: '合同金额(万元)', valueType: 'number' },
  { code: 'overdueDays', name: '超期天数', valueType: 'number' },
  { code: 'isOverdue', name: '是否超期', valueType: 'boolean' },
  { code: 'contractorName', name: '施工单位', valueType: 'string' },
  { code: 'hasSafetyProtocol', name: '已签安全协议', valueType: 'boolean' },
];

const FIELD_NAME_MAP = Object.fromEntries(conditionFieldDefs.map((f) => [f.code, f.name]));

export const mountPoints: MountPoint[] = [
  {
    bizCode: ARCHIVE_BIZ_CODES.ACCEPTANCE_RECORD_CREATE,
    name: '新增验收记录',
    domain: '合同业务执行',
    contextObjects: ['contract', 'project'],
    fieldCodes: ['contractType', 'projectType', 'contractAmount', 'projectMajorType'],
    routeHint: '/project-contract/acceptance',
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.ACCEPTANCE_RECORD_EDIT,
    name: '编辑验收记录',
    domain: '合同业务执行',
    contextObjects: ['contract', 'project'],
    fieldCodes: ['contractType', 'projectType', 'projectMajorType'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.ACCEPTANCE_CONFIRM,
    name: '验收确认',
    domain: '合同业务执行',
    contextObjects: ['contract', 'project'],
    fieldCodes: ['contractType', 'projectType'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.OVERDUE_APPLY_CREATE,
    name: '新增超期申请',
    domain: '合同业务执行',
    contextObjects: ['contract', 'project'],
    fieldCodes: ['contractType', 'projectType', 'overdueDays', 'isOverdue', 'contractAmount'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.OVERDUE_APPLY_EDIT,
    name: '修改超期申请',
    domain: '合同业务执行',
    contextObjects: ['contract', 'project'],
    fieldCodes: ['contractType', 'projectType', 'overdueDays'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.OVERDUE_APPLY_DELETE,
    name: '删除超期申请',
    domain: '合同业务执行',
    contextObjects: ['contract'],
    fieldCodes: ['contractType'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.PAYMENT_DECLARE_CREATE,
    name: '新增工程款申报',
    domain: '工程款申报',
    contextObjects: ['contract', 'project'],
    fieldCodes: ['contractType', 'projectType', 'contractAmount', 'projectMajorType'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.PAYMENT_DECLARE_EDIT,
    name: '修改工程款申报',
    domain: '工程款申报',
    contextObjects: ['contract', 'project'],
    fieldCodes: ['contractType', 'projectType', 'contractAmount'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.START_ORDER_APPROVE,
    name: '开工令审批',
    domain: '合同执行',
    contextObjects: ['contract', 'project'],
    fieldCodes: ['contractType', 'projectType', 'contractAmount', 'hasSafetyProtocol', 'projectMajorType'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.START_ORDER_ISSUE,
    name: '开工令签发',
    domain: '合同执行',
    contextObjects: ['contract', 'project'],
    fieldCodes: ['contractType', 'projectType', 'hasSafetyProtocol'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.PROJECT_MEMBER_MANAGE,
    name: '项目成员管理',
    domain: '项目准备',
    contextObjects: ['project'],
    fieldCodes: ['projectType', 'projectMajorType'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.PLAN_DECLARATION,
    name: '年度计划申报',
    domain: '年度计划',
    contextObjects: ['plan', 'project'],
    fieldCodes: ['projectMajorType', 'projectType'],
    routeHint: '/project-plan/declaration',
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.JOINT_OPINION_SIGN,
    name: '会审意见签署',
    domain: '年度计划',
    contextObjects: ['plan', 'project'],
    fieldCodes: ['projectMajorType', 'projectType'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.INITIATION_APPLY,
    name: '项目立项申请',
    domain: '项目立项',
    contextObjects: ['initiation', 'project'],
    fieldCodes: ['projectMajorType', 'projectType', 'contractAmount'],
    routeHint: '/project-initiation/declaration',
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.SPORADIC_AGREEMENT,
    name: '零星协议单申报',
    domain: '零星工程',
    contextObjects: ['sporadic'],
    fieldCodes: ['projectMajorType', 'contractAmount'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.SPORADIC_PLAN_UPLOAD,
    name: '零星协议单审查-方案上传',
    domain: '零星工程',
    contextObjects: ['sporadic'],
    fieldCodes: ['projectMajorType', 'contractAmount'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.SPORADIC_BUDGET_UPLOAD,
    name: '零星协议单审查-预算上传',
    domain: '零星工程',
    contextObjects: ['sporadic'],
    fieldCodes: ['projectMajorType', 'contractAmount'],
    enabled: true,
  },
  {
    bizCode: ARCHIVE_BIZ_CODES.MEETING_MINUTES,
    name: '会议纪要',
    domain: '项目档案',
    contextObjects: ['project'],
    fieldCodes: ['projectType', 'projectMajorType'],
    routeHint: '/project-archive/management/detail',
    enabled: true,
  },
];

function folder(
  id: string,
  name: string,
  level: number,
  parentId: string | null,
  path: string,
  configStatus: FunctionNode['configStatus'] = 'unconfigured',
): FunctionNode {
  return { id, name, level, parentId, path, configStatus, nodeKind: 'folder', bizCode: null, enabled: true };
}

function mount(
  id: string,
  name: string,
  level: number,
  parentId: string | null,
  path: string,
  bizCode: string,
  configStatus: FunctionNode['configStatus'] = 'configured',
): FunctionNode {
  return { id, name, level, parentId, path, configStatus, nodeKind: 'mount', bizCode, enabled: true };
}

/** Seed：功能节点树 */
const seedFunctionNodeTree: FunctionNode[] = [
  folder('n-1', '项目合同管理', 1, null, '项目合同管理', 'partial'),
  folder('n-1-1', '工程需求管理', 2, 'n-1', '项目合同管理 > 工程需求管理', 'configured'),
  folder('n-1-2', '合同资料管理', 2, 'n-1', '项目合同管理 > 合同资料管理'),
  folder('n-1-3', '合同进度管理', 2, 'n-1', '项目合同管理 > 合同进度管理'),
  folder('n-1-4', '合同执行管理', 2, 'n-1', '项目合同管理 > 合同执行管理', 'partial'),
  folder('n-1-5', '合同业务执行管理', 2, 'n-1', '项目合同管理 > 合同业务执行管理', 'partial'),
  folder('n-1-6', '工程款申报', 2, 'n-1', '项目合同管理 > 工程款申报', 'configured'),
  folder('n-1-7', '合同款项报支', 2, 'n-1', '项目合同管理 > 合同款项报支'),
  folder('n-1-8', '合同中标文号查询', 2, 'n-1', '项目合同管理 > 合同中标文号查询'),
  folder('n-1-5-1', '合同举牌验收', 3, 'n-1-5', '项目合同管理 > 合同业务执行管理 > 合同举牌验收', 'configured'),
  folder('n-1-5-4', '合同超期申请', 3, 'n-1-5', '项目合同管理 > 合同业务执行管理 > 合同超期申请', 'partial'),
  folder('n-1-5-5', '合同变更核价管理', 3, 'n-1-5', '项目合同管理 > 合同业务执行管理 > 合同变更核价管理'),
  folder('n-1-5-1-1', '合同举牌验收-工序预排', 4, 'n-1-5-1', '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 工序预排'),
  folder('n-1-5-1-2', '合同举牌验收-验收管理', 4, 'n-1-5-1', '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理', 'configured'),
  mount('n-1-5-1-2-1', '新增验收记录', 5, 'n-1-5-1-2', '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', ARCHIVE_BIZ_CODES.ACCEPTANCE_RECORD_CREATE),
  mount('n-1-5-1-2-2', '编辑验收记录', 5, 'n-1-5-1-2', '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 编辑验收记录', ARCHIVE_BIZ_CODES.ACCEPTANCE_RECORD_EDIT),
  mount('n-1-5-1-2-3', '验收确认', 5, 'n-1-5-1-2', '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 验收确认', ARCHIVE_BIZ_CODES.ACCEPTANCE_CONFIRM, 'partial'),
  folder('n-1-5-4-1', '合同超期申请-项目组审核', 4, 'n-1-5-4', '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核', 'partial'),
  mount('n-1-5-4-1-1', '新增超期申请', 5, 'n-1-5-4-1', '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 新增超期申请', ARCHIVE_BIZ_CODES.OVERDUE_APPLY_CREATE),
  mount('n-1-5-4-1-2', '修改超期申请', 5, 'n-1-5-4-1', '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 修改超期申请', ARCHIVE_BIZ_CODES.OVERDUE_APPLY_EDIT, 'unconfigured'),
  mount('n-1-5-4-1-3', '删除超期申请', 5, 'n-1-5-4-1', '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 删除超期申请', ARCHIVE_BIZ_CODES.OVERDUE_APPLY_DELETE, 'unconfigured'),
  folder('n-1-6-1', '工程款申报-项目部审核', 4, 'n-1-6', '项目合同管理 > 工程款申报 > 项目部审核', 'partial'),
  mount('n-1-6-1-1', '新增申报', 5, 'n-1-6-1', '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', ARCHIVE_BIZ_CODES.PAYMENT_DECLARE_CREATE),
  mount('n-1-6-1-2', '修改申报', 5, 'n-1-6-1', '项目合同管理 > 工程款申报 > 项目部审核 > 修改申报', ARCHIVE_BIZ_CODES.PAYMENT_DECLARE_EDIT),
  folder('n-1-4-1', '合同执行-开工', 4, 'n-1-4', '项目合同管理 > 合同执行管理 > 开工', 'partial'),
  mount('n-1-4-1-1', '开工令审批', 5, 'n-1-4-1', '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', ARCHIVE_BIZ_CODES.START_ORDER_APPROVE),
  mount('n-1-4-1-2', '开工令签发', 5, 'n-1-4-1', '项目合同管理 > 合同执行管理 > 开工 > 开工令签发', ARCHIVE_BIZ_CODES.START_ORDER_ISSUE, 'unconfigured'),
  folder('n-2', '项目准备管理', 1, null, '项目准备管理', 'partial'),
  mount('n-2-1', '项目成员管理', 2, 'n-2', '项目准备管理 > 项目成员管理', ARCHIVE_BIZ_CODES.PROJECT_MEMBER_MANAGE),
  folder('n-2-3', '项目概算管理', 2, 'n-2', '项目准备管理 > 项目概算管理'),
  folder('n-3', '项目执行管理', 1, null, '项目执行管理', 'partial'),
  folder('n-3-1', '质量安全管理', 2, 'n-3', '项目执行管理 > 质量安全管理', 'configured'),
  folder('n-plan', '年度计划管理', 1, null, '年度计划管理', 'configured'),
  mount('n-plan-1', '年度计划申报', 2, 'n-plan', '年度计划管理 > 年度计划申报', ARCHIVE_BIZ_CODES.PLAN_DECLARATION),
  mount('n-plan-2', '会审意见签署', 2, 'n-plan', '年度计划管理 > 会审意见签署', ARCHIVE_BIZ_CODES.JOINT_OPINION_SIGN),
  folder('n-init', '项目立项管理', 1, null, '项目立项管理', 'configured'),
  mount('n-init-1', '项目立项申请', 2, 'n-init', '项目立项管理 > 项目立项申请', ARCHIVE_BIZ_CODES.INITIATION_APPLY),
  folder('n-sporadic', '零星工程项目管理', 1, null, '零星工程项目管理', 'configured'),
  mount('n-sporadic-1', '零星协议单申报', 2, 'n-sporadic', '零星工程项目管理 > 零星协议单申报', ARCHIVE_BIZ_CODES.SPORADIC_AGREEMENT),
  mount('n-sporadic-2', '零星协议单审查', 2, 'n-sporadic', '零星工程项目管理 > 零星协议单审查', ARCHIVE_BIZ_CODES.SPORADIC_PLAN_UPLOAD),
  mount('n-sporadic-budget', '预算上传', 3, 'n-sporadic-2', '零星工程项目管理 > 零星协议单审查 > 预算上传', ARCHIVE_BIZ_CODES.SPORADIC_BUDGET_UPLOAD),
  folder('n-archive', '项目档案固定节点', 1, null, '项目档案固定节点', 'configured'),
  mount('n-meeting-1', '会议纪要', 2, 'n-archive', '项目档案固定节点 > 会议纪要', ARCHIVE_BIZ_CODES.MEETING_MINUTES),
];

/** 兼容旧导出名：指向当前 store 中的节点（只读快照，CRUD 请走 store） */
export let functionNodeTree: FunctionNode[] = seedFunctionNodeTree.map((n) => ({ ...n }));

function emptyExpr(): RuleExpression {
  return { logic: 'AND', groups: [{ id: uid('rg'), logic: 'AND', conditions: [] }] };
}

function makeExpr(
  groups: Array<{ logic?: 'AND' | 'OR'; conditions: Array<Omit<RuleCondition, 'id'> & { id?: string }> }>,
  logic: 'AND' | 'OR' = 'AND',
): RuleExpression {
  return {
    logic,
    groups: groups.map((g) => ({
      id: uid('rg'),
      logic: g.logic || 'AND',
      conditions: g.conditions.map((c) => ({
        id: c.id || uid('rc'),
        field: c.field,
        op: c.op,
        value: c.value,
      })),
    })),
  };
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const seedAttachmentConfigs: Record<string, AttachmentConfig[]> = {
  'n-1-5-1-2-1': [
    { id: 'ac-1', nodeId: 'n-1-5-1-2-1', docName: '验收申请表', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '需经项目负责人签字确认后方可上传', templateFile: '验收申请表模板.docx', enabled: true },
    { id: 'ac-2', nodeId: 'n-1-5-1-2-1', docName: '施工质量检查记录', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)', '图片(jpg/png/bmp)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '', templateFile: '', enabled: true },
    { id: 'ac-3', nodeId: 'n-1-5-1-2-1', docName: '现场照片及影像资料', type: '多选', versionManaged: false, required: false, fileFormats: ['图片(jpg/png/bmp)', '视频(mp4/avi)', '压缩包(zip/rar/7z)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 20, archived: false, remark: '拍摄关键施工节点及隐蔽工程', templateFile: '', enabled: true },
    { id: 'ac-4', nodeId: 'n-1-5-1-2-1', docName: '材料合格证及检测报告', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 15, archived: true, remark: '包括钢材、水泥等主要材料的合格证', templateFile: '', enabled: true },
    { id: 'ac-5', nodeId: 'n-1-5-1-2-1', docName: '隐蔽工程验收记录', type: '技改', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '含地基验槽、钢筋隐蔽等', templateFile: '隐蔽工程验收记录模板.docx', enabled: false },
    { id: 'ac-6', nodeId: 'n-1-5-1-2-1', docName: '设备开箱检验记录', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 10, archived: false, remark: '', templateFile: '设备开箱检验记录表.xlsx', enabled: true },
  ],
  'n-1-5-1-2-2': [
    { id: 'ac-7', nodeId: 'n-1-5-1-2-2', docName: '修改后验收记录', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '标注修改位置及修改原因', templateFile: '', enabled: true },
    { id: 'ac-8', nodeId: 'n-1-5-1-2-2', docName: '修改审批单', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '需经审批人签字', templateFile: '修改审批单模板.docx', enabled: true },
  ],
  'n-1-5-4-1-1': [
    { id: 'ac-9', nodeId: 'n-1-5-4-1-1', docName: '超期原因说明书', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '需详细说明超期原因及延期天数', templateFile: '超期原因说明书模板.docx', enabled: true },
    { id: 'ac-10', nodeId: 'n-1-5-4-1-1', docName: '施工进度对比表', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Excel(xls/xlsx)'], fileSize: 15, fileSizeUnit: 'MB', fileCount: 3, archived: false, remark: '对比计划进度与实际进度', templateFile: '施工进度对比表模板.xlsx', enabled: true },
    { id: 'ac-11', nodeId: 'n-1-5-4-1-1', docName: '监理单位意见书', type: '维修', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: false, remark: '', templateFile: '', enabled: true },
    { id: 'ac-12', nodeId: 'n-1-5-4-1-1', docName: '相关证明材料', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)', '压缩包(zip/rar/7z)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 10, archived: false, remark: '如天气影响证明、材料延迟到货通知等', templateFile: '', enabled: true },
  ],
  'n-1-6-1-1': [
    { id: 'ac-13', nodeId: 'n-1-6-1-1', docName: '工程款申报表', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '需加盖单位公章', templateFile: '工程款申报表模板.docx', enabled: true },
    { id: 'ac-14', nodeId: 'n-1-6-1-1', docName: '工程量清单', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Excel(xls/xlsx)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '含工程量计算明细', templateFile: '', enabled: true },
    { id: 'ac-15', nodeId: 'n-1-6-1-1', docName: '发票扫描件', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '', templateFile: '', enabled: true },
    { id: 'ac-16', nodeId: 'n-1-6-1-1', docName: '竣工验收报告', type: '技改', versionManaged: false, required: false, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '竣工阶段申报时需附', templateFile: '竣工验收报告模板.docx', enabled: true },
  ],
  'n-1-6-1-2': [
    { id: 'ac-17', nodeId: 'n-1-6-1-2', docName: '修改后申报表', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '标注修改内容', templateFile: '', enabled: true },
    { id: 'ac-18', nodeId: 'n-1-6-1-2', docName: '修改说明函', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: false, remark: '', templateFile: '修改说明函模板.docx', enabled: true },
  ],
  'n-1-4-1-1': [
    { id: 'ac-19', nodeId: 'n-1-4-1-1', docName: '开工报告', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 1, archived: true, remark: '', templateFile: '开工报告模板.docx', enabled: true },
    { id: 'ac-20', nodeId: 'n-1-4-1-1', docName: '施工组织设计', type: '技改', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 1, archived: true, remark: '含施工方案、进度计划、安全措施', templateFile: '', enabled: true },
    { id: 'ac-21', nodeId: 'n-1-4-1-1', docName: '安全协议', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF'], fileSize: 15, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '双方签署的安全管理协议', templateFile: '安全协议模板.pdf', enabled: true },
    { id: 'ac-22', nodeId: 'n-1-4-1-1', docName: '资质证书', type: '基建', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '施工单位资质证书、安全生产许可证等', templateFile: '', enabled: true },
  ],
  'n-1-5-1-2-3': [
    { id: 'ac-23', nodeId: 'n-1-5-1-2-3', docName: '验收确认单', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '各方签字确认', templateFile: '验收确认单模板.docx', enabled: true },
  ],
  'n-2-1': [
    { id: 'ac-24', nodeId: 'n-2-1', docName: '项目成员登记表', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '成员呈核时可一并上传，非必填', templateFile: '项目成员登记表模板.docx', enabled: true },
    { id: 'ac-25', nodeId: 'n-2-1', docName: '人员资质证书', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 10, archived: false, remark: '建造师证书、安全员证书等，呈核时选填', templateFile: '', enabled: true },
    { id: 'ac-26', nodeId: 'n-2-1', docName: '呈核请示附件', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', 'Word(doc/docx)', '图片(jpg/png/bmp)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '呈请领导审批的补充说明材料，非必填', templateFile: '呈核请示模板.docx', enabled: true },
  ],
  'n-2-3': [
    { id: 'ac-est-sup-1', nodeId: 'n-2-3', docName: '费用增补申请表', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '须经项目负责人签字确认，写明增补分项与金额', templateFile: '费用增补申请表模板.docx', enabled: true },
    { id: 'ac-est-sup-2', nodeId: 'n-2-3', docName: '增补测算依据', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Excel(xls/xlsx)', 'Word(doc/docx)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '工程量签证、报价单、变更费用测算等支撑材料', templateFile: '增补测算明细表模板.xlsx', enabled: true },
    { id: 'ac-est-sup-3', nodeId: 'n-2-3', docName: '相关证明材料', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)', '压缩包(zip/rar/7z)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 10, archived: false, remark: '现场照片、会议纪要、业主确认函等选填材料', templateFile: '', enabled: true },
  ],
  'n-plan-1': [
    { id: 'ac-plan-1', nodeId: 'n-plan-1', docName: '项目建议书', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '含项目建设必要性、初步方案及投资匡算', templateFile: '项目建议书模板.docx', enabled: true },
    { id: 'ac-plan-2', nodeId: 'n-plan-1', docName: '可行性研究报告', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '须为正式版可研报告，含投资估算与效益分析', templateFile: '可行性研究报告模板.docx', enabled: true },
  ],
  'n-plan-2': [
    { id: 'ac-jos-1', nodeId: 'n-plan-2', docName: '论证文件', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: true, required: false, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '仅限 word、pdf、excel、jpg 等常规格式文件，大小不超过 100MB', templateFile: '论证文件示例模板.docx', enabled: true },
  ],
  'n-init-1': [
    { id: 'ac-init-1', nodeId: 'n-init-1', docName: '建设工期附件', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: false, required: false, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '建设工期甘特图、节点计划等支撑材料', templateFile: '建设工期计划模板.xlsx', enabled: true },
    { id: 'ac-init-2', nodeId: 'n-init-1', docName: '论证文件', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '立项论证相关正式文件，须加盖单位公章', templateFile: '论证文件示例模板.docx', enabled: true },
  ],
  'n-sporadic-1': [
    { id: 'ac-sporadic-1', nodeId: 'n-sporadic-1', docName: '现场影像', type: '多选', versionManaged: false, required: true, fileFormats: ['图片(jpg/png/bmp)', '视频(mp4/avi)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '上传现场隐患点、施工过程及完工对比照片/视频等影像资料', templateFile: '现场影像拍摄要求说明.docx', enabled: true },
  ],
  'n-sporadic-2': [
    { id: 'ac-sporadic-plan-1', nodeId: 'n-sporadic-2', docName: '方案上传', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '上传零星工程施工方案、技术交底及安全措施等支撑材料', templateFile: '零星工程施工方案模板.docx', enabled: true },
  ],
  'n-sporadic-budget': [
    { id: 'ac-sporadic-budget-1', nodeId: 'n-sporadic-budget', docName: '预算明细表', type: '多选', versionManaged: true, required: true, fileFormats: ['Excel(xls/xlsx)', 'PDF'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '上传零星工程预算明细表，含费用分项及测算依据', templateFile: '零星工程预算明细表模板.xlsx', enabled: true },
  ],
  'n-meeting-1': [
    { id: 'ac-meet-1', nodeId: 'n-meeting-1', docName: '会议录音', type: '多选', versionManaged: true, required: false, fileFormats: ['其他'], fileSize: 200, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '支持 mp3/wav/m4a 等音频格式，建议单文件不超过 200MB', templateFile: '', enabled: true },
    { id: 'ac-meet-2', nodeId: 'n-meeting-1', docName: '会议纪要文本', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '正式会议纪要，须经主持人确认', templateFile: '会议纪要模板.docx', enabled: true },
    { id: 'ac-meet-3', nodeId: 'n-meeting-1', docName: '会议签到表', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)', 'Excel(xls/xlsx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '', templateFile: '会议签到表模板.xlsx', enabled: true },
    { id: 'ac-meet-4', nodeId: 'n-meeting-1', docName: '会议材料/PPT', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '压缩包(zip/rar/7z)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 15, archived: true, remark: '会前材料、汇报PPT、附图等', templateFile: '', enabled: true },
  ],
};

const seedConditionConfigs: Record<string, ConditionConfig[]> = {
  'n-1-5-1-2-1': [
    {
      id: 'cc-1',
      nodeId: 'n-1-5-1-2-1',
      conditionName: '总承包合同-技改项目验收要求',
      priority: 10,
      expression: makeExpr([
        {
          logic: 'AND',
          conditions: [
            { field: 'contractType', op: 'IN', value: ['总承包合同', '施工分包合同'] },
            { field: 'projectType', op: '=', value: '技改项目' },
          ],
        },
      ]),
      contractTypes: ['总承包合同', '施工分包合同'],
      projectTypes: ['技改项目'],
      status: 'enabled',
      attachments: [
        { id: 'cca-1', nodeId: 'n-1-5-1-2-1', docName: '总承包专项验收报告', type: '技改', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '总承包项目专用', templateFile: '总承包验收报告模板.docx', enabled: true },
        { id: 'cca-2', nodeId: 'n-1-5-1-2-1', docName: '分包工程质量评定表', type: '技改', versionManaged: false, required: true, fileFormats: ['PDF'], fileSize: 15, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '', templateFile: '', enabled: true },
      ],
    },
    {
      id: 'cc-2',
      nodeId: 'n-1-5-1-2-1',
      conditionName: '设备采购合同-设备验收要求',
      priority: 20,
      expression: makeExpr([
        {
          logic: 'AND',
          conditions: [
            { field: 'contractType', op: '=', value: '设备采购合同' },
            { field: 'projectType', op: 'IN', value: ['技改项目', '基建项目'] },
          ],
        },
      ]),
      contractTypes: ['设备采购合同'],
      projectTypes: ['技改项目', '基建项目'],
      status: 'enabled',
      attachments: [
        { id: 'cca-3', nodeId: 'n-1-5-1-2-1', docName: '设备到货验收单', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '', templateFile: '设备到货验收单模板.docx', enabled: true },
        { id: 'cca-4', nodeId: 'n-1-5-1-2-1', docName: '设备调试报告', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '含空载及负载调试数据', templateFile: '', enabled: true },
        { id: 'cca-5', nodeId: 'n-1-5-1-2-1', docName: '随机技术文件', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '压缩包(zip/rar/7z)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '设备说明书、图纸、合格证等', templateFile: '', enabled: true },
      ],
    },
  ],
  'n-1-5-4-1-1': [
    {
      id: 'cc-3',
      nodeId: 'n-1-5-4-1-1',
      conditionName: '施工分包-超期申请附件要求',
      priority: 10,
      expression: makeExpr([
        {
          logic: 'AND',
          conditions: [
            { field: 'contractType', op: '=', value: '施工分包合同' },
            { field: 'projectType', op: 'IN', value: ['技改项目', '维修项目'] },
          ],
        },
      ]),
      contractTypes: ['施工分包合同'],
      projectTypes: ['技改项目', '维修项目'],
      status: 'enabled',
      attachments: [
        { id: 'cca-6', nodeId: 'n-1-5-4-1-1', docName: '分包单位延期申请函', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '分包单位盖章确认', templateFile: '延期申请函模板.docx', enabled: true },
        { id: 'cca-7', nodeId: 'n-1-5-4-1-1', docName: '总包单位审核意见', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '', templateFile: '', enabled: true },
      ],
    },
    {
      id: 'cc-4',
      nodeId: 'n-1-5-4-1-1',
      conditionName: '超期超过30天加强材料',
      priority: 5,
      expression: makeExpr([
        {
          logic: 'AND',
          conditions: [
            { field: 'overdueDays', op: '>', value: 30 },
            { field: 'isOverdue', op: '=', value: true },
          ],
        },
      ]),
      status: 'enabled',
      attachments: [
        { id: 'cca-8', nodeId: 'n-1-5-4-1-1', docName: '超期专项分析报告', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '超期超过30天须附专项分析及赶工措施', templateFile: '超期专项分析报告模板.docx', enabled: true },
        { id: 'cca-9', nodeId: 'n-1-5-4-1-1', docName: '赶工计划表', type: '多选', versionManaged: false, required: true, fileFormats: ['Excel(xls/xlsx)', 'PDF'], fileSize: 15, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '', templateFile: '赶工计划表模板.xlsx', enabled: true },
      ],
    },
  ],
  'n-1-4-1-1': [
    {
      id: 'cc-5',
      nodeId: 'n-1-4-1-1',
      conditionName: '大额合同开工加强材料',
      priority: 10,
      expression: makeExpr([
        {
          logic: 'AND',
          conditions: [
            { field: 'contractAmount', op: '>=', value: 500 },
            { field: 'contractType', op: 'IN', value: ['总承包合同', '施工分包合同'] },
          ],
        },
      ]),
      contractTypes: ['总承包合同', '施工分包合同'],
      status: 'enabled',
      attachments: [
        { id: 'cca-10', nodeId: 'n-1-4-1-1', docName: '大额合同风险评估报告', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '合同金额≥500万元须附风险评估', templateFile: '风险评估报告模板.docx', enabled: true },
        { id: 'cca-11', nodeId: 'n-1-4-1-1', docName: '应急预案', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '', templateFile: '', enabled: true },
      ],
    },
    {
      id: 'cc-6',
      nodeId: 'n-1-4-1-1',
      conditionName: '未签安全协议补充要求',
      priority: 20,
      expression: makeExpr([
        {
          logic: 'OR',
          conditions: [
            { field: 'hasSafetyProtocol', op: '=', value: false },
            { field: 'hasSafetyProtocol', op: 'EMPTY', value: null },
          ],
        },
      ]),
      status: 'enabled',
      attachments: [
        { id: 'cca-12', nodeId: 'n-1-4-1-1', docName: '安全协议补签说明', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '未签署安全协议时须说明原因并附补签计划', templateFile: '', enabled: true },
      ],
    },
  ],
};

export let attachmentConfigs: Record<string, AttachmentConfig[]> = JSON.parse(JSON.stringify(seedAttachmentConfigs));
export let conditionConfigs: Record<string, ConditionConfig[]> = JSON.parse(JSON.stringify(seedConditionConfigs));

// ---------- 规则引擎 ----------

const OP_LABEL: Record<RuleOperator, string> = {
  '=': '等于',
  '!=': '不等于',
  IN: '属于',
  NOT_IN: '不属于',
  '>': '大于',
  '>=': '大于等于',
  '<': '小于',
  '<=': '小于等于',
  EMPTY: '为空',
  NOT_EMPTY: '不为空',
};

function formatValue(v: RuleCondition['value']): string {
  if (v === null || v === undefined) return '空';
  if (Array.isArray(v)) return `[${v.join('、')}]`;
  if (typeof v === 'boolean') return v ? '是' : '否';
  return String(v);
}

export function formatRuleExpression(expr: RuleExpression | undefined | null): string {
  if (!expr || !expr.groups?.length) return '（无规则）';
  const groupTexts = expr.groups.map((g) => {
    if (!g.conditions?.length) return '（空组）';
    const parts = g.conditions.map((c) => {
      const fname = FIELD_NAME_MAP[c.field] || c.field;
      const op = OP_LABEL[c.op] || c.op;
      if (c.op === 'EMPTY' || c.op === 'NOT_EMPTY') return `${fname} ${op}`;
      return `${fname} ${op} ${formatValue(c.value)}`;
    });
    const joined = parts.join(` ${g.logic === 'OR' ? '或' : '且'} `);
    return g.conditions.length > 1 ? `(${joined})` : joined;
  });
  return groupTexts.join(` ${expr.logic === 'OR' ? '或' : '且'} `);
}

function isEmptyValue(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

function evalCondition(cond: RuleCondition, context: Record<string, unknown>): boolean {
  const raw = context[cond.field];
  switch (cond.op) {
    case 'EMPTY':
      return isEmptyValue(raw);
    case 'NOT_EMPTY':
      return !isEmptyValue(raw);
    case '=':
      if (typeof cond.value === 'boolean') return Boolean(raw) === cond.value;
      return String(raw) === String(cond.value);
    case '!=':
      if (typeof cond.value === 'boolean') return Boolean(raw) !== cond.value;
      return String(raw) !== String(cond.value);
    case 'IN': {
      const list = Array.isArray(cond.value) ? cond.value.map(String) : [String(cond.value)];
      return list.includes(String(raw));
    }
    case 'NOT_IN': {
      const list = Array.isArray(cond.value) ? cond.value.map(String) : [String(cond.value)];
      return !list.includes(String(raw));
    }
    case '>':
    case '>=':
    case '<':
    case '<=': {
      const left = Number(raw);
      const right = Number(cond.value);
      if (Number.isNaN(left) || Number.isNaN(right)) return false;
      if (cond.op === '>') return left > right;
      if (cond.op === '>=') return left >= right;
      if (cond.op === '<') return left < right;
      return left <= right;
    }
    default:
      return false;
  }
}

function evalGroup(group: RuleGroup, context: Record<string, unknown>): boolean {
  if (!group.conditions?.length) return true;
  if (group.logic === 'OR') return group.conditions.some((c) => evalCondition(c, context));
  return group.conditions.every((c) => evalCondition(c, context));
}

export function evalRuleExpression(expr: RuleExpression | undefined | null, context: Record<string, unknown>): boolean {
  if (!expr || !expr.groups?.length) return false;
  if (expr.logic === 'OR') return expr.groups.some((g) => evalGroup(g, context));
  return expr.groups.every((g) => evalGroup(g, context));
}

export function createEmptyRuleExpression(): RuleExpression {
  return emptyExpr();
}

export function getMountPoint(bizCode: string): MountPoint | undefined {
  return mountPoints.find((m) => m.bizCode === bizCode && m.enabled);
}

export function getAvailableMountPoints(excludeBizCode?: string | null): MountPoint[] {
  const store = loadArchiveConfigStore();
  const bound = new Set(
    store.nodes
      .filter((n) => n.nodeKind === 'mount' && n.bizCode && n.bizCode !== excludeBizCode)
      .map((n) => n.bizCode as string),
  );
  return mountPoints.filter((m) => m.enabled && (!bound.has(m.bizCode) || m.bizCode === excludeBizCode));
}

export function getConditionFieldsForBizCode(bizCode: string | null | undefined): ConditionFieldDef[] {
  if (!bizCode) return conditionFieldDefs;
  const mp = getMountPoint(bizCode);
  if (!mp) return conditionFieldDefs;
  return conditionFieldDefs.filter((f) => mp.fieldCodes.includes(f.code));
}

export interface ResolveAttachmentResult {
  node: FunctionNode | null;
  matchedRule: ConditionConfig | null;
  attachments: AttachmentConfig[];
  source: 'condition' | 'general';
}

export function resolveAttachmentSchema(
  bizCode: string,
  context: Record<string, unknown> = {},
): ResolveAttachmentResult {
  const store = loadArchiveConfigStore();
  const node =
    store.nodes.find((n) => n.nodeKind === 'mount' && n.enabled && n.bizCode === bizCode) || null;
  if (!node) {
    return { node: null, matchedRule: null, attachments: [], source: 'general' };
  }
  const rules = (store.conditionConfigs[node.id] || [])
    .filter((r) => r.status === 'enabled')
    .slice()
    .sort((a, b) => a.priority - b.priority);
  for (const rule of rules) {
    if (evalRuleExpression(rule.expression, context)) {
      return {
        node,
        matchedRule: rule,
        attachments: (rule.attachments || []).filter((a) => a.enabled),
        source: 'condition',
      };
    }
  }
  const general = (store.attachmentConfigs[node.id] || []).filter((a) => a.enabled);
  return { node, matchedRule: null, attachments: general, source: 'general' };
}

// ---------- Store / CRUD ----------

function buildSeedStore(): ArchiveConfigStore {
  return {
    nodes: seedFunctionNodeTree.map((n) => ({ ...n })),
    attachmentConfigs: JSON.parse(JSON.stringify(seedAttachmentConfigs)),
    conditionConfigs: JSON.parse(JSON.stringify(seedConditionConfigs)),
  };
}

function syncModuleExports(store: ArchiveConfigStore) {
  functionNodeTree = store.nodes;
  attachmentConfigs = store.attachmentConfigs;
  conditionConfigs = store.conditionConfigs;
}

export function loadArchiveConfigStore(): ArchiveConfigStore {
  if (typeof localStorage === 'undefined') {
    const seed = buildSeedStore();
    syncModuleExports(seed);
    return seed;
  }
  try {
    const raw = localStorage.getItem(ARCHIVE_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ArchiveConfigStore;
      if (parsed?.nodes?.length) {
        syncModuleExports(parsed);
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  const seed = buildSeedStore();
  saveArchiveConfigStore(seed);
  return seed;
}

export function saveArchiveConfigStore(store: ArchiveConfigStore): void {
  syncModuleExports(store);
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(ARCHIVE_CONFIG_STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

export function recalcNodeConfigStatus(nodeId: string, store?: ArchiveConfigStore): FunctionNode['configStatus'] {
  const s = store || loadArchiveConfigStore();
  const general = s.attachmentConfigs[nodeId] || [];
  const conditions = s.conditionConfigs[nodeId] || [];
  const enabledGeneral = general.filter((a) => a.enabled).length;
  const enabledCond = conditions.filter((c) => c.status === 'enabled').length;
  if (enabledGeneral === 0 && enabledCond === 0) {
    if (general.length === 0 && conditions.length === 0) return 'unconfigured';
    return 'partial';
  }
  if (enabledGeneral > 0 && (enabledCond > 0 || conditions.length === 0)) {
    if (general.some((a) => !a.enabled) || conditions.some((c) => c.status === 'disabled')) return 'partial';
    return 'configured';
  }
  if (enabledGeneral > 0 || enabledCond > 0) return 'partial';
  return 'unconfigured';
}

function rebuildPath(nodes: FunctionNode[], nodeId: string): string {
  const parts: string[] = [];
  let currentId: string | null = nodeId;
  while (currentId) {
    const node = nodes.find((n) => n.id === currentId);
    if (!node) break;
    parts.unshift(node.name);
    currentId = node.parentId;
  }
  return parts.join(' > ');
}

export function upsertNode(
  input: Partial<FunctionNode> & { name: string; parentId: string | null; nodeKind: 'folder' | 'mount' },
): { ok: true; node: FunctionNode } | { ok: false; message: string } {
  const store = loadArchiveConfigStore();
  const parent = input.parentId ? store.nodes.find((n) => n.id === input.parentId) : null;
  if (input.parentId && !parent) return { ok: false, message: '父节点不存在' };

  if (input.id) {
    const idx = store.nodes.findIndex((n) => n.id === input.id);
    if (idx < 0) return { ok: false, message: '节点不存在' };
    const prev = store.nodes[idx];
    if (input.bizCode && input.bizCode !== prev.bizCode) {
      const conflict = store.nodes.find(
        (n) => n.id !== prev.id && n.nodeKind === 'mount' && n.bizCode === input.bizCode,
      );
      if (conflict) return { ok: false, message: `挂载点 ${input.bizCode} 已被节点「${conflict.name}」绑定` };
    }
    const next: FunctionNode = {
      ...prev,
      ...input,
      id: prev.id,
      level: parent ? parent.level + 1 : input.level || prev.level,
      path: prev.path,
      nodeKind: input.nodeKind || prev.nodeKind,
      bizCode: (input.nodeKind || prev.nodeKind) === 'mount'
        ? (input.bizCode !== undefined ? input.bizCode : prev.bizCode)
        : null,
    };
    store.nodes[idx] = next;
    store.nodes.forEach((n) => {
      n.path = rebuildPath(store.nodes, n.id);
    });
    store.nodes[idx].configStatus = recalcNodeConfigStatus(next.id, store);
    saveArchiveConfigStore(store);
    return { ok: true, node: store.nodes.find((n) => n.id === next.id)! };
  }

  if (input.nodeKind === 'mount' && input.bizCode) {
    const conflict = store.nodes.find((n) => n.nodeKind === 'mount' && n.bizCode === input.bizCode);
    if (conflict) return { ok: false, message: `挂载点 ${input.bizCode} 已被节点「${conflict.name}」绑定` };
  }

  const id = input.id || `n-custom-${Date.now().toString(36)}`;
  const node: FunctionNode = {
    id,
    name: input.name,
    level: parent ? parent.level + 1 : input.level || 1,
    parentId: input.parentId,
    path: '',
    configStatus: 'unconfigured',
    nodeKind: input.nodeKind,
    bizCode: input.nodeKind === 'mount' ? input.bizCode || null : null,
    enabled: input.enabled !== false,
  };
  store.nodes.push(node);
  node.path = rebuildPath(store.nodes, node.id);
  saveArchiveConfigStore(store);
  return { ok: true, node };
}

export function removeNode(
  nodeId: string,
  opts?: { cascade?: boolean },
): { ok: true } | { ok: false; message: string; hasChildren?: boolean } {
  const store = loadArchiveConfigStore();
  const children = store.nodes.filter((n) => n.parentId === nodeId);
  if (children.length > 0 && !opts?.cascade) {
    return { ok: false, message: '该节点下存在子节点，请先删除子节点或选择级联删除', hasChildren: true };
  }
  const toRemove = new Set<string>([nodeId]);
  if (opts?.cascade) {
    const walk = (pid: string) => {
      store.nodes.filter((n) => n.parentId === pid).forEach((c) => {
        toRemove.add(c.id);
        walk(c.id);
      });
    };
    walk(nodeId);
  }
  store.nodes = store.nodes.filter((n) => !toRemove.has(n.id));
  toRemove.forEach((id) => {
    delete store.attachmentConfigs[id];
    delete store.conditionConfigs[id];
  });
  saveArchiveConfigStore(store);
  return { ok: true };
}

export function bindNodeMountPoint(
  nodeId: string,
  bizCode: string | null,
): { ok: true; node: FunctionNode } | { ok: false; message: string } {
  const store = loadArchiveConfigStore();
  const idx = store.nodes.findIndex((n) => n.id === nodeId);
  if (idx < 0) return { ok: false, message: '节点不存在' };
  const node = store.nodes[idx];
  if (node.nodeKind !== 'mount') return { ok: false, message: '仅挂载点类型节点可绑定业务编码' };
  if (bizCode) {
    const mp = getMountPoint(bizCode);
    if (!mp) return { ok: false, message: '挂载点不存在或未启用' };
    const conflict = store.nodes.find(
      (n) => n.id !== nodeId && n.nodeKind === 'mount' && n.bizCode === bizCode,
    );
    if (conflict) return { ok: false, message: `挂载点已被节点「${conflict.name}」绑定` };
  }
  store.nodes[idx] = { ...node, bizCode };
  saveArchiveConfigStore(store);
  return { ok: true, node: store.nodes[idx] };
}

export function setNodeEnabled(nodeId: string, enabled: boolean): void {
  const store = loadArchiveConfigStore();
  const idx = store.nodes.findIndex((n) => n.id === nodeId);
  if (idx < 0) return;
  store.nodes[idx] = { ...store.nodes[idx], enabled };
  saveArchiveConfigStore(store);
}

export function saveAttachmentConfigsForNode(nodeId: string, list: AttachmentConfig[]): void {
  const store = loadArchiveConfigStore();
  store.attachmentConfigs[nodeId] = list;
  const idx = store.nodes.findIndex((n) => n.id === nodeId);
  if (idx >= 0) {
    store.nodes[idx] = { ...store.nodes[idx], configStatus: recalcNodeConfigStatus(nodeId, store) };
  }
  saveArchiveConfigStore(store);
}

export function saveConditionConfigsForNode(nodeId: string, list: ConditionConfig[]): void {
  const store = loadArchiveConfigStore();
  store.conditionConfigs[nodeId] = list;
  const idx = store.nodes.findIndex((n) => n.id === nodeId);
  if (idx >= 0) {
    store.nodes[idx] = { ...store.nodes[idx], configStatus: recalcNodeConfigStatus(nodeId, store) };
  }
  saveArchiveConfigStore(store);
}

export function getChildNodes(parentId: string | null): FunctionNode[] {
  return loadArchiveConfigStore().nodes.filter((n) => n.parentId === parentId);
}

export function getNodeById(id: string): FunctionNode | undefined {
  return loadArchiveConfigStore().nodes.find((n) => n.id === id);
}

export function getNodePath(nodeId: string): string {
  const node = getNodeById(nodeId);
  return node?.path || '';
}

export function getNodeIdByBizCode(bizCode: string): string | undefined {
  return loadArchiveConfigStore().nodes.find((n) => n.bizCode === bizCode)?.id;
}

export function getAttachmentConfigs(nodeId: string): AttachmentConfig[] {
  return loadArchiveConfigStore().attachmentConfigs[nodeId] || [];
}

export function getConditionConfigs(nodeId: string): ConditionConfig[] {
  return loadArchiveConfigStore().conditionConfigs[nodeId] || [];
}

/** 年度计划申报节点 ID（与项目档案配置树一致） */
export const PLAN_DECLARATION_NODE_ID = 'n-plan-1';
export const JOINT_OPINION_SIGN_NODE_ID = 'n-plan-2';
export const INITIATION_DECLARATION_NODE_ID = 'n-init-1';
export const PROJECT_MEMBER_MANAGE_NODE_ID = 'n-2-1';
export const ESTIMATE_FEE_SUPPLEMENT_NODE_ID = 'n-2-3';
export const SPORADIC_AGREEMENT_NODE_ID = 'n-sporadic-1';
export const SPORADIC_PLAN_UPLOAD_NODE_ID = 'n-sporadic-2';
export const SPORADIC_BUDGET_UPLOAD_NODE_ID = 'n-sporadic-budget';
export const MEETING_MINUTES_NODE_ID = 'n-meeting-1';

export function getPlanDeclarationAttachmentConfigs(majorType: string): AttachmentConfig[] {
  return getAttachmentConfigs(PLAN_DECLARATION_NODE_ID).filter((c) => {
    if (!c.enabled) return false;
    if (!c.projectMajorTypes || c.projectMajorTypes.length === 0) return true;
    return c.projectMajorTypes.includes(majorType);
  });
}

export function getJointOpinionSignAttachmentConfigs(majorType?: string): AttachmentConfig[] {
  return getAttachmentConfigs(JOINT_OPINION_SIGN_NODE_ID).filter((c) => {
    if (!c.enabled) return false;
    if (!c.projectMajorTypes || c.projectMajorTypes.length === 0) return true;
    if (!majorType) return true;
    return c.projectMajorTypes.includes(majorType);
  });
}

/** 项目成员呈核附件：一律按选填渲染（与档案配置同源） */
export function getProjectMemberPresentAttachmentConfigs(): AttachmentConfig[] {
  return getAttachmentConfigs(PROJECT_MEMBER_MANAGE_NODE_ID)
    .filter((c) => c.enabled)
    .map((c) => ({ ...c, required: false }));
}

/** 项目概算管理 · 费用增补申请附件 */
export function getEstimateFeeSupplementAttachmentConfigs(): AttachmentConfig[] {
  return getAttachmentConfigs(ESTIMATE_FEE_SUPPLEMENT_NODE_ID).filter((c) => c.enabled);
}

export function getInitiationDeclarationAttachmentConfigs(majorType: string): AttachmentConfig[] {
  if (majorType === '新建' || majorType === '技改' || majorType === '营缮' || majorType === '零固') {
    return getAttachmentConfigs(INITIATION_DECLARATION_NODE_ID).filter((c) => {
      if (!c.enabled) return false;
      if (!c.projectMajorTypes || c.projectMajorTypes.length === 0) return true;
      return c.projectMajorTypes.includes(majorType) || c.projectMajorTypes.includes('新建');
    });
  }
  return getPlanDeclarationAttachmentConfigs(majorType);
}

export function getSporadicAgreementAttachmentConfigs(): AttachmentConfig[] {
  return getAttachmentConfigs(SPORADIC_AGREEMENT_NODE_ID).filter((c) => c.enabled);
}

export function getSporadicPlanUploadAttachmentConfigs(): AttachmentConfig[] {
  return getAttachmentConfigs(SPORADIC_PLAN_UPLOAD_NODE_ID).filter((c) => c.enabled);
}

export function getSporadicBudgetUploadAttachmentConfigs(): AttachmentConfig[] {
  return getAttachmentConfigs(SPORADIC_BUDGET_UPLOAD_NODE_ID).filter((c) => c.enabled);
}

/** 会议纪要固定节点附件配置（档案管理详情手动上传） */
export function getMeetingMinutesAttachmentConfigs(): AttachmentConfig[] {
  return getAttachmentConfigs(MEETING_MINUTES_NODE_ID).filter((c) => c.enabled);
}

export const fileFormatOptions = [
  'PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)',
  'CAD(dwg/dxf)', '压缩包(zip/rar/7z)', '视频(mp4/avi)', '其他',
];

export const docTypeOptions = ['技改', '维修', '基建', '多选'];

export const costTypeOptions = ['设计', '建安', '监理', '其他', '设备', '总包', '设备维修'];

export const approvalTemplates = [
  { id: 'at-1', name: '标准审批流程（3节点）', nodes: ['项目部负责人', '主管部门审批', '公司领导审批'] },
  { id: 'at-2', name: '简易审批流程（2节点）', nodes: ['项目部负责人', '主管部门审批'] },
  { id: 'at-3', name: '多部门会签流程', nodes: ['项目部负责人', '技术部门会签', '安全部门会签', '主管领导审批'] },
];

export const ruleOperatorOptions: { value: RuleOperator; label: string }[] = [
  { value: '=', label: '等于' },
  { value: '!=', label: '不等于' },
  { value: 'IN', label: '属于' },
  { value: 'NOT_IN', label: '不属于' },
  { value: '>', label: '大于' },
  { value: '>=', label: '大于等于' },
  { value: '<', label: '小于' },
  { value: '<=', label: '小于等于' },
  { value: 'EMPTY', label: '为空' },
  { value: 'NOT_EMPTY', label: '不为空' },
];

// 初始化：同步一次 store
if (typeof localStorage !== 'undefined') {
  loadArchiveConfigStore();
}
