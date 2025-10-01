// backend/seed.js
const bcrypt = require("bcrypt");
const db = require("./models");

async function seed() {
  try {
    await db.sequelize.sync({ force: true }); // ⚠️ Elimina y recrea todas las tablas

    console.log("📦 Base de datos sincronizada.");

    // Usuarios
    const adminPass = await bcrypt.hash("admin123", 10);
    const clientePass = await bcrypt.hash("cliente123", 10);
    const empleadoPass = await bcrypt.hash("empleado123", 10);

    const admin = await db.User.create({
      nombre: "Administrador",
      correo: "admin@hotel.com",
      contraseña: adminPass,
      rol: "admin",
    });

    const empleado = await db.User.create({
      nombre: "Empleado",
      correo: "empleado@hotel.com",
      contraseña: empleadoPass,
      rol: "empleado",
    });

    const cliente = await db.User.create({
      nombre: "Cliente",
      correo: "cliente@hotel.com",
      contraseña: clientePass,
      rol: "cliente",
    });

    console.log("👤 Usuarios creados");

    // Habitaciones
    const rooms = await db.Room.bulkCreate([
      { numero_habitacion: 101, tipo: "Single", precio_noche: 50.0, disponible: true },
      { numero_habitacion: 102, tipo: "Double", precio_noche: 80.0, disponible: true },
      { numero_habitacion: 201, tipo: "Suite", precio_noche: 150.0, disponible: true },
    ]);

    console.log("🛏️ Habitaciones creadas");

    // Cliente vinculado al usuario cliente
    const clientProfile = await db.Client.create({
      documento_identidad: "12345678",
      telefono: "555-1234",
      id_usuario: cliente.id,
    });

    console.log("📇 Cliente creado");

    // Reservas
    await db.Reservation.create({
      fecha_inicio: new Date("2025-10-05"),
      fecha_fin: new Date("2025-10-10"),
      estado: "pendiente",
      id_usuario: cliente.id,
      id_cliente: clientProfile.id,
      id_habitacion: rooms[0].id,
    });

    await db.Reservation.create({
      fecha_inicio: new Date("2025-10-15"),
      fecha_fin: new Date("2025-10-20"),
      estado: "confirmada",
      id_usuario: cliente.id,
      id_cliente: clientProfile.id,
      id_habitacion: rooms[1].id,
    });

    console.log("📅 Reservas creadas");

    console.log("✅ Seeder ejecutado con éxito.");
    process.exit();
  } catch (err) {
    console.error("❌ Error ejecutando seeder:", err);
    process.exit(1);
  }
}

seed();
