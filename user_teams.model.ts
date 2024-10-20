import { Sequelize, Model, DataTypes, ModelStatic } from "sequelize";

export type UserTeamsAttributes = {
  user_team_id: number;
  user_id?: number;
  team_id?: number;
  team_role_id?: number;
  joined_at?: Date;
};

interface UserTeamsCreationAttributes
  extends Omit<UserTeamsAttributes, "user_team_id"> {}

class UserTeams extends Model<
  UserTeamsAttributes,
  UserTeamsCreationAttributes
> {
  declare user_team_id: number;
  declare user_id?: number;
  declare team_id?: number;
  declare team_role_id?: number;
  declare joined_at?: Date;

  public static associate(models: Record<string, ModelStatic<Model>>) {
    this.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "user"
    });
    this.belongsTo(models.team_roles, {
      foreignKey: "team_role_id",
      as: "team_role"
    });
    this.belongsTo(models.team, {
      foreignKey: "team_id",
      as: "team"
    });
  }
}

export default (sequelize: Sequelize) => {
  UserTeams.init(
    {
      user_team_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      team_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      timestamps: true,
      modelName: "user_teams"
    }
  );

  return UserTeams;
};
