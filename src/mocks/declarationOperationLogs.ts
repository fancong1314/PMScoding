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
  /* —— 计划资料管理 · 归档计划审批流程 —— */
  'SP-AR-2025-TG-001': {
    title: '连铸机液面控制升级 · 领导审批',
    nodes: [
      { name: '陈刚', role: '申报人', status: 'passed', time: '2025-03-10 09:20', opinion: '呈核领导审批' },
      { name: '张主任', role: '项目部', status: 'passed', time: '2025-03-15 14:00', opinion: '同意通过' },
      { name: '李副总', role: '公司领导', status: 'passed', time: '2025-03-18 10:30', opinion: '同意立项归档' },
    ],
  },
  'SP-AR-2025-DX-008': {
    title: '热轧加热炉蓄热式烧嘴大修 · 领导审批',
    nodes: [
      { name: '王强', role: '申报人', status: 'passed', time: '2025-03-28 11:00', opinion: '呈核' },
      { name: '张主任', role: '项目部', status: 'passed', time: '2025-04-01 09:40', opinion: '同意' },
      { name: '李副总', role: '公司领导', status: 'passed', time: '2025-04-02 15:20', opinion: '同意' },
    ],
  },
  'SP-AR-DEF-017': {
    title: '皮带通廊除尘风机变频改造 · 暂缓审批',
    nodes: [
      { name: '赵芳', role: '申请人', status: 'passed', time: '2026-03-01 10:00', opinion: '申请暂缓执行' },
      { name: '张主任', role: '项目部', status: 'passed', time: '2026-03-02 11:20', opinion: '同意暂缓，待窗口期再启' },
      { name: '李副总', role: '公司领导', status: 'passed', time: '2026-03-03 09:15', opinion: '同意暂缓' },
    ],
  },
  'SP-AR-EXT-016': {
    title: '原料场无人化改造 · 延期审批',
    nodes: [
      { name: '赵芳', role: '申请人', status: 'passed', time: '2026-08-10 14:30', opinion: '申请延期完工' },
      { name: '张主任', role: '项目部', status: 'passed', time: '2026-08-12 10:00', opinion: '同意延期至2027-06' },
      { name: '李副总', role: '公司领导', status: 'passed', time: '2026-08-13 16:40', opinion: '同意延期' },
    ],
  },
  'SP-AR-STOP-022': {
    title: '卸船机关键部件更新 · 终止审批',
    nodes: [
      { name: '周涛', role: '申请人', status: 'passed', time: '2024-11-20 09:00', opinion: '申请终止并归档' },
      { name: '张主任', role: '项目部', status: 'passed', time: '2024-11-22 14:10', opinion: '实物已完工，同意终止流程' },
      { name: '李副总', role: '公司领导', status: 'passed', time: '2024-11-25 11:00', opinion: '同意终止归档' },
    ],
  },
  'SP-AR-RET-012': {
    title: '精轧机液压伺服阀组更新 · 退回修改',
    nodes: [
      { name: '王强', role: '申报人', status: 'passed', time: '2026-05-10 09:30', opinion: '呈核项目部' },
      { name: '张主任', role: '项目部', status: 'returned', time: '2026-05-12 15:40', opinion: '请补充备件国产化论证后重报' },
    ],
  },
  'SP-AR-RJ-006': {
    title: '冷轧酸洗废水零排放技改 · 驳回后修订',
    nodes: [
      { name: '吴晓燕', role: '申报人', status: 'passed', time: '2026-01-20 10:00', opinion: '呈核领导' },
      { name: '张主任', role: '项目部', status: 'passed', time: '2026-01-22 11:00', opinion: '转领导审核' },
      { name: '李副总', role: '公司领导', status: 'rejected', time: '2026-01-25 16:20', opinion: '效益测算口径需按统一模板重算' },
    ],
  },
  'SP-AR-PASS-010': {
    title: '3号高炉炉体大修 · 领导通过',
    nodes: [
      { name: '张伟', role: '申报人', status: 'passed', time: '2026-04-15 09:00', opinion: '呈核领导审批' },
      { name: '张主任', role: '项目部', status: 'passed', time: '2026-04-18 10:30', opinion: '同意通过' },
      { name: '李副总', role: '公司领导', status: 'passed', time: '2026-04-20 14:00', opinion: '同意' },
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

  /* ========== 计划资料管理 · 已通过清单全生命周期（按 linkedPlanId） ========== */
  /* pa-01 → 3 */
  { id: 'ar-3-1', planId: '3', operateTime: '2025-02-20 09:00:00', operator: '陈刚', operation: '新增', remark: '创建连铸机液面控制系统升级申报', approvalNo: '' },
  { id: 'ar-3-2', planId: '3', operateTime: '2025-02-28 14:20:00', operator: '陈刚', operation: '修改', remark: '补充智能化改造范围说明', approvalNo: '' },
  { id: 'ar-3-3', planId: '3', operateTime: '2025-03-05 10:15:00', operator: '陈刚', operation: '呈核', remark: '呈核至项目部审查', approvalNo: 'SP-AR-2025-TG-001' },
  { id: 'ar-3-4', planId: '3', operateTime: '2025-03-18 10:35:00', operator: '李副总', operation: '通过', remark: '领导审批通过，进入资料归档', approvalNo: 'SP-AR-2025-TG-001' },
  { id: 'ar-3-5', planId: '3', operateTime: '2025-06-05 09:00:00', operator: '陈刚', operation: '启动', remark: '按计划窗口启动实施', approvalNo: '' },

  /* pa-02 → oh3 */
  { id: 'ar-oh3-1', planId: 'oh3', operateTime: '2025-03-10 08:40:00', operator: '王强', operation: '新增', remark: '创建热轧加热炉蓄热式烧嘴大修', approvalNo: '' },
  { id: 'ar-oh3-2', planId: 'oh3', operateTime: '2025-03-20 11:00:00', operator: '王强', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-AR-2025-DX-008' },
  { id: 'ar-oh3-3', planId: 'oh3', operateTime: '2025-04-02 15:25:00', operator: '李副总', operation: '通过', remark: '同意立项归档', approvalNo: 'SP-AR-2025-DX-008' },
  { id: 'ar-oh3-4', planId: 'oh3', operateTime: '2025-08-05 09:30:00', operator: '王强', operation: '启动', remark: '结合年修窗口启动大修', approvalNo: '' },

  /* pa-03 → 5 已有部分，补通过/启动 */
  { id: 'ar-5-1', planId: '5', operateTime: '2025-02-15 10:00:00', operator: '刘洋', operation: '修改', remark: '调整管廊分段实施范围', approvalNo: '' },
  { id: 'ar-5-2', planId: '5', operateTime: '2025-02-18 16:00:00', operator: '刘洋', operation: '呈核', remark: '呈核项目部审查', approvalNo: 'SP-2026-decl-001' },
  { id: 'ar-5-3', planId: '5', operateTime: '2025-02-20 11:00:00', operator: '李副总', operation: '通过', remark: '领导通过，资料入库', approvalNo: 'SP-2026-decl-001' },
  { id: 'ar-5-4', planId: '5', operateTime: '2025-04-05 08:50:00', operator: '刘洋', operation: '启动', remark: '土建标段开工', approvalNo: '' },

  /* pa-04 → 6 */
  { id: 'ar-6-1', planId: '6', operateTime: '2025-04-01 09:20:00', operator: '孙丽', operation: '新增', remark: '创建智能配电房综合监控平台建设', approvalNo: '' },
  { id: 'ar-6-2', planId: '6', operateTime: '2025-04-20 14:10:00', operator: '孙丽', operation: '修改', remark: '补充信息化接口清单', approvalNo: '' },
  { id: 'ar-6-3', planId: '6', operateTime: '2025-05-01 10:00:00', operator: '孙丽', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-6-4', planId: '6', operateTime: '2025-05-08 15:00:00', operator: '孙总', operation: '通过', remark: '同意立项', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-6-5', planId: '6', operateTime: '2025-05-12 09:00:00', operator: '孙丽', operation: '启动', remark: '平台建设启动', approvalNo: '' },

  /* pa-05 → mn3：已有驳回记录，补修订后通过 */
  { id: 'ar-mn3-4', planId: 'mn3', operateTime: '2026-01-05 09:00:00', operator: '孙丽', operation: '修改', remark: '按财务意见补充预算测算依据后重报', approvalNo: '' },
  { id: 'ar-mn3-5', planId: 'mn3', operateTime: '2026-01-15 10:30:00', operator: '孙丽', operation: '呈核', remark: '重新呈核项目部', approvalNo: 'SP-MN-2026-003' },
  { id: 'ar-mn3-6', planId: 'mn3', operateTime: '2026-01-22 11:00:00', operator: '张主任', operation: '通过', remark: '修订后通过归档', approvalNo: 'SP-MN-2026-003' },
  { id: 'ar-mn3-7', planId: 'mn3', operateTime: '2026-03-05 08:40:00', operator: '孙丽', operation: '启动', remark: '变频器更新施工启动', approvalNo: '' },

  /* pa-06 → tg4：驳回原因 */
  { id: 'ar-tg4-1', planId: 'tg4', operateTime: '2026-01-10 09:00:00', operator: '吴晓燕', operation: '新增', remark: '创建冷轧酸洗段废水零排放技改', approvalNo: '' },
  { id: 'ar-tg4-2', planId: 'tg4', operateTime: '2026-01-18 14:00:00', operator: '吴晓燕', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-AR-RJ-006' },
  { id: 'ar-tg4-3', planId: 'tg4', operateTime: '2026-01-25 16:25:00', operator: '李副总', operation: '驳回', remark: '效益测算口径需按统一模板重算', approvalNo: 'SP-AR-RJ-006' },
  { id: 'ar-tg4-4', planId: 'tg4', operateTime: '2026-02-05 10:00:00', operator: '吴晓燕', operation: '修改', remark: '按驳回意见重算效益并补充模板附件', approvalNo: '' },
  { id: 'ar-tg4-5', planId: 'tg4', operateTime: '2026-02-08 11:20:00', operator: '吴晓燕', operation: '呈核', remark: '修订后再次呈核', approvalNo: 'SP-AR-RJ-006' },
  { id: 'ar-tg4-6', planId: 'tg4', operateTime: '2026-02-10 15:00:00', operator: '李副总', operation: '通过', remark: '修订通过，资料归档', approvalNo: 'SP-AR-RJ-006' },
  { id: 'ar-tg4-7', planId: 'tg4', operateTime: '2026-02-15 09:00:00', operator: '吴晓燕', operation: '启动', remark: '环保技改开工', approvalNo: '' },

  /* pa-07 → oh4 */
  { id: 'ar-oh4-1', planId: 'oh4', operateTime: '2026-02-20 09:30:00', operator: '张伟', operation: '新增', remark: '创建高炉鼓风机本体及润滑系统大修', approvalNo: '' },
  { id: 'ar-oh4-2', planId: 'oh4', operateTime: '2026-02-28 16:00:00', operator: '张伟', operation: '修改', remark: '调整大修工期与备件计划', approvalNo: '' },
  { id: 'ar-oh4-3', planId: 'oh4', operateTime: '2026-03-02 10:00:00', operator: '张伟', operation: '呈核', remark: '呈核项目部审查', approvalNo: 'SP-AR-PASS-010' },
  { id: 'ar-oh4-4', planId: 'oh4', operateTime: '2026-03-05 14:20:00', operator: '李副总', operation: '通过', remark: '领导通过，待年修窗口启动', approvalNo: 'SP-AR-PASS-010' },

  /* pa-08 → 2 已有，补通过 */
  { id: 'ar-2-1', planId: '2', operateTime: '2026-03-20 09:00:00', operator: '李明', operation: '修改', remark: '补充脱硫脱硝联锁方案', approvalNo: '' },
  { id: 'ar-2-2', planId: '2', operateTime: '2026-03-25 11:00:00', operator: '李明', operation: '呈核', remark: '再次呈核领导审批', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-2-3', planId: '2', operateTime: '2026-03-28 16:00:00', operator: '孙总', operation: '通过', remark: '同意通过归档', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-2-4', planId: '2', operateTime: '2026-04-08 08:30:00', operator: '李明', operation: '启动', remark: '环保改造工程启动', approvalNo: '' },

  /* pa-09 → 7 */
  { id: 'ar-7-1', planId: '7', operateTime: '2026-03-01 09:00:00', operator: '孙丽', operation: '新增', remark: '创建企业级能源管理系统（EMS）平台', approvalNo: '' },
  { id: 'ar-7-2', planId: '7', operateTime: '2026-03-20 14:00:00', operator: '孙丽', operation: '修改', remark: '调整分年度付款计划', approvalNo: '' },
  { id: 'ar-7-3', planId: '7', operateTime: '2026-04-05 10:00:00', operator: '孙丽', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-7-4', planId: '7', operateTime: '2026-04-12 11:30:00', operator: '孙总', operation: '通过', remark: '同意立项归档', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-7-5', planId: '7', operateTime: '2026-04-20 09:00:00', operator: '孙丽', operation: '启动', remark: 'EMS平台建设启动', approvalNo: '' },

  /* pa-10 → 1 已有，补通过/启动 */
  { id: 'ar-1-1', planId: '1', operateTime: '2026-04-10 09:00:00', operator: '张伟', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-AR-PASS-010' },
  { id: 'ar-1-2', planId: '1', operateTime: '2026-04-20 14:05:00', operator: '李副总', operation: '通过', remark: '同意大修立项归档', approvalNo: 'SP-AR-PASS-010' },
  { id: 'ar-1-3', planId: '1', operateTime: '2026-05-01 08:00:00', operator: '张伟', operation: '启动', remark: '高炉大修工程启动', approvalNo: '' },

  /* pa-11 → 15 */
  { id: 'ar-15-1', planId: '15', operateTime: '2026-04-01 09:20:00', operator: '王强', operation: '新增', remark: '创建热轧厂区雨水收集与回用站新建', approvalNo: '' },
  { id: 'ar-15-2', planId: '15', operateTime: '2026-04-20 15:00:00', operator: '王强', operation: '呈核', remark: '呈核项目部', approvalNo: 'SP-2026-decl-001' },
  { id: 'ar-15-3', planId: '15', operateTime: '2026-05-06 10:00:00', operator: '李副总', operation: '通过', remark: '领导通过，待开工条件具备后启动', approvalNo: 'SP-2026-decl-001' },

  /* pa-12 → 12：退回原因 */
  { id: 'ar-12-1', planId: '12', operateTime: '2026-04-20 09:00:00', operator: '王强', operation: '新增', remark: '创建精轧机液压伺服阀组零星更新', approvalNo: '' },
  { id: 'ar-12-2', planId: '12', operateTime: '2026-05-10 09:35:00', operator: '王强', operation: '呈核', remark: '呈核项目部审查', approvalNo: 'SP-AR-RET-012' },
  { id: 'ar-12-3', planId: '12', operateTime: '2026-05-12 15:45:00', operator: '张主任', operation: '退回', remark: '请补充备件国产化论证后重报', approvalNo: 'SP-AR-RET-012' },
  { id: 'ar-12-4', planId: '12', operateTime: '2026-05-14 10:00:00', operator: '王强', operation: '修改', remark: '按退回意见补充国产化对比论证', approvalNo: '' },
  { id: 'ar-12-5', planId: '12', operateTime: '2026-05-16 11:00:00', operator: '王强', operation: '呈核', remark: '修订后再次呈核', approvalNo: 'SP-AR-RET-012' },
  { id: 'ar-12-6', planId: '12', operateTime: '2026-05-18 14:00:00', operator: '张主任', operation: '通过', remark: '修订通过归档', approvalNo: 'SP-AR-RET-012' },
  { id: 'ar-12-7', planId: '12', operateTime: '2026-05-20 08:30:00', operator: '王强', operation: '启动', remark: '阀组更换实施完成', approvalNo: '' },

  /* pa-13 → tg2 */
  { id: 'ar-tg2-1', planId: 'tg2', operateTime: '2026-05-10 09:00:00', operator: '吴晓燕', operation: '新增', remark: '创建酸轧段板形闭环控制技改', approvalNo: '' },
  { id: 'ar-tg2-2', planId: 'tg2', operateTime: '2026-05-25 14:00:00', operator: '吴晓燕', operation: '修改', remark: '补充板形控制指标', approvalNo: '' },
  { id: 'ar-tg2-3', planId: 'tg2', operateTime: '2026-05-28 10:00:00', operator: '吴晓燕', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-tg2-4', planId: 'tg2', operateTime: '2026-06-02 11:00:00', operator: '孙总', operation: '通过', remark: '同意通过', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-tg2-5', planId: 'tg2', operateTime: '2026-06-10 09:00:00', operator: '吴晓燕', operation: '启动', remark: '技改调试启动', approvalNo: '' },

  /* pa-14 → oh6 已有会审，补通过 */
  { id: 'ar-oh6-5', planId: 'oh6', operateTime: '2026-06-10 10:00:00', operator: '周涛', operation: '呈核', remark: '会审后呈核领导', approvalNo: 'SP-OH-2026-006' },
  { id: 'ar-oh6-6', planId: 'oh6', operateTime: '2026-06-15 15:00:00', operator: '李副总', operation: '通过', remark: '领导通过归档，待开窗启动', approvalNo: 'SP-OH-2026-006' },

  /* pa-15 → 16 */
  { id: 'ar-16-1', planId: '16', operateTime: '2026-06-01 09:00:00', operator: '周涛', operation: '新增', remark: '创建原料码头堆场智能化地磅站新建', approvalNo: '' },
  { id: 'ar-16-2', planId: '16', operateTime: '2026-06-20 14:00:00', operator: '周涛', operation: '呈核', remark: '呈核项目部', approvalNo: 'SP-2026-decl-001' },
  { id: 'ar-16-3', planId: '16', operateTime: '2026-07-01 10:30:00', operator: '李副总', operation: '通过', remark: '同意通过归档', approvalNo: 'SP-2026-decl-001' },
  { id: 'ar-16-4', planId: '16', operateTime: '2026-07-08 08:40:00', operator: '周涛', operation: '启动', remark: '地磅站土建开工', approvalNo: '' },

  /* pa-16 → 4 已有，补延期 */
  { id: 'ar-4-5', planId: '4', operateTime: '2026-07-15 09:00:00', operator: '赵芳', operation: '通过', remark: '领导审核通过归档', approvalNo: 'SP-TG-2026-004' },
  { id: 'ar-4-6', planId: '4', operateTime: '2026-07-22 10:00:00', operator: '赵芳', operation: '启动', remark: '无人化改造一期启动', approvalNo: '' },
  { id: 'ar-4-7', planId: '4', operateTime: '2026-08-10 14:35:00', operator: '赵芳', operation: '延期', remark: '进口控制系统交货延期，申请完工延至2027-06-30', approvalNo: 'SP-AR-EXT-016' },

  /* pa-17 → mn1：暂停原因 */
  { id: 'ar-mn1-1', planId: 'mn1', operateTime: '2026-02-01 09:00:00', operator: '赵芳', operation: '新增', remark: '创建皮带通廊除尘风机变频改造', approvalNo: '' },
  { id: 'ar-mn1-2', planId: 'mn1', operateTime: '2026-02-15 10:00:00', operator: '赵芳', operation: '呈核', remark: '呈核项目部', approvalNo: 'SP-2026-decl-001' },
  { id: 'ar-mn1-3', planId: 'mn1', operateTime: '2026-02-28 11:00:00', operator: '李副总', operation: '通过', remark: '同意通过归档', approvalNo: 'SP-2026-decl-001' },
  { id: 'ar-mn1-4', planId: 'mn1', operateTime: '2026-03-01 10:05:00', operator: '赵芳', operation: '暂停', remark: '产线检修窗口冲突，申请暂缓执行至下半年', approvalNo: 'SP-AR-DEF-017' },

  /* pa-18 → oh5 已有，补通过 */
  { id: 'ar-oh5-4', planId: 'oh5', operateTime: '2026-08-05 09:00:00', operator: '孙丽', operation: '呈核', remark: '会审排期后呈核领导', approvalNo: 'SP-OH-2026-005' },
  { id: 'ar-oh5-5', planId: 'oh5', operateTime: '2026-08-10 14:00:00', operator: '李副总', operation: '通过', remark: '同意2027年实施窗口，资料归档', approvalNo: 'SP-OH-2026-005' },

  /* pa-19 → xj1 已有，补通过 */
  { id: 'ar-xj1-4', planId: 'xj1', operateTime: '2026-08-15 10:00:00', operator: '李明', operation: '呈核', remark: '部门内审后呈核领导', approvalNo: 'SP-XJ-2026-001' },
  { id: 'ar-xj1-5', planId: 'xj1', operateTime: '2026-08-22 15:00:00', operator: '李副总', operation: '通过', remark: '同意新建立项归档', approvalNo: 'SP-XJ-2026-001' },

  /* pa-20 → tg1 已有，补通过 */
  { id: 'ar-tg1-4', planId: 'tg1', operateTime: '2026-08-25 09:00:00', operator: '张伟', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-TG-2026-001' },
  { id: 'ar-tg1-5', planId: 'tg1', operateTime: '2026-09-01 11:00:00', operator: '李副总', operation: '通过', remark: '同意技改立项归档', approvalNo: 'SP-TG-2026-001' },

  /* pa-21 → mn2 已有，补通过 */
  { id: 'ar-mn2-5', planId: 'mn2', operateTime: '2026-08-28 10:00:00', operator: '孙丽', operation: '呈核', remark: '会审后呈核领导', approvalNo: 'SP-MN-2026-002' },
  { id: 'ar-mn2-6', planId: 'mn2', operateTime: '2026-09-05 14:30:00', operator: '李副总', operation: '通过', remark: '同意零固更新归档', approvalNo: 'SP-MN-2026-002' },

  /* pa-22 → 8：终止原因 */
  { id: 'ar-8-1', planId: '8', operateTime: '2024-05-01 09:00:00', operator: '周涛', operation: '新增', remark: '创建矿石码头桥式卸船机关键部件更新', approvalNo: '' },
  { id: 'ar-8-2', planId: '8', operateTime: '2024-05-20 10:00:00', operator: '周涛', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-8-3', planId: '8', operateTime: '2024-06-12 11:00:00', operator: '孙总', operation: '通过', remark: '同意立项', approvalNo: 'SP-2026-decl-002' },
  { id: 'ar-8-4', planId: '8', operateTime: '2024-07-05 08:30:00', operator: '周涛', operation: '启动', remark: '部件更换实施启动', approvalNo: '' },
  { id: 'ar-8-5', planId: '8', operateTime: '2024-11-20 09:10:00', operator: '周涛', operation: '终止', remark: '实物已完工并验收，申请终止流程并归档', approvalNo: 'SP-AR-STOP-022' },

  /* pa-23 → oh2 */
  { id: 'ar-oh2-1', planId: 'oh2', operateTime: '2024-04-01 09:00:00', operator: '刘洋', operation: '新增', remark: '创建高线精轧机齿轮箱大修', approvalNo: '' },
  { id: 'ar-oh2-2', planId: 'oh2', operateTime: '2024-04-20 14:00:00', operator: '刘洋', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-2026-decl-001' },
  { id: 'ar-oh2-3', planId: 'oh2', operateTime: '2024-05-08 10:00:00', operator: '李副总', operation: '通过', remark: '同意大修立项', approvalNo: 'SP-2026-decl-001' },
  { id: 'ar-oh2-4', planId: 'oh2', operateTime: '2024-08-05 08:00:00', operator: '刘洋', operation: '启动', remark: '齿轮箱大修开工', approvalNo: '' },

  /* pa-24 → tg3 已有预审，补通过归档 */
  { id: 'ar-tg3-4', planId: 'tg3', operateTime: '2024-03-20 09:00:00', operator: '陈刚', operation: '修改', remark: '完善工艺改造方案后正式推进', approvalNo: '' },
  { id: 'ar-tg3-5', planId: 'tg3', operateTime: '2024-04-01 10:00:00', operator: '陈刚', operation: '呈核', remark: '呈核领导审批', approvalNo: 'SP-TG-2026-003' },
  { id: 'ar-tg3-6', planId: 'tg3', operateTime: '2024-04-16 15:00:00', operator: '李副总', operation: '通过', remark: '同意归档（历史技改）', approvalNo: 'SP-TG-2026-003' },
  { id: 'ar-tg3-7', planId: 'tg3', operateTime: '2024-06-05 08:30:00', operator: '陈刚', operation: '启动', remark: '精炼炉电极升降技改实施', approvalNo: '' },
];

export function getDeclOperationLogs(planId: string): DeclOperationLog[] {
  const runtime = getRuntimeLogs().filter((l) => l.planId === planId);
  return [...runtime, ...declOperationLogs.filter((l) => l.planId === planId)]
    .sort((a, b) => (a.operateTime < b.operateTime ? 1 : -1));
}

const LOG_STORAGE_KEY = 'ng_decl_operation_logs_v1';

function getRuntimeLogs(): DeclOperationLog[] {
  try {
    const s = localStorage.getItem(LOG_STORAGE_KEY);
    if (s) return JSON.parse(s) as DeclOperationLog[];
  } catch { /* noop */ }
  return [];
}

/** 追加运行时操作日志（撤回等） */
export function appendDeclOperationLog(log: Omit<DeclOperationLog, 'id'> & { id?: string }) {
  const entry: DeclOperationLog = {
    id: log.id || `dl_rt_${Date.now()}`,
    planId: log.planId,
    operateTime: log.operateTime,
    operator: log.operator,
    operation: log.operation,
    remark: log.remark,
    approvalNo: log.approvalNo,
  };
  const next = [entry, ...getRuntimeLogs()];
  try { localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
  return entry;
}
