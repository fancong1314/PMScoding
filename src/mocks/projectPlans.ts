export interface PaymentPlanRow {
  id: string;
  paymentType: string;
  paymentMonth: string; // YYYY-MM
  amount: number;
  ratio?: number; // 占投资总估算比例(%)，可选
  remark: string;
}

export interface ResearchPersonRow {
  id: string;
  seq: number;
  empNo: string;
  name: string;
  title: string;
  unit: string;
  position: string;
  partyDuty: string;
  remark: string;
}

export const defaultResearchPersons: ResearchPersonRow[] = [
  { id: 'rp1', seq: 1, empNo: 'EMP001', name: '张建国', title: '高级工程师', unit: '炼钢事业部', position: '项目经理', partyDuty: '负责与甲方沟通项目整体推进和决策协调', remark: '负责整体方案设计' },
  { id: 'rp2', seq: 2, empNo: 'EMP002', name: '李明华', title: '工程师', unit: '设备管理部', position: '技术负责人', partyDuty: '对接甲方设备管理部门，协调设备选型需求', remark: '负责设备选型' },
  { id: 'rp3', seq: 3, empNo: 'EMP003', name: '王志远', title: '助理工程师', unit: '科技质量部', position: '成员', partyDuty: '配合甲方质量管控工作，参与质量验收', remark: '负责质量管控' },
  { id: 'rp4', seq: 4, empNo: 'EMP004', name: '陈建华', title: '高级工程师', unit: '安全环保部', position: '安全专员', partyDuty: '对接甲方安全管理部门，落实安全三同时要求', remark: '负责安全管理' },
  { id: 'rp5', seq: 5, empNo: 'EMP005', name: '赵敏', title: '工程师', unit: '工程管理部', position: '成员', partyDuty: '参与可研报告编制与资料整理', remark: '研究报告编写' },
];

export interface RiskAssessRow {
  id: string;
  seq: number;
  risk: string;
  riskLevel: string;
  riskStatus: string;
  riskCategory: string;
  impactLevel: string;
  severity: string;
  riskType: string;
  riskDesc: string;
  cause: string;
  currentMeasure: string;
  strategy: string;
  suggestMeasure: string;
  execDept: string;
}

export const defaultRiskAssessRows: RiskAssessRow[] = [
  {
    id: 'risk1', seq: 1, risk: '设备采购延期', riskLevel: '高', riskStatus: '处理中', riskCategory: '进度风险',
    impactLevel: '重大', severity: '高', riskType: '外部风险',
    riskDesc: '主要设备供货周期长，可能导致项目延期',
    cause: '供应商产能不足，原材料短缺',
    currentMeasure: '提前签订采购合同，备选供应商', strategy: '减轻',
    suggestMeasure: '增加备选供应商，建立应急采购机制', execDept: '采购部',
  },
  {
    id: 'risk2', seq: 2, risk: '施工安全事故', riskLevel: '中', riskStatus: '已识别', riskCategory: '安全风险',
    impactLevel: '严重', severity: '中', riskType: '内部风险',
    riskDesc: '高空作业、动火作业存在安全隐患',
    cause: '施工人员安全意识不足',
    currentMeasure: '安全培训、安全检查', strategy: '减轻',
    suggestMeasure: '加强安全监督，配备专职安全员', execDept: '安全环保部',
  },
];

/** 营缮内容明细行 */
export interface OverhaulContentRow {
  id: string;
  seq: number;
  category: string;
  partCode: string;
  partName: string;
  content: string;
}

export const overhaulContentCategories = ['主体设备', '辅助设备', '电气仪表', '土建结构', '其他'];

export const defaultOverhaulContentRows: OverhaulContentRow[] = [
  { id: 'oc1', seq: 1, category: '主体设备', partCode: 'EQ-GT-HF-001', partName: '1#加热炉', content: '炉体耐材更换、燃烧系统检修' },
  { id: 'oc2', seq: 2, category: '辅助设备', partCode: 'EQ-GT-FAN-012', partName: '引风机A', content: '叶轮动平衡校验、轴承更换' },
];

/** 零固内容明细行 */
export interface MinorContentRow {
  id: string;
  seq: number;
  name: string;
  specModel: string;
  unitPrice: number;
  qty: number;
  measureUnit: string;
  otherFee: number;
  remark: string;
}

export function calcMinorContentSubtotal(row: Pick<MinorContentRow, 'unitPrice' | 'qty' | 'otherFee'>): number {
  return Math.round(((Number(row.unitPrice) || 0) * (Number(row.qty) || 0) + (Number(row.otherFee) || 0)) * 100) / 100;
}

export function calcMinorContentTotal(rows: MinorContentRow[]): number {
  return Math.round(rows.reduce((s, r) => s + calcMinorContentSubtotal(r), 0) * 100) / 100;
}

export const defaultMinorContentRows: MinorContentRow[] = [
  {
    id: 'mc1', seq: 1, name: '智能检测仪', specModel: 'JD-AI-300',
    unitPrice: 100, qty: 33, measureUnit: '台', otherFee: 200, remark: '含安装调试',
  },
];

/** 营缮表单 · 事业部→单位级联选项 */
export const overhaulDivisionUnitMap: Record<string, string[]> = {
  '炼铁厂': ['高炉分厂', '烧结厂', '球团分厂'],
  '炼钢厂': ['第一炼钢厂', '第二炼钢厂', '连铸分厂'],
  '热轧厂': ['热轧一厂', '热轧二厂', '加热炉车间'],
  '冷轧厂': ['冷轧一厂', '酸轧车间', '镀锌车间'],
  '原料厂': ['原料场', '码头装卸车间'],
  '动力厂': ['发电分厂', '制氧分厂', '供水车间'],
  '建材厂': ['建材一厂', '建材二厂'],
  '物流厂': ['运输一队', '仓储中心'],
};

/** 由计划开工/完工日期计算项目工期（月，含首尾月） */
export function calcProjectDurationMonths(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0;
  const toYmd = (v: string) => (v.length === 7 ? `${v}-01` : v);
  const s = new Date(toYmd(startDate));
  const e = new Date(toYmd(endDate));
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e < s) return 0;
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1;
}

export const initiationImplementUnits = [
  '炼钢事业部', '炼铁事业部', '热轧事业部', '冷轧事业部', '原料事业部',
  '动力事业部', '科技质量部', '安全环保部', '设备管理部', '工程管理部',
];

export const initiationProfessionalUnits = [
  '机械设备部', '电气自动化部', '土建工程部', '工艺技术部', '安全环保部', '信息技术部', '能源管理部',
];

export interface ProjectPlan {
  id: string;
  planYear: string;
  /** 项目提报单位（末级组织，如烧结厂） */
  businessDivision: string;
  /** 提报部门（由提报单位自动带出上级，如炼铁厂） */
  submitDept?: string;
  /** 实施主管部门（手动选择组织） */
  implementDept?: string;
  /** 业主单位（营缮等表单可选） */
  ownerUnit?: string;
  /** 申报费用（万元）·营缮/零固立项 */
  declareFee?: number;
  /** 论证申请单号 · 零固立项 */
  argumentApplyNo?: string;
  /** 是否报废更新 · 零固立项 */
  isScrapRenew?: string;
  /** 营缮内容明细 */
  overhaulContentRows?: OverhaulContentRow[];
  /** 零固内容明细 */
  minorContentRows?: MinorContentRow[];
  /** 项目大类：新建 / 技改 / 营缮 / 零固 */
  projectMajorType: ProjectMajorType;
  projectCategory: string;
  planName: string;
  budgetAmount: number;
  benefit: number;
  year1Payment: number;
  year2Payment: number;
  year3Payment: number;
  /** 付款计划明细 */
  paymentPlans?: PaymentPlanRow[];
  projectManager: string;
  projectManagerPhone: string;
  currentReviewer: string;
  latestStage: string;
  reviewStatus: 'draft' | 'dept_review' | 'pending_joint' | 'joint_reviewing' | 'rejected' | 'returned' | 'transferred';
  applicant: string;
  startDate: string;
  endDate: string;
  supplementNote: string;
  // detail info（新建/技改 · 立项申请）
  currentSituation: string;
  necessity: string;
  innovation: string;
  processDesc: string;
  overallIdea: string;
  modificationContent?: string;
  modificationPurpose?: string;
  effectDescription?: string;
  /** 项目总体结论（原项目概要总体描述） */
  projectSummary?: string;
  /** 设备装备描述（新建/技改详细信息） */
  equipmentDesc?: string;
  /** 项目可行性 */
  projectFeasibility?: string;
  /** 主要设备/设施 */
  deviceFacility?: string;
  /** 公辅配套 */
  auxWater?: string;
  auxElec?: string;
  auxGas?: string;
  auxOxygen?: string;
  auxOther?: string;
  /** 项目目标 */
  techTarget?: string;
  benefitTarget?: string;
  otherTarget?: string;
  /** 能源提升与评估 */
  energyAssess?: string;
  /** 费用估算/需求分析 */
  costAnalysis?: string;
  /** 项目研究报告人员 */
  researchPersons?: ResearchPersonRow[];
  /** 风险与机遇评估 */
  riskAssessRows?: RiskAssessRow[];
  // extra basic info / 年度计划投资估算分项
  /** 设计费（万元） */
  designFee?: number;
  /** 建安费（万元） */
  jianAnFee: number;
  /** @deprecated 历史「安装工程费用」，迁移至 designFee */
  installFee?: number;
  /** 设备费（万元） */
  equipmentFee: number;
  /** 其他（万元） */
  otherFee: number;
  designFeeRemark?: string;
  jianAnFeeRemark?: string;
  /** @deprecated 随 installFee 迁移至 designFeeRemark */
  installFeeRemark?: string;
  equipmentFeeRemark?: string;
  otherFeeRemark?: string;
  /** 是否涉及岗位增减：无 / 增加 / 减少 */
  hasJobChange: string;
  jobChangeCount: number;
  /** 实施主管单位 */
  implementUnit?: string;
  /** 专业主管单位 */
  professionalUnit?: string;
  /** 项目工期（月，由开工/完工日期自动计算） */
  projectDuration?: number;
  /** 是否计划内项目（立项申请·新建/技改） */
  isInPlanProject?: '是' | '否';
  /** 关联年度计划号（计划内项目时必填） */
  annualPlanNo?: string;
  /** 关联年度计划 ID */
  annualPlanId?: string;
  // 营缮专属字段
  isCapitalOverhaul?: string;
  fixedAssetCode?: string;
  equipmentCode?: string;
  equipmentName?: string;
  repairArea?: number;
  overhaulCycleYears?: number;
  lastOverhaulDate?: string;
  isStandardOverhaul?: string;
  equipmentCommissionDate?: string;
  lastOverhaulContent?: string;
  overhaulReason?: string;
  overhaulPlanEffect?: string;
  // 零固专属字段
  specModel?: string;
  measureUnit?: string;
  /** 需求数量（原更新数量） */
  updateQty?: number;
  /** 设备库存数量（选择设备后自动带出） */
  equipmentStockQty?: number;
  /** 申请采购数量 */
  purchaseApplyQty?: number;
  /** @deprecated 零固表单已删除「在用数量」 */
  inUseQty?: number;
  unitPrice?: number;
  isNewMinor?: string;
  updateReason?: string;
  /** 计划号（已转计划后生成） */
  planNo?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectMajorType = '新建' | '技改' | '营缮' | '零固';

/** 由历史三年付款字段生成付款计划演示行（无 paymentPlans 时使用） */
export function derivePaymentPlans(plan: Pick<ProjectPlan, 'id' | 'year1Payment' | 'year2Payment' | 'year3Payment' | 'budgetAmount' | 'planYear'>): PaymentPlanRow[] {
  const year = Number(plan.planYear) || new Date().getFullYear() + 1;
  const budget = Number(plan.budgetAmount) || 0;
  const defs: { type: string; month: string; amount: number }[] = [
    { type: '第一年付款', month: `${year}-06`, amount: plan.year1Payment || 0 },
    { type: '第二年付款', month: `${year + 1}-06`, amount: plan.year2Payment || 0 },
    { type: '第三年付款', month: `${year + 2}-06`, amount: plan.year3Payment || 0 },
  ];
  return defs
    .filter((d) => d.amount > 0)
    .map((d, i) => ({
      id: `${plan.id}_pp_${i + 1}`,
      paymentType: d.type,
      paymentMonth: d.month,
      amount: d.amount,
      ratio: budget > 0 ? Math.round((d.amount / budget) * 10000) / 100 : undefined,
      remark: '',
    }));
}

/** 兼容历史状态值 */
export function normalizeReviewStatus(status: string): ProjectPlan['reviewStatus'] {
  const map: Record<string, ProjectPlan['reviewStatus']> = {
    draft: 'draft',
    dept_review: 'dept_review',
    pending: 'pending_joint',
    pending_joint: 'pending_joint',
    reviewing: 'joint_reviewing',
    joint_reviewing: 'joint_reviewing',
    approved: 'transferred',
    transferred: 'transferred',
    rejected: 'rejected',
    returned: 'returned',
  };
  return map[status] || 'draft';
}

export function withPaymentPlans(plan: ProjectPlan): ProjectPlan {
  const normalized = {
    ...plan,
    reviewStatus: normalizeReviewStatus(plan.reviewStatus as string),
  };
  if (normalized.paymentPlans && normalized.paymentPlans.length > 0) return normalized;
  return { ...normalized, paymentPlans: derivePaymentPlans(normalized) };
}

/** 立项申请·新建/技改：补齐详细信息与研究报告人员演示字段 */
export function withInitiationDetailFields(plan: ProjectPlan): ProjectPlan {
  const major = plan.projectMajorType || '技改';
  if (major === '营缮') {
    const seed = Number(plan.id) || 0;
    const jobChangeRaw = plan.hasJobChange || '无';
    const hasJobChange =
      jobChangeRaw === '是' ? '增加' :
      jobChangeRaw === '否' ? '无' :
      jobChangeRaw;
    return {
      ...plan,
      isInPlanProject: plan.isInPlanProject || (plan.annualPlanNo ? '是' : (seed % 2 === 0 ? '是' : '否')),
      annualPlanNo: plan.annualPlanNo || (seed % 2 === 0 ? `NDJH-2026-D${String(100 + seed).slice(-3)}` : ''),
      annualPlanId: plan.annualPlanId || (seed % 2 === 0 ? `ap_oh_${plan.id}` : ''),
      isCapitalOverhaul: plan.isCapitalOverhaul || '是',
      declareFee: plan.declareFee ?? Math.round((plan.budgetAmount || 0) * 0.9 * 100) / 100,
      ownerUnit: plan.ownerUnit || (overhaulDivisionUnitMap[plan.businessDivision || '']?.[0] || ''),
      researchPersons:
        plan.researchPersons && plan.researchPersons.length > 0
          ? plan.researchPersons
          : defaultResearchPersons.map((r) => ({ ...r, id: `${plan.id}_${r.id}` })),
      overhaulContentRows:
        plan.overhaulContentRows && plan.overhaulContentRows.length > 0
          ? plan.overhaulContentRows
          : defaultOverhaulContentRows.map((r) => ({ ...r, id: `${plan.id}_${r.id}` })),
      hasJobChange,
    };
  }
  if (major === '零固') {
    const seed = Number(plan.id) || 0;
    const inPlan = plan.isInPlanProject || (plan.annualPlanNo ? '是' : (seed % 2 === 0 ? '是' : '否'));
    return {
      ...plan,
      isInPlanProject: inPlan,
      annualPlanNo: plan.annualPlanNo || (inPlan === '是' ? `NDJH-2026-L${String(100 + seed).slice(-3)}` : ''),
      annualPlanId: plan.annualPlanId || (inPlan === '是' ? `ap_mn_${plan.id}` : ''),
      argumentApplyNo: plan.argumentApplyNo || `B2026${String(90000 + seed).slice(-5)}`,
      isScrapRenew: plan.isScrapRenew || (seed % 2 === 0 ? '是' : '否'),
      declareFee: plan.declareFee ?? Math.round((plan.budgetAmount || 0) * 1.1 * 100) / 100,
      ownerUnit: plan.ownerUnit || (overhaulDivisionUnitMap[plan.businessDivision || '']?.[0] || ''),
      researchPersons:
        plan.researchPersons && plan.researchPersons.length > 0
          ? plan.researchPersons
          : defaultResearchPersons.map((r) => ({ ...r, id: `${plan.id}_${r.id}` })),
      minorContentRows:
        plan.minorContentRows && plan.minorContentRows.length > 0
          ? plan.minorContentRows
          : defaultMinorContentRows.map((r) => ({
              ...r,
              id: `${plan.id}_${r.id}`,
              unitPrice: Math.round(((plan.budgetAmount || 100) / 35) * 100) / 100,
              qty: 30 + (seed % 5),
              otherFee: Math.round((plan.budgetAmount || 100) * 0.05 * 100) / 100,
            })),
    };
  }
  if (major !== '新建' && major !== '技改') {
    return {
      ...plan,
      isInPlanProject: plan.isInPlanProject || (plan.annualPlanNo ? '是' : '否'),
      annualPlanNo: plan.annualPlanNo || '',
      annualPlanId: plan.annualPlanId || '',
    };
  }

  const seed = Number(plan.id) || 0;
  const filled = (v: string | undefined, fallback: string) => (v && v.trim() ? v : fallback);
  const startDate = plan.startDate?.length === 7 ? `${plan.startDate}-01` : (plan.startDate || '2026-04-01');
  const endDate = plan.endDate?.length === 7 ? `${plan.endDate}-28` : (plan.endDate || '2026-10-31');
  const jobChangeRaw = plan.hasJobChange || '无';
  const hasJobChange =
    jobChangeRaw === '是' ? '增加' :
    jobChangeRaw === '否' ? '无' :
    jobChangeRaw;

  return {
    ...plan,
    startDate,
    endDate,
    projectDuration: plan.projectDuration || calcProjectDurationMonths(startDate, endDate),
    implementUnit: filled(plan.implementUnit, plan.businessDivision || initiationImplementUnits[seed % initiationImplementUnits.length]),
    professionalUnit: filled(plan.professionalUnit, initiationProfessionalUnits[seed % initiationProfessionalUnits.length]),
    hasJobChange,
    jobChangeCount: hasJobChange === '无' ? 0 : (plan.jobChangeCount || (seed % 5) + 1),
    isInPlanProject: plan.isInPlanProject || (plan.annualPlanNo ? '是' : (seed % 3 === 0 ? '是' : '否')),
    annualPlanNo: plan.annualPlanNo || (seed % 3 === 0 ? `NDJH-2026-${String(1000 + seed).slice(-4)}` : ''),
    annualPlanId: plan.annualPlanId || (seed % 3 === 0 ? `ap_${plan.id}` : ''),
    projectFeasibility: filled(
      plan.projectFeasibility,
      plan.overallIdea || '经方案对比与现场考察，推荐方案技术成熟、实施路径清晰，具备可研条件。'
    ),
    modificationContent: filled(
      plan.modificationContent,
      plan.processDesc || '含工艺布置优化、关键设备选型及安全三同时相关内容。'
    ),
    deviceFacility: filled(plan.deviceFacility, '关键主机及配套设施，材质与寿命满足连续生产要求。'),
    auxWater: filled(plan.auxWater, '循环水系统需复核供水能力，必要时增设冷却塔。'),
    auxElec: filled(plan.auxElec, '需复核配电容量，预留变频控制回路。'),
    auxGas: filled(plan.auxGas, '煤气/天然气用量按设计负荷核算，管道需局部改造。'),
    auxOxygen: filled(plan.auxOxygen, seed % 2 === 0 ? '暂无新增氧气/氩气需求。' : '需复核氧气站富裕量。'),
    auxOther: filled(plan.auxOther, '压缩空气及工业网络按现场条件配套。'),
    techTarget: filled(plan.techTarget, '提升设备可靠性与工艺稳定性，达到设计产能指标。'),
    benefitTarget: filled(
      plan.benefitTarget,
      plan.benefit ? `预计年效益约 ${plan.benefit} 万元，回收期控制在合理区间。` : '形成可量化的成本节约与质量提升效益。'
    ),
    otherTarget: filled(plan.otherTarget, '同步落实安全、环保合规目标。'),
    energyAssess: filled(
      plan.energyAssess,
      '实施后单位产品能耗预计下降，采取余热利用/变频等节能措施。'
    ),
    costAnalysis: filled(
      plan.costAnalysis,
      `立项总概算约 ${plan.budgetAmount || 0} 万元，含建安、设备及其他费用。`
    ),
    researchPersons:
      plan.researchPersons && plan.researchPersons.length > 0
        ? plan.researchPersons
        : defaultResearchPersons.map((r) => ({ ...r, id: `${plan.id}_${r.id}` })),
    riskAssessRows:
      plan.riskAssessRows && plan.riskAssessRows.length > 0
        ? plan.riskAssessRows
        : defaultRiskAssessRows.map((r) => ({ ...r, id: `${plan.id}_${r.id}` })),
  };
}

export const projectMajorTypes: ProjectMajorType[] = ['新建', '技改', '营缮', '零固'];

export const projectMajorTypeFormPath: Record<ProjectMajorType, string> = {
  新建: '/project-plan/declaration/form/new',
  技改: '/project-plan/declaration/form/tech',
  营缮: '/project-plan/declaration/form/overhaul',
  零固: '/project-plan/declaration/form/minor',
};

/** 项目立项管理 · 项目立项申请表单路径 */
export const initiationMajorTypeFormPath: Record<ProjectMajorType, string> = {
  新建: '/project-initiation/declaration/form/new',
  技改: '/project-initiation/declaration/form/tech',
  营缮: '/project-initiation/declaration/form/overhaul',
  零固: '/project-initiation/declaration/form/minor',
};

/** 厂级（提报部门候选 / 筛选常用） */
export const businessDivisions = [
  '炼铁厂',
  '炼钢厂',
  '热轧厂',
  '冷轧厂',
  '原料厂',
  '动力厂',
  '建材厂',
  '物流厂',
];

/** 建设部门组织架构（演示数据，用于表单选择） */
export interface OrgNode {
  id: string;
  name: string;
  children?: OrgNode[];
}

/** 生产制造：厂级 → 提报单位（末级） */
const productionOrgChildren: OrgNode[] = [
  {
    id: 'org-iron',
    name: '炼铁厂',
    children: [
      { id: 'org-iron-1', name: '高炉分厂' },
      { id: 'org-iron-2', name: '烧结厂' },
      { id: 'org-iron-3', name: '球团分厂' },
    ],
  },
  {
    id: 'org-steel',
    name: '炼钢厂',
    children: [
      { id: 'org-steel-1', name: '第一炼钢厂' },
      { id: 'org-steel-2', name: '第二炼钢厂' },
      { id: 'org-steel-3', name: '连铸分厂' },
    ],
  },
  {
    id: 'org-hr',
    name: '热轧厂',
    children: [
      { id: 'org-hr-1', name: '热轧一厂' },
      { id: 'org-hr-2', name: '热轧二厂' },
      { id: 'org-hr-3', name: '加热炉车间' },
    ],
  },
  {
    id: 'org-cr',
    name: '冷轧厂',
    children: [
      { id: 'org-cr-1', name: '冷轧一厂' },
      { id: 'org-cr-2', name: '酸轧车间' },
      { id: 'org-cr-3', name: '镀锌车间' },
    ],
  },
  {
    id: 'org-raw',
    name: '原料厂',
    children: [
      { id: 'org-raw-1', name: '原料场' },
      { id: 'org-raw-2', name: '码头装卸车间' },
    ],
  },
  {
    id: 'org-power',
    name: '动力厂',
    children: [
      { id: 'org-power-1', name: '发电分厂' },
      { id: 'org-power-2', name: '制氧分厂' },
      { id: 'org-power-3', name: '供水车间' },
    ],
  },
  {
    id: 'org-build',
    name: '建材厂',
    children: [
      { id: 'org-build-1', name: '建材一厂' },
      { id: 'org-build-2', name: '建材二厂' },
    ],
  },
  {
    id: 'org-log',
    name: '物流厂',
    children: [
      { id: 'org-log-1', name: '运输一队' },
      { id: 'org-log-2', name: '仓储中心' },
    ],
  },
];

/** 项目提报单位（末级）选项，用于列表筛选 */
export const reportUnits = productionOrgChildren.flatMap((plant) =>
  (plant.children || []).map((u) => u.name)
);

export const constructionOrgTree: OrgNode[] = [
  {
    id: 'org-root',
    name: '贵港钢铁集团',
    children: [
      {
        id: 'org-prod',
        name: '生产制造体系',
        children: productionOrgChildren,
      },
      {
        id: 'org-eng',
        name: '工程建设体系',
        children: [
          { id: 'org-eng-1', name: '工程管理部' },
          { id: 'org-eng-2', name: '项目管理部' },
          { id: 'org-eng-3', name: '设备技术部' },
          { id: 'org-eng-4', name: '安全环保部' },
        ],
      },
      {
        id: 'org-func',
        name: '职能支持体系',
        children: [
          { id: 'org-func-1', name: '信息化中心' },
          { id: 'org-func-2', name: '财务部' },
          { id: 'org-func-3', name: '采购供应部' },
        ],
      },
    ],
  },
];

/** 查找组织节点的直接上级名称（用于提报部门自动带出） */
export function findOrgParentName(targetName: string, nodes: OrgNode[] = constructionOrgTree, parentName = ''): string {
  for (const node of nodes) {
    if (node.name === targetName) return parentName;
    if (node.children?.length) {
      const found = findOrgParentName(targetName, node.children, node.name);
      if (found || node.children.some((c) => c.name === targetName)) {
        return found || node.name;
      }
    }
  }
  return '';
}

/** 历史事业部名称 → 新厂级提报部门 */
const legacyDivisionToPlant: Record<string, string> = {
  炼铁事业部: '炼铁厂',
  炼钢事业部: '炼钢厂',
  热轧事业部: '热轧厂',
  冷轧事业部: '冷轧厂',
  原料事业部: '原料厂',
  动力事业部: '动力厂',
  建材事业部: '建材厂',
  物流事业部: '物流厂',
};

const plantDefaultUnit: Record<string, string> = {
  炼铁厂: '烧结厂',
  炼钢厂: '第一炼钢厂',
  热轧厂: '热轧一厂',
  冷轧厂: '冷轧一厂',
  原料厂: '原料场',
  动力厂: '发电分厂',
  建材厂: '建材一厂',
  物流厂: '运输一队',
};

/** 年度计划投资估算四项合计 → 投资总估算（设计费+建安费+设备费+其他） */
export function calcInvestmentEstimateTotal(
  plan: Pick<ProjectPlan, 'designFee' | 'jianAnFee' | 'equipmentFee' | 'otherFee' | 'installFee'>
): number {
  const design = Number(plan.designFee ?? plan.installFee) || 0;
  const total =
    design +
    (Number(plan.jianAnFee) || 0) +
    (Number(plan.equipmentFee) || 0) +
    (Number(plan.otherFee) || 0);
  return Math.round(total * 100) / 100;
}

/** 补齐投资估算分项演示数据，并回写 budgetAmount */
export function withInvestmentEstimateFields(plan: ProjectPlan): ProjectPlan {
  const hasDesign =
    (plan.designFee != null && !Number.isNaN(Number(plan.designFee))) ||
    (plan.installFee != null && !Number.isNaN(Number(plan.installFee)));
  let design = Number(plan.designFee ?? plan.installFee) || 0;
  let jianAn = Number(plan.jianAnFee) || 0;
  let equip = Number(plan.equipmentFee) || 0;
  let other = Number(plan.otherFee) || 0;
  const budget = Number(plan.budgetAmount) || 0;

  if (!hasDesign) {
    const known = jianAn + equip + other;
    if (budget > 0 && known > 0 && known <= budget) {
      design = Math.round((budget - known) * 100) / 100;
    } else if (budget > 0 && known === 0) {
      design = Math.round(budget * 0.1 * 100) / 100;
      jianAn = Math.round(budget * 0.3 * 100) / 100;
      equip = Math.round(budget * 0.5 * 100) / 100;
      other = Math.round((budget - design - jianAn - equip) * 100) / 100;
    } else if (known > 0) {
      design = 0;
    }
  }

  const next = {
    ...plan,
    designFee: design,
    jianAnFee: jianAn,
    equipmentFee: equip,
    otherFee: other,
    designFeeRemark: plan.designFeeRemark || plan.installFeeRemark || '',
    jianAnFeeRemark: plan.jianAnFeeRemark || '',
    equipmentFeeRemark: plan.equipmentFeeRemark || '',
    otherFeeRemark: plan.otherFeeRemark || '',
  };
  return {
    ...next,
    budgetAmount: calcInvestmentEstimateTotal(next) || budget,
  };
}

/** 补齐年度计划提报单位/提报部门/实施主管部门演示字段 */
export function withAnnualPlanOrgFields(plan: ProjectPlan): ProjectPlan {
  let unit = plan.businessDivision || '';
  let dept = plan.submitDept || '';

  if (legacyDivisionToPlant[unit]) {
    dept = dept || legacyDivisionToPlant[unit];
    unit = plantDefaultUnit[dept] || unit;
  } else if (!dept && unit) {
    const parent = findOrgParentName(unit);
    if (parent && !['生产制造体系', '工程建设体系', '职能支持体系', '贵港钢铁集团', ''].includes(parent)) {
      dept = parent;
    } else if (businessDivisions.includes(unit)) {
      dept = unit;
      unit = plantDefaultUnit[unit] || unit;
    }
  }

  const implementCandidates = ['工程管理部', '项目管理部', '设备技术部', '安全环保部', '信息化中心'];
  const seed = Number(String(plan.id).replace(/\D/g, '')) || 0;
  const enriched = withInvestmentEstimateFields({
    ...plan,
    businessDivision: unit,
    submitDept: dept || plan.submitDept || '',
    implementDept: plan.implementDept || implementCandidates[seed % implementCandidates.length],
    equipmentDesc: plan.equipmentDesc
      || ((plan.projectMajorType === '新建' || plan.projectMajorType === '技改')
        ? '主要设备及配套设施按可研方案配置，含工艺主机、公辅系统及智能控制装置。'
        : undefined),
    equipmentStockQty: plan.equipmentStockQty ?? (plan.projectMajorType === '零固' ? (plan.inUseQty ?? 8) : undefined),
    purchaseApplyQty: plan.purchaseApplyQty ?? (plan.projectMajorType === '零固' ? (plan.updateQty ?? 1) : undefined),
  });
  return enriched;
}

export const projectCategories = [
  '设备营缮',
  '环保改造',
  '节能改造',
  '智能化改造',
  '电力工程',
  '信息化建设',
  '设备更新',
  '土建工程',
  '安全改造',
  '工艺改造',
];

export const reviewStatusMap: Record<string, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  draft:           { label: '草稿',     dotColor: '#94a3b8', bgColor: '#f1f5f9', textColor: '#64748b' },
  dept_review:     { label: '部门内审', dotColor: '#8b5cf6', bgColor: '#f5f3ff', textColor: '#7c3aed' },
  pending_joint:   { label: '待会审',   dotColor: '#f59e0b', bgColor: '#fffbeb', textColor: '#d97706' },
  joint_reviewing: { label: '会审中',   dotColor: '#3b82f6', bgColor: '#eff6ff', textColor: '#2563eb' },
  rejected:        { label: '已驳回',   dotColor: '#ef4444', bgColor: '#fef2f2', textColor: '#dc2626' },
  returned:        { label: '已退回',   dotColor: '#f97316', bgColor: '#fff7ed', textColor: '#ea580c' },
  transferred:     { label: '已转计划', dotColor: '#22c55e', bgColor: '#f0fdf4', textColor: '#16a34a' },
};

export const ANNUAL_DECL_STORAGE_KEY = 'ng_decl_plans_v13';

/** 立项申请可选：已申请通过（已转计划）的年度计划 */
export function getApprovedAnnualPlans(): ProjectPlan[] {
  let list: ProjectPlan[] = projectPlans;
  try {
    const s = localStorage.getItem(ANNUAL_DECL_STORAGE_KEY)
      || localStorage.getItem('ng_decl_plans_v12')
      || localStorage.getItem('ng_decl_plans_v11')
      || localStorage.getItem('ng_decl_plans_v10');
    if (s) list = JSON.parse(s) as ProjectPlan[];
  } catch { /* use seed */ }
  return list
    .map((p) => withPaymentPlans(withAnnualPlanOrgFields({
      ...p,
      reviewStatus: normalizeReviewStatus(p.reviewStatus as string),
      planNo: p.planNo || `JH-${p.planYear || '2026'}-${String(p.id).padStart(3, '0')}`,
    })))
    .filter((p) => p.reviewStatus === 'transferred');
}

export const stageOptions = ['申报阶段', '初审阶段', '复审阶段', '终审阶段', '审批完成'];

export const projectPlans: ProjectPlan[] = [
  {
    id: '1',
    planYear: '2026',
    businessDivision: '炼铁事业部',
    projectMajorType: '营缮',
    projectCategory: '设备营缮',
    planName: '3号高炉炉体大修及配套设备更新改造工程',
    budgetAmount: 850.00,
    benefit: 120.50,
    year1Payment: 300.00,
    year2Payment: 400.00,
    year3Payment: 150.00,
    projectManager: '张伟',
    projectManagerPhone: '13801380138',
    currentReviewer: '李副总',
    latestStage: '复审阶段',
    reviewStatus: 'dept_review',
    applicant: '张伟',
    startDate: '2026-03',
    endDate: '2026-08',
    supplementNote: '高炉炉龄已达设计使用年限，营缮势在必行',
    currentSituation: '3号高炉于2016年建成投产，目前炉龄已达10年，炉体设备老化严重，热风炉阀门漏风率高达15%，影响生产效率。',
    necessity: '高炉营缮是保障持续稳定生产的必要措施，可有效提升铁水质量，降低燃料比，实现年节省成本约2000万元。',
    innovation: '采用新型耐材技术和智能监测系统，引进国内先进的无料钟炉顶设备，实现高炉操作智能化。',
    processDesc: '拆除旧炉体，更换炉缸、炉腹、炉腰耐火砖，安装新型冷却壁，完善煤气系统及喷吹系统改造。',
    overallIdea: '分步实施，先完成主体改造，再进行配套系统升级，确保营缮期间不影响其他工序生产。',
    jianAnFee: 350.00,
    equipmentFee: 380.00,
    otherFee: 120.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    isCapitalOverhaul: '是',
    fixedAssetCode: 'FA-GT-3BF-001',
    equipmentCode: 'EQ-GT-001,EQ-GT-002',
    equipmentName: '3号高炉炉体冷却系统、热风炉阀门组',
    repairArea: 1200,
    overhaulCycleYears: 10,
    lastOverhaulDate: '2016-05-20',
    isStandardOverhaul: '是',
    equipmentCommissionDate: '2016-03-01',
    lastOverhaulContent: '炉体耐材更换、冷却壁局部更新、热风炉阀门检修',
    overhaulReason: '炉役到期，冷却系统老化，漏风率高，影响产量与能耗',
    overhaulPlanEffect: '恢复设计炉役，降低燃料比，提升铁水产量稳定性',
    createdAt: '2025-12-15',
    updatedAt: '2026-01-10',
  },
  {
    id: '2',
    planYear: '2026',
    businessDivision: '原料事业部',
    projectMajorType: '技改',
    projectCategory: '环保改造',
    planName: '烧结机头烟气脱硫脱硝系统升级改造',
    budgetAmount: 420.00,
    benefit: 88.20,
    year1Payment: 200.00,
    year2Payment: 180.00,
    year3Payment: 40.00,
    projectManager: '李明',
    projectManagerPhone: '13912345678',
    currentReviewer: '王部长',
    latestStage: '初审阶段',
    reviewStatus: 'pending_joint',
    applicant: '李明',
    startDate: '2026-04',
    endDate: '2026-10',
    supplementNote: '满足最新环保排放标准要求',
    currentSituation: '现有烧结机头烟气处理系统建于2014年，脱硫效率仅为85%，SO2排放浓度超过现行国家标准。',
    necessity: '满足《钢铁工业大气污染物排放标准》（GB28664-2022）的最新要求，避免环保处罚，保障生产许可。',
    innovation: '采用活性炭一体化脱硫脱硝技术，较传统石灰-石膏法减少占地约30%，运行成本降低20%。',
    processDesc: '拆除旧脱硫塔，新建活性炭吸附塔，配套建设再生系统、硫磺回收系统及烟气监测系统。',
    overallIdea: '利用年修机会集中施工，减少对烧结生产的影响，总工期控制在6个月以内。',
    jianAnFee: 180.00,
    equipmentFee: 200.00,
    otherFee: 40.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2025-12-20',
    updatedAt: '2026-01-15',
  },
  {
    id: '3',
    planYear: '2026',
    businessDivision: '热轧事业部',
    projectMajorType: '技改',
    projectCategory: '节能改造',
    planName: '热轧加热炉蓄热式燃烧系统节能改造',
    budgetAmount: 280.00,
    benefit: 65.00,
    year1Payment: 150.00,
    year2Payment: 100.00,
    year3Payment: 30.00,
    projectManager: '王强',
    projectManagerPhone: '13700137001',
    currentReviewer: '',
    latestStage: '已退回',
    reviewStatus: 'returned',
    applicant: '王强',
    startDate: '2026-05',
    endDate: '2026-09',
    supplementNote: '请补充效益测算依据后重新申报',
    currentSituation: '加热炉现采用传统燃烧方式，煤气消耗量大，热效率仅为70%。',
    necessity: '通过节能改造，预计年节省高炉煤气约1500万m³，折合标准煤约5000吨，降低生产成本约650万元/年。',
    innovation: '引进蓄热式高温空气燃烧技术（HTAC），利用废烟气预热助燃空气，实现超低氧燃烧。',
    processDesc: '改造燃烧器，新增蓄热体装置，更新控制系统，完善余热回收管路。',
    overallIdea: '结合轧机年修计划，利用停产窗口期集中改造，减少对生产影响。',
    jianAnFee: 100.00,
    equipmentFee: 140.00,
    otherFee: 40.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-01-05',
    updatedAt: '2026-01-05',
  },
  {
    id: '4',
    planYear: '2026',
    businessDivision: '原料事业部',
    projectMajorType: '技改',
    projectCategory: '智能化改造',
    planName: '原料场堆取料机无人化改造及智能调度系统建设',
    budgetAmount: 650.00,
    benefit: 95.00,
    year1Payment: 250.00,
    year2Payment: 300.00,
    year3Payment: 100.00,
    projectManager: '赵芳',
    projectManagerPhone: '13611112222',
    currentReviewer: '刘副总',
    latestStage: '终审阶段',
    reviewStatus: 'joint_reviewing',
    applicant: '赵芳',
    startDate: '2026-06',
    endDate: '2026-12',
    supplementNote: '列入公司智能化三年行动计划',
    currentSituation: '原料场堆取料机目前依赖人工操作，每台设备配备3-4名操作员，劳动强度大，效率低，粉尘对人员健康影响显著。',
    necessity: '实现无人化操作后，可减少操作员15人，降低人工成本约300万元/年，同时提升堆取料精度和效率约25%。',
    innovation: '采用激光雷达+视觉识别+AI路径规划技术，实现料场三维建模和智能调度，国内首套大型料场全无人化解决方案。',
    processDesc: '改造堆取料机控制系统，安装传感器和识别系统，建设集控中心，开发智能调度软件平台。',
    overallIdea: '分两期实施，第一期完成2台堆料机改造，第二期完成取料机改造和调度系统集成。',
    jianAnFee: 200.00,
    equipmentFee: 350.00,
    otherFee: 100.00,
    hasJobChange: '是',
    jobChangeCount: -15,
    createdAt: '2026-01-08',
    updatedAt: '2026-01-08',
  },
  {
    id: '5',
    planYear: '2026',
    businessDivision: '动力事业部',
    projectMajorType: '新建',
    projectCategory: '电力工程',
    planName: '110kV主变电站扩容及配电系统改造工程',
    budgetAmount: 320.00,
    benefit: 45.00,
    year1Payment: 180.00,
    year2Payment: 100.00,
    year3Payment: 40.00,
    projectManager: '刘洋',
    projectManagerPhone: '13500135001',
    currentReviewer: '',
    latestStage: '审批完成',
    reviewStatus: 'transferred',
    applicant: '刘洋',
    startDate: '2026-02',
    endDate: '2026-07',
    supplementNote: '配合新工序供电需求',
    currentSituation: '现有主变压器运行年限已超25年，多次出现过热故障，供电可靠性下降，且容量不足以支撑新增工序用电需求。',
    necessity: '新增主变压器2×50MVA，提升供电容量和可靠性，满足十四五期间新增用电负荷需求。',
    innovation: '采用智能变电站技术，实现远程监控和无人值守，集成电能质量监测和需量管理功能。',
    processDesc: '新建110kV GIS开关柜，更换老旧主变压器，升级自动化控制系统，完善继电保护装置。',
    overallIdea: '利用电网检修窗口，分段倒闸施工，确保不间断供电。',
    jianAnFee: 80.00,
    equipmentFee: 200.00,
    otherFee: 40.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2025-11-20',
    updatedAt: '2026-01-12',
  },
  {
    id: '6',
    planYear: '2026',
    businessDivision: '炼钢事业部',
    projectMajorType: '技改',
    projectCategory: '环保改造',
    planName: '转炉二次除尘系统优化改造项目',
    budgetAmount: 180.00,
    benefit: 32.00,
    year1Payment: 100.00,
    year2Payment: 60.00,
    year3Payment: 20.00,
    projectManager: '陈刚',
    projectManagerPhone: '13811118888',
    currentReviewer: '环保部',
    latestStage: '初审阶段',
    reviewStatus: 'rejected',
    applicant: '陈刚',
    startDate: '2026-07',
    endDate: '2026-11',
    supplementNote: '已驳回，请补充环境影响评价报告',
    currentSituation: '转炉兑铁、出钢过程中产生大量含尘烟气，现有布袋除尘器使用年限超12年，设备老化，除尘效率降至90%。',
    necessity: '提升除尘效率至99%以上，满足超低排放改造要求，减少环保违规风险。',
    innovation: '采用新型覆膜滤料布袋，引进脉冲清灰控制技术，提升除尘效率的同时降低运行阻力。',
    processDesc: '更换除尘器本体和滤袋，升级电控系统，新增在线监测仪表，完善气流均布设施。',
    overallIdea: '利用转炉定修计划，集中2周完成改造施工。',
    jianAnFee: 60.00,
    equipmentFee: 90.00,
    otherFee: 30.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2025-12-10',
    updatedAt: '2026-01-08',
  },
  {
    id: '7',
    planYear: '2026',
    businessDivision: '动力事业部',
    projectMajorType: '新建',
    projectCategory: '信息化建设',
    planName: '企业级能源管理系统（EMS）平台建设项目',
    budgetAmount: 550.00,
    benefit: 180.00,
    year1Payment: 220.00,
    year2Payment: 200.00,
    year3Payment: 130.00,
    projectManager: '孙丽',
    projectManagerPhone: '13966669999',
    currentReviewer: '信息部',
    latestStage: '复审阶段',
    reviewStatus: 'joint_reviewing',
    applicant: '孙丽',
    startDate: '2026-03',
    endDate: '2026-12',
    supplementNote: '纳入集团数字化转型重点项目',
    currentSituation: '公司现有能源管理系统孤岛化严重，水、电、气、煤、氧等各介质分散管理，无法实现统一调度和优化配置。',
    necessity: '建立统一能源管理平台，实现能源数据实时采集、分析和优化调度，预计年节能效益约1.8亿元。',
    innovation: '融合大数据分析、AI优化算法和数字孪生技术，实现能源系统全局优化，国内领先水平。',
    processDesc: '建设数据采集层（RTU/PLC改造），搭建EMS平台（数据库、应用服务器），开发可视化展示和决策支持模块。',
    overallIdea: '分三期建设，第一期完成基础平台和数据接入，第二期完成分析功能，第三期完成AI优化功能。',
    jianAnFee: 50.00,
    equipmentFee: 150.00,
    otherFee: 350.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2025-12-25',
    updatedAt: '2026-01-14',
  },
  {
    id: '8',
    planYear: '2026',
    businessDivision: '物流事业部',
    projectMajorType: '零固',
    projectCategory: '设备更新',
    planName: '矿石码头桥式卸船机更新换代工程',
    budgetAmount: 760.00,
    benefit: 55.00,
    year1Payment: 200.00,
    year2Payment: 360.00,
    year3Payment: 200.00,
    projectManager: '周涛',
    projectManagerPhone: '13477778888',
    currentReviewer: '',
    latestStage: '申报阶段',
    reviewStatus: 'draft',
    applicant: '周涛',
    startDate: '2026-08',
    endDate: '2027-02',
    supplementNote: '',
    currentSituation: '现有2台卸船机建于2001年，设备老化严重，故障率高达12%，严重影响原料供应保障。',
    necessity: '更新后卸船效率提升40%，年减少停机损失约5000万元，同时降低维修费用约500万元/年。',
    innovation: '引进变频驱动和自动称重系统，实现精准卸货和数据化管理，能耗降低约20%。',
    processDesc: '拆除旧设备，新建桥式抓斗卸船机2台（额定卸船量1500t/h），配套新建码头基础加固工程。',
    overallIdea: '利用码头淡季（冬季）施工，减少对矿石卸载的影响，确保旺季前投入使用。',
    jianAnFee: 280.00,
    equipmentFee: 400.00,
    otherFee: 80.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    equipmentCode: 'EQ-WL-US-01',
    equipmentName: '桥式抓斗卸船机',
    specModel: '抓斗卸船机 1500t/h',
    measureUnit: '台',
    updateQty: 2,
    inUseQty: 2,
    unitPrice: 380,
    isNewMinor: '否',
    fixedAssetCode: 'FA-WL-US-001',
    updateReason: '设备老化故障率高，更新后卸船效率提升40%，保障原料供应。',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10',
  },
  {
    id: '9',
    planYear: '2025',
    businessDivision: '冷轧事业部',
    projectMajorType: '新建',
    projectCategory: '工艺改造',
    planName: '冷轧产线酸洗段工艺优化改造',
    budgetAmount: 195.00,
    benefit: 42.00,
    year1Payment: 120.00,
    year2Payment: 75.00,
    year3Payment: 0,
    projectManager: '吴晓燕',
    projectManagerPhone: '13322223333',
    currentReviewer: '',
    latestStage: '已转计划',
    reviewStatus: 'transferred',
    planNo: 'JH-2025-009',
    applicant: '吴晓燕',
    startDate: '2025-06',
    endDate: '2025-11',
    supplementNote: '',
    currentSituation: '酸洗线盐酸浓度控制精度不足，废酸排放量较大。',
    necessity: '改造后废酸减排约30%，酸耗降低15%，年节约成本约420万元。',
    innovation: '引进新型浓酸再生技术，实现废酸循环利用率达95%以上。',
    processDesc: '升级酸再生装置，新增废液浓缩系统，优化酸浓度在线检测控制回路。',
    overallIdea: '结合年修实施，停产窗口一次性完成全部改造内容。',
    jianAnFee: 60.00,
    equipmentFee: 110.00,
    otherFee: 25.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2025-03-10',
    updatedAt: '2025-12-28',
  },
  {
    id: '10',
    planYear: '2025',
    businessDivision: '建材事业部',
    projectMajorType: '零固',
    projectCategory: '安全改造',
    planName: '水泥生产线消防及安全系统升级改造',
    budgetAmount: 88.00,
    benefit: 15.00,
    year1Payment: 88.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '钱建国',
    projectManagerPhone: '13100001111',
    currentReviewer: '',
    latestStage: '已转计划',
    reviewStatus: 'transferred',
    planNo: 'JH-2025-010',
    applicant: '钱建国',
    startDate: '2025-09',
    endDate: '2025-12',
    supplementNote: '安全生产专项检查整改要求',
    currentSituation: '现有消防系统建于2008年，探测器老化，灭火装置部分失效，不符合最新安全规范。',
    necessity: '满足《建筑防火设计规范》（GB50016-2018）要求，消除安全隐患，保障人员安全。',
    innovation: '采用智能消防管控平台，实现火灾预警、自动报警和联动控制一体化管理。',
    processDesc: '更换火灾探测器，升级消防联动控制器，完善应急疏散指示和广播系统。',
    overallIdea: '利用窑系统停机机会，分区域改造，确保不影响正常生产。',
    jianAnFee: 40.00,
    equipmentFee: 35.00,
    otherFee: 13.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    equipmentCode: 'EQ-JC-XF-01',
    equipmentName: '水泥线消防联动控制器',
    specModel: '智能消防主机 XF-800',
    measureUnit: '套',
    updateQty: 1,
    inUseQty: 1,
    unitPrice: 88,
    isNewMinor: '否',
    fixedAssetCode: 'FA-JC-XF-001',
    updateReason: '满足最新安全规范，消除消防隐患。',
    createdAt: '2025-07-15',
    updatedAt: '2025-12-15',
  },
  {
    id: '11',
    planYear: '2026',
    businessDivision: '炼钢事业部',
    projectMajorType: '营缮',
    projectCategory: '设备营缮',
    planName: '2号转炉炉壳及托圈大修工程',
    budgetAmount: 460.00,
    benefit: 78.00,
    year1Payment: 260.00,
    year2Payment: 200.00,
    year3Payment: 0,
    projectManager: '陈刚',
    projectManagerPhone: '13811118888',
    currentReviewer: '',
    latestStage: '申报阶段',
    reviewStatus: 'draft',
    applicant: '陈刚',
    startDate: '2026-09',
    endDate: '2026-12',
    supplementNote: '',
    currentSituation: '2号转炉炉壳局部变形，托圈轴承磨损超标，影响冶炼节奏与安全运行。',
    necessity: '按期营缮可恢复炉役，避免非计划停炉造成的产能损失。',
    innovation: '采用整体吊装更换托圈，缩短工期约15天。',
    processDesc: '停炉冷却、拆除炉壳与托圈、安装新组件、烘炉试运行。',
    overallIdea: '结合定修窗口一次性完成，确保钢水供应衔接。',
    jianAnFee: 180.00,
    equipmentFee: 220.00,
    otherFee: 60.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    isCapitalOverhaul: '是',
    fixedAssetCode: 'FA-LG-BOF2-001',
    equipmentCode: 'EQ-LG-011',
    equipmentName: '2号转炉倾动机构',
    repairArea: 680,
    overhaulCycleYears: 8,
    lastOverhaulDate: '2018-11-12',
    isStandardOverhaul: '是',
    equipmentCommissionDate: '2012-06-01',
    lastOverhaulContent: '托圈轴承更换、炉壳局部矫形',
    overhaulReason: '托圈磨损超标，炉壳变形影响安全冶炼',
    overhaulPlanEffect: '恢复炉役，保障冶炼节奏与安全',
    createdAt: '2026-01-18',
    updatedAt: '2026-01-18',
  },
  {
    id: 'oh3',
    planYear: '2027',
    businessDivision: '热轧事业部',
    projectMajorType: '营缮',
    projectCategory: '设备营缮',
    planName: '2250热轧精轧主传动系统大修工程',
    budgetAmount: 920.00,
    benefit: 210.00,
    year1Payment: 500.00,
    year2Payment: 420.00,
    year3Payment: 0,
    projectManager: '王强',
    projectManagerPhone: '13700137001',
    currentReviewer: '',
    latestStage: '已转计划',
    reviewStatus: 'transferred',
    planNo: 'JH-2027-OH3',
    applicant: '王强',
    startDate: '2027-03',
    endDate: '2027-08',
    supplementNote: '',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    jianAnFee: 200.00,
    equipmentFee: 620.00,
    otherFee: 100.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    isCapitalOverhaul: '是',
    fixedAssetCode: 'FA-RZ-2250-MD',
    equipmentCode: 'EQ-RZ-021',
    equipmentName: '2250精轧主传动电机',
    repairArea: 0,
    overhaulCycleYears: 6,
    lastOverhaulDate: '2021-04-18',
    isStandardOverhaul: '否',
    equipmentCommissionDate: '2010-09-01',
    lastOverhaulContent: '主电机轴承及冷却系统检修',
    overhaulReason: '主传动振动超标，绝缘老化',
    overhaulPlanEffect: '恢复额定出力，降低非计划停机',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-20',
  },
  {
    id: 'oh4',
    planYear: '2027',
    businessDivision: '冷轧事业部',
    projectMajorType: '营缮',
    projectCategory: '设备营缮',
    planName: '酸轧机组张力辊及换辊小车大修',
    budgetAmount: 186.00,
    benefit: 45.00,
    year1Payment: 186.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '吴晓燕',
    projectManagerPhone: '13322223333',
    currentReviewer: '',
    latestStage: '已退回',
    reviewStatus: 'returned',
    applicant: '陈刚',
    startDate: '2027-05',
    endDate: '2027-07',
    supplementNote: '请补充载荷核算后重新提交',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    jianAnFee: 40.00,
    equipmentFee: 120.00,
    otherFee: 26.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    isCapitalOverhaul: '否',
    fixedAssetCode: '',
    equipmentCode: 'EQ-LZ-007',
    equipmentName: '酸轧机组张力辊',
    repairArea: 120,
    overhaulCycleYears: 4,
    lastOverhaulDate: '2023-06-01',
    isStandardOverhaul: '是',
    equipmentCommissionDate: '2015-03-20',
    lastOverhaulContent: '张力辊表面修复、轴承更换',
    overhaulReason: '辊面磨损超限，影响带钢表面质量',
    overhaulPlanEffect: '提升表面质量，减少断带风险',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-18',
  },
  {
    id: 'oh5',
    planYear: '2027',
    businessDivision: '动力事业部',
    projectMajorType: '营缮',
    projectCategory: '电力工程',
    planName: '35kV主变压器及附属系统大修',
    budgetAmount: 680.00,
    benefit: 95.00,
    year1Payment: 400.00,
    year2Payment: 280.00,
    year3Payment: 0,
    projectManager: '孙丽',
    projectManagerPhone: '13966669999',
    currentReviewer: '动力部',
    latestStage: '待会审',
    reviewStatus: 'pending_joint',
    applicant: '孙丽',
    startDate: '2027-02',
    endDate: '2027-06',
    supplementNote: '',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    jianAnFee: 80.00,
    equipmentFee: 520.00,
    otherFee: 80.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    isCapitalOverhaul: '是',
    fixedAssetCode: 'FA-DY-35KV-T1',
    equipmentCode: 'EQ-DY-003',
    equipmentName: '35kV主变压器',
    repairArea: 200,
    overhaulCycleYears: 8,
    lastOverhaulDate: '2019-08-15',
    isStandardOverhaul: '是',
    equipmentCommissionDate: '2009-12-01',
    lastOverhaulContent: '变压器油处理、套管更换',
    overhaulReason: '色谱异常，冷却系统效率下降',
    overhaulPlanEffect: '保障全厂供电可靠性',
    createdAt: '2026-02-08',
    updatedAt: '2026-02-09',
  },
  {
    id: 'oh6',
    planYear: '2026',
    businessDivision: '原料事业部',
    projectMajorType: '营缮',
    projectCategory: '设备营缮',
    planName: '烧结机台车及密封系统大修工程',
    budgetAmount: 540.00,
    benefit: 160.00,
    year1Payment: 300.00,
    year2Payment: 240.00,
    year3Payment: 0,
    projectManager: '李明',
    projectManagerPhone: '13912345678',
    currentReviewer: '会审组',
    latestStage: '会审中',
    reviewStatus: 'joint_reviewing',
    applicant: '周涛',
    startDate: '2026-10',
    endDate: '2027-01',
    supplementNote: '',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    jianAnFee: 180.00,
    equipmentFee: 300.00,
    otherFee: 60.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    isCapitalOverhaul: '是',
    fixedAssetCode: 'FA-YL-ST-01',
    equipmentCode: 'EQ-YL-004',
    equipmentName: '烧结机台车',
    repairArea: 860,
    overhaulCycleYears: 5,
    lastOverhaulDate: '2021-09-30',
    isStandardOverhaul: '是',
    equipmentCommissionDate: '2011-05-18',
    lastOverhaulContent: '台车栏板更换、密封板修复',
    overhaulReason: '漏风率升高，影响烧结矿质量',
    overhaulPlanEffect: '降低漏风，提升成品率',
    createdAt: '2026-02-11',
    updatedAt: '2026-02-13',
  },
  {
    id: 'oh7',
    planYear: '2026',
    businessDivision: '物流事业部',
    projectMajorType: '营缮',
    projectCategory: '设备营缮',
    planName: '原料输送皮带机结构大修',
    budgetAmount: 98.00,
    benefit: 12.00,
    year1Payment: 98.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '周涛',
    projectManagerPhone: '13477778888',
    currentReviewer: '',
    latestStage: '已驳回',
    reviewStatus: 'rejected',
    applicant: '周涛',
    startDate: '2026-06',
    endDate: '2026-08',
    supplementNote: '方案深度不足，请补充载荷核算',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    jianAnFee: 50.00,
    equipmentFee: 35.00,
    otherFee: 13.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    isCapitalOverhaul: '否',
    fixedAssetCode: '',
    equipmentCode: 'EQ-WL-002',
    equipmentName: '原料输送皮带机',
    repairArea: 0,
    overhaulCycleYears: 3,
    lastOverhaulDate: '2024-03-01',
    isStandardOverhaul: '否',
    equipmentCommissionDate: '2013-07-01',
    lastOverhaulContent: '托辊更换、皮带接头检修',
    overhaulReason: '机架腐蚀、跑偏频繁',
    overhaulPlanEffect: '提升输送稳定性',
    createdAt: '2026-02-14',
    updatedAt: '2026-02-16',
  },
  {
    id: '12',
    planYear: '2026',
    businessDivision: '热轧事业部',
    projectMajorType: '零固',
    projectCategory: '设备更新',
    planName: '精轧机液压伺服阀组零星更新',
    budgetAmount: 56.00,
    benefit: 12.00,
    year1Payment: 56.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '王强',
    projectManagerPhone: '13700137001',
    currentReviewer: '设备部',
    latestStage: '初审阶段',
    reviewStatus: 'pending_joint',
    applicant: '王强',
    startDate: '2026-04',
    endDate: '2026-06',
    supplementNote: '零固专项资金安排',
    currentSituation: '精轧机部分伺服阀响应迟缓，影响板形控制精度。',
    necessity: '更换后可稳定板形合格率，减少废次品损失。',
    innovation: '选用进口同规格伺服阀，兼容现有控制系统。',
    processDesc: '采购阀组、定修窗口更换、调试与验收。',
    overallIdea: '利用月修窗口分批更换，不影响连续生产。',
    jianAnFee: 8.00,
    equipmentFee: 42.00,
    otherFee: 6.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    equipmentCode: 'EQ-RZ-SV-12',
    equipmentName: '精轧机液压伺服阀组',
    specModel: '伺服阀 D661-G761',
    measureUnit: '套',
    updateQty: 4,
    inUseQty: 8,
    unitPrice: 14,
    isNewMinor: '否',
    fixedAssetCode: 'FA-RZ-SV-012',
    updateReason: '伺服阀响应迟缓，更换后稳定板形合格率。',
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20',
  },
  {
    id: '13',
    planYear: '2026',
    businessDivision: '炼铁事业部',
    projectMajorType: '新建',
    projectCategory: '土建工程',
    planName: '炼铁厂综合料仓及转运站新建工程',
    budgetAmount: 680.00,
    benefit: 95.00,
    year1Payment: 280.00,
    year2Payment: 300.00,
    year3Payment: 100.00,
    projectManager: '张伟',
    projectManagerPhone: '13801380138',
    currentReviewer: '',
    latestStage: '申报阶段',
    reviewStatus: 'draft',
    applicant: '张伟',
    startDate: '2026-06',
    endDate: '2027-03',
    supplementNote: '',
    currentSituation: '现有料仓容积不足，转运环节多次倒运，扬尘与损耗较大。',
    necessity: '新建综合料仓可提升原料缓冲能力，降低倒运成本与环保风险。',
    innovation: '采用封闭式料仓与智能料位监测，实现远程调度。',
    processDesc: '场地平整、桩基施工、主体结构、设备安装与联调。',
    overallIdea: '分两期建设，先完成主体仓体，再完善转运皮带及环保设施。',
    jianAnFee: 420.00,
    equipmentFee: 180.00,
    otherFee: 80.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01',
  },
  {
    id: '14',
    planYear: '2026',
    businessDivision: '冷轧事业部',
    projectMajorType: '新建',
    projectCategory: '信息化建设',
    planName: '冷轧质量数据中台新建项目',
    budgetAmount: 310.00,
    benefit: 72.00,
    year1Payment: 160.00,
    year2Payment: 120.00,
    year3Payment: 30.00,
    projectManager: '吴晓燕',
    projectManagerPhone: '13322223333',
    currentReviewer: '信息部',
    latestStage: '初审阶段',
    reviewStatus: 'pending_joint',
    applicant: '吴晓燕',
    startDate: '2026-05',
    endDate: '2026-11',
    supplementNote: '支撑产品质量追溯体系建设',
    currentSituation: '冷轧质量数据分散在多套系统，跨工序追溯困难。',
    necessity: '建设统一数据中台，实现卷材全流程质量追溯与分析。',
    innovation: '引入湖仓一体架构与实时指标服务，支持产线看板。',
    processDesc: '完成数据采集接入、主题库建设、API 服务与可视化看板。',
    overallIdea: '先接入关键产线数据，再扩展至全厂冷轧工序。',
    jianAnFee: 40.00,
    equipmentFee: 90.00,
    otherFee: 180.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-02-03',
    updatedAt: '2026-02-05',
  },
  {
    id: '15',
    planYear: '2026',
    businessDivision: '热轧事业部',
    projectMajorType: '新建',
    projectCategory: '环保改造',
    planName: '热轧厂区雨水收集与回用站新建工程',
    budgetAmount: 245.00,
    benefit: 38.00,
    year1Payment: 145.00,
    year2Payment: 100.00,
    year3Payment: 0,
    projectManager: '王强',
    projectManagerPhone: '13700137001',
    currentReviewer: '环保部',
    latestStage: '初审阶段',
    reviewStatus: 'rejected',
    applicant: '王强',
    startDate: '2026-07',
    endDate: '2026-12',
    supplementNote: '已驳回，请补充水平衡计算书与占地批复',
    currentSituation: '厂区雨水管网老化，汛期外排压力大，回用率低。',
    necessity: '新建雨水收集回用站，降低新鲜水消耗并满足环保要求。',
    innovation: '采用模块化水处理单元，预留扩容接口。',
    processDesc: '雨水调蓄池、处理单元、回用管网与在线监测建设。',
    overallIdea: '结合雨季前完工目标，分区域实施管网改造。',
    jianAnFee: 150.00,
    equipmentFee: 70.00,
    otherFee: 25.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-01-28',
    updatedAt: '2026-02-06',
  },
  {
    id: '16',
    planYear: '2026',
    businessDivision: '物流事业部',
    projectMajorType: '新建',
    projectCategory: '土建工程',
    planName: '原料码头堆场智能化地磅站新建',
    budgetAmount: 168.00,
    benefit: 28.00,
    year1Payment: 100.00,
    year2Payment: 68.00,
    year3Payment: 0,
    projectManager: '周涛',
    projectManagerPhone: '13477778888',
    currentReviewer: '物流部',
    latestStage: '复审阶段',
    reviewStatus: 'joint_reviewing',
    applicant: '周涛',
    startDate: '2026-04',
    endDate: '2026-09',
    supplementNote: '提升过磅效率与计量准确性',
    currentSituation: '现有地磅通道不足，高峰排队严重，人工登记效率低。',
    necessity: '新建智能化地磅站，缩短车辆周转时间，减少计量纠纷。',
    innovation: '车牌识别+无人值守过磅+自动出票一体化。',
    processDesc: '土建基础、地磅安装、卡口系统与软件联调。',
    overallIdea: '先建成双通道过磅，再接入码头调度系统。',
    jianAnFee: 75.00,
    equipmentFee: 70.00,
    otherFee: 23.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-02-02',
    updatedAt: '2026-02-08',
  },
  {
    id: '17',
    planYear: '2026',
    businessDivision: '建材事业部',
    projectMajorType: '新建',
    projectCategory: '安全改造',
    planName: '建材厂危化品库房新建项目',
    budgetAmount: 126.00,
    benefit: 18.00,
    year1Payment: 126.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '钱建国',
    projectManagerPhone: '13100001111',
    currentReviewer: '',
    latestStage: '申报阶段',
    reviewStatus: 'draft',
    applicant: '钱建国',
    startDate: '2026-08',
    endDate: '2026-12',
    supplementNote: '',
    currentSituation: '现有危化品存放点分散，不符合最新危化品储存规范。',
    necessity: '集中新建标准化库房，满足安监与消防合规要求。',
    innovation: '库房配置温湿度联动报警与门禁视频一体化管控。',
    processDesc: '选址批复、土建施工、消防设施与验收备案。',
    overallIdea: '与厂区安改专项同步推进，确保年内投用。',
    jianAnFee: 85.00,
    equipmentFee: 28.00,
    otherFee: 13.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-02-10',
    updatedAt: '2026-02-10',
  },
  {
    id: 'mn1',
    planYear: '2027',
    businessDivision: '炼钢事业部',
    projectMajorType: '零固',
    projectCategory: '设备更新',
    planName: '转炉氧枪喷头及枪体零星更新',
    budgetAmount: 42.00,
    benefit: 8.00,
    year1Payment: 42.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '陈刚',
    projectManagerPhone: '13811118888',
    currentReviewer: '炼钢设备室',
    latestStage: '部门内审',
    reviewStatus: 'dept_review',
    applicant: '陈刚',
    startDate: '2027-03',
    endDate: '2027-05',
    supplementNote: '',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    jianAnFee: 5.00,
    equipmentFee: 32.00,
    otherFee: 5.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    equipmentCode: 'EQ-LG-OG-03',
    equipmentName: '转炉氧枪喷头',
    specModel: '氧枪喷头 φ180',
    measureUnit: '支',
    updateQty: 6,
    inUseQty: 12,
    unitPrice: 7,
    isNewMinor: '否',
    fixedAssetCode: 'FA-LG-OG-003',
    updateReason: '喷头烧损严重，影响吹炼效率与安全。',
    createdAt: '2026-02-12',
    updatedAt: '2026-02-13',
  },
  {
    id: 'mn2',
    planYear: '2027',
    businessDivision: '动力事业部',
    projectMajorType: '零固',
    projectCategory: '电力工程',
    planName: '配电室低压开关柜抽屉单元更新',
    budgetAmount: 65.00,
    benefit: 10.00,
    year1Payment: 65.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '孙丽',
    projectManagerPhone: '13966669999',
    currentReviewer: '会审组',
    latestStage: '会审中',
    reviewStatus: 'joint_reviewing',
    applicant: '孙丽',
    startDate: '2027-04',
    endDate: '2027-07',
    supplementNote: '',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    jianAnFee: 8.00,
    equipmentFee: 50.00,
    otherFee: 7.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    equipmentCode: 'EQ-DY-LV-08',
    equipmentName: '低压开关柜抽屉单元',
    specModel: 'GCS 抽屉式开关柜',
    measureUnit: '面',
    updateQty: 5,
    inUseQty: 20,
    unitPrice: 13,
    isNewMinor: '是',
    fixedAssetCode: '',
    updateReason: '新增备用抽屉单元，提升配电可靠性。',
    createdAt: '2026-02-15',
    updatedAt: '2026-02-16',
  },
  {
    id: 'mn3',
    planYear: '2026',
    businessDivision: '原料事业部',
    projectMajorType: '零固',
    projectCategory: '设备更新',
    planName: '胶带机减速机零星更换',
    budgetAmount: 28.00,
    benefit: 5.00,
    year1Payment: 28.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '李明',
    projectManagerPhone: '13912345678',
    currentReviewer: '',
    latestStage: '已驳回',
    reviewStatus: 'rejected',
    applicant: '李明',
    startDate: '2026-07',
    endDate: '2026-09',
    supplementNote: '预算依据不充分，作废',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    jianAnFee: 2.00,
    equipmentFee: 22.00,
    otherFee: 4.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    equipmentCode: 'EQ-YL-JS-02',
    equipmentName: '胶带机减速机',
    specModel: 'ZSY315',
    measureUnit: '台',
    updateQty: 2,
    inUseQty: 6,
    unitPrice: 14,
    isNewMinor: '否',
    fixedAssetCode: 'FA-YL-JS-002',
    updateReason: '减速机异响、漏油，需更换保障输送。',
    createdAt: '2026-02-18',
    updatedAt: '2026-02-20',
  },
  {
    id: 'mn4',
    planYear: '2027',
    businessDivision: '冷轧事业部',
    projectMajorType: '零固',
    projectCategory: '设备更新',
    planName: '平整机工作辊轴承座更新',
    budgetAmount: 36.00,
    benefit: 6.00,
    year1Payment: 36.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '吴晓燕',
    projectManagerPhone: '13322223333',
    currentReviewer: '',
    latestStage: '已退回',
    reviewStatus: 'returned',
    applicant: '吴晓燕',
    startDate: '2027-02',
    endDate: '2027-04',
    supplementNote: '请补充在用数量与固定资产对应关系',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    jianAnFee: 4.00,
    equipmentFee: 28.00,
    otherFee: 4.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    equipmentCode: 'EQ-LZ-ZC-05',
    equipmentName: '平整机工作辊轴承座',
    specModel: '轴承座 Φ320',
    measureUnit: '套',
    updateQty: 4,
    inUseQty: 8,
    unitPrice: 9,
    isNewMinor: '否',
    fixedAssetCode: 'FA-LZ-ZC-005',
    updateReason: '轴承座磨损超限，影响板形与振动指标。',
    createdAt: '2026-02-21',
    updatedAt: '2026-02-22',
  },
  {
    id: 'tg1',
    planYear: '2027',
    businessDivision: '炼铁事业部',
    projectMajorType: '技改',
    projectCategory: '智能化改造',
    planName: '高炉专家系统及热风炉智能燃烧技改',
    budgetAmount: 320.00,
    benefit: 90.00,
    year1Payment: 200.00,
    year2Payment: 120.00,
    year3Payment: 0,
    projectManager: '张伟',
    projectManagerPhone: '13801380138',
    currentReviewer: '炼铁技术室',
    latestStage: '部门内审',
    reviewStatus: 'dept_review',
    applicant: '张伟',
    startDate: '2027-03',
    endDate: '2027-10',
    supplementNote: '',
    currentSituation: '热风炉燃烧控制依赖人工经验，煤气消耗波动大。',
    necessity: '智能燃烧可降低煤气消耗并稳定风温。',
    innovation: '引入多变量模型预测控制。',
    processDesc: '部署传感器、模型服务器与执行机构改造。',
    overallIdea: '分阶段上线，先单座热风炉试点。',
    jianAnFee: 40.00,
    equipmentFee: 220.00,
    otherFee: 60.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-02-23',
    updatedAt: '2026-02-23',
  },
  {
    id: 'tg2',
    planYear: '2026',
    businessDivision: '冷轧事业部',
    projectMajorType: '技改',
    projectCategory: '工艺改造',
    planName: '酸轧段板形闭环控制技改项目',
    budgetAmount: 210.00,
    benefit: 55.00,
    year1Payment: 210.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '吴晓燕',
    projectManagerPhone: '13322223333',
    currentReviewer: '',
    latestStage: '已转计划',
    reviewStatus: 'transferred',
    planNo: 'JH-2026-TG2',
    applicant: '吴晓燕',
    startDate: '2026-06',
    endDate: '2026-11',
    supplementNote: '',
    currentSituation: '板形控制开环，合格率偏低。',
    necessity: '闭环控制提升板形合格率与成材率。',
    innovation: '引入板形仪与液压弯辊联动控制。',
    processDesc: '安装检测、升级PLC、联调验收。',
    overallIdea: '结合定修窗口实施。',
    jianAnFee: 30.00,
    equipmentFee: 150.00,
    otherFee: 30.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-01-08',
    updatedAt: '2026-02-01',
  },
  {
    id: 'tg3',
    planYear: '2027',
    businessDivision: '动力事业部',
    projectMajorType: '技改',
    projectCategory: '节能改造',
    planName: '空压站变频节能技改工程',
    budgetAmount: 95.00,
    benefit: 28.00,
    year1Payment: 95.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '孙丽',
    projectManagerPhone: '13966669999',
    currentReviewer: '',
    latestStage: '草稿',
    reviewStatus: 'draft',
    applicant: '孙丽',
    startDate: '2027-05',
    endDate: '2027-08',
    supplementNote: '',
    currentSituation: '空压机工频运行，低负荷能耗偏高。',
    necessity: '变频改造降低用电成本。',
    innovation: '群控+变频联合调度。',
    processDesc: '变频器安装、管网改造、调试。',
    overallIdea: '不影响供气前提下分机组改造。',
    jianAnFee: 15.00,
    equipmentFee: 70.00,
    otherFee: 10.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-02-24',
    updatedAt: '2026-02-24',
  },
  {
    id: 'xj1',
    planYear: '2027',
    businessDivision: '原料事业部',
    projectMajorType: '新建',
    projectCategory: '土建工程',
    planName: '原料场智能堆取料系统新建',
    budgetAmount: 860.00,
    benefit: 120.00,
    year1Payment: 400.00,
    year2Payment: 460.00,
    year3Payment: 0,
    projectManager: '李明',
    projectManagerPhone: '13912345678',
    currentReviewer: '工程管理部',
    latestStage: '部门内审',
    reviewStatus: 'dept_review',
    applicant: '李明',
    startDate: '2027-04',
    endDate: '2027-12',
    supplementNote: '',
    currentSituation: '堆取料依赖人工调度，效率低。',
    necessity: '提高原料周转效率，降低损耗。',
    innovation: '无人化堆取料与三维料场建模。',
    processDesc: '新建控制系统与改造堆取料机。',
    overallIdea: '分两期建设，先取料后堆料。',
    jianAnFee: 200.00,
    equipmentFee: 560.00,
    otherFee: 100.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-02-25',
    updatedAt: '2026-02-25',
  },
  {
    id: 'xj2',
    planYear: '2026',
    businessDivision: '物流事业部',
    projectMajorType: '新建',
    projectCategory: '信息化建设',
    planName: '厂内物流调度平台新建项目',
    budgetAmount: 168.00,
    benefit: 40.00,
    year1Payment: 168.00,
    year2Payment: 0,
    year3Payment: 0,
    projectManager: '周涛',
    projectManagerPhone: '13477778888',
    currentReviewer: '',
    latestStage: '已退回',
    reviewStatus: 'returned',
    applicant: '周涛',
    startDate: '2026-09',
    endDate: '2026-12',
    supplementNote: '请补充与现有MES接口方案',
    currentSituation: '车辆调度分散，等待时间长。',
    necessity: '统一调度降低物流成本。',
    innovation: '路径优化与实时定位。',
    processDesc: '平台建设、车载终端、接口联调。',
    overallIdea: '先厂内后外协车辆接入。',
    jianAnFee: 20.00,
    equipmentFee: 80.00,
    otherFee: 68.00,
    hasJobChange: '否',
    jobChangeCount: 0,
    createdAt: '2026-02-26',
    updatedAt: '2026-02-27',
  },
];

export const projectManagers = [
  { id: 'PM001', name: '张伟', phone: '13801380138', division: '炼铁事业部' },
  { id: 'PM002', name: '李明', phone: '13912345678', division: '原料事业部' },
  { id: 'PM003', name: '王强', phone: '13700137001', division: '热轧事业部' },
  { id: 'PM004', name: '赵芳', phone: '13611112222', division: '原料事业部' },
  { id: 'PM005', name: '刘洋', phone: '13500135001', division: '动力事业部' },
  { id: 'PM006', name: '陈刚', phone: '13811118888', division: '炼钢事业部' },
  { id: 'PM007', name: '孙丽', phone: '13966669999', division: '动力事业部' },
  { id: 'PM008', name: '周涛', phone: '13477778888', division: '物流事业部' },
  { id: 'PM009', name: '吴晓燕', phone: '13322223333', division: '冷轧事业部' },
  { id: 'PM010', name: '钱建国', phone: '13100001111', division: '建材事业部' },
];
