'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(
        models.User,{ 
          foreignKey: 'userId',
          onDelete: "CASCADE" 
        });
      Review.belongsTo(
        models.Spot,{ 
          foreignKey: 'spotId',
          onDelete: "CASCADE" 
        });

      Review.hasMany(
        models.ReviewImage,{ 
        foreignKey: 'reviewId', 
        onDelete: 'CASCADE',
        hooks: true 
      });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Spots',
        key: 'id',
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0, 1000]
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};