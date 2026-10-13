import { useMemo, useRef, useState } from 'react';
import Layout from '@/components/feature/Layout';
import {
  knowledgeDocsSeed,
  knowledgeFileStatusStyle,
  knowledgeFileTypeIcon,
  type KnowledgeDoc,
} from '@/mocks/knowledgeBaseMocks';

export default function KnowledgeBasePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(() => [...knowledgeDocsSeed]);
  const [searchKey, setSearchKey] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewDoc, setPreviewDoc] = useState<KnowledgeDoc | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<KnowledgeDoc | null>(null);
  const [toast, setToast] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const kw = searchKey.trim().toLowerCase();
    if (!kw) return docs;
    const matched = docs.filter((d) => d.fileName.toLowerCase().includes(kw));
    return matched.length > 0 ? matched : docs;
  }, [docs, searchKey]);

  const usedFallback = searchKey.trim() !== '' && !docs.some((d) => d.fileName.toLowerCase().includes(searchKey.trim().toLowerCase()));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const toggleSelectAll = () => {
    if (filtered.length > 0 && filtered.every((d) => selectedIds.has(d.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((d) => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleEnabled = (id: string) => {
    const target = docs.find((d) => d.id === id);
    if (!target) return;
    if (target.status !== '成功') {
      showToast('仅处理成功的文档可启用');
      return;
    }
    const enabled = !target.enabled;
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, enabled, updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19) }
          : d,
      ),
    );
    showToast(enabled ? `已启用「${target.fileName}」` : `已停用「${target.fileName}」`);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const added: KnowledgeDoc[] = Array.from(files).map((f, i) => {
      const ext = (f.name.split('.').pop() || 'docx').toLowerCase();
      const fileType =
        ext === 'pdf' ? 'pdf' : ext === 'xlsx' || ext === 'xls' ? 'xlsx' : ext === 'md' ? 'md' : ext === 'pptx' || ext === 'ppt' ? 'pptx' : 'docx';
      return {
        id: `kb_import_${Date.now()}_${i}`,
        fileName: f.name,
        fileType,
        status: '处理中' as const,
        enabled: false,
        createTime: now,
        updateTime: now,
        sizeLabel: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1024))} KB`,
      };
    });
    setDocs((prev) => [...added, ...prev]);
    showToast(`已导入 ${added.length} 个文档，正在处理…`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = (doc: KnowledgeDoc) => {
    showToast(`开始下载「${doc.fileName}」`);
  };

  const confirmDelete = () => {
    if (!deleteDoc) return;
    setDocs((prev) => prev.filter((d) => d.id !== deleteDoc.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDoc.id);
      return next;
    });
    showToast(`已删除「${deleteDoc.fileName}」`);
    setDeleteDoc(null);
  };

  const allSelected = filtered.length > 0 && filtered.every((d) => selectedIds.has(d.id));

  return (
    <Layout>
      <div className="space-y-4">
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 bg-steel-800 text-white rounded-lg shadow-lg text-sm">
            <i className="ri-check-line" />
            {toast}
          </div>
        )}

        <div>
          <h1 className="text-lg font-semibold text-steel-900">知识库管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理工程智库文档，支持导入、启用及预览下载</p>
        </div>

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between gap-3 flex-wrap px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleImportClick}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                <i className="ri-add-line" />
                导入文档
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".doc,.docx,.pdf,.xls,.xlsx,.md,.ppt,.pptx"
                className="hidden"
                onChange={(e) => handleImportFiles(e.target.files)}
              />
              {selectedIds.size > 0 && (
                <span className="text-xs text-steel-500">已选 {selectedIds.size} 项</span>
              )}
            </div>
            <div className="relative w-full sm:w-72">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-steel-400 text-sm" />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="按文档名称搜索"
                className="w-full pl-9 pr-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50"
              />
            </div>
          </div>

          {usedFallback && (
            <p className="px-4 py-2 text-xs text-amber-600 bg-amber-50 border-b border-amber-100">
              当前搜索无匹配结果，已展示全部演示数据
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 1100 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-steel-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">文件名称</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">文件状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">启用状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">创建时间</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap">更新时间</th>
                  <th className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap text-center sticky right-0 bg-slate-50" style={{ minWidth: 200, borderLeft: '1px solid #e8edf3' }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => {
                  const typeCfg = knowledgeFileTypeIcon[doc.fileType];
                  const statusCfg = knowledgeFileStatusStyle[doc.status];
                  return (
                    <tr key={doc.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(doc.id)}
                          onChange={() => toggleSelect(doc.id)}
                          className="w-4 h-4 rounded border-steel-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0 max-w-md">
                          <i className={`${typeCfg.icon} ${typeCfg.color} text-lg flex-shrink-0`} />
                          <span className="text-sm text-steel-800 truncate" title={doc.fileName}>{doc.fileName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-sm ${statusCfg.cls}`} title={doc.failReason || doc.status}>
                          <i className={`${statusCfg.icon} ${doc.status === '处理中' ? 'animate-spin' : ''}`} />
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={doc.enabled}
                          onClick={() => toggleEnabled(doc.id)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                            doc.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                              doc.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap font-mono">{doc.createTime}</td>
                      <td className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap font-mono">{doc.updateTime}</td>
                      <td className="px-4 py-3 sticky right-0 bg-white" style={{ borderLeft: '1px solid #e8edf3' }}>
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50 cursor-pointer whitespace-nowrap"
                            title="预览"
                          >
                            <i className="ri-eye-line" />
                            预览
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(doc)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer whitespace-nowrap"
                            title="下载"
                          >
                            <i className="ri-download-line" />
                            下载
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteDoc(doc)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap"
                            title="删除"
                          >
                            <i className="ri-delete-bin-line" />
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-sm text-steel-400">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-steel-100 text-xs text-steel-400">
            共 {filtered.length} 个文档
          </div>
        </div>
      </div>

      {/* 预览弹窗 */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewDoc(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[720px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-steel-200 flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-steel-800">文档预览</h3>
                <p className="text-xs text-steel-400 mt-0.5 truncate">{previewDoc.fileName}</p>
              </div>
              <button type="button" onClick={() => setPreviewDoc(null)} className="w-7 h-7 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line text-lg" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1" style={{ backgroundColor: '#f8fafc' }}>
              <div className="bg-white rounded-lg border border-steel-200 p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-slate-50 border border-steel-100 flex items-center justify-center">
                  <i className={`${knowledgeFileTypeIcon[previewDoc.fileType].icon} ${knowledgeFileTypeIcon[previewDoc.fileType].color} text-4xl`} />
                </div>
                <p className="text-sm font-medium text-steel-800">{previewDoc.fileName}</p>
                <p className="text-xs text-steel-400 mt-2">
                  大小 {previewDoc.sizeLabel} · 状态 {previewDoc.status} · {previewDoc.enabled ? '已启用' : '未启用'}
                </p>
                {previewDoc.failReason && (
                  <p className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2 inline-block">
                    {previewDoc.failReason}
                  </p>
                )}
                <div className="mt-6 p-8 border-2 border-dashed border-steel-200 rounded-lg">
                  <p className="text-sm text-steel-500">文件内容预览区域</p>
                  <p className="text-xs text-steel-400 mt-1">（演示环境展示占位，实际可在线渲染文档内容）</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-steel-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleDownload(previewDoc)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 cursor-pointer"
              >
                <i className="ri-download-line" />
                下载
              </button>
              <button type="button" onClick={() => setPreviewDoc(null)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认 */}
      {deleteDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteDoc(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[420px] max-w-[95vw]">
            <div className="px-5 py-4 border-b border-steel-200">
              <h3 className="text-base font-semibold text-steel-800">确认删除</h3>
            </div>
            <div className="px-5 py-5 text-sm text-steel-600">
              确定删除文档「<span className="font-medium text-steel-800">{deleteDoc.fileName}</span>」吗？删除后不可恢复。
            </div>
            <div className="px-5 py-3 border-t border-steel-200 flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteDoc(null)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer">
                取消
              </button>
              <button type="button" onClick={confirmDelete} className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer">
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
