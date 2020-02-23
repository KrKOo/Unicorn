import React, { Component } from "react";
import axios from 'axios';

import styles from './AuthForm.module.scss'

class AuthForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
            activePage: this.props.type || 'login',
            username: '',
            email: '',
            password: '',
            confPassword: '',
            error: ''
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

        if(this.state.activePage === "register")
        {
            this.setState({error: ''});
            if(this.state.password !== this.state.confPassword)
            {
                this.setState({error: 'The passwords does not match'})
                return;
            }

            const data = {
                username: this.state.username,
                password: this.state.password,
                email: this.state.email
            }

            axios.post('/auth/register', data, {headers: {'Content-Type': 'application/json'}})
            .then(async res => {

                console.log('GOOD', await res);
                if(res.data.error)
                {
                    console.log(res.data.error);
                    this.setState({error: res.data.error.errno});
                }
            })
            .catch(err => {
                console.error(err);
            });
        }

        if(this.state.activePage === "login")
        {
            const data = {
                username: this.state.username,
                password: this.state.password,
            }

            axios.post('/auth/login', data, {headers: {'Content-Type': 'application/json'}})
            .then(async res => {
                console.log('GOOD', await res);
                
                if(res.data.error)
                {
                    this.setState({error: res.data.error.errno});
                }
                else
                {
                    console.log("redirecting to /")
                    this.props.history.push("/");
                }
            })
            .catch(err => {
                console.error(err);
            });
            
        }
    
    }

	render() {
		return (
        <>            
            <form className={`${this.props.className.authForm} ${styles.authForm}`} onSubmit={this.handleSubmit}>
                <img src="https://murphytxstorage.com/wp-content/uploads/2015/10/placeholder-circle.png" className={styles.logo} alt="Logo"/>
                {this.state.error && <p className={styles.error}>{this.state.error}</p>}
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