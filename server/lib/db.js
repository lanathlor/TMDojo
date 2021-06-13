const { MongoClient, ObjectID } = require('mongodb');
require('dotenv').config();

const DB_NAME = 'dojo';

let db = null;

const initDB = () => {
    const mongoClient = new MongoClient(process.env.MONGO_URL, {
        useUnifiedTopology: true,
    });

    mongoClient.connect((err) => {
        if (err) {
            console.error('initDB: Could not connect to DB, shutting down');
            process.exit();
        }
        console.log('initDB: Connected successfully to DB');
        db = mongoClient.db(DB_NAME);
    });
};

const authenticateUser = (webId, login, name) => new Promise((resolve, reject) => {
    const users = db.collection('users');
    users
        .find({
            webId,
        })
        .toArray((err, docs) => {
            if (err) {
                reject(err);
            } else if (!docs.length) {
                users.insertOne({
                    webId,
                    playerLogin: login,
                    playerName: name,
                    last_active: Date.now(),
                });
                resolve();
            } else {
                const updatedUser = {
                    $set: {
                        playerLogin: login,
                        playerName: name,
                        last_active: Date.now(),
                    },
                };
                users.updateOne(
                    {
                        webId,
                    },
                    updatedUser,
                );
                resolve();
            }
        });
});

const getUniqueMapNames = (mapName) => new Promise((resolve, reject) => {
    const replays = db.collection('replays');
    const queryPipeline = [
        // populate map references to count occurrences
        {
            $lookup: {
                from: 'maps',
                localField: 'mapRef',
                foreignField: '_id',
                as: 'map',
            },
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$map', 0] }, '$$ROOT'] } },
        },
        {
            $group: {
                _id: '$mapUId',
                mapName: { $first: '$mapName' }, // pass the first instance of mapUId (since it'll always be the same)
                count: {
                    $sum: 1,
                },
                lastUpdate: { $max: '$date' }, // pass the highest date (i.e. latest replay's timestamp)
            },
        },
        {
            $project: {
                _id: false,
                mapUId: '$_id',
                mapName: true,
                count: '$count',
                lastUpdate: true,
            },
        },
    ];

    // only filter by name if there's valid input
    if (mapName && mapName !== '') {
        queryPipeline.push({
            $match: {
                mapName: { $regex: `.*${mapName}.*`, $options: 'i' },
            },
        });
    }
    replays.aggregate(queryPipeline, async (aggregateErr, cursor) => {
        if (aggregateErr) {
            return reject(aggregateErr);
        }
        try {
            const data = await cursor.toArray();
            return resolve(data);
        } catch (arrayErr) {
            return reject(arrayErr);
        }
    });
});

const getMapByUId = (mapUId) => new Promise((resolve, reject) => {
    const maps = db.collection('maps');
    maps.findOne({ mapUId }, (err, map) => {
        if (err) {
            return reject(err);
        }
        return resolve(map);
    });
});

const saveMap = (mapData) => new Promise((resolve) => {
    const maps = db.collection('maps');
    maps.insertOne(mapData).then((operation) => resolve({ _id: operation?.insertedId }));
});

const getUserByWebId = (webId) => new Promise((resolve, reject) => {
    const users = db.collection('users');
    users.findOne({ webId }, (err, user) => {
        if (err) {
            return reject(err);
        }
        return resolve(user);
    });
});

const saveUser = (userData) => new Promise((resolve) => {
    const users = db.collection('users');
    users.insertOne(userData).then((operation) => resolve({ _id: operation?.insertedId }));
});

const getReplays = (
    mapName, playerName, mapUId, raceFinished, orderBy, maxResults = '1000',
) => new Promise((resolve, reject) => {
    const replays = db.collection('replays');

    const pipeline = [
        // populate user references
        {
            $lookup: {
                from: 'users',
                localField: 'userRef',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$user', 0] }, '$$ROOT'] } },
        },
        // populate map references
        {
            $lookup: {
                from: 'maps',
                localField: 'mapRef',
                foreignField: '_id',
                as: 'map',
            },
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$map', 0] }, '$$ROOT'] } },
        },
    ];

    const addRegexFilter = (property, propertyName) => {
        if (property) {
            pipeline.push({
                $match: {
                    [propertyName]: {
                        $regex: `.*${property}.*`,
                        $options: 'i',
                    },
                },
            });
        }
    };

    // apply filters
    addRegexFilter(mapName, 'mapName');
    addRegexFilter(playerName, 'playerName');
    addRegexFilter(mapUId, 'mapUId');
    if (raceFinished) {
        pipeline.push({
            $match: {
                raceFinished: parseInt(raceFinished, 10),
            },
        });
    }

    if (orderBy) {
        const order = {};
        if (orderBy === 'Time Desc') {
            order.endRaceTime = -1;
        } else if (orderBy === 'Time Asc') {
            order.endRaceTime = 1;
        } else if (orderBy === 'Date Desc') {
            order.date = -1;
        } else if (orderBy === 'Date Asc') {
            order.date = 1;
        }
        pipeline.push({
            $sort: order,
        });
    }

    // add limit and clean up results
    pipeline.push({
        $limit: parseInt(maxResults, 10),
    });
    pipeline.push({
        $project: {
            userRef: 0, user: 0, mapRef: 0, map: 0, filePath: 0,
        },
    });

    replays.aggregate(pipeline, async (aggregateErr, cursor) => {
        if (aggregateErr) {
            return reject(aggregateErr);
        }
        try {
            const data = await cursor.toArray();
            return resolve({ files: data, totalResults: data.length });
        } catch (arrayErr) {
            return reject(arrayErr);
        }
    });
});

const getReplayById = (replayId, populate) => new Promise((resolve, reject) => {
    const replays = db.collection('replays');

    let pipeline = [
        {
            $match: { _id: ObjectID(replayId) },
        },
    ];

    if (populate) {
        pipeline = pipeline.concat([
            // populate user references
            {
                $lookup: {
                    from: 'users',
                    localField: 'userRef',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$user', 0] }, '$$ROOT'] } },
            },
            // populate map references
            {
                $lookup: {
                    from: 'maps',
                    localField: 'mapRef',
                    foreignField: '_id',
                    as: 'map',
                },
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$map', 0] }, '$$ROOT'] } },
            },
            // clean up
            {
                $project: {
                    // don't remove filePath since it's needed in the request
                    userRef: 0, user: 0, mapRef: 0, map: 0,
                },
            },
        ]);
    }

    replays.aggregate(pipeline, async (aggregateErr, cursor) => {
        if (aggregateErr) {
            return reject(aggregateErr);
        }
        try {
            const data = await cursor.toArray();
            return resolve(data[0]);
        } catch (arrayErr) {
            return reject(arrayErr);
        }
    });
});

const getReplayByFilePath = (filePath) => new Promise((resolve, reject) => {
    const replays = db.collection('replays');
    replays.findOne({ filePath }, (err, replay) => {
        if (err) {
            return reject(err);
        }
        return resolve(replay);
    });
});

const saveReplayMetadata = (metadata) => new Promise((resolve) => {
    const replays = db.collection('replays');
    replays.insertOne(metadata).then((operation) => resolve({ _id: operation?.insertedId }));
});

module.exports = {
    initDB,
    authenticateUser,
    saveReplayMetadata,
    getUniqueMapNames,
    getMapByUId,
    saveMap,
    getUserByWebId,
    saveUser,
    getReplays,
    getReplayById,
    getReplayByFilePath,
};
