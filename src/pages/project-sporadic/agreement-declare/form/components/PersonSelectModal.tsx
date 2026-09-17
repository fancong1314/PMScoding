import { useMemo, useState } from 'react';
import { sporadicStaffDirectory, type SporadicStaffPerson } from '@/mocks/sporadicProjectMocks';

interface Props {
  open: boolean;
  title: string;
  mode: 'manager' | 'leader';
  selectedId?: string;
  onClose: () => void;
  onSelect: (person: SporadicStaffPerson) => void;
}

export default function PersonSelectModal({ open, title, mode, selectedId, onClose, onSelect }: Props) {
  const [keyword, setKeyword] = useState('');

  const list = useMemo(() => {
    const base = mode === 'leader'
      ? sporadicStaffDirectory.filter((p) => p.isLeader)
      : sporadicStaffDirectory.filter((p) => !p.isLeader);
    const k = keyword.trim();
    if (!k) return base;
    return base.filter(
      (p) => p.name.includes(k) || p.empNo.includes(k) || p.unit.includes(k) || p.phone.includes(k),
    );
  }, [mode, keyword]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/35" />
      <div
        className="relative bg-white rounded-xl border border-steel-200 shadow-xl w-full max-w-2xl max-h-[75vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-steel-100">
          <div>
            <h4 className="text-sm font-semibold text-steel-800">{title}</h4>
            <p className="text-xs text-steel-400 mt-0.5">
              {mode === 'manager' ? '选择项目负责人后将自动带出联系电话' : '请选择分管领导'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-steel-400 hover:bg-slate-100 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-steel-100">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-steel-400 text-sm" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索姓名 / 工号 / 单位"
              className="w-full pl-9 pr-3 py-2 text-sm border border-steel-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-steel-200">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-steel-600">工号</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-steel-600">姓名</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-steel-600">单位</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-steel-600">职务</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-steel-600">电话</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-steel-600 w-20">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-steel-400">暂无匹配人员</td>
                </tr>
              ) : (
                list.map((p) => {
                  const active = selectedId === p.id;
                  return (
                    <tr key={p.id} className={`border-b border-steel-100 ${active ? 'bg-emerald-50/60' : 'hover:bg-slate-50'}`}>
                      <td className="px-4 py-2.5 font-mono text-xs text-steel-500">{p.empNo}</td>
                      <td className="px-4 py-2.5 text-steel-800 font-medium">{p.name}</td>
                      <td className="px-4 py-2.5 text-steel-600">{p.unit}</td>
                      <td className="px-4 py-2.5 text-steel-600">{p.position}</td>
                      <td className="px-4 py-2.5 text-steel-600">{p.phone}</td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => onSelect(p)}
                          className="px-2.5 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded cursor-pointer"
                        >
                          选择
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-steel-100 bg-slate-50 flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-steel-200 rounded-md text-steel-600 hover:bg-white cursor-pointer">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
