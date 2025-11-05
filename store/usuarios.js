const Usuario = require('../models/usuario');
const mysqlManager = require('./_mysql');
const mongoManager = require('./_mongo');
const redisManager = require('./_redis');

const USERS_CACHE_KEY = 'usuarios:all';
const USER_CACHE_KEY_PREFIX = 'usuarios:';

const mapProfile = (profileDoc) => {
    if (!profileDoc) {
        return null;
    }

    return {
        bio: profileDoc.bio || null,
        intereses: Array.isArray(profileDoc.intereses) ? profileDoc.intereses : [],
        ubicacion: profileDoc.ubicacion || null
    };
};

const buildUsuarioFromRow = (row, profileDoc) => new Usuario({
    id: row.id,
    username: row.username,
    email: row.email || null,
    createdAt: row.created_at || null,
    profile: mapProfile(profileDoc)
});

const saveToCache = async (key, value) => {
    try {
        const ttl = Number(process.env.REDIS_TTL || 60);
        const redis = await redisManager.connect();
        await redis.set(key, JSON.stringify(value), { EX: ttl });
    } catch (error) {
        console.warn('No se pudo guardar en cache', error);
    }
};

const getCachedUsuarios = async (key) => {
    try {
        const redis = await redisManager.connect();
        const cached = await redis.get(key);
        if (!cached) {
            return null;
        }
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
            return parsed.map((item) => new Usuario(item));
        }
        return new Usuario(parsed);
    } catch (error) {
        console.warn('No se pudo recuperar cache', error);
        return null;
    }
};

const getProfilesByUserIds = async (userIds) => {
    if (!userIds.length) {
        return new Map();
    }

    try {
        const { db } = await mongoManager.connect();
        const collection = db.collection('usuario_perfiles');
        const profiles = await collection
            .find({ usuarioId: { $in: userIds } })
            .toArray();

        const profileMap = new Map();
        profiles.forEach((profile) => {
            profileMap.set(profile.usuarioId, profile);
        });
        return profileMap;
    } catch (error) {
        console.warn('No se pudieron obtener perfiles desde MongoDB', error);
        return new Map();
    }
};

const getAll = async function () {
    const cached = await getCachedUsuarios(USERS_CACHE_KEY);
    if (cached) {
        return cached;
    }

    const db = await mysqlManager.connect();
    try {
        const [rows] = await db.query('SELECT id, username, email, created_at FROM usuarios ORDER BY id ASC');
        const userIds = rows.map((row) => row.id);
        const profileMap = await getProfilesByUserIds(userIds);

        const usuarios = rows.map((row) => buildUsuarioFromRow(row, profileMap.get(row.id)));
        await saveToCache(USERS_CACHE_KEY, usuarios.map((usuario) => usuario.toJSON()));
        return usuarios;
    } finally {
        await db.end();
    }
};

const getById = async (id) => {
    const cacheKey = `${USER_CACHE_KEY_PREFIX}${id}`;
    const cached = await getCachedUsuarios(cacheKey);
    if (cached) {
        return cached;
    }

try {
        const [rows] = await db.query('SELECT id, username, email, created_at FROM usuarios WHERE id = ?', [id]);
        if (!rows.length) {
            return null;
        }

        const row = rows[0];
        const profileMap = await getProfilesByUserIds([row.id]);
        const usuario = buildUsuarioFromRow(row, profileMap.get(row.id));

        await saveToCache(cacheKey, usuario.toJSON());
        try {
            const redis = await redisManager.connect();
            await redis.del(USERS_CACHE_KEY);
        } catch (error) {
            console.warn('No se pudo limpiar el cache general de usuarios', error);
        }

        return usuario;
    } finally {
        await db.end();
    }
};

module.exports = {
    getAll,
    getById
};