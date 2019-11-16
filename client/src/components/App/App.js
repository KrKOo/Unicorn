import React, { Component } from "react";
//import axios from 'axios';
import openSocket from 'socket.io-client';

import styles from './App.module.scss'

import Chat from '../Chat/Chat'
import Map from '../Map/Map'
import RoomList from '../RoomList/RoomList'
import ServerList from '../ServerList/ServerList'
import FriendList from '../FriendList/FriendList'
import SideBar from '../SideBar/SideBar'
import SideBarCategory from '../SideBar/SideBarCategory'
import { Resizable } from "re-resizable";


class App extends Component {

	constructor() {
		super();
		this.state = {
			chatWidth: 100
		}
		this.sideBar = React.createRef();
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

	onSideBarToggle = (state) => 
	{
		console.log(this.sideBar.current.offsetWidth)
		//const chatWidth = (state ? windows.innerWidth : )
		//this.setState({chatWidth: chatWidth});
		
	}


	

	render() {
		return (
			<div className={styles.App}>
				<SideBar className={styles.SideBar} toggle="false">
					<SideBarCategory title="Server">
						<ServerList className={styles.ServerList}/>
						<RoomList className={styles.RoomList}/>
					</SideBarCategory>
					<SideBarCategory title="Friends">
						<FriendList className={styles.FriendList}/>
					</SideBarCategory>
				</SideBar>

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