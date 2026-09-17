import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getContractDocumentById,
  getMaterialChangesByContract,
  getMaterialChangeById,
  formatCurrency,
  materialChangeTypes,
  generateBudgetAllocations,
  type BudgetAllocation,
} from '@/mocks/contractDocumentMocks';

interface ApprovalNodeConfig { id: string; name: string; approver: string; }
const approverOptions = ['张明远', '李建国', '王志强', '赵卫东', '陈建华', '刘伟', '孙伟', '周鹏', '吴昊', '郑明'];

export default function ContractDocumentMaterialChangePage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const contract = useMemo(() => getContractDocumentById(contractId), [contractId]);
  const [records, setRecords] = useState(() => getMaterialChangesByContract(contractId));

  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    changeType: '订约',
    changeUnit: 'ERP系统-炼铁事业部',
    changeAmount: 0,
    changeDesc: '',
    budgetAllocations: generateBudgetAllocations().map(b => ({ ...b, currentOccupied: 0, balanceAmount: b.estimateAmount - b.demandOccupied - b.contractOccupied })),
  });

  const [showBudgetAllocation, setShowBudgetAllocation] = useState(false);

  const [showApprovalFlow, setShowApprovalFlow] = useState(false);
  const [approvalNodes, setApprovalNodes] = useState<ApprovalNodeConfig[]>([
    { id: '1', name: '部门负责人审批', approver: '' },
    { id: '2', name: '分管领导审批', approver: '' },
  ]);
  const [approvalName, setApprovalName] = useState('');

  const [showResult, setShowResult] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };
  const paginatedData = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '暂存': return 'bg-slate-100 text-slate-600';
      case '审批中': return 'bg-blue-50 text-blue-700';
      case '已通过': return 'bg-emerald-50 text-emerald-700';
      case '已退回': return 'bg-red-50 text-red-700';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const openAdd = () => {
    setModalMode('add');
    setEditId('');
    setFormData({ changeType: '订约', changeUnit: 'ERP系统-炼铁事业部', changeAmount: 0, changeDesc: '', budgetAllocations: generateBudgetAllocations() });
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const record = getMaterialChangeById(id);
    if (!record) return;
    if (record.status !== '暂存') { showToast('仅暂存状态的异动记录可修改'); return; }
    setModalMode('edit');
    setEditId(id);
    setFormData({ changeType: record.changeType, changeUnit: record.changeUnit, changeAmount: record.changeAmount, changeDesc: record.changeDesc, budgetAllocations: record.budgetAllocations });
    setShowModal(true);
  };

  const handleWithdraw = (id: string) => {
    const record = getMaterialChangeById(id);
    if (!record) return;
    if (record.status !== '审批中') { showToast('仅审批中状态的异动记录可撤回'); return; }
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: '暂存' } : r));
    showToast('已撤回审批');
  };

  const handleSave = () => { showToast('保存成功，状态为暂存'); setShowModal(false); };

  const handleApprove = () => {
    setApprovalName(`甲供材异动审批-${contract?.contractNo || ''}-${new Date().toISOString().slice(0, 10)}`);
    setApprovalNodes([{ id: '1', name: '部门负责人审批', approver: '' }, { id: '2', name: '分管领导审批', approver: '' }]);
    setShowApprovalFlow(true);
  };

  const submitApproval = () => {
    const empty = approvalNodes.filter(n => !n.approver.trim());
    if (empty.length > 0) { showToast('请为所有审批节点选择审批人'); return; }
    setShowApprovalFlow(false); setShowModal(false);
    showToast('审批流程已提交，状态变更为审批中');
  };

  const handleBudgetChange = (id: string, value: number) => {
    setFormData(prev => ({ ...prev, budgetAllocations: prev.budgetAllocations.map(b => b.id === id ? { ...b, currentOccupied: value } : b) }));
  };

  if (!contract) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 mb-4">未找到合同信息</p>
          <button onClick={() => navigate('/project-contract/document')} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>返回列表</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div>
            <h1 className="text-base font-semibold text-slate-800">合同甲供材投资控制记录异动列表</h1>
            <span className="text-xs text-slate-400">共{records.length}条记录</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openAdd} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增异动
            </button>
            <button onClick={() => navigate('/project-contract/document')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
            </button>
          </div>
        </div>
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-6 text-sm">
          <span className="text-slate-600">立项号：<strong className="text-slate-800">{contract.approvalNo}</strong></span>
          <span className="text-slate-600">合同编号：<strong className="text-slate-800">{contract.contractNo}</strong></span>
          <span className="text-slate-600">合同名称：<strong className="text-slate-800">{contract.contractName}</strong></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="sticky left-0 bg-slate-50 z-10 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[200px]">合同甲供材投资控制记录编号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">立项号</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[220px]">异动说明</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[95px]">异动类型</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[75px]">状态</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[150px]">异动单位</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">异动金额(元)</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[85px]">申请人员</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[105px]">申请日期</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[85px]">核准人员</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[105px]">核准日期</th>
                <th className="sticky right-0 bg-slate-50 z-10 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[210px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="sticky left-0 bg-white z-10 px-3 py-2 text-slate-700 whitespace-nowrap text-xs font-medium">{r.controlRecordNo}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{r.approvalNo}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap text-xs overflow-hidden text-ellipsis max-w-[200px]">{r.changeDesc}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs"><span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-700">{r.changeType}</span></td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs"><span className={`px-1.5 py-0.5 rounded ${getStatusStyle(r.status)}`}>{r.status}</span></td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{r.changeUnit}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{r.changeAmount >= 0 ? '+' : ''}{formatCurrency(r.changeAmount)}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{r.applicant}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{r.applyDate}</td>
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs">{r.approver || '-'}</td>
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs">{r.approveDate || '-'}</td>
                  <td className="sticky right-0 bg-white z-10 px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(r.id)} className="px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50 cursor-pointer">修改</button>
                      <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer">删除</button>
                      <button onClick={() => handleWithdraw(r.id)} className="px-2 py-1 text-xs text-amber-600 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer">撤回</button>
                      <button onClick={() => setShowResult(true)} className="px-2 py-1 text-xs text-teal-600 border border-teal-200 rounded hover:bg-teal-50 cursor-pointer">查看结果</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr><td colSpan={12} className="px-3 py-10 text-center text-slate-400 text-sm">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-[95vw]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">{modalMode === 'add' ? '甲供材异动新增' : '甲供材异动修改'}</h3>
              <button onClick={() => setShowModal(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line text-lg" /></button>
            </div>
            <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">记录编号</span>
                  <input type="text" value={modalMode === 'add' ? '（系统自动生成）' : `JG-2026-001`} disabled className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">立项号</span>
                  <div className="relative flex-1">
                    <input type="text" value={contract.approvalNo} disabled className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                    <button className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">合同编号</span>
                  <div className="relative flex-1">
                    <input type="text" value={contract.contractNo} disabled className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                    <button className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400 cursor-pointer"><i className="ri-close-circle-line text-xs" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>异动类型</span>
                  <select value={formData.changeType} onChange={e => setFormData(prev => ({ ...prev, changeType: e.target.value }))} className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    {materialChangeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20">异动单位</span>
                  <input type="text" value={formData.changeUnit} disabled className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                  <span className="text-xs text-slate-400">ERP系统</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>异动金额(元)</span>
                  <input type="number" step="1" value={formData.changeAmount} onChange={e => setFormData(prev => ({ ...prev, changeAmount: Number(e.target.value) }))} className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-600 mb-1 block"><span className="text-red-500">*</span>异动说明</span>
                <textarea value={formData.changeDesc} onChange={e => setFormData(prev => ({ ...prev, changeDesc: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" maxLength={500} />
              </div>

              {/* Bottom Info */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">创建人员</span><input type="text" value="张明远" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">创建日期</span><input type="text" value="2026-05-28 09:30:00" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">修改人员</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">修改日期</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">申请人员</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">申请日期</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">核准人员</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">核准日期</span><input type="text" value="-" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-20">状态</span><input type="text" value="暂存" disabled className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-100 text-slate-500" /></div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-5 py-3 border-t border-slate-200">
              <button onClick={handleApprove} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
              </button>
              <button onClick={handleSave} className="px-6 py-2 text-sm text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap">保存</button>
              <button onClick={() => setShowBudgetAllocation(true)} className="px-6 py-2 text-sm text-teal-700 border border-teal-200 rounded-md hover:bg-teal-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-funds-line" /></div>概算分配
              </button>
              <button onClick={() => setShowModal(false)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Allocation Modal */}
      {showBudgetAllocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[55]" onClick={() => setShowBudgetAllocation(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[1000px] max-w-[95vw] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-base font-semibold text-slate-800">概算分配</h3>
              <button onClick={() => setShowBudgetAllocation(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line text-lg" /></button>
            </div>
            <div className="px-5 py-4">
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-600 mb-4">
                合同占用的概算必须从需求占用的概算里面挑选
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[280px]">概算费用名称</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">概算金额(元)</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">需求已占用金额(元)</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">合同已占用金额(元)</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">本次占用金额</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">是否结余</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600 whitespace-nowrap min-w-[120px]">结余金额(元)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.budgetAllocations.map((item) => {
                      const availableAmount = item.demandOccupied - item.contractOccupied;
                      const isOverLimit = (item.currentOccupied || 0) > availableAmount;
                      const balanceAmount = item.estimateAmount - item.demandOccupied - item.contractOccupied - (item.currentOccupied || 0);
                      const isCategoryLevel1 = item.estimateName.startsWith('设备工器具购置费') || item.estimateName.startsWith('建筑工程费') || item.estimateName.startsWith('安装工程费') || item.estimateName.startsWith('工程建设其他费');
                      const isCategoryLevel2 = item.estimateName.startsWith('  ') && !item.estimateName.startsWith('    ');
                      const isCategoryLevel3 = item.estimateName.startsWith('    ');
                      return (
                        <tr key={item.id} className={`border-b border-slate-100 ${isCategoryLevel1 ? 'bg-slate-100 font-semibold' : isCategoryLevel2 ? 'bg-slate-50' : ''}`}>
                          <td className={`px-3 py-2 text-slate-700 whitespace-nowrap text-xs ${isCategoryLevel3 ? 'pl-8' : ''}`}>{item.estimateName.trim()}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(item.estimateAmount)}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(item.demandOccupied)}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs text-right font-mono">{formatCurrency(item.contractOccupied)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                            {!isCategoryLevel1 ? (
                              <div>
                                <input
                                  type="number" step="1" min="0"
                                  value={item.currentOccupied || ''}
                                  onChange={e => {
                                    const val = Number(e.target.value);
                                    setFormData(prev => ({
                                      ...prev,
                                      budgetAllocations: prev.budgetAllocations.map(b =>
                                        b.id === item.id ? { ...b, currentOccupied: val, balanceAmount: b.estimateAmount - b.demandOccupied - b.contractOccupied - val, isBalance: val > 0 && val >= availableAmount ? '是' : b.isBalance } : b
                                      ),
                                    }));
                                  }}
                                  className={`w-28 px-1 py-1 text-xs border rounded bg-white text-right font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${isOverLimit ? 'border-red-400 bg-red-50 text-red-600' : 'border-slate-300'}`}
                                />
                                {isOverLimit && <span className="text-xs text-red-500 ml-1">超出可用</span>}
                              </div>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-center">
                            {!isCategoryLevel1 ? (
                              <select
                                value={item.isBalance}
                                onChange={e => {
                                  setFormData(prev => ({
                                    ...prev,
                                    budgetAllocations: prev.budgetAllocations.map(b =>
                                      b.id === item.id ? { ...b, isBalance: e.target.value } : b
                                    ),
                                  }));
                                }}
                                className="px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                              >
                                <option value="否">否</option>
                                <option value="是">是</option>
                              </select>
                            ) : null}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs text-right font-mono ${balanceAmount < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                            {!isCategoryLevel1 ? formatCurrency(balanceAmount) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-slate-200 sticky bottom-0 bg-white">
              <button onClick={() => { showToast('概算分配数据已保存'); setShowBudgetAllocation(false); }} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>确认</button>
              <button onClick={() => setShowBudgetAllocation(false)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Flow Modal */}
      {showApprovalFlow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowApprovalFlow(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[560px] max-w-[95vw] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">自定义审批流配置</h3>
              <button onClick={() => setShowApprovalFlow(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line text-lg" /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">审批流程名称</label>
                <input type="text" value={approvalName} onChange={e => setApprovalName(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md" />
              </div>
              <div className="space-y-3">
                {approvalNodes.map((node, idx) => (
                  <div key={node.id} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>{idx + 1}</div>
                    <input type="text" value={node.name} onChange={e => setApprovalNodes(prev => prev.map(n => n.id === node.id ? { ...n, name: e.target.value } : n))} className="flex-1 px-2 py-1.5 text-sm border border-slate-200 rounded-md" />
                    <select value={node.approver} onChange={e => setApprovalNodes(prev => prev.map(n => n.id === node.id ? { ...n, approver: e.target.value } : n))} className="w-32 px-2 py-1.5 text-sm border border-slate-200 rounded-md bg-white">
                      <option value="">选择审批人</option>
                      {approverOptions.map(a => <option key={a}>{a}</option>)}
                    </select>
                    <button onClick={() => setApprovalNodes(prev => prev.filter(n => n.id !== node.id))} className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer"><i className="ri-delete-bin-line" /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => setApprovalNodes(prev => [...prev, { id: String(Date.now()), name: '自定义审批', approver: '' }])} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增审批节点
              </button>
              <div className="flex items-center gap-2 pt-2">
                <button onClick={submitApproval} className="px-4 py-2 text-sm font-medium rounded-md text-white cursor-pointer" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>确认呈核</button>
                <button onClick={() => setShowApprovalFlow(false)} className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Result Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowResult(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-[90vw] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">审批结果</h3>
              <button onClick={() => setShowResult(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line text-lg" /></button>
            </div>
            <div className="px-5 py-4">
              <div className="mb-6">
                <div className="text-sm font-semibold text-slate-700 mb-3">审批进度</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1d4ed8' }}>发</div>
                    <span className="text-xs text-slate-600">发起人</span>
                  </div>
                  <div className="w-6 h-px bg-slate-300" />
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-emerald-500 text-emerald-600 text-xs font-bold"><i className="ri-check-line" /></div>
                    <span className="text-xs text-slate-600">部门负责人</span>
                  </div>
                  <div className="w-6 h-px bg-slate-300" />
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#f59e0b' }}>审</div>
                    <span className="text-xs text-slate-600">分管领导（审批中）</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-3">审批日志</div>
                <div className="space-y-2">
                  {[
                    { operator: '系统', time: '2026-05-22 10:15:00', type: '发起流程', opinion: '提交甲供材异动审批', result: '成功' },
                    { operator: '李建国', time: '2026-05-22 15:30:00', type: '核准', opinion: '同意，甲供材追加合理', result: '通过' },
                    { operator: '王志强', time: '', type: '待审批', opinion: '', result: '处理中' },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded text-xs">
                      <span className="text-slate-500 w-16">{log.time || '-'}</span>
                      <span className="text-slate-700 w-16">{log.operator}</span>
                      <span className={`px-1.5 py-0.5 rounded ${log.type === '核准' ? 'bg-blue-50 text-blue-700' : log.type === '待审批' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{log.type}</span>
                      <span className="text-slate-600 flex-1">{log.opinion || '-'}</span>
                      <span className={log.result === '通过' ? 'text-emerald-600' : log.result === '处理中' ? 'text-amber-600' : 'text-slate-500'}>{log.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteId('')}>
          <div className="bg-white rounded-lg shadow-lg w-[400px] max-w-[90vw] p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center"><i className="ri-question-line text-red-500 text-lg" /></div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">确认删除</h3>
                <p className="text-sm text-slate-500">确定删除该甲供材异动记录？</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setDeleteId('')} className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={() => { setRecords(prev => prev.filter(r => r.id !== deleteId)); setDeleteId(''); showToast('删除成功'); }} className="px-4 py-2 text-sm rounded-md text-white cursor-pointer" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}