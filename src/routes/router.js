const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');
const bcryptService = require('../lib/brcypt');

const Meta = require("../lib/model/Meta");
const User = require("../lib/model/User");
var pjson = require('../../package.json');

router.post('/user', userMiddleware.isLoggedIn, (req, res, next) => {
  User.findOne({
    where: {
      id: req.userData.id
    }
  }).then(meta => {
    return res.status(201).send({
      meta
    });
  })
});


router.post('/ping', (req, res, next) => {
    Meta.findOne().then(meta => {
      return res.status(201).send({
        meta
      });
    })
});

router.post('/initial', (req, res, next) => {
  Meta.findOne().then(meta => {      
    if (meta == null) {
      bcrypt.hash(pjson.version, 10, (err, hash) => {
        Meta.create({ namespace: uuid.v4(), buildstate: hash }).then(meta => {
          return res.status(201).send({
            meta
          });
        });
      });
      
    }else{
      return res.status(201).send({
        meta
      });
    }
  })
});


/**
 * @swagger
 * /login:
 */

router.post('/login', (req, res, next) => {  
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(uObj => {      
    if (uObj != null) {
      if(bcryptService().comparePassword(req.body.password, uObj.password)){
        return res.status(201).send({
          token: jwt.sign({id: uObj.id, username: uObj.username}, process.env.SECRETKEY)
        });  
      }else{
        return res.status(400).send({
          error: 'Bad Credentials'
        });  
      }
    }else{
      return res.status(400).send({
        error: 'User not found'
      });
    }
  })
});

module.exports = router;