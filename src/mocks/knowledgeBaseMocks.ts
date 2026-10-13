/** 工程智库 · 知识库管理演示数据 */

export type KnowledgeFileStatus = '成功' | '处理中' | '失败';
export type KnowledgeFileType = 'docx' | 'pdf' | 'xlsx' | 'md' | 'pptx';

export interface KnowledgeDoc {
  id: string;
  fileName: string;
  fileType: KnowledgeFileType;
  status: KnowledgeFileStatus;
  enabled: boolean;
  createTime: string;
  updateTime: string;
  sizeLabel: string;
  failReason?: string;
}

export const knowledgeDocsSeed: KnowledgeDoc[] = [
  {
    id: 'kb-001',
    fileName: '安全管理体系文件汇编(上).docx',
    fileType: 'docx',
    status: '成功',
    enabled: true,
    createTime: '2026-07-06 14:30:00',
    updateTime: '2026-07-06 14:30:00',
    sizeLabel: '2.4 MB',
  },
  {
    id: 'kb-002',
    fileName: '中厚板厂热处理线升级改造工程设计图纸.pdf',
    fileType: 'pdf',
    status: '成功',
    enabled: true,
    createTime: '2026-07-05 09:15:22',
    updateTime: '2026-07-08 11:02:18',
    sizeLabel: '18.6 MB',
  },
  {
    id: 'kb-003',
    fileName: '炼铁厂高炉大修项目管理规范.docx',
    fileType: 'docx',
    status: '处理中',
    enabled: false,
    createTime: '2026-07-08 16:40:05',
    updateTime: '2026-07-08 16:42:11',
    sizeLabel: '1.1 MB',
  },
  {
    id: 'kb-004',
    fileName: '2025年度工程项目投资计划汇总表.xlsx',
    fileType: 'xlsx',
    status: '成功',
    enabled: true,
    createTime: '2026-06-28 10:08:33',
    updateTime: '2026-07-01 08:20:00',
    sizeLabel: '856 KB',
  },
  {
    id: 'kb-005',
    fileName: '钢材轧制车间技改可行性研究报告.docx',
    fileType: 'docx',
    status: '失败',
    enabled: false,
    createTime: '2026-07-07 13:22:40',
    updateTime: '2026-07-07 13:25:01',
    sizeLabel: '3.2 MB',
    failReason: '文档解析超时，请重新导入',
  },
  {
    id: 'kb-006',
    fileName: '施工单位安全文明施工管理标准.docx',
    fileType: 'docx',
    status: '成功',
    enabled: true,
    createTime: '2026-06-15 15:45:00',
    updateTime: '2026-06-20 09:10:26',
    sizeLabel: '980 KB',
  },
  {
    id: 'kb-007',
    fileName: '工程智库知识图谱建设说明.md',
    fileType: 'md',
    status: '成功',
    enabled: true,
    createTime: '2026-07-02 11:00:00',
    updateTime: '2026-07-09 17:35:44',
    sizeLabel: '128 KB',
  },
  {
    id: 'kb-008',
    fileName: '项目交竣工验收工作指引.pptx',
    fileType: 'pptx',
    status: '处理中',
    enabled: false,
    createTime: '2026-07-09 08:55:12',
    updateTime: '2026-07-09 08:56:30',
    sizeLabel: '5.7 MB',
  },
  {
    id: 'kb-009',
    fileName: '焦化厂干熄焦改造专项施工组织设计.pdf',
    fileType: 'pdf',
    status: '失败',
    enabled: false,
    createTime: '2026-07-04 19:18:07',
    updateTime: '2026-07-04 19:20:55',
    sizeLabel: '12.3 MB',
    failReason: '文件损坏或格式不支持',
  },
  {
    id: 'kb-010',
    fileName: '工程项目全过程资料归档目录模板.xlsx',
    fileType: 'xlsx',
    status: '成功',
    enabled: false,
    createTime: '2026-05-20 14:00:00',
    updateTime: '2026-06-01 10:12:08',
    sizeLabel: '246 KB',
  },
];

export const knowledgeFileTypeIcon: Record<KnowledgeFileType, { icon: string; color: string }> = {
  docx: { icon: 'ri-file-word-2-fill', color: 'text-sky-600' },
  pdf: { icon: 'ri-file-pdf-2-fill', color: 'text-red-500' },
  xlsx: { icon: 'ri-file-excel-2-fill', color: 'text-emerald-600' },
  md: { icon: 'ri-markdown-fill', color: 'text-slate-600' },
  pptx: { icon: 'ri-file-ppt-2-fill', color: 'text-orange-500' },
};

export const knowledgeFileStatusStyle: Record<KnowledgeFileStatus, { cls: string; icon: string }> = {
  成功: { cls: 'text-emerald-600', icon: 'ri-checkbox-circle-fill' },
  处理中: { cls: 'text-amber-600', icon: 'ri-loader-4-line' },
  失败: { cls: 'text-red-500', icon: 'ri-close-circle-fill' },
};
