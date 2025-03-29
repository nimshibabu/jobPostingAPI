const { DataTypes } = require("sequelize");
const sequelize = require("./database"); 

const Job = sequelize.define("jobs", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    skills: {
        type: DataTypes.JSON,
        allowNull: false
    },
    appliedUsers: {
        type: DataTypes.JSON, 
        defaultValue: []
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
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "SET NULL"
    },
    contactNumber: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    resumes: {
        type: DataTypes.JSON, 
        defaultValue: []
    }
}, {
    timestamps: true 
});

module.exports = Job;
