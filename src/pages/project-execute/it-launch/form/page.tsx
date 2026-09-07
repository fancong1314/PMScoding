import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { itLaunchProjects, itLaunchApplications, type ItLaunchProject, type ItLaunchContract, type ItLaunchApplication } from '@/mocks/itLaunchMocks';

const SECTIONS = [
  { id: 'basic-info', title: '基本信息', icon: 'ri-file-info-line' },
  { id: 'contract-list', title: '合同清单', icon: 'ri-file-list-3-line' },
  { id: 'operation-records', title: '操作记录', icon: 'ri-history-line' },
];

const launchTypeOptions = ['整体上线', '分项上线'];

interface OperationLog {
  id: string;
  action: string;
  opinion: string;
  operator: string;
  date: string;
  time: string;
}

export default function ItLaunchFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id');
  const isEdit = !!appId;

  const existingApp = isEdit ? itLaunchApplications.find((a) => a.id === appId) : null;

  // Form state
  const [projectNo, setProjectNo] = useState(existingApp?.projectNo || '');
  const [projectName, setProjectName] = useState(existingApp?.projectName || '');
  const [projectType, setProjectType] = useState(existingApp?.projectType || '');
  const [launchType, setLaunchType] = useState(existingApp?.launchType || '');
  const [launchNote, setLaunchNote] = useState(existingApp?.launchNote || '');
  const [plannedLaunchTime, setPlannedLaunchTime] = useState(existingApp?.plannedLaunchTime || '');
  const [estimatedStayHours, setEstimatedStayHours] = useState(existingApp?.estimatedStayHours?.toString() || '');
  const [impactScope, setImpactScope] = useState(existingApp?.impactScope || '');
  const [riskAssessment, setRiskAssessment] = useState(existingApp?.riskAssessment || '');

  // Contract list
  const [contracts, setContracts] = useState<ItLaunchContract[]>(() => {
    if (existingApp && existingApp.projectNo) {
      const proj = itLaunchProjects.find((p) => p.projectNo === existingApp.projectNo);
      if (proj) {
        return proj.contracts.map((c) => ({
          ...c,
          selected: existingApp.selectedContracts?.includes(c.id) || false,
        }));
      }
    }
    return [];
  });

  // Attachments
  const [attachments, setAttachments] = useState<{ name: string; uploaded: boolean }[]>(
    existingApp?.attachments || [
      { name: '用户培训记录', uploaded: false },
      { name: '上线试运行方案', uploaded: false },
      { name: '用户操作手册', uploaded: false },
      { name: '测试用例', uploaded: false },
      { name: '供应商测试报告', uploaded: false },
      { name: '用户测试', uploaded: false },
      { name: '安全测试报告', uploaded: false },
    ]
  );

  // Operation logs
  const [operationLogs] = useState<OperationLog[]>(() => {
    if (existingApp) {
      return [
        { id: 'log-1', action: '创建申请', opinion: '首次提交上线申请', operator: existingApp.creator, date: existingApp.createTime.split(' ')[0], time: existingApp.createTime.split(' ')[1] },
        { id: 'log-2', action: '修改申请', opinion: '更新上线方案及风险评估', operator: existingApp.creator, date: existingApp.createTime.split(' ')[0], time: '17:45:00' },
      ];
    }
    return [];
  });

  const [activeSection, setActiveSection] = useState('basic-info');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');
  const [dirty, setDirty] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Approval flow config modal
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalNodes, setApprovalNodes] = useState([
    { nodeId: 'n1', nodeName: '事业部审批', approver: '周明辉', approverDept: '智能制造事业部', sequence: 1 },
    { nodeId: 'n2', nodeName: '信息技术部审批', approver: '吴建国', approverDept: '信息技术部', sequence: 2 },
    { nodeId: 'n3', nodeName: '数研院呈核', approver: '郑文斌', approverDept: '数研院', sequence: 3 },
    { nodeId: 'n4', nodeName: '安全环保部会签', approver: '孙志强', approverDept: '安全环保部', sequence: 4 },
    { nodeId: 'n5', nodeName: '上线确认', approver: '林晓东', approverDept: '项目管理办公室', sequence: 5 },
  ]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  // IntersectionObserver
  useEffect(() => {
    const visibilityMap: Record<string, number> = {};
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibilityMap[id] = entry.intersectionRatio;
          const max = Object.entries(visibilityMap).sort((a, b) => b[1] - a[1])[0]?.[0];
          if (max) setActiveSection(max);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-80px 0px -50% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveSection(id); }
  }, []);

  // When projectNo changes, auto-load project info and contracts
  useEffect(() => {
    if (projectNo) {
      const proj = itLaunchProjects.find((p) => p.projectNo === projectNo);
      if (proj) {
        setProjectName(proj.projectName);
        setProjectType(proj.projectType);
        setContracts(proj.contracts.map((c) => ({
          ...c,
          selected: launchType === '整体上线' ? true : false,
        })));
      }
    }
  }, [projectNo]);

  // When launchType changes, update contract selection
  useEffect(() => {
    if (launchType === '整体上线') {
      setContracts((prev) => prev.map((c) => ({ ...c, selected: true })));
    } else if (launchType === '分项上线' && !existingApp) {
      setContracts((prev) => prev.map((c) => ({ ...c, selected: false })));
    }
  }, [launchType]);

  const handleToggleContract = (contractId: string) => {
    if (launchType === '整体上线') return;
    setContracts((prev) => prev.map((c) => c.id === contractId ? { ...c, selected: !c.selected } : c));
    setDirty(true);
  };

  const handleFileChange = (idx: number) => {
    setAttachments((prev) => prev.map((a, i) => i === idx ? { ...a, uploaded: !a.uploaded } : a));
    setDirty(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!projectNo) e.projectNo = '请选择立项号';
    if (!launchType) e.launchType = '请选择上线类型';
    if (!plannedLaunchTime) e.plannedLaunchTime = '请选择计划上线时间';
    if (!estimatedStayHours || Number(estimatedStayHours) <= 0) e.estimatedStayHours = '请填写预计停留时间';
    if (!impactScope.trim()) e.impactScope = '请填写影响范围';
    const requiredAttachments = ['用户培训记录', '上线试运行方案', '用户操作手册', '测试用例', '供应商测试报告', '用户测试', '安全测试报告'];
    requiredAttachments.forEach((name) => {
      const att = attachments.find((a) => a.name === name);
      if (!att || !att.uploaded) {
        e[`att_${name}`] = `请上传${name}`;
      }
    });
    setErrors(e);
    if (Object.keys(e).length > 0) {
      showToast('请检查并填写必填项');
      scrollToSection('basic-info');
    }
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    showToast('保存成功');
    setDirty(false);
  };

  const handleSubmitApproval = () => {
    if (!validate()) return;
    setApprovalModalOpen(true);
  };

  const handleApprovalConfirm = () => {
    showToast('呈核成功，审批流程已发起');
    setApprovalModalOpen(false);
    setDirty(false);
    setTimeout(() => navigate('/project-execute/it-launch'), 1500);
  };

  const handleBack = () => {
    if (dirty) {
      setLeaveConfirm(true);
    } else {
      navigate('/project-execute/it-launch');
    }
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white';
  const readOnlyCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-600';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
  };

  return (
    <Layout mainClassName="flex-1 relative">
      <div className="flex" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
        {/* Left Anchor Navigation */}
        <div
          className="fixed z-30 flex flex-col py-5"
          style={{ left: '14rem', top: '3.5rem', width: 196, height: 'calc(100vh - 3.5rem)', background: 'white', borderRight: '1px solid #e8edf3' }}
        >
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-steel-400 uppercase tracking-wider">表单导航</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all cursor-pointer mb-0.5 text-left ${
                  activeSection === s.id ? 'font-medium' : 'text-steel-500 hover:text-steel-700 hover:bg-slate-50'
                }`}
                style={activeSection === s.id ? { color: '#059669', backgroundColor: '#f0fdf4' } : undefined}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all"
                  style={activeSection === s.id ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' } : { backgroundColor: '#e8edf3', color: '#718096' }}
                >
                  {i + 1}
                </div>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{s.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Form Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6" style={{ marginLeft: 196 }}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-steel-900">
                {isEdit ? '修改上线申请' : '新增上线申请'}
              </h2>
              <p className="text-xs text-steel-400 mt-0.5">
                {isEdit ? `当前编辑：${projectName || appId}` : '请填写以下信息，完成后保存或呈核'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-steel-400">
              <span className="text-red-400">*</span>
              <span>为必填项</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Section 1: Basic Info */}
            <div ref={(el) => { sectionRefs.current['basic-info'] = el; }} className="bg-white rounded-lg border border-steel-200 p-5">
              <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-info-line text-steel-500" /></div>
                基本信息
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="text-xs text-steel-500 block mb-1">立项号 <span className="text-red-400">*</span></label>
                  <select
                    value={projectNo}
                    onChange={(e) => { setProjectNo(e.target.value); setDirty(true); if (errors.projectNo) setErrors((prev) => { const n = { ...prev }; delete n.projectNo; return n; }); }}
                    className={inputCls + ' cursor-pointer'}
                  >
                    <option value="">请选择立项号</option>
                    {itLaunchProjects.map((p) => (
                      <option key={p.id} value={p.projectNo}>{p.projectNo} - {p.projectName}</option>
                    ))}
                  </select>
                  {errors.projectNo && <p className="text-xs text-red-500 mt-1">{errors.projectNo}</p>}
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">项目名称</label>
                  <input type="text" value={projectName} readOnly className={readOnlyCls} />
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">上线类型 <span className="text-red-400">*</span></label>
                  <select
                    value={launchType}
                    onChange={(e) => { setLaunchType(e.target.value); setDirty(true); if (errors.launchType) setErrors((prev) => { const n = { ...prev }; delete n.launchType; return n; }); }}
                    className={inputCls + ' cursor-pointer'}
                  >
                    <option value="">请选择上线类型</option>
                    {launchTypeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.launchType && <p className="text-xs text-red-500 mt-1">{errors.launchType}</p>}
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">项目类型</label>
                  <input type="text" value={projectType} readOnly className={readOnlyCls} />
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">计划上线时间 <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    value={plannedLaunchTime}
                    onChange={(e) => { setPlannedLaunchTime(e.target.value); setDirty(true); if (errors.plannedLaunchTime) setErrors((prev) => { const n = { ...prev }; delete n.plannedLaunchTime; return n; }); }}
                    className={inputCls}
                  />
                  {errors.plannedLaunchTime && <p className="text-xs text-red-500 mt-1">{errors.plannedLaunchTime}</p>}
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">上线预计停留时间/小时 <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={estimatedStayHours}
                    onChange={(e) => { setEstimatedStayHours(e.target.value); setDirty(true); if (errors.estimatedStayHours) setErrors((prev) => { const n = { ...prev }; delete n.estimatedStayHours; return n; }); }}
                    placeholder="请输入预计停留时间（小时）"
                    className={inputCls}
                    min={0}
                  />
                  {errors.estimatedStayHours && <p className="text-xs text-red-500 mt-1">{errors.estimatedStayHours}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-steel-500 block mb-1">上线说明</label>
                  <textarea
                    value={launchNote}
                    onChange={(e) => { setLaunchNote(e.target.value); setDirty(true); }}
                    placeholder="请输入上线说明"
                    className={inputCls}
                    rows={2}
                    maxLength={500}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-steel-500 block mb-1">影响范围 <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={impactScope}
                    onChange={(e) => { setImpactScope(e.target.value); setDirty(true); if (errors.impactScope) setErrors((prev) => { const n = { ...prev }; delete n.impactScope; return n; }); }}
                    placeholder="请输入影响范围"
                    className={inputCls}
                  />
                  {errors.impactScope && <p className="text-xs text-red-500 mt-1">{errors.impactScope}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-steel-500 block mb-1">风险评估及解决措施</label>
                  <textarea
                    value={riskAssessment}
                    onChange={(e) => { setRiskAssessment(e.target.value); setDirty(true); }}
                    placeholder="请输入风险评估及解决措施"
                    className={inputCls}
                    rows={3}
                    maxLength={500}
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-5 pt-4 border-t border-steel-100">
                <h4 className="text-sm font-medium text-steel-700 mb-3">附件上传</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {attachments.map((att, idx) => (
                    <div key={att.name} className="flex items-center justify-between p-2.5 border border-steel-200 rounded-md bg-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className={`${att.uploaded ? 'ri-file-text-line text-emerald-500' : 'ri-file-upload-line text-steel-400'}`} />
                        </div>
                        <span className="text-sm text-steel-700">{att.name}</span>
                        <span className="text-xs text-red-400">*</span>
                      </div>
                      <button
                        onClick={() => handleFileChange(idx)}
                        className={`px-3 py-1 text-xs rounded-md border cursor-pointer whitespace-nowrap ${
                          att.uploaded
                            ? 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-primary-600 border-primary-200 hover:bg-primary-50'
                        }`}
                      >
                        {att.uploaded ? '已上传' : '点击上传'}
                      </button>
                    </div>
                  ))}
                </div>
                {attachments.some((a) => !a.uploaded) && (
                  <p className="text-xs text-red-400 mt-2">标有 * 的附件均为必传项</p>
                )}
              </div>
            </div>

            {/* Section 2: Contract List */}
            <div ref={(el) => { sectionRefs.current['contract-list'] = el; }} className="bg-white rounded-lg border border-steel-200 p-5">
              <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-list-3-line text-steel-500" /></div>
                合同清单
              </h3>
              {contracts.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                    <i className="ri-file-list-3-line text-xl text-steel-300" />
                  </div>
                  <p className="text-sm text-steel-400">请先选择立项号以加载合同清单</p>
                </div>
              ) : (
                <>
                  <div className="mb-3 flex items-center gap-2 text-xs text-steel-500">
                    <span>上线类型：</span>
                    <span className={`font-medium ${launchType === '整体上线' ? 'text-sky-600' : 'text-violet-600'}`}>{launchType || '未选择'}</span>
                    <span className="mx-1">|</span>
                    <span>{launchType === '整体上线' ? '所有合同自动全选，不可取消' : '请手动勾选需要上线的合同'}</span>
                  </div>
                  <div className="border border-steel-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                          <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同编号</th>
                          <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '220px' }}>合同名称</th>
                          <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同金额</th>
                          <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center">是否申请</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.map((c) => (
                          <tr key={c.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-steel-700 font-mono whitespace-nowrap">{c.contractNo}</td>
                            <td className="px-4 py-3 text-sm text-steel-700">{c.contractName}</td>
                            <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{formatCurrency(c.contractAmount)}</td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={c.selected || false}
                                onChange={() => handleToggleContract(c.id)}
                                disabled={launchType === '整体上线'}
                                className={`w-4 h-4 rounded cursor-pointer ${launchType === '整体上线' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                style={{ accentColor: '#059669' }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Section 3: Operation Records */}
            <div ref={(el) => { sectionRefs.current['operation-records'] = el; }} className="bg-white rounded-lg border border-steel-200 p-5">
              <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center"><i className="ri-history-line text-steel-500" /></div>
                操作记录
              </h3>

              {/* Basic Info Records */}
              <div className="grid grid-cols-5 gap-4 mb-5 bg-slate-50 rounded-lg p-3 border border-steel-100">
                <div><label className="text-xs text-steel-400 block mb-0.5">创建人</label><span className="text-sm text-steel-700">{existingApp?.creator || '当前用户'}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">创建日期</label><span className="text-sm text-steel-700">{existingApp?.createTime?.split(' ')[0] || new Date().toISOString().split('T')[0]}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">修改人</label><span className="text-sm text-steel-700">{existingApp?.creator || '当前用户'}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">修改日期</label><span className="text-sm text-steel-700">{new Date().toISOString().split('T')[0]}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">状态</label><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${existingApp?.status === '审批中' ? 'bg-amber-50 text-amber-700 border-amber-200' : existingApp?.status === '已通过' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : existingApp?.status === '已驳回' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{existingApp?.status || '新建'}</span></div>
              </div>

              {/* Operation Detail Records */}
              <h4 className="text-sm font-medium text-steel-700 mb-2">操作明细记录</h4>
              <div className="border border-steel-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">操作</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500" style={{ minWidth: '180px' }}>审核意见</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">操作人</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">操作日期</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">操作时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operationLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-history-line text-xl text-steel-300" /></div>
                            <p className="text-sm text-steel-400">暂无操作记录</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      operationLogs.map((log) => (
                        <tr key={log.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-steel-700 font-medium whitespace-nowrap">{log.action}</td>
                          <td className="px-4 py-3 text-sm text-steel-600">{log.opinion}</td>
                          <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{log.operator}</td>
                          <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{log.date}</td>
                          <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{log.time}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div
        className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
        style={{ left: 'calc(14rem + 196px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}
      >
        <span className="text-xs text-steel-400 mr-auto">
          <i className="ri-shield-check-line mr-1 text-emerald-500" />
          提交前请确认所有必填项均已填写
        </span>
        <button onClick={handleBack} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
          <i className="ri-arrow-left-line mr-1" />
          取消
        </button>
        <button onClick={handleSave} className="px-5 py-2 text-sm border border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer" style={{ color: '#059669' }}>
          <i className="ri-save-line mr-1.5" />
          保存
        </button>
        <button onClick={handleSubmitApproval} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          <i className="ri-send-plane-line" />
          呈核
        </button>
      </div>

      {/* Leave Confirm Modal */}
      {leaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setLeaveConfirm(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-96 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 flex-shrink-0">
                <i className="ri-alert-line text-amber-500 text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-steel-800">确认离开？</h4>
                <p className="text-xs text-steel-500 mt-0.5">当前页面有未保存的修改，离开后将丢失。</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setLeaveConfirm(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">继续编辑</button>
              <button onClick={() => { setLeaveConfirm(false); navigate('/project-execute/it-launch'); }} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>确认离开</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border bg-emerald-50 border-emerald-200">
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-checkbox-circle-line text-emerald-500" /></div>
            <span className="text-sm text-emerald-700">{toast}</span>
          </div>
        </div>
      )}

      {/* Approval Flow Config Modal (呈核) */}
      {approvalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setApprovalModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[640px] max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-steel-800">自定义审批流配置</h3>
                <p className="text-xs text-steel-400 mt-0.5">配置审批节点及审批人，确认后发起审批</p>
              </div>
              <button onClick={() => setApprovalModalOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-xs text-steel-500 block mb-1">审批流名称</label>
                <div className="px-3 py-2 text-sm text-steel-700 bg-slate-50 rounded-md border border-steel-200">信息化项目上线审批流程</div>
              </div>
              <div>
                <label className="text-xs text-steel-500 block mb-2">审批节点列表</label>
                <div className="space-y-3">
                  {approvalNodes.map((node) => (
                    <div key={node.nodeId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-steel-100">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>{node.sequence}</div>
                      <div className="flex-1"><span className="text-sm font-medium text-steel-700">{node.nodeName}</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-steel-400">审批人:</span>
                        <select
                          value={node.approver}
                          onChange={(e) => {
                            setApprovalNodes((prev) => prev.map((n) => n.nodeId === node.nodeId ? { ...n, approver: e.target.value } : n));
                          }}
                          className="px-2 py-1.5 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
                        >
                          <option value="周明辉">周明辉</option>
                          <option value="吴建国">吴建国</option>
                          <option value="郑文斌">郑文斌</option>
                          <option value="孙志强">孙志强</option>
                          <option value="林晓东">林晓东</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-2">
              <button onClick={() => setApprovalModalOpen(false)} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleApprovalConfirm} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>确认发起</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}