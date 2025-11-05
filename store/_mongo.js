const { MongoClient } = require('mongodb');

let cachedClient;

const buildMongoUrl = () => {
    if (process.env.MONGO_URI && process.env.MONGO_URI.trim().length > 0) {
        return process.env.MONGO_URI.trim();
    }

    const credentials = (process.env.MONGO_USER && process.env.MONGO_USER.trim().length > 0)
        ? `${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASS || '')}@`
        : '';

    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || '27017';
    return `mongodb://${credentials}${host}:${port}`;
};

const connect = async () => {
    if (!cachedClient) {
        const uri = buildMongoUrl();
        cachedClient = new MongoClient(uri, {
            serverSelectionTimeoutMS: Number(process.env.MONGO_TIMEOUT_MS || 5000)
        });
        await cachedClient.connect();
    }

    const databaseName = process.env.MONGO_DATABASE || 'prueba_node';
    return {
        client: cachedClient,
        db: cachedClient.db(databaseName)
    };
};

const disconnect = async () => {
    if (cachedClient) {
        await cachedClient.close();
        cachedClient = undefined;
    }
};


module.exports = {
    connect,
    disconnect
};