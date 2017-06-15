import 'babel-polyfill'
// React imports
import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router';
// app specific imports
import routes from './routers'
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import { Root } from './containers'

import 'nprogress/nprogress.css'

// const store = configureStore()
// export const history = syncHistoryWithStore(browserHistory, store)


const initialState = window.__INITIAL_STATE__ || {};
const store = configureStore(initialState)
store.runSaga(rootSaga)

render(
    <Root
        store={store}
        history={hashHistory}
        routes={routes(store)} />,
    document.getElementById('root')
)