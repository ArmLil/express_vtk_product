"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      namingId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      decimalNumber: {
        type: DataTypes.STRING
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
      note: {
        type: DataTypes.STRING
      },
      employeeId: {
        type: DataTypes.INTEGER
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "Products"
    }
  );
  Product.associate = function(models) {
    Product.belongsTo(models.Naming, {
      as: "naming",
      targetKey: "id",
      foreignKey: "namingId"
    });
    Product.belongsTo(models.Location, {
      as: "location",
      targetKey: "id",
      foreignKey: "locationId"
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
