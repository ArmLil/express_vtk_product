"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      namingId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Namings", // name of Target model
          key: "id" // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      decimalNumber: {
        type: Sequelize.STRING
      },
      bookingDate: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      locationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Locations", // name of Target model
          key: "id" // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      typeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Types", // name of Target model
          key: "id" // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      serialNumber: {
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      employeeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Employees", // name of Target model
          key: "id" // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Products");
  }
};
