'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reminder.belongsTo(models.Medication);
    }
  }
  Reminder.init({
    type: DataTypes.ENUM('oneTime', 'daily', 'weekly'),
    one_time_date: DataTypes.DATEONLY,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    time: DataTypes.TIME,
    day_of_week: DataTypes.ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'),
    medication_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reminder',
    paranoid: true,
    underscored: true
  });
  return Reminder;
};