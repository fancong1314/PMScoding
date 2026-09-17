/** 列表底部分页条（零星工程模块共用） */

interface Props {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function ListPagination({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-steel-100 bg-white">
      <div className="flex items-center gap-3 text-xs text-steel-400">
        <span>共 {total} 条</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-steel-200 rounded px-2 py-1 text-xs bg-white cursor-pointer"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>{n} 条/页</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-7 h-7 flex items-center justify-center text-xs border border-steel-200 rounded disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
        >
          <i className="ri-arrow-left-s-line" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e-${i}`} className="px-1 text-xs text-steel-300">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[28px] h-7 px-1.5 text-xs rounded border cursor-pointer ${
                p === currentPage
                  ? 'border-sky-500 bg-sky-50 text-sky-700 font-medium'
                  : 'border-steel-200 text-steel-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-7 h-7 flex items-center justify-center text-xs border border-steel-200 rounded disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
        >
          <i className="ri-arrow-right-s-line" />
        </button>
      </div>
    </div>
  );
}
