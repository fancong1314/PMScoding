import { projects, getProjectById } from './projectPrepareMocks';
import {
  getStageDefsForProject,
  getSchemeForProject,
  type PermitStageDef,
} from './approvalPermitConfigMocks';

export interface ApprovalStage {
  id: string;
  projectId: string;
  stageKey: string;
  name: string;
  status: '未开始' | '进行中' | '已完成';
  sortOrder: number;
  attachments: StageAttachment[];
}

export interface StageAttachment {
  id: string;
  stageId: string;
  /** 配置侧办结文件 id */
  docId: string;
  /** 配置要求的办结文件名称 */
  docName: string;
  /** 实际上传的附件文件名 */
  name: string;
  fileType: string;
  fileSize: string;
  description: string;
  uploader: string;
  uploadTime: string;
  /** 办理人员 */
  handler: string;
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
  '项目备案',
  '规划许可证',
  '施工许可证',
  '安评',
  '环评',
  '能评',
  '水土保持',
  '竣工验收',
];

const fileTypeIcons: Record<string, string> = {
  pdf: 'ri-file-pdf-line',
  doc: 'ri-file-word-line',
  docx: 'ri-file-word-line',
  xls: 'ri-file-excel-line',
  xlsx: 'ri-file-excel-line',
  ppt: 'ri-file-ppt-line',
  pptx: 'ri-file-ppt-line',
  jpg: 'ri-image-line',
  jpeg: 'ri-image-line',
  png: 'ri-image-line',
  rar: 'ri-file-zip-line',
  zip: 'ri-file-zip-line',
};

const fileTypeLabels: Record<string, string> = {
  pdf: 'PDF',
  doc: 'Word',
  docx: 'Word',
  xls: 'Excel',
  xlsx: 'Excel',
  ppt: 'PPT',
  pptx: 'PPT',
  jpg: '图片',
  jpeg: '图片',
  png: '图片',
  rar: '压缩包',
  zip: '压缩包',
};

const fileTypeColors: Record<string, string> = {
  pdf: 'text-red-500',
  doc: 'text-blue-500',
  docx: 'text-blue-500',
  xls: 'text-emerald-500',
  xlsx: 'text-emerald-500',
  ppt: 'text-orange-500',
  pptx: 'text-orange-500',
  jpg: 'text-violet-500',
  jpeg: 'text-violet-500',
  png: 'text-violet-500',
  rar: 'text-amber-500',
  zip: 'text-amber-500',
};

const uploaders = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟', '孙伟', '周鹏'];
const handlers = ['王建国', '李志强', '张伟明', '刘卫东', '陈建华', '赵鹏', '孙伟', '周明', '吴昊'];

export const approvalStages: ApprovalStage[] = [];
export const stageAttachments: StageAttachment[] = [];
export const operationLogs: OperationLog[] = [];

let attachmentIdCounter = 1;
let logIdCounter = 1;
const seededProjects = new Set<string>();

function seedProject(projectId: string) {
  if (seededProjects.has(projectId)) return;
  const project = getProjectById(projectId) || projects.find((p) => p.id === projectId);
  if (!project) return;
  seededProjects.add(projectId);

  const defs = getStageDefsForProject(project);
  const pIdx = Math.max(0, projects.findIndex((p) => p.id === projectId));
  const completedCount = (pIdx % Math.max(1, defs.length)) + 1;

  defs.forEach((def, sIdx) => {
    let status: ApprovalStage['status'] = '未开始';
    if (sIdx < completedCount - 1) status = '已完成';
    else if (sIdx === completedCount - 1) status = '进行中';

    const stageId = `stage_${projectId}_${def.key}`;
    approvalStages.push({
      id: stageId,
      projectId,
      stageKey: def.key,
      name: def.name,
      status,
      sortOrder: sIdx,
      attachments: [],
    });

    if (status === '未开始') return;

    def.docs.forEach((d, aIdx) => {
      if (status === '进行中' && aIdx > 0) return;
      const globalIdx = attachmentIdCounter++;
      const ext = aIdx % 2 === 0 ? 'pdf' : 'docx';
      const attachment: StageAttachment = {
        id: `attach_${String(globalIdx).padStart(4, '0')}`,
        stageId,
        docId: d.id,
        docName: d.docName,
        name: `${d.docName}_办结.${ext}`,
        fileType: fileTypeLabels[ext],
        fileSize: ['1.2MB', '2.5MB', '856KB', '3.1MB'][aIdx % 4],
        description: aIdx % 2 === 0 ? `${d.docName}相关材料，手续已办结` : `办结文件：${d.docName}`,
        uploader: uploaders[(pIdx + aIdx) % uploaders.length],
        uploadTime: `2026-${String(1 + (sIdx % 5)).padStart(2, '0')}-${String(10 + aIdx * 3).padStart(2, '0')} 09:20:00`,
        handler: handlers[(pIdx + sIdx + aIdx) % handlers.length],
        downloadUrl: '#',
      };
      stageAttachments.push(attachment);
      operationLogs.push({
        id: `log_${String(logIdCounter++).padStart(4, '0')}`,
        stageId,
        operator: attachment.uploader,
        operationTime: attachment.uploadTime,
        operationType: '上传',
        operationContent: `上传附件《${attachment.name}》`,
        result: '成功',
      });
    });
  });
}

export function getProjectStages(projectId: string): ApprovalStage[] {
  seedProject(projectId);
  const project = getProjectById(projectId) || projects.find((p) => p.id === projectId);
  if (!project) return [];
  const defs = getStageDefsForProject(project);
  const existing = approvalStages.filter((s) => s.projectId === projectId);
  const byKey = new Map(existing.map((s) => [s.stageKey, s]));
  return defs.map((def, idx) => {
    const found = byKey.get(def.key);
    if (found) return { ...found, name: def.name, sortOrder: idx };
    const stageId = `stage_${projectId}_${def.key}`;
    const created: ApprovalStage = {
      id: stageId,
      projectId,
      stageKey: def.key,
      name: def.name,
      status: '未开始',
      sortOrder: idx,
      attachments: [],
    };
    approvalStages.push(created);
    return created;
  });
}

/** 报批报建阶段完成统计 */
export function getProjectStageProgress(projectId: string): {
  total: number;
  completed: number;
  ratio: number;
} {
  const stages = getProjectStages(projectId);
  const total = stages.length;
  const completed = stages.filter((s) => s.status === '已完成').length;
  const ratio = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, ratio };
}

export function getStageDefByStageId(stageId: string): PermitStageDef | undefined {
  const stage = approvalStages.find((s) => s.id === stageId);
  if (!stage) return undefined;
  const project = getProjectById(stage.projectId);
  if (!project) return undefined;
  return getStageDefsForProject(project).find((d) => d.key === stage.stageKey);
}

export function getSchemeNameForProject(projectId: string): string {
  const project = getProjectById(projectId);
  if (!project) return '未匹配配置方案（使用全部阶段）';
  const scheme = getSchemeForProject(project);
  return scheme ? scheme.name : '未匹配配置方案（使用全部阶段）';
}

export function getStageAttachments(stageId: string): StageAttachment[] {
  const def = getStageDefByStageId(stageId);
  const docsById = new Map((def?.docs || []).map((d) => [d.id, d.docName]));
  return stageAttachments
    .filter((a) => a.stageId === stageId)
    .map((a) => ({
      ...a,
      docName: a.docName || docsById.get(a.docId) || '—',
      handler: a.handler || a.uploader || '—',
    }));
}

export function getAttachmentsByDoc(stageId: string, docId: string): StageAttachment[] {
  return stageAttachments.filter((a) => a.stageId === stageId && a.docId === docId);
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
    上传: 'text-emerald-600 bg-emerald-50',
    修改: 'text-blue-600 bg-blue-50',
    删除: 'text-red-600 bg-red-50',
    下载: 'text-slate-600 bg-slate-100',
  };
  return colors[type] || 'text-slate-600 bg-slate-100';
}

export function getOperationTypeIcon(type: OperationLog['operationType']): string {
  const icons: Record<OperationLog['operationType'], string> = {
    上传: 'ri-upload-cloud-line',
    修改: 'ri-edit-line',
    删除: 'ri-delete-bin-line',
    下载: 'ri-download-line',
  };
  return icons[type] || 'ri-file-list-line';
}

export function getStageStatusColor(status: ApprovalStage['status']): string {
  const colors: Record<ApprovalStage['status'], string> = {
    未开始: 'text-slate-500 bg-slate-50 border border-slate-200',
    进行中: 'text-amber-600 bg-amber-50 border border-amber-200',
    已完成: 'text-emerald-600 bg-emerald-50 border border-emerald-200',
  };
  return colors[status] || 'text-slate-500 bg-slate-50';
}

export function getStageStatusIcon(status: ApprovalStage['status']): string {
  const icons: Record<ApprovalStage['status'], string> = {
    未开始: 'ri-time-line',
    进行中: 'ri-loader-4-line',
    已完成: 'ri-check-double-line',
  };
  return icons[status] || 'ri-time-line';
}

export function addAttachment(stageId: string, attachment: Omit<StageAttachment, 'id'>): StageAttachment {
  const newAttachment: StageAttachment = {
    ...attachment,
    id: `attach_${String(attachmentIdCounter++).padStart(4, '0')}`,
  };
  stageAttachments.push(newAttachment);
  return newAttachment;
}

export function addOperationLog(stageId: string, log: Omit<OperationLog, 'id'>): OperationLog {
  const newLog: OperationLog = {
    ...log,
    id: `log_${String(logIdCounter++).padStart(4, '0')}`,
  };
  operationLogs.push(newLog);
  return newLog;
}

export function deleteAttachments(attachmentIds: string[]): void {
  for (let i = stageAttachments.length - 1; i >= 0; i--) {
    if (attachmentIds.includes(stageAttachments[i].id)) {
      stageAttachments.splice(i, 1);
    }
  }
}

export function updateAttachment(
  attachmentId: string,
  patch: Partial<Pick<StageAttachment, 'description' | 'handler' | 'name' | 'fileType' | 'fileSize' | 'docId' | 'docName'>>,
): void {
  const attachment = stageAttachments.find((a) => a.id === attachmentId);
  if (attachment) Object.assign(attachment, patch);
}

export function updateStageStatus(stageId: string, status: ApprovalStage['status']): void {
  const stage = approvalStages.find((s) => s.id === stageId);
  if (stage) stage.status = status;
}
