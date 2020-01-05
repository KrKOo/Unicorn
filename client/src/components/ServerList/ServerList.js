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

		if(className == "mapName")
		{
			this.props.onMapChange(e.target.getAttribute("mapID"));
		}
	}

	render() {
		return (
            <div className={`${this.props.className}`}>
				<h3>Server List</h3>
                <ul>
					{this.state.serverList.map(server => {
						return (
							<li key={server.id} mapID={server.id} className="mapName" onClick={this.handleClick}>{server.name}</li>
						);
					})}
				</ul>
            </div>
        )
	}
}

export default ServerList;