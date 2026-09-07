export interface SignboardContract {
  id: string;
  approvalNo: string;
  projectName: string;
  contractNo: string;
  contractName: string;
  contractType: string;
  contractorNo: string;
  contractorName: string;
  mainContent: string;
  contractDate: string;
  revisedAmount: number;
  contractStatus: string;
  scheduleStatus: 'pending' | 'supervisor_review' | 'project_review' | 'approved' | 'rejected' | 'change_review';
}

export interface ProcessItem {
  id: string;
  contractId: string;
  processName: string;
  category: string;
  processNo: string;
  description: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: 'pending' | 'waiting_approval' | 'approved' | 'rejected';
  actualStartDate?: string;
  actualEndDate?: string;
  result?: string;
  attachments?: string[];
  supervisorResult?: 'pass' | 'reject';
  supervisorOpinion?: string;
}

export interface ScheduleApprovalRecord {
  id: string;
  contractId: string;
  processItemId?: string;
  seq: number;
  operationType: string;
  operator: string;
  operatorRole: string;
  operationTime: string;
  operationDesc: string;
}

export function formatCurrency(val: number): string {
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const scheduleStatusLabel: Record<string, string> = {
  pending: '待提交',
  supervisor_review: '监理审批中',
  project_review: '项目组审批中',
  approved: '已通过',
  rejected: '已驳回',
  change_review: '变更审核中',
};

export function getScheduleStatusLabel(status: string): string {
  return scheduleStatusLabel[status] || status;
}

export function getScheduleStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'bg-slate-100 text-slate-600',
    supervisor_review: 'bg-blue-50 text-blue-700',
    project_review: 'bg-amber-50 text-amber-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
    change_review: 'bg-purple-50 text-purple-700',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

export const signboardContracts: SignboardContract[] = [
  {
    id: 'sc-001',
    approvalNo: 'LX-2024-001',
    projectName: '炼铁厂1#高炉大修项目',
    contractNo: 'NG-GC-2024-001',
    contractName: '炼铁厂1#高炉大修土建施工合同',
    contractType: '施工总承包',
    contractorNo: 'CBS-001',
    contractorName: '中冶建工集团有限公司',
    mainContent: '炼铁厂1#高炉本体、热风炉、出铁场等区域土建大修施工',
    contractDate: '2024-01-15',
    revisedAmount: 28500000.00,
    contractStatus: '执行中',
    scheduleStatus: 'approved',
  },
  {
    id: 'sc-002',
    approvalNo: 'LX-2024-005',
    projectName: '中板厂热处理线改造项目',
    contractNo: 'NG-GC-2024-005',
    contractName: '中板厂热处理线改造设备安装合同',
    contractType: '专业分包',
    contractorNo: 'CBS-005',
    contractorName: '中国二十冶集团有限公司',
    mainContent: '中板厂热处理线淬火机、回火炉、矫直机等设备安装调试',
    contractDate: '2024-02-10',
    revisedAmount: 18650000.00,
    contractStatus: '执行中',
    scheduleStatus: 'project_review',
  },
  {
    id: 'sc-003',
    approvalNo: 'LX-2024-008',
    projectName: '宽厚板厂精整线扩建项目',
    contractNo: 'NG-GC-2024-008',
    contractName: '宽厚板厂精整线扩建钢结构及安装合同',
    contractType: '施工总承包',
    contractorNo: 'CBS-003',
    contractorName: '上海宝冶集团有限公司',
    mainContent: '宽厚板厂精整线厂房扩建、矫直机基础、冷床基础等钢结构及设备安装',
    contractDate: '2024-03-05',
    revisedAmount: 35200000.00,
    contractStatus: '执行中',
    scheduleStatus: 'supervisor_review',
  },
  {
    id: 'sc-004',
    approvalNo: 'LX-2024-012',
    projectName: '第一炼钢厂连铸机改造项目',
    contractNo: 'NG-GC-2024-012',
    contractName: '第一炼钢厂2#连铸机改造总承包合同',
    contractType: 'EPC总承包',
    contractorNo: 'CBS-008',
    contractorName: '中钢设备有限公司',
    mainContent: '第一炼钢厂2#连铸机整体改造，包括结晶器振动、扇形段更换、切割机更新等',
    contractDate: '2024-04-20',
    revisedAmount: 56800000.00,
    contractStatus: '执行中',
    scheduleStatus: 'pending',
  },
  {
    id: 'sc-005',
    approvalNo: 'LX-2024-015',
    projectName: '原料厂环保封闭改造项目',
    contractNo: 'NG-GC-2024-015',
    contractName: '原料厂焦炭料场环保封闭钢结构合同',
    contractType: '施工总承包',
    contractorNo: 'CBS-010',
    contractorName: '中国一冶集团有限公司',
    mainContent: '原料厂焦炭料场大棚封闭、喷淋抑尘系统、皮带通廊封闭等环保改造',
    contractDate: '2024-05-10',
    revisedAmount: 42300000.00,
    contractStatus: '执行中',
    scheduleStatus: 'rejected',
  },
  {
    id: 'sc-006',
    approvalNo: 'LX-2024-018',
    projectName: '能源中心220kV变电站扩容项目',
    contractNo: 'NG-GC-2024-018',
    contractName: '能源中心220kV变电站扩容电气安装合同',
    contractType: '专业分包',
    contractorNo: 'CBS-012',
    contractorName: '中国电建集团核电工程公司',
    mainContent: '220kV变电站主变压器安装、GIS设备安装、二次系统调试等',
    contractDate: '2024-06-01',
    revisedAmount: 21400000.00,
    contractStatus: '执行中',
    scheduleStatus: 'change_review',
  },
  {
    id: 'sc-007',
    approvalNo: 'LX-2024-021',
    projectName: '科技质量部检验中心建设项目',
    contractNo: 'NG-GC-2024-021',
    contractName: '科技质量部检验中心建设装修及设备合同',
    contractType: '施工总承包',
    contractorNo: 'CBS-015',
    contractorName: '中建三局集团有限公司',
    mainContent: '检验中心大楼装修、恒温恒湿实验室建设、检测设备安装调试',
    contractDate: '2024-06-20',
    revisedAmount: 9800000.00,
    contractStatus: '执行中',
    scheduleStatus: 'approved',
  },
  {
    id: 'sc-008',
    approvalNo: 'LX-2024-025',
    projectName: '物流中心智能仓储系统项目',
    contractNo: 'NG-GC-2024-025',
    contractName: '物流中心智能仓储系统设备采购安装合同',
    contractType: '设备采购',
    contractorNo: 'CBS-018',
    contractorName: '科大智能科技股份有限公司',
    mainContent: '自动化立体仓库货架、堆垛机、AGV系统、WMS系统等采购安装',
    contractDate: '2024-07-05',
    revisedAmount: 15700000.00,
    contractStatus: '执行中',
    scheduleStatus: 'approved',
  },
];

function generateProcessItems(contractId: string): ProcessItem[] {
  const items: ProcessItem[] = [];
  const baseDate = new Date('2024-03-01');
  const names = [
    '地基基础施工', '钢结构安装', '设备基础浇筑', '主体设备安装',
    '电气系统安装', '管道系统安装', '自动化系统调试', '防腐保温施工',
    '消防系统安装', '通风空调安装', '给排水系统安装', '装饰装修施工',
  ];
  const categories = ['土建', '钢结构', '土建', '设备安装', '电气', '管道', '自控', '防腐', '消防', '暖通', '给排水', '装修'];
  const statuses: ProcessItem['status'][] = ['pending', 'waiting_approval', 'approved', 'rejected'];

  for (let i = 0; i < 10; i++) {
    const startDate = new Date(baseDate);
    startDate.setDate(startDate.getDate() + i * 25);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30 + Math.floor(Math.random() * 20));

    const isOverdue = endDate < new Date('2026-06-05');
    const status = isOverdue ? (Math.random() > 0.3 ? 'approved' : 'pending') : statuses[Math.floor(Math.random() * statuses.length)];

    const item: ProcessItem = {
      id: `pi-${contractId}-${i + 1}`,
      contractId,
      processName: `${names[i]}工序`,
      category: categories[i],
      processNo: `GX-${contractId.split('-')[1]}-${String(i + 1).padStart(2, '0')}`,
      description: `完成${names[i]}全部工作内容，达到设计及规范要求，经监理验收合格`,
      plannedStartDate: startDate.toISOString().split('T')[0],
      plannedEndDate: endDate.toISOString().split('T')[0],
      status,
    };

    if (status === 'approved' || status === 'rejected') {
      item.actualStartDate = new Date(startDate.getTime() + 2 * 86400000).toISOString().split('T')[0];
      item.actualEndDate = new Date(endDate.getTime() - 1 * 86400000).toISOString().split('T')[0];
      item.result = `${names[i]}施工完成，各项指标符合设计及规范要求，质量评定合格`;
      item.attachments = [`${names[i]}_验收报告.pdf`, `${names[i]}_检测记录.xlsx`, `${names[i]}_现场照片.zip`];
      item.supervisorResult = status === 'approved' ? 'pass' : 'reject';
      item.supervisorOpinion = status === 'approved' ? '验收合格，同意通过' : '部分指标未达标，需整改后重新报验';
    }

    if (status === 'waiting_approval') {
      item.actualStartDate = new Date(startDate.getTime() + 3 * 86400000).toISOString().split('T')[0];
      item.actualEndDate = new Date(endDate.getTime() + 1 * 86400000).toISOString().split('T')[0];
      item.result = `${names[i]}施工完成，自检合格，请监理验收`;
      item.attachments = [`${names[i]}_自检报告.pdf`, `${names[i]}_施工记录.docx`];
    }

    items.push(item);
  }
  return items;
}

function generateScheduleRecords(contractId: string): ScheduleApprovalRecord[] {
  const records: ScheduleApprovalRecord[] = [
    { id: `sr-${contractId}-1`, contractId, seq: 1, operationType: '创建预排', operator: '李明辉', operatorRole: '施工方', operationTime: '2024-03-15 09:30:00', operationDesc: '根据合同要求完成工序预排方案编制，共规划10项工序细项' },
    { id: `sr-${contractId}-2`, contractId, seq: 2, operationType: '提交预排', operator: '李明辉', operatorRole: '施工方', operationTime: '2024-03-16 14:20:00', operationDesc: '工序预排方案编制完成，提交监理审批' },
    { id: `sr-${contractId}-3`, contractId, seq: 3, operationType: '监理审批通过', operator: '王建国', operatorRole: '监理', operationTime: '2024-03-18 10:15:00', operationDesc: '经审查，工序预排方案合理，工序分解清晰，计划时间安排可行，同意通过' },
    { id: `sr-${contractId}-4`, contractId, seq: 4, operationType: '项目组审批通过', operator: '张涛', operatorRole: '项目组', operationTime: '2024-03-20 16:00:00', operationDesc: '整体预排方案符合工程管理要求，批准执行' },
    { id: `sr-${contractId}-5`, contractId, seq: 5, operationType: '工序验收结果上传', operator: '赵永强', operatorRole: '施工方', operationTime: '2024-04-15 11:30:00', operationDesc: '上传地基基础施工工序验收结果及附件' },
    { id: `sr-${contractId}-6`, contractId, seq: 6, operationType: '监理验收通过', operator: '王建国', operatorRole: '监理', operationTime: '2024-04-16 09:45:00', operationDesc: '地基基础施工工序验收合格，资料齐全，同意通过' },
    { id: `sr-${contractId}-7`, contractId, seq: 7, operationType: '工序验收结果上传', operator: '赵永强', operatorRole: '施工方', operationTime: '2024-05-20 15:10:00', operationDesc: '上传钢结构安装工序验收结果及附件' },
    { id: `sr-${contractId}-8`, contractId, seq: 8, operationType: '监理验收驳回', operator: '王建国', operatorRole: '监理', operationTime: '2024-05-22 08:30:00', operationDesc: '钢结构安装焊缝检测报告部分数据缺失，焊接工艺评定资料不完整，请补充后重新报验' },
  ];
  return records;
}

function generateItemApprovalRecords(contractId: string, processItemId: string): ScheduleApprovalRecord[] {
  const seq = parseInt(processItemId.split('-').pop() || '1', 10);
  return [
    { id: `pir-${processItemId}-1`, contractId, processItemId, seq: seq * 10 + 1, operationType: '工序完成上报', operator: '赵永强', operatorRole: '施工方', operationTime: '2024-05-20 15:10:00', operationDesc: '工序施工完成，自检合格，上报验收申请并上传相关附件' },
    { id: `pir-${processItemId}-2`, contractId, processItemId, seq: seq * 10 + 2, operationType: '监理验收通过', operator: '王建国', operatorRole: '监理', operationTime: '2024-05-22 09:00:00', operationDesc: '经现场核验及资料审查，工序质量符合设计及规范要求，同意验收通过' },
  ];
}

export const processItemsMap: Record<string, ProcessItem[]> = {};
export const scheduleRecordsMap: Record<string, ScheduleApprovalRecord[]> = {};
export const itemApprovalRecordsMap: Record<string, ScheduleApprovalRecord[]> = {};

signboardContracts.forEach((c) => {
  processItemsMap[c.id] = generateProcessItems(c.id);
  scheduleRecordsMap[c.id] = generateScheduleRecords(c.id);
  processItemsMap[c.id].forEach((item) => {
    if (item.status === 'approved' || item.status === 'rejected') {
      itemApprovalRecordsMap[item.id] = generateItemApprovalRecords(c.id, item.id);
    }
  });
});

export function getContractById(id: string): SignboardContract | undefined {
  return signboardContracts.find((c) => c.id === id);
}

export function getProcessItemsByContractId(contractId: string): ProcessItem[] {
  return processItemsMap[contractId] || [];
}

export function getProcessItemById(id: string): ProcessItem | undefined {
  for (const items of Object.values(processItemsMap)) {
    const found = items.find((i) => i.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getScheduleRecords(contractId: string): ScheduleApprovalRecord[] {
  return scheduleRecordsMap[contractId] || [];
}

export function getItemApprovalRecords(processItemId: string): ScheduleApprovalRecord[] {
  return itemApprovalRecordsMap[processItemId] || [];
}

export const contractTypes = ['施工总承包', '专业分包', '劳务分包', '设备采购', '设计合同', '监理合同', '咨询合同', 'EPC总承包'];