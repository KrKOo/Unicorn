import React, {Component} from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

class PrivateRoute extends Component {
	constructor() {
		super();
		this.state = {
            loading: true
        }    
    }
    
	componentDidMount() {
		axios.post('/auth/checkAuth')
        .then(async res => {
            console.log(await res);
            this.setState({
                isLogged: res.data.logged,
                loading: false
            });
            
        })
        .catch(err => {
            console.error(err);
        });
    }

	render() {
        const {component: Component, ...rest} = this.props;
        console.log("Render-logged: " + this.state.isLogged);
        console.log("Render-loading: " + this.state.loading);
		return (
            (!this.state.loading) &&
            <Route
                {...rest}
                render={(props) => this.state.isLogged === true
                    ? <Component {...props} />                    
                    : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
            />
            
        )
	}
}

export default PrivateRoute;