import { useState } from 'react';

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-steel-200 flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-steel-500">
        <div className="w-4 h-4 flex items-center justify-center">
          <i className="ri-home-4-line" />
        </div>
        <span className="mx-1.5">/</span>
        <span className="text-steel-700 font-medium">年度计划管理</span>
        <span className="mx-1.5">/</span>
        <span className="text-steel-900 font-medium">年度计划申报</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-steel-100 transition-colors">
          <i className="ri-notification-3-line text-steel-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-steel-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium">
              管
            </div>
            <span className="text-sm text-steel-700">管理员</span>
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-steel-400" />
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-steel-200 py-1 z-50">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-steel-700 hover:bg-steel-50 transition-colors">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-user-line" />
                </div>
                个人中心
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-steel-700 hover:bg-steel-50 transition-colors">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-settings-4-line" />
                </div>
                系统设置
              </button>
              <div className="border-t border-steel-100 my-1" />
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-logout-box-r-line" />
                </div>
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}