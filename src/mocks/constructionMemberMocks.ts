export interface ConstructionProject {
  id: number;
  projectName: string;
  projectNumber: string;
  projectType: string;
  ownerUnit: string;
  contractCount: number;
  memberCount: number;
  pendingCount: number;
  lastUpdated: string;
}

export interface ConstructionContract {
  id: number;
  projectId: number;
  contractNo: string;
  contractName: string;
}

export interface ConstructionMember {
  id: number;
  contractId: number;
  contractName: string;
  contractNo: string;
  companyName: string;
  name: string;
  idCard: string;
  phone: string;
  personType: string;
  attachmentName: string;
  entryTime: string;
  exitTime: string;
  status: 'pending' | 'approved' | 'rejected';
  submitTime: string;
  approveTime: string;
  approver: string;
  approveComment: string;
}

export const mockConstructionProjects: ConstructionProject[] = [
  { id: 1, projectName: '高炉营缮及环保升级改造项目', projectNumber: 'NG-GC-2025-001', projectType: '技改', ownerUnit: '炼铁事业部', contractCount: 8, memberCount: 156, pendingCount: 12, lastUpdated: '2026-06-30' },
  { id: 2, projectName: '热轧1580产线智能化升级', projectNumber: 'NG-GC-2025-002', projectType: '技改', ownerUnit: '板材事业部', contractCount: 5, memberCount: 89, pendingCount: 5, lastUpdated: '2026-06-29' },
  { id: 3, projectName: '炼钢连铸机大修工程', projectNumber: 'NG-GC-2025-003', projectType: '大中修', ownerUnit: '炼钢事业部', contractCount: 4, memberCount: 72, pendingCount: 0, lastUpdated: '2026-06-28' },
  { id: 4, projectName: '厂区道路及排水系统改造', projectNumber: 'NG-GC-2025-004', projectType: '零星施工', ownerUnit: '公辅事业部', contractCount: 3, memberCount: 45, pendingCount: 3, lastUpdated: '2026-06-27' },
  { id: 5, projectName: '智能化仓储物流中心建设', projectNumber: 'NG-GC-2025-005', projectType: '零固', ownerUnit: '物流中心', contractCount: 7, memberCount: 134, pendingCount: 8, lastUpdated: '2026-06-30' },
  { id: 6, projectName: '棒材生产线技术改造', projectNumber: 'NG-GC-2025-006', projectType: '技改', ownerUnit: '特钢事业部', contractCount: 3, memberCount: 58, pendingCount: 0, lastUpdated: '2026-06-26' },
  { id: 7, projectName: '焦化脱硫脱硝环保工程', projectNumber: 'NG-GC-2025-007', projectType: '技改', ownerUnit: '炼铁事业部', contractCount: 6, memberCount: 98, pendingCount: 7, lastUpdated: '2026-06-29' },
  { id: 8, projectName: '综合管廊及电缆隧道工程', projectNumber: 'NG-GC-2025-008', projectType: '零星施工', ownerUnit: '公辅事业部', contractCount: 2, memberCount: 36, pendingCount: 2, lastUpdated: '2026-06-25' },
  { id: 9, projectName: '中厚板热处理炉建设', projectNumber: 'NG-GC-2025-009', projectType: '大中修', ownerUnit: '板材事业部', contractCount: 4, memberCount: 67, pendingCount: 4, lastUpdated: '2026-06-28' },
  { id: 10, projectName: '轧钢厂酸洗线改造项目', projectNumber: 'NG-GC-2025-010', projectType: '技改', ownerUnit: '特钢事业部', contractCount: 3, memberCount: 51, pendingCount: 0, lastUpdated: '2026-06-24' },
];

export const mockConstructionContracts: ConstructionContract[] = [
  { id: 1, projectId: 1, contractNo: 'NG-HT-2025-001', contractName: '高炉本体设备安装施工合同' },
  { id: 2, projectId: 1, contractNo: 'NG-HT-2025-002', contractName: '环保除尘系统EPC总承包合同' },
  { id: 3, projectId: 1, contractNo: 'NG-HT-2025-003', contractName: '热风炉系统改造施工合同' },
  { id: 4, projectId: 1, contractNo: 'NG-HT-2025-004', contractName: '电气自动化系统安装合同' },
  { id: 5, projectId: 1, contractNo: 'NG-HT-2025-005', contractName: '土建基础加固施工合同' },
  { id: 6, projectId: 1, contractNo: 'NG-HT-2025-006', contractName: '循环水系统管道安装合同' },
  { id: 7, projectId: 1, contractNo: 'NG-HT-2025-007', contractName: '耐火材料砌筑施工合同' },
  { id: 8, projectId: 1, contractNo: 'NG-HT-2025-008', contractName: '设备调试技术服务合同' },

  { id: 9, projectId: 2, contractNo: 'NG-HT-2025-009', contractName: '1580热连轧主体设备安装合同' },
  { id: 10, projectId: 2, contractNo: 'NG-HT-2025-010', contractName: '智能化控制系统集成合同' },
  { id: 11, projectId: 2, contractNo: 'NG-HT-2025-011', contractName: '液压润滑系统安装合同' },
  { id: 12, projectId: 2, contractNo: 'NG-HT-2025-012', contractName: '轧线辊道改造施工合同' },
  { id: 13, projectId: 2, contractNo: 'NG-HT-2025-013', contractName: '卷取区设备安装调试合同' },

  { id: 14, projectId: 3, contractNo: 'NG-HT-2025-014', contractName: '1号连铸机本体大修合同' },
  { id: 15, projectId: 3, contractNo: 'NG-HT-2025-015', contractName: '结晶器振动装置改造合同' },
  { id: 16, projectId: 3, contractNo: 'NG-HT-2025-016', contractName: '扇形段更换施工合同' },
  { id: 17, projectId: 3, contractNo: 'NG-HT-2025-017', contractName: '切割区设备升级合同' },

  { id: 18, projectId: 4, contractNo: 'NG-HT-2025-018', contractName: '厂区主干道翻新施工合同' },
  { id: 19, projectId: 4, contractNo: 'NG-HT-2025-019', contractName: '雨水收集排放系统合同' },
  { id: 20, projectId: 4, contractNo: 'NG-HT-2025-020', contractName: '道路照明及监控安装合同' },

  { id: 21, projectId: 5, contractNo: 'NG-HT-2025-021', contractName: '自动化立体仓库设备采购合同' },
  { id: 22, projectId: 5, contractNo: 'NG-HT-2025-022', contractName: 'AGV运输系统采购安装合同' },
  { id: 23, projectId: 5, contractNo: 'NG-HT-2025-023', contractName: 'WMS系统开发实施合同' },
  { id: 24, projectId: 5, contractNo: 'NG-HT-2025-024', contractName: '自动包装线设备安装合同' },
  { id: 25, projectId: 5, contractNo: 'NG-HT-2025-025', contractName: '输送线系统集成合同' },
  { id: 26, projectId: 5, contractNo: 'NG-HT-2025-026', contractName: '厂房钢结构施工合同' },
  { id: 27, projectId: 5, contractNo: 'NG-HT-2025-027', contractName: '消防系统工程合同' },

  { id: 28, projectId: 6, contractNo: 'NG-HT-2025-028', contractName: '棒材轧机主体安装合同' },
  { id: 29, projectId: 6, contractNo: 'NG-HT-2025-029', contractName: '冷床设备改造合同' },
  { id: 30, projectId: 6, contractNo: 'NG-HT-2025-030', contractName: '精整线设备安装合同' },

  { id: 31, projectId: 7, contractNo: 'NG-HT-2025-031', contractName: '脱硫脱硝装置EPC总承包合同' },
  { id: 32, projectId: 7, contractNo: 'NG-HT-2025-032', contractName: '烟气管道系统安装合同' },
  { id: 33, projectId: 7, contractNo: 'NG-HT-2025-033', contractName: '废水处理系统施工合同' },
  { id: 34, projectId: 7, contractNo: 'NG-HT-2025-034', contractName: '在线监测系统安装合同' },
  { id: 35, projectId: 7, contractNo: 'NG-HT-2025-035', contractName: '电气及自控系统安装合同' },
  { id: 36, projectId: 7, contractNo: 'NG-HT-2025-036', contractName: '土建基础施工合同' },

  { id: 37, projectId: 8, contractNo: 'NG-HT-2025-037', contractName: '综合管廊主体施工合同' },
  { id: 38, projectId: 8, contractNo: 'NG-HT-2025-038', contractName: '电缆隧道及支架安装合同' },

  { id: 39, projectId: 9, contractNo: 'NG-HT-2025-039', contractName: '热处理炉设备安装合同' },
  { id: 40, projectId: 9, contractNo: 'NG-HT-2025-040', contractName: '燃烧系统调试服务合同' },
  { id: 41, projectId: 9, contractNo: 'NG-HT-2025-041', contractName: '耐材施工专项合同' },
  { id: 42, projectId: 9, contractNo: 'NG-HT-2025-042', contractName: '自动化控制系统合同' },

  { id: 43, projectId: 10, contractNo: 'NG-HT-2025-043', contractName: '酸洗机组主体安装合同' },
  { id: 44, projectId: 10, contractNo: 'NG-HT-2025-044', contractName: '酸再生系统安装合同' },
  { id: 45, projectId: 10, contractNo: 'NG-HT-2025-045', contractName: '废酸处理系统施工合同' },
];

const personTypes = ['项目经理', '技术负责人', '安全员', '质量员', '施工员', '电焊工', '钳工', '电工', '起重工', '架子工', '钢筋工', '混凝土工', '管道工', '仪表工', '油漆工'];
const companyNames = ['中冶建工集团有限公司', '中国二十冶集团有限公司', '上海宝冶工程技术有限公司', '中钢设备有限公司', '江苏南通二建集团有限公司', '中国五冶集团有限公司', '中建三局第一建设工程有限公司'];
const approvers = ['张建国', '李明辉', '王德发', '赵志强', '陈文斌'];

let memberId = 1;

function generateMembers(contractId: number, projectId: number, contractName: string, contractNo: string, count: number): ConstructionMember[] {
  const members: ConstructionMember[] = [];
  for (let i = 0; i < count; i++) {
    const statusRand = Math.random();
    let status: 'pending' | 'approved' | 'rejected';
    if (statusRand < 0.3) status = 'pending';
    else if (statusRand < 0.85) status = 'approved';
    else status = 'rejected';

    const submitDate = new Date(2026, 5, 5 + Math.floor(Math.random() * 25));
    const approveDate = new Date(submitDate);
    approveDate.setDate(approveDate.getDate() + Math.floor(Math.random() * 5) + 1);

    const entryDate = new Date(2026, 5, 1 + Math.floor(Math.random() * 15));
    const exitDate = new Date(2026, 11, 1 + Math.floor(Math.random() * 30));

    members.push({
      id: memberId++,
      contractId,
      contractName,
      contractNo,
      companyName: companyNames[Math.floor(Math.random() * companyNames.length)],
      name: ['张伟', '刘强', '王磊', '李鹏', '赵军', '陈明', '周涛', '吴刚', '钱峰', '孙亮', '朱勇', '何平', '林杰', '杨波', '黄鑫', '韩文', '马超', '郑龙', '沈浩', '曹毅',
        '冯志', '蒋斌', '蔡辉', '潘峰', '董凯', '魏松', '苏杰', '叶翔', '姚磊', '罗明'][Math.floor(Math.random() * 30)],
      idCard: `320${String(Math.floor(Math.random() * 10))}${String(1980 + Math.floor(Math.random() * 20))}${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 9000 + 1000))}`,
      phone: `1${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 900000000 + 100000000))}`,
      personType: personTypes[Math.floor(Math.random() * personTypes.length)],
      attachmentName: `${['施工人员资质证书', '特种作业操作证', '安全管理资格证', '技能等级证书', '职业健康体检报告'][Math.floor(Math.random() * 5)]}${memberId}.pdf`,
      entryTime: `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`,
      exitTime: `${exitDate.getFullYear()}-${String(exitDate.getMonth() + 1).padStart(2, '0')}-${String(exitDate.getDate()).padStart(2, '0')}`,
      status,
      submitTime: `${submitDate.getFullYear()}-${String(submitDate.getMonth() + 1).padStart(2, '0')}-${String(submitDate.getDate()).padStart(2, '0')} ${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      approveTime: status === 'approved' || status === 'rejected'
        ? `${approveDate.getFullYear()}-${String(approveDate.getMonth() + 1).padStart(2, '0')}-${String(approveDate.getDate()).padStart(2, '0')} ${String(Math.floor(Math.random() * 5) + 9).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
        : '',
      approver: status === 'approved' || status === 'rejected' ? approvers[Math.floor(Math.random() * approvers.length)] : '',
      approveComment: status === 'approved' ? '资质齐全，同意入场' : status === 'rejected' ? ['资质证书已过期，请更新后重新提交', '人员信息与实际不符，请核实', '体检报告缺少必要项目，需重新体检', '安全培训记录不完整'][Math.floor(Math.random() * 4)] : '',
    });
  }
  return members;
}

export const mockConstructionMembers: ConstructionMember[] = [
  ...generateMembers(1, 1, '高炉本体设备安装施工合同', 'NG-HT-2025-001', 28),
  ...generateMembers(2, 1, '环保除尘系统EPC总承包合同', 'NG-HT-2025-002', 22),
  ...generateMembers(3, 1, '热风炉系统改造施工合同', 'NG-HT-2025-003', 18),
  ...generateMembers(4, 1, '电气自动化系统安装合同', 'NG-HT-2025-004', 20),
  ...generateMembers(5, 1, '土建基础加固施工合同', 'NG-HT-2025-005', 24),
  ...generateMembers(6, 1, '循环水系统管道安装合同', 'NG-HT-2025-006', 16),
  ...generateMembers(7, 1, '耐火材料砌筑施工合同', 'NG-HT-2025-007', 14),
  ...generateMembers(8, 1, '设备调试技术服务合同', 'NG-HT-2025-008', 14),

  ...generateMembers(9, 2, '1580热连轧主体设备安装合同', 'NG-HT-2025-009', 22),
  ...generateMembers(10, 2, '智能化控制系统集成合同', 'NG-HT-2025-010', 16),
  ...generateMembers(11, 2, '液压润滑系统安装合同', 'NG-HT-2025-011', 15),
  ...generateMembers(12, 2, '轧线辊道改造施工合同', 'NG-HT-2025-012', 20),
  ...generateMembers(13, 2, '卷取区设备安装调试合同', 'NG-HT-2025-013', 16),

  ...generateMembers(14, 3, '1号连铸机本体大修合同', 'NG-HT-2025-014', 22),
  ...generateMembers(15, 3, '结晶器振动装置改造合同', 'NG-HT-2025-015', 16),
  ...generateMembers(16, 3, '扇形段更换施工合同', 'NG-HT-2025-016', 18),
  ...generateMembers(17, 3, '切割区设备升级合同', 'NG-HT-2025-017', 16),

  ...generateMembers(18, 4, '厂区主干道翻新施工合同', 'NG-HT-2025-018', 18),
  ...generateMembers(19, 4, '雨水收集排放系统合同', 'NG-HT-2025-019', 13),
  ...generateMembers(20, 4, '道路照明及监控安装合同', 'NG-HT-2025-020', 14),

  ...generateMembers(21, 5, '自动化立体仓库设备采购合同', 'NG-HT-2025-021', 20),
  ...generateMembers(22, 5, 'AGV运输系统采购安装合同', 'NG-HT-2025-022', 18),
  ...generateMembers(23, 5, 'WMS系统开发实施合同', 'NG-HT-2025-023', 16),
  ...generateMembers(24, 5, '自动包装线设备安装合同', 'NG-HT-2025-024', 26),
  ...generateMembers(25, 5, '输送线系统集成合同', 'NG-HT-2025-025', 20),
  ...generateMembers(26, 5, '厂房钢结构施工合同', 'NG-HT-2025-026', 18),
  ...generateMembers(27, 5, '消防系统工程合同', 'NG-HT-2025-027', 16),

  ...generateMembers(28, 6, '棒材轧机主体安装合同', 'NG-HT-2025-028', 22),
  ...generateMembers(29, 6, '冷床设备改造合同', 'NG-HT-2025-029', 18),
  ...generateMembers(30, 6, '精整线设备安装合同', 'NG-HT-2025-030', 18),

  ...generateMembers(31, 7, '脱硫脱硝装置EPC总承包合同', 'NG-HT-2025-031', 24),
  ...generateMembers(32, 7, '烟气管道系统安装合同', 'NG-HT-2025-032', 16),
  ...generateMembers(33, 7, '废水处理系统施工合同', 'NG-HT-2025-033', 14),
  ...generateMembers(34, 7, '在线监测系统安装合同', 'NG-HT-2025-034', 16),
  ...generateMembers(35, 7, '电气及自控系统安装合同', 'NG-HT-2025-035', 14),
  ...generateMembers(36, 7, '土建基础施工合同', 'NG-HT-2025-036', 14),

  ...generateMembers(37, 8, '综合管廊主体施工合同', 'NG-HT-2025-037', 20),
  ...generateMembers(38, 8, '电缆隧道及支架安装合同', 'NG-HT-2025-038', 16),

  ...generateMembers(39, 9, '热处理炉设备安装合同', 'NG-HT-2025-039', 18),
  ...generateMembers(40, 9, '燃烧系统调试服务合同', 'NG-HT-2025-040', 15),
  ...generateMembers(41, 9, '耐材施工专项合同', 'NG-HT-2025-041', 16),
  ...generateMembers(42, 9, '自动化控制系统合同', 'NG-HT-2025-042', 18),

  ...generateMembers(43, 10, '酸洗机组主体安装合同', 'NG-HT-2025-043', 20),
  ...generateMembers(44, 10, '酸再生系统安装合同', 'NG-HT-2025-044', 16),
  ...generateMembers(45, 10, '废酸处理系统施工合同', 'NG-HT-2025-045', 15),
];