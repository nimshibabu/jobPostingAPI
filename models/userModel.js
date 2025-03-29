const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./database"); 

const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    role:{
        type:DataTypes.STRING(50)
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    skills: {
        type: DataTypes.JSON, 
    },
    highestDegree: {
        type: DataTypes.STRING(100),
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "companies",
            key: "id"
        },
        onDelete: "CASCADE"
    },
});

module.exports = User;
