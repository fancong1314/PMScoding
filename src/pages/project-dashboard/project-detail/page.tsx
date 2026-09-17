import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInfoTab from './components/BasicInfoTab';
import ProgressTab from './components/ProgressTab';
import VideoMonitorTab from './components/VideoMonitorTab';
import InvestmentTab from './components/InvestmentTab';
import { projectOptions } from '@/mocks/projectDetailMocks';

const tabs = [
  { key: 'basic', label: '项目基本信息', icon: 'ri-profile-line' },
  { key: 'progress', label: '项目进度', icon: 'ri-bar-chart-grouped-line' },
  { key: 'workers', label: '施工人员信息', icon: 'ri-team-line' },
  { key: 'quality', label: '质量安全问题', icon: 'ri-shield-check-line' },
  { key: 'video', label: '现场视频监控', icon: 'ri-vidicon-line' },
  { key: 'investment', label: '项目投资情况', icon: 'ri-funds-line' },
];

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [fading, setFading] = useState(false);
  const [currentProject, setCurrentProject] = useState(projectOptions[0]);
  const [currentDate, setCurrentDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    setCurrentDate(
      `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日 ${weekdays[now.getDay()]}`
    );
  }, []);

  const handleTabChange = useCallback((key: string) => {
    if (key === activeTab) return;
    setFading(true);
    setTimeout(() => {
      setActiveTab(key);
      setFading(false);
    }, 300);
  }, [activeTab]);

  const handleProjectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = projectOptions.find((p) => p.id === e.target.value);
    if (selected) setCurrentProject(selected);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)' }}
    >
      {/* Header */}
      <div
        className="h-12 flex-shrink-0 flex items-center justify-between px-4"
        style={{ background: 'rgba(10,22,40,0.95)', borderBottom: '1px solid rgba(0,212,255,0.12)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{currentDate}</span>
        </div>
        <h1
          className="text-base font-bold tracking-wider absolute left-1/2 -translate-x-1/2"
          style={{ color: '#00d4ff' }}
        >
          项目详细信息看板
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={currentProject.id}
            onChange={handleProjectChange}
            className="h-7 px-2 text-xs rounded outline-none text-slate-200 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}
          >
            {projectOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.name}（{p.number}）</option>
            ))}
          </select>
          <button
            onClick={() => navigate('/project-dashboard/panorama-cockpit')}
            className="h-7 px-3 text-xs rounded text-white cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90"
            style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)' }}
          >
            返回
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden" style={{ minHeight: 0 }}>
        {/* Left nav */}
        <div
          className="w-[140px] flex-shrink-0 flex flex-col py-2 gap-1 overflow-y-auto"
          style={{ background: 'rgba(8,18,35,0.9)', borderRight: '1px solid rgba(0,212,255,0.08)' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 mx-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,229,200,0.08))',
                        border: '1px solid rgba(0,212,255,0.3)',
                        boxShadow: '0 0 12px rgba(0,212,255,0.1)',
                      }
                    : { border: '1px solid transparent' }
                }
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={tab.icon} />
                </div>
                <span className="text-[13px] leading-tight text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right content */}
        <div className="flex-1 overflow-auto p-3" style={{ minHeight: 0 }}>
          <div className={`transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}>
            {activeTab === 'basic' && <BasicInfoTab project={currentProject} />}
            {activeTab === 'progress' && <ProgressTab />}
            {activeTab === 'workers' && (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4" style={{ background: 'rgba(0,212,255,0.08)' }}>
                  <i className="ri-team-line text-3xl" style={{ color: '#00d4ff' }} />
                </div>
                <p className="text-sm text-slate-400 mb-1">施工人员信息</p>
                <p className="text-xs text-slate-600">功能开发中，敬请期待...</p>
              </div>
            )}
            {activeTab === 'quality' && (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4" style={{ background: 'rgba(0,212,255,0.08)' }}>
                  <i className="ri-shield-check-line text-3xl" style={{ color: '#00d4ff' }} />
                </div>
                <p className="text-sm text-slate-400 mb-1">质量安全问题</p>
                <p className="text-xs text-slate-600">功能开发中，敬请期待...</p>
              </div>
            )}
            {activeTab === 'video' && <VideoMonitorTab />}
            {activeTab === 'investment' && <InvestmentTab />}
          </div>
        </div>
      </div>
    </div>
  );
}