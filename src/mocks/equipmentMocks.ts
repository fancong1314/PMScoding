/** 设备台账演示数据（年度计划申报-大修/零固设备选择） */
export interface EquipmentItem {
  id: string;
  code: string;
  name: string;
  model: string;
  unit: string;
  location: string;
  status: '在用' | '备用' | '停用';
  /** 设备库存数量 */
  stockQty: number;
}

export const equipmentMasterList: EquipmentItem[] = [
  { id: 'eq1', code: 'EQ-GT-001', name: '3号高炉炉体冷却系统', model: 'BF-Cool-III', unit: '炼铁厂', location: '高炉车间', status: '在用', stockQty: 2 },
  { id: 'eq2', code: 'EQ-GT-002', name: '热风炉阀门组', model: 'HV-2400', unit: '炼铁厂', location: '热风炉区域', status: '在用', stockQty: 6 },
  { id: 'eq3', code: 'EQ-LG-011', name: '2号转炉倾动机构', model: 'BOF-T2', unit: '炼钢厂', location: '转炉跨', status: '在用', stockQty: 1 },
  { id: 'eq4', code: 'EQ-LG-018', name: '连铸机结晶器', model: 'CCM-M3', unit: '炼钢厂', location: '连铸车间', status: '在用', stockQty: 4 },
  { id: 'eq5', code: 'EQ-RZ-021', name: '2250精轧主传动电机', model: 'AC-12MW', unit: '热轧厂', location: '精轧区', status: '在用', stockQty: 2 },
  { id: 'eq6', code: 'EQ-RZ-033', name: '热轧卷取机', model: 'DC-Coil-A', unit: '热轧厂', location: '卷取跨', status: '备用', stockQty: 1 },
  { id: 'eq7', code: 'EQ-LZ-007', name: '酸轧机组张力辊', model: 'TR-860', unit: '冷轧厂', location: '酸轧线', status: '在用', stockQty: 8 },
  { id: 'eq8', code: 'EQ-LZ-015', name: '连续退火炉加热段', model: 'CAL-H2', unit: '冷轧厂', location: '连退线', status: '在用', stockQty: 3 },
  { id: 'eq9', code: 'EQ-DY-003', name: '35kV主变压器', model: 'S11-31500', unit: '动力厂', location: '总降压站', status: '在用', stockQty: 2 },
  { id: 'eq10', code: 'EQ-DY-009', name: '循环水泵组', model: 'WP-800', unit: '动力厂', location: '净环水站', status: '在用', stockQty: 5 },
  { id: 'eq11', code: 'EQ-YL-004', name: '烧结机台车', model: 'ST-180', unit: '原料厂', location: '烧结车间', status: '在用', stockQty: 12 },
  { id: 'eq12', code: 'EQ-WL-002', name: '原料输送皮带机', model: 'BD-1400', unit: '物流厂', location: '原料码头', status: '停用', stockQty: 3 },
];
