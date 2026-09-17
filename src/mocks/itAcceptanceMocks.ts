export interface ItAcceptanceApplication {
  id: string;
  projectNo: string;
  projectName: string;
  projectType: string;
  acceptanceType: string;
  acceptanceNote?: string;
  creator: string;
  createTime: string;
  approvalNode: string;
  status: string;
  selectedContracts?: string[];
  attachments?: { name: string; required: boolean; uploaded: boolean }[];
}

export interface ItAcceptanceContract {
  id: string;
  contractNo: string;
  contractName: string;
  contractAmount: number;
  acceptanceDate?: string;
  isPositionOptimized: string;
  staffCount?: number;
  isEconomicBenefit: string;
  benefitAmount?: number;
  acceptanceStatus: string;
  selected: boolean;
}

export interface ItAcceptanceProject {
  id: string;
  projectNo: string;
  projectName: string;
  projectType: string;
  contracts: ItAcceptanceContract[];
}

export interface ResearchConfirmItem {
  id: string;
  projectNo: string;
  projectName: string;
  projectType: string;
  acceptanceType: string;
  creator: string;
  createDate: string;
}

export const itAcceptanceProjects: ItAcceptanceProject[] = [
  {
    id: 'iap-1', projectNo: 'NG-2024-0045', projectName: '智慧能源管控平台二期建设', projectType: '信息化',
    contracts: [
      { id: 'iac-1', contractNo: 'HT-2024-0188', contractName: '能源管控平台软件开发合同', contractAmount: 8200000, acceptanceDate: '', isPositionOptimized: '否', staffCount: 0, isEconomicBenefit: '是', benefitAmount: 1800000, acceptanceStatus: '否', selected: false },
      { id: 'iac-2', contractNo: 'HT-2024-0189', contractName: '数据采集设备采购合同', contractAmount: 5300000, acceptanceDate: '', isPositionOptimized: '否', staffCount: 0, isEconomicBenefit: '否', benefitAmount: 0, acceptanceStatus: '否', selected: false },
      { id: 'iac-3', contractNo: 'HT-2024-0190', contractName: '系统集成及实施合同', contractAmount: 5000000, acceptanceDate: '', isPositionOptimized: '是', staffCount: 8, isEconomicBenefit: '是', benefitAmount: 2500000, acceptanceStatus: '否', selected: false },
    ],
  },
  {
    id: 'iap-2', projectNo: 'NG-2025-0012', projectName: '数字孪生工厂一期建设', projectType: '信息化',
    contracts: [
      { id: 'iac-4', contractNo: 'HT-2025-0018', contractName: '数字孪生平台开发合同', contractAmount: 15000000, acceptanceDate: '', isPositionOptimized: '是', staffCount: 12, isEconomicBenefit: '是', benefitAmount: 3200000, acceptanceStatus: '否', selected: false },
      { id: 'iac-5', contractNo: 'HT-2025-0019', contractName: '三维建模及数据采集合同', contractAmount: 8500000, acceptanceDate: '', isPositionOptimized: '否', staffCount: 0, isEconomicBenefit: '否', benefitAmount: 0, acceptanceStatus: '否', selected: false },
      { id: 'iac-6', contractNo: 'HT-2025-0020', contractName: '硬件设备采购及安装合同', contractAmount: 9000000, acceptanceDate: '', isPositionOptimized: '是', staffCount: 5, isEconomicBenefit: '否', benefitAmount: 0, acceptanceStatus: '否', selected: false },
    ],
  },
  {
    id: 'iap-3', projectNo: 'NG-2024-0078', projectName: '设备全生命周期管理系统', projectType: '信息化',
    contracts: [
      { id: 'iac-7', contractNo: 'HT-2024-0320', contractName: '设备管理系统软件开发', contractAmount: 6800000, acceptanceDate: '', isPositionOptimized: '是', staffCount: 6, isEconomicBenefit: '是', benefitAmount: 1500000, acceptanceStatus: '否', selected: false },
      { id: 'iac-8', contractNo: 'HT-2024-0321', contractName: 'RFID标签及读卡器采购', contractAmount: 3200000, acceptanceDate: '', isPositionOptimized: '否', staffCount: 0, isEconomicBenefit: '否', benefitAmount: 0, acceptanceStatus: '否', selected: false },
    ],
  },
  {
    id: 'iap-4', projectNo: 'NG-2025-0008', projectName: '安全生产管理信息化平台', projectType: '信息化',
    contracts: [
      { id: 'iac-9', contractNo: 'HT-2025-0035', contractName: '安全管控平台开发', contractAmount: 5800000, acceptanceDate: '', isPositionOptimized: '否', staffCount: 0, isEconomicBenefit: '否', benefitAmount: 0, acceptanceStatus: '否', selected: false },
      { id: 'iac-10', contractNo: 'HT-2025-0036', contractName: '视频监控及传感器部署', contractAmount: 4200000, acceptanceDate: '', isPositionOptimized: '否', staffCount: 0, isEconomicBenefit: '否', benefitAmount: 0, acceptanceStatus: '否', selected: false },
      { id: 'iac-11', contractNo: 'HT-2025-0037', contractName: '系统集成及运维服务', contractAmount: 3000000, acceptanceDate: '', isPositionOptimized: '是', staffCount: 4, isEconomicBenefit: '是', benefitAmount: 980000, acceptanceStatus: '否', selected: false },
    ],
  },
  {
    id: 'iap-5', projectNo: 'NG-2025-0030', projectName: '智能仓储物流管理系统', projectType: '信息化',
    contracts: [
      { id: 'iac-12', contractNo: 'HT-2025-0082', contractName: 'WMS系统开发合同', contractAmount: 6200000, acceptanceDate: '', isPositionOptimized: '是', staffCount: 10, isEconomicBenefit: '是', benefitAmount: 2800000, acceptanceStatus: '否', selected: false },
      { id: 'iac-13', contractNo: 'HT-2025-0083', contractName: 'AGV及自动化设备采购', contractAmount: 11000000, acceptanceDate: '', isPositionOptimized: '否', staffCount: 0, isEconomicBenefit: '否', benefitAmount: 0, acceptanceStatus: '否', selected: false },
    ],
  },
  {
    id: 'iap-6', projectNo: 'NG-2025-0042', projectName: '数据治理及BI分析平台', projectType: '信息化',
    contracts: [
      { id: 'iac-14', contractNo: 'HT-2025-0150', contractName: '数据中台开发合同', contractAmount: 9500000, acceptanceDate: '', isPositionOptimized: '是', staffCount: 15, isEconomicBenefit: '是', benefitAmount: 4200000, acceptanceStatus: '否', selected: false },
      { id: 'iac-15', contractNo: 'HT-2025-0151', contractName: 'BI报表及可视化开发', contractAmount: 4800000, acceptanceDate: '', isPositionOptimized: '否', staffCount: 0, isEconomicBenefit: '否', benefitAmount: 0, acceptanceStatus: '否', selected: false },
    ],
  },
];

export const itAcceptanceApplications: ItAcceptanceApplication[] = [
  { id: 'ia-1', projectNo: 'NG-2024-0045', projectName: '智慧能源管控平台二期建设', projectType: '信息化', acceptanceType: '整体验收', creator: '王志刚', createTime: '2025-06-10 09:00:00', approvalNode: '数研院审批', status: '已确认', selectedContracts: ['iac-1', 'iac-2', 'iac-3'] },
  { id: 'ia-2', projectNo: 'NG-2025-0012', projectName: '数字孪生工厂一期建设', projectType: '信息化', acceptanceType: '分项验收', creator: '吴晓东', createTime: '2025-06-15 14:30:00', approvalNode: '事业部审批', status: '审批中', selectedContracts: ['iac-4', 'iac-5'] },
  { id: 'ia-3', projectNo: 'NG-2024-0078', projectName: '设备全生命周期管理系统', projectType: '信息化', acceptanceType: '整体验收', creator: '杨志强', createTime: '2025-06-18 10:15:00', approvalNode: '信息技术部审批', status: '内部审核通过', selectedContracts: ['iac-7', 'iac-8'] },
  { id: 'ia-4', projectNo: 'NG-2025-0008', projectName: '安全生产管理信息化平台', projectType: '信息化', acceptanceType: '分项验收', creator: '孙志强', createTime: '2025-06-20 16:00:00', approvalNode: '安全环保部审批', status: '已驳回', selectedContracts: ['iac-9'] },
  { id: 'ia-5', projectNo: 'NG-2025-0030', projectName: '智能仓储物流管理系统', projectType: '信息化', acceptanceType: '整体验收', creator: '陈立新', createTime: '2025-06-22 11:30:00', approvalNode: '-', status: '新建', selectedContracts: [] },
  { id: 'ia-6', projectNo: 'NG-2025-0042', projectName: '数据治理及BI分析平台', projectType: '信息化', acceptanceType: '分项验收', creator: '林晓明', createTime: '2025-06-25 08:45:00', approvalNode: '数研院审批', status: '审批中', selectedContracts: ['iac-14'] },
  { id: 'ia-7', projectNo: 'NG-2024-0045', projectName: '智慧能源管控平台二期建设', projectType: '信息化', acceptanceType: '分项验收', creator: '王志刚', createTime: '2025-06-05 13:00:00', approvalNode: '事业部审批', status: '已确认', selectedContracts: ['iac-1', 'iac-3'] },
  { id: 'ia-8', projectNo: 'NG-2025-0012', projectName: '数字孪生工厂一期建设', projectType: '信息化', acceptanceType: '整体验收', creator: '吴晓东', createTime: '2025-06-01 10:00:00', approvalNode: '-', status: '新建', selectedContracts: [] },
];

export const researchConfirmList: ResearchConfirmItem[] = [
  { id: 'rc-1', projectNo: 'NG-2024-0045', projectName: '智慧能源管控平台二期建设', projectType: '信息化', acceptanceType: '整体验收', creator: '王志刚', createDate: '2025-06-12' },
  { id: 'rc-2', projectNo: 'NG-2024-0078', projectName: '设备全生命周期管理系统', projectType: '信息化', acceptanceType: '整体验收', creator: '杨志强', createDate: '2025-06-20' },
  { id: 'rc-3', projectNo: 'NG-2025-0025', projectName: '制造执行系统(MES)升级', projectType: '信息化', acceptanceType: '分项验收', creator: '周建国', createDate: '2025-05-28' },
  { id: 'rc-4', projectNo: 'NG-2025-0015', projectName: '供应链协同管理平台', projectType: '信息化', acceptanceType: '整体验收', creator: '李明辉', createDate: '2025-06-02' },
  { id: 'rc-5', projectNo: 'NG-2024-0065', projectName: '人力资源信息化系统', projectType: '信息化', acceptanceType: '分项验收', creator: '张伟强', createDate: '2025-06-08' },
  { id: 'rc-6', projectNo: 'NG-2025-0038', projectName: '质量追溯及分析系统', projectType: '信息化', acceptanceType: '整体验收', creator: '黄建华', createDate: '2025-06-15' },
];

export const approvalNodes = [
  { nodeId: 'an-1', nodeName: '项目部审核', approver: '项目负责人', approverDept: '项目部', sequence: 1 },
  { nodeId: 'an-2', nodeName: '信息技术部审批', approver: '吴建国', approverDept: '信息技术部', sequence: 2 },
  { nodeId: 'an-3', nodeName: '数研院呈核', approver: '郑文斌', approverDept: '数研院', sequence: 3 },
  { nodeId: 'an-4', nodeName: '安全环保部会签', approver: '孙志强', approverDept: '安全环保部', sequence: 4 },
  { nodeId: 'an-5', nodeName: '事业部确认', approver: '林晓东', approverDept: '项目管理办公室', sequence: 5 },
];

export const approvalHistories: { id: string; applicationId: string; sequence: number; nodeName: string; approver: string; status: string; opinion: string; time: string }[] = [
  { id: 'ah-1', applicationId: 'ia-1', sequence: 1, nodeName: '项目部审核', approver: '王志刚', status: '已通过', opinion: '建设内容完成，系统运行稳定，同意验收', time: '2025-06-11 10:30:00' },
  { id: 'ah-2', applicationId: 'ia-1', sequence: 2, nodeName: '信息技术部审批', approver: '吴建国', status: '已通过', opinion: '技术方案合理，审批通过', time: '2025-06-11 16:45:00' },
  { id: 'ah-3', applicationId: 'ia-1', sequence: 3, nodeName: '数研院呈核', approver: '郑文斌', status: '已通过', opinion: '验收材料齐全，同意', time: '2025-06-12 09:15:00' },
  { id: 'ah-4', applicationId: 'ia-2', sequence: 1, nodeName: '项目部审核', approver: '吴晓东', status: '已通过', opinion: '分项验收内容完成', time: '2025-06-16 14:00:00' },
  { id: 'ah-5', applicationId: 'ia-2', sequence: 2, nodeName: '事业部审批', approver: '林晓东', status: '审批中', opinion: '', time: '' },
  { id: 'ah-6', applicationId: 'ia-3', sequence: 1, nodeName: '项目部审核', approver: '杨志强', status: '已通过', opinion: '系统上线运行正常，申请验收', time: '2025-06-19 08:30:00' },
  { id: 'ah-7', applicationId: 'ia-3', sequence: 2, nodeName: '信息技术部审批', approver: '吴建国', status: '已通过', opinion: '技术审查通过', time: '2025-06-19 15:20:00' },
  { id: 'ah-8', applicationId: 'ia-4', sequence: 1, nodeName: '项目部审核', approver: '孙志强', status: '已驳回', opinion: '安全功能测试不充分，请补充测试报告后重新提交', time: '2025-06-21 11:00:00' },
];

export const requiredFiles = [
  '合同', '方案建议书', '用户培训记录', '用户操作手册', '供应商测试报告',
  '用户使用报告', '数据治理交付件', '详细设计文档', '技术协议', '需求规格说明书',
  '上线试运行方案', '测试用例', '用户测试', '功能核验单', '会议纪要', '硬件到货确认单',
];

export const requiredFileMap: Record<string, boolean> = {
  '合同': true, '方案建议书': true, '用户培训记录': true, '用户操作手册': true,
  '供应商测试报告': true, '用户使用报告': true, '数据治理交付件': false, '详细设计文档': true,
  '技术协议': true, '需求规格说明书': true, '上线试运行方案': true, '测试用例': true,
  '用户测试': true, '功能核验单': true, '会议纪要': true, '硬件到货确认单': false,
};