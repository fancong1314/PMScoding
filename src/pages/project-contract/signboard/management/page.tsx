import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getContractById, getProcessItemsByContractId, getScheduleStatusLabel, getScheduleStatusColor } from '@/mocks/signboardMocks';
import ScheduleApprovalModal from '../components/ScheduleApprovalModal';
import ApprovalRecordModal from '../components/ApprovalRecordModal';

const processStatusTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待完成', badge: true },
  { key: 'waiting_approval', label: '待审批', badge: true },
  { key: 'approved', label: '已通过', badge: true },
  { key: 'rejected', label: '已驳回', badge: true },
];

const processStatusLabel: Record<string, string> = {
  pending: '待完成',
  waiting_approval: '待审批',
  approved: '已通过',
  rejected: '已驳回',
};

const processStatusColor: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-600',
  waiting_approval: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
};

export default function SignboardManagementPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';

  const contract = getContractById(contractId);
  const allItems = getProcessItemsByContractId(contractId);

  const [activeTab, setActiveTab] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordModalType, setRecordModalType] = useState<'schedule' | 'item'>('schedule');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const overdueCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return allItems.filter((i) => i.status === 'pending' && i.plannedEndDate < today).length;
  }, [allItems]);

  const countByStatus = useMemo(() => {
    const counts: Record<string, number> = { pending: 0, waiting_approval: 0, approved: 0, rejected: 0 };
    allItems.forEach((i) => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return counts;
  }, [allItems]);

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return allItems;
    return allItems.filter((i) => i.status === activeTab);
  }, [allItems, activeTab]);

  const handleApprovalSubmit = (result: 'pass' | 'reject', opinion: string) => {
    showToast(result === 'pass' ? '审批通过提交成功' : '审批驳回提交成功，已退回施工方');
  };

  const handleExport = () => {
    showToast('正在导出工序细项及验收结果数据...');
  };

  if (!contract) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同不存在</div>
      </Layout>
    );
  }

  const isPending = contract.scheduleStatus === 'pending';

  const columns = [
    { key: 'processName', title: '工序名称', width: 200 },
    { key: 'category', title: '分类', width: 90 },
    { key: 'processNo', title: '工序编号', width: 120 },
    { key: 'description', title: '工序说明', width: 300 },
    { key: 'plannedTime', title: '计划开始完成时间', width: 220 },
    { key: 'status', title: '状态', width: 100 },
    { key: 'overdue', title: '超期标识', width: 90 },
    { key: 'actions', title: '操作', width: 180 },
  ];

  return (
    <Layout>
      {/* Status Overview */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/project-contract/signboard')}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer text-slate-400"
            >
              <i className="ri-arrow-left-line" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">工序预排与验收管理</h1>
              <p className="text-sm text-slate-500 mt-0.5">{contract.contractName} — {contract.contractNo}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">合同名称：</span>
            <span className="text-sm font-medium text-slate-800">{contract.contractName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">合同编号：</span>
            <span className="text-sm font-medium text-slate-800">{contract.contractNo}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">预排状态：</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScheduleStatusColor(contract.scheduleStatus)}`}>
              {getScheduleStatusLabel(contract.scheduleStatus)}
            </span>
          </div>
          <div className="flex-1" />
          {contract.scheduleStatus === 'project_review' && (
            <button
              onClick={() => setShowApprovalModal(true)}
              className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-check-double-line" /></div>
              审批
            </button>
          )}
          <button
            onClick={() => { setRecordModalType('schedule'); setShowRecordModal(true); }}
            className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-history-line" /></div>
            审批记录
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line" /></div>
            导出
          </button>
          {overdueCount > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-slate-500">超期预警：</span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">{overdueCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Process Items */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 border-b border-slate-200 pb-3">
          {processStatusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-sm rounded-md cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {countByStatus[tab.key] || 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {isPending ? (
          <div className="text-center py-16 text-slate-400">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3"><i className="ri-file-list-3-line text-3xl" /></div>
            <p className="text-sm">施工方尚未提交工序预排</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 440px)' }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-20">
                <tr className="bg-slate-50" style={{ borderBottom: '1px solid #e2e8f0' }}>
                  {columns.map((col, idx) => (
                    <th
                      key={col.key}
                      className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap"
                      style={
                        col.key === 'processName'
                          ? { position: 'sticky', left: 0, zIndex: 30, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }
                          : col.key === 'actions'
                            ? { position: 'sticky', right: 0, zIndex: 30, backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0' }
                            : undefined
                      }
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const isOverdue = item.status === 'pending' && item.plannedEndDate < new Date().toISOString().split('T')[0];
                  return (
                    <tr key={item.id} className="group hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
                        {item.processName}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.category}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.processNo}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.description}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">
                        {item.plannedStartDate} ~ {item.plannedEndDate}
                      </td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${processStatusColor[item.status]}`}>
                          {processStatusLabel[item.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap">
                        {isOverdue && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">超期</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/project-contract/signboard/detail?contractId=${contractId}&itemId=${item.id}`)}
                            className="px-2.5 py-1 text-xs text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 cursor-pointer whitespace-nowrap"
                          >
                            查看详情
                          </button>
                          {(item.status === 'approved' || item.status === 'rejected') && (
                            <button
                              onClick={() => { setRecordModalType('item'); setShowRecordModal(true); }}
                              className="px-2.5 py-1 text-xs text-purple-600 border border-purple-200 rounded-md hover:bg-purple-50 cursor-pointer whitespace-nowrap"
                            >
                              审批记录
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-12 text-center text-slate-400 text-sm">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showApprovalModal && (
        <ScheduleApprovalModal
          contractId={contractId}
          contractName={contract.contractName}
          onClose={() => setShowApprovalModal(false)}
          onSubmit={handleApprovalSubmit}
        />
      )}
      {showRecordModal && (
        <ApprovalRecordModal
          contractId={contractId}
          contractName={contract.contractName}
          type={recordModalType}
          onClose={() => setShowRecordModal(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </Layout>
  );
}