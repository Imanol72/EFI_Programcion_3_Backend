"use strict";

module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      // columnas reales (DESCRIBE rooms;)
      numero_habitacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      tipo: {
        type: DataTypes.STRING, // varchar(255)
        allowNull: false,
      },
      // en tu DB es DECIMAL(10,0) (sin decimales)
      precio_noche: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
      // tinyint(1) -> boolean
      disponible: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      tableName: "rooms",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  Room.associate = (models) => {
    // rooms (1) --- (N) reservations
    Room.hasMany(models.Reservation, { foreignKey: "id_habitacion", as: "reservas" });
  };

  return Room;
};
