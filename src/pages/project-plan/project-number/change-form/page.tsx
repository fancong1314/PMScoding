import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { projectNumberRecords } from '@/mocks/projectNumberMocks';
import type { ProjectNumberRecord } from '@/mocks/projectNumberMocks';

function getRecord(id: string | null): ProjectNumberRecord | null {
  if (!id) return null;
  return projectNumberRecords.find((r) => r.id === id) ?? null;
}

export default function ProjectNumberChangeFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const record = getRecord(recordId);

  const [changeDesc, setChangeDesc] = useState('');
  const [changeProjectDesc, setChangeProjectDesc] = useState('');
  const [changeRemark, setChangeRemark] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = () => {
    if (!changeDesc.trim()) { showToast('请输入变更说明', 'error'); return; }
    if (!changeProjectDesc.trim()) { showToast('请输入变更立项说明', 'error'); return; }
    if (!changeRemark.trim()) { showToast('请输入变更备注', 'error'); return; }
    showToast('变更申请提交成功，已进入审批流程');
    setTimeout(() => navigate('/project-plan/project-number'), 1000);
  };

  const handleCancel = () => navigate('/project-plan/project-number');

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white resize-none';
  const labelCls = 'flex justify-end items-start text-sm text-steel-600 pt-2 leading-5';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-steel-900">立项号变更申请</h2>
          <p className="text-xs text-steel-400 mt-0.5">
            {record ? `正在为「${record.projectNo}」提交变更申请` : '请填写变更申请信息'}
          </p>
        </div>

        {/* Base Info Card */}
        {record && (
          <div className="bg-white rounded-lg border border-steel-200 p-4 mb-4">
            <h4 className="text-sm font-semibold text-steel-800 mb-3">当前立项号信息</h4>
            <div className="grid grid-cols-4 gap-4 text-xs">
              <div><span className="text-steel-400">立项号：</span><span className="font-mono font-medium text-steel-700">{record.projectNo}</span></div>
              <div><span className="text-steel-400">项目名称：</span><span className="text-steel-700">{record.projectName}</span></div>
              <div><span className="text-steel-400">立项金额：</span><span className="text-steel-700">{record.projectAmount.toFixed(2)} 万元</span></div>
              <div><span className="text-steel-400">状态：</span><span className="text-steel-700">{record.status === 'active' ? '已立项' : record.status}</span></div>
            </div>
          </div>
        )}

        {/* Change Form */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-exchange-line text-primary-500" /></div>
            <h3 className="text-sm font-semibold text-steel-800">变更信息</h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {/* 变更说明 */}
              <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                <label className={labelCls}>变更说明 <span className="text-red-500 ml-0.5">*</span></label>
                <textarea value={changeDesc} onChange={(e) => setChangeDesc(e.target.value)} placeholder="请输入变更说明，描述变更的原因和背景" rows={4} maxLength={500} className={inputCls} />
              </div>
              {/* 变更立项说明 */}
              <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                <label className={labelCls}>变更立项说明 <span className="text-red-500 ml-0.5">*</span></label>
                <textarea value={changeProjectDesc} onChange={(e) => setChangeProjectDesc(e.target.value)} placeholder="请输入变更后的立项说明" rows={4} maxLength={500} className={inputCls} />
              </div>
              {/* 变更备注 */}
              <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                <label className={labelCls}>变更备注 <span className="text-red-500 ml-0.5">*</span></label>
                <textarea value={changeRemark} onChange={(e) => setChangeRemark(e.target.value)} placeholder="请输入变更备注信息" rows={3} maxLength={500} className={inputCls} />
              </div>
              {/* 状态 */}
              <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                <label className={labelCls}>状态</label>
                <div className="px-3 py-2 text-sm text-steel-600 bg-slate-50 rounded-md border border-steel-100">
                  草稿
                </div>
              </div>
              {/* 附件上传 */}
              <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                <label className={labelCls}>附件上传</label>
                <div className="border-2 border-dashed border-steel-200 rounded-lg p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                    <i className="ri-upload-cloud-2-line text-xl text-steel-400" />
                  </div>
                  <p className="text-sm text-steel-500">点击上传或拖拽文件到此处</p>
                  <p className="text-xs text-steel-400 mt-1">支持 PDF、DOC、XLS、图片等格式，单个文件不超过50MB</p>
                </div>
              </div>
              {/* 创建人/时间 */}
              <div className="grid grid-cols-2 gap-x-8">
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>创建人</label>
                  <div className="px-3 py-2 text-sm text-steel-600 bg-slate-50 rounded-md border border-steel-100">管理员</div>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>创建时间</label>
                  <div className="px-3 py-2 text-sm text-steel-600 bg-slate-50 rounded-md border border-steel-100">2026-04-28 10:00:00</div>
                </div>
              </div>
              {/* 修改人/时间 */}
              <div className="grid grid-cols-2 gap-x-8">
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>修改人</label>
                  <div className="px-3 py-2 text-sm text-steel-600 bg-slate-50 rounded-md border border-steel-100">—</div>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                  <label className={labelCls}>修改时间</label>
                  <div className="px-3 py-2 text-sm text-steel-600 bg-slate-50 rounded-md border border-steel-100">—</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={handleCancel}
            className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
            取消
          </button>
          <button onClick={handleSubmit}
            className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <i className="ri-check-line" />
            提交
          </button>
        </div>
      </div>

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