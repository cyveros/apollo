// support/db.js
//
import Sequelize from 'sequelize';
import config from '../config';

const db = new Sequelize(config.SQLDB, {
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

db.authenticate().catch(err => {
    console.log('unable to conncet pg', err);
});

export default db;