import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";

export type PermissionAttributes = {
  permission_id: number;
  name?: string;
  description?: string;
};

interface PermissionCreationAttributes
  extends Omit<PermissionAttributes, "permission_id"> {}

class Permission extends Model<
  PermissionAttributes,
  PermissionCreationAttributes
> {
  declare permission_id: number;
  declare name?: string;
  declare description?: string;

  public static associate(models: Record<string, ModelStatic<Model>>) {
    this.hasMany(models.team_role_permissions, {
      foreignKey: "permission_id",
      as: "team_role_permissions"
    });
    this.hasMany(models.predefined_role_permissions, {
      foreignKey: "permission_id",
      as: "predefined_role_permissions"
    });
  }
}

export default (sequelize: Sequelize) => {
  Permission.init(
    {
      permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      timestamps: true,
      modelName: "permission"
    }
  );

  return Permission;
};
