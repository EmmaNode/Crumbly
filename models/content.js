'use strict';
module.exports = (sequelize, DataTypes) => {
  var content = sequelize.define('content', {
    restaurantname: DataTypes.STRING,
    restaurantId: DataTypes.STRING,
    restaurantimage: DataTypes.TEXT,
    opinion: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    entry: DataTypes.TEXT
  });
      content.associate = function(models) {
        // associations can be defined here
        models.content.belongsTo(models.user);
      };
  return content;
};
