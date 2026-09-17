import { useState, useEffect } from 'react';
import Layout from '@/components/feature/Layout';
import { mockMonitorContracts, type MonitorContract, type CameraInfo } from '@/mocks/participantManagementMocks';

function SurveillanceContent() {
  const [selectedContractId, setSelectedContractId] = useState<number>(mockMonitorContracts[0].id);
  const [mainCamera, setMainCamera] = useState<CameraInfo | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  const selectedContract = mockMonitorContracts.find((c) => c.id === selectedContractId) || mockMonitorContracts[0];
  const subCameras = selectedContract.cameras.filter((c) => c.id !== (mainCamera?.id ?? selectedContract.cameras[0].id));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString('zh-CN', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedContract.cameras.length > 0) {
      const mainStillValid = selectedContract.cameras.find((c) => c.id === mainCamera?.id);
      if (!mainStillValid) {
        setMainCamera(selectedContract.cameras[0]);
      }
    }
  }, [selectedContract, mainCamera]);

  const switchMainCamera = (camera: CameraInfo) => {
    setMainCamera(camera);
  };

  const getStatusColor = (status: CameraInfo['status']) => {
    if (status === 'online') return '#22c55e';
    if (status === 'offline') return '#ef4444';
    return '#eab308';
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="p-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-0.5">施工视频监控</h2>
            <p className="text-xs text-slate-400">实时施工现场视频监控看板</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 whitespace-nowrap">选择合同：</label>
              <select
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(Number(e.target.value))}
                className="h-9 px-3 text-sm rounded-md outline-none cursor-pointer border-0 text-slate-200"
                style={{ backgroundColor: '#1a1f35', border: '1px solid #2a3045' }}
              >
                {mockMonitorContracts.map((c) => (
                  <option key={c.id} value={c.id}>{c.contractNo} - {c.contractName}</option>
                ))}
              </select>
            </div>
            <div className="text-sm font-mono text-cyan-400 whitespace-nowrap" style={{ minWidth: '200px' }}>
              <div className="w-4 h-4 inline-flex items-center justify-center mr-1"><i className="ri-time-line" /></div>
              {currentTime || '加载中...'}
            </div>
          </div>
        </div>

        {/* Main + Sidebar Layout */}
        <div className="flex gap-4">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Primary Camera Feed */}
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                border: '1px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.08), 0 0 40px rgba(56, 189, 248, 0.04)',
                aspectRatio: '16/9',
              }}
            >
              {mainCamera && mainCamera.imageUrl ? (
                <img src={mainCamera.imageUrl} alt={mainCamera.name} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
              ) : null}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,14,26,0.3) 0%, rgba(10,14,26,0.05) 50%, rgba(10,14,26,0.4) 100%)' }} />
              {mainCamera && mainCamera.status === 'offline' && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(10,14,26,0.7)' }}>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center"><i className="ri-signal-wifi-off-line text-2xl text-slate-600" /></div>
                    <p className="text-slate-500 text-xs">无视频信号</p>
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3 px-3 py-1 rounded text-xs font-medium text-white whitespace-nowrap" style={{ backgroundColor: 'rgba(6,182,212,0.35)', backdropFilter: 'blur(4px)' }}>
                {selectedContract.contractName}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-3">
                {mainCamera && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded text-xs text-white whitespace-nowrap" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(mainCamera.status) }} />
                    <span>{mainCamera.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium whitespace-nowrap text-red-400" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  REC
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #06b6d4, #22c55e, #eab308, transparent)' }} />
            </div>

            {/* Sub Cameras Grid */}
            <div className="grid grid-cols-3 gap-3">
              {subCameras.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => switchMainCamera(cam)}
                  className="relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                  style={{ border: '1px solid rgba(42,48,69,0.8)', aspectRatio: '16/10' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(56,189,248,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(42,48,69,0.8)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {cam.imageUrl ? (
                    <img src={cam.imageUrl} alt={cam.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#0f1420' }}>
                      <div className="text-center">
                        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(56,189,248,0.08)' }}>
                          <div className="w-6 h-6 flex items-center justify-center"><i className="ri-camera-line text-xl text-slate-500 group-hover:text-cyan-400 transition-colors" /></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,14,26,0.2) 0%, rgba(10,14,26,0) 60%, rgba(10,14,26,0.5) 100%)' }} />
                  {cam.status === 'offline' && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(10,14,26,0.7)' }}>
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center"><i className="ri-signal-wifi-off-line text-lg text-slate-600" /></div>
                        <p className="text-slate-500 text-[10px]">无信号</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis z-10" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)' }}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: getStatusColor(cam.status) }} />
                      <span className="truncate">{cam.name}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded text-[10px] text-cyan-400 whitespace-nowrap z-10" style={{ backgroundColor: 'rgba(6,182,212,0.2)' }}>
                    点击切换
                  </div>
                </button>
              ))}
              {Array.from({ length: Math.max(0, 6 - subCameras.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="rounded-lg" style={{ border: '1px dashed rgba(42,48,69,0.4)', aspectRatio: '16/10', backgroundColor: 'rgba(15,20,32,0.5)' }} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-64 flex-shrink-0 flex flex-col gap-3">
            <div className="rounded-lg p-4" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-information-line text-cyan-400" /></div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">监控信息</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <p className="text-[11px] text-slate-500 mb-0.5">合同名称</p>
                  <p className="text-xs text-slate-200 font-medium leading-tight">{selectedContract.contractName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-0.5">合同号</p>
                  <p className="text-xs text-slate-300 font-mono">{selectedContract.contractNo}</p>
                </div>
                <div className="pt-2" style={{ borderTop: '1px solid #1e293b' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-slate-500">监控点位总数</span>
                    <span className="text-sm font-bold text-white">{selectedContract.totalCameras}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[11px] text-slate-500">在线点位</span>
                    </div>
                    <span className="text-sm font-bold text-green-400">{selectedContract.onlineCount}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[11px] text-slate-500">离线点位</span>
                    </div>
                    <span className="text-sm font-bold text-red-400">{selectedContract.offlineCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <span className="text-[11px] text-slate-500">信号弱</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-400">{selectedContract.cameras.filter((c) => c.status === 'weak').length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-signal-wifi-line text-cyan-400" /></div>
                <span className="text-xs font-semibold text-slate-300">状态图例</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-slate-400">在线 — 画面正常</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-slate-400">离线 — 无信号</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-xs text-slate-400">信号弱 — 画面不稳定</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-settings-3-line text-cyan-400" /></div>
                <span className="text-xs font-semibold text-slate-300">快捷操作</span>
              </div>
              <div className="space-y-1.5">
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-fullscreen-line text-cyan-400" /></div>
                  全屏模式
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-screenshot-2-line text-cyan-400" /></div>
                  截图保存
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-record-circle-line text-cyan-400" /></div>
                  录像回放
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-download-2-line text-cyan-400" /></div>
                  导出录像
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoSurveillancePage() {
  const [isFullscreen, setIsFullscreen] = useState(true);

  if (!isFullscreen) {
    return (
      <Layout mainClassName="flex-1 p-0">
        <div className="relative">
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)' }}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-fullscreen-line text-cyan-400" /></div>
            全屏
          </button>
          <SurveillanceContent />
        </div>
      </Layout>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setIsFullscreen(false)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-fullscreen-exit-line text-cyan-400" /></div>
          退出全屏
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <SurveillanceContent />
      </div>
    </div>
  );
}