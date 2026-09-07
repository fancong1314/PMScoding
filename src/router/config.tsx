import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import InvestmentReportPage from "../pages/project-dashboard/investment-report/page";
import ArgumentEvalDashboardPage from "../pages/project-dashboard/argument-evaluation/page";
import PanoramaCockpitPage from "../pages/project-dashboard/panorama-cockpit/page";
import ProjectDetailPage from "../pages/project-dashboard/project-detail/page";
import ApprovalProcessPage from "../pages/project-plan/approval-process/page";
import ZhongteStageReviewPage from "../pages/project-plan/plan-review/zhongte-stage/page";
import LeaderReviewPage from "../pages/project-plan/leader-review/page";
import PlanArchivePage from "../pages/project-plan/plan-archive/page";
import PlanPaymentReportPage from "../pages/project-plan/payment-report/page";
import ProjectPlanDeclaration from "../pages/project-plan/declaration/page";
import PlanFormPage from "../pages/project-plan/declaration/form/page";
import ProjectApplyPage from "../pages/project-plan/apply/page";
import ApplyFormPage from "../pages/project-plan/apply/form/page";
import ApplyPresentFormPage from "../pages/project-plan/apply/present-form/page";
import ProjectReviewPage from "../pages/project-plan/review/page";
import ReviewFormPage from "../pages/project-plan/review/form/page";
import ProjectIssuancePage from "../pages/project-plan/issuance/page";
import IssuanceFormPage from "../pages/project-plan/issuance/form/page";
import ProjectDeferralPage from "../pages/project-plan/deferral/page";
import DeferralFormPage from "../pages/project-plan/deferral/form/page";
import PlanDeferralPage from "../pages/project-plan/plan-deferral/page";
import PlanDeferralFormPage from "../pages/project-plan/plan-deferral/form/page";
import ProjectNumberPage from "../pages/project-plan/project-number/page";
import ProjectNumberFormPage from "../pages/project-plan/project-number/form/page";
import ProjectNumberChangeFormPage from "../pages/project-plan/project-number/change-form/page";
import ArgumentApplyPage from "../pages/project-argument/apply/page";
import ArgumentApplyFormPage from "../pages/project-argument/apply/form/page";
import OpinionSignPage from "../pages/project-argument/opinion-sign/page";
import OpinionSignFormPage from "../pages/project-argument/opinion-sign/form/page";
import InitDeclarationPage from "../pages/project-initiation/declaration/page";
import InitDeclarationFormPage from "../pages/project-initiation/declaration/form/page";
import InitZhongteStageReviewPage from "../pages/project-initiation/plan-review/zhongte-stage/page";
import InitLeaderReviewPage from "../pages/project-initiation/leader-review/page";
import InitPlanDeferralPage from "../pages/project-initiation/plan-deferral/page";
import InitPlanDeferralFormPage from "../pages/project-initiation/plan-deferral/form/page";
import ContractListPage from "../pages/project-execute/quality-safety/contract-list/page";
import IssueListPage from "../pages/project-execute/quality-safety/issue-list/page";
import ParticipantListPage from "../pages/participant/negative-score/participant-list/page";
import DeductionListPage from "../pages/participant/negative-score/deduction-list/page";
import AttendancePage from "../pages/participant/attendance/page";
import VideoSurveillancePage from "../pages/participant/video-surveillance/page";
import DangerousWorkListPage from "../pages/project-execute/dangerous-work/list/page";
import ProjectPrepareListPage from "../pages/project-prepare/project-management/list/page";
import MemberListPage from "../pages/project-prepare/project-management/members/page";
import PreliminaryProjectListPage from "../pages/project-prepare/preliminary-material/list/page";
import MaterialListPage from "../pages/project-prepare/preliminary-material/materials/page";
import PreliminaryDesignListPage from "../pages/project-prepare/preliminary-design/list/page";
import EstimateReviewPage from "../pages/project-prepare/preliminary-design/estimate-review/page";
import EstimateListPage from "../pages/project-prepare/estimate-management/list/page";
import EstimateDetailPage from "../pages/project-prepare/estimate-management/detail/page";
import EstimateApplyPage from "../pages/project-prepare/estimate-management/apply/page";
import ContractProgressListPage from "../pages/project-contract/progress/list/page";
import ReportListPage from "../pages/project-contract/progress/reports/page";
import ReportDetailPage from "../pages/project-contract/progress/report-detail/page";
import WBSPage from "../pages/project-contract/progress/wbs/page";
import RequirementListPage from "../pages/project-contract/requirement/list/page";
import DemandListPage from "../pages/project-contract/requirement/demand-list/page";
import DemandFormPage from "../pages/project-contract/requirement/form/page";
import DemandDetailPage from "../pages/project-contract/requirement/detail/page";
import GanttPage from "../pages/project-contract/progress/gantt/page";
import UndertakeListPage from "../pages/project-contract/undertake/list/page";
import UndertakeDemandListPage from "../pages/project-contract/undertake/demand-list/page";
import UndertakeFormPage from "../pages/project-contract/undertake/form/page";
import UndertakeDetailPage from "../pages/project-contract/undertake/detail/page";
import BidReviewListPage from "../pages/project-contract/bid-review/list/page";
import BidReviewDemandListPage from "../pages/project-contract/bid-review/demand-list/page";
import BidReviewFormPage from "../pages/project-contract/bid-review/form/page";
import BidReviewDetailPage from "../pages/project-contract/bid-review/detail/page";
import ContractExecutionListPage from "../pages/project-contract/execution/list/page";
import ContractExecutionCommencementPage from "../pages/project-contract/execution/commencement/page";
import ContractExecutionApprovePage from "../pages/project-contract/execution/approve/page";
import ContractExecutionDetailPage from "../pages/project-contract/execution/detail/page";
import HandoverApprovePage from "../pages/project-contract/execution/handover-approve/page";
import HandoverDetailPage from "../pages/project-contract/execution/handover-detail/page";
import StopResumeFormPage from "../pages/project-contract/execution/stop-resume-form/page";
import StopResumeDetailPage from "../pages/project-contract/execution/stop-resume-detail/page";
import CompletionProjectReviewPage from "../pages/project-contract/execution/completion-project-review/page";
import CompletionManufacturingReviewPage from "../pages/project-contract/execution/completion-manufacturing-review/page";
import CompletionDetailPage from "../pages/project-contract/execution/completion-detail/page";
import ProjectApprovalListPage from "../pages/project-prepare/approval/list/page";
import ProjectApprovalStagePage from "../pages/project-prepare/approval/stage/page";
import ContractDocumentListPage from "../pages/project-contract/document/list/page";
import ContractDocumentFormPage from "../pages/project-contract/document/form/page";
import ContractDocumentAmountChangePage from "../pages/project-contract/document/amount-change/page";
import ContractDocumentMaterialChangePage from "../pages/project-contract/document/material-change/page";
import SignboardContractListPage from "../pages/project-contract/signboard/list/page";
import SignboardManagementPage from "../pages/project-contract/signboard/management/page";
import SignboardDetailPage from "../pages/project-contract/signboard/detail/page";
import OverdueContractListPage from "../pages/project-contract/deferral/list/page";
import OverdueApplicationListPage from "../pages/project-contract/deferral/application-list/page";
import OverdueProjectFormPage from "../pages/project-contract/deferral/project-form/page";
import OverdueDepartmentReviewPage from "../pages/project-contract/deferral/department-review/page";
import OverdueDetailPage from "../pages/project-contract/deferral/detail/page";
import SubcontractListPage from "../pages/project-contract/subcontract/list/page";
import SubcontractReviewPage from "../pages/project-contract/subcontract/review/page";
import SubcontractDetailPage from "../pages/project-contract/subcontract/detail/page";
import EpcEquipmentListPage from "../pages/project-contract/epc-equipment/list/page";
import EpcEquipmentReviewPage from "../pages/project-contract/epc-equipment/review/page";
import EpcEquipmentDetailPage from "../pages/project-contract/epc-equipment/detail/page";
import ChangePricingProjectListPage from "../pages/project-contract/change-pricing/list/page";
import ChangePricingDemandListPage from "../pages/project-contract/change-pricing/demand-list/page";
import ChangePricingDemandFormPage from "../pages/project-contract/change-pricing/demand-form/page";
import ChangePricingDemandDetailPage from "../pages/project-contract/change-pricing/demand-detail/page";
import ChangePricingSubmitPage from "../pages/project-contract/change-pricing/submit/page";
import ExamExemptionContractListPage from "../pages/project-contract/exam-exemption/list/page";
import ExamExemptionListPage from "../pages/project-contract/exam-exemption/exemption-list/page";
import ExamExemptionProjectFormPage from "../pages/project-contract/exam-exemption/project-form/page";
import ExamExemptionDepartmentConfirmPage from "../pages/project-contract/exam-exemption/department-confirm/page";
import ExamExemptionDetailPage from "../pages/project-contract/exam-exemption/detail/page";
import QualityDisputeListPage from "../pages/project-contract/quality-dispute/list/page";
import QualityDisputeFormPage from "../pages/project-contract/quality-dispute/form/page";
import QualityDisputeProjectReviewPage from "../pages/project-contract/quality-dispute/project-review/page";
import QualityDisputeManufacturingReviewPage from "../pages/project-contract/quality-dispute/manufacturing-review/page";
import QualityDisputeDetailPage from "../pages/project-contract/quality-dispute/detail/page";
import PaymentDeclarationListPage from "../pages/project-contract/payment-declaration/list/page";
import PaymentDeclarationAppListPage from "../pages/project-contract/payment-declaration/declaration-list/page";
import PaymentProjectReviewPage from "../pages/project-contract/payment-declaration/project-review/page";
import PaymentSupervisoryReviewPage from "../pages/project-contract/payment-declaration/supervisory-review/page";
import PaymentFinanceReviewPage from "../pages/project-contract/payment-declaration/finance-review/page";
import PaymentDeclarationDetailPage from "../pages/project-contract/payment-declaration/detail/page";
import PaymentReimbursementContractListPage from "../pages/project-contract/payment-reimbursement/list/page";
import PaymentReimbursementAppListPage from "../pages/project-contract/payment-reimbursement/reimbursement-list/page";
import PaymentReimbursementPrepaymentFormPage from "../pages/project-contract/payment-reimbursement/prepayment-form/page";
import PaymentReimbursementWarrantyFormPage from "../pages/project-contract/payment-reimbursement/warranty-form/page";
import PaymentReimbursementSettlementFormPage from "../pages/project-contract/payment-reimbursement/settlement-form/page";
import EarlyEvaluationListPage from "../pages/project-close/early-evaluation/page";
import PostEvalListPage from "../pages/project-close/post-evaluation/page";
import PostEvalCatalogPage from "../pages/project-close/post-evaluation/catalog/page";
import PostEvalSelfPage from "../pages/project-close/post-evaluation/self-eval/page";
import PostEvalProfPage from "../pages/project-close/post-evaluation/prof-eval/page";
import PostEvalCompPage from "../pages/project-close/post-evaluation/comp-eval/page";
import ArchiveConfigPage from "../pages/project-archive/config/page";
import ArchiveConfigPreviewPage from "../pages/project-archive/config/preview/page";
import ArchiveManagementListPage from "../pages/project-archive/management/list/page";
import ArchiveManagementDetailPage from "../pages/project-archive/management/detail/page";
import WBSDecompositionPage from "../pages/project-prepare/preliminary-design/wbs-decomposition/page";
import WBSEditPage from "../pages/project-prepare/preliminary-design/wbs-edit/page";
import ProjectProgressListPage from "../pages/project-execute/progress/list/page";
import WeeklyMonthlyPage from "../pages/project-execute/progress/weekly-monthly/page";
import ReportDetailPage2 from "../pages/project-execute/progress/weekly-monthly/detail/page";
import ProgressReportPage from "../pages/project-execute/progress/report/page";
import ProjectGanttPage from "../pages/project-execute/progress/gantt/page";
import ArchiveManagementPreviewPage from "../pages/project-archive/management/preview/page";
import ItLaunchListPage from "../pages/project-execute/it-launch/page";
import ItLaunchFormPage from "../pages/project-execute/it-launch/form/page";
import MonitorConfigListPage from "../pages/system-config/monitor-config/page";
import MonitorDeviceConfigPage from "../pages/system-config/monitor-config/config/page";
import CompletionProjectListPage from "../pages/project-execute/completion/project-list/page";
import TechRenovationListPage from "../pages/project-execute/completion/tech-renovation/page";
import CompletionApplicationListPage from "../pages/project-execute/completion/application-list/page";
import CompletionApplicationFormPage from "../pages/project-execute/completion/application-form/page";
import ItAcceptanceListPage from "../pages/project-execute/it-acceptance/list/page";
import ItAcceptanceFormPage from "../pages/project-execute/it-acceptance/form/page";
import ResearchConfirmListPage from "../pages/project-execute/it-acceptance/research-confirm/page";
import ItAcceptanceConfirmPage from "../pages/project-execute/it-acceptance/confirm-form/page";
import ChangeDetailPage from "../pages/project-prepare/preliminary-design/estimate-review/change-detail/page";
import ConstructionMemberListPage from "../pages/participant/construction-member/list/page";
import ConstructionMemberDetailPage from "../pages/participant/construction-member/detail/page";
const routes: RouteObject[] = [
  {
    path: "/",
    element: <ProjectApplyPage />,
  },
  {
    path: "/project-plan/approval-process",
    element: <ApprovalProcessPage />,
  },
  {
    path: "/project-plan/declaration",
    element: <ProjectPlanDeclaration />,
  },
  {
    path: "/project-plan/declaration/form",
    element: <PlanFormPage />,
  },
  {
    path: "/project-plan/declaration/form/new",
    element: <PlanFormPage />,
  },
  {
    path: "/project-plan/declaration/form/tech",
    element: <PlanFormPage />,
  },
  {
    path: "/project-plan/declaration/form/overhaul",
    element: <PlanFormPage />,
  },
  {
    path: "/project-plan/declaration/form/minor",
    element: <PlanFormPage />,
  },
  {
    path: "/project-plan/apply",
    element: <ProjectApplyPage />,
  },
  {
    path: "/project-plan/apply/form",
    element: <ApplyFormPage />,
  },
  {
    path: "/project-plan/apply/present-form",
    element: <ApplyPresentFormPage />,
  },
  {
    path: "/project-plan/review",
    element: <ProjectReviewPage />,
  },
  {
    path: "/project-plan/review/form",
    element: <ReviewFormPage />,
  },
  {
    path: "/project-plan/issuance",
    element: <ProjectIssuancePage />,
  },
  {
    path: "/project-plan/issuance/form",
    element: <IssuanceFormPage />,
  },
  {
    path: "/project-plan/deferral",
    element: <ProjectDeferralPage />,
  },
  {
    path: "/project-plan/deferral/form",
    element: <DeferralFormPage />,
  },
  {
    path: "/project-plan/plan-deferral",
    element: <PlanDeferralPage />,
  },
  {
    path: "/project-plan/plan-deferral/form",
    element: <PlanDeferralFormPage />,
  },
  {
    path: "/project-plan/plan-review/zhongte-stage",
    element: <ZhongteStageReviewPage />,
  },
  {
    path: "/project-plan/leader-review",
    element: <LeaderReviewPage />,
  },
  {
    path: "/project-plan/plan-archive",
    element: <PlanArchivePage />,
  },
  {
    path: "/project-plan/payment-report",
    element: <PlanPaymentReportPage />,
  },
  {
    path: "/project-dashboard/panorama-cockpit",
    element: <PanoramaCockpitPage />,
  },
  {
    path: "/project-dashboard/investment-report",
    element: <InvestmentReportPage />,
  },
  {
    path: "/project-dashboard/argument-evaluation",
    element: <ArgumentEvalDashboardPage />,
  },
  {
    path: "/project-dashboard/project-detail",
    element: <ProjectDetailPage />,
  },
  {
    path: "/project-plan/project-number",
    element: <ProjectNumberPage />,
  },
  {
    path: "/project-plan/project-number/form",
    element: <ProjectNumberFormPage />,
  },
  {
    path: "/project-plan/project-number/change-form",
    element: <ProjectNumberChangeFormPage />,
  },
  {
    path: "/project-argument/apply",
    element: <ArgumentApplyPage />,
  },
  {
    path: "/project-argument/apply/form",
    element: <ArgumentApplyFormPage />,
  },
  {
    path: "/project-argument/opinion-sign",
    element: <OpinionSignPage />,
  },
  {
    path: "/project-argument/opinion-sign/form",
    element: <OpinionSignFormPage />,
  },
  {
    path: "/project-initiation/declaration",
    element: <InitDeclarationPage />,
  },
  {
    path: "/project-initiation/declaration/form",
    element: <InitDeclarationFormPage />,
  },
  {
    path: "/project-initiation/declaration/form/new",
    element: <InitDeclarationFormPage />,
  },
  {
    path: "/project-initiation/declaration/form/tech",
    element: <InitDeclarationFormPage />,
  },
  {
    path: "/project-initiation/declaration/form/overhaul",
    element: <InitDeclarationFormPage />,
  },
  {
    path: "/project-initiation/declaration/form/minor",
    element: <InitDeclarationFormPage />,
  },
  {
    path: "/project-initiation/plan-review/zhongte-stage",
    element: <InitZhongteStageReviewPage />,
  },
  {
    path: "/project-initiation/leader-review",
    element: <InitLeaderReviewPage />,
  },
  {
    path: "/project-initiation/plan-deferral",
    element: <InitPlanDeferralPage />,
  },
  {
    path: "/project-initiation/plan-deferral/form",
    element: <InitPlanDeferralFormPage />,
  },
  {
    path: "/project-execute/quality-safety",
    element: <ContractListPage />,
  },
  {
    path: "/project-execute/quality-safety/issues",
    element: <IssueListPage />,
  },
  {
    path: "/participant/negative-score",
    element: <ParticipantListPage />,
  },
  {
    path: "/participant/negative-score/deduction-list",
    element: <DeductionListPage />,
  },
  {
    path: "/participant/attendance",
    element: <AttendancePage />,
  },
  {
    path: "/participant/video-surveillance",
    element: <VideoSurveillancePage />,
  },
  {
    path: "/project-execute/dangerous-work",
    element: <DangerousWorkListPage />,
  },
  {
    path: "/project-prepare/project-management",
    element: <ProjectPrepareListPage />,
  },
  {
    path: "/project-prepare/project-management/members",
    element: <MemberListPage />,
  },
  {
    path: "/project-prepare/preliminary-material",
    element: <PreliminaryProjectListPage />,
  },
  {
    path: "/project-prepare/preliminary-material/materials",
    element: <MaterialListPage />,
  },
  {
    path: "/project-prepare/preliminary-design",
    element: <PreliminaryDesignListPage />,
  },
  {
    path: "/project-prepare/preliminary-design/estimate-review",
    element: <EstimateReviewPage />,
  },
  {
    path: "/project-prepare/estimate-management",
    element: <EstimateListPage />,
  },
  {
    path: "/project-prepare/estimate-management/detail",
    element: <EstimateDetailPage />,
  },
  {
    path: "/project-prepare/estimate-management/apply",
    element: <EstimateApplyPage />,
  },
  {
    path: "/project-contract/progress",
    element: <ContractProgressListPage />,
  },
  {
    path: "/project-contract/undertake",
    element: <UndertakeListPage />,
  },
  {
    path: "/project-contract/undertake/demand-list",
    element: <UndertakeDemandListPage />,
  },
  {
    path: "/project-contract/undertake/form",
    element: <UndertakeFormPage />,
  },
  {
    path: "/project-contract/undertake/detail",
    element: <UndertakeDetailPage />,
  },
  {
    path: "/project-contract/requirement",
    element: <RequirementListPage />,
  },
  {
    path: "/project-contract/requirement/demand-list",
    element: <DemandListPage />,
  },
  {
    path: "/project-contract/requirement/form",
    element: <DemandFormPage />,
  },
  {
    path: "/project-contract/requirement/detail",
    element: <DemandDetailPage />,
  },
  {
    path: "/project-contract/progress/reports",
    element: <ReportListPage />,
  },
  {
    path: "/project-contract/progress/report-detail",
    element: <ReportDetailPage />,
  },
  {
    path: "/project-contract/progress/wbs",
    element: <WBSPage />,
  },
  {
    path: "/project-contract/progress/gantt",
    element: <GanttPage />,
  },
  {
    path: "/project-contract/bid-review",
    element: <BidReviewListPage />,
  },
  {
    path: "/project-contract/bid-review/demand-list",
    element: <BidReviewDemandListPage />,
  },
  {
    path: "/project-contract/bid-review/form",
    element: <BidReviewFormPage />,
  },
  {
    path: "/project-contract/bid-review/detail",
    element: <BidReviewDetailPage />,
  },
  {
    path: "/project-contract/execution",
    element: <ContractExecutionListPage />,
  },
  {
    path: "/project-contract/execution/list",
    element: <ContractExecutionCommencementPage />,
  },
  {
    path: "/project-contract/execution/approve",
    element: <ContractExecutionApprovePage />,
  },
  {
    path: "/project-contract/execution/detail",
    element: <ContractExecutionDetailPage />,
  },
  {
    path: "/project-contract/execution/handover-approve",
    element: <HandoverApprovePage />,
  },
  {
    path: "/project-contract/execution/handover-detail",
    element: <HandoverDetailPage />,
  },
  {
    path: "/project-contract/execution/stop-resume-form",
    element: <StopResumeFormPage />,
  },
  {
    path: "/project-contract/execution/stop-resume-detail",
    element: <StopResumeDetailPage />,
  },
  {
    path: "/project-contract/execution/completion-project-review",
    element: <CompletionProjectReviewPage />,
  },
  {
    path: "/project-contract/execution/completion-manufacturing-review",
    element: <CompletionManufacturingReviewPage />,
  },
  {
    path: "/project-contract/execution/completion-detail",
    element: <CompletionDetailPage />,
  },
  {
    path: "/project-prepare/approval",
    element: <ProjectApprovalListPage />,
  },
  {
    path: "/project-prepare/approval/stage",
    element: <ProjectApprovalStagePage />,
  },
  {
    path: "/project-contract/document",
    element: <ContractDocumentListPage />,
  },
  {
    path: "/project-contract/document/form",
    element: <ContractDocumentFormPage />,
  },
  {
    path: "/project-contract/document/amount-change",
    element: <ContractDocumentAmountChangePage />,
  },
  {
    path: "/project-contract/document/material-change",
    element: <ContractDocumentMaterialChangePage />,
  },
  {
    path: "/project-contract/signboard",
    element: <SignboardContractListPage />,
  },
  {
    path: "/project-contract/signboard/management",
    element: <SignboardManagementPage />,
  },
  {
    path: "/project-contract/signboard/detail",
    element: <SignboardDetailPage />,
  },
  {
    path: "/project-contract/deferral",
    element: <OverdueContractListPage />,
  },
  {
    path: "/project-contract/deferral/application-list",
    element: <OverdueApplicationListPage />,
  },
  {
    path: "/project-contract/deferral/project-form",
    element: <OverdueProjectFormPage />,
  },
  {
    path: "/project-contract/deferral/department-review",
    element: <OverdueDepartmentReviewPage />,
  },
  {
    path: "/project-contract/deferral/detail",
    element: <OverdueDetailPage />,
  },
  {
    path: "/project-contract/subcontract",
    element: <SubcontractListPage />,
  },
  {
    path: "/project-contract/subcontract/review",
    element: <SubcontractReviewPage />,
  },
  {
    path: "/project-contract/subcontract/detail",
    element: <SubcontractDetailPage />,
  },
  {
    path: "/project-contract/epc-equipment",
    element: <EpcEquipmentListPage />,
  },
  {
    path: "/project-contract/epc-equipment/review",
    element: <EpcEquipmentReviewPage />,
  },
  {
    path: "/project-contract/epc-equipment/detail",
    element: <EpcEquipmentDetailPage />,
  },
  {
    path: "/project-contract/change-pricing",
    element: <ChangePricingProjectListPage />,
  },
  {
    path: "/project-contract/change-pricing/demand-list",
    element: <ChangePricingDemandListPage />,
  },
  {
    path: "/project-contract/change-pricing/demand-form",
    element: <ChangePricingDemandFormPage />,
  },
  {
    path: "/project-contract/change-pricing/demand-detail",
    element: <ChangePricingDemandDetailPage />,
  },
  {
    path: "/project-contract/change-pricing/submit",
    element: <ChangePricingSubmitPage />,
  },
  {
    path: "/project-contract/exam-exemption",
    element: <ExamExemptionContractListPage />,
  },
  {
    path: "/project-contract/exam-exemption/exemption-list",
    element: <ExamExemptionListPage />,
  },
  {
    path: "/project-contract/exam-exemption/project-form",
    element: <ExamExemptionProjectFormPage />,
  },
  {
    path: "/project-contract/exam-exemption/department-confirm",
    element: <ExamExemptionDepartmentConfirmPage />,
  },
  {
    path: "/project-contract/exam-exemption/detail",
    element: <ExamExemptionDetailPage />,
  },
  {
    path: "/project-contract/quality-dispute",
    element: <QualityDisputeListPage />,
  },
  {
    path: "/project-contract/quality-dispute/form",
    element: <QualityDisputeFormPage />,
  },
  {
    path: "/project-contract/quality-dispute/project-review",
    element: <QualityDisputeProjectReviewPage />,
  },
  {
    path: "/project-contract/quality-dispute/manufacturing-review",
    element: <QualityDisputeManufacturingReviewPage />,
  },
  {
    path: "/project-contract/quality-dispute/detail",
    element: <QualityDisputeDetailPage />,
  },
  {
    path: "/project-contract/payment-declaration",
    element: <PaymentDeclarationListPage />,
  },
  {
    path: "/project-contract/payment-declaration/declaration-list",
    element: <PaymentDeclarationAppListPage />,
  },
  {
    path: "/project-contract/payment-declaration/project-review",
    element: <PaymentProjectReviewPage />,
  },
  {
    path: "/project-contract/payment-declaration/supervisory-review",
    element: <PaymentSupervisoryReviewPage />,
  },
  {
    path: "/project-contract/payment-declaration/finance-review",
    element: <PaymentFinanceReviewPage />,
  },
  {
    path: "/project-contract/payment-declaration/detail",
    element: <PaymentDeclarationDetailPage />,
  },
  {
    path: "/project-contract/payment-reimbursement",
    element: <PaymentReimbursementContractListPage />,
  },
  {
    path: "/project-contract/payment-reimbursement/reimbursement-list",
    element: <PaymentReimbursementAppListPage />,
  },
  {
    path: "/project-contract/payment-reimbursement/prepayment-form",
    element: <PaymentReimbursementPrepaymentFormPage />,
  },
  {
    path: "/project-contract/payment-reimbursement/warranty-form",
    element: <PaymentReimbursementWarrantyFormPage />,
  },
  {
    path: "/project-contract/payment-reimbursement/settlement-form",
    element: <PaymentReimbursementSettlementFormPage />,
  },
  {
    path: "/project-close/early-evaluation",
    element: <EarlyEvaluationListPage />,
  },
  {
    path: "/project-close/post-evaluation",
    element: <PostEvalListPage />,
  },
  {
    path: "/project-close/post-evaluation/catalog",
    element: <PostEvalCatalogPage />,
  },
  {
    path: "/project-close/post-evaluation/self-eval",
    element: <PostEvalSelfPage />,
  },
  {
    path: "/project-close/post-evaluation/prof-eval",
    element: <PostEvalProfPage />,
  },
  {
    path: "/project-close/post-evaluation/comp-eval",
    element: <PostEvalCompPage />,
  },
  {
    path: "/project-archive/config",
    element: <ArchiveConfigPage />,
  },
  {
    path: "/project-archive/config/preview",
    element: <ArchiveConfigPreviewPage />,
  },
  {
    path: "/project-archive/management",
    element: <ArchiveManagementListPage />,
  },
  {
    path: "/project-archive/management/detail",
    element: <ArchiveManagementDetailPage />,
  },
  {
    path: "/project-archive/management/preview",
    element: <ArchiveManagementPreviewPage />,
  },
  {
    path: "/project-prepare/preliminary-design/estimate-review/change-detail",
    element: <ChangeDetailPage />,
  },
  {
    path: "/project-prepare/preliminary-design/wbs-decomposition",
    element: <WBSDecompositionPage />,
  },
  {
    path: "/project-prepare/preliminary-design/wbs-edit",
    element: <WBSEditPage />,
  },
  {
    path: "/project-execute/progress",
    element: <ProjectProgressListPage />,
  },
  {
    path: "/project-execute/progress/weekly-monthly",
    element: <WeeklyMonthlyPage />,
  },
  {
    path: "/project-execute/progress/weekly-monthly/detail",
    element: <ReportDetailPage2 />,
  },
  {
    path: "/project-execute/progress/report",
    element: <ProgressReportPage />,
  },
  {
    path: "/project-execute/progress/gantt",
    element: <ProjectGanttPage />,
  },
  {
    path: "/project-execute/it-launch",
    element: <ItLaunchListPage />,
  },
  {
    path: "/project-execute/it-launch/form",
    element: <ItLaunchFormPage />,
  },
  {
    path: "/project-execute/completion",
    element: <CompletionProjectListPage />,
  },
  {
    path: "/project-execute/completion/tech-renovation",
    element: <TechRenovationListPage />,
  },
  {
    path: "/project-execute/completion/application-list",
    element: <CompletionApplicationListPage />,
  },
  {
    path: "/project-execute/completion/application-form",
    element: <CompletionApplicationFormPage />,
  },
  {
    path: "/project-execute/it-acceptance",
    element: <ItAcceptanceListPage />,
  },
  {
    path: "/project-execute/it-acceptance/form",
    element: <ItAcceptanceFormPage />,
  },
  {
    path: "/project-execute/it-acceptance/research-confirm",
    element: <ResearchConfirmListPage />,
  },
  {
    path: "/project-execute/it-acceptance/confirm-form",
    element: <ItAcceptanceConfirmPage />,
  },
  {
    path: "/system-config/monitor-config",
    element: <MonitorConfigListPage />,
  },
  {
    path: "/system-config/monitor-config/config",
    element: <MonitorDeviceConfigPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/participant/construction-member",
    element: <ConstructionMemberListPage />,
  },
  {
    path: "/participant/construction-member/detail",
    element: <ConstructionMemberDetailPage />,
  },
];

export default routes;