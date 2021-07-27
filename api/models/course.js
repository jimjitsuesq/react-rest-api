'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {};
  Course.init({
    title: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a Value for Title',
        },
        notEmpty: {
          msg: 'Please provide a Value for Title',
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a Value for Description',
        },
        notEmpty: {
          msg: 'Please provide a Value for Description',
        }
      }
    },
    estimatedTime: {
        type: DataTypes.STRING
    },
    materialsNeeded: {
        type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Course',
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
        foreignKey: {
            fieldName: 'userId'
        },
    });
  };

  return Course;
};