import React, { Component } from "react";

import styles from './RoomList.module.scss'

class RoomList extends Component {

	constructor() {
		super();
		this.state = {
        }
	}
	componentDidMount() {
		
    }

	render() {
		return (
            <div className={`roomList ${this.props.className}`}>
                asdf
            </div>
        )
	}
}

export default RoomList;