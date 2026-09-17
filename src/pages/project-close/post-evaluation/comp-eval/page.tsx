import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { postEvalProjects, getCompEvalData, getApprovalDetail, type CompEvalData } from '@/mocks/postEvaluationMocks';

const SECTIONS = [
  { key: 'basic', label: '项目基本信息' },
  { key: 'main-content', label: '项目主要内容' },
  { key: 'quality', label: '质量情况' },
  { key: 'benefit', label: '效益效果/目标' },
  { key: 'cost-duration', label: '费用/工期控制' },
  { key: 'safety', label: '安全施工、设施' },
  { key: 'extra', label: '创新/经验/建议' },
  { key: 'summary', label: '总分/专评意见' },
  { key: 'comp-footer', label: '综评意见/评价部门' },
];

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
                <div className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">{step.order}</div>
                <div className="flex-1">
                  <input type="text" value={step.name} onChange={e => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, name: e.target.value } : s))} placeholder="节点名称" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 mb-1" />
                  <input type="text" value={step.approver} onChange={e => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, approver: e.target.value } : s))} placeholder="审批人姓名" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-violet-500" />
                </div>
                <div className="flex items-center gap-1">
                  {idx > 0 && <button onClick={() => setSteps(prev => { const ns = [...prev]; [ns[idx-1], ns[idx]] = [ns[idx], ns[idx-1]]; return ns.map((s, i) => ({ ...s, order: i + 1 })); })} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer text-slate-500"><i className="ri-arrow-up-s-line text-xs" /></button>}
                  {idx < steps.length - 1 && <button onClick={() => setSteps(prev => { const ns = [...prev]; [ns[idx], ns[idx+1]] = [ns[idx+1], ns[idx]]; return ns.map((s, i) => ({ ...s, order: i + 1 })); })} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer text-slate-500"><i className="ri-arrow-down-s-line text-xs" /></button>}
                  <button onClick={() => setSteps(prev => prev.filter(s => s.id !== step.id).map((s, i) => ({ ...s, order: i + 1 })))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer text-red-400"><i className="ri-delete-bin-line text-xs" /></button>
                </div>
              </div>
            ))}
            <button onClick={() => setSteps(prev => [...prev, { id: `s${Date.now()}`, name: '', approver: '', order: prev.length + 1 }])} className="w-full py-2 text-xs text-violet-600 border border-dashed border-violet-300 rounded-md hover:bg-violet-50 cursor-pointer flex items-center justify-center gap-1">
              <i className="ri-add-line" />添加审批节点
            </button>
          </div>
          <div className="mt-4">
            <label className="text-xs text-slate-600 block mb-1">呈核说明（可选）</label>
            <textarea value={opinion} onChange={e => setOpinion(e.target.value)} rows={3} placeholder="请输入呈核说明..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none" />
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

export default function CompEvalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const itemId = searchParams.get('itemId') || '';

  const project = postEvalProjects.find(p => p.id === projectId);
  const evalData = getCompEvalData(projectId, itemId);
  const [activeSection, setActiveSection] = useState('basic');
  const [showPresentModal, setShowPresentModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnNode, setReturnNode] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [compOpinion, setCompOpinion] = useState('');
  const [evalDept, setEvalDept] = useState('总师室');
  const [evalTime, setEvalTime] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm] = useState<CompEvalData | null>(null);
  useEffect(() => { if (evalData) setForm({ ...evalData }); }, [projectId, itemId]);

  if (!project || !form) {
    return <Layout><div className="flex items-center justify-center py-20 text-slate-400">未找到评价数据</div></Layout>;
  }

  const approvalDetail = getApprovalDetail('综评');
  const fmtCurrency = (n: number) => {
    if (n >= 100000000) return `${(n / 100000000).toFixed(2)}亿`;
    if (n >= 10000) return `${(n / 10000).toFixed(2)}万`;
    return n.toLocaleString();
  };

  const tdLabel = "px-2 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-300 whitespace-nowrap";
  const tdValue = "px-2 py-1.5 text-xs text-slate-800 border border-slate-300";
  const tdInput = "w-full px-1.5 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400 bg-white";
  const tdSelect = "w-full px-1.5 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-violet-400 bg-white";
  const tdReadonly = "px-2 py-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-300";

  return (
    <Layout>
      <div className="flex gap-4">
        {/* Left Anchor */}
        <div className="w-44 flex-shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 sticky top-20">
            <div className="px-3 py-2.5 border-b border-slate-200 text-xs font-semibold text-slate-700">导航目录</div>
            <nav className="py-1">
              {SECTIONS.map(s => (
                <button key={s.key} onClick={() => { setActiveSection(s.key); document.getElementById(`ce-${s.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className={`w-full text-left px-3 py-1.5 text-xs cursor-pointer transition-colors ${activeSection === s.key ? 'text-violet-600 bg-violet-50 font-medium border-r-2 border-violet-500' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(`/project-close/post-evaluation/catalog?id=${projectId}`)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer">
                  <i className="ri-arrow-left-line text-slate-500" />
                </button>
                <h1 className="text-base font-semibold text-slate-800">（{project.projectName}）综合评价报告</h1>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-700">综合评价</span>
            </div>

            {successMsg && (
              <div className="mx-5 mt-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700 flex items-center gap-1">
                <i className="ri-check-line" />{successMsg}
              </div>
            )}

            <div className="px-5 py-4">
              {/* ====== 基本信息 ====== */}
              <div id="ce-basic" className="mb-5">
                <table className="w-full border-collapse text-xs" style={{ border: '1px solid #cbd5e1' }}>
                  <colgroup>
                    <col style={{ width: '8%' }} /><col style={{ width: '14%' }} />
                    <col style={{ width: '8%' }} /><col style={{ width: '14%' }} />
                    <col style={{ width: '8%' }} /><col style={{ width: '48%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className={tdLabel}>立项号</td><td className={tdReadonly}>{project.approvalNo}</td>
                      <td className={tdLabel}>项目名称</td><td className={tdReadonly}>{project.projectName}</td>
                      <td className={tdLabel}>立项时间</td><td className={tdReadonly}>{project.approvalDate}</td>
                    </tr>
                    <tr>
                      <td className={tdLabel}>项目类型</td><td className={tdReadonly}>{project.projectType}</td>
                      <td className={tdLabel}>主管单位</td><td className={tdReadonly}>{project.supervisorUnit}</td>
                      <td className={tdLabel}>实施单位</td><td className={tdReadonly}>{project.ownerUnit}</td>
                    </tr>
                    <tr>
                      <td className={tdLabel}>项目经理</td><td className={tdReadonly}>{project.projectManager}</td>
                      <td className={tdLabel}>联系方式</td><td className={tdReadonly} colSpan={3}>138****5678</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ====== 项目主要内容 ====== */}
              <div id="ce-main-content" className="mb-2">
                <table className="w-full border-collapse text-xs" style={{ border: '1px solid #cbd5e1' }}>
                  <colgroup>
                    <col style={{ width: '10%' }} /><col style={{ width: '16%' }} />
                    <col style={{ width: '10%' }} /><col style={{ width: '24%' }} />
                    <col style={{ width: '10%' }} /><col style={{ width: '20%' }} />
                    <col style={{ width: '5%' }} /><col style={{ width: '5%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className={`${tdLabel} font-bold`} rowSpan={2}>项目主要内容</td>
                      <td className={tdLabel}>计划建设内容</td>
                      <td className={tdLabel}>实现情况</td>
                      <td className={tdValue}></td>
                      <td className={tdLabel}>差异内容</td>
                      <td className={tdValue}></td>
                      <td className={tdLabel}>得分</td>
                      <td className={tdValue}></td>
                    </tr>
                    <tr>
                      <td className={tdReadonly}>{form.planContent}</td>
                      <td className={tdValue}>
                        <textarea value={form.planAchievement} onChange={e => setForm({...form, planAchievement: e.target.value})} rows={2} className={`${tdInput} resize-none w-full`} placeholder="（自评价）" />
                      </td>
                      <td className={tdLabel}>差异内容</td>
                      <td className={tdValue}>
                        <textarea value={form.planDiff} onChange={e => setForm({...form, planDiff: e.target.value})} rows={2} className={`${tdInput} resize-none w-full`} placeholder="（自评价）" />
                      </td>
                      <td className={tdLabel}>得分</td>
                      <td className={tdValue}>
                        <input type="number" value={form.planScore} onChange={e => setForm({...form, planScore: Number(e.target.value)})} className={tdInput} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ====== 质量情况 ====== */}
              <div id="ce-quality" className="mb-2">
                <table className="w-full border-collapse text-xs" style={{ border: '1px solid #cbd5e1' }}>
                  <colgroup>
                    <col style={{ width: '10%' }} /><col style={{ width: '14%' }} />
                    <col style={{ width: '44%' }} />
                    <col style={{ width: '5%' }} /><col style={{ width: '27%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className={`${tdLabel} font-bold`} rowSpan={4}>质量情况</td>
                      <td className={tdLabel}>验收合格</td>
                      <td className={tdValue} colSpan={1}>
                        <select value={form.qualityAccept} onChange={e => setForm({...form, qualityAccept: e.target.value})} className={tdSelect} style={{ width: '180px' }}>
                          <option value="是">是（自评价）</option><option value="否">否（自评价）</option>
                        </select>
                      </td>
                      <td className={tdLabel} rowSpan={4}>得分</td>
                      <td className={tdValue} rowSpan={4}>
                        <input type="number" value={form.qualityScore} onChange={e => setForm({...form, qualityScore: Number(e.target.value)})} className={tdInput} />
                      </td>
                    </tr>
                    <tr>
                      <td className={tdLabel}>整改项</td>
                      <td className={tdValue}>
                        <div className="flex items-center gap-2">
                          <select value={form.qualityRectify} onChange={e => setForm({...form, qualityRectify: e.target.value})} className={tdSelect} style={{ width: '80px' }}>
                            <option value="有">有</option><option value="无">无</option>
                          </select>
                          <span className="text-slate-400 text-xs">（自评价）</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={tdLabel}>设备验收</td>
                      <td className={tdValue}>
                        <select value={form.qualityEquipAccept} onChange={e => setForm({...form, qualityEquipAccept: e.target.value})} className={tdSelect} style={{ width: '180px' }}>
                          <option value="是">是（自评价）</option><option value="否">否（自评价）</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className={tdLabel}>热负荷试车</td>
                      <td className={tdValue}>
                        <select value={form.qualityHotTest} onChange={e => setForm({...form, qualityHotTest: e.target.value})} className={tdSelect} style={{ width: '180px' }}>
                          <option value="是">是（自评价）</option><option value="否">否（自评价）</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ====== 效益效果/目标 ====== */}
              <div id="ce-benefit" className="mb-2">
                <table className="w-full border-collapse text-xs" style={{ border: '1px solid #cbd5e1' }}>
                  <colgroup>
                    <col style={{ width: '10%' }} /><col style={{ width: '10%' }} />
                    <col style={{ width: '8%' }} /><col style={{ width: '10%' }} /><col style={{ width: '20%' }} />
                    <col style={{ width: '8%' }} /><col style={{ width: '16%' }} />
                    <col style={{ width: '5%' }} /><col style={{ width: '13%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className={`${tdLabel} font-bold`} rowSpan={3}>效益效果/目标</td>
                      <td className={tdLabel}>项目技术目标</td>
                      <td className={tdReadonly} colSpan={1}>{form.techTarget}</td>
                      <td className={tdLabel}>实现情况</td>
                      <td className={tdValue}>
                        <textarea value={form.techAchievement} onChange={e => setForm({...form, techAchievement: e.target.value})} rows={2} className={`${tdInput} resize-none w-full`} placeholder="（自评价）可修改" />
                      </td>
                      <td className={tdLabel}>差异率</td>
                      <td className={tdValue}>
                        <input type="text" value={form.techDiffRate} onChange={e => setForm({...form, techDiffRate: e.target.value})} className={tdInput} placeholder="（自评价）" />
                      </td>
                      <td className={tdLabel}>得分</td>
                      <td className={tdValue}>
                        <input type="number" value={form.techScore} onChange={e => setForm({...form, techScore: Number(e.target.value)})} className={tdInput} />
                      </td>
                    </tr>
                    <tr>
                      <td className={tdLabel}>效益效果</td>
                      <td className={tdReadonly}>{form.benefitEffect}</td>
                      <td className={tdLabel}>实现情况</td>
                      <td className={tdValue}>
                        <textarea value={form.benefitAchievement} onChange={e => setForm({...form, benefitAchievement: e.target.value})} rows={2} className={`${tdInput} resize-none w-full`} placeholder="（自评价）可修改" />
                      </td>
                      <td className={tdLabel}>差异率</td>
                      <td className={tdValue}>
                        <input type="text" value={form.benefitDiffRate} onChange={e => setForm({...form, benefitDiffRate: e.target.value})} className={tdInput} />
                      </td>
                      <td className={tdLabel}>得分</td>
                      <td className={tdValue}>
                        <input type="number" value={form.benefitScore} onChange={e => setForm({...form, benefitScore: Number(e.target.value)})} className={tdInput} />
                      </td>
                    </tr>
                    <tr>
                      <td className={tdLabel}>其它目标</td>
                      <td className={tdReadonly}>{form.otherTarget}</td>
                      <td className={tdLabel}>实现情况</td>
                      <td className={tdValue}>
                        <textarea value={form.otherAchievement} onChange={e => setForm({...form, otherAchievement: e.target.value})} rows={2} className={`${tdInput} resize-none w-full`} placeholder="（自评价）可修改" />
                      </td>
                      <td className={tdLabel}>差异率</td>
                      <td className={tdValue}>
                        <input type="text" value={form.otherDiffRate} onChange={e => setForm({...form, otherDiffRate: e.target.value})} className={tdInput} />
                      </td>
                      <td className={tdLabel}>得分</td>
                      <td className={tdValue}>
                        <input type="number" value={form.otherScore} onChange={e => setForm({...form, otherScore: Number(e.target.value)})} className={tdInput} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ====== 费用控制 + 工期控制 ====== */}
              <div id="ce-cost-duration" className="mb-2">
                <table className="w-full border-collapse text-xs" style={{ border: '1px solid #cbd5e1' }}>
                  <colgroup>
                    <col style={{ width: '10%' }} /><col style={{ width: '10%' }} />
                    <col style={{ width: '12%' }} /><col style={{ width: '18%' }} />
                    <col style={{ width: '8%' }} /><col style={{ width: '18%' }} />
                    <col style={{ width: '5%' }} /><col style={{ width: '19%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className={`${tdLabel} font-bold`}>费用控制</td>
                      <td className={tdLabel}>立项费用</td>
                      <td className={tdReadonly}>{fmtCurrency(form.budgetCost)}元</td>
                      <td className={tdLabel}>实际费用</td>
                      <td className={tdValue}>
                        <input type="number" value={form.actualCost} onChange={e => setForm({...form, actualCost: Number(e.target.value)})} className={tdInput} placeholder="（自评价）" />
                      </td>
                      <td className={tdLabel}>节超率</td>
                      <td className={tdValue}>
                        <input type="text" value={form.costDiffRate} onChange={e => setForm({...form, costDiffRate: e.target.value})} className={tdInput} />
                      </td>
                      <td className={tdValue}>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">得分</span>
                          <input type="number" value={form.costScore} onChange={e => setForm({...form, costScore: Number(e.target.value)})} className={tdInput} />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={`${tdLabel} font-bold`}>工期控制</td>
                      <td className={tdLabel}>立项工期</td>
                      <td className={tdReadonly}>{form.budgetDuration}</td>
                      <td className={tdLabel}>实际工期</td>
                      <td className={tdValue}>
                        <input type="text" value={form.actualDuration} onChange={e => setForm({...form, actualDuration: e.target.value})} className={tdInput} placeholder="（自评价）" />
                      </td>
                      <td className={tdLabel}>节超率</td>
                      <td className={tdValue}>
                        <input type="text" value={form.durationDiffRate} onChange={e => setForm({...form, durationDiffRate: e.target.value})} className={tdInput} />
                      </td>
                      <td className={tdValue}>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">得分</span>
                          <input type="number" value={form.durationScore} onChange={e => setForm({...form, durationScore: Number(e.target.value)})} className={tdInput} />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ====== 安全施工 ====== */}
              <div id="ce-safety" className="mb-2">
                <table className="w-full border-collapse text-xs" style={{ border: '1px solid #cbd5e1' }}>
                  <tbody>
                    <tr>
                      <td className={`${tdLabel} font-bold`} style={{ width: '10%' }}>安全施工、设施</td>
                      <td className={tdLabel} style={{ width: '12%' }}>安全施工情况</td>
                      <td className={tdValue} style={{ width: '30%' }}>
                        <select value={form.safetyStatus} onChange={e => setForm({...form, safetyStatus: e.target.value})} className={tdSelect}>
                          <option value="安全施工情况良好，全过程无安全事故发生。">良好，无安全事故（自评价）</option>
                          <option value="存在轻微安全隐患，已整改完毕。">轻微隐患，已整改（自评价）</option>
                        </select>
                      </td>
                      <td className={tdLabel} style={{ width: '12%' }}>项目安全设施</td>
                      <td className={tdValue} style={{ width: '26%' }}>
                        <select className={tdSelect} style={{ width: '100px' }}>
                          <option>是（自评价）</option><option>否（自评价）</option>
                        </select>
                      </td>
                      <td className={tdLabel} style={{ width: '5%' }}>得分</td>
                      <td className={tdValue} style={{ width: '5%' }}>
                        <input type="number" defaultValue={8} className={tdInput} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ====== 创新/经验/建议 ====== */}
              <div id="ce-extra" className="mb-2">
                <table className="w-full border-collapse text-xs" style={{ border: '1px solid #cbd5e1' }}>
                  <tbody>
                    <tr>
                      <td className={`${tdLabel} font-bold`} style={{ width: '10%' }}>创新</td>
                      <td className={tdLabel} style={{ width: '16%' }}>新工艺、新技术等应用情况</td>
                      <td className={tdValue} style={{ width: '52%' }}>
                        <textarea rows={2} placeholder="系统出、可修改（自评价）" className={`${tdInput} resize-none w-full`} />
                      </td>
                      <td className={tdLabel} style={{ width: '5%' }}>得分</td>
                      <td className={tdValue} style={{ width: '17%' }}><input type="number" defaultValue={5} className={tdInput} /></td>
                    </tr>
                    <tr>
                      <td className={`${tdLabel} font-bold`}>经验教训</td>
                      <td className={tdLabel}>主要经验教训</td>
                      <td className={tdValue}>
                        <textarea rows={2} placeholder="系统出、可修改（自评价）" className={`${tdInput} resize-none w-full`} />
                      </td>
                      <td className={tdLabel}>得分</td>
                      <td className={tdValue}><input type="number" defaultValue={5} className={tdInput} /></td>
                    </tr>
                    <tr>
                      <td className={`${tdLabel} font-bold`}>建议</td>
                      <td className={tdLabel}>项目建议</td>
                      <td className={tdValue}>
                        <textarea rows={2} placeholder="系统出、可修改（自评价）" className={`${tdInput} resize-none w-full`} />
                      </td>
                      <td className={tdLabel}>得分</td>
                      <td className={tdValue}><input type="number" defaultValue={5} className={tdInput} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ====== 总分 + 专评意见 ====== */}
              <div id="ce-summary" className="mb-2">
                <table className="w-full border-collapse text-xs" style={{ border: '1px solid #cbd5e1' }}>
                  <tbody>
                    <tr>
                      <td className={`${tdLabel} font-bold`} style={{ width: '10%' }}>总分</td>
                      <td className={tdValue} style={{ width: '20%' }}>
                        <span className="font-semibold text-slate-800">{form.planScore + form.qualityScore + form.techScore + form.benefitScore + form.otherScore + form.costScore + form.durationScore + 23}</span>
                        <span className="text-slate-400 text-xs ml-1">（自评价，可修改）</span>
                      </td>
                      <td className={tdLabel} style={{ width: '5%' }}>等级</td>
                      <td className={tdValue} colSpan={2}>
                        {(() => {
                          const t = form.planScore + form.qualityScore + form.techScore + form.benefitScore + form.otherScore + form.costScore + form.durationScore + 23;
                          return t >= 90 ? 'A（优秀）（自评价）' : t >= 75 ? 'B（良好）（自评价）' : t >= 60 ? 'C（合格）（自评价）' : 'D（不合格）（自评价）';
                        })()}
                      </td>
                    </tr>
                    <tr>
                      <td className={`${tdLabel} font-bold`} style={{ width: '10%' }}>专评意见</td>
                      <td className={tdValue} colSpan={4}>
                        <div className="space-y-1">
                          {['环保', '安全', '消防', '节能', '信息化', '智能化', '定员增减', '财务效益', '工程管理', '环境提升'].map(item => (
                            <div key={item} className="flex items-center gap-2">
                              <span className="text-slate-600 text-xs w-14 flex-shrink-0">{item}：</span>
                              <div className="flex-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">{item}评价意见（专业评价）</div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ====== 综评意见 + 评价部门 ====== */}
              <div id="ce-comp-footer" className="mb-2">
                <table className="w-full border-collapse text-xs" style={{ border: '1px solid #cbd5e1' }}>
                  <tbody>
                    <tr>
                      <td className={`${tdLabel} font-bold`} style={{ width: '10%' }}>综评意见</td>
                      <td className={tdValue} colSpan={3} style={{ minHeight: '60px' }}>
                        <textarea value={compOpinion} onChange={e => setCompOpinion(e.target.value)} rows={4} placeholder="可否AI生成，生成结果可修改。" className={`${tdInput} resize-none w-full`} />
                      </td>
                    </tr>
                    <tr>
                      <td className={tdLabel}>评价部门</td>
                      <td className={tdValue} style={{ width: '30%' }}>
                        <select value={evalDept} onChange={e => setEvalDept(e.target.value)} className={tdSelect}>
                          <option value="总师室">总师室</option>
                          <option value="工程管理部">工程管理部</option>
                          <option value="发展规划部">发展规划部</option>
                        </select>
                      </td>
                      <td className={tdLabel} style={{ width: '10%' }}>评价时间</td>
                      <td className={tdValue} style={{ width: '40%' }}>
                        <input type="date" value={evalTime} onChange={e => setEvalTime(e.target.value)} className={tdInput} style={{ width: '160px' }} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button onClick={() => navigate(`/project-close/post-evaluation/catalog?id=${projectId}`)}
                className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
                <i className="ri-arrow-left-line" />取消
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setSuccessMsg('暂存成功')} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}>暂存</button>
                <button onClick={() => setShowPresentModal(true)} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
                <button onClick={() => setShowApprovalModal(true)} className="px-4 py-1.5 text-sm text-violet-600 border border-violet-200 rounded-md hover:bg-violet-50 cursor-pointer whitespace-nowrap">审批详情</button>
                <button onClick={() => setSuccessMsg('已确认')} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确认</button>
                <button onClick={() => setShowReturnModal(true)} className="px-4 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">退回</button>
                <button onClick={() => window.print()} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
                  <i className="ri-printer-line" />列印
                </button>
              </div>
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
              <h2 className="text-base font-semibold text-slate-800">审批详情 - 综评</h2>
              <button onClick={() => setShowApprovalModal(false)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">审批单号：</span><span className="text-slate-800 font-medium">{approvalDetail.approvalNo}</span></div>
              <div><span className="text-slate-500">业务类型：</span><span className="text-slate-800">综评</span></div>
              <div><span className="text-slate-500">发起人：</span><span className="text-slate-800">{approvalDetail.applicant}</span></div>
              <div><span className="text-slate-500">发起时间：</span><span className="text-slate-800">{approvalDetail.applyTime}</span></div>
            </div>
            <div className="px-5 py-4">
              <div className="relative pl-8">
                <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-slate-200" />
                {approvalDetail.nodes.map((node, idx) => {
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
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
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
                  placeholder="请输入退回原因" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none" />
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