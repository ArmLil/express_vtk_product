"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      namingId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      decimalNumberId: {
        type: DataTypes.INTEGER
      },
      bookingDate: DataTypes.STRING,
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      serialNumber: DataTypes.STRING,
      noteId: {
        type: DataTypes.INTEGER
      },
      employeeId: {
        type: DataTypes.INTEGER
      },
      description: DataTypes.TEXT
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "Products"
    }
  );
  Product.associate = function(models) {
    Product.belongsTo(models.DecimalNumber, {
      as: "decimalNumber",
      targetKey: "id",
      foreignKey: "decimalNumberId"
    });
    Product.belongsTo(models.Naming, {
      as: "name",
      targetKey: "id",
      foreignKey: "namingId"
    });
    Product.belongsTo(models.Location, {
      as: "location",
      targetKey: "id",
      foreignKey: "locationId"
    });
    Product.belongsTo(models.Note, {
      as: "note",
      targetKey: "id",
      foreignKey: "noteId"
    });
    Product.belongsTo(models.Type, {
      as: "type",
      targetKey: "id",
      foreignKey: "typeId"
    });
    Product.belongsTo(models.Employee, {
      as: "employee",
      targetKey: "id",
      foreignKey: "employeeId"
    });
  };
  return Product;
};
