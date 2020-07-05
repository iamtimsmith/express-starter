const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_URI);

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });
