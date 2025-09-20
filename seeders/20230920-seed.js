"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("123456", 10);
    await queryInterface.bulkInsert("users", [
      {
        nombre: "Admin",
        correo: "admin@hotel.com",
        contraseña: passwordHash,
        rol: "admin",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: "Empleado",
        correo: "empleado@hotel.com",
        contraseña: passwordHash,
        rol: "empleado",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: "Cliente",
        correo: "cliente@hotel.com",
        contraseña: passwordHash,
        rol: "cliente",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  }
};
