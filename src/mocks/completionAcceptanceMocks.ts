export interface CompletionProject {
  id: string;
  projectNo: string;
  planNo: string;
  projectName: string;
  projectType: string;
  approvalAmount: number;
  preApprovalAmount: number;
  actualApprovalAmount: number;
  originalContractAmount: number;
  adjustedContractAmount: number;
  approvalDate: string;
  proDept: string;
  ownerUnit: string;
  projectManager: string;
  completionDate?: string;
}

export interface TechRenovationProject {
  id: string;
  projectNo: string;
  businessUnit: string;
  projectName: string;
  projectType: string;
  approvalAmount: number;
  originalContractAmount: number;
  adjustedContractAmount: number;
  completionAmount: number;
  settlementAmount: number;
  fixedAssetAmount: number;
  approvalDate: string;
  completionDate: string;
  ownerUnit: string;
  projectManager: string;
}

export interface CompletionApplication {
  id: string;
  changeNo: string;
  projectNo: string;
  planNo: string;
  projectName: string;
  changeReason: string;
  changeNote: string;
  changeType: string;
  changeDate: string;
  status: string;
  fileCount: number;
  projMgrConfirmed: string;
  projectType?: string;
  creator: string;
  createDate: string;
  createTime: string;
  modifier?: string;
  modifyDate?: string;
  modifyTime?: string;
  attachments: CompletionAttachment[];
  confirmedBy?: string;
  confirmedDate?: string;
}

export interface CompletionAttachment {
  id: string;
  projectPhase: string;
  contractType: string;
  businessCategory: string;
  fileCategory: string;
  isConfidential: string;
  fileCount: number;
  remark: string;
  fileName?: string;
  uploadTime?: string;
  uploader?: string;
  version?: string;
}

export const completionProjects: CompletionProject[] = [
  { id: 'cp-1', projectNo: 'NG-2024-0012', planNo: 'JH-2024-0088', projectName: '炼钢事业部转炉智能吹炼系统升级', projectType: '零固', approvalAmount: 38500000, preApprovalAmount: 35000000, actualApprovalAmount: 38200000, originalContractAmount: 36800000, adjustedContractAmount: 37500000, approvalDate: '2024-03-15', proDept: '炼钢事业部', ownerUnit: '南钢股份炼钢厂', projectManager: '周建国' },
  { id: 'cp-2', projectNo: 'NG-2024-0018', planNo: 'JH-2024-0102', projectName: '中板厂热处理线节能改造', projectType: '大修', approvalAmount: 12600000, preApprovalAmount: 12000000, actualApprovalAmount: 12600000, originalContractAmount: 11800000, adjustedContractAmount: 12200000, approvalDate: '2024-04-08', proDept: '中板事业部', ownerUnit: '南钢股份中板厂', projectManager: '李明辉' },
  { id: 'cp-3', projectNo: 'NG-2024-0025', planNo: 'JH-2024-0125', projectName: '高炉出铁场除尘超低排放改造', projectType: '环保提升', approvalAmount: 25800000, preApprovalAmount: 24000000, actualApprovalAmount: 25600000, originalContractAmount: 24800000, adjustedContractAmount: 25300000, approvalDate: '2024-05-20', proDept: '炼铁事业部', ownerUnit: '南钢股份炼铁厂', projectManager: '张伟强' },
  { id: 'cp-4', projectNo: 'NG-2024-0031', planNo: 'JH-2024-0148', projectName: '宽厚板厂轧机主传动系统技改', projectType: '技改', approvalAmount: 46200000, preApprovalAmount: 45000000, actualApprovalAmount: 46000000, originalContractAmount: 44500000, adjustedContractAmount: 45200000, approvalDate: '2024-06-12', proDept: '宽厚板事业部', ownerUnit: '南钢股份宽厚板厂', projectManager: '陈志远' },
  { id: 'cp-5', projectNo: 'NG-2024-0045', planNo: 'JH-2024-0188', projectName: '智慧能源管控平台二期建设', projectType: '信息化', approvalAmount: 18500000, preApprovalAmount: 17000000, actualApprovalAmount: 18300000, originalContractAmount: 17500000, adjustedContractAmount: 18000000, approvalDate: '2024-07-25', proDept: '能源环保部', ownerUnit: '南钢股份', projectManager: '王志刚' },
  { id: 'cp-6', projectNo: 'NG-2024-0052', planNo: 'JH-2024-0205', projectName: '烧结厂余热回收利用改造', projectType: '节能', approvalAmount: 29500000, preApprovalAmount: 28000000, actualApprovalAmount: 29200000, originalContractAmount: 28200000, adjustedContractAmount: 28800000, approvalDate: '2024-08-10', proDept: '烧结事业部', ownerUnit: '南钢股份烧结厂', projectManager: '赵海峰' },
  { id: 'cp-7', projectNo: 'NG-2024-0060', planNo: 'JH-2024-0232', projectName: '中厚板卷厂矫直机更新', projectType: '零固', approvalAmount: 15800000, preApprovalAmount: 14500000, actualApprovalAmount: 15700000, originalContractAmount: 14800000, adjustedContractAmount: 15200000, approvalDate: '2024-09-05', proDept: '中厚板事业部', ownerUnit: '南钢股份中厚板卷厂', projectManager: '孙立军' },
  { id: 'cp-8', projectNo: 'NG-2025-0005', planNo: 'JH-2025-0022', projectName: '原料码头环保封闭大棚建设', projectType: '环保提升', approvalAmount: 78500000, preApprovalAmount: 75000000, actualApprovalAmount: 78000000, originalContractAmount: 75500000, adjustedContractAmount: 76800000, approvalDate: '2025-01-18', proDept: '物流事业部', ownerUnit: '南钢股份物流中心', projectManager: '刘国栋' },
  { id: 'cp-9', projectNo: 'NG-2025-0012', planNo: 'JH-2025-0048', projectName: '数字孪生工厂一期建设', projectType: '信息化', approvalAmount: 32500000, preApprovalAmount: 30000000, actualApprovalAmount: 32200000, originalContractAmount: 31200000, adjustedContractAmount: 31800000, approvalDate: '2025-02-25', proDept: '数研院', ownerUnit: '南钢股份', projectManager: '吴晓东' },
  { id: 'cp-10', projectNo: 'NG-2025-0019', planNo: 'JH-2025-0070', projectName: '棒材厂高速上料系统改造', projectType: '技改', approvalAmount: 21800000, preApprovalAmount: 20000000, actualApprovalAmount: 21600000, originalContractAmount: 20800000, adjustedContractAmount: 21200000, approvalDate: '2025-03-15', proDept: '棒材事业部', ownerUnit: '南钢股份棒材厂', projectManager: '黄建华' },
];

export const techRenovationProjects: TechRenovationProject[] = [
  { id: 'tr-1', projectNo: 'NG-2024-0031', businessUnit: '宽厚板事业部', projectName: '宽厚板厂轧机主传动系统技改', projectType: '技改', approvalAmount: 46200000, originalContractAmount: 44500000, adjustedContractAmount: 45200000, completionAmount: 44800000, settlementAmount: 45000000, fixedAssetAmount: 45200000, approvalDate: '2024-06-12', completionDate: '2025-02-20', ownerUnit: '南钢股份宽厚板厂', projectManager: '陈志远' },
  { id: 'tr-2', projectNo: 'NG-2024-0072', businessUnit: '炼铁事业部', projectName: '高炉炉顶均压放散系统技改', projectType: '技改', approvalAmount: 19500000, originalContractAmount: 18800000, adjustedContractAmount: 19200000, completionAmount: 19000000, settlementAmount: 19100000, fixedAssetAmount: 19200000, approvalDate: '2024-08-20', completionDate: '2025-03-15', ownerUnit: '南钢股份炼铁厂', projectManager: '李伟强' },
  { id: 'tr-3', projectNo: 'NG-2025-0019', businessUnit: '棒材事业部', projectName: '棒材厂高速上料系统改造', projectType: '技改', approvalAmount: 21800000, originalContractAmount: 20800000, adjustedContractAmount: 21200000, completionAmount: 21000000, settlementAmount: 21100000, fixedAssetAmount: 21200000, approvalDate: '2025-03-15', completionDate: '2025-05-10', ownerUnit: '南钢股份棒材厂', projectManager: '黄建华' },
  { id: 'tr-4', projectNo: 'NG-2025-0028', businessUnit: '炼钢事业部', projectName: '连铸机结晶器液面自动控制改造', projectType: '技改', approvalAmount: 16700000, originalContractAmount: 16200000, adjustedContractAmount: 16500000, completionAmount: 16400000, settlementAmount: 16450000, fixedAssetAmount: 16500000, approvalDate: '2025-04-10', completionDate: '2025-06-05', ownerUnit: '南钢股份炼钢厂', projectManager: '杨志强' },
  { id: 'tr-5', projectNo: 'NG-2025-0035', businessUnit: '中板事业部', projectName: '热处理炉燃烧系统智能控制技改', projectType: '技改', approvalAmount: 14200000, originalContractAmount: 13500000, adjustedContractAmount: 14000000, completionAmount: 13800000, settlementAmount: 13900000, fixedAssetAmount: 14000000, approvalDate: '2025-05-08', completionDate: '2025-06-18', ownerUnit: '南钢股份中板厂', projectManager: '赵海波' },
];

export const completionApplications: CompletionApplication[] = [
  {
    id: 'ca-1', changeNo: 'YG-2025-0001', projectNo: 'NG-2024-0012', planNo: 'JH-2024-0088', projectName: '炼钢事业部转炉智能吹炼系统升级',
    changeReason: '项目已完成合同约定全部建设内容', changeNote: '经项目部组织验收，各项指标达标，同意办理交工手续', changeType: '交工', changeDate: '2025-06-15',
    status: '已确认', fileCount: 18, projMgrConfirmed: '是', projectType: '零固', creator: '周建国', createDate: '2025-06-10', createTime: '09:30:00',
    confirmedBy: '周建国', confirmedDate: '2025-06-18',
    attachments: [
      { id: 'att-1', projectPhase: '施工阶段', contractType: '设备采购', businessCategory: '设备', fileCategory: '设备验收报告', isConfidential: '否', fileCount: 3, remark: '转炉本体设备验收' },
      { id: 'att-2', projectPhase: '调试阶段', contractType: '系统集成', businessCategory: '软件', fileCategory: '系统测试报告', isConfidential: '是', fileCount: 5, remark: '智能吹炼模型测试' },
    ],
  },
  {
    id: 'ca-2', changeNo: 'YG-2025-0002', projectNo: 'NG-2024-0012', planNo: 'JH-2024-0088', projectName: '炼钢事业部转炉智能吹炼系统升级',
    changeReason: '项目竣工验收', changeNote: '全部设备投入运行满三个月，性能稳定，申请竣工', changeType: '竣工', changeDate: '2025-06-20',
    status: '已确认', fileCount: 25, projMgrConfirmed: '是', projectType: '零固', creator: '周建国', createDate: '2025-06-19', createTime: '14:00:00',
    confirmedBy: '周建国', confirmedDate: '2025-06-22',
    attachments: [
      { id: 'att-3', projectPhase: '竣工阶段', contractType: '设备采购', businessCategory: '设备', fileCategory: '竣工报告', isConfidential: '否', fileCount: 8, remark: '转炉吹炼系统竣工资料' },
    ],
  },
  {
    id: 'ca-3', changeNo: 'YG-2025-0003', projectNo: 'NG-2024-0031', planNo: 'JH-2024-0148', projectName: '宽厚板厂轧机主传动系统技改',
    changeReason: '轧机主传动系统安装调试完成', changeNote: '系统联调通过，具备交工条件', changeType: '交工', changeDate: '2025-04-18',
    status: '已确认', fileCount: 22, projMgrConfirmed: '是', projectType: '技改', creator: '陈志远', createDate: '2025-04-15', createTime: '10:00:00',
    confirmedBy: '陈志远', confirmedDate: '2025-04-20',
    attachments: [],
  },
  {
    id: 'ca-4', changeNo: 'YG-2025-0004', projectNo: 'NG-2024-0045', planNo: 'JH-2024-0188', projectName: '智慧能源管控平台二期建设',
    changeReason: '平台各模块功能开发完成', changeNote: '已完成全部功能模块部署，申请交工', changeType: '交工', changeDate: '2025-06-25',
    status: '审批中', fileCount: 15, projMgrConfirmed: '否', projectType: '信息化', creator: '王志刚', createDate: '2025-06-24', createTime: '16:30:00',
    attachments: [],
  },
  {
    id: 'ca-5', changeNo: 'YG-2025-0005', projectNo: 'NG-2024-0052', planNo: 'JH-2024-0205', projectName: '烧结厂余热回收利用改造',
    changeReason: '余热回收系统试运行完成', changeNote: '系统连续运行稳定，达到设计要求', changeType: '交工', changeDate: '2025-05-28',
    status: '已驳回', fileCount: 12, projMgrConfirmed: '否', projectType: '节能', creator: '赵海峰', createDate: '2025-05-25', createTime: '08:45:00',
    attachments: [],
  },
  {
    id: 'ca-6', changeNo: 'YG-2025-0006', projectNo: 'NG-2025-0005', planNo: 'JH-2025-0022', projectName: '原料码头环保封闭大棚建设',
    changeReason: '大棚主体结构及配套设施完工', changeNote: '环保设施验收通过，申请竣工', changeType: '竣工', changeDate: '2025-06-28',
    status: '审批中', fileCount: 30, projMgrConfirmed: '是', projectType: '环保提升', creator: '刘国栋', createDate: '2025-06-27', createTime: '11:00:00',
    attachments: [],
  },
  {
    id: 'ca-7', changeNo: 'YG-2025-0007', projectNo: 'NG-2025-0012', planNo: 'JH-2025-0048', projectName: '数字孪生工厂一期建设',
    changeReason: '数字孪生平台部署上线', changeNote: '全部功能模块已部署，运行稳定', changeType: '交工', changeDate: '2025-06-15',
    status: '未提交', fileCount: 20, projMgrConfirmed: '否', projectType: '信息化', creator: '吴晓东', createDate: '2025-06-14', createTime: '13:20:00',
    attachments: [],
  },
  {
    id: 'ca-8', changeNo: 'YG-2025-0008', projectNo: 'NG-2025-0019', planNo: 'JH-2025-0070', projectName: '棒材厂高速上料系统改造',
    changeReason: '上料系统全线联调通过', changeNote: '系统运行稳定，达到设计指标', changeType: '交工', changeDate: '2025-06-22',
    status: '未提交', fileCount: 10, projMgrConfirmed: '否', projectType: '技改', creator: '黄建华', createDate: '2025-06-21', createTime: '15:00:00',
    attachments: [],
  },
];

export const approvalNodes = [
  { nodeId: 'an-1', nodeName: '项目部审核', approver: '周建国', approverDept: '炼钢事业部项目部', sequence: 1 },
  { nodeId: 'an-2', nodeName: '专业主管单位审批', approver: '郑文斌', approverDept: '数研院', sequence: 2 },
  { nodeId: 'an-3', nodeName: '安全环保部会签', approver: '孙志强', approverDept: '安全环保部', sequence: 3 },
  { nodeId: 'an-4', nodeName: '制造部审批', approver: '吴建国', approverDept: '制造部', sequence: 4 },
  { nodeId: 'an-5', nodeName: '项目负责人确认', approver: '林晓东', approverDept: '项目管理办公室', sequence: 5 },
];

export const approvalHistories: { id: string; applicationId: string; sequence: number; nodeName: string; approver: string; status: string; opinion: string; time: string }[] = [
  { id: 'ah-1', applicationId: 'ca-1', sequence: 1, nodeName: '项目部审核', approver: '周建国', status: '已通过', opinion: '项目建设内容完整，各项指标达标，同意交工', time: '2025-06-16 10:30:00' },
  { id: 'ah-2', applicationId: 'ca-1', sequence: 2, nodeName: '专业主管单位审批', approver: '郑文斌', status: '已通过', opinion: '技术方案合理，系统运行稳定，审批通过', time: '2025-06-17 14:20:00' },
  { id: 'ah-3', applicationId: 'ca-1', sequence: 3, nodeName: '项目负责人确认', approver: '周建国', status: '已通过', opinion: '确认交工', time: '2025-06-18 09:15:00' },
  { id: 'ah-4', applicationId: 'ca-4', sequence: 1, nodeName: '项目部审核', approver: '王志刚', status: '已通过', opinion: '功能开发全部完成，自测通过', time: '2025-06-25 10:00:00' },
  { id: 'ah-5', applicationId: 'ca-4', sequence: 2, nodeName: '专业主管单位审批', approver: '郑文斌', status: '审批中', opinion: '', time: '' },
];

export const projectTypes = ['零固', '大修', '环保提升', '技改', '信息化', '节能', '人工智能'];
export const ownerUnits = ['南钢股份炼钢厂', '南钢股份炼铁厂', '南钢股份中板厂', '南钢股份宽厚板厂', '南钢股份棒材厂', '南钢股份烧结厂', '南钢股份中厚板卷厂', '南钢股份物流中心', '南钢股份'];

export const changeTypeOptions = ['P10 项目竣工', 'P10 项目交工', 'P08 交工', 'P08 竣工', 'P12 交工', 'P12 竣工'];

export const completionContracts: {
  id: string;
  projectNo: string;
  contractNo: string;
  contractName: string;
  contractStatus: string;
  contractType: string;
  contractorNo: string;
  hardwareStatus: string;
}[] = [
  { id: 'cct-1', projectNo: 'NG-2024-0012', contractNo: 'HT-2024-0308', contractName: '转炉智能吹炼系统主体设备采购合同', contractStatus: '已确认', contractType: '设备采购', contractorNo: 'C-2024-0015', hardwareStatus: '在线' },
  { id: 'cct-2', projectNo: 'NG-2024-0012', contractNo: 'HT-2024-0312', contractName: '转炉智能吹炼系统集成服务合同', contractStatus: '已确认', contractType: '系统集成', contractorNo: 'C-2024-0018', hardwareStatus: '在线' },
  { id: 'cct-3', projectNo: 'NG-2024-0012', contractNo: 'HT-2024-0325', contractName: '转炉吹炼系统安装调试合同', contractStatus: '已确认', contractType: '安装工程', contractorNo: 'C-2024-0022', hardwareStatus: '在线' },
  { id: 'cct-4', projectNo: 'NG-2024-0031', contractNo: 'HT-2024-0456', contractName: '轧机主传动系统设备采购合同', contractStatus: '已确认', contractType: '设备采购', contractorNo: 'C-2024-0040', hardwareStatus: '在线' },
  { id: 'cct-5', projectNo: 'NG-2024-0031', contractNo: 'HT-2024-0470', contractName: '轧机主传动系统安装施工合同', contractStatus: '已确认', contractType: '施工合同', contractorNo: 'C-2024-0043', hardwareStatus: '离线' },
  { id: 'cct-6', projectNo: 'NG-2024-0045', contractNo: 'HT-2024-0588', contractName: '智慧能源管控平台软件开发合同', contractStatus: '待确认', contractType: '软件开发', contractorNo: 'C-2024-0056', hardwareStatus: '在线' },
  { id: 'cct-7', projectNo: 'NG-2024-0045', contractNo: 'HT-2024-0602', contractName: '智慧能源管控平台硬件采购合同', contractStatus: '已确认', contractType: '设备采购', contractorNo: 'C-2024-0059', hardwareStatus: '在线' },
  { id: 'cct-8', projectNo: 'NG-2024-0052', contractNo: 'HT-2024-0688', contractName: '余热回收系统主体设备采购合同', contractStatus: '已确认', contractType: '设备采购', contractorNo: 'C-2024-0068', hardwareStatus: '在线' },
  { id: 'cct-9', projectNo: 'NG-2024-0052', contractNo: 'HT-2024-0701', contractName: '余热回收利用改造安装工程合同', contractStatus: '已确认', contractType: '安装工程', contractorNo: 'C-2024-0071', hardwareStatus: '在线' },
  { id: 'cct-10', projectNo: 'NG-2025-0005', contractNo: 'HT-2025-0088', contractName: '原料码头环保大棚主体建设合同', contractStatus: '已确认', contractType: '施工合同', contractorNo: 'C-2025-0012', hardwareStatus: '在线' },
  { id: 'cct-11', projectNo: 'NG-2025-0005', contractNo: 'HT-2025-0100', contractName: '环保大棚配套设施采购合同', contractStatus: '已确认', contractType: '设备采购', contractorNo: 'C-2025-0015', hardwareStatus: '离线' },
  { id: 'cct-12', projectNo: 'NG-2025-0012', contractNo: 'HT-2025-0188', contractName: '数字孪生平台软件定制开发合同', contractStatus: '待确认', contractType: '软件开发', contractorNo: 'C-2025-0032', hardwareStatus: '在线' },
  { id: 'cct-13', projectNo: 'NG-2025-0012', contractNo: 'HT-2025-0195', contractName: '数字孪生平台数据采集硬件合同', contractStatus: '已确认', contractType: '设备采购', contractorNo: 'C-2025-0035', hardwareStatus: '在线' },
  { id: 'cct-14', projectNo: 'NG-2025-0019', contractNo: 'HT-2025-0250', contractName: '棒材厂高速上料系统机械改造合同', contractStatus: '待确认', contractType: '施工合同', contractorNo: 'C-2025-0052', hardwareStatus: '离线' },
  { id: 'cct-15', projectNo: 'NG-2025-0019', contractNo: 'HT-2025-0262', contractName: '棒材厂上料系统自动化设备合同', contractStatus: '已确认', contractType: '设备采购', contractorNo: 'C-2025-0055', hardwareStatus: '在线' },
];