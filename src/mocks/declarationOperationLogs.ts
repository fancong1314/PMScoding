/** 年度计划申报操作日志演示数据 */
export interface DeclOperationLog {
  id: string;
  planId: string;
  operateTime: string;
  operator: string;
  operation: string;
  remark: string;
  /** 审批单号，有值则可点击查看流程 */
  approvalNo?: string;
}

export interface DeclApprovalFlowNode {
  name: string;
  role: string;
  status: 'passed' | 'current' | 'pending' | 'rejected' | 'returned';
  time?: string;
  opinion?: string;
}

export const declApprovalFlows: Record<string, { title: string; nodes: DeclApprovalFlowNode[] }> = {
  /* —— 新建前三 —— */
  'SP-XJ-2026-002': {
    title: '厂内物流调度平台新建 · 部门内审',
    nodes: [
      { name: '周涛', role: '申报人', status: 'passed', time: '2026-02-26 09:10', opinion: '提交部门内审' },
      { name: '赵明辉', role: '物流事业部负责人', status: 'passed', time: '2026-02-26 15:20', opinion: '同意，请会审' },
      { name: '王部长', role: '专业会审', status: 'returned', time: '2026-02-27 10:05', opinion: '请补充与现有MES接口方案后重新申报' },
    ],
  },
  'SP-XJ-2026-001': {
    title: '原料场智能堆取料系统新建 · 部门内审',
    nodes: [
      { name: '李明', role: '申报人', status: 'passed', time: '2026-02-25 10:30', opinion: '发起部门内审' },
      { name: '张建国', role: '原料事业部负责人', status: 'current', time: '' },
      { name: '孙磊', role: '战略运营部', status: 'pending' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-XJ-2026-017': {
    title: '建材厂危化品库房新建 · 草稿阶段',
    nodes: [
      { name: '钱建国', role: '申报人', status: 'passed', time: '2026-02-10 11:00', opinion: '保存并预审发起' },
      { name: '钱建国', role: '申报人', status: 'returned', time: '2026-02-10 16:40', opinion: '自行撤回，继续完善方案' },
      { name: '王志强', role: '建材事业部负责人', status: 'pending' },
    ],
  },
  /* —— 技改前三 —— */
  'SP-TG-2026-003': {
    title: '空压站变频节能技改 · 预审',
    nodes: [
      { name: '孙丽', role: '申报人', status: 'passed', time: '2026-02-24 09:20', opinion: '创建并提交预审' },
      { name: '吴刚', role: '动力事业部负责人', status: 'pending' },
      { name: '谢海涛', role: '财务部会签', status: 'pending' },
    ],
  },
  'SP-TG-2026-001': {
    title: '高炉专家系统及热风炉智能燃烧技改 · 部门内审',
    nodes: [
      { name: '张伟', role: '申报人', status: 'passed', time: '2026-02-23 14:05', opinion: '发起部门内审' },
      { name: '张建国', role: '炼铁事业部负责人', status: 'current', time: '' },
      { name: '王部长', role: '设备部会签', status: 'pending' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-TG-2026-004': {
    title: '原料场堆取料机无人化改造 · 会审中',
    nodes: [
      { name: '赵芳', role: '申报人', status: 'passed', time: '2026-01-08 09:40', opinion: '提交部门内审' },
      { name: '赵明辉', role: '原料事业部负责人', status: 'passed', time: '2026-01-10 11:15', opinion: '同意进入会审' },
      { name: '王部长', role: '设备部', status: 'passed', time: '2026-01-12 16:00', opinion: '技术方案可行' },
      { name: '孙磊', role: '战略运营部（会审）', status: 'current', time: '' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  /* —— 大修前三 —— */
  'SP-OH-2026-007': {
    title: '原料输送皮带机结构大修 · 已驳回',
    nodes: [
      { name: '周涛', role: '申报人', status: 'passed', time: '2026-02-14 10:00', opinion: '发起部门内审' },
      { name: '赵明辉', role: '物流事业部负责人', status: 'passed', time: '2026-02-15 09:30', opinion: '同意' },
      { name: '郑浩', role: '专业审核', status: 'rejected', time: '2026-02-16 14:20', opinion: '方案深度不足，请补充载荷核算（作废）' },
    ],
  },
  'SP-OH-2026-006': {
    title: '烧结机台车及密封系统大修 · 会审中',
    nodes: [
      { name: '周涛', role: '申报人', status: 'passed', time: '2026-02-11 15:40', opinion: '提交部门内审' },
      { name: '赵明辉', role: '原料事业部负责人', status: 'passed', time: '2026-02-12 09:18', opinion: '同意呈核会审' },
      { name: '王部长', role: '设备部会签', status: 'passed', time: '2026-02-12 17:05', opinion: '同意' },
      { name: '孙磊', role: '战略运营部（会审）', status: 'current', time: '' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  'SP-OH-2026-005': {
    title: '35kV主变压器及附属系统大修 · 待会审',
    nodes: [
      { name: '孙丽', role: '申报人', status: 'passed', time: '2026-02-08 13:20', opinion: '发起部门内审' },
      { name: '吴刚', role: '动力事业部负责人', status: 'passed', time: '2026-02-09 10:05', opinion: '部门内审通过，待会审排期' },
      { name: '会审组', role: '公司会审', status: 'pending' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  /* —— 零固前三 —— */
  'SP-MN-2026-004': {
    title: '平整机工作辊轴承座更新 · 已退回',
    nodes: [
      { name: '吴晓燕', role: '申报人', status: 'passed', time: '2026-02-21 09:00', opinion: '提交部门内审' },
      { name: '周鑫', role: '冷轧事业部负责人', status: 'passed', time: '2026-02-21 16:30', opinion: '同意' },
      { name: '王部长', role: '设备部', status: 'returned', time: '2026-02-22 11:10', opinion: '请补充在用数量与固定资产对应关系' },
    ],
  },
  'SP-MN-2026-003': {
    title: '胶带机减速机零星更换 · 已驳回',
    nodes: [
      { name: '李明', role: '申报人', status: 'passed', time: '2026-02-18 10:15', opinion: '发起部门内审' },
      { name: '赵明辉', role: '原料事业部负责人', status: 'passed', time: '2026-02-19 09:40', opinion: '同意' },
      { name: '谢海涛', role: '财务审核', status: 'rejected', time: '2026-02-20 15:00', opinion: '预算依据不充分，作废' },
    ],
  },
  'SP-MN-2026-002': {
    title: '配电室低压开关柜抽屉单元更新 · 会审中',
    nodes: [
      { name: '孙丽', role: '申报人', status: 'passed', time: '2026-02-15 11:20', opinion: '提交部门内审' },
      { name: '吴刚', role: '动力事业部负责人', status: 'passed', time: '2026-02-16 09:05', opinion: '同意进入会审' },
      { name: '会审组', role: '公司会审', status: 'current', time: '' },
      { name: '李副总', role: '分管领导', status: 'pending' },
    ],
  },
  /* —— 历史兼容单号 —— */
  'SP-2026-decl-001': {
    title: '部门内审流程',
    nodes: [
      { name: '张伟', role: '申报人', status: 'passed', time: '2026-03-01 09:12', opinion: '提交部门内审' },
      { name: '李副总', role: '部门领导', status: 'current', time: '' },
      { name: '王部长', role: '专业审核', status: 'pending' },
    ],
  },
  'SP-2026-decl-002': {
    title: '领导审批流程',
    nodes: [
      { name: '赵芳', role: '申报人', status: 'passed', time: '2026-02-18 10:20', opinion: '呈核领导审批' },
      { name: '陈主任', role: '部门领导', status: 'passed', time: '2026-02-18 16:05', opinion: '同意' },
      { name: '孙总', role: '公司领导', status: 'passed', time: '2026-02-19 11:30', opinion: '同意立项' },
    ],
  },
  'SP-2026-decl-003': {
    title: '部门内审流程',
    nodes: [
      { name: '刘洋', role: '申报人', status: 'passed', time: '2026-01-20 14:08', opinion: '发起部门内审' },
      { name: '吴刚', role: '部门领导', status: 'passed', time: '2026-01-21 09:40', opinion: '同意' },
      { name: '郑浩', role: '专业审核', status: 'rejected', time: '2026-01-22 15:12', opinion: '资料不全，请补充' },
    ],
  },
};

/**
 * 各项目大类按列表默认排序（createdAt 降序）的前 3 条均配置操作历史；
 * 含至少一条可点击审批单号，对应上方可视化流程。
 */
export const declOperationLogs: DeclOperationLog[] = [
  /* ========== 新建 · 前三：xj2 / xj1 / 17 ========== */
  { id: 'dl-xj2-1', planId: 'xj2', operateTime: '2026-02-26 08:50:00', operator: '周涛', operation: '新增', remark: '创建厂内物流调度平台新建草稿', approvalNo: '' },
  { id: 'dl-xj2-2', planId: 'xj2', operateTime: '2026-02-26 09:10:12', operator: '周涛', operation: '提交', remark: '发起部门内审', approvalNo: 'SP-XJ-2026-002' },
  { id: 'dl-xj2-3', planId: 'xj2', operateTime: '2026-02-27 10:08:33', operator: '王部长', operation: '退回修改', remark: '请补充与现有MES接口方案', approvalNo: 'SP-XJ-2026-002' },

  { id: 'dl-xj1-1', planId: 'xj1', operateTime: '2026-02-25 09:15:00', operator: '李明', operation: '新增', remark: '创建原料场智能堆取料系统新建', approvalNo: '' },
  { id: 'dl-xj1-2', planId: 'xj1', operateTime: '2026-02-25 10:05:22', operator: '李明', operation: '修改', remark: '调整投资总估算与工期', approvalNo: '' },
  { id: 'dl-xj1-3', planId: 'xj1', operateTime: '2026-02-25 10:30:45', operator: '李明', operation: '提交', remark: '发起部门内审，进入部门审批', approvalNo: 'SP-XJ-2026-001' },

  { id: 'dl-17-1', planId: '17', operateTime: '2026-02-10 09:40:00', operator: '钱建国', operation: '新增', remark: '创建危化品库房新建草稿', approvalNo: '' },
  { id: 'dl-17-2', planId: '17', operateTime: '2026-02-10 11:00:18', operator: '钱建国', operation: '提交', remark: '预审发起后自行撤回完善', approvalNo: 'SP-XJ-2026-017' },
  { id: 'dl-17-3', planId: '17', operateTime: '2026-02-10 16:40:00', operator: '钱建国', operation: '撤回', remark: '撤回至草稿继续完善方案', approvalNo: 'SP-XJ-2026-017' },

  /* ========== 技改 · 前三：tg3 / tg1 / 4 ========== */
  { id: 'dl-tg3-1', planId: 'tg3', operateTime: '2026-02-24 08:30:00', operator: '孙丽', operation: '新增', remark: '创建空压站变频节能技改草稿', approvalNo: '' },
  { id: 'dl-tg3-2', planId: 'tg3', operateTime: '2026-02-24 09:20:11', operator: '孙丽', operation: '提交', remark: '提交预审（待完善后正式推进）', approvalNo: 'SP-TG-2026-003' },
  { id: 'dl-tg3-3', planId: 'tg3', operateTime: '2026-02-24 14:00:00', operator: '孙丽', operation: '保存草稿', remark: '撤回正式提交，保留预审记录', approvalNo: 'SP-TG-2026-003' },

  { id: 'dl-tg1-1', planId: 'tg1', operateTime: '2026-02-23 11:20:00', operator: '张伟', operation: '新增', remark: '创建高炉专家系统技改申报', approvalNo: '' },
  { id: 'dl-tg1-2', planId: 'tg1', operateTime: '2026-02-23 13:45:00', operator: '张伟', operation: '修改', remark: '补充智能燃烧试点范围说明', approvalNo: '' },
  { id: 'dl-tg1-3', planId: 'tg1', operateTime: '2026-02-23 14:05:30', operator: '张伟', operation: '提交', remark: '发起部门内审', approvalNo: 'SP-TG-2026-001' },

  { id: 'dl-4-1', planId: '4', operateTime: '2026-01-05 10:00:00', operator: '赵芳', operation: '新增', remark: '创建原料场无人化改造技改', approvalNo: '' },
  { id: 'dl-4-2', planId: '4', operateTime: '2026-01-08 09:40:00', operator: '赵芳', operation: '提交', remark: '发起部门内审', approvalNo: 'SP-TG-2026-004' },
  { id: 'dl-4-3', planId: '4', operateTime: '2026-01-10 11:20:00', operator: '赵明辉', operation: '部门内审通过', remark: '同意进入会审', approvalNo: 'SP-TG-2026-004' },
  { id: 'dl-4-4', planId: '4', operateTime: '2026-01-12 16:10:00', operator: '王部长', operation: '会签通过', remark: '技术方案可行，进入会审环节', approvalNo: 'SP-TG-2026-004' },

  /* ========== 大修 · 前三：oh7 / oh6 / oh5 ========== */
  { id: 'dl-oh7-1', planId: 'oh7', operateTime: '2026-02-14 09:20:00', operator: '周涛', operation: '新增', remark: '创建原料输送皮带机结构大修', approvalNo: '' },
  { id: 'dl-oh7-2', planId: 'oh7', operateTime: '2026-02-14 10:00:00', operator: '周涛', operation: '提交', remark: '发起部门内审', approvalNo: 'SP-OH-2026-007' },
  { id: 'dl-oh7-3', planId: 'oh7', operateTime: '2026-02-16 14:22:00', operator: '郑浩', operation: '驳回（作废）', remark: '方案深度不足，请补充载荷核算', approvalNo: 'SP-OH-2026-007' },

  { id: 'dl-oh6-1', planId: 'oh6', operateTime: '2026-02-11 15:40:00', operator: '周涛', operation: '新增', remark: '创建烧结机台车及密封系统大修', approvalNo: '' },
  { id: 'dl-oh6-2', planId: 'oh6', operateTime: '2026-02-12 09:18:00', operator: '周涛', operation: '提交', remark: '发起部门审批', approvalNo: 'SP-OH-2026-006' },
  { id: 'dl-oh6-3', planId: 'oh6', operateTime: '2026-02-12 17:10:00', operator: '王部长', operation: '会签通过', remark: '同意进入会审', approvalNo: 'SP-OH-2026-006' },
  { id: 'dl-oh6-4', planId: 'oh6', operateTime: '2026-02-13 16:00:00', operator: '周涛', operation: '呈核会审', remark: '呈核至战略运营部会审', approvalNo: 'SP-OH-2026-006' },

  { id: 'dl-oh5-1', planId: 'oh5', operateTime: '2026-02-08 13:20:00', operator: '孙丽', operation: '新增', remark: '创建35kV主变压器大修申报', approvalNo: '' },
  { id: 'dl-oh5-2', planId: 'oh5', operateTime: '2026-02-09 10:05:00', operator: '孙丽', operation: '提交', remark: '发起部门内审', approvalNo: 'SP-OH-2026-005' },
  { id: 'dl-oh5-3', planId: 'oh5', operateTime: '2026-02-09 16:40:00', operator: '吴刚', operation: '部门内审通过', remark: '通过，待会审排期', approvalNo: 'SP-OH-2026-005' },

  /* ========== 零固 · 前三：mn4 / mn3 / mn2 ========== */
  { id: 'dl-mn4-1', planId: 'mn4', operateTime: '2026-02-21 08:40:00', operator: '吴晓燕', operation: '新增', remark: '创建平整机工作辊轴承座更新', approvalNo: '' },
  { id: 'dl-mn4-2', planId: 'mn4', operateTime: '2026-02-21 09:00:00', operator: '吴晓燕', operation: '提交', remark: '发起部门内审', approvalNo: 'SP-MN-2026-004' },
  { id: 'dl-mn4-3', planId: 'mn4', operateTime: '2026-02-22 11:12:00', operator: '王部长', operation: '退回修改', remark: '请补充在用数量与固定资产对应关系', approvalNo: 'SP-MN-2026-004' },

  { id: 'dl-mn3-1', planId: 'mn3', operateTime: '2026-02-18 09:50:00', operator: '李明', operation: '新增', remark: '创建胶带机减速机零星更换', approvalNo: '' },
  { id: 'dl-mn3-2', planId: 'mn3', operateTime: '2026-02-18 10:15:00', operator: '李明', operation: '提交', remark: '发起部门内审', approvalNo: 'SP-MN-2026-003' },
  { id: 'dl-mn3-3', planId: 'mn3', operateTime: '2026-02-20 15:05:00', operator: '谢海涛', operation: '驳回（作废）', remark: '预算依据不充分，作废', approvalNo: 'SP-MN-2026-003' },

  { id: 'dl-mn2-1', planId: 'mn2', operateTime: '2026-02-15 10:40:00', operator: '孙丽', operation: '新增', remark: '创建配电室低压开关柜抽屉单元更新', approvalNo: '' },
  { id: 'dl-mn2-2', planId: 'mn2', operateTime: '2026-02-15 11:20:00', operator: '孙丽', operation: '提交', remark: '发起部门内审', approvalNo: 'SP-MN-2026-002' },
  { id: 'dl-mn2-3', planId: 'mn2', operateTime: '2026-02-16 09:10:00', operator: '吴刚', operation: '部门内审通过', remark: '同意进入会审', approvalNo: 'SP-MN-2026-002' },
  { id: 'dl-mn2-4', planId: 'mn2', operateTime: '2026-02-16 14:30:00', operator: '孙丽', operation: '呈核会审', remark: '呈核公司会审组', approvalNo: 'SP-MN-2026-002' },

  /* ========== 其他历史演示（兼容原有数据） ========== */
  { id: 'dl1', planId: '1', operateTime: '2025-12-15 10:22:11', operator: '张伟', operation: '新增', remark: '创建大修年度计划草稿', approvalNo: '' },
  { id: 'dl2', planId: '1', operateTime: '2026-01-08 11:05:33', operator: '张伟', operation: '修改', remark: '调整投资总估算及设备信息', approvalNo: '' },
  { id: 'dl3', planId: '1', operateTime: '2026-01-10 09:18:02', operator: '张伟', operation: '提交', remark: '发起部门审批', approvalNo: 'SP-2026-decl-001' },
  { id: 'dl4', planId: '2', operateTime: '2025-11-20 08:40:00', operator: '李明', operation: '新增', remark: '创建技改申报', approvalNo: '' },
  { id: 'dl5', planId: '2', operateTime: '2025-12-01 16:22:45', operator: '李明', operation: '提交', remark: '发起部门审批', approvalNo: 'SP-2026-decl-003' },
  { id: 'dl6', planId: '2', operateTime: '2025-12-05 10:11:09', operator: '李明', operation: '呈核领导审批', remark: '部门内审通过后呈核', approvalNo: 'SP-2026-decl-002' },
  { id: 'dl7', planId: '5', operateTime: '2025-12-01 09:00:00', operator: '刘洋', operation: '新增', remark: '新建类项目申报', approvalNo: '' },
  { id: 'dl8', planId: '5', operateTime: '2025-12-10 14:30:00', operator: '刘洋', operation: '提交', remark: '发起部门审批', approvalNo: 'SP-2026-decl-001' },
];

export function getDeclOperationLogs(planId: string): DeclOperationLog[] {
  return declOperationLogs
    .filter((l) => l.planId === planId)
    .sort((a, b) => (a.operateTime < b.operateTime ? 1 : -1));
}
