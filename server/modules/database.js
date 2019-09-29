const mysql = require( 'mysql' );
require('dotenv').config()

export default class Database {
    constructor(config)
    {
        this.db = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }
        
        this.pool = mysql.createPool(this.db)

        console.log(this.db)
    }

    query(sql, args)
    {
        return new Promise((resolve, reject) => {
            const query = mysql.format(sql, args);

            this.pool.query(query, (err, rows) => {
                if(err)
                    return reject(err);

                resolve(rows);
            })
        });
    }
}