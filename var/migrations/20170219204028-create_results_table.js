'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('results', { id: Sequelize.INTEGER, date: Sequelize.DATEONLY, hex: Sequelize.STRING });
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.dropTable('results');
  
  }
};
