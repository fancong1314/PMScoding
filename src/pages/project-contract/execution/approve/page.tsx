import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getApplyById, getContractById, formatCurrency } from '@/mocks/contractExecutionMocks';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '基础信息' },
  { key: 'checklist', label: '施工内容及条件核查' },
  { key: 'approval', label: '审批流程记录' },
];

export default function ContractExecutionApprovePage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const applyId = urlParams.get('applyId') || '';
  const contractId = urlParams.get('contractId') || '';
  const mode = urlParams.get('mode') || 'pass';

  const apply = getApplyById(applyId);
  const contract = getContractById(contractId);

  const [formData, setFormData] = useState({
    abnormalStartDate: apply?.abnormalStartDate || '',
    drawingReviewFiles: apply?.drawingReviewFiles || [],
    contractContent: apply?.contractContentInput || '',
    attachmentFiles: [] as string[],
    approvalOpinion: apply?.approvalOpinion || '',
  });

  const [activeSection, setActiveSection] = useState('basic');
  const [toast, setToast] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.contractContent.trim()) {
      showToast('合同内容不能为空');
      return;
    }
    if (!formData.approvalOpinion.trim()) {
      showToast('审批意见不能为空');
      return;
    }
    showToast(mode === 'pass' ? '审批通过提交成功' : '退回提交成功');
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
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
        {/* Left Anchor Nav */}
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => scrollToSection(s.key)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                    activeSection === s.key ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-slate-800">开工令{mode === 'pass' ? '通过' : '退回'}审批</h1>
            <button
              onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)}
              className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
              返回
            </button>
          </div>

          {/* Basic Info */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">基础信息</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">申请单号</span>
                  <input type="text" value={apply?.applyNo || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">合同编号</span>
                  <input type="text" value={apply?.contractNo || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">合同金额(元)</span>
                  <input type="text" value={formatCurrency(apply?.contractAmount ?? 0)} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">异动开工时间</span>
                  <input type="date" value={formData.abnormalStartDate} onChange={(e) => handleChange('abnormalStartDate', e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">施工图审查资料</span>
                  <div className="flex items-center gap-2 flex-1">
                    <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                      <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-cloud-line" /></div>
                      上传文件
                    </button>
                    <span className="text-xs text-slate-400">已上传 {formData.drawingReviewFiles.length} 个文件</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-1"><span className="text-red-500">*</span>合同内容</span>
                  <textarea value={formData.contractContent} onChange={(e) => handleChange('contractContent', e.target.value)} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入合同内容" />
                </div>
              </div>
              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">建设单位</span>
                  <input type="text" value={apply?.constructionUnit || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">合同名称</span>
                  <input type="text" value={apply?.contractName || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">承建单位</span>
                  <input type="text" value={apply?.contractorUnit || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">附件上传</span>
                  <div className="flex items-center gap-2 flex-1">
                    <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                      <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-cloud-line" /></div>
                      上传文件
                    </button>
                    <span className="text-xs text-slate-400">已上传 {formData.attachmentFiles.length} 个文件</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-1">合同文本</span>
                  <textarea value={apply?.contractText || ''} disabled rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-1"><span className="text-red-500">*</span>审批意见</span>
                  <textarea value={formData.approvalOpinion} onChange={(e) => handleChange('approvalOpinion', e.target.value)} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder={mode === 'pass' ? '请输入审批通过意见' : '请输入退回意见'} />
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Table */}
          <div ref={(el) => { sectionRefs.current['checklist'] = el; }} data-section="checklist" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">规定的施工内容及条件核查表</span>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">序号</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">核查内容</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">完成勾选状态</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">附件</th>
                  </tr>
                </thead>
                <tbody>
                  {apply?.checkItems.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm text-slate-700">{item.content}</td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap">
                        {item.checked ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 flex items-center gap-1 inline-flex">
                            <div className="w-3 h-3 flex items-center justify-center"><i className="ri-checkbox-circle-line" /></div>
                            已完成
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500 flex items-center gap-1 inline-flex">
                            <div className="w-3 h-3 flex items-center justify-center"><i className="ri-close-circle-line" /></div>
                            未完成
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">
                        {item.attachments.length > 0 ? (
                          <div className="flex items-center gap-1">
                            {item.attachments.map((f, fi) => (
                              <span key={fi} className="px-2 py-0.5 text-xs text-slate-600 bg-slate-100 rounded border border-slate-200 flex items-center gap-1">
                                <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line" /></div>
                                {f}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  {apply?.approvalRecords.map((rec) => (
                    <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.stage}</td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          rec.status === '已通过' ? 'bg-emerald-50 text-emerald-700' :
                          rec.status === '已退回' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {rec.action}
                        </span>
                      </td>
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

          {/* Bottom Actions */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
              style={{ background: mode === 'pass' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>
              {mode === 'pass' ? '提交通过' : '提交退回'}
            </button>
            <button
              onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)}
              className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>
              返回
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </Layout>
  );
}