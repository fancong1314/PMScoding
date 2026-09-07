export interface ProfessionalPickRecord {
  id: string;
  argumentName: string;
  argumentNo: string;
  projectType: string;
  buildUnit: string;
  isBenefit: boolean;
  status: '未配置' | '已配置' | '已签署' | '已完成';
  applyDate: string;
  planNo: string;
  handler: string;
  deadlineStart: string;
  deadlineEnd: string;
  selectedUnits: { id: string; unitName: string }[];
  signRecords: {
    id: string;
    person: string;
    signTime: string;
    opinion: string;
    attachments: { name: string; size: number }[];
  }[];
}

export const professionalPickStatuses = [
  { value: '未配置', label: '未配置', color: 'bg-slate-100 text-slate-600' },
  { value: '已配置', label: '已配置', color: 'bg-sky-50 text-sky-700 border border-sky-200' },
  { value: '已签署', label: '已签署', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { value: '已完成', label: '已完成', color: 'bg-green-50 text-green-700 border border-green-200' },
];

export const projectTypes = [
  '设备改造',
  '工艺优化',
  '安全环保',
  '信息化建设',
  '基础设施建设',
  '能源管理',
];

export const buildUnits = [
  '炼铁事业部',
  '炼钢事业部',
  '轧钢事业部',
  '能源事业部',
  '总师室',
  '战运部',
  '设备管理部',
  '安全环保部',
];

export const orgUnits = [
  '炼铁事业部',
  '炼钢事业部',
  '轧钢事业部',
  '能源事业部',
  '总师室',
  '战运部',
  '安全环保部',
  '设备管理部',
  '财务部',
  '人力资源部',
  '采购部',
  '技术质量部',
  '基建部',
  '生产部',
];

function generateApplyNo(index: number): string {
  const year = 2026;
  const seq = String(index + 1).padStart(4, '0');
  return `LZNK-GCSQ-${year}-${seq}`;
}

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

export const professionalPickRecords: ProfessionalPickRecord[] = Array.from({ length: 20 }, (_, i) => {
  const status = i < 5 ? '未配置' : i < 12 ? '已配置' : i < 17 ? '已签署' : '已完成';
  const selectedUnits = status !== '未配置'
    ? [
        { id: `u_${i}_1`, unitName: orgUnits[i % orgUnits.length] },
        { id: `u_${i}_2`, unitName: orgUnits[(i + 3) % orgUnits.length] },
        ...(i % 2 === 0 ? [{ id: `u_${i}_3`, unitName: orgUnits[(i + 5) % orgUnits.length] }] : []),
      ]
    : [];

  const signRecords = status === '已签署' || status === '已完成'
    ? selectedUnits.slice(0, 2).map((unit, si) => ({
        id: `sr_${i}_${si}`,
        person: `${unit.unitName}经办人`,
        signTime: `2026-04-${String(15 + i).padStart(2, '0')} 14:${String(30 + si * 10).padStart(2, '0')}`,
        opinion: `经${unit.unitName}审查，该项目技术方案可行，投资估算合理，建议尽快立项实施。需进一步完善相关安全风险评估。`,
        attachments: si === 0 ? [{ name: `审查意见_${i}.pdf`, size: 2.1 * 1024 * 1024 }] : [],
      }))
    : [];

  return {
    id: `pick_${i + 1}`,
    argumentName: argumentNames[i],
    argumentNo: generateApplyNo(i),
    projectType: projectTypes[i % projectTypes.length],
    buildUnit: buildUnits[i % buildUnits.length],
    isBenefit: i % 3 === 0,
    status,
    applyDate: `2026-04-${String(1 + (i % 20)).padStart(2, '0')}`,
    planNo: `LZNK-PL-${2026}-${String(i + 1).padStart(4, '0')}`,
    handler: '总师室经办人',
    deadlineStart: status !== '未配置' ? `2026-05-${String(5 + i).padStart(2, '0')} 09:00` : '',
    deadlineEnd: status !== '未配置' ? `2026-05-${String(15 + i).padStart(2, '0')} 17:00` : '',
    selectedUnits,
    signRecords,
  };
});

export const messageTemplates = [
  '请各部门尽快完成会审意见签署，截止时间即将到来。',
  '项目论证申请已分配至各专业单位，请查收并按时完成会审。',
  '提醒：会审意见签署即将截止，请尚未签署的部门尽快处理。',
];