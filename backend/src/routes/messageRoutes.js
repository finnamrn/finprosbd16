const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { redisClient } = require('../config/redis');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
   // buat redis
    const userId = req.user.id
    const redisKey = `message_limit:${userId}`

    const currentCount = await redisClient.get(redisKey)

    if (currentCount && parseInt(currentCount) >= 5) {
        return res.status(429).json({
            error: 'Terlalu banyak submit. Tunggu 1 menit.'
        })
    }

    if (!currentCount) {
        await redisClient.set(redisKey, 1, {
            EX: 60
        })
    } else {
        await redisClient.incr(redisKey)
    }


    const { content, media_type, media_url, external_id, recipient_name } = req.body;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // insert message
        const messageResult = await client.query(
            `
            INSERT INTO messages (author_id, content, recipient_name)
            VALUES ($1, $2, $3)
            RETURNING id
            `,
            [
                req.user.id,
                content,
                recipient_name
            ]
        );

        const messageId = messageResult.rows[0].id;


        if (media_type && messageId) {
            await client.query(
                `
                INSERT INTO media_attachments 
                (message_id, media_type, media_url, external_id)
                VALUES ($1, $2, $3, $4)
                `,
                [
                    messageId,
                    media_type,
                    media_url,
                    external_id
                ]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            msg: "Pesan berhasil diposting"
        });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({
            error: err.message
        });
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
                SELECT m.id, 
                    m.content, 
                    m.created_at, 
                    m.recipient_name,
                    u.username,
                    a.media_type, 
                    a.media_url, 
                    a.external_id
                FROM messages m
                JOIN users u ON m.author_id = u.id
                LEFT JOIN media_attachments a ON m.id = a.message_id
                WHERE m.search_vector @@ plainto_tsquery('english', $1)
                ORDER BY m.created_at DESC
            `;
            queryParams = [search];
        } else {
            queryText = `
                SELECT m.id, 
                    m.content, 
                    m.created_at, 
                    m.recipient_name,
                    u.username,
                    a.media_type, 
                    a.media_url, 
                    a.external_id
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

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                m.id,
                m.content,
                m.created_at,
                m.recipient_name,
                u.username,
                a.media_type,
                a.media_url,
                a.external_id
            FROM messages m
            LEFT JOIN users u ON m.author_id = u.id
            LEFT JOIN media_attachments a ON m.id = a.message_id
            WHERE m.id::text = $1
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: "Message not found" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;