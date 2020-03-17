let Ajv = require('ajv');
let ajv = Ajv({ allErrors: true, removeAdditional: 'all' });

//Include schemas

//User-related API schemas
ajv.addSchema(require('../auth/apiSchemas/logIn'), 'logIn');

//PPG scan related API schemas
ajv.addSchema(
  require('../ppgData/apiSchemas/createPPGScan'),
  'createPPGScan'
);

// Describe handlers for request validation
function errorResponse(schemaErrors) {
  console.log(schemaErrors);
  let errors = schemaErrors.map(error => {
    return error.dataPath + ' ' + error.message;
  });
  return {
    success: false,
    message: errors.join('; ')
  };
}

exports.validateRequest = (schemaName, requestPath) => {
  return (req, res, next) => {
    let valid = ajv.validate(schemaName, {
      params: req.params || {},
      body: req.body || {},
      query: req.query || {}
    });
    if (!valid) {
      // if (process.env.NODE_ENV === 'production') {
      //   return res.json({
      //     success: false,
      //     message: 'Invalid query parameters'
      //   });
      // } else {
        return res.json(errorResponse(ajv.errors));
      // }
    }
    next();
  };
};
