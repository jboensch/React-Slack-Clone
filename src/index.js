import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import registerServiceWorker from './registerServiceWorker';
import firebase from "./firebase";

import 'semantic-ui-css/semantic.min.css';

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser } from './actions';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
    //if we did mount
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            //see if we have an authenticated user
            if (user) {
                //console.log(user);
                this.props.setUser(user);
                //if so, redirect into root of site using withRouter
                this.props.history.push("/");
            }
        })
    }
    render() {
        return (
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>
        );
    }
}

//used to ensure we are authenticated
const RootWithAuth = withRouter(connect(null, { setUser })(Root));

//to be able to access the global state we are creating in const store, we need to wrap our Router in Provider
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
