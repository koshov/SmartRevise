'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes

  app.post('/api/users/data', users.setData);
  app.get('/api/users/data', users.getData);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);
  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);


  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
