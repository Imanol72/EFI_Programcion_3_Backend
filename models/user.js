
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

 
      nombre:     { type: DataTypes.STRING, allowNull: true, field: "nombre" },

    
      correo:     { type: DataTypes.STRING, allowNull: true, field: "correo", unique: true },

      contraseña: { type: DataTypes.STRING, allowNull: true, field: "contraseña" },   

      rol:  { type: DataTypes.ENUM("cliente","empleado","admin"), allowNull: true, field: "rol"  }, 

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