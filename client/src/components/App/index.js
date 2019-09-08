import React, { Component } from "react";
//import axios from 'axios';
import openSocket from 'socket.io-client';

import './App.scss'

import Chat from '../Chat'

class App extends Component {

	constructor() {
		super();
		this.state = {
		}

		this.socket = openSocket('http://localhost:8000');
	}
	componentDidMount() {
		fetch("/users").then(async (res) => {
			const text = await res.text()
			console.log(text);
		})
	}

	render() {
		return (
			<div>
				<Chat socket={this.socket} />
			</div>
		);
	}
}

export default App;