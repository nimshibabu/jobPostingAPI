const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("sql12770109", "sql12770109", "qj3SBadInd", {
    host: "sql12.freesqldatabase.com",
    dialect: "mysql",
    logging: false
});

module.exports = sequelize;
