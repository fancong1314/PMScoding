export interface ProjectOption {
  id: string;
  name: string;
  number: string;
}

export const projectOptions: ProjectOption[] = [
  { id: '2026121324', name: '新建工业厂房项目', number: '2026121324' },
  { id: '2025120345', name: '高炉大修改造项目', number: '2025120345' },
  { id: '2026110234', name: '智能化产线升级项目', number: '2026110234' },
  { id: '2026090123', name: '环保脱硫改造项目', number: '2026090123' },
  { id: '2026080034', name: '轧钢生产线改造项目', number: '2026080034' },
];

export interface StageItem {
  name: string;
  active: boolean;
  completed: boolean;
}

export const projectStageFlow: StageItem[] = [
  { name: '年度计划', active: true, completed: true },
  { name: '论证立项', active: true, completed: true },
  { name: '需求计划', active: false, completed: false },
  { name: '合同执行', active: false, completed: false },
  { name: '竣工', active: false, completed: false },
  { name: '项目收尾', active: false, completed: false },
];

export interface InfoCard {
  label: string;
  value: string;
  icon: string;
}

export const projectInfoCards: InfoCard[] = [
  { label: '建设部门', value: '工程部', icon: 'ri-building-2-line' },
  { label: '当天状态', value: '已开工', icon: 'ri-run-line' },
  { label: '开工天数', value: '256', icon: 'ri-calendar-check-line' },
  { label: '开工日期', value: '12.13', icon: 'ri-calendar-line' },
  { label: '预估工期', value: '12.13', icon: 'ri-time-line' },
  { label: '施工人数', value: '56', icon: 'ri-team-line' },
];

export interface KeyMetric {
  label: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
}

export const keyMetrics: KeyMetric[] = [
  { label: '预估收益', value: 21421, unit: '万元', icon: 'ri-coins-line', color: '#00d4ff' },
  { label: '投资估算金额', value: 1215, unit: '万元', icon: 'ri-funds-box-line', color: '#00d4ff' },
  { label: '立项批复金额', value: 1231, unit: '万元', icon: 'ri-file-list-3-line', color: '#00d4ff' },
  { label: '项目实际金额', value: 1344, unit: '万元', icon: 'ri-money-cny-circle-line', color: '#00d4ff' },
  { label: '差异率', value: 12, unit: '%', icon: 'ri-percent-line', color: '#00d4ff' },
];

export interface FundItem {
  name: string;
  amount: number;
  icon: string;
}

export const fundDistribution: FundItem[] = [
  { name: '建筑费', amount: 488, icon: 'ri-building-2-line' },
  { name: '安装费', amount: 971, icon: 'ri-settings-3-line' },
  { name: '设备费', amount: 3212, icon: 'ri-server-line' },
  { name: '其他', amount: 2342, icon: 'ri-more-line' },
];

export interface ContractProgressItem {
  name: string;
  progress: number;
}

export const contractProgressList: ContractProgressItem[] = [
  { name: '施工合同1', progress: 70 },
  { name: '监理合同', progress: 40 },
  { name: '建筑智能化', progress: 30 },
  { name: '施工合同2', progress: 20 },
  { name: '设计合同', progress: 10 },
  { name: '施工合同3', progress: 10 },
];

export interface PaymentContract {
  name: string;
  paid: number;
  rate: number;
}

export interface PaymentData {
  totalRate: number;
  totalAmount: number;
  contracts: PaymentContract[];
}

export const paymentData: PaymentData = {
  totalRate: 92,
  totalAmount: 18899,
  contracts: [
    { name: '施工合同1', paid: 80, rate: 80 },
    { name: '监理合同', paid: 70, rate: 70 },
    { name: '建筑智能化', paid: 50, rate: 50 },
    { name: '施工合同2', paid: 30, rate: 30 },
  ],
};

export interface ContractAmountType {
  name: string;
  amount: number;
  icon: string;
}

export interface DonutSegment {
  name: string;
  value: number;
  color: string;
}

export const contractAmountTypes: ContractAmountType[] = [
  { name: '合同类型1', amount: 32531, icon: 'ri-file-text-line' },
  { name: '合同类型2', amount: 13325, icon: 'ri-file-text-line' },
  { name: '合同类型4', amount: 72123, icon: 'ri-file-text-line' },
  { name: '合同类型3', amount: 62255, icon: 'ri-file-text-line' },
];

export const contractAmountChartData: DonutSegment[] = [
  { name: '合同1', value: 925, color: '#00d4ff' },
  { name: '合同2', value: 285, color: '#00e5c8' },
];

// Progress tab data
export interface ContractOverviewItem {
  name: string;
  progress: number;
  icon: string;
}

export const contractOverview: ContractOverviewItem[] = [
  { name: '施工合同1', progress: 80, icon: 'ri-hammer-line' },
  { name: '监理合同', progress: 70, icon: 'ri-shield-check-line' },
  { name: '建筑智能化', progress: 50, icon: 'ri-computer-line' },
  { name: '施工合同2', progress: 30, icon: 'ri-hammer-line' },
  { name: '设计合同', progress: 20, icon: 'ri-pen-nib-line' },
];

export interface OverallProgress {
  planProgress: number;
  actualProgress: number;
  deviation: number;
}

export const overallProgress: OverallProgress = {
  planProgress: 92,
  actualProgress: 88,
  deviation: -3.2,
};

export interface TaskItem {
  name: string;
  planStart: string;
  planEnd: string;
  planProgress: number;
  actualProgress: number;
  status: 'done' | 'doing' | 'warning' | 'pending';
  warning?: string;
}

export interface TaskGroup {
  contractName: string;
  contractCode: string;
  tasks: TaskItem[];
}

export const taskList: TaskGroup[] = [
  {
    contractName: '施工合同1',
    contractCode: '2026121324-C01',
    tasks: [
      { name: 'A: 基础施工', planStart: '2026.01', planEnd: '2026.03', planProgress: 100, actualProgress: 100, status: 'done' },
      { name: 'B: 钢结构安装', planStart: '2026.03', planEnd: '2026.06', planProgress: 90, actualProgress: 85, status: 'doing' },
      { name: 'C: 幕墙安装', planStart: '2026.06', planEnd: '2026.09', planProgress: 50, actualProgress: 40, status: 'warning', warning: '延期' },
      { name: 'D: 机电安装', planStart: '2026.09', planEnd: '2026.12', planProgress: 20, actualProgress: 15, status: 'doing' },
      { name: 'E: 内部装修', planStart: '2026.12', planEnd: '2027.02', planProgress: 5, actualProgress: 0, status: 'pending' },
    ],
  },
  {
    contractName: '监理合同',
    contractCode: '2026121324-C02',
    tasks: [
      { name: 'A: 施工监理', planStart: '2026.01', planEnd: '2026.12', planProgress: 60, actualProgress: 55, status: 'doing' },
    ],
  },
  {
    contractName: '建筑智能化',
    contractCode: '2026121324-C03',
    tasks: [
      { name: 'A: 智能系统安装', planStart: '2026.06', planEnd: '2026.12', planProgress: 30, actualProgress: 25, status: 'doing' },
    ],
  },
];

// Video tab data
export interface CameraInfo {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'weak';
  imageUrl: string;
}

export interface MonitorContract {
  id: number;
  contractName: string;
  contractNo: string;
  cameras: CameraInfo[];
}

export const projectCameras: MonitorContract[] = [
  {
    id: 1,
    contractName: '施工合同1',
    contractNo: '2026121324-C01',
    cameras: [
      { id: 1, name: '主塔吊监控', status: 'online', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20aerial%20view%20crane%20industrial%20building%20steel%20structure%20under%20construction%2C%20daytime%2C%20clear%20blue%20sky%2C%20professional%20photography&width=1280&height=720&seq=proj-detail-cam1&orientation=landscape' },
      { id: 2, name: '基坑监控', status: 'online', imageUrl: 'https://readdy.ai/api/search-image?query=Deep%20foundation%20pit%20construction%20site%20with%20excavator%2C%20concrete%20walls%2C%20rebar%20structures%2C%20industrial%20construction%2C%20daytime&width=640&height=360&seq=proj-detail-cam2&orientation=landscape' },
      { id: 3, name: '材料堆放区', status: 'online', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20material%20storage%20yard%20steel%20beams%20pipes%20organized%20stacks%2C%20industrial%20site%2C%20daytime%2C%20clear%20weather&width=640&height=360&seq=proj-detail-cam3&orientation=landscape' },
      { id: 4, name: '入口门禁', status: 'offline', imageUrl: '' },
      { id: 5, name: '焊接作业区', status: 'online', imageUrl: 'https://readdy.ai/api/search-image?query=Industrial%20welding%20workshop%20sparks%20steel%20structure%20construction%2C%20bright%20lighting%2C%20professional%20worksite&width=640&height=360&seq=proj-detail-cam5&orientation=landscape' },
      { id: 6, name: '宿舍楼施工', status: 'weak', imageUrl: 'https://readdy.ai/api/search-image?query=Multi-story%20building%20under%20construction%20concrete%20frame%20scaffolding%2C%20residential%20construction%20site%2C%20daytime&width=640&height=360&seq=proj-detail-cam6&orientation=landscape' },
    ],
  },
  {
    id: 2,
    contractName: '监理合同',
    contractNo: '2026121324-C02',
    cameras: [
      { id: 7, name: '监理办公室', status: 'online', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20office%20interior%20monitors%20desks%20blueprint%20plans%2C%20modern%20workspace%2C%20bright%20lighting&width=640&height=360&seq=proj-detail-cam7&orientation=landscape' },
    ],
  },
];

// Investment tab data
export interface CostTypeItem {
  name: string;
  amount: number;
  color: string;
}

export const costTypeProportions: CostTypeItem[] = [
  { name: '建筑费', amount: 2210, color: '#00d4ff' },
  { name: '安装费', amount: 1387, color: '#ff8c32' },
  { name: '设备费', amount: 832, color: '#36d986' },
  { name: '其他费用', amount: 543, color: '#a855f7' },
];

export interface DiffMetric {
  label: string;
  value: number;
  unit: string;
  icon: string;
}

export const diffMetrics: DiffMetric[] = [
  { label: '立项金额', value: 4883, unit: '万元', icon: 'ri-file-list-3-line' },
  { label: '实际金额', value: 5342, unit: '万元', icon: 'ri-funds-box-line' },
  { label: '决算金额', value: 4235, unit: '万元', icon: 'ri-calculator-line' },
  { label: '预估收益', value: 3453, unit: '万元', icon: 'ri-coins-line' },
];

export interface DeviationItem {
  label: string;
  amount: number;
  rate: number;
  color: string;
}

export const deviations: DeviationItem[] = [
  { label: '项目实际偏差', amount: 45, rate: 30, color: '#ff4757' },
  { label: '项目投资偏差', amount: 22, rate: 23, color: '#ffb800' },
  { label: '项目收益偏差', amount: 21, rate: 40, color: '#ff4757' },
  { label: '项目概算偏差', amount: 30, rate: 10, color: '#00e5c8' },
];

export interface CostDiffItem {
  name: string;
  planned: number;
  actual: number;
}

export const costDiffAnalysis: CostDiffItem[] = [
  { name: '建筑费', planned: 3880, actual: 2210 },
  { name: '安装费', planned: 2780, actual: 1387 },
  { name: '设备费', planned: 4450, actual: 832 },
  { name: '其他', planned: 1230, actual: 543 },
];

export interface CostTypeAvailable {
  name: string;
  rate: number;
  amount: number;
  color: string;
}

export const costTypeAvailable: CostTypeAvailable[] = [
  { name: '建筑费', rate: 91, amount: 333.33, color: '#00d4ff' },
  { name: '安装费', rate: 82, amount: 433.00, color: '#ff8c32' },
  { name: '设备费', rate: 100, amount: 0, color: '#36d986' },
  { name: '其他', rate: 82, amount: 999.33, color: '#a855f7' },
];

export const contractProportion: DonutSegment[] = [
  { name: '合同1', value: 293332.22, color: '#00d4ff' },
  { name: '合同2', value: 7213.33, color: '#ff8c32' },
  { name: '合同3', value: 4556.21, color: '#36d986' },
  { name: '合同4', value: 4123.00, color: '#a855f7' },
  { name: '合同5', value: 2342.21, color: '#ffb800' },
];

export interface ContractTypeBar {
  name: string;
  values: number[];
}

export const contractTypeBars: ContractTypeBar[] = [
  { name: '合同1', values: [40, 30, 20, 10] },
  { name: '合同2', values: [30, 40, 20, 10] },
  { name: '合同3', values: [25, 35, 25, 15] },
  { name: '合同4', values: [35, 25, 25, 15] },
  { name: '合同5', values: [20, 30, 30, 20] },
  { name: '合同6', values: [30, 30, 25, 15] },
  { name: '合同7', values: [25, 25, 30, 20] },
];

export interface PaymentTableRow {
  name: string;
  party: string;
  amount: number;
  paid: number;
  rate: number;
}

export const paymentTable: PaymentTableRow[] = [
  { name: '合同1', party: '江苏金恒科技', amount: 95000, paid: 60000, rate: 80 },
  { name: '合同2', party: '江苏金恒科技', amount: 84000, paid: 30000, rate: 40 },
  { name: '合同3', party: '江苏金恒科技', amount: 73000, paid: 20000, rate: 30 },
  { name: '合同4', party: '江苏金恒科技', amount: 62000, paid: 10000, rate: 20 },
];

export interface InvestmentSummary {
  totalAmount: number;
  usedAmount: number;
  availableAmount: number;
  occupancyRate: number;
}

export const investmentSummary: InvestmentSummary = {
  totalAmount: 5548,
  usedAmount: 4352,
  availableAmount: 1220,
  occupancyRate: 65,
};