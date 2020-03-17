// load up the user model
// var User = require('../models/User');

// load the auth variables
// var configAuth = require('./auth');

var _ = require('lodash');
var jwt = require('jsonwebtoken');

exports.encodeToken = function(data) {
  var token = '';
  if (data && data._id.toString().length > 0) {
    token = jwt.sign(
      { data: { _id: data._id.toString() } },
      process.env.PPG_SECRET,
      {
        expiresIn: '10d'
      }
    );
  }

  return token;
};

// /**
//  * Login Required middleware.
//  */
exports.isAuthenticated = redisClient => {
  return (req, res, next) => {
    var token = req.get('x-auth-token');
    if (token && token !== 'null') {
      if (process.env.NODE_ENV !== 'production') {
        jwt.verify(token, process.env.PPG_SECRET, function(err, decoded) {
          if (err) {
            console.log('error auth', err);
            req.user = null;
            res.sendStatus(401);
          } else {
            console.log('success auth');
            req.user = decoded.data;
            return next();
          }
        });
      } else {
        redisClient.get(token, function(error, result) {
          if (error) {
            console.log(error);
            throw error;
          } else {
            console.log('Redis GET blacklisted token ->', result);
            if (result) {
              req.user = null;
              res.sendStatus(401);
            } else {
              jwt.verify(token, process.env.PPG_SECRET, function(err, decoded) {
                if (err) {
                  console.log('error auth', err);
                  req.user = null;
                  res.sendStatus(401);
                } else {
                  console.log('success auth');
                  req.user = decoded.data;
                  return next();
                }
              });
            }
          }
        });
      }
    } else {
      console.log('empty token error');
      req.user = null;
      res.sendStatus(401);
    }
  };
};

exports.serializeUser = function(req, res, next) {
  var token = req.get('x-auth-token');
  if (token && token !== 'null') {
    jwt.verify(req.get('x-auth-token'), process.env.PPG_SECRET, function(
      err,
      decoded
    ) {
      if (err) {
        req.user = null;
        return next();
      } else {
        req.user = decoded.data;
        return next();
      }
    });
  } else {
    req.user = null;
    return next();
  }
};
