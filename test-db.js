const db = require("./models");
const { Model } = require("sequelize");

console.log("🔎 Verificando modelos...\n");

Object.entries(db).forEach(([name, model]) => {
  if (model?.prototype instanceof Model) {
    console.log(`✅ ${name} es un modelo Sequelize válido`);
  } else {
    console.log(`❌ ${name} NO es un modelo Sequelize válido`);
  }
});
