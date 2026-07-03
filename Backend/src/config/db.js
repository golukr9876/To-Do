import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// 1. Strict Validation Check
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error(`\x1b[31m[CRITICAL ERROR] Missing or misspelled database environment variables: ${missingVars.join(', ')}\x1b[0m`);
    // Force the Node.js application process to crash immediately
    process.exit(1); 
}

// 2. Safely Instantiate the Pool with Correct Variables
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

pool.on('error', (error) => {
    console.error("Something went wrong at the database side:", error);
});

const connectDB = async () => {
    // Proactive connection testing using a lightweight query
    try {
        await pool.query("SELECT 1"); 
        console.log("Database connection established successfully.");
    } catch (error) {
        console.error("Database initial connection test failed:", error.message);
        process.exit(1);
    }
}

export { connectDB, pool };