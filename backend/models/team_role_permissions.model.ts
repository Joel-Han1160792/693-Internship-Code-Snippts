import { DataTypes, Model, Sequelize, ModelStatic } from "sequelize";

export type TeamRolePermissionAttributes = {
  team_role_permission_id: number;
  team_role_id?: number;
  permission_id?: number;
};

interface TeamRolePermissionCreationAttributes
  extends Omit<TeamRolePermissionAttributes, "team_role_permission_id"> {}

export class TeamRolePermission extends Model<
  TeamRolePermissionAttributes,
  TeamRolePermissionCreationAttributes
> {
  declare team_role_permission_id: number;
  declare team_role_id?: number;
  declare permission_id?: number;

  public static associate(models: Record<string, ModelStatic<Model>>) {
    this.belongsTo(models.team_roles, {
      foreignKey: "team_role_id",
      as: "team_role"
    });
    this.belongsTo(models.permission, {
      foreignKey: "permission_id",
      as: "permission"
    });
  }
}

export default (sequelize: Sequelize) => {
  TeamRolePermission.init(
    {
      team_role_permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      team_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      timestamps: true,
      modelName: "team_role_permissions",
      indexes: [
        {
          fields: ["team_role_id"]
        }
      ]
    }
  );

  return TeamRolePermission;
};
