// 信息化项目上线申请 Mock 数据

export interface ItLaunchProject {
  id: string;
  projectNo: string;
  projectName: string;
  projectType: string;
  contracts: ItLaunchContract[];
}

export interface ItLaunchContract {
  id: string;
  contractNo: string;
  contractName: string;
  contractAmount: number;
  selected?: boolean;
}

export interface ItLaunchApplication {
  id: string;
  projectNo: string;
  projectName: string;
  launchType: string; // 整体上线 / 分项上线
  projectType: string;
  creator: string;
  createTime: string;
  plannedLaunchTime: string;
  approvalNode: string;
  status: string; // 新建 / 审批中 / 已通过 / 已驳回
  launchNote?: string;
  estimatedStayHours?: number;
  impactScope?: string;
  riskAssessment?: string;
  attachments?: { name: string; uploaded: boolean }[];
  selectedContracts?: string[];
}

export interface ApprovalNodeConfig {
  nodeId: string;
  nodeName: string;
  approver: string;
  approverDept: string;
  sequence: number;
}

export interface ApprovalHistoryRecord {
  id: string;
  applicationId: string;
  sequence: number;
  nodeName: string;
  approver: string;
  status: string; // 已通过 / 已驳回 / 审批中 / 待审批
  opinion: string;
  time: string;
}

export const itLaunchProjects: ItLaunchProject[] = [
  {
    id: 'proj-001',
    projectNo: 'NG-2025-XM-0012',
    projectName: '智慧供应链协同管理平台',
    projectType: '信息化平台建设',
    contracts: [
      { id: 'c-001', contractNo: 'NG-HT-2025-0389', contractName: '智慧供应链平台软件开发合同', contractAmount: 12800000 },
      { id: 'c-002', contractNo: 'NG-HT-2025-0390', contractName: '供应链数据中台实施合同', contractAmount: 6200000 },
      { id: 'c-003', contractNo: 'NG-HT-2025-0421', contractName: '供应链硬件集成及部署合同', contractAmount: 4500000 },
    ],
  },
  {
    id: 'proj-002',
    projectNo: 'NG-2025-XM-0018',
    projectName: '智能制造执行系统(MES)升级',
    projectType: '信息化系统升级',
    contracts: [
      { id: 'c-004', contractNo: 'NG-HT-2025-0456', contractName: 'MES系统升级开发合同', contractAmount: 9600000 },
      { id: 'c-005', contractNo: 'NG-HT-2025-0457', contractName: 'MES数据迁移及接口开发合同', contractAmount: 3800000 },
      { id: 'c-006', contractNo: 'NG-HT-2025-0488', contractName: 'MES系统测试及培训服务合同', contractAmount: 1500000 },
      { id: 'c-007', contractNo: 'NG-HT-2025-0489', contractName: 'MES硬件升级部署合同', contractAmount: 2700000 },
    ],
  },
  {
    id: 'proj-003',
    projectNo: 'NG-2025-XM-0022',
    projectName: '数据治理及大数据分析平台',
    projectType: '信息化平台建设',
    contracts: [
      { id: 'c-008', contractNo: 'NG-HT-2025-0512', contractName: '数据治理平台软件开发合同', contractAmount: 8500000 },
      { id: 'c-009', contractNo: 'NG-HT-2025-0513', contractName: '大数据分析引擎实施合同', contractAmount: 7200000 },
    ],
  },
  {
    id: 'proj-004',
    projectNo: 'NG-2025-XM-0025',
    projectName: '企业资源计划(ERP)优化',
    projectType: '信息化系统优化',
    contracts: [
      { id: 'c-010', contractNo: 'NG-HT-2025-0530', contractName: 'ERP系统优化开发合同', contractAmount: 11000000 },
      { id: 'c-011', contractNo: 'NG-HT-2025-0531', contractName: 'ERP接口集成及数据清洗合同', contractAmount: 4200000 },
      { id: 'c-012', contractNo: 'NG-HT-2025-0555', contractName: 'ERP用户培训及运维服务合同', contractAmount: 2100000 },
    ],
  },
  {
    id: 'proj-005',
    projectNo: 'NG-2025-XM-0030',
    projectName: '工业互联网标识解析二级节点',
    projectType: '信息化平台建设',
    contracts: [
      { id: 'c-013', contractNo: 'NG-HT-2025-0580', contractName: '标识解析平台开发合同', contractAmount: 6500000 },
      { id: 'c-014', contractNo: 'NG-HT-2025-0581', contractName: '标识解析网关部署合同', contractAmount: 3100000 },
    ],
  },
  {
    id: 'proj-006',
    projectNo: 'NG-2025-XM-0033',
    projectName: '安全生产信息化管理平台',
    projectType: '信息化平台建设',
    contracts: [
      { id: 'c-015', contractNo: 'NG-HT-2025-0600', contractName: '安全信息化平台开发合同', contractAmount: 5800000 },
      { id: 'c-016', contractNo: 'NG-HT-2025-0601', contractName: '安全监控硬件部署合同', contractAmount: 3400000 },
      { id: 'c-017', contractNo: 'NG-HT-2025-0620', contractName: '安全应急指挥系统集成合同', contractAmount: 2200000 },
    ],
  },
];

export const itLaunchApplications: ItLaunchApplication[] = [
  {
    id: 'launch-001',
    projectNo: 'NG-2025-XM-0012',
    projectName: '智慧供应链协同管理平台',
    launchType: '分项上线',
    projectType: '信息化平台建设',
    creator: '张伟',
    createTime: '2026-05-18 09:32:15',
    plannedLaunchTime: '2026-07-01',
    approvalNode: '事业部审批→数研院呈核→上线确认',
    status: '审批中',
    launchNote: '供应链平台一期功能开发完成，申请分项上线',
    estimatedStayHours: 48,
    impactScope: '采购部、物流部、仓储部',
    riskAssessment: '上线期间可能影响现有ERP接口数据传输，已制定回滚方案',
    attachments: [
      { name: '用户培训记录', uploaded: true },
      { name: '上线试运行方案', uploaded: true },
      { name: '用户操作手册', uploaded: true },
      { name: '测试用例', uploaded: true },
      { name: '供应商测试报告', uploaded: true },
      { name: '用户测试', uploaded: true },
    ],
    selectedContracts: ['c-001'],
  },
  {
    id: 'launch-002',
    projectNo: 'NG-2025-XM-0018',
    projectName: '智能制造执行系统(MES)升级',
    launchType: '整体上线',
    projectType: '信息化系统升级',
    creator: '李强',
    createTime: '2026-05-20 14:15:30',
    plannedLaunchTime: '2026-07-15',
    approvalNode: '事业部审批→数研院呈核→上线确认',
    status: '已通过',
    launchNote: 'MES系统整体升级完成，申请整体上线切换',
    estimatedStayHours: 72,
    impactScope: '炼钢厂、轧钢厂、中厚板厂',
    riskAssessment: '整体切换期间需停产配合，已协调生产计划窗口',
    attachments: [
      { name: '用户培训记录', uploaded: true },
      { name: '上线试运行方案', uploaded: true },
      { name: '用户操作手册', uploaded: true },
      { name: '测试用例', uploaded: true },
      { name: '供应商测试报告', uploaded: true },
      { name: '用户测试', uploaded: true },
    ],
    selectedContracts: ['c-004', 'c-005', 'c-006', 'c-007'],
  },
  {
    id: 'launch-003',
    projectNo: 'NG-2025-XM-0022',
    projectName: '数据治理及大数据分析平台',
    launchType: '整体上线',
    projectType: '信息化平台建设',
    creator: '王芳',
    createTime: '2026-05-22 10:08:45',
    plannedLaunchTime: '2026-07-20',
    approvalNode: '事业部审批→数研院呈核→上线确认',
    status: '新建',
    launchNote: '数据治理平台已完成部署测试，具备上线条件',
    estimatedStayHours: 36,
    impactScope: '全公司数据管理部门',
    riskAssessment: '历史数据迁移过程中可能出现短暂中断，已安排周末窗口',
    attachments: [
      { name: '用户培训记录', uploaded: false },
      { name: '上线试运行方案', uploaded: true },
      { name: '用户操作手册', uploaded: true },
      { name: '测试用例', uploaded: true },
      { name: '供应商测试报告', uploaded: true },
      { name: '用户测试', uploaded: true },
    ],
    selectedContracts: ['c-008', 'c-009'],
  },
  {
    id: 'launch-004',
    projectNo: 'NG-2025-XM-0025',
    projectName: '企业资源计划(ERP)优化',
    launchType: '分项上线',
    projectType: '信息化系统优化',
    creator: '赵明',
    createTime: '2026-05-25 16:42:10',
    plannedLaunchTime: '2026-08-01',
    approvalNode: '事业部审批→数研院呈核→上线确认',
    status: '已驳回',
    launchNote: 'ERP财务模块优化完成，申请分项上线',
    estimatedStayHours: 24,
    impactScope: '财务部',
    riskAssessment: '需确保与现有财务系统数据一致性',
    attachments: [
      { name: '用户培训记录', uploaded: true },
      { name: '上线试运行方案', uploaded: true },
      { name: '用户操作手册', uploaded: false },
      { name: '测试用例', uploaded: true },
      { name: '供应商测试报告', uploaded: true },
      { name: '用户测试', uploaded: true },
    ],
    selectedContracts: ['c-010'],
  },
  {
    id: 'launch-005',
    projectNo: 'NG-2025-XM-0030',
    projectName: '工业互联网标识解析二级节点',
    launchType: '整体上线',
    projectType: '信息化平台建设',
    creator: '陈刚',
    createTime: '2026-06-01 08:55:20',
    plannedLaunchTime: '2026-08-10',
    approvalNode: '事业部审批→数研院呈核→上线确认',
    status: '审批中',
    launchNote: '标识解析二级节点部署完毕，申请整体上线',
    estimatedStayHours: 48,
    impactScope: '全公司生产设备标识管理',
    riskAssessment: '上线后将替代现有标识系统，需做好并行过渡',
    attachments: [
      { name: '用户培训记录', uploaded: true },
      { name: '上线试运行方案', uploaded: true },
      { name: '用户操作手册', uploaded: true },
      { name: '测试用例', uploaded: true },
      { name: '供应商测试报告', uploaded: true },
      { name: '用户测试', uploaded: true },
    ],
    selectedContracts: ['c-013', 'c-014'],
  },
  {
    id: 'launch-006',
    projectNo: 'NG-2025-XM-0033',
    projectName: '安全生产信息化管理平台',
    launchType: '分项上线',
    projectType: '信息化平台建设',
    creator: '刘洋',
    createTime: '2026-06-05 11:22:38',
    plannedLaunchTime: '2026-08-15',
    approvalNode: '事业部审批→数研院呈核→上线确认',
    status: '新建',
    launchNote: '安全监控模块开发完成，申请分项上线',
    estimatedStayHours: 36,
    impactScope: '安全环保部',
    riskAssessment: '监控数据接入期间需确保报警阈值配置准确',
    attachments: [
      { name: '用户培训记录', uploaded: true },
      { name: '上线试运行方案', uploaded: true },
      { name: '用户操作手册', uploaded: true },
      { name: '测试用例', uploaded: false },
      { name: '供应商测试报告', uploaded: true },
      { name: '用户测试', uploaded: true },
    ],
    selectedContracts: ['c-015'],
  },
  {
    id: 'launch-007',
    projectNo: 'NG-2025-XM-0012',
    projectName: '智慧供应链协同管理平台',
    launchType: '分项上线',
    projectType: '信息化平台建设',
    creator: '张伟',
    createTime: '2026-06-10 15:30:00',
    plannedLaunchTime: '2026-08-20',
    approvalNode: '事业部审批→数研院呈核→上线确认',
    status: '审批中',
    launchNote: '供应链平台二期物流模块申请上线',
    estimatedStayHours: 36,
    impactScope: '物流部、运输调度中心',
    riskAssessment: '物流模块与现有TMS系统接口切换期间需短暂停机',
    attachments: [
      { name: '用户培训记录', uploaded: true },
      { name: '上线试运行方案', uploaded: true },
      { name: '用户操作手册', uploaded: true },
      { name: '测试用例', uploaded: true },
      { name: '供应商测试报告', uploaded: true },
      { name: '用户测试', uploaded: true },
    ],
    selectedContracts: ['c-002', 'c-003'],
  },
  {
    id: 'launch-008',
    projectNo: 'NG-2025-XM-0025',
    projectName: '企业资源计划(ERP)优化',
    launchType: '整体上线',
    projectType: '信息化系统优化',
    creator: '赵明',
    createTime: '2026-06-12 09:15:00',
    plannedLaunchTime: '2026-09-01',
    approvalNode: '事业部审批→数研院呈核→上线确认',
    status: '新建',
    launchNote: 'ERP全部模块优化完成，申请整体上线切换',
    estimatedStayHours: 96,
    impactScope: '全公司',
    riskAssessment: '全公司ERP系统切换需安排节假日窗口，已制定详细切换方案和应急预案',
    attachments: [
      { name: '用户培训记录', uploaded: true },
      { name: '上线试运行方案', uploaded: true },
      { name: '用户操作手册', uploaded: true },
      { name: '测试用例', uploaded: true },
      { name: '供应商测试报告', uploaded: true },
      { name: '用户测试', uploaded: true },
    ],
    selectedContracts: ['c-010', 'c-011', 'c-012'],
  },
];

export const defaultApprovalNodes: ApprovalNodeConfig[] = [
  { nodeId: 'node-1', nodeName: '事业部审批', approver: '周明辉', approverDept: '智能制造事业部', sequence: 1 },
  { nodeId: 'node-2', nodeName: '信息技术部审批', approver: '吴建国', approverDept: '信息技术部', sequence: 2 },
  { nodeId: 'node-3', nodeName: '数研院呈核', approver: '郑文斌', approverDept: '数研院', sequence: 3 },
  { nodeId: 'node-4', nodeName: '安全环保部会签', approver: '孙志强', approverDept: '安全环保部', sequence: 4 },
  { nodeId: 'node-5', nodeName: '上线确认', approver: '林晓东', approverDept: '项目管理办公室', sequence: 5 },
];

export const approvalHistories: ApprovalHistoryRecord[] = [
  // launch-001 history
  { id: 'hist-001', applicationId: 'launch-001', sequence: 1, nodeName: '事业部审批', approver: '周明辉', status: '已通过', opinion: '资料齐全，同意发起上线审批流程', time: '2026-05-19 10:30:00' },
  { id: 'hist-002', applicationId: 'launch-001', sequence: 2, nodeName: '信息技术部审批', approver: '吴建国', status: '审批中', opinion: '正在审核上线方案及测试报告', time: '2026-05-20 14:00:00' },
  // launch-002 history
  { id: 'hist-003', applicationId: 'launch-002', sequence: 1, nodeName: '事业部审批', approver: '周明辉', status: '已通过', opinion: 'MES升级必要性明确，同意审批', time: '2026-05-21 09:15:00' },
  { id: 'hist-004', applicationId: 'launch-002', sequence: 2, nodeName: '信息技术部审批', approver: '吴建国', status: '已通过', opinion: '技术方案可行，测试报告完整', time: '2026-05-23 11:00:00' },
  { id: 'hist-005', applicationId: 'launch-002', sequence: 3, nodeName: '数研院呈核', approver: '郑文斌', status: '已通过', opinion: '系统架构评审通过，具备上线条件', time: '2026-05-25 16:30:00' },
  { id: 'hist-006', applicationId: 'launch-002', sequence: 4, nodeName: '安全环保部会签', approver: '孙志强', status: '已通过', opinion: '安全措施到位，同意上线', time: '2026-05-27 08:45:00' },
  { id: 'hist-007', applicationId: 'launch-002', sequence: 5, nodeName: '上线确认', approver: '林晓东', status: '已通过', opinion: '全部审批通过，准予上线', time: '2026-05-28 14:20:00' },
  // launch-004 history (rejected)
  { id: 'hist-008', applicationId: 'launch-004', sequence: 1, nodeName: '事业部审批', approver: '周明辉', status: '已通过', opinion: 'ERP财务模块优化合理，同意发起', time: '2026-05-26 10:00:00' },
  { id: 'hist-009', applicationId: 'launch-004', sequence: 2, nodeName: '信息技术部审批', approver: '吴建国', status: '已驳回', opinion: '用户操作手册缺失，测试用例不完整，请补充后重新提交', time: '2026-05-28 09:30:00' },
  // launch-005 history
  { id: 'hist-010', applicationId: 'launch-005', sequence: 1, nodeName: '事业部审批', approver: '周明辉', status: '已通过', opinion: '标识解析节点建设符合规划要求', time: '2026-06-02 11:00:00' },
  { id: 'hist-011', applicationId: 'launch-005', sequence: 2, nodeName: '信息技术部审批', approver: '吴建国', status: '审批中', opinion: '正在评估与现有系统兼容性', time: '2026-06-03 15:30:00' },
  // launch-007 history
  { id: 'hist-012', applicationId: 'launch-007', sequence: 1, nodeName: '事业部审批', approver: '周明辉', status: '已通过', opinion: '供应链平台二期按计划推进，同意上线', time: '2026-06-11 08:30:00' },
  { id: 'hist-013', applicationId: 'launch-007', sequence: 2, nodeName: '信息技术部审批', approver: '吴建国', status: '已通过', opinion: '物流模块接口测试通过', time: '2026-06-13 10:00:00' },
  { id: 'hist-014', applicationId: 'launch-007', sequence: 3, nodeName: '数研院呈核', approver: '郑文斌', status: '审批中', opinion: '架构评审进行中', time: '2026-06-14 14:00:00' },
];

export const itLaunchStatusLabels: Record<string, string> = {
  '新建': 'bg-slate-100 text-slate-600 border-slate-200',
  '审批中': 'bg-amber-50 text-amber-700 border-amber-200',
  '已通过': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '已驳回': 'bg-red-50 text-red-700 border-red-200',
};

export const itLaunchApprovalStatusLabels: Record<string, string> = {
  '已通过': 'bg-emerald-50 text-emerald-700',
  '已驳回': 'bg-red-50 text-red-700',
  '审批中': 'bg-amber-50 text-amber-700',
  '待审批': 'bg-slate-100 text-slate-500',
};