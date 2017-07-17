const User = require('../models').User;
const Role = require('../models').Role;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcryptjs');
const secret = process.env.secret;

module.exports = {
  login(req, res) {
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
    if (!req.body.email) {
      return res.status(403).send({ // forbidden request
        message: 'Email is required',
      });
    } else if (!emailRegex.test(req.body.email)) {
      return res.status(403).send({ // forbidden request
        message: 'Incorrect email format',
      });
    } else if (!req.body.password) {
      return res.status(403).send({ // forbidden request
        message: 'Password is required',
      });
    }
    return User
      .findOne({
        where: {
          email: req.body.email
        }
      })
      .then((user) => {
        if (!user) {
          return res.status(401).send({
            message: 'Authentication failed. User not found.'
          });
        } else if (user) {
          bcrypt.compare(req.body.password, user.password, (err, confirm) => {
            if (err || confirm === false) {
              return res.status(401).send({
                message: 'Authentication failed. Wrong password.'
              });
            }
            const token = jwt.sign({
              userId: user.id,
              userRole: user.title
            },
            secret,
            {
              expiresIn: 1440 // expires in 24 hours
            });
            return res.status(200).send({
              success: true,
              message: 'Login successful!',
              token: token,
              userRole: user.title || 'undefined',
              userId: user.id
            });
          });
        }


      })
      .catch(error => res.status(400).send(error));
  },

  verifyLogin(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided. now'
      });
    }
  },

  roleAuthorise(req, res, next) {
    req.user = {};
    req.user.roles = [req.decoded.userRole];
    next();
  },

  roleUnauthorise(err, req, res, next) {
    res.status(err.status || 403);
    res.json({
      message: err.message
    });
  }
};