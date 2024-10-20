import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";

export type TeamAttributes = {
  team_id: number;
  team_name: string;
  team_description?: string;
  created_at: Date;
};

interface TeamCreationAttributes
  extends Omit<TeamAttributes, "team_id" | "created_at"> {}

class Team extends Model<TeamAttributes, TeamCreationAttributes> {
  declare team_id: number;
  declare team_name?: string;
  declare team_description?: string;
  declare created_at: Date;

  public static associate(models: Record<string, ModelStatic<Model>>) {
    this.hasMany(models.user_teams, {
      foreignKey: "team_id",
      as: "user_teams"
    });
    this.hasMany(models.invitation, {
      foreignKey: "team_id",
      as: "invitations"
    });
    this.hasMany(models.team_roles, {
      foreignKey: "team_id",
      as: "team_roles"
    });
  }
}

export default (sequelize: Sequelize) => {
  Team.init(
    {
      team_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      team_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      team_description: {
        type: DataTypes.TEXT
      },
      created_at: {
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      modelName: "team"
    }
  );
  return Team;
};
