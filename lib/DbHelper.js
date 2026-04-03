const { Pool } = require('pg');

/**
 * DbHelper - Utility for database operations (PostgreSQL).
 */
class DbHelper {
    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
        });
    }

    /**
     * Executes a SQL query and returns the results.
     * @param {string} sql 
     * @param {array} params 
     */
    async query(sql, params = []) {
        const client = await this.pool.connect();
        try {
            console.log(`[DB] Executing query: ${sql}`);
            const res = await client.query(sql, params);
            return res.rows;
        } catch (err) {
            console.error(`[DB] Query Error:`, err.message);
            throw err;
        } finally {
            client.release();
        }
    }

    /**
     * Closes the database pool.
     */
    async close() {
        await this.pool.end();
    }
}

module.exports = DbHelper;
