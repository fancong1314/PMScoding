import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getAllArchivedHistoryDocs,
  loadArchiveMgmtStore,
  replaceArchiveAttachment,
} from '@/mocks/archiveManagementMocks';

/**
 * 历史归档：跨项目已归档文档一览，支持预览 / 下载 / 替换
 */
export default function ArchiveHistoryPage() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);
  const [filters, setFilters] = useState({
    approvalNo: '',
    projectName: '',
    projectType: '',
    docName: '',
    format: '',
    origin: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState('');
  const pageSize = 15;
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const allRows = useMemo(() => {
    loadArchiveMgmtStore();
    return getAllArchivedHistoryDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const projectTypes = useMemo(() => [...new Set(allRows.map((r) => r.projectType))], [allRows]);

  const filtered = useMemo(() => {
    let rows = allRows;
    if (filters.approvalNo) rows = rows.filter((r) => r.approvalNo.includes(filters.approvalNo));
    if (filters.projectName) rows = rows.filter((r) => r.projectName.includes(filters.projectName));
    if (filters.projectType) rows = rows.filter((r) => r.projectType === filters.projectType);
    if (filters.docName) rows = rows.filter((r) => r.docName.includes(filters.docName) || r.attachmentName.includes(filters.docName));
    if (filters.format) rows = rows.filter((r) => r.format === filters.format);
    if (filters.origin === 'meeting') rows = rows.filter((r) => r.origin === 'meeting');
    if (filters.origin === 'manual') rows = rows.filter((r) => r.origin === 'manual');
    if (filters.origin === 'business') rows = rows.filter((r) => !r.origin || r.origin === 'business');
    if (rows.length === 0 && !filters.approvalNo && !filters.projectName && !filters.projectType && !filters.docName && !filters.format && !filters.origin) {
      return allRows;
    }
    return rows;
  }, [allRows, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const triggerReplace = (id: string) => {
    setReplaceTargetId(id);
    replaceInputRef.current?.click();
  };

  const onReplaceFile = (fileList: FileList | null) => {
    if (!replaceTargetId || !fileList?.[0]) return;
    const file = fileList[0];
    const result = replaceArchiveAttachment(replaceTargetId, { name: file.name, size: file.size });
    showToast(result.message);
    setReplaceTargetId(null);
    if (replaceInputRef.current) replaceInputRef.current.value = '';
    setTick((t) => t + 1);
  };

  const originLabel = (o?: string) => {
    if (o === 'meeting') return <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-50 text-violet-600">会议纪要</span>;
    if (o === 'manual') return <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-600">手动新增</span>;
    return <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500">业务汇总</span>;
  };

  return (
    <Layout>
      <input ref={replaceInputRef} type="file" className="hidden" onChange={(e) => onReplaceFile(e.target.files)} />

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div>
            <h1 className="text-base font-semibold text-slate-800">历史归档</h1>
            <p className="text-xs text-slate-400 mt-0.5">已归档文档汇总查阅，支持预览、下载与替换</p>
          </div>
          <span className="text-sm text-slate-400">共 {filtered.length} 份</span>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-14">立项号</label>
              <input
                value={filters.approvalNo}
                onChange={(e) => { setFilters({ ...filters, approvalNo: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-14">项目</label>
              <input
                value={filters.projectName}
                onChange={(e) => { setFilters({ ...filters, projectName: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-14">类型</label>
              <select
                value={filters.projectType}
                onChange={(e) => { setFilters({ ...filters, projectType: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white"
              >
                <option value="">全部</option>
                {projectTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-14">文档</label>
              <input
                value={filters.docName}
                onChange={(e) => { setFilters({ ...filters, docName: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md"
                placeholder="名称"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-14">格式</label>
              <select
                value={filters.format}
                onChange={(e) => { setFilters({ ...filters, format: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white"
              >
                <option value="">全部</option>
                {['PDF', 'DOCX', 'XLSX', 'ZIP', 'MP3', 'M4A', 'WAV', 'PPTX'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-14">来源</label>
              <select
                value={filters.origin}
                onChange={(e) => { setFilters({ ...filters, origin: e.target.value }); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white"
              >
                <option value="">全部</option>
                <option value="business">业务汇总</option>
                <option value="manual">手动新增</option>
                <option value="meeting">会议纪要</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th className="px-3 py-2.5 text-center font-semibold text-slate-600 w-12">序号</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 min-w-[100px]">立项号</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 min-w-[160px]">项目名称</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 min-w-[160px]">附件名称</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">文档名称</th>
                <th className="px-3 py-2.5 text-center font-semibold text-slate-600">格式</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">版本</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">来源</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 min-w-[120px]">上传时间</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 min-w-[180px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2 text-center text-slate-500">{(currentPage - 1) * pageSize + i + 1}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{r.approvalNo}</td>
                  <td className="px-3 py-2 text-slate-700 max-w-[160px] truncate" title={r.projectName}>{r.projectName}</td>
                  <td className="px-3 py-2 text-slate-700 max-w-[160px] truncate" title={r.attachmentName}>{r.attachmentName}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{r.docName}</td>
                  <td className="px-3 py-2 text-center">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{r.format}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-500">{r.version}</td>
                  <td className="px-3 py-2">{originLabel(r.origin)}</td>
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{r.uploadTime}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => navigate(`/project-archive/management/preview?attachmentId=${r.id}`)}
                        className="px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer"
                      >
                        预览
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`开始下载：${r.attachmentName}`)}
                        className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer"
                      >
                        下载
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerReplace(r.id)}
                        className="px-2 py-1 text-xs text-amber-700 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer"
                      >
                        替换
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/project-archive/management/detail?projectId=${r.projectId}`)}
                        className="px-2 py-1 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                      >
                        详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-3 py-12 text-center text-slate-400 text-sm">暂无已归档历史数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">第 {currentPage} / {totalPages} 页</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-xs border border-slate-300 rounded disabled:opacity-40 cursor-pointer"
            >
              上一页
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 text-xs border border-slate-300 rounded disabled:opacity-40 cursor-pointer"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>
      )}
    </Layout>
  );
}
