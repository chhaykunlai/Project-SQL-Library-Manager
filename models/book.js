'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null
    }
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};