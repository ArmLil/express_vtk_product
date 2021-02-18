"use strict";
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define(
    "Note",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: DataTypes.TEXT
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "Notes"
    }
  );
  Note.associate = function(models) {
    Note.hasMany(models.Product, {
      as: "products",
      foreignKey: "noteId"
    });
  };
  return Note;
};
