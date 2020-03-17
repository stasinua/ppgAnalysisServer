const ppgDataController = require('./ppgData/ppgData');
const userController = require('./user/user');

const passportConfig = require('../config/passport');
const jwt = require('jsonwebtoken');

const apiCheckController = require('./apiCheck/apiCheck');

const { savePPGToDatabase } = require('../ppgLoader');
// const _ = require('lodash');

// Router to provide better modularity for an application.
// Contains routes handled by ppg-signal-processing server.
// Every local-maintained functionality(managing videos, events, etc. ) must be placed there
module.exports = function(
  app,
  express
) {
  var internalAPIRouter = express.Router();
  // savePPGToDatabase();

  /**
   * Internal API routes
   */

   //Account and Profile section
   internalAPIRouter.post(
     '/account',
     function(req, res, next) {
       userController
         .getAccount(req)
         .then(function(result) {
           if (result.success) {
             res.json({
               success: result.success,
               message: result.message,
               user: result.user,
               token: result.token || ''
             });
           } else {
             res.json({ success: false, message: result.message });
           }
         })
         .catch(err => {
           res.json({
             success: false,
             message: 'Oops. Something went wrong. Please try again.'
           });
         });
     }
   );

  //PPG scans section
  internalAPIRouter.post(
    '/ppg',
    passportConfig.isAuthenticated(),
    function(req, res, next) {
      ppgDataController
        .createPPGScan(req)
        .then(function(result) {
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

  internalAPIRouter.get(
    '/ppg',
    passportConfig.isAuthenticated(),
    function(req, res, next) {
      ppgDataController
        .getAllPPGScans(req)
        .then(function(result) {
          res.json({
            success: result.success,
            message: result.message,
            ppgScans: result.ppgScans
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

  internalAPIRouter.get(
    '/users/:userId/ppg',
    passportConfig.isAuthenticated(),
    function(req, res, next) {
      ppgDataController
        .getUserPPGScans(req)
        .then(function(result) {
          console.log(result);
          res.json({
            success: result.success,
            message: result.message,
            scans: result.scans
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

  return internalAPIRouter;
};
