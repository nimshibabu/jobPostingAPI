const { DataTypes } = require("sequelize");
const sequelize = require("./database"); 

const Company = sequelize.define("Company", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.TEXT
    },
    created_at:{
        type: DataTypes.DATE,
    },
    updated_at:{
        type: DataTypes.DATE,
    }
}, {

    tableName: "company"
});

module.exports = Company;
