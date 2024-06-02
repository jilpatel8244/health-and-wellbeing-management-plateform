'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Medication.hasMany(models.Reminder, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Medication.belongsTo(models.User);
    }
  }
  Medication.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    picture_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Medication',
    paranoid: true,
    underscored: true
  });
  return Medication;
};