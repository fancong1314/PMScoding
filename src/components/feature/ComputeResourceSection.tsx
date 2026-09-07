import { useState, useRef } from 'react';

export interface ComputeResourceRow {
  id: string;
  userName: string;
  department: string;
  cloudHostName: string;
  cpu: string;
  memory: string;
  image: string;
  dataDisk: string;
  remark: string;
}

function genId() { return `cr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

function makeEmptyRow(): ComputeResourceRow {
  return { id: genId(), userName: '', department: '', cloudHostName: '', cpu: '', memory: '', image: '', dataDisk: '', remark: '' };
}

interface ResourceSubTableProps {
  title: string;
  rows: ComputeResourceRow[];
  onChange: (rows: ComputeResourceRow[]) => void;
  readonly?: boolean;
}

function ResourceSubTable({ title, rows, onChange, readonly }: ResourceSubTableProps) {
  const importRef = useRef<HTMLInputElement>(null);

  const addRow = () => onChange([...rows, makeEmptyRow()]);

  const deleteRow = (id: string) => onChange(rows.filter((r) => r.id !== id));

  const updateCell = (id: string, field: keyof ComputeResourceRow, value: string) => {
    onChange(rows.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const downloadTemplate = () => {
    const headers = ['使用者姓名', '部门', '云主机名称', 'CPU', '内存', '镜像', '数据盘', '备注'].join(',');
    const blob = new Blob(['\uFEFF' + headers + '\n'], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}_模板.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const thCls = 'px-2 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap border-b border-steel-200 bg-slate-50';
  const tdCls = 'px-2 py-1.5 text-xs align-middle border-b border-steel-100';

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
        <div className="w-4 h-4 flex items-center justify-center">
          <i className="ri-cloud-line text-sky-500" />
        </div>
        <h4 className="text-sm font-semibold text-steel-700">{title}</h4>
        <span className="text-xs text-steel-400">{rows.length} 条记录</span>
        {!readonly && (
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={downloadTemplate} className="flex items-center gap-1 px-2 py-1 text-xs text-steel-600 border border-steel-200 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              <i className="ri-download-2-line" /> 下载模板
            </button>
            <button onClick={() => importRef.current?.click()} className="flex items-center gap-1 px-2 py-1 text-xs text-steel-600 border border-steel-200 rounded hover:bg-slate-50 cursor-pointer whitespace-nowrap">
              <i className="ri-upload-2-line" /> 导入
            </button>
            <button onClick={addRow} className="flex items-center gap-1 px-2 py-1 text-xs text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap">
              <i className="ri-add-line" /> 新增行
            </button>
          </div>
        )}
        <input ref={importRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" />
      </div>
      <div className="overflow-x-auto">
        <table style={{ minWidth: 1100, tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
          <colgroup>
            <col style={{ width: 50 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 130 }} />
            {!readonly && <col style={{ width: 70 }} />}
          </colgroup>
          <thead>
            <tr>
              <th className={thCls}>序号</th>
              <th className={thCls}>使用者姓名</th>
              <th className={thCls}>部门</th>
              <th className={thCls}>云主机名称</th>
              <th className={thCls}>CPU</th>
              <th className={thCls}>内存</th>
              <th className={thCls}>镜像</th>
              <th className={thCls}>数据盘</th>
              <th className={thCls}>备注</th>
              {!readonly && <th className={thCls}>操作</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={readonly ? 9 : 10} className="px-4 py-6 text-center text-xs text-steel-400">暂无数据，{!readonly && '请点击"新增行"添加'}</td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className={tdCls + ' text-center text-steel-400'}>{idx + 1}</td>
                  <td className={tdCls}>
                    {readonly ? <span className="text-steel-700">{row.userName}</span> : (
                      <input type="text" value={row.userName} onChange={(e) => updateCell(row.id, 'userName', e.target.value)} className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white" />
                    )}
                  </td>
                  <td className={tdCls}>
                    {readonly ? <span className="text-steel-700">{row.department}</span> : (
                      <input type="text" value={row.department} onChange={(e) => updateCell(row.id, 'department', e.target.value)} className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white" />
                    )}
                  </td>
                  <td className={tdCls}>
                    {readonly ? <span className="text-steel-700">{row.cloudHostName}</span> : (
                      <input type="text" value={row.cloudHostName} onChange={(e) => updateCell(row.id, 'cloudHostName', e.target.value)} className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white" />
                    )}
                  </td>
                  <td className={tdCls}>
                    {readonly ? <span className="text-steel-700">{row.cpu}</span> : (
                      <input type="text" value={row.cpu} onChange={(e) => updateCell(row.id, 'cpu', e.target.value)} placeholder="如: 8核" className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white" />
                    )}
                  </td>
                  <td className={tdCls}>
                    {readonly ? <span className="text-steel-700">{row.memory}</span> : (
                      <input type="text" value={row.memory} onChange={(e) => updateCell(row.id, 'memory', e.target.value)} placeholder="如: 16GB" className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white" />
                    )}
                  </td>
                  <td className={tdCls}>
                    {readonly ? <span className="text-steel-700">{row.image}</span> : (
                      <input type="text" value={row.image} onChange={(e) => updateCell(row.id, 'image', e.target.value)} placeholder="如: CentOS 7.9" className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white" />
                    )}
                  </td>
                  <td className={tdCls}>
                    {readonly ? <span className="text-steel-700">{row.dataDisk}</span> : (
                      <input type="text" value={row.dataDisk} onChange={(e) => updateCell(row.id, 'dataDisk', e.target.value)} placeholder="如: 200GB" className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white" />
                    )}
                  </td>
                  <td className={tdCls}>
                    {readonly ? <span className="text-steel-700">{row.remark}</span> : (
                      <input type="text" value={row.remark} onChange={(e) => updateCell(row.id, 'remark', e.target.value)} className="w-full px-1.5 py-1 text-xs border border-steel-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white" />
                    )}
                  </td>
                  {!readonly && (
                    <td className={tdCls + ' text-center'}>
                      <button onClick={() => deleteRow(row.id)} className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 cursor-pointer">
                        <i className="ri-delete-bin-line text-xs" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ComputeResourceSectionProps {
  tongSuanHas: string;
  zhiSuanHas: string;
  tongSuanRows: ComputeResourceRow[];
  zhiSuanRows: ComputeResourceRow[];
  onTongSuanHasChange: (v: string) => void;
  onZhiSuanHasChange: (v: string) => void;
  onTongSuanRowsChange: (rows: ComputeResourceRow[]) => void;
  onZhiSuanRowsChange: (rows: ComputeResourceRow[]) => void;
  readonly?: boolean;
  sectionRef?: (el: HTMLDivElement | null) => void;
}

export default function ComputeResourceSection({
  tongSuanHas, zhiSuanHas,
  tongSuanRows, zhiSuanRows,
  onTongSuanHasChange, onZhiSuanHasChange,
  onTongSuanRowsChange, onZhiSuanRowsChange,
  readonly,
  sectionRef,
}: ComputeResourceSectionProps) {
  return (
    <div ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}>
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-cloud-line text-sky-500" />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">通算/智算资源配置</h3>
        <span className="text-xs text-steel-400 ml-1">云主机资源申请信息</span>
      </div>
      <div className="p-5 space-y-4">
        {/* 是否涉及通算资源 */}
        <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
          <label className="flex justify-end items-center text-sm text-steel-600 pt-1.5 whitespace-nowrap">
            是否涉及通算资源
          </label>
          <div>
            {readonly ? (
              <span className="text-sm text-steel-700">{tongSuanHas || '否'}</span>
            ) : (
              <div className="flex items-center gap-4 pt-1.5">
                {['是', '否'].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="tongSuan" value={opt} checked={tongSuanHas === opt} onChange={() => onTongSuanHasChange(opt)} className="text-primary-500 cursor-pointer" />
                    <span className="text-sm text-steel-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {tongSuanHas === '是' && (
          <ResourceSubTable
            title="通算资源清单"
            rows={tongSuanRows}
            onChange={onTongSuanRowsChange}
            readonly={readonly}
          />
        )}

        {/* 是否涉及智算资源 */}
        <div className="grid grid-cols-[130px_1fr] gap-3 items-start">
          <label className="flex justify-end items-center text-sm text-steel-600 pt-1.5 whitespace-nowrap">
            是否涉及智算资源
          </label>
          <div>
            {readonly ? (
              <span className="text-sm text-steel-700">{zhiSuanHas || '否'}</span>
            ) : (
              <div className="flex items-center gap-4 pt-1.5">
                {['是', '否'].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="zhiSuan" value={opt} checked={zhiSuanHas === opt} onChange={() => onZhiSuanHasChange(opt)} className="text-primary-500 cursor-pointer" />
                    <span className="text-sm text-steel-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {zhiSuanHas === '是' && (
          <ResourceSubTable
            title="智算资源清单"
            rows={zhiSuanRows}
            onChange={onZhiSuanRowsChange}
            readonly={readonly}
          />
        )}
      </div>
    </div>
  );
}