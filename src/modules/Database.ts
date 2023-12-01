
/**
 *
 * simple module to handle creating a db pool that can be reused for each other module
 *
 */
import { Pool } from "pg";
console.log(process.env.DB_USER );
export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    max: 5,
});

