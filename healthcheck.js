#!/usr/bin/env node

const mysqlManager = require('../store/_mysql');
const mongoManager = require('../store/_mongo');
const redisManager = require('../store/_redis');

const formatResult = ({ name, ok, message }) => {
    const status = ok ? '✔️  OK' : '❌  ERROR';
    const detail = message ? ` - ${message}` : '';
    return `${status} ${name}${detail}`;
};

const checkMysql = async () => {
    let connection;
    try {
        connection = await mysqlManager.connect();
        await connection.query('SELECT 1');
        return { name: 'MySQL', ok: true, message: 'Conexión y consulta básicas exitosas' };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

const checkMongo = async () => {
    let context;
    try {
        context = await mongoManager.connect();
        await context.db.command({ ping: 1 });
        return { name: 'MongoDB', ok: true, message: 'Ping exitoso' };
    } finally {
        if (context) {
            await mongoManager.disconnect();
        }
    }
};

const checkRedis = async () => {
    let client;
    try {
        client = await redisManager.connect();
        const pong = await client.ping();
        return { name: 'Redis', ok: true, message: `Respuesta: ${pong}` };
    } finally {
        if (client) {
            await redisManager.disconnect();
        }
    }
};

const runChecks = async () => {
    const checks = [
        { name: 'MySQL', runner: checkMysql },
        { name: 'MongoDB', runner: checkMongo },
        { name: 'Redis', runner: checkRedis }
    ];
    const results = [];
    let hasError = false;

    for (const { name, runner } of checks) {
        try {
            const result = await runner();
            results.push(result);
        } catch (error) {
            hasError = true;
            results.push({
                name,
                ok: false,
                message: error.message || String(error)
            });
        }
    }

    results.forEach((result) => {
        console.log(formatResult(result));
        if (result.ok && result.extra) {
            console.log(result.extra);
        }
    });

    if (hasError) {
        process.exitCode = 1;
    }
};

runChecks().catch((error) => {
    console.error('Error inesperado durante el healthcheck:', error);
    process.exitCode = 1;
});