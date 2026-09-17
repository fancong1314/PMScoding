export interface PayContract {
  id: string;
  projectNo: string;
  contractNo: string;
  contractName: string;
  contractorNo: string;
  mainContent: string;
  signingDate: string;
  prepayPct: number;
  warrantyPct: number;
  payRatioPct: number;
  adjustedAmount: number;
  status: string;
  type: string;
}

export interface PayDeclaration {
  id: string;
  contractId: string;
  appNo: string;
  workContent: string;
  reductionAmount: number;
  payType: string;
  contractAmount: number;
  declareDate: string;
  nextReviewer: string;
  status: string;
  stage: 'project' | 'supervisory' | 'finance';
  // detail fields
  projectNo: string;
  contractNo: string;
  contractName: string;
  contractorName: string;
  contractSignDate: string;
  planStartDate: string;
  planEndDate: string;
  actualStartDate: string;
  actualEndDate: string;
  projectManager: string;
  declareDept: string;
  projectDept: string;
  totalWorkAmount: number;
  accumulatedDeclared: number;
  accumulatedApproved: number;
  thisDeclareAmount: number;
  prepayDeduct: number;
  warrantyDeduct: number;
  materialDeduct: number;
  otherDeduct: number;
  actualPayAmount: number;
  declareReason: string;
  attachmentFiles: string[];
  projectReviewOpinion: string;
  supervisoryReviewOpinion: string;
  financeReviewOpinion: string;
  creator: string;
  createTime: string;
  modifier: string;
  modifyTime: string;
}

export interface PayApprovalRecord {
  id: string;
  declarationId: string;
  stage: string;
  operation: string;
  opinion: string;
  operator: string;
  operateDate: string;
  operateTime: string;
}

export function formatCurrency(val: number): string {
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const contractStatusOptions = [
  { value: '', label: '请选择...' },
  { value: '执行中', label: '执行中' },
  { value: '已完工', label: '已完工' },
  { value: '已结算', label: '已结算' },
  { value: '已关闭', label: '已关闭' },
];

export const contractTypeOptions = [
  { value: '', label: '请选择...' },
  { value: '工程总承包', label: '工程总承包' },
  { value: '施工分包', label: '施工分包' },
  { value: '设备采购', label: '设备采购' },
  { value: '技术服务', label: '技术服务' },
  { value: '工程监理', label: '工程监理' },
];

export const payTypeOptions = ['预付款', '进度款', '结算款', '质保金'];

export const allPayContracts: PayContract[] = [
  { id: 'pc-1', projectNo: 'LX-2025-0001', contractNo: 'HT-2025-001', contractName: '高炉营缮工程主体施工合同', contractorNo: 'CBS-1001', mainContent: '高炉本体大修、热风炉改造、除尘系统升级', signingDate: '2025-02-15', prepayPct: 20, warrantyPct: 5, payRatioPct: 95, adjustedAmount: 28500000, status: '执行中', type: '工程总承包' },
  { id: 'pc-2', projectNo: 'LX-2025-0002', contractNo: 'HT-2025-002', contractName: '炼钢车间连铸机安装合同', contractorNo: 'CBS-1002', mainContent: '连铸机设备安装调试及配套设施建设', signingDate: '2025-03-01', prepayPct: 15, warrantyPct: 5, payRatioPct: 90, adjustedAmount: 19600000, status: '执行中', type: '设备采购' },
  { id: 'pc-3', projectNo: 'LX-2025-0003', contractNo: 'HT-2025-003', contractName: '全厂管网改造工程合同', contractorNo: 'CBS-1003', mainContent: '给排水管网、燃气管网、蒸汽管网综合改造', signingDate: '2025-01-20', prepayPct: 20, warrantyPct: 5, payRatioPct: 95, adjustedAmount: 42200000, status: '执行中', type: '工程总承包' },
  { id: 'pc-4', projectNo: 'LX-2025-0004', contractNo: 'HT-2025-004', contractName: '加热炉改造工程施工分包合同', contractorNo: 'CBS-1004', mainContent: '加热炉本体改造、燃烧系统升级、余热回收装置安装', signingDate: '2025-04-10', prepayPct: 15, warrantyPct: 5, payRatioPct: 90, adjustedAmount: 8750000, status: '执行中', type: '施工分包' },
  { id: 'pc-5', projectNo: 'LX-2025-0005', contractNo: 'HT-2025-005', contractName: '水处理系统扩建工程合同', contractorNo: 'CBS-1005', mainContent: '循环水处理站扩建、工业废水处理系统新建', signingDate: '2025-03-20', prepayPct: 20, warrantyPct: 5, payRatioPct: 92, adjustedAmount: 15800000, status: '执行中', type: '工程总承包' },
  { id: 'pc-6', projectNo: 'LX-2025-0006', contractNo: 'HT-2025-006', contractName: '高炉喷煤改造技术服务合同', contractorNo: 'CBS-1006', mainContent: '喷煤工艺优化设计、自动化控制系统调试、PLC编程服务', signingDate: '2025-05-05', prepayPct: 25, warrantyPct: 5, payRatioPct: 95, adjustedAmount: 6800000, status: '执行中', type: '技术服务' },
  { id: 'pc-7', projectNo: 'LX-2025-0007', contractNo: 'HT-2025-007', contractName: '厂区道路及排水工程合同', contractorNo: 'CBS-1007', mainContent: '厂区主干道路面翻新、排水沟渠改造、护坡挡墙砌筑', signingDate: '2025-06-01', prepayPct: 20, warrantyPct: 5, payRatioPct: 92, adjustedAmount: 5200000, status: '执行中', type: '施工分包' },
  { id: 'pc-8', projectNo: 'LX-2025-0008', contractNo: 'HT-2025-008', contractName: '转炉烟气净化系统采购合同', contractorNo: 'CBS-1002', mainContent: '转炉二次除尘系统设备采购与安装调试', signingDate: '2025-04-25', prepayPct: 30, warrantyPct: 10, payRatioPct: 90, adjustedAmount: 12300000, status: '执行中', type: '设备采购' },
  { id: 'pc-9', projectNo: 'LX-2025-0009', contractNo: 'HT-2025-009', contractName: '炼铁厂原料场封闭改造合同', contractorNo: 'CBS-1001', mainContent: '原料场大棚封闭、抑尘系统安装、输送皮带封闭', signingDate: '2025-05-15', prepayPct: 20, warrantyPct: 5, payRatioPct: 95, adjustedAmount: 34600000, status: '执行中', type: '工程总承包' },
  { id: 'pc-10', projectNo: 'LX-2025-0010', contractNo: 'HT-2025-010', contractName: '工程监理服务合同', contractorNo: 'CBS-1008', mainContent: '全厂技改项目全过程工程监理服务', signingDate: '2025-01-10', prepayPct: 10, warrantyPct: 5, payRatioPct: 90, adjustedAmount: 4200000, status: '执行中', type: '工程监理' },
  { id: 'pc-11', projectNo: 'LX-2025-0011', contractNo: 'HT-2025-011', contractName: '轧钢生产线改造工程合同', contractorNo: 'CBS-1009', mainContent: '轧钢机改造、精整线升级、自动化控制系统更新', signingDate: '2025-07-01', prepayPct: 20, warrantyPct: 5, payRatioPct: 95, adjustedAmount: 38900000, status: '执行中', type: '工程总承包' },
  { id: 'pc-12', projectNo: 'LX-2025-0012', contractNo: 'HT-2025-012', contractName: '供配电系统扩容施工合同', contractorNo: 'CBS-1010', mainContent: '变电站扩容、高压电缆敷设、配电柜安装', signingDate: '2025-06-15', prepayPct: 15, warrantyPct: 5, payRatioPct: 90, adjustedAmount: 9650000, status: '执行中', type: '施工分包' },
];

export const allPayDeclarations: PayDeclaration[] = [
  // === 项目部呈核 (4条) ===
  { id: 'pd-1', contractId: 'pc-1', appNo: 'GCK-2025-001', workContent: '高炉本体拆除完成60%，热风炉基础浇筑完成', reductionAmount: 0, payType: '进度款', contractAmount: 28500000, declareDate: '2025-06-01', nextReviewer: '李志强', status: '待项目部审核', stage: 'project', projectNo: 'LX-2025-0001', contractNo: 'HT-2025-001', contractName: '高炉营缮工程主体施工合同', contractorName: '中冶南方工程技术有限公司', contractSignDate: '2025-02-15', planStartDate: '2025-02-20', planEndDate: '2025-12-31', actualStartDate: '2025-02-22', actualEndDate: '', projectManager: '王志刚', declareDept: '工程项目部', projectDept: '炼铁事业部', totalWorkAmount: 28500000, accumulatedDeclared: 8550000, accumulatedApproved: 5700000, thisDeclareAmount: 2850000, prepayDeduct: 570000, warrantyDeduct: 142500, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 2137500, declareReason: '按合同约定及工程进度，累计完成合同总额的30%，申请支付本期进度款', attachmentFiles: ['进度确认单.pdf', '已完工程量清单.xlsx', '现场施工照片.zip'], projectReviewOpinion: '', supervisoryReviewOpinion: '', financeReviewOpinion: '', creator: '王志刚', createTime: '2025-06-01 09:30:00', modifier: '', modifyTime: '' },
  { id: 'pd-2', contractId: 'pc-3', appNo: 'GCK-2025-003', workContent: '给排水管线铺设完成80%，燃气管网焊接完成70%', reductionAmount: 0, payType: '进度款', contractAmount: 42200000, declareDate: '2025-05-28', nextReviewer: '赵明辉', status: '待项目部审核', stage: 'project', projectNo: 'LX-2025-0003', contractNo: 'HT-2025-003', contractName: '全厂管网改造工程合同', contractorName: '中国二十冶集团有限公司', contractSignDate: '2025-01-20', planStartDate: '2025-02-01', planEndDate: '2025-11-30', actualStartDate: '2025-02-05', actualEndDate: '', projectManager: '张志远', declareDept: '工程项目部', projectDept: '动力事业部', totalWorkAmount: 42200000, accumulatedDeclared: 12660000, accumulatedApproved: 8440000, thisDeclareAmount: 4220000, prepayDeduct: 844000, warrantyDeduct: 211000, materialDeduct: 1050000, otherDeduct: 0, actualPayAmount: 2115000, declareReason: '管线工程进展顺利，按合同约定申请支付本期进度款', attachmentFiles: ['管线验收记录.pdf', '焊口检测报告.xlsx'], projectReviewOpinion: '', supervisoryReviewOpinion: '', financeReviewOpinion: '', creator: '张志远', createTime: '2025-05-28 14:15:00', modifier: '', modifyTime: '' },
  { id: 'pd-3', contractId: 'pc-5', appNo: 'GCK-2025-005', workContent: '循环水站主体结构封顶，设备基础施工完成', reductionAmount: 0, payType: '进度款', contractAmount: 15800000, declareDate: '2025-06-05', nextReviewer: '李志强', status: '待项目部审核', stage: 'project', projectNo: 'LX-2025-0005', contractNo: 'HT-2025-005', contractName: '水处理系统扩建工程合同', contractorName: '中节能工程技术有限公司', contractSignDate: '2025-03-20', planStartDate: '2025-04-01', planEndDate: '2025-10-31', actualStartDate: '2025-04-02', actualEndDate: '', projectManager: '陈国栋', declareDept: '工程项目部', projectDept: '动力事业部', totalWorkAmount: 15800000, accumulatedDeclared: 4740000, accumulatedApproved: 3160000, thisDeclareAmount: 1580000, prepayDeduct: 316000, warrantyDeduct: 79000, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 1185000, declareReason: '主体结构已封顶，累计完成合同总额的30%，申请本期进度款', attachmentFiles: ['结构验收记录.pdf', '隐蔽工程记录.xlsx'], projectReviewOpinion: '', supervisoryReviewOpinion: '', financeReviewOpinion: '', creator: '陈国栋', createTime: '2025-06-05 10:45:00', modifier: '', modifyTime: '' },
  { id: 'pd-4', contractId: 'pc-9', appNo: 'GCK-2025-009', workContent: '原料场大棚钢结构安装完成50%，基础施工全部完成', reductionAmount: 0, payType: '进度款', contractAmount: 34600000, declareDate: '2025-06-08', nextReviewer: '赵明辉', status: '待项目部审核', stage: 'project', projectNo: 'LX-2025-0009', contractNo: 'HT-2025-009', contractName: '炼铁厂原料场封闭改造合同', contractorName: '中冶南方工程技术有限公司', contractSignDate: '2025-05-15', planStartDate: '2025-05-20', planEndDate: '2026-03-31', actualStartDate: '2025-05-22', actualEndDate: '', projectManager: '王建国', declareDept: '工程项目部', projectDept: '炼铁事业部', totalWorkAmount: 34600000, accumulatedDeclared: 6920000, accumulatedApproved: 3460000, thisDeclareAmount: 3460000, prepayDeduct: 692000, warrantyDeduct: 173000, materialDeduct: 0, otherDeduct: 200000, actualPayAmount: 2395000, declareReason: '钢结构安装顺利推进，累计完成合同总额的20%，申请本期进度款', attachmentFiles: ['钢结构验收记录.pdf', '基础验收记录.xlsx', '施工进度照片.zip'], projectReviewOpinion: '', supervisoryReviewOpinion: '', financeReviewOpinion: '', creator: '王建国', createTime: '2025-06-08 08:30:00', modifier: '', modifyTime: '' },
  // === 主管部门呈核 (5条) ===
  { id: 'pd-5', contractId: 'pc-1', appNo: 'GCK-2025-001', workContent: '高炉本体拆除完成60%，热风炉基础浇筑完成', reductionAmount: 0, payType: '进度款', contractAmount: 28500000, declareDate: '2025-06-01', nextReviewer: '钱永刚', status: '待主管部门审核', stage: 'supervisory', projectNo: 'LX-2025-0001', contractNo: 'HT-2025-001', contractName: '高炉营缮工程主体施工合同', contractorName: '中冶南方工程技术有限公司', contractSignDate: '2025-02-15', planStartDate: '2025-02-20', planEndDate: '2025-12-31', actualStartDate: '2025-02-22', actualEndDate: '', projectManager: '王志刚', declareDept: '工程项目部', projectDept: '炼铁事业部', totalWorkAmount: 28500000, accumulatedDeclared: 8550000, accumulatedApproved: 5700000, thisDeclareAmount: 2850000, prepayDeduct: 570000, warrantyDeduct: 142500, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 2137500, declareReason: '按合同约定及工程进度，累计完成合同总额的30%，申请支付本期进度款', attachmentFiles: ['进度确认单.pdf', '已完工程量清单.xlsx'], projectReviewOpinion: '经项目部现场核实，工程进度属实，同意申报', supervisoryReviewOpinion: '', financeReviewOpinion: '', creator: '王志刚', createTime: '2025-06-01 09:30:00', modifier: '李志强', modifyTime: '2025-06-03 16:20:00' },
  { id: 'pd-6', contractId: 'pc-2', appNo: 'GCK-2025-002', workContent: '连铸机主体设备安装完成，电气系统开始接线', reductionAmount: 80000, payType: '进度款', contractAmount: 19600000, declareDate: '2025-05-20', nextReviewer: '钱永刚', status: '待主管部门审核', stage: 'supervisory', projectNo: 'LX-2025-0002', contractNo: 'HT-2025-002', contractName: '炼钢车间连铸机安装合同', contractorName: '中冶京诚工程技术有限公司', contractSignDate: '2025-03-01', planStartDate: '2025-03-15', planEndDate: '2025-09-30', actualStartDate: '2025-03-18', actualEndDate: '', projectManager: '刘建民', declareDept: '工程项目部', projectDept: '炼钢事业部', totalWorkAmount: 19600000, accumulatedDeclared: 5880000, accumulatedApproved: 3920000, thisDeclareAmount: 1960000, prepayDeduct: 294000, warrantyDeduct: 98000, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 1568000, declareReason: '连铸机安装进展顺利，累计完成合同总额的30%', attachmentFiles: ['设备安装验收单.pdf', '电气安装方案.docx'], projectReviewOpinion: '设备安装质量符合要求，同意申报', supervisoryReviewOpinion: '', financeReviewOpinion: '', creator: '刘建民', createTime: '2025-05-20 11:00:00', modifier: '赵明辉', modifyTime: '2025-05-22 09:15:00' },
  { id: 'pd-7', contractId: 'pc-3', appNo: 'GCK-2025-003', workContent: '给排水管线铺设完成80%，燃气管网焊接完成70%', reductionAmount: 450000, payType: '进度款', contractAmount: 42200000, declareDate: '2025-05-28', nextReviewer: '钱永刚', status: '待主管部门审核', stage: 'supervisory', projectNo: 'LX-2025-0003', contractNo: 'HT-2025-003', contractName: '全厂管网改造工程合同', contractorName: '中国二十冶集团有限公司', contractSignDate: '2025-01-20', planStartDate: '2025-02-01', planEndDate: '2025-11-30', actualStartDate: '2025-02-05', actualEndDate: '', projectManager: '张志远', declareDept: '工程项目部', projectDept: '动力事业部', totalWorkAmount: 42200000, accumulatedDeclared: 12660000, accumulatedApproved: 8440000, thisDeclareAmount: 3770000, prepayDeduct: 754000, warrantyDeduct: 188500, materialDeduct: 1050000, otherDeduct: 0, actualPayAmount: 1777500, declareReason: '管线工程进展顺利，项目部核减45万后按合同约定申报', attachmentFiles: ['管线验收记录.pdf', '焊口检测报告.xlsx'], projectReviewOpinion: '燃气管网部分焊口需整改，核减45万元后同意申报', supervisoryReviewOpinion: '', financeReviewOpinion: '', creator: '张志远', createTime: '2025-05-28 14:15:00', modifier: '李志强', modifyTime: '2025-06-01 10:30:00' },
  { id: 'pd-8', contractId: 'pc-4', appNo: 'GCK-2025-004', workContent: '加热炉燃烧系统改造完成，控制系统调试中', reductionAmount: 0, payType: '进度款', contractAmount: 8750000, declareDate: '2025-06-03', nextReviewer: '钱永刚', status: '待主管部门审核', stage: 'supervisory', projectNo: 'LX-2025-0004', contractNo: 'HT-2025-004', contractName: '加热炉改造工程施工分包合同', contractorName: '中冶宝钢技术服务有限公司', contractSignDate: '2025-04-10', planStartDate: '2025-04-15', planEndDate: '2025-08-31', actualStartDate: '2025-04-16', actualEndDate: '', projectManager: '孙建国', declareDept: '工程项目部', projectDept: '轧钢事业部', totalWorkAmount: 8750000, accumulatedDeclared: 2625000, accumulatedApproved: 1750000, thisDeclareAmount: 875000, prepayDeduct: 131250, warrantyDeduct: 43750, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 700000, declareReason: '加热炉施工按计划推进，累计完成合同总额的30%', attachmentFiles: ['改造验收记录.pdf', '调试方案.docx'], projectReviewOpinion: '施工质量合格，同意申报', supervisoryReviewOpinion: '', financeReviewOpinion: '', creator: '孙建国', createTime: '2025-06-03 13:30:00', modifier: '赵明辉', modifyTime: '2025-06-04 15:00:00' },
  { id: 'pd-9', contractId: 'pc-6', appNo: 'GCK-2025-006', workContent: '喷煤自动化控制系统编程完成，现场调试完成50%', reductionAmount: 0, payType: '进度款', contractAmount: 6800000, declareDate: '2025-06-06', nextReviewer: '钱永刚', status: '待主管部门审核', stage: 'supervisory', projectNo: 'LX-2025-0006', contractNo: 'HT-2025-006', contractName: '高炉喷煤改造技术服务合同', contractorName: '中冶赛迪工程技术股份有限公司', contractSignDate: '2025-05-05', planStartDate: '2025-05-10', planEndDate: '2025-11-30', actualStartDate: '2025-05-12', actualEndDate: '', projectManager: '黄志远', declareDept: '工程项目部', projectDept: '炼铁事业部', totalWorkAmount: 6800000, accumulatedDeclared: 1700000, accumulatedApproved: 1700000, thisDeclareAmount: 1700000, prepayDeduct: 425000, warrantyDeduct: 85000, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 1190000, declareReason: '技术服务工作按合同节点完成，申请支付本期费用', attachmentFiles: ['技术服务确认单.pdf', '调试记录.xlsx'], projectReviewOpinion: '技术服务工作质量达标，同意申报', supervisoryReviewOpinion: '', financeReviewOpinion: '', creator: '黄志远', createTime: '2025-06-06 09:00:00', modifier: '李志强', modifyTime: '2025-06-07 14:30:00' },
  // === 财务部呈核 (5条) ===
  { id: 'pd-10', contractId: 'pc-1', appNo: 'GCK-2025-001', workContent: '高炉本体拆除完成60%，热风炉基础浇筑完成', reductionAmount: 0, payType: '进度款', contractAmount: 28500000, declareDate: '2025-06-01', nextReviewer: '孙丽华', status: '待财务审核', stage: 'finance', projectNo: 'LX-2025-0001', contractNo: 'HT-2025-001', contractName: '高炉营缮工程主体施工合同', contractorName: '中冶南方工程技术有限公司', contractSignDate: '2025-02-15', planStartDate: '2025-02-20', planEndDate: '2025-12-31', actualStartDate: '2025-02-22', actualEndDate: '', projectManager: '王志刚', declareDept: '工程项目部', projectDept: '炼铁事业部', totalWorkAmount: 28500000, accumulatedDeclared: 8550000, accumulatedApproved: 5700000, thisDeclareAmount: 2850000, prepayDeduct: 570000, warrantyDeduct: 142500, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 2137500, declareReason: '按合同约定及工程进度，累计完成合同总额的30%，申请支付本期进度款', attachmentFiles: ['进度确认单.pdf', '已完工程量清单.xlsx', '现场施工照片.zip'], projectReviewOpinion: '经项目部现场核实，工程进度属实，同意申报', supervisoryReviewOpinion: '主管部门审核通过，工程量和付款比例符合合同约定', financeReviewOpinion: '', creator: '王志刚', createTime: '2025-06-01 09:30:00', modifier: '钱永刚', modifyTime: '2025-06-04 10:00:00' },
  { id: 'pd-11', contractId: 'pc-2', appNo: 'GCK-2025-002', workContent: '连铸机主体设备安装完成，电气系统开始接线', reductionAmount: 80000, payType: '进度款', contractAmount: 19600000, declareDate: '2025-05-20', nextReviewer: '孙丽华', status: '待财务审核', stage: 'finance', projectNo: 'LX-2025-0002', contractNo: 'HT-2025-002', contractName: '炼钢车间连铸机安装合同', contractorName: '中冶京诚工程技术有限公司', contractSignDate: '2025-03-01', planStartDate: '2025-03-15', planEndDate: '2025-09-30', actualStartDate: '2025-03-18', actualEndDate: '', projectManager: '刘建民', declareDept: '工程项目部', projectDept: '炼钢事业部', totalWorkAmount: 19600000, accumulatedDeclared: 5880000, accumulatedApproved: 3920000, thisDeclareAmount: 1880000, prepayDeduct: 294000, warrantyDeduct: 98000, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 1488000, declareReason: '连铸机安装进展顺利，累计完成合同总额的30%', attachmentFiles: ['设备安装验收单.pdf'], projectReviewOpinion: '设备安装质量符合要求，同意申报', supervisoryReviewOpinion: '审核通过，核减8万元后同意', financeReviewOpinion: '', creator: '刘建民', createTime: '2025-05-20 11:00:00', modifier: '钱永刚', modifyTime: '2025-06-02 15:20:00' },
  { id: 'pd-12', contractId: 'pc-5', appNo: 'GCK-2025-005', workContent: '循环水站主体结构封顶，设备基础施工完成', reductionAmount: 0, payType: '进度款', contractAmount: 15800000, declareDate: '2025-06-05', nextReviewer: '孙丽华', status: '待财务审核', stage: 'finance', projectNo: 'LX-2025-0005', contractNo: 'HT-2025-005', contractName: '水处理系统扩建工程合同', contractorName: '中节能工程技术有限公司', contractSignDate: '2025-03-20', planStartDate: '2025-04-01', planEndDate: '2025-10-31', actualStartDate: '2025-04-02', actualEndDate: '', projectManager: '陈国栋', declareDept: '工程项目部', projectDept: '动力事业部', totalWorkAmount: 15800000, accumulatedDeclared: 4740000, accumulatedApproved: 3160000, thisDeclareAmount: 1580000, prepayDeduct: 316000, warrantyDeduct: 79000, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 1185000, declareReason: '主体结构已封顶，累计完成合同总额的30%', attachmentFiles: ['结构验收记录.pdf', '隐蔽工程记录.xlsx'], projectReviewOpinion: '施工进度属实，同意申报', supervisoryReviewOpinion: '审核通过', financeReviewOpinion: '', creator: '陈国栋', createTime: '2025-06-05 10:45:00', modifier: '钱永刚', modifyTime: '2025-06-07 09:40:00' },
  { id: 'pd-13', contractId: 'pc-3', appNo: 'GCK-2025-003', workContent: '给排水管线铺设完成80%，燃气管网焊接完成70%', reductionAmount: 450000, payType: '进度款', contractAmount: 42200000, declareDate: '2025-05-28', nextReviewer: '孙丽华', status: '待财务审核', stage: 'finance', projectNo: 'LX-2025-0003', contractNo: 'HT-2025-003', contractName: '全厂管网改造工程合同', contractorName: '中国二十冶集团有限公司', contractSignDate: '2025-01-20', planStartDate: '2025-02-01', planEndDate: '2025-11-30', actualStartDate: '2025-02-05', actualEndDate: '', projectManager: '张志远', declareDept: '工程项目部', projectDept: '动力事业部', totalWorkAmount: 42200000, accumulatedDeclared: 12660000, accumulatedApproved: 8440000, thisDeclareAmount: 3770000, prepayDeduct: 754000, warrantyDeduct: 188500, materialDeduct: 1050000, otherDeduct: 0, actualPayAmount: 1777500, declareReason: '管线工程进展顺利，项目部核减45万后按合同约定申报', attachmentFiles: ['管线验收记录.pdf', '焊口检测报告.xlsx'], projectReviewOpinion: '燃气管网部分焊口需整改，核减45万元后同意申报', supervisoryReviewOpinion: '核减合理，审核通过', financeReviewOpinion: '', creator: '张志远', createTime: '2025-05-28 14:15:00', modifier: '钱永刚', modifyTime: '2025-06-03 11:15:00' },
  { id: 'pd-14', contractId: 'pc-8', appNo: 'GCK-2025-008', workContent: '转炉二次除尘设备到货验收完成，安装准备工作就绪', reductionAmount: 0, payType: '预付款', contractAmount: 12300000, declareDate: '2025-06-02', nextReviewer: '孙丽华', status: '待财务审核', stage: 'finance', projectNo: 'LX-2025-0008', contractNo: 'HT-2025-008', contractName: '转炉烟气净化系统采购合同', contractorName: '中冶京诚工程技术有限公司', contractSignDate: '2025-04-25', planStartDate: '2025-05-01', planEndDate: '2025-12-31', actualStartDate: '2025-05-03', actualEndDate: '', projectManager: '赵建国', declareDept: '工程项目部', projectDept: '炼钢事业部', totalWorkAmount: 12300000, accumulatedDeclared: 3690000, accumulatedApproved: 0, thisDeclareAmount: 3690000, prepayDeduct: 0, warrantyDeduct: 0, materialDeduct: 0, otherDeduct: 0, actualPayAmount: 3690000, declareReason: '设备已到货并验收合格，按合同约定申请支付30%预付款', attachmentFiles: ['设备到货验收单.pdf', '装箱清单.xlsx'], projectReviewOpinion: '设备到货验收合格，同意申报', supervisoryReviewOpinion: '审核通过', financeReviewOpinion: '', creator: '赵建国', createTime: '2025-06-02 14:00:00', modifier: '钱永刚', modifyTime: '2025-06-06 16:30:00' },
];

export const allPayApprovalRecords: PayApprovalRecord[] = [
  // pd-1 审批记录
  { id: 'par-1', declarationId: 'pd-1', stage: '项目部审核', operation: '提交', opinion: '按合同约定及工程进度申请支付进度款', operator: '王志刚', operateDate: '2025-06-01', operateTime: '09:30:00' },
  { id: 'par-2', declarationId: 'pd-1', stage: '项目部审核', operation: '退回修改', opinion: '请补充热风炉基础浇筑的检测报告', operator: '李志强', operateDate: '2025-06-01', operateTime: '16:30:00' },
  { id: 'par-3', declarationId: 'pd-1', stage: '项目部审核', operation: '重新提交', opinion: '已补充检测报告，请审核', operator: '王志刚', operateDate: '2025-06-02', operateTime: '09:00:00' },
  { id: 'par-4', declarationId: 'pd-1', stage: '项目部审核', operation: '确认通过', opinion: '经项目部现场核实，工程进度属实，同意申报', operator: '李志强', operateDate: '2025-06-03', operateTime: '16:20:00' },
  { id: 'par-5', declarationId: 'pd-1', stage: '主管部门审核', operation: '呈核', opinion: '项目部已审核通过，提请主管部门审核', operator: '王志刚', operateDate: '2025-06-04', operateTime: '08:45:00' },
  // pd-5 继续
  { id: 'par-6', declarationId: 'pd-5', stage: '主管部门审核', operation: '审核通过', opinion: '主管部门审核通过，工程量和付款比例符合合同约定', operator: '钱永刚', operateDate: '2025-06-04', operateTime: '10:00:00' },
  { id: 'par-7', declarationId: 'pd-5', stage: '财务部审核', operation: '呈核', opinion: '提交财务部审核', operator: '钱永刚', operateDate: '2025-06-04', operateTime: '10:15:00' },
  // pd-2
  { id: 'par-8', declarationId: 'pd-2', stage: '项目部审核', operation: '提交', opinion: '排水管线铺设完成80%，申请支付进度款', operator: '张志远', operateDate: '2025-05-28', operateTime: '14:15:00' },
  { id: 'par-9', declarationId: 'pd-2', stage: '项目部审核', operation: '确认通过', opinion: '现场核查工程进度真实，同意申报', operator: '赵明辉', operateDate: '2025-05-30', operateTime: '11:00:00' },
  // pd-6
  { id: 'par-10', declarationId: 'pd-6', stage: '项目部审核', operation: '提交', opinion: '连铸机安装完成，申请进度款', operator: '刘建民', operateDate: '2025-05-20', operateTime: '11:00:00' },
  { id: 'par-11', declarationId: 'pd-6', stage: '项目部审核', operation: '确认通过', opinion: '设备安装质量符合要求，同意申报', operator: '赵明辉', operateDate: '2025-05-22', operateTime: '09:15:00' },
  { id: 'par-12', declarationId: 'pd-6', stage: '主管部门审核', operation: '呈核', opinion: '提请主管部门审核', operator: '刘建民', operateDate: '2025-05-23', operateTime: '08:30:00' },
  { id: 'par-13', declarationId: 'pd-6', stage: '主管部门审核', operation: '审核通过', opinion: '审核通过，核减8万元后同意', operator: '钱永刚', operateDate: '2025-06-02', operateTime: '15:20:00' },
  // pd-3
  { id: 'par-14', declarationId: 'pd-3', stage: '项目部审核', operation: '提交', opinion: '循环水站主体结构封顶', operator: '陈国栋', operateDate: '2025-06-05', operateTime: '10:45:00' },
  // pd-7
  { id: 'par-15', declarationId: 'pd-7', stage: '项目部审核', operation: '提交', opinion: '管线铺设完成80%', operator: '张志远', operateDate: '2025-05-28', operateTime: '14:15:00' },
  { id: 'par-16', declarationId: 'pd-7', stage: '项目部审核', operation: '确认通过', opinion: '燃气管网部分焊口需整改，核减45万元后同意申报', operator: '李志强', operateDate: '2025-06-01', operateTime: '10:30:00' },
  { id: 'par-17', declarationId: 'pd-7', stage: '主管部门审核', operation: '呈核', opinion: '提请主管部门审核', operator: '张志远', operateDate: '2025-06-02', operateTime: '09:00:00' },
  { id: 'par-18', declarationId: 'pd-7', stage: '主管部门审核', operation: '审核通过', opinion: '核减合理，审核通过', operator: '钱永刚', operateDate: '2025-06-03', operateTime: '11:15:00' },
  // pd-8
  { id: 'par-19', declarationId: 'pd-8', stage: '项目部审核', operation: '提交', opinion: '加热炉改造施工完成', operator: '孙建国', operateDate: '2025-06-03', operateTime: '13:30:00' },
  { id: 'par-20', declarationId: 'pd-8', stage: '项目部审核', operation: '确认通过', opinion: '施工质量合格，同意申报', operator: '赵明辉', operateDate: '2025-06-04', operateTime: '15:00:00' },
  // pd-9
  { id: 'par-21', declarationId: 'pd-9', stage: '项目部审核', operation: '提交', opinion: '自动化控制系统编程完成', operator: '黄志远', operateDate: '2025-06-06', operateTime: '09:00:00' },
  { id: 'par-22', declarationId: 'pd-9', stage: '项目部审核', operation: '确认通过', opinion: '技术服务工作质量达标，同意申报', operator: '李志强', operateDate: '2025-06-07', operateTime: '14:30:00' },
  { id: 'par-23', declarationId: 'pd-9', stage: '主管部门审核', operation: '呈核', opinion: '提请主管部门审核', operator: '黄志远', operateDate: '2025-06-08', operateTime: '09:30:00' },
  // pd-10
  { id: 'par-24', declarationId: 'pd-10', stage: '财务部审核', operation: '呈核', opinion: '提请财务部审核', operator: '钱永刚', operateDate: '2025-06-04', operateTime: '10:15:00' },
  // pd-11
  { id: 'par-25', declarationId: 'pd-11', stage: '财务部审核', operation: '呈核', opinion: '提请财务部审核', operator: '钱永刚', operateDate: '2025-06-02', operateTime: '15:30:00' },
  // pd-12
  { id: 'par-26', declarationId: 'pd-12', stage: '财务部审核', operation: '呈核', opinion: '提请财务部审核', operator: '钱永刚', operateDate: '2025-06-07', operateTime: '09:45:00' },
  // pd-13
  { id: 'par-27', declarationId: 'pd-13', stage: '财务部审核', operation: '呈核', opinion: '提请财务部审核', operator: '钱永刚', operateDate: '2025-06-03', operateTime: '11:20:00' },
  // pd-14
  { id: 'par-28', declarationId: 'pd-14', stage: '项目部审核', operation: '提交', opinion: '设备到货验收合格，申请预付款', operator: '赵建国', operateDate: '2025-06-02', operateTime: '14:00:00' },
  { id: 'par-29', declarationId: 'pd-14', stage: '项目部审核', operation: '确认通过', opinion: '设备到货验收合格，同意申报', operator: '李志强', operateDate: '2025-06-04', operateTime: '09:30:00' },
  { id: 'par-30', declarationId: 'pd-14', stage: '财务部审核', operation: '呈核', opinion: '提请财务部审核预付款', operator: '钱永刚', operateDate: '2025-06-06', operateTime: '16:35:00' },
];

export function getPayContractById(id: string): PayContract | undefined {
  return allPayContracts.find((c) => c.id === id);
}

export function getPayDeclarationsByContractId(contractId: string): PayDeclaration[] {
  return allPayDeclarations.filter((d) => d.contractId === contractId);
}

export function getPayDeclarationById(id: string): PayDeclaration | undefined {
  return allPayDeclarations.find((d) => d.id === id);
}

export function getPayApprovalRecords(declarationId: string): PayApprovalRecord[] {
  return allPayApprovalRecords.filter((r) => r.declarationId === declarationId);
}