const rolesController = require('../controllers').roles;
const usersController = require('../controllers').users;
const documentsController = require('../controllers').documents;
const authenticatesController = require('../controllers').authenticates;

const restbac = require('rest-bac');
const roleConfig = require('../config/roles.json');

module.exports = (app) => {
  app.post('/api/users/login', authenticatesController.login);
  app.post('/api/users/', usersController.create);

  app.use(authenticatesController.verifyLogin);
  
  app.post('/api/documents/', documentsController.create);
  app.get('/api/documents/', documentsController.listDocs);
  app.get('/api/documents/:documentId', documentsController.retrieve);
  app.put('/api/documents/:documentId', documentsController.update);
  app.get('/api/users/:userId/documents/', documentsController.userDocs);
  app.get('/api/roles/documents/', documentsController.roleDocs);
  app.delete('/api/documents/:documentId', documentsController.destroy);
  app.get('/api/search/documents/', documentsController.searchDoc);


  app.put('/api/users/:userId', usersController.update);
  app.get('/api/users/:userId', usersController.retrieve);

  app.use(authenticatesController.roleAuthorise);

  restbac(app, roleConfig, "/api");

  app.post('/api/roles/', rolesController.create);
  app.get('/api/roles/', rolesController.list);
  app.get('/api/roles/:roleId', rolesController.retrieve);
  app.put('/api/roles/:roleId', rolesController.update);
  app.delete('/api/roles/:roleId', rolesController.destroy);
  app.get('/api/search/roles/', rolesController.searchRole);

  app.get('/api/users/', usersController.listUsers);
  app.delete('/api/users/:userId', usersController.destroy);
  app.get('/api/search/users/', usersController.searchUser);

  app.use(authenticatesController.roleUnauthorise);

};
