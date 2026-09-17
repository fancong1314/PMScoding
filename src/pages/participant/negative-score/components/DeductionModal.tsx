import { useState } from 'react';
import { deductionCategories, availableContracts, availableHandlers } from '@/mocks/participantManagementMocks';

interface DeductionModalProps {
  open: boolean;
  participantName: string;
  participantType: string;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function DeductionModal({ open, participantName, participantType, onClose, onSubmit }: DeductionModalProps) {
  const [category, setCategory] = useState('');
  const [relatedContract, setRelatedContract] = useState('');
  const [assessorId, setAssessorId] = useState('');
  const [assessmentDate, setAssessmentDate] = useState('');
  const [reason, setReason] = useState('');
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const selectedAssessor = availableHandlers.find((h) => h.id === assessorId);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!category) errs.category = '请选择扣分类别';
    if (!relatedContract) errs.relatedContract = '请选择关联合同';
    if (!assessorId) errs.assessor = '请选择考核人';
    if (!assessmentDate) errs.assessmentDate = '请选择考核日期';
    if (!reason.trim()) errs.reason = '请输入扣分原因';
    if (reason.length > 500) errs.reason = '扣分原因最多500字符';
    if (!score.trim()) errs.score = '请输入负面积分';
    if (score && (!/^\d+$/.test(score) || Number(score) <= 0)) errs.score = '负面积分必须为正整数';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      category,
      relatedContract,
      assessorId,
      assessmentDate,
      reason,
      score: Number(score),
      initiator: '管理员',
    });
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';
  const errorInputCls = 'w-full px-3 py-2 text-sm border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[640px] max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">新增扣分</h3>
            <p className="text-xs text-steel-400 mt-0.5">{participantName}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* 发起人信息 */}
          <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
            <label className="text-xs text-steel-400 block mb-1">发起人</label>
            <span className="text-sm text-steel-700 font-medium">管理员</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-steel-700 block mb-1.5">扣分类别<span className="text-red-500 ml-1">*</span></label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={errors.category ? errorInputCls + ' cursor-pointer' : inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {deductionCategories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="text-sm text-steel-700 block mb-1.5">关联合同<span className="text-red-500 ml-1">*</span></label>
              <select value={relatedContract} onChange={(e) => setRelatedContract(e.target.value)} className={errors.relatedContract ? errorInputCls + ' cursor-pointer' : inputCls + ' cursor-pointer'}>
                <option value="">请选择</option>
                {availableContracts.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.relatedContract && <p className="text-xs text-red-500 mt-1">{errors.relatedContract}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-3 border border-steel-100">
            <div>
              <label className="text-xs text-steel-400 block mb-1">单位名称</label>
              <span className="text-sm text-steel-700">{participantName}</span>
            </div>
            <div>
              <label className="text-xs text-steel-400 block mb-1">单位类型</label>
              <span className="text-sm text-steel-700">{participantType}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-steel-700 block mb-1.5">考核日期<span className="text-red-500 ml-1">*</span></label>
              <input type="date" value={assessmentDate} onChange={(e) => setAssessmentDate(e.target.value)} className={errors.assessmentDate ? errorInputCls : inputCls} />
              {errors.assessmentDate && <p className="text-xs text-red-500 mt-1">{errors.assessmentDate}</p>}
            </div>
            <div>
              <label className="text-sm text-steel-700 block mb-1.5">负面积分<span className="text-red-500 ml-1">*</span></label>
              <input type="number" min="1" value={score} onChange={(e) => setScore(e.target.value)} className={errors.score ? errorInputCls : inputCls} placeholder="请输入正整数" />
              {errors.score && <p className="text-xs text-red-500 mt-1">{errors.score}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm text-steel-700 block mb-1.5">扣分原因<span className="text-red-500 ml-1">*</span></label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} maxLength={500} className={errors.reason ? errorInputCls + ' resize-none' : inputCls + ' resize-none'} placeholder="请输入扣分原因..." />
            <div className="flex justify-between mt-1">
              {errors.reason ? <p className="text-xs text-red-500">{errors.reason}</p> : <span />}
              <span className="text-xs text-steel-400">{reason.length}/500</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-steel-700 block mb-1.5">考核人<span className="text-red-500 ml-1">*</span></label>
            <select value={assessorId} onChange={(e) => setAssessorId(e.target.value)} className={errors.assessor ? errorInputCls + ' cursor-pointer' : inputCls + ' cursor-pointer'}>
              <option value="">请选择考核人</option>
              {availableHandlers.map((h) => (
                <option key={h.id} value={h.id}>{h.name}（{h.dept}）</option>
              ))}
            </select>
            {errors.assessor && <p className="text-xs text-red-500 mt-1">{errors.assessor}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-3 border border-steel-100">
            <div>
              <label className="text-xs text-steel-400 block mb-1">考核部门</label>
              <span className="text-sm text-steel-700">{selectedAssessor?.dept || '自动带入'}</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-steel-700 block mb-1.5">附件上传</label>
            <div className="border-2 border-dashed border-steel-200 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                <i className="ri-attachment-2 text-xl text-steel-400" />
              </div>
              <p className="text-sm text-steel-500">点击或拖拽上传附件</p>
              <p className="text-xs text-steel-400 mt-1">支持图片、Word、PDF格式，单个文件不超过 10MB</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <div className="flex items-center gap-1.5">
              <i className="ri-save-line" />保存
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}