import React from 'react'
import { Route, IndexRoute } from 'react-router'
import {
    App,
    NotFound,
    Design
} from './containers'

export default (store) => {
    return (
        <Route path="/" component={App}>
            <Route path="/design" component={Design} />
            <Route path="/notFount" component={NotFound} />
            <Route path="*" component={NotFound} />
        </Route>
    )
}

// <IndexRoute component={Design} />
// <Route path="/lottery" component={Lottery} />