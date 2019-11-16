import React, { Component } from "react";

import AuthForm from './AuthForm/AuthForm'
import styles from './AuthPage.module.scss'

class AuthPage extends Component {

	constructor() {
		super();
		this.state = {
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		
    }

    handleChange()
    {

    }
    
    handleSubmit()
    {

    }

	render() {
		return (
            <div className={styles.container}>
                <AuthForm className={styles} history={this.props.history}/>
            </div>
        )
	}
}

export default AuthPage;