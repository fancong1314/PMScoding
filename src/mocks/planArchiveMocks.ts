/** 计划资料管理 — 已通过年度计划档案库演示数据 */

import type { PlanPriorityLevel } from './planReviewMocks';
export type { PlanPriorityLevel } from './planReviewMocks';
export { PRIORITY_SORT_ORDER } from './planReviewMocks';

export type PlanExecStatus = '未启动' | '执行中' | '已完工' | '暂缓';

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

/**
 * 已通过年度计划清单：覆盖多年度、四大类、多执行状态与 A/B/C/D 优先级。
 */
export const planArchiveRecords: PlanArchiveRecord[] = [
  {
    id: 'pa-01', linkedPlanId: '3', planNo: 'JH-2025-TG-001',
    planName: '炼钢连铸机结晶器液面控制系统升级',
    planYear: '2025', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '炼钢事业部', budget: 310.00, benefit: 72.00,
    applicant: '陈刚', approveDate: '2025-03-18', startDate: '2025-06-01', endDate: '2025-12-31',
    execStatus: '已完工', priorityLevel: 'A',
  },
  {
    id: 'pa-02', linkedPlanId: 'oh3', planNo: 'JH-2025-DX-008',
    planName: '热轧加热炉蓄热式烧嘴大修',
    planYear: '2025', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '热轧事业部', budget: 460.00, benefit: 85.00,
    applicant: '王强', approveDate: '2025-04-02', startDate: '2025-08-01', endDate: '2026-01-31',
    execStatus: '执行中', priorityLevel: 'B',
  },
  {
    id: 'pa-03', linkedPlanId: '5', planNo: 'JH-2025-XJ-003',
    planName: '厂区道路及管廊综合整治新建配套',
    planYear: '2025', projectMajorCategory: '新建', projectType: '基础设施',
    businessUnit: '工程技术部', budget: 520.00, benefit: 30.00,
    applicant: '刘洋', approveDate: '2025-02-20', startDate: '2025-04-01', endDate: '2025-11-30',
    execStatus: '已完工', priorityLevel: 'C',
  },
  {
    id: 'pa-04', linkedPlanId: '6', planNo: 'JH-2025-XJ-012',
    planName: '智能配电房综合监控平台建设',
    planYear: '2025', projectMajorCategory: '新建', projectType: '信息化建设',
    businessUnit: '动力事业部', budget: 233.33, benefit: 48.00,
    applicant: '孙丽', approveDate: '2025-05-08', startDate: '2025-05-01', endDate: '2025-12-31',
    execStatus: '已完工', priorityLevel: 'D',
  },
  {
    id: 'pa-05', linkedPlanId: 'mn3', planNo: 'JH-2026-LG-015',
    planName: '循环水泵房变频器更新',
    planYear: '2026', projectMajorCategory: '零固', projectType: '电力工程',
    businessUnit: '动力事业部', budget: 72.00, benefit: 15.00,
    applicant: '孙丽', approveDate: '2026-01-22', startDate: '2026-03-01', endDate: '2026-06-30',
    execStatus: '执行中', priorityLevel: 'A',
  },
  {
    id: 'pa-06', linkedPlanId: 'tg4', planNo: 'JH-2026-TG-021',
    planName: '冷轧酸洗段废水零排放技改',
    planYear: '2026', projectMajorCategory: '技改', projectType: '环保改造',
    businessUnit: '冷轧事业部', budget: 680.00, benefit: 110.00,
    applicant: '吴晓燕', approveDate: '2026-02-10', startDate: '2026-02-01', endDate: '2026-10-31',
    execStatus: '执行中', priorityLevel: 'B',
  },
  {
    id: 'pa-07', linkedPlanId: 'oh4', planNo: 'JH-2026-DX-006',
    planName: '高炉鼓风机本体及润滑系统大修',
    planYear: '2026', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '炼铁事业部', budget: 390.00, benefit: 66.00,
    applicant: '张伟', approveDate: '2026-03-05', startDate: '2026-09-01', endDate: '2026-12-31',
    execStatus: '未启动', priorityLevel: 'C',
  },
  {
    id: 'pa-08', linkedPlanId: '2', planNo: 'JH-2026-TG-008',
    planName: '烧结机头烟气脱硫脱硝系统升级改造',
    planYear: '2026', projectMajorCategory: '技改', projectType: '环保改造',
    businessUnit: '原料事业部', budget: 420.00, benefit: 88.20,
    applicant: '李明', approveDate: '2026-03-28', startDate: '2026-04-01', endDate: '2027-03-31',
    execStatus: '执行中', priorityLevel: 'D',
  },
  {
    id: 'pa-09', linkedPlanId: '7', planNo: 'JH-2026-XJ-018',
    planName: '企业级能源管理系统（EMS）平台建设项目',
    planYear: '2026', projectMajorCategory: '新建', projectType: '信息化建设',
    businessUnit: '动力事业部', budget: 550.00, benefit: 180.00,
    applicant: '孙丽', approveDate: '2026-04-12', startDate: '2026-03-01', endDate: '2026-12-31',
    execStatus: '执行中', priorityLevel: 'A',
  },
  {
    id: 'pa-10', linkedPlanId: '1', planNo: 'JH-2026-DX-001',
    planName: '3号高炉炉体大修及配套设备更新改造工程',
    planYear: '2026', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '炼铁事业部', budget: 850.00, benefit: 120.50,
    applicant: '张伟', approveDate: '2026-04-20', startDate: '2026-03-01', endDate: '2026-12-31',
    execStatus: '执行中', priorityLevel: 'B',
  },
  {
    id: 'pa-11', linkedPlanId: '15', planNo: 'JH-2026-XJ-025',
    planName: '热轧厂区雨水收集与回用站新建工程',
    planYear: '2026', projectMajorCategory: '新建', projectType: '环保改造',
    businessUnit: '热轧事业部', budget: 245.00, benefit: 38.00,
    applicant: '王强', approveDate: '2026-05-06', startDate: '2026-04-15', endDate: '2026-10-31',
    execStatus: '未启动', priorityLevel: 'C',
  },
  {
    id: 'pa-12', linkedPlanId: '12', planNo: 'JH-2026-LG-009',
    planName: '精轧机液压伺服阀组零星更新',
    planYear: '2026', projectMajorCategory: '零固', projectType: '设备更新',
    businessUnit: '热轧事业部', budget: 56.00, benefit: 12.00,
    applicant: '王强', approveDate: '2026-05-18', startDate: '2026-04-01', endDate: '2026-06-30',
    execStatus: '已完工', priorityLevel: 'D',
  },
  {
    id: 'pa-13', linkedPlanId: 'tg2', planNo: 'JH-2026-TG-033',
    planName: '酸轧段板形闭环控制技改项目',
    planYear: '2026', projectMajorCategory: '技改', projectType: '工艺改造',
    businessUnit: '冷轧事业部', budget: 210.00, benefit: 55.00,
    applicant: '吴晓燕', approveDate: '2026-06-02', startDate: '2026-06-01', endDate: '2026-11-30',
    execStatus: '执行中', priorityLevel: 'A',
  },
  {
    id: 'pa-14', linkedPlanId: 'oh6', planNo: 'JH-2026-DX-014',
    planName: '烧结机台车及密封系统大修工程',
    planYear: '2026', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '原料事业部', budget: 540.00, benefit: 160.00,
    applicant: '周涛', approveDate: '2026-06-15', startDate: '2026-10-01', endDate: '2027-01-31',
    execStatus: '未启动', priorityLevel: 'B',
  },
  {
    id: 'pa-15', linkedPlanId: '16', planNo: 'JH-2026-XJ-030',
    planName: '原料码头堆场智能化地磅站新建',
    planYear: '2026', projectMajorCategory: '新建', projectType: '土建工程',
    businessUnit: '物流事业部', budget: 168.00, benefit: 28.00,
    applicant: '周涛', approveDate: '2026-07-01', startDate: '2026-05-01', endDate: '2026-11-30',
    execStatus: '执行中', priorityLevel: 'C',
  },
  {
    id: 'pa-16', linkedPlanId: '4', planNo: 'JH-2026-TG-040',
    planName: '原料场堆取料机无人化改造及智能调度系统建设',
    planYear: '2026', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '原料事业部', budget: 650.00, benefit: 95.00,
    applicant: '赵芳', approveDate: '2026-07-20', startDate: '2026-05-01', endDate: '2027-06-30',
    execStatus: '执行中', priorityLevel: 'D',
  },
  {
    id: 'pa-17', linkedPlanId: 'mn1', planNo: 'JH-2026-TG-011',
    planName: '皮带通廊除尘风机变频改造',
    planYear: '2026', projectMajorCategory: '技改', projectType: '节能减排',
    businessUnit: '原料事业部', budget: 98.00, benefit: 22.00,
    applicant: '赵芳', approveDate: '2026-02-28', startDate: '2026-05-15', endDate: '2026-09-30',
    execStatus: '暂缓', priorityLevel: 'A',
  },
  {
    id: 'pa-18', linkedPlanId: 'oh5', planNo: 'JH-2027-DX-002',
    planName: '35kV主变压器及附属系统大修',
    planYear: '2027', projectMajorCategory: '大修', projectType: '电力工程',
    businessUnit: '动力事业部', budget: 680.00, benefit: 95.00,
    applicant: '孙丽', approveDate: '2026-08-10', startDate: '2027-02-01', endDate: '2027-06-30',
    execStatus: '未启动', priorityLevel: 'B',
  },
  {
    id: 'pa-19', linkedPlanId: 'xj1', planNo: 'JH-2027-XJ-005',
    planName: '原料场智能堆取料系统新建',
    planYear: '2027', projectMajorCategory: '新建', projectType: '土建工程',
    businessUnit: '原料事业部', budget: 860.00, benefit: 120.00,
    applicant: '李明', approveDate: '2026-08-22', startDate: '2027-04-01', endDate: '2027-12-31',
    execStatus: '未启动', priorityLevel: 'C',
  },
  {
    id: 'pa-20', linkedPlanId: 'tg1', planNo: 'JH-2027-TG-007',
    planName: '高炉专家系统及热风炉智能燃烧技改',
    planYear: '2027', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '炼铁事业部', budget: 320.00, benefit: 90.00,
    applicant: '张伟', approveDate: '2026-09-01', startDate: '2027-03-01', endDate: '2027-10-31',
    execStatus: '未启动', priorityLevel: 'D',
  },
  {
    id: 'pa-21', linkedPlanId: 'mn2', planNo: 'JH-2027-LG-003',
    planName: '配电室低压开关柜抽屉单元更新',
    planYear: '2027', projectMajorCategory: '零固', projectType: '电力工程',
    businessUnit: '动力事业部', budget: 65.00, benefit: 10.00,
    applicant: '孙丽', approveDate: '2026-09-05', startDate: '2027-04-01', endDate: '2027-07-31',
    execStatus: '未启动', priorityLevel: 'A',
  },
  {
    id: 'pa-22', linkedPlanId: '8', planNo: 'JH-2024-LG-022',
    planName: '矿石码头桥式卸船机关键部件更新（归档）',
    planYear: '2024', projectMajorCategory: '零固', projectType: '设备更新',
    businessUnit: '物流事业部', budget: 185.00, benefit: 26.00,
    applicant: '周涛', approveDate: '2024-06-12', startDate: '2024-07-01', endDate: '2024-12-31',
    execStatus: '已完工', priorityLevel: 'B',
  },
  {
    id: 'pa-23', linkedPlanId: 'oh2', planNo: 'JH-2024-DX-019',
    planName: '高线精轧机齿轮箱大修（归档）',
    planYear: '2024', projectMajorCategory: '大修', projectType: '设备大修',
    businessUnit: '特钢事业部', budget: 280.00, benefit: 48.00,
    applicant: '刘洋', approveDate: '2024-05-08', startDate: '2024-08-01', endDate: '2025-01-31',
    execStatus: '已完工', priorityLevel: 'C',
  },
  {
    id: 'pa-24', linkedPlanId: 'tg3', planNo: 'JH-2024-TG-015',
    planName: '精炼炉电极升降系统技改（归档）',
    planYear: '2024', projectMajorCategory: '技改', projectType: '工艺改造',
    businessUnit: '炼钢事业部', budget: 175.00, benefit: 40.00,
    applicant: '陈刚', approveDate: '2024-04-16', startDate: '2024-06-01', endDate: '2024-11-30',
    execStatus: '已完工', priorityLevel: 'D',
  },
];

export const MAJOR_CHART_COLORS: Record<string, string> = {
  '新建': '#2563eb',
  '技改': '#059669',
  '零固': '#d97706',
  '大修': '#7c3aed',
};
