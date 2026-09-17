// 合同款项报支 - Mock数据
export interface ReimbursementContract {
  id: string;
  projectNo: string;
  contractNo: string;
  contractName: string;
  contractType: string;
  contractorNo: string;
  mainContent: string;
  signingDate: string;
  adjustedAmount: number;
  status: string;
}

export interface PrepaymentApp {
  id: string;
  contractId: string;
  appNo: string;
  changeType: string;
  costType: string;
  submitStatus: string;
  prepayAmount: number;
  voucherDate: string;
  incomeExpense: string;
  applicant: string;
  applyDate: string;
  submitter: string;
  submitDate: string;
  reimbursementNo: string;
  reimbursementStatus: string;
  financeStatus: string;
  reimbursementDate: string;
  confirmed: boolean;
  // Form fields
  serialNo: string;
  contractNo: string;
  modifier: string;
  modifyDate: string;
  attachmentFiles: string[];
  prepayTableFile: string;
}

export interface WarrantyApp {
  id: string;
  contractId: string;
  appNo: string;
  changeType: string;
  costType: string;
  submitStatus: string;
  warrantyAmount: number;
  voucherDate: string;
  incomeExpense: string;
  applicant: string;
  applyDate: string;
  submitter: string;
  submitDate: string;
  reimbursementNo: string;
  reimbursementStatus: string;
  financeStatus: string;
  reimbursementDate: string;
  confirmed: boolean;
  // Form fields
  serialNo: string;
  contractNo: string;
  settlementAmount: number;
  modifier: string;
  modifyDate: string;
  attachmentFiles: string[];
  prepayTableFile: string;
}

export interface CostPlanningItem {
  id: string;
  appId: string;
  planningNo: string;
  applyNo: string;
  serialNo: string;
  debitCredit: string;
  payAmount: number;
  accountSubject: string;
  description: string;
  modifier: string;
  modifyDate: string;
}

// ==================== 结算报支 ====================
export interface SettlementApp {
  id: string;
  contractId: string;
  appNo: string;
  changeType: string;
  costType: string;
  submitStatus: string;
  settlementAmount: number;
  voucherDate: string;
  incomeExpense: string;
  applicant: string;
  applyDate: string;
  submitter: string;
  submitDate: string;
  reimbursementNo: string;
  reimbursementStatus: string;
  financeStatus: string;
  reimbursementDate: string;
  confirmed: boolean;
  serialNo: string;
  contractNo: string;
  invoiceAmount: number;
  settlementUnit: string;
  remark: string;
  financeSettlementDate: string;
  financeSettlementPerson: string;
  financeSettlementStatus: string;
  modifier: string;
  modifyDate: string;
  attachmentFiles: string[];
  hasApprovalFlow: boolean;
}

export interface SettlementInvoice {
  id: string;
  appId: string;
  registerNo: string;
  serialNo: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceAmount: number;
  invoiceType: string;
  taxRate: number;
  taxIncludedPrice: number;
  taxAmount: number;
  taxExcludedPrice: number;
  creator: string;
  createDate: string;
  modifier: string;
  modifyDate: string;
}

export interface SettlementSAAItem {
  id: string;
  appId: string;
  planningNo: string;
  applyNo: string;
  serialNo: string;
  debitCredit: string;
  payAmount: number;
  accountSubject: string;
  description: string;
  modifier: string;
  modifyDate: string;
}

// 结算异动类型选项
export const settlementChangeTypeOptions: string[] = ['结算（建安）', '结算（设备）', '结算（其他）'];

// 结算单位选项
export const settlementUnitOptions: string[] = ['南京钢铁股份有限公司', '南钢工程建设有限公司', '南钢设备制造有限公司', '南钢能源环保科技有限公司'];

// 发票类型选项
export const invoiceTypeOptions: string[] = ['增值税专用发票', '增值税普通发票', '电子发票'];

// 结算报支数据
export const settlementApps: SettlementApp[] = [
  {
    id: 'st1', contractId: 'rc1', appNo: 'JSJS-2025-00012', changeType: '结算（建安）', costType: '建安',
    submitStatus: '待呈核', settlementAmount: 45200000, voucherDate: '2025-04-10', incomeExpense: '工程项目',
    applicant: '王建国', applyDate: '2025-04-08', submitter: '', submitDate: '',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250408017', contractNo: 'NG-HT-2024-1288',
    invoiceAmount: 45200000, settlementUnit: '南京钢铁股份有限公司', remark: '',
    financeSettlementDate: '', financeSettlementPerson: '', financeSettlementStatus: '',
    modifier: '', modifyDate: '', attachmentFiles: ['高炉营缮结算资料.zip'], hasApprovalFlow: false,
  },
  {
    id: 'st2', contractId: 'rc1', appNo: 'JSJS-2025-00038', changeType: '结算（设备）', costType: '设备',
    submitStatus: '已呈核', settlementAmount: 18200000, voucherDate: '2025-04-25', incomeExpense: '机动备件',
    applicant: '王建国', applyDate: '2025-04-22', submitter: '赵志刚', submitDate: '2025-04-28',
    reimbursementNo: '', reimbursementStatus: '待报支', financeStatus: '', reimbursementDate: '',
    confirmed: true, serialNo: 'LS20250422018', contractNo: 'NG-HT-2024-1288',
    invoiceAmount: 18200000, settlementUnit: '南钢设备制造有限公司', remark: '热风炉改造设备结算',
    financeSettlementDate: '', financeSettlementPerson: '', financeSettlementStatus: '',
    modifier: '赵志刚', modifyDate: '2025-04-28', attachmentFiles: ['热风炉设备结算单据.pdf'], hasApprovalFlow: true,
  },
  {
    id: 'st3', contractId: 'rc3', appNo: 'JSJS-2025-00055', changeType: '结算（设备）', costType: '设备',
    submitStatus: '已呈核', settlementAmount: 86500000, voucherDate: '2025-05-08', incomeExpense: '工程项目',
    applicant: '李雪梅', applyDate: '2025-05-05', submitter: '张伟', submitDate: '2025-05-10',
    reimbursementNo: 'BZDH-250510-0070', reimbursementStatus: '已报支', financeStatus: '财务已审核',
    reimbursementDate: '2025-05-12', confirmed: true, serialNo: 'LS20250505019',
    contractNo: 'NG-HT-2024-1315', invoiceAmount: 86500000, settlementUnit: '南钢设备制造有限公司',
    remark: '精轧机设备到货验收合格结算', financeSettlementDate: '2025-05-20', financeSettlementPerson: '陈丽华',
    financeSettlementStatus: '已决算', modifier: '张伟', modifyDate: '2025-05-10',
    attachmentFiles: ['精轧机设备验收报告.pdf', '进口设备关单.pdf'], hasApprovalFlow: true,
  },
  {
    id: 'st4', contractId: 'rc6', appNo: 'JSJS-2025-00072', changeType: '结算（建安）', costType: '建安',
    submitStatus: '待呈核', settlementAmount: 32100000, voucherDate: '2025-05-15', incomeExpense: '大中修',
    applicant: '陈晓东', applyDate: '2025-05-12', submitter: '', submitDate: '',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250512020', contractNo: 'NG-HT-2024-1370',
    invoiceAmount: 32100000, settlementUnit: '南京钢铁股份有限公司', remark: '脱硫脱硝工程进度结算',
    financeSettlementDate: '', financeSettlementPerson: '', financeSettlementStatus: '',
    modifier: '', modifyDate: '', attachmentFiles: [], hasApprovalFlow: false,
  },
  {
    id: 'st5', contractId: 'rc9', appNo: 'JSJS-2025-00088', changeType: '结算（设备）', costType: '设备',
    submitStatus: '已呈核', settlementAmount: 48500000, voucherDate: '2025-05-28', incomeExpense: '工程项目',
    applicant: '马俊', applyDate: '2025-05-25', submitter: '钱永刚', submitDate: '2025-05-30',
    reimbursementNo: 'BZDH-250530-0078', reimbursementStatus: '已报支', financeStatus: '财务审核中',
    reimbursementDate: '2025-05-31', confirmed: true, serialNo: 'LS20250525021',
    contractNo: 'NG-HT-2025-0020', invoiceAmount: 48500000, settlementUnit: '南钢设备制造有限公司',
    remark: '电炉升级改造设备到货结算', financeSettlementDate: '', financeSettlementPerson: '',
    financeSettlementStatus: '', modifier: '钱永刚', modifyDate: '2025-05-30',
    attachmentFiles: ['电炉设备到货清单.pdf', '技术验收单.pdf'], hasApprovalFlow: true,
  },
  {
    id: 'st6', contractId: 'rc11', appNo: 'JSJS-2025-00102', changeType: '结算（建安）', costType: '建安',
    submitStatus: '待呈核', settlementAmount: 27800000, voucherDate: '2025-06-05', incomeExpense: '大中修',
    applicant: '刘强', applyDate: '2025-06-02', submitter: '', submitDate: '',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250602022', contractNo: 'NG-HT-2025-0048',
    invoiceAmount: 27800000, settlementUnit: '南京钢铁股份有限公司', remark: '',
    financeSettlementDate: '', financeSettlementPerson: '', financeSettlementStatus: '',
    modifier: '', modifyDate: '', attachmentFiles: ['烧结改造进度报告.pdf'], hasApprovalFlow: false,
  },
  {
    id: 'st7', contractId: 'rc8', appNo: 'JSJS-2025-00125', changeType: '结算（设备）', costType: '设备',
    submitStatus: '已呈核', settlementAmount: 128500000, voucherDate: '2025-06-18', incomeExpense: '工程项目',
    applicant: '周文博', applyDate: '2025-06-15', submitter: '李志强', submitDate: '2025-06-20',
    reimbursementNo: 'BZDH-250620-0085', reimbursementStatus: '已报支', financeStatus: '财务已审核',
    reimbursementDate: '2025-06-22', confirmed: true, serialNo: 'LS20250615023',
    contractNo: 'NG-HT-2025-0008', invoiceAmount: 128500000, settlementUnit: '南钢设备制造有限公司',
    remark: '冷轧设备到货验收结算', financeSettlementDate: '2025-06-28', financeSettlementPerson: '王丽梅',
    financeSettlementStatus: '已决算', modifier: '李志强', modifyDate: '2025-06-20',
    attachmentFiles: ['冷轧设备验收报告.pdf', '进口报关单据.pdf'], hasApprovalFlow: true,
  },
  {
    id: 'st8', contractId: 'rc2', appNo: 'JSJS-2025-00148', changeType: '结算（建安）', costType: '建安',
    submitStatus: '待呈核', settlementAmount: 19500000, voucherDate: '2025-06-22', incomeExpense: '工程项目',
    applicant: '杨海涛', applyDate: '2025-06-20', submitter: '', submitDate: '',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250620024', contractNo: 'NG-HT-2024-1302',
    invoiceAmount: 19500000, settlementUnit: '南钢工程建设有限公司', remark: '热处理线改造完工结算',
    financeSettlementDate: '', financeSettlementPerson: '', financeSettlementStatus: '',
    modifier: '', modifyDate: '', attachmentFiles: [], hasApprovalFlow: false,
  },
];

// 结算发票数据
export const settlementInvoices: Record<string, SettlementInvoice[]> = {
  'st1': [
    { id: 'inv1', appId: 'st1', registerNo: 'FPDJ-2025-0120', serialNo: 'LS20250408017-01', invoiceNo: '32002501-2025000120', invoiceDate: '2025-04-08', invoiceAmount: 28000000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 28000000, taxAmount: 3221238.94, taxExcludedPrice: 24778761.06, creator: '王建国', createDate: '2025-04-08', modifier: '王建国', modifyDate: '2025-04-08' },
    { id: 'inv2', appId: 'st1', registerNo: 'FPDJ-2025-0121', serialNo: 'LS20250408017-02', invoiceNo: '32002501-2025000121', invoiceDate: '2025-04-09', invoiceAmount: 17200000, invoiceType: '增值税专用发票', taxRate: 9, taxIncludedPrice: 17200000, taxAmount: 1416513.76, taxExcludedPrice: 15783486.24, creator: '王建国', createDate: '2025-04-09', modifier: '王建国', modifyDate: '2025-04-09' },
  ],
  'st2': [
    { id: 'inv3', appId: 'st2', registerNo: 'FPDJ-2025-0150', serialNo: 'LS20250422018-01', invoiceNo: '32002501-2025000150', invoiceDate: '2025-04-22', invoiceAmount: 12000000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 12000000, taxAmount: 1380530.97, taxExcludedPrice: 10619469.03, creator: '王建国', createDate: '2025-04-22', modifier: '赵志刚', modifyDate: '2025-04-28' },
    { id: 'inv4', appId: 'st2', registerNo: 'FPDJ-2025-0151', serialNo: 'LS20250422018-02', invoiceNo: '32002501-2025000151', invoiceDate: '2025-04-23', invoiceAmount: 6200000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 6200000, taxAmount: 713274.34, taxExcludedPrice: 5486725.66, creator: '王建国', createDate: '2025-04-23', modifier: '赵志刚', modifyDate: '2025-04-28' },
  ],
  'st3': [
    { id: 'inv5', appId: 'st3', registerNo: 'FPDJ-2025-0180', serialNo: 'LS20250505019-01', invoiceNo: '32002501-2025000180', invoiceDate: '2025-05-05', invoiceAmount: 55000000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 55000000, taxAmount: 6327433.63, taxExcludedPrice: 48672566.37, creator: '李雪梅', createDate: '2025-05-05', modifier: '张伟', modifyDate: '2025-05-10' },
    { id: 'inv6', appId: 'st3', registerNo: 'FPDJ-2025-0181', serialNo: 'LS20250505019-02', invoiceNo: '32002501-2025000181', invoiceDate: '2025-05-06', invoiceAmount: 21500000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 21500000, taxAmount: 2473497.86, taxExcludedPrice: 19026502.14, creator: '李雪梅', createDate: '2025-05-06', modifier: '张伟', modifyDate: '2025-05-10' },
    { id: 'inv7', appId: 'st3', registerNo: 'FPDJ-2025-0182', serialNo: 'LS20250505019-03', invoiceNo: '32002501-2025000182', invoiceDate: '2025-05-08', invoiceAmount: 10000000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 10000000, taxAmount: 1150442.48, taxExcludedPrice: 8849557.52, creator: '李雪梅', createDate: '2025-05-08', modifier: '张伟', modifyDate: '2025-05-10' },
  ],
  'st4': [
    { id: 'inv8', appId: 'st4', registerNo: 'FPDJ-2025-0205', serialNo: 'LS20250512020-01', invoiceNo: '32002501-2025000205', invoiceDate: '2025-05-12', invoiceAmount: 20000000, invoiceType: '增值税专用发票', taxRate: 9, taxIncludedPrice: 20000000, taxAmount: 1651376.15, taxExcludedPrice: 18348623.85, creator: '陈晓东', createDate: '2025-05-12', modifier: '陈晓东', modifyDate: '2025-05-12' },
    { id: 'inv9', appId: 'st4', registerNo: 'FPDJ-2025-0206', serialNo: 'LS20250512020-02', invoiceNo: '32002501-2025000206', invoiceDate: '2025-05-14', invoiceAmount: 12100000, invoiceType: '增值税专用发票', taxRate: 9, taxIncludedPrice: 12100000, taxAmount: 999082.57, taxExcludedPrice: 11100917.43, creator: '陈晓东', createDate: '2025-05-14', modifier: '陈晓东', modifyDate: '2025-05-14' },
  ],
  'st5': [
    { id: 'inv10', appId: 'st5', registerNo: 'FPDJ-2025-0220', serialNo: 'LS20250525021-01', invoiceNo: '32002501-2025000220', invoiceDate: '2025-05-25', invoiceAmount: 30000000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 30000000, taxAmount: 3451327.43, taxExcludedPrice: 26548672.57, creator: '马俊', createDate: '2025-05-25', modifier: '钱永刚', modifyDate: '2025-05-30' },
    { id: 'inv11', appId: 'st5', registerNo: 'FPDJ-2025-0221', serialNo: 'LS20250525021-02', invoiceNo: '32002501-2025000221', invoiceDate: '2025-05-27', invoiceAmount: 18500000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 18500000, taxAmount: 2128314.82, taxExcludedPrice: 16371685.18, creator: '马俊', createDate: '2025-05-27', modifier: '钱永刚', modifyDate: '2025-05-30' },
  ],
  'st6': [],
  'st7': [
    { id: 'inv12', appId: 'st7', registerNo: 'FPDJ-2025-0250', serialNo: 'LS20250615023-01', invoiceNo: '32002501-2025000250', invoiceDate: '2025-06-15', invoiceAmount: 80000000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 80000000, taxAmount: 9203539.82, taxExcludedPrice: 70796460.18, creator: '周文博', createDate: '2025-06-15', modifier: '李志强', modifyDate: '2025-06-20' },
    { id: 'inv13', appId: 'st7', registerNo: 'FPDJ-2025-0251', serialNo: 'LS20250615023-02', invoiceNo: '32002501-2025000251', invoiceDate: '2025-06-17', invoiceAmount: 48500000, invoiceType: '增值税专用发票', taxRate: 13, taxIncludedPrice: 48500000, taxAmount: 5579642.29, taxExcludedPrice: 42920357.71, creator: '周文博', createDate: '2025-06-17', modifier: '李志强', modifyDate: '2025-06-20' },
  ],
  'st8': [
    { id: 'inv14', appId: 'st8', registerNo: 'FPDJ-2025-0280', serialNo: 'LS20250620024-01', invoiceNo: '32002501-2025000280', invoiceDate: '2025-06-20', invoiceAmount: 12000000, invoiceType: '增值税专用发票', taxRate: 9, taxIncludedPrice: 12000000, taxAmount: 990825.69, taxExcludedPrice: 11009174.31, creator: '杨海涛', createDate: '2025-06-20', modifier: '杨海涛', modifyDate: '2025-06-20' },
    { id: 'inv15', appId: 'st8', registerNo: 'FPDJ-2025-0281', serialNo: 'LS20250620024-02', invoiceNo: '32002501-2025000281', invoiceDate: '2025-06-21', invoiceAmount: 7500000, invoiceType: '增值税专用发票', taxRate: 9, taxIncludedPrice: 7500000, taxAmount: 619266.06, taxExcludedPrice: 6880733.94, creator: '杨海涛', createDate: '2025-06-21', modifier: '杨海涛', modifyDate: '2025-06-21' },
  ],
};

// 结算金额申请内容（费用规则）数据
export const settlementSAAItems: Record<string, SettlementSAAItem[]> = {
  'st1': [
    { id: 'sa1', appId: 'st1', planningNo: 'FYGH-2025-0301', applyNo: 'JSJS-2025-00012', serialNo: 'LS20250408017', debitCredit: '借', payAmount: 28000000, accountSubject: '在建工程-土建施工费', description: '高炉本体基础施工结算款', modifier: '王建国', modifyDate: '2025-04-10' },
    { id: 'sa2', appId: 'st1', planningNo: 'FYGH-2025-0302', applyNo: 'JSJS-2025-00012', serialNo: 'LS20250408017', debitCredit: '借', payAmount: 17200000, accountSubject: '在建工程-安装工程费', description: '出铁场环保升级安装结算款', modifier: '王建国', modifyDate: '2025-04-10' },
  ],
  'st2': [
    { id: 'sa3', appId: 'st2', planningNo: 'FYGH-2025-0320', applyNo: 'JSJS-2025-00038', serialNo: 'LS20250422018', debitCredit: '借', payAmount: 12000000, accountSubject: '在建工程-设备购置费', description: '热风炉改造设备结算款', modifier: '赵志刚', modifyDate: '2025-04-28' },
    { id: 'sa4', appId: 'st2', planningNo: 'FYGH-2025-0321', applyNo: 'JSJS-2025-00038', serialNo: 'LS20250422018', debitCredit: '借', payAmount: 6200000, accountSubject: '在建工程-安装工程费', description: '炉前除尘系统安装结算款', modifier: '赵志刚', modifyDate: '2025-04-28' },
  ],
  'st3': [
    { id: 'sa5', appId: 'st3', planningNo: 'FYGH-2025-0350', applyNo: 'JSJS-2025-00055', serialNo: 'LS20250505019', debitCredit: '借', payAmount: 55000000, accountSubject: '在建工程-设备购置费', description: '精轧机主机设备结算款', modifier: '张伟', modifyDate: '2025-05-10' },
    { id: 'sa6', appId: 'st3', planningNo: 'FYGH-2025-0351', applyNo: 'JSJS-2025-00055', serialNo: 'LS20250505019', debitCredit: '借', payAmount: 21500000, accountSubject: '在建工程-设备购置费', description: '液压AGC及弯辊系统结算款', modifier: '张伟', modifyDate: '2025-05-10' },
    { id: 'sa7', appId: 'st3', planningNo: 'FYGH-2025-0352', applyNo: 'JSJS-2025-00055', serialNo: 'LS20250505019', debitCredit: '借', payAmount: 10000000, accountSubject: '在建工程-设备购置费', description: '主传动电机结算款', modifier: '张伟', modifyDate: '2025-05-10' },
  ],
  'st4': [
    { id: 'sa8', appId: 'st4', planningNo: 'FYGH-2025-0380', applyNo: 'JSJS-2025-00072', serialNo: 'LS20250512020', debitCredit: '借', payAmount: 20000000, accountSubject: '在建工程-土建施工费', description: '脱硫脱硝基础施工结算款', modifier: '陈晓东', modifyDate: '2025-05-15' },
    { id: 'sa9', appId: 'st4', planningNo: 'FYGH-2025-0381', applyNo: 'JSJS-2025-00072', serialNo: 'LS20250512020', debitCredit: '借', payAmount: 12100000, accountSubject: '在建工程-安装工程费', description: '脱硫塔设备安装结算款', modifier: '陈晓东', modifyDate: '2025-05-15' },
  ],
  'st5': [
    { id: 'sa10', appId: 'st5', planningNo: 'FYGH-2025-0400', applyNo: 'JSJS-2025-00088', serialNo: 'LS20250525021', debitCredit: '借', payAmount: 30000000, accountSubject: '在建工程-设备购置费', description: '120t电弧炉设备结算款', modifier: '钱永刚', modifyDate: '2025-05-30' },
    { id: 'sa11', appId: 'st5', planningNo: 'FYGH-2025-0401', applyNo: 'JSJS-2025-00088', serialNo: 'LS20250525021', debitCredit: '借', payAmount: 18500000, accountSubject: '在建工程-安装工程费', description: 'VD真空精炼炉安装结算款', modifier: '钱永刚', modifyDate: '2025-05-30' },
  ],
  'st6': [
    { id: 'sa12', appId: 'st6', planningNo: 'FYGH-2025-0420', applyNo: 'JSJS-2025-00102', serialNo: 'LS20250602022', debitCredit: '借', payAmount: 16000000, accountSubject: '在建工程-土建施工费', description: '机头电除尘改造基础结算', modifier: '刘强', modifyDate: '2025-06-05' },
    { id: 'sa13', appId: 'st6', planningNo: 'FYGH-2025-0421', applyNo: 'JSJS-2025-00102', serialNo: 'LS20250602022', debitCredit: '借', payAmount: 11800000, accountSubject: '在建工程-安装工程费', description: 'SCR脱硝装置安装结算', modifier: '刘强', modifyDate: '2025-06-05' },
  ],
  'st7': [
    { id: 'sa14', appId: 'st7', planningNo: 'FYGH-2025-0450', applyNo: 'JSJS-2025-00125', serialNo: 'LS20250615023', debitCredit: '借', payAmount: 80000000, accountSubject: '在建工程-设备购置费', description: '五机架六辊冷连轧机组结算款', modifier: '李志强', modifyDate: '2025-06-20' },
    { id: 'sa15', appId: 'st7', planningNo: 'FYGH-2025-0451', applyNo: 'JSJS-2025-00125', serialNo: 'LS20250615023', debitCredit: '借', payAmount: 48500000, accountSubject: '在建工程-设备购置费', description: '酸洗线及自动化系统结算款', modifier: '李志强', modifyDate: '2025-06-20' },
  ],
  'st8': [
    { id: 'sa16', appId: 'st8', planningNo: 'FYGH-2025-0470', applyNo: 'JSJS-2025-00148', serialNo: 'LS20250620024', debitCredit: '借', payAmount: 12000000, accountSubject: '在建工程-土建施工费', description: '热处理炉基础施工结算款', modifier: '杨海涛', modifyDate: '2025-06-22' },
    { id: 'sa17', appId: 'st8', planningNo: 'FYGH-2025-0471', applyNo: 'JSJS-2025-00148', serialNo: 'LS20250620024', debitCredit: '借', payAmount: 7500000, accountSubject: '在建工程-安装工程费', description: '淬火机回火炉安装结算款', modifier: '杨海涛', modifyDate: '2025-06-22' },
  ],
};

// 合同列表
export const reimbursementContracts: ReimbursementContract[] = [
  { id: 'rc1', projectNo: 'LX2024-0088', contractNo: 'NG-HT-2024-1288', contractName: '炼铁厂高炉营缮工程总承包合同', contractType: '工程总承包', contractorNo: 'QY-2023-0156', mainContent: '4号高炉本体大修、热风炉系统改造、出铁场环保升级、炉前除尘系统更新', signingDate: '2024-09-15', adjustedAmount: 89650000, status: '执行中' },
  { id: 'rc2', projectNo: 'LX2024-0091', contractNo: 'NG-HT-2024-1302', contractName: '中板厂热处理线技术改造施工分包合同', contractType: '施工分包', contractorNo: 'QY-2023-0189', mainContent: '热处理炉基础施工、淬火机安装、回火炉安装、配套管道及电气施工', signingDate: '2024-09-20', adjustedAmount: 32500000, status: '执行中' },
  { id: 'rc3', projectNo: 'LX2024-0095', contractNo: 'NG-HT-2024-1315', contractName: '宽厚板厂精轧机设备采购合同', contractType: '设备采购', contractorNo: 'QY-2023-0210', mainContent: '精轧机主机1套、主传动电机2台、液压AGC系统、弯辊系统、机架辊道及导卫装置', signingDate: '2024-10-08', adjustedAmount: 128000000, status: '执行中' },
  { id: 'rc4', projectNo: 'LX2024-0102', contractNo: 'NG-HT-2024-1340', contractName: '能源管控中心智能化改造技术服务合同', contractType: '技术服务', contractorNo: 'QY-2023-0255', mainContent: '能源管理系统升级、EMS平台搭建、数据采集系统部署、能耗分析与优化策略制定', signingDate: '2024-10-22', adjustedAmount: 8500000, status: '执行中' },
  { id: 'rc5', projectNo: 'LX2024-0108', contractNo: 'NG-HT-2024-1356', contractName: '棒材厂高速线材生产线改造工程监理合同', contractType: '工程监理', contractorNo: 'QY-2023-0280', mainContent: '高速线材生产线改造全过程监理服务，含施工准备阶段、施工阶段、竣工验收阶段监理', signingDate: '2024-11-05', adjustedAmount: 2600000, status: '执行中' },
  { id: 'rc6', projectNo: 'LX2024-0112', contractNo: 'NG-HT-2024-1370', contractName: '焦化厂焦炉烟气脱硫脱硝工程总承包合同', contractType: '工程总承包', contractorNo: 'QY-2023-0301', mainContent: '6号焦炉烟气脱硫脱硝系统设计、设备采购、土建施工、安装调试及试运行', signingDate: '2024-11-18', adjustedAmount: 56700000, status: '执行中' },
  { id: 'rc7', projectNo: 'LX2024-0118', contractNo: 'NG-HT-2024-1395', contractName: '原料场封闭改造施工分包合同', contractType: '施工分包', contractorNo: 'QY-2023-0330', mainContent: '原料场大棚钢结构施工、封闭彩板安装、抑尘系统安装、照明及监控系统施工', signingDate: '2024-12-02', adjustedAmount: 45200000, status: '执行中' },
  { id: 'rc8', projectNo: 'LX2025-0005', contractNo: 'NG-HT-2025-0008', contractName: '冷轧厂酸洗连轧机组设备采购合同', contractType: '设备采购', contractorNo: 'QY-2023-0355', mainContent: '酸洗线1条、五机架六辊冷连轧机组1套、全液压卷取机2台、电气自动化控制系统', signingDate: '2025-01-10', adjustedAmount: 215000000, status: '执行中' },
  { id: 'rc9', projectNo: 'LX2025-0011', contractNo: 'NG-HT-2025-0020', contractName: '特钢厂电炉升级改造工程总承包合同', contractType: '工程总承包', contractorNo: 'QY-2023-0380', mainContent: '100t电炉升级为120t超高功率电弧炉、LF精炼炉改造、VD真空精炼炉新增', signingDate: '2025-01-22', adjustedAmount: 78200000, status: '执行中' },
  { id: 'rc10', projectNo: 'LX2025-0018', contractNo: 'NG-HT-2025-0035', contractName: '公辅设施综合管廊改造技术服务合同', contractType: '技术服务', contractorNo: 'QY-2023-0399', mainContent: '综合管廊BIM建模、管线综合优化设计、施工图审查、现场技术指导服务', signingDate: '2025-02-14', adjustedAmount: 4200000, status: '已完工' },
  { id: 'rc11', projectNo: 'LX2025-0022', contractNo: 'NG-HT-2025-0048', contractName: '烧结厂环保超低排放改造施工分包合同', contractType: '施工分包', contractorNo: 'QY-2024-0012', mainContent: '烧结机机头电除尘改造、脱硫塔升级、SCR脱硝装置安装、烟囱防腐处理', signingDate: '2025-02-28', adjustedAmount: 48900000, status: '执行中' },
  { id: 'rc12', projectNo: 'LX2025-0030', contractNo: 'NG-HT-2025-0065', contractName: '科技研发中心实验设备采购合同', contractType: '设备采购', contractorNo: 'QY-2024-0038', mainContent: '扫描电镜1台、X射线衍射仪1台、万能材料试验机2台、金相显微镜3台', signingDate: '2025-03-12', adjustedAmount: 15600000, status: '已签订' },
];

// 收支专案选项
export const incomeExpenseOptions: string[] = [
  '燃料', '辅料', '进口材料', '钢坯(外购坯)', '机动备件', '大中修', '税金',
  '电费', '运输仓储费', '生产厂零星', '部室零星', '劳务费', '工资奖金',
  '社保基金', '福利支出', '公积金', '子公司支出', '其它生产经营', '利息', '工程项目',
];

// 费用类别选项
export const costTypeOptions: string[] = ['设计', '建安', '监理', '其他', '设备', '总包', '设备维修'];

// 异动类型-预付款
export const prepayChangeTypeOptions: string[] = ['预付款（建安）', '预付款（设备）', '预付款（其他）'];
// 异动类型-质保金
export const warrantyChangeTypeOptions: string[] = ['质保金（建安）', '质保金（设备）', '质保金（其他）'];

// 合同类型下拉
export const reimbContractTypeOptions: { label: string; value: string }[] = [
  { label: '请选择', value: '' },
  { label: '工程总承包', value: '工程总承包' },
  { label: '施工分包', value: '施工分包' },
  { label: '设备采购', value: '设备采购' },
  { label: '技术服务', value: '技术服务' },
  { label: '工程监理', value: '工程监理' },
];

// 合同状态下拉
export const reimbContractStatusOptions: { label: string; value: string }[] = [
  { label: '请选择', value: '' },
  { label: '执行中', value: '执行中' },
  { label: '已完工', value: '已完工' },
  { label: '已签订', value: '已签订' },
];

// 异动类型下拉
export const reimbChangeTypeOptions: { label: string; value: string }[] = [
  { label: '请选择', value: '' },
  { label: '预付款（建安）', value: '预付款（建安）' },
  { label: '预付款（设备）', value: '预付款（设备）' },
  { label: '预付款（其他）', value: '预付款（其他）' },
  { label: '质保金（建安）', value: '质保金（建安）' },
  { label: '质保金（设备）', value: '质保金（设备）' },
  { label: '质保金（其他）', value: '质保金（其他）' },
];

// 预付款报支数据
export const prepaymentApps: PrepaymentApp[] = [
  {
    id: 'pp1', contractId: 'rc1', appNo: 'JSHQ-2025-00042', changeType: '预付款（建安）', costType: '建安',
    submitStatus: '待呈核', prepayAmount: 12500000, voucherDate: '2025-03-08', incomeExpense: '工程项目',
    applicant: '王建国', applyDate: '2025-03-05', submitter: '赵志刚', submitDate: '2025-03-10',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250305001', contractNo: 'NG-HT-2024-1288',
    modifier: '', modifyDate: '', attachmentFiles: ['高炉营缮预付款申请表.pdf'], prepayTableFile: '预付款申报表-高炉营缮.xlsx',
  },
  {
    id: 'pp2', contractId: 'rc1', appNo: 'JSHQ-2025-00058', changeType: '预付款（设备）', costType: '设备',
    submitStatus: '已呈核', prepayAmount: 8500000, voucherDate: '2025-03-20', incomeExpense: '机动备件',
    applicant: '王建国', applyDate: '2025-03-18', submitter: '赵志刚', submitDate: '2025-03-22',
    reimbursementNo: 'BZDH-250322-0018', reimbursementStatus: '已报支', financeStatus: '财务已审核',
    reimbursementDate: '2025-03-25', confirmed: true, serialNo: 'LS20250318002',
    contractNo: 'NG-HT-2024-1288', modifier: '赵志刚', modifyDate: '2025-03-22',
    attachmentFiles: ['炉前设备预付款申请.pdf'], prepayTableFile: '预付款申报表-炉前设备.xlsx',
  },
  {
    id: 'pp3', contractId: 'rc3', appNo: 'JSHQ-2025-00089', changeType: '预付款（设备）', costType: '设备',
    submitStatus: '已呈核', prepayAmount: 38000000, voucherDate: '2025-04-12', incomeExpense: '工程项目',
    applicant: '李雪梅', applyDate: '2025-04-08', submitter: '张伟', submitDate: '2025-04-15',
    reimbursementNo: 'BZDH-250415-0035', reimbursementStatus: '已报支', financeStatus: '财务已审核',
    reimbursementDate: '2025-04-18', confirmed: true, serialNo: 'LS20250408003',
    contractNo: 'NG-HT-2024-1315', modifier: '张伟', modifyDate: '2025-04-15',
    attachmentFiles: ['精轧机预付款申请.pdf', '技术协议附件.pdf'], prepayTableFile: '预付款申报表-精轧机.xlsx',
  },
  {
    id: 'pp4', contractId: 'rc6', appNo: 'JSHQ-2025-00105', changeType: '预付款（建安）', costType: '建安',
    submitStatus: '待呈核', prepayAmount: 10000000, voucherDate: '2025-04-22', incomeExpense: '大中修',
    applicant: '陈晓东', applyDate: '2025-04-18', submitter: '', submitDate: '',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250418004', contractNo: 'NG-HT-2024-1370',
    modifier: '', modifyDate: '', attachmentFiles: [], prepayTableFile: '预付款申报表-脱硫脱硝.xlsx',
  },
  {
    id: 'pp5', contractId: 'rc9', appNo: 'JSHQ-2025-00120', changeType: '预付款（其他）', costType: '总包',
    submitStatus: '已呈核', prepayAmount: 15600000, voucherDate: '2025-05-05', incomeExpense: '工程项目',
    applicant: '马俊', applyDate: '2025-05-02', submitter: '钱永刚', submitDate: '2025-05-08',
    reimbursementNo: '', reimbursementStatus: '待报支', financeStatus: '',
    reimbursementDate: '', confirmed: true, serialNo: 'LS20250502005',
    contractNo: 'NG-HT-2025-0020', modifier: '钱永刚', modifyDate: '2025-05-08',
    attachmentFiles: ['电炉升级预付款申请.pdf'], prepayTableFile: '预付款申报表-电炉升级.xlsx',
  },
  {
    id: 'pp6', contractId: 'rc11', appNo: 'JSHQ-2025-00148', changeType: '预付款（建安）', costType: '建安',
    submitStatus: '待呈核', prepayAmount: 7200000, voucherDate: '2025-05-18', incomeExpense: '大中修',
    applicant: '刘强', applyDate: '2025-05-15', submitter: '', submitDate: '',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250515006', contractNo: 'NG-HT-2025-0048',
    modifier: '', modifyDate: '', attachmentFiles: ['烧结改造预付款申请.pdf'], prepayTableFile: '预付款申报表-烧结改造.xlsx',
  },
  {
    id: 'pp7', contractId: 'rc8', appNo: 'JSHQ-2025-00172', changeType: '预付款（设备）', costType: '设备',
    submitStatus: '已呈核', prepayAmount: 52000000, voucherDate: '2025-06-02', incomeExpense: '工程项目',
    applicant: '周文博', applyDate: '2025-05-28', submitter: '李志强', submitDate: '2025-06-05',
    reimbursementNo: 'BZDH-250605-0052', reimbursementStatus: '已报支', financeStatus: '财务已审核',
    reimbursementDate: '2025-06-08', confirmed: true, serialNo: 'LS20250528007',
    contractNo: 'NG-HT-2025-0008', modifier: '李志强', modifyDate: '2025-06-05',
    attachmentFiles: ['冷轧设备预付款申请.pdf', '进口设备清单.pdf'], prepayTableFile: '预付款申报表-冷轧设备.xlsx',
  },
  {
    id: 'pp8', contractId: 'rc2', appNo: 'JSHQ-2025-00185', changeType: '预付款（建安）', costType: '建安',
    submitStatus: '已呈核', prepayAmount: 4800000, voucherDate: '2025-06-10', incomeExpense: '工程项目',
    applicant: '杨海涛', applyDate: '2025-06-07', submitter: '赵志刚', submitDate: '2025-06-11',
    reimbursementNo: 'BZDH-250611-0060', reimbursementStatus: '已报支', financeStatus: '财务审核中',
    reimbursementDate: '2025-06-12', confirmed: true, serialNo: 'LS20250607008',
    contractNo: 'NG-HT-2024-1302', modifier: '赵志刚', modifyDate: '2025-06-11',
    attachmentFiles: ['热处理线预付款申请.pdf'], prepayTableFile: '预付款申报表-热处理线.xlsx',
  },
];

// 质保金报支数据
export const warrantyApps: WarrantyApp[] = [
  {
    id: 'wq1', contractId: 'rc4', appNo: 'JJSH-2025-00015', changeType: '质保金（其他）', costType: '其他',
    submitStatus: '待呈核', warrantyAmount: 425000, voucherDate: '2025-03-28', incomeExpense: '福利支出',
    applicant: '孙明', applyDate: '2025-03-25', submitter: '', submitDate: '',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250325009', contractNo: 'NG-HT-2024-1340',
    settlementAmount: 425000, modifier: '', modifyDate: '',
    attachmentFiles: ['能管中心质保金申请表.pdf'], prepayTableFile: '质保金申报表-能管中心.xlsx',
  },
  {
    id: 'wq2', contractId: 'rc5', appNo: 'JJSH-2025-00028', changeType: '质保金（建安）', costType: '监理',
    submitStatus: '已呈核', warrantyAmount: 78000, voucherDate: '2025-04-05', incomeExpense: '工程项目',
    applicant: '赵敏', applyDate: '2025-04-02', submitter: '王萍', submitDate: '2025-04-08',
    reimbursementNo: 'BZDH-250408-0022', reimbursementStatus: '已报支', financeStatus: '财务已审核',
    reimbursementDate: '2025-04-10', confirmed: true, serialNo: 'LS20250402010',
    contractNo: 'NG-HT-2024-1356', settlementAmount: 78000, modifier: '王萍', modifyDate: '2025-04-08',
    attachmentFiles: ['棒材监理质保金申请.pdf'], prepayTableFile: '质保金申报表-棒材监理.xlsx',
  },
  {
    id: 'wq3', contractId: 'rc7', appNo: 'JJSH-2025-00042', changeType: '质保金（建安）', costType: '建安',
    submitStatus: '待呈核', warrantyAmount: 2260000, voucherDate: '2025-04-20', incomeExpense: '工程项目',
    applicant: '黄志诚', applyDate: '2025-04-18', submitter: '', submitDate: '',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250418011', contractNo: 'NG-HT-2024-1395',
    settlementAmount: 2260000, modifier: '', modifyDate: '',
    attachmentFiles: ['原料场质保金申请.pdf', '验收合格证明.pdf'], prepayTableFile: '质保金申报表-原料场.xlsx',
  },
  {
    id: 'wq4', contractId: 'rc10', appNo: 'JJSH-2025-00055', changeType: '质保金（其他）', costType: '其他',
    submitStatus: '已呈核', warrantyAmount: 210000, voucherDate: '2025-05-12', incomeExpense: '工程项目',
    applicant: '吴佳', applyDate: '2025-05-08', submitter: '钱永刚', submitDate: '2025-05-15',
    reimbursementNo: '', reimbursementStatus: '待报支', financeStatus: '',
    reimbursementDate: '', confirmed: true, serialNo: 'LS20250508012',
    contractNo: 'NG-HT-2025-0035', settlementAmount: 210000, modifier: '钱永刚', modifyDate: '2025-05-15',
    attachmentFiles: ['管廊质保金申请.pdf'], prepayTableFile: '质保金申报表-管廊改造.xlsx',
  },
  {
    id: 'wq5', contractId: 'rc12', appNo: 'JJSH-2025-00068', changeType: '质保金（设备）', costType: '设备',
    submitStatus: '已呈核', warrantyAmount: 780000, voucherDate: '2025-05-25', incomeExpense: '工程项目',
    applicant: '郑虹', applyDate: '2025-05-22', submitter: '张伟', submitDate: '2025-05-28',
    reimbursementNo: 'BZDH-250528-0041', reimbursementStatus: '已报支', financeStatus: '财务已审核',
    reimbursementDate: '2025-05-30', confirmed: true, serialNo: 'LS20250522013',
    contractNo: 'NG-HT-2025-0065', settlementAmount: 780000, modifier: '张伟', modifyDate: '2025-05-28',
    attachmentFiles: ['实验设备质保金申请.pdf', '设备验收报告.pdf'], prepayTableFile: '质保金申报表-实验设备.xlsx',
  },
  {
    id: 'wq6', contractId: 'rc9', appNo: 'JJSH-2025-00082', changeType: '质保金（设备）', costType: '设备',
    submitStatus: '待呈核', warrantyAmount: 3910000, voucherDate: '2025-06-08', incomeExpense: '工程项目',
    applicant: '马俊', applyDate: '2025-06-05', submitter: '', submitDate: '',
    reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '',
    confirmed: false, serialNo: 'LS20250605014', contractNo: 'NG-HT-2025-0020',
    settlementAmount: 3910000, modifier: '', modifyDate: '',
    attachmentFiles: ['电炉升级质保金申请.pdf'], prepayTableFile: '质保金申报表-电炉升级.xlsx',
  },
  {
    id: 'wq7', contractId: 'rc6', appNo: 'JJSH-2025-00095', changeType: '质保金（建安）', costType: '建安',
    submitStatus: '已呈核', warrantyAmount: 2835000, voucherDate: '2025-06-15', incomeExpense: '大中修',
    applicant: '陈晓东', applyDate: '2025-06-12', submitter: '李志强', submitDate: '2025-06-18',
    reimbursementNo: 'BZDH-250618-0055', reimbursementStatus: '已报支', financeStatus: '财务审核中',
    reimbursementDate: '2025-06-20', confirmed: true, serialNo: 'LS20250612015',
    contractNo: 'NG-HT-2024-1370', settlementAmount: 2835000, modifier: '李志强', modifyDate: '2025-06-18',
    attachmentFiles: ['脱硫脱硝质保金申请.pdf', '竣工证明.pdf'], prepayTableFile: '质保金申报表-脱硫脱硝.xlsx',
  },
  {
    id: 'wq8', contractId: 'rc3', appNo: 'JJSH-2025-00108', changeType: '质保金（设备）', costType: '设备',
    submitStatus: '已呈核', warrantyAmount: 6400000, voucherDate: '2025-06-22', incomeExpense: '工程项目',
    applicant: '李雪梅', applyDate: '2025-06-20', submitter: '张伟', submitDate: '2025-06-25',
    reimbursementNo: 'BZDH-250625-0062', reimbursementStatus: '已报支', financeStatus: '财务已审核',
    reimbursementDate: '2025-06-28', confirmed: true, serialNo: 'LS20250620016',
    contractNo: 'NG-HT-2024-1315', settlementAmount: 6400000, modifier: '张伟', modifyDate: '2025-06-25',
    attachmentFiles: ['精轧机质保金申请.pdf'], prepayTableFile: '质保金申报表-精轧机.xlsx',
  },
];

// 预付款费用规划数据
export const prepayCostPlannings: Record<string, CostPlanningItem[]> = {
  'pp1': [
    { id: 'pcp1', appId: 'pp1', planningNo: 'FYGH-2025-0071', applyNo: 'JSHQ-2025-00042', serialNo: 'LS20250305001', debitCredit: '借', payAmount: 8000000, accountSubject: '在建工程-土建施工费', description: '高炉本体基础施工预付款', modifier: '王建国', modifyDate: '2025-03-08' },
    { id: 'pcp2', appId: 'pp1', planningNo: 'FYGH-2025-0072', applyNo: 'JSHQ-2025-00042', serialNo: 'LS20250305001', debitCredit: '借', payAmount: 4500000, accountSubject: '在建工程-设备安装费', description: '出铁场环保升级设备预付款', modifier: '王建国', modifyDate: '2025-03-08' },
  ],
  'pp2': [
    { id: 'pcp3', appId: 'pp2', planningNo: 'FYGH-2025-0098', applyNo: 'JSHQ-2025-00058', serialNo: 'LS20250318002', debitCredit: '借', payAmount: 5500000, accountSubject: '在建工程-设备购置费', description: '热风炉改造设备预付款', modifier: '赵志刚', modifyDate: '2025-03-20' },
    { id: 'pcp4', appId: 'pp2', planningNo: 'FYGH-2025-0099', applyNo: 'JSHQ-2025-00058', serialNo: 'LS20250318002', debitCredit: '借', payAmount: 3000000, accountSubject: '在建工程-安装工程费', description: '炉前除尘系统安装预付款', modifier: '赵志刚', modifyDate: '2025-03-20' },
  ],
  'pp3': [
    { id: 'pcp5', appId: 'pp3', planningNo: 'FYGH-2025-0120', applyNo: 'JSHQ-2025-00089', serialNo: 'LS20250408003', debitCredit: '借', payAmount: 25000000, accountSubject: '在建工程-设备购置费', description: '精轧机主机设备预付款', modifier: '张伟', modifyDate: '2025-04-12' },
    { id: 'pcp6', appId: 'pp3', planningNo: 'FYGH-2025-0121', applyNo: 'JSHQ-2025-00089', serialNo: 'LS20250408003', debitCredit: '借', payAmount: 8000000, accountSubject: '在建工程-设备购置费', description: '液压AGC及弯辊系统预付款', modifier: '张伟', modifyDate: '2025-04-12' },
    { id: 'pcp7', appId: 'pp3', planningNo: 'FYGH-2025-0122', applyNo: 'JSHQ-2025-00089', serialNo: 'LS20250408003', debitCredit: '借', payAmount: 5000000, accountSubject: '在建工程-设备购置费', description: '主传动电机预付款', modifier: '张伟', modifyDate: '2025-04-12' },
  ],
  'pp4': [
    { id: 'pcp8', appId: 'pp4', planningNo: 'FYGH-2025-0145', applyNo: 'JSHQ-2025-00105', serialNo: 'LS20250418004', debitCredit: '借', payAmount: 6500000, accountSubject: '在建工程-土建施工费', description: '脱硫脱硝基础施工预付款', modifier: '陈晓东', modifyDate: '2025-04-22' },
    { id: 'pcp9', appId: 'pp4', planningNo: 'FYGH-2025-0146', applyNo: 'JSHQ-2025-00105', serialNo: 'LS20250418004', debitCredit: '借', payAmount: 3500000, accountSubject: '在建工程-安装工程费', description: '脱硫塔设备安装预付款', modifier: '陈晓东', modifyDate: '2025-04-22' },
  ],
  'pp5': [
    { id: 'pcp10', appId: 'pp5', planningNo: 'FYGH-2025-0170', applyNo: 'JSHQ-2025-00120', serialNo: 'LS20250502005', debitCredit: '借', payAmount: 10000000, accountSubject: '在建工程-设备购置费', description: '120t电弧炉设备预付款', modifier: '钱永刚', modifyDate: '2025-05-05' },
    { id: 'pcp11', appId: 'pp5', planningNo: 'FYGH-2025-0171', applyNo: 'JSHQ-2025-00120', serialNo: 'LS20250502005', debitCredit: '借', payAmount: 5600000, accountSubject: '在建工程-安装工程费', description: 'LF精炼炉改造预付款', modifier: '钱永刚', modifyDate: '2025-05-05' },
  ],
  'pp6': [
    { id: 'pcp12', appId: 'pp6', planningNo: 'FYGH-2025-0195', applyNo: 'JSHQ-2025-00148', serialNo: 'LS20250515006', debitCredit: '借', payAmount: 4200000, accountSubject: '在建工程-土建施工费', description: '机头电除尘改造基础预付款', modifier: '刘强', modifyDate: '2025-05-18' },
    { id: 'pcp13', appId: 'pp6', planningNo: 'FYGH-2025-0196', applyNo: 'JSHQ-2025-00148', serialNo: 'LS20250515006', debitCredit: '借', payAmount: 3000000, accountSubject: '在建工程-安装工程费', description: 'SCR脱硝装置安装预付款', modifier: '刘强', modifyDate: '2025-05-18' },
  ],
  'pp7': [
    { id: 'pcp14', appId: 'pp7', planningNo: 'FYGH-2025-0220', applyNo: 'JSHQ-2025-00172', serialNo: 'LS20250528007', debitCredit: '借', payAmount: 35000000, accountSubject: '在建工程-设备购置费', description: '五机架六辊冷连轧机组预付款', modifier: '李志强', modifyDate: '2025-06-02' },
    { id: 'pcp15', appId: 'pp7', planningNo: 'FYGH-2025-0221', applyNo: 'JSHQ-2025-00172', serialNo: 'LS20250528007', debitCredit: '借', payAmount: 12000000, accountSubject: '在建工程-设备购置费', description: '酸洗线设备预付款', modifier: '李志强', modifyDate: '2025-06-02' },
    { id: 'pcp16', appId: 'pp7', planningNo: 'FYGH-2025-0222', applyNo: 'JSHQ-2025-00172', serialNo: 'LS20250528007', debitCredit: '借', payAmount: 5000000, accountSubject: '在建工程-安装工程费', description: '电气自动化系统预付款', modifier: '李志强', modifyDate: '2025-06-02' },
  ],
  'pp8': [
    { id: 'pcp17', appId: 'pp8', planningNo: 'FYGH-2025-0245', applyNo: 'JSHQ-2025-00185', serialNo: 'LS20250607008', debitCredit: '借', payAmount: 2800000, accountSubject: '在建工程-土建施工费', description: '热处理炉基础施工预付款', modifier: '赵志刚', modifyDate: '2025-06-10' },
    { id: 'pcp18', appId: 'pp8', planningNo: 'FYGH-2025-0246', applyNo: 'JSHQ-2025-00185', serialNo: 'LS20250607008', debitCredit: '借', payAmount: 2000000, accountSubject: '在建工程-安装工程费', description: '淬火机回火炉安装预付款', modifier: '赵志刚', modifyDate: '2025-06-10' },
  ],
};

// 质保金费用规划数据
export const warrantyCostPlannings: Record<string, CostPlanningItem[]> = {
  'wq1': [
    { id: 'wcp1', appId: 'wq1', planningNo: 'FYGH-2025-0085', applyNo: 'JJSH-2025-00015', serialNo: 'LS20250325009', debitCredit: '借', payAmount: 250000, accountSubject: '应付账款-质保金', description: '能源管理系统升级质保金', modifier: '孙明', modifyDate: '2025-03-28' },
    { id: 'wcp2', appId: 'wq1', planningNo: 'FYGH-2025-0086', applyNo: 'JJSH-2025-00015', serialNo: 'LS20250325009', debitCredit: '借', payAmount: 175000, accountSubject: '应付账款-质保金', description: 'EMS平台搭建质保金', modifier: '孙明', modifyDate: '2025-03-28' },
  ],
  'wq2': [
    { id: 'wcp3', appId: 'wq2', planningNo: 'FYGH-2025-0110', applyNo: 'JJSH-2025-00028', serialNo: 'LS20250402010', debitCredit: '借', payAmount: 78000, accountSubject: '应付账款-质保金', description: '棒材高速线材改造监理质保金', modifier: '王萍', modifyDate: '2025-04-05' },
  ],
  'wq3': [
    { id: 'wcp4', appId: 'wq3', planningNo: 'FYGH-2025-0135', applyNo: 'JJSH-2025-00042', serialNo: 'LS20250418011', debitCredit: '借', payAmount: 1300000, accountSubject: '应付账款-质保金', description: '大棚钢结构施工质保金', modifier: '黄志诚', modifyDate: '2025-04-20' },
    { id: 'wcp5', appId: 'wq3', planningNo: 'FYGH-2025-0136', applyNo: 'JJSH-2025-00042', serialNo: 'LS20250418011', debitCredit: '借', payAmount: 960000, accountSubject: '应付账款-质保金', description: '封闭彩板及抑尘系统质保金', modifier: '黄志诚', modifyDate: '2025-04-20' },
  ],
  'wq4': [
    { id: 'wcp6', appId: 'wq4', planningNo: 'FYGH-2025-0160', applyNo: 'JJSH-2025-00055', serialNo: 'LS20250508012', debitCredit: '借', payAmount: 120000, accountSubject: '应付账款-质保金', description: '管线综合优化设计质保金', modifier: '钱永刚', modifyDate: '2025-05-12' },
    { id: 'wcp7', appId: 'wq4', planningNo: 'FYGH-2025-0161', applyNo: 'JJSH-2025-00055', serialNo: 'LS20250508012', debitCredit: '借', payAmount: 90000, accountSubject: '应付账款-质保金', description: 'BIM建模服务质保金', modifier: '钱永刚', modifyDate: '2025-05-12' },
  ],
  'wq5': [
    { id: 'wcp8', appId: 'wq5', planningNo: 'FYGH-2025-0185', applyNo: 'JJSH-2025-00068', serialNo: 'LS20250522013', debitCredit: '借', payAmount: 450000, accountSubject: '应付账款-质保金', description: '扫描电镜及衍射仪质保金', modifier: '张伟', modifyDate: '2025-05-25' },
    { id: 'wcp9', appId: 'wq5', planningNo: 'FYGH-2025-0186', applyNo: 'JJSH-2025-00068', serialNo: 'LS20250522013', debitCredit: '借', payAmount: 330000, accountSubject: '应付账款-质保金', description: '万能试验机及金相显微镜质保金', modifier: '张伟', modifyDate: '2025-05-25' },
  ],
  'wq6': [
    { id: 'wcp10', appId: 'wq6', planningNo: 'FYGH-2025-0205', applyNo: 'JJSH-2025-00082', serialNo: 'LS20250605014', debitCredit: '借', payAmount: 2500000, accountSubject: '应付账款-质保金', description: '120t电弧炉设备质保金', modifier: '马俊', modifyDate: '2025-06-08' },
    { id: 'wcp11', appId: 'wq6', planningNo: 'FYGH-2025-0206', applyNo: 'JJSH-2025-00082', serialNo: 'LS20250605014', debitCredit: '借', payAmount: 1410000, accountSubject: '应付账款-质保金', description: 'VD真空精炼炉质保金', modifier: '马俊', modifyDate: '2025-06-08' },
  ],
  'wq7': [
    { id: 'wcp12', appId: 'wq7', planningNo: 'FYGH-2025-0230', applyNo: 'JJSH-2025-00095', serialNo: 'LS20250612015', debitCredit: '借', payAmount: 1800000, accountSubject: '应付账款-质保金', description: '脱硫塔升级改造质保金', modifier: '李志强', modifyDate: '2025-06-15' },
    { id: 'wcp13', appId: 'wq7', planningNo: 'FYGH-2025-0231', applyNo: 'JJSH-2025-00095', serialNo: 'LS20250612015', debitCredit: '借', payAmount: 1035000, accountSubject: '应付账款-质保金', description: 'SCR脱硝及烟囱防腐质保金', modifier: '李志强', modifyDate: '2025-06-15' },
  ],
  'wq8': [
    { id: 'wcp14', appId: 'wq8', planningNo: 'FYGH-2025-0255', applyNo: 'JJSH-2025-00108', serialNo: 'LS20250620016', debitCredit: '借', payAmount: 4200000, accountSubject: '应付账款-质保金', description: '精轧机主机质保金', modifier: '张伟', modifyDate: '2025-06-22' },
    { id: 'wcp15', appId: 'wq8', planningNo: 'FYGH-2025-0256', applyNo: 'JJSH-2025-00108', serialNo: 'LS20250620016', debitCredit: '借', payAmount: 2200000, accountSubject: '应付账款-质保金', description: '液压AGC系统及卷取机质保金', modifier: '张伟', modifyDate: '2025-06-22' },
  ],
};

export const formatCurrency = (val: number): string => {
  if (val == null || isNaN(val)) return '0.00';
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// 查找函数
export function getReimbContractById(id: string) {
  return reimbursementContracts.find((c) => c.id === id) || null;
}

export function getPrepaymentsByContractId(contractId: string) {
  return prepaymentApps.filter((a) => a.contractId === contractId);
}

export function getWarrantiesByContractId(contractId: string) {
  return warrantyApps.filter((a) => a.contractId === contractId);
}

export function getPrepaymentById(id: string) {
  return prepaymentApps.find((a) => a.id === id) || null;
}

export function getWarrantyById(id: string) {
  return warrantyApps.find((a) => a.id === id) || null;
}

export function getPrepayCostPlannings(appId: string) {
  return prepayCostPlannings[appId] || [];
}

export function getWarrantyCostPlannings(appId: string) {
  return warrantyCostPlannings[appId] || [];
}

export function getSettlementsByContractId(contractId: string) {
  return settlementApps.filter((a) => a.contractId === contractId);
}

export function getSettlementById(id: string) {
  return settlementApps.find((a) => a.id === id) || null;
}

export function getSettlementInvoices(appId: string) {
  return settlementInvoices[appId] || [];
}

export function getSettlementSAAItems(appId: string) {
  return settlementSAAItems[appId] || [];
}