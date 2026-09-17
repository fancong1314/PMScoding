/** 年度付款计划报表 — 由各计划「付款计划」汇总生成财务月度付款表 */

export interface PlanPaymentItem {
  /** YYYY-MM */
  paymentMonth: string;
  amount: number;
  paymentType: string;
  remark?: string;
}

export interface PlanPaymentSource {
  id: string;
  planNo: string;
  planName: string;
  /** 计划申报年度 */
  planYear: string;
  projectMajorCategory: string;
  projectType: string;
  businessUnit: string;
  budget: number;
  payments: PlanPaymentItem[];
}

export const paymentReportYears = ['2025', '2026', '2027'];
export const paymentReportMajorCategories = ['新建', '技改', '零固', '营缮'];
export const paymentReportUnits = [
  '炼铁事业部', '炼钢事业部', '热轧事业部', '冷轧事业部', '特钢事业部',
  '动力事业部', '原料事业部', '物流事业部', '工程技术部',
];

export const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

/**
 * 演示数据：多项目、跨年付款计划，覆盖 2025–2027，便于按付款年度切表。
 * 金额单位：万元。
 */
export const planPaymentSources: PlanPaymentSource[] = [
  {
    id: 'pps-01', planNo: 'JH-2026-DX-001', planName: '3号高炉炉体大修及配套设备更新改造工程',
    planYear: '2026', projectMajorCategory: '营缮', projectType: '设备营缮',
    businessUnit: '炼铁事业部', budget: 850,
    payments: [
      { paymentMonth: '2026-03', amount: 120, paymentType: '预付款' },
      { paymentMonth: '2026-06', amount: 220, paymentType: '进度款' },
      { paymentMonth: '2026-09', amount: 280, paymentType: '进度款' },
      { paymentMonth: '2026-12', amount: 150, paymentType: '尾款' },
      { paymentMonth: '2027-03', amount: 80, paymentType: '质保金' },
    ],
  },
  {
    id: 'pps-02', planNo: 'JH-2026-TG-008', planName: '烧结机头烟气脱硫脱硝系统升级改造',
    planYear: '2026', projectMajorCategory: '技改', projectType: '环保改造',
    businessUnit: '原料事业部', budget: 420,
    payments: [
      { paymentMonth: '2026-04', amount: 80, paymentType: '预付款' },
      { paymentMonth: '2026-07', amount: 150, paymentType: '进度款' },
      { paymentMonth: '2026-10', amount: 120, paymentType: '进度款' },
      { paymentMonth: '2027-01', amount: 70, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-03', planNo: 'JH-2026-XJ-018', planName: '企业级能源管理系统（EMS）平台建设项目',
    planYear: '2026', projectMajorCategory: '新建', projectType: '信息化建设',
    businessUnit: '动力事业部', budget: 550,
    payments: [
      { paymentMonth: '2026-02', amount: 100, paymentType: '预付款' },
      { paymentMonth: '2026-05', amount: 180, paymentType: '进度款' },
      { paymentMonth: '2026-08', amount: 160, paymentType: '进度款' },
      { paymentMonth: '2026-11', amount: 110, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-04', planNo: 'JH-2026-TG-021', planName: '冷轧酸洗段废水零排放技改',
    planYear: '2026', projectMajorCategory: '技改', projectType: '环保改造',
    businessUnit: '冷轧事业部', budget: 680,
    payments: [
      { paymentMonth: '2026-03', amount: 100, paymentType: '预付款' },
      { paymentMonth: '2026-06', amount: 200, paymentType: '进度款' },
      { paymentMonth: '2026-09', amount: 220, paymentType: '进度款' },
      { paymentMonth: '2026-12', amount: 160, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-05', planNo: 'JH-2026-LG-015', planName: '循环水泵房变频器更新',
    planYear: '2026', projectMajorCategory: '零固', projectType: '电力工程',
    businessUnit: '动力事业部', budget: 72,
    payments: [
      { paymentMonth: '2026-04', amount: 40, paymentType: '设备款' },
      { paymentMonth: '2026-06', amount: 32, paymentType: '安装尾款' },
    ],
  },
  {
    id: 'pps-06', planNo: 'JH-2026-DX-014', planName: '烧结机台车及密封系统大修工程',
    planYear: '2026', projectMajorCategory: '营缮', projectType: '设备营缮',
    businessUnit: '原料事业部', budget: 540,
    payments: [
      { paymentMonth: '2026-10', amount: 180, paymentType: '预付款' },
      { paymentMonth: '2026-12', amount: 200, paymentType: '进度款' },
      { paymentMonth: '2027-02', amount: 160, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-07', planNo: 'JH-2026-XJ-025', planName: '热轧厂区雨水收集与回用站新建工程',
    planYear: '2026', projectMajorCategory: '新建', projectType: '环保改造',
    businessUnit: '热轧事业部', budget: 245,
    payments: [
      { paymentMonth: '2026-05', amount: 80, paymentType: '预付款' },
      { paymentMonth: '2026-08', amount: 100, paymentType: '进度款' },
      { paymentMonth: '2026-11', amount: 65, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-08', planNo: 'JH-2026-TG-033', planName: '酸轧段板形闭环控制技改项目',
    planYear: '2026', projectMajorCategory: '技改', projectType: '工艺改造',
    businessUnit: '冷轧事业部', budget: 210,
    payments: [
      { paymentMonth: '2026-06', amount: 90, paymentType: '预付款' },
      { paymentMonth: '2026-09', amount: 80, paymentType: '进度款' },
      { paymentMonth: '2026-11', amount: 40, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-09', planNo: 'JH-2026-XJ-030', planName: '原料码头堆场智能化地磅站新建',
    planYear: '2026', projectMajorCategory: '新建', projectType: '土建工程',
    businessUnit: '物流事业部', budget: 168,
    payments: [
      { paymentMonth: '2026-05', amount: 50, paymentType: '预付款' },
      { paymentMonth: '2026-08', amount: 70, paymentType: '进度款' },
      { paymentMonth: '2026-10', amount: 48, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-10', planNo: 'JH-2026-TG-040', planName: '原料场堆取料机无人化改造及智能调度系统建设',
    planYear: '2026', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '原料事业部', budget: 650,
    payments: [
      { paymentMonth: '2026-05', amount: 130, paymentType: '预付款' },
      { paymentMonth: '2026-08', amount: 180, paymentType: '进度款' },
      { paymentMonth: '2026-11', amount: 200, paymentType: '进度款' },
      { paymentMonth: '2027-04', amount: 140, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-11', planNo: 'JH-2025-DX-008', planName: '热轧加热炉蓄热式烧嘴大修',
    planYear: '2025', projectMajorCategory: '营缮', projectType: '设备营缮',
    businessUnit: '热轧事业部', budget: 460,
    payments: [
      { paymentMonth: '2025-08', amount: 150, paymentType: '预付款' },
      { paymentMonth: '2025-11', amount: 180, paymentType: '进度款' },
      { paymentMonth: '2026-01', amount: 130, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-12', planNo: 'JH-2025-TG-001', planName: '炼钢连铸机结晶器液面控制系统升级',
    planYear: '2025', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '炼钢事业部', budget: 310,
    payments: [
      { paymentMonth: '2025-06', amount: 100, paymentType: '预付款' },
      { paymentMonth: '2025-09', amount: 120, paymentType: '进度款' },
      { paymentMonth: '2025-12', amount: 90, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-13', planNo: 'JH-2027-DX-002', planName: '35kV主变压器及附属系统大修',
    planYear: '2027', projectMajorCategory: '营缮', projectType: '电力工程',
    businessUnit: '动力事业部', budget: 680,
    payments: [
      { paymentMonth: '2027-02', amount: 200, paymentType: '预付款' },
      { paymentMonth: '2027-04', amount: 280, paymentType: '进度款' },
      { paymentMonth: '2027-06', amount: 200, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-14', planNo: 'JH-2027-XJ-005', planName: '原料场智能堆取料系统新建',
    planYear: '2027', projectMajorCategory: '新建', projectType: '土建工程',
    businessUnit: '原料事业部', budget: 860,
    payments: [
      { paymentMonth: '2027-04', amount: 220, paymentType: '预付款' },
      { paymentMonth: '2027-07', amount: 320, paymentType: '进度款' },
      { paymentMonth: '2027-10', amount: 320, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-15', planNo: 'JH-2026-LG-009', planName: '精轧机液压伺服阀组零星更新',
    planYear: '2026', projectMajorCategory: '零固', projectType: '设备更新',
    businessUnit: '热轧事业部', budget: 56,
    payments: [
      { paymentMonth: '2026-04', amount: 56, paymentType: '设备款' },
    ],
  },
  {
    id: 'pps-16', planNo: 'JH-2025-XJ-012', planName: '特钢精炼炉区域除尘系统新建工程',
    planYear: '2025', projectMajorCategory: '新建', projectType: '环保改造',
    businessUnit: '特钢事业部', budget: 390,
    payments: [
      { paymentMonth: '2025-03', amount: 90, paymentType: '预付款' },
      { paymentMonth: '2025-07', amount: 160, paymentType: '进度款' },
      { paymentMonth: '2025-11', amount: 140, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-17', planNo: 'JH-2025-LG-006', planName: '高炉煤气管道阀门组零星更换',
    planYear: '2025', projectMajorCategory: '零固', projectType: '设备更新',
    businessUnit: '炼铁事业部', budget: 48,
    payments: [
      { paymentMonth: '2025-05', amount: 28, paymentType: '设备款' },
      { paymentMonth: '2025-08', amount: 20, paymentType: '安装尾款' },
    ],
  },
  {
    id: 'pps-18', planNo: 'JH-2025-TG-019', planName: '冷轧平整机液压系统升级技改',
    planYear: '2025', projectMajorCategory: '技改', projectType: '工艺改造',
    businessUnit: '冷轧事业部', budget: 275,
    payments: [
      { paymentMonth: '2025-04', amount: 80, paymentType: '预付款' },
      { paymentMonth: '2025-08', amount: 110, paymentType: '进度款' },
      { paymentMonth: '2025-12', amount: 85, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-19', planNo: 'JH-2025-DX-021', planName: '转炉汽化冷却系统大修工程',
    planYear: '2025', projectMajorCategory: '营缮', projectType: '设备营缮',
    businessUnit: '炼钢事业部', budget: 520,
    payments: [
      { paymentMonth: '2025-02', amount: 150, paymentType: '预付款' },
      { paymentMonth: '2025-06', amount: 200, paymentType: '进度款' },
      { paymentMonth: '2025-10', amount: 170, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-20', planNo: 'JH-2025-XJ-028', planName: '厂区综合管廊一期新建工程',
    planYear: '2025', projectMajorCategory: '新建', projectType: '土建工程',
    businessUnit: '工程技术部', budget: 980,
    payments: [
      { paymentMonth: '2025-01', amount: 200, paymentType: '预付款' },
      { paymentMonth: '2025-05', amount: 280, paymentType: '进度款' },
      { paymentMonth: '2025-09', amount: 300, paymentType: '进度款' },
      { paymentMonth: '2025-12', amount: 200, paymentType: '尾款' },
    ],
  },
  {
    id: 'pps-21', planNo: 'JH-2027-LG-003', planName: '轧线编码器及测厚仪零星更新',
    planYear: '2027', projectMajorCategory: '零固', projectType: '设备更新',
    businessUnit: '热轧事业部', budget: 62,
    payments: [
      { paymentMonth: '2027-03', amount: 62, paymentType: '设备款' },
    ],
  },
  {
    id: 'pps-22', planNo: 'JH-2027-TG-011', planName: '炼铁高炉专家系统智能化技改',
    planYear: '2027', projectMajorCategory: '技改', projectType: '智能化改造',
    businessUnit: '炼铁事业部', budget: 430,
    payments: [
      { paymentMonth: '2027-01', amount: 100, paymentType: '预付款' },
      { paymentMonth: '2027-05', amount: 180, paymentType: '进度款' },
      { paymentMonth: '2027-09', amount: 150, paymentType: '尾款' },
    ],
  },
];

export interface MonthProjectDetail {
  planId: string;
  planNo: string;
  planName: string;
  businessUnit: string;
  projectMajorCategory: string;
  paymentType: string;
  amount: number;
}

export interface ProjectYearRow {
  source: PlanPaymentSource;
  /** index 0..11 = 1月..12月 */
  months: number[];
  rowTotal: number;
}

/** 将付款计划汇总为指定付款年度的「项目 × 月」矩阵 */
export function buildPaymentMatrix(
  sources: PlanPaymentSource[],
  paymentYear: string
): { rows: ProjectYearRow[]; monthTotals: number[]; yearTotal: number } {
  const rows: ProjectYearRow[] = [];
  const monthTotals = Array(12).fill(0);

  sources.forEach((src) => {
    const months = Array(12).fill(0);
    let has = false;
    src.payments.forEach((p) => {
      if (!p.paymentMonth.startsWith(`${paymentYear}-`)) return;
      const m = Number(p.paymentMonth.slice(5, 7));
      if (m < 1 || m > 12 || !p.amount) return;
      months[m - 1] += p.amount;
      monthTotals[m - 1] += p.amount;
      has = true;
    });
    if (!has) return;
    const rowTotal = months.reduce((s, v) => s + v, 0);
    rows.push({ source: src, months, rowTotal });
  });

  rows.sort((a, b) => b.rowTotal - a.rowTotal);
  const yearTotal = monthTotals.reduce((s, v) => s + v, 0);
  return { rows, monthTotals, yearTotal };
}

/** 某月各项目付款明细（财务下钻） */
export function getMonthDetails(
  sources: PlanPaymentSource[],
  paymentYear: string,
  monthIndex: number
): MonthProjectDetail[] {
  const mm = String(monthIndex + 1).padStart(2, '0');
  const key = `${paymentYear}-${mm}`;
  const list: MonthProjectDetail[] = [];
  sources.forEach((src) => {
    src.payments.forEach((p) => {
      if (p.paymentMonth !== key || !p.amount) return;
      list.push({
        planId: src.id,
        planNo: src.planNo,
        planName: src.planName,
        businessUnit: src.businessUnit,
        projectMajorCategory: src.projectMajorCategory,
        paymentType: p.paymentType,
        amount: p.amount,
      });
    });
  });
  return list.sort((a, b) => b.amount - a.amount);
}
