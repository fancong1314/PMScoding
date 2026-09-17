import { useState } from 'react';
import { type Issue } from '@/mocks/qualitySafetyMocks';

interface ReviewModalProps {
  open: boolean;
  issue: Issue | null;
  onClose: () => void;
  onSubmit: (data: { result: '通过' | '驳回'; reason: string }) => void;
}

export default function ReviewModal({ open, issue, onClose, onSubmit }: ReviewModalProps) {
  const [result, setResult] = useState<'通过' | '驳回'>('通过');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open || !issue) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!reason.trim()) errs.reason = '请输入复查原因或说明';
    if (reason.length > 500) errs.reason = '原因说明最多500字符';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ result, reason });
    setReason('');
  };

  const handleClose = () => {
    setResult('通过');
    setReason('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[520px] max-h-[85vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200">
          <h3 className="text-base font-semibold text-steel-800">复查 - {issue.issueNo}</h3>
          <p className="text-xs text-steel-400 mt-0.5">对问题整改结果进行复查验收</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-3 border border-steel-100">
            <div>
              <label className="text-xs text-steel-400 block mb-1">问题编号</label>
              <span className="text-sm text-steel-700 font-mono">{issue.issueNo}</span>
            </div>
            <div>
              <label className="text-xs text-steel-400 block mb-1">问题类型</label>
              <span className="text-sm text-steel-700">{issue.issueType}</span>
            </div>
            <div>
              <label className="text-xs text-steel-400 block mb-1">问题等级</label>
              <span className="text-sm text-steel-700">{issue.issueLevel}</span>
            </div>
            <div>
              <label className="text-xs text-steel-400 block mb-1">整改期限</label>
              <span className="text-sm text-steel-700">{issue.deadline}</span>
            </div>
          </div>

          {/* 历史复查记录 */}
          {issue.reviewRecords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-steel-700 mb-2">历史复查记录</h4>
              <div className="space-y-2">
                {issue.reviewRecords.map((record) => (
                  <div key={record.id} className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${record.result === '通过' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{record.result}</span>
                      <span className="text-xs text-steel-500">{record.reviewTime}</span>
                      <span className="text-xs text-steel-600">{record.reviewer}</span>
                    </div>
                    <p className="text-sm text-steel-700">{record.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-steel-700 block mb-2">
              复查结果<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="reviewResult" checked={result === '通过'} onChange={() => setResult('通过')} className="w-4 h-4 accent-primary-500 cursor-pointer" />
                <span className="text-sm text-steel-700">通过</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="reviewResult" checked={result === '驳回'} onChange={() => setResult('驳回')} className="w-4 h-4 accent-red-500 cursor-pointer" />
                <span className="text-sm text-steel-700">驳回</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-steel-700 block mb-2">
              原因说明<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              maxLength={500}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 resize-none ${errors.reason ? 'border-red-300 bg-red-50/30 focus:ring-red-500/20 focus:border-red-500' : 'border-steel-200 bg-slate-50 focus:ring-primary-500/20 focus:border-primary-500'}`}
              placeholder={result === '通过' ? '请输入复查通过说明...' : '请输入驳回原因...'}
            />
            <div className="flex justify-between mt-1">
              {errors.reason ? <p className="text-xs text-red-500">{errors.reason}</p> : <span />}
              <span className="text-xs text-steel-400">{reason.length}/500</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-steel-700 block mb-2">附件上传</label>
            <div className="border-2 border-dashed border-steel-200 rounded-lg p-5 text-center hover:border-primary-300 transition-colors">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                <i className="ri-upload-cloud-2-line text-xl text-steel-400" />
              </div>
              <p className="text-sm text-steel-500">点击或拖拽上传复查附件</p>
              <p className="text-xs text-steel-400 mt-1">支持图片、Word、PDF格式</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <div className="flex items-center gap-1.5">
              <i className="ri-check-line" />提交复查
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}