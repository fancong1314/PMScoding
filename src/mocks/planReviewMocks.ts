export type PlanPriorityLevel = 'A' | 'B' | 'C' | 'D';

export const PRIORITY_LEVEL_TIPS: Record<PlanPriorityLevel, string> = {
  A: '法规及公司战略需求，层峰交办，内部收益率（FIRR）达到10%以上的，静态投资回收期2年以内项目；',
  B: '主设备汰旧更新的，主作业必需设备的，有形效益内部收益率（FIRR）达到8%以上的，静态投资回收期在3年以内的项目；',
  C: '静态投资回收期4年以内，无形效益有衡量指标明确改善的；',
  D: '静态投资回收期4年以上，无形效益衡量不明确的项目；',
};

export const PRIORITY_SORT_ORDER: Record<PlanPriorityLevel, number> = { A: 1, B: 2, C: 3, D: 4 };

/** 会审模块状态：待会审 / 会审中 / 已通过 / 已驳回 / 已退回 */
export type PlanReviewStatus = 'pending_joint' | 'reviewing' | 'approved' | 'rejected' | 'returned';

export type ReturnRestartNode = 'dept_review' | 're_joint' | 'project_office';

export const RETURN_RESTART_NODE_OPTIONS: { value: ReturnRestartNode; label: string }[] = [
  { value: 'dept_review', label: '部门内审' },
  { value: 're_joint', label: '重新会审' },
  { value: 'project_office', label: '项目办审批' },
];

export interface JointReviewParticipantInfo {
  id: string;
  personId: string;
  personName: string;
  unit: string;
  /** 专业意见（会审通过时填写，非必填） */
  opinion?: string;
}

export interface JointReviewMeetingInfo {
  reviewTime: string;
  location: string;
  participants: JointReviewParticipantInfo[];
  opinionSummary?: string;
}

export interface PlanReviewRecord {
  id: string;
  linkedPlanId: string;
  buSortNo: number;
  pdSortNo: number;
  ceSortNo: number;
  odSortNo: number;
  bcSortNo: number;
  zsSortNo: number;
  priorityLevel: PlanPriorityLevel;
  applyYear: string;
  projectMajorCategory: string;
  businessUnit: string;
  projectCategory: string;
  planName: string;
  budget: number;
  benefit: number;
  payment1: number;
  payment2: number;
  payment3: number;
  projectManager: string;
  latestStage: string;
  projectStatus: PlanReviewStatus;
  startTime: string;
  endTime: string;
  applicant: string;
  applyDate: string;
  cancelReason: string;
  isCancelled: boolean;
  returnRestartNode?: ReturnRestartNode;
  jointMeeting?: JointReviewMeetingInfo;
}

/** 会审通过附件要求：意见汇总表（必填）+ 其他附件（选填） */
export const jointReviewPassAttachmentConfigs = [
  {
    id: 'ac-joint-summary',
    docName: '意见汇总表',
    required: true,
    fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)'],
    fileSize: 50,
    fileSizeUnit: 'MB' as const,
    fileCount: 5,
    archived: true,
    remark: '会审意见汇总正式文件',
    templateFile: '意见汇总表模板.docx',
  },
  {
    id: 'ac-joint-other',
    docName: '其他附件',
    required: false,
    fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'],
    fileSize: 100,
    fileSizeUnit: 'MB' as const,
    fileCount: 10,
    archived: false,
    remark: '会议纪要、现场照片等相关补充材料',
    templateFile: '',
  },
];

export const planReviewStatusMap: Record<string, { label: string; color: string }> = {
  pending_joint: { label: '待会审', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  reviewing:     { label: '会审中', color: 'bg-sky-50 text-sky-700 border border-sky-200' },
  approved:      { label: '已通过', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  rejected:      { label: '已驳回', color: 'bg-red-50 text-red-600 border border-red-200' },
  returned:      { label: '已退回', color: 'bg-orange-50 text-orange-600 border border-orange-200' },
  pending:       { label: '待会审', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  presenting:    { label: '会审中', color: 'bg-sky-50 text-sky-700 border border-sky-200' },
  supplementing: { label: '已退回', color: 'bg-orange-50 text-orange-600 border border-orange-200' },
  cancelled:     { label: '已驳回', color: 'bg-slate-100 text-slate-500 border border-slate-200' },
};

export function normalizePlanReviewStatus(status: string): PlanReviewStatus {
  const map: Record<string, PlanReviewStatus> = {
    pending_joint: 'pending_joint',
    pending: 'pending_joint',
    reviewing: 'reviewing',
    presenting: 'reviewing',
    approved: 'approved',
    rejected: 'rejected',
    cancelled: 'rejected',
    returned: 'returned',
    supplementing: 'returned',
  };
  return map[status] || 'pending_joint';
}

export const planReviewBusinessUnits = ['炼铁事业部', '炼钢事业部', '热轧事业部', '冷轧事业部', '特钢事业部', '工程技术部', '科技质量部', '公辅能源部', '动力事业部', '原料事业部', '物流事业部'];
export const planReviewCategories = ['设备升级', '智能制造/信息化', '安全环保', '品种质量', '基础设施', '节能减排', '公辅配套', '产能扩张', '设备大修', '设备更新', '电力工程', '信息化建设', '土建工程', '环保改造', '智能化改造', '工艺改造'];
export const planReviewMajorCategories = ['新建', '技改', '零固', '大修'];
export const planReviewYears = ['2024', '2025', '2026', '2027'];

export const jointReviewPersonnel = [
  { id: 'BX0600908', name: '李冰杰', unit: '展厅服务组' },
  { id: 'BX0600912', name: '王敏', unit: '设备技术部' },
  { id: 'BX0600920', name: '张建国', unit: '炼铁事业部' },
  { id: 'BX0600931', name: '陈思远', unit: '热轧事业部' },
  { id: 'BX0600944', name: '赵明辉', unit: '工程管理部' },
  { id: 'BX0600955', name: '孙宇', unit: '科技质量部' },
  { id: 'BX0600966', name: '吴刚', unit: '动力事业部' },
  { id: 'BX0600977', name: '郑浩', unit: '安全环保部' },
  { id: 'BX0600988', name: '谢海涛', unit: '财务部' },
  { id: 'BX0600999', name: '刘洋', unit: '战略运营部' },
];

/** 会审中演示记录的默认会审信息 */
export function defaultJointMeeting(seed = 0): JointReviewMeetingInfo {
  const people = [
    jointReviewPersonnel[seed % jointReviewPersonnel.length],
    jointReviewPersonnel[(seed + 1) % jointReviewPersonnel.length],
    jointReviewPersonnel[(seed + 3) % jointReviewPersonnel.length],
  ];
  return {
    reviewTime: `2026-03-${String(10 + (seed % 15)).padStart(2, '0')}T14:30`,
    location: seed % 2 === 0 ? '工程管理部三楼会议室' : '公司主楼A201会议室',
    participants: people.map((p, i) => ({
      id: `jp_demo_${seed}_${i}`,
      personId: p.id,
      personName: p.name,
      unit: p.unit,
      opinion: '',
    })),
  };
}

export const planReviewRecords: PlanReviewRecord[] = [
  {
    id: 'pr-pj-1', linkedPlanId: '2', buSortNo: 1, pdSortNo: 1, ceSortNo: 1, odSortNo: 1, bcSortNo: 1, zsSortNo: 1,
    priorityLevel: 'A',
    applyYear: '2026', projectMajorCategory: '技改', businessUnit: '原料事业部', projectCategory: '环保改造',
    planName: '烧结机头烟气脱硫脱硝系统升级改造',
    budget: 420.00, benefit: 88.20, payment1: 200.00, payment2: 150.00, payment3: 70.00,
    projectManager: '李明', latestStage: '待会审', projectStatus: 'pending_joint',
    startTime: '2026-04', endTime: '2027-03', applicant: '李明', applyDate: '2026-01-18', cancelReason: '', isCancelled: false,
  },
  {
    id: 'pr-pj-2', linkedPlanId: 'oh5', buSortNo: 2, pdSortNo: 2, ceSortNo: 2, odSortNo: 2, bcSortNo: 2, zsSortNo: 2,
    priorityLevel: 'B',
    applyYear: '2027', projectMajorCategory: '大修', businessUnit: '动力事业部', projectCategory: '电力工程',
    planName: '35kV主变压器及附属系统大修',
    budget: 680.00, benefit: 95.00, payment1: 400.00, payment2: 280.00, payment3: 0,
    projectManager: '孙丽', latestStage: '待会审', projectStatus: 'pending_joint',
    startTime: '2027-02', endTime: '2027-06', applicant: '孙丽', applyDate: '2026-02-09', cancelReason: '', isCancelled: false,
  },
  {
    id: 'pr-pj-3', linkedPlanId: '12', buSortNo: 3, pdSortNo: 3, ceSortNo: 3, odSortNo: 3, bcSortNo: 3, zsSortNo: 3,
    priorityLevel: 'C',
    applyYear: '2026', projectMajorCategory: '零固', businessUnit: '热轧事业部', projectCategory: '设备更新',
    planName: '精轧机液压伺服阀组零星更新',
    budget: 56.00, benefit: 12.00, payment1: 56.00, payment2: 0, payment3: 0,
    projectManager: '王强', latestStage: '待会审', projectStatus: 'pending_joint',
    startTime: '2026-04', endTime: '2026-06', applicant: '王强', applyDate: '2026-01-20', cancelReason: '', isCancelled: false,
  },
  {
    id: 'pr-pj-4', linkedPlanId: '15', buSortNo: 4, pdSortNo: 4, ceSortNo: 4, odSortNo: 4, bcSortNo: 4, zsSortNo: 4,
    priorityLevel: 'A',
    applyYear: '2026', projectMajorCategory: '新建', businessUnit: '热轧事业部', projectCategory: '环保改造',
    planName: '热轧厂区雨水收集与回用站新建工程',
    budget: 245.00, benefit: 38.00, payment1: 145.00, payment2: 100.00, payment3: 0,
    projectManager: '王强', latestStage: '待会审', projectStatus: 'pending_joint',
    startTime: '2026-04', endTime: '2026-10', applicant: '王强', applyDate: '2026-02-01', cancelReason: '', isCancelled: false,
  },
  {
    id: 'pr-pj-5', linkedPlanId: '4', buSortNo: 5, pdSortNo: 5, ceSortNo: 5, odSortNo: 5, bcSortNo: 5, zsSortNo: 5,
    priorityLevel: 'B',
    applyYear: '2026', projectMajorCategory: '技改', businessUnit: '原料事业部', projectCategory: '智能化改造',
    planName: '原料场堆取料机无人化改造及智能调度系统建设',
    budget: 650.00, benefit: 95.00, payment1: 250.00, payment2: 300.00, payment3: 100.00,
    projectManager: '赵芳', latestStage: '待会审', projectStatus: 'pending_joint',
    startTime: '2026-05', endTime: '2027-06', applicant: '赵芳', applyDate: '2026-01-08', cancelReason: '', isCancelled: false,
  },
  {
    id: 'pr-pj-6', linkedPlanId: '8', buSortNo: 6, pdSortNo: 6, ceSortNo: 6, odSortNo: 6, bcSortNo: 6, zsSortNo: 6,
    priorityLevel: 'C',
    applyYear: '2026', projectMajorCategory: '零固', businessUnit: '物流事业部', projectCategory: '设备更新',
    planName: '矿石码头桥式卸船机更新换代工程',
    budget: 760.00, benefit: 55.00, payment1: 200.00, payment2: 360.00, payment3: 200.00,
    projectManager: '周涛', latestStage: '待会审', projectStatus: 'pending_joint',
    startTime: '2026-08', endTime: '2027-02', applicant: '周涛', applyDate: '2026-01-10', cancelReason: '', isCancelled: false,
  },
  {
    id: 'pr-pj-7', linkedPlanId: 'xj1', buSortNo: 7, pdSortNo: 7, ceSortNo: 7, odSortNo: 7, bcSortNo: 7, zsSortNo: 7,
    priorityLevel: 'D',
    applyYear: '2027', projectMajorCategory: '新建', businessUnit: '原料事业部', projectCategory: '土建工程',
    planName: '原料场智能堆取料系统新建',
    budget: 860.00, benefit: 120.00, payment1: 400.00, payment2: 460.00, payment3: 0,
    projectManager: '李明', latestStage: '待会审', projectStatus: 'pending_joint',
    startTime: '2027-04', endTime: '2027-12', applicant: '李明', applyDate: '2026-02-25', cancelReason: '', isCancelled: false,
  },
  {
    id: 'pr-rv-1', linkedPlanId: '7', buSortNo: 1, pdSortNo: 1, ceSortNo: 1, odSortNo: 1, bcSortNo: 1, zsSortNo: 1,
    priorityLevel: 'A',
    applyYear: '2026', projectMajorCategory: '新建', businessUnit: '动力事业部', projectCategory: '信息化建设',
    planName: '企业级能源管理系统（EMS）平台建设项目',
    budget: 550.00, benefit: 180.00, payment1: 220.00, payment2: 200.00, payment3: 130.00,
    projectManager: '孙丽', latestStage: '会审中', projectStatus: 'reviewing',
    startTime: '2026-03', endTime: '2026-12', applicant: '孙丽', applyDate: '2025-12-25', cancelReason: '', isCancelled: false,
    jointMeeting: defaultJointMeeting(0),
  },
  {
    id: 'pr-rv-2', linkedPlanId: 'oh6', buSortNo: 2, pdSortNo: 2, ceSortNo: 2, odSortNo: 2, bcSortNo: 2, zsSortNo: 2,
    priorityLevel: 'B',
    applyYear: '2026', projectMajorCategory: '大修', businessUnit: '原料事业部', projectCategory: '设备大修',
    planName: '烧结机台车及密封系统大修工程',
    budget: 540.00, benefit: 160.00, payment1: 300.00, payment2: 240.00, payment3: 0,
    projectManager: '李明', latestStage: '会审中', projectStatus: 'reviewing',
    startTime: '2026-10', endTime: '2027-01', applicant: '周涛', applyDate: '2026-02-11', cancelReason: '', isCancelled: false,
    jointMeeting: defaultJointMeeting(1),
  },
  {
    id: 'pr-rv-3', linkedPlanId: 'mn2', buSortNo: 3, pdSortNo: 3, ceSortNo: 3, odSortNo: 3, bcSortNo: 3, zsSortNo: 3,
    priorityLevel: 'C',
    applyYear: '2027', projectMajorCategory: '零固', businessUnit: '动力事业部', projectCategory: '电力工程',
    planName: '配电室低压开关柜抽屉单元更新',
    budget: 65.00, benefit: 10.00, payment1: 65.00, payment2: 0, payment3: 0,
    projectManager: '孙丽', latestStage: '会审中', projectStatus: 'reviewing',
    startTime: '2027-04', endTime: '2027-07', applicant: '孙丽', applyDate: '2026-02-15', cancelReason: '', isCancelled: false,
    jointMeeting: defaultJointMeeting(2),
  },
  {
    id: 'pr-rv-4', linkedPlanId: 'tg2', buSortNo: 4, pdSortNo: 4, ceSortNo: 4, odSortNo: 4, bcSortNo: 4, zsSortNo: 4,
    priorityLevel: 'A',
    applyYear: '2026', projectMajorCategory: '技改', businessUnit: '冷轧事业部', projectCategory: '工艺改造',
    planName: '酸轧段板形闭环控制技改项目',
    budget: 210.00, benefit: 55.00, payment1: 210.00, payment2: 0, payment3: 0,
    projectManager: '吴晓燕', latestStage: '会审中', projectStatus: 'reviewing',
    startTime: '2026-06', endTime: '2026-11', applicant: '吴晓燕', applyDate: '2026-01-08', cancelReason: '', isCancelled: false,
    jointMeeting: defaultJointMeeting(3),
  },
  {
    id: 'pr-rv-5', linkedPlanId: '1', buSortNo: 5, pdSortNo: 5, ceSortNo: 5, odSortNo: 5, bcSortNo: 5, zsSortNo: 5,
    priorityLevel: 'B',
    applyYear: '2026', projectMajorCategory: '大修', businessUnit: '炼铁事业部', projectCategory: '设备大修',
    planName: '3号高炉炉体大修及配套设备更新改造工程',
    budget: 850.00, benefit: 120.50, payment1: 300.00, payment2: 400.00, payment3: 150.00,
    projectManager: '张伟', latestStage: '会审中', projectStatus: 'reviewing',
    startTime: '2026-03', endTime: '2026-12', applicant: '张伟', applyDate: '2026-01-15', cancelReason: '', isCancelled: false,
    jointMeeting: defaultJointMeeting(4),
  },
  {
    id: 'pr-rv-6', linkedPlanId: '16', buSortNo: 6, pdSortNo: 6, ceSortNo: 6, odSortNo: 6, bcSortNo: 6, zsSortNo: 6,
    priorityLevel: 'D',
    applyYear: '2026', projectMajorCategory: '新建', businessUnit: '物流事业部', projectCategory: '土建工程',
    planName: '原料码头堆场智能化地磅站新建',
    budget: 168.00, benefit: 28.00, payment1: 100.00, payment2: 68.00, payment3: 0,
    projectManager: '周涛', latestStage: '会审中', projectStatus: 'reviewing',
    startTime: '2026-05', endTime: '2026-11', applicant: '周涛', applyDate: '2026-02-08', cancelReason: '', isCancelled: false,
    jointMeeting: defaultJointMeeting(5),
  },
  {
    id: 'pr-rv-7', linkedPlanId: 'tg1', buSortNo: 7, pdSortNo: 7, ceSortNo: 7, odSortNo: 7, bcSortNo: 7, zsSortNo: 7,
    priorityLevel: 'C',
    applyYear: '2027', projectMajorCategory: '技改', businessUnit: '炼铁事业部', projectCategory: '智能化改造',
    planName: '高炉专家系统及热风炉智能燃烧技改',
    budget: 320.00, benefit: 90.00, payment1: 200.00, payment2: 120.00, payment3: 0,
    projectManager: '张伟', latestStage: '会审中', projectStatus: 'reviewing',
    startTime: '2027-03', endTime: '2027-10', applicant: '张伟', applyDate: '2026-02-23', cancelReason: '', isCancelled: false,
    jointMeeting: defaultJointMeeting(6),
  },
];
