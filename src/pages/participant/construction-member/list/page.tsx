import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { mockConstructionProjects, type ConstructionProject } from '@/mocks/constructionMemberMocks';

const projectTypeOptions = ['全部', '技改', '大中修', '零固', '零星施工'];
const ownerUnitOptions = ['全部', '炼铁事业部', '板材事业部', '炼钢事业部', '公辅事业部', '物流中心', '特钢事业部'];

export default function ConstructionMemberListPage() {
  const navigate = useNavigate();
  const [projects] = useState<ConstructionProject[]>(mockConstructionProjects);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('全部');
  const [searchOwnerUnit, setSearchOwnerUnit] = useState('全部');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (searchName && !p.projectName.toLowerCase().includes(searchName.toLowerCase()) && !p.projectNumber.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (searchType !== '全部' && p.projectType !== searchType) return false;
      if (searchOwnerUnit !== '全部' && p.ownerUnit !== searchOwnerUnit) return false;
      return true;
    });
  }, [projects, searchName, searchType, searchOwnerUnit]);

  return (
    <Layout>
      <div>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground-950 mb-1">施工成员管理</h2>
          <p className="text-sm text-foreground-600">按项目维度查看和管理各施工项目的成员信息，支持待审批提醒和成员详情查看</p>
        </div>

        {/* Search Filter */}
        <div className="bg-background-50 rounded-lg p-4 mb-4" style={{ border: '1px solid #e8edf3' }}>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground-600 font-medium">项目名称</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="模糊匹配项目名称或立项号"
                className="h-9 px-3 text-sm border border-background-200 rounded-md bg-white text-foreground-800 outline-none focus:border-primary-500 transition-colors w-56"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground-600 font-medium">项目类型</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="h-9 px-3 text-sm border border-background-200 rounded-md bg-white text-foreground-800 outline-none focus:border-primary-500 transition-colors"
              >
                {projectTypeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground-600 font-medium">业主单位</label>
              <select
                value={searchOwnerUnit}
                onChange={(e) => setSearchOwnerUnit(e.target.value)}
                className="h-9 px-3 text-sm border border-background-200 rounded-md bg-white text-foreground-800 outline-none focus:border-primary-500 transition-colors"
              >
                {ownerUnitOptions.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-background-50 rounded-lg" style={{ border: '1px solid #e8edf3' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#f8fafb' }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">序号</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">项目名称</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">立项号</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">项目类型</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">业主单位</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">合同数量</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">成员总数</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">待审批数</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="hover:bg-background-100 transition-colors"
                    style={{ borderBottom: '1px solid #f0f2f5' }}
                  >
                    <td className="px-4 py-2.5 text-foreground-700 whitespace-nowrap text-xs">{idx + 1}</td>
                    <td className="px-4 py-2.5 text-foreground-800 whitespace-nowrap text-xs font-medium">{p.projectName}</td>
                    <td className="px-4 py-2.5 text-foreground-700 whitespace-nowrap font-mono text-xs">{p.projectNumber}</td>
                    <td className="px-4 py-2.5 text-foreground-700 whitespace-nowrap text-xs">{p.projectType}</td>
                    <td className="px-4 py-2.5 text-foreground-700 whitespace-nowrap text-xs">{p.ownerUnit}</td>
                    <td className="px-4 py-2.5 text-foreground-700 whitespace-nowrap text-center text-xs">{p.contractCount}</td>
                    <td className="px-4 py-2.5 text-foreground-700 whitespace-nowrap text-center text-xs">{p.memberCount}</td>
                    <td className={`px-4 py-2.5 whitespace-nowrap text-center text-xs font-semibold ${p.pendingCount > 0 ? 'text-orange-500' : 'text-foreground-500'}`}>
                      {p.pendingCount}
                    </td>
                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/participant/construction-member/detail?projectId=${p.id}`)}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 cursor-pointer whitespace-nowrap"
                      >
                        <div className="w-3.5 h-3.5 inline-flex items-center justify-center mr-0.5"><i className="ri-eye-line" /></div>查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #e8edf3' }}>
            <span className="text-xs text-foreground-500">共 {filteredProjects.length} 个项目</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}