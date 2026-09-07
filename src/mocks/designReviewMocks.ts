export interface EstimateItem {
  id: string;
  name: string;
  spec: string;
  catalog: string;
  fourClassNine: string;
  subClass: string;
  originalAmount: number;
  revisedAmount: number;
  level: 1 | 2 | 3;
  parentId: string | null;
  children?: EstimateItem[];
}

export interface DesignReviewProject {
  id: string;
  approvalNo: string;
  planNo: string;
  name: string;
  description: string;
  projectType: string;
  budgetAmount: number;
  preBudgetAmount: number;
  actualBudgetAmount: number;
  approvalDate: string;
  ownerUnit: string;
  implementUnit: string;
  projectManager: string;
  createDate: string;
  estimates: EstimateItem[];
}

export interface EstimateChangeLog {
  id: string;
  projectId: string;
  changedBy: string;
  changedAt: string;
  approvalResult: '已通过' | '审批中' | '已驳回' | '已撤销';
  beforeItems: EstimateItem[];
  afterItems: EstimateItem[];
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
  const estimates: EstimateItem[] = [];
  
  // Level 1: 工程费用
  const l1_1: EstimateItem = {
    id: 'e1-1',
    name: '工程费用',
    spec: '',
    catalog: '',
    fourClassNine: '',
    subClass: '',
    originalAmount: 2436000,
    revisedAmount: 2341000,
    level: 1,
    parentId: null,
  };
  estimates.push(l1_1);
  
  const l2_1: EstimateItem = {
    id: 'e1-1-1',
    name: '制氧厂配套管线',
    spec: 'DN200碳钢管线',
    catalog: '管道工程',
    fourClassNine: '四类九款-1',
    subClass: '工艺管道',
    originalAmount: 2436000,
    revisedAmount: 2341000,
    level: 2,
    parentId: 'e1-1',
  };
  estimates.push(l2_1);
  
  const l2_2: EstimateItem = {
    id: 'e1-1-2',
    name: '建筑工程费',
    spec: '',
    catalog: '建筑工程',
    fourClassNine: '四类九款-2',
    subClass: '土建工程',
    originalAmount: 1020000,
    revisedAmount: 1020000,
    level: 2,
    parentId: 'e1-1',
  };
  estimates.push(l2_2);
  
  const l3_1: EstimateItem = {
    id: 'e1-1-2-1',
    name: '土建及基础费用',
    spec: 'C30混凝土',
    catalog: '建筑工程',
    fourClassNine: '四类九款-2-1',
    subClass: '基础工程',
    originalAmount: 1020000,
    revisedAmount: 1020000,
    level: 3,
    parentId: 'e1-1-2',
  };
  estimates.push(l3_1);
  
  const l2_3: EstimateItem = {
    id: 'e1-1-3',
    name: '安装工程费',
    spec: '',
    catalog: '安装工程',
    fourClassNine: '四类九款-3',
    subClass: '设备安装',
    originalAmount: 595000,
    revisedAmount: 500000,
    level: 2,
    parentId: 'e1-1',
  };
  estimates.push(l2_3);
  
  const l3_2: EstimateItem = {
    id: 'e1-1-3-1',
    name: '施工安装费',
    spec: '人工+机械',
    catalog: '安装工程',
    fourClassNine: '四类九款-3-1',
    subClass: '安装作业',
    originalAmount: 595000,
    revisedAmount: 500000,
    level: 3,
    parentId: 'e1-1-3',
  };
  estimates.push(l3_2);
  
  const l2_4: EstimateItem = {
    id: 'e1-1-4',
    name: '设备工器具购置费',
    spec: '',
    catalog: '设备采购',
    fourClassNine: '四类九款-4',
    subClass: '设备购置',
    originalAmount: 821000,
    revisedAmount: 821000,
    level: 2,
    parentId: 'e1-1',
  };
  estimates.push(l2_4);
  
  const l3_3: EstimateItem = {
    id: 'e1-1-4-1',
    name: '材料费用',
    spec: '钢材、螺栓',
    catalog: '材料采购',
    fourClassNine: '四类九款-4-1',
    subClass: '主材',
    originalAmount: 591000,
    revisedAmount: 591000,
    level: 3,
    parentId: 'e1-1-4',
  };
  estimates.push(l3_3);
  
  const l3_4: EstimateItem = {
    id: 'e1-1-4-2',
    name: '备件费用',
    spec: '备用配件',
    catalog: '备件采购',
    fourClassNine: '四类九款-4-2',
    subClass: '备品备件',
    originalAmount: 230000,
    revisedAmount: 230000,
    level: 3,
    parentId: 'e1-1-4',
  };
  estimates.push(l3_4);
  
  // Level 1: 工程建设其他费
  const l1_2: EstimateItem = {
    id: 'e1-2',
    name: '工程建设其他费',
    spec: '',
    catalog: '',
    fourClassNine: '',
    subClass: '',
    originalAmount: 164000,
    revisedAmount: 259000,
    level: 1,
    parentId: null,
  };
  estimates.push(l1_2);
  
  const l2_5: EstimateItem = {
    id: 'e1-2-1',
    name: '设计费',
    spec: '初步+施工图',
    catalog: '技术服务',
    fourClassNine: '四类九款-5',
    subClass: '设计服务',
    originalAmount: 115000,
    revisedAmount: 179000,
    level: 2,
    parentId: 'e1-2',
  };
  estimates.push(l2_5);
  
  const l2_6: EstimateItem = {
    id: 'e1-2-2',
    name: '监理费',
    spec: '全过程监理',
    catalog: '技术服务',
    fourClassNine: '四类九款-6',
    subClass: '监理服务',
    originalAmount: 49000,
    revisedAmount: 80000,
    level: 2,
    parentId: 'e1-2',
  };
  estimates.push(l2_6);
  
  // Level 1: 预备费
  const l1_3: EstimateItem = {
    id: 'e1-3',
    name: '预备费',
    spec: '',
    catalog: '',
    fourClassNine: '',
    subClass: '',
    originalAmount: 0,
    revisedAmount: 0,
    level: 1,
    parentId: null,
  };
  estimates.push(l1_3);
  
  // Level 1: 结余费
  const l1_4: EstimateItem = {
    id: 'e1-4',
    name: '结余费',
    spec: '',
    catalog: '',
    fourClassNine: '',
    subClass: '',
    originalAmount: 0,
    revisedAmount: 0,
    level: 1,
    parentId: null,
  };
  estimates.push(l1_4);
  
  // Level 1: 项目总投资
  const l1_5: EstimateItem = {
    id: 'e1-5',
    name: '项目总投资',
    spec: '',
    catalog: '',
    fourClassNine: '',
    subClass: '',
    originalAmount: 2600000,
    revisedAmount: 2600000,
    level: 1,
    parentId: null,
  };
  estimates.push(l1_5);
  
  return estimates;
}

export const designReviewProjects: DesignReviewProject[] = Array.from({ length: 15 }, (_, i) => {
  const seq = String(i + 1).padStart(3, '0');
  const budget = [2600000, 1850000, 3200000, 1500000, 4200000, 2800000, 1900000, 3500000, 1200000, 2100000, 1600000, 2900000, 3800000, 1400000, 2500000][i];
  const preBudget = Math.floor(budget * 0.95);
  const actualBudget = budget;
  return {
    id: `design_${seq}`,
    approvalNo: `LX-2026-${seq}`,
    planNo: `JH-2026-${seq}`,
    name: projectNames[i],
    description: `${projectNames[i]}初步设计审查，涉及${['环保升级', '设备更新', '自动化改造', '智能化建设', '环保设施'][i % 5]}等内容`,
    projectType: projectTypes[i % projectTypes.length],
    budgetAmount: budget,
    preBudgetAmount: preBudget,
    actualBudgetAmount: actualBudget,
    approvalDate: `2026-0${1 + (i % 5)}-${String(5 + (i % 25)).padStart(2, '0')}`,
    ownerUnit: ownerUnits[i % ownerUnits.length],
    implementUnit: implementUnits[i % implementUnits.length],
    projectManager: managers[i % managers.length],
    createDate: `2026-0${1 + (i % 5)}-${String(1 + (i % 28)).padStart(2, '0')}`,
    estimates: generateEstimates(),
  };
});

export const estimateChangeLogs: EstimateChangeLog[] = [
  {
    id: 'log-001',
    projectId: 'design_001',
    changedBy: '王工程',
    changedAt: '2026-03-15 14:30:00',
    approvalResult: '已通过',
    beforeItems: [
      { id: 'e1-1', name: '工程费用', spec: '', catalog: '', fourClassNine: '', subClass: '', originalAmount: 2436000, revisedAmount: 2436000, level: 1, parentId: null },
      { id: 'e1-1-3', name: '安装工程费', spec: '', catalog: '安装工程', fourClassNine: '四类九款-3', subClass: '设备安装', originalAmount: 595000, revisedAmount: 595000, level: 2, parentId: 'e1-1' },
      { id: 'e1-1-3-1', name: '施工安装费', spec: '人工+机械', catalog: '安装工程', fourClassNine: '四类九款-3-1', subClass: '安装作业', originalAmount: 595000, revisedAmount: 595000, level: 3, parentId: 'e1-1-3' },
    ],
    afterItems: [
      { id: 'e1-1', name: '工程费用', spec: '', catalog: '', fourClassNine: '', subClass: '', originalAmount: 2436000, revisedAmount: 2341000, level: 1, parentId: null },
      { id: 'e1-1-3', name: '安装工程费', spec: '', catalog: '安装工程', fourClassNine: '四类九款-3', subClass: '设备安装', originalAmount: 595000, revisedAmount: 500000, level: 2, parentId: 'e1-1' },
      { id: 'e1-1-3-1', name: '施工安装费', spec: '人工+机械', catalog: '安装工程', fourClassNine: '四类九款-3-1', subClass: '安装作业', originalAmount: 595000, revisedAmount: 500000, level: 3, parentId: 'e1-1-3' },
    ],
    approvalFlow: [
      { node: '项目经理审核', approver: '张明远', status: '已通过', time: '2026-03-15 15:00:00', comment: '同意调整，金额合理' },
      { node: '工程管理部审核', approver: '李建国', status: '已通过', time: '2026-03-16 09:30:00', comment: '审核通过' },
    ],
  },
  {
    id: 'log-002',
    projectId: 'design_001',
    changedBy: '赵预算',
    changedAt: '2026-02-20 10:15:00',
    approvalResult: '已通过',
    beforeItems: [
      { id: 'e1-2', name: '工程建设其他费', spec: '', catalog: '', fourClassNine: '', subClass: '', originalAmount: 164000, revisedAmount: 164000, level: 1, parentId: null },
      { id: 'e1-2-1', name: '设计费', spec: '初步+施工图', catalog: '技术服务', fourClassNine: '四类九款-5', subClass: '设计服务', originalAmount: 115000, revisedAmount: 115000, level: 2, parentId: 'e1-2' },
      { id: 'e1-2-2', name: '监理费', spec: '全过程监理', catalog: '技术服务', fourClassNine: '四类九款-6', subClass: '监理服务', originalAmount: 49000, revisedAmount: 49000, level: 2, parentId: 'e1-2' },
    ],
    afterItems: [
      { id: 'e1-2', name: '工程建设其他费', spec: '', catalog: '', fourClassNine: '', subClass: '', originalAmount: 164000, revisedAmount: 259000, level: 1, parentId: null },
      { id: 'e1-2-1', name: '设计费', spec: '初步+施工图', catalog: '技术服务', fourClassNine: '四类九款-5', subClass: '设计服务', originalAmount: 115000, revisedAmount: 179000, level: 2, parentId: 'e1-2' },
      { id: 'e1-2-2', name: '监理费', spec: '全过程监理', catalog: '技术服务', fourClassNine: '四类九款-6', subClass: '监理服务', originalAmount: 49000, revisedAmount: 80000, level: 2, parentId: 'e1-2' },
    ],
    approvalFlow: [
      { node: '项目经理审核', approver: '张明远', status: '已通过', time: '2026-02-20 11:00:00', comment: '设计范围扩大，费用调整合理' },
      { node: '工程管理部审核', approver: '李建国', status: '已通过', time: '2026-02-21 14:20:00', comment: '审核通过' },
    ],
  },
];

export const employees = [
  { id: 'emp001', name: '张明远', dept: '工程管理部' },
  { id: 'emp002', name: '李建国', dept: '工程管理部' },
  { id: 'emp003', name: '王志强', dept: '设备管理部' },
  { id: 'emp004', name: '赵卫东', dept: '安全环保部' },
  { id: 'emp005', name: '陈建华', dept: '技术中心' },
  { id: 'emp006', name: '刘伟', dept: '基建部' },
  { id: 'emp007', name: '孙伟', dept: '财务部' },
  { id: 'emp008', name: '周鹏', dept: '人力资源部' },
  { id: 'emp009', name: '吴昊', dept: '采购部' },
  { id: 'emp010', name: '郑明', dept: '炼铁事业部' },
];

// === Generate comprehensive change logs for all projects ===
const changeOperators = ['王工程', '赵预算', '李造价', '张概算', '刘审价', '陈估算', '吴核算', '孙测算', '周评估', '郑审计'];
const changeReasons = [
  '根据现场实际情况调整安装费用',
  '设计范围扩大，设计费相应调整',
  '材料价格上涨，材料费增加',
  '施工方案优化，减少部分工程量',
  '新增环保要求，增加环保设施费用',
  '监理服务周期延长，监理费调整',
  '设备选型变更，设备购置费调整',
  '基础土质条件变化，基础工程费增加',
  '钢结构用量增加，钢结构费用调整',
  '管道走向变更，管道工程费调整',
  '电气负荷增加，电气工程费调整',
  '调试周期延长，调试验收费调整',
  '安全防护标准提高，安全设施费增加',
  '节能要求提升，节能设备费增加',
  '智能化程度提高，智能化设备费增加',
];

function cloneEstimates(items: EstimateItem[]): EstimateItem[] {
  return items.map((i) => ({ ...i, children: undefined }));
}

function makeBeforeVersion(items: EstimateItem[], seed: number): EstimateItem[] {
  const cloned = cloneEstimates(items);
  // Apply modifications based on seed
  const mods: Record<string, number> = {};
  cloned.forEach((item, idx) => {
    if (item.level >= 2 && item.revisedAmount > 0) {
      // Modify roughly 30% of items
      if ((idx + seed * 7) % 3 === 0) {
        const change = Math.floor(item.revisedAmount * (0.05 + (seed * 0.03)));
        mods[item.id] = item.revisedAmount + change;
      }
    }
  });

  // Apply modifications bottom-up
  const result = cloned.map((i) => ({ ...i }));
  Object.keys(mods).forEach((id) => {
    const item = result.find((x) => x.id === id);
    if (item) item.revisedAmount = mods[id];
  });

  // Recalculate parent amounts
  for (let l = 3; l >= 1; l--) {
    const parents = result.filter((i) => i.level === l && i.parentId === null);
    parents.forEach((parent) => {
      const children = result.filter((i) => i.parentId === parent.id);
      if (children.length > 0) {
        parent.revisedAmount = children.reduce((s, c) => s + c.revisedAmount, 0);
      }
    });
  }

  // Recalculate level 1 non-root
  for (let l = 2; l >= 1; l--) {
    result.filter((i) => i.level === l && i.parentId !== null).forEach((parent) => {
      const children = result.filter((i) => i.parentId === parent.id);
      if (children.length > 0) {
        parent.revisedAmount = children.reduce((s, c) => s + c.revisedAmount, 0);
      }
    });
  }

  return result;
}

function generateApprovalFlow(seed: number, result: '已通过' | '已驳回' | '审批中'): { node: string; approver: string; status: '已通过' | '待审批' | '已驳回'; time?: string; comment?: string }[] {
  const baseFlow = [
    { node: '项目经理审核', approver: '张明远', status: '已通过' as const, time: `2026-0${1 + (seed % 5)}-${String(10 + seed).padStart(2, '0')} 15:00:00`, comment: '同意调整，金额合理' },
    { node: '工程管理部审核', approver: '李建国', status: '已通过' as const, time: `2026-0${1 + (seed % 5)}-${String(11 + seed).padStart(2, '0')} 09:30:00`, comment: '审核通过' },
    { node: '总师室审核', approver: '王主管', status: result === '已通过' ? '已通过' as const : result === '已驳回' ? '已驳回' as const : '待审批' as const, time: result === '已通过' ? `2026-0${1 + (seed % 5)}-${String(12 + seed).padStart(2, '0')} 14:00:00` : result === '已驳回' ? `2026-0${1 + (seed % 5)}-${String(12 + seed).padStart(2, '0')} 11:00:00` : undefined, comment: result === '已通过' ? '方案合理，审批通过' : result === '已驳回' ? '金额调整幅度过大，需重新论证' : '' },
  ];
  return baseFlow;
}

function generateProjectLogs(project: DesignReviewProject): EstimateChangeLog[] {
  const logs: EstimateChangeLog[] = [];
  const logCount = 1 + (parseInt(project.id.replace('design_', ''), 10) % 3); // 1-3 logs per project

  for (let i = 0; i < logCount; i++) {
    const seed = parseInt(project.id.replace('design_', ''), 10) * 3 + i;
    const beforeItems = makeBeforeVersion(project.estimates, seed);
    const afterItems = cloneEstimates(project.estimates);

    // Determine if there are actual changes
    const hasChanges = beforeItems.some((b) => {
      const a = afterItems.find((x) => x.id === b.id);
      return !a || a.revisedAmount !== b.revisedAmount;
    });

    const results: Array<'已通过' | '审批中' | '已驳回'> = ['已通过', '已通过', '已通过', '已驳回', '审批中'];
    const approvalResult = results[seed % results.length];

    logs.push({
      id: `log-${project.id}-${i + 1}`,
      projectId: project.id,
      changedBy: changeOperators[seed % changeOperators.length],
      changedAt: `2026-0${1 + (seed % 5)}-${String(10 + seed).padStart(2, '0')} ${String(9 + (seed % 6)).padStart(2, '0')}:${String(seed % 60).padStart(2, '0')}:00`,
      approvalResult,
      beforeItems: hasChanges ? beforeItems : (i > 0 ? beforeItems : afterItems.map((x) => ({ ...x, revisedAmount: x.revisedAmount + Math.floor(Math.random() * 10000) }))),
      afterItems,
      approvalFlow: generateApprovalFlow(seed, approvalResult),
    });
  }

  return logs;
}

// Generate logs for all projects and merge with existing
const generatedLogs: EstimateChangeLog[] = designReviewProjects.flatMap((p) => generateProjectLogs(p));

// Merge: keep existing logs that aren't generated, add all generated
export const allEstimateChangeLogs: EstimateChangeLog[] = [
  ...estimateChangeLogs.filter((l) => !generatedLogs.some((g) => g.id === l.id)),
  ...generatedLogs,
];