import Layout from '@/components/feature/Layout';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  estimateProjects,
  estimateApprovalStatusMap,
  estimateMajorTypes,
  ESTIMATE_FIELD_TIPS,
  calcOverrunRate,
  type EstimateApprovalStatus,
  type EstimateProject,
} from '@/mocks/estimateManagementMocks';
import EstimateApprovalFlowModal from '../components/EstimateApprovalFlowModal';
import OccupyAmountDetailModal from '../components/OccupyAmountDetailModal';
import FeeSupplementModal from '../components/FeeSupplementModal';

const projectTypes = ['请选择...', 'A质量品种', 'B安全环保', 'C节能降耗', 'D工艺装备', 'E智能制造', 'F信息化'];
const majorTypeOptions = ['请选择...', ...estimateMajorTypes];

const majorTypeStyle: Record<string, { bg: string; color: string }> = {
  新建: { bg: '#dbeafe', color: '#1d4ed8' },
  技改: { bg: '#dcfce7', color: '#15803d' },
  营缮: { bg: '#fef3c7', color: '#b45309' },
  零固: { bg: '#ede9fe', color: '#6d28d9' },
};

function HoverTip({ text, children }: { text: string; children: ReactNode }) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<{ top: number; left: number; transform: string }>({
    top: 0,
    left: 0,
    transform: 'none',
  });

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    const showBelow = rect.bottom + 80 < window.innerHeight;
    setStyle({
      top: showBelow ? rect.bottom + gap : rect.top - gap,
      left: Math.min(Math.max(12, rect.left + rect.width / 2), window.innerWidth - 12),
      transform: showBelow ? 'translateX(-50%)' : 'translate(-50%, -100%)',
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const hide = () => setOpen(false);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [open]);

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex items-center flex-shrink-0"
        onMouseEnter={place}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </span>
      {open && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none px-2.5 py-1.5 text-[12px] leading-snug text-white bg-steel-800 rounded-md shadow-lg max-w-[280px] whitespace-normal"
          style={{ top: style.top, left: style.left, transform: style.transform }}
        >
          {text}
        </div>,
        document.body,
      )}
    </>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <HoverTip text={text}>
      <i className="ri-information-line text-sky-500 text-xs cursor-help ml-0.5" />
    </HoverTip>
  );
}

function TipHeader({ label, tipKey, align = 'left' }: { label: string; tipKey: string; align?: 'left' | 'right' | 'center' }) {
  const tip = ESTIMATE_FIELD_TIPS[tipKey];
  return (
    <th
      className={`sticky top-0 z-20 bg-slate-50 px-3 py-3 font-medium text-slate-600 whitespace-nowrap ${
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
      }`}
    >
      <span className={`inline-flex items-center ${align === 'right' ? 'justify-end' : ''} gap-0.5`}>
        {label}
        {tip ? <InfoTip text={tip} /> : null}
      </span>
    </th>
  );
}

function OccupyBar({ occupied, available, total }: { occupied: number; available: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((occupied / total) * 100)) : 0;
  const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#16a34a';
  return (
    <div className="min-w-[200px] max-w-[260px]">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-500">占用 {pct}%</span>
        <span className="font-mono text-slate-600">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-xs gap-2">
        <span className="text-amber-700 whitespace-nowrap">
          占用 <span className="font-mono font-medium">{occupied.toLocaleString('zh-CN')}</span>
        </span>
        <span className="text-emerald-700 whitespace-nowrap">
          可用 <span className="font-mono font-medium">{available.toLocaleString('zh-CN')}</span>
        </span>
      </div>
    </div>
  );
}

/** 超概偏差率 · 紧凑饼图（结算相对批复的偏差比例） */
function OverrunRatePie({ settled, approved }: { settled: number; approved: number }) {
  const rate = calcOverrunRate(settled, approved);
  if (rate === null) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  const isOver = rate > 0;
  const isUnder = rate < 0;
  const color = isOver ? '#ef4444' : isUnder ? '#16a34a' : '#94a3b8';
  const track = '#e2e8f0';
  // 饼图扇区：偏差绝对值占满圆的比例，上限 100%
  const fillPct = Math.min(100, Math.abs(rate));
  const label = `${rate > 0 ? '+' : ''}${rate.toFixed(1)}%`;
  const size = 28;
  const r = 10;
  const c = 2 * Math.PI * r;
  const dash = (fillPct / 100) * c;

  return (
    <div className="inline-flex items-center gap-2" title={`超概偏差率 ${label}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth="5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="butt"
        />
      </svg>
      <div className="leading-tight">
        <div className="text-xs font-mono font-medium" style={{ color }}>{label}</div>
        <div className={`text-[10px] ${isOver ? 'text-red-500' : isUnder ? 'text-emerald-600' : 'text-slate-400'}`}>
          {isOver ? '超概' : isUnder ? '结余' : '持平'}
        </div>
      </div>
    </div>
  );
}

export default function EstimateListPage() {
  const navigate = useNavigate();
  const [approvalNo, setApprovalNo] = useState('');
  const [projectName, setProjectName] = useState('');
  const [majorType, setMajorType] = useState('请选择...');
  const [projectType, setProjectType] = useState('请选择...');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [flowProject, setFlowProject] = useState<EstimateProject | null>(null);
  const [occupyProject, setOccupyProject] = useState<EstimateProject | null>(null);
  const [supplementProject, setSupplementProject] = useState<EstimateProject | null>(null);
  const [listTick, setListTick] = useState(0);
  const [toast, setToast] = useState('');

  const filtered = useMemo(() => {
    let data = [...estimateProjects];
    data.sort((a, b) => b.approvalDate.localeCompare(a.approvalDate));
    if (approvalNo) data = data.filter((p) => p.approvalNo.includes(approvalNo));
    if (projectName) data = data.filter((p) => p.name.includes(projectName));
    if (majorType !== '请选择...') data = data.filter((p) => p.majorType === majorType);
    if (projectType !== '请选择...') data = data.filter((p) => p.projectType === projectType);
    return data;
  }, [approvalNo, projectName, majorType, projectType, listTick]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? pageData.map((p) => p.id) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((sid) => sid !== id)));
  };

  const handleRowClick = (id: string) => {
    navigate(`/project-prepare/estimate-management/detail?projectId=${id}`);
  };

  const handleQuery = () => {
    setPage(1);
  };

  const formatAmount = (v: number) => v.toLocaleString('zh-CN');

  const goCostDetail = (id: string) => {
    navigate(`/project-prepare/estimate-management/cost-detail?projectId=${id}`);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">立项号</label>
              <input type="text" value={approvalNo} onChange={(e) => setApprovalNo(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400" placeholder="请输入立项号" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">项目名称</label>
              <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400" placeholder="请输入项目名称" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">项目大类</label>
              <select value={majorType} onChange={(e) => setMajorType(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400 bg-white">
                {majorTypeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">项目类型</label>
              <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary-400 bg-white">
                {projectTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleQuery} className="px-5 py-2 text-sm font-medium rounded-md text-white whitespace-nowrap cursor-pointer" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                <span className="w-4 h-4 inline-flex items-center justify-center mr-1">
                  <i className="ri-search-line" />
                </span>
                查询
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="sticky left-0 top-0 z-30 bg-slate-50 px-3 py-3 w-10 text-left font-medium text-slate-600 border-r border-slate-200">
                    <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={pageData.length > 0 && pageData.every((p) => selectedIds.includes(p.id))} className="w-4 h-4 cursor-pointer" />
                  </th>
                  <th className="sticky left-10 top-0 z-30 bg-slate-50 px-3 py-3 w-[120px] text-left font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap">
                    立项号
                  </th>
                  <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">项目名称</th>
                  <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">项目大类</th>
                  <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">项目类型</th>
                  <TipHeader label="立项申报金额（元）" tipKey="budgetAmount" align="right" />
                  <TipHeader label="立项批复金额（元）" tipKey="preBudgetAmount" align="right" />
                  <TipHeader label="实际立项金额（元）" tipKey="actualBudgetAmount" align="right" />
                  <TipHeader label="合同签订总额（元）" tipKey="originalContractAmount" align="right" />
                  <TipHeader label="修正合同总额（元）" tipKey="revisedContractAmount" align="right" />
                  <TipHeader label="项目完工金额（元）" tipKey="completedAmount" align="right" />
                  <TipHeader label="项目已支付总额（元）" tipKey="paidAmount" align="right" />
                  <TipHeader label="项目结算总额（元）" tipKey="settledAmount" align="right" />
                  <TipHeader label="超概偏差率" tipKey="overrunRate" />
                  <TipHeader label="金额占用情况" tipKey="occupy" />
                  <th className="sticky top-0 z-20 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600 whitespace-nowrap">增补审批状态</th>
                  <th className="sticky right-0 top-0 z-30 bg-slate-50 px-3 py-3 text-center font-medium text-slate-600 whitespace-nowrap border-l border-slate-200" style={{ minWidth: 200 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((project) => {
                  const mt = majorTypeStyle[project.majorType] ?? { bg: '#f1f5f9', color: '#475569' };
                  const statusCls = estimateApprovalStatusMap[project.approvalStatus as EstimateApprovalStatus]?.cls ?? 'bg-slate-100 text-slate-600';
                  return (
                    <tr key={project.id} className="group border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleRowClick(project.id)}>
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 px-3 py-3 border-r border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={selectedIds.includes(project.id)} onChange={(e) => handleSelectRow(project.id, e.target.checked)} className="w-4 h-4 cursor-pointer" />
                      </td>
                      <td className="sticky left-10 z-10 bg-white group-hover:bg-slate-50 px-3 py-3 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap">
                        {project.approvalNo}
                      </td>
                      <td className="px-3 py-3 text-slate-700 whitespace-nowrap">{project.name}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: mt.bg, color: mt.color }}>{project.majorType}</span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>{project.projectType}</span>
                      </td>
                      <td className="px-3 py-3 text-right text-slate-700 font-mono whitespace-nowrap">{formatAmount(project.budgetAmount)}</td>
                      <td className="px-3 py-3 text-right text-slate-700 font-mono whitespace-nowrap">{formatAmount(project.preBudgetAmount)}</td>
                      <td className="px-3 py-3 text-right text-slate-700 font-mono font-medium whitespace-nowrap">{formatAmount(project.actualBudgetAmount)}</td>
                      <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.originalContractAmount)}</td>
                      <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.revisedContractAmount)}</td>
                      <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.completedAmount)}</td>
                      <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.paidAmount)}</td>
                      <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{formatAmount(project.settledAmount)}</td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <OverrunRatePie settled={project.settledAmount} approved={project.preBudgetAmount} />
                      </td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setOccupyProject(project)}
                          className="text-left cursor-pointer rounded-md hover:bg-sky-50/80 p-1 -m-1 transition-colors"
                          title="点击查看占用金额明细"
                        >
                          <OccupyBar
                            occupied={project.occupiedAmount}
                            available={project.availableAmount}
                            total={project.actualBudgetAmount}
                          />
                        </button>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setFlowProject(project)}
                          className={`inline-flex px-2 py-0.5 text-xs rounded-full font-medium cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-primary-300 transition ${statusCls}`}
                          title="点击查看增补审批流程"
                        >
                          {project.approvalStatus}
                        </button>
                      </td>
                      <td className="sticky right-0 z-10 bg-white group-hover:bg-slate-50 px-3 py-3 text-center border-l border-slate-100 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSupplementProject(project)}
                            className="text-sm text-primary-600 hover:text-primary-700 cursor-pointer"
                          >
                            费用增补申请
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => goCostDetail(project.id)}
                            className="text-sm text-sky-600 hover:text-sky-700 cursor-pointer"
                          >
                            费用明细
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={17} className="px-3 py-8 text-center text-slate-400">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>共 {total} 条</span>
              <span>每页</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-2 py-1 text-sm border border-slate-200 rounded bg-white">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>条</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50">首页</button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50">上一页</button>
              <span className="px-3 py-1.5 text-sm text-slate-600">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50">下一页</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50">末页</button>
            </div>
          </div>
        </div>
      </div>

      {flowProject && (
        <EstimateApprovalFlowModal
          project={flowProject}
          onClose={() => setFlowProject(null)}
          onChanged={() => setListTick((n) => n + 1)}
        />
      )}
      {occupyProject && (
        <OccupyAmountDetailModal project={occupyProject} onClose={() => setOccupyProject(null)} />
      )}
      {supplementProject && (
        <FeeSupplementModal
          project={supplementProject}
          onClose={() => setSupplementProject(null)}
          onSubmitted={(msg) => {
            setListTick((n) => n + 1);
            showToast(msg);
          }}
        />
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] px-4 py-2.5 rounded-lg bg-steel-800 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}
    </Layout>
  );
}
