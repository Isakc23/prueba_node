const { createClient } = require('redis');

let cachedClient;

const connect = async () => {
    if (!cachedClient) {
        const urlFromEnv = process.env.REDIS_URL && process.env.REDIS_URL.trim().length > 0
            ? process.env.REDIS_URL.trim()
            : null;

        const host = process.env.REDIS_HOST || 'localhost';
        const port = process.env.REDIS_PORT || '6379';
        const password = process.env.REDIS_PASS || undefined;

        const url = urlFromEnv || `redis://${host}:${port}`;

        cachedClient = createClient({
            url,
            password
        });

        cachedClient.on('error', (err) => {
            console.error('Redis error:', err);
        });

        await cachedClient.connect();
    }

    return cachedClient;
};

module.exports = {
    connect
};