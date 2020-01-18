const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const db = require("./src/lib/db.js");

const User = require("./src/lib/model/User");
const Meta = require("./src/lib/model/Meta");
const Screen = require("./src/lib/model/Screen");
const Editor = require("./src/lib/model/Editor");

db.sync()
User.sync().then(function() {
    User.findOrCreate({
      where: {
        username: 'admin'
      },
      defaults: {
        username: 'admin',
        password: 'keshiki'
      }
    })
  })

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

const router = require('./src/routes/router.js');
app.use((req, res, next) => {
    db.authenticate()
    .then(() => {
        next();
    })
    .catch(err => {
      console.error(`Unable to connect to the database: ${err.original.code}`);
      
      if (typeof err.original.sqlMessage !== 'undefined') {
        res.status(666).send({
            error: `${err.original.code}: ${err.original.sqlMessage}`
          });    
      }else{
        res.status(667).send({
            error: `${err.original.code}`
          });
      }
      
    });
});
app.use('/api', router);

//#region DOCUMENTARY
const swaggerDefinition = {
    info: {
        title: 'keshiki-server',
        version: '1.0.0',
        description: 'API for Keshiki',
    },
    host: 'localhost:3000',
    basePath: '/api/',
};
const options = {
    swaggerDefinition,
    apis: [path.resolve(__dirname, './src/routes/router.js')],
};
const swaggerSpec = swaggerJSDoc(options);
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'redoc.html'));
});

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
//#endregion DOCUMENTARY
  
// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));