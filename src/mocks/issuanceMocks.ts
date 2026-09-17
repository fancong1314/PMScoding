export interface IssuanceRecord {
  id: string;
  applyNo: string;
  applyName: string;
  planNo: string;
  projectType: string;
  handler: string;
  status: 'pending_issue' | 'issued' | 'reduced' | 'modifying';
  investAmount: number;
  reducedAmount: number;
}

export const issuanceStatusMap: Record<string, { label: string; color: string }> = {
  pending_issue: { label: '待签发',   color: 'bg-amber-50 text-amber-700' },
  issued:        { label: 'Z已签发',  color: 'bg-emerald-50 text-emerald-700' },
  reduced:       { label: '核减中',   color: 'bg-orange-50 text-orange-600' },
  modifying:     { label: '修改中',   color: 'bg-sky-50 text-sky-700' },
};

export const issuanceProjectTypes = [
  '智能制造/信息化',
  '安全环保',
  '品种质量',
  '设备升级',
  '基础设施',
  '节能减排',
  '公辅配套',
];

export const issuanceCompanyList  = ['南钢总公司', '南钢股份', '南京钢铁联合有限公司', '金鑫钢铁'];
export const issuanceDivisionList = ['炼铁事业部', '炼钢事业部', '热轧事业部', '冷轧事业部', '科技质量部', '工程管理部', '安全环保部'];
export const issuanceUnitList     = ['工程管理部', '生产技术部', '设备管理部', '采购供应部', '财务部'];

export const issuanceRecords: IssuanceRecord[] = [
  { id: 'is1',  applyNo: '20260040100', applyName: '中普商业智能平台数字化整合提升',            planNo: '26J32500', projectType: '智能制造/信息化', handler: '朱科长', status: 'pending_issue', investAmount: 1280.00, reducedAmount: 0 },
  { id: 'is2',  applyNo: '20260030064', applyName: '科技质量基础新型高效净化水系统',            planNo: '26J51200', projectType: '安全环保',       handler: '李建国', status: 'issued',        investAmount: 320.50,  reducedAmount: 0 },
  { id: 'is3',  applyNo: '20260020047', applyName: '第三炼钢厂内产线30m行车组合升级改造',       planNo: '26J40300', projectType: '设备升级',       handler: '王志远', status: 'issued',        investAmount: 2400.00, reducedAmount: 120.00 },
  { id: 'is4',  applyNo: '20260030081', applyName: '特殊智能运矿人员',                          planNo: '26J30400', projectType: '智能制造/信息化', handler: '朱科长', status: 'pending_issue', investAmount: 680.00,  reducedAmount: 0 },
  { id: 'is5',  applyNo: '20260030073', applyName: '钢铁业务园区内区QMS系统建设',               planNo: '26J30300', projectType: '智能制造/信息化', handler: '朱科长', status: 'issued',        investAmount: 920.00,  reducedAmount: 0 },
  { id: 'is6',  applyNo: '20260030070', applyName: '简测整采冷淡发布系统',                      planNo: '26J31100', projectType: '智能制造/信息化', handler: '朱科长', status: 'reduced',       investAmount: 480.00,  reducedAmount: 30.00 },
  { id: 'is7',  applyNo: '20260030079', applyName: '南钢DHR微氧化冶金智能制造升级',             planNo: '26J31700', projectType: '智能制造/信息化', handler: '陈思远', status: 'modifying',     investAmount: 1560.00, reducedAmount: 0 },
  { id: 'is8',  applyNo: '20260030069', applyName: '公司十号线区域废液回收整治',                planNo: '26J50900', projectType: '公辅配套',       handler: '朱科长', status: 'pending_issue', investAmount: 780.00,  reducedAmount: 0 },
  { id: 'is9',  applyNo: '20260030068', applyName: '金矿矿业-410米以下系统炼金工程维护升级改造', planNo: '26J20900', projectType: '设备升级',       handler: '赵明辉', status: 'pending_issue', investAmount: 3200.00, reducedAmount: 0 },
  { id: 'is10', applyNo: '20260030066', applyName: '工程管控一体化平台',                        planNo: '26J32000', projectType: '智能制造/信息化', handler: '朱科长', status: 'issued',        investAmount: 1100.00, reducedAmount: 50.00 },
  { id: 'is11', applyNo: '20260030067', applyName: '烧矿新增数控矿炉服务本',                    planNo: '26J40800', projectType: '设备升级',       handler: '朱科长', status: 'pending_issue', investAmount: 450.00,  reducedAmount: 0 },
  { id: 'is12', applyNo: '20260030060', applyName: '炼压部门道路疏通整治',                      planNo: '26J51400', projectType: '基础设施',       handler: '朱科长', status: 'pending_issue', investAmount: 180.00,  reducedAmount: 0 },
  { id: 'is13', applyNo: '20260030065', applyName: '科技质量新实验室新型废水处理设施',          planNo: '26J51100', projectType: '安全环保',       handler: '朱科长', status: 'modifying',     investAmount: 560.00,  reducedAmount: 0 },
  { id: 'is14', applyNo: '20260030071', applyName: '科技质量部门上线检测研究器',                planNo: '26J11100', projectType: '品种质量',       handler: '刘洋',   status: 'pending_issue', investAmount: 360.00,  reducedAmount: 0 },
  { id: 'is15', applyNo: '20260030076', applyName: '节能减排智能监控预警系统建设',              planNo: '26J60100', projectType: '节能减排',       handler: '张伟',   status: 'issued',        investAmount: 890.00,  reducedAmount: 45.00 },
];
