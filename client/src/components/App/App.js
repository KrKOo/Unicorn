import React, { Component } from "react";
//import axios from 'axios';
import openSocket from 'socket.io-client';

import styles from './App.module.scss';

import Chat from '../Chat/Chat';
import Map from '../Map/Map';
import RoomList from '../RoomList/RoomList';
import ServerList from '../ServerList/ServerList';
import FriendList from '../FriendList/FriendList';
import SideBar from '../SideBar/SideBar';
import SideBarCategory from '../SideBar/SideBarCategory';
import UserInfo from '../UserInfo/UserInfo';
import RoomCreateDialog from '../RoomCreateDialog/RoomCreateDialog';
import AlertBox from '../AlertBox/AlertBox';
import { Resizable } from "re-resizable";


class App extends Component {

	constructor() {
		super();
		this.state = {
			chatWidth: 100,
			mapID: 1,
			roomID: null,
			isEditMode: false,
			showUserInfo: false,
			showCreateRoomDialog: false,
			alertText: ''
		}
		this.sideBar = React.createRef();
		this.socket = openSocket('http://localhost:9000');
		this.socket.on('connect', function() {
			console.log("Connected to the server");
		});
		this.socket.emit('joinMap', this.state.mapID);
	}
	componentDidMount() {

	}

	onSideBarToggle = (state) => 
	{
		console.log(this.sideBar.current.offsetWidth)		
	}

	changeMap = (mapID) =>
	{
		this.socket.emit('leaveMap', this.state.mapID);
		
		if(mapID !== undefined)
		{		
			console.log("athadfuaduuadfgu");
			this.setState({mapID: mapID});
			this.socket.emit('joinMap', mapID);
		}		
	}
	
	mapModeChange = () => 
	{
		this.setState((prevState) => 
		{	
			let alertText = '';
			if(!prevState.isEditMode)
			{
				alertText = 'Edit Mode';
			}
			return {
				isEditMode: !prevState.isEditMode,
				alertText: alertText
			}
		})
	}

	createRoomToggle = () =>
	{
		this.setState((prevState) => 
		{
			return {
				showCreateRoomDialog: !prevState.showCreateRoomDialog
			}
		})
	}

	onRoomChange = (roomID) => 
	{
		if(this.state.roomID != roomID)
		{
			if(this.state.roomID)
			{
				this.socket.emit('leaveRoom', this.state.roomID);
			}
	
			if(roomID)
			{
				this.socket.emit('joinRoom', roomID);	
				console.log("Left room: " + this.state.roomID);
			}
	
			this.setState({roomID: roomID});
			
			console.log("Joined room: " + roomID);
		}
			
	}

	render() {
		return (
			<div className={styles.App}>				
				{this.state.showUserInfo && <UserInfo className={styles.UserInfo} />}

				{this.state.showCreateRoomDialog && 
					<RoomCreateDialog 
						className={styles.MapCreateDialog} 
						socket={this.socket}
						onToggle={this.createRoomToggle}
						mapID={this.state.mapID}
					/>}
				
				<SideBar 
					className={styles.SideBar} 
					toggle="false" 
					onMapModeToggle={this.mapModeChange} 
					onCreateRoomToggle={this.createRoomToggle}
					onChangeMap={this.changeMap}>
						<SideBarCategory title="Server">
							<ServerList className={styles.ServerList} onMapChange={this.changeMap}/>
							<RoomList className={styles.RoomList}/>
						</SideBarCategory>
						<SideBarCategory title="Friends">
							<FriendList className={styles.FriendList}/>
						</SideBarCategory>
				</SideBar>

				<div className={styles.middleBar}>
					<AlertBox className={styles.AlertBox} text={this.state.alertText}/>
					<div className={styles.mapContainer}>
						<Map 
							className={styles.Map} 
							id="Map" 
							socket={this.socket} 
							mapID={this.state.mapID} 
							onRoomChange={this.onRoomChange}
							isEditMode={this.state.isEditMode}
						/>								
					</div>
					
					<div className={styles.chatContainer}>
						<Chat className={styles.Chat} id={styles.privateChat} socket={this.socket} roomName={`map${this.state.mapID}`}/>
						<Chat 
							style={!this.state.roomID ? {display: 'none'} : {}}
							className={styles.Chat} 
							id={styles.publicChat} 
							socket={this.socket} 
							roomName={`room${this.state.roomID}`}
						/>
					
					</div>
				</div>
				
			</div>
		);
	}
}

export default App;