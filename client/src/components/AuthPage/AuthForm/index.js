import React, { Component } from "react";

import styles from './AuthForm.module.scss'

class AuthForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
            activePage: this.props.type || 'login',
            username: "",
            email: "",
            password: "",
            confPassword: ""
        }
        
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		
    }
    
    handleClick(event)
    {
        event.preventDefault()

        const {name} = event.target
        
        console.log("im here")
        if(name === "login" || name === "register")
        {
            this.setState({activePage: name})
        }        
    }

    handleChange(event)
    {
        const {name, value} = event.target
        this.setState({
            [name]: value
        }) 
    }

    handleSubmit(e)
    {
        e.preventDefault()

        if(this.state.activePage === "register" && this.state.password !== this.state.confPassword)
        {
            alert('The passwords does not match');
            return
        }

        fetch('/auth', {
            method: 'POST',
            body: JSON.stringify({
                action: this.state.activePage,
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,  
            }),
            headers: {
                'Content-Type': 'application/json'
            }
            })
            .then(async res => {
            if (res.status === 200) {
                console.log(await res.text())
                
            } else {
                const error = new Error(res.error);
                throw error;
            }
            })
            .catch(err => {
            console.error(err);
            alert('Error logging in please try again');
        });

        console.log("Ahoj");
    }

	render() {
		return (
        <>
            
            <form className={`${this.props.className.authForm} ${styles.authForm}`} onSubmit={this.handleSubmit}>
                <img src="https://murphytxstorage.com/wp-content/uploads/2015/10/placeholder-circle.png" className={styles.logo} alt="Logo"/>

                <label htmlFor="username">Username</label>
                <input 
                    type="text" 
                    value={this.state.username} 
                    id="username"
                    name="username" 
                    onChange={this.handleChange}
                />

                {this.state.activePage === 'register' && (
                    <>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            value={this.state.email} 
                            id="email"
                            name="email" 
                            onChange={this.handleChange}
                        />
                    </>
                )}

                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    value={this.state.password} 
                    id="password"
                    name="password" 
                    onChange={this.handleChange}
                />
                

                {this.state.activePage === 'register' && (
                    <>
                        <label htmlFor="conf-password">Confirm Password</label>
                        <input 
                            type="password" 
                            value={this.state.confPassword} 
                            id="connf-password"
                            name="confPassword" 
                            onChange={this.handleChange}
                        />
                    </> 
                )}
                

                {this.state.activePage !== 'register' && (
                    <button type="button" className={styles.link_button}>Forgot your password?</button>
                )}
                <button className={styles.submit_button}>{this.state.activePage === 'register' ? 'Register' : 'Login'}</button>

                {this.state.activePage !== 'register' ? (
                    <p>Need an account? <button type="button" className={styles.link_button} name="register" onClick={this.handleClick}>Register</button></p>
                ):
                (
                    <p>Already have an account? <button type="button" className={styles.link_button} name="login" onClick={this.handleClick}>Login</button></p>
                )}
            </form>
        </>
		);
	}
}

export default AuthForm;