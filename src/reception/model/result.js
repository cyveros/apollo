// reception/model/result.js
//
import Sequelize from 'sequelize';
import ModelFactory from './../../support/model-factory.js';

class Result
{
	constructor(db) {
		this.db = db;
	}

	exportModel(name, definition, option) {
		return this.db.define(name, definition, option);
	}

	name() {
		return 'result';
	}

	definition() {
		return {
	        id: {
	            type: Sequelize.INTEGER,
	            primaryKey: true,
	            autoIncrement: true
	        },
	        date: {
	            type: Sequelize.DATEONLY
	        },
	        hex: {
	            type: Sequelize.STRING
	        }
	    };
	}

	option() {
		return {
			timestamps: false
		};
	}
}

export default Result;