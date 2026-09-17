import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { opinionSignRecords, opinionSignHandlers, type OpinionSignRecord } from '@/mocks/opinionSignMocks';

export default function OpinionSignFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const record: OpinionSignRecord | undefined = recordId
    ? opinionSignRecords.find((r) => r.id === recordId)
    : undefined;

  const [planNoChecked, setPlanNoChecked] = useState(false);
  const [planNo, setPlanNo] = useState(record?.planNo ?? '');
  const [applyName, setApplyName] = useState(record?.applyName ?? '');
  const [currentSituation, setCurrentSituation] = useState(record?.currentSituation ?? '');
  const [mainScheme, setMainScheme] = useState(record?.mainScheme ?? '');
  const [mainDevice, setMainDevice] = useState(record?.mainDevice ?? '');

  const [water, setWater] = useState(record?.water ?? '');
  const [electricity, setElectricity] = useState(record?.electricity ?? '');
  const [gas, setGas] = useState(record?.gas ?? '');
  const [oxygen, setOxygen] = useState(record?.oxygen ?? '');
  const [otherAux, setOtherAux] = useState(record?.otherAux ?? '');

  const [techTarget, setTechTarget] = useState(record?.techTarget ?? '');
  const [benefitEffect, setBenefitEffect] = useState(record?.benefitEffect ?? '');
  const [otherTarget, setOtherTarget] = useState(record?.otherTarget ?? '');

  const [personnelChange, setPersonnelChange] = useState(record?.personnelChange ?? '');
  const [innovation, setInnovation] = useState(record?.innovation ?? '');
  const [energyAssess, setEnergyAssess] = useState(record?.energyAssess ?? '');
  const [applyDuration, setApplyDuration] = useState(record?.applyDuration ?? '');
  const [suggestDuration, setSuggestDuration] = useState(record?.suggestDuration ?? '');
  const [riskOpportunity, setRiskOpportunity] = useState(record?.riskOpportunity ?? '');
  const [relatedOpinion, setRelatedOpinion] = useState(record?.relatedOpinion ?? '');
  const [planAmount, setPlanAmount] = useState(record?.planAmount?.toString() ?? '');
  const [declareAmount, setDeclareAmount] = useState(record?.declareAmount?.toString() ?? '');
  const [suggestAmount, setSuggestAmount] = useState(record?.suggestAmount?.toString() ?? '');
  const [costComposition, setCostComposition] = useState(record?.costComposition ?? '');
  const [removeUpdateCost, setRemoveUpdateCost] = useState(record?.removeUpdateCost?.toString() ?? '');
  const [conclusion, setConclusion] = useState(record?.conclusion ?? '');
  const [orgUnit, setOrgUnit] = useState(record?.orgUnit ?? '');
  const [argumentDate, setArgumentDate] = useState(record?.argumentDate ?? '');
  const [attendees, setAttendees] = useState(record?.attendees ?? '');

  const [meetingLocation, setMeetingLocation] = useState(record?.meetingLocation ?? '');
  const [committeeDate, setCommitteeDate] = useState(record?.committeeDate ?? '');
  const [committeeAttendees, setCommitteeAttendees] = useState(record?.committeeAttendees ?? '');
  const [committeeStatus, setCommitteeStatus] = useState(record?.committeeStatus ?? '');

  const [attachments, setAttachments] = useState<{ name: string; size: number }[]>(
    record?.attachments.map((a) => ({ name: a.name, size: a.size })) ?? []
  );
  const [dragOver, setDragOver] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState<'cancel' | 'save'>('cancel');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    if (planNoChecked && !planNo.trim()) { showToast('请填写年度计划号', 'error'); return false; }
    if (!applyName.trim()) { showToast('请填写名称', 'error'); return false; }
    if (!applyDuration) { showToast('请选择申报工期', 'error'); return false; }
    if (suggestDuration && suggestDuration < applyDuration) { showToast('建议工期应晚于申报工期', 'error'); return false; }
    if (planAmount && isNaN(Number(planAmount))) { showToast('计划金额只能输入数字', 'error'); return false; }
    if (declareAmount && isNaN(Number(declareAmount))) { showToast('申报金额只能输入数字', 'error'); return false; }
    if (suggestAmount && isNaN(Number(suggestAmount))) { showToast('建议金额只能输入数字', 'error'); return false; }
    if (removeUpdateCost && isNaN(Number(removeUpdateCost))) { showToast('拆除更新设备费用只能输入数字', 'error'); return false; }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    showToast('保存成功，已记录签署操作日志');
    setTimeout(() => navigate('/project-argument/opinion-sign'), 1200);
  };

  const handleCancelClick = () => {
    setConfirmType('cancel');
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    navigate('/project-argument/opinion-sign');
    setShowConfirm(false);
  };

  const handleConfirmSave = () => {
    handleSave();
    setShowConfirm(false);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles: { name: string; size: number }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        showToast(`「${file.name}」超过10MB，无法上传`, 'error');
        continue;
      }
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const allowed = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'];
      if (!allowed.includes(ext)) {
        showToast(`「${file.name}」格式不支持`, 'error');
        continue;
      }
      newFiles.push({ name: file.name, size: file.size });
    }
    setAttachments((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0) showToast(`成功上传 ${newFiles.length} 个文件`);
  };

  const handleDeleteAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white';
  const textareaCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none bg-white';
  const readonlyCls = 'w-full px-3 py-2 text-sm border border-steel-100 rounded-md bg-slate-50 text-steel-600';
  const numberCls = inputCls + ' pr-10';

  const labelCls = 'flex justify-end items-start text-sm text-steel-600 pt-2 leading-5 flex-shrink-0';

  const sectionHeader = (icon: string, title: string) => (
    <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
      <div className="w-5 h-5 flex items-center justify-center"><i className={`${icon} text-primary-500`} /></div>
      <h3 className="text-sm font-semibold text-steel-800">{title}</h3>
    </div>
  );

  const formField = (
    label: string,
    content: React.ReactNode,
    required = false,
    colSpan = false
  ) => (
    <div className={`grid gap-3 items-start ${colSpan ? 'col-span-2 grid-cols-[130px_1fr]' : 'grid-cols-[130px_1fr]'}`}>
      <label className={labelCls}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {content}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto pb-24">
        {/* Title */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-steel-900">论证意见签署</h2>
          <p className="text-xs text-steel-400 mt-0.5">填写或修改论证意见相关内容，带 * 号为必填项</p>
        </div>

        {/* Basic Info Module */}
        <div className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
          {sectionHeader('ri-file-info-line', '基础信息模块')}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {/* 年度计划号 */}
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>年度计划号</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={planNoChecked}
                    onChange={(e) => setPlanNoChecked(e.target.checked)}
                    className="w-4 h-4 accent-primary-500 cursor-pointer flex-shrink-0"
                  />
                  <input
                    value={planNo}
                    onChange={(e) => setPlanNo(e.target.value)}
                    placeholder={planNoChecked ? '请输入年度计划号' : '请先勾选'}
                    className={inputCls}
                    disabled={!planNoChecked}
                  />
                </div>
              </div>

              {/* 名称 */}
              {formField('名称', <input value={applyName} onChange={(e) => setApplyName(e.target.value)} placeholder="请输入名称" className={inputCls} />, true)}

              {/* 现状和必要性 */}
              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>现状和必要性</label>
                <textarea value={currentSituation} onChange={(e) => setCurrentSituation(e.target.value)} rows={4} maxLength={500} placeholder="请输入现状和必要性描述" className={textareaCls} />
              </div>

              {/* 方案和主要内容 */}
              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>方案和主要内容</label>
                <textarea value={mainScheme} onChange={(e) => setMainScheme(e.target.value)} rows={4} maxLength={500} placeholder="请输入方案和主要内容" className={textareaCls} />
              </div>

              {/* 主要设备/设施 */}
              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>主要设备/设施</label>
                <textarea value={mainDevice} onChange={(e) => setMainDevice(e.target.value)} rows={4} maxLength={500} placeholder="请输入主要设备和设施清单" className={textareaCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Public Auxiliary Module */}
        <div className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
          {sectionHeader('ri-water-flash-line', '公辅配套模块')}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {formField('水', <input value={water} onChange={(e) => setWater(e.target.value)} placeholder="请输入水的配套需求" className={inputCls} />)}
              {formField('电', <input value={electricity} onChange={(e) => setElectricity(e.target.value)} placeholder="请输入电的配套需求" className={inputCls} />)}
              {formField('燃气', <input value={gas} onChange={(e) => setGas(e.target.value)} placeholder="请输入燃气的配套需求" className={inputCls} />)}
              {formField('氧氮氩气（汽）', <input value={oxygen} onChange={(e) => setOxygen(e.target.value)} placeholder="请输入氧氮氩气的配套需求" className={inputCls} />)}
              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>其他</label>
                <input value={otherAux} onChange={(e) => setOtherAux(e.target.value)} placeholder="请输入其他公辅配套需求" className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Project Goal Module */}
        <div className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
          {sectionHeader('ri-focus-3-line', '项目目标模块')}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>技术目标<br />（生产设备/工艺）</label>
                <textarea value={techTarget} onChange={(e) => setTechTarget(e.target.value)} rows={3} maxLength={500} placeholder="请输入技术目标" className={textareaCls} />
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>效益效果</label>
                <textarea value={benefitEffect} onChange={(e) => setBenefitEffect(e.target.value)} rows={3} maxLength={500} placeholder="请输入预期效益效果" className={textareaCls} />
              </div>
              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>其它目标<br />（安全、环保等）</label>
                <textarea value={otherTarget} onChange={(e) => setOtherTarget(e.target.value)} rows={3} maxLength={500} placeholder="请输入安全、环保等其他目标" className={textareaCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Other Project Info Module */}
        <div className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
          {sectionHeader('ri-article-line', '其他项目信息模块')}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {formField('人员岗位增减', <input value={personnelChange} onChange={(e) => setPersonnelChange(e.target.value)} placeholder="请输入人员岗位变化情况" className={inputCls} />)}

              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>创新性智能数字化</label>
                <textarea value={innovation} onChange={(e) => setInnovation(e.target.value)} rows={3} maxLength={500} placeholder="请输入创新点和智能化数字化相关内容" className={textareaCls} />
              </div>

              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>能源提升与评估</label>
                <textarea value={energyAssess} onChange={(e) => setEnergyAssess(e.target.value)} rows={3} maxLength={500} placeholder="请输入能源消耗评估内容" className={textareaCls} />
              </div>

              {formField('申报工期', (
                <input type="date" value={applyDuration} onChange={(e) => setApplyDuration(e.target.value)} className={inputCls} />
              ), true)}

              {formField('建议工期', (
                <input type="date" value={suggestDuration} onChange={(e) => setSuggestDuration(e.target.value)} className={inputCls} />
              ))}

              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>风险与机遇评估</label>
                <textarea value={riskOpportunity} onChange={(e) => setRiskOpportunity(e.target.value)} rows={3} maxLength={500} placeholder="请输入项目风险与机遇分析" className={textareaCls} />
              </div>

              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>相关意见</label>
                <textarea value={relatedOpinion} onChange={(e) => setRelatedOpinion(e.target.value)} rows={3} maxLength={500} placeholder="请输入其他相关意见" className={textareaCls} />
              </div>

              {formField('计划（万元）', (
                <div className="relative">
                  <input type="number" value={planAmount} onChange={(e) => setPlanAmount(e.target.value)} placeholder="请输入计划投资金额" className={numberCls} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">万元</span>
                </div>
              ))}

              {formField('申报（万元）', (
                <div className="relative">
                  <input type="number" value={declareAmount} onChange={(e) => setDeclareAmount(e.target.value)} placeholder="请输入申报投资金额" className={numberCls} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">万元</span>
                </div>
              ))}

              {formField('建议（万元）', (
                <div className="relative">
                  <input type="number" value={suggestAmount} onChange={(e) => setSuggestAmount(e.target.value)} placeholder="请输入建议投资金额" className={numberCls} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">万元</span>
                </div>
              ))}

              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>费用组成</label>
                <textarea value={costComposition} onChange={(e) => setCostComposition(e.target.value)} rows={3} maxLength={500} placeholder="请输入投资费用组成说明" className={textareaCls} />
              </div>

              {formField('拆除更新设备（万元）', (
                <div className="relative">
                  <input type="number" value={removeUpdateCost} onChange={(e) => setRemoveUpdateCost(e.target.value)} placeholder="请输入拆除更新设备费用" className={numberCls} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-400">万元</span>
                </div>
              ))}

              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>论证结论</label>
                <textarea value={conclusion} onChange={(e) => setConclusion(e.target.value)} rows={3} maxLength={500} placeholder="请输入论证最终结论" className={textareaCls} />
              </div>

              {formField('论证组织单位', <input value={orgUnit} onChange={(e) => setOrgUnit(e.target.value)} placeholder="请输入组织论证的单位" className={inputCls} />)}

              {formField('论证日期', (
                <input type="date" value={argumentDate} onChange={(e) => setArgumentDate(e.target.value)} className={inputCls} />
              ))}

              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>参会人员（单位）</label>
                <textarea value={attendees} onChange={(e) => setAttendees(e.target.value)} rows={2} maxLength={300} placeholder="请输入参会人员及单位信息" className={textareaCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Full Committee Module */}
        <div className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
          {sectionHeader('ri-government-line', '全委会模块')}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {formField('召开地点', <input value={meetingLocation} onChange={(e) => setMeetingLocation(e.target.value)} placeholder="请输入全委会召开地点" className={inputCls} />)}
              {formField('日期', (
                <input type="date" value={committeeDate} onChange={(e) => setCommitteeDate(e.target.value)} className={inputCls} />
              ))}
              <div className="col-span-2 grid grid-cols-[130px_1fr] gap-3 items-start">
                <label className={labelCls}>参会人员</label>
                <textarea value={committeeAttendees} onChange={(e) => setCommitteeAttendees(e.target.value)} rows={2} maxLength={300} placeholder="请输入全委会参会人员信息" className={textareaCls} />
              </div>
              {formField('全委会状态', <input value={committeeStatus} onChange={(e) => setCommitteeStatus(e.target.value)} placeholder="请输入全委会审批状态" className={inputCls} />)}
            </div>
          </div>
        </div>

        {/* File Upload Module */}
        <div className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
          {sectionHeader('ri-attachment-line', '文件上传模块')}
          <div className="p-5">
            <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
              <label className={labelCls}>论证意见上传</label>
              <div>
                <div
                  className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer ${
                    dragOver ? 'border-primary-400 bg-primary-50' : 'border-steel-200 hover:border-primary-300'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
                  onClick={() => document.getElementById('opinion-file-upload')?.click()}
                >
                  <input
                    id="opinion-file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 mx-auto mb-2">
                    <i className="ri-upload-cloud-2-line text-xl text-orange-500" />
                  </div>
                  <p className="text-sm text-steel-500">点击上传或拖拽文件到此处</p>
                  <p className="text-xs text-steel-400 mt-1">支持 Word、PDF、Excel、JPG 等格式，单个文件不超过10MB</p>
                </div>

                {/* Attachment List */}
                {attachments.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-md border border-steel-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 flex items-center justify-center rounded bg-steel-100">
                            <i className="ri-file-line text-steel-500" />
                          </div>
                          <div>
                            <p className="text-sm text-steel-700">{att.name}</p>
                            <p className="text-xs text-steel-400">{formatFileSize(att.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAttachment(idx)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-steel-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-steel-400">无附件</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
        style={{ left: 'calc(14rem)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={handleCancelClick}
          className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
          取消
        </button>
        <button onClick={() => { setConfirmType('save'); setShowConfirm(true); }}
          className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          <i className="ri-save-line" />
          保存
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[420px] p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmType === 'cancel' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                <i className={`text-lg ${confirmType === 'cancel' ? 'ri-question-line text-amber-600' : 'ri-save-line text-blue-600'}`} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-steel-800 mb-1">
                  {confirmType === 'cancel' ? '放弃编辑' : '确认保存'}
                </h3>
                <p className="text-sm text-steel-500">
                  {confirmType === 'cancel'
                    ? '确定要放弃当前编辑内容并返回列表吗？未保存的数据将被丢弃。'
                    : '确认要保存当前的论证意见签署内容吗？保存后将记录操作日志并返回列表。'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                取消
              </button>
              <button onClick={confirmType === 'cancel' ? handleConfirmCancel : handleConfirmSave}
                className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 cursor-pointer whitespace-nowrap"
                style={{ background: confirmType === 'cancel' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                {confirmType === 'cancel' ? '确认放弃' : '确认保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={toast.type === 'success' ? 'ri-checkbox-circle-line text-green-500' : 'ri-close-circle-line text-red-500'} />
            </div>
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{toast.message}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}