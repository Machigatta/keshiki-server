const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

const Meta = require("../lib/model/Meta");
var pjson = require('../../package.json');

/**
 * @swagger
 * /sign-up:
 */

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
  
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

});


  /**
 * @swagger
 * /secret:
 */

router.get('/secret', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('Secret');
});


module.exports = router;