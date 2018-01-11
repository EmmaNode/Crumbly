'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
        allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 32], //password length requirements
          msg: 'Password must be between 6 and 32 characters long'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function(pendingUser, options){
        if(pendingUser && pendingUser.password){ //is this user not null and is the passwork not null string
          var hash = bcrypt.hashSync(pendingUser.password, 10); //10 salt rounds is the default
          pendingUser.password = hash; //reassigning password value of the object we are about to create || Changing the value of the password, the original string is overroad and done
        }
      }
    },
  });
    user.associate = function(models) {
      // associations can be defined here
      models.user.hasMany(models.content);
    };


user.prototype.isValidPassword = function(passwordTyped){
  return bcrypt.compareSync(passwordTyped, this.password); //compares typed password to password stored in database that matches usernam
}

//this function deletes the password visiblity from user so it is not visivly posted anywhere
user.prototype.toJSON = function(){
  var user = this.get();
  delete user.password;
  return user;
}


  return user;
};
