import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/feature/Layout';
import { FormField, FormSection, formInputCls, formRow2Cls } from '@/components/feature/FormLayout';
import { projectMajorTypes, type ProjectMajorType } from '@/mocks/projectPrepareMocks';
import {
  PERMIT_MINOR_TYPE_OPTIONS,
  createEmptyStage,
  deleteApprovalPermitScheme,
  getAllStageCatalog,
  getApprovalPermitSchemes,
  getExtraStages,
  saveApprovalPermitScheme,
  saveExtraStage,
  type ApprovalPermitScheme,
  type PermitStageDef,
  type PermitStageDoc,
  type PermitStageGuide,
} from '@/mocks/approvalPermitConfigMocks';

function cloneStage(def: PermitStageDef): PermitStageDef {
  return {
    ...def,
    docs: def.docs.map((d) => ({ ...d })),
    guide: { ...def.guide },
  };
}

function emptyScheme(): ApprovalPermitScheme {
  return {
    id: `aps_${Date.now()}`,
    name: '',
    majorTypes: ['新建'],
    minorTypes: [],
    stageKeys: ['project_record'],
    stageOverrides: {},
    updater: '管理员',
    updatedAt: '',
    enabled: true,
  };
}

export default function ApprovalPermitConfigPage() {
  const [schemes, setSchemes] = useState<ApprovalPermitScheme[]>(() => getApprovalPermitSchemes());
  const [extraTick, setExtraTick] = useState(0);
  const catalog = useMemo(() => getAllStageCatalog(), [extraTick]);
  const [selectedId, setSelectedId] = useState(schemes[0]?.id || '');
  const [selectedStageKey, setSelectedStageKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    schemes[0] ? { [schemes[0].id]: true } : {},
  );
  const [keyword, setKeyword] = useState('');
  const [toast, setToast] = useState('');
  const [addStageOpen, setAddStageOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const filtered = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return schemes;
    return schemes.filter((s) =>
      s.name.includes(kw) || s.majorTypes.some((m) => m.includes(kw)) || s.minorTypes.some((m) => m.includes(kw)),
    );
  }, [schemes, keyword]);

  const display = filtered.length > 0 ? filtered : schemes;

  const groups = useMemo(() => {
    const map = new Map<string, ApprovalPermitScheme[]>();
    display.forEach((s) => {
      const label = s.majorTypes.join(' / ') || '未分类';
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(s);
    });
    return [...map.entries()];
  }, [display]);

  const selected = schemes.find((s) => s.id === selectedId) || null;

  const selectScheme = (id: string, stageKey: string | null = null) => {
    setSelectedId(id);
    setSelectedStageKey(stageKey);
    setExpanded((prev) => ({ ...prev, [id]: true }));
  };

  const handleNew = () => {
    const draft = emptyScheme();
    setSchemes((prev) => [draft, ...prev]);
    selectScheme(draft.id, null);
  };

  const handleSave = (next: ApprovalPermitScheme) => {
    const list = saveApprovalPermitScheme(next);
    setSchemes(list);
    setSelectedId(next.id);
    showToast('报批报建配置已保存');
  };

  const handleDeleteScheme = (id: string) => {
    const list = deleteApprovalPermitScheme(id);
    setSchemes(list);
    if (selectedId === id) {
      setSelectedId(list[0]?.id || '');
      setSelectedStageKey(null);
    }
    showToast('配置方案已删除');
  };

  return (
    <Layout>
      <div className="space-y-3">
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <i className="ri-check-line" />
            {toast}
          </div>
        )}
        <div>
          <h1 className="text-lg font-semibold text-steel-900">报批报建配置管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">左侧选择方案与阶段，右侧新增或维护适用类型、适用阶段、办结附件与办理指引</p>
        </div>

        <div className="flex gap-4 items-stretch" style={{ minHeight: 'calc(100vh - 180px)' }}>
          <aside className="w-[300px] flex-shrink-0 bg-white rounded-lg border border-steel-200 overflow-hidden flex flex-col">
            <div className="px-3 py-3 border-b border-steel-100 space-y-2">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className={formInputCls()}
                placeholder="搜索方案 / 类型"
              />
              {filtered.length === 0 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1">
                  未匹配到方案，已回退展示全部 {schemes.length} 条
                </p>
              )}
              <button
                type="button"
                onClick={handleNew}
                className="w-full px-3 py-1.5 text-xs text-white rounded-md cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                <i className="ri-add-line mr-1" />
                新增配置方案
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {groups.map(([group, list]) => (
                <div key={group} className="mb-1">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-steel-400 uppercase tracking-wide">{group}</div>
                  {list.map((s) => {
                    const open = !!expanded[s.id];
                    const active = selectedId === s.id;
                    const stageDefs = s.stageKeys.map((k) => catalog.find((d) => d.key === k)).filter(Boolean) as PermitStageDef[];
                    return (
                      <div key={s.id}>
                        <div className={`flex items-center group ${active && !selectedStageKey ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
                          <button
                            type="button"
                            onClick={() => setExpanded((p) => ({ ...p, [s.id]: !open }))}
                            className="w-7 h-8 flex items-center justify-center text-steel-400 cursor-pointer flex-shrink-0"
                          >
                            <i className={open ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => selectScheme(s.id, null)}
                            className="flex-1 min-w-0 py-1.5 pr-2 text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <i className="ri-folder-3-line text-amber-500 text-sm" />
                              <span className={`text-sm truncate ${active ? 'text-primary-700 font-medium' : 'text-steel-800'}`}>{s.name || '未命名方案'}</span>
                            </div>
                            <div className="pl-5 mt-0.5 flex items-center gap-1">
                              <span className={`text-[10px] px-1.5 rounded ${s.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{s.enabled ? '启用' : '停用'}</span>
                              <span className="text-[10px] text-steel-400">{s.stageKeys.length} 个阶段</span>
                            </div>
                          </button>
                        </div>
                        {open && stageDefs.map((d) => (
                          <button
                            key={d.key}
                            type="button"
                            onClick={() => selectScheme(s.id, d.key)}
                            className={`w-full flex items-center gap-2 pl-10 pr-3 py-1.5 text-left cursor-pointer ${active && selectedStageKey === d.key ? 'bg-primary-50 text-primary-700' : 'text-steel-600 hover:bg-slate-50'}`}
                          >
                            <i className={`${d.icon} text-xs`} />
                            <span className="text-xs truncate">{d.name}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {!selected ? (
              <div className="h-full bg-white rounded-lg border border-steel-200 flex flex-col items-center justify-center text-sm text-steel-400">
                <i className="ri-node-tree text-3xl mb-2 text-steel-300" />
                请在左侧选择方案，或新增配置方案
              </div>
            ) : selectedStageKey ? (
              <StageDetailPanel
                key={`${selected.id}_${selectedStageKey}`}
                scheme={selected}
                stageKey={selectedStageKey}
                catalog={catalog}
                onSave={handleSave}
                onBack={() => setSelectedStageKey(null)}
              />
            ) : (
              <SchemeMetaPanel
                key={selected.id}
                scheme={selected}
                catalog={catalog}
                onSave={handleSave}
                onDelete={() => handleDeleteScheme(selected.id)}
                onOpenStage={(k) => setSelectedStageKey(k)}
                onOpenAddStage={() => setAddStageOpen(true)}
              />
            )}
          </main>
        </div>
      </div>

      {addStageOpen && selected && (
        <AddStageModal
          catalog={catalog}
          onClose={() => setAddStageOpen(false)}
          onCreate={(stage) => {
            saveExtraStage(stage);
            setExtraTick((t) => t + 1);
            const nextKeys = selected.stageKeys.includes(stage.key) ? selected.stageKeys : [...selected.stageKeys, stage.key];
            const saved = saveApprovalPermitScheme({ ...selected, stageKeys: nextKeys });
            setSchemes(saved);
            setAddStageOpen(false);
            selectScheme(selected.id, stage.key);
            showToast(`已增加适用阶段「${stage.name}」`);
          }}
        />
      )}
    </Layout>
  );
}

function SchemeMetaPanel({
  scheme,
  catalog,
  onSave,
  onDelete,
  onOpenStage,
  onOpenAddStage,
}: {
  scheme: ApprovalPermitScheme;
  catalog: PermitStageDef[];
  onSave: (s: ApprovalPermitScheme) => void;
  onDelete: () => void;
  onOpenStage: (k: string) => void;
  onOpenAddStage: () => void;
}) {
  const [name, setName] = useState(scheme.name);
  const [majorTypes, setMajorTypes] = useState<ProjectMajorType[]>([...scheme.majorTypes]);
  const [minorTypes, setMinorTypes] = useState<string[]>([...scheme.minorTypes]);
  const [stageKeys, setStageKeys] = useState<string[]>([...scheme.stageKeys]);
  const [enabled, setEnabled] = useState(scheme.enabled);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(scheme.name);
    setMajorTypes([...scheme.majorTypes]);
    setMinorTypes([...scheme.minorTypes]);
    setStageKeys([...scheme.stageKeys]);
    setEnabled(scheme.enabled);
    setErrors({});
  }, [scheme]);

  const toggle = <T,>(list: T[], v: T, set: (n: T[]) => void) => {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = '请输入方案名称';
    if (majorTypes.length === 0) e.majorTypes = '请选择一级类型';
    if (minorTypes.length === 0) e.minorTypes = '请选择二级类型';
    if (stageKeys.length === 0) e.stageKeys = '请至少配置一个适用阶段';
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({ ...scheme, name: name.trim(), majorTypes, minorTypes, stageKeys, enabled });
  };

  return (
    <div className="h-full overflow-y-auto space-y-4">
      <FormSection title="方案配置" icon="ri-settings-3-line" subtitle="维护适用类型与适用阶段">
      <div className="flex justify-end gap-2 -mt-1 mb-1">
        <button type="button" onClick={onDelete} className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer">删除方案</button>
        <button type="button" onClick={handleSave} className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>保存配置</button>
      </div>
      <FormField label="方案名称" required error={errors.name} fullWidth>
        <input value={name} onChange={(e) => setName(e.target.value)} className={formInputCls(errors.name)} placeholder="如：新建/技改 · 基建工程、技术改造" />
      </FormField>
      <div className={formRow2Cls}>
        <FormField label="启用状态">
          <span className="inline-flex items-center gap-2 text-sm text-steel-700 cursor-pointer pt-2">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="w-4 h-4 rounded cursor-pointer" />
            {enabled ? '启用' : '停用'}
          </span>
        </FormField>
      </div>
      <FormField label="一级类型" required error={errors.majorTypes} topAlign fullWidth>
        <div className="flex flex-wrap gap-2 pt-1">
          {projectMajorTypes.map((m) => {
            const on = majorTypes.includes(m);
            return (
              <button key={m} type="button" onClick={() => toggle(majorTypes, m, setMajorTypes)} className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${on ? 'bg-violet-50 text-violet-700 border-violet-300' : 'bg-white text-steel-600 border-steel-200'}`}>
                {on && <i className="ri-check-line mr-0.5" />}{m}
              </button>
            );
          })}
        </div>
      </FormField>
      <FormField label="二级类型" required error={errors.minorTypes} topAlign fullWidth>
        <div className="flex flex-wrap gap-2 pt-1">
          {PERMIT_MINOR_TYPE_OPTIONS.map((m) => {
            const on = minorTypes.includes(m);
            return (
              <button key={m} type="button" onClick={() => toggle(minorTypes, m, setMinorTypes)} className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${on ? 'bg-sky-50 text-sky-700 border-sky-300' : 'bg-white text-steel-600 border-steel-200'}`}>
                {on && <i className="ri-check-line mr-0.5" />}{m}
              </button>
            );
          })}
        </div>
      </FormField>
      <FormField label="适用阶段" required error={errors.stageKeys} topAlign fullWidth>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 pt-1">
            {catalog.map((d) => {
              const on = stageKeys.includes(d.key);
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => {
                    const next = on ? stageKeys.filter((k) => k !== d.key) : [...stageKeys, d.key];
                    setStageKeys(next);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${on ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-steel-600 border-steel-200'}`}
                >
                  {on && <i className="ri-check-line mr-0.5" />}{d.name}
                </button>
              );
            })}
          </div>
          <button type="button" onClick={onOpenAddStage} className="text-xs text-primary-600 cursor-pointer">
            <i className="ri-add-line" /> 手动增加适用阶段
          </button>
          {stageKeys.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {stageKeys.map((k) => {
                const def = catalog.find((d) => d.key === k);
                return (
                  <button key={k} type="button" onClick={() => onOpenStage(k)} className="text-xs px-2 py-1 rounded-md bg-slate-50 border border-steel-100 text-steel-600 hover:border-primary-200 hover:text-primary-700 cursor-pointer">
                    配置 {def?.name || k}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </FormField>
      </FormSection>
    </div>
  );
}

function StageDetailPanel({
  scheme,
  stageKey,
  catalog,
  onSave,
  onBack,
}: {
  scheme: ApprovalPermitScheme;
  stageKey: string;
  catalog: PermitStageDef[];
  onSave: (s: ApprovalPermitScheme) => void;
  onBack: () => void;
}) {
  const base = catalog.find((d) => d.key === stageKey);
  const initial = useMemo(() => {
    if (!base) return null;
    const ov = scheme.stageOverrides?.[stageKey];
    return {
      ...base,
      docs: (ov?.docs ?? base.docs).map((d) => ({ ...d })),
      guide: { ...(ov?.guide ?? base.guide) },
    };
  }, [base, scheme, stageKey]);

  const [docs, setDocs] = useState<PermitStageDoc[]>(initial?.docs || []);
  const [guide, setGuide] = useState<PermitStageGuide>(initial?.guide || {
    prepItems: '', resultFiles: '', handleDept: '', govDept: '', notes: '', remark: '', templateFile: '',
  });

  if (!base || !initial) {
    return (
      <div className="bg-white rounded-lg border border-steel-200 p-10 text-center text-sm text-steel-400">
        未找到该阶段定义
      </div>
    );
  }

  const handleSave = () => {
    onSave({
      ...scheme,
      stageOverrides: {
        ...(scheme.stageOverrides || {}),
        [stageKey]: { docs, guide },
      },
    });
  };

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden h-full flex flex-col">
      <div className="px-5 py-3 border-b border-steel-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="text-xs text-steel-500 hover:text-primary-600 cursor-pointer">
            <i className="ri-arrow-left-line mr-0.5" />返回方案
          </button>
          <span className="text-sm font-semibold text-steel-800">{base.name}</span>
        </div>
        <button type="button" onClick={handleSave} className="px-3 py-1.5 text-xs text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>保存阶段配置</button>
      </div>
      <div className="p-5 space-y-5 overflow-y-auto">
        <h4 className="text-sm font-semibold text-steel-800">办结附件 · {base.name}</h4>
        <div className="space-y-3">
          {docs.map((doc, idx) => (
            <div key={doc.id} className="border border-steel-200 rounded-lg p-3 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-steel-400">附件 {idx + 1}</span>
                {docs.length > 1 && (
                  <button type="button" className="text-xs text-red-500 cursor-pointer" onClick={() => setDocs(docs.filter((x) => x.id !== doc.id))}>移除</button>
                )}
              </div>
              <FormField label="办结文件" required>
                <input value={doc.docName} onChange={(e) => setDocs(docs.map((x) => (x.id === doc.id ? { ...x, docName: e.target.value } : x)))} className={formInputCls()} placeholder="如：备案证、施工许可证" />
              </FormField>
              <FormField label="备注" topAlign>
                <textarea rows={2} value={doc.remark} onChange={(e) => setDocs(docs.map((x) => (x.id === doc.id ? { ...x, remark: e.target.value } : x)))} className={formInputCls() + ' resize-none'} />
              </FormField>
              <FormField label="附件模板">
                <input value={doc.templateFile} onChange={(e) => setDocs(docs.map((x) => (x.id === doc.id ? { ...x, templateFile: e.target.value } : x)))} className={formInputCls()} placeholder="如：施工许可证申请表.docx" />
              </FormField>
              <label className="ml-[142px] inline-flex items-center gap-2 text-sm text-steel-600 cursor-pointer">
                <input type="checkbox" checked={doc.required} onChange={(e) => setDocs(docs.map((x) => (x.id === doc.id ? { ...x, required: e.target.checked } : x)))} />
                必填
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDocs([...docs, { ...cloneStage(base).docs[0], id: `d_${Date.now()}`, docName: '新办结文件', remark: '', templateFile: '' }])}
            className="text-xs text-primary-600 cursor-pointer"
          >
            <i className="ri-add-line" /> 添加办结附件
          </button>
        </div>

        <h4 className="text-sm font-semibold text-steel-800 pt-2">办理指引 · {base.name}</h4>
        <FormField label="准备事项" topAlign fullWidth>
          <textarea rows={5} value={guide.prepItems} onChange={(e) => setGuide({ ...guide, prepItems: e.target.value })} className={formInputCls() + ' resize-none'} />
        </FormField>
        <FormField label="办结文件" topAlign fullWidth>
          <textarea rows={3} value={guide.resultFiles} onChange={(e) => setGuide({ ...guide, resultFiles: e.target.value })} className={formInputCls() + ' resize-none'} />
        </FormField>
        <div className={formRow2Cls}>
          <FormField label="办理部门">
            <input value={guide.handleDept} onChange={(e) => setGuide({ ...guide, handleDept: e.target.value })} className={formInputCls()} />
          </FormField>
          <FormField label="政府归口部门">
            <input value={guide.govDept} onChange={(e) => setGuide({ ...guide, govDept: e.target.value })} className={formInputCls()} />
          </FormField>
        </div>
        <FormField label="注意事项" topAlign fullWidth>
          <textarea rows={4} value={guide.notes} onChange={(e) => setGuide({ ...guide, notes: e.target.value })} className={formInputCls() + ' resize-none'} />
        </FormField>
        <FormField label="备注" topAlign fullWidth>
          <textarea rows={2} value={guide.remark} onChange={(e) => setGuide({ ...guide, remark: e.target.value })} className={formInputCls() + ' resize-none'} />
        </FormField>
        <FormField label="附件模板" fullWidth>
          <input value={guide.templateFile} onChange={(e) => setGuide({ ...guide, templateFile: e.target.value })} className={formInputCls()} placeholder="指引中展示的模板文件名" />
        </FormField>
      </div>
    </div>
  );
}

function AddStageModal({
  catalog,
  onClose,
  onCreate,
}: {
  catalog: PermitStageDef[];
  onClose: () => void;
  onCreate: (stage: PermitStageDef) => void;
}) {
  const extras = getExtraStages();
  const [name, setName] = useState('');
  const [copyKey, setCopyKey] = useState('');
  const [error, setError] = useState('');

  const handleOk = () => {
    if (!name.trim()) {
      setError('请输入阶段名称');
      return;
    }
    if (catalog.some((d) => d.name === name.trim())) {
      setError('该阶段名称已存在，请直接在适用阶段中勾选');
      return;
    }
    const src = catalog.find((d) => d.key === copyKey);
    const created = createEmptyStage(name.trim(), 80 + extras.length);
    if (src) {
      created.icon = src.icon;
      created.docs = src.docs.map((d) => ({ ...d, id: `d_${created.key}_${d.id}` }));
      created.guide = { ...src.guide };
    }
    onCreate(created);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[480px] max-w-[95vw]">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-steel-800">增加适用阶段</h3>
          <button type="button" onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <FormField label="阶段名称" required error={error} fullWidth>
            <input value={name} onChange={(e) => { setName(e.target.value); setError(''); }} className={formInputCls(error)} placeholder="如：不动产权证办理、消防验收" />
          </FormField>
          <FormField label="复制已有阶段" fullWidth>
            <select value={copyKey} onChange={(e) => setCopyKey(e.target.value)} className={formInputCls() + ' cursor-pointer'}>
              <option value="">不复制，使用空白模板</option>
              {catalog.map((d) => (
                <option key={d.key} value={d.key}>{d.name}</option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">取消</button>
          <button type="button" onClick={handleOk} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>确定</button>
        </div>
      </div>
    </div>
  );
}
