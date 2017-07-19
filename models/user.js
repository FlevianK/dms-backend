'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      required: true,
    },
    firstName: {
      type: DataTypes.STRING,
      required: true,
    },
    lastName: {
      type: DataTypes.STRING,
      required: true,
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email  must be valid',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      required: true,
    },
    title: {
      type: DataTypes.STRING,
      required: true,
      default: 'regular',
    },
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        User.belongsTo(models.Role, {
          foreignKey: 'title',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return User;
};
