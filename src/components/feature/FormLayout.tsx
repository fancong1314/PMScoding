import type { ReactNode, Ref } from 'react';

/**
 * 贵港 PMS 表单布局标准（与 .cursor/skills/frontend-pms-standards/SKILL.md 同步）
 *
 * - 标签列宽统一 130px，右对齐
 * - 短字段默认两列；长文本/名称/组织选择整行
 * - 禁止同行混用不同标签列宽，禁止为挤布局缩小标签字号
 */

export const FORM_LABEL_W = 130;

export const formLabelCls =
  'flex justify-end items-center text-sm text-steel-600 pt-2 whitespace-nowrap text-right leading-snug';

export const formLabelTopCls =
  'flex justify-end items-start text-sm text-steel-600 pt-2 whitespace-nowrap text-right leading-snug';

/** 单字段：标签 130px + 控件 */
export const formFieldCls = 'grid grid-cols-[130px_1fr] gap-3 items-start';

/** 两列短字段外层 */
export const formRow2Cls = 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4';

export const formRequiredStar = <span className="text-red-500 ml-0.5">*</span>;

export function formInputCls(err?: string, opts?: { readonly?: boolean }) {
  const base =
    'w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors';
  if (opts?.readonly) return `${base} border-steel-200 bg-slate-50 text-steel-500`;
  if (err) return `${base} border-red-300 bg-red-50/30`;
  return `${base} border-steel-200 bg-white`;
}

interface FormSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  sectionRef?: Ref<HTMLDivElement>;
  children: ReactNode;
  bodyClassName?: string;
}

/** 表单栏目卡片（标题栏 + 内容区） */
export function FormSection({
  id,
  title,
  subtitle,
  icon = 'ri-file-info-line',
  iconColor = 'text-emerald-500',
  sectionRef,
  children,
  bodyClassName = 'p-5 space-y-4',
}: FormSectionProps) {
  return (
    <div id={id} ref={sectionRef} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid #e8edf3', backgroundColor: '#fafbfd' }}
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <i className={`${icon} ${iconColor}`} />
        </div>
        <h3 className="text-sm font-semibold text-steel-800">{title}</h3>
        {subtitle && <span className="text-xs text-steel-400 ml-1">{subtitle}</span>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  /** 多行文本时标签顶对齐 */
  topAlign?: boolean;
  /** 占满两列（在 formRow2Cls 内使用） */
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

/** 编辑态字段：统一 130px 标签列 */
export function FormField({
  label,
  required,
  error,
  topAlign,
  fullWidth,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`${formFieldCls} ${fullWidth ? 'md:col-span-2' : ''} ${className}`.trim()}>
      <label className={topAlign ? formLabelTopCls : formLabelCls}>
        {label}
        {required ? formRequiredStar : null}
      </label>
      <div className="min-w-0">
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

interface FormViewItemProps {
  label: string;
  value?: ReactNode;
  /** 长文本 / 多行 */
  multiline?: boolean;
  fullWidth?: boolean;
}

/** 详情/只读态字段：与编辑态同一套 130px 标签列，避免 chip 左右两端对齐造成错位 */
export function FormViewItem({ label, value, multiline, fullWidth }: FormViewItemProps) {
  const display = value === undefined || value === null || value === '' ? '—' : value;
  return (
    <div className={`${formFieldCls} ${fullWidth ? 'md:col-span-2' : ''} py-1.5 px-3 rounded bg-white`.trim()}>
      <span className={multiline ? formLabelTopCls : formLabelCls}>{label}</span>
      <div
        className={`min-w-0 text-sm text-slate-800 ${
          multiline ? 'whitespace-pre-wrap leading-relaxed text-slate-700' : 'font-medium break-words'
        }`}
      >
        {display}
      </div>
    </div>
  );
}

/** 详情业务信息区块外壳 */
export function FormViewBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-primary-500" />
        {title}
      </h4>
      <div className={`${formRow2Cls} p-4 rounded-lg border border-slate-200 bg-slate-50/50`}>{children}</div>
    </div>
  );
}
