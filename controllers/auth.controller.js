const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;  // <- el front debe enviar esto
    if (!username || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(409).json({ message: "Username already taken" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });

    // si no tenés rol en DB, podés no pasarlo o setear 'user' fijo
    const payload = { id: user.id, username: user.username /*, rol: 'user'*/ };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ user: { id: user.id, username: user.username }, token });
  } catch (err) { next(err); }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;  // <- el front debe enviar esto
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user.id, username: user.username /*, rol: 'user'*/ };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ user: { id: user.id, username: user.username }, token });
  } catch (err) { next(err); }
};
