import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getEpcContractById, getEpcDevicesForReview } from '@/mocks/epcEquipmentMocks';

export default function EpcEquipmentReviewPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';

  const contract = getEpcContractById(contractId);
  const devices = useMemo(() => contractId ? getEpcDevicesForReview(contractId) : [], [contractId]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deviceResults, setDeviceResults] = useState<Record<string, { satisfied: string; deviation: string }>>({});
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const allSelected = devices.length > 0 && devices.every((d) => selectedIds.has(d.id));
  const toggleAll = () => {
    if (allSelected) { setSelectedIds(new Set()); return; }
    setSelectedIds(new Set(devices.map((d) => d.id)));
  };

  const toggleDevice = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) { next.delete(id); } else { next.add(id); }
    setSelectedIds(next);
  };

  const handleSubmit = () => {
    const selected = Array.from(selectedIds);
    if (selected.length === 0) { showToast('请至少勾选一个设备进行审核'); return; }
    for (const id of selected) {
      const r = deviceResults[id];
      if (!r || !r.satisfied) { showToast('请完成所有已勾选设备的验收判定'); return; }
      if (r.satisfied === '不满足' && !r.deviation?.trim()) { showToast('不满足的设备需填写偏离项说明'); return; }
    }
    showToast(`已提交 ${selected.length} 个设备的审核结果`);
    setTimeout(() => navigate('/project-contract/epc-equipment'), 1500);
  };

  const supervisorPassedCount = contract ? contract.supervisorPassed : 0;
  const supervisorRejectedCount = contract ? contract.supervisorRejected : 0;
  const clientPassedCount = contract ? contract.clientPassed : 0;
  const clientPendingCount = contract ? contract.clientPending : 0;
  const passRate = contract && contract.totalDevices > 0 ? `${((contract.clientPassed / contract.totalDevices) * 100).toFixed(1)}%` : '0%';

  if (!contract) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">EPC设备验收审核</h1>
          <button onClick={() => navigate('/project-contract/epc-equipment')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        {/* Contract Info Bar */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-6">
          <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
          <div className="flex items-center gap-2"><span className="text-sm text-slate-500">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div className="text-xs text-slate-500 mb-1">监理验收通过</div>
            <div className="text-xl font-bold text-emerald-600">{supervisorPassedCount}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div className="text-xs text-slate-500 mb-1">监理验收未通过</div>
            <div className="text-xl font-bold text-red-600">{supervisorRejectedCount}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div className="text-xs text-slate-500 mb-1">项目组已审批</div>
            <div className="text-xl font-bold text-emerald-600">{clientPassedCount}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div className="text-xs text-slate-500 mb-1">项目组待审批</div>
            <div className="text-xl font-bold text-amber-600">{clientPendingCount}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div className="text-xs text-slate-500 mb-1">设备验收合格率</div>
            <div className="text-xl font-bold text-emerald-600">{passRate}</div>
          </div>
        </div>

        {/* Device List */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">设备明细列表（仅展示监理审批通过设备）</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 accent-emerald-500" />
              全选
            </label>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{ maxHeight: 'calc(100vh - 620px)' }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-20 bg-slate-50">
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '50px' }}>勾选</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '180px' }}>设备名称</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '60px' }}>单位</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>品牌</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '60px' }}>数量</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '70px' }}>单重</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '140px' }}>规格型号</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '90px' }}>是否满足(监理)</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '150px' }}>偏离项(监理)</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>验收时间(监理)</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>验收人(监理)</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>附件(监理)</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '100px' }}>是否满足(审核)</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '160px' }}>偏离项(审核)</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => {
                  const isSelected = selectedIds.has(device.id);
                  const result = deviceResults[device.id];
                  return (
                    <tr key={device.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleDevice(device.id)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                      </td>
                      <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{device.name}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{device.unit}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{device.brand}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap text-center">{device.quantity}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{device.singleWeight}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{device.spec}</td>
                      <td className="px-3 py-2.5 text-sm whitespace-nowrap text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${device.supervisorSatisfied === '满足' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{device.supervisorSatisfied}</span>
                      </td>
                      <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{device.supervisorDeviation || '--'}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{device.supervisorTime}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{device.supervisorPerson}</td>
                      <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                        <span className="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1 cursor-pointer hover:bg-blue-100 w-fit">
                          <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line" /></div>{device.supervisorAttachment}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-sm whitespace-nowrap text-center">
                        {isSelected ? (
                          <select value={result?.satisfied || ''} onChange={(e) => setDeviceResults({ ...deviceResults, [device.id]: { ...result, satisfied: e.target.value, deviation: result?.deviation || '' } })} className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 w-20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                            <option value="">请选择</option>
                            <option value="满足">满足</option>
                            <option value="不满足">不满足</option>
                          </select>
                        ) : (
                          <span className="text-xs text-slate-400">--</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                        {isSelected ? (
                          <input type="text" value={result?.deviation || ''} onChange={(e) => setDeviceResults({ ...deviceResults, [device.id]: { ...result, satisfied: result?.satisfied || '', deviation: e.target.value } })} className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 w-36 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder={result?.satisfied === '不满足' ? '请填写偏离项' : ''} disabled={result?.satisfied !== '不满足'} />
                        ) : (
                          <span className="text-xs text-slate-400">--</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {devices.length === 0 && (
                  <tr><td colSpan={14} className="px-3 py-10 text-center text-sm text-slate-400">暂无监理审批通过的设备</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-sm text-slate-500">已勾选 {selectedIds.size} 个设备</div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
          <button onClick={handleSubmit} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-check-line" /></div>确认提交
          </button>
          <button onClick={() => navigate('/project-contract/epc-equipment')} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
            取消
          </button>
        </div>
      </div>
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}