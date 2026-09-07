import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getContractById, getStopResumeById } from '@/mocks/contractExecutionMocks';
import ApprovalFlowConfigModal from '../components/ApprovalFlowConfigModal';

export default function StopResumeFormPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const id = urlParams.get('id');

  const contract = getContractById(contractId);
  const existingApply = id ? getStopResumeById(id) : null;
  const isEdit = !!existingApply;

  const [formData, setFormData] = useState({
    changeNo: existingApply?.changeNo || '',
    type: existingApply?.type || '合同停工',
    status: existingApply?.status || '暂存',
    stopType: existingApply?.stopType || 'A甲方原因',
    stopDate: existingApply?.stopDate || '',
    resumeDate: existingApply?.resumeDate || '',
    date: existingApply?.date || '',
    fileCount: existingApply?.fileCount || 0,
    reason: existingApply?.reason || '',
    description: existingApply?.description || '',
    exemptAssessment: existingApply?.exemptAssessment || '否',
    creator: existingApply?.creator || '当前用户',
    modifier: existingApply?.modifier || isEdit ? '当前用户' : '',
    createDate: existingApply?.createDate || new Date().toISOString().slice(0, 10),
    modifyDate: existingApply?.modifyDate || '',
    createTime: existingApply?.createTime || new Date().toTimeString().slice(0, 8),
    modifyTime: existingApply?.modifyTime || '',
  });
  const [toast, setToast] = useState('');
  const [showFlowConfig, setShowFlowConfig] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleSave = () => {
    if (!formData.type) { showToast('请选择异动类型'); return; }
    if (formData.type === '合同停工' && !formData.stopDate) { showToast('请选择合同停工日期'); return; }
    if (formData.type === '合同复工' && !formData.resumeDate) { showToast('请选择合同复工日期'); return; }
    if (!formData.reason.trim()) { showToast('请输入异动原因'); return; }
    if (!formData.description.trim()) { showToast('请输入异动说明'); return; }
    showToast(isEdit ? '修改保存成功' : '暂存成功');
  };

  const handleFlowSubmit = () => {
    setShowFlowConfig(false);
    showToast('审批流程已提交，状态变更为审批中');
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-slate-800">{isEdit ? '修改停复工申请' : '新增停复工申请'}</h1>
          <button onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        {/* Warning */}
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 leading-relaxed">
            <div className="w-3 h-3 flex items-center justify-center inline-flex mr-1"><i className="ri-error-warning-line" /></div>
            制造部要求:合同开工必须走呈核流程, 大修类及零固类最后核准人是【009014】张涛科长, 自动化类为制造部【009585】宋宁岐科长, 其余为【009299】施海峰科长
          </p>
        </div>

        {/* Basic Info */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-800">基础信息</span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            {/* Left */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">异动编号</span>
                <input type="text" value={formData.changeNo || '新增时为空'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">立项号</span>
                <input type="text" value={contract?.approvalNo || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">合同编号</span>
                <input type="text" value={contract?.contractNo || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">合同名称</span>
                <input type="text" value={contract?.contractName || ''} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>异动类型</span>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="合同停工">合同停工</option>
                  <option value="合同复工">合同复工</option>
                </select>
              </div>
              {formData.type === '合同停工' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>合同停工类型</span>
                  <select value={formData.stopType} onChange={(e) => setFormData({ ...formData, stopType: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="A甲方原因">A甲方原因</option>
                    <option value="B乙方原因">B乙方原因</option>
                    <option value="C不可抗力">C不可抗力</option>
                  </select>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">异动状态</span>
                <input type="text" value={formData.status} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              {formData.type === '合同停工' ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>合同停工日期</span>
                  <input type="date" value={formData.stopDate} onChange={(e) => setFormData({ ...formData, stopDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap w-24"><span className="text-red-500">*</span>合同复工日期</span>
                  <input type="date" value={formData.resumeDate} onChange={(e) => setFormData({ ...formData, resumeDate: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              )}
            </div>
            {/* Right */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">文件数量</span>
                <input type="number" value={formData.fileCount} onChange={(e) => setFormData({ ...formData, fileCount: Number(e.target.value) })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" min={0} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">是否免除考核</span>
                <select value={formData.exemptAssessment} onChange={(e) => setFormData({ ...formData, exemptAssessment: e.target.value })} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">创建人</span>
                <input type="text" value={formData.creator} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">修改人</span>
                <input type="text" value={formData.modifier} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">创建日期</span>
                <input type="text" value={formData.createDate} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">修改日期</span>
                <input type="text" value={formData.modifyDate || '--'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">创建时间</span>
                <input type="text" value={formData.createTime} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-24">修改时间</span>
                <input type="text" value={formData.modifyTime || '--'} disabled className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
              </div>
            </div>
            {/* Full width */}
            <div className="col-span-2 flex items-start gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24 mt-1"><span className="text-red-500">*</span>异动原因</span>
              <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入异动原因" maxLength={500} />
            </div>
            <div className="col-span-2 flex items-start gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-24 mt-1"><span className="text-red-500">*</span>异动说明</span>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="请输入异动说明" maxLength={500} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
          <button onClick={handleSave} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line" /></div>保存
          </button>
          <button onClick={() => setShowFlowConfig(true)} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line" /></div>呈核
          </button>
          <button onClick={() => navigate(`/project-contract/execution/list?contractId=${contractId}`)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-close-line" /></div>取消
          </button>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}

      {showFlowConfig && (
        <ApprovalFlowConfigModal onClose={() => setShowFlowConfig(false)} onConfirm={handleFlowSubmit} defaultTitle={`停复工审批-${contract?.contractNo || ''}`} />
      )}
    </Layout>
  );
}