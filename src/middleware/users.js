const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = {
    isLoggedIn: (req, res, next) => {      
        try {
          const token = req.headers.authorization;
          const decoded = jwt.verify(
            token,
            process.env.SECRETKEY
          );
          req.userData = decoded;
          next();
        } catch (err) {
          console.log(err);
          
          return res.status(401).send({
            error: 'Your session is not valid!'
          });
        }
    }       
}