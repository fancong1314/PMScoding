import { useState, useMemo } from 'react';
import Layout from '@/components/feature/Layout';
import { useColumnConfig } from '@/hooks/useColumnConfig';
import {
  professionalPickRecords,
  projectTypes,
  buildUnits,
  professionalPickStatuses,
  orgUnits,
  type ProfessionalPickRecord,
} from '@/mocks/professionalPickMocks';
import PickModal from './components/PickModal';
import SignDetailModal from './components/SignDetailModal';
import MessageModal from './components/MessageModal';
import ArgumentDetailModal from '../approval/components/ArgumentDetailModal';

const TABLE_KEY = 'professional_pick';

const defaultColumns = [
  { id: 'check', label: '选择', visible: true, width: 48, required: true },
  { id: 'seq', label: '序号', visible: true, width: 56, required: true },
  { id: 'argumentName', label: '论证名称', visible: true, width: 280, required: true },
  { id: 'argumentNo', label: '论证号', visible: true, width: 180, required: true },
  { id: 'projectType', label: '项目类型', visible: true, width: 120 },
  { id: 'buildUnit', label: '建设单位', visible: true, width: 110 },
  { id: 'isBenefit', label: '是否效益项目', visible: true, width: 110 },
  { id: 'status', label: '状态', visible: true, width: 100 },
  { id: 'operation', label: '操作', visible: true, width: 240, required: true },
];

export default function ProfessionalPickPage() {
  const [records] = useState<ProfessionalPickRecord[]>(professionalPickRecords);

  const [filterNo, setFilterNo] = useState('');
  const [filterPlanNo, setFilterPlanNo] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterBuildUnit, setFilterBuildUnit] = useState('');
  const [filterProjectType, setFilterProjectType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { columns, toggleVisible, reorderColumns, updateWidth } = useColumnConfig(TABLE_KEY, defaultColumns);
  const [colPanelOpen, setColPanelOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const [pickModalOpen, setPickModalOpen] = useState(false);
  const [pickModalMode, setPickModalMode] = useState<'pick' | 'edit'>('pick');
  const [pickModalRecord, setPickModalRecord] = useState<ProfessionalPickRecord | null>(null);

  const [signDetailOpen, setSignDetailOpen] = useState(false);
  const [signDetailRecord, setSignDetailRecord] = useState<ProfessionalPickRecord | null>(null);

  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailApplyNo, setDetailApplyNo] = useState('');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const visibleCols = useMemo(() => columns.filter((c) => c.visible), [columns]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterNo && !r.argumentNo.includes(filterNo)) return false;
      if (filterPlanNo && !r.planNo.includes(filterPlanNo)) return false;
      if (filterName && !r.argumentName.includes(filterName)) return false;
      if (filterBuildUnit && r.buildUnit !== filterBuildUnit) return false;
      if (filterProjectType && r.projectType !== filterProjectType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      return true;
    });
  }, [records, filterNo, filterPlanNo, filterName, filterBuildUnit, filterProjectType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setFilterNo('');
    setFilterPlanNo('');
    setFilterName('');
    setFilterBuildUnit('');
    setFilterProjectType('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  const handlePick = (record: ProfessionalPickRecord) => {
    setPickModalMode('pick');
    setPickModalRecord(record);
    setPickModalOpen(true);
  };

  const handleEditPick = (record: ProfessionalPickRecord) => {
    setPickModalMode('edit');
    setPickModalRecord(record);
    setPickModalOpen(true);
  };

  const handleSignDetail = (record: ProfessionalPickRecord) => {
    setSignDetailRecord(record);
    setSignDetailOpen(true);
  };

  const handlePickSubmit = (data: {
    recordId: string;
    deadlineStart: string;
    deadlineEnd: string;
    selectedUnits: { id: string; unitName: string }[];
  }) => {
    showToast(pickModalMode === 'pick' ? '会审专业配置成功' : '会审专业修改成功');
    setPickModalOpen(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allCurrentIds = new Set(paginated.map((r) => r.id));
    const allSelected = paginated.every((r) => selectedIds.has(r.id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const handleMouseDownResize = (e: React.MouseEvent, colId: string, width: number) => {
    e.preventDefault();
    setResizingCol(colId);
    setStartX(e.clientX);
    setStartWidth(width);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!resizingCol) return;
    const diff = e.clientX - startX;
    const newWidth = Math.max(60, startWidth + diff);
    updateWidth(resizingCol, newWidth);
  };

  const handleMouseUp = () => {
    setResizingCol(null);
  };

  const renderPagination = () => {
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
    return pages;
  };

  const inputCls =
    'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';

  const getStatusStyle = (status: string) => {
    const found = professionalPickStatuses.find((s) => s.value === status);
    return found ? found.color : 'bg-slate-100 text-slate-600';
  };

  return (
    <Layout>
      <div className="space-y-4" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-steel-900">论证会审专业挑选</h1>
          <p className="text-xs text-steel-400 mt-0.5">配置会审专业单位，管理论证会审流程</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-steel-200 px-4 py-3.5">
          <div className="grid grid-cols-4 gap-x-5 gap-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">
                论证申请号
              </label>
              <input
                value={filterNo}
                onChange={(e) => setFilterNo(e.target.value)}
                placeholder="请输入"
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">
                年度计划号
              </label>
              <div className="relative w-full">
                <input
                  value={filterPlanNo}
                  onChange={(e) => setFilterPlanNo(e.target.value)}
                  placeholder="请输入"
                  className={inputCls}
                />
                {filterPlanNo && (
                  <button
                    onClick={() => setFilterPlanNo('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"
                  >
                    <i className="ri-close-circle-line text-sm" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">
                论证申请名称
              </label>
              <input
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="模糊匹配"
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">
                建设单位
              </label>
              <select
                value={filterBuildUnit}
                onChange={(e) => setFilterBuildUnit(e.target.value)}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">全部</option>
                {buildUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">
                项目类型
              </label>
              <select
                value={filterProjectType}
                onChange={(e) => setFilterProjectType(e.target.value)}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">全部</option>
                {projectTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-steel-500 whitespace-nowrap w-24 text-right flex-shrink-0">
                状态
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">全部</option>
                {professionalPickStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-500 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-refresh-line" />
                </div>
                重置
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className="flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line" />
                </div>
                查询
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMessageModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-send-plane-line" />
            </div>
            消息发送
          </button>
          <div className="flex items-center gap-3">
            <div className="text-xs text-steel-400">
              共 <span className="font-semibold text-steel-700">{filtered.length}</span> 条记录
            </div>
            <button
              onClick={() => setColPanelOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-settings-3-line" />
              </div>
              自定义表头
            </button>
          </div>
        </div>

        {/* Column Settings Panel */}
        {colPanelOpen && (
          <div className="bg-white rounded-lg border border-steel-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-steel-700">自定义表头显示</h4>
              <button
                onClick={() => setColPanelOpen(false)}
                className="w-5 h-5 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer"
              >
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {columns
                .filter((c) => !c.required)
                .map((col, idx) => (
                  <label
                    key={col.id}
                    draggable
                    onDragStart={() => setDragIdx(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIdx !== null && dragIdx !== idx) {
                        reorderColumns(dragIdx, idx);
                        setDragIdx(null);
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-md border border-steel-100 cursor-move hover:border-primary-300 transition-colors"
                  >
                    <div className="w-3 h-3 flex items-center justify-center text-steel-300">
                      <i className="ri-drag-move-2-line text-xs" />
                    </div>
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleVisible(col.id)}
                      className="w-3.5 h-3.5 accent-primary-500 cursor-pointer"
                    />
                    <span className="text-xs text-steel-600">{col.label}</span>
                  </label>
                ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '1000px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                  {visibleCols.map((col) => (
                    <th
                      key={col.id}
                      className="px-4 py-3 text-xs font-semibold text-steel-500 whitespace-nowrap relative group"
                      style={{ width: col.width, minWidth: col.width }}
                    >
                      {col.id === 'check' ? (
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={
                              paginated.length > 0 && paginated.every((r) => selectedIds.has(r.id))
                            }
                            onChange={toggleSelectAll}
                            className="w-4 h-4 accent-primary-500 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1">{col.label}</span>
                      )}
                      {!col.required && (
                        <span
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity"
                          onMouseDown={(e) => handleMouseDownResize(e, col.id, col.width)}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={visibleCols.length} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100">
                          <i className="ri-file-list-3-line text-2xl text-steel-300" />
                        </div>
                        <p className="text-sm text-steel-400">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, idx) => (
                    <tr key={record.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                      {visibleCols.map((col) => {
                        if (col.id === 'check') {
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.has(record.id)}
                                  onChange={() => toggleSelect(record.id)}
                                  className="w-4 h-4 accent-primary-500 cursor-pointer"
                                />
                              </div>
                            </td>
                          );
                        }
                        if (col.id === 'seq') {
                          return (
                            <td key={col.id} className="px-4 py-3 text-sm text-steel-500 whitespace-nowrap">
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>
                          );
                        }
                        if (col.id === 'argumentName') {
                          return (
                            <td key={col.id} className="px-4 py-3 text-sm text-steel-800 max-w-xs">
                              <span className="line-clamp-2">{record.argumentName}</span>
                            </td>
                          );
                        }
                        if (col.id === 'argumentNo') {
                          return (
                            <td key={col.id} className="px-4 py-3 text-sm font-mono whitespace-nowrap">
                              <button onClick={() => { setDetailApplyNo(record.argumentNo); setDetailOpen(true); }} className="text-primary-600 hover:text-primary-800 hover:underline cursor-pointer transition-colors">{record.argumentNo}</button>
                            </td>
                          );
                        }
                        if (col.id === 'projectType') {
                          return (
                            <td key={col.id} className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">
                              {record.projectType}
                            </td>
                          );
                        }
                        if (col.id === 'buildUnit') {
                          return (
                            <td key={col.id} className="px-4 py-3 text-sm text-steel-600 whitespace-nowrap">
                              {record.buildUnit}
                            </td>
                          );
                        }
                        if (col.id === 'isBenefit') {
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  record.isBenefit
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-slate-100 text-steel-600'
                                }`}
                              >
                                {record.isBenefit ? '是' : '否'}
                              </span>
                            </td>
                          );
                        }
                        if (col.id === 'status') {
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                                  record.status
                                )}`}
                              >
                                {record.status}
                              </span>
                            </td>
                          );
                        }
                        if (col.id === 'operation') {
                          return (
                            <td
                              key={col.id}
                              className="px-4 py-3 sticky right-0 bg-white"
                              style={{ borderLeft: '1px solid #e8edf3' }}
                            >
                              <div className="flex items-center justify-center gap-1.5">
                                {record.status === '未配置' ? (
                                  <button
                                    onClick={() => handlePick(record)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                                  >
                                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                                      <i className="ri-user-add-line" />
                                    </div>
                                    会审专业挑选
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleEditPick(record)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap"
                                  >
                                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                                      <i className="ri-edit-line" />
                                    </div>
                                    会审专业修改
                                  </button>
                                )}
                                {(record.status === '已签署' || record.status === '已完成') && (
                                  <button
                                    onClick={() => handleSignDetail(record)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                                  >
                                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                                      <i className="ri-eye-line" />
                                    </div>
                                    签署详情
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        }
                        return <td key={col.id} className="px-4 py-3 text-sm text-steel-600" />;
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-steel-200 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-steel-500">
              <span>
                共 <span className="font-medium text-steel-700">{filtered.length}</span> 条
              </span>
              <span>
                第 <span className="font-medium text-steel-700">{currentPage}</span>/{totalPages} 页
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-sm border border-steel-200 rounded-md cursor-pointer focus:outline-none"
              >
                <option value={15}>15条/页</option>
                <option value={30}>30条/页</option>
                <option value={50}>50条/页</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs"
              >
                首页
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-arrow-left-s-line" />
              </button>
              {renderPagination().map((page, i) =>
                page === '...' ? (
                  <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-steel-400 text-sm">
                    ···
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${
                      currentPage === page ? 'text-white' : 'border border-steel-200 text-steel-600 hover:bg-slate-50'
                    }`}
                    style={currentPage === page ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : undefined}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-arrow-right-s-line" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs"
              >
                末页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pick Modal */}
      <PickModal
        open={pickModalOpen}
        mode={pickModalMode}
        record={pickModalRecord}
        onClose={() => setPickModalOpen(false)}
        onSubmit={handlePickSubmit}
      />

      {/* Sign Detail Modal */}
      <SignDetailModal
        open={signDetailOpen}
        record={signDetailRecord}
        onClose={() => setSignDetailOpen(false)}
      />

      {/* Message Modal */}
      <MessageModal
        open={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        onSend={(msg) => {
          showToast('消息发送成功');
          setMessageModalOpen(false);
        }}
      />

      <ArgumentDetailModal open={detailOpen} applyNo={detailApplyNo} onClose={() => setDetailOpen(false)} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${
              toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i
                className={
                  toast.type === 'success'
                    ? 'ri-checkbox-circle-line text-green-500'
                    : 'ri-close-circle-line text-red-500'
                }
              />
            </div>
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </Layout>
  );
}