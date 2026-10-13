// 项目档案管理 - Mock数据（含手动上传 / 会议纪要 / 历史归档持久化）

export interface ArchiveProject {
  id: string;
  approvalNo: string;
  projectName: string;
  projectType: string;
  contractCount: number;
  attachmentTotal: number;
  archivedCount: number;
  pendingCount: number;
  completeness: number;
  lastUpdated: string;
}

export type ArchiveOrigin = 'business' | 'manual' | 'meeting';

export interface ArchiveAttachment {
  id: string;
  projectId: string;
  contractId: string;
  contractNo: string;
  contractName: string;
  nodePath: string;
  bizCode?: string;
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
  /** 来源：业务自动汇总 / 档案手动新增 / 会议纪要 */
  origin?: ArchiveOrigin;
  /** 关联档案配置文档项 id（手动上传时） */
  configDocId?: string;
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

export interface ArchiveTreeNode {
  key: string;
  label: string;
  type: 'project' | 'contract' | 'node' | 'meeting';
  parentKey: string | null;
  count: number;
  data?: unknown;
}

export const MEETING_CONTRACT_ID = 'meeting';
export const MEETING_SOURCE = '会议纪要';
export const ARCHIVE_MGMT_STORAGE_KEY = 'pms_archive_mgmt_v1';

export const archiveProjects: ArchiveProject[] = [
  { id: 'ap-1', approvalNo: 'LX-2024-001', projectName: '炼铁厂高炉营缮工程', projectType: '技改项目', contractCount: 8, attachmentTotal: 186, archivedCount: 152, pendingCount: 34, completeness: 81.7, lastUpdated: '2026-05-28' },
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

function meetingAtt(
  id: string,
  projectId: string,
  docName: string,
  attachmentName: string,
  format: string,
  size: string,
  uploader: string,
  uploadTime: string,
  archiveStatus: '已归档' | '未归档' = '已归档',
  required = false,
  version = 'V1',
): ArchiveAttachment {
  return {
    id,
    projectId,
    contractId: MEETING_CONTRACT_ID,
    contractNo: '—',
    contractName: '会议纪要',
    nodePath: '项目档案固定节点 > 会议纪要',
    bizCode: 'MEETING_MINUTES',
    attachmentName,
    docName,
    format,
    size,
    version,
    uploader,
    uploadTime,
    archiveStatus,
    required,
    sourceFunction: MEETING_SOURCE,
    origin: 'meeting',
  };
}

const seedAttachments: Record<string, ArchiveAttachment[]> = {
  'ap-1': [
    { id: 'aa-1', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', bizCode: 'ACCEPTANCE_RECORD_CREATE', attachmentName: '验收申请表_高炉耐材砌筑_20260315.pdf', docName: '验收申请表', format: 'PDF', size: '2.3 MB', version: 'V3', uploader: '张明远', uploadTime: '2026-03-15 14:22:00', archiveStatus: '已归档', required: true, sourceFunction: '新增验收记录', origin: 'business' },
    { id: 'aa-2', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', bizCode: 'ACCEPTANCE_RECORD_CREATE', attachmentName: '施工质量检查记录_高炉耐材_20260315.pdf', docName: '施工质量检查记录', format: 'PDF', size: '4.8 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-03-15 14:25:00', archiveStatus: '已归档', required: true, sourceFunction: '新增验收记录', origin: 'business' },
    { id: 'aa-3', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', bizCode: 'ACCEPTANCE_RECORD_CREATE', attachmentName: '材料合格证_高铝砖_202603.pdf', docName: '材料合格证及检测报告', format: 'PDF', size: '1.5 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-03-15 14:30:00', archiveStatus: '已归档', required: true, sourceFunction: '新增验收记录', origin: 'business' },
    { id: 'aa-4', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', bizCode: 'ACCEPTANCE_RECORD_CREATE', attachmentName: '隐蔽工程验收记录_高炉基础_20260320.pdf', docName: '隐蔽工程验收记录', format: 'PDF', size: '3.2 MB', version: 'V1', uploader: '李建国', uploadTime: '2026-03-20 09:15:00', archiveStatus: '已归档', required: true, sourceFunction: '新增验收记录', origin: 'business' },
    { id: 'aa-5', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', bizCode: 'ACCEPTANCE_RECORD_CREATE', attachmentName: '现场照片_高炉砌筑_202603.zip', docName: '现场照片及影像资料', format: 'ZIP', size: '85.6 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-03-15 15:00:00', archiveStatus: '未归档', required: false, sourceFunction: '新增验收记录', origin: 'business' },
    { id: 'aa-6', projectId: 'ap-1', contractId: 'c-2', contractNo: 'HT-2024-002', contractName: '转炉设备基础施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', bizCode: 'START_ORDER_APPROVE', attachmentName: '开工报告_转炉设备基础.pdf', docName: '开工报告', format: 'PDF', size: '1.8 MB', version: 'V2', uploader: '周建华', uploadTime: '2026-02-01 08:30:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批', origin: 'business' },
    { id: 'aa-7', projectId: 'ap-1', contractId: 'c-2', contractNo: 'HT-2024-002', contractName: '转炉设备基础施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', bizCode: 'START_ORDER_APPROVE', attachmentName: '施工组织设计_转炉基础_202602.pdf', docName: '施工组织设计', format: 'PDF', size: '28.5 MB', version: 'V3', uploader: '周建华', uploadTime: '2026-02-01 08:35:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批', origin: 'business' },
    { id: 'aa-8', projectId: 'ap-1', contractId: 'c-2', contractNo: 'HT-2024-002', contractName: '转炉设备基础施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', bizCode: 'START_ORDER_APPROVE', attachmentName: '安全协议_转炉基础_202602.pdf', docName: '安全协议', format: 'PDF', size: '3.1 MB', version: 'V1', uploader: '周建华', uploadTime: '2026-02-01 08:40:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批', origin: 'business' },
    { id: 'aa-9', projectId: 'ap-1', contractId: 'c-2', contractNo: 'HT-2024-002', contractName: '转炉设备基础施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', bizCode: 'START_ORDER_APPROVE', attachmentName: '资质证书_江苏建工.pdf', docName: '资质证书', format: 'PDF', size: '5.2 MB', version: 'V1', uploader: '周建华', uploadTime: '2026-02-01 08:45:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批', origin: 'business' },
    { id: 'aa-10', projectId: 'ap-1', contractId: 'c-3', contractNo: 'HT-2024-005', contractName: '环保除尘设施土建施工合同', nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', bizCode: 'PAYMENT_DECLARE_CREATE', attachmentName: '工程款申报表_除尘设施_202604.pdf', docName: '工程款申报表', format: 'PDF', size: '1.2 MB', version: 'V2', uploader: '冯志明', uploadTime: '2026-04-10 10:00:00', archiveStatus: '已归档', required: true, sourceFunction: '新增申报', origin: 'business' },
    { id: 'aa-11', projectId: 'ap-1', contractId: 'c-3', contractNo: 'HT-2024-005', contractName: '环保除尘设施土建施工合同', nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', bizCode: 'PAYMENT_DECLARE_CREATE', attachmentName: '工程量清单_除尘设施_202604.xlsx', docName: '工程量清单', format: 'XLSX', size: '0.8 MB', version: 'V1', uploader: '冯志明', uploadTime: '2026-04-10 10:05:00', archiveStatus: '已归档', required: true, sourceFunction: '新增申报', origin: 'business' },
    { id: 'aa-12', projectId: 'ap-1', contractId: 'c-3', contractNo: 'HT-2024-005', contractName: '环保除尘设施土建施工合同', nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', bizCode: 'PAYMENT_DECLARE_CREATE', attachmentName: '发票扫描件_除尘设施_202604.pdf', docName: '发票扫描件', format: 'PDF', size: '3.5 MB', version: 'V1', uploader: '冯志明', uploadTime: '2026-04-10 10:10:00', archiveStatus: '已归档', required: true, sourceFunction: '新增申报', origin: 'business' },
    { id: 'aa-13', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 新增超期申请', bizCode: 'OVERDUE_APPLY_CREATE', attachmentName: '超期原因说明书_高炉耐材_202605.pdf', docName: '超期原因说明书', format: 'PDF', size: '1.1 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-05-10 16:00:00', archiveStatus: '已归档', required: true, sourceFunction: '新增超期申请', origin: 'business' },
    { id: 'aa-14', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 新增超期申请', bizCode: 'OVERDUE_APPLY_CREATE', attachmentName: '施工进度对比表_高炉耐材_202605.xlsx', docName: '施工进度对比表', format: 'XLSX', size: '0.5 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-05-10 16:05:00', archiveStatus: '已归档', required: true, sourceFunction: '新增超期申请', origin: 'business' },
    { id: 'aa-15', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 新增超期申请', bizCode: 'OVERDUE_APPLY_CREATE', attachmentName: '监理单位意见书_202605.pdf', docName: '监理单位意见书', format: 'PDF', size: '0.6 MB', version: 'V1', uploader: '张明远', uploadTime: '2026-05-12 09:00:00', archiveStatus: '未归档', required: false, sourceFunction: '新增超期申请', origin: 'business' },
    { id: 'aa-m1', projectId: 'ap-1', contractId: 'c-1', contractNo: 'HT-2024-001', contractName: '高炉本体耐材砌筑施工合同', nodePath: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', bizCode: 'ACCEPTANCE_RECORD_CREATE', attachmentName: '补充_隐蔽影像_202604.zip', docName: '现场照片及影像资料', format: 'ZIP', size: '42.0 MB', version: 'V1', uploader: '档案员王敏', uploadTime: '2026-04-18 11:20:00', archiveStatus: '已归档', required: false, sourceFunction: '新增验收记录', origin: 'manual' },
    meetingAtt('aa-meet-1', 'ap-1', '会议录音', '高炉营缮_开工协调会_20260210.mp3', 'MP3', '86.2 MB', '张明远', '2026-02-10 17:30:00', '已归档', false, 'V1'),
    meetingAtt('aa-meet-2', 'ap-1', '会议纪要文本', '高炉营缮_开工协调会议纪要_20260210.docx', 'DOCX', '0.4 MB', '张明远', '2026-02-10 18:00:00', '已归档', true, 'V2'),
    meetingAtt('aa-meet-3', 'ap-1', '会议签到表', '开工协调会签到表_20260210.pdf', 'PDF', '0.3 MB', '李建国', '2026-02-10 17:00:00', '已归档', false),
    meetingAtt('aa-meet-4', 'ap-1', '会议材料/PPT', '高炉营缮施工方案汇报_20260210.pptx', 'PPTX', '12.5 MB', '周建华', '2026-02-10 16:40:00', '已归档', false),
    meetingAtt('aa-meet-5', 'ap-1', '会议纪要文本', '耐材砌筑质量专题会纪要_20260322.pdf', 'PDF', '0.6 MB', '张明远', '2026-03-22 16:20:00', '已归档', true),
    meetingAtt('aa-meet-6', 'ap-1', '会议录音', '质量专题会录音_20260322.m4a', 'M4A', '54.1 MB', '李建国', '2026-03-22 16:25:00', '未归档', false),
  ],
  'ap-2': [
    { id: 'aa-20', projectId: 'ap-2', contractId: 'c-5', contractNo: 'HT-2025-001', contractName: '转炉自动化控制系统合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', bizCode: 'START_ORDER_APPROVE', attachmentName: '开工报告_转炉自动化.pdf', docName: '开工报告', format: 'PDF', size: '1.5 MB', version: 'V1', uploader: '赵卫东', uploadTime: '2026-03-01 09:00:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批', origin: 'business' },
    { id: 'aa-21', projectId: 'ap-2', contractId: 'c-5', contractNo: 'HT-2025-001', contractName: '转炉自动化控制系统合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', bizCode: 'START_ORDER_APPROVE', attachmentName: '施工组织设计_转炉自动化_202603.pdf', docName: '施工组织设计', format: 'PDF', size: '32.1 MB', version: 'V2', uploader: '赵卫东', uploadTime: '2026-03-01 09:05:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批', origin: 'business' },
    { id: 'aa-22', projectId: 'ap-2', contractId: 'c-6', contractNo: 'HT-2025-002', contractName: '转炉烟气净化系统合同', nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', bizCode: 'PAYMENT_DECLARE_CREATE', attachmentName: '工程款申报表_烟气净化_202605.pdf', docName: '工程款申报表', format: 'PDF', size: '1.0 MB', version: 'V1', uploader: '孙伟', uploadTime: '2026-05-15 14:00:00', archiveStatus: '已归档', required: true, sourceFunction: '新增申报', origin: 'business' },
    { id: 'aa-23', projectId: 'ap-2', contractId: 'c-5', contractNo: 'HT-2025-001', contractName: '转炉自动化控制系统合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', bizCode: 'START_ORDER_APPROVE', attachmentName: '安全协议_转炉自动化.pdf', docName: '安全协议', format: 'PDF', size: '2.2 MB', version: 'V1', uploader: '赵卫东', uploadTime: '2026-03-01 09:10:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批', origin: 'business' },
    { id: 'aa-24', projectId: 'ap-2', contractId: 'c-6', contractNo: 'HT-2025-002', contractName: '转炉烟气净化系统合同', nodePath: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', bizCode: 'PAYMENT_DECLARE_CREATE', attachmentName: '工程量清单_烟气净化.xlsx', docName: '工程量清单', format: 'XLSX', size: '0.7 MB', version: 'V1', uploader: '孙伟', uploadTime: '2026-05-15 14:05:00', archiveStatus: '未归档', required: true, sourceFunction: '新增申报', origin: 'business' },
    meetingAtt('aa-meet-20', 'ap-2', '会议纪要文本', '转炉改造启动会纪要_20260305.docx', 'DOCX', '0.5 MB', '赵卫东', '2026-03-05 17:00:00', '已归档', true, 'V1'),
    meetingAtt('aa-meet-21', 'ap-2', '会议录音', '转炉改造启动会录音_20260305.mp3', 'MP3', '72.0 MB', '赵卫东', '2026-03-05 17:10:00', '已归档', false),
    meetingAtt('aa-meet-22', 'ap-2', '会议签到表', '启动会签到表_20260305.pdf', 'PDF', '0.2 MB', '孙伟', '2026-03-05 16:50:00', '已归档', false),
    meetingAtt('aa-meet-23', 'ap-2', '会议材料/PPT', '自动化系统实施方案_20260305.pdf', 'PDF', '8.6 MB', '赵卫东', '2026-03-05 16:30:00', '未归档', false),
    meetingAtt('aa-meet-24', 'ap-2', '会议纪要文本', '烟气净化联调专题纪要_20260520.pdf', 'PDF', '0.4 MB', '孙伟', '2026-05-20 15:40:00', '已归档', true),
  ],
  'ap-3': [
    { id: 'aa-30', projectId: 'ap-3', contractId: 'c-7', contractNo: 'HT-2025-010', contractName: '轧线智能化改造施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', bizCode: 'START_ORDER_APPROVE', attachmentName: '开工报告_轧线智能化.pdf', docName: '开工报告', format: 'PDF', size: '1.4 MB', version: 'V1', uploader: '陈磊', uploadTime: '2026-04-02 09:00:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批', origin: 'business' },
    { id: 'aa-31', projectId: 'ap-3', contractId: 'c-7', contractNo: 'HT-2025-010', contractName: '轧线智能化改造施工合同', nodePath: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', bizCode: 'START_ORDER_APPROVE', attachmentName: '安全协议_轧线智能化.pdf', docName: '安全协议', format: 'PDF', size: '2.0 MB', version: 'V1', uploader: '陈磊', uploadTime: '2026-04-02 09:10:00', archiveStatus: '已归档', required: true, sourceFunction: '开工令审批', origin: 'business' },
    meetingAtt('aa-meet-30', 'ap-3', '会议纪要文本', '轧线智能化论证会纪要_20240415.docx', 'DOCX', '0.5 MB', '陈磊', '2026-04-15 16:00:00', '已归档', true),
    meetingAtt('aa-meet-31', 'ap-3', '会议录音', '论证会录音_20240415.wav', 'WAV', '120.0 MB', '陈磊', '2026-04-15 16:10:00', '已归档', false),
    meetingAtt('aa-meet-32', 'ap-3', '会议签到表', '论证会签到_20240415.xlsx', 'XLSX', '0.1 MB', '档案员王敏', '2026-04-15 15:50:00', '未归档', false),
  ],
};

const seedVersionHistories: Record<string, VersionRecord[]> = {
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
  'aa-meet-2': [
    { id: 'v-m1', attachmentId: 'aa-meet-2', versionNo: 'V2', fileName: '高炉营缮_开工协调会议纪要_20260210.docx', fileSize: '0.4 MB', uploader: '张明远', uploadTime: '2026-02-10 18:00:00' },
    { id: 'v-m2', attachmentId: 'aa-meet-2', versionNo: 'V1', fileName: '高炉营缮_开工协调会议纪要草稿_20260210.docx', fileSize: '0.3 MB', uploader: '张明远', uploadTime: '2026-02-10 17:45:00' },
  ],
};

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

interface ArchiveMgmtStore {
  attachments: Record<string, ArchiveAttachment[]>;
  versions: Record<string, VersionRecord[]>;
}

function cloneSeed(): ArchiveMgmtStore {
  return {
    attachments: JSON.parse(JSON.stringify(seedAttachments)),
    versions: JSON.parse(JSON.stringify(seedVersionHistories)),
  };
}

let memoryStore: ArchiveMgmtStore | null = null;

export function loadArchiveMgmtStore(): ArchiveMgmtStore {
  if (memoryStore) return memoryStore;
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(ARCHIVE_MGMT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ArchiveMgmtStore;
        if (parsed?.attachments) {
          memoryStore = parsed;
          return memoryStore;
        }
      }
    } catch {
      /* ignore */
    }
  }
  memoryStore = cloneSeed();
  saveArchiveMgmtStore(memoryStore);
  return memoryStore;
}

export function saveArchiveMgmtStore(store: ArchiveMgmtStore): void {
  memoryStore = store;
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(ARCHIVE_MGMT_STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

function nowStr() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function formatExt(name: string): string {
  const ext = name.split('.').pop()?.toUpperCase() || '其他';
  if (['DOC', 'DOCX'].includes(ext)) return ext === 'DOC' ? 'DOC' : 'DOCX';
  if (['XLS', 'XLSX'].includes(ext)) return 'XLSX';
  if (['JPG', 'JPEG', 'PNG', 'BMP'].includes(ext)) return ext === 'JPEG' ? 'JPG' : ext;
  if (['MP3', 'WAV', 'M4A', 'AAC'].includes(ext)) return ext;
  if (['MP4', 'AVI'].includes(ext)) return ext;
  if (['ZIP', 'RAR', '7Z'].includes(ext)) return 'ZIP';
  if (ext === 'PDF') return 'PDF';
  if (['PPT', 'PPTX'].includes(ext)) return 'PPTX';
  return ext || '其他';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getArchiveProjectById(id: string): ArchiveProject | undefined {
  return archiveProjects.find((p) => p.id === id);
}

export function getArchiveAttachments(projectId: string): ArchiveAttachment[] {
  return loadArchiveMgmtStore().attachments[projectId] || [];
}

export function getVersionHistory(attachmentId: string): VersionRecord[] {
  return loadArchiveMgmtStore().versions[attachmentId] || [];
}

export function getMissingDocs(projectId: string): MissingDoc[] {
  return missingDocs[projectId] || [];
}

/** 全库已归档历史文档（跨项目） */
export function getAllArchivedHistoryDocs(): (ArchiveAttachment & { projectName: string; approvalNo: string; projectType: string })[] {
  const store = loadArchiveMgmtStore();
  const rows: (ArchiveAttachment & { projectName: string; approvalNo: string; projectType: string })[] = [];
  Object.keys(store.attachments).forEach((pid) => {
    const project = getArchiveProjectById(pid);
    if (!project) return;
    (store.attachments[pid] || [])
      .filter((a) => a.archiveStatus === '已归档')
      .forEach((a) => {
        rows.push({
          ...a,
          projectName: project.projectName,
          approvalNo: project.approvalNo,
          projectType: project.projectType,
        });
      });
  });
  return rows.sort((a, b) => b.uploadTime.localeCompare(a.uploadTime));
}

export function buildArchiveTree(projectId: string): ArchiveTreeNode[] {
  const attachments = getArchiveAttachments(projectId);
  const project = archiveProjects.find((p) => p.id === projectId);
  if (!project) return [];

  const nodes: ArchiveTreeNode[] = [];
  const meetingAtts = attachments.filter((a) => a.origin === 'meeting' || a.contractId === MEETING_CONTRACT_ID);
  const businessAtts = attachments.filter((a) => a.origin !== 'meeting' && a.contractId !== MEETING_CONTRACT_ID);

  nodes.push({
    key: `${projectId}-root`,
    label: project.projectName,
    type: 'project',
    parentKey: null,
    count: attachments.length,
  });

  // 固定节点：会议纪要（始终存在）
  nodes.push({
    key: `${projectId}-meeting`,
    label: '会议纪要',
    type: 'meeting',
    parentKey: `${projectId}-root`,
    count: meetingAtts.length,
  });

  const contractMap = new Map<string, ArchiveAttachment[]>();
  businessAtts.forEach((a) => {
    const existing = contractMap.get(a.contractId) || [];
    existing.push(a);
    contractMap.set(a.contractId, existing);
  });

  contractMap.forEach((contractAtts, contractId) => {
    const first = contractAtts[0];
    const contractKey = `${projectId}-${contractId}`;
    nodes.push({
      key: contractKey,
      label: `${first.contractNo} ${first.contractName}`,
      type: 'contract',
      parentKey: `${projectId}-root`,
      count: contractAtts.length,
    });

    const nodeMap = new Map<string, ArchiveAttachment[]>();
    contractAtts.forEach((a) => {
      const existing = nodeMap.get(a.sourceFunction) || [];
      existing.push(a);
      nodeMap.set(a.sourceFunction, existing);
    });

    nodeMap.forEach((nodeAtts, sourceFunc) => {
      nodes.push({
        key: `${contractKey}-${sourceFunc}`,
        label: sourceFunc,
        type: 'node',
        parentKey: contractKey,
        count: nodeAtts.length,
      });
    });
  });

  return nodes;
}

export function findAttachmentById(attachmentId: string): ArchiveAttachment | undefined {
  const store = loadArchiveMgmtStore();
  for (const list of Object.values(store.attachments)) {
    const found = list.find((a) => a.id === attachmentId);
    if (found) return found;
  }
  return undefined;
}

export function replaceArchiveAttachment(
  attachmentId: string,
  file: { name: string; size: number },
  uploader = '档案员王敏',
): { ok: boolean; message: string; attachment?: ArchiveAttachment } {
  const store = loadArchiveMgmtStore();
  for (const pid of Object.keys(store.attachments)) {
    const list = store.attachments[pid];
    const idx = list.findIndex((a) => a.id === attachmentId);
    if (idx < 0) continue;
    const prev = list[idx];
    const verNum = Number((prev.version || 'V1').replace(/\D/g, '')) || 1;
    const nextVer = `V${verNum + 1}`;
    const next: ArchiveAttachment = {
      ...prev,
      attachmentName: file.name,
      format: formatExt(file.name),
      size: formatSize(file.size),
      version: nextVer,
      uploader,
      uploadTime: nowStr(),
      archiveStatus: '已归档',
    };
    list[idx] = next;
    const hist = store.versions[attachmentId] ? [...store.versions[attachmentId]] : [];
    hist.unshift({
      id: uid('v'),
      attachmentId,
      versionNo: nextVer,
      fileName: file.name,
      fileSize: formatSize(file.size),
      uploader,
      uploadTime: nowStr(),
    });
    if (!hist.some((h) => h.versionNo === prev.version)) {
      hist.push({
        id: uid('v'),
        attachmentId,
        versionNo: prev.version,
        fileName: prev.attachmentName,
        fileSize: prev.size,
        uploader: prev.uploader,
        uploadTime: prev.uploadTime,
      });
    }
    store.versions[attachmentId] = hist;
    saveArchiveMgmtStore(store);
    return { ok: true, message: '附件已替换并归档', attachment: next };
  }
  return { ok: false, message: '未找到附件' };
}

export interface ManualUploadInput {
  projectId: string;
  /** meeting | 业务挂载 */
  mode: 'meeting' | 'manual';
  nodeId?: string;
  nodePath: string;
  bizCode?: string;
  sourceFunction: string;
  contractId?: string;
  contractNo?: string;
  contractName?: string;
  docName: string;
  configDocId?: string;
  required?: boolean;
  file: { name: string; size: number };
  uploader?: string;
}

export function addManualArchiveAttachment(input: ManualUploadInput): { ok: boolean; message: string; attachment?: ArchiveAttachment } {
  const store = loadArchiveMgmtStore();
  if (!store.attachments[input.projectId]) store.attachments[input.projectId] = [];
  const isMeeting = input.mode === 'meeting';
  const att: ArchiveAttachment = {
    id: uid('aa'),
    projectId: input.projectId,
    contractId: isMeeting ? MEETING_CONTRACT_ID : (input.contractId || 'manual'),
    contractNo: isMeeting ? '—' : (input.contractNo || '手动归档'),
    contractName: isMeeting ? '会议纪要' : (input.contractName || '手动新增'),
    nodePath: input.nodePath,
    bizCode: input.bizCode,
    attachmentName: input.file.name,
    docName: input.docName,
    format: formatExt(input.file.name),
    size: formatSize(input.file.size),
    version: 'V1',
    uploader: input.uploader || '档案员王敏',
    uploadTime: nowStr(),
    archiveStatus: '已归档',
    required: !!input.required,
    sourceFunction: input.sourceFunction,
    origin: isMeeting ? 'meeting' : 'manual',
    configDocId: input.configDocId,
  };
  store.attachments[input.projectId].unshift(att);
  store.versions[att.id] = [
    {
      id: uid('v'),
      attachmentId: att.id,
      versionNo: 'V1',
      fileName: att.attachmentName,
      fileSize: att.size,
      uploader: att.uploader,
      uploadTime: att.uploadTime,
    },
  ];
  saveArchiveMgmtStore(store);
  return { ok: true, message: '附件已上传并归档', attachment: att };
}

/** 兼容旧导出名 */
export const archiveAttachments = seedAttachments;
export const versionHistories = seedVersionHistories;

if (typeof localStorage !== 'undefined') {
  loadArchiveMgmtStore();
}
