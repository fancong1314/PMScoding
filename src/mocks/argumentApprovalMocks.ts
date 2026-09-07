export interface ApprovalRecord {
  id: string;
  applyNo: string;
  applyName: string;
  projectType: string;
  buildUnit: string;
  createDate: string;
  businessUnit: string;
  planNo: string;
  status: string;
  isBenefit: boolean;
  benefitValue?: number;
  constructionDays?: number;
}

export interface ApprovalHistoryItem {
  id: string;
  sequence: number;
  nodeStatus: string;
  person: string;
  opinion: string;
  time: string;
  receiver?: string;
  status?: string;
  operator?: string;
}

export const approvalProjectTypes = [
  '大型新建',
  '技改',
  '年修',
  '零星',
  '搬迁',
  '备件修复',
  '其他',
];

export const approvalBuildUnits = [
  '炼铁事业部',
  '炼钢事业部',
  '轧钢事业部',
  '能源事业部',
  '总师室',
  '战运部',
  '设备管理部',
  '安全环保部',
  '基建部',
];

export const approvalBusinessUnits = [
  '炼铁事业部',
  '炼钢事业部',
  '轧钢事业部',
  '能源事业部',
  '总师室',
  '战运部',
  '设备管理部',
  '安全环保部',
  '基建部',
  '生产部',
  '财务部',
  '人力资源部',
  '采购部',
  '技术质量部',
];

export const approvalStatuses = [
  { value: '待审批', label: '待审批', color: 'bg-sky-50 text-sky-700 border border-sky-200' },
  { value: '已呈核', label: '已呈核', color: 'bg-blue-50 text-blue-700 border border-blue-200' },
  { value: '审批中', label: '审批中', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { value: '已退回', label: '已退回', color: 'bg-red-50 text-red-700 border border-red-200' },
  { value: '已通过', label: '已通过', color: 'bg-green-50 text-green-700 border border-green-200' },
];

export const availableHandlers = [
  '张三', '李四', '王五', '赵六', '钱七',
  '孙八', '周九', '吴十', '郑十一', '王十二',
  '陈十三', '林十四', '黄十五', '何十六', '张十七',
  '刘十八', '杨十九', '徐二十', '马二十一', '朱二十二',
];

export const approvalHistoryData: Record<string, ApprovalHistoryItem[]> = {
  'LZNK-GCSQ-2026-0001': [
    { id: 'h1', sequence: 1, nodeStatus: '总师室收件审批', person: '张三', opinion: '材料齐全，符合审批要求', time: '2026-04-10 09:30:00', receiver: '李四' },
    { id: 'h2', sequence: 2, nodeStatus: '风险与机遇审批', person: '李四', opinion: '经评估，项目风险可控，机遇良好', time: '2026-04-12 14:20:00', receiver: '王五' },
    { id: 'h3', sequence: 3, nodeStatus: '人力资源部审批', person: '王五', opinion: '岗位无增减，同意立项', time: '2026-04-15 10:15:00', receiver: '赵六' },
  ],
  'LZNK-GCSQ-2026-0002': [
    { id: 'h1', sequence: 1, nodeStatus: '总师室收件审批', person: '张三', opinion: '材料齐全，符合审批要求', time: '2026-04-11 08:45:00', receiver: '李四' },
    { id: 'h2', sequence: 2, nodeStatus: '风险与机遇审批', person: '李四', opinion: '风险较低，建议立项', time: '2026-04-13 16:30:00', receiver: '王五' },
  ],
  'LZNK-GCSQ-2026-0003': [
    { id: 'h1', sequence: 1, nodeStatus: '总师室收件审批', person: '张三', opinion: '材料需补充设备清单', time: '2026-04-09 11:20:00', receiver: '李四' },
    { id: 'h2', sequence: 2, nodeStatus: '风险与机遇审批', person: '李四', opinion: '补充材料后重新评估通过', time: '2026-04-14 09:10:00', receiver: '王五' },
    { id: 'h3', sequence: 3, nodeStatus: '人力资源部审批', person: '王五', opinion: '增加岗位3个，人员需求合理', time: '2026-04-16 15:40:00', receiver: '赵六' },
    { id: 'h4', sequence: 4, nodeStatus: '数评审批', status: '待呈核', operator: '赵六', opinion: '数字化方案可行', time: '2026-04-18 10:00:00', receiver: '钱七' },
  ],
};

const argumentNames = [
  '炼铁厂高炉热风炉系统升级改造项目',
  '炼钢厂转炉除尘系统优化改造项目',
  '轧钢厂热轧产线智能化控制系统升级',
  '能源事业部余热回收利用工程',
  '能源管理中心信息化平台建设项目',
  '总师室技术改造项目论证申请',
  '设备管理部特种设备检修平台建设项目',
  '安全环保部烟气脱硫脱硝系统改造',
  '炼铁厂原料系统自动化升级项目',
  '炼钢厂连铸坯质量在线检测系统建设',
  '轧钢厂精轧机组电气控制系统改造',
  '能源事业部煤气柜扩容改造项目',
  '总师室工艺技术研究中心建设项目',
  '战运部生产调度信息化平台升级',
  '设备管理部备件仓库智能化管理系统',
  '安全环保部粉尘在线监测系统建设',
  '炼铁厂炉前操作安全防护设施完善',
  '炼钢厂中间包烘烤系统节能改造',
  '轧钢厂钢坯表面质量检测系统升级',
  '能源事业部锅炉给水泵变频改造项目',
];

export function generateApprovalRecords(count: number = 20): ApprovalRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const statuses = ['待审批', '已呈核', '审批中', '已退回', '已通过'];
    const status = statuses[i % statuses.length];
    return {
      id: `app_${i + 1}`,
      applyNo: `LZNK-GCSQ-2026-${String(i + 1).padStart(4, '0')}`,
      applyName: argumentNames[i % argumentNames.length],
      projectType: approvalProjectTypes[i % approvalProjectTypes.length],
      buildUnit: approvalBuildUnits[i % approvalBuildUnits.length],
      createDate: `2026-04-${String(1 + (i % 20)).padStart(2, '0')}`,
      businessUnit: approvalBusinessUnits[i % approvalBusinessUnits.length],
      planNo: `LZNK-PL-${2026}-${String(i + 1).padStart(4, '0')}`,
      status,
      isBenefit: i % 3 === 0,
      benefitValue: (i + 1) * 1.25,
      constructionDays: 274 + i * 5,
    };
  });
}