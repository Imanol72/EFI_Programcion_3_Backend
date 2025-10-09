module.exports = {
  development: {
    username: 'root',
    password: 'root1234',
    database: 'efi_db',
    host: '127.0.0.1',
    dialect: "mysql",
    port: process.env.PORT || 3306,
  }
};
