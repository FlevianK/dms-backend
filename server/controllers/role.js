const Role = require('../models').Role;
const InputValidate = require('./inputValidate');

module.exports = {
  create(req, res) {
    if (InputValidate.validateInput(req.body)) {
      return res.status(403).json({ // forbidden request
        message: 'Can not create null role',
      });
    }
    return Role
      .create({
        title: req.body.title,
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
    if (req.params.roleId == 'admin') {
      return res.status(401).send({
        message: 'Can not delete admin role',
      });
    } else if (req.params.roleId == 'regular') {
      return res.status(401).send({
        message: 'Can not delete default role',
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
  }

};
