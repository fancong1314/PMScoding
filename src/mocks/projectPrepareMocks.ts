export interface ProjectItem {
  id: string;
  name: string;
  approvalNo: string;
  constructionUnit: string;
  projectType: string;
  manager: string;
  building: string;
  createDate: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  name: string;
  employeeNo: string;
  department: string;
  phone: string;
  memberType: '项目经理' | '合同经办人' | '项目创建人' | '项目成员' | '招标经理' | '采购经理' | '论证经办人' | '工程需求资料经办人' | '合同预付款申请资料经办人' | '合同预结算报支资料经办人' | '合同质保金报支资料经办人';
  relatedContract: string;
  status: '正常' | '审批中' | '已移除';
  createDate: string;
}

export interface MaterialCategory {
  key: string;
  label: string;
  icon: string;
  items: MaterialItem[];
}

export interface MaterialItem {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'pending' | 'expired' | 'warning';
  uploadDate?: string;
  uploader?: string;
  fileName?: string;
  children?: MaterialItem[];
}

export interface Employee {
  id: string;
  name: string;
  employeeNo: string;
  department: string;
  phone: string;
  email: string;
}

const projectTypes = ['基建工程', '设备更新', '技术改造', '环保治理', '信息化项目', '安全整改'];
const buildings = ['1#高炉', '2#转炉', '3#连铸', '轧钢车间', '原料场', '焦化区', '烧结区', '能源中心', '污水处理厂', '配电室'];
const constructionUnits = ['南京钢铁集团有限公司', '江苏钢铁建设集团', '中冶天工集团有限公司', '上海宝冶集团有限公司', '江苏省建工集团有限公司'];
const managers = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟', '周鹏', '吴昊', '郑明', '孙伟'];

const projectNames = [
  '炼铁厂1#高炉环保升级改造工程',
  '炼钢厂2#转炉设备更新项目',
  '轧钢车间自动化控制系统升级',
  '原料场智能化改造工程项目',
  '焦化区环保设施新建工程',
  '烧结区脱硫脱硝改造项目',
  '能源中心余热发电系统工程',
  '污水处理厂扩建改造工程',
  '配电室高低压设备更新项目',
  '办公楼信息化基础设施建设项目',
  '厂区道路硬化及管网改造工程',
  '安全防护设施完善升级项目',
  '仓储物流中心建设工程',
  '环保监测站房建设项目',
  '消防系统升级改造工程',
];

export const projects: ProjectItem[] = Array.from({ length: 15 }, (_, i) => {
  const seq = String(i + 1).padStart(3, '0');
  return {
    id: `proj_${seq}`,
    name: projectNames[i],
    approvalNo: `LX-2026-${seq}`,
    constructionUnit: constructionUnits[i % constructionUnits.length],
    projectType: projectTypes[i % projectTypes.length],
    manager: managers[i % managers.length],
    building: buildings[i % buildings.length],
    createDate: `2026-0${1 + (i % 5)}-${String(1 + (i % 28)).padStart(2, '0')}`,
  };
});

const departments = ['工程管理部', '质量安全部', '设备管理部', '生产运营部', '技术部', '财务部', '人力资源部', '基建部', '安全环保部', '采购部'];
const memberTypes: ProjectMember['memberType'][] = ['项目经理', '合同经办人', '项目创建人', '项目成员', '招标经理', '采购经理'];
const contractNames = [
  '土建工程施工合同', '钢结构安装合同', '设备安装调试合同', '电气自动化施工合同',
  '管道工程施工合同', '防腐保温工程合同', '土方开挖工程合同', '装饰装修工程合同',
];
const employeeNames = [
  '王建国', '李志强', '张伟明', '刘卫东', '陈建华', '赵鹏', '孙伟', '周明', '吴昊', '郑强',
  '钱程', '冯亮', '黄磊', '马超', '董洋', '袁磊', '卢斌', '蒋文', '蔡明', '贾涛',
];

export const employees: Employee[] = Array.from({ length: 20 }, (_, i) => ({
  id: `emp_${String(i + 1).padStart(3, '0')}`,
  name: employeeNames[i],
  employeeNo: `NG${String(10001 + i)}`,
  department: departments[i % departments.length],
  phone: `138${String(10000000 + i * 1234).padStart(8, '0')}`,
  email: `${employeeNames[i]}@ngsteel.com`,
}));

export function getProjectMembers(projectId: string): ProjectMember[] {
  const count = 5 + (parseInt(projectId.split('_')[1], 10) % 8);
  return Array.from({ length: count }, (_, i) => {
    const emp = employees[i % employees.length];
    const type = i === 0 ? '项目经理' : i === 1 ? '合同经办人' : i === 2 ? '项目创建人' : memberTypes[3 + (i % 3)];
    return {
      id: `pm_${projectId}_${String(i + 1).padStart(3, '0')}`,
      projectId,
      name: emp.name,
      employeeNo: emp.employeeNo,
      department: emp.department,
      phone: emp.phone,
      memberType: type,
      relatedContract: i < 3 ? contractNames[i % contractNames.length] : '-',
      status: i === 3 ? '审批中' : '正常',
      createDate: `2026-0${1 + (i % 5)}-${String(10 + (i % 20)).padStart(2, '0')}`,
    };
  });
}

export const materialCategories: MaterialCategory[] = [
  {
    key: 'design',
    label: '设计资料',
    icon: 'ri-pencil-ruler-2-line',
    items: [
      {
        id: 'd1',
        name: '初步设计',
        type: '设计阶段',
        status: 'completed',
        uploadDate: '2026-01-15',
        uploader: '张设计',
        fileName: '初步设计说明书_v1.2.pdf',
      },
      {
        id: 'd2',
        name: '施工图设计',
        type: '设计阶段',
        status: 'completed',
        uploadDate: '2026-02-20',
        uploader: '李工',
        fileName: '施工图纸全套.zip',
        children: [
          { id: 'd2-1', name: '结构施工图', type: '子项', status: 'completed', uploadDate: '2026-02-18', uploader: '李工', fileName: '结构施工图_v1.0.pdf' },
          { id: 'd2-2', name: '电气施工图', type: '子项', status: 'completed', uploadDate: '2026-02-19', uploader: '李工', fileName: '电气施工图_v1.0.pdf' },
          { id: 'd2-3', name: '给排水施工图', type: '子项', status: 'pending' },
          { id: 'd2-4', name: '暖通施工图', type: '子项', status: 'warning' },
        ],
      },
      {
        id: 'd3',
        name: '设计变更',
        type: '变更文件',
        status: 'completed',
        uploadDate: '2026-03-05',
        uploader: '王工',
        fileName: '设计变更通知单_20260305.pdf',
      },
      {
        id: 'd4',
        name: '竣工图设计',
        type: '竣工文件',
        status: 'pending',
        children: [
          { id: 'd4-1', name: '建筑竣工图', type: '子项', status: 'pending' },
          { id: 'd4-2', name: '结构竣工图', type: '子项', status: 'warning' },
          { id: 'd4-3', name: '电气竣工图', type: '子项', status: 'pending' },
          { id: 'd4-4', name: '管道竣工图', type: '子项', status: 'pending' },
        ],
      },
    ],
  },
  {
    key: 'other-service',
    label: '其他服务类资料',
    icon: 'ri-folder-chart-line',
    items: [
      {
        id: 'os1',
        name: '勘察报告',
        type: '勘察文件',
        status: 'completed',
        uploadDate: '2025-11-10',
        uploader: '王勘察',
        fileName: '地质勘察报告_终版.pdf',
        children: [
          { id: 'os1-1', name: '工程地质勘察报告', type: '子项', status: 'completed', uploadDate: '2025-11-10', uploader: '王勘察', fileName: '工程地质勘察报告.pdf' },
          { id: 'os1-2', name: '水文地质勘察报告', type: '子项', status: 'completed', uploadDate: '2025-11-20', uploader: '刘勘察', fileName: '水文地质勘察报告.pdf' },
          { id: 'os1-3', name: '地下管线探测报告', type: '子项', status: 'pending' },
        ],
      },
      {
        id: 'os2',
        name: '安全评价报告',
        type: '安评文件',
        status: 'completed',
        uploadDate: '2025-12-05',
        uploader: '赵安全',
        fileName: '安全预评价报告.pdf',
      },
      {
        id: 'os3',
        name: '环境影响评价',
        type: '环评文件',
        status: 'completed',
        uploadDate: '2025-12-15',
        uploader: '钱环保',
        fileName: '环评报告_批复版.pdf',
      },
      {
        id: 'os4',
        name: '职业健康评价',
        type: '职业健康评价',
        status: 'pending',
      },
      {
        id: 'os5',
        name: '其它',
        type: '其他文件',
        status: 'warning',
      },
    ],
  },
];

export const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  completed: { label: '已完成', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: 'ri-check-double-line' },
  pending: { label: '待上传', color: 'bg-sky-50 text-sky-600 border border-sky-200', icon: 'ri-time-line' },
  expired: { label: '已过期', color: 'bg-red-50 text-red-600 border border-red-200', icon: 'ri-error-warning-line' },
  warning: { label: '空缺提醒', color: 'bg-amber-50 text-amber-600 border border-amber-200', icon: 'ri-alert-line' },
};

export const memberTypeConfig: Record<string, { color: string; icon: string }> = {
  '项目经理': { color: 'bg-violet-50 text-violet-700 border border-violet-200', icon: 'ri-user-star-line' },
  '合同经办人': { color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: 'ri-file-text-line' },
  '项目创建人': { color: 'bg-teal-50 text-teal-700 border border-teal-200', icon: 'ri-user-add-line' },
  '项目成员': { color: 'bg-slate-100 text-slate-600 border border-slate-200', icon: 'ri-user-line' },
  '招标经理': { color: 'bg-orange-50 text-orange-700 border border-orange-200', icon: 'ri-auction-line' },
  '采购经理': { color: 'bg-pink-50 text-pink-700 border border-pink-200', icon: 'ri-shopping-cart-line' },
  '论证经办人': { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: 'ri-file-search-line' },
  '工程需求资料经办人': { color: 'bg-cyan-50 text-cyan-700 border border-cyan-200', icon: 'ri-folder-line' },
  '合同预付款申请资料经办人': { color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: 'ri-money-cny-box-line' },
  '合同预结算报支资料经办人': { color: 'bg-lime-50 text-lime-700 border border-lime-200', icon: 'ri-bill-line' },
  '合同质保金报支资料经办人': { color: 'bg-rose-50 text-rose-700 border border-rose-200', icon: 'ri-shield-line' },
};