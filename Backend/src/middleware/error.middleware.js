// src/middleware/error.middleware.js
import ApiError from "../utils/ApiError.js";
import logger from "../config/logger.js";
import { v2 as cloudinary } from "cloudinary";

const errorHandler = (err, req, res, next) => {
    let error = err;

    const networkErrorCodes = ['ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN'];
        
    if (networkErrorCodes.includes(error.code) || error.message?.toLowerCase().includes('network')) {
        throw new ApiError(503, "Network error: Unable to reach Cloudinary. Please check your internet connection.");
    }


    // 1. Map Raw PostgreSQL Database Codes to Clean Operational ApiErrors
    if (error.code && typeof error.code === 'string') {
        
        switch (error.code) {
            case '23505': // Unique Violation
                // Use error.detail safely to find out which field clashed, but sanitize the message
                const field = error.detail?.match(/\((.*?)\)/)?.[1] || "field";
                error = new ApiError(409, `An account with this ${field} already exists.`);
                break;
                
            case '23503': // Foreign Key Violation
                error = new ApiError(400, "Reference integrity validation failed. Linked record does not exist.");
                break;
                
            case '23502': // Not Null Violation
                error = new ApiError(400, `Missing required attribute payload: ${error.column}`);
                break;
                
            case '22P02': // Invalid Text Representation / Casting Error
                error = new ApiError(400, "Data format structural mismatch. Check database types.");
                break;
                
            default:
                // Programmatic or unexpected DB issue (e.g., 42P01 Undefined Table)
                error = new ApiError(500, "A database execution error occurred internally.");
                error.isOperational = false; // Flag to let developers know it's a structural code bug
                break;
        }
    }

    // 2. Fallback check for unhandled primitive exceptions
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong internally.";
        error = new ApiError(statusCode, message, [], err.stack);
        error.isOperational = false;
    }

    // 3. Centralized Production Telemetry Logging
    // Log complete stack traces securely inside server logs, away from client eyes
    if (error.statusCode >= 500 || !error.isOperational) {
        logger.error({ 
            msg: err.message, 
            stack: err.stack, 
            pgCode: err.code,
            path: req.originalUrl 
        }, "CRITICAL_SYSTEM_ERROR");
    } else {
        logger.warn({ 
            msg: error.message, 
            path: req.originalUrl 
        }, "APP_OPERATIONAL_WARNING");
    }

    // 4. Uniform JSON Footprint for Frontend Frameworks
    res.status(error.statusCode).json({
        success: error.success,
        message: error.message,
        errors: error.errors,
        // Send stack trace detail ONLY when running locally in development mode
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

export { errorHandler };
