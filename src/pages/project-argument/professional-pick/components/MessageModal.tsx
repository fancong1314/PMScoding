import { useState } from 'react';
import { messageTemplates } from '@/mocks/professionalPickMocks';

interface MessageModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (msg: { content: string; receivers: string[] }) => void;
}

const defaultReceivers = [
  { id: 'r1', name: '总师室经办人', dept: '总师室', checked: true },
  { id: 'r2', name: '建设单位负责人', dept: '建设单位', checked: true },
  { id: 'r3', name: '项目经理', dept: '项目部', checked: false },
  { id: 'r4', name: '专业单位负责人', dept: '专业单位', checked: false },
  { id: 'r5', name: '战运部经办人', dept: '战运部', checked: false },
];

export default function MessageModal({ open, onClose, onSend }: MessageModalProps) {
  const [content, setContent] = useState('');
  const [receivers, setReceivers] = useState(defaultReceivers);
  const [errors, setErrors] = useState<{ content?: string; receivers?: string }>();
  const [charCount, setCharCount] = useState(0);

  if (!open) return null;

  const handleContentChange = (val: string) => {
    setContent(val);
    setCharCount(val.length);
    setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const toggleReceiver = (id: string) => {
    setReceivers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r))
    );
    setErrors((prev) => ({ ...prev, receivers: undefined }));
  };

  const handleSubmit = () => {
    const newErrors: { content?: string; receivers?: string } = {};
    if (!content.trim()) {
      newErrors.content = '请输入消息内容';
    }
    const checkedReceivers = receivers.filter((r) => r.checked);
    if (checkedReceivers.length === 0) {
      newErrors.receivers = '请至少选择一个接收人';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSend({
      content: content.trim(),
      receivers: checkedReceivers.map((r) => r.name),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100 flex-shrink-0">
          <h3 className="text-base font-semibold text-steel-900">消息发送</h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Message Content */}
          <div>
            <label className="text-xs text-steel-700 block mb-1.5">
              消息内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={5}
              maxLength={500}
              placeholder="请输入消息内容..."
              className={`w-full px-3 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 resize-none ${
                errors?.content ? 'border-red-300' : 'border-steel-200'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors?.content && <p className="text-xs text-red-500">{errors.content}</p>}
              <p className={`text-xs ml-auto ${charCount > 450 ? 'text-amber-500' : 'text-steel-400'}`}>
                {charCount}/500
              </p>
            </div>

            {/* Quick templates */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {messageTemplates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleContentChange(t)}
                  className="px-2.5 py-1 text-xs text-steel-600 bg-slate-50 border border-steel-200 rounded-md hover:bg-slate-100 hover:border-steel-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  模板{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Receivers */}
          <div>
            <label className="text-xs text-steel-700 block mb-1.5">
              接收人 <span className="text-red-500">*</span>
            </label>
            {errors?.receivers && <p className="text-xs text-red-500 mb-2">{errors.receivers}</p>}
            <div className="border border-steel-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-steel-200">
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500 w-12 text-center">选择</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500">姓名</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-steel-500">部门</th>
                  </tr>
                </thead>
                <tbody>
                  {receivers.map((r) => (
                    <tr key={r.id} className="border-b border-steel-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={r.checked}
                          onChange={() => toggleReceiver(r.id)}
                          className="w-4 h-4 accent-primary-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-sm text-steel-700">{r.name}</td>
                      <td className="px-4 py-2.5 text-sm text-steel-500">{r.dept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-steel-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-send-plane-line" />
            </div>
            发送
          </button>
        </div>
      </div>
    </div>
  );
}