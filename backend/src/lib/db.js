const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Talkzone_db', 'postgres', 'admin123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connection successful.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };