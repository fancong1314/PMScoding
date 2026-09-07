// 项目档案管理 - Mock数据

export interface ArchiveProject {
  id: string;
  approvalNo: string;
  projectName: string;
  projectType: string;
  contractCount: number;
  attachmentTotal: number;
  archivedCount: number;
  pendingCount: number;
  completeness: number; // 百分比
  lastUpdated: string;
}

export interface ArchiveAttachment {
  id: string;
  projectId: string;
  contractId: string;
  contractNo: string;
  contractName: string;
  nodePath: string; // 功能节点路径
  attachmentName: string;
  docName: string;
  format: string;
  size: string;
  version: string;
  uploader: string;
  uploadTime: string;
  archiveStatus: '已归档' | '未归档';
  required: boolean;
  sourceFunction: string;
}

export interface VersionRecord {
  id: string;
  attachmentId: string;
  versionNo: string;
  fileName: string;
  fileSize: string;
  uploader: string;
  uploadTime: string;
}

export interface MissingDoc {
  nodePath: string;
  docName: string;
}

// 档案项目列表
export const archiveProjects: ArchiveProject[] = [
  { id: 'ap-1', approvalNo: 'LX-2024-001', projectName: '炼铁厂高炉大修工程', projectType: '技改项目', contractCount: 8, attachmentTotal: 186, archivedCount: 152, pendingCount: 34, completeness: 81.7, lastUpdated: '2026-05-28' },
  { id: 'ap-2', approvalNo: 'LX-2024-002', projectName: '转炉炼钢车间升级改造', projectType: '技改项目', contractCount: 12, attachmentTotal: 245, archivedCount: 198, pendingCount: 47, completeness: 80.8, lastUpdated: '2026-06-02' },
  { id: 'ap-3', approvalNo: 'LX-2025-001', projectName: '轧钢生产线智能化改造', projectType: '技改项目', contractCount: 6, attachmentTotal: 132, archivedCount: 110, pendingCount: 22, completeness: 83.3, lastUpdated: '2026-05-15' },
  { id: 'ap-4', approvalNo: 'LX-2025-002', projectName: '原料场环保封闭改造', projectType: '环保项目', contractCount: 5, attachmentTotal: 98, archivedCount: 76, pendingCount: 22, completeness: 77.6, lastUpdated: '2026-06-05' },
  { id: 'ap-5', approvalNo: 'LX-2025-003', projectName: '全厂污水处理系统建设', projectType: '环保项目', contractCount: 4, attachmentTotal: 87, archivedCount: 65, pendingCount: 22, completeness: 74.7, lastUpdated: '2026-05-20' },
  { id: 'ap-6', approvalNo: 'LX-2025-004', projectName: '余热发电及能源综合利用', projectType: '技改项目', contractCount: 7, attachmentTotal: 156, archivedCount: 132, pendingCount: 24, completeness: 84.6, lastUpdated: '2026-06-08' },
  { id: 'ap-7', approvalNo: 'LX-2026-001', projectName: '炼钢精炼炉新建工程', projectType: '基建项目', contractCount: 10, attachmentTotal: 203, archivedCount: 178, pendingCount: 25, completeness: 87.7, lastUpdated: '2026-06-10' },
  { id: 'ap-8', approvalNo: 'LX-2026-002', projectName: '连铸机更新改造项目', projectType: '技改项目', contractCount: 5, attachmentTotal: 115, archivedCount: 92, pendingCount: 23, completeness: 80.0, lastUpdated: '2026-05-25' },
  { id: 'ap-9', approvalNo: 'LX-2026-003', projectName: '安全监控系统全面升级', projectType: '安全项目', contractCount: 3, attachmentTotal: 64, archivedCount: 48, pendingCount: 16, completeness: 75.0, lastUpdated: '2026-06-01' },
  { id: 'ap-10', approvalNo: 'LX-2026-004', projectName: '厂区道路及管网综合改造', projectType: '基建项目', contractCount: 6, attachmentTotal: 142, archivedCount: 118, pendingCount: 24, completeness: 83.1, lastUpdated: '2026-05-30' },
  { id: 'ap-11', approvalNo: 'LX-2026-005', projectName: '信息化管理平台建设', projectType: '信息化项目', contractCount: 4, attachmentTotal: 78, archivedCount: 55, pendingCount: 23, completeness: 70.5, lastUpdated: '2026-06-03' },
  { id: 'ap-12', approvalNo: 'LX-2026-006', projectName: '炼铁除尘系统提标改造', projectType: '环保项目', contractCount: 5, attachmentTotal: 96, archivedCount: 74, pendingCount: 22, completeness: 77.1, lastUpdated: '2026-05-18' },
];

// 项目档案详情-附件列表（以炼铁厂高炉大修工程为例）
export const archiveAttachments: Record<string, ArchiveAttachment[]> = {
  'ap-1': [
    // 合同 HT-2024-001 - 高炉本体耐材砌筑
    { id: 'aa-1', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', attachmentName: '验收申请表_高炉耐材砌筑_20260315.pdf', docName: '验收申请表', format: 'PDF', size: '2.3 MB', version: 'V3', uploader: '张明远', uploadTime: '2026-03-15 14:22:00', archiveStatus: '已归档', required: true, sourceFunction: '新增验收记录' },
    { id: 'aa-2', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', attachmentName: '施工质量检查记录_高炉耐材_20260315.pdf', docName: '施工质量检查记录', format: 'PDF', size: '4.8 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-03-15 14:25:00', archiveStatus: '已归档', required: true, sourceFunction: '新增验收记录' },
    { id: 'aa-3', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', attachmentName: '材料合格证_高铝砖_202603.pdf', docName: '材料合格证及检测报告', format: 'PDF', size: '1.5 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-03-15 14:30:00', archiveStatus: '已归档', required: true, sourceFunction: '新增验收记录' },
    { id: 'aa-4', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', attachmentName: '隐蔽工程验收记录_高炉基础_20260320.pdf', docName: '隐蔽工程验收记录', format: 'PDF', size: '3.2 MB', version: 'V1', uploader: '李建国', uploadTime: '2026-03-20 09:15:00', archiveStatus: '已归档', required: true, sourceFunction: '新增验收记录' },
    { id: 'aa-5', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', attachmentName: '现场照片_高炉砌筑_202603.zip', docName: '现场照片及影像资料', format: 'ZIP', size: '85.6 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-03-15 15:00:00', archiveStatus: '未归档', required: false, sourceFunction: '新增验收记录' },
    // 合同 HT-2024-002 - 转炉设备
    { id: 'aa-6', projectId: 'ap-1', contractId: 'c-2', contractNo: 'HT-2024-002', contractName: '转炉设备基础施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', attachmentName: '开工报告_转炉设备基础.pdf', docName: '开工报告', format: 'PDF', size: '1.8 MB', version: 'V2', uploader: '周建华', uploadTime: '2026-02-01 08:30:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批' },
    { id: 'aa-7', projectId: 'ap-1', contractId: 'c-2', contractNo: 'HT-2024-002', contractName: '转炉设备基础施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', attachmentName: '施工组织设计_转炉基础_202602.pdf', docName: '施工组织设计', format: 'PDF', size: '28.5 MB', version: 'V3', uploader: '周建华', uploadTime: '2026-02-01 08:35:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批' },
    { id: 'aa-8', projectId: 'ap-1', contractId: 'c-2', contractNo: 'HT-2024-002', contractName: '转炉设备基础施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', attachmentName: '安全协议_转炉基础_202602.pdf', docName: '安全协议', format: 'PDF', size: '3.1 MB', version: 'V1', uploader: '周建华', uploadTime: '2026-02-01 08:40:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批' },
    { id: 'aa-9', projectId: 'ap-1', contractId: 'c-2', contractNo: 'HT-2024-002', contractName: '转炉设备基础施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', attachmentName: '资质证书_江苏建工.pdf', docName: '资质证书', format: 'PDF', size: '5.2 MB', version: 'V1', uploader: '周建华', uploadTime: '2026-02-01 08:45:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批' },
    // 合同 HT-2024-005 - 环保除尘
    { id: 'aa-10', projectId: 'ap-1', contractId: 'c-3', contractNo: 'HT-2024-005', contractName: '环保除尘设施土建施工合同', nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', attachmentName: '工程款申报表_除尘设施_202604.pdf', docName: '工程款申报表', format: 'PDF', size: '1.2 MB', version: 'V2', uploader: '冯志明', uploadTime: '2026-04-10 10:00:00', archiveStatus: '已归档', required: true, sourceFunction: '新增申报' },
    { id: 'aa-11', projectId: 'ap-1', contractId: 'c-3', contractNo: 'HT-2024-005', contractName: '环保除尘设施土建施工合同', nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', attachmentName: '工程量清单_除尘设施_202604.xlsx', docName: '工程量清单', format: 'XLSX', size: '0.8 MB', version: 'V1', uploader: '冯志明', uploadTime: '2026-04-10 10:05:00', archiveStatus: '已归档', required: true, sourceFunction: '新增申报' },
    { id: 'aa-12', projectId: 'ap-1', contractId: 'c-3', contractNo: 'HT-2024-005', contractName: '环保除尘设施土建施工合同', nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', attachmentName: '发票扫描件_除尘设施_202604.pdf', docName: '发票扫描件', format: 'PDF', size: '3.5 MB', version: 'V1', uploader: '冯志明', uploadTime: '2026-04-10 10:10:00', archiveStatus: '已归档', required: true, sourceFunction: '新增申报' },
    // 超期申请附件
    { id: 'aa-13', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 新增超期申请', attachmentName: '超期原因说明书_高炉耐材_202605.pdf', docName: '超期原因说明书', format: 'PDF', size: '1.1 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-05-10 16:00:00', archiveStatus: '已归档', required: true, sourceFunction: '新增超期申请' },
    { id: 'aa-14', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 新增超期申请', attachmentName: '施工进度对比表_高炉耐材_202605.xlsx', docName: '施工进度对比表', format: 'XLSX', size: '0.5 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-05-10 16:05:00', archiveStatus: '已归档', required: true, sourceFunction: '新增超期申请' },
    { id: 'aa-15', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 新增超期申请', attachmentName: '监理单位意见书_202605.pdf', docName: '监理单位意见书', format: 'PDF', size: '0.6 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-05-12 09:00:00', archiveStatus: '未归档', required: false, sourceFunction: '新增超期申请' },
  ],
  'ap-2': [
    { id: 'aa-20', projectId: 'ap-2', contractId: 'c-5', contractNo: 'HT-2025-001', contractName: '转炉自动化控制系统合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', attachmentName: '开工报告_转炉自动化.pdf', docName: '开工报告', format: 'PDF', size: '1.5 MB', version: 'V1', uploader: '赵卫东', uploadTime: '2026-03-01 09:00:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批' },
    { id: 'aa-21', projectId: 'ap-2', contractId: 'c-5', contractNo: 'HT-2025-001', contractName: '转炉自动化控制系统合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', attachmentName: '施工组织设计_转炉自动化_202603.pdf', docName: '施工组织设计', format: 'PDF', size: '32.1 MB', version: 'V2', uploader: '赵卫东', uploadTime: '2026-03-01 09:05:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批' },
    { id: 'aa-22', projectId: 'ap-2', contractId: 'c-6', contractNo: 'HT-2025-002', contractName: '转炉烟气净化系统合同', nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', attachmentName: '工程款申报表_烟气净化_202605.pdf', docName: '工程款申报表', format: 'PDF', size: '1.0 MB', version: 'V1', uploader: '孙伟', uploadTime: '2026-05-15 14:00:00', archiveStatus: '已归档', required: true, sourceFunction: '新增申报' },
  ],
};

// 版本历史
export const versionHistories: Record<string, VersionRecord[]> = {
  'aa-1': [
    { id: 'v-1', attachmentId: 'aa-1', versionNo: 'V3', fileName: '验收申请表_高炉耐材砌筑_20260315.pdf', fileSize: '2.3 MB', uploader: '张明远', uploadTime: '2026-03-15 14:22:00' },
    { id: 'v-2', attachmentId: 'aa-1', versionNo: 'V2', fileName: '验收申请表_高炉耐材砌筑_20260228.pdf', fileSize: '2.1 MB', uploader: '张明远', uploadTime: '2026-02-28 10:15:00' },
    { id: 'v-3', attachmentId: 'aa-1', versionNo: 'V1', fileName: '验收申请表_高炉耐材砌筑_20260201.pdf', fileSize: '1.8 MB', uploader: '李建国', uploadTime: '2026-02-01 16:30:00' },
  ],
  'aa-6': [
    { id: 'v-4', attachmentId: 'aa-6', versionNo: 'V2', fileName: '开工报告_转炉设备基础_20260301.pdf', fileSize: '1.8 MB', uploader: '周建华', uploadTime: '2026-03-01 08:30:00' },
    { id: 'v-5', attachmentId: 'aa-6', versionNo: 'V1', fileName: '开工报告_转炉设备基础_20260215.pdf', fileSize: '1.6 MB', uploader: '周建华', uploadTime: '2026-02-15 14:00:00' },
  ],
  'aa-7': [
    { id: 'v-6', attachmentId: 'aa-7', versionNo: 'V3', fileName: '施工组织设计_转炉基础_202603.pdf', fileSize: '28.5 MB', uploader: '周建华', uploadTime: '2026-03-01 08:35:00' },
    { id: 'v-7', attachmentId: 'aa-7', versionNo: 'V2', fileName: '施工组织设计_转炉基础_202602.pdf', fileSize: '26.8 MB', uploader: '周建华', uploadTime: '2026-02-20 11:00:00' },
    { id: 'v-8', attachmentId: 'aa-7', versionNo: 'V1', fileName: '施工组织设计_转炉基础_202602.pdf', fileSize: '25.1 MB', uploader: '周建华', uploadTime: '2026-02-05 09:30:00' },
  ],
  'aa-10': [
    { id: 'v-9', attachmentId: 'aa-10', versionNo: 'V2', fileName: '工程款申报表_除尘设施_20260410.pdf', fileSize: '1.2 MB', uploader: '冯志明', uploadTime: '2026-04-10 10:00:00' },
    { id: 'v-10', attachmentId: 'aa-10', versionNo: 'V1', fileName: '工程款申报表_除尘设施_20260401.pdf', fileSize: '1.1 MB', uploader: '冯志明', uploadTime: '2026-04-01 15:00:00' },
  ],
};

// 档案缺失提醒（以ap-1炼铁厂高炉大修工程为例）
export const missingDocs: Record<string, MissingDoc[]> = {
  'ap-1': [
    { nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', docName: '设备开箱检验记录' },
    { nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', docName: '开工报告（合同HT-2024-003）' },
    { nodePath: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 新增超期申请', docName: '相关证明材料' },
  ],
  'ap-2': [
    { nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', docName: '资质证书（合同HT-2025-003）' },
    { nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', docName: '竣工验收报告' },
  ],
  'ap-3': [
    { nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', docName: '隐蔽工程验收记录' },
    { nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', docName: '安全协议（合同HT-2025-004）' },
  ],
};

// 档案目录树节点
export interface ArchiveTreeNode {
  key: string;
  label: string;
  type: 'project' | 'contract' | 'node';
  parentKey: string | null;
  count: number;
  data?: any;
}

export function buildArchiveTree(projectId: string): ArchiveTreeNode[] {
  const attachments = archiveAttachments[projectId] || [];
  const project = archiveProjects.find((p) => p.id === projectId);
  if (!project) return [];

  const nodes: ArchiveTreeNode[] = [];
  // 项目根节点
  nodes.push({ key: `${projectId}-root`, label: project.projectName, type: 'project', parentKey: null, count: attachments.length });

  // 按合同分组
  const contractMap = new Map<string, ArchiveAttachment[]>();
  attachments.forEach((a) => {
    const existing = contractMap.get(a.contractId) || [];
    existing.push(a);
    contractMap.set(a.contractId, existing);
  });

  contractMap.forEach((contractAtts, contractId) => {
    const first = contractAtts[0];
    const contractKey = `${projectId}-${contractId}`;
    nodes.push({ key: contractKey, label: `${first.contractNo} ${first.contractName}`, type: 'contract', parentKey: `${projectId}-root`, count: contractAtts.length });

    // 按功能节点分组
    const nodeMap = new Map<string, ArchiveAttachment[]>();
    contractAtts.forEach((a) => {
      const existing = nodeMap.get(a.sourceFunction) || [];
      existing.push(a);
      nodeMap.set(a.sourceFunction, existing);
    });

    nodeMap.forEach((nodeAtts, sourceFunc) => {
      nodes.push({ key: `${contractKey}-${sourceFunc}`, label: sourceFunc, type: 'node', parentKey: contractKey, count: nodeAtts.length });
    });
  });

  return nodes;
}

export function getArchiveProjectById(id: string): ArchiveProject | undefined {
  return archiveProjects.find((p) => p.id === id);
}

export function getArchiveAttachments(projectId: string): ArchiveAttachment[] {
  return archiveAttachments[projectId] || [];
}

export function getVersionHistory(attachmentId: string): VersionRecord[] {
  return versionHistories[attachmentId] || [];
}

export function getMissingDocs(projectId: string): MissingDoc[] {
  return missingDocs[projectId] || [];
}