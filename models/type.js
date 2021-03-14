"use strict";
module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define(
    "Type",
    {
      number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
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
      tableName: "Types"
    }
  );
  Type.associate = function(models) {
    Type.hasMany(models.Product, {
      as: "products",
      foreignKey: "typeId"
    });
    Type.hasMany(models.Naming, {
      as: "namings",
      foreignKey: "typeId"
    });
  };
  return Type;
};
