var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

const mainLogger = require('./logger');

function encrypt(text) {
  console.log(process.env.PPG_SECRET, text);
  var cipher = crypto.createCipher('aes192', process.env.PPG_SECRET);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher('aes192', process.env.PPG_SECRET);

  function isHexadecimal(str) {
    var regexp = /^[0-9a-fA-F]+$/;
    console.log('IS HEX', regexp.test(str));
    return regexp.test(str);
  }

  if (isHexadecimal(text)) {
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  } else {
    return null;
  }
}

function hashPassword(password) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        mainLogger.error(err.message + ' stack: ' + err.stack);
        reject(err);
      } else {
        bcrypt.hash(password, salt, null, (err, hash) => {
          if (err) {
            mainLogger.error(err.message + ' stack: ' + err.stack);
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
}

module.exports = {
  hashPassword: hashPassword,
  encrypt: encrypt,
  decrypt: decrypt
};
