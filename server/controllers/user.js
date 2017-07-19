const User = require('../models').User;
const InputValidate = require('./inputValidate');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(8);

module.exports = {
  create(req, res) {
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
    if (InputValidate.validateInput(req.body)) {
      return res.status(403).send({ // forbidden request
        message: 'Fill all fields',
      });
    } else if (!emailRegex.test(req.body.email)) {
      return res.status(403).send({ // forbidden request
        message: 'Incorrect email format',
      });
    } else if (!(req.body.password).match(passwordRegex)) {
      return res.status(403).send({ // forbidden request
        message: 'Password must be atleast six characters with a digit, special symbols, lowercase and uppercase characters',
      });
    }
    return User
      .create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
      })
      .then(() => res.status(201).send({
        message: 'Registered successfully',
      }))
      .catch(error => res.status(409).send({
        message: 'Email exist',
      }));
  },

  listUsers(req, res) {
    if (req.query.limit || req.query.offset) {
      return User
        .findAll({
          offset: req.query.offset,
          limit: req.query.limit,
          attributes: { exclude: ['password'] }
        })
        .then(user => {
          if (!user || user.length < 1) {
            return res.status(404).send({
              message: 'User Not Found',
            });
          }
          return res.status(200).send(user);
        })
        .catch(error => res.status(400).send(error));
    }
    return User
      .findAll()
      .then(users => res.status(200).send(users))
  },

  retrieve(req, res) {
    return User
      .findById(
        req.params.userId)
      .then(user => {
        if (!user || user.length < 1) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    if (req.params.userId == 1) {
      return res.status(401).send({ // forbidden request
        message: 'Can not update main admin',
      });
    }
    return User
      .findById(req.params.userId)
      .then(user => {
        if (!user || user.length < 1) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({
            username: req.body.username || user.username,
            firstName: req.body.firstName || user.firstName,
            lastName: req.body.lastName || user.lastName,
            email: req.body.email || user.email,
            password: req.body.password || user.password,
            title: req.body.title || user.title,
          })
          .then(() => res.status(200).send({
            message: 'Updated successfully'
          }))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  destroy(req, res) {
    if (req.params.userId == 1) {
      return res.status(401).send({
        message: 'Can not delete main admin',
      });
    }
    return User
      .findById(req.params.userId)
      .then(user => {
        if (!user || user.length < 1) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .destroy()
          .then(() => res.status(204).send());
      })
      .catch(error => res.status(400).send(error));
  },

  searchUser(req, res) {
    if (req.query.q) {
      if (req.query.limit || req.query.offset) {
        return User
          .findAll({
            offset: req.query.offset,
            limit: req.query.limit,
            where: {
              $or: [
                { firstName: { $iLike: `%${req.query.q}%` } },
                { lastName: { $iLike: `%${req.query.q}%` } },
                { email: { $iLike: `%${req.query.q}%` } },
                { title: { $iLike: `%${req.query.q}%` } },
              ]
            }
          })
          .then(user => {
            if (!user || user.length < 1) {
              return res.status(404).send({
                message: 'User Not Found',
              });
            }
            return res.status(200).send(user);
          })
          .catch(error => res.status(400).send(error));
      }
      return User
        .findAll({
          where: {
            $or: [
              { firstName: { $iLike: `%${req.query.q}%` } },
              { lastName: { $iLike: `%${req.query.q}%` } },
              { email: { $iLike: `%${req.query.q}%` } },
              { title: { $iLike: `%${req.query.q}%` } },
            ]
          }
        })
        .then(user => {
          if (!user || user.length < 1) {
            return res.status(404).send({
              message: 'User Not Found',
            });
          }
          return res.status(200).send(user);
        });
    }
  }
};
