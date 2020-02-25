import React, { Component } from "react";
import axios from 'axios';
import styles from './RoomList.module.scss'

class RoomList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			roomList: [],
			highlighted: null
		}

		this.socket = this.props.socket;

	}
	componentDidMount() {
		this.socket.on('roomEdit', (data) => {
			console.log(data);            

			this.setState(prevState => {
				let newRoomList = prevState.roomList;
				if(!data.isDelete)
				{
					if (!newRoomList.some(e => e.id === data.roomID)) {
						newRoomList.push({
							id: data.roomID,
							name: data.roomName
						});
					}
				}
				else
				{
					
				}
				console.log(newRoomList);
				return({roomList:newRoomList});
			});
		});

		this.socket.on('roomManage', (data) => {
            console.log(data);
            this.setState(prevState => {
                let newRoomList = prevState.roomList.map(room => {
                    if(room.id === data.roomID)
                    {
                        room.name = data.name;
                        
                    }
                    return room;
                })
                return({
                    roomList: newRoomList
                })
                
            })
        });
	

		this.getRooms();
	}

	componentDidUpdate(prevProps)
	{
		if(prevProps.mapID !== this.props.mapID)
		{			
			
			this.getRooms();
		}
	} 

	getRooms = () => 
	{
		let self = this;
		axios.get(`/map/getRooms/${this.props.mapID}`)
			.then(function (response) {		
				self.setState({roomList: response.data})
			})
			.catch(function (error) {
				console.log(error);
			})

			
	}
	
	handleClick = (e) => 
	{
		const clickedRoom = e.currentTarget.getAttribute('roomid')
		this.setState(prevState => {
			const highlighted = (prevState.highlighted === clickedRoom) ? undefined : clickedRoom;
			this.props.toggleHighlightedRoom(highlighted);
			return ({
				highlighted: highlighted
			})
		})
		
	} 

	render() {
		console.log("MAP ID: " + this.props.mapID);
		return (
            <div className={`roomList ${this.props.className} ${styles.RoomList}`}>
                <h3>Room List</h3>
				<ul>
					{this.state.roomList.map(room => {
						return (
							<li 
							key={room.id} 
							roomid={room.id} 
							className="mapName" 
							onClick={this.handleClick}
							style={(room.id == this.props.highLightedRoom)?{color: "#16c24f", fontWeight: 800}:{}}
							title={room.name}
							>
								{room.name}
							</li>
						);
					})}
				</ul>
            </div>
        )
	}
}

export default RoomList;