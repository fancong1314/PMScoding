import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getDemandById,
  getRequirementProjectById,
  demandTypes,
  demandTypeLevel2Map,
  purchaseCategories,
  demandDepts,
  purchaseMethods,
  contractMethods,
  units,
  usageUnits,
  handlers,
  formatCurrency,
  generateOccupationDetails,
  DemandDetail,
  OccupationDetail,
  EngineeringDemand,
} from '@/mocks/engineeringRequirementMocks';
import ApprovalFlowModal from '../components/ApprovalFlowModal';

export default function DemandFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const demandId = urlParams.get('id') || '';
  const projectId = urlParams.get('projectId') || '';
  const mode = urlParams.get('mode') || 'add';
  const isEdit = mode === 'edit';
  const isView = mode === 'view';

  const project = getRequirementProjectById(projectId);
  const existingDemand = isEdit ? getDemandById(demandId) : null;

  const [formData, setFormData] = useState({
    demandNo: existingDemand?.demandNo || '',
    demandName: existingDemand?.demandName || '',
    approvalNo: project?.approvalNo || '',
    department: project?.ownerUnit || '',
    demandType: existingDemand?.demandType || '',
    demandTypeLevel2: existingDemand?.demandTypeLevel2 || '',
    purchaseCategory: existingDemand?.purchaseCategory || '',
    demandDept: existingDemand?.demandDept || '',
    purchaseMethod: existingDemand?.purchaseMethod || '',
    hasMaterial: existingDemand?.hasMaterial ?? false,
    demandAmount: existingDemand?.demandAmount || 0,
    planAmount: existingDemand?.planAmount || 0,
    materialAmount: existingDemand?.materialAmount || 0,
    demandReason: existingDemand?.demandReason || '',
    handler: existingDemand?.handler || '',
    isMainContract: existingDemand?.isMainContract ?? false,
  });

  const [details, setDetails] = useState<DemandDetail[]>(
    existingDemand?.details || []
  );
  // Bug fix: 新增时自动生成 occupationDetails
  const [occupationDetails, setOccupationDetails] = useState<OccupationDetail[]>(
    existingDemand?.occupationDetails || generateOccupationDetails()
  );
  const [showApprovalFlow, setShowApprovalFlow] = useState(false);
  const [selectedDetailIds, setSelectedDetailIds] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const [showLevel2, setShowLevel2] = useState(formData.demandType === '工程建设');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  // 级联下拉：需求类型切换时控制二级分类显示
  useEffect(() => {
    setShowLevel2(formData.demandType === '工程建设');
    if (formData.demandType !== '工程建设') {
      setFormData((prev) => ({ ...prev, demandTypeLevel2: '' }));
    }
  }, [formData.demandType]);

  // Bug fix: 只自动计算需求金额，不覆盖 planAmount 和 materialAmount 的用户输入
  useEffect(() => {
    const totalDemand = occupationDetails.reduce((s, o) => s + o.demandOccupiedAmount, 0);
    const totalMaterial = occupationDetails.reduce((s, o) => s + o.materialOccupiedAmount, 0);
    setFormData((prev) => ({
      ...prev,
      demandAmount: totalDemand + totalMaterial,
    }));
  }, [occupationDetails]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addDetail = () => {
    const newDetail: DemandDetail = {
      id: `detail-${Date.now()}`,
      description: '',
      quantity: 0,
      unit: '',
      durationDays: 0,
      contractMethod: '',
      estimatedAmount: 0,
      remark: '',
      usageUnit: '',
      selected: false,
    };
    setDetails([...details, newDetail]);
  };

  const removeDetail = () => {
    if (selectedDetailIds.length === 0) {
      showToast('请先选择要删除的明细');
      return;
    }
    setDetails(details.filter((d) => !selectedDetailIds.includes(d.id)));
    setSelectedDetailIds([]);
  };

  const updateDetail = (id: string, field: keyof DemandDetail, value: unknown) => {
    setDetails((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const toggleDetailSelect = (id: string) => {
    setSelectedDetailIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const updateOccupation = (id: string, field: keyof OccupationDetail, value: unknown) => {
    setOccupationDetails((prev) =>
      prev.map((o) => {
        if (o.estimateId !== id) return o;
        const updated = { ...o, [field]: value };
        if (field === 'demandOccupiedAmount' || field === 'materialOccupiedAmount') {
          const total = updated.demandOccupiedAmount + updated.materialOccupiedAmount;
          if (total > updated.remainingAmount) {
            showToast(`占用金额不能超过概算剩余金额 ${formatCurrency(updated.remainingAmount)}`);
          }
        }
        return updated;
      })
    );
  };

  const handleSave = () => {
    if (!formData.demandName.trim()) {
      showToast('需求名称不能为空');
      return;
    }
    showToast('保存草稿成功');
  };

  const handleSubmit = () => {
    if (!formData.demandName.trim()) {
      showToast('需求名称不能为空');
      return;
    }
    if (!formData.demandType) {
      showToast('需求类型不能为空');
      return;
    }
    if (!formData.purchaseCategory) {
      showToast('采购目录不能为空');
      return;
    }
    if (!formData.demandDept) {
      showToast('需求部门不能为空');
      return;
    }
    if (!formData.purchaseMethod) {
      showToast('采购方式不能为空');
      return;
    }
    if (!formData.handler) {
      showToast('经办人不能为空');
      return;
    }
    setShowApprovalFlow(true);
  };

  const getLevelColor = (level: number) => {
    if (level === 1) return { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' };
    if (level === 2) return { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8' };
    return { bg: '#fffbeb', border: '#f59e0b', text: '#b45309' };
  };

  const totalEstimated = useMemo(() => details.reduce((s, d) => s + d.estimatedAmount, 0), [details]);

  // 动态计算 materialAmount 的样式
  const materialDisabled = isView || !formData.hasMaterial;
  const materialInputClass = materialDisabled
    ? 'flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500'
    : 'flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500';

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">
            {isView ? '需求详情' : isEdit ? '需求修改' : '需求新增'}
          </h1>
          <button
            onClick={() => navigate(`/project-contract/requirement/demand-list?projectId=${projectId}`)}
            className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-left-line" />
            </div>
            返回
          </button>
        </div>

        {/* Basic Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-800">基础信息</span>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">工程需求编号</span>
              <input
                type="text"
                value={formData.demandNo}
                disabled
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                placeholder="系统自动生成"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>需求名称</span>
              <input
                type="text"
                value={formData.demandName}
                onChange={(e) => handleChange('demandName', e.target.value)}
                disabled={isView}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">立项号</span>
              <input
                type="text"
                value={formData.approvalNo}
                disabled
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">所属事业部</span>
              <input
                type="text"
                value={formData.department}
                disabled
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>需求类型</span>
              <div className="flex gap-2 flex-1">
                <select
                  value={formData.demandType}
                  onChange={(e) => handleChange('demandType', e.target.value)}
                  disabled={isView}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">请选择</option>
                  {demandTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {showLevel2 && (
                  <select
                    value={formData.demandTypeLevel2}
                    onChange={(e) => handleChange('demandTypeLevel2', e.target.value)}
                    disabled={isView}
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">请选择</option>
                    {(demandTypeLevel2Map[formData.demandType] || []).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>采购目录</span>
              <select
                value={formData.purchaseCategory}
                onChange={(e) => handleChange('purchaseCategory', e.target.value)}
                disabled={isView}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">请选择</option>
                {purchaseCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>需求部门</span>
              <select
                value={formData.demandDept}
                onChange={(e) => handleChange('demandDept', e.target.value)}
                disabled={isView}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">请选择</option>
                {demandDepts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>采购方式</span>
              <select
                value={formData.purchaseMethod}
                onChange={(e) => handleChange('purchaseMethod', e.target.value)}
                disabled={isView}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">请选择</option>
                {purchaseMethods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">是否有甲供材</span>
              <select
                value={String(formData.hasMaterial)}
                onChange={(e) => handleChange('hasMaterial', e.target.value === 'true')}
                disabled={isView}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="false">否</option>
                <option value="true">是</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">需求金额</span>
              <input
                type="text"
                value={formatCurrency(formData.demandAmount)}
                disabled
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>计划金额</span>
              <input
                type="number"
                step="1"
                value={formData.planAmount}
                onChange={(e) => handleChange('planAmount', Number(e.target.value))}
                disabled={isView}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">甲供材金额</span>
              <input
                type="number"
                step="1"
                value={formData.materialAmount}
                onChange={(e) => handleChange('materialAmount', Number(e.target.value))}
                disabled={materialDisabled}
                className={materialInputClass}
              />
            </div>
            <div className="flex items-center gap-2 col-span-3">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>需求原因</span>
              <textarea
                value={formData.demandReason}
                onChange={(e) => handleChange('demandReason', e.target.value)}
                disabled={isView}
                rows={2}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>经办人</span>
              <select
                value={formData.handler}
                onChange={(e) => handleChange('handler', e.target.value)}
                disabled={isView}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">请选择</option>
                {handlers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">是否主体合同</span>
              <select
                value={String(formData.isMainContract)}
                onChange={(e) => handleChange('isMainContract', e.target.value === 'true')}
                disabled={isView}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="false">否</option>
                <option value="true">是</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">对内附件</span>
              <div className="flex items-center gap-2 flex-1">
                <button
                  disabled={isView}
                  className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer disabled:opacity-50"
                >
                  <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
                    <i className="ri-upload-cloud-line" />
                  </div>
                  上传文件
                </button>
                <span className="text-xs text-slate-400">已上传 2 个文件</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24">对外附件</span>
              <div className="flex items-center gap-2 flex-1">
                <button
                  disabled={isView}
                  className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer disabled:opacity-50"
                >
                  <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1">
                    <i className="ri-upload-cloud-line" />
                  </div>
                  上传文件
                </button>
                <span className="text-xs text-slate-400">已上传 1 个文件</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demand Details */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">工程需求明细</span>
            </div>
            {!isView && (
              <div className="flex items-center gap-2">
                <button
                  onClick={addDetail}
                  className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-add-line" />
                  </div>
                  新增
                </button>
                <button
                  onClick={removeDetail}
                  className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer flex items-center gap-1"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-delete-bin-line" />
                  </div>
                  删除
                </button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={details.length > 0 && details.every((d) => selectedDetailIds.includes(d.id))}
                      onChange={() => {
                        if (details.every((d) => selectedDetailIds.includes(d.id))) {
                          setSelectedDetailIds([]);
                        } else {
                          setSelectedDetailIds(details.map((d) => d.id));
                        }
                      }}
                      disabled={isView}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">工程细项说明</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">招标工程量</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">计量单位</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">绝对工期</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">承包方式</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">暂估金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">说明</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">使用单位</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedDetailIds.includes(d.id)}
                        onChange={() => toggleDetailSelect(d.id)}
                        disabled={isView}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={d.description}
                        onChange={(e) => updateDetail(d.id, 'description', e.target.value)}
                        disabled={isView}
                        className="w-full px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="必填"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={d.quantity}
                        onChange={(e) => updateDetail(d.id, 'quantity', Number(e.target.value))}
                        disabled={isView}
                        className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={d.unit}
                        onChange={(e) => updateDetail(d.id, 'unit', e.target.value)}
                        disabled={isView}
                        className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="">请选择</option>
                        {units.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={d.durationDays}
                        onChange={(e) => updateDetail(d.id, 'durationDays', Number(e.target.value))}
                        disabled={isView}
                        className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="天数"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={d.contractMethod}
                        onChange={(e) => updateDetail(d.id, 'contractMethod', e.target.value)}
                        disabled={isView}
                        className="w-24 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="">请选择</option>
                        {contractMethods.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={d.estimatedAmount}
                        onChange={(e) => updateDetail(d.id, 'estimatedAmount', Number(e.target.value))}
                        disabled={isView}
                        className="w-24 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={d.remark}
                        onChange={(e) => updateDetail(d.id, 'remark', e.target.value)}
                        disabled={isView}
                        className="w-32 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="非必填"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={d.usageUnit}
                        onChange={(e) => updateDetail(d.id, 'usageUnit', e.target.value)}
                        disabled={isView}
                        className="w-24 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="">请选择</option>
                        {usageUnits.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50">
                <tr>
                  <td colSpan={6} className="px-2 py-2 text-right text-sm font-medium text-slate-600">
                    合计
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-slate-800">
                    {formatCurrency(totalEstimated)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Amount Occupation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-slate-800">工程需求金额占用明细</span>
            </div>
            <div className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              需求占用金额、甲供材占用金额会直接替换需求基本资料里面的金额，请认真填写
            </div>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">概算费用名称</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">概算金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">已占用金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">概算剩余金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">甲供材占用金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">需求占用金额(元)</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">最后一笔需求</th>
                </tr>
              </thead>
              <tbody>
                {occupationDetails.map((o) => {
                  const color = getLevelColor(o.level);
                  const paddingLeft = o.level * 16;
                  return (
                    <tr
                      key={o.estimateId}
                      className="hover:bg-slate-50 transition-colors"
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        borderLeft: `3px solid ${color.border}`,
                        backgroundColor: color.bg,
                      }}
                    >
                      <td className="px-2 py-2 text-sm font-medium" style={{ color: color.text, paddingLeft: `${paddingLeft + 8}px` }}>
                        {o.estimateName}
                      </td>
                      <td className="px-2 py-2 text-sm text-slate-700">{formatCurrency(o.estimateAmount)}</td>
                      <td className="px-2 py-2 text-sm text-slate-700">{formatCurrency(o.occupiedAmount)}</td>
                      <td className="px-2 py-2 text-sm text-slate-700">{formatCurrency(o.remainingAmount)}</td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="1"
                          value={o.materialOccupiedAmount}
                          onChange={(e) => updateOccupation(o.estimateId, 'materialOccupiedAmount', Number(e.target.value))}
                          disabled={isView}
                          className="w-24 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="1"
                          value={o.demandOccupiedAmount}
                          onChange={(e) => updateOccupation(o.estimateId, 'demandOccupiedAmount', Number(e.target.value))}
                          disabled={isView}
                          className="w-24 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={String(o.isLastDemand)}
                          onChange={(e) => updateOccupation(o.estimateId, 'isLastDemand', e.target.value === 'true')}
                          disabled={isView}
                          className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                          <option value="false">否</option>
                          <option value="true">是</option>
                        </select>
                        {o.isLastDemand && (
                          <div className="text-xs text-red-500 mt-1">结余后，此笔费用将不允许使用</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        {!isView && (
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-send-plane-line" />
              </div>
              呈核
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-save-line" />
              </div>
              保存
            </button>
            <button
              onClick={() => navigate(`/project-contract/requirement/demand-list?projectId=${projectId}`)}
              className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-go-back-line" />
              </div>
              返回
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* Approval Flow Modal */}
      {showApprovalFlow && (
        <ApprovalFlowModal
          demand={existingDemand || { ...formData, id: '', projectId, status: '新建', createTime: '', creator: '', internalAttachments: [], externalAttachments: [], details: [], occupationDetails: [] } as unknown as EngineeringDemand}
          onClose={() => setShowApprovalFlow(false)}
          onSubmit={() => {
            setShowApprovalFlow(false);
            showToast('审批流程已提交');
          }}
        />
      )}
    </Layout>
  );
}