const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.PORT,
        dialect: dbConfig.dialect,
        dialectOptions: {
            ...dbConfig.dialectOptions,
            options: {
                ...dbConfig.dialectOptions.options,
                useUTC: false,
                dateFirst: 1,
            },
            typeCast: function (field, next) {
                if (field.type === 'DATETIME') {
                    return field.string();
                }
                return next();
            }
        },
        timezone: '+07:00', // Set your timezone
        pool: dbConfig.pool,
        logging: console.log
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Customers = require("../models/customer.model")(sequelize, DataTypes);

module.exports = db;

