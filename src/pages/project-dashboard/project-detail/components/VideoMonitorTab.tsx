import { useState, useEffect } from 'react';
import { projectCameras } from '@/mocks/projectDetailMocks';
import type { CameraInfo } from '@/mocks/projectDetailMocks';

function getStatusColor(status: CameraInfo['status']) {
  if (status === 'online') return '#22c55e';
  if (status === 'offline') return '#ef4444';
  return '#eab308';
}

export default function VideoMonitorTab() {
  const allCameras = projectCameras.flatMap((c) => c.cameras);
  const [mainCamera, setMainCamera] = useState<CameraInfo>(allCameras[0]);
  const [subCameras, setSubCameras] = useState<CameraInfo[]>(allCameras.slice(1));
  const [currentTime, setCurrentTime] = useState('');

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

  const switchMainCamera = (camera: CameraInfo) => {
    setSubCameras((prev) => {
      const newSubs = prev.filter((c) => c.id !== camera.id);
      newSubs.unshift(mainCamera);
      return newSubs.slice(0, 5);
    });
    setMainCamera(camera);
  };

  return (
    <div className="flex flex-col gap-3 h-full" style={{ minHeight: 0 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3.5 rounded-full" style={{ background: '#00d4ff' }} />
          <h3 className="text-xs font-semibold text-white">现场视频监控</h3>
        </div>
        <div className="text-sm font-mono text-cyan-400 whitespace-nowrap flex items-center gap-1">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-time-line" /></div>
          {currentTime || '加载中...'}
        </div>
      </div>

      {/* Main + sub layout */}
      <div className="flex-1 flex gap-3" style={{ minHeight: 0 }}>
        {/* Main video area */}
        <div className="flex-1 flex flex-col gap-3" style={{ minHeight: 0 }}>
          {/* Primary Camera Feed */}
          <div
            className="relative rounded-lg overflow-hidden flex-1"
            style={{
              border: '1px solid rgba(0, 212, 255, 0.25)',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.08), 0 0 40px rgba(0, 212, 255, 0.04)',
              minHeight: 0,
            }}
          >
            {mainCamera.imageUrl ? (
              <img src={mainCamera.imageUrl} alt={mainCamera.name} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#0f1420' }}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center"><i className="ri-signal-wifi-off-line text-2xl text-slate-600" /></div>
                  <p className="text-slate-500 text-xs">无视频信号</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,14,26,0.3) 0%, rgba(10,14,26,0.05) 50%, rgba(10,14,26,0.4) 100%)' }} />
            {mainCamera.status === 'offline' && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(10,14,26,0.7)' }}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center"><i className="ri-signal-wifi-off-line text-2xl text-slate-600" /></div>
                  <p className="text-slate-500 text-xs">无视频信号</p>
                </div>
              </div>
            )}
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
              style={{ background: 'rgba(0,212,255,0.25)', backdropFilter: 'blur(4px)' }}
            >
              {mainCamera.name}
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded text-xs text-white whitespace-nowrap"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getStatusColor(mainCamera.status) }} />
                <span>{mainCamera.status === 'online' ? '在线' : mainCamera.status === 'offline' ? '离线' : '信号弱'}</span>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium whitespace-nowrap text-red-400"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                REC
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #00d4ff, #00e5c8, #ffb800, transparent)' }} />
          </div>

          {/* Sub Cameras Grid */}
          <div className="grid grid-cols-5 gap-3 flex-shrink-0">
            {subCameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => switchMainCamera(cam)}
                className="relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                style={{ border: '1px solid rgba(42,48,69,0.8)', aspectRatio: '16/10' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(0,212,255,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(42,48,69,0.8)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {cam.imageUrl ? (
                  <img src={cam.imageUrl} alt={cam.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#0f1420' }}>
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center"><i className="ri-signal-wifi-off-line text-lg text-slate-600" /></div>
                      <p className="text-slate-500 text-[10px]">无信号</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,14,26,0.2) 0%, rgba(10,14,26,0) 60%, rgba(10,14,26,0.5) 100%)' }} />
                {cam.status === 'offline' && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(10,14,26,0.7)' }}>
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center"><i className="ri-signal-wifi-off-line text-lg text-slate-600" /></div>
                      <p className="text-slate-500 text-[10px]">无信号</p>
                    </div>
                  </div>
                )}
                <div
                  className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis z-10"
                  style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: getStatusColor(cam.status) }} />
                    <span className="truncate">{cam.name}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right info panel */}
        <div className="w-48 flex-shrink-0 flex flex-col gap-3">
          <div className="rounded-lg p-3" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-information-line text-cyan-400" /></div>
              <span className="text-xs font-semibold text-slate-300">监控信息</span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-slate-500 mb-0.5">项目</p>
                <p className="text-xs text-slate-200 font-medium">新建工业厂房项目</p>
              </div>
              <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">监控点位</span>
                  <span className="text-sm font-bold text-white">{allCameras.length}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-slate-500">在线</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">{allCameras.filter((c) => c.status === 'online').length}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-[10px] text-slate-500">离线</span>
                  </div>
                  <span className="text-sm font-bold text-red-400">{allCameras.filter((c) => c.status === 'offline').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <span className="text-[10px] text-slate-500">信号弱</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-400">{allCameras.filter((c) => c.status === 'weak').length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-3" style={{ background: 'rgba(16,42,67,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-signal-wifi-line text-cyan-400" /></div>
              <span className="text-xs font-semibold text-slate-300">状态图例</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-slate-400">在线</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-slate-400">离线</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-xs text-slate-400">信号弱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}