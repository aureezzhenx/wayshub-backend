'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chanel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chanel.belongsToMany(models.Chanel, {
        as:'subscribtion',
        foreignKey:'subscriberId',
        through:'Subscribes'
      });

      Chanel.belongsToMany(models.Chanel, {
        as:'subscribers',
        foreignKey:'chanelId',
        through:'Subscribes'
      });

      Chanel.hasMany(models.Video);
      Chanel.hasMany(models.Comment);
    }
  };
  Chanel.init({
    email: DataTypes.STRING,
    chanelName: DataTypes.STRING,
    description: DataTypes.TEXT,
    cover: DataTypes.TEXT,
    photo: DataTypes.TEXT,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chanel',
  });
  return Chanel;
};