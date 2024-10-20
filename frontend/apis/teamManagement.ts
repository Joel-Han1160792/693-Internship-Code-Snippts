import axios from "../../axios";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Role {
  role_id: string;
  role_name: string;
  permissions?: string[];
}

export interface Team {
  team_id: string;
  team_name: string;
  team_description: string;
  role?: string;
  joined_at?: Date;
}

export interface Teams {
  success: boolean;
  teams: Team[];
}

export const getUserRolesAndPermissions = async () => {
  const response = await axios.get("/multi-tenant/roles-permissions");
  return response.data;
};

export const addPermissionToRole = async (
  teamRoleID: string,
  permissionIDs: string[]
) => {
  const response = await axios.post("/multi-tenant/add-permissions", {
    teamRoleID,
    permissionIDs
  });
  return response.data;
};

export const removePermissionsFromRole = async (
  teamRoleID: string,
  permissionIDs: string[]
) => {
  const response = await axios.delete("/multi-tenant/remove-permissions", {
    data: { teamRoleID, permissionIDs }
  });
  return response.data;
};

export const getTeams = async (): Promise<Team[]> => {
  const response = await axios.get("/multi-tenant/user-teams");
  return response.data.teams;
};

export const createTeam = async (
  teamName: string,
  teamDescription: string
): Promise<Team> => {
  const response = await axios.post("/multi-tenant/create-team", {
    teamName,
    teamDescription
  });
  return response.data.team;
};

export const editTeam = async (
  teamId: string,
  teamName: string,
  teamDescription: string
): Promise<Team> => {
  const response = await axios.put(`/multi-tenant/edit-team/${teamId}`, {
    teamName,
    teamDescription
  });
  return response.data.team;
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  try {
    const response = await axios.delete(`/multi-tenant/delete-team/${teamId}`);
    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to delete team");
    }
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
};

export const createTeamRoles = async (teamID: string) => {
  const response = await axios.post("/multi-tenant/create-role", { teamID });
  return response.data;
};

export const assignSubrolesAndTeams = async (
  userID: string,
  teamID: string,
  teamRoleID: string
) => {
  const response = await axios.put("/multi-tenant/team-role", {
    userID,
    teamID,
    teamRoleID
  });
  return response.data;
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await axios.get("/team/members");
  return response.data;
};

export const addTeamMember = async (
  member: Omit<TeamMember, "id">
): Promise<TeamMember> => {
  const response = await axios.post("/team/members", member);
  return response.data;
};

export const removeTeamMember = async (memberId: string): Promise<void> => {
  await axios.delete(`/team/members/${memberId}`);
};

export const getRoles = async (teamId: string): Promise<Role[]> => {
  const response = await axios.get<{ success: boolean; role_created: Role[] }>(
    `/multi-tenant/subroles/${teamId}`
  );

  return response.data.role_created;
};

export const addRole = async (role: {
  role_name: string;
  team_id: string;
}): Promise<Role> => {
  const response = await axios.post("/multi-tenant/add-subrole", role);
  return response.data;
};

export const deleteRole = async (roleId: string): Promise<void> => {
  await axios.delete(`/multi-tenant/delete-subroles/${roleId}`);
};

export const getAvailablePermissions = async (): Promise<string[]> => {
  const response = await axios.get("/team/permissions");
  return response.data;
};

export const sendInvitation = async (
  email: string,
  team_role_id: number
): Promise<void> => {
  try {
    const response = await axios.post("/invitations/send", {
      email,
      team_role_id
    });
    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to send invitation");
    }
  } catch (error) {
    console.error("Error sending invitation:", error);
    throw error;
  }
};
