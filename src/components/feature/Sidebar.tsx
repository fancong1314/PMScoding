import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed';

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  grandchildren?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: 'project-plan',
    label: '年度计划管理',
    icon: 'ri-calendar-todo-line',
    children: [
      { key: 'declaration', label: '年度计划申报', icon: 'ri-file-list-3-line', path: '/project-plan/declaration' },
      { key: 'plan-review', label: '年度计划会审', icon: 'ri-search-2-line', path: '/project-plan/plan-review/zhongte-stage' },
      { key: 'leader-review', label: '项目部审查', icon: 'ri-user-star-line', path: '/project-plan/leader-review' },
      { key: 'plan-deferral', label: '年度计划暂缓', icon: 'ri-time-line', path: '/project-plan/plan-deferral' },
      { key: 'plan-archive', label: '计划资料管理', icon: 'ri-folder-chart-line', path: '/project-plan/plan-archive' },
      { key: 'payment-report', label: '年度付款计划报表', icon: 'ri-money-cny-box-line', path: '/project-plan/payment-report' },
    ],
  },
  {
    key: 'project-argument',
    label: '项目立项管理',
    icon: 'ri-survey-line',
    children: [
      { key: 'argument-apply', label: '项目论证申请', icon: 'ri-file-edit-line', path: '/project-argument/apply' },
      { key: 'opinion-sign', label: '论证意见签署', icon: 'ri-draft-line', path: '/project-argument/opinion-sign' },
      { key: 'init-declaration', label: '项目立项申请', icon: 'ri-file-list-3-line', path: '/project-initiation/declaration' },
      { key: 'init-plan-review', label: '项目立项会审', icon: 'ri-search-2-line', path: '/project-initiation/plan-review/zhongte-stage' },
      { key: 'init-leader-review', label: '项目立项签发', icon: 'ri-user-star-line', path: '/project-initiation/leader-review' },
      { key: 'init-plan-deferral', label: '项目延期暂缓', icon: 'ri-time-line', path: '/project-initiation/plan-deferral' },
    ],
  },
  {
    key: 'project-approval',
    label: '项目立项管理留存',
    icon: 'ri-folder-add-line',
    children: [
      { key: 'approval-number', label: '立项号管理', icon: 'ri-barcode-line', path: '/project-plan/project-number' },
      { key: 'approval-apply', label: '项目立项申请', icon: 'ri-file-edit-line', path: '/project-plan/apply' },
      { key: 'approval-review', label: '项目立项审核', icon: 'ri-check-double-line', path: '/project-plan/review' },
      { key: 'approval-issuance', label: '项目立项签发', icon: 'ri-send-plane-line', path: '/project-plan/issuance' },
      { key: 'approval-deferral', label: '项目立项变更', icon: 'ri-time-line', path: '/project-plan/deferral' },
    ],
  },
  {
    key: 'project-prepare',
    label: '项目准备管理',
    icon: 'ri-tools-line',
    children: [
      { key: 'project-management', label: '项目成员管理', icon: 'ri-team-line', path: '/project-prepare/project-management' },
      { key: 'approval-management', label: '项目报批报建管理', icon: 'ri-building-2-line', path: '/project-prepare/approval' },
      { key: 'preliminary-material', label: '前期资料管理', icon: 'ri-folder-chart-line', path: '/project-prepare/preliminary-material' },
      { key: 'preliminary-design', label: '初步设计审查', icon: 'ri-draft-line', path: '/project-prepare/preliminary-design' },
      { key: 'estimate-management', label: '概算管理', icon: 'ri-calculator-line', path: '/project-prepare/estimate-management' },
    ],
  },
  {
    key: 'project-contract',
    label: '项目合同管理',
    icon: 'ri-file-text-line',
    children: [
      {
        key: 'contract-requirement',
        label: '工程需求管理',
        icon: 'ri-file-add-line',
        grandchildren: [
          { key: 'contract-requirement-declaration', label: '工程需求申报', icon: 'ri-file-list-3-line', path: '/project-contract/requirement' },
          { key: 'contract-undertake', label: '主管单位承办', icon: 'ri-user-settings-line', path: '/project-contract/undertake' },
          { key: 'contract-bid-review', label: '合同商务标书审核', icon: 'ri-draft-line', path: '/project-contract/bid-review' },
        ],
      },
      { key: 'contract-document', label: '合同资料管理', icon: 'ri-folder-chart-line', path: '/project-contract/document' },
      { key: 'contract-progress', label: '合同进度管理', icon: 'ri-bar-chart-grouped-line', path: '/project-contract/progress' },
      { key: 'contract-execution', label: '合同执行管理', icon: 'ri-hammer-line', path: '/project-contract/execution' },
      {
        key: 'contract-business-exec',
        label: '合同业务执行管理',
        icon: 'ri-briefcase-line',
        grandchildren: [
          { key: 'contract-signboard', label: '合同举牌验收', icon: 'ri-check-double-line', path: '/project-contract/signboard' },
          { key: 'contract-subcontract', label: '合同施工分包审核', icon: 'ri-user-search-line', path: '/project-contract/subcontract' },
          { key: 'contract-epc-equipment', label: 'EPC合同设备验收', icon: 'ri-tools-line', path: '/project-contract/epc-equipment' },
          { key: 'contract-deferral', label: '合同超期申请', icon: 'ri-time-line', path: '/project-contract/deferral' },
          { key: 'contract-change-pricing', label: '合同变更核价管理', icon: 'ri-price-tag-3-line', path: '/project-contract/change-pricing' },
          { key: 'contract-exam-exemption', label: '合同超期免考申请', icon: 'ri-shield-check-line', path: '/project-contract/exam-exemption' },
          { key: 'contract-quality-dispute', label: '合同质量异议', icon: 'ri-error-warning-line', path: '/project-contract/quality-dispute' },
        ],
      },
      { key: 'contract-payment-declaration', label: '工程款申报', icon: 'ri-bank-card-line', path: '/project-contract/payment-declaration' },
      { key: 'contract-payment-reimbursement', label: '合同款项报支', icon: 'ri-money-cny-circle-line', path: '/project-contract/payment-reimbursement' },
    ],
  },
  {
    key: 'participant',
    label: '参建方管理',
    icon: 'ri-group-line',
    children: [
      { key: 'negative-score', label: '负面积分管理', icon: 'ri-subtract-line', path: '/participant/negative-score' },
      { key: 'attendance', label: '施工考勤管理', icon: 'ri-calendar-check-line', path: '/participant/attendance' },
      { key: 'construction-member', label: '施工成员管理', icon: 'ri-user-star-line', path: '/participant/construction-member' },
      { key: 'video-surveillance', label: '施工视频监控', icon: 'ri-vidicon-line', path: '/participant/video-surveillance' },
    ],
  },
  {
    key: 'project-execute',
    label: '项目执行管理',
    icon: 'ri-dashboard-3-line',
    children: [
      { key: 'execute-progress', label: '项目进度管理', icon: 'ri-bar-chart-grouped-line', path: '/project-execute/progress' },
      { key: 'execute-quality-safety', label: '质量安全管理', icon: 'ri-shield-check-line', path: '/project-execute/quality-safety' },
      { key: 'execute-dangerous-work', label: '危险作业管理', icon: 'ri-alarm-warning-line', path: '/project-execute/dangerous-work' },
      { key: 'execute-it-launch', label: '信息化项目上线申请', icon: 'ri-rocket-line', path: '/project-execute/it-launch' },
      { key: 'execute-completion', label: '项目交竣工申请', icon: 'ri-building-4-line', path: '/project-execute/completion' },
      { key: 'execute-it-acceptance', label: '信息化项目验收申请', icon: 'ri-check-double-line', path: '/project-execute/it-acceptance' },
    ],
  },
  {
    key: 'project-close',
    label: '项目收尾管理',
    icon: 'ri-flag-line',
    children: [
      { key: 'close-early-eval', label: '项目提前后评价', icon: 'ri-file-search-line', path: '/project-close/early-evaluation' },
      { key: 'close-post-eval', label: '项目后评价', icon: 'ri-file-chart-line', path: '/project-close/post-evaluation' },
    ],
  },
  {
    key: 'project-dashboard',
    label: '项目看板报表',
    icon: 'ri-bar-chart-box-line',
    children: [
      { key: 'panorama-cockpit', label: '全景驾驶舱', icon: 'ri-dashboard-3-line', path: '/project-dashboard/panorama-cockpit' },
      { key: 'project-detail', label: '项目详细信息看板', icon: 'ri-profile-line', path: '/project-dashboard/project-detail' },
      { key: 'investment-report', label: '年度计划投资报表', icon: 'ri-funds-line', path: '/project-dashboard/investment-report' },
      { key: 'argument-eval-dashboard', label: '论证后评价看板', icon: 'ri-dashboard-3-line', path: '/project-dashboard/argument-evaluation' },
    ],
  },
  {
    key: 'project-archive',
    label: '项目档案管理',
    icon: 'ri-archive-line',
    children: [
      { key: 'archive-config', label: '项目档案配置', icon: 'ri-settings-3-line', path: '/project-archive/config' },
      { key: 'archive-management', label: '项目档案管理', icon: 'ri-folder-chart-line', path: '/project-archive/management' },
    ],
  },
  {
    key: 'project-config',
    label: '系统配置管理',
    icon: 'ri-settings-3-line',
    children: [
      { key: 'monitor-config', label: '合同监控配置', icon: 'ri-vidicon-line', path: '/system-config/monitor-config' },
    ],
  },
];

const EXPANDED_KEY = 'ng_sidebar_expanded';

function getInitialExpanded(): string[] {
  try {
    const stored = localStorage.getItem(EXPANDED_KEY);
    return stored ? JSON.parse(stored) : ['project-plan', 'project-approval'];
  } catch {
    return ['project-plan', 'project-approval'];
  }
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed, toggle } = useSidebarCollapsed();
  const [expandedKeys, setExpandedKeys] = useState<string[]>(getInitialExpanded);

  // Persist expanded keys
  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_KEY, JSON.stringify(expandedKeys));
    } catch {
      // ignore
    }
  }, [expandedKeys]);

  // Auto-expand parent of active route on navigation
  useEffect(() => {
    setExpandedKeys((prev) => {
      const toAdd: string[] = [];
      menuItems.forEach((item) => {
        const childActive = item.children?.some(
          (child) =>
            (child.path && location.pathname.startsWith(child.path)) ||
            child.grandchildren?.some((gc) => gc.path && location.pathname.startsWith(gc.path))
        );
        if (childActive && !prev.includes(item.key)) {
          toAdd.push(item.key);
        }
        item.children?.forEach((child) => {
          if (child.grandchildren?.some((gc) => gc.path && location.pathname.startsWith(gc.path))) {
            if (!prev.includes(child.key)) {
              toAdd.push(child.key);
            }
          }
        });
      });
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
  }, [location.pathname]);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const isParentActive = (item: MenuItem): boolean => {
    if (item.path) return isActive(item.path);
    const directMatch = item.children?.some((child) => child.path && isActive(child.path)) ?? false;
    if (directMatch) return true;
    return (
      item.children?.some(
        (child) =>
          child.grandchildren?.some((gc) => gc.path && isActive(gc.path)) ?? false
      ) ?? false
    );
  };

  const isSubParentActive = (item: MenuItem) => {
    if (item.path) return isActive(item.path);
    return item.grandchildren?.some((gc) => gc.path && isActive(gc.path)) ?? false;
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full text-white transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-16' : 'w-56'
      }`}
      style={{ backgroundColor: '#0f1c38' }}
    >
      {/* Logo Area */}
      <div
        className="h-14 flex items-center px-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            南
          </div>
        </div>
        {!collapsed && (
          <span className="ml-2 text-sm font-semibold whitespace-nowrap overflow-hidden text-slate-100">
            南钢工程一体化
          </span>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {menuItems.map((item) => (
          <div key={item.key}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.key)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                    isParentActive(item)
                      ? 'text-primary-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={
                    isParentActive(item)
                      ? { backgroundColor: 'rgba(59,130,246,0.12)' }
                      : undefined
                  }
                  onMouseEnter={(e) => {
                    if (!isParentActive(item)) {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isParentActive(item)) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '';
                    }
                  }}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={item.icon} />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="ml-2 flex-1 text-left whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i
                          className={`ri-arrow-down-s-line transition-transform text-xs ${
                            expandedKeys.includes(item.key) ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </>
                  )}
                </button>
                {!collapsed && expandedKeys.includes(item.key) && (
                  <div>
                    {item.children.map((child) =>
                      child.grandchildren ? (
                        <div key={child.key}>
                          <button
                            onClick={() => toggleExpand(child.key)}
                            className={`w-full flex items-center pl-10 pr-3 py-2 text-sm transition-colors cursor-pointer ${
                              isSubParentActive(child)
                                ? 'text-primary-300'
                                : 'text-slate-500 hover:text-slate-200'
                            }`}
                            style={
                              isSubParentActive(child)
                                ? { backgroundColor: 'rgba(59,130,246,0.10)' }
                                : undefined
                            }
                            onMouseEnter={(e) => {
                              if (!isSubParentActive(child))
                                (e.currentTarget as HTMLElement).style.backgroundColor =
                                  'rgba(255,255,255,0.04)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSubParentActive(child))
                                (e.currentTarget as HTMLElement).style.backgroundColor = '';
                            }}
                          >
                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                              <i className={child.icon} />
                            </div>
                            <span className="ml-2 flex-1 text-left whitespace-nowrap overflow-hidden">
                              {child.label}
                            </span>
                            <div className="w-4 h-4 flex items-center justify-center">
                              <i
                                className={`ri-arrow-down-s-line transition-transform text-xs ${
                                  expandedKeys.includes(child.key) ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>
                          {expandedKeys.includes(child.key) && (
                            <div>
                              {child.grandchildren.map((gc) => (
                                <button
                                  key={gc.key}
                                  onClick={() => gc.path && navigate(gc.path)}
                                  className={`w-full flex items-center pl-14 pr-3 py-1.5 text-xs transition-colors cursor-pointer ${
                                    gc.path && isActive(gc.path)
                                      ? 'text-primary-400 font-medium'
                                      : 'text-slate-500 hover:text-slate-200'
                                  }`}
                                  style={
                                    gc.path && isActive(gc.path)
                                      ? {
                                          backgroundColor: 'rgba(59,130,246,0.15)',
                                          borderRight: '2px solid #3b82f6',
                                        }
                                      : undefined
                                  }
                                  onMouseEnter={(e) => {
                                    if (!(gc.path && isActive(gc.path)))
                                      (e.currentTarget as HTMLElement).style.backgroundColor =
                                        'rgba(255,255,255,0.04)';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!(gc.path && isActive(gc.path)))
                                      (e.currentTarget as HTMLElement).style.backgroundColor = '';
                                  }}
                                >
                                  <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                                    <i className={gc.icon} />
                                  </div>
                                  <span className="ml-2 whitespace-nowrap overflow-hidden">
                                    {gc.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          key={child.key}
                          onClick={() => child.path && navigate(child.path)}
                          className={`w-full flex items-center pl-10 pr-3 py-2 text-sm transition-colors cursor-pointer ${
                            child.path && isActive(child.path)
                              ? 'text-primary-400 font-medium'
                              : 'text-slate-500 hover:text-slate-200'
                          }`}
                          style={
                            child.path && isActive(child.path)
                              ? {
                                  backgroundColor: 'rgba(59,130,246,0.15)',
                                  borderRight: '2px solid #3b82f6',
                                }
                              : undefined
                          }
                          onMouseEnter={(e) => {
                            if (!(child.path && isActive(child.path))) {
                              (e.currentTarget as HTMLElement).style.backgroundColor =
                                'rgba(255,255,255,0.04)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!(child.path && isActive(child.path))) {
                              (e.currentTarget as HTMLElement).style.backgroundColor = '';
                            }
                          }}
                        >
                          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            <i className={child.icon} />
                          </div>
                          <span className="ml-2 whitespace-nowrap overflow-hidden">{child.label}</span>
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => item.path && navigate(item.path)}
                className={`w-full flex items-center px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                  item.path && isActive(item.path)
                    ? 'text-primary-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={
                  item.path && isActive(item.path)
                    ? { backgroundColor: 'rgba(59,130,246,0.12)' }
                    : undefined
                }
                onMouseEnter={(e) => {
                  if (!(item.path && isActive(item.path))) {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(item.path && isActive(item.path))) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '';
                  }
                }}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className={item.icon} />
                </div>
                {!collapsed && (
                  <span className="ml-2 whitespace-nowrap overflow-hidden">{item.label}</span>
                )}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={toggle}
        className="h-10 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 text-slate-500 hover:text-slate-300"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '';
        }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className={collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} />
        </div>
      </button>
    </aside>
  );
}