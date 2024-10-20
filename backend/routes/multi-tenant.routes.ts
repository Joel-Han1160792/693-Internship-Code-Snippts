import {
  getUserRolesAndPermissions,
  assignSubrolesAndTeams,
  createTeam,
  editTeam,
  createTeamRoles,
  addPermissionToRole,
  removePermissionsToRole,
  getTeams,
  deleteTeam,
  getSubroles,
  deleteSubroles,
  addSubrole
} from "../controllers/multi-tenant.controller";
import { Application, Router } from "express";
import { userAuth } from "../utils/auth";
import teamMembershipMiddleware from "../utils/teamMembershipMiddleware";

export default (app: Application) => {
  const router = Router();

  router.get("/roles-permissions", getUserRolesAndPermissions);

  router.post("/add-permissions", addPermissionToRole);

  router.delete("/remove-permissions", removePermissionsToRole);

  router.post("/create-team", createTeam);

  router.put("/edit-team/:teamId", editTeam); // TODO: Specify roles who have permission to edit team info

  router.post("/create-role", createTeamRoles);

  router.put("/team-role", assignSubrolesAndTeams);

  router.get("/user-teams", getTeams);

  router.delete("/delete-team/:teamId", deleteTeam);

  router.get("/subroles/:teamId", getSubroles);

  router.post("/add-subrole", addSubrole);

  router.delete("/delete-subroles/:roleID", deleteSubroles);

  app.use("/api/multi-tenant", userAuth, router);
};
