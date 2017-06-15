import { createAction } from 'redux-actions'

export const startWechatAuth = createAction('startWechatAuth')

export const updateBgAudioPlayStatus = createAction('updateBgAudioPlayStatus')

export const updatePopupInfo = createAction('updateBgAudioPlayStatus')

export const setVcodeCountDown = createAction('setVcodeCountDown')

export const updateRegisterForm = createAction('updateRegisterForm')

//清空中奖历史，使得分页能够从头开始
export const clearLotteryRecord = createAction('clearLotteryRecord')

//兑奖的action， 调用后会开启 redeem saga流程来判断设置是否关注 是否注册 以及兑奖 流程
export const startRedeem = createAction('startRedeem')