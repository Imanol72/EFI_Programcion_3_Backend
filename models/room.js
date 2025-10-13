"use strict";

module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      // varchar(16) UNIQUE (puede ser null)
      numero_habitacion: {
        type: DataTypes.STRING(16),
        allowNull: true,
        unique: true,
      },

      tipo: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      precio_noche: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },

      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      amenities: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },

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
    if (models.Reservation) {
      Room.hasMany(models.Reservation, {
        foreignKey: "id_habitacion",
        as: "reservas",
      });
    }
  };

  return Room;
};
