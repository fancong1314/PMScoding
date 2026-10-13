import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed';

interface LayoutProps {
  children: React.ReactNode;
  mainClassName?: string;
}

const pathMap: Record<string, { title: string; parent?: string; grandParent?: string }> = {
  '/': { title: '首页' },
  '/project-plan/declaration': { title: '年度计划申报', parent: '年度计划管理' },
  '/project-plan/declaration/form': { title: '新增年度计划', parent: '年度计划申报', grandParent: '年度计划管理' },
  '/project-plan/declaration/form/new': { title: '新建类申报', parent: '年度计划申报', grandParent: '年度计划管理' },
  '/project-plan/declaration/form/tech': { title: '技改类申报', parent: '年度计划申报', grandParent: '年度计划管理' },
  '/project-plan/declaration/form/overhaul': { title: '营缮类申报', parent: '年度计划申报', grandParent: '年度计划管理' },
  '/project-plan/declaration/form/minor': { title: '零固类申报', parent: '年度计划申报', grandParent: '年度计划管理' },
  '/project-plan/approval': { title: '年度计划审批', parent: '年度计划管理' },
  '/project-plan/query': { title: '年度计划查询', parent: '年度计划管理' },
  '/project-plan/plan-review/zhongte-stage': { title: '年度计划会审', parent: '年度计划审查', grandParent: '年度计划管理' },
  '/project-plan/joint-opinion-sign': { title: '会审意见签署', parent: '年度计划审查', grandParent: '年度计划管理' },
  '/project-plan/leader-review': { title: '项目办呈送', parent: '年度计划审查', grandParent: '年度计划管理' },
  '/project-plan/plan-deferral': { title: '年度计划暂缓', parent: '年度计划管理' },
  '/project-plan/plan-archive': { title: '年度计划总览', parent: '年度计划管理' },
  '/project-plan/payment-report': { title: '年度付款计划报表', parent: '年度计划管理' },
  '/project-argument/apply': { title: '项目论证申请', parent: '项目立项管理' },
  '/project-argument/opinion-sign': { title: '论证意见签署', parent: '项目立项管理' },
  '/project-argument/opinion-sign/form': { title: '签署表单', parent: '论证意见签署', grandParent: '项目立项管理' },
  '/project-initiation/overview': { title: '项目总览', parent: '项目立项管理' },
  '/project-initiation/overview/detail': { title: '项目详情', parent: '项目总览', grandParent: '项目立项管理' },
  '/project-initiation/declaration': { title: '项目立项申请', parent: '项目立项管理' },
  '/project-initiation/declaration/form': { title: '新增项目立项', parent: '项目立项申请', grandParent: '项目立项管理' },
  '/project-initiation/declaration/form/new': { title: '新建类申请', parent: '项目立项申请', grandParent: '项目立项管理' },
  '/project-initiation/declaration/form/tech': { title: '技改类申请', parent: '项目立项申请', grandParent: '项目立项管理' },
  '/project-initiation/declaration/form/overhaul': { title: '营缮类申请', parent: '项目立项申请', grandParent: '项目立项管理' },
  '/project-initiation/declaration/form/minor': { title: '零固类申请', parent: '项目立项申请', grandParent: '项目立项管理' },
  '/project-initiation/office-prelim-review': { title: '项目立项初审', parent: '项目立项审查', grandParent: '项目立项管理' },
  '/project-initiation/plan-review/zhongte-stage': { title: '项目立项会审', parent: '项目立项审查', grandParent: '项目立项管理' },
  '/project-initiation/joint-opinion-sign': { title: '会审意见签署', parent: '项目立项审查', grandParent: '项目立项管理' },
  '/project-initiation/leader-review': { title: '项目立项签发', parent: '项目立项审查', grandParent: '项目立项管理' },
  '/project-initiation/plan-deferral': { title: '项目延期暂缓', parent: '项目立项管理' },
  '/project-initiation/plan-deferral/form': { title: '暂缓申请', parent: '项目延期暂缓', grandParent: '项目立项管理' },
  '/project-execute/quality-safety': { title: '质量安全管理', parent: '项目执行管理' },
  '/project-execute/quality-safety/issues': { title: '问题列表', parent: '质量安全管理', grandParent: '项目执行管理' },
  '/participant/negative-score': { title: '负面积分管理', parent: '参建方管理' },
  '/participant/negative-score/deduction-list': { title: '扣分明细', parent: '负面积分管理', grandParent: '参建方管理' },
  '/participant/attendance': { title: '施工考勤管理', parent: '参建方管理' },
  '/participant/construction-member': { title: '施工成员管理', parent: '参建方管理' },
  '/participant/construction-member/detail': { title: '施工成员详情', parent: '施工成员管理', grandParent: '参建方管理' },
  '/participant/video-surveillance': { title: '施工视频监控', parent: '参建方管理' },
  '/project-prepare/project-management': { title: '项目成员管理', parent: '项目准备管理' },
  '/project-prepare/project-management/members': { title: '项目成员列表', parent: '项目成员管理', grandParent: '项目准备管理' },
  '/project-prepare/estimate-management': { title: '项目概算管理', parent: '项目准备管理' },
  '/project-prepare/estimate-management/apply': { title: '概算修正申请', parent: '项目概算管理', grandParent: '项目准备管理' },
  '/project-prepare/estimate-management/cost-detail': { title: '费用明细', parent: '项目概算管理', grandParent: '项目准备管理' },
  '/project-prepare/approval': { title: '项目报批报建管理', parent: '项目准备管理' },
  '/project-prepare/approval/stage': { title: '报批报建阶段', parent: '项目报批报建管理', grandParent: '项目准备管理' },
  '/project-sporadic/requirement-plan': { title: '需求计划管理', parent: '零星工程项目管理' },
  '/project-sporadic/framework-contract': { title: '框架合同管理', parent: '零星工程项目管理' },
  '/project-sporadic/agreement-declare': { title: '零星协议单申报', parent: '零星工程项目管理' },
  '/project-sporadic/agreement-declare/form': { title: '协议单表单', parent: '零星协议单申报', grandParent: '零星工程项目管理' },
  '/project-sporadic/agreement-review': { title: '零星协议单审查', parent: '零星工程项目管理' },
  '/project-sporadic/agreement-issue': { title: '零星协议单签发', parent: '零星工程项目管理' },
  '/project-sporadic/agreement-issue/form': { title: '协议单签发', parent: '零星协议单签发', grandParent: '零星工程项目管理' },
  '/project-sporadic/payment': { title: '零星工程付款管理', parent: '零星工程项目管理' },
  '/project-sporadic/execution': { title: '零星工程执行管理', parent: '零星工程项目管理' },
  '/project-contract/progress': { title: '合同进度管理', parent: '项目合同管理' },
  '/project-contract/progress/reports': { title: '周报月报', parent: '合同进度管理', grandParent: '项目合同管理' },
  '/project-contract/progress/report-detail': { title: '周报月报详情', parent: '周报月报', grandParent: '项目合同管理' },
  '/project-contract/progress/wbs': { title: '任务拆解', parent: '合同进度管理', grandParent: '项目合同管理' },
  '/project-contract/progress/gantt': { title: '进度横道图', parent: '合同进度管理', grandParent: '项目合同管理' },
  '/project-contract/requirement': { title: '工程需求申报', parent: '工程需求管理', grandParent: '项目合同管理' },
  '/project-contract/requirement/demand-list': { title: '工程需求清单', parent: '工程需求申报', grandParent: '项目合同管理' },
  '/project-contract/requirement/form': { title: '需求新增/修改', parent: '工程需求申报', grandParent: '项目合同管理' },
  '/project-contract/requirement/detail': { title: '需求详情', parent: '工程需求申报', grandParent: '项目合同管理' },
  '/project-contract/undertake': { title: '主管单位承办', parent: '工程需求管理', grandParent: '项目合同管理' },
  '/project-contract/undertake/demand-list': { title: '工程需求清单', parent: '主管单位承办', grandParent: '项目合同管理' },
  '/project-contract/undertake/form': { title: '主管单位承办呈核', parent: '主管单位承办', grandParent: '项目合同管理' },
  '/project-contract/undertake/detail': { title: '需求详情', parent: '主管单位承办', grandParent: '项目合同管理' },
  '/project-contract/bid-review/detail': { title: '需求详情', parent: '合同商务标书审核', grandParent: '项目合同管理' },
  '/project-contract/execution': { title: '合同执行管理', parent: '项目合同管理' },
  '/project-contract/execution/list': { title: '合同执行列表', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/execution/approve': { title: '开工令审批', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/execution/detail': { title: '开工令详情', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/execution/handover-approve': { title: '交工审批', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/execution/handover-detail': { title: '交工申报详情', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/execution/stop-resume-form': { title: '停复工申请', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/execution/stop-resume-detail': { title: '停复工申报详情', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/execution/completion-project-review': { title: '项目部审核', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/execution/completion-manufacturing-review': { title: '制造部审核', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/execution/completion-detail': { title: '竣工申报详情', parent: '合同执行管理', grandParent: '项目合同管理' },
  '/project-contract/document': { title: '合同资料管理', parent: '项目合同管理' },
  '/project-contract/document/form': { title: '合同新增/修改', parent: '合同资料管理', grandParent: '项目合同管理' },
  '/project-contract/document/amount-change': { title: '合同金额异动列表', parent: '合同资料管理', grandParent: '项目合同管理' },
  '/project-contract/document/material-change': { title: '甲供材金额异动列表', parent: '合同资料管理', grandParent: '项目合同管理' },
  '/project-contract/signboard': { title: '合同举牌验收', parent: '合同业务执行管理', grandParent: '项目合同管理' },
  '/project-contract/signboard/management': { title: '工序预排与验收管理', parent: '合同举牌验收', grandParent: '合同业务执行管理' },
  '/project-contract/signboard/detail': { title: '验收结果详情', parent: '合同举牌验收', grandParent: '合同业务执行管理' },
  '/project-contract/deferral': { title: '合同超期申请', parent: '合同业务执行管理', grandParent: '项目合同管理' },
  '/project-contract/deferral/application-list': { title: '超期申请清单', parent: '合同超期申请', grandParent: '合同业务执行管理' },
  '/project-contract/deferral/project-form': { title: '项目组新增/审批', parent: '合同超期申请', grandParent: '合同业务执行管理' },
  '/project-contract/deferral/department-review': { title: '主管部门审核', parent: '合同超期申请', grandParent: '合同业务执行管理' },
  '/project-contract/deferral/detail': { title: '超期申请详情', parent: '合同超期申请', grandParent: '合同业务执行管理' },
  '/project-contract/change-pricing': { title: '合同变更核价管理', parent: '合同业务执行管理', grandParent: '项目合同管理' },
  '/project-contract/change-pricing/demand-list': { title: '工程需求清单', parent: '合同变更核价管理', grandParent: '合同业务执行管理' },
  '/project-contract/change-pricing/demand-form': { title: '需求新增/修改', parent: '合同变更核价管理', grandParent: '合同业务执行管理' },
  '/project-contract/change-pricing/demand-detail': { title: '需求详情', parent: '合同变更核价管理', grandParent: '合同业务执行管理' },
  '/project-contract/change-pricing/submit': { title: '主管单位承办呈核', parent: '合同变更核价管理', grandParent: '合同业务执行管理' },
  '/project-contract/payment-declaration': { title: '工程款申报', parent: '项目合同管理' },
  '/project-contract/payment-declaration/declaration-list': { title: '工程款申报清单', parent: '工程款申报', grandParent: '项目合同管理' },
  '/project-contract/payment-declaration/project-review': { title: '项目部审核', parent: '工程款申报', grandParent: '项目合同管理' },
  '/project-contract/payment-declaration/supervisory-review': { title: '主管部门审核', parent: '工程款申报', grandParent: '项目合同管理' },
  '/project-contract/payment-declaration/finance-review': { title: '财务部审核', parent: '工程款申报', grandParent: '项目合同管理' },
  '/project-contract/payment-declaration/detail': { title: '申报详情', parent: '工程款申报', grandParent: '项目合同管理' },
  '/project-contract/payment-reimbursement': { title: '合同款项报支', parent: '项目合同管理' },
  '/project-contract/payment-reimbursement/reimbursement-list': { title: '合同款项报支清单', parent: '合同款项报支', grandParent: '项目合同管理' },
  '/project-contract/payment-reimbursement/prepayment-form': { title: '新增/编辑预付款报支', parent: '合同款项报支', grandParent: '项目合同管理' },
  '/project-contract/payment-reimbursement/warranty-form': { title: '新增/编辑质保金报支', parent: '合同款项报支', grandParent: '项目合同管理' },
  '/project-contract/payment-reimbursement/settlement-form': { title: '新增/编辑结算报支', parent: '合同款项报支', grandParent: '项目合同管理' },
  '/project-close/early-evaluation': { title: '项目提前后评价', parent: '项目收尾管理' },
  '/project-close/post-evaluation': { title: '项目后评价', parent: '项目收尾管理' },
  '/project-close/post-evaluation/catalog': { title: '评价目录', parent: '项目后评价', grandParent: '项目收尾管理' },
  '/project-close/post-evaluation/self-eval': { title: '自评', parent: '项目后评价', grandParent: '项目收尾管理' },
  '/project-close/post-evaluation/prof-eval': { title: '专评', parent: '项目后评价', grandParent: '项目收尾管理' },
  '/project-close/post-evaluation/comp-eval': { title: '综评', parent: '项目后评价', grandParent: '项目收尾管理' },
  '/engineering-think-tank/knowledge-base': { title: '知识库管理', parent: '工程智库' },
  '/project-archive/config': { title: '项目档案配置', parent: '项目档案管理' },
  '/project-archive/config/preview': { title: '配置预览', parent: '项目档案配置', grandParent: '项目档案管理' },
  '/project-archive/management': { title: '项目档案管理', parent: '项目档案管理' },
  '/project-archive/management/detail': { title: '档案详情', parent: '项目档案管理', grandParent: '项目档案管理' },
  '/project-archive/management/preview': { title: '附件预览', parent: '项目档案管理', grandParent: '项目档案管理' },
  '/project-archive/history': { title: '历史归档', parent: '项目档案管理' },
  '/project-execute/progress': { title: '项目进度管理', parent: '项目执行管理' },
  '/project-execute/progress/weekly-monthly': { title: '周报月报', parent: '项目进度管理', grandParent: '项目执行管理' },
  '/project-execute/progress/weekly-monthly/detail': { title: '周报月报详情', parent: '周报月报', grandParent: '项目进度管理' },
  '/project-execute/progress/report': { title: '项目进度汇报', parent: '项目进度管理', grandParent: '项目执行管理' },
  '/project-execute/progress/gantt': { title: '进度横道图', parent: '项目进度管理', grandParent: '项目执行管理' },
  '/project-dashboard/investment-report': { title: '年度计划投资报表', parent: '项目看板报表' },
  '/project-dashboard/argument-evaluation': { title: '论证后评价看板', parent: '项目看板报表' },
  '/project-dashboard/panorama-cockpit': { title: '全景驾驶舱', parent: '项目看板报表' },
  '/project-execute/completion': { title: '项目交竣工申请', parent: '项目执行管理' },
  '/project-execute/completion/tech-renovation': { title: '技改类竣工项目清单', parent: '项目交竣工申请', grandParent: '项目执行管理' },
  '/project-execute/completion/application-list': { title: '交竣工申请列表', parent: '项目交竣工申请', grandParent: '项目执行管理' },
  '/project-execute/completion/application-form': { title: '交竣工申请表单', parent: '项目交竣工申请', grandParent: '项目执行管理' },
  '/system-config/monitor-config': { title: '合同监控配置', parent: '系统配置管理' },
  '/system-config/monitor-config/config': { title: '监控设备配置', parent: '合同监控配置', grandParent: '系统配置管理' },
  '/system-config/approval-permit-config': { title: '报批报建配置管理', parent: '系统配置管理' },
  '/system-config/leadership-team-config': { title: '领导小组配置', parent: '系统配置管理' },
};

export default function Layout({ children, mainClassName }: LayoutProps) {
  const location = useLocation();
  const { collapsed } = useSidebarCollapsed();
  const [breadcrumb, setBreadcrumb] = useState<{ title: string; path: string }[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check query params for mode info on form page
    const current = pathMap[location.pathname];
    if (current) {
      const items: { title: string; path: string }[] = [{ title: '首页', path: '/' }];
      if (current.grandParent) {
        items.push({ title: current.grandParent, path: '' });
      }
      if (current.parent) {
        items.push({ title: current.parent, path: '' });
      }
      // On declaration form pages, distinguish add vs edit
      if (location.pathname.startsWith('/project-plan/declaration/form') || location.pathname.startsWith('/project-initiation/declaration/form')) {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        items.push({
          title: id ? `编辑${current.title}` : current.title,
          path: location.pathname,
        });
      } else {
        items.push({ title: current.title, path: location.pathname });
      }
      setBreadcrumb(items);
    } else {
      setBreadcrumb([{ title: '首页', path: '/' }]);
    }
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-56'}`}
      >
        {/* Top Header */}
        <header className="h-14 bg-white flex items-center justify-between px-5 sticky top-0 z-40" style={{ borderBottom: '1px solid #e8edf3' }}>
          {/* Breadcrumb */}
          <div className="flex items-center text-sm">
            {breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center">
                {index === 0 && (
                  <div className="w-4 h-4 flex items-center justify-center mr-1">
                    <i className="ri-home-4-line text-steel-400" />
                  </div>
                )}
                {index > 0 && (
                  <div className="w-4 h-4 flex items-center justify-center mx-1">
                    <i className="ri-arrow-right-s-line text-steel-300" />
                  </div>
                )}
                <span
                  className={
                    index === breadcrumb.length - 1
                      ? 'text-steel-800 font-medium'
                      : 'text-steel-400'
                  }
                >
                  {item.title}
                </span>
              </span>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
              <i className="ri-notification-3-line text-steel-500" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger-500 rounded-full" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
              <i className="ri-question-line text-steel-500" />
            </button>
            <div className="w-px h-5 bg-steel-200 mx-1" />

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  管
                </div>
                <span className="text-sm text-steel-700 font-medium">管理员</span>
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-steel-400 text-xs" />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-steel-200 py-1 z-50 shadow-md">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-steel-700 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-user-line text-steel-500" />
                    </div>
                    个人中心
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-steel-700 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-settings-4-line text-steel-500" />
                    </div>
                    系统设置
                  </button>
                  <div className="border-t border-steel-100 my-1" />
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer">
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

        {/* Main Content */}
        <main className={mainClassName ?? 'flex-1 p-5'}>{children}</main>
      </div>
    </div>
  );
}
