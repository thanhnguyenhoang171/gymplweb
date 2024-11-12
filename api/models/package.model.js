module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define("Package", {
        PackID: {
            type: DataTypes.STRING(3),
            primaryKey: true,
            allowNNull: false
        },
        PackName: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        PackPrice: {
            type: DataTypes.DECIMAL(12, 0),
            allowNNull: true,
        }
    }, {
        tableName: "Package",
        timestamps: false,
    });

    return Package;
}