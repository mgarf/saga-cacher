var { DateTime } = require('luxon');
var effects = require('redux-saga/effects');

const getDataCache = (key, state) => { return state[key] }

function* takeEvery(event, worker, cache = false, cacheTime = 5) {
    if (cache) {
        yield tE(event, performCacheCheck.bind(null, event, cacheTime));
        yield tE(event + '_DATA', gatherData.bind(null, worker, event));
        yield tE(event + '_CLEAR_CACHE', clearCache.bind(null, event));
    } else {
        yield tE(event + '_RETRIEVED', getData.bind(null, worker, event));
    }
}

function* clearCache(event) {
    yield put({type: event + '_DATA'});
}

function* performCacheCheck(event, cacheTime, action) {
    let dataCache = yield select(getDataCache.bind(null, event));
    let addtionalMetadata = {};

    if (action.key) {
        dataCache = dataCache[action.key];
        addtionalMetadata[action.key] = action[action.key];
        addtionalMetadata['key'] = action.key;
    }

    if (!dataCache || dataCache.timestamp == null) {
        yield put({type: event + '_DATA', ...idObject});
    } else if ((dataCache.timestamp.diffNow('minutes') * -1) > cacheTime) {
        yield put({type: event + '_DATA', ...idObject});
    } else {
        yield put({ type: event + '_RETRIEVED', result: dataCache, ...idObject});
    }
}

function* gatherData(worker, event, action) {
    let params = [action];
    if (action.key) {
        params.push(action[action.key]);
    }

    const result = { 
        timestamp: DateTime.local(), 
        result: yield worker(...params)
    };


    let dataPusher;

    if (action.key) {
        let dataCache = yield select(getDataCache.bind(null, event));
        dataCache[action[action.key]] = result;
        dataPusher = dataCache;
    } else {
        dataPusher = result;
    }
    yield put({ type: event + '_RETRIEVED', result: dataPusher });
}

const cachingMiddleware = { ...effects, takeEvery };
module.exports = cachingMiddleware;