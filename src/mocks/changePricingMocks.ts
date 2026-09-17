export interface ChangePricingProject {
  id: string;
  approvalNo: string;
  planNo: string;
  projectName: string;
  approvalDesc: string;
  projectType: string;
  approvalAmount: number;
  preApprovalAmount: number;
  actualApprovalAmount: number;
  originalContractAmount: number;
  revisedContractAmount: number;
  completedAmount: number;
  settledAmount: number;
  bookedAmount: number;
  fixedAssetAmount: number;
  approvalDate: string;
  ownerUnit: string;
  implementUnit: string;
  projectManager: string;
  hasEnvAssessment: string;
}

export interface EngineeringDemand {
  id: string;
  projectId: string;
  demandNo: string;
  demandName: string;
  demandType: string;
  procurementMethod: string;
  recommendedSupplier: string;
  demandAmount: number;
  businessUnit: string;
  demandDept: string;
  status: string;
  currentHandler: string;
  approvalNo: string;
  firstCategory: string;
  secondCategory: string;
  procurementCatalog: string;
  hasOwnerSupply: string;
  planAmount: number;
  ownerSupplyAmount: number;
  demandReason: string;
  internalFiles: string[];
  externalFiles: string[];
  isMainContract: string;
  detailItems: EngineeringDemandDetail[];
  submitInfo?: SubmitInfo;
  createTime: string;
  modifyTime: string;
}

export interface EngineeringDemandDetail {
  id: string;
  description: string;
  bidQuantity: number;
  unit: string;
  duration: string;
  contractMethod: string;
  estimatedAmount: number;
  remark: string;
  userUnit: string;
}

export interface SubmitInfo {
  reviewAmount: number;
  splitBid: string;
  engineeringCategory: string;
  procurementMode: string;
  procurementPlan: string;
  weightRatio: number;
  qualificationLevel: string;
  bidOpenDate: string;
  engineeringVariety: string;
  smartBidding: string;
  biddingMethod: string;
  supplierLevel: string;
  supplierOnSite: string;
  demandInfo: string;
  returnReason: string;
  handlerChangeLog: string;
  returnLog: string;
  delegationNo: string;
  mergedDelegationNo: string;
  internalFiles: string[];
  externalFiles: string[];
  creator: string;
  createTime: string;
  modifier: string;
  modifyTime: string;
}

export interface ChangePricingApprovalRecord {
  id: string;
  demandId: string;
  seq: number;
  stage: string;
  operator: string;
  action: string;
  operateTime: string;
  opinion: string;
}

export function formatCurrency(val: number): string {
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const changePricingProjects: ChangePricingProject[] = [
  { id: 'cp-001', approvalNo: 'LX-2024-001', planNo: 'JH-2024-001', projectName: '炼铁厂烧结机超低排放改造项目', approvalDesc: '2#烧结机本体大修及超低排放改造', projectType: '技改', approvalAmount: 52000000, preApprovalAmount: 48000000, actualApprovalAmount: 52000000, originalContractAmount: 32500000, revisedContractAmount: 34000000, completedAmount: 21800000, settledAmount: 15600000, bookedAmount: 15600000, fixedAssetAmount: 0, approvalDate: '2024-01-15', ownerUnit: '炼铁厂', implementUnit: '炼铁事业部', projectManager: '王建国', hasEnvAssessment: '是' },
  { id: 'cp-002', approvalNo: 'LX-2024-002', planNo: 'JH-2024-002', projectName: '中厚板卷厂热处理线升级改造', approvalDesc: '2#热处理炉及配套设备升级', projectType: '技改', approvalAmount: 38500000, preApprovalAmount: 36000000, actualApprovalAmount: 38500000, originalContractAmount: 27500000, revisedContractAmount: 28500000, completedAmount: 19200000, settledAmount: 16800000, bookedAmount: 16800000, fixedAssetAmount: 0, approvalDate: '2024-01-25', ownerUnit: '中厚板卷厂', implementUnit: '宽厚板事业部', projectManager: '张涛', hasEnvAssessment: '是' },
  { id: 'cp-003', approvalNo: 'LX-2024-003', planNo: 'JH-2024-003', projectName: '棒材厂精整线智能化改造', approvalDesc: '精整线自动化升级、智能检测系统', projectType: '技改', approvalAmount: 29600000, preApprovalAmount: 28000000, actualApprovalAmount: 29600000, originalContractAmount: 15800000, revisedContractAmount: 16800000, completedAmount: 10500000, settledAmount: 8200000, bookedAmount: 8200000, fixedAssetAmount: 0, approvalDate: '2024-02-10', ownerUnit: '棒材厂', implementUnit: '棒材事业部', projectManager: '李明', hasEnvAssessment: '否' },
  { id: 'cp-004', approvalNo: 'LX-2024-004', planNo: 'JH-2024-004', projectName: '炼钢厂转炉高效化改造', approvalDesc: '3#转炉及配套系统高效化改造', projectType: '技改', approvalAmount: 61800000, preApprovalAmount: 58000000, actualApprovalAmount: 61800000, originalContractAmount: 48200000, revisedContractAmount: 50000000, completedAmount: 38500000, settledAmount: 32000000, bookedAmount: 32000000, fixedAssetAmount: 0, approvalDate: '2024-03-05', ownerUnit: '炼钢厂', implementUnit: '炼钢事业部', projectManager: '施海峰', hasEnvAssessment: '是' },
  { id: 'cp-005', approvalNo: 'LX-2024-005', planNo: 'JH-2024-005', projectName: '公辅水处理中心零排放改造', approvalDesc: '水处理系统零排放升级、中水回用', projectType: '环保', approvalAmount: 42300000, preApprovalAmount: 40000000, actualApprovalAmount: 42300000, originalContractAmount: 19600000, revisedContractAmount: 21500000, completedAmount: 14200000, settledAmount: 9500000, bookedAmount: 9500000, fixedAssetAmount: 0, approvalDate: '2024-03-20', ownerUnit: '公辅事业部', implementUnit: '公辅事业部', projectManager: '宋宁岐', hasEnvAssessment: '是' },
  { id: 'cp-006', approvalNo: 'LX-2024-006', planNo: 'JH-2024-006', projectName: '焦化厂干熄焦余热发电项目', approvalDesc: '干熄焦装置改造及余热发电系统', projectType: '节能', approvalAmount: 75200000, preApprovalAmount: 70000000, actualApprovalAmount: 75200000, originalContractAmount: 61800000, revisedContractAmount: 64000000, completedAmount: 52000000, settledAmount: 43000000, bookedAmount: 43000000, fixedAssetAmount: 0, approvalDate: '2024-04-10', ownerUnit: '焦化厂', implementUnit: '焦化事业部', projectManager: '陈志远', hasEnvAssessment: '是' },
  { id: 'cp-007', approvalNo: 'LX-2024-007', planNo: 'JH-2024-007', projectName: '宽厚板厂轧机主传动改造', approvalDesc: '粗轧机主传动系统升级、精轧机AGC改造', projectType: '技改', approvalAmount: 35800000, preApprovalAmount: 33000000, actualApprovalAmount: 35800000, originalContractAmount: 22900000, revisedContractAmount: 24000000, completedAmount: 18500000, settledAmount: 15000000, bookedAmount: 15000000, fixedAssetAmount: 0, approvalDate: '2024-05-05', ownerUnit: '宽厚板厂', implementUnit: '宽厚板事业部', projectManager: '赵志强', hasEnvAssessment: '否' },
  { id: 'cp-008', approvalNo: 'LX-2024-008', planNo: 'JH-2024-008', projectName: '第一炼钢厂电炉除尘改造', approvalDesc: '电炉除尘系统整体升级、二噁英治理', projectType: '环保', approvalAmount: 34700000, preApprovalAmount: 32000000, actualApprovalAmount: 34700000, originalContractAmount: 35100000, revisedContractAmount: 36000000, completedAmount: 26000000, settledAmount: 21000000, bookedAmount: 21000000, fixedAssetAmount: 0, approvalDate: '2024-05-20', ownerUnit: '第一炼钢厂', implementUnit: '炼钢事业部', projectManager: '孙建民', hasEnvAssessment: '是' },
  { id: 'cp-009', approvalNo: 'LX-2024-009', planNo: 'JH-2024-009', projectName: '原料厂智能料场改造', approvalDesc: '料场智能化管理、堆取料机无人化', projectType: '智能化', approvalAmount: 48900000, preApprovalAmount: 46000000, actualApprovalAmount: 48900000, originalContractAmount: 24300000, revisedContractAmount: 26000000, completedAmount: 16000000, settledAmount: 12000000, bookedAmount: 12000000, fixedAssetAmount: 0, approvalDate: '2024-06-10', ownerUnit: '原料厂', implementUnit: '炼铁事业部', projectManager: '周志强', hasEnvAssessment: '否' },
  { id: 'cp-010', approvalNo: 'LX-2024-010', planNo: 'JH-2024-010', projectName: '高炉煤气精脱硫项目', approvalDesc: '高炉煤气源头脱硫、硫磺回收装置', projectType: '环保', approvalAmount: 56300000, preApprovalAmount: 53000000, actualApprovalAmount: 56300000, originalContractAmount: 13400000, revisedContractAmount: 15000000, completedAmount: 8800000, settledAmount: 6200000, bookedAmount: 6200000, fixedAssetAmount: 0, approvalDate: '2024-07-05', ownerUnit: '炼铁厂', implementUnit: '炼铁事业部', projectManager: '何伟', hasEnvAssessment: '是' },
];

export const engineeringDemands: EngineeringDemand[] = [
  {
    id: 'ed-001', projectId: 'cp-001', demandNo: 'XQ-2024-0001', demandName: '烧结机本体新建耐材采购', demandType: '工程设备', procurementMethod: '公开招标', recommendedSupplier: '中冶武汉冶建', demandAmount: 8650000, businessUnit: '炼铁事业部', demandDept: '炼铁项目部', status: '新建', currentHandler: '陈工', approvalNo: 'LX-2024-001', firstCategory: '工程设备', secondCategory: '', procurementCatalog: '成套设备', hasOwnerSupply: '否', planAmount: 8500000, ownerSupplyAmount: 0, demandReason: '烧结机大修工程本体耐材需整体更换，原有耐材已超过设计使用寿命，为保障生产安全需采购新耐材。', internalFiles: ['耐材技术规格书.pdf', '耐材采购申请审批单.pdf'], externalFiles: ['耐材招标文件.pdf', '耐材供应商资质要求.pdf'], isMainContract: '是',
    detailItems: [
      { id: 'edi-1', description: '高铝砖采购', bidQuantity: 350, unit: '吨', duration: '90', contractMethod: '总包', estimatedAmount: 2800000, remark: '含施工', userUnit: '炼铁厂' },
      { id: 'edi-2', description: '镁碳砖采购', bidQuantity: 220, unit: '吨', duration: '90', contractMethod: '总包', estimatedAmount: 1950000, remark: '含施工', userUnit: '炼铁厂' },
      { id: 'edi-3', description: '浇注料采购及施工', bidQuantity: 180, unit: '吨', duration: '75', contractMethod: '总包', estimatedAmount: 2100000, remark: '', userUnit: '炼铁厂' },
      { id: 'edi-4', description: '隔热材料', bidQuantity: 120, unit: 'm³', duration: '60', contractMethod: '分包', estimatedAmount: 1800000, remark: '', userUnit: '炼铁厂' },
    ],
    createTime: '2024-01-18 09:00:00', modifyTime: '2024-01-18 09:00:00',
  },
  {
    id: 'ed-002', projectId: 'cp-001', demandNo: 'XQ-2024-0002', demandName: '烧结机除尘系统改造设备采购', demandType: '工程设备', procurementMethod: '邀请招标', recommendedSupplier: '中冶京诚', demandAmount: 6250000, businessUnit: '炼铁事业部', demandDept: '炼铁项目部', status: '审批中', currentHandler: '张工', approvalNo: 'LX-2024-001', firstCategory: '工程设备', secondCategory: '', procurementCatalog: '环保设备', hasOwnerSupply: '否', planAmount: 6200000, ownerSupplyAmount: 0, demandReason: '2#烧结机除尘系统需按超低排放标准进行整体改造，现有除尘器除尘效率不达标。', internalFiles: ['除尘系统改造技术方案.pdf'], externalFiles: ['除尘招标文件.pdf'], isMainContract: '否',
    detailItems: [
      { id: 'edi-5', description: '布袋除尘器', bidQuantity: 2, unit: '套', duration: '120', contractMethod: '总包', estimatedAmount: 4200000, remark: '含安装调试', userUnit: '炼铁厂' },
      { id: 'edi-6', description: '风机及管道系统', bidQuantity: 1, unit: '套', duration: '100', contractMethod: '总包', estimatedAmount: 2050000, remark: '', userUnit: '炼铁厂' },
    ],
    createTime: '2024-01-20 14:00:00', modifyTime: '2024-02-05 10:00:00',
  },
  {
    id: 'ed-003', projectId: 'cp-001', demandNo: 'XQ-2024-0003', demandName: '环冷机改造土建施工', demandType: '工程建设', procurementMethod: '公开招标', recommendedSupplier: '中国五冶', demandAmount: 7800000, businessUnit: '炼铁事业部', demandDept: '炼铁项目部', status: '已驳回', currentHandler: '李工', approvalNo: 'LX-2024-001', firstCategory: '工程建设', secondCategory: 'A建筑', procurementCatalog: '土建工程', hasOwnerSupply: '是', planAmount: 7700000, ownerSupplyAmount: 850000, demandReason: '环冷机基础及配套厂房需按新工艺要求重建。', internalFiles: ['环冷机土建技术规格书.pdf'], externalFiles: ['土建招标文件.pdf'], isMainContract: '否',
    detailItems: [
      { id: 'edi-7', description: '环冷机基础施工', bidQuantity: 1, unit: '项', duration: '150', contractMethod: '总包', estimatedAmount: 4500000, remark: '含桩基', userUnit: '炼铁厂' },
      { id: 'edi-8', description: '配套厂房建设', bidQuantity: 1, unit: '项', duration: '120', contractMethod: '总包', estimatedAmount: 3300000, remark: '', userUnit: '炼铁厂' },
    ],
    createTime: '2024-01-25 11:00:00', modifyTime: '2024-02-08 16:00:00',
  },
  {
    id: 'ed-004', projectId: 'cp-001', demandNo: 'XQ-2024-0004', demandName: '自动化控制系统升级', demandType: '信息化', procurementMethod: '竞争性谈判', recommendedSupplier: '中冶南方', demandAmount: 4200000, businessUnit: '炼铁事业部', demandDept: '炼铁项目部', status: '已通过', currentHandler: '王工', approvalNo: 'LX-2024-001', firstCategory: '信息化', secondCategory: '', procurementCatalog: '信息化系统', hasOwnerSupply: '否', planAmount: 4100000, ownerSupplyAmount: 0, demandReason: '烧结机控制系统需升级为DCS系统，实现全工艺流程自动控制。', internalFiles: ['自动化改造技术方案.pdf'], externalFiles: [], isMainContract: '否',
    detailItems: [
      { id: 'edi-9', description: 'DCS控制系统', bidQuantity: 1, unit: '套', duration: '180', contractMethod: '总包', estimatedAmount: 2800000, remark: '含软件授权', userUnit: '炼铁厂' },
      { id: 'edi-10', description: '现场仪表及执行器', bidQuantity: 1, unit: '批', duration: '120', contractMethod: '分包', estimatedAmount: 1400000, remark: '', userUnit: '炼铁厂' },
    ],
    createTime: '2024-02-01 08:30:00', modifyTime: '2024-02-20 15:00:00',
  },
  {
    id: 'ed-005', projectId: 'cp-001', demandNo: 'XQ-2024-0005', demandName: '电气系统增容改造', demandType: '工程设备', procurementMethod: '询价', recommendedSupplier: '', demandAmount: 3100000, businessUnit: '炼铁事业部', demandDept: '炼铁项目部', status: '已撤回', currentHandler: '赵工', approvalNo: 'LX-2024-001', firstCategory: '工程设备', secondCategory: '', procurementCatalog: '电气设备', hasOwnerSupply: '否', planAmount: 3000000, ownerSupplyAmount: 0, demandReason: '烧结机改造后用电负荷增加，需对原有电气系统进行增容改造。', internalFiles: ['电气增容方案.pdf'], externalFiles: [], isMainContract: '否',
    detailItems: [
      { id: 'edi-11', description: '变压器采购', bidQuantity: 2, unit: '台', duration: '60', contractMethod: '分包', estimatedAmount: 1800000, remark: '', userUnit: '炼铁厂' },
      { id: 'edi-12', description: '高低压开关柜', bidQuantity: 1, unit: '批', duration: '60', contractMethod: '分包', estimatedAmount: 1300000, remark: '', userUnit: '炼铁厂' },
    ],
    createTime: '2024-02-05 10:00:00', modifyTime: '2024-02-12 09:00:00',
  },
  {
    id: 'ed-006', projectId: 'cp-003', demandNo: 'XQ-2024-0006', demandName: '棒材厂精整线智能检测系统', demandType: '信息化', procurementMethod: '竞争性磋商', recommendedSupplier: '中冶设备院', demandAmount: 5800000, businessUnit: '棒材事业部', demandDept: '棒材项目部', status: '新建', currentHandler: '刘工', approvalNo: 'LX-2024-003', firstCategory: '信息化', secondCategory: '', procurementCatalog: '信息化系统', hasOwnerSupply: '否', planAmount: 5700000, ownerSupplyAmount: 0, demandReason: '精整线需配置智能检测系统实现自动化质检。', internalFiles: ['智能检测方案.pdf'], externalFiles: [], isMainContract: '是',
    detailItems: [
      { id: 'edi-13', description: '表面缺陷检测系统', bidQuantity: 1, unit: '套', duration: '150', contractMethod: '总包', estimatedAmount: 3200000, remark: '含AI算法', userUnit: '棒材厂' },
      { id: 'edi-14', description: '尺寸测量系统', bidQuantity: 1, unit: '套', duration: '120', contractMethod: '总包', estimatedAmount: 2600000, remark: '', userUnit: '棒材厂' },
    ],
    createTime: '2024-02-15 13:00:00', modifyTime: '2024-02-15 13:00:00',
  },
];

export const changePricingApprovalRecords: ChangePricingApprovalRecord[] = [
  { id: 'cpr-001', demandId: 'ed-002', seq: 1, stage: '工程需求申报', operator: '张工', action: '提交申请', operateTime: '2024-01-20 14:00:00', opinion: '2#烧结机除尘系统改造设备采购申请，详见附件技术方案。' },
  { id: 'cpr-002', demandId: 'ed-002', seq: 2, stage: '工程需求申报', operator: '张工', action: '呈核', operateTime: '2024-01-20 15:30:00', opinion: '呈核炼铁事业部陈总审核。' },
  { id: 'cpr-003', demandId: 'ed-002', seq: 3, stage: '部门负责人审批', operator: '陈总', action: '审核中', operateTime: '2024-02-05 10:00:00', opinion: '' },
  { id: 'cpr-004', demandId: 'ed-003', seq: 1, stage: '工程需求申报', operator: '李工', action: '提交申请', operateTime: '2024-01-25 11:00:00', opinion: '环冷机改造土建施工申请。' },
  { id: 'cpr-005', demandId: 'ed-003', seq: 2, stage: '工程需求申报', operator: '李工', action: '呈核', operateTime: '2024-01-25 14:00:00', opinion: '呈核炼铁事业部审核。' },
  { id: 'cpr-006', demandId: 'ed-003', seq: 3, stage: '部门负责人审批', operator: '王建国', action: '驳回', operateTime: '2024-02-08 16:00:00', opinion: '甲供材清单不完整，请补充甲供材明细后重新提交。另外技术要求中基础防腐等级需提高至C4级。' },
  { id: 'cpr-007', demandId: 'ed-004', seq: 1, stage: '工程需求申报', operator: '王工', action: '提交申请', operateTime: '2024-02-01 08:30:00', opinion: '自动化控制系统升级至DCS系统申请。' },
  { id: 'cpr-008', demandId: 'ed-004', seq: 2, stage: '工程需求申报', operator: '王工', action: '呈核', operateTime: '2024-02-01 10:00:00', opinion: '呈核炼铁事业部。' },
  { id: 'cpr-009', demandId: 'ed-004', seq: 3, stage: '部门负责人审批', operator: '王建国', action: '核准', operateTime: '2024-02-10 09:00:00', opinion: '技术方案可行，同意按此方案推进。' },
  { id: 'cpr-010', demandId: 'ed-004', seq: 4, stage: '分管领导审批', operator: '陈副总', action: '核准', operateTime: '2024-02-20 15:00:00', opinion: '自动化升级对降本增效有重要意义，批准实施。' },
  { id: 'cpr-011', demandId: 'ed-005', seq: 1, stage: '工程需求申报', operator: '赵工', action: '提交申请', operateTime: '2024-02-05 10:00:00', opinion: '电气系统增容改造申请。' },
  { id: 'cpr-012', demandId: 'ed-005', seq: 2, stage: '工程需求申报', operator: '赵工', action: '撤销', operateTime: '2024-02-12 09:00:00', opinion: '经评估需重新核算用电负荷，暂时撤销申请。' },
];

export function getProjectById(id: string): ChangePricingProject | undefined {
  return changePricingProjects.find((p) => p.id === id);
}

export function getDemandsByProjectId(projectId: string): EngineeringDemand[] {
  return engineeringDemands.filter((d) => d.projectId === projectId);
}

export function getDemandById(id: string): EngineeringDemand | undefined {
  return engineeringDemands.find((d) => d.id === id);
}

export function getApprovalRecordsByDemandId(demandId: string): ChangePricingApprovalRecord[] {
  return changePricingApprovalRecords.filter((r) => r.demandId === demandId).sort((a, b) => a.seq - b.seq);
}

export const projectTypes = ['技改', '环保', '节能', '智能化', '安全'];
export const ownerUnits = ['炼铁厂', '炼钢厂', '第一炼钢厂', '棒材厂', '宽厚板厂', '中厚板卷厂', '焦化厂', '原料厂', '公辅事业部'];
export const demandTypes = ['工程设备', '信息化', '工程建设', '技术服务', '环境提升'];
export const secondCategories = ['A建筑', 'B安装', 'E总承包(EPC)', 'F勘察', 'L设计', 'LEP', 'X技术集成', 'Y绿化'];
export const procurementMethods = ['公开招标', '邀请招标', '竞争性谈判', '竞争性磋商', '询价', '单一来源', '保供大宗长协'];
export const procurementCatalogs = ['成套设备', '环保设备', '土建工程', '电气设备', '信息化系统', '仪表设备', '管道阀门'];
export const demandDepts = ['炼铁项目部', '炼钢项目部', '棒材项目部', '宽厚板项目部', '焦化项目部', '公辅项目部', '原料项目部'];
export const contractMethods = ['总包', '分包', '联合体'];
export const userUnits = ['炼铁厂', '炼钢厂', '第一炼钢厂', '棒材厂', '宽厚板厂', '中厚板卷厂', '焦化厂', '原料厂', '公辅事业部'];
export const units = ['吨', '套', '项', '台', '批', 'm³', 'm²', '米'];