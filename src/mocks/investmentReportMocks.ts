export interface ProjectTypeData {
  declareAmount: number;
  benefit: number;
  count: number;
}

export interface UnitReportRow {
  unitName: string;
  pinZhongZhiLiang: ProjectTypeData;
  tiXiaoZengYi: ProjectTypeData;
  zhinengXinXi: ProjectTypeData;
  zhinengZiDongHua: ProjectTypeData;
  zhuangBeiShengJi: ProjectTypeData;
  anQuanHuanBao: ProjectTypeData;
  total: ProjectTypeData;
}

export interface ReportSummary {
  totalInvestment: number;
  totalEquipmentFee: number;
  totalConstructionFee: number;
  totalOtherFee: number;
}

export const reportSummary: ReportSummary = {
  totalInvestment: 339549,
  totalEquipmentFee: 176818,
  totalConstructionFee: 107951,
  totalOtherFee: 39955,
};

export const unitReportRows: UnitReportRow[] = [
  {
    unitName: '炼铁',
    pinZhongZhiLiang: { declareAmount: 570.00, benefit: 0.00, count: 1 },
    tiXiaoZengYi: { declareAmount: 2554.48, benefit: 1274.10, count: 3 },
    zhinengXinXi: { declareAmount: 2030.00, benefit: 815.11, count: 7 },
    zhinengZiDongHua: { declareAmount: 5967.00, benefit: 1495.85, count: 8 },
    zhuangBeiShengJi: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    anQuanHuanBao: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    total: { declareAmount: 88064.79, benefit: 47185.18, count: 74 },
  },
  {
    unitName: '特钢',
    pinZhongZhiLiang: { declareAmount: 15773.00, benefit: 2484.00, count: 8 },
    tiXiaoZengYi: { declareAmount: 1380.00, benefit: 96.52, count: 3 },
    zhinengXinXi: { declareAmount: 1730.00, benefit: 160.00, count: 2 },
    zhinengZiDongHua: { declareAmount: 1365.00, benefit: 358.70, count: 5 },
    zhuangBeiShengJi: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    anQuanHuanBao: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    total: { declareAmount: 37808.25, benefit: 5034.75, count: 34 },
  },
  {
    unitName: '钢轧',
    pinZhongZhiLiang: { declareAmount: 17020.39, benefit: 4936.56, count: 10 },
    tiXiaoZengYi: { declareAmount: 6032.00, benefit: 7170.01, count: 11 },
    zhinengXinXi: { declareAmount: 1190.00, benefit: 990.00, count: 3 },
    zhinengZiDongHua: { declareAmount: 5546.00, benefit: 1974.10, count: 9 },
    zhuangBeiShengJi: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    anQuanHuanBao: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    total: { declareAmount: 44173.41, benefit: 20776.03, count: 56 },
  },
  {
    unitName: '能管',
    pinZhongZhiLiang: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    tiXiaoZengYi: { declareAmount: 900.00, benefit: 669.36, count: 1 },
    zhinengXinXi: { declareAmount: 280.00, benefit: 0.00, count: 1 },
    zhinengZiDongHua: { declareAmount: 7223.00, benefit: 1000.00, count: 4 },
    zhuangBeiShengJi: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    anQuanHuanBao: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    total: { declareAmount: 58069.79, benefit: 11113.71, count: 31 },
  },
  {
    unitName: '机动',
    pinZhongZhiLiang: { declareAmount: 2050.00, benefit: 49.50, count: 14 },
    tiXiaoZengYi: { declareAmount: 5000.00, benefit: 12200.00, count: 38 },
    zhinengXinXi: { declareAmount: 16495.21, benefit: 12200.00, count: 38 },
    zhinengZiDongHua: { declareAmount: 7139.00, benefit: 3064.00, count: 8 },
    zhuangBeiShengJi: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    anQuanHuanBao: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    total: { declareAmount: 95076.33, benefit: 17802.50, count: 89 },
  },
  {
    unitName: '新产业',
    pinZhongZhiLiang: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    tiXiaoZengYi: { declareAmount: 8000.00, benefit: 9729.00, count: 3 },
    zhinengXinXi: { declareAmount: 3365.00, benefit: 1458.04, count: 15 },
    zhinengZiDongHua: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    zhuangBeiShengJi: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    anQuanHuanBao: { declareAmount: 0.00, benefit: 0.00, count: 0 },
    total: { declareAmount: 16351.42, benefit: 12275.65, count: 38 },
  },
];

export const reportYears = ['2026', '2025', '2024', '2023', '2022'];
export const reviewStages = ['申报阶段', '事业部审查', '专业部门审查', '总师室审查', '战运部审查'];
