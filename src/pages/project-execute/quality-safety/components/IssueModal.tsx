import { useState } from 'react';
import { type Issue, standardsContent } from '@/mocks/qualitySafetyMocks';

interface IssueModalProps {
  open: boolean;
  mode: 'create' | 'edit' | 'view';
  issue: Issue | null;
  contractName: string;
  contractNo: string;
  issueCategory: 'quality' | 'safety';
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function IssueModal({ open, mode, issue, contractName, contractNo, issueCategory, onClose, onSubmit }: IssueModalProps) {
  const [issueType, setIssueType] = useState(issue?.issueType || '');
  const [discoverDate, setDiscoverDate] = useState(issue?.discoverDate || '');
  const [issueLevel, setIssueLevel] = useState(issue?.issueLevel || '');
  const [description, setDescription] = useState(issue?.description || '');
  const [deadline, setDeadline] = useState(issue?.deadline || '');
  const [constructionScore, setConstructionScore] = useState(issue?.constructionDeductionScore?.toString() || '');
  const [constructionAmount, setConstructionAmount] = useState(issue?.constructionDeductionAmount?.toString() || '');
  const [supervisorScore, setSupervisorScore] = useState(issue?.supervisorDeductionScore?.toString() || '');
  const [supervisorAmount, setSupervisorAmount] = useState(issue?.supervisorDeductionAmount?.toString() || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [standardsOpen, setStandardsOpen] = useState(false);

  if (!open) return null;

  const isView = mode === 'view';
  const isCreate = mode === 'create';
  const title = isCreate ? `新增${issueCategory === 'quality' ? '质量' : '安全'}问题` : isView ? '问题详情' : '修改问题';

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!issueType.trim()) errs.issueType = '请选择问题类型';
    if (!discoverDate) errs.discoverDate = '请选择问题发现时间';
    if (discoverDate && new Date(discoverDate) > new Date()) errs.discoverDate = '问题发现时间不得晚于当前日期';
    if (!issueLevel) errs.issueLevel = '请选择问题等级';
    if (!description.trim()) errs.description = '请输入问题内容';
    if (description.length > 2000) errs.description = '问题内容最多2000字符';
    if (!deadline) errs.deadline = '请选择整改完成期限';
    if (deadline && discoverDate && new Date(deadline) < new Date(discoverDate)) errs.deadline = '整改完成期限不得早于问题发现时间';
    if (constructionScore && !/^\d+$/.test(constructionScore)) errs.constructionScore = '扣分值必须为整数';
    if (constructionAmount && !/^\d+(\.\d{1,2})?$/.test(constructionAmount)) errs.constructionAmount = '扣款金额保留两位小数';
    if (supervisorScore && !/^\d+$/.test(supervisorScore)) errs.supervisorScore = '扣分值必须为整数';
    if (supervisorAmount && !/^\d+(\.\d{1,2})?$/.test(supervisorAmount)) errs.supervisorAmount = '扣款金额保留两位小数';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      issueType,
      discoverDate,
      issueLevel,
      description,
      deadline,
      constructionDeductionScore: Number(constructionScore) || 0,
      constructionDeductionAmount: Number(constructionAmount) || 0,
      supervisorDeductionScore: Number(supervisorScore) || 0,
      supervisorDeductionAmount: Number(supervisorAmount) || 0,
    });
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-steel-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50';
  const errorInputCls = 'w-full px-3 py-2 text-sm border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[720px] max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-steel-800">{title}</h3>
            <p className="text-xs text-steel-400 mt-0.5">{contractName}（{contractNo}）</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* 基本信息 */}
          <div>
            <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)' }} />
              基本信息
            </h4>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-3 border border-steel-100">
              <div>
                <label className="text-xs text-steel-400 block mb-1">合同名称</label>
                <span className="text-sm text-steel-700">{contractName}</span>
              </div>
              <div>
                <label className="text-xs text-steel-400 block mb-1">合同编号</label>
                <span className="text-sm text-steel-700 font-mono">{contractNo}</span>
              </div>
              <div>
                <label className="text-xs text-steel-400 block mb-1">发起人</label>
                <span className="text-sm text-steel-700">管理员</span>
              </div>
              <div>
                <label className="text-xs text-steel-400 block mb-1">发起时间</label>
                <span className="text-sm text-steel-700">{new Date().toLocaleString('zh-CN')}</span>
              </div>
            </div>
          </div>

          {/* 问题信息 */}
          <div>
            <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)' }} />
              问题信息
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-steel-700 block mb-1.5">
                    问题类型<span className="text-red-500 ml-1">*</span>
                    <button onClick={() => setStandardsOpen(true)} className="ml-2 text-xs text-primary-600 hover:text-primary-700 underline cursor-pointer">
                      查看质量安全问题管理规范
                    </button>
                  </label>
                  <select disabled={isView} value={issueType} onChange={(e) => setIssueType(e.target.value)} className={errors.issueType ? errorInputCls + ' cursor-pointer' : inputCls + ' cursor-pointer'}>
                    <option value="">请选择</option>
                    <option value={issueCategory === 'quality' ? '混凝土强度不足' : '高处作业未系安全带'}>{issueCategory === 'quality' ? '混凝土强度不足' : '高处作业未系安全带'}</option>
                    <option value={issueCategory === 'quality' ? '钢筋间距超标' : '临边洞口无防护'}>{issueCategory === 'quality' ? '钢筋间距超标' : '临边洞口无防护'}</option>
                    <option value={issueCategory === 'quality' ? '焊接质量缺陷' : '动火作业无审批'}>{issueCategory === 'quality' ? '焊接质量缺陷' : '动火作业无审批'}</option>
                    <option value={issueCategory === 'quality' ? '设备安装偏差' : '临时用电不规范'}>{issueCategory === 'quality' ? '设备安装偏差' : '临时用电不规范'}</option>
                  </select>
                  {errors.issueType && <p className="text-xs text-red-500 mt-1">{errors.issueType}</p>}
                </div>
                <div>
                  <label className="text-sm text-steel-700 block mb-1.5">问题发现时间<span className="text-red-500 ml-1">*</span></label>
                  <input type="date" disabled={isView} value={discoverDate} onChange={(e) => setDiscoverDate(e.target.value)} className={errors.discoverDate ? errorInputCls : inputCls} />
                  {errors.discoverDate && <p className="text-xs text-red-500 mt-1">{errors.discoverDate}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-steel-700 block mb-1.5">问题等级<span className="text-red-500 ml-1">*</span></label>
                  <select disabled={isView} value={issueLevel} onChange={(e) => setIssueLevel(e.target.value)} className={errors.issueLevel ? errorInputCls + ' cursor-pointer' : inputCls + ' cursor-pointer'}>
                    <option value="">请选择</option>
                    <option value="重大">重大</option>
                    <option value="较大">较大</option>
                    <option value="一般">一般</option>
                  </select>
                  {errors.issueLevel && <p className="text-xs text-red-500 mt-1">{errors.issueLevel}</p>}
                </div>
                <div>
                  <label className="text-sm text-steel-700 block mb-1.5">整改完成期限<span className="text-red-500 ml-1">*</span></label>
                  <input type="date" disabled={isView} value={deadline} onChange={(e) => setDeadline(e.target.value)} className={errors.deadline ? errorInputCls : inputCls} />
                  {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm text-steel-700 block mb-1.5">问题内容<span className="text-red-500 ml-1">*</span></label>
                <textarea disabled={isView} value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={2000} className={errors.description ? errorInputCls : inputCls + ' resize-none'} placeholder="请详细描述问题情况..." />
                <div className="flex justify-between mt-1">
                  {errors.description ? <p className="text-xs text-red-500">{errors.description}</p> : <span />}
                  <span className="text-xs text-steel-400">{description.length}/2000</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-steel-700 block mb-1.5">问题照片</label>
                <div className="border-2 border-dashed border-steel-200 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                    <i className="ri-image-add-line text-xl text-steel-400" />
                  </div>
                  <p className="text-sm text-steel-500">点击或拖拽上传照片</p>
                  <p className="text-xs text-steel-400 mt-1">支持 jpg、png 格式，单个文件不超过 10MB，最多 20 张</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-steel-700 block mb-1.5">附件上传</label>
                <div className="border-2 border-dashed border-steel-200 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-2">
                    <i className="ri-attachment-2 text-xl text-steel-400" />
                  </div>
                  <p className="text-sm text-steel-500">点击或拖拽上传附件</p>
                  <p className="text-xs text-steel-400 mt-1">支持图片、Word、PDF格式，单个文件不超过 10MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* 施工方信息 */}
          <div>
            <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #ef4444, #dc2626)' }} />
              施工方信息
            </h4>
            <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-lg p-3 border border-steel-100">
              <div>
                <label className="text-xs text-steel-400 block mb-1">施工方名称</label>
                <span className="text-sm text-steel-700">{issue?.constructionUnit || '中冶天工集团'}</span>
              </div>
              <div>
                <label className="text-sm text-steel-700 block mb-1.5">扣分值</label>
                <input type="number" disabled={isView} value={constructionScore} onChange={(e) => setConstructionScore(e.target.value)} className={errors.constructionScore ? errorInputCls : inputCls} placeholder="整数" />
                {errors.constructionScore && <p className="text-xs text-red-500 mt-1">{errors.constructionScore}</p>}
              </div>
              <div>
                <label className="text-sm text-steel-700 block mb-1.5">扣款金额（元）</label>
                <input type="number" step="1" disabled={isView} value={constructionAmount} onChange={(e) => setConstructionAmount(e.target.value)} className={errors.constructionAmount ? errorInputCls : inputCls} placeholder="保留两位小数" />
                {errors.constructionAmount && <p className="text-xs text-red-500 mt-1">{errors.constructionAmount}</p>}
              </div>
            </div>
          </div>

          {/* 监理方信息 */}
          <div>
            <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #f59e0b, #d97706)' }} />
              监理方信息
            </h4>
            <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-lg p-3 border border-steel-100">
              <div>
                <label className="text-xs text-steel-400 block mb-1">监理方名称</label>
                <span className="text-sm text-steel-700">{issue?.supervisorUnit || '上海宝钢监理'}</span>
              </div>
              <div>
                <label className="text-sm text-steel-700 block mb-1.5">扣分值</label>
                <input type="number" disabled={isView} value={supervisorScore} onChange={(e) => setSupervisorScore(e.target.value)} className={errors.supervisorScore ? errorInputCls : inputCls} placeholder="整数" />
                {errors.supervisorScore && <p className="text-xs text-red-500 mt-1">{errors.supervisorScore}</p>}
              </div>
              <div>
                <label className="text-sm text-steel-700 block mb-1.5">扣款金额（元）</label>
                <input type="number" step="1" disabled={isView} value={supervisorAmount} onChange={(e) => setSupervisorAmount(e.target.value)} className={errors.supervisorAmount ? errorInputCls : inputCls} placeholder="保留两位小数" />
                {errors.supervisorAmount && <p className="text-xs text-red-500 mt-1">{errors.supervisorAmount}</p>}
              </div>
            </div>
          </div>

          {/* 整改记录（仅查看时显示） */}
          {isView && issue && issue.rectifyRecords.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-steel-700 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #10b981, #059669)' }} />
                整改记录
              </h4>
              <div className="space-y-3">
                {issue.rectifyRecords.map((record) => (
                  <div key={record.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${record.type === '发起' ? 'bg-red-500' : record.type === '整改' ? 'bg-blue-500' : 'bg-green-500'}`} />
                      <div className="w-px flex-1 bg-steel-200 mt-1" />
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${record.type === '发起' ? 'bg-red-50 text-red-700' : record.type === '整改' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>{record.type}</span>
                        <span className="text-xs text-steel-500">{record.time}</span>
                        <span className="text-xs text-steel-600">{record.operator}</span>
                      </div>
                      <p className="text-sm text-steel-700">{record.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end gap-3">
          {isView ? (
            <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
          ) : (
            <>
              <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">取消</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <div className="flex items-center gap-1.5">
                  <i className="ri-save-line" />保存
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 规范弹窗 */}
      {standardsOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setStandardsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[680px] max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-steel-800">质量安全问题管理规范</h3>
              <button onClick={() => setStandardsOpen(false)} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="prose prose-sm max-w-none text-steel-700 whitespace-pre-wrap text-sm leading-relaxed">
                {standardsContent}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-steel-200 flex justify-end">
              <button onClick={() => setStandardsOpen(false)} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}