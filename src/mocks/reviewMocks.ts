export interface ReviewRecord {
  id: string;
  applyNo: string;
  applyName: string;
  planNo: string;
  projectType: string;
  handler: string;
  status: 'pending' | 'reviewing' | 'approved' | 'returned_applicant' | 'returned_chief';
}

export const reviewStatusMap: Record<string, { label: string; color: string }> = {
  pending:           { label: 'G项目资料审核中',  color: 'bg-amber-50 text-amber-700' },
  reviewing:         { label: '项目论证已经通过', color: 'bg-sky-50 text-sky-700' },
  approved:          { label: 'Z项目准予立项',    color: 'bg-emerald-50 text-emerald-700' },
  returned_applicant:{ label: 'N已退回申请人',    color: 'bg-red-50 text-red-600' },
  returned_chief:    { label: 'N已退回总师室',    color: 'bg-orange-50 text-orange-600' },
};

export const reviewProjectTypes = [
  '智能制造/信息化',
  '安全环保',
  '品种质量',
  '设备升级',
  '基础设施',
  '节能减排',
  '公辅配套',
];

export const reviewStaffList = [
  '朱科长', '李建国', '王志远', '赵明辉', '陈思远', '刘洋', '张伟', '孙宇', '周鑫', '吴刚', '郑浩',
];

export const reviewRecords: ReviewRecord[] = [
  { id: 'r1',  applyNo: '20260040100', applyName: '中普商业智能平台数字化整合提升',            planNo: '26J32500', projectType: '智能制造/信息化', handler: '朱科长', status: 'pending' },
  { id: 'r2',  applyNo: '20260030065', applyName: '科技质量新实验室新型废水处理设施',           planNo: '26J51100', projectType: '安全环保',       handler: '朱科长', status: 'reviewing' },
  { id: 'r3',  applyNo: '20260030064', applyName: '科技质量基础新型高效净化水系统',             planNo: '26J51200', projectType: '安全环保',       handler: '李建国', status: 'approved' },
  { id: 'r4',  applyNo: '20260030060', applyName: '炼压部门道路疏通整治',                       planNo: '26J51400', projectType: '基础设施',       handler: '朱科长', status: 'pending' },
  { id: 'r5',  applyNo: '20260020047', applyName: '第三炼钢厂内产线30m行车组合升级改造',        planNo: '26J40300', projectType: '设备升级',       handler: '王志远', status: 'approved' },
  { id: 'r6',  applyNo: '20260020046', applyName: '第三炼钢厂内产线30m行车组合升级改造（二期）',planNo: '26J40300', projectType: '设备升级',       handler: '朱科长', status: 'returned_applicant' },
  { id: 'r7',  applyNo: '20260030069', applyName: '公司十号线区域废液回收整治',                 planNo: '26J50900', projectType: '公辅配套',       handler: '朱科长', status: 'reviewing' },
  { id: 'r8',  applyNo: '20260030068', applyName: '金矿矿业-410米以下系统炼金工程维护升级改造', planNo: '26J20900', projectType: '设备升级',       handler: '赵明辉', status: 'pending' },
  { id: 'r9',  applyNo: '20260030067', applyName: '烧矿新增数控矿炉服务本',                     planNo: '26J40800', projectType: '设备升级',       handler: '朱科长', status: 'pending' },
  { id: 'r10', applyNo: '20260030081', applyName: '特殊智能运矿人员',                           planNo: '26J30400', projectType: '智能制造/信息化', handler: '朱科长', status: 'approved' },
  { id: 'r11', applyNo: '20260030079', applyName: '南钢DHR微氧化冶金智能制造升级',              planNo: '26J31700', projectType: '智能制造/信息化', handler: '陈思远', status: 'reviewing' },
  { id: 'r12', applyNo: '20260030073', applyName: '钢铁业务园区内区QMS系统建设',                planNo: '26J30300', projectType: '智能制造/信息化', handler: '朱科长', status: 'approved' },
  { id: 'r13', applyNo: '20260030071', applyName: '科技质量部门上线检测研究器',                 planNo: '26J11100', projectType: '品种质量',       handler: '刘洋',   status: 'returned_chief' },
  { id: 'r14', applyNo: '20260030070', applyName: '简测整采冷淡发布系统',                       planNo: '26J31100', projectType: '智能制造/信息化', handler: '朱科长', status: 'pending' },
  { id: 'r15', applyNo: '20260030066', applyName: '工程管控一体化平台',                         planNo: '26J32000', projectType: '智能制造/信息化', handler: '朱科长', status: 'reviewing' },
];

export interface BudgetTreeNode {
  id: string;
  level: 1 | 2 | 3;
  category: 'engineering' | 'otherEngineering' | 'reserve' | 'total';
  seqLabel?: string;
  name: string;
  spec: string;
  buildCost: number;
  installCost: number;
  equipCost: number;
  otherCost: number;
  total: number;
  unit: string;
  quantity: number;
  weight: number;
  indicator: string;
  remark: string;
  children: BudgetTreeNode[];
  isFixed: boolean;
  reserveTotalEditable?: boolean;
}

export const defaultBudgetTree: BudgetTreeNode[] = [
  {
    id: 'L1_engineering', level: 1, category: 'engineering', seqLabel: '一',
    name: '工程费用', spec: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 0, total: 0,
    unit: '', quantity: 0, weight: 0, indicator: '', remark: '', isFixed: true,
    children: [
      {
        id: 'L2_e1', level: 2, category: 'engineering', name: '土建基础施工', spec: '混凝土C30',
        buildCost: 45, installCost: 0, equipCost: 0, otherCost: 5, total: 50,
        unit: '项', quantity: 1, weight: 0, indicator: '50万元/项', remark: '', isFixed: false,
        children: [
          { id: 'L3_e1_1', level: 3, category: 'engineering', name: '基础开挖', spec: '', buildCost: 20, installCost: 0, equipCost: 0, otherCost: 2, total: 22, unit: '项', quantity: 1, weight: 0, indicator: '', remark: '', isFixed: false, children: [] },
          { id: 'L3_e1_2', level: 3, category: 'engineering', name: '混凝土浇筑', spec: 'C30', buildCost: 25, installCost: 0, equipCost: 0, otherCost: 3, total: 28, unit: '项', quantity: 1, weight: 0, indicator: '', remark: '', isFixed: false, children: [] },
        ],
      },
      {
        id: 'L2_e2', level: 2, category: 'engineering', name: '钢结构厂房搭建', spec: 'Q345B钢材',
        buildCost: 120, installCost: 30, equipCost: 0, otherCost: 10, total: 160,
        unit: '㎡', quantity: 800, weight: 45.6, indicator: '2000元/㎡', remark: '含安装', isFixed: false,
        children: [],
      },
    ],
  },
  {
    id: 'L1_other', level: 1, category: 'otherEngineering', seqLabel: '二',
    name: '工程建设其他费', spec: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 0, total: 0,
    unit: '', quantity: 0, weight: 0, indicator: '', remark: '勘察费、设计费、监理费、可行性研究费、其他费', isFixed: true,
    children: [
      { id: 'L2_o1', level: 2, category: 'otherEngineering', name: '勘察设计费', spec: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 35, total: 35, unit: '项', quantity: 1, weight: 0, indicator: '', remark: '含勘察+施工图设计', isFixed: false, children: [] },
      { id: 'L2_o2', level: 2, category: 'otherEngineering', name: '监理费', spec: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 18, total: 18, unit: '项', quantity: 1, weight: 0, indicator: '', remark: '', isFixed: false, children: [] },
    ],
  },
  {
    id: 'L1_reserve', level: 1, category: 'reserve', seqLabel: '三',
    name: '预备费', spec: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 0, total: 38.4,
    unit: '', quantity: 0, weight: 0, indicator: '', remark: '', isFixed: true, reserveTotalEditable: true,
    children: [],
  },
  {
    id: 'L1_total', level: 1, category: 'total', seqLabel: '四',
    name: '项目总投资', spec: '', buildCost: 0, installCost: 0, equipCost: 0, otherCost: 0, total: 0,
    unit: '', quantity: 0, weight: 0, indicator: '', remark: '', isFixed: true,
    children: [],
  },
];
