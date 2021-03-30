'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikeVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LikeVideo.belongsTo(models.Video);
    }
  };
  LikeVideo.init({
    chanelId: DataTypes.INTEGER,
    videoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LikeVideo',
  });
  return LikeVideo;
};