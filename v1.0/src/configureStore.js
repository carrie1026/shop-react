import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import sagas from './sagas'
import { ENV } from './constants'
//applyMiddleware来自redux可以包装 store 的 dispatch
const router = routerMiddleware(hashHistory) //使用 hash router
const sagaMiddleware = createSagaMiddleware()


const configureStore = (preloadedState) => {
    const store = createStore(
        rootReducer,
        preloadedState,
        compose(
            applyMiddleware(sagaMiddleware, router),
            ENV == 'dev' && window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    )
    if (ENV == 'dev' && module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextReducer = require('./reducers')
            store.replaceReducer(nextReducer)
        })
    }
    sagaMiddleware.run(sagas)
    return store
}
export default configureStore