import React from "react";

const ParticipantManagement = React.lazy(
  () => import("../features/BK_Achievement/Roles/pages/participantManagement")
);
const UserSubmission = React.lazy(
  () => import("../features/BK_Achievement/Achievement/page/UserSubmission")
);

const ExpertiseProfilePage = React.lazy(
  () => import("../features/BK_Achievement/Expertise/page/ExpertiseProfilePage")
);

const submissionUsers = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/submissionUsers")
);
const SubmissionUsersTest = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/Test")
);
const SubmissionUsersTestFinal = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/TestFinal")
);
const SubmissionUsersResult = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/Result")
);
const SubmissionUsersFaculty = React.lazy(
  () => import("../features/BK_Achievement/ProfileManager/components/profileDetail")
);
const ResultDetail = React.lazy(
  () => import("../features/BK_Achievement/ProfileManager/components/resultDetail")
);
const AuditorFinalTest = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/AuditorFinalTest")
);
const Page404 = React.lazy(() => import("../common/pages/page404"));
const Page500 = React.lazy(() => import("../common/pages/page500"));
const ShowAchievementUser = React.lazy(
  () =>
    import("../features/BK_Achievement/Achievement/page/ShowAchievementUser")
);
const Auditor = React.lazy(
  () => import("../features/BK_Achievement/Auditor/auditor")
);
const AuditorFinal = React.lazy(
  () => import("../features/BK_Achievement/Auditor/auditorFinal")
);
const AchievementTabs = React.lazy(
  () => import("../features/BK_Achievement/Achievement/page/AchievementTabs")
);
const FormStudent = React.lazy(
  () => import("../features/BK_Achievement/Information/Pages/Student")
);
const FormManager = React.lazy(
  () => import("../features/BK_Achievement/Information/Pages/Manager")
);
const AchievementPage = React.lazy(
  () => import("../features/BK_Achievement/Achievement/page/AchievementPage")
);

const ExpertisePage = React.lazy(
  () => import("../features/BK_Achievement/Expertise/page")
);

const CriteriaPage = React.lazy(
  () => import("../features/BK_Achievement/Criteria/page/CriteriaPage")
);

const DepartmentManagerIndexPage = React.lazy(
  () => import("../features/BK_Achievement/DepartmentManager/pages/index")
);

const SubmissionPage = React.lazy(
  () => import("../features/BK_Achievement/Student/pages/SubmissionPage")
);

const ManageAuditor = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/ManageAuditor")
);

const ShowHistoryAchievement = React.lazy(
  () =>
    import("../features/BK_Achievement/Achievement/page/ShowHistoryAchievement")
);

const ProfileManager = React.lazy(
  () =>
    import("../features/BK_Achievement/ProfileManager/pages")
);
const SubmittedProfile = React.lazy(
  () => import("../features/BK_Achievement/ProfileManager/pages/SubmittedProfileList")
);
const ReportedProfile = React.lazy(
  () => import("../features/BK_Achievement/ProfileManager/pages/ReportedProfileList")
);
const ExportReport = React.lazy(
  () => import("../features/BK_Achievement/ProfileManager/pages/ExportReport")
);
const AchievementStatistic = React.lazy(
  () => import("../features/BK_Achievement/Achievement/page/Statistic")
);

export {
  SubmissionUsersTestFinal,
  ResultDetail,
  ReportedProfile,
  ExportReport,
  ExpertiseProfilePage,
  ExpertisePage,
  SubmittedProfile,
  ProfileManager,
  Page404,
  Page500,
  ShowAchievementUser,
  Auditor,
  AuditorFinal,
  AchievementTabs,
  FormStudent,
  FormManager,
  ParticipantManagement,
  UserSubmission,
  submissionUsers,
  SubmissionUsersTest,
  AuditorFinalTest,
  AchievementPage,
  CriteriaPage,
  DepartmentManagerIndexPage,
  SubmissionPage,
  ManageAuditor,
  ShowHistoryAchievement,
  SubmissionUsersFaculty,
  AchievementStatistic,
  SubmissionUsersResult
};
