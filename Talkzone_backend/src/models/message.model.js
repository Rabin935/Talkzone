const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/db'); 

const Message = sequelize.define('message', {
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true, 
  tableName: 'message',
 
});

module.exports = Message;