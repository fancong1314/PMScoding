import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getDisputeById,
  getSupplierByCode,
  supplierOptions,
  categoryTypes,
  formatCurrency,
} from '@/mocks/qualityDisputeMocks';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'left', label: '左侧信息' },
  { key: 'right', label: '右侧信息' },
];

export default function QualityDisputeFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const mode = urlParams.get('mode') || 'add';
  const id = urlParams.get('id') || '';
  const isEdit = mode === 'edit' && id;

  const existing = isEdit ? getDisputeById(id) : null;

  const [activeSection, setActiveSection] = useState('left');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const [formData, setFormData] = useState({
    disputeNo: existing?.disputeNo || '',
    contractNo: existing?.contractNo || '',
    supplierCode: existing?.supplierCode || '',
    supplierName: existing?.supplierName || '',
    purchaser: existing?.purchaser || '',
    purchaserContact: existing?.purchaserContact || '',
    applicant: existing?.applicant || '当前用户',
    disputeAmount: existing?.disputeAmount || 0,
    disputeQuantity: existing?.disputeQuantity || 0,
    causeProductionStop: existing?.causeProductionStop || '否',
    stopHours: existing?.stopHours || 0,
    occurrenceDate: existing?.occurrenceDate || '',
    categoryType: existing?.categoryType || '',
    needSupplierRectify: existing?.needSupplierRectify || '否',
    supplierRectifyNo: existing?.supplierRectifyNo || '',
    issueDescription: existing?.issueAnalysis || '',
    creator: existing?.creator || '当前用户',
    createTime: existing?.createTime || new Date().toISOString().replace('T', ' ').slice(0, 19),
    modifier: '当前用户',
    modifyTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    attachments: existing?.attachments || [],
  });

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const key = e.target.getAttribute('data-section');
            if (key) setActiveSection(key);
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
    if (formData.supplierCode) {
      const s = getSupplierByCode(formData.supplierCode);
      if (s) {
        setFormData((prev) => ({
          ...prev,
          supplierName: s.name,
          purchaser: s.purchaser,
          purchaserContact: s.purchaserContact,
        }));
      }
    }
  }, [formData.supplierCode]);

  const handleSubmit = () => {
    if (!formData.contractNo.trim()) {
      showToast('请输入合同号');
      return;
    }
    if (!formData.supplierCode) {
      showToast('请选择供应商');
      return;
    }
    if (!formData.purchaserContact.trim()) {
      showToast('请输入采购员联系方式');
      return;
    }
    if (!formData.disputeAmount || formData.disputeAmount <= 0) {
      showToast('请输入异议金额');
      return;
    }
    if (!formData.disputeQuantity || formData.disputeQuantity <= 0) {
      showToast('请输入异议数量');
      return;
    }
    if (!formData.causeProductionStop) {
      showToast('请选择是否造成生产中断');
      return;
    }
    if (!formData.categoryType) {
      showToast('请选择品种类别');
      return;
    }
    if (!formData.needSupplierRectify) {
      showToast('请选择是否需要供应商整改');
      return;
    }
    showToast(isEdit ? '提交成功' : '新增成功');
  };

  const handleSave = () => {
    if (!formData.contractNo.trim()) {
      showToast('请输入合同号');
      return;
    }
    showToast('保存成功');
  };

  return (
    <Layout>
      <div className="flex gap-5">
        {/* Left Anchor */}
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => scrollToSection(s.key)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeSection === s.key ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">{isEdit ? '修改质量异议' : '新增质量异议'}</h1>
            </div>
            <button
              onClick={() => navigate('/project-contract/quality-dispute')}
              className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
              返回
            </button>
          </div>

          {/* Left & Right Column Form */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div ref={(el) => { sectionRefs.current['left'] = el; }} data-section="left">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-slate-800">左侧信息</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                {/* 异议单号 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">异议单号</span>
                  <input type="text" value={formData.disputeNo || (isEdit ? '' : '新增时自动生成')} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                {/* 合同号 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>合同号</span>
                  <input type="text" value={formData.contractNo} onChange={(e) => setFormData({ ...formData, contractNo: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入合同号" />
                </div>
                {/* 供应商代码 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>供应商代码</span>
                  <select value={formData.supplierCode} onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option>
                    {supplierOptions.map((s) => (
                      <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
                {/* 采购员 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">采购员</span>
                  <div className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500">
                    <span>{formData.purchaser || '--'}</span>
                    <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded">采购</span>
                  </div>
                </div>
                {/* 异议金额 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>异议金额(元)</span>
                  <input type="number" value={formData.disputeAmount || ''} onChange={(e) => setFormData({ ...formData, disputeAmount: Number(e.target.value) })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="0.00" step="1" />
                </div>
                {/* 是否造成生产中断 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>是否造成生产中断</span>
                  <select value={formData.causeProductionStop} onChange={(e) => setFormData({ ...formData, causeProductionStop: e.target.value, stopHours: e.target.value === '否' ? 0 : formData.stopHours })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option>
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
                {/* 发生日期 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">发生日期</span>
                  <input type="date" value={formData.occurrenceDate} onChange={(e) => setFormData({ ...formData, occurrenceDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                {/* 是否需要供应商整改 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>是否需要供应商整改</span>
                  <select value={formData.needSupplierRectify} onChange={(e) => setFormData({ ...formData, needSupplierRectify: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option>
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
                {/* 附件 */}
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-0.5">附件</span>
                  <div className="flex-1">
                    {formData.attachments.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.attachments.map((f, fi) => (
                          <span key={fi} className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100">{f}</span>
                        ))}
                      </div>
                    ) : <span className="text-sm text-slate-400">暂无附件</span>}
                    <button className="mt-1 px-3 py-1.5 text-xs text-slate-600 border border-dashed border-slate-300 rounded-md hover:bg-white cursor-pointer flex items-center gap-1 whitespace-nowrap">
                      <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-upload-line" /></div>
                      上传附件
                    </button>
                  </div>
                </div>
                {/* 质量问题描述分析 */}
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36 mt-1">质量问题描述分析</span>
                  <textarea value={formData.issueDescription} onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="请输入质量问题描述及分析..." />
                </div>
                {/* 创建人 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">创建人</span>
                  <input type="text" value={formData.creator} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                {/* 修改人 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">修改人</span>
                  <input type="text" value={formData.modifier} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div ref={(el) => { sectionRefs.current['right'] = el; }} data-section="right">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-blue-500" />
                <span className="text-sm font-semibold text-slate-800">右侧信息</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                {/* 申请人 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">申请人</span>
                  <div className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500">
                    <span>{formData.applicant}</span>
                    <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 rounded">发起</span>
                  </div>
                </div>
                {/* 供应商名称 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">供应商名称</span>
                  <input type="text" value={formData.supplierName || '--'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                {/* 采购员联系方式 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>采购员联系方式</span>
                  <input type="text" value={formData.purchaserContact} onChange={(e) => setFormData({ ...formData, purchaserContact: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入联系方式" />
                </div>
                {/* 异议数量 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>异议数量</span>
                  <input type="number" value={formData.disputeQuantity || ''} onChange={(e) => setFormData({ ...formData, disputeQuantity: Number(e.target.value) })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入数量" />
                </div>
                {/* 生产中断时间 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">生产中断时间(小时)</span>
                  <input type="number" value={formData.stopHours || ''} onChange={(e) => setFormData({ ...formData, stopHours: Number(e.target.value) })} disabled={formData.causeProductionStop === '否'} className={`flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md ${formData.causeProductionStop === '否' ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'}`} placeholder={formData.causeProductionStop === '否' ? '无需填写' : '请输入中断时间'} />
                </div>
                {/* 品种类别 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36"><span className="text-red-500">*</span>品种类别</span>
                  <select value={formData.categoryType} onChange={(e) => setFormData({ ...formData, categoryType: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option>
                    {categoryTypes.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {/* 供应商整改单号 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">供应商整改单号</span>
                  <input type="text" value={formData.supplierRectifyNo} onChange={(e) => setFormData({ ...formData, supplierRectifyNo: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入整改单号" />
                </div>
                {/* 创建时间 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">创建时间</span>
                  <input type="text" value={formData.createTime} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
                {/* 修改时间 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-36">修改时间</span>
                  <input type="text" value={formData.modifyTime} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={handleSubmit} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>
              提交
            </button>
            <button onClick={handleSave} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line" /></div>
              保存
            </button>
            <button onClick={() => navigate('/project-contract/quality-dispute')} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
          </div>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}