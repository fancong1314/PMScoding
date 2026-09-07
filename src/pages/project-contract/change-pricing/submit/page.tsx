import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getProjectById, getDemandById, formatCurrency } from '@/mocks/changePricingMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';

interface AnchorSection { key: string; label: string; }

const sections: AnchorSection[] = [
  { key: 'basic', label: '基础信息' },
  { key: 'bidding', label: '招标信息' },
  { key: 'accept', label: '承办信息' },
  { key: 'extra', label: '附加信息' },
  { key: 'delegation', label: '委托信息' },
  { key: 'attach', label: '附件区域' },
  { key: 'system', label: '系统信息' },
];

export default function ChangePricingSubmitPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const projectId = urlParams.get('projectId') || '';
  const demandId = urlParams.get('demandId') || '';

  const project = getProjectById(projectId);
  const demand = getDemandById(demandId);

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [toast, setToast] = useState('');
  const [showFlowConfig, setShowFlowConfig] = useState(false);

  const [submitData, setSubmitData] = useState({
    reviewAmount: demand?.demandAmount || 0,
    splitBid: '否',
    engineeringCategory: '',
    procurementMode: '',
    procurementPlan: '',
    weightRatio: 0,
    qualificationLevel: '',
    bidOpenDate: '',
    engineeringVariety: '',
    smartBidding: '否',
    biddingMethod: '',
    supplierLevel: '',
    supplierOnSite: '否',
    demandInfo: '',
    returnReason: '',
    handlerChangeLog: '',
    returnLog: '',
    delegationNo: '',
    mergedDelegationNo: '',
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

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

  const handleSave = () => { showToast('保存成功'); };

  const handleFlowSubmit = () => { setShowFlowConfig(false); showToast('审批已发起'); };

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
            <div><h1 className="text-lg font-semibold text-slate-800">主管单位承办呈核</h1><p className="text-sm text-slate-500 mt-0.5">{demand.demandNo}</p></div>
            <button onClick={() => navigate(`/project-contract/change-pricing/demand-list?projectId=${projectId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
            </button>
          </div>

          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">需求编号</span><span className="text-sm font-medium text-slate-800">{demand.demandNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">需求名称</span><span className="text-sm font-medium text-slate-800">{demand.demandName}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">需求金额</span><span className="text-sm font-medium text-slate-800">{formatCurrency(demand.demandAmount)}</span></div>
          </div>

          {/* Section: Basic Info */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-emerald-500" /><span className="text-sm font-semibold text-slate-800">基础信息</span></div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">工程需求编号</span>
                  <input type="text" value={demand.demandNo} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">工程需求名称</span>
                  <input type="text" value={demand.demandName} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">初审金额</span>
                  <input type="text" value={formatCurrency(submitData.reviewAmount)} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">是否拆分标段</span>
                  <select value={submitData.splitBid} onChange={(e) => setSubmitData({ ...submitData, splitBid: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="否">否</option><option value="是">是</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Bidding */}
          <div ref={(el) => { sectionRefs.current['bidding'] = el; }} data-section="bidding" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-blue-500" /><span className="text-sm font-semibold text-slate-800">招标信息</span></div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32"><span className="text-red-500">*</span>工程分类</span>
                  <select value={submitData.engineeringCategory} onChange={(e) => setSubmitData({ ...submitData, engineeringCategory: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option><option value="GA总包">GA总包</option><option value="GB分包">GB分包</option><option value="GD设备">GD设备</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">采购模式</span>
                  <select value={submitData.procurementMode} onChange={(e) => setSubmitData({ ...submitData, procurementMode: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option><option value="集中采购">集中采购</option><option value="分散采购">分散采购</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">采购计划</span>
                  <select value={submitData.procurementPlan} onChange={(e) => setSubmitData({ ...submitData, procurementPlan: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option><option value="年度计划">年度计划</option><option value="临时计划">临时计划</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">权重比例</span>
                  <input type="number" value={submitData.weightRatio || ''} onChange={(e) => setSubmitData({ ...submitData, weightRatio: Number(e.target.value) })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32"><span className="text-red-500">*</span>资质等级</span>
                  <select value={submitData.qualificationLevel} onChange={(e) => setSubmitData({ ...submitData, qualificationLevel: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option><option value="一级">一级</option><option value="二级">二级</option><option value="三级">三级</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32"><span className="text-red-500">*</span>拟定开标日期</span>
                  <input type="date" value={submitData.bidOpenDate} onChange={(e) => setSubmitData({ ...submitData, bidOpenDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32"><span className="text-red-500">*</span>工程品种</span>
                  <select value={submitData.engineeringVariety} onChange={(e) => setSubmitData({ ...submitData, engineeringVariety: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option><option value="A土建">A土建</option><option value="B安装">B安装</option><option value="C工程设计">C工程设计</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">是否智能评标</span>
                  <select value={submitData.smartBidding} onChange={(e) => setSubmitData({ ...submitData, smartBidding: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="否">否</option><option value="是">是</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32"><span className="text-red-500">*</span>招标方式</span>
                  <select value={submitData.biddingMethod} onChange={(e) => setSubmitData({ ...submitData, biddingMethod: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option><option value="A一般邀请">A一般邀请</option><option value="B有限公开">B有限公开</option><option value="Q完全公开">Q完全公开</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">合格供应商等级要求</span>
                  <select value={submitData.supplierLevel} onChange={(e) => setSubmitData({ ...submitData, supplierLevel: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option><option value="A">A</option><option value="B">B</option><option value="C">C</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">供应商到开标现场</span>
                  <select value={submitData.supplierOnSite} onChange={(e) => setSubmitData({ ...submitData, supplierOnSite: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="否">否</option><option value="是">是</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Accept */}
          <div ref={(el) => { sectionRefs.current['accept'] = el; }} data-section="accept" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-amber-500" /><span className="text-sm font-semibold text-slate-800">承办信息</span></div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-1"><span className="text-red-500">*</span>承办需求信息</span>
                <textarea value={submitData.demandInfo} onChange={(e) => setSubmitData({ ...submitData, demandInfo: e.target.value })} rows={4} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="填写承办说明" />
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-1">承办退回意见</span>
                <textarea value={submitData.returnReason} onChange={(e) => setSubmitData({ ...submitData, returnReason: e.target.value })} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="退回时填写" />
              </div>
            </div>
          </div>

          {/* Extra */}
          <div ref={(el) => { sectionRefs.current['extra'] = el; }} data-section="extra" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-purple-500" /><span className="text-sm font-semibold text-slate-800">附加信息</span></div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-1">主管单位经办人调整记录</span>
                <textarea value={submitData.handlerChangeLog} onChange={(e) => setSubmitData({ ...submitData, handlerChangeLog: e.target.value })} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500 resize-none" placeholder="系统自动记录" />
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-1">退回记录</span>
                <textarea value={submitData.returnLog} onChange={(e) => setSubmitData({ ...submitData, returnLog: e.target.value })} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500 resize-none" placeholder="系统自动记录" />
              </div>
            </div>
          </div>

          {/* Delegation */}
          <div ref={(el) => { sectionRefs.current['delegation'] = el; }} data-section="delegation" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-cyan-500" /><span className="text-sm font-semibold text-slate-800">委托信息</span></div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">委托单号</span>
                  <input type="text" value={submitData.delegationNo} onChange={(e) => setSubmitData({ ...submitData, delegationNo: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32">合并委托单号</span>
                  <input type="text" value={submitData.mergedDelegationNo} onChange={(e) => setSubmitData({ ...submitData, mergedDelegationNo: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="需要将多个合同合并一起招标时填写" />
                </div>
              </div>
            </div>
          </div>

          {/* Attach */}
          <div ref={(el) => { sectionRefs.current['attach'] = el; }} data-section="attach" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-rose-500" /><span className="text-sm font-semibold text-slate-800">附件区域</span></div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-0.5">对内附件上传</span>
                  <div className="flex-1"><button className="px-3 py-1.5 text-xs text-slate-600 border border-dashed border-slate-300 rounded-md hover:bg-white cursor-pointer flex items-center gap-1 whitespace-nowrap"><div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-upload-line" /></div>上传附件</button></div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-0.5">对外附件上传</span>
                  <div className="flex-1"><button className="px-3 py-1.5 text-xs text-slate-600 border border-dashed border-slate-300 rounded-md hover:bg-white cursor-pointer flex items-center gap-1 whitespace-nowrap"><div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-upload-line" /></div>上传附件</button></div>
                </div>
              </div>
            </div>
          </div>

          {/* System */}
          <div ref={(el) => { sectionRefs.current['system'] = el; }} data-section="system" className="mb-8">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full bg-slate-400" /><span className="text-sm font-semibold text-slate-800">系统信息</span></div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-32">创建人</span><input type="text" value="系统用户" disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-32">创建时间</span><input type="text" value="2024-02-15 10:30:00" disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-32">修改人</span><input type="text" value="系统用户" disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-32">修改时间</span><input type="text" value="2024-02-15 10:30:00" disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => setShowFlowConfig(true)} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
            </button>
            <button onClick={handleSave} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line" /></div>保存
            </button>
            <button onClick={() => navigate(`/project-contract/change-pricing/demand-list?projectId=${projectId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">返回</button>
          </div>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
      {showFlowConfig && <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={handleFlowSubmit} defaultTitle={`承办审批-${demand.demandNo}`} />}
    </Layout>
  );
}