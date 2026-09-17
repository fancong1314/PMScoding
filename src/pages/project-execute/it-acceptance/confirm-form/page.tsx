import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { itAcceptanceProjects } from '@/mocks/itAcceptanceMocks';
import type { ItAcceptanceContract } from '@/mocks/itAcceptanceMocks';

export default function ItAcceptanceConfirmPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const projectNo = searchParams.get('projectNo') || '';
  const projectName = searchParams.get('projectName') || '';
  const projectType = searchParams.get('projectType') || '';

  const [acceptanceType, setAcceptanceType] = useState('整体验收');
  const [auditHandler, setAuditHandler] = useState('');
  const [status, setStatus] = useState('待确认');
  const [creator, setCreator] = useState('数研院-郑文斌');
  const [createDate, setCreateDate] = useState(new Date().toISOString().split('T')[0]);

  const [contracts, setContracts] = useState<ItAcceptanceContract[]>([]);

  const [completeCheckFile, setCompleteCheckFile] = useState(false);
  const [meetingMinutesFile, setMeetingMinutesFile] = useState(false);
  const [memoFile, setMemoFile] = useState(false);

  const [toast, setToast] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    const proj = itAcceptanceProjects.find((p) => p.projectNo === projectNo);
    if (proj) {
      setContracts(proj.contracts.map((c) => ({ ...c, selected: true })));
    }
  }, [projectNo]);

  useEffect(() => {
    if (acceptanceType === '整体验收') { setContracts((prev) => prev.map((c) => ({ ...c, selected: true }))); }
    else { setContracts((prev) => prev.map((c) => ({ ...c, selected: false }))); }
  }, [acceptanceType]);

  const handleToggleContract = (cid: string) => {
    if (acceptanceType === '整体验收') return;
    setContracts((prev) => prev.map((c) => c.id === cid ? { ...c, selected: !c.selected } : c));
  };

  const handleConfirm = () => {
    const selectedCount = contracts.filter((c) => c.selected).length;
    if (!acceptanceType) { showToast('请选择验收类型'); return; }
    if (selectedCount === 0) { showToast('请至少勾选一条合同'); return; }
    setConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    showToast('验收确认成功');
    setConfirmModal(false);
    setTimeout(() => navigate('/project-execute/it-acceptance/research-confirm'), 1500);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white';
  const readOnlyCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-600';

  return (
    <Layout>
      <div className="space-y-4">
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line" /></div>{toast}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">验收确认</h1>
            <p className="text-xs text-steel-400 mt-0.5">对已通过审批的验收申请进行最终确认</p>
          </div>
          <button onClick={() => navigate('/project-execute/it-acceptance/research-confirm')} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回确认列表
          </button>
        </div>

        {/* Project Basic Info */}
        <div className="bg-white rounded-lg border border-steel-200 p-5">
          <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2"><div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-info-line text-steel-500" /></div>项目基础信息</h3>
          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            <div><label className="text-xs text-steel-500 block mb-1">立项号</label><input type="text" value={projectNo} readOnly className={readOnlyCls} /></div>
            <div><label className="text-xs text-steel-500 block mb-1">项目名称</label><input type="text" value={projectName} readOnly className={readOnlyCls} /></div>
            <div><label className="text-xs text-steel-500 block mb-1">项目类型</label><input type="text" value={projectType} readOnly className={readOnlyCls} /></div>
            <div>
              <label className="text-xs text-steel-500 block mb-1">验收类型 <span className="text-red-400">*</span></label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-sm text-steel-600"><input type="radio" name="acceptanceType" value="整体验收" checked={acceptanceType === '整体验收'} onChange={(e) => setAcceptanceType(e.target.value)} className="w-4 h-4" style={{ accentColor: '#059669' }} />整体验收</label>
                <label className="flex items-center gap-1.5 cursor-pointer text-sm text-steel-600"><input type="radio" name="acceptanceType" value="分项验收" checked={acceptanceType === '分项验收'} onChange={(e) => setAcceptanceType(e.target.value)} className="w-4 h-4" style={{ accentColor: '#059669' }} />分项验收</label>
              </div>
            </div>
            <div><label className="text-xs text-steel-500 block mb-1">审核经办人</label><input type="text" value={auditHandler} onChange={(e) => setAuditHandler(e.target.value)} placeholder="请输入审核经办人" className={inputCls} /></div>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-xs text-steel-500 block mb-1">状态</label>
                <input type="text" value={status} readOnly className={readOnlyCls} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-steel-500 block mb-1">创建人</label>
                <input type="text" value={creator} readOnly className={readOnlyCls} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-steel-500 block mb-1">创建日期</label>
                <input type="text" value={createDate} readOnly className={readOnlyCls} />
              </div>
            </div>
          </div>

          {/* Attachment Upload */}
          <div className="mt-5 pt-4 border-t border-steel-100 grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center justify-between p-2.5 border border-steel-200 rounded-md bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center"><i className={`${completeCheckFile ? 'ri-file-text-line text-emerald-500' : 'ri-file-upload-line text-steel-400'}`} /></div>
                <span className="text-sm text-steel-700">竣工验收表</span>
              </div>
              <button onClick={() => setCompleteCheckFile(!completeCheckFile)} className={`px-3 py-1 text-xs rounded-md border cursor-pointer whitespace-nowrap ${completeCheckFile ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-primary-600 border-primary-200 hover:bg-primary-50'}`}>{completeCheckFile ? '已上传' : '点击上传'}</button>
            </div>
            <div className="flex items-center justify-between p-2.5 border border-steel-200 rounded-md bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center"><i className={`${meetingMinutesFile ? 'ri-file-text-line text-emerald-500' : 'ri-file-upload-line text-steel-400'}`} /></div>
                <span className="text-sm text-steel-700">验收会议纪要</span>
              </div>
              <button onClick={() => setMeetingMinutesFile(!meetingMinutesFile)} className={`px-3 py-1 text-xs rounded-md border cursor-pointer whitespace-nowrap ${meetingMinutesFile ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-primary-600 border-primary-200 hover:bg-primary-50'}`}>{meetingMinutesFile ? '已上传' : '点击上传'}</button>
            </div>
            <div className="flex items-center justify-between p-2.5 border border-steel-200 rounded-md bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center"><i className={`${memoFile ? 'ri-file-text-line text-emerald-500' : 'ri-file-upload-line text-steel-400'}`} /></div>
                <span className="text-sm text-steel-700">验收备忘录</span>
              </div>
              <button onClick={() => setMemoFile(!memoFile)} className={`px-3 py-1 text-xs rounded-md border cursor-pointer whitespace-nowrap ${memoFile ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-primary-600 border-primary-200 hover:bg-primary-50'}`}>{memoFile ? '已上传' : '点击上传'}</button>
            </div>
          </div>
        </div>

        {/* Contract List */}
        <div className="bg-white rounded-lg border border-steel-200 p-5">
          <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2"><div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-list-3-line text-steel-500" /></div>合同关联信息</h3>
          {contracts.length === 0 ? (
            <div className="py-8 text-center"><div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2"><i className="ri-file-list-3-line text-xl text-steel-300" /></div><p className="text-sm text-steel-400">暂无关联合同</p></div>
          ) : (
            <div className="border border-steel-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: 1100 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center w-16">勾选</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同编号</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: '200px' }}>合同名称</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">合同金额</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">验收日期</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">是否岗位优化</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">涉及人数</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">是否经济效益</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">经济效益金额(元)</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">验收状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((c) => (
                      <tr key={c.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" checked={c.selected || false} onChange={() => handleToggleContract(c.id)} disabled={acceptanceType === '整体验收'} className={`w-4 h-4 rounded cursor-pointer ${acceptanceType === '整体验收' ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ accentColor: '#059669' }} />
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-700 font-mono whitespace-nowrap">{c.contractNo}</td>
                        <td className="px-4 py-3 text-sm text-steel-700">{c.contractName}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{formatCurrency(c.contractAmount)}</td>
                        <td className="px-4 py-3"><input type="date" defaultValue={c.acceptanceDate} className="px-2 py-1 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white" style={{ width: '130px' }} /></td>
                        <td className="px-4 py-3"><select defaultValue={c.isPositionOptimized} className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none bg-white"><option value="是">是</option><option value="否">否</option></select></td>
                        <td className="px-4 py-3"><input type="number" defaultValue={c.staffCount || ''} className="px-2 py-1 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white" style={{ width: '80px' }} min={0} /></td>
                        <td className="px-4 py-3"><select defaultValue={c.isEconomicBenefit} className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none bg-white"><option value="是">是</option><option value="否">否</option></select></td>
                        <td className="px-4 py-3"><input type="number" defaultValue={c.benefitAmount || ''} className="px-2 py-1 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white" style={{ width: '120px' }} min={0} step="1" /></td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap"><span className="text-steel-500">{c.acceptanceStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 bg-white rounded-lg border border-steel-200 px-4 py-3">
          <button onClick={() => navigate('/project-execute/it-acceptance/research-confirm')} className="px-5 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"><i className="ri-arrow-left-line mr-1" />取消</button>
          <button onClick={handleConfirm} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center gap-1.5" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><i className="ri-check-line" />确认</button>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmModal(false)} />
          <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-96 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 flex-shrink-0"><i className="ri-checkbox-circle-line text-emerald-500 text-xl" /></div>
              <div><h4 className="text-sm font-semibold text-steel-800">确认验收？</h4><p className="text-xs text-steel-500 mt-0.5">确认后选中合同验收状态变更为"是"，确定继续？</p></div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmModal(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleConfirmSubmit} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>确认</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}