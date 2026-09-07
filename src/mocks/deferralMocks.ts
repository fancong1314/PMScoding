export type ProjectStatus = 'active' | 'suspended' | 'delayed' | 'cancelled' | 'terminated' | 'changing';
export type ApprovalStatus = 'none' | 'pending' | 'approving' | 'approved' | 'rejected';
export type ApplicationType = 'delay' | 'suspend' | 'cancel' | 'terminate' | 'change';

export interface DeferralProject {
  id: string;
  projectNo: string;
  planNo: string;
  projectName: string;
  companyAlias: string;
  isPreProject: boolean;
  preProjectAmount: number;
  preProjectDate: string;
  projectStatus: ProjectStatus;
  approvalStatus: ApprovalStatus;
  projectType: string;
  implementUnit: string;
  ownerUnit: string;
  projectManager: string;
  planStartDate: string;
  planEndDate: string;
  projectAmount: number;
  projectDesc: string;
  allowedOps: ApplicationType[];
}

export interface OperationLog {
  id: string;
  projectId: string;
  appType: ApplicationType;
  applicant: string;
  reason: string;
  applyTime: string;
  approvalStatus: ApprovalStatus;
  approvalFlowId: string;
}

export interface ApprovalNode {
  id: string;
  name: string;
  role: string;
  approver: string;
  status: 'waiting' | 'approving' | 'approved' | 'rejected' | 'skipped';
  approveTime?: string;
  opinion?: string;
  isCurrent?: boolean;
}

export const appTypeMap: Record<ApplicationType, { label: string; color: string }> = {
  delay:     { label: '延期申请', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  suspend:   { label: '暂缓申请', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  cancel:    { label: '取消申请', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  terminate: { label: '终止申请', color: 'bg-red-50 text-red-700 border-red-200' },
  change:    { label: '立项变更', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export const projectStatusMap: Record<ProjectStatus, { label: string; color: string }> = {
  active:     { label: '正常推进', color: 'bg-emerald-50 text-emerald-700' },
  suspended:  { label: '已暂缓',   color: 'bg-sky-50 text-sky-700' },
  delayed:    { label: '已延期',   color: 'bg-amber-50 text-amber-700' },
  cancelled:  { label: '已取消',   color: 'bg-slate-50 text-slate-600' },
  terminated: { label: '已终止',   color: 'bg-red-50 text-red-700' },
  changing:   { label: '变更申请中', color: 'bg-violet-50 text-violet-700' },
};

export const approvalStatusMap: Record<ApprovalStatus, { label: string; color: string }> = {
  none:      { label: '无申请',   color: 'text-steel-400' },
  pending:   { label: '待审批',   color: 'text-amber-600' },
  approving: { label: '审批中',   color: 'text-sky-600' },
  approved:  { label: '已通过',   color: 'text-emerald-600' },
  rejected:  { label: '已驳回',   color: 'text-red-600' },
};

export const projectTypes = ['信息化', '人工智能', '自动化', '安全环保', '设备升级', '基础设施', '节能减排', '其他'];
export const companyAliases = ['南钢股份', '南钢联合', '南京钢铁', '金鑫矿业', '南钢物流'];
export const ownerUnits = ['制造部', '信息中心', '安环部', '设备部', '工程部', '科技质量部'];
export const implementUnits = ['信息化中心', '设备技术部', '工程管理部', '安全环保部', '生产技术部', '质量检测部'];

export const deferralProjects: DeferralProject[] = [
  {
    id: 'p1', projectNo: 'LX2024001', planNo: '26J32500', projectName: '中普商业智能平台数字化整合提升项目',
    companyAlias: '南钢股份', isPreProject: false, preProjectAmount: 0, preProjectDate: '',
    projectStatus: 'active', approvalStatus: 'none', projectType: '信息化',
    implementUnit: '信息化中心', ownerUnit: '信息中心', projectManager: '李建国',
    planStartDate: '2024-03-01', planEndDate: '2024-12-31', projectAmount: 320,
    projectDesc: '对商业智能平台进行全面数字化整合提升，实现数据统一管理与分析。',
    allowedOps: ['delay', 'suspend', 'change'],
  },
  {
    id: 'p2', projectNo: 'LX2024002', planNo: '26J51100', projectName: '科技质量新实验室废水处理设施建设项目',
    companyAlias: '南钢股份', isPreProject: true, preProjectAmount: 50, preProjectDate: '2024-01-15',
    projectStatus: 'active', approvalStatus: 'pending', projectType: '安全环保',
    implementUnit: '安全环保部', ownerUnit: '安环部', projectManager: '张伟',
    planStartDate: '2024-02-01', planEndDate: '2025-06-30', projectAmount: 185,
    projectDesc: '新建实验室废水处理设施，确保废水达标排放，满足环保要求。',
    allowedOps: ['delay', 'suspend', 'cancel', 'terminate', 'change'],
  },
  {
    id: 'p3', projectNo: 'LX2024003', planNo: '26J40300', projectName: '第三炼钢厂30m行车组合升级改造',
    companyAlias: '南钢联合', isPreProject: false, preProjectAmount: 0, preProjectDate: '',
    projectStatus: 'delayed', approvalStatus: 'approved', projectType: '设备升级',
    implementUnit: '设备技术部', ownerUnit: '设备部', projectManager: '王志远',
    planStartDate: '2024-01-10', planEndDate: '2024-09-30', projectAmount: 560,
    projectDesc: '对第三炼钢厂30m行车进行组合升级改造，提升运行效率和安全性。',
    allowedOps: ['suspend', 'terminate', 'change'],
  },
  {
    id: 'p4', projectNo: 'LX2024004', planNo: '26J51200', projectName: '科技质量基础新型高效净化水系统',
    companyAlias: '南钢股份', isPreProject: true, preProjectAmount: 80, preProjectDate: '2024-02-20',
    projectStatus: 'suspended', approvalStatus: 'approved', projectType: '安全环保',
    implementUnit: '安全环保部', ownerUnit: '科技质量部', projectManager: '陈思远',
    planStartDate: '2024-04-01', planEndDate: '2025-03-31', projectAmount: 240,
    projectDesc: '建设新型高效净化水处理系统，提高水资源利用效率。',
    allowedOps: ['delay', 'cancel', 'change'],
  },
  {
    id: 'p5', projectNo: 'LX2024005', planNo: '26J32000', projectName: '工程管控一体化平台建设',
    companyAlias: '南钢股份', isPreProject: false, preProjectAmount: 0, preProjectDate: '',
    projectStatus: 'active', approvalStatus: 'approving', projectType: '人工智能',
    implementUnit: '信息化中心', ownerUnit: '工程部', projectManager: '朱科长',
    planStartDate: '2024-05-01', planEndDate: '2025-12-31', projectAmount: 890,
    projectDesc: '建设集工程计划、执行、监控于一体的智能化管控平台。',
    allowedOps: ['delay', 'suspend', 'change'],
  },
  {
    id: 'p6', projectNo: 'LX2024006', planNo: '26J31700', projectName: '南钢DHR微氧化冶金智能制造升级',
    companyAlias: '南钢联合', isPreProject: false, preProjectAmount: 0, preProjectDate: '',
    projectStatus: 'changing', approvalStatus: 'approving', projectType: '自动化',
    implementUnit: '生产技术部', ownerUnit: '制造部', projectManager: '赵明辉',
    planStartDate: '2024-03-15', planEndDate: '2025-09-30', projectAmount: 1240,
    projectDesc: '对DHR微氧化冶金工艺进行智能化升级改造，提升产品质量。',
    allowedOps: ['delay', 'suspend'],
  },
  {
    id: 'p7', projectNo: 'LX2024007', planNo: '26J50900', projectName: '公司十号线区域废液回收整治项目',
    companyAlias: '南钢股份', isPreProject: false, preProjectAmount: 0, preProjectDate: '',
    projectStatus: 'active', approvalStatus: 'none', projectType: '安全环保',
    implementUnit: '安全环保部', ownerUnit: '安环部', projectManager: '刘洋',
    planStartDate: '2024-06-01', planEndDate: '2024-11-30', projectAmount: 128,
    projectDesc: '对十号线区域废液回收系统进行整治，消除环保隐患。',
    allowedOps: ['delay', 'suspend', 'cancel', 'terminate', 'change'],
  },
  {
    id: 'p8', projectNo: 'LX2024008', planNo: '26J30400', projectName: '特殊智能运矿系统升级改造',
    companyAlias: '金鑫矿业', isPreProject: true, preProjectAmount: 30, preProjectDate: '2024-03-01',
    projectStatus: 'active', approvalStatus: 'rejected', projectType: '自动化',
    implementUnit: '工程管理部', ownerUnit: '设备部', projectManager: '孙宇',
    planStartDate: '2024-07-01', planEndDate: '2025-06-30', projectAmount: 420,
    projectDesc: '对矿山智能运输系统进行升级改造，提高运输效率和安全性。',
    allowedOps: ['delay', 'suspend', 'cancel', 'terminate', 'change'],
  },
  {
    id: 'p9', projectNo: 'LX2024009', planNo: '26J30300', projectName: '钢铁业务园区QMS系统建设',
    companyAlias: '南钢股份', isPreProject: false, preProjectAmount: 0, preProjectDate: '',
    projectStatus: 'active', approvalStatus: 'none', projectType: '信息化',
    implementUnit: '信息化中心', ownerUnit: '质量检测部', projectManager: '周鑫',
    planStartDate: '2024-08-01', planEndDate: '2025-07-31', projectAmount: 380,
    projectDesc: '建设覆盖园区全流程的质量管理系统，实现质量数据实时采集与分析。',
    allowedOps: ['delay', 'suspend', 'change'],
  },
  {
    id: 'p10', projectNo: 'LX2024010', planNo: '26J11100', projectName: '科技质量部门上线检测研究器采购项目',
    companyAlias: '南钢股份', isPreProject: false, preProjectAmount: 0, preProjectDate: '',
    projectStatus: 'terminated', approvalStatus: 'approved', projectType: '其他',
    implementUnit: '质量检测部', ownerUnit: '科技质量部', projectManager: '吴刚',
    planStartDate: '2024-01-20', planEndDate: '2024-08-31', projectAmount: 95,
    projectDesc: '采购先进检测研究设备，提升科技质量部门的检测能力和效率。',
    allowedOps: [],
  },
  {
    id: 'p11', projectNo: 'LX2024011', planNo: '26J40800', projectName: '烧矿数控矿炉服务设备采购',
    companyAlias: '南钢联合', isPreProject: false, preProjectAmount: 0, preProjectDate: '',
    projectStatus: 'active', approvalStatus: 'none', projectType: '设备升级',
    implementUnit: '设备技术部', ownerUnit: '设备部', projectManager: '郑浩',
    planStartDate: '2024-09-01', planEndDate: '2025-08-31', projectAmount: 680,
    projectDesc: '采购新型数控矿炉服务设备，提升矿炉生产效率和控制精度。',
    allowedOps: ['delay', 'suspend', 'cancel', 'terminate', 'change'],
  },
  {
    id: 'p12', projectNo: 'LX2024012', planNo: '26J20900', projectName: '金矿矿业410米以下系统炼金工程升级',
    companyAlias: '金鑫矿业', isPreProject: true, preProjectAmount: 120, preProjectDate: '2024-04-10',
    projectStatus: 'active', approvalStatus: 'pending', projectType: '节能减排',
    implementUnit: '工程管理部', ownerUnit: '制造部', projectManager: '张伟',
    planStartDate: '2024-10-01', planEndDate: '2026-03-31', projectAmount: 1580,
    projectDesc: '对410米以下矿层的炼金系统进行全面升级改造，提升产能和节能效果。',
    allowedOps: ['delay', 'suspend', 'change'],
  },
];

export const operationLogs: OperationLog[] = [
  {
    id: 'log1', projectId: 'p2', appType: 'delay', applicant: '张伟',
    reason: '受春节假期影响，施工队伍复工时间推迟，导致项目整体工期顺延约2个月。相关设备交付也受到影响，预计新的完工时间为2025年8月底。',
    applyTime: '2024-03-15 09:30:00', approvalStatus: 'approved', approvalFlowId: 'flow1',
  },
  {
    id: 'log2', projectId: 'p2', appType: 'suspend', applicant: '张伟',
    reason: '受原材料供应紧张影响，建议暂缓3个月，待市场价格回落后继续推进。',
    applyTime: '2024-06-20 14:15:00', approvalStatus: 'rejected', approvalFlowId: 'flow2',
  },
  {
    id: 'log3', projectId: 'p2', appType: 'change', applicant: '陈思远',
    reason: '项目实施过程中发现原设计方案存在不足，需要对部分技术路线进行调整，同时预算需相应增加85万元。',
    applyTime: '2024-09-05 10:00:00', approvalStatus: 'approving', approvalFlowId: 'flow3',
  },
  {
    id: 'log4', projectId: 'p3', appType: 'delay', applicant: '王志远',
    reason: '采购的核心零部件到货时间推迟，导致安装调试工期顺延，新计划完工日期为2025年2月28日。',
    applyTime: '2024-08-10 11:00:00', approvalStatus: 'approved', approvalFlowId: 'flow4',
  },
  {
    id: 'log5', projectId: 'p5', appType: 'change', applicant: '朱科长',
    reason: '业务需求范围扩大，新增了移动端功能模块开发，预计增加投资额约150万元，工期相应延长6个月。',
    applyTime: '2024-11-01 09:00:00', approvalStatus: 'approving', approvalFlowId: 'flow5',
  },
];

export const approvalFlows: Record<string, ApprovalNode[]> = {
  flow1: [
    { id: 'n1', name: '发起申请', role: '项目负责人', approver: '张伟', status: 'approved', approveTime: '2024-03-15 09:30:00', opinion: '提交延期申请' },
    { id: 'n2', name: '部门领导审核', role: '事业部领导', approver: '李事业部长', status: 'approved', approveTime: '2024-03-16 14:20:00', opinion: '情况属实，同意延期申请。' },
    { id: 'n3', name: '专业部门审核', role: '安全环保部', approver: '赵航', status: 'approved', approveTime: '2024-03-17 10:30:00', opinion: '已审核，环保方面无问题，同意延期。' },
    { id: 'n4', name: '公司领导审批', role: '公司副总', approver: '王副总', status: 'approved', approveTime: '2024-03-18 16:00:00', opinion: '同意。' },
  ],
  flow2: [
    { id: 'n1', name: '发起申请', role: '项目负责人', approver: '张伟', status: 'approved', approveTime: '2024-06-20 14:15:00', opinion: '提交暂缓申请' },
    { id: 'n2', name: '部门领导审核', role: '事业部领导', approver: '李事业部长', status: 'approved', approveTime: '2024-06-21 09:00:00', opinion: '了解情况，报公司审批。' },
    { id: 'n3', name: '专业部门审核', role: '安全环保部', approver: '赵航', status: 'rejected', approveTime: '2024-06-22 11:20:00', opinion: '该项目涉及重要环保设施建设，不建议暂缓，请继续推进。' },
    { id: 'n4', name: '公司领导审批', role: '公司副总', approver: '王副总', status: 'waiting' },
  ],
  flow3: [
    { id: 'n1', name: '发起申请', role: '项目负责人', approver: '陈思远', status: 'approved', approveTime: '2024-09-05 10:00:00', opinion: '提交立项变更申请' },
    { id: 'n2', name: '部门领导审核', role: '事业部领导', approver: '孙事业部长', status: 'approved', approveTime: '2024-09-06 08:30:00', opinion: '变更内容合理，同意上报。' },
    { id: 'n3', name: '专业部门审核', role: '安全环保部', approver: '赵航', status: 'approving', isCurrent: true },
    { id: 'n4', name: '公司领导审批', role: '公司副总', approver: '王副总', status: 'waiting' },
  ],
  flow4: [
    { id: 'n1', name: '发起申请', role: '项目负责人', approver: '王志远', status: 'approved', approveTime: '2024-08-10 11:00:00', opinion: '提交延期申请' },
    { id: 'n2', name: '部门领导审核', role: '事业部领导', approver: '张事业部长', status: 'approved', approveTime: '2024-08-11 14:00:00', opinion: '同意延期，请尽快推进后续工作。' },
    { id: 'n3', name: '专业部门审核', role: '设备技术部', approver: '程鑫祥', status: 'approved', approveTime: '2024-08-12 09:30:00', opinion: '核实设备到货情况，同意延期。' },
    { id: 'n4', name: '公司领导审批', role: '公司总经理', approver: '刘总', status: 'approved', approveTime: '2024-08-13 16:30:00', opinion: '批准。' },
  ],
  flow5: [
    { id: 'n1', name: '发起申请', role: '项目负责人', approver: '朱科长', status: 'approved', approveTime: '2024-11-01 09:00:00', opinion: '提交立项变更申请' },
    { id: 'n2', name: '部门领导审核', role: '事业部领导', approver: '周事业部长', status: 'approving', isCurrent: true },
    { id: 'n3', name: '专业部门审核', role: '信息化中心', approver: '汝金同', status: 'waiting' },
    { id: 'n4', name: '公司领导审批', role: '公司副总', approver: '王副总', status: 'waiting' },
  ],
};
