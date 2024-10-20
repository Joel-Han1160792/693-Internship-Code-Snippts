import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";

export type TeamRolesAttributes = {
  team_role_id: number;
  team_role_name?: string;
  description?: string;
  team_id?: number;
};

interface TeamRolesCreationAttributes
  extends Omit<TeamRolesAttributes, "team_role_id"> {}

class TeamRoles extends Model<
  TeamRolesAttributes,
  TeamRolesCreationAttributes
> {
  declare team_role_id: number;
  declare team_role_name?: string;
  declare description?: string | null;
  declare team_id?: number;

  public static associate(models: Record<string, ModelStatic<Model>>) {
    this.belongsTo(models.team, {
      foreignKey: "team_id",
      as: "team"
    });
    this.hasMany(models.user_teams, {
      foreignKey: "team_role_id",
      as: "user_teams"
    });
    this.hasMany(models.team_role_permissions, {
      foreignKey: "team_role_id",
      as: "team_role_permissions"
    });
    this.hasMany(models.invitation, {
      foreignKey: "team_role_id",
      as: "invitation"
    });
  }
}

export default (sequelize: Sequelize) => {
  TeamRoles.init(
    {
      team_role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      team_role_name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      timestamps: true,
      modelName: "team_roles"
    }
  );
  return TeamRoles;
};
