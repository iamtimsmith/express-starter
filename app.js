const express = require('express');
const app = express();

require('dotenv').config({path: './variables.env'});
require('./config/database');
require('./config/middlewares')(app);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
