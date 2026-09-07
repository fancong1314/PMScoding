import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getEpcContractById, getEpcDevicesByContractId, EpcDevice } from '@/mocks/epcEquipmentMocks';

interface AnchorSection {
  key: string;
  label: string;
}

const sections: AnchorSection[] = [
  { key: 'basic', label: '合同基本信息' },
  { key: 'summary', label: '验收结论汇总' },
  { key: 'devices', label: '设备明细列表' },
];

export default function EpcEquipmentDetailPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';

  const contract = getEpcContractById(contractId);
  const devices = useMemo(() => contractId ? getEpcDevicesByContractId(contractId) : [], [contractId]);

  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [flowModalDevice, setFlowModalDevice] = useState<EpcDevice | null>(null);

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('data-section') || '');
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    sections.forEach((s) => {
      const el = sectionRefs.current[s.key];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleExport = () => {
    const header = '合同编号,合同名称,设备名称,单位,品牌,数量,单重,规格型号,是否满足(监理),偏离项(监理),验收时间(监理),验收人(监理),附件(监理),是否满足(项目组),偏离项(项目组),验收时间(项目组),验收人(项目组),附件(项目组)\n';
    const rows = devices.map((d) => [
      contract?.contractNo, contract?.contractName, d.name, d.unit, d.brand, d.quantity, d.singleWeight, d.spec,
      d.supervisorSatisfied, d.supervisorDeviation || '--', d.supervisorTime, d.supervisorPerson, d.supervisorAttachment,
      d.clientSatisfied || '待审核', d.clientDeviation || '--', d.clientTime || '--', d.clientPerson || '--', d.clientAttachment || '--',
    ].join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `EPC设备验收详情_${contract?.contractNo || ''}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!contract) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-slate-200 p-5 text-center text-slate-500">合同数据不存在</div>
      </Layout>
    );
  }

  const passRate = contract.totalDevices > 0 ? `${((contract.clientPassed / contract.totalDevices) * 100).toFixed(1)}%` : '0%';

  return (
    <Layout>
      <div className="flex gap-5">
        {/* Left Anchor Nav */}
        <div className="w-44 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">页面导航</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.key} onClick={() => scrollToSection(s.key)} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeSection === s.key ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">EPC设备验收详情</h1>
              <p className="text-sm text-slate-500 mt-0.5">{contract.contractName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExport} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line" /></div>导出
              </button>
              <button onClick={() => navigate('/project-contract/epc-equipment')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
              </button>
            </div>
          </div>

          {/* Section 1: Contract Basic Info */}
          <div ref={(el) => { sectionRefs.current['basic'] = el; }} data-section="basic" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">合同基本信息</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-8">
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600">合同编号</span><span className="text-sm font-medium text-slate-800">{contract.contractNo}</span></div>
              <div className="flex items-center gap-2"><span className="text-sm text-slate-600">合同名称</span><span className="text-sm font-medium text-slate-800">{contract.contractName}</span></div>
            </div>
          </div>

          {/* Section 2: Summary */}
          <div ref={(el) => { sectionRefs.current['summary'] = el; }} data-section="summary" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-800">验收结论汇总统计</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 mb-1">申报设备总数</div>
                <div className="text-2xl font-bold text-slate-800">{contract.totalDevices}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 mb-1">监理验收通过</div>
                <div className="text-2xl font-bold text-emerald-600">{contract.supervisorPassed}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 mb-1">监理验收未通过</div>
                <div className="text-2xl font-bold text-red-600">{contract.supervisorRejected}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 mb-1">设备验收合格率</div>
                <div className="text-2xl font-bold text-emerald-600">{passRate}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 mb-1">项目组审批通过</div>
                <div className="text-2xl font-bold text-emerald-600">{contract.clientPassed}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 mb-1">项目组审批驳回</div>
                <div className="text-2xl font-bold text-red-600">{contract.clientRejected}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 mb-1">项目组待审批</div>
                <div className="text-2xl font-bold text-amber-600">{contract.clientPending}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 mb-1">申报设备总数</div>
                <div className="text-2xl font-bold text-slate-800">{contract.totalDevices}</div>
              </div>
            </div>
          </div>

          {/* Section 3: Device List */}
          <div ref={(el) => { sectionRefs.current['devices'] = el; }} data-section="devices" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-slate-800">设备明细列表</span>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '50px' }}>序号</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '170px' }}>设备名称</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '50px' }}>单位</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>品牌</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '50px' }}>数量</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '60px' }}>单重</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>规格型号</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '95px' }}>是否满足(监理)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>偏离项(监理)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>验收时间(监理)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '90px' }}>验收人(监理)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>附件(监理)</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '95px' }}>是否满足(项目组)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '130px' }}>偏离项(项目组)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '120px' }}>验收时间(项目组)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '90px' }}>验收人(项目组)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '110px' }}>附件(项目组)</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600 whitespace-nowrap" style={{ minWidth: '70px' }}>详情</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device, idx) => {
                    const supervisorStatusColor = device.supervisorSatisfied === '满足' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700';
                    const clientStatusColor = device.clientStatus === 'passed' ? 'bg-emerald-50 text-emerald-700' : device.clientStatus === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-500';
                    const clientSatisfiedLabel = device.clientStatus === 'passed' ? '满足' : device.clientStatus === 'rejected' ? '不满足' : '待处理';
                    return (
                      <tr key={device.id} className="group hover:bg-slate-50/60 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap text-center">{idx + 1}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.name}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.unit}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.brand}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap text-center">{device.quantity}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.singleWeight}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.spec}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${supervisorStatusColor}`}>{device.supervisorSatisfied}</span>
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.supervisorDeviation || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.supervisorTime}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.supervisorPerson}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          <span className="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1 cursor-pointer hover:bg-blue-100 w-fit">
                            <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line" /></div>{device.supervisorAttachment}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${clientStatusColor}`}>{clientSatisfiedLabel}</span>
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.clientDeviation || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.clientTime || '--'}</td>
                        <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{device.clientPerson || '--'}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {device.clientAttachment ? (
                            <span className="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1 cursor-pointer hover:bg-blue-100 w-fit">
                              <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-line" /></div>{device.clientAttachment}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">--</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-center">
                          <button onClick={() => setFlowModalDevice(device)} className="px-2 py-1 text-xs text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 cursor-pointer flex items-center gap-0.5 whitespace-nowrap">
                            <div className="w-3 h-3 flex items-center justify-center"><i className="ri-file-search-line" /></div>流程
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => navigate('/project-contract/epc-equipment')} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-go-back-line" /></div>返回
            </button>
            <button onClick={handleExport} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line" /></div>导出
            </button>
          </div>
        </div>
      </div>

      {/* Flow Modal */}
      {flowModalDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setFlowModalDevice(null)}>
          <div className="bg-white rounded-lg w-[900px] max-h-[85vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
              <div>
                <h3 className="text-base font-semibold text-slate-800">设备审批流程记录</h3>
                <p className="text-sm text-slate-500 mt-0.5">{flowModalDevice.name} · {flowModalDevice.spec}</p>
              </div>
              <button onClick={() => setFlowModalDevice(null)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer rounded-md hover:bg-slate-100"><i className="ri-close-line" /></button>
            </div>
            <div className="px-6 py-4 space-y-5">
              {/* Supervisor Review Stage */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700">监理审批阶段</span>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">阶段</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">偏离项</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">监理验收</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{flowModalDevice.supervisorPerson}</td>
                        <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${flowModalDevice.supervisorSatisfied === '满足' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {flowModalDevice.supervisorSatisfied === '满足' ? '验收通过' : '验收不通过'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{flowModalDevice.supervisorTime}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700">{flowModalDevice.supervisorDeviation || '--'}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700">{flowModalDevice.supervisorOpinion || '--'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Client Review Stage */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 rounded-full bg-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700">甲方审批阶段</span>
                </div>
                {flowModalDevice.clientStatus === 'pending' ? (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-400">
                    <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2"><i className="ri-time-line text-lg" /></div>
                    待处理
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">阶段</th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作人</th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作</th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">操作时间</th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">审核意见</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">甲方审批</td>
                          <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{flowModalDevice.clientPerson}</td>
                          <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${flowModalDevice.clientStatus === 'passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {flowModalDevice.clientStatus === 'passed' ? '审批通过' : '审批驳回'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap">{flowModalDevice.clientTime}</td>
                          <td className="px-3 py-2.5 text-sm text-slate-700">{flowModalDevice.clientOpinion || '--'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-end rounded-b-lg">
              <button onClick={() => setFlowModalDevice(null)} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap">关闭</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}