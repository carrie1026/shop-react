import React from 'react'
import { Route, IndexRoute } from 'react-router';
import authTransition from './authTransition'
//page router container  路由
import App from './containers/App'
import Home from './containers/Home'
import Rule from './containers/Rule'
import EnterLottery from './containers/EnterLottery'
import RewardLog from './containers/RewardLog'
import Attention from './containers/Attention'
import Register from './containers/Register'
import RegisterSuccess from './containers/RegisterSuccess'
import GetSuccess from './containers/GetSuccess'

import NotWeChat from './containers/NotWeChat'
import NotFound from './containers/NotFound'

export default (store) => {
    return (
        <Route path="/" component={App} onEnter={authTransition(store)}>
            <IndexRoute component={Home} />
            <Route path="/rule" component={Rule} />
            <Route path="/enterLottery" component={EnterLottery} />
            <Route path="/rewardLog" component={RewardLog} />
            <Route path="/attention" component={Attention} />
            <Route path="/register" component={Register} />
            <Route path="/registerSuccess" component={RegisterSuccess} />
            <Route path="/getSuccess" component={GetSuccess} />

            <Route path="/NotWeChat" component={NotWeChat} NotRandeElements={true} />
            <Route name="NotFound" path="*" component={NotFound} NotRandeElements={true} />
        </Route>
    )
}