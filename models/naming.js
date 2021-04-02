"use strict";
module.exports = (sequelize, DataTypes) => {
  const Naming = sequelize.define(
    "Naming",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      decimalNumber: {
        type: DataTypes.STRING
      },
      typeId: {
        type: DataTypes.INTEGER
      },
      note: DataTypes.TEXT
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "Namings"
    }
  );
  Naming.associate = function(models) {
    Naming.hasMany(models.Product, {
      as: "products",
      foreignKey: "namingId"
    });
    Naming.belongsTo(models.Type, {
      as: "type",
      targetKey: "id",
      foreignKey: "typeId"
    });
  };
  return Naming;
};
