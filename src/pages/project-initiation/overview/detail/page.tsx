import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  getOverviewRecordById,
  initiationOverviewRecords,
  overviewStatusMap,
} from '@/mocks/initiationOverviewMocks';
import DeclOperationLogModal from '@/pages/project-initiation/declaration/components/DeclOperationLogModal';
import LifecycleStepper from '../components/LifecycleStepper';
import JointReviewReadonlyTab from '../components/JointReviewReadonlyTab';
import OverviewPlaceholderTab from '../components/OverviewPlaceholderTab';
import ProjectDetailReadonly from '../components/ProjectDetailReadonly';

type DetailTab =
  | 'project'
  | 'joint'
  | 'contract'
  | 'member'
  | 'cost'
  | 'material'
  | 'archive';

const TABS: { key: DetailTab; label: string }[] = [
  { key: 'project', label: '项目详情' },
  { key: 'joint', label: '会审详情' },
  { key: 'contract', label: '合同与需求' },
  { key: 'member', label: '项目成员' },
  { key: 'cost', label: '费用信息' },
  { key: 'material', label: '物料信息' },
  { key: 'archive', label: '项目档案' },
];

export default function InitiationOverviewDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const record = useMemo(
    () => getOverviewRecordById(id) || initiationOverviewRecords[0],
    [id]
  );
  const [activeTab, setActiveTab] = useState<DetailTab>('project');
  const [logOpen, setLogOpen] = useState(false);

  if (!record) {
    return (
      <Layout>
        <div className="bg-white rounded-lg border border-steel-200 p-10 text-center">
          <p className="text-sm text-steel-500 mb-4">未找到对应项目</p>
          <button
            type="button"
            onClick={() => navigate('/project-initiation/overview')}
            className="px-4 py-2 text-sm border border-steel-200 rounded-md cursor-pointer hover:bg-slate-50"
          >
            返回列表
          </button>
        </div>
      </Layout>
    );
  }

  const statusMeta = overviewStatusMap[record.status];

  return (
    <Layout>
      <div className="space-y-4 pb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => navigate('/project-initiation/overview')}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-steel-200 text-steel-500 hover:bg-slate-50 cursor-pointer"
                title="返回"
              >
                <i className="ri-arrow-left-line" />
              </button>
              <h1 className="text-lg font-semibold text-steel-900 truncate">{record.projectName}</h1>
              <span className={`px-2 py-0.5 text-xs rounded ${statusMeta.cls}`}>{statusMeta.label}</span>
            </div>
            <p className="text-xs text-steel-400 mt-1 ml-10">
              立项号 {record.approvalNo}
              {record.annualPlanNo ? ` · 年度计划号 ${record.annualPlanNo}` : ''}
              {` · ${record.projectType}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLogOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-steel-600 border border-steel-200 rounded-md hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-history-line" />
            操作记录
          </button>
        </div>

        <LifecycleStepper current={record.lifecycleStage} />

        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
          <div className="flex items-center gap-1 px-3 pt-3 overflow-x-auto border-b border-steel-100">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm rounded-t-md border border-b-0 whitespace-nowrap cursor-pointer transition-colors ${
                    active
                      ? 'text-white border-sky-400'
                      : 'bg-white text-steel-600 border-steel-200 hover:bg-slate-50'
                  }`}
                  style={active ? { background: 'linear-gradient(135deg,#0ea5e9,#0284c7)' } : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="p-4 bg-slate-50/40">
            {activeTab === 'project' && (
              <ProjectDetailReadonly
                linkedPlanId={record.linkedPlanId}
                projectName={record.projectName}
                projectMajorType={record.projectMajorType}
              />
            )}
            {activeTab === 'joint' && <JointReviewReadonlyTab overviewId={record.id} />}
            {activeTab === 'contract' && <OverviewPlaceholderTab overviewId={record.id} tab="contract" />}
            {activeTab === 'member' && <OverviewPlaceholderTab overviewId={record.id} tab="member" />}
            {activeTab === 'cost' && <OverviewPlaceholderTab overviewId={record.id} tab="cost" />}
            {activeTab === 'material' && <OverviewPlaceholderTab overviewId={record.id} tab="material" />}
            {activeTab === 'archive' && <OverviewPlaceholderTab overviewId={record.id} tab="archive" />}
          </div>
        </div>
      </div>

      <DeclOperationLogModal
        open={logOpen}
        planId={record.id}
        planName={record.projectName}
        linkedPlanId={record.linkedPlanId}
        mode="overview"
        onClose={() => setLogOpen(false)}
      />
    </Layout>
  );
}
