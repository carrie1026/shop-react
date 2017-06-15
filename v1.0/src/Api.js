import fetch from 'fetch'
import { SERVER_ADD } from './constants'
//默认的fetch 配置
const FETCH_DEFAULT_OPTIONS = {
    method: 'get',
    cache: 'no-cache',
    credentials: 'include',
    body : {},
    transformRequestBody: data => {
        return typeof data == 'object' ? JSON.stringify(data) : data
    }, // change RequestBody before fetch
    transformResponseBody: data => data // change ResponseBody after fetch, before reslove Fetch Promise
}
const FETCH_DEFAULT_HEADERS = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;",
        'Accept' : 'application/json, text/plain, */*'
    }

const getFetchArgs = (fetchUrl, options = {}) => {
    const headers = Object.assign({}, FETCH_DEFAULT_HEADERS, options.headers)
    const fetchOptions = Object.assign({}, FETCH_DEFAULT_OPTIONS, options, { headers });
    const { transformRequestBody, transformResponseBody } = fetchOptions

    fetchOptions.method = fetchOptions.method.toUpperCase()
    if (/HEAD|GET|DELETE/i.test(fetchOptions.method) == true) {
        // if (fetchOptions.cache == 'no-cache') {
        //     // get 请求增加随机数
        //     fetchOptions.body = Object.assign(fetchOptions.body || {}, { _: new Date().getTime() })
        // }

        //fetch 使用 body 发送数据，  如果是get，将body转到url参数
        const fetchParams = Object.keys(fetchOptions.body).length ? Object.entries(fetchOptions.body).map(v => v.join('=')).join('&') : ''
        fetchUrl += (fetchUrl.indexOf('?') == -1 ? '?' : '&') + fetchParams
        delete fetchOptions.body
    } else {
        //调用配置的 transformRequestBody 方法，更新 body 
        fetchOptions.body = transformRequestBody(fetchOptions.body)
    }
    // 添加 SERVER_ADD
    if (fetchUrl.search(/http:\/\/|https:\/\/|\/\/:/) == -1) {
        fetchUrl = SERVER_ADD + fetchUrl
    }

    return {
        fetchUrl,
        fetchOptions,
        transformResponseBody
    }
}
export default async (endpoint, options) => {
    const {
        fetchUrl,
        fetchOptions,
        transformResponseBody
    } = getFetchArgs(endpoint, options)
    let response
    try {
        response = await fetch(fetchUrl, fetchOptions);
    } catch (error) {
        response = {
            ok: false,
            error
        }
    }
    let res = {}
    if (response.json) {
        try {
            res = await response.json()
        }catch (error) {
            res = { error : 'json error' }
            // Reponse is not JSON or is EMPTY
        }
    }
    try {
        res = transformResponseBody(res)
    } catch (ex) {
        //
    }
    if (response.ok) {
        return { ok: response.ok, res }
    } else {
        return { ok: response.ok, res, fetchUrl, fetchOptions, status }
    }
}