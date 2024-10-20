import { database } from "../models/db";
import { Request, Response } from "express";
import { UserAttributes } from "../models/user.model";
import { Op, Transaction } from "sequelize";
import { sequelize } from "../models/db";
import { CTBQueryRequest } from "../../server";
import {
  USER_ROLE_HACKER,
  USER_ROLE_BUSINESS,
  USER_ROLE_ADMIN
} from "../utils/constants";
const UserTeams = database.user_teams;
const TeamRolePermissions = database.team_role_permissions;
const Permissions = database.permission;
const TeamRoles = database.team_roles;
const Teams = database.teams;
const Users = database.user;
const PredefinedRoles = database.predefined_roles;
const Invitations = database.invitations;



// Use this to create team roles when creating a new team.
export const createTeamRoles = async (req: Request, res: Response) => {
  const { teamID } = req.body;
  const transaction = await sequelize.transaction(); // Start a new transaction

  try {
    // Step 1: Fetch all predefined roles
    const predefinedRoles = await PredefinedRoles.findAll({
      attributes: ["predefined_role_id", "name"],
      transaction // Query is part of the transaction
    });

    // Step 2: Map predefined roles to team roles
    const teamRolesData = predefinedRoles.map(role => ({
      team_role_name: role.name,
      description: `Team role based on predefined role: ${role.name}`,
      team_id: teamID // passing in the teamID
    }));

    // Step 3: Bulk insert into TeamRoles table, with the transaction
    const insertedTeamRoles = await TeamRoles.bulkCreate(teamRolesData, {
      transaction // Include it in the transaction
    });

    // Commit the transaction if successful
    await transaction.commit();

    // Return the result
    return res.status(201).json({ success: true, data: insertedTeamRoles });
  } catch (error) {
    // If any error occurs, rollback the transaction
    await transaction.rollback();
    console.error("Error creating team roles:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error creating team roles." });
  }
};

export const addPermissionToRole = async (req, res) => {
  const { teamRoleID, permissionIDs } = req.body; //permissionIDs is an array
  try {
    //step 1: find all of the rows have both 'teamRoleID' and 'permissionID'
    const existingPermissions = await TeamRolePermissions.findAll({
      where: {
        team_role_id: teamRoleID,
        permission_id: {
          [Op.in]: permissionIDs // find all of the permissionIDs already created in the TeamRolePermissions table
        }
      }
    });
    // Extract existing `permissionID`
    const existingPermissionIDs = existingPermissions.map(
      permission => permission.permission_id
    );

    // Step 2: Find `permissionID` that doesn't exist yet
    const newPermissionIDs = permissionIDs.filter(
      permissionID => !existingPermissionIDs.includes(permissionID)
    );

    // Step 3: Create a record for each new `permissionID`
    if (newPermissionIDs.length > 0) {
      const newPermissions = newPermissionIDs.map(permissionID => ({
        team_role_id: teamRoleID,
        permission_id: permissionID
      }));

      // Bulk insert the new `team_role_id` and `permission_id` combinations
      await TeamRolePermissions.bulkCreate(newPermissions);

      return res.status(201).json({
        success: true,
        message: `${newPermissionIDs.length} permissions assigned successfully`,
        newPermissions
      });
    } else {
      return res.status(200).json({
        success: true,
        message:
          "All permissions already exist. No new permissions were assigned."
      });
    }
  } catch (error) {
    console.error("Error assigning permissions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const removePermissionsToRole = async (req, res) => {
  const { teamRoleID, permissionIDs } = req.body;

  try {
    // Step 1: Delete the permissionIDs for the specified teamRoleID
    const deletedCount = await TeamRolePermissions.destroy({
      where: {
        team_role_id: teamRoleID,
        permission_id: {
          [Op.in]: permissionIDs // Remove only the specified permissionIDs
        }
      }
    });

    if (deletedCount > 0) {
      return res.status(200).json({
        success: true,
        message: `${deletedCount} permissions removed successfully`
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No permissions found to remove"
      });
    }
  } catch (error) {
    console.error("Error removing permissions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const assignSubrolesAndTeams = async (req, res) => {
  const { userID, teamID, teamRoleID } = req.body;

  try {
    // Check if the user is already assigned to a team
    console.log("Checking if user is already assigned...");
    const alreadyAssigned = await UserTeams.findAll({
      where: { user_id: userID, team_id: teamID }
    });

    // If not assigned, create a new role in UserTeams
    if (alreadyAssigned.length === 0) {
      console.log("User is not assigned. Checking foreign key constraints...");
      const team = await Teams.findByPk(teamID);
      const user = await Users.findByPk(userID);

      if (!team) {
        console.log("Invalid team ID");
        return res.status(400).json({ message: "Invalid team ID" });
      }

      if (!user) {
        console.log("Invalid user ID");
        return res.status(400).json({ message: "Invalid user ID" });
      }

      console.log("Creating new user team role...");
      const newUserTeam = await UserTeams.create({
        user_id: userID,
        team_id: teamID,
        team_role_id: teamRoleID
      });

      // Success: new role created, return the response
      console.log("User team role created successfully");
      return res.status(201).json({
        message: "New role in user team created successfully",
        userTeam: newUserTeam
      });
    } else {
      // If already assigned, update the existing team role
      console.log("Updating existing user team role...");
      const result = await UserTeams.update(
        { team_role_id: teamRoleID },
        {
          where: {
            user_id: userID,
            team_id: teamID
          }
        }
      );

      if (result[0] > 0) {
        return res.json({
          success: true,
          message: "Team role updated successfully"
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "No records found to update" });
      }
    }
  } catch (error) {
    // Catch and handle any errors
    console.error("Error during operation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserRolesAndPermissions = async (
  req: CTBQueryRequest<{ id?: number }>,
  res: Response
) => {
  try {
    const { user_id } = req.user as UserAttributes;

    // Fetch all the teams for the user
    const userTeams = await UserTeams.findAll({
      where: { user_id: user_id },
      attributes: ["team_role_id", "team_id"]
    });

    // Extract the team role ids and team ids for the user's teams
    const teamIds = userTeams.map(team => team.team_id);
    const teamRoleIds = userTeams.map(team => team.team_role_id);

    // Fetch the permissions associated with these roles
    const teamRolePermissions = await TeamRolePermissions.findAll({
      where: { team_role_id: teamRoleIds }
    });

    // Fetch role names
    const teamRoles = await TeamRoles.findAll({
      where: { team_role_id: teamRoleIds },
      attributes: ["team_role_id", "team_role_name"]
    });

    // Fetch the permissions details
    const permissionIds = teamRolePermissions.map(
      permission => permission.permission_id
    );
    const permissions = await Permissions.findAll({
      where: { permission_id: permissionIds },
      attributes: ["permission_id", "name", "description"]
    });

    // Fetch the teams names
    const teams = await Teams.findAll({
      where: { team_id: teamIds },
      attributes: ["team_id", "team_name"]
    });

    // Structure the response
    const result = userTeams.map(team => {
      const roles = teamRolePermissions.filter(
        role => role.team_role_id === team.team_role_id
      );
      const rolePermissions = roles.map(role =>
        permissions.find(
          permission => permission.permission_id === role.permission_id
        )
      );
      const roleName = teamRoles.find(
        teamRole => teamRole.team_role_id === team.team_role_id
      )?.team_role_name;

      const teamName = teams.find(
        teamEntry => teamEntry.team_id === team.team_id
      )?.team_name;

      return {
        team: teamName,
        role: roleName,
        permissions: rolePermissions
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching user roles and permissions:", error);
    res.status(500).json({
      error:
        "Something went wrong while fetching the user roles and permissions!"
    });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { role, user_id } = req.user as UserAttributes;
  const { teamName, teamDescription } = req.body;

  try {
    const result = await database.sequelize.transaction(
      async (t: Transaction) => {
        // Create a new team
        const newTeam = await Teams.create(
          {
            team_name: teamName,
            team_description: teamDescription
          },
          { transaction: t }
        );

        // Get predefined roles
        const predefinedRoleIds = role => {
          if (role === USER_ROLE_ADMIN) {
            return [1, 2, 3];
          } else if (role === USER_ROLE_BUSINESS) {
            return [4, 5, 6];
          } else if (role === USER_ROLE_HACKER) {
            return [7, 8, 9, 10];
          }
        };

        const predefinedRoles = await database.predefined_roles.findAll({
          where: {
            predefined_role_id: {
              [Op.in]: predefinedRoleIds(role)
            }
          }
        });

        let ownerRoleId;

        // Create team roles for each predefined role
        for (const predefinedRole of predefinedRoles) {
          const newTeamRole = await TeamRoles.create(
            {
              team_role_name: predefinedRole.name,
              description: predefinedRole.description,
              team_id: newTeam.team_id
            },
            { transaction: t }
          );
          // If it's the owner role, save its ID
          ownerRoleId = newTeamRole.team_role_id;

          // Get permissions for the predefined role
          const predefinedRolePermissions =
            await database.predefined_role_permissions.findAll({
              where: { predefined_role_id: predefinedRole.predefined_role_id },
              transaction: t
            });

          // Create team role permissions for each predefined role permission
          const teamRolePermissions = predefinedRolePermissions.map(
            permission => ({
              team_role_id: newTeamRole.team_role_id,
              permission_id: permission.permission_id
            })
          );

          await TeamRolePermissions.bulkCreate(teamRolePermissions, {
            transaction: t
          });
        }

        // Add record to user_teams table
        await UserTeams.create(
          {
            user_id: user_id,
            team_id: newTeam.team_id,
            team_role_id: ownerRoleId
          },
          { transaction: t }
        );

        return newTeam;
      }
    );

    res.status(201).json({
      message: `Team ${teamName} created successfully with predefined roles and permissions. Creator added as team owner.`,
      team: result
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the team." });
  }
};

export const editTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { teamName, teamDescription } = req.body;

  try {
    const team = await Teams.findByPk(teamId);

    const result = await team.update({
      team_name: teamName,
      team_description: teamDescription
    });

    res.status(200).json({
      message: `Team ${teamName} updated successfully`,
      team: result
    });
  } catch (error) {
    console.error("Error updating team:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while updating the team." });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  const { user_id } = req.user as UserAttributes;

  try {
    // Get all team IDs for the user from user_teams table
    const userTeams = await UserTeams.findAll({
      where: { user_id: user_id },
      attributes: ["team_id", "createdAt"],
      order: [["createdAt", "DESC"]]
    });

    if (!userTeams || userTeams.length === 0) {
      return res.status(404).json({ message: "No teams found." });
    }

    // Extract team IDs
    const teamIds = userTeams.map(userTeam => userTeam.team_id);

    // Fetch team details
    const teams = await Teams.findAll({
      where: { team_id: teamIds },
      attributes: ["team_id", "team_name", "team_description", "created_at"]
    });

    // Combine team details with join dates
    const formattedTeams = userTeams.map(userTeam => {
      const team = teams.find(t => t.team_id === userTeam.team_id);
      return {
        team_id: team.team_id,
        team_name: team.team_name,
        team_description: team.team_description,
        joined_at: team.created_at
      };
    });

    res.json({
      success: true,
      teams: formattedTeams
    });
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching user teams!"
    });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;

  try {
    await database.sequelize.transaction(async t => {
      // 1. Delete pending invitations for this team
      await Invitations.destroy({
        where: {
          team_role_id: {
            [Op.in]: database.sequelize.literal(
              `(SELECT team_role_id FROM team_roles WHERE team_id = ${teamId})`
            )
          }
        },
        transaction: t
      });

      // 2. Delete team role permissions
      await TeamRolePermissions.destroy({
        where: {
          team_role_id: {
            [Op.in]: database.sequelize.literal(
              `(SELECT team_role_id FROM team_roles WHERE team_id = ${teamId})`
            )
          }
        },
        transaction: t
      });

      // 3. Delete user team associations
      await UserTeams.destroy({
        where: { team_id: teamId },
        transaction: t
      });

      // 4. Delete team roles
      await TeamRoles.destroy({
        where: { team_id: teamId },
        transaction: t
      });

      // 5. Finally, delete the team itself
      await Teams.destroy({
        where: { team_id: teamId },
        transaction: t
      });
    });

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the team." });
  }
};

//****************************** */
export const getSubroles = async (req: Request, res: Response) => {
  const { teamId } = req.params; // fetch the teamId from the request parameters

  try {
    const createdSubroles = await TeamRoles.findAll({
      attributes: ["team_role_id", "team_role_name", "description"],
      where: {
        team_id: teamId
      }
    });

    if (createdSubroles && createdSubroles.length > 0) {
      const formattedTeams = createdSubroles.map(subrole => ({
        role_id: subrole.team_role_id,
        role_name: subrole.team_role_name
      }));
      res.json({
        success: true,
        role_created: formattedTeams
      });
    } else {
      res.json({
        success: true,
        role_created: [],
        message: "No subroles found for the given team ID."
      });
    }
  } catch (error) {
    console.error("Error fetching the created roles:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the created roles!"
    });
  }
};

export const addSubrole = async (req: Request, res: Response) => {
  const { role_name, team_id } = req.body;

  if (!role_name || !team_id) {
    return res.status(400).json({
      success: false,
      message: "Role name and team ID are required"
    });
  }

  try {
    const newRole = await TeamRoles.create({
      team_role_name: role_name,
      team_id: team_id
    });

    res.status(201).json({
      success: true,
      message: "Team role created successfully",
      role: newRole
    });
  } catch (error) {
    console.error("Error during operation:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const deleteSubroles = async (req: Request, res: Response) => {
  const { roleID } = req.params;

  try {
    await database.sequelize.transaction(async t => {
      await TeamRoles.destroy({
        where: { team_role_id: roleID },
        transaction: t
      });
    });
    res.status(200).json({ message: "Team role deleted successfully" });
  } catch (error) {
    console.error("Error deleting team role:", error);
    res.status(500).json({
      error: "An error occurred while deleting the team role."
    });
  }
};
