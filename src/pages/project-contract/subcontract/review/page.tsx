import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getSubAppById } from '@/mocks/subcontractMocks';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '申请信息' },
  { key: 'review', label: '审核意见' },
];

export default function SubcontractReviewPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const appId = urlParams.get('id') || '';

  const app = getSubAppById(appId);

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [reviewResult, setReviewResult] = useState('');
  const [reviewOpinion, setReviewOpinion] = useState('');
  const [toast, setToast] = useState('');

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

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleSubmit = () => {
    if (!reviewResult) { showToast('请选择审核结果'); return; }
    if (reviewResult === 'reject' && !reviewOpinion.trim()) { showToast('选择"驳回"时请填写审核意见'); return; }
    showToast(reviewResult === 'pass' ? '审核通过，提交成功' : '审核驳回，提交成功');
    setTimeout(() => navigate('/project-contract/subcontract'), 1500);
  };

  if (!app) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">数据不存在</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex gap-5">
        {/* Left Anchor Nav */}
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

        {/* Right Content */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">分包申请审核</h1>
              <p className="text-sm text-slate-500 mt-0.5">{app.contractName} — {app.contractNo}</p>
            </div>
            <button onClick={() => navigate('/project-contract/subcontract')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
            </button>
          </div>

          {/* Section 1: Application Info (Read Only) */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">施工方提交的申请信息</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同编号</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center text-amber-500"><i className="ri-lock-line" /></div>
                      <span className="text-sm text-slate-800 font-medium">{app.contractNo}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">承包厂商编号</span>
                    <span className="flex-1 text-sm text-slate-800">{app.contractorNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">分包单位负责人</span>
                    <span className="flex-1 text-sm text-slate-800">{app.subUnitPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">分包单位</span>
                    <span className="flex-1 text-sm text-slate-800">{app.subUnit}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">附件上传</span>
                    <div className="flex-1 flex flex-wrap gap-2">
                      {app.attachments.map((file, fi) => (
                        <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-blue-100">
                          <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-line" /></div>{file}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">创建人</span>
                    <span className="flex-1 text-sm text-slate-800">{app.creator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">创建日期</span>
                    <span className="flex-1 text-sm text-slate-800">{app.createDate}</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同名称</span>
                    <span className="flex-1 text-sm text-slate-800">{app.contractName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">签订单位</span>
                    <span className="flex-1 text-sm text-slate-800">{app.signingUnit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">厂商联系方式</span>
                    <span className="flex-1 text-sm text-slate-800">{app.contactInfo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">分包类型</span>
                    <span className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-800">{app.subType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同状态</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.contractStatus === '执行中' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{app.contractStatus}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">修改人</span>
                    <span className="flex-1 text-sm text-slate-800">{app.modifier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">修改日期</span>
                    <span className="flex-1 text-sm text-slate-800">{app.modifyDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Review Area */}
          <div ref={(el) => { sectionRefs.current['review'] = el; }} data-section="review" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-slate-800">审核操作</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 font-medium mb-2">审核结果 <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="reviewResult" value="pass" checked={reviewResult === 'pass'} onChange={(e) => setReviewResult(e.target.value)} className="w-4 h-4 text-emerald-500 accent-emerald-500" />
                    <span className="text-sm text-slate-700">通过</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="reviewResult" value="reject" checked={reviewResult === 'reject'} onChange={(e) => setReviewResult(e.target.value)} className="w-4 h-4 text-red-500 accent-red-500" />
                    <span className="text-sm text-slate-700">驳回</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-700 font-medium mb-2">
                  审核意见 {reviewResult === 'reject' && <span className="text-red-500">*</span>}
                </label>
                <textarea value={reviewOpinion} onChange={(e) => setReviewOpinion(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder={reviewResult === 'reject' ? '驳回时请填写审核意见...' : '审核意见（选填）...'} maxLength={500} />
                <div className="text-xs text-slate-400 mt-1">{reviewOpinion.length}/500</div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={handleSubmit} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-check-line" /></div>确认提交
            </button>
            <button onClick={() => navigate('/project-contract/subcontract')} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              取消
            </button>
          </div>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}