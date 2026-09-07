import { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getWBSProjectById, type WBSProject, type WBSTask, type WBSApprovalFlow } from '@/mocks/wbsDecompositionMocks';

// ======================= Status Tag =======================
const statusTag = (status: string) => {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    '待提交': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    '待审核': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    '已驳回': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    '已通过': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    '变更审核中': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  };
  const s = map[status] ?? map['待提交'];
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text} border ${s.border}`}>{status}</span>;
};

// ======================= Approval Record Modal =======================
function ApprovalRecordModal({ isOpen, onClose, project }: { isOpen: boolean; onClose: () => void; project: WBSProject }) {
  if (!isOpen) return null;
  const statusColor = (status: string) => {
    if (status === '已通过') return 'bg-emerald-500';
    if (status === '已驳回') return 'bg-red-500';
    if (status === '审批中') return 'bg-amber-500';
    return 'bg-slate-300';
  };
  const statusBadge = (status: string) => {
    if (status === '已通过') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === '已驳回') return 'bg-red-50 text-red-700 border-red-200';
    if (status === '审批中') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h3 className="text-base font-semibold text-steel-800">WBS拆解审批记录</h3>
            <p className="text-xs text-steel-400 mt-0.5">{project.projectName}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-steel-500" /></button>
        </div>
        <div className="p-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-lg p-3 mb-5">
            <div><span className="text-xs text-steel-400">项目名称</span><p className="text-sm text-steel-800 mt-0.5 font-medium">{project.projectName}</p></div>
            <div><span className="text-xs text-steel-400">立项号</span><p className="text-sm text-steel-800 mt-0.5 font-mono">{project.approvalNo}</p></div>
            <div><span className="text-xs text-steel-400">当前版本</span><p className="text-sm text-steel-800 mt-0.5">{project.currentVersion || 'V1'}</p></div>
            <div><span className="text-xs text-steel-400">审批状态</span><div className="mt-0.5">{statusTag(project.wbsStatus)}</div></div>
          </div>

          {/* Approval Timeline */}
          <h4 className="text-xs font-semibold text-steel-500 uppercase tracking-wider mb-3">审批节点</h4>
          <div className="space-y-0">
            {project.approvalFlow.map((node, idx) => {
              const isLast = idx === project.approvalFlow.length - 1;
              return (
                <div key={node.nodeNo} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${statusColor(node.status)}`}>
                      {node.status === '已通过' ? <i className="ri-check-line" /> : node.status === '已驳回' ? <i className="ri-close-line" /> : node.nodeNo}
                    </div>
                    {!isLast && <div className="w-0.5 flex-1 my-1 min-h-[32px] bg-slate-200" />}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-steel-800">{node.nodeName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(node.status)}`}>{node.status}</span>
                    </div>
                    <p className="text-xs text-steel-500 mt-0.5">审批人：{node.approver}</p>
                    {node.approvalTime && <p className="text-xs text-steel-400 mt-0.5">{node.approvalTime}</p>}
                    {node.comment && (
                      <div className="mt-2 px-3 py-1.5 bg-slate-50 rounded-md border border-steel-100">
                        <p className="text-xs text-steel-600">{node.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operation Logs */}
          {project.logs.length > 0 && (
            <>
              <h4 className="text-xs font-semibold text-steel-500 uppercase tracking-wider mb-3 mt-2">操作历史</h4>
              <div className="space-y-2">
                {project.logs.map((log, idx) => {
                  const typeColor = () => {
                    if (log.operationType === '审批通过') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    if (log.operationType === '审批驳回') return 'bg-red-50 text-red-700 border-red-200';
                    if (log.operationType === '提交呈核') return 'bg-blue-50 text-blue-700 border-blue-200';
                    return 'bg-slate-100 text-slate-600 border-slate-200';
                  };
                  return (
                    <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-steel-100">
                      <span className={`text-xs px-1.5 py-0.5 rounded border whitespace-nowrap flex-shrink-0 ${typeColor()}`}>{log.operationType}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-steel-600">{log.operationDesc}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-steel-400">操作人：{log.operator}</span>
                          <span className="text-xs text-steel-400">{log.operationTime}</span>
                          <span className="text-xs text-steel-400">版本：{log.versionNo}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end px-5 py-3 border-t border-steel-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">关闭</button>
        </div>
      </div>
    </div>
  );
}

// ======================= Present Modal =======================
function PresentModal({ isOpen, onClose, projectName, onSubmit }: { isOpen: boolean; onClose: () => void; projectName: string; onSubmit: (title: string, desc: string) => void }) {
  const [title, setTitle] = useState(`项目任务拆解审批 - ${projectName}`);
  const [desc, setDesc] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">提交呈核 - WBS拆解审批</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-steel-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-steel-500 mb-1 block">审批标题 <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">审批说明 <span className="text-red-500">*</span></label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none" placeholder="请描述本次任务拆解的主要内容或修改原因" />
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">附件</label>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-steel-600 border border-steel-200 border-dashed rounded-md hover:bg-slate-50 cursor-pointer">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-2-line text-xs" /></div>
              点击上传附件
            </button>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <span className="text-xs text-steel-500 font-medium">审批流程</span>
            <div className="flex items-center gap-2 mt-2">
              {['项目经理', '工程管理部', '总师室'].map((name, idx) => (
                <span key={name} className="inline-flex items-center gap-1">
                  <span className="text-xs text-steel-700 bg-white border border-steel-200 rounded px-2 py-1">{name}</span>
                  {idx < 2 && <i className="ri-arrow-right-line text-xs text-steel-400" />}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-steel-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button disabled={!desc.trim()} onClick={() => desc.trim() && onSubmit(title, desc)} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>提交</button>
        </div>
      </div>
    </div>
  );
}

// ======================= Task Detail Modal (view) =======================
function TaskDetailModal({ task, onClose }: { task: WBSTask | null; onClose: () => void }) {
  if (!task) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">任务详情</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-steel-500" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-xs text-steel-400">任务名称</span><p className="text-sm text-steel-800 mt-0.5 font-medium">{task.name}</p></div>
            <div><span className="text-xs text-steel-400">权重</span><p className="text-sm text-steel-800 mt-0.5 font-mono">{task.weight}%</p></div>
            <div><span className="text-xs text-steel-400">任务类型</span><p className="text-sm text-steel-800 mt-0.5">{task.taskType === 'leaf' ? '可汇报（叶子节点）' : '自动汇总'}</p></div>
            <div><span className="text-xs text-steel-400">层级</span><p className="text-sm text-steel-800 mt-0.5">{task.level}级任务</p></div>
            <div><span className="text-xs text-steel-400">计划进度</span><p className="text-sm text-steel-700 mt-0.5 font-mono">{task.planProgress}%</p></div>
            <div><span className="text-xs text-steel-400">实际进度</span><p className="text-sm mt-0.5 font-mono" style={{ color: task.isDelayed ? '#ef4444' : '#059669' }}>{task.actualProgress}%</p></div>
            <div><span className="text-xs text-steel-400">计划开始</span><p className="text-sm text-steel-700 mt-0.5">{task.planStartDate}</p></div>
            <div><span className="text-xs text-steel-400">计划结束</span><p className="text-sm text-steel-700 mt-0.5">{task.planEndDate}</p></div>
            <div><span className="text-xs text-steel-400">实际开始</span><p className="text-sm text-steel-700 mt-0.5">{task.actualStartDate || '-'}</p></div>
            <div><span className="text-xs text-steel-400">实际结束</span><p className="text-sm text-steel-700 mt-0.5">{task.actualEndDate || '进行中'}</p></div>
          </div>
          {task.isDelayed && (
            <div className="bg-red-50 rounded-lg border border-red-200 px-3 py-2">
              <p className="text-xs text-red-700"><i className="ri-error-warning-line mr-1" />当前任务进度滞后，实际进度落后于计划进度</p>
            </div>
          )}
          {task.taskDesc && (
            <div><span className="text-xs text-steel-400 block mb-1">任务说明</span><p className="text-sm text-steel-700 bg-slate-50 px-3 py-2 rounded-md">{task.taskDesc}</p></div>
          )}
        </div>
        <div className="flex justify-end px-5 py-3 border-t border-steel-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">关闭</button>
        </div>
      </div>
    </div>
  );
}

// ======================= Inline Edit Task Row =======================
interface EditTaskForm { id: string; name: string; weight: string; planStartDate: string; planEndDate: string; level: 1 | 2 | 3; parentId: string | null; }

function EditingTaskRow({
  task,
  indent,
  onUpdate,
  onDelete,
  onAddChild,
  errors,
  canAddChild,
}: {
  task: EditTaskForm;
  indent: number;
  onUpdate: (id: string, field: string, val: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, level: 1 | 2 | 3) => void;
  errors: Record<string, string>;
  canAddChild: boolean;
}) {
  const childLevel = task.level < 3 ? (task.level + 1) as 1 | 2 | 3 : null;
  return (
    <tr className="border-b border-amber-100 bg-amber-50/50">
      <td className="px-3 py-2">
        <div className="flex items-center gap-1" style={{ paddingLeft: indent }}>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${task.level === 1 ? 'bg-amber-100 text-amber-700' : task.level === 2 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{task.level}级</span>
        </div>
      </td>
      <td className="px-3 py-2">
        <div style={{ paddingLeft: indent }}>
          <input
            type="text"
            value={task.name}
            onChange={(e) => onUpdate(task.id, 'name', e.target.value)}
            placeholder="输入任务名称"
            className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${errors[`${task.id}-name`] ? 'border-red-300 bg-red-50' : 'border-steel-200 bg-white'}`}
            style={{ minWidth: 160 }}
          />
          {errors[`${task.id}-name`] && <p className="text-xs text-red-500 mt-0.5">{errors[`${task.id}-name`]}</p>}
        </div>
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          value={task.weight}
          onChange={(e) => onUpdate(task.id, 'weight', e.target.value)}
          placeholder="权重%"
          min={0}
          max={100}
          className={`px-2 py-1 text-sm border rounded focus:outline-none w-20 ${errors[`${task.id}-weight`] ? 'border-red-300 bg-red-50' : 'border-steel-200 bg-white'}`}
        />
      </td>
      <td className="px-3 py-2">
        <span className={`text-xs px-1.5 py-0.5 rounded ${task.level < 3 ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {task.level < 3 ? '自动汇总' : '可汇报'}
        </span>
      </td>
      <td className="px-3 py-2 text-xs text-steel-400">-</td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <input type="date" value={task.planStartDate} onChange={(e) => onUpdate(task.id, 'planStartDate', e.target.value)} className="px-2 py-1 text-xs border border-steel-200 rounded bg-white" style={{ width: 120 }} />
          <span className="text-steel-400 text-xs">~</span>
          <input type="date" value={task.planEndDate} onChange={(e) => onUpdate(task.id, 'planEndDate', e.target.value)} className="px-2 py-1 text-xs border border-steel-200 rounded bg-white" style={{ width: 120 }} />
        </div>
      </td>
      <td className="px-3 py-2 text-xs text-steel-400">-</td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          {canAddChild && childLevel && (
            <button
              onClick={() => onAddChild(task.id, childLevel)}
              className="flex items-center gap-0.5 px-2 py-1 text-xs text-blue-700 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line text-xs" />子任务
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="flex items-center gap-0.5 px-2 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-delete-bin-line text-xs" />删除
          </button>
        </div>
      </td>
    </tr>
  );
}

// ======================= Main Page =======================
export default function WBSDecompositionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? 'wbs_001';
  const projectName = searchParams.get('name') ?? '1#高炉环保升级改造工程';
  const approvalNo = searchParams.get('approvalNo') ?? 'LX-2026-001';

  const [project, setProject] = useState<WBSProject>(() => {
    const found = getWBSProjectById(projectId);
    if (found) return found;
    return {
      id: projectId, projectName, approvalNo, contractNo: `HT-${approvalNo.replace('LX-', '')}`,
      wbsStatus: '待提交', currentVersion: '', overallProgress: 0, projectManager: '张明远',
      taskCount: 0, tasks: [], logs: [], approvalFlow: [], attachments: [],
    };
  });

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    project.tasks.forEach((t) => { if (t.level === 1) ids.add(t.id); });
    return ids;
  });

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editingTasks, setEditingTasks] = useState<EditTaskForm[]>([]);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [weightErrors, setWeightErrors] = useState<string[]>([]);

  const [showApproval, setShowApproval] = useState(false);
  const [showPresent, setShowPresent] = useState(false);
  const [detailTask, setDetailTask] = useState<WBSTask | null>(null);
  const [toast, setToast] = useState('');
  const [attachmentUploaded, setAttachmentUploaded] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const allIds = new Set<string>();
    project.tasks.forEach((t) => { if (t.taskType === 'summary') allIds.add(t.id); });
    setExpandedIds(allIds);
  }, [project.tasks]);

  const collapseAll = useCallback(() => setExpandedIds(new Set()), []);

  const visibleTasks = useMemo(() => {
    const result: WBSTask[] = [];
    project.tasks.forEach((task) => {
      if (task.level === 1) {
        result.push(task);
        if (expandedIds.has(task.id)) {
          project.tasks.forEach((child) => {
            if (child.parentId === task.id) {
              result.push(child);
              if (child.taskType === 'summary' && expandedIds.has(child.id)) {
                project.tasks.forEach((grand) => { if (grand.parentId === child.id) result.push(grand); });
              }
            }
          });
        }
      }
    });
    return result;
  }, [project.tasks, expandedIds]);

  // Edit mode visible tasks (flat list in hierarchical order)
  const editVisibleTasks = useMemo(() => {
    const result: EditTaskForm[] = [];
    const traverse = (parentId: string | null) => {
      editingTasks.filter((t) => t.parentId === parentId).forEach((t) => {
        result.push(t);
        traverse(t.id);
      });
    };
    traverse(null);
    return result;
  }, [editingTasks]);

  // ---- Edit actions ----
  const startEdit = (mode: 'new' | 'recompose') => {
    setEditErrors({});
    setWeightErrors([]);
    if (mode === 'recompose') {
      setEditingTasks(project.tasks.map((t) => ({
        id: t.id, name: t.name, weight: String(t.weight),
        planStartDate: t.planStartDate, planEndDate: t.planEndDate,
        level: t.level, parentId: t.parentId,
      })));
    } else {
      setEditingTasks([]);
    }
    setEditMode(true);
  };

  const cancelEdit = () => { setEditMode(false); setEditingTasks([]); setEditErrors({}); setWeightErrors([]); };

  let nextSeq = editingTasks.length + 1;
  const nextId = () => `${projectId}-et${nextSeq++}`;

  const addTask = (level: 1 | 2 | 3, parentId: string | null) => {
    const newTask: EditTaskForm = { id: `${projectId}-et${Date.now()}`, name: '', weight: '', planStartDate: '', planEndDate: '', level, parentId };
    setEditingTasks((prev) => {
      if (parentId === null) return [...prev, newTask];
      // Insert after the last child of parentId (including their children)
      const idx = prev.map((t, i) => ({ t, i })).filter(({ t }) => {
        let curr: string | null = t.parentId;
        while (curr !== null) {
          if (curr === parentId) return true;
          const parent = prev.find((p) => p.id === curr);
          curr = parent?.parentId ?? null;
        }
        return false;
      }).pop()?.i ?? prev.findIndex((t) => t.id === parentId);
      return [...prev.slice(0, idx + 1), newTask, ...prev.slice(idx + 1)];
    });
  };

  const updateTask = (id: string, field: string, val: string) => {
    setEditingTasks((prev) => prev.map((t) => t.id === id ? { ...t, [field]: val } : t));
    setEditErrors((prev) => { const n = { ...prev }; delete n[`${id}-${field}`]; return n; });
  };

  const deleteTask = (id: string) => {
    setEditingTasks((prev) => {
      const toRemove = new Set<string>();
      const collect = (tid: string) => { toRemove.add(tid); prev.forEach((t) => { if (t.parentId === tid) collect(t.id); }); };
      collect(id);
      return prev.filter((t) => !toRemove.has(t.id));
    });
  };

  const validateEdit = () => {
    const errs: Record<string, string> = {};
    editingTasks.forEach((t) => {
      if (!t.name.trim()) errs[`${t.id}-name`] = '请输入任务名称';
      if (!t.weight.trim()) errs[`${t.id}-weight`] = '请输入权重';
      if (!t.planStartDate) errs[`${t.id}-planStartDate`] = '请选择开始日期';
      if (!t.planEndDate) errs[`${t.id}-planEndDate`] = '请选择结束日期';
    });

    // Weight validation
    const wErrors: string[] = [];
    const l1Tasks = editingTasks.filter((t) => t.level === 1);
    const l1Sum = l1Tasks.reduce((s, t) => s + (Number(t.weight) || 0), 0);
    if (l1Tasks.length > 0 && l1Sum !== 100) {
      wErrors.push(`一级任务权重之和必须=100%，当前${l1Sum}%`);
    }
    // Check each parent's children weight
    const parentIds = [...new Set(editingTasks.filter((t) => t.parentId).map((t) => t.parentId!))];
    parentIds.forEach((pid) => {
      const siblings = editingTasks.filter((t) => t.parentId === pid);
      const sibSum = siblings.reduce((s, t) => s + (Number(t.weight) || 0), 0);
      if (siblings.length > 0 && sibSum !== 100) {
        const parent = editingTasks.find((t) => t.id === pid);
        wErrors.push(`「${parent?.name || pid}」下子任务权重之和必须=100%，当前${sibSum}%`);
      }
    });

    setEditErrors(errs);
    setWeightErrors(wErrors);
    return Object.keys(errs).length === 0 && wErrors.length === 0;
  };

  const handleSubmitPresent = (title: string, desc: string) => {
    setShowPresent(false);
    // Convert editing tasks to WBSTasks
    const newTasks: WBSTask[] = editingTasks.map((t) => ({
      id: t.id, name: t.name, weight: Number(t.weight) || 0,
      taskType: editingTasks.some((c) => c.parentId === t.id) ? 'summary' : 'leaf',
      planProgress: 0, actualProgress: 0,
      planStartDate: t.planStartDate, planEndDate: t.planEndDate,
      level: t.level, parentId: t.parentId,
    }));
    setProject((prev) => ({
      ...prev, wbsStatus: '待审核', tasks: newTasks, taskCount: newTasks.length,
      logs: [...prev.logs, { id: `${prev.id}-log-${Date.now()}`, operationType: '提交呈核', operator: '当前用户', operationTime: new Date().toLocaleString('zh-CN'), operationDesc: desc, versionNo: prev.currentVersion || 'V1' }],
    }));
    setEditMode(false);
    setEditingTasks([]);
    showToast('已提交审批，等待审核通过');
  };

  const handlePresent = () => {
    if (editMode) {
      if (!validateEdit()) return;
      setShowPresent(true);
    } else {
      setShowPresent(true);
    }
  };

  // Progress bars
  const progressBar = (value: number, type: 'plan' | 'actual', isDelayed?: boolean) => {
    const color = type === 'plan' ? 'bg-blue-400' : isDelayed ? 'bg-red-400' : 'bg-emerald-500';
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-steel-500 w-8 flex-shrink-0">{type === 'plan' ? '计划' : '实际'}</span>
        <div className="w-20 h-1.5 bg-steel-100 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(100, value)}%` }} />
        </div>
        <span className={`text-xs font-mono ${type === 'actual' && isDelayed ? 'text-red-500' : 'text-steel-600'}`}>{value}%</span>
      </div>
    );
  };

  const levelBg = (level: number) => { if (level === 1) return 'bg-amber-50/40'; if (level === 2) return 'bg-blue-50/30'; return 'bg-white'; };
  const levelIndent = (level: number) => { if (level === 1) return 0; if (level === 2) return 20; return 40; };

  const isApproved = project.wbsStatus === '已通过';
  const isPending = project.wbsStatus === '待提交';
  const isRejected = project.wbsStatus === '已驳回';
  const isReviewing = project.wbsStatus === '待审核';
  const isChangePending = project.wbsStatus === '变更审核中';

  return (
    <Layout>
      <div className="space-y-4">
        {/* Toast */}
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <i className="ri-check-line" />{toast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">项目任务拆解</h1>
            <p className="text-xs text-steel-400 mt-0.5">WBS任务拆解与进度管理</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* New decomposition (when pending or rejected) */}
            {(isPending || isRejected) && !editMode && (
              <button onClick={() => startEdit('new')} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-xs" /></div>
                新增拆解
              </button>
            )}
            {/* Recompose (when approved) */}
            {isApproved && !editMode && (
              <button onClick={() => startEdit('recompose')} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line text-xs" /></div>
                发起重新拆解
              </button>
            )}
            {/* Edit mode actions */}
            {editMode && (
              <>
                <button onClick={() => addTask(1, null)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-xs" /></div>
                  新增一级任务
                </button>
                <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-close-line text-xs" /></div>
                  取消编辑
                </button>
              </>
            )}
            {!editMode && (
              <>
                <button onClick={expandAll} className="flex items-center gap-1.5 px-3 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-down-s-line text-xs" /></div>
                  全部展开
                </button>
                <button onClick={collapseAll} className="flex items-center gap-1.5 px-3 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-up-s-line text-xs" /></div>
                  全部收起
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {editMode && (
              <button onClick={handlePresent} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-send-plane-line text-xs" /></div>
                提交呈核
              </button>
            )}
            <button onClick={() => setShowApproval(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-list-line text-xs" /></div>
              审批记录
            </button>
          </div>
        </div>

        {/* Weight Errors */}
        {weightErrors.length > 0 && (
          <div className="bg-red-50 rounded-lg border border-red-200 px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1"><i className="ri-error-warning-line text-red-500 text-sm" /><span className="text-sm font-medium text-red-700">权重校验失败</span></div>
            {weightErrors.map((e, i) => <p key={i} className="text-xs text-red-600 ml-5">{e}</p>)}
          </div>
        )}

        {/* Project Info Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-xs text-steel-500">项目名称</span><span className="text-sm font-medium text-steel-800">{project.projectName}</span></div>
            <div className="flex items-center gap-2"><span className="text-xs text-steel-500">立项号</span><span className="text-sm font-mono text-steel-700">{project.approvalNo}</span></div>
            <div className="flex items-center gap-2"><span className="text-xs text-steel-500">审批状态</span>{statusTag(project.wbsStatus)}</div>
            {project.currentVersion && <div className="flex items-center gap-2"><span className="text-xs text-steel-500">当前版本</span><span className="text-sm font-semibold text-steel-800 font-mono">{project.currentVersion}</span></div>}
            {editMode && <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">编辑模式</span>}
          </div>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {(isApproved || isChangePending) && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-steel-500">整体进度</span>
                <div className="w-32 h-2 bg-steel-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.overallProgress}%` }} />
                </div>
                <span className="text-sm font-medium text-steel-800">{project.overallProgress}%</span>
              </div>
            )}
            <button onClick={() => setAttachmentUploaded(!attachmentUploaded)} className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-attachment-line text-xs" /></div>
              {attachmentUploaded ? '已上传附件' : '附件预览'}
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-download-line text-xs" /></div>
              附件下载
            </button>
          </div>
        </div>

        {/* Status Messages (view mode only) */}
        {!editMode && (isPending) && (
          <div className="bg-slate-50 rounded-lg border border-steel-200 px-4 py-8 text-center">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 rounded-full bg-slate-100"><i className="ri-node-tree text-2xl text-steel-300" /></div>
            <p className="text-sm text-steel-500 mb-3">暂无拆解任务，请点击「新增拆解」按钮开始拆解</p>
          </div>
        )}
        {!editMode && isRejected && (
          <div className="bg-red-50 rounded-lg border border-red-200 px-4 py-3">
            <div className="flex items-center gap-2"><i className="ri-error-warning-line text-red-500" /><span className="text-sm font-medium text-red-700">审批已驳回</span></div>
            <p className="text-sm text-red-600 mt-1">{project.logs.find((l) => l.operationType === '审批驳回')?.operationDesc ?? 'WBS拆解方案被驳回，请根据驳回意见重新调整。'}</p>
          </div>
        )}
        {!editMode && isReviewing && (
          <div className="bg-amber-50 rounded-lg border border-amber-200 px-4 py-3">
            <div className="flex items-center gap-2"><i className="ri-time-line text-amber-500" /><span className="text-sm font-medium text-amber-700">审批中</span></div>
            <p className="text-sm text-amber-600 mt-1">已提交WBS拆解方案，等待审核通过。</p>
          </div>
        )}
        {!editMode && isChangePending && (
          <div className="bg-blue-50 rounded-lg border border-blue-200 px-4 py-3">
            <div className="flex items-center gap-2"><i className="ri-refresh-line text-blue-500" /><span className="text-sm font-medium text-blue-700">变更审核中</span></div>
            <p className="text-sm text-blue-600 mt-1">新一轮WBS拆解已提交，等待审核。审核期间原版本继续生效。</p>
          </div>
        )}

        {/* Edit mode: Editing table */}
        {editMode && (
          <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100 bg-amber-50/40">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-steel-700">WBS任务拆解编辑</span>
                <span className="text-xs text-amber-600">({editingTasks.length}个任务)</span>
              </div>
              <span className="text-xs text-steel-400">权重之和须=100%，最多3级层级</span>
            </div>
            {editingTasks.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2 rounded-full bg-slate-100"><i className="ri-node-tree text-2xl text-steel-300" /></div>
                <p className="text-sm text-steel-500">尚未添加任务，请点击「新增一级任务」</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: 900 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                      <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">层级</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 220 }}>任务名称</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-24">权重(%)</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-24">任务类型</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-24">进度现状</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 280 }}>计划时间</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-24">实际时间</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editVisibleTasks.map((task) => {
                      const hasChildren = editingTasks.some((t) => t.parentId === task.id);
                      const canAddChild = task.level < 3;
                      return (
                        <EditingTaskRow
                          key={task.id}
                          task={task}
                          indent={levelIndent(task.level)}
                          onUpdate={updateTask}
                          onDelete={deleteTask}
                          onAddChild={(pid, lv) => addTask(lv, pid)}
                          errors={editErrors}
                          canAddChild={canAddChild}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* View mode: Task List */}
        {!editMode && (isApproved || isChangePending || isReviewing) && visibleTasks.length > 0 && (
          <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-steel-700">WBS任务拆解清单</span>
                <span className="text-xs text-steel-400">共 {project.tasks.length} 个任务</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-300" /><span className="text-steel-500">1级</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-300" /><span className="text-steel-500">2级</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white border border-steel-200" /><span className="text-steel-500">3级</span></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: 900 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-14">序号</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 260 }}>任务名称</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-20">权重(%)</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-24">任务类型</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 180 }}>进度现状</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 180 }}>计划时间</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 180 }}>实际时间</th>
                    <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap w-20">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTasks.map((task, idx) => {
                    const hasChildren = project.tasks.some((t) => t.parentId === task.id);
                    const isExpanded = expandedIds.has(task.id);
                    return (
                      <tr key={task.id} className={`${levelBg(task.level)} hover:bg-slate-50/60 transition-colors`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-4 py-3 text-sm text-steel-400 whitespace-nowrap">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-steel-800 font-medium whitespace-nowrap">
                          <div className="flex items-center gap-1.5" style={{ paddingLeft: levelIndent(task.level) }}>
                            {hasChildren && (
                              <button onClick={() => toggleExpand(task.id)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer text-steel-500">
                                <i className={`${isExpanded ? 'ri-subtract-line' : 'ri-add-line'} text-xs`} />
                              </button>
                            )}
                            {task.level === 1 && <span className="text-xs px-1 py-0.5 rounded bg-amber-100 text-amber-700 flex-shrink-0">1级</span>}
                            {task.level === 2 && <span className="text-xs px-1 py-0.5 rounded bg-blue-100 text-blue-700 flex-shrink-0">2级</span>}
                            {task.level === 3 && <span className="text-xs px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 flex-shrink-0">3级</span>}
                            <span>{task.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-700 font-mono whitespace-nowrap">{task.weight}%</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {task.taskType === 'leaf' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><i className="ri-leaf-line text-xs" />可汇报</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"><i className="ri-stack-line text-xs" />自动汇总</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-1">
                            {progressBar(task.planProgress, 'plan')}
                            {progressBar(task.actualProgress, 'actual', task.isDelayed)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">{task.planStartDate} ~ {task.planEndDate}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          {task.actualStartDate ? <span className="text-steel-600">{task.actualStartDate} ~ {task.actualEndDate ?? '进行中'}</span> : <span className="text-steel-400">-</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button onClick={() => setDetailTask(task)} className="flex items-center gap-1 px-2.5 py-1 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">
                            <i className="ri-eye-line text-xs" />查看
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        <ApprovalRecordModal isOpen={showApproval} onClose={() => setShowApproval(false)} project={project} />
        <PresentModal isOpen={showPresent} onClose={() => setShowPresent(false)} projectName={project.projectName} onSubmit={handleSubmitPresent} />
        <TaskDetailModal task={detailTask} onClose={() => setDetailTask(null)} />
      </div>
    </Layout>
  );
}