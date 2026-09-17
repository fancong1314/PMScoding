/** 项目总览 — 演示数据 */

import {
  defaultJointMeeting,
  type JointReviewMeetingInfo,
} from './planReviewMocks';

export type OverviewProjectStatus = 'normal' | 'paused' | 'terminated';

/** 项目全生命周期节点（总览详情页阶段轴） */
export type OverviewLifecycleStage =
  | 'approved'
  | 'started'
  | 'unit_debug'
  | 'cold_commission'
  | 'hot_test'
  | 'finished'
  | 'completed'
  | 'post_eval';

export const OVERVIEW_LIFECYCLE_STAGES: {
  key: OverviewLifecycleStage;
  label: string;
  icon: string;
}[] = [
  { key: 'approved', label: '已立项', icon: 'ri-flag-line' },
  { key: 'started', label: '已开工', icon: 'ri-hammer-line' },
  { key: 'unit_debug', label: '已单体调试', icon: 'ri-tools-line' },
  { key: 'cold_commission', label: '已冷态大联调', icon: 'ri-links-line' },
  { key: 'hot_test', label: '已热试', icon: 'ri-fire-line' },
  { key: 'finished', label: '已完工', icon: 'ri-checkbox-circle-line' },
  { key: 'completed', label: '已竣工', icon: 'ri-building-4-line' },
  { key: 'post_eval', label: '后评价', icon: 'ri-line-chart-line' },
];

export interface InitiationOverviewRecord {
  id: string;
  projectName: string;
  approvalNo: string;
  annualPlanNo: string;
  businessUnit: string;
  /** 如：技改-基础设施 */
  projectType: string;
  projectMajorType: string;
  approvalDate: string;
  /** 立项总概算（万元） */
  budgetAmount: number;
  /** 项目实际金额（万元） */
  actualAmount: number;
  projectManager: string;
  projectManagerPhone: string;
  startDate: string;
  endDate: string;
  status: OverviewProjectStatus;
  /** 关联立项申请单，用于复用详情表单 */
  linkedPlanId: string;
  lifecycleStage: OverviewLifecycleStage;
}

export const OVERVIEW_STORAGE_KEY = 'ng_init_overview_v4';

export const overviewStatusMap: Record<
  OverviewProjectStatus,
  { label: string; cls: string }
> = {
  normal: { label: '正常', cls: 'bg-slate-100 text-steel-600' },
  paused: { label: '暂停', cls: 'bg-amber-400 text-white' },
  terminated: { label: '终止', cls: 'bg-red-500 text-white' },
};

export const overviewUnits = [
  '信息部', '炼铁厂', '炼钢厂', '热轧厂', '冷轧厂', '动力厂', '原料厂', '工程管理部', '设备管理部',
];

export const overviewProjectTypes = [
  '新建-产能扩张',
  '新建-安全环保',
  '技改-基础设施',
  '技改-环保改造',
  '技改-节能减排',
  '技改-智能化改造',
  '营缮-设备营缮',
  '零固-设备更新',
  '零固-信息化建设',
];

export const overviewStatusOptions: { value: OverviewProjectStatus | ''; label: string }[] = [
  { value: '', label: '全部状态' },
  { value: 'normal', label: '正常' },
  { value: 'paused', label: '暂停' },
  { value: 'terminated', label: '终止' },
];

/**
 * 演示数据：覆盖正常 / 暂停 / 终止，项目大类齐全；数量满足列表演示。
 */
export const initiationOverviewRecords: InitiationOverviewRecord[] = [
  {
    id: 'ov-01', projectName: '炼铁厂原料场封闭抑尘改造', approvalNo: '2341234', annualPlanNo: '223232',
    businessUnit: '信息部', projectType: '技改-基础设施', projectMajorType: '技改',
    approvalDate: '2021-11-22', budgetAmount: 100.11, actualAmount: 100.11,
    projectManager: '小明', projectManagerPhone: '15691993333',
    startDate: '2020-12-12', endDate: '2021-12-12', status: 'normal',
    linkedPlanId: '4', lifecycleStage: 'completed',
  },
  {
    id: 'ov-02', projectName: '1#烧结机头脱硫脱硝提标改造', approvalNo: '2341235', annualPlanNo: '223233',
    businessUnit: '原料厂', projectType: '技改-环保改造', projectMajorType: '技改',
    approvalDate: '2022-03-15', budgetAmount: 86.50, actualAmount: 82.30,
    projectManager: '李明', projectManagerPhone: '13801380138',
    startDate: '2022-04-01', endDate: '2023-03-31', status: 'paused',
    linkedPlanId: '2', lifecycleStage: 'unit_debug',
  },
  {
    id: 'ov-03', projectName: '冷轧酸再生危废暂存库新建', approvalNo: '2341236', annualPlanNo: '223234',
    businessUnit: '冷轧厂', projectType: '新建-安全环保', projectMajorType: '新建',
    approvalDate: '2023-06-08', budgetAmount: 54.00, actualAmount: 48.20,
    projectManager: '孙丽', projectManagerPhone: '13910001111',
    startDate: '2023-07-01', endDate: '2024-06-30', status: 'terminated',
    linkedPlanId: 'xj2', lifecycleStage: 'approved',
  },
  {
    id: 'ov-04', projectName: '3号高炉热风炉阀门组大修', approvalNo: '2341237', annualPlanNo: '223235',
    businessUnit: '炼铁厂', projectType: '营缮-设备营缮', projectMajorType: '营缮',
    approvalDate: '2024-01-20', budgetAmount: 42.80, actualAmount: 41.50,
    projectManager: '王强', projectManagerPhone: '13700002222',
    startDate: '2024-02-15', endDate: '2024-08-31', status: 'normal',
    linkedPlanId: 'oh6', lifecycleStage: 'started',
  },
  {
    id: 'ov-05', projectName: '能源计量远程抄表终端购置', approvalNo: '2341238', annualPlanNo: '223236',
    businessUnit: '动力厂', projectType: '零固-信息化建设', projectMajorType: '零固',
    approvalDate: '2024-05-12', budgetAmount: 12.60, actualAmount: 12.60,
    projectManager: '赵芳', projectManagerPhone: '13600003333',
    startDate: '2024-06-01', endDate: '2024-11-30', status: 'normal',
    linkedPlanId: 'mn2', lifecycleStage: 'cold_commission',
  },
  {
    id: 'ov-06', projectName: '热轧加热炉节能烧嘴改造', approvalNo: '2341239', annualPlanNo: '223237',
    businessUnit: '热轧厂', projectType: '技改-节能减排', projectMajorType: '技改',
    approvalDate: '2025-02-18', budgetAmount: 76.40, actualAmount: 70.00,
    projectManager: '周涛', projectManagerPhone: '13500004444',
    startDate: '2025-03-01', endDate: '2025-12-31', status: 'paused',
    linkedPlanId: 'tg3', lifecycleStage: 'hot_test',
  },
  {
    id: 'ov-07', projectName: '特钢连铸二冷段封闭罩新建', approvalNo: '2341240', annualPlanNo: '223238',
    businessUnit: '炼钢厂', projectType: '新建-安全环保', projectMajorType: '新建',
    approvalDate: '2025-08-05', budgetAmount: 37.00, actualAmount: 35.80,
    projectManager: '张伟', projectManagerPhone: '13400005555',
    startDate: '2025-09-01', endDate: '2026-06-30', status: 'normal',
    linkedPlanId: 'xj1', lifecycleStage: 'approved',
  },
  {
    id: 'ov-08', projectName: '物流厂轨道衡检定标准器更新', approvalNo: '2341241', annualPlanNo: '223239',
    businessUnit: '工程管理部', projectType: '零固-设备更新', projectMajorType: '零固',
    approvalDate: '2025-11-11', budgetAmount: 8.20, actualAmount: 8.00,
    projectManager: '陈建华', projectManagerPhone: '13300006666',
    startDate: '2025-12-01', endDate: '2026-03-31', status: 'normal',
    linkedPlanId: 'mn1', lifecycleStage: 'post_eval',
  },
  {
    id: 'ov-09', projectName: '原料码头皮带通廊智能化改造', approvalNo: '2341242', annualPlanNo: '223240',
    businessUnit: '设备管理部', projectType: '技改-智能化改造', projectMajorType: '技改',
    approvalDate: '2026-01-09', budgetAmount: 91.00, actualAmount: 88.50,
    projectManager: '吴晓燕', projectManagerPhone: '13200007777',
    startDate: '2026-02-01', endDate: '2026-12-31', status: 'terminated',
    linkedPlanId: 'tg2', lifecycleStage: 'finished',
  },
  {
    id: 'ov-10', projectName: '高炉冲渣水余热回收系统新建', approvalNo: '2341243', annualPlanNo: '223241',
    businessUnit: '炼铁厂', projectType: '新建-产能扩张', projectMajorType: '新建',
    approvalDate: '2026-03-01', budgetAmount: 120.00, actualAmount: 115.00,
    projectManager: '小明', projectManagerPhone: '15691993333',
    startDate: '2026-04-01', endDate: '2027-03-31', status: 'normal',
    linkedPlanId: '15', lifecycleStage: 'started',
  },
];

export interface OverviewJointAttachmentFile {
  id: string;
  name: string;
  size: number;
}

export interface OverviewJointReviewDetail {
  meeting: JointReviewMeetingInfo;
  attachments: Record<string, OverviewJointAttachmentFile[]>;
}

const JOINT_SUMMARY_SEED: Record<string, string> = {
  'ov-01': '各专业意见总体同意立项，环保与工期风险已明确管控要求，予以会审通过。',
  'ov-02': '投资估算偏高，建议复核设备选型与施工组织后再次确认费用口径。',
  'ov-03': '安全环保方案基本可行，危废暂存库选址需补充环评批复引用说明。',
  'ov-04': '营缮窗口与高炉定修计划衔接合理，备件清单与工期安排可执行。',
  'ov-05': '信息化零固项目边界清晰，接口与计量口径已确认，同意通过。',
  'ov-06': '节能指标测算需补充对标数据，其余专业意见同意推进招投标。',
  'ov-07': '新建封闭罩方案可行，建议同步评估连铸检修通道与消防疏散。',
  'ov-08': '检定标准器更新为常规零固，会审意见一致通过。',
  'ov-09': '智能化改造范围需与码头运营窗口匹配，同意按修订范围执行。',
  'ov-10': '余热回收效益测算合理，建议提前落实并网与热水用户协议。',
};

function buildJointAttachments(overviewId: string): Record<string, OverviewJointAttachmentFile[]> {
  return {
    'ac-joint-summary': [
      { id: `${overviewId}-sum-1`, name: '意见汇总表.pdf', size: 482_000 },
      { id: `${overviewId}-sum-2`, name: '会审纪要.docx', size: 126_000 },
    ],
    'ac-joint-other': [
      { id: `${overviewId}-oth-1`, name: '现场照片.zip', size: 2_450_000 },
    ],
  };
}

/** 总览详情 · 会审详情（只读演示） */
export function getOverviewJointReviewDetail(overviewId: string): OverviewJointReviewDetail {
  const idx = Math.max(0, initiationOverviewRecords.findIndex((r) => r.id === overviewId));
  const seed = idx >= 0 ? idx : 0;
  const meeting = defaultJointMeeting(seed);
  meeting.opinionSummary = JOINT_SUMMARY_SEED[overviewId]
    || '各专业单位意见已汇总，总体同意立项推进，请按会审纪要落实相关整改项。';
  if (meeting.participants.length > 0) {
    const last = meeting.participants[meeting.participants.length - 1];
    last.signed = false;
    last.signTime = '';
    last.passResult = '';
    last.opinion = '';
    last.attachments = [];
  }
  return {
    meeting,
    attachments: buildJointAttachments(overviewId),
  };
}

export function getOverviewRecordById(id: string): InitiationOverviewRecord | undefined {
  return initiationOverviewRecords.find((r) => r.id === id);
}

export function getLifecycleStageIndex(stage: OverviewLifecycleStage): number {
  return OVERVIEW_LIFECYCLE_STAGES.findIndex((s) => s.key === stage);
}

/** 后续 TAB 演示占位（合同/成员/费用/物料/档案） */
export interface OverviewTabPlaceholderRow {
  id: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

export function getOverviewTabPlaceholderRows(
  overviewId: string,
  tab: 'contract' | 'member' | 'cost' | 'material' | 'archive'
): OverviewTabPlaceholderRow[] {
  const rec = getOverviewRecordById(overviewId);
  const name = rec?.projectName || '演示项目';
  const templates: Record<typeof tab, OverviewTabPlaceholderRow[]> = {
    contract: [
      { id: 'c1', col1: `${name}-施工总承包`, col2: '施工分包合同', col3: '已签订', col4: '2,850.00' },
      { id: 'c2', col1: `${name}-设备供货`, col2: '设备采购合同', col3: '履约中', col4: '1,260.00' },
      { id: 'c3', col1: `${name}-设计服务`, col2: '设计合同', col3: '已关闭', col4: '186.00' },
      { id: 'c4', col1: `${name}-监理服务`, col2: '监理合同', col3: '履约中', col4: '98.50' },
      { id: 'c5', col1: `${name}-技术咨询`, col2: '咨询服务合同', col3: '草稿', col4: '45.00' },
    ],
    member: [
      { id: 'm1', col1: '项目经理', col2: rec?.projectManager || '张伟', col3: '工程管理部', col4: '在岗' },
      { id: 'm2', col1: '土建专业负责人', col2: '李建国', col3: '工程管理部', col4: '在岗' },
      { id: 'm3', col1: '设备专业负责人', col2: '王海涛', col3: '设备管理部', col4: '在岗' },
      { id: 'm4', col1: '安全员', col2: '赵敏', col3: '安环部', col4: '在岗' },
      { id: 'm5', col1: '资料员', col2: '陈晓', col3: '工程管理部', col4: '借调' },
    ],
    cost: [
      { id: 'f1', col1: '设计费', col2: '已发生', col3: '12.50', col4: '合同进度款' },
      { id: 'f2', col1: '建安费', col2: '已发生', col3: '68.20', col4: '进度结算' },
      { id: 'f3', col1: '设备费', col2: '已发生', col3: '35.80', col4: '到货验收' },
      { id: 'f4', col1: '其他', col2: '预留', col3: '4.60', col4: '不可预见费' },
      { id: 'f5', col1: '费用增补', col2: '审批中', col3: '8.00', col4: '变更增补' },
    ],
    material: [
      { id: 'mt1', col1: '除尘管道', col2: '吨', col3: '126.5', col4: '已到货' },
      { id: 'mt2', col1: '变频电机', col2: '台', col3: '8', col4: '部分到货' },
      { id: 'mt3', col1: '控制柜', col2: '套', col3: '4', col4: '已入库' },
      { id: 'mt4', col1: '电缆', col2: '千米', col3: '3.2', col4: '采购中' },
      { id: 'mt5', col1: '密封件备件', col2: '套', col3: '20', col4: '已领用' },
    ],
    archive: [
      { id: 'a1', col1: '立项批复', col2: '必填', col3: '已上传', col4: '存档' },
      { id: 'a2', col1: '可行性研究报告', col2: '必填', col3: '已上传', col4: '存档' },
      { id: 'a3', col1: '会审纪要', col2: '必填', col3: '已上传', col4: '存档' },
      { id: 'a4', col1: '合同扫描件', col2: '选填', col3: '已上传', col4: '存档' },
      { id: 'a5', col1: '竣工验收报告', col2: '选填', col3: '未上传', col4: '不存档' },
    ],
  };
  return templates[tab];
}