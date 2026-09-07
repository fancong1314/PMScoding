import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getReimbContractById,
  getPrepaymentsByContractId,
  getWarrantiesByContractId,
  getSettlementsByContractId,
  getPrepayCostPlannings,
  getWarrantyCostPlannings,
  getSettlementSAAItems,
  prepayCostPlannings,
  warrantyCostPlannings,
  settlementSAAItems,
  formatCurrency,
  CostPlanningItem,
  SettlementSAAItem,
} from '@/mocks/paymentReimbursementMocks';

type TabType = 'prepay' | 'settlement' | 'warranty';

export default function PaymentReimbursementAppListPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const contract = getReimbContractById(contractId);

  const allPrepay = getPrepaymentsByContractId(contractId);
  const allWarranty = getWarrantiesByContractId(contractId);
  const allSettlement = getSettlementsByContractId(contractId);

  const [activeTab, setActiveTab] = useState<TabType>('prepay');
  const [toast, setToast] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    type: string;
    id: string;
    tabType: TabType;
  } | null>(null);
  const [costPlanningModal, setCostPlanningModal] = useState<{ appId: string; tabType: 'prepay' | 'warranty' } | null>(null);
  const [settleCostModal, setSettleCostModal] = useState<string | null>(null);
  const [approvalDetailModal, setApprovalDetailModal] = useState<{ appId: string } | null>(null);
  const [submissionModal, setSubmissionModal] = useState<{ appId: string } | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const [prepayData, setPrepayData] = useState([...allPrepay]);
  const [warrantyData, setWarrantyData] = useState([...allWarranty]);
  const [settlementData, setSettlementData] = useState([...allSettlement]);

  const currentData: any[] = activeTab === 'prepay' ? prepayData : activeTab === 'warranty' ? warrantyData : settlementData;

  const handleConfirmAction = () => {
    if (!confirmDialog) return;
    const { type, id, tabType } = confirmDialog;
    const updateList = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) => {
      const now = new Date().toISOString().split('T')[0];
      const reimbNo = 'BZDH-' + now.replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 9000 + 1000));
      if (type === 'confirm') setter((prev) => prev.map((a) => a.id === id ? { ...a, confirmed: true } : a));
      else if (type === 'cancelConfirm') setter((prev) => prev.map((a) => a.id === id ? { ...a, confirmed: false } : a));
      else if (type === 'reimburse') setter((prev) => prev.map((a) => a.id === id ? { ...a, reimbursementNo: reimbNo, reimbursementStatus: '已报支', financeStatus: '财务审核中', reimbursementDate: now } : a));
      else if (type === 'cancelReimburse') setter((prev) => prev.map((a) => a.id === id ? { ...a, reimbursementNo: '', reimbursementStatus: '', financeStatus: '', reimbursementDate: '' } : a));
      else if (type === 'delete') setter((prev) => prev.filter((a) => a.id !== id));
      else if (type === 'financeReturn') showToast('已退回至财务审批环节');
      else if (type === 'financeSettle') setter((prev) => prev.map((a) => a.id === id ? { ...a, financeSettlementStatus: '已决算', financeSettlementDate: now, financeSettlementPerson: '陈丽华' } : a));
      else if (type === 'cancelFinanceSettle') setter((prev) => prev.map((a) => a.id === id ? { ...a, financeSettlementStatus: '', financeSettlementDate: '', financeSettlementPerson: '' } : a));
      else if (type === 'return') showToast('已退回');
    };

    if (tabType === 'prepay') updateList(setPrepayData);
    else if (tabType === 'warranty') updateList(setWarrantyData);
    else if (tabType === 'settlement') updateList(setSettlementData);

    const msgs: Record<string, string> = {
      confirm: '已确认', cancelConfirm: '已取消确认', reimburse: '报支已发起',
      cancelReimburse: '报支已取消', delete: '已删除', financeSettle: '财务决算已完成',
      cancelFinanceSettle: '已取消财务决算', return: '已退回',
    };
    showToast(msgs[type] || '操作成功');
    setConfirmDialog(null);
  };

  const getConfirmMessage = (): string => {
    if (!confirmDialog) return '';
    const msgs: Record<string, string> = {
      confirm: '确认后将不可修改和删除，确定确认吗？',
      cancelConfirm: '取消确认后数据恢复为未确认状态，确定取消确认吗？',
      reimburse: '确定发起报支吗？',
      cancelReimburse: '确定取消报支吗？取消后报支单号和报支日期将被清空。',
      delete: '确认删除该条数据吗？删除后无法恢复。',
      financeReturn: '确定退回至财务审批环节吗？',
      financeSettle: '确定执行财务决算吗？',
      cancelFinanceSettle: '确定取消财务决算状态吗？',
      return: '确定退回吗？',
    };
    return msgs[confirmDialog.type] || '';
  };

  const isGreyStyle = 'opacity-40 cursor-not-allowed pointer-events-none';

  // Determine button states for each data row
  const getBtnStates = (app: any, tab: TabType) => {
    const c = app.confirmed;
    const r = !!app.reimbursementNo;
    const submitted = app.submitStatus === '已呈核';
    const fs = app.financeSettlementStatus === '已决算';
    const hasFlow = app.hasApprovalFlow;

    // For settlement-specific buttons
    const canModify = !c && !submitted && !r;
    const canDelete = !c && !submitted && !r;
    const canConfirm = !c;
    const canCancelConfirm = c && !r;
    const canReimburse = c && !r;
    const canCancelReimburse = r;
    const canFinanceSettle = c && !fs && (submitted || r);
    const canCancelFinanceSettle = fs;
    const canSubmit = c && !submitted && !r;
    const canViewApproval = hasFlow;

    return { canModify, canDelete, canConfirm, canCancelConfirm, canReimburse, canCancelReimburse, canFinanceSettle, canCancelFinanceSettle, canSubmit, canViewApproval, isSubmitted: submitted };
  };

  if (!contract) return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div></Layout>;

  const isPrepay = activeTab === 'prepay';
  const isSettlement = activeTab === 'settlement';
  const colActionsW = isSettlement ? 820 : isPrepay ? 550 : 460;

  return (
    <Layout>
      <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同金额</span><span className="text-sm font-medium text-slate-800">{formatCurrency(contract.adjustedAmount)}</span></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同类型</span><span className="text-sm font-medium text-slate-800">{contract.contractType}</span></div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">合同款项报支</h1>
          <button onClick={() => navigate('/project-contract/payment-reimbursement')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        {/* TABs */}
        <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-full p-1 w-fit">
          <button onClick={() => setActiveTab('prepay')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'prepay' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>预付款报支({prepayData.length})</button>
          <button onClick={() => setActiveTab('settlement')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'settlement' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>结算报支({settlementData.length})</button>
          <button onClick={() => setActiveTab('warranty')} className={`px-4 py-1.5 text-sm rounded-full cursor-pointer whitespace-nowrap transition-colors ${activeTab === 'warranty' ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>质保金报支({warrantyData.length})</button>
        </div>

        {/* Add button (all tabs) */}
        <div className="mb-3">
          <button
            onClick={() => {
              const formPath = isPrepay ? 'prepayment-form' : isSettlement ? 'settlement-form' : 'warranty-form';
              navigate(`/project-contract/payment-reimbursement/${formPath}?contractId=${contractId}`);
            }}
            className="px-3 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 420px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '190px' }}>
                  {isPrepay ? '合同结算申请编号' : isSettlement ? '合同结算申请编号' : '合同结缴申请编号'}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '140px' }}>异动类型</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>费用类型</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>呈核状态</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '150px' }}>
                  {isPrepay ? '预付款金额(元)' : isSettlement ? '结算金额(元)' : '质保金金额(元)'}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>传票日期</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>收支专案</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '90px' }}>申请人</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>申请日期</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '90px' }}>呈核人</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>呈核日期</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>报支单号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>报支状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>财务审核状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>报支日期</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: `${colActionsW}px` }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((app: any) => {
                const amt = isPrepay ? app.prepayAmount : isSettlement ? app.settlementAmount : app.warrantyAmount;
                const btns = getBtnStates(app, activeTab);

                return (
                  <tr key={app.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.appNo}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.changeType}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.costType}</td>
                    <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.submitStatus === '已呈核' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{app.submitStatus}</span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(amt)}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.voucherDate}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.incomeExpense}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.applicant}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.applyDate}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.submitter || '-'}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.submitDate || '-'}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.reimbursementNo || '-'}</td>
                    <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.reimbursementStatus === '已报支' ? 'bg-blue-50 text-blue-700' : app.reimbursementStatus === '待报支' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{app.reimbursementStatus || '未报支'}</span>
                    </td>
                    <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.financeStatus === '财务已审核' ? 'bg-emerald-50 text-emerald-700' : app.financeStatus === '财务审核中' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{app.financeStatus || '-'}</span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{app.reimbursementDate || '-'}</td>
                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {/* All tabs: 修改 & 删除 */}
                        <button onClick={() => {
                          if (!btns.canModify) return;
                          const fp = isPrepay ? 'prepayment-form' : isSettlement ? 'settlement-form' : 'warranty-form';
                          navigate(`/project-contract/payment-reimbursement/${fp}?contractId=${contractId}&appId=${app.id}`);
                        }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${btns.canModify ? 'text-slate-600 border-slate-300 hover:bg-slate-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>修改</button>
                        <button onClick={() => { if (!btns.canDelete) return; setConfirmDialog({ type: 'delete', id: app.id, tabType: activeTab }); }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${btns.canDelete ? 'text-red-600 border-red-200 hover:bg-red-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>删除</button>

                        {/* Settlement-specific: 财务决算 & 取消财务决算 */}
                        {isSettlement && (
                          <>
                            <button onClick={() => { if (!btns.canFinanceSettle) return; setConfirmDialog({ type: 'financeSettle', id: app.id, tabType: 'settlement' }); }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${btns.canFinanceSettle ? 'text-emerald-600 border-emerald-300 hover:bg-emerald-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>财务决算</button>
                            <button onClick={() => { if (!btns.canCancelFinanceSettle) return; setConfirmDialog({ type: 'cancelFinanceSettle', id: app.id, tabType: 'settlement' }); }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${btns.canCancelFinanceSettle ? 'text-amber-600 border-amber-300 hover:bg-amber-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>取消决算</button>
                          </>
                        )}

                        {/* All tabs: 确认 & 取消确认 */}
                        <button onClick={() => { if (!btns.canConfirm) return; setConfirmDialog({ type: 'confirm', id: app.id, tabType: activeTab }); }} className={`px-1.5 py-1 text-xs rounded-md whitespace-nowrap ${btns.canConfirm ? 'text-white cursor-pointer' : 'text-slate-400 bg-slate-200 ' + isGreyStyle}`} style={btns.canConfirm ? { background: 'linear-gradient(135deg, #10b981, #059669)' } : undefined}>确认</button>
                        <button onClick={() => { if (!btns.canCancelConfirm) return; setConfirmDialog({ type: 'cancelConfirm', id: app.id, tabType: activeTab }); }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${btns.canCancelConfirm ? 'text-slate-600 border-slate-300 hover:bg-slate-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>取消确认</button>

                        {/* Settlement: 费用规则 | Prepay/Warranty: 查看费用规划 */}
                        {isSettlement ? (
                          <button onClick={() => setSettleCostModal(app.id)} className="px-1.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">费用规则</button>
                        ) : (
                          <button onClick={() => setCostPlanningModal({ appId: app.id, tabType: isPrepay ? 'prepay' : 'warranty' })} className="px-1.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">费用规划</button>
                        )}

                        {/* All tabs: 报支 & 取消报支 */}
                        <button onClick={() => { if (!btns.canReimburse) return; setConfirmDialog({ type: 'reimburse', id: app.id, tabType: activeTab }); }} className={`px-1.5 py-1 text-xs rounded-md whitespace-nowrap ${btns.canReimburse ? 'text-white cursor-pointer' : 'text-slate-400 bg-slate-200 ' + isGreyStyle}`} style={btns.canReimburse ? { background: 'linear-gradient(135deg, #3b82f6, #2563eb)' } : undefined}>报支</button>
                        <button onClick={() => { if (!btns.canCancelReimburse) return; setConfirmDialog({ type: 'cancelReimburse', id: app.id, tabType: activeTab }); }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${btns.canCancelReimburse ? 'text-amber-600 border-amber-300 hover:bg-amber-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>取消报支</button>

                        {/* All tabs: 打印报支单 */}
                        <button onClick={() => { if (!btns.canCancelReimburse) return; showToast('列印功能：正在生成报支单PDF...'); }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${btns.canCancelReimburse ? 'text-slate-600 border-slate-300 hover:bg-slate-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>列印</button>

                        {/* Prepay only: 退回财务 */}
                        {isPrepay && (
                          <button onClick={() => { if (!btns.canCancelReimburse) return; setConfirmDialog({ type: 'financeReturn', id: app.id, tabType: 'prepay' }); }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${btns.canCancelReimburse ? 'text-violet-600 border-violet-300 hover:bg-violet-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>退回财务</button>
                        )}

                        {/* Settlement: 退回 */}
                        {isSettlement && (
                          <button onClick={() => { if (!btns.canCancelReimburse && !btns.canCancelConfirm) return; setConfirmDialog({ type: 'return', id: app.id, tabType: 'settlement' }); }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${(btns.canCancelReimburse || btns.canCancelConfirm) ? 'text-orange-600 border-orange-300 hover:bg-orange-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>退回</button>
                        )}

                        {/* Settlement: 呈核 */}
                        {isSettlement && (
                          <button onClick={() => { if (!btns.canSubmit) return; setSubmissionModal({ appId: app.id }); }} className={`px-1.5 py-1 text-xs rounded-md whitespace-nowrap ${btns.canSubmit ? 'text-white cursor-pointer' : 'text-slate-400 bg-slate-200 ' + isGreyStyle}`} style={btns.canSubmit ? { background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' } : undefined}>呈核</button>
                        )}

                        {/* Settlement: 审批详情 */}
                        {isSettlement && (
                          <button onClick={() => { if (!btns.canViewApproval) return; setApprovalDetailModal({ appId: app.id }); }} className={`px-1.5 py-1 text-xs border rounded-md whitespace-nowrap ${btns.canViewApproval ? 'text-indigo-600 border-indigo-300 hover:bg-indigo-50 cursor-pointer' : 'text-slate-400 border-slate-200 bg-slate-50 ' + isGreyStyle}`}>审批详情</button>
                        )}

                        {/* Settlement: 详情 */}
                        {isSettlement && (
                          <button onClick={() => navigate(`/project-contract/payment-reimbursement/settlement-form?contractId=${contractId}&appId=${app.id}`)} className="px-1.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">详情</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {currentData.length === 0 && (
                <tr><td colSpan={16} className="px-3 py-10 text-center text-sm text-slate-400">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {currentData.length > 0 && <div className="mt-3 text-sm text-slate-500">共 {currentData.length} 条记录</div>}
      </div>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDialog(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[420px] p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-2">操作确认</h3>
            <p className="text-sm text-slate-600 mb-5">{getConfirmMessage()}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDialog(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleConfirmAction} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
                style={{ background: confirmDialog.type === 'delete' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cost Planning Modal (Prepay/Warranty) */}
      {costPlanningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCostPlanningModal(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[820px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #e8edf3' }}>
              <h3 className="text-base font-semibold text-slate-800">费用规划</h3>
              <button onClick={() => setCostPlanningModal(null)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="overflow-auto flex-1 p-5">
              <CostTable data={costPlanningModal.tabType === 'prepay' ? (prepayCostPlannings[costPlanningModal.appId] || []) : (warrantyCostPlannings[costPlanningModal.appId] || [])} />
            </div>
            <div className="flex justify-end p-4" style={{ borderTop: '1px solid #e8edf3' }}>
              <button onClick={() => setCostPlanningModal(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Settlement Cost Rules Modal */}
      {settleCostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSettleCostModal(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[820px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #e8edf3' }}>
              <h3 className="text-base font-semibold text-slate-800">费用规则</h3>
              <button onClick={() => setSettleCostModal(null)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="bg-amber-50/50 border-b border-amber-200 p-3 flex items-center gap-6">
              <div className="flex items-center gap-2"><span className="text-xs text-slate-500">结算申请编号</span><span className="text-sm font-medium text-slate-700">{settlementData.find((s) => s.id === settleCostModal)?.appNo || '-'}</span></div>
              <div className="flex items-center gap-2"><span className="text-xs text-slate-500">结算金额(元)</span><span className="text-sm font-mono font-medium text-slate-700">{formatCurrency(settlementData.find((s) => s.id === settleCostModal)?.settlementAmount || 0)}</span></div>
            </div>
            <div className="overflow-auto flex-1 p-5">
              <CostTable data={(settlementSAAItems[settleCostModal] || []).map((item) => ({
                id: item.id,
                appId: item.appId,
                planningNo: item.planningNo,
                applyNo: item.applyNo,
                serialNo: item.serialNo,
                debitCredit: item.debitCredit,
                payAmount: item.payAmount,
                accountSubject: item.accountSubject,
                description: item.description,
                modifier: item.modifier,
                modifyDate: item.modifyDate,
              }))} />
            </div>
            <div className="flex justify-end p-4" style={{ borderTop: '1px solid #e8edf3' }}>
              <button onClick={() => setSettleCostModal(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Modal (Settlement 呈核) */}
      {submissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSubmissionModal(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[640px] max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #e8edf3' }}>
              <h3 className="text-base font-semibold text-slate-800">呈核 - 发起审批流程</h3>
              <button onClick={() => setSubmissionModal(null)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="overflow-auto flex-1 p-5">
              <div className="mb-4">
                <span className="text-sm font-medium text-slate-700">审批流名称</span>
                <input type="text" value="结算报支自定义审批流程" readOnly className="mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500 w-full" />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700 mb-2 block">审批节点列表</span>
                <div className="space-y-3">
                  {[
                    { name: '项目部经理', approver: '赵志刚' },
                    { name: '主管部门负责人', approver: '钱永刚' },
                    { name: '财务部审核', approver: '陈丽华' },
                  ].map((node, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>{idx + 1}</div>
                      <div className="flex-1 flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-700 w-32">{node.name}</span>
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm text-slate-500">审批人：</span>
                          <select className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                            <option>{node.approver}</option>
                            <option>李志强</option>
                            <option>张伟</option>
                            <option>王萍</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4" style={{ borderTop: '1px solid #e8edf3' }}>
              <button onClick={() => setSubmissionModal(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={() => {
                setSettlementData((prev) => prev.map((a) => a.id === submissionModal.appId ? { ...a, submitStatus: '已呈核', submitter: '当前用户', submitDate: new Date().toISOString().split('T')[0], hasApprovalFlow: true } : a));
                setSubmissionModal(null);
                showToast('审批流程已发起');
              }} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>提交呈核</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Detail Modal */}
      {approvalDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setApprovalDetailModal(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[680px] max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #e8edf3' }}>
              <h3 className="text-base font-semibold text-slate-800">审批详情</h3>
              <button onClick={() => setApprovalDetailModal(null)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="bg-slate-50/50 border-b border-slate-200 p-4 flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2"><span className="text-xs text-slate-500">审批单号</span><span className="text-sm font-medium text-slate-700">SPDH-202505-0088</span></div>
              <div className="flex items-center gap-2"><span className="text-xs text-slate-500">业务类型</span><span className="text-sm font-medium text-slate-700">结算报支</span></div>
              <div className="flex items-center gap-2"><span className="text-xs text-slate-500">发起人</span><span className="text-sm font-medium text-slate-700">{settlementData.find((s) => s.id === approvalDetailModal.appId)?.submitter || '当前用户'}</span></div>
              <div className="flex items-center gap-2"><span className="text-xs text-slate-500">发起时间</span><span className="text-sm font-medium text-slate-700">{settlementData.find((s) => s.id === approvalDetailModal.appId)?.submitDate || '-'}</span></div>
            </div>
            <div className="overflow-auto flex-1 p-5">
              <div className="relative">
                {/* Vertical timeline */}
                <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-slate-200" />
                {[
                  { name: '项目部经理', approver: '赵志刚', status: '已通过', opinion: '同意，结算金额与合同一致，资料齐全。', time: '2025-04-28 14:30:00' },
                  { name: '主管部门负责人', approver: '钱永刚', status: '已通过', opinion: '项目验收合格，同意结算。', time: '2025-04-29 09:15:00' },
                  { name: '财务部审核', approver: '陈丽华', status: settlementData.find((s) => s.id === approvalDetailModal.appId)?.financeStatus === '财务已审核' ? '已通过' : '审批中', opinion: settlementData.find((s) => s.id === approvalDetailModal.appId)?.financeStatus === '财务已审核' ? '资金已安排，同意支付。' : '', time: settlementData.find((s) => s.id === approvalDetailModal.appId)?.financeStatus === '财务已审核' ? '2025-04-30 16:00:00' : '' },
                ].map((node, idx) => {
                  const statusStyle = node.status === '已通过' ? 'bg-emerald-500' : node.status === '已驳回' ? 'bg-red-500' : node.status === '审批中' ? 'bg-amber-500' : 'bg-slate-300';
                  const statusTextStyle = node.status === '已通过' ? 'text-emerald-700 bg-emerald-50' : node.status === '已驳回' ? 'text-red-700 bg-red-50' : node.status === '审批中' ? 'text-amber-700 bg-amber-50' : 'text-slate-500 bg-slate-100';
                  return (
                    <div key={idx} className="relative pl-10 pb-6 last:pb-0">
                      <div className={`absolute left-[12px] top-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusStyle}`} />
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800">#{idx + 1} {node.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusTextStyle}`}>{node.status}</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mb-1">审批人：{node.approver}</div>
                        {node.opinion && <div className="text-sm text-slate-600 mt-1">意见：{node.opinion}</div>}
                        {node.time && <div className="text-xs text-slate-400 mt-1">审批时间：{node.time}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end p-4" style={{ borderTop: '1px solid #e8edf3' }}>
              <button onClick={() => setApprovalDetailModal(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}

// Shared Cost Table Component
function CostTable({ data }: { data: any[] }) {
  return (
    <table className="w-full text-sm border border-slate-200 rounded-lg">
      <thead>
        <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同预付款费用规划编号</th>
          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">合同预付款申请编号</th>
          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">流水号</th>
          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">借贷</th>
          <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">付款金额(元)</th>
          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">会计科目</th>
          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '200px' }}>费用说明</th>
          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">修改人</th>
          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">修改日期</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.planningNo}</td>
            <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.applyNo}</td>
            <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.serialNo}</td>
            <td className="px-3 py-2.5 text-sm whitespace-nowrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.debitCredit === '借' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{item.debitCredit}</span>
            </td>
            <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-right font-mono">{formatCurrency(item.payAmount)}</td>
            <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.accountSubject}</td>
            <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap" style={{ maxWidth: '200px' }}>{item.description}</td>
            <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.modifier}</td>
            <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{item.modifyDate}</td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr><td colSpan={9} className="px-3 py-8 text-center text-sm text-slate-400">暂无数据</td></tr>
        )}
      </tbody>
    </table>
  );
}