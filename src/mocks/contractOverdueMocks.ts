export interface OverdueContract {
  id: string;
  approvalNo: string;
  contractNo: string;
  contractName: string;
  contractorNo: string;
  contractorName: string;
  mainContent: string;
  contractStatus: string;
  contractType: string;
  contractAmount: number;
  signDate: string;
  hasOverdueApp: boolean;
}

export interface OverdueApplication {
  id: string;
  appNo: string;
  contractId: string;
  contractNo: string;
  contractName: string;
  contractType: string;
  contractAmount: number;
  planStartDate: string;
  planEndDate: string;
  approvalNo: string;
  builderCode: string;
  builderName: string;
  builderPerson: string;
  delayCompletionDate: string;
  delayReason: string;
  ownerUnit: string;
  businessUnit: string;
  nextReviewer: string;
  status: string;
  stage: 'project' | 'department';
  exemptAmount: number;
  typeNode: string;
  affectsCompletion: string;
  overdueReason: string;
  attachments: string[];
  applyDate: string;
  applicant: string;
  currentOperator: string;
  createTime: string;
  operateTime: string;
  delayDays: number;
}

export interface OverdueApprovalRecord {
  id: string;
  appId: string;
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

export const overdueContracts: OverdueContract[] = [
  {
    id: 'oc-001', approvalNo: 'LX-2024-003', contractNo: 'NG-GC-2024-003',
    contractName: '炼铁厂2#烧结机大修施工合同', contractorNo: 'CBS-002', contractorName: '中国五冶集团有限公司',
    mainContent: '炼铁厂2#烧结机本体、环冷机、除尘系统等大修施工',
    contractStatus: '执行中', contractType: '施工总承包', contractAmount: 32500000, signDate: '2024-01-20',
    hasOverdueApp: true,
  },
  {
    id: 'oc-002', approvalNo: 'LX-2024-007', contractNo: 'NG-GC-2024-007',
    contractName: '棒材厂精整线改造设备安装合同', contractorNo: 'CBS-007', contractorName: '中冶天工集团有限公司',
    mainContent: '棒材厂精整线矫直机、冷剪、定尺机等设备安装及调试',
    contractStatus: '执行中', contractType: '专业分包', contractAmount: 15800000, signDate: '2024-02-25',
    hasOverdueApp: true,
  },
  {
    id: 'oc-003', approvalNo: 'LX-2024-010', contractNo: 'NG-GC-2024-010',
    contractName: '中厚板卷厂加热炉改造总承包合同', contractorNo: 'CBS-009', contractorName: '中冶南方工程技术有限公司',
    mainContent: '中厚板卷厂2#加热炉整体改造，包括炉体钢结构、燃烧系统、自动化控制等',
    contractStatus: '执行中', contractType: 'EPC总承包', contractAmount: 48200000, signDate: '2024-03-15',
    hasOverdueApp: false,
  },
  {
    id: 'oc-004', approvalNo: 'LX-2024-014', contractNo: 'NG-GC-2024-014',
    contractName: '炼钢厂转炉余热锅炉改造合同', contractorNo: 'CBS-011', contractorName: '中冶京城工程技术有限公司',
    mainContent: '炼钢厂3#转炉余热锅炉本体更换、汽化冷却系统改造、除尘管道更新',
    contractStatus: '执行中', contractType: '施工总承包', contractAmount: 27500000, signDate: '2024-04-10',
    hasOverdueApp: true,
  },
  {
    id: 'oc-005', approvalNo: 'LX-2024-017', contractNo: 'NG-GC-2024-017',
    contractName: '公辅水处理中心扩建施工合同', contractorNo: 'CBS-013', contractorName: '中建八局集团有限公司',
    mainContent: '公辅水处理中心二期扩建，包括沉淀池、过滤系统、加药间、泵站等土建及安装',
    contractStatus: '执行中', contractType: '施工总承包', contractAmount: 19600000, signDate: '2024-05-05',
    hasOverdueApp: false,
  },
  {
    id: 'oc-006', approvalNo: 'LX-2024-020', contractNo: 'NG-GC-2024-020',
    contractName: '焦化厂干熄焦改造设备采购安装合同', contractorNo: 'CBS-016', contractorName: '中冶焦耐工程技术有限公司',
    mainContent: '焦化厂1#干熄焦装置改造，包括干熄炉、余热锅炉、提升机、除尘系统等',
    contractStatus: '执行中', contractType: '设备采购', contractAmount: 61800000, signDate: '2024-06-10',
    hasOverdueApp: true,
  },
  {
    id: 'oc-007', approvalNo: 'LX-2024-023', contractNo: 'NG-GC-2024-023',
    contractName: '炼铁厂高炉喷煤系统改造合同', contractorNo: 'CBS-019', contractorName: '中钢集团鞍山热能研究院',
    mainContent: '炼铁厂2#高炉喷煤系统改造，包括制粉系统、喷吹系统、自动化控制及安全监测',
    contractStatus: '执行中', contractType: '专业分包', contractAmount: 13400000, signDate: '2024-06-25',
    hasOverdueApp: false,
  },
  {
    id: 'oc-008', approvalNo: 'LX-2024-026', contractNo: 'NG-GC-2024-026',
    contractName: '宽厚板厂双边剪改造设备合同', contractorNo: 'CBS-020', contractorName: '中国重型机械研究院',
    mainContent: '宽厚板厂精整线双边剪机组整体更新，包括机械、液压、电气及自动化系统',
    contractStatus: '执行中', contractType: '设备采购', contractAmount: 22900000, signDate: '2024-07-15',
    hasOverdueApp: true,
  },
  {
    id: 'oc-009', approvalNo: 'LX-2024-028', contractNo: 'NG-GC-2024-028',
    contractName: '第一炼钢厂真空精炼炉安装合同', contractorNo: 'CBS-022', contractorName: '中国钢研科技集团',
    mainContent: '第一炼钢厂RH真空精炼炉设备安装、调试及工艺优化',
    contractStatus: '执行中', contractType: '施工总承包', contractAmount: 35100000, signDate: '2024-08-01',
    hasOverdueApp: true,
  },
  {
    id: 'oc-010', approvalNo: 'LX-2024-030', contractNo: 'NG-GC-2024-030',
    contractName: '原料厂输送系统改造施工合同', contractorNo: 'CBS-024', contractorName: '中国十五冶建设集团',
    mainContent: '原料厂皮带输送系统改造，包括管带机、转运站、配电系统及除尘设施',
    contractStatus: '执行中', contractType: '施工总承包', contractAmount: 24300000, signDate: '2024-08-20',
    hasOverdueApp: false,
  },
];

export const overdueApplications: OverdueApplication[] = [
  {
    id: 'oa-001', appNo: 'YQ-SQ-2024-001', contractId: 'oc-001',
    contractNo: 'NG-GC-2024-003', contractName: '炼铁厂2#烧结机大修施工合同',
    contractType: '施工总承包', contractAmount: 32500000,
    planStartDate: '2024-02-01', planEndDate: '2024-09-30',
    approvalNo: 'LX-2024-003', builderCode: 'CBS-002', builderName: '中国五冶集团有限公司',
    builderPerson: '赵国强', delayCompletionDate: '2024-12-15',
    delayReason: '因烧结机本体拆除过程中发现原基础存在严重腐蚀需进行加固处理，导致工期延误。经现场勘查，基础加固范围超出原设计预期，施工难度增大。',
    ownerUnit: '炼铁厂', businessUnit: '炼铁事业部',
    nextReviewer: '王建国', status: '项目组审核中',
    stage: 'project',
    exemptAmount: 150000, typeNode: '设备安装', affectsCompletion: '是',
    overdueReason: '1.原基础腐蚀严重需加固处理约15天；\n2.进口耐材到货滞后约10天；\n3.雨季施工影响约8天。综合延期76天。',
    attachments: ['基础检测报告.pdf', '基础加固方案.pdf', '施工进度对比表.xlsx', '延期申请函.pdf'],
    applyDate: '2024-07-20', applicant: '陈工 13800000001', currentOperator: '陈工',
    createTime: '2024-07-20 14:30:00', operateTime: '2024-07-20 14:30:00',
    delayDays: 76,
  },
  {
    id: 'oa-002', appNo: 'YQ-SQ-2024-002', contractId: 'oc-002',
    contractNo: 'NG-GC-2024-007', contractName: '棒材厂精整线改造设备安装合同',
    contractType: '专业分包', contractAmount: 15800000,
    planStartDate: '2024-03-10', planEndDate: '2024-08-20',
    approvalNo: 'LX-2024-007', builderCode: 'CBS-007', builderName: '中冶天工集团有限公司',
    builderPerson: '周志强', delayCompletionDate: '2024-11-05',
    delayReason: '精整线关键设备冷剪为进口设备，受国际物流影响，到货时间比计划延迟约45天，导致后续安装调试无法按计划进行。',
    ownerUnit: '棒材厂', businessUnit: '棒材事业部',
    nextReviewer: '李明', status: '项目组审核中',
    stage: 'project',
    exemptAmount: 200000, typeNode: '设备安装', affectsCompletion: '是',
    overdueReason: '1.进口设备到货延迟45天；\n2.设备基础预埋件复核整改7天；\n3.整体安装调试顺序调整增加10天。综合延期77天。',
    attachments: ['设备到货延迟证明.pdf', '工期影响分析报告.xlsx', '延期申请函.pdf'],
    applyDate: '2024-06-15', applicant: '刘工 13900000002', currentOperator: '刘工',
    createTime: '2024-06-15 10:00:00', operateTime: '2024-06-15 10:00:00',
    delayDays: 77,
  },
  {
    id: 'oa-003', appNo: 'YQ-SQ-2024-003', contractId: 'oc-004',
    contractNo: 'NG-GC-2024-014', contractName: '炼钢厂转炉余热锅炉改造合同',
    contractType: '施工总承包', contractAmount: 27500000,
    planStartDate: '2024-05-01', planEndDate: '2024-10-31',
    approvalNo: 'LX-2024-014', builderCode: 'CBS-011', builderName: '中冶京城工程技术有限公司',
    builderPerson: '孙建民', delayCompletionDate: '2025-01-20',
    delayReason: '余热锅炉本体制造为特种设备，制造周期长且受制于材料采购周期。同时现场旧锅炉拆除过程中发现汽化冷却系统管道腐蚀范围超出预期。',
    ownerUnit: '炼钢厂', businessUnit: '炼钢事业部',
    nextReviewer: '张涛', status: '主管部门审核中',
    stage: 'department',
    exemptAmount: 350000, typeNode: '设备安装', affectsCompletion: '是',
    overdueReason: '1.余热锅炉本体制造周期延长30天；\n2.旧管道拆除范围扩大增加15天；\n3.特种设备监检周期增加10天。综合延期81天。',
    attachments: ['锅炉制造进度说明.pdf', '管道腐蚀检测报告.pdf', '延期申请函.pdf', '特种设备监检联系单.pdf'],
    applyDate: '2024-08-05', applicant: '黄工 13700000003', currentOperator: '张涛',
    createTime: '2024-08-05 09:15:00', operateTime: '2024-08-28 16:00:00',
    delayDays: 81,
  },
  {
    id: 'oa-004', appNo: 'YQ-SQ-2024-004', contractId: 'oc-006',
    contractNo: 'NG-GC-2024-020', contractName: '焦化厂干熄焦改造设备采购安装合同',
    contractType: '设备采购', contractAmount: 61800000,
    planStartDate: '2024-07-01', planEndDate: '2025-06-30',
    approvalNo: 'LX-2024-020', builderCode: 'CBS-016', builderName: '中冶焦耐工程技术有限公司',
    builderPerson: '马超', delayCompletionDate: '2025-09-15',
    delayReason: '干熄炉耐材供货受原材料市场波动影响，关键耐火材料供货周期延长。同时现场桩基施工中发现地质条件与原勘察报告存在差异。',
    ownerUnit: '焦化厂', businessUnit: '焦化事业部',
    nextReviewer: '施海峰', status: '主管部门审核中',
    stage: 'department',
    exemptAmount: 500000, typeNode: '土建施工', affectsCompletion: '是',
    overdueReason: '1.耐材供货周期延长35天；\n2.桩基方案调整增加20天；\n3.交叉作业协调增加15天。综合延期77天。',
    attachments: ['耐材供货进展报告.pdf', '桩基地质补充勘察报告.pdf', '延期申请函.pdf', '施工组织调整方案.pdf'],
    applyDate: '2024-09-10', applicant: '杨工 13600000004', currentOperator: '施海峰',
    createTime: '2024-09-10 11:00:00', operateTime: '2024-09-30 14:30:00',
    delayDays: 77,
  },
  {
    id: 'oa-005', appNo: 'YQ-SQ-2024-005', contractId: 'oc-008',
    contractNo: 'NG-GC-2024-026', contractName: '宽厚板厂双边剪改造设备合同',
    contractType: '设备采购', contractAmount: 22900000,
    planStartDate: '2024-08-01', planEndDate: '2025-02-28',
    approvalNo: 'LX-2024-026', builderCode: 'CBS-020', builderName: '中国重型机械研究院',
    builderPerson: '罗永强', delayCompletionDate: '2025-05-10',
    delayReason: '双边剪关键部件为国外进口精密件，供应商产能紧张导致交货期延后。另外旧设备拆除中发现基础预埋螺栓位置偏差需要重新钻孔植筋。',
    ownerUnit: '宽厚板厂', businessUnit: '宽厚板事业部',
    nextReviewer: '宋宁岐', status: '已通过',
    stage: 'department',
    exemptAmount: 280000, typeNode: '设备安装', affectsCompletion: '是',
    overdueReason: '1.进口精密部件交货延后28天；\n2.基础处理增加18天；\n3.安装精度调整增加15天。综合延期71天。实际已获批准。',
    attachments: ['进口部件交付进度.pdf', '基础处理方案.pdf', '延期申请函.pdf', '审批纪要.pdf'],
    applyDate: '2024-11-01', applicant: '彭工 13500000005', currentOperator: '宋宁岐',
    createTime: '2024-11-01 08:30:00', operateTime: '2024-11-25 10:00:00',
    delayDays: 71,
  },
  {
    id: 'oa-006', appNo: 'YQ-SQ-2024-006', contractId: 'oc-009',
    contractNo: 'NG-GC-2024-028', contractName: '第一炼钢厂真空精炼炉安装合同',
    contractType: '施工总承包', contractAmount: 35100000,
    planStartDate: '2024-09-01', planEndDate: '2025-04-30',
    approvalNo: 'LX-2024-028', builderCode: 'CBS-022', builderName: '中国钢研科技集团',
    builderPerson: '何伟', delayCompletionDate: '2025-07-20',
    delayReason: '真空精炼炉主体为大型真空设备，制造厂产能受其他订单影响。真空系统密封件需进口，采购周期延长。现场安装需配合炼钢生产节奏。',
    ownerUnit: '第一炼钢厂', businessUnit: '炼钢事业部',
    nextReviewer: '王建国', status: '项目组退回',
    stage: 'project',
    exemptAmount: 420000, typeNode: '设备安装', affectsCompletion: '是',
    overdueReason: '1.设备制造进度延迟30天；\n2.进口密封件采购延长15天；\n3.需配合生产节奏安装增加20天。综合延期81天。依据合同条款第12.3条申请延期。',
    attachments: ['设备制造进度说明.pdf', '进口件采购证明.pdf', '延期申请函.pdf'],
    applyDate: '2024-12-05', applicant: '徐工 13400000006', currentOperator: '徐工',
    createTime: '2024-12-05 15:00:00', operateTime: '2024-12-18 09:30:00',
    delayDays: 81,
  },
];

export const overdueApprovalRecords: OverdueApprovalRecord[] = [
  { id: 'oar-001', appId: 'oa-001', seq: 1, stage: '项目组', operator: '陈工', action: '提交申请', operateTime: '2024-07-20 14:30:00', opinion: '因基础腐蚀加固处理及进口耐材延迟导致工期延误，申请延期76天，详见附件材料。' },
  { id: 'oar-002', appId: 'oa-003', seq: 1, stage: '项目组', operator: '黄工', action: '提交申请', operateTime: '2024-08-05 09:15:00', opinion: '余热锅炉制造周期延长及现场旧管道拆除范围扩大，申请延期81天。' },
  { id: 'oar-003', appId: 'oa-003', seq: 2, stage: '项目组', operator: '张涛', action: '项目组审核通过', operateTime: '2024-08-15 10:00:00', opinion: '经核实，延期原因属实，延期天数计算合理。呈核事业部领导审核。' },
  { id: 'oar-004', appId: 'oa-003', seq: 3, stage: '项目组', operator: '张涛', action: '呈核', operateTime: '2024-08-15 10:30:00', opinion: '呈核制造部施海峰科长审核。' },
  { id: 'oar-005', appId: 'oa-003', seq: 4, stage: '制造部', operator: '施海峰', action: '审核中', operateTime: '2024-08-28 16:00:00', opinion: '' },
  { id: 'oar-006', appId: 'oa-004', seq: 1, stage: '项目组', operator: '杨工', action: '提交申请', operateTime: '2024-09-10 11:00:00', opinion: '耐材供货延迟及桩基方案调整，申请延期77天。' },
  { id: 'oar-007', appId: 'oa-004', seq: 2, stage: '项目组', operator: '杨工', action: '项目组审核通过', operateTime: '2024-09-20 15:00:00', opinion: '延期申请材料齐全，原因合理，天数计算正确。呈核制造部。' },
  { id: 'oar-008', appId: 'oa-004', seq: 3, stage: '项目组', operator: '杨工', action: '呈核', operateTime: '2024-09-20 15:30:00', opinion: '呈核制造部施海峰科长审核。' },
  { id: 'oar-009', appId: 'oa-004', seq: 4, stage: '制造部', operator: '施海峰', action: '审核中', operateTime: '2024-09-30 14:30:00', opinion: '' },
  { id: 'oar-010', appId: 'oa-005', seq: 1, stage: '项目组', operator: '彭工', action: '提交申请', operateTime: '2024-11-01 08:30:00', opinion: '进口精密部件交期延后，基础处理需增加工作量，申请延期71天。' },
  { id: 'oar-011', appId: 'oa-005', seq: 2, stage: '项目组', operator: '彭工', action: '项目组审核通过', operateTime: '2024-11-10 16:00:00', opinion: '延期原因属实，材料详实，批准呈核。' },
  { id: 'oar-012', appId: 'oa-005', seq: 3, stage: '项目组', operator: '彭工', action: '呈核', operateTime: '2024-11-10 16:30:00', opinion: '呈核制造部宋宁岐科长审核。' },
  { id: 'oar-013', appId: 'oa-005', seq: 4, stage: '制造部', operator: '宋宁岐', action: '审核通过', operateTime: '2024-11-20 09:00:00', opinion: '经审核，延期申请材料完整，延期原因充分合理。批准延期71天，免除考核金额28万元。' },
  { id: 'oar-014', appId: 'oa-005', seq: 5, stage: '制造部', operator: '宋宁岐', action: '确认通过', operateTime: '2024-11-25 10:00:00', opinion: '已完成全部审批流程，合同延期执行。' },
  { id: 'oar-015', appId: 'oa-006', seq: 1, stage: '项目组', operator: '徐工', action: '提交申请', operateTime: '2024-12-05 15:00:00', opinion: '设备制造进度延迟及进口密封件采购延长，申请延期81天。' },
  { id: 'oar-016', appId: 'oa-006', seq: 2, stage: '项目组', operator: '王建国', action: '项目组退回', operateTime: '2024-12-18 09:30:00', opinion: '延期原因说明不够充分，请补充设备制造厂产能影响的详细证明材料，重新核算延期天数后再次提交。' },
];

export function getContractById(id: string): OverdueContract | undefined {
  return overdueContracts.find((c) => c.id === id);
}

export function getApplicationsByContractId(contractId: string): OverdueApplication[] {
  return overdueApplications.filter((a) => a.contractId === contractId);
}

export function getApplicationById(id: string): OverdueApplication | undefined {
  return overdueApplications.find((a) => a.id === id);
}

export function getApprovalRecordsByAppId(appId: string): OverdueApprovalRecord[] {
  return overdueApprovalRecords.filter((r) => r.appId === appId).sort((a, b) => a.seq - b.seq);
}

export const contractTypes = ['施工总承包', '专业分包', '劳务分包', '设备采购', '设计合同', '监理合同', '咨询合同', 'EPC总承包'];

export const contractStatuses = ['执行中', '已完工', '已暂停', '已终止'];

export const amountRanges = [
  { label: '请选择...', value: '' },
  { label: '1000万以下', value: '0-1000' },
  { label: '1000万-3000万', value: '1000-3000' },
  { label: '3000万-5000万', value: '3000-5000' },
  { label: '5000万-1亿', value: '5000-10000' },
  { label: '1亿以上', value: '10000+' },
];

export const overdueOptions = [
  { label: '请选择...', value: '' },
  { label: '是', value: 'yes' },
  { label: '否', value: 'no' },
];