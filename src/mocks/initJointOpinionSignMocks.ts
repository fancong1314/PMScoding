/** 项目立项会审 · 会审意见签署演示数据 */

export type JointOpinionSignTab = 'pending' | 'signed';
export type JointOpinionPassResult = '通过' | '不通过' | '';

export interface JointOpinionAttachmentFile {
  id: string;
  name: string;
  size: number;
}

export interface JointOpinionSignRecord {
  id: string;
  linkedPlanId: string;
  planName: string;
  planYear: string;
  projectMajorType: '新建' | '技改' | '营缮' | '零固';
  projectCategory: string;
  budgetAmount: number;
  benefit: number;
  applicant: string;
  submitUnit: string;
  /** 会审意见截至时间 YYYY-MM-DD HH:mm */
  opinionDeadline: string;
  status: JointOpinionSignTab;
  /** 已签署结果 */
  passResult: JointOpinionPassResult;
  signTime: string;
  signer: string;
  reviewTime: string;
  reviewers: string;
  opinion: string;
  attachments: JointOpinionAttachmentFile[];
}

export const JOINT_OPINION_SIGN_STORAGE_KEY = 'ng_init_joint_opinion_sign_v2';

/** 是否已超过会审意见截至时间 */
export function isOpinionDeadlineExpired(deadline: string, now = new Date()): boolean {
  if (!deadline?.trim()) return false;
  const normalized = deadline.includes('T') ? deadline : deadline.replace(' ', 'T');
  const t = new Date(normalized).getTime();
  if (Number.isNaN(t)) return false;
  return now.getTime() > t;
}

export const jointOpinionSignRecords: JointOpinionSignRecord[] = [
  // —— 待签署（含未到期 / 已超期）——
  {
    id: 'jos-p1',
    linkedPlanId: 'jos-p1',
    planName: '热轧加热炉节能改造项目',
    planYear: '2027',
    projectMajorType: '技改',
    projectCategory: '节能降耗',
    budgetAmount: 1680.0,
    benefit: 320.0,
    applicant: '王强',
    submitUnit: '热轧事业部',
    opinionDeadline: '2026-12-31 18:00',
    status: 'pending',
    passResult: '',
    signTime: '',
    signer: '',
    reviewTime: '',
    reviewers: '',
    opinion: '',
    attachments: [],
  },
  {
    id: 'jos-p2',
    linkedPlanId: 'jos-p2',
    planName: '原料场封闭抑尘系统新建计划',
    planYear: '2027',
    projectMajorType: '新建',
    projectCategory: '环保工程',
    budgetAmount: 2450.5,
    benefit: 180.0,
    applicant: '李明',
    submitUnit: '原料事业部',
    opinionDeadline: '2026-11-15 17:30',
    status: 'pending',
    passResult: '',
    signTime: '',
    signer: '',
    reviewTime: '',
    reviewers: '',
    opinion: '',
    attachments: [],
  },
  {
    id: 'jos-p3',
    linkedPlanId: 'jos-p3',
    planName: '炼钢连铸机扇形段大修计划',
    planYear: '2026',
    projectMajorType: '营缮',
    projectCategory: '设备营缮',
    budgetAmount: 860.0,
    benefit: 95.0,
    applicant: '陈刚',
    submitUnit: '炼钢事业部',
    opinionDeadline: '2026-10-20 12:00',
    status: 'pending',
    passResult: '',
    signTime: '',
    signer: '',
    reviewTime: '',
    reviewers: '',
    opinion: '',
    attachments: [],
  },
  {
    id: 'jos-p4',
    linkedPlanId: 'jos-p4',
    planName: '金宇检测中心智能仪器零固更新',
    planYear: '2026',
    projectMajorType: '零固',
    projectCategory: '设备更新',
    budgetAmount: 350.0,
    benefit: 42.0,
    applicant: '孙丽',
    submitUnit: '金宇智能检测公司',
    opinionDeadline: '2026-09-01 14:11',
    status: 'pending',
    passResult: '',
    signTime: '',
    signer: '',
    reviewTime: '',
    reviewers: '',
    opinion: '',
    attachments: [],
  },
  {
    id: 'jos-p5',
    linkedPlanId: 'jos-p5',
    planName: '动力厂循环水泵组更新计划',
    planYear: '2027',
    projectMajorType: '零固',
    projectCategory: '电力工程',
    budgetAmount: 128.0,
    benefit: 22.0,
    applicant: '周涛',
    submitUnit: '动力事业部',
    opinionDeadline: '2026-08-20 09:00',
    status: 'pending',
    passResult: '',
    signTime: '',
    signer: '',
    reviewTime: '',
    reviewers: '',
    opinion: '',
    attachments: [],
  },
  {
    id: 'jos-p6',
    linkedPlanId: 'jos-p6',
    planName: '冷轧酸洗线自动化升级技改',
    planYear: '2027',
    projectMajorType: '技改',
    projectCategory: '信息化建设',
    budgetAmount: 980.0,
    benefit: 210.0,
    applicant: '吴晓燕',
    submitUnit: '冷轧事业部',
    opinionDeadline: '2026-12-10 16:00',
    status: 'pending',
    passResult: '',
    signTime: '',
    signer: '',
    reviewTime: '',
    reviewers: '',
    opinion: '',
    attachments: [],
  },
  {
    id: 'jos-p7',
    linkedPlanId: 'jos-p7',
    planName: '烧结机头电除尘器改造计划',
    planYear: '2026',
    projectMajorType: '技改',
    projectCategory: '安全改造',
    budgetAmount: 560.0,
    benefit: 88.0,
    applicant: '赵军',
    submitUnit: '炼铁事业部',
    opinionDeadline: '2026-07-15 11:00',
    status: 'pending',
    passResult: '',
    signTime: '',
    signer: '',
    reviewTime: '',
    reviewers: '',
    opinion: '',
    attachments: [],
  },
  // —— 已签署（通过 / 不通过）——
  {
    id: 'jos-s1',
    linkedPlanId: 'jos-s1',
    planName: '高炉喷煤系统优化技改计划',
    planYear: '2026',
    projectMajorType: '技改',
    projectCategory: '工艺优化',
    budgetAmount: 720.0,
    benefit: 150.0,
    applicant: '王强',
    submitUnit: '炼铁事业部',
    opinionDeadline: '2026-06-30 17:00',
    status: 'signed',
    passResult: '通过',
    signTime: '2026-06-28 10:20',
    signer: '超级管理员',
    reviewTime: '2026-06-25 14:00',
    reviewers: '张工、李工、王工',
    opinion: '方案可行，投资与效益匹配，同意按计划推进。',
    attachments: [
      { id: 'af1', name: '会审意见论证文件.pdf', size: 1024 * 820 },
    ],
  },
  {
    id: 'jos-s2',
    linkedPlanId: 'jos-s2',
    planName: '码头卸船机大修专项计划',
    planYear: '2026',
    projectMajorType: '营缮',
    projectCategory: '设备营缮',
    budgetAmount: 430.0,
    benefit: 60.0,
    applicant: '周涛',
    submitUnit: '物流事业部',
    opinionDeadline: '2026-05-20 18:00',
    status: 'signed',
    passResult: '通过',
    signTime: '2026-05-18 09:45',
    signer: '超级管理员',
    reviewTime: '2026-05-16 15:30',
    reviewers: '刘工、陈工',
    opinion: '营缮范围清晰，建议纳入年度优先实施清单。',
    attachments: [
      { id: 'af2', name: '营缮会审纪要.docx', size: 1024 * 256 },
    ],
  },
  {
    id: 'jos-s3',
    linkedPlanId: 'jos-s3',
    planName: '建材线粉尘治理新建工程',
    planYear: '2027',
    projectMajorType: '新建',
    projectCategory: '环保工程',
    budgetAmount: 1180.0,
    benefit: 90.0,
    applicant: '钱建国',
    submitUnit: '建材事业部',
    opinionDeadline: '2026-08-10 12:00',
    status: 'signed',
    passResult: '不通过',
    signTime: '2026-08-08 16:10',
    signer: '超级管理员',
    reviewTime: '2026-08-07 10:00',
    reviewers: '环保部会审组',
    opinion: '投资匡算偏高，需补充多方案比选后再报。',
    attachments: [],
  },
  {
    id: 'jos-s4',
    linkedPlanId: 'jos-s4',
    planName: '配电室智能巡检终端零固购置',
    planYear: '2026',
    projectMajorType: '零固',
    projectCategory: '信息化建设',
    budgetAmount: 86.0,
    benefit: 18.0,
    applicant: '孙丽',
    submitUnit: '动力事业部',
    opinionDeadline: '2026-09-05 17:00',
    status: 'signed',
    passResult: '通过',
    signTime: '2026-09-03 11:05',
    signer: '超级管理员',
    reviewTime: '2026-09-02 09:30',
    reviewers: '动力专业会审',
    opinion: '设备选型合理，同意签署通过。',
    attachments: [
      { id: 'af3', name: '选型论证表.xlsx', size: 1024 * 120 },
    ],
  },
  {
    id: 'jos-s5',
    linkedPlanId: 'jos-s5',
    planName: '连铸结晶器铜板更新计划',
    planYear: '2027',
    projectMajorType: '零固',
    projectCategory: '设备更新',
    budgetAmount: 195.0,
    benefit: 35.0,
    applicant: '陈刚',
    submitUnit: '炼钢事业部',
    opinionDeadline: '2026-07-01 18:00',
    status: 'signed',
    passResult: '不通过',
    signTime: '2026-06-29 14:40',
    signer: '超级管理员',
    reviewTime: '2026-06-28 13:20',
    reviewers: '设备部、炼钢事业部',
    opinion: '库存备件尚可周转，建议延期至下一年度申报。',
    attachments: [],
  },
  {
    id: 'jos-s6',
    linkedPlanId: 'jos-s6',
    planName: '能源管理系统二期扩建计划',
    planYear: '2027',
    projectMajorType: '新建',
    projectCategory: '信息化建设',
    budgetAmount: 650.0,
    benefit: 200.0,
    applicant: '孙丽',
    submitUnit: '信息部',
    opinionDeadline: '2026-10-01 18:00',
    status: 'signed',
    passResult: '通过',
    signTime: '2026-09-01 15:00',
    signer: '超级管理员',
    reviewTime: '2026-08-30 10:00',
    reviewers: '信息部、能源中心',
    opinion: '与一期平台衔接清晰，同意通过。',
    attachments: [
      { id: 'af4', name: '二期论证报告.pdf', size: 1024 * 1500 },
    ],
  },
];
