import { useState, useMemo } from 'react';
import Layout from '@/components/feature/Layout';
import {
  mockAttendanceRecords,
  attendanceDepartments,
  type AttendanceRecord,
} from '@/mocks/participantManagementMocks';

export default function AttendanceManagementPage() {
  const [searchDate, setSearchDate] = useState('2026-06-22');
  const [searchContractNo, setSearchContractNo] = useState('');
  const [searchContractName, setSearchContractName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredRecords = useMemo(() => {
    return mockAttendanceRecords.filter((r) => {
      if (searchDate && r.date !== searchDate) return false;
      if (searchContractNo && !r.contractNo.toLowerCase().includes(searchContractNo.toLowerCase())) return false;
      if (searchContractName && !r.contractName.toLowerCase().includes(searchContractName.toLowerCase())) return false;
      return true;
    });
  }, [searchDate, searchContractNo, searchContractName]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const pagedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setSearchDate('2026-06-22');
    setSearchContractNo('');
    setSearchContractName('');
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground-950 mb-1">施工考勤管理</h2>
          <p className="text-sm text-foreground-600">展示参建方当天打卡情况，通过海康接口获取人员打卡记录</p>
        </div>

        {/* Search Filter */}
        <div className="bg-background-50 rounded-lg p-4 mb-4" style={{ border: '1px solid #e8edf3' }}>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground-600 font-medium">日期</label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => { setSearchDate(e.target.value); setCurrentPage(1); }}
                className="h-9 px-3 text-sm border border-background-200 rounded-md bg-white text-foreground-800 outline-none focus:border-primary-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground-600 font-medium">合同号</label>
              <input
                type="text"
                value={searchContractNo}
                onChange={(e) => { setSearchContractNo(e.target.value); setCurrentPage(1); }}
                placeholder="模糊查询"
                className="h-9 px-3 text-sm border border-background-200 rounded-md bg-white text-foreground-800 outline-none focus:border-primary-500 transition-colors w-44"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground-600 font-medium">合同名称</label>
              <input
                type="text"
                value={searchContractName}
                onChange={(e) => { setSearchContractName(e.target.value); setCurrentPage(1); }}
                placeholder="模糊查询"
                className="h-9 px-3 text-sm border border-background-200 rounded-md bg-white text-foreground-800 outline-none focus:border-primary-500 transition-colors w-56"
              />
            </div>
            <button
              onClick={() => setCurrentPage(1)}
              className="h-9 px-5 text-sm font-medium bg-primary-500 text-background-50 rounded-md hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              <div className="w-4 h-4 inline-flex items-center justify-center mr-1">
                <i className="ri-search-line" />
              </div>
              查询
            </button>
            <button
              onClick={handleReset}
              className="h-9 px-5 text-sm font-medium text-foreground-600 bg-background-100 rounded-md hover:bg-background-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              <div className="w-4 h-4 inline-flex items-center justify-center mr-1">
                <i className="ri-refresh-line" />
              </div>
              重置
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-background-50 rounded-lg" style={{ border: '1px solid #e8edf3' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#f8fafb' }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">序号</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">所属事业部</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">业主单位</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">合同号</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">合同名称</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">日期</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">打卡人</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-700 whitespace-nowrap">打卡时间</th>
                </tr>
              </thead>
              <tbody>
                {pagedRecords.map((r, idx) => (
                  <tr
                    key={r.id}
                    className="hover:bg-background-100 transition-colors"
                    style={{ borderBottom: '1px solid #f0f2f5' }}
                  >
                    <td className="px-4 py-2.5 text-foreground-700 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-2.5 text-foreground-800 whitespace-nowrap">{r.department}</td>
                    <td className="px-4 py-2.5 text-foreground-800 whitespace-nowrap">{r.ownerUnit}</td>
                    <td className="px-4 py-2.5 text-foreground-800 whitespace-nowrap font-mono text-xs">{r.contractNo}</td>
                    <td className="px-4 py-2.5 text-foreground-800 whitespace-nowrap">{r.contractName}</td>
                    <td className="px-4 py-2.5 text-foreground-800 whitespace-nowrap">{r.date}</td>
                    <td className="px-4 py-2.5 text-foreground-800 whitespace-nowrap">{r.personName}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-secondary-100 text-secondary-900">
                        {r.checkInTime}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary + Pagination */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #e8edf3' }}>
            <span className="text-xs text-foreground-500">
              共 {filteredRecords.length} 条记录
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded text-xs text-foreground-600 hover:bg-background-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <i className="ri-arrow-left-s-line" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium cursor-pointer transition-colors ${
                    p === currentPage
                      ? 'bg-primary-500 text-background-50'
                      : 'text-foreground-600 hover:bg-background-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded text-xs text-foreground-600 hover:bg-background-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <i className="ri-arrow-right-s-line" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}