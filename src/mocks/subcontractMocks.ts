export interface SubcontractApplication {
  id: string;
  approvalNo: string;
  contractNo: string;
  contractName: string;
  signingUnit: string;
  subType: string;
  subUnit: string;
  contractStatus: string;
  contractorNo: string;
  subUnitPerson: string;
  contactInfo: string;
  attachments: string[];
  creator: string;
  createDate: string;
  modifier: string;
  modifyDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SubcontractApprovalRecord {
  id: string;
  appId: string;
  stage: string;
  operator: string;
  action: string;
  operateTime: string;
  opinion: string;
}

export const subcontractTypes = ['专业分包', '劳务分包', '设备分包', '材料分包', '设计分包', '监理分包'];

export const subcontractStatuses = ['执行中', '已完工', '已暂停'];

export const subcontractApplications: SubcontractApplication[] = [
  {
    id: 'sub-001', approvalNo: 'LX-2024-005', contractNo: 'NG-GC-2024-005',
    contractName: '炼铁厂高炉本体大修施工合同', signingUnit: '中国五冶集团有限公司',
    subType: '专业分包', subUnit: '江苏中建建设工程有限公司', contractStatus: '执行中',
    contractorNo: 'CBS-002', subUnitPerson: '钱建国', contactInfo: '025-85671234 / 13812345678',
    attachments: ['分包合同草案.pdf', '分包单位资质证明.pdf', '分包方案说明.pdf', '安全生产许可证.pdf'],
    creator: '李工', createDate: '2024-11-05 09:30:00', modifier: '李工', modifyDate: '2024-11-05 09:30:00',
    status: 'pending',
  },
  {
    id: 'sub-002', approvalNo: 'LX-2024-008', contractNo: 'NG-GC-2024-008',
    contractName: '棒材厂加热炉改造施工合同', signingUnit: '中冶天工集团有限公司',
    subType: '劳务分包', subUnit: '南京顺达建筑劳务有限公司', contractStatus: '执行中',
    contractorNo: 'CBS-007', subUnitPerson: '张德发', contactInfo: '025-82345678 / 13923456789',
    attachments: ['劳务分包协议.pdf', '劳务资质证书.pdf', '人员配置清单.pdf'],
    creator: '王工', createDate: '2024-11-10 14:15:00', modifier: '王工', modifyDate: '2024-11-10 14:15:00',
    status: 'pending',
  },
  {
    id: 'sub-003', approvalNo: 'LX-2024-012', contractNo: 'NG-GC-2024-012',
    contractName: '中厚板卷厂精整线改造合同', signingUnit: '中冶南方工程技术有限公司',
    subType: '设备分包', subUnit: '沈阳重型机械集团有限公司', contractStatus: '执行中',
    contractorNo: 'CBS-009', subUnitPerson: '刘志远', contactInfo: '024-31568888 / 15534567890',
    attachments: ['设备分包合同.pdf', '设备制造许可证.pdf', '设备技术参数表.pdf', '设备安装方案.pdf'],
    creator: '赵工', createDate: '2024-11-08 11:00:00', modifier: '赵工', modifyDate: '2024-11-08 11:00:00',
    status: 'pending',
  },
  {
    id: 'sub-004', approvalNo: 'LX-2024-015', contractNo: 'NG-GC-2024-015',
    contractName: '炼钢厂连铸机改造安装合同', signingUnit: '中冶京城工程技术有限公司',
    subType: '专业分包', subUnit: '上海宝冶工程技术有限公司', contractStatus: '执行中',
    contractorNo: 'CBS-011', subUnitPerson: '陈伟强', contactInfo: '021-56238888 / 13745678901',
    attachments: ['专业分包合同.pdf', '资质证书汇编.pdf', '施工组织设计.pdf'],
    creator: '周工', createDate: '2024-11-15 08:45:00', modifier: '周工', modifyDate: '2024-11-15 08:45:00',
    status: 'pending',
  },
  {
    id: 'sub-005', approvalNo: 'LX-2024-009', contractNo: 'NG-GC-2024-009',
    contractName: '焦化厂焦炉环保改造施工合同', signingUnit: '中冶焦耐工程技术有限公司',
    subType: '材料分包', subUnit: '鞍山耐火材料有限公司', contractStatus: '执行中',
    contractorNo: 'CBS-016', subUnitPerson: '马永强', contactInfo: '0412-5512888 / 13356789012',
    attachments: ['材料分包合同.pdf', '耐材检测报告.pdf', '供货方案.pdf'],
    creator: '杨工', createDate: '2024-10-20 15:30:00', modifier: '杨工', modifyDate: '2024-11-01 09:00:00',
    status: 'approved',
  },
  {
    id: 'sub-006', approvalNo: 'LX-2024-018', contractNo: 'NG-GC-2024-018',
    contractName: '原料场环保封闭改造施工合同', signingUnit: '中国十五冶建设集团',
    subType: '劳务分包', subUnit: '湖北宏达建筑劳务有限公司', contractStatus: '执行中',
    contractorNo: 'CBS-024', subUnitPerson: '黄文杰', contactInfo: '0714-6362888 / 13567890123',
    attachments: ['劳务分包协议.pdf', '安全生产方案.pdf', '人员花名册.pdf'],
    creator: '吴工', createDate: '2024-10-12 10:00:00', modifier: '吴工', modifyDate: '2024-10-28 14:00:00',
    status: 'approved',
  },
  {
    id: 'sub-007', approvalNo: 'LX-2024-022', contractNo: 'NG-GC-2024-022',
    contractName: '公辅水处理中心扩建合同', signingUnit: '中建八局集团有限公司',
    subType: '专业分包', subUnit: '浙江众合建设科技有限公司', contractStatus: '执行中',
    contractorNo: 'CBS-013', subUnitPerson: '孙立军', contactInfo: '0571-87998888 / 13678901234',
    attachments: ['专业分包合同.pdf', '企业资质证书.pdf', '施工方案.pdf'],
    creator: '郑工', createDate: '2024-09-25 16:00:00', modifier: '郑工', modifyDate: '2024-10-15 11:00:00',
    status: 'rejected',
  },
  {
    id: 'sub-008', approvalNo: 'LX-2024-025', contractNo: 'NG-GC-2024-025',
    contractName: '宽厚板厂热处理炉改造合同', signingUnit: '中国重型机械研究院',
    subType: '设备分包', subUnit: '洛阳中信重工机械股份有限公司', contractStatus: '已完工',
    contractorNo: 'CBS-020', subUnitPerson: '高建民', contactInfo: '0379-64098888 / 13889012345',
    attachments: ['设备分包合同.pdf', '设备出厂检验报告.pdf', '安装调试方案.pdf'],
    creator: '林工', createDate: '2024-09-10 13:00:00', modifier: '林工', modifyDate: '2024-09-28 16:00:00',
    status: 'rejected',
  },
];

export const subcontractApprovalRecords: SubcontractApprovalRecord[] = [
  { id: 'sar-001', appId: 'sub-005', stage: '施工方提交', operator: '马超', action: '提交分包申请', operateTime: '2024-10-20 15:30:00', opinion: '焦化厂焦炉环保改造项目中耐材供应需专业分包，鞍山耐火材料有限公司资质齐全、业绩丰富，申请分包审核。' },
  { id: 'sar-002', appId: 'sub-005', stage: '项目组审核', operator: '施海峰', action: '审核通过', operateTime: '2024-11-01 09:00:00', opinion: '分包单位资质审查通过，分包范围合理，同意分包申请。' },
  { id: 'sar-003', appId: 'sub-006', stage: '施工方提交', operator: '黄文杰', action: '提交分包申请', operateTime: '2024-10-12 10:00:00', opinion: '原料场环保封闭改造项目劳务用工需求大，申请劳务分包。湖北宏达建筑劳务有限公司具有建筑工程劳务资质。' },
  { id: 'sar-004', appId: 'sub-006', stage: '项目组审核', operator: '李明', action: '审核通过', operateTime: '2024-10-28 14:00:00', opinion: '劳务分包方案合理，分包单位资质及安全生产许可均符合要求，同意分包。' },
  { id: 'sar-005', appId: 'sub-007', stage: '施工方提交', operator: '孙立军', action: '提交分包申请', operateTime: '2024-09-25 16:00:00', opinion: '公辅水处理中心扩建项目中部分专业工程需分包，浙江众合建设科技有限公司具备相应专业资质。' },
  { id: 'sar-006', appId: 'sub-007', stage: '项目组审核', operator: '王建国', action: '审核驳回', operateTime: '2024-10-15 11:00:00', opinion: '分包单位业绩材料不完整，缺少近三年类似工程业绩证明，请补充后重新提交。' },
  { id: 'sar-007', appId: 'sub-008', stage: '施工方提交', operator: '高建民', action: '提交分包申请', operateTime: '2024-09-10 13:00:00', opinion: '宽厚板厂热处理炉改造项目中部分大型设备需专业分包制造，洛阳中信重工具备大型冶金设备制造能力。' },
  { id: 'sar-008', appId: 'sub-008', stage: '项目组审核', operator: '张涛', action: '审核驳回', operateTime: '2024-09-28 16:00:00', opinion: '分包设备制造周期与项目总体进度存在冲突，请重新协调制造周期或更换分包方案后重新提交。' },
];

export function getSubAppById(id: string): SubcontractApplication | undefined {
  return subcontractApplications.find((a) => a.id === id);
}

export function getSubApprovalRecords(appId: string): SubcontractApprovalRecord[] {
  return subcontractApprovalRecords.filter((r) => r.appId === appId).sort((a, b) => a.operateTime.localeCompare(b.operateTime));
}