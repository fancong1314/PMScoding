import { useMemo, useState } from 'react';
import {
  projectPlans,
  withPaymentPlans,
  withInitiationDetailFields,
  withInvestmentEstimateFields,
  normalizeReviewStatus,
  type ProjectPlan,
  type ProjectMajorType,
} from '@/mocks/projectPlans';
import BasicInfoSection from '@/pages/project-initiation/declaration/form/components/BasicInfoSection';
import DetailInfoSection from '@/pages/project-initiation/declaration/form/components/DetailInfoSection';
import AuxFacilitySection from '@/pages/project-initiation/declaration/form/components/AuxFacilitySection';
import ProjectTargetSection from '@/pages/project-initiation/declaration/form/components/ProjectTargetSection';
import ResearchPersonSection from '@/pages/project-initiation/declaration/form/components/ResearchPersonSection';
import RiskAssessSection from '@/pages/project-initiation/declaration/form/components/RiskAssessSection';
import CostEstimateSection from '@/pages/project-initiation/declaration/form/components/CostEstimateSection';
import OverhaulFormSection from '@/pages/project-initiation/declaration/form/components/OverhaulFormSection';
import OverhaulContentSection from '@/pages/project-initiation/declaration/form/components/OverhaulContentSection';
import MinorFormSection from '@/pages/project-initiation/declaration/form/components/MinorFormSection';
import MinorContentSection from '@/pages/project-initiation/declaration/form/components/MinorContentSection';
import AttachmentUploadSection, {
  type AttachmentUploadMap,
} from '@/pages/project-initiation/declaration/form/components/AttachmentUploadSection';
import { getInitiationDeclarationAttachmentConfigs } from '@/mocks/archiveConfigMocks';

const STORAGE_KEY = 'ng_init_decl_plans_v11';

function normalizePlan(p: ProjectPlan): ProjectPlan {
  return withInvestmentEstimateFields(withPaymentPlans(withInitiationDetailFields({
    ...p,
    projectMajorType: p.projectMajorType || '技改',
    reviewStatus: normalizeReviewStatus(p.reviewStatus as string),
  })));
}

function findPlan(planId: string, fallbackMajor: string, fallbackName: string): ProjectPlan {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    const list: ProjectPlan[] = s ? JSON.parse(s) : projectPlans;
    const found = list.map(normalizePlan).find((p) => p.id === planId);
    if (found) return found;
  } catch { /* noop */ }
  const fromSeed = projectPlans.map(normalizePlan).find((p) => p.id === planId);
  if (fromSeed) return fromSeed;

  // 兜底：用总览基础信息拼只读壳，保证详情页可展示
  return normalizePlan({
    id: planId,
    planName: fallbackName,
    planYear: String(new Date().getFullYear()),
    projectMajorType: (fallbackMajor as ProjectMajorType) || '技改',
    businessDivision: '',
    projectCategory: '',
    budgetAmount: 0,
    benefit: 0,
    year1Payment: 0,
    year2Payment: 0,
    year3Payment: 0,
    paymentPlans: [],
    projectManager: '',
    projectManagerPhone: '',
    currentReviewer: '',
    latestStage: '已立项',
    reviewStatus: 'transferred',
    applicant: '',
    startDate: '',
    endDate: '',
    createdAt: '',
    supplementNote: '',
    currentSituation: '',
    necessity: '',
    innovation: '',
    processDesc: '',
    overallIdea: '',
    isInPlanProject: '否',
  } as ProjectPlan);
}

function buildDemoAttachments(majorType: string): AttachmentUploadMap {
  const configs = getInitiationDeclarationAttachmentConfigs(majorType);
  const map: AttachmentUploadMap = {};
  configs.forEach((cfg, i) => {
    if (i % 3 === 2) {
      map[cfg.id] = [];
      return;
    }
    map[cfg.id] = [
      {
        id: `demo_${cfg.id}_1`,
        name: `${cfg.docName}-正式版.pdf`,
        size: 320_000 + i * 12_000,
      },
    ];
  });
  return map;
}

interface Props {
  linkedPlanId: string;
  projectName: string;
  projectMajorType: string;
}

const noop = () => undefined;

export default function ProjectDetailReadonly({
  linkedPlanId,
  projectName,
  projectMajorType,
}: Props) {
  const form = useMemo(
    () => findPlan(linkedPlanId, projectMajorType, projectName),
    [linkedPlanId, projectMajorType, projectName]
  );
  const majorType = (form.projectMajorType || projectMajorType || '技改') as ProjectMajorType;
  const overhaulMode = majorType === '营缮';
  const minorMode = majorType === '零固';
  const [attachments] = useState<AttachmentUploadMap>(() => buildDemoAttachments(majorType));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-100 text-steel-600 border border-steel-200">
          <i className="ri-eye-line" />
          只读查看 · 与立项申请详情字段一致
        </span>
        <span className="text-xs text-steel-400">项目大类：{majorType}</span>
      </div>

      <div className="space-y-4">
        {overhaulMode ? (
          <>
            <div className="pointer-events-none">
              <OverhaulFormSection
                data={form}
                errors={{}}
                onChange={noop}
                onPatch={noop}
                sectionRef={noop}
              />
            </div>
            <OverhaulContentSection
              rows={form.overhaulContentRows}
              onChange={noop}
              sectionRef={noop}
              readonly
            />
            <ResearchPersonSection
              rows={form.researchPersons}
              onChange={noop}
              sectionRef={noop}
              readonly
            />
          </>
        ) : minorMode ? (
          <>
            <div className="pointer-events-none">
              <MinorFormSection
                data={form}
                errors={{}}
                onChange={noop}
                onPatch={noop}
                sectionRef={noop}
              />
            </div>
            <MinorContentSection
              rows={form.minorContentRows}
              onChange={noop}
              sectionRef={noop}
              readonly
            />
            <ResearchPersonSection
              rows={form.researchPersons}
              onChange={noop}
              sectionRef={noop}
              readonly
            />
          </>
        ) : (
          <>
            <div className="pointer-events-none space-y-4">
              <BasicInfoSection
                data={form}
                errors={{}}
                onChange={noop}
                onPatch={noop}
                sectionRef={noop}
              />
              <DetailInfoSection data={form} onChange={noop} sectionRef={noop} />
              <AuxFacilitySection data={form} onChange={noop} sectionRef={noop} />
              <ProjectTargetSection data={form} onChange={noop} sectionRef={noop} />
            </div>
            <ResearchPersonSection
              rows={form.researchPersons}
              onChange={noop}
              sectionRef={noop}
              readonly
            />
          </>
        )}

        <CostEstimateSection
          data={form}
          errors={{}}
          onPatch={noop}
          sectionRef={noop}
          readonly
        />

        {!overhaulMode && !minorMode && (
          <RiskAssessSection
            rows={form.riskAssessRows}
            onChange={noop}
            sectionRef={noop}
            readonly
          />
        )}

        <AttachmentUploadSection
          majorType={majorType}
          uploads={attachments}
          onChange={noop}
          errors={{}}
          sectionRef={noop}
          readonly
        />
      </div>
    </div>
  );
}
