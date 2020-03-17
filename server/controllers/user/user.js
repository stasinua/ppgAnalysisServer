var User = require('../../models/User');
var authConfig = require('../../config/passport');
const { encrypt, decrypt } = require("../../config/encryption");

exports.getAccount = function(req) {
  return new Promise((resolve, reject) => {
    if (req.user) {
      User.findOne({ _id: req.user._id })
        .lean()
        .exec()
        .then(existingUser => {
          if (existingUser !== null) {
            var token = authConfig.encodeToken(existingUser);
            if (token.length > 0) {
              resolve({
                success: true,
                user: {
                  ...existingUser,
                  name: decrypt(existingUser.name),
                  uniqueIdentifier: decrypt(existingUser.uniqueIdentifier)
                },
                token: token
              });
            } else {
              resolve({
                success: false,
                message: 'Failed to generate user token'
              });
            }
          } else {
            resolve({ success: false, message: 'User not found.' });
          }
        })
        .catch(err => {
          reject(err);
        });
    } else {
      resolve({ success: false, message: 'Anonymous' });
    }
  });
};
