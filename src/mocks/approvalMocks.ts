export interface ApprovalTemplate {
  id: string;
  name: string;
  businessType: string;
  isDefault: boolean;
  isGeneral: boolean;
  nodeCount: number;
  description: string;
  creator: string;
  nodes: ApprovalNodeConfig[];
  displayFields: DisplayFieldGroup[];
}

export interface ApprovalNodeConfig {
  nodeId: string;
  nodeName: string;
  nodeType: 'approval' | 'countersign' | 'or_sign' | 'cc' | 'ratio_pass';
  approvers: string[];
  passRatio?: number;
  isParallel?: boolean;
  parallelGroup?: string;
}

export interface DisplayFieldGroup {
  groupName: string;
  fields: DisplayField[];
}

export interface DisplayField {
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  readonly: boolean;
}

export interface ApprovalRecord {
  id: string;
  planId: string;
  appNo: string;
  businessType: string;
  applicant: string;
  applicantDept: string;
  applyTime: string;
  currentNode: string;
  currentNodeType: 'approval' | 'countersign' | 'or_sign' | 'cc' | 'ratio_pass';
  status: 'approving' | 'approved' | 'rejected' | 'withdrawn';
  nodes: ApprovalRecordNode[];
  planData: Record<string, unknown>;
}

export interface ApprovalRecordNode {
  nodeId: string;
  nodeName: string;
  nodeType: 'approval' | 'countersign' | 'or_sign' | 'cc' | 'ratio_pass';
  approvers: { name: string; department: string; result?: 'approved' | 'rejected'; opinion?: string; time?: string }[];
  status: 'completed' | 'current' | 'pending' | 'transferred' | 'added';
  result?: string;
  opinion?: string;
  time?: string;
  transferTo?: string;
  addedBy?: string;
  addPosition?: 'before' | 'after';
}

export const availableApprovers = [
  { name: '李副总', department: '公司领导' },
  { name: '王部长', department: '设备部' },
  { name: '刘副总', department: '公司领导' },
  { name: '张建国', department: '炼铁事业部' },
  { name: '王志强', department: '炼钢事业部' },
  { name: '陈思远', department: '热轧事业部' },
  { name: '赵明辉', department: '工程管理部' },
  { name: '周鑫', department: '冷轧事业部' },
  { name: '孙宇', department: '科技质量部' },
  { name: '吴刚', department: '特钢事业部' },
  { name: '郑浩', department: '安全环保部' },
  { name: '朱科长', department: '信息化部' },
  { name: '谢海涛', department: '财务部' },
  { name: '孙磊', department: '战略运营部' },
  { name: '钱建国', department: '建材事业部' },
  { name: '刘建华', department: '人力资源部' },
  { name: '李建国', department: '采购部' },
  { name: '赵洪', department: '能环部' },
  { name: '张伟', department: '设备部' },
  { name: '陈磊', department: '数研院' },
];


export const optionalFields: DisplayFieldGroup[] = [
  {
    groupName: '项目基本信息',
    fields: [
      { fieldName: 'planName', fieldLabel: '年度计划名称', fieldType: '文本', readonly: true },
      { fieldName: 'businessDivision', fieldLabel: '项目提报单位', fieldType: '文本', readonly: true },
      { fieldName: 'submitDept', fieldLabel: '提报部门', fieldType: '文本', readonly: true },
      { fieldName: 'implementDept', fieldLabel: '实施主管部门', fieldType: '文本', readonly: true },
      { fieldName: 'projectCategory', fieldLabel: '项目类别', fieldType: '文本', readonly: true },
      { fieldName: 'projectManager', fieldLabel: '项目负责人', fieldType: '文本', readonly: false },
      { fieldName: 'applicant', fieldLabel: '申报人', fieldType: '文本', readonly: true },
    ],
  },
  {
    groupName: '金额信息',
    fields: [
      { fieldName: 'budgetAmount', fieldLabel: '投资总估算(万元)', fieldType: '数字', readonly: false },
      { fieldName: 'benefit', fieldLabel: '效益(万元)', fieldType: '数字', readonly: false },
    ],
  },
  {
    groupName: '日期信息',
    fields: [
      { fieldName: 'startDate', fieldLabel: '计划开工时间', fieldType: '日期', readonly: false },
      { fieldName: 'endDate', fieldLabel: '完工时间', fieldType: '日期', readonly: false },
      { fieldName: 'planYear', fieldLabel: '计划年度', fieldType: '文本', readonly: true },
    ],
  },
  {
    groupName: '附件信息',
    fields: [
      { fieldName: 'attachment1', fieldLabel: '项目建议书', fieldType: '附件', readonly: true },
      { fieldName: 'attachment2', fieldLabel: '可行性研究报告', fieldType: '附件', readonly: true },
    ],
  },
];

// initial templates (will be stored in localStorage for persistence)
export const initialApprovalTemplates: ApprovalTemplate[] = [
  {
    id: 'tpl_default_plan',
    name: '通用模板',
    businessType: '计划申报',
    isDefault: true,
    isGeneral: true,
    nodeCount: 4,
    description: '计划申报业务默认审批流程：事业部负责人→设备部→分管领导→战略运营部',
    creator: '系统管理员',
    nodes: [
      { nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval', approvers: ['事业部负责人'], isParallel: false },
      { nodeId: 'n2', nodeName: '设备部门会签', nodeType: 'countersign', approvers: ['王部长', '张伟'], isParallel: false },
      { nodeId: 'n3', nodeName: '分管领导审批', nodeType: 'approval', approvers: ['分管领导'], isParallel: false },
      { nodeId: 'n4', nodeName: '战略运营部审核', nodeType: 'approval', approvers: ['孙磊'], isParallel: false },
    ],
    displayFields: [
      {
        groupName: '项目基本信息',
        fields: [
          { fieldName: 'planName', fieldLabel: '年度计划名称', fieldType: '文本', readonly: true },
          { fieldName: 'businessDivision', fieldLabel: '项目提报单位', fieldType: '文本', readonly: true },
          { fieldName: 'projectCategory', fieldLabel: '项目类别', fieldType: '文本', readonly: true },
        ],
      },
      {
        groupName: '金额信息',
        fields: [
          { fieldName: 'budgetAmount', fieldLabel: '投资总估算(万元)', fieldType: '数字', readonly: false },
          { fieldName: 'benefit', fieldLabel: '效益(万元)', fieldType: '数字', readonly: false },
        ],
      },
      {
        groupName: '日期信息',
        fields: [
          { fieldName: 'startDate', fieldLabel: '计划开工时间', fieldType: '日期', readonly: false },
          { fieldName: 'endDate', fieldLabel: '完工时间', fieldType: '日期', readonly: false },
        ],
      },
    ],
  },
  {
    id: 'tpl_speed_plan',
    name: '快速审批通道模板',
    businessType: '计划申报',
    isDefault: false,
    isGeneral: false,
    nodeCount: 2,
    description: '小额项目快速审批通道：事业部负责人→分管领导，适用于预算100万以下项目',
    creator: '张建国',
    nodes: [
      { nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval', approvers: ['事业部负责人'], isParallel: false },
      { nodeId: 'n2', nodeName: '分管领导审批', nodeType: 'approval', approvers: ['分管领导'], isParallel: false },
    ],
    displayFields: [
      {
        groupName: '项目基本信息',
        fields: [
          { fieldName: 'planName', fieldLabel: '年度计划名称', fieldType: '文本', readonly: true },
          { fieldName: 'businessDivision', fieldLabel: '项目提报单位', fieldType: '文本', readonly: true },
        ],
      },
      {
        groupName: '金额信息',
        fields: [
          { fieldName: 'budgetAmount', fieldLabel: '投资总估算(万元)', fieldType: '数字', readonly: false },
        ],
      },
    ],
  },
  {
    id: 'tpl_multidept_plan',
    name: '多部门联合会签模板',
    businessType: '计划申报',
    isDefault: false,
    isGeneral: false,
    nodeCount: 5,
    description: '大型项目多部门联合会签流程：事业部→设备部+财务部+安全环保部(并行会签)→分管领导→战略运营部',
    creator: '王部长',
    nodes: [
      { nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval', approvers: ['事业部负责人'], isParallel: false },
      { nodeId: 'n2', nodeName: '设备部审批', nodeType: 'approval', approvers: ['王部长'], isParallel: true, parallelGroup: 'g1' },
      { nodeId: 'n3', nodeName: '财务部审批', nodeType: 'approval', approvers: ['谢海涛'], isParallel: true, parallelGroup: 'g1' },
      { nodeId: 'n4', nodeName: '安全环保部审批', nodeType: 'approval', approvers: ['郑浩'], isParallel: true, parallelGroup: 'g1' },
      { nodeId: 'n5', nodeName: '分管领导审批', nodeType: 'approval', approvers: ['分管领导'], isParallel: false },
    ],
    displayFields: [
      {
        groupName: '项目基本信息',
        fields: [
          { fieldName: 'planName', fieldLabel: '年度计划名称', fieldType: '文本', readonly: true },
          { fieldName: 'businessDivision', fieldLabel: '项目提报单位', fieldType: '文本', readonly: true },
          { fieldName: 'projectCategory', fieldLabel: '项目类别', fieldType: '文本', readonly: true },
          { fieldName: 'projectManager', fieldLabel: '项目负责人', fieldType: '文本', readonly: true },
        ],
      },
      {
        groupName: '金额信息',
        fields: [
          { fieldName: 'budgetAmount', fieldLabel: '投资总估算(万元)', fieldType: '数字', readonly: false },
          { fieldName: 'benefit', fieldLabel: '效益(万元)', fieldType: '数字', readonly: false },
        ],
      },
    ],
  },
  {
    id: 'tpl_env_plan',
    name: '环保类项目专项审批模板',
    businessType: '计划申报',
    isDefault: false,
    isGeneral: false,
    nodeCount: 4,
    description: '环保类项目专项流程：事业部→安全环保部→分管领导→总师室，包含环评附件审核',
    creator: '郑浩',
    nodes: [
      { nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval', approvers: ['事业部负责人'], isParallel: false },
      { nodeId: 'n2', nodeName: '安全环保部审批', nodeType: 'approval', approvers: ['郑浩'], isParallel: false },
      { nodeId: 'n3', nodeName: '分管领导审批', nodeType: 'approval', approvers: ['分管领导'], isParallel: false },
      { nodeId: 'n4', nodeName: '总师室审批', nodeType: 'or_sign', approvers: ['刘副总', '李副总'], isParallel: false },
    ],
    displayFields: [
      {
        groupName: '项目基本信息',
        fields: [
          { fieldName: 'planName', fieldLabel: '年度计划名称', fieldType: '文本', readonly: true },
          { fieldName: 'businessDivision', fieldLabel: '项目提报单位', fieldType: '文本', readonly: true },
          { fieldName: 'projectCategory', fieldLabel: '项目类别', fieldType: '文本', readonly: true },
        ],
      },
      {
        groupName: '附件信息',
        fields: [
          { fieldName: 'attachment1', fieldLabel: '项目建议书', fieldType: '附件', readonly: true },
          { fieldName: 'attachment2', fieldLabel: '可行性研究报告', fieldType: '附件', readonly: true },
        ],
      },
    ],
  },
];

// load/save templates via localStorage so user edits persist
function getStoredTemplates(): ApprovalTemplate[] {
  try {
    const s = localStorage.getItem('ng_approval_templates');
    return s ? JSON.parse(s) : initialApprovalTemplates;
  } catch {
    return initialApprovalTemplates;
  }
}

export let approvalTemplates: ApprovalTemplate[] = getStoredTemplates();

export function saveApprovalTemplates(templates: ApprovalTemplate[]) {
  approvalTemplates = templates;
  try { localStorage.setItem('ng_approval_templates', JSON.stringify(templates)); } catch { /* noop */ }
}

export function getGeneralTemplates(): ApprovalTemplate[] {
  return getStoredTemplates().filter((t) => t.isGeneral);
}

export function getNonGeneralTemplates(): ApprovalTemplate[] {
  return getStoredTemplates().filter((t) => !t.isGeneral);
}

export const approvalRecords: ApprovalRecord[] = [
  {
    id: 'appr_1',
    planId: '1',
    appNo: 'APP202601001',
    businessType: '计划申报',
    applicant: '张伟',
    applicantDept: '炼铁事业部',
    applyTime: '2026-01-10 14:30:00',
    currentNode: '事业部负责人审批',
    currentNodeType: 'approval',
    status: 'approving',
    planData: {},
    nodes: [
      {
        nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval',
        approvers: [{ name: '张建国', department: '炼铁事业部' }],
        status: 'current',
      },
      {
        nodeId: 'n2', nodeName: '设备部门会签', nodeType: 'countersign',
        approvers: [{ name: '王部长', department: '设备部' }, { name: '张伟', department: '设备部' }],
        status: 'pending',
      },
      {
        nodeId: 'n3', nodeName: '分管领导审批', nodeType: 'approval',
        approvers: [{ name: '李副总', department: '公司领导' }],
        status: 'pending',
      },
      {
        nodeId: 'n4', nodeName: '战略运营部审核', nodeType: 'approval',
        approvers: [{ name: '孙磊', department: '战略运营部' }],
        status: 'pending',
      },
    ],
  },
  {
    id: 'appr_2',
    planId: '2',
    appNo: 'APP202601002',
    businessType: '计划申报',
    applicant: '李明',
    applicantDept: '原料事业部',
    applyTime: '2026-01-15 09:15:00',
    currentNode: '事业部负责人审批',
    currentNodeType: 'approval',
    status: 'approving',
    planData: {},
    nodes: [
      {
        nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval',
        approvers: [{ name: '赵明辉', department: '原料事业部' }],
        status: 'current',
      },
      {
        nodeId: 'n2', nodeName: '分管领导审批', nodeType: 'approval',
        approvers: [{ name: '刘副总', department: '公司领导' }],
        status: 'pending',
      },
    ],
  },
  {
    id: 'appr_3',
    planId: '5',
    appNo: 'APP202601003',
    businessType: '计划申报',
    applicant: '刘洋',
    applicantDept: '动力事业部',
    applyTime: '2025-11-25 10:00:00',
    currentNode: '',
    currentNodeType: 'approval',
    status: 'approved',
    planData: {},
    nodes: [
      {
        nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval',
        approvers: [{ name: '吴刚', department: '动力事业部', result: 'approved', opinion: '同意，请尽快实施', time: '2025-11-28 16:00:00' }],
        status: 'completed', result: '已通过', opinion: '同意，请尽快实施', time: '2025-11-28 16:00:00',
      },
      {
        nodeId: 'n2', nodeName: '设备部门会签', nodeType: 'countersign',
        approvers: [
          { name: '王部长', department: '设备部', result: 'approved', opinion: '方案可行', time: '2025-12-02 10:00:00' },
          { name: '张伟', department: '设备部', result: 'approved', opinion: '同意', time: '2025-12-03 14:00:00' },
        ],
        status: 'completed', result: '已通过', opinion: '', time: '2025-12-03 14:00:00',
      },
      {
        nodeId: 'n3', nodeName: '分管领导审批', nodeType: 'approval',
        approvers: [{ name: '李副总', department: '公司领导', result: 'approved', opinion: '批准', time: '2025-12-05 09:30:00' }],
        status: 'completed', result: '已通过', opinion: '批准', time: '2025-12-05 09:30:00',
      },
      {
        nodeId: 'n4', nodeName: '战略运营部审核', nodeType: 'approval',
        approvers: [{ name: '孙磊', department: '战略运营部', result: 'approved', opinion: '符合规划要求', time: '2025-12-10 11:00:00' }],
        status: 'completed', result: '已通过', opinion: '符合规划要求', time: '2025-12-10 11:00:00',
      },
    ],
  },
  {
    id: 'appr_4',
    planId: '6',
    appNo: 'APP202601004',
    businessType: '计划申报',
    applicant: '陈刚',
    applicantDept: '炼钢事业部',
    applyTime: '2026-01-08 11:20:00',
    currentNode: '',
    currentNodeType: 'approval',
    status: 'rejected',
    planData: {},
    nodes: [
      {
        nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval',
        approvers: [{ name: '王志强', department: '炼钢事业部', result: 'approved', opinion: '同意上报', time: '2026-01-09 08:30:00' }],
        status: 'completed', result: '已通过', opinion: '同意上报', time: '2026-01-09 08:30:00',
      },
      {
        nodeId: 'n2', nodeName: '安全环保部审批', nodeType: 'approval',
        approvers: [{ name: '郑浩', department: '安全环保部', result: 'rejected', opinion: '请补充环境影响评价报告后重新提交', time: '2026-01-12 15:45:00' }],
        status: 'completed', result: '已驳回', opinion: '请补充环境影响评价报告后重新提交', time: '2026-01-12 15:45:00',
      },
      {
        nodeId: 'n3', nodeName: '分管领导审批', nodeType: 'approval',
        approvers: [{ name: '刘副总', department: '公司领导' }],
        status: 'pending',
      },
    ],
  },
  {
    id: 'appr_5',
    planId: '4',
    appNo: 'APP202601005',
    businessType: '计划申报',
    applicant: '赵芳',
    applicantDept: '原料事业部',
    applyTime: '2026-01-08 13:00:00',
    currentNode: '分管领导审批',
    currentNodeType: 'approval',
    status: 'approving',
    planData: {},
    nodes: [
      {
        nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval',
        approvers: [{ name: '赵明辉', department: '原料事业部', result: 'approved', opinion: '智能化改造方向正确，同意', time: '2026-01-10 14:00:00' }],
        status: 'completed', result: '已通过', opinion: '智能化改造方向正确，同意', time: '2026-01-10 14:00:00',
      },
      {
        nodeId: 'n2', nodeName: '设备部审批', nodeType: 'approval',
        approvers: [{ name: '王部长', department: '设备部', result: 'approved', opinion: '设备选型合理', time: '2026-01-12 09:00:00' }],
        status: 'completed', result: '已通过', opinion: '设备选型合理', time: '2026-01-12 09:00:00',
      },
      {
        nodeId: 'n3', nodeName: '财务部审批', nodeType: 'approval',
        approvers: [{ name: '谢海涛', department: '财务部', result: 'approved', opinion: '预算符合规定', time: '2026-01-13 08:45:00' }],
        status: 'completed', result: '已通过', opinion: '预算符合规定', time: '2026-01-13 08:45:00',
      },
      {
        nodeId: 'n4', nodeName: '安全环保部审批', nodeType: 'approval',
        approvers: [{ name: '郑浩', department: '安全环保部', result: 'approved', opinion: '安全措施符合要求', time: '2026-01-14 10:30:00' }],
        status: 'completed', result: '已通过', opinion: '安全措施符合要求', time: '2026-01-14 10:30:00',
      },
      {
        nodeId: 'n5', nodeName: '分管领导审批', nodeType: 'approval',
        approvers: [{ name: '刘副总', department: '公司领导' }],
        status: 'current',
      },
    ],
  },
  {
    id: 'appr_6',
    planId: '7',
    appNo: 'APP202601006',
    businessType: '计划申报',
    applicant: '孙丽',
    applicantDept: '动力事业部',
    applyTime: '2026-01-14 10:30:00',
    currentNode: '事业部负责人审批',
    currentNodeType: 'approval',
    status: 'approving',
    planData: {},
    nodes: [
      {
        nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval',
        approvers: [{ name: '吴刚', department: '动力事业部' }],
        status: 'current',
      },
      {
        nodeId: 'n2', nodeName: '分管领导审批', nodeType: 'approval',
        approvers: [{ name: '李副总', department: '公司领导' }],
        status: 'pending',
      },
    ],
  },
  {
    id: 'appr_7',
    planId: '9',
    appNo: 'APP202501007',
    businessType: '计划申报',
    applicant: '吴晓燕',
    applicantDept: '冷轧事业部',
    applyTime: '2025-03-12 08:00:00',
    currentNode: '',
    currentNodeType: 'approval',
    status: 'approved',
    planData: {},
    nodes: [
      {
        nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval',
        approvers: [{ name: '周鑫', department: '冷轧事业部', result: 'approved', opinion: '同意申报', time: '2025-03-14 16:00:00' }],
        status: 'completed', result: '已通过', opinion: '同意申报', time: '2025-03-14 16:00:00',
      },
      {
        nodeId: 'n2', nodeName: '设备部门会签', nodeType: 'countersign',
        approvers: [
          { name: '王部长', department: '设备部', result: 'approved', opinion: '工艺方案可行', time: '2025-03-18 10:00:00' },
          { name: '张伟', department: '设备部', result: 'approved', opinion: '同意', time: '2025-03-19 14:00:00' },
        ],
        status: 'completed', result: '已通过', time: '2025-03-19 14:00:00',
      },
      {
        nodeId: 'n3', nodeName: '分管领导审批', nodeType: 'approval',
        approvers: [{ name: '刘副总', department: '公司领导', result: 'approved', opinion: '批准执行', time: '2025-03-22 11:00:00' }],
        status: 'completed', result: '已通过', opinion: '批准执行', time: '2025-03-22 11:00:00',
      },
    ],
  },
  {
    id: 'appr_8',
    planId: '10',
    appNo: 'APP202501008',
    businessType: '计划申报',
    applicant: '钱建国',
    applicantDept: '建材事业部',
    applyTime: '2025-07-16 14:00:00',
    currentNode: '',
    currentNodeType: 'approval',
    status: 'approved',
    planData: {},
    nodes: [
      {
        nodeId: 'n1', nodeName: '事业部负责人审批', nodeType: 'approval',
        approvers: [{ name: '钱建国', department: '建材事业部', result: 'approved', opinion: '安全整治刻不容缓', time: '2025-07-17 09:30:00' }],
        status: 'completed', result: '已通过', opinion: '安全整治刻不容缓', time: '2025-07-17 09:30:00',
      },
      {
        nodeId: 'n2', nodeName: '安全环保部审批', nodeType: 'approval',
        approvers: [{ name: '郑浩', department: '安全环保部', result: 'approved', opinion: '符合安全整改要求', time: '2025-07-20 10:00:00' }],
        status: 'completed', result: '已通过', opinion: '符合安全整改要求', time: '2025-07-20 10:00:00',
      },
      {
        nodeId: 'n3', nodeName: '财务部审批', nodeType: 'approval',
        approvers: [{ name: '谢海涛', department: '财务部', result: 'approved', opinion: '费用合理', time: '2025-07-22 08:30:00' }],
        status: 'completed', result: '已通过', opinion: '费用合理', time: '2025-07-22 08:30:00',
      },
    ],
  },
];

function getStoredApprovalRecords(): ApprovalRecord[] {
  try {
    const s = localStorage.getItem('ng_approval_records');
    return s ? JSON.parse(s) : approvalRecords;
  } catch {
    return approvalRecords;
  }
}

export function getApprovalRecords(): ApprovalRecord[] {
  return getStoredApprovalRecords();
}

export function setStoredApprovalRecords(records: ApprovalRecord[]) {
  try { localStorage.setItem('ng_approval_records', JSON.stringify(records)); } catch { /* noop */ }
}

export function getApprovalByPlanId(planId: string): ApprovalRecord | undefined {
  return getStoredApprovalRecords().find((r) => r.planId === planId);
}

/**
 * 年度计划申报撤回条件：
 * 已提交（部门内审/待会审/会审中），且尚未有任何审批节点完成。
 * 一旦有节点 completed，不可撤回。
 */
export function canWithdrawDeclaration(
  plan: { reviewStatus: string },
  record?: ApprovalRecord | null
): boolean {
  const submitted =
    plan.reviewStatus === 'dept_review' ||
    plan.reviewStatus === 'pending_joint' ||
    plan.reviewStatus === 'joint_reviewing';
  if (!submitted) return false;
  if (!record) {
    // 已提交但未生成审批单：允许撤回（等同尚未审批）
    return plan.reviewStatus === 'dept_review';
  }
  if (record.status !== 'approving') return false;
  return !record.nodes.some((n) => n.status === 'completed');
}

export function addApprovalRecord(record: ApprovalRecord) {
  const existing = getStoredApprovalRecords();
  const filtered = existing.filter((r) => r.planId !== record.planId);
  setStoredApprovalRecords([...filtered, record]);
  return record;
}

export function updateApprovalRecord(record: ApprovalRecord) {
  const existing = getStoredApprovalRecords();
  const updated = existing.map((r) => (r.id === record.id ? record : r));
  setStoredApprovalRecords(updated);
}