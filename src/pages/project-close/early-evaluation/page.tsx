import { useState, useMemo } from 'react';
import Layout from '@/components/feature/Layout';
import { earlyEvaluationProjects, getEarlyEvaluationApprovalDetail, type EarlyEvaluationProject } from '@/mocks/earlyEvaluationMocks';

export default function EarlyEvaluationListPage() {
  const [filters, setFilters] = useState({ approvalNo: '', projectName: '', planNo: '', projectType: '', ownerUnit: '', dateStart: '', dateEnd: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<EarlyEvaluationProject | null>(null);
  const [applyForm, setApplyForm] = useState({ isFormalEval: '', reason: '', suggestion: '' });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredData = useMemo(() => earlyEvaluationProjects.filter(p => {
    if (filters.approvalNo && !p.approvalNo.includes(filters.approvalNo)) return false;
    if (filters.projectName && !p.projectName.includes(filters.projectName)) return false;
    if (filters.planNo && !p.planNo.includes(filters.planNo)) return false;
    if (filters.projectType && p.projectType !== filters.projectType) return false;
    if (filters.ownerUnit && p.ownerUnit !== filters.ownerUnit) return false;
    if (filters.dateStart && p.approvalDate < filters.dateStart) return false;
    if (filters.dateEnd && p.approvalDate > filters.dateEnd) return false;
    return true;
  }), [filters]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const projectTypes = [...new Set(earlyEvaluationProjects.map(p => p.projectType))];
  const ownerUnits = [...new Set(earlyEvaluationProjects.map(p => p.ownerUnit))];

  const statusLabel = (s: string) => s || '未申请';
  const statusStyle = (s: string) => {
    if (s === '未申请' || !s) return 'bg-slate-100 text-slate-600';
    if (s === '审批中') return 'bg-amber-100 text-amber-700';
    if (s === '申请通过') return 'bg-emerald-100 text-emerald-700';
    if (s === '已驳回') return 'bg-red-100 text-red-600';
    return 'bg-slate-100 text-slate-600';
  };

  const openApplyModal = (p: EarlyEvaluationProject) => {
    setSelectedProject(p);
    setApplyForm({ isFormalEval: p.isFormalEval || '', reason: p.applyReason || '', suggestion: p.applySuggestion || '' });
    setSaveSuccess(false);
    setSubmitSuccess(false);
    setShowApplyModal(true);
  };

  const openApprovalModal = (p: EarlyEvaluationProject) => {
    setSelectedProject(p);
    setShowApprovalModal(true);
  };

  const handleSave = () => {
    if (selectedProject) {
      selectedProject.isFormalEval = applyForm.isFormalEval;
      selectedProject.applyReason = applyForm.reason;
      selectedProject.applySuggestion = applyForm.suggestion;
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSubmit = () => {
    if (!applyForm.isFormalEval) { alert('请选择是否形式后评价'); return; }
    if (!applyForm.reason.trim()) { alert('请填写原因'); return; }
    if (!applyForm.suggestion.trim()) { alert('请填写建议'); return; }
    if (selectedProject) {
      selectedProject.isFormalEval = applyForm.isFormalEval;
      selectedProject.applyReason = applyForm.reason;
      selectedProject.applySuggestion = applyForm.suggestion;
      selectedProject.approvalStatus = '审批中';
      selectedProject.currentReviewer = '本单位分管领导-刘志刚';
      selectedProject.applyDate = new Date().toISOString().split('T')[0];
    }
    setSubmitSuccess(true);
    setTimeout(() => { setShowApplyModal(false); setSubmitSuccess(false); }, 1500);
  };

  const fmtCurrency = (n: number) => {
    if (n >= 100000000) return `${(n / 100000000).toFixed(2)}亿`;
    if (n >= 10000) return `${(n / 10000).toFixed(2)}万`;
    return n.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
  };

  const approvalDetail = selectedProject ? getEarlyEvaluationApprovalDetail(selectedProject.id) : null;

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h1 className="text-base font-semibold text-slate-800">项目提前后评价</h1>
          <span className="text-sm text-slate-400">共{filteredData.length}条</span>
        </div>

        {/* Search */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: '立项号', value: filters.approvalNo, key: 'approvalNo' },
              { label: '项目名称', value: filters.projectName, key: 'projectName' },
              { label: '年度计划号', value: filters.planNo, key: 'planNo' },
            ].map(f => (
              <div key={f.key} className="flex items-center gap-2">
                <label className="text-xs text-slate-600 whitespace-nowrap w-20">{f.label}</label>
                <input type="text" value={f.value} onChange={e => { setFilters(prev => ({ ...prev, [f.key]: e.target.value })); setCurrentPage(1); }}
                  className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">项目类型</label>
              <select value={filters.projectType} onChange={e => { setFilters(prev => ({ ...prev, projectType: e.target.value })); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">全部</option>
                {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">业主单位</label>
              <select value={filters.ownerUnit} onChange={e => { setFilters(prev => ({ ...prev, ownerUnit: e.target.value })); setCurrentPage(1); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">全部</option>
                {ownerUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 whitespace-nowrap w-20">立项日期</label>
              <div className="flex items-center gap-1 flex-1">
                <input type="date" value={filters.dateStart} onChange={e => { setFilters(prev => ({ ...prev, dateStart: e.target.value })); setCurrentPage(1); }}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                <span className="text-slate-400 text-xs">-</span>
                <input type="date" value={filters.dateEnd} onChange={e => { setFilters(prev => ({ ...prev, dateEnd: e.target.value })); setCurrentPage(1); }}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
            <button onClick={() => setCurrentPage(1)} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line" /></div>查询
            </button>
            <button onClick={() => { setFilters({ approvalNo: '', projectName: '', planNo: '', projectType: '', ownerUnit: '', dateStart: '', dateEnd: '' }); setCurrentPage(1); }}
              className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>重置
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['立项号','年度计划号','项目名称','立项说明','项目类型','立项金额(元)','预立项金额(元)','实际立项金额(元)','原始合同金额(元)','修正合同金额(元)','完工金额(元)','结算金额(元)','记账金额(元)','转固金额(元)','立项日期','业主单位','实施主管单位','项目经理','是否环保评','审批状态','操作'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-xs font-semibold text-slate-600 whitespace-nowrap text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((p, i) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs font-medium">{p.approvalNo}</td>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs">{p.planNo}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs max-w-[180px] truncate" title={p.projectName}>{p.projectName}</td>
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs max-w-[160px] truncate" title={p.approvalDesc}>{p.approvalDesc}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${p.projectType === '技改项目' ? 'bg-sky-50 text-sky-600' : p.projectType === '环保项目' ? 'bg-emerald-50 text-emerald-600' : p.projectType === '基建项目' ? 'bg-amber-50 text-amber-600' : p.projectType === '信息化项目' ? 'bg-violet-50 text-violet-600' : 'bg-red-50 text-red-600'}`}>{p.projectType}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.approvalAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.preApprovalAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.actualApprovalAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.originalContractAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.adjustedContractAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.completionAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.settlementAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.bookAmount)}</td>
                  <td className="px-3 py-2 text-slate-600 text-right whitespace-nowrap text-xs font-mono">{fmtCurrency(p.fixedAssetAmount)}</td>
                  <td className="px-3 py-2 text-slate-500 text-center whitespace-nowrap text-xs">{p.approvalDate}</td>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs">{p.ownerUnit}</td>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs">{p.supervisorUnit}</td>
                  <td className="px-3 py-2 text-slate-700 text-center whitespace-nowrap text-xs">{p.projectManager}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${p.isEcoReview === '是' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{p.isEcoReview}</span>
                  </td>
                  <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${statusStyle(p.approvalStatus)}`}>{statusLabel(p.approvalStatus)}</span>
                  </td>
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openApplyModal(p)}
                        className="px-2.5 py-1 text-xs text-white rounded cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        提前后评价申请
                      </button>
                      {p.approvalStatus && p.approvalStatus !== '未申请' && (
                        <button onClick={() => openApprovalModal(p)}
                          className="px-2.5 py-1 text-xs text-emerald-600 border border-emerald-200 rounded cursor-pointer whitespace-nowrap hover:bg-emerald-50">
                          审批详情
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">每页{pageSize}条，共{filteredData.length}条</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-left-double-line" /></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-left-s-line" /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const pg = start + i;
                if (pg > totalPages) return null;
                return <button key={pg} onClick={() => setCurrentPage(pg)} className={`w-7 h-7 flex items-center justify-center text-xs border rounded cursor-pointer ${pg === currentPage ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-medium' : 'border-slate-300 hover:bg-slate-100'}`}>{pg}</button>;
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-right-s-line" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center text-xs border border-slate-300 rounded hover:bg-slate-100 cursor-pointer disabled:opacity-40"><i className="ri-arrow-right-double-line" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={() => setShowApplyModal(false)}>
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-[720px] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-800">提前后评价申请</h2>
              <button onClick={() => setShowApplyModal(false)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
            </div>

            {/* Notice */}
            <div className="mx-5 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 leading-relaxed">
              <p className="font-medium mb-1">注意事项：</p>
              <p>1. 若项目达到预期效果，业主单位可提前和总师室（论证员）沟通确认，然后申请项目提前后评价流程，先确认后呈核，最后审核人必须是总师室领导，否则无效</p>
              <p>2. 呈核时，申请人添加配置审批人顺序：本单位分管领导（中层领导审核提出）+（事业部中层领导审核提出）+总师室（论证员）（提前沟通确认）、总师室分管主任工程师、副总工程师、总师室领导</p>
              <p>3. 是否形式后评价：是（不需要项目交工竣工，提前申请后评价），否（需要项目交工竣工后，再申请提前后评价）</p>
            </div>

            <div className="px-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">立项号</label>
                  <input type="text" value={selectedProject.approvalNo} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">项目名称</label>
                  <input type="text" value={selectedProject.projectName} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">是否形式后评价 <span className="text-red-500">*</span></label>
                  <select value={applyForm.isFormalEval} onChange={e => setApplyForm(prev => ({ ...prev, isFormalEval: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="">请选择</option>
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">状态</label>
                  <input type="text" value={statusLabel(selectedProject.approvalStatus)} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-600 mb-1 block">原因 <span className="text-red-500">*</span></label>
                  <textarea value={applyForm.reason} onChange={e => setApplyForm(prev => ({ ...prev, reason: e.target.value }))}
                    rows={3} placeholder="请输入申请提前后评价的原因" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-600 mb-1 block">建议 <span className="text-red-500">*</span></label>
                  <textarea value={applyForm.suggestion} onChange={e => setApplyForm(prev => ({ ...prev, suggestion: e.target.value }))}
                    rows={3} placeholder="请输入建议" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">当前审核人</label>
                  <input type="text" value={selectedProject.currentReviewer || '-'} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">验收附件上传</label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-md cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                    <i className="ri-upload-cloud-2-line text-slate-400" />
                    <span className="text-xs text-slate-400">点击上传验收附件</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-600 mb-1 block">附件上传</label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-md cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                    <i className="ri-upload-cloud-2-line text-slate-400" />
                    <span className="text-xs text-slate-400">点击上传其他附件</span>
                  </div>
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="mx-5 mb-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700 flex items-center gap-1">
                <i className="ri-check-line" />保存成功
              </div>
            )}
            {submitSuccess && (
              <div className="mx-5 mb-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700 flex items-center gap-1">
                <i className="ri-check-line" />呈核成功，审批已发起
              </div>
            )}

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
              <button onClick={() => setShowApplyModal(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleSave} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}>保存</button>
              <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white rounded-md cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>呈核</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Detail Modal */}
      {showApprovalModal && approvalDetail && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={() => setShowApprovalModal(false)}>
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-[600px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-800">审批详情 - 提前后评价申请</h2>
              <button onClick={() => setShowApprovalModal(false)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer"><i className="ri-close-line text-slate-500" /></button>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">审批单号：</span><span className="text-slate-800 font-medium">{approvalDetail.approvalNo}</span></div>
              <div><span className="text-slate-500">业务类型：</span><span className="text-slate-800">提前后评价申请</span></div>
              <div><span className="text-slate-500">发起人：</span><span className="text-slate-800">{approvalDetail.applicant}</span></div>
              <div><span className="text-slate-500">发起时间：</span><span className="text-slate-800">{approvalDetail.applyTime}</span></div>
            </div>
            <div className="px-5 py-4">
              <div className="relative pl-8">
                <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-slate-200" />
                {approvalDetail.nodes.map((node, idx) => {
                  const statusColor = node.status === 'approved' ? 'bg-emerald-500' : node.status === 'rejected' ? 'bg-red-500' : node.status === 'processing' ? 'bg-amber-500' : 'bg-slate-300';
                  const textColor = node.status === 'approved' ? 'text-emerald-600' : node.status === 'rejected' ? 'text-red-600' : node.status === 'processing' ? 'text-amber-600' : 'text-slate-400';
                  const borderColor = node.status === 'approved' ? 'border-emerald-100' : node.status === 'rejected' ? 'border-red-100' : node.status === 'processing' ? 'border-amber-100' : 'border-slate-100';
                  return (
                    <div key={idx} className={`relative mb-3 last:mb-0 p-3 rounded-md border ${borderColor}`}>
                      <div className={`absolute -left-[22px] top-3 w-3 h-3 rounded-full border-2 border-white ${statusColor}`} />
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-800">{node.seq}. {node.nodeName}</span>
                        <span className={`text-xs font-medium ${textColor}`}>
                          {node.status === 'approved' ? '已通过' : node.status === 'rejected' ? '已驳回' : node.status === 'processing' ? '审批中' : '待审批'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">审批人：{node.reviewer}</p>
                      {node.opinion && <p className="text-xs text-slate-500 mt-1">意见：{node.opinion}</p>}
                      {node.time && <p className="text-xs text-slate-400 mt-1">时间：{node.time}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-end px-5 py-3 border-t border-slate-200">
              <button onClick={() => setShowApprovalModal(false)} className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}