import React, { Component } from "react";
//import axios from 'axios';
import openSocket from 'socket.io-client';

import styles from './App.module.scss'

import Chat from '../Chat/Chat'
import Map from '../Map/Map'
import RoomList from '../RoomList/RoomList'
import ServerList from '../ServerList/ServerList'
import FriendList from '../FriendList/FriendList'


class App extends Component {

	constructor() {
		super();
		this.state = {
		}

		this.socket = openSocket('http://localhost:9000');
		this.socket.on('connect', function() {
			console.log('check', this.socket);
		});
	}
	componentDidMount() {
		// fetch("/users").then(async (res) => {
		// 	const text = await res.text()
		// 	console.log(text);
		// })
	}

	render() {
		return (
			<div className={styles.App}>
				<div className={styles.leftSidebar}>
					<ServerList className={styles.ServerList}/>
					<RoomList className={styles.RoomList}/>
				</div>

				<div className={styles.rightSidebar}>
					<FriendList className={styles.FirendList}/>
				</div>

				<div className={styles.middleBar}>
					<div className={styles.mapContainer}>
						<Map className={styles.Map} id="Map" socket={this.socket}/>
					</div>
					
					<div className={styles.chatContainer}>
						<Chat className={styles.Chat} id={styles.privateChat} socket={this.socket} />
						<Chat className={styles.Chat} id={styles.publicChat} socket={this.socket} />
					</div>
				</div>
				
			</div>
		);
	}
}

export default App;