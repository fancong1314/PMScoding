import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { completionApplications, changeTypeOptions } from '@/mocks/completionAcceptanceMocks';

const SECTIONS = [
  { id: 'notice-area', title: '顶部提示', icon: 'ri-information-line' },
  { id: 'basic-info', title: '基本信息', icon: 'ri-file-info-line' },
  { id: 'attachment-list', title: '附件上传列表', icon: 'ri-attachment-2' },
  { id: 'bottom-info', title: '底部信息', icon: 'ri-record-circle-line' },
];

interface UploadedFile {
  id: string;
  fileName: string;
  uploadTime: string;
  uploader: string;
  version: string;
  remark: string;
}

export default function CompletionApplicationFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id');
  const projectNo = searchParams.get('projectNo') || '';
  const planNo = searchParams.get('planNo') || '';
  const projectName = searchParams.get('projectName') || '';
  const isEdit = !!appId;

  const existingApp = isEdit ? completionApplications.find((a) => a.id === appId) : null;

  // Form state
  const [changeNo, setChangeNo] = useState(existingApp?.changeNo || `YG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const [changeType, setChangeType] = useState(existingApp?.changeType || '');
  const [changeStatus, setChangeStatus] = useState(existingApp?.status || '');
  const [changeDate, setChangeDate] = useState(existingApp?.changeDate || '');
  const [fileCount, setFileCount] = useState(existingApp?.fileCount?.toString() || '0');
  const [projMgrConfirmed, setProjMgrConfirmed] = useState(existingApp?.projMgrConfirmed || '');
  const [changeReason, setChangeReason] = useState(existingApp?.changeReason || '');
  const [changeNote, setChangeNote] = useState(existingApp?.changeNote || '');

  // Attachments
  const [attachments, setAttachments] = useState<{ id: string; projectPhase: string; contractType: string; businessCategory: string; fileCategory: string; isConfidential: string; fileCount: number; remark: string }[]>(
    existingApp?.attachments || []
  );

  const [activeSection, setActiveSection] = useState('notice-area');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');
  const [dirty, setDirty] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);

  // Attachment upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: 'uf-1', fileName: '竣工报告_v2.pdf', uploadTime: '2025-06-18 10:30', uploader: '周建国', version: '2.0', remark: '竣工验收报告' },
    { id: 'uf-2', fileName: '设备验收单.xlsx', uploadTime: '2025-06-15 14:00', uploader: '李明', version: '1.0', remark: '设备清单验收' },
  ]);

  // Approval modal
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalNodes, setApprovalNodes] = useState([
    { nodeId: 'n1', nodeName: '项目部审核', approver: '周建国', approverDept: '项目部', sequence: 1 },
    { nodeId: 'n2', nodeName: '专业主管单位审批', approver: '郑文斌', approverDept: '数研院', sequence: 2 },
    { nodeId: 'n3', nodeName: '安全环保部会签', approver: '孙志强', approverDept: '安全环保部', sequence: 3 },
    { nodeId: 'n4', nodeName: '制造部审批', approver: '吴建国', approverDept: '制造部', sequence: 4 },
    { nodeId: 'n5', nodeName: '项目负责人确认', approver: '林晓东', approverDept: '项目管理办公室', sequence: 5 },
  ]);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    const visibilityMap: Record<string, number> = {};
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { visibilityMap[id] = entry.intersectionRatio; const max = Object.entries(visibilityMap).sort((a, b) => b[1] - a[1])[0]?.[0]; if (max) setActiveSection(max); },
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

  const handleDeleteAttachment = (attId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
    setFileCount(String(attachments.length - 1));
    setDirty(true);
    showToast('附件已删除');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!changeType) e.changeType = '请选择异动类型';
    if (!changeDate) e.changeDate = '请选择异动日期';
    if (!projMgrConfirmed) e.projMgrConfirmed = '请选择项目负责人是否竣工确认';
    setErrors(e);
    if (Object.keys(e).length > 0) { showToast('请检查并填写必填项'); scrollToSection('basic-info'); }
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    showToast('保存成功');
    setDirty(false);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setApprovalModalOpen(true);
  };

  const handleBack = () => {
    if (dirty) { setLeaveConfirm(true); } else { navigate(-1); }
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white';
  const readOnlyCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-600';

  return (
    <Layout mainClassName="flex-1 relative">
      <div className="flex" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
        {/* Left Anchor Navigation */}
        <div className="fixed z-30 flex flex-col py-5" style={{ left: '14rem', top: '3.5rem', width: 196, height: 'calc(100vh - 3.5rem)', background: 'white', borderRight: '1px solid #e8edf3' }}>
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-steel-400 uppercase tracking-wider">表单导航</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3">
            {SECTIONS.map((s, i) => (
              <button key={s.id} onClick={() => scrollToSection(s.id)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all cursor-pointer mb-0.5 text-left ${activeSection === s.id ? 'font-medium' : 'text-steel-500 hover:text-steel-700 hover:bg-slate-50'}`} style={activeSection === s.id ? { color: '#059669', backgroundColor: '#f0fdf4' } : undefined}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all" style={activeSection === s.id ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' } : { backgroundColor: '#e8edf3', color: '#718096' }}>{i + 1}</div>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{s.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Form Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6" style={{ marginLeft: 196 }}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-steel-900">{isEdit ? '修改交竣工申请' : '新增交竣工申请'}</h2>
              <p className="text-xs text-steel-400 mt-0.5">{isEdit ? `当前编辑：${changeNo}` : '请填写以下信息，完成后保存或提交'}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-steel-400"><span className="text-red-400">*</span><span>为必填项</span></div>
          </div>

          <div className="space-y-4">
            {/* Section 0: Notice */}
            <div ref={(el) => { sectionRefs.current['notice-area'] = el; }} className="bg-amber-50 rounded-lg border border-amber-200 p-4">
              <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center"><i className="ri-information-line text-amber-500" /></div>顶部提示
              </h3>
              <ul className="space-y-1.5 text-sm text-amber-700 list-disc pl-5">
                <li>交工资料最后审核人提示：大类及表单类为对应科长，自动化类为制造部对应科长和部长，信息化项目对应审批人，人工智能项目对应审批人</li>
                <li>项目类别安全经理/环保师提交规则提示</li>
                <li>交工归档说明：交工组盖归档章，单据交归档交工组</li>
                <li>竣工报备说明：竣工及天顶报备，申请单提交项目负责人点击确认按钮才做项目归档正式竣工</li>
              </ul>
            </div>

            {/* Section 1: Basic Info */}
            <div ref={(el) => { sectionRefs.current['basic-info'] = el; }} className="bg-white rounded-lg border border-steel-200 p-5">
              <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-info-line text-steel-500" /></div>基本信息
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="text-xs text-steel-500 block mb-1">交/竣工编号</label>
                  <input type="text" value={changeNo} readOnly className={readOnlyCls} />
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">年度计划号</label>
                  <input type="text" value={planNo} readOnly className={readOnlyCls} />
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">立项号</label>
                  <input type="text" value={projectNo} readOnly className={readOnlyCls} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-steel-500 block mb-1">项目名称</label>
                  <input type="text" value={projectName} readOnly className={readOnlyCls} />
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">异动类型 <span className="text-red-400">*</span></label>
                  <select value={changeType} onChange={(e) => { setChangeType(e.target.value); setDirty(true); if (errors.changeType) setErrors((prev) => { const n = { ...prev }; delete n.changeType; return n; }); }} className={inputCls + ' cursor-pointer'}>
                    <option value="">请选择异动类型</option>
                    {changeTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.changeType && <p className="text-xs text-red-500 mt-1">{errors.changeType}</p>}
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">异动状态</label>
                  <input type="text" value={changeStatus || (isEdit ? existingApp?.status || '' : '')} readOnly className={readOnlyCls} />
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">项目异动日期 <span className="text-red-400">*</span></label>
                  <input type="date" value={changeDate} onChange={(e) => { setChangeDate(e.target.value); setDirty(true); if (errors.changeDate) setErrors((prev) => { const n = { ...prev }; delete n.changeDate; return n; }); }} className={inputCls} />
                  {errors.changeDate && <p className="text-xs text-red-500 mt-1">{errors.changeDate}</p>}
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">文件数量</label>
                  <input type="number" value={fileCount} onChange={(e) => { setFileCount(e.target.value); setDirty(true); }} className={inputCls} min={0} />
                </div>
                <div>
                  <label className="text-xs text-steel-500 block mb-1">项目负责人是否竣工确认 <span className="text-red-400">*</span></label>
                  <select value={projMgrConfirmed} onChange={(e) => { setProjMgrConfirmed(e.target.value); setDirty(true); if (errors.projMgrConfirmed) setErrors((prev) => { const n = { ...prev }; delete n.projMgrConfirmed; return n; }); }} className={inputCls + ' cursor-pointer'}>
                    <option value="">请选择</option><option value="是">是</option><option value="否">否</option>
                  </select>
                  {errors.projMgrConfirmed && <p className="text-xs text-red-500 mt-1">{errors.projMgrConfirmed}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-steel-500 block mb-1">异动原因</label>
                  <textarea value={changeReason} onChange={(e) => { setChangeReason(e.target.value); setDirty(true); }} placeholder="请输入异动原因" className={inputCls} rows={2} maxLength={500} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-steel-500 block mb-1">异动说明</label>
                  <textarea value={changeNote} onChange={(e) => { setChangeNote(e.target.value); setDirty(true); }} placeholder="请输入异动说明" className={inputCls} rows={3} maxLength={500} />
                </div>
              </div>
            </div>

            {/* Section 2: Attachment List */}
            <div ref={(el) => { sectionRefs.current['attachment-list'] = el; }} className="bg-white rounded-lg border border-steel-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-steel-800 flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center"><i className="ri-attachment-2 text-steel-500" /></div>附件上传列表
                </h3>
                <button onClick={() => setUploadModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 transition-colors cursor-pointer whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增附件
                </button>
              </div>
              {attachments.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2"><i className="ri-attachment-2 text-xl text-steel-300" /></div>
                  <p className="text-sm text-steel-400">暂无附件，请点击"新增附件"添加</p>
                </div>
              ) : (
                <div className="border border-steel-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                        <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">项目阶段</th>
                        <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同类型</th>
                        <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">业务类别</th>
                        <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">文件类别(目录)</th>
                        <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">是否密传</th>
                        <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">文件数量</th>
                        <th className="px-4 py-3 text-xs font-semibold text-steel-500" style={{ minWidth: '140px' }}>补充说明</th>
                        <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center" style={{ minWidth: '140px' }}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attachments.map((att) => (
                        <tr key={att.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{att.projectPhase}</td>
                          <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{att.contractType}</td>
                          <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{att.businessCategory}</td>
                          <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{att.fileCategory}</td>
                          <td className="px-4 py-3 text-sm text-steel-600 text-center whitespace-nowrap">{att.isConfidential}</td>
                          <td className="px-4 py-3 text-sm text-steel-600 text-center whitespace-nowrap">{att.fileCount}</td>
                          <td className="px-4 py-3 text-sm text-steel-500">{att.remark}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="px-2.5 py-1.5 text-xs text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap">预览</button>
                              <button onClick={() => handleDeleteAttachment(att.id)} className="px-2.5 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 3: Bottom Info */}
            <div ref={(el) => { sectionRefs.current['bottom-info'] = el; }} className="bg-white rounded-lg border border-steel-200 p-5">
              <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center"><i className="ri-record-circle-line text-steel-500" /></div>底部信息
              </h3>
              <div className="grid grid-cols-5 gap-3 bg-slate-50 rounded-lg p-3 border border-steel-100">
                <div><label className="text-xs text-steel-400 block mb-0.5">创建人</label><span className="text-sm text-steel-700">{existingApp?.creator || '当前用户'}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">创建日期</label><span className="text-sm text-steel-700">{existingApp?.createDate || new Date().toISOString().split('T')[0]}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">创建时间</label><span className="text-sm text-steel-700">{existingApp?.createTime || new Date().toTimeString().slice(0, 8)}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">修改人</label><span className="text-sm text-steel-700">{existingApp?.modifier || (isEdit ? existingApp?.creator : '-')}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">修改日期</label><span className="text-sm text-steel-700">{existingApp?.modifyDate || (isEdit ? existingApp?.createDate : '-')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3" style={{ left: 'calc(14rem + 196px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <span className="text-xs text-steel-400 mr-auto"><i className="ri-shield-check-line mr-1 text-emerald-500" />提交前请确认所有必填项均已填写</span>
        <button onClick={handleBack} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-arrow-left-line mr-1" />取消</button>
        <button onClick={handleSave} className="px-5 py-2 text-sm border border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer" style={{ color: '#059669' }}><i className="ri-save-line mr-1.5" />保存</button>
        <button onClick={handleSubmit} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><i className="ri-send-plane-line" />提交</button>
      </div>

      {/* Leave Confirm */}
      {leaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setLeaveConfirm(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-96 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 flex-shrink-0"><i className="ri-alert-line text-amber-500 text-xl" /></div>
              <div><h4 className="text-sm font-semibold text-steel-800">确认离开？</h4><p className="text-xs text-steel-500 mt-0.5">当前页面有未保存的修改，离开后将丢失。</p></div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setLeaveConfirm(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">继续编辑</button>
              <button onClick={() => { setLeaveConfirm(false); navigate(-1); }} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>确认离开</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]"><div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border bg-emerald-50 border-emerald-200"><div className="w-5 h-5 flex items-center justify-center"><i className="ri-checkbox-circle-line text-emerald-500" /></div><span className="text-sm text-emerald-700">{toast}</span></div></div>
      )}

      {/* Attachment Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setUploadModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[800px] max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <div><h3 className="text-base font-semibold text-steel-800">文件上传</h3><p className="text-xs text-steel-400 mt-0.5">上传并管理附件文件</p></div>
              <button onClick={() => setUploadModalOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Toolbar */}
              <div className="flex items-center gap-2 flex-wrap">
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>新增</button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-amber-700 border border-amber-200 rounded-md hover:bg-amber-50 cursor-pointer whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-swap-line" /></div>替换文档</button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-delete-bin-line" /></div>删除</button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-delete-bin-6-line" /></div>全删</button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>更新画面</button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-sky-700 border border-sky-200 rounded-md hover:bg-sky-50 cursor-pointer whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-eye-line" /></div>预览</button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-violet-700 border border-violet-200 rounded-md hover:bg-violet-50 cursor-pointer whitespace-nowrap"><div className="w-4 h-4 flex items-center justify-center"><i className="ri-folder-open-line" /></div>选择管理系统附件</button>
              </div>
              {/* File picker */}
              <div className="border-2 border-dashed border-steel-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 mx-auto mb-2"><i className="ri-upload-cloud-2-line text-primary-500 text-xl" /></div>
                <p className="text-sm text-steel-500">点击选择文件或拖拽文件到此处</p>
                <p className="text-xs text-steel-400 mt-1">支持 PDF、Word、Excel、图片等格式，单文件不超过50MB</p>
              </div>
              {/* File List */}
              <div className="border border-steel-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500" style={{ minWidth: '240px' }}>文件名</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">上传时间</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">上传人员</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">版本号</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500" style={{ minWidth: '160px' }}>备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.map((f) => (
                      <tr key={f.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-steel-700">{f.fileName}</td>
                        <td className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">{f.uploadTime}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{f.uploader}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 text-center whitespace-nowrap">{f.version}</td>
                        <td className="px-4 py-3 text-sm text-steel-500">{f.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-2">
              <button onClick={() => setUploadModalOpen(false)} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={() => { setUploadModalOpen(false); showToast('附件已确认'); }} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确认</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Config Modal */}
      {approvalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setApprovalModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[640px] max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <div><h3 className="text-base font-semibold text-steel-800">自定义审批流配置</h3><p className="text-xs text-steel-400 mt-0.5">配置审批节点及审批人，确认后发起审批</p></div>
              <button onClick={() => setApprovalModalOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div><label className="text-xs text-steel-500 block mb-1">审批流名称</label><div className="px-3 py-2 text-sm text-steel-700 bg-slate-50 rounded-md border border-steel-200">交竣工审批流程</div></div>
              <div><label className="text-xs text-steel-500 block mb-2">审批节点列表</label>
                <div className="space-y-3">
                  {approvalNodes.map((node) => (
                    <div key={node.nodeId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-steel-100">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>{node.sequence}</div>
                      <div className="flex-1"><span className="text-sm font-medium text-steel-700">{node.nodeName}</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-steel-400">审批人:</span>
                        <select value={node.approver} onChange={(e) => { setApprovalNodes((prev) => prev.map((n) => n.nodeId === node.nodeId ? { ...n, approver: e.target.value } : n)); }} className="px-2 py-1.5 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
                          <option value="周建国">周建国</option><option value="郑文斌">郑文斌</option><option value="吴建国">吴建国</option><option value="孙志强">孙志强</option><option value="林晓东">林晓东</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-2">
              <button onClick={() => setApprovalModalOpen(false)} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={() => { showToast('提交成功，审批流程已发起'); setApprovalModalOpen(false); setDirty(false); setTimeout(() => navigate(-1), 1500); }} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>确认发起</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}