import Layout from '@/components/feature/Layout';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProjectById, getProjectEstimates, formatCurrency } from '@/mocks/estimateManagementMocks';
import type { EstimateItem } from '@/mocks/estimateManagementMocks';
import ModifyModal from '../components/ModifyModal';
import RevisionLogModal from '../components/RevisionLogModal';

interface RowItem {
  item: EstimateItem;
  depth: number;
  hasChildren: boolean;
  isLast: boolean;
}

function buildRows(items: EstimateItem[], expandedIds: Set<string>): RowItem[] {
  const rows: RowItem[] = [];
  const map = new Map<string, EstimateItem[]>();
  items.forEach((it) => {
    if (it.parentId) {
      const arr = map.get(it.parentId) ?? [];
      arr.push(it);
      map.set(it.parentId, arr);
    }
  });

  function walk(parentId: string | null, depth: number) {
    const children = items.filter((it) => it.parentId === parentId);
    children.forEach((child, idx) => {
      const sub = map.get(child.id) ?? [];
      rows.push({ item: child, depth, hasChildren: sub.length > 0, isLast: idx === children.length - 1 });
      if (sub.length > 0 && expandedIds.has(child.id)) {
        walk(child.id, depth + 1);
      }
    });
  }

  walk(null, 0);
  return rows;
}

function getLevelStyle(level: number) {
  if (level === 1) return { bg: '#e8f5e9', border: '#66bb6a', text: '#1b5e20' };
  if (level === 2) return { bg: '#e3f2fd', border: '#42a5f5', text: '#0d47a1' };
  return { bg: '#fff3e0', border: '#ffa726', text: '#e65100' };
}

export default function EstimateDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') ?? '';
  const project = useMemo(() => getProjectById(projectId), [projectId]);
  const [estimates, setEstimates] = useState<EstimateItem[]>(() => getProjectEstimates(projectId));
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    estimates.forEach((it) => { if (it.parentId === null) set.add(it.id); });
    return set;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModify, setShowModify] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const rows = useMemo(() => buildRows(estimates, expandedIds), [estimates, expandedIds]);

  const totalRevised = useMemo(() => {
    return estimates.filter((it) => it.parentId === null).reduce((s, it) => s + it.revisedAmount, 0);
  }, [estimates]);

  const handleToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelect = (id: string) => {
    const item = estimates.find((it) => it.id === id);
    if (item && item.level > 1) {
      setSelectedId(id === selectedId ? null : id);
    }
  };

  const handleModifySave = (data: { revisedAmount: number; demandAmount: number }) => {
    if (!selectedId) return;
    setEstimates((prev) => {
      const next = prev.map((it) => {
        if (it.id === selectedId) {
          return { ...it, revisedAmount: data.revisedAmount, demandAmount: data.demandAmount, remainingAmount: data.revisedAmount - it.contractAmount, modifiedAt: '2026-05-29 10:00:00', modifier: '管理员' };
        }
        return it;
      });
      return next;
    });
    setShowModify(false);
  };

  const selectedItem = estimates.find((it) => it.id === selectedId);

  if (!project) {
    return (
      <Layout>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 flex items-center justify-center mb-4">
          <i className="ri-error-warning-line text-3xl text-slate-400" />
        </div>
        <p className="text-slate-500 mb-4">未找到项目信息</p>
        <button onClick={() => navigate('/project-prepare/estimate-management')} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          返回列表
        </button>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="space-y-4">
      {/* Project Info */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-800">{project.name}</h2>
          <span className="text-sm text-slate-500">立项号：{project.approvalNo}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
          <div className="bg-slate-50 rounded-md px-3 py-2">
            <div className="text-xs text-slate-500 mb-0.5">立项金额</div>
            <div className="font-mono font-semibold text-slate-800">{formatCurrency(project.budgetAmount)}</div>
          </div>
          <div className="bg-slate-50 rounded-md px-3 py-2">
            <div className="text-xs text-slate-500 mb-0.5">预立项金额</div>
            <div className="font-mono font-semibold text-slate-800">{formatCurrency(project.preBudgetAmount)}</div>
          </div>
          <div className="bg-slate-50 rounded-md px-3 py-2">
            <div className="text-xs text-slate-500 mb-0.5">实际立项金额</div>
            <div className="font-mono font-semibold text-slate-800">{formatCurrency(project.actualBudgetAmount)}</div>
          </div>
          <div className="bg-slate-50 rounded-md px-3 py-2">
            <div className="text-xs text-slate-500 mb-0.5">原始合同金额</div>
            <div className="font-mono font-semibold text-slate-800">{formatCurrency(project.originalContractAmount)}</div>
          </div>
          <div className="bg-slate-50 rounded-md px-3 py-2">
            <div className="text-xs text-slate-500 mb-0.5">修正合同金额</div>
            <div className="font-mono font-semibold text-slate-800">{formatCurrency(project.revisedContractAmount)}</div>
          </div>
          <div className="bg-slate-50 rounded-md px-3 py-2">
            <div className="text-xs text-slate-500 mb-0.5">结算金额</div>
            <div className="font-mono font-semibold text-slate-800">{formatCurrency(project.settledAmount)}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowModify(true)}
          disabled={!selectedId}
          className="px-4 py-2 text-sm font-medium rounded-md text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
        >
          <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
            <i className="ri-edit-line" />
          </div>
          修改
        </button>
        <button
          onClick={() => navigate(`/project-prepare/estimate-management/apply?projectId=${projectId}`)}
          className="px-4 py-2 text-sm font-medium rounded-md text-white cursor-pointer whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
        >
          <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
            <i className="ri-file-edit-line" />
          </div>
          概算修正申请
        </button>
        <button
          onClick={() => setShowLog(true)}
          className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
            <i className="ri-history-line" />
          </div>
          修订日志
        </button>
        <div className="flex-1" />
        <button
          onClick={() => navigate('/project-prepare/estimate-management')}
          className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
            <i className="ri-arrow-left-line" />
          </div>
          返回列表
        </button>
      </div>

      {/* Selected info */}
      {selectedId && selectedItem && (
        <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-2 text-sm text-blue-700 flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-information-line" />
          </div>
          已选中：{selectedItem.name}（{selectedItem.level}级）
        </div>
      )}

      {/* Estimate Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 py-3 text-left font-medium text-slate-600 w-10">选项</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">费用名称</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">规格型号</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">概算原始金额(元)</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">概算修订金额(元)</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">工程需求动用金额(元)</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">合同动用金额(元)</th>
                <th className="px-3 py-3 text-right font-medium text-slate-600">剩余金额(元)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const style = getLevelStyle(row.item.level);
                const isSelected = selectedId === row.item.id;
                return (
                  <tr
                    key={row.item.id}
                    className="border-b border-slate-100 transition-colors"
                    style={{ backgroundColor: style.bg, borderLeft: `3px solid ${style.border}` }}
                  >
                    <td className="px-3 py-3">
                      {row.item.level > 1 && (
                        <input
                          type="radio"
                          name="estimateSelect"
                          checked={isSelected}
                          onChange={() => handleSelect(row.item.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        {row.hasChildren && (
                          <button
                            onClick={() => handleToggle(row.item.id)}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/5 cursor-pointer flex-shrink-0"
                          >
                            <div className="w-4 h-4 flex items-center justify-center">
                              <i className={expandedIds.has(row.item.id) ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />
                            </div>
                          </button>
                        )}
                        {!row.hasChildren && <div className="w-5" />}
                        <div className="flex items-center" style={{ paddingLeft: `${row.depth * 16}px` }}>
                          <span className={`text-slate-800 ${row.item.level === 1 ? 'font-bold' : row.item.level === 2 ? 'font-medium' : ''}`}>
                            {row.item.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{row.item.spec}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600">{formatCurrency(row.item.originalAmount)}</td>
                    <td className="px-3 py-3 text-right font-mono font-semibold text-slate-800">{formatCurrency(row.item.revisedAmount)}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-700">{formatCurrency(row.item.demandAmount)}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600">{formatCurrency(row.item.contractAmount)}</td>
                    <td className="px-3 py-3 text-right font-mono">
                      <span className={row.item.remainingAmount > 0 ? 'text-emerald-600' : row.item.remainingAmount < 0 ? 'text-red-500' : 'text-slate-500'}>
                        {formatCurrency(row.item.remainingAmount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-slate-400">暂无概算明细数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            概算修订金额合计：<span className="font-mono font-semibold text-slate-800">{formatCurrency(totalRevised)}</span> 元
          </div>
          <div className="text-sm text-slate-600">
            立项金额：<span className="font-mono font-semibold text-slate-800">{formatCurrency(project.budgetAmount)}</span> 元
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModify && selectedItem && (
        <ModifyModal
          item={selectedItem}
          onClose={() => setShowModify(false)}
          onSave={handleModifySave}
        />
      )}
      {showLog && (
        <RevisionLogModal
          projectId={projectId}
          onClose={() => setShowLog(false)}
        />
      )}
    </div>
    </Layout>
  );
}