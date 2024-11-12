// models/customer.model.js
module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
        CustomerID: {
            type: DataTypes.STRING(4), // Match the data type
            primaryKey: true,          // Mark as primary key
            allowNull: true,          // auto-generated ID by trigger in mssql
        },
        CustomerName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        Gender: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        DateofBirth: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        PhoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        PackID: {
            type: DataTypes.STRING(3),
            allowNull: true,
        },
        StaffID: {
            type: DataTypes.STRING(4),
            allowNull: true,
        },
        Startdate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        DateRegister: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        Note: {
            type: DataTypes.TEXT, // Use TEXT for `nvarchar(max)`
            allowNull: true,
        },
        Date_Added: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        Date_Modified: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        Image: {
            type: DataTypes.STRING(255),
            allowNull: true,
        }
    }, {
        tableName: "Customers", // Ensure it matches the actual table name
        timestamps: false, // Disable automatic timestamps if not needed
    });

    return Customer;
};
