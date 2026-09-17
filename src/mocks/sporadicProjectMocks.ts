import type { ResearchPersonRow } from './projectPlans';
import { defaultResearchPersons } from './projectPlans';

/** 零星工程项目管理 — 演示数据（5万以内零星施工） */

/* ========== 框架合同 ========== */

export type FrameworkContractStatus = 'executing' | 'expired' | 'terminated' | 'pending_sign';

export interface FrameworkContractRecord {
  id: string;
  contractNo: string;
  contractName: string;
  supplierName: string;
  supplierNo: string;
  mainContent: string;
  signDate: string;
  status: FrameworkContractStatus;
  amountLimit: number;
  /** 施工单位负责人（选择合同后带出，可改） */
  contractorContact: string;
  /** 负责人联系方式 */
  contractorPhone: string;
}

export const FRAMEWORK_CONTRACT_STORAGE_KEY = 'ng_sporadic_framework_v1';

export const frameworkContractStatusMap: Record<
  FrameworkContractStatus,
  { label: string; cls: string }
> = {
  pending_sign: { label: '待签订', cls: 'bg-amber-100 text-amber-700' },
  executing: { label: '执行中', cls: 'bg-emerald-100 text-emerald-700' },
  expired: { label: '已到期', cls: 'bg-slate-100 text-steel-500' },
  terminated: { label: '已终止', cls: 'bg-red-100 text-red-600' },
};

export const frameworkContractStatusOptions: { value: FrameworkContractStatus | ''; label: string }[] = [
  { value: '', label: '全部状态' },
  { value: 'pending_sign', label: '待签订' },
  { value: 'executing', label: '执行中' },
  { value: 'expired', label: '已到期' },
  { value: 'terminated', label: '已终止' },
];

export const frameworkSuppliers = [
  '中国五冶集团有限公司',
  '中冶建工集团有限公司',
  '江苏华能建设集团有限公司',
  '南京钢铁附属工程公司',
  '安徽马钢建设集团有限公司',
  '上海宝冶集团有限公司',
];

/** 框架合同演示数据：覆盖全部合同状态 */
export const frameworkContractRecords: FrameworkContractRecord[] = [
  {
    id: 'fc-01', contractNo: 'KJ-2026-001', contractName: '炼铁厂零星土建框架合同',
    supplierName: '中国五冶集团有限公司', supplierNo: 'CBS-1001',
    mainContent: '炼铁区域零星土建、构筑物修补、地坪修复等施工',
    signDate: '2026-01-08', status: 'executing', amountLimit: 500,
    contractorContact: '刘建国', contractorPhone: '13900010001',
  },
  {
    id: 'fc-02', contractNo: 'KJ-2026-002', contractName: '炼钢厂机电零星维修框架合同',
    supplierName: '中冶建工集团有限公司', supplierNo: 'CBS-1008',
    mainContent: '炼钢工序机电设备零星维修、管道更换、支架加固',
    signDate: '2026-01-15', status: 'executing', amountLimit: 480,
    contractorContact: '陈志远', contractorPhone: '13900010008',
  },
  {
    id: 'fc-03', contractNo: 'KJ-2026-003', contractName: '热轧厂液压管路零星施工框架合同',
    supplierName: '江苏华能建设集团有限公司', supplierNo: 'CBS-1022',
    mainContent: '热轧区域液压管路、阀门、密封件零星更换施工',
    signDate: '2026-02-01', status: 'pending_sign', amountLimit: 300,
    contractorContact: '赵明', contractorPhone: '13900010022',
  },
  {
    id: 'fc-04', contractNo: 'KJ-2025-018', contractName: '动力厂电气零星工程框架合同',
    supplierName: '上海宝冶集团有限公司', supplierNo: 'CBS-1035',
    mainContent: '配电柜检修、电缆敷设、接地改造等零星电气工程',
    signDate: '2025-03-12', status: 'expired', amountLimit: 450,
    contractorContact: '黄伟', contractorPhone: '13900010035',
  },
  {
    id: 'fc-05', contractNo: 'KJ-2025-022', contractName: '原料厂通廊防腐零星框架合同',
    supplierName: '安徽马钢建设集团有限公司', supplierNo: 'CBS-1041',
    mainContent: '皮带通廊防腐、栏杆更换、漏斗修补等',
    signDate: '2025-05-20', status: 'terminated', amountLimit: 280,
    contractorContact: '钱磊', contractorPhone: '13900010041',
  },
  {
    id: 'fc-06', contractNo: 'KJ-2026-004', contractName: '冷轧厂水处理零星框架合同',
    supplierName: '南京钢铁附属工程公司', supplierNo: 'CBS-1050',
    mainContent: '水处理站管道、泵组底座、地沟盖板等零星施工',
    signDate: '2026-02-18', status: 'executing', amountLimit: 350,
    contractorContact: '孙立', contractorPhone: '13900010050',
  },
  {
    id: 'fc-07', contractNo: 'KJ-2026-005', contractName: '工程管理部厂区道路零星维修框架合同',
    supplierName: '中国五冶集团有限公司', supplierNo: 'CBS-1001',
    mainContent: '厂区道路坑槽修补、井盖更换、排水沟清淤',
    signDate: '2026-03-01', status: 'executing', amountLimit: 200,
    contractorContact: '刘建国', contractorPhone: '13900010001',
  },
  {
    id: 'fc-08', contractNo: 'KJ-2024-031', contractName: '设备管理部起重设施零星框架合同',
    supplierName: '中冶建工集团有限公司', supplierNo: 'CBS-1008',
    mainContent: '行车轨道调整、限位开关更换、缓冲器检修',
    signDate: '2024-08-10', status: 'expired', amountLimit: 400,
    contractorContact: '陈志远', contractorPhone: '13900010008',
  },
  {
    id: 'fc-09', contractNo: 'KJ-2026-006', contractName: '烧结区域环保设施零星框架合同',
    supplierName: '江苏华能建设集团有限公司', supplierNo: 'CBS-1022',
    mainContent: '除尘管道修补、密封改造、风机基础加固',
    signDate: '2026-03-10', status: 'pending_sign', amountLimit: 320,
    contractorContact: '赵明', contractorPhone: '13900010022',
  },
  {
    id: 'fc-10', contractNo: 'KJ-2025-040', contractName: '特钢连铸区域零星施工框架合同',
    supplierName: '上海宝冶集团有限公司', supplierNo: 'CBS-1035',
    mainContent: '连铸二冷区平台加固、护栏更新、地坪修复',
    signDate: '2025-11-05', status: 'terminated', amountLimit: 260,
    contractorContact: '黄伟', contractorPhone: '13900010035',
  },
];

/* ========== 零星协议单 ========== */

export type SporadicAgreementStatus =
  | 'draft'
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export type SporadicProjectType = '土建' | '机电' | '电气' | '防腐' | '管道' | '其他';

export interface SporadicAttachmentFile {
  id: string;
  name: string;
  size: number;
}

/** 附件上传：key = 档案配置项 id（如 ac-sporadic-1 现场影像） */
export type SporadicAttachmentMap = Record<string, SporadicAttachmentFile[]>;

/** 方案/预算审批状态 */
export type SporadicUploadApproveStatus =
  | 'none'
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export const sporadicUploadApproveStatusMap: Record<
  SporadicUploadApproveStatus,
  { label: string; cls: string }
> = {
  none: { label: '未上传', cls: 'bg-slate-100 text-steel-500' },
  pending: { label: '待审批', cls: 'bg-amber-100 text-amber-700' },
  reviewing: { label: '审批中', cls: 'bg-sky-100 text-sky-700' },
  approved: { label: '已通过', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: '已驳回', cls: 'bg-red-100 text-red-600' },
  withdrawn: { label: '已撤回', cls: 'bg-orange-100 text-orange-600' },
};

export const sporadicUploadApproveStatusOptions: { value: SporadicUploadApproveStatus | ''; label: string }[] = [
  { value: '', label: '全部状态' },
  { value: 'none', label: '未上传' },
  { value: 'pending', label: '待审批' },
  { value: 'reviewing', label: '审批中' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已驳回' },
  { value: 'withdrawn', label: '已撤回' },
];

/** 预算费用概算 */
export interface SporadicBudgetEstimate {
  designFee: number;
  jianAnFee: number;
  equipmentFee: number;
  otherFee: number;
  designFeeRemark?: string;
  jianAnFeeRemark?: string;
  equipmentFeeRemark?: string;
  otherFeeRemark?: string;
}

export function emptyBudgetEstimate(): SporadicBudgetEstimate {
  return {
    designFee: 0,
    jianAnFee: 0,
    equipmentFee: 0,
    otherFee: 0,
    designFeeRemark: '',
    jianAnFeeRemark: '',
    equipmentFeeRemark: '',
    otherFeeRemark: '',
  };
}

export function calcBudgetEstimateTotal(e: SporadicBudgetEstimate): number {
  return (
    (Number(e.designFee) || 0)
    + (Number(e.jianAnFee) || 0)
    + (Number(e.equipmentFee) || 0)
    + (Number(e.otherFee) || 0)
  );
}

export type SporadicIssueStatus = 'none' | 'pending' | 'issued';

export const sporadicIssueStatusMap: Record<SporadicIssueStatus, { label: string; cls: string }> = {
  none: { label: '未进入签发', cls: 'bg-slate-100 text-steel-500' },
  pending: { label: '待签发', cls: 'bg-amber-100 text-amber-700' },
  issued: { label: '已签发', cls: 'bg-emerald-100 text-emerald-700' },
};

export interface SporadicAgreementRecord {
  id: string;
  declareName: string;
  /** 是否紧急抢修 */
  isUrgent: boolean;
  projectType: SporadicProjectType;
  projectManager: string;
  projectManagerId?: string;
  projectManagerPhone: string;
  /** 分管领导 */
  leaderName?: string;
  leaderId?: string;
  startDate: string;
  endDate: string;
  /** 实施年度 */
  implementYear?: string;
  declareTime: string;
  supplierName: string;
  supplierNo: string;
  /** 施工单位负责人（可改） */
  supplierContact: string;
  supplierPhone: string;
  status: SporadicAgreementStatus;
  frameworkContractId: string;
  frameworkContractNo: string;
  frameworkContractName?: string;
  submitUnit: string;
  /** 概算（万元） */
  budgetAmount?: number;
  /** 列表兼容：概算金额 */
  amount: number;
  declareDetail?: string;
  currentStatus?: string;
  necessity?: string;
  mainContent?: string;
  researchPersons?: ResearchPersonRow[];
  /** 附件（依据档案配置：现场影像） */
  attachments?: SporadicAttachmentMap;
  /** 方案审批 */
  planStatus?: SporadicUploadApproveStatus;
  planUploader?: string;
  planUploadTime?: string;
  planAttachments?: SporadicAttachmentMap;
  /** 预算审批 */
  budgetStatus?: SporadicUploadApproveStatus;
  budgetUploader?: string;
  budgetUploadTime?: string;
  budgetEstimate?: SporadicBudgetEstimate;
  /** 签发状态 */
  issueStatus?: SporadicIssueStatus;
  issuer?: string;
  issueTime?: string;
}

export const AGREEMENT_DECLARE_STORAGE_KEY = 'ng_sporadic_agreement_v6';

const SITE_IMAGE_CONFIG_ID = 'ac-sporadic-1';
const PLAN_DOC_CONFIG_ID = 'ac-sporadic-plan-1';

const PLAN_STATUS_CYCLE: SporadicUploadApproveStatus[] = [
  'none', 'pending', 'reviewing', 'approved', 'rejected', 'withdrawn', 'pending', 'approved',
];
const BUDGET_STATUS_CYCLE: SporadicUploadApproveStatus[] = [
  'pending', 'none', 'approved', 'reviewing', 'withdrawn', 'rejected', 'approved', 'none',
];
/** 签发演示：保证待签发/已签发各不少于 5 条，其余不进入签发池 */
const ISSUE_STATUS_CYCLE: SporadicIssueStatus[] = [
  'pending', 'pending', 'issued', 'issued', 'none', 'pending', 'issued', 'pending',
];

function demoIndexFromId(id: string): number {
  const m = id.match(/(\d+)$/);
  return m ? (Number(m[1]) - 1) : 0;
}

function demoSiteImageAttachments(recordId: string, declareName: string): SporadicAttachmentMap {
  return {
    [SITE_IMAGE_CONFIG_ID]: [
      {
        id: `${recordId}-site-1`,
        name: `${declareName || '现场'}-隐患点照片.jpg`,
        size: 2_458_112,
      },
      {
        id: `${recordId}-site-2`,
        name: `${declareName || '现场'}-施工过程.mp4`,
        size: 18_632_704,
      },
    ],
  };
}

function demoPlanAttachments(recordId: string, declareName: string): SporadicAttachmentMap {
  return {
    [PLAN_DOC_CONFIG_ID]: [
      {
        id: `${recordId}-plan-1`,
        name: `${declareName || '协议'}-方案上传.pdf`,
        size: 1_048_576,
      },
    ],
  };
}

function demoBudgetEstimate(amount: number): SporadicBudgetEstimate {
  const total = amount > 0 ? amount : 2.5;
  const jianAn = Number((total * 0.6).toFixed(2));
  const design = Number((total * 0.15).toFixed(2));
  const equipment = Number((total * 0.15).toFixed(2));
  const other = Number(Math.max(0, total - jianAn - design - equipment).toFixed(2));
  return {
    designFee: design,
    jianAnFee: jianAn,
    equipmentFee: equipment,
    otherFee: other,
    designFeeRemark: '',
    jianAnFeeRemark: '含人工及辅材',
    equipmentFeeRemark: '',
    otherFeeRemark: '',
  };
}

/** 已签订框架合同（可选合同弹窗） */
export function getSignedFrameworkContracts(): FrameworkContractRecord[] {
  return frameworkContractRecords.filter((c) => c.status !== 'pending_sign');
}

export interface SporadicStaffPerson {
  id: string;
  empNo: string;
  name: string;
  phone: string;
  unit: string;
  position: string;
  /** 分管领导可选 */
  isLeader?: boolean;
}

export const sporadicStaffDirectory: SporadicStaffPerson[] = [
  { id: 'st-01', empNo: 'E1001', name: '王强', phone: '13700001111', unit: '炼铁厂', position: '项目负责人' },
  { id: 'st-02', empNo: 'E1002', name: '张伟', phone: '13800002222', unit: '炼钢厂', position: '项目负责人' },
  { id: 'st-03', empNo: 'E1003', name: '周涛', phone: '13600003333', unit: '热轧厂', position: '项目负责人' },
  { id: 'st-04', empNo: 'E1004', name: '吴晓燕', phone: '13500004444', unit: '动力厂', position: '项目负责人' },
  { id: 'st-05', empNo: 'E1005', name: '李明', phone: '13400005555', unit: '原料厂', position: '项目负责人' },
  { id: 'st-06', empNo: 'E1006', name: '孙丽', phone: '13300006666', unit: '冷轧厂', position: '项目负责人' },
  { id: 'st-07', empNo: 'E1007', name: '陈建华', phone: '13200007777', unit: '工程管理部', position: '项目负责人' },
  { id: 'st-08', empNo: 'E1008', name: '小明', phone: '15691993333', unit: '炼铁厂', position: '项目负责人' },
  { id: 'st-l1', empNo: 'L2001', name: '李副总', phone: '13988880001', unit: '公司领导', position: '分管领导', isLeader: true },
  { id: 'st-l2', empNo: 'L2002', name: '王总工', phone: '13988880002', unit: '公司领导', position: '分管领导', isLeader: true },
  { id: 'st-l3', empNo: 'L2003', name: '赵书记', phone: '13988880003', unit: '公司领导', position: '分管领导', isLeader: true },
];

export function emptyAgreementForm(): SporadicAgreementRecord {
  return {
    id: '',
    declareName: '',
    isUrgent: false,
    projectType: '土建',
    projectManager: '',
    projectManagerId: '',
    projectManagerPhone: '',
    leaderName: '',
    leaderId: '',
    startDate: '',
    endDate: '',
    implementYear: String(new Date().getFullYear()),
    declareTime: '',
    supplierName: '',
    supplierNo: '',
    supplierContact: '',
    supplierPhone: '',
    status: 'draft',
    frameworkContractId: '',
    frameworkContractNo: '',
    frameworkContractName: '',
    submitUnit: '',
    budgetAmount: 0,
    amount: 0,
    declareDetail: '',
    currentStatus: '',
    necessity: '',
    mainContent: '',
    researchPersons: defaultResearchPersons.map((r) => ({ ...r })),
    attachments: {},
    planStatus: 'none',
    planUploader: '',
    planUploadTime: '',
    planAttachments: {},
    budgetStatus: 'none',
    budgetUploader: '',
    budgetUploadTime: '',
    budgetEstimate: emptyBudgetEstimate(),
    issueStatus: 'none',
    issuer: '',
    issueTime: '',
  };
}

/** 补齐表单扩展字段，保证列表种子可打开详情/编辑 */
export function withAgreementFormFields(r: SporadicAgreementRecord): SporadicAgreementRecord {
  const fc = frameworkContractRecords.find((c) => c.id === r.frameworkContractId);
  const budget = r.budgetAmount ?? r.amount ?? 0;
  const staff = sporadicStaffDirectory.find((s) => s.name === r.projectManager);
  const hasSiteImages = (r.attachments?.[SITE_IMAGE_CONFIG_ID] || []).length > 0;
  const idx = demoIndexFromId(r.id);
  const issueStatus: SporadicIssueStatus = r.issueStatus ?? ISSUE_STATUS_CYCLE[idx % ISSUE_STATUS_CYCLE.length];
  const inIssuePool = issueStatus === 'pending' || issueStatus === 'issued';
  const planStatus = inIssuePool
    ? 'approved'
    : (r.planStatus ?? PLAN_STATUS_CYCLE[idx % PLAN_STATUS_CYCLE.length]);
  const budgetStatus = inIssuePool
    ? 'approved'
    : (r.budgetStatus ?? BUDGET_STATUS_CYCLE[idx % BUDGET_STATUS_CYCLE.length]);
  const planUploaded = planStatus !== 'none';
  const budgetUploaded = budgetStatus !== 'none';
  return {
    ...emptyAgreementForm(),
    ...r,
    frameworkContractName: r.frameworkContractName || fc?.contractName || '',
    frameworkContractNo: r.frameworkContractNo || fc?.contractNo || '',
    supplierName: r.supplierName || fc?.supplierName || '',
    supplierNo: r.supplierNo || fc?.supplierNo || '',
    supplierContact: r.supplierContact || fc?.contractorContact || '',
    supplierPhone: r.supplierPhone || fc?.contractorPhone || '',
    leaderName: r.leaderName || '李副总',
    leaderId: r.leaderId || 'st-l1',
    projectManagerId: r.projectManagerId || staff?.id || '',
    implementYear: r.implementYear || (r.startDate ? r.startDate.slice(0, 4) : String(new Date().getFullYear())),
    budgetAmount: budget,
    amount: budget,
    declareDetail: r.declareDetail || `关于「${r.declareName}」的零星协议申报说明，请按现场情况组织施工。`,
    currentStatus: r.currentStatus || '现场存在隐患或缺陷，需组织零星施工处理。',
    necessity: r.necessity || '保障生产连续稳定运行，消除安全隐患，满足现场使用要求。',
    mainContent: r.mainContent || '按现场勘查方案组织施工，完成后组织验收并恢复生产。',
    researchPersons: (r.researchPersons && r.researchPersons.length > 0)
      ? r.researchPersons
      : defaultResearchPersons.map((row) => ({ ...row, id: `${r.id}_${row.id}` })),
    attachments: hasSiteImages
      ? r.attachments
      : (r.status === 'draft' ? (r.attachments || {}) : demoSiteImageAttachments(r.id, r.declareName)),
    planStatus,
    planUploader: r.planUploader || (planUploaded ? (r.projectManager || '王强') : ''),
    planUploadTime: r.planUploadTime || (planUploaded ? `${r.declareTime?.slice(0, 10) || '2026-03-12'} 10:30:00` : ''),
    planAttachments: (r.planAttachments?.[PLAN_DOC_CONFIG_ID] || []).length > 0
      ? r.planAttachments
      : (planUploaded ? demoPlanAttachments(r.id, r.declareName) : {}),
    budgetStatus,
    budgetUploader: r.budgetUploader || (budgetUploaded ? (r.projectManager || '王强') : ''),
    budgetUploadTime: r.budgetUploadTime || (budgetUploaded ? `${r.declareTime?.slice(0, 10) || '2026-03-12'} 15:20:00` : ''),
    budgetEstimate: r.budgetEstimate || (budgetUploaded ? demoBudgetEstimate(budget) : emptyBudgetEstimate()),
    issueStatus,
    issuer: r.issuer || (issueStatus === 'issued' ? '樊聪' : ''),
    issueTime: r.issueTime || (issueStatus === 'issued' ? `${r.declareTime?.slice(0, 10) || '2026-03-16'} 09:00:00` : ''),
  };
}

export const sporadicAgreementStatusMap: Record<
  SporadicAgreementStatus,
  { label: string; cls: string }
> = {
  draft: { label: '草稿', cls: 'bg-slate-100 text-steel-600' },
  pending: { label: '待审查', cls: 'bg-amber-100 text-amber-700' },
  reviewing: { label: '审查中', cls: 'bg-sky-100 text-sky-700' },
  approved: { label: '已通过', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: '已驳回', cls: 'bg-red-100 text-red-600' },
  withdrawn: { label: '已撤回', cls: 'bg-orange-100 text-orange-600' },
};

export const sporadicAgreementStatusOptions: { value: SporadicAgreementStatus | ''; label: string }[] = [
  { value: '', label: '全部状态' },
  { value: 'draft', label: '草稿' },
  { value: 'pending', label: '待审查' },
  { value: 'reviewing', label: '审查中' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已驳回' },
  { value: 'withdrawn', label: '已撤回' },
];

export const sporadicProjectTypes: SporadicProjectType[] = ['土建', '机电', '电气', '防腐', '管道', '其他'];

export const sporadicSubmitUnits = [
  '炼铁厂', '炼钢厂', '热轧厂', '冷轧厂', '动力厂', '原料厂', '工程管理部', '设备管理部',
];

/**
 * 零星协议单演示数据：
 * - 紧急抢修 / 零星工程均覆盖全部申报状态（各不少于 6 条）
 */
export const sporadicAgreementRecords: SporadicAgreementRecord[] = [
  /* —— 紧急抢修 —— */
  {
    id: 'sa-u-01', declareName: '3号高炉炉前地坪紧急修补', isUrgent: true, projectType: '土建',
    projectManager: '王强', projectManagerPhone: '13700001111',
    startDate: '2026-03-12', endDate: '2026-03-15', declareTime: '2026-03-11 08:20:00',
    supplierName: '中国五冶集团有限公司', supplierNo: 'CBS-1001',
    supplierContact: '刘建国', supplierPhone: '13900010001',
    status: 'pending', frameworkContractId: 'fc-01', frameworkContractNo: 'KJ-2026-001',
    submitUnit: '炼铁厂', amount: 3.8,
  },
  {
    id: 'sa-u-02', declareName: '转炉倾动液压软管紧急更换', isUrgent: true, projectType: '机电',
    projectManager: '张伟', projectManagerPhone: '13800002222',
    startDate: '2026-03-10', endDate: '2026-03-11', declareTime: '2026-03-10 06:45:00',
    supplierName: '中冶建工集团有限公司', supplierNo: 'CBS-1008',
    supplierContact: '陈志远', supplierPhone: '13900010008',
    status: 'reviewing', frameworkContractId: 'fc-02', frameworkContractNo: 'KJ-2026-002',
    submitUnit: '炼钢厂', amount: 2.6,
  },
  {
    id: 'sa-u-03', declareName: '热轧精轧机润滑站漏油抢修', isUrgent: true, projectType: '管道',
    projectManager: '周涛', projectManagerPhone: '13600003333',
    startDate: '2026-03-08', endDate: '2026-03-09', declareTime: '2026-03-08 14:10:00',
    supplierName: '江苏华能建设集团有限公司', supplierNo: 'CBS-1022',
    supplierContact: '赵明', supplierPhone: '13900010022',
    status: 'approved', frameworkContractId: 'fc-03', frameworkContractNo: 'KJ-2026-003',
    submitUnit: '热轧厂', amount: 4.2,
  },
  {
    id: 'sa-u-04', declareName: '动力厂循环水泵联轴器紧急检修', isUrgent: true, projectType: '机电',
    projectManager: '吴晓燕', projectManagerPhone: '13500004444',
    startDate: '2026-03-05', endDate: '2026-03-06', declareTime: '2026-03-05 09:30:00',
    supplierName: '南京钢铁附属工程公司', supplierNo: 'CBS-1050',
    supplierContact: '孙立', supplierPhone: '13900010050',
    status: 'rejected', frameworkContractId: 'fc-06', frameworkContractNo: 'KJ-2026-004',
    submitUnit: '动力厂', amount: 1.9,
  },
  {
    id: 'sa-u-05', declareName: '原料通廊托辊支架断裂抢修', isUrgent: true, projectType: '土建',
    projectManager: '李明', projectManagerPhone: '13400005555',
    startDate: '2026-02-28', endDate: '2026-03-01', declareTime: '2026-02-28 07:15:00',
    supplierName: '中国五冶集团有限公司', supplierNo: 'CBS-1001',
    supplierContact: '刘建国', supplierPhone: '13900010001',
    status: 'withdrawn', frameworkContractId: 'fc-01', frameworkContractNo: 'KJ-2026-001',
    submitUnit: '原料厂', amount: 3.1,
  },
  {
    id: 'sa-u-06', declareName: '冷轧酸洗段接地线紧急恢复', isUrgent: true, projectType: '电气',
    projectManager: '孙丽', projectManagerPhone: '13300006666',
    startDate: '2026-03-14', endDate: '2026-03-14', declareTime: '2026-03-14 10:05:00',
    supplierName: '南京钢铁附属工程公司', supplierNo: 'CBS-1050',
    supplierContact: '孙立', supplierPhone: '13900010050',
    status: 'draft', frameworkContractId: 'fc-06', frameworkContractNo: 'KJ-2026-004',
    submitUnit: '冷轧厂', amount: 0.8,
  },
  {
    id: 'sa-u-07', declareName: '烧结主抽风机基础裂纹加固抢修', isUrgent: true, projectType: '土建',
    projectManager: '王强', projectManagerPhone: '13700001111',
    startDate: '2026-03-13', endDate: '2026-03-16', declareTime: '2026-03-13 11:40:00',
    supplierName: '江苏华能建设集团有限公司', supplierNo: 'CBS-1022',
    supplierContact: '赵明', supplierPhone: '13900010022',
    status: 'pending', frameworkContractId: 'fc-09', frameworkContractNo: 'KJ-2026-006',
    submitUnit: '原料厂', amount: 6.5,
  },
  {
    id: 'sa-u-08', declareName: '厂区消防主管道泄漏紧急封堵', isUrgent: true, projectType: '管道',
    projectManager: '陈建华', projectManagerPhone: '13200007777',
    startDate: '2026-03-09', endDate: '2026-03-10', declareTime: '2026-03-09 16:20:00',
    supplierName: '中国五冶集团有限公司', supplierNo: 'CBS-1001',
    supplierContact: '刘建国', supplierPhone: '13900010001',
    status: 'reviewing', frameworkContractId: 'fc-07', frameworkContractNo: 'KJ-2026-005',
    submitUnit: '工程管理部', amount: 2.3,
  },

  /* —— 零星工程（非紧急） —— */
  {
    id: 'sa-n-01', declareName: '炼铁厂办公室地坪局部修复', isUrgent: false, projectType: '土建',
    projectManager: '小明', projectManagerPhone: '15691993333',
    startDate: '2026-03-20', endDate: '2026-03-28', declareTime: '2026-03-10 09:00:00',
    supplierName: '中国五冶集团有限公司', supplierNo: 'CBS-1001',
    supplierContact: '刘建国', supplierPhone: '13900010001',
    status: 'draft', frameworkContractId: 'fc-01', frameworkContractNo: 'KJ-2026-001',
    submitUnit: '炼铁厂', amount: 2.5,
  },
  {
    id: 'sa-n-02', declareName: '炼钢连铸平台护栏更新', isUrgent: false, projectType: '土建',
    projectManager: '张伟', projectManagerPhone: '13800002222',
    startDate: '2026-04-01', endDate: '2026-04-10', declareTime: '2026-03-12 14:30:00',
    supplierName: '中冶建工集团有限公司', supplierNo: 'CBS-1008',
    supplierContact: '陈志远', supplierPhone: '13900010008',
    status: 'pending', frameworkContractId: 'fc-02', frameworkContractNo: 'KJ-2026-002',
    submitUnit: '炼钢厂', amount: 3.6,
  },
  {
    id: 'sa-n-03', declareName: '热轧加热炉平台防腐刷漆', isUrgent: false, projectType: '防腐',
    projectManager: '周涛', projectManagerPhone: '13600003333',
    startDate: '2026-04-05', endDate: '2026-04-18', declareTime: '2026-03-11 11:15:00',
    supplierName: '江苏华能建设集团有限公司', supplierNo: 'CBS-1022',
    supplierContact: '赵明', supplierPhone: '13900010022',
    status: 'reviewing', frameworkContractId: 'fc-03', frameworkContractNo: 'KJ-2026-003',
    submitUnit: '热轧厂', amount: 4.1,
  },
  {
    id: 'sa-n-04', declareName: '动力厂电缆桥架局部更换', isUrgent: false, projectType: '电气',
    projectManager: '吴晓燕', projectManagerPhone: '13500004444',
    startDate: '2026-03-25', endDate: '2026-04-02', declareTime: '2026-03-08 16:40:00',
    supplierName: '南京钢铁附属工程公司', supplierNo: 'CBS-1050',
    supplierContact: '孙立', supplierPhone: '13900010050',
    status: 'approved', frameworkContractId: 'fc-06', frameworkContractNo: 'KJ-2026-004',
    submitUnit: '动力厂', amount: 3.2,
  },
  {
    id: 'sa-n-05', declareName: '原料厂地沟盖板更换', isUrgent: false, projectType: '土建',
    projectManager: '李明', projectManagerPhone: '13400005555',
    startDate: '2026-03-18', endDate: '2026-03-22', declareTime: '2026-03-06 10:20:00',
    supplierName: '中国五冶集团有限公司', supplierNo: 'CBS-1001',
    supplierContact: '刘建国', supplierPhone: '13900010001',
    status: 'rejected', frameworkContractId: 'fc-01', frameworkContractNo: 'KJ-2026-001',
    submitUnit: '原料厂', amount: 1.7,
  },
  {
    id: 'sa-n-06', declareName: '冷轧机组冷却水管路支吊架加固', isUrgent: false, projectType: '管道',
    projectManager: '孙丽', projectManagerPhone: '13300006666',
    startDate: '2026-04-08', endDate: '2026-04-15', declareTime: '2026-03-13 09:50:00',
    supplierName: '南京钢铁附属工程公司', supplierNo: 'CBS-1050',
    supplierContact: '孙立', supplierPhone: '13900010050',
    status: 'withdrawn', frameworkContractId: 'fc-06', frameworkContractNo: 'KJ-2026-004',
    submitUnit: '冷轧厂', amount: 2.9,
  },
  {
    id: 'sa-n-07', declareName: '工程管理部道路坑槽修补', isUrgent: false, projectType: '土建',
    projectManager: '陈建华', projectManagerPhone: '13200007777',
    startDate: '2026-03-22', endDate: '2026-03-30', declareTime: '2026-03-14 13:00:00',
    supplierName: '中国五冶集团有限公司', supplierNo: 'CBS-1001',
    supplierContact: '刘建国', supplierPhone: '13900010001',
    status: 'pending', frameworkContractId: 'fc-07', frameworkContractNo: 'KJ-2026-005',
    submitUnit: '工程管理部', amount: 2.1,
  },
  {
    id: 'sa-n-08', declareName: '设备管理部行车轨道微调', isUrgent: false, projectType: '机电',
    projectManager: '王强', projectManagerPhone: '13700001111',
    startDate: '2026-04-12', endDate: '2026-04-20', declareTime: '2026-03-15 08:35:00',
    supplierName: '中冶建工集团有限公司', supplierNo: 'CBS-1008',
    supplierContact: '陈志远', supplierPhone: '13900010008',
    status: 'approved', frameworkContractId: 'fc-02', frameworkContractNo: 'KJ-2026-002',
    submitUnit: '设备管理部', amount: 4.5,
  },
];

/* ========== 操作记录 ========== */

export interface SporadicOpLog {
  id: string;
  bizId: string;
  operateTime: string;
  operator: string;
  operation: string;
  remark: string;
  /** 涉及审批流程时展示审批编号 */
  approvalNo?: string;
}

export interface SporadicApprovalFlowNode {
  name: string;
  role: string;
  status: 'passed' | 'current' | 'pending' | 'rejected' | 'returned';
  time?: string;
  opinion?: string;
}

/** 审批编号 → 可视化流程 */
export const sporadicApprovalFlows: Record<string, { title: string; nodes: SporadicApprovalFlowNode[] }> = {
  'SP-LX-2026-U01': {
    title: '3号高炉炉前地坪紧急修补 · 待审查',
    nodes: [
      { name: '王强', role: '申报人', status: 'passed', time: '2026-03-11 08:35', opinion: '紧急抢修，请尽快审查' },
      { name: '项目办·刘工', role: '协议单审查', status: 'current' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-LX-2026-U02': {
    title: '转炉倾动液压软管紧急更换 · 审查中',
    nodes: [
      { name: '张伟', role: '申报人', status: 'passed', time: '2026-03-10 07:10', opinion: '液压泄漏，申请紧急更换' },
      { name: '项目办·刘工', role: '协议单审查', status: 'current', time: '2026-03-10 09:00', opinion: '已接单审查' },
      { name: '王总工', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-LX-2026-U03': {
    title: '热轧精轧机润滑站漏油抢修 · 已通过',
    nodes: [
      { name: '周涛', role: '申报人', status: 'passed', time: '2026-03-08 14:30', opinion: '润滑站漏油抢修' },
      { name: '项目办·刘工', role: '协议单审查', status: 'passed', time: '2026-03-08 16:20', opinion: '情况属实，建议通过' },
      { name: '李副总', role: '分管领导', status: 'passed', time: '2026-03-08 18:00', opinion: '同意紧急施工' },
    ],
  },
  'SP-LX-2026-U04': {
    title: '动力厂循环水泵联轴器紧急检修 · 已驳回',
    nodes: [
      { name: '吴晓燕', role: '申报人', status: 'passed', time: '2026-03-05 10:00', opinion: '联轴器异常，申请抢修' },
      { name: '项目办·刘工', role: '协议单审查', status: 'rejected', time: '2026-03-05 15:00', opinion: '请补充现场照片后重报' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-LX-2026-N02': {
    title: '炼钢连铸平台护栏更新 · 待审查',
    nodes: [
      { name: '张伟', role: '申报人', status: 'passed', time: '2026-03-12 15:00', opinion: '护栏老化需更新' },
      { name: '项目办·刘工', role: '协议单审查', status: 'current' },
      { name: '赵书记', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-LX-2026-N03': {
    title: '热轧加热炉平台防腐刷漆 · 审查中',
    nodes: [
      { name: '周涛', role: '申报人', status: 'passed', time: '2026-03-11 11:30', opinion: '平台防腐刷漆' },
      { name: '项目办·刘工', role: '协议单审查', status: 'current', time: '2026-03-12 09:00', opinion: '审查中' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-LX-2026-N04': {
    title: '动力厂电缆桥架局部更换 · 已通过',
    nodes: [
      { name: '吴晓燕', role: '申报人', status: 'passed', time: '2026-03-08 17:00', opinion: '桥架局部更换' },
      { name: '项目办·刘工', role: '协议单审查', status: 'passed', time: '2026-03-09 09:30', opinion: '方案可行' },
      { name: '王总工', role: '分管领导', status: 'passed', time: '2026-03-09 11:00', opinion: '同意实施' },
    ],
  },
  'SP-LX-2026-N05': {
    title: '原料厂地沟盖板更换 · 已驳回',
    nodes: [
      { name: '李明', role: '申报人', status: 'passed', time: '2026-03-06 11:00', opinion: '地沟盖板更换' },
      { name: '项目办·刘工', role: '协议单审查', status: 'rejected', time: '2026-03-07 14:00', opinion: '金额测算需复核' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-LX-2026-N07': {
    title: '工程管理部道路坑槽修补 · 待审查',
    nodes: [
      { name: '陈建华', role: '申报人', status: 'passed', time: '2026-03-14 13:20', opinion: '道路坑槽修补' },
      { name: '项目办·刘工', role: '协议单审查', status: 'current' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-LX-2026-N08': {
    title: '设备管理部行车轨道微调 · 已通过',
    nodes: [
      { name: '王强', role: '申报人', status: 'passed', time: '2026-03-15 09:00', opinion: '行车轨道微调' },
      { name: '项目办·刘工', role: '协议单审查', status: 'passed', time: '2026-03-15 14:00', opinion: '同意' },
      { name: '王总工', role: '分管领导', status: 'passed', time: '2026-03-15 17:00', opinion: '同意施工' },
    ],
  },
  'SP-LX-2026-U07': {
    title: '烧结主抽风机基础裂纹加固抢修 · 待审查',
    nodes: [
      { name: '王强', role: '申报人', status: 'passed', time: '2026-03-13 12:00', opinion: '风机基础加固抢修，概算超5万' },
      { name: '项目办·刘工', role: '协议单审查', status: 'current' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-LX-2026-U08': {
    title: '厂区消防主管道泄漏紧急封堵 · 审查中',
    nodes: [
      { name: '陈建华', role: '申报人', status: 'passed', time: '2026-03-09 16:40', opinion: '消防管道泄漏紧急封堵' },
      { name: '项目办·刘工', role: '协议单审查', status: 'current', time: '2026-03-09 17:00', opinion: '审查中' },
      { name: '赵书记', role: '分管领导', status: 'pending' },
    ],
  },
};

export const sporadicAgreementOpLogs: SporadicOpLog[] = [
  { id: 'sal-1', bizId: 'sa-u-01', operateTime: '2026-03-11 08:20:00', operator: '王强', operation: '新增', remark: '创建紧急抢修协议单' },
  { id: 'sal-2', bizId: 'sa-u-01', operateTime: '2026-03-11 08:35:00', operator: '王强', operation: '提交', remark: '提交审查', approvalNo: 'SP-LX-2026-U01' },
  { id: 'sal-3', bizId: 'sa-u-02', operateTime: '2026-03-10 06:45:00', operator: '张伟', operation: '新增', remark: '液压软管泄漏紧急申报' },
  { id: 'sal-4', bizId: 'sa-u-02', operateTime: '2026-03-10 07:10:00', operator: '张伟', operation: '提交', remark: '提交审查', approvalNo: 'SP-LX-2026-U02' },
  { id: 'sal-5', bizId: 'sa-u-02', operateTime: '2026-03-10 09:00:00', operator: '项目办·刘工', operation: '审查', remark: '进入审查中', approvalNo: 'SP-LX-2026-U02' },
  { id: 'sal-6', bizId: 'sa-u-03', operateTime: '2026-03-08 14:10:00', operator: '周涛', operation: '新增', remark: '润滑站漏油抢修' },
  { id: 'sal-7', bizId: 'sa-u-03', operateTime: '2026-03-08 18:00:00', operator: '项目办·刘工', operation: '通过', remark: '同意紧急施工', approvalNo: 'SP-LX-2026-U03' },
  { id: 'sal-8', bizId: 'sa-u-04', operateTime: '2026-03-05 09:30:00', operator: '吴晓燕', operation: '新增', remark: '循环水泵联轴器抢修' },
  { id: 'sal-9', bizId: 'sa-u-04', operateTime: '2026-03-05 15:00:00', operator: '项目办·刘工', operation: '驳回', remark: '请补充现场照片后重报', approvalNo: 'SP-LX-2026-U04' },
  { id: 'sal-10', bizId: 'sa-u-05', operateTime: '2026-02-28 07:15:00', operator: '李明', operation: '新增', remark: '托辊支架断裂抢修' },
  { id: 'sal-11', bizId: 'sa-u-05', operateTime: '2026-02-28 10:00:00', operator: '李明', operation: '撤回', remark: '已由检修班自行处理' },
  { id: 'sal-12', bizId: 'sa-u-06', operateTime: '2026-03-14 10:05:00', operator: '孙丽', operation: '新增', remark: '草稿保存' },
  { id: 'sal-13', bizId: 'sa-n-01', operateTime: '2026-03-10 09:00:00', operator: '小明', operation: '新增', remark: '地坪修复草稿' },
  { id: 'sal-14', bizId: 'sa-n-02', operateTime: '2026-03-12 14:30:00', operator: '张伟', operation: '新增', remark: '护栏更新申报' },
  { id: 'sal-15', bizId: 'sa-n-02', operateTime: '2026-03-12 15:00:00', operator: '张伟', operation: '提交', remark: '提交审查', approvalNo: 'SP-LX-2026-N02' },
  { id: 'sal-16', bizId: 'sa-n-03', operateTime: '2026-03-11 11:15:00', operator: '周涛', operation: '新增', remark: '防腐刷漆申报' },
  { id: 'sal-17', bizId: 'sa-n-03', operateTime: '2026-03-12 09:00:00', operator: '项目办·刘工', operation: '审查', remark: '审查中', approvalNo: 'SP-LX-2026-N03' },
  { id: 'sal-18', bizId: 'sa-n-04', operateTime: '2026-03-08 16:40:00', operator: '吴晓燕', operation: '新增', remark: '桥架更换' },
  { id: 'sal-19', bizId: 'sa-n-04', operateTime: '2026-03-09 11:00:00', operator: '项目办·刘工', operation: '通过', remark: '同意实施', approvalNo: 'SP-LX-2026-N04' },
  { id: 'sal-20', bizId: 'sa-n-05', operateTime: '2026-03-06 10:20:00', operator: '李明', operation: '新增', remark: '盖板更换' },
  { id: 'sal-21', bizId: 'sa-n-05', operateTime: '2026-03-07 14:00:00', operator: '项目办·刘工', operation: '驳回', remark: '金额测算需复核', approvalNo: 'SP-LX-2026-N05' },
  { id: 'sal-22', bizId: 'sa-n-06', operateTime: '2026-03-13 09:50:00', operator: '孙丽', operation: '新增', remark: '支吊架加固' },
  { id: 'sal-23', bizId: 'sa-n-06', operateTime: '2026-03-13 16:00:00', operator: '孙丽', operation: '撤回', remark: '方案调整后重报' },
  { id: 'sal-24', bizId: 'sa-n-07', operateTime: '2026-03-14 13:00:00', operator: '陈建华', operation: '新增', remark: '道路修补申报' },
  { id: 'sal-25', bizId: 'sa-n-07', operateTime: '2026-03-14 13:20:00', operator: '陈建华', operation: '提交', remark: '提交审查', approvalNo: 'SP-LX-2026-N07' },
  { id: 'sal-26', bizId: 'sa-n-08', operateTime: '2026-03-15 08:35:00', operator: '王强', operation: '新增', remark: '轨道微调' },
  { id: 'sal-27', bizId: 'sa-n-08', operateTime: '2026-03-15 17:00:00', operator: '项目办·刘工', operation: '通过', remark: '同意施工', approvalNo: 'SP-LX-2026-N08' },
  { id: 'sal-28', bizId: 'sa-u-07', operateTime: '2026-03-13 11:40:00', operator: '王强', operation: '新增', remark: '风机基础加固抢修' },
  { id: 'sal-29', bizId: 'sa-u-07', operateTime: '2026-03-13 12:00:00', operator: '王强', operation: '提交', remark: '提交审查', approvalNo: 'SP-LX-2026-U07' },
  { id: 'sal-30', bizId: 'sa-u-08', operateTime: '2026-03-09 16:20:00', operator: '陈建华', operation: '新增', remark: '消防管道抢修' },
  { id: 'sal-31', bizId: 'sa-u-08', operateTime: '2026-03-09 17:00:00', operator: '项目办·刘工', operation: '审查', remark: '审查中', approvalNo: 'SP-LX-2026-U08' },
];

export function getSporadicAgreementOpLogs(bizId: string): SporadicOpLog[] {
  return sporadicAgreementOpLogs
    .filter((l) => l.bizId === bizId)
    .sort((a, b) => (a.operateTime < b.operateTime ? 1 : -1));
}

export function sortAgreementsByDeclareTime(list: SporadicAgreementRecord[]): SporadicAgreementRecord[] {
  return [...list].sort((a, b) => (a.declareTime < b.declareTime ? 1 : a.declareTime > b.declareTime ? -1 : 0));
}

export function canWithdrawAgreement(status: SporadicAgreementStatus): boolean {
  return status === 'pending' || status === 'reviewing';
}

export function canDeleteAgreement(status: SporadicAgreementStatus): boolean {
  return status === 'draft' || status === 'withdrawn' || status === 'rejected';
}

export function canEditAgreement(status: SporadicAgreementStatus): boolean {
  return status === 'draft' || status === 'withdrawn' || status === 'rejected';
}

/** 方案/预算：可上传（未上传、已撤回、已驳回） */
export function canUploadReviewItem(status?: SporadicUploadApproveStatus): boolean {
  return !status || status === 'none' || status === 'withdrawn' || status === 'rejected';
}

/** 方案/预算：审批中可撤回 */
export function canWithdrawReviewItem(status?: SporadicUploadApproveStatus): boolean {
  return status === 'pending' || status === 'reviewing';
}

/** 审查页修改协议单：非审批中可改 */
export function canEditOnReview(status?: SporadicUploadApproveStatus): boolean {
  return status !== 'pending' && status !== 'reviewing';
}
