import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getWBSProjectById, type WBSTask } from '@/mocks/wbsDecompositionMocks';

interface TaskForm {
  id: string;
  name: string;
  weight: string;
  planStartDate: string;
  planEndDate: string;
  taskDesc: string;
  level: 1 | 2 | 3;
  parentId: string | null;
  children: TaskForm[];
}

function PresentModal({
  isOpen,
  onClose,
  projectName,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onSubmit: (title: string, desc: string) => void;
}) {
  const [title, setTitle] = useState(`项目任务拆解审批 - ${projectName}`);
  const [desc, setDesc] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-800">呈核 - 项目任务拆解</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 cursor-pointer">
            <i className="ri-close-line text-steel-500" />
          </button>
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
            <span className="text-xs text-steel-500">审批流程预览</span>
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
          <button onClick={() => desc.trim() && onSubmit(title, desc)} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>提交</button>
        </div>
      </div>
    </div>
  );
}

export default function WBSEditPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? 'wbs_001';
  const projectName = searchParams.get('name') ?? '1#高炉环保升级改造工程';
  const approvalNo = searchParams.get('approvalNo') ?? 'LX-2026-001';
  const mode = searchParams.get('mode') ?? 'new';

  const existingProject = getWBSProjectById(projectId);

  const [tasks, setTasks] = useState<TaskForm[]>(() => {
    if (mode === 'recompose' && existingProject) {
      return existingProject.tasks.map((t) => ({
        id: t.id,
        name: t.name,
        weight: String(t.weight),
        planStartDate: t.planStartDate,
        planEndDate: t.planEndDate,
        taskDesc: t.taskDesc ?? '',
        level: t.level,
        parentId: t.parentId,
        children: [],
      }));
    }
    return [];
  });

  const [showPresent, setShowPresent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedDraft, setSavedDraft] = useState(false);

  let seqCounter = tasks.length + 1;
  const nextId = () => `${projectId}-t${seqCounter++}`;

  const addTask = (level: 1 | 2 | 3, parentId: string | null) => {
    const newTask: TaskForm = {
      id: nextId(),
      name: '',
      weight: '',
      planStartDate: '',
      planEndDate: '',
      taskDesc: '',
      level,
      parentId,
      children: [],
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, field: keyof TaskForm, value: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${id}-${field}`];
      return next;
    });
  };

  const removeTask = (id: string) => {
    setTasks((prev) => {
      const toRemove = new Set<string>();
      const collect = (taskId: string) => {
        toRemove.add(taskId);
        prev.forEach((t) => {
          if (t.parentId === taskId) collect(t.id);
        });
      };
      collect(id);
      return prev.filter((t) => !toRemove.has(t.id));
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    tasks.forEach((t) => {
      if (!t.name.trim()) newErrors[`${t.id}-name`] = '请输入任务名称';
      if (!t.weight.trim()) newErrors[`${t.id}-weight`] = '请输入权重';
      if (!t.planStartDate) newErrors[`${t.id}-planStartDate`] = '请选择开始日期';
      if (!t.planEndDate) newErrors[`${t.id}-planEndDate`] = '请选择结束日期';
      if (t.planStartDate && t.planEndDate && t.planStartDate > t.planEndDate) {
        newErrors[`${t.id}-planEndDate`] = '结束日期不得早于开始日期';
      }
    });

    // Validate sibling weights
    const l1Tasks = tasks.filter((t) => t.level === 1);
    const l1Sum = l1Tasks.reduce((s, t) => s + (Number(t.weight) || 0), 0);
    if (l1Tasks.length > 0 && l1Sum !== 100) {
      newErrors['level1-weight'] = `1级任务权重之和必须等于100%，当前为${l1Sum}%`;
    }

    l1Tasks.forEach((l1) => {
      const l2Tasks = tasks.filter((t) => t.parentId === l1.id);
      const l2Sum = l2Tasks.reduce((s, t) => s + (Number(t.weight) || 0), 0);
      if (l2Tasks.length > 0 && l2Sum !== 100) {
        newErrors[`${l1.id}-weight`] = `「${l1.name}」下2级任务权重之和必须等于100%，当前为${l2Sum}%`;
      }
      l2Tasks.forEach((l2) => {
        const l3Tasks = tasks.filter((t) => t.parentId === l2.id);
        const l3Sum = l3Tasks.reduce((s, t) => s + (Number(t.weight) || 0), 0);
        if (l3Tasks.length > 0 && l3Sum !== 100) {
          newErrors[`${l2.id}-weight`] = `「${l2.name}」下3级任务权重之和必须等于100%，当前为${l3Sum}%`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePresent = () => {
    if (validate()) {
      setShowPresent(true);
    }
  };

  const handlePresentSubmit = (title: string, desc: string) => {
    setShowPresent(false);
    alert('呈核成功！WBS拆解方案已提交审批。');
    navigate(`/project-prepare/preliminary-design/wbs-decomposition?id=${projectId}&name=${encodeURIComponent(projectName)}&approvalNo=${encodeURIComponent(approvalNo)}`);
  };

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
  };

  const handleCancel = () => {
    if (window.confirm('确定取消？未保存的数据将丢失。')) {
      navigate(`/project-prepare/preliminary-design/wbs-decomposition?id=${projectId}&name=${encodeURIComponent(projectName)}&approvalNo=${encodeURIComponent(approvalNo)}`);
    }
  };

  const groupedTasks = useMemo(() => {
    const l1: TaskForm[] = [];
    const l2: Record<string, TaskForm[]> = {};
    const l3: Record<string, TaskForm[]> = {};
    tasks.forEach((t) => {
      if (t.level === 1) {
        l1.push(t);
      } else if (t.level === 2) {
        if (!l2[t.parentId!]) l2[t.parentId!] = [];
        l2[t.parentId!].push(t);
      } else if (t.level === 3) {
        if (!l3[t.parentId!]) l3[t.parentId!] = [];
        l3[t.parentId!].push(t);
      }
    });
    return { l1, l2, l3 };
  }, [tasks]);

  const taskCard = (task: TaskForm, levelLabel: string, levelColor: string, canAddChild: boolean) => {
    const childLabel = task.level === 1 ? '2级' : '3级';
    return (
      <div key={task.id} className={`bg-white rounded-lg border border-steel-200 p-4 mb-3 ${levelColor}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded bg-white border border-steel-200`}>{levelLabel}</span>
          <button onClick={() => removeTask(task.id)} className="ml-auto text-steel-400 hover:text-red-500 cursor-pointer">
            <i className="ri-delete-bin-line text-sm" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-steel-500 mb-1 block">任务名称 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={task.name}
              onChange={(e) => updateTask(task.id, 'name', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-primary-500 ${errors[`${task.id}-name`] ? 'border-red-300' : 'border-steel-200'}`}
              placeholder={task.level === 1 ? '请输入任务名称' : '请输入工作包名称'}
            />
            {errors[`${task.id}-name`] && <p className="text-xs text-red-500 mt-1">{errors[`${task.id}-name`]}</p>}
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">权重(%) <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={task.weight}
              onChange={(e) => updateTask(task.id, 'weight', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-primary-500 ${errors[`${task.id}-weight`] || errors[`${task.parentId}-weight`] || errors['level1-weight'] ? 'border-red-300' : 'border-steel-200'}`}
              placeholder="请输入权重"
              min={0}
              max={100}
            />
            {errors[`${task.id}-weight`] && <p className="text-xs text-red-500 mt-1">{errors[`${task.id}-weight`]}</p>}
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">计划开始时间 <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={task.planStartDate}
              onChange={(e) => updateTask(task.id, 'planStartDate', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-primary-500 ${errors[`${task.id}-planStartDate`] ? 'border-red-300' : 'border-steel-200'}`}
            />
            {errors[`${task.id}-planStartDate`] && <p className="text-xs text-red-500 mt-1">{errors[`${task.id}-planStartDate`]}</p>}
          </div>
          <div>
            <label className="text-xs text-steel-500 mb-1 block">计划结束时间 <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={task.planEndDate}
              onChange={(e) => updateTask(task.id, 'planEndDate', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-primary-500 ${errors[`${task.id}-planEndDate`] ? 'border-red-300' : 'border-steel-200'}`}
            />
            {errors[`${task.id}-planEndDate`] && <p className="text-xs text-red-500 mt-1">{errors[`${task.id}-planEndDate`]}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-steel-500 mb-1 block">任务说明</label>
            <textarea
              value={task.taskDesc}
              onChange={(e) => updateTask(task.id, 'taskDesc', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:border-primary-500 resize-none"
              placeholder="请输入任务说明"
            />
          </div>
          {canAddChild && (
            <div className="md:col-span-2">
              <button
                onClick={() => addTask(task.level === 1 ? 2 : 3, task.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 cursor-pointer"
              >
                <div className="w-3 h-3 flex items-center justify-center"><i className="ri-add-line text-xs" /></div>
                新增{childLabel}子任务
              </button>
            </div>
          )}
        </div>
        {/* Render children */}
        {task.level === 1 && groupedTasks.l2[task.id]?.map((child) => taskCard(child, '2级', 'bg-blue-50/30', true))}
        {task.level === 2 && groupedTasks.l3[task.id]?.map((child) => taskCard(child, '3级', 'bg-emerald-50/30', false))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-steel-900">{mode === 'new' ? '新增任务拆解' : '重新拆解任务'}</h1>
            <p className="text-xs text-steel-400 mt-0.5">{projectName}</p>
          </div>
        </div>

        {mode === 'recompose' && (
          <div className="bg-amber-50 rounded-lg border border-amber-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <i className="ri-information-line text-amber-500" />
              <span className="text-sm text-amber-700">请根据计划变更情况重新拆解全部任务，然后整体提交审核。</span>
            </div>
          </div>
        )}

        {/* Weight validation errors */}
        {errors['level1-weight'] && (
          <div className="bg-red-50 rounded-lg border border-red-200 px-4 py-2">
            <p className="text-sm text-red-600">{errors['level1-weight']}</p>
          </div>
        )}

        {/* Task Editor */}
        <div className="bg-white rounded-lg border border-steel-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-steel-700">任务拆解编辑</span>
            <button
              onClick={() => addTask(1, null)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
            >
              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-add-line text-xs" /></div>
              新增1级任务
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2 rounded-full bg-slate-100">
                <i className="ri-node-tree text-2xl text-steel-300" />
              </div>
              <p className="text-sm text-steel-500">尚未添加任务，请点击「新增1级任务」按钮开始</p>
            </div>
          ) : (
            <div>
              {groupedTasks.l1.map((l1) => taskCard(l1, '1级', 'bg-amber-50/40', true))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
          <div className="flex items-center gap-2">
            {savedDraft && (
              <span className="text-sm text-emerald-600">
                <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-check-line text-xs" /></div>
                草稿已保存
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
            <button onClick={handleSaveDraft} className="px-4 py-2 text-sm text-steel-700 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-save-line text-xs" /></div>
              保存草稿
            </button>
            <button onClick={handlePresent} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <div className="w-4 h-4 flex items-center justify-center inline-flex mr-1"><i className="ri-send-plane-line text-xs" /></div>
              呈核
            </button>
          </div>
        </div>

        <PresentModal isOpen={showPresent} onClose={() => setShowPresent(false)} projectName={projectName} onSubmit={handlePresentSubmit} />
      </div>
    </Layout>
  );
}