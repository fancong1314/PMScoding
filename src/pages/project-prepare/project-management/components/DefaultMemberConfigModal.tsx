import { useEffect, useMemo, useState } from 'react';
import { FormField, formInputCls, formRow2Cls } from '@/components/feature/FormLayout';
import {
  deleteDefaultMemberConfig,
  employees,
  getDefaultMemberConfigs,
  projectMajorTypes,
  projectMinorTypesByMajor,
  saveDefaultMemberConfig,
  type DefaultMemberConfigScheme,
  type DefaultMemberGroupSlot,
  type ProjectMajorType,
} from '@/mocks/projectPrepareMocks';

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyGroup = (): DefaultMemberGroupSlot => ({
  name: '',
  workDuty: '',
  leaderEmployeeId: '',
  leaderName: '',
});

export default function DefaultMemberConfigModal({ open, onClose }: Props) {
  const [schemes, setSchemes] = useState<DefaultMemberConfigScheme[]>([]);
  const [editing, setEditing] = useState<DefaultMemberConfigScheme | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (open) setSchemes(getDefaultMemberConfigs());
  }, [open]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[920px] max-w-[96vw] max-h-[90vh] flex flex-col">
        {toast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <i className="ri-check-line" />
            {toast}
          </div>
        )}

        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-steel-800">默认成员配置</h3>
            <p className="text-xs text-steel-400 mt-0.5">
              按「项目大类 + 小类」配置默认小组与组长；立项后自动套用，管理员再发起完善成员通知
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing({
                id: `dmc_${Date.now()}`,
                name: '',
                majorTypes: [],
                minorTypes: [],
                groups: [emptyGroup()],
                updater: '管理员',
                updatedAt: '',
                enabled: true,
              })}
              className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
            >
              <i className="ri-add-line mr-1" />
              新增配置
            </button>
            <button type="button" onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {editing ? (
            <SchemeEditor
              scheme={editing}
              onCancel={() => setEditing(null)}
              onSave={(next) => {
                const list = saveDefaultMemberConfig(next);
                setSchemes(list);
                setEditing(null);
                showToast('默认成员配置已保存');
              }}
            />
          ) : (
            <div className="space-y-3">
              {schemes.length === 0 ? (
                <div className="py-16 text-center text-sm text-steel-400">暂无默认配置，请点击「新增配置」</div>
              ) : (
                schemes.map((s) => (
                  <div key={s.id} className="border border-steel-200 rounded-lg p-4 hover:border-sky-200 transition-colors">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-steel-800">{s.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${s.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {s.enabled ? '启用' : '停用'}
                          </span>
                          {(s.majorTypes || []).map((mt) => (
                            <span key={mt} className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">{mt}</span>
                          ))}
                        </div>
                        <p className="text-xs text-steel-500 mt-1.5">
                          大类：{(s.majorTypes || []).join('、') || '—'} · 小类：{s.minorTypes.join('、') || '—'}
                        </p>
                        <p className="text-xs text-steel-400 mt-1">
                          默认小组 {s.groups.length} 个 · 更新人 {s.updater} · {s.updatedAt || '—'}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {s.groups.map((g, i) => (
                            <span key={`${s.id}_g_${i}`} className="text-xs px-2 py-1 rounded-md bg-slate-50 border border-steel-100 text-steel-600">
                              {g.name}（组长：{g.leaderName || '未指定'}）
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditing({ ...s, groups: s.groups.map((g) => ({ ...g })) })}
                          className="px-2.5 py-1 text-xs text-primary-600 border border-primary-200 rounded hover:bg-primary-50 cursor-pointer"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const list = deleteDefaultMemberConfig(s.id);
                            setSchemes(list);
                            showToast('配置已删除');
                          }}
                          className="px-2.5 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {!editing && (
          <div className="px-6 py-3 border-t border-steel-200 flex justify-end flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">关闭</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SchemeEditor({
  scheme,
  onCancel,
  onSave,
}: {
  scheme: DefaultMemberConfigScheme;
  onCancel: () => void;
  onSave: (s: DefaultMemberConfigScheme) => void;
}) {
  const [name, setName] = useState(scheme.name);
  const [majorTypes, setMajorTypes] = useState<ProjectMajorType[]>([...(scheme.majorTypes || [])]);
  const [minorTypes, setMinorTypes] = useState<string[]>([...scheme.minorTypes]);
  const [groups, setGroups] = useState<DefaultMemberGroupSlot[]>(scheme.groups.map((g) => ({ ...g })));
  const [enabled, setEnabled] = useState(scheme.enabled);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const minorOptions = useMemo(() => {
    const set = new Set<string>();
    majorTypes.forEach((mt) => {
      (projectMinorTypesByMajor[mt] || []).forEach((m) => set.add(m));
    });
    return [...set];
  }, [majorTypes]);

  const toggleMajor = (m: ProjectMajorType) => {
    setMajorTypes((prev) => {
      const next = prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m];
      const allowed = new Set(next.flatMap((mt) => projectMinorTypesByMajor[mt] || []));
      setMinorTypes((mins) => mins.filter((x) => allowed.has(x)));
      return next;
    });
    setErrors((p) => ({ ...p, majorTypes: '' }));
  };

  const toggleMinor = (m: string) => {
    setMinorTypes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
    setErrors((p) => ({ ...p, minorTypes: '' }));
  };

  const updateGroup = (idx: number, patch: Partial<DefaultMemberGroupSlot>) => {
    setGroups((prev) => prev.map((g, i) => (i === idx ? { ...g, ...patch } : g)));
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = '请输入配置名称';
    if (majorTypes.length === 0) e.majorTypes = '请至少选择一个项目大类';
    if (minorTypes.length === 0) e.minorTypes = '请至少选择一个项目小类';
    if (groups.length === 0) e.groups = '请至少配置一个默认小组';
    groups.forEach((g, i) => {
      if (!g.name.trim()) e[`g_name_${i}`] = '请输入小组名称';
      if (!g.leaderEmployeeId) e[`g_leader_${i}`] = '请选择默认组长';
    });
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({
      ...scheme,
      name: name.trim(),
      majorTypes,
      minorTypes,
      groups: groups.map((g) => ({
        ...g,
        name: g.name.trim(),
        workDuty: g.workDuty.trim().slice(0, 100),
      })),
      enabled,
      updater: '管理员',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-steel-800">{scheme.updatedAt ? '编辑配置方案' : '新增配置方案'}</h4>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">返回列表</button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            保存配置
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <FormField label="配置名称" required error={errors.name} fullWidth>
          <input
            type="text"
            value={name}
            maxLength={40}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
            placeholder="如：新建·信息化/智能化默认配置"
            className={formInputCls(errors.name)}
          />
        </FormField>

        <FormField label="启用状态" fullWidth>
          <label className="inline-flex items-center gap-2 text-sm text-steel-700 cursor-pointer pt-2">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="w-4 h-4 rounded border-steel-300 text-primary-600" />
            {enabled ? '启用（立项自动套用）' : '停用'}
          </label>
        </FormField>

        <FormField label="项目大类" required error={errors.majorTypes} topAlign fullWidth>
          <div className="flex flex-wrap gap-2 pt-1">
            {projectMajorTypes.map((m) => {
              const checked = majorTypes.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMajor(m)}
                  className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer whitespace-nowrap ${
                    checked
                      ? 'bg-violet-50 text-violet-700 border-violet-300'
                      : 'bg-white text-steel-600 border-steel-200 hover:bg-slate-50'
                  }`}
                >
                  {checked && <i className="ri-check-line mr-0.5" />}
                  {m}
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label="项目小类" required error={errors.minorTypes} topAlign fullWidth>
          <div className="flex flex-wrap gap-2 pt-1">
            {majorTypes.length === 0 ? (
              <span className="text-xs text-steel-400 pt-1">请先选择项目大类</span>
            ) : (
              minorOptions.map((m) => {
                const checked = minorTypes.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMinor(m)}
                    className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer whitespace-nowrap ${
                      checked
                        ? 'bg-sky-50 text-sky-700 border-sky-300'
                        : 'bg-white text-steel-600 border-steel-200 hover:bg-slate-50'
                    }`}
                  >
                    {checked && <i className="ri-check-line mr-0.5" />}
                    {m}
                  </button>
                );
              })
            )}
          </div>
        </FormField>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-steel-700">默认小组与组长</span>
          <button
            type="button"
            onClick={() => setGroups((prev) => [...prev, emptyGroup()])}
            className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer"
          >
            <i className="ri-add-line" /> 添加小组
          </button>
        </div>
        {errors.groups && <p className="text-xs text-red-500 mb-2">{errors.groups}</p>}
        <div className="space-y-3">
          {groups.map((g, idx) => (
            <div key={idx} className="border border-steel-200 rounded-lg p-3 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-steel-500">小组 {idx + 1}</span>
                {groups.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setGroups((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-xs text-red-500 cursor-pointer"
                  >
                    移除
                  </button>
                )}
              </div>
              <div className={formRow2Cls}>
                <FormField label="小组名称" required error={errors[`g_name_${idx}`]}>
                  <input
                    type="text"
                    value={g.name}
                    maxLength={40}
                    onChange={(e) => updateGroup(idx, { name: e.target.value })}
                    placeholder="如：领导小组"
                    className={formInputCls(errors[`g_name_${idx}`])}
                  />
                </FormField>
                <FormField label="默认组长" required error={errors[`g_leader_${idx}`]}>
                  <select
                    value={g.leaderEmployeeId}
                    onChange={(e) => {
                      const emp = employees.find((x) => x.id === e.target.value);
                      updateGroup(idx, {
                        leaderEmployeeId: e.target.value,
                        leaderName: emp?.name || '',
                      });
                    }}
                    className={formInputCls(errors[`g_leader_${idx}`])}
                  >
                    <option value="">请选择组长</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name}（{emp.department}）</option>
                    ))}
                  </select>
                </FormField>
              </div>
              <FormField label="工作职责" topAlign>
                <textarea
                  rows={2}
                  maxLength={100}
                  value={g.workDuty}
                  onChange={(e) => updateGroup(idx, { workDuty: e.target.value.slice(0, 100) })}
                  placeholder="小组工作职责（100字以内）"
                  className={formInputCls() + ' resize-none'}
                />
              </FormField>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
