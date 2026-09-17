import { type DangerousWork } from '@/mocks/participantManagementMocks';

interface DangerousWorkDetailModalProps {
  open: boolean;
  work: DangerousWork | null;
  onClose: () => void;
}

export default function DangerousWorkDetailModal({ open, work, onClose }: DangerousWorkDetailModalProps) {
  if (!open || !work) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[680px] max-h-[85vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">危险作业详情</h3>
            <p className="text-xs text-steel-400 mt-0.5">作业证流水号：{work.certificateNo}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* 项目信息 */}
          <div>
            <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)' }} />
              项目与分类信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">项目名称</label>
                <span className="text-sm text-primary-600 font-medium">{work.projectName}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">所属事业部</label>
                <span className="text-sm text-steel-700">{work.businessUnit}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">所属部门</label>
                <span className="text-sm text-steel-700">{work.department}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">分类</label>
                <span className="text-sm text-steel-700">{work.category}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">危险源</label>
                <span className="text-sm text-red-600 font-medium">{work.hazardSource}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">状态</label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  work.status === '进行中' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  work.status === '已完成' ? 'bg-green-50 text-green-700 border border-green-200' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {work.status}
                </span>
              </div>
            </div>
          </div>

          {/* 基本信息 */}
          <div>
            <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #10b981, #059669)' }} />
              作业信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">作业证类型</label>
                <span className="text-sm text-steel-700 font-medium">{work.certificateType}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">作业级别</label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  work.workLevel === '特级' ? 'bg-red-50 text-red-700 border border-red-200' :
                  work.workLevel === '一级' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                  work.workLevel === '二级' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {work.workLevel}
                </span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100 col-span-2">
                <label className="text-xs text-steel-400 block mb-1">危险作业内容</label>
                <span className="text-sm text-steel-700">{work.workContent}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">作业单位</label>
                <span className="text-sm text-steel-700">{work.workUnit}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">项目所在生产厂</label>
                <span className="text-sm text-steel-700">{work.productionPlant}</span>
              </div>
            </div>
          </div>

          {/* 时间信息 */}
          <div>
            <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #f59e0b, #d97706)' }} />
              时间信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">实际开始时间</label>
                <span className="text-sm text-steel-700">{work.startTime}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">实际结束时间</label>
                <span className="text-sm text-steel-700">{work.endTime}</span>
              </div>
            </div>
          </div>

          {/* 详细作业信息 */}
          <div>
            <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)' }} />
              作业详细信息
            </h4>
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-steel-400 block mb-1">申请人</label>
                    <span className="text-sm text-steel-700">{work.detail.applicant}</span>
                  </div>
                  <div>
                    <label className="text-xs text-steel-400 block mb-1">申请日期</label>
                    <span className="text-sm text-steel-700">{work.detail.applyDate}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">作业地点</label>
                <span className="text-sm text-steel-700">{work.detail.workLocation}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">安全措施</label>
                <p className="text-sm text-steel-700 leading-relaxed">{work.detail.safetyMeasures}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <label className="text-xs text-steel-400 block mb-1">现场监督</label>
                  <span className="text-sm text-steel-700">{work.detail.supervisor}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                  <label className="text-xs text-steel-400 block mb-1">监护人</label>
                  <span className="text-sm text-steel-700">{work.detail.guardian}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">风险分析</label>
                <p className="text-sm text-steel-700 leading-relaxed">{work.detail.riskAnalysis}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-steel-100">
                <label className="text-xs text-steel-400 block mb-1">应急预案</label>
                <p className="text-sm text-steel-700 leading-relaxed">{work.detail.emergencyPlan}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}