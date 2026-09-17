import { useMemo } from 'react';
import { argumentApplyRecords } from '@/mocks/argumentApplyMocks';
import { approvalHistoryData } from '@/mocks/argumentApprovalMocks';
import ComputeResourceSection, { type ComputeResourceRow } from '@/components/feature/ComputeResourceSection';

interface ArgumentDetailModalProps {
  open: boolean;
  applyNo: string;
  onClose: () => void;
}

interface OperationLog {
  id: string;
  operation: string;
  operator: string;
  operateTime: string;
  description: string;
}

const STAGES = [
  { id: 1, name: '论证申请', icon: 'ri-file-edit-line' },
  { id: 2, name: '业主单位审批', icon: 'ri-building-2-line' },
  { id: 3, name: '专业部门审批', icon: 'ri-group-line', isParallel: true, subStages: [
    '风险与机遇审批', '人力资源部审批', '数评审批', '业务主管部门审批', '数研院审批', '项目效益审批', '建设周期审批',
  ]},
  { id: 4, name: '总师室审批', icon: 'ri-user-star-line' },
  { id: 5, name: '论证意见签署', icon: 'ri-draft-line' },
  { id: 6, name: '项目立项申请', icon: 'ri-file-add-line' },
  { id: 7, name: '项目立项审核', icon: 'ri-check-double-line' },
  { id: 8, name: '项目立项签发', icon: 'ri-send-plane-line' },
];

const divCls = 'text-xs text-steel-400 block mb-1';
const valCls = 'text-sm text-steel-700';

function generateOperationLogs(applyNo: string): OperationLog[] {
  const history = approvalHistoryData[applyNo] || [];
  const logs: OperationLog[] = [];

  logs.push({
    id: 'log_0',
    operation: '论证申请',
    operator: '张三',
    operateTime: '2026-04-08 09:15:00',
    description: `创建论证申请「${applyNo}」，所属事业部：炼铁事业部，项目类型：大型新建`,
  });

  logs.push({
    id: 'log_1',
    operation: '修改',
    operator: '张三',
    operateTime: '2026-04-08 14:30:00',
    description: '修改项目工期从240天调整为274天，更新申报费用概算，更新主要设备/设施描述内容',
  });

  history.forEach((h, idx) => {
    const nodeName = h.nodeStatus || h.status || '审批';
    const isReject = h.opinion.includes('退回') || h.opinion.includes('驳回');

    if (nodeName.includes('总师室')) {
      logs.push({
        id: `log_total_${idx}`,
        operation: `总师室${isReject ? '退回' : '通过'}`,
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: isReject ? `退回原因：${h.opinion}` : `通过原因：${h.opinion}`,
      });
    } else if (nodeName.includes('风险')) {
      logs.push({
        id: `log_risk_${idx}`,
        operation: `风险与机遇${isReject ? '退回' : '通过'}`,
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: isReject ? `退回原因：${h.opinion}` : `通过原因：${h.opinion}`,
      });
    } else if (nodeName.includes('数评')) {
      logs.push({
        id: `log_digital_${idx}`,
        operation: `数评审批${isReject ? '退回' : '通过'}`,
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: isReject ? `退回原因：${h.opinion}` : `通过原因：${h.opinion}`,
      });
    } else if (nodeName.includes('人力')) {
      logs.push({
        id: `log_hr_${idx}`,
        operation: `人力资源部审批${isReject ? '退回' : '通过'}`,
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: isReject ? `退回原因：${h.opinion}` : `通过原因：${h.opinion}`,
      });
    } else if (nodeName.includes('业务')) {
      logs.push({
        id: `log_biz_${idx}`,
        operation: `业务主管部门审批${isReject ? '退回' : '通过'}`,
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: isReject ? `退回原因：${h.opinion}` : `通过原因：${h.opinion}`,
      });
    } else if (nodeName.includes('数研院')) {
      logs.push({
        id: `log_research_${idx}`,
        operation: `数研院审批${isReject ? '退回' : '通过'}`,
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: isReject ? `退回原因：${h.opinion}` : `通过原因：${h.opinion}`,
      });
    } else if (nodeName.includes('建设周期')) {
      logs.push({
        id: `log_cycle_${idx}`,
        operation: `建设周期审批${isReject ? '退回' : '通过'}`,
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: isReject ? `退回原因：${h.opinion}` : `通过原因：${h.opinion}`,
      });
    } else if (nodeName.includes('效益')) {
      logs.push({
        id: `log_benefit_${idx}`,
        operation: `项目效益审批${isReject ? '退回' : '通过'}`,
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: isReject ? `退回原因：${h.opinion}` : `通过原因：${h.opinion}`,
      });
    } else if (nodeName.includes('删除')) {
      logs.push({
        id: `log_del_${idx}`,
        operation: '删除',
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: `删除论证申请，原因：${h.opinion}`,
      });
    } else {
      logs.push({
        id: `log_other_${idx}`,
        operation: `${nodeName}${isReject ? '退回' : '通过'}`,
        operator: h.person || h.operator || '经办人',
        operateTime: h.time,
        description: isReject ? `退回原因：${h.opinion}` : `通过原因：${h.opinion}`,
      });
    }
  });

  return logs;
}

function getCurrentStage(applyNo: string): number {
  const history = approvalHistoryData[applyNo] || [];
  if (history.length === 0) return 1;
  const lastNode = history[history.length - 1];
  const nodeName = lastNode.nodeStatus || lastNode.status || '';
  if (nodeName.includes('总师室') && !lastNode.opinion.includes('退回')) return 5;
  if (nodeName.includes('签署') || nodeName.includes('意见')) return 6;
  if (nodeName.includes('立项签发')) return 8;
  if (nodeName.includes('立项审核')) return 7;
  if (nodeName.includes('立项申请')) return 6;
  if (history.some(h => (h.nodeStatus || h.status || '').includes('总师室'))) return 4;
  if (history.some(h => ['风险', '人力', '数评', '业务', '数研院', '效益', '建设周期'].some(k => (h.nodeStatus || h.status || '').includes(k)))) return 3;
  return 2;
}

export default function ArgumentDetailModal({ open, applyNo, onClose }: ArgumentDetailModalProps) {
  const record = useMemo(() => argumentApplyRecords.find((r) => r.applyNo === applyNo), [applyNo]);
  const logs = useMemo(() => generateOperationLogs(applyNo), [applyNo]);
  const currentStage = useMemo(() => getCurrentStage(applyNo), [applyNo]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl flex flex-col" style={{ width: '1050px', maxHeight: '88vh' }}>
        <div className="px-6 py-4 border-b border-steel-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-steel-800">论证详情</h3>
            <p className="text-xs text-steel-400 mt-0.5">申请单号：{applyNo}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-steel-400 hover:text-steel-600 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {record ? (
            <>
              {/* Stage Visualization */}
              <div>
                <h4 className="text-sm font-semibold text-steel-700 mb-3 pb-2 border-b border-steel-100">论证阶段</h4>
                <div className="flex items-start gap-0 overflow-x-auto pb-3">
                  {STAGES.map((stage, idx) => {
                    const isActive = stage.id <= currentStage;
                    const isCurrent = stage.id === currentStage;
                    const isFuture = stage.id > currentStage;
                    return (
                      <div key={stage.id} className="flex items-start flex-shrink-0">
                        <div className="flex flex-col items-center" style={{ width: stage.isParallel ? '240px' : '100px' }}>
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isCurrent ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{
                              background: isCurrent
                                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                : isActive
                                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                : '#e8edf3',
                              color: isActive ? 'white' : '#94a3b8',
                            }}
                          >
                            {isActive ? (
                              isCurrent ? (
                                <i className="ri-hourglass-2-line text-base" />
                              ) : (
                                <i className="ri-check-line text-base" />
                              )
                            ) : (
                              <span className="text-xs font-bold">{stage.id}</span>
                            )}
                          </div>
                          <p
                            className={`text-[11px] mt-1.5 text-center leading-tight font-medium ${
                              isCurrent ? 'text-green-600' : isActive ? 'text-steel-700' : 'text-slate-400'
                            }`}
                          >
                            {stage.name}
                          </p>
                          {stage.isParallel && (
                            <div className="mt-1 space-y-0.5 w-full">
                              {(stage.subStages || []).map((sub) => {
                                const subDone = isActive && currentStage > 3;
                                const isSubCurrent = isCurrent;
                                return (
                                  <span
                                    key={sub}
                                    className={`block text-[10px] px-1.5 py-0.5 rounded text-center leading-tight ${
                                      subDone
                                        ? 'bg-green-50 text-green-600'
                                        : isSubCurrent
                                        ? 'bg-amber-50 text-amber-600'
                                        : 'bg-slate-50 text-slate-400'
                                    }`}
                                  >
                                    {sub}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        {idx < STAGES.length - 1 && (
                          <div className="flex items-center pt-4" style={{ width: '20px' }}>
                            <div
                              className="h-0.5"
                              style={{
                                width: '100%',
                                background: isActive && !isCurrent ? '#3b82f6' : isCurrent ? '#22c55e' : '#e8edf3',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 论证基本信息1 */}
              <div>
                <h4 className="text-sm font-semibold text-steel-700 mb-3 pb-2 border-b border-steel-100">一、论证基本信息1</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={divCls}>论证申请单号</label><span className={`${valCls} font-mono`}>{record.applyNo}</span></div>
                  <div><label className={divCls}>论证申请名称</label><span className={valCls}>{record.applyName}</span></div>
                  <div><label className={divCls}>项目类型</label><span className={valCls}>{record.projectType}</span></div>
                  <div><label className={divCls}>事业部</label><span className={valCls}>{record.division}</span></div>
                  <div><label className={divCls}>状态</label><span className={valCls}>{record.status}</span></div>
                  <div><label className={divCls}>建立日期</label><span className={valCls}>{record.createDate}</span></div>
                  <div><label className={divCls}>创建人</label><span className={valCls}>{record.creator}</span></div>
                  <div><label className={divCls}>年度计划号</label><span className={`${valCls} font-mono`}>{record.planNo}</span></div>
                  <div><label className={divCls}>申报费用（万元）</label><span className={`${valCls} font-semibold`}>{record.applyAmount.toFixed(2)}</span></div>
                  <div><label className={divCls}>建设单位</label><span className={valCls}>{record.buildUnit}</span></div>
                  <div><label className={divCls}>项目经理</label><span className={valCls}>{record.projectManager}</span></div>
                  <div><label className={divCls}>申报日期</label><span className={valCls}>{record.applyDate}</span></div>
                </div>
              </div>

              {/* 论证基本信息2 */}
              <div>
                <h4 className="text-sm font-semibold text-steel-700 mb-3 pb-2 border-b border-steel-100">二、论证基本信息2</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-steel-500 block mb-1 bg-slate-50 px-2 py-1 rounded">公辅配套 - 水</label>
                    <p className="text-sm text-steel-600">满足生产需要，接入厂区供水管网</p>
                  </div>
                  <div>
                    <label className="text-xs text-steel-500 block mb-1 bg-slate-50 px-2 py-1 rounded">公辅配套 - 电</label>
                    <p className="text-sm text-steel-600">新增用电负荷约5000kVA，接入10kV配电</p>
                  </div>
                  <div>
                    <label className="text-xs text-steel-500 block mb-1 bg-slate-50 px-2 py-1 rounded">技术目标</label>
                    <p className="text-sm text-steel-600">达到行业领先技术水平，关键指标超设计值10%以上</p>
                  </div>
                  <div>
                    <label className="text-xs text-steel-500 block mb-1 bg-slate-50 px-2 py-1 rounded">效益效果</label>
                    <p className="text-sm text-steel-600">投资回收期约3.5年，年节约成本约320万元</p>
                  </div>
                  <div>
                    <label className="text-xs text-steel-500 block mb-1 bg-slate-50 px-2 py-1 rounded">创新性、智能数字化</label>
                    <p className="text-sm text-steel-600">采用数字孪生技术实现全流程智能化管控</p>
                  </div>
                  <div>
                    <label className="text-xs text-steel-500 block mb-1 bg-slate-50 px-2 py-1 rounded">能源提升与评估</label>
                    <p className="text-sm text-steel-600">综合能耗降低12%，采用余热回收等节能措施</p>
                  </div>
                </div>
              </div>

              {/* 论证基本信息3 */}
              <div>
                <h4 className="text-sm font-semibold text-steel-700 mb-3 pb-2 border-b border-steel-100">三、论证基本信息3</h4>
                <div className="border border-steel-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 w-12">序号</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500">设备名称</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 text-right">原值（万元）</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 text-right">残值（万元）</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 text-right">剩余备件</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: '高炉热风炉系统', orig: 1250.00, salvage: 185.00, spare: '32件' },
                        { name: '转炉除尘风机', orig: 680.00, salvage: 95.00, spare: '18件' },
                        { name: '热轧精轧机组', orig: 2100.00, salvage: 420.00, spare: '45件' },
                        { name: '连铸切割设备', orig: 890.00, salvage: 120.00, spare: '22件' },
                      ].map((item, i) => (
                        <tr key={i} className="border-b border-steel-100">
                          <td className="px-3 py-2 text-sm text-steel-500">{i + 1}</td>
                          <td className="px-3 py-2 text-sm text-steel-700">{item.name}</td>
                          <td className="px-3 py-2 text-sm text-steel-700 text-right font-mono">{item.orig.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-steel-700 text-right font-mono">{item.salvage.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-steel-600 text-right">{item.spare}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 论证估算申请表 */}
              <div>
                <h4 className="text-sm font-semibold text-steel-700 mb-3 pb-2 border-b border-steel-100">四、论证估算申请表</h4>
                <div className="border border-steel-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500">费用项目</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 text-right">估算金额（万元）</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 text-right">已用金额（万元）</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 text-right">剩余金额（万元）</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { item: '土建工程费', est: 1250.50, used: 1020.30, remain: 230.20 },
                        { item: '设备购置费', est: 3800.00, used: 2950.00, remain: 850.00 },
                        { item: '安装工程费', est: 980.00, used: 720.50, remain: 259.50 },
                        { item: '设计勘察费', est: 320.00, used: 280.00, remain: 40.00 },
                        { item: '监理费', est: 180.00, used: 150.00, remain: 30.00 },
                        { item: '其他费用', est: 650.00, used: 480.00, remain: 170.00 },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-steel-100">
                          <td className="px-3 py-2 text-sm text-steel-700">{row.item}</td>
                          <td className="px-3 py-2 text-sm text-steel-700 text-right font-mono">{row.est.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-steel-700 text-right font-mono">{row.used.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-steel-700 text-right font-mono">{row.remain.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <td className="px-3 py-2 text-sm text-steel-800 font-semibold">合计</td>
                        <td className="px-3 py-2 text-sm text-steel-800 font-semibold text-right font-mono">7180.50</td>
                        <td className="px-3 py-2 text-sm text-steel-800 font-semibold text-right font-mono">5600.80</td>
                        <td className="px-3 py-2 text-sm text-steel-800 font-semibold text-right font-mono">1579.70</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 通算/智算资源配置 */}
              <div>
                <h4 className="text-sm font-semibold text-steel-700 mb-3 pb-2 border-b border-steel-100">四-1、通算/智算资源配置</h4>
                <ComputeResourceSection
                  tongSuanHas="是"
                  zhiSuanHas="否"
                  tongSuanRows={[{ id: 'd1', userName: '张建国', department: '炼铁事业部', cloudHostName: 'lj-gpu-01', cpu: '32核', memory: '128GB', image: 'CentOS 7.9', dataDisk: '500GB SSD', remark: '高炉数字孪生模型训练' },{ id: 'd2', userName: '李明华', department: '设备管理部', cloudHostName: 'lj-cpu-02', cpu: '16核', memory: '64GB', image: 'Ubuntu 22.04', dataDisk: '200GB', remark: '设备数据采集与分析' }]}
                  zhiSuanRows={[]}
                  onTongSuanHasChange={() => {}}
                  onZhiSuanHasChange={() => {}}
                  onTongSuanRowsChange={() => {}}
                  onZhiSuanRowsChange={() => {}}
                  readonly
                />
              </div>

              {/* 项目研究报告人员 */}
              <div>
                <h4 className="text-sm font-semibold text-steel-700 mb-3 pb-2 border-b border-steel-100">五、项目研究报告人员</h4>
                <div className="border border-steel-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left" style={{ minWidth: 800 }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">序号</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap">工号</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap">姓名</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap">职称</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap">单位</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap">职务</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap" style={{ minWidth: 200 }}>甲方工作职责</th>
                        <th className="px-3 py-2 text-xs font-semibold text-steel-500 whitespace-nowrap">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { seq: 1, empNo: 'EMP001', name: '张建国', title: '高级工程师', unit: '炼钉事业部', position: '项目经理', partyDuty: '负责与甲方沟通项目整体推进和决策协调', remark: '负责整体方案设计' },
                        { seq: 2, empNo: 'EMP002', name: '李明华', title: '工程师', unit: '设备管理部', position: '技术负责人', partyDuty: '对接甲方设备管理部门，协调设备选型需求', remark: '负责设备选型' },
                        { seq: 3, empNo: 'EMP003', name: '王志远', title: '助理工程师', unit: '科技质量部', position: '成员', partyDuty: '配合甲方质量管控工作，参与质量验收', remark: '负责质量管控' },
                        { seq: 4, empNo: 'EMP004', name: '陈建华', title: '高级工程师', unit: '安全环保部', position: '安全专员', partyDuty: '对接甲方安全管理部门，落实安全三同时要求', remark: '负责安全管理' },
                      ].map((p) => (
                        <tr key={p.seq} className="border-b border-steel-100">
                          <td className="px-3 py-2 text-xs text-steel-500">{p.seq}</td>
                          <td className="px-3 py-2 text-xs text-steel-600 font-mono whitespace-nowrap">{p.empNo}</td>
                          <td className="px-3 py-2 text-xs text-steel-700 font-medium whitespace-nowrap">{p.name}</td>
                          <td className="px-3 py-2 text-xs text-steel-600 whitespace-nowrap">{p.title}</td>
                          <td className="px-3 py-2 text-xs text-steel-600 whitespace-nowrap">{p.unit}</td>
                          <td className="px-3 py-2 text-xs text-steel-600 whitespace-nowrap">{p.position}</td>
                          <td className="px-3 py-2 text-xs text-steel-600">{p.partyDuty}</td>
                          <td className="px-3 py-2 text-xs text-steel-500">{p.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 审批历史轨迹 */}
              <div>
                <h4 className="text-sm font-semibold text-steel-700 mb-3 pb-2 border-b border-steel-100">审批历史轨迹</h4>
                <div className="border border-steel-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap w-12">序号</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">审批节点</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">审批人</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">审批状态</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500" style={{ minWidth: '200px' }}>审批意见</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">审批时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(approvalHistoryData[applyNo] || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-8 text-center text-xs text-steel-400">暂无审批记录</td>
                        </tr>
                      ) : (
                        (approvalHistoryData[applyNo] || []).map((h, idx) => {
                          const isPass = !h.opinion.includes('退回') && !h.opinion.includes('驳回') && !h.opinion.includes('补充');
                          const isReject = h.opinion.includes('退回') || h.opinion.includes('驳回');
                          const statusColor = isPass ? 'bg-green-50 text-green-700 border border-green-200' : isReject ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200';
                          const statusLabel = isPass ? '已通过' : isReject ? '已驳回' : '审批中';
                          return (
                            <tr key={h.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                              <td className="px-3 py-2.5 text-sm text-steel-500">{idx + 1}</td>
                              <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{h.nodeStatus || h.status || '-'}</td>
                              <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{h.person || h.operator || '-'}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>{statusLabel}</span>
                              </td>
                              <td className="px-3 py-2.5 text-sm text-steel-700 max-w-[200px]">
                                <span className="line-clamp-2" title={h.opinion}>{h.opinion}</span>
                              </td>
                              <td className="px-3 py-2.5 text-sm text-steel-500 whitespace-nowrap">{h.time}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 操作日志 */}
              <div>
                <h4 className="text-sm font-semibold text-steel-700 mb-3 pb-2 border-b border-steel-100">操作日志</h4>
                <div className="border border-steel-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">操作</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">操作人</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500 whitespace-nowrap">操作时间</th>
                        <th className="px-3 py-2.5 text-xs font-semibold text-steel-500" style={{ minWidth: '300px' }}>说明</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} className="border-b border-steel-100 hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2.5 text-sm text-steel-700 whitespace-nowrap font-medium">{log.operation}</td>
                          <td className="px-3 py-2.5 text-sm text-steel-600 whitespace-nowrap">{log.operator}</td>
                          <td className="px-3 py-2.5 text-sm text-steel-500 whitespace-nowrap">{log.operateTime}</td>
                          <td className="px-3 py-2.5 text-sm text-steel-600">{log.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 mx-auto mb-3">
                <i className="ri-file-info-line text-2xl text-steel-300" />
              </div>
              <p className="text-sm text-steel-400">未找到对应的论证申请记录</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-steel-200 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
        </div>
      </div>
    </div>
  );
}