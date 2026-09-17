export interface EarlyEvaluationProject {
  id: string;
  approvalNo: string;
  planNo: string;
  projectName: string;
  approvalDesc: string;
  projectType: string;
  approvalAmount: number;
  preApprovalAmount: number;
  actualApprovalAmount: number;
  originalContractAmount: number;
  adjustedContractAmount: number;
  completionAmount: number;
  settlementAmount: number;
  bookAmount: number;
  fixedAssetAmount: number;
  approvalDate: string;
  ownerUnit: string;
  supervisorUnit: string;
  projectManager: string;
  isEcoReview: string;
  approvalStatus: string;
  // Early evaluation application data
  isFormalEval: string;
  applyReason: string;
  applySuggestion: string;
  acceptanceFiles: string[];
  applyFiles: string[];
  currentReviewer: string;
  applyDate: string;
}

export interface ApprovalNode {
  seq: number;
  nodeName: string;
  reviewer: string;
  status: 'approved' | 'rejected' | 'processing' | 'pending';
  opinion: string;
  time: string;
}

export const earlyEvaluationProjects: EarlyEvaluationProject[] = [
  {
    id: 'ee-001', approvalNo: 'LX-2024-001', planNo: 'JH-2024-001', projectName: '中厚板卷厂热处理线主厂房钢结构工程',
    approvalDesc: '新建热处理线主厂房钢结构及围护结构', projectType: '技改项目', approvalAmount: 31200000,
    preApprovalAmount: 30000000, actualApprovalAmount: 31200000, originalContractAmount: 31200000,
    adjustedContractAmount: 32650000, completionAmount: 32480000, settlementAmount: 32150000,
    bookAmount: 32150000, fixedAssetAmount: 32650000, approvalDate: '2024-09-20',
    ownerUnit: '中厚板卷厂', supervisorUnit: '工程管理部', projectManager: '王志强', isEcoReview: '否',
    approvalStatus: '审批中', isFormalEval: '是', applyReason: '项目已按计划完成全部施工内容，热处理线已投产运行3个月，各项指标达到预期效果，具备提前后评价条件。',
    applySuggestion: '建议尽快组织后评价，总结热处理线建设经验，为后续类似项目提供参考。', acceptanceFiles: ['热处理线验收报告.pdf', '设备调试记录.pdf'],
    applyFiles: ['监理总结报告.pdf'], currentReviewer: '事业部-李志明', applyDate: '2025-11-15',
  },
  {
    id: 'ee-002', approvalNo: 'LX-2024-005', planNo: 'JH-2024-005', projectName: '炼铁厂煤粉制备系统改造',
    approvalDesc: '煤粉制备系统立磨、选粉机、收尘器等设备改造', projectType: '技改项目', approvalAmount: 28800000,
    preApprovalAmount: 27000000, actualApprovalAmount: 28800000, originalContractAmount: 28800000,
    adjustedContractAmount: 28800000, completionAmount: 28650000, settlementAmount: 28300000,
    bookAmount: 28300000, fixedAssetAmount: 28800000, approvalDate: '2024-11-08',
    ownerUnit: '炼铁厂', supervisorUnit: '工程管理部', projectManager: '张建国', isEcoReview: '是',
    approvalStatus: '申请通过', isFormalEval: '是', applyReason: '煤粉制备系统改造完成后，煤粉细度、产量均达到设计指标，环保排放达标，已稳定运行6个月，申请提前后评价。',
    applySuggestion: '建议总结煤粉制备系统改造经验，推广至其他高炉。', acceptanceFiles: ['煤粉制备系统验收报告.pdf', '环保监测报告.pdf'],
    applyFiles: ['设备运行数据报告.pdf', '能耗分析报告.pdf'], currentReviewer: '总师室-赵明辉', applyDate: '2025-10-20',
  },
  {
    id: 'ee-003', approvalNo: 'LX-2025-003', planNo: 'JH-2025-003', projectName: '炼钢厂钢包烘烤器节能改造',
    approvalDesc: '钢包烘烤器蓄热式节能技术改造', projectType: '技改项目', approvalAmount: 8900000,
    preApprovalAmount: 8500000, actualApprovalAmount: 8900000, originalContractAmount: 8900000,
    adjustedContractAmount: 9200000, completionAmount: 9150000, settlementAmount: 9080000,
    bookAmount: 9080000, fixedAssetAmount: 9200000, approvalDate: '2025-06-01',
    ownerUnit: '炼钢厂', supervisorUnit: '工程管理部', projectManager: '李卫东', isEcoReview: '否',
    approvalStatus: '未申请', isFormalEval: '', applyReason: '', applySuggestion: '', acceptanceFiles: [], applyFiles: [], currentReviewer: '', applyDate: '',
  },
  {
    id: 'ee-004', approvalNo: 'LX-2025-001', planNo: 'JH-2025-001', projectName: '宽厚板厂轧机主传动系统升级',
    approvalDesc: '轧机主传动电机、变频器、控制系统升级改造', projectType: '技改项目', approvalAmount: 48500000,
    preApprovalAmount: 47000000, actualApprovalAmount: 48500000, originalContractAmount: 48500000,
    adjustedContractAmount: 49600000, completionAmount: 49300000, settlementAmount: 48900000,
    bookAmount: 48900000, fixedAssetAmount: 49600000, approvalDate: '2025-06-01',
    ownerUnit: '宽厚板厂', supervisorUnit: '工程管理部', projectManager: '赵永刚', isEcoReview: '否',
    approvalStatus: '已驳回', isFormalEval: '否', applyReason: '项目尚未完成交工竣工，申请提前后评价条件不充分。',
    applySuggestion: '待项目交工竣工后再行申请。', acceptanceFiles: [], applyFiles: [], currentReviewer: '总师室-钱志伟', applyDate: '2025-12-01',
  },
  {
    id: 'ee-005', approvalNo: 'LX-2024-008', planNo: 'JH-2024-008', projectName: '全厂道路及排水管网改造工程',
    approvalDesc: '厂区主干道路面层翻新、排水管网清淤更换', projectType: '基建项目', approvalAmount: 15600000,
    preApprovalAmount: 15000000, actualApprovalAmount: 15600000, originalContractAmount: 15600000,
    adjustedContractAmount: 16200000, completionAmount: 16100000, settlementAmount: 15950000,
    bookAmount: 15950000, fixedAssetAmount: 16200000, approvalDate: '2024-12-01',
    ownerUnit: '公共设施部', supervisorUnit: '工程管理部', projectManager: '陈明辉', isEcoReview: '否',
    approvalStatus: '审批中', isFormalEval: '是', applyReason: '厂区道路及排水管网改造已全面完工，道路通行和排水功能恢复正常，申请提前后评价。',
    applySuggestion: '建议后续加强排水管网日常维护和定期清理。', acceptanceFiles: ['道路验收报告.pdf', '排水管网验收报告.pdf'],
    applyFiles: ['竣工图纸.pdf'], currentReviewer: '总师室论证员-孙文博', applyDate: '2025-12-10',
  },
  {
    id: 'ee-006', approvalNo: 'LX-2025-006', planNo: 'JH-2025-006', projectName: '炼钢厂转炉汽化冷却系统改造',
    approvalDesc: '3座转炉汽化冷却系统全过程改造', projectType: '技改项目', approvalAmount: 38000000,
    preApprovalAmount: 36000000, actualApprovalAmount: 38000000, originalContractAmount: 38000000,
    adjustedContractAmount: 38000000, completionAmount: 37850000, settlementAmount: 37500000,
    bookAmount: 37500000, fixedAssetAmount: 38000000, approvalDate: '2025-05-18',
    ownerUnit: '炼钢厂', supervisorUnit: '工程管理部', projectManager: '周建华', isEcoReview: '否',
    approvalStatus: '未申请', isFormalEval: '', applyReason: '', applySuggestion: '', acceptanceFiles: [], applyFiles: [], currentReviewer: '', applyDate: '',
  },
  {
    id: 'ee-007', approvalNo: 'LX-2024-012', planNo: 'JH-2024-012', projectName: '大棒厂轧线设备升级改造',
    approvalDesc: '轧线主轧机、冷床、精整线设备升级', projectType: '技改项目', approvalAmount: 71500000,
    preApprovalAmount: 70000000, actualApprovalAmount: 71500000, originalContractAmount: 71500000,
    adjustedContractAmount: 72800000, completionAmount: 72500000, settlementAmount: 72000000,
    bookAmount: 72000000, fixedAssetAmount: 72800000, approvalDate: '2024-10-15',
    ownerUnit: '大棒厂', supervisorUnit: '工程管理部', projectManager: '吴国栋', isEcoReview: '否',
    approvalStatus: '申请通过', isFormalEval: '是', applyReason: '轧线设备升级后产能提升15%，产品质量合格率提升至99.2%，已达到预期目标，提前申请后评价。',
    applySuggestion: '建议在同类轧线设备升级中推广应用该技术方案。', acceptanceFiles: ['设备验收报告.pdf', '产能测试报告.pdf', '质量检测报告.pdf'],
    applyFiles: ['技术总结.pdf'], currentReviewer: '总师室-赵明辉', applyDate: '2025-09-05',
  },
  {
    id: 'ee-008', approvalNo: 'LX-2025-008', planNo: 'JH-2025-008', projectName: '能源中心220kV变电站扩建',
    approvalDesc: '新增2台220kV主变压器及配套GIS设备', projectType: '基建项目', approvalAmount: 63500000,
    preApprovalAmount: 62000000, actualApprovalAmount: 63500000, originalContractAmount: 63500000,
    adjustedContractAmount: 65800000, completionAmount: 65500000, settlementAmount: 65000000,
    bookAmount: 65000000, fixedAssetAmount: 65800000, approvalDate: '2025-06-10',
    ownerUnit: '能源中心', supervisorUnit: '工程管理部', projectManager: '郑国梁', isEcoReview: '是',
    approvalStatus: '未申请', isFormalEval: '', applyReason: '', applySuggestion: '', acceptanceFiles: [], applyFiles: [], currentReviewer: '', applyDate: '',
  },
  {
    id: 'ee-009', approvalNo: 'LX-2025-007', planNo: 'JH-2025-007', projectName: '烧结机烟气脱硫脱硝改造',
    approvalDesc: '1#2#烧结机烟气脱硫脱硝系统', projectType: '环保项目', approvalAmount: 63200000,
    preApprovalAmount: 61000000, actualApprovalAmount: 63200000, originalContractAmount: 63200000,
    adjustedContractAmount: 63200000, completionAmount: 63000000, settlementAmount: 62600000,
    bookAmount: 62600000, fixedAssetAmount: 63200000, approvalDate: '2025-03-10',
    ownerUnit: '烧结厂', supervisorUnit: '工程管理部', projectManager: '马建国', isEcoReview: '是',
    approvalStatus: '审批中', isFormalEval: '否', applyReason: '脱硫脱硝系统投运后排放指标持续达标，但需待交工竣工手续完成后才能正式申请后评价。',
    applySuggestion: '建议先行开展后评价资料准备工作。', acceptanceFiles: ['环保验收监测报告.pdf'],
    applyFiles: [], currentReviewer: '本单位分管领导-刘志刚', applyDate: '2025-11-28',
  },
  {
    id: 'ee-010', approvalNo: 'LX-2025-010', planNo: 'JH-2025-010', projectName: '全厂能源管理系统建设',
    approvalDesc: '能源管理系统软件开发、集成、调试', projectType: '信息化项目', approvalAmount: 18500000,
    preApprovalAmount: 18000000, actualApprovalAmount: 18500000, originalContractAmount: 18500000,
    adjustedContractAmount: 19200000, completionAmount: 19100000, settlementAmount: 18900000,
    bookAmount: 18900000, fixedAssetAmount: 19200000, approvalDate: '2025-04-05',
    ownerUnit: '能源中心', supervisorUnit: '工程管理部', projectManager: '黄明达', isEcoReview: '否',
    approvalStatus: '已驳回', isFormalEval: '是', applyReason: '能源管理系统上线后功能不完善，部分数据采集点未对接完成。',
    applySuggestion: '待系统功能完善后再行申请。', acceptanceFiles: [], applyFiles: [], currentReviewer: '', applyDate: '2025-11-01',
  },
  {
    id: 'ee-011', approvalNo: 'LX-2024-018', planNo: 'JH-2024-018', projectName: '三炼钢连铸机改造工程',
    approvalDesc: '1#2#连铸机本体改造含土建钢结构', projectType: '技改项目', approvalAmount: 85600000,
    preApprovalAmount: 83000000, actualApprovalAmount: 85600000, originalContractAmount: 85600000,
    adjustedContractAmount: 87250000, completionAmount: 86800000, settlementAmount: 86200000,
    bookAmount: 86200000, fixedAssetAmount: 87250000, approvalDate: '2024-12-20',
    ownerUnit: '炼钢厂', supervisorUnit: '工程管理部', projectManager: '钱志宏', isEcoReview: '否',
    approvalStatus: '未申请', isFormalEval: '', applyReason: '', applySuggestion: '', acceptanceFiles: [], applyFiles: [], currentReviewer: '', applyDate: '',
  },
  {
    id: 'ee-012', approvalNo: 'LX-2025-011', planNo: 'JH-2025-011', projectName: '2号高炉热风炉大修工程',
    approvalDesc: '4座热风炉大修含炉壳更换耐材砌筑', projectType: '维修项目', approvalAmount: 42500000,
    preApprovalAmount: 41000000, actualApprovalAmount: 42500000, originalContractAmount: 42500000,
    adjustedContractAmount: 43800000, completionAmount: 43500000, settlementAmount: 43200000,
    bookAmount: 43200000, fixedAssetAmount: 43800000, approvalDate: '2025-02-20',
    ownerUnit: '炼铁厂', supervisorUnit: '工程管理部', projectManager: '冯志伟', isEcoReview: '否',
    approvalStatus: '申请通过', isFormalEval: '是', applyReason: '热风炉大修后风温提高80℃，高炉利用系数提升，已稳定运行超过5个月，申请提前后评价。',
    applySuggestion: '建议总结热风炉大修技术方案，纳入标准化检修规程。', acceptanceFiles: ['热风炉验收报告.pdf', '风温测试记录.pdf'],
    applyFiles: ['大修总结报告.pdf', '耐材使用报告.pdf'], currentReviewer: '总师室-赵明辉', applyDate: '2025-11-20',
  },
];

// 审批详情模拟数据
export function getEarlyEvaluationApprovalDetail(projectId: string): { approvalNo: string; applicant: string; applyTime: string; nodes: ApprovalNode[] } | null {
  const project = earlyEvaluationProjects.find(p => p.id === projectId);
  if (!project || project.approvalStatus === '未申请') return null;

  const allNodes: ApprovalNode[] = [
    { seq: 1, nodeName: '本单位分管领导', reviewer: '刘志刚', status: 'approved', opinion: '同意申请提前后评价，项目目标达成情况良好。', time: project.approvalStatus === '审批中' ? project.applyDate : '2025-12-01' },
    { seq: 2, nodeName: '事业部中层领导', reviewer: '李志明', status: project.approvalStatus === '审批中' ? 'processing' : (project.approvalStatus === '已驳回' ? 'rejected' : 'approved'), opinion: project.approvalStatus === '已驳回' ? '项目条件不满足，建议驳回。' : '同意，转总师室论证。', time: project.approvalStatus === '已驳回' ? '2025-12-05' : (project.approvalStatus === '审批中' ? '' : '2025-12-05') },
    { seq: 3, nodeName: '总师室（论证员）', reviewer: '孙文博', status: project.approvalStatus === '已驳回' ? 'pending' : (project.approvalStatus === '申请通过' ? 'approved' : 'pending'), opinion: project.approvalStatus === '申请通过' ? '经论证确认，项目达到预期效果，同意提前后评价。' : '', time: project.approvalStatus === '申请通过' ? '2025-12-10' : '' },
    { seq: 4, nodeName: '总师室分管主任工程师', reviewer: '赵明辉', status: project.approvalStatus === '申请通过' ? 'approved' : 'pending', opinion: project.approvalStatus === '申请通过' ? '审核通过，同意提前后评价。' : '', time: project.approvalStatus === '申请通过' ? '2025-12-12' : '' },
    { seq: 5, nodeName: '副总工程师', reviewer: '钱志伟', status: project.approvalStatus === '申请通过' ? 'approved' : 'pending', opinion: project.approvalStatus === '申请通过' ? '同意。' : '', time: project.approvalStatus === '申请通过' ? '2025-12-15' : '' },
    { seq: 6, nodeName: '总师室领导', reviewer: '赵明辉', status: project.approvalStatus === '申请通过' ? 'approved' : 'pending', opinion: project.approvalStatus === '申请通过' ? '批准提前后评价申请。' : '', time: project.approvalStatus === '申请通过' ? '2025-12-18' : '' },
  ];

  return {
    approvalNo: `SQ-${project.approvalNo}`,
    applicant: project.projectManager,
    applyTime: project.applyDate || '',
    nodes: allNodes,
  };
}