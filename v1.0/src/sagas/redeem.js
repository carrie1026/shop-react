import { takeLatest, delay } from 'redux-saga'
import { put, fork, select, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { startRedeem } from '../actions'
import { getIsAttention, getIsCompleteUserInfo, expiryApi } from '../actions/http'
import callApi from '../Api'

const register = function* () {
    const { payload: { fetchUrl, fetchOptions, success } } = getIsCompleteUserInfo({})
    const response = yield call(callApi, fetchUrl, fetchOptions)
    yield put(success({ payload: response.res || false }))
    return response.res
}

function* attention() {
    const { appId, openId } = yield select(state => state.Info)
    const { payload: { fetchUrl, fetchOptions, success } } = getIsAttention({ appId, openId })
    const response = yield call(callApi, fetchUrl, fetchOptions)
    yield put(success({ payload: response.res || false }))
    return response.res
}


function* redeemSaga() {
    yield* takeLatest(startRedeem.toString(), function* (action) {
        //查看这个模版是否是需要关注才能领奖的
        let isAttention = yield select(state => state.isAttention)
        //发送ajax查询是否关注过了
        if (isAttention != true) {
            isAttention = yield call(attention)
        }
        if (isAttention != true) {
            //查询回来还是false， 去关注页面
            yield put(push('/attention'))
        } else {
            let isCompleteUserInfo = yield select(state => state.isCompleteUserInfo)
            const { reward, callback, claimRewardWinnerIds } = action.payload
            const state = {
                claimRewardWinnerIds ,
                rewardName: reward.rN
            }
            if (isCompleteUserInfo != true) {
                isCompleteUserInfo = yield call(register)
            }
            if (isCompleteUserInfo != true) {
                yield put(push({ pathname: '/register', state }))
            } else {
                if (reward.couponAllotWay == 1 && reward.rTp == 15) {
                    yield put(push({
                        pathname: '/makeSureCoupons',
                        state
                    }))
                } else {
                    yield put(expiryApi({ claimRewardWinnerIds: [state.claimRewardWinnerIds[0]], callback }))
                }
            }
        }



        /**
         * {
                    "amount": 6.0000,
                    "cid": 11102,
                    "claimRewardWinnerId": 16048810,
                    "et": "2016-10-21 16:52",
                    "flowUnit": "M",
                    "hid": "J/3D+8HKNQ9H89:RH",
                    "ltp": 0,
                    "rN": "裂变6元红包",
                    "rOrigin": 5,
                    "rTp": 9,
                    "status": 5,
                    "wt": "2016-10-20 16:52"
                }
         */

        //yield put(expiryApi( action.payload ))
        //   if(isAttention == false){
        //         //如果没关注且模版设置必须关注才能领奖，那么跳转到关注的页面
        //     console.log('go attention')
        //       yield put(push('attention'))
        //   }else{
        //       //
        //   }

    })
}
//fork(attention)
export default fork(redeemSaga)