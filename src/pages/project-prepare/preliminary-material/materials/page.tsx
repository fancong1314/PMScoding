import { useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { supabase } from '@/lib/supabase';
import { materialCategories, statusConfig, type MaterialCategory, type MaterialItem } from '@/mocks/projectPrepareMocks';

interface FileRecord {
  url: string;
  name: string;
  uploader: string;
  uploadDate: string;
}

export default function MaterialListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get('projectName') || '';
  const approvalNo = searchParams.get('approvalNo') || '';

  const [activeCategory, setActiveCategory] = useState<string>('design');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, FileRecord>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingItemIdRef = useRef<string | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleItem = (id: string) => {
    const next = new Set(expandedItems);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedItems(next);
  };

  const handleExport = () => {
    showToast('资料清单导出成功');
  };

  // 打开文件选择器
  const handleUploadClick = (itemId: string) => {
    pendingItemIdRef.current = itemId;
    fileInputRef.current?.click();
  };

  // 文件选择后上传
  const handleFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const itemId = pendingItemIdRef.current;
    if (!file || !itemId) return;

    // 验证文件名
    const fileNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const ext = file.name.split('.').pop() || '';
    const safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fullSafeName = `${safeName}.${ext}`;

    if (fileNameRegex.test(file.name) === false) {
      showToast(`文件名包含不支持的字符，已自动重命名为：${fullSafeName}`, 'error');
    }

    setUploadingItemId(itemId);
    try {
      const filePath = `materials/${Date.now()}_${fullSafeName}`;
      const { error: uploadError } = await supabase.storage.from('public').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: signedData } = await supabase.storage.from('public').createSignedUrl(filePath, 86400);
      if (!signedData?.signedUrl) throw new Error('无法生成下载链接');

      setUploadedFiles((prev) => ({
        ...prev,
        [itemId]: {
          url: signedData.signedUrl,
          name: file.name,
          uploader: '当前用户',
          uploadDate: new Date().toISOString().split('T')[0],
        },
      }));
      showToast(`文件「${file.name}」上传成功`);
    } catch (err: any) {
      showToast(`上传失败：${err?.message || '未知错误'}`, 'error');
    } finally {
      setUploadingItemId(null);
      pendingItemIdRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  // 下载文件
  const handleDownload = async (itemId: string) => {
    const file = uploadedFiles[itemId];
    if (file) {
      window.open(file.url, '_blank');
      return;
    }
    // 如果是 mock 数据中的文件，尝试从 storage 查找
    showToast('该文件为历史数据，暂不支持直接下载', 'error');
  };

  // 预览文件
  const handlePreview = async (itemId: string) => {
    const file = uploadedFiles[itemId];
    if (file) {
      window.open(file.url, '_blank');
      return;
    }
    showToast('该文件为历史数据，暂不支持预览', 'error');
  };

  // 获取文件的显示信息
  const getFileDisplay = (item: MaterialItem): FileRecord | null => {
    if (uploadedFiles[item.id]) return uploadedFiles[item.id];
    if (item.fileName) {
      return { url: '', name: item.fileName, uploader: item.uploader || '', uploadDate: item.uploadDate || '' };
    }
    return null;
  };

  const activeData = materialCategories.find((c) => c.key === activeCategory);

  const getStatusStats = () => {
    if (!activeData) return { completed: 0, pending: 0, expired: 0, warning: 0, total: 0 };
    let completed = 0, pending = 0, expired = 0, warning = 0, total = 0;
    const countItem = (item: MaterialItem) => {
      total++;
      const fileRecord = getFileDisplay(item);
      if (fileRecord) completed++;
      else if (item.status === 'pending') pending++;
      else if (item.status === 'expired') expired++;
      else if (item.status === 'warning') warning++;
      else if (item.status === 'completed') completed++;
      item.children?.forEach(countItem);
    };
    activeData.items.forEach(countItem);
    return { completed, pending, expired, warning, total };
  };

  const stats = getStatusStats();

  const renderMaterialItem = (item: MaterialItem, depth = 0) => {
    const fileRecord = getFileDisplay(item);
    const displayStatus = fileRecord ? 'completed' : item.status;
    const status = statusConfig[displayStatus];
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isUploading = uploadingItemId === item.id;

    return (
      <div key={item.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-steel-100 pl-4' : ''}`}>
        <div
          className={`flex items-start gap-3 p-3 rounded-lg transition-all hover:bg-slate-50 group ${
            displayStatus === 'warning' ? 'bg-amber-50/40 border border-amber-100' :
            displayStatus === 'expired' ? 'bg-red-50/40 border border-red-100' :
            displayStatus === 'pending' ? 'bg-sky-50/30 border border-sky-100' :
            'bg-white border border-steel-100'
          }`}
        >
          {/* 状态图标 */}
          <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${
            isUploading ? 'bg-primary-100 animate-pulse' :
            displayStatus === 'completed' ? 'bg-emerald-100' :
            displayStatus === 'pending' ? 'bg-sky-100' :
            displayStatus === 'expired' ? 'bg-red-100' :
            'bg-amber-100'
          }`}>
            <div className="w-4 h-4 flex items-center justify-center">
              {isUploading ? (
                <i className="ri-loader-4-line text-primary-600 text-sm animate-spin" />
              ) : (
                <i className={`${status.icon} ${
                  displayStatus === 'completed' ? 'text-emerald-600' :
                  displayStatus === 'pending' ? 'text-sky-600' :
                  displayStatus === 'expired' ? 'text-red-600' :
                  'text-amber-600'
                } text-sm`} />
              )}
            </div>
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-steel-800">{item.name}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                {isUploading ? '上传中...' : status.label}
              </span>
              {displayStatus === 'warning' && (
                <div className="w-4 h-4 flex items-center justify-center text-amber-500">
                  <i className="ri-alert-line text-sm" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-steel-400 flex-wrap">
              <span className="text-steel-500">{item.type}</span>
              {fileRecord && (
                <>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 flex items-center justify-center"><i className="ri-calendar-line" /></div>
                    {fileRecord.uploadDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 flex items-center justify-center"><i className="ri-user-line" /></div>
                    {fileRecord.uploader}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 flex items-center justify-center"><i className="ri-attachment-2" /></div>
                    {fileRecord.name}
                  </span>
                </>
              )}
              {!fileRecord && item.status !== 'completed' && (
                <span className="text-steel-400">暂无附件</span>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {hasChildren && (
              <button
                onClick={() => toggleItem(item.id)}
                className="w-6 h-6 flex items-center justify-center rounded text-steel-400 hover:text-steel-600 hover:bg-steel-100 transition-colors cursor-pointer"
                title={isExpanded ? '收起' : '展开'}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {isExpanded ? <i className="ri-arrow-up-s-line" /> : <i className="ri-arrow-down-s-line" />}
                </div>
              </button>
            )}
            {/* 上传按钮（pending/warning/expired 状态） */}
            {!fileRecord && displayStatus !== 'completed' && (
              <button
                onClick={() => handleUploadClick(item.id)}
                disabled={isUploading}
                className="w-7 h-7 flex items-center justify-center rounded text-steel-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="上传附件"
              >
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-cloud-line text-sm" /></div>
              </button>
            )}
            {/* 预览按钮（有文件时导出） */}
            {fileRecord && (
              <button
                onClick={() => handlePreview(item.id)}
                className="w-7 h-7 flex items-center justify-center rounded text-steel-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                title="预览"
              >
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-eye-line text-sm" /></div>
              </button>
            )}
            {/* 下载按钮（有文件时导出） */}
            {fileRecord && (
              <button
                onClick={() => handleDownload(item.id)}
                className="w-7 h-7 flex items-center justify-center rounded text-steel-400 hover:text-success-600 hover:bg-success-50 transition-colors cursor-pointer"
                title="下载"
              >
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line text-sm" /></div>
              </button>
            )}
          </div>
        </div>

        {/* 子项 */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {item.children!.map((child) => renderMaterialItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* 隐藏文件上传 input */}
        <input
          ref={fileInputRef}
          type="file"
          className="fixed -top-20 -left-20 w-0 h-0 opacity-0 pointer-events-none"
          style={{ position: 'fixed', top: '-100px', left: '-100px', width: '0px', height: '0px', opacity: 0, pointerEvents: 'none' }}
          onChange={handleFileSelected}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.jpg,.jpeg,.png,.bmp,.dwg,.dgn"
        />

        {/* Toast */}
        {toast && (
          <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm ${
            toastType === 'success' ? 'bg-steel-800 text-white' : 'bg-red-600 text-white'
          }`}>
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={toastType === 'success' ? 'ri-check-line' : 'ri-error-warning-line'} />
            </div>
            {toast}
          </div>
        )}

        {/* 面包屑返回 */}
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/project-prepare/preliminary-material')} className="flex items-center gap-1 text-sm text-steel-500 hover:text-primary-600 transition-colors cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
            返回项目列表
          </button>
        </div>

        {/* 项目信息区 */}
        <div className="bg-white rounded-lg border border-steel-200 px-5 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-folder-chart-line text-primary-600" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-semibold text-steel-900">{projectName}</h1>
              <p className="text-xs text-steel-400 mt-0.5">立项号：{approvalNo}</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-success-600 border border-success-200 rounded-md hover:bg-success-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-excel-line" /></div>
            导出资料清单
          </button>
        </div>

        {/* 分类导航 */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel-100">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {materialCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.key
                      ? 'bg-white text-primary-600 font-medium shadow-sm'
                      : 'text-steel-500 hover:text-steel-700'
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center"><i className={cat.icon} /></div>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 可视化资料展示区 */}
          <div className="p-5">
            {activeData ? (
              <div className="space-y-4">
                {/* 分类标题 */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-50">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className={`${activeData.icon} text-primary-600`} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-steel-800">{activeData.label}</h2>
                    <p className="text-xs text-steel-400">共 {stats.total} 项资料</p>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-steel-100 rounded-full overflow-hidden flex">
                    {stats.total > 0 && (
                      <>
                        <div className="h-full bg-emerald-500" style={{ width: `${(stats.completed / stats.total) * 100}%` }} />
                        <div className="h-full bg-sky-500" style={{ width: `${(stats.pending / stats.total) * 100}%` }} />
                        <div className="h-full bg-amber-500" style={{ width: `${(stats.warning / stats.total) * 100}%` }} />
                        <div className="h-full bg-red-500" style={{ width: `${(stats.expired / stats.total) * 100}%` }} />
                      </>
                    )}
                  </div>
                  <span className="text-xs text-steel-500 font-medium">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                </div>

                {/* 资料项列表 */}
                <div className="space-y-3">
                  {activeData.items.map((item) => renderMaterialItem(item))}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100"><i className="ri-folder-open-line text-2xl text-steel-300" /></div>
                  <p className="text-sm text-steel-400">请选择资料分类</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}