import React, { Component } from "react";

import styles from './FriendList.module.scss'

class FriendList extends Component {

	constructor() {
		super();
		this.state = {
        }
	}
	componentDidMount() {
		
    }

	render() {
		return (
            <div>
                <ul className={styles.userList}>
					<li>
						<div className={styles.imageContainer}>
							<img src="https://style.anu.edu.au/_anu/4/images/placeholders/person_8x10.png"></img>
						</div>
						<div className={styles.usernameContainer}>
							<p>Bob Smith</p>
						</div>						
					</li>
					<li>
						<div className={styles.imageContainer}>
							<img src="https://style.anu.edu.au/_anu/4/images/placeholders/person_8x10.png"></img>
						</div>
						<div className={styles.usernameContainer}>
							<p>John Carpenter</p>
						</div>						
					</li>
					<li>
						<div className={styles.imageContainer}>
							<img src="https://style.anu.edu.au/_anu/4/images/placeholders/person_8x10.png"></img>
						</div>
						<div className={styles.usernameContainer}>
							<p>Ross Geller</p>
						</div>						
					</li>
				</ul>
            </div>
        )
	}
}

export default FriendList;