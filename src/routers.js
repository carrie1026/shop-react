import React from 'react'
import { Route, IndexRoute } from 'react-router'
import {
    App,
    Search,
    NotFound
} from './containers'

export default (store) => {
    return (
        <Route path="/" component={App}>
            <Route path="/search" component={Search} />
            <Route path="/notFount" component={NotFound} />
            <Route path="*" component={NotFound} />
        </Route>
    )
}