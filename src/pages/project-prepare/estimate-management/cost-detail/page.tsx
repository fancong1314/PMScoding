import Layout from '@/components/feature/Layout';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  formatCurrencyFixed,
  getProjectById,
  getProjectFeeLines,
  type EstimateFeeLine,
} from '@/mocks/estimateManagementMocks';
import FeeTransferModal from './components/FeeTransferModal';
import TransferRecordModal from './components/TransferRecordModal';

type SortKey = 'approvedAmount' | 'actualAmount' | 'occupiedAmount' | 'contractOccupied' | 'demandOccupied' | 'availableAmount';

const COLUMNS: { key: SortKey; label: string; accent?: 'sky' | 'amber' }[] = [
  { key: 'approvedAmount', label: '立项批复金额（元）' },
  { key: 'actualAmount', label: '项目实际金额' },
  { key: 'occupiedAmount', label: '项目占用金额', accent: 'sky' },
  { key: 'contractOccupied', label: '合同占用金额', accent: 'sky' },
  { key: 'demandOccupied', label: '需求占用金额', accent: 'sky' },
  { key: 'availableAmount', label: '项目可用金额', accent: 'amber' },
];

function sumOf(rows: EstimateFeeLine[], key: SortKey) {
  return rows.reduce((s, r) => s + r[key], 0);
}

export default function EstimateCostDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const project = useMemo(() => getProjectById(projectId), [projectId]);
  const [version, setVersion] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [transferOpen, setTransferOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [toast, setToast] = useState('');

  const lines = useMemo(() => {
    const rows = getProjectFeeLines(projectId);
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => (sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]));
  }, [projectId, version, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  if (!project) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 px-6 py-16 text-center">
          <p className="text-sm text-slate-500">未找到该项目</p>
          <button
            type="button"
            onClick={() => navigate('/project-prepare/estimate-management')}
            className="mt-4 px-4 py-2 text-sm border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            返回项目列表
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate('/project-prepare/estimate-management')}
            className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            返回项目列表
          </button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-sky-600">{project.name}</h2>
            <button
              type="button"
              onClick={() => setTransferOpen(true)}
              className="px-4 py-1.5 text-sm text-white rounded cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
            >
              费用调拨
            </button>
            <button
              type="button"
              onClick={() => setRecordOpen(true)}
              className="px-4 py-1.5 text-sm text-white rounded cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' }}
            >
              调拨记录
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">费用类型</th>
                  {COLUMNS.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={`inline-flex items-center gap-1 cursor-pointer ${
                          col.accent === 'sky' ? 'text-sky-500' : col.accent === 'amber' ? 'text-amber-600' : 'text-slate-700'
                        }`}
                      >
                        {col.label}
                        <i className={`text-xs ${sortKey === col.key ? (sortAsc ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line') : 'ri-expand-up-down-line'} text-slate-400`} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lines.map((row) => (
                  <tr key={row.type} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-sky-600 whitespace-nowrap">{row.type}</td>
                    {COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-right font-mono whitespace-nowrap ${
                          col.accent === 'sky' ? 'text-sky-600' : col.accent === 'amber' ? 'text-amber-600' : 'text-slate-700'
                        }`}
                      >
                        {formatCurrencyFixed(row[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-sky-50">
                  <td className="px-4 py-3 font-medium text-sky-700">合计</td>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-right font-mono font-medium text-amber-700 whitespace-nowrap">
                      {formatCurrencyFixed(sumOf(lines, col.key))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 text-sm text-slate-500 border-t border-slate-100">
            共 {lines.length} 类费用
          </div>
        </div>
      </div>

      {transferOpen && (
        <FeeTransferModal
          project={project}
          onClose={() => setTransferOpen(false)}
          onSaved={() => {
            setVersion((v) => v + 1);
            showToast('费用调拨已保存');
          }}
        />
      )}
      {recordOpen && (
        <TransferRecordModal project={project} onClose={() => setRecordOpen(false)} />
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] px-4 py-2.5 rounded-lg bg-steel-800 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}
    </Layout>
  );
}
