import React from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Routers from './routers';
import configureStore from './configureStore';

import injectTapEventPlugin from "react-tap-event-plugin";
import NProgress from 'nprogress'


NProgress.configure({ showSpinner: false });
NProgress.start();

injectTapEventPlugin();

const initialState = window.__initialState__ || {};

// const store = configureStore(initialState);
// const history = syncHistoryWithStore(hashHistory, store)

/** 
history.listen(location => {
    //绑定当URL发生变化所执行的事情
    //注意，在action中，如果,引入 LOCATION_CHANGE 的action.type，来判断页面变化
    //console.log(location)

});
*/
/*render(
    <Provider store={store}>
        <Router history={history} routes={Routers(store)} />
    </Provider>,
    document.getElementById('root')
)*/
