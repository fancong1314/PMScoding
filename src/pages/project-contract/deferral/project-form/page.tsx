import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getContractById, getApplicationById, getApprovalRecordsByAppId, formatCurrency } from '@/mocks/contractOverdueMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '基础信息' },
  { key: 'fill', label: '填写区域' },
  { key: 'attach', label: '附件与申报信息' },
  { key: 'approval', label: '审核流程记录' },
];

export default function OverdueProjectFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const appId = urlParams.get('appId') || '';
  const mode = urlParams.get('mode') || 'add'; // add or edit(approve)

  const contract = getContractById(contractId);
  const existingApp = appId ? getApplicationById(appId) : null;
  const isEdit = mode === 'edit' && !!existingApp;
  const approvalRecords = appId ? getApprovalRecordsByAppId(appId) : [];

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [formData, setFormData] = useState({
    appNo: existingApp?.appNo || '',
    approvalNo: contract?.approvalNo || '',
    contractNo: contract?.contractNo || '',
    contractName: contract?.contractName || '',
    contractAmount: contract?.contractAmount || 0,
    exemptAmount: existingApp?.exemptAmount || 0,
    planStartDate: existingApp?.planStartDate || contract?.signDate || '',
    planEndDate: existingApp?.planEndDate || '',
    delayEndDate: existingApp?.delayCompletionDate || '',
    delayDays: existingApp?.delayDays || 0,
    typeNode: existingApp?.typeNode || '设备安装',
    affectsCompletion: '',  // 是否影响完工时间
    causesReqDelay: '',  // 是否导致需规延期
    causesProjectDelay: '',  // 是否导致项目延期
    reqDelayDate: '',  // 需规延期至
    projectDelayDate: '',  // 项目延期至
    overdueReason: existingApp?.overdueReason || '',
    confirmReason: '',
    attachments: existingApp?.attachments || [],
    applyDate: existingApp?.applyDate || new Date().toISOString().split('T')[0],
    applicant: existingApp?.applicant || '当前用户 13800000000',
    currentOperator: isEdit ? existingApp?.currentOperator || '当前用户' : '当前用户',
    status: existingApp?.status || '暂存',
    createTime: existingApp?.createTime || new Date().toISOString().replace('T', ' ').slice(0, 19),
    operateTime: existingApp?.operateTime || new Date().toISOString().replace('T', ' ').slice(0, 19),
  });

  const [toast, setToast] = useState('');
  const [showFlowConfig, setShowFlowConfig] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

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

  useEffect(() => {
    if (formData.planEndDate && formData.delayEndDate) {
      const planEnd = new Date(formData.planEndDate);
      const delayEnd = new Date(formData.delayEndDate);
      const diff = Math.ceil((delayEnd.getTime() - planEnd.getTime()) / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({ ...prev, delayDays: diff > 0 ? diff : 0 }));
    }
  }, [formData.planEndDate, formData.delayEndDate]);

  const handleSave = () => {
    if (isEdit) {
      if (!formData.confirmReason.trim() && formData.overdueReason.trim()) return;
    } else {
      if (!formData.exemptAmount) { showToast('请输入预计免除考核金额'); return; }
      if (!formData.delayEndDate) { showToast('请选择延期计划完成时间'); return; }
      if (!formData.affectsCompletion) { showToast('请选择是否影响完工时间'); return; }
      if (!formData.overdueReason.trim()) { showToast('请输入合同超期原因'); return; }
    }
    showToast(isEdit ? '审批结果已保存' : '暂存成功');
  };

  const handleFlowSubmit = () => {
    setShowFlowConfig(false);
    showToast('审批流程已提交');
  };

  const handleApprove = () => {
    showToast('审批通过');
  };

  const handleReject = () => {
    if (!formData.confirmReason.trim()) { showToast('请输入退回原因'); return; }
    showToast('已退回');
  };

  if (!contract) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div>
      </Layout>
    );
  }

  const pageTitle = isEdit ? '项目组审批超期申请' : '项目组新增超期申请';

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
              <h1 className="text-lg font-semibold text-slate-800">{pageTitle}</h1>
            </div>
            <button onClick={() => navigate(`/project-contract/deferral/application-list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
            </button>
          </div>

          {/* Warning */}
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 leading-relaxed flex items-start gap-1">
              <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mt-0.5"><i className="ri-error-warning-line" /></div>
              注意：请经办人呈核生产厂和事业部领导审核即可，无需呈核制造部
            </p>
          </div>

          {/* Contract Info Bar */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同金额</span><span className="text-sm font-medium text-slate-800">{formatCurrency(contract.contractAmount)}</span></div>
          </div>

          {/* Section 1: Basic Info */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">基础信息</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同延期申请单号</span>
                  <input type="text" value={formData.appNo || '新增时自动生成'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">立项号</span>
                  <input type="text" value={formData.approvalNo} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同编号</span>
                  <input type="text" value={formData.contractNo} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同名称</span>
                  <input type="text" value={formData.contractName} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">合同金额(元)</span>
                  <input type="text" value={formatCurrency(formData.contractAmount)} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>预计免除考核金额</span>
                  {isEdit ? (
                    <input type="text" value={formatCurrency(formData.exemptAmount)} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                  ) : (
                    <input type="number" value={formData.exemptAmount || ''} onChange={(e) => setFormData({ ...formData, exemptAmount: Number(e.target.value) })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入金额" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">计划开工时间</span>
                  <input type="text" value={formData.planStartDate} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">计划完工时间</span>
                  <input type="text" value={formData.planEndDate} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>延期计划完成时间</span>
                  {isEdit ? (
                    <input type="text" value={formData.delayEndDate} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                  ) : (
                    <input type="date" value={formData.delayEndDate} onChange={(e) => setFormData({ ...formData, delayEndDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">延期天数</span>
                  <input type="text" value={`${formData.delayDays} 天`} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">类型节点</span>
                  <input type="text" value={formData.typeNode} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>是否影响完工时间</span>
                  {isEdit ? (
                    <input type="text" value={formData.affectsCompletion || '未填写'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                  ) : (
                    <select
                      value={formData.affectsCompletion}
                      onChange={(e) => setFormData({ ...formData, affectsCompletion: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">请选择</option>
                      <option value="是">是</option>
                      <option value="否">否</option>
                    </select>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>是否导致需规延期</span>
                  {isEdit ? (
                    <input type="text" value={formData.causesReqDelay || '未填写'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                  ) : (
                    <select
                      value={formData.causesReqDelay}
                      onChange={(e) => setFormData({ ...formData, causesReqDelay: e.target.value, reqDelayDate: e.target.value === '否' ? '' : formData.reqDelayDate })}
                      className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">请选择</option>
                      <option value="是">是</option>
                      <option value="否">否</option>
                    </select>
                  )}
                </div>
                {formData.causesReqDelay === '是' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>需规延期至</span>
                    {isEdit ? (
                      <input type="text" value={formData.reqDelayDate || '未填写'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                    ) : (
                      <input type="date" value={formData.reqDelayDate} onChange={(e) => setFormData({ ...formData, reqDelayDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>是否导致项目延期</span>
                  {isEdit ? (
                    <input type="text" value={formData.causesProjectDelay || '未填写'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                  ) : (
                    <select
                      value={formData.causesProjectDelay}
                      onChange={(e) => setFormData({ ...formData, causesProjectDelay: e.target.value, projectDelayDate: e.target.value === '否' ? '' : formData.projectDelayDate })}
                      className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">请选择</option>
                      <option value="是">是</option>
                      <option value="否">否</option>
                    </select>
                  )}
                </div>
                {formData.causesProjectDelay === '是' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>项目延期至</span>
                    {isEdit ? (
                      <input type="text" value={formData.projectDelayDate || '未填写'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                    ) : (
                      <input type="date" value={formData.projectDelayDate} onChange={(e) => setFormData({ ...formData, projectDelayDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Fill Area */}
          <div ref={(el) => { sectionRefs.current['fill'] = el; }} data-section="fill" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">填写区域</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1"><span className="text-red-500">*</span>合同超期原因</span>
                {isEdit ? (
                  <textarea value={formData.overdueReason} disabled rows={4} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500 resize-none" maxLength={250} />
                ) : (
                  <textarea value={formData.overdueReason} onChange={(e) => setFormData({ ...formData, overdueReason: e.target.value })} rows={4} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="请输入合同超期原因" maxLength={250} />
                )}
              </div>
              {formData.overdueReason.length > 0 && (
                <div className="text-xs text-slate-400 text-right">{formData.overdueReason.length}/250</div>
              )}
              {isEdit && (
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">确认/退回原因</span>
                  <textarea value={formData.confirmReason} onChange={(e) => setFormData({ ...formData, confirmReason: e.target.value })} rows={4} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="退回操作时必填" maxLength={500} />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Attachments & Info */}
          <div ref={(el) => { sectionRefs.current['attach'] = el; }} data-section="attach" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-slate-800">附件与申报信息</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">申报人上传其他附件</span>
                  <div className="flex-1">
                    {formData.attachments.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.attachments.map((file, fi) => (
                          <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-blue-100">
                            <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-line" /></div>
                            {file}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">暂无附件</span>
                    )}
                    {!isEdit && (
                      <button className="mt-2 px-3 py-1.5 text-xs text-slate-600 border border-dashed border-slate-300 rounded-md hover:bg-white cursor-pointer flex items-center gap-1 whitespace-nowrap">
                        <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-upload-line" /></div>上传附件
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">申报日期</span>
                  <input type="text" value={formData.applyDate} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">申请人及电话</span>
                  <input type="text" value={formData.applicant} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">当前操作人</span>
                  <input type="text" value={formData.currentOperator} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">状态</span>
                  <input type="text" value={formData.status} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">创建时间</span>
                  <input type="text" value={formData.createTime} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">操作时间</span>
                  <input type="text" value={formData.operateTime} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Approval Records */}
          <div ref={(el) => { sectionRefs.current['approval'] = el; }} data-section="approval" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-purple-500" />
              <span className="text-sm font-semibold text-slate-800">审核流程记录</span>
            </div>
            {approvalRecords.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">
                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2"><i className="ri-time-line text-lg" /></div>
                暂无审核流程记录
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">阶段</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalRecords.map((rec) => (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
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
            {!isEdit ? (
              <>
                <button onClick={() => { setShowFlowConfig(true); }} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
                </button>
                <button onClick={handleSave} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line" /></div>保存
                </button>
                <button onClick={() => navigate(`/project-contract/deferral/application-list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-close-line" /></div>取消
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowFlowConfig(true)} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
                </button>
                <button onClick={handleApprove} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>通过
                </button>
                <button onClick={handleReject} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>退回
                </button>
                <button className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-list-3-line" /></div>查看审批流详情
                </button>
                <button onClick={() => navigate(`/project-contract/deferral/application-list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-close-line" /></div>取消
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {showFlowConfig && (
        <ApprovalFlowConfigModal
          onClose={() => setShowFlowConfig(false)}
          onConfirm={handleFlowSubmit}
          defaultTitle={`超期申请审批-${contract.contractNo || ''}`}
        />
      )}
    </Layout>
  );
}