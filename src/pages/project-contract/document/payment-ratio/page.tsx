import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { getContractDocumentById, formatPercent } from '@/mocks/contractDocumentMocks';

export default function ContractDocumentPaymentRatioPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const contractId = urlParams.get('contractId') || '';
  const contract = useMemo(() => getContractDocumentById(contractId), [contractId]);

  const [ratios, setRatios] = useState({
    jiananDiscountRatio: contract?.jiananDiscountRatio ?? 0,
    jiananPaymentRatio: contract?.jiananPaymentRatio ?? 0,
    jiananWarrantyRatio: contract?.jiananWarrantyRatio ?? 0,
    equipmentPaymentRatio: contract?.equipmentPaymentRatio ?? 0,
    equipmentWarrantyRatio: contract?.equipmentWarrantyRatio ?? 0,
    supervisorPaymentRatio: contract?.supervisorPaymentRatio ?? 0,
    supervisorWarrantyRatio: contract?.supervisorWarrantyRatio ?? 0,
    otherPrepayRatio: contract?.otherPrepayRatio ?? 0,
    otherWarrantyRatio: contract?.otherWarrantyRatio ?? 0,
  });

  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleChange = (field: string, value: number) => {
    setRatios(prev => ({ ...prev, [field]: Math.max(0, Math.min(100, value)) }));
  };

  if (!contract) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 flex items-center justify-center mb-4"><i className="ri-error-warning-line text-3xl text-slate-400" /></div>
          <p className="text-slate-500 mb-4">未找到合同信息</p>
          <button onClick={() => navigate('/project-contract/document')} className="px-4 py-2 text-sm text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>返回列表</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200 p-5 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-slate-800">修改付款比例</h1>
          <button onClick={() => navigate('/project-contract/document')} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>返回
          </button>
        </div>

        {/* Contract Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-800">合同基本信息</span>
          </div>
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">立项号</span>
              <input type="text" value={contract.approvalNo} disabled className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同编号</span>
              <input type="text" value={contract.contractNo} disabled className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap w-20">合同名称</span>
              <input type="text" value={contract.contractName} disabled className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Payment Ratios */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-slate-800">付款比例修改</span>
          </div>
          <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-lg border border-slate-200">
            {[
              { key: 'jiananDiscountRatio', label: '建安折扣比例(%)' },
              { key: 'jiananPaymentRatio', label: '建安付款比例(%)' },
              { key: 'jiananWarrantyRatio', label: '建安质保金比例(%)' },
              { key: 'equipmentPaymentRatio', label: '设备付款比例(%)' },
              { key: 'equipmentWarrantyRatio', label: '设备质保金比例(%)' },
              { key: 'supervisorPaymentRatio', label: '监理付款比例(%)' },
              { key: 'supervisorWarrantyRatio', label: '监理质保金比例(%)' },
              { key: 'otherPrepayRatio', label: '其他预付款比例(%)' },
              { key: 'otherWarrantyRatio', label: '其他质保金比例(%)' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-sm text-slate-600 whitespace-nowrap w-28">{label}</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={ratios[key as keyof typeof ratios]}
                  onChange={e => handleChange(key, Number(e.target.value))}
                  className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200">
          <button onClick={() => showToast('付款比例保存成功')} className="px-6 py-2 text-sm text-white rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line" /></div>保存
          </button>
          <button onClick={() => navigate('/project-contract/document')} className="px-6 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-close-line" /></div>取消
          </button>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg">{toast}</div>}
    </Layout>
  );
}