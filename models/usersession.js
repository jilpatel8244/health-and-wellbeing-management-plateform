'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserSession.belongsTo(models.User);
    }
  }
  UserSession.init({
    user_id: DataTypes.INTEGER,
    device: DataTypes.STRING,
    logout_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserSession',
    tableName: 'UserSessions',
    underscored: true
  });
  return UserSession;
};