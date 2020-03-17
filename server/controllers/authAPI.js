var authController = require('./auth/auth');
// adminController = require('./admin');
var passportConfig = require('../config/passport');
var jwt = require('jsonwebtoken');

var apiCheckController = require('./apiCheck/apiCheck');
// const _ = require('lodash');

module.exports = function(
  app,
  express,
  wss,
  redisClient,
  scheduledJobsEventEmitter
) {
  var authAPIRouter = express.Router();

  /**
   * Auth API routes
   */
  authAPIRouter.post(
    '/login',
    // passportConfig.isAuthenticated(redisClient),
    // apiCheckController.validateRequest('createEvent'),
    (req, res, next) => {
      authController
        .logIn(req)
        .then(result => {
          res.json({
            success: result.success,
            message: result.message,
            token: result.token,
            user: result.user
          });
        })
        .catch(err => {
          res.json({
            success: false,
            message: 'Server error'
          });
        });
    }
  );
  authAPIRouter.get(
    '/logout',
    // passportConfig.isAuthenticated(redisClient),
    // apiCheckController.validateRequest('createEvent'),
    (req, res, next) => {
      authController
        .logOut(req)
        .then(result => {
          res.json({
            success: result.success,
            message: result.message
          });
        })
        .catch(err => {
          res.json({
            success: false,
            message: 'Server error'
          });
        });
    }
  );

  return authAPIRouter;
};
