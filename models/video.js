'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Video.belongsTo(models.Chanel, {
        as:'chanel'
      });

      Video.hasMany(models.Comment, {
        as:'comments'
      });

      Video.hasMany(models.LikeVideo);
    }
  };
  Video.init({
    chanelId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    thumbnail: DataTypes.TEXT,
    description: DataTypes.TEXT,
    video: DataTypes.TEXT,
    viewCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};