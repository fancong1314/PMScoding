/** 计划资料管理 — 已通过年度计划档案库演示数据 */

import type { PlanPriorityLevel } from './planReviewMocks';
export type { PlanPriorityLevel } from './planReviewMocks';
export { PRIORITY_SORT_ORDER } from './planReviewMocks';

export type PlanExecStatus = '未启动' | '执行中' | '已完工' | '暂缓';

/** 资料管理统计口径：申报结果 */
export type PlanArchiveOutcome = 'approved' | 'rejected';

/** 费用增补（计划管控金额修改）审批状态；空表示尚未发起增补 */
export type PlanAmountStatus = '' | '审批中' | '已通过' | '已驳回';

export interface PlanArchiveRecord {
  id: string;
  linkedPlanId: string;
  planNo: string;
  planName: string;
  planYear: string;
  projectMajorCategory: string;
  projectType: string;
  businessUnit: string;
  budget: number;
  benefit: number;
  applicant: string;
  approveDate: string;
  startDate: string;
  endDate: string;
  execStatus: PlanExecStatus;
  /** 与项目部审查一致：A/B/C/D */
  priorityLevel: PlanPriorityLevel;
  /** 申报结果：已通过 / 已驳回（统计用；清单默认展示已通过） */
  reviewOutcome: PlanArchiveOutcome;
  /** 计划管控金额（万元） */
  controlAmount: number;
  /** 计划占用金额（万元） */
  occupiedAmount: number;
  /** 费用增补审批状态 */
  amountStatus: PlanAmountStatus;
  /** 审批中的目标管控金额（审批通过后写入 controlAmount） */
  pendingControlAmount?: number;
}

/** 计划占用明细行 */
export interface PlanOccupyDetailItem {
  id: string;
  projectName: string;
  projectNo: string;
  amount: number;
  initiated: boolean;
}

export const planAmountStatusMap: Record<Exclude<PlanAmountStatus, ''>, { label: string; color: string }> = {
  '审批中': { label: '审批中', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  '已通过': { label: '已通过', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  '已驳回': { label: '已驳回', color: 'bg-red-50 text-red-700 border border-red-200' },
};

export function getAvailableAmount(r: PlanArchiveRecord): number {
  return Number((r.controlAmount - r.occupiedAmount).toFixed(2));
}

export const planArchiveYears = ['2024', '2025', '2026', '2027'];
export const planArchiveMajorCategories = ['新建', '技改', '零固', '大修'];
export const planArchiveProjectTypes = [
  '环保改造', '智能化改造', '设备大修', '电力工程', '信息化建设',
  '土建工程', '工艺改造', '设备更新', '安全环保', '基础设施',
  '节能减排', '产能扩张',
];
export const planArchiveUnits = [
  '炼铁事业部', '炼钢事业部', '热轧事业部', '冷轧事业部', '特钢事业部',
  '动力事业部', '原料事业部', '物流事业部', '工程技术部', '科技质量部',
];

export const planExecStatusMap: Record<PlanExecStatus, { label: string; color: string }> = {
  '未启动': { label: '未启动', color: 'bg-slate-100 text-slate-600 border border-slate-200' },
  '执行中': { label: '执行中', color: 'bg-sky-50 text-sky-700 border border-sky-200' },
  '已完工': { label: '已完工', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  '暂缓':   { label: '暂缓',   color: 'bg-amber-50 text-amber-700 border border-amber-200' },
};

/** 系统“本年”口径（与演示环境一致） */
export const PLAN_ARCHIVE_CURRENT_YEAR = '2026';

type PlanArchiveSeed = Omit<
  PlanArchiveRecord,
  'controlAmount' | 'occupiedAmount' | 'amountStatus' | 'pendingControlAmount'
>;

/**
 * 已通过年度计划清单：覆盖多年度、四大类、多执行状态与 A/B/C/D 优先级。
 */
const planArchiveSeeds: PlanArchiveSeed[] = [
  {
    id: 'pa-01', linkedPlanId: '3', planNo: 'JH-2025-TG-001',
    planName: '炼钢连铸机结晶器液面控制系统升级',
    planYear: '2025', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '炼钢事业部', budget: 310.00, benefit: 72.00,
    applicant: '陈刚', approveDate: '2025-03-18', startDate: '2025-06-01', endDate: '2025-12-31',
    execStatus: '已完工', priorityLevel: 'A', reviewOutcome: 'approved',
  },
  {
    id: 'pa-02', linkedPlanId: 'oh3', planNo: 'JH-2025-DX-008',
    planName: '热轧加热炉蓄热式烧嘴大修',
    planYear: '2025', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '热轧事业部', budget: 460.00, benefit: 85.00,
    applicant: '王强', approveDate: '2025-04-02', startDate: '2025-08-01', endDate: '2026-01-31',
    execStatus: '执行中', priorityLevel: 'B', reviewOutcome: 'approved',
  },
  {
    id: 'pa-03', linkedPlanId: '5', planNo: 'JH-2025-XJ-003',
    planName: '厂区道路及管廊综合整治新建配套',
    planYear: '2025', projectMajorCategory: '新建', projectType: '基础设施',
    businessUnit: '工程技术部', budget: 520.00, benefit: 30.00,
    applicant: '刘洋', approveDate: '2025-02-20', startDate: '2025-04-01', endDate: '2025-11-30',
    execStatus: '已完工', priorityLevel: 'C', reviewOutcome: 'approved',
  },
  {
    id: 'pa-04', linkedPlanId: '6', planNo: 'JH-2025-XJ-012',
    planName: '智能配电房综合监控平台建设',
    planYear: '2025', projectMajorCategory: '新建', projectType: '信息化建设',
    businessUnit: '动力事业部', budget: 233.33, benefit: 48.00,
    applicant: '孙丽', approveDate: '2025-05-08', startDate: '2025-05-01', endDate: '2025-12-31',
    execStatus: '已完工', priorityLevel: 'D', reviewOutcome: 'approved',
  },
  {
    id: 'pa-05', linkedPlanId: 'mn3', planNo: 'JH-2026-LG-015',
    planName: '循环水泵房变频器更新',
    planYear: '2026', projectMajorCategory: '零固', projectType: '电力工程',
    businessUnit: '动力事业部', budget: 72.00, benefit: 15.00,
    applicant: '孙丽', approveDate: '2026-01-22', startDate: '2026-03-01', endDate: '2026-06-30',
    execStatus: '执行中', priorityLevel: 'A', reviewOutcome: 'approved',
  },
  {
    id: 'pa-06', linkedPlanId: 'tg4', planNo: 'JH-2026-TG-021',
    planName: '冷轧酸洗段废水零排放技改',
    planYear: '2026', projectMajorCategory: '技改', projectType: '环保改造',
    businessUnit: '冷轧事业部', budget: 680.00, benefit: 110.00,
    applicant: '吴晓燕', approveDate: '2026-02-10', startDate: '2026-02-01', endDate: '2026-10-31',
    execStatus: '执行中', priorityLevel: 'B', reviewOutcome: 'approved',
  },
  {
    id: 'pa-07', linkedPlanId: 'oh4', planNo: 'JH-2026-DX-006',
    planName: '高炉鼓风机本体及润滑系统大修',
    planYear: '2026', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '炼铁事业部', budget: 390.00, benefit: 66.00,
    applicant: '张伟', approveDate: '2026-03-05', startDate: '2026-09-01', endDate: '2026-12-31',
    execStatus: '未启动', priorityLevel: 'C', reviewOutcome: 'approved',
  },
  {
    id: 'pa-08', linkedPlanId: '2', planNo: 'JH-2026-TG-008',
    planName: '烧结机头烟气脱硫脱硝系统升级改造',
    planYear: '2026', projectMajorCategory: '技改', projectType: '环保改造',
    businessUnit: '原料事业部', budget: 420.00, benefit: 88.20,
    applicant: '李明', approveDate: '2026-03-28', startDate: '2026-04-01', endDate: '2027-03-31',
    execStatus: '执行中', priorityLevel: 'D', reviewOutcome: 'approved',
  },
  {
    id: 'pa-09', linkedPlanId: '7', planNo: 'JH-2026-XJ-018',
    planName: '企业级能源管理系统（EMS）平台建设项目',
    planYear: '2026', projectMajorCategory: '新建', projectType: '信息化建设',
    businessUnit: '动力事业部', budget: 550.00, benefit: 180.00,
    applicant: '孙丽', approveDate: '2026-04-12', startDate: '2026-03-01', endDate: '2026-12-31',
    execStatus: '执行中', priorityLevel: 'A', reviewOutcome: 'approved',
  },
  {
    id: 'pa-10', linkedPlanId: '1', planNo: 'JH-2026-DX-001',
    planName: '3号高炉炉体大修及配套设备更新改造工程',
    planYear: '2026', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '炼铁事业部', budget: 850.00, benefit: 120.50,
    applicant: '张伟', approveDate: '2026-04-20', startDate: '2026-03-01', endDate: '2026-12-31',
    execStatus: '执行中', priorityLevel: 'B', reviewOutcome: 'approved',
  },
  {
    id: 'pa-11', linkedPlanId: '15', planNo: 'JH-2026-XJ-025',
    planName: '热轧厂区雨水收集与回用站新建工程',
    planYear: '2026', projectMajorCategory: '新建', projectType: '环保改造',
    businessUnit: '热轧事业部', budget: 245.00, benefit: 38.00,
    applicant: '王强', approveDate: '2026-05-06', startDate: '2026-04-15', endDate: '2026-10-31',
    execStatus: '未启动', priorityLevel: 'C', reviewOutcome: 'approved',
  },
  {
    id: 'pa-12', linkedPlanId: '12', planNo: 'JH-2026-LG-009',
    planName: '精轧机液压伺服阀组零星更新',
    planYear: '2026', projectMajorCategory: '零固', projectType: '设备更新',
    businessUnit: '热轧事业部', budget: 56.00, benefit: 12.00,
    applicant: '王强', approveDate: '2026-05-18', startDate: '2026-04-01', endDate: '2026-06-30',
    execStatus: '已完工', priorityLevel: 'D', reviewOutcome: 'approved',
  },
  {
    id: 'pa-13', linkedPlanId: 'tg2', planNo: 'JH-2026-TG-033',
    planName: '酸轧段板形闭环控制技改项目',
    planYear: '2026', projectMajorCategory: '技改', projectType: '工艺改造',
    businessUnit: '冷轧事业部', budget: 210.00, benefit: 55.00,
    applicant: '吴晓燕', approveDate: '2026-06-02', startDate: '2026-06-01', endDate: '2026-11-30',
    execStatus: '执行中', priorityLevel: 'A', reviewOutcome: 'approved',
  },
  {
    id: 'pa-14', linkedPlanId: 'oh6', planNo: 'JH-2026-DX-014',
    planName: '烧结机台车及密封系统大修工程',
    planYear: '2026', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '原料事业部', budget: 540.00, benefit: 160.00,
    applicant: '周涛', approveDate: '2026-06-15', startDate: '2026-10-01', endDate: '2027-01-31',
    execStatus: '未启动', priorityLevel: 'B', reviewOutcome: 'approved',
  },
  {
    id: 'pa-15', linkedPlanId: '16', planNo: 'JH-2026-XJ-030',
    planName: '原料码头堆场智能化地磅站新建',
    planYear: '2026', projectMajorCategory: '新建', projectType: '土建工程',
    businessUnit: '物流事业部', budget: 168.00, benefit: 28.00,
    applicant: '周涛', approveDate: '2026-07-01', startDate: '2026-05-01', endDate: '2026-11-30',
    execStatus: '执行中', priorityLevel: 'C', reviewOutcome: 'approved',
  },
  {
    id: 'pa-16', linkedPlanId: '4', planNo: 'JH-2026-TG-040',
    planName: '原料场堆取料机无人化改造及智能调度系统建设',
    planYear: '2026', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '原料事业部', budget: 650.00, benefit: 95.00,
    applicant: '赵芳', approveDate: '2026-07-20', startDate: '2026-05-01', endDate: '2027-06-30',
    execStatus: '执行中', priorityLevel: 'D', reviewOutcome: 'approved',
  },
  {
    id: 'pa-17', linkedPlanId: 'mn1', planNo: 'JH-2026-TG-011',
    planName: '皮带通廊除尘风机变频改造',
    planYear: '2026', projectMajorCategory: '技改', projectType: '节能减排',
    businessUnit: '原料事业部', budget: 98.00, benefit: 22.00,
    applicant: '赵芳', approveDate: '2026-02-28', startDate: '2026-05-15', endDate: '2026-09-30',
    execStatus: '暂缓', priorityLevel: 'A', reviewOutcome: 'approved',
  },
  {
    id: 'pa-18', linkedPlanId: 'oh5', planNo: 'JH-2027-DX-002',
    planName: '35kV主变压器及附属系统大修',
    planYear: '2027', projectMajorCategory: '大修', projectType: '电力工程',
    businessUnit: '动力事业部', budget: 680.00, benefit: 95.00,
    applicant: '孙丽', approveDate: '2026-08-10', startDate: '2027-02-01', endDate: '2027-06-30',
    execStatus: '未启动', priorityLevel: 'B', reviewOutcome: 'approved',
  },
  {
    id: 'pa-19', linkedPlanId: 'xj1', planNo: 'JH-2027-XJ-005',
    planName: '原料场智能堆取料系统新建',
    planYear: '2027', projectMajorCategory: '新建', projectType: '土建工程',
    businessUnit: '原料事业部', budget: 860.00, benefit: 120.00,
    applicant: '李明', approveDate: '2026-08-22', startDate: '2027-04-01', endDate: '2027-12-31',
    execStatus: '未启动', priorityLevel: 'C', reviewOutcome: 'approved',
  },
  {
    id: 'pa-20', linkedPlanId: 'tg1', planNo: 'JH-2027-TG-007',
    planName: '高炉专家系统及热风炉智能燃烧技改',
    planYear: '2027', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '炼铁事业部', budget: 320.00, benefit: 90.00,
    applicant: '张伟', approveDate: '2026-09-01', startDate: '2027-03-01', endDate: '2027-10-31',
    execStatus: '未启动', priorityLevel: 'D', reviewOutcome: 'approved',
  },
  {
    id: 'pa-21', linkedPlanId: 'mn2', planNo: 'JH-2027-LG-003',
    planName: '配电室低压开关柜抽屉单元更新',
    planYear: '2027', projectMajorCategory: '零固', projectType: '电力工程',
    businessUnit: '动力事业部', budget: 65.00, benefit: 10.00,
    applicant: '孙丽', approveDate: '2026-09-05', startDate: '2027-04-01', endDate: '2027-07-31',
    execStatus: '未启动', priorityLevel: 'A', reviewOutcome: 'approved',
  },
  {
    id: 'pa-22', linkedPlanId: '8', planNo: 'JH-2024-LG-022',
    planName: '矿石码头桥式卸船机关键部件更新（归档）',
    planYear: '2024', projectMajorCategory: '零固', projectType: '设备更新',
    businessUnit: '物流事业部', budget: 185.00, benefit: 26.00,
    applicant: '周涛', approveDate: '2024-06-12', startDate: '2024-07-01', endDate: '2024-12-31',
    execStatus: '已完工', priorityLevel: 'B', reviewOutcome: 'approved',
  },
  {
    id: 'pa-23', linkedPlanId: 'oh2', planNo: 'JH-2024-DX-019',
    planName: '高线精轧机齿轮箱大修（归档）',
    planYear: '2024', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '特钢事业部', budget: 280.00, benefit: 48.00,
    applicant: '刘洋', approveDate: '2024-05-08', startDate: '2024-08-01', endDate: '2025-01-31',
    execStatus: '已完工', priorityLevel: 'C', reviewOutcome: 'approved',
  },
  {
    id: 'pa-24', linkedPlanId: 'tg3', planNo: 'JH-2024-TG-015',
    planName: '精炼炉电极升降系统技改（归档）',
    planYear: '2024', projectMajorCategory: '技改', projectType: '工艺改造',
    businessUnit: '炼钢事业部', budget: 175.00, benefit: 40.00,
    applicant: '陈刚', approveDate: '2024-04-16', startDate: '2024-06-01', endDate: '2024-11-30',
    execStatus: '已完工', priorityLevel: 'D', reviewOutcome: 'approved',
  },
  /* —— 已驳回（仅参与统计，不进入已通过清单） —— */
  {
    id: 'pa-rj-01', linkedPlanId: '9', planNo: 'JH-2025-TG-088',
    planName: '棒线材精整线自动化改造（驳回）',
    planYear: '2025', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '特钢事业部', budget: 410.00, benefit: 35.00,
    applicant: '刘洋', approveDate: '2025-06-20', startDate: '2025-07-01', endDate: '2026-03-31',
    execStatus: '未启动', priorityLevel: 'A', reviewOutcome: 'rejected',
  },
  {
    id: 'pa-rj-02', linkedPlanId: 'mn4', planNo: 'JH-2026-LG-077',
    planName: '办公区中央空调末端更新（驳回）',
    planYear: '2026', projectMajorCategory: '零固', projectType: '基础设施',
    businessUnit: '工程技术部', budget: 88.00, benefit: 5.00,
    applicant: '李明', approveDate: '2026-03-12', startDate: '2026-04-01', endDate: '2026-08-31',
    execStatus: '未启动', priorityLevel: 'B', reviewOutcome: 'rejected',
  },
  {
    id: 'pa-rj-03', linkedPlanId: 'xj3', planNo: 'JH-2026-XJ-066',
    planName: '废钢加工中心扩建工程（驳回）',
    planYear: '2026', projectMajorCategory: '新建', projectType: '产能扩张',
    businessUnit: '炼钢事业部', budget: 920.00, benefit: 80.00,
    applicant: '陈刚', approveDate: '2026-04-08', startDate: '2026-05-01', endDate: '2026-12-31',
    execStatus: '未启动', priorityLevel: 'C', reviewOutcome: 'rejected',
  },
  {
    id: 'pa-rj-04', linkedPlanId: 'oh7', planNo: 'JH-2026-DX-055',
    planName: '烧结主抽风机叶轮大修（驳回）',
    planYear: '2026', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '原料事业部', budget: 260.00, benefit: 42.00,
    applicant: '赵芳', approveDate: '2026-05-15', startDate: '2026-06-01', endDate: '2026-09-30',
    execStatus: '未启动', priorityLevel: 'D', reviewOutcome: 'rejected',
  },
  {
    id: 'pa-rj-05', linkedPlanId: 'tg5', planNo: 'JH-2026-TG-044',
    planName: '热轧层流冷却水质在线监测技改（驳回）',
    planYear: '2026', projectMajorCategory: '技改', projectType: '安全环保',
    businessUnit: '热轧事业部', budget: 145.00, benefit: 18.00,
    applicant: '王强', approveDate: '2026-06-01', startDate: '2026-06-15', endDate: '2026-11-30',
    execStatus: '未启动', priorityLevel: 'A', reviewOutcome: 'rejected',
  },
  {
    id: 'pa-rj-06', linkedPlanId: '10', planNo: 'JH-2024-LG-033',
    planName: '码头皮带秤计量系统整体更换（驳回）',
    planYear: '2024', projectMajorCategory: '零固', projectType: '设备更新',
    businessUnit: '物流事业部', budget: 132.00, benefit: 20.00,
    applicant: '周涛', approveDate: '2024-08-10', startDate: '2024-09-01', endDate: '2025-02-28',
    execStatus: '未启动', priorityLevel: 'B', reviewOutcome: 'rejected',
  },
  {
    id: 'pa-rj-07', linkedPlanId: 'xj5', planNo: 'JH-2027-XJ-019',
    planName: '动力锅炉房脱硫废水处理站新建（驳回）',
    planYear: '2027', projectMajorCategory: '新建', projectType: '环保改造',
    businessUnit: '动力事业部', budget: 410.00, benefit: 55.00,
    applicant: '孙丽', approveDate: '2026-09-18', startDate: '2027-01-01', endDate: '2027-09-30',
    execStatus: '未启动', priorityLevel: 'C', reviewOutcome: 'rejected',
  },
];

/** 个别记录的金额/增补审批演示覆盖（覆盖全部关键状态） */
const amountFieldOverrides: Record<
  string,
  Partial<Pick<PlanArchiveRecord, 'controlAmount' | 'occupiedAmount' | 'amountStatus' | 'pendingControlAmount'>>
> = {
  /* 审批中：当前管控未变，待审目标写入 pending */
  'pa-01': { controlAmount: 310, occupiedAmount: 86.5, amountStatus: '审批中', pendingControlAmount: 360 },
  'pa-06': { controlAmount: 680, occupiedAmount: 210.4, amountStatus: '审批中', pendingControlAmount: 750 },
  'pa-10': { controlAmount: 850, occupiedAmount: 320, amountStatus: '审批中', pendingControlAmount: 920 },
  /* 已通过：管控金额已按增补更新 */
  'pa-02': { controlAmount: 510, occupiedAmount: 168.2, amountStatus: '已通过' },
  'pa-04': { controlAmount: 280, occupiedAmount: 95.4, amountStatus: '已通过' },
  'pa-09': { controlAmount: 620, occupiedAmount: 245.6, amountStatus: '已通过' },
  'pa-13': { controlAmount: 245, occupiedAmount: 88, amountStatus: '已通过' },
  /* 已驳回：管控保持原值 */
  'pa-03': { controlAmount: 520, occupiedAmount: 142.3, amountStatus: '已驳回', pendingControlAmount: 580 },
  'pa-08': { controlAmount: 420, occupiedAmount: 156.8, amountStatus: '已驳回', pendingControlAmount: 480 },
  'pa-15': { controlAmount: 168, occupiedAmount: 52.4, amountStatus: '已驳回', pendingControlAmount: 200 },
  /* 典型占用比例样例（无增补） */
  'pa-05': { controlAmount: 72, occupiedAmount: 20.88 },
  'pa-07': { controlAmount: 390, occupiedAmount: 0 },
  'pa-11': { controlAmount: 245, occupiedAmount: 0 },
  'pa-12': { controlAmount: 56, occupiedAmount: 56 },
  'pa-16': { controlAmount: 650, occupiedAmount: 410.2 },
  'pa-17': { controlAmount: 98, occupiedAmount: 12.5 },
};

function buildArchiveRecord(seed: PlanArchiveSeed, index: number): PlanArchiveRecord {
  const ov = amountFieldOverrides[seed.id] || {};
  const controlAmount = ov.controlAmount ?? seed.budget;
  const defaultOccupy = seed.reviewOutcome === 'approved'
    ? Number((controlAmount * (0.08 + (index % 5) * 0.06)).toFixed(2))
    : 0;
  const occupiedAmount = Math.min(
    ov.occupiedAmount ?? defaultOccupy,
    controlAmount,
  );
  return {
    ...seed,
    controlAmount,
    occupiedAmount: Number(occupiedAmount.toFixed(2)),
    amountStatus: ov.amountStatus ?? '',
    pendingControlAmount: ov.pendingControlAmount,
  };
}

export const planArchiveRecords: PlanArchiveRecord[] = planArchiveSeeds.map(buildArchiveRecord);

/** 计划占用金额明细（按档案 id；合计与 occupiedAmount 对齐） */
export const planOccupyDetailsByArchiveId: Record<string, PlanOccupyDetailItem[]> = {
  'pa-01': [
    { id: 'oc-01-1', projectName: '结晶器液面控制柜升级分包', projectNo: 'LX-2025-TG-101', amount: 48.2, initiated: true },
    { id: 'oc-01-2', projectName: '液位传感器采购及安装', projectNo: 'LX-2025-TG-102', amount: 22.3, initiated: true },
    { id: 'oc-01-3', projectName: '调试及联锁验证服务', projectNo: '', amount: 16.0, initiated: false },
  ],
  'pa-02': [
    { id: 'oc-02-1', projectName: '蓄热式烧嘴本体大修', projectNo: 'LX-2025-DX-201', amount: 98.5, initiated: true },
    { id: 'oc-02-2', projectName: '耐材与管道更换', projectNo: 'LX-2025-DX-202', amount: 45.7, initiated: true },
    { id: 'oc-02-3', projectName: '燃烧系统联调', projectNo: '', amount: 24.0, initiated: false },
  ],
  'pa-03': [
    { id: 'oc-03-1', projectName: '厂区道路改造一期', projectNo: 'LX-2025-XJ-088', amount: 90.0, initiated: true },
    { id: 'oc-03-2', projectName: '管廊支架加固', projectNo: 'LX-2025-XJ-089', amount: 52.3, initiated: true },
  ],
  'pa-04': [
    { id: 'oc-04-1', projectName: '智能配电监控平台建设', projectNo: 'LX-2025-XJ-120', amount: 70.4, initiated: true },
    { id: 'oc-04-2', projectName: '通信组网及终端采购', projectNo: '', amount: 25.0, initiated: false },
  ],
  'pa-05': [
    { id: 'oc-05-1', projectName: '循环水泵变频器更新', projectNo: 'LX-2026-LG-015', amount: 15.88, initiated: true },
    { id: 'oc-05-2', projectName: '柜体及线缆辅材', projectNo: '', amount: 5.0, initiated: false },
  ],
  'pa-06': [
    { id: 'oc-06-1', projectName: '废水零排放主体工程', projectNo: 'LX-2026-TG-221', amount: 150.0, initiated: true },
    { id: 'oc-06-2', projectName: '膜系统及药剂装置', projectNo: 'LX-2026-TG-222', amount: 45.4, initiated: true },
    { id: 'oc-06-3', projectName: '在线监测仪表', projectNo: '', amount: 15.0, initiated: false },
  ],
  'pa-08': [
    { id: 'oc-08-1', projectName: '脱硫脱硝系统升级', projectNo: 'LX-2026-TG-088', amount: 110.5, initiated: true },
    { id: 'oc-08-2', projectName: '催化剂更换及运维', projectNo: 'LX-2026-TG-089', amount: 46.3, initiated: true },
  ],
  'pa-09': [
    { id: 'oc-09-1', projectName: 'EMS 平台软件及服务器', projectNo: 'LX-2026-XJ-301', amount: 160.0, initiated: true },
    { id: 'oc-09-2', projectName: '计量点改造与接入', projectNo: 'LX-2026-XJ-302', amount: 55.6, initiated: true },
    { id: 'oc-09-3', projectName: '系统集成联调', projectNo: '', amount: 30.0, initiated: false },
  ],
  'pa-10': [
    { id: 'oc-10-1', projectName: '3号高炉炉体大修主体', projectNo: 'LX-2026-DX-001', amount: 220.0, initiated: true },
    { id: 'oc-10-2', projectName: '配套设备更新', projectNo: 'LX-2026-DX-002', amount: 80.0, initiated: true },
    { id: 'oc-10-3', projectName: '耐材及备件采购', projectNo: '', amount: 20.0, initiated: false },
  ],
  'pa-12': [
    { id: 'oc-12-1', projectName: '液压伺服阀组更新', projectNo: 'LX-2026-LG-009', amount: 56.0, initiated: true },
  ],
  'pa-13': [
    { id: 'oc-13-1', projectName: '板形闭环控制系统', projectNo: 'LX-2026-TG-331', amount: 60.0, initiated: true },
    { id: 'oc-13-2', projectName: '检测仪表与执行机构', projectNo: '', amount: 28.0, initiated: false },
  ],
  'pa-15': [
    { id: 'oc-15-1', projectName: '智能化地磅站土建', projectNo: 'LX-2026-XJ-401', amount: 32.4, initiated: true },
    { id: 'oc-15-2', projectName: '称重系统及软件', projectNo: '', amount: 20.0, initiated: false },
  ],
  'pa-16': [
    { id: 'oc-16-1', projectName: '无人化改造主机工程', projectNo: 'LX-2026-TG-440', amount: 280.0, initiated: true },
    { id: 'oc-16-2', projectName: '智能调度系统', projectNo: 'LX-2026-TG-441', amount: 100.2, initiated: true },
    { id: 'oc-16-3', projectName: '通信与定位子系统', projectNo: '', amount: 30.0, initiated: false },
  ],
  'pa-17': [
    { id: 'oc-17-1', projectName: '除尘风机变频改造', projectNo: 'LX-2026-TG-011', amount: 12.5, initiated: true },
  ],
};

export function getPlanOccupyDetails(archiveId: string, occupiedAmount: number): PlanOccupyDetailItem[] {
  const list = planOccupyDetailsByArchiveId[archiveId];
  if (list && list.length > 0) return list;
  if (occupiedAmount <= 0) return [];
  return [
    {
      id: `${archiveId}-oc-auto`,
      projectName: '计划关联立项占用（汇总）',
      projectNo: '',
      amount: occupiedAmount,
      initiated: true,
    },
  ];
}

export const MAJOR_CHART_COLORS: Record<string, string> = {
  '新建': '#2563eb',
  '技改': '#059669',
  '零固': '#d97706',
  '大修': '#7c3aed',
};
