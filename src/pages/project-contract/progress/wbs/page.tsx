import Layout from '@/components/feature/Layout';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getContractById } from '@/mocks/contractProgressMocks';
import type { WBSTask } from '@/mocks/contractProgressMocks';
import ReviewModal from './components/ReviewModal';
import ApprovalRecordModal from './components/ApprovalRecordModal';
import ReportRecordModal from './components/ReportRecordModal';

function buildTree(tasks: WBSTask[]): WBSTask[] {
  const map: Record<string, WBSTask> = {};
  const roots: WBSTask[] = [];
  tasks.forEach((t) => { map[t.id] = { ...t, children: [] }; });
  tasks.forEach((t) => {
    if (t.parentId && map[t.parentId]) {
      map[t.parentId].children = map[t.parentId].children ?? [];
      map[t.parentId].children!.push(map[t.id]);
    } else {
      roots.push(map[t.id]);
    }
  });
  return roots;
}

export default function WBSPage() {
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId') ?? '';
  const contract = getContractById(contractId);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showReview, setShowReview] = useState(false);
  const [showApprovalRecord, setShowApprovalRecord] = useState(false);
  const [showReportRecord, setShowReportRecord] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);

  if (!contract) {
    return (
      <Layout>
      <div className="py-12 text-center text-steel-400 text-sm">
        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-steel-300">
          <i className="ri-inbox-line text-3xl" />
        </div>
        未找到合同信息
      </div>
      </Layout>
    );
  }

  const tree = buildTree(contract.wbsTasks);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const wbsStatusColor = (status: string) => {
    const map: Record<string, { bg: string; text: string; border: string }> = {
      '待提交': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
      '待审核': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      '已驳回': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      '已通过': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      '变更审核中': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    };
    return map[status] ?? { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
  };

  const levelBg = (level: number) => {
    if (level === 1) return { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' };
    if (level === 2) return { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800' };
    return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' };
  };

  const renderProgress = (plan: number, actual: number) => {
    const diff = actual - plan;
    return (
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-steel-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${plan}%` }} />
        </div>
        <div className="w-24 h-2 bg-steel-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${diff < 0 ? 'bg-red-400' : 'bg-emerald-500'}`} style={{ width: `${actual}%` }} />
        </div>
        <span className="text-xs font-mono text-steel-500">计划{plan}%</span>
        <span className={`text-xs font-mono ${diff < 0 ? 'text-red-500' : 'text-emerald-600'}`}>实际{actual}%</span>
      </div>
    );
  };

  const renderRows = (tasks: WBSTask[], depth: number = 0) => {
    return tasks.flatMap((task) => {
      const isExpanded = expanded.has(task.id);
      const hasChildren = (task.children?.length ?? 0) > 0;
      const style = levelBg(task.level);
      const rows: JSX.Element[] = [];

      rows.push(
        <tr
          key={task.id}
          className="hover:bg-slate-50/50 transition-colors"
          style={{
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: task.level === 1 ? '#e8f5e9' : task.level === 2 ? '#e0f2fe' : '#fff3e0',
          }}
        >
          <td className="px-3 py-2.5 whitespace-nowrap" style={{ minWidth: 60 }}>
            <div className="flex items-center" style={{ paddingLeft: `${depth * 24}px` }}>
              {hasChildren ? (
                    <button
                  onClick={() => toggleExpand(task.id)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/5 transition-colors cursor-pointer mr-1"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    {isExpanded ? <i className="ri-arrow-down-s-line text-steel-500" /> : <i className="ri-arrow-right-s-line text-steel-500" />}
                  </div>
                </button>
              ) : (
                <span className="w-5 mr-1" />
              )}
              <span className="text-xs font-mono text-steel-400">{(task.children?.length ?? 0) > 0 ? '汇总' : task.level === 3 ? '明细' : ''}</span>
            </div>
          </td>
          <td className={`px-3 py-2.5 font-medium whitespace-nowrap ${style.text}`} style={{ minWidth: 220 }}>
            <div className="flex items-center" style={{ paddingLeft: `${depth * 24}px` }}>
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(task.id)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/5 transition-colors cursor-pointer mr-1 flex-shrink-0"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    {isExpanded ? <i className="ri-arrow-down-s-line text-steel-500" /> : <i className="ri-arrow-right-s-line text-steel-500" />}
                  </div>
                </button>
              )}
              <span className="border-l-2 pl-2" style={{ borderColor: task.level === 1 ? '#66bb6a' : task.level === 2 ? '#42a5f5' : '#ffa726' }}>
                {task.name}
              </span>
            </div>
          </td>
          <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ minWidth: 80 }}>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.taskType === 'leaf' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {task.taskType === 'leaf' ? '可汇报' : '自动汇总'}
            </span>
          </td>
          <td className="px-3 py-2.5 whitespace-nowrap" style={{ minWidth: 260 }}>
            {renderProgress(task.planProgress, task.actualProgress)}
          </td>
          <td className="px-3 py-2.5 text-center whitespace-nowrap font-mono text-xs text-steel-600" style={{ minWidth: 70 }}>
            {task.weight}%
          </td>
          <td className="px-3 py-2.5 whitespace-nowrap text-xs text-steel-600" style={{ minWidth: 180 }}>
            <span className="text-steel-500">计划:</span> {task.planStartDate} ~ {task.planEndDate}
          </td>
          <td className="px-3 py-2.5 whitespace-nowrap text-xs text-steel-600" style={{ minWidth: 180 }}>
            {task.actualStartDate ? (
              <><span className="text-steel-500">实际:</span> {task.actualStartDate} ~ {task.actualEndDate ?? '进行中'}</>
            ) : (
              <span className="text-steel-400">-</span>
            )}
          </td>
          <td className="px-3 py-2.5 text-center whitespace-nowrap" style={{ minWidth: 80 }}>
            {task.isDelayed ? (
              <span className="text-xs text-red-600 font-medium">是</span>
            ) : (
              <span className="text-xs text-steel-400">否</span>
            )}
          </td>
        </tr>
      );

      if (hasChildren && isExpanded) {
        rows.push(...renderRows(task.children!, depth + 1));
      }

      return rows;
    });
  };

  const statusStyle = wbsStatusColor(contract.wbsStatus);

  return (
    <Layout>
    <div className="space-y-4">
      {/* Top Buttons */}
      <div className="bg-white rounded-lg p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {(contract.wbsStatus === '待审核' || contract.wbsStatus === '变更审核中') && (
            <button
              onClick={() => setShowReview(true)}
              className="px-4 py-1.5 text-sm font-medium text-white rounded-md cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
                <i className="ri-check-double-line text-xs" />
              </div>
              审核
            </button>
          )}
          <button
            onClick={() => setShowApprovalRecord(true)}
            className="px-4 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
              <i className="ri-time-line text-xs" />
            </div>
            审批记录
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReportRecord(true)}
            className="px-4 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
              <i className="ri-file-list-3-line text-xs" />
            </div>
            汇报记录
          </button>
          <button
            onClick={() => setShowAttachment(true)}
            className="px-4 py-1.5 text-sm font-medium text-steel-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
              <i className="ri-attachment-line text-xs" />
            </div>
            附件
          </button>
          <button
            className="px-4 py-1.5 text-sm font-medium text-steel-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
              <i className="ri-download-line text-xs" />
            </div>
            下载
          </button>
        </div>
      </div>

      {/* Contract Info */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500">合同名称</span>
              <span className="text-sm font-semibold text-steel-800">{contract.contractName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500">合同编号</span>
              <span className="text-sm font-medium text-steel-700">{contract.contractNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500">WBS状态</span>
              <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                {contract.wbsStatus}
              </span>
            </div>
            {contract.wbsVersion && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-steel-500">当前生效版本</span>
                <span className="text-sm font-medium text-primary-600">{contract.wbsVersion}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-steel-500">整体进度</span>
            <div className="w-40 h-3 bg-steel-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${contract.actualProgress}%` }} />
            </div>
            <span className="text-sm font-medium text-steel-800">{contract.actualProgress}%</span>
          </div>
        </div>
      </div>

      {/* WBS Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Special states */}
        {contract.wbsStatus === '待提交' && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full bg-gray-50">
              <i className="ri-inbox-line text-3xl text-gray-300" />
            </div>
            <p className="text-steel-500 text-sm">施工方尚未提交任务拆解</p>
          </div>
        )}

        {contract.wbsStatus === '已驳回' && (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 flex items-center justify-center text-red-500">
                  <i className="ri-close-circle-line" />
                </div>
                <span className="text-sm font-semibold text-red-700">WBS拆解已驳回</span>
              </div>
              <p className="text-sm text-red-600">甲方已整体驳回，请施工方重新拆解全部任务后再提交。</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-steel-50" style={{ borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 60 }}>序号</th>
                    <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 220 }}>任务名称</th>
                    <th className="px-3 py-2.5 text-center font-medium text-steel-600" style={{ minWidth: 80 }}>任务类型</th>
                    <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 260 }}>进度现状</th>
                    <th className="px-3 py-2.5 text-center font-medium text-steel-600" style={{ minWidth: 70 }}>权重(%)</th>
                    <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 180 }}>计划时间</th>
                    <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 180 }}>实际时间</th>
                    <th className="px-3 py-2.5 text-center font-medium text-steel-600" style={{ minWidth: 80 }}>是否延误</th>
                  </tr>
                </thead>
                <tbody>
                  {renderRows(tree)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(contract.wbsStatus === '已通过' || contract.wbsStatus === '待审核' || contract.wbsStatus === '变更审核中') && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-steel-50" style={{ borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 60 }}>序号</th>
                  <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 220 }}>任务名称</th>
                  <th className="px-3 py-2.5 text-center font-medium text-steel-600" style={{ minWidth: 80 }}>任务类型</th>
                  <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 260 }}>进度现状</th>
                  <th className="px-3 py-2.5 text-center font-medium text-steel-600" style={{ minWidth: 70 }}>权重(%)</th>
                  <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 180 }}>计划时间</th>
                  <th className="px-3 py-2.5 text-left font-medium text-steel-600" style={{ minWidth: 180 }}>实际时间</th>
                  <th className="px-3 py-2.5 text-center font-medium text-steel-600" style={{ minWidth: 80 }}>是否延误</th>
                </tr>
              </thead>
              <tbody>
                {renderRows(tree)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showReview && <ReviewModal contract={contract} onClose={() => setShowReview(false)} />}
      {showApprovalRecord && <ApprovalRecordModal records={contract.approvalRecords} onClose={() => setShowApprovalRecord(false)} />}
      {showReportRecord && <ReportRecordModal records={contract.reportRecords} onClose={() => setShowReportRecord(false)} />}
      {showAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAttachment(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-steel-800 mb-3">任务拆解附件</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-pdf-line text-xs" /></div>
                WBS拆解方案.pdf
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-excel-line text-xs" /></div>
                任务权重分配表.xlsx
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-word-line text-xs" /></div>
                施工计划说明.docx
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowAttachment(false)} className="px-4 py-1.5 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}