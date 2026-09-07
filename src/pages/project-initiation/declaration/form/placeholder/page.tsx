import Layout from '@/components/feature/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ProjectMajorType } from '@/mocks/projectPlans';

const PATH_LABEL: Record<string, ProjectMajorType> = {
  '/project-initiation/declaration/form/overhaul': '大修',
  '/project-initiation/declaration/form/minor': '零固',
};

/** 大修 / 零固表单占位页（字段后续补充） */
export default function DeclarationFormPlaceholderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const label = PATH_LABEL[location.pathname] || '该类型';

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-16">
        <div className="bg-white rounded-lg border border-steel-200 px-8 py-10 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-amber-50">
            <i className="ri-file-list-3-line text-2xl text-amber-500" />
          </div>
          <h1 className="text-lg font-semibold text-steel-900 mb-2">
            {label}类项目立项申请表单
          </h1>
          <p className="text-sm text-steel-500 mb-6 leading-relaxed">
            「{label}」类项目的新增/编辑表单字段尚在整理中，当前暂不可填写。
            <br />
            请先使用「新建」或「技改」TAB 进行演示申报。
          </p>
          <button
            onClick={() => navigate('/project-initiation/declaration')}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-md hover:opacity-90 cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <i className="ri-arrow-left-line" />
            返回列表
          </button>
        </div>
      </div>
    </Layout>
  );
}
