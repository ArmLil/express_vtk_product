"use strict";
module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define(
    "Type",
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
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "Types"
    }
  );
  Type.associate = function(models) {
    // associations can be defined here
  };
  return Type;
};
