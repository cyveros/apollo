import Sequelize from 'sequelize';
import SequelizeModel from '../../support/models/sequelize-model';

class User extends SequelizeModel
{
    getDefinition()
    {
        return {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING
            },
            salt: {
                type: Sequelize.STRING
            }
        };
    }

    getEntityName()
    {
        return 'user';
    }

    getOptions()
    {
        return {
            timestamps: true
        };
    }
}

export default User;