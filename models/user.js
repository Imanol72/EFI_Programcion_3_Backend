
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      // nombres de usuario (viejo y nuevo)
      username:   { type: DataTypes.STRING, allowNull: true, field: "username" },
      nombre:     { type: DataTypes.STRING, allowNull: true, field: "nombre" },

      // correo (nuevo)
      correo:     { type: DataTypes.STRING, allowNull: true, field: "correo", unique: true },

      // CONTRASEÑAS (ambas columnas, importante!)
      password:   { type: DataTypes.STRING, allowNull: true, field: "password" },      // vieja
      contraseña: { type: DataTypes.STRING, allowNull: true, field: "contraseña" },    // nueva

      // ROLES (ambas columnas)
      role: { type: DataTypes.ENUM("cliente","empleado","admin"), allowNull: true, field: "role" }, // viejo
      rol:  { type: DataTypes.ENUM("cliente","empleado","admin"), allowNull: true, field: "rol"  }, // nuevo

      is_active:  { type: DataTypes.BOOLEAN, allowNull: true, field: "is_active", defaultValue: 1 },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  return User;
};
