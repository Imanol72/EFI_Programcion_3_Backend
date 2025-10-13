"use strict";

module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fecha_inicio: { type: DataTypes.DATE, allowNull: false },
      fecha_fin: { type: DataTypes.DATE, allowNull: false },
      estado: { type: DataTypes.STRING, allowNull: true }, // default en DB: 'pendiente'
      id_cliente: { type: DataTypes.INTEGER, allowNull: true },
      id_habitacion: { type: DataTypes.INTEGER, allowNull: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "reservations",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  Reservation.associate = (models) => {
    // reservations (N) --- (1) clients
    Reservation.belongsTo(models.Client, { foreignKey: "id_cliente", as: "cliente" });
    // reservations (N) --- (1) users
    Reservation.belongsTo(models.User, { foreignKey: "id_usuario", as: "usuario" });
    // reservations (N) --- (1) rooms
    Reservation.belongsTo(models.Room, { foreignKey: "id_habitacion", as: "habitacion" });
  };

  return Reservation;
};