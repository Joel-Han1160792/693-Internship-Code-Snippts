import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";

export type PredefinedRolesAttributes = {
  predefined_role_id: number;
  name?: string;
  description?: string;
};

interface PredefinedRolesCreationAttributes
  extends Omit<PredefinedRolesAttributes, "predefined_role_id"> {}

class PredefinedRoles extends Model<
  PredefinedRolesAttributes,
  PredefinedRolesCreationAttributes
> {
  declare predefined_role_id: number;
  declare name?: string;
  declare description?: string;

  public static associate(models: Record<string, ModelStatic<Model>>) {
    this.hasMany(models.predefined_role_permissions, {
      foreignKey: "predefined_role_id",
      as: "predefined_role_permissions"
    });
  }
}

export default (sequelize: Sequelize) => {
  PredefinedRoles.init(
    {
      predefined_role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      modelName: "predefined_roles"
    }
  );

  return PredefinedRoles;
};
