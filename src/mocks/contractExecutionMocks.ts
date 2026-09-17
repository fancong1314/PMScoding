export interface Contract {
  id: string;
  approvalNo: string;
  contractNo: string;
  contractName: string;
  contractType: string;
  contractorNo: string;
  contractorName: string;
  mainContent: string;
  contractDate: string;
  prepaymentPercent: number;
  warrantyPercent: number;
  paymentPercent: number;
  revisedAmount: number;
  contractStatus: string;
  hasSupervisor: boolean;
  contractAmount: number;
  constructionUnit: string;
  contractorUnit: string;
  contractContent: string;
}

export interface CheckItem {
  id: string;
  code: string;
  content: string;
  sortOrder: number;
  enabled: boolean;
  createTime: string;
}

export interface ApprovalRecord {
  id: string;
  stage: string;
  action: string;
  opinion: string;
  content: string;
  operator: string;
  date: string;
  time: string;
  status: string;
}

export interface CommencementApply {
  id: string;
  contractId: string;
  applyNo: string;
  contractNo: string;
  contractName: string;
  contractAmount: number;
  constructionUnit: string;
  contractorUnit: string;
  contractContent: string;
  status: '待审批' | '已通过' | '已退回' | '已签发' | '已打印';
  applyTime: string;
  abnormalStartDate: string;
  drawingReviewFiles: string[];
  contractText: string;
  contractContentInput: string;
  approvalOpinion: string;
  checkItems: CheckItemRecord[];
  approvalRecords: ApprovalRecord[];
  issueFiles: string[];
  issueTime: string;
}

export interface CheckItemRecord {
  id: string;
  code: string;
  content: string;
  checked: boolean;
  attachments: string[];
}

export interface HandoverApprovalRecord {
  id: string;
  stage: string;
  action: string;
  opinion: string;
  content: string;
  operator: string;
  date: string;
  time: string;
}

export interface HandoverApply {
  id: string;
  contractId: string;
  projectName: string;
  contractNo: string;
  approvalNo: string;
  constructionUnit: string;
  contractorUnit: string;
  supervisorUnit: string;
  constructionCompany: string;
  responsibleUnit: string;
  startDate: string;
  completionDate: string;
  acceptanceConclusion: string;
  content: string;
  approvalStatus: string;
  currentReviewer: string;
  handoverFiles: string[];
  approvalRecords: HandoverApprovalRecord[];
}

export interface OldMaterialRecord {
  name: string;
  unit: string;
  quantity: number;
}

export interface CompletionApprovalRecord {
  id: string;
  stage: string;
  action: string;
  opinion: string;
  operator: string;
  date: string;
  time: string;
}

export interface CompletionApply {
  id: string;
  contractId: string;
  projectName: string;
  contractNo: string;
  approvalNo: string;
  qualityRating: string;
  builtPerDrawings: string;
  changesCompleted: string;
  acceptanceOpinion: string;
  approvalStatus: string;
  currentReviewer: string;
  currentStage: string;
  completionDate: string;
  oldMaterialRecords: OldMaterialRecord[];
  approvalRecords: CompletionApprovalRecord[];
}

export interface StopResumeApply {
  id: string;
  contractId: string;
  changeNo: string;
  approvalNo: string;
  contractNo: string;
  contractName: string;
  reason: string;
  description: string;
  type: string;
  status: string;
  date: string;
  fileCount: number;
  creator: string;
  createDate: string;
  exemptAssessment: string;
  modifier: string;
  modifyDate: string;
  createTime: string;
  modifyTime: string;
  source: string;
  approvalRecords: ApprovalRecord[];
}

export const contractTypes = ['施工总承包', '专业分包', '劳务分包', '设备采购', '设计合同', '监理合同', '咨询合同', 'EPC总承包'];
export const contractStatuses = ['执行中', '已完工', '已结算', '已暂停', '已终止', '草稿'];

export const contracts: Contract[] = [
  { id: 'c-001', approvalNo: 'LX-2026-001', contractNo: 'HT-2026-001', contractName: '高炉本体耐材砌筑施工合同', contractType: '施工总承包', contractorNo: 'CS-001', contractorName: '南京钢铁建设集团有限公司', mainContent: '高炉本体耐材砌筑及配套设施安装', contractDate: '2026-01-15', prepaymentPercent: 20, warrantyPercent: 5, paymentPercent: 80, revisedAmount: 2450000, contractStatus: '执行中', hasSupervisor: false, contractAmount: 2450000, constructionUnit: '炼铁事业部', contractorUnit: '南京钢铁建设集团有限公司', contractContent: '高炉本体耐材砌筑施工及热风炉配套设施安装工程' },
  { id: 'c-002', approvalNo: 'LX-2026-002', contractNo: 'HT-2026-002', contractName: '转炉设备基础施工合同', contractType: '专业分包', contractorNo: 'CS-002', contractorName: '江苏建工集团有限公司', mainContent: '转炉设备基础及钢结构施工', contractDate: '2026-02-01', prepaymentPercent: 15, warrantyPercent: 3, paymentPercent: 85, revisedAmount: 1850000, contractStatus: '执行中', hasSupervisor: true, contractAmount: 1850000, constructionUnit: '炼钢事业部', contractorUnit: '江苏建工集团有限公司', contractContent: '转炉设备基础施工及钢结构安装' },
  { id: 'c-003', approvalNo: 'LX-2026-003', contractNo: 'HT-2026-003', contractName: '轧机主传动装置安装合同', contractType: '设备采购', contractorNo: 'CS-003', contractorName: '西门子工业自动化有限公司', mainContent: '轧机主传动装置采购及安装调试', contractDate: '2026-02-20', prepaymentPercent: 30, warrantyPercent: 10, paymentPercent: 70, revisedAmount: 3200000, contractStatus: '执行中', hasSupervisor: false, contractAmount: 3200000, constructionUnit: '轧钢事业部', contractorUnit: '西门子工业自动化有限公司', contractContent: '轧机主传动装置采购、安装及调试' },
  { id: 'c-004', approvalNo: 'LX-2026-004', contractNo: 'HT-2026-004', contractName: '自动化控制系统编程调试合同', contractType: '设计合同', contractorNo: 'CS-004', contractorName: '宝信软件股份有限公司', mainContent: '自动化控制系统编程及调试', contractDate: '2026-03-01', prepaymentPercent: 25, warrantyPercent: 5, paymentPercent: 75, revisedAmount: 850000, contractStatus: '执行中', hasSupervisor: true, contractAmount: 850000, constructionUnit: '技术中心', contractorUnit: '宝信软件股份有限公司', contractContent: '自动化控制系统编程调试及集成' },
  { id: 'c-005', approvalNo: 'LX-2026-005', contractNo: 'HT-2026-005', contractName: '原料场智能化设备采购合同', contractType: '设备采购', contractorNo: 'CS-005', contractorName: '中冶赛迪工程技术股份有限公司', mainContent: '原料场智能化设备采购及安装', contractDate: '2026-03-10', prepaymentPercent: 20, warrantyPercent: 5, paymentPercent: 80, revisedAmount: 1680000, contractStatus: '执行中', hasSupervisor: false, contractAmount: 1680000, constructionUnit: '能源环保部', contractorUnit: '中冶赛迪工程技术股份有限公司', contractContent: '原料场智能化设备采购安装' },
  { id: 'c-006', approvalNo: 'LX-2026-006', contractNo: 'HT-2026-006', contractName: '环保除尘设施土建施工合同', contractType: '施工总承包', contractorNo: 'CS-006', contractorName: '中冶天工集团有限公司', mainContent: '环保除尘设施土建施工', contractDate: '2026-03-20', prepaymentPercent: 15, warrantyPercent: 3, paymentPercent: 85, revisedAmount: 1200000, contractStatus: '执行中', hasSupervisor: true, contractAmount: 1200000, constructionUnit: '安全能环部', contractorUnit: '中冶天工集团有限公司', contractContent: '环保除尘设施土建施工及设备安装' },
  { id: 'c-007', approvalNo: 'LX-2026-007', contractNo: 'HT-2026-007', contractName: '余热发电锅炉安装合同', contractType: 'EPC总承包', contractorNo: 'CS-007', contractorName: '哈尔滨锅炉厂有限公司', mainContent: '余热发电锅炉安装调试', contractDate: '2026-04-01', prepaymentPercent: 25, warrantyPercent: 5, paymentPercent: 75, revisedAmount: 2100000, contractStatus: '执行中', hasSupervisor: false, contractAmount: 2100000, constructionUnit: '能源环保部', contractorUnit: '哈尔滨锅炉厂有限公司', contractContent: '余热发电锅炉安装及系统调试' },
  { id: 'c-008', approvalNo: 'LX-2026-008', contractNo: 'HT-2026-008', contractName: '污水处理厂设备采购合同', contractType: '设备采购', contractorNo: 'CS-008', contractorName: '北控水务集团有限公司', mainContent: '污水处理厂设备采购及安装', contractDate: '2026-04-15', prepaymentPercent: 20, warrantyPercent: 5, paymentPercent: 80, revisedAmount: 1350000, contractStatus: '执行中', hasSupervisor: true, contractAmount: 1350000, constructionUnit: '能源环保部', contractorUnit: '北控水务集团有限公司', contractContent: '污水处理厂设备采购安装调试' },
  { id: 'c-009', approvalNo: 'LX-2026-009', contractNo: 'HT-2026-009', contractName: '配电室高低压设备更新合同', contractType: '设备采购', contractorNo: 'CS-009', contractorName: '许继电气股份有限公司', mainContent: '配电室高低压设备更新', contractDate: '2026-04-20', prepaymentPercent: 30, warrantyPercent: 5, paymentPercent: 70, revisedAmount: 780000, contractStatus: '已完工', hasSupervisor: false, contractAmount: 780000, constructionUnit: '设备部', contractorUnit: '许继电气股份有限公司', contractContent: '配电室高低压开关柜更新' },
  { id: 'c-010', approvalNo: 'LX-2026-010', contractNo: 'HT-2026-010', contractName: '办公楼信息化基础设施建设合同', contractType: '设计合同', contractorNo: 'CS-010', contractorName: '华为技术有限公司', mainContent: '办公楼信息化基础设施建设', contractDate: '2026-05-01', prepaymentPercent: 25, warrantyPercent: 5, paymentPercent: 75, revisedAmount: 950000, contractStatus: '执行中', hasSupervisor: true, contractAmount: 950000, constructionUnit: '信息化部', contractorUnit: '华为技术有限公司', contractContent: '办公楼信息化网络及系统建设' },
  { id: 'c-011', approvalNo: 'LX-2026-011', contractNo: 'HT-2026-011', contractName: '厂区道路硬化及管网改造合同', contractType: '施工总承包', contractorNo: 'CS-011', contractorName: '中铁十七局集团有限公司', mainContent: '厂区道路硬化及管网改造', contractDate: '2026-05-10', prepaymentPercent: 15, warrantyPercent: 3, paymentPercent: 85, revisedAmount: 1580000, contractStatus: '执行中', hasSupervisor: false, contractAmount: 1580000, constructionUnit: '基建部', contractorUnit: '中铁十七局集团有限公司', contractContent: '厂区道路硬化及地下管网改造' },
  { id: 'c-012', approvalNo: 'LX-2026-012', contractNo: 'HT-2026-012', contractName: '安全防护设施完善升级合同', contractType: '劳务分包', contractorNo: 'CS-012', contractorName: '南京安防工程有限公司', mainContent: '安全防护设施完善升级', contractDate: '2026-05-15', prepaymentPercent: 10, warrantyPercent: 2, paymentPercent: 90, revisedAmount: 420000, contractStatus: '执行中', hasSupervisor: true, contractAmount: 420000, constructionUnit: '安全能环部', contractorUnit: '南京安防工程有限公司', contractContent: '安全防护设施完善升级施工' },
  { id: 'c-013', approvalNo: 'LX-2026-013', contractNo: 'HT-2026-013', contractName: '仓储物流中心建设工程合同', contractType: 'EPC总承包', contractorNo: 'CS-013', contractorName: '中交第一航务工程局有限公司', mainContent: '仓储物流中心建设工程', contractDate: '2026-05-20', prepaymentPercent: 20, warrantyPercent: 5, paymentPercent: 80, revisedAmount: 2680000, contractStatus: '草稿', hasSupervisor: false, contractAmount: 2680000, constructionUnit: '物流部', contractorUnit: '中交第一航务工程局有限公司', contractContent: '仓储物流中心建设工程总承包' },
  { id: 'c-014', approvalNo: 'LX-2026-014', contractNo: 'HT-2026-014', contractName: '环保监测站房建设合同', contractType: '施工总承包', contractorNo: 'CS-014', contractorName: '江苏省环境工程有限公司', mainContent: '环保监测站房建设', contractDate: '2026-05-25', prepaymentPercent: 15, warrantyPercent: 3, paymentPercent: 85, revisedAmount: 680000, contractStatus: '已暂停', hasSupervisor: true, contractAmount: 680000, constructionUnit: '能源环保部', contractorUnit: '江苏省环境工程有限公司', contractContent: '环保监测站房建设及设备安装' },
  { id: 'c-015', approvalNo: 'LX-2026-015', contractNo: 'HT-2026-015', contractName: '消防系统升级改造合同', contractType: '专业分包', contractorNo: 'CS-015', contractorName: '南京消防工程有限公司', mainContent: '消防系统升级改造', contractDate: '2026-06-01', prepaymentPercent: 20, warrantyPercent: 5, paymentPercent: 80, revisedAmount: 560000, contractStatus: '执行中', hasSupervisor: false, contractAmount: 560000, constructionUnit: '安全能环部', contractorUnit: '南京消防工程有限公司', contractContent: '消防系统升级改造及验收' },
];

export const defaultCheckItems: CheckItem[] = [
  { id: 'ci-001', code: 'CK-001', content: '监理单位对施工准备情况进行核查', sortOrder: 1, enabled: true, createTime: '2026-01-01 09:00:00' },
  { id: 'ci-002', code: 'CK-002', content: '已生成项目二维码', sortOrder: 2, enabled: true, createTime: '2026-01-01 09:00:00' },
  { id: 'ci-003', code: 'CK-003', content: '施工人员经过公司安全培训并取得证件', sortOrder: 3, enabled: true, createTime: '2026-01-01 09:00:00' },
  { id: 'ci-004', code: 'CK-004', content: '施工组织设计已编制并通过审批', sortOrder: 4, enabled: true, createTime: '2026-01-01 09:00:00' },
  { id: 'ci-005', code: 'CK-005', content: '施工现场安全防护措施已到位', sortOrder: 5, enabled: true, createTime: '2026-01-01 09:00:00' },
  { id: 'ci-006', code: 'CK-006', content: '施工机械设备已进场并验收合格', sortOrder: 6, enabled: true, createTime: '2026-01-01 09:00:00' },
  { id: 'ci-007', code: 'CK-007', content: '临时用电方案已审批并实施', sortOrder: 7, enabled: true, createTime: '2026-01-01 09:00:00' },
  { id: 'ci-008', code: 'CK-008', content: '特种作业人员资质证书齐全有效', sortOrder: 8, enabled: true, createTime: '2026-01-01 09:00:00' },
  { id: 'ci-009', code: 'CK-009', content: '材料进场报验手续已完成', sortOrder: 9, enabled: true, createTime: '2026-01-01 09:00:00' },
  { id: 'ci-010', code: 'CK-010', content: '危大工程专项施工方案已审批', sortOrder: 10, enabled: true, createTime: '2026-01-01 09:00:00' },
];

function generateCheckItemRecords(): CheckItemRecord[] {
  return defaultCheckItems.filter((i) => i.enabled).map((item) => ({
    id: item.id,
    code: item.code,
    content: item.content,
    checked: Math.random() > 0.3,
    attachments: item.id === 'ci-001' ? ['监理核查报告.pdf'] : item.id === 'ci-003' ? ['培训合格证.pdf'] : [],
  }));
}

function generateApprovalRecords(): ApprovalRecord[] {
  return [
    { id: 'ar-001', stage: '发起申请', action: '提交开工申请', opinion: '申请开工', content: '提交开工令申请', operator: '张明远', date: '2026-05-10', time: '09:00:00', status: '已通过' },
    { id: 'ar-002', stage: '部门审核', action: '审核通过', opinion: '施工准备充分，同意开工', content: '审核通过', operator: '李建国', date: '2026-05-10', time: '14:00:00', status: '已通过' },
    { id: 'ar-003', stage: '分管领导审批', action: '审批通过', opinion: '符合开工条件，同意开工', content: '审批通过', operator: '王志强', date: '2026-05-11', time: '09:00:00', status: '已通过' },
  ];
}

function generateApprovalRecordsReturned(): ApprovalRecord[] {
  return [
    { id: 'ar-001', stage: '发起申请', action: '提交开工申请', opinion: '申请开工', content: '提交开工令申请', operator: '张明远', date: '2026-05-15', time: '09:00:00', status: '已通过' },
    { id: 'ar-002', stage: '部门审核', action: '退回', opinion: '施工准备不足，需补充安全培训记录', content: '退回至申报人', operator: '李建国', date: '2026-05-15', time: '14:00:00', status: '已退回' },
  ];
}

function generateApprovalRecordsPending(): ApprovalRecord[] {
  return [
    { id: 'ar-001', stage: '发起申请', action: '提交开工申请', opinion: '申请开工', content: '提交开工令申请', operator: '张明远', date: '2026-05-20', time: '09:00:00', status: '已通过' },
    { id: 'ar-002', stage: '部门审核', action: '审核通过', opinion: '施工准备充分，同意开工', content: '审核通过', operator: '李建国', date: '2026-05-20', time: '14:00:00', status: '已通过' },
    { id: 'ar-003', stage: '分管领导审批', action: '待审批', opinion: '', content: '', operator: '王志强', date: '', time: '', status: '待审批' },
  ];
}

const statusPool: CommencementApply['status'][] = ['待审批', '已通过', '已退回', '已签发', '待审批', '已通过', '已打印', '待审批', '已通过', '已签发'];

export const commencementApplies: CommencementApply[] = contracts.flatMap((contract, cIdx) => {
  const count = Math.floor(Math.random() * 3) + 1;
  const items: CommencementApply[] = [];
  for (let i = 0; i < count; i++) {
    const status = statusPool[(cIdx + i) % statusPool.length];
    let approvalRecords: ApprovalRecord[] = [];
    if (status === '已通过' || status === '已签发' || status === '已打印') {
      approvalRecords = generateApprovalRecords();
    } else if (status === '已退回') {
      approvalRecords = generateApprovalRecordsReturned();
    } else if (status === '待审批') {
      approvalRecords = generateApprovalRecordsPending();
    }
    items.push({
      id: `apply-${contract.id}-${i + 1}`,
      contractId: contract.id,
      applyNo: `KG-${contract.contractNo}-${String(i + 1).padStart(2, '0')}`,
      contractNo: contract.contractNo,
      contractName: contract.contractName,
      contractAmount: contract.contractAmount,
      constructionUnit: contract.constructionUnit,
      contractorUnit: contract.contractorUnit,
      contractContent: contract.contractContent,
      status,
      applyTime: `2026-${String(1 + (cIdx % 5)).padStart(2, '0')}-${String(5 + (i * 7)).padStart(2, '0')} 10:00:00`,
      abnormalStartDate: `2026-${String(2 + (cIdx % 4)).padStart(2, '0')}-${String(10 + (i * 5)).padStart(2, '0')}`,
      drawingReviewFiles: ['施工图审查意见.pdf', '设计变更单.pdf'],
      contractText: contract.contractContent,
      contractContentInput: contract.contractContent,
      approvalOpinion: status === '已通过' || status === '已签发' ? '施工准备充分，符合开工条件，同意开工' : status === '已退回' ? '需补充安全培训记录' : '',
      checkItems: generateCheckItemRecords(),
      approvalRecords,
      issueFiles: status === '已签发' || status === '已打印' ? ['开工令签发文件.pdf'] : [],
      issueTime: status === '已签发' || status === '已打印' ? '2026-05-12 10:00:00' : '',
    });
  }
  return items;
});

export function getContractById(id: string): Contract | undefined {
  return contracts.find((c) => c.id === id);
}

export function getContractApplies(contractId: string): CommencementApply[] {
  return commencementApplies.filter((a) => a.contractId === contractId);
}

export function getApplyById(applyId: string): CommencementApply | undefined {
  return commencementApplies.find((a) => a.id === applyId);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ---- 交工 Mock Data ----

function generateHandoverRecords(status: string): HandoverApprovalRecord[] {
  if (status === '已通过') return [
    { id: 'hr-001', stage: '申报阶段', action: '提交交工申请', opinion: '工程已完工，申请交工验收', content: '提交交工验收申请', operator: '赵志刚', date: '2026-06-01', time: '09:30:00' },
    { id: 'hr-002', stage: '甲方审批', action: '审批通过', opinion: '验收合格，同意交工', content: '交工验收结论：工程质量合格，符合设计及规范要求', operator: '陈建国', date: '2026-06-03', time: '14:00:00' },
  ];
  if (status === '已退回') return [
    { id: 'hr-001', stage: '申报阶段', action: '提交交工申请', opinion: '工程已完工，申请交工验收', content: '提交交工验收申请', operator: '赵志刚', date: '2026-06-05', time: '10:00:00' },
    { id: 'hr-002', stage: '甲方审批', action: '退回', opinion: '实物交接表不完整，请补充后重新提交', content: '退回至申报人', operator: '陈建国', date: '2026-06-06', time: '11:30:00' },
  ];
  if (status === '待审批') return [
    { id: 'hr-001', stage: '申报阶段', action: '提交交工申请', opinion: '工程已完工，申请交工验收', content: '提交交工验收申请', operator: '赵志刚', date: '2026-06-08', time: '08:30:00' },
  ];
  return [];
}

export const handoverApplies: HandoverApply[] = [
  { id: 'ho-001', contractId: 'c-001', projectName: '1号高炉本体耐材砌筑工程', contractNo: 'HT-2026-001', approvalNo: 'LX-2026-001', constructionUnit: '炼铁事业部', contractorUnit: '南京钢铁建设集团有限公司', supervisorUnit: '南京诚信监理有限公司', constructionCompany: '南京钢铁建设集团有限公司', responsibleUnit: '炼铁事业部', startDate: '2026-01-20', completionDate: '2026-05-28', acceptanceConclusion: '工程质量合格，耐材砌筑符合设计及规范要求，热风炉配套设施安装到位，系统运行正常', content: '1号高炉本体耐材砌筑工程已按设计图纸及合同要求完成全部施工内容，热风炉配套设施安装调试完成，经自检合格，申请交工验收', approvalStatus: '已通过', currentReviewer: '', handoverFiles: ['实物交接表-高炉耐材.pdf', '施工质量自检报告.pdf'], approvalRecords: generateHandoverRecords('已通过') },
  { id: 'ho-002', contractId: 'c-002', projectName: '转炉设备基础施工工程', contractNo: 'HT-2026-002', approvalNo: 'LX-2026-002', constructionUnit: '炼钢事业部', contractorUnit: '江苏建工集团有限公司', supervisorUnit: '南京诚信监理有限公司', constructionCompany: '江苏建工集团有限公司', responsibleUnit: '炼钢事业部', startDate: '2026-02-15', completionDate: '2026-05-20', acceptanceConclusion: '', content: '转炉设备基础施工及钢结构安装已全部完成，经自检符合设计及规范要求', approvalStatus: '待审批', currentReviewer: '陈建国', handoverFiles: ['实物交接表-转炉基础.pdf'], approvalRecords: generateHandoverRecords('待审批') },
  { id: 'ho-003', contractId: 'c-003', projectName: '轧机主传动装置安装工程', contractNo: 'HT-2026-003', approvalNo: 'LX-2026-003', constructionUnit: '轧钢事业部', contractorUnit: '西门子工业自动化有限公司', supervisorUnit: '北京赛瑞斯监理有限公司', constructionCompany: '西门子工业自动化有限公司', responsibleUnit: '轧钢事业部', startDate: '2026-03-01', completionDate: '2026-06-02', acceptanceConclusion: '设备安装调试完成，各项技术指标达标，传动系统运行稳定', content: '轧机主传动装置采购、安装及调试工作已完成，系统联动试车合格', approvalStatus: '已通过', currentReviewer: '', handoverFiles: ['实物交接表-轧机传动.pdf'], approvalRecords: generateHandoverRecords('已通过') },
  { id: 'ho-004', contractId: 'c-005', projectName: '原料场智能化设备安装工程', contractNo: 'HT-2026-005', approvalNo: 'LX-2026-005', constructionUnit: '能源环保部', contractorUnit: '中冶赛迪工程技术股份有限公司', supervisorUnit: '南京诚信监理有限公司', constructionCompany: '中冶赛迪工程技术股份有限公司', responsibleUnit: '能源环保部', startDate: '2026-03-20', completionDate: '2026-06-05', acceptanceConclusion: '', content: '原料场智能化设备采购安装已完成，系统调试中，部分传感器需重新校准', approvalStatus: '已退回', currentReviewer: '', handoverFiles: ['实物交接表-原料场设备.pdf'], approvalRecords: generateHandoverRecords('已退回') },
  { id: 'ho-005', contractId: 'c-006', projectName: '环保除尘设施土建施工工程', contractNo: 'HT-2026-006', approvalNo: 'LX-2026-006', constructionUnit: '安全能环部', contractorUnit: '中冶天工集团有限公司', supervisorUnit: '南京诚信监理有限公司', constructionCompany: '中冶天工集团有限公司', responsibleUnit: '安全能环部', startDate: '2026-04-01', completionDate: '2026-06-03', acceptanceConclusion: '土建施工及设备安装全部完成，除尘系统运行正常，排放达标', content: '环保除尘设施土建施工及设备安装全部完成，经第三方检测排放达标', approvalStatus: '已通过', currentReviewer: '', handoverFiles: ['实物交接表-除尘设施.pdf', '排放检测报告.pdf'], approvalRecords: generateHandoverRecords('已通过') },
  { id: 'ho-006', contractId: 'c-007', projectName: '余热发电锅炉安装工程', contractNo: 'HT-2026-007', approvalNo: 'LX-2026-007', constructionUnit: '能源环保部', contractorUnit: '哈尔滨锅炉厂有限公司', supervisorUnit: '北京赛瑞斯监理有限公司', constructionCompany: '哈尔滨锅炉厂有限公司', responsibleUnit: '能源环保部', startDate: '2026-04-10', completionDate: '2026-06-01', acceptanceConclusion: '', content: '余热发电锅炉安装及系统调试完成，等待最终验收', approvalStatus: '待审批', currentReviewer: '刘国栋', handoverFiles: ['实物交接表-余热锅炉.pdf'], approvalRecords: generateHandoverRecords('待审批') },
];

// ---- 停复工 Mock Data ----

function generateStopResumeRecords(status: string): ApprovalRecord[] {
  if (status === '已通过') return [
    { id: 'sr-001', stage: '发起申请', action: '提交停复工申请', opinion: '因现场原因申请停工', content: '提交停复工申请', operator: '周建国', date: '2026-05-20', time: '14:00:00', status: '已通过' },
    { id: 'sr-002', stage: '部门审批', action: '审批通过', opinion: '情况属实，同意停工', content: '审批通过', operator: '李建国', date: '2026-05-21', time: '09:00:00', status: '已通过' },
  ];
  if (status === '审批中') return [
    { id: 'sr-001', stage: '发起申请', action: '提交停复工申请', opinion: '因现场原因申请停工', content: '提交停复工申请', operator: '周建国', date: '2026-06-02', time: '10:00:00', status: '已通过' },
    { id: 'sr-002', stage: '部门审批', action: '待审批', opinion: '', content: '', operator: '陈建国', date: '', time: '', status: '待审批' },
  ];
  if (status === '已退回') return [
    { id: 'sr-001', stage: '发起申请', action: '提交停复工申请', opinion: '申请复工', content: '提交复工申请', operator: '钱晓明', date: '2026-06-03', time: '08:00:00', status: '已通过' },
    { id: 'sr-002', stage: '部门审批', action: '退回', opinion: '复工条件不满足，安全措施未到位', content: '退回至申报人', operator: '李建国', date: '2026-06-03', time: '16:00:00', status: '已退回' },
  ];
  return [];
}

export const stopResumeApplies: StopResumeApply[] = [
  { id: 'sr-001', contractId: 'c-001', changeNo: 'SR-2026-001', approvalNo: 'LX-2026-001', contractNo: 'HT-2026-001', contractName: '高炉本体耐材砌筑施工合同', reason: '现场施工区域发现不明管线，需管线产权单位确认后方可继续施工', description: '1号高炉区域地下发现不明管线，需协调管线产权单位到场确认，预计停工7天', type: '合同停工', status: '已通过', date: '2026-05-20', fileCount: 3, creator: '周建国', createDate: '2026-05-20', exemptAssessment: '否', modifier: '周建国', modifyDate: '2026-05-20', createTime: '14:00:00', modifyTime: '14:00:00', source: '甲方发起', approvalRecords: generateStopResumeRecords('已通过') },
  { id: 'sr-002', contractId: 'c-002', changeNo: 'SR-2026-002', approvalNo: 'LX-2026-002', contractNo: 'HT-2026-002', contractName: '转炉设备基础施工合同', reason: '设备基础浇筑完成后需进行28天养护，养护期间现场停工', description: '转炉设备基础混凝土浇筑完成，按规范要求进行28天标准养护，养护期间现场停工', type: '合同停工', status: '审批中', date: '2026-06-02', fileCount: 2, creator: '孙志强', createDate: '2026-06-02', exemptAssessment: '是', modifier: '孙志强', modifyDate: '2026-06-02', createTime: '10:00:00', modifyTime: '10:00:00', source: '施工方发起', approvalRecords: generateStopResumeRecords('审批中') },
  { id: 'sr-003', contractId: 'c-003', changeNo: 'SR-2026-003', approvalNo: 'LX-2026-003', contractNo: 'HT-2026-003', contractName: '轧机主传动装置安装合同', reason: '设备安装完成，系统调试合格，申请复工进行联动试车', description: '轧机主传动装置安装调试工作已完成，设备运行参数达标，申请复工进行全线联动试车', type: '合同复工', status: '已通过', date: '2026-05-25', fileCount: 5, creator: '吴建华', createDate: '2026-05-25', exemptAssessment: '否', modifier: '吴建华', modifyDate: '2026-05-25', createTime: '09:30:00', modifyTime: '09:30:00', source: '甲方发起', approvalRecords: generateStopResumeRecords('已通过') },
  { id: 'sr-004', contractId: 'c-005', changeNo: 'SR-2026-004', approvalNo: 'LX-2026-005', contractNo: 'HT-2026-005', contractName: '原料场智能化设备采购合同', reason: '设备安装施工队因安全事故被责令停工整改', description: '施工队发生一起轻伤安全事故，安监部门责令停工整改，整改完成后申请复工', type: '合同停工', status: '已退回', date: '2026-06-03', fileCount: 1, creator: '钱晓明', createDate: '2026-06-03', exemptAssessment: '否', modifier: '钱晓明', modifyDate: '2026-06-03', createTime: '08:00:00', modifyTime: '08:00:00', source: '施工方发起', approvalRecords: generateStopResumeRecords('已退回') },
  { id: 'sr-005', contractId: 'c-006', changeNo: 'SR-2026-005', approvalNo: 'LX-2026-006', contractNo: 'HT-2026-006', contractName: '环保除尘设施土建施工合同', reason: '施工区域遇连续暴雨天气，现场无法正常施工', description: '6月1日至6月5日连续暴雨，施工现场积水严重，无法进行土建施工，申请停工5天', type: '合同停工', status: '已通过', date: '2026-06-01', fileCount: 4, creator: '郑光明', createDate: '2026-06-01', exemptAssessment: '是', modifier: '郑光明', modifyDate: '2026-06-01', createTime: '10:00:00', modifyTime: '10:00:00', source: '甲方发起', approvalRecords: generateStopResumeRecords('已通过') },
  { id: 'sr-006', contractId: 'c-008', changeNo: 'SR-2026-006', approvalNo: 'LX-2026-008', contractNo: 'HT-2026-008', contractName: '污水处理厂设备采购合同', reason: '设备到货延期，安装工作被迫暂停', description: '部分进口设备因海关清关延迟，预计到货延期15天，安装工作暂停', type: '合同停工', status: '审批中', date: '2026-06-04', fileCount: 2, creator: '冯建国', createDate: '2026-06-04', exemptAssessment: '否', modifier: '冯建国', modifyDate: '2026-06-04', createTime: '14:30:00', modifyTime: '14:30:00', source: '施工方发起', approvalRecords: generateStopResumeRecords('审批中') },
];

// ---- 竣工 Mock Data ----

function generateCompletionRecords(stage: string): CompletionApprovalRecord[] {
  if (stage === '项目部审核') return [
    { id: 'cr-001', stage: '申报阶段', action: '提交竣工申请', opinion: '工程已完工，申请竣工验收', operator: '赵明华', date: '2026-06-10', time: '09:00:00' },
  ];
  if (stage === '制造部审核') return [
    { id: 'cr-001', stage: '申报阶段', action: '提交竣工申请', opinion: '工程已完工，申请竣工验收', operator: '赵明华', date: '2026-06-10', time: '09:00:00' },
    { id: 'cr-002', stage: '项目部审核', action: '审核通过', opinion: '工程质量合格，同意报制造部审核', operator: '陈建国', date: '2026-06-12', time: '14:00:00' },
  ];
  if (stage === '已通过') return [
    { id: 'cr-001', stage: '申报阶段', action: '提交竣工申请', opinion: '工程已完工，申请竣工验收', operator: '赵明华', date: '2026-05-20', time: '09:00:00' },
    { id: 'cr-002', stage: '项目部审核', action: '审核通过', opinion: '工程质量合格，同意报制造部审核', operator: '陈建国', date: '2026-05-22', time: '14:00:00' },
    { id: 'cr-003', stage: '制造部审核', action: '审核通过', opinion: '竣工资料齐全，符合验收标准，同意竣工', operator: '张涛', date: '2026-05-25', time: '10:00:00' },
  ];
  return [];
}

export const completionApplies: CompletionApply[] = [
  { id: 'cp-001', contractId: 'c-001', projectName: '1号高炉本体耐材砌筑工程', contractNo: 'HT-2026-001', approvalNo: 'LX-2026-001', qualityRating: '合格', builtPerDrawings: '是', changesCompleted: '是', acceptanceOpinion: '工程质量合格，资料齐全，同意竣工验收', approvalStatus: '制造部审核中', currentReviewer: '张涛', currentStage: '制造部审核', completionDate: '2026-06-10', oldMaterialRecords: [{ name: '废旧耐火砖', unit: '吨', quantity: 45 }, { name: '废钢铁', unit: '吨', quantity: 12 }, { name: '废旧电缆', unit: '米', quantity: 200 }], approvalRecords: generateCompletionRecords('制造部审核') },
  { id: 'cp-002', contractId: 'c-002', projectName: '转炉设备基础施工工程', contractNo: 'HT-2026-002', approvalNo: 'LX-2026-002', qualityRating: '优良', builtPerDrawings: '是', changesCompleted: '是', acceptanceOpinion: '', approvalStatus: '项目部审核中', currentReviewer: '陈建国', currentStage: '项目部审核', completionDate: '2026-06-05', oldMaterialRecords: [{ name: '废旧模板', unit: '立方', quantity: 30 }, { name: '废钢筋', unit: '吨', quantity: 8 }], approvalRecords: generateCompletionRecords('项目部审核') },
  { id: 'cp-003', contractId: 'c-003', projectName: '轧机主传动装置安装工程', contractNo: 'HT-2026-003', approvalNo: 'LX-2026-003', qualityRating: '优良', builtPerDrawings: '是', changesCompleted: '是', acceptanceOpinion: '设备安装质量优良，联动试车一次成功，各项技术指标优于设计要求，同意竣工', approvalStatus: '已通过', currentReviewer: '', currentStage: '已通过', completionDate: '2026-05-25', oldMaterialRecords: [{ name: '废旧传动轴', unit: '根', quantity: 3 }, { name: '废润滑油', unit: '升', quantity: 150 }, { name: '废旧控制柜', unit: '台', quantity: 2 }], approvalRecords: generateCompletionRecords('已通过') },
  { id: 'cp-004', contractId: 'c-005', projectName: '原料场智能化设备安装工程', contractNo: 'HT-2026-005', approvalNo: 'LX-2026-005', qualityRating: '', builtPerDrawings: '', changesCompleted: '', acceptanceOpinion: '', approvalStatus: '待申报', currentReviewer: '', currentStage: '待申报', completionDate: '', oldMaterialRecords: [], approvalRecords: [] },
  { id: 'cp-005', contractId: 'c-006', projectName: '环保除尘设施土建施工工程', contractNo: 'HT-2026-006', approvalNo: 'LX-2026-006', qualityRating: '合格', builtPerDrawings: '是', changesCompleted: '是', acceptanceOpinion: '环保设施施工质量合格，除尘效果达标，同意竣工', approvalStatus: '已通过', currentReviewer: '', currentStage: '已通过', completionDate: '2026-05-30', oldMaterialRecords: [{ name: '废旧除尘布袋', unit: '条', quantity: 200 }, { name: '废钢铁', unit: '吨', quantity: 15 }], approvalRecords: generateCompletionRecords('已通过') },
  { id: 'cp-006', contractId: 'c-007', projectName: '余热发电锅炉安装工程', contractNo: 'HT-2026-007', approvalNo: 'LX-2026-007', qualityRating: '', builtPerDrawings: '', changesCompleted: '', acceptanceOpinion: '', approvalStatus: '项目部审核中', currentReviewer: '陈建国', currentStage: '项目部审核', completionDate: '2026-06-02', oldMaterialRecords: [{ name: '废旧保温材料', unit: '立方', quantity: 50 }, { name: '废旧阀门', unit: '个', quantity: 8 }], approvalRecords: generateCompletionRecords('项目部审核') },
];

// ---- Helper functions ----

export function getHandoverApplies(contractId: string): HandoverApply[] {
  return handoverApplies.filter((a) => a.contractId === contractId);
}

export function getHandoverById(id: string): HandoverApply | undefined {
  return handoverApplies.find((a) => a.id === id);
}

export function getStopResumeApplies(contractId: string): StopResumeApply[] {
  return stopResumeApplies.filter((a) => a.contractId === contractId);
}

export function getStopResumeById(id: string): StopResumeApply | undefined {
  return stopResumeApplies.find((a) => a.id === id);
}

export function getCompletionApplies(contractId: string): CompletionApply[] {
  return completionApplies.filter((a) => a.contractId === contractId);
}

export function getCompletionById(id: string): CompletionApply | undefined {
  return completionApplies.find((a) => a.id === id);
}