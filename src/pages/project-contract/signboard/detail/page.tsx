import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getContractById, getProcessItemById, getItemApprovalRecords } from '@/mocks/signboardMocks';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '工序基本信息' },
  { key: 'result', label: '验收结果' },
  { key: 'supervisor', label: '监理审批意见' },
  { key: 'approval', label: '审批流程记录' },
];

const processStatusLabel: Record<string, string> = {
  pending: '待完成',
  waiting_approval: '待审批',
  approved: '已通过',
  rejected: '已驳回',
};

const processStatusColor: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-600',
  waiting_approval: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
};

export default function SignboardDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const itemId = urlParams.get('itemId') || '';

  const contract = getContractById(contractId);
  const item = getProcessItemById(itemId);
  const approvalRecords = getItemApprovalRecords(itemId);

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

  if (!contract || !item) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">数据不存在</div>
      </Layout>
    );
  }

  const isPending = item.status === 'pending';

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
              <h1 className="text-lg font-semibold text-slate-800">验收结果详情</h1>
              <p className="text-sm text-slate-500 mt-0.5">{item.processName} — {item.processNo}</p>
            </div>
            <button
              onClick={() => navigate(`/project-contract/signboard/management?contractId=${contractId}`)}
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
              <span className="text-sm font-semibold text-slate-800">工序基本信息</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">工序名称</span>
                  <input type="text" value={item.processName} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">分类</span>
                  <input type="text" value={item.category} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">工序编号</span>
                  <input type="text" value={item.processNo} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">计划开始时间</span>
                  <input type="text" value={item.plannedStartDate} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-1">工序说明</span>
                  <textarea value={item.description} disabled rows={2} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500 resize-none" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">计划完成时间</span>
                  <input type="text" value={item.plannedEndDate} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">验收状态</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${processStatusColor[item.status]}`}>
                    {processStatusLabel[item.status]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Result */}
          <div ref={(el) => { sectionRefs.current['result'] = el; }} data-section="result" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">验收结果</span>
            </div>
            {isPending ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">
                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2"><i className="ri-time-line text-lg" /></div>
                待完成 — 尚未上传验收结果
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-28">实际开始时间</span>
                    <input type="text" value={item.actualStartDate || '--'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-28">实际完成时间</span>
                    <input type="text" value={item.actualEndDate || '--'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-1">完成结果</span>
                    <textarea value={item.result || '--'} disabled rows={2} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500 resize-none" />
                  </div>
                </div>
                {item.attachments && item.attachments.length > 0 && (
                  <div className="col-span-2 flex items-start gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-0.5">附件</span>
                    <div className="flex flex-wrap gap-2">
                      {item.attachments.map((file, fi) => (
                        <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-blue-100">
                          <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-line" /></div>
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Supervisor Opinion */}
          <div ref={(el) => { sectionRefs.current['supervisor'] = el; }} data-section="supervisor" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-slate-800">监理审批意见</span>
            </div>
            {isPending ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">
                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2"><i className="ri-time-line text-lg" /></div>
                待完成 — 尚未提交监理审批
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28">审批结果</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.supervisorResult === 'pass' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {item.supervisorResult === 'pass' ? '通过' : '驳回'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-28 mt-1">审批意见</span>
                  <textarea value={item.supervisorOpinion || '--'} disabled rows={2} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500 resize-none" />
                </div>
              </div>
            )}
          </div>

          {/* Approval Records */}
          <div ref={(el) => { sectionRefs.current['approval'] = el; }} data-section="approval" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-purple-500" />
              <span className="text-sm font-semibold text-slate-800">审批流程记录</span>
            </div>
            {approvalRecords.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">暂无审批流程记录</div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">阶段</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalRecords.map((rec) => (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operatorRole}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            rec.operationType.includes('通过') ? 'bg-emerald-50 text-emerald-700' :
                            rec.operationType.includes('驳回') ? 'bg-red-50 text-red-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>{rec.operationType}</span>
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operator}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{rec.operationTime}</td>
                        <td className="px-3 py-2 text-sm text-slate-700">{rec.operationDesc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center pt-4 border-t border-slate-200">
            <button
              onClick={() => navigate(`/project-contract/signboard/management?contractId=${contractId}`)}
              className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>
              返回
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}