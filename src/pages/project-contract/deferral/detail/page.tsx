import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getContractById, getApplicationById, getApprovalRecordsByAppId, formatCurrency } from '@/mocks/contractOverdueMocks';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '申请信息' },
  { key: 'records', label: '完整流程记录' },
];

export default function OverdueDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const appId = urlParams.get('appId') || '';

  const contract = getContractById(contractId);
  const app = getApplicationById(appId);
  const approvalRecords = appId ? getApprovalRecordsByAppId(appId) : [];

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [showFlowDetail, setShowFlowDetail] = useState(false);

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

  if (!contract || !app) {
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

        {/* Right Content */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">超期申请详情</h1>
              <p className="text-sm text-slate-500 mt-0.5">{app.appNo}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFlowDetail(true)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-git-branch-line" /></div>查看审批流详情
              </button>
              <button onClick={() => navigate(`/project-contract/deferral/application-list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
              </button>
            </div>
          </div>

          {/* Contract Info Bar */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">申请状态</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                app.status === '已通过' ? 'bg-emerald-50 text-emerald-700' :
                app.status.includes('退回') ? 'bg-red-50 text-red-700' :
                app.status.includes('审核中') ? 'bg-amber-50 text-amber-700' :
                'bg-slate-100 text-slate-600'
              }`}>{app.status}</span>
            </div>
          </div>

          {/* Section 1: Application Info */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">申请信息</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同延期申请单号</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.appNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">立项号</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.approvalNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同编号</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.contractNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同名称</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.contractName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同金额(元)</span>
                  <span className="flex-1 px-3 py-1.5 text-sm font-medium text-slate-800">{formatCurrency(app.contractAmount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">预计免除考核金额</span>
                  <span className="flex-1 px-3 py-1.5 text-sm font-medium text-slate-800">{formatCurrency(app.exemptAmount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">计划开工时间</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.planStartDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">计划完工时间</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.planEndDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">延期计划完成时间</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.delayCompletionDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">延期天数</span>
                  <span className="flex-1 px-3 py-1.5 text-sm font-medium text-amber-600">{app.delayDays} 天</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">类型节点</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.typeNode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">是否影响完工时间</span>
                  <span className={`flex-1 px-3 py-1.5 text-sm font-medium ${app.affectsCompletion === '是' ? 'text-red-600' : 'text-slate-800'}`}>{app.affectsCompletion}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">合同超期原因</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800 whitespace-pre-wrap">{app.overdueReason}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">申报人上传其他附件</span>
                  <div className="flex-1">
                    {app.attachments.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {app.attachments.map((file, fi) => (
                          <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-blue-100">
                            <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-line" /></div>
                            {file}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">暂无附件</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">申报日期</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.applyDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">申请人及电话</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.applicant}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">当前操作人</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.currentOperator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">状态</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    app.status === '已通过' ? 'bg-emerald-50 text-emerald-700' :
                    app.status.includes('退回') ? 'bg-red-50 text-red-700' :
                    app.status.includes('审核中') ? 'bg-amber-50 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{app.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">创建时间</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.createTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">操作时间</span>
                  <span className="flex-1 px-3 py-1.5 text-sm text-slate-800">{app.operateTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Full Approval Records */}
          <div ref={(el) => { sectionRefs.current['records'] = el; }} data-section="records" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-purple-500" />
              <span className="text-sm font-semibold text-slate-800">完整流程记录</span>
            </div>
            {approvalRecords.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">
                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2"><i className="ri-time-line text-lg" /></div>
                暂无流程记录
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
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            rec.action.includes('通过') || rec.action.includes('确认')
                              ? 'bg-emerald-50 text-emerald-700'
                              : rec.action.includes('退回')
                              ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>{rec.action}</span>
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
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => navigate(`/project-contract/deferral/application-list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>返回
            </button>
          </div>
        </div>
      </div>

      {/* Approval Flow Detail Modal */}
      {showFlowDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-[640px] p-5 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">审批流详情</h3>
              <button onClick={() => setShowFlowDetail(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600 mb-2">申请单号：<span className="font-medium text-slate-800">{app.appNo}</span></div>
              <div className="text-sm text-slate-600">合同编号：<span className="font-medium text-slate-800">{app.contractNo}</span></div>
            </div>
            {/* Flow visualization */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500 text-white text-xs font-medium">1</div>
                  <div className="w-0.5 h-10 bg-slate-200" />
                </div>
                <div className="flex-1 pb-2">
                  <div className="text-sm font-medium text-slate-800">项目组审核</div>
                  <div className="text-xs text-slate-500 mt-0.5">经办人提交延期申请 → 项目组审核通过 → 呈核事业部领导</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white text-xs font-medium">2</div>
                  <div className="w-0.5 h-10 bg-slate-200" />
                </div>
                <div className="flex-1 pb-2">
                  <div className="text-sm font-medium text-slate-800">事业部审核</div>
                  <div className="text-xs text-slate-500 mt-0.5">事业部领导审核 → 审核通过后呈核制造部</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 text-white text-xs font-medium">3</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">制造部确认</div>
                  <div className="text-xs text-slate-500 mt-0.5">制造部完成最终确认，合同延期生效</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end mt-6">
              <button onClick={() => setShowFlowDetail(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}