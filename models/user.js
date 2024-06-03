'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Medication, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    salt: DataTypes.STRING,
    password: DataTypes.STRING,
    otp: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    profile_img_url: DataTypes.STRING,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    paranoid: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return User;
};