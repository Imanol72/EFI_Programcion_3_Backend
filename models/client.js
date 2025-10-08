"use strict";

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      documento_identidad: { type: DataTypes.STRING, allowNull: false },
      telefono: { type: DataTypes.STRING, allowNull: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "clients",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  Client.associate = (models) => {
    // clients (N) --- (1) users
    Client.belongsTo(models.User, { foreignKey: "id_usuario", as: "usuario" });
    // clients (1) --- (N) reservations
    Client.hasMany(models.Reservation, { foreignKey: "id_cliente", as: "reservas" });
  };

  return Client;
};
