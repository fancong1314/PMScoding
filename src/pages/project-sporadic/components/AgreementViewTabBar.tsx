export type AgreementViewTabKey = 'agreement' | 'plan' | 'budget';

const TABS: { key: AgreementViewTabKey; label: string; icon: string }[] = [
  { key: 'agreement', label: '协议单详情', icon: 'ri-file-list-3-line' },
  { key: 'plan', label: '方案详情', icon: 'ri-file-upload-line' },
  { key: 'budget', label: '预算详情', icon: 'ri-funds-box-line' },
];

interface Props {
  active: AgreementViewTabKey;
  onChange: (key: AgreementViewTabKey) => void;
}

/** 查看零星协议单 · 顶部横向 TAB */
export default function AgreementViewTabBar({ active, onChange }: Props) {
  return (
    <div className="bg-white rounded-lg border border-steel-200 px-1 py-1 inline-flex flex-wrap gap-0.5 mb-4">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-1.5 px-5 py-2 text-sm rounded-full transition-colors cursor-pointer whitespace-nowrap ${
              isActive ? 'text-white font-medium' : 'text-steel-500 hover:text-steel-700'
            }`}
            style={isActive ? {
              background: tab.key === 'agreement'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : tab.key === 'plan'
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
            } : undefined}
          >
            <i className={tab.icon} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
