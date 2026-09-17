export interface ArgumentApplyRecord {
  id: string;
  applyNo: string;
  applyName: string;
  projectType: string;
  applyAmount: number;
  buildUnit: string;
  division: string;
  projectManager: string;
  status: '草稿' | '审批中' | '已通过' | '已驳回';
  applyDate: string;
  planNo: string;
}

export const argumentApplyRecords: ArgumentApplyRecord[] = [
  {
    id: '1',
    applyNo: 'LZ-2026-001',
    applyName: '第三炼钢厂连铸机结晶器振动系统升级改造',
    projectType: '技术改造',
    applyAmount: 247.04,
    buildUnit: '炼钢事业部',
    division: '炼钢事业部',
    projectManager: '张建国',
    status: '审批中',
    applyDate: '2026-03-15',
    planNo: '26J40300',
  },
  {
    id: '2',
    applyNo: 'LZ-2026-002',
    applyName: '高炉煤气余压透平发电装置TRT系统优化',
    projectType: '节能改造',
    applyAmount: 185.50,
    buildUnit: '炼铁事业部',
    division: '炼铁事业部',
    projectManager: '李明华',
    status: '草稿',
    applyDate: '2026-03-20',
    planNo: '26J30400',
  },
  {
    id: '3',
    applyNo: 'LZ-2026-003',
    applyName: '中普商业智能平台数字化整合提升项目',
    projectType: '信息化建设',
    applyAmount: 320.00,
    buildUnit: '科技质量部',
    division: '科技质量部',
    projectManager: '王志远',
    status: '已通过',
    applyDate: '2026-02-28',
    planNo: '26J32500',
  },
  {
    id: '4',
    applyNo: 'LZ-2026-004',
    applyName: '科技质量基础新型高效净化水系统建设',
    projectType: '环保改造',
    applyAmount: 156.80,
    buildUnit: '安全环保部',
    division: '安全环保部',
    projectManager: '陈晓峰',
    status: '已驳回',
    applyDate: '2026-02-15',
    planNo: '26J51200',
  },
  {
    id: '5',
    applyNo: 'LZ-2026-005',
    applyName: '钢铁业务园区内区QMS质量管理系统建设',
    projectType: '信息化建设',
    applyAmount: 98.60,
    buildUnit: '科技质量部',
    division: '科技质量部',
    projectManager: '刘建平',
    status: '草稿',
    applyDate: '2026-04-01',
    planNo: '26J30300',
  },
  {
    id: '6',
    applyNo: 'LZ-2026-006',
    applyName: '特殊钢智能运矿人员管理系统升级',
    projectType: '安全改造',
    applyAmount: 75.20,
    buildUnit: '炼铁事业部',
    division: '炼铁事业部',
    projectManager: '赵国强',
    status: '审批中',
    applyDate: '2026-03-28',
    planNo: '26J30400',
  },
  {
    id: '7',
    applyNo: 'LZ-2026-007',
    applyName: '轧钢产线自动化控制系统改造升级项目',
    projectType: '技术改造',
    applyAmount: 412.30,
    buildUnit: '轧钢事业部',
    division: '轧钢事业部',
    projectManager: '孙伟民',
    status: '已通过',
    applyDate: '2026-01-20',
    planNo: '26J20100',
  },
  {
    id: '8',
    applyNo: 'LZ-2026-008',
    applyName: '焦化厂煤气脱硫脱氰装置改造工程',
    projectType: '环保改造',
    applyAmount: 289.75,
    buildUnit: '焦化事业部',
    division: '焦化事业部',
    projectManager: '周建华',
    status: '草稿',
    applyDate: '2026-04-10',
    planNo: '26J60200',
  },
];

export const argumentProjectTypes = ['技术改造', '节能改造', '信息化建设', '环保改造', '安全改造', '基础设施', '新建项目'];
export const argumentBuildUnits = ['炼钢事业部', '炼铁事业部', '轧钢事业部', '焦化事业部', '科技质量部', '安全环保部', '设备管理部', '能源管理部'];
export const argumentDivisions = ['炼钢事业部', '炼铁事业部', '轧钢事业部', '焦化事业部', '科技质量部', '安全环保部', '设备管理部', '能源管理部'];
export const argumentImplementUnits = ['炼钢事业部', '炼铁事业部', '轧钢事业部', '焦化事业部', '科技质量部', '安全环保部', '设备管理部', '能源管理部', '工程管理部'];
export const argumentProfessionalUnits = ['机械设备部', '电气自动化部', '土建工程部', '工艺技术部', '安全环保部', '信息技术部'];
export const argumentRiskLevels = ['高', '中', '低'];
export const argumentRiskStatuses = ['已识别', '处理中', '已关闭'];
export const argumentRiskCategories = ['技术风险', '安全风险', '环境风险', '进度风险', '成本风险', '质量风险'];
export const argumentRiskStrategies = ['规避', '转移', '减轻', '接受'];
export const argumentIndicatorTypes = ['产量指标', '质量指标', '能耗指标', '安全指标', '环保指标', '效率指标'];

export interface ProjectPlan {
  id: string;
  planNo: string;
  planName: string;
  projectType: string;
  division: string;
  estimateTotal: number;
  status: string;
}

export const projectPlans: ProjectPlan[] = [
  { id: 'pp-001', planNo: '26J40300', planName: '第三炼钢厂连铸机结晶器振动系统升级改造', projectType: '技术改造', division: '炼钢事业部', estimateTotal: 2470400, status: '已审批' },
  { id: 'pp-002', planNo: '26J30400', planName: '高炉煤气余压透平发电装置TRT系统优化', projectType: '节能改造', division: '炼铁事业部', estimateTotal: 1855000, status: '已审批' },
  { id: 'pp-003', planNo: '26J32500', planName: '中普商业智能平台数字化整合提升项目', projectType: '信息化建设', division: '科技质量部', estimateTotal: 3200000, status: '已审批' },
  { id: 'pp-004', planNo: '26J51200', planName: '科技质量基础新型高效净化水系统建设', projectType: '环保改造', division: '安全环保部', estimateTotal: 1568000, status: '已审批' },
  { id: 'pp-005', planNo: '26J30300', planName: '钢铁业务园区内区QMS质量管理系统建设', projectType: '信息化建设', division: '科技质量部', estimateTotal: 986000, status: '已审批' },
  { id: 'pp-006', planNo: '26J20100', planName: '轧钢产线自动化控制系统改造升级项目', projectType: '技术改造', division: '轧钢事业部', estimateTotal: 4123000, status: '已审批' },
  { id: 'pp-007', planNo: '26J60200', planName: '焦化厂煤气脱硫脱氰装置改造工程', projectType: '环保改造', division: '焦化事业部', estimateTotal: 2897500, status: '已审批' },
  { id: 'pp-008', planNo: '26J40800', planName: '原料场封闭改造项目', projectType: '环保改造', division: '炼铁事业部', estimateTotal: 56200000, status: '已审批' },
  { id: 'pp-009', planNo: '26J20700', planName: '特殊钢智能运矿人员管理系统升级', projectType: '安全改造', division: '炼铁事业部', estimateTotal: 752000, status: '已审批' },
  { id: 'pp-010', planNo: '26J31500', planName: '1号高炉营缮工程', projectType: '营缮', division: '炼铁事业部', estimateTotal: 48500000, status: '已审批' },
];