import { createAction } from 'redux-actions'
export const cancelRequest = createAction('cancelRequest')
export const removeFetchResult = createAction('cancelRequest')

//抽奖接口
export const wechatGetCodeCallBackForLottery = createAction('wechatGetCodeCallBackForLottery', ({honestId, openId, rLF, callback}) => {
    return {
        fetchUrl: `mapi/v2/common/scan/wechatGetCodeCallBackForLottery`,
        fetchOptions: {
            method: 'post',
            body: { honestId, openId, rLF }
        },
        success: createAction(`${wechatGetCodeCallBackForLottery}.success`),
        failure: createAction(`${wechatGetCodeCallBackForLottery}.failure`),
        callback
    }
})

export const getInfo = createAction('getInfo', ({honestId, callback}) => {
    return {
        fetchUrl: `mapi/v2/common/scan/info`,
        fetchOptions: {
            method: 'get',
            body: { honestId }
        },
        success: createAction(`${getInfo}.success`),
        failure: createAction(`${getInfo}.failure`),
        callback
    }
})
export const getTemplateData = createAction('getTemplateData', ({drawModeId, callback}) => {
    return {
        fetchUrl: `api/v1/template/custom/drawModes/${drawModeId}`,
        fetchOptions: {
            transformResponseBody(data) {
                const pages = {}
                data && data.pages && data.pages.map(v => {
                    pages[v.type] = v
                })
                data.pages = pages
                return data
            }
        },
        success: createAction(`${getTemplateData}.success`),
        failure: createAction(`${getTemplateData}.failure`),
        callback
    }
})

//查询是否已经关注了公共号
export const getIsAttention = createAction('getIsAttention', ({appId, openId, callback}) => {
    return {
        fetchUrl: `mapi/v2/we/isAttention`,
        fetchOptions: {
            method: 'get',
            body: { appId, openId }
        },
        success: createAction(`${getIsAttention}.success`),
        failure: createAction(`${getIsAttention}.failure`),
        callback
    }
})

//是否完善了个人信息 
export const getIsCompleteUserInfo = createAction('getIsCompleteUserInfo', ({ callback }) => {
    return {
        fetchUrl: `mapi/v2/complete/isCompleteUserInfoV2`,
        fetchOptions: {
            method: 'get'
        },
        success: createAction(`${getIsCompleteUserInfo}.success`),
        failure: createAction(`${getIsCompleteUserInfo}.failure`),
        callback
    }
})

//完善了个人信息 
export const setUserInfo = createAction('setUserInfo', ({ gender, phone, vCode, callback }) => {
    return {
        fetchUrl: `mapi/v2/complete/userInfo`,
        fetchOptions: {
            method: 'post',
            body: {
                gender, phone, vCode
            }
        },
        success: createAction(`${setUserInfo}.success`),
        failure: createAction(`${setUserInfo}.failure`),
        callback
    }
})

//获取vCode
export const getVcode = createAction('getVcode', ({phoneNum, supplier, callback }) => {
    return {
        fetchUrl: `mapi/v2/vcode/get`,
        fetchOptions: {
            method: 'post',
            body: `phoneNum=${phoneNum}&supplier=${supplier || 2}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        },
        success: createAction(`${getVcode}.success`),
        failure: createAction(`${getVcode}.failure`),
        callback
    }
})

//获取中奖纪录
export const getLotteryRecord = createAction('getLotteryRecord', ({pSize, now, rewardTypes, winnerOrigins, callback }) => {
    return {
        fetchUrl: `mapi/v2/prizeAndIntegral/lotteryRecord`,
        fetchOptions: {
            method: 'post',
            body: {
                pSize,
                now,
                rewardTypes,
                winnerOrigins
            }
        },
        success: createAction(`${getLotteryRecord}.success`),
        failure: createAction(`${getLotteryRecord}.failure`),
        callback
    }
})

export const expiryApi = createAction('expiryApi', ({ claimRewardWinnerIds, callback }) => {
    return {
        fetchUrl: `mapi/v2/expiry/expiryApi`,
        fetchOptions: {
            method: 'post',
            body: {
                claimRewardWinnerIds
            }
        },
        success: createAction(`${expiryApi}.success`),
        failure: createAction(`${expiryApi}.failure`),
        callback
    }
}) 