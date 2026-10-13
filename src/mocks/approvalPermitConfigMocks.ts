import type { ProjectItem, ProjectMajorType } from './projectPrepareMocks';

export interface PermitStageDoc {
  id: string;
  docName: string;
  required: boolean;
  archived: boolean;
  fileFormats: string[];
  fileSize: number;
  fileSizeUnit: 'MB' | 'GB';
  fileCount: number;
  remark: string;
  templateFile: string;
}

export interface PermitStageGuide {
  prepItems: string;
  resultFiles: string;
  handleDept: string;
  govDept: string;
  notes: string;
  remark: string;
  templateFile: string;
}

export interface PermitStageDef {
  key: string;
  name: string;
  icon: string;
  sortOrder: number;
  docs: PermitStageDoc[];
  guide: PermitStageGuide;
}

export interface ApprovalPermitScheme {
  id: string;
  name: string;
  majorTypes: ProjectMajorType[];
  minorTypes: string[];
  stageKeys: string[];
  /** 方案内可覆盖目录默认的办结附件与指引 */
  stageOverrides?: Record<string, { docs?: PermitStageDoc[]; guide?: PermitStageGuide }>;
  updater: string;
  updatedAt: string;
  enabled: boolean;
}

const defaultFormats = ['PDF', 'Word(doc/docx)', '图片(jpg/png/bmp)'];

function doc(id: string, docName: string, extra?: Partial<PermitStageDoc>): PermitStageDoc {
  return {
    id,
    docName,
    required: true,
    archived: true,
    fileFormats: defaultFormats,
    fileSize: 50,
    fileSizeUnit: 'MB',
    fileCount: 5,
    remark: `办结后上传「${docName}」`,
    templateFile: '',
    ...extra,
  };
}

export const APPROVAL_STAGE_CATALOG: PermitStageDef[] = [
  {
    key: 'project_record',
    name: '项目备案',
    icon: 'ri-file-list-3-line',
    sortOrder: 1,
    docs: [doc('d-record-1', '备案证', { templateFile: '项目备案信息登记表.docx', remark: '线上申请办结后上传备案证' })],
    guide: {
      prepItems:
        '1.1 需要的资料：可研（初步设计）、《项目备案信息登记表》、《固定资产节能信息表》、设备清单、请示报告、营业执照复印件、法人身份证复印件。\n1.2 需要的资源：项目组提供可研报告、设备清单；能源动力厂测算用能情况提供《固定资产节能信息表》。',
      resultFiles: '备案证',
      handleDept: '办公室',
      govDept: '行政审批局',
      notes:
        '根据产业政策分析是否属于限制类项目（是否两高项目），是否涉及产能问题，确定项目性质（新建、改建、扩建、技术改造）；根据《固定资产节能信息表》评估是否需要编制节能评估报告，是否需获取能耗指标办理能评。\n办理所需时间：材料齐全，线上申请 10 个工作日内完成办理。',
      remark: '',
      templateFile: '项目备案信息登记表.docx',
    },
  },
  {
    key: 'planning_permit',
    name: '规划许可证',
    icon: 'ri-map-2-line',
    sortOrder: 2,
    docs: [
      doc('d-plan-1', '规划文本'),
      doc('d-plan-2', '施工图文本', { remark: '规划方案确认后形成施工图文本（约 1-2 个月）' }),
    ],
    guide: {
      prepItems: '需要的资料：安评、环评、能评、备案证、规划设计条件、用地红线。\n需要的资源：实施主管部门配合，提供必要资料。',
      resultFiles: '规划文本、施工图文本（1-2 个月）',
      handleDept: '战投部',
      govDept: '规划部门',
      notes: '办理流程及注意事项：方案确认好，尽量避免多次修改方案。\n办理所需时间：2-3 个月。',
      remark: '',
      templateFile: '',
    },
  },
  {
    key: 'construction_permit',
    name: '施工许可证',
    icon: 'ri-building-line',
    sortOrder: 3,
    docs: [doc('d-cons-1', '施工许可证', { remark: '政务系统申报办结后上传施工许可证' })],
    guide: {
      prepItems:
        '土地不动产权证、合同归集、五方责任主体（法人授权委托书、质量终身承诺书、工程款支付计划、安全文明措施费支付计划、建设单位无拖欠工程款承诺书、建设单位资金已落实承诺书、三方安全生产承诺书、消防承诺书、行政审批承诺书、行政审批办理建筑工程施工许可安全生产承诺书、审图合格证、规划许可证、施工组织设计审批表、应急预案审批表、质安监监督通知书、施工单位缴纳三险、签订智慧工地合同、洒水降尘设备照片、工地封闭围挡照片、施工平面布置图）。\n需要的资源：项目管理部门负责填报及收集相关材料。',
      resultFiles: '施工许可证',
      handleDept: '办公室',
      govDept: '行政审批局、区住建局',
      notes: '办理流程及注意事项：政务系统申报上传盖章材料附件。\n办理所需时间：三个月左右，上述材料齐全一周内可取证。',
      remark: '',
      templateFile: '',
    },
  },
  {
    key: 'safety_eval',
    name: '安评',
    icon: 'ri-shield-check-line',
    sortOrder: 4,
    docs: [
      doc('d-safe-1', '安全三同时报告及审查文件', { remark: '含政府审查文件、评审会专家意见及签到、评审组意见等' }),
      doc('d-safe-2', '职业卫生三同时报告及检测评价', { remark: '含政府审查文件、专家意见及职业病危害因素检测评价报告' }),
    ],
    guide: {
      prepItems:
        '（一）安全三同时：安全预评价、安全设施设计（安全专篇）、安全验收评价所需资料（营业执照、立项批准文件、选址及规划许可、总图及工艺、可研及环评、设备及三废、劳动定员等）。\n（二）职业卫生三同时：职业病危害预评价、防护设施设计专篇、控制效果评价所需资料。\n需要的资源：相关部门、专业科室、项目资料组；办公室统一对外的企业基础信息及营业执照。',
      resultFiles:
        '（1）安全三同时报告、政府审查文件、评审会专家意见及签到、评审组意见等；\n（2）职业卫生三同时报告、职业卫生政府审查文件、评审会专家意见及签到、评审组意见、项目的职业病危害因素检测评价报告等。',
      handleDept: '安全环保部',
      govDept: '市（区）应急管理局；市（区）卫健委',
      notes:
        '按照法规要求“三同时”手续贯穿设计、施工到投产使用全过程。具体遵照《建设项目安全设施“三同时”监督管理办法》（总局令第 77 号）《建设项目职业病防护设施“三同时”监督管理办法》（总局令第 90 号）。\n办理所需时间：视项目规模，快则 3-4 个月，慢则约 6 个月（实际伴随整个项目进程）。',
      remark: '',
      templateFile: '安全预评价资料清单.xlsx',
    },
  },
  {
    key: 'env_eval',
    name: '环评',
    icon: 'ri-leaf-line',
    sortOrder: 5,
    docs: [doc('d-env-1', '环境影响评价批复', { remark: '项目未取得环评批复，不得开工建设' })],
    guide: {
      prepItems:
        '按《建设项目环境影响评价分类管理名录（2021）》判断环评类型：登记表、报告表、报告书。\n登记表前置：备案证、项目开工时间、项目环保投入、占地面积（周期约 1 个工作日）。\n报告表/报告书前置：可研报告、备案证（涉及产能置换的高炉、转炉需提供产能置换手续）。取得备案证并完成可研、确定环评机构后，报告表约 2.5 个月、报告书约 3 个月拿到批复。',
      resultFiles: '环境影响评价批复',
      handleDept: '安全环保部',
      govDept: '生态环境主管部门',
      notes: '特别关注：项目未取得环评批复，不得开工建设。',
      remark: '参考文件第三列未单列办结文件，按环评办结结果归档批复。',
      templateFile: '',
    },
  },
  {
    key: 'energy_eval',
    name: '能评',
    icon: 'ri-flashlight-line',
    sortOrder: 6,
    docs: [
      doc('d-ene-1', '节能报告（或节能承诺表）'),
      doc('d-ene-2', '节能审查批复'),
      doc('d-ene-3', '节能验收报告', { required: false }),
    ],
    guide: {
      prepItems: '需要的资料：可研报告。\n需要的资源：政府主管部门配合及项目归属部门技术支撑。',
      resultFiles: '节能报告（或节能承诺表）、节能审查批复、节能验收报告',
      handleDept: '能源动力厂',
      govDept: '各级发改委、工信局',
      notes:
        '项目资料收集 → 编制项目节能报告（或节能承诺表） → 报送政府主管部门审查 → 出具项目节能审查批复 → 编制项目节能验收报告并报送主管部门备案。新增用能项目需提前落实能耗指标来源。\n办理所需时间：正常 2 个月。',
      remark: '',
      templateFile: '固定资产节能信息表.xlsx',
    },
  },
  {
    key: 'water_soil',
    name: '水土保持',
    icon: 'ri-drop-line',
    sortOrder: 7,
    docs: [
      doc('d-ws-1', '水土保持方案报告书（或报告表）'),
      doc('d-ws-2', '水土保持方案批复'),
    ],
    guide: {
      prepItems: '需要的资料：可研报告、相关土建、施工材料。\n需要的资源：政府主管部门配合及项目归属部门技术支撑。',
      resultFiles: '水土保持方案报告书（或水土保持方案报告表）、水土保持方案批复。',
      handleDept: '能源动力厂',
      govDept: '区水利局',
      notes:
        '项目资料收集 → 编制水土保持方案报告书（或报告表） → 报送政府主管部门审查 → 出具批复 → 缴纳水土保持补偿费。新征占地面积不足 0.5 公顷且挖填土石方总量不足 0.1 万立方米的项目，无需办理水土保持方案审批手续。\n办理所需时间：正常 2 个月。',
      remark: '',
      templateFile: '',
    },
  },
  {
    key: 'completion_accept',
    name: '竣工验收',
    icon: 'ri-checkbox-circle-line',
    sortOrder: 8,
    docs: [
      doc('d-comp-1', '排污许可证', { remark: '建成后不得调试、生产、排污，须完成排污许可变更' }),
      doc('d-comp-2', '突发环境应急预案'),
      doc('d-comp-3', '竣工环保验收报告'),
    ],
    guide: {
      prepItems:
        '排污许可变更取证：项目建成后不得调试、生产、排污，完成排污许可证变更后可调试运行（周期 1-2 个月）。\n突发环境应急预案：取得排污许可证后完成修编（预案、风险评估、应急资源调查、一图两卡两单、三级能力评估，周期 1-2 个月）。\n项目竣工环保验收：确认环评与实际建设相符性；不一致需增加《一般变动影响分析报告》。不含二噁英类监测约 1.5 个月，含二噁英类约 2 个月。',
      resultFiles: '排污许可证、突发环境应急预案、竣工环保验收报告',
      handleDept: '安全环保部',
      govDept: '生态环境主管部门',
      notes: '特别关注：取得排污许可证后，自调试阶段起一年内完成项目竣工环保验收。',
      remark: '参考文件第三列未单列办结文件，按环保竣工验收闭环资料归档。',
      templateFile: '',
    },
  },
];

export const PERMIT_MINOR_TYPE_OPTIONS = [
  '基建工程', '技术改造', '信息化项目', '环保治理', '安全整改', '设备更新',
  '智能化', '信息化', '土建工程', '品种质量', '安全环保', '装备升级',
];

function emptyGuide(): PermitStageGuide {
  return { prepItems: '', resultFiles: '', handleDept: '', govDept: '', notes: '', remark: '', templateFile: '' };
}

export function createEmptyStage(name: string, sortOrder = 90): PermitStageDef {
  const key = `stg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  return {
    key,
    name,
    icon: 'ri-flag-line',
    sortOrder,
    docs: [doc(`d_${key}_1`, `${name}办结文件`)],
    guide: emptyGuide(),
  };
}

const extraStageSeed: PermitStageDef[] = [
  {
    key: 'property_cert',
    name: '不动产权证办理',
    icon: 'ri-home-gear-line',
    sortOrder: 9,
    docs: [doc('d-prop-1', '不动产权证', { remark: '土地及地上建筑物权属证明办结后上传' })],
    guide: {
      prepItems: '需要的资料：土地出让合同/划拨决定书、规划许可证、竣工验收资料、测绘报告。\n需要的资源：战投部配合红线与权属材料。',
      resultFiles: '不动产权证',
      handleDept: '战投部',
      govDept: '自然资源局',
      notes: '竣工验收通过后再行权属登记。办理所需时间：材料齐全约 1 个月。',
      remark: '',
      templateFile: '',
    },
  },
  {
    key: 'fire_accept',
    name: '消防验收',
    icon: 'ri-fire-line',
    sortOrder: 10,
    docs: [doc('d-fire-1', '消防验收意见书')],
    guide: {
      prepItems: '需要的资料：消防设计审查文件、竣工图纸、消防设施检测报告。',
      resultFiles: '消防验收意见书',
      handleDept: '安全环保部',
      govDept: '消防救援支队',
      notes: '特殊建设工程须先取得消防设计审查意见。办理所需时间：约 20 个工作日。',
      remark: '',
      templateFile: '',
    },
  },
];

interface PermitConfigStore {
  schemes: ApprovalPermitScheme[];
  extraStages: PermitStageDef[];
}

const STORAGE_KEY = 'pms_approval_permit_config_v4';
const LEGACY_KEYS = ['pms_approval_permit_config_v3', 'pms_approval_permit_config_v2', 'pms_approval_permit_config_v1'];

const schemeSeed: ApprovalPermitScheme[] = [
  {
    id: 'aps_001',
    name: '新建/技改 · 基建工程、技术改造',
    majorTypes: ['新建', '技改'],
    minorTypes: ['基建工程', '技术改造', '土建工程', '装备升级'],
    stageKeys: [...APPROVAL_STAGE_CATALOG.map((s) => s.key), 'property_cert', 'fire_accept'],
    updater: '管理员',
    updatedAt: '2026-03-12 10:20:00',
    enabled: true,
  },
  {
    id: 'aps_002',
    name: '新建/技改 · 信息化、智能化',
    majorTypes: ['新建', '技改'],
    minorTypes: ['信息化项目', '信息化', '智能化'],
    stageKeys: ['project_record', 'energy_eval', 'safety_eval', 'env_eval', 'completion_accept'],
    updater: '管理员',
    updatedAt: '2026-03-08 14:00:00',
    enabled: true,
  },
  {
    id: 'aps_003',
    name: '新建/技改 · 环保治理、安全整改',
    majorTypes: ['新建', '技改'],
    minorTypes: ['环保治理', '安全整改', '安全环保'],
    stageKeys: ['project_record', 'env_eval', 'safety_eval', 'water_soil', 'construction_permit', 'completion_accept'],
    updater: '管理员',
    updatedAt: '2026-02-26 09:40:00',
    enabled: true,
  },
  {
    id: 'aps_004',
    name: '营缮 · 设备更新/设施维修',
    majorTypes: ['营缮'],
    minorTypes: ['设备更新', '设备营缮', '设施维修'],
    stageKeys: ['project_record', 'safety_eval', 'completion_accept'],
    updater: '管理员',
    updatedAt: '2026-02-18 16:10:00',
    enabled: true,
  },
  {
    id: 'aps_005',
    name: '零固 · 设备更新、信息化建设',
    majorTypes: ['零固'],
    minorTypes: ['设备更新', '信息化建设', '信息化项目'],
    stageKeys: ['project_record', 'energy_eval', 'safety_eval'],
    updater: '管理员',
    updatedAt: '2026-02-10 11:30:00',
    enabled: true,
  },
  {
    id: 'aps_006',
    name: '技改 · 品种质量（停用示例）',
    majorTypes: ['技改'],
    minorTypes: ['品种质量'],
    stageKeys: ['project_record', 'planning_permit', 'construction_permit', 'safety_eval'],
    updater: '管理员',
    updatedAt: '2026-01-22 08:50:00',
    enabled: false,
  },
];

function defaultStore(): PermitConfigStore {
  return { schemes: [...schemeSeed], extraStages: extraStageSeed.map((s) => ({ ...s, docs: s.docs.map((d) => ({ ...d })), guide: { ...s.guide } })) };
}

function loadStore(): PermitConfigStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PermitConfigStore;
      if (parsed && Array.isArray(parsed.schemes) && parsed.schemes.length > 0) {
        return {
          schemes: parsed.schemes,
          extraStages: Array.isArray(parsed.extraStages) ? parsed.extraStages : extraStageSeed,
        };
      }
    }
    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (!legacy) continue;
      try {
        const parsed = JSON.parse(legacy);
        if (parsed && Array.isArray(parsed.schemes) && parsed.schemes.length > 0) {
          const store = {
            schemes: parsed.schemes,
            extraStages: Array.isArray(parsed.extraStages) ? parsed.extraStages : extraStageSeed,
          };
          persistStore(store);
          return store;
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          const store = { schemes: parsed as ApprovalPermitScheme[], extraStages: extraStageSeed };
          persistStore(store);
          return store;
        }
      } catch {
        /* ignore this key */
      }
    }
  } catch {
    /* ignore */
  }
  const store = defaultStore();
  persistStore(store);
  return store;
}

function persistStore(store: PermitConfigStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function loadSchemes(): ApprovalPermitScheme[] {
  return loadStore().schemes;
}

export function getExtraStages(): PermitStageDef[] {
  return loadStore().extraStages;
}

export function getAllStageCatalog(): PermitStageDef[] {
  const extras = getExtraStages();
  const seen = new Set(APPROVAL_STAGE_CATALOG.map((s) => s.key));
  const merged = [...APPROVAL_STAGE_CATALOG];
  extras.forEach((s) => {
    if (!seen.has(s.key)) {
      seen.add(s.key);
      merged.push(s);
    }
  });
  return merged.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function saveExtraStage(stage: PermitStageDef): PermitStageDef[] {
  const store = loadStore();
  const idx = store.extraStages.findIndex((s) => s.key === stage.key);
  if (idx >= 0) store.extraStages[idx] = stage;
  else store.extraStages.push(stage);
  persistStore(store);
  return [...store.extraStages];
}

export function deleteExtraStage(key: string): { schemes: ApprovalPermitScheme[]; extraStages: PermitStageDef[] } {
  const store = loadStore();
  store.extraStages = store.extraStages.filter((s) => s.key !== key);
  store.schemes = store.schemes.map((s) => ({
    ...s,
    stageKeys: s.stageKeys.filter((k) => k !== key),
  }));
  persistStore(store);
  return { schemes: [...store.schemes], extraStages: [...store.extraStages] };
}

export function getApprovalPermitSchemes(): ApprovalPermitScheme[] {
  return loadSchemes();
}

export function saveApprovalPermitScheme(scheme: ApprovalPermitScheme): ApprovalPermitScheme[] {
  const store = loadStore();
  const next = { ...scheme, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) };
  const idx = store.schemes.findIndex((s) => s.id === scheme.id);
  if (idx >= 0) store.schemes[idx] = next;
  else store.schemes.unshift(next);
  persistStore(store);
  return [...store.schemes];
}

export function deleteApprovalPermitScheme(id: string): ApprovalPermitScheme[] {
  const store = loadStore();
  store.schemes = store.schemes.filter((s) => s.id !== id);
  persistStore(store);
  return [...store.schemes];
}

export function getStageDef(key: string): PermitStageDef | undefined {
  return getAllStageCatalog().find((s) => s.key === key);
}

export function resolveStageConfig(scheme: ApprovalPermitScheme | undefined, stageKey: string): PermitStageDef | undefined {
  const base = getStageDef(stageKey);
  if (!base) return undefined;
  const ov = scheme?.stageOverrides?.[stageKey];
  if (!ov) return base;
  return {
    ...base,
    docs: ov.docs ?? base.docs,
    guide: ov.guide ?? base.guide,
  };
}

export function getSchemeForProject(project: ProjectItem): ApprovalPermitScheme | undefined {
  return loadSchemes().find(
    (s) =>
      s.enabled &&
      s.majorTypes.includes(project.majorType) &&
      (s.minorTypes.includes(project.projectType) || s.minorTypes.includes(project.minorType)),
  );
}

export function getStageDefsForProject(project: ProjectItem): PermitStageDef[] {
  const scheme = getSchemeForProject(project);
  const keys = scheme?.stageKeys?.length ? scheme.stageKeys : APPROVAL_STAGE_CATALOG.map((s) => s.key);
  return keys
    .map((k) => resolveStageConfig(scheme, k))
    .filter((s): s is PermitStageDef => Boolean(s))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
