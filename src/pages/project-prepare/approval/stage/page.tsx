import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { projects } from '@/mocks/projectPrepareMocks';
import {
  getProjectStages,
  getStageAttachments,
  getStageOperationLogs,
  getStageStatusColor,
  getStageStatusIcon,
  getOperationTypeColor,
  getOperationTypeIcon,
  getStageDefByStageId,
  getSchemeNameForProject,
} from '@/mocks/projectApprovalMocks';
import type { PermitStageDef } from '@/mocks/approvalPermitConfigMocks';
import StageGuideModal from './components/StageGuideModal';
import StageResultUploadSection from './components/StageResultUploadSection';

export default function ProjectApprovalStagePage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const projectId = urlParams.get('projectId') || '';

  const project = useMemo(() => projects.find((p) => p.id === projectId), [projectId]);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  const stages = useMemo(() => getProjectStages(projectId), [projectId, tick]);
  const stageStats = useMemo(() => {
    const total = stages.length;
    const completed = stages.filter((s) => s.status === '已完成').length;
    const ratio = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, ratio };
  }, [stages]);

  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [guideStage, setGuideStage] = useState<PermitStageDef | null>(null);
  const schemeLabel = getSchemeNameForProject(projectId);

  const attachments = useMemo(() => {
    if (!expandedStageId) return [];
    return getStageAttachments(expandedStageId);
  }, [expandedStageId, tick]);

  const handleToggleStage = useCallback((stageId: string) => {
    setExpandedStageId((prev) => (prev === stageId ? null : stageId));
  }, []);

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-steel-400">未找到项目信息</p>
            <button
              type="button"
              onClick={() => navigate('/project-prepare/approval')}
              className="mt-2 px-4 py-2 text-sm text-white rounded-md cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
            >
              返回列表
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const expandedDef = expandedStageId ? getStageDefByStageId(expandedStageId) : undefined;

  return (
    <Layout>
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-steel-200 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-steel-900">报批报建阶段</h1>
            <button
              type="button"
              onClick={() => navigate('/project-prepare/approval')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-arrow-left-line" />
              返回
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-steel-500 whitespace-nowrap">项目名称</span>
              <span className="text-sm text-steel-800 font-medium truncate">{project.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">立项号</span>
              <span className="text-sm text-steel-700 font-mono">{project.approvalNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">建设单位</span>
              <span className="text-sm text-steel-700">{project.constructionUnit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">项目分类</span>
              <span className="text-sm text-steel-700">{project.majorType} · {project.projectType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">项目经理</span>
              <span className="text-sm text-steel-700">{project.manager}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">项目阶段总数</span>
              <span className="text-sm font-semibold text-steel-800">{stageStats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel-500 whitespace-nowrap">已完成阶段</span>
              <span className="text-sm font-semibold text-emerald-600">{stageStats.completed}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-steel-500 whitespace-nowrap">完成比例</span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden min-w-[72px] max-w-[140px]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${stageStats.ratio}%`,
                      background:
                        stageStats.ratio >= 100
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : stageStats.ratio >= 50
                            ? 'linear-gradient(90deg, #3b82f6, #1d4ed8)'
                            : 'linear-gradient(90deg, #f59e0b, #d97706)',
                    }}
                  />
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
                    stageStats.ratio >= 100
                      ? 'text-emerald-600'
                      : stageStats.ratio >= 50
                        ? 'text-primary-600'
                        : 'text-amber-600'
                  }`}
                >
                  {stageStats.ratio}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-steel-700">报批报建阶段</span>
            <span className="text-xs text-steel-400 truncate max-w-[60%]">{schemeLabel}</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex items-stretch gap-1 min-w-max">
              {stages.map((stage, idx) => {
                const isActive = expandedStageId === stage.id;
                const isCompleted = stage.status === '已完成';
                const isInProgress = stage.status === '进行中';
                const attachmentCount = getStageAttachments(stage.id).length;
                const def = getStageDefByStageId(stage.id);
                return (
                  <div key={stage.id} className="flex items-center">
                    <div className={`relative flex flex-col items-center gap-2 px-3 py-3 rounded-lg min-w-[128px] border ${isActive ? 'bg-primary-50 border-primary-200' : 'border-transparent hover:bg-slate-50'}`}>
                      <button type="button" onClick={() => handleToggleStage(stage.id)} className="flex flex-col items-center gap-2 cursor-pointer">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-emerald-500 text-white' : isInProgress ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          <i className={isCompleted ? 'ri-check-line' : isInProgress ? 'ri-loader-4-line' : (def?.icon || 'ri-time-line')} />
                        </div>
                        <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-primary-700' : 'text-steel-700'}`}>{stage.name}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStageStatusColor(stage.status)}`}>
                          <i className={getStageStatusIcon(stage.status)} />
                          {stage.status}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => def && setGuideStage(def)}
                        className="px-2 py-0.5 text-[11px] text-sky-700 bg-sky-50 border border-sky-200 rounded hover:bg-sky-100 cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-compass-3-line mr-0.5" />
                        办理指引
                      </button>
                      {attachmentCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">{attachmentCount}</span>
                      )}
                    </div>
                    {idx < stages.length - 1 && (
                      <div className="flex items-center px-1 flex-shrink-0">
                        <div className="w-6 h-px bg-steel-300" />
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-steel-300" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {expandedStageId && expandedDef && (
          <StageResultUploadSection
            stageId={expandedStageId}
            stageName={expandedDef.name}
            docs={expandedDef.docs}
            attachments={attachments}
            onChange={refresh}
            onOpenLogs={() => setShowLogs(true)}
          />
        )}
      </div>

      {guideStage && <StageGuideModal stage={guideStage} onClose={() => setGuideStage(null)} />}

      {showLogs && expandedStageId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden" style={{ maxHeight: '80vh' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-steel-100">
              <h3 className="text-sm font-semibold text-steel-800">{expandedDef?.name} - 操作日志</h3>
              <button type="button" onClick={() => setShowLogs(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10">
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500">序号</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500">操作人</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500">操作时间</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500">操作类型</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500">操作内容</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500">操作结果</th>
                  </tr>
                </thead>
                <tbody>
                  {getStageOperationLogs(expandedStageId).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-steel-400">暂无操作日志</td>
                    </tr>
                  ) : (
                    getStageOperationLogs(expandedStageId).map((log, idx) => (
                      <tr key={log.id} className="border-b border-steel-100">
                        <td className="px-4 py-3 text-sm text-steel-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-steel-700">{log.operator}</td>
                        <td className="px-4 py-3 text-sm text-steel-500">{log.operationTime}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getOperationTypeColor(log.operationType)}`}>
                            <i className={getOperationTypeIcon(log.operationType)} />
                            {log.operationType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-700">{log.operationContent}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${log.result === '成功' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>{log.result}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end px-5 py-3 border-t border-steel-100 bg-slate-50">
              <button type="button" onClick={() => setShowLogs(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-300 rounded-md hover:bg-slate-100 cursor-pointer">关闭</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
