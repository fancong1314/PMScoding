import { useState } from 'react';
import { CommencementApply } from '@/mocks/contractExecutionMocks';

interface IssueModalProps {
  apply: CommencementApply;
  onClose: () => void;
  onSubmit: () => void;
}

export default function IssueModal({ apply, onClose, onSubmit }: IssueModalProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleSubmit = () => {
    if (files.length === 0 && apply.issueFiles.length === 0) {
      showToast('请先上传附件');
      return;
    }
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-[520px]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">开工令签发</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-slate-500">申请编号</span>
              <span className="text-sm font-medium text-slate-800">{apply.applyNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">合同名称</span>
              <span className="text-sm font-medium text-slate-800">{apply.contractName}</span>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-sm text-slate-600 font-medium mb-2 block">附件上传</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-cloud-line" /></div>
                上传文件
              </button>
              <span className="text-xs text-slate-400">已上传 {files.length + apply.issueFiles.length} 个文件</span>
            </div>
            {apply.issueFiles.length > 0 && (
              <div className="mt-2 flex items-center gap-1 flex-wrap">
                {apply.issueFiles.map((f, i) => (
                  <span key={i} className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded border border-slate-200 flex items-center gap-1">
                    <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line" /></div>
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-check-line" /></div>
            提交
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}