import { useState } from 'react';
import { argumentRiskLevels, argumentRiskStatuses, argumentRiskCategories, argumentRiskStrategies } from '@/mocks/argumentApplyMocks';

interface RiskRow {
  id: string;
  seq: number;
  risk: string;
  riskLevel: string;
  riskStatus: string;
  riskCategory: string;
  impactLevel: string;
  severity: string;
  riskType: string;
  riskDesc: string;
  cause: string;
  currentMeasure: string;
  strategy: string;
  suggestMeasure: string;
  execDept: string;
  deadline: string;
  updatedSeverity: string;
  updatedRiskType: string;
  updatedRiskDesc: string;
  effectiveness: string;
}

const initRows: RiskRow[] = [
  {
    id: '1', seq: 1, risk: '设备采购延期', riskLevel: '高', riskStatus: '处理中', riskCategory: '进度风险',
    impactLevel: '重大', severity: '高', riskType: '外部风险', riskDesc: '主要设备供货周期长，可能导致项目延期',
    cause: '供应商产能不足，原材料短缺', currentMeasure: '提前签订采购合同，备选供应商', strategy: '减轻',
    suggestMeasure: '增加备选供应商，建立应急采购机制', execDept: '采购部', deadline: '2026-06-30',
    updatedSeverity: '中', updatedRiskType: '外部风险', updatedRiskDesc: '已签订合同，风险降低', effectiveness: '有效',
  },
  {
    id: '2', seq: 2, risk: '施工安全事故', riskLevel: '中', riskStatus: '已识别', riskCategory: '安全风险',
    impactLevel: '严重', severity: '中', riskType: '内部风险', riskDesc: '高空作业、动火作业存在安全隐患',
    cause: '施工人员安全意识不足', currentMeasure: '安全培训、安全检查', strategy: '减轻',
    suggestMeasure: '加强安全监督，配备专职安全员', execDept: '安全环保部', deadline: '2026-12-31',
    updatedSeverity: '低', updatedRiskType: '内部风险', updatedRiskDesc: '安全措施到位', effectiveness: '有效',
  },
];

export default function RiskAssessTable() {
  const [rows, setRows] = useState<RiskRow[]>(initRows);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newRow: RiskRow = {
      id: Date.now().toString(), seq: rows.length + 1, risk: '', riskLevel: '低', riskStatus: '已识别',
      riskCategory: '技术风险', impactLevel: '一般', severity: '低', riskType: '内部风险', riskDesc: '',
      cause: '', currentMeasure: '', strategy: '减轻', suggestMeasure: '', execDept: '', deadline: '',
      updatedSeverity: '', updatedRiskType: '', updatedRiskDesc: '', effectiveness: '',
    };
    setRows((prev) => [...prev, newRow]);
    setEditingId(newRow.id);
  };

  const handleDelete = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id).map((r, i) => ({ ...r, seq: i + 1 })));
    if (editingId === id) setEditingId(null);
  };

  const handleChange = (id: string, field: keyof RiskRow, value: string) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const selectCls = 'w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none bg-white cursor-pointer';
  const inputCls = 'w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none bg-white';
  const textareaCls = 'w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none bg-white resize-none';

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
          <i className="ri-add-line" /> 新增行
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-md cursor-pointer whitespace-nowrap hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
          <i className="ri-delete-bin-line" /> 删除行
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-arrow-up-line" /> 上移
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-arrow-down-line" /> 下移
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-download-line" /> 导入模板
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md cursor-pointer whitespace-nowrap hover:bg-slate-50">
          <i className="ri-upload-line" /> 导入数据
        </button>
        <span className="ml-auto text-xs text-steel-400">查询成功</span>
      </div>
      <div className="border border-steel-200 rounded-lg overflow-hidden overflow-x-auto">
        <table className="text-left" style={{ minWidth: '2000px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
              {['序号','风险','风险等级','风险状态','风险分类','影响等级/后果','严重程度','风险类别','风险描述','原因','现行控制措施','应对策略','建议改进措施','执行部门','时效','严重程度(更新)','类别(更新)','描述(更新)','措施有效性','操作'].map((h) => (
                <th key={h} className="px-2 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={20} className="px-3 py-8 text-center text-xs text-steel-400">暂无数据</td>
              </tr>
            ) : (
              rows.map((row) => {
                const isEditing = editingId === row.id;
                return (
                  <tr key={row.id} className="border-b border-steel-100 hover:bg-slate-50">
                    <td className="px-2 py-1.5 text-xs text-steel-500 w-10">{row.seq}</td>
                    <td className="px-2 py-1.5 w-28">{isEditing ? <input value={row.risk} onChange={(e) => handleChange(row.id, 'risk', e.target.value)} className={inputCls} /> : <span className="text-xs">{row.risk}</span>}</td>
                    <td className="px-2 py-1.5 w-20">{isEditing ? <select value={row.riskLevel} onChange={(e) => handleChange(row.id, 'riskLevel', e.target.value)} className={selectCls}>{argumentRiskLevels.map((v) => <option key={v}>{v}</option>)}</select> : <span className={`text-xs px-1.5 py-0.5 rounded-full ${row.riskLevel === '高' ? 'bg-red-100 text-red-700' : row.riskLevel === '中' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{row.riskLevel}</span>}</td>
                    <td className="px-2 py-1.5 w-20">{isEditing ? <select value={row.riskStatus} onChange={(e) => handleChange(row.id, 'riskStatus', e.target.value)} className={selectCls}>{argumentRiskStatuses.map((v) => <option key={v}>{v}</option>)}</select> : <span className="text-xs">{row.riskStatus}</span>}</td>
                    <td className="px-2 py-1.5 w-24">{isEditing ? <select value={row.riskCategory} onChange={(e) => handleChange(row.id, 'riskCategory', e.target.value)} className={selectCls}>{argumentRiskCategories.map((v) => <option key={v}>{v}</option>)}</select> : <span className="text-xs">{row.riskCategory}</span>}</td>
                    <td className="px-2 py-1.5 w-20">{isEditing ? <input value={row.impactLevel} onChange={(e) => handleChange(row.id, 'impactLevel', e.target.value)} className={inputCls} /> : <span className="text-xs">{row.impactLevel}</span>}</td>
                    <td className="px-2 py-1.5 w-20">{isEditing ? <input value={row.severity} onChange={(e) => handleChange(row.id, 'severity', e.target.value)} className={inputCls} /> : <span className="text-xs">{row.severity}</span>}</td>
                    <td className="px-2 py-1.5 w-24">{isEditing ? <input value={row.riskType} onChange={(e) => handleChange(row.id, 'riskType', e.target.value)} className={inputCls} /> : <span className="text-xs">{row.riskType}</span>}</td>
                    <td className="px-2 py-1.5 w-40">{isEditing ? <textarea value={row.riskDesc} onChange={(e) => handleChange(row.id, 'riskDesc', e.target.value)} rows={2} className={textareaCls} /> : <span className="text-xs">{row.riskDesc}</span>}</td>
                    <td className="px-2 py-1.5 w-40">{isEditing ? <textarea value={row.cause} onChange={(e) => handleChange(row.id, 'cause', e.target.value)} rows={2} className={textareaCls} /> : <span className="text-xs">{row.cause}</span>}</td>
                    <td className="px-2 py-1.5 w-40">{isEditing ? <textarea value={row.currentMeasure} onChange={(e) => handleChange(row.id, 'currentMeasure', e.target.value)} rows={2} className={textareaCls} /> : <span className="text-xs">{row.currentMeasure}</span>}</td>
                    <td className="px-2 py-1.5 w-20">{isEditing ? <select value={row.strategy} onChange={(e) => handleChange(row.id, 'strategy', e.target.value)} className={selectCls}>{argumentRiskStrategies.map((v) => <option key={v}>{v}</option>)}</select> : <span className="text-xs">{row.strategy}</span>}</td>
                    <td className="px-2 py-1.5 w-40">{isEditing ? <textarea value={row.suggestMeasure} onChange={(e) => handleChange(row.id, 'suggestMeasure', e.target.value)} rows={2} className={textareaCls} /> : <span className="text-xs">{row.suggestMeasure}</span>}</td>
                    <td className="px-2 py-1.5 w-24">{isEditing ? <input value={row.execDept} onChange={(e) => handleChange(row.id, 'execDept', e.target.value)} className={inputCls} /> : <span className="text-xs">{row.execDept}</span>}</td>
                    <td className="px-2 py-1.5 w-28">{isEditing ? <input type="date" value={row.deadline} onChange={(e) => handleChange(row.id, 'deadline', e.target.value)} className={inputCls} /> : <span className="text-xs">{row.deadline}</span>}</td>
                    <td className="px-2 py-1.5 w-20">{isEditing ? <input value={row.updatedSeverity} onChange={(e) => handleChange(row.id, 'updatedSeverity', e.target.value)} className={inputCls} /> : <span className="text-xs">{row.updatedSeverity}</span>}</td>
                    <td className="px-2 py-1.5 w-24">{isEditing ? <input value={row.updatedRiskType} onChange={(e) => handleChange(row.id, 'updatedRiskType', e.target.value)} className={inputCls} /> : <span className="text-xs">{row.updatedRiskType}</span>}</td>
                    <td className="px-2 py-1.5 w-40">{isEditing ? <textarea value={row.updatedRiskDesc} onChange={(e) => handleChange(row.id, 'updatedRiskDesc', e.target.value)} rows={2} className={textareaCls} /> : <span className="text-xs">{row.updatedRiskDesc}</span>}</td>
                    <td className="px-2 py-1.5 w-24">{isEditing ? <input value={row.effectiveness} onChange={(e) => handleChange(row.id, 'effectiveness', e.target.value)} className={inputCls} /> : <span className="text-xs">{row.effectiveness}</span>}</td>
                    <td className="px-2 py-1.5 w-20">
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <button onClick={() => setEditingId(null)} className="text-xs text-green-600 hover:text-green-800 cursor-pointer font-medium">保存</button>
                        ) : (
                          <button onClick={() => setEditingId(row.id)} className="text-xs text-primary-600 hover:text-primary-800 cursor-pointer">编辑</button>
                        )}
                        <button onClick={() => handleDelete(row.id)} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">删除</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
