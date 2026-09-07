import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/feature/Layout';
import { conditionConfigs, type AttachmentConfig } from '@/mocks/archiveConfigMocks';

// 模拟当前节点的通用配置
const mockGeneralConfigs: AttachmentConfig[] = [
  { id: 'p-ac-1', nodeId: '', docName: '验收申请表', type: '多选', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 5, archived: true, remark: '需经项目负责人签字确认后方可上传', templateFile: '验收申请表模板.docx', enabled: true },
  { id: 'p-ac-2', nodeId: '', docName: '施工质量检查记录', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', 'Word(doc/docx)', '图片(jpg/png/bmp)'], fileSize: 30, fileSizeUnit: 'MB', fileCount: 10, archived: true, remark: '', templateFile: '', enabled: true },
  { id: 'p-ac-3', nodeId: '', docName: '现场照片及影像资料', type: '多选', versionManaged: false, required: false, fileFormats: ['图片(jpg/png/bmp)', '视频(mp4/avi)', '压缩包(zip/rar/7z)'], fileSize: 100, fileSizeUnit: 'MB', fileCount: 20, archived: false, remark: '拍摄关键施工节点及隐蔽工程', templateFile: '', enabled: true },
  { id: 'p-ac-4', nodeId: '', docName: '材料合格证及检测报告', type: '多选', versionManaged: false, required: true, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 50, fileSizeUnit: 'MB', fileCount: 15, archived: true, remark: '包括钢材、水泥等主要材料的合格证', templateFile: '', enabled: true },
  { id: 'p-ac-5', nodeId: '', docName: '隐蔽工程验收记录', type: '技改', versionManaged: true, required: true, fileFormats: ['PDF', 'Word(doc/docx)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 3, archived: true, remark: '含地基验槽、钢筋隐蔽等', templateFile: '隐蔽工程验收记录模板.docx', enabled: true },
  { id: 'p-ac-6', nodeId: '', docName: '设备开箱检验记录', type: '多选', versionManaged: false, required: false, fileFormats: ['PDF', '图片(jpg/png/bmp)'], fileSize: 20, fileSizeUnit: 'MB', fileCount: 10, archived: false, remark: '', templateFile: '设备开箱检验记录表.xlsx', enabled: true },
];

// 模拟条件配置选项
const conditionOptions = [
  { label: '通用配置（默认）', value: 'general' },
  { label: '总承包合同-技改项目验收要求', value: 'cc-1' },
  { label: '设备采购合同-设备验收要求', value: 'cc-2' },
];

const nodePath = '项目合同管理 > 合同业务执行管理 > 合同举牌验收 > 验收管理 > 新增验收记录';

export default function ConfigPreviewPage() {
  const navigate = useNavigate();
  const [selectedCondition, setSelectedCondition] = useState('general');

  const currentConfigs = selectedCondition === 'general' ? mockGeneralConfigs
    : (conditionConfigs['n-1-5-1-2-1']?.find((cc) => cc.id === selectedCondition)?.attachments || mockGeneralConfigs);

  const enabledConfigs = currentConfigs.filter((ac) => ac.enabled);

  return (
    <Layout>
      <div className="bg-white rounded-lg border border-slate-200">
        {/* 顶部信息栏 */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">功能节点路径：</span>
              <span className="text-slate-700 font-medium">{nodePath}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/project-archive/config')}
            className="px-4 py-1.5 text-sm border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-left-line" />
            </div>
            返回配置页
          </button>
        </div>

        {/* 条件切换 */}
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-700 font-medium whitespace-nowrap">预览条件：</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-1.5 text-sm border border-amber-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              {conditionOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="text-xs text-amber-500 ml-2">（模拟业务人员视角，条件切换展示不同附件要求）</span>
          </div>
        </div>

        {/* 模拟业务操作界面 */}
        <div className="p-6 max-w-3xl">
          <h2 className="text-base font-semibold text-slate-800 mb-1">附件上传</h2>
          <p className="text-xs text-slate-400 mb-6">请根据要求上传以下附件</p>

          <div className="space-y-5">
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

                {/* 提示信息 */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs text-slate-400">
                    <i className="ri-file-line mr-1" />
                    支持{ac.fileFormats.slice(0, 4).join('、')}{ac.fileFormats.length > 4 ? '等' : ''}格式
                  </span>
                  <span className="text-xs text-slate-400">
                    <i className="ri-hard-drive-line mr-1" />
                    单文件不超过{ac.fileSize} {ac.fileSizeUnit}
                  </span>
                  <span className="text-xs text-slate-400">
                    <i className="ri-stack-line mr-1" />
                    最多上传{ac.fileCount}个文件
                  </span>
                </div>

                {/* 补充说明 */}
                {ac.remark && (
                  <p className="text-xs text-amber-600 mb-3 bg-amber-50 px-3 py-1.5 rounded">{ac.remark}</p>
                )}

                {/* 模板下载 */}
                {ac.templateFile && (
                  <p className="text-xs mb-3">
                    <span className="text-sky-600 cursor-pointer hover:underline flex items-center gap-1">
                      <i className="ri-download-line" />
                      下载模板（{ac.templateFile}）
                    </span>
                  </p>
                )}

                {/* 上传区域 */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-white">
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