import React, { Component } from "react";
import axios from 'axios';
import styles from './FriendList.module.scss'

class FriendList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			friends:[]
        }
	}
	componentDidMount() {
		console.log(this.props.userID)
		this.getFriends();
	}

	componentDidUpdate(prevProps)
	{
		if(prevProps.userID !== this.props.userID)
		{
			this.getFriends();
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
	}

	getFriends = () =>
	{
		const self = this;
		axios.get(`/users/getFriends`)
		.then(function (response) {
			self.setState({friends: response.data}) ;
		})
		.catch(function (error) {
			console.log(error);
		})
	}

	render() {
		console.log(this.props.userID)
		return (
            <div key={this.props.userID}>
                <ul className={styles.userList}>
					{this.state.friends.map((item, i) => {
						return(
						<li key={i} userid={item.userID}>
							<div className={styles.imageContainer}>
								<img src={`/profileImages/${item.profileImg || 'profilePlaceholder.jpg'}`}></img>
							</div>
							<div className={styles.usernameContainer}>
								<p>{item.username}</p>
							</div>						
						</li>)
					})}
				</ul>
            </div>
        )
	}
}

export default FriendList;