import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getProjectById, getDemandById, getApprovalRecordsByDemandId, formatCurrency } from '@/mocks/changePricingMocks';

interface AnchorSection { key: string; label: string; }

const sections: AnchorSection[] = [
  { key: 'basic', label: '基础信息' },
  { key: 'detail', label: '工程需求明细' },
];

export default function ChangePricingDemandDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const projectId = urlParams.get('projectId') || '';
  const demandId = urlParams.get('demandId') || '';

  const project = getProjectById(projectId);
  const demand = getDemandById(demandId);
  const approvalRecords = getApprovalRecordsByDemandId(demandId);

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.getAttribute('data-section') || ''); }); },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    sections.forEach((s) => { const el = sectionRefs.current[s.key]; if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  if (!project || !demand) {
    return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">数据不存在</div></Layout>;
  }

  const statusColor = (s: string) => {
    const map: Record<string, string> = { '新建': 'bg-blue-50 text-blue-700', '审批中': 'bg-amber-50 text-amber-700', '已通过': 'bg-emerald-50 text-emerald-700', '已驳回': 'bg-red-50 text-red-700', '已撤回': 'bg-slate-100 text-slate-600' };
    return map[s] || 'bg-slate-100 text-slate-600';
  };

  const actionColor = (a: string) => {
    if (a.includes('通过') || a.includes('核准') || a.includes('确认')) return 'bg-emerald-50 text-emerald-700';
    if (a.includes('退回') || a.includes('驳回')) return 'bg-red-50 text-red-700';
    if (a.includes('提交') || a.includes('呈核')) return 'bg-blue-50 text-blue-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <Layout>
      <div className="flex gap-5">
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.key} onClick={() => scrollToSection(s.key)} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeSection === s.key ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>{s.label}</button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-lg font-semibold text-slate-800">工程需求详情</h1><p className="text-sm text-slate-500 mt-0.5">{demand.demandNo}</p></div>
            <button onClick={() => navigate(`/project-contract/change-pricing/demand-list?projectId=${projectId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
            </button>
          </div>

          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">立项号</span><span className="text-sm font-medium text-slate-800">{project.approvalNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">项目名称</span><span className="text-sm font-medium text-slate-800">{project.projectName}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">状态</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(demand.status)}`}>{demand.status}</span></div>
          </div>

          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">基础信息</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['工程需求编号', demand.demandNo],
                  ['工程需求名称', demand.demandName],
                  ['立项号', demand.approvalNo],
                  ['所属事业部', demand.businessUnit],
                  ['工程需求类型', `${demand.firstCategory}${demand.secondCategory ? ` / ${demand.secondCategory}` : ''}`],
                  ['采购目录', demand.procurementCatalog],
                  ['需求部门', demand.demandDept],
                  ['采购方式', demand.procurementMethod],
                  ['是否有甲供材', demand.hasOwnerSupply],
                  ['需求金额', `${formatCurrency(demand.demandAmount)} 元`],
                  ['计划金额', `${formatCurrency(demand.planAmount)} 元`],
                  ['甲供材金额', demand.hasOwnerSupply === '是' ? `${formatCurrency(demand.ownerSupplyAmount)} 元` : '--'],
                  ['选定主管单位经办人', demand.currentHandler],
                  ['是否项目主体合同', demand.isMainContract],
                ].map(([label, value], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">{label}</span>
                    <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{value}</span>
                  </div>
                ))}
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">工程需求原因</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800 whitespace-pre-wrap">{demand.demandReason}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">对内附件</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {demand.internalFiles.map((f, fi) => (
                      <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">对外附件</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {demand.externalFiles.map((f, fi) => (
                      <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>
                    ))}
                    {demand.externalFiles.length === 0 && <span className="text-sm text-slate-400">暂无</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={(el) => { sectionRefs.current['detail'] = el; }} data-section="detail" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">工程需求明细</span>
              <span className="text-xs text-slate-400 ml-2">共 {demand.detailItems.length} 项</span>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工程细项说明</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">招标工程量</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">计量单位</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">绝对工期</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">承包方式</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">暂估金额(元)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">说明</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">使用单位</th>
                  </tr>
                </thead>
                <tbody>
                  {demand.detailItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.description}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap text-right">{item.bidQuantity}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.unit}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.duration}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.contractMethod}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(item.estimatedAmount)}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.remark || '--'}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.userUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Approval Records */}
          {approvalRecords.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-purple-500" />
                <span className="text-sm font-semibold text-slate-800">审批流程记录</span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">序号</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">阶段</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalRecords.map((rec, idx) => (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{idx + 1}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.stage}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operator}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColor(rec.action)}`}>{rec.action}</span></td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operateTime}</td>
                        <td className="px-3 py-2 text-sm text-slate-700">{rec.opinion || '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => navigate(`/project-contract/change-pricing/demand-list?projectId=${projectId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">返回</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}