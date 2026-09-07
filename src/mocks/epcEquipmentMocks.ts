export interface EpcContract {
  id: string;
  contractNo: string;
  contractName: string;
  totalDevices: number;
  supervisorPassed: number;
  supervisorRejected: number;
  clientPassed: number;
  clientRejected: number;
  clientPending: number;
  status: string;
}

export interface EpcDevice {
  id: string;
  contractId: string;
  name: string;
  unit: string;
  brand: string;
  quantity: number;
  singleWeight: string;
  spec: string;
  supervisorSatisfied: string;
  supervisorDeviation: string;
  supervisorTime: string;
  supervisorPerson: string;
  supervisorAttachment: string;
  supervisorStatus: 'passed' | 'rejected' | 'pending';
  supervisorOpinion: string;
  clientSatisfied: string;
  clientDeviation: string;
  clientTime: string;
  clientPerson: string;
  clientAttachment: string;
  clientStatus: 'passed' | 'rejected' | 'pending';
  clientOpinion: string;
}

export const epcContracts: EpcContract[] = [
  {
    id: 'epc-001', contractNo: 'NG-EPC-2024-001',
    contractName: '中厚板厂热处理炉EPC总承包合同',
    totalDevices: 24, supervisorPassed: 20, supervisorRejected: 2,
    clientPassed: 15, clientRejected: 2, clientPending: 7,
    status: '审核中',
  },
  {
    id: 'epc-002', contractNo: 'NG-EPC-2024-002',
    contractName: '焦化厂干熄焦EPC总承包合同',
    totalDevices: 32, supervisorPassed: 28, supervisorRejected: 3,
    clientPassed: 18, clientRejected: 3, clientPending: 11,
    status: '审核中',
  },
  {
    id: 'epc-003', contractNo: 'NG-EPC-2024-003',
    contractName: '炼钢厂连铸板坯改造EPC合同',
    totalDevices: 18, supervisorPassed: 18, supervisorRejected: 0,
    clientPassed: 16, clientRejected: 0, clientPending: 2,
    status: '审核中',
  },
  {
    id: 'epc-004', contractNo: 'NG-EPC-2024-004',
    contractName: '宽厚板厂双边剪更新EPC合同',
    totalDevices: 15, supervisorPassed: 14, supervisorRejected: 1,
    clientPassed: 12, clientRejected: 1, clientPending: 2,
    status: '审核中',
  },
  {
    id: 'epc-005', contractNo: 'NG-EPC-2024-005',
    contractName: '第一炼钢厂RH精炼炉EPC合同',
    totalDevices: 26, supervisorPassed: 22, supervisorRejected: 2,
    clientPassed: 20, clientRejected: 1, clientPending: 5,
    status: '审核中',
  },
  {
    id: 'epc-006', contractNo: 'NG-EPC-2024-006',
    contractName: '炼铁厂2#高炉喷煤系统EPC合同',
    totalDevices: 20, supervisorPassed: 19, supervisorRejected: 1,
    clientPassed: 19, clientRejected: 0, clientPending: 1,
    status: '审核中',
  },
];

function makeDevices(contractId: string, deviceNames: string[]): EpcDevice[] {
  const brands = ['德国SMS', '日本三菱重工', '西门子', 'ABB', '大连重工', '中信重工', '中国一重', '太原重工', 'Siemens', 'GE'];
  const supervisors = ['王监理', '赵监理', '钱监理', '陈监理', '周监理', '刘监理'];
  const clients = ['张涛', '王建国', '李明', '施海峰', '宋宁岐', '马超'];
  
  return deviceNames.map((name, idx) => {
    const supervisorPassed = idx % 9 !== 8;
    const clientPassed = supervisorPassed && idx % 7 !== 6;
    const clientDone = idx % 5 !== 4;
    
    return {
      id: `${contractId}-dev-${String(idx + 1).padStart(2, '0')}`,
      contractId,
      name,
      unit: ['台', '套', '组', '座'][idx % 4],
      brand: brands[idx % brands.length],
      quantity: [1, 2, 1, 3, 1, 2, 1, 1][idx % 8],
      singleWeight: `${(Math.random() * 50 + 0.5).toFixed(1)}t`,
      spec: `型号-${String.fromCharCode(65 + idx)}${2020 + (idx % 5)}-${100 + idx}`,
      supervisorSatisfied: supervisorPassed ? '满足' : '不满足',
      supervisorDeviation: supervisorPassed ? '' : `尺寸偏差${idx + 1}mm，需返厂修复`,
      supervisorTime: supervisorPassed ? `2025-0${1 + (idx % 6)}-${String(10 + (idx % 20)).padStart(2, '0')} 14:30:00` : `2025-0${1 + (idx % 6)}-${String(10 + (idx % 20)).padStart(2, '0')} 10:00:00`,
      supervisorPerson: supervisors[idx % supervisors.length],
      supervisorAttachment: supervisorPassed ? `设备验收报告-${name}.pdf` : `设备问题报告-${name}.pdf`,
      supervisorStatus: supervisorPassed ? 'passed' : 'rejected',
      supervisorOpinion: supervisorPassed ? `设备${name}经监理现场验收，各项技术参数符合设计要求，验收通过。` : `设备${name}存在${idx + 1}mm尺寸偏差，不符合设计要求，需返厂修复后重新验收。`,
      clientSatisfied: clientDone ? (clientPassed ? '满足' : '不满足') : '',
      clientDeviation: clientDone ? (clientPassed ? '' : `技术参数偏离设计标准${idx + 2}%`) : '',
      clientTime: clientDone ? `2025-0${1 + (idx % 6)}-${String(18 + (idx % 12)).padStart(2, '0')} ${idx % 2 === 0 ? '09' : '15'}:00:00` : '',
      clientPerson: clientDone ? clients[idx % clients.length] : '',
      clientAttachment: clientDone ? `甲方审批记录-${name}.pdf` : '',
      clientStatus: clientDone ? (clientPassed ? 'passed' : 'rejected') : 'pending',
      clientOpinion: clientDone ? (clientPassed ? `设备${name}经甲方复核，监理验收结论准确，同意通过审批。` : `设备${name}经复核，${idx + 2}%的技术参数偏离设计标准，需进一步确认，驳回重新申报。`) : '',
    };
  });
}

const epc001Devices = makeDevices('epc-001', [
  '热处理炉本体', '燃烧控制系统', '炉辊输送装置', '淬火装置', '回火炉', '冷却系统', '炉门升降机构', '助燃风机',
  '烟气余热回收装置', '电气控制系统', 'PLC自动化系统', '炉温监测系统', '液压泵站', '进料辊道', '出料辊道',
  '氮气保护系统', '测温热电偶', '水冷循环泵', '烟气除尘装置', '钢坯对中装置', '炉体钢结构', '耐火纤维模块',
  '燃气调压站', '安全联锁装置',
]);

const epc002Devices = makeDevices('epc-002', [
  '干熄炉本体', '余热锅炉', '提升机', '装入装置', '排出装置', '一次除尘器', '二次除尘器', '循环风机',
  '锅炉给水泵', '除氧器', '汽轮机发电机组', '循环冷却塔', '制氮装置', '焦炭输送皮带', '振动给料器',
  '旋转密封阀', '空气导入阀', '焦粉收集系统', '环境除尘系统', '自动化控制系统', 'DCS集散控制系统', '在线监测系统',
  '气体分析仪', '温度压力传感器', '电气配电柜', '变频调速装置', '焦炭缓冲仓', '焦炭筛分装置', '斗式提升机备件',
  '耐火材料砌筑', '炉盖水封装置', '锅炉排污系统',
]);

const epc003Devices = makeDevices('epc-003', [
  '连铸机结晶器', '扇形段', '拉矫机', '切割机', '引锭杆', '中间罐车', '钢包回转台', '结晶器振动装置',
  '二次冷却系统', '液压系统', '润滑系统', '电气传动系统', '基础自动化系统', '过程控制系统', '结晶器液面控制系统',
  '电磁搅拌装置', '喷淋集管', '冷床辊道',
]);

const epc004Devices = makeDevices('epc-004', [
  '双边剪主机', '剪刃更换装置', '液压系统', '电气控制系统', '钢板对中装置', '入口辊道', '出口辊道',
  '废料输送系统', '润滑泵站', '冷却水系统', '剪切力传感器', '变频传动系统', 'PLC控制系统', '钢屑收集装置',
  '安全防护罩',
]);

const epc005Devices = makeDevices('epc-005', [
  'RH真空槽', '真空泵系统', '氧枪装置', '合金加料系统', '钢包车', '烘烤装置', '真空管道系统',
  '冷却水系统', '液压系统', '电气控制系统', '过程自动化系统', '测温取样装置', '除尘系统', '氩气底吹系统',
  '喷补装置', '真空料斗', '蒸汽喷射泵', '冷凝器', '废气处理系统', '在线监测系统', 'PLC柜', '操作台',
  '钢包升降装置', '真空盖车', '合金料仓', '称量装置',
]);

const epc006Devices = makeDevices('epc-006', [
  '制粉系统磨机', '热风炉', '收粉布袋除尘器', '煤粉仓', '喷吹罐组', '分配器', '喷煤枪',
  '氮气加压系统', '消防系统', '自动化控制系统', '温度监测系统', '氧含量分析仪', '防爆阀门', '锁气装置',
  '输送风机', '称重给料机', '煤粉振动筛', '煤粉干燥系统', '压缩空气系统', '煤粉浓度检测仪',
]);

export const allEpcDevices: EpcDevice[] = [
  ...epc001Devices, ...epc002Devices, ...epc003Devices,
  ...epc004Devices, ...epc005Devices, ...epc006Devices,
];

export function getEpcContractById(id: string): EpcContract | undefined {
  return epcContracts.find((c) => c.id === id);
}

export function getEpcDevicesByContractId(contractId: string): EpcDevice[] {
  return allEpcDevices.filter((d) => d.contractId === contractId);
}

export function getEpcDeviceById(id: string): EpcDevice | undefined {
  return allEpcDevices.find((d) => d.id === id);
}

export function getSupervisorPassedDevices(contractId: string): EpcDevice[] {
  return allEpcDevices.filter((d) => d.contractId === contractId && d.supervisorStatus === 'passed');
}

export function getEpcDevicesForReview(contractId: string): EpcDevice[] {
  return allEpcDevices.filter((d) => d.contractId === contractId && d.supervisorStatus === 'passed');
}