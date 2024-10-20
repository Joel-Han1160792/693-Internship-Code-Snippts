import { DataTypes, Model, ModelCtor, Sequelize } from "sequelize";
import { UserRole } from "../utils/auth";
export type UserAttributes = {
  user_id?: number;
  email?: string;
  password?: string;
  username?: string;
  role?: UserRole;
  two_fa_enabled?: boolean;
  about?: DataTypes.TextDataType | null | string;
  country?: string | null;
  pfp?: DataTypes.TextDataType | null | string;
  email_verified?: boolean;
  verification_status?: string;
  triage_status?: string;
  is_approved?: boolean;
  display_name?: string;
  links?: string;
  skills?: string;
  first_time_uxp?: boolean;
  banner?: DataTypes.TextDataType | null | string;
  bookmarked_programs?: string;
};

interface UserCreationAttributes extends UserAttributes {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare user_id: number;
  declare email: string;
  declare password: string;
  declare username: string;
  declare role: UserRole;
  declare two_fa_enabled: boolean;
  declare about: DataTypes.TextDataType | null | string;
  declare country: string | null;
  declare pfp: DataTypes.TextDataType | null | string;
  declare email_verified: boolean;
  declare verification_status: string;
  declare triage_status: string;
  declare is_approved: boolean;
  declare display_name?: string;
  declare links?: string;
  declare skills?: string;
  declare first_time_uxp?: boolean;
  declare banner?: DataTypes.TextDataType | null | string;
  declare bookmarked_programs?: string;

  public static associate(models: Record<string, ModelCtor<Model>>) {
    // this.hasOne(models.otp);
    this.hasMany(models.program, {
      foreignKey: "program_id",
      as: "program_id"
    });
    this.hasMany(models.report, {
      foreignKey: "report_id",
      as: "report_id"
    });
    this.hasMany(models.user_teams, {
      foreignKey: "user_id",
      as: "user_teams"
    });
    this.hasMany(models.invitation, {
      foreignKey: "user_id",
      as: "invitation"
    });
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      two_fa_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      about: {
        type: DataTypes.TEXT
      },
      country: {
        type: DataTypes.STRING
      },
      pfp: {
        type: DataTypes.TEXT
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      verification_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "not verified"
      },
      triage_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "not joined"
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      display_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      links: {
        type: DataTypes.TEXT,
        defaultValue: ""
      },
      skills: {
        type: DataTypes.TEXT,
        defaultValue: ""
      },
      first_time_uxp: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      banner: {
        type: DataTypes.TEXT
      },
      bookmarked_programs: {
        type: DataTypes.TEXT
      }
    },
    {
      sequelize,
      timestamps: false,
      modelName: "user"
    }
  );

  return User;
};
