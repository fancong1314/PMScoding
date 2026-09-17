export interface ProjectPoint {
  id: string;
  name: string;
  projectNo: string;
  type: '技改' | '大中修' | '零固' | '零星施工';
  approvedAmount: number;
  progress: number;
  status: string;
  x: number;
  y: number;
}

export interface FundChain {
  planAmount: number;
  approvedAmount: number;
  contractAmount: number;
  paidAmount: number;
  approveRate: number;
  contractConversionRate: number;
  paymentRate: number;
  completionRate: number;
  costDeviationRate: number;
  investCompletionRate: number;
}

export interface TypeAvgProgress {
  type: string;
  color: string;
  pct: number;
}

export interface ProgressInterval {
  range: string;
  count: number;
  tech: number;
  overhaul: number;
  fixedAsset: number;
  sporadic: number;
}

export interface MonthlyPlanRate {
  month: string;
  rate: number;
}

export interface CostDeviationStack {
  label: string;
  color: string;
  count: number;
}

export interface TopOverspendProject {
  name: string;
  amount: number;
  pct: number;
}

export interface CostCategoryPie {
  name: string;
  color: string;
  pct: number;
  amount: number;
}

export interface PostEvalRank {
  rank: number;
  name: string;
  projectNo: string;
  unit: string;
  score: number;
}

export interface HandoverStats {
  handover: number;
  completion: number;
  postEval: number;
}

export interface InvestmentTrend {
  month: string;
  amount: number;
}

export interface MonitorFeed {
  id: string;
  name: string;
  online: boolean;
  contractName: string;
}

export interface AlertItem {
  name: string;
  count: number;
  icon: string;
  color: string;
}

export interface BizNavItem {
  dept: string;
  icon: string;
  projectCount: number;
}

export interface DashboardSummary {
  totalProjects: number;
  yearProjects: number;
  yearPlanInvest: number;
  yearApprovedInvest: number;
  yearProjectTotal: number;
  yearApprovedAmount: number;
  investCompletionRate: number;
  typeDistribution: { type: string; count: number; color: string }[];
}

export const mockSummary: DashboardSummary = {
  totalProjects: 128,
  yearProjects: 56,
  yearPlanInvest: 128560,
  yearApprovedInvest: 98500,
  yearProjectTotal: 128560,
  yearApprovedAmount: 98500,
  investCompletionRate: 76.8,
  typeDistribution: [
    { type: '技改', count: 42, color: '#00e5c8' },
    { type: '大中修', count: 35, color: '#ff8c32' },
    { type: '零固', count: 31, color: '#36d986' },
    { type: '零星施工', count: 20, color: '#a855f7' },
  ],
};

export const mockProjectPoints: ProjectPoint[] = [
  { id: 'p1', name: '炼铁厂2#高炉营缮', projectNo: 'XM-2026-001', type: '大中修', approvedAmount: 8560, progress: 68, status: '执行中', x: 35, y: 30 },
  { id: 'p2', name: '板材厂智能化改造', projectNo: 'XM-2026-002', type: '技改', approvedAmount: 12500, progress: 45, status: '执行中', x: 52, y: 25 },
  { id: 'p3', name: '公辅系统节能改造', projectNo: 'XM-2026-003', type: '技改', approvedAmount: 6800, progress: 82, status: '执行中', x: 28, y: 55 },
  { id: 'p4', name: '炼钢连铸机零固', projectNo: 'XM-2026-004', type: '零固', approvedAmount: 3200, progress: 92, status: '收尾中', x: 48, y: 42 },
  { id: 'p5', name: '物流中心零星施工', projectNo: 'XM-2026-005', type: '零星施工', approvedAmount: 850, progress: 35, status: '执行中', x: 62, y: 65 },
  { id: 'p6', name: '特钢事业部设备升级', projectNo: 'XM-2026-006', type: '技改', approvedAmount: 15600, progress: 55, status: '执行中', x: 45, y: 58 },
  { id: 'p7', name: '能环部脱硫脱硝改造', projectNo: 'XM-2026-007', type: '技改', approvedAmount: 9800, progress: 78, status: '执行中', x: 38, y: 48 },
  { id: 'p8', name: '制造部热处理线大修', projectNo: 'XM-2026-008', type: '大中修', approvedAmount: 5600, progress: 30, status: '执行中', x: 55, y: 35 },
  { id: 'p9', name: '信息中心机房零固', projectNo: 'XM-2026-009', type: '零固', approvedAmount: 1800, progress: 88, status: '执行中', x: 50, y: 50 },
  { id: 'p10', name: '采购部仓储系统零星', projectNo: 'XM-2026-010', type: '零星施工', approvedAmount: 650, progress: 60, status: '执行中', x: 58, y: 45 },
  { id: 'p11', name: '技术中心实验室建设', projectNo: 'XM-2026-011', type: '技改', approvedAmount: 7200, progress: 40, status: '执行中', x: 40, y: 38 },
  { id: 'p12', name: '总师室设计平台升级', projectNo: 'XM-2026-012', type: '技改', approvedAmount: 4500, progress: 72, status: '执行中', x: 42, y: 52 },
  { id: 'p13', name: '数研院数据中台建设', projectNo: 'XM-2026-013', type: '技改', approvedAmount: 8900, progress: 25, status: '执行中', x: 44, y: 40 },
  { id: 'p14', name: '炼铁厂风机房大修', projectNo: 'XM-2026-014', type: '大中修', approvedAmount: 4200, progress: 85, status: '收尾中', x: 33, y: 33 },
  { id: 'p15', name: '板材厂轧机零固', projectNo: 'XM-2026-015', type: '零固', approvedAmount: 2800, progress: 50, status: '执行中', x: 54, y: 28 },
];

export const mockFundChain: FundChain = {
  planAmount: 128560,
  approvedAmount: 98500,
  contractAmount: 76200,
  paidAmount: 58200,
  approveRate: 76.6,
  contractConversionRate: 77.4,
  paymentRate: 76.4,
  completionRate: 38.5,
  costDeviationRate: 2.3,
  investCompletionRate: 59.1,
};

export const mockTypeAvgProgress: TypeAvgProgress[] = [
  { type: '技改', color: '#00e5c8', pct: 62 },
  { type: '大中修', color: '#ff8c32', pct: 55 },
  { type: '零固', color: '#36d986', pct: 78 },
  { type: '零星施工', color: '#a855f7', pct: 48 },
];

export const mockProgressIntervals: ProgressInterval[] = [
  { range: '0-30%', count: 18, tech: 5, overhaul: 4, fixedAsset: 3, sporadic: 6 },
  { range: '30-60%', count: 42, tech: 15, overhaul: 12, fixedAsset: 8, sporadic: 7 },
  { range: '60-90%', count: 46, tech: 16, overhaul: 14, fixedAsset: 12, sporadic: 4 },
  { range: '90-100%', count: 22, tech: 6, overhaul: 5, fixedAsset: 8, sporadic: 3 },
];

export const mockMonthlyPlanRates: MonthlyPlanRate[] = [
  { month: '1月', rate: 82.5 },
  { month: '2月', rate: 78.3 },
  { month: '3月', rate: 85.1 },
  { month: '4月', rate: 80.6 },
  { month: '5月', rate: 76.8 },
  { month: '6月', rate: 72.4 },
];

export const mockLagProjectsTop5 = [
  { name: '数研院数据中台建设', progress: 25, plannedProgress: 40, delayDays: 18, status: '严重滞后' },
  { name: '制造部热处理线大修', progress: 30, plannedProgress: 45, delayDays: 15, status: '严重滞后' },
  { name: '物流中心仓储系统零星', progress: 35, plannedProgress: 48, delayDays: 12, status: '滞后' },
  { name: '信息中心机房零固', progress: 40, plannedProgress: 50, delayDays: 8, status: '滞后' },
  { name: '技术中心实验室建设', progress: 42, plannedProgress: 48, delayDays: 6, status: '滞后' },
];

export const mockCostDeviationStacks: CostDeviationStack[] = [
  { label: '超支>10%', color: '#ff4757', count: 12 },
  { label: '超支5-10%', color: '#ff8c32', count: 18 },
  { label: '±5%以内', color: '#00d68f', count: 72 },
  { label: '节约>5%', color: '#00e5c8', count: 26 },
];

export const mockTopOverspend: TopOverspendProject[] = [
  { name: '特钢事业部设备升级', amount: 2850, pct: 18.3 },
  { name: '板材厂智能化改造', amount: 2160, pct: 17.3 },
  { name: '炼铁厂2#高炉营缮', amount: 1580, pct: 18.4 },
  { name: '能环部脱硫脱硝改造', amount: 1250, pct: 12.8 },
  { name: '公辅系统节能改造', amount: 980, pct: 14.4 },
];

export const mockCostCategoryPie: CostCategoryPie[] = [
  { name: '建筑费', color: '#00d4ff', pct: 32, amount: 31520 },
  { name: '安装费', color: '#ff8c32', pct: 25, amount: 24625 },
  { name: '设备费', color: '#36d986', pct: 28, amount: 27580 },
  { name: '其他费', color: '#a855f7', pct: 10, amount: 9850 },
  { name: '预备费', color: '#64748b', pct: 5, amount: 4925 },
];

export const mockPostEvalTop5: PostEvalRank[] = [
  { rank: 1, name: '焦化厂环保升级技改', projectNo: 'XM-2025-018', unit: '焦化厂', score: 94.6 },
  { rank: 2, name: '炼钢厂连铸末端电磁搅拌', projectNo: 'XM-2025-023', unit: '炼钢厂', score: 92.8 },
  { rank: 3, name: '中厚板厂热处理线改造', projectNo: 'XM-2025-031', unit: '中厚板厂', score: 91.2 },
  { rank: 4, name: '能环部废水零排放工程', projectNo: 'XM-2025-015', unit: '能环部', score: 89.5 },
  { rank: 5, name: '技术中心新材料实验室', projectNo: 'XM-2025-027', unit: '技术中心', score: 88.3 },
];

export const mockPostEvalBottom5: PostEvalRank[] = [
  { rank: 42, name: '采购部仓储信息化零星', projectNo: 'XM-2025-042', unit: '采购部', score: 62.4 },
  { rank: 41, name: '公辅系统管道改造大修', projectNo: 'XM-2025-039', unit: '能环部', score: 65.1 },
  { rank: 40, name: '物流中心装卸设备零固', projectNo: 'XM-2025-037', unit: '物流中心', score: 67.8 },
  { rank: 39, name: '制造部检测线改造技改', projectNo: 'XM-2025-035', unit: '制造部', score: 70.2 },
  { rank: 38, name: '炼铁厂除尘系统大修', projectNo: 'XM-2025-033', unit: '炼铁厂', score: 71.5 },
];

export const mockHandoverStats: HandoverStats = {
  handover: 18,
  completion: 12,
  postEval: 8,
};

export const mockInvestmentTrends: InvestmentTrend[] = [
  { month: '7月', amount: 8520 },
  { month: '8月', amount: 9360 },
  { month: '9月', amount: 7850 },
  { month: '10月', amount: 10200 },
  { month: '11月', amount: 9680 },
  { month: '12月', amount: 11500 },
  { month: '1月', amount: 6800 },
  { month: '2月', amount: 5900 },
  { month: '3月', amount: 9200 },
  { month: '4月', amount: 10500 },
  { month: '5月', amount: 12100 },
  { month: '6月', amount: 13200 },
];

export const mockTypeInvestPct = [
  { type: '技改', pct: 42, color: '#00e5c8' },
  { type: '大中修', pct: 28, color: '#ff8c32' },
  { type: '零固', pct: 18, color: '#36d986' },
  { type: '零星施工', pct: 12, color: '#a855f7' },
];

export const mockMonitorFeeds: MonitorFeed[] = [
  { id: 'm1', name: '炼铁厂2#高炉', online: true, contractName: '炼铁厂2#高炉营缮项目' },
  { id: 'm2', name: '板材厂轧机车间', online: true, contractName: '板材厂智能化改造项目' },
  { id: 'm3', name: '公辅系统泵站', online: true, contractName: '公辅系统节能改造项目' },
  { id: 'm4', name: '特钢事业部厂房', online: false, contractName: '特钢事业部设备升级项目' },
];

export const mockAlerts: AlertItem[] = [
  { name: '开工异常数', count: 5, icon: 'ri-error-warning-line', color: '#ff4757' },
  { name: '竣工滞后数', count: 8, icon: 'ri-time-line', color: '#ff8c32' },
  { name: '结算异常数', count: 3, icon: 'ri-file-list-3-line', color: '#ffb800' },
  { name: '合同超期数', count: 6, icon: 'ri-file-text-line', color: '#ff4757' },
  { name: '质量未闭环', count: 4, icon: 'ri-tools-line', color: '#ff8c32' },
  { name: '安全未整改', count: 7, icon: 'ri-shield-check-line', color: '#ff4757' },
];

export const mockBizNav: BizNavItem[] = [
  { dept: '设备部', icon: 'ri-settings-3-line', projectCount: 28 },
  { dept: '制造部', icon: 'ri-tools-line', projectCount: 22 },
  { dept: '采购部', icon: 'ri-shopping-cart-line', projectCount: 15 },
  { dept: '能环部', icon: 'ri-drop-line', projectCount: 18 },
  { dept: '技术中心', icon: 'ri-flask-line', projectCount: 12 },
  { dept: '总师室', icon: 'ri-user-star-line', projectCount: 10 },
  { dept: '数研院', icon: 'ri-database-2-line', projectCount: 14 },
];

export const mockRefreshTime = '2026-07-13 14:35';

// Score distribution for post-evaluation ranking chart
export const mockScoreDistribution = [
  { range: '90+', count: 12, color: '#00d68f' },
  { range: '80-89', count: 18, color: '#00e5c8' },
  { range: '70-79', count: 25, color: '#00d4ff' },
  { range: '60-69', count: 14, color: '#ffb800' },
  { range: '50-59', count: 8, color: '#ff8c32' },
  { range: '<50', count: 3, color: '#ff4757' },
];

// Ticker events
export interface TickerEvent {
  id: string;
  time: string;
  type: string;
  description: string;
}

export const mockTickerEvents: TickerEvent[] = [
  { id: 't1', time: '14:32', type: '重大风险', description: '炼铁厂2#高炉营缮项目关键节点延迟3天' },
  { id: 't2', time: '14:28', type: '里程碑达成', description: '板材厂智能化改造项目完成设备调试' },
  { id: 't3', time: '14:15', type: '进度预警', description: '公辅系统节能改造项目进度低于计划5%' },
  { id: 't4', time: '14:05', type: '合同签订', description: '特钢事业部设备升级项目EPC合同签订' },
  { id: 't5', time: '13:52', type: '审批超期', description: '数研院数据中台建设项目审批已超期2天' },
  { id: 't6', time: '13:40', type: '里程碑达成', description: '能环部脱硫脱硝改造项目通过环保验收' },
  { id: 't7', time: '13:25', type: '重大风险', description: '制造部热处理线大修项目施工安全风险预警' },
  { id: 't8', time: '13:10', type: '进度预警', description: '技术中心实验室建设项目设备到货延迟' },
];

// KPI sparkline data
export interface KpiCardData {
  label: string;
  value: string;
  unit?: string;
  trend: number[];
  color: string;
}

export const mockKpiCards: KpiCardData[] = [
  { label: '项目总数', value: '128', unit: '个', trend: [110, 115, 118, 120, 122, 125, 128], color: '#00d4ff' },
  { label: '本年项目数', value: '56', unit: '个', trend: [42, 45, 48, 50, 52, 54, 56], color: '#00e5c8' },
  { label: '本年计划投资', value: '12.9', unit: '亿', trend: [10.2, 10.8, 11.3, 11.6, 12.1, 12.5, 12.9], color: '#ff8c32' },
  { label: '投资完成率', value: '59.1', unit: '%', trend: [42, 46, 50, 52, 55, 57, 59.1], color: '#00d68f' },
  { label: '整体完工率', value: '38.5', unit: '%', trend: [25, 28, 31, 33, 35, 36, 38.5], color: '#a855f7' },
];

// Risk and cost analysis
export interface RiskItem {
  id: number;
  name: string;
  riskLevel: '高' | '中' | '低';
  score: number;
}

export const mockRiskAnalysis: RiskItem[] = [
  { id: 1, name: '数据中心机房建设项目', riskLevel: '高', score: 94.6 },
  { id: 2, name: '炼铁厂高炉营缮工程', riskLevel: '高', score: 93.5 },
  { id: 3, name: '公辅系统节能改造', riskLevel: '中', score: 91.5 },
  { id: 4, name: '板材厂智能化升级', riskLevel: '中', score: 89.3 },
  { id: 5, name: '物流中心仓储系统', riskLevel: '低', score: 85.4 },
];

// Enterprise cost management
export interface CostManageItem {
  dept: string;
  amount: number;
  color: string;
}

export const mockEnterpriseCostManage: CostManageItem[] = [
  { dept: '设备部', amount: 32500, color: '#00d4ff' },
  { dept: '制造部', amount: 28600, color: '#00e5c8' },
  { dept: '能环部', amount: 21200, color: '#ff8c32' },
  { dept: '采购部', amount: 18500, color: '#36d986' },
  { dept: '技术中心', amount: 15200, color: '#a855f7' },
  { dept: '总师室', amount: 9800, color: '#ffb800' },
];

// Anomaly stats for bottom section
export interface AnomalyStat {
  month: string;
  anomaly: number;
  warning: number;
}

export const mockBottomAnomalyStats: AnomalyStat[] = [
  { month: '1月', anomaly: 12, warning: 8 },
  { month: '2月', anomaly: 15, warning: 10 },
  { month: '3月', anomaly: 9, warning: 6 },
  { month: '4月', anomaly: 18, warning: 12 },
  { month: '5月', anomaly: 14, warning: 9 },
  { month: '6月', anomaly: 11, warning: 7 },
];

// Red/Black list projects (expanded)
export interface RedBlackProject {
  name: string;
  score: number;
  color: string;
  isRed: boolean;
}

export const mockRedBlackList: RedBlackProject[] = [
  { name: '数研院数据中台建设', score: 25, color: '#ff4757', isRed: true },
  { name: '制造部热处理线大修', score: 30, color: '#ff4757', isRed: true },
  { name: '物流中心仓储系统零星', score: 35, color: '#ff8c32', isRed: true },
  { name: '信息中心机房零固', score: 40, color: '#ff8c32', isRed: true },
  { name: '技术中心实验室建设', score: 42, color: '#ff8c32', isRed: true },
  { name: '焦化厂环保升级技改', score: 94.6, color: '#00d68f', isRed: false },
  { name: '炼钢厂连铸末端电磁搅拌', score: 92.8, color: '#00d68f', isRed: false },
  { name: '中厚板厂热处理线改造', score: 91.2, color: '#00e5c8', isRed: false },
  { name: '能环部废水零排放工程', score: 89.5, color: '#00e5c8', isRed: false },
  { name: '技术中心新材料实验室', score: 88.3, color: '#00d4ff', isRed: false },
];