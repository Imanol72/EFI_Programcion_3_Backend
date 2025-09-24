const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando 🚀" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const userRoutes = require("./routes/users.routes");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);