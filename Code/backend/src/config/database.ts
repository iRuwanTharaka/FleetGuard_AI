/**
 * Company: KITH travels
 * Product: Fleet guard
 * Description: Database configuration and connection setup.
 */
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost:5432/fleetguard_db', {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    models: [User, Vehicle],
});

export default sequelize;
