"use strict";
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    "Location",
    {
      number: {
        type: DataTypes.INTEGER,
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
      tableName: "Locations"
    }
  );
  Location.associate = function(models) {
    Location.hasMany(models.Product, {
      as: "products",
      foreignKey: "locationId"
    });
  };
  return Location;
};
