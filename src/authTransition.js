//page router container  路由
import { isWechat } from './constants'
import { getInfo, getTemplateData } from './actions/http'
import NProgress from 'nprogress'
export default (store) => (nextState, replace, callback) => {
    const { location } = nextState
    if (isWechat == false) {
        console.log(location.pathname)
        location.pathname != '/NotWeChat' && replace('/NotWeChat')
        callback();
        NProgress.done()
    }else if(location.pathname != '/404'){
            if(location.pathname == '/NotWeChat'){
                replace('/')
            }
            const honestId = store.getState()['honestId']
            const getTemplateDataById = async () => {
                const { Info: { drawModeId }} = store.getState()
                if (drawModeId) {
                    store.dispatch(getTemplateData({ drawModeId, callback: () => { 
                        callback();
                        NProgress.done()
                    } }))
                } else {
                    replace('/404')
                    callback();
                    NProgress.done()
                }
            }
            store.dispatch(getInfo({ honestId, callback: getTemplateDataById }))

    }
}