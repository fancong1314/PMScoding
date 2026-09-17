import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getHandoverById, getContractById, HandoverApply } from '@/mocks/contractExecutionMocks';

const sections = [
  { key: 'basic', label: '基础信息' },
  { key: 'edit', label: '交工验收' },
  { key: 'approval', label: '审批流程记录' },
];

export default function HandoverApprovePage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const applyId = urlParams.get('applyId') || '';
  const contractId = urlParams.get('contractId') || '';

  const apply = getHandoverById(applyId);
  const contract = getContractById(contractId);

  const [formData, setFormData] = useState({
    acceptanceConclusion: apply?.acceptanceConclusion || '',
    content: apply?.content || '',
  });
  const [activeSection, setActiveSection] = useState('basic');
  const [toast, setToast] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handlePass = () => {
    showToast('审核通过！交工申请已批准');
  };

  const handleReturn = () => {
    if (!returnReason.trim()) { showToast('请输入退回原因'); return; }
    setShowReturnModal(false);
    showToast('已退回至申报人');
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('data-section') || '');
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    sections.forEach((s) => {
      const el = sectionRefs.current[s.key];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <div className="flex gap-5">
        {/* Left Anchor */}
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.key} onClick={() => scrollToSection(s.key)} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeSection === s.key ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-slate-800">交工审批</h1>
            <button onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
            </button>
          </div>

          {/* Basic Info */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">基础信息</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">工程名称</span><input type="text" value={apply?.projectName || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">合同号</span><input type="text" value={apply?.contractNo || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">建设单位</span><input type="text" value={apply?.constructionUnit || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">开工日期</span><input type="text" value={apply?.startDate || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">监理单位</span><input type="text" value={apply?.supervisorUnit || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">立项号</span><input type="text" value={apply?.approvalNo || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">承建单位</span><input type="text" value={apply?.contractorUnit || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">完工日期</span><input type="text" value={apply?.completionDate || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">施工单位</span><input type="text" value={apply?.constructionCompany || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-600 whitespace-nowrap w-24">主管单位</span><input type="text" value={apply?.responsibleUnit || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" /></div>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">实物交接表</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {(apply?.handoverFiles || []).map((f, i) => (
                    <span key={i} className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded border border-slate-200 flex items-center gap-1">
                      <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line" /></div>
                      {f}
                      <button className="w-4 h-4 flex items-center justify-center text-blue-500 hover:text-blue-700 cursor-pointer ml-1"><i className="ri-download-line" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Editable */}
          <div ref={(el) => { sectionRefs.current['edit'] = el; }} data-section="edit" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">交工验收</span>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24 mt-1">交工验收结论</span>
                <textarea value={formData.acceptanceConclusion} onChange={(e) => setFormData({ ...formData, acceptanceConclusion: e.target.value })} rows={4} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入交工验收结论" />
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24 mt-1">内容</span>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入内容" />
              </div>
            </div>
          </div>

          {/* Approval Records */}
          <div ref={(el) => { sectionRefs.current['approval'] = el; }} data-section="approval" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-slate-800">审批流程记录</span>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核阶段</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作内容</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作日期</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                  </tr>
                </thead>
                <tbody>
                  {(apply?.approvalRecords || []).map((rec) => (
                    <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.stage}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.action}</td>
                      <td className="px-3 py-2 text-sm text-slate-700">{rec.opinion || '--'}</td>
                      <td className="px-3 py-2 text-sm text-slate-700">{rec.content || '--'}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operator}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.date || '--'}</td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.time || '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={handlePass} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>通过
            </button>
            <button onClick={() => setShowReturnModal(true)} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>退回
            </button>
            <button onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>返回
            </button>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl w-[420px]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">退回交工申请</h3>
              <button onClick={() => setShowReturnModal(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="p-5">
              <span className="text-sm text-red-600 mb-2 block"><span className="text-red-500">*</span>退回原因</span>
              <textarea value={returnReason} onChange={(e) => setReturnReason(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" placeholder="请输入退回原因" maxLength={500} />
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
              <button onClick={handleReturn} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>确认退回</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}