import { projects } from './projectPrepareMocks';

export interface ApprovalStage {
  id: string;
  projectId: string;
  name: string;
  status: '未开始' | '进行中' | '已完成';
  sortOrder: number;
  attachments: StageAttachment[];
}

export interface StageAttachment {
  id: string;
  stageId: string;
  name: string;
  fileType: string;
  fileSize: string;
  description: string;
  uploader: string;
  uploadTime: string;
  downloadUrl: string;
}

export interface OperationLog {
  id: string;
  stageId: string;
  operator: string;
  operationTime: string;
  operationType: '上传' | '修改' | '删除' | '下载';
  operationContent: string;
  result: '成功' | '失败';
}

export const stageNames = [
  '土地购置',
  '规划设计要点',
  '规划许可证',
  '施工许可证',
  '竣工验收',
  '不动产权证办理',
];

const fileTypeIcons: Record<string, string> = {
  'pdf': 'ri-file-pdf-line',
  'doc': 'ri-file-word-line',
  'docx': 'ri-file-word-line',
  'xls': 'ri-file-excel-line',
  'xlsx': 'ri-file-excel-line',
  'ppt': 'ri-file-ppt-line',
  'pptx': 'ri-file-ppt-line',
  'jpg': 'ri-image-line',
  'jpeg': 'ri-image-line',
  'png': 'ri-image-line',
  'rar': 'ri-file-zip-line',
  'zip': 'ri-file-zip-line',
};

const fileTypeLabels: Record<string, string> = {
  'pdf': 'PDF',
  'doc': 'Word',
  'docx': 'Word',
  'xls': 'Excel',
  'xlsx': 'Excel',
  'ppt': 'PPT',
  'pptx': 'PPT',
  'jpg': '图片',
  'jpeg': '图片',
  'png': '图片',
  'rar': '压缩包',
  'zip': '压缩包',
};

const fileTypeColors: Record<string, string> = {
  'pdf': 'text-red-500',
  'doc': 'text-blue-500',
  'docx': 'text-blue-500',
  'xls': 'text-emerald-500',
  'xlsx': 'text-emerald-500',
  'ppt': 'text-orange-500',
  'pptx': 'text-orange-500',
  'jpg': 'text-violet-500',
  'jpeg': 'text-violet-500',
  'png': 'text-violet-500',
  'rar': 'text-amber-500',
  'zip': 'text-amber-500',
};

const attachmentNames = [
  '土地购置合同', '土地出让金缴纳凭证', '土地使用权证书', '土地勘测定界报告',
  '规划设计要点通知书', '规划条件审批表', '用地红线图', '规划设计方案',
  '建设工程规划许可证', '规划总平面图', '建筑平面图', '剖面图',
  '建筑工程施工许可证', '施工图纸审查合格书', '质量安全监督登记表', '施工组织设计',
  '竣工验收备案表', '竣工验收报告', '消防验收意见书', '环保验收报告',
  '不动产权证', '不动产登记申请表', '房产测绘报告', '契税完税证明',
];

const fileTypePool = ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'zip', 'rar'];
const fileSizePool = ['1.2MB', '2.5MB', '856KB', '3.1MB', '1.8MB', '4.2MB', '512KB', '2.8MB', '1.5MB', '3.6MB'];

const uploaders = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟', '孙伟', '周鹏'];

const descriptions = [
  '项目用地相关文件，经国土局审批通过',
  '设计阶段相关图纸及审批文件',
  '施工许可相关申请材料',
  '验收阶段各专项验收文件',
  '产权登记相关申请材料',
  '规划审批阶段补充材料',
  '土地测量及勘界报告',
  '施工图审查合格文件',
];

const operationLogContents = [
  '上传附件《土地购置合同.pdf》',
  '修改附件《规划设计方案.docx》说明',
  '删除附件《土地出让金缴纳凭证.pdf》',
  '下载附件《建设工程规划许可证.pdf》',
  '批量下载3个附件',
  '上传附件《竣工验收报告.pdf》',
  '修改附件《消防验收意见书.pdf》说明',
  '上传附件《不动产权证.pdf》',
  '下载附件《房产测绘报告.pdf》',
  '删除附件《施工组织设计.docx》',
];

// Generate stages for each project
export const approvalStages: ApprovalStage[] = [];
export const stageAttachments: StageAttachment[] = [];
export const operationLogs: OperationLog[] = [];

let attachmentIdCounter = 1;
let logIdCounter = 1;

projects.forEach((project, pIdx) => {
  // Each project has varying completion status
  // Some projects have completed all stages, some only first few
  const completedStages = Math.floor(Math.random() * 6) + 1; // 1-6 stages

  stageNames.forEach((name, sIdx) => {
    let status: ApprovalStage['status'] = '未开始';
    if (sIdx < completedStages) {
      status = '已完成';
    } else if (sIdx === completedStages) {
      status = '进行中';
    }

    const stageId = `stage_${project.id}_${sIdx}`;

    approvalStages.push({
      id: stageId,
      projectId: project.id,
      name,
      status,
      sortOrder: sIdx,
    });

    // Generate attachments for completed and in-progress stages
    if (status !== '未开始') {
      const attachmentCount = status === '已完成' ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 2) + 1;

      for (let aIdx = 0; aIdx < attachmentCount; aIdx++) {
        const globalIdx = attachmentIdCounter++;
        const fileType = fileTypePool[(globalIdx + sIdx) % fileTypePool.length];
        const attachmentName = attachmentNames[(pIdx * 6 + sIdx * 3 + aIdx) % attachmentNames.length];
        const attachment: StageAttachment = {
          id: `attach_${String(globalIdx).padStart(4, '0')}`,
          stageId,
          name: `${attachmentName}.${fileType}`,
          fileType: fileTypeLabels[fileType] || fileType.toUpperCase(),
          fileSize: fileSizePool[(globalIdx + aIdx) % fileSizePool.length],
          description: descriptions[(globalIdx) % descriptions.length],
          uploader: uploaders[(globalIdx) % uploaders.length],
          uploadTime: `2026-${String(1 + (sIdx % 5)).padStart(2, '0')}-${String(10 + (aIdx * 3 + globalIdx % 15)).padStart(2, '0')} ${String(9 + (aIdx % 4)).padStart(2, '0')}:00:00`,
          downloadUrl: '#',
        };
        stageAttachments.push(attachment);

        // Generate operation logs for each attachment
        const logCount = Math.floor(Math.random() * 2) + 1;
        for (let lIdx = 0; lIdx < logCount; lIdx++) {
          const logGlobalIdx = logIdCounter++;
          operationLogs.push({
            id: `log_${String(logGlobalIdx).padStart(4, '0')}`,
            stageId,
            operator: uploaders[(logGlobalIdx + lIdx) % uploaders.length],
            operationTime: `2026-${String(1 + (sIdx % 5)).padStart(2, '0')}-${String(10 + (lIdx * 5 + logGlobalIdx % 15)).padStart(2, '0')} ${String(10 + (lIdx % 3)).padStart(2, '0')}:30:00`,
            operationType: (['上传', '修改', '删除', '下载'] as OperationLog['operationType'][])[(logGlobalIdx + lIdx) % 4],
            operationContent: operationLogContents[(logGlobalIdx) % operationLogContents.length],
            result: (logGlobalIdx % 10) === 0 ? '失败' : '成功',
          });
        }
      }
    }
  });
});

export function getProjectStages(projectId: string): ApprovalStage[] {
  return approvalStages.filter((s) => s.projectId === projectId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getStageAttachments(stageId: string): StageAttachment[] {
  return stageAttachments.filter((a) => a.stageId === stageId);
}

export function getStageOperationLogs(stageId: string): OperationLog[] {
  return operationLogs
    .filter((l) => l.stageId === stageId)
    .sort((a, b) => b.operationTime.localeCompare(a.operationTime));
}

export function getFileTypeIcon(fileType: string): string {
  const ext = Object.keys(fileTypeIcons).find((k) => fileType.toLowerCase().includes(k));
  return ext ? fileTypeIcons[ext] : 'ri-file-line';
}

export function getFileTypeColor(fileType: string): string {
  const ext = Object.keys(fileTypeColors).find((k) => fileType.toLowerCase().includes(k));
  return ext ? fileTypeColors[ext] : 'text-slate-500';
}

export function getOperationTypeColor(type: OperationLog['operationType']): string {
  const colors: Record<OperationLog['operationType'], string> = {
    '上传': 'text-emerald-600 bg-emerald-50',
    '修改': 'text-blue-600 bg-blue-50',
    '删除': 'text-red-600 bg-red-50',
    '下载': 'text-slate-600 bg-slate-100',
  };
  return colors[type] || 'text-slate-600 bg-slate-100';
}

export function getOperationTypeIcon(type: OperationLog['operationType']): string {
  const icons: Record<OperationLog['operationType'], string> = {
    '上传': 'ri-upload-cloud-line',
    '修改': 'ri-edit-line',
    '删除': 'ri-delete-bin-line',
    '下载': 'ri-download-line',
  };
  return icons[type] || 'ri-file-list-line';
}

export function getStageStatusColor(status: ApprovalStage['status']): string {
  const colors: Record<ApprovalStage['status'], string> = {
    '未开始': 'text-slate-500 bg-slate-50 border border-slate-200',
    '进行中': 'text-amber-600 bg-amber-50 border border-amber-200',
    '已完成': 'text-emerald-600 bg-emerald-50 border border-emerald-200',
  };
  return colors[status] || 'text-slate-500 bg-slate-50';
}

export function getStageStatusIcon(status: ApprovalStage['status']): string {
  const icons: Record<ApprovalStage['status'], string> = {
    '未开始': 'ri-time-line',
    '进行中': 'ri-loader-4-line',
    '已完成': 'ri-check-double-line',
  };
  return icons[status] || 'ri-time-line';
}

// Helper to add a new attachment
export function addAttachment(stageId: string, attachment: Omit<StageAttachment, 'id'>): StageAttachment {
  const newAttachment: StageAttachment = {
    ...attachment,
    id: `attach_${String(attachmentIdCounter++).padStart(4, '0')}`,
  };
  stageAttachments.push(newAttachment);
  return newAttachment;
}

// Helper to add an operation log
export function addOperationLog(stageId: string, log: Omit<OperationLog, 'id'>): OperationLog {
  const newLog: OperationLog = {
    ...log,
    id: `log_${String(logIdCounter++).padStart(4, '0')}`,
  };
  operationLogs.push(newLog);
  return newLog;
}

// Helper to delete attachments
export function deleteAttachments(attachmentIds: string[]): void {
  for (let i = stageAttachments.length - 1; i >= 0; i--) {
    if (attachmentIds.includes(stageAttachments[i].id)) {
      stageAttachments.splice(i, 1);
    }
  }
}

// Helper to update attachment description
export function updateAttachmentDescription(attachmentId: string, description: string): void {
  const attachment = stageAttachments.find((a) => a.id === attachmentId);
  if (attachment) {
    attachment.description = description;
  }
}

// Helper to update stage status
export function updateStageStatus(stageId: string, status: ApprovalStage['status']): void {
  const stage = approvalStages.find((s) => s.id === stageId);
  if (stage) {
    stage.status = status;
  }
}