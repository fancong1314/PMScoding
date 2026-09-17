import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { monitorContracts, allHikvisionDevices, hikvisionSyncInfo, type MonitorContract, type HikvisionDevice } from '@/mocks/monitorConfigMocks';

const SECTIONS = [
  { id: 'contract-info', title: '合同基本信息', icon: 'ri-file-info-line' },
  { id: 'associated-devices', title: '已关联设备', icon: 'ri-vidicon-line' },
  { id: 'device-sort', title: '设备排序', icon: 'ri-sort-desc' },
];

const onlineStatusStyle: Record<string, string> = {
  '在线': 'bg-emerald-50 text-emerald-700',
  '离线': 'bg-red-50 text-red-700',
  '信号弱': 'bg-amber-50 text-amber-700',
};

const testResultStyle: Record<string, string> = {
  '通过': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '未测通': 'bg-red-50 text-red-700 border-red-200',
  '未测': 'bg-slate-100 text-slate-500 border-slate-200',
  '信号弱': 'bg-amber-50 text-amber-700 border-amber-200',
};

const deviceTypeOptions = ['全部', '球机', '枪机', '半球', '其他'];
const onlineFilterOptions = ['全部', '在线', '离线'];

export default function MonitorDeviceConfigPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId') || '';

  const contract = monitorContracts.find((c) => c.id === contractId);

  // Associated devices
  const [devices, setDevices] = useState<HikvisionDevice[]>(() => {
    if (!contract) return [];
    return allHikvisionDevices.filter((d) =>
      d.associatedContracts?.includes(contract.contractNo)
    ).map((d, i) => ({ ...d, sortOrder: i + 1 }));
  });

  // Device selection modal
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const [selectionSearchName, setSelectionSearchName] = useState('');
  const [selectionSearchLocation, setSelectionSearchLocation] = useState('');
  const [selectionFilterType, setSelectionFilterType] = useState('全部');
  const [selectionFilterStatus, setSelectionFilterStatus] = useState('全部');
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);

  // Sync modal
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncRegion, setSyncRegion] = useState('全部设备');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ newCount: number; updateCount: number; failCount: number; failReason: string } | null>(null);

  // Preview modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<HikvisionDevice | null>(null);
  const [previewStatus, setPreviewStatus] = useState<'加载中' | '播放中' | '信号中断'>('加载中');

  const [activeSection, setActiveSection] = useState('contract-info');
  const [toast, setToast] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  // IntersectionObserver
  useEffect(() => {
    const visibilityMap: Record<string, number> = {};
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibilityMap[id] = entry.intersectionRatio;
          const max = Object.entries(visibilityMap).sort((a, b) => b[1] - a[1])[0]?.[0];
          if (max) setActiveSection(max);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-80px 0px -50% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveSection(id); }
  }, []);

  // Device sort
  const moveDeviceUp = (idx: number) => {
    if (idx === 0) return;
    setDevices((prev) => {
      const updated = [...prev];
      [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
      return updated.map((d, i) => ({ ...d, sortOrder: i + 1 }));
    });
  };

  const moveDeviceDown = (idx: number) => {
    if (idx === devices.length - 1) return;
    setDevices((prev) => {
      const updated = [...prev];
      [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
      return updated.map((d, i) => ({ ...d, sortOrder: i + 1 }));
    });
  };

  // Remove device
  const [removeDevices, setRemoveDevices] = useState<string[]>([]);
  const toggleDeviceSelect = (deviceId: string) => {
    setRemoveDevices((prev) => prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]);
  };

  const handleRemoveDevices = () => {
    if (removeDevices.length === 0) { showToast('请先选择要移除的设备'); return; }
    setDevices((prev) => prev.filter((d) => !removeDevices.includes(d.id)));
    setRemoveDevices([]);
    showToast(`已移除 ${removeDevices.length} 个设备`);
  };

  // Batch test
  const handleBatchTest = () => {
    const selected = removeDevices.length > 0 ? removeDevices : devices.map((d) => d.id);
    setDevices((prev) =>
      prev.map((d) => {
        if (selected.includes(d.id)) {
          return { ...d, onlineStatus: Math.random() > 0.2 ? '在线' : '离线', testResult: Math.random() > 0.2 ? '通过' : '未测通' };
        }
        return d;
      })
    );
    showToast('批量测通完成');
  };

  // Single test
  const handleSingleTest = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          return { ...d, onlineStatus: Math.random() > 0.1 ? '在线' : '离线', testResult: Math.random() > 0.1 ? '通过' : '未测通' };
        }
        return d;
      })
    );
    showToast('测通完成');
  };

  // Preview
  const handlePreview = (device: HikvisionDevice) => {
    setPreviewDevice(device);
    setPreviewStatus('加载中');
    setPreviewModalOpen(true);
    setTimeout(() => setPreviewStatus('播放中'), 1500);
  };

  // Selection modal
  const getAvailableDevices = useCallback(() => {
    return allHikvisionDevices.filter((d) => {
      const alreadyAssociated = devices.some((ad) => ad.id === d.id);
      if (alreadyAssociated) return false;
      if (selectionSearchName && !d.deviceName.toLowerCase().includes(selectionSearchName.toLowerCase())) return false;
      if (selectionSearchLocation && !d.installLocation.toLowerCase().includes(selectionSearchLocation.toLowerCase())) return false;
      if (selectionFilterType !== '全部' && d.deviceType !== selectionFilterType) return false;
      if (selectionFilterStatus !== '全部' && d.onlineStatus !== selectionFilterStatus) return false;
      return true;
    });
  }, [devices, selectionSearchName, selectionSearchLocation, selectionFilterType, selectionFilterStatus]);

  const handleConfirmSelection = () => {
    const selectedDevs = allHikvisionDevices.filter((d) => selectedDeviceIds.includes(d.id));
    const newDevices = selectedDevs.map((d) => ({
      ...d,
      sortOrder: devices.length + 1,
      associatedContracts: [...(d.associatedContracts || []), contract?.contractNo || ''],
    }));
    setDevices((prev) => [...prev, ...newDevices]);
    showToast(`已关联 ${selectedDeviceIds.length} 个设备`);
    setSelectionModalOpen(false);
    setSelectedDeviceIds([]);
    setSelectionSearchName('');
    setSelectionSearchLocation('');
    setSelectionFilterType('全部');
    setSelectionFilterStatus('全部');
  };

  // Sync
  const handleStartSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncResult({ newCount: 5, updateCount: 12, failCount: 1, failReason: '设备HK-DS-2CD3T86FWDV3-2023018 网络不可达' });
    }, 2000);
  };

  const handleSyncClose = () => {
    setSyncModalOpen(false);
    setSyncResult(null);
    setSyncing(false);
    setSyncRegion('全部设备');
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white';
  const readOnlyCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-600';

  return (
    <Layout mainClassName="flex-1 relative">
      <div className="flex" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
        {/* Left Anchor Navigation */}
        <div
          className="fixed z-30 flex flex-col py-5"
          style={{ left: '14rem', top: '3.5rem', width: 196, height: 'calc(100vh - 3.5rem)', background: 'white', borderRight: '1px solid #e8edf3' }}
        >
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-steel-400 uppercase tracking-wider">配置导航</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all cursor-pointer mb-0.5 text-left ${
                  activeSection === s.id ? 'font-medium' : 'text-steel-500 hover:text-steel-700 hover:bg-slate-50'
                }`}
                style={activeSection === s.id ? { color: '#059669', backgroundColor: '#f0fdf4' } : undefined}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all"
                  style={activeSection === s.id ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' } : { backgroundColor: '#e8edf3', color: '#718096' }}
                >
                  {i + 1}
                </div>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{s.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 overflow-y-auto pb-16 px-6 pt-6" style={{ marginLeft: 196 }}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-steel-900">监控设备配置</h2>
              <p className="text-xs text-steel-400 mt-0.5">为合同配置关联的监控设备，管理设备排序</p>
            </div>
            <button onClick={() => navigate('/system-config/monitor-config')} className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              <i className="ri-arrow-left-line" />
              返回列表
            </button>
          </div>

          <div className="space-y-4">
            {/* Section 1: Contract Info */}
            <div ref={(el) => { sectionRefs.current['contract-info'] = el; }} className="bg-white rounded-lg border border-steel-200 p-5">
              <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center"><i className="ri-file-info-line text-steel-500" /></div>
                合同基本信息
              </h3>
              {contract ? (
                <div className="grid grid-cols-4 gap-4">
                  <div><label className="text-xs text-steel-400 block mb-1">合同编号</label><span className="text-sm text-steel-700 font-mono">{contract.contractNo}</span></div>
                  <div><label className="text-xs text-steel-400 block mb-1">合同名称</label><span className="text-sm text-steel-700">{contract.contractName}</span></div>
                  <div><label className="text-xs text-steel-400 block mb-1">所属事业部</label><span className="text-sm text-steel-700">{contract.businessUnit}</span></div>
                  <div><label className="text-xs text-steel-400 block mb-1">业主单位</label><span className="text-sm text-steel-700">{contract.ownerUnit}</span></div>
                </div>
              ) : (
                <p className="text-sm text-steel-400">未找到合同信息</p>
              )}
            </div>

            {/* Section 2: Associated Devices */}
            <div ref={(el) => { sectionRefs.current['associated-devices'] = el; }} className="bg-white rounded-lg border border-steel-200 p-5">
              <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center"><i className="ri-vidicon-line text-steel-500" /></div>
                已关联设备
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setSelectionModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
                  添加设备
                </button>
                <button onClick={handleRemoveDevices} className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-delete-bin-line" /></div>
                  移除
                </button>
                <button onClick={handleBatchTest} className="flex items-center gap-1.5 px-4 py-2 text-sm text-sky-700 border border-sky-200 rounded-md hover:bg-sky-50 cursor-pointer whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-router-line" /></div>
                  批量测通
                </button>
              </div>

              <div className="border border-steel-200 rounded-lg overflow-hidden">
                <table className="w-full text-left" style={{ minWidth: '1400px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-10">
                        <input type="checkbox" className="w-3.5 h-3.5 cursor-pointer" style={{ accentColor: '#3b82f6' }} onChange={(e) => { if (e.target.checked) setRemoveDevices(devices.map((d) => d.id)); else setRemoveDevices([]); }} checked={removeDevices.length === devices.length && devices.length > 0} />
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">设备名称</th>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">设备序列号</th>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">安装位置</th>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">设备类型</th>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">通道号</th>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">在线状态</th>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">视频流地址</th>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">测通结果</th>
                      <th className="px-3 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center" style={{ minWidth: '140px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-vidicon-line text-xl text-steel-300" /></div>
                            <p className="text-sm text-steel-400">暂无关联设备，请点击"添加设备"</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      devices.map((d) => (
                        <tr key={d.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-3">
                            <input type="checkbox" className="w-3.5 h-3.5 cursor-pointer" style={{ accentColor: '#3b82f6' }} checked={removeDevices.includes(d.id)} onChange={() => toggleDeviceSelect(d.id)} />
                          </td>
                          <td className="px-3 py-3 text-sm text-steel-700 font-medium whitespace-nowrap">{d.deviceName}</td>
                          <td className="px-3 py-3 text-sm font-mono text-steel-500 whitespace-nowrap">{d.serialNo}</td>
                          <td className="px-3 py-3 text-sm text-steel-600 whitespace-nowrap">{d.installLocation}</td>
                          <td className="px-3 py-3 text-sm text-steel-600 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                              d.deviceType === '球机' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                              d.deviceType === '枪机' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              d.deviceType === '半球' ? 'bg-violet-50 text-violet-700 border-violet-200' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>{d.deviceType}</span>
                          </td>
                          <td className="px-3 py-3 text-sm text-steel-600 whitespace-nowrap">{d.channelNo}</td>
                          <td className="px-3 py-3 text-sm whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${onlineStatusStyle[d.onlineStatus] || ''}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${d.onlineStatus === '在线' ? 'bg-emerald-500' : d.onlineStatus === '离线' ? 'bg-red-500' : 'bg-amber-500'}`} />
                              {d.onlineStatus}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm font-mono text-xs text-steel-400 whitespace-nowrap max-w-[160px]"><span className="line-clamp-1">{d.streamUrl}</span></td>
                          <td className="px-3 py-3 text-sm whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${testResultStyle[d.testResult] || ''}`}>{d.testResult}</span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1.5 justify-center">
                              <button onClick={() => handleSingleTest(d.id)} className="px-2 py-1 text-xs text-sky-700 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap">测通</button>
                              <button onClick={() => handlePreview(d)} className="px-2 py-1 text-xs text-violet-700 border border-violet-200 rounded hover:bg-violet-50 cursor-pointer whitespace-nowrap">预览</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Device Sort */}
            <div ref={(el) => { sectionRefs.current['device-sort'] = el; }} className="bg-white rounded-lg border border-steel-200 p-5">
              <h3 className="text-sm font-semibold text-steel-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center"><i className="ri-sort-desc text-steel-500" /></div>
                设备排序
              </h3>
              <p className="text-xs text-steel-400 mb-4">设置设备在施工视频监控看板中的展示顺序，排序第1位的设备默认在看板主画面展示，其余按顺序分配到副画面。</p>

              <div className="border border-steel-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-16 text-center">排序</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">设备名称</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">安装位置</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">在线状态</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">显示位置</th>
                      <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center" style={{ minWidth: '100px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-steel-400">暂无设备</td>
                      </tr>
                    ) : (
                      devices.map((d, idx) => (
                        <tr key={d.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-steel-700 font-semibold text-center">{d.sortOrder}</td>
                          <td className="px-4 py-3 text-sm text-steel-700 whitespace-nowrap">{d.deviceName}</td>
                          <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{d.installLocation}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${onlineStatusStyle[d.onlineStatus] || ''}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${d.onlineStatus === '在线' ? 'bg-emerald-500' : d.onlineStatus === '离线' ? 'bg-red-500' : 'bg-amber-500'}`} />
                              {d.onlineStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">
                            {idx === 0 ? <span className="text-primary-600 font-medium">主画面</span> : <span className="text-steel-400">副画面 {idx}</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 justify-center">
                              <button onClick={() => moveDeviceUp(idx)} disabled={idx === 0} className="w-7 h-7 flex items-center justify-center border border-steel-200 rounded text-steel-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                                <i className="ri-arrow-up-s-line text-sm" />
                              </button>
                              <button onClick={() => moveDeviceDown(idx)} disabled={idx === devices.length - 1} className="w-7 h-7 flex items-center justify-center border border-steel-200 rounded text-steel-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                                <i className="ri-arrow-down-s-line text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border bg-emerald-50 border-emerald-200">
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-checkbox-circle-line text-emerald-500" /></div>
            <span className="text-sm text-emerald-700">{toast}</span>
          </div>
        </div>
      )}

      {/* Device Selection Modal */}
      {selectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setSelectionModalOpen(false); setSelectedDeviceIds([]); }} />
          <div className="relative bg-white rounded-xl shadow-xl overflow-hidden" style={{ width: '80vw', maxWidth: '1200px', maxHeight: '80vh' }}>
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-steel-800">设备选择</h3>
                <p className="text-xs text-steel-400 mt-0.5">从海康平台设备列表中选择需要关联到当前合同的设备</p>
              </div>
              <button onClick={() => { setSelectionModalOpen(false); setSelectedDeviceIds([]); }} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>

            {/* Selection Search */}
            <div className="px-6 py-3 border-b border-steel-100 bg-slate-50">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-steel-400 block mb-1">设备名称</label>
                  <input type="text" value={selectionSearchName} onChange={(e) => setSelectionSearchName(e.target.value)} placeholder="模糊查询" className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500/20 bg-white" />
                </div>
                <div>
                  <label className="text-xs text-steel-400 block mb-1">安装位置</label>
                  <input type="text" value={selectionSearchLocation} onChange={(e) => setSelectionSearchLocation(e.target.value)} placeholder="模糊查询" className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500/20 bg-white" />
                </div>
                <div>
                  <label className="text-xs text-steel-400 block mb-1">设备类型</label>
                  <select value={selectionFilterType} onChange={(e) => setSelectionFilterType(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none bg-white">
                    {deviceTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-steel-400 block mb-1">在线状态</label>
                  <select value={selectionFilterStatus} onChange={(e) => setSelectionFilterStatus(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none bg-white">
                    {onlineFilterOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Selection Table */}
            <div className="overflow-auto" style={{ maxHeight: 'calc(80vh - 260px)' }}>
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10">
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">
                      <input type="checkbox" className="w-3.5 h-3.5 cursor-pointer" style={{ accentColor: '#3b82f6' }} onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDeviceIds(getAvailableDevices().map((d) => d.id));
                        } else {
                          setSelectedDeviceIds([]);
                        }
                      }} checked={getAvailableDevices().length > 0 && selectedDeviceIds.length === getAvailableDevices().length} />
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">设备名称</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">设备序列号</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">安装位置</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">设备类型</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">通道号</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">在线状态</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">所属区域</th>
                  </tr>
                </thead>
                <tbody>
                  {getAvailableDevices().map((d) => {
                    const isAlreadyAssociated = d.associatedContracts && d.associatedContracts.length > 0;
                    const isCurrentContract = isAlreadyAssociated && d.associatedContracts?.includes(contract?.contractNo || '');
                    return (
                      <tr key={d.id} className={`border-b border-steel-100 hover:bg-slate-50 transition-colors ${isCurrentContract ? 'opacity-40' : ''}`}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 cursor-pointer"
                            style={{ accentColor: '#3b82f6' }}
                            checked={selectedDeviceIds.includes(d.id)}
                            onChange={() => {
                              if (isCurrentContract) return;
                              setSelectedDeviceIds((prev) => prev.includes(d.id) ? prev.filter((id) => id !== d.id) : [...prev, d.id]);
                            }}
                            disabled={isCurrentContract}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-700 font-medium whitespace-nowrap">{d.deviceName}</td>
                        <td className="px-4 py-3 text-sm font-mono text-steel-500 whitespace-nowrap">{d.serialNo}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{d.installLocation}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{d.deviceType}</td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{d.channelNo}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${onlineStatusStyle[d.onlineStatus] || ''}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${d.onlineStatus === '在线' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {d.onlineStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">
                          {d.region}
                          {isAlreadyAssociated && !isCurrentContract && (
                            <span className="ml-2 text-xs text-amber-600">已关联: {d.associatedContracts?.join(', ')}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {getAvailableDevices().length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-steel-400">暂无可用设备</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-steel-200 flex justify-between items-center">
              <span className="text-xs text-steel-400">已选择 {selectedDeviceIds.length} 个设备</span>
              <div className="flex gap-2">
                <button onClick={() => { setSelectionModalOpen(false); setSelectedDeviceIds([]); }} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
                <button onClick={handleConfirmSelection} disabled={selectedDeviceIds.length === 0} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>确认关联</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Modal */}
      {syncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={handleSyncClose} />
          <div className="relative bg-white rounded-xl shadow-xl w-[560px] max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-steel-800">设备同步</h3>
                <p className="text-xs text-steel-400 mt-0.5">从海康平台同步设备数据到本系统</p>
              </div>
              <button onClick={handleSyncClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-xs text-steel-500 block mb-1">海康平台地址</label>
                <input type="text" value={hikvisionSyncInfo.platformUrl} readOnly className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-600" />
              </div>
              <div>
                <label className="text-xs text-steel-500 block mb-1">上次同步时间</label>
                <input type="text" value={hikvisionSyncInfo.lastSyncTime} readOnly className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 text-steel-600" />
              </div>
              <div>
                <label className="text-xs text-steel-500 block mb-1">同步范围</label>
                <select value={syncRegion} onChange={(e) => setSyncRegion(e.target.value)} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none bg-white">
                  <option value="全部设备">全部设备</option>
                  {hikvisionSyncInfo.regions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {syncing && (
                <div className="space-y-2">
                  <p className="text-sm text-primary-600">正在同步设备数据，请稍候...</p>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full bg-primary-500 animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              )}

              {syncResult && (
                <div className="bg-slate-50 rounded-lg border border-steel-100 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-emerald-700"><i className="ri-check-line" />新增设备数：{syncResult.newCount}</div>
                  <div className="flex items-center gap-2 text-sm text-primary-700"><i className="ri-refresh-line" />更新设备数：{syncResult.updateCount}</div>
                  <div className="flex items-center gap-2 text-sm text-red-600"><i className="ri-close-line" />同步失败数：{syncResult.failCount}</div>
                  {syncResult.failReason && <div className="text-xs text-red-500 mt-1">失败原因：{syncResult.failReason}</div>}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-2">
              <button onClick={handleSyncClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                {syncResult ? '确认' : '取消'}
              </button>
              {!syncResult && (
                <button onClick={handleStartSync} disabled={syncing} className="px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  开始同步
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && previewDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreviewModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[800px] overflow-hidden">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-steel-800">设备视频预览</h3>
              </div>
              <button onClick={() => setPreviewModalOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-steel-400 block mb-0.5">设备名称</label><span className="text-sm text-steel-700 font-medium">{previewDevice.deviceName}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">设备序列号</label><span className="text-sm text-steel-700 font-mono">{previewDevice.serialNo}</span></div>
                <div><label className="text-xs text-steel-400 block mb-0.5">安装位置</label><span className="text-sm text-steel-700">{previewDevice.installLocation}</span></div>
              </div>

              {/* Video Preview Area */}
              <div className="relative rounded-lg overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
                <img
                  src="https://readdy.ai/api/search-image?query=Industrial%20construction%20site%20surveillance%20camera%20view%20with%20steel%20structures%20and%20workers%20in%20safety%20gear%20under%20bright%20lighting%20conditions%2C%20security%20camera%20perspective%20with%20timestamp%20overlay%2C%20high%20resolution%20CCTV%20style%20footage%20with%20grid%20lines&width=800&height=450&seq=monitor-preview-main&orientation=landscape"
                  alt={previewDevice.deviceName}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between">
                  <span className="text-xs text-white/80 bg-black/50 px-2 py-0.5 rounded">{previewDevice.deviceName}</span>
                  <span className="text-xs text-white/80 bg-black/50 px-2 py-0.5 rounded font-mono">
                    {new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                {/* Status */}
                <div className="absolute bottom-3 left-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                    previewStatus === '播放中' ? 'bg-emerald-500/80 text-white' :
                    previewStatus === '加载中' ? 'bg-amber-500/80 text-white' :
                    'bg-red-500/80 text-white'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${previewStatus === '播放中' ? 'bg-white animate-pulse' : 'bg-white'}`} />
                    {previewStatus}
                  </span>
                </div>
                {previewStatus === '信号中断' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <div className="text-center">
                      <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2 text-white/60"><i className="ri-signal-wifi-off-line text-3xl" /></div>
                      <p className="text-white text-sm font-medium">信号中断</p>
                      <p className="text-white/60 text-xs mt-1">设备不可达或网络连接异常</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-steel-500">
                  <span>播放状态：</span>
                  <span className={`font-medium ${previewStatus === '播放中' ? 'text-emerald-600' : previewStatus === '加载中' ? 'text-amber-600' : 'text-red-600'}`}>{previewStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPreviewStatus('信号中断');
                    }}
                    className="px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                  >
                    模拟中断
                  </button>
                  <button
                    onClick={() => {
                      setPreviewStatus('加载中');
                      setTimeout(() => setPreviewStatus('播放中'), 1000);
                    }}
                    className="px-3 py-1.5 text-xs text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50 cursor-pointer whitespace-nowrap"
                  >
                    重新连接
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-steel-200 flex justify-end">
              <button onClick={() => setPreviewModalOpen(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Button (floating) */}
      <button
        onClick={() => setSyncModalOpen(true)}
        className="fixed bottom-8 right-8 z-30 flex items-center gap-2 px-4 py-3 text-sm text-white rounded-full shadow-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
      >
        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-cloud-line" /></div>
        设备同步
      </button>
    </Layout>
  );
}