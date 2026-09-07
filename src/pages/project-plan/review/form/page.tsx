import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { reviewRecords, defaultBudgetTree } from '@/mocks/reviewMocks';
import type { ReviewRecord, BudgetTreeNode } from '@/mocks/reviewMocks';
import BudgetReviewTable from './components/BudgetReviewTable';

interface UploadFile { name: string; size: string; }
interface FormErrors { [key: string]: string; }

const SECTIONS = [
  { id: 'basic',   title: '基本信息',       icon: 'ri-file-info-line' },
  { id: 'comment', title: '批示意见',       icon: 'ri-chat-check-line' },
  { id: 'attach',  title: '文档附件',       icon: 'ri-attachment-line' },
  { id: 'budget',  title: '立项概算审核明细', icon: 'ri-table-line' },
];

function getRecord(id: string | null): ReviewRecord | null {
  if (!id) return null;
  try {
    const stored = localStorage.getItem('ng_review_records');
    const records = stored ? JSON.parse(stored) : reviewRecords;
    return records.find((r: ReviewRecord) => r.id === id) ?? null;
  } catch { return null; }
}

function calcBudgetTotal(tree: BudgetTreeNode[]): number {
  const totalNode = tree.find((n) => n.category === 'total');
  return totalNode ? totalNode.total : 0;
}

export default function ReviewFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const record = getRecord(recordId);

  const [softwareCost, setSoftwareCost] = useState<string>('');
  const [integrationCost, setIntegrationCost] = useState<string>('');
  const [constructionCost, setConstructionCost] = useState<string>('');
  const [equipCost, setEquipCost] = useState<string>('');
  const [personnelChange, setPersonnelChange] = useState<0 | 1 | 2>(0);
  const [personnelCount, setPersonnelCount] = useState<string>('');
  const [handlerComment, setHandlerComment] = useState('');
  const [leaderComment, setLeaderComment] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeSection, setActiveSection] = useState('basic');
  const [budgetTree, setBudgetTree] = useState<BudgetTreeNode[]>(defaultBudgetTree);
  const [attachments, setAttachments] = useState<Record<string, UploadFile | null>>({
    commitment: null, opinion: null, committee: null, office: null, special: null,
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const budgetTotal = calcBudgetTotal(budgetTree);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibilityMap: Record<string, number> = {};
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibilityMap[id] = entry.intersectionRatio;
          const maxId = Object.entries(visibilityMap).sort((a, b) => b[1] - a[1])[0]?.[0];
          if (maxId) setActiveSection(maxId);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-100px 0px -50% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  }, []);

  const handleFileUpload = (key: string, file: File | null) => {
    if (!file) return;
    const size = file.size > 1024 * 1024
      ? `${(file.size / 1024 / 1024).toFixed(1)}MB`
      : `${(file.size / 1024).toFixed(0)}KB`;
    setAttachments((prev) => ({ ...prev, [key]: { name: file.name, size } }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!handlerComment.trim()) e.handlerComment = '承办意见为必填项';
    if ((personnelChange === 1 || personnelChange === 2) && !personnelCount) {
      e.personnelCount = '选择增减时岗位人数为必填项';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) {
      showToast('请检查并填写必填项', 'error');
      const firstKey = Object.keys(e)[0];
      const sectionMap: Record<string, string> = { handlerComment: 'comment', personnelCount: 'basic' };
      scrollToSection(sectionMap[firstKey] ?? 'basic');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    showToast('保存成功');
  };

  const handleSubmit = () => {
    if (!validate()) return;
    showToast('呈核提交成功，已进入审批流程');
    setTimeout(() => navigate('/project-plan/review', { state: { success: true, message: '呈核提交成功' } }), 1200);
  };

  const inputCls = (field = '') =>
    `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors ${errors[field] ? 'border-red-400 bg-red-50/30' : 'border-steel-200 bg-white'}`;

  const readonlyFieldCls = 'w-full px-3 py-2 text-sm border border-steel-100 rounded-md bg-slate-50 text-steel-600 cursor-default';

  const sectionHeaderCls = 'flex items-center gap-2.5 px-5 py-3.5';
  const gridLabel = 'flex justify-end items-start text-sm text-steel-600 pt-2 leading-5';
  const requiredStar = <span className="text-red-500 ml-0.5">*</span>;

  const AttachmentRow = ({ fieldKey, label }: { fieldKey: string; label: string }) => {
    const file = attachments[fieldKey];
    return (
      <div className="flex items-center gap-3 py-2.5 border-b border-steel-50 last:border-0">
        <span className="text-sm text-steel-600 w-28 flex-shrink-0">{label}</span>
        {file ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 rounded-md flex-1 min-w-0">
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <i className="ri-file-text-line text-primary-500 text-sm" />
              </div>
              <span className="text-xs text-primary-700 truncate flex-1">{file.name}</span>
              <span className="text-xs text-steel-400 flex-shrink-0">{file.size}</span>
            </div>
            <button onClick={() => setAttachments((p) => ({ ...p, [fieldKey]: null }))}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-steel-400 hover:text-red-500 cursor-pointer flex-shrink-0">
              <i className="ri-close-line text-sm" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-500 border border-dashed border-steel-200 rounded-md hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-2-line" /></div>
            点击上传
            <input type="file" className="hidden" onChange={(e) => handleFileUpload(fieldKey, e.target.files?.[0] ?? null)} />
          </label>
        )}
      </div>
    );
  };

  const mockApplyNo = record?.applyNo ?? '20260040100';
  const mockApplyName = record?.applyName ?? '中普商业智能平台数字化整合提升';

  return (
    <Layout mainClassName="flex-1 relative">
      <div className="flex" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
        {/* Left Anchor Nav */}
        <div className="fixed z-30 flex flex-col py-5"
          style={{ left: '14rem', top: '3.5rem', width: '200px', height: 'calc(100vh - 3.5rem)', background: 'white', borderRight: '1px solid #e8edf3' }}>
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-steel-400 uppercase tracking-wider">表单导航</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3">
            {SECTIONS.map((sec, idx) => (
              <button key={sec.id} onClick={() => scrollToSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all cursor-pointer mb-0.5 text-left ${activeSection === sec.id ? 'font-medium' : 'text-steel-500 hover:text-steel-700 hover:bg-slate-50'}`}
                style={activeSection === sec.id ? { color: '#2563eb', backgroundColor: '#eff6ff' } : undefined}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all"
                  style={activeSection === sec.id ? { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white' } : { backgroundColor: '#e8edf3', color: '#718096' }}>
                  {idx + 1}
                </div>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{sec.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Form Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6" style={{ marginLeft: '200px' }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-steel-900">立项审核呈核表单</h2>
              <p className="text-xs text-steel-400 mt-0.5">请填写审核信息，完成后点击呈核提交进入审批流程</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-steel-400">
              <span className="text-red-400">*</span><span>为必填项</span>
            </div>
          </div>

          {/* Section 1: 基本信息 */}
          <div id="basic" ref={(el) => { sectionRefs.current['basic'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-info-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">基本信息</h3>
            </div>
            <div className="p-5 space-y-0">
              {/* Readonly info grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={gridLabel}>论证申请单号</label>
                  <div className={readonlyFieldCls}>{mockApplyNo}</div>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={gridLabel}>审核经办人</label>
                  <div className={readonlyFieldCls}>{record?.handler ?? '朱科长'}</div>
                </div>
                <div className="col-span-2 grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={gridLabel}>论证申请单名称</label>
                  <div className={readonlyFieldCls}>{mockApplyName}</div>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={gridLabel}>申报费用</label>
                  <div className={`${readonlyFieldCls} flex items-center justify-between`}>
                    <span>0</span><span className="text-xs text-steel-400">万元</span>
                  </div>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={gridLabel}>同行论证编号</label>
                  <div className={readonlyFieldCls}>—</div>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={gridLabel}>论证费用</label>
                  <div className={`${readonlyFieldCls} flex items-center justify-between`}>
                    <span>0</span><span className="text-xs text-steel-400">万元</span>
                  </div>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={gridLabel}>建议立项费用</label>
                  <div className={`${readonlyFieldCls} flex items-center justify-between`}>
                    <span>0</span><span className="text-xs text-steel-400">万元</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-steel-100 my-4" />

              {/* Editable cost fields */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: '软件费用', val: softwareCost, set: setSoftwareCost },
                  { label: '系统集成费用', val: integrationCost, set: setIntegrationCost },
                  { label: '建安费用', val: constructionCost, set: setConstructionCost },
                  { label: '设备费用', val: equipCost, set: setEquipCost },
                ].map(({ label, val, set }) => (
                  <div key={label} className="grid grid-cols-[110px_1fr] gap-3 items-start">
                    <label className={gridLabel}>{label}</label>
                    <div className="relative">
                      <input
                        type="number" min={0} step="1"
                        value={val}
                        onChange={(e) => set(e.target.value)}
                        placeholder="0.00"
                        className={inputCls() + ' pr-12'}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">万元</span>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={gridLabel}>岗位增减{requiredStar}</label>
                  <div>
                    <div className="flex gap-4 pt-1.5">
                      {([{ val: 0, label: '无' }, { val: 1, label: '增加' }, { val: 2, label: '减少' }] as { val: 0 | 1 | 2; label: string }[]).map((opt) => (
                        <label key={opt.val} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="personnelChange" checked={personnelChange === opt.val}
                            onChange={() => { setPersonnelChange(opt.val); if (opt.val === 0) setPersonnelCount(''); }}
                            className="w-4 h-4 border-steel-300 text-primary-500 cursor-pointer" />
                          <span className="text-sm text-steel-600">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {(personnelChange === 1 || personnelChange === 2) && (
                  <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                    <label className={gridLabel}>增减人数{requiredStar}</label>
                    <div>
                      <div className="relative">
                        <input type="number" min={1}
                          value={personnelCount}
                          onChange={(e) => { setPersonnelCount(e.target.value); setErrors((p) => { const n = { ...p }; delete n.personnelCount; return n; }); }}
                          placeholder="请输入人数"
                          className={inputCls('personnelCount') + ' pr-8'} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">人</span>
                      </div>
                      {errors.personnelCount && <p className="mt-1 text-xs text-red-500">{errors.personnelCount}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* 历史状态 */}
              <div className="mt-4 border-t border-steel-100 pt-4">
                <div className="text-xs text-steel-500 font-medium mb-2">历史状态记录</div>
                <div className="space-y-2">
                  {[
                    { time: '2026-04-01 09:30', user: '李建国', action: '提交立项申请', status: '待审核' },
                    { time: '2026-04-02 14:15', user: '朱科长', action: '接收审核任务', status: 'G项目资料审核中' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-md">
                      <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />
                      <span className="text-xs text-steel-400 whitespace-nowrap">{item.time}</span>
                      <span className="text-xs text-steel-600">{item.user}</span>
                      <span className="text-xs text-steel-500">{item.action}</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 批示意见 */}
          <div id="comment" ref={(el) => { sectionRefs.current['comment'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-chat-check-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">批示意见</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                <label className={gridLabel}>承办意见{requiredStar}</label>
                <div>
                  <textarea
                    value={handlerComment}
                    onChange={(e) => { setHandlerComment(e.target.value); setErrors((p) => { const n = { ...p }; delete n.handlerComment; return n; }); }}
                    placeholder="请填写承办环节审核意见..."
                    maxLength={500}
                    rows={5}
                    className={`w-full px-3 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 resize-none transition-colors ${errors.handlerComment ? 'border-red-400 bg-red-50/30 focus:ring-red-500/20' : 'border-steel-200 focus:ring-primary-500/20 focus:border-primary-500'}`}
                  />
                  <div className="flex items-center justify-between mt-0.5">
                    {errors.handlerComment
                      ? <span className="text-xs text-red-500">{errors.handlerComment}</span>
                      : <span />}
                    <span className="text-xs text-steel-400">{handlerComment.length}/500</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                <label className={gridLabel}>批示意见</label>
                <div>
                  <textarea
                    value={leaderComment}
                    onChange={(e) => setLeaderComment(e.target.value)}
                    placeholder="领导批示意见（可留空，由审批领导填写）..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                  />
                  <div className="flex justify-end mt-0.5">
                    <span className="text-xs text-steel-400">{leaderComment.length}/500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 文档附件 */}
          <div id="attach" ref={(el) => { sectionRefs.current['attach'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-attachment-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">文档附件</h3>
              <span className="text-xs text-steel-400 ml-1">支持 PDF、Word、Excel 格式，单文件不超过 20MB</span>
            </div>
            <div className="px-5 py-3">
              <AttachmentRow fieldKey="commitment" label="项目承诺书" />
              <AttachmentRow fieldKey="opinion"     label="论证意见" />
              <AttachmentRow fieldKey="committee"   label="全委会意见" />
              <AttachmentRow fieldKey="office"      label="办公会意见" />
              <AttachmentRow fieldKey="special"     label="中特等意见" />
            </div>
          </div>

          {/* Section 4: 立项概算审核明细 */}
          <div id="budget" ref={(el) => { sectionRefs.current['budget'] = el; }}
            className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
            <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-table-line text-primary-500" /></div>
              <h3 className="text-sm font-semibold text-steel-800">立项概算审核明细</h3>
              <span className="text-xs text-steel-400 ml-1">树形层级结构，支持增删明细行，数值自动汇总</span>
            </div>
            <div className="p-5">
              <BudgetReviewTable
                treeData={budgetTree}
                onChange={setBudgetTree}
                budgetTotal={budgetTotal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
        style={{ left: 'calc(14rem + 200px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <span className="text-xs text-steel-400 mr-4 hidden lg:block">
          <i className="ri-information-line mr-1" />
          提交后将进入项目负责人审批流程
        </span>
        <button onClick={() => navigate('/project-plan/review')}
          className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
          取消
        </button>
        <button onClick={handleSave}
          className="px-5 py-2 text-sm border border-primary-300 rounded-md transition-colors whitespace-nowrap cursor-pointer hover:bg-primary-50"
          style={{ color: '#2563eb' }}>
          <i className="ri-save-line mr-1.5" />
          保存
        </button>
        <button onClick={handleSubmit}
          className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          <i className="ri-send-plane-line" />
          呈核提交
        </button>
      </div>

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
