var authConfig = require('../../config/passport');
var User = require('../../models/User');
const { encrypt, decrypt } = require("../../config/encryption");

exports.logIn = req => {
  return new Promise((resolve, reject) => {
    User.findOne({
      name: encrypt(req.body.name.toLowerCase()),
      uniqueIdentifier: encrypt(req.body.uniqueIdentifier.toLowerCase())
      // age: req.body.age,
      // biologicalSex: req.body.biologicalSex
    }).lean().exec().then(user => {
      var token = authConfig.encodeToken(user);
      if (token.length > 0) {
        resolve({
          success: true,
          message: 'Welcome!',
          token: token,
          user: {
            ...user,
            name: decrypt(user.name),
            uniqueIdentifier: decrypt(user.uniqueIdentifier)
          }
        });
      } else {
        console.log(req.body);
        resolve({
          success: false,
          message: 'Failed to generate user token'
        });
      }
    }).catch(err => {
      reject(err);
    });
  });
};
