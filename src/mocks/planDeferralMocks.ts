export type PlanApplicationType = 'delay' | 'suspend' | 'terminate' | 'execute';
export type PlanStatus = '正常' | '暂缓' | '延期' | '终止';
export type PlanApprovalStatus = '无申请' | '审批中' | '已通过' | '已驳回';

export interface PlanDeferralRecord {
  id: string;
  planNo: string;
  planName: string;
  unit: string;
  /** 投资总估算（万元） */
  investAmount: number;
  projectDesc: string;
  planYear: number;
  archiveDate: string;
  updateDate: string;
  planStatus: PlanStatus;
  approvalStatus: PlanApprovalStatus;
  projectType: string;
  /** 项目大类：新建/技改/零固/大修 */
  projectMajorCategory: string;
  division: string;
  planStartDate: string;
  planEndDate: string;
  projectSummary: string;
  allowedActions: PlanApplicationType[];
}

export const planDeferralStatusMap: Record<PlanStatus, { label: string; color: string }> = {
  '正常': { label: '正常', color: 'bg-green-50 text-green-700 border-green-200' },
  '暂缓': { label: '暂缓', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  '延期': { label: '延期', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  '终止': { label: '终止', color: 'bg-red-50 text-red-600 border-red-200' },
};

export const planApprovalStatusMap: Record<PlanApprovalStatus, { label: string; dotColor: string }> = {
  '无申请': { label: '无申请', dotColor: 'bg-steel-300' },
  '审批中': { label: '审批中', dotColor: 'bg-amber-400' },
  '已通过': { label: '已通过', dotColor: 'bg-green-500' },
  '已驳回': { label: '已驳回', dotColor: 'bg-red-500' },
};

export const planAppTypeMap: Record<PlanApplicationType, { label: string; color: string }> = {
  delay:     { label: '延期申请', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  suspend:   { label: '暂缓申请', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  terminate: { label: '终止申请', color: 'bg-red-50 text-red-600 border-red-200' },
  execute:   { label: '启动申请', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export const planActionConfig: Record<PlanApplicationType, { label: string; color: string }> = {
  delay:     { label: '延期', color: 'text-amber-600 border-amber-200 hover:bg-amber-50' },
  suspend:   { label: '暂缓', color: 'text-sky-600 border-sky-200 hover:bg-sky-50' },
  terminate: { label: '终止', color: 'text-red-600 border-red-200 hover:bg-red-50' },
  execute:   { label: '启动', color: 'text-emerald-600 border-emerald-200 hover:bg-emerald-50' },
};

export const divisions = ['公司办', '物流中心', '科技部', '炼铁部', '炼钢部', '薄板部', '中厚板部', '棒线材部', '能源环保部', '设备部'];
export const projectCategories = ['信息化', '人工智能', '自动化', '基础设施', '安全环保', '节能降耗', '技术改造'];
export const projectMajorCategories = ['新建', '技改', '零固', '大修'];
export const reportYears = ['2026', '2025', '2024', '2023'];

export const planDeferralRecords: PlanDeferralRecord[] = [
  {
    id: 'PDR001',
    planNo: '26X92260',
    planName: '小车队里厂房出港',
    unit: '公司办',
    investAmount: 10,
    projectDesc: '南北大花，采用供应水库，事项等共6八次设有效果，导动部分网络实验器，长期测量安备份，严量单个工身体综合控制使用频率统计',
    planYear: 2026,
    archiveDate: '20260407',
    updateDate: '20260318',
    planStatus: '正常',
    approvalStatus: '无申请',
    projectType: '信息化',
    projectMajorCategory: '技改',
    division: '公司办',
    planStartDate: '2026-04-01',
    planEndDate: '2026-12-31',
    projectSummary: '对小车队厂房出港流程进行数字化改造，提升管控效率',
    allowedActions: ['delay', 'suspend', 'terminate'],
  },
  {
    id: 'PDR002',
    planNo: '26X92250',
    planName: '智慧中心顶楼防水',
    unit: '公司办',
    investAmount: 24,
    projectDesc: '智慧AB楼逻顶防水功能修缮，导致前台中心组八厅会设立，办公在不同天净水，由港卿分区公域图形功',
    planYear: 2026,
    archiveDate: '20260318',
    updateDate: '20260318',
    planStatus: '暂缓',
    approvalStatus: '无申请',
    projectType: '基础设施',
    projectMajorCategory: '大修',
    division: '公司办',
    planStartDate: '2026-05-01',
    planEndDate: '2026-08-30',
    projectSummary: '对智慧中心AB楼顶层防水层进行整体翻修',
    allowedActions: ['delay', 'execute', 'terminate'],
  },
  {
    id: 'PDR003',
    planNo: '26X92240',
    planName: '科技楼监控设备新大修',
    unit: '公司办',
    investAmount: 6,
    projectDesc: '科技楼监控系统已近年运行已较运行数据，设备老化，画面模糊，尤其进据实验楼等，已无法满足现代的安防监控要求',
    planYear: 2026,
    archiveDate: '20260318',
    updateDate: '20260318',
    planStatus: '暂缓',
    approvalStatus: '审批中',
    projectType: '信息化',
    projectMajorCategory: '零固',
    division: '科技部',
    planStartDate: '2026-03-01',
    planEndDate: '2026-06-30',
    projectSummary: '全面升级科技楼安防监控系统',
    allowedActions: ['delay', 'execute', 'terminate'],
  },
  {
    id: 'PDR004',
    planNo: '26X92230',
    planName: '科技楼一楼大厅更换',
    unit: '公司办',
    investAmount: 27,
    projectDesc: '在线上层楼在电梯楼当前已运行多年，出现老化，闸，闸发图帮，区提拓，请以楼，建议购买',
    planYear: 2025,
    archiveDate: '20260318',
    updateDate: '20260318',
    planStatus: '正常',
    approvalStatus: '已通过',
    projectType: '基础设施',
    projectMajorCategory: '新建',
    division: '科技部',
    planStartDate: '2025-06-01',
    planEndDate: '2025-12-31',
    projectSummary: '更换科技楼一楼大厅装修材料及设备',
    allowedActions: ['delay', 'suspend', 'terminate'],
  },
  {
    id: 'PDR005',
    planNo: '26X92220',
    planName: '奥花大楼一楼改以206、208、1007会议室展厅大修',
    unit: '公司办',
    investAmount: 86,
    projectDesc: '奥花大楼一楼居以整以206、208、1007会议室大楼，在使用中去老设计展厅购置屏展项，颜色，克，闸，购等诸多问题，建议大修',
    planYear: 2026,
    archiveDate: '20260318',
    updateDate: '20260318',
    planStatus: '延期',
    approvalStatus: '审批中',
    projectType: '基础设施',
    projectMajorCategory: '大修',
    division: '公司办',
    planStartDate: '2026-07-01',
    planEndDate: '2026-12-31',
    projectSummary: '对奥花大楼多个会议室进行整体大修改造',
    allowedActions: ['delay', 'suspend', 'terminate'],
  },
  {
    id: 'PDR006',
    planNo: '26X92210',
    planName: '科技楼防雨台篷',
    unit: '公司办',
    investAmount: 30,
    projectDesc: '科技楼门公室部分入八客室的楼制一一并楼制制公室楼制一一部一楼制公室，一建是以地地楼制一一部公室楼制一二三地的地',
    planYear: 2026,
    archiveDate: '20260318',
    updateDate: '20260318',
    planStatus: '正常',
    approvalStatus: '无申请',
    projectType: '基础设施',
    projectMajorCategory: '零固',
    division: '科技部',
    planStartDate: '2026-04-01',
    planEndDate: '2026-09-30',
    projectSummary: '为科技楼入口增设防雨台篷',
    allowedActions: ['delay', 'suspend', 'terminate'],
  },
  {
    id: 'PDR007',
    planNo: '26X92190',
    planName: '港北4号行车大修',
    unit: '物流中心',
    investAmount: 54,
    projectDesc: '港北14号行车使用年限较长，已超出使用年限，出现故障频繁，电能系统故障等老化（使含承重电能载体等，整计过来），整修建议',
    planYear: 2026,
    archiveDate: '20260227',
    updateDate: '20260318',
    planStatus: '暂缓',
    approvalStatus: '无申请',
    projectType: '技术改造',
    projectMajorCategory: '技改',
    division: '物流中心',
    planStartDate: '2026-05-01',
    planEndDate: '2026-10-31',
    projectSummary: '对港北4号行车进行全面大修',
    allowedActions: ['delay', 'execute', 'terminate'],
  },
  {
    id: 'PDR008',
    planNo: '26X92180',
    planName: '港北3号行车大修',
    unit: '物流中心',
    investAmount: 45,
    projectDesc: '港北3号行车使用年限较长，起重设备老化严重，严重影响生产。目前库有设备老化严重，经常出断，距续维修不适合，再维修成本，全面大修',
    planYear: 2026,
    archiveDate: '20260304',
    updateDate: '20260318',
    planStatus: '正常',
    approvalStatus: '无申请',
    projectType: '技术改造',
    projectMajorCategory: '大修',
    division: '物流中心',
    planStartDate: '2026-06-01',
    planEndDate: '2026-11-30',
    projectSummary: '对港北3号行车进行全面大修',
    allowedActions: ['delay', 'suspend', 'terminate'],
  },
  {
    id: 'PDR009',
    planNo: '26X92170',
    planName: '长村车蓝升6号门大秀',
    unit: '物流中心',
    investAmount: 43,
    projectDesc: '长村车仓6号门多年频繁常规，电气设备安装全套老化，故障量大及维修难确保，规划整修，以供给建筑安全生产，防止出现安全事故',
    planYear: 2026,
    archiveDate: '20260304',
    updateDate: '20260318',
    planStatus: '延期',
    approvalStatus: '已通过',
    projectType: '技术改造',
    projectMajorCategory: '新建',
    division: '物流中心',
    planStartDate: '2026-04-01',
    planEndDate: '2026-08-31',
    projectSummary: '更新6号门电气设备，提升运行可靠性',
    allowedActions: ['delay', 'suspend', 'terminate'],
  },
  {
    id: 'PDR010',
    planNo: '26X92160',
    planName: '港业库库成大修',
    unit: '物流中心',
    investAmount: 85,
    projectDesc: '港业公司库库多年未常规维修、采用的大维年未常，环境恶化，已经出现建筑构件，很需整修，现场规划综合整，绿化更新，方案安全经济方案',
    planYear: 2026,
    archiveDate: '20260304',
    updateDate: '20260318',
    planStatus: '正常',
    approvalStatus: '无申请',
    projectType: '技术改造',
    projectMajorCategory: '大修',
    division: '物流中心',
    planStartDate: '2026-07-01',
    planEndDate: '2026-12-31',
    projectSummary: '对港业库库进行全面大修改造',
    allowedActions: ['delay', 'suspend', 'terminate'],
  },
  {
    id: 'PDR011',
    planNo: '25X88120',
    planName: '炼铁高炉自动化升级改造',
    unit: '炼铁部',
    investAmount: 120,
    projectDesc: '对3号高炉控制系统进行智能化升级，引入AI辅助决策模型，提升生产效率15%以上，降低能耗',
    planYear: 2025,
    archiveDate: '20250601',
    updateDate: '20260115',
    planStatus: '延期',
    approvalStatus: '审批中',
    projectType: '人工智能',
    projectMajorCategory: '技改',
    division: '炼铁部',
    planStartDate: '2025-08-01',
    planEndDate: '2026-07-31',
    projectSummary: '引入AI辅助系统提升高炉生产效率',
    allowedActions: ['delay', 'suspend', 'terminate'],
  },
  {
    id: 'PDR012',
    planNo: '25X87560',
    planName: '薄板轧机轧辊自动换辊系统',
    unit: '薄板部',
    investAmount: 98,
    projectDesc: '自动化换辊系统替代人工操作，提高安全性，减少换辊时间60%，提升设备利用率',
    planYear: 2025,
    archiveDate: '20250515',
    updateDate: '20251130',
    planStatus: '终止',
    approvalStatus: '已驳回',
    projectType: '自动化',
    projectMajorCategory: '零固',
    division: '薄板部',
    planStartDate: '2025-06-01',
    planEndDate: '2025-12-31',
    projectSummary: '自动化换辊系统建设',
    allowedActions: [],
  },
];

export const planOperationLogs = [
  {
    id: 'LOG001',
    planId: 'PDR001',
    appType: 'delay' as PlanApplicationType,
    applicant: '张明辉',
    applyReason: '因材料采购周期延长，需要延期至2026年底完工，原计划2026年10月完工已无法实现',
    applyTime: '2026-04-10 09:23:14',
    approvalStatus: '已通过' as PlanApprovalStatus,
    approvalFlowId: 'FLOW001',
  },
  {
    id: 'LOG002',
    planId: 'PDR003',
    appType: 'suspend' as PlanApplicationType,
    applicant: '李晓东',
    applyReason: '因预算尚未批复，暂缓项目实施，待资金到位后重新启动',
    applyTime: '2026-03-25 14:45:33',
    approvalStatus: '审批中' as PlanApprovalStatus,
    approvalFlowId: 'FLOW002',
  },
  {
    id: 'LOG003',
    planId: 'PDR005',
    appType: 'delay' as PlanApplicationType,
    applicant: '王建国',
    applyReason: '原方案施工范围扩大，涉及1006、1007两个会议室，投资额相应增加20万元',
    applyTime: '2026-04-15 10:12:56',
    approvalStatus: '审批中' as PlanApprovalStatus,
    approvalFlowId: 'FLOW003',
  },
];

export const planApprovalFlows = {
  FLOW001: {
    nodes: [
      { id: 'N1', name: '发起申请', role: '申请人', person: '张明辉', time: '2026-04-10 09:23', opinion: '因采购周期延长申请延期', status: 'passed' as const },
      { id: 'N2', name: '事业部领导审核', role: '事业部领导', person: '陈立群', time: '2026-04-11 10:30', opinion: '情况属实，同意延期申请', status: 'passed' as const },
      { id: 'N3', name: '专业部门审核', role: '信息化审核', person: '汝金同', time: '2026-04-12 14:00', opinion: '审核通过', status: 'passed' as const },
      { id: 'N4', name: '公司领导审批', role: '公司领导', person: '刘总', time: '2026-04-14 09:00', opinion: '批准', status: 'passed' as const },
    ],
    currentNode: 'N4',
  },
  FLOW002: {
    nodes: [
      { id: 'N1', name: '发起申请', role: '申请人', person: '李晓东', time: '2026-03-25 14:45', opinion: '预算未批复，申请暂缓', status: 'passed' as const },
      { id: 'N2', name: '事业部领导审核', role: '事业部领导', person: '周明', time: '2026-03-26 09:15', opinion: '同意暂缓', status: 'passed' as const },
      { id: 'N3', name: '专业部门审核', role: '信息化审核', person: '汝金同', time: '', opinion: '', status: 'current' as const },
      { id: 'N4', name: '公司领导审批', role: '公司领导', person: '刘总', time: '', opinion: '', status: 'pending' as const },
    ],
    currentNode: 'N3',
  },
  FLOW003: {
    nodes: [
      { id: 'N1', name: '发起申请', role: '申请人', person: '王建国', time: '2026-04-15 10:12', opinion: '施工范围扩大，申请延期调整', status: 'passed' as const },
      { id: 'N2', name: '事业部领导审核', role: '事业部领导', person: '陈立群', time: '2026-04-16 11:00', opinion: '核实后同意延期', status: 'passed' as const },
      { id: 'N3', name: '公司领导审批', role: '公司领导', person: '刘总', time: '', opinion: '', status: 'current' as const },
    ],
    currentNode: 'N3',
  },
};
