const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
    const { content, media_type, media_url, external_id } = req.body;
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); 

        const messageQuery = `
            INSERT INTO messages (author_id, content) 
            VALUES ($1, $2) RETURNING id
        `;
        const messageResult = await client.query(messageQuery, [req.user.id, content]);
        const messageId = messageResult.rows[0].id;

        if (media_type) {
            const mediaQuery = `
                INSERT INTO media_attachments (message_id, media_type, media_url, external_id) 
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(mediaQuery, [messageId, media_type, media_url, external_id]);
        }

        await client.query('COMMIT'); 
        res.status(201).json({ msg: 'Pesan berhasil diposting!' });
    } catch (err) {
        await client.query('ROLLBACK'); 
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let queryText = '';
        let queryParams = [];

        if (search) {
            queryText = `
                SELECT m.id, m.content, m.created_at, u.username, 
                       a.media_type, a.media_url, a.external_id
                FROM messages m
                JOIN users u ON m.author_id = u.id
                LEFT JOIN media_attachments a ON m.id = a.message_id
                WHERE m.search_vector @@ plainto_tsquery('english', $1)
                ORDER BY m.created_at DESC
            `;
            queryParams = [search];
        } else {
            queryText = `
                SELECT m.id, m.content, m.created_at, u.username, 
                       a.media_type, a.media_url, a.external_id
                FROM messages m
                JOIN users u ON m.author_id = u.id
                LEFT JOIN media_attachments a ON m.id = a.message_id
                ORDER BY m.created_at DESC
            `;
        }

        const result = await pool.query(queryText, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;