import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { designReviewProjects, allEstimateChangeLogs, type EstimateItem } from '@/mocks/designReviewMocks';
import ApprovalFlowModal from './components/ApprovalFlowModal';
import ChangeLogModal from './components/ChangeLogModal';
import AddItemModal from './components/AddItemModal';
import EstimateTable from './components/EstimateTable';

// === 金额辅助函数 ===
function updateAmountAndParents(items: EstimateItem[], itemId: string, newAmount: number): EstimateItem[] {
  const next = items.map((i) => ({ ...i }));
  const item = next.find((i) => i.id === itemId);
  if (!item) return next;
  item.revisedAmount = newAmount;

  let currentId = item.parentId;
  while (currentId) {
    const parent = next.find((i) => i.id === currentId);
    if (!parent) break;
    const children = next.filter((i) => i.parentId === currentId);
    parent.revisedAmount = children.reduce((sum, c) => sum + c.revisedAmount, 0);
    currentId = parent.parentId;
  }
  return next;
}

function deleteItemAndParents(items: EstimateItem[], itemId: string): EstimateItem[] {
  const idsToDelete = new Set<string>();
  const collect = (id: string) => {
    idsToDelete.add(id);
    items.filter((i) => i.parentId === id).forEach((c) => collect(c.id));
  };
  collect(itemId);

  const item = items.find((i) => i.id === itemId);
  const parentId = item?.parentId || null;

  const next = items.filter((i) => !idsToDelete.has(i.id)).map((i) => ({ ...i }));

  let currentId = parentId;
  while (currentId) {
    const parent = next.find((i) => i.id === currentId);
    if (!parent) break;
    const children = next.filter((i) => i.parentId === currentId);
    parent.revisedAmount = children.reduce((sum, c) => sum + c.revisedAmount, 0);
    currentId = parent.parentId;
  }
  return next;
}

function addItemAndParents(items: EstimateItem[], newItem: EstimateItem): EstimateItem[] {
  const next = [...items.map((i) => ({ ...i })), newItem];

  let currentId = newItem.parentId;
  while (currentId) {
    const parent = next.find((i) => i.id === currentId);
    if (!parent) break;
    const children = next.filter((i) => i.parentId === currentId);
    parent.revisedAmount = children.reduce((sum, c) => sum + c.revisedAmount, 0);
    currentId = parent.parentId;
  }
  return next;
}

function calibrateAmounts(items: EstimateItem[]): EstimateItem[] {
  const next = items.map((i) => ({ ...i }));
  const maxLevel = Math.max(...next.map((i) => i.level));
  for (let l = maxLevel - 1; l >= 1; l--) {
    const parents = next.filter((i) => i.level === l);
    parents.forEach((parent) => {
      const children = next.filter((i) => i.parentId === parent.id);
      parent.revisedAmount = children.reduce((sum, c) => sum + c.revisedAmount, 0);
    });
  }
  return next;
}

const formatMoney = (n: number) => {
  if (n === 0) return '0.00';
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function EstimateReviewPage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') || 'design_001';
  const projectName = decodeURIComponent(searchParams.get('name') || '');
  const approvalNo = decodeURIComponent(searchParams.get('approvalNo') || '');

  const project = useMemo(() => {
    return designReviewProjects.find((p) => p.id === projectId) || designReviewProjects[0];
  }, [projectId]);

  const [estimates, setEstimates] = useState<EstimateItem[]>(project.estimates);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<EstimateItem[]>([]);

  // 默认展开所有有子项的节点
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    project.estimates.forEach((item) => {
      if (project.estimates.some((e) => e.parentId === item.id)) {
        ids.add(item.id);
      }
    });
    return ids;
  });

  const [showApproval, setShowApproval] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalTarget, setAddModalTarget] = useState<{
    parentId: string;
    parentName: string;
    level: number;
  } | null>(null);

  const [toast, setToast] = useState<string>('');

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // 金额统计（仅编辑模式）
  const totalBudget = project.budgetAmount;
  const assignedAmount = useMemo(() => {
    if (!isEditMode) return 0;
    return editData
      .filter((i) => i.level === 1 && i.name !== '项目总投资')
      .reduce((sum, i) => sum + i.revisedAmount, 0);
  }, [editData, isEditMode]);
  const remainingAmount = useMemo(
    () => totalBudget - assignedAmount,
    [totalBudget, assignedAmount]
  );
  const isAmountValid = Math.abs(remainingAmount) < 0.01;

  // 展开收起
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // 进入编辑模式
  const startEdit = useCallback(() => {
    const calibrated = calibrateAmounts(estimates);
    setEditData(calibrated);
    setIsEditMode(true);
  }, [estimates]);

  // 取消编辑
  const cancelEdit = useCallback(() => {
    setEditData([]);
    setIsEditMode(false);
  }, []);

  // 保存编辑（临时保存，退出编辑模式）
  const saveEdit = useCallback(() => {
    setEstimates(editData.map((i) => ({ ...i })));
    setIsEditMode(false);
    setEditData([]);
    setToast('修改已保存');
  }, [editData]);

  // 金额修改
  const handleAmountChange = useCallback((itemId: string, value: string) => {
    const num = Number(value);
    if (isNaN(num) || num < 0) return;
    setEditData((prev) => updateAmountAndParents(prev, itemId, num));
  }, []);

  // 删除细项
  const handleDeleteItem = useCallback(
    (itemId: string) => {
      const item = editData.find((i) => i.id === itemId);
      if (!item) return;
      if (item.level === 1) {
        setToast('一级概算不可删除');
        return;
      }
      if (!window.confirm(`确定删除"${item.name}"吗？删除后将同步更新上级金额。`)) return;
      setEditData((prev) => deleteItemAndParents(prev, itemId));
    },
    [editData]
  );

  // 打开新增弹窗
  const handleOpenAddModal = useCallback(
    (parentId: string, parentName: string, level: number) => {
      if (level >= 3) {
        setToast('三级细项下不可再新增子项');
        return;
      }
      setAddModalTarget({ parentId, parentName, level: level + 1 });
      setShowAddModal(true);
    },
    []
  );

  // 保存新增细项
  const handleSaveNewItem = useCallback((newItem: EstimateItem) => {
    setEditData((prev) => addItemAndParents(prev, newItem));
    setShowAddModal(false);
    setAddModalTarget(null);
    setToast(`已新增细项"${newItem.name}"`);
  }, []);

  // 呈核审批
  const handlePresent = useCallback(() => {
    if (!isAmountValid) {
      setToast(
        `概算总额与立项金额不一致，差额 ${formatMoney(Math.abs(remainingAmount))} 元，无法呈核`
      );
      return;
    }
    setShowApproval(true);
  }, [isAmountValid, remainingAmount]);

  // 提交审批
  const handleSubmitApproval = useCallback(
    (config: { nodes: { node: string; approver: string }[]; remark: string }) => {
      setEstimates(editData.map((i) => ({ ...i })));
      setIsEditMode(false);
      setEditData([]);
      setShowApproval(false);
      setToast('呈核审批已提交，等待审批通过');
    },
    [editData]
  );

  // 当前显示的数据
  const displayData = isEditMode ? editData : estimates;

  return (
    <Layout>
      <div className="space-y-4">
        {/* 项目信息 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">概算审查</h1>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-steel-500">
              <span>
                项目名称:{" "}
                <span className="text-steel-800 font-medium">
                  {projectName || project.name}
                </span>
              </span>
              <span>
                立项号:{" "}
                <span className="text-steel-800 font-medium">
                  {approvalNo || project.approvalNo}
                </span>
              </span>
              <span>
                立项金额:{" "}
                <span className="text-steel-800 font-medium">
                  {formatMoney(project.budgetAmount)} 元
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 金额统计 - 仅编辑模式 */}
        {isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-steel-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary-50">
                  <i className="ri-coins-line text-primary-600" />
                </div>
                <span className="text-sm text-steel-500">立项金额总额</span>
              </div>
              <span className="text-lg font-semibold text-steel-800 font-mono">
                {formatMoney(totalBudget)}
              </span>
            </div>
            <div className="bg-white rounded-lg border border-steel-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-emerald-50">
                  <i className="ri-funds-box-line text-emerald-600" />
                </div>
                <span className="text-sm text-steel-500">已分配金额</span>
              </div>
              <span className="text-lg font-semibold text-emerald-700 font-mono">
                {formatMoney(assignedAmount)}
              </span>
            </div>
            <div className="bg-white rounded-lg border border-steel-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-amber-50">
                  <i className="ri-wallet-3-line text-amber-600" />
                </div>
                <span className="text-sm text-steel-500">待分配金额</span>
              </div>
              <span
                className={`text-lg font-semibold font-mono ${
                  !isAmountValid ? 'text-danger-600' : 'text-emerald-700'
                }`}
              >
                {formatMoney(remainingAmount)}
              </span>
            </div>
          </div>
        )}

        {/* 校验提示 - 仅编辑模式 */}
        {isEditMode && !isAmountValid && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center text-amber-600">
              <i className="ri-error-warning-line" />
            </div>
            <span className="text-sm text-amber-700">
              概算总额与立项金额不一致，差额{" "}
              {formatMoney(Math.abs(remainingAmount))} 元，请调整细项金额使总额保持一致
            </span>
          </div>
        )}

        {isEditMode && isAmountValid && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center text-emerald-600">
              <i className="ri-check-line" />
            </div>
            <span className="text-sm text-emerald-700">
              概算总额与立项金额一致，可以呈核审批
            </span>
          </div>
        )}

        {/* 功能按钮 */}
        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <>
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-edit-line" />
                </div>
                修改
              </button>
              <button
                onClick={() => setShowLog(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-history-line" />
                </div>
                修改日志
              </button>
            </>
          ) : (
            <>
              <button
                onClick={saveEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-save-line" />
                </div>
                保存修改
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-close-line" />
                </div>
                取消修改
              </button>
              <div className="flex-1" />
              <span className="text-xs text-steel-400">
                当前处于编辑模式，可直接修改二级/三级细项金额
              </span>
            </>
          )}
        </div>

        {/* 概算明细表格 */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-steel-700 font-medium">
                概算明细清单
              </span>
              <span className="text-xs text-steel-400">
                共 {displayData.length} 项
              </span>
              {isEditMode && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  编辑中
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: '#e8f5e9',
                    borderLeft: '3px solid #66bb6a',
                  }}
                />
                <span className="text-steel-500">一级大类</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: '#e3f2fd',
                    borderLeft: '3px solid #42a5f5',
                  }}
                />
                <span className="text-steel-500">二级细项</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: '#fff3e0',
                    borderLeft: '3px solid #ffa726',
                  }}
                />
                <span className="text-steel-500">三级细项</span>
              </div>
            </div>
          </div>

          <EstimateTable
            data={displayData}
            isEditMode={isEditMode}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpand}
            onAmountChange={handleAmountChange}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleOpenAddModal}
            formatMoney={formatMoney}
          />
        </div>

        {/* 底部呈核区域 - 仅编辑模式 */}
        {isEditMode && (
          <div className="bg-white rounded-lg border border-steel-200 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-steel-500">立项金额:</span>
                <span className="font-semibold text-steel-800 font-mono">
                  {formatMoney(totalBudget)}
                </span>
              </div>
              <div className="w-px h-4 bg-steel-200" />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-steel-500">已分配:</span>
                <span className="font-semibold text-emerald-700 font-mono">
                  {formatMoney(assignedAmount)}
                </span>
              </div>
              <div className="w-px h-4 bg-steel-200" />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-steel-500">待分配:</span>
                <span
                  className={`font-semibold font-mono ${
                    !isAmountValid ? 'text-danger-600' : 'text-emerald-700'
                  }`}
                >
                  {formatMoney(remainingAmount)}
                </span>
              </div>
            </div>
            <button
              onClick={handlePresent}
              disabled={!isAmountValid}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-sm text-white rounded-md transition-opacity cursor-pointer whitespace-nowrap ${
                !isAmountValid ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-send-plane-line" />
              </div>
              呈核审批
            </button>
          </div>
        )}
      </div>

      {/* 呈核审批弹窗 */}
      {showApproval && (
        <ApprovalFlowModal
          onClose={() => setShowApproval(false)}
          onSubmit={handleSubmitApproval}
        />
      )}

      {/* 修改日志弹窗 */}
      {showLog && (
        <ChangeLogModal
          logs={allEstimateChangeLogs.filter((l) => l.projectId === projectId)}
          onClose={() => setShowLog(false)}
          formatMoney={formatMoney}
        />
      )}

      {/* 新增细项弹窗 */}
      {showAddModal && addModalTarget && (
        <AddItemModal
          parentId={addModalTarget.parentId}
          parentName={addModalTarget.parentName}
          level={addModalTarget.level}
          onClose={() => {
            setShowAddModal(false);
            setAddModalTarget(null);
          }}
          onSave={handleSaveNewItem}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-steel-800 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-information-line" />
            </div>
            {toast}
          </div>
        </div>
      )}
    </Layout>
  );
}