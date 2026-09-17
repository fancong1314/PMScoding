import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { postEvalProjects, getProfEvalData, getApprovalDetail, evalItems, type ProfEvalData } from '@/mocks/postEvaluationMocks';

// 呈核配置弹窗
function PresentModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [steps, setSteps] = useState([
    { id: 's1', name: '本单位分管领导', approver: '刘志刚', order: 1 },
    { id: 's2', name: '事业部中层领导', approver: '李志明', order: 2 },
    { id: 's3', name: '总师室领导', approver: '陈总师', order: 3 },
  ]);
  const [opinion, setOpinion] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-[600px] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">呈核 - 自定义审批流配置</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
        </div>
        <div className="px-5 py-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">审批节点配置</h3>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-md border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">{step.order}</div>
                <div className="flex-1">
                  <input type="text" value={step.name} onChange={e => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, name: e.target.value } : s))} placeholder="节点名称" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 mb-1" />
                  <input type="text" value={step.approver} onChange={e => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, approver: e.target.value } : s))} placeholder="审批人姓名" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
                <div className="flex items-center gap-1">
                  {idx > 0 && <button onClick={() => setSteps(prev => { const ns = [...prev]; [ns[idx-1], ns[idx]] = [ns[idx], ns[idx-1]]; return ns.map((s, i) => ({ ...s, order: i + 1 })); })} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer text-slate-500"><i className="ri-arrow-up-s-line text-xs" /></button>}
                  {idx < steps.length - 1 && <button onClick={() => setSteps(prev => { const ns = [...prev]; [ns[idx], ns[idx+1]] = [ns[idx+1], ns[idx]]; return ns.map((s, i) => ({ ...s, order: i + 1 })); })} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer text-slate-500"><i className="ri-arrow-down-s-line text-xs" /></button>}
                  <button onClick={() => setSteps(prev => prev.filter(s => s.id !== step.id).map((s, i) => ({ ...s, order: i + 1 })))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer text-red-400"><i className="ri-delete-bin-line text-xs" /></button>
                </div>
              </div>
            ))}
            <button onClick={() => setSteps(prev => [...prev, { id: `s${Date.now()}`, name: '', approver: '', order: prev.length + 1 }])} className="w-full py-2 text-xs text-amber-600 border border-dashed border-amber-300 rounded-md hover:bg-amber-50 cursor-pointer flex items-center justify-center gap-1">
              <i className="ri-add-line" />添加审批节点
            </button>
          </div>
          <div className="mt-4">
            <label className="text-xs text-slate-600 block mb-1">呈核说明（可选）</label>
            <textarea value={opinion} onChange={e => setOpinion(e.target.value)} rows={3} placeholder="请输入呈核说明..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">取消</button>
          <button onClick={onSubmit} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>确认发起审批</button>
        </div>
      </div>
    </div>
  );
}

export default function ProfEvalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const itemId = searchParams.get('itemId') || '';

  const project = postEvalProjects.find(p => p.id === projectId);
  const evalData = getProfEvalData(projectId, itemId);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPresentModal, setShowPresentModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnNode, setReturnNode] = useState<string>('');
  const [returnReason, setReturnReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState<ProfEvalData | null>(null);
  useEffect(() => { if (evalData) setForm({ ...evalData }); }, [projectId, itemId]);

  const isBenefitEval = searchParams.get('itemId') ? (() => {
    const itemIdParam = searchParams.get('itemId') || '';
    // We check the eval item from the project's evalItems
    const allItems = Object.values(evalItems).flat();
    const found = allItems.find(ei => ei.id === itemIdParam || ei.id === itemId);
    return found?.evalFunction === '经济效益评价';
  })() : false;

  if (!project || !form) {
    return <Layout><div className="flex items-center justify-center py-20 text-slate-400">未找到评价数据</div></Layout>;
  }

  const approvalDetail = getApprovalDetail('专评');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(`/project-close/post-evaluation/catalog?id=${projectId}`)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer">
                <i className="ri-arrow-left-line text-slate-500" />
              </button>
              <h1 className="text-base font-semibold text-slate-800">专评 - {project.projectName}</h1>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">专业评价</span>
          </div>

          {successMsg && (
            <div className="mx-5 mt-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700 flex items-center gap-1">
              <i className="ri-check-line" />{successMsg}
            </div>
          )}

          {/* Project Info */}
          <div className="px-5 py-3 border-b border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
            {[
              { label: '立项号', value: project.approvalNo },
              { label: '项目名称', value: project.projectName },
              { label: '立项时间', value: project.approvalDate },
              { label: '项目类型', value: project.projectType },
              { label: '主管单位', value: project.supervisorUnit },
              { label: '实施单位', value: project.ownerUnit },
            ].map((row, i) => (
              <div key={i}><span className="text-slate-500">{row.label}：</span><span className="text-slate-800 font-medium">{row.value}</span></div>
            ))}
          </div>

          {/* Eval Form */}
          <div className="px-5 py-4 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-amber-500 rounded-full" />项目主要内容
              </h3>
              <div className="px-3 py-2 bg-slate-50 rounded-md text-sm text-slate-600">{form.planContent}</div>
            </div>

            {/* 项目论证意见 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-violet-500 rounded-full" />项目论证意见
              </h3>
              <div className="px-3 py-2 bg-violet-50 rounded-md border border-violet-100 text-sm text-slate-700">{form.argumentOpinion || '暂无'}</div>
            </div>

            {/* 批示意见 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />批示意见
              </h3>
              <textarea
                value={form.instructionOpinion}
                onChange={e => setForm({...form, instructionOpinion: e.target.value})}
                rows={4}
                placeholder="请输入批示意见..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
              />
            </div>

            {/* 经济效益评价特有：申报年效益 & 审核年效益 */}
            {isBenefitEval && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-amber-500 rounded-full" />申报年效益（万元）
                  </h3>
                  <input
                    type="number"
                    value={form.declareBenefit}
                    onChange={e => setForm({...form, declareBenefit: e.target.value})}
                    placeholder="请输入申报年效益"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50"
                    step="1"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-amber-500 rounded-full" />审核年效益（万元）
                  </h3>
                  <input
                    type="number"
                    value={form.reviewBenefit}
                    onChange={e => setForm({...form, reviewBenefit: e.target.value})}
                    placeholder="请输入审核年效益"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50"
                    step="1"
                  />
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-amber-500 rounded-full" />专业考评意见 <span className="text-red-500 text-xs font-normal">*</span>
              </h3>
              <textarea value={form.profOpinion} onChange={e => setForm({...form, profOpinion: e.target.value})} rows={5}
                placeholder="请输入专业考评意见，对项目施工质量、技术指标、安全环保等方面进行全面评价..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" />
            </div>

            {/* Self-eval result reference */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-sky-500 rounded-full" />自评结果参考
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-sky-50 rounded-md">
                <div><span className="text-slate-500">验收合格：</span><span className="text-slate-800">是</span></div>
                <div><span className="text-slate-500">设备验收：</span><span className="text-slate-800">是</span></div>
                <div><span className="text-slate-500">热负荷试车：</span><span className="text-slate-800">是</span></div>
                <div><span className="text-slate-500">整改项：</span><span className="text-slate-800">无</span></div>
                <div><span className="text-slate-500">技术目标实现：</span><span className="text-slate-800">已全面实现</span></div>
                <div><span className="text-slate-500">自评总得分：</span><span className="text-slate-800 font-semibold">92分</span></div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50">
            <button onClick={() => navigate(`/project-close/post-evaluation/catalog?id=${projectId}`)}
              className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
              <i className="ri-arrow-left-line" />取消
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setSuccessMsg('暂存成功')} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}>暂存</button>
              <button onClick={() => setShowPresentModal(true)} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
              <button onClick={() => setShowApprovalModal(true)} className="px-4 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer whitespace-nowrap">审批详情</button>
              <button onClick={() => setSuccessMsg('领导已确认')} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>领导确认</button>
              <button onClick={() => setShowReturnModal(true)} className="px-4 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">退回</button>
              <button onClick={() => window.print()} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
                <i className="ri-printer-line" />列印
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPresentModal && <PresentModal onClose={() => setShowPresentModal(false)} onSubmit={() => { setShowPresentModal(false); setSuccessMsg('呈核成功，审批已发起'); }} />}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={() => setShowApprovalModal(false)}>
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-[580px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-800">审批详情 - 专评</h2>
              <button onClick={() => setShowApprovalModal(false)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">审批单号：</span><span className="text-slate-800 font-medium">{approvalDetail.approvalNo}</span></div>
              <div><span className="text-slate-500">业务类型：</span><span className="text-slate-800">专评</span></div>
              <div><span className="text-slate-500">发起人：</span><span className="text-slate-800">{approvalDetail.applicant}</span></div>
              <div><span className="text-slate-500">发起时间：</span><span className="text-slate-800">{approvalDetail.applyTime}</span></div>
            </div>
            <div className="px-5 py-4">
              <div className="relative pl-8">
                <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-slate-200" />
                {approvalDetail.nodes.slice(0, 2).map((node, idx) => {
                  const isApproved = node.status === 'approved';
                  const sc = isApproved ? 'bg-emerald-500' : 'bg-slate-300';
                  const tc = isApproved ? 'text-emerald-600' : 'text-slate-400';
                  const bc = isApproved ? 'border-emerald-100' : 'border-slate-100';
                  return (
                    <div key={idx} className={`relative mb-3 last:mb-0 p-3 rounded-md border ${bc}`}>
                      <div className={`absolute -left-[22px] top-3 w-3 h-3 rounded-full border-2 border-white ${sc}`} />
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-800">{node.seq}. {node.nodeName}</span>
                        <span className={`text-xs font-medium ${tc}`}>{isApproved ? '已通过' : '待审批'}</span>
                      </div>
                      <p className="text-xs text-slate-600">审批人：{node.reviewer}</p>
                      {node.opinion && <p className="text-xs text-slate-500 mt-1">意见：{node.opinion}</p>}
                      {node.time && <p className="text-xs text-slate-400 mt-1">时间：{node.time}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowApprovalModal(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={() => setShowReturnModal(false)}>
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-[480px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-800">退回</h2>
              <button onClick={() => setShowReturnModal(false)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-xs text-slate-600 mb-1 block">退回节点 <span className="text-red-500">*</span></label>
                <select value={returnNode} onChange={e => setReturnNode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                  <option value="">请选择退回节点</option>
                  <option value="自评">自评</option>
                  <option value="环保评价">环保评价</option>
                  <option value="安全评价">安全评价</option>
                  <option value="效防评价">效防评价</option>
                  <option value="节能评价">节能评价</option>
                  <option value="经济效益评价">经济效益评价</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 mb-1 block">退回原因 <span className="text-red-500">*</span></label>
                <textarea value={returnReason} onChange={e => setReturnReason(e.target.value)} rows={3}
                  placeholder="请输入退回原因" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
              <button onClick={() => { setShowReturnModal(false); setReturnReason(''); setReturnNode(''); }} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={() => { if (!returnNode) { alert('请选择退回节点'); return; } if (!returnReason.trim()) { alert('请填写退回原因'); return; } setShowReturnModal(false); setReturnReason(''); setReturnNode(''); setSuccessMsg(`已退回至「${returnNode}」节点`); }}
                className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>确认退回</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}