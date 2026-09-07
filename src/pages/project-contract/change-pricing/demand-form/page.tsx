import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getProjectById, getDemandById, formatCurrency, demandTypes, secondCategories, procurementMethods, procurementCatalogs, demandDepts, contractMethods, userUnits, units } from '@/mocks/changePricingMocks';
import ApprovalFlowConfigModal from '@/pages/project-contract/execution/components/ApprovalFlowConfigModal';

interface AnchorSection { key: string; label: string; }

const sections: AnchorSection[] = [
  { key: 'basic', label: '基础信息' },
  { key: 'detail', label: '工程需求明细' },
];

export default function ChangePricingDemandFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const projectId = urlParams.get('projectId') || '';
  const demandId = urlParams.get('demandId') || '';
  const mode = urlParams.get('mode') || 'add';

  const project = getProjectById(projectId);
  const existingDemand = demandId ? getDemandById(demandId) : null;
  const isEdit = !!existingDemand;

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [formData, setFormData] = useState({
    demandNo: existingDemand?.demandNo || '',
    demandName: existingDemand?.demandName || '',
    approvalNo: project?.approvalNo || '',
    businessUnit: existingDemand?.businessUnit || project?.ownerUnit || '',
    firstCategory: existingDemand?.firstCategory || '',
    secondCategory: existingDemand?.secondCategory || '',
    procurementCatalog: existingDemand?.procurementCatalog || '',
    demandDept: existingDemand?.demandDept || '',
    procurementMethod: existingDemand?.procurementMethod || '',
    hasOwnerSupply: existingDemand?.hasOwnerSupply || '否',
    demandAmount: existingDemand?.demandAmount || 0,
    planAmount: existingDemand?.planAmount || 0,
    ownerSupplyAmount: existingDemand?.ownerSupplyAmount || 0,
    demandReason: existingDemand?.demandReason || '',
    handlerPerson: existingDemand?.currentHandler || '',

    internalFiles: existingDemand?.internalFiles || [],
    externalFiles: existingDemand?.externalFiles || [],
  });

  const [detailItems, setDetailItems] = useState(existingDemand?.detailItems || []);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({
    description: '', bidQuantity: 0, unit: '', duration: '', contractMethod: '', estimatedAmount: 0, remark: '', userUnit: '',
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
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.getAttribute('data-section') || ''); }); },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    sections.forEach((s) => { const el = sectionRefs.current[s.key]; if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const showFirstCat = formData.firstCategory === '工程建设';

  const handleSave = () => {
    if (!formData.demandName.trim()) { showToast('请输入工程需求名称'); return; }
    if (!formData.firstCategory) { showToast('请选择工程需求类型'); return; }
    if (!formData.procurementMethod) { showToast('请选择采购方式'); return; }
    showToast(isEdit ? '保存成功' : '暂存成功');
  };

  const handleFlowSubmit = () => { setShowFlowConfig(false); showToast('审批流程已提交'); };

  const addItem = () => {
    if (!newItem.description.trim()) { showToast('请输入工程细项说明'); return; }
    setDetailItems([...detailItems, { id: `itm-${Date.now()}`, ...newItem }]);
    setNewItem({ description: '', bidQuantity: 0, unit: '', duration: '', contractMethod: '', estimatedAmount: 0, remark: '', userUnit: '' });
  };

  const removeItem = (id: string) => {
    setDetailItems(detailItems.filter((it: {id: string}) => it.id !== id));
  };

  if (!project) {
    return <Layout><div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">项目数据不存在</div></Layout>;
  }

  return (
    <Layout>
      <div className="flex gap-5">
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.key} onClick={() => scrollToSection(s.key)} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeSection === s.key ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>{s.label}</button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-lg font-semibold text-slate-800">{isEdit ? '修改工程需求' : '新增工程需求'}</h1></div>
            <button onClick={() => navigate(`/project-contract/change-pricing/demand-list?projectId=${projectId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
            </button>
          </div>

          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">立项号</span><span className="text-sm font-medium text-slate-800">{project.approvalNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm text-slate-500">项目名称</span><span className="text-sm font-medium text-slate-800">{project.projectName}</span></div>
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
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">工程需求编号</span>
                  <input type="text" value={formData.demandNo || '新增时自动生成'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>工程需求名称</span>
                  <input type="text" value={formData.demandName} onChange={(e) => setFormData({ ...formData, demandName: e.target.value })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">立项号</span>
                  <input type="text" value={formData.approvalNo} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">所属事业部</span>
                  <input type="text" value={formData.businessUnit} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>工程需求类型</span>
                  <select value={formData.firstCategory} onChange={(e) => setFormData({ ...formData, firstCategory: e.target.value, secondCategory: '' })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择...</option>
                    {demandTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
                {showFirstCat && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 whitespace-nowrap w-36">二级分类</span>
                    <select value={formData.secondCategory} onChange={(e) => setFormData({ ...formData, secondCategory: e.target.value })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                      <option value="">请选择...</option>
                      {secondCategories.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>采购目录</span>
                  <select value={formData.procurementCatalog} onChange={(e) => setFormData({ ...formData, procurementCatalog: e.target.value })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择...</option>
                    {procurementCatalogs.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>需求部门</span>
                  <select value={formData.demandDept} onChange={(e) => setFormData({ ...formData, demandDept: e.target.value })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择...</option>
                    {demandDepts.map((d) => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>采购方式</span>
                  <select value={formData.procurementMethod} onChange={(e) => setFormData({ ...formData, procurementMethod: e.target.value })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择...</option>
                    {procurementMethods.map((m) => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">是否有甲供材</span>
                  <select value={formData.hasOwnerSupply} onChange={(e) => setFormData({ ...formData, hasOwnerSupply: e.target.value, ownerSupplyAmount: e.target.value === '否' ? 0 : formData.ownerSupplyAmount })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>需求金额</span>
                  <input type="number" value={formData.demandAmount || ''} onChange={(e) => setFormData({ ...formData, demandAmount: Number(e.target.value) })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="单位：元" step="1" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>计划金额</span>
                  <input type="number" value={formData.planAmount || ''} onChange={(e) => setFormData({ ...formData, planAmount: Number(e.target.value) })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="单位：元" step="1" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">{formData.hasOwnerSupply === '是' ? <span className="text-red-500">*</span> : ''}甲供材金额</span>
                  <input type="number" value={formData.ownerSupplyAmount || ''} onChange={(e) => setFormData({ ...formData, ownerSupplyAmount: Number(e.target.value) })} disabled={formData.hasOwnerSupply === '否' || (isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || ''))} className={`flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${formData.hasOwnerSupply === '否' ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-800'}`} placeholder="单位：元" step="1" />
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1"><span className="text-red-500">*</span>工程需求原因</span>
                  <textarea value={formData.demandReason} onChange={(e) => setFormData({ ...formData, demandReason: e.target.value })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="请输入工程需求原因" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>选定主管单位经办人</span>
                  <input type="text" value={formData.handlerPerson} onChange={(e) => setFormData({ ...formData, handlerPerson: e.target.value })} disabled={isEdit && !['新建', '已驳回', '已撤回'].includes(existingDemand?.status || '')} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="选择经办人" />
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">对内附件上传</span>
                  <div className="flex-1">
                    <button className="px-3 py-1.5 text-xs text-slate-600 border border-dashed border-slate-300 rounded-md hover:bg-white cursor-pointer flex items-center gap-1 whitespace-nowrap">
                      <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-upload-line" /></div>上传附件
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">对外附件上传</span>
                  <div className="flex-1">
                    <button className="px-3 py-1.5 text-xs text-slate-600 border border-dashed border-slate-300 rounded-md hover:bg-white cursor-pointer flex items-center gap-1 whitespace-nowrap">
                      <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-upload-line" /></div>上传附件
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Detail Items */}
          <div ref={(el) => { sectionRefs.current['detail'] = el; }} data-section="detail" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">工程需求明细</span>
              <span className="text-xs text-slate-400 ml-2">共 {detailItems.length} 项</span>
            </div>

            {/* Detail list */}
            {detailItems.length > 0 && (
              <div className="overflow-x-auto border border-slate-200 rounded-lg mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工程细项说明</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">招标工程量</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">计量单位</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">绝对工期</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">承包方式</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">暂估金额(元)</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">说明</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">使用单位</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailItems.map((item: {id: string; description: string; bidQuantity: number; unit: string; duration: string; contractMethod: string; estimatedAmount: number; remark: string; userUnit: string}) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.description}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap text-right">{item.bidQuantity}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.unit}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.duration}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.contractMethod}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap text-right">{formatCurrency(item.estimatedAmount)}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.remark || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{item.userUnit}</td>
                        <td className="px-3 py-2 text-center whitespace-nowrap">
                          <button onClick={() => removeItem(item.id)} className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap">删除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add item form */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 mb-2 uppercase">新增明细行</div>
              <div className="grid grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>工程细项说明</span>
                  <input type="text" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>招标工程量</span>
                  <input type="number" value={newItem.bidQuantity || ''} onChange={(e) => setNewItem({ ...newItem, bidQuantity: Number(e.target.value) })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>计量单位</span>
                  <select value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option>
                    {units.map((u) => (<option key={u} value={u}>{u}</option>))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>绝对工期</span>
                  <input type="text" value={newItem.duration} onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="天数" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>承包方式</span>
                  <select value={newItem.contractMethod} onChange={(e) => setNewItem({ ...newItem, contractMethod: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option>
                    {contractMethods.map((m) => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>暂估金额(元)</span>
                  <input type="number" value={newItem.estimatedAmount || ''} onChange={(e) => setNewItem({ ...newItem, estimatedAmount: Number(e.target.value) })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" step="1" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-20">说明</span>
                  <input type="text" value={newItem.remark} onChange={(e) => setNewItem({ ...newItem, remark: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-20"><span className="text-red-500">*</span>使用单位</span>
                  <select value={newItem.userUnit} onChange={(e) => setNewItem({ ...newItem, userUnit: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option>
                    {userUnits.map((u) => (<option key={u} value={u}>{u}</option>))}
                  </select>
                </div>
              </div>
              <button onClick={addItem} className="mt-3 px-4 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <div className="w-3.5 h-3.5 flex items-center justify-center inline-flex mr-1"><i className="ri-add-line" /></div>新增一行
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => setShowFlowConfig(true)} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
            </button>
            <button onClick={handleSave} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line" /></div>保存
            </button>
            <button onClick={() => navigate(`/project-contract/change-pricing/demand-list?projectId=${projectId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>返回
            </button>
          </div>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {showFlowConfig && (
        <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={handleFlowSubmit} defaultTitle={`工程需求审批-${formData.demandNo || '新增'}`} />
      )}
    </Layout>
  );
}