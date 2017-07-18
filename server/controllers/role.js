const Role = require('../models').Role;
const InputValidate = require('./inputValidate');

module.exports = {
  create(req, res) {
    if (InputValidate.validateInput(req.body)) {
      return res.status(403).json({ // forbidden request
        message: 'Fill all fields',
      });
    }
    return Role
      .create({
        title: req.body.title,
        description: req.body.description
      })
      .then(() => res.status(201).send({
        message: 'Created successful',
      }))
      .catch(error => res.status(400).send({
        message: 'Role not create since it already exist',
      }));
  },

  list(req, res) {
    if (req.query.limit || req.query.offset) {
      return Role
        .findAll({
          offset: req.query.offset,
          limit: req.query.limit,
        })
        .then(role => {
          if (!role || role.length < 1) {
            return res.status(404).send({
              message: 'Role Not Found',
            });
          }
          return res.status(200).send(role);
        })
        .catch(error => res.status(400).send(error));
    }
    return Role
      .findAll()
      .then(role => res.status(200).send(role))
      .catch(error => res.status(400).send(error));
  },

  destroy(req, res) {
    if (req.params.roleId == 1) {
      return res.status(401).send({
        message: 'Can not delete default role admin',
      });
    } else if (req.params.roleId == 2) {
      return res.status(401).send({
        message: 'Can not delete default role regualr',
      });
    }
    return Role
      .findById(req.params.roleId)
      .then(role => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return role
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },

  searchRole(req, res) {
    if (req.query.q) {
      if (req.query.limit || req.query.offset) {
        return Role
          .findAll({
            offset: req.query.offset,
            limit: req.query.limit,
            where: {
              $or: [
                { title: { $iLike: `%${req.query.q}%` } },
                { description: { $iLike: `%${req.query.q}%`}}
              ]
            }
          })
          .then(role => {
            if (!role || role.length < 1) {
              return res.status(404).send({
                message: 'Role Not Found',
              });
            }
            return res.status(200).send(role);
          })
          .catch(error => res.status(400).send(error));
      }
      return Role
        .findAll({
          where: {
            $or: [
              { title: { $iLike: `%${req.query.q}%` } },
              { description: { $iLike: `%${req.query.q}%`}}
            ]
          }
        })
        .then(role => {
          if (!role || role.length < 1) {
            return res.status(404).send({
              message: 'Role Not Found',
            });
          }
          return res.status(200).send(role);
        })
        .catch(error => res.status(400).send(error));
    }
  },
  retrieve(req, res) {
    return Role
      .findById(req.params.roleId)
      .then(role => {
        if (!role || role.length < 1) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return res.status(200).send(role);
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    if (req.params.roleId == 1) {
      return res.status(401).send({ // forbidden request
        message: 'Can not update default role admin',
      });
    } else if(req.params.roleId == 2) {
      return res.status(401).send({ // forbidden request
        message: 'Can not update default role regular',
      });
    }
    return Role
      .findById(req.params.roleId)
      .then(role => {
        if (!role || role.length < 1) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return role
          .update({
            title: req.body.title || role.title,
            description: req.body.description || role.description,
          })
          .then(() => res.status(200).send({
            message: 'Updated successfully'
          }))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

};
