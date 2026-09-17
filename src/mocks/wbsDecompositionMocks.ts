export interface WBSProject {
  id: string;
  projectName: string;
  approvalNo: string;
  contractNo: string;
  wbsStatus: '待提交' | '待审核' | '已驳回' | '已通过' | '变更审核中';
  currentVersion: string;
  overallProgress: number;
  projectManager: string;
  taskCount: number;
  tasks: WBSTask[];
  logs: WBSLog[];
  approvalFlow: WBSApprovalFlow[];
  attachments: string[];
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
  taskDesc?: string;
  expanded?: boolean;
}

export interface WBSLog {
  id: string;
  operationType: '创建草稿' | '保存草稿' | '提交呈核' | '审批通过' | '审批驳回' | '修改后重新提交' | '发起变更修改';
  operator: string;
  operationTime: string;
  operationDesc: string;
  versionNo: string;
}

export interface WBSApprovalFlow {
  nodeNo: number;
  nodeName: string;
  approver: string;
  status: '已通过' | '已驳回' | '审批中' | '待审批';
  comment?: string;
  approvalTime?: string;
}

export interface ProgressReport {
  id: string;
  taskId: string;
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
  actualStartDate: string;
  actualEndDate?: string;
  attachments: string[];
}

export interface WeeklyReport {
  id: string;
  projectId: string;
  reporter: string;
  reportTime: string;
  weekStartDate: string;
  weekEndDate: string;
  completedWork: string;
  nextWeekPlan: string;
  problems: string;
  attachments: string[];
  replies: ReportReply[];
  logs: OperationLog[];
}

export interface MonthlyReport {
  id: string;
  projectId: string;
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
  logs: OperationLog[];
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

export interface ProjectProgressItem {
  id: string;
  approvalNo: string;
  projectName: string;
  projectType: string;
  projectManager: string;
  totalTasks: number;
  planProgress: number;
  actualProgress: number;
  wbsStatus: '已通过' | '审批中' | '未拆解';
  tasks: WBSTask[];
  weeklyReports: WeeklyReport[];
  monthlyReports: MonthlyReport[];
  progressReports: ProgressReport[];
}

const projectTypes = ['A质量品种', 'B安全环保', 'C节能降耗', 'D工艺装备', 'E智能制造', 'F信息化'];
const managers = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟', '孙伟', '周鹏'];

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

function generateWBSTasks(projectId: string, status: string): WBSTask[] {
  const tasks: WBSTask[] = [];
  const isApproved = status === '已通过';

  const taskGroups = [
    {
      l1: '土建施工',
      l2s: [
        { name: '基础工程', weight: 20, leaf: false },
        { name: '主体结构', weight: 20, leaf: true },
        { name: '砌筑工程', weight: 20, leaf: true },
        { name: '防水工程', weight: 20, leaf: true },
        { name: '地坪工程', weight: 20, leaf: true },
      ],
    },
    {
      l1: '钢结构安装',
      l2s: [
        { name: '钢柱安装', weight: 25, leaf: false },
        { name: '钢梁安装', weight: 25, leaf: true },
        { name: '檩条安装', weight: 25, leaf: true },
        { name: '屋面围护', weight: 25, leaf: true },
      ],
    },
    {
      l1: '设备安装',
      l2s: [
        { name: '主机设备', weight: 30, leaf: true },
        { name: '辅机设备', weight: 30, leaf: true },
        { name: '电气设备', weight: 20, leaf: true },
        { name: '仪表设备', weight: 20, leaf: true },
      ],
    },
    {
      l1: '管道工程',
      l2s: [
        { name: '工艺管道', weight: 30, leaf: true },
        { name: '给排水管道', weight: 25, leaf: true },
        { name: '暖通管道', weight: 25, leaf: true },
        { name: '消防管道', weight: 20, leaf: true },
      ],
    },
    {
      l1: '电气工程',
      l2s: [
        { name: '高压配电', weight: 25, leaf: true },
        { name: '低压配电', weight: 25, leaf: true },
        { name: '照明系统', weight: 25, leaf: true },
        { name: '接地系统', weight: 25, leaf: true },
      ],
    },
    {
      l1: '调试验收',
      l2s: [
        { name: '单机调试', weight: 25, leaf: true },
        { name: '联动调试', weight: 25, leaf: true },
        { name: '性能验收', weight: 25, leaf: true },
        { name: '竣工验收', weight: 25, leaf: true },
      ],
    },
  ];

  let seq = 1;
  taskGroups.forEach((group) => {
    const l1Id = `${projectId}-t${seq}`;
    const l1Weight = group.l2s.reduce((s, l2) => s + l2.weight, 0);
    const l1PlanProgress = Math.floor(Math.random() * 30) + 60;
    const l1ActualProgress = isApproved ? Math.max(0, l1PlanProgress - Math.floor(Math.random() * 15)) : 0;
    tasks.push({
      id: l1Id,
      name: group.l1,
      weight: l1Weight,
      taskType: 'summary',
      planProgress: l1PlanProgress,
      actualProgress: l1ActualProgress,
      planStartDate: '2026-03-01',
      planEndDate: '2026-05-15',
      actualStartDate: isApproved ? '2026-03-03' : undefined,
      level: 1,
      parentId: null,
      isDelayed: isApproved && l1ActualProgress < l1PlanProgress,
      expanded: true,
    });
    seq += 1;

    group.l2s.forEach((l2, idx) => {
      const l2Id = `${projectId}-t${seq}`;
      const l2PlanProgress = Math.floor(Math.random() * 30) + 50;
      const l2ActualProgress = isApproved ? Math.max(0, l2PlanProgress - Math.floor(Math.random() * 15)) : 0;
      const monthStart = 3 + Math.floor(Math.random() * 2);
      const monthEnd = monthStart + 1 + Math.floor(Math.random() * 2);
      const l2Task: WBSTask = {
        id: l2Id,
        name: l2.name,
        weight: l2.weight,
        taskType: l2.leaf ? 'leaf' : 'summary',
        planProgress: l2PlanProgress,
        actualProgress: l2ActualProgress,
        planStartDate: `2026-${String(monthStart).padStart(2, '0')}-01`,
        planEndDate: `2026-${String(monthEnd).padStart(2, '0')}-28`,
        actualStartDate: isApproved ? `2026-${String(monthStart).padStart(2, '0')}-03` : undefined,
        level: l2.leaf ? 3 : 2,
        parentId: l1Id,
        isDelayed: isApproved && l2.leaf && l2ActualProgress < l2PlanProgress,
      };
      tasks.push(l2Task);
      seq += 1;

      if (!l2.leaf) {
        const l3Items = [
          { name: `${l2.name}-A标段`, weight: Math.floor(l2.weight * 0.6) },
          { name: `${l2.name}-B标段`, weight: Math.floor(l2.weight * 0.4) },
        ];
        l3Items.forEach((l3, l3Idx) => {
          const l3Id = `${projectId}-t${seq}`;
          const l3PlanProgress = Math.floor(Math.random() * 30) + 50;
          const l3ActualProgress = isApproved ? Math.max(0, l3PlanProgress - Math.floor(Math.random() * 15)) : 0;
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
            actualStartDate: isApproved ? `2026-${String(l3MonthStart).padStart(2, '0')}-05` : undefined,
            level: 3,
            parentId: l2Id,
            isDelayed: isApproved && l3ActualProgress < l3PlanProgress,
          });
          seq += 1;
        });
      }
    });
  });

  return tasks;
}

function generateWBSLogs(projectId: string, status: string): WBSLog[] {
  const logs: WBSLog[] = [];
  if (status === '待提交') return logs;

  logs.push({
    id: `${projectId}-log-1`,
    operationType: '创建草稿',
    operator: '张施工',
    operationTime: '2026-01-10 09:00:00',
    operationDesc: '项目经理首次创建WBS拆解',
    versionNo: 'V1',
  });

  logs.push({
    id: `${projectId}-log-2`,
    operationType: '保存草稿',
    operator: '张施工',
    operationTime: '2026-01-12 16:00:00',
    operationDesc: '项目经理暂存WBS拆解内容',
    versionNo: 'V1',
  });

  logs.push({
    id: `${projectId}-log-3`,
    operationType: '提交呈核',
    operator: '张施工',
    operationTime: '2026-01-15 10:00:00',
    operationDesc: '项目经理提交WBS拆解审批',
    versionNo: 'V1',
  });

  if (status === '已通过' || status === '变更审核中') {
    logs.push({
      id: `${projectId}-log-4`,
      operationType: '审批通过',
      operator: '李审核',
      operationTime: '2026-01-18 14:00:00',
      operationDesc: '审批流程通过，WBS版本V1生效',
      versionNo: 'V1',
    });
  }

  if (status === '已驳回') {
    logs.push({
      id: `${projectId}-log-4`,
      operationType: '审批驳回',
      operator: '王主管',
      operationTime: '2026-01-20 11:00:00',
      operationDesc: '审批流程驳回，权重分配不合理，部分任务时间重叠',
      versionNo: 'V1',
    });
  }

  if (status === '变更审核中') {
    logs.push({
      id: `${projectId}-log-5`,
      operationType: '发起变更修改',
      operator: '张施工',
      operationTime: '2026-03-20 09:00:00',
      operationDesc: '已通过审批的WBS需要修改，项目经理发起变更，原因：业主方调整施工顺序要求',
      versionNo: 'V2',
    });
    logs.push({
      id: `${projectId}-log-6`,
      operationType: '提交呈核',
      operator: '张施工',
      operationTime: '2026-03-25 11:00:00',
      operationDesc: '项目经理提交WBS变更审批',
      versionNo: 'V2',
    });
  }

  return logs;
}

function generateWBSApprovalFlow(status: string): WBSApprovalFlow[] {
  const flow: WBSApprovalFlow[] = [
    { nodeNo: 1, nodeName: '项目经理审核', approver: '张明远', status: '已通过', comment: '同意提交', approvalTime: '2026-01-15 15:00:00' },
    { nodeNo: 2, nodeName: '工程管理部审核', approver: '李建国', status: '已通过', comment: '审核通过', approvalTime: '2026-01-16 09:30:00' },
    { nodeNo: 3, nodeName: '总师室审核', approver: '王主管', status: '已通过', comment: '方案合理', approvalTime: '2026-01-18 14:00:00' },
  ];

  if (status === '已驳回') {
    flow[2].status = '已驳回';
    flow[2].comment = '权重分配不合理，部分任务时间重叠';
    flow[2].approvalTime = '2026-01-20 11:00:00';
  }

  if (status === '待审核') {
    flow[2].status = '审批中';
    flow[2].comment = '';
    flow[2].approvalTime = '';
  }

  if (status === '变更审核中') {
    flow[0].status = '已通过';
    flow[1].status = '已通过';
    flow[2].status = '审批中';
    flow[2].comment = '';
    flow[2].approvalTime = '';
  }

  return flow;
}

function generateProgressReports(projectId: string, tasks: WBSTask[]): ProgressReport[] {
  const leafTasks = tasks.filter((t) => t.taskType === 'leaf');
  const reports: ProgressReport[] = [];
  leafTasks.slice(0, 6).forEach((task, idx) => {
    const before = Math.max(0, (task.actualProgress ?? 0) - Math.floor(Math.random() * 20) - 10);
    const after = task.actualProgress ?? 0;
    const delayed = after < task.planProgress;
    reports.push({
      id: `${projectId}-pr-${idx}`,
      taskId: task.id,
      taskName: task.name,
      reporter: '张施工',
      reportTime: `2026-0${3 + idx}-15 10:00:00`,
      beforeProgress: before,
      afterProgress: after,
      planStartDate: task.planStartDate,
      planEndDate: task.planEndDate,
      currentPlanProgress: task.planProgress,
      isDelayed: delayed,
      delayReason: delayed ? '材料供应不及时' : '',
      solution: delayed ? '已与供应商沟通，加快供货进度' : '',
      progressDesc: `已完成${after}%工程量，${delayed ? '进度略有滞后' : '进度正常'}`,
      actualStartDate: task.actualStartDate ?? task.planStartDate,
      actualEndDate: after >= 100 ? task.planEndDate : undefined,
      attachments: ['施工进度照片.pdf'],
    });
  });
  return reports;
}

function generateWeeklyReports(projectId: string): WeeklyReport[] {
  const reports: WeeklyReport[] = [];
  const weeks = [
    { start: '2026-03-03', end: '2026-03-09' },
    { start: '2026-03-10', end: '2026-03-16' },
    { start: '2026-03-17', end: '2026-03-23' },
    { start: '2026-03-24', end: '2026-03-30' },
    { start: '2026-04-07', end: '2026-04-13' },
    { start: '2026-04-14', end: '2026-04-20' },
    { start: '2026-04-21', end: '2026-04-27' },
    { start: '2026-05-05', end: '2026-05-11' },
  ];

  const completedWorks = [
    '完成场地平整工作，清理建筑垃圾，测量放线完成',
    '基础开挖完成，钢筋绑扎进行中，混凝土浇筑完成50%',
    '主体结构施工完成30%，钢结构安装完成，焊接检测合格',
    '设备安装完成，管道连接完成，电气接线进行中',
    '调试试运行，系统联调完成，初步验收通过',
    '资料整理归档，竣工验收准备，遗留问题整改',
    '本周完成钢柱安装80%，钢梁安装60%，进度正常',
    '本周完成主机设备安装，辅机设备开始安装，进度略有滞后',
  ];

  const nextPlans = [
    '下周进行基础开挖和钢筋绑扎，准备混凝土浇筑',
    '下周继续主体结构施工，计划完成钢结构安装',
    '下周进行设备安装调试，准备电气接线',
    '下周进行管道试压和系统联调，准备初步验收',
    '下周进行竣工验收准备，整理资料归档',
    '下周继续钢梁安装，计划完成屋面围护',
    '下周完成辅机设备和电气设备安装',
  ];

  const problems = [
    '现场发现部分地下管线位置与图纸不符，需与设计单位沟通',
    '部分材料到场延迟，已与供应商协调，预计下周补齐',
    '天气原因导致停工2天，已调整施工计划，确保总体进度',
    '施工场地狭小，大型机械进场困难，需协调周边场地',
  ];

  weeks.forEach((week, i) => {
    reports.push({
      id: `${projectId}-weekly-${i}`,
      projectId,
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
      logs: [
        { id: `log-${i}-1`, operationType: '新增', operator: '张施工', operationTime: `${week.end} 10:00:00`, description: '施工方提交周报', detailContent: completedWorks[i % completedWorks.length] },
        ...(i % 3 === 0 ? [
          { id: `log-${i}-2`, operationType: '回复', operator: '李审核', operationTime: `${week.end} 14:00:00`, description: '甲方回复周报', detailContent: '收到，请关注材料到场情况，确保不影响后续施工进度。' },
        ] : []),
      ],
    });
  });

  return reports;
}

function generateMonthlyReports(projectId: string): MonthlyReport[] {
  const reports: MonthlyReport[] = [];
  const months = [
    { start: '2026-03-01', end: '2026-03-31' },
    { start: '2026-04-01', end: '2026-04-30' },
    { start: '2026-05-01', end: '2026-05-31' },
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
      id: `${projectId}-monthly-${i}`,
      projectId,
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
      logs: [
        { id: `mlog-${i}-1`, operationType: '新增', operator: '张施工', operationTime: `${month.end} 10:00:00`, description: '施工方提交月报', detailContent: completedWorks[i] },
        ...(i % 2 === 0 ? [
          { id: `mlog-${i}-2`, operationType: '回复', operator: '李审核', operationTime: `${month.end} 14:00:00`, description: '甲方回复月报', detailContent: '本月进度基本正常，请关注下月关键节点完成情况。' },
        ] : []),
      ],
    });
  });

  return reports;
}

const wbsStatusPool: Array<'待提交' | '待审核' | '已驳回' | '已通过' | '变更审核中'> = [
  '已通过', '已通过', '待审核', '变更审核中', '已驳回', '已通过', '已通过', '待审核', '已通过', '已通过',
  '变更审核中', '已通过', '待审核', '已通过', '已通过',
];

export const wbsProjects: WBSProject[] = Array.from({ length: 15 }, (_, i) => {
  const seq = String(i + 1).padStart(3, '0');
  const status = wbsStatusPool[i];
  const projectId = `wbs_${seq}`;
  const tasks = generateWBSTasks(projectId, status);
  const approvedTasks = tasks.filter((t) => t.taskType === 'leaf' && t.actualProgress !== undefined);
  const overallProgress = approvedTasks.length > 0
    ? Math.round(approvedTasks.reduce((s, t) => s + (t.actualProgress ?? 0) * (t.weight / 100), 0))
    : 0;

  return {
    id: projectId,
    projectName: projectNames[i],
    approvalNo: `LX-2026-${seq}`,
    contractNo: `HT-2026-${seq}`,
    wbsStatus: status,
    currentVersion: status === '已通过' || status === '变更审核中' ? 'V1.0' : '',
    overallProgress: status === '已通过' ? overallProgress : 0,
    projectManager: managers[i % managers.length],
    taskCount: tasks.length,
    tasks,
    logs: generateWBSLogs(projectId, status),
    approvalFlow: generateWBSApprovalFlow(status),
    attachments: status === '已通过' ? ['WBS拆解方案.pdf', '任务清单.xlsx'] : [],
  };
});

export const projectProgressItems: ProjectProgressItem[] = wbsProjects.map((wp, i) => {
  const tasks = wp.tasks;
  const leafTasks = tasks.filter((t) => t.taskType === 'leaf');
  const planProgress = leafTasks.length > 0
    ? Math.round(leafTasks.reduce((s, t) => s + t.planProgress * (t.weight / 100), 0) / leafTasks.length)
    : 0;
  const actualProgress = leafTasks.length > 0 && wp.wbsStatus === '已通过'
    ? Math.round(leafTasks.reduce((s, t) => s + (t.actualProgress ?? 0) * (t.weight / 100), 0) / leafTasks.length)
    : 0;

  return {
    id: wp.id,
    approvalNo: wp.approvalNo,
    projectName: wp.projectName,
    projectType: projectTypes[i % projectTypes.length],
    projectManager: wp.projectManager,
    totalTasks: tasks.length,
    planProgress,
    actualProgress,
    wbsStatus: wp.wbsStatus === '已通过' ? '已通过' : wp.wbsStatus === '待审核' || wp.wbsStatus === '变更审核中' ? '审批中' : '未拆解',
    tasks,
    weeklyReports: generateWeeklyReports(wp.id),
    monthlyReports: generateMonthlyReports(wp.id),
    progressReports: wp.wbsStatus === '已通过' ? generateProgressReports(wp.id, tasks) : [],
  };
});

export function getWBSProjectById(id: string): WBSProject | undefined {
  return wbsProjects.find((p) => p.id === id);
}

export function getProjectProgressById(id: string): ProjectProgressItem | undefined {
  return projectProgressItems.find((p) => p.id === id);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}