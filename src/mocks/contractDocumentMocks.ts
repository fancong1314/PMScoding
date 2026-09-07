export interface ContractDocument {
  id: string;
  approvalNo: string;
  contractNo: string;
  contractName: string;
  contractType: string;
  contractorNo: string;
  contractorName: string;
  mainContent: string;
  contractDate: string;
  contractAmount: number;
  materialAmount: number;
  contractStatus: string;
  contractAttr: string;
  frameworkContract: string;
  underFramework: string;
  purchaseMethod: string;
  purchaseMethodDesc: string;
  specialReason: string;
  planStartDate: string;
  planEndDate: string;
  jiananDiscountRatio: number;
  jiananPaymentRatio: number;
  jiananWarrantyRatio: number;
  equipmentPaymentRatio: number;
  equipmentWarrantyRatio: number;
  supervisorPaymentRatio: number;
  supervisorWarrantyRatio: number;
  otherPrepayRatio: number;
  otherWarrantyRatio: number;
  originalAmount: number;
  originalExcludingTax: number;
  originalTax: number;
  originalMaterialAmount: number;
  settlementImportAmount: number;
  settlementImportDate: string;
  settlementExportAmount: number;
  settlementExportDate: string;
  partyBManager: string;
  partyARep: string;
  teamLeader: string;
  controlReleaseNo: string;
  route: string;
  supervisorEngineer: string;
  bidLetterFile: string;
  attachments: string[];
  contractTextFile: string;
  safetyBCert: string;
  safetyBCertNo: string;
  builderCert: string;
  isDeleted: boolean;
}

export interface AmountChangeRecord {
  id: string;
  contractId: string;
  budgetApplyNo: string;
  approvalNo: string;
  contractNo: string;
  changeDesc: string;
  changeType: string;
  status: string;
  changeUnit: string;
  changeAmount: number;
  applicant: string;
  applyDate: string;
  approver: string;
  approveDate: string;
  taxDetails: TaxDetail[];
  budgetAllocations: BudgetAllocation[];
}

export interface TaxDetail {
  id: string;
  taxType: string;
  taxItem: string;
  taxRate: string;
  amountWithTax: number;
  selected: boolean;
}

export interface MaterialChangeRecord {
  id: string;
  contractId: string;
  controlRecordNo: string;
  approvalNo: string;
  contractNo: string;
  changeDesc: string;
  changeType: string;
  status: string;
  changeUnit: string;
  changeAmount: number;
  applicant: string;
  applyDate: string;
  approver: string;
  approveDate: string;
  creator: string;
  createDate: string;
  modifier: string;
  modifyDate: string;
  budgetAllocations: BudgetAllocation[];
}

export interface BudgetAllocation {
  id: string;
  estimateName: string;
  estimateAmount: number;
  demandOccupied: number;
  contractOccupied: number;
  currentOccupied: number;
  isBalance: string;
  balanceAmount: number;
}

export interface ApprovalNode {
  id: string;
  name: string;
  type: string;
  approverType: string;
  approvers: string;
  approvalMode: string;
  countersignRule: string;
  passRatio: number;
  timeoutHours: number;
  timeoutUnit: string;
  timeoutAction: string;
  notifyType: string;
  notifyTarget: string;
  notifyMethods: string[];
  notifyTemplate: string;
  conditions: ApprovalCondition[];
  targetNode: string;
  defaultPath: string;
}

export interface ApprovalCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface ApprovalFlowConfig {
  id: string;
  name: string;
  type: string;
  urgency: string;
  nodes: ApprovalNode[];
}

export interface ApprovalLog {
  id: string;
  operator: string;
  operateTime: string;
  operateType: string;
  opinion: string;
  result: string;
}

export const contractDocTypes = ['合同开工', '合同交工', '合同竣工', '结算进口', '结算出口'];
export const contractDocStatuses = ['待确认', '已确认', '已结案', '已核销', '已抛送'];
export const contractCategories = ['设备', '施工', '监理', '设计', '服务', '总承包', '系统集成', '其他'];
export const purchaseMethods = ['公开招标', '邀请招标', '竞争性谈判', '竞争性磋商', '询价', '单一来源', '保供大宗长协'];
export const contractAttrs = ['招标', '非招标'];
export const changeTypes = ['订约', '追加减', '修改条款专用'];
export const materialChangeTypes = ['订约', '追加减'];
export const changeStatuses = ['暂存', '审批中', '已通过', '已退回'];
export const taxTypes = ['A建安', 'B设备', 'C其他(6%)', 'D其他(0%)', 'E其他'];
export const taxItems = ['0不计算印花税', '1计算印花税'];
export const taxRates = ['增值税专用发票(9%)', '增值税专用发票(13%)', '增值税专用发票(6%)', '增值税专用发票(3%)', '增值税专用发票(不可抵税)'];
export const nodeTypes = ['审批节点', '会签节点', '条件分支节点', '通知节点'];
export const approverTypes = ['指定人员', '指定角色', '部门负责人', '部门领导', '发起人上级', '发起人部门领导', '表单字段关联人员'];
export const approvalFlowTypes = ['串行审批', '并行审批', '条件审批', '会签审批'];
export const urgencies = ['普通', '加急', '特急'];
export const conditionFields = ['异动金额', '异动类型', '合同类型', '采购方式', '合同金额'];
export const conditionOperators = ['等于', '不等于', '大于', '小于', '大于等于', '小于等于', '包含', '不包含', '为空', '不为空'];

export const contractDocuments: ContractDocument[] = [
  { id: 'cd-001', approvalNo: 'LX-2026-001', contractNo: 'HT-2026-001', contractName: '高炉本体耐材砌筑施工合同', contractType: '合同开工', contractorNo: 'CS-001', contractorName: '南京钢铁建设集团有限公司', mainContent: '高炉本体耐材砌筑及配套设施安装工程，包括炉壳内衬砌筑、热风管道保温等施工内容', contractDate: '2026-01-15', contractAmount: 2450000, materialAmount: 350000, contractStatus: '已确认', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '公开招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-02-01', planEndDate: '2026-08-31', jiananDiscountRatio: 0, jiananPaymentRatio: 80, jiananWarrantyRatio: 5, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 20, otherWarrantyRatio: 0, originalAmount: 2450000, originalExcludingTax: 2259400, originalTax: 190600, originalMaterialAmount: 350000, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '赵建国', partyARep: '李明辉', teamLeader: '王大勇', controlReleaseNo: '', route: '厂区主干道-高炉区域', supervisorEngineer: '', bidLetterFile: '', attachments: ['施工方案.pdf', '安全协议.pdf'], contractTextFile: '高炉耐材合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '', isDeleted: false },
  { id: 'cd-002', approvalNo: 'LX-2026-002', contractNo: 'HT-2026-002', contractName: '转炉设备基础施工合同', contractType: '合同交工', contractorNo: 'CS-002', contractorName: '江苏建工集团有限公司', mainContent: '转炉设备基础施工及钢结构安装，包含地基处理、混凝土浇筑、预埋件安装等', contractDate: '2026-02-01', contractAmount: 1850000, materialAmount: 280000, contractStatus: '已确认', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '邀请招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-02-15', planEndDate: '2026-09-30', jiananDiscountRatio: 5, jiananPaymentRatio: 85, jiananWarrantyRatio: 3, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 15, otherWarrantyRatio: 0, originalAmount: 1850000, originalExcludingTax: 1697200, originalTax: 152800, originalMaterialAmount: 280000, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '周建华', partyARep: '陈志强', teamLeader: '刘军', controlReleaseNo: '', route: '炼钢区域A区', supervisorEngineer: '张监理', bidLetterFile: '', attachments: ['基础施工图.pdf', '钢结构方案.pdf'], contractTextFile: '转炉基础合同正本.pdf', safetyBCert: 'B证-2026-001.pdf', safetyBCertNo: 'B证-2026-001', builderCert: '建造师-周建华.pdf', isDeleted: false },
  { id: 'cd-003', approvalNo: 'LX-2026-003', contractNo: 'HT-2026-003', contractName: '轧机主传动装置采购安装合同', contractType: '合同开工', contractorNo: 'CS-003', contractorName: '西门子工业自动化有限公司', mainContent: '轧机主传动装置采购、安装及调试，包括电机、变频器、控制系统等', contractDate: '2026-02-20', contractAmount: 3200000, materialAmount: 0, contractStatus: '已确认', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '公开招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-03-10', planEndDate: '2026-10-31', jiananDiscountRatio: 0, jiananPaymentRatio: 0, jiananWarrantyRatio: 0, equipmentPaymentRatio: 70, equipmentWarrantyRatio: 10, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 30, otherWarrantyRatio: 0, originalAmount: 3200000, originalExcludingTax: 2831900, originalTax: 368100, originalMaterialAmount: 0, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: 'Thomas Mueller', partyARep: '赵卫东', teamLeader: '', controlReleaseNo: '', route: '轧钢车间主传动区', supervisorEngineer: '', bidLetterFile: '中标通知书-003.pdf', attachments: ['技术协议.pdf', '交货计划.pdf'], contractTextFile: '轧机传动合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '', isDeleted: false },
  { id: 'cd-004', approvalNo: 'LX-2026-004', contractNo: 'HT-2026-004', contractName: '自动化控制系统编程调试合同', contractType: '合同开工', contractorNo: 'CS-004', contractorName: '宝信软件股份有限公司', mainContent: '自动化控制系统编程调试及系统集成，包括PLC编程、HMI开发、SCADA系统搭建', contractDate: '2026-03-01', contractAmount: 850000, materialAmount: 0, contractStatus: '待确认', contractAttr: '非招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '竞争性谈判', purchaseMethodDesc: '经市场调研，宝信软件在钢铁行业自动化领域具有技术优势', specialReason: '', planStartDate: '2026-03-15', planEndDate: '2026-08-31', jiananDiscountRatio: 0, jiananPaymentRatio: 0, jiananWarrantyRatio: 0, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 25, otherWarrantyRatio: 5, originalAmount: 850000, originalExcludingTax: 801900, originalTax: 48100, originalMaterialAmount: 0, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '钱学民', partyARep: '孙伟', teamLeader: '', controlReleaseNo: '', route: '', supervisorEngineer: '', bidLetterFile: '', attachments: ['技术方案.pdf'], contractTextFile: '自动化合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '', isDeleted: false },
  { id: 'cd-005', approvalNo: 'LX-2026-005', contractNo: 'HT-2026-005', contractName: '原料场智能化设备采购合同', contractType: '合同开工', contractorNo: 'CS-005', contractorName: '中冶赛迪工程技术股份有限公司', mainContent: '原料场智能化设备采购安装，包括堆取料机、皮带输送机、自动配料系统等', contractDate: '2026-03-10', contractAmount: 1680000, materialAmount: 420000, contractStatus: '已结案', contractAttr: '招标', frameworkContract: '是', underFramework: '否', purchaseMethod: '公开招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-04-01', planEndDate: '2026-12-31', jiananDiscountRatio: 0, jiananPaymentRatio: 80, jiananWarrantyRatio: 5, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 20, otherWarrantyRatio: 0, originalAmount: 1680000, originalExcludingTax: 1541300, originalTax: 138700, originalMaterialAmount: 420000, settlementImportAmount: 1680000, settlementImportDate: '2027-01-15', settlementExportAmount: 1650000, settlementExportDate: '2027-03-20', partyBManager: '吴志强', partyARep: '周鹏', teamLeader: '郑明', controlReleaseNo: '', route: '原料场区域', supervisorEngineer: '', bidLetterFile: '', attachments: ['设备清单.pdf', '安装方案.pdf'], contractTextFile: '原料场合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '', isDeleted: false },
  { id: 'cd-006', approvalNo: 'LX-2026-006', contractNo: 'HT-2026-006', contractName: '环保除尘设施土建施工合同', contractType: '合同竣工', contractorNo: 'CS-006', contractorName: '中冶天工集团有限公司', mainContent: '环保除尘设施土建施工及设备安装，包括除尘器基础、烟囱、管道支架等', contractDate: '2026-03-20', contractAmount: 1200000, materialAmount: 180000, contractStatus: '已确认', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '邀请招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-04-10', planEndDate: '2026-11-30', jiananDiscountRatio: 3, jiananPaymentRatio: 85, jiananWarrantyRatio: 3, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 15, otherWarrantyRatio: 0, originalAmount: 1200000, originalExcludingTax: 1100900, originalTax: 99100, originalMaterialAmount: 180000, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '冯志明', partyARep: '吴昊', teamLeader: '钱勇', controlReleaseNo: '', route: '环保区域B区', supervisorEngineer: '李监理', bidLetterFile: '', attachments: ['除尘方案.pdf'], contractTextFile: '除尘合同正本.pdf', safetyBCert: 'B证-2026-002.pdf', safetyBCertNo: 'B证-2026-002', builderCert: '建造师-冯志明.pdf', isDeleted: false },
  { id: 'cd-007', approvalNo: 'LX-2026-007', contractNo: 'HT-2026-007', contractName: '余热发电锅炉安装合同', contractType: '合同开工', contractorNo: 'CS-007', contractorName: '哈尔滨锅炉厂有限公司', mainContent: '余热发电锅炉安装及系统调试，包括锅炉本体安装、汽水管道、电气仪表等', contractDate: '2026-04-01', contractAmount: 2100000, materialAmount: 520000, contractStatus: '已确认', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '公开招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-04-20', planEndDate: '2027-02-28', jiananDiscountRatio: 0, jiananPaymentRatio: 75, jiananWarrantyRatio: 5, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 25, otherWarrantyRatio: 0, originalAmount: 2100000, originalExcludingTax: 1858400, originalTax: 241600, originalMaterialAmount: 520000, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '蒋伟', partyARep: '郑明', teamLeader: '韩志勇', controlReleaseNo: '', route: '发电区域', supervisorEngineer: '', bidLetterFile: '中标通知书-007.pdf', attachments: ['锅炉方案.pdf', '调试计划.pdf'], contractTextFile: '锅炉合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '建造师-蒋伟.pdf', isDeleted: false },
  { id: 'cd-008', approvalNo: 'LX-2026-008', contractNo: 'HT-2026-008', contractName: '污水处理厂设备采购合同', contractType: '合同开工', contractorNo: 'CS-008', contractorName: '北控水务集团有限公司', mainContent: '污水处理厂设备采购安装调试，包括格栅、曝气系统、污泥脱水机等', contractDate: '2026-04-15', contractAmount: 1350000, materialAmount: 0, contractStatus: '已核销', contractAttr: '招标', frameworkContract: '否', underFramework: '是', purchaseMethod: '公开招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-05-01', planEndDate: '2026-12-31', jiananDiscountRatio: 0, jiananPaymentRatio: 0, jiananWarrantyRatio: 0, equipmentPaymentRatio: 80, equipmentWarrantyRatio: 5, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 20, otherWarrantyRatio: 0, originalAmount: 1350000, originalExcludingTax: 1194700, originalTax: 155300, originalMaterialAmount: 0, settlementImportAmount: 1350000, settlementImportDate: '2027-01-20', settlementExportAmount: 1320000, settlementExportDate: '2027-03-10', partyBManager: '沈国栋', partyARep: '刘伟', teamLeader: '', controlReleaseNo: '', route: '污水处理区', supervisorEngineer: '', bidLetterFile: '', attachments: ['设备规格书.pdf'], contractTextFile: '污水合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '', isDeleted: false },
  { id: 'cd-009', approvalNo: 'LX-2026-009', contractNo: 'HT-2026-009', contractName: '配电室高低压设备更新合同', contractType: '结算进口', contractorNo: 'CS-009', contractorName: '许继电气股份有限公司', mainContent: '配电室高低压开关柜更新及继电保护装置升级', contractDate: '2026-04-20', contractAmount: 780000, materialAmount: 0, contractStatus: '已抛送', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '邀请招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-05-10', planEndDate: '2026-09-30', jiananDiscountRatio: 0, jiananPaymentRatio: 0, jiananWarrantyRatio: 0, equipmentPaymentRatio: 70, equipmentWarrantyRatio: 5, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 30, otherWarrantyRatio: 0, originalAmount: 780000, originalExcludingTax: 690300, originalTax: 89700, originalMaterialAmount: 0, settlementImportAmount: 780000, settlementImportDate: '2026-10-15', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '韩磊', partyARep: '陈建华', teamLeader: '', controlReleaseNo: '', route: '配电室区域', supervisorEngineer: '', bidLetterFile: '', attachments: ['设备清单.pdf'], contractTextFile: '配电合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '', isDeleted: false },
  { id: 'cd-010', approvalNo: 'LX-2026-010', contractNo: 'HT-2026-010', contractName: '办公楼信息化基础设施建设合同', contractType: '结算出口', contractorNo: 'CS-010', contractorName: '华为技术有限公司', mainContent: '办公楼信息化网络及系统建设，包括综合布线、机房建设、网络设备等', contractDate: '2026-05-01', contractAmount: 950000, materialAmount: 0, contractStatus: '已抛送', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '公开招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-05-15', planEndDate: '2026-10-31', jiananDiscountRatio: 0, jiananPaymentRatio: 0, jiananWarrantyRatio: 0, equipmentPaymentRatio: 75, equipmentWarrantyRatio: 5, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 25, otherWarrantyRatio: 0, originalAmount: 950000, originalExcludingTax: 840700, originalTax: 109300, originalMaterialAmount: 0, settlementImportAmount: 950000, settlementImportDate: '2026-11-15', settlementExportAmount: 930000, settlementExportDate: '2026-12-20', partyBManager: '杨帆', partyARep: '孙伟', teamLeader: '', controlReleaseNo: '', route: '', supervisorEngineer: '', bidLetterFile: '中标通知书-010.pdf', attachments: ['信息化方案.pdf', '网络拓扑图.pdf'], contractTextFile: '信息化合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '', isDeleted: false },
  { id: 'cd-011', approvalNo: 'LX-2026-011', contractNo: 'HT-2026-011', contractName: '厂区道路硬化及管网改造合同', contractType: '合同开工', contractorNo: 'CS-011', contractorName: '中铁十七局集团有限公司', mainContent: '厂区道路硬化及地下管网改造，包括主干道沥青铺设、雨水管网、污水管网等', contractDate: '2026-05-10', contractAmount: 1580000, materialAmount: 380000, contractStatus: '待确认', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '公开招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-06-01', planEndDate: '2027-01-31', jiananDiscountRatio: 2, jiananPaymentRatio: 85, jiananWarrantyRatio: 3, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 15, otherWarrantyRatio: 0, originalAmount: 1580000, originalExcludingTax: 1449500, originalTax: 130500, originalMaterialAmount: 380000, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '朱明', partyARep: '周鹏', teamLeader: '秦勇', controlReleaseNo: '', route: '厂区道路全线', supervisorEngineer: '王监理', bidLetterFile: '', attachments: ['道路方案.pdf', '管网图纸.pdf'], contractTextFile: '道路合同正本.pdf', safetyBCert: 'B证-2026-003.pdf', safetyBCertNo: 'B证-2026-003', builderCert: '建造师-朱明.pdf', isDeleted: false },
  { id: 'cd-012', approvalNo: 'LX-2026-012', contractNo: 'HT-2026-012', contractName: '安全防护设施完善升级合同', contractType: '合同开工', contractorNo: 'CS-012', contractorName: '南京安防工程有限公司', mainContent: '安全防护设施完善升级施工，包括护栏、警示标识、监控设备等', contractDate: '2026-05-15', contractAmount: 420000, materialAmount: 85000, contractStatus: '待确认', contractAttr: '非招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '询价', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-06-01', planEndDate: '2026-08-31', jiananDiscountRatio: 0, jiananPaymentRatio: 90, jiananWarrantyRatio: 2, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 10, otherWarrantyRatio: 0, originalAmount: 420000, originalExcludingTax: 385300, originalTax: 34700, originalMaterialAmount: 85000, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '尤志强', partyARep: '吴昊', teamLeader: '许勇', controlReleaseNo: '', route: '', supervisorEngineer: '', bidLetterFile: '', attachments: ['安防方案.pdf'], contractTextFile: '安防合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '', isDeleted: false },
  { id: 'cd-013', approvalNo: 'LX-2026-013', contractNo: 'HT-2026-013', contractName: '仓储物流中心建设工程合同', contractType: '合同开工', contractorNo: 'CS-013', contractorName: '中交第一航务工程局有限公司', mainContent: '仓储物流中心建设工程总承包，包括仓库主体结构、装卸平台、物流通道等', contractDate: '2026-05-20', contractAmount: 2680000, materialAmount: 650000, contractStatus: '待确认', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '公开招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-06-15', planEndDate: '2027-03-31', jiananDiscountRatio: 0, jiananPaymentRatio: 80, jiananWarrantyRatio: 5, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 20, otherWarrantyRatio: 0, originalAmount: 2680000, originalExcludingTax: 2458700, originalTax: 221300, originalMaterialAmount: 650000, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '何伟', partyARep: '郑明', teamLeader: '吕志勇', controlReleaseNo: '', route: '物流园区', supervisorEngineer: '', bidLetterFile: '中标通知书-013.pdf', attachments: ['物流方案.pdf', '结构图纸.pdf'], contractTextFile: '物流合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '建造师-何伟.pdf', isDeleted: false },
  { id: 'cd-014', approvalNo: 'LX-2026-014', contractNo: 'HT-2026-014', contractName: '环保监测站房建设合同', contractType: '合同开工', contractorNo: 'CS-014', contractorName: '江苏省环境工程有限公司', mainContent: '环保监测站房建设及设备安装，包括监测站房主体、采样平台、供电系统等', contractDate: '2026-05-25', contractAmount: 680000, materialAmount: 120000, contractStatus: '待确认', contractAttr: '非招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '竞争性磋商', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-06-10', planEndDate: '2026-10-31', jiananDiscountRatio: 0, jiananPaymentRatio: 85, jiananWarrantyRatio: 3, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 15, otherWarrantyRatio: 0, originalAmount: 680000, originalExcludingTax: 623900, originalTax: 56100, originalMaterialAmount: 120000, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '施建华', partyARep: '刘伟', teamLeader: '张勇', controlReleaseNo: '', route: '环保监测区', supervisorEngineer: '陈监理', bidLetterFile: '', attachments: ['监测方案.pdf'], contractTextFile: '监测站合同正本.pdf', safetyBCert: 'B证-2026-004.pdf', safetyBCertNo: 'B证-2026-004', builderCert: '建造师-施建华.pdf', isDeleted: false },
  { id: 'cd-015', approvalNo: 'LX-2026-015', contractNo: 'HT-2026-015', contractName: '消防系统升级改造合同', contractType: '合同开工', contractorNo: 'CS-015', contractorName: '南京消防工程有限公司', mainContent: '消防系统升级改造及验收，包括自动喷淋系统、火灾报警系统、消防联动控制等', contractDate: '2026-06-01', contractAmount: 560000, materialAmount: 95000, contractStatus: '待确认', contractAttr: '招标', frameworkContract: '否', underFramework: '否', purchaseMethod: '邀请招标', purchaseMethodDesc: '', specialReason: '', planStartDate: '2026-06-20', planEndDate: '2026-09-30', jiananDiscountRatio: 0, jiananPaymentRatio: 80, jiananWarrantyRatio: 5, equipmentPaymentRatio: 0, equipmentWarrantyRatio: 0, supervisorPaymentRatio: 0, supervisorWarrantyRatio: 0, otherPrepayRatio: 20, otherWarrantyRatio: 0, originalAmount: 560000, originalExcludingTax: 513800, originalTax: 46200, originalMaterialAmount: 95000, settlementImportAmount: 0, settlementImportDate: '', settlementExportAmount: 0, settlementExportDate: '', partyBManager: '张雷', partyARep: '陈建华', teamLeader: '刘勇', controlReleaseNo: '', route: '', supervisorEngineer: '', bidLetterFile: '', attachments: ['消防方案.pdf'], contractTextFile: '消防合同正本.pdf', safetyBCert: '', safetyBCertNo: '', builderCert: '', isDeleted: false },
];

// Generate amount change records
export function generateTaxDetails(): TaxDetail[] {
  return [
    { id: 'td-1', taxType: 'A建安', taxItem: '1计算印花税', taxRate: '增值税专用发票(9%)', amountWithTax: 0, selected: true },
    { id: 'td-2', taxType: 'B设备', taxItem: '1计算印花税', taxRate: '增值税专用发票(13%)', amountWithTax: 0, selected: false },
    { id: 'td-3', taxType: 'C其他(6%)', taxItem: '0不计算印花税', taxRate: '增值税专用发票(6%)', amountWithTax: 0, selected: false },
  ];
}

export function generateBudgetAllocations(): BudgetAllocation[] {
  return [
    { id: 'ba-1', estimateName: '设备工器具购置费', estimateAmount: 15000000, demandOccupied: 5000000, contractOccupied: 3000000, currentOccupied: 0, isBalance: '否', balanceAmount: 7000000 },
    { id: 'ba-2', estimateName: '  制氧厂', estimateAmount: 3000000, demandOccupied: 1200000, contractOccupied: 800000, currentOccupied: 0, isBalance: '否', balanceAmount: 1000000 },
    { id: 'ba-3', estimateName: '    空气分离设备', estimateAmount: 1500000, demandOccupied: 600000, contractOccupied: 400000, currentOccupied: 0, isBalance: '否', balanceAmount: 500000 },
    { id: 'ba-4', estimateName: '    氧压机设备', estimateAmount: 1500000, demandOccupied: 600000, contractOccupied: 400000, currentOccupied: 0, isBalance: '否', balanceAmount: 500000 },
    { id: 'ba-5', estimateName: '  炼铁事业部', estimateAmount: 5000000, demandOccupied: 2000000, contractOccupied: 1200000, currentOccupied: 0, isBalance: '否', balanceAmount: 1800000 },
    { id: 'ba-6', estimateName: '    高炉设备', estimateAmount: 3000000, demandOccupied: 1200000, contractOccupied: 800000, currentOccupied: 0, isBalance: '否', balanceAmount: 1000000 },
    { id: 'ba-7', estimateName: '    热风炉设备', estimateAmount: 2000000, demandOccupied: 800000, contractOccupied: 400000, currentOccupied: 0, isBalance: '否', balanceAmount: 800000 },
    { id: 'ba-8', estimateName: '建筑工程费', estimateAmount: 8000000, demandOccupied: 3000000, contractOccupied: 1500000, currentOccupied: 0, isBalance: '否', balanceAmount: 3500000 },
    { id: 'ba-9', estimateName: '  板材事业部', estimateAmount: 3500000, demandOccupied: 1500000, contractOccupied: 800000, currentOccupied: 0, isBalance: '否', balanceAmount: 1200000 },
    { id: 'ba-10', estimateName: '    轧机基础', estimateAmount: 2000000, demandOccupied: 1000000, contractOccupied: 500000, currentOccupied: 0, isBalance: '否', balanceAmount: 500000 },
    { id: 'ba-11', estimateName: '  特钢事业部', estimateAmount: 2500000, demandOccupied: 1000000, contractOccupied: 500000, currentOccupied: 0, isBalance: '否', balanceAmount: 1000000 },
    { id: 'ba-12', estimateName: '安装工程费', estimateAmount: 5000000, demandOccupied: 2000000, contractOccupied: 1000000, currentOccupied: 0, isBalance: '否', balanceAmount: 2000000 },
    { id: 'ba-13', estimateName: '  公司部门', estimateAmount: 3000000, demandOccupied: 1200000, contractOccupied: 600000, currentOccupied: 0, isBalance: '否', balanceAmount: 1200000 },
    { id: 'ba-14', estimateName: '工程建设其他费', estimateAmount: 3000000, demandOccupied: 1000000, contractOccupied: 500000, currentOccupied: 0, isBalance: '否', balanceAmount: 1500000 },
    { id: 'ba-15', estimateName: '  公司部门', estimateAmount: 2000000, demandOccupied: 800000, contractOccupied: 400000, currentOccupied: 0, isBalance: '否', balanceAmount: 800000 },
  ];
}

export const amountChangeRecords: AmountChangeRecord[] = [
  {
    id: 'ac-001', contractId: 'cd-001', budgetApplyNo: 'HT-2026-001-001', approvalNo: 'LX-2026-001', contractNo: 'HT-2026-001',
    changeDesc: '因设计变更，高炉耐材厚度增加，需追加合同金额', changeType: '追加减', status: '已通过',
    changeUnit: '炼铁事业部', changeAmount: 350000,
    applicant: '张明远', applyDate: '2026-03-15', approver: '王志强', approveDate: '2026-03-20',
    taxDetails: [
      { id: 'td-ac1-1', taxType: 'A建安', taxItem: '1计算印花税', taxRate: '增值税专用发票(9%)', amountWithTax: 250000, selected: true },
      { id: 'td-ac1-2', taxType: 'B设备', taxItem: '1计算印花税', taxRate: '增值税专用发票(13%)', amountWithTax: 100000, selected: true },
    ],
    budgetAllocations: generateBudgetAllocations().map(b => ({ ...b, currentOccupied: b.id === 'ba-6' ? 350000 : 0, balanceAmount: b.id === 'ba-6' ? b.balanceAmount - 350000 : b.balanceAmount })),
  },
  {
    id: 'ac-002', contractId: 'cd-001', budgetApplyNo: 'HT-2026-001-002', approvalNo: 'LX-2026-001', contractNo: 'HT-2026-001',
    changeDesc: '材料价格调整，合同金额需修正', changeType: '修改条款专用', status: '审批中',
    changeUnit: '炼铁事业部', changeAmount: -50000,
    applicant: '李建国', applyDate: '2026-05-10', approver: '', approveDate: '',
    taxDetails: generateTaxDetails().map((t, i) => ({ ...t, amountWithTax: i === 0 ? -50000 : 0 })),
    budgetAllocations: generateBudgetAllocations(),
  },
  {
    id: 'ac-003', contractId: 'cd-003', budgetApplyNo: 'HT-2026-003-001', approvalNo: 'LX-2026-003', contractNo: 'HT-2026-003',
    changeDesc: '轧机主传动装置增补备件及调试服务', changeType: '订约', status: '已通过',
    changeUnit: '轧钢事业部', changeAmount: 450000,
    applicant: '赵卫东', applyDate: '2026-04-20', approver: '王志强', approveDate: '2026-04-28',
    taxDetails: [
      { id: 'td-ac3-1', taxType: 'B设备', taxItem: '1计算印花税', taxRate: '增值税专用发票(13%)', amountWithTax: 450000, selected: true },
    ],
    budgetAllocations: generateBudgetAllocations(),
  },
  {
    id: 'ac-004', contractId: 'cd-005', budgetApplyNo: 'HT-2026-005-001', approvalNo: 'LX-2026-005', contractNo: 'HT-2026-005',
    changeDesc: '原料场智能化设备型号升级，追加投资', changeType: '追加减', status: '已通过',
    changeUnit: '能源环保部', changeAmount: 280000,
    applicant: '吴志强', applyDate: '2026-05-01', approver: '王志强', approveDate: '2026-05-10',
    taxDetails: [
      { id: 'td-ac4-1', taxType: 'B设备', taxItem: '1计算印花税', taxRate: '增值税专用发票(13%)', amountWithTax: 200000, selected: true },
      { id: 'td-ac4-2', taxType: 'A建安', taxItem: '1计算印花税', taxRate: '增值税专用发票(9%)', amountWithTax: 80000, selected: true },
    ],
    budgetAllocations: generateBudgetAllocations(),
  },
  {
    id: 'ac-005', contractId: 'cd-007', budgetApplyNo: 'HT-2026-007-001', approvalNo: 'LX-2026-007', contractNo: 'HT-2026-007',
    changeDesc: '余热锅炉增加脱硝装置', changeType: '追加减', status: '暂存',
    changeUnit: '能源环保部', changeAmount: 180000,
    applicant: '蒋伟', applyDate: '2026-05-20', approver: '', approveDate: '',
    taxDetails: generateTaxDetails().map((t, i) => ({ ...t, amountWithTax: i === 0 ? 180000 : 0 })),
    budgetAllocations: generateBudgetAllocations(),
  },
  {
    id: 'ac-006', contractId: 'cd-011', budgetApplyNo: 'HT-2026-011-001', approvalNo: 'LX-2026-011', contractNo: 'HT-2026-011',
    changeDesc: '道路管网改造增加雨水收集系统', changeType: '追加减', status: '已退回',
    changeUnit: '基建部', changeAmount: 220000,
    applicant: '朱明', applyDate: '2026-05-25', approver: '王志强', approveDate: '2026-05-28',
    taxDetails: [
      { id: 'td-ac6-1', taxType: 'A建安', taxItem: '1计算印花税', taxRate: '增值税专用发票(9%)', amountWithTax: 220000, selected: true },
    ],
    budgetAllocations: generateBudgetAllocations(),
  },
];

export const materialChangeRecords: MaterialChangeRecord[] = [
  {
    id: 'mc-001', contractId: 'cd-001', controlRecordNo: 'JG-2026-001', approvalNo: 'LX-2026-001', contractNo: 'HT-2026-001',
    changeDesc: '甲供高炉耐材增加高铝砖用量', changeType: '订约', status: '已通过',
    changeUnit: 'ERP系统-炼铁事业部', changeAmount: 120000,
    applicant: '张明远', applyDate: '2026-03-20', approver: '王志强', approveDate: '2026-03-25',
    creator: '张明远', createDate: '2026-03-20 14:00:00', modifier: '', modifyDate: '',
    budgetAllocations: generateBudgetAllocations(),
  },
  {
    id: 'mc-002', contractId: 'cd-001', controlRecordNo: 'JG-2026-002', approvalNo: 'LX-2026-001', contractNo: 'HT-2026-001',
    changeDesc: '钢材价格波动，调减甲供材金额', changeType: '追加减', status: '审批中',
    changeUnit: 'ERP系统-炼铁事业部', changeAmount: -35000,
    applicant: '李建国', applyDate: '2026-05-15', approver: '', approveDate: '',
    creator: '李建国', createDate: '2026-05-15 09:30:00', modifier: '', modifyDate: '',
    budgetAllocations: generateBudgetAllocations(),
  },
  {
    id: 'mc-003', contractId: 'cd-007', controlRecordNo: 'JG-2026-003', approvalNo: 'LX-2026-007', contractNo: 'HT-2026-007',
    changeDesc: '锅炉安装甲供钢管追加', changeType: '追加减', status: '暂存',
    changeUnit: 'ERP系统-能源环保部', changeAmount: 85000,
    applicant: '蒋伟', applyDate: '2026-05-22', approver: '', approveDate: '',
    creator: '蒋伟', createDate: '2026-05-22 10:15:00', modifier: '', modifyDate: '',
    budgetAllocations: generateBudgetAllocations(),
  },
  {
    id: 'mc-004', contractId: 'cd-011', controlRecordNo: 'JG-2026-004', approvalNo: 'LX-2026-011', contractNo: 'HT-2026-011',
    changeDesc: '甲供沥青材料追加', changeType: '订约', status: '已退回',
    changeUnit: 'ERP系统-基建部', changeAmount: 150000,
    applicant: '朱明', applyDate: '2026-05-28', approver: '王志强', approveDate: '2026-05-30',
    creator: '朱明', createDate: '2026-05-28 08:45:00', modifier: '', modifyDate: '',
    budgetAllocations: generateBudgetAllocations(),
  },
];

export function getContractDocumentById(id: string): ContractDocument | undefined {
  return contractDocuments.find((c) => c.id === id);
}

export function getAmountChangesByContract(contractId: string): AmountChangeRecord[] {
  return amountChangeRecords.filter((r) => r.contractId === contractId);
}

export function getAmountChangeById(id: string): AmountChangeRecord | undefined {
  return amountChangeRecords.find((r) => r.id === id);
}

export function getMaterialChangesByContract(contractId: string): MaterialChangeRecord[] {
  return materialChangeRecords.filter((r) => r.contractId === contractId);
}

export function getMaterialChangeById(id: string): MaterialChangeRecord | undefined {
  return materialChangeRecords.find((r) => r.id === id);
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return '0.00';
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPercent(val: number): string {
  return val.toFixed(2);
}