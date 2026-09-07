/** 项目部审查 — 演示数据（每个 TAB 分区均有可展示数据） */

import type { PlanPriorityLevel } from './planReviewMocks';
export type { PlanPriorityLevel } from './planReviewMocks';
export { PRIORITY_SORT_ORDER } from './planReviewMocks';
export type LeaderReviewStatus =
  | 'pending_present'  // 待呈核
  | 'leader_reviewing' // 领导审核
  | 'leader_passed'    // 领导通过
  | 'leader_returned'  // 领导退回
  | 'rejected'         // 已驳回（原已作废）
  | 'approved'         // 已通过（原已立项）
  | 'returned'         // 已退回
  | 'modified';        // 已修改

export interface LeaderReviewRecord {
  id: string;
  linkedPlanId: string;
  planName: string;
  planYear: string;
  projectMajorCategory: string;
  projectCategory: string;
  applicant: string;
  businessUnit: string;
  budget: number;
  benefit: number;
  startDate: string;
  endDate: string;
  priorityLevel: PlanPriorityLevel;
  status: LeaderReviewStatus;
  cancelReason?: string;
}

export const leaderReviewStatusMap: Record<LeaderReviewStatus, { label: string; color: string }> = {
  pending_present:  { label: '待呈核', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  leader_reviewing: { label: '领导审核', color: 'bg-sky-50 text-sky-700 border border-sky-200' },
  leader_passed:    { label: '领导通过', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  leader_returned:  { label: '领导退回', color: 'bg-orange-50 text-orange-600 border border-orange-200' },
  rejected:         { label: '已驳回', color: 'bg-red-50 text-red-600 border border-red-200' },
  approved:         { label: '已通过', color: 'bg-teal-50 text-teal-700 border border-teal-200' },
  returned:         { label: '已退回', color: 'bg-violet-50 text-violet-600 border border-violet-200' },
  modified:         { label: '已修改', color: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
};

export const leaderReviewYears = ['2024', '2025', '2026', '2027'];
export const leaderReviewMajorCategories = ['新建', '技改', '零固', '大修'];
export const leaderReviewCategories = [
  '设备升级', '智能制造/信息化', '安全环保', '品种质量', '基础设施',
  '节能减排', '公辅配套', '产能扩张', '设备大修', '设备更新',
  '电力工程', '信息化建设', '土建工程', '环保改造', '智能化改造', '工艺改造',
];
export const leaderReviewUnits = [
  '炼铁事业部', '炼钢事业部', '热轧事业部', '冷轧事业部', '特钢事业部',
  '动力事业部', '原料事业部', '物流事业部', '工程技术部', '科技质量部', '信息部', '财务部',
];

/** TAB 顺序对齐界面草图 */
export const LEADER_REVIEW_TABS: { key: LeaderReviewStatus; label: string }[] = [
  { key: 'pending_present', label: '待呈核' },
  { key: 'leader_reviewing', label: '领导审核' },
  { key: 'leader_passed', label: '领导通过' },
  { key: 'leader_returned', label: '领导退回' },
  { key: 'rejected', label: '已驳回' },
  { key: 'approved', label: '已通过' },
  { key: 'returned', label: '已退回' },
  { key: 'modified', label: '已修改' },
];

/**
 * 每个 TAB 6～7 条；linkedPlanId 对齐申报模块以便详情。
 */
export const leaderReviewRecords: LeaderReviewRecord[] = [
  /* —— 待呈核 —— */
  {
    id: 'lr-pp-1', linkedPlanId: '2', planName: '烧结机头烟气脱硫脱硝系统升级改造',
    planYear: '2026', projectMajorCategory: '技改', projectCategory: '环保改造',
    applicant: '李明', businessUnit: '原料事业部', budget: 420.00, benefit: 88.20,
    startDate: '2026-04-01', endDate: '2027-03-31', status: 'pending_present',
    priorityLevel: 'A',
  },
  {
    id: 'lr-pp-2', linkedPlanId: 'oh5', planName: '35kV主变压器及附属系统大修',
    planYear: '2027', projectMajorCategory: '大修', projectCategory: '电力工程',
    applicant: '孙丽', businessUnit: '动力事业部', budget: 680.00, benefit: 95.00,
    startDate: '2027-02-01', endDate: '2027-06-30', status: 'pending_present',
    priorityLevel: 'B',
  },
  {
    id: 'lr-pp-3', linkedPlanId: '12', planName: '精轧机液压伺服阀组零星更新',
    planYear: '2026', projectMajorCategory: '零固', projectCategory: '设备更新',
    applicant: '王强', businessUnit: '热轧事业部', budget: 56.00, benefit: 12.00,
    startDate: '2026-04-01', endDate: '2026-06-30', status: 'pending_present',
    priorityLevel: 'C',
  },
  {
    id: 'lr-pp-4', linkedPlanId: '15', planName: '热轧厂区雨水收集与回用站新建工程',
    planYear: '2026', projectMajorCategory: '新建', projectCategory: '环保改造',
    applicant: '王强', businessUnit: '热轧事业部', budget: 245.00, benefit: 38.00,
    startDate: '2026-04-15', endDate: '2026-10-31', status: 'pending_present',
    priorityLevel: 'D',
  },
  {
    id: 'lr-pp-5', linkedPlanId: '4', planName: '原料场堆取料机无人化改造及智能调度系统建设',
    planYear: '2026', projectMajorCategory: '技改', projectCategory: '智能化改造',
    applicant: '赵芳', businessUnit: '原料事业部', budget: 650.00, benefit: 95.00,
    startDate: '2026-05-01', endDate: '2027-06-30', status: 'pending_present',
    priorityLevel: 'A',
  },
  {
    id: 'lr-pp-6', linkedPlanId: 'xj1', planName: '原料场智能堆取料系统新建',
    planYear: '2027', projectMajorCategory: '新建', projectCategory: '土建工程',
    applicant: '李明', businessUnit: '原料事业部', budget: 860.00, benefit: 120.00,
    startDate: '2027-04-01', endDate: '2027-12-31', status: 'pending_present',
    priorityLevel: 'B',
  },

  /* —— 领导审核 —— */
  {
    id: 'lr-lv-1', linkedPlanId: '7', planName: '企业级能源管理系统（EMS）平台建设项目',
    planYear: '2026', projectMajorCategory: '新建', projectCategory: '信息化建设',
    applicant: '孙丽', businessUnit: '动力事业部', budget: 550.00, benefit: 180.00,
    startDate: '2026-03-01', endDate: '2026-12-31', status: 'leader_reviewing',
    priorityLevel: 'A',
  },
  {
    id: 'lr-lv-2', linkedPlanId: 'oh6', planName: '烧结机台车及密封系统大修工程',
    planYear: '2026', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '周涛', businessUnit: '原料事业部', budget: 540.00, benefit: 160.00,
    startDate: '2026-10-01', endDate: '2027-01-31', status: 'leader_reviewing',
    priorityLevel: 'B',
  },
  {
    id: 'lr-lv-3', linkedPlanId: 'mn2', planName: '配电室低压开关柜抽屉单元更新',
    planYear: '2027', projectMajorCategory: '零固', projectCategory: '电力工程',
    applicant: '孙丽', businessUnit: '动力事业部', budget: 65.00, benefit: 10.00,
    startDate: '2027-04-01', endDate: '2027-07-31', status: 'leader_reviewing',
    priorityLevel: 'C',
  },
  {
    id: 'lr-lv-4', linkedPlanId: 'tg2', planName: '酸轧段板形闭环控制技改项目',
    planYear: '2026', projectMajorCategory: '技改', projectCategory: '工艺改造',
    applicant: '吴晓燕', businessUnit: '冷轧事业部', budget: 210.00, benefit: 55.00,
    startDate: '2026-06-01', endDate: '2026-11-30', status: 'leader_reviewing',
    priorityLevel: 'D',
  },
  {
    id: 'lr-lv-5', linkedPlanId: '1', planName: '3号高炉炉体大修及配套设备更新改造工程',
    planYear: '2026', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '张伟', businessUnit: '炼铁事业部', budget: 850.00, benefit: 120.50,
    startDate: '2026-03-01', endDate: '2026-12-31', status: 'leader_reviewing',
    priorityLevel: 'A',
  },
  {
    id: 'lr-lv-6', linkedPlanId: '16', planName: '原料码头堆场智能化地磅站新建',
    planYear: '2026', projectMajorCategory: '新建', projectCategory: '土建工程',
    applicant: '周涛', businessUnit: '物流事业部', budget: 168.00, benefit: 28.00,
    startDate: '2026-05-01', endDate: '2026-11-30', status: 'leader_reviewing',
    priorityLevel: 'B',
  },

  /* —— 领导通过 —— */
  {
    id: 'lr-lp-1', linkedPlanId: 'tg1', planName: '高炉专家系统及热风炉智能燃烧技改',
    planYear: '2027', projectMajorCategory: '技改', projectCategory: '智能化改造',
    applicant: '张伟', businessUnit: '炼铁事业部', budget: 320.00, benefit: 90.00,
    startDate: '2027-03-01', endDate: '2027-10-31', status: 'leader_passed',
    priorityLevel: 'A',
  },
  {
    id: 'lr-lp-2', linkedPlanId: 'oh3', planName: '热轧加热炉蓄热式烧嘴大修',
    planYear: '2025', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '王强', businessUnit: '热轧事业部', budget: 460.00, benefit: 85.00,
    startDate: '2025-08-01', endDate: '2026-01-31', status: 'leader_passed',
    priorityLevel: 'B',
  },
  {
    id: 'lr-lp-3', linkedPlanId: 'mn3', planName: '循环水泵房变频器更新',
    planYear: '2026', projectMajorCategory: '零固', projectCategory: '电力工程',
    applicant: '孙丽', businessUnit: '动力事业部', budget: 72.00, benefit: 15.00,
    startDate: '2026-03-01', endDate: '2026-06-30', status: 'leader_passed',
    priorityLevel: 'C',
  },
  {
    id: 'lr-lp-4', linkedPlanId: '5', planName: '厂区道路及管廊综合整治新建配套',
    planYear: '2025', projectMajorCategory: '新建', projectCategory: '基础设施',
    applicant: '刘洋', businessUnit: '工程技术部', budget: 520.00, benefit: 30.00,
    startDate: '2025-04-01', endDate: '2025-11-30', status: 'leader_passed',
    priorityLevel: 'D',
  },
  {
    id: 'lr-lp-5', linkedPlanId: '2', planName: '烧结机头烟气脱硫脱硝系统升级改造',
    planYear: '2026', projectMajorCategory: '技改', projectCategory: '环保改造',
    applicant: '李明', businessUnit: '原料事业部', budget: 420.00, benefit: 88.20,
    startDate: '2026-04-01', endDate: '2027-03-31', status: 'leader_passed',
    priorityLevel: 'A',
  },
  {
    id: 'lr-lp-6', linkedPlanId: 'oh4', planName: '高炉鼓风机本体及润滑系统大修',
    planYear: '2026', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '张伟', businessUnit: '炼铁事业部', budget: 390.00, benefit: 66.00,
    startDate: '2026-09-01', endDate: '2026-12-31', status: 'leader_passed',
    priorityLevel: 'B',
  },

  /* —— 领导退回 —— */
  {
    id: 'lr-lr-1', linkedPlanId: '8', planName: '矿石码头桥式卸船机更新换代工程',
    planYear: '2026', projectMajorCategory: '零固', projectCategory: '设备更新',
    applicant: '周涛', businessUnit: '物流事业部', budget: 760.00, benefit: 55.00,
    startDate: '2026-08-01', endDate: '2027-02-28', status: 'leader_returned',
    cancelReason: '投资估算依据不足，领导退回要求补充测算',
    priorityLevel: 'A',
  },
  {
    id: 'lr-lr-2', linkedPlanId: 'oh1', planName: '转炉倾动机构及水冷系统大修',
    planYear: '2025', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '陈刚', businessUnit: '炼钢事业部', budget: 420.00, benefit: 70.00,
    startDate: '2025-09-01', endDate: '2026-02-28', status: 'leader_returned',
    cancelReason: '计划开工时间与产线检修窗口冲突',
    priorityLevel: 'B',
  },
  {
    id: 'lr-lr-3', linkedPlanId: 'mn1', planName: '皮带通廊除尘风机变频改造',
    planYear: '2026', projectMajorCategory: '技改', projectCategory: '节能减排',
    applicant: '赵芳', businessUnit: '原料事业部', budget: 98.00, benefit: 22.00,
    startDate: '2026-05-15', endDate: '2026-09-30', status: 'leader_returned',
    cancelReason: '效益测算口径不一致，请按统一模板重算',
    priorityLevel: 'C',
  },
  {
    id: 'lr-lr-4', linkedPlanId: 'xj2', planName: '冷轧成品库智能仓储系统新建',
    planYear: '2027', projectMajorCategory: '新建', projectCategory: '智能化改造',
    applicant: '吴晓燕', businessUnit: '冷轧事业部', budget: 390.00, benefit: 65.00,
    startDate: '2027-01-15', endDate: '2027-09-30', status: 'leader_returned',
    cancelReason: '项目单位职责划分不清，请明确实施主体',
    priorityLevel: 'D',
  },
  {
    id: 'lr-lr-5', linkedPlanId: 'tg3', planName: '精炼炉电极升降系统技改',
    planYear: '2026', projectMajorCategory: '技改', projectCategory: '工艺改造',
    applicant: '陈刚', businessUnit: '炼钢事业部', budget: 175.00, benefit: 40.00,
    startDate: '2026-07-01', endDate: '2026-12-15', status: 'leader_returned',
    cancelReason: '缺少安全环保专项说明',
    priorityLevel: 'A',
  },
  {
    id: 'lr-lr-6', linkedPlanId: 'oh2', planName: '高线精轧机齿轮箱大修',
    planYear: '2025', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '刘洋', businessUnit: '特钢事业部', budget: 280.00, benefit: 48.00,
    startDate: '2025-11-01', endDate: '2026-03-31', status: 'leader_returned',
    cancelReason: '备件采购周期未论证，请完善采购计划',
    priorityLevel: 'B',
  },

  /* —— 已驳回（原已作废） —— */
  {
    id: 'lr-rj-1', linkedPlanId: '9', planName: '棒线材精整线自动化改造（暂缓方案）',
    planYear: '2025', projectMajorCategory: '技改', projectCategory: '智能化改造',
    applicant: '刘洋', businessUnit: '特钢事业部', budget: 410.00, benefit: 35.00,
    startDate: '2025-07-01', endDate: '2026-03-31', status: 'rejected',
    cancelReason: '效益不明显且与产线规划冲突，予以驳回',
    priorityLevel: 'A',
  },
  {
    id: 'lr-rj-2', linkedPlanId: 'mn4', planName: '办公区中央空调末端更新',
    planYear: '2026', projectMajorCategory: '零固', projectCategory: '基础设施',
    applicant: '李明', businessUnit: '工程技术部', budget: 88.00, benefit: 5.00,
    startDate: '2026-04-01', endDate: '2026-08-31', status: 'rejected',
    cancelReason: '非生产性投入优先级不足，予以驳回',
    priorityLevel: 'B',
  },
  {
    id: 'lr-rj-3', linkedPlanId: 'xj3', planName: '废钢加工中心扩建工程',
    planYear: '2027', projectMajorCategory: '新建', projectCategory: '产能扩张',
    applicant: '陈刚', businessUnit: '炼钢事业部', budget: 920.00, benefit: 80.00,
    startDate: '2027-03-01', endDate: '2027-12-31', status: 'rejected',
    cancelReason: '用地手续未完备，驳回后待条件成熟再报',
    priorityLevel: 'C',
  },
  {
    id: 'lr-rj-4', linkedPlanId: 'oh7', planName: '烧结主抽风机叶轮大修',
    planYear: '2025', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '赵芳', businessUnit: '原料事业部', budget: 260.00, benefit: 42.00,
    startDate: '2025-10-01', endDate: '2026-01-31', status: 'rejected',
    cancelReason: '与已批同类大修重复，合并实施更合理',
    priorityLevel: 'D',
  },
  {
    id: 'lr-rj-5', linkedPlanId: 'tg5', planName: '热轧层流冷却水质在线监测技改',
    planYear: '2026', projectMajorCategory: '技改', projectCategory: '安全环保',
    applicant: '王强', businessUnit: '热轧事业部', budget: 145.00, benefit: 18.00,
    startDate: '2026-06-01', endDate: '2026-11-30', status: 'rejected',
    cancelReason: '技术方案不成熟，驳回要求重新论证',
    priorityLevel: 'A',
  },
  {
    id: 'lr-rj-6', linkedPlanId: '10', planName: '码头皮带秤计量系统整体更换',
    planYear: '2025', projectMajorCategory: '零固', projectCategory: '设备更新',
    applicant: '周涛', businessUnit: '物流事业部', budget: 132.00, benefit: 20.00,
    startDate: '2025-09-15', endDate: '2026-02-28', status: 'rejected',
    cancelReason: '投资回报周期过长，不予通过',
    priorityLevel: 'B',
  },

  /* —— 已通过（原已立项） —— */
  {
    id: 'lr-ap-1', linkedPlanId: '3', planName: '炼钢连铸机结晶器液面控制系统升级',
    planYear: '2025', projectMajorCategory: '技改', projectCategory: '智能化改造',
    applicant: '陈刚', businessUnit: '炼钢事业部', budget: 310.00, benefit: 72.00,
    startDate: '2025-06-01', endDate: '2025-12-31', status: 'approved',
    priorityLevel: 'A',
  },
  {
    id: 'lr-ap-2', linkedPlanId: '6', planName: '智能配电房综合监控平台建设',
    planYear: '2025', projectMajorCategory: '新建', projectCategory: '信息化建设',
    applicant: '孙丽', businessUnit: '动力事业部', budget: 233.33, benefit: 48.00,
    startDate: '2025-05-01', endDate: '2025-12-31', status: 'approved',
    priorityLevel: 'B',
  },
  {
    id: 'lr-ap-3', linkedPlanId: 'oh8', planName: '连铸二冷水系统换热器大修',
    planYear: '2026', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '陈刚', businessUnit: '炼钢事业部', budget: 310.00, benefit: 52.00,
    startDate: '2026-07-01', endDate: '2026-11-30', status: 'approved',
    priorityLevel: 'C',
  },
  {
    id: 'lr-ap-4', linkedPlanId: 'mn5', planName: '原料场洒水抑尘泵组更新',
    planYear: '2026', projectMajorCategory: '零固', projectCategory: '设备更新',
    applicant: '赵芳', businessUnit: '原料事业部', budget: 64.00, benefit: 11.00,
    startDate: '2026-05-01', endDate: '2026-08-31', status: 'approved',
    priorityLevel: 'D',
  },
  {
    id: 'lr-ap-5', linkedPlanId: 'xj4', planName: '特钢精炼炉区域除尘系统新建工程',
    planYear: '2025', projectMajorCategory: '新建', projectCategory: '环保改造',
    applicant: '刘洋', businessUnit: '特钢事业部', budget: 390.00, benefit: 45.00,
    startDate: '2025-03-01', endDate: '2025-11-30', status: 'approved',
    priorityLevel: 'A',
  },
  {
    id: 'lr-ap-6', linkedPlanId: 'tg6', planName: '冷轧平整机液压系统升级技改',
    planYear: '2025', projectMajorCategory: '技改', projectCategory: '工艺改造',
    applicant: '吴晓燕', businessUnit: '冷轧事业部', budget: 275.00, benefit: 48.00,
    startDate: '2025-04-01', endDate: '2025-12-31', status: 'approved',
    priorityLevel: 'B',
  },

  /* —— 已退回 —— */
  {
    id: 'lr-rt-1', linkedPlanId: '11', planName: '厂区综合管廊一期新建工程',
    planYear: '2025', projectMajorCategory: '新建', projectCategory: '土建工程',
    applicant: '刘洋', businessUnit: '工程技术部', budget: 980.00, benefit: 40.00,
    startDate: '2025-01-15', endDate: '2025-12-31', status: 'returned',
    cancelReason: '投资规模偏大，请分期实施后重新申报',
    priorityLevel: 'A',
  },
  {
    id: 'lr-rt-2', linkedPlanId: 'oh9', planName: '转炉汽化冷却系统大修工程',
    planYear: '2025', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '陈刚', businessUnit: '炼钢事业部', budget: 520.00, benefit: 75.00,
    startDate: '2025-02-01', endDate: '2025-10-31', status: 'returned',
    cancelReason: '检修窗口与年度大修计划冲突，请调整',
    priorityLevel: 'B',
  },
  {
    id: 'lr-rt-3', linkedPlanId: 'mn6', planName: '高炉煤气管道阀门组零星更换',
    planYear: '2025', projectMajorCategory: '零固', projectCategory: '设备更新',
    applicant: '张伟', businessUnit: '炼铁事业部', budget: 48.00, benefit: 8.00,
    startDate: '2025-05-01', endDate: '2025-08-31', status: 'returned',
    cancelReason: '申报材料附件不全，请补齐后重报',
    priorityLevel: 'C',
  },
  {
    id: 'lr-rt-4', linkedPlanId: 'tg7', planName: '热轧精轧机AGC液压升级技改',
    planYear: '2026', projectMajorCategory: '技改', projectCategory: '工艺改造',
    applicant: '王强', businessUnit: '热轧事业部', budget: 360.00, benefit: 70.00,
    startDate: '2026-03-01', endDate: '2026-11-30', status: 'returned',
    cancelReason: '技术方案需补充厂家对比论证',
    priorityLevel: 'D',
  },
  {
    id: 'lr-rt-5', linkedPlanId: 'xj5', planName: '动力锅炉房脱硫废水处理站新建',
    planYear: '2026', projectMajorCategory: '新建', projectCategory: '环保改造',
    applicant: '孙丽', businessUnit: '动力事业部', budget: 410.00, benefit: 55.00,
    startDate: '2026-04-01', endDate: '2026-12-31', status: 'returned',
    cancelReason: '环评手续节点未明确，请完善后呈核',
    priorityLevel: 'A',
  },
  {
    id: 'lr-rt-6', linkedPlanId: 'oh10', planName: '冷轧酸再生系统换热器大修',
    planYear: '2026', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '吴晓燕', businessUnit: '冷轧事业部', budget: 295.00, benefit: 50.00,
    startDate: '2026-08-01', endDate: '2026-12-31', status: 'returned',
    cancelReason: '备件国产化方案未论证充分',
    priorityLevel: 'B',
  },

  /* —— 已修改 —— */
  {
    id: 'lr-md-1', linkedPlanId: '13', planName: '炼铁高炉专家系统智能化技改（修订稿）',
    planYear: '2027', projectMajorCategory: '技改', projectCategory: '智能化改造',
    applicant: '张伟', businessUnit: '炼铁事业部', budget: 430.00, benefit: 95.00,
    startDate: '2027-01-01', endDate: '2027-09-30', status: 'modified',
    priorityLevel: 'A',
  },
  {
    id: 'lr-md-2', linkedPlanId: '14', planName: '轧线编码器及测厚仪零星更新（修订）',
    planYear: '2027', projectMajorCategory: '零固', projectCategory: '设备更新',
    applicant: '王强', businessUnit: '热轧事业部', budget: 62.00, benefit: 10.00,
    startDate: '2027-03-01', endDate: '2027-05-31', status: 'modified',
    priorityLevel: 'B',
  },
  {
    id: 'lr-md-3', linkedPlanId: 'xj6', planName: '原料码头堆场智能化地磅站新建（修订）',
    planYear: '2026', projectMajorCategory: '新建', projectCategory: '土建工程',
    applicant: '周涛', businessUnit: '物流事业部', budget: 185.00, benefit: 30.00,
    startDate: '2026-06-01', endDate: '2026-12-31', status: 'modified',
    priorityLevel: 'C',
  },
  {
    id: 'lr-md-4', linkedPlanId: 'oh11', planName: '烧结机台车密封系统大修（修订稿）',
    planYear: '2026', projectMajorCategory: '大修', projectCategory: '设备大修',
    applicant: '赵芳', businessUnit: '原料事业部', budget: 560.00, benefit: 165.00,
    startDate: '2026-11-01', endDate: '2027-02-28', status: 'modified',
    priorityLevel: 'D',
  },
  {
    id: 'lr-md-5', linkedPlanId: 'tg8', planName: '酸轧段板形闭环控制技改（补充材料）',
    planYear: '2026', projectMajorCategory: '技改', projectCategory: '工艺改造',
    applicant: '吴晓燕', businessUnit: '冷轧事业部', budget: 225.00, benefit: 58.00,
    startDate: '2026-07-01', endDate: '2026-12-31', status: 'modified',
    priorityLevel: 'A',
  },
  {
    id: 'lr-md-6', linkedPlanId: 'mn7', planName: '配电室低压开关柜抽屉单元更新（修订）',
    planYear: '2027', projectMajorCategory: '零固', projectCategory: '电力工程',
    applicant: '孙丽', businessUnit: '动力事业部', budget: 70.00, benefit: 12.00,
    startDate: '2027-05-01', endDate: '2027-08-31', status: 'modified',
    priorityLevel: 'B',
  },
];
