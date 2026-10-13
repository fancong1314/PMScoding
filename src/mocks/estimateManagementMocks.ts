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
  /** 项目大类：新建/技改/营缮/零固 */
  majorType: string;
  projectType: string;
  /** 是否报批报建（与立项申请同步） */
  needApprovalPermit: '是' | '否';
  /** 立项申报金额（元） */
  budgetAmount: number;
  /** 立项批复金额（元） */
  preBudgetAmount: number;
  /** 实际立项金额（元） */
  actualBudgetAmount: number;
  /** 合同签订总额（元） */
  originalContractAmount: number;
  /** 修正合同总额（元） */
  revisedContractAmount: number;
  /** 项目完工金额（元） */
  completedAmount: number;
  /** 项目已支付总额（元） */
  paidAmount: number;
  /** 项目结算总额（元） */
  settledAmount: number;
  /** 项目已入账总额（元） */
  accountedAmount: number;
  /** 项目已转固总额（元） */
  fixedAmount: number;
  /** 已占用金额（元） */
  occupiedAmount: number;
  /** 可用金额（元） */
  availableAmount: number;
  approvalDate: string;
  ownerUnit: string;
  implementUnit: string;
  projectManager: string;
  isEnvAssessment: boolean;
  /** 列表审批状态 */
  approvalStatus: EstimateApprovalStatus;
  /** 列表审批状态 · 可视化流程节点 */
  approvalFlow: EstimateApprovalFlowNode[];
  estimates: EstimateItem[];
}

export type EstimateApprovalStatus = '草稿' | '待审批' | '审批中' | '已通过' | '已驳回';

export type EstimateFlowNodeStatus = 'passed' | 'current' | 'pending' | 'rejected';

export interface EstimateApprovalFlowNode {
  name: string;
  role: string;
  status: EstimateFlowNodeStatus;
  time?: string;
  opinion?: string;
}

/** 列表金额类字段表头说明（悬浮提示） */
export const ESTIMATE_FIELD_TIPS: Record<string, string> = {
  budgetAmount: '项目在年度计划 / 立项申报时填报的计划投资额',
  preBudgetAmount: '可研批复的投资估算额，是项目投资决策的源头基线，立项通过时的金额',
  actualBudgetAmount: '项目通过增补、调拨、减少后的最终金额（项目实际金额）',
  originalContractAmount: '项目下全部合同签约金额合计',
  revisedContractAmount: '全部合同变更、签证、补充协议、索赔累计增减额合计',
  completedAmount: '竣工合同总额，即项目完工确认金额合计',
  paidAmount: '全部合同累计成功支付金额',
  settledAmount: '全部合同审定结算金额合计',
  accountedAmount: '财务已入账金额合计（含在建工程转固前入账）',
  fixedAmount: '已完成转固的资产价值合计',
  occupy: '已占用金额占项目实际金额的比例，以及当前可用金额',
  overrunRate: '合同偏差率 =（结算金额 − 立项批复金额）÷ 立项批复金额 × 100%',
};

/** 合同偏差率 = (结算金额 - 立项批复金额) ÷ 立项批复金额 × 100% */
export function calcOverrunRate(settledAmount: number, approvedAmount: number): number | null {
  if (!approvedAmount || approvedAmount <= 0) return null;
  return ((settledAmount - approvedAmount) / approvedAmount) * 100;
}

export const estimateApprovalStatusMap: Record<EstimateApprovalStatus, { cls: string }> = {
  草稿: { cls: 'bg-slate-100 text-steel-600' },
  待审批: { cls: 'bg-amber-100 text-amber-700' },
  审批中: { cls: 'bg-sky-100 text-sky-700' },
  已通过: { cls: 'bg-emerald-100 text-emerald-700' },
  已驳回: { cls: 'bg-red-100 text-red-600' },
};

export const estimateMajorTypes = ['新建', '技改', '营缮', '零固'] as const;

function buildProjectApprovalFlow(
  status: EstimateApprovalStatus,
  manager: string,
  index: number,
  month: string,
  day: string,
): EstimateApprovalFlowNode[] {
  const deptApprover = ['李建国', '王志强', '赵卫东', '陈建华'][index % 4];
  const financeApprover = ['孙伟', '周丽', '吴敏', '郑涛'][index % 4];
  const submitDay = String(Math.min(28, Number(day) + 2)).padStart(2, '0');
  const approveDay = String(Math.min(28, Number(day) + 4)).padStart(2, '0');
  const financeDay = String(Math.min(28, Number(day) + 6)).padStart(2, '0');

  if (status === '草稿') {
    return [
      { name: '项目负责人提交', role: manager, status: 'current', opinion: '草稿编制中，待提交审批' },
      { name: '工程管理部审核', role: deptApprover, status: 'pending' },
      { name: '财务部审核', role: financeApprover, status: 'pending' },
    ];
  }
  if (status === '待审批') {
    return [
      { name: '项目负责人提交', role: manager, status: 'passed', time: `2026-${month}-${submitDay} 09:20:00`, opinion: '已提交概算审批' },
      { name: '工程管理部审核', role: deptApprover, status: 'current' },
      { name: '财务部审核', role: financeApprover, status: 'pending' },
    ];
  }
  if (status === '审批中') {
    return [
      { name: '项目负责人提交', role: manager, status: 'passed', time: `2026-${month}-${submitDay} 09:20:00`, opinion: '已提交概算审批' },
      { name: '工程管理部审核', role: deptApprover, status: 'passed', time: `2026-${month}-${approveDay} 10:15:00`, opinion: '费用结构合理，同意' },
      { name: '财务部审核', role: financeApprover, status: 'current' },
    ];
  }
  if (status === '已驳回') {
    return [
      { name: '项目负责人提交', role: manager, status: 'passed', time: `2026-${month}-${submitDay} 09:20:00`, opinion: '已提交概算审批' },
      { name: '工程管理部审核', role: deptApprover, status: 'rejected', time: `2026-${month}-${approveDay} 11:00:00`, opinion: '部分费用说明不足，请补充后重报' },
      { name: '财务部审核', role: financeApprover, status: 'pending' },
    ];
  }
  return [
    { name: '项目负责人提交', role: manager, status: 'passed', time: `2026-${month}-${submitDay} 09:20:00`, opinion: '已提交概算审批' },
    { name: '工程管理部审核', role: deptApprover, status: 'passed', time: `2026-${month}-${approveDay} 10:15:00`, opinion: '费用结构合理，同意' },
    { name: '财务部审核', role: financeApprover, status: 'passed', time: `2026-${month}-${financeDay} 14:30:00`, opinion: '预算可控，审批通过' },
  ];
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
const majorTypes = ['新建', '技改', '营缮', '零固'];
const approvalStatuses: EstimateApprovalStatus[] = ['草稿', '待审批', '审批中', '已通过', '已驳回'];
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
  const actualBudget = Math.floor(budget * (i % 4 === 0 ? 1.08 : i % 3 === 0 ? 0.97 : 1));
  const originalContract = Math.floor(budget * 0.88);
  const revisedContract = Math.floor(budget * (0.02 + (i % 5) * 0.01) * (i % 2 === 0 ? 1 : -1)) + originalContract;
  const completed = Math.floor(budget * 0.65);
  const settled = Math.floor(preBudget * ([0.52, 0.88, 1.05, 0.71, 1.12, 0.63, 0.95, 1.08, 0.48, 0.82, 0.91, 1.15, 0.76, 0.58, 1.02][i]));
  const paid = Math.floor(settled * 0.72);
  const accounted = Math.floor(settled * 0.85);
  const fixed = Math.floor(settled * 0.55);
  // 占用率约 45%~92%，保证进度条演示差异可见
  const occupyRatio = [0.72, 0.45, 0.88, 0.55, 0.92, 0.68, 0.38, 0.81, 0.5, 0.76, 0.42, 0.85, 0.95, 0.48, 0.65][i];
  const occupiedAmount = Math.floor(actualBudget * occupyRatio);
  const availableAmount = Math.max(0, actualBudget - occupiedAmount);
  const approvalStatus = approvalStatuses[i % approvalStatuses.length];
  const month = String(1 + (i % 5)).padStart(2, '0');
  const day = String(5 + (i % 25)).padStart(2, '0');
  const projectManager = managers[i % managers.length];
  return {
    id: `est_${seq}`,
    approvalNo: `LX-2026-${seq}`,
    planNo: `JH-2026-${seq}`,
    name: projectNames[i],
    description: `${projectNames[i]}概算管理，涉及${['环保升级', '设备更新', '自动化改造', '智能化建设', '环保设施'][i % 5]}等内容`,
    majorType: majorTypes[i % majorTypes.length],
    projectType: projectTypes[i % projectTypes.length],
    needApprovalPermit: majorTypes[i % majorTypes.length] === '零固' && i % 3 !== 0 ? '否' : (i % 5 === 0 ? '否' : '是'),
    budgetAmount: budget,
    preBudgetAmount: preBudget,
    actualBudgetAmount: actualBudget,
    originalContractAmount: originalContract,
    revisedContractAmount: revisedContract,
    completedAmount: completed,
    paidAmount: paid,
    settledAmount: settled,
    accountedAmount: accounted,
    fixedAmount: fixed,
    occupiedAmount,
    availableAmount,
    approvalDate: `2026-${month}-${day}`,
    ownerUnit: ownerUnits[i % ownerUnits.length],
    implementUnit: implementUnits[i % implementUnits.length],
    projectManager,
    isEnvAssessment: i % 3 === 0,
    approvalStatus,
    approvalFlow: buildProjectApprovalFlow(approvalStatus, projectManager, i, month, day),
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

/** 占用金额明细行（合同 / 需求） */
export interface EstimateOccupyDetailRow {
  id: string;
  /** 合同\需求名称，如「土建施工合同 (HT-2026-001)」 */
  name: string;
  designFee: number;
  jianAnFee: number;
  equipmentFee: number;
  otherFee: number;
  total: number;
}

const contractNamePool = [
  '土建施工合同',
  '设备采购合同',
  '安装工程合同',
  '监理服务合同',
  '设计咨询合同',
];
const demandNamePool = [
  '主体工程需求',
  '电气安装需求',
  '环保设施需求',
  '备件材料需求',
];

/** 按项目生成占用金额明细（演示数据，合计接近占用金额） */
export function getProjectOccupyDetails(projectId: string): EstimateOccupyDetailRow[] {
  const project = getProjectById(projectId);
  if (!project) return [];
  const idx = Number(projectId.replace(/\D/g, '')) || 1;
  const target = project.occupiedAmount;
  const rowCount = 3 + (idx % 2);
  const rows: EstimateOccupyDetailRow[] = [];
  let remain = target;

  for (let i = 0; i < rowCount; i++) {
    const isLast = i === rowCount - 1;
    const isContract = i % 2 === 0;
    const share = isLast ? remain : Math.floor(target * ([0.42, 0.28, 0.18, 0.12][i] || 0.1));
    remain = Math.max(0, remain - share);
    const designFee = Math.round(share * 0.12 * 100) / 100;
    const jianAnFee = Math.round(share * 0.38 * 100) / 100;
    const equipmentFee = Math.round(share * 0.35 * 100) / 100;
    const otherFee = Math.round((share - designFee - jianAnFee - equipmentFee) * 100) / 100;
    const total = Math.round((designFee + jianAnFee + equipmentFee + otherFee) * 100) / 100;
    const label = isContract
      ? `${contractNamePool[i % contractNamePool.length]} (HT-2026-${String(1000 + idx * 10 + i).slice(-4)})`
      : `${demandNamePool[i % demandNamePool.length]} (XQ-2026-${String(2000 + idx * 10 + i).slice(-4)})`;
    rows.push({
      id: `${projectId}-occ-${i + 1}`,
      name: label,
      designFee,
      jianAnFee,
      equipmentFee,
      otherFee,
      total,
    });
  }
  return rows;
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function formatCurrencyFixed(amount: number): string {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const ESTIMATE_FEE_TYPES = ['设计费', '建安费', '设备费', '其他费'] as const;
export type EstimateFeeType = (typeof ESTIMATE_FEE_TYPES)[number];

/** 费用明细行 */
export interface EstimateFeeLine {
  type: EstimateFeeType;
  /** 立项批复金额（元） */
  approvedAmount: number;
  /** 实际立项金额（元） */
  actualAmount: number;
  /** 项目占用金额（元）= 合同占用 + 需求占用 */
  occupiedAmount: number;
  /** 合同占用金额（元） */
  contractOccupied: number;
  /** 需求占用金额（元） */
  demandOccupied: number;
  /** 项目可用金额（元） */
  availableAmount: number;
  /** 费用说明 */
  remark: string;
}

export interface EstimateTransferSnapshot {
  设计费: number;
  建安费: number;
  设备费: number;
  其他费: number;
}

/** 费用调拨记录 */
export interface EstimateTransferRecord {
  id: string;
  projectId: string;
  operator: string;
  time: string;
  remark: string;
  before: EstimateTransferSnapshot;
  after: EstimateTransferSnapshot;
}

const FEE_SPLIT = [0.12, 0.38, 0.35, 0.15] as const;

function splitAmount(total: number, index: number): number {
  if (index < 3) return Math.round(total * FEE_SPLIT[index] * 100) / 100;
  const used = [0, 1, 2].reduce((s, i) => s + Math.round(total * FEE_SPLIT[i] * 100) / 100, 0);
  return Math.round((total - used) * 100) / 100;
}

function buildFeeLines(project: EstimateProject): EstimateFeeLine[] {
  return ESTIMATE_FEE_TYPES.map((type, i) => {
    const approvedAmount = splitAmount(project.preBudgetAmount, i);
    const actualAmount = splitAmount(project.actualBudgetAmount, i);
    const contractOccupied = splitAmount(Math.round(project.occupiedAmount * 0.62), i);
    const demandOccupied = splitAmount(Math.round(project.occupiedAmount * 0.38), i);
    const occupiedAmount = Math.round((contractOccupied + demandOccupied) * 100) / 100;
    const availableAmount = Math.max(0, Math.round((actualAmount - occupiedAmount) * 100) / 100);
    const remarks = ['初步设计及施工图设计', '土建与安装工程', '主机及配套设备', '监理、检测及其他'];
    return {
      type,
      approvedAmount,
      actualAmount,
      occupiedAmount,
      contractOccupied,
      demandOccupied,
      availableAmount,
      remark: remarks[i],
    };
  });
}

function snapshotOf(lines: EstimateFeeLine[]): EstimateTransferSnapshot {
  const snap = { 设计费: 0, 建安费: 0, 设备费: 0, 其他费: 0 };
  lines.forEach((line) => { snap[line.type] = line.availableAmount; });
  return snap;
}

const feeLineStore = new Map<string, EstimateFeeLine[]>();
const transferStore = new Map<string, EstimateTransferRecord[]>();

function ensureFeeStore(projectId: string) {
  if (feeLineStore.has(projectId)) return;
  const project = getProjectById(projectId);
  if (!project) return;
  const current = buildFeeLines(project);
  feeLineStore.set(projectId, current);

  const operators = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟'];
  const remarks = [
    '将部分建安费可用额度调至设备费，满足进口备件采购',
    '设计范围扩大，自其他费调入设计费',
    '安装工程暂缓，建安费调回其他费备用',
    '设备到货提前，自设计费结余调入设备费',
    '按现场签证调整建安费与其他费可用额度',
    '监理周期延长，自设备费调入其他费',
  ];
  const records: EstimateTransferRecord[] = [];
  let cursor = current.map((l) => ({ ...l }));
  for (let n = 5; n >= 0; n--) {
    const after = snapshotOf(cursor);
    const beforeLines = cursor.map((l) => ({ ...l }));
    const from = n % 4;
    const to = (n + 1) % 4;
    const move = Math.round(Math.min(beforeLines[from].availableAmount * 0.08, 80000) * 100) / 100;
    if (move > 0) {
      beforeLines[from].availableAmount = Math.round((beforeLines[from].availableAmount + move) * 100) / 100;
      beforeLines[to].availableAmount = Math.max(0, Math.round((beforeLines[to].availableAmount - move) * 100) / 100);
    }
    const month = String(1 + (n % 5)).padStart(2, '0');
    const day = String(8 + n * 3).padStart(2, '0');
    records.push({
      id: `${projectId}-tf-${n + 1}`,
      projectId,
      operator: operators[n % operators.length],
      time: `2026-${month}-${day} ${String(9 + n).padStart(2, '0')}:${String(10 + n * 7).padStart(2, '0')}`,
      remark: remarks[n % remarks.length],
      before: snapshotOf(beforeLines),
      after,
    });
    cursor = beforeLines;
  }
  transferStore.set(projectId, records.sort((a, b) => b.time.localeCompare(a.time)));
}

export function getProjectFeeLines(projectId: string): EstimateFeeLine[] {
  ensureFeeStore(projectId);
  return (feeLineStore.get(projectId) || []).map((l) => ({ ...l }));
}

export function getProjectTransferRecords(projectId: string): EstimateTransferRecord[] {
  ensureFeeStore(projectId);
  return [...(transferStore.get(projectId) || [])];
}

export interface FeeTransferInput {
  type: EstimateFeeType;
  direction: '加' | '减';
  /** 万元 */
  amountWan: number;
}

/** 确认费用调拨：可用金额总和必须不变，单项调拨后不得为负 */
export function applyFeeTransfer(
  projectId: string,
  inputs: FeeTransferInput[],
  remark: string,
  operator = '当前用户',
): { ok: boolean; message: string } {
  if (isFeeChangeLocked(projectId)) {
    return { ok: false, message: '费用增补审批期间无法执行费用调拨' };
  }
  ensureFeeStore(projectId);
  const lines = feeLineStore.get(projectId);
  if (!lines) return { ok: false, message: '未找到项目费用明细' };

  const deltas = new Map<EstimateFeeType, number>();
  ESTIMATE_FEE_TYPES.forEach((t) => deltas.set(t, 0));
  for (const input of inputs) {
    if (!input.amountWan || input.amountWan <= 0) continue;
    const yuan = Math.round(input.amountWan * 10000 * 100) / 100;
    const signed = input.direction === '加' ? yuan : -yuan;
    deltas.set(input.type, (deltas.get(input.type) || 0) + signed);
  }
  const net = [...deltas.values()].reduce((s, v) => s + v, 0);
  if (Math.abs(net) > 0.01) {
    return { ok: false, message: '调拨后可用金额总和必须等于原可用金额总和，请调整增减项使合计为 0' };
  }
  const changed = [...deltas.values()].some((v) => Math.abs(v) > 0.01);
  if (!changed) return { ok: false, message: '请填写至少一项费用调拨金额' };

  for (const line of lines) {
    const next = Math.round((line.availableAmount + (deltas.get(line.type) || 0)) * 100) / 100;
    if (next < -0.01) {
      return { ok: false, message: `${line.type}调拨后可用金额不能为负` };
    }
  }

  const before = snapshotOf(lines);
  lines.forEach((line) => {
    line.availableAmount = Math.max(0, Math.round((line.availableAmount + (deltas.get(line.type) || 0)) * 100) / 100);
  });
  const after = snapshotOf(lines);
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  const time = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())} ${p(now.getHours())}:${p(now.getMinutes())}`;
  const records = transferStore.get(projectId) || [];
  records.unshift({
    id: `${projectId}-tf-${Date.now()}`,
    projectId,
    operator,
    time,
    remark: remark.trim(),
    before,
    after,
  });
  transferStore.set(projectId, records);
  return { ok: true, message: '费用调拨已保存' };
}

export interface EstimatePlanControl {
  planName: string;
  planNo: string;
  /** 计划管控金额（元） */
  controlAmount: number;
  /** 计划占用金额（元） */
  occupiedAmount: number;
  /** 计划可用金额（元） */
  availableAmount: number;
}

export interface EstimateSupplementItem {
  type: EstimateFeeType;
  direction: '加' | '减';
  /** 元 */
  amountYuan: number;
}

export interface EstimateSupplementApplication {
  id: string;
  projectId: string;
  reason: string;
  items: EstimateSupplementItem[];
  status: '审批中' | '已通过' | '已驳回';
  createdAt: string;
  operator?: string;
  processId?: string;
  attachments?: string[];
  before?: EstimateTransferSnapshot;
  after?: EstimateTransferSnapshot;
}

/** 费用增补历史记录（含审批通过/驳回） */
export interface EstimateSupplementRecord {
  id: string;
  projectId: string;
  operator: string;
  time: string;
  reason: string;
  before: EstimateTransferSnapshot;
  after: EstimateTransferSnapshot;
  attachments: string[];
  processId: string;
  /** 审批流程节点快照（点击流程 ID 可视化） */
  flowNodes: EstimateApprovalFlowNode[];
  status: '审批中' | '已通过' | '已驳回';
}

const supplementStore = new Map<string, EstimateSupplementApplication>();
const supplementRecordStore = new Map<string, EstimateSupplementRecord[]>();
let supplementProcessSeq = 100;

function nextSupplementProcessId() {
  supplementProcessSeq += 1;
  return `SP-EST-SUP-${String(supplementProcessSeq).padStart(3, '0')}`;
}

function actualSnapshotOf(lines: EstimateFeeLine[]): EstimateTransferSnapshot {
  const snap = { 设计费: 0, 建安费: 0, 设备费: 0, 其他费: 0 };
  lines.forEach((line) => { snap[line.type] = line.actualAmount; });
  return snap;
}

function defaultSupplementFlow(operator: string, status: EstimateSupplementRecord['status']): EstimateApprovalFlowNode[] {
  if (status === '已通过') {
    return [
      { name: '项目负责人提交', role: operator, status: 'passed', time: '2026-02-10 09:20', opinion: '已提交费用增补申请' },
      { name: '工程管理部审核', role: '李建国', status: 'passed', time: '2026-02-11 14:30', opinion: '同意' },
      { name: '财务部审核', role: '孙伟', status: 'passed', time: '2026-02-12 10:15', opinion: '同意增补' },
    ];
  }
  if (status === '已驳回') {
    return [
      { name: '项目负责人提交', role: operator, status: 'passed', time: '2026-01-20 11:00', opinion: '已提交费用增补申请' },
      { name: '工程管理部审核', role: '李建国', status: 'rejected', time: '2026-01-21 16:40', opinion: '测算依据不充分，请补充后重报' },
      { name: '财务部审核', role: '孙伟', status: 'pending' },
    ];
  }
  return [
    { name: '项目负责人提交', role: operator, status: 'passed', time: nowStamp(), opinion: '已提交费用增补申请' },
    { name: '工程管理部审核', role: '李建国', status: 'current' },
    { name: '财务部审核', role: '孙伟', status: 'pending' },
  ];
}

function ensureSupplementRecordSeed(projectId: string) {
  if (supplementRecordStore.has(projectId)) return;
  const project = getProjectById(projectId);
  if (!project) return;
  ensureFeeStore(projectId);
  const lines = (feeLineStore.get(projectId) || []).map((l) => ({ ...l }));
  const operators = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟'];
  const reasons = [
    '现场工程量增加，增补建安费',
    '设备规格升级，增补设备费',
    '设计深化导致设计费上调',
    '监理周期延长，增补其他费',
    '签证变更引起建安费与其他费调整',
    '进口设备关税差额增补',
  ];
  const attachSamples = [
    ['费用增补申请表.pdf', '增补测算明细.xlsx'],
    ['费用增补申请表.docx', '现场签证单.pdf', '报价对比表.xlsx'],
    ['费用增补申请表.pdf'],
    ['费用增补申请表.pdf', '会议纪要.pdf'],
    ['费用增补申请表.docx', '增补测算明细.xlsx', '现场照片.zip'],
    ['费用增补申请表.pdf', '业主确认函.pdf'],
  ];
  const records: EstimateSupplementRecord[] = [];
  let cursor = lines.map((l) => ({ ...l }));
  for (let n = 0; n < 6; n++) {
    const before = actualSnapshotOf(cursor);
    const type = ESTIMATE_FEE_TYPES[n % 4];
    const addYuan = Math.round((30000 + n * 12000) * 100) / 100;
    const next = cursor.map((l) => ({ ...l }));
    const line = next.find((l) => l.type === type)!;
    line.actualAmount = Math.round((line.actualAmount + addYuan) * 100) / 100;
    line.availableAmount = Math.max(0, Math.round((line.actualAmount - line.occupiedAmount) * 100) / 100);
    const after = actualSnapshotOf(next);
    const status: EstimateSupplementRecord['status'] = n === 5 ? '已驳回' : '已通过';
    const operator = operators[n % operators.length];
    const month = String(1 + (n % 5)).padStart(2, '0');
    const day = String(6 + n * 4).padStart(2, '0');
    records.push({
      id: `${projectId}-sup-rec-${n + 1}`,
      projectId,
      operator,
      time: `2026-${month}-${day} ${String(9 + n).padStart(2, '0')}:${String(12 + n * 5).padStart(2, '0')}`,
      reason: reasons[n % reasons.length],
      before,
      after: status === '已驳回' ? before : after,
      attachments: attachSamples[n % attachSamples.length],
      processId: nextSupplementProcessId(),
      flowNodes: defaultSupplementFlow(operator, status),
      status,
    });
    if (status === '已通过') cursor = next;
  }
  supplementRecordStore.set(projectId, records.reverse());
}

export function getProjectSupplementRecords(projectId: string): EstimateSupplementRecord[] {
  ensureSupplementRecordSeed(projectId);
  const pending = getPendingSupplement(projectId);
  const list = [...(supplementRecordStore.get(projectId) || [])];
  if (pending && pending.before && pending.processId) {
    const exists = list.some((r) => r.id === pending.id);
    if (!exists) {
      list.unshift({
        id: pending.id,
        projectId,
        operator: pending.operator || '当前用户',
        time: pending.createdAt,
        reason: pending.reason,
        before: pending.before,
        after: pending.after || pending.before,
        attachments: pending.attachments || [],
        processId: pending.processId,
        flowNodes: getProjectById(projectId)?.approvalFlow || defaultSupplementFlow(pending.operator || '当前用户', '审批中'),
        status: '审批中',
      });
    }
  }
  return list;
}

export function getSupplementRecordByProcessId(processId: string): EstimateSupplementRecord | undefined {
  for (const records of supplementRecordStore.values()) {
    const hit = records.find((r) => r.processId === processId);
    if (hit) return hit;
  }
  for (const p of estimateProjects) {
    const pending = supplementStore.get(p.id);
    if (pending?.processId === processId && pending.before) {
      return {
        id: pending.id,
        projectId: p.id,
        operator: pending.operator || '当前用户',
        time: pending.createdAt,
        reason: pending.reason,
        before: pending.before,
        after: pending.after || pending.before,
        attachments: pending.attachments || [],
        processId: pending.processId,
        flowNodes: p.approvalFlow || defaultSupplementFlow(pending.operator || '当前用户', '审批中'),
        status: pending.status,
      };
    }
  }
  return undefined;
}

export function getPlanControl(project: EstimateProject): EstimatePlanControl {
  const controlAmount = Math.round(Math.max(project.preBudgetAmount, project.actualBudgetAmount) * 1.2);
  const occupiedAmount = Math.min(project.occupiedAmount, controlAmount);
  return {
    planName: `${(project.planNo.match(/\d{4}/) || ['2026'])[0]}年度投资计划`,
    planNo: project.planNo,
    controlAmount,
    occupiedAmount,
    availableAmount: Math.max(0, controlAmount - occupiedAmount),
  };
}

export function yuanToWan(yuan: number): string {
  return (yuan / 10000).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function nowStamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function startSupplementFlow(project: EstimateProject) {
  project.approvalStatus = '审批中';
  project.approvalFlow = [
    { name: '项目负责人提交', role: project.projectManager || '当前用户', status: 'passed', time: nowStamp(), opinion: '已提交费用增补申请' },
    { name: '工程管理部审核', role: '李建国', status: 'current' },
    { name: '财务部审核', role: '孙伟', status: 'pending' },
  ];
}

/** 审批中 / 待审批时锁定费用增减与调拨 */
export function isFeeChangeLocked(projectId: string): boolean {
  ensureSupplementSeed(projectId);
  const project = getProjectById(projectId);
  if (!project) return false;
  return project.approvalStatus === '审批中' || project.approvalStatus === '待审批';
}

function ensureSupplementSeed(projectId: string) {
  if (supplementStore.has(projectId)) return;
  const project = getProjectById(projectId);
  if (!project) return;
  if (project.approvalStatus !== '审批中' && project.approvalStatus !== '待审批') return;
  ensureFeeStore(projectId);
  const lines = feeLineStore.get(projectId) || [];
  const before = actualSnapshotOf(lines);
  const room = getPlanControl(project).availableAmount;
  const amountYuan = Math.max(10000, Math.min(80000, Math.floor(room * 0.05) || 10000));
  const after = { ...before, 建安费: Math.round((before.建安费 + amountYuan) * 100) / 100 };
  const processId = nextSupplementProcessId();
  const operator = project.projectManager || '当前用户';
  supplementStore.set(projectId, {
    id: `${projectId}-sup-seed`,
    projectId,
    reason: '现场工程量增加，申请增补建安费，待审批通过后更新实际立项金额',
    items: [{ type: '建安费', direction: '加', amountYuan }],
    status: '审批中',
    createdAt: '2026-03-18 10:20',
    operator,
    processId,
    attachments: ['费用增补申请表.pdf', '增补测算明细.xlsx'],
    before,
    after,
  });
  if (!project.approvalFlow?.length) startSupplementFlow(project);
}

export function getPendingSupplement(projectId: string): EstimateSupplementApplication | undefined {
  ensureSupplementSeed(projectId);
  const app = supplementStore.get(projectId);
  if (app && app.status === '审批中') return app;
  return undefined;
}

export function submitFeeSupplement(
  projectId: string,
  inputs: { type: EstimateFeeType; direction: '加' | '减'; amountWan: number }[],
  reason: string,
  attachments: string[] = [],
): { ok: boolean; message: string } {
  const project = getProjectById(projectId);
  if (!project) return { ok: false, message: '未找到项目' };
  if (isFeeChangeLocked(projectId)) {
    return { ok: false, message: '审批期间无法执行费用增减，请待当前增补审批结束后再申请' };
  }
  ensureFeeStore(projectId);
  const lines = feeLineStore.get(projectId) || [];
  const items: EstimateSupplementItem[] = [];
  for (const input of inputs) {
    if (!input.amountWan || input.amountWan <= 0) continue;
    const amountYuan = Math.round(input.amountWan * 10000 * 100) / 100;
    const line = lines.find((l) => l.type === input.type);
    if (input.direction === '减' && line && amountYuan - line.availableAmount > 0.01) {
      return { ok: false, message: `${input.type}减少金额不能超过当前可用金额` };
    }
    items.push({ type: input.type, direction: input.direction, amountYuan });
  }
  if (items.length === 0) return { ok: false, message: '请填写至少一项增补费用' };
  if (!reason.trim()) return { ok: false, message: '请填写增补原因' };

  const net = items.reduce((s, it) => s + (it.direction === '加' ? it.amountYuan : -it.amountYuan), 0);
  const plan = getPlanControl(project);
  if (net > plan.availableAmount + 0.01) {
    return { ok: false, message: '增补费用不能超过计划可用金额' };
  }
  const nextActual = project.actualBudgetAmount + net;
  if (nextActual - plan.controlAmount > 0.01) {
    return { ok: false, message: '项目费用不能超过计划管控金额' };
  }
  for (const line of lines) {
    const item = items.find((it) => it.type === line.type);
    if (!item) continue;
    const signed = item.direction === '加' ? item.amountYuan : -item.amountYuan;
    if (line.actualAmount + signed + 0.01 < line.occupiedAmount) {
      return { ok: false, message: `${line.type}调整后不能低于已占用金额` };
    }
  }

  const before = actualSnapshotOf(lines);
  const previewAfter = { ...before };
  items.forEach((it) => {
    const signed = it.direction === '加' ? it.amountYuan : -it.amountYuan;
    previewAfter[it.type] = Math.round((previewAfter[it.type] + signed) * 100) / 100;
  });
  const processId = nextSupplementProcessId();
  const operator = project.projectManager || '当前用户';
  const app: EstimateSupplementApplication = {
    id: `${projectId}-sup-${Date.now()}`,
    projectId,
    reason: reason.trim().slice(0, 100),
    items,
    status: '审批中',
    createdAt: nowStamp(),
    operator,
    processId,
    attachments: [...attachments],
    before,
    after: previewAfter,
  };
  supplementStore.set(projectId, app);
  startSupplementFlow(project);
  ensureSupplementRecordSeed(projectId);
  const hist = supplementRecordStore.get(projectId) || [];
  hist.unshift({
    id: app.id,
    projectId,
    operator,
    time: app.createdAt,
    reason: app.reason,
    before,
    after: previewAfter,
    attachments: [...attachments],
    processId,
    flowNodes: project.approvalFlow || defaultSupplementFlow(operator, '审批中'),
    status: '审批中',
  });
  supplementRecordStore.set(projectId, hist);
  return { ok: true, message: '费用增补申请已提交，审批通过后将更新费用' };
}

/** 推进当前增补审批节点；全部通过后写入费用 */
export function advanceSupplementApproval(
  projectId: string,
  pass: boolean,
  opinion = '',
): { ok: boolean; message: string } {
  const project = getProjectById(projectId);
  const app = supplementStore.get(projectId);
  if (!project || !app || app.status !== '审批中') {
    return { ok: false, message: '当前没有待审批的费用增补' };
  }
  const flow = project.approvalFlow || [];
  const idx = flow.findIndex((n) => n.status === 'current');
  if (idx < 0) return { ok: false, message: '未找到当前审批节点' };
  const node = flow[idx];
  const syncRecord = (status: EstimateSupplementRecord['status'], afterSnap?: EstimateTransferSnapshot) => {
    ensureSupplementRecordSeed(projectId);
    const hist = supplementRecordStore.get(projectId) || [];
    const idxRec = hist.findIndex((r) => r.id === app.id || r.processId === app.processId);
    const payload: EstimateSupplementRecord = {
      id: app.id,
      projectId,
      operator: app.operator || project.projectManager || '当前用户',
      time: app.createdAt,
      reason: app.reason,
      before: app.before || actualSnapshotOf(feeLineStore.get(projectId) || []),
      after: afterSnap || app.after || app.before || actualSnapshotOf(feeLineStore.get(projectId) || []),
      attachments: app.attachments || [],
      processId: app.processId || nextSupplementProcessId(),
      flowNodes: [...(project.approvalFlow || [])],
      status,
    };
    if (idxRec >= 0) hist[idxRec] = payload;
    else hist.unshift(payload);
    supplementRecordStore.set(projectId, hist);
  };

  if (!pass) {
    node.status = 'rejected';
    node.time = nowStamp();
    node.opinion = opinion.trim() || '不同意本次费用增补';
    app.status = '已驳回';
    project.approvalStatus = '已驳回';
    syncRecord('已驳回', app.before);
    return { ok: true, message: '已驳回，费用未变更' };
  }
  node.status = 'passed';
  node.time = nowStamp();
  node.opinion = opinion.trim() || '同意';
  const next = flow[idx + 1];
  if (next) {
    next.status = 'current';
    project.approvalStatus = '审批中';
    syncRecord('审批中');
    return { ok: true, message: `已通过，待${next.name}` };
  }
  ensureFeeStore(projectId);
  const lines = feeLineStore.get(projectId) || [];
  let net = 0;
  app.items.forEach((item) => {
    const line = lines.find((l) => l.type === item.type);
    if (!line) return;
    const signed = item.direction === '加' ? item.amountYuan : -item.amountYuan;
    line.actualAmount = Math.round((line.actualAmount + signed) * 100) / 100;
    line.availableAmount = Math.max(0, Math.round((line.actualAmount - line.occupiedAmount) * 100) / 100);
    net += signed;
  });
  project.actualBudgetAmount = Math.round((project.actualBudgetAmount + net) * 100) / 100;
  project.availableAmount = Math.max(0, Math.round((project.actualBudgetAmount - project.occupiedAmount) * 100) / 100);
  const after = actualSnapshotOf(lines);
  app.after = after;
  app.status = '已通过';
  project.approvalStatus = '已通过';
  syncRecord('已通过', after);
  return { ok: true, message: '审批通过，费用已更新' };
}