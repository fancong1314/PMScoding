import Layout from '@/components/feature/Layout';

export default function SporadicPaymentPage() {
  return (
    <Layout>
      <div className="space-y-3">
        <div>
          <h1 className="text-lg font-semibold text-steel-900">零星工程付款管理</h1>
          <p className="text-xs text-steel-400 mt-0.5">管理5万以内零星施工工程的付款业务</p>
        </div>
        <div className="bg-white rounded-lg border border-dashed border-steel-200 px-8 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center mb-3">
            <i className="ri-money-cny-circle-line text-xl text-sky-500" />
          </div>
          <p className="text-sm font-medium text-steel-700">功能内容后续提供</p>
          <p className="text-xs text-steel-400 mt-1.5 max-w-sm leading-relaxed">
            本模块将支持零星协议单相关付款申请、审批与台账查询。
          </p>
        </div>
      </div>
    </Layout>
  );
}
