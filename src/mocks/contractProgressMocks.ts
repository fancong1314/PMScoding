export interface Contract {
  id: string;
  approvalNo: string;
  contractNo: string;
  contractName: string;
  contractType: string;
  contractorNo: string;
  contractorName: string;
  mainContent: string;
  planProgress: number;
  actualProgress: number;
  contractStatus: string;
  projectType: string;
  ownerUnit: string;
  contractAmount: number;
  wbsStatus: '待提交' | '待审核' | '已驳回' | '已通过' | '变更审核中';
  wbsVersion: string;
  wbsTasks: WBSTask[];
  approvalRecords: WBSApprovalRecord[];
  reportRecords: ReportRecord[];
}

export interface WBSTask {
  id: string;
  name: string;
  weight: number;
  taskType: 'leaf' | 'summary';
  planProgress: number;
  actualProgress: number;
  planStartDate: string;
  planEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  level: 1 | 2 | 3;
  parentId: string | null;
  children?: WBSTask[];
  isDelayed?: boolean;
  delayReason?: string;
}

export interface WBSApprovalRecord {
  id: string;
  operationType: string;
  operationSide: '施工方' | '甲方';
  operator: string;
  operationTime: string;
  operationDesc: string;
  versionNo: string;
  result?: '通过' | '驳回' | '';
  rejectReason?: string;
  passNote?: string;
}

export interface ReportRecord {
  id: string;
  taskName: string;
  reporter: string;
  reportTime: string;
  beforeProgress: number;
  afterProgress: number;
  planStartDate: string;
  planEndDate: string;
  currentPlanProgress: number;
  isDelayed: boolean;
  delayReason: string;
  solution: string;
  progressDesc: string;
  attachments: string[];
}

export interface WeeklyReport {
  id: string;
  contractId: string;
  reporter: string;
  reportTime: string;
  weekStartDate: string;
  weekEndDate: string;
  completedWork: string;
  nextWeekPlan: string;
  problems: string;
  attachments: string[];
  replies: ReportReply[];
  operationLogs: OperationLog[];
}

export interface MonthlyReport {
  id: string;
  contractId: string;
  reporter: string;
  reportTime: string;
  monthStartDate: string;
  monthEndDate: string;
  completedWork: string;
  nextMonthPlan: string;
  problems: string;
  workVolume: string;
  attachments: string[];
  replies: ReportReply[];
  operationLogs: OperationLog[];
}

export interface ReportReply {
  id: string;
  replier: string;
  replyTime: string;
  content: string;
}

export interface OperationLog {
  id: string;
  operationType: string;
  operator: string;
  operationTime: string;
  description: string;
  detailContent?: string;
}

const contractTypes = ['施工合同', '采购合同', '设计合同', '监理合同', '设备合同', '技术服务合同'];
const projectTypes = ['A质量品种', 'B安全环保', 'C节能降耗', 'D工艺装备', 'E智能制造', 'F信息化'];
const ownerUnits = ['炼铁事业部', '炼钢事业部', '轧钢事业部', '能源环保部', '设备部', '安全能环部', '技术中心'];
const contractors = ['江苏建工集团', '中冶集团', '上海电气', '南京钢铁工程', '中建三局', '中国铁建', '中国五冶', '苏交科集团'];

const contractNames = [
  '1#高炉环保升级改造施工合同',
  '2#转炉设备采购合同',
  '轧钢车间自动化控制系统施工合同',
  '原料场智能化改造施工合同',
  '焦化区环保设施新建施工合同',
  '烧结区脱硫脱硝改造施工合同',
  '能源中心余热发电施工合同',
  '污水处理厂扩建改造施工合同',
  '配电室高低压设备采购合同',
  '办公楼信息化基础设施建设施工合同',
  '厂区道路硬化及管网改造施工合同',
  '安全防护设施完善升级施工合同',
  '仓储物流中心建设工程施工合同',
  '环保监测站房建设施工合同',
  '消防系统升级改造施工合同',
];

function generateWBSData(contractId: string): { tasks: WBSTask[]; records: WBSApprovalRecord[]; reportRecords: ReportRecord[] } {
  const tasks: WBSTask[] = [];
  const baseDate = '2026-01-15';

  const taskGroups = [
    {
      l1: '前期准备',
      l2s: [
        { name: '场地平整', weight: 3, leaf: true },
        { name: '临时设施搭建', weight: 2, leaf: true },
        { name: '施工图纸会审', weight: 2, leaf: true },
      ],
    },
    {
      l1: '主体施工',
      l2s: [
        { name: '基础工程', weight: 8, leaf: false },
        { name: '结构工程', weight: 15, leaf: false },
        { name: '设备安装', weight: 12, leaf: true },
        { name: '管道安装', weight: 10, leaf: true },
      ],
    },
    {
      l1: '配套设施',
      l2s: [
        { name: '电气工程', weight: 6, leaf: true },
        { name: '给排水工程', weight: 4, leaf: true },
        { name: '暖通工程', weight: 3, leaf: true },
      ],
    },
    {
      l1: '验收收尾',
      l2s: [
        { name: '调试试运行', weight: 5, leaf: true },
        { name: '竣工验收', weight: 3, leaf: true },
        { name: '资料移交', weight: 2, leaf: true },
      ],
    },
  ];

  let seq = 1;
  taskGroups.forEach((group) => {
    const l1Id = `${contractId}-task-${seq}`;
    const l1Weight = group.l2s.reduce((s, l2) => s + l2.weight, 0);
    const l1PlanProgress = Math.floor(Math.random() * 100);
    const l1ActualProgress = Math.max(0, l1PlanProgress - Math.floor(Math.random() * 20));
    tasks.push({
      id: l1Id,
      name: group.l1,
      weight: l1Weight,
      taskType: 'summary',
      planProgress: l1PlanProgress,
      actualProgress: l1ActualProgress,
      planStartDate: baseDate,
      planEndDate: '2026-12-31',
      actualStartDate: baseDate,
      level: 1,
      parentId: null,
      isDelayed: l1ActualProgress < l1PlanProgress,
      delayReason: l1ActualProgress < l1PlanProgress ? '施工进度滞后' : '',
    });
    seq += 1;

    group.l2s.forEach((l2, idx) => {
      const l2Id = `${contractId}-task-${seq}`;
      const l2PlanProgress = Math.floor(Math.random() * 100);
      const l2ActualProgress = l2.leaf ? Math.max(0, l2PlanProgress - Math.floor(Math.random() * 15)) : l2PlanProgress;
      const monthStart = 1 + Math.floor(Math.random() * 6);
      const monthEnd = monthStart + 1 + Math.floor(Math.random() * 4);
      const l2Task: WBSTask = {
        id: l2Id,
        name: l2.name,
        weight: l2.weight,
        taskType: l2.leaf ? 'leaf' : 'summary',
        planProgress: l2PlanProgress,
        actualProgress: l2ActualProgress,
        planStartDate: `2026-${String(monthStart).padStart(2, '0')}-01`,
        planEndDate: `2026-${String(monthEnd).padStart(2, '0')}-28`,
        actualStartDate: `2026-${String(monthStart).padStart(2, '0')}-05`,
        level: l2.leaf ? 3 : 2,
        parentId: l1Id,
        isDelayed: l2.leaf && l2ActualProgress < l2PlanProgress,
        delayReason: l2.leaf && l2ActualProgress < l2PlanProgress ? '材料供应不及时' : '',
      };
      tasks.push(l2Task);
      seq += 1;

      if (!l2.leaf) {
        const l3Items = [
          { name: `${l2.name}-A段`, weight: Math.floor(l2.weight * 0.6) },
          { name: `${l2.name}-B段`, weight: Math.floor(l2.weight * 0.4) },
        ];
        l3Items.forEach((l3, l3Idx) => {
          const l3Id = `${contractId}-task-${seq}`;
          const l3PlanProgress = Math.floor(Math.random() * 100);
          const l3ActualProgress = Math.max(0, l3PlanProgress - Math.floor(Math.random() * 15));
          const l3MonthStart = monthStart + l3Idx;
          const l3MonthEnd = l3MonthStart + 1 + Math.floor(Math.random() * 2);
          tasks.push({
            id: l3Id,
            name: l3.name,
            weight: l3.weight,
            taskType: 'leaf',
            planProgress: l3PlanProgress,
            actualProgress: l3ActualProgress,
            planStartDate: `2026-${String(l3MonthStart).padStart(2, '0')}-01`,
            planEndDate: `2026-${String(l3MonthEnd).padStart(2, '0')}-28`,
            actualStartDate: `2026-${String(l3MonthStart).padStart(2, '0')}-10`,
            level: 3,
            parentId: l2Id,
            isDelayed: l3ActualProgress < l3PlanProgress,
            delayReason: l3ActualProgress < l3PlanProgress ? '天气原因导致停工' : '',
          });
          seq += 1;
        });
      }
    });
  });

  const records: WBSApprovalRecord[] = [
    {
      id: `${contractId}-rec-1`,
      operationType: '提交审核',
      operationSide: '施工方',
      operator: '张施工',
      operationTime: '2026-01-15 10:00:00',
      operationDesc: '施工方整体拆解完成后提交至甲方审核',
      versionNo: 'V1',
      result: '',
    },
    {
      id: `${contractId}-rec-2`,
      operationType: '整体审核通过',
      operationSide: '甲方',
      operator: '李审核',
      operationTime: '2026-01-18 16:00:00',
      operationDesc: '甲方审核通过WBS拆解方案，任务结构完整，权重分配合理，计划时间安排可行',
      versionNo: 'V1',
      result: '通过',
      passNote: '任务结构完整，权重分配合理，计划时间安排可行',
    },
    {
      id: `${contractId}-rec-3`,
      operationType: '发起计划变更重新拆解',
      operationSide: '施工方',
      operator: '张施工',
      operationTime: '2026-03-20 09:00:00',
      operationDesc: '施工方因施工计划变更发起新一轮整体重新拆解，变更原因：业主方调整施工顺序要求',
      versionNo: 'V2',
      result: '',
    },
    {
      id: `${contractId}-rec-4`,
      operationType: '重新拆解后提交',
      operationSide: '施工方',
      operator: '张施工',
      operationTime: '2026-03-25 11:00:00',
      operationDesc: '施工方根据甲方修改意见重新拆解全部任务后再次提交',
      versionNo: 'V2',
      result: '',
    },
    {
      id: `${contractId}-rec-5`,
      operationType: '整体审核驳回',
      operationSide: '甲方',
      operator: '王主管',
      operationTime: '2026-03-28 14:00:00',
      operationDesc: '甲方审核驳回WBS拆解方案，权重分配不合理，部分任务时间重叠',
      versionNo: 'V2',
      result: '驳回',
      rejectReason: '1. 主体施工权重占比过高，配套设施权重不足；2. 部分任务计划时间重叠，未考虑施工场地限制；3. 缺少验收收尾阶段的详细计划。请重新调整权重分配并细化时间安排。',
    },
    {
      id: `${contractId}-rec-6`,
      operationType: '重新拆解后提交',
      operationSide: '施工方',
      operator: '张施工',
      operationTime: '2026-04-05 10:00:00',
      operationDesc: '施工方根据驳回意见重新调整权重分配，细化时间安排后再次提交',
      versionNo: 'V3',
      result: '',
    },
  ];

  const reportRecords: ReportRecord[] = tasks
    .filter((t) => t.taskType === 'leaf')
    .slice(0, 6)
    .map((task, idx) => {
      const beforeProgress = Math.max(0, task.actualProgress - Math.floor(Math.random() * 20) - 10);
      const afterProgress = task.actualProgress;
      const today = new Date();
      const todayStr = `2026-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const delayed = afterProgress < task.planProgress;
      return {
        id: `${contractId}-report-${idx}`,
        taskName: task.name,
        reporter: '张施工',
        reportTime: `2026-${String(2 + idx).padStart(2, '0')}-15 10:00:00`,
        beforeProgress,
        afterProgress,
        planStartDate: task.planStartDate,
        planEndDate: task.planEndDate,
        currentPlanProgress: task.planProgress,
        isDelayed: delayed,
        delayReason: delayed ? '材料供应不及时' : '',
        solution: delayed ? '已与供应商沟通，加快供货进度' : '',
        progressDesc: `已完成${afterProgress}%工程量，${delayed ? '进度略有滞后' : '进度正常'}`,
        attachments: ['施工进度照片.pdf', '材料验收单.pdf'],
      };
    });

  return { tasks, records, reportRecords };
}

function generateWeeklyReports(contractId: string): WeeklyReport[] {
  const reports: WeeklyReport[] = [];
  const weeks = [
    { start: '2026-01-06', end: '2026-01-12' },
    { start: '2026-01-13', end: '2026-01-19' },
    { start: '2026-01-20', end: '2026-01-26' },
    { start: '2026-02-03', end: '2026-02-09' },
    { start: '2026-02-10', end: '2026-02-16' },
    { start: '2026-02-17', end: '2026-02-23' },
    { start: '2026-03-03', end: '2026-03-09' },
    { start: '2026-03-10', end: '2026-03-16' },
    { start: '2026-03-17', end: '2026-03-23' },
    { start: '2026-04-07', end: '2026-04-13' },
  ];

  const completedWorks = [
    '完成场地平整工作，清理建筑垃圾，测量放线完成',
    '基础开挖完成，钢筋绑扎进行中，混凝土浇筑完成50%',
    '主体结构施工完成30%，钢结构安装完成，焊接检测合格',
    '设备安装完成，管道连接完成，电气接线进行中',
    '调试试运行，系统联调完成，初步验收通过',
    '资料整理归档，竣工验收准备，遗留问题整改',
  ];

  const nextPlans = [
    '下周进行基础开挖和钢筋绑扎，准备混凝土浇筑',
    '下周继续主体结构施工，计划完成钢结构安装',
    '下周进行设备安装调试，准备电气接线',
    '下周进行管道试压和系统联调，准备初步验收',
    '下周进行竣工验收准备，整理资料归档',
  ];

  const problems = [
    '现场发现部分地下管线位置与图纸不符，需与设计单位沟通',
    '部分材料到场延迟，已与供应商协调，预计下周补齐',
    '天气原因导致停工2天，已调整施工计划，确保总体进度',
    '施工场地狭小，大型机械进场困难，需协调周边场地',
  ];

  weeks.forEach((week, i) => {
    reports.push({
      id: `${contractId}-weekly-${i}`,
      contractId,
      reporter: '张施工',
      reportTime: week.end,
      weekStartDate: week.start,
      weekEndDate: week.end,
      completedWork: completedWorks[i % completedWorks.length],
      nextWeekPlan: nextPlans[i % nextPlans.length],
      problems: i % 3 === 0 ? problems[i % problems.length] : '',
      attachments: i % 2 === 0 ? ['施工照片.zip', '进度报表.pdf'] : [],
      replies: i % 3 === 0 ? [
        { id: `reply-${i}-1`, replier: '李审核', replyTime: `${week.end} 14:00:00`, content: '收到，请关注材料到场情况，确保不影响后续施工进度。' },
      ] : [],
      operationLogs: [
        { id: `log-${i}-1`, operationType: '新增', operator: '张施工', operationTime: `${week.end} 10:00:00`, description: '施工方提交周报', detailContent: completedWorks[i % completedWorks.length] },
        ...(i % 3 === 0 ? [
          { id: `log-${i}-2`, operationType: '回复', operator: '李审核', operationTime: `${week.end} 14:00:00`, description: '甲方回复周报', detailContent: '收到，请关注材料到场情况，确保不影响后续施工进度。' },
        ] : []),
        ...(i % 5 === 0 ? [
          { id: `log-${i}-3`, operationType: '修改', operator: '张施工', operationTime: `${week.end} 16:00:00`, description: '施工方修改周报', detailContent: '修正了本周完成工作的描述，补充了施工进度照片。' },
        ] : []),
      ],
    });
  });

  return reports;
}

function generateMonthlyReports(contractId: string): MonthlyReport[] {
  const reports: MonthlyReport[] = [];
  const months = [
    { start: '2026-01-01', end: '2026-01-31' },
    { start: '2026-02-01', end: '2026-02-28' },
    { start: '2026-03-01', end: '2026-03-31' },
  ];

  const completedWorks = [
    '本月完成场地平整、基础开挖、钢筋绑扎等前期准备工作，施工进度达到15%',
    '本月完成主体结构施工30%，钢结构安装完成，焊接检测合格，施工进度达到45%',
    '本月完成设备安装、管道连接、电气接线等工作，施工进度达到75%',
  ];

  const nextPlans = [
    '下月计划完成主体结构施工，开始设备安装工作',
    '下月计划完成设备安装调试，准备系统联调',
    '下月计划完成竣工验收准备，整理资料归档',
  ];

  const problems = [
    '本月发现部分地下管线位置与图纸不符，已与设计单位沟通解决',
    '本月材料到场延迟，已与供应商协调，预计下月补齐',
  ];

  const workVolumes = [
    '混凝土浇筑1200立方米，钢筋绑扎50吨，土方开挖3000立方米',
    '钢结构安装800吨，设备安装10台套，管道安装1500米',
    '电气接线完成，调试完成，系统联调通过',
  ];

  months.forEach((month, i) => {
    reports.push({
      id: `${contractId}-monthly-${i}`,
      contractId,
      reporter: '张施工',
      reportTime: month.end,
      monthStartDate: month.start,
      monthEndDate: month.end,
      completedWork: completedWorks[i],
      nextMonthPlan: nextPlans[i],
      problems: i % 2 === 0 ? problems[i % problems.length] : '',
      workVolume: workVolumes[i],
      attachments: ['月度进度报告.pdf', '工程量统计表.xlsx'],
      replies: i % 2 === 0 ? [
        { id: `mreply-${i}-1`, replier: '李审核', replyTime: `${month.end} 14:00:00`, content: '本月进度基本正常，请关注下月关键节点完成情况。' },
      ] : [],
      operationLogs: [
        { id: `mlog-${i}-1`, operationType: '新增', operator: '张施工', operationTime: `${month.end} 10:00:00`, description: '施工方提交月报', detailContent: completedWorks[i] },
        ...(i % 2 === 0 ? [
          { id: `mlog-${i}-2`, operationType: '回复', operator: '李审核', operationTime: `${month.end} 14:00:00`, description: '甲方回复月报', detailContent: '本月进度基本正常，请关注下月关键节点完成情况。' },
        ] : []),
        ...(i % 3 === 0 ? [
          { id: `mlog-${i}-3`, operationType: '修改', operator: '张施工', operationTime: `${month.end} 16:00:00`, description: '施工方修改月报', detailContent: '修正了工程量统计数据，补充了验收单据。' },
        ] : []),
      ],
    });
  });

  return reports;
}

export const contracts: Contract[] = Array.from({ length: 15 }, (_, i) => {
  const seq = String(i + 1).padStart(3, '0');
  const statusPool = ['执行中', '已完工', '已结算', '已暂停', '待启动'];
  const wbsStatusPool: Array<'待提交' | '待审核' | '已驳回' | '已通过' | '变更审核中'> = ['已通过', '已通过', '待审核', '变更审核中', '已驳回', '已通过', '已通过', '待审核', '已通过', '已通过', '变更审核中', '已通过', '待审核', '已通过', '已通过'];
  const amount = [12000000, 8500000, 15000000, 6500000, 18000000, 12500000, 9000000, 16000000, 5500000, 10000000, 7500000, 13500000, 17000000, 6000000, 11000000][i];
  const planProgress = [75, 100, 45, 30, 90, 60, 85, 50, 100, 40, 55, 70, 80, 95, 25][i];
  const actualProgress = [70, 100, 40, 25, 85, 55, 80, 45, 100, 35, 50, 65, 75, 90, 20][i];
  const wbsVersion = wbsStatusPool[i] === '已通过' ? 'V1' : wbsStatusPool[i] === '变更审核中' ? 'V1' : wbsStatusPool[i] === '已驳回' ? 'V1' : '';
  const contractId = `ct_${seq}`;

  const wbsData = generateWBSData(contractId);

  return {
    id: contractId,
    approvalNo: `LX-2026-${seq}`,
    contractNo: `HT-2026-${seq}`,
    contractName: contractNames[i],
    contractType: contractTypes[i % contractTypes.length],
    contractorNo: `C-${seq}`,
    contractorName: contractors[i % contractors.length],
    mainContent: `${contractNames[i]}主要施工内容包括${['基础工程', '结构工程', '设备安装', '电气工程', '管道工程'][i % 5]}等`,
    planProgress,
    actualProgress,
    contractStatus: statusPool[i % statusPool.length],
    projectType: projectTypes[i % projectTypes.length],
    ownerUnit: ownerUnits[i % ownerUnits.length],
    contractAmount: amount,
    wbsStatus: wbsStatusPool[i],
    wbsVersion,
    wbsTasks: wbsData.tasks,
    approvalRecords: wbsData.records,
    reportRecords: wbsData.reportRecords,
  };
});

export const weeklyReportsMap: Record<string, WeeklyReport[]> = {};
export const monthlyReportsMap: Record<string, MonthlyReport[]> = {};

contracts.forEach((c) => {
  weeklyReportsMap[c.id] = generateWeeklyReports(c.id);
  monthlyReportsMap[c.id] = generateMonthlyReports(c.id);
});

export function getContractById(id: string): Contract | undefined {
  return contracts.find((c) => c.id === id);
}

export function getWeeklyReports(contractId: string): WeeklyReport[] {
  return weeklyReportsMap[contractId] ?? [];
}

export function getMonthlyReports(contractId: string): MonthlyReport[] {
  return monthlyReportsMap[contractId] ?? [];
}

export function getWeeklyReportById(contractId: string, reportId: string): WeeklyReport | undefined {
  return weeklyReportsMap[contractId]?.find((r) => r.id === reportId);
}

export function getMonthlyReportById(contractId: string, reportId: string): MonthlyReport | undefined {
  return monthlyReportsMap[contractId]?.find((r) => r.id === reportId);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}