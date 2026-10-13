import {
  formatRuleExpression,
  ruleOperatorOptions,
  type ConditionFieldDef,
  type RuleCondition,
  type RuleExpression,
  type RuleGroup,
  type RuleOperator,
} from '@/mocks/archiveConfigMocks';

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function defaultValueForField(field: ConditionFieldDef | undefined, op: RuleOperator): RuleCondition['value'] {
  if (op === 'EMPTY' || op === 'NOT_EMPTY') return null;
  if (!field) return '';
  if (op === 'IN' || op === 'NOT_IN') return field.options?.[0] ? [field.options[0]] : [];
  if (field.valueType === 'boolean') return true;
  if (field.valueType === 'number') return 0;
  if (field.valueType === 'enum') return field.options?.[0] || '';
  return '';
}

interface ConditionRuleBuilderProps {
  value: RuleExpression;
  onChange: (next: RuleExpression) => void;
  fields: ConditionFieldDef[];
}

export default function ConditionRuleBuilder({ value, onChange, fields }: ConditionRuleBuilderProps) {
  const updateGroup = (groupId: string, patch: Partial<RuleGroup>) => {
    onChange({
      ...value,
      groups: value.groups.map((g) => (g.id === groupId ? { ...g, ...patch } : g)),
    });
  };

  const updateCondition = (groupId: string, condId: string, patch: Partial<RuleCondition>) => {
    onChange({
      ...value,
      groups: value.groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          conditions: g.conditions.map((c) => (c.id === condId ? { ...c, ...patch } : c)),
        };
      }),
    });
  };

  const addCondition = (groupId: string) => {
    const field = fields[0];
    const op: RuleOperator = field?.valueType === 'enum' ? 'IN' : '=';
    const cond: RuleCondition = {
      id: newId('rc'),
      field: field?.code || '',
      op,
      value: defaultValueForField(field, op),
    };
    updateGroup(groupId, {
      conditions: [...(value.groups.find((g) => g.id === groupId)?.conditions || []), cond],
    });
  };

  const removeCondition = (groupId: string, condId: string) => {
    const group = value.groups.find((g) => g.id === groupId);
    if (!group) return;
    updateGroup(groupId, { conditions: group.conditions.filter((c) => c.id !== condId) });
  };

  const addGroup = () => {
    onChange({
      ...value,
      groups: [
        ...value.groups,
        { id: newId('rg'), logic: 'AND', conditions: [] },
      ],
    });
  };

  const removeGroup = (groupId: string) => {
    if (value.groups.length <= 1) return;
    onChange({ ...value, groups: value.groups.filter((g) => g.id !== groupId) });
  };

  const renderValueEditor = (groupId: string, cond: RuleCondition) => {
    const field = fields.find((f) => f.code === cond.field);
    if (cond.op === 'EMPTY' || cond.op === 'NOT_EMPTY') {
      return <span className="text-xs text-slate-400 px-2">无需取值</span>;
    }
    if (field?.valueType === 'boolean') {
      return (
        <select
          value={cond.value === true ? 'true' : 'false'}
          onChange={(e) => updateCondition(groupId, cond.id, { value: e.target.value === 'true' })}
          className="px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white min-w-[100px]"
        >
          <option value="true">是</option>
          <option value="false">否</option>
        </select>
      );
    }
    if (field?.valueType === 'number') {
      return (
        <input
          type="number"
          value={typeof cond.value === 'number' ? cond.value : Number(cond.value) || 0}
          onChange={(e) => updateCondition(groupId, cond.id, { value: Number(e.target.value) })}
          className="px-2 py-1.5 text-xs border border-slate-300 rounded-md w-28"
        />
      );
    }
    if (field?.valueType === 'enum' && (cond.op === 'IN' || cond.op === 'NOT_IN')) {
      const selected = Array.isArray(cond.value) ? cond.value.map(String) : cond.value ? [String(cond.value)] : [];
      return (
        <div className="flex flex-wrap gap-1 max-w-[280px]">
          {(field.options || []).map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const next = active ? selected.filter((x) => x !== opt) : [...selected, opt];
                  updateCondition(groupId, cond.id, { value: next });
                }}
                className={`px-1.5 py-0.5 text-xs rounded border cursor-pointer whitespace-nowrap ${
                  active ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      );
    }
    if (field?.valueType === 'enum') {
      return (
        <select
          value={String(cond.value ?? '')}
          onChange={(e) => updateCondition(groupId, cond.id, { value: e.target.value })}
          className="px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white min-w-[140px]"
        >
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
    return (
      <input
        type="text"
        value={String(cond.value ?? '')}
        onChange={(e) => updateCondition(groupId, cond.id, { value: e.target.value })}
        className="px-2 py-1.5 text-xs border border-slate-300 rounded-md w-40"
        placeholder="请输入"
      />
    );
  };

  const allowedOps = (fieldCode: string): RuleOperator[] => {
    const field = fields.find((f) => f.code === fieldCode);
    if (!field) return ruleOperatorOptions.map((o) => o.value);
    if (field.valueType === 'number') return ['=', '!=', '>', '>=', '<', '<=', 'EMPTY', 'NOT_EMPTY'];
    if (field.valueType === 'boolean') return ['=', '!=', 'EMPTY', 'NOT_EMPTY'];
    if (field.valueType === 'enum') return ['=', '!=', 'IN', 'NOT_IN', 'EMPTY', 'NOT_EMPTY'];
    return ['=', '!=', 'EMPTY', 'NOT_EMPTY'];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">组间逻辑</span>
        <div className="flex items-center gap-1">
          {(['AND', 'OR'] as const).map((logic) => (
            <button
              key={logic}
              type="button"
              onClick={() => onChange({ ...value, logic })}
              className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
                value.logic === logic
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {logic === 'AND' ? '且 (AND)' : '或 (OR)'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={addGroup}
          className="ml-auto px-2.5 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer"
        >
          新增条件组
        </button>
      </div>

      {value.groups.map((group, gi) => (
        <div key={group.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/60 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">条件组 {gi + 1}</span>
            <div className="flex items-center gap-1">
              {(['AND', 'OR'] as const).map((logic) => (
                <button
                  key={logic}
                  type="button"
                  onClick={() => updateGroup(group.id, { logic })}
                  className={`px-2 py-0.5 text-xs rounded border cursor-pointer ${
                    group.logic === logic
                      ? 'bg-white border-emerald-300 text-emerald-700'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  {logic === 'AND' ? '且' : '或'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addCondition(group.id)}
              className="px-2 py-0.5 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer"
            >
              添加条件
            </button>
            {value.groups.length > 1 && (
              <button
                type="button"
                onClick={() => removeGroup(group.id)}
                className="ml-auto px-2 py-0.5 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 cursor-pointer"
              >
                删除组
              </button>
            )}
          </div>

          {group.conditions.length === 0 ? (
            <p className="text-xs text-slate-400 py-2 text-center">暂无条件，请点击「添加条件」</p>
          ) : (
            <div className="space-y-2">
              {group.conditions.map((cond) => (
                <div key={cond.id} className="flex flex-wrap items-start gap-2 bg-white border border-slate-200 rounded-md p-2">
                  <select
                    value={cond.field}
                    onChange={(e) => {
                      const field = fields.find((f) => f.code === e.target.value);
                      const ops = allowedOps(e.target.value);
                      const op = ops.includes(cond.op) ? cond.op : ops[0];
                      updateCondition(group.id, cond.id, {
                        field: e.target.value,
                        op,
                        value: defaultValueForField(field, op),
                      });
                    }}
                    className="px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white min-w-[120px]"
                  >
                    {fields.map((f) => (
                      <option key={f.code} value={f.code}>{f.name}</option>
                    ))}
                  </select>
                  <select
                    value={cond.op}
                    onChange={(e) => {
                      const op = e.target.value as RuleOperator;
                      const field = fields.find((f) => f.code === cond.field);
                      updateCondition(group.id, cond.id, {
                        op,
                        value: defaultValueForField(field, op),
                      });
                    }}
                    className="px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white min-w-[100px]"
                  >
                    {allowedOps(cond.field).map((op) => {
                      const label = ruleOperatorOptions.find((o) => o.value === op)?.label || op;
                      return <option key={op} value={op}>{label}</option>;
                    })}
                  </select>
                  {renderValueEditor(group.id, cond)}
                  <button
                    type="button"
                    onClick={() => removeCondition(group.id, cond.id)}
                    className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded cursor-pointer ml-auto"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600 leading-relaxed">
        <span className="font-medium text-slate-700">规则预览：</span>
        {formatRuleExpression(value)}
      </div>
    </div>
  );
}
