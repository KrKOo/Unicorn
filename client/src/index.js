import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Switch, Route, Link, BrowserRouter as Router} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import App from './components/App/App';
import AuthPage from './components/AuthPage/AuthPage';

const routing = (
    <Router>
        <Switch>            
            <PrivateRoute exact path="/" component={App} />
            <Route path="/login" component={AuthPage} />
        </Switch>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
