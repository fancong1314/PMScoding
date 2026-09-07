export interface Contract {
  id: string;
  projectNo: string;
  projectName: string;
  projectType: string;
  contractNo: string;
  contractName: string;
  contractType: string;
  businessUnit: string;
  constructionUnit: string;
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  totalDeductionScore: number;
  createDate: string;
}

export interface Issue {
  id: string;
  issueNo: string;
  issueType: string;
  issueCategory: 'quality' | 'safety';
  initiator: string;
  initiatorUnit: string;
  createTime: string;
  issueLevel: string;
  deadline: string;
  description: string;
  status: string;
  contractId: string;
  contractName: string;
  contractNo: string;
  contractType: string;
  constructionUnit: string;
  supervisorUnit: string;
  discoverDate: string;
  photos: string[];
  attachments: Attachment[];
  constructionDeductionScore: number;
  constructionDeductionAmount: number;
  supervisorDeductionScore: number;
  supervisorDeductionAmount: number;
  reviewRecords: ReviewRecord[];
  approvalHistory: ApprovalHistoryItem[];
  rectifyRecords: RectifyRecord[];
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface ReviewRecord {
  id: string;
  result: '通过' | '驳回';
  reason: string;
  reviewer: string;
  reviewTime: string;
  attachments: Attachment[];
}

export interface ApprovalHistoryItem {
  id: string;
  node: string;
  status: string;
  approver: string;
  opinion: string;
  time: string;
  color: string;
}

export interface RectifyRecord {
  id: string;
  type: '发起' | '整改' | '复查';
  operator: string;
  time: string;
  content: string;
  photos?: string[];
}

export const contractTypes = [
  '工程总承包',
  '施工承包',
  '设计承包',
  '监理承包',
  '设备采购',
  '技术服务',
];

export const projectTypes = [
  '技改项目',
  '新建项目',
  '维修项目',
  '科研项目',
  '环保项目',
];

export const businessUnits = [
  '炼铁事业部',
  '炼钢事业部',
  '轧钢事业部',
  '能源事业部',
  '总师室',
  '设备管理部',
  '安全环保部',
  '基建部',
  '生产部',
];

export const constructionUnits = [
  '中冶天工集团',
  '上海宝冶集团',
  '中国二十冶集团',
  '中冶赛迪工程技术',
  '中冶京诚工程技术',
  '中冶南方工程技术',
  '南京钢铁集团工程',
  '江苏省建工集团',
  '江苏南通三建集团',
  '中国五冶集团',
];

export const supervisorUnits = [
  '上海宝钢监理',
  '中冶设备监理',
  '南京监理公司',
  '江苏省工程监理',
  '中咨工程建设监理',
];

export const qualityIssueTypes = [
  '混凝土强度不足',
  '钢筋间距超标',
  '焊接质量缺陷',
  '设备安装偏差',
  '防腐涂层厚度不足',
  '隐蔽工程未验收',
  '材料进场未报验',
  '施工工艺不规范',
  '检验批不合格',
  '观感质量差',
];

export const safetyIssueTypes = [
  '高处作业未系安全带',
  '临边洞口无防护',
  '动火作业无审批',
  '临时用电不规范',
  '起重吊装违章操作',
  '脚手架搭设不规范',
  '受限空间作业违规',
  '安全防护用品缺失',
  '特种设备未检验',
  '消防器材配备不足',
];

export const issueLevels = ['重大', '较大', '一般'];

export const issueStatuses = [
  { value: '待整改', label: '待整改', color: 'bg-red-50 text-red-700 border border-red-200' },
  { value: '整改中', label: '整改中', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { value: '已整改', label: '已整改', color: 'bg-blue-50 text-blue-700 border border-blue-200' },
  { value: '待复查', label: '待复查', color: 'bg-violet-50 text-violet-700 border border-violet-200' },
  { value: '整改通过', label: '整改通过', color: 'bg-green-50 text-green-700 border border-green-200' },
  { value: '已驳回', label: '已驳回', color: 'bg-orange-50 text-orange-700 border border-orange-200' },
  { value: '已关闭', label: '已关闭', color: 'bg-slate-100 text-slate-500' },
];

const projectNames = [
  '炼铁厂1号高炉大修工程',
  '炼钢厂转炉除尘系统改造',
  '轧钢事业部热轧产线升级',
  '能源事业部余热发电项目',
  '总师室技术中心实验室建设',
  '安全环保部烟气治理工程',
  '设备管理部备件仓库扩建',
  '基建部员工宿舍改造项目',
  '生产部调度中心信息化升级',
  '炼铁厂原料场封闭改造',
  '炼钢厂连铸机自动化改造',
  '轧钢事业部冷轧酸洗线改造',
  '能源事业部煤气柜扩容',
  '总师室中试基地建设',
  '安全环保部废水处理升级',
  '设备管理部机修车间改造',
  '基建部道路管网综合改造',
  '生产部质量检测中心建设',
  '炼铁厂喷煤系统改造',
  '炼钢厂AOD炉升级改造',
];

const contractNames = [
  '土建工程施工合同',
  '钢结构安装合同',
  '设备安装调试合同',
  '电气自动化施工合同',
  '管道工程施工合同',
  '防腐保温工程合同',
  '土方开挖工程合同',
  '装饰装修工程合同',
  '消防工程施工合同',
  '环保设施施工合同',
];

export const contracts: Contract[] = Array.from({ length: 20 }, (_, i) => {
  const total = 3 + (i % 8);
  const resolved = Math.floor(total * 0.6);
  const pending = total - resolved;
  const ctName = projectNames[i % projectNames.length];
  return {
    id: `ct_${i + 1}`,
    projectNo: `LZNK-PL-2026-${String(i + 1).padStart(4, '0')}`,
    projectName: ctName,
    projectType: projectTypes[i % projectTypes.length],
    contractNo: `HT-2026-${String(1000 + i).padStart(5, '0')}`,
    contractName: `${ctName}-${contractNames[i % contractNames.length]}`,
    contractType: contractTypes[i % contractTypes.length],
    businessUnit: businessUnits[i % businessUnits.length],
    constructionUnit: constructionUnits[i % constructionUnits.length],
    totalIssues: total,
    resolvedIssues: resolved,
    pendingIssues: pending,
    totalDeductionScore: 0,
    createDate: `2026-0${1 + (i % 5)}-${String(1 + (i % 28)).padStart(2, '0')}`,
  };
});

function generateIssues(): Issue[] {
  const issues: Issue[] = [];
  let qualitySeq = 1;
  let safetySeq = 1;

  contracts.forEach((ct) => {
    const qualityCount = Math.ceil(ct.totalIssues * 0.55);
    const safetyCount = ct.totalIssues - qualityCount;

    for (let q = 0; q < qualityCount; q++) {
      const seq = String(qualitySeq++).padStart(6, '0');
      const status = issueStatuses[q % issueStatuses.length].value;
      issues.push({
        id: `qi_${seq}`,
        issueNo: `WT2026${seq}`,
        issueType: qualityIssueTypes[q % qualityIssueTypes.length],
        issueCategory: 'quality',
        initiator: ['张三', '李四', '王五', '赵六', '钱七'][q % 5],
        initiatorUnit: businessUnits[q % businessUnits.length],
        createTime: `2026-0${1 + (q % 5)}-${String(5 + (q % 20)).padStart(2, '0')} ${String(8 + (q % 4)).padStart(2, '0')}:${String(10 + (q % 40)).padStart(2, '0')}:00`,
        issueLevel: issueLevels[q % issueLevels.length],
        deadline: `2026-0${2 + (q % 4)}-${String(15 + (q % 10)).padStart(2, '0')}`,
        description: `在${ct.projectName}施工过程中发现${qualityIssueTypes[q % qualityIssueTypes.length]}，需立即整改。具体位置位于${ct.businessUnit}区域内第${(q % 3) + 1}施工段，影响后续${contractNames[q % contractNames.length].replace('合同', '')}施工进度。`,
        status,
        contractId: ct.id,
        contractName: ct.contractName,
        contractNo: ct.contractNo,
        contractType: ct.contractType,
        constructionUnit: ct.constructionUnit,
        supervisorUnit: supervisorUnits[q % supervisorUnits.length],
        discoverDate: `2026-0${1 + (q % 5)}-${String(1 + (q % 20)).padStart(2, '0')}`,
        photos: [],
        attachments: [
          { id: `a1_${seq}`, name: `质量问题照片_${seq}.jpg`, size: '2.4MB', type: 'image' },
          { id: `a2_${seq}`, name: `整改通知单_${seq}.pdf`, size: '1.2MB', type: 'pdf' },
        ],
        constructionDeductionScore: q % 3 === 0 ? 5 : q % 3 === 1 ? 3 : 0,
        constructionDeductionAmount: q % 3 === 0 ? 5000 : q % 3 === 1 ? 2000 : 0,
        supervisorDeductionScore: q % 4 === 0 ? 3 : 0,
        supervisorDeductionAmount: q % 4 === 0 ? 1500 : 0,
        reviewRecords: status === '整改通过' || status === '已驳回'
          ? [{
              id: `rv_${seq}`,
              result: status === '整改通过' ? '通过' : '驳回',
              reason: status === '整改通过' ? '整改措施到位，现场复查合格' : '整改不彻底，需重新整改',
              reviewer: ['王审核', '李审核', '张审核'][q % 3],
              reviewTime: `2026-0${2 + (q % 4)}-${String(20 + (q % 5)).padStart(2, '0')} 14:30:00`,
              attachments: [],
            }]
          : [],
        approvalHistory: [
          { id: `ah1_${seq}`, node: '项目经理审批', status: '已通过', approver: '项目经理A', opinion: '同意发起质量问题整改', time: `2026-0${1 + (q % 5)}-${String(2 + (q % 20)).padStart(2, '0')} 10:00:00`, color: 'green' },
          { id: `ah2_${seq}`, node: '制造部审批', status: '已通过', approver: '制造部B', opinion: '确认质量问题属实，同意下发整改', time: `2026-0${1 + (q % 5)}-${String(3 + (q % 20)).padStart(2, '0')} 09:30:00`, color: 'green' },
        ],
        rectifyRecords: [
          { id: `rr1_${seq}`, type: '发起', operator: ['张三', '李四', '王五'][q % 3], time: `2026-0${1 + (q % 5)}-${String(5 + (q % 20)).padStart(2, '0')} 08:30:00`, content: `发起${qualityIssueTypes[q % qualityIssueTypes.length]}整改，要求${ct.constructionUnit}限期整改。` },
          ...(status !== '待整改' ? [{ id: `rr2_${seq}`, type: '整改', operator: ct.constructionUnit, time: `2026-0${1 + (q % 5)}-${String(10 + (q % 15)).padStart(2, '0')} 16:00:00`, content: '已按要求完成整改，提交复查申请。' }] : []),
          ...(status === '整改通过' || status === '已驳回' ? [{ id: `rr3_${seq}`, type: '复查', operator: ['王审核', '李审核'][q % 2], time: `2026-0${2 + (q % 4)}-${String(18 + (q % 10)).padStart(2, '0')} 10:00:00`, content: status === '整改通过' ? '现场复查通过，整改合格。' : '整改不到位，驳回重新整改。' }] : []),
        ],
      });
    }

    for (let s = 0; s < safetyCount; s++) {
      const seq = String(safetySeq++).padStart(6, '0');
      const status = issueStatuses[(s + 3) % issueStatuses.length].value;
      issues.push({
        id: `si_${seq}`,
        issueNo: `AQ2026${seq}`,
        issueType: safetyIssueTypes[s % safetyIssueTypes.length],
        issueCategory: 'safety',
        initiator: ['张三', '李四', '王五', '赵六', '钱七'][s % 5],
        initiatorUnit: businessUnits[s % businessUnits.length],
        createTime: `2026-0${1 + (s % 5)}-${String(3 + (s % 20)).padStart(2, '0')} ${String(9 + (s % 3)).padStart(2, '0')}:${String(15 + (s % 30)).padStart(2, '0')}:00`,
        issueLevel: issueLevels[(s + 1) % issueLevels.length],
        deadline: `2026-0${2 + (s % 4)}-${String(12 + (s % 12)).padStart(2, '0')}`,
        description: `在${ct.projectName}施工现场发现${safetyIssueTypes[s % safetyIssueTypes.length]}，存在严重安全隐患。发生位置为${ct.businessUnit}施工区域${(s % 3) + 1}号作业面，违反《建设工程安全生产管理条例》相关规定。`,
        status,
        contractId: ct.id,
        contractName: ct.contractName,
        contractNo: ct.contractNo,
        contractType: ct.contractType,
        constructionUnit: ct.constructionUnit,
        supervisorUnit: supervisorUnits[s % supervisorUnits.length],
        discoverDate: `2026-0${1 + (s % 5)}-${String(2 + (s % 20)).padStart(2, '0')}`,
        photos: [],
        attachments: [
          { id: `sa1_${seq}`, name: `安全问题照片_${seq}.jpg`, size: '3.1MB', type: 'image' },
          { id: `sa2_${seq}`, name: `安全整改通知_${seq}.pdf`, size: '0.8MB', type: 'pdf' },
        ],
        constructionDeductionScore: s % 2 === 0 ? 10 : 5,
        constructionDeductionAmount: s % 2 === 0 ? 10000 : 5000,
        supervisorDeductionScore: s % 3 === 0 ? 5 : 0,
        supervisorDeductionAmount: s % 3 === 0 ? 3000 : 0,
        reviewRecords: status === '整改通过' || status === '已驳回'
          ? [{
              id: `srv_${seq}`,
              result: status === '整改通过' ? '通过' : '驳回',
              reason: status === '整改通过' ? '安全整改到位，现场复查合格' : '安全整改不彻底，存在遗漏',
              reviewer: ['王审核', '李审核', '张审核'][s % 3],
              reviewTime: `2026-0${2 + (s % 4)}-${String(18 + (s % 7)).padStart(2, '0')} 11:00:00`,
              attachments: [],
            }]
          : [],
        approvalHistory: [
          { id: `sah1_${seq}`, node: '项目经理审批', status: '已通过', approver: '项目经理C', opinion: '安全隐患确认，同意下发整改通知', time: `2026-0${1 + (s % 5)}-${String(3 + (s % 20)).padStart(2, '0')} 11:00:00`, color: 'green' },
          { id: `sah2_${seq}`, node: '制造部审批', status: '已通过', approver: '安全专员D', opinion: '安全问题属实，要求立即整改', time: `2026-0${1 + (s % 5)}-${String(4 + (s % 20)).padStart(2, '0')} 14:00:00`, color: 'green' },
        ],
        rectifyRecords: [
          { id: `srr1_${seq}`, type: '发起', operator: ['张三', '李四', '王五'][s % 3], time: `2026-0${1 + (s % 5)}-${String(3 + (s % 20)).padStart(2, '0')} 09:00:00`, content: `发起${safetyIssueTypes[s % safetyIssueTypes.length]}整改，要求${ct.constructionUnit}立即停工整改。` },
          ...(status !== '待整改' ? [{ id: `srr2_${seq}`, type: '整改', operator: ct.constructionUnit, time: `2026-0${1 + (s % 5)}-${String(8 + (s % 15)).padStart(2, '0')} 15:30:00`, content: '已完成安全隐患整改，恢复施工。' }] : []),
          ...(status === '整改通过' || status === '已驳回' ? [{ id: `srr3_${seq}`, type: '复查', operator: ['王审核', '李审核'][s % 2], time: `2026-0${2 + (s % 4)}-${String(16 + (s % 10)).padStart(2, '0')} 09:30:00`, content: status === '整改通过' ? '安全隐患已消除，通过复查。' : '仍有安全隐患未整改到位，驳回。' }] : []),
        ],
      });
    }
  });

  return issues;
}

export const allIssues = generateIssues();

// Compute totalDeductionScore for each contract from all issues
allIssues.forEach((issue) => {
  const ct = contracts.find((c) => c.id === issue.contractId);
  if (ct) {
    ct.totalDeductionScore += issue.constructionDeductionScore + issue.supervisorDeductionScore;
  }
});

export const standardsContent = `
## 质量安全问题管理规范

### 一、质量问题管理

#### 1. 质量问题分级标准
- **重大问题**：涉及结构安全、影响使用功能、造成重大经济损失的质量缺陷
- **较大问题**：影响局部使用功能、造成一定经济损失的质量缺陷
- **一般问题**：不影响使用功能、可通过简单整改消除的质量缺陷

#### 2. 质量问题处理流程
1. 问题发现与记录
2. 问题上报与分级
3. 整改通知下发
4. 整改实施与跟踪
5. 整改验收与复查
6. 问题关闭与归档

#### 3. 扣分标准
- 重大问题：扣10-15分，扣款5000-20000元
- 较大问题：扣5-10分，扣款2000-5000元
- 一般问题：扣1-5分，扣款500-2000元

### 二、安全问题管理

#### 1. 安全问题分级标准
- **重大隐患**：可能导致群死群伤、重大财产损失的安全隐患
- **较大隐患**：可能导致人员伤亡、较大财产损失的安全隐患
- **一般隐患**：可能导致人员轻伤、一般财产损失的安全隐患

#### 2. 安全问题处理流程
1. 隐患排查与记录
2. 隐患上报与分级
3. 整改指令下发（重大隐患立即停工）
4. 整改实施与监督
5. 整改复查与验收
6. 隐患销号与归档

#### 3. 扣分标准
- 重大隐患：扣10-20分，扣款10000-50000元
- 较大隐患：扣5-10分，扣款5000-10000元
- 一般隐患：扣1-5分，扣款1000-5000元

### 三、监理单位责任

监理单位对施工质量和安全负有监督管理责任：
- 未及时发现问题：扣1-3分
- 发现问题未督促整改：扣3-5分
- 整改验收把关不严：扣5-10分
`;