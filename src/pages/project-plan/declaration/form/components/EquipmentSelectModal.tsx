import { useMemo, useState, useEffect } from 'react';
import { equipmentMasterList, type EquipmentItem } from '@/mocks/equipmentMocks';

interface Props {
  open: boolean;
  selectedCodes: string[];
  onClose: () => void;
  onConfirm: (items: EquipmentItem[]) => void;
  /** 默认多选；零固等场景可单选 */
  multiple?: boolean;
  title?: string;
}

export default function EquipmentSelectModal({
  open, selectedCodes, onClose, onConfirm, multiple = true, title = '选择设备',
}: Props) {
  const [keyword, setKeyword] = useState('');
  const [unit, setUnit] = useState('');
  const [checked, setChecked] = useState<string[]>(selectedCodes);

  useEffect(() => {
    if (open) setChecked(selectedCodes);
  }, [open, selectedCodes]);

  const units = useMemo(
    () => Array.from(new Set(equipmentMasterList.map((e) => e.unit))),
    []
  );

  const filtered = useMemo(() => {
    return equipmentMasterList.filter((e) => {
      if (unit && e.unit !== unit) return false;
      if (!keyword) return true;
      const k = keyword.trim();
      return e.code.includes(k) || e.name.includes(k) || e.model.includes(k) || e.location.includes(k);
    });
  }, [keyword, unit]);

  if (!open) return null;

  const toggle = (code: string) => {
    if (!multiple) {
      setChecked((prev) => (prev.includes(code) ? [] : [code]));
      return;
    }
    setChecked((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const handleConfirm = () => {
    const items = equipmentMasterList.filter((e) => checked.includes(e.code));
    onConfirm(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h3 className="text-base font-semibold text-steel-800">{title}</h3>
            <p className="text-xs text-steel-400 mt-0.5">
              {multiple ? '支持多选，确认后自动回填设备编码与名称' : '请搜索并选择一台设备，确认后自动回填'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-steel-400 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-steel-100 flex items-center gap-2 flex-wrap">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索编码/名称/型号/位置"
            className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="px-3 py-2 text-sm border border-steel-200 rounded-md cursor-pointer"
          >
            <option value="">全部单位</option>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <span className="text-xs text-steel-400">已选 {checked.length} 台</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="border-b border-steel-200 text-xs text-steel-500">
                <th className="px-3 py-2 w-10" />
                <th className="px-3 py-2 text-left">设备编码</th>
                <th className="px-3 py-2 text-left">设备名称</th>
                <th className="px-3 py-2 text-left">型号</th>
                <th className="px-3 py-2 text-left">所属单位</th>
                <th className="px-3 py-2 text-left">位置</th>
                <th className="px-3 py-2 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-steel-100 hover:bg-emerald-50/40 cursor-pointer"
                  onClick={() => toggle(e.code)}
                >
                  <td className="px-3 py-2 text-center">
                    <input
                      type={multiple ? 'checkbox' : 'radio'}
                      name="equip-select"
                      checked={checked.includes(e.code)}
                      onChange={() => toggle(e.code)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-2 text-sm font-mono text-steel-700">{e.code}</td>
                  <td className="px-3 py-2 text-sm text-steel-800">{e.name}</td>
                  <td className="px-3 py-2 text-sm text-steel-500">{e.model}</td>
                  <td className="px-3 py-2 text-sm text-steel-600">{e.unit}</td>
                  <td className="px-3 py-2 text-sm text-steel-500">{e.location}</td>
                  <td className="px-3 py-2 text-xs">
                    <span className={`px-1.5 py-0.5 rounded ${e.status === '在用' ? 'bg-emerald-50 text-emerald-600' : e.status === '备用' ? 'bg-sky-50 text-sky-600' : 'bg-slate-100 text-slate-500'}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-steel-400">暂无匹配设备</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-steel-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-slate-50 cursor-pointer">取消</button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
