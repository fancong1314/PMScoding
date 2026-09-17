export interface ExamExemptionContract {
  id: string;
  approvalNo: string;
  contractNo: string;
  contractType: string;
  contractName: string;
  contractorNo: string;
  mainContent: string;
  contractStatus: string;
  contractAmount: number;
  signDate: string;
}

export interface ExamExemptionApplication {
  id: string;
  appNo: string;
  contractId: string;
  contractNo: string;
  contractName: string;
  contractAmount: number;
  planStartDate: string;
  planEndDate: string;
  approvalNo: string;
  status: string;
  stage: 'project' | 'department';
  actualStartDate: string;
  actualEndDate: string;
  exemptionDays: number;
  exemptionType: string;
  exemptionAmount: number;
  agreedPenaltyAmount: number;
  finalPenaltyAmount: number;
  contractText: string;
  overdueReason: string;
  confirmReason: string;
  attachments: string[];
  currentOperator: string;
  applyDate: string;
  operatorDate: string;
  operatorTime: string;
}

export interface ExamExemptionApprovalRecord {
  id: string;
  appId: string;
  seq: number;
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

export const examExemptionContracts: ExamExemptionContract[] = [
  { id: 'eec-001', approvalNo: 'LX-2024-003', contractNo: 'NG-GC-2024-003', contractType: '施工总承包', contractName: '炼铁厂2#烧结机大修施工合同', contractorNo: 'CBS-002', mainContent: '炼铁厂2#烧结机本体、环冷机、除尘系统等大修施工', contractStatus: '执行中', contractAmount: 32500000, signDate: '2024-01-20' },
  { id: 'eec-002', approvalNo: 'LX-2024-007', contractNo: 'NG-GC-2024-007', contractType: '专业分包', contractName: '棒材厂精整线改造设备安装合同', contractorNo: 'CBS-007', mainContent: '棒材厂精整线矫直机、冷剪、定尺机等设备安装及调试', contractStatus: '执行中', contractAmount: 15800000, signDate: '2024-02-25' },
  { id: 'eec-003', approvalNo: 'LX-2024-010', contractNo: 'NG-GC-2024-010', contractType: 'EPC总承包', contractName: '中厚板卷厂加热炉改造总承包合同', contractorNo: 'CBS-009', mainContent: '中厚板卷厂2#加热炉整体改造', contractStatus: '执行中', contractAmount: 48200000, signDate: '2024-03-15' },
  { id: 'eec-004', approvalNo: 'LX-2024-014', contractNo: 'NG-GC-2024-014', contractType: '施工总承包', contractName: '炼钢厂转炉余热锅炉改造合同', contractorNo: 'CBS-011', mainContent: '炼钢厂3#转炉余热锅炉本体更换、汽化冷却系统改造', contractStatus: '执行中', contractAmount: 27500000, signDate: '2024-04-10' },
  { id: 'eec-005', approvalNo: 'LX-2024-017', contractNo: 'NG-GC-2024-017', contractType: '施工总承包', contractName: '公辅水处理中心扩建施工合同', contractorNo: 'CBS-013', mainContent: '公辅水处理中心二期扩建', contractStatus: '执行中', contractAmount: 19600000, signDate: '2024-05-05' },
  { id: 'eec-006', approvalNo: 'LX-2024-020', contractNo: 'NG-GC-2024-020', contractType: '设备采购', contractName: '焦化厂干熄焦改造设备采购安装合同', contractorNo: 'CBS-016', mainContent: '焦化厂1#干熄焦装置改造', contractStatus: '执行中', contractAmount: 61800000, signDate: '2024-06-10' },
  { id: 'eec-007', approvalNo: 'LX-2024-023', contractNo: 'NG-GC-2024-023', contractType: '专业分包', contractName: '炼铁厂高炉喷煤系统改造合同', contractorNo: 'CBS-019', mainContent: '炼铁厂2#高炉喷煤系统改造', contractStatus: '执行中', contractAmount: 13400000, signDate: '2024-06-25' },
  { id: 'eec-008', approvalNo: 'LX-2024-026', contractNo: 'NG-GC-2024-026', contractType: '设备采购', contractName: '宽厚板厂双边剪改造设备合同', contractorNo: 'CBS-020', mainContent: '宽厚板厂精整线双边剪机组整体更新', contractStatus: '执行中', contractAmount: 22900000, signDate: '2024-07-15' },
];

export const examExemptionApplications: ExamExemptionApplication[] = [
  {
    id: 'eea-001', appNo: 'MK-SQ-2024-001', contractId: 'eec-001', contractNo: 'NG-GC-2024-003',
    contractName: '炼铁厂2#烧结机大修施工合同', contractAmount: 32500000,
    planStartDate: '2024-02-01', planEndDate: '2024-09-30',
    approvalNo: 'LX-2024-003', status: '项目组新建',
    stage: 'project',
    actualStartDate: '2024-02-05', actualEndDate: '2024-12-10',
    exemptionDays: 45, exemptionType: 'A工期',
    exemptionAmount: 350000, agreedPenaltyAmount: 1200000,
    finalPenaltyAmount: 850000,
    contractText: 'NG-GC-2024-003 标准合同文本',
    overdueReason: '因烧结机本体拆除过程中发现原基础存在严重腐蚀需进行加固处理，加上进口耐材到货周期延长，导致工期超过合同约定完成时间。经评估非施工方责任，特申请免考核。',
    confirmReason: '',
    attachments: ['基础腐蚀检测报告.pdf', '耐材到货延迟证明.pdf', '免考核申请函.pdf'],
    currentOperator: '陈工', applyDate: '2024-07-15',
    operatorDate: '2024-07-15', operatorTime: '14:30:00',
  },
  {
    id: 'eea-002', appId: 'eea-002', contractId: 'eec-001', contractNo: 'NG-GC-2024-003',
    contractName: '炼铁厂2#烧结机大修施工合同', contractAmount: 32500000,
    planStartDate: '2024-02-01', planEndDate: '2024-09-30',
    approvalNo: 'LX-2024-003', status: '项目组新建',
    stage: 'project',
    actualStartDate: '2024-02-05', actualEndDate: '2024-11-20',
    exemptionDays: 30, exemptionType: 'B结算',
    exemptionAmount: 200000, agreedPenaltyAmount: 1200000,
    finalPenaltyAmount: 1000000,
    contractText: 'NG-GC-2024-003 标准合同文本',
    overdueReason: '环冷机安装过程中发现预埋螺栓位置偏差需调校，耽误工期约30天。经核实为设计图纸标注不清晰导致，非施工方责任。',
    confirmReason: '',
    attachments: ['预埋螺栓调校记录.pdf', '设计图纸问题说明.pdf'],
    currentOperator: '张工', applyDate: '2024-08-10',
    operatorDate: '2024-08-10', operatorTime: '09:00:00',
  },
  {
    id: 'eea-003', appId: 'eea-003', contractId: 'eec-004', contractNo: 'NG-GC-2024-014',
    contractName: '炼钢厂转炉余热锅炉改造合同', contractAmount: 27500000,
    planStartDate: '2024-05-01', planEndDate: '2024-10-31',
    approvalNo: 'LX-2024-014', status: '主管部门审核中',
    stage: 'department',
    actualStartDate: '2024-05-05', actualEndDate: '2025-01-15',
    exemptionDays: 55, exemptionType: 'A工期',
    exemptionAmount: 480000, agreedPenaltyAmount: 1500000,
    finalPenaltyAmount: 1020000,
    contractText: 'NG-GC-2024-014 标准合同文本',
    overdueReason: '余热锅炉本体为特种设备，制造周期长。同时旧管道拆除范围超出预期，汽化冷却系统管道腐蚀更换量增加，导致工期延误。',
    confirmReason: '',
    attachments: ['特种设备制造进度说明.pdf', '管道腐蚀检测报告.pdf', '免考核申请函.pdf'],
    currentOperator: '施海峰', applyDate: '2024-08-20',
    operatorDate: '2024-09-05', operatorTime: '10:00:00',
  },
  {
    id: 'eea-004', appId: 'eea-004', contractId: 'eec-006', contractNo: 'NG-GC-2024-020',
    contractName: '焦化厂干熄焦改造设备采购安装合同', contractAmount: 61800000,
    planStartDate: '2024-07-01', planEndDate: '2025-06-30',
    approvalNo: 'LX-2024-020', status: '主管部门审核中',
    stage: 'department',
    actualStartDate: '2024-07-05', actualEndDate: '2025-09-10',
    exemptionDays: 60, exemptionType: 'B结算',
    exemptionAmount: 650000, agreedPenaltyAmount: 2500000,
    finalPenaltyAmount: 1850000,
    contractText: 'NG-GC-2024-020 标准合同文本',
    overdueReason: '关键耐材供货受原材料市场波动影响，供货周期延长35天。桩基施工中发现地质异常需调整方案，增加工期25天。',
    confirmReason: '',
    attachments: ['耐材供货说明.pdf', '桩基地质补充勘察.pdf', '免考核申请函.pdf'],
    currentOperator: '宋宁岐', applyDate: '2024-09-15',
    operatorDate: '2024-09-28', operatorTime: '14:00:00',
  },
  {
    id: 'eea-005', appId: 'eea-005', contractId: 'eec-008', contractNo: 'NG-GC-2024-026',
    contractName: '宽厚板厂双边剪改造设备合同', contractAmount: 22900000,
    planStartDate: '2024-08-01', planEndDate: '2025-02-28',
    approvalNo: 'LX-2024-026', status: '已通过',
    stage: 'department',
    actualStartDate: '2024-08-05', actualEndDate: '2025-04-25',
    exemptionDays: 40, exemptionType: 'A工期',
    exemptionAmount: 280000, agreedPenaltyAmount: 900000,
    finalPenaltyAmount: 620000,
    contractText: 'NG-GC-2024-026 标准合同文本',
    overdueReason: '进口精密部件交期延后28天，基础预埋螺栓位置偏差需重新钻孔植筋增加12天。',
    confirmReason: '经审核，延期原因属实且非施工方责任，同意免考核。',
    attachments: ['进口部件交付说明.pdf', '基础处理记录.pdf', '审批纪要.pdf'],
    currentOperator: '彭工', applyDate: '2024-11-01',
    operatorDate: '2024-11-20', operatorTime: '09:30:00',
  },
  {
    id: 'eea-006', appId: 'eea-006', contractId: 'eec-002', contractNo: 'NG-GC-2024-007',
    contractName: '棒材厂精整线改造设备安装合同', contractAmount: 15800000,
    planStartDate: '2024-03-10', planEndDate: '2024-08-20',
    approvalNo: 'LX-2024-007', status: '项目组退回',
    stage: 'project',
    actualStartDate: '2024-03-15', actualEndDate: '2024-10-30',
    exemptionDays: 35, exemptionType: 'A工期',
    exemptionAmount: 180000, agreedPenaltyAmount: 600000,
    finalPenaltyAmount: 420000,
    contractText: 'NG-GC-2024-007 标准合同文本',
    overdueReason: '进口冷剪设备到货延迟及安装调试交叉作业影响工期。',
    confirmReason: '',
    attachments: ['设备到货延迟说明.pdf', '工期影响分析.pdf'],
    currentOperator: '刘工', applyDate: '2024-06-20',
    operatorDate: '2024-07-05', operatorTime: '11:00:00',
  },
  // Additional department stage data for full demo
  {
    id: 'eea-007', appId: 'eea-007', contractId: 'eec-003', contractNo: 'NG-GC-2024-010',
    contractName: '中厚板卷厂加热炉改造总承包合同', contractAmount: 48200000,
    planStartDate: '2024-04-01', planEndDate: '2025-03-15',
    approvalNo: 'LX-2024-010', status: '主管部门审核中',
    stage: 'department',
    actualStartDate: '2024-04-05', actualEndDate: '2025-06-20',
    exemptionDays: 70, exemptionType: 'B结算',
    exemptionAmount: 750000, agreedPenaltyAmount: 2200000,
    finalPenaltyAmount: 1450000,
    contractText: 'NG-GC-2024-010 标准合同文本',
    overdueReason: '加热炉耐材采购受环保限产影响供货延迟45天，现场交叉施工协调增加工期25天。',
    confirmReason: '',
    attachments: ['耐材供货说明.pdf', '交叉协调纪要.pdf', '免考核申请函.pdf'],
    currentOperator: '施海峰', applyDate: '2024-11-10',
    operatorDate: '2024-11-22', operatorTime: '09:00:00',
  },
  {
    id: 'eea-008', appId: 'eea-008', contractId: 'eec-005', contractNo: 'NG-GC-2024-017',
    contractName: '公辅水处理中心扩建施工合同', contractAmount: 19600000,
    planStartDate: '2024-05-20', planEndDate: '2024-12-15',
    approvalNo: 'LX-2024-017', status: '主管部门审核中',
    stage: 'department',
    actualStartDate: '2024-05-25', actualEndDate: '2025-03-10',
    exemptionDays: 50, exemptionType: 'A工期',
    exemptionAmount: 320000, agreedPenaltyAmount: 1000000,
    finalPenaltyAmount: 680000,
    contractText: 'NG-GC-2024-017 标准合同文本',
    overdueReason: '桩基检测发现承载力不足需要补桩加固增加工期30天，设备基础预埋件安装调试延长20天。',
    confirmReason: '',
    attachments: ['桩基检测报告.pdf', '补桩施工说明.pdf', '免考核申请函.pdf'],
    currentOperator: '宋宁岐', applyDate: '2024-12-05',
    operatorDate: '2024-12-18', operatorTime: '10:30:00',
  },
  {
    id: 'eea-009', appId: 'eea-009', contractId: 'eec-007', contractNo: 'NG-GC-2024-023',
    contractName: '炼铁厂高炉喷煤系统改造合同', contractAmount: 13400000,
    planStartDate: '2024-07-05', planEndDate: '2024-11-30',
    approvalNo: 'LX-2024-023', status: '已通过',
    stage: 'department',
    actualStartDate: '2024-07-10', actualEndDate: '2025-02-15',
    exemptionDays: 40, exemptionType: 'B结算',
    exemptionAmount: 250000, agreedPenaltyAmount: 800000,
    finalPenaltyAmount: 550000,
    contractText: 'NG-GC-2024-023 标准合同文本',
    overdueReason: '喷煤管道到货延迟及磨煤机安装调试超预期，合计延误约40天。',
    confirmReason: '经审核确认，延期原因合理，同意免除考核40天，免除考核金额25万元。',
    attachments: ['管道交付记录.pdf', '设备调试报告.pdf', '审批纪要.pdf'],
    currentOperator: '彭工', applyDate: '2024-11-20',
    operatorDate: '2024-12-10', operatorTime: '14:00:00',
  },
];

export const examExemptionApprovalRecords: ExamExemptionApprovalRecord[] = [
  { id: 'eer-001', appId: 'eea-001', seq: 1, stage: '项目组申请', operation: '提交申请', opinion: '基础腐蚀加固及耐材延迟导致工期延长，申请免除考核45天。', operator: '陈工', operateDate: '2024-07-15', operateTime: '14:30:00' },
  { id: 'eer-002', appId: 'eea-003', seq: 1, stage: '项目组申请', operation: '提交申请', opinion: '余热锅炉制造周期延长及管道拆除范围扩大，申请免除考核55天。', operator: '黄工', operateDate: '2024-08-20', operateTime: '09:00:00' },
  { id: 'eer-003', appId: 'eea-003', seq: 2, stage: '项目组审核', operation: '审核通过', opinion: '原因属实，材料齐全，同意呈核。', operator: '张涛', operateDate: '2024-08-28', operateTime: '14:00:00' },
  { id: 'eer-004', appId: 'eea-003', seq: 3, stage: '项目组审核', operation: '呈核', opinion: '呈核制造部施海峰科长审核。', operator: '张涛', operateDate: '2024-08-28', operateTime: '15:00:00' },
  { id: 'eer-005', appId: 'eea-003', seq: 4, stage: '制造部审核', operation: '审核中', opinion: '', operator: '施海峰', operateDate: '2024-09-05', operateTime: '10:00:00' },
  { id: 'eer-006', appId: 'eea-004', seq: 1, stage: '项目组申请', operation: '提交申请', opinion: '耐材供货延迟及桩基方案调整，申请免除考核60天。', operator: '杨工', operateDate: '2024-09-15', operateTime: '08:30:00' },
  { id: 'eer-007', appId: 'eea-004', seq: 2, stage: '项目组审核', operation: '审核通过', opinion: '延期原因合理，材料完整，呈核制造部。', operator: '陈志远', operateDate: '2024-09-22', operateTime: '10:00:00' },
  { id: 'eer-008', appId: 'eea-004', seq: 3, stage: '项目组审核', operation: '呈核', opinion: '呈核制造部宋宁岐科长。', operator: '陈志远', operateDate: '2024-09-22', operateTime: '11:00:00' },
  { id: 'eer-009', appId: 'eea-004', seq: 4, stage: '制造部审核', operation: '审核中', opinion: '', operator: '宋宁岐', operateDate: '2024-09-28', operateTime: '14:00:00' },
  { id: 'eer-010', appId: 'eea-005', seq: 1, stage: '项目组申请', operation: '提交申请', opinion: '进口件延迟及基础处理增加工期，申请免除考核40天。', operator: '彭工', operateDate: '2024-11-01', operateTime: '08:00:00' },
  { id: 'eer-011', appId: 'eea-005', seq: 2, stage: '项目组审核', operation: '审核通过', opinion: '材料详实，原因充分。', operator: '赵志强', operateDate: '2024-11-08', operateTime: '09:30:00' },
  { id: 'eer-012', appId: 'eea-005', seq: 3, stage: '项目组审核', operation: '呈核', opinion: '呈核制造部。', operator: '赵志强', operateDate: '2024-11-08', operateTime: '10:00:00' },
  { id: 'eer-013', appId: 'eea-005', seq: 4, stage: '制造部审核', operation: '确认通过', opinion: '经审核批准免除考核40天，免除考核金额28万元。', operator: '宋宁岐', operateDate: '2024-11-20', operateTime: '09:30:00' },
  { id: 'eer-014', appId: 'eea-006', seq: 1, stage: '项目组申请', operation: '提交申请', opinion: '进口设备延迟和交叉作业影响，申请免除考核35天。', operator: '刘工', operateDate: '2024-06-20', operateTime: '09:00:00' },
  { id: 'eer-015', appId: 'eea-006', seq: 2, stage: '项目组审核', operation: '退回', opinion: '延期原因说明不够详细，请补充进口设备具体延迟天数和交叉作业影响的详细分析后重新提交。', operator: '李明', operateDate: '2024-07-05', operateTime: '11:00:00' },
];

export function getExamContractById(id: string): ExamExemptionContract | undefined {
  return examExemptionContracts.find((c) => c.id === id);
}

export function getExamAppsByContractId(contractId: string): ExamExemptionApplication[] {
  return examExemptionApplications.filter((a) => a.contractId === contractId);
}

export function getExamAppById(id: string): ExamExemptionApplication | undefined {
  return examExemptionApplications.find((a) => a.id === id);
}

export function getExamApprovalRecordsByAppId(appId: string): ExamExemptionApprovalRecord[] {
  return examExemptionApprovalRecords.filter((r) => r.appId === appId).sort((a, b) => a.seq - b.seq);
}

export const exemptionTypes = ['A工期', 'B结算'];
export const contractTypes = ['施工总承包', '专业分包', '劳务分包', '设备采购', '设计合同', 'EPC总承包'];
export const contractStatuses = ['执行中', '已完工', '已暂停', '已终止'];