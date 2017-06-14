import { takeLatest, delay } from 'redux-saga'
import { put, call, fork, take, race } from 'redux-saga/effects'
import * as httpActions from '../actions/http'
import { api } from '../services'
import NProgress from 'nprogress'
const { cancelRequest, ...requests } = httpActions

/**
 * get the takeEvery callback
 * @param entity //created in http actions
 * @param { payload } //this.props.actions.getReddit(payload)
 */
const fetchEntity = function* (entity, { payload }) {
    // success failure 是成功活着失败的action. callback是ajax完成的回调函数
    const { fetchUrl, fetchOptions, success, failure, callback } = payload
    yield call(NProgress.start)
    const result = yield race({
        io: call(api.callApi, fetchUrl, fetchOptions),
        cancel: take(cancelRequest.toString()),
        timeout: call(delay, 30 * 1000)
    })

    let response = {}
    if (result.timeout) {
        //timeout
        response = { ok: false, res: { message: '请求服务器超时' } }
    } else if (result.cancel) {
        //cancel
        response = { ok: false, res: { message: '请求取消' } }
    } else {
        // fetch result
        response = result.io
    }
    yield call(NProgress.done)
    if (response.ok) {
        yield put(success({ payload: response.res, __fetchStatus: 'success' }))
    } else {
        // if (response.status === 401) {
        //     // 401 未登陆
        // }
        yield put(failure({ error: response.res,  __fetchStatus: 'failure' }))
    }
    if (callback) {
        yield call(callback, response.res, response.ok)
    }
}

/**
 * Reduce to only HTTP actions, then setup a watcher for each API.
 * Assumes all API names were added correctly to the 'requests' map.
 */
const forks = Object.entries(requests).map(([apiname, apifn]) => {
    const callback = fetchEntity.bind(null, requests[apiname]) // get the function
    return function* () {
        yield* takeLatest(apifn.toString(), callback)
    }
})
export default forks.map(fn => fork(fn))