"use strict";
module.exports = (sequelize, DataTypes) => {
  const DecimalNumber = sequelize.define(
    "DecimalNumber",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      note: DataTypes.TEXT
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "DecimalNumbers"
    }
  );
  DecimalNumber.associate = function(models) {
    DecimalNumber.hasMany(models.Product, {
      as: "products",
      foreignKey: "decimalNumberId"
    });
  };
  return DecimalNumber;
};
