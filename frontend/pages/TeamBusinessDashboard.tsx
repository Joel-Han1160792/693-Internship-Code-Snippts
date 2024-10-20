import React, { useCallback, useEffect } from "react";
import usePageTitle from "../../../utils/hooks/usePageTitle";
import DashboardTop from "../../../components/dashboard/common/DashboardTop";
import TeamDashboardGrid from "../../../components/dashboard/common/TeamDashboardGrid";
import DashboardItem from "../../../components/dashboard/common/DashboardItem";
import StatisticCard from "../../../components/dashboard/common/StatisticCard";
import ReportsCounterIcon from "../../../assets/icons/ReportsCounterIcon";
import ReportsReviewIcon from "../../../assets/icons/ReportsReviewIcon";
import TriageApprovedIcon from "../../../assets/icons/TriageApprovedIcon";
import ResolvedIcon from "../../../assets/icons/ResolvedIcon";
import useReportSummary from "../../../utils/hooks/reports/useReportSummary";
import SpeakerphoneIcon from "../../../assets/icons/SpeakerphoneIcon";
import CogIcon from "../../../assets/icons/CogIcon";
import ManageTeam from "../../../components/team/ManageTeam";
import ManageRoles from "../../../components/team/ManageRoles";
import SendInvitation from "../../../components/team/SendInvitation";
import useTeamManagement from "../../../utils/hooks/team/useTeamManagement";
import Notification from "../../../components/common/Notification";

const TeamBusinessDashboard: React.FC = () => {
  usePageTitle("Team Business Dashboard");
  const reportsSummary = useReportSummary();
  const numReceived = reportsSummary.summary?.numReceived;
  const review = reportsSummary.summary?.review;
  const approved = reportsSummary.summary?.business_approved;
  const closed = reportsSummary.summary?.closed;

  const {
    teamMembers,
    roles,
    handleAddRole,
    handleDeleteRole,
    availablePermissions,
    addTeamMember,
    removeTeamMember,
    sendInvitation,
    teams,
    handleCreateTeam,
    handleUpdateTeam,
    handleDeleteTeam,
    notification,
    clearNotification,
    getLatestTeamId,
    fetchTeams // 添加这行
  } = useTeamManagement();

  // 可以添加这个 useEffect 来确保在组件挂载时获取团队信息
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleSendInvitation = useCallback(
    async (email: string, team_role_id: number) => {
      try {
        await sendInvitation(email, team_role_id);
      } catch (error) {
        console.error("Error sending invitation:", error);
      }
    },
    [sendInvitation]
  );

  const handleTeamDelete = useCallback(
    async (teamId: string) => {
      try {
        await handleDeleteTeam(teamId);
      } catch (error) {
        console.error("Error deleting team:", error);
      }
    },
    [handleDeleteTeam]
  );

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
      <DashboardTop>
        <div className="grid grid-cols-4 gap-4">
          <StatisticCard
            icon={ReportsCounterIcon}
            content={numReceived?.toString() as string}
            title="Received"
            gradientClassName="from-[#C084FC] to-[#8B5CF6]"
          />
          <StatisticCard
            icon={ReportsReviewIcon}
            content={review?.toString() as string}
            title="In Review"
            gradientClassName="from-[#60A5FA] to-[#3B82F6]"
          />
          <StatisticCard
            icon={TriageApprovedIcon}
            content={approved?.toString() as string}
            title="Triage Approved"
            gradientClassName="from-[#FBBF24] to-[#FBAF24]"
          />
          <StatisticCard
            icon={ResolvedIcon}
            content={closed?.toString() as string}
            title="Resolved"
            gradientClassName="from-[#4ADE80] to-[#22C55E]"
          />
        </div>
      </DashboardTop>
      <TeamDashboardGrid>
        <DashboardItem
          itemTitle="Manage Teams"
          Icon={CogIcon}
          iconStyle="stroke"
          colSpan="col-span-1"
          rowSpan="row-span-auto"
        >
          <ManageTeam
            teams={teams}
            onCreateTeam={handleCreateTeam}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleTeamDelete}
          />
        </DashboardItem>
        {teams.length > 0 && (
          <>
            <DashboardItem
              itemTitle="Manage Roles"
              Icon={CogIcon}
              iconStyle="stroke"
              colSpan="col-span-1"
              rowSpan="row-span-auto"
            >
              <ManageRoles
                roles={roles}
                onAddRole={handleAddRole}
                onDeleteRole={handleDeleteRole}
              />
            </DashboardItem>
            <DashboardItem
              itemTitle="Send Invitation"
              Icon={SpeakerphoneIcon}
              iconStyle="stroke"
              colSpan="col-span-1"
              rowSpan="row-span-auto"
            >
              <SendInvitation
                onSendInvitation={handleSendInvitation}
                roles={roles}
              />
            </DashboardItem>
          </>
        )}
      </TeamDashboardGrid>
    </>
  );
};

export default TeamBusinessDashboard;
