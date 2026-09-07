import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getSubAppById, getSubApprovalRecords } from '@/mocks/subcontractMocks';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '申请基本信息' },
  { key: 'records', label: '完整流程记录' },
];

export default function SubcontractDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const appId = urlParams.get('id') || '';

  const app = getSubAppById(appId);
  const approvalRecords = appId ? getSubApprovalRecords(appId) : [];

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  if (!app) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">数据不存在</div>
      </Layout>
    );
  }

  const statusColorMap: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
  };
  const statusLabelMap: Record<string, string> = {
    pending: '待审核', approved: '已通过', rejected: '已驳回',
  };

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
              <h1 className="text-lg font-semibold text-slate-800">分包申请详情</h1>
              <p className="text-sm text-slate-500 mt-0.5">{app.contractName} — {app.contractNo}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColorMap[app.status]}`}>
                {statusLabelMap[app.status]}
              </span>
              <button onClick={() => navigate('/project-contract/subcontract')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
              </button>
            </div>
          </div>

          {/* Section 1: Basic Info */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">申请基本信息</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同编号</span>
                  <span className="flex-1 text-sm font-medium text-slate-800">{app.contractNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同名称</span>
                  <span className="flex-1 text-sm text-slate-800">{app.contractName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">承包厂商编号</span>
                  <span className="flex-1 text-sm text-slate-800">{app.contractorNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">签订单位</span>
                  <span className="flex-1 text-sm text-slate-800">{app.signingUnit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">分包单位</span>
                  <span className="flex-1 text-sm text-slate-800">{app.subUnit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">分包单位负责人</span>
                  <span className="flex-1 text-sm text-slate-800">{app.subUnitPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">厂商联系方式</span>
                  <span className="flex-1 text-sm text-slate-800">{app.contactInfo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">分包类型</span>
                  <span className="flex-1 text-sm text-slate-800 font-medium">{app.subType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同状态</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.contractStatus === '执行中' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{app.contractStatus}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">附件</span>
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

          {/* Section 2: Approval Records */}
          <div ref={(el) => { sectionRefs.current['records'] = el; }} data-section="records" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-purple-500" />
              <span className="text-sm font-semibold text-slate-800">完整流程记录</span>
            </div>
            {approvalRecords.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">
                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2"><i className="ri-time-line text-lg" /></div>暂无流程记录
              </div>
            ) : (
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
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rec.action.includes('通过') ? 'bg-emerald-50 text-emerald-700' : rec.action.includes('驳回') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>{rec.action}</span>
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operateTime}</td>
                        <td className="px-3 py-2 text-sm text-slate-700">{rec.opinion || '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center pt-4 border-t border-slate-200">
            <button onClick={() => navigate('/project-contract/subcontract')} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>返回
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}