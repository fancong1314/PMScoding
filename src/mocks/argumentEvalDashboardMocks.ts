/* ========== 论证后评价看板 Mock 数据 ========== */
export interface KpiStats {
  argumentCompletionRate: number;
  argumentCompleted: number;
  argumentTotal: number;
  argumentPlannedCompleted: number;
  argumentPlannedInProgress: number;
  argumentPlannedNotStarted: number;
  argumentPlannedInvestCompleted: number;
  argumentPlannedInvestInProgress: number;
  argumentPlannedInvestNotStarted: number;
  argumentUnplannedCompleted: number;
  argumentUnplannedInProgress: number;
  argumentUnplannedNotStarted: number;
  argumentUnplannedInvestCompleted: number;
  argumentUnplannedInvestInProgress: number;
  argumentUnplannedInvestNotStarted: number;
  postEvalCompletionRate: number;
  postEvalCompleted: number;
  postEvalTotal: number;
  avgProcessingDays: number;
  prevAvgProcessingDays: number;
  avgEvalScore: number;
}

export const mockKpiStats: KpiStats = {
  argumentCompletionRate: 82,
  argumentCompleted: 128,
  argumentTotal: 156,
  argumentPlannedCompleted: 95,
  argumentPlannedInProgress: 12,
  argumentPlannedNotStarted: 3,
  argumentPlannedInvestCompleted: 42500.50,
  argumentPlannedInvestInProgress: 6800.00,
  argumentPlannedInvestNotStarted: 1500.00,
  argumentUnplannedCompleted: 33,
  argumentUnplannedInProgress: 18,
  argumentUnplannedNotStarted: 5,
  argumentUnplannedInvestCompleted: 12800.00,
  argumentUnplannedInvestInProgress: 8200.00,
  argumentUnplannedInvestNotStarted: 2100.00,
  postEvalCompletionRate: 84,
  postEvalCompleted: 72,
  postEvalTotal: 86,
  avgProcessingDays: 18.5,
  prevAvgProcessingDays: 22.3,
  avgEvalScore: 87.5,
};

export interface ArgumentStats {
  appliedCount: number;
  completedCount: number;
  reviewedCount: number;
  unreviewedCount: number;
  signedCount: number;
  unsignedCount: number;
}

export const mockArgumentStats: ArgumentStats = {
  appliedCount: 156,
  completedCount: 128,
  reviewedCount: 135,
  unreviewedCount: 21,
  signedCount: 118,
  unsignedCount: 38,
};

export interface MonthlyTrend {
  month: string;
  applied: number;
  completed: number;
}

export const mockMonthlyTrend: MonthlyTrend[] = [
  { month: '2026-01', applied: 22, completed: 18 },
  { month: '2026-02', applied: 18, completed: 15 },
  { month: '2026-03', applied: 26, completed: 22 },
  { month: '2026-04', applied: 30, completed: 25 },
  { month: '2026-05', applied: 35, completed: 28 },
  { month: '2026-06', applied: 25, completed: 20 },
];

export interface PostEvalStats {
  reachedCount: number;
  completedCount: number;
  overdueCount: number;
  delayedCount: number;
  spotCheckCount: number;
  failedCount: number;
}

export const mockPostEvalStats: PostEvalStats = {
  reachedCount: 86,
  completedCount: 72,
  overdueCount: 8,
  delayedCount: 4,
  spotCheckCount: 31,
  failedCount: 2,
};

export interface DeptComparison {
  name: string;
  applied: number;
  completed: number;
  completionRate: number;
  avgDays: number;
}

export const mockDeptComparison: DeptComparison[] = [
  { name: '炼铁事业部', applied: 35, completed: 30, completionRate: 85.7, avgDays: 16 },
  { name: '炼钢事业部', applied: 28, completed: 22, completionRate: 78.6, avgDays: 22 },
  { name: '轧钢事业部', applied: 24, completed: 20, completionRate: 83.3, avgDays: 18 },
  { name: '能源环保部', applied: 18, completed: 15, completionRate: 83.3, avgDays: 15 },
  { name: '制造部', applied: 20, completed: 16, completionRate: 80.0, avgDays: 20 },
  { name: '设备管理部', applied: 15, completed: 11, completionRate: 73.3, avgDays: 24 },
  { name: '安全环保部', applied: 8, completed: 7, completionRate: 87.5, avgDays: 14 },
  { name: '基建部', applied: 8, completed: 7, completionRate: 87.5, avgDays: 13 },
];

export interface AnomalyRecord {
  id: number;
  argName: string;
  applicantUnit: string;
  warnType: string;
  overdueDays: number;
  severity: '严重' | '一般';
}

export const mockAnomalies: AnomalyRecord[] = [
  { id: 1, argName: '中厚板轧线智能升级项目', applicantUnit: '轧钢事业部', warnType: '会审超期', overdueDays: 22, severity: '严重' },
  { id: 2, argName: '烧结机超低排放改造', applicantUnit: '炼铁事业部', warnType: '资料不全', overdueDays: 18, severity: '严重' },
  { id: 3, argName: '转炉煤气回收系统升级', applicantUnit: '炼钢事业部', warnType: '会审超期', overdueDays: 15, severity: '严重' },
  { id: 4, argName: '高炉水渣处理系统改造', applicantUnit: '炼铁事业部', warnType: '待审核', overdueDays: 12, severity: '一般' },
  { id: 5, argName: '冷轧酸洗线智能改造', applicantUnit: '轧钢事业部', warnType: '资料不全', overdueDays: 10, severity: '一般' },
  { id: 6, argName: '焦化厂VOCs治理项目', applicantUnit: '制造部', warnType: '会审超期', overdueDays: 9, severity: '一般' },
  { id: 7, argName: '炼钢除尘系统升级', applicantUnit: '炼钢事业部', warnType: '待审核', overdueDays: 8, severity: '一般' },
  { id: 8, argName: '轧线加热炉节能改造', applicantUnit: '轧钢事业部', warnType: '资料不全', overdueDays: 7, severity: '一般' },
  { id: 9, argName: '废钢加工配送中心建设', applicantUnit: '制造部', warnType: '待审核', overdueDays: 0, severity: '一般' },
  { id: 10, argName: '钢渣综合利用项目', applicantUnit: '炼钢事业部', warnType: '会审超期', overdueDays: 0, severity: '一般' },
];

export interface ScoreRank {
  rank: number;
  projectName: string;
  unit: string;
  score: number;
  grade: string;
}

export const mockScoreRanks: ScoreRank[] = [
  { rank: 1, projectName: '宽厚板轧线升级改造', unit: '轧钢事业部', score: 96.3, grade: '优秀' },
  { rank: 2, projectName: '高炉智能控制系统升级', unit: '炼铁事业部', score: 94.8, grade: '优秀' },
  { rank: 3, projectName: '转炉底吹系统优化', unit: '炼钢事业部', score: 93.5, grade: '优秀' },
  { rank: 4, projectName: '全厂能源管理系统建设', unit: '能源环保部', score: 91.2, grade: '优秀' },
  { rank: 5, projectName: '冷轧退火炉改造', unit: '轧钢事业部', score: 88.6, grade: '良好' },
  { rank: 6, projectName: '烧结烟气循环利用', unit: '炼铁事业部', score: 85.4, grade: '良好' },
  { rank: 7, projectName: '连铸机智能化改造', unit: '炼钢事业部', score: 84.1, grade: '良好' },
  { rank: 8, projectName: '焦炉烟气脱硫脱硝', unit: '制造部', score: 82.7, grade: '良好' },
  { rank: 9, projectName: '水处理系统提标改造', unit: '能源环保部', score: 78.3, grade: '一般' },
  { rank: 10, projectName: '钢渣热闷处理线改造', unit: '炼钢事业部', score: 76.9, grade: '一般' },
  { rank: 11, projectName: '原料场封闭改造', unit: '制造部', score: 72.5, grade: '一般' },
  { rank: 12, projectName: '除尘灰资源化利用', unit: '安全环保部', score: 68.2, grade: '不合格' },
];

export const mockRefreshTime = '2026-06-25 14:32:08';