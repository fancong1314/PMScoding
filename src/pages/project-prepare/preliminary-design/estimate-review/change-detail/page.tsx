import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { allEstimateChangeLogs, type EstimateItem } from '@/mocks/designReviewMocks';

const formatMoney = (n: number) => {
  if (n === 0) return '0.00';
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function getLevelColors(level: number) {
  if (level === 1) return { bg: 'bg-emerald-50', border: 'border-l-4 border-emerald-400', text: 'text-emerald-800' };
  if (level === 2) return { bg: 'bg-blue-50', border: 'border-l-4 border-blue-400', text: 'text-blue-800' };
  return { bg: 'bg-orange-50', border: 'border-l-4 border-orange-400', text: 'text-orange-800' };
}

function EstimateTable({
  items,
  compareItems,
  title,
}: {
  items: EstimateItem[];
  compareItems: EstimateItem[];
  title: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Build flat list with hierarchy
  const flatRows: { item: EstimateItem; isChanged: boolean; changedFields: Set<string> }[] = [];

  const buildRows = (parentId: string | null) => {
    const children = items.filter((i) => i.parentId === parentId).sort((a, b) => a.id.localeCompare(b.id));
    children.forEach((item) => {
      const compareItem = compareItems.find((c) => c.id === item.id);
      const isChanged = !compareItem || compareItem.revisedAmount !== item.revisedAmount || compareItem.originalAmount !== item.originalAmount;
      const changedFields = new Set<string>();
      if (compareItem && compareItem.revisedAmount !== item.revisedAmount) changedFields.add('revisedAmount');
      if (compareItem && compareItem.originalAmount !== item.originalAmount) changedFields.add('originalAmount');
      flatRows.push({ item, isChanged, changedFields });
      buildRows(item.id);
    });
  };

  buildRows(null);

  const colors = getLevelColors;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-steel-200 bg-slate-50 flex-shrink-0">
        <h3 className="text-sm font-semibold text-steel-800">{title}</h3>
        <p className="text-xs text-steel-400 mt-0.5">共 {items.length} 项</p>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto scroll-sync-panel">
        <table className="w-full text-left" style={{ minWidth: 600 }}>
          <thead className="sticky top-0 z-10">
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">费用名称</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">规格型号</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">采购目录</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">四类九款</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">采购细类</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap text-right">概算原始金额(元)</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap text-right">概算修订金额(元)</th>
            </tr>
          </thead>
          <tbody>
            {flatRows.map(({ item, isChanged, changedFields }) => {
              const levelColor = colors(item.level);
              const indent = item.level * 16;
              return (
                <tr
                  key={item.id}
                  className={`border-b border-steel-100 ${levelColor.bg} ${isChanged ? 'bg-yellow-50/70' : ''} ${levelColor.border}`}
                  style={{ borderLeftWidth: 4 }}
                >
                  <td className="px-3 py-2.5 text-sm text-steel-800 whitespace-nowrap">
                    <span style={{ paddingLeft: indent }}>{item.name}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{item.spec || '-'}</td>
                  <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{item.catalog || '-'}</td>
                  <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{item.fourClassNine || '-'}</td>
                  <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{item.subClass || '-'}</td>
                  <td className={`px-3 py-2.5 text-sm font-mono text-right whitespace-nowrap ${changedFields.has('originalAmount') ? 'text-red-600 font-bold' : 'text-steel-700'}`}>
                    {formatMoney(item.originalAmount)}
                  </td>
                  <td className={`px-3 py-2.5 text-sm font-mono text-right whitespace-nowrap ${changedFields.has('revisedAmount') ? 'text-red-600 font-bold' : 'text-steel-700'}`}>
                    {formatMoney(item.revisedAmount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ChangeDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logId = searchParams.get('id') || '';

  const log = allEstimateChangeLogs.find((l) => l.id === logId);

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftPanel = leftScrollRef.current?.querySelector('.scroll-sync-panel');
    const rightPanel = rightScrollRef.current?.querySelector('.scroll-sync-panel');
    if (!leftPanel || !rightPanel) return;

    let isSyncing = false;

    const syncScroll = (source: Element, target: Element) => {
      if (isSyncing) return;
      isSyncing = true;
      target.scrollTop = source.scrollTop;
      isSyncing = false;
    };

    const handleLeftScroll = () => syncScroll(leftPanel, rightPanel);
    const handleRightScroll = () => syncScroll(rightPanel, leftPanel);

    leftPanel.addEventListener('scroll', handleLeftScroll);
    rightPanel.addEventListener('scroll', handleRightScroll);

    return () => {
      leftPanel.removeEventListener('scroll', handleLeftScroll);
      rightPanel.removeEventListener('scroll', handleRightScroll);
    };
  }, []);

  if (!log) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
            <i className="ri-file-list-3-line text-3xl text-steel-300" />
          </div>
          <p className="text-lg text-steel-500">未找到修改记录</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line mr-1" />返回
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">修改详情</h1>
            <div className="flex items-center gap-4 mt-1 text-xs text-steel-500">
              <span>修改人: <span className="text-steel-800 font-medium">{log.changedBy}</span></span>
              <span>修改时间: <span className="text-steel-800 font-medium">{log.changedAt}</span></span>
              <span>审批结果:
                <span className={`ml-1 px-2 py-0.5 rounded text-xs border ${
                  log.approvalResult === '已通过' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  log.approvalResult === '已驳回' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {log.approvalResult}
                </span>
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
            返回
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 flex-shrink-0 bg-white rounded-lg border border-steel-200 px-4 py-2">
          <span className="text-xs text-steel-500">图例说明:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-50 border-l-2 border-emerald-400" />
            <span className="text-xs text-steel-500">1级大类</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-50 border-l-2 border-blue-400" />
            <span className="text-xs text-steel-500">2级细项</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-orange-50 border-l-2 border-orange-400" />
            <span className="text-xs text-steel-500">3级细项</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-yellow-50 border border-yellow-300" />
            <span className="text-xs text-steel-500">变更项</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-red-600 font-bold">红色加粗</span>
            <span className="text-xs text-steel-500">金额变化</span>
          </div>
        </div>

        {/* Side by Side Tables */}
        <div className="flex-1 flex gap-4 min-h-0">
          <div ref={leftScrollRef} className="flex-1 bg-white rounded-lg border border-steel-200 overflow-hidden flex flex-col">
            <EstimateTable items={log.beforeItems} compareItems={log.afterItems} title="修改前概算明细清单" />
          </div>
          <div ref={rightScrollRef} className="flex-1 bg-white rounded-lg border border-steel-200 overflow-hidden flex flex-col">
            <EstimateTable items={log.afterItems} compareItems={log.beforeItems} title="修改后概算明细清单" />
          </div>
        </div>
      </div>
    </Layout>
  );
}