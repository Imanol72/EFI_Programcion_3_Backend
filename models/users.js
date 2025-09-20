"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Client, { foreignKey: "id_usuario" });
    }
    validPassword(password) {
      return bcrypt.compareSync(password, this.contraseña);
    }
  }
  User.init(
    {
      nombre: { type: DataTypes.STRING, allowNull: false },
      correo: { type: DataTypes.STRING, unique: true, allowNull: false },
      contraseña: { type: DataTypes.STRING, allowNull: false },
      rol: { type: DataTypes.ENUM("admin", "empleado", "cliente"), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    { sequelize, modelName: "User", tableName: "users", underscored: true }
  );

  // Hash de contraseña antes de crear/actualizar
  User.beforeCreate(async (user) => {
    user.contraseña = await bcrypt.hash(user.contraseña, 10);
  });

  return User;
};
