'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('User', 'profilePic', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust based on your needs
      defaultValue: '', // Optional: set a default value
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('User', 'profilePic');
  },
};