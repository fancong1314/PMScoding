export interface EstimateItem {
  id: string;
  name: string;
  spec: string;
  originalAmount: number;
  revisedAmount: number;
  demandAmount: number;
  contractAmount: number;
  remainingAmount: number;
  level: 1 | 2 | 3;
  parentId: string | null;
  creator: string;
  modifier: string;
  createdAt: string;
  modifiedAt: string;
  children?: EstimateItem[];
}

export interface EstimateProject {
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
  estimates: EstimateItem[];
}

export interface EstimateRevisionLog {
  id: string;
  projectId: string;
  approvalNo: string;
  name: string;
  status: '新建' | '审批中' | '已通过' | '已驳回' | '已撤销';
  reason: string;
  creator: string;
  createDate: string;
  modifier: string;
  modifyDate: string;
  submitter: string;
  submitDate: string;
  detailItems: {
    id: string;
    name: string;
    level: number;
    revisedAmount: number;
    remainingAmount: number;
    adjustAmount: number;
    correctionAmount: number;
    surplusAmount: number;
    description: string;
  }[];
  approvalFlow: {
    node: string;
    approver: string;
    status: '已通过' | '待审批' | '已驳回';
    time?: string;
    comment?: string;
  }[];
}

const projectTypes = ['A质量品种', 'B安全环保', 'C节能降耗', 'D工艺装备', 'E智能制造', 'F信息化'];
const ownerUnits = ['炼铁事业部', '炼钢事业部', '轧钢事业部', '能源环保部', '设备部', '安全能环部', '技术中心'];
const implementUnits = ['工程管理部', '基建部', '设备管理部', '安全环保部'];
const managers = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟'];

const projectNames = [
  '1#高炉环保升级改造工程',
  '2#转炉设备更新项目',
  '轧钢车间自动化控制系统升级',
  '原料场智能化改造工程项目',
  '焦化区环保设施新建工程',
  '烧结区脱硫脱硝改造项目',
  '能源中心余热发电系统工程',
  '污水处理厂扩建改造工程',
  '配电室高低压设备更新项目',
  '办公楼信息化基础设施建设项目',
  '厂区道路硬化及管网改造工程',
  '安全防护设施完善升级项目',
  '仓储物流中心建设工程',
  '环保监测站房建设项目',
  '消防系统升级改造工程',
];

function generateEstimates(): EstimateItem[] {
  const items: EstimateItem[] = [];

  const creator = '系统管理员';
  const modifier = '系统管理员';
  const createdAt = '2026-01-10 09:00:00';
  const modifiedAt = '2026-03-15 14:30:00';

  // Level 1: 工程费用
  const l1_1: EstimateItem = {
    id: 'est1-1', name: '工程费用', spec: '', originalAmount: 2436000, revisedAmount: 2341000, demandAmount: 2100000, contractAmount: 2050000, remainingAmount: 291000, level: 1, parentId: null, creator, modifier, createdAt, modifiedAt,
  };
  items.push(l1_1);

  const l2_1: EstimateItem = {
    id: 'est1-1-1', name: '制氧厂配套管线', spec: 'DN200碳钢管线', originalAmount: 2436000, revisedAmount: 2341000, demandAmount: 2100000, contractAmount: 2050000, remainingAmount: 291000, level: 2, parentId: 'est1-1', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l2_1);

  const l2_2: EstimateItem = {
    id: 'est1-1-2', name: '建筑工程费', spec: '', originalAmount: 1020000, revisedAmount: 1020000, demandAmount: 950000, contractAmount: 920000, remainingAmount: 100000, level: 2, parentId: 'est1-1', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l2_2);

  const l3_1: EstimateItem = {
    id: 'est1-1-2-1', name: '土建及基础费用', spec: 'C30混凝土', originalAmount: 1020000, revisedAmount: 1020000, demandAmount: 950000, contractAmount: 920000, remainingAmount: 100000, level: 3, parentId: 'est1-1-2', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l3_1);

  const l2_3: EstimateItem = {
    id: 'est1-1-3', name: '安装工程费', spec: '', originalAmount: 595000, revisedAmount: 500000, demandAmount: 480000, contractAmount: 460000, remainingAmount: 40000, level: 2, parentId: 'est1-1', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l2_3);

  const l3_2: EstimateItem = {
    id: 'est1-1-3-1', name: '施工安装费', spec: '人工+机械', originalAmount: 595000, revisedAmount: 500000, demandAmount: 480000, contractAmount: 460000, remainingAmount: 40000, level: 3, parentId: 'est1-1-3', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l3_2);

  const l2_4: EstimateItem = {
    id: 'est1-1-4', name: '设备工器具购置费', spec: '', originalAmount: 821000, revisedAmount: 821000, demandAmount: 670000, contractAmount: 670000, remainingAmount: 151000, level: 2, parentId: 'est1-1', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l2_4);

  const l3_3: EstimateItem = {
    id: 'est1-1-4-1', name: '材料费用', spec: '钢材、螺栓', originalAmount: 591000, revisedAmount: 591000, demandAmount: 470000, contractAmount: 470000, remainingAmount: 121000, level: 3, parentId: 'est1-1-4', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l3_3);

  const l3_4: EstimateItem = {
    id: 'est1-1-4-2', name: '备件费用', spec: '备用配件', originalAmount: 230000, revisedAmount: 230000, demandAmount: 200000, contractAmount: 200000, remainingAmount: 30000, level: 3, parentId: 'est1-1-4', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l3_4);

  // Level 1: 工程建设其他费
  const l1_2: EstimateItem = {
    id: 'est1-2', name: '工程建设其他费', spec: '', originalAmount: 164000, revisedAmount: 259000, demandAmount: 200000, contractAmount: 180000, remainingAmount: 79000, level: 1, parentId: null, creator, modifier, createdAt, modifiedAt,
  };
  items.push(l1_2);

  const l2_5: EstimateItem = {
    id: 'est1-2-1', name: '设计费', spec: '初步+施工图', originalAmount: 115000, revisedAmount: 179000, demandAmount: 150000, contractAmount: 135000, remainingAmount: 44000, level: 2, parentId: 'est1-2', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l2_5);

  const l2_6: EstimateItem = {
    id: 'est1-2-2', name: '监理费', spec: '全过程监理', originalAmount: 49000, revisedAmount: 80000, demandAmount: 50000, contractAmount: 45000, remainingAmount: 35000, level: 2, parentId: 'est1-2', creator, modifier, createdAt, modifiedAt,
  };
  items.push(l2_6);

  // Level 1: 预备费
  const l1_3: EstimateItem = {
    id: 'est1-3', name: '预备费', spec: '', originalAmount: 0, revisedAmount: 0, demandAmount: 0, contractAmount: 0, remainingAmount: 0, level: 1, parentId: null, creator, modifier, createdAt, modifiedAt,
  };
  items.push(l1_3);

  // Level 1: 结余费
  const l1_4: EstimateItem = {
    id: 'est1-4', name: '结余费', spec: '', originalAmount: 0, revisedAmount: 0, demandAmount: 0, contractAmount: 0, remainingAmount: 0, level: 1, parentId: null, creator, modifier, createdAt, modifiedAt,
  };
  items.push(l1_4);

  // Level 1: 项目总投资
  const l1_5: EstimateItem = {
    id: 'est1-5', name: '项目总投资', spec: '', originalAmount: 2600000, revisedAmount: 2600000, demandAmount: 2300000, contractAmount: 2230000, remainingAmount: 370000, level: 1, parentId: null, creator, modifier, createdAt, modifiedAt,
  };
  items.push(l1_5);

  return items;
}

export const estimateProjects: EstimateProject[] = Array.from({ length: 15 }, (_, i) => {
  const seq = String(i + 1).padStart(3, '0');
  const budget = [2600000, 1850000, 3200000, 1500000, 4200000, 2800000, 1900000, 3500000, 1200000, 2100000, 1600000, 2900000, 3800000, 1400000, 2500000][i];
  const preBudget = Math.floor(budget * 0.95);
  const actualBudget = budget;
  const originalContract = Math.floor(budget * 0.88);
  const revisedContract = Math.floor(budget * 0.9);
  const completed = Math.floor(budget * 0.65);
  const settled = Math.floor(budget * 0.55);
  const accounted = Math.floor(budget * 0.52);
  const fixed = Math.floor(budget * 0.48);
  return {
    id: `est_${seq}`,
    approvalNo: `LX-2026-${seq}`,
    planNo: `JH-2026-${seq}`,
    name: projectNames[i],
    description: `${projectNames[i]}概算管理，涉及${['环保升级', '设备更新', '自动化改造', '智能化建设', '环保设施'][i % 5]}等内容`,
    projectType: projectTypes[i % projectTypes.length],
    budgetAmount: budget,
    preBudgetAmount: preBudget,
    actualBudgetAmount: actualBudget,
    originalContractAmount: originalContract,
    revisedContractAmount: revisedContract,
    completedAmount: completed,
    settledAmount: settled,
    accountedAmount: accounted,
    fixedAmount: fixed,
    approvalDate: `2026-0${1 + (i % 5)}-${String(5 + (i % 25)).padStart(2, '0')}`,
    ownerUnit: ownerUnits[i % ownerUnits.length],
    implementUnit: implementUnits[i % implementUnits.length],
    projectManager: managers[i % managers.length],
    isEnvAssessment: i % 3 === 0,
    estimates: generateEstimates(),
  };
});

export const estimateRevisionLogs: EstimateRevisionLog[] = estimateProjects.map((project, i) => {
  const reasons = [
    '因环保标准升级，工程费用中的安装工程费需调整，增加施工难度和材料成本',
    '因设备采购方案变更，新增进口设备采购费用',
    '因设计范围扩大，增加初步设计和施工图设计内容',
    '因施工难度增加，调整施工安装人工及机械费用',
    '因材料价格波动，调整材料采购预算',
  ];
  const statuses: Array<'已通过' | '审批中' | '已驳回'> = ['已通过', '审批中', '已通过', '已驳回', '已通过'];
  const flowStatuses: Array<'已通过' | '待审批'> = ['已通过', '已通过', '已通过', '已驳回', '已通过'];
  const detailAmounts = [-95000, 64000, 31000, 259000, -50000];
  const month = String(1 + (i % 5)).padStart(2, '0');
  const day = String(5 + (i % 25)).padStart(2, '0');
  const submitDay = String(15 + (i % 15)).padStart(2, '0');
  const approveDay = String(16 + (i % 14)).padStart(2, '0');
  return {
    id: `revlog-${String(i + 1).padStart(3, '0')}`,
    projectId: project.id,
    approvalNo: project.approvalNo,
    name: project.name,
    status: statuses[i % statuses.length],
    reason: reasons[i % reasons.length],
    creator: managers[i % managers.length],
    createDate: `2026-${month}-${day}`,
    modifier: managers[i % managers.length],
    modifyDate: `2026-${month}-${String(Number(day) + 2).padStart(2, '0')}`,
    submitter: managers[(i + 1) % managers.length],
    submitDate: `2026-${month}-${submitDay}`,
    detailItems: [
      {
        id: `est1-${(i % 4) + 1}-${(i % 3) + 1}`,
        name: ['安装工程费', '设计费', '监理费', '材料费用', '施工安装费'][i % 5],
        level: (i % 3) + 2,
        revisedAmount: [500000, 179000, 80000, 850000, 500000][i % 5],
        remainingAmount: [40000, 44000, 35000, 180000, 40000][i % 5],
        adjustAmount: detailAmounts[i % detailAmounts.length],
        correctionAmount: Math.abs(detailAmounts[i % detailAmounts.length]),
        surplusAmount: 0,
        description: ['调整施工安装费用', '扩大设计范围', '延长监理周期', '新增进口设备', '调整人工费用'][i % 5],
      },
    ],
    approvalFlow: [
      {
        node: '项目经理审核',
        approver: managers[i % managers.length],
        status: flowStatuses[i % flowStatuses.length] as '已通过' | '待审批' | '已驳回',
        time: `2026-${month}-${submitDay} 10:00:00`,
        comment: flowStatuses[i % flowStatuses.length] === '已驳回' ? '金额调整不合理，请重新评估' : '审核通过',
      },
      {
        node: '工程管理部审核',
        approver: managers[(i + 1) % managers.length],
        status: i % 3 === 1 ? '待审批' : flowStatuses[i % flowStatuses.length] as '已通过' | '待审批' | '已驳回',
        time: i % 3 === 1 ? undefined : `2026-${month}-${approveDay} 09:00:00`,
        comment: i % 3 === 1 ? '' : (flowStatuses[i % flowStatuses.length] === '已驳回' ? '超出预算范围' : '审核通过'),
      },
    ],
  };
});

// 保留额外几条跨项目的静态日志
estimateRevisionLogs.push(
  {
    id: 'revlog-extra-001',
    projectId: 'est_001',
    approvalNo: 'LX-2026-001',
    name: '1#高炉环保升级改造工程',
    status: '已通过',
    reason: '工程建设其他费调整，设计范围和监理范围扩大',
    creator: '赵预算',
    createDate: '2026-04-01',
    modifier: '赵预算',
    modifyDate: '2026-04-02',
    submitter: '张明远',
    submitDate: '2026-04-05',
    detailItems: [
      { id: 'est1-2-1', name: '设计费', level: 2, revisedAmount: 179000, remainingAmount: 44000, adjustAmount: 64000, correctionAmount: 64000, surplusAmount: 0, description: '设计范围扩大，增加初步设计内容' },
      { id: 'est1-2-2', name: '监理费', level: 2, revisedAmount: 80000, remainingAmount: 35000, adjustAmount: 31000, correctionAmount: 31000, surplusAmount: 0, description: '监理周期延长，增加监理费用' },
    ],
    approvalFlow: [
      { node: '项目经理审核', approver: '张明远', status: '已通过', time: '2026-04-05 10:00:00', comment: '设计范围确实扩大，费用合理' },
      { node: '工程管理部审核', approver: '李建国', status: '待审批', comment: '' },
    ],
  },
  {
    id: 'revlog-extra-002',
    projectId: 'est_002',
    approvalNo: 'LX-2026-002',
    name: '2#转炉设备更新项目',
    status: '已通过',
    reason: '设备采购费用调整，新增进口设备',
    creator: '陈采购',
    createDate: '2026-02-15',
    modifier: '陈采购',
    modifyDate: '2026-02-16',
    submitter: '王志强',
    submitDate: '2026-02-18',
    detailItems: [
      { id: 'est1-1-4-1', name: '材料费用', level: 3, revisedAmount: 850000, remainingAmount: 180000, adjustAmount: 259000, correctionAmount: 259000, surplusAmount: 0, description: '新增进口设备采购' },
    ],
    approvalFlow: [
      { node: '项目经理审核', approver: '王志强', status: '已通过', time: '2026-02-18 14:00:00', comment: '进口设备采购符合项目要求' },
      { node: '工程管理部审核', approver: '李建国', status: '已通过', time: '2026-02-19 09:00:00', comment: '审核通过' },
      { node: '财务部审核', approver: '孙伟', status: '已通过', time: '2026-02-20 11:30:00', comment: '预算调整在可控范围内' },
    ],
  }
);

export function getProjectEstimates(projectId: string): EstimateItem[] {
  const project = estimateProjects.find((p) => p.id === projectId);
  return project?.estimates ?? [];
}

export function getProjectById(projectId: string): EstimateProject | undefined {
  return estimateProjects.find((p) => p.id === projectId);
}

export function getProjectRevisionLogs(projectId: string): EstimateRevisionLog[] {
  return estimateRevisionLogs.filter((l) => l.projectId === projectId).sort((a, b) => b.createDate.localeCompare(a.createDate));
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}