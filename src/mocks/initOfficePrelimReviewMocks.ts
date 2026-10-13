import type { ProjectPlan, ProjectMajorType } from './projectPlans';
import { withInitiationDetailFields, withInvestmentEstimateFields, withPaymentPlans } from './projectPlans';

export type PrelimStatus = 'pending' | 'returned' | 'rejected' | 'passed';

export interface InitPrelimRecord extends ProjectPlan {
  prelimStatus: PrelimStatus;
  prevPrelimStatus?: PrelimStatus;
  cancelReason?: string;
  linkedPlanId: string;
}

export const PRELIM_TABS: { key: PrelimStatus; label: string }[] = [
  { key: 'pending', label: '待初审' },
  { key: 'returned', label: '已退回' },
  { key: 'rejected', label: '已驳回' },
  { key: 'passed', label: '初审通过' },
];

export const PRELIM_STORAGE_KEY = 'ng_init_office_prelim_v4';

const SEED: Array<
  Partial<InitPrelimRecord> & {
    id: string;
    planName: string;
    projectMajorType: ProjectMajorType;
    prelimStatus: PrelimStatus;
  }
> = [
  // 待初审 8
  { id: 'pre-01', planName: '炼铁厂原料场封闭及抑尘改造立项', projectMajorType: '新建', businessDivision: '炼铁厂', projectCategory: '环保改造', planYear: '2026', budgetAmount: 1860, benefit: 220, projectManager: '张伟', applicant: '周敏', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-001', implementDept: '工程管理部', startDate: '2026-03', endDate: '2026-12', currentReviewer: '项目办·陈工', reviewStatus: 'dept_review', prelimStatus: 'pending' },
  { id: 'pre-02', planName: '1#烧结机机尾除尘系统提标立项', projectMajorType: '技改', businessDivision: '原料厂', projectCategory: '环保改造', planYear: '2026', budgetAmount: 980, benefit: 156, projectManager: '李明', applicant: '李明', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-012', implementDept: '环保管理部', startDate: '2026-04', endDate: '2026-11', currentReviewer: '项目办·陈工', reviewStatus: 'dept_review', prelimStatus: 'pending' },
  { id: 'pre-03', planName: '3号高炉热风炉阀门组营缮立项', projectMajorType: '营缮', businessDivision: '炼铁厂', projectCategory: '设备营缮', planYear: '2026', budgetAmount: 420, benefit: 80, projectManager: '王强', applicant: '王强', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-018', implementDept: '设备管理部', startDate: '2026-05', endDate: '2026-08', isCapitalOverhaul: '是', currentReviewer: '项目办·刘工', reviewStatus: 'dept_review', prelimStatus: 'pending' },
  { id: 'pre-04', planName: '连铸二冷水水质在线监测仪表购置立项', projectMajorType: '零固', businessDivision: '炼钢厂', projectCategory: '设备更新', planYear: '2026', budgetAmount: 68, benefit: 12, projectManager: '赵芳', applicant: '赵芳', isInPlanProject: '否', implementDept: '自动化部', startDate: '2026-06', endDate: '2026-09', currentReviewer: '项目办·刘工', reviewStatus: 'dept_review', prelimStatus: 'pending' },
  { id: 'pre-05', planName: '冷轧酸再生车间危废暂存库新建立项', projectMajorType: '新建', businessDivision: '冷轧厂', projectCategory: '安全环保', planYear: '2027', budgetAmount: 540, benefit: 0, projectManager: '孙丽', applicant: '孙丽', isInPlanProject: '是', annualPlanNo: 'NDJH-2027-006', implementDept: '安全环保部', startDate: '2027-02', endDate: '2027-10', currentReviewer: '项目办·陈工', reviewStatus: 'dept_review', prelimStatus: 'pending' },
  { id: 'pre-06', planName: '热轧加热炉节能烧嘴改造立项', projectMajorType: '技改', businessDivision: '热轧厂', projectCategory: '节能减排', planYear: '2026', budgetAmount: 760, benefit: 310, projectManager: '周涛', applicant: '周涛', isInPlanProject: '否', implementDept: '能源管理部', startDate: '2026-07', endDate: '2027-01', currentReviewer: '项目办·陈工', reviewStatus: 'dept_review', prelimStatus: 'pending' },
  { id: 'pre-07', planName: '动力厂循环水泵组营缮立项', projectMajorType: '营缮', businessDivision: '动力厂', projectCategory: '设备营缮', planYear: '2026', budgetAmount: 195, benefit: 45, projectManager: '吴晓燕', applicant: '吴晓燕', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-031', implementDept: '动力厂', startDate: '2026-08', endDate: '2026-10', isCapitalOverhaul: '否', currentReviewer: '项目办·刘工', reviewStatus: 'dept_review', prelimStatus: 'pending' },
  { id: 'pre-08', planName: '物流厂轨道衡检定标准器购置立项', projectMajorType: '零固', businessDivision: '物流厂', projectCategory: '基础设施', planYear: '2026', budgetAmount: 36, benefit: 8, projectManager: '陈建华', applicant: '陈建华', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-044', implementDept: '计量中心', startDate: '2026-09', endDate: '2026-11', currentReviewer: '项目办·刘工', reviewStatus: 'dept_review', prelimStatus: 'pending' },

  // 已退回 6
  { id: 'pre-11', planName: '第二炼钢厂废钢加工线新建立项', projectMajorType: '新建', businessDivision: '炼钢厂', projectCategory: '产能扩张', planYear: '2026', budgetAmount: 3200, benefit: 680, projectManager: '张伟', applicant: '张伟', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-008', implementDept: '工程管理部', startDate: '2026-04', endDate: '2027-06', currentReviewer: '项目办·陈工', reviewStatus: 'returned', prelimStatus: 'returned', cancelReason: '可研深度不足，请补充占地与外部条件说明后重新报送' },
  { id: 'pre-12', planName: '高炉煤气余压发电增容技改立项', projectMajorType: '技改', businessDivision: '动力厂', projectCategory: '节能减排', planYear: '2026', budgetAmount: 1450, benefit: 410, projectManager: '李明', applicant: '李明', isInPlanProject: '否', implementDept: '能源管理部', startDate: '2026-05', endDate: '2026-12', currentReviewer: '项目办·陈工', reviewStatus: 'returned', prelimStatus: 'returned', cancelReason: '效益测算口径与财务部不一致，请按统一模板重算' },
  { id: 'pre-13', planName: '烧结环冷机台车营缮立项', projectMajorType: '营缮', businessDivision: '原料厂', projectCategory: '设备营缮', planYear: '2026', budgetAmount: 310, benefit: 52, projectManager: '王强', applicant: '王强', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-022', implementDept: '设备管理部', startDate: '2026-06', endDate: '2026-09', isCapitalOverhaul: '是', currentReviewer: '项目办·刘工', reviewStatus: 'returned', prelimStatus: 'returned', cancelReason: '营缮范围与档案配置附件清单不一致，请补齐必填资料' },
  { id: 'pre-14', planName: '冷轧平整机液压伺服阀组更新立项', projectMajorType: '零固', businessDivision: '冷轧厂', projectCategory: '设备更新', planYear: '2026', budgetAmount: 88, benefit: 26, projectManager: '赵芳', applicant: '赵芳', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-027', implementDept: '设备管理部', startDate: '2026-07', endDate: '2026-10', currentReviewer: '项目办·刘工', reviewStatus: 'returned', prelimStatus: 'returned', cancelReason: '请补充备件国产化论证及库存数量说明' },
  { id: 'pre-15', planName: '热轧精轧区屋顶防水及采光带新建立项', projectMajorType: '新建', businessDivision: '热轧厂', projectCategory: '土建工程', planYear: '2027', budgetAmount: 260, benefit: 0, projectManager: '孙丽', applicant: '孙丽', isInPlanProject: '否', implementDept: '工程管理部', startDate: '2027-03', endDate: '2027-08', currentReviewer: '项目办·陈工', reviewStatus: 'returned', prelimStatus: 'returned', cancelReason: '请明确是否占用年度计划额度并补充计划号' },
  { id: 'pre-16', planName: '原料场皮带通廊智能化改造立项', projectMajorType: '技改', businessDivision: '物流厂', projectCategory: '智能化改造', planYear: '2026', budgetAmount: 510, benefit: 90, projectManager: '周涛', applicant: '周涛', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-035', implementDept: '信息化部', startDate: '2026-08', endDate: '2027-02', currentReviewer: '项目办·陈工', reviewStatus: 'returned', prelimStatus: 'returned', cancelReason: '请补充网络安全等保要求及运维责任单位' },

  // 已驳回 6（上个状态均为待初审）
  { id: 'pre-21', planName: '建材厂石灰窑扩容新建立项', projectMajorType: '新建', businessDivision: '建材厂', projectCategory: '产能扩张', planYear: '2026', budgetAmount: 4100, benefit: 520, projectManager: '张伟', applicant: '张伟', isInPlanProject: '否', implementDept: '工程管理部', startDate: '2026-03', endDate: '2027-12', currentReviewer: '项目办·陈工', reviewStatus: 'rejected', prelimStatus: 'rejected', prevPrelimStatus: 'pending', cancelReason: '超出公司产能规划，本年不予立项' },
  { id: 'pre-22', planName: '高炉喷煤系统扩容技改立项', projectMajorType: '技改', businessDivision: '炼铁厂', projectCategory: '工艺改造', planYear: '2026', budgetAmount: 1280, benefit: 180, projectManager: '李明', applicant: '李明', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-009', implementDept: '炼铁厂', startDate: '2026-04', endDate: '2026-12', currentReviewer: '项目办·陈工', reviewStatus: 'rejected', prelimStatus: 'rejected', prevPrelimStatus: 'pending', cancelReason: '与在建喷煤技改项目范围重叠，予以驳回' },
  { id: 'pre-23', planName: '转炉氧枪升降装置营缮立项', projectMajorType: '营缮', businessDivision: '炼钢厂', projectCategory: '设备营缮', planYear: '2026', budgetAmount: 175, benefit: 30, projectManager: '王强', applicant: '王强', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-019', implementDept: '设备管理部', startDate: '2026-05', endDate: '2026-07', isCapitalOverhaul: '否', currentReviewer: '项目办·刘工', reviewStatus: 'rejected', prelimStatus: 'rejected', prevPrelimStatus: 'pending', cancelReason: '费用应纳入日常检修预算，不按立项办理' },
  { id: 'pre-24', planName: '实验室光谱仪更新购置立项', projectMajorType: '零固', businessDivision: '热轧厂', projectCategory: '设备更新', planYear: '2026', budgetAmount: 125, benefit: 18, projectManager: '赵芳', applicant: '赵芳', isInPlanProject: '否', implementDept: '科技质量部', startDate: '2026-06', endDate: '2026-08', currentReviewer: '项目办·刘工', reviewStatus: 'rejected', prelimStatus: 'rejected', prevPrelimStatus: 'pending', cancelReason: '现有设备仍在计量有效期内，暂不批准更新' },
  { id: 'pre-25', planName: '厂区雨水收集回用站新建立项', projectMajorType: '新建', businessDivision: '动力厂', projectCategory: '安全环保', planYear: '2027', budgetAmount: 890, benefit: 60, projectManager: '孙丽', applicant: '孙丽', isInPlanProject: '是', annualPlanNo: 'NDJH-2027-011', implementDept: '安全环保部', startDate: '2027-01', endDate: '2027-09', currentReviewer: '项目办·陈工', reviewStatus: 'rejected', prelimStatus: 'rejected', prevPrelimStatus: 'pending', cancelReason: '与园区统一雨水管网规划冲突，驳回' },
  { id: 'pre-26', planName: '冷轧镀锌线张力辊智能化改造立项', projectMajorType: '技改', businessDivision: '冷轧厂', projectCategory: '智能化改造', planYear: '2026', budgetAmount: 640, benefit: 145, projectManager: '周涛', applicant: '周涛', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-028', implementDept: '冷轧厂', startDate: '2026-09', endDate: '2027-03', currentReviewer: '项目办·陈工', reviewStatus: 'rejected', prelimStatus: 'rejected', prevPrelimStatus: 'pending', cancelReason: '技术方案未经专业部门预审，予以驳回' },

  // 初审通过 6
  { id: 'pre-31', planName: '特钢连铸机二冷段封闭罩新建立项', projectMajorType: '新建', businessDivision: '炼钢厂', projectCategory: '安全环保', planYear: '2026', budgetAmount: 370, benefit: 42, projectManager: '张伟', applicant: '张伟', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-015', implementDept: '工程管理部', startDate: '2026-03', endDate: '2026-10', currentReviewer: '项目办·陈工', reviewStatus: 'pending_joint', prelimStatus: 'passed' },
  { id: 'pre-32', planName: '高炉冲渣水余热回收技改立项', projectMajorType: '技改', businessDivision: '炼铁厂', projectCategory: '节能减排', planYear: '2026', budgetAmount: 920, benefit: 268, projectManager: '李明', applicant: '李明', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-016', implementDept: '能源管理部', startDate: '2026-04', endDate: '2026-12', currentReviewer: '项目办·陈工', reviewStatus: 'pending_joint', prelimStatus: 'passed' },
  { id: 'pre-33', planName: '热轧卷取机液压系统营缮立项', projectMajorType: '营缮', businessDivision: '热轧厂', projectCategory: '设备营缮', planYear: '2026', budgetAmount: 240, benefit: 55, projectManager: '王强', applicant: '王强', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-021', implementDept: '设备管理部', startDate: '2026-05', endDate: '2026-08', isCapitalOverhaul: '是', currentReviewer: '项目办·刘工', reviewStatus: 'pending_joint', prelimStatus: 'passed' },
  { id: 'pre-34', planName: '能源计量远程抄表终端购置立项', projectMajorType: '零固', businessDivision: '动力厂', projectCategory: '信息化建设', planYear: '2026', budgetAmount: 52, benefit: 19, projectManager: '赵芳', applicant: '赵芳', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-033', implementDept: '信息化部', startDate: '2026-06', endDate: '2026-09', currentReviewer: '项目办·刘工', reviewStatus: 'pending_joint', prelimStatus: 'passed' },
  { id: 'pre-35', planName: '原料码头皮带通廊封闭新建立项', projectMajorType: '新建', businessDivision: '原料厂', projectCategory: '环保改造', planYear: '2027', budgetAmount: 1180, benefit: 96, projectManager: '孙丽', applicant: '孙丽', isInPlanProject: '否', implementDept: '工程管理部', startDate: '2027-02', endDate: '2027-11', currentReviewer: '项目办·陈工', reviewStatus: 'pending_joint', prelimStatus: 'passed' },
  { id: 'pre-36', planName: '冷轧酸洗线废酸回收系统技改立项', projectMajorType: '技改', businessDivision: '冷轧厂', projectCategory: '环保改造', planYear: '2026', budgetAmount: 830, benefit: 210, projectManager: '周涛', applicant: '周涛', isInPlanProject: '是', annualPlanNo: 'NDJH-2026-029', implementDept: '安全环保部', startDate: '2026-07', endDate: '2027-01', currentReviewer: '项目办·陈工', reviewStatus: 'pending_joint', prelimStatus: 'passed' },
];

function toRecord(s: (typeof SEED)[number], index: number): InitPrelimRecord {
  const linkPool: Record<ProjectMajorType, string[]> = {
    新建: ['xj1', 'xj2', 'tg1'],
    技改: ['2', '11', '13'],
    营缮: ['1', 'oh3', 'oh4'],
    零固: ['mn1', 'mn2', 'mn3'],
  };
  const pool = linkPool[s.projectMajorType];
  const linkedPlanId = pool[index % pool.length];

  const base = withInvestmentEstimateFields(withPaymentPlans(withInitiationDetailFields({
    id: s.id,
    planYear: s.planYear || '2026',
    businessDivision: s.businessDivision || '炼铁厂',
    projectMajorType: s.projectMajorType,
    projectCategory: s.projectCategory || '工艺改造',
    planName: s.planName,
    budgetAmount: s.budgetAmount || 100,
    benefit: s.benefit ?? 0,
    year1Payment: Math.round((s.budgetAmount || 100) * 0.4 * 100) / 100,
    year2Payment: Math.round((s.budgetAmount || 100) * 0.4 * 100) / 100,
    year3Payment: Math.round((s.budgetAmount || 100) * 0.2 * 100) / 100,
    projectManager: s.projectManager || '张伟',
    projectManagerPhone: '1380000' + String(1000 + index).slice(-4),
    currentReviewer: s.currentReviewer || '项目办·陈工',
    latestStage: s.prelimStatus === 'passed' ? '初审通过' : s.prelimStatus === 'returned' ? '已退回' : s.prelimStatus === 'rejected' ? '已驳回' : '待初审',
    reviewStatus: s.reviewStatus || 'dept_review',
    applicant: s.applicant || s.projectManager || '张伟',
    startDate: s.startDate || '2026-04',
    endDate: s.endDate || '2026-12',
    isInPlanProject: s.isInPlanProject || '否',
    annualPlanNo: s.annualPlanNo || '',
    annualPlanId: s.annualPlanNo ? `ap_${s.id}` : '',
    implementDept: s.implementDept || '工程管理部',
    isCapitalOverhaul: s.isCapitalOverhaul,
    createdAt: '2026-01-08',
    updatedAt: '2026-03-12',
  } as ProjectPlan)));

  return {
    ...base,
    prelimStatus: s.prelimStatus,
    prevPrelimStatus: s.prevPrelimStatus,
    cancelReason: s.cancelReason,
    linkedPlanId,
  };
}

export const initPrelimRecords: InitPrelimRecord[] = SEED.map(toRecord);

export const prelimYears = ['2026', '2027'];
export const prelimMajorTypes: ProjectMajorType[] = ['新建', '技改', '营缮', '零固'];
export const prelimUnits = ['炼铁厂', '炼钢厂', '热轧厂', '冷轧厂', '原料厂', '动力厂', '建材厂', '物流厂'];
export const prelimCategories = [
  '环保改造', '节能减排', '设备营缮', '设备更新', '安全环保',
  '智能化改造', '产能扩张', '工艺改造', '土建工程', '信息化建设', '基础设施',
];
