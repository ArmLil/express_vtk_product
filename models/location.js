"use strict";
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    "Location",
    {
      name: DataTypes.STRING,
      number: DataTypes.INTEGER
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "Locations"
    }
  );
  Location.associate = function(models) {
    // associations can be defined here
  };
  return Location;
};
