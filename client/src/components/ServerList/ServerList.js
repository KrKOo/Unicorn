import React, { Component } from "react";
import axios from 'axios';

import styles from './ServerList.module.scss'

class ServerList extends Component {

	constructor() {
		super();
		this.state = {
			serverList: []
        }
	}
	componentDidMount() {
		let self = this;
		axios.get("/map")
			.then(function (response) {		
				self.setState({serverList: response.data})
			})
			.catch(function (error) {
				console.log(error);
			})
	}
	
	handleClick = (e) => 
	{
		const {className} = e.target;

		if(className === "mapName")
		{
			this.props.onMapChange(e.target.getAttribute("mapID"), true);
		}
	}

	render() {
		return (
            <div className={`${this.props.className} ${styles.ServerList}`}>
				<h3>Server List</h3>
                <ul>
					{this.state.serverList.map(server => {
						return (
							<li 
								key={server.id} 
								mapid={server.id} 
								className="mapName" 
								onClick={this.handleClick}
								style={(server.id == this.props.mapID)?{color: "#16c24f",fontWeight: 800}:{}}
								title={server.name}
								>
								{server.name}
							</li>
						);
					})}
				</ul>
            </div>
        )
	}
}

export default ServerList;