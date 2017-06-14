import 'isomorphic-fetch'
import { SERVER_ADD } from '../constants'

// 默认的fetch配置
const FETCH_DEFAULT_OPTIONS = {
    method: 'get',
    cache: 'no-cache',
    credentials: 'include',
    body: {},
    transformRequestBody: data => {
        return typeof data == 'object' ? JSON.stringify(data) : data
    },// change RequestBody before fetch
    transformResponseBody: data => data // change ResponseBody after fetch, before resolve Fetch Promise
}
const FETCH_DEFAULT_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'Accept': 'application/json, text/plain, */*'
}

const getFetchArgs = (fetchUrl, options = {}) => {
    const headers = Object.assign({}, FETCH_DEFAULT_HEADERS, options.headers)
    const fetchOptions = Object.assign({}, FETCH_DEFAULT_OPTIONS, options, { headers })
    const { transformRequestBody, transformResponseBody } = fetchOptions

    fetchOptions.method = fetchOptions.method.toUpperCase()
    if (/HEAD|GET|DELETE/i.test(fetchOptions.method) === true) {
        // if (fetchOptions.cache === 'no-cache') {
        //     //get请求增加随机数
        //     fetchOptions.body = Object.assign(fetchOptions.body || {}, { _: new Date().getTime() })
        // }

        // fetch使用body发送数据, 如果是get, 将body转到url参数
        const fetchParams = Object.keys(fetchOptions.body).length ? Object.entries(fetchOptions.body).map(v => v.join('=')).join('&') : ''
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + fetchParams
        delete fetchOptions.body
    } else {
        // 调用配置的transformRequestBody方法,更新boddata
        fetchOptions.body = transformRequestBody(fetchOptions.body)
    }
    // 添加 SERVER_ADD
    if (fetchUrl.search(/http:\/\/|https:\/\/|\/\/:/) === -1) {
        fetchUrl = SERVER_ADD + fetchUrl
    }

    return {
        fetchUrl,
        fetchOptions,
        transformResponseBody
    }
}

// export default async (endpoint, options) => {
    export const callApi = async (endpoint, options) => {
    const {
        fetchUrl,
        fetchOptions,
        transformResponseBody
    } = getFetchArgs(endpoint, options)

    let response
    try {
        response = await fetch(fetchUrl, fetchOptions)
    } catch (error) {
        // fetch error
        response = {
            ok: false,
            error: error.message
        }
    }
    // json检查
    let res = {}
    if (response.json) {
        try {
            res = await response.json()
        } catch (error) {
            // Response is not JSON or is EMPTY
            res = { error : 'json error' }
        }
    }
    // transformResponseBody
    try {
        res = transformResponseBody(res)
    } catch (error) {
        res = { error : 'transformResponseBody error' }
    }
    // final return result.
    if (response.ok) {
        return { ok: response.ok, res }
    } else {
        return { ok: response.ok, res, fetchUrl, fetchOptions, status }
    }
}
