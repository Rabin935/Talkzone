const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/db'); 

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 30],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, undefined],
    },
  },
  profilePic: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'created_at', 
  updatedAt: 'updated_at', 
  tableName: 'User',
});

module.exports = User;