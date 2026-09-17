import { getOverviewTabPlaceholderRows } from '@/mocks/initiationOverviewMocks';

type TabKey = 'contract' | 'member' | 'cost' | 'material' | 'archive';

interface Props {
  overviewId: string;
  tab: TabKey;
}

const TAB_META: Record<TabKey, { title: string; headers: string[]; tip: string }> = {
  contract: {
    title: '合同与需求',
    headers: ['合同/需求名称', '类型', '状态', '金额(万元)'],
    tip: '演示数据，完整合同与需求明细后续对接业务模块',
  },
  member: {
    title: '项目成员',
    headers: ['角色', '姓名', '所属单位', '状态'],
    tip: '演示数据，完整成员管理后续对接参建方模块',
  },
  cost: {
    title: '费用信息',
    headers: ['费用项', '状态', '金额(万元)', '说明'],
    tip: '演示数据，完整费用台账后续对接费用模块',
  },
  material: {
    title: '物料信息',
    headers: ['物料名称', '单位', '数量', '状态'],
    tip: '演示数据，完整物料清单后续对接物资模块',
  },
  archive: {
    title: '项目档案',
    headers: ['资料名称', '必填/选填', '上传状态', '存档'],
    tip: '演示数据，完整档案目录后续对接档案管理',
  },
};

export default function OverviewPlaceholderTab({ overviewId, tab }: Props) {
  const meta = TAB_META[tab];
  const rows = getOverviewTabPlaceholderRows(overviewId, tab);

  return (
    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="flex items-center gap-2">
          <i className="ri-table-line text-emerald-500" />
          <h3 className="text-sm font-semibold text-steel-800">{meta.title}</h3>
        </div>
        <span className="text-xs text-steel-400">{meta.tip}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-steel-200">
              <th className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left w-14">序号</th>
              {meta.headers.map((h) => (
                <th key={h} className="px-3 py-2.5 text-xs font-medium text-steel-500 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} className="border-b border-steel-100 hover:bg-slate-50/50">
                <td className="px-3 py-2.5 text-sm text-steel-500">{idx + 1}</td>
                <td className="px-3 py-2.5 text-sm text-steel-800">{r.col1}</td>
                <td className="px-3 py-2.5 text-sm text-steel-600">{r.col2}</td>
                <td className="px-3 py-2.5 text-sm text-steel-600">{r.col3}</td>
                <td className="px-3 py-2.5 text-sm text-steel-600">{r.col4}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
