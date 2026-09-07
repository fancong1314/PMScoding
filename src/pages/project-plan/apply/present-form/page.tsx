import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { applyRecords } from '@/mocks/applyMocks';
import type { ApplyRecord } from '@/mocks/applyMocks';
import ApprovalInitModal from '@/pages/project-plan/declaration/components/ApprovalInitModal';
import type { NodeConfigType } from '@/pages/project-plan/declaration/components/ApprovalInitModal';

const SECTIONS = [
  { id: 'basic', title: '基本信息', icon: 'ri-file-info-line' },
  { id: 'reason', title: '技改理由', icon: 'ri-lightbulb-line' },
  { id: 'content', title: '技改主要内容', icon: 'ri-file-list-3-line' },
  { id: 'personnel', title: '人力资源部门意见', icon: 'ri-team-line' },
  { id: 'indicator', title: '技经指标', icon: 'ri-bar-chart-2-line' },
  { id: 'investment', title: '投资费用估算', icon: 'ri-money-cny-circle-line' },
  { id: 'benefit', title: '经济效益测算', icon: 'ri-increase-decrease-line' },
  { id: 'schedule', title: '项目进度计划', icon: 'ri-calendar-check-line' },
  { id: 'risk', title: '风险评估', icon: 'ri-alert-line' },
  { id: 'feasibility', title: '项目可行性论证', icon: 'ri-check-double-line' },
  { id: 'attachment', title: '附件上传', icon: 'ri-attachment-2' },
];

const orgUnits = ['炼铁事业部', '炼钢事业部', '热轧事业部', '冷轧事业部', '科技质量部', '工程管理部', '安全环保部', '设备管理部', '采购供应部', '财务部'];
const personnelList = ['李建国', '王志远', '赵明辉', '陈思远', '刘洋', '张伟', '孙宇', '周鑫', '吴刚', '郑浩', '朱科长'];

interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  uploadTime: string;
  uploader: string;
}

interface InvestSubRow {
  id: string;
  name: string;
  specModel: string;
  isFourNine: string;
  procurementCatalog: string;
  buildCost: string;
  installCost: string;
  equipCost: string;
  otherCost: string;
  unit: string;
  quantity: string;
  quantityT: string;
  indicator: string;
  remark: string;
}

interface InvestMainRow {
  id: 'engineering' | 'other' | 'reserve' | 'total';
  seq: number;
  name: string;
  subRows: InvestSubRow[];
  reserveTotal: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

let subRowCounter = 0;
function makeSubRow(): InvestSubRow {
  subRowCounter += 1;
  return {
    id: `sr${subRowCounter}`,
    name: '', specModel: '', isFourNine: '否', procurementCatalog: '',
    buildCost: '', installCost: '', equipCost: '', otherCost: '',
    unit: '', quantity: '', quantityT: '', indicator: '', remark: '',
  };
}

function sumCost(rows: InvestMainRow[], field: keyof InvestSubRow): number {
  return rows.flatMap((r) => r.subRows).reduce((s, sr) => s + (parseFloat((sr[field] as string) || '0') || 0), 0);
}

function rowTotal(sr: InvestSubRow): number {
  return (parseFloat(sr.buildCost || '0') || 0)
    + (parseFloat(sr.installCost || '0') || 0)
    + (parseFloat(sr.equipCost || '0') || 0)
    + (parseFloat(sr.otherCost || '0') || 0);
}

function mainRowTotal(row: InvestMainRow): number {
  if (row.id === 'reserve') return parseFloat(row.reserveTotal || '0') || 0;
  return row.subRows.reduce((s, sr) => s + rowTotal(sr), 0);
}

function grandTotal(rows: InvestMainRow[]): number {
  return rows.filter((r) => r.id !== 'total').reduce((s, r) => s + mainRowTotal(r), 0);
}

export default function ApplyPresentFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const record: ApplyRecord | undefined = applyRecords.find((r) => r.id === recordId);
  const readonly = searchParams.get('readonly') === 'true';

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  // Basic Info
  const [projectName, setProjectName] = useState(record?.applyName ?? '');
  const [dept, setDept] = useState(orgUnits[0]);
  const [projectOwner, setProjectOwner] = useState(record?.manager ?? '');
  const [applyDate, setApplyDate] = useState(new Date().toISOString().slice(0, 10));
  const [planNo] = useState(record?.planNo ?? '');
  const [argumentNo] = useState(record?.applyNo ?? '');
  const [argumentName] = useState(record?.applyName ?? '');
  const [projectType, setProjectType] = useState(record?.projectType ?? '技改项目');
  const [isPreApply, setIsPreApply] = useState(record?.isPreApply === 1 ? '是' : '否');
  const [preApplyNo, setPreApplyNo] = useState(record?.preApplyNo ?? '');
  const [projectManager, setProjectManager] = useState(record?.manager ?? '');

  // 技改理由 — auto-fill from 年度计划现状字段 / 论证字段
  const [bgText, setBgText] = useState(
    '当前高炉冷却系统采用传统铸铁冷却壁，受设计工艺限制，冷却效果不均匀，局部区域热负荷超标，影响高炉长周期稳定运行。近年来炉况频繁波动，年均非计划休风次数达12次，严重制约产能发挥。（自动带入年度计划现状字段）'
  );
  const [necessityText, setNecessityText] = useState(
    '随着铁前工序产能扩大，现有高炉冷却能力已成为制约炼铁产能提升的关键瓶颈。通过改造冷却系统可有效延长高炉寿命，降低非计划停炉风险，保障年产铁稳定在480万吨以上。（自动带入论证-建设必要性字段）'
  );
  const [feasibilityText, setFeasibilityText] = useState(
    '铜冷却壁技术在国内大型高炉已有成熟应用案例，技术路线可行。工程改造可利用高炉大修窗口期实施，不影响正常生产。资金来源已列入年度技改预算，审批程序合规。（自动带入论证-建设可行性字段）'
  );

  // 技改主要内容
  const [mainContent, setMainContent] = useState('');

  // 人力资源部门意见
  const [involvesPersonnel, setInvolvesPersonnel] = useState(false);
  const [hrOpinion, setHrOpinion] = useState('不涉及人员增加');

  useEffect(() => {
    if (!involvesPersonnel) {
      setHrOpinion('不涉及人员增加');
    } else {
      setHrOpinion('根据人力资源部门批示：同意按需配置相关人员，请项目部门按规定程序办理用工手续。（自动带入人力资源批示意见，可修改）');
    }
  }, [involvesPersonnel]);

  // 技经指标 — 合并论证中的技术目标、效益效果、其他目标
  const [techIndicator, setTechIndicator] = useState(
    '【技术目标】高炉冷却强度提升30%，冷却壁寿命由原8年延长至15年以上，热流强度控制在45000 kcal/m²·h以内。\n【效益效果】年节约非计划停炉损失约2400万元，高炉利用系数提升至2.35 t/m³·d，燃料比降低8 kg/tFe。\n【其他目标】改造后安全风险等级由C级降至D级，满足绿色制造评价标准。（自动合并带入论证字段，可修改）'
  );

  // 投资费用估算 — 新结构
  const [investRows, setInvestRows] = useState<InvestMainRow[]>([
    {
      id: 'engineering', seq: 1, name: '工程费用', reserveTotal: '',
      subRows: [
        { id: 'sr_e1', name: '铜冷却壁采购及安装', specModel: 'HBL-450型', isFourNine: '是', procurementCatalog: '设备类', buildCost: '', installCost: '85.00', equipCost: '450.00', otherCost: '', unit: '套', quantity: '1', quantityT: '', indicator: '', remark: '含检测认证费' },
        { id: 'sr_e2', name: '炉壳局部改造', specModel: '', isFourNine: '否', procurementCatalog: '', buildCost: '120.00', installCost: '45.00', equipCost: '', otherCost: '', unit: '项', quantity: '1', quantityT: '', indicator: '', remark: '' },
      ],
    },
    {
      id: 'other', seq: 2, name: '工程建设其他费', reserveTotal: '',
      subRows: [
        { id: 'sr_o1', name: '设计及监理费', specModel: '', isFourNine: '否', procurementCatalog: '', buildCost: '', installCost: '', equipCost: '', otherCost: '53.00', unit: '项', quantity: '1', quantityT: '', indicator: '', remark: '' },
        { id: 'sr_o2', name: '调试及验收费', specModel: '', isFourNine: '否', procurementCatalog: '', buildCost: '', installCost: '', equipCost: '', otherCost: '18.00', unit: '项', quantity: '1', quantityT: '', indicator: '', remark: '' },
      ],
    },
    { id: 'reserve', seq: 3, name: '预备费', subRows: [], reserveTotal: '37.10' },
    { id: 'total', seq: 4, name: '项目总投资', subRows: [], reserveTotal: '' },
  ]);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['engineering', 'other']));

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const addSubRow = (mainId: string) => {
    setInvestRows((prev) => prev.map((r) => r.id === mainId ? { ...r, subRows: [...r.subRows, makeSubRow()] } : r));
    setExpandedRows((prev) => new Set([...prev, mainId]));
  };

  const removeSubRow = (mainId: string, subId: string) => {
    setInvestRows((prev) => prev.map((r) => r.id === mainId ? { ...r, subRows: r.subRows.filter((s) => s.id !== subId) } : r));
  };

  const updateSubRow = (mainId: string, subId: string, field: keyof InvestSubRow, val: string) => {
    setInvestRows((prev) => prev.map((r) => r.id === mainId ? {
      ...r, subRows: r.subRows.map((s) => s.id === subId ? { ...s, [field]: val } : s),
    } : r));
  };

  const updateReserve = (val: string) => {
    setInvestRows((prev) => prev.map((r) => r.id === 'reserve' ? { ...r, reserveTotal: val } : r));
  };

  // 经济效益测算 — 取值论证效益审批批示意见
  const [econCalc, setEconCalc] = useState(
    '根据论证效益审批批示意见：项目实施后预计年新增利润2800万元，投资回收期约2.7年，净现值（NPV）为5600万元（折现率8%），内部收益率（IRR）达34.2%，经济效益显著，批准立项。（自动带入论证效益审批批示意见，可修改）'
  );

  // 项目进度计划（移除申报部门、部门负责人）
  const [buildMonths, setBuildMonths] = useState(record?.buildDuration?.toString() ?? '');
  const [declarationDate, setDeclarationDate] = useState(new Date().toISOString().slice(0, 10));

  // 风险评估（保留内容评估字段，删除科技质量部/试验检测所/信息化部/能源环保部/安全监督部评估意见字段）
  const [processQuality, setProcessQuality] = useState('');
  const [processOpinion, setProcessOpinion] = useState('');
  const [integrationEval, setIntegrationEval] = useState('');
  const [energyEnv, setEnergyEnv] = useState('');
  const [safetyEval, setSafetyEval] = useState('');

  // 项目可行性论证 — 结论意见改为附件上传，删除参加论证人员
  const [feasibilityAttachments, setFeasibilityAttachments] = useState<AttachmentFile[]>([]);

  // 审核审批 / 技改项目责任书 — 模块保留，内容全部删除（空壳）

  // 附件上传
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!projectName.trim()) errs['projectName'] = '项目名称不能为空';
    if (!projectOwner.trim()) errs['projectOwner'] = '项目责任人不能为空';
    if (!projectManager.trim()) errs['projectManager'] = '项目经理不能为空';
    if (isPreApply === '是' && !preApplyNo.trim()) errs['preApplyNo'] = '选择预立项时预立项号必填';
    if (!bgText.trim()) errs['bgText'] = '项目背景不能为空';
    if (!necessityText.trim()) errs['necessityText'] = '项目建设必要性不能为空';
    if (!feasibilityText.trim()) errs['feasibilityText'] = '项目建设可行性不能为空';
    if (!mainContent.trim()) errs['mainContent'] = '技改主要内容不能为空';
    if (!techIndicator.trim()) errs['techIndicator'] = '技经指标不能为空';
    if (!econCalc.trim()) errs['econCalc'] = '经济效益测算不能为空';
    if (!buildMonths.trim()) errs['buildMonths'] = '项目进度计划不能为空';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => showToast('保存成功');
  const handleCancel = () => setCancelConfirmOpen(true);

  const handleSubmit = () => {
    if (!validate()) { showToast('请完善必填字段后再呈核', 'error'); return; }
    setApprovalOpen(true);
  };

  const handleApprovalConfirm = (_templateId: string | null, _customNodes: NodeConfigType[]) => {
    setApprovalOpen(false);
    showToast('呈核已提交，项目状态已变更为审批中');
    setTimeout(() => navigate('/project-plan/apply'), 1500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<AttachmentFile[]>>, current: AttachmentFile[]) => {
    const files = e.target.files;
    if (!files) return;
    const next: AttachmentFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.size > 50 * 1024 * 1024) { showToast(`文件「${f.name}」超过50MB限制`, 'error'); continue; }
      if (current.length + next.length >= 20) { showToast('最多上传20个文件', 'error'); break; }
      next.push({ id: `att_${Date.now()}_${i}`, name: f.name, size: f.size, uploadTime: new Date().toLocaleString('zh-CN'), uploader: '当前用户' });
    }
    setter((prev) => [...prev, ...next]);
    e.target.value = '';
  };

  const removeAttachment = (id: string, setter: React.Dispatch<React.SetStateAction<AttachmentFile[]>>) => {
    setter((prev) => prev.filter((a) => a.id !== id));
  };

  const inputCls = readonly
    ? 'w-full px-3 py-2 text-sm border border-steel-100 rounded-md bg-slate-50 text-steel-700 cursor-default'
    : 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white';
  const selectCls = readonly
    ? 'w-full px-3 py-2 text-sm border border-steel-100 rounded-md bg-slate-50 text-steel-700 cursor-default appearance-none pointer-events-none'
    : inputCls + ' cursor-pointer';
  const readonlyCls = 'w-full px-3 py-2 text-sm border border-steel-100 rounded-md bg-slate-50 text-steel-600';
  const labelCls = 'flex justify-end items-start text-sm text-steel-600 pt-2 leading-5';
  const sectionHeaderCls = 'flex items-center gap-2.5 px-5 py-3.5';

  const errorBorder = (field: string) => errors[field] ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : '';

  const RichTextArea = ({ value, onChange, placeholder, rows = 3, maxLen = 2000, fieldKey }: {
    value: string; onChange: (v: string) => void; placeholder: string; rows?: number; maxLen?: number; fieldKey?: string;
  }) => (
    <div className={`border rounded-md overflow-hidden ${fieldKey && errors[fieldKey] ? 'border-red-400' : readonly ? 'border-steel-100' : 'border-steel-200'}`}>
      {!readonly && (
        <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-50 border-b border-steel-100">
          {['ri-bold', 'ri-italic', 'ri-list-unordered', 'ri-list-ordered', 'ri-link'].map((icon) => (
            <button key={icon} type="button"
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-steel-400 cursor-pointer transition-colors">
              <i className={`${icon} text-xs`} />
            </button>
          ))}
        </div>
      )}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} readOnly={readonly}
        rows={rows} maxLength={maxLen} className={`w-full px-3 py-2 text-sm focus:outline-none resize-none ${readonly ? 'bg-slate-50 text-steel-700 cursor-default' : ''}`} />
      <div className="flex justify-end px-2 py-1 bg-slate-50 border-t border-steel-100">
        <span className="text-xs text-steel-400">{value.length}/{maxLen}</span>
      </div>
      {fieldKey && errors[fieldKey] && <p className="px-3 py-1 text-xs text-red-500">{errors[fieldKey]}</p>}
    </div>
  );

  const TextAreaField = ({ value, onChange, placeholder, rows = 2 }: {
    value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
  }) => (
    <div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} readOnly={readonly}
        rows={rows} maxLength={500}
        className={`w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none border ${readonly ? 'border-steel-100 bg-slate-50 text-steel-700' : 'border-steel-200'}`} />
      <div className="flex justify-end"><span className="text-xs text-steel-400">{value.length}/500</span></div>
    </div>
  );

  const PersonSelector = ({ selected, onChange, readOnly = false }: {
    selected: string; onChange: (v: string) => void; readOnly?: boolean;
  }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const filtered = personnelList.filter((p) => p.includes(search));
    if (readOnly) return <span className="text-sm text-steel-700">{selected || '-'}</span>;
    return (
      <div className="relative">
        <div onClick={() => setOpen(!open)}
          className={`${inputCls} flex items-center justify-between cursor-pointer`}>
          <span className={selected ? 'text-sm text-steel-700' : 'text-steel-400 text-sm'}>{selected || '请选择人员'}</span>
          <i className={open ? 'ri-arrow-up-s-line text-steel-400' : 'ri-arrow-down-s-line text-steel-400'} />
        </div>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-steel-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
            <div className="p-2 border-b border-steel-100">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索人员..."
                className="w-full px-3 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none" autoFocus />
            </div>
            {filtered.map((p) => (
              <button key={p} onClick={() => { onChange(p); setOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-primary-50 cursor-pointer ${selected === p ? 'bg-primary-50 text-primary-700' : 'text-steel-700'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const FormSection = ({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) => (
    <div id={id} ref={(el) => { sectionRefs.current[id] = el; }}
      className="bg-white rounded-lg border border-steel-200 mb-4 overflow-hidden">
      <div className={sectionHeaderCls} style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
        <div className="w-5 h-5 flex items-center justify-center"><i className={`${icon} text-primary-500`} /></div>
        <h3 className="text-sm font-semibold text-steel-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const GridRow = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="grid gap-3 items-start grid-cols-[110px_1fr]">
      <label className={labelCls}>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <div>{children}</div>
    </div>
  );

  const AttachmentUploader = ({
    list, setter, accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.rar,.zip',
  }: {
    list: AttachmentFile[];
    setter: React.Dispatch<React.SetStateAction<AttachmentFile[]>>;
    accept?: string;
  }) => (
    <div className="space-y-3">
      <p className="text-xs text-steel-400">支持PDF、Word等格式，单个文件不超过50MB，最多20个文件</p>
      {!readonly && (
        <label className="flex flex-col items-center justify-center gap-2 px-6 py-6 border-2 border-dashed border-steel-300 rounded-lg hover:border-primary-400 hover:bg-primary-50/30 cursor-pointer transition-colors">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100">
            <i className="ri-upload-cloud-2-line text-lg text-steel-400" />
          </div>
          <span className="text-sm text-steel-500">点击上传文件</span>
          <input type="file" multiple onChange={(e) => handleFileSelect(e, setter, list)} className="hidden" accept={accept} />
        </label>
      )}
      {list.length > 0 && (
        <div className="space-y-1.5 mt-2">
          {list.map((att) => (
            <div key={att.id} className="flex items-center justify-between px-3 py-2 border border-steel-200 rounded-lg bg-slate-50/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 flex items-center justify-center rounded bg-primary-50 flex-shrink-0">
                  <i className="ri-file-text-line text-primary-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-steel-700 truncate">{att.name}</p>
                  <p className="text-xs text-steel-400">{formatSize(att.size)} · {att.uploadTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                <button title="预览" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-steel-400 hover:text-primary-500 cursor-pointer">
                  <i className="ri-eye-line text-sm" />
                </button>
                <button title="下载" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-steel-400 hover:text-primary-500 cursor-pointer">
                  <i className="ri-download-line text-sm" />
                </button>
                {!readonly && (
                  <button onClick={() => removeAttachment(att.id, setter)} title="删除"
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-steel-400 hover:text-red-500 cursor-pointer">
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Investment table helpers
  const cellInput = (val: string, onChange: (v: string) => void, type: 'text' | 'number' = 'text', align: 'left' | 'right' | 'center' = 'left') => (
    readonly ? (
      <span className={`text-xs text-steel-700 block w-full text-${align}`}>{val || '-'}</span>
    ) : (
      <input
        type={type}
        value={val}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-400 text-${align}`}
      />
    )
  );

  const cellSelect = (val: string, onChange: (v: string) => void, options: string[]) => (
    readonly ? (
      <span className="text-xs text-steel-700 block w-full text-center">{val}</span>
    ) : (
      <select value={val} onChange={(e) => onChange(e.target.value)}
        className="w-full px-1 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-400 cursor-pointer">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  );

  const gt = grandTotal(investRows);

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
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
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
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-steel-900">{readonly ? '项目立项申请-查看详情' : '项目立项申请-呈核'}</h2>
            <p className="text-xs text-steel-400 mt-0.5">{readonly ? '查看立项报告详细信息' : '填写立项报告表单后发起自定义审批流程'}</p>
          </div>

          {/* Section 1: 基本信息 */}
          <FormSection id="basic" title="基本信息" icon="ri-file-info-line">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <GridRow label="项目名称" required>
                <div>
                  <input value={projectName} onChange={(e) => setProjectName(e.target.value)} maxLength={100} readOnly={readonly}
                    placeholder="请输入项目名称" className={`${inputCls} ${errorBorder('projectName')}`} />
                  {errors['projectName'] && <p className="text-xs text-red-500 mt-1">{errors['projectName']}</p>}
                </div>
              </GridRow>
              <GridRow label="所在部门" required>
                <select value={dept} onChange={(e) => setDept(e.target.value)} className={selectCls} disabled={readonly}>
                  {orgUnits.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </GridRow>
              <GridRow label="项目责任人" required>
                <PersonSelector selected={projectOwner} onChange={setProjectOwner} readOnly={readonly} />
              </GridRow>
              <GridRow label="申请日期" required>
                <input type="date" value={applyDate} onChange={(e) => setApplyDate(e.target.value)} className={inputCls} readOnly={readonly} />
              </GridRow>
              <GridRow label="年度计划号" required>
                <div className={readonlyCls}>{planNo || '系统自动带入'}</div>
              </GridRow>
              <GridRow label="论证申请单号">
                <div className={readonlyCls}>{argumentNo || '系统自动带入'}</div>
              </GridRow>
              <GridRow label="论证申请单名称">
                <div className={readonlyCls}>{argumentName || '系统自动带入'}</div>
              </GridRow>
              <GridRow label="项目类型" required>
                <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className={selectCls} disabled={readonly}>
                  {['技改项目', '新建项目', '维修项目', '科研项目'].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </GridRow>
              <GridRow label="是否预立项" required>
                <select value={isPreApply} onChange={(e) => setIsPreApply(e.target.value)} className={selectCls} disabled={readonly}>
                  {['否', '是'].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </GridRow>
              <GridRow label="预立项号" required={isPreApply === '是'}>
                <div>
                  <input value={preApplyNo} onChange={(e) => setPreApplyNo(e.target.value)} readOnly={readonly || isPreApply !== '是'}
                    placeholder={isPreApply === '是' ? '请输入预立项号' : ''}
                    disabled={isPreApply !== '是' && !readonly}
                    className={`${isPreApply === '是' ? inputCls : readonlyCls} ${errorBorder('preApplyNo')}`} />
                  {errors['preApplyNo'] && <p className="text-xs text-red-500 mt-1">{errors['preApplyNo']}</p>}
                </div>
              </GridRow>
              <GridRow label="项目经理" required>
                <PersonSelector selected={projectManager} onChange={setProjectManager} readOnly={readonly} />
              </GridRow>
            </div>
          </FormSection>

          {/* Section 2: 技改理由 */}
          <FormSection id="reason" title="技改理由" icon="ri-lightbulb-line">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-steel-700 font-medium mb-1.5 flex items-center gap-2">
                  项目背景<span className="text-red-500">*</span>
                </label>
                <RichTextArea value={bgText} onChange={setBgText} placeholder="描述项目背景..." rows={4} fieldKey="bgText" />
              </div>
              <div>
                <label className="text-sm text-steel-700 font-medium mb-1.5 flex items-center gap-2">
                  项目建设必要性<span className="text-red-500">*</span>
                </label>
                <RichTextArea value={necessityText} onChange={setNecessityText} placeholder="描述项目建设的必要性..." rows={4} fieldKey="necessityText" />
              </div>
              <div>
                <label className="text-sm text-steel-700 font-medium mb-1.5 flex items-center gap-2">
                  项目建设可行性<span className="text-red-500">*</span>
                </label>
                <RichTextArea value={feasibilityText} onChange={setFeasibilityText} placeholder="描述项目建设的可行性..." rows={4} fieldKey="feasibilityText" />
              </div>
            </div>
          </FormSection>

          {/* Section 3: 技改主要内容 */}
          <FormSection id="content" title="技改主要内容" icon="ri-file-list-3-line">
            <div>
              <label className="text-sm text-steel-700 font-medium mb-1.5 block">技改主要内容<span className="text-red-500 ml-0.5">*</span></label>
              <RichTextArea value={mainContent} onChange={setMainContent} placeholder="描述技改的主要内容..." rows={5} fieldKey="mainContent" />
            </div>
          </FormSection>

          {/* Section 4: 人力资源部门意见 */}
          <FormSection id="personnel" title="人力资源部门意见" icon="ri-team-line">
            <div className="space-y-4">

              <div>
                <label className="text-sm text-steel-700 font-medium mb-1.5 block">人力资源部门意见</label>
                <TextAreaField value={hrOpinion} onChange={setHrOpinion} placeholder="人力资源部门意见..." rows={3} />
              </div>
            </div>
          </FormSection>

          {/* Section 5: 技经指标 */}
          <FormSection id="indicator" title="技经指标" icon="ri-bar-chart-2-line">
            <div>
              <label className="text-sm text-steel-700 font-medium mb-1.5 block">主要技经指标的目标值（或改进值）<span className="text-red-500 ml-0.5">*</span></label>
              <RichTextArea value={techIndicator} onChange={setTechIndicator} placeholder="描述主要技经指标的目标值或改进值..." rows={5} fieldKey="techIndicator" />
            </div>
          </FormSection>

          {/* Section 6: 投资费用估算 */}
          <FormSection id="investment" title="投资费用估算" icon="ri-money-cny-circle-line">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className="ri-table-2 text-primary-500 text-base" />
                <span className="text-sm font-semibold text-steel-800">项目投资估算子表</span>
                <span className="text-xs text-steel-400 ml-1">填写各项费用明细</span>
              </div>
              <div className="overflow-x-auto border border-steel-200 rounded-lg">
                <table className="w-full text-xs" style={{ minWidth: '1200px' }}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-steel-200">
                      <th rowSpan={2} className="px-2 py-2 text-xs font-semibold text-steel-600 text-center border-r border-steel-200 w-10">序号</th>
                      <th rowSpan={2} className="px-2 py-2 text-xs font-semibold text-steel-600 text-left border-r border-steel-200 w-32">项目/费用名称</th>
                      <th rowSpan={2} className="px-2 py-2 text-xs font-semibold text-steel-600 text-center border-r border-steel-200 w-24">规格型号</th>
                      <th rowSpan={2} className="px-2 py-2 text-xs font-semibold text-steel-600 text-center border-r border-steel-200 w-20">
                        是否四类九款
                      </th>
                      <th rowSpan={2} className="px-2 py-2 text-xs font-semibold text-steel-600 text-center border-r border-steel-200 w-20">采购目录</th>
                      <th colSpan={5} className="px-2 py-2 text-xs font-semibold text-steel-600 text-center border-r border-steel-200">费用估算（万元）</th>
                      <th colSpan={4} className="px-2 py-2 text-xs font-semibold text-steel-600 text-center border-r border-steel-200">综合指标</th>
                      <th rowSpan={2} className="px-2 py-2 text-xs font-semibold text-steel-600 text-center border-r border-steel-200 w-20">备注</th>
                      <th rowSpan={2} className="px-2 py-2 text-xs font-semibold text-steel-600 text-center w-14">操作</th>
                    </tr>
                    <tr className="bg-slate-50 border-b border-steel-200">
                      <th className="px-2 py-1.5 text-xs font-medium text-steel-500 text-center border-r border-steel-100 w-20">建筑工程费</th>
                      <th className="px-2 py-1.5 text-xs font-medium text-steel-500 text-center border-r border-steel-100 w-20">安装工程费</th>
                      <th className="px-2 py-1.5 text-xs font-medium text-steel-500 text-center border-r border-steel-100 w-20">设备费</th>
                      <th className="px-2 py-1.5 text-xs font-medium text-steel-500 text-center border-r border-steel-100 w-20">其他费</th>
                      <th className="px-2 py-1.5 text-xs font-medium text-steel-500 text-center border-r border-steel-200 w-20">合计</th>
                      <th className="px-2 py-1.5 text-xs font-medium text-steel-500 text-center border-r border-steel-100 w-14">单位</th>
                      <th className="px-2 py-1.5 text-xs font-medium text-steel-500 text-center border-r border-steel-100 w-14">数量</th>
                      <th className="px-2 py-1.5 text-xs font-medium text-steel-500 text-center border-r border-steel-100 w-14">量量/T</th>
                      <th className="px-2 py-1.5 text-xs font-medium text-steel-500 text-center border-r border-steel-200 w-14">指标</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investRows.map((row) => {
                      if (row.id === 'total') {
                        return (
                          <tr key="total" className="bg-amber-50/60 font-semibold border-t border-steel-200">
                            <td className="px-2 py-2 text-center text-steel-600 border-r border-steel-100">{row.seq}</td>
                            <td className="px-2 py-2 text-steel-800 font-semibold border-r border-steel-100">{row.name}</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-200">-</td>
                            <td className="px-2 py-2 text-right text-steel-900 font-bold border-r border-steel-200">{gt.toFixed(2)}</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-200">-</td>
                            <td className="px-2 py-2 border-r border-steel-100" />
                            <td className="px-2 py-2" />
                          </tr>
                        );
                      }
                      if (row.id === 'reserve') {
                        return (
                          <tr key="reserve" className="bg-slate-50/60 border-t border-steel-200">
                            <td className="px-2 py-2 text-center text-steel-500 border-r border-steel-100">{row.seq}</td>
                            <td className="px-2 py-2 text-steel-700 font-medium border-r border-steel-100">{row.name}</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-200">-</td>
                            <td className="px-2 py-2 border-r border-steel-200">
                              {cellInput(row.reserveTotal, updateReserve, 'number', 'right')}
                            </td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-200">-</td>
                            <td className="px-2 py-2 border-r border-steel-100" />
                            <td className="px-2 py-2" />
                          </tr>
                        );
                      }
                      // engineering / other
                      const isExpanded = expandedRows.has(row.id);
                      const mainTotal = mainRowTotal(row);
                      return (
                        <>
                          <tr key={row.id} className="border-t border-steel-200 bg-slate-50/30 hover:bg-slate-50/60">
                            <td className="px-2 py-2 text-center text-steel-500 border-r border-steel-100">{row.seq}</td>
                            <td className="px-2 py-2 border-r border-steel-100">
                              <div className="flex items-center gap-1.5">
                                {row.subRows.length > 0 && (
                                  <button onClick={() => toggleExpand(row.id)}
                                    className="w-4 h-4 flex items-center justify-center text-steel-400 hover:text-primary-500 cursor-pointer flex-shrink-0">
                                    <i className={isExpanded ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />
                                  </button>
                                )}
                                <span className="text-xs font-medium text-steel-700">{row.name}</span>
                              </div>
                            </td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-right text-steel-600 border-r border-steel-100">
                              {row.subRows.reduce((s, sr) => s + (parseFloat(sr.buildCost || '0') || 0), 0).toFixed(2)}
                            </td>
                            <td className="px-2 py-2 text-right text-steel-600 border-r border-steel-100">
                              {row.subRows.reduce((s, sr) => s + (parseFloat(sr.installCost || '0') || 0), 0).toFixed(2)}
                            </td>
                            <td className="px-2 py-2 text-right text-steel-600 border-r border-steel-100">
                              {row.subRows.reduce((s, sr) => s + (parseFloat(sr.equipCost || '0') || 0), 0).toFixed(2)}
                            </td>
                            <td className="px-2 py-2 text-right text-steel-600 border-r border-steel-200">
                              {row.subRows.reduce((s, sr) => s + (parseFloat(sr.otherCost || '0') || 0), 0).toFixed(2)}
                            </td>
                            <td className="px-2 py-2 text-right font-semibold text-steel-800 border-r border-steel-200">{mainTotal.toFixed(2)}</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-100">-</td>
                            <td className="px-2 py-2 text-center text-steel-400 border-r border-steel-200">-</td>
                            <td className="px-2 py-2 border-r border-steel-100" />
                            <td className="px-2 py-2 text-center">
                              {!readonly && (
                                <button onClick={() => addSubRow(row.id)}
                                  className="w-6 h-6 flex items-center justify-center rounded text-primary-500 hover:bg-primary-50 cursor-pointer border border-primary-300">
                                  <i className="ri-add-line" style={{ fontSize: '12px' }} />
                                </button>
                              )}
                            </td>
                          </tr>
                          {isExpanded && row.subRows.map((sr) => (
                            <tr key={sr.id} className="border-t border-steel-100 hover:bg-primary-50/20">
                              <td className="px-2 py-1.5 border-r border-steel-100" />
                              <td className="px-2 py-1.5 border-r border-steel-100 pl-6">
                                {cellInput(sr.name, (v) => updateSubRow(row.id, sr.id, 'name', v))}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellInput(sr.specModel, (v) => updateSubRow(row.id, sr.id, 'specModel', v), 'text', 'center')}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellSelect(sr.isFourNine, (v) => updateSubRow(row.id, sr.id, 'isFourNine', v), ['否', '是'])}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellInput(sr.procurementCatalog, (v) => updateSubRow(row.id, sr.id, 'procurementCatalog', v), 'text', 'center')}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellInput(sr.buildCost, (v) => updateSubRow(row.id, sr.id, 'buildCost', v), 'number', 'right')}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellInput(sr.installCost, (v) => updateSubRow(row.id, sr.id, 'installCost', v), 'number', 'right')}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellInput(sr.equipCost, (v) => updateSubRow(row.id, sr.id, 'equipCost', v), 'number', 'right')}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-200">
                                {cellInput(sr.otherCost, (v) => updateSubRow(row.id, sr.id, 'otherCost', v), 'number', 'right')}
                              </td>
                              <td className="px-2 py-1.5 text-right font-medium text-steel-700 border-r border-steel-200">
                                {rowTotal(sr).toFixed(2)}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellInput(sr.unit, (v) => updateSubRow(row.id, sr.id, 'unit', v), 'text', 'center')}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellInput(sr.quantity, (v) => updateSubRow(row.id, sr.id, 'quantity', v), 'number', 'center')}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellInput(sr.quantityT, (v) => updateSubRow(row.id, sr.id, 'quantityT', v), 'number', 'center')}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-200">
                                {cellInput(sr.indicator, (v) => updateSubRow(row.id, sr.id, 'indicator', v), 'text', 'center')}
                              </td>
                              <td className="px-2 py-1.5 border-r border-steel-100">
                                {cellInput(sr.remark, (v) => updateSubRow(row.id, sr.id, 'remark', v))}
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                {!readonly && (
                                  <button onClick={() => removeSubRow(row.id, sr.id)}
                                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-steel-400 hover:text-red-500 cursor-pointer">
                                    <i className="ri-delete-bin-line" style={{ fontSize: '11px' }} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-steel-400 mt-2">注：下面各行费用合计汇总自动带入，预备费可手动填写，项目总投资自动计算。</p>
            </div>
          </FormSection>

          {/* Section 7: 经济效益测算 */}
          <FormSection id="benefit" title="经济效益测算" icon="ri-increase-decrease-line">
            <div>
              <label className="text-sm text-steel-700 font-medium mb-1.5 block">
                经济效益测算<span className="text-red-500 ml-0.5">*</span>
              </label>
              <RichTextArea value={econCalc} onChange={setEconCalc} placeholder="描述经济效益测算分析..." rows={4} fieldKey="econCalc" />
            </div>
          </FormSection>

          {/* Section 8: 项目进度计划（删除申报部门、部门负责人） */}
          <FormSection id="schedule" title="项目进度计划" icon="ri-calendar-check-line">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <GridRow label="项目进度计划" required>
                <div className="relative">
                  <input type="number" min={0} value={buildMonths} onChange={(e) => setBuildMonths(e.target.value)} readOnly={readonly}
                    placeholder="立项批准后N个月完成" className={`${inputCls} pr-16 ${errorBorder('buildMonths')}`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-steel-400">个月</span>
                </div>
              </GridRow>
              <GridRow label="申报日期" required>
                <input type="date" value={declarationDate} onChange={(e) => setDeclarationDate(e.target.value)} className={inputCls} readOnly={readonly} />
              </GridRow>
            </div>
          </FormSection>

          {/* Section 9: 风险评估（删除科技质量部/试验检测所/信息化部/能源环保部/安全监督部评估意见） */}
          <FormSection id="risk" title="风险评估" icon="ri-alert-line">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-steel-700 font-medium mb-1.5 block">工艺及产品质量评估</label>
                <RichTextArea value={processQuality} onChange={setProcessQuality} placeholder="描述工艺及产品质量评估内容..." rows={3} />
              </div>
              <div>
                <label className="text-sm text-steel-700 font-medium mb-1.5 block">两化融合评估</label>
                <RichTextArea value={integrationEval} onChange={setIntegrationEval} placeholder="描述两化融合评估内容..." rows={3} />
              </div>
              <div>
                <label className="text-sm text-steel-700 font-medium mb-1.5 block">能源及环境保护评估</label>
                <RichTextArea value={energyEnv} onChange={setEnergyEnv} placeholder="描述能源及环境保护评估内容..." rows={3} />
              </div>
              <div>
                <label className="text-sm text-steel-700 font-medium mb-1.5 block">安全评估</label>
                <RichTextArea value={safetyEval} onChange={setSafetyEval} placeholder="描述安全评估内容..." rows={3} />
              </div>
            </div>
          </FormSection>

          {/* Section 10: 项目可行性论证（结论意见→附件上传，删除参加论证人员） */}
          <FormSection id="feasibility" title="项目可行性论证" icon="ri-check-double-line">
            <div>
              <label className="text-sm text-steel-700 font-medium mb-1.5 block">项目可行性论证结论意见（附件上传）</label>
              <AttachmentUploader list={feasibilityAttachments} setter={setFeasibilityAttachments} />
            </div>
          </FormSection>

          {/* Section 11: 附件上传 */}
          <FormSection id="attachment" title="附件上传" icon="ri-attachment-2">
            <AttachmentUploader list={attachments} setter={setAttachments} />
          </FormSection>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {readonly ? (
        <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
          style={{ left: 'calc(14rem + 200px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
          <button onClick={() => navigate('/project-plan/apply')}
            className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5">
            <i className="ri-close-line" />关闭页面
          </button>
        </div>
      ) : (
        <div className="fixed bottom-0 right-0 z-40 flex items-center justify-end gap-3 px-6 py-3"
          style={{ left: 'calc(14rem + 200px)', background: 'white', borderTop: '1px solid #e8edf3', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
          <span className="text-xs text-steel-400 mr-4 hidden lg:block">
            <i className="ri-information-line mr-1" />保存后数据将暂存，呈核后将发起审批流程
          </span>
          <button onClick={handleCancel}
            className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
            取消
          </button>
          <button onClick={handleSave}
            className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5">
            <i className="ri-save-line" />保存
          </button>
          <button onClick={handleSubmit}
            className="px-6 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <i className="ri-send-plane-line" />呈核
          </button>
        </div>
      )}

      {/* Cancel Confirm */}
      {cancelConfirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setCancelConfirmOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[400px] p-6 z-10">
            <h3 className="text-base font-semibold text-steel-800 mb-2">确认取消？</h3>
            <p className="text-sm text-steel-500 mb-5">未保存的数据将丢失</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setCancelConfirmOpen(false)}
                className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap">继续编辑</button>
              <button onClick={() => { setCancelConfirmOpen(false); navigate('/project-plan/apply'); }}
                className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>确认取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      <ApprovalInitModal
        open={approvalOpen}
        plan={record ? {
          id: record.id, planName: record.applyName, planNo: record.planNo,
          applyYear: '2026', businessUnit: orgUnits[0],
          projectCategory: record.projectType, projectType: record.projectType,
          budget: record.investAmount, benefit: record.benefitAmount,
          applicant: record.manager, applyDate: record.applyDate,
          projectManager: record.manager, startTime: '', endTime: '',
          payment1: 0, payment2: 0, payment3: 0, latestStage: '',
          projectStatus: 'draft', isCancelled: false, cancelReason: '',
          buSortNo: 0, pdSortNo: 0, ceSortNo: 0, odSortNo: 0, bcSortNo: 0, zsSortNo: 0,
          projectMajorCategory: '技改', argumentSubmissionTime: '', absoluteDuration: 0,
        } : null}
        onClose={() => setApprovalOpen(false)}
        onConfirm={handleApprovalConfirm}
      />

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