import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";

export type PredefinedRolePermissionAttributes = {
  predefined_role_permission_id: number;
  predefined_role_id?: number;
  permission_id?: number;
};

interface PredefinedRolePermissionCreationAttributes
  extends Omit<
    PredefinedRolePermissionAttributes,
    "predefined_role_permission_id"
  > {}

class PredefinedRolePermission extends Model<
  PredefinedRolePermissionAttributes,
  PredefinedRolePermissionCreationAttributes
> {
  declare predefined_role_permission_id: number;
  declare predefined_role_id?: number;
  declare permission_id?: number;

  public static associate(models: Record<string, ModelStatic<Model>>) {
    this.belongsTo(models.predefined_roles, {
      foreignKey: "predefined_role_id",
      as: "predefined_role"
    });
    this.belongsTo(models.permission, {
      foreignKey: "permission_id",
      as: "permission"
    });
  }
}

export default (sequelize: Sequelize) => {
  PredefinedRolePermission.init(
    {
      predefined_role_permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      predefined_role_id: {
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
      modelName: "predefined_role_permissions"
    }
  );

  return PredefinedRolePermission;
};
