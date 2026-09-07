export interface PostEvalProject {
  id: string;
  approvalNo: string;
  planNo: string;
  projectName: string;
  approvalDesc: string;
  projectType: string;
  approvalAmount: number;
  preApprovalAmount: number;
  actualApprovalAmount: number;
  approvalDate: string;
  ownerUnit: string;
  supervisorUnit: string;
  projectManager: string;
}

export interface EvalItem {
  id: string;
  projectId: string;
  seq: number;
  evalFunction: string;
  smsNotify1: string;
  smsNotify2: string;
  designatedPerson: string;
  actualOperator: string;
  needEval: string;
  evalType: string;
  shouldEndDate: string;
  systemSendDate: string;
  actualEndDate: string;
  draftDate: string;
  isDelayed: string;
  delayedTo: string;
  delayReason: string;
  evalStatus: string;
  operationLogs: OperationLog[];
  deferralRecords: DeferralRecord[];
}

export interface OperationLog {
  id: string;
  operationType: string;
  operator: string;
  operationTime: string;
  detail: string;
  beforeValue?: string;
  afterValue?: string;
}

export interface DeferralRecord {
  id: string;
  applicant: string;
  applyTime: string;
  originalEndDate: string;
  delayedTo: string;
  delayReason: string;
  approvalNodes: ApprovalNode[];
}

export interface ApprovalNode {
  seq: number;
  nodeName: string;
  reviewer: string;
  status: string;
  opinion: string;
  time: string;
}

export interface SelfEvalData {
  projectId: string;
  itemId: string;
  planContent: string;
  planAchievement: string;
  planDiff: string;
  planScore: number;
  qualityAccept: string;
  qualityRectify: string;
  qualityRectifyDetail: string;
  qualityEquipAccept: string;
  qualityHotTest: string;
  qualityScore: number;
  techTarget: string;
  techAchievement: string;
  techDiffRate: string;
  techScore: number;
  benefitEffect: string;
  benefitAchievement: string;
  benefitDiffRate: string;
  benefitScore: number;
  otherTarget: string;
  otherAchievement: string;
  otherDiffRate: string;
  otherScore: number;
  budgetCost: number;
  actualCost: number;
  costDiffRate: string;
  costScore: number;
  budgetDuration: string;
  actualDuration: string;
  durationDiffRate: string;
  durationScore: number;
  safetyStatus: string;
  smsNotify: string;
  evaluator: string;
  shouldEndTime: string;
  actualEvalTime: string;
  shouldConfirmTime: string;
  evalStatus: string;
  isDelay: string;
  delayDate: string;
  delayReason: string;
  approvalNodes: ApprovalNode[];
}

export interface ProfEvalData {
  projectId: string;
  itemId: string;
  planContent: string;
  profOpinion: string;
  argumentOpinion: string;
  instructionOpinion: string;
  declareBenefit: string;
  reviewBenefit: string;
  approvalNodes: ApprovalNode[];
}

export interface CompEvalData {
  projectId: string;
  itemId: string;
  planContent: string;
  planAchievement: string;
  planDiff: string;
  planScore: number;
  qualityAccept: string;
  qualityRectify: string;
  qualityRectifyDetail: string;
  qualityEquipAccept: string;
  qualityHotTest: string;
  qualityScore: number;
  techTarget: string;
  techAchievement: string;
  techDiffRate: string;
  techScore: number;
  benefitEffect: string;
  benefitAchievement: string;
  benefitDiffRate: string;
  benefitScore: number;
  otherTarget: string;
  otherAchievement: string;
  otherDiffRate: string;
  otherScore: number;
  budgetCost: number;
  actualCost: number;
  costDiffRate: string;
  costScore: number;
  budgetDuration: string;
  actualDuration: string;
  durationDiffRate: string;
  durationScore: number;
  safetyStatus: string;
  profOpinion: string;
  approvalNodes: ApprovalNode[];
}

// 项目列表数据
export const postEvalProjects: PostEvalProject[] = [
  { id: 'pe-001', approvalNo: 'LX-2023-002', planNo: 'JH-2023-002', projectName: '中厚板卷厂热处理线主厂房钢结构工程', approvalDesc: '新建热处理线主厂房钢结构及围护结构', projectType: '技改项目', approvalAmount: 31200000, preApprovalAmount: 30000000, actualApprovalAmount: 31200000, approvalDate: '2023-03-15', ownerUnit: '中厚板卷厂', supervisorUnit: '工程管理部', projectManager: '王志强' },
  { id: 'pe-002', approvalNo: 'LX-2023-008', planNo: 'JH-2023-008', projectName: '炼铁厂高炉喷煤系统改造工程', approvalDesc: '喷煤系统制粉、输送、喷吹全流程改造', projectType: '技改项目', approvalAmount: 45600000, preApprovalAmount: 44000000, actualApprovalAmount: 45600000, approvalDate: '2023-05-20', ownerUnit: '炼铁厂', supervisorUnit: '工程管理部', projectManager: '张建国' },
  { id: 'pe-003', approvalNo: 'LX-2023-015', planNo: 'JH-2023-015', projectName: '宽厚板厂新建3号加热炉工程', approvalDesc: '新建步进梁式加热炉含土建钢结构', projectType: '基建项目', approvalAmount: 89200000, preApprovalAmount: 86000000, actualApprovalAmount: 89200000, approvalDate: '2023-06-10', ownerUnit: '宽厚板厂', supervisorUnit: '工程管理部', projectManager: '赵永刚' },
  { id: 'pe-004', approvalNo: 'LX-2023-022', planNo: 'JH-2023-022', projectName: '烧结厂烟气循环利用改造', approvalDesc: '烧结机烟气循环利用系统建设', projectType: '环保项目', approvalAmount: 29800000, preApprovalAmount: 28000000, actualApprovalAmount: 29800000, approvalDate: '2023-08-18', ownerUnit: '烧结厂', supervisorUnit: '工程管理部', projectManager: '李卫东' },
  { id: 'pe-005', approvalNo: 'LX-2024-003', planNo: 'JH-2024-003', projectName: '炼钢厂转炉一次除尘系统改造', approvalDesc: '3座转炉一次除尘系统超低排放改造', projectType: '环保项目', approvalAmount: 67500000, preApprovalAmount: 65000000, actualApprovalAmount: 67500000, approvalDate: '2024-01-12', ownerUnit: '炼钢厂', supervisorUnit: '工程管理部', projectManager: '周建华' },
  { id: 'pe-006', approvalNo: 'LX-2024-007', planNo: 'JH-2024-007', projectName: '大棒厂精整线自动化改造', approvalDesc: '精整线自动探伤、修磨、打捆改造', projectType: '技改项目', approvalAmount: 23400000, preApprovalAmount: 22000000, actualApprovalAmount: 23400000, approvalDate: '2024-03-05', ownerUnit: '大棒厂', supervisorUnit: '工程管理部', projectManager: '吴国栋' },
  { id: 'pe-007', approvalNo: 'LX-2024-011', planNo: 'JH-2024-011', projectName: '能源中心110kV变电站智能化改造', approvalDesc: '变电所智能化改造含综自系统升级', projectType: '基建项目', approvalAmount: 41200000, preApprovalAmount: 40000000, actualApprovalAmount: 41200000, approvalDate: '2024-04-22', ownerUnit: '能源中心', supervisorUnit: '工程管理部', projectManager: '郑国梁' },
  { id: 'pe-008', approvalNo: 'LX-2024-016', planNo: 'JH-2024-016', projectName: '全厂工业水循环利用改造', approvalDesc: '工业水循环利用系统含管网改造', projectType: '环保项目', approvalAmount: 19800000, preApprovalAmount: 19000000, actualApprovalAmount: 19800000, approvalDate: '2024-06-08', ownerUnit: '能源中心', supervisorUnit: '工程管理部', projectManager: '黄明达' },
  { id: 'pe-009', approvalNo: 'LX-2024-019', planNo: 'JH-2024-019', projectName: '中厚板厂矫直机更新改造', approvalDesc: '矫直机更新含基础改造电气配套', projectType: '技改项目', approvalAmount: 52300000, preApprovalAmount: 50000000, actualApprovalAmount: 52300000, approvalDate: '2024-07-15', ownerUnit: '中厚板卷厂', supervisorUnit: '工程管理部', projectManager: '王志强' },
  { id: 'pe-010', approvalNo: 'LX-2024-025', planNo: 'JH-2024-025', projectName: '炼铁厂4号高炉炉顶设备更新', approvalDesc: '炉顶装料设备、均压系统、除尘系统更新', projectType: '技改项目', approvalAmount: 38800000, preApprovalAmount: 37000000, actualApprovalAmount: 38800000, approvalDate: '2024-09-01', ownerUnit: '炼铁厂', supervisorUnit: '工程管理部', projectManager: '马建国' },
  { id: 'pe-011', approvalNo: 'LX-2024-030', planNo: 'JH-2024-030', projectName: '宽厚板厂热处理炉群控改造', approvalDesc: '5座热处理炉群控系统及自动化改造', projectType: '信息化项目', approvalAmount: 16700000, preApprovalAmount: 16000000, actualApprovalAmount: 16700000, approvalDate: '2024-10-18', ownerUnit: '宽厚板厂', supervisorUnit: '工程管理部', projectManager: '赵永刚' },
  { id: 'pe-012', approvalNo: 'LX-2024-035', planNo: 'JH-2024-035', projectName: '炼钢厂RH精炼炉真空系统改造', approvalDesc: 'RH炉真空泵系统节能改造', projectType: '技改项目', approvalAmount: 25600000, preApprovalAmount: 24000000, actualApprovalAmount: 25600000, approvalDate: '2024-11-20', ownerUnit: '炼钢厂', supervisorUnit: '工程管理部', projectManager: '钱志宏' },
];

// 评价目录数据
export const evalItems: Record<string, EvalItem[]> = {
  'pe-001': [
    { id: 'ei-001-1', projectId: 'pe-001', seq: 1, evalFunction: '项目经理', smsNotify1: '王志强', smsNotify2: '张建国', designatedPerson: '王志强', actualOperator: '王志强', needEval: '是', evalType: '自评价', shouldEndDate: '2024-03-15', systemSendDate: '2024-02-15', actualEndDate: '2024-03-10', draftDate: '2024-02-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-001-2', projectId: 'pe-001', seq: 2, evalFunction: '环保评价', smsNotify1: '李卫东', smsNotify2: '陈明辉', designatedPerson: '李卫东', actualOperator: '李卫东', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-03-20', systemSendDate: '2024-02-15', actualEndDate: '2024-03-18', draftDate: '2024-02-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-001-3', projectId: 'pe-001', seq: 3, evalFunction: '安全评价', smsNotify1: '吴国栋', smsNotify2: '冯志伟', designatedPerson: '吴国栋', actualOperator: '吴国栋', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-03-20', systemSendDate: '2024-02-15', actualEndDate: '2024-03-15', draftDate: '2024-02-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-001-4', projectId: 'pe-001', seq: 4, evalFunction: '消防评价', smsNotify1: '马建国', smsNotify2: '周建华', designatedPerson: '马建国', actualOperator: '马建国', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-03-20', systemSendDate: '2024-02-15', actualEndDate: '2024-03-16', draftDate: '2024-02-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-001-5', projectId: 'pe-001', seq: 5, evalFunction: '节能评价', smsNotify1: '黄明达', smsNotify2: '郑国梁', designatedPerson: '黄明达', actualOperator: '黄明达', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-03-20', systemSendDate: '2024-02-15', actualEndDate: '2024-03-14', draftDate: '2024-02-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-001-6', projectId: 'pe-001', seq: 6, evalFunction: '经济效益评价', smsNotify1: '钱志宏', smsNotify2: '冯志伟', designatedPerson: '钱志宏', actualOperator: '钱志宏', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-03-25', systemSendDate: '2024-02-15', actualEndDate: '2024-03-22', draftDate: '2024-02-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-001-7', projectId: 'pe-001', seq: 7, evalFunction: '社会效益评价', smsNotify1: '王志强', smsNotify2: '', designatedPerson: '王志强', actualOperator: '王志强', needEval: '否', evalType: '综合评价', shouldEndDate: '', systemSendDate: '', actualEndDate: '', draftDate: '', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: 'N未参与评价', operationLogs: [], deferralRecords: [] },
  ],
  'pe-002': [
    { id: 'ei-002-1', projectId: 'pe-002', seq: 1, evalFunction: '项目经理', smsNotify1: '张建国', smsNotify2: '王志强', designatedPerson: '张建国', actualOperator: '张建国', needEval: '是', evalType: '自评价', shouldEndDate: '2024-06-20', systemSendDate: '2024-05-20', actualEndDate: '', draftDate: '2024-05-01', isDelayed: '是', delayedTo: '2024-07-20', delayReason: '项目部分设备调试未完成', evalStatus: '自评中', operationLogs: [], deferralRecords: [] },
    { id: 'ei-002-2', projectId: 'pe-002', seq: 2, evalFunction: '环保评价', smsNotify1: '陈明辉', smsNotify2: '李卫东', designatedPerson: '陈明辉', actualOperator: '', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-06-25', systemSendDate: '2024-05-20', actualEndDate: '', draftDate: '2024-05-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: 'N未参与评价', operationLogs: [], deferralRecords: [] },
    { id: 'ei-002-3', projectId: 'pe-002', seq: 3, evalFunction: '安全评价', smsNotify1: '吴国栋', smsNotify2: '', designatedPerson: '吴国栋', actualOperator: '', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-06-25', systemSendDate: '2024-05-20', actualEndDate: '', draftDate: '2024-05-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: 'N未参与评价', operationLogs: [], deferralRecords: [] },
    { id: 'ei-002-4', projectId: 'pe-002', seq: 4, evalFunction: '经济效益评价', smsNotify1: '钱志宏', smsNotify2: '周建华', designatedPerson: '钱志宏', actualOperator: '', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-06-30', systemSendDate: '2024-05-20', actualEndDate: '', draftDate: '2024-05-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: 'N未参与评价', operationLogs: [], deferralRecords: [] },
  ],
  'pe-003': [
    { id: 'ei-003-1', projectId: 'pe-003', seq: 1, evalFunction: '项目经理', smsNotify1: '赵永刚', smsNotify2: '王志强', designatedPerson: '赵永刚', actualOperator: '赵永刚', needEval: '是', evalType: '自评价', shouldEndDate: '2024-07-10', systemSendDate: '2024-06-10', actualEndDate: '2024-07-05', draftDate: '2024-06-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-003-2', projectId: 'pe-003', seq: 2, evalFunction: '环保评价', smsNotify1: '李卫东', smsNotify2: '陈明辉', designatedPerson: '李卫东', actualOperator: '李卫东', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-07-15', systemSendDate: '2024-06-10', actualEndDate: '2024-07-12', draftDate: '2024-06-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-003-3', projectId: 'pe-003', seq: 3, evalFunction: '节能评价', smsNotify1: '黄明达', smsNotify2: '郑国梁', designatedPerson: '黄明达', actualOperator: '黄明达', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-07-15', systemSendDate: '2024-06-10', actualEndDate: '', draftDate: '2024-06-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '专评中', operationLogs: [], deferralRecords: [] },
    { id: 'ei-003-4', projectId: 'pe-003', seq: 4, evalFunction: '社会效益评价', smsNotify1: '冯志伟', smsNotify2: '钱志宏', designatedPerson: '冯志伟', actualOperator: '', needEval: '是', evalType: '综合评价', shouldEndDate: '2024-07-20', systemSendDate: '2024-06-10', actualEndDate: '', draftDate: '2024-06-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: 'N未参与评价', operationLogs: [], deferralRecords: [] },
  ],
  'pe-004': [
    { id: 'ei-004-1', projectId: 'pe-004', seq: 1, evalFunction: '项目经理', smsNotify1: '李卫东', smsNotify2: '张建国', designatedPerson: '李卫东', actualOperator: '李卫东', needEval: '是', evalType: '自评价', shouldEndDate: '2024-09-18', systemSendDate: '2024-08-18', actualEndDate: '2024-09-10', draftDate: '2024-08-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-004-2', projectId: 'pe-004', seq: 2, evalFunction: '环保评价', smsNotify1: '马建国', smsNotify2: '', designatedPerson: '马建国', actualOperator: '马建国', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-09-20', systemSendDate: '2024-08-18', actualEndDate: '2024-09-18', draftDate: '2024-08-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-004-3', projectId: 'pe-004', seq: 3, evalFunction: '经济效益评价', smsNotify1: '周建华', smsNotify2: '钱志宏', designatedPerson: '周建华', actualOperator: '周建华', needEval: '是', evalType: '专业评价', shouldEndDate: '2024-09-25', systemSendDate: '2024-08-18', actualEndDate: '', draftDate: '2024-08-01', isDelayed: '是', delayedTo: '2024-10-25', delayReason: '财务数据尚未完成核算', evalStatus: '专评中', operationLogs: [], deferralRecords: [] },
  ],
  'pe-005': [
    { id: 'ei-005-1', projectId: 'pe-005', seq: 1, evalFunction: '项目经理', smsNotify1: '周建华', smsNotify2: '王志强', designatedPerson: '周建华', actualOperator: '周建华', needEval: '是', evalType: '自评价', shouldEndDate: '2025-02-12', systemSendDate: '2025-01-12', actualEndDate: '2025-02-08', draftDate: '2025-01-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-005-2', projectId: 'pe-005', seq: 2, evalFunction: '环保评价', smsNotify1: '李卫东', smsNotify2: '陈明辉', designatedPerson: '李卫东', actualOperator: '李卫东', needEval: '是', evalType: '专业评价', shouldEndDate: '2025-02-15', systemSendDate: '2025-01-12', actualEndDate: '2025-02-12', draftDate: '2025-01-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
    { id: 'ei-005-3', projectId: 'pe-005', seq: 3, evalFunction: '经济效益评价', smsNotify1: '钱志宏', smsNotify2: '冯志伟', designatedPerson: '钱志宏', actualOperator: '钱志宏', needEval: '是', evalType: '专业评价', shouldEndDate: '2025-02-20', systemSendDate: '2025-01-12', actualEndDate: '2025-02-18', draftDate: '2025-01-01', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: '已确认', operationLogs: [], deferralRecords: [] },
  ],
  'pe-006': [
    { id: 'ei-006-1', projectId: 'pe-006', seq: 1, evalFunction: '项目经理', smsNotify1: '吴国栋', smsNotify2: '', designatedPerson: '吴国栋', actualOperator: '吴国栋', needEval: '是', evalType: '自评价', shouldEndDate: '2024-04-05', systemSendDate: '2024-03-05', actualEndDate: '', draftDate: '2024-03-01', isDelayed: '是', delayedTo: '2024-05-05', delayReason: '设备联调进度滞后', evalStatus: '自评中', operationLogs: [], deferralRecords: [] },
    { id: 'ei-006-2', projectId: 'pe-006', seq: 2, evalFunction: '安全评价', smsNotify1: '马建国', smsNotify2: '周建华', designatedPerson: '马建国', actualOperator: '', needEval: '否', evalType: '专业评价', shouldEndDate: '', systemSendDate: '', actualEndDate: '', draftDate: '', isDelayed: '否', delayedTo: '', delayReason: '', evalStatus: 'N未参与评价', operationLogs: [], deferralRecords: [] },
  ],
};

// 操作日志
function generateOperationLogs(itemId: string): OperationLog[] {
  const logs: Record<string, OperationLog[]> = {
    'ei-001-1': [
      { id: 'ol-1', operationType: '新增评价', operator: '系统管理员', operationTime: '2024-02-01 09:30:00', detail: '创建项目经理自评价任务，指定评价人：王志强' },
      { id: 'ol-2', operationType: '修改通知人', operator: '王志强', operationTime: '2024-02-05 14:20:00', detail: '修改短信通知人2', beforeValue: '无', afterValue: '张建国→李卫东' },
      { id: 'ol-3', operationType: '提交自评', operator: '王志强', operationTime: '2024-03-05 10:15:00', detail: '提交自评结果，总分92分' },
      { id: 'ol-4', operationType: '审批通过', operator: '总师室-赵明辉', operationTime: '2024-03-08 16:30:00', detail: '自评审批通过，进入专评阶段' },
      { id: 'ol-5', operationType: '领导确认', operator: '总师室领导', operationTime: '2024-03-10 09:00:00', detail: '领导确认自评结果，评价状态变更为已确认' },
    ],
    'ei-001-2': [
      { id: 'ol-6', operationType: '新增评价', operator: '系统管理员', operationTime: '2024-02-01 09:30:00', detail: '创建环保评价专业评价任务' },
      { id: 'ol-7', operationType: '修改通知人', operator: '李卫东', operationTime: '2024-02-10 11:00:00', detail: '修改短信通知人2', beforeValue: '无', afterValue: '无→陈明辉' },
      { id: 'ol-8', operationType: '提交专评', operator: '李卫东', operationTime: '2024-03-12 14:30:00', detail: '提交环保专评结果' },
      { id: 'ol-9', operationType: '审批通过', operator: '总师室-赵明辉', operationTime: '2024-03-16 10:00:00', detail: '环保专评审批通过' },
    ],
    'ei-002-1': [
      { id: 'ol-10', operationType: '新增评价', operator: '系统管理员', operationTime: '2024-05-01 09:00:00', detail: '创建项目经理自评价任务' },
      { id: 'ol-11', operationType: '修改截至时间', operator: '张建国', operationTime: '2024-06-05 15:00:00', detail: '申请延期', beforeValue: '应结束时间：2024-06-20', afterValue: '应结束时间：2024-07-20，原因：项目部分设备调试未完成' },
      { id: 'ol-12', operationType: '延期审批通过', operator: '总师室-赵明辉', operationTime: '2024-06-08 10:00:00', detail: '延期申请审批通过，应结束时间调整为2024-07-20' },
      { id: 'ol-13', operationType: '修改指定人', operator: '张建国', operationTime: '2024-06-10 09:30:00', detail: '修改指定人', beforeValue: '张建国', afterValue: '王志强' },
    ],
    'ei-003-1': [
      { id: 'ol-14', operationType: '新增评价', operator: '系统管理员', operationTime: '2024-06-01 10:00:00', detail: '创建项目经理自评价任务' },
      { id: 'ol-15', operationType: '提交自评', operator: '赵永刚', operationTime: '2024-07-01 14:00:00', detail: '提交自评结果，总分88分' },
      { id: 'ol-16', operationType: '审批通过', operator: '总师室-赵明辉', operationTime: '2024-07-05 09:00:00', detail: '自评审批通过' },
    ],
  };
  return logs[itemId] || [
    { id: 'ol-def-1', operationType: '新增评价', operator: '系统管理员', operationTime: '2024-01-01 08:00:00', detail: '创建评价任务' },
  ];
}

// 延期记录
function generateDeferralRecords(itemId: string): DeferralRecord[] {
  const records: Record<string, DeferralRecord[]> = {
    'ei-002-1': [{
      id: 'dr-1', applicant: '张建国', applyTime: '2024-06-05', originalEndDate: '2024-06-20',
      delayedTo: '2024-07-20', delayReason: '项目部分设备调试未完成，需延长调试时间以确保评价数据完整准确。',
      approvalNodes: [
        { seq: 1, nodeName: '本单位分管领导', reviewer: '刘志刚', status: 'approved', opinion: '情况属实，同意延期。', time: '2024-06-06' },
        { seq: 2, nodeName: '事业部中层领导', reviewer: '李志明', status: 'approved', opinion: '同意。', time: '2024-06-07' },
        { seq: 3, nodeName: '总师室领导', reviewer: '赵明辉', status: 'approved', opinion: '批准延期。', time: '2024-06-08' },
      ],
    }],
    'ei-004-3': [{
      id: 'dr-2', applicant: '周建华', applyTime: '2024-09-15', originalEndDate: '2024-09-25',
      delayedTo: '2024-10-25', delayReason: '财务数据尚未完成核算，需要等待年度财务报表出具后才能进行经济效益评价。',
      approvalNodes: [
        { seq: 1, nodeName: '本单位分管领导', reviewer: '刘志刚', status: 'approved', opinion: '同意，财务数据确实需要时间。', time: '2024-09-16' },
        { seq: 2, nodeName: '事业部中层领导', reviewer: '李志明', status: 'approved', opinion: '同意。', time: '2024-09-17' },
        { seq: 3, nodeName: '总师室领导', reviewer: '赵明辉', status: 'approved', opinion: '批准延期一个月。', time: '2024-09-18' },
      ],
    }],
    'ei-006-1': [{
      id: 'dr-3', applicant: '吴国栋', applyTime: '2024-03-28', originalEndDate: '2024-04-05',
      delayedTo: '2024-05-05', delayReason: '精整线自动化设备联调进度滞后，控制系统调试需要额外时间。',
      approvalNodes: [
        { seq: 1, nodeName: '本单位分管领导', reviewer: '刘志刚', status: 'approved', opinion: '设备联调确实复杂，同意延期。', time: '2024-03-29' },
        { seq: 2, nodeName: '事业部中层领导', reviewer: '李志明', status: 'rejected', opinion: '延期时间过长，建议压缩至4月20日。', time: '2024-03-30' },
        { seq: 3, nodeName: '总师室领导', reviewer: '赵明辉', status: 'approved', opinion: '综合考虑，批准延期至5月5日。', time: '2024-04-01' },
      ],
    }],
  };
  return records[itemId] || [];
}

// 初始化操作日志和延期记录
Object.keys(evalItems).forEach(projectId => {
  evalItems[projectId].forEach(item => {
    item.operationLogs = generateOperationLogs(item.id);
    item.deferralRecords = generateDeferralRecords(item.id);
  });
});

// 自评数据
export function getSelfEvalData(projectId: string, itemId: string): SelfEvalData | null {
  const project = postEvalProjects.find(p => p.id === projectId);
  if (!project) return null;
  const item = evalItems[projectId]?.find(ei => ei.id === itemId);
  if (!item) return null;

  return {
    projectId, itemId,
    planContent: `${project.approvalDesc}`,
    planAchievement: '已按计划完成全部建设内容，各项指标达到设计要求，设备运行稳定，生产能力满足预期。',
    planDiff: '实际建设过程中新增了部分辅助设施，属于正常设计优化调整。',
    planScore: 25,
    qualityAccept: '是', qualityRectify: '无', qualityRectifyDetail: '', qualityEquipAccept: '是', qualityHotTest: '是',
    qualityScore: 20,
    techTarget: '达到行业领先技术水平，关键工艺指标满足设计要求。',
    techAchievement: '项目技术目标已全面实现，主要技术指标超过设计值，部分指标达到国内先进水平。',
    techDiffRate: '+5.2%', techScore: 15,
    benefitEffect: '项目投资回收期约3.5年，内部收益率达18.6%，经济效益显著。',
    benefitAchievement: '项目投产后产能提升12%，单位产品能耗降低8%，年节约成本约320万元，效益效果超出预期。',
    benefitDiffRate: '+3.1%', benefitScore: 18,
    otherTarget: '环保排放达标，安全生产零事故。',
    otherAchievement: '环保排放指标优于国家标准要求，建设期间及投产后均未发生安全事故。',
    otherDiffRate: '+2.5%', otherScore: 14,
    budgetCost: project.approvalAmount,
    actualCost: Math.round(project.approvalAmount * 0.97),
    costDiffRate: '-3.0%', costScore: 8,
    budgetDuration: '12个月',
    actualDuration: '11.5个月',
    durationDiffRate: '-4.2%', durationScore: 7,
    safetyStatus: '安全施工情况良好，全过程无安全事故发生。',
    smsNotify: item.smsNotify1,
    evaluator: item.designatedPerson,
    shouldEndTime: item.shouldEndDate,
    actualEvalTime: item.actualEndDate || '2024-03-05',
    shouldConfirmTime: '2024-03-15',
    evalStatus: item.evalStatus,
    isDelay: item.isDelayed, delayDate: item.delayedTo, delayReason: item.delayReason,
    approvalNodes: [
      { seq: 1, nodeName: '本单位分管领导', reviewer: '刘志刚', status: 'approved', opinion: '自评内容详实，数据准确，同意。', time: '2024-03-06' },
      { seq: 2, nodeName: '事业部中层领导', reviewer: '李志明', status: 'approved', opinion: '自评客观公正，同意转专评。', time: '2024-03-07' },
      { seq: 3, nodeName: '总师室', reviewer: '赵明辉', status: 'approved', opinion: '审核通过。', time: '2024-03-08' },
    ],
  };
}

// 专评数据
export function getProfEvalData(projectId: string, itemId: string): ProfEvalData | null {
  const project = postEvalProjects.find(p => p.id === projectId);
  if (!project) return null;
  const item = evalItems[projectId]?.find(ei => ei.id === itemId);
  if (!item) return null;

  const isBenefitEval = item.evalFunction === '经济效益评价';

  return {
    projectId, itemId,
    planContent: project.approvalDesc,
    profOpinion: item.evalStatus === '已确认'
      ? `经专业评审，该项目${project.approvalDesc}的施工质量、技术指标、安全环保等方面均达到设计要求和行业标准，${item.evalFunction}综合评价合格，建议通过专业评价。`
      : '',
    argumentOpinion: `根据项目论证阶段专业部门审批意见，该项目${project.approvalDesc}经${isBenefitEval ? '财务部、总师室' : '相关专业部门'}审核，项目技术方案可行，投资估算合理，效益预测数据真实可靠，同意进入后评价阶段。`,
    instructionOpinion: item.evalStatus === '已确认'
      ? `经审核，${item.evalFunction}专评内容全面、数据详实，专业考评意见客观公正，同意通过专业评价。`
      : '',
    declareBenefit: isBenefitEval ? `${(project.approvalAmount * 0.15 / 10000).toFixed(2)}` : '',
    reviewBenefit: isBenefitEval ? `${(project.approvalAmount * 0.143 / 10000).toFixed(2)}` : '',
    approvalNodes: item.evalStatus === '已确认' ? [
      { seq: 1, nodeName: '本单位分管领导', reviewer: '刘志刚', status: 'approved', opinion: '专评意见客观，同意。', time: '2024-03-14' },
      { seq: 2, nodeName: '事业部中层领导', reviewer: '李志明', status: 'approved', opinion: '同意。', time: '2024-03-15' },
    ] : [],
  };
}

// 综评数据
export function getCompEvalData(projectId: string, itemId: string): CompEvalData | null {
  const project = postEvalProjects.find(p => p.id === projectId);
  if (!project) return null;
  const item = evalItems[projectId]?.find(ei => ei.id === itemId);
  if (!item) return null;

  return {
    projectId, itemId,
    planContent: project.approvalDesc,
    planAchievement: '已按计划完成全部建设内容，经过自评和专评确认，各项指标达到设计要求。',
    planDiff: '经综合评价审核，差异内容属于正常设计优化调整，不影响总体目标实现。',
    planScore: 23,
    qualityAccept: '是', qualityRectify: '无', qualityRectifyDetail: '', qualityEquipAccept: '是', qualityHotTest: '是',
    qualityScore: 18,
    techTarget: '项目技术目标已全面实现。',
    techAchievement: '经综合评价审核，技术目标实现情况良好，关键指标超设计值。',
    techDiffRate: '+5.0%', techScore: 14,
    benefitEffect: '经济效益显著，投资回收期合理。',
    benefitAchievement: '经财务部门核算数据确认，项目经济效益达标。',
    benefitDiffRate: '+3.0%', benefitScore: 17,
    otherTarget: '环保安全达标。',
    otherAchievement: '环保安全指标全面达标。',
    otherDiffRate: '+2.3%', otherScore: 13,
    budgetCost: project.approvalAmount,
    actualCost: Math.round(project.approvalAmount * 0.965),
    costDiffRate: '-3.5%', costScore: 8,
    budgetDuration: '12个月',
    actualDuration: '11.5个月',
    durationDiffRate: '-4.2%', durationScore: 6,
    safetyStatus: '安全施工情况良好。',
    profOpinion: '经专业评审确认，项目施工质量、技术指标、安全环保等方面均达到设计要求和行业标准，综合评价合格。',
    approvalNodes: [
      { seq: 1, nodeName: '本单位分管领导', reviewer: '刘志刚', status: 'approved', opinion: '综评内容全面客观。', time: '2024-03-20' },
      { seq: 2, nodeName: '事业部中层领导', reviewer: '李志明', status: 'approved', opinion: '同意综评结论。', time: '2024-03-21' },
      { seq: 3, nodeName: '总师室', reviewer: '赵明辉', status: 'approved', opinion: '审核通过，项目后评价完成。', time: '2024-03-22' },
    ],
  };
}

// 获取审批详情
export function getApprovalDetail(bizType: string): { approvalNo: string; applicant: string; applyTime: string; nodes: ApprovalNode[] } {
  return {
    approvalNo: `SP-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    applicant: '系统用户',
    applyTime: '2024-03-01',
    nodes: [
      { seq: 1, nodeName: '本单位分管领导', reviewer: '刘志刚', status: 'approved', opinion: '同意。', time: '2024-03-02' },
      { seq: 2, nodeName: '事业部中层领导', reviewer: '李志明', status: 'approved', opinion: '同意。', time: '2024-03-03' },
      { seq: 3, nodeName: '总师室', reviewer: '赵明辉', status: 'approved', opinion: '批准。', time: '2024-03-05' },
    ],
  };
}

// 评价详情完整数据（自评+专评+综评汇总）
export function getEvalDetailData(projectId: string, itemId: string) {
  const self = getSelfEvalData(projectId, itemId);
  const prof = getProfEvalData(projectId, itemId);
  const comp = getCompEvalData(projectId, itemId);
  const project = postEvalProjects.find(p => p.id === projectId);
  const item = evalItems[projectId]?.find(ei => ei.id === itemId);
  return { self, prof, comp, project, item };
}