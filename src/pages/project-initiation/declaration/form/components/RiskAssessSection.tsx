import { useState } from 'react';
import type { RiskAssessRow } from '@/mocks/projectPlans';
import { defaultRiskAssessRows } from '@/mocks/projectPlans';
import {
  argumentRiskLevels,
  argumentRiskStatuses,
  argumentRiskCategories,
  argumentRiskStrategies,
} from '@/mocks/argumentApplyMocks';

interface Props {
  rows?: RiskAssessRow[];
  onChange: (rows: RiskAssessRow[]) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  readonly?: boolean;
}

const emptyRow = (seq: number): RiskAssessRow => ({
  id: `risk_${Date.now()}_${seq}`,
  seq,
  risk: '',
  riskLevel: '低',
  riskStatus: '已识别',
  riskCategory: '技术风险',
  impactLevel: '一般',
  severity: '低',
  riskType: '内部风险',
  riskDesc: '',
  cause: '',
  currentMeasure: '',
  strategy: '减轻',
  suggestMeasure: '',
  execDept: '',
});

export default function RiskAssessSection({ rows: controlledRows, onChange, sectionRef, readonly }: Props) {
  const rows = controlledRows ?? defaultRiskAssessRows;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const setRows = (next: RiskAssessRow[]) => onChange(next);

  const handleAdd = () => {
    if (readonly) return;
    const newRow = emptyRow(rows.length + 1);
    setRows([...rows, newRow]);
    setSelectedId(newRow.id);
    setEditingId(newRow.id);
  };

  const handleDelete = () => {
    if (readonly || !selectedId) return;
    setRows(rows.filter((r) => r.id !== selectedId).map((r, i) => ({ ...r, seq: i + 1 })));
    if (editingId === selectedId) setEditingId(null);
    setSelectedId(null);
  };

  const handleChange = (id: string, field: keyof RiskAssessRow, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const selectCls = 'w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none bg-white cursor-pointer';
  const inputCls = 'w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none bg-white';
  const textareaCls = 'w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none bg-white resize-none';

  const headers = [
    '序号', '风险', '风险等级', '风险状态', '风险分类', '影响等级/后果', '严重程度', '风险类别',
    '风险描述', '原因', '现行控制措施', '应对策略', '建议改进措施', '执行部门',
  ];

  return (
    <div id="risk-assess" ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-shield-check-line text-emerald-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">风险与机遇评估</h3>
        <span className="text-xs text-steel-400 ml-1">识别风险并制定应对措施</span>
      </div>

      <div className="p-5">
        {!readonly && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              <i className="ri-add-line" /> 新增行
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!selectedId}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              <i className="ri-delete-bin-line" /> 删除行
            </button>
            <span className="ml-auto text-xs text-steel-400">共 {rows.length} 条</span>
          </div>
        )}

        <div className="border border-steel-200 rounded-lg overflow-x-auto">
          <table className="text-left" style={{ minWidth: 1600 }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                {headers.map((h) => (
                  <th key={h} className="px-2 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">{h}</th>
                ))}
                {!readonly && <th className="px-2 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">操作</th>}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={readonly ? 14 : 15} className="px-3 py-8 text-center text-xs text-steel-400">暂无数据</td>
                </tr>
              ) : (
                rows.map((row) => {
                  const isEditing = !readonly && editingId === row.id;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => !readonly && setSelectedId(row.id)}
                      className={`border-b border-steel-100 transition-colors ${
                        selectedId === row.id ? 'bg-primary-50' : 'hover:bg-slate-50'
                      } ${readonly ? '' : 'cursor-pointer'}`}
                    >
                      <td className="px-2 py-1.5 text-xs text-steel-500 w-10">{row.seq}</td>
                      <td className="px-2 py-1.5 w-28">
                        {isEditing ? <input value={row.risk} onChange={(e) => handleChange(row.id, 'risk', e.target.value)} className={inputCls} onClick={(e) => e.stopPropagation()} /> : <span className="text-xs">{row.risk || '—'}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-20">
                        {isEditing ? (
                          <select value={row.riskLevel} onChange={(e) => handleChange(row.id, 'riskLevel', e.target.value)} className={selectCls} onClick={(e) => e.stopPropagation()}>
                            {argumentRiskLevels.map((v) => <option key={v}>{v}</option>)}
                          </select>
                        ) : (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${row.riskLevel === '高' ? 'bg-red-100 text-red-700' : row.riskLevel === '中' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {row.riskLevel}
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-1.5 w-20">
                        {isEditing ? (
                          <select value={row.riskStatus} onChange={(e) => handleChange(row.id, 'riskStatus', e.target.value)} className={selectCls} onClick={(e) => e.stopPropagation()}>
                            {argumentRiskStatuses.map((v) => <option key={v}>{v}</option>)}
                          </select>
                        ) : <span className="text-xs">{row.riskStatus}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-24">
                        {isEditing ? (
                          <select value={row.riskCategory} onChange={(e) => handleChange(row.id, 'riskCategory', e.target.value)} className={selectCls} onClick={(e) => e.stopPropagation()}>
                            {argumentRiskCategories.map((v) => <option key={v}>{v}</option>)}
                          </select>
                        ) : <span className="text-xs">{row.riskCategory}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-24">
                        {isEditing ? <input value={row.impactLevel} onChange={(e) => handleChange(row.id, 'impactLevel', e.target.value)} className={inputCls} onClick={(e) => e.stopPropagation()} /> : <span className="text-xs">{row.impactLevel || '—'}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-20">
                        {isEditing ? <input value={row.severity} onChange={(e) => handleChange(row.id, 'severity', e.target.value)} className={inputCls} onClick={(e) => e.stopPropagation()} /> : <span className="text-xs">{row.severity || '—'}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-24">
                        {isEditing ? <input value={row.riskType} onChange={(e) => handleChange(row.id, 'riskType', e.target.value)} className={inputCls} onClick={(e) => e.stopPropagation()} /> : <span className="text-xs">{row.riskType || '—'}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-40">
                        {isEditing ? <textarea value={row.riskDesc} onChange={(e) => handleChange(row.id, 'riskDesc', e.target.value)} rows={2} className={textareaCls} onClick={(e) => e.stopPropagation()} /> : <span className="text-xs">{row.riskDesc || '—'}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-40">
                        {isEditing ? <textarea value={row.cause} onChange={(e) => handleChange(row.id, 'cause', e.target.value)} rows={2} className={textareaCls} onClick={(e) => e.stopPropagation()} /> : <span className="text-xs">{row.cause || '—'}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-40">
                        {isEditing ? <textarea value={row.currentMeasure} onChange={(e) => handleChange(row.id, 'currentMeasure', e.target.value)} rows={2} className={textareaCls} onClick={(e) => e.stopPropagation()} /> : <span className="text-xs">{row.currentMeasure || '—'}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-20">
                        {isEditing ? (
                          <select value={row.strategy} onChange={(e) => handleChange(row.id, 'strategy', e.target.value)} className={selectCls} onClick={(e) => e.stopPropagation()}>
                            {argumentRiskStrategies.map((v) => <option key={v}>{v}</option>)}
                          </select>
                        ) : <span className="text-xs">{row.strategy}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-40">
                        {isEditing ? <textarea value={row.suggestMeasure} onChange={(e) => handleChange(row.id, 'suggestMeasure', e.target.value)} rows={2} className={textareaCls} onClick={(e) => e.stopPropagation()} /> : <span className="text-xs">{row.suggestMeasure || '—'}</span>}
                      </td>
                      <td className="px-2 py-1.5 w-24">
                        {isEditing ? <input value={row.execDept} onChange={(e) => handleChange(row.id, 'execDept', e.target.value)} className={inputCls} onClick={(e) => e.stopPropagation()} /> : <span className="text-xs">{row.execDept || '—'}</span>}
                      </td>
                      {!readonly && (
                        <td className="px-2 py-1.5 w-20">
                          {isEditing ? (
                            <button type="button" onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="text-xs text-green-600 hover:underline cursor-pointer">保存</button>
                          ) : (
                            <button type="button" onClick={(e) => { e.stopPropagation(); setEditingId(row.id); setSelectedId(row.id); }} className="text-xs text-primary-600 hover:underline cursor-pointer">编辑</button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
