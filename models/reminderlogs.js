'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReminderLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReminderLogs.belongsTo(models.Reminder);
    }
  }
  ReminderLogs.init({
    reminder_id: DataTypes.INTEGER,
    mark_as_done_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ReminderLogs',
    tableName: 'ReminderLogs',
    underscored: true
  });
  return ReminderLogs;
};