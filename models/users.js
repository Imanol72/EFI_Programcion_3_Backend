"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  User.associate = (models) => {
    // users (1) --- (N) clients
    User.hasMany(models.Client, { foreignKey: "id_usuario", as: "clientes" });
    // users (1) --- (N) reservations
    User.hasMany(models.Reservation, { foreignKey: "id_usuario", as: "reservas" });
  };

  return User;
};
