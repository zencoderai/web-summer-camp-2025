import { Pool } from 'pg';
// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'conference_db',
    user: process.env.DB_USER || 'conference_user',
    password: process.env.DB_PASSWORD || 'conference_pass',
};
// Create connection pool
const pool = new Pool(dbConfig);
// Test connection on startup
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});
pool.on('error', (err) => {
    console.error('Database connection error:', err);
});
export class DatabaseService {
    pool;
    constructor() {
        this.pool = pool;
    }
    async testConnection() {
        try {
            const client = await this.pool.connect();
            await client.query('SELECT 1');
            client.release();
            return true;
        }
        catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    }
    async getAllTalks() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT id, title, speaker_name, speaker_email, speaker_bio, 
               description, duration, level, track, created_at, updated_at
        FROM talks 
        ORDER BY created_at DESC
      `);
            return result.rows;
        }
        finally {
            client.release();
        }
    }
    async getTalksWithFilters(filters) {
        const client = await this.pool.connect();
        try {
            let query = `
        SELECT id, title, speaker_name, speaker_email, speaker_bio, 
               description, duration, level, track, created_at, updated_at
        FROM talks 
        WHERE 1=1
      `;
            const params = [];
            let paramIndex = 1;
            // Add filters
            if (filters.speaker_name) {
                query += ` AND LOWER(speaker_name) LIKE LOWER($${paramIndex})`;
                params.push(`%${filters.speaker_name}%`);
                paramIndex++;
            }
            if (filters.level) {
                query += ` AND LOWER(level) = LOWER($${paramIndex})`;
                params.push(filters.level);
                paramIndex++;
            }
            if (filters.track) {
                query += ` AND LOWER(track) LIKE LOWER($${paramIndex})`;
                params.push(`%${filters.track}%`);
                paramIndex++;
            }
            if (filters.duration) {
                query += ` AND duration = $${paramIndex}`;
                params.push(filters.duration);
                paramIndex++;
            }
            if (filters.min_duration) {
                query += ` AND duration >= $${paramIndex}`;
                params.push(filters.min_duration);
                paramIndex++;
            }
            if (filters.max_duration) {
                query += ` AND duration <= $${paramIndex}`;
                params.push(filters.max_duration);
                paramIndex++;
            }
            query += ` ORDER BY created_at DESC`;
            const result = await client.query(query, params);
            return result.rows;
        }
        finally {
            client.release();
        }
    }
    async searchTalksByTitle(searchTerm, exactMatch = false) {
        const client = await this.pool.connect();
        try {
            let query;
            let params;
            if (exactMatch) {
                query = `
          SELECT id, title, speaker_name, speaker_email, speaker_bio, 
                 description, duration, level, track, created_at, updated_at
          FROM talks 
          WHERE LOWER(title) = LOWER($1)
          ORDER BY created_at DESC
        `;
                params = [searchTerm];
            }
            else {
                query = `
          SELECT id, title, speaker_name, speaker_email, speaker_bio, 
                 description, duration, level, track, created_at, updated_at
          FROM talks 
          WHERE LOWER(title) LIKE LOWER($1)
          ORDER BY 
            CASE 
              WHEN LOWER(title) = LOWER($2) THEN 1
              WHEN LOWER(title) LIKE LOWER($3) THEN 2
              ELSE 3
            END,
            created_at DESC
        `;
                params = [
                    `%${searchTerm}%`, // For LIKE search
                    searchTerm, // For exact match ranking
                    `${searchTerm}%` // For starts-with ranking
                ];
            }
            const result = await client.query(query, params);
            return result.rows;
        }
        finally {
            client.release();
        }
    }
    async close() {
        await this.pool.end();
    }
}
export const dbService = new DatabaseService();
