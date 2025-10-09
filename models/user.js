// models/user.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // users (1) --- (N) clients
      User.hasMany(models.Client, { foreignKey: 'id_usuario', as: 'clientes' });
      
      // users (1) --- (N) reservations
      User.hasMany(models.Reservation, { foreignKey: 'id_usuario', as: 'reservas' });
    }
  }

  User.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rol: {
        type: DataTypes.ENUM('admin', 'empleado', 'cliente'),
        allowNull: false,
        defaultValue: 'cliente', // <- rol por defecto
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true, // crea createdAt y updatedAt automáticamente
    }
  );

  return User;
};
