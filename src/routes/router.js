const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');
const bcryptService = require('../lib/brcypt');

const Meta = require("../lib/model/Meta");
const User = require("../lib/model/User");
const Screen = require("../lib/model/Screen");
const Editor = require("../lib/model/Editor");

var pjson = require('../../package.json');

router.use(cors());

router.get('/user', userMiddleware.isLoggedIn, (req, res, next) => {
  User.findOne({
    where: {
      id: req.userData.id
    }
  }).then(meta => {
    return res.status(201).send({
      meta
    });
  }).catch(err => {
    return res.status(404).send({
      error: err
    });
  })
});

router.get('/screen',userMiddleware.isLoggedIn, function(req, res, next) {
  Screen.findAll({
    include: [
      { 
        model: User,
        through: {
          model: Editor,
          attributes: ['role'],
          where: {
            UserId: req.userData.id
          }
        },
        required: true
      }
    ]
  }).then(screens => {
    return res.status(201).send({
      screens
    });
  }).catch(err => {
    return res.status(404).send({
      error: err
    })
  })
});

router.get('/screen/:id', userMiddleware.isLoggedIn, function(req, res, next) {
  Screen.findOne({
    where: {
      id: req.params.id
    },
    include: [
      { 
        model: User,
        through: {
          model: Editor,
          attributes: ['role'],
        },
        required: true
      }
    ]
  }).then(screen => {
    return res.status(201).send({
      screen
    });
  }).catch(err => {
    return res.status(404).send({
      error: err
    })
  })
});

router.post('/screen/:id',userMiddleware.isLoggedIn, function(req, res, next) {
  Screen.update(
      req.body.payload,
      {
        where: {
          id: req.params.id
        }
      }
    ).then((success) => {  
      Screen.findOne({
        where: {
          id: req.params.id
        },
        include: [
          { 
            model: User,
            through: {
              model: Editor,
              attributes: ['role'],
            },
            required: true
          }
        ]
      }).then(screen => {
        return res.status(201).send({
          screen
        });
      }).catch(err => {
        return res.status(404).send({
          error: err
        })
      })
  }).catch((err) => {
    return res.status(400).send({
      error: err
    })
  })  
});


router.put('/screen',userMiddleware.isLoggedIn, function(req, res, next) {
  User.findOne({where: {id: req.userData.id}}).then((user) => {
      Screen.create({
        title: req.body.payload.title
      }).then((screen) => {
        user.addScreen(screen, { through: { role: 'creator' }});
        return res.status(201).send({
          screen
        });
      }).catch(err => {
        return res.status(400).send({
          error: err
        })
      })
  }).catch((err) => {
    return res.status(400).send({
      error: err
    })
  })  
});



router.get('/screen/:id',userMiddleware.isLoggedIn, function(req, res, next) {
  Screen.findOne(
    {
      where: {
        id: req.params.id
      },
      include: [
        { 
          model: User,
          through: {
            model: Editor,
            attributes: ['role'],
            where: {
              UserId: req.userData.id
            }
          }
        }
      ]
    }).then(screen => {
    return res.status(201).send({
      screen
    });
  }).catch(err => {
    return res.status(404).send({
      error: err
    })
  })
});


router.delete('/screen/:id',userMiddleware.isLoggedIn, function(req, res, next) {
  Screen.destroy({
      where: {
        id: req.params.id
      },
    }).then(screen => {
    return res.status(201).send({
      screen
    });
  }).catch(err => {
    return res.status(404).send({
      error: err
    })
  })
});




router.get('/user', userMiddleware.isLoggedIn, (req, res, next) => {
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