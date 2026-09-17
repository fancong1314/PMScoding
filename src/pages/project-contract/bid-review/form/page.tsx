import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getBidReviewDemandById,
  getRequirementProjectById,
  handlers,
} from '@/mocks/engineeringRequirementMocks';
import ApprovalFlowModal from '@/pages/project-contract/requirement/components/ApprovalFlowModal';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '基础信息' },
  { key: 'reviewer', label: '审核人员' },
  { key: 'attachment', label: '附件' },
  { key: 'opinion', label: '审核意见' },
];

export default function BidReviewFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const demandId = urlParams.get('demandId') || '';
  const projectId = urlParams.get('projectId') || '';

  const demand = getBidReviewDemandById(demandId);
  const project = getRequirementProjectById(projectId);

  const [formData, setFormData] = useState({
    strategicDirector: demand?.strategicDirector ?? '',
    bidReviewHandler: demand?.bidReviewHandler ?? '',
    reviewOpinion: demand?.reviewOpinion ?? '',
    returnRecord: demand?.returnRecord ?? '',
    bidInternalAttachments: demand?.bidInternalAttachments ?? [],
    bidExternalAttachments: demand?.bidExternalAttachments ?? [],
  });

  const [activeSection, setActiveSection] = useState('basic');
  const [showApprovalFlow, setShowApprovalFlow] = useState(false);
  const [toast, setToast] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    showToast('保存成功');
  };

  const handleSubmit = () => {
    if (!formData.strategicDirector) {
      showToast('战略运营部科长不能为空');
      return;
    }
    if (!formData.bidReviewHandler) {
      showToast('商务标书审核经办人不能为空');
      return;
    }
    if (!formData.reviewOpinion.trim()) {
      showToast('商务标书/退回意见不能为空');
      return;
    }
    setShowApprovalFlow(true);
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
                    activeSection === s.key
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-slate-800">合同商务标书审核呈核</h1>
            <button
              onClick={() => navigate(`/project-contract/bid-review/demand-list?projectId=${projectId}`)}
              className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-left-line" />
              </div>
              返回
            </button>
          </div>

          {/* Project Info */}
          {project && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">立项号</span>
                <span className="text-sm font-medium text-slate-800">{project.approvalNo}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">项目名称</span>
                <span className="text-sm font-medium text-slate-800">{project.name}</span>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">基础信息</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">工程需求编号</span>
                <input
                  type="text"
                  value={demand?.demandNo || ''}
                  disabled
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">工程需求名称</span>
                <input
                  type="text"
                  value={demand?.demandName || ''}
                  disabled
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Reviewer Info */}
          <div ref={(el) => { sectionRefs.current['reviewer'] = el; }} data-section="reviewer" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">审核人员</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32"><span className="text-red-500">*</span>战略运营部科长</span>
                <select
                  value={formData.strategicDirector}
                  onChange={(e) => handleChange('strategicDirector', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {handlers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32"><span className="text-red-500">*</span>商务标书审核经办人</span>
                <select
                  value={formData.bidReviewHandler}
                  onChange={(e) => handleChange('bidReviewHandler', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {handlers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div ref={(el) => { sectionRefs.current['attachment'] = el; }} data-section="attachment" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-rose-500" />
              <span className="text-sm font-semibold text-slate-800">附件</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">对内附件</span>
                <div className="flex items-center gap-2 flex-1">
                  {demand?.internalAttachments?.map((f, i) => (
                    <span key={i} className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded border border-slate-200 flex items-center gap-1">
                      <div className="w-3 h-3 flex items-center justify-center">
                        <i className="ri-file-line" />
                      </div>
                      {f}
                    </span>
                  )) || <span className="text-xs text-slate-400">无</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">对外附件</span>
                <div className="flex items-center gap-2 flex-1">
                  {demand?.externalAttachments?.map((f, i) => (
                    <span key={i} className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded border border-slate-200 flex items-center gap-1">
                      <div className="w-3 h-3 flex items-center justify-center">
                        <i className="ri-file-line" />
                      </div>
                      {f}
                    </span>
                  )) || <span className="text-xs text-slate-400">无</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">商务标对内附件</span>
                <div className="flex items-center gap-2 flex-1">
                  <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-upload-cloud-line" />
                    </div>
                    上传文件
                  </button>
                  <span className="text-xs text-slate-400">已上传 {formData.bidInternalAttachments.length} 个文件</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">商务标对外附件</span>
                <div className="flex items-center gap-2 flex-1">
                  <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-upload-cloud-line" />
                    </div>
                    上传文件
                  </button>
                  <span className="text-xs text-slate-400">已上传 {formData.bidExternalAttachments.length} 个文件</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Opinion */}
          <div ref={(el) => { sectionRefs.current['opinion'] = el; }} data-section="opinion" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-slate-800">审核意见</span>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-1"><span className="text-red-500">*</span>商务标书/退回意见</span>
                <textarea
                  value={formData.reviewOpinion}
                  onChange={(e) => handleChange('reviewOpinion', e.target.value)}
                  rows={4}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="填写商务标书审核意见或退回意见"
                />
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-32 mt-1">退回记录</span>
                <textarea
                  value={formData.returnRecord}
                  disabled
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                  placeholder="系统自动记录退回历史"
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-send-plane-line" />
              </div>
              呈核
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-save-line" />
              </div>
              保存
            </button>
            <button
              onClick={() => navigate(`/project-contract/bid-review/demand-list?projectId=${projectId}`)}
              className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-go-back-line" />
              </div>
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

      {/* Approval Flow Modal */}
      {showApprovalFlow && demand && (
        <ApprovalFlowModal
          demand={demand}
          onClose={() => setShowApprovalFlow(false)}
          onSubmit={() => {
            setShowApprovalFlow(false);
            showToast('审批流程已提交');
          }}
        />
      )}
    </Layout>
  );
}