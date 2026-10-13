import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import {
  ARCHIVE_BIZ_CODES,
  formatRuleExpression,
  getNodePath,
  resolveAttachmentSchema,
} from '@/mocks/archiveConfigMocks';

const BIZ = ARCHIVE_BIZ_CODES.ACCEPTANCE_RECORD_CREATE;

const contextPresets = [
  {
    key: 'general',
    label: '通用配置（默认）',
    context: {
      contractType: '技术服务合同',
      projectType: '信息化项目',
      contractAmount: 80,
      projectMajorType: '技改',
    },
  },
  {
    key: 'epc',
    label: '总承包 + 技改（命中条件规则）',
    context: {
      contractType: '总承包合同',
      projectType: '技改项目',
      contractAmount: 1200,
      projectMajorType: '技改',
    },
  },
  {
    key: 'equip',
    label: '设备采购 + 基建（命中条件规则）',
    context: {
      contractType: '设备采购合同',
      projectType: '基建项目',
      contractAmount: 300,
      projectMajorType: '新建',
    },
  },
];

export default function ConfigPreviewPage() {
  const navigate = useNavigate();
  const [presetKey, setPresetKey] = useState('general');

  const preset = contextPresets.find((p) => p.key === presetKey) || contextPresets[0];
  const result = useMemo(
    () => resolveAttachmentSchema(BIZ, preset.context),
    [preset],
  );

  const nodePath = result.node ? getNodePath(result.node.id) : '（未找到挂载节点）';
  const enabledConfigs = result.attachments;

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">功能节点路径：</span>
              <span className="text-slate-700 font-medium">{nodePath}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">bizCode：{BIZ} · 解析引擎 resolveAttachmentSchema</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/project-archive/config')}
            className="px-4 py-1.5 text-sm border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <i className="ri-arrow-left-line" />
            返回配置页
          </button>
        </div>

        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-amber-700 font-medium whitespace-nowrap">模拟上下文：</span>
            <select
              value={presetKey}
              onChange={(e) => setPresetKey(e.target.value)}
              className="px-3 py-1.5 text-sm border border-amber-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              {contextPresets.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              result.source === 'condition' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              来源：{result.source === 'condition' ? '条件规则' : '通用配置'}
            </span>
            {result.matchedRule && (
              <span className="text-xs text-violet-700">
                命中：{result.matchedRule.conditionName}（优先级 {result.matchedRule.priority}）
              </span>
            )}
          </div>
          {result.matchedRule && (
            <p className="text-xs text-amber-700/80">
              规则：{formatRuleExpression(result.matchedRule.expression)}
            </p>
          )}
          <p className="text-xs text-amber-600">
            上下文：合同类型={String(preset.context.contractType)}，项目类型={String(preset.context.projectType)}，金额={String(preset.context.contractAmount)}万元
          </p>
        </div>

        <div className="p-6 max-w-3xl">
          <h2 className="text-base font-semibold text-slate-800 mb-1">附件上传</h2>
          <p className="text-xs text-slate-400 mb-6">依据项目档案配置 · 新增验收记录 · 解析结果预览</p>

          <div className="space-y-5">
            {enabledConfigs.length === 0 && (
              <p className="text-sm text-slate-400 py-8 text-center">当前上下文下无启用附件配置</p>
            )}
            {enabledConfigs.map((ac) => (
              <div key={ac.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {ac.docName}
                    {ac.required && <span className="text-red-500 ml-0.5">*</span>}
                  </span>
                  {ac.versionManaged && (
                    <span className="px-1.5 py-0.5 text-xs rounded bg-sky-50 text-sky-600">支持版本管理</span>
                  )}
                  {ac.archived && (
                    <span className="px-1.5 py-0.5 text-xs rounded bg-emerald-50 text-emerald-600">归档</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs text-slate-400">
                    支持{ac.fileFormats.slice(0, 4).join('、')}{ac.fileFormats.length > 4 ? '等' : ''}格式
                  </span>
                  <span className="text-xs text-slate-400">单文件不超过{ac.fileSize} {ac.fileSizeUnit}</span>
                  <span className="text-xs text-slate-400">最多上传{ac.fileCount}个文件</span>
                </div>
                {ac.remark && (
                  <p className="text-xs text-amber-600 mb-3 bg-amber-50 px-3 py-1.5 rounded">{ac.remark}</p>
                )}
                {ac.templateFile && (
                  <p className="text-xs mb-3 text-sky-600">下载模板（{ac.templateFile}）</p>
                )}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-white">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center">
                    <i className="ri-upload-cloud-2-line text-slate-400 text-lg" />
                  </div>
                  <p className="text-sm text-slate-500">点击或拖拽文件到此区域上传</p>
                  <p className="text-xs text-slate-400 mt-1">预览模式，不支持实际上传</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
