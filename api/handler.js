'use strict';

module.exports.hello = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  callback(null, {
    message: 'ok',
  });
};
