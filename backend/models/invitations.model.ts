import { Sequelize, Model, DataTypes, ModelStatic } from "sequelize";

export enum InvitationStatus {
  Pending = "pending",
  Accepted = "accepted",
  Declined = "declined"
}

export type InvitationAttributes = {
  invitation_id: number;
  inviter_user_id?: number;
  email?: string;
  team_role_id?: number;
  token?: string;
  created_at: Date;
  expires_at?: Date;
  status?: InvitationStatus;
};

interface InvitationCreationAttributes
  extends Omit<InvitationAttributes, "invitation_id" | "created_at"> {}

class Invitation extends Model<
  InvitationAttributes,
  InvitationCreationAttributes
> {
  declare invitation_id: number;
  declare inviter_user_id?: number;
  declare email?: string;
  declare team_role_id?: number;
  declare token?: string;
  declare created_at: Date;
  declare expires_at?: Date;
  declare status?: "pending" | "accepted" | "declined";

  public static associate(models: Record<string, ModelStatic<Model>>) {
    this.belongsTo(models.user, {
      foreignKey: "inviter_user_id",
      targetKey: "user_id",
      as: "inviter_user"
    });
    this.belongsTo(models.team_roles, {
      foreignKey: "team_role_id",
      as: "team_role"
    });
  }
}

export default (sequelize: Sequelize) => {
  Invitation.init(
    {
      invitation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      inviter_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      team_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      created_at: {
        type: DataTypes.DATE
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(...Object.values(InvitationStatus)),
        allowNull: false,
        defaultValue: InvitationStatus.Pending
      }
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "created_at",
      modelName: "invitation"
    }
  );

  return Invitation;
};
