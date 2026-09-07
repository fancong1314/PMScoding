# 南钢工程一体化项目管理系统

## 1. 项目描述
南钢工程一体化项目管理系统是一个面向南京钢铁集团工程项目的全生命周期管理平台。系统覆盖从项目计划、论证、立项、准备、合同、执行、收尾到档案管理的完整流程，支持多角色权限管理，实现工程项目的信息化、标准化管理。

目标用户：项目经理、工程管理人员、审批人员、系统管理员等。

## 2. 页面结构

### 一级模块导航
- `/` - 系统首页/仪表盘
- `/project-plan` - 项目计划管理
- `/project-argument` - 项目论证管理
- `/project-approval` - 项目立项管理
- `/project-prepare` - 项目准备管理
  - `/project-prepare/project-management` - 项目成员管理（项目列表、成员列表、新增成员、成员变更）
  - `/project-prepare/preliminary-material` - 前期资料管理（项目列表、资料可视化展示）
  - `/project-prepare/preliminary-design` - 初步设计审查（审查列表、概算审查）
  - `/project-prepare/estimate-management` - 概算管理（项目列表、概算清单、修正申请、修订日志）
- `/project-contract` - 项目合同管理
  - `/project-contract/requirement` - 工程需求管理 → 工程需求申报（项目列表、需求清单、新增/修改/详情、审批流配置、审批结果）
  - `/project-contract/undertake` - 工程需求管理 → 主管单位承办（项目列表、需求清单、呈核/详情、审批结果）
  - `/project-contract/progress` - 合同进度管理（合同列表、周报月报、任务拆解、进度横道图）
  - `/project-contract/execution` - 合同执行管理（合同列表、合同执行列表含7个TAB、开工令审批/详情/签发、开工细项配置）
    - `/system-config/commencement-config` - 开工细项配置（配置列表、新增/编辑/删除/启用禁用）
- `/project-execute` - 项目执行管理
  - `/project-execute/quality-safety` - 质量安全管理
  - `/project-execute/dangerous-work` - 危险作业管理
- `/participant` - 参建方管理
  - `/participant/negative-score` - 负面积分管理（参建方列表、扣分明细、新增扣分、审批记录）
- `/project-close` - 项目收尾管理
- `/project-dashboard` - 项目看板报表
- `/knowledge-engine` - 工程智库
  - `/knowledge-engine/knowledge-base` - 知识库管理（文档/命中测试/设置3页签）
  - `/knowledge-engine/qa` - 智能问询（对话式AI问答界面）
- `/project-archive` - 项目档案管理
- `/project-config` - 项目配置管理
  - `/system-config/plan-config` - 项目计划配置
  - `/system-config/manager-config` - 项目经理配置
  - `/system-config/commencement-config` - 开工细项配置

## 3. 核心功能

### 项目合同管理 - 合同执行管理
- [x] 合同列表页（查询筛选：立项号/合同金额区间/合同类型/合同状态/合同编号/厂商编号/合同名称/签约日期，列表13列，分页50条，固定列）
- [x] 合同执行列表页（7个TAB：开工/交工/停复工/签证/竣工/变更核价/延期，开工TAB完整实现）
- [x] 开工令审批页（通过/退回，左侧锚点+右侧表单，基础信息/施工内容核查/审批流程记录）
- [x] 开工令详情页（只读展示，含审批流程记录）
- [x] 开工令签发弹窗（附件上传、提交/取消）
- [x] 开工细项配置（系统配置管理，列表/新增/编辑/删除/启用禁用）

### 项目准备管理 - 初步设计审查
- [x] 初步设计审查列表页（查询筛选、列表、跳转概算审查）
- [x] 概算审查界面（3级层级表格、绿蓝琥珀三色区分、展开收起、编辑模式切换、细项金额修改/删除/新增、实时总额校验、呈核审批、修改日志）
- [x] 呈核审批弹窗（审批流程配置）
- [x] 修改日志弹窗（修改前后对比、差异摘要、审批流程可视化）

### 项目准备管理 - 项目成员管理
- [x] 项目列表（表格，支持筛选、分页、多选、跳转成员管理）
- [x] 项目成员列表（表格，支持搜索、添加成员、项目经理变更、经办人变更、删除）
- [x] 新增成员弹窗（动态添加多行、人员搜索、部门自动带入、表单校验）
- [x] 成员变更弹窗（项目经理/经办人变更、变更原因、提交审批）

### 项目准备管理 - 前期资料管理
- [x] 前期资料项目列表（表格，支持筛选、跳转资料管理）
- [x] 前期资料列表（可视化卡片设计，四大分类，状态颜色区分，空缺提醒）
- [x] 导出资料清单

### 项目准备管理 - 概算管理
- [x] 项目列表页（查询筛选、列表展示、跳转概算清单）
- [x] 概算清单页（3级层级表格、三色区分、单选框、修改/修正申请/修订日志按钮）
- [x] 修改弹窗（概算修订金额和工程需求动用金额修改、左右分栏）
- [x] 概算修正申请页面（项目基本信息、费用明细、实时总额校验、结余费限制、呈核审批）
- [x] 修订日志弹窗（申请记录列表、详情查看、审批记录）

### 项目合同管理 - 合同进度管理
- [x] 合同列表页（查询筛选、列表、操作按钮：周报月报/进度图表/任务拆解）
- [x] 周报月报列表页（周报/月报tab切换、列表、回复/操作日志/详情）
- [x] 周报月报详情页（详情展示、附件、回复记录）
- [x] 任务拆解界面（WBS任务树、3级颜色区分、状态标签、审核/审批记录/汇报记录/下载按钮）
- [x] 整体审核弹窗（通过/驳回、审核意见）
- [x] 审批记录弹窗（时间线展示完整操作链路）
- [x] 汇报记录弹窗（进度对比、延误标识）
- [x] 进度横道图页面（季度/月/周/日维度切换、计划vs实际进度条）

### 项目合同管理 - 工程需求管理
- [x] 项目列表页（查询筛选、列表、跳转工程需求清单）
- [x] 工程需求清单页（列表、新增/修改/呈核/查看审批/删除/撤销操作）
- [x] 需求新增/修改页（基础信息、需求明细、金额占用明细、呈核/保存/返回）
- [x] 自定义审批流配置弹窗（节点配置、条件分支、流程预览、提交）
- [x] 审批结果弹窗（流程图、审核日志详情、tab切换）
- [x] 需求详情页（只读展示、所有字段回显）
- [x] 主管单位承办项目列表页（查询筛选、列表、跳转主管单位承办需求清单）
- [x] 主管单位承办需求清单页（列表、修改经办人、退回发起人/呈核/退回商务标书/确认/撤回/重新发起委托/发起商务标书呈核/查看审批结果操作）
- [x] 主管单位承办呈核页面（基础信息、招标信息、承办信息、附加信息、委托信息、附件、系统信息，左侧锚点+右侧表单）
- [x] 主管单位承办需求详情页（只读展示、所有字段回显）

### 参建方管理 - 负面积分管理
- [x] 参建方列表（排序、预警高亮、跳转扣分明细）
- [x] 扣分明细列表（筛选、新增扣分、审批记录、撤销审批）
- [x] 新增扣分弹窗（发起人字段、考核人下拉选择）
- [x] 审批记录弹窗

### 项目档案管理
- [x] 项目档案配置（左侧功能节点树+右侧通用/条件配置TAB、新增/编辑附件配置项弹窗、条件配置编辑弹窗、配置预览页、配置复制弹窗）
- [x] 项目档案管理（项目档案列表页含统计摘要、档案详情页含左右分栏目录树+附件列表+缺失提醒、附件预览页含元数据、版本历史弹窗）

## 4. 数据模型设计

### 参建方表 (participants)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 主键 |
| name | string | 单位名称 |
| type | string | 单位类型 |
| code | string | 单位编号 |
| total_score | number | 负面积分合计 |

### 扣分记录表 (deduction_records)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 主键 |
| participant_id | string | 参建方ID |
| deduction_category | string | 扣分类别 |
| related_contract | string | 关联合同 |
| assessment_date | string | 考核日期 |
| reason | string | 扣分原因 |
| score | number | 负面积分 |
| assessor | string | 考核人 |
| assessor_dept | string | 考核部门 |
| initiator | string | 发起人 |
| status | string | 审批状态 |

### 项目部表 (projects)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 主键 |
| name | string | 项目名称 |
| approval_no | string | 立项号 |
| construction_unit | string | 建设单位 |
| project_type | string | 项目类型 |
| manager | string | 项目经理 |
| building | string | 楼栋 |

### 项目成员表 (project_members)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 主键 |
| project_id | string | 项目ID |
| name | string | 成员姓名 |
| employee_no | string | 工号 |
| department | string | 部门 |
| phone | string | 手机号 |
| type | string | 成员类型 |
| related_contract | string | 关联合同 |
| status | string | 状态 |

### 概算项目表 (estimate_projects)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 主键 |
| approval_no | string | 立项号 |
| plan_no | string | 计划号 |
| name | string | 项目名称 |
| description | string | 立项说明 |
| project_type | string | 项目类型 |
| budget_amount | number | 立项金额 |
| pre_budget_amount | number | 预立项金额 |
| actual_budget_amount | number | 实际立项金额 |
| original_contract_amount | number | 原始合同金额 |
| revised_contract_amount | number | 修正合同金额 |
| completed_amount | number | 完工金额 |
| settled_amount | number | 结算金额 |
| accounted_amount | number | 记账金额 |
| fixed_amount | number | 转固金额 |
| approval_date | string | 立项日期 |
| owner_unit | string | 业主单位 |
| implement_unit | string | 实施主管单位 |
| project_manager | string | 项目负责人 |
| is_env_assessment | boolean | 是否环保评估 |

### 概算明细表 (estimate_items)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 主键 |
| project_id | string | 项目ID |
| name | string | 费用名称 |
| spec | string | 规格型号 |
| original_amount | number | 概算原始金额 |
| revised_amount | number | 概算修订金额 |
| demand_amount | number | 工程需求动用金额 |
| contract_amount | number | 合同动用金额 |
| remaining_amount | number | 剩余金额 |
| level | number | 层级(1/2/3) |
| parent_id | string | 父级ID |
| creator | string | 创建人 |
| modifier | string | 修改人 |
| created_at | string | 创建时间 |
| modified_at | string | 修改时间 |

### 概算修正申请表 (estimate_revision_applications)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 主键 |
| project_id | string | 项目ID |
| approval_no | string | 立项号 |
| name | string | 项目名称 |
| status | string | 审核状态 |
| reason | string | 申请理由 |
| creator | string | 建档人 |
| create_date | string | 建档日期 |
| modifier | string | 修改人 |
| modify_date | string | 修改日期 |
| submitter | string | 呈核人 |
| submit_date | string | 呈核日期 |
| detail_items | array | 费用明细修改数据 |
| approval_flow | array | 审批流程配置 |

### 合同表 (contracts)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 主键 |
| approval_no | string | 立项号 |
| contract_no | string | 合同编号 |
| contract_name | string | 合同名称 |
| contract_type | string | 合同类型 |
| contractor_no | string | 承包商编号 |
| contractor_name | string | 承包商名称 |
| main_content | string | 主要内容 |
| plan_progress | number | 计划完成进度 |
| actual_progress | number | 实际完成进度 |
| contract_status | string | 合同状态 |
| project_type | string | 项目类型 |
| owner_unit | string | 业主单位 |
| contract_amount | number | 合同金额 |
| wbs_status | string | WBS状态 |
| wbs_version | string | 当前生效版本号 |
| wbs_tasks | array | WBS任务列表 |

## 5. 后端/第三方集成计划
- Supabase: 后续需要连接，用于用户认证和数据存储
- 当前阶段：使用模拟数据展示界面效果

## 6. 开发阶段计划

### Phase 1: 系统框架 + 项目计划申报页面
- 目标：搭建系统整体UI框架
- 状态：已完成

### Phase 2-4: 各业务模块页面
- 项目论证管理、项目立项管理、项目执行管理、参建方管理、项目准备管理、项目合同管理
- 状态：已完成大部分模块

### Phase 5: 数据持久化与权限
- 目标：连接Supabase数据库，实现用户登录与权限控制
- 状态：待开发