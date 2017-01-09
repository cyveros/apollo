import Sequelize from 'sequelize';
import config from '../config';
import User from '../user/models/user.seq';

const db = new Sequelize(config.SQLDB, {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

db
  .authenticate()
  .then(() => {
    console.log('connection success');
  })
  .catch(err => {
    console.log('unable to conncet pg', err);
  });

export default db;