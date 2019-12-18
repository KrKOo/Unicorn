import React, { Component } from "react";
import axios from 'axios';

import styles from './ServerList.module.scss'

class ServerList extends Component {

	constructor() {
		super();
		this.state = {
			serverList: ['a', 'b']
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

	render() {
		return (
            <div className={`${this.props.className}`}>
				<h3>Server List</h3>
                <ul>
					{this.state.serverList.map(server => {
						return (
							<li>{server.name}</li>
						);
					})}
				</ul>
            </div>
        )
	}
}

export default ServerList;