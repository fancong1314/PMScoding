export interface Participant {
  id: string;
  name: string;
  type: '监理' | '施工方' | '设计' | '其他';
  code: string;
  totalScore: number;
  contractCount: number;
  createDate: string;
}

export interface DeductionRecord {
  id: string;
  participantId: string;
  participantName: string;
  participantType: string;
  deductionCategory: '质量' | '安全' | '合同履约' | '交通安全' | '结算' | '其他';
  relatedContract: string;
  assessmentDate: string;
  reason: string;
  score: number;
  assessor: string;
  assessorDept: string;
  initiator: string;
  status: '待审批' | '已通过' | '已驳回' | '已撤销';
  attachments: { id: string; name: string; size: string; type: string }[];
  approvalHistory: {
    id: string;
    node: string;
    approver: string;
    opinion: string;
    time: string;
    status: string;
    color: string;
  }[];
}

export const participantTypes = [
  { value: '监理', label: '监理' },
  { value: '施工方', label: '施工方' },
  { value: '设计', label: '设计' },
  { value: '其他', label: '其他' },
];

export const deductionCategories = [
  { value: '质量', label: '质量' },
  { value: '安全', label: '安全' },
  { value: '合同履约', label: '合同履约' },
  { value: '交通安全', label: '交通安全' },
  { value: '结算', label: '结算' },
  { value: '其他', label: '其他' },
];

export const deductionStatuses = [
  { value: '待审批', label: '待审批', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { value: '已通过', label: '已通过', color: 'bg-green-50 text-green-700 border border-green-200' },
  { value: '已驳回', label: '已驳回', color: 'bg-red-50 text-red-700 border border-red-200' },
  { value: '已撤销', label: '已撤销', color: 'bg-slate-100 text-slate-500' },
];

const participantNames = [
  '上海宝钢监理有限公司',
  '中冶天工集团有限公司',
  '上海宝冶集团有限公司',
  '中冶赛迪工程技术股份有限公司',
  '江苏省建筑设计研究院',
  '中国二十冶集团有限公司',
  '南京钢铁集团工程有限公司',
  '中冶京诚工程技术有限公司',
  '江苏南通三建集团股份有限公司',
  '江苏省工程监理有限公司',
  '中咨工程建设监理有限公司',
  '中冶南方工程技术有限公司',
  '中国五冶集团有限公司',
  '江苏省建工集团有限公司',
  '上海工程勘察设计有限公司',
  '南京理工大学设计研究院',
  '江苏省地质工程勘察院',
  '南京测绘勘察研究院',
  '中冶设备监理有限公司',
  '东南大学建筑设计研究院',
];

export const participants: Participant[] = Array.from({ length: 20 }, (_, i) => {
  const type = (['监理', '施工方', '设计', '其他'] as const)[i % 4];
  const totalScore = [15, 22, 8, 35, 12, 28, 6, 18, 25, 10, 42, 14, 7, 30, 19, 5, 38, 11, 16, 9][i];
  return {
    id: `pt_${i + 1}`,
    name: participantNames[i],
    type,
    code: `CJF-${type === '监理' ? 'JL' : type === '施工方' ? 'SG' : type === '设计' ? 'SJ' : 'QT'}-${String(1000 + i).padStart(4, '0')}`,
    totalScore,
    contractCount: 2 + (i % 8),
    createDate: `2025-0${1 + (i % 6)}-${String(1 + (i % 28)).padStart(2, '0')}`,
  };
});

const deductionReasons = [
  '施工过程中发现混凝土强度不符合设计要求',
  '高处作业未按规范佩戴安全防护用品',
  '合同约定的关键节点未按期完成',
  '施工现场运输车辆未按规定路线行驶',
  '结算资料提交不完整，缺少工程签证单',
  '隐蔽工程未报验擅自覆盖',
  '脚手架搭设不符合安全规范要求',
  '设计图纸与实际施工不符未及时变更',
  '施工现场材料堆放混乱影响通行',
  '未按规定进行安全技术交底',
  '监理旁站记录不完整，缺少关键工序记录',
  '施工现场消防器材配备不足',
  '工程变更未及时办理审批手续',
  '施工人员未持证上岗作业',
  '施工噪声超标影响周边环境',
  '材料进场未进行报验和复试',
  '特种作业人员证件过期未及时更新',
  '施工临时用电线路私拉乱接',
  '深基坑支护方案未按专家论证意见修改',
  '竣工验收资料不齐全',
];

const relatedContracts = [
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

export const deductionRecords: DeductionRecord[] = Array.from({ length: 60 }, (_, i) => {
  const participant = participants[i % participants.length];
  const category = deductionCategories[i % deductionCategories.length].value as DeductionRecord['deductionCategory'];
  const status = (['待审批', '已通过', '已驳回', '已撤销'] as const)[i % 4];
  const seq = String(i + 1).padStart(6, '0');
  return {
    id: `dr_${seq}`,
    participantId: participant.id,
    participantName: participant.name,
    participantType: participant.type,
    deductionCategory: category,
    relatedContract: relatedContracts[i % relatedContracts.length],
    assessmentDate: `2026-0${1 + (i % 5)}-${String(1 + (i % 28)).padStart(2, '0')}`,
    reason: deductionReasons[i % deductionReasons.length],
    score: 2 + (i % 15),
    assessor: ['王审核', '李考核', '张检查', '赵监察', '钱评估'][i % 5],
    assessorDept: ['质量安全部', '工程管理部', '安全环保部', '合同管理部', '基建部'][i % 5],
    initiator: '管理员',
    status,
    attachments: i % 3 === 0 ? [
      { id: `att_${seq}_1`, name: `扣分依据_${seq}.pdf`, size: '1.5MB', type: 'pdf' },
    ] : [],
    approvalHistory: status !== '待审批' ? [
      {
        id: `ah_${seq}_1`,
        node: '项目经理审批',
        approver: '项目经理A',
        opinion: status === '已通过' ? '同意扣分处理' : status === '已驳回' ? '扣分依据不充分，驳回' : '撤销审批',
        time: `2026-0${1 + (i % 5)}-${String(5 + (i % 20)).padStart(2, '0')} 10:30:00`,
        status: status === '已通过' ? '已通过' : status === '已驳回' ? '已驳回' : '已撤销',
        color: status === '已通过' ? 'green' : status === '已驳回' ? 'red' : 'gray',
      },
      {
        id: `ah_${seq}_2`,
        node: '制造部审批',
        approver: '制造部B',
        opinion: status === '已通过' ? '确认扣分处理' : status === '已驳回' ? '退回补充材料' : '撤销',
        time: `2026-0${1 + (i % 5)}-${String(7 + (i % 20)).padStart(2, '0')} 14:00:00`,
        status: status === '已通过' ? '已通过' : status === '已驳回' ? '已驳回' : '已撤销',
        color: status === '已通过' ? 'green' : status === '已驳回' ? 'red' : 'gray',
      },
    ] : [],
  };
});

export const availableContracts = [
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

export const availableHandlers = [
  { id: 'h1', name: '王审核', dept: '质量安全部' },
  { id: 'h2', name: '李考核', dept: '工程管理部' },
  { id: 'h3', name: '张检查', dept: '安全环保部' },
  { id: 'h4', name: '赵监察', dept: '合同管理部' },
  { id: 'h5', name: '钱评估', dept: '基建部' },
  { id: 'h6', name: '孙监管', dept: '生产部' },
  { id: 'h7', name: '周审查', dept: '设备管理部' },
  { id: 'h8', name: '吴督查', dept: '技术部' },
  { id: 'h9', name: '郑核验', dept: '财务部' },
  { id: 'h10', name: '冯审核', dept: '人力资源部' },
];

/* ---------- Dangerous Work ---------- */

export interface DangerousWork {
  id: string;
  certificateNo: string;
  certificateType: string;
  workLevel: string;
  workContent: string;
  workUnit: string;
  productionPlant: string;
  startTime: string;
  endTime: string;
  status: string;
  category: '施工' | '检修';
  businessUnit: string;
  department: string;
  projectName: string;
  hazardSource: string;
  detail: {
    applicant: string;
    applyDate: string;
    workLocation: string;
    safetyMeasures: string;
    supervisor: string;
    guardian: string;
    riskAnalysis: string;
    emergencyPlan: string;
  };
}

const certificateTypes = [
  '动火作业许可证',
  '高处作业许可证',
  '受限空间作业许可证',
  '吊装作业许可证',
  '临时用电许可证',
  '动土作业许可证',
  '断路作业许可证',
  '盲板抽堵作业许可证',
];

const workLevels = ['特级', '一级', '二级', '三级'];

const workContents = [
  '高炉区域设备检修动火作业',
  '转炉平台高处防腐涂装作业',
  '煤气柜受限空间检修作业',
  '连铸机大包回转台吊装作业',
  '轧钢车间临时用电线路敷设',
  '原料场地基开挖动土作业',
  '厂区内道路封闭断路作业',
  '管道系统盲板抽堵作业',
  '加热炉区域检修动火作业',
  '冷却塔高处维护作业',
  '脱硫塔受限空间检查作业',
  '行车大梁吊装更换作业',
  '配电室临时用电接入作业',
  '污水处理池动土扩建作业',
  '主厂区道路断路翻修作业',
];

const workUnits = [
  '中冶天工集团',
  '上海宝冶集团',
  '中国二十冶集团',
  '中冶赛迪工程技术',
  '南京钢铁集团工程',
  '江苏省建工集团',
  '江苏南通三建集团',
  '中国五冶集团',
];

const productionPlants = [
  '炼铁厂',
  '炼钢厂',
  '轧钢厂',
  '能源中心',
  '原料厂',
  '焦化厂',
  '烧结厂',
  '动力厂',
  '氧气厂',
  '污水处理厂',
];

export const dangerousWorks: DangerousWork[] = Array.from({ length: 30 }, (_, i) => {
  const seq = String(i + 1).padStart(5, '0');
  const category = (['施工', '检修'] as const)[i % 2];
  const projectNames = [
    '1号高炉大修工程', '2号转炉改造工程', '中厚板轧线智能升级',
    '烟气脱硫脱硝改造项目', '原料场封闭改造项目', '焦化厂煤气脱硫脱氰装置改造',
    '第三炼钢厂连铸机结晶器振动系统升级', '科技质量基础新型高效净化水系统建设',
    '轧钢产线自动化控制系统改造', '特殊钢智能运矿人员管理系统升级',
  ];
  const hazardSources = [
    '高温熔融金属喷溅', '高处坠落（作业高度>15m）', '受限空间有毒有害气体积聚',
    '大型构件吊装失稳', '临时用电触电风险', '基坑边坡坍塌',
    '道路封闭车辆伤害', '管道内高压介质泄漏', '加热炉区域高温灼伤',
    '冷却塔结构老化坠落', '脱硫塔内硫化氢中毒', '行车钢丝绳断裂风险',
    '配电室电弧灼伤', '污水池有毒气体释放', '主厂区交叉作业车辆碰撞',
  ];
  return {
    id: `dw_${seq}`,
    certificateNo: `ZY-${2026}-${seq}`,
    certificateType: certificateTypes[i % certificateTypes.length],
    workLevel: workLevels[i % workLevels.length],
    workContent: workContents[i % workContents.length],
    workUnit: workUnits[i % workUnits.length],
    productionPlant: productionPlants[i % productionPlants.length],
    startTime: `2026-0${1 + (i % 5)}-${String(5 + (i % 20)).padStart(2, '0')} 08:00:00`,
    endTime: `2026-0${1 + (i % 5)}-${String(10 + (i % 20)).padStart(2, '0')} 18:00:00`,
    status: ['进行中', '已完成', '已取消'][i % 3],
    category,
    businessUnit: ['炼铁事业部', '炼钢事业部', '轧钢事业部', '能源事业部', '设备管理部'][i % 5],
    department: productionPlants[i % productionPlants.length],
    projectName: projectNames[i % projectNames.length],
    hazardSource: hazardSources[i % hazardSources.length],
    detail: {
      applicant: ['张三', '李四', '王五', '赵六'][i % 4],
      applyDate: `2026-0${1 + (i % 5)}-${String(1 + (i % 3)).padStart(2, '0')}`,
      workLocation: `${productionPlants[i % productionPlants.length]}第${(i % 3) + 1}作业区`,
      safetyMeasures: '配备消防器材、设置警戒区域、配备应急救援设备、安排专人监护',
      supervisor: ['李监理', '张监理'][i % 2],
      guardian: ['王监护', '赵监护'][i % 2],
      riskAnalysis: '作业区域存在高温、高压、有毒有害气体等风险，已制定专项安全措施',
      emergencyPlan: '配备应急药品、设置应急集合点、明确撤离路线、配备通讯设备',
    },
  };
});

export const dangerousWorkBusinessUnits = [
  '炼铁事业部',
  '炼钢事业部',
  '轧钢事业部',
  '能源事业部',
  '设备管理部',
  '安全环保部',
  '基建部',
];

export const dangerousWorkDepartments = [
  '炼铁厂',
  '炼钢厂',
  '轧钢厂',
  '能源中心',
  '原料厂',
  '焦化厂',
  '烧结厂',
  '动力厂',
  '氧气厂',
  '污水处理厂',
];

/* ========== 施工考勤管理 ========== */
export interface AttendanceRecord {
  id: number;
  department: string;
  ownerUnit: string;
  contractNo: string;
  contractName: string;
  date: string;
  personName: string;
  checkInTime: string;
}

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 1, department: '炼铁事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-JS-2024-001', contractName: '1号高炉大修工程', date: '2026-06-22', personName: '张建国', checkInTime: '07:32:15' },
  { id: 2, department: '炼铁事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-JS-2024-001', contractName: '1号高炉大修工程', date: '2026-06-22', personName: '李志强', checkInTime: '07:28:40' },
  { id: 3, department: '炼铁事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-JS-2024-001', contractName: '1号高炉大修工程', date: '2026-06-22', personName: '王明辉', checkInTime: '07:45:03' },
  { id: 4, department: '炼铁事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-JS-2024-001', contractName: '1号高炉大修工程', date: '2026-06-22', personName: '赵永刚', checkInTime: '08:01:22' },
  { id: 5, department: '炼铁事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-JS-2024-001', contractName: '1号高炉大修工程', date: '2026-06-22', personName: '陈建华', checkInTime: '07:55:18' },
  { id: 6, department: '炼钢事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-JS-2024-008', contractName: '2号转炉改造工程', date: '2026-06-22', personName: '刘伟', checkInTime: '07:30:45' },
  { id: 7, department: '炼钢事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-JS-2024-008', contractName: '2号转炉改造工程', date: '2026-06-22', personName: '孙志明', checkInTime: '07:35:12' },
  { id: 8, department: '炼钢事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-JS-2024-008', contractName: '2号转炉改造工程', date: '2026-06-22', personName: '周文博', checkInTime: '08:10:30' },
  { id: 9, department: '轧钢事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-ZG-2024-015', contractName: '中厚板轧线智能升级', date: '2026-06-22', personName: '吴海峰', checkInTime: '07:20:05' },
  { id: 10, department: '轧钢事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-ZG-2024-015', contractName: '中厚板轧线智能升级', date: '2026-06-22', personName: '黄建平', checkInTime: '07:25:37' },
  { id: 11, department: '轧钢事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-ZG-2024-015', contractName: '中厚板轧线智能升级', date: '2026-06-22', personName: '许国栋', checkInTime: '07:48:51' },
  { id: 12, department: '轧钢事业部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-ZG-2024-015', contractName: '中厚板轧线智能升级', date: '2026-06-22', personName: '冯明远', checkInTime: '08:05:19' },
  { id: 13, department: '能源环保部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-NY-2024-022', contractName: '烟气脱硫脱硝改造项目', date: '2026-06-22', personName: '曹国强', checkInTime: '07:15:28' },
  { id: 14, department: '能源环保部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-NY-2024-022', contractName: '烟气脱硫脱硝改造项目', date: '2026-06-22', personName: '沈志远', checkInTime: '07:22:14' },
  { id: 15, department: '能源环保部', ownerUnit: '南京钢铁股份有限公司', contractNo: 'NG-NY-2024-022', contractName: '烟气脱硫脱硝改造项目', date: '2026-06-22', personName: '韩建国', checkInTime: '07:55:42' },
];

export const attendanceDepartments = ['炼铁事业部', '炼钢事业部', '轧钢事业部', '能源环保部', '物流中心', '制造部'];

/* ========== 施工视频监控 ========== */
export interface CameraInfo {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'weak';
  thumbnailSeq: string;
  imageUrl: string;
}

export interface MonitorContract {
  id: number;
  contractNo: string;
  contractName: string;
  totalCameras: number;
  onlineCount: number;
  offlineCount: number;
  cameras: CameraInfo[];
}

export const mockMonitorContracts: MonitorContract[] = [
  {
    id: 1,
    contractNo: 'NG-JS-2024-001',
    contractName: '1号高炉大修工程',
    totalCameras: 8,
    onlineCount: 7,
    offlineCount: 1,
    cameras: [
      { id: 1, name: '高炉本体施工区-1号', status: 'online', thumbnailSeq: 'camera-01', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20blast%20furnace%20steel%20plant%20heavy%20industrial%20machinery%20workers%20in%20safety%20helmets%20steel%20structures%20daylight%20clear%20view%20professional%20monitoring%20angle%20grainy%20security%20camera%20aesthetic&width=1600&height=900&seq=surv-cam-01&orientation=landscape' },
      { id: 2, name: '热风炉施工区', status: 'online', thumbnailSeq: 'camera-02', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20hot%20blast%20stove%20installation%20steel%20mill%20industrial%20pipes%20scaffolding%20workers%20orange%20safety%20vests%20heavy%20equipment%20outdoor%20monitoring%20security%20camera%20perspective&width=1600&height=900&seq=surv-cam-02&orientation=landscape' },
      { id: 3, name: '出铁场施工区', status: 'online', thumbnailSeq: 'camera-03', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20iron%20tapping%20area%20steel%20plant%20molten%20metal%20machinery%20workers%20protective%20gear%20industrial%20scene%20overhead%20monitoring%20camera%20angle%20dusty%20atmosphere&width=1600&height=900&seq=surv-cam-03&orientation=landscape' },
      { id: 4, name: '原料系统施工区', status: 'online', thumbnailSeq: 'camera-04', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20raw%20material%20handling%20system%20conveyor%20belts%20steel%20plant%20outdoor%20storage%20yard%20workers%20safety%20helmets%20heavy%20industrial%20monitoring%20security%20camera&width=1600&height=900&seq=surv-cam-04&orientation=landscape' },
      { id: 5, name: '除尘系统施工区', status: 'online', thumbnailSeq: 'camera-05', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20dust%20collection%20system%20installation%20steel%20mill%20large%20ductwork%20filters%20industrial%20equipment%20workers%20safety%20vests%20outdoor%20monitoring%20camera%20angle&width=1600&height=900&seq=surv-cam-05&orientation=landscape' },
      { id: 6, name: '喷煤系统施工区', status: 'online', thumbnailSeq: 'camera-06', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20coal%20injection%20system%20steel%20plant%20industrial%20piping%20tanks%20workers%20hard%20hats%20heavy%20machinery%20outdoor%20industrial%20installation%20security%20camera%20monitoring&width=1600&height=900&seq=surv-cam-06&orientation=landscape' },
      { id: 7, name: '炉顶设备安装区', status: 'online', thumbnailSeq: 'camera-07', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20furnace%20top%20equipment%20installation%20steel%20plant%20elevated%20platform%20crane%20workers%20safety%20harness%20industrial%20steel%20structure%20monitoring%20camera%20overhead%20angle&width=1600&height=900&seq=surv-cam-07&orientation=landscape' },
      { id: 8, name: '循环水系统施工区', status: 'offline', thumbnailSeq: 'camera-08', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20cooling%20water%20system%20installation%20steel%20mill%20pipes%20pumps%20tanks%20workers%20orange%20vests%20industrial%20outdoor%20scene%20security%20monitoring%20no%20signal%20overlay&width=1600&height=900&seq=surv-cam-08&orientation=landscape' },
    ],
  },
  {
    id: 2,
    contractNo: 'NG-JS-2024-008',
    contractName: '2号转炉改造工程',
    totalCameras: 6,
    onlineCount: 5,
    offlineCount: 1,
    cameras: [
      { id: 1, name: '转炉本体施工区', status: 'online', thumbnailSeq: 'camera-09', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20converter%20furnace%20steelmaking%20plant%20molten%20steel%20heavy%20industrial%20workers%20protective%20suits%20large%20vessel%20indoor%20factory%20monitoring%20camera%20angle&width=1600&height=900&seq=surv-cam-09&orientation=landscape' },
      { id: 2, name: '连铸机施工区', status: 'online', thumbnailSeq: 'camera-10', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20continuous%20casting%20machine%20steel%20mill%20rollers%20cooling%20spray%20workers%20safety%20gear%20industrial%20production%20line%20indoor%20monitoring%20security%20camera&width=1600&height=900&seq=surv-cam-10&orientation=landscape' },
      { id: 3, name: '精炼炉施工区', status: 'online', thumbnailSeq: 'camera-11', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20refining%20furnace%20ladle%20steel%20plant%20electrodes%20workers%20hard%20hats%20industrial%20equipment%20indoor%20factory%20monitoring%20camera%20production%20scene&width=1600&height=900&seq=surv-cam-11&orientation=landscape' },
      { id: 4, name: '除尘系统施工区', status: 'online', thumbnailSeq: 'camera-12', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20dust%20removal%20system%20steelmaking%20plant%20baghouse%20filters%20ductwork%20workers%20safety%20vests%20industrial%20outdoor%20installation%20monitoring%20security%20camera&width=1600&height=900&seq=surv-cam-12&orientation=landscape' },
      { id: 5, name: '上料系统施工区', status: 'weak', thumbnailSeq: 'camera-13', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20charging%20system%20conveyor%20steel%20plant%20raw%20materials%20workers%20safety%20helmets%20outdoor%20industrial%20scene%20weak%20signal%20static%20noise%20monitoring&width=1600&height=900&seq=surv-cam-13&orientation=landscape' },
      { id: 6, name: '水处理施工区', status: 'offline', thumbnailSeq: 'camera-14', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20water%20treatment%20facility%20steel%20mill%20tanks%20pipes%20pumps%20workers%20orange%20vests%20industrial%20outdoor%20scene%20no%20signal%20dark%20overlay%20monitoring&width=1600&height=900&seq=surv-cam-14&orientation=landscape' },
    ],
  },
  {
    id: 3,
    contractNo: 'NG-ZG-2024-015',
    contractName: '中厚板轧线智能升级',
    totalCameras: 5,
    onlineCount: 5,
    offlineCount: 0,
    cameras: [
      { id: 1, name: '轧机区施工监控', status: 'online', thumbnailSeq: 'camera-15', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20rolling%20mill%20steel%20plate%20production%20line%20heavy%20rollers%20workers%20safety%20gear%20industrial%20factory%20indoor%20monitoring%20camera%20angle%20warm%20metal%20glow&width=1600&height=900&seq=surv-cam-15&orientation=landscape' },
      { id: 2, name: '加热炉施工区', status: 'online', thumbnailSeq: 'camera-16', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20reheating%20furnace%20steel%20plant%20hot%20metal%20slabs%20workers%20protective%20suits%20orange%20glow%20industrial%20heavy%20machinery%20monitoring%20security%20camera&width=1600&height=900&seq=surv-cam-16&orientation=landscape' },
      { id: 3, name: '矫直机施工区', status: 'online', thumbnailSeq: 'camera-17', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20straightening%20machine%20steel%20plate%20mill%20rollers%20workers%20hard%20hats%20industrial%20production%20line%20indoor%20factory%20monitoring%20camera%20steel%20processing&width=1600&height=900&seq=surv-cam-17&orientation=landscape' },
      { id: 4, name: '冷床区施工监控', status: 'online', thumbnailSeq: 'camera-18', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20cooling%20bed%20area%20steel%20plate%20mill%20metal%20sheets%20workers%20safety%20vests%20industrial%20indoor%20factory%20large%20hall%20monitoring%20security%20camera&width=1600&height=900&seq=surv-cam-18&orientation=landscape' },
      { id: 5, name: '精整线施工监控', status: 'online', thumbnailSeq: 'camera-19', imageUrl: 'https://readdy.ai/api/search-image?query=Construction%20site%20surveillance%20camera%20view%20of%20finishing%20line%20steel%20plate%20mill%20inspection%20area%20workers%20helmets%20industrial%20machinery%20indoor%20factory%20bright%20lighting%20monitoring%20security%20camera&width=1600&height=900&seq=surv-cam-19&orientation=landscape' },
    ],
  },
];