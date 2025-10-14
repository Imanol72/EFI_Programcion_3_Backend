"use strict";

module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      // columnas reales de tu tabla
      fecha_inicio: { type: DataTypes.DATE, allowNull: false }, // DATETIME
      fecha_fin:    { type: DataTypes.DATE, allowNull: false }, // DATETIME
      estado:       { type: DataTypes.STRING(255), allowNull: true },

      id_cliente:    { type: DataTypes.INTEGER, allowNull: true },
      id_habitacion: { type: DataTypes.INTEGER, allowNull: true },
      id_usuario:    { type: DataTypes.INTEGER, allowNull: true }, // por si lo usás

      // timestamps mapeados como ya tenés
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
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
    Reservation.belongsTo(models.Room,   { foreignKey: "id_habitacion", as: "room"   });
    Reservation.belongsTo(models.Client, { foreignKey: "id_cliente",    as: "client" });
  };

  return Reservation;
};
