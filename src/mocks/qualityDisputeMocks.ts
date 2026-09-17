export interface QualityDispute {
  id: string;
  disputeNo: string;
  contractNo: string;
  contractName: string;
  supplierCode: string;
  supplierName: string;
  purchaser: string;
  purchaserContact: string;
  applicant: string;
  disputeAmount: number;
  disputeQuantity: number;
  causeProductionStop: string;
  stopHours: number;
  occurrenceDate: string;
  categoryType: string;
  needSupplierRectify: string;
  supplierRectifyNo: string;
  needQualityJudgment: string;
  issueAnalysis: string;
  isQualityIssue: string;
  approvalOpinion: string;
  attachments: string[];
  projectReviewStatus: string;
  projectReviewer: string;
  manufacturingReviewStatus: string;
  manufacturingReviewer: string;
  creator: string;
  createTime: string;
  modifier: string;
  modifyTime: string;
  stage: 'maintenance' | 'project_review' | 'manufacturing_review';
  status: string;
}

export interface ApprovalRecord {
  id: string;
  disputeId: string;
  stage: string;
  operation: string;
  operator: string;
  operateDate: string;
  operateTime: string;
  opinion: string;
}

export const supplierOptions = [
  { code: 'SUP001', name: '上海宝钢贸易有限公司', purchaser: '张三', purchaserContact: '13800138001' },
  { code: 'SUP002', name: '中冶京诚工程技术有限公司', purchaser: '李四', purchaserContact: '13800138002' },
  { code: 'SUP003', name: '中冶赛迪工程技术有限公司', purchaser: '王五', purchaserContact: '13800138003' },
  { code: 'SUP004', name: '南京钢铁集团物资供应公司', purchaser: '赵六', purchaserContact: '13800138004' },
  { code: 'SUP005', name: '江苏永钢集团有限公司', purchaser: '钱七', purchaserContact: '13800138005' },
  { code: 'SUP006', name: '沙钢集团有限公司', purchaser: '孙八', purchaserContact: '13800138006' },
  { code: 'SUP007', name: '中国二十冶集团有限公司', purchaser: '周九', purchaserContact: '13800138007' },
  { code: 'SUP008', name: '上海宝冶集团有限公司', purchaser: '吴十', purchaserContact: '13800138008' },
];

export const categoryTypes = [
  '螺纹钢',
  '中厚板',
  '线材',
  '型钢',
  '冷轧板',
  '热轧板',
  '管材',
  '不锈钢',
  '合金钢',
  '电工钢',
];

export const statusOptions = [
  { value: '新建', label: '新建', color: 'bg-blue-50 text-blue-700' },
  { value: '审批中', label: '审批中', color: 'bg-amber-50 text-amber-700' },
  { value: '已通过', label: '已通过', color: 'bg-emerald-50 text-emerald-700' },
  { value: '已驳回', label: '已驳回', color: 'bg-red-50 text-red-700' },
  { value: '待审批', label: '待审批', color: 'bg-violet-50 text-violet-700' },
];

const contractNos = [
  'HT-2026-00123',
  'HT-2026-00234',
  'HT-2026-00345',
  'HT-2026-00456',
  'HT-2026-00567',
  'HT-2026-00678',
  'HT-2026-00789',
  'HT-2026-00890',
  'HT-2026-00901',
  'HT-2026-01012',
  'HT-2026-01123',
  'HT-2026-01234',
  'HT-2026-01345',
  'HT-2026-01456',
  'HT-2026-01567',
];

const contractNames = [
  '炼铁厂1号高炉营缮工程钢材采购合同',
  '炼钢厂转炉除尘系统改造设备采购合同',
  '轧钢事业部热轧产线升级材料供应合同',
  '能源事业部余热发电项目钢管采购合同',
  '安全环保部烟气治理工程钢材采购合同',
  '设备管理部备件仓库扩建钢材采购合同',
  '基建部员工宿舍改造项目材料供应合同',
  '生产部调度中心信息化升级设备采购合同',
  '炼铁厂原料场封闭改造工程钢材采购合同',
  '炼钢厂连铸机自动化改造设备采购合同',
  '轧钢事业部冷轧酸洗线改造材料供应合同',
  '能源事业部煤气柜扩容工程钢材采购合同',
  '总师室中试基地建设材料供应合同',
  '安全环保部废水处理升级工程设备采购合同',
  '设备管理部机修车间改造工程钢材采购合同',
];

export const allDisputes: QualityDispute[] = Array.from({ length: 15 }, (_, i) => {
  const supplier = supplierOptions[i % supplierOptions.length];
  const stageList: ('maintenance' | 'project_review' | 'manufacturing_review')[] = [
    'maintenance', 'maintenance', 'maintenance', 'maintenance', 'maintenance',
    'project_review', 'project_review', 'project_review', 'project_review', 'project_review',
    'manufacturing_review', 'manufacturing_review', 'manufacturing_review', 'manufacturing_review', 'manufacturing_review',
  ];
  const stage = stageList[i];
  const statusMap: Record<string, string> = {
    maintenance: '新建',
    project_review: '待审批',
    manufacturing_review: '待审批',
  };

  const causeStop = i % 3 === 0 ? '是' : '否';
  const stopH = causeStop === '是' ? (4 + i % 20) : 0;

  const needQuality = i % 2 === 0 ? '是' : '否';
  const isQuality = i % 4 === 0 ? '否' : '是';

  return {
    id: `dis_${String(i + 1).padStart(4, '0')}`,
    disputeNo: `YYD2026${String(1001 + i).padStart(5, '0')}`,
    contractNo: contractNos[i],
    contractName: contractNames[i],
    supplierCode: supplier.code,
    supplierName: supplier.name,
    purchaser: supplier.purchaser,
    purchaserContact: supplier.purchaserContact,
    applicant: `申请人${String(i + 1).padStart(2, '0')}`,
    disputeAmount: 50000 + i * 30000,
    disputeQuantity: 100 + i * 50,
    causeProductionStop: causeStop,
    stopHours: stopH,
    occurrenceDate: `2026-0${1 + (i % 5)}-${String(5 + (i % 20)).padStart(2, '0')}`,
    categoryType: categoryTypes[i % categoryTypes.length],
    needSupplierRectify: i % 2 === 0 ? '是' : '否',
    supplierRectifyNo: i % 2 === 0 ? `ZGD2026${String(1001 + i).padStart(5, '0')}` : '',
    needQualityJudgment: needQuality,
    issueAnalysis: stage !== 'maintenance' ? `经现场核实，该批次${categoryTypes[i % categoryTypes.length]}存在${i % 3 === 0 ? '强度不达标' : i % 3 === 1 ? '表面质量缺陷' : '尺寸偏差超标'}问题。经${supplier.name}现场确认，该问题系${i % 2 === 0 ? '生产工艺控制不当' : '原材料质量波动'}所致。` : '',
    isQualityIssue: isQuality,
    approvalOpinion: stage === 'manufacturing_review' ? (i % 4 === 0 ? '不属于质量异议范畴，建议驳回' : '确认属于质量异议，建议通过审批') : '',
    attachments: [
      `质量问题照片_${i + 1}.jpg`,
      `检测报告_${i + 1}.pdf`,
    ],
    projectReviewStatus: stage === 'maintenance' ? '未提交' : '待审批',
    projectReviewer: stage === 'maintenance' ? '--' : '项目部审核员',
    manufacturingReviewStatus: stage === 'manufacturing_review' ? '待审批' : '未提交',
    manufacturingReviewer: stage === 'manufacturing_review' ? '制造部审核员' : '--',
    creator: `创建人${String(i + 1).padStart(2, '0')}`,
    createTime: `2026-0${1 + (i % 5)}-${String(5 + (i % 20)).padStart(2, '0')} 09:00:00`,
    modifier: `修改人${String(i + 1).padStart(2, '0')}`,
    modifyTime: `2026-0${1 + (i % 5)}-${String(10 + (i % 15)).padStart(2, '0')} 15:30:00`,
    stage,
    status: statusMap[stage],
  };
});

export const allApprovalRecords: ApprovalRecord[] = [
  { id: 'rec_001', disputeId: 'dis_0006', stage: '质量异议维护', operation: '提交', operator: '申请人01', operateDate: '2026-03-05', operateTime: '09:30:00', opinion: '该批次钢材存在表面质量缺陷，申请质量异议处理。' },
  { id: 'rec_002', disputeId: 'dis_0006', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-03-06', operateTime: '10:00:00', opinion: '经现场核实，质量问题属实，提交制造部审批。' },
  { id: 'rec_003', disputeId: 'dis_0007', stage: '质量异议维护', operation: '提交', operator: '申请人02', operateDate: '2026-04-08', operateTime: '11:00:00', opinion: '中厚板尺寸偏差超标，影响后续加工使用。' },
  { id: 'rec_004', disputeId: 'dis_0007', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-04-09', operateTime: '14:30:00', opinion: '经现场实测，尺寸偏差确实超出合同允许范围。' },
  { id: 'rec_005', disputeId: 'dis_0008', stage: '质量异议维护', operation: '提交', operator: '申请人03', operateDate: '2026-05-10', operateTime: '08:30:00', opinion: '线材强度不达标，无法满足设计要求。' },
  { id: 'rec_006', disputeId: 'dis_0008', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-05-11', operateTime: '09:00:00', opinion: '经第三方检测确认，强度不达标情况属实。' },
  { id: 'rec_007', disputeId: 'dis_0009', stage: '质量异议维护', operation: '提交', operator: '申请人04', operateDate: '2026-02-15', operateTime: '10:30:00', opinion: '型钢弯曲度超标，影响安装精度。' },
  { id: 'rec_008', disputeId: 'dis_0009', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-02-16', operateTime: '11:00:00', opinion: '经现场测量，弯曲度超出标准允许范围。' },
  { id: 'rec_009', disputeId: 'dis_0010', stage: '质量异议维护', operation: '提交', operator: '申请人05', operateDate: '2026-01-20', operateTime: '09:00:00', opinion: '冷轧板表面油污严重，影响后续涂装。' },
  { id: 'rec_010', disputeId: 'dis_0010', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-01-21', operateTime: '10:30:00', opinion: '经现场确认，表面油污情况严重，影响使用。' },
  { id: 'rec_011', disputeId: 'dis_0011', stage: '质量异议维护', operation: '提交', operator: '申请人06', operateDate: '2026-03-12', operateTime: '08:30:00', opinion: '热轧板化学成分不符合标准要求。' },
  { id: 'rec_012', disputeId: 'dis_0011', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-03-13', operateTime: '10:00:00', opinion: '经实验室检测，化学成分不符合合同要求。' },
  { id: 'rec_013', disputeId: 'dis_0011', stage: '制造部审批', operation: '通过', operator: '制造部审核员', operateDate: '2026-03-14', operateTime: '14:00:00', opinion: '确认属于质量异议，同意处理。' },
  { id: 'rec_014', disputeId: 'dis_0012', stage: '质量异议维护', operation: '提交', operator: '申请人07', operateDate: '2026-04-20', operateTime: '09:30:00', opinion: '管材壁厚不均匀，影响承压能力。' },
  { id: 'rec_015', disputeId: 'dis_0012', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-04-21', operateTime: '10:00:00', opinion: '经现场检测，壁厚不均匀情况属实。' },
  { id: 'rec_016', disputeId: 'dis_0012', stage: '制造部审批', operation: '通过', operator: '制造部审核员', operateDate: '2026-04-22', operateTime: '15:30:00', opinion: '确认属于质量异议，建议供应商整改。' },
  { id: 'rec_017', disputeId: 'dis_0013', stage: '质量异议维护', operation: '提交', operator: '申请人08', operateDate: '2026-05-05', operateTime: '11:00:00', opinion: '不锈钢表面锈蚀，影响外观质量。' },
  { id: 'rec_018', disputeId: 'dis_0013', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-05-06', operateTime: '09:30:00', opinion: '经现场核实，表面锈蚀情况严重。' },
  { id: 'rec_019', disputeId: 'dis_0013', stage: '制造部审批', operation: '驳回', operator: '制造部审核员', operateDate: '2026-05-07', operateTime: '14:00:00', opinion: '经核实，锈蚀系运输不当所致，非供应商责任。' },
  { id: 'rec_020', disputeId: 'dis_0014', stage: '质量异议维护', operation: '提交', operator: '申请人09', operateDate: '2026-02-28', operateTime: '08:30:00', opinion: '合金钢冲击韧性不足，影响低温使用性能。' },
  { id: 'rec_021', disputeId: 'dis_0014', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-03-01', operateTime: '10:00:00', opinion: '经检测，冲击韧性确实低于标准要求。' },
  { id: 'rec_022', disputeId: 'dis_0014', stage: '制造部审批', operation: '通过', operator: '制造部审核员', operateDate: '2026-03-02', operateTime: '11:30:00', opinion: '确认属于质量异议，同意更换。' },
  { id: 'rec_023', disputeId: 'dis_0015', stage: '质量异议维护', operation: '提交', operator: '申请人10', operateDate: '2026-01-15', operateTime: '09:00:00', opinion: '电工钢磁性能不达标，影响电机效率。' },
  { id: 'rec_024', disputeId: 'dis_0015', stage: '项目部审批', operation: '呈核', operator: '项目部审核员', operateDate: '2026-01-16', operateTime: '10:30:00', opinion: '经实验室检测，磁性能低于合同要求。' },
  { id: 'rec_025', disputeId: 'dis_0015', stage: '制造部审批', operation: '驳回', operator: '制造部审核员', operateDate: '2026-01-17', operateTime: '14:00:00', opinion: '经第三方检测，磁性能达标，驳回异议。' },
];

export function getDisputesByStage(stage: 'maintenance' | 'project_review' | 'manufacturing_review') {
  return allDisputes.filter((d) => d.stage === stage);
}

export function getDisputeById(id: string) {
  return allDisputes.find((d) => d.id === id) || null;
}

export function getApprovalRecordsByDisputeId(disputeId: string) {
  return allApprovalRecords.filter((r) => r.disputeId === disputeId);
}

export function getSupplierByCode(code: string) {
  return supplierOptions.find((s) => s.code === code) || null;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 2 }).format(value);
}