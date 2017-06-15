import { takeLatest, delay } from 'redux-saga'
import { put, fork } from 'redux-saga/effects'
import { updatePopupInfo } from '../actions'

function* errorInfo() {
  yield* takeLatest(updatePopupInfo.toString(), function* (action){
    const { visible , delayTime } = action.payload
    if( visible === true ){
      yield delay(delayTime || 2000)
      yield put(updatePopupInfo({ visible : false }))
    }
  })
}
export default fork(errorInfo)