import { estimateProjects } from './estimateManagementMocks';

export interface ProjectForRequirement {
  id: string;
  approvalNo: string;
  planNo: string;
  name: string;
  description: string;
  projectType: string;
  budgetAmount: number;
  preBudgetAmount: number;
  actualBudgetAmount: number;
  originalContractAmount: number;
  revisedContractAmount: number;
  completedAmount: number;
  settledAmount: number;
  accountedAmount: number;
  fixedAmount: number;
  approvalDate: string;
  ownerUnit: string;
  implementUnit: string;
  projectManager: string;
  isEnvAssessment: boolean;
}

export interface DemandDetail {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  durationDays: number;
  contractMethod: string;
  estimatedAmount: number;
  remark: string;
  usageUnit: string;
  selected: boolean;
}

export interface OccupationDetail {
  estimateId: string;
  estimateName: string;
  estimateAmount: number;
  occupiedAmount: number;
  remainingAmount: number;
  materialOccupiedAmount: number;
  demandOccupiedAmount: number;
  isLastDemand: boolean;
  level: number;
  parentId: string | null;
}

export interface EngineeringDemand {
  id: string;
  projectId: string;
  demandNo: string;
  demandName: string;
  approvalNo: string;
  department: string;
  demandType: string;
  demandTypeLevel2?: string;
  purchaseCategory: string;
  demandDept: string;
  purchaseMethod: string;
  hasMaterial: boolean;
  demandAmount: number;
  planAmount: number;
  materialAmount: number;
  demandReason: string;
  handler: string;
  isMainContract: boolean;
  status: '新建' | '审批中' | '已通过' | '已驳回' | '已撤回' | '已撤销';
  createTime: string;
  creator: string;
  details: DemandDetail[];
  occupationDetails: OccupationDetail[];
  approvalFlow?: ApprovalFlowConfig;
  approvalRecords?: ApprovalRecord[];
  internalAttachments: string[];
  externalAttachments: string[];
}

export interface ApprovalFlowNode {
  id: string;
  nodeNo: number;
  nodeName: string;
  approverType: '指定人员' | '指定角色' | '部门负责人' | '部门领导';
  approver?: string;
  approverRole?: string;
  approvalMethod: '单人审批' | '会签审批';
  countersignRule?: '全部通过' | '一人通过即可';
  hasCondition: boolean;
  conditionField?: string;
  conditionOperator?: string;
  conditionValue?: string;
}

export interface ApprovalFlowConfig {
  flowName: string;
  nodes: ApprovalFlowNode[];
}

export interface ApprovalRecord {
  id: string;
  nodeName: string;
  approver: string;
  action: '发起流程' | '查看' | '核准' | '驳回' | '转办' | '撤销';
  opinion: string;
  time: string;
  status: '已通过' | '已驳回' | '待审批' | '已撤销';
}

export const demandTypes = ['工程设备', '信息化', '工程建设', '技术服务', '环境提升'];
export const demandTypeLevel2Map: Record<string, string[]> = {
  '工程建设': ['A建筑', 'B安装', 'E总承包(EPC)', 'F勘察', 'L设计', 'LEP', 'X技术集成', 'Y绿化'],
};
export const purchaseCategories = ['设备采购', '材料采购', '工程服务', '技术服务', '设计服务', '监理服务', '咨询评估', '其他'];
export const demandDepts = ['工程管理部', '设备管理部', '安全环保部', '基建部', '技术中心', '能源环保部', '信息化部', '采购部'];
export const purchaseMethods = ['公开招标', '邀请招标', '竞争性谈判', '竞争性磋商', '询价', '单一来源', '保供大宗长协'];
export const contractMethods = ['总包', '分包', '单项承包', '联合体承包', 'EPC总承包', '设计施工总承包'];
export const units = ['吨', '立方米', '米', '平方米', '台', '套', '个', '项', '公里', '公斤'];
export const usageUnits = ['炼铁事业部', '炼钢事业部', '轧钢事业部', '能源环保部', '设备部', '安全能环部', '技术中心', '基建部'];
export const handlers = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟', '孙伟', '周洋'];

function generateDemandDetails(): DemandDetail[] {
  const descs = [
    '高炉本体耐材砌筑', '热风炉设备基础施工', '煤气净化系统管道安装', '转炉设备基础及钢结构', '轧机主传动装置安装',
    '自动化控制系统编程调试', '原料场智能化设备采购', '环保除尘设施土建施工', '余热发电锅炉安装',
    '污水处理厂设备采购及安装',
  ];
  const units = ['吨', '立方米', '套', '米', '台', '项', '平方米'];
  const contractMethods = ['总包', '分包', '单项承包', 'EPC总承包'];
  const usageUnits = ['炼铁事业部', '炼钢事业部', '轧钢事业部', '能源环保部'];
  const details: DemandDetail[] = [];
  for (let i = 0; i < 4; i++) {
    details.push({
      id: `detail-${i + 1}`,
      description: descs[i % descs.length],
      quantity: Math.floor(Math.random() * 1000) + 10,
      unit: units[i % units.length],
      durationDays: Math.floor(Math.random() * 180) + 30,
      contractMethod: contractMethods[i % contractMethods.length],
      estimatedAmount: Math.floor(Math.random() * 500000) + 50000,
      remark: i % 2 === 0 ? '需考虑施工季节性因素' : '',
      usageUnit: usageUnits[i % usageUnits.length],
      selected: false,
    });
  }
  return details;
}

export function generateOccupationDetails(): OccupationDetail[] {
  const items: OccupationDetail[] = [
    { estimateId: 'est1-1', estimateName: '工程费用', estimateAmount: 2436000, occupiedAmount: 2100000, remainingAmount: 336000, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 1, parentId: null },
    { estimateId: 'est1-1-1', estimateName: '制氧厂配套管线', estimateAmount: 2436000, occupiedAmount: 2100000, remainingAmount: 336000, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 2, parentId: 'est1-1' },
    { estimateId: 'est1-1-2', estimateName: '建筑工程费', estimateAmount: 1020000, occupiedAmount: 950000, remainingAmount: 70000, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 2, parentId: 'est1-1' },
    { estimateId: 'est1-1-2-1', estimateName: '土建及基础费用', estimateAmount: 1020000, occupiedAmount: 950000, remainingAmount: 70000, materialOccupiedAmount: 0, demandOccupiedAmount: 50000, isLastDemand: false, level: 3, parentId: 'est1-1-2' },
    { estimateId: 'est1-1-3', estimateName: '安装工程费', estimateAmount: 595000, occupiedAmount: 480000, remainingAmount: 115000, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 2, parentId: 'est1-1' },
    { estimateId: 'est1-1-3-1', estimateName: '施工安装费', estimateAmount: 595000, occupiedAmount: 480000, remainingAmount: 115000, materialOccupiedAmount: 0, demandOccupiedAmount: 80000, isLastDemand: false, level: 3, parentId: 'est1-1-3' },
    { estimateId: 'est1-1-4', estimateName: '设备工器具购置费', estimateAmount: 821000, occupiedAmount: 670000, remainingAmount: 151000, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 2, parentId: 'est1-1' },
    { estimateId: 'est1-1-4-1', estimateName: '材料费用', estimateAmount: 591000, occupiedAmount: 470000, remainingAmount: 121000, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 3, parentId: 'est1-1-4' },
    { estimateId: 'est1-1-4-2', estimateName: '备件费用', estimateAmount: 230000, occupiedAmount: 200000, remainingAmount: 30000, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 3, parentId: 'est1-1-4' },
    { estimateId: 'est1-2', estimateName: '工程建设其他费', estimateAmount: 164000, occupiedAmount: 200000, remainingAmount: 79000, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 1, parentId: null },
    { estimateId: 'est1-2-1', estimateName: '设计费', estimateAmount: 115000, occupiedAmount: 150000, remainingAmount: 44000, materialOccupiedAmount: 0, demandOccupiedAmount: 30000, isLastDemand: false, level: 2, parentId: 'est1-2' },
    { estimateId: 'est1-2-2', estimateName: '监理费', estimateAmount: 49000, occupiedAmount: 50000, remainingAmount: 35000, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 2, parentId: 'est1-2' },
    { estimateId: 'est1-3', estimateName: '预备费', estimateAmount: 0, occupiedAmount: 0, remainingAmount: 0, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 1, parentId: null },
    { estimateId: 'est1-4', estimateName: '结余费', estimateAmount: 0, occupiedAmount: 0, remainingAmount: 0, materialOccupiedAmount: 0, demandOccupiedAmount: 0, isLastDemand: false, level: 1, parentId: null },
  ];
  return items;
}

function generateApprovalFlow(): ApprovalFlowConfig {
  return {
    flowName: '工程需求审批-REQ-001-20260601',
    nodes: [
      {
        id: 'node-1',
        nodeNo: 1,
        nodeName: '部门负责人审批',
        approverType: '指定人员',
        approver: '李建国',
        approvalMethod: '单人审批',
        hasCondition: false,
      },
      {
        id: 'node-2',
        nodeNo: 2,
        nodeName: '分管领导审批',
        approverType: '指定人员',
        approver: '王志强',
        approvalMethod: '单人审批',
        hasCondition: false,
      },
      {
        id: 'node-3',
        nodeNo: 3,
        nodeName: '工程管理部审批',
        approverType: '指定角色',
        approverRole: '工程管理员',
        approvalMethod: '会签审批',
        countersignRule: '全部通过',
        hasCondition: false,
      },
    ],
  };
}

function generateApprovalRecords(): ApprovalRecord[] {
  return [
    { id: 'rec-1', nodeName: '发起人', approver: '张明远', action: '发起流程', opinion: '提交工程需求审批', time: '2026-05-15 10:00:00', status: '已通过' },
    { id: 'rec-2', nodeName: '部门负责人审批', approver: '李建国', action: '核准', opinion: '需求合理，同意审批', time: '2026-05-15 14:00:00', status: '已通过' },
    { id: 'rec-3', nodeName: '分管领导审批', approver: '王志强', action: '核准', opinion: '金额在预算范围内，同意', time: '2026-05-16 09:00:00', status: '已通过' },
    { id: 'rec-4', nodeName: '工程管理部审批', approver: '赵卫东', action: '核准', opinion: '符合工程规范要求', time: '2026-05-16 16:00:00', status: '已通过' },
  ];
}

function generateApprovalRecordsRejected(): ApprovalRecord[] {
  return [
    { id: 'rec-1', nodeName: '发起人', approver: '张明远', action: '发起流程', opinion: '提交工程需求审批', time: '2026-05-20 10:00:00', status: '已通过' },
    { id: 'rec-2', nodeName: '部门负责人审批', approver: '李建国', action: '驳回', opinion: '需求金额超出预算范围，请重新调整', time: '2026-05-20 14:00:00', status: '已驳回' },
  ];
}

function generateApprovalRecordsPending(): ApprovalRecord[] {
  return [
    { id: 'rec-1', nodeName: '发起人', approver: '张明远', action: '发起流程', opinion: '提交工程需求审批', time: '2026-05-25 10:00:00', status: '已通过' },
    { id: 'rec-2', nodeName: '部门负责人审批', approver: '李建国', action: '核准', opinion: '需求合理', time: '2026-05-25 14:00:00', status: '已通过' },
    { id: 'rec-3', nodeName: '分管领导审批', approver: '王志强', action: '查看', opinion: '', time: '', status: '待审批' },
  ];
}

const statusPool: Array<'新建' | '审批中' | '已通过' | '已驳回' | '已撤回' | '已撤销'> = ['新建', '审批中', '已通过', '已驳回', '已撤回', '新建', '已通过', '新建', '审批中', '已通过', '新建', '已驳回', '已通过', '新建', '审批中'];

const demandNames = [
  '高炉本体耐材砌筑施工', '转炉设备基础及钢结构', '轧机主传动装置安装', '自动化控制系统编程调试', '原料场智能化设备采购',
  '环保除尘设施土建施工', '余热发电锅炉安装', '污水处理厂设备采购及安装', '配电室高低压设备更新', '办公楼信息化基础设施建设',
  '厂区道路硬化及管网改造', '安全防护设施完善升级', '仓储物流中心建设工程', '环保监测站房建设', '消防系统升级改造',
];

export const requirementProjects: ProjectForRequirement[] = estimateProjects.map((p) => ({
  id: p.id,
  approvalNo: p.approvalNo,
  planNo: p.planNo,
  name: p.name,
  description: p.description,
  projectType: p.projectType,
  budgetAmount: p.budgetAmount,
  preBudgetAmount: p.preBudgetAmount,
  actualBudgetAmount: p.actualBudgetAmount,
  originalContractAmount: p.originalContractAmount,
  revisedContractAmount: p.revisedContractAmount,
  completedAmount: p.completedAmount,
  settledAmount: p.settledAmount,
  accountedAmount: p.accountedAmount,
  fixedAmount: p.fixedAmount,
  approvalDate: p.approvalDate,
  ownerUnit: p.ownerUnit,
  implementUnit: p.implementUnit,
  projectManager: p.projectManager,
  isEnvAssessment: p.isEnvAssessment,
}));

export const engineeringDemands: EngineeringDemand[] = Array.from({ length: 15 }, (_, i) => {
  const status = statusPool[i % statusPool.length];
  const project = requirementProjects[i % requirementProjects.length];
  const demandType = demandTypes[i % demandTypes.length];
  const hasLevel2 = demandType === '工程建设';
  const planAmount = Math.floor(Math.random() * 500000) + 50000;
  const hasMaterial = i % 3 === 0;
  const materialAmount = hasMaterial ? Math.floor(planAmount * 0.3) : 0;
  const demandAmount = planAmount + materialAmount;
  let approvalFlow: ApprovalFlowConfig | undefined;
  let approvalRecords: ApprovalRecord[] | undefined;
  if (status !== '新建' && status !== '已撤回') {
    approvalFlow = generateApprovalFlow();
    if (status === '已通过') {
      approvalRecords = generateApprovalRecords();
    } else if (status === '已驳回') {
      approvalRecords = generateApprovalRecordsRejected();
    } else if (status === '审批中') {
      approvalRecords = generateApprovalRecordsPending();
    }
  }
  return {
    id: `demand-${String(i + 1).padStart(3, '0')}`,
    projectId: project.id,
    demandNo: `REQ-2026-${String(i + 1).padStart(3, '0')}`,
    demandName: demandNames[i % demandNames.length],
    approvalNo: project.approvalNo,
    department: project.ownerUnit,
    demandType,
    demandTypeLevel2: hasLevel2 ? demandTypeLevel2Map['工程建设'][i % demandTypeLevel2Map['工程建设'].length] : undefined,
    purchaseCategory: purchaseCategories[i % purchaseCategories.length],
    demandDept: demandDepts[i % demandDepts.length],
    purchaseMethod: purchaseMethods[i % purchaseMethods.length],
    hasMaterial,
    demandAmount,
    planAmount,
    materialAmount,
    demandReason: `因${project.name}需要，${['施工进度要求', '设备更新需求', '环保标准升级', '技术改造需要'][i % 4]}，需采购${demandNames[i % demandNames.length]}，预计工期${Math.floor(Math.random() * 6) + 3}个月。`,
    handler: handlers[i % handlers.length],
    isMainContract: i % 5 === 0,
    status,
    createTime: `2026-${String(1 + (i % 5)).padStart(2, '0')}-${String(10 + (i % 20)).padStart(2, '0')} 09:00:00`,
    creator: handlers[i % handlers.length],
    details: generateDemandDetails(),
    occupationDetails: generateOccupationDetails(),
    approvalFlow,
    approvalRecords,
    internalAttachments: ['需求申请表.pdf', '技术规格书.pdf'],
    externalAttachments: ['招标公告.pdf'],
  };
});

export function getProjectDemands(projectId: string): EngineeringDemand[] {
  return engineeringDemands.filter((d) => d.projectId === projectId);
}

export function getDemandById(demandId: string): EngineeringDemand | undefined {
  return engineeringDemands.find((d) => d.id === demandId);
}

export function getRequirementProjectById(projectId: string): ProjectForRequirement | undefined {
  return requirementProjects.find((p) => p.id === projectId);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ==================== 合同商务标书审核数据 ====================

export type BidReviewStatus = '待审核' | '审核中' | '已通过' | '已退回';

export interface BidReviewDemand extends EngineeringDemand {
  bidReviewStatus: BidReviewStatus;
  currentHandler: string;
  strategicDirector: string;
  bidReviewHandler: string;
  reviewOpinion: string;
  returnRecord: string;
  bidInternalAttachments: string[];
  bidExternalAttachments: string[];
  createUser: string;
  createTime: string;
  modifyUser: string;
  modifyTime: string;
}

export const bidReviewStatusPool: BidReviewStatus[] = [
  '待审核', '审核中', '已通过', '已退回', '待审核', '已通过', '审核中', '待审核', '已通过', '已退回', '审核中', '已通过',
];

// ==================== 主管单位承办数据 ====================

export type UndertakeStatus = '已提交承办' | '承办中' | '已退回' | '已呈核审批' | '商务标书审批中' | '商务标书已通过' | '已推送招采' | '已撤回招采' | '已重新发起';

export interface UndertakeDemand extends EngineeringDemand {
  undertakeStatus: UndertakeStatus;
  currentHandler: string;
  hasBusinessBid: boolean;
  // 承办信息
  reviewAmount: number;
  splitSection: boolean;
  // 招标信息
  projectCategory: string;
  purchaseMode: string;
  purchasePlan: string;
  weightRatio: number;
  qualificationLevel: string;
  bidOpenDate: string;
  projectVariety: string;
  isSmartBid: boolean;
  bidMethod: string;
  supplierLevelReq: string;
  supplierOnSite: boolean;
  // 承办信息
  undertakeInfo: string;
  returnOpinion: string;
  // 附加信息
  handlerChangeRecord: string;
  returnRecord: string;
  // 委托信息
  entrustNo: string;
  mergeEntrustNo: string;
  // 系统信息
  createUser: string;
  createTime: string;
  modifyUser: string;
  modifyTime: string;
}

export const projectCategories = ['GA总包', 'GB总承包', 'GC施工', 'GD设计', 'GE监理', 'GF咨询', 'GG检测'];
export const purchaseModes = ['集中采购', '分散采购'];
export const purchasePlans = ['年度计划', '临时计划'];
export const qualificationLevels = ['特级', '一级', '二级', '三级', '不分等级'];
export const projectVarieties = ['C工程设计', 'D施工', 'E监理', 'F咨询', 'G检测', 'H总承包', 'I设备'];
export const bidMethods = ['A一般邀请', 'B有限公开', 'Q完全公开'];
export const supplierLevels = ['A', 'B', 'C'];

export const undertakeStatusPool: UndertakeStatus[] = [
  '已提交承办', '承办中', '已退回', '已呈核审批', '商务标书审批中',
  '商务标书已通过', '已推送招采', '已撤回招采', '已重新发起',
  '已提交承办', '已呈核审批', '已推送招采', '商务标书审批中', '已重新发起', '承办中',
];

export const undertakeDemands: UndertakeDemand[] = Array.from({ length: 15 }, (_, i) => {
  const baseDemand = engineeringDemands[i];
  const status = undertakeStatusPool[i % undertakeStatusPool.length];
  const hasBid = status === '商务标书审批中' || status === '商务标书已通过' || status === '已推送招采' || status === '已撤回招采' || status === '已重新发起';
  const handler = handlers[i % handlers.length];
  return {
    ...baseDemand,
    undertakeStatus: status,
    currentHandler: handler,
    hasBusinessBid: hasBid,
    reviewAmount: baseDemand.demandAmount,
    splitSection: i % 4 === 0,
    projectCategory: projectCategories[i % projectCategories.length],
    purchaseMode: purchaseModes[i % purchaseModes.length],
    purchasePlan: purchasePlans[i % purchasePlans.length],
    weightRatio: Math.floor(Math.random() * 100) + 1,
    qualificationLevel: qualificationLevels[i % qualificationLevels.length],
    bidOpenDate: `2026-${String(7 + (i % 5)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
    projectVariety: projectVarieties[i % projectVarieties.length],
    isSmartBid: i % 3 === 0,
    bidMethod: bidMethods[i % bidMethods.length],
    supplierLevelReq: supplierLevels[i % supplierLevels.length],
    supplierOnSite: i % 2 === 0,
    undertakeInfo: `根据${baseDemand.demandName}需求，经初步审核，需求金额合理，建议按${purchaseModes[i % purchaseModes.length]}模式推进招标工作。`,
    returnOpinion: i % 7 === 0 ? '需补充完善技术规格参数' : '',
    handlerChangeRecord: i % 5 === 0 ? `2026-05-20 10:00:00 由 ${handlers[(i + 1) % handlers.length]} 变更为 ${handler}` : '',
    returnRecord: i % 7 === 0 ? `2026-05-22 14:00:00 退回至申报人，原因：${'需补充完善技术规格参数'}` : '',
    entrustNo: status === '已推送招采' || status === '已撤回招采' || status === '已重新发起' ? `ENT-2026-${String(i + 1).padStart(3, '0')}` : '',
    mergeEntrustNo: '',
    createUser: baseDemand.creator,
    createTime: baseDemand.createTime,
    modifyUser: handler,
    modifyTime: `2026-${String(5 + (i % 2)).padStart(2, '0')}-${String(10 + (i % 20)).padStart(2, '0')} 14:00:00`,
  };
});

export function getUndertakeProjectDemands(projectId: string): UndertakeDemand[] {
  return undertakeDemands.filter((d) => d.projectId === projectId);
}

export function getUndertakeDemandById(demandId: string): UndertakeDemand | undefined {
  return undertakeDemands.find((d) => d.id === demandId);
}

export const bidReviewDemands: BidReviewDemand[] = Array.from({ length: 12 }, (_, i) => {
  const baseDemand = engineeringDemands[i % engineeringDemands.length];
  const status = bidReviewStatusPool[i % bidReviewStatusPool.length];
  return {
    ...baseDemand,
    bidReviewStatus: status,
    currentHandler: handlers[i % handlers.length],
    strategicDirector: ['刘建国', '马文涛', '孙立军'][i % 3],
    bidReviewHandler: handlers[(i + 2) % handlers.length],
    reviewOpinion: status === '已退回' ? '商务标书技术参数不符合要求，请补充完善' : `经审核，${baseDemand.demandName}商务标书内容完整，技术参数符合要求，建议通过审批。`,
    returnRecord: status === '已退回' ? '2026-05-25 14:00:00 退回至申报人，原因：商务标书技术参数不符合要求' : '',
    bidInternalAttachments: ['商务标书_技术部分.pdf', '商务标书_商务部分.pdf'],
    bidExternalAttachments: ['商务标书_对外版本.pdf'],
    createUser: baseDemand.creator,
    createTime: baseDemand.createTime,
    modifyUser: handlers[(i + 1) % handlers.length],
    modifyTime: `2026-${String(5 + (i % 2)).padStart(2, '0')}-${String(10 + (i % 20)).padStart(2, '0')} 14:00:00`,
  };
});

export function getBidReviewProjectDemands(projectId: string): BidReviewDemand[] {
  return bidReviewDemands.filter((d) => d.projectId === projectId);
}

export function getBidReviewDemandById(demandId: string): BidReviewDemand | undefined {
  return bidReviewDemands.find((d) => d.id === demandId);
}