// 项目档案配置 - Mock数据

export interface FunctionNode {
  id: string;
  name: string;
  level: number; // 1=一级菜单, 2=二级菜单, 3=三级菜单, 4=业务阶段, 5=功能操作
  parentId: string | null;
  path: string;
  configStatus: 'configured' | 'unconfigured' | 'partial'; // 绿色/灰色/黄色
}

export interface AttachmentConfig {
  id: string;
  nodeId: string;
  docName: string;
  type: string; // 技改/维修/基建/多选 等
  /** 适用项目大类（年度计划等场景）；为空表示不限 */
  projectMajorTypes?: string[];
  versionManaged: boolean;
  required: boolean;
  fileFormats: string[];
  fileSize: number;
  fileSizeUnit: 'MB' | 'GB';
  fileCount: number;
  archived: boolean;
  remark: string;
  templateFile: string;
  enabled: boolean;
}

export interface ConditionConfig {
  id: string;
  nodeId: string;
  conditionName: string;
  contractTypes: string[];
  projectTypes: string[];
  status: 'enabled' | 'disabled';
  attachments: AttachmentConfig[];
}

// 功能节点树
export const functionNodeTree: FunctionNode[] = [
  // 一级菜单 - 项目合同管理
  { id: 'n-1', name: '项目合同管理', level: 1, parentId: null, path: '项目合同管理', configStatus: 'partial' },
  // 二级菜单
  { id: 'n-1-1', name: '工程需求管理', level: 2, parentId: 'n-1', path: '项目合同管理 > 工程需求管理', configStatus: 'configured' },
  { id: 'n-1-2', name: '合同资料管理', level: 2, parentId: 'n-1', path: '项目合同管理 > 合同资料管理', configStatus: 'unconfigured' },
  { id: 'n-1-3', name: '合同进度管理', level: 2, parentId: 'n-1', path: '项目合同管理 > 合同进度管理', configStatus: 'unconfigured' },
  { id: 'n-1-4', name: '合同执行管理', level: 2, parentId: 'n-1', path: '项目合同管理 > 合同执行管理', configStatus: 'partial' },
  { id: 'n-1-5', name: '合同业务执行管理', level: 2, parentId: 'n-1', path: '项目合同管理 > 合同业务执行管理', configStatus: 'partial' },
  { id: 'n-1-6', name: '工程款申报', level: 2, parentId: 'n-1', path: '项目合同管理 > 工程款申报', configStatus: 'configured' },
  { id: 'n-1-7', name: '合同款项报支', level: 2, parentId: 'n-1', path: '项目合同管理 > 合同款项报支', configStatus: 'unconfigured' },
  { id: 'n-1-8', name: '合同中标文号查询', level: 2, parentId: 'n-1', path: '项目合同管理 > 合同中标文号查询', configStatus: 'unconfigured' },
  // 三级菜单 - 合同业务执行管理下
  { id: 'n-1-5-1', name: '合同举牌验收', level: 3, parentId: 'n-1-5', path: '项目合同管理 > 合同业务执行管理 > 合同举牌验收', configStatus: 'configured' },
  { id: 'n-1-5-2', name: '合同施工分包审核', level: 3, parentId: 'n-1-5', path: '项目合同管理 > 合同业务执行管理 > 合同施工分包审核', configStatus: 'unconfigured' },
  { id: 'n-1-5-3', name: 'EPC合同设备验收', level: 3, parentId: 'n-1-5', path: '项目合同管理 > 合同业务执行管理 > EPC合同设备验收', configStatus: 'unconfigured' },
  { id: 'n-1-5-4', name: '合同超期申请', level: 3, parentId: 'n-1-5', path: '项目合同管理 > 合同业务执行管理 > 合同超期申请', configStatus: 'partial' },
  { id: 'n-1-5-5', name: '合同变更核价管理', level: 3, parentId: 'n-1-5', path: '项目合同管理 > 合同业务执行管理 > 合同变更核价管理', configStatus: 'unconfigured' },
  { id: 'n-1-5-6', name: '合同超期免考申请', level: 3, parentId: 'n-1-5', path: '项目合同管理 > 合同业务执行管理 > 合同超期免考申请', configStatus: 'configured' },
  { id: 'n-1-5-7', name: '合同质量异议', level: 3, parentId: 'n-1-5', path: '项目合同管理 > 合同业务执行管理 > 合同质量异议', configStatus: 'unconfigured' },
  // 业务阶段 - 合同举牌验收下
  { id: 'n-1-5-1-1', name: '合同举牌验收-工序预排', level: 4, parentId: 'n-1-5-1', path: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 工序预排', configStatus: 'unconfigured' },
  { id: 'n-1-5-1-2', name: '合同举牌验收-验收管理', level: 4, parentId: 'n-1-5-1', path: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理', configStatus: 'configured' },
  // 功能操作 - 验收管理下
  { id: 'n-1-5-1-2-1', name: '新增验收记录', level: 5, parentId: 'n-1-5-1-2', path: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录', configStatus: 'configured' },
  { id: 'n-1-5-1-2-2', name: '编辑验收记录', level: 5, parentId: 'n-1-5-1-2', path: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 编辑验收记录', configStatus: 'configured' },
  { id: 'n-1-5-1-2-3', name: '验收确认', level: 5, parentId: 'n-1-5-1-2', path: '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 验收确认', configStatus: 'partial' },
  // 业务阶段 - 合同超期申请下
  { id: 'n-1-5-4-1', name: '合同超期申请-项目组审核', level: 4, parentId: 'n-1-5-4', path: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核', configStatus: 'partial' },
  // 功能操作 - 项目组审核下
  { id: 'n-1-5-4-1-1', name: '新增超期申请', level: 5, parentId: 'n-1-5-4-1', path: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 新增超期申请', configStatus: 'configured' },
  { id: 'n-1-5-4-1-2', name: '修改超期申请', level: 5, parentId: 'n-1-5-4-1', path: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 修改超期申请', configStatus: 'unconfigured' },
  { id: 'n-1-5-4-1-3', name: '删除超期申请', level: 5, parentId: 'n-1-5-4-1', path: '项目合同管理 > 合同业务执行管理 > 合同超期申请 > 项目组审核 > 删除超期申请', configStatus: 'unconfigured' },
  // 三级菜单 - 工程款申报下
  { id: 'n-1-6-1', name: '工程款申报-项目部审核', level: 4, parentId: 'n-1-6', path: '项目合同管理 > 工程款申报 > 项目部审核', configStatus: 'partial' },
  { id: 'n-1-6-1-1', name: '新增申报', level: 5, parentId: 'n-1-6-1', path: '项目合同管理 > 工程款申报 > 项目部审核 > 新增申报', configStatus: 'configured' },
  { id: 'n-1-6-1-2', name: '修改申报', level: 5, parentId: 'n-1-6-1', path: '项目合同管理 > 工程款申报 > 项目部审核 > 修改申报', configStatus: 'configured' },
  // 二级菜单 - 合同执行管理下业务阶段
  { id: 'n-1-4-1', name: '合同执行-开工', level: 4, parentId: 'n-1-4', path: '项目合同管理 > 合同执行管理 > 开工', configStatus: 'partial' },
  { id: 'n-1-4-1-1', name: '开工令审批', level: 5, parentId: 'n-1-4-1', path: '项目合同管理 > 合同执行管理 > 开工 > 开工令审批', configStatus: 'configured' },
  { id: 'n-1-4-1-2', name: '开工令签发', level: 5, parentId: 'n-1-4-1', path: '项目合同管理 > 合同执行管理 > 开工 > 开工令签发', configStatus: 'unconfigured' },
  // 一级菜单 - 项目准备管理
  { id: 'n-2', name: '项目准备管理', level: 1, parentId: null, path: '项目准备管理', configStatus: 'partial' },
  { id: 'n-2-1', name: '项目成员管理', level: 2, parentId: 'n-2', path: '项目准备管理 > 项目成员管理', configStatus: 'configured' },
  { id: 'n-2-3', name: '概算管理', level: 2, parentId: 'n-2', path: '项目准备管理 > 概算管理', configStatus: 'unconfigured' },
  // 一级菜单 - 项目执行管理
  { id: 'n-3', name: '项目执行管理', level: 1, parentId: null, path: '项目执行管理', configStatus: 'partial' },
  { id: 'n-3-1', name: '质量安全管理', level: 2, parentId: 'n-3', path: '项目执行管理 > 质量安全管理', configStatus: 'configured' },
  { id: 'n-3-2', name: '危险作业管理', level: 2, parentId: 'n-3', path: '项目执行管理 > 危险作业管理', configStatus: 'unconfigured' },
  // 一级菜单 - 年度计划管理
  { id: 'n-plan', name: '年度计划管理', level: 1, parentId: null, path: '年度计划管理', configStatus: 'configured' },
  { id: 'n-plan-1', name: '年度计划申报', level: 2, parentId: 'n-plan', path: '年度计划管理 > 年度计划申报', configStatus: 'configured' },
  { id: 'n-plan-2', name: '会审意见签署', level: 2, parentId: 'n-plan', path: '年度计划管理 > 会审意见签署', configStatus: 'configured' },
  { id: 'n-init', name: '项目立项管理', level: 1, parentId: null, path: '项目立项管理', configStatus: 'configured' },
  { id: 'n-init-1', name: '项目立项申请', level: 2, parentId: 'n-init', path: '项目立项管理 > 项目立项申请', configStatus: 'configured' },
  { id: 'n-sporadic', name: '零星工程项目管理', level: 1, parentId: null, path: '零星工程项目管理', configStatus: 'configured' },
  { id: 'n-sporadic-1', name: '零星协议单申报', level: 2, parentId: 'n-sporadic', path: '零星工程项目管理 > 零星协议单申报', configStatus: 'configured' },
  { id: 'n-sporadic-2', name: '零星协议单审查', level: 2, parentId: 'n-sporadic', path: '零星工程项目管理 > 零星协议单审查', configStatus: 'configured' },
];

// 生成节点子节点映射
export function getChildNodes(parentId: string | null): FunctionNode[] {
  return functionNodeTree.filter((n) => n.parentId === parentId);
}

export function getNodeById(id: string): FunctionNode | undefined {
  return functionNodeTree.find((n) => n.id === id);
}

export function getNodePath(nodeId: string): string {
  const parts: string[] = [];
  let currentId: string | null = nodeId;
  while (currentId) {
    const node = getNodeById(currentId);
    if (node) {
      parts.unshift(node.name);
      currentId = node.parentId;
    } else {
      break;
    }
  }
  return parts.join(' > ');
}

// 附件配置数据 - 按节点ID存储
export const attachmentConfigs: Record<string, AttachmentConfig[]> = {
  // 新增验收记录 (n-1-5-1-2-1)
  'n-1-5-1-2-1': [
    { id: 'ac-1', nodeId: 'n-1-5-1-2-1', docName: '验收申请表', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '需经项目负责人签字确认后方可上传', templateFile: '验收申请表模板.docx', enabled: true },
    { id: 'ac-2', nodeId: 'n-1-5-1-2-1', docName: '施工质量检查记录', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)', '图片(jpg/png/bmp)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '', templateFile: '', enabled: true },
    { id: 'ac-3', nodeId: 'n-1-5-1-2-1', docName: '现场照片及影像资料', type: '多选', versionManaged: false, required: false, fileFormats: ['图片(jpg/png/bmp)', '视频(mp4/avi)', '压缩包(zip/rar/7z)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 20, archived: false, remark: '拍摄关键施工节点及隐蔽工程', templateFile: '', enabled: true },
    { id: 'ac-4', nodeId: 'n-1-5-1-2-1', docName: '材料合格证及检测报告', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 15, archived: true, remark: '包括钢材、水泥等主要材料的合格证', templateFile: '', enabled: true },
    { id: 'ac-5', nodeId: 'n-1-5-1-2-1', docName: '隐蔽工程验收记录', type: '技改', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '含地基验槽、钢筋隐蔽等', templateFile: '隐蔽工程验收记录模板.docx', enabled: false },
    { id: 'ac-6', nodeId: 'n-1-5-1-2-1', docName: '设备开箱检验记录', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 10, archived: false, remark: '', templateFile: '设备开箱检验记录表.xlsx', enabled: true },
  ],
  // 编辑验收记录 (n-1-5-1-2-2)
  'n-1-5-1-2-2': [
    { id: 'ac-7', nodeId: 'n-1-5-1-2-2', docName: '修改后验收记录', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '标注修改位置及修改原因', templateFile: '', enabled: true },
    { id: 'ac-8', nodeId: 'n-1-5-1-2-2', docName: '修改审批单', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '需经审批人签字', templateFile: '修改审批单模板.docx', enabled: true },
  ],
  // 新增超期申请 (n-1-5-4-1-1)
  'n-1-5-4-1-1': [
    { id: 'ac-9', nodeId: 'n-1-5-4-1-1', docName: '超期原因说明书', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '需详细说明超期原因及延期天数', templateFile: '超期原因说明书模板.docx', enabled: true },
    { id: 'ac-10', nodeId: 'n-1-5-4-1-1', docName: '施工进度对比表', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Excel(xls/xlsx)'], fileSize: 15, fileSizeUnit: 'MB', fileCount: 3, archived: false, remark: '对比计划进度与实际进度', templateFile: '施工进度对比表模板.xlsx', enabled: true },
    { id: 'ac-11', nodeId: 'n-1-5-4-1-1', docName: '监理单位意见书', type: '维修', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: false, remark: '', templateFile: '', enabled: true },
    { id: 'ac-12', nodeId: 'n-1-5-4-1-1', docName: '相关证明材料', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)', '压缩包(zip/rar/7z)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 10, archived: false, remark: '如天气影响证明、材料延迟到货通知等', templateFile: '', enabled: true },
  ],
  // 新增申报 (n-1-6-1-1)
  'n-1-6-1-1': [
    { id: 'ac-13', nodeId: 'n-1-6-1-1', docName: '工程款申报表', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '需加盖单位公章', templateFile: '工程款申报表模板.docx', enabled: true },
    { id: 'ac-14', nodeId: 'n-1-6-1-1', docName: '工程量清单', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Excel(xls/xlsx)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '含工程量计算明细', templateFile: '', enabled: true },
    { id: 'ac-15', nodeId: 'n-1-6-1-1', docName: '发票扫描件', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '', templateFile: '', enabled: true },
    { id: 'ac-16', nodeId: 'n-1-6-1-1', docName: '竣工验收报告', type: '技改', versionManaged: false, required: false, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '竣工阶段申报时需附', templateFile: '竣工验收报告模板.docx', enabled: true },
  ],
  // 修改申报 (n-1-6-1-2)
  'n-1-6-1-2': [
    { id: 'ac-17', nodeId: 'n-1-6-1-2', docName: '修改后申报表', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '标注修改内容', templateFile: '', enabled: true },
    { id: 'ac-18', nodeId: 'n-1-6-1-2', docName: '修改说明函', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: false, remark: '', templateFile: '修改说明函模板.docx', enabled: true },
  ],
  // 开工令审批 (n-1-4-1-1)
  'n-1-4-1-1': [
    { id: 'ac-19', nodeId: 'n-1-4-1-1', docName: '开工报告', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 1, archived: true, remark: '', templateFile: '开工报告模板.docx', enabled: true },
    { id: 'ac-20', nodeId: 'n-1-4-1-1', docName: '施工组织设计', type: '技改', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 1, archived: true, remark: '含施工方案、进度计划、安全措施', templateFile: '', enabled: true },
    { id: 'ac-21', nodeId: 'n-1-4-1-1', docName: '安全协议', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF'], fileSize: 15, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '双方签署的安全管理协议', templateFile: '安全协议模板.pdf', enabled: true },
    { id: 'ac-22', nodeId: 'n-1-4-1-1', docName: '资质证书', type: '基建', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '施工单位资质证书、安全生产许可证等', templateFile: '', enabled: true },
  ],
  // 验收确认 (n-1-5-1-2-3) - partial
  'n-1-5-1-2-3': [
    { id: 'ac-23', nodeId: 'n-1-5-1-2-3', docName: '验收确认单', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '各方签字确认', templateFile: '验收确认单模板.docx', enabled: true },
  ],
  // 新增成员 - 项目成员管理下
  'n-2-1': [
    { id: 'ac-24', nodeId: 'n-2-1', docName: '项目成员登记表', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '', templateFile: '项目成员登记表模板.docx', enabled: true },
    { id: 'ac-25', nodeId: 'n-2-1', docName: '人员资质证书', type: '基建', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 10, archived: false, remark: '建造师证书、安全员证书等', templateFile: '', enabled: true },
  ],
  // 年度计划申报（按项目大类区分配置项，与项目档案配置模块一致）
  'n-plan-1': [
    { id: 'ac-plan-1', nodeId: 'n-plan-1', docName: '项目建议书', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '含项目建设必要性、初步方案及投资匡算', templateFile: '项目建议书模板.docx', enabled: true },
    { id: 'ac-plan-2', nodeId: 'n-plan-1', docName: '可行性研究报告', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '须为正式版可研报告，含投资估算与效益分析', templateFile: '可行性研究报告模板.docx', enabled: true },
  ],
  // 会审意见签署
  'n-plan-2': [
    { id: 'ac-jos-1', nodeId: 'n-plan-2', docName: '论证文件', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: true, required: false, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '仅限 word、pdf、excel、jpg 等常规格式文件，大小不超过 100MB', templateFile: '论证文件示例模板.docx', enabled: true },
  ],
  // 项目立项申请（新建/技改）
  'n-init-1': [
    { id: 'ac-init-1', nodeId: 'n-init-1', docName: '建设工期附件', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: false, required: false, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '建设工期甘特图、节点计划等支撑材料', templateFile: '建设工期计划模板.xlsx', enabled: true },
    { id: 'ac-init-2', nodeId: 'n-init-1', docName: '论证文件', type: '多选', projectMajorTypes: ['新建', '技改', '营缮', '零固'], versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '立项论证相关正式文件，须加盖单位公章', templateFile: '论证文件示例模板.docx', enabled: true },
  ],
  // 零星协议单申报
  'n-sporadic-1': [
    { id: 'ac-sporadic-1', nodeId: 'n-sporadic-1', docName: '现场影像', type: '多选', versionManaged: false, required: true, fileFormats: ['图片(jpg/png/bmp)', '视频(mp4/avi)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '上传现场隐患点、施工过程及完工对比照片/视频等影像资料', templateFile: '现场影像拍摄要求说明.docx', enabled: true },
  ],
  // 零星协议单审查 · 方案上传
  'n-sporadic-2': [
    { id: 'ac-sporadic-plan-1', nodeId: 'n-sporadic-2', docName: '方案上传', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '上传零星工程施工方案、技术交底及安全措施等支撑材料', templateFile: '零星工程施工方案模板.docx', enabled: true },
  ],
};

// 条件配置数据
export const conditionConfigs: Record<string, ConditionConfig[]> = {
  'n-1-5-1-2-1': [
    {
      id: 'cc-1', nodeId: 'n-1-5-1-2-1',
      conditionName: '总承包合同-技改项目验收要求',
      contractTypes: ['总承包合同', '施工分包合同'],
      projectTypes: ['技改项目'],
      status: 'enabled',
      attachments: [
        { id: 'cca-1', nodeId: 'n-1-5-1-2-1', docName: '总承包专项验收报告', type: '技改', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '总承包项目专用', templateFile: '总承包验收报告模板.docx', enabled: true },
        { id: 'cca-2', nodeId: 'n-1-5-1-2-1', docName: '分包工程质量评定表', type: '技改', versionManaged: false, required: true, fileFormats: ['PDF'], fileSize: 15, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '', templateFile: '', enabled: true },
      ],
    },
    {
      id: 'cc-2', nodeId: 'n-1-5-1-2-1',
      conditionName: '设备采购合同-设备验收要求',
      contractTypes: ['设备采购合同'],
      projectTypes: ['技改项目', '基建项目'],
      status: 'enabled',
      attachments: [
        { id: 'cca-3', nodeId: 'n-1-5-1-2-1', docName: '设备到货验收单', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '', templateFile: '设备到货验收单模板.docx', enabled: true },
        { id: 'cca-4', nodeId: 'n-1-5-1-2-1', docName: '设备调试报告', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '含空载及负载调试数据', templateFile: '', enabled: true },
        { id: 'cca-5', nodeId: 'n-1-5-1-2-1', docName: '随机技术文件', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '压缩包(zip/rar/7z)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '设备说明书、图纸、合格证等', templateFile: '', enabled: true },
      ],
    },
  ],
  'n-1-5-4-1-1': [
    {
      id: 'cc-3', nodeId: 'n-1-5-4-1-1',
      conditionName: '施工分包-超期申请附件要求',
      contractTypes: ['施工分包合同'],
      projectTypes: ['技改项目', '维修项目'],
      status: 'enabled',
      attachments: [
        { id: 'cca-6', nodeId: 'n-1-5-4-1-1', docName: '分包单位延期申请函', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '分包单位盖章确认', templateFile: '延期申请函模板.docx', enabled: true },
        { id: 'cca-7', nodeId: 'n-1-5-4-1-1', docName: '总包单位审核意见', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 10, fileSizeUnit: 'MB', fileCount: 2, archived: true, remark: '', templateFile: '', enabled: true },
      ],
    },
  ],
};

// 获取节点附件配置
export function getAttachmentConfigs(nodeId: string): AttachmentConfig[] {
  return attachmentConfigs[nodeId] || [];
}

/** 年度计划申报节点 ID（与项目档案配置树一致） */
export const PLAN_DECLARATION_NODE_ID = 'n-plan-1';

/** 会审意见签署节点 ID */
export const JOINT_OPINION_SIGN_NODE_ID = 'n-plan-2';

/** 项目立项申请节点 ID */
export const INITIATION_DECLARATION_NODE_ID = 'n-init-1';

/** 零星协议单申报节点 ID */
export const SPORADIC_AGREEMENT_NODE_ID = 'n-sporadic-1';

/** 零星协议单审查 · 方案上传节点 ID */
export const SPORADIC_PLAN_UPLOAD_NODE_ID = 'n-sporadic-2';

/** 按项目大类获取年度计划申报节点的附件配置（演示数据，对应档案配置模块） */
export function getPlanDeclarationAttachmentConfigs(majorType: string): AttachmentConfig[] {
  return getAttachmentConfigs(PLAN_DECLARATION_NODE_ID).filter((c) => {
    if (!c.enabled) return false;
    if (!c.projectMajorTypes || c.projectMajorTypes.length === 0) return true;
    return c.projectMajorTypes.includes(majorType);
  });
}

/** 会审意见签署附件配置 */
export function getJointOpinionSignAttachmentConfigs(majorType?: string): AttachmentConfig[] {
  return getAttachmentConfigs(JOINT_OPINION_SIGN_NODE_ID).filter((c) => {
    if (!c.enabled) return false;
    if (!c.projectMajorTypes || c.projectMajorTypes.length === 0) return true;
    if (!majorType) return true;
    return c.projectMajorTypes.includes(majorType);
  });
}

/** 项目立项申请附件配置：新建/技改/营缮/零固均为建设工期附件+论证文件 */
export function getInitiationDeclarationAttachmentConfigs(majorType: string): AttachmentConfig[] {
  if (majorType === '新建' || majorType === '技改' || majorType === '营缮' || majorType === '零固') {
    return getAttachmentConfigs(INITIATION_DECLARATION_NODE_ID).filter((c) => {
      if (!c.enabled) return false;
      if (!c.projectMajorTypes || c.projectMajorTypes.length === 0) return true;
      return c.projectMajorTypes.includes(majorType) || c.projectMajorTypes.includes('新建');
    });
  }
  return getPlanDeclarationAttachmentConfigs(majorType);
}

/** 零星协议单申报附件配置：现场影像 */
export function getSporadicAgreementAttachmentConfigs(): AttachmentConfig[] {
  return getAttachmentConfigs(SPORADIC_AGREEMENT_NODE_ID).filter((c) => c.enabled);
}

/** 零星协议单审查 · 方案上传附件配置：方案上传 */
export function getSporadicPlanUploadAttachmentConfigs(): AttachmentConfig[] {
  return getAttachmentConfigs(SPORADIC_PLAN_UPLOAD_NODE_ID).filter((c) => c.enabled);
}

// 获取节点条件配置
export function getConditionConfigs(nodeId: string): ConditionConfig[] {
  return conditionConfigs[nodeId] || [];
}

// 合同类型字典
export const contractTypeOptions = [
  '总承包合同', '施工分包合同', '设备采购合同', '技术服务合同',
  '设计合同', '监理合同', '咨询服务合同', '物资采购合同',
  '租赁合同', '其他合同',
];

// 项目类型字典
export const projectTypeOptions = [
  '技改项目', '维修项目', '基建项目', '环保项目',
  '安全项目', '信息化项目', '科研项目',
];

// 文件格式选项
export const fileFormatOptions = [
  'PDF', 'Word(doc/docx)', 'Excel(xls/xlsx)', '图片(jpg/png/bmp)',
  'CAD(dwg/dxf)', '压缩包(zip/rar/7z)', '视频(mp4/avi)', '其他',
];

// 类型字典
export const docTypeOptions = ['技改', '维修', '基建', '多选'];

// 费用类别
export const costTypeOptions = ['设计', '建安', '监理', '其他', '设备', '总包', '设备维修'];

// 审批流程模板
export const approvalTemplates = [
  { id: 'at-1', name: '标准审批流程（3节点）', nodes: ['项目部负责人', '主管部门审批', '公司领导审批'] },
  { id: 'at-2', name: '简易审批流程（2节点）', nodes: ['项目部负责人', '主管部门审批'] },
  { id: 'at-3', name: '多部门会签流程', nodes: ['项目部负责人', '技术部门会签', '安全部门会签', '主管领导审批'] },
];