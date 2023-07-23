const env = process.env;

const knex = require('knex')({
    client: 'postgresql',
    connection: {
        host : env.DB_HOST,
        port : env.DB_PORT,
        user : env.DB_USER,
        password : env.DB_PASSWORD,
        database : env.DB_NAME
    }
});


export default knex;