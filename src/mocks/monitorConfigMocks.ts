// 合同监控配置 Mock 数据

export interface MonitorContract {
  id: string;
  contractNo: string;
  contractName: string;
  projectNo: string;
  projectName: string;
  businessUnit: string;
  ownerUnit: string;
  associatedDeviceCount: number;
  onlineDeviceCount: number;
  offlineDeviceCount: number;
  configStatus: string; // 已配置 / 未配置 / 配置异常
}

export interface HikvisionDevice {
  id: string;
  deviceName: string;
  serialNo: string;
  installLocation: string;
  deviceType: string; // 球机 / 枪机 / 半球 / 其他
  channelNo: string;
  onlineStatus: string; // 在线 / 离线
  streamUrl: string;
  testResult: string; // 通过 / 未测通 / 未测 / 信号弱
  region: string;
  sortOrder?: number;
  associatedContracts?: string[]; // 已关联的合同编号
}

export const monitorContracts: MonitorContract[] = [
  {
    id: 'mc-001',
    contractNo: 'NG-HT-2025-0389',
    contractName: '智慧供应链平台软件开发合同',
    projectNo: 'NG-2025-XM-0012',
    projectName: '智慧供应链协同管理平台',
    businessUnit: '智能制造事业部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 8,
    onlineDeviceCount: 7,
    offlineDeviceCount: 1,
    configStatus: '已配置',
  },
  {
    id: 'mc-002',
    contractNo: 'NG-HT-2025-0456',
    contractName: 'MES系统升级开发合同',
    projectNo: 'NG-2025-XM-0018',
    projectName: '智能制造执行系统(MES)升级',
    businessUnit: '炼钢事业部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 12,
    onlineDeviceCount: 10,
    offlineDeviceCount: 2,
    configStatus: '已配置',
  },
  {
    id: 'mc-003',
    contractNo: 'NG-HT-2025-0512',
    contractName: '数据治理平台软件开发合同',
    projectNo: 'NG-2025-XM-0022',
    projectName: '数据治理及大数据分析平台',
    businessUnit: '信息技术部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 0,
    onlineDeviceCount: 0,
    offlineDeviceCount: 0,
    configStatus: '未配置',
  },
  {
    id: 'mc-004',
    contractNo: 'NG-HT-2025-0530',
    contractName: 'ERP系统优化开发合同',
    projectNo: 'NG-2025-XM-0025',
    projectName: '企业资源计划(ERP)优化',
    businessUnit: '运营管理部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 5,
    onlineDeviceCount: 3,
    offlineDeviceCount: 2,
    configStatus: '配置异常',
  },
  {
    id: 'mc-005',
    contractNo: 'NG-HT-2025-0580',
    contractName: '标识解析平台开发合同',
    projectNo: 'NG-2025-XM-0030',
    projectName: '工业互联网标识解析二级节点',
    businessUnit: '智能制造事业部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 6,
    onlineDeviceCount: 6,
    offlineDeviceCount: 0,
    configStatus: '已配置',
  },
  {
    id: 'mc-006',
    contractNo: 'NG-HT-2025-0600',
    contractName: '安全信息化平台开发合同',
    projectNo: 'NG-2025-XM-0033',
    projectName: '安全生产信息化管理平台',
    businessUnit: '安全环保部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 0,
    onlineDeviceCount: 0,
    offlineDeviceCount: 0,
    configStatus: '未配置',
  },
  {
    id: 'mc-007',
    contractNo: 'NG-HT-2025-0421',
    contractName: '供应链硬件集成及部署合同',
    projectNo: 'NG-2025-XM-0012',
    projectName: '智慧供应链协同管理平台',
    businessUnit: '智能制造事业部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 4,
    onlineDeviceCount: 4,
    offlineDeviceCount: 0,
    configStatus: '已配置',
  },
  {
    id: 'mc-008',
    contractNo: 'NG-HT-2025-0488',
    contractName: 'MES系统测试及培训服务合同',
    projectNo: 'NG-2025-XM-0018',
    projectName: '智能制造执行系统(MES)升级',
    businessUnit: '炼钢事业部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 3,
    onlineDeviceCount: 2,
    offlineDeviceCount: 1,
    configStatus: '配置异常',
  },
  {
    id: 'mc-009',
    contractNo: 'NG-HT-2025-0555',
    contractName: 'ERP用户培训及运维服务合同',
    projectNo: 'NG-2025-XM-0025',
    projectName: '企业资源计划(ERP)优化',
    businessUnit: '运营管理部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 0,
    onlineDeviceCount: 0,
    offlineDeviceCount: 0,
    configStatus: '未配置',
  },
  {
    id: 'mc-010',
    contractNo: 'NG-HT-2025-0620',
    contractName: '安全应急指挥系统集成合同',
    projectNo: 'NG-2025-XM-0033',
    projectName: '安全生产信息化管理平台',
    businessUnit: '安全环保部',
    ownerUnit: '南京钢铁股份有限公司',
    associatedDeviceCount: 2,
    onlineDeviceCount: 1,
    offlineDeviceCount: 1,
    configStatus: '配置异常',
  },
];

export const allHikvisionDevices: HikvisionDevice[] = [
  { id: 'dev-001', deviceName: '炼钢一区主监控', serialNo: 'HK-DS-2CD3T86FWDV3-2023001', installLocation: '炼钢厂一区主控室', deviceType: '枪机', channelNo: 'CH01-001', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch01_001', testResult: '通过', region: '炼钢厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-002', deviceName: '炼钢一区全景', serialNo: 'HK-DS-2DE7A425IW-2023002', installLocation: '炼钢厂一区厂房顶部', deviceType: '球机', channelNo: 'CH01-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch01_002', testResult: '通过', region: '炼钢厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-003', deviceName: '炼钢一区炉前', serialNo: 'HK-DS-2CD3T46FWDV3-2023003', installLocation: '炼钢厂一区1#转炉炉前', deviceType: '枪机', channelNo: 'CH01-003', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch01_003', testResult: '通过', region: '炼钢厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-004', deviceName: '炼钢二区主监控', serialNo: 'HK-DS-2CD3T86FWDV3-2023004', installLocation: '炼钢厂二区主控室', deviceType: '枪机', channelNo: 'CH02-001', onlineStatus: '离线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch02_001', testResult: '未测通', region: '炼钢厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-005', deviceName: '炼钢二区炉前', serialNo: 'HK-DS-2CD3T46FWDV3-2023005', installLocation: '炼钢厂二区2#转炉炉前', deviceType: '枪机', channelNo: 'CH02-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch02_002', testResult: '通过', region: '炼钢厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-006', deviceName: '炼钢二区全景', serialNo: 'HK-DS-2DE7A425IW-2023006', installLocation: '炼钢厂二区厂房顶部', deviceType: '球机', channelNo: 'CH02-003', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch02_003', testResult: '通过', region: '炼钢厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-007', deviceName: '供应链机房入口', serialNo: 'HK-DS-2CD3T86FWDV3-2023007', installLocation: '信息中心机房A入口', deviceType: '半球', channelNo: 'CH03-001', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch03_001', testResult: '通过', region: '信息中心', associatedContracts: ['NG-HT-2025-0389'] },
  { id: 'dev-008', deviceName: '供应链机房内部', serialNo: 'HK-DS-2CD3T46FWDV3-2023008', installLocation: '信息中心机房A内', deviceType: '半球', channelNo: 'CH03-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch03_002', testResult: '通过', region: '信息中心', associatedContracts: ['NG-HT-2025-0389'] },
  { id: 'dev-009', deviceName: '供应链机房温控区', serialNo: 'HK-DS-2CD3T86FWDV3-2023009', installLocation: '信息中心机房A温控区', deviceType: '枪机', channelNo: 'CH03-003', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch03_003', testResult: '通过', region: '信息中心', associatedContracts: ['NG-HT-2025-0389'] },
  { id: 'dev-010', deviceName: '供应链机房电力', serialNo: 'HK-DS-2CD3T46FWDV3-2023010', installLocation: '信息中心机房A配电柜', deviceType: '半球', channelNo: 'CH03-004', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch03_004', testResult: '通过', region: '信息中心', associatedContracts: ['NG-HT-2025-0389'] },
  { id: 'dev-011', deviceName: '轧钢三区主监控', serialNo: 'HK-DS-2CD3T86FWDV3-2023011', installLocation: '轧钢厂三区主控室', deviceType: '枪机', channelNo: 'CH04-001', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch04_001', testResult: '通过', region: '轧钢厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-012', deviceName: '轧钢三区产线', serialNo: 'HK-DS-2DE7A425IW-2023012', installLocation: '轧钢厂三区热轧产线', deviceType: '球机', channelNo: 'CH04-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch04_002', testResult: '通过', region: '轧钢厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-013', deviceName: '中厚板主监控', serialNo: 'HK-DS-2CD3T86FWDV3-2023013', installLocation: '中厚板厂主控室', deviceType: '枪机', channelNo: 'CH05-001', onlineStatus: '离线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch05_001', testResult: '未测通', region: '中厚板厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-014', deviceName: '中厚板产线全景', serialNo: 'HK-DS-2DE7A425IW-2023014', installLocation: '中厚板厂轧机产线', deviceType: '球机', channelNo: 'CH05-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch05_002', testResult: '通过', region: '中厚板厂', associatedContracts: ['NG-HT-2025-0456'] },
  { id: 'dev-015', deviceName: 'ERP机房全景', serialNo: 'HK-DS-2CD3T86FWDV3-2023015', installLocation: '信息中心机房B内', deviceType: '半球', channelNo: 'CH06-001', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch06_001', testResult: '通过', region: '信息中心', associatedContracts: ['NG-HT-2025-0530'] },
  { id: 'dev-016', deviceName: 'ERP机房出口', serialNo: 'HK-DS-2CD3T46FWDV3-2023016', installLocation: '信息中心机房B出口', deviceType: '枪机', channelNo: 'CH06-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch06_002', testResult: '通过', region: '信息中心', associatedContracts: ['NG-HT-2025-0530'] },
  { id: 'dev-017', deviceName: 'ERP机房电力区', serialNo: 'HK-DS-2CD3T86FWDV3-2023017', installLocation: '信息中心机房B配电柜', deviceType: '半球', channelNo: 'CH06-003', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch06_003', testResult: '通过', region: '信息中心', associatedContracts: ['NG-HT-2025-0530'] },
  { id: 'dev-018', deviceName: 'ERP机房冷却区', serialNo: 'HK-DS-2CD3T46FWDV3-2023018', installLocation: '信息中心机房B冷却系统区', deviceType: '枪机', channelNo: 'CH06-004', onlineStatus: '离线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch06_004', testResult: '未测通', region: '信息中心', associatedContracts: ['NG-HT-2025-0530'] },
  { id: 'dev-019', deviceName: 'ERP机房入口', serialNo: 'HK-DS-2CD3T86FWDV3-2023019', installLocation: '信息中心机房B入口', deviceType: '半球', channelNo: 'CH06-005', onlineStatus: '信号弱', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch06_005', testResult: '未测', region: '信息中心', associatedContracts: ['NG-HT-2025-0530'] },
  { id: 'dev-020', deviceName: '标识解析机房监控', serialNo: 'HK-DS-2CD3T86FWDV3-2023020', installLocation: '信息中心机房C', deviceType: '半球', channelNo: 'CH07-001', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch07_001', testResult: '通过', region: '信息中心', associatedContracts: ['NG-HT-2025-0580'] },
  { id: 'dev-021', deviceName: '标识解析网关区', serialNo: 'HK-DS-2CD3T46FWDV3-2023021', installLocation: '信息中心机房C网关区', deviceType: '枪机', channelNo: 'CH07-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch07_002', testResult: '通过', region: '信息中心', associatedContracts: ['NG-HT-2025-0580'] },
  { id: 'dev-022', deviceName: '安全平台监控中心', serialNo: 'HK-DS-2CD3T86FWDV3-2023022', installLocation: '安全环保部监控中心', deviceType: '半球', channelNo: 'CH08-001', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch08_001', testResult: '通过', region: '办公区', associatedContracts: ['NG-HT-2025-0600'] },
  { id: 'dev-023', deviceName: '安全应急指挥大厅', serialNo: 'HK-DS-2DE7A425IW-2023023', installLocation: '安全应急指挥中心大厅', deviceType: '球机', channelNo: 'CH08-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch08_002', testResult: '通过', region: '办公区', associatedContracts: ['NG-HT-2025-0600'] },
  { id: 'dev-024', deviceName: '供应链仓库A区入口', serialNo: 'HK-DS-2CD3T86FWDV3-2023024', installLocation: '供应链仓库A区入口', deviceType: '枪机', channelNo: 'CH09-001', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch09_001', testResult: '通过', region: '仓储区', associatedContracts: ['NG-HT-2025-0421'] },
  { id: 'dev-025', deviceName: '供应链仓库A区内', serialNo: 'HK-DS-2CD3T46FWDV3-2023025', installLocation: '供应链仓库A区内货架区', deviceType: '半球', channelNo: 'CH09-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch09_002', testResult: '通过', region: '仓储区', associatedContracts: ['NG-HT-2025-0421'] },
  { id: 'dev-026', deviceName: '供应链仓库B区入口', serialNo: 'HK-DS-2CD3T86FWDV3-2023026', installLocation: '供应链仓库B区入口', deviceType: '枪机', channelNo: 'CH09-003', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch09_003', testResult: '通过', region: '仓储区', associatedContracts: ['NG-HT-2025-0421'] },
  { id: 'dev-027', deviceName: '供应链仓库B区装卸', serialNo: 'HK-DS-2DE7A425IW-2023027', installLocation: '供应链仓库B区装卸区', deviceType: '球机', channelNo: 'CH09-004', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch09_004', testResult: '通过', region: '仓储区', associatedContracts: ['NG-HT-2025-0421'] },
  { id: 'dev-028', deviceName: 'MES测试培训室', serialNo: 'HK-DS-2CD3T86FWDV3-2023028', installLocation: '炼钢厂培训中心203室', deviceType: '半球', channelNo: 'CH10-001', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch10_001', testResult: '通过', region: '办公区', associatedContracts: ['NG-HT-2025-0488'] },
  { id: 'dev-029', deviceName: 'MES培训教室全景', serialNo: 'HK-DS-2CD3T46FWDV3-2023029', installLocation: '炼钢厂培训中心201室', deviceType: '半球', channelNo: 'CH10-002', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch10_002', testResult: '通过', region: '办公区', associatedContracts: ['NG-HT-2025-0488'] },
  { id: 'dev-030', deviceName: 'MES沙盘演练区', serialNo: 'HK-DS-2DE7A425IW-2023030', installLocation: '炼钢厂培训中心沙盘区', deviceType: '球机', channelNo: 'CH10-003', onlineStatus: '离线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch10_003', testResult: '未测通', region: '办公区', associatedContracts: ['NG-HT-2025-0488'] },
  { id: 'dev-031', deviceName: '安全应急值班室', serialNo: 'HK-DS-2CD3T86FWDV3-2023031', installLocation: '安全环保部值班室', deviceType: '半球', channelNo: 'CH11-001', onlineStatus: '在线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch11_001', testResult: '通过', region: '办公区', associatedContracts: ['NG-HT-2025-0620'] },
  { id: 'dev-032', deviceName: '安全应急设备间', serialNo: 'HK-DS-2CD3T46FWDV3-2023032', installLocation: '安全环保部应急设备间', deviceType: '枪机', channelNo: 'CH11-002', onlineStatus: '离线', streamUrl: 'rtsp://hik-platform.ngsteel.cn:554/stream/ch11_002', testResult: '未测通', region: '办公区', associatedContracts: ['NG-HT-2025-0620'] },
];

export const monitorConfigStatusLabels: Record<string, string> = {
  '已配置': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '未配置': 'bg-slate-100 text-slate-500 border-slate-200',
  '配置异常': 'bg-red-50 text-red-700 border-red-200',
};

export const onlineStatusLabels: Record<string, string> = {
  '在线': 'bg-emerald-50 text-emerald-700',
  '离线': 'bg-red-50 text-red-700',
  '信号弱': 'bg-amber-50 text-amber-700',
};

export const deviceTypeLabels: Record<string, string> = {
  '球机': 'bg-sky-50 text-sky-700 border-sky-200',
  '枪机': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  '半球': 'bg-violet-50 text-violet-700 border-violet-200',
  '其他': 'bg-slate-100 text-slate-600 border-slate-200',
};

export const hikvisionSyncInfo = {
  platformUrl: 'https://hik-platform.ngsteel.cn/api/v2',
  lastSyncTime: '2026-06-25 08:30:15',
  regions: ['炼钢厂', '轧钢厂', '中厚板厂', '信息中心', '办公区', '仓储区', '高炉区', '烧结区', '码头区'],
};