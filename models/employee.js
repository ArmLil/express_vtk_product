"use strict";
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      secondName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fatherName: {
        type: DataTypes.STRING
      },
      note: DataTypes.TEXT
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "Employees"
    }
  );
  Employee.associate = function(models) {
    Employee.hasMany(models.Product, {
      as: "products",
      foreignKey: "employeeId"
    });
  };
  return Employee;
};
